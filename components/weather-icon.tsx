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
    <div className='inline-flex items-center gap-3 rounded-full border border-border/60 bg-background/65 px-4 py-1.5 shadow-none backdrop-blur-sm'>
      <div className='flex size-9 shrink-0 items-center justify-center rounded-full text-foreground'>
        {icon}
      </div>
      <div className='min-w-0'>
        <p className='truncate text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground/60'>Weather</p>
        <p className='truncate text-sm font-medium'>It&apos;s {label} right now.</p>
        <p className='truncate text-xs text-foreground/70'>{getBoostedCategories(weatherCode)}</p>
      </div>
    </div>
  )
}
