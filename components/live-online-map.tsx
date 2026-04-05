'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { LiveUser } from '@/types/liveUser'
import { MapPinned, Users } from 'lucide-react'
import Image from 'next/image'
import { useMemo } from 'react'

type LiveOnlineMapProps = {
  users: LiveUser[]
  isConnected: boolean
  lastUpdated: Date | null
}

function getRandomPosition() {
  const left = 8 + Math.random() * 84
  const top = 12 + Math.random() * 72
  return {
    left: `${left}%`,
    top: `${top}%`,
  }
}

function getInitials(username: string) {
  return username
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function formatUpdatedAt(lastUpdated: Date | null) {
  if (!lastUpdated) {
    return 'Waiting for the first live update'
  }

  return `Updated ${lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
}

export function LiveOnlineMap({ users, isConnected: _isConnected, lastUpdated }: LiveOnlineMapProps) {
  const randomPositions = useMemo(() => users.map(() => getRandomPosition()), [users])

  return (
    <Card>
      <CardHeader>
        <div className='flex flex-row items-start justify-between gap-3'>
          <div className='space-y-1'>
            <CardTitle className='flex items-center gap-2 text-lg'>
              <MapPinned className='size-5 text-primary' />
              Online Map
            </CardTitle>
            <CardDescription>Users currently online are shown on the shared world map.</CardDescription>
          </div>

          <div className='flex items-center gap-2 text-xs text-muted-foreground'>
            <span className='inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1.5'>
              <Users className='size-3.5' />
              {users.length} online
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className='space-y-4 p-4 md:p-5'>
        <div className='relative h-136 overflow-hidden rounded-lg border'>
          <Image src='/map.png' fill alt='Online Map' className='object-contain object-center bg-muted' />

          {users.map((user, index) => {
            const position = randomPositions[index] ?? { left: '50%', top: '50%' }

            return (
              <div
                key={user.id}
                className='absolute z-10 -translate-x-1/2 -translate-y-1/2'
                style={{ left: position.left, top: position.top }}
                title={`${user.username} is online`}
              >
                <div className='relative flex flex-col items-center gap-1.5'>
                  <Avatar className='size-9'>
                    <AvatarFallback className='bg-foreground text-background'>{getInitials(user.username)}</AvatarFallback>
                  </Avatar>
                  <span className='text-[10px] font-medium text-foreground'>{user.username}</span>
                </div>
              </div>
            )
          })}
        </div>

        <div className='flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground'>
          <span>{formatUpdatedAt(lastUpdated)}</span>
        </div>
      </CardContent>
    </Card>
  )
}
