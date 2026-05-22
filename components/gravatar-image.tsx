'use client'

import { AvatarImage } from '@/components/ui/avatar'
import { getGravatarUrl } from '@/utils/gravatar'
import { useEffect, useState } from 'react'

interface GravatarImageProps {
  identifier: string
  size?: number
  alt?: string
}

export function GravatarImage({ identifier, size = 80, alt }: GravatarImageProps) {
  const [src, setSrc] = useState<string | null>(null)

  useEffect(() => {
    getGravatarUrl(identifier, size).then(setSrc)
  }, [identifier, size])

  if (!src) return null
  return <AvatarImage src={src} alt={alt ?? identifier} />
}
