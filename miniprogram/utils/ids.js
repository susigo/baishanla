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

module.exports = { uid, todayISO }
