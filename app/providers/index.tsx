import { TooltipProvider } from '@/components/ui/tooltip'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

export const Providers: React.FC<{
  children: React.ReactNode
}> = async ({ children }) => {
  return (
  <NextThemesProvider attribute={'class'} defaultTheme={'dark'} disableTransitionOnChange>
    <TooltipProvider>{children}</TooltipProvider>
    </NextThemesProvider>
  )
}
