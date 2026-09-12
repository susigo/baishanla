const auth = require('../../utils/auth')
const marketing = require('../../utils/marketing')

Page({
  data: {
    visible: false,
    slogan: marketing.splash.slogan,
    hook: marketing.splash.hook,
    line: marketing.splash.line,
    skip: marketing.splash.skip,
  },
  onLoad() {
    if (!marketing.shouldShowSplash()) {
      this.leave()
      return
    }
    this.setData({ visible: true })
    this.timer = setTimeout(() => this.leave(), marketing.splash.durationMs)
    this.hard = setTimeout(() => this.leave(), marketing.splash.maxMs)
  },
  onUnload() {
    this.clearTimers()
  },
  skip() {
    this.leave()
  },
  clearTimers() {
    if (this.timer) clearTimeout(this.timer)
    if (this.hard) clearTimeout(this.hard)
    this.timer = null
    this.hard = null
  },
  leave() {
    if (this.left) return
    this.left = true
    this.clearTimers()
    marketing.markSplashSeen()
    const id = marketing.DEFAULT_CAMPAIGN_ID
    if (marketing.isCampaignActive(id) && !marketing.isCampaignDismissed(id)) {
      wx.redirectTo({ url: '/pages/campaign/campaign?id=' + id })
      return
    }
    auth.goHomeOrOnboard()
  },
})
