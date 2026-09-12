/**
 * 订阅消息模板 ID。
 * touristappid / 未在公众平台配置时请留空：仅演示 UI，本地记 subscribeOptIn。
 * 真机授权：换成你在 mp.weixin.qq.com 申请的模板 ID。
 */
const TMPL_IDS = []

const OPT_IN_KEY = 'baishanla.subscribeOptIn'

function isOptedIn() {
  try {
    return !!wx.getStorageSync(OPT_IN_KEY)
  } catch (e) {
    return false
  }
}

function setOptIn(value) {
  try {
    if (value) wx.setStorageSync(OPT_IN_KEY, true)
    else wx.removeStorageSync(OPT_IN_KEY)
  } catch (e) {
    /* ignore */
  }
}

function requestQingmingRemind() {
  return new Promise((resolve) => {
    const ids = (TMPL_IDS || []).filter(Boolean)
    const finishDemo = (reason) => {
      setOptIn(true)
      resolve({ demo: true, accepted: true, reason: reason })
    }
    if (!ids.length) {
      finishDemo('empty')
      return
    }
    if (typeof wx.requestSubscribeMessage !== 'function') {
      finishDemo('unsupported')
      return
    }
    try {
      wx.requestSubscribeMessage({
        tmplIds: ids,
        success(res) {
          const accepted = ids.some((id) => res && res[id] === 'accept')
          if (accepted) setOptIn(true)
          resolve({ demo: false, accepted: accepted, res: res })
        },
        fail() {
          finishDemo('fail')
        },
      })
    } catch (e) {
      finishDemo('error')
    }
  })
}

module.exports = {
  TMPL_IDS,
  OPT_IN_KEY,
  isOptedIn,
  setOptIn,
  requestQingmingRemind,
}
