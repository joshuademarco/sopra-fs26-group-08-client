'use client'

import { HabitCard } from '@/components/habit-card'
import { TodoCard } from '@/components/todo-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useApi } from '@/hooks/useApi'
import { useAuth } from '@/hooks/useAuth'
import type { Habit, HabitCategory, HabitFrequency, NewHabit, NewTodo, Todo } from '@/types/task'
import { Brain, Flame, Heart, Minus, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'

function weightLabel(w: number) {
  return w === 1 ? 'Easy' : w === 2 ? 'Medium' : 'Hard'
}

// ─── main page ────────────────────────────────────────────────────────────────

export default function HabitsPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'habits' | 'todos'>('habits')

  if (!user) return null

  return (
    <main className='flex flex-1 flex-col gap-4 p-4 pt-0'>
      <h1 className='text-3xl font-bold tracking-tight'>Tasks</h1>

      <div className='flex gap-2'>
        <Button variant={activeTab === 'habits' ? 'default' : 'outline'} onClick={() => setActiveTab('habits')}>
          Habits
        </Button>
        <Button variant={activeTab === 'todos' ? 'default' : 'outline'} onClick={() => setActiveTab('todos')}>
          To-Dos
        </Button>
      </div>

      {activeTab === 'habits' && <HabitsSection userId={user.id} />}
      {activeTab === 'todos' && <TodosSection userId={user.id} />}
    </main>
  )
}

// ─── habits ───────────────────────────────────────────────────────────

function HabitsSection({ userId }: { userId: string | number }) {
  const api = useApi()
  const [habits, setHabits] = useState<Habit[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const [newHabit, setNewHabit] = useState<NewHabit>({
    title: '',
    description: '',
    category: 'PHYSICAL',
    frequency: 'DAILY',
    positive: true,
    weight: 1,
  })

  useEffect(() => {
    void fetchHabits()
  }, [userId])

  async function fetchHabits() {
    try {
      setIsLoading(true)
      const data = await api.get<Habit[]>(`/users/${userId}/habits`)
      setHabits(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load habits')
    } finally {
      setIsLoading(false)
    }
  }

  async function createHabit() {
    if (!newHabit.title.trim()) return
    try {
      const created = await api.post<Habit>(`/users/${userId}/habits`, newHabit)
      setHabits((prev) => [...prev, created])
      setNewHabit({ title: '', description: '', category: 'PHYSICAL', frequency: 'DAILY', positive: true, weight: 1 })
      setDialogOpen(false)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create habit')
    }
  }

  async function completeHabit(habitId: number) {
    try {
      const updated = await api.put<Habit>(`/users/${userId}/habits/${habitId}/complete`, {})
      setHabits((prev) => prev.map((h) => (h.id === habitId ? updated : h)))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to complete habit')
    }
  }

  async function deleteHabit(habitId: number) {
    try {
      await api.delete(`/users/${userId}/habits/${habitId}`)
      setHabits((prev) => prev.filter((h) => h.id !== habitId))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to delete habit')
    }
  }

  if (isLoading) {
    return <p className='text-muted-foreground'>Loading habits...</p>
  }

  return (
    <div className='flex flex-col gap-4'>
      {error && <p className='text-sm text-destructive'>{error}</p>}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button className='w-fit'>
            <Plus /> Add Habit
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Habit</DialogTitle>
          </DialogHeader>
          <HabitForm value={newHabit} onChange={setNewHabit} onSubmit={createHabit} />
        </DialogContent>
      </Dialog>

      {/* list */}
      {habits.length === 0 ? (
        <EmptyState message='No habits yet. Add one to start earning XP!' />
      ) : (
        <div className='flex flex-col gap-3'>
          {habits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onComplete={() => void completeHabit(habit.id)}
              onDelete={() => void deleteHabit(habit.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── todos ────────────────────────────────────────────────────────────

function TodosSection({ userId }: { userId: string | number }) {
  const api = useApi()
  const [todos, setTodos] = useState<Todo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const [newTodo, setNewTodo] = useState<NewTodo>({
    title: '',
    description: '',
    category: 'PHYSICAL',
    weight: 1,
    dueAt: '',
  })

  useEffect(() => {
    void fetchTodos()
  }, [userId])

  async function fetchTodos() {
    try {
      setIsLoading(true)
      const data = await api.get<Todo[]>(`/users/${userId}/todos`)
      setTodos(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load todos')
    } finally {
      setIsLoading(false)
    }
  }

  async function createTodo() {
    if (!newTodo.title.trim()) return
    try {
      const payload = {
        ...newTodo,
        dueAt: newTodo.dueAt ? new Date(newTodo.dueAt).toISOString() : undefined,
      }
      const created = await api.post<Todo>(`/users/${userId}/todos`, payload)
      setTodos((prev) => [...prev, created])
      setNewTodo({ title: '', description: '', category: 'PHYSICAL', weight: 1, dueAt: '' })
      setDialogOpen(false)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create todo')
    }
  }

  async function completeTodo(todoId: number) {
    try {
      const updated = await api.put<Todo>(`/users/${userId}/todos/${todoId}/complete`, {})
      setTodos((prev) => prev.map((t) => (t.id === todoId ? updated : t)))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to complete todo')
    }
  }

  async function deleteTodo(todoId: number) {
    try {
      await api.delete(`/users/${userId}/todos/${todoId}`)
      setTodos((prev) => prev.filter((t) => t.id !== todoId))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to delete todo')
    }
  }

  if (isLoading) {
    return <p className='text-muted-foreground'>Loading todos...</p>
  }

  return (
    <div className='flex flex-col gap-4'>
      {error && <p className='text-sm text-destructive'>{error}</p>}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button className='w-fit'>
            <Plus /> Add To-Do
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New To-Do</DialogTitle>
          </DialogHeader>
          <TodoForm value={newTodo} onChange={setNewTodo} onSubmit={createTodo} />
        </DialogContent>
      </Dialog>

      {todos.length === 0 ? (
        <EmptyState message='No to-dos yet. Add one to start!' />
      ) : (
        <div className='flex flex-col gap-3'>
          {todos.map((todo) => (
            <TodoCard
              key={todo.id}
              todo={todo}
              onComplete={() => void completeTodo(todo.id)}
              onDelete={() => void deleteTodo(todo.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── form components ──────────────────────────────────────────────────────────
// extracted so dialog content stays readable

function HabitForm({ value, onChange, onSubmit }: { value: NewHabit; onChange: (v: NewHabit) => void; onSubmit: () => void }) {
  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-col gap-1.5'>
        <Label htmlFor='habit-title'>Title</Label>
        <Input
          id='habit-title'
          placeholder='Morning run, Read 20 pages...'
          value={value.title}
          onChange={(e) => onChange({ ...value, title: e.target.value })}
        />
      </div>

      {/* optional description */}
      <div className='flex flex-col gap-1.5'>
        <Label htmlFor='habit-desc'>Description (optional)</Label>
        <Input
          id='habit-desc'
          placeholder='More details...'
          value={value.description}
          onChange={(e) => onChange({ ...value, description: e.target.value })}
        />
      </div>

      {/* habit category for character stats */}
      <div className='flex flex-col gap-1.5'>
        <Label>Category</Label>
        <Select value={value.category} onValueChange={(v) => onChange({ ...value, category: v as HabitCategory })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='PHYSICAL'>
              <div className='flex items-center gap-2'>
                <Flame className='h-4 w-4 text-rose-500' /> Physical (levelling Strength)
              </div>
            </SelectItem>
            <SelectItem value='COGNITIVE'>
              <div className='flex items-center gap-2'>
                <Brain className='h-4 w-4 text-sky-500' /> Cognitive (levelling Intelligence)
              </div>
            </SelectItem>
            <SelectItem value='EMOTIONAL'>
              <div className='flex items-center gap-2'>
                <Heart className='h-4 w-4 text-emerald-500' /> Emotional (levelling Resilience)
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* habit frequency */}
      <div className='flex flex-col gap-1.5'>
        <Label>Frequency</Label>
        <Select value={value.frequency} onValueChange={(v) => onChange({ ...value, frequency: v as HabitFrequency })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='DAILY'>Daily</SelectItem>
            <SelectItem value='WEEKLY'>Weekly</SelectItem>
            <SelectItem value='MONTHLY'>Monthly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className='flex flex-col gap-1.5'>
        <Label>Type</Label>
        <div className='flex gap-2'>
          <Button
            type='button'
            variant={value.positive ? 'default' : 'outline'}
            onClick={() => onChange({ ...value, positive: true })}
            className='flex-1'
          >
            <Plus /> Positive
          </Button>
          <Button
            type='button'
            variant={!value.positive ? 'default' : 'outline'}
            onClick={() => onChange({ ...value, positive: false })}
            className='flex-1'
          >
            <Minus /> Negative
          </Button>
        </div>
      </div>

      <div className='flex flex-col gap-1.5'>
        <Label>Difficulty</Label>
        <div className='flex gap-2'>
          {[1, 2, 3].map((w) => (
            <Button
              key={w}
              type='button'
              variant={value.weight === w ? 'default' : 'outline'}
              onClick={() => onChange({ ...value, weight: w })}
              className='flex-1'
            >
              {weightLabel(w)}
            </Button>
          ))}
        </div>
      </div>

      <Button onClick={onSubmit} disabled={!value.title.trim()}>
        Create Habit
      </Button>
    </div>
  )
}

function TodoForm({ value, onChange, onSubmit }: { value: NewTodo; onChange: (v: NewTodo) => void; onSubmit: () => void }) {
  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-col gap-1.5'>
        <Label htmlFor='todo-title'>Title</Label>
        <Input
          id='todo-title'
          placeholder='Schedule dentist, Buy groceries...'
          value={value.title}
          onChange={(e) => onChange({ ...value, title: e.target.value })}
        />
      </div>

      {/* optional description */}
      <div className='flex flex-col gap-1.5'>
        <Label htmlFor='todo-desc'>Description (optional)</Label>
        <Input
          id='todo-desc'
          placeholder='More details...'
          value={value.description}
          onChange={(e) => onChange({ ...value, description: e.target.value })}
        />
      </div>

      {/* todo category for character stats */}
      <div className='flex flex-col gap-1.5'>
        <Label>Category</Label>
        <Select value={value.category} onValueChange={(v) => onChange({ ...value, category: v as HabitCategory })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='PHYSICAL'>
              <div className='flex items-center gap-2'>
                <Flame className='h-4 w-4 text-rose-500' /> Physical (levelling Strength)
              </div>
            </SelectItem>
            <SelectItem value='COGNITIVE'>
              <div className='flex items-center gap-2'>
                <Brain className='h-4 w-4 text-sky-500' /> Cognitive (levelling Intelligence)
              </div>
            </SelectItem>
            <SelectItem value='EMOTIONAL'>
              <div className='flex items-center gap-2'>
                <Heart className='h-4 w-4 text-emerald-500' /> Emotional (levelling Resilience)
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className='flex flex-col gap-1.5'>
        <Label>Difficulty</Label>
        <div className='flex gap-2'>
          {[1, 2, 3].map((w) => (
            <Button
              key={w}
              type='button'
              variant={value.weight === w ? 'default' : 'outline'}
              onClick={() => onChange({ ...value, weight: w })}
              className='flex-1'
            >
              {weightLabel(w)}
            </Button>
          ))}
        </div>
      </div>

      <div className='flex flex-col gap-1.5'>
        <Label htmlFor='todo-due'>Due Date (optional)</Label>
        <Input id='todo-due' type='date' value={value.dueAt} onChange={(e) => onChange({ ...value, dueAt: e.target.value })} />
      </div>

      <Button onClick={onSubmit} disabled={!value.title.trim()}>
        Create To-Do
      </Button>
    </div>
  )
}

//display when no habits/todos created yet
function EmptyState({ message }: { message: string }) {
  return (
    <Card>
      <CardContent className='flex items-center justify-center py-12'>
        <p className='text-muted-foreground text-sm'>{message}</p>
      </CardContent>
    </Card>
  )
}
