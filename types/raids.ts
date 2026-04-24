export interface RaidMemberData {
  userId: number
  username: string
  online: boolean
  joined: boolean
  tasksCompleted: number
  tasksFailed: number
  damageDealt: number
  health: number | null
  maxHealth: number | null
  characterType?: string | null
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
