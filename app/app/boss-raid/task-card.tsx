'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { RaidTaskData } from '@/types/raids'
import { Check, SkipForward } from 'lucide-react'
import { taskWindowSecondsLeft } from './utils'

export function TaskCard({
  task,
  startedAt,
  onSuccess,
  onSkip,
}: {
  task: RaidTaskData
  startedAt: string | null
  onSuccess: () => void
  onSkip: () => void
}) {
  const secsLeft = Math.max(0, taskWindowSecondsLeft(task, startedAt))
  const hasTimer = task.timeLimitSeconds != null && task.timeLimitSeconds > 0
  const percentLeft = hasTimer ? Math.max(0, Math.min(100, (secsLeft / task.timeLimitSeconds!) * 100)) : 0
  const isLow = hasTimer && percentLeft <= 25

  return (
    <Card>
      <CardContent className='flex flex-col gap-3'>
        <div className='flex items-start gap-4'>
          <div className='flex min-w-0 flex-1 flex-col gap-1'>
            <p className='text-sm font-medium'>{task.title}</p>
            {task.description && <p className='text-xs text-muted-foreground'>{task.description}</p>}
            <div className='flex gap-3 text-xs'>
              <span className='font-medium text-emerald-600'>+{task.successfulDamage ?? 0} damage to boss</span>
              {(task.groupDamage ?? 0) > 0 && <span className='text-destructive'>{task.groupDamage} group damage</span>}
            </div>
          </div>
          <div className='flex flex-col gap-2 self-center'>
            <Button size='sm' onClick={onSuccess} title='Mark as done'>
              <Check />
              Done
            </Button>
            <Button
              size='sm'
              variant='ghost'
              onClick={onSkip}
              title={`Skip this task — group damage (${task.groupDamage ?? 0}) still applies to your team`}
              className='text-muted-foreground'
            >
              <SkipForward />
              Skip
            </Button>
          </div>
        </div>
        {hasTimer && <Progress value={percentLeft} innerClassName={isLow ? 'bg-destructive' : 'bg-primary'} />}
      </CardContent>
    </Card>
  )
}
