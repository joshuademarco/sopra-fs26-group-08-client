'use client'

import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning } from 'lucide-react'

type WeatherIconProps = {
  weatherCode: number | null
}

export function WeatherIcon({ weatherCode }: WeatherIconProps) {
  if (weatherCode === null) return null

  if (weatherCode <= 3) return <Sun />
  if (weatherCode <= 48) return <Cloud />
  if (weatherCode <= 67) return <CloudRain />
  if (weatherCode <= 77) return <CloudSnow />
  return <CloudLightning />
}