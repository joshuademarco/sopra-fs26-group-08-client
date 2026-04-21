'use server'

import { getApiDomain } from '@/utils/domain'
import { unstable_cache } from 'next/cache'

export const getWeather = unstable_cache(
  async (): Promise<number | null> => {
    try {
      const res = await fetch(`${getApiDomain()}/api/weather`)
      if (!res.ok) return null
      const weatherCode = await res.json()
      console.log(weatherCode)
      return weatherCode as number
    } catch {
      return null
    }
  },
  ['weather'],
  { revalidate: 3600 },
)



