const store = require('../../utils/store')
const auth = require('../../utils/auth')
const share = require('../../utils/share')

const ROLE = { owner: '所有者', editor: '编辑', viewer: '查看' }
const COLORS = ['#7BAF9E', '#E7B8B0', '#5F9483', '#B7D0C4', '#C9A66B']

Page({
  data: {
    token: '',
    familyName: '',
    copied: false,
    members: [],
    isOwner: false,
    myUserId: '',
  },
  onShow() {
    if (!auth.requireFamily()) return
    this.refresh()
  },
  refresh() {
    const family = store.currentFamily()
    const user = store.currentUser()
    const role = store.myRole(family.id)
    const members = store.familyMembers(family.id).map((m, i) =>
      Object.assign({}, m, {
        roleLabel: ROLE[m.role] || m.role,
        avatarChar: (m.nickname || '?').slice(0, 1),
        avatarColor: COLORS[i % COLORS.length],
        isMe: m.userId === user.id,
        canManage: role === 'owner' && m.role !== 'owner',
      }),
    )
    this.setData({
      token: family.inviteToken,
      familyName: family.name,
      members: members,
      copied: false,
      isOwner: role === 'owner',
      myUserId: user.id,
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
  manage(e) {
    if (!this.data.isOwner) return
    const userId = e.currentTarget.dataset.id
    const m = this.data.members.find((x) => x.userId === userId)
    if (!m || !m.canManage) return
    wx.showActionSheet({
      itemList: ['设为编辑', '设为查看', '移除成员'],
      success: (res) => {
        const family = store.currentFamily()
        if (res.tapIndex === 0) {
          const r = store.setMemberRole(family.id, userId, 'editor')
          if (!r.ok) wx.showToast({ title: r.reason, icon: 'none' })
          else this.refresh()
        } else if (res.tapIndex === 1) {
          const r = store.setMemberRole(family.id, userId, 'viewer')
          if (!r.ok) wx.showToast({ title: r.reason, icon: 'none' })
          else this.refresh()
        } else if (res.tapIndex === 2) {
          wx.showModal({
            title: '移除「' + m.nickname + '」？',
            content: '对方将无法再看到这个家庭的内容。',
            confirmColor: '#C45C5C',
            success: (mr) => {
              if (!mr.confirm) return
              const r = store.removeMember(family.id, userId)
              if (!r.ok) wx.showToast({ title: r.reason, icon: 'none' })
              else this.refresh()
            },
          })
        }
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
