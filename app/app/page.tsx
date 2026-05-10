import { getWeather } from '@/actions/weather'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import ClientApplicationPage from './page.client'

function AppLoadingFallback() {
  return (
    <div className='flex flex-col gap-4 p-6'>
      <Skeleton className='h-8 w-48' />
      <Skeleton className='h-64 w-full' />
      <Skeleton className='h-32 w-full' />
    </div>
  )
}

export default async function DashboardPage() {
  const weatherCode = await getWeather().catch(() => null)

  return (
    <Suspense fallback={<AppLoadingFallback />}>
      <ClientApplicationPage weatherCode={weatherCode} />
    </Suspense>
  )
}
