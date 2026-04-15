'use server'

import { getApiDomain } from '@/utils/domain'
import { unstable_cache } from 'next/cache'

export const getWeather = unstable_cache(
  async () => {
    const res = await fetch(`${getApiDomain()}/api/weather`)

    if (!res.ok) throw new Error('Failed to fetch weather')

    const weatherCode = await res.json()
    console.log(weatherCode)
    return parseInt(weatherCode.weatherCode)
  },
  ['weather'],
  { revalidate: 3600 },
)



