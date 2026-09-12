const store = require('../../utils/store')
const auth = require('../../utils/auth')
const { todayISO } = require('../../utils/ids')

const TYPES = ['清明', '重阳', '忌日', '自定义']
const RULES = [
  { value: 'yearly', label: '每年' },
  { value: 'once', label: '一次' },
]
const REMIND_OPTIONS = [14, 7, 3, 1]

Page({
  data: {
    types: TYPES,
    typeIndex: 0,
    customTitle: '',
    date: '2027-04-05',
    graveNames: [],
    graveIndex: 0,
    graveIds: [],
    assignee: '',
    members: [],
    rules: RULES.map((r) => r.label),
    ruleIndex: 0,
    remindOptions: REMIND_OPTIONS,
    remindSelected: { 7: true, 3: true, 1: true },
    remindChips: [
      { d: 14, on: false },
      { d: 7, on: true },
      { d: 3, on: true },
      { d: 1, on: true },
    ],
    cloneList: true,
  },
  onLoad(q) {
    if (!auth.requireFamily()) return
    const family = store.currentFamily()
    const graves = store.familyGraves(family.id)
    const members = store.familyMembers(family.id)
    let graveIndex = graves[0] ? 1 : 0
    if (q && q.graveId) {
      const idx = graves.findIndex((g) => g.id === q.graveId)
      if (idx >= 0) graveIndex = idx + 1
    }
    const user = store.currentUser()
    // default next Qingming-ish if spring, else today+30 display
    const y = Number(todayISO().slice(0, 4))
    let qingming = y + '-04-04'
    if (qingming < todayISO()) qingming = y + 1 + '-04-04'
    this.setData({
      date: qingming,
      graveNames: ['家庭级（不绑定墓地）'].concat(graves.map((g) => g.name)),
      graveIds: [''].concat(graves.map((g) => g.id)),
      graveIndex: graveIndex,
      members: members.map((m) => m.nickname),
      assignee: (user && user.nickname) || (members[0] && members[0].nickname) || '',
    })
  },
  onType(e) {
    const typeIndex = Number(e.detail.value)
    const type = TYPES[typeIndex]
    const y = Number(todayISO().slice(0, 4))
    const patch = { typeIndex: typeIndex }
    if (type === '清明') {
      let d = y + '-04-04'
      if (d < todayISO()) d = y + 1 + '-04-04'
      patch.date = d
      patch.ruleIndex = 0
    } else if (type === '重阳') {
      let d = y + '-10-11'
      if (d < todayISO()) d = y + 1 + '-10-11'
      patch.date = d
      patch.ruleIndex = 0
    } else if (type === '忌日') {
      patch.ruleIndex = 0
    }
    this.setData(patch)
  },
  onCustom(e) {
    this.setData({ customTitle: e.detail.value })
  },
  onDate(e) {
    this.setData({ date: e.detail.value })
  },
  onGrave(e) {
    this.setData({ graveIndex: Number(e.detail.value) })
  },
  onAssigneePick(e) {
    const idx = Number(e.detail.value)
    this.setData({ assignee: this.data.members[idx] || '' })
  },
  onAssignee(e) {
    this.setData({ assignee: e.detail.value })
  },
  onRule(e) {
    this.setData({ ruleIndex: Number(e.detail.value) })
  },
  toggleRemind(e) {
    const d = Number(e.currentTarget.dataset.d)
    const chips = this.data.remindChips.map((c) =>
      c.d === d ? Object.assign({}, c, { on: !c.on }) : c,
    )
    this.setData({ remindChips: chips })
  },
  toggleClone() {
    this.setData({ cloneList: !this.data.cloneList })
  },
  save() {
    const family = store.currentFamily()
    if (!store.canEditFamily(family.id)) {
      wx.showToast({ title: '当前角色仅可查看', icon: 'none' })
      return
    }
    const type = TYPES[this.data.typeIndex]
    const title =
      type === '自定义'
        ? this.data.customTitle.trim() || '自定义'
        : type
    const remindDays = this.data.remindChips.filter((c) => c.on).map((c) => c.d).sort((a, b) => b - a)
    if (!remindDays.length) {
      wx.showToast({ title: '请至少选一个提醒日', icon: 'none' })
      return
    }
    const graveId = this.data.graveIds[this.data.graveIndex] || null
    const schedule = store.saveSchedule({
      familyId: family.id,
      graveId: graveId,
      type: type === '自定义' ? title : type,
      title: title,
      date: this.data.date,
      rule: RULES[this.data.ruleIndex].value,
      remindDays: remindDays,
      assignee: this.data.assignee || '未指定',
    })
    if (this.data.cloneList) {
      const tmpls = store.familyTemplates(family.id)
      if (tmpls[0]) {
        store.cloneTemplateToChecklist({
          familyId: family.id,
          graveId: graveId,
          scheduleId: schedule.id,
          templateId: tmpls[0].id,
          year: this.data.date.slice(0, 4),
          type: title,
        })
      }
    }
    wx.showToast({ title: '已保存', icon: 'success' })
    setTimeout(() => wx.navigateBack(), 350)
  },
})
