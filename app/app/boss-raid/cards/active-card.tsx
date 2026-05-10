import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { BossRaid } from '@/types/raids'
import { BossStage } from '../boss-stage'

function ActivePlayersList({ raid }: { raid: BossRaid }) {
  const bossDamage = (raid.monster.maxHp ?? 0) - (raid.monster.hp ?? 0)
  const hpPercent = raid.monster.maxHp ? (bossDamage / raid.monster.maxHp) * 100 : 0
  return (
    <Card className='self-start'>
      <CardHeader>
        <CardTitle className='text-lg'>Players · {raid.playersOnline} online</CardTitle>
      </CardHeader>
      <CardContent className='flex flex-col gap-2'>
        {raid.members.map((m) => (
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

export function ActiveCard({
  raid,
  tasksSlot,
}: {
  raid: BossRaid
  tasksSlot?: React.ReactNode
}) {
  const secondsLeft = raid.timeLeftSeconds ?? raid.totalSeconds ?? 0
  const hours = Math.floor(secondsLeft / 3600)
  const minutes = Math.floor((secondsLeft % 3600) / 60)
  const seconds = secondsLeft % 60
  const countdown = hours > 0 ? `${hours}h ${minutes}m ${seconds}s` : minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`
  const lowTime = secondsLeft <= 60
  const hpPct = Math.round(raid.monster.hpPercent ?? 0)

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-wrap items-end justify-between gap-3'>
        <div className='flex items-center gap-2'>
          {/* TODO: move this countdown to somewhere else */}
          <Badge
            variant='outline'
            className={`gap-1.5 px-3 py-4 font-semibold text-lg ${
              lowTime ? 'border-destructive/40 bg-destructive/10 text-destructive' : ''
            }`}
          >
            {countdown} left
          </Badge>
        </div>
      </div>

      <div className='grid gap-4 lg:grid-cols-[20rem_1fr_20rem]'>
        <ActivePlayersList raid={raid} />

        <Card className='flex flex-col'>
          <CardHeader>
            <div className='flex flex-wrap items-start justify-between gap-3'>
              <div className='space-y-1'>
                <CardDescription>{hpPct}% HP — keep the pressure on</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className='flex flex-1 flex-col gap-4'>
            <BossStage monster={raid.monster} members={raid.members} />
          </CardContent>
        </Card>

        {tasksSlot ?? <div />}
      </div>
    </div>
  )
}
