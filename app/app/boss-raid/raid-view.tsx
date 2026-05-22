'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RaidData, RaidTaskData } from '@/types/raids'
import { Check } from 'lucide-react'
import { ActiveCard } from './cards/active-card'
import { DefeatCard } from './cards/defeat-card'
import { LobbyCard } from './cards/lobby-card'
import { VictoryCard } from './cards/victory-card'
import { TaskCard } from './task-card'
import { assignedTasks, getActiveTask, getUpcomingTasks, raidStatusToState, toRaidCard } from './utils'

function TasksPanel({
  activeTask,
  upcomingTasks,
  doneTasks,
  totalAssigned,
  startedAt,
  onCompleteTask,
  onSkipTask
}: {
  activeTask: RaidTaskData | null
  upcomingTasks: RaidTaskData[]
  doneTasks: RaidTaskData[]
  totalAssigned: number
  startedAt: string | null
  onCompleteTask: (task: RaidTaskData, success: boolean) => void
  onSkipTask: (task: RaidTaskData) => void
}) {
  return (
    <Card className='self-start'>
      <CardHeader>
        <CardTitle className='text-xs uppercase tracking-[0.2em] text-amber-600'>► Your move</CardTitle>
      </CardHeader>
      <CardContent className='flex flex-col gap-4'>
        {totalAssigned === 0 && <p className='text-sm text-muted-foreground'>No tasks assigned to you yet.</p>}

        {activeTask && (
          <TaskCard
            key={activeTask.id}
            task={activeTask}
            startedAt={startedAt}
            onSuccess={() => onCompleteTask(activeTask, true)}
            onSkip={() => onSkipTask(activeTask)}
          />
        )}

        {upcomingTasks.length > 0 && (
          <div className='flex flex-col gap-2'>
            <div className='flex items-center justify-between'>
              <span className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>↓ Upcoming Tasks</span>
              <span className='text-xs text-muted-foreground'>{upcomingTasks.length} queued</span>
            </div>
            {upcomingTasks.map((task) => (
              <div key={task.id} className='flex items-center gap-3 rounded-lg border bg-muted/40 px-3 py-2'>
                <div className='flex min-w-0 flex-1 flex-col'>
                  <p className='truncate text-sm font-medium text-muted-foreground'>{task.title}</p>
                  {task.timeLimitSeconds != null && (
                    <p className='font-mono text-xs text-muted-foreground'>{task.timeLimitSeconds}s</p>
                  )}
                </div>
                <span className='font-mono text-xs text-emerald-600'>+{task.successfulDamage ?? 0}</span>
              </div>
            ))}
          </div>
        )}

        {doneTasks.length > 0 && (
          <div className='flex flex-col gap-1'>
            <span className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>Done</span>
            {doneTasks.map((task) => (
              <div key={task.id} className='flex items-center gap-2 px-1 py-1'>
                <Check className='size-4 text-emerald-600' />
                <span className='text-sm text-muted-foreground line-through'>{task.title}</span>
              </div>
            ))}
          </div>
        )}

        {activeTask == null && upcomingTasks.length === 0 && doneTasks.length > 0 && (
          <p className='text-center text-sm font-medium text-emerald-600'>All your tasks are done — waiting for teammates…</p>
        )}
      </CardContent>
    </Card>
  )
}

export function RaidView({
  raid,
  currentUserId,
  onlineUserIds,
  onJoin,
  onRsvp,
  onCompleteTask,
  onSkipTask
}: {
  raid: RaidData
  currentUserId: number | string
  onlineUserIds: Set<number>
  onJoin: () => void
  onRsvp: (accepted: boolean) => void
  onCompleteTask: (task: RaidTaskData, success: boolean) => void
  onSkipTask: (task: RaidTaskData) => void
}) {
  const uid = Number(currentUserId)
  const cardData = toRaidCard(raid, currentUserId, onlineUserIds)
  const state = raidStatusToState(raid.status)
  const me = raid.users?.find((m) => m.userId === uid)
  const isJoined = me?.joined ?? false
  const isKnockedOut = me?.knockedOut ?? false
  const myRsvp = me?.accepted ?? null
  const tasks = raid.tasks ?? []

  const activeTask = state === 'active' && !isKnockedOut ? getActiveTask(tasks, uid, raid.startedAt) : null
  const upcomingTasks = state === 'active' && !isKnockedOut ? getUpcomingTasks(tasks, uid, raid.startedAt, activeTask) : []
  const myDone = assignedTasks(tasks, uid).filter((task) => (task.successfullyCompletedByUsers ?? []).includes(uid))
  const allMyTasks = assignedTasks(tasks, uid)

  let lobbyActions: React.ReactNode = null
  if (state === 'lobby') {
    if (myRsvp === null) {
      lobbyActions = (
        <div className='flex gap-2'>
          <Button className='flex-1' onClick={() => onRsvp(true)}>
            <Check className='size-4' /> Accept Challenge
          </Button>
          <Button variant='outline' onClick={() => onRsvp(false)}>
            Decline
          </Button>
        </div>
      )
    } else if (myRsvp === true) {
      lobbyActions = (
        <div className='flex items-center justify-between gap-3 rounded-lg border bg-emerald-500/10 px-4 py-3'>
          <p className='text-sm font-medium text-emerald-700'>You accepted this raid</p>
          <Button variant='ghost' size='sm' onClick={() => onRsvp(false)}>
            Change to Decline
          </Button>
        </div>
      )
    } else {
      lobbyActions = (
        <div className='flex items-center justify-between gap-3 rounded-lg border bg-muted px-4 py-3'>
          <p className='text-sm text-muted-foreground'>You declined this raid</p>
          <Button variant='ghost' size='sm' onClick={() => onRsvp(true)}>
            Change to Accept
          </Button>
        </div>
      )
    }
  }

  let tasksSlot: React.ReactNode = null
  if (state === 'active') {
    if (isJoined && isKnockedOut) {
      tasksSlot = (
        <Card className='self-start'>
          <CardContent className='py-6 text-center'>
            <p className='text-sm font-semibold text-destructive'>You are knocked out</p>
            <p className='text-xs text-muted-foreground'>Wait for your teammates to finish the raid.</p>
          </CardContent>
        </Card>
      )
    } else if (isJoined) {
      tasksSlot = (
        <TasksPanel
          activeTask={activeTask}
          upcomingTasks={upcomingTasks}
          doneTasks={myDone}
          totalAssigned={allMyTasks.length}
          startedAt={raid.startedAt}
          onCompleteTask={onCompleteTask}
          onSkipTask={onSkipTask}
        />
      )
    } else {
      tasksSlot = (
        <Card className='self-start'>
          <CardContent className='flex flex-col items-center gap-3 py-6 text-center'>
            <p className='text-sm text-muted-foreground'>You haven&apos;t joined this raid yet.</p>
            <Button variant='outline' onClick={onJoin}>
              Join ongoing raid
            </Button>
          </CardContent>
        </Card>
      )
    }
  }

  switch (cardData.state) {
    case 'lobby':
      return <LobbyCard raid={cardData} lobbyActions={lobbyActions} />
    case 'active':
      return <ActiveCard raid={cardData} tasksSlot={tasksSlot} />
    case 'defeat':
      return <DefeatCard raid={cardData} />
    case 'victory':
      return <VictoryCard raid={cardData} />
  }
}
