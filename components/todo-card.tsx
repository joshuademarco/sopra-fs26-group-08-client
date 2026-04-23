'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { type Todo, categoryLabel, weightLabel } from '@/types/task'
import { Brain, Check, ClipboardList, Flame, Heart, Trash2, CheckCircle2, AlertTriangle } from 'lucide-react'

interface TodoCardProps {
  todo: Todo
  onComplete: () => void
  onDelete: () => void
}

function CategoryIcon({ category }: { category: Todo['category'] }) {
  switch (category) {
    case 'PHYSICAL':  return <Flame className='h-4 w-4 text-rose-500' />
    case 'COGNITIVE': return <Brain className='h-4 w-4 text-sky-500' />
    case 'EMOTIONAL': return <Heart className='h-4 w-4 text-emerald-500' />
  }
}


function DueDatePanel({ todo }: { todo: Todo }) {
  const hasDueDate = Boolean(todo.dueAt)
  const isOverdue = hasDueDate && !todo.completed &&
    new Date(todo.dueAt!) < new Date()

  return (
    <div className='flex flex-col items-center gap-3 rounded-lg bg-muted/40 p-4 min-w-30'>
      <div className='flex w-full items-center justify-between gap-2'>
        <span className='font-semibold text-sm'>Due</span>
        {isOverdue && (
          <span className='rounded bg-red-500 px-1.5 py-0.5 text-xs font-bold text-white'>
            Overdue
          </span>
        )}
        {todo.completed && (
          <span className='rounded bg-green-500 px-1.5 py-0.5 text-xs font-bold text-white'>
            Done
          </span>
        )}
      </div>

      <div className='flex h-16 w-16 items-center justify-center rounded bg-muted text-2xl select-none'>
        {todo.completed ? (
          <CheckCircle2 className="h-8 w-8 text-green-500" />
        ) : isOverdue ? (
          <AlertTriangle className="h-8 w-8 text-red-500" />
        ) : (
          <ClipboardList className="h-8 w-8" />
        )}
      </div>

      {hasDueDate ? (
        <p className={`text-xs font-medium text-center ${isOverdue ? 'text-red-500' : 'text-muted-foreground'}`}>
          {new Date(todo.dueAt!).toLocaleDateString('en-CH', {
            day: 'numeric',
            month: 'short',
          })}
        </p>
      ) : (
        <p className='text-xs text-muted-foreground text-center'>No due date</p>
      )}
    </div>
  )
}


export function TodoCard({ todo, onComplete, onDelete }: TodoCardProps) {
  return (
    <Card className={todo.completed ? 'opacity-60' : ''}>
      <CardHeader className='pb-2'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <CategoryIcon category={todo.category} />
            <CardTitle className={`text-base font-bold ${todo.completed ? 'line-through' : ''}`}>
              {todo.title}
            </CardTitle>
          </div>

          <span className='rounded-full px-2.5 py-0.5 text-xs font-medium border bg-purple-100 text-purple-700 border-purple-300'>
            One-time
          </span>
        </div>

        {todo.description && (
          <CardDescription>{todo.description}</CardDescription>
        )}
      </CardHeader>

      <CardContent>
        <div className='grid grid-cols-[1fr_auto] gap-4 items-start'>
          {/* left part: details + actions */}
          <div className='flex flex-col gap-3'>
            {/* data for category and weight */}
            <div className='flex items-center gap-2 text-xs text-muted-foreground'>
              <span className='rounded bg-muted px-2 py-0.5 font-medium'>
                {categoryLabel(todo.category)}
              </span>
              <span>·</span>
              <span className='rounded bg-muted px-2 py-0.5 font-medium'>
                {weightLabel(todo.weight)}
              </span>
            </div>

            {/* displaying amount of xp gained based on weight */}
            <div className='rounded-lg bg-purple-50 border border-purple-200 px-3 py-2'>
              <p className='text-xs font-semibold text-purple-800'>
                Completes for {todo.weight * 10} XP
              </p>
              <p className='text-xs text-purple-600'>
                One-time reward — no weather multiplier
              </p>
            </div>

            {/* action buttons */}
            <div className='flex items-center gap-3 mt-1'>
              <button
                onClick={onComplete}
                disabled={todo.completed}
                className={`flex h-9 w-9 items-center justify-center rounded-full text-white text-sm transition-colors
                  ${todo.completed
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

              {todo.completed && (
                <span className='text-xs font-medium text-green-600'>
                  ✓ Completed
                </span>
              )}
            </div>
          </div>

          {/* right part: due date panel */}
          <DueDatePanel todo={todo} />
        </div>
      </CardContent>
    </Card>
  )
}