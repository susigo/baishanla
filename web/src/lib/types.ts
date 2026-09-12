export type Role = 'owner' | 'editor' | 'viewer'

export interface User {
  id: string
  phone: string
  nickname: string
  avatarColor?: string
}

export interface Family {
  id: string
  name: string
  theme: string
  ownerUserId: string
  inviteToken: string
}

export interface Member {
  familyId: string
  userId: string
  role: Role
  nickname: string
  joinedAt: string
}

export interface Grave {
  id: string
  familyId: string
  name: string
  memorialFor: string
  address: string
  lat: number | null
  lng: number | null
  note: string
  coverLabel: string
}

export interface Visit {
  id: string
  familyId: string
  graveId: string
  date: string
  title: string
  body: string
  tags: string[]
  photos: string[]
  authorName: string
  createdAt: string
}

export interface Schedule {
  id: string
  familyId: string
  graveId: string | null
  type: string
  title: string
  date: string
  rule: 'yearly' | 'once'
  remindDays: number[]
  assignee: string
}

export interface ChecklistItem {
  id: string
  name: string
  qty: number
  unit: string
  required: boolean
  checked: boolean
  checkedBy?: string
}

export interface Checklist {
  id: string
  familyId: string
  graveId: string | null
  scheduleId: string | null
  title: string
  fromTemplate: boolean
  items: ChecklistItem[]
}

export interface AppDB {
  version: number
  sessionUserId: string | null
  currentFamilyId: string | null
  users: User[]
  families: Family[]
  members: Member[]
  graves: Grave[]
  visits: Visit[]
  schedules: Schedule[]
  checklists: Checklist[]
}
