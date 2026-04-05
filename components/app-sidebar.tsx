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
import { Award, Home, PersonStanding, SendIcon, Settings, ShieldHalf, StickyNote, Sword } from 'lucide-react'
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
      url: '/app',
      icon: <Home />,
    },
    {
      title: 'Habits/Todos',
      url: '#',
      icon: <StickyNote />,
    },
    {
      title: 'Character',
      url: '#',
      icon: <PersonStanding />,
    },
    {
      title: 'Groups',
      url: '#',
      icon: <ShieldHalf />,
    },
    {
      title: 'Boss Raid',
      url: '#',
      icon: <Sword />,
    },
    {
      title: 'Leaderboard',
      url: '#',
      icon: <Award />,
    },
  ],
  navSecondary: [
    {
      title: 'Settings',
      url: '#',
      icon: <Settings />,
    },
    {
      title: 'Feedback',
      url: '#',
      icon: <SendIcon />,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className='mt-auto' />
        <NavUser user={displayedUser} />
      </SidebarContent>
    </Sidebar>
  )
}
