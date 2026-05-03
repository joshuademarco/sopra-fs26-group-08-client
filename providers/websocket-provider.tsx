'use client'

import type { LiveUser } from '@/types/liveUser'
import type { CharacterUpdateMessage, RaidUpdateMessage } from '@/types/websocket'
import { getWebSocketDomain } from '@/utils/domain'
import React, { useCallback, useEffect, useRef, useState } from 'react'

const RECONNECT_DELAY_MS = 2000

export type RaidUpdateCallback = (msg: RaidUpdateMessage) => void
export type CharacterUpdateCallback = (msg: CharacterUpdateMessage) => void

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
}

type PresenceSnapshot = LiveUser[] | { users?: LiveUser[] }

function toOnlineUsers(users: LiveUser[]) {
  return users.filter((user) => user.status === 'ONLINE')
}

function parsePresenceSnapshot(raw: string): LiveUser[] {
  const payload = JSON.parse(raw) as PresenceSnapshot
  return Array.isArray(payload) ? payload : (payload.users ?? [])
}

function isRaidUpdate(msg: unknown): msg is RaidUpdateMessage {
  return typeof msg === 'object' && msg !== null && (msg as RaidUpdateMessage).type === 'RAID_UPDATE'
}

function isCharacterUpdate(msg: unknown): msg is CharacterUpdateMessage {
  return typeof msg === 'object' && msg !== null && (msg as CharacterUpdateMessage).type === 'CHARACTER_UPDATE'
}

export const WebSocketContext = React.createContext<WebSocketContextType | undefined>(undefined)

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
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

  // Presence WebSocket
  useEffect(() => {
    let ignore = false
    let socket: WebSocket | null = null
    let reconnectTimer: ReturnType<typeof setTimeout> | undefined

    const connect = () => {
      if (ignore) return

      const socketUrl = new URL('/api/ws/presence', getWebSocketDomain()).toString()
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
  }, [])

  // Raid WebSocket
  useEffect(() => {
    let ignore = false
    let socket: WebSocket | null = null
    let reconnectTimer: ReturnType<typeof setTimeout> | undefined

    const connect = () => {
      if (ignore) return

      const socketUrl = new URL('/api/ws/raid', getWebSocketDomain()).toString()
      socket = new WebSocket(socketUrl)

      socket.onopen = () => {
        setRaidConnected(true)
        setRaidError(null)
      }

      socket.onmessage = (event) => {
        try {
          const payload: unknown = JSON.parse(event.data as string)
          if (isRaidUpdate(payload)) {
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
  }, [])

  // Character WebSocket connection
  useEffect(() => {
    let ignore = false
    let socket: WebSocket | null = null
    let reconnectTimer: ReturnType<typeof setTimeout> | undefined

    const connect = () => {
      if (ignore) return

      const socketUrl = new URL('/api/ws/character', getWebSocketDomain()).toString()
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
  }, [])

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
  }

  return <WebSocketContext.Provider value={value}>{children}</WebSocketContext.Provider>
}
