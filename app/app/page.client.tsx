'use client'

import { AppSidebar } from '@/components/app-sidebar'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { useState } from 'react'
import Dashboard from './dashboard'

export default function ClientApplicationPage({ weatherCode }: { weatherCode: number | null }) {
  const [currentPage, setCurrentPage] = useState('dashboard')

  return (
    <SidebarProvider>
      <AppSidebar setCurrentPage={setCurrentPage} />
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
          {currentPage === 'dashboard' && (
            <Dashboard weatherCode={weatherCode} />
          )}

          {currentPage === 'character' && <div>Character Page</div>}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
