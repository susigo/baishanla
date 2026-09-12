const store = require('../../utils/store')
const share = require('../../utils/share')

Page({
  data: {
    mode: 'create',
    name: '',
    token: '',
    err: '',
    hasInvite: false,
    force: false,
    busy: false,
  },
  onLoad(q) {
    const invite = q && q.invite ? decodeURIComponent(q.invite) : ''
    const force = !!(q && (q.force === '1' || q.force === 'true'))
    if (invite) {
      share.savePendingInvite(invite)
      this.setData({ mode: 'join', token: invite, hasInvite: true, force: force })
    } else {
      this.setData({ force: force })
    }
  },
  onShow() {
    if (!store.currentUser()) {
      wx.reLaunch({ url: '/pages/welcome/welcome' })
      return
    }
    if (store.currentFamily() && !this.data.force) {
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
    if (this.data.busy) return
    this.setData({ err: '', busy: true })
    try {
      if (this.data.mode === 'create') {
        if (!this.data.name.trim()) {
          this.setData({ err: '请输入家庭名称', busy: false })
          return
        }
        store.createFamily(this.data.name.trim())
        share.clearPendingInvite()
        wx.showToast({ title: '家庭已创建', icon: 'success' })
        setTimeout(() => wx.switchTab({ url: '/pages/home/home' }), 350)
      } else {
        const f = store.joinFamily(this.data.token)
        if (!f) {
          this.setData({ err: '邀请码无效（演示可用 INVITE-XIAOLIN）', busy: false })
          return
        }
        share.clearPendingInvite()
        wx.showToast({ title: '已加入 ' + f.name, icon: 'success' })
        setTimeout(() => wx.switchTab({ url: '/pages/home/home' }), 350)
      }
    } catch (e) {
      this.setData({ err: (e && e.message) || '操作失败', busy: false })
    }
  },
})
