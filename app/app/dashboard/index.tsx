import { LiveOnlineMap } from '@/components/live-online-map'

export default function Dashboard() {
  return (
    <main className='flex flex-1 flex-col gap-4 p-4 pt-0'>
      <div>
        <h2>Dashboard</h2>
        <p className='text-sm text-muted-foreground'>See who is currently online</p>
      </div>
      <LiveOnlineMap />
    </main>
  )
}
