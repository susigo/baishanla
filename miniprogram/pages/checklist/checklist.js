const store = require('../../utils/store')
const auth = require('../../utils/auth')
const { uid, formatMD } = require('../../utils/ids')

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
  },
  onLoad(q) {
    this.id = q.id
  },
  onShow() {
    if (!auth.requireFamily()) return
    this.refresh()
  },
  refresh() {
    const list = this.id ? store.getChecklist(this.id) : null
    if (!list) {
      this.setData({ missing: true })
      return
    }
    const grave = list.graveId ? store.getGrave(list.graveId) : null
    const items = (list.items || []).map((i) => Object.assign({}, i, { caption: captionOf(i) }))
    this.setData({
      missing: false,
      list: Object.assign({}, list, { items: items }),
      meta: (list.fromTemplate ? '来自模板' : '本次') + ' · ' + ((grave && grave.name) || '家庭'),
    })
  },
  toggleEdit() {
    this.setData({ editing: !this.data.editing })
  },
  toggleItem(e) {
    const user = store.currentUser()
    store.toggleChecklistItem(this.data.list.id, e.currentTarget.dataset.id, user.nickname)
    this.refresh()
  },
  onItemName(e) {
    const id = e.currentTarget.dataset.id
    const name = e.detail.value
    const items = this.data.list.items.map((i) =>
      i.id === id ? Object.assign({}, i, { name: name }) : i,
    )
    store.updateChecklistItems(this.data.list.id, items)
    this.refresh()
  },
  addItem() {
    const items = this.data.list.items.concat([
      { id: uid('i'), name: '新物品', qty: 1, unit: '', required: false, checked: false },
    ])
    store.updateChecklistItems(this.data.list.id, items)
    this.refresh()
  },
  reset() {
    store.resetChecklistFromTemplate(this.data.list.id)
    this.refresh()
  },
})
