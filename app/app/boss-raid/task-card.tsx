'use client'

import { RaidTaskData } from '@/types/raids'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import { taskWindowSecondsLeft } from './utils'

export function TaskCard({
  task,
  startedAt,
  onSuccess,
}: {
  task: RaidTaskData
  startedAt: string | null
  onSuccess: () => void
}) {
  const secsLeft = Math.max(0, taskWindowSecondsLeft(task, startedAt))
  const minutes = String(Math.floor(secsLeft / 60)).padStart(2, '0')
  const seconds = String(secsLeft % 60).padStart(2, '0')

  return (
    <div className='flex items-start gap-4 rounded-lg border bg-card px-4 py-3'>
      <div className='flex-1 min-w-0'>
        <div className='flex items-center justify-between gap-2'>
          <p className='text-sm font-medium'>{task.title}</p>
          {task.timeLimitSeconds != null && (
            <span className={`text-xs font-mono font-semibold tabular-nums text-destructive animate-pulse`}>
              {minutes}:{seconds}
            </span>
          )}
        </div>
        {task.description && <p className='text-xs text-muted-foreground mt-0.5'>{task.description}</p>}
        <div className='flex gap-3 mt-1.5 text-xs'>
          <span className='text-green-600 font-medium'>+{task.successfulDamage ?? 0} damage to boss</span>
          {(task.groupDamage ?? 0) > 0 && <span className='text-destructive'>{task.groupDamage} group damage</span>}
        </div>
      </div>
      <div className='flex shrink-0 items-center self-center'>
        <Button
          variant='outline'
          size='sm'
          onClick={onSuccess}
          title='Mark as done'
          className='h-8 gap-1.5 rounded-full px-3 text-green-700 shadow-sm transition-all  hover:bg-green-100 hover:text-green-800'
        >
          <Check className='size-4' />
          <span className='text-xs font-medium'>Done</span>
        </Button>
      </div>
    </div>
  )
}
