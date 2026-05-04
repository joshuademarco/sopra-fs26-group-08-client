import { getWeather } from '@/actions/weather'
import ClientApplicationPage from './page.client'

export default async function DashboardPage() {
  const weatherCode = await getWeather().catch(() => null)

  return <ClientApplicationPage weatherCode={weatherCode} />
}
