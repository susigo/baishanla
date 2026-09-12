const store = require('../../utils/store')
const auth = require('../../utils/auth')
const { nextOccurrence, formatMD } = require('../../utils/ids')

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
      const related = schedules
        .map((s) => {
          if (s.graveId && s.graveId !== g.id) return null
          const occ = nextOccurrence(s)
          return occ ? Object.assign({}, s, { nextDate: occ }) : null
        })
        .filter(Boolean)
        .sort((a, b) => a.nextDate.localeCompare(b.nextDate))
      const next = related.find((s) => s.graveId === g.id) || related[0]
      return Object.assign({}, g, {
        variant: i,
        nextLabel: next ? '下次 · ' + next.type + ' ' + formatMD(next.nextDate) : '',
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
