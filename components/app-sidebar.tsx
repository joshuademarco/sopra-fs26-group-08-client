'use client'

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
  useSidebar
} from '@/components/ui/sidebar'
import { Award, BadgeCheck, FileUser, Home, LogOut, PersonStanding, SendIcon, Settings, ShieldHalf, StickyNote, Sword, UserRoundPlus, VenetianMask } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from './ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { NavUser } from './nav-user'

const user = {
  name: 'billy',
  email: 'billy@billy.ch',
  avatar: <FileUser />
}

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navMain: [
    {
      title: 'Dashboard',
      url: '#',
      icon: <Home />,
    },
    {
      title: 'Habits/Todos',
      url: '#',
      icon: <StickyNote />
    },
    {
      title: 'Character',
      url: '#',
      icon: <PersonStanding />
    },
    {
      title: 'Groups',
      url: '#',
      icon: <ShieldHalf />
    },
    {
      title: 'Boss Raid',
      url: '#',
      icon: <Sword />
    },
    {
      title: 'Leaderboard',
      url: '#',
      icon: <Award />
    }
  ],
  navSecondary: [
    {
      title: 'Settings',
      url: '#',
      icon: <Settings />
    },
    {
      title: 'Feedback',
      url: '#',
      icon: <SendIcon />,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant='inset' {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size='lg' asChild>
              <a href='#'>
                <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
                  <PersonStanding className='h-4 w-4' />
                </div>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-medium'>BetterTogether</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className='mt-auto' />
        <NavUser user={data.user}  />
      </SidebarContent>
    </Sidebar>
  )
}
