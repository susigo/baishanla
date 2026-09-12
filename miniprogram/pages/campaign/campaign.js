const store = require('../../utils/store')
const auth = require('../../utils/auth')
const marketing = require('../../utils/marketing')

Page({
  data: {
    missing: false,
    campaign: {},
  },
  onLoad(q) {
    const id = (q && q.id) || marketing.DEFAULT_CAMPAIGN_ID
    const campaign = marketing.getCampaign(id)
    if (!campaign) {
      this.setData({ missing: true })
      return
    }
    this.id = campaign.id
    this.setData({ missing: false, campaign: campaign })
  },
  goPrimary() {
    if (store.currentUser() && store.currentFamily()) {
      wx.switchTab({ url: '/pages/home/home' })
    } else if (store.currentUser()) {
      wx.redirectTo({ url: '/pages/family/family' })
    } else {
      wx.navigateTo({ url: '/pages/login/login' })
    }
  },
  goDemo() {
    store.enterDemo()
    wx.switchTab({ url: '/pages/home/home' })
  },
  dismiss() {
    marketing.dismissCampaign(this.id || marketing.DEFAULT_CAMPAIGN_ID)
    auth.goHomeOrOnboard()
  },
})
