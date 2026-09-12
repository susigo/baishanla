const store = require('../../utils/store')
const auth = require('../../utils/auth')
const share = require('../../utils/share')
const marketing = require('../../utils/marketing')

Page({
  data: {
    slogan: marketing.inviteCard.slogan,
    hook: marketing.inviteCard.hook,
    roleHint: marketing.inviteCard.roleHint,
    shareBtn: marketing.inviteCard.shareBtn,
    familyLine: '',
    copyLabel: '',
    token: '',
    familyName: '',
    nickname: '',
    copied: false,
  },
  onShow() {
    if (!auth.requireFamily()) return
    this.refresh()
  },
  refresh() {
    const family = store.currentFamily()
    const user = store.currentUser()
    const token = family.inviteToken || ''
    this.setData({
      token: token,
      familyName: family.name,
      nickname: (user && user.nickname) || '家人',
      familyLine: marketing.inviteFamilyLine(family.name),
      copyLabel: marketing.inviteCopyLabel(token),
      copied: false,
    })
  },
  copy() {
    wx.setClipboardData({
      data: this.data.token,
      success: () => {
        this.setData({ copied: true })
        setTimeout(() => this.setData({ copied: false }), 1500)
      },
    })
  },
  onShareAppMessage() {
    return share.familyShareCard({
      familyName: this.data.familyName,
      token: this.data.token,
      nickname: this.data.nickname,
    })
  },
  onShareTimeline() {
    return share.timelineShare(
      share.familyShareCard({
        familyName: this.data.familyName,
        token: this.data.token,
        nickname: this.data.nickname,
      }),
    )
  },
})
