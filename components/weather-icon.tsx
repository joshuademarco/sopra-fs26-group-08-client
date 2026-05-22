'use client'

import { Cloud, CloudLightning, CloudRain, CloudSnow, Sun } from 'lucide-react'

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

  if (weatherCode <= 2) {
    icon = <Sun size={size} />
    label = 'clear'
  } else if (weatherCode <= 48) {
    icon = <Cloud size={size} />
    label = 'cloudy'
  } else if (weatherCode <= 67) {
    icon = <CloudRain size={size} />
    label = 'rainy'
  } else if (weatherCode <= 77) {
    icon = <CloudSnow size={size} />
    label = 'snowy'
  } else {
    icon = <CloudLightning size={size} />
    label = 'stormy'
  }

  return (
    <div className='flex items-center gap-2 px-4 py-2'>
      {icon}
      <div>
        <p className='text-sm font-medium'>It&apos;s {label} right now.</p>
        <p className='text-xs text-foreground/70'>{getBoostedCategories(weatherCode)}</p>
      </div>
    </div>
  )
}
