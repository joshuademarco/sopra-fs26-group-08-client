'use client'

import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { type Todo, categoryLabel, weightLabel } from '@/types/task'
import { AlertTriangle, Brain, CheckCircle2, Flame, Heart, Trash2 } from 'lucide-react'

interface TodoCardProps {
  todo: Todo
  onComplete: () => void
  onDelete: () => void
}

function CategoryIcon({ category }: { category: Todo['category'] }) {
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

export function TodoCard({ todo, onComplete, onDelete }: TodoCardProps) {
  const hasDueDate = Boolean(todo.dueAt)
  const isOverdue = hasDueDate && !todo.completed && new Date(todo.dueAt!) < new Date()
  const xp = todo.weight * 10
  const dueLabel = hasDueDate ? new Date(todo.dueAt!).toLocaleDateString('en-CH', { day: 'numeric', month: 'short' }) : null

  return (
    <div
      className={`flex min-h-16 items-center gap-3 rounded-md border px-4 py-3 transition-opacity ${todo.completed ? 'opacity-50' : ''}`}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={onComplete}
            disabled={todo.completed}
            className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-muted-foreground/40 transition-colors hover:border-primary hover:bg-primary/10 disabled:cursor-default disabled:opacity-60'
            aria-label='Mark as complete'
          >
            {todo.completed ? <CheckCircle2 className='h-4 w-4 text-emerald-500' /> : null}
          </button>
        </TooltipTrigger>
        <TooltipContent>{todo.completed ? 'Completed' : 'Mark as complete'}</TooltipContent>
      </Tooltip>

      <CategoryIcon category={todo.category} />

      <div className='min-w-0 flex-1'>
        <div className='flex flex-wrap items-center gap-1.5'>
          <span
            className={`text-base font-semibold leading-snug ${todo.completed ? 'line-through text-muted-foreground' : ''}`}
          >
            {todo.title}
          </span>
          <span className='shrink-0 rounded px-1.5 py-px text-[10px] font-semibold leading-none bg-muted text-muted-foreground'>
            One-time
          </span>
          {isOverdue && (
            <Tooltip>
              <TooltipTrigger asChild>
                <AlertTriangle className='h-3.5 w-3.5 shrink-0 text-destructive' />
              </TooltipTrigger>
              <TooltipContent>This task is overdue!</TooltipContent>
            </Tooltip>
          )}
        </div>
        <p className='text-xs leading-snug text-muted-foreground'>
          {todo.description ? `${todo.description} · ` : ''}
          {categoryLabel(todo.category)} · {weightLabel(todo.weight)}
          {dueLabel && ` · Due ${dueLabel}`}
        </p>
      </div>

      <span className={`shrink-0 text-sm font-bold ${isOverdue ? 'text-destructive' : 'text-yellow-500'}`}>
        {isOverdue ? 'Overdue' : `${xp} XP`}
      </span>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size='icon'
            variant='ghost'
            className='h-7 w-7 shrink-0 text-muted-foreground/50 hover:text-destructive'
            onClick={onDelete}
            aria-label='Delete todo'
          >
            <Trash2 className='h-4 w-4' />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Delete To-Do</TooltipContent>
      </Tooltip>
    </div>
  )
}
