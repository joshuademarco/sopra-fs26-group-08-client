'use client'

import { Card, CardContent } from '@/components/ui/card'
import { toast } from 'sonner'
import { Trophy } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAuth } from '../../../hooks/useAuth'
import { LeaderboardEntry } from '../../../types/leaderboard'
import { buildApiUrl } from '../../../utils/domain'

export default function LeaderboardPage() {
  const [fullLeaderboard, setFullLeaderboard] = useState<LeaderboardEntry[]>([])
  const [displayLeaderboard, setDisplayLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const { user: currentUser } = useAuth()

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(buildApiUrl('/leaderboard'), {
          method: 'GET',
          credentials: 'include',
        })
        if (!response.ok) {
          throw new Error('Failed to fetch leaderboard')
        }
        const data: LeaderboardEntry[] = await response.json()
        const sortedLeaderboard = [...data].sort((a, b) => {
          if (b.level !== a.level) return b.level - a.level
          if (b.experience !== a.experience) return b.experience - a.experience
          return a.username.localeCompare(b.username)
        })
        setFullLeaderboard(sortedLeaderboard)
        setDisplayLeaderboard(sortedLeaderboard.slice(0, 10))
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [currentUser?.username])

  return (
    <main className='flex flex-col gap-4 p-4'>
      <h1 className='text-3xl font-bold tracking-tight'>Groups</h1>

      {loading && <p className='text-muted-foreground'>Loading...</p>}

      {!loading && (
        <div className='space-y-2'>
          {displayLeaderboard.map((entry) => {
            const rank = fullLeaderboard.findIndex((e) => e.username === entry.username) + 1
            return (
              <Card key={entry.username}>
                <CardContent className='flex items-center justify-between'>
                  <div className='flex items-center gap-4'>
                    <div className='flex w-8 justify-center'>
                      {rank === 1 ? (
                        <Trophy className='size-5 text-yellow-500 fill-yellow-500' />
                      ) : rank === 2 ? (
                        <Trophy className='size-5 text-slate-400 fill-slate-400' />
                      ) : rank === 3 ? (
                        <Trophy className='size-5 text-amber-700 fill-amber-700' />
                      ) : (
                        <span className='font-bold text-muted-foreground'>#{rank}</span>
                      )}
                    </div>
                    <span className='font-medium'>{entry.username}</span>
                  </div>
                  <div className='grid grid-cols-2 gap-4 text-sm text-muted-foreground w-48'>
                    <span className='text-left'>Level {entry.level}</span>
                    <span className='text-right'>{entry.experience} XP</span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </main>
  )
}
