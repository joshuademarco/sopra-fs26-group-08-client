'use client'

import { RaidData, RaidTaskData } from '@/types/raids'
import { RaidCard } from '@/components/raid-card'
import { Button } from '@/components/ui/button'
import { MemberHealthBar } from './member-health-bar'
import { TaskCard } from './task-card'
import { assignedTasks, getActiveTask, getUpcomingTasks, raidStatusToState, sortRaidUsers, toRaidCard } from './utils'
import { Check } from 'lucide-react'

export function RaidView({
  raid,
  currentUserId,
  onlineUserIds,
  onJoin,
  onCompleteTask,
}: {
  raid: RaidData
  currentUserId: number | string
  onlineUserIds: Set<number>
  onJoin: () => void
  onCompleteTask: (task: RaidTaskData, success: boolean) => void
}) {
  const uid = Number(currentUserId)
  const cardData = toRaidCard(raid, currentUserId, onlineUserIds)
  const state = raidStatusToState(raid.status)
  const isJoined = raid.users?.find((m) => m.userId === uid)?.joined ?? false
  const tasks = raid.tasks ?? []

  const activeTask = state === 'active' ? getActiveTask(tasks, uid, raid.startedAt) : null
  const upcomingTasks = state === 'active' ? getUpcomingTasks(tasks, uid, raid.startedAt, activeTask) : []
  const myDone = assignedTasks(tasks, uid).filter((task) => (task.successfullyCompletedByUsers ?? []).includes(uid))
  const allMyTasks = assignedTasks(tasks, uid)
  const orderedUsers = sortRaidUsers(raid.users ?? [])

  return (
    <div className='flex flex-col gap-4'>
      <RaidCard raid={cardData} />

      {state === 'lobby' && !isJoined && (
        <div className='flex justify-center'>
          <Button onClick={onJoin}>Join Raid</Button>
        </div>
      )}

      {state === 'active' && (
        <div className='flex flex-col gap-2'>
          <p className='text-sm font-semibold'>Team Health</p>
          <div className='grid grid-cols-1 gap-2 sm:grid-cols-2'>
            {orderedUsers
              .filter((user) => user.joined)
              .map((user) => (
                <MemberHealthBar key={user.userId} member={user} isCurrentUser={user.userId === uid} />
              ))}
          </div>
        </div>
      )}

      {state === 'active' && isJoined && (
        <div className='flex flex-col gap-3'>
          <p className='text-sm font-semibold'>Your tasks</p>

          {allMyTasks.length === 0 && <p className='text-sm text-muted-foreground'>No tasks assigned to you yet.</p>}

          {activeTask && (
            <TaskCard
              key={activeTask.id}
              task={activeTask}
              startedAt={raid.startedAt}
              onSuccess={() => onCompleteTask(activeTask, true)}
            />
          )}

          {upcomingTasks.length > 0 && (
            <div className='flex flex-col gap-2'>
              <p className='text-xs font-medium text-muted-foreground uppercase tracking-wide'>Upcoming</p>
              {upcomingTasks.map((task) => (
                <div key={task.id} className='flex items-center gap-3 rounded-lg border bg-muted/20 px-4 py-3 opacity-60'>
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-medium text-muted-foreground'>{task.title}</p>
                    {task.timeLimitSeconds != null && (
                      <p className='text-xs text-muted-foreground'>
                        {task.timeLimitSeconds}s time, {task.successfulDamage ?? 0} damage dealt
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {myDone.map((task) => (
            <div key={task.id} className='flex items-center gap-3 rounded-lg border bg-muted/40 px-4 py-3 opacity-60'>
              <span className='flex size-7 shrink-0 items-center justify-center rounded-full bg-green-500'>
                <Check className='size-4' />
              </span>
              <p className='text-sm line-through text-muted-foreground'>{task.title}</p>
            </div>
          ))}

          {activeTask == null && upcomingTasks.length === 0 && myDone.length > 0 && (
            <p className='text-center text-sm text-green-600 font-medium'>
              Congratulations! all your tasks are done, waiting for teammates…
            </p>
          )}
        </div>
      )}

      {state === 'active' && !isJoined && (
        <div className='flex justify-center'>
          <Button variant='outline' onClick={onJoin}>
            Join Ongoing Raid
          </Button>
        </div>
      )}
    </div>
  )
}
