'use client'

import Image from 'next/image'
import Link from 'next/link'

export function NotificationOnboarding() {
  return (
    <div className='flex flex-col gap-4 overflow-y-auto text-base'>
      <div className='flex items-center gap-3'>
        <Image src='/onboarding/pushover-logo.png' alt='Pushover' width={48} height={48} className='rounded-lg' />
        <div>
          <p className='font-semibold'>Pushover</p>
          <a href='https://pushover.net' target='_blank' rel='noopener noreferrer' className='text-sm text-primary underline underline-offset-2'>
            pushover.net
          </a>
        </div>
      </div>

      <ol className='grid list-none gap-3 pl-0'>
        <li className='flex gap-2'>
          <span className='flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/25 font-semibold text-primary'>1</span>
          <span> Create a free account at <Link href='https://pushover.net' target='_blank' className='text-primary underline underline-offset-2'>pushover.net</Link> and install the Pushover app on your phone or desktop.</span>
        </li>
        <li className='flex gap-2'>
          <span className='flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/25 font-semibold text-primary'>2</span>
          <span> In your Pushover dashboard, register a new Application. Copy the API Token it generates, this is your App Token.</span>
        </li>
        <li className='flex gap-2'>
          <span className='flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/25 font-semibold text-primary'>3</span>
          <span> From your Pushover account overview, copy your personal User Key.</span>
        </li>
        <li className='flex gap-2'>
          <span className='flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/25 font-semibold text-primary'>4</span>
          <span> Enter both keys below and select Pushover as your notification style.</span>
        </li>
      </ol>

      <p className='text-sm text-muted-foreground'>Click Next to configure your notification type.</p>
    </div>
  )
}
