const store = require('../../utils/store')
const auth = require('../../utils/auth')
const { formatMD } = require('../../utils/ids')
const marketing = require('../../utils/marketing')

function captionOf(item) {
  const bits = ['×' + item.qty + (item.unit ? ' ' + item.unit : '')]
  if (item.required) bits.push('必备')
  if (item.checked && item.checkedBy) {
    const when = item.checkedAt ? formatMD(item.checkedAt) : ''
    bits.push(when ? item.checkedBy + ' · ' + when : item.checkedBy + ' 已勾')
  }
  return bits.join(' · ')
}

Page({
  data: {
    missing: false,
    editing: false,
    list: { items: [] },
    meta: '',
    checked: 0,
    total: 0,
    progress: 0,
    canEdit: false,
    templates: [],
    empty: marketing.emptyState('checklist'),
  },
  onLoad(q) {
    this.id = q.id
  },
  onShow() {
    if (!auth.requireFamily()) return
    this.refresh()
  },
  refresh() {
    const family = store.currentFamily()
    const list = this.id ? store.getChecklist(this.id) : null
    if (!list || !store.belongsToFamily(list, family.id)) {
      this.setData({ missing: true, templates: store.familyTemplates(family.id) })
      return
    }
    const grave = list.graveId ? store.getGrave(list.graveId) : null
    const items = (list.items || []).map((i) => Object.assign({}, i, { caption: captionOf(i) }))
    const checked = items.filter((i) => i.checked).length
    const total = items.length
    this.setData({
      missing: false,
      list: Object.assign({}, list, { items: items }),
      meta:
        (list.fromTemplate ? '来自模板' : '本次') +
        ' · ' +
        ((grave && grave.name) || '家庭'),
      checked: checked,
      total: total,
      progress: total ? Math.round((checked / total) * 100) : 0,
      canEdit: store.canEditFamily(family.id),
      templates: store.familyTemplates(family.id),
    })
  },
  toggleEdit() {
    if (!this.data.canEdit) {
      wx.showToast({ title: '当前角色仅可查看', icon: 'none' })
      return
    }
    this.setData({ editing: !this.data.editing })
  },
  toggleItem(e) {
    if (!this.data.canEdit) {
      wx.showToast({ title: '当前角色仅可查看', icon: 'none' })
      return
    }
    const user = store.currentUser()
    store.toggleChecklistItem(this.data.list.id, e.currentTarget.dataset.id, user.nickname)
    this.refresh()
  },
  onItemName(e) {
    const id = e.currentTarget.dataset.id
    store.updateChecklistItem(this.data.list.id, id, { name: e.detail.value })
  },
  onItemQty(e) {
    const id = e.currentTarget.dataset.id
    const qty = Math.max(1, Number(e.detail.value) || 1)
    store.updateChecklistItem(this.data.list.id, id, { qty: qty })
  },
  toggleRequired(e) {
    const id = e.currentTarget.dataset.id
    const item = this.data.list.items.find((i) => i.id === id)
    if (!item) return
    store.updateChecklistItem(this.data.list.id, id, { required: !item.required })
    this.refresh()
  },
  addItem() {
    if (!this.data.canEdit) return
    wx.showModal({
      title: '添加物品',
      editable: true,
      placeholderText: '如：水果',
      success: (res) => {
        if (!res.confirm) return
        const name = (res.content || '').trim() || '新物品'
        store.addChecklistItem(this.data.list.id, { name: name, qty: 1 })
        this.refresh()
      },
    })
  },
  deleteItem(e) {
    const id = e.currentTarget.dataset.id
    const item = this.data.list.items.find((i) => i.id === id)
    wx.showModal({
      title: '删除「' + ((item && item.name) || '该项') + '」？',
      success: (res) => {
        if (!res.confirm) return
        store.deleteChecklistItem(this.data.list.id, id)
        this.refresh()
      },
    })
  },
  reset() {
    if (!this.data.canEdit) return
    wx.showModal({
      title: '从模板重置？',
      content: '勾选状态会清空，物品恢复为模板内容。',
      success: (res) => {
        if (!res.confirm) return
        store.resetChecklistFromTemplate(this.data.list.id)
        this.setData({ editing: false })
        this.refresh()
      },
    })
  },
  cloneNew() {
    if (!this.data.canEdit) return
    const family = store.currentFamily()
    const tmpls = store.familyTemplates(family.id)
    if (!tmpls.length) {
      wx.showToast({ title: '暂无模板', icon: 'none' })
      return
    }
    const list = store.cloneTemplateToChecklist({
      familyId: family.id,
      graveId: this.data.list.graveId,
      scheduleId: this.data.list.scheduleId,
      templateId: tmpls[0].id,
      type: '物资',
    })
    if (list) {
      wx.redirectTo({ url: '/pages/checklist/checklist?id=' + list.id })
    }
  },
  createFromTemplate() {
    const family = store.currentFamily()
    const tmpls = this.data.templates
    if (!tmpls.length) {
      wx.showToast({ title: '暂无模板', icon: 'none' })
      return
    }
    const list = store.cloneTemplateToChecklist({
      familyId: family.id,
      templateId: tmpls[0].id,
      type: '物资',
    })
    if (list) {
      this.id = list.id
      this.refresh()
    }
  },
})
