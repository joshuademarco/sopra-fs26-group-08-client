'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { motion, useAnimate } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

export type RaidState = 'lobby' | 'active' | 'defeat' | 'victory'
export type MemberStatus = 'Ready' | 'Offline' | 'Pending'

export interface RaidMember {
  name: string
  status: MemberStatus
  isCurrentUser?: boolean
  characterType?: string | null
  level?: number
  taskDescription?: string
  taskDamage?: number
  tasksCompleted?: number
  totalTasks?: number
  xpChange?: number
  died?: boolean
  health?: number | null
  maxHealth?: number | null
}

export interface Monster {
  name: string
  level: number
  description: string
  hpPercent: number
  imageUrl: string
  hp?: number
  maxHp?: number
}

export interface BossRaid {
  id: number
  groupName: string
  playersOnline: number
  members: RaidMember[]
  raidStartsIn?: string
  timeLeftSeconds?: number
  totalSeconds?: number
  damageMultiplier?: number
  state: RaidState
  monster: Monster
  reward?: string
}

const STATUS_VARIANT: Record<MemberStatus, 'default' | 'secondary' | 'destructive'> = {
  Ready: 'default',
  Offline: 'destructive',
  Pending: 'secondary',
}

function CharacterImage({
  characterType,
  alt,
  size,
  rotation = 'south',
}: {
  characterType?: string | null
  alt: string
  size: number
  rotation?: 'south' | 'east' | 'west' | 'north'
}) {
  if (!characterType) {
    return (
      <Avatar size='lg'>
        <AvatarFallback>{alt[0]}</AvatarFallback>
      </Avatar>
    )
  }
  return (
    <Image
      src={`/characters/${characterType}/rotations/${rotation}.png`}
      alt={alt}
      width={size}
      height={size}
      style={{ imageRendering: 'pixelated' }}
    />
  )
}

function MemberSprite({ member, dim = false }: { member: RaidMember; dim?: boolean }) {
  const hp = member.health
  const maxHp = member.maxHealth
  const hasHp = hp != null && maxHp != null && maxHp > 0
  const percent = hasHp ? Math.max(0, Math.min(100, (hp / maxHp) * 100)) : 0
  const isDead = hasHp && hp <= 0
  const barColor = isDead
    ? 'bg-muted-foreground/40'
    : percent <= 25
      ? 'bg-red-500'
      : percent <= 50
        ? 'bg-yellow-400'
        : 'bg-green-500'

  return (
    <div className={`flex w-24 flex-col items-center gap-1 ${dim || isDead ? 'opacity-40 grayscale' : ''}`} title={member.name}>
      <CharacterImage characterType={member.characterType} alt={member.name} size={88} rotation='north' />
      <span className={`text-[10px] ${member.isCurrentUser ? 'font-semibold text-primary' : 'text-muted-foreground'}`}>
        {member.isCurrentUser ? 'You' : member.name}
      </span>
      {hasHp && (
        <>
          <Progress value={percent} className='h-1.5 w-full' innerClassName={barColor} />
          <span className='text-[9px] tabular-nums text-muted-foreground'>{isDead ? 'KO' : `${hp}/${maxHp}`}</span>
        </>
      )}
    </div>
  )
}

function BossStage({
  monster,
  members,
  dim = false,
  dimDeadMembers = false,
}: {
  monster: Monster
  members: RaidMember[]
  dim?: boolean
  dimDeadMembers?: boolean
}) {
  const [scope, animate] = useAnimate()
  const prevHpRef = useRef<number | undefined>(undefined)
  const [damage, setDamage] = useState<number | null>(null)
  const [hitKey, setHitKey] = useState(0)

  useEffect(() => {
    if (monster.hp === undefined) return
    const prevHp = prevHpRef.current
    prevHpRef.current = monster.hp
    if (prevHp === undefined || monster.hp >= prevHp) return

    setDamage(prevHp - monster.hp)
    setHitKey((k) => k + 1)
    animate(scope.current, { x: [-10, 10, -7, 7, -4, 4, 0] }, { duration: 0.45 })
    animate('.hit-overlay', { opacity: [0.75, 0] }, { duration: 0.4 })
  }, [animate, monster.hp, scope])

  return (
    <div className='flex w-full flex-col gap-3 px-4 pb-6'>
      <div className='flex items-center justify-between gap-2'>
        <span className='text-xs text-muted-foreground'>{/* {monster.description} */}</span>
        <Badge variant='destructive'>LVL {monster.level}</Badge>
      </div>

      <div ref={scope} className='relative mx-auto flex flex-col items-center gap-2'>
        <span className='text-3xl font-extrabold text-foreground'>{monster.name}</span>
        <div
          className={`relative flex size-56 items-center justify-center overflow-hidden rounded-lg bg-muted select-none ${dim ? 'opacity-50' : ''}`}
        >
          <Image src={monster.imageUrl} alt={monster.name} width={224} height={224} />
          <div className='hit-overlay pointer-events-none absolute inset-0 rounded-lg bg-red-500 opacity-0' />
        </div>
        <Progress value={monster.hpPercent} className='h-2 w-56' innerClassName='bg-emerald-500' />

        {damage !== null && (
          <motion.div
            key={hitKey}
            className='pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 select-none whitespace-nowrap text-2xl font-bold text-red-500'
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.75, ease: 'easeOut' }}
            onAnimationComplete={() => setDamage(null)}
          >
            -{damage}
          </motion.div>
        )}
      </div>

      <div className='flex justify-center gap-3 pt-2'>
        {members.map((member, i) => {
          const center = (members.length - 1) / 2
          const t = center === 0 ? 0 : ((i - center) / center) ** 2
          const dropPx = (1 - t) * 28
          return (
            <div key={member.name} style={{ transform: `translateY(${dropPx}px)` }}>
              <MemberSprite member={member} dim={dimDeadMembers && !!member.died} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

function MembersCard({
  title,
  description,
  members,
  renderMember,
}: {
  title: string
  description?: string
  members: RaidMember[]
  renderMember?: (member: RaidMember) => React.ReactNode
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className='flex flex-col gap-2'>
        {members.map((member) => (
          <div key={member.name} className='flex items-center gap-3 rounded-lg bg-muted/40 px-3 py-2'>
            <Avatar size='lg'>
              <AvatarFallback>{member.name[0]}</AvatarFallback>
            </Avatar>
            <div className='flex min-w-0 flex-1 flex-col'>
              <p className={`truncate text-sm font-medium ${member.isCurrentUser ? 'text-primary' : ''}`}>
                {member.isCurrentUser ? 'You' : member.name}
              </p>
              {renderMember?.(member)}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function Layout({ left, right }: { left: React.ReactNode; right: React.ReactNode }) {
  return (
    <div className='grid gap-4 md:grid-cols-[18rem_1fr]'>
      {left}
      {right}
    </div>
  )
}

function LobbyCard({ raid }: { raid: BossRaid }) {
  const readyCount = raid.members.filter((m) => m.status === 'Ready').length

  return (
    <Layout
      left={
        <MembersCard
          title='Players'
          description={`${readyCount}/${raid.members.length} ready`}
          members={raid.members}
          renderMember={(m) => (
            <Badge variant={STATUS_VARIANT[m.status]} className='self-start'>
              {m.status}
            </Badge>
          )}
        />
      }
      right={
        <Card>
          <CardHeader>
            <CardTitle>{raid.groupName}</CardTitle>
            <CardDescription>Raid starts in {raid.raidStartsIn}</CardDescription>
          </CardHeader>
          <CardContent>
            <BossStage monster={raid.monster} members={raid.members} />
          </CardContent>
        </Card>
      }
    />
  )
}

function ActiveCard({ raid }: { raid: BossRaid }) {
  const secondsLeft = raid.timeLeftSeconds ?? raid.totalSeconds ?? 0
  const hours = Math.floor(secondsLeft / 3600)
  const minutes = Math.floor((secondsLeft % 3600) / 60)
  const seconds = secondsLeft % 60
  const countdown = hours > 0 ? `${hours}h ${minutes}m ${seconds}s` : minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`

  return (
    <Layout
      left={
        <MembersCard
          title='Players'
          description={`${raid.playersOnline} online`}
          members={raid.members}
          renderMember={(m) =>
            m.taskDescription ? <p className='truncate text-xs text-muted-foreground'>{m.taskDescription}</p> : null
          }
        />
      }
      right={
        <Card className='max-w-6xl'>
          <CardHeader className='flex flex-row items-start justify-between gap-4'>
            <div className='space-y-1'>
              <CardTitle>{raid.groupName}</CardTitle>
              <CardDescription>Battle in progress</CardDescription>
            </div>
            <Badge variant='outline' className='whitespace-nowrap px-4 py-2 text-base font-semibold shadow-sm'>
              {countdown} left
            </Badge>
          </CardHeader>
          <CardContent className='flex min-h-112 flex-col gap-6'>
            <BossStage monster={raid.monster} members={raid.members} />
          </CardContent>
        </Card>
      }
    />
  )
}

function DefeatCard({ raid }: { raid: BossRaid }) {
  return (
    <Layout
      left={
        <MembersCard
          title='Players'
          description={`${raid.playersOnline} online`}
          members={raid.members}
          renderMember={(m) => (
            <div className='flex items-center gap-2'>
              {m.died && <Badge variant='destructive'>Died</Badge>}
              <p className='text-xs text-muted-foreground'>
                {m.tasksCompleted}/{m.totalTasks} tasks
              </p>
              <p className='ml-auto text-xs font-medium text-destructive'>{m.xpChange} XP</p>
            </div>
          )}
        />
      }
      right={
        <Card>
          <CardHeader>
            <CardTitle>
              Monster won — <span className='text-destructive'>you lost!</span>
            </CardTitle>
            <CardDescription className='text-2xl font-bold italic'>Bwahahaha</CardDescription>
          </CardHeader>
          <CardContent className='flex flex-col gap-4'>
            <BossStage monster={raid.monster} members={raid.members} dimDeadMembers />
            {raid.reward && (
              <div className='flex items-center justify-center gap-3 self-center rounded-lg bg-muted/50 px-6 py-3'>
                <span className='text-sm font-semibold'>You missed a:</span>
                <div className='flex size-10 items-center justify-center rounded bg-muted text-xl'>{raid.reward}</div>
              </div>
            )}
          </CardContent>
        </Card>
      }
    />
  )
}

function VictoryCard({ raid }: { raid: BossRaid }) {
  const defeatedMonster: Monster = {
    ...raid.monster,
    imageUrl: '/characters/bosses/innereschweinehund.png',
    name: 'Innere Schweinehund',
    hpPercent: 0,
  }

  return (
    <Layout
      left={
        <MembersCard
          title='Players'
          description={`${raid.playersOnline} online`}
          members={raid.members}
          renderMember={(m) => (
            <div className='flex items-center gap-2'>
              <p className='text-xs text-muted-foreground'>
                {m.tasksCompleted}/{m.totalTasks} tasks
              </p>
              <p className='ml-auto text-xs font-medium text-emerald-600'>+{m.xpChange} XP</p>
            </div>
          )}
        />
      }
      right={
        <Card>
          <CardHeader>
            <CardTitle>
              Monster lost — <span className='text-emerald-500'>you win!</span>
            </CardTitle>
            <CardDescription className='text-2xl font-bold italic'>Argh!</CardDescription>
          </CardHeader>
          <CardContent className='flex flex-col gap-4'>
            <BossStage monster={defeatedMonster} members={raid.members} dim />
            {raid.reward && (
              <div className='flex items-center justify-center gap-3 self-center rounded-lg bg-muted/50 px-6 py-3'>
                <span className='text-sm font-semibold'>You won a:</span>
                <div className='flex size-10 items-center justify-center rounded bg-muted text-xl'>{raid.reward}</div>
              </div>
            )}
          </CardContent>
        </Card>
      }
    />
  )
}

export function RaidCard({ raid }: { raid: BossRaid }) {
  switch (raid.state) {
    case 'lobby':
      return <LobbyCard raid={raid} />
    case 'active':
      return <ActiveCard raid={raid} />
    case 'defeat':
      return <DefeatCard raid={raid} />
    case 'victory':
      return <VictoryCard raid={raid} />
  }
}
