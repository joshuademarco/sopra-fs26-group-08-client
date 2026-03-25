import { cn } from '@/lib/utils'
import Link from 'next/link'

const sitemap = [
  {
    title: 'Company',
    links: [
      {
        title: 'About Us',
        href: '#',
      }
    ],
  },
  {
    title: 'Support',
    links: [
      {
        title: 'Help Center',
        href: '#',
      },
      {
        title: 'Status',
        href: '#',
      },
    ],
  },
]

interface FooterProps {
  className?: string
}

const Footer = ({ className }: FooterProps) => {
  return (
    <section className={cn('py-16', className)}>
      <div className='container mx-auto'>
        <footer>
          <div className='relative mb-8 flex w-full flex-col gap-x-28 gap-y-8 md:flex-row md:justify-between md:gap-y-0'>
            <div className='max-w-96'>
              <div className='mb-6 flex items-center gap-3'>
                <h3 className='text-xl font-bold'>BetterTogether.com</h3>
              </div>
              <p className='text-base font-medium text-muted-foreground'>Components made easy.</p>
            </div>
            <div className='flex flex-col items-start gap-x-20 gap-y-14 xl:flex-row'>
              <div className='inline-grid w-fit grid-cols-1 gap-x-20 gap-y-14 sm:grid-cols-2'>
                {sitemap.map((section) => (
                  <div key={section.title} className='h-fit w-min'>
                    <h4 className='mb-6 text-base font-semibold whitespace-nowrap'>{section.title}</h4>
                    <ul className='space-y-3 text-base font-medium text-muted-foreground'>
                      {section.links.map((link) => (
                        <li key={link.title}>
                          <a href={link.href} className='text-base whitespace-nowrap hover:text-accent-foreground'>
                            {link.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className='flex flex-col items-baseline justify-between gap-8 border-t border-border pt-8 md:flex-row md:gap-16'>
            <div className='text-xs text-muted-foreground sm:text-sm'>&copy; BetterTogether {new Date().getFullYear()}</div>
            <div className='flex flex-col items-start gap-4 text-xs text-muted-foreground sm:text-sm md:flex-row lg:items-center'>
              <Link href='#' className='hover:text-accent-foreground'>
                Terms & Conditions
              </Link>
              <Link href='#' className='hover:text-accent-foreground'>
                Privacy Policy
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </section>
  )
}

export { Footer }
