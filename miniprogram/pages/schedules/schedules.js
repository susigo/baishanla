const store = require('../../utils/store')
const auth = require('../../utils/auth')
const subscribe = require('../../utils/subscribe')
const { nextOccurrence, formatMD, daysUntil } = require('../../utils/ids')

Page({
  data: {
    schedules: [],
    subscribed: false,
    sheetVisible: false,
    canEdit: false,
  },
  onShow() {
    if (!auth.requireFamily()) return
    this.refresh()
  },
  refresh() {
    const family = store.currentFamily()
    const schedules = store
      .familySchedules(family.id)
      .map((s) => {
        const g = s.graveId ? store.getGrave(s.graveId) : null
        const occ = nextOccurrence(s)
        const d = occ != null ? daysUntil(occ) : null
        return Object.assign({}, s, {
          nextDate: occ,
          nextLabel: occ ? formatMD(occ) : '已过期',
          countdown: d == null ? '' : d === 0 ? '今天' : d > 0 ? '还有 ' + d + ' 天' : '已过 ' + Math.abs(d) + ' 天',
          meta: (g ? g.name : '家庭级') + ' · 负责人 ' + s.assignee,
          ruleLabel: s.rule === 'yearly' ? '每年' : '一次',
          remindChips: (s.remindDays || []).map((x) => '提前 ' + x + ' 天'),
        })
      })
      .sort((a, b) => {
        if (!a.nextDate && !b.nextDate) return 0
        if (!a.nextDate) return 1
        if (!b.nextDate) return -1
        return a.nextDate.localeCompare(b.nextDate)
      })
    this.setData({
      schedules: schedules,
      subscribed: subscribe.isOptedIn(),
      canEdit: store.canEditFamily(family.id),
    })
  },
  goNew() {
    if (!this.data.canEdit) {
      wx.showToast({ title: '当前角色仅可查看', icon: 'none' })
      return
    }
    wx.navigateTo({ url: '/pages/schedule-new/schedule-new' })
  },
  remove(e) {
    if (!this.data.canEdit) return
    const id = e.currentTarget.dataset.id
    wx.showModal({
      title: '删除这条排程？',
      success: (res) => {
        if (!res.confirm) return
        store.deleteSchedule(id)
        this.refresh()
      },
    })
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
