'use client'

import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import HeaderSlider from '@/components/HeaderSlider'
import QuickLinksSection from '@/components/QuickLinksSection'
import FAQSection from '@/components/FAQSection'
import KegiatanPreview from '@/components/KegiatanPreview'
// import SponsorsSection from '@/components/SponsorsSection'
import RupiahFAQSection from '@/components/RupiahFAQSection'
import QrisFAQSection from '@/components/QrisFAQSection'

export default function Home() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Genbi Kota Bengkulu',
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/kegiatans?query={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  }
  const orgLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Genbi Kota Bengkulu',
    url: siteUrl,
    logo: `${siteUrl}/genbilogo.svg`,
    sameAs: [
      'https://instagram.com/genbi_kota_bengkulu'
    ]
  }
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }} />
      <Navigation />
      
      {/* Hero Section */}
      <HeaderSlider />

      {/* Quick Links Section */}
      <QuickLinksSection />

      {/* FAQ Section */}
      <FAQSection />
      
      {/* Rupiah FAQ Section */}
      <RupiahFAQSection />

      {/* QRIS FAQ Section */}
      <QrisFAQSection />

      {/* Kegiatan Preview Section */}
      <KegiatanPreview />

      <Footer />
    </div>
  )
}
