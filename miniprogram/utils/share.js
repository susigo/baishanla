const store = require('./store')

const PENDING_INVITE_KEY = 'baishanla.pendingInvite'
const SHARE_IMAGE = '/assets/cover-sage.png'

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
  return '/pages/family/family?invite=' + encodeURIComponent(token)
}

function familyShareCard(extra) {
  extra = extra || {}
  const family = store.currentFamily()
  const name = extra.familyName || (family && family.name) || '拜山啦'
  const token = extra.token || (family && family.inviteToken) || ''
  return {
    title: extra.title || ('来' + name + '一起记看望'),
    path: invitePath(token),
    imageUrl: extra.imageUrl || SHARE_IMAGE,
  }
}

function welcomeShareCard() {
  return {
    title: '拜山啦 · 把看望，轻轻记下来',
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
  readPendingInvite,
  savePendingInvite,
  clearPendingInvite,
  invitePath,
  familyShareCard,
  welcomeShareCard,
  timelineShare,
}
