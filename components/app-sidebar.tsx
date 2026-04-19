'use client'

import Link from 'next/link'
import * as React from 'react'

import { NavMain } from '@/components/nav-main'
import { NavSecondary } from '@/components/nav-secondary'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { useAuth } from '@/hooks/useAuth'
import { Award, Home, PersonStanding, Settings, ShieldHalf, StickyNote, Sword } from 'lucide-react'
import { NavUser } from './nav-user'

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navMain: [
    {
      title: 'Dashboard',
      key: 'dashboard',
      icon: <Home />,
    },
    {
      title: 'Habits/Todos',
      key: 'habits',
      icon: <StickyNote />,
    },
    {
      title: 'Character',
      key: 'character',
      icon: <PersonStanding />,
    },
    {
      title: 'Groups',
      key: 'groups',
      icon: <ShieldHalf />,
    },
    {
      title: 'Boss Raid',
      key: 'boss-raids',
      icon: <Sword />,
    },
    {
      title: 'Leaderboard',
      key: 'leaderboard',
      icon: <Award />,
    },
  ],
  navSecondary: [
    {
      title: 'Settings',
      key: 'settings',
      icon: <Settings />,
    },
  ],
}

export function AppSidebar({
  setCurrentPage,
  ...props
}: { setCurrentPage: React.Dispatch<React.SetStateAction<string>> } & React.ComponentProps<typeof Sidebar>) {
  const { user: authUser } = useAuth()
  const displayedUser = authUser
    ? {
        name: authUser.username,
        email: authUser.email,
        avatar: null,
      }
    : data.user

  return (
    <Sidebar variant='inset' {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size='lg' asChild>
              <Link href='/app'>
                <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
                  <PersonStanding className='h-4 w-4' />
                </div>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-medium'>BetterTogether</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain callback={setCurrentPage} items={data.navMain} />
        <NavSecondary callback={setCurrentPage} items={data.navSecondary} className='mt-auto' />
        <NavUser user={displayedUser} />
      </SidebarContent>
    </Sidebar>
  )
}
