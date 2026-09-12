const slogan = '一起拜山啦'
const hook = '这是谁的谁？'
const splashVersion = '2026-09-v2'
const DEFAULT_CAMPAIGN_ID = 'qingming-2027-seed'
const SHARE_IMAGE = '/assets/share-invite.png'

const SPLASH_KEY = 'baishanla.splashSeenVersion'

const splash = {
  slogan: slogan,
  hook: hook,
  line: '先把人和山头的关系记清楚',
  skip: '跳过',
  durationMs: 1900,
  maxMs: 3000,
}

const campaigns = {
  'qingming-2027-seed': {
    id: 'qingming-2027-seed',
    validUntil: '2027-04-15',
    badge: '内测',
    slogan: slogan,
    hook: hook,
    lead: '爷爷的山、外婆的碑、今年谁去——一家人事先说清楚，到了不慌。',
    paragraphs: [
      '记人与墓：名称、纪念对象，一眼知道「这是谁的谁」。',
      '记位置与这一次：选点导航，照片和话留下来。',
      '喊家人：一张邀请卡，兄弟姐妹同一本账。',
    ],
    benefits: ['家庭空间不串家', '清明 / 重阳 / 忌日可排', '物资清单一起勾'],
    primaryCta: '一起拜山啦',
    secondaryCta: '先看演示 · 小林家',
    dismiss: '稍后再说',
  },
}

const homePromo = {
  title: '一起拜山啦',
  line: '这是谁的谁？先邀请家人记清楚',
  cta: '查看活动',
  campaignId: DEFAULT_CAMPAIGN_ID,
}

const emptyStates = {
  graves: { title: '这是谁的谁？先记下第一座山头', cta: '添加墓地' },
  visits: { title: '这一次上山，留给以后翻看', cta: '记一笔' },
  checklist: { title: '香烛纸钱列成清单，到了不漏', cta: '用模板新建' },
  members: { title: '一起拜山啦——先把家人请来', cta: '邀请家人' },
  schedules: { title: '清明、重阳、忌日，提前排进日历', cta: '添加排程' },
}

const inviteCard = {
  slogan: slogan,
  hook: hook,
  roleHint: '加入后一起记人、记山、记这一次',
  shareBtn: '发给微信好友',
}

const joinFail = {
  expired: '这张邀请已经过期，请让家人再发一张。',
  exhausted: '这张邀请已经用完，请让家人再发一张。',
  already_member: '你已经在这个家庭里了。',
  invalid: '邀请码无效，请核对后再试。',
  need_login: '先登录，再加入家庭。',
}

function campaignDismissKey(id) {
  return 'baishanla.campaignDismissed:' + (id || DEFAULT_CAMPAIGN_ID)
}

function storageGet(key) {
  try {
    return wx.getStorageSync(key)
  } catch (e) {
    return ''
  }
}

function storageSet(key, value) {
  try {
    wx.setStorageSync(key, value)
  } catch (e) {
    /* ignore */
  }
}

function storageRemove(key) {
  try {
    wx.removeStorageSync(key)
  } catch (e) {
    /* ignore */
  }
}

function todayISO() {
  const d = new Date()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return d.getFullYear() + '-' + m + '-' + day
}

function shouldShowSplash() {
  return storageGet(SPLASH_KEY) !== splashVersion
}

function markSplashSeen() {
  storageSet(SPLASH_KEY, splashVersion)
}

function getCampaign(id) {
  return campaigns[id || DEFAULT_CAMPAIGN_ID] || null
}

function isCampaignActive(id) {
  const c = getCampaign(id)
  if (!c) return false
  if (!c.validUntil) return true
  return c.validUntil >= todayISO()
}

function isCampaignDismissed(id) {
  return !!storageGet(campaignDismissKey(id))
}

function dismissCampaign(id) {
  storageSet(campaignDismissKey(id), '1')
}

function shouldShowHomePromo(id) {
  const cid = id || homePromo.campaignId
  return isCampaignActive(cid) && !isCampaignDismissed(cid)
}

function emptyState(key) {
  const e = emptyStates[key] || { title: '', cta: '' }
  return { title: e.title || '', cta: e.cta || '', description: e.description || '' }
}

function shareTitle(nickname, familyName) {
  const nick = nickname || '家人'
  const name = familyName || '家庭'
  return slogan + ' · ' + nick + '请你进「' + name + '」'
}

function shareDesc() {
  return hook + '一起来记'
}

function inviteFamilyLine(familyName) {
  return '「' + (familyName || '家庭') + '」等你来记'
}

function inviteCopyLabel(code) {
  return '复制邀请码 ' + (code || '')
}

function joinFailMessage(reason) {
  return joinFail[reason] || joinFail.invalid
}

function resetMarketingFlags() {
  storageRemove(SPLASH_KEY)
  Object.keys(campaigns).forEach((id) => storageRemove(campaignDismissKey(id)))
}

module.exports = {
  slogan,
  hook,
  splashVersion,
  DEFAULT_CAMPAIGN_ID,
  SHARE_IMAGE,
  SPLASH_KEY,
  splash,
  campaigns,
  homePromo,
  emptyStates,
  inviteCard,
  joinFail,
  shouldShowSplash,
  markSplashSeen,
  isCampaignActive,
  isCampaignDismissed,
  dismissCampaign,
  getCampaign,
  emptyState,
  shouldShowHomePromo,
  shareTitle,
  shareDesc,
  inviteFamilyLine,
  inviteCopyLabel,
  joinFailMessage,
  resetMarketingFlags,
  campaignDismissKey,
}
