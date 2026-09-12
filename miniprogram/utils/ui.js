function toast(title, icon) {
  wx.showToast({ title: title, icon: icon || 'none' })
}

function confirm(opts) {
  return new Promise((resolve) => {
    wx.showModal({
      title: opts.title || '确认',
      content: opts.content || '',
      confirmColor: opts.danger ? '#C45C5C' : '#7BAF9E',
      success: (res) => resolve(!!res.confirm),
      fail: () => resolve(false),
    })
  })
}

module.exports = { toast, confirm }
