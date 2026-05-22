'use client'

import { HabitHeatmap } from '@/components/heatmap'
import { LiveOnlineMap } from '@/components/live-online-map'
import { WeatherQuestCard } from '@/components/weather-quest-card'
import { useMediaQuery } from '@/hooks/useMediaQuery'

export default function Dashboard() {
  const isLargeScreen = useMediaQuery('(min-width: 1024px)')

  if (isLargeScreen) {
    return (
      <div className='flex gap-6'>
        <div className='flex-1 min-w-0'><LiveOnlineMap /></div>
        <div className='flex-1 min-w-0 flex flex-col gap-4'>
          <WeatherQuestCard />
          <HabitHeatmap />
        </div>
      </div>
    )
  }

  return (
    <div className='flex flex-1 flex-col gap-4'>
      <WeatherQuestCard />
      <HabitHeatmap />
      <LiveOnlineMap />
    </div>
  )
}
