const store = require('./store')
const marketing = require('./marketing')

const PENDING_INVITE_KEY = 'baishanla.pendingInvite'
const SHARE_IMAGE = marketing.SHARE_IMAGE

function readPendingInvite() {
  try {
    return wx.getStorageSync(PENDING_INVITE_KEY) || ''
  } catch (e) {
    return ''
  }
}

function savePendingInvite(token) {
  const t = String(token || '').trim()
  if (!t) return
  try {
    wx.setStorageSync(PENDING_INVITE_KEY, t)
  } catch (e) {
    /* ignore */
  }
}

function clearPendingInvite() {
  try {
    wx.removeStorageSync(PENDING_INVITE_KEY)
  } catch (e) {
    /* ignore */
  }
}

function invitePath(token) {
  if (!token) return '/pages/welcome/welcome'
  return '/pages/join/join?token=' + encodeURIComponent(token)
}

function familyShareCard(extra) {
  extra = extra || {}
  const family = store.currentFamily()
  const user = store.currentUser()
  const name = extra.familyName || (family && family.name) || '拜山啦'
  const nick = extra.nickname || (user && user.nickname) || '家人'
  const token = extra.token || (family && family.inviteToken) || ''
  return {
    title: extra.title || marketing.shareTitle(nick, name),
    desc: extra.desc || marketing.shareDesc(),
    path: invitePath(token),
    imageUrl: extra.imageUrl || SHARE_IMAGE,
  }
}

function welcomeShareCard() {
  return {
    title: marketing.slogan + ' · ' + marketing.hook,
    desc: marketing.shareDesc(),
    path: '/pages/welcome/welcome',
    imageUrl: SHARE_IMAGE,
  }
}

function timelineShare(card) {
  card = card || familyShareCard()
  const path = card.path || ''
  const q = path.indexOf('?') >= 0 ? path.slice(path.indexOf('?') + 1) : ''
  return {
    title: card.title,
    query: q,
    imageUrl: card.imageUrl || SHARE_IMAGE,
  }
}

module.exports = {
  PENDING_INVITE_KEY,
  SHARE_IMAGE,
  readPendingInvite,
  savePendingInvite,
  clearPendingInvite,
  invitePath,
  familyShareCard,
  welcomeShareCard,
  timelineShare,
}
