import { Card, CardContent } from '@/components/ui/card'
import { useEffect, useState } from 'react'
import { useAuth } from '../../../hooks/useAuth'
import { LeaderboardEntry } from '../../../types/leaderboard'
import { buildApiUrl } from '../../../utils/domain'

export default function LeaderboardPage() {
  const [fullLeaderboard, setFullLeaderboard] = useState<LeaderboardEntry[]>([])
  const [displayLeaderboard, setDisplayLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
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
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [currentUser?.username])

  return (
    <main className='flex flex-col gap-4 p-4'>
      <h2>Leaderboard</h2>

      {loading && <p className='text-muted-foreground'>Loading...</p>}
      {error && <p className='text-sm text-destructive'>{error}</p>}

      {!loading && !error && (
        <div className='space-y-2'>
          {displayLeaderboard.map((entry) => {
            const rank = fullLeaderboard.findIndex((e) => e.username === entry.username) + 1
            return (
              <Card key={entry.username}>
                <CardContent className='flex items-center justify-between'>
                  <div className='flex items-center gap-4'>
                    <span className='font-bold text-muted-foreground'>#{rank}</span>
                    <span className='font-medium'>{entry.username}</span>
                  </div>
                  <div className='flex items-center gap-4 text-sm text-muted-foreground'>
                    <span>Level {entry.level}</span>
                    <span>{entry.experience} XP</span>
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
