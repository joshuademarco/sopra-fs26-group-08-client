'use client'

import React from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import Image from 'next/image'

export type RaidState = 'lobby' | 'active' | 'defeat' | 'victory'
export type MemberStatus = 'Ready' | 'Offline' | 'Pending'

export interface RaidMember {
  name: string
  status: MemberStatus
  isCurrentUser?: boolean
  level?: number
  taskDescription?: string
  taskDamage?: number
  tasksCompleted?: number
  totalTasks?: number
  xpChange?: number
  died?: boolean
}

export interface Monster {
  name: string
  level: number
  description: string
  hpPercent: number
  imageUrl: string
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
  Ready:   'bg-green-100 text-green-700 border border-green-300',
  Offline: 'bg-red-100   text-red-600   border border-red-300',
  Pending: 'bg-yellow-100 text-yellow-700 border border-yellow-300',
}

function MonsterPanel({ monster }: { monster: Monster }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg bg-muted/40 p-4 min-w-45">
      <div className="flex w-full items-center justify-between gap-2">
        <span className="font-semibold text-sm">{monster.name}</span>
        <span className="rounded bg-red-500 px-1.5 py-0.5 text-xs font-bold text-white">
          LVL {monster.level}
        </span>
      </div>
      <p className="w-full text-xs text-muted-foreground">{monster.description}</p>
      <div className="flex h-24 w-24 items-center justify-center rounded bg-muted text-4xl select-none">
        <Image src={monster.imageUrl} alt={monster.name} width={96} height={96}/>
      </div>
      <Progress value={monster.hpPercent} className="h-2 w-full" innerClassName="bg-green-500" />
    </div>
  )
}

function LobbyCard({ raid }: { raid: BossRaid }) {
  const readyCount = raid.members.filter(m => m.status === 'Ready').length

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-bold">{raid.groupName}</CardTitle>
        <CardDescription>{readyCount}/{raid.members.length} players ready!</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-[1fr_auto_auto] gap-4 items-start">
          <div className="flex flex-col gap-2">
            {raid.members.map(member => (
              <div key={member.name} className="flex items-center gap-3 rounded-lg bg-muted/50 px-3 py-2">
                <Avatar size="sm">
                  <AvatarFallback>{member.name[0]}</AvatarFallback>
                </Avatar>
                <span className="flex-1 text-sm font-medium">{member.isCurrentUser ? 'You' : member.name}</span>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[member.status]}`}>
                  {member.status}
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center justify-center gap-4 px-4 min-w-40">
            <p className="text-lg font-bold whitespace-nowrap">Raid starts in {raid.raidStartsIn}</p>
            <div className="flex gap-4">
              <button className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-white text-xl hover:bg-green-600 transition-colors">✓</button>
              <button className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-red-400 text-red-500 text-xl hover:bg-red-50 transition-colors">⊘</button>
            </div>
          </div>

          <MonsterPanel monster={raid.monster} />
        </div>
      </CardContent>
    </Card>
  )
}

function ActiveCard({ raid }: { raid: BossRaid }) {
  const pct = raid.timeLeftSeconds && raid.totalSeconds
    ? (raid.timeLeftSeconds / raid.totalSeconds) * 100
    : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-bold">{raid.groupName}</CardTitle>
        <CardDescription>{raid.playersOnline} players online</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid grid-cols-[1fr_auto] gap-4 items-start">
          <div className="flex flex-col gap-2">
            {raid.members.map(member => (
              <div key={member.name} className="flex items-center gap-3 rounded-lg bg-muted/50 px-3 py-2">
                <Avatar size="sm">
                  <AvatarFallback>{member.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{member.isCurrentUser ? 'You' : member.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{member.taskDescription}</p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">LVL {member.level}</span>
                {member.isCurrentUser && (
                  <div className="flex gap-2 ml-2">
                    <button className="flex h-7 w-7 items-center justify-center rounded-full bg-green-500 text-white text-sm hover:bg-green-600 transition-colors">✓</button>
                    <button className="flex h-7 w-7 items-center justify-center rounded-full border border-red-400 text-red-500 text-sm hover:bg-red-50 transition-colors">⊘</button>
                  </div>
                )}
              </div>
            ))}
            <div className="flex items-center gap-2 mt-1">
              <span className="rounded bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground whitespace-nowrap">
                {raid.timeLeftSeconds}s left!!
              </span>
              <Progress value={pct} className="h-2 flex-1" innerClassName="bg-orange-400" />
              <span className="text-xs text-muted-foreground whitespace-nowrap">{raid.totalSeconds} seconds</span>
            </div>
          </div>

          <MonsterPanel monster={raid.monster} />
        </div>

        {raid.damageMultiplier && (
          <div className="rounded-lg bg-blue-50 border border-blue-200 px-4 py-3">
            <p className="text-sm font-semibold text-blue-800">Damage Multiplier Active</p>
            <p className="text-xs text-blue-600">
              Your damage is increased by {raid.damageMultiplier}% based on your weekly habits completed!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function DefeatCard({ raid }: { raid: BossRaid }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-bold">
          Monster won — <span className="text-red-500">you lost!</span>
        </CardTitle>
        <CardDescription>{raid.playersOnline} players online</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid grid-cols-[1fr_auto] gap-4 items-start">
          <div className="flex flex-col gap-2">
            {raid.members.map(member => (
              <div key={member.name} className="flex items-center gap-3 rounded-lg bg-muted/50 px-3 py-2">
                <Avatar size="sm">
                  <AvatarFallback>{member.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{member.isCurrentUser ? 'You' : member.name}</p>
                    {member.died && (
                      <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">died!</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{member.tasksCompleted}/{member.totalTasks} tasks completed</p>
                </div>
                <span className="text-xs font-medium text-red-500 whitespace-nowrap">{member.xpChange} XP</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center gap-3 rounded-lg bg-muted/40 p-4 min-w-45">
            <div className="text-2xl font-bold text-muted-foreground italic">Bwahahaha</div>
            <div className="flex h-24 w-24 items-center justify-center rounded bg-muted text-4xl select-none">
              <Image src={raid.monster.imageUrl} alt={raid.monster.name} width={96} height={96}/>
            </div>
            <Progress value={raid.monster.hpPercent} className="h-2 w-full" innerClassName="bg-green-500" />
          </div>
        </div>

        {raid.reward && (
          <div className="flex items-center justify-center gap-3 rounded-lg bg-muted/50 px-6 py-3 self-center">
            <span className="text-sm font-semibold">You missed a:</span>
            <div className="flex h-10 w-10 items-center justify-center rounded bg-muted text-xl">
              {raid.reward}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function VictoryCard({ raid }: { raid: BossRaid }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-bold">
          Monster lost — <span className="text-green-500">you win!</span>
        </CardTitle>
        <CardDescription>{raid.playersOnline} players online</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid grid-cols-[1fr_auto] gap-4 items-start">
          <div className="flex flex-col gap-2">
            {raid.members.map(member => (
              <div key={member.name} className="flex items-center gap-3 rounded-lg bg-muted/50 px-3 py-2">
                <Avatar size="sm">
                  <AvatarFallback>{member.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{member.isCurrentUser ? 'You' : member.name}</p>
                  <p className="text-xs text-muted-foreground">{member.tasksCompleted}/{member.totalTasks} tasks completed</p>
                </div>
                <span className="text-xs font-medium text-green-600 whitespace-nowrap">+{member.xpChange} XP</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center gap-3 rounded-lg bg-muted/40 p-4 min-w-45">
            <div className="text-2xl font-bold text-muted-foreground italic">Argh!</div>
            <div className="flex h-24 w-24 items-center justify-center rounded bg-muted text-4xl select-none opacity-50">
              <Image src={raid.monster.imageUrl} alt={raid.monster.name} width={96} height={96}/>
            </div>
            <Progress value={raid.monster.hpPercent} className="h-2 w-full" innerClassName="bg-green-500" />
          </div>
        </div>

        {raid.reward && (
          <div className="flex items-center justify-center gap-3 rounded-lg bg-muted/50 px-6 py-3 self-center">
            <span className="text-sm font-semibold">You won a:</span>
            <div className="flex h-10 w-10 items-center justify-center rounded bg-muted text-xl">
              {raid.reward}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function RaidCard({ raid }: { raid: BossRaid }) {
  switch (raid.state) {
    case 'lobby':   return <LobbyCard raid={raid} />
    case 'active':  return <ActiveCard raid={raid} />
    case 'defeat':  return <DefeatCard raid={raid} />
    case 'victory': return <VictoryCard raid={raid} />
  }
}
