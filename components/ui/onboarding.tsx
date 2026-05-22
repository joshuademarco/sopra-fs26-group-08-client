'use client'

import { GravatarImage } from '@/components/gravatar-image'
import { HabitForm } from '@/components/habit-creation'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { CalendarConnect } from '@/components/ui/calendar-connect'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { NotificationOnboarding } from '@/components/ui/pushoverinstruction'
import { useApi } from '@/hooks/useApi'
import { useAuth } from '@/hooks/useAuth'
import { useAuthContext } from '@/providers/auth-provider'
import { Habit, NewHabit } from '@/types/task'
import Image from 'next/image'
import { useState } from 'react'
import { toast } from 'sonner'
import { NotificationSettings } from './notificationssetting'

const STEPS = [
  {
    title: 'Welcome to BetterTogeter!',
    description: "Build better habits, grow your character and conquer boss raids with friends. Each habit you complete earns XP, levels your character's stats and contributes to your team's strength in raids. Let's get you set up.",
    content: <WelcomeImage />,
  },
  {
    title: 'Habits & To-Dos',
    description: "Habits are recurring tasks (daily, weekly, or monthly) that build your character over time. To-Dos are one-off tasks you want to get done. Completing either earns XP, but missing a habit costs you health, so stay consistent.",
    image: '/onboarding/habitoverview.png',
  },
  {
    title: 'Habits Creation',
    description: "Create your first habit below. Pick a category that fits. Physical habits level your Strength, Cognitive habits level your Intelligence and Emotional habits level your Resilience. Set the difficulty honestly: harder habits reward more XP but also deal more damage if missed.",
    content: <HabitCreation />,
  },
  {
    title: 'Your Character',
    description:
      'Your character grows as you complete habits. Strength, Intelligence and Resilience each map to a habit category.',
    image: '/onboarding/character.png',
  },
  {
    title: 'Your Avatar',
    description: 'Add a personal touch with a Gravatar. Your photo will show up on the leaderboard, in groups, and in the sidebar.',
    content: <GravatarSetup />,
  },
  {
    title: 'Groups & Boss Raids',
    description: 'Join a group and team up to defeat boss raids together. Your combined stats determine the outcome.',
    image: '/onboarding/raid.png',
  },
  {
    title: 'Leaderboard',
    description: "Compete with others based on your character's level and XP. Stay consistent to climb the ranks.",
    image: '/onboarding/leaderboard.png',
  },
  {
    title: 'Notification Preferences',
    description: "Stay on top of raids and group activity. Set up Pushover for real-time push notifications on any device or stick with email.",
    content: <NotificationOnboarding />,
  },
  {
    title: 'Notification Preferences',
    description: "Stay on top of raids and group activity. Set up Pushover for real-time push notifications on any device or stick with email.",
    content: <NotificationSettings />,
  },
  {
    title: 'Connect Google Calendar',
    description: "Connecting your Google Calendar is required to participate in boss raids. We use it to check your availability when scheduling raid windows with your group. Click the button below to authorize.",
    content: <CalendarConnect />,
  },
]

function WelcomeImage() {
  return (
    <div className='flex justify-center'>
      <Image src='/GroupOfPeople.png' alt='Group of People' width={300} height={180} className='rounded-lg object-cover' />
    </div>
  )
}

function GravatarSetup() {
  const { user } = useAuth()
  const initials = user?.username?.[0]?.toUpperCase() ?? 'U'

  return (
    <div className='flex flex-col items-center gap-6 py-4'>
      <Avatar className='size-24'>
        {user?.email && <GravatarImage identifier={user.email} size={96} />}
        <AvatarFallback className='text-2xl'>{initials}</AvatarFallback>
      </Avatar>
      <div className='flex flex-col items-center gap-2 text-center'>
        <p className='text-base text-muted-foreground'>
          Your avatar is pulled from{' '}
          <a href='https://gravatar.com' target='_blank' rel='noreferrer' className='text-primary underline underline-offset-4'>
            Gravatar
          </a>
          . Create a free account there and link your email address{' '}
          <span className='font-medium text-foreground'>{user?.email}</span> to set your photo.
        </p>
        <p className='text-base text-muted-foreground'>It will appear in the leaderboard, groups, and the sidebar.</p>
      </div>
      <Button asChild variant='outline' size='sm'>
        <a href='https://gravatar.com' target='_blank' rel='noreferrer'>
          Set up Gravatar
        </a>
      </Button>
    </div>
  )
}

function HabitCreation() {
  const api = useApi()
  const { user } = useAuth()

  const [newHabit, setNewHabit] = useState<NewHabit>({
    title: '',
    description: '',
    category: 'PHYSICAL',
    frequency: 'DAILY',
    positive: true,
    weight: 1,
  })

  async function createHabit() {
    if (!newHabit.title.trim()) return
    try {
      await api.post<Habit>(`/users/${user?.id}/habits`, newHabit)
      setNewHabit({ title: '', description: '', category: 'PHYSICAL', frequency: 'DAILY', positive: true, weight: 1 })
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to create habit')
    }
  }

  return <HabitForm value={newHabit} onChange={setNewHabit} onSubmit={createHabit} />
}

export function Onboarding() {
  const { user, completeOnboarding } = useAuthContext()
  const [step, setStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isOpen = user?.onboardingCompleted === false
  const isLast = step === STEPS.length - 1

  async function handleFinish() {
    setIsSubmitting(true)
    try {
      await completeOnboarding()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen}>
      <DialogContent showCloseButton={false} className='sm:max-w-xl'>
        <DialogHeader>
          <DialogTitle className='text-xl'>{STEPS[step].title}</DialogTitle>
          <DialogDescription className='text-base'>{STEPS[step].description}</DialogDescription>
        </DialogHeader>
        <div className='h-100 w-full overflow-hidden rounded-lg'>
          {STEPS[step].content ?? (STEPS[step].image && (
              <Image src={STEPS[step].image} alt='' className='rounded-lg object-cover' width={600} height={600} />
            ))}
        </div>
        <div className='flex justify-center gap-1 py-2'>
          {STEPS.map((_, i) => (
            <span key={i} className={`h-1.5 w-6 rounded-full transition-colors ${i === step ? 'bg-primary' : 'bg-muted'}`} />
          ))}
        </div>

        <DialogFooter>
          {step > 0 && (
            <Button variant='outline' onClick={() => setStep((s) => s - 1)}>
              Back
            </Button>
          )}
          {isLast ? (
            <Button onClick={handleFinish} disabled={isSubmitting}>
              {isSubmitting ? 'Loading...' : 'Get Started'}
            </Button>
          ) : (
            <Button onClick={() => setStep((s) => s + 1)}>Next</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
