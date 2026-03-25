import { cn } from '@/lib/utils'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

import { Providers } from '@/providers'

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
          <div className='flex min-h-screen flex-col'>
            <main className='grow'>{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  )
}
