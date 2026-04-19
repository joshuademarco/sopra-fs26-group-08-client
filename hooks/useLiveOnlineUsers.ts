'use client'

import { useApi } from '@/hooks/useApi'
import type { LiveUser } from '@/types/liveUser'
import { getWebSocketDomain } from '@/utils/domain'
import { useEffect, useMemo, useState } from 'react'

const ONLINE_STATUS = 'ONLINE'
const RECONNECT_DELAY_MS = 2000

type PresenceSnapshot = LiveUser[] | { users?: LiveUser[] }

function toOnlineUsers(users: LiveUser[]) {
  return users.filter((user) => user.status === ONLINE_STATUS)
}

function parseSnapshot(raw: string): LiveUser[] {
  const payload = JSON.parse(raw) as PresenceSnapshot
  return Array.isArray(payload) ? payload : payload.users ?? []
}

export function useLiveOnlineUsers() {
  const api = useApi()
  const [users, setUsers] = useState<LiveUser[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const socketUrl = useMemo(() => new URL('/api/ws/presence', getWebSocketDomain()).toString(), [])

  useEffect(() => {
    let ignore = false

    const loadInitialUsers = async () => {
      try {
        const allUsers = await api.get<LiveUser[]>("/users")
        if (ignore) {
          return
        }

        setUsers(toOnlineUsers(allUsers))
        setLastUpdated(new Date())
      } catch (fetchError: unknown) {
        if (ignore) {
          return
        }

        setError(fetchError instanceof Error ? fetchError.message : "Unable to load online users")
      }
    }

    void loadInitialUsers()

    return () => {
      ignore = true
    }
  }, [api])

  useEffect(() => {
    let ignore = false
    let socket: WebSocket | null = null
    let reconnectTimer: ReturnType<typeof setTimeout> | undefined

    const connect = () => {
      if (ignore) {
        return
      }

      socket = new WebSocket(socketUrl)

      socket.onopen = () => {
        setIsConnected(true)
        setError(null)
      }

      socket.onmessage = (event) => {
        try {
          setUsers(toOnlineUsers(parseSnapshot(event.data)))
          setLastUpdated(new Date())
        } catch {
          setError('Received an invalid presence update')
        }
      }

      socket.onerror = () => {
        setError('Presence connection error')
      }

      socket.onclose = () => {
        setIsConnected(false)

        if (!ignore) {
          reconnectTimer = setTimeout(connect, RECONNECT_DELAY_MS)
        }
      }
    }

    connect()

    return () => {
      ignore = true
      if (reconnectTimer) {
        clearTimeout(reconnectTimer)
      }
      socket?.close(1000, 'component unmounted')
    }
  }, [socketUrl])

  return {
    users,
    isConnected,
    lastUpdated,
    error,
  }
}
