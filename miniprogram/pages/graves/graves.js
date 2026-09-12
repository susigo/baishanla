const store = require('../../utils/store')
const auth = require('../../utils/auth')
const { nextOccurrence, formatMD } = require('../../utils/ids')
const marketing = require('../../utils/marketing')

Page({
  data: { graves: [], canEdit: false, empty: marketing.emptyState('graves') },
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
    this.setData({ graves: graves, canEdit: store.canEditFamily(family.id) })
  },
  goNew() {
    if (!this.data.canEdit) {
      wx.showToast({ title: '当前角色仅可查看', icon: 'none' })
      return
    }
    wx.navigateTo({ url: '/pages/grave-edit/grave-edit?mode=new' })
  },
  goDetail(e) {
    wx.navigateTo({ url: '/pages/grave-detail/grave-detail?id=' + e.currentTarget.dataset.id })
  },
})
