'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
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
import { getGravatarUrl } from '@/utils/gravatar'
import { Award, Home, LogOutIcon, PersonStanding, ShieldHalf, StickyNote, Sword, UserCog } from 'lucide-react'
import { useEffect, useState } from 'react'
import { CharacterWidget } from './character-widget'
import { NavUser } from './nav-user'

const data = {
  user: {
    name: 'user',
    email: 'test@icuzh.ch',
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
    {
      title: 'Account',
      key: 'account',
      icon: <UserCog />,
    },
  ],
  navSecondary: [],
}

export function AppSidebar({
  setCurrentPage,
  ...props
}: { setCurrentPage: (page: string) => void } & React.ComponentProps<typeof Sidebar>) {
  const router = useRouter()
  const { user: authUser, logout } = useAuth()
  const [gravatarUrl, setGravatarUrl] = useState<string | null>(null)

  useEffect(() => {
    if (authUser?.email) {
      getGravatarUrl(authUser.email).then(setGravatarUrl)
    }
  }, [authUser?.email])

  const displayedUser = authUser
    ? {
        name: authUser.username,
        email: authUser.email,
        avatar: gravatarUrl,
      }
    : data.user

  const handleLogout = async () => {
    try {
      await logout()
    } finally {
      router.replace('/login')
    }
  }

  const navSecondary = [
    ...data.navSecondary,
    {
      title: 'Log out',
      key: 'logout',
      icon: <LogOutIcon />,
      onClick: handleLogout,
      className: 'text-destructive hover:bg-destructive/10 hover:text-destructive focus-visible:bg-destructive/10 focus-visible:text-destructive',
    },
  ]

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
        <CharacterWidget />
      </SidebarHeader>
      <SidebarContent>
        <NavMain callback={setCurrentPage} items={data.navMain} />
        <NavSecondary callback={setCurrentPage} items={navSecondary} className='mt-auto' />
        <NavUser user={displayedUser} />
      </SidebarContent>
    </Sidebar>
  )
}