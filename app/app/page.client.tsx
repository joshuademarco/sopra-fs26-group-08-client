'use client'

import { AppSidebar } from '@/components/app-sidebar'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { WeatherIcon } from '@/components/weather-icon'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import BossRaidPage from './boss-raid'
import CharacterPage from './character'
import Dashboard from './dashboard'
import GroupsPage from './groups'
import HabitsPage from './habits'
import LeaderboardPage from './leaderboard'
import SettingsPage from './settings'

export default function ClientApplicationPage({ weatherCode }: { weatherCode: number | null }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [currentPage, setCurrentPage] = useState(searchParams.get('page') ?? 'dashboard')

  const setCurrentPageWithQuery = (page: string) => {
    setCurrentPage(page)
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page)
    router.replace(`${pathname}?${params.toString()}`)
  }

  return (
    <SidebarProvider>
      <AppSidebar setCurrentPage={setCurrentPageWithQuery} />
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
        <div className='flex w-full flex-col'>
          <div className='flex p-4 pb-0'>
            <div className='ml-auto'>{weatherCode != null && <WeatherIcon weatherCode={weatherCode} />}</div>
          </div>
          <div className='flex flex-1 flex-col gap-6 p-4 pt-0'>
            {currentPage === 'dashboard' && <Dashboard />}

            {currentPage === 'habits' && <HabitsPage />}

            {currentPage === 'character' && <CharacterPage />}

            {currentPage === 'groups' && <GroupsPage />}

            {currentPage === 'boss-raids' && <BossRaidPage />}

            {currentPage === 'leaderboard' && <LeaderboardPage />}

            {currentPage === 'settings' && <SettingsPage />}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
