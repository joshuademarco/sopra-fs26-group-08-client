import { cn } from '@/lib/utils'
import Link from 'next/link'

const sitemap = [
  {
    title: 'Company',
    links: [
      { title: 'About Us', href: '/about' },
      { title: 'User Guide', href: '/guide' },
    ],
  },
]

interface FooterProps {
  className?: string
}

const Footer = ({ className }: FooterProps) => {
  return (
    <section className={cn('w-full border-t border-border', className)}>
      <div className='mx-auto w-full max-w-7xl px-6 pt-14 pb-6'>
        <footer>
          <div className='mb-10 flex flex-col gap-x-24 gap-y-10 md:flex-row md:justify-between'>
            <div className='max-w-72'>
              <h3 className='text-lg font-semibold tracking-tight'>BetterTogeter</h3>
              <p className='mt-4 text-sm text-muted-foreground'>
                A gamified habit tracker. One island, four heroes, ten very pesky monsters.
              </p>
            </div>
            <div className='grid grid-cols-1 gap-x-20 gap-y-10 sm:grid-cols-2'>
              {sitemap.map((section) => (
                <div key={section.title}>
                  <h4 className='mb-5 text-sm font-semibold'>{section.title}</h4>
                  <ul className='space-y-2.5'>
                    {section.links.map((link) => (
                      <li key={link.title}>
                        <Link href={link.href} className='text-sm text-muted-foreground hover:text-foreground'>
                          {link.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className='flex flex-col items-baseline justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row'>
            <span>&copy; BetterTogeter {new Date().getFullYear()}</span>
            <span>Made by Steadhaven villagers, with sleep.</span>
          </div>
        </footer>
      </div>
    </section>
  )
}

export { Footer }
