'use client'

import { AppSidebar } from '@/components/app-sidebar'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { WeatherIcon } from '@/components/weather-icon'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import BossRaidPage from './boss-raid'
import CharacterPage from './character'
import Dashboard from './dashboard'
import GroupsPage from './groups'
import HabitsPage from './habits'
import LeaderboardPage from './leaderboard'
import AccountPage from './account'
import { Onboarding } from '@/components/ui/onboarding'


export default function ClientApplicationPage({ weatherCode }: { weatherCode: number | null }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [currentPage, setCurrentPage] = useState(searchParams.get('page') ?? 'dashboard')
  const [activeTab, setActiveTab] = useState<'habits' | 'todos'>('habits')
  const isLargeScreen = useMediaQuery('(min-width: 1024px)')

  const pageTitles: Record<string, string> = {
    dashboard: 'Dashboard',
    habits: isLargeScreen ? 'Tasks' : activeTab === 'todos' ? 'To-Dos' : 'Habits',
    character: 'Character',
    groups: 'Groups',
    'boss-raids': 'Boss Raids',
    leaderboard: 'Leaderboard',
    account: 'Account',
  }
  const pageTitle = pageTitles[currentPage] || 'Dashboard'

  const setCurrentPageWithQuery = (page: string) => {
    setCurrentPage(page)
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page)
    router.replace(`${pathname}?${params.toString()}`)
  }

  return (
    <SidebarProvider>
      <AppSidebar setCurrentPage={setCurrentPageWithQuery} />
      <SidebarInset className={currentPage === 'dashboard' ? 'bg-[#47aba9]' : ''}>
        <header
          className={`sticky top-0 z-50 flex min-h-16 shrink-0 items-center justify-between gap-4 ${currentPage === 'dashboard' ? 'bg-[#47aba9]' : 'bg-background'}`}
        >
          <div className='flex items-center gap-2 px-4'>
            <SidebarTrigger className='-ml-1' />
            <Separator orientation='vertical' className='mr-2 data-[orientation=vertical]:h-4' />
            <div className='hidden flex-col gap-0.5 sm:flex'>
              <span className='text-sm font-medium'>{pageTitle}</span>
            </div>
          </div>
          <div className='px-4 py-2'>{weatherCode != null && <WeatherIcon weatherCode={weatherCode} />}</div>
        </header>
        <div className='flex w-full flex-col p-12 pt-0'>
          <div className='flex items-center justify-between gap-4 mb-6'>
            <div className='flex flex-col'>
              <h2>{pageTitle}</h2>
            </div>
          </div>
          <div className='flex-1'>
            {currentPage === 'dashboard' && <Dashboard />}

            {currentPage === 'habits' && <HabitsPage activeTab={activeTab} setActiveTab={setActiveTab} isLargeScreen={isLargeScreen} />}

            {currentPage === 'character' && <CharacterPage />}

            {currentPage === 'groups' && <GroupsPage />}

            {currentPage === 'boss-raids' && <BossRaidPage />}

            {currentPage === 'leaderboard' && <LeaderboardPage />}

            {currentPage === 'account' && <AccountPage />}
          </div>
        </div>
      </SidebarInset>
      <Onboarding />
    </SidebarProvider>
  )
}
