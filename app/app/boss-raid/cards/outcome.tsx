import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BossRaid, Monster, RaidMember } from '@/types/raids'
import { Crown } from 'lucide-react'
import { BossStage } from '../boss-stage'

function PlayerResults({ members, kind }: { members: RaidMember[]; kind: 'victory' | 'defeat' }) {
  return (
    <div className='flex flex-col gap-2'>
      {members.map((m) => {
        const xpHighlight = kind === 'victory' || (m.xpChange ?? 0) > 0
        return (
          <Card key={m.name} className={m.mvp ? 'border-amber-500/60 ring-1 ring-amber-500/40' : ''}>
            <CardContent className='flex flex-col gap-2.5 py-3'>
              <div className='flex items-center gap-2'>
                <Avatar size='sm'>
                  <AvatarFallback>{m.name[0]}</AvatarFallback>
                </Avatar>
                <div className='flex min-w-0 flex-1 flex-col'>
                  <p className={`truncate text-sm font-medium ${m.isCurrentUser ? 'font-semibold text-primary' : ''}`}>
                    {m.isCurrentUser ? 'You' : m.name}
                  </p>
                </div>
                <div className='flex items-center gap-1.5'>
                  {m.mvp && (
                    <Badge className='bg-amber-500 text-amber-50'>
                      <Crown className='size-3' /> MVP
                    </Badge>
                  )}
                  {m.died && <Badge variant='destructive'>KO</Badge>}
                </div>
              </div>
              <div className='flex items-center justify-between gap-2 border-t pt-2 text-xs'>
                <div className='flex items-center gap-3 text-muted-foreground'>
                  <span>
                    tasks{' '}
                    <span className='font-semibold text-foreground'>
                      {m.tasksCompleted}/{m.totalTasks}
                    </span>
                  </span>
                  <span className='text-border'>·</span>
                  <span>
                    dmg <span className='font-semibold text-foreground'>{m.damageDealt ?? 0}</span>
                  </span>
                </div>
                <span className={`font-semibold ${xpHighlight ? 'text-amber-600' : 'text-muted-foreground'}`}>
                  +{m.xpChange ?? 0} XP
                </span>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

function OutcomeSummary({
  cells,
}: {
  cells: { label: string; value: string; tone?: 'default' | 'success' | 'destructive' | 'gold' }[]
}) {
  const toneClass = {
    default: '',
    success: 'text-emerald-600',
    destructive: 'text-destructive',
    gold: 'text-amber-600',
  }
  return (
    <div className='grid grid-cols-2 gap-x-4 gap-y-4'>
      {cells.map((cell) => (
        <div key={cell.label} className='flex flex-col gap-1'>
          <span className='text-xs uppercase tracking-wider text-muted-foreground'>{cell.label}</span>
          <span className={`text-2xl font-semibold ${toneClass[cell.tone ?? 'default']}`}>{cell.value}</span>
        </div>
      ))}
    </div>
  )
}

export function OutcomeShell({
  raid,
  kind,
  outcomeVar,
  eyebrow,
  title,
  titleClass,
  subtitle,
  bossCaption,
  bossCaptionClass,
  summaryTitle,
  summaryCells,
  stageMonster,
}: {
  raid: BossRaid
  kind: 'victory' | 'defeat'
  outcomeVar: string
  eyebrow: string
  title: string
  titleClass: string
  subtitle: string
  bossCaption: string
  bossCaptionClass: string
  summaryTitle: string
  summaryCells: { label: string; value: string; tone?: 'default' | 'success' | 'destructive' | 'gold' }[]
  stageMonster: Monster
}) {
  return (
    <div className={`grid gap-4 lg:grid-cols-[20rem_1fr] ${outcomeVar}`}>
      <div className='flex flex-col gap-4'>
        <Card>
          <CardHeader>
            <CardTitle className='text-base'>{summaryTitle}</CardTitle>
            <CardDescription>{raid.groupName}</CardDescription>
          </CardHeader>
          <CardContent>
            <OutcomeSummary cells={summaryCells} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-base'>Player results</CardTitle>
          </CardHeader>
          <CardContent>
            <PlayerResults members={raid.members} kind={kind} />
          </CardContent>
        </Card>
      </div>

      <Card className='relative overflow-hidden'>
        <div aria-hidden className='outcome-glow pointer-events-none absolute inset-0' />
        <div
          aria-hidden
          className='outcome-rays pointer-events-none absolute left-1/2 top-1/2 size-350 -translate-x-1/2 -translate-y-1/2'
        />
        <CardContent className='relative flex flex-col items-center gap-4 py-12 text-center'>
          <span className={`text-xs font-semibold uppercase tracking-[0.3em] ${titleClass}`}>{eyebrow}</span>
          <h2 className={`text-6xl font-extrabold tracking-tight sm:text-7xl ${titleClass}`}>{title}</h2>
          <p className='max-w-xl text-sm text-muted-foreground'>{subtitle}</p>
          <div className='mt-2 flex flex-col items-center gap-2'>
            <BossStage
              monster={stageMonster}
              members={raid.members}
              dim={kind === 'victory'}
              dimDeadMembers={kind === 'defeat'}
              glare
            />
            <p className={`text-sm font-medium ${bossCaptionClass}`}>{bossCaption}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
