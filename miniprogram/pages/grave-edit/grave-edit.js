const store = require('../../utils/store')
const auth = require('../../utils/auth')

Page({
  data: {
    mode: 'new',
    name: '',
    memorialFor: '',
    address: '',
    note: '',
    lat: null,
    lng: null,
    locLabel: '点击选择位置（真机调起地图）',
    hasLoc: false,
    coverPath: '',
    coverMotif: 'sage',
    coverLabel: '春山封面',
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
          memorialFor: g.memorialFor || '',
          address: g.address || '',
          note: g.note || '',
          lat: g.lat != null ? g.lat : null,
          lng: g.lng != null ? g.lng : null,
          hasLoc: g.lat != null && g.lng != null,
          locLabel:
            g.lat != null
              ? (g.address || '已选位置') + '\n' + Number(g.lat).toFixed(5) + ', ' + Number(g.lng).toFixed(5)
              : '点击选择位置（真机调起地图）',
          coverPath: g.coverPath || '',
          coverMotif: g.coverMotif || 'sage',
          coverLabel: g.coverLabel || '春山封面',
        })
      }
    }
  },
  onShow() {
    auth.requireFamily()
  },
  onName(e) {
    this.setData({ name: e.detail.value })
  },
  onMemorial(e) {
    this.setData({ memorialFor: e.detail.value })
  },
  onAddress(e) {
    this.setData({ address: e.detail.value })
  },
  onNote(e) {
    this.setData({ note: e.detail.value })
  },
  pickCover() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const f = (res.tempFiles || [])[0]
        if (!f) return
        this.setData({
          coverPath: f.tempFilePath,
          coverLabel: '相册封面',
        })
      },
      fail: () => {
        wx.showToast({ title: '未选择图片', icon: 'none' })
      },
    })
  },
  clearCover() {
    this.setData({ coverPath: '', coverLabel: '春山封面' })
  },
  setMotif(e) {
    const m = e.currentTarget.dataset.motif
    this.setData({ coverMotif: m, coverPath: this.data.coverPath ? this.data.coverPath : '' })
  },
  chooseLocation() {
    wx.chooseLocation({
      latitude: this.data.lat || undefined,
      longitude: this.data.lng || undefined,
      success: (res) => {
        const address = res.address || res.name || ''
        this.setData({
          lat: res.latitude,
          lng: res.longitude,
          hasLoc: true,
          address: this.data.address || address,
          locLabel:
            (res.name || address || '已选位置') +
            '\n' +
            Number(res.latitude).toFixed(5) +
            ', ' +
            Number(res.longitude).toFixed(5),
        })
      },
      fail: (err) => {
        const msg = (err && err.errMsg) || ''
        if (msg.indexOf('cancel') >= 0) return
        // Devtools / denied: keep graceful demo fallback
        wx.showModal({
          title: '无法打开地图选点',
          content:
            '真机可调起 wx.chooseLocation。开发者工具若未授权，可继续用手写地址；保存后详情页仍可用导航打开地图。',
          showCancel: false,
        })
      },
    })
  },
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
      lat: this.data.lat != null ? Number(this.data.lat) : null,
      lng: this.data.lng != null ? Number(this.data.lng) : null,
      coverLabel: this.data.coverLabel || '春山封面',
      coverPath: this.data.coverPath || '',
      coverMotif: this.data.coverMotif || 'sage',
    })
    wx.redirectTo({ url: '/pages/grave-detail/grave-detail?id=' + g.id })
  },
})
