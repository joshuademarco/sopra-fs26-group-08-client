'use client'

import { RaidMemberData } from '@/types/raids'
import { useEffect, useRef } from 'react'

export function MemberHealthBar({ member, isCurrentUser }: { member: RaidMemberData; isCurrentUser: boolean }) {
  const hp = member.health ?? 0
  const maxHp = member.maxHealth ?? 100
  const percent = maxHp > 0 ? Math.max(0, Math.min(100, (hp / maxHp) * 100)) : 0
  const isDead = maxHp > 0 && hp <= 0
  const barRef = useRef<HTMLDivElement>(null)

  const barColor = isDead ? 'bg-muted-foreground/40' : percent <= 25 ? 'bg-red-500' : percent <= 50 ? 'bg-yellow-400' : 'bg-green-500'

  useEffect(() => {
    if (barRef.current) {
      barRef.current.style.width = `${percent}%`
    }
  }, [percent])

  return (
    <div className={`rounded-lg px-3 py-2 ${isDead ? 'opacity-60' : ''} ${isCurrentUser ? 'bg-primary/5' : 'bg-card'}`}>
      <div className='flex items-center justify-between mb-1'>
        <span className={`text-xs font-medium truncate ${isCurrentUser ? 'text-primary' : ''}`}>
          {member.username}
          {isCurrentUser && ' (you)'}
        </span>
        {isDead ? (
          <span className='ml-2 shrink-0 rounded px-1.5 py-0.5 text-xs font-bold bg-destructive/15 text-destructive'>KO</span>
        ) : (
          <span className='text-xs ml-2 shrink-0'>{hp}/{maxHp}</span>
        )}
      </div>
      <div className='h-2 w-full rounded-full bg-muted overflow-hidden'>
        <div ref={barRef} className={`h-full rounded-full transition-all duration-500 ${barColor}`} />
      </div>
    </div>
  )
}
