const store = require('../../utils/store')
const auth = require('../../utils/auth')
const share = require('../../utils/share')
const { formatMD } = require('../../utils/ids')

Page({
  data: {
    missing: false,
    grave: {},
    noteShort: '',
    addressLine: '',
    recentLabel: '',
    recentItems: [],
    locLabel: '',
    listId: '',
    schedules: [],
    canEdit: false,
  },
  onLoad(q) {
    this.id = q.id
  },
  onShow() {
    if (!auth.requireFamily()) return
    this.refresh()
  },
  refresh() {
    const family = store.currentFamily()
    const grave = this.id ? store.getGrave(this.id) : null
    if (!grave || !store.belongsToFamily(grave, family.id)) {
      this.setData({ missing: true })
      return
    }
    const visits = store.familyVisits(family.id).filter((v) => v.graveId === grave.id)
    const schedules = store.familySchedules(family.id).filter((s) => s.graveId === grave.id)
    const lists = store.familyChecklists(family.id).filter((c) => c.graveId === grave.id)
    const recentItems = visits.slice(0, 3).map((v) => ({
      id: v.id,
      title: v.title || '看望',
      dateShort: formatMD(v.date),
    }))
    const recentLabel = recentItems.map((v) => v.title).join(' · ')
    this.setData({
      missing: false,
      grave: grave,
      noteShort: grave.note ? grave.note.slice(0, 28) : '可写走哪条路、哪座碑',
      addressLine: grave.address || '',
      recentLabel: recentLabel || '暂无记录',
      recentItems: recentItems,
      locLabel: grave.lat != null ? '定位已保存 · 打开地图可微调' : '尚未定位 · 编辑时可添加',
      listId: lists[0] ? lists[0].id : '',
      schedules: schedules.map((s) =>
        Object.assign({}, s, {
          line: s.type + ' · ' + s.date + ' · ' + (s.assignee || ''),
        }),
      ),
      canEdit: store.canEditFamily(family.id),
    })
  },
  goEdit() {
    if (!this.data.canEdit) {
      wx.showToast({ title: '当前角色仅可查看', icon: 'none' })
      return
    }
    wx.navigateTo({ url: '/pages/grave-edit/grave-edit?mode=edit&id=' + this.data.grave.id })
  },
  navigate() {
    const g = this.data.grave
    if (g.lat == null || g.lng == null) {
      wx.showModal({
        title: '尚未定位',
        content: '先去编辑页用「选择位置」保存坐标，再回来导航。',
        confirmText: '去编辑',
        success: (res) => {
          if (res.confirm) this.goEdit()
        },
      })
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
      return
    }
    // clone template → instance for this grave
    const family = store.currentFamily()
    const tmpls = store.familyTemplates(family.id)
    if (!tmpls.length) {
      wx.showToast({ title: '暂无模板', icon: 'none' })
      return
    }
    wx.showModal({
      title: '生成物资清单',
      content: '从「' + tmpls[0].name + '」克隆一份到本墓地？',
      success: (res) => {
        if (!res.confirm) return
        const list = store.cloneTemplateToChecklist({
          familyId: family.id,
          graveId: this.data.grave.id,
          templateId: tmpls[0].id,
          type: '物资',
        })
        if (list) {
          wx.navigateTo({ url: '/pages/checklist/checklist?id=' + list.id })
        }
      },
    })
  },
  goSchedules() {
    wx.navigateTo({ url: '/pages/schedules/schedules' })
  },
  goVisit(e) {
    wx.navigateTo({
      url: '/pages/visit-detail/visit-detail?id=' + e.currentTarget.dataset.id,
    })
  },
  moreActions() {
    if (!this.data.canEdit) {
      wx.showToast({ title: '当前角色仅可查看', icon: 'none' })
      return
    }
    wx.showActionSheet({
      itemList: ['编辑墓地', '新建排程'],
      success: (res) => {
        if (res.tapIndex === 0) this.goEdit()
        if (res.tapIndex === 1) {
          wx.navigateTo({ url: '/pages/schedule-new/schedule-new?graveId=' + this.data.grave.id })
        }
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
