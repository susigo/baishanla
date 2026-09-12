const { uid, todayISO } = require('./ids')

const KEY = 'baishanla.db.v1'

function seed() {
  const ownerId = 'u-owner'
  const momId = 'u-mom'
  const dadId = 'u-dad'
  const meId = 'u-me'
  const familyId = 'f-xiaolin'
  const grave1 = 'g-qingshan'
  const grave2 = 'g-houshan'
  const scheduleId = 's-qingming'
  const checklistId = 'c-qingming'
  const invite = 'INVITE-XIAOLIN'

  return {
    version: 1,
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
    ],
    checklists: [
      {
        id: checklistId,
        familyId: familyId,
        graveId: grave1,
        scheduleId: scheduleId,
        title: '2026 清明清单',
        fromTemplate: true,
        items: [
          { id: 'i1', name: '水果', qty: 1, unit: '份', required: false, checked: true, checkedBy: '妈妈', checkedAt: '2026-03-28' },
          { id: 'i2', name: '香烛', qty: 1, unit: '套', required: false, checked: false },
          { id: 'i3', name: '纸钱', qty: 2, unit: '刀', required: true, checked: false },
          { id: 'i4', name: '湿纸巾', qty: 1, unit: '', required: false, checked: true, checkedBy: '爸爸', checkedAt: '2026-03-30' },
          { id: 'i5', name: '鲜花', qty: 1, unit: '束', required: false, checked: false },
          { id: 'i6', name: '矿泉水', qty: 2, unit: '瓶', required: false, checked: true, checkedBy: '小林', checkedAt: '2026-04-01' },
          { id: 'i7', name: '垃圾袋', qty: 2, unit: '个', required: true, checked: false },
          { id: 'i8', name: '抹布', qty: 1, unit: '块', required: false, checked: false },
          { id: 'i9', name: '打火机', qty: 1, unit: '个', required: false, checked: true, checkedBy: '爸爸', checkedAt: '2026-03-29' },
          { id: 'i10', name: '零钱', qty: 1, unit: '份', required: false, checked: false },
        ],
      },
    ],
  }
}

function load() {
  try {
    const raw = wx.getStorageSync(KEY)
    if (raw && raw.version) return raw
    if (typeof raw === 'string' && raw) {
      const parsed = JSON.parse(raw)
      if (parsed && parsed.version) return parsed
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
  try { wx.removeStorageSync('baishanla.subscribeOptIn') } catch (e) { /* ignore */ }
  try { wx.removeStorageSync('baishanla.pendingInvite') } catch (e) { /* ignore */ }
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
    db.currentFamilyId = id
  })
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

function saveGrave(input) {
  return mutate((db) => {
    if (input.id) {
      const idx = db.graves.findIndex((g) => g.id === input.id)
      if (idx >= 0) {
        db.graves[idx] = Object.assign({}, db.graves[idx], input)
        return db.graves[idx]
      }
    }
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
        db.visits[idx] = Object.assign({}, db.visits[idx], input)
        return db.visits[idx]
      }
    }
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
        db.schedules[idx] = Object.assign({}, db.schedules[idx], input)
        return db.schedules[idx]
      }
    }
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
    list.items.forEach((i) => {
      i.checked = false
      i.checkedBy = ''
      i.checkedAt = ''
    })
  })
}

function updateChecklistItems(checklistId, items) {
  return mutate((db) => {
    const list = db.checklists.find((c) => c.id === checklistId)
    if (!list) return
    list.items = items
  })
}

function nextSchedule(familyId) {
  const today = todayISO()
  const list = familySchedules(familyId)
  return list.find((s) => s.date >= today) || list[0]
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
  currentUser,
  currentFamily,
  myFamilies,
  familyMembers,
  familyGraves,
  familyVisits,
  familySchedules,
  familyChecklists,
  getGrave,
  getVisit,
  getSchedule,
  getChecklist,
  saveGrave,
  saveVisit,
  saveSchedule,
  toggleChecklistItem,
  resetChecklistFromTemplate,
  updateChecklistItems,
  nextSchedule,
}
