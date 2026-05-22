import { Footer } from '@/components/footer'
import { Hero } from '@/components/hero'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { getServerAuthUser } from '@/lib/server-auth'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'

const facts = [
  { label: 'Founded', value: '18.09.2026' },
  { label: 'Founders', value: 'Four' },
  { label: 'Climate', value: 'Mostly clear' },
  { label: 'Threats', value: 'Ten known' },
]

const heroes = ['josh', 'leo', 'ale', 'michi', 'ana', 'annie', 'ben', 'jana', 'lea', 'louis', 'nora', 'sila'].map((id) => ({
  id,
  name: id.charAt(0).toUpperCase() + id.slice(1),
  img: `/characters/${id}/rotations/south.png`,
}))


const bosses: {
  name: string
  img: string
  lvl: number
  hp: number
  blurb: string
}[] = [
  {
    name: 'Bear Minimum',
    img: '/characters/bosses/bear/avatar.png',
    lvl: 12,
    hp: 407,
    blurb: 'Does just enough to count. Beats you to it.',
  },
  {
    name: 'Procasti Gnome',
    img: '/characters/bosses/gnome/avatar.png',
    lvl: 8,
    hp: 280,
    blurb: 'Builds a to-do list for the to-do list. Tiny, patient, and somehow already behind schedule.',
  },
  {
    name: 'Megalo-done Tomorrow',
    img: '/characters/bosses/paddlefish/avatar.png',
    lvl: 14,
    hp: 520,
    blurb: 'Massive. Always done, but never today.',
  },
  {
    name: 'Temptation Lizard',
    img: '/characters/bosses/lizard/avatar.png',
    lvl: 9,
    hp: 310,
    blurb: 'A bright little distraction in a very convincing jacket. Always knows where the snacks are hidden.',
  },
  {
    name: 'Chaos Minotaur',
    img: '/characters/bosses/minotaur/avatar.png',
    lvl: 17,
    hp: 720,
    blurb: 'A labyrinth in a blazer. Chaos Minotaur turns every straight path into a personal maze.',
  },
  {
    name: 'Couch Panda',
    img: '/characters/bosses/panda/avatar.png',
    lvl: 7,
    hp: 240,
    blurb: 'Adorable. Immovable. Loves a second episode.',
  },
  {
    name: 'Backlog Snake',
    img: '/characters/bosses/snake/avatar.png',
    lvl: 13,
    hp: 460,
    blurb: 'Keeps coiling around unfinished tasks and somehow looks proud of it.',
  },
  {
    name: 'Web Crawler',
    img: '/characters/bosses/spider/avatar.png',
    lvl: 11,
    hp: 380,
    blurb: 'Says "just one Wikipedia article." Spins eight more.',
  },
  {
    name: 'Time Thief',
    img: '/characters/bosses/thief/avatar.png',
    lvl: 15,
    hp: 540,
    blurb: 'Slips out of every meeting holding your afternoon.',
  },
  {
    name: 'Habit Troll',
    img: '/characters/bosses/troll/avatar.png',
    lvl: 20,
    hp: 900,
    blurb: 'Lives under the streak bridge and charges a toll in skipped routines.',
  },
]

const integrations = [
  {
    title: 'Google Calendar',
    detail: 'Two-way sync · 5 min',
  },
  {
    title: 'Pushover',
    detail: 'Token · Per device',
    body: 'A nudge on raid spawn and another at the final tick. Per-device, per-priority, never spammy.',
  },
]

export default async function Home() {
  const user = await getServerAuthUser()

  if (user) {
    redirect('/app')
  }

  return (
    <main className='flex w-full flex-col items-center'>
      <Hero />

      <section id='lore' className='w-full border-t border-border'>
        <div className='mx-auto grid w-full max-w-7xl gap-12 px-6 py-24 md:grid-cols-[20rem_1fr] md:gap-20 md:py-28'>
          <div className='md:sticky md:top-6 md:self-start'>
            <p className='text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase'>Chapter I</p>
            <h2 className='mt-4 leading-tight'>
              The Island
              <br />
              of Steadhaven.
            </h2>
            <p className='mt-5 max-w-60 text-sm text-muted-foreground'>
              A small archipelago west of the Backlog Sea. Four founders. One bell. Mostly clear weather.
            </p>
          </div>
          <div>
            <p className='text-lg leading-relaxed text-muted-foreground'>
              Steadhaven was once a strip of sand and a single bell. Then four travellers ran aground and decided to stay. They
              built a watchtower for the mornings, a hearth for the evenings, and a longhouse for everything in between, one
              routine at a time.
            </p>
            <p className='mt-5 text-base leading-relaxed text-muted-foreground'>
              Today the island runs on small, kept promises. Habits raise the walls. Todos clear the paths. And when the tide
              brings monsters from the dark water, the village answers together, every checked-off task another swing of the
              sword.
            </p>
            <div className='mt-10 overflow-hidden rounded-lg border border-border'>
              <Image
                src='/map.webp'
                alt='The archipelago of Steadhaven'
                width={1200}
                height={800}
                className='h-auto w-full [image-rendering:pixelated]'
              />
            </div>
            <div className='mt-10 grid grid-cols-2 border-y border-border sm:grid-cols-4'>
              {facts.map((f, i) => (
                <div key={f.label} className={i > 0 ? 'border-l border-border py-5 pl-6 sm:pl-7' : 'py-5'}>
                  <div className='text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase'>{f.label}</div>
                  <div className='mt-1.5 text-lg font-medium'>{f.value}</div>
                </div>
              ))}
            </div>
            <div className='mt-6 flex items-end justify-center gap-2 sm:gap-4'>
              <div className='sprite-warrior-idle' aria-label='Warrior' role='img' />
              <div className='sprite-pawn-idle' aria-label='Pawn' role='img' />
              <div className='sprite-archer-idle' aria-label='Archer' role='img' />
            </div>
          </div>
        </div>
      </section>

      <section id='characters' className='w-full border-t border-border'>
        <div className='mx-auto w-full max-w-7xl px-6 py-24 md:py-28'>
          <div className='grid gap-12 md:grid-cols-[20rem_1fr] md:gap-20'>
            <div className='md:sticky md:top-6 md:self-start'>
              <p className='text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase'>Chapter II</p>
              <h2 className='mt-4 leading-tight'>
                Choose your
                <br />
                Hero.
              </h2>
            </div>
            <div>
              <p className='max-w-3xl text-lg leading-relaxed text-muted-foreground'>
                A whole cast washed ashore. Pick whichever one you&apos;d rather wake up as, they all swing the same sword, but
                they wake up differently.
              </p>
              <div className='mt-14 grid grid-cols-2 gap-4 md:grid-cols-4'>
                {heroes.map((v) => (
                  <Card key={v.id} className='gap-0 p-4'>
                    <div className='grid h-32 items-end justify-items-center overflow-hidden rounded-md bg-muted'>
                      <Image
                        src={v.img}
                        alt={v.name}
                        width={120}
                        height={120}
                        className='h-28 w-auto [image-rendering:pixelated]'
                      />
                    </div>
                    <h4 className='mt-3 text-center'>{v.name}</h4>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id='raids' className='w-full border-t border-border'>
        <div className='mx-auto w-full max-w-7xl px-6 py-24 md:py-28'>
          <div className='grid gap-12 md:grid-cols-[20rem_1fr] md:gap-20'>
            <div className='md:sticky md:top-6 md:self-start'>
              <p className='text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase'>Chapter III</p>
              <h2 className='mt-4 leading-tight'>
                Boss Raids,
                <br />
                scheduled.
              </h2>
            </div>
            <div>
              <p className='max-w-3xl text-lg leading-relaxed text-muted-foreground'>
                The bosses are mean. They want every last drop of motivation the villagers have. But they&apos;re also unionised,
                polite, and respect your Google Calendar, so they only attack when you said you&apos;d be free.
              </p>

              <div className='mt-14 grid grid-cols-2 gap-4 md:grid-cols-4'>
                {bosses.map((b) => (
                  <Card key={b.name} className='gap-0 p-4'>
                    <div className='grid h-32 items-end justify-items-center overflow-hidden rounded-md bg-muted'>
                      <Image
                        src={b.img}
                        alt={b.name}
                        width={120}
                        height={120}
                        className='h-28 w-auto [image-rendering:pixelated]'
                      />
                    </div>
                    <div className='mt-3 flex items-center justify-between gap-2'>
                      <h4 className='text-center text-sm font-semibold leading-tight'>{b.name}</h4>
                    </div>
                    <p className='mt-2 text-sm leading-relaxed text-muted-foreground'>{b.blurb}</p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id='features' className='w-full border-t border-border'>
        <div className='mx-auto w-full max-w-7xl px-6 py-24 md:py-28'>
          <div className='grid gap-12 md:grid-cols-[20rem_1fr] md:gap-20'>
            <div className='md:sticky md:top-6 md:self-start'>
              <p className='text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase'>Features</p>
              <h2 className='mt-4 leading-tight'>
                Tools that
                <br />
                keep the island moving.
              </h2>
            </div>
            <div>
              <p className='max-w-3xl text-lg leading-relaxed text-muted-foreground'>
                The island keeps its schedule in sync with the tools people already use, so raids arrive with the right level
                of noise and the right amount of warning.
              </p>

              <div className='mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                {integrations.map((it) => (
                  <Card key={it.title} className='gap-2 p-5'>
                    <div className='flex items-center justify-between gap-3'>
                      <h4 className='text-sm font-semibold'>{it.title}</h4>
                      <span className='font-mono text-[10px] tracking-[0.12em] text-muted-foreground'>{it.detail}</span>
                    </div>
                    <p className='text-sm leading-relaxed text-muted-foreground'>{it.body}</p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='w-full border-t border-border'>
        <div className='mx-auto w-full max-w-2xl px-6 py-24 text-center md:py-28'>
          <h2 className='text-5xl'>The island is waiting.</h2>
          <div className='mt-8 flex flex-col items-center'>
            <div className='sheep-anim size-32' aria-label='Sheep' role='img' />
            <span className='mt-2 font-mono text-[11px] tracking-[0.14em] text-muted-foreground uppercase'>
              hover me
            </span>
          </div>
          <p className='mt-5 text-lg text-muted-foreground'>One habit today. A whole village by spring.</p>
          <div className='mt-9 flex flex-wrap justify-center gap-3'>
            <Button asChild className='h-11 px-6 text-sm'>
              <Link href='/register'>Begin your journey</Link>
            </Button>
            <Button asChild variant='secondary' className='h-11 px-6 text-sm'>
              <Link href='/login'>Return to the island</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
