'use client'

import { useAuth } from '@/hooks/useAuth'
import type { LiveUser } from '@/types/liveUser'
import type { CharacterUpdateMessage, RaidSocketMessage, WeatherQuestUpdateMessage } from '@/types/websocket'
import { getWebSocketDomain } from '@/utils/domain'
import React, { useCallback, useEffect, useRef, useState } from 'react'

const RECONNECT_DELAY_MS = 2000

export type RaidUpdateCallback = (msg: RaidSocketMessage) => void
export type CharacterUpdateCallback = (msg: CharacterUpdateMessage) => void
export type WeatherQuestUpdateCallback = (msg: WeatherQuestUpdateMessage) => void

type WebSocketContextType = {
  // Presence WebSocket
  onlineUsers: LiveUser[]
  presenceConnected: boolean
  presenceError: string | null
  lastPresenceUpdate: Date | null

  // Raid WebSocket
  raidConnected: boolean
  raidError: string | null
  subscribeToRaidUpdates: (callback: RaidUpdateCallback) => () => void

  // Character WebSocket
  characterConnected: boolean
  subscribeToCharacterUpdates: (callback: CharacterUpdateCallback) => () => void

  // Weather Quest WebSocket
  weatherQuestConnected: boolean
  subscribeToWeatherQuestUpdates: (callback: WeatherQuestUpdateCallback) => () => void
}

type PresenceSnapshot = LiveUser[] | { users?: LiveUser[] }

function toOnlineUsers(users: LiveUser[]) {
  return users.filter((user) => user.status === 'ONLINE')
}

function parsePresenceSnapshot(raw: string): LiveUser[] {
  const payload = JSON.parse(raw) as PresenceSnapshot
  return Array.isArray(payload) ? payload : (payload.users ?? [])
}

function isRaidSocketMessage(msg: unknown): msg is RaidSocketMessage {
  if (typeof msg !== 'object' || msg === null) return false
  const type = (msg as RaidSocketMessage).type
  return type === 'RAID_UPDATE' || type === 'RAID_DELETED'
}

function isCharacterUpdate(msg: unknown): msg is CharacterUpdateMessage {
  return typeof msg === 'object' && msg !== null && (msg as CharacterUpdateMessage).type === 'CHARACTER_UPDATE'
}

function isWeatherQuestUpdate(msg: unknown): msg is WeatherQuestUpdateMessage {
  return typeof msg === 'object' && msg !== null && (msg as WeatherQuestUpdateMessage).type === 'WEATHER_QUEST_UPDATE'
}

export const WebSocketContext = React.createContext<WebSocketContextType | undefined>(undefined)

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()

  // Presence
  const [onlineUsers, setOnlineUsers] = useState<LiveUser[]>([])
  const [presenceConnected, setPresenceConnected] = useState(false)
  const [presenceError, setPresenceError] = useState<string | null>(null)
  const [lastPresenceUpdate, setLastPresenceUpdate] = useState<Date | null>(null)

  // Raid
  const [raidConnected, setRaidConnected] = useState(false)
  const [raidError, setRaidError] = useState<string | null>(null)
  const raidCallbacksRef = useRef<Set<RaidUpdateCallback>>(new Set())

  // Character
  const [characterConnected, setCharacterConnected] = useState(false)
  const characterCallbacksRef = useRef<Set<CharacterUpdateCallback>>(new Set())

  // Weather Quest
  const [weatherQuestConnected, setWeatherQuestConnected] = useState(false)
  const weatherQuestCallbacksRef = useRef<Set<WeatherQuestUpdateCallback>>(new Set())

  const resetConnectionState = useCallback(() => {
    setOnlineUsers([])
    setPresenceConnected(false)
    setPresenceError(null)
    setLastPresenceUpdate(null)
    setRaidConnected(false)
    setRaidError(null)
    setCharacterConnected(false)
    setWeatherQuestConnected(false)
  }, [])

  // Presence WebSocket
  useEffect(() => {
    if (isLoading || !isAuthenticated) {
      resetConnectionState()
      return
    }

    let ignore = false
    let socket: WebSocket | null = null
    let reconnectTimer: ReturnType<typeof setTimeout> | undefined

    const connect = () => {
      if (ignore) return

      const socketUrl = new URL('/ws/presence', getWebSocketDomain()).toString()
      socket = new WebSocket(socketUrl)

      socket.onopen = () => {
        setPresenceConnected(true)
        setPresenceError(null)
      }

      socket.onmessage = (event) => {
        try {
          setOnlineUsers(toOnlineUsers(parsePresenceSnapshot(event.data)))
          setLastPresenceUpdate(new Date())
        } catch {
          setPresenceError('Received an invalid presence update')
        }
      }

      socket.onerror = () => {
        setPresenceError('Presence connection error')
      }

      socket.onclose = () => {
        setPresenceConnected(false)
        if (!ignore) reconnectTimer = setTimeout(connect, RECONNECT_DELAY_MS)
      }
    }

    connect()

    return () => {
      ignore = true
      if (reconnectTimer) clearTimeout(reconnectTimer)
      socket?.close(1000, 'provider unmounted')
    }
  }, [isAuthenticated, isLoading, resetConnectionState])

  // Raid WebSocket
  useEffect(() => {
    if (isLoading || !isAuthenticated) {
      setRaidConnected(false)
      setRaidError(null)
      return
    }

    let ignore = false
    let socket: WebSocket | null = null
    let reconnectTimer: ReturnType<typeof setTimeout> | undefined

    const connect = () => {
      if (ignore) return

      const socketUrl = new URL('/ws/raid', getWebSocketDomain()).toString()
      socket = new WebSocket(socketUrl)

      socket.onopen = () => {
        setRaidConnected(true)
        setRaidError(null)
      }

      socket.onmessage = (event) => {
        try {
          const payload: unknown = JSON.parse(event.data as string)
          if (isRaidSocketMessage(payload)) {
            raidCallbacksRef.current.forEach((cb) => cb(payload))
          }
        } catch {
          setRaidError('Received an invalid raid update')
        }
      }

      socket.onerror = () => {
        setRaidError('Raid connection error')
      }

      socket.onclose = () => {
        setRaidConnected(false)
        if (!ignore) reconnectTimer = setTimeout(connect, RECONNECT_DELAY_MS)
      }
    }

    connect()

    return () => {
      ignore = true
      if (reconnectTimer) clearTimeout(reconnectTimer)
      socket?.close(1000, 'provider unmounted')
    }
  }, [isAuthenticated, isLoading])

  // Character WebSocket connection
  useEffect(() => {
    if (isLoading || !isAuthenticated) {
      setCharacterConnected(false)
      return
    }

    let ignore = false
    let socket: WebSocket | null = null
    let reconnectTimer: ReturnType<typeof setTimeout> | undefined

    const connect = () => {
      if (ignore) return

      const socketUrl = new URL('/ws/character', getWebSocketDomain()).toString()
      socket = new WebSocket(socketUrl)

      socket.onopen = () => {
        setCharacterConnected(true)
      }

      socket.onmessage = (event) => {
        try {
          const payload: unknown = JSON.parse(event.data as string)
          if (isCharacterUpdate(payload)) {
            characterCallbacksRef.current.forEach((cb) => cb(payload))
          }
        } catch {
          // ignore malformed messages
        }
      }

      socket.onerror = () => {
        setCharacterConnected(false)
      }

      socket.onclose = () => {
        setCharacterConnected(false)
        if (!ignore) reconnectTimer = setTimeout(connect, RECONNECT_DELAY_MS)
      }
    }

    connect()

    return () => {
      ignore = true
      if (reconnectTimer) clearTimeout(reconnectTimer)
      socket?.close(1000, 'provider unmounted')
    }
  }, [isAuthenticated, isLoading])

  // Weather Quest WebSocket connection
  useEffect(() => {
    if (isLoading || !isAuthenticated) {
      setWeatherQuestConnected(false)
      return
    }

    let ignore = false
    let socket: WebSocket | null = null
    let reconnectTimer: ReturnType<typeof setTimeout> | undefined

    const connect = () => {
      if (ignore) return

      const socketUrl = new URL('/ws/weather-quest', getWebSocketDomain()).toString()
      socket = new WebSocket(socketUrl)

      socket.onopen = () => {
        setWeatherQuestConnected(true)
      }

      socket.onmessage = (event) => {
        try {
          const payload: unknown = JSON.parse(event.data as string)
          if (isWeatherQuestUpdate(payload)) {
            weatherQuestCallbacksRef.current.forEach((cb) => cb(payload))
          }
        } catch {}
      }

      socket.onerror = () => {
        setWeatherQuestConnected(false)
      }

      socket.onclose = () => {
        setWeatherQuestConnected(false)
        if (!ignore) reconnectTimer = setTimeout(connect, RECONNECT_DELAY_MS)
      }
    }

    connect()

    return () => {
      ignore = true
      if (reconnectTimer) clearTimeout(reconnectTimer)
      socket?.close(1000, 'provider unmounted')
    }
  }, [isAuthenticated, isLoading])

  const subscribeToRaidUpdates = useCallback((callback: RaidUpdateCallback) => {
    raidCallbacksRef.current.add(callback)
    return () => {
      raidCallbacksRef.current.delete(callback)
    }
  }, [])

  const subscribeToCharacterUpdates = useCallback((callback: CharacterUpdateCallback) => {
    characterCallbacksRef.current.add(callback)
    return () => {
      characterCallbacksRef.current.delete(callback)
    }
  }, [])

  const subscribeToWeatherQuestUpdates = useCallback((callback: WeatherQuestUpdateCallback) => {
    weatherQuestCallbacksRef.current.add(callback)
    return () => {
      weatherQuestCallbacksRef.current.delete(callback)
    }
  }, [])

  const value: WebSocketContextType = {
    onlineUsers,
    presenceConnected,
    presenceError,
    lastPresenceUpdate,
    raidConnected,
    raidError,
    subscribeToRaidUpdates,
    characterConnected,
    subscribeToCharacterUpdates,
    weatherQuestConnected,
    subscribeToWeatherQuestUpdates,
  }

  return <WebSocketContext.Provider value={value}>{children}</WebSocketContext.Provider>
}
