'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { WeatherQuest } from '@/types/task'
import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useApi } from '@/hooks/useApi'
import { Cloud, CloudLightning, CloudRain, CloudSnow, Sun } from 'lucide-react'

export function WeatherQuestCard() {
  const { user } = useAuth()
  const api = useApi()
  const [quest, setQuest] = useState<WeatherQuest | null>(null)

  useEffect(() => {
  console.log('user:', user)
  if (!user) return
  api.get<WeatherQuest>(`/users/${user.id}/weather-quest`)
    .then(setQuest)
    .catch(() => setQuest(null))
  }, [user])

  if (quest === null) return <Card className="max-w-6xl"><p className='text-muted-foreground'>No quest available</p> </Card>
  
  let icon
  let label

  if (quest.weatherCondition === "CLEAR") { icon = <Sun />; label = "clear" }
  else if (quest.weatherCondition === "CLOUDY") { icon = <Cloud />; label = "cloudy" }
  else if (quest.weatherCondition === "RAIN") { icon = <CloudRain />; label = "rainy" }
  else if (quest.weatherCondition === "SNOW") { icon = <CloudSnow />; label = "snowy" }
  else { icon = <CloudLightning />; label = "stormy" }

  return (
    <Card className="max-w-6xl">
      <CardHeader>
        <div className='flex items-center gap-2'>
          {icon}
          <CardTitle>{quest.weatherLabel} — Daily Quest</CardTitle>
        </div>
        <p>{quest.questTitle}</p>
      </CardHeader>
      <CardContent>
        <Progress value={(quest.completedCount / quest.targetCount) * 100} />
        <p>
          {quest.completedCount} / {quest.targetCount} habits completed
        </p>

        <Badge>
          +{quest.bonusMultiplier}x {quest.bonusStat} XP
        </Badge>
        {quest.completed && <p>Quest Complete!</p>}
      </CardContent>
    </Card>
  )
}
