const store = require('../../utils/store')
const auth = require('../../utils/auth')

const MOTIFS = ['floral', 'hills', 'sage', 'blush']

Page({
  data: { groups: [] },
  onShow() {
    if (!auth.requireFamily()) return
    this.refresh()
  },
  refresh() {
    const family = store.currentFamily()
    const visits = store.familyVisits(family.id)
    const byYear = {}
    visits.forEach((v, i) => {
      const y = v.date.slice(0, 4)
      if (!byYear[y]) byYear[y] = []
      const g = store.getGrave(v.graveId)
      byYear[y].push({
        id: v.id,
        title: v.title || '看望',
        dateShort: v.date.slice(5),
        line: (g ? g.name : '') + ' · ' + (v.body || '无正文'),
        motif: MOTIFS[i % MOTIFS.length],
      })
    })
    const groups = Object.keys(byYear)
      .sort((a, b) => b.localeCompare(a))
      .map((year) => ({ year: year, items: byYear[year] }))
    this.setData({ groups: groups })
  },
  goNew() {
    wx.navigateTo({ url: '/pages/visit-new/visit-new' })
  },
  goDetail(e) {
    wx.navigateTo({ url: '/pages/visit-detail/visit-detail?id=' + e.currentTarget.dataset.id })
  },
})
