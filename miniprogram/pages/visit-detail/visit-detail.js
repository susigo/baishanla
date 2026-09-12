const store = require('../../utils/store')
const auth = require('../../utils/auth')
const share = require('../../utils/share')
const { formatMD } = require('../../utils/ids')

Page({
  data: {
    missing: false,
    visit: { photos: [] },
    meta: '',
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
    const visit = this.id ? store.getVisit(this.id) : null
    if (!visit) {
      this.setData({ missing: true })
      return
    }
    const family = store.currentFamily()
    const grave = store.getGrave(visit.graveId)
    this.setData({
      missing: false,
      visit: visit,
      meta:
        formatMD(visit.date) +
        ' · ' +
        ((grave && grave.name) || '') +
        ' · ' +
        (visit.authorName || ''),
      canEdit: store.canEditFamily(family.id),
    })
  },
  preview(e) {
    const src = e.currentTarget.dataset.src
    wx.previewImage({ current: src, urls: this.data.visit.photos || [] })
  },
  edit() {
    if (!this.data.canEdit) return
    wx.navigateTo({ url: '/pages/visit-new/visit-new?id=' + this.data.visit.id })
  },
  remove() {
    if (!this.data.canEdit) {
      wx.showToast({ title: '当前角色仅可查看', icon: 'none' })
      return
    }
    wx.showModal({
      title: '删除这条记录？',
      content: '删除后家人将看不见。此操作不可恢复。',
      confirmColor: '#C45C5C',
      success: (res) => {
        if (!res.confirm) return
        store.deleteVisit(this.data.visit.id)
        wx.showToast({ title: '已删除', icon: 'success' })
        setTimeout(() => wx.navigateBack({ fail: () => wx.switchTab({ url: '/pages/visits/visits' }) }), 400)
      },
    })
  },
  onShareAppMessage() {
    const v = this.data.visit || {}
    const family = store.currentFamily()
    const name = (family && family.name) || '拜山啦'
    return share.familyShareCard({
      title: v.title ? '来' + name + '看「' + v.title + '」' : undefined,
    })
  },
  onShareTimeline() {
    return share.timelineShare(this.onShareAppMessage())
  },
})
