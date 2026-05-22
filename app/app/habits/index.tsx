'use client'

import { HabitCard } from '@/components/habit-card'
import { HabitForm } from '@/components/habit-creation'
import { HabitHeatmap } from '@/components/heatmap'
import { TodoCard } from '@/components/todo-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useApi } from '@/hooks/useApi'
import { useAuth } from '@/hooks/useAuth'
import { useWebsocketContext } from '@/hooks/useWebsocketContext'
import type { Habit, HabitCategory, NewHabit, NewTodo, Todo } from '@/types/task'
import { AlertTriangle, Brain, Flame, Heart, Info, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

function weightLabel(w: number) {
  return w === 1 ? 'Easy' : w === 2 ? 'Medium' : 'Hard'
}

// ============================== main page ==============================

export default function HabitsPage() {
  const { user } = useAuth()
  const api = useApi()
  const { subscribeToCharacterUpdates } = useWebsocketContext()
  const [habitDialogOpen, setHabitDialogOpen] = useState(false)
  const [todoDialogOpen, setTodoDialogOpen] = useState(false)
  const [isKnockedOut, setIsKnockedOut] = useState(false)

  useEffect(() => {
    if (!user) return
    api.get<{ health: number }>(`/users/${user.id}/character`)
      .then((c) => setIsKnockedOut(c.health <= 0))
      .catch(() => {})
  }, [user?.id])

  useEffect(() => {
    return subscribeToCharacterUpdates((msg) => setIsKnockedOut(msg.health <= 0))
  }, [subscribeToCharacterUpdates])

  if (!user) return null

  return (
    <main className='flex flex-1 flex-col gap-4'>
      <div className='flex items-center gap-2'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Info className='h-5 w-5 text-muted-foreground' />
          </TooltipTrigger>
          <TooltipContent className='max-w-sm'>
            <strong>Habits:</strong> Recurring actions you do daily, weekly, or monthly. Keep an eye on the sky! Specific habit
            categories get a weather-based XP boost to keep you motivated. <strong>ToDos:</strong> One-time tasks. While these
            don&apos;t receive weather bonuses, completing them still earns you base XP and levels up your character&apos;s
            stats in that category.
          </TooltipContent>
        </Tooltip>
      </div>

      <HabitHeatmap />

      <div className='flex flex-col xl:flex-row gap-6'>
        <div className='flex-1 min-w-0 flex flex-col gap-3 xl:pr-6'>
          <div className='flex items-center justify-between'>
            <h3 className='text-lg font-semibold'>Habits</h3>
            <Button className='w-fit' onClick={() => setHabitDialogOpen(true)}>
              <Plus /> Add Habit
            </Button>
          </div>
          <div className='border rounded-lg p-4 bg-muted/40'>
            <HabitsSection userId={user.id} isKnockedOut={isKnockedOut} dialogOpen={habitDialogOpen} setDialogOpen={setHabitDialogOpen} />
          </div>
        </div>
        <div className='hidden xl:block w-px bg-border self-stretch' />
        <div className='flex-1 min-w-0 flex flex-col gap-3 xl:pl-6'>
          <div className='flex items-center justify-between'>
            <h3 className='text-lg font-semibold'>To-Dos</h3>
            <Button className='w-fit' onClick={() => setTodoDialogOpen(true)}>
              <Plus /> Add To-Do
            </Button>
          </div>
          <div className='border rounded-lg p-4 bg-muted/40'>
            <TodosSection userId={user.id} isKnockedOut={isKnockedOut} dialogOpen={todoDialogOpen} setDialogOpen={setTodoDialogOpen} />
          </div>
        </div>
      </div>
    </main>
  )
}

// ============================== habits ==============================

function HabitsSection({
  userId,
  isKnockedOut,
  dialogOpen: controlledOpen,
  setDialogOpen: setControlledOpen,
}: {
  userId: string | number
  isKnockedOut: boolean
  dialogOpen?: boolean
  setDialogOpen?: (v: boolean) => void
}) {
  const api = useApi()
  const { subscribeToWeatherQuestUpdates } = useWebsocketContext()
  const [habits, setHabits] = useState<Habit[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [internalOpen, setInternalOpen] = useState(false)
  const dialogOpen = controlledOpen ?? internalOpen
  const setDialogOpen = setControlledOpen ?? setInternalOpen

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

  useEffect(() => {
    return subscribeToWeatherQuestUpdates(() => {
      api.get<Habit[]>(`/users/${userId}/habits`).then(setHabits).catch(() => {})
    })
  }, [subscribeToWeatherQuestUpdates, api, userId])

  async function fetchHabits() {
    try {
      setIsLoading(true)
      const data = await api.get<Habit[]>(`/users/${userId}/habits`)
      setHabits(data)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to load habits')
    } finally {
      setIsLoading(false)
    }
  }

  async function createHabit() {
    if (!newHabit.title.trim()) return
    try {
      await api.post<Habit>(`/users/${userId}/habits`, newHabit)
      await fetchHabits()
      setNewHabit({ title: '', description: '', category: 'PHYSICAL', frequency: 'DAILY', positive: true, weight: 1 })
      setDialogOpen(false)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to create habit')
    }
  }

  async function completeHabit(habitId: number) {
    try {
      const updated = await api.put<Habit>(`/users/${userId}/habits/${habitId}/complete`, {})
      setHabits((prev) => prev.map((h) => (h.id === habitId ? updated : h)))
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to complete habit')
    }
  }

  async function deleteHabit(habitId: number) {
    try {
      await api.delete(`/users/${userId}/habits/${habitId}`)
      setHabits((prev) => prev.filter((h) => h.id !== habitId))
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to delete habit')
    }
  }

  if (isLoading) {
    return <p className='text-muted-foreground'>Loading habits...</p>
  }

  return (
    <div className='flex flex-col gap-4'>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        {!setControlledOpen && (
          <DialogTrigger asChild>
            <Button className='w-fit'>
              <Plus /> Add Habit
            </Button>
          </DialogTrigger>
        )}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Habit</DialogTitle>
          </DialogHeader>
          <HabitForm value={newHabit} onChange={setNewHabit} onSubmit={createHabit} />
        </DialogContent>
      </Dialog>

      {/* list */}
      {habits.length === 0 ? (
        <EmptyState message='No habits yet. Add one to start earning XP and building your streak!' />
      ) : (
        <div className='flex flex-col gap-1.5'>
          {habits.some((h) => h.penaltyApplied) && (
            <div className='flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive'>
              <AlertTriangle className='h-4 w-4 shrink-0' />
              <span>You missed habits last period - your character lost health.</span>
            </div>
          )}
          {habits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              isKnockedOut={isKnockedOut}
              onComplete={() => void completeHabit(habit.id)}
              onDelete={() => void deleteHabit(habit.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ============================== todos ==============================

function TodosSection({
  userId,
  isKnockedOut,
  dialogOpen: controlledOpen,
  setDialogOpen: setControlledOpen,
}: {
  userId: string | number
  isKnockedOut: boolean
  dialogOpen?: boolean
  setDialogOpen?: (v: boolean) => void
}) {
  const api = useApi()
  const [todos, setTodos] = useState<Todo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [internalOpen, setInternalOpen] = useState(false)
  const dialogOpen = controlledOpen ?? internalOpen
  const setDialogOpen = setControlledOpen ?? setInternalOpen

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
      toast.error(e instanceof Error ? e.message : 'Failed to load todos')
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
      toast.error(e instanceof Error ? e.message : 'Failed to create todo')
    }
  }

  async function completeTodo(todoId: number) {
    try {
      const updated = await api.put<Todo>(`/users/${userId}/todos/${todoId}/complete`, {})
      setTodos((prev) => prev.map((t) => (t.id === todoId ? updated : t)))
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to complete todo')
    }
  }

  async function deleteTodo(todoId: number) {
    try {
      await api.delete(`/users/${userId}/todos/${todoId}`)
      setTodos((prev) => prev.filter((t) => t.id !== todoId))
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to delete todo')
    }
  }

  if (isLoading) {
    return <p className='text-muted-foreground'>Loading todos...</p>
  }

  return (
    <div className='flex flex-col gap-4'>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        {!setControlledOpen && (
          <DialogTrigger asChild>
            <Button className='w-fit'>
              <Plus /> Add To-Do
            </Button>
          </DialogTrigger>
        )}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New To-Do</DialogTitle>
          </DialogHeader>
          <TodoForm value={newTodo} onChange={setNewTodo} onSubmit={createTodo} />
        </DialogContent>
      </Dialog>

      {todos.length === 0 ? (
        <EmptyState message='No to-dos yet. Add one to start earning XP!' />
      ) : (
        <div className='flex flex-col gap-1.5'>
          {todos.map((todo) => (
            <TodoCard
              key={todo.id}
              todo={todo}
              isKnockedOut={isKnockedOut}
              onComplete={() => void completeTodo(todo.id)}
              onDelete={() => void deleteTodo(todo.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ============================== form components ==============================
// extracted so dialog content stays readable

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
        <Label>
          Category
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className='h-3.5 w-3.5 text-muted-foreground' />
            </TooltipTrigger>
            <TooltipContent>
              Choose the category that best fits your To-Do. Completing it levels the matching character stat. (&quot;Mow the
              lawn&quot; could be an example for a Physical To-Do, hence completing it would level up your character&apos;s
              Strength)
            </TooltipContent>
          </Tooltip>
        </Label>
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
                <Heart className='h-4 w-4 text-violet-500' /> Emotional (levelling Resilience)
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className='flex flex-col gap-1.5'>
        <Label>
          Difficulty
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className='h-3.5 w-3.5 text-muted-foreground' />
            </TooltipTrigger>
            <TooltipContent>
              Difficulty describes how challenging this To-Do is to complete. Higher difficulty means greater XP rewards when
              completed.
            </TooltipContent>
          </Tooltip>
        </Label>
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
