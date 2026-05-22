'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useApi } from '@/hooks/useApi'
import { useAuth } from '@/hooks/useAuth'
import { useWebsocketContext } from '@/hooks/useWebsocketContext'
import { useEffect, useState } from 'react'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function cellColor(count: number) {
  if (count === 0) return 'bg-muted'
  if (count === 1) return 'bg-green-200'
  if (count === 2) return 'bg-green-400'
  if (count === 3) return 'bg-green-600'
  return 'bg-green-800'
}

export function HabitHeatmap() {
  const { user } = useAuth()
  const api = useApi()
  const { subscribeToCharacterUpdates } = useWebsocketContext()
  const [data, setData] = useState<Record<string, number>>({})
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    if (!user) return
    api
      .get<Record<string, number>>(`/users/${user.id}/habits/heatmap`)
      .then(setData)
      .catch(() => {})
  }, [user?.id, refreshKey])

  useEffect(() => {
    return subscribeToCharacterUpdates(() => setRefreshKey((k) => k + 1))
  }, [subscribeToCharacterUpdates])
  const today = new Date()
  const weeks: Date[][] = []
  for (let w = 51; w >= 0; w--) {
    const week: Date[] = []
    for (let d = 6; d >= 0; d--) {
      const day = new Date(today)
      day.setDate(today.getDate() - w * 7 - d)
      week.push(day)
    }
    weeks.push(week)
  }

  const monthLabels: (string | null)[] = weeks.map((week) => {
    const firstOfMonth = week.find((d) => d.getDate() === 1)
    return firstOfMonth ? MONTHS[firstOfMonth.getMonth()] : null
  })

  return (
    <Card className='w-fit max-w-full'>
      <CardHeader className='pb-2'>
        <CardTitle>Habit Activity</CardTitle>
        <p className='text-sm text-muted-foreground'>
          Each square represents a day. The darker the green, the more habits you completed that day.
        </p>
      </CardHeader>
      <CardContent>
        <div className='overflow-x-auto'>
          <div className='flex gap-0.75 mb-1'>
            {weeks.map((_, wi) => (
              <div key={wi} className='w-3.5 overflow-visible whitespace-nowrap text-[9px] text-muted-foreground'>
                {monthLabels[wi] ?? ''}
              </div>
            ))}
          </div>

          <div className='flex gap-0.75'>
            {weeks.map((week, wi) => (
              <div key={wi} className='flex flex-col gap-0.75'>
                {week.map((day) => {
                  const key = day.toISOString().slice(0, 10)
                  return (
                    <div
                      key={key}
                      title={`${key}: ${data[key] ?? 0} habits`}
                      className={`h-3.5 w-3.5 rounded ${cellColor(data[key] ?? 0)}`}
                    />
                  )
                })}
              </div>
            ))}
          </div>

          <div className='flex items-center justify-end gap-1.5 mt-3'>
            <span className='text-[11px] text-muted-foreground'>Less</span>
            {(['bg-muted', 'bg-green-200', 'bg-green-400', 'bg-green-600', 'bg-green-800'] as const).map((c) => (
              <div key={c} className={`h-3.5 w-3.5 rounded ${c}`} />
            ))}
            <span className='text-[11px] text-muted-foreground'>More</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
