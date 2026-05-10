import Image from 'next/image'

interface AboutUsCardProps {
  name: string
  characterType: string
}

export function AboutUsCard({ name, characterType }: AboutUsCardProps) {
  return (
    <div className='flex flex-col items-center gap-3 rounded-xl border p-6'>
      <div className='relative size-28 overflow-hidden rounded-lg'>
        <Image
          src={`/characters/${characterType}/rotations/south.png`}
          alt={characterType}
          width={112}
          height={112}
          style={{ imageRendering: 'pixelated' }}
        />
      </div>
      <span className='text-sm font-semibold'>{name}</span>
    </div>
  )
}
