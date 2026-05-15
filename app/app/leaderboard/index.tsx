'use client'

import { Card, CardContent } from '@/components/ui/card'
import { useApi } from '@/hooks/useApi'
import { toast } from 'sonner'
import { Trophy } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAuth } from '../../../hooks/useAuth'
import { LeaderboardEntry } from '../../../types/leaderboard'

export default function LeaderboardPage() {
  const [fullLeaderboard, setFullLeaderboard] = useState<LeaderboardEntry[]>([])
  const [displayLeaderboard, setDisplayLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const { user: currentUser } = useAuth()
  const api = useApi()

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await api.get<LeaderboardEntry[]>('/leaderboard')
        const sortedLeaderboard = [...data].sort((a, b) => {
          if (b.level !== a.level) return b.level - a.level
          if (b.experience !== a.experience) return b.experience - a.experience
          return a.username.localeCompare(b.username)
        })
        setFullLeaderboard(sortedLeaderboard)
        
        const top10 = sortedLeaderboard.slice(0, 10)
        const userIndex = currentUser ? sortedLeaderboard.findIndex((e) => e.username === currentUser.username) : -1
        if (userIndex >= 10) {
          top10.push(sortedLeaderboard[userIndex])
        }
        setDisplayLeaderboard(top10)
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [currentUser?.username])

  return (
    <main className='flex flex-col gap-4'>
      {loading && <p className='text-muted-foreground'>Loading...</p>}

      {!loading && (
        <div className='space-y-2'>
          {displayLeaderboard.map((entry, index) => {
            const rank = fullLeaderboard.findIndex((e) => e.username === entry.username) + 1
            const isCurrentUser = currentUser?.username === entry.username
            
            return (
              <Card key={entry.username} className={isCurrentUser ? 'border-emerald-500/50 bg-emerald-500/10' : ''}>
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
                    <span className={`font-medium ${isCurrentUser ? 'text-emerald-700 dark:text-emerald-500' : ''}`}>
                      {entry.username} {isCurrentUser && '(You)'}
                    </span>
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
