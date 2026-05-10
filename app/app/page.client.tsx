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
import AccountPage from './account'
import { Onboarding } from '@/components/ui/onboarding'

interface PageTitle {
  title: string
  subtitle?: string
}

const getPageTitle = (page: string): PageTitle => {
  const titles: Record<string, PageTitle> = {
    dashboard: { title: 'Dashboard' },
    habits: { title: 'Habits', subtitle: 'Tasks' },
    character: { title: 'Character' },
    groups: { title: 'Groups' },
    'boss-raids': { title: 'Boss Raids' },
    leaderboard: { title: 'Leaderboard' },
    settings: { title: 'Settings' },
  }
  return titles[page] || { title: 'Dashboard' }
}

export default function ClientApplicationPage({ weatherCode }: { weatherCode: number | null }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [currentPage, setCurrentPage] = useState(searchParams.get('page') ?? 'dashboard')

  const pageTitles: Record<string, string> = {
    dashboard: 'Dashboard',
    habits: 'Habits/To-Dos',
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
      <SidebarInset>
        <header className='sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 bg-background'>
          <div className='flex items-center gap-2 px-4'>
            <SidebarTrigger className='-ml-1' />
            <Separator orientation='vertical' className='mr-2 data-[orientation=vertical]:h-4' />
            <div className='hidden flex-col gap-0.5 sm:flex'>
              <span className='text-sm font-medium'>{pageTitle}</span>
            </div>
          </div>
        </header>
        <div className='flex w-full flex-col p-12 pt-0'>
          <div className='flex items-center justify-between gap-4 mb-6'>
            <div className='flex flex-col'>
              <h2>{getPageTitle(currentPage).title}</h2>
              {getPageTitle(currentPage).subtitle && (
                <p className='text-sm text-muted-foreground'>{getPageTitle(currentPage).subtitle}</p>
              )}
            </div>
            <div className='shrink-0'>{weatherCode != null && <WeatherIcon weatherCode={weatherCode} />}</div>
          </div>
          <div className='flex-1'>
            {currentPage === 'dashboard' && <Dashboard />}

            {currentPage === 'habits' && <HabitsPage />}

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
