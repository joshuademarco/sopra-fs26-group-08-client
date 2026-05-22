
export type RaidState = 'lobby' | 'active' | 'defeat' | 'victory'
export type MemberStatus = 'Ready' | 'Offline' | 'Pending' | 'Declined'


export interface RaidMemberData {
  userId: number
  username: string
  online: boolean
  joined: boolean
  accepted: boolean | null
  tasksCompleted: number
  tasksFailed: number
  damageDealt: number
  xpEarned: number
  mvp: boolean
  health: number | null
  maxHealth: number | null
  characterType?: string | null
  knockedOut?: boolean
  droppedItem?: DroppedItem | null
}

export interface RaidTaskData {
  id: number
  title: string
  description: string
  successfulDamage: number
  groupDamage: number
  timeLimitSeconds: number | null
  taskOrder: number | null
  windowStartSeconds: number | null
  completedByUserIds: number[]
  successfullyCompletedByUsers: number[]
  assignedUserId: number | null
}

export interface RaidData {
  id: number
  name: string
  status: 'SCHEDULED' | 'ACTIVE' | 'DEFEATED' | 'FAILED'
  scheduledTime: string | null
  health: number
  maxHealth: number
  durationSeconds: number
  startedAt: string | null
  groupId: number
  groupName: string
  users: RaidMemberData[]
  tasks: RaidTaskData[]
}

export interface GroupWithRaids {
  groupId: number
  groupName: string
  raids: RaidData[]
}

export interface DroppedItem {
  id: number
  name: string
  assetKey: string
  itemType: 'HAT' | 'CHESTPIECE' | 'HANDHELD'
}

export interface RaidMember {
  userId: number
  name: string
  status: MemberStatus
  joined: boolean
  isCurrentUser?: boolean
  characterType?: string | null
  level?: number
  taskDescription?: string
  taskDamage?: number
  tasksCompleted?: number
  totalTasks?: number
  xpChange?: number
  died?: boolean
  mvp?: boolean
  damageDealt?: number
  health?: number | null
  maxHealth?: number | null
  droppedItem?: DroppedItem | null
}

export interface Monster {
  name: string
  level: number
  description: string
  hpPercent: number
  hp?: number
  maxHp?: number
}

export interface BossRaid {
  id: number
  groupName: string
  playersOnline: number
  members: RaidMember[]
  raidStartsIn?: string
  timeLeftSeconds?: number
  totalSeconds?: number
  durationSeconds?: number
  tasksCount?: number
  estimatedReward?: number
  state: RaidState
  monster: Monster
}
