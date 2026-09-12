const store = require('../../utils/store')
const auth = require('../../utils/auth')

Page({
  data: {
    mode: 'new',
    name: '',
    memorialFor: '',
    address: '',
    note: '',
    lat: '30.2741',
    lng: '120.1551',
  },
  onLoad(q) {
    this.mode = q.mode || 'new'
    this.id = q.id
    wx.setNavigationBarTitle({ title: this.mode === 'new' ? '新建墓地' : '编辑墓地' })
    if (this.mode === 'edit' && this.id) {
      const g = store.getGrave(this.id)
      if (g) {
        this.setData({
          mode: 'edit',
          name: g.name,
          memorialFor: g.memorialFor,
          address: g.address,
          note: g.note,
          lat: g.lat != null ? String(g.lat) : '',
          lng: g.lng != null ? String(g.lng) : '',
        })
        this.coverLabel = g.coverLabel
      }
    }
  },
  onShow() {
    auth.requireFamily()
  },
  onName(e) { this.setData({ name: e.detail.value }) },
  onMemorial(e) { this.setData({ memorialFor: e.detail.value }) },
  onAddress(e) { this.setData({ address: e.detail.value }) },
  onNote(e) { this.setData({ note: e.detail.value }) },
  onLat(e) { this.setData({ lat: e.detail.value }) },
  onLng(e) { this.setData({ lng: e.detail.value }) },
  save() {
    if (!this.data.name.trim()) {
      wx.showToast({ title: '请填写名称', icon: 'none' })
      return
    }
    const family = store.currentFamily()
    const g = store.saveGrave({
      id: this.id,
      familyId: family.id,
      name: this.data.name.trim(),
      memorialFor: this.data.memorialFor.trim(),
      address: this.data.address.trim(),
      note: this.data.note.trim(),
      lat: this.data.lat ? Number(this.data.lat) : null,
      lng: this.data.lng ? Number(this.data.lng) : null,
      coverLabel: this.coverLabel || '春山封面',
    })
    wx.redirectTo({ url: '/pages/grave-detail/grave-detail?id=' + g.id })
  },
})
