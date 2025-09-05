'use client'

import Image from 'next/image'
import { useState } from 'react'
import { assets } from '@/assets/assets'
import { ChevronDown } from 'lucide-react'

interface FAQItem {
  id: number
  question: string
  answer: React.ReactNode
}

const FAQAccordion: React.FC = () => {
  const [openItem, setOpenItem] = useState<number | null>(null)

  const faqData: FAQItem[] = [
    {
      id: 1,
      question: 'Apa itu Rupiah?',
      answer:
        'Rupiah adalah uang yang dikeluarkan oleh Negara Kesatuan Republik Indonesia sebagaimana dimaksud dalam Undang-Undang tentang Mata Uang.'
    },
    {
      id: 2,
      question: 'Sebutkan apa saja jenis-jenis Rupiah?',
      answer: (
        <div>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <span className="font-medium">Uang kartal</span>: uang fisik seperti uang kertas dan logam.
            </li>
            <li>
              <span className="font-medium">Uang giral</span>: simpanan di bank yang dapat digunakan melalui cek, bilyet giro, atau transfer elektronik.
            </li>
            <li>
              <span className="font-medium">Uang elektronik</span>: nilai uang digital yang disimpan secara elektronik.
            </li>
          </ul>
        </div>
      )
    },
    {
      id: 3,
      question: 'Di mana pembuatan uang Rupiah?',
      answer:
        'Pembuatan uang Rupiah dilakukan oleh Perusahaan Umum Percetakan Uang Republik Indonesia (Perum Peruri) di pabriknya yang berlokasi di Ciampel, Karawang, Jawa Barat, berdasarkan amanat dari Bank Indonesia (BI).'
    },
    {
      id: 4,
      question: 'Kapan uang Rupiah beredar sebagai alat transaksi yang sah di Indonesia?',
      answer: '30 Oktober 1946.'
    },
    {
      id: 5,
      question: 'Uang Rupiah terbuat dari apa?',
      answer: (
        <div>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <span className="font-medium">Uang kertas</span>: berbahan dasar serat kapas sehingga lebih kuat dan tahan lama.
            </li>
            <li>
              <span className="font-medium">Uang logam</span>: dibuat dari berbagai jenis logam seperti nikel dan baja, cocok untuk transaksi bernilai kecil.
            </li>
          </ul>
        </div>
      )
    },
    {
      id: 6,
      question: 'Apakah yang dimaksud dengan CBP Rupiah?',
      answer:
        'Program Cinta, Bangga, Paham (CBP) Rupiah adalah kampanye Bank Indonesia untuk menanamkan tiga nilai utama dalam penggunaan Rupiah: Cinta, Bangga, dan Paham.'
    },
    {
      id: 7,
      question: 'Apa fungsi CBP Rupiah?',
      answer:
        'Program ini bertujuan menumbuhkan rasa cinta terhadap mata uang kita sendiri, bangga menggunakannya dalam kehidupan sehari-hari, dan paham fungsi serta peran penting Rupiah dalam perekonomian Indonesia.'
    },
    {
      id: 8,
      question: 'Bangga Rupiah adalah?',
      answer:
        'Bangga Rupiah merupakan perwujudan dari kemampuan masyarakat memahami Rupiah sebagai alat pembayaran yang sah, simbol kedaulatan NKRI, dan alat pemersatu bangsa.'
    },
    {
      id: 9,
      question: 'Bagaimana cara merawat uang Rupiah dalam 5J?',
      answer: (
        <div>
          <ul className="list-disc pl-5 space-y-1">
            <li>Jangan dilipat</li>
            <li>Jangan dicoret</li>
            <li>Jangan diremas</li>
            <li>Jangan distepler</li>
            <li>Jangan dibasahi</li>
          </ul>
        </div>
      )
    },
    {
      id: 10,
      question: 'Sebutkan apa yang dimaksud dengan 3D dalam Rupiah?',
      answer: (
        <div>
          <ul className="list-disc pl-5 space-y-1">
            <li>Dilihat</li>
            <li>Diraba</li>
            <li>Diterawang</li>
          </ul>
        </div>
      )
    }
  ]

  const toggleItem = (id: number) => {
    setOpenItem(openItem === id ? null : id)
  }

  return (
    <div className="space-y-3">
      {faqData.map((item) => {
        const isOpen = openItem === item.id
        return (
          <div
            key={item.id}
            className={`bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-lg dark:hover:shadow-2xl ${
              isOpen ? 'shadow-xl dark:shadow-2xl ring-1 ring-blue-500/20' : 'hover:border-gray-300/50 dark:hover:border-gray-600/50'
            }`}
          >
            <button
              onClick={() => toggleItem(item.id)}
              className="w-full px-6 py-5 text-left flex justify-between items-center group hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-all duration-300"
              aria-expanded={isOpen}
              aria-controls={`faq-answer-${item.id}`}
            >
              <span className="font-semibold text-gray-900 dark:text-white text-lg transition-colors duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 pr-4">
                {item.question}
              </span>
              <span className={`transition-all duration-500 ease-out ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
                <ChevronDown className={`w-5 h-5 transition-colors duration-300 ${
                  isOpen
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                }`} />
              </span>
            </button>

            <div
              id={`faq-answer-${item.id}`}
              className={`grid transition-all duration-500 ease-out ${
                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden">
                <div className="px-6 pb-6 pt-2 border-t border-gray-100/50 dark:border-gray-700/50">
                  <div className="text-gray-700 dark:text-gray-300 leading-relaxed text-base">
                    {item.answer}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

const RupiahFAQSection: React.FC = () => {
  return (
    <section id="faq-rupiah" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50/30 dark:from-gray-900 dark:to-blue-900/10 transition-all duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left column: Header stays here, image below header */}
          <div className="order-1 lg:order-1">
            <div className="mb-10">
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-6">
                💬 FAQ Rupiah & CBP
              </div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                Pertanyaan seputar Rupiah dan Program CBP
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                Pelajari lebih dalam tentang Rupiah sebagai mata uang NKRI serta kampanye Cinta, Bangga, Paham Rupiah
              </p>
            </div>

            {/* Image placed under header on the left */}
            <div className="flex justify-center">
              <div className="relative group">
                <Image
                  src={assets.formQuestions}
                  alt="FAQ Rupiah & CBP"
                  width={450}
                  height={450}
                  className="relative rounded-3xl group-hover:shadow-3xl transition-all duration-500 group-hover:scale-105"
                  unoptimized
                />
              </div>
            </div>
          </div>

          {/* Right column: Only the questions (accordion) */}
          <div className="order-2 lg:order-2">
            <FAQAccordion />
          </div>
        </div>
      </div>
    </section>
  )
}

export default RupiahFAQSection
