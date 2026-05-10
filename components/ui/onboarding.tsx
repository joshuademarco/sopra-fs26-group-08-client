'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useAuthContext } from '@/providers/auth-provider'
import { useState } from 'react'

const STEPS = [
  {
    title: 'Welcome to BetterTogether!',
    description: "Build better habits, grow your character and conquer boss raids with friends. Let's show you around.",
  },
  {
    title: 'Habits & To-Dos',
    description: "Track your daily habits and one-off tasks. Completing them earns XP and boosts your character's stats.",
  },
  {
    title: 'Your Character',
    description:
      'Your character grows as you complete habits. Strength, Intelligence and Resilience each map to a habit category.',
  },
  {
    title: 'Groups & Boss Raids',
    description: 'Join a group and team up to defeat boss raids together. Your combined stats determine the outcome.',
  },
  {
    title: 'Leaderboard',
    description: "Compete with others based on your character's level and XP. Stay consistent to climb the ranks.",
  },
]

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
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>{STEPS[step].title}</DialogTitle>
          <DialogDescription>{STEPS[step].description}</DialogDescription>
        </DialogHeader>

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
