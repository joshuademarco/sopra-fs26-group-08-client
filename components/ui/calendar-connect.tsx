'use client'

import { Button } from '@/components/ui/button'
import { useAuthContext } from '@/providers/auth-provider'
import { buildApiUrl } from '@/utils/domain'
import { CircleCheckBig, Info } from 'lucide-react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export function CalendarConnect({ align = 'center' }: { align?: 'center' | 'start' }) {
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
      <div className={`flex flex-col items-${align} gap-4`}>
        <Button disabled>Loading...</Button>
      </div>
    )
  }

  if (connected || alreadyConnected) {
    return (
      <div className={`flex flex-col items-${align} gap-4`}>
        <p className='text-green-600 font-medium flex items-center gap-2'>
          <CircleCheckBig className='w-5 h-5' /> Calendar connected!
        </p>
      </div>
    )
  }

  return (
    <div className={`flex flex-col items-${align} gap-4`}>
      <div
        role='note'
        className={`flex gap-3 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900 max-w-md text-${align === 'start' ? 'left' : 'left'}`}
      >
        <Info className='w-5 h-5 shrink-0 mt-0.5' aria-hidden='true' />
        <div className='space-y-1'>
          <p className='font-semibold'>Google verification in progress</p>
          <p>
            You may see a screen saying <em>&quot;Google hasn&apos;t verified this app&quot;</em>.
            That&apos;s expected while we finish the review. To continue, click{' '}
            <strong>Advanced</strong> (or <strong>Erweiterte Optionen</strong>) and then{' '}
            <strong>Go to BetterTogeter (unsafe)</strong>. Your data stays private — this is a
            standard step for apps still in Google&apos;s review queue.
          </p>
        </div>
      </div>
      <Button
        onClick={() => {
          if (authUrl) window.location.href = authUrl
        }}
        disabled={!authUrl}
      >
        <Image src='/onboarding/calendaricon.png' alt='Google Calendar' width={50} height={50} />
        Connect Google Calendar
      </Button>
    </div>
  )
}