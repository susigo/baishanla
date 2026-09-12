const store = require('../../utils/store')
const auth = require('../../utils/auth')
const share = require('../../utils/share')

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
