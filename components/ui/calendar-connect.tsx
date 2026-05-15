'use client'

import { Button } from '@/components/ui/button'
import { useAuthContext } from '@/providers/auth-provider'
import { buildApiUrl } from '@/utils/domain'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export function CalendarConnect() {
  const { user } = useAuthContext()
  const searchParams = useSearchParams()
  const [authUrl, setAuthUrl] = useState<string | null>(null)
  const [connected, setConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const alreadyConnected = searchParams.get('calendarConnected') === 'true'

  useEffect(() => {
    if (!user?.id) return
    const load = async () => {
      try {
        const res = await fetch(buildApiUrl(`/users/${user.id}/calendar/connect`), {
          credentials: 'include',
        })
        if (!res.ok) return
        const data = (await res.json()) as { authUrl: string; connected: boolean }
        setAuthUrl(data.authUrl)
        setConnected(data.connected)
      } finally {
        setIsLoading(false)
      }
    }
    void load()
  }, [user?.id])

  if (isLoading) {
    return (
      <div className='flex flex-col items-center gap-4 py-4'>
        <Button disabled>Loading...</Button>
      </div>
    )
  }

  if (connected || alreadyConnected) {
    return (
      <div className='flex flex-col items-center gap-4 py-4'>
        <p className='text-green-600 font-medium'>✓ Calendar connected!</p>
      </div>
    )
  }

  return (
    <div className='flex flex-col items-center gap-4 py-4'>
      <Button
        onClick={() => {
          if (authUrl) window.location.href = authUrl
        }}
        disabled={!authUrl}
      >
        Connect Google Calendar
      </Button>
    </div>
  )
}
