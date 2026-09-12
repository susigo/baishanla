const store = require('./store')
const share = require('./share')

function goWelcome() {
  wx.reLaunch({ url: '/pages/welcome/welcome' })
}

function goFamily() {
  const pages = getCurrentPages()
  const cur = pages[pages.length - 1]
  if (cur && cur.route === 'pages/family/family') return
  wx.redirectTo({ url: '/pages/family/family' })
}

function goHomeOrOnboard() {
  if (store.currentUser() && store.currentFamily()) {
    wx.switchTab({ url: '/pages/home/home' })
  } else if (store.currentUser()) {
    goFamily()
  } else {
    goWelcome()
  }
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
  const pending = share.readPendingInvite()
  if (pending) {
    wx.redirectTo({ url: '/pages/join/join?token=' + encodeURIComponent(pending) })
    return
  }
  if (store.currentFamily()) {
    wx.switchTab({ url: '/pages/home/home' })
  } else {
    wx.redirectTo({ url: '/pages/family/family' })
  }
}

module.exports = { requireFamily, afterLogin, goWelcome, goFamily, goHomeOrOnboard }
