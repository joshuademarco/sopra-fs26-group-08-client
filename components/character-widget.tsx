'use client'

import { Progress } from '@/components/ui/progress'
import { useApi } from '@/hooks/useApi'
import { useAuth } from '@/hooks/useAuth'
import { useWebsocketContext } from '@/hooks/useWebsocketContext'
import Image from 'next/image'
import { useEffect, useState } from 'react'

type CharacterSummary = {
  type: string | null
  level: number
  health: number
  maxHealth: number
  experience: number
}

export function CharacterWidget() {
  const { user, isAuthenticated } = useAuth()
  const api = useApi()
  const { subscribeToCharacterUpdates } = useWebsocketContext()
  const [character, setCharacter] = useState<CharacterSummary | null>(null)

  // Initial fetch
  useEffect(() => {
    if (!user) return

    let cancelled = false

    api
      .get<CharacterSummary>(`/users/${user.id}/character`)
      .then((data) => { if (!cancelled) setCharacter(data) })
      .catch(() => {})

    return () => { cancelled = true }
  }, [user])

  // Live updates via character WebSocket
  useEffect(() => {
    return subscribeToCharacterUpdates((msg) => {
      setCharacter((prev) => ({
        type: msg.characterType ?? prev?.type ?? null,
        level: msg.level,
        health: msg.health,
        maxHealth: msg.maxHealth,
        experience: msg.experience,
      }))
    })
  }, [subscribeToCharacterUpdates])

  if (!isAuthenticated || !character) return null

  const xpMax = character.level * 100
  const hpPct = Math.min(100, Math.round((character.health / character.maxHealth) * 100))
  const xpPct = Math.min(100, Math.round((character.experience / xpMax) * 100))

  return (
    <div className='flex flex-col items-center gap-3 px-3 py-4'>
      <div className='relative size-24 overflow-hidden rounded-xl bg-muted/20'>
        {character.type ? (
          <Image
            src={`/characters/${character.type}/rotations/south.png`}
            alt={character.type}
            fill
            sizes='96px'
            className='object-contain [image-rendering:pixelated]'
          />
        ) : (
          <div className='flex size-full items-center justify-center text-sm text-muted-foreground'>?</div>
        )}
      </div>

      <div className='flex items-baseline gap-1.5'>
        <span className='text-sm font-semibold'>{user?.username}</span>
        <span className='text-xs text-muted-foreground'>Lv {character.level}</span>
      </div>

      <div className='flex w-full flex-col gap-2'>
        <div className='flex items-center justify-between text-xs text-muted-foreground'>
          <span>HP</span>
          <span>{character.health} / {character.maxHealth}</span>
        </div>
        <Progress value={hpPct} className='h-2' innerClassName='bg-emerald-500' />

        <div className='flex items-center justify-between text-xs text-muted-foreground'>
          <span>XP</span>
          <span>{character.experience} / {xpMax}</span>
        </div>
        <Progress value={xpPct} className='h-2' innerClassName='bg-yellow-500' />
      </div>
    </div>
  )
}
