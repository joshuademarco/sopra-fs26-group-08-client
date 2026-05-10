'use client'

import { CharacterStats } from '@/components/stats'
import { Card, CardContent } from '@/components/ui/card'
import { useApi } from '@/hooks/useApi'
import { useAuth } from '@/hooks/useAuth'
import {
  CheckCircle,
  Dumbbell,
  HatGlasses,
  Heart,
  Lightbulb,
  LucideIcon,
  Shield,
  Shirt,
  Star,
  Sword,
  TrendingUp,
  Trophy,
  User,
} from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

const achievementConfig: Record<string, { icon: LucideIcon; color: string }> = {
  FIRST_HABIT: { icon: CheckCircle, color: 'text-emerald-500' },
  STREAK_3: { icon: TrendingUp, color: 'text-orange-400' },
  STREAK_7: { icon: Trophy, color: 'text-yellow-500' },
  STRENGTH_25: { icon: Dumbbell, color: 'text-rose-500' },
  INTELLIGENCE_25: { icon: Lightbulb, color: 'text-sky-400' },
  RESILIENCE_25: { icon: Shield, color: 'text-violet-500' },
}

type AchievementData = {
  id: number
  key: string
  name: string
  description: string
  icon: string
  earnedAt: string
}

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
  equippedHat: { id: number; assetKey: string } | null
  equippedChestPiece: { id: number; assetKey: string } | null
  equippedHandheld: { id: number; assetKey: string } | null
}

export default function CharacterPage() {
  const { user } = useAuth()
  const api = useApi()

  const [character, setCharacter] = useState<CharacterData | null>(null)
  const [achievements, setAchievements] = useState<AchievementData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const fetchAll = async () => {
      try {
        setIsLoading(true)
        const [characterData, achievementsData] = await Promise.all([
          api.get<CharacterData>(`/users/${user.id}/character`),
          api.get<AchievementData[]>(`/users/${user.id}/achievements`),
        ])
        setCharacter(characterData)
        setAchievements(achievementsData)
      } catch (e) {
        toast.error(e instanceof Error ? e.message : 'Failed to load character')
      } finally {
        setIsLoading(false)
      }
    }

    void fetchAll()
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

  if (!character) {
    return (
      <main className='flex flex-1 flex-col gap-4 p-4 pt-0'>
        <h1 className='text-3xl font-bold tracking-tight'>My Character</h1>
        <p className='text-sm text-destructive'>Character not found</p>
      </main>
    )
  }

  const xpThreshold = character.level * 100

  return (
    <main className='flex flex-1 flex-col gap-4 p-4 pt-0'>
      <h1 className='text-3xl font-bold tracking-tight'>My Character</h1>

      <Card>
        <CardContent className='flex flex-col gap-6 md:flex-row md:items-center'>
          <div className='flex aspect-square w-full items-center justify-center rounded-lg bg-muted/20 md:w-48'>
            {character.type ? (
              <Image
                src={`/characters/${character.type}/rotations/south.png`}
                alt={character.type}
                width={192}
                height={192}
                style={{ imageRendering: 'pixelated' }}
              />
            ) : (
              <User className='size-20' />
            )}
          </div>

          <div className='flex flex-1 flex-col gap-6'>
            <div className='flex items-baseline gap-2'>
              <h2 className='text-3xl font-bold tracking-tight'>{user.username}</h2>
              <span className='text-sm font-bold text-muted-foreground'>Level {character.level}</span>
            </div>

            <div className='flex items-center gap-4'>
              <Heart className='shrink-0' />
              <CharacterStats
                label='Health'
                value={character.health}
                maxValue={character.maxHealth}
                color='bg-emerald-600'
                height='h-4'
              />
            </div>

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
        </CardContent>
      </Card>

      <h3>Stats</h3>
      <div className='grid gap-4 md:grid-cols-3'>
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

      <h3>Inventory</h3>
      <div className='grid gap-4 md:grid-cols-3'>
        {[
          { item: character.equippedHat, Icon: HatGlasses },
          { item: character.equippedChestPiece, Icon: Shirt },
          { item: character.equippedHandheld, Icon: Sword },
        ].map(({ item, Icon }, i) => (
          <Card key={i}>
            <CardContent className='flex aspect-square items-center justify-center'>
              {item ? (
                <Image
                  src={`/items/${item.assetKey}.png`}
                  alt={item.assetKey}
                  width={192}
                  height={192}
                  style={{ imageRendering: 'pixelated' }}
                />
              ) : (
                <Icon className='size-20 text-muted-foreground/40' />
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <h3>Achievements</h3>
      {achievements.length === 0 ? (
        <p className='text-muted-foreground'>No achievements earned yet.</p>
      ) : (
        <div className='grid gap-4 md:grid-cols-3'>
          {achievements.map((a) => {
            const { icon: Icon, color } = achievementConfig[a.key] ?? { icon: Trophy, color: 'text-muted-foreground' }
            return (
              <Card key={a.id}>
                <CardContent className='flex flex-col items-center justify-center gap-2 p-6 text-center'>
                  <Icon className={`size-12 ${color}`} />
                  <p className='font-bold'>{a.name}</p>
                  <p className='text-sm text-muted-foreground'>{a.description}</p>
                  <p className='text-xs text-muted-foreground/60'>Earned {new Date(a.earnedAt).toLocaleDateString()}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </main>
  )
}
