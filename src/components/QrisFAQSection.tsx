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
      question: 'Berapa biaya/fee transaksi QRIS?',
      answer:
        'Biaya MDR (Merchant Discount Rate) mengikuti ketentuan BI dan dapat berbeda berdasarkan kategori merchant dan jenis transaksi. (Silakan sesuaikan detail saat finalisasi konten).'
    },
    {
      id: 7,
      question: 'Bagaimana keamanan transaksi QRIS?',
      answer:
        'Transaksi QRIS menggunakan standar keamanan dari penyelenggara jasa pembayaran dan pengawasan oleh Bank Indonesia. Selalu periksa nama merchant dan nominal sebelum konfirmasi.'
    },
    {
      id: 8,
      question: 'Apakah QRIS bisa untuk cross-border?',
      answer:
        'QRIS Cross-Border tersedia bertahap dengan negara mitra yang telah bekerja sama. Ketersediaan bergantung pada kebijakan dan kesiapan mitra.'
    },
    {
      id: 9,
      question: 'Bagaimana cara mendaftar menjadi merchant QRIS?',
      answer: (
        <div>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Pilih PJSP (Penyelenggara Jasa Sistem Pembayaran) yang menyediakan QRIS.</li>
            <li>Lengkapi dokumen usaha sesuai persyaratan PJSP/BI.</li>
            <li>Lakukan proses verifikasi dan aktivasi merchant.</li>
            <li>Pasang QRIS di lokasi usaha dan mulai menerima pembayaran.</li>
          </ol>
        </div>
      )
    },
    {
      id: 10,
      question: 'Apa yang harus dilakukan jika transaksi QRIS gagal?',
      answer:
        'Cek koneksi, saldo/limit, dan status aplikasi. Jika dana terdebet namun merchant belum menerima, simpan bukti transaksi dan hubungi layanan pelanggan PJSP terkait untuk penelusuran (reversal/settlement).'
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
