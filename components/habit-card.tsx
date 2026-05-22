'use client'

import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { type Habit, categoryLabel, weightLabel } from '@/types/task'
import { AlertTriangle, Brain, Check, CloudSun, Flame, Heart, Trash2 } from 'lucide-react'

interface HabitCardProps {
  habit: Habit
  onComplete: () => void
  onDelete: () => void
}

function CategoryIcon({ category }: { category: Habit['category'] }) {
  const cls = 'h-6 w-6 shrink-0'
  switch (category) {
    case 'PHYSICAL':
      return <Flame className={`${cls} text-rose-500`} />
    case 'COGNITIVE':
      return <Brain className={`${cls} text-sky-500`} />
    case 'EMOTIONAL':
      return <Heart className={`${cls} text-emerald-500`} />
  }
}

export function HabitCard({ habit, onComplete, onDelete }: HabitCardProps) {
  const multiplier = habit.multiplier ?? 1
  const xp = habit.weight * 10
  const freq = habit.frequency.charAt(0) + habit.frequency.slice(1).toLowerCase()
  const badgeCls = habit.positive
    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
    : 'bg-rose-500/15 text-rose-600 dark:text-rose-400'

  return (
    <div
      className={`flex min-h-16 items-center gap-3 rounded-md border px-4 py-3 transition-opacity ${habit.completed ? 'opacity-50' : ''}`}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={onComplete}
            disabled={habit.completed}
            className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-muted-foreground/40 transition-colors hover:border-primary hover:bg-primary/10 disabled:cursor-default disabled:opacity-60'
            aria-label='Mark as complete'
          >
            {habit.completed && <Check className='h-4 w-4 text-primary' />}
          </button>
        </TooltipTrigger>
        <TooltipContent>{habit.completed ? 'Completed' : 'Mark as complete'}</TooltipContent>
      </Tooltip>

      <CategoryIcon category={habit.category} />

      <div className='min-w-0 flex-1'>
        <div className='flex flex-wrap items-center gap-1.5'>
          <span
            className={`text-base font-semibold leading-snug ${habit.completed ? 'line-through text-muted-foreground' : ''}`}
          >
            {habit.title}
          </span>
          <span className={`shrink-0 rounded px-1.5 py-px text-[10px] font-semibold leading-none ${badgeCls}`}>
            {habit.positive ? 'Positive' : 'Negative'}
          </span>
          {habit.penaltyApplied && (
            <Tooltip>
              <TooltipTrigger asChild>
                <AlertTriangle className='h-3.5 w-3.5 shrink-0 text-destructive' />
              </TooltipTrigger>
              <TooltipContent>You missed this habit last period — your character lost health.</TooltipContent>
            </Tooltip>
          )}
        </div>
        <p className='text-xs leading-snug text-muted-foreground'>
          {habit.description ? `${habit.description} · ` : ''}
          {categoryLabel(habit.category)} · {weightLabel(habit.weight)} · {freq}
        </p>
      </div>

      <div className='flex shrink-0 items-center gap-2'>
        {habit.positive ? (
          <div className='flex items-center gap-1'>
            <span className='text-sm font-bold text-yellow-500'>{xp} XP</span>
            {multiplier > 1 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className='flex cursor-help items-center gap-0.5 rounded bg-sky-500/15 px-1 py-px text-[10px] font-bold text-sky-500'>
                    <CloudSun className='h-3 w-3' />×{multiplier}
                  </span>
                </TooltipTrigger>
                <TooltipContent className='max-w-50'>
                  Today&apos;s weather boosts this habit! Your XP reward is multiplied by {multiplier}×.
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        ) : (
          <span className='text-sm font-bold text-destructive'>−{habit.weight} HP</span>
        )}
        {habit.positive && (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className='flex cursor-default items-center gap-0.5 text-sm font-semibold text-orange-400'>
                <Flame className='h-4 w-4' />
                {habit.streak}
              </span>
            </TooltipTrigger>
            <TooltipContent>{habit.streak}-day streak</TooltipContent>
          </Tooltip>
        )}
      </div>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size='icon'
            variant='ghost'
            className='h-7 w-7 shrink-0 text-muted-foreground/50 hover:text-destructive'
            onClick={onDelete}
            aria-label='Delete habit'
          >
            <Trash2 className='h-4 w-4' />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Delete Habit</TooltipContent>
      </Tooltip>
    </div>
  )
}
