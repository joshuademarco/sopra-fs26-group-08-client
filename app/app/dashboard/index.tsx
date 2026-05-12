'use client'

import { LiveOnlineMap } from '@/components/live-online-map'
import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useApi } from '@/hooks/useApi'
import { WeatherQuestCard } from '@/components/weather-quest-card'
import { WeatherQuest } from '@/types/task'

export default function Dashboard() {
  const { user } = useAuth()
  const api = useApi()
  const [quest, setQuest] = useState<WeatherQuest | null>(null)

  useEffect(() => {
  if (!user) return
  api.get<WeatherQuest>(`/users/${user.id}/weather-quest`)
    .then(setQuest)
    .catch(() => setQuest(null))
  }, [user])

  return (
  <div className='flex flex-1 flex-col gap-4'>
    <WeatherQuestCard quest={quest} />
    <LiveOnlineMap />
  </div>
  )
}
