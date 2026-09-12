const store = require('../../utils/store')
const auth = require('../../utils/auth')
const share = require('../../utils/share')

Page({
  data: {
    pendingInvite: '',
  },
  onLoad(q) {
    if (q && q.invite) share.savePendingInvite(q.invite)
  },
  onShow() {
    if (store.currentUser() && store.currentFamily()) {
      wx.switchTab({ url: '/pages/home/home' })
      return
    }
    if (store.currentUser() && !store.currentFamily()) {
      wx.redirectTo({ url: '/pages/family/family' })
      return
    }
    this.setData({ pendingInvite: share.readPendingInvite() })
  },
  goLogin() {
    wx.navigateTo({ url: '/pages/login/login' })
  },
  enterDemo() {
    store.enterDemo()
    wx.switchTab({ url: '/pages/home/home' })
  },
  mockWx() {
    store.loginWeChat()
    auth.afterLogin()
  },
  onShareAppMessage() {
    return share.welcomeShareCard()
  },
  onShareTimeline() {
    return share.timelineShare(share.welcomeShareCard())
  },
})
