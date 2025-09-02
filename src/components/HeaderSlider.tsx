'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { assets } from '@/assets/assets'

interface HeroSlide {
  id: number
  title: string
  hashtag: string
  subtitle: string
  primaryButton: {
    text: string
    href: string
  }
  secondaryButton: {
    text: string
    href: string
  }
  icon: React.ReactNode
}

const HeaderSlider: React.FC = () => {
  const heroSlides: HeroSlide[] = [
    {
      id: 1,
      hashtag: '#GenbiBengkulu',
      title: 'Genbi Smkn 1 Kota Bengkulu',
      subtitle: 'Berkolaborasi Membangun Generasi Muda',
      primaryButton: { text: 'Pengurus', href: '/pengurus' },
      secondaryButton: { text: 'Faq', href: '#faq' },
      icon: (
        <Image
          src={assets.genbi_logo}
          alt="Ikon Masa Depan Cerah"
          width={350}
          height={100}
          className="w-full h-auto max-w-[280px] md:max-w-full opacity-90"
          priority
        />
      )
    },
    {
      id: 3,
      hashtag: '#MasaDepanCerah',
      title: 'Masa Depan Cerah',
      subtitle: 'Bersama Genbi, Kita Berkarya',
      primaryButton: { text: 'Kegiatan', href: '/kegiatans' },
      secondaryButton: { text: 'Pengurus', href: '/pengurus' },
      icon: (
        <Image
          src={assets.genbi_komisariat}
          alt="Ikon Masa Depan Cerah"
          width={350}
          height={100}
          className="w-full h-auto max-w-[280px] md:max-w-full opacity-90"
          priority
        />
      )
    }
  ]

  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [heroSlides.length])

  return (
    <div className="relative py-8 md:py-4 overflow-hidden">
      {/* Background image */}
      <Image
        src={assets.genbi_people}
        alt="Background"
        fill
        priority
        className="object-cover object-center dark:opacity-100 select-none pointer-events-none"
      />
      {/* Readability overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/30 via-white/30 to-white/30 dark:from-gray-900/80 dark:via-gray-900/70 dark:to-gray-900/80" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        {/* Gunakan min-h untuk memastikan ruang yang cukup untuk konten */}
        <div className="min-h-[380px] md:min-h-[520px] flex items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={heroSlides[currentSlide].id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              className="w-full flex flex-col md:flex-row items-center justify-between px-4 md:px-8 py-6 md:py-10"
              layout // Penting untuk mencegah layout shift [[4]]
            >
              {/* Text Section */}
              <div className="z-10 w-full md:w-1/2 text-center md:text-left mb-6 md:mb-0">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="mb-3"
                >
                  <span className="inline-flex items-center px-3 text-sm font-medium text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 rounded-full border border-blue-100 dark:border-blue-900/50">
                    {heroSlides[currentSlide].hashtag}
                  </span>
                </motion.div>
                
                <h1 className="text-2xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-2 md:mb-3 leading-tight tracking-tight [text-shadow:0_1px_2px_rgba(0,0,0,0.35),0_0_10px_rgba(0,0,0,0.25)] dark:[text-shadow:none]">
                  {heroSlides[currentSlide].title}
                </h1>
                <p className="text-base md:text-xl font-medium text-white dark:text-blue-400 mb-6 md:mb-8 opacity-95 [text-shadow:0_1px_2px_rgba(0,0,0,0.35),0_0_8px_rgba(0,0,0,0.25)] dark:[text-shadow:none]">
                  {heroSlides[currentSlide].subtitle}
                </p>

                <div className="flex flex-col sm:flex-row gap-2 md:gap-3 justify-center md:justify-start">
                  <Link
                    href={heroSlides[currentSlide].primaryButton.href}
                    className="inline-flex items-center justify-center px-4 md:px-6 py-2 md:py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg font-medium transition-all duration-300 shadow hover:shadow-md hover:scale-[1.02] focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950"
                  >
                    {heroSlides[currentSlide].primaryButton.text}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                  <Link
                    href={heroSlides[currentSlide].secondaryButton.href}
                    className="inline-flex items-center justify-center px-4 md:px-6 py-2 md:py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg font-medium transition-all duration-300 hover:shadow"
                  >
                    {heroSlides[currentSlide].secondaryButton.text}
                  </Link>
                </div>
              </div>

              {/* Icon Section - Perbaikan utama di sini */}
              <motion.div
                className="z-10 w-full md:w-1/2 flex justify-center"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                layout // Penting untuk animasi layout yang smooth [[4]]
              >
                <div className="max-w-[300px] w-full">
                  {heroSlides[currentSlide].icon}
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default HeaderSlider