'use client'

import { useWebsocketContext } from '@/hooks/useWebsocketContext'

export function useLiveOnlineUsers() {
  const { onlineUsers: users, presenceConnected: isConnected, presenceError: error, lastPresenceUpdate: lastUpdated } =
    useWebsocketContext()

  return {
    users,
    isConnected,
    lastUpdated,
    error,
  }
}
