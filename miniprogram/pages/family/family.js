const store = require('../../utils/store')

Page({
  data: {
    mode: 'create',
    name: '',
    token: '',
    err: '',
  },
  onShow() {
    if (!store.currentUser()) {
      wx.reLaunch({ url: '/pages/welcome/welcome' })
      return
    }
    if (store.currentFamily()) {
      wx.switchTab({ url: '/pages/home/home' })
    }
  },
  setCreate() {
    this.setData({ mode: 'create', err: '' })
  },
  setJoin() {
    this.setData({ mode: 'join', err: '' })
  },
  onName(e) {
    this.setData({ name: e.detail.value })
  },
  onToken(e) {
    this.setData({ token: e.detail.value })
  },
  submit() {
    this.setData({ err: '' })
    if (this.data.mode === 'create') {
      if (!this.data.name.trim()) {
        this.setData({ err: '请输入家庭名称' })
        return
      }
      store.createFamily(this.data.name.trim())
      wx.switchTab({ url: '/pages/home/home' })
    } else {
      const f = store.joinFamily(this.data.token)
      if (!f) {
        this.setData({ err: '邀请码无效（演示可用 INVITE-XIAOLIN）' })
        return
      }
      wx.switchTab({ url: '/pages/home/home' })
    }
  },
})
