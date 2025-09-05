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
      question: 'Apa itu QRIS?',
      answer:
        'QRIS (Quick Response Code Indonesian Standard) adalah standar kode QR nasional untuk pembayaran digital di Indonesia yang ditetapkan oleh Bank Indonesia.'
    },
    {
      id: 2,
      question: 'Siapa yang mengelola QRIS?',
      answer:
        'QRIS dikelola oleh Bank Indonesia bekerja sama dengan industri sistem pembayaran melalui Asosiasi Sistem Pembayaran Indonesia (ASPI).'
    },
    {
      id: 3,
      question: 'Bagaimana cara menggunakan QRIS untuk membayar?',
      answer: (
        <div>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Buka aplikasi pembayaran yang mendukung QRIS.</li>
            <li>Pindai (scan) kode QRIS di kasir/merchant.</li>
            <li>Masukkan nominal (jika diperlukan) dan konfirmasi pembayaran.</li>
            <li>Selesaikan otentikasi sesuai aplikasi, lalu simpan bukti transaksi.</li>
          </ol>
        </div>
      )
    },
    {
      id: 4,
      question: 'Apa perbedaan QRIS statis dan dinamis?',
      answer: (
        <div>
          <ul className="list-disc pl-5 space-y-1">
            <li><span className="font-medium">Statis</span>: nominal diisi oleh pembayar; kode bisa dicetak dan digunakan berulang.</li>
            <li><span className="font-medium">Dinamis</span>: nominal dihasilkan otomatis per transaksi; kode berbeda di setiap transaksi.</li>
          </ul>
        </div>
      )
    },
    {
      id: 5,
      question: 'Apa manfaat menggunakan QRIS bagi pengguna dan merchant?',
      answer: (
        <div>
          <ul className="list-disc pl-5 space-y-1">
            <li>Praktis, cepat, dan aman karena tanpa uang tunai.</li>
            <li>Satu QR untuk semua aplikasi pembayaran berlisensi (interoperabel).</li>
            <li>Mengurangi biaya pengelolaan uang tunai bagi merchant.</li>
            <li>Transaksi tercatat sehingga memudahkan pencatatan usaha.</li>
          </ul>
        </div>
      )
    },
    {
      id: 6,
      question: 'Apa saja tantangan utama yang dihadapi dalam implementasi QRIS secara nasional, terutama di wilayah terpencil atau kurang berkembang secara digital, dan bagaimana strategi pemerintah mengatasinya?',
      answer: (
        <div className="space-y-2">
          <p>
            Tantangan utama implementasi QRIS secara nasional mencakup keterbatasan infrastruktur jaringan internet di wilayah terpencil, rendahnya literasi digital di kalangan masyarakat dan pelaku usaha, serta resistensi terhadap perubahan dari transaksi tunai ke digital.
          </p>
          <p>Strategi pemerintah dan BI untuk mengatasi tantangan ini meliputi:</p>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Program edukasi dan literasi digital.</li>
            <li>Kolaborasi dengan operator seluler untuk memperluas jaringan internet.</li>
            <li>Program digitalisasi UMKM melalui pendampingan.</li>
            <li>Penyediaan QRIS offline (tanpa jaringan langsung) untuk transaksi tertentu.</li>
            <li>Insentif bagi pelaku usaha yang beralih ke pembayaran digital.</li>
          </ol>
        </div>
      )
    },
    {
      id: 7,
      question: 'Apa peran QRIS dalam mendukung transaksi lintas negara, khususnya di kawasan ASEAN, dan bagaimana perkembangan implementasi QRIS cross-border saat ini?',
      answer: (
        <div>
          QRIS mendukung transaksi lintas negara melalui inisiatif kerja sama regional yang dilakukan oleh Bank Indonesia dengan bank sentral negara lain, khususnya di kawasan ASEAN. QRIS cross-border memungkinkan wisatawan dari negara-negara mitra untuk melakukan pembayaran di Indonesia menggunakan aplikasi pembayaran dari negara asalnya, dan sebaliknya. Saat ini, BI telah bekerja sama dengan Thailand, Malaysia, dan Singapura untuk mengimplementasikan interoperabilitas sistem pembayaran berbasis QR code. Proyek ini mendukung pariwisata, UMKM, dan meningkatkan efisiensi transaksi lintas batas tanpa perlu menukar mata uang fisik.
        </div>
      )
    },
    {
      id: 8,
      question: 'Bagaimana proses pendaftaran pedagang atau pelaku usaha agar dapat menerima pembayaran menggunakan QRIS, dan apa saja syarat serta dokumen yang diperlukan?',
      answer: (
        <div className="space-y-2">
          <p>
            Pedagang atau pelaku usaha yang ingin menerima pembayaran melalui QRIS harus mendaftar ke Penyelenggara Jasa Sistem Pembayaran (PJSP) seperti bank atau penyedia dompet digital yang telah bekerja sama dengan Bank Indonesia. Proses pendaftaran umumnya mencakup:
          </p>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Pengisian formulir pendaftaran merchant.</li>
            <li>Verifikasi identitas (KTP) dan informasi usaha.</li>
            <li>NPWP jika ada.</li>
            <li>Nomor rekening bank atau e-wallet untuk menerima dana.</li>
          </ol>
          <p>
            Setelah verifikasi selesai, PJSP akan memberikan kode QRIS statis atau dinamis sesuai jenis usaha. Proses ini umumnya dapat dilakukan secara online dan tidak dipungut biaya.
          </p>
        </div>
      )
    },
    {
      id: 9,
      question: 'Apa langkah-langkah keamanan yang diterapkan oleh Bank Indonesia dan penyedia layanan QRIS untuk melindungi data pengguna dan mencegah kejahatan siber dalam transaksi QRIS?',
      answer: (
        <div>
          Keamanan transaksi QRIS dijaga melalui beberapa lapisan, termasuk:
          <ol className="list-decimal pl-5 space-y-1 mt-2">
            <li>Enkripsi data selama pengiriman.</li>
            <li>Verifikasi dua langkah untuk pengguna aplikasi pembayaran.</li>
            <li>Penggunaan standar ISO dalam pengembangan QRIS.</li>
            <li>Audit dan sertifikasi sistem PJSP oleh otoritas yang ditunjuk BI.</li>
            <li>Penyuluhan keamanan kepada pengguna.</li>
          </ol>
          Bank Indonesia juga mewajibkan PJSP untuk memiliki Sistem Manajemen Keamanan Informasi (SMKI) serta menerapkan kebijakan mitigasi risiko kejahatan siber seperti phishing, spoofing, dan QR code palsu.
        </div>
      )
    },
    {
      id: 10,
      question: 'Bagaimana kontribusi QRIS dalam mempercepat digitalisasi sistem pembayaran nasional dan mendukung transformasi ekonomi digital Indonesia menuju visi "Indonesia Emas 2045"?',
      answer: (
        <div>
          QRIS berkontribusi besar dalam mempercepat digitalisasi sistem pembayaran nasional dengan memfasilitasi transaksi non-tunai yang cepat, efisien, dan inklusif. Dengan adopsi yang luas oleh UMKM dan masyarakat umum, QRIS membantu meningkatkan volume dan nilai transaksi digital yang menjadi bagian dari ekosistem ekonomi digital. QRIS juga memperluas akses layanan keuangan formal bagi masyarakat unbanked dan underbanked. Dalam jangka panjang, QRIS menjadi bagian penting dari infrastruktur digital nasional yang mendukung transformasi ekonomi berbasis teknologi, sejalan dengan visi "Indonesia Emas 2045" yang menargetkan Indonesia sebagai negara maju dengan ekonomi berbasis inovasi dan digitalisasi.
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

const QrisFAQSection: React.FC = () => {
  return (
    <section id="faq-qris" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50/30 dark:from-gray-900 dark:to-blue-900/10 transition-all duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* FAQ Content */}
          <div className="order-2 lg:order-1">
            <div className="mb-10">
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-6">
                💬 FAQ QRIS
              </div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                Pertanyaan seputar QRIS
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                Pelajari standar pembayaran QR nasional untuk transaksi yang cepat, mudah, dan aman
              </p>
            </div>

            <FAQAccordion />
          </div>

          {/* FAQ Image */}
          <div className="order-1 lg:order-2 flex justify-center">
            <div className="relative group">
              <Image
                src={assets.formQuestions}
                alt="FAQ QRIS"
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

export default QrisFAQSection
