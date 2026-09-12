const store = require('../../utils/store')
const auth = require('../../utils/auth')

Page({
  data: {
    user: {},
    family: {},
    memberCount: 0,
    roleLabel: '',
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
    const role = store.myRole(family.id)
    const ROLE = { owner: '所有者', editor: '编辑', viewer: '查看' }
    user.avatarChar = (user.nickname || '?').slice(0, 1)
    this.setData({
      user: user,
      family: family,
      memberCount: members.length,
      roleLabel: ROLE[role] || role || '',
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
      wx.showToast({ title: '已切换到 ' + f.name, icon: 'none' })
      this.refresh()
    }
  },
  goMembers() {
    wx.navigateTo({ url: '/pages/members/members' })
  },
  goFamily() {
    wx.navigateTo({ url: '/pages/family/family?force=1' })
  },
  goAbout() {
    wx.navigateTo({ url: '/pages/about/about' })
  },
  goPrivacy() {
    wx.navigateTo({ url: '/pages/about/about?tab=privacy' })
  },
  logout() {
    wx.showModal({
      title: '退出登录？',
      content: '本机会话会清除；家庭数据仍留在本机存储。',
      success: (res) => {
        if (!res.confirm) return
        store.logout()
        wx.reLaunch({ url: '/pages/welcome/welcome' })
      },
    })
  },
  reset() {
    wx.showModal({
      title: '重置演示数据',
      content: '会清空本机会话并恢复小林家种子数据。',
      confirmColor: '#C45C5C',
      success: (res) => {
        if (res.confirm) {
          store.resetDemo()
          wx.reLaunch({ url: '/pages/welcome/welcome' })
        }
      },
    })
  },
})
