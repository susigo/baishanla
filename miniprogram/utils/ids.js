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

module.exports = { uid, todayISO, formatMD }

