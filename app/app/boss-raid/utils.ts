import { BossRaid, RaidMember, RaidState } from '@/components/raid-card'
import { RaidData, RaidMemberData, RaidTaskData } from '@/types/raids'

export const MONSTER_IMAGE = '/characters/bosses/innereschweinehund.png'
export const RECONNECT_DELAY_MS = 2000

export function calcTimeLeft(startedAt: string | null, durationSeconds: number): number {
  if (!startedAt) return durationSeconds
  const elapsed = Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000)
  return Math.max(0, durationSeconds - elapsed)
}

export function raidStatusToState(status: string): RaidState {
  switch (status) {
    case 'ACTIVE':
      return 'active'
    case 'DEFEATED':
      return 'victory'
    case 'FAILED':
      return 'defeat'
    default:
      return 'lobby'
  }
}

export function assignedPendingTasks(tasks: RaidTaskData[], userId: number): RaidTaskData[] {
  return tasks.filter((t) => t.assignedUserId === userId && !(t.completedByUserIds ?? []).includes(userId))
}

export function assignedTasks(tasks: RaidTaskData[], userId: number): RaidTaskData[] {
  return tasks.filter((t) => t.assignedUserId === userId)
}

export function sortRaidUsers(users: RaidMemberData[]): RaidMemberData[] {
  return [...users].sort((left, right) => left.username.localeCompare(right.username))
}

export function taskWindowSecondsLeft(task: RaidTaskData, startedAt: string | null): number {
  if (!startedAt || task.windowStartSeconds == null || task.timeLimitSeconds == null) return Infinity
  const raidStart = new Date(startedAt).getTime()
  const windowEnd = raidStart + (task.windowStartSeconds + task.timeLimitSeconds) * 1000
  return Math.floor((windowEnd - Date.now()) / 1000)
}

export function getActiveTask(tasks: RaidTaskData[], userId: number, startedAt: string | null): RaidTaskData | null {
  const myTasks = assignedTasks(tasks, userId).sort((a, b) => (a.taskOrder ?? 0) - (b.taskOrder ?? 0))
  for (const task of myTasks) {
    if (task.completedByUserIds.includes(userId)) continue
    if (taskWindowSecondsLeft(task, startedAt) > 0) return task
    // window expired without completion —> backend will auto-fail it
  }
  return null
}

export function getUpcomingTasks(
  tasks: RaidTaskData[],
  userId: number,
  startedAt: string | null,
  activeTask: RaidTaskData | null,
): RaidTaskData[] {
  const myTasks = assignedTasks(tasks, userId).sort((a, b) => (a.taskOrder ?? 0) - (b.taskOrder ?? 0))
  const upcomingTasks: RaidTaskData[] = []

  const activeTaskId = activeTask?.id
  let shouldUpcoming = activeTaskId == null

  for (const task of myTasks) {
    const isCompletedByUser = task.completedByUserIds.includes(userId)
    const isWindowExpired = taskWindowSecondsLeft(task, startedAt) <= 0

    if (isCompletedByUser || isWindowExpired) continue

    if (!shouldUpcoming) {
      if (task.id === activeTaskId) {
        shouldUpcoming = true
      }
      continue
    }

    upcomingTasks.push(task)
  }

  return upcomingTasks
}

export function toRaidCard(raid: RaidData, currentUserId: number | string | undefined, onlineUserIds: Set<number>): BossRaid {
  const state = raidStatusToState(raid.status)
  const hpPercent = raid.maxHealth > 0 ? (raid.health / raid.maxHealth) * 100 : 0
  const timeLeft = calcTimeLeft(raid.startedAt, raid.durationSeconds)
  const tasks = raid.tasks ?? []

  const orderedUsers = sortRaidUsers(raid.users ?? [])

  const members: RaidMember[] = orderedUsers.map((member) => {
    const isCurrentUser = currentUserId !== undefined && member.userId === Number(currentUserId)
    const myTasks = assignedTasks(tasks, member.userId)
    const myPending = assignedPendingTasks(tasks, member.userId)

    if (state === 'lobby') {
      return {
        name: member.username,
        isCurrentUser,
        status: member.joined ? 'Ready' : onlineUserIds.has(member.userId) ? 'Pending' : 'Offline',
      }
    }

    if (state === 'active') {
      const nextTask = myPending[0]
      return {
        name: member.username,
        isCurrentUser,
        status: 'Ready',
        taskDescription: nextTask ? nextTask.title : 'All tasks done!',
        taskDamage: nextTask?.successfulDamage,
        tasksCompleted: myTasks.length - myPending.length,
        totalTasks: myTasks.length,
      }
    }

    // defeat or victory
    return {
      name: member.username,
      isCurrentUser,
      status: 'Ready',
      tasksCompleted: myTasks.filter((task) => (task.successfullyCompletedByUsers ?? []).includes(member.userId)).length,
      totalTasks: myTasks.length,
      xpChange: member.damageDealt,
      died: false,
    }
  })

  let raidStartsIn: string | undefined
  if (raid.scheduledTime && state === 'lobby') {
    const diff = Math.max(0, Math.floor((new Date(raid.scheduledTime).getTime() - Date.now()) / 1000))
    const h = Math.floor(diff / 3600)
    const m = Math.floor((diff % 3600) / 60)
    const s = diff % 60
    raidStartsIn = h > 0 ? `${h}h ${m}m` : m > 0 ? `${m}m ${s}s` : `${s}s`
  }

  return {
    id: raid.id,
    groupName: raid.groupName,
    playersOnline: members.filter((m) => m.status !== 'Offline').length,
    members,
    raidStartsIn,
    timeLeftSeconds: state === 'active' ? timeLeft : undefined,
    totalSeconds: state === 'active' ? raid.durationSeconds : undefined,
    state,
    monster: {
      name: raid.name,
      level: Math.max(1, Math.floor(raid.maxHealth / 100)),
      description: `A fearsome boss with ${raid.maxHealth} HP appeared. Only with teamwork you can defeat the boss!`,
      hpPercent,
      imageUrl: MONSTER_IMAGE,
    },
  }
}
