import { LiveOnlineMap } from '@/components/live-online-map'

export default function Dashboard() {
  return (
    <div className='flex flex-1 flex-col gap-4'>
      <div className='relative -mx-12 -mb-12 flex-1 w-[calc(100%+6rem)]'>
        <LiveOnlineMap />
      </div>
    </div>
  )
}
