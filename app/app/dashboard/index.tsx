import { LiveOnlineMap } from '@/components/live-online-map'
import { WeatherQuestCard } from '@/components/weather-quest-card'

export default function Dashboard() {

  return (
  <div className='flex flex-1 flex-col gap-4'>
    <WeatherQuestCard />
    <LiveOnlineMap />
  </div>
  )
}
