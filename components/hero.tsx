import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'

const heroParty = ['josh', 'leo', 'ale', 'michi']

interface HeroProps {
  className?: string
}

const Hero = ({ className }: HeroProps) => {
  return (
    <section className={cn('w-full', className)}>
      <div className='mx-auto grid w-full max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:py-24'>
        <div>
          <h1 className='text-5xl leading-[0.98] md:text-7xl lg:text-[5.5rem]'>
            Tiny habits
            <br />
            Small steps but
            <br />
            <span className='text-primary'>BetterTogeter.</span>
          </h1>
          <p className='mt-8 max-w-prose text-lg text-muted-foreground'>
            BetterTogeter is a habit tracker disguised as a village. Show up, check in, and fight back the
            monsters living rent-free in your week.
          </p>
          <div className='mt-8 flex flex-wrap gap-3'>
            <Button asChild className='h-11 px-6 text-sm'>
              <Link href='/register'>Begin your journey</Link>
            </Button>
            <Button asChild variant='secondary' className='h-11 px-6 text-sm'>
              <Link href='/login'>Return to the island</Link>
            </Button>
          </div>
        </div>

        <div className='relative flex min-h-96 items-end justify-center lg:min-h-[32rem]'>
          <svg
            viewBox='0 0 200 200'
            aria-hidden
            className='absolute top-6 right-0 size-72 text-foreground opacity-[0.05] lg:size-96'
          >
            <circle cx='100' cy='100' r='92' fill='none' stroke='currentColor' strokeWidth='1' />
            <circle cx='100' cy='100' r='60' fill='none' stroke='currentColor' strokeWidth='1' />
            <path d='M100 12 L106 100 L100 188 L94 100 Z' fill='currentColor' />
            <path d='M12 100 L100 106 L188 100 L100 94 Z' fill='currentColor' />
          </svg>
          <div className='relative flex w-full flex-col items-center pb-12'>
            <div className='flex w-full items-end justify-center -space-x-14 sm:-space-x-16 md:-space-x-18 lg:-space-x-20'>
              {heroParty.map((id) => (
                <Image
                  key={id}
                  src={`/characters/${id}/rotations/south.png`}
                  alt={id}
                  width={120}
                  height={120}
                  className='size-32 object-contain object-bottom [image-rendering:pixelated] sm:size-40 md:size-48 lg:size-56'
                />
              ))}
            </div>
            <div className='mt-4 w-[88%] border-t border-border' />
          </div>
        </div>
      </div>
    </section>
  )
}

export { Hero }
