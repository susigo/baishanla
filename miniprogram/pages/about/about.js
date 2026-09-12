Page({
  data: { tab: 'about' },
  onLoad(q) {
    this.setData({ tab: q.tab === 'privacy' ? 'privacy' : 'about' })
    wx.setNavigationBarTitle({
      title: q.tab === 'privacy' ? '隐私说明' : '关于拜山啦',
    })
  },
})
