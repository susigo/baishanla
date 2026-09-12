const store = require('../../utils/store')
const auth = require('../../utils/auth')
const share = require('../../utils/share')

Page({
  data: {
    missing: false,
    grave: {},
    noteShort: '',
    recentLabel: '',
    locLabel: '',
    listId: '',
    schedules: [],
  },
  onLoad(q) {
    this.id = q.id
  },
  onShow() {
    if (!auth.requireFamily()) return
    this.refresh()
  },
  refresh() {
    const grave = this.id ? store.getGrave(this.id) : null
    if (!grave) {
      this.setData({ missing: true })
      return
    }
    const visits = store.familyVisits(grave.familyId).filter((v) => v.graveId === grave.id)
    const schedules = store.familySchedules(grave.familyId).filter((s) => s.graveId === grave.id)
    const lists = store.familyChecklists(grave.familyId).filter((c) => c.graveId === grave.id)
    const recentLabel = visits.slice(0, 2).map((v) => v.title).join(' · ')
    this.setData({
      missing: false,
      grave: grave,
      noteShort: grave.note ? grave.note.slice(0, 24) : '',
      recentLabel: recentLabel || '暂无记录',
      locLabel: grave.lat != null ? '定位已保存 · 打开地图可微调' : '尚未定位 · 编辑时可添加',
      listId: lists[0] ? lists[0].id : '',
      schedules: schedules,
    })
  },
  goEdit() {
    wx.navigateTo({ url: '/pages/grave-edit/grave-edit?mode=edit&id=' + this.data.grave.id })
  },
  navigate() {
    const g = this.data.grave
    if (g.lat == null || g.lng == null) {
      wx.showToast({ title: '尚未定位', icon: 'none' })
      return
    }
    wx.openLocation({
      latitude: Number(g.lat),
      longitude: Number(g.lng),
      name: g.name,
      address: g.address || '',
      scale: 16,
    })
  },
  goVisitNew() {
    wx.navigateTo({ url: '/pages/visit-new/visit-new?graveId=' + this.data.grave.id })
  },
  goChecklist() {
    if (this.data.listId) {
      wx.navigateTo({ url: '/pages/checklist/checklist?id=' + this.data.listId })
    } else {
      wx.navigateTo({ url: '/pages/schedules/schedules' })
    }
  },
  goSchedules() {
    wx.navigateTo({ url: '/pages/schedules/schedules' })
  },
  moreActions() {
    wx.showActionSheet({
      itemList: ['排程', '编辑墓地'],
      success: (res) => {
        if (res.tapIndex === 0) this.goSchedules()
        if (res.tapIndex === 1) this.goEdit()
      },
    })
  },
  onShareAppMessage() {
    const g = this.data.grave || {}
    return share.familyShareCard({
      title: g.name ? '来看看「' + g.name + '」' : undefined,
    })
  },
  onShareTimeline() {
    return share.timelineShare(this.onShareAppMessage())
  },
})
