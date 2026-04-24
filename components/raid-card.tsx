'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { motion, useAnimate } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { Badge } from './ui/badge'

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
}

function CharacterAvatar({ member }: { member: RaidMember }) {
  if (member.characterType) {
    return (
      <div className='size-10 shrink-0 flex items-center justify-center rounded-full bg-muted overflow-hidden'>
        <Image
          src={`/characters/${member.characterType}/rotations/south.png`}
          alt={member.name}
          width={40}
          height={40}
          style={{ imageRendering: 'pixelated' }}
        />
      </div>
    )
  }
  return (
    <Avatar size={'default'}>
      <AvatarFallback>{member.name[0]}</AvatarFallback>
    </Avatar>
  )
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

const STATUS_STYLES: Record<MemberStatus, string> = {
  Ready: 'bg-green-100 text-green-700 border border-green-300',
  Offline: 'bg-red-100   text-red-600   border border-red-300',
  Pending: 'bg-yellow-100 text-yellow-700 border border-yellow-300',
}

function MonsterPanel({ monster }: { monster: Monster }) {
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
  }, [monster.hp])

  return (
    <div ref={scope} className='flex flex-col items-center gap-3 rounded-lg'>
      <div className='flex w-full items-center justify-between gap-2'>
        <span className='font-semibold text-sm'>{monster.name}</span>
        <Badge variant={'destructive'}>LVL {monster.level}</Badge>
      </div>
      <p className='w-full text-xs text-muted-foreground'>{monster.description}</p>

      <div className='relative'>
        <div className='relative flex h-36 w-36 items-center justify-center overflow-hidden rounded bg-muted text-4xl select-none'>
          <Image src={monster.imageUrl} alt={monster.name} width={144} height={144} />
          <div className='hit-overlay pointer-events-none absolute inset-0 rounded bg-red-500 opacity-0' />
        </div>

        {damage !== null && (
          <motion.div
            key={hitKey}
            className='pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 select-none whitespace-nowrap text-xl font-bold text-red-500'
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.75, ease: 'easeOut' }}
            onAnimationComplete={() => setDamage(null)}
          >
            -{damage}
          </motion.div>
        )}
      </div>

      <Progress value={monster.hpPercent} className='h-2 w-full' innerClassName='bg-green-500' />
    </div>
  )
}

function LobbyCard({ raid }: { raid: BossRaid }) {
  const readyCount = raid.members.filter((m) => m.status === 'Ready').length

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle className='text-base font-bold'>{raid.groupName}</CardTitle>
        <CardDescription>
          {readyCount}/{raid.members.length} players ready!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-[1fr_auto_auto] gap-4 items-start'>
          <div className='flex flex-col gap-2'>
            {raid.members.map((member) => (
              <div key={member.name} className='flex items-center gap-3 rounded-lg bg-muted/50 px-3 py-2'>
                <CharacterAvatar member={member} />
                <p className='flex-1 text-sm font-medium'>{member.isCurrentUser ? 'You' : member.name}</p>
                <Badge className={STATUS_STYLES[member.status]}>{member.status}</Badge>
              </div>
            ))}
          </div>

          <div className='flex flex-col items-center justify-center gap-4 px-4 min-w-60'>
            <p className='text-lg font-bold whitespace-nowrap'>Raid starts in {raid.raidStartsIn}</p>
          </div>

          <MonsterPanel monster={raid.monster} />
        </div>
      </CardContent>
    </Card>
  )
}

function ActiveCard({ raid }: { raid: BossRaid }) {
  const pct = raid.timeLeftSeconds && raid.totalSeconds ? (raid.timeLeftSeconds / raid.totalSeconds) * 100 : 0

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>{raid.groupName}</CardTitle>
        <CardDescription>{raid.playersOnline} players online</CardDescription>
      </CardHeader>
      <CardContent className='flex flex-col gap-4'>
        <div className='grid grid-cols-[1fr_auto] gap-4 items-start'>
          <div className='flex flex-col gap-2'>
            {raid.members.map((member) => (
              <div key={member.name} className='flex items-center gap-3 rounded-lg px-3 py-2'>
                <CharacterAvatar member={member} />
                <div className='flex-1 min-w-0'>
                  <p className='text-sm font-medium'>{member.isCurrentUser ? 'You' : member.name}</p>
                  <p className='text-xs text-muted-foreground truncate'>{member.taskDescription}</p>
                </div>
              </div>
            ))}
            <div className='flex items-center gap-2 mt-1'>
              <Progress value={pct} className='h-2 flex-1' innerClassName='bg-orange-400' />
              <Badge className='whitespace-nowrap' variant={'outline'}>
                {raid.timeLeftSeconds ?? raid.totalSeconds ?? 0} seconds left
              </Badge>
            </div>
          </div>

          <MonsterPanel monster={raid.monster} />
        </div>
      </CardContent>
    </Card>
  )
}

function DefeatCard({ raid }: { raid: BossRaid }) {
  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle className='text-base font-bold'>
          Monster won — <span className='text-destructive'>you lost!</span>
        </CardTitle>
        <CardDescription>{raid.playersOnline} players online</CardDescription>
      </CardHeader>
      <CardContent className='flex flex-col gap-4'>
        <div className='grid grid-cols-[1fr_auto] gap-4 items-start'>
          <div className='flex flex-col gap-2'>
            {raid.members.map((member) => (
              <div key={member.name} className='flex items-center gap-3 rounded-lg bg-muted/50 px-3 py-2'>
                <CharacterAvatar member={member} />
                <div className='flex-1 min-w-0'>
                  <div className='flex items-center gap-2'>
                    <p className='text-sm font-medium'>{member.isCurrentUser ? 'You' : member.name}</p>
                    {member.died && <span className='rounded-full bg-destructive px-2 py-0.5 text-xs font-bold'>died!</span>}
                  </div>
                  <p className='text-xs text-muted-foreground'>
                    {member.tasksCompleted}/{member.totalTasks} tasks completed
                  </p>
                </div>
                <span className='text-xs font-medium text-destructive whitespace-nowrap'>{member.xpChange} XP</span>
              </div>
            ))}
          </div>

          <div className='flex flex-col items-center gap-3 rounded-lg bg-muted/40 p-4 min-w-45'>
            <div className='text-2xl font-bold text-muted-foreground italic'>Bwahahaha</div>
            <div className='flex h-36 w-36 items-center justify-center rounded bg-muted text-4xl select-none'>
              <Image src={raid.monster.imageUrl} alt={raid.monster.name} width={144} height={144} />
            </div>
            <Progress value={raid.monster.hpPercent} className='h-2 w-full' innerClassName='bg-green-500' />
          </div>
        </div>

        {raid.reward && (
          <div className='flex items-center justify-center gap-3 rounded-lg bg-muted/50 px-6 py-3 self-center'>
            <span className='text-sm font-semibold'>You missed a:</span>
            <div className='flex h-10 w-10 items-center justify-center rounded bg-muted text-xl'>{raid.reward}</div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function VictoryCard({ raid }: { raid: BossRaid }) {
  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle className='text-base font-bold'>
          Monster lost — <span className='text-green-500'>you win!</span>
        </CardTitle>
        <CardDescription>{raid.playersOnline} players online</CardDescription>
      </CardHeader>
      <CardContent className='flex flex-col gap-4'>
        <div className='grid grid-cols-[1fr_auto] gap-4 items-start'>
          <div className='flex flex-col gap-2'>
            {raid.members.map((member) => (
              <div key={member.name} className='flex items-center gap-3 rounded-lg bg-muted/50 px-3 py-2'>
                <CharacterAvatar member={member} />
                <div className='flex-1 min-w-0'>
                  <p className='text-sm font-medium'>{member.isCurrentUser ? 'You' : member.name}</p>
                  <p className='text-xs text-muted-foreground'>
                    {member.tasksCompleted}/{member.totalTasks} tasks completed
                  </p>
                </div>
                <span className='text-xs font-medium text-green-600 whitespace-nowrap'>+{member.xpChange} XP</span>
              </div>
            ))}
          </div>

          <div className='flex flex-col items-center gap-3 rounded-lg bg-muted/40 p-4 min-w-45'>
            <div className='text-2xl font-bold text-muted-foreground italic'>Argh!</div>
            <div className='flex h-36 w-36 items-center justify-center rounded bg-muted text-4xl select-none opacity-50'>
              <Image src='/characters/bosses/innereschweinehund.png' alt={'Innere Scheinehund'} width={144} height={144} />
            </div>
            <Progress value={raid.monster.hpPercent} className='h-2 w-full' innerClassName='bg-green-500' />
          </div>
        </div>

        {raid.reward && (
          <div className='flex items-center justify-center gap-3 rounded-lg bg-muted/50 px-6 py-3 self-center'>
            <span className='text-sm font-semibold'>You won a:</span>
            <div className='flex h-10 w-10 items-center justify-center rounded bg-muted text-xl'>{raid.reward}</div>
          </div>
        )}
      </CardContent>
    </Card>
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
