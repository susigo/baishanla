const store = require('../../utils/store')
const auth = require('../../utils/auth')
const share = require('../../utils/share')

const ROLE = { owner: '所有者', editor: '编辑', viewer: '查看' }

Page({
  data: {
    token: '',
    familyName: '',
    copied: false,
    members: [],
  },
  onShow() {
    if (!auth.requireFamily()) return
    const family = store.currentFamily()
    const members = store.familyMembers(family.id).map((m) =>
      Object.assign({}, m, { roleLabel: ROLE[m.role] || m.role }),
    )
    this.setData({
      token: family.inviteToken,
      familyName: family.name,
      members: members,
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
    })
  },
  onShareTimeline() {
    return share.timelineShare(
      share.familyShareCard({
        familyName: this.data.familyName,
        token: this.data.token,
      }),
    )
  },
})
