import type {
  AppDB,
  Checklist,
  Family,
  Grave,
  Schedule,
  Visit,
  User,
  Member,
  ChecklistItem,
} from './types'
import { todayISO, uid } from './ids'

const KEY = 'baishanla.db.v1'

function seed(): AppDB {
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

  const users: User[] = [
    { id: ownerId, phone: '13800000001', nickname: '小林', avatarColor: '#7BAF9E' },
    { id: momId, phone: '13800000002', nickname: '妈妈', avatarColor: '#E7B8B0' },
    { id: dadId, phone: '13800000003', nickname: '爸爸', avatarColor: '#5F9483' },
    { id: meId, phone: '13800000004', nickname: '我', avatarColor: '#B7D0C4' },
  ]

  const families: Family[] = [
    {
      id: familyId,
      name: '小林家',
      theme: 'spring_qingming',
      ownerUserId: ownerId,
      inviteToken: invite,
    },
  ]

  const members: Member[] = [
    { familyId, userId: ownerId, role: 'owner', nickname: '小林', joinedAt: '2025-01-01' },
    { familyId, userId: momId, role: 'editor', nickname: '妈妈', joinedAt: '2025-01-02' },
    { familyId, userId: dadId, role: 'editor', nickname: '爸爸', joinedAt: '2025-01-02' },
    { familyId, userId: meId, role: 'editor', nickname: '我', joinedAt: '2025-03-01' },
  ]

  const graves: Grave[] = [
    {
      id: grave1,
      familyId,
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
      familyId,
      name: '后山',
      memorialFor: '曾祖父',
      address: '老家后山坡',
      lat: 30.3,
      lng: 120.2,
      note: '村里小路尽头，注意雨天湿滑。',
      coverLabel: '春山封面',
    },
  ]

  const visits: Visit[] = [
    {
      id: 'v-2025-qm',
      familyId,
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
      familyId,
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
      familyId,
      graveId: grave1,
      date: '2024-10-11',
      title: '2024 重阳',
      body: '秋高气爽，扫了扫落叶。',
      tags: ['重阳'],
      photos: [],
      authorName: '小林',
      createdAt: '2024-10-11T11:00:00',
    },
  ]

  const schedules: Schedule[] = [
    {
      id: scheduleId,
      familyId,
      graveId: grave1,
      type: '清明',
      title: '清明',
      date: '2026-04-04',
      rule: 'yearly',
      remindDays: [7, 3, 1],
      assignee: '妈妈',
    },
  ]

  const checklists: Checklist[] = [
    {
      id: checklistId,
      familyId,
      graveId: grave1,
      scheduleId,
      title: '2026 清明清单',
      fromTemplate: true,
      items: [
        { id: 'i1', name: '水果', qty: 1, unit: '份', required: false, checked: true, checkedBy: '妈妈' },
        { id: 'i2', name: '香烛', qty: 1, unit: '套', required: false, checked: false },
        { id: 'i3', name: '纸钱', qty: 2, unit: '刀', required: true, checked: false },
        { id: 'i4', name: '湿纸巾', qty: 1, unit: '', required: false, checked: true, checkedBy: '爸爸' },
        { id: 'i5', name: '鲜花', qty: 1, unit: '束', required: false, checked: false },
        { id: 'i6', name: '矿泉水', qty: 2, unit: '瓶', required: false, checked: true, checkedBy: '小林' },
        { id: 'i7', name: '垃圾袋', qty: 2, unit: '个', required: true, checked: false },
        { id: 'i8', name: '抹布', qty: 1, unit: '块', required: false, checked: false },
        { id: 'i9', name: '打火机', qty: 1, unit: '个', required: false, checked: true, checkedBy: '爸爸' },
        { id: 'i10', name: '零钱', qty: 1, unit: '份', required: false, checked: false },
      ],
    },
  ]

  return {
    version: 1,
    sessionUserId: null,
    currentFamilyId: null,
    users,
    families,
    members,
    graves,
    visits,
    schedules,
    checklists,
  }
}

let cache: AppDB | null = null
const listeners = new Set<() => void>()

function load(): AppDB {
  if (cache) return cache
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      cache = JSON.parse(raw) as AppDB
      return cache
    }
  } catch {
    /* ignore */
  }
  cache = seed()
  persist()
  return cache
}

function persist() {
  if (!cache) return
  localStorage.setItem(KEY, JSON.stringify(cache))
  listeners.forEach((l) => l())
}

export function subscribe(fn: () => void) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export function getDB(): AppDB {
  return load()
}

export function resetDemo() {
  cache = seed()
  persist()
}

export function enterDemo() {
  const db = load()
  db.sessionUserId = 'u-me'
  db.currentFamilyId = 'f-xiaolin'
  persist()
}

export function logout() {
  const db = load()
  db.sessionUserId = null
  db.currentFamilyId = null
  persist()
}

export function loginWithPhone(phone: string, nickname?: string): User {
  const db = load()
  let user = db.users.find((u) => u.phone === phone)
  if (!user) {
    user = {
      id: uid('u-'),
      phone,
      nickname: nickname || `用户${phone.slice(-4)}`,
      avatarColor: '#7BAF9E',
    }
    db.users.push(user)
  }
  db.sessionUserId = user.id
  const membership = db.members.find((m) => m.userId === user!.id)
  db.currentFamilyId = membership?.familyId ?? null
  persist()
  return user
}

export function createFamily(name: string): Family {
  const db = load()
  if (!db.sessionUserId) throw new Error('未登录')
  const family: Family = {
    id: uid('f-'),
    name,
    theme: 'spring_qingming',
    ownerUserId: db.sessionUserId,
    inviteToken: `INVITE-${uid('').toUpperCase()}`,
  }
  db.families.push(family)
  const user = db.users.find((u) => u.id === db.sessionUserId)!
  db.members.push({
    familyId: family.id,
    userId: user.id,
    role: 'owner',
    nickname: user.nickname,
    joinedAt: todayISO(),
  })
  db.currentFamilyId = family.id
  persist()
  return family
}

export function joinFamily(token: string): Family | null {
  const db = load()
  if (!db.sessionUserId) throw new Error('未登录')
  const family = db.families.find(
    (f) => f.inviteToken.toLowerCase() === token.trim().toLowerCase(),
  )
  if (!family) return null
  const exists = db.members.some(
    (m) => m.familyId === family.id && m.userId === db.sessionUserId,
  )
  if (!exists) {
    const user = db.users.find((u) => u.id === db.sessionUserId)!
    db.members.push({
      familyId: family.id,
      userId: user.id,
      role: 'editor',
      nickname: user.nickname,
      joinedAt: todayISO(),
    })
  }
  db.currentFamilyId = family.id
  persist()
  return family
}

export function setCurrentFamily(id: string) {
  const db = load()
  db.currentFamilyId = id
  persist()
}

export function currentUser(): User | null {
  const db = load()
  return db.users.find((u) => u.id === db.sessionUserId) ?? null
}

export function currentFamily(): Family | null {
  const db = load()
  return db.families.find((f) => f.id === db.currentFamilyId) ?? null
}

export function familyMembers(familyId: string): Member[] {
  return load().members.filter((m) => m.familyId === familyId)
}

export function familyGraves(familyId: string): Grave[] {
  return load().graves.filter((g) => g.familyId === familyId)
}

export function familyVisits(familyId: string): Visit[] {
  return load()
    .visits.filter((v) => v.familyId === familyId)
    .sort((a, b) => b.date.localeCompare(a.date))
}

export function familySchedules(familyId: string): Schedule[] {
  return load()
    .schedules.filter((s) => s.familyId === familyId)
    .sort((a, b) => a.date.localeCompare(b.date))
}

export function familyChecklists(familyId: string): Checklist[] {
  return load().checklists.filter((c) => c.familyId === familyId)
}

export function getGrave(id: string): Grave | undefined {
  return load().graves.find((g) => g.id === id)
}

export function getVisit(id: string): Visit | undefined {
  return load().visits.find((v) => v.id === id)
}

export function getSchedule(id: string): Schedule | undefined {
  return load().schedules.find((s) => s.id === id)
}

export function getChecklist(id: string): Checklist | undefined {
  return load().checklists.find((c) => c.id === id)
}

export function saveGrave(input: Omit<Grave, 'id'> & { id?: string }): Grave {
  const db = load()
  if (input.id) {
    const idx = db.graves.findIndex((g) => g.id === input.id)
    if (idx >= 0) {
      db.graves[idx] = { ...db.graves[idx], ...input, id: input.id }
      persist()
      return db.graves[idx]
    }
  }
  const grave: Grave = {
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
  persist()
  return grave
}

export function saveVisit(input: Omit<Visit, 'id' | 'createdAt'> & { id?: string }): Visit {
  const db = load()
  if (input.id) {
    const idx = db.visits.findIndex((v) => v.id === input.id)
    if (idx >= 0) {
      db.visits[idx] = { ...db.visits[idx], ...input, id: input.id }
      persist()
      return db.visits[idx]
    }
  }
  const visit: Visit = {
    id: uid('v-'),
    createdAt: new Date().toISOString(),
    familyId: input.familyId,
    graveId: input.graveId,
    date: input.date,
    title: input.title,
    body: input.body,
    tags: input.tags,
    photos: input.photos,
    authorName: input.authorName,
  }
  db.visits.push(visit)
  persist()
  return visit
}

export function saveSchedule(
  input: Omit<Schedule, 'id'> & { id?: string },
): Schedule {
  const db = load()
  if (input.id) {
    const idx = db.schedules.findIndex((s) => s.id === input.id)
    if (idx >= 0) {
      db.schedules[idx] = { ...db.schedules[idx], ...input, id: input.id }
      persist()
      return db.schedules[idx]
    }
  }
  const schedule: Schedule = {
    id: uid('s-'),
    familyId: input.familyId,
    graveId: input.graveId,
    type: input.type,
    title: input.title,
    date: input.date,
    rule: input.rule,
    remindDays: input.remindDays,
    assignee: input.assignee,
  }
  db.schedules.push(schedule)
  persist()
  return schedule
}

export function toggleChecklistItem(checklistId: string, itemId: string, by: string) {
  const db = load()
  const list = db.checklists.find((c) => c.id === checklistId)
  if (!list) return
  const item = list.items.find((i) => i.id === itemId)
  if (!item) return
  item.checked = !item.checked
  item.checkedBy = item.checked ? by : undefined
  persist()
}

export function resetChecklistFromTemplate(checklistId: string) {
  const db = load()
  const list = db.checklists.find((c) => c.id === checklistId)
  if (!list) return
  list.items.forEach((i) => {
    i.checked = false
    i.checkedBy = undefined
  })
  persist()
}

export function updateChecklistItems(checklistId: string, items: ChecklistItem[]) {
  const db = load()
  const list = db.checklists.find((c) => c.id === checklistId)
  if (!list) return
  list.items = items
  persist()
}

export function mapsNavigateUrl(grave: Grave): string {
  if (grave.lat != null && grave.lng != null) {
    return `https://uri.amap.com/navigation?to=${grave.lng},${grave.lat},${encodeURIComponent(grave.name)}&mode=car&coordinate=gaode`
  }
  return `https://uri.amap.com/search?keyword=${encodeURIComponent(grave.address || grave.name)}`
}

export function nextSchedule(familyId: string): Schedule | undefined {
  const today = todayISO()
  return familySchedules(familyId).find((s) => s.date >= today) ?? familySchedules(familyId)[0]
}
