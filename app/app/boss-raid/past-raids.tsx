import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RaidData } from '@/types/raids'
import { Trophy } from 'lucide-react'

export function PastRaidsList({ raids, onSelect }: { raids: RaidData[]; onSelect?: (raid: RaidData) => void }) {
  const past = raids
    .filter((r) => r.status === 'DEFEATED' || r.status === 'FAILED')
    .slice()
    .sort((a, b) => {
      const aTime = a.startedAt ? new Date(a.startedAt).getTime() : 0
      const bTime = b.startedAt ? new Date(b.startedAt).getTime() : 0
      return bTime - aTime
    })

  if (past.length === 0) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-lg'>Past raids</CardTitle>
        <CardDescription>
          {past.length} previous {past.length === 1 ? 'raid' : 'raids'}
        </CardDescription>
      </CardHeader>
      <CardContent className='flex flex-col gap-2'>
        {past.map((raid) => {
          const won = raid.status === 'DEFEATED'
          const xp = raid.users.reduce((sum, u) => sum + (u.xpEarned ?? 0), 0)
          return (
            <Button
              type='button'
              key={raid.id}
              onClick={() => onSelect?.(raid)}
              className='flex items-center gap-4 h-16 text-left'
              variant={won ? 'success' : 'destructive'}
            >
              <div className='flex size-10 items-center justify-center rounded-md bg-background text-lg'>
                {won ? <Trophy className='text-emerald-400' /> : '☠'}
              </div>
              <div className='flex min-w-0 flex-1 flex-col'>
                <span className='truncate text-sm font-medium'>{raid.name}</span>
                <span className='truncate text-xs text-muted-foreground'>
                  {raid.groupName} · {raid.users.length} players
                </span>
              </div>
              <div className='hidden items-center gap-4 text-xs text-muted-foreground sm:flex'>
                <span className='text-amber-600'>+{xp} XP</span>
              </div>
            </Button>
          )
        })}
      </CardContent>
    </Card>
  )
}
