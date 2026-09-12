const store = require('../../utils/store')
const auth = require('../../utils/auth')
const share = require('../../utils/share')
const subscribe = require('../../utils/subscribe')

Page({
  data: {
    familyName: '',
    memberCount: 0,
    dateLabel: '暂无排程',
    nextMeta: '',
    remindLabel: '',
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
    const grave = next && next.graveId ? store.getGrave(next.graveId) : null
    const lists = store.familyChecklists(family.id)
    const list = lists[0]
    const checked = list ? list.items.filter((i) => i.checked).length : 0
    const total = list ? list.items.length : 0
    const recent = store.familyVisits(family.id).slice(0, 3).map((v, idx) => {
      const g = store.getGrave(v.graveId)
      return {
        id: v.id,
        title: v.title || '看望',
        body: v.body,
        graveShort: g && g.name ? g.name.slice(0, 2) : '',
        motif: idx % 2 === 0 ? 'floral' : 'hills',
      }
    })
    let dateLabel = '暂无排程'
    if (next) {
      dateLabel =
        next.type +
        ' · ' +
        Number(next.date.slice(5, 7)) +
        '月' +
        Number(next.date.slice(8, 10)) +
        '日'
    }
    this.setData({
      familyName: family.name,
      memberCount: members.length,
      dateLabel: dateLabel,
      nextMeta: (grave ? grave.name : '家庭') + ' · 负责人 ' + ((next && next.assignee) || '—'),
      remindLabel: next && next.remindDays && next.remindDays[0] != null ? '提前 ' + next.remindDays[0] + ' 天' : '',
      listId: list ? list.id : '',
      listTitle: list ? list.title.replace('2026 ', '').replace('清单', '物资') : '',
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
    wx.navigateTo({ url: '/pages/visit-detail/visit-detail?id=' + e.currentTarget.dataset.id })
  },
  onShareAppMessage() {
    return share.familyShareCard()
  },
  onShareTimeline() {
    return share.timelineShare(share.familyShareCard())
  },
})
