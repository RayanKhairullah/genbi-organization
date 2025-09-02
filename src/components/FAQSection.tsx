'use client'

import Image from 'next/image'
import { useState } from 'react'
import { assets } from '@/assets/assets'
import { ChevronDown } from 'lucide-react'

interface FAQItem {
  id: number
  question: string
  answer: string
}

const FAQAccordion: React.FC = () => {
  const [openItem, setOpenItem] = useState<number | null>(null)

  const faqData: FAQItem[] = [
    { id: 1, question: "Apa Itu Genbi Bengkulu?", answer: "Genbi Kota Bengkulu adalah organisasi kemahasiswaan/komunitas yang berfokus pada pengembangan remaja dan kegiatan sosial kemasyarakatan di Bengkulu. Program berfokus pada edukasi, informasi, serta pengembangan keterampilan bagi generasi muda." },
    { id: 2, question: "Kapan Genbi Bengkulu Berdiri?", answer: "Genbi Bengkulu hadir sebagai wadah kolaborasi pemuda untuk mendukung peningkatan kualitas sumber daya manusia di daerah, mendorong peran aktif remaja dalam kegiatan positif dan produktif." },
    { id: 3, question: "Dimana Lokasi Sekretariat Genbi Bengkulu?", answer: "Sekretariat Genbi Bengkulu berlokasi di Kota Bengkulu dan bekerja sama dengan berbagai instansi dan komunitas pemuda untuk menjangkau berbagai wilayah di Provinsi Bengkulu." },
    { id: 4, question: "Apa Saja Fokus Kegiatan Genbi Bengkulu?", answer: "Fokus kegiatan mencakup: (1) Edukasi dan literasi, (2) Informasi dan pengembangan komunitas, (3) Pendampingan dan mentoring remaja, (4) Pengembangan keterampilan (life skills), dan (5) Fasilitasi kegiatan sosial dan pengembangan diri." },
    { id: 5, question: "Apa Tugas Dari Genbi Bengkulu?", answer: "Tugas Genbi Bengkulu adalah menyelenggarakan program pembinaan dan pengembangan remaja, menyediakan informasi bermanfaat, mengadakan pelatihan serta workshop, dan membangun kemitraan untuk mendukung kegiatan positif bagi generasi muda." },
    { id: 6, question: "Siapa Saja Anggota Genbi Bengkulu?", answer: "Anggota Genbi Bengkulu adalah remaja/pemuda yang peduli dan ingin berkontribusi dalam kegiatan sosial dan pengembangan diri. Keanggotaan terbuka bagi yang memiliki semangat berkontribusi bagi masyarakat." }
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
                isOpen
                  ? 'grid-rows-[1fr] opacity-100'
                  : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden">
                <div className="px-6 pb-6 pt-2 border-t border-gray-100/50 dark:border-gray-700/50">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

const FAQSection: React.FC = () => {
  return (
    <section id="faq" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50/30 dark:from-gray-900 dark:to-blue-900/10 transition-all duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* FAQ Content */}
          <div className="order-2 lg:order-1">
            <div className="mb-10">
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-6">
                💬 FAQ
              </div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                Pertanyaan yang Sering Ditanyakan
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                Temukan jawaban untuk pertanyaan umum seputar Genbi Bengkulu dan program-programnya
              </p>
            </div>

            <FAQAccordion />
          </div>

          {/* FAQ Image */}
          <div className="order-1 lg:order-2 flex justify-center">
            <div className="relative group">
              <Image
                src={assets.formQuestions}
                alt="FAQ Genbi Bengkulu"
                width={450}
                height={450}
                className="relative rounded-3xl group-hover:shadow-3xl transition-all duration-500 group-hover:scale-105"
                unoptimized
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FAQSection
