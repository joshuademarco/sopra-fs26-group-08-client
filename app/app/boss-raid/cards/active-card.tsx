import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { BossRaid } from '@/types/raids'
import { BossRaidMap } from '../boss-raid-map'

function ActivePlayersList({ raid }: { raid: BossRaid }) {
  const bossDamage = (raid.monster.maxHp ?? 0) - (raid.monster.hp ?? 0)
  const hpPercent = raid.monster.maxHp ? (bossDamage / raid.monster.maxHp) * 100 : 0
  const activeMembers = raid.members.filter((m) => m.joined && !m.died)
  const onlineCount = activeMembers.filter((m) => m.status !== 'Offline').length
  return (
    <Card className='w-full self-start'>
      <CardHeader>
        <CardTitle className='text-lg'>Players · {onlineCount} online</CardTitle>
      </CardHeader>
      <CardContent className='flex flex-col gap-2'>
        {activeMembers.map((m) => (
          <div key={m.name} className={`flex items-center gap-3 rounded px-2 py-2 ${m.isCurrentUser ? 'bg-primary/10' : ''}`}>
            <Avatar size='sm'>
              <AvatarFallback>{m.name[0]}</AvatarFallback>
            </Avatar>
            <div className='flex min-w-0 flex-1 flex-col'>
              <p className={`truncate text-sm font-medium ${m.isCurrentUser ? 'font-semibold text-primary' : ''}`}>
                {m.isCurrentUser ? 'You' : m.name}
              </p>
              {m.taskDescription && <p className='truncate text-xs text-muted-foreground'>{m.taskDescription}</p>}
            </div>
            <span className='whitespace-nowrap font-mono text-xs text-amber-600'>{m.damageDealt ?? 0}</span>
          </div>
        ))}
      </CardContent>
      <div className='border-t px-4 py-3'>
        <div className='mb-1.5 flex items-center justify-between text-xs'>
          <span className='uppercase tracking-wider text-muted-foreground'>Group damage</span>
          <span className='font-mono text-muted-foreground'>
            {bossDamage} / {raid.monster.maxHp ?? 0}
          </span>
        </div>
        <Progress value={hpPercent} className='h-1.5' innerClassName='bg-emerald-500' />
      </div>
    </Card>
  )
}

export function ActiveCard({ raid, tasksSlot }: { raid: BossRaid; tasksSlot?: React.ReactNode }) {
  const secondsLeft = raid.timeLeftSeconds ?? raid.totalSeconds ?? 0
  const hours = Math.floor(secondsLeft / 3600)
  const minutes = Math.floor((secondsLeft % 3600) / 60)
  const seconds = secondsLeft % 60
  const countdown = hours > 0 ? `${hours}h ${minutes}m ${seconds}s` : minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`
  const lowTime = secondsLeft <= 60

  return (
    <div className='flex flex-col gap-4'>
      <div className='grid gap-4 lg:grid-cols-[20rem_1fr] min-[1921px]:grid-cols-[20rem_1fr_40rem]'>
        <div className='flex flex-col justify-between'>
        <ActivePlayersList raid={raid} />

        <div className='flex justify-center gap-2 row-start-2 items-center'>
          <span className='text-sm uppercase tracking-wider text-muted-foreground'>Time left</span>
          <span className={`font-mono text-2xl font-bold tabular-nums ${lowTime ? 'text-destructive' : 'text-foreground'}`}>
            {countdown}
          </span>
        </div>
        </div>

        <Card
          className='flex flex-col self-start [image-rendering:pixelated]'
          style={{
            backgroundImage: "url('/map/water.png')",
            backgroundRepeat: 'repeat',
            backgroundSize: '64px 64px',
          }}
        >
          <CardContent className='flex flex-1 flex-col gap-4'>
            <BossRaidMap raidId={raid.id} monster={raid.monster} members={raid.members} />
          </CardContent>
        </Card>

        <div className='lg:col-start-2 lg:row-start-2 min-[1921px]:col-start-3 min-[1921px]:row-start-1'>
          {tasksSlot ?? <div />}
        </div>
      </div>
    </div>
  )
}
