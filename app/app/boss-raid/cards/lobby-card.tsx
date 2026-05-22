import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BossRaid, MemberStatus, RaidMember } from '@/types/raids'
import { BossStage } from '../boss-stage'

function readyStatusLabel(status: MemberStatus): { label: string; className: string } {
  switch (status) {
    case 'Ready':
      return { label: 'READY', className: 'text-emerald-600' }
    case 'Declined':
      return { label: 'DECLINED', className: 'text-destructive' }
    default:
      return { label: 'PENDING', className: 'text-muted-foreground' }
  }
}

function LobbyPartyCard({ members }: { members: RaidMember[] }) {
  const readyCount = members.filter((m) => m.status === 'Ready').length
  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-lg'>
          Raid party · {readyCount}/{members.length} ready
        </CardTitle>
      </CardHeader>
      <CardContent className='flex flex-col gap-2'>
        {members.map((m) => {
          const { label, className } = readyStatusLabel(m.status)
          return (
            <div key={m.name} className='flex items-center gap-3 rounded px-2 py-2'>
              <Avatar size='sm'>
                <AvatarFallback>{m.name[0]}</AvatarFallback>
              </Avatar>
              <div className='flex min-w-0 flex-1 flex-col'>
                <p className={`truncate text-sm ${m.isCurrentUser ? 'font-semibold text-primary' : 'font-medium'}`}>
                  {m.isCurrentUser ? 'You' : m.name}
                </p>
              </div>
              <span className={`whitespace-nowrap font-mono text-xs ${className}`}>{label}</span>
            </div>
          )
        })}
        <p className='mt-3 border-t pt-3 text-xs text-muted-foreground'>
          Need at least 2 confirmations to start. Battle begins automatically when timer hits zero.
        </p>
      </CardContent>
    </Card>
  )
}

function BossIntelCard({ raid, startsIn }: { raid: BossRaid; startsIn?: string }) {
  const minutes = raid.durationSeconds ? Math.floor(raid.durationSeconds / 60) : null
  const groupHpTotal = raid.members.reduce((sum, m) => sum + (m.maxHealth ?? 0), 0)
  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-lg'>Boss intel</CardTitle>
      </CardHeader>
      <CardContent className='flex flex-col gap-4'>
        <p className='text-sm text-muted-foreground'>{raid.monster.description}</p>
        <div className='grid grid-cols-2 gap-x-4 gap-y-3 border-t pt-3'>
          <div className='flex flex-col'>
            <span className='text-xs text-muted-foreground'>Tasks</span>
            <span className='text-base font-semibold'>{raid.tasksCount ?? 0}</span>
          </div>
          <div className='flex flex-col'>
            <span className='text-xs text-muted-foreground'>Group HP</span>
            <span className='text-base font-semibold'>{groupHpTotal}</span>
          </div>
          <div className='flex flex-col'>
            <span className='text-xs text-muted-foreground'>Time limit</span>
            <span className='text-base font-semibold'>{minutes != null ? `${minutes} min` : '—'}</span>
          </div>
          <div className='flex flex-col'>
            <span className='text-xs text-muted-foreground'>Players</span>
            <span className='text-base font-semibold'>{raid.members.length}</span>
          </div>
        </div>

        {startsIn && (
          <div
            className='w-fit gap-1.5 px-3 py-4 self-center text-amber-700 text-lg mt-4'
          >
            {startsIn === 'Finding best time...' ? startsIn : `Starts in ${startsIn}`}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function LobbyCard({ raid, lobbyActions }: { raid: BossRaid; lobbyActions?: React.ReactNode }) {
  const startsIn = raid.raidStartsIn
  return (
    <div className='flex flex-col gap-4'>
      <div className='grid gap-4 lg:grid-cols-[20rem_1fr]'>
        <div className='flex flex-col gap-4'>
          <BossIntelCard raid={raid} startsIn={startsIn} />
          <LobbyPartyCard members={raid.members} />
          {lobbyActions}
        </div>
        <Card className='flex flex-col'>
          <CardContent className='flex flex-1 flex-col gap-6 py-8'>
            <div className='flex flex-col items-center gap-3'>
              <BossStage monster={raid.monster} members={raid.members} />
            </div>
          </CardContent>
          {/* <div className='grid grid-cols-3 border-t'>
            <div className='flex flex-col gap-1 px-5 py-4'>
              <span className='text-xs uppercase tracking-wider text-muted-foreground'>Time limit</span>
              <span className='text-lg font-semibold '>
                {raid.durationSeconds
                  ? `${Math.floor(raid.durationSeconds / 60)}:${String(raid.durationSeconds % 60).padStart(2, '0')}`
                  : '—'}
              </span>
            </div>
            <div className='flex flex-col gap-1 border-l px-5 py-4'>
              <span className='text-xs uppercase tracking-wider text-muted-foreground'>Boss HP</span>
              <span className='text-lg font-semibold  text-destructive'>{(raid.monster.maxHp ?? 0).toLocaleString()}</span>
            </div>
            <div className='flex flex-col gap-1 border-l px-5 py-4'>
              <span className='text-xs uppercase tracking-wider text-muted-foreground'>Reward</span>
              <span className='text-lg font-semibold  text-amber-600'>+{(raid.estimatedReward ?? 0).toLocaleString()} XP</span>
            </div>
          </div> */}
        </Card>
      </div>
    </div>
  )
}
