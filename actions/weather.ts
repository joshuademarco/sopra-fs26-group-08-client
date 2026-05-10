'use server'

import { buildApiUrl } from '@/utils/domain'
import { unstable_cache } from 'next/cache'

export const getWeather = unstable_cache(
  async (): Promise<number | null> => {
    try {
      const res = await fetch(buildApiUrl('/weather'))
      if (!res.ok) return null
      const weatherCode = await res.json()
      return weatherCode as number
    } catch {
      return null
    }
  },
  ['weather'],
  { revalidate: 3600 },
)



