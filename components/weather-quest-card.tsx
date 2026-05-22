'use client'

import { Badge } from '@/components/ui/badge'
import { useApi } from '@/hooks/useApi'
import { useAuth } from '@/hooks/useAuth'
import { WeatherQuest } from '@/types/task'
import { useEffect, useState } from 'react'

export function WeatherQuestCard() {
  const { user } = useAuth()
  const api = useApi()
  const [quest, setQuest] = useState<WeatherQuest | null>(null)

  useEffect(() => {
    if (!user) return
    api
      .get<WeatherQuest>(`/users/${user.id}/weather-quest`)
      .then(setQuest)
      .catch(() => setQuest(null))
  }, [api, user])

  if (quest === null) {
    return <div className='px-4 py-2 text-sm text-muted-foreground'>No daily quest available</div>
  }

  return (
    <div className='inline-flex max-w-176 items-center gap-3 px-2 py-1.5'>
      <div className='min-w-0 shrink-0 max-w-56'>
        <p className='truncate text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground/60'>DailyQuest</p>
        <p className='whitespace-normal wrap-break-word text-sm font-medium leading-tight text-foreground'>
          {quest.questTitle}
        </p>
      </div>
      <div className='h-8 w-px shrink-0 bg-border/50' />
      <div className='flex min-w-0 flex-col gap-1 text-xs text-foreground/70'>
        <span className='whitespace-nowrap text-base font-bold text-foreground'>
          {quest.completedCount} / {quest.targetCount}
        </span>
        <Badge className='h-6 w-fit whitespace-nowrap rounded-full px-2 py-0 text-[11px]'>
          +{quest.bonusMultiplier}x {quest.bonusStat} XP
        </Badge>
        {quest.completed && <span className='whitespace-nowrap font-medium text-foreground'>Done</span>}
      </div>
    </div>
  )
}
