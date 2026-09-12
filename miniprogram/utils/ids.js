function uid(prefix) {
  prefix = prefix || ''
  const rand = Math.random().toString(36).slice(2, 8)
  const t = Date.now().toString(36)
  return prefix + t.slice(-4) + rand
}

function todayISO() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return y + '-' + m + '-' + day
}

function formatMD(iso) {
  if (!iso) return ''
  const today = todayISO()
  if (iso === today) return '今天'
  const m = Number(String(iso).slice(5, 7))
  const d = Number(String(iso).slice(8, 10))
  if (!m || !d) return ''
  return m + '月' + d + '日'
}

function formatTypeDate(type, iso) {
  if (!iso) return type || '暂无排程'
  return (type || '拜山') + ' · ' + formatMD(iso)
}

/** Next occurrence on/after `from` (default today). yearly rolls year; once expires. */
function nextOccurrence(schedule, from) {
  if (!schedule || !schedule.date) return null
  const today = from || todayISO()
  const md = String(schedule.date).slice(5, 10)
  if (!/^\d{2}-\d{2}$/.test(md)) {
    return schedule.date >= today ? schedule.date : null
  }
  if (schedule.rule === 'once') {
    return schedule.date >= today ? schedule.date : null
  }
  let y = Number(today.slice(0, 4))
  let candidate = y + '-' + md
  if (candidate < today) candidate = y + 1 + '-' + md
  return candidate
}

function daysUntil(iso) {
  if (!iso) return null
  const a = new Date(todayISO() + 'T00:00:00')
  const b = new Date(iso + 'T00:00:00')
  return Math.round((b - a) / 86400000)
}

module.exports = { uid, todayISO, formatMD, formatTypeDate, nextOccurrence, daysUntil }
