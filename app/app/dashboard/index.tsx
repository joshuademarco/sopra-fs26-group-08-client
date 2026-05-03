import { LiveOnlineMap } from '@/components/live-online-map'
import { useLiveOnlineUsers } from '@/hooks/useLiveOnlineUsers'

export default function Dashboard() {
  const { users, isConnected, lastUpdated } = useLiveOnlineUsers()
  return <LiveOnlineMap users={users} isConnected={isConnected} lastUpdated={lastUpdated} />
}
