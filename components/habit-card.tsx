'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { type Habit, categoryLabel, weightLabel } from '@/types/task'
import { AlertTriangle, Brain, Check, Flame, Heart, Trash2 } from 'lucide-react'

interface HabitCardProps {
  habit: Habit
  onComplete: () => void
  onDelete: () => void
}

function CategoryIcon({ category }: { category: Habit['category'] }) {
  switch (category) {
    case 'PHYSICAL':
      return <Flame className='text-rose-500' />
    case 'COGNITIVE':
      return <Brain className='text-sky-500' />
    case 'EMOTIONAL':
      return <Heart className='text-emerald-500' />
  }
}

export function HabitCard({ habit, onComplete, onDelete }: HabitCardProps) {
  const multiplier = habit.multiplier ?? 1
  return (
    <Card className={habit.completed ? 'opacity-60' : ''}>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <CategoryIcon category={habit.category} />
            <CardTitle className={habit.completed ? 'line-through' : ''}>{habit.title}</CardTitle>
          </div>
          <Badge variant={habit.positive ? 'default' : 'secondary'}>{habit.positive ? 'Positive' : 'Negative'}</Badge>
        </div>

        {habit.description && <CardDescription>{habit.description}</CardDescription>}

        {habit.penaltyApplied && (
          <div className='flex items-center gap-1.5 text-sm text-destructive'>
            <AlertTriangle className='h-4 w-4 shrink-0' />
            <span>Missed last period - your character lost health.</span>
          </div>
        )}
      </CardHeader>

      <CardContent>
        <div className='grid grid-cols-[1fr_auto] items-start gap-4'>
          <div className='flex flex-col gap-3'>
            <div className='flex flex-wrap items-center gap-1.5'>
              <Badge variant='secondary'>{categoryLabel(habit.category)}</Badge>
              <Badge variant='secondary'>{weightLabel(habit.weight)}</Badge>
              <Badge variant='secondary'>{habit.frequency.charAt(0) + habit.frequency.slice(1).toLowerCase()}</Badge>
            </div>

            {habit.positive ? (
              <p className='text-xs text-muted-foreground'>
                Completes for {habit.weight * 10} base XP
                {multiplier > 1.0 && <span className='text-yellow-500'>{` -> ${multiplier}x XP weather multiplier`}</span>}
              </p>
            ) : (
              <p className='text-xs text-destructive'>
                Completing this negative habit reduces your character&apos;s health by {habit.weight} HP
              </p>
            )}

            {habit.dueAt && !habit.completed && (
              <p className='text-xs text-muted-foreground'>Due: {new Date(habit.dueAt).toLocaleDateString()}</p>
            )}

            <div className='flex items-center gap-2'>
              <Button size='icon-lg' onClick={onComplete} disabled={habit.completed}>
                <Check />
              </Button>
              <Button size='icon-lg' variant='destructive' onClick={onDelete}>
                <Trash2 />
              </Button>
              {habit.completed && <span className='text-xs text-muted-foreground'>Completed</span>}
            </div>
          </div>

          {habit.positive && (
            <div className='flex flex-col items-center gap-1 rounded-lg bg-muted/40 p-3'>
              <span className='text-xs text-muted-foreground'>Streak</span>
              <span className='text-2xl font-bold'>{habit.streak}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
