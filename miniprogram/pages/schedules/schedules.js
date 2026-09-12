const store = require('../../utils/store')
const auth = require('../../utils/auth')
const subscribe = require('../../utils/subscribe')

Page({
  data: {
    schedules: [],
    subscribed: false,
    sheetVisible: false,
  },
  onShow() {
    if (!auth.requireFamily()) return
    this.refresh()
  },
  refresh() {
    const family = store.currentFamily()
    const schedules = store.familySchedules(family.id).map((s) => {
      const g = s.graveId ? store.getGrave(s.graveId) : null
      return Object.assign({}, s, {
        meta: (g ? g.name : '家庭级') + ' · 负责人 ' + s.assignee,
        ruleLabel: s.rule === 'yearly' ? '每年' : '一次',
        remindChips: (s.remindDays || []).map((d) => '提前 ' + d + ' 天'),
      })
    })
    this.setData({
      schedules: schedules,
      subscribed: subscribe.isOptedIn(),
    })
  },
  goNew() {
    wx.navigateTo({ url: '/pages/schedule-new/schedule-new' })
  },
  optIn() {
    subscribe.requestQingmingRemind().then((r) => {
      this.setData({
        subscribed: subscribe.isOptedIn(),
        sheetVisible: !!r.demo,
      })
      if (!r.demo && r.accepted) {
        wx.showToast({ title: '已开启清明提醒', icon: 'success' })
      }
    })
  },
  closeSheet() {
    this.setData({ sheetVisible: false })
  },
  noop() {},
})
