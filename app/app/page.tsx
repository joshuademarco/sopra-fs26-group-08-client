import { requireServerAuth } from '@/lib/server-auth'
import ClientApplicationPage from './page.client'

export default async function DashboardPage() {
  await requireServerAuth('/')

  return <ClientApplicationPage />
}
