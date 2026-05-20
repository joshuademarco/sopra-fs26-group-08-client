'use client'

import { HabitHeatmap } from '@/components/heatmap'
import { LiveOnlineMap } from '@/components/live-online-map'
import { WeatherQuestCard } from '@/components/weather-quest-card'
import { useApi } from '@/hooks/useApi'
import { useAuth } from '@/hooks/useAuth'
import { useEffect, useState } from 'react'

export default function Dashboard() {
  const { user } = useAuth()
  const api = useApi()
  const [heatmap, setHeatmap] = useState<Record<string, number>>({})

  useEffect(() => {
    if (!user) return
    api.get<Record<string, number>>(`/users/${user.id}/habits/heatmap`)
      .then(setHeatmap)
      .catch(() => {})
  }, [user?.id])

  return (
    <div className='flex flex-1 flex-col gap-4'>
      <WeatherQuestCard />
      <HabitHeatmap data={heatmap} />
      <LiveOnlineMap />
    </div>
  )
}
