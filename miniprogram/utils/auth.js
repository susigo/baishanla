const store = require('./store')

function goWelcome() {
  wx.reLaunch({ url: '/pages/welcome/welcome' })
}

function goFamily() {
  const pages = getCurrentPages()
  const cur = pages[pages.length - 1]
  if (cur && cur.route === 'pages/family/family') return
  wx.redirectTo({ url: '/pages/family/family' })
}

function requireFamily() {
  if (!store.currentUser()) {
    goWelcome()
    return false
  }
  if (!store.currentFamily()) {
    goFamily()
    return false
  }
  return true
}

function afterLogin() {
  if (store.currentFamily()) {
    wx.switchTab({ url: '/pages/home/home' })
  } else {
    wx.redirectTo({ url: '/pages/family/family' })
  }
}

module.exports = { requireFamily, afterLogin, goWelcome }
