'use client'

import { CharacterStats } from '@/components/stats'
import { useApi } from '@/hooks/useApi'
import { useAuth } from '@/hooks/useAuth'
import { Axe, Book, Flame, HatGlasses, Heart, Shirt, Star, Sword, User } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'

type CharacterData = {
  id: number
  level: number
  health: number
  maxHealth: number
  experience: number
  strength: number
  intelligence: number
  resilience: number
  skinColor: string | null
  type: string | null
}

export default function CharacterPage() {
  const { user } = useAuth()
  const api = useApi()

  const [character, setCharacter] = useState<CharacterData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return

    const fetchCharacter = async () => {
      try {
        setIsLoading(true)
        const data = await api.get<CharacterData>(`/users/${user.id}/character`)
        setCharacter(data)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load character')
      } finally {
        setIsLoading(false)
      }
    }

    void fetchCharacter()
  }, [user])

  if (!user) return null

  if (isLoading) {
    return (
      <main className='flex flex-1 flex-col gap-4 p-4 pt-0'>
        <h1 className='text-3xl font-bold tracking-tight'>My Character</h1>
        <p className='text-muted-foreground'>Loading character...</p>
      </main>
    )
  }

  if (error || !character) {
    return (
      <main className='flex flex-1 flex-col gap-4 p-4 pt-0'>
        <h1 className='text-3xl font-bold tracking-tight'>My Character</h1>
        <p className='text-sm text-destructive'>{error ?? 'Character not found'}</p>
      </main>
    )
  }

  const xpThreshold = character.level * 100

  return (
    <main className='flex flex-1 flex-col gap-4 p-4 pt-0'>
      <h1 className='text-3xl font-bold tracking-tight'>My Character</h1>

      <div className='w-full rounded-xl border border-border bg-card p-4 flex flex-col md:flex-row gap-6 md:items-center'>
        <div className='w-full md:w-48 aspect-square rounded-xl bg-muted/20 flex items-center justify-center shrink-0'>
          {character.type ? (
            <Image
              src={`/characters/${character.type}/rotations/south.png`}
              alt={character.type}
              width={192}
              height={192}
              style={{ imageRendering: 'pixelated' }}
            />
          ) : (
            <User className='w-20 h-20' />
          )}
        </div>

        <div className='flex flex-1 flex-col gap-6 w-full'>
          {/* name + level */}
          <div className='flex items-baseline gap-2'>
            <h2 className='text-3xl font-bold tracking-tight'>{user.username}</h2>
            <span className='text-md font-bold text-muted-foreground'>Level {character.level}</span>
          </div>

          {/* health bar */}
          <div className='flex items-center gap-4'>
            <Heart className='shrink-0' />
            <CharacterStats
              label='Health'
              value={character.health}
              maxValue={character.maxHealth}
              color='bg-green-600'
              height='h-4'
            />
          </div>

          {/* XP bar */}
          <div className='flex items-center gap-4'>
            <Star className='shrink-0' />
            <CharacterStats
              label='Experience'
              value={character.experience}
              maxValue={xpThreshold}
              color='bg-yellow-500'
              height='h-4'
            />
          </div>
        </div>
      </div>

      {/* --- stats --- */}
      <h1 className='text-3xl font-bold tracking-tight'>Stats</h1>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
        <CharacterStats
          label='Strength'
          value={character.strength}
          maxValue={Math.max(100, Math.ceil(character.strength / 10) * 10)}
          color='bg-rose-500'
          height='h-2'
        />
        <CharacterStats
          label='Intelligence'
          value={character.intelligence}
          maxValue={Math.max(100, Math.ceil(character.intelligence / 10) * 10)}
          color='bg-sky-500'
          height='h-2'
        />
        <CharacterStats
          label='Resilience'
          value={character.resilience}
          maxValue={Math.max(100, Math.ceil(character.resilience / 10) * 10)}
          color='bg-emerald-500'
          height='h-2'
        />
      </div>

      {/* --- inventory (static for now)--- */}
      <h1 className='text-3xl font-bold tracking-tight'>Inventory</h1>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
        <div className='min-h-37.5 rounded-xl border border-border bg-muted/20 p-4'>
          <div className='w-full aspect-square rounded-xl bg-muted/20 flex items-center justify-center'>
            <HatGlasses className='w-20 h-20 text-muted-foreground/40' />
          </div>
        </div>
        <div className='min-h-37.5 rounded-xl border border-border bg-muted/20 p-4'>
          <div className='w-full aspect-square rounded-xl bg-muted/20 flex items-center justify-center'>
            <Shirt className='w-20 h-20 text-muted-foreground/40' />
          </div>
        </div>
        <div className='min-h-37.5 rounded-xl border border-border bg-muted/20 p-4'>
          <div className='w-full aspect-square rounded-xl bg-muted/20 flex items-center justify-center'>
            <Sword className='w-20 h-20 text-muted-foreground/40' />
          </div>
        </div>
      </div>

      {/* --- achievements (static for now)--- */}
      <h1 className='text-3xl font-bold tracking-tight'>Achievements</h1>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
        <div className='min-h-37.5 rounded-xl border border-border bg-muted/20 p-4'>
          <div className='w-full aspect-square rounded-xl bg-muted/20 flex items-center justify-center'>
            <Axe className='w-20 h-20 text-muted-foreground/40' />
          </div>
        </div>
        <div className='min-h-37.5 rounded-xl border border-border bg-muted/20 p-4'>
          <div className='w-full aspect-square rounded-xl bg-muted/20 flex items-center justify-center'>
            <Flame className='w-20 h-20 text-muted-foreground/40' />
          </div>
        </div>
        <div className='min-h-37.5 rounded-xl border border-border bg-muted/20 p-4'>
          <div className='w-full aspect-square rounded-xl bg-muted/20 flex items-center justify-center'>
            <Book className='w-20 h-20 text-muted-foreground/40' />
          </div>
        </div>
      </div>
    </main>
  )
}
