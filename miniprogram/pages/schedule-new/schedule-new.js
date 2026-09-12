const store = require('../../utils/store')
const auth = require('../../utils/auth')

const TYPES = ['清明', '重阳', '忌日', '自定义']
const RULES = [
  { value: 'yearly', label: '每年' },
  { value: 'once', label: '一次' },
]

Page({
  data: {
    types: TYPES,
    typeIndex: 0,
    date: '2026-04-04',
    graveNames: [],
    graveIndex: 0,
    graveIds: [],
    assignee: '妈妈',
    rules: RULES.map((r) => r.label),
    ruleIndex: 0,
  },
  onLoad() {
    if (!auth.requireFamily()) return
    const family = store.currentFamily()
    const graves = store.familyGraves(family.id)
    this.setData({
      graveNames: ['家庭级（不绑定墓地）'].concat(graves.map((g) => g.name)),
      graveIds: [''].concat(graves.map((g) => g.id)),
      graveIndex: graves[0] ? 1 : 0,
    })
  },
  onType(e) { this.setData({ typeIndex: Number(e.detail.value) }) },
  onDate(e) { this.setData({ date: e.detail.value }) },
  onGrave(e) { this.setData({ graveIndex: Number(e.detail.value) }) },
  onAssignee(e) { this.setData({ assignee: e.detail.value }) },
  onRule(e) { this.setData({ ruleIndex: Number(e.detail.value) }) },
  save() {
    const family = store.currentFamily()
    const type = TYPES[this.data.typeIndex]
    store.saveSchedule({
      familyId: family.id,
      graveId: this.data.graveIds[this.data.graveIndex] || null,
      type: type,
      title: type,
      date: this.data.date,
      rule: RULES[this.data.ruleIndex].value,
      remindDays: [7, 3, 1],
      assignee: this.data.assignee || '未指定',
    })
    wx.navigateBack()
  },
})
