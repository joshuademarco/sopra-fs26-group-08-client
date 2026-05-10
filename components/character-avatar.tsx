import Image from 'next/image'
import { Avatar, AvatarFallback } from './ui/avatar'

export function CharacterImage({
  characterType,
  alt,
  size,
  rotation = 'south',
}: {
  characterType?: string | null
  alt: string
  size: number
  rotation?: 'south' | 'east' | 'west' | 'north'
}) {
  if (!characterType) {
    return (
      <Avatar size='lg'>
        <AvatarFallback>{alt}</AvatarFallback>
      </Avatar>
    )
  }
  return (
    <Image
      src={`/characters/${characterType}/rotations/${rotation}.png`}
      alt={alt}
      width={size}
      height={size}
      style={{ imageRendering: 'pixelated' }}
    />
  )
}
