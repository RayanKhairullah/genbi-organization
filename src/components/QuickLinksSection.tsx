'use client'

import Link from 'next/link'
import { ArrowRight, Users, CalendarDays, HelpCircle, Instagram } from 'lucide-react'

const QuickLinksSection: React.FC = () => {
  const quickLinks = [
    {
      href: "/pengurus",
      icon: <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />,
      title: "Pengurus",
      desc: "Lihat struktur organisasi Genbi Kota Bengkulu dan profil pengurus",
      bg: "bg-blue-100 dark:bg-blue-900",
    },
    {
      href: "/kegiatans",
      icon: <CalendarDays className="w-8 h-8 text-purple-600 dark:text-purple-400" />,
      title: "Kegiatan",
      desc: "Jelajahi kegiatan Genbi Kota Bengkulu",
      bg: "bg-purple-100 dark:bg-purple-900",
    },
    {
      href: "#faq",
      icon: <HelpCircle className="w-8 h-8 text-amber-600 dark:text-amber-400" />,
      title: "FAQ",
      desc: "Pertanyaan yang sering ditanyakan seputar Genbi",
      bg: "bg-amber-100 dark:bg-amber-900",
    },
    {
      href: "https://instagram.com/",
      icon: <Instagram className="w-8 h-8 text-pink-600 dark:text-pink-400" />,
      title: "Instagram",
      desc: "Ikuti update terbaru Genbi di Instagram",
      bg: "bg-pink-100 dark:bg-pink-900",
    },
  ]

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-800" id="quicklink">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-6">
            💬 Akses Cepat
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Akses Cepat
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Bingung Mau Akses Apa? Berikut Beberapa Pintasan Pilihan Untukmu
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickLinks.map((link, idx) => (
            <Link
              key={idx}
              href={link.href}
              className="group relative bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div
                className={`w-14 h-14 ${link.bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}
              >
                {link.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {link.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">
                {link.desc}
              </p>
              <div className="absolute top-6 right-6 w-8 h-8 bg-gray-100 dark:bg-gray-600 rounded-full flex items-center justify-center group-hover:bg-blue-600 dark:group-hover:bg-blue-500 transition-colors duration-200">
                <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-white" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default QuickLinksSection
