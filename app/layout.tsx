import { cn } from '@/lib/utils'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

import { Providers } from '@/providers'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'BetterTogeter',
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
          <div className='flex min-h-screen flex-col'>
            <main className='grow'>{children}</main>
            <Toaster />
          </div>
        </Providers>
      </body>
    </html>
  )
}
