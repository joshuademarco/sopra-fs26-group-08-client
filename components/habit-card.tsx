'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { type Habit, categoryLabel, weightLabel } from '@/types/task'
import { Brain, Check, Flame, Heart, Trash2 } from 'lucide-react'

function getMultiplier(weatherCode: number, category: Habit['category']): number {
  if (category === 'PHYSICAL') {
    if (weatherCode <= 3) return 1.0
    else if (weatherCode <= 48) return 1.2
    else if (weatherCode <= 67) return 1.5
    else if (weatherCode <= 77) return 1.8
    else return 2.0
  } 
  else if (category === 'COGNITIVE') {
    if (weatherCode <= 3) return 1.8
    else if (weatherCode <= 48) return 1.6
    else if (weatherCode <= 67) return 1.4
    else if (weatherCode <= 77) return 1.2
    else return 1.0
  } 
  else if (category === 'EMOTIONAL') {
    if (weatherCode <= 3) return 1.0
    else if (weatherCode <= 48) return 1.2
    else if (weatherCode <= 67) return 1.6
    else if (weatherCode <= 77) return 1.8
    else return 1.0
  }
  return 1.0
}

interface HabitCardProps {
  habit: Habit
  weatherCode: number
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

export function HabitCard({ habit, weatherCode, onComplete, onDelete }: HabitCardProps) {
  const multiplier = getMultiplier(weatherCode, habit.category)
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
      </CardHeader>

      <CardContent>
        <div className='grid grid-cols-[1fr_auto] items-start gap-4'>
          <div className='flex flex-col gap-3'>
            <div className='flex flex-wrap items-center gap-1.5'>
              <Badge variant='secondary'>{categoryLabel(habit.category)}</Badge>
              <Badge variant='secondary'>{weightLabel(habit.weight)}</Badge>
              <Badge variant='secondary'>{habit.frequency.charAt(0) + habit.frequency.slice(1).toLowerCase()}</Badge>
            </div>

            <p className='text-xs text-muted-foreground'>
              Completes for {habit.weight * 10} base XP{multiplier > 1.0 ? ` -> ${multiplier}x XP weather multiplier` : ''}
            </p>

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

          <div className='flex flex-col items-center gap-1 rounded-lg bg-muted/40 p-3'>
            <span className='text-xs text-muted-foreground'>Streak</span>
            <span className='text-2xl font-bold'>{habit.streak}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
