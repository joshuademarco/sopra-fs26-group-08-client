import { requireServerAuth } from '@/lib/server-auth'
import ClientApplicationPage from './page.client'
import { getWeather } from '@/actions/weather'

export default async function DashboardPage() {
  await requireServerAuth('/')
  const weatherCode = await getWeather()
  console.log(weatherCode)
  return <ClientApplicationPage weatherCode={weatherCode} />
}
