'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { type Habit, categoryLabel, weightLabel } from '@/types/task'
import { Brain, Check, Flame, Heart, Trash2 } from 'lucide-react'


interface HabitCardProps {
  habit: Habit
  onComplete: () => void
  onDelete: () => void
}


function CategoryIcon({ category }: { category: Habit['category'] }) {
  switch (category) {
    case 'PHYSICAL':  return <Flame className='h-4 w-4 text-rose-500' />
    case 'COGNITIVE': return <Brain className='h-4 w-4 text-sky-500' />
    case 'EMOTIONAL': return <Heart className='h-4 w-4 text-emerald-500' />
  }
}


function StreakPanel({ habit }: { habit: Habit }) {
  return (
    <div className='flex flex-col items-center gap-3 rounded-lg bg-muted/40 p-4 min-w-30'>
      <div className='flex w-full items-center justify-between gap-2'>
        <span className='font-semibold text-sm'>Streak</span>
        <span className='rounded bg-orange-500 px-1.5 py-0.5 text-xs font-bold text-white'>
         {habit.streak}
        </span>
      </div>
    </div>
  )
}


export function HabitCard({ habit, onComplete, onDelete }: HabitCardProps) {
  return (
    <Card className={habit.completed ? 'opacity-60' : ''}>
      <CardHeader className='pb-2'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <CategoryIcon category={habit.category} />
            <CardTitle className={`text-base font-bold ${habit.completed ? 'line-through' : ''}`}>
              {habit.title}
            </CardTitle>
          </div>

          {/* positive/negative  */}
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium border ${
              habit.positive
                ? 'bg-green-100 text-green-700 border-green-300'
                : 'bg-amber-100 text-amber-700 border-amber-300'
            }`}
          >
            {habit.positive ? 'Positive' : 'Negative'}
          </span>
        </div>

        {habit.description && (
          <CardDescription>{habit.description}</CardDescription>
        )}
      </CardHeader>

      <CardContent>
        <div className='grid grid-cols-[1fr_auto] gap-4 items-start'>
          {/* left part: details + actions */}
          <div className='flex flex-col gap-3'>
            {/* data for category, weight and frequency */}
            <div className='flex items-center gap-2 text-xs text-muted-foreground'>
              <span className='rounded bg-muted px-2 py-0.5 font-medium'>
                {categoryLabel(habit.category)}
              </span>
              <span>·</span>
              <span className='rounded bg-muted px-2 py-0.5 font-medium'>
                {weightLabel(habit.weight)}
              </span>
              <span>·</span>
              <span className='rounded bg-muted px-2 py-0.5 font-medium'>
                {habit.frequency.charAt(0) + habit.frequency.slice(1).toLowerCase()}
              </span>
            </div>

            {/* displaying amount of xp gained based on weight */}
            <div className='rounded-lg bg-blue-500 border border-blue-100 px-3 py-2'>
              <p className='text-xs font-semibold text-blue-100'>
                Completes for {habit.weight * 10} base XP
              </p>
              <p className='text-xs text-blue-200'>
                Weather multiplier applies on completion!
              </p>
            </div>

            {/* due date if set */}
            {habit.dueAt && !habit.completed && (
              <p className='text-xs text-muted-foreground'>
                Due: {new Date(habit.dueAt).toLocaleDateString()}
              </p>
            )}

            {/* action buttons */}
            <div className='flex items-center gap-3 mt-1'>
              <button
                onClick={onComplete}
                disabled={habit.completed}
                className={`flex h-9 w-9 items-center justify-center rounded-full text-white text-sm transition-colors
                  ${habit.completed
                    ? 'bg-muted text-muted-foreground cursor-not-allowed'
                    : 'bg-green-500 hover:bg-green-600'
                  }`}
              >
                <Check className='h-4 w-4' />
              </button>

              <button
                onClick={onDelete}
                className='flex h-9 w-9 items-center justify-center rounded-full border-2 border-red-400 text-red-500 text-sm hover:bg-red-50 transition-colors'
              >
                <Trash2 className='h-4 w-4' />
              </button>

              {habit.completed && (
                <span className='text-xs font-medium text-green-600'>
                  ✓ Completed
                </span>
              )}
            </div>
          </div>

          {/* right part: streak panel */}
          <StreakPanel habit={habit} />
        </div>
      </CardContent>
    </Card>
  )
}