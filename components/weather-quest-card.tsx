'use client'

import { Badge } from '@/components/ui/badge'
import { useApi } from '@/hooks/useApi'
import { useAuth } from '@/hooks/useAuth'
import { useWebsocketContext } from '@/hooks/useWebsocketContext'
import { WeatherQuest } from '@/types/task'
import { useEffect, useState } from 'react'

export function WeatherQuestCard() {
  const { user } = useAuth()
  const api = useApi()
  const { subscribeToWeatherQuestUpdates } = useWebsocketContext()
  const [quest, setQuest] = useState<WeatherQuest | null>(null)

  useEffect(() => {
    if (!user) return
    api
      .get<WeatherQuest>(`/users/${user.id}/weather-quest`)
      .then(setQuest)
      .catch(() => setQuest(null))
  }, [api, user])

  useEffect(() => {
    if (!user) return
    return subscribeToWeatherQuestUpdates((msg) => {
      setQuest({
        weatherCondition: msg.weatherCondition,
        weatherLabel: msg.weatherLabel,
        questTitle: msg.questTitle,
        targetCategory: msg.targetCategory,
        targetCount: msg.targetCount,
        bonusStat: msg.bonusStat,
        bonusMultiplier: msg.bonusMultiplier,
        completedCount: msg.completedCount,
        completed: msg.completed,
      })
    })
  }, [subscribeToWeatherQuestUpdates, user])

  if (quest === null) {
    return null
  }

  if (quest.completed) {
    return (
      <div className='inline-flex max-w-176 items-center gap-3 py-1.5'>
        <div className='min-w-0 shrink-0'>
          <p className='truncate text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground/60'>DailyQuest</p>
          <p className='wrap-break-word text-sm font-small leading-tight text-foreground'>All complete</p>
        </div>
      </div>
    )
  }

  return (
    <div className='inline-flex max-w-176 items-center gap-3 py-1.5'>
      <div className='min-w-0 shrink-0 max-w-48'>
        <p className='truncate text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground/60'>DailyQuest</p>
        <p className='wrap-break-word text-sm font-small leading-tight text-foreground'>
          {quest.questTitle}
        </p>
      </div>
      <div className='h-8 w-px shrink-0 bg-border/50' />
      <div className='flex min-w-0 flex-col gap-1 text-xs text-foreground/70'>
        <span className='whitespace-nowrap text-base font-bold text-foreground'>
          {quest.completedCount} / {quest.targetCount}
        </span>
        <Badge className='h-6 w-fit whitespace-nowrap rounded-full px-2 py-0 text-[11px]'>
          +{quest.bonusMultiplier}x {quest.bonusStat}
        </Badge>
      </div>
    </div>
  )
}
