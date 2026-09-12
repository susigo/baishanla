const store = require('../../utils/store')
const auth = require('../../utils/auth')
const share = require('../../utils/share')

Page({
  data: {
    phone: '',
    code: '',
    sent: false,
    err: '',
    pendingInvite: '',
  },
  onLoad(q) {
    if (q && q.invite) share.savePendingInvite(q.invite)
  },
  onShow() {
    this.setData({ pendingInvite: share.readPendingInvite() })
  },
  onPhone(e) {
    this.setData({ phone: e.detail.value.trim() })
  },
  onCode(e) {
    this.setData({ code: e.detail.value.trim() })
  },
  sendCode() {
    if (!this.data.phone || this.data.phone.length < 6) {
      this.setData({ err: '请输入手机号' })
      return
    }
    this.setData({ err: '', sent: true })
  },
  submitPhone() {
    if (this.data.code !== '123456') {
      this.setData({ err: '验证码错误（演示：123456）' })
      return
    }
    store.loginWithPhone(this.data.phone)
    auth.afterLogin()
  },
  mockWx() {
    wx.showLoading({ title: '登录中', mask: true })
    setTimeout(() => {
      wx.hideLoading()
      store.loginWeChat()
      auth.afterLogin()
    }, 400)
  },
  enterDemo() {
    store.enterDemo()
    wx.switchTab({ url: '/pages/home/home' })
  },
})
