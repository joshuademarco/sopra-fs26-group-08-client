'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { type Todo, categoryLabel, weightLabel } from '@/types/task'
import { AlertTriangle, Brain, Check, CheckCircle2, ClipboardList, Flame, Heart, Trash2 } from 'lucide-react'

interface TodoCardProps {
  todo: Todo
  onComplete: () => void
  onDelete: () => void
}

function CategoryIcon({ category }: { category: Todo['category'] }) {
  switch (category) {
    case 'PHYSICAL':
      return <Flame className='text-rose-500' />
    case 'COGNITIVE':
      return <Brain className='text-sky-500' />
    case 'EMOTIONAL':
      return <Heart className='text-emerald-500' />
  }
}

function DueDatePanel({ todo }: { todo: Todo }) {
  const hasDueDate = Boolean(todo.dueAt)
  const isOverdue = hasDueDate && !todo.completed && new Date(todo.dueAt!) < new Date()

  return (
    <div className='flex flex-col items-center gap-2 rounded-lg bg-muted/40 p-3'>
      {todo.completed ? (
        <CheckCircle2 className='size-8 text-emerald-500' />
      ) : isOverdue ? (
        <AlertTriangle className='size-8 text-destructive' />
      ) : (
        <ClipboardList className='size-8 text-muted-foreground' />
      )}
      {hasDueDate ? (
        <p className={`text-xs ${isOverdue ? 'text-destructive' : 'text-muted-foreground'}`}>
          {new Date(todo.dueAt!).toLocaleDateString('en-CH', { day: 'numeric', month: 'short' })}
        </p>
      ) : (
        <p className='text-xs text-muted-foreground'>No due date</p>
      )}
    </div>
  )
}

export function TodoCard({ todo, onComplete, onDelete }: TodoCardProps) {
  return (
    <Card className={todo.completed ? 'opacity-60' : ''}>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <CategoryIcon category={todo.category} />
            <CardTitle className={todo.completed ? 'line-through' : ''}>{todo.title}</CardTitle>
          </div>
          <Badge variant='outline'>One-time</Badge>
        </div>

        {todo.description && <CardDescription>{todo.description}</CardDescription>}
      </CardHeader>

      <CardContent>
        <div className='grid grid-cols-[1fr_auto] items-start gap-4'>
          <div className='flex flex-col gap-3'>
            <div className='flex flex-wrap items-center gap-1.5'>
              <Badge variant='secondary'>{categoryLabel(todo.category)}</Badge>
              <Badge variant='secondary'>{weightLabel(todo.weight)}</Badge>
            </div>

            <p className='text-xs text-muted-foreground'>Completes for {todo.weight * 10} XP</p>

            <div className='flex items-center gap-2'>
              <Button size='icon-lg' onClick={onComplete} disabled={todo.completed}>
                <Check />
              </Button>
              <Button size='icon-lg' variant='destructive' onClick={onDelete}>
                <Trash2 />
              </Button>
              {todo.completed && <span className='text-xs text-muted-foreground'>Completed</span>}
            </div>
          </div>

          {/* right part: due date panel */}
          <DueDatePanel todo={todo} />
        </div>
      </CardContent>
    </Card>
  )
}
