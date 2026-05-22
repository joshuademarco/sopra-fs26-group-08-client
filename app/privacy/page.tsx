import Link from 'next/link'
import { Footer } from '@/components/footer'

export default function PrivacyPage() {
  return (
    <main className='w-full'>
      <div className='mx-auto w-full max-w-7xl px-6 py-24'>
        <h1 className='text-2xl font-bold mb-4'>Privacy Policy</h1>

        <p className='mb-4'>Effective date: May 22, 2026</p>

        <section className='mb-4'>
          <h2 className='font-semibold'>1. Data Controller</h2>
          <p>
            The data controller for personal data collected through this Service is Sopra (contact:
            support@example.com). This policy explains how we collect, use and protect your personal
            data in accordance with Swiss data protection law.
          </p>
        </section>

        <section className='mb-4'>
          <h2 className='font-semibold'>2. Personal Data We Collect</h2>
          <p>
            We may collect: account information (name, email), content you provide, usage and
            analytics data, and technical data (IP address, device information). We may also use
            cookies and similar technologies.
          </p>
        </section>

        <section className='mb-4'>
          <h2 className='font-semibold'>3. Purposes and Legal Basis</h2>
          <p>
            We process data to provide and improve the Service, communicate with you, comply with
            legal obligations, and for legitimate business interests such as analytics and fraud
            prevention. Where required, we will request your consent.
          </p>
        </section>

        <section className='mb-4'>
          <h2 className='font-semibold'>4. Sharing and Transfers</h2>
          <p>
            We may share data with service providers who process data on our behalf. If data is
            transferred internationally we will ensure adequate safeguards are in place.
          </p>
        </section>

        <section className='mb-4'>
          <h2 className='font-semibold'>5. Retention</h2>
          <p>
            We retain personal data as long as necessary for the purposes described, and as
            permitted by applicable law.
          </p>
        </section>

        <section className='mb-4'>
          <h2 className='font-semibold'>6. Your Rights</h2>
          <p>
            You have rights to access, rectify, erase, restrict or object to processing of your
            personal data, and to request data portability where applicable. To exercise these
            rights contact support@example.com.
          </p>
        </section>

        <section className='mb-4'>
          <h2 className='font-semibold'>7. Security</h2>
          <p>
            We implement technical and organisational measures to protect personal data, but no
            system is completely secure. Report suspected breaches to support@example.com.
          </p>
        </section>

        <section className='mb-4'>
          <h2 className='font-semibold'>8. Changes</h2>
          <p>
            We may update this policy and will publish the new effective date. Significant changes
            will be communicated where appropriate.
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
