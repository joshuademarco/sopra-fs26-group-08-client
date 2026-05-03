'use client'

import { WebSocketContext } from '@/providers/websocket-provider'
import { useContext } from 'react'

export function useWebsocketContext() {
  const context = useContext(WebSocketContext)
  if (!context) {
    throw new Error('useWebsocketContext must be used within a WebSocketProvider')
  }
  return context
}
