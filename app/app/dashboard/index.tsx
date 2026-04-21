import { LiveOnlineMap } from '@/components/live-online-map'
import { WeatherIcon } from '@/components/weather-icon'
import { useLiveOnlineUsers } from '@/hooks/useLiveOnlineUsers'

export default function Dashboard({weatherCode}: { weatherCode: number | null }) {
  const { users, isConnected, lastUpdated } = useLiveOnlineUsers()
  return (
    <div className='grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.75fr)]'>
      <LiveOnlineMap users={users} isConnected={isConnected} lastUpdated={lastUpdated} />
      {weatherCode != null && <WeatherIcon weatherCode={weatherCode} />}
    </div>
  )
}
