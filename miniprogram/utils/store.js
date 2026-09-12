const { uid, todayISO, nextOccurrence } = require('./ids')

const KEY = 'baishanla.db.v2'
const LEGACY_KEY = 'baishanla.db.v1'

const TEMPLATE_ITEMS = [
  { name: '水果', qty: 1, unit: '份', required: false },
  { name: '香烛', qty: 1, unit: '套', required: false },
  { name: '纸钱', qty: 2, unit: '刀', required: true },
  { name: '湿纸巾', qty: 1, unit: '', required: false },
  { name: '鲜花', qty: 1, unit: '束', required: false },
  { name: '矿泉水', qty: 2, unit: '瓶', required: false },
  { name: '垃圾袋', qty: 2, unit: '个', required: true },
  { name: '抹布', qty: 1, unit: '块', required: false },
  { name: '打火机', qty: 1, unit: '个', required: false },
  { name: '零钱', qty: 1, unit: '份', required: false },
]

function freshItemsFromTemplate() {
  return TEMPLATE_ITEMS.map((t, i) => ({
    id: 'i' + (i + 1),
    name: t.name,
    qty: t.qty,
    unit: t.unit,
    required: !!t.required,
    checked: false,
    checkedBy: '',
    checkedAt: '',
  }))
}

function seed() {
  const ownerId = 'u-owner'
  const momId = 'u-mom'
  const dadId = 'u-dad'
  const meId = 'u-me'
  const familyId = 'f-xiaolin'
  const grave1 = 'g-qingshan'
  const grave2 = 'g-houshan'
  const scheduleId = 's-qingming'
  const scheduleChongyang = 's-chongyang'
  const checklistId = 'c-qingming'
  const invite = 'INVITE-XIAOLIN'
  const tmplId = 't-qingming-default'

  const items = freshItemsFromTemplate()
  // seed some checked state so home progress feels alive
  items[0].checked = true
  items[0].checkedBy = '妈妈'
  items[0].checkedAt = '2026-03-28'
  items[3].checked = true
  items[3].checkedBy = '爸爸'
  items[3].checkedAt = '2026-03-30'
  items[5].checked = true
  items[5].checkedBy = '小林'
  items[5].checkedAt = '2026-04-01'
  items[8].checked = true
  items[8].checkedBy = '爸爸'
  items[8].checkedAt = '2026-03-29'

  return {
    version: 2,
    sessionUserId: null,
    currentFamilyId: null,
    users: [
      { id: ownerId, phone: '13800000001', nickname: '小林', avatarColor: '#7BAF9E' },
      { id: momId, phone: '13800000002', nickname: '妈妈', avatarColor: '#E7B8B0' },
      { id: dadId, phone: '13800000003', nickname: '爸爸', avatarColor: '#5F9483' },
      { id: meId, phone: '13800000004', nickname: '我', avatarColor: '#B7D0C4' },
    ],
    families: [
      {
        id: familyId,
        name: '小林家',
        theme: 'spring_qingming',
        ownerUserId: ownerId,
        inviteToken: invite,
      },
    ],
    members: [
      { familyId: familyId, userId: ownerId, role: 'owner', nickname: '小林', joinedAt: '2025-01-01' },
      { familyId: familyId, userId: momId, role: 'editor', nickname: '妈妈', joinedAt: '2025-01-02' },
      { familyId: familyId, userId: dadId, role: 'editor', nickname: '爸爸', joinedAt: '2025-01-02' },
      { familyId: familyId, userId: meId, role: 'editor', nickname: '我', joinedAt: '2025-03-01' },
    ],
    graves: [
      {
        id: grave1,
        familyId: familyId,
        name: '青山公墓 A区',
        memorialFor: '祖父 祖母',
        address: '市郊青山公墓 A区 12 排 3 号',
        lat: 30.2741,
        lng: 120.1551,
        note: '从东门进，第二条路左转，石碑有松树图案。',
        coverLabel: '春山封面',
        coverPath: '',
        coverMotif: 'sage',
      },
      {
        id: grave2,
        familyId: familyId,
        name: '后山',
        memorialFor: '曾祖父',
        address: '老家后山坡',
        lat: 30.3,
        lng: 120.2,
        note: '村里小路尽头，注意雨天湿滑。',
        coverLabel: '春山封面',
        coverPath: '',
        coverMotif: 'blush',
      },
    ],
    visits: [
      {
        id: 'v-2025-qm',
        familyId: familyId,
        graveId: grave1,
        date: '2025-04-04',
        title: '2025 清明',
        body: '天气很好，大家一起去了。妈妈带了水果，爸爸擦了碑。',
        tags: ['清明'],
        photos: [],
        authorName: '妈妈',
        createdAt: '2025-04-04T10:00:00',
      },
      {
        id: 'v-jiri',
        familyId: familyId,
        graveId: grave2,
        date: '2024-11-12',
        title: '忌日',
        body: '简单带了些纸钱和鲜花。',
        tags: ['忌日'],
        photos: [],
        authorName: '爸爸',
        createdAt: '2024-11-12T14:00:00',
      },
      {
        id: 'v-2024-cy',
        familyId: familyId,
        graveId: grave1,
        date: '2024-10-11',
        title: '2024 重阳',
        body: '秋高气爽，扫了扫落叶。',
        tags: ['重阳'],
        photos: [],
        authorName: '小林',
        createdAt: '2024-10-11T11:00:00',
      },
    ],
    schedules: [
      {
        id: scheduleId,
        familyId: familyId,
        graveId: grave1,
        type: '清明',
        title: '清明',
        date: '2026-04-04',
        rule: 'yearly',
        remindDays: [7, 3, 1],
        assignee: '妈妈',
      },
      {
        id: scheduleChongyang,
        familyId: familyId,
        graveId: grave1,
        type: '重阳',
        title: '重阳',
        date: '2026-10-11',
        rule: 'yearly',
        remindDays: [7, 1],
        assignee: '爸爸',
      },
    ],
    templates: [
      {
        id: tmplId,
        familyId: familyId,
        name: '清明物资模板',
        items: TEMPLATE_ITEMS.map((t, i) => ({
          id: 'ti' + (i + 1),
          name: t.name,
          qty: t.qty,
          unit: t.unit,
          required: !!t.required,
        })),
      },
    ],
    checklists: [
      {
        id: checklistId,
        familyId: familyId,
        graveId: grave1,
        scheduleId: scheduleId,
        templateId: tmplId,
        title: '2026 清明清单',
        fromTemplate: true,
        items: items,
      },
    ],
  }
}

function migrate(db) {
  if (!db || typeof db !== 'object') return null
  if (!db.version) return null
  if (db.version < 2) {
    db.version = 2
    db.templates = db.templates || []
    if (!db.templates.length) {
      const fam = (db.families && db.families[0]) || null
      if (fam) {
        db.templates.push({
          id: 't-qingming-default',
          familyId: fam.id,
          name: '清明物资模板',
          items: TEMPLATE_ITEMS.map((t, i) => ({
            id: 'ti' + (i + 1),
            name: t.name,
            qty: t.qty,
            unit: t.unit,
            required: !!t.required,
          })),
        })
      }
    }
    ;(db.graves || []).forEach((g) => {
      if (g.coverPath == null) g.coverPath = ''
      if (!g.coverMotif) g.coverMotif = 'sage'
    })
    ;(db.checklists || []).forEach((c) => {
      if (c.templateId == null) c.templateId = (db.templates[0] && db.templates[0].id) || ''
    })
    // ensure a future-facing 重阳 if only past 清明 exists
    const hasChongyang = (db.schedules || []).some((s) => s.type === '重阳')
    if (!hasChongyang && db.families && db.families[0] && db.graves && db.graves[0]) {
      db.schedules.push({
        id: uid('s-'),
        familyId: db.families[0].id,
        graveId: db.graves[0].id,
        type: '重阳',
        title: '重阳',
        date: '2026-10-11',
        rule: 'yearly',
        remindDays: [7, 1],
        assignee: '爸爸',
      })
    }
  }
  return db
}

function load() {
  try {
    let raw = wx.getStorageSync(KEY)
    if (!raw) raw = wx.getStorageSync(LEGACY_KEY)
    if (raw && raw.version) {
      const db = migrate(raw)
      persist(db)
      return db
    }
    if (typeof raw === 'string' && raw) {
      const parsed = JSON.parse(raw)
      if (parsed && parsed.version) {
        const db = migrate(parsed)
        persist(db)
        return db
      }
    }
  } catch (e) {
    /* ignore */
  }
  const db = seed()
  persist(db)
  return db
}

function persist(db) {
  wx.setStorageSync(KEY, db)
  try {
    wx.setStorageSync(LEGACY_KEY, db)
  } catch (e) {
    /* ignore */
  }
}

function mutate(fn) {
  const db = load()
  const result = fn(db)
  persist(db)
  return result
}

function ensureSeed() {
  return load()
}

function resetDemo() {
  const db = seed()
  persist(db)
  try {
    wx.removeStorageSync('baishanla.subscribeOptIn')
  } catch (e) {
    /* ignore */
  }
  try {
    wx.removeStorageSync('baishanla.pendingInvite')
  } catch (e) {
    /* ignore */
  }
  return db
}

function enterDemo() {
  return mutate((db) => {
    db.sessionUserId = 'u-me'
    db.currentFamilyId = 'f-xiaolin'
  })
}

function logout() {
  return mutate((db) => {
    db.sessionUserId = null
    db.currentFamilyId = null
  })
}

function loginWeChat() {
  return mutate((db) => {
    let user = db.users.find((u) => u.id === 'u-wx')
    if (!user) {
      user = {
        id: 'u-wx',
        phone: 'wx-mock',
        nickname: '微信用户',
        avatarColor: '#7BAF9E',
      }
      db.users.push(user)
    }
    db.sessionUserId = user.id
    const membership = db.members.find((m) => m.userId === user.id)
    db.currentFamilyId = membership ? membership.familyId : null
    return user
  })
}

function loginWithPhone(phone, nickname) {
  return mutate((db) => {
    let user = db.users.find((u) => u.phone === phone)
    if (!user) {
      user = {
        id: uid('u-'),
        phone: phone,
        nickname: nickname || '用户' + String(phone).slice(-4),
        avatarColor: '#7BAF9E',
      }
      db.users.push(user)
    }
    db.sessionUserId = user.id
    const membership = db.members.find((m) => m.userId === user.id)
    db.currentFamilyId = membership ? membership.familyId : null
    return user
  })
}

function createFamily(name) {
  return mutate((db) => {
    if (!db.sessionUserId) throw new Error('未登录')
    const family = {
      id: uid('f-'),
      name: name,
      theme: 'spring_qingming',
      ownerUserId: db.sessionUserId,
      inviteToken: 'INVITE-' + uid('').toUpperCase(),
    }
    db.families.push(family)
    const user = db.users.find((u) => u.id === db.sessionUserId)
    db.members.push({
      familyId: family.id,
      userId: user.id,
      role: 'owner',
      nickname: user.nickname,
      joinedAt: todayISO(),
    })
    // default template for new family
    db.templates = db.templates || []
    db.templates.push({
      id: uid('t-'),
      familyId: family.id,
      name: '清明物资模板',
      items: TEMPLATE_ITEMS.map((t, i) => ({
        id: uid('ti'),
        name: t.name,
        qty: t.qty,
        unit: t.unit,
        required: !!t.required,
      })),
    })
    db.currentFamilyId = family.id
    return family
  })
}

function joinFamily(token) {
  return mutate((db) => {
    if (!db.sessionUserId) throw new Error('未登录')
    const family = db.families.find(
      (f) => f.inviteToken.toLowerCase() === String(token).trim().toLowerCase(),
    )
    if (!family) return null
    const exists = db.members.some(
      (m) => m.familyId === family.id && m.userId === db.sessionUserId,
    )
    if (!exists) {
      const user = db.users.find((u) => u.id === db.sessionUserId)
      db.members.push({
        familyId: family.id,
        userId: user.id,
        role: 'editor',
        nickname: user.nickname,
        joinedAt: todayISO(),
      })
    }
    db.currentFamilyId = family.id
    return family
  })
}

function setCurrentFamily(id) {
  return mutate((db) => {
    if (!db.sessionUserId || !id) return false
    const ok = db.members.some((m) => m.familyId === id && m.userId === db.sessionUserId)
    if (!ok) return false
    db.currentFamilyId = id
    return true
  })
}

/** Entity must belong to the active family — prevents cross-family role/data leaks. */
function belongsToFamily(entity, familyId) {
  return !!(entity && familyId && entity.familyId === familyId)
}

function currentUser() {
  const db = load()
  return db.users.find((u) => u.id === db.sessionUserId) || null
}

function currentFamily() {
  const db = load()
  return db.families.find((f) => f.id === db.currentFamilyId) || null
}

function myFamilies() {
  const db = load()
  if (!db.sessionUserId) return []
  const ids = db.members.filter((m) => m.userId === db.sessionUserId).map((m) => m.familyId)
  return db.families.filter((f) => ids.indexOf(f.id) >= 0)
}

function familyMembers(familyId) {
  return load().members.filter((m) => m.familyId === familyId)
}

function familyGraves(familyId) {
  return load().graves.filter((g) => g.familyId === familyId)
}

function familyVisits(familyId) {
  return load()
    .visits.filter((v) => v.familyId === familyId)
    .sort((a, b) => b.date.localeCompare(a.date))
}

function familySchedules(familyId) {
  return load()
    .schedules.filter((s) => s.familyId === familyId)
    .sort((a, b) => a.date.localeCompare(b.date))
}

function familyChecklists(familyId) {
  return load().checklists.filter((c) => c.familyId === familyId)
}

function familyTemplates(familyId) {
  return (load().templates || []).filter((t) => t.familyId === familyId)
}

function getGrave(id) {
  return load().graves.find((g) => g.id === id)
}

function getVisit(id) {
  return load().visits.find((v) => v.id === id)
}

function getSchedule(id) {
  return load().schedules.find((s) => s.id === id)
}

function getChecklist(id) {
  return load().checklists.find((c) => c.id === id)
}

function getTemplate(id) {
  return (load().templates || []).find((t) => t.id === id)
}

function saveGrave(input) {
  return mutate((db) => {
    if (input.id) {
      const idx = db.graves.findIndex((g) => g.id === input.id)
      if (idx >= 0) {
        const prev = db.graves[idx]
        if (db.currentFamilyId && prev.familyId !== db.currentFamilyId) return null
        // never reassign familyId across households
        const patch = Object.assign({}, input)
        delete patch.familyId
        db.graves[idx] = Object.assign({}, prev, patch, { familyId: prev.familyId })
        return db.graves[idx]
      }
    }
    if (db.currentFamilyId && input.familyId && input.familyId !== db.currentFamilyId) return null
    const grave = {
      id: uid('g-'),
      familyId: input.familyId,
      name: input.name,
      memorialFor: input.memorialFor,
      address: input.address,
      lat: input.lat,
      lng: input.lng,
      note: input.note,
      coverLabel: input.coverLabel || '春山封面',
      coverPath: input.coverPath || '',
      coverMotif: input.coverMotif || 'sage',
    }
    db.graves.push(grave)
    return grave
  })
}

function saveVisit(input) {
  return mutate((db) => {
    if (input.id) {
      const idx = db.visits.findIndex((v) => v.id === input.id)
      if (idx >= 0) {
        const prev = db.visits[idx]
        if (db.currentFamilyId && prev.familyId !== db.currentFamilyId) return null
        const patch = Object.assign({}, input)
        delete patch.familyId
        delete patch.createdAt
        db.visits[idx] = Object.assign({}, prev, patch, { familyId: prev.familyId })
        return db.visits[idx]
      }
    }
    if (db.currentFamilyId && input.familyId && input.familyId !== db.currentFamilyId) return null
    const visit = {
      id: uid('v-'),
      createdAt: new Date().toISOString(),
      familyId: input.familyId,
      graveId: input.graveId,
      date: input.date,
      title: input.title,
      body: input.body,
      tags: input.tags || [],
      photos: input.photos || [],
      authorName: input.authorName,
    }
    db.visits.push(visit)
    return visit
  })
}

function saveSchedule(input) {
  return mutate((db) => {
    if (input.id) {
      const idx = db.schedules.findIndex((s) => s.id === input.id)
      if (idx >= 0) {
        const prev = db.schedules[idx]
        if (db.currentFamilyId && prev.familyId !== db.currentFamilyId) return null
        const patch = Object.assign({}, input)
        delete patch.familyId
        db.schedules[idx] = Object.assign({}, prev, patch, { familyId: prev.familyId })
        return db.schedules[idx]
      }
    }
    if (db.currentFamilyId && input.familyId && input.familyId !== db.currentFamilyId) return null
    const schedule = {
      id: uid('s-'),
      familyId: input.familyId,
      graveId: input.graveId,
      type: input.type,
      title: input.title,
      date: input.date,
      rule: input.rule,
      remindDays: input.remindDays || [7, 3, 1],
      assignee: input.assignee,
    }
    db.schedules.push(schedule)
    return schedule
  })
}

function toggleChecklistItem(checklistId, itemId, by) {
  return mutate((db) => {
    const list = db.checklists.find((c) => c.id === checklistId)
    if (!list) return
    if (db.currentFamilyId && list.familyId !== db.currentFamilyId) return
    const item = list.items.find((i) => i.id === itemId)
    if (!item) return
    item.checked = !item.checked
    item.checkedBy = item.checked ? by : ''
    item.checkedAt = item.checked ? todayISO() : ''
  })
}

function resetChecklistFromTemplate(checklistId) {
  return mutate((db) => {
    const list = db.checklists.find((c) => c.id === checklistId)
    if (!list) return
    if (db.currentFamilyId && list.familyId !== db.currentFamilyId) return
    const tmpl =
      (list.templateId && (db.templates || []).find((t) => t.id === list.templateId)) ||
      (db.templates || []).find((t) => t.familyId === list.familyId)
    if (tmpl && tmpl.items && tmpl.items.length) {
      list.items = tmpl.items.map((t) => ({
        id: uid('i'),
        name: t.name,
        qty: t.qty,
        unit: t.unit || '',
        required: !!t.required,
        checked: false,
        checkedBy: '',
        checkedAt: '',
      }))
      list.fromTemplate = true
      list.templateId = tmpl.id
    } else {
      list.items.forEach((i) => {
        i.checked = false
        i.checkedBy = ''
        i.checkedAt = ''
      })
    }
  })
}

/** Clone a family template into a new checklist instance (for a grave/schedule/year). */
function cloneTemplateToChecklist(opts) {
  return mutate((db) => {
    const familyId = opts.familyId
    const tmpl =
      (opts.templateId && (db.templates || []).find((t) => t.id === opts.templateId)) ||
      (db.templates || []).find((t) => t.familyId === familyId)
    if (!tmpl) return null
    const year = opts.year || String(todayISO()).slice(0, 4)
    const title = opts.title || year + ' ' + (opts.type || tmpl.name.replace('模板', '') || '物资') + '清单'
    const list = {
      id: uid('c-'),
      familyId: familyId,
      graveId: opts.graveId || null,
      scheduleId: opts.scheduleId || null,
      templateId: tmpl.id,
      title: title,
      fromTemplate: true,
      items: tmpl.items.map((t) => ({
        id: uid('i'),
        name: t.name,
        qty: t.qty,
        unit: t.unit || '',
        required: !!t.required,
        checked: false,
        checkedBy: '',
        checkedAt: '',
      })),
    }
    db.checklists.push(list)
    return list
  })
}

function updateChecklistItems(checklistId, items) {
  return mutate((db) => {
    const list = db.checklists.find((c) => c.id === checklistId)
    if (!list) return
    if (db.currentFamilyId && list.familyId !== db.currentFamilyId) return
    list.items = items
  })
}

function addChecklistItem(checklistId, partial) {
  return mutate((db) => {
    const list = db.checklists.find((c) => c.id === checklistId)
    if (!list) return null
    if (db.currentFamilyId && list.familyId !== db.currentFamilyId) return null
    const item = {
      id: uid('i'),
      name: (partial && partial.name) || '新物品',
      qty: (partial && partial.qty) || 1,
      unit: (partial && partial.unit) || '',
      required: !!(partial && partial.required),
      checked: false,
      checkedBy: '',
      checkedAt: '',
    }
    list.items.push(item)
    return item
  })
}

function deleteChecklistItem(checklistId, itemId) {
  return mutate((db) => {
    const list = db.checklists.find((c) => c.id === checklistId)
    if (!list) return
    if (db.currentFamilyId && list.familyId !== db.currentFamilyId) return
    list.items = list.items.filter((i) => i.id !== itemId)
  })
}

function updateChecklistItem(checklistId, itemId, patch) {
  return mutate((db) => {
    const list = db.checklists.find((c) => c.id === checklistId)
    if (!list) return
    if (db.currentFamilyId && list.familyId !== db.currentFamilyId) return
    const item = list.items.find((i) => i.id === itemId)
    if (!item) return
    Object.assign(item, patch)
  })
}

function nextSchedule(familyId) {
  const today = todayISO()
  const list = familySchedules(familyId)
  const enriched = list
    .map((s) => {
      const occ = nextOccurrence(s, today)
      return occ ? Object.assign({}, s, { nextDate: occ }) : null
    })
    .filter(Boolean)
    .sort((a, b) => a.nextDate.localeCompare(b.nextDate))
  return enriched[0] || null
}


function deleteVisit(id) {
  return mutate((db) => {
    const idx = db.visits.findIndex((v) => v.id === id)
    if (idx < 0) return false
    if (db.currentFamilyId && db.visits[idx].familyId !== db.currentFamilyId) return false
    db.visits.splice(idx, 1)
    return true
  })
}

function deleteSchedule(id) {
  return mutate((db) => {
    const idx = db.schedules.findIndex((s) => s.id === id)
    if (idx < 0) return false
    if (db.currentFamilyId && db.schedules[idx].familyId !== db.currentFamilyId) return false
    db.schedules.splice(idx, 1)
    return true
  })
}

function deleteGrave(id) {
  return mutate((db) => {
    const idx = db.graves.findIndex((g) => g.id === id)
    if (idx < 0) return false
    if (db.currentFamilyId && db.graves[idx].familyId !== db.currentFamilyId) return false
    db.graves.splice(idx, 1)
    db.visits = db.visits.filter((v) => v.graveId !== id)
    db.schedules = db.schedules.filter((s) => s.graveId !== id)
    db.checklists = db.checklists.filter((c) => c.graveId !== id)
    return true
  })
}

function myRole(familyId) {
  const db = load()
  if (!db.sessionUserId || !familyId) return null
  const m = db.members.find((x) => x.familyId === familyId && x.userId === db.sessionUserId)
  return m ? m.role : null
}

function canEditFamily(familyId) {
  const role = myRole(familyId)
  return role === 'owner' || role === 'editor'
}

function removeMember(familyId, userId) {
  return mutate((db) => {
    const me = db.sessionUserId
    const my = db.members.find((m) => m.familyId === familyId && m.userId === me)
    if (!my || my.role !== 'owner') return { ok: false, reason: '仅所有者可移除成员' }
    const target = db.members.find((m) => m.familyId === familyId && m.userId === userId)
    if (!target) return { ok: false, reason: '成员不存在' }
    if (target.role === 'owner') return { ok: false, reason: '不能移除所有者' }
    if (target.userId === me) return { ok: false, reason: '不能移除自己' }
    db.members = db.members.filter((m) => !(m.familyId === familyId && m.userId === userId))
    return { ok: true }
  })
}

function setMemberRole(familyId, userId, role) {
  return mutate((db) => {
    const me = db.sessionUserId
    const my = db.members.find((m) => m.familyId === familyId && m.userId === me)
    if (!my || my.role !== 'owner') return { ok: false, reason: '仅所有者可改角色' }
    if (role !== 'editor' && role !== 'viewer') return { ok: false, reason: '角色无效' }
    const target = db.members.find((m) => m.familyId === familyId && m.userId === userId)
    if (!target) return { ok: false, reason: '成员不存在' }
    if (target.role === 'owner') return { ok: false, reason: '不能改所有者角色' }
    target.role = role
    return { ok: true }
  })
}

function leaveFamily(familyId) {
  return mutate((db) => {
    const me = db.sessionUserId
    const my = db.members.find((m) => m.familyId === familyId && m.userId === me)
    if (!my) return { ok: false, reason: '不在该家庭' }
    if (my.role === 'owner') {
      const others = db.members.filter((m) => m.familyId === familyId && m.userId !== me)
      if (others.length) return { ok: false, reason: '所有者请先移交或移除其他成员' }
    }
    db.members = db.members.filter((m) => !(m.familyId === familyId && m.userId === me))
    if (db.currentFamilyId === familyId) {
      const next = db.members.find((m) => m.userId === me)
      db.currentFamilyId = next ? next.familyId : null
    }
    return { ok: true }
  })
}

module.exports = {
  ensureSeed,
  resetDemo,
  enterDemo,
  logout,
  loginWeChat,
  loginWithPhone,
  createFamily,
  joinFamily,
  setCurrentFamily,
  belongsToFamily,
  currentUser,
  currentFamily,
  myFamilies,
  familyMembers,
  familyGraves,
  familyVisits,
  familySchedules,
  familyChecklists,
  familyTemplates,
  getGrave,
  getVisit,
  getSchedule,
  getChecklist,
  getTemplate,
  saveGrave,
  saveVisit,
  saveSchedule,
  toggleChecklistItem,
  resetChecklistFromTemplate,
  cloneTemplateToChecklist,
  updateChecklistItems,
  addChecklistItem,
  deleteChecklistItem,
  updateChecklistItem,
  nextSchedule,
  TEMPLATE_ITEMS,
  deleteVisit,
  deleteSchedule,
  deleteGrave,
  myRole,
  canEditFamily,
  removeMember,
  setMemberRole,
  leaveFamily,
}
