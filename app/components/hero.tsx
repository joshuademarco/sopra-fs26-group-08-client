import { cn } from '@/lib/utils'
import Image from 'next/image'

interface HeroProps {
  className?: string
}

const Hero = ({ className }: HeroProps) => {
  return (
    <section className={cn('relative  py-32', className)}>
      <div className='absolute inset-0 -z-10 bg-linear-to-br from-background to-background/80' />
      <div className='absolute top-1/2 right-0 h-96 w-96 translate-x-1/3 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl' />

      <div className='relative container'>
        <div className='mx-auto flex max-w-6xl flex-col items-start justify-between gap-10 md:gap-20 lg:flex-row lg:items-end'>
          <h1 className='relative text-6xl font-bold tracking-tighter md:text-[8vw] lg:w-3/5 2xl:text-9xl'>
            <span className='relative inline-block transition-transform duration-300 hover:translate-x-1'>Better</span>
            <br />
            <span className='relative inline-block transition-transform duration-300 hover:translate-x-1'>Together</span>
          </h1>
          <div className='lg:max-w-auto max-w-lg space-y-5 lg:w-2/5'>
            <Image
              src={'/GroupOfPeople.png'}
              alt='Group of People'
              width={500}
              height={300}
              className='rounded-lg object-cover'
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export { Hero }
