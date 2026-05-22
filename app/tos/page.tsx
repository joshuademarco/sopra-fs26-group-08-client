import Link from 'next/link'
import { Footer } from '@/components/footer'

export default function TosPage() {
  return (
    <main className='w-full'>
      <div className='mx-auto w-full max-w-7xl px-6 py-24'>
        <h1 className='text-2xl font-bold mb-4'>Terms of Service</h1>

        <p className='mb-4'>Effective date: May 22, 2026</p>

        <section className='mb-4'>
          <h2 className='font-semibold'>1. Introduction</h2>
          <p>
            Welcome to Sopra. These Terms of Service (&quot;Terms&quot;) govern your access to and use of our
            website and services. By using the Service you agree to these Terms. If you do not agree,
            please do not use the Service.
          </p>
        </section>

        <section className='mb-4'>
          <h2 className='font-semibold'>2. Services</h2>
          <p>
            We provide an online platform and related services. We may modify, suspend or discontinue
            any part of the Service at any time without notice.
          </p>
        </section>

        <section className='mb-4'>
          <h2 className='font-semibold'>3. Accounts</h2>
          <p>
            You are responsible for maintaining the security of your account credentials and for any
            activity that occurs under your account. Notify us immediately of any unauthorized use.
          </p>
        </section>

        <section className='mb-4'>
          <h2 className='font-semibold'>4. Acceptable Use</h2>
          <p>
            You must not use the Service for unlawful activities, to infringe rights, or to transmit
            harmful or abusive content. We reserve the right to remove content or restrict access
            that violates these Terms.
          </p>
        </section>

        <section className='mb-4'>
          <h2 className='font-semibold'>5. Intellectual Property</h2>
          <p>
            All content provided by the Service is protected by copyright, trademark and other laws.
            You obtain only the rights expressly granted in these Terms.
          </p>
        </section>

        <section className='mb-4'>
          <h2 className='font-semibold'>6. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, we exclude liability for indirect or consequential
            losses. Our total liability for direct losses is limited to the amount you paid, if any,
            in the 12 months prior to the claim.
          </p>
        </section>

        <section className='mb-4'>
          <h2 className='font-semibold'>7. Termination</h2>
          <p>
            We may suspend or terminate your access for breach of these Terms or for other legitimate
            reasons. Termination does not affect accrued rights or obligations.
          </p>
        </section>

        <section className='mb-4'>
          <h2 className='font-semibold'>8. Governing Law</h2>
          <p>
            These Terms are governed by Swiss law. Any dispute arising out of or relating to these
            Terms shall be subject to the jurisdiction of the courts of Zurich, Switzerland, unless
            mandatory law requires otherwise.
          </p>
        </section>

        <section className='mb-4'>
          <h2 className='font-semibold'>9. Contact</h2>
          <p>
            For questions about these Terms or the Service, contact us at support@example.com.
          </p>
        </section>

        <div className='mt-6'>
          <Link href='/' className='text-blue-600'>Back to Home</Link>
        </div>
      </div>

      <Footer />
    </main>
  )
}
