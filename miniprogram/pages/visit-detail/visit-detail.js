const store = require('../../utils/store')
const auth = require('../../utils/auth')

Page({
  data: { missing: false, visit: {}, meta: '' },
  onLoad(q) {
    this.id = q.id
  },
  onShow() {
    if (!auth.requireFamily()) return
    const visit = this.id ? store.getVisit(this.id) : null
    if (!visit) {
      this.setData({ missing: true })
      return
    }
    const grave = store.getGrave(visit.graveId)
    this.setData({
      missing: false,
      visit: visit,
      meta: visit.date + ' · ' + ((grave && grave.name) || '') + ' · ' + visit.authorName,
    })
  },
})
