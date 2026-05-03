'use client'

import { RaidCard } from '@/components/raid-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { RaidData, RaidTaskData } from '@/types/raids'
import { Check } from 'lucide-react'
import { TaskCard } from './task-card'
import { assignedTasks, getActiveTask, getUpcomingTasks, raidStatusToState, toRaidCard } from './utils'

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

  return (
    <div className='flex flex-col gap-4'>
      <RaidCard raid={cardData} />

      {state === 'lobby' && !isJoined && (
        <div className='flex justify-center'>
          <Button onClick={onJoin}>Join Raid</Button>
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
              <p className='text-xs font-medium uppercase tracking-wide text-muted-foreground'>Upcoming</p>
              {upcomingTasks.map((task) => (
                <Card key={task.id} className='opacity-60'>
                  <CardContent>
                    <p className='text-sm font-medium text-muted-foreground'>{task.title}</p>
                    {task.timeLimitSeconds != null && (
                      <p className='text-xs text-muted-foreground'>
                        {task.timeLimitSeconds}s time, {task.successfulDamage ?? 0} damage dealt
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {myDone.map((task) => (
            <Card key={task.id} className='opacity-60'>
              <CardContent className='flex items-center gap-3'>
                <Check className='size-4 text-emerald-600' />
                <p className='text-sm text-muted-foreground line-through'>{task.title}</p>
              </CardContent>
            </Card>
          ))}

          {activeTask == null && upcomingTasks.length === 0 && myDone.length > 0 && (
            <p className='text-center text-sm font-medium text-emerald-600'>All your tasks are done — waiting for teammates…</p>
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
