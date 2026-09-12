const store = require('../../utils/store')
const auth = require('../../utils/auth')

Page({
  data: { graves: [] },
  onShow() {
    if (!auth.requireFamily()) return
    this.refresh()
  },
  refresh() {
    const family = store.currentFamily()
    const schedules = store.familySchedules(family.id)
    const graves = store.familyGraves(family.id).map((g, i) => {
      const next = schedules.find((s) => s.graveId === g.id)
      return Object.assign({}, g, {
        variant: i,
        nextLabel: next ? '下次 · ' + next.type + ' ' + next.date : '',
      })
    })
    this.setData({ graves: graves })
  },
  goNew() {
    wx.navigateTo({ url: '/pages/grave-edit/grave-edit?mode=new' })
  },
  goDetail(e) {
    wx.navigateTo({ url: '/pages/grave-detail/grave-detail?id=' + e.currentTarget.dataset.id })
  },
})
