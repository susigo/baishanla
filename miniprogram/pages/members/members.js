const store = require('../../utils/store')
const auth = require('../../utils/auth')

const ROLE = { owner: '所有者', editor: '编辑', viewer: '查看' }

Page({
  data: {
    token: '',
    copied: false,
    members: [],
  },
  onShow() {
    if (!auth.requireFamily()) return
    const family = store.currentFamily()
    const members = store.familyMembers(family.id).map((m) =>
      Object.assign({}, m, { roleLabel: ROLE[m.role] || m.role }),
    )
    this.setData({ token: family.inviteToken, members: members, copied: false })
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
  stubShare() {
    wx.showModal({
      title: '邀请家人（占位）',
      content: '正式版走微信分享卡片。演示请复制邀请码，对方登录后在「加入家庭」粘贴。小林家邀请码：' + this.data.token,
      showCancel: false,
    })
  },
})
