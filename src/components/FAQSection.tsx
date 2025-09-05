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
    { id: 1, question: "Apa itu GenBI?", answer: "GenBI adalah singkatan dari Generasi Baru Indonesia, sebuah komunitas mahasiswa penerima Beasiswa Bank Indonesia (BI) yang bertujuan membangun generasi muda unggul melalui program pengembangan diri dan pengabdian masyarakat." },

    { id: 2, question: "Kapan GenBI didirikan?", answer: "GenBI didirikan pada 11 November 2011." },

    { id: 3, question: "Apa saja divisi yang ada di GenBI?", answer: "Pendidikan, Lingkungan Hidup, Kewirausahaan, Pengabdian Masyarakat, serta Publikasi dan Sosialisasi." },

    { id: 4, question: "Apa saja 3 pilar GenBI?", answer: "Frontliners, Change Agents, dan Future Leaders." },

    { id: 5, question: "Apa Visi dan Misi GenBI?", answer: (
      <div className="space-y-3">
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">Visi GenBI</p>
          <ul className="list-disc pl-5 mt-1 text-gray-700 dark:text-gray-300 space-y-1">
            <li>
              <span className="font-medium">Generasi Unggul dan Berkompeten:</span> Menjadikan kaum muda Indonesia sebagai generasi yang unggul dan memiliki kompetensi dalam berbagai bidang keilmuan.
            </li>
            <li>
              <span className="font-medium">Agen Perubahan Positif:</span> Menjadi generasi yang dapat membawa perubahan positif dan menjadi inspirasi bagi bangsa dan negara.
            </li>
          </ul>
        </div>
        <div className="pt-1">
          <p className="font-semibold text-gray-900 dark:text-white">Misi GenBI</p>
          <ul className="list-disc pl-5 mt-1 text-gray-700 dark:text-gray-300 space-y-1">
            <li>
              <span className="font-medium">Frontliners Bank Indonesia:</span> Menjadi penyambung informasi dan mengomunikasikan kebijakan Bank Indonesia kepada masyarakat, khususnya sesama mahasiswa.
            </li>
            <li>
              <span className="font-medium">Change Agents:</span> Menjadi agen perubahan yang berkontribusi dalam pembangunan bangsa dan melakukan aksi nyata di masyarakat.
            </li>
            <li>
              <span className="font-medium">Future Leaders:</span> Membentuk diri menjadi calon pemimpin masa depan yang kompetitif dan mampu mengambil peran penting dalam berbagai bidang.
            </li>
            <li>
              <span className="font-medium">Memberi Kontribusi Positif:</span> Berkontribusi melalui kegiatan pemberdayaan masyarakat, seperti pendidikan dan aksi nyata, serta menjadi wadah bagi pengembangan diri anggota.
            </li>
          </ul>
        </div>
      </div>
    ) },
    
    { id: 6, question: "Apa perbedaan GenBI dengan organisasi kampus pada umumnya?", answer: "Perbedaan utama antara GenBI dan organisasi kampus pada umumnya adalah tujuan dan fokus aktivitasnya: GenBI adalah komunitas penerima Beasiswa Bank Indonesia (BI) yang juga aktif dalam kegiatan pengembangan masyarakat dan sosial, sementara organisasi kampus umum berfokus pada minat, bakat, atau kepentingan akademik mahasiswa di lingkup jurusan, fakultas, atau universitas. GenBI juga memiliki struktur binaan dari Bank Indonesia dan terdiri dari mahasiswa dari berbagai disiplin ilmu dari berbagai universitas, bukan hanya satu universitas. "},

    { id: 7, question: " Apa saja kegiatan rutin yang dilakukan GenBI setiap tahunnya?", answer: "Kegiatan rutin GenBI meliputi pengembangan diri melalui pelatihan kepemimpinan dan softskill serta kegiatan sosialisasi seperti seminar dan workshop. Komunitas ini juga aktif dalam kegiatan sosial dan masyarakat seperti bakti sosial, penggalangan dana, dan aksi lingkungan, serta berbagai program literasi keuangan yang bertujuan mengedukasi masyarakat tentang pengelolaan keuangan dan kebijakan Bank Indonesia." },
    
    { id: 8, question: "Apa bentuk dukungan nyata Bank Indonesia terhadap GenBI?", answer: "Dukungan Bank Indonesia (BI) terhadap GenBI nyata melalui pemberian beasiswa dana pendidikan dan biaya hidup bagi mahasiswa, pelatihan pengembangan diri seperti kepemimpinan dan literasi keuangan, penyediaan jaringan profesional dan alumni, serta menjadi wadah bagi mahasiswa untuk berkontribusi melalui kegiatan sosial dan pemberdayaan masyarakat yang sejalan dengan tujuan BI." },
    
    { id: 9, question: "Apa manfaat yang dirasakan masyarakat dengan adanya GenBI?", answer: "Masyarakat merasakan manfaat melalui program-program sosial dan edukasi yang digagas GenBI, yang juga menjadi sarana pengembangan diri mahasiswa menjadi agen perubahan dan penghubung kebijakan Bank Indonesia, serta meningkatkan literasi keuangan masyarakat, mendorong ekonomi digital, dan berkontribusi dalam pembangunan daerah melalui kegiatan langsung seperti pendidikan, kesehatan, dan kewirausahaan." }
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
