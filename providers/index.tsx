"use client"

import { TooltipProvider } from '@/components/ui/tooltip'
import { AuthProvider } from '@/providers/auth-provider'
import { WebSocketProvider } from '@/providers/websocket-provider'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

export const Providers: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
  <NextThemesProvider attribute={'class'} defaultTheme={'dark'} disableTransitionOnChange>
    <AuthProvider>
      <WebSocketProvider>
        <TooltipProvider>{children}</TooltipProvider>
      </WebSocketProvider>
    </AuthProvider>
    </NextThemesProvider>
  )
}
