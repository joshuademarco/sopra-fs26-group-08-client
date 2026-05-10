import { AboutUsCard } from '@/components/aboutus-card'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const team = [
  { name: 'Ale',  characterType: 'ale' },
  { name: 'Josh', characterType: 'josh' },
  { name: 'Léo',  characterType: 'leo' },
  { name: 'Michi', characterType: 'michi' },
]

export default function AboutPage() {
  return (
    <main className='flex flex-col items-center w-full'>
      <section className='w-full max-w-3xl md:p-12 py-12'>
        <h2 className='text-4xl font-bold tracking-tight'>About Us</h2>
        <p className='mt-4 text-base text-muted-foreground md:text-lg'>
          We are BetterTogether, a team of students building a gamified habit tracker to help people grow together.
        </p>
        <div className='grid grid-cols-2 gap-4 sm:grid-cols-4'>
          {team.map((member) => (
            <AboutUsCard key={member.name} {...member} />
          ))}
        </div>
        <div className='mt-10 flex justify-center'>
          <Button asChild variant='secondary'>
            <Link href='/'>Back to Home</Link>
          </Button>
        </div>
      </section>
      <Footer />
    </main>
  )
}
