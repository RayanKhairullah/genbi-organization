'use client'

import Link from 'next/link'
import { MapPin, Phone, Mail, Instagram, Facebook, Twitter, Heart } from 'lucide-react'
import Image from 'next/image'
import { assets } from '@/assets/assets'

export function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-950 text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          {/* Logo and Description */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-1  mb-4">
            <Link href="/admin" className="flex items-center space-x-3 group">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <Image
                  src={assets.genbi_logo}
                  alt="Logo Genbi Kota Bengkulu"
                  className="opacity-90"
                  priority
                />
              </div>
              <span className="font-bold text-xl text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                Genbi Smkn 1 Kota Bengkulu
              </span>
            </Link>
            </div>
            <p className="mb-6 text-gray-600 dark:text-gray-400 leading-relaxed max-w-md">
              Komunitas pemuda Bengkulu untuk masa depan yang lebih baik melalui edukasi, kolaborasi, 
              dan kegiatan sosial yang berdampak positif.
            </p>

            <div className="flex space-x-3">
              <a 
                href="#" 
                className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-sky-500 dark:hover:text-sky-400 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Navigasi</h3>
            <ul className="space-y-3">
              {[
                { href: '/', label: 'Beranda' },
                { href: '/pengurus', label: 'Struktur' },
                { href: '/kegiatans', label: 'Kegiatan' },
              ].map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Kontak</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 mt-1 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                <span className="text-sm leading-relaxed">
                  Kota Bengkulu, Provinsi Bengkulu, Indonesia
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                <a
                  href="https://wa.me/6283157664115"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-700 dark:text-gray-300 hover:text-green-600 hover:underline"
                  aria-label="Hubungi via WhatsApp +62 812-8888-8888"
                >
                  Nabila Putri Rasya
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                <span className="text-sm">
                  forumgenrekotabengkulu@gmail.com
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 dark:border-gray-800 mt-10 pt-8">
          <div className="flex flex-col md:flex-row md:justify-between items-center gap-3 sm:gap-4">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 sm:gap-2 text-gray-500 dark:text-gray-400 text-sm text-center md:text-left px-2">
              <span>© 2025 GenSite Bengkulu.</span>
              <span>Dibuat dengan</span>
              <Heart className="w-4 h-4 text-red-500 dark:text-red-400" />
              <span>untuk generasi masa depan</span>
            </div>
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 sm:gap-4 text-sm px-2">
              <Link 
                href="https://github.com/RayanKhairullah" 
                className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                rayan4k
              </Link>
              <span className="text-gray-300 dark:text-gray-700">•</span>
              <div className="flex items-center space-x-2">
                <a 
                  href="#"
                  className="text-gray-500 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}