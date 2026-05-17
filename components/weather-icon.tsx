'use client'

import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning } from 'lucide-react'
import { Card, CardContent, CardTitle } from "@/components/ui/card"

type WeatherIconProps = {
  weatherCode: number | null
  size?: number
}

function getBoostedCategories(code: number): string {
  if (code <= 3) return 'Cognitive habits boosted'
  if (code <= 77) return 'Physical, Cognitive & Emotional habits boosted'
  return 'Physical habits boosted'
}

export function WeatherIcon({ weatherCode, size = 36 }: WeatherIconProps) {
  if (weatherCode === null) return null

  let icon
  let label

  if (weatherCode <= 2) { icon = <Sun size={size} />; label = "clear" }
  else if (weatherCode <= 48) { icon = <Cloud size={size} />; label = "cloudy" }
  else if (weatherCode <= 67) { icon = <CloudRain size={size} />; label = "rainy" }
  else if (weatherCode <= 77) { icon = <CloudSnow size={size} />; label = "snowy" }
  else { icon = <CloudLightning size={size} />; label = "stormy" }

  return (
    <Card className='w-fit h-fit'>
      <CardContent className='flex items-center gap-2 p-2 px-4'>
        {icon}
        <div>
          <CardTitle className='text-lg'>It&apos;s {label} right now.</CardTitle>
          <p className='text-xs text-muted-foreground'>{getBoostedCategories(weatherCode)}</p>
        </div>
      </CardContent>
    </Card>
  )
}
