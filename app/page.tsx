import Link from 'next/link'

import { Footer } from '@/components/footer'
import { Hero } from '@/components/hero'
import { Button } from '@/components/ui/button'
import { getServerAuthUser } from '@/lib/server-auth'
import { redirect } from 'next/navigation'

export default async function Home() {
  const user = await getServerAuthUser()

  if (user) {
    redirect('/app')
  }

  return (
    <main className='flex flex-col items-center w-full'>
      <Hero />
      <section className='w-full max-w-3xl md:p-12 py-12'>
        <p className='mt-4 text-base text-muted-foreground md:text-lg'>
          Start your journey by creating an account or jump back in.
        </p>

        <div className='mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center'>
          <Button asChild className='h-14 min-w-44 px-8 text-xl'>
            <Link href='/register'>Sign Up</Link>
          </Button>
          <Button asChild variant='secondary' className='h-14 min-w-44 px-8 text-xl'>
            <Link href='/login'>Login</Link>
          </Button>
        </div>
      </section>
      <Footer />
    </main>
  )
}
