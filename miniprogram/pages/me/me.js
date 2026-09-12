const store = require('../../utils/store')
const auth = require('../../utils/auth')

Page({
  data: {
    user: {},
    family: {},
    memberCount: 0,
    families: [],
    familyNames: [],
    familyIndex: 0,
  },
  onShow() {
    if (!auth.requireFamily()) return
    this.refresh()
  },
  refresh() {
    const user = store.currentUser()
    const family = store.currentFamily()
    const members = store.familyMembers(family.id)
    const families = store.myFamilies()
    const familyIndex = Math.max(0, families.findIndex((f) => f.id === family.id))
    user.avatarChar = (user.nickname || '?').slice(0, 1)
    this.setData({
      user: user,
      family: family,
      memberCount: members.length,
      families: families,
      familyNames: families.map((f) => f.name),
      familyIndex: familyIndex,
    })
  },
  onFamily(e) {
    const idx = Number(e.detail.value)
    const f = this.data.families[idx]
    if (f) {
      store.setCurrentFamily(f.id)
      this.refresh()
    }
  },
  goMembers() {
    wx.navigateTo({ url: '/pages/members/members' })
  },
  goFamily() {
    wx.navigateTo({ url: '/pages/family/family' })
  },
  logout() {
    store.logout()
    wx.reLaunch({ url: '/pages/welcome/welcome' })
  },
  reset() {
    wx.showModal({
      title: '重置演示数据',
      content: '会清空本机会话并恢复小林家种子数据。',
      success: (res) => {
        if (res.confirm) {
          store.resetDemo()
          wx.reLaunch({ url: '/pages/welcome/welcome' })
        }
      },
    })
  },
})
