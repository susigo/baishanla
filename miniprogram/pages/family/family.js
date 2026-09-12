const store = require('../../utils/store')
const share = require('../../utils/share')

Page({
  data: {
    mode: 'create',
    name: '',
    token: '',
    err: '',
    hasInvite: false,
  },
  onLoad(q) {
    const invite = q && q.invite ? decodeURIComponent(q.invite) : ''
    if (invite) {
      share.savePendingInvite(invite)
      this.setData({ mode: 'join', token: invite, hasInvite: true })
    }
  },
  onShow() {
    if (!store.currentUser()) {
      wx.reLaunch({ url: '/pages/welcome/welcome' })
      return
    }
    if (store.currentFamily()) {
      share.clearPendingInvite()
      wx.switchTab({ url: '/pages/home/home' })
      return
    }
    const pending = this.data.token || share.readPendingInvite()
    if (pending) {
      this.setData({ mode: 'join', token: pending, hasInvite: true })
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
      share.clearPendingInvite()
      wx.switchTab({ url: '/pages/home/home' })
    } else {
      const f = store.joinFamily(this.data.token)
      if (!f) {
        this.setData({ err: '邀请码无效（演示可用 INVITE-XIAOLIN）' })
        return
      }
      share.clearPendingInvite()
      wx.switchTab({ url: '/pages/home/home' })
    }
  },
})
