'use client'

import { LiveOnlineMap } from '@/components/live-online-map'
import { WeatherQuestCard } from '@/components/weather-quest-card'

export default function Dashboard() {
  return (
    <div className='flex flex-col xl:flex-row gap-6'>
      <div className='flex-1 min-w-0'>
        <LiveOnlineMap />
      </div>
      <div className='flex-1 min-w-0'>
        <WeatherQuestCard />
      </div>
    </div>
  )
}
