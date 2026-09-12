const store = require('../../utils/store')
const auth = require('../../utils/auth')

Page({
  onShow() {
    if (store.currentUser() && store.currentFamily()) {
      wx.switchTab({ url: '/pages/home/home' })
    }
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
})
