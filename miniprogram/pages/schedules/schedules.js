const store = require('../../utils/store')
const auth = require('../../utils/auth')

Page({
  data: { schedules: [] },
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
    this.setData({ schedules: schedules })
  },
  goNew() {
    wx.navigateTo({ url: '/pages/schedule-new/schedule-new' })
  },
  stubSubscribe() {
    wx.showModal({
      title: '订阅提醒（占位）',
      content: '未接真实订阅消息模板。正式版需在公众平台配置模板 ID 后调用 wx.requestSubscribeMessage。',
      showCancel: false,
    })
  },
})
