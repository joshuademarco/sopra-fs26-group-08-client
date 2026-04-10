'use client'

import { useEffect, useState } from 'react'

import { AppSidebar } from '@/components/app-sidebar'
import { LiveOnlineMap } from '@/components/live-online-map'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { WeatherIcon } from '@/components/weather-icon'
import { useAuth } from '@/hooks/useAuth'
import { useLiveOnlineUsers } from '@/hooks/useLiveOnlineUsers'
import { useRouter } from 'next/navigation'
import { useApi } from '@/hooks/useApi'

export default function ClientApplicationPage() {
  const router = useRouter()
  const { user, token, isLoading } = useAuth()
  const { users, isConnected, lastUpdated } = useLiveOnlineUsers(token)
  const [weatherCode, setWeatherCode] = useState<number | null>(null)
  const api = useApi()

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/')
    }
  }, [isLoading, router, user])

  useEffect(() => {
    api.get<number>("/weather").then(setWeatherCode)
  }, [api])

  if (!user) {
    return null
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className='flex h-16 shrink-0 items-center gap-2'>
          <div className='flex items-center gap-2 px-4'>
            <SidebarTrigger className='-ml-1' />
            <Separator orientation='vertical' className='mr-2 data-[orientation=vertical]:h-4' />
            <div className='hidden flex-col gap-0.5 sm:flex'>
              <span className='text-sm font-medium'>Dashboard</span>
            </div>
          </div>
        </header>
        <div className='flex flex-1 flex-col gap-6 p-4 pt-0'>
          <div className='grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.75fr)]'>
            <LiveOnlineMap users={users} isConnected={isConnected} lastUpdated={lastUpdated} />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
