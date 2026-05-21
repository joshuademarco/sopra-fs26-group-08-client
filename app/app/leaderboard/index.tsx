'use client'

import { Card, CardContent } from '@/components/ui/card'
import { useApi } from '@/hooks/useApi'
import { Trophy } from 'lucide-react'
import { toast } from 'sonner'
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
        <>
          {displayLeaderboard.length > 0 && (
            <div className='flex items-end justify-center gap-2 md:gap-4 mb-8 mt-4 px-2'>
              {[
                { rank: 2, entry: displayLeaderboard[1] },
                { rank: 1, entry: displayLeaderboard[0] },
                { rank: 3, entry: displayLeaderboard[2] },
              ].map(({ rank, entry }) => {
                if (!entry) return <div key={rank} className='flex-1 max-w-[120px]' />
                
                const isCurrentUser = currentUser?.username === entry.username
                const heightClass = rank === 1 ? 'h-32 md:h-40' : rank === 2 ? 'h-24 md:h-32' : 'h-16 md:h-24'
                const bgClass = rank === 1 ? 'bg-yellow-500/20' : rank === 2 ? 'bg-slate-400/20' : 'bg-amber-700/20'
                const borderClass = rank === 1 ? 'border-yellow-500' : rank === 2 ? 'border-slate-400' : 'border-amber-700'
                const textClass = rank === 1 ? 'text-yellow-500' : rank === 2 ? 'text-slate-400' : 'text-amber-700'
                const trophyColor = rank === 1 ? 'text-yellow-500 fill-yellow-500' : rank === 2 ? 'text-slate-400 fill-slate-400' : 'text-amber-700 fill-amber-700'
                const trophySize = rank === 1 ? 'size-8 md:size-10' : 'size-6 md:size-8'

                return (
                  <div key={rank} className='flex flex-col items-center flex-1 max-w-[120px]'>
                    <div className='flex flex-col items-center mb-2 text-center'>
                      <Trophy className={`${trophySize} ${trophyColor} mb-1 md:mb-2`} />
                      <span className={`font-bold truncate w-20 md:w-28 text-sm md:text-base ${isCurrentUser ? 'text-emerald-600 dark:text-emerald-500' : ''}`}>
                        {entry.username}
                      </span>
                      <span className='text-xs md:text-sm text-muted-foreground'>Level {entry.level}</span>
                      <span className='text-xs md:text-sm font-semibold'>{entry.experience} XP</span>
                    </div>
                    <div className={`w-full rounded-t-md border-t-4 ${heightClass} ${bgClass} ${borderClass} flex items-start justify-center pt-2 md:pt-4`}>
                      <span className={`text-2xl md:text-4xl font-bold opacity-50 ${textClass}`}>
                        {rank}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
          <div className='space-y-2'>
            {displayLeaderboard.slice(3).map((entry, index, array) => {
              const rank = fullLeaderboard.findIndex((e) => e.username === entry.username) + 1
              const isCurrentUser = currentUser?.username === entry.username
              
              const previousEntry = index > 0 ? array[index - 1] : undefined
              const previousRank = previousEntry ? fullLeaderboard.findIndex((e) => e.username === previousEntry.username) + 1 : 3
              const showSeparator = rank > previousRank + 1

              return (
                <div key={entry.username} className='flex flex-col gap-2'>
                  {showSeparator && (
                    <div className='flex justify-center py-1 text-muted-foreground font-bold tracking-widest opacity-50'>
                      ...
                    </div>
                  )}
                  <Card className={isCurrentUser ? 'border-emerald-500/50 bg-emerald-500/10' : ''}>
                  <CardContent className='flex items-center justify-between'>
                    <div className='flex items-center gap-4'>
                      <div className='flex w-8 justify-center'>
                        <span className='font-bold text-muted-foreground'>#{rank}</span>
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
                </div>
              )
            })}
          </div>
        </>
      )}
    </main>
  )
}
