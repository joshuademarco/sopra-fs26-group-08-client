export type HabitCategory = 'PHYSICAL' | 'COGNITIVE' | 'EMOTIONAL'
export type HabitFrequency = 'DAILY' | 'WEEKLY' | 'MONTHLY'

export type Habit = {
  id: number
  title: string
  description?: string
  category: HabitCategory
  frequency: HabitFrequency
  positive: boolean
  weight: number
  completed: boolean
  streak: number
  dueAt?: string
  completedAt?: string
  createdAt: string
}

export type Todo = {
  id: number
  title: string
  description?: string
  category: HabitCategory
  weight: number
  completed: boolean
  dueAt?: string
  completedAt?: string
  createdAt: string
}

export type NewHabit = {
  title: string
  description: string
  category: HabitCategory
  frequency: HabitFrequency
  positive: boolean
  weight: number
}

export type NewTodo = {
  title: string
  description: string
  category: HabitCategory
  weight: number
  dueAt: string
}

//helper functions for habti and todo cards

export function categoryLabel(category: HabitCategory): string {
  switch (category) {
    case 'PHYSICAL':  return 'Strength'
    case 'COGNITIVE': return 'Intelligence'
    case 'EMOTIONAL': return 'Resilience'
  }
}

export function weightLabel(weight: number): string {
  switch (weight) {
    case 1:  return 'Easy'
    case 2:  return 'Medium'
    case 3:  return 'Hard'
    default: return 'Easy'
  }
}

export function categoryColor(category: HabitCategory): string {
  switch (category) {
    case 'PHYSICAL':  return 'text-rose-500'
    case 'COGNITIVE': return 'text-sky-500'
    case 'EMOTIONAL': return 'text-emerald-500'
  }
}