import { cn } from '@/lib/utils'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

import { Providers } from '@/providers'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'BetterTogether',
  description: 'A gamified platform to improve your habits and achieve your goals together with friends.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' className={cn('font-inter', inter.variable)} suppressHydrationWarning>
      <body className='bg-background min-h-screen antialiased'>
        <Providers>
          
          <SidebarProvider>
            
            <AppSidebar />
            
            <div className='flex min-h-screen flex-col w-full'>
              
              <header className='sticky top-0 z-10 flex h-14 shrink-0 items-center px-4'>

                <SidebarTrigger className='-ml-1' />

              </header> 
              
              <main className='grow p-4'>{children}</main>
            </div>
            
          </SidebarProvider>
          
        </Providers>
      </body>
    </html>
  )
}