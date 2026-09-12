const store = require('../../utils/store')
const auth = require('../../utils/auth')
const share = require('../../utils/share')
const marketing = require('../../utils/marketing')

Page({
  data: {
    slogan: marketing.slogan,
    hook: marketing.hook,
    roleHint: marketing.inviteCard.roleHint,
    token: '',
    familyName: '',
    nickname: '',
    loggedIn: false,
    fail: '',
    reason: '',
    already: false,
    canJoin: false,
    busy: false,
  },
  onLoad(q) {
    const token = (q && (q.token || q.invite)) || ''
    if (token) share.savePendingInvite(token)
    this.token = token || share.readPendingInvite()
    this.refresh()
  },
  onShow() {
    const pending = this.token || share.readPendingInvite()
    if (pending && pending !== this.token) this.token = pending
    this.refresh()
  },
  refresh() {
    const token = this.token || ''
    const user = store.currentUser()
    const preview = store.previewInvite(token)
    const already = !!(preview && preview.alreadyMember)
    let failReason = ''
    if (!token) failReason = 'invalid'
    else if (!preview) failReason = 'invalid'
    else if (already) failReason = 'already_member'
    else if (!preview.ok) failReason = preview.reason
    const fail = failReason && failReason !== 'already_member' ? marketing.joinFailMessage(failReason) : (already ? marketing.joinFailMessage('already_member') : '')
    this.setData({
      token: token,
      familyName: (preview && preview.family && preview.family.name) || '',
      nickname: (user && user.nickname) || '',
      loggedIn: !!user,
      fail: fail,
      reason: failReason,
      already: already,
      canJoin: !!(preview && preview.ok && !already && user),
    })
  },
  goLogin() {
    wx.navigateTo({ url: '/pages/login/login' })
  },
  mockWx() {
    store.loginWeChat()
    this.refresh()
  },
  enterDemo() {
    store.enterDemo()
    wx.switchTab({ url: '/pages/home/home' })
  },
  join() {
    if (this.data.busy) return
    if (this.data.already) {
      share.clearPendingInvite()
      auth.goHomeOrOnboard()
      return
    }
    if (!store.currentUser()) {
      this.setData({ fail: marketing.joinFailMessage('need_login'), reason: 'need_login' })
      return
    }
    this.setData({ busy: true, fail: '' })
    const preview = store.previewInvite(this.token)
    if (!preview || !preview.ok) {
      const reason = (preview && preview.reason) || 'invalid'
      this.setData({
        busy: false,
        fail: marketing.joinFailMessage(reason),
        reason: reason,
        canJoin: false,
      })
      return
    }
    const family = store.joinFamily(this.token)
    if (!family) {
      this.setData({ busy: false, fail: marketing.joinFailMessage('invalid'), reason: 'invalid' })
      return
    }
    share.clearPendingInvite()
    wx.showToast({ title: '已加入 ' + family.name, icon: 'success' })
    setTimeout(() => wx.switchTab({ url: '/pages/home/home' }), 350)
  },
  goHome() {
    share.clearPendingInvite()
    auth.goHomeOrOnboard()
  },
})
