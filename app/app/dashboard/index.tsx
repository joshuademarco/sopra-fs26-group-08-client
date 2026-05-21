import { LiveOnlineMap } from '@/components/live-online-map'
import { WeatherIcon } from '@/components/weather-icon'
import { WeatherQuestCard } from '@/components/weather-quest-card'

export default function Dashboard() {
  return (
    <div className='flex flex-1 flex-col gap-4'>
      <WeatherQuestCard />
      {/* <WeatherIcon /> */}
      <div className='relative -mx-12 -mb-12 flex-1 w-[calc(100%+6rem)]'>
        <LiveOnlineMap />
      </div>
    </div>
  )
}
