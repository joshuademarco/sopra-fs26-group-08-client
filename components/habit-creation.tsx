'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import type { HabitCategory, HabitFrequency, NewHabit } from '@/types/task'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Brain, Flame, Heart, Info, Minus, Plus } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

function weightLabel(w: number) {
  return w === 1 ? 'Easy' : w === 2 ? 'Medium' : 'Hard'
}

export function HabitForm({ value, onChange, onSubmit }: { value: NewHabit; onChange: (v: NewHabit) => void; onSubmit: () => void }) {
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
        <Label>
          Category
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className='h-3.5 w-3.5 text-muted-foreground' />
            </TooltipTrigger>
            <TooltipContent>
              Choose the category that best fits your habit. Completing it levels the matching character stat (&quot;Morning Run&quot;
              could be an example for a Physical habit, hence completing it would level up your character&apos;s Strength). Weather
              conditions can boost XP for specific categories.
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
        <Label>
          Type
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className='h-3.5 w-3.5 text-muted-foreground' />
            </TooltipTrigger>
            <TooltipContent>
              Positive habits (e.g. Morning run) reward you with XP when completed. Negative habits (e.g. Smoking) represent bad
              habits you want to avoid - completing them applies a health reduction to your character.
            </TooltipContent>
          </Tooltip>
        </Label>
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
        <Label>
          Difficulty
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className='h-3.5 w-3.5 text-muted-foreground' />
            </TooltipTrigger>
            <TooltipContent>
              Difficulty describes how challenging this habit is to complete. Higher difficulty means greater XP rewards when
              completed, but also greater health damage when missed or a negative habit is completed.
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

      <Button onClick={onSubmit} disabled={!value.title.trim()}>
        Create Habit
      </Button>
    </div>
  )
}