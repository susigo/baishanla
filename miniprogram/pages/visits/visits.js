const store = require('../../utils/store')
const auth = require('../../utils/auth')
const { formatMD } = require('../../utils/ids')
const marketing = require('../../utils/marketing')

const MOTIFS = ['floral', 'hills', 'sage', 'blush']

Page({
  data: { groups: [], total: 0, empty: marketing.emptyState('visits') },
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
        dateShort: formatMD(v.date),
        line: (g ? g.name : '') + (v.body ? ' · ' + v.body : ''),
        motif: MOTIFS[i % MOTIFS.length],
        photo: (v.photos && v.photos[0]) || '',
        photoCount: (v.photos && v.photos.length) || 0,
        author: v.authorName || '',
      })
    })
    const groups = Object.keys(byYear)
      .sort((a, b) => b.localeCompare(a))
      .map((year) => ({ year: year, items: byYear[year], count: byYear[year].length }))
    this.setData({ groups: groups, total: visits.length })
  },
  goNew() {
    wx.navigateTo({ url: '/pages/visit-new/visit-new' })
  },
  goDetail(e) {
    wx.navigateTo({ url: '/pages/visit-detail/visit-detail?id=' + e.currentTarget.dataset.id })
  },
})
