const store = require('../../utils/store')
const auth = require('../../utils/auth')
const share = require('../../utils/share')
const subscribe = require('../../utils/subscribe')
const { formatMD, daysUntil } = require('../../utils/ids')

Page({
  data: {
    familyName: '',
    memberCount: 0,
    dateLabel: '暂无排程',
    nextMeta: '',
    remindLabel: '',
    countdown: '',
    hasNext: false,
    listId: '',
    listTitle: '',
    checked: 0,
    total: 0,
    progress: 0,
    recent: [],
    subscribed: false,
  },
  onShow() {
    if (!auth.requireFamily()) return
    this.refresh()
  },
  refresh() {
    const family = store.currentFamily()
    const members = store.familyMembers(family.id)
    const next = store.nextSchedule(family.id)
    const occ = next && next.nextDate
    const grave = next && next.graveId ? store.getGrave(next.graveId) : null
    const lists = store.familyChecklists(family.id)
    let list = null
    if (next && next.id) list = lists.find((c) => c.scheduleId === next.id) || null
    if (!list && next && next.graveId) list = lists.find((c) => c.graveId === next.graveId) || null
    if (!list) list = lists[0]
    const checked = list ? list.items.filter((i) => i.checked).length : 0
    const total = list ? list.items.length : 0
    const recent = store
      .familyVisits(family.id)
      .slice(0, 4)
      .map((v, idx) => {
        const g = store.getGrave(v.graveId)
        return {
          id: v.id,
          title: v.title || '看望',
          body: v.body,
          dateShort: formatMD(v.date),
          graveShort: g && g.name ? g.name.slice(0, 2) : '',
          motif: idx % 2 === 0 ? 'floral' : 'hills',
          photo: (v.photos && v.photos[0]) || '',
        }
      })
    let dateLabel = '暂无排程'
    let countdown = ''
    if (next && occ) {
      dateLabel = next.type + ' · ' + formatMD(occ)
      const d = daysUntil(occ)
      if (d === 0) countdown = '就是今天'
      else if (d != null && d > 0) countdown = '还有 ' + d + ' 天'
    }
    const remindFirst =
      next && next.remindDays && next.remindDays.length
        ? Math.max.apply(null, next.remindDays)
        : null
    this.setData({
      familyName: family.name,
      memberCount: members.length,
      dateLabel: dateLabel,
      nextMeta: next
        ? (grave ? grave.name : '家庭') + ' · 负责人 ' + (next.assignee || '—')
        : '先建一条排程，清明前轻轻提醒',
      remindLabel: remindFirst != null ? '提前 ' + remindFirst + ' 天' : '',
      countdown: countdown,
      hasNext: !!next,
      listId: list ? list.id : '',
      listTitle: list
        ? list.title.replace(/\d{4}\s*/, '').replace('清单', '物资')
        : '',
      checked: checked,
      total: total,
      progress: total ? Math.round((checked / total) * 100) : 0,
      recent: recent,
      subscribed: subscribe.isOptedIn(),
    })
  },
  goMe() {
    wx.switchTab({ url: '/pages/me/me' })
  },
  goMembers() {
    wx.navigateTo({ url: '/pages/members/members' })
  },
  goSchedules() {
    wx.navigateTo({ url: '/pages/schedules/schedules' })
  },
  goVisitNew() {
    wx.navigateTo({ url: '/pages/visit-new/visit-new' })
  },
  goChecklist() {
    if (!this.data.listId) return
    wx.navigateTo({ url: '/pages/checklist/checklist?id=' + this.data.listId })
  },
  goVisit(e) {
    wx.navigateTo({
      url: '/pages/visit-detail/visit-detail?id=' + e.currentTarget.dataset.id,
    })
  },
  onShareAppMessage() {
    return share.familyShareCard()
  },
  onShareTimeline() {
    return share.timelineShare(share.familyShareCard())
  },
})
