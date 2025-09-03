'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { type Pengurus } from '@/lib/supabase'
import Image from 'next/image'
import { Search, ClipboardList } from 'lucide-react'

// Extended type for division entries that may contain up to 3 image URLs
type PengurusWithDivisionImages = Pengurus & {
  image_url_1?: string | null
  image_url_2?: string | null
  image_url_3?: string | null
}

// Type guard to check if a pengurus entry has division image fields
const hasDivisionImages = (p: Pengurus): p is PengurusWithDivisionImages => {
  const rec: Record<string, unknown> = p as unknown as Record<string, unknown>
  return ('image_url_1' in rec) || ('image_url_2' in rec) || ('image_url_3' in rec)
}


interface OrganizationStructureProps {
  pengurus: Pengurus[]
}

export function PengurusView({ pengurus }: OrganizationStructureProps) {
  const [query, setQuery] = useState('')
  const [selectedPeriode, setSelectedPeriode] = useState<string | null>(null)
  

  // Group pengurus by periode
  const groupedByPeriode = useMemo(() => {
    return pengurus.reduce((acc, person) => {
      if (!acc[person.periode]) acc[person.periode] = []
      acc[person.periode].push(person)
      return acc
    }, {} as Record<string, Pengurus[]>)
  }, [pengurus])

  const periodes = useMemo(() => Object.keys(groupedByPeriode).sort().reverse(), [groupedByPeriode])
  const activePeriode = useMemo(() => {
    if (selectedPeriode) return selectedPeriode
    const y = new Date().getFullYear()
    const currentRange = `${y}-${y + 1}`
    if (periodes.includes(currentRange)) return currentRange
    return periodes[0] ?? ''
  }, [selectedPeriode, periodes])

  // Active pengurus for periode, sorted by urutan
  const activePengurus = useMemo(() => {
    const list = groupedByPeriode[activePeriode] ?? []
    return [...list].sort((a, b) => {
      const urA = a.struktur_jabatan?.urutan ?? 999
      const urB = b.struktur_jabatan?.urutan ?? 999
      return urA - urB
    })
  }, [groupedByPeriode, activePeriode])

  // Live filter by query (name, jabatan, alias)
  const filteredPengurus = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return activePengurus
    return activePengurus.filter((p) => {
      const hay = `${p.nama} ${p.struktur_jabatan?.nama_jabatan ?? ''} ${p.jabatan_pengurus ?? ''}`.toLowerCase()
      return hay.includes(q)
    })
  }, [activePengurus, query])

  // Build hierarchy (1–7) and divisions (8–12)
  const hirarki = useMemo(() => {
    const list = filteredPengurus.filter(p => {
      const ur = p.struktur_jabatan?.urutan ?? 999
      return ur >= 1 && ur <= 8
    })
    return list
  }, [filteredPengurus])

  const row1 = useMemo(() => hirarki.filter(p => p.struktur_jabatan?.urutan === 1), [hirarki])
  const row2 = useMemo(() => hirarki.filter(p => {
    const u = p.struktur_jabatan?.urutan ?? 0
    return u === 2 || u === 3
  }), [hirarki])
  const row3 = useMemo(() => hirarki.filter(p => {
    const u = p.struktur_jabatan?.urutan ?? 0
    return u >= 4 && u <= 8
  }), [hirarki])

  // Group divisions (urutan >= 8) by jabatan_id and sort by struktur_jabatan.urutan
  type DivisionGroup = { jabatanId: number; title: string; urutan: number; members: Pengurus[] }
  const divisionGroups = useMemo<DivisionGroup[]>(() => {
    const map = new Map<number, DivisionGroup>()
    for (const p of filteredPengurus) {
      const ur = p.struktur_jabatan?.urutan ?? 0
      if (ur < 9) continue
      const id = p.jabatan_id ?? -1
      if (id === -1) continue
      const key = id
      const existing = map.get(key)
      if (!existing) {
        map.set(key, {
          jabatanId: key,
          title: p.struktur_jabatan?.nama_jabatan ?? 'Divisi',
          urutan: ur,
          members: [p],
        })
      } else {
        existing.members.push(p)
      }
    }
    return Array.from(map.values()).sort((a, b) => a.urutan - b.urutan)
  }, [filteredPengurus])

  if (pengurus.length === 0) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl shadow-lg p-8">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <p className="text-gray-500">
            Belum ada data struktur organisasi yang tersedia.
          </p>
        </div>
      </div>
    )
  }

  // MemberCard component removed (unused)

  const TextBadge = ({ label }: { label: string }) => (
    <span className="inline-flex items-center justify-center rounded-lg px-3 py-1 text-xs font-semibold bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-100 border border-gray-200 dark:border-gray-600">
      {label}
    </span>
  )

  const PersonTile = ({ person }: { person: Pengurus }) => (
    <div className="rounded-xl bg-white/90 dark:bg-gray-800/80 border border-gray-200/70 dark:border-gray-700/60 p-4 text-center shadow-sm">
      <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">{person.nama}</div>
      {person.struktur_jabatan?.nama_jabatan && (
        <div className="mt-1 text-[12px] text-gray-600 dark:text-gray-300 truncate">{person.struktur_jabatan?.nama_jabatan}</div>
      )}
    </div>
  )

  // DivisionThumb component removed (unused)

  const DivisionSlider = ({ div }: { div: DivisionGroup }) => {
    // Support two data shapes:
    // 1) Legacy: up to 3 rows per division, each with image_url
    // 2) New: single row per division with image_url_1..3
    const first = div.members[0]
    let images: string[] = []
    if (first && hasDivisionImages(first) && (first.image_url_1 || first.image_url_2 || first.image_url_3)) {
      images = [first.image_url_1, first.image_url_2, first.image_url_3]
        .filter((u): u is string => typeof u === 'string' && u.length > 0)
    } else {
      images = div.members.slice(0, 3).map((m) => {
        const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(m.nama)}&background=random&size=512`
        return m.image_url || fallback
      })
    }
    // Parse Ketua & Anggota names from formatted `nama` or fallback to members ordering
    const { ketuaName, anggotaList } = useMemo(() => {
      const result = { ketuaName: '', anggotaList: [] as string[] }
      const raw = (first?.nama || '').trim()
      if (raw) {
        // Try to parse pattern: "Ketua Divisi : <ketua> Anggota : <anggota...>"
        const m = raw.match(/ketua\s*(?:divisi)?\s*:\s*(.*?)\s*anggota\s*:\s*(.*)$/i)
        if (m) {
          result.ketuaName = m[1].trim()
          // Split anggota by comma, newline, or multiple spaces
          const tail = m[2].trim()
          result.anggotaList = tail
            .split(/[,\n]+|\s{2,}/)
            .map(s => s.trim())
            .filter(Boolean)
        } else if (div.members.length > 1) {
          // Legacy multi-rows: assume first is ketua, others anggota
          result.ketuaName = div.members[0]?.nama || ''
          result.anggotaList = div.members.slice(1).map(m => m.nama).filter(Boolean)
        } else {
          // Fallback: single name only
          result.ketuaName = raw
        }
      }
      return result
    }, [first?.nama, div.members])
    const [index, setIndex] = useState(0)
    const [paused, setPaused] = useState(false)
    const hasSlider = images.length > 1
    const current = images[index] || null

    useEffect(() => {
      if (!hasSlider || paused) return
      const id = setInterval(() => setIndex((i) => (i + 1) % images.length), 4000)
      return () => clearInterval(id)
    }, [hasSlider, paused, images.length])

    const prev = () => setIndex((i) => (i - 1 + images.length) % images.length)
    const next = () => setIndex((i) => (i + 1) % images.length)

    const [isDark, setIsDark] = useState(false)
    const [overlayOpen, setOverlayOpen] = useState(false)
    useEffect(() => {
      if (typeof window !== 'undefined') {
        const root = document.documentElement
        setIsDark(root.classList.contains('dark'))
      }
    }, [])
    return (
      <div
        className="relative group aspect-[16/9] rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onClick={() => {
          if (isDark) setOverlayOpen((v) => !v)
        }}
      >
        {current && (
          <Image
            src={current}
            alt={div.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
            unoptimized
          />
        )}
        {/* Hover/click overlay with title and Ketua/Anggota details */}
        <div
          className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${
            (isDark && overlayOpen) ? 'opacity-100' : 'opacity-0 md:group-hover:opacity-100 md:group-focus:opacity-100'
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
            <h4 className="text-white font-semibold text-sm sm:text-base leading-tight line-clamp-2">{div.title}</h4>
            {(ketuaName || (anggotaList && anggotaList.length)) && (
              <div className="mt-1.5 space-y-0.5 text-[11px] sm:text-xs text-gray-100/90">
                {ketuaName && (
                  <p className="truncate"><span className="text-blue-200 font-medium">Ketua:</span> {ketuaName}</p>
                )}
                {anggotaList && anggotaList.length > 0 && (
                  <p className="line-clamp-2"><span className="text-blue-200 font-medium">Anggota:</span> {anggotaList.join(', ')}</p>
                )}
              </div>
            )}
          </div>
        </div>
        {hasSlider && (
          <>
            {/* Controls */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                prev()
              }}
              aria-label="Sebelumnya"
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-800 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition"
            >
              ‹
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                next()
              }}
              aria-label="Berikutnya"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-800 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition"
            >
              ›
            </button>
            {/* Dots */}
            <div className="pointer-events-auto absolute inset-x-0 bottom-2 flex items-center justify-center gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Ke gambar ${i + 1}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    setIndex(i)
                  }}
                  className={`h-1.5 rounded-full transition-all ${
                    i === index ? 'w-5 bg-white dark:bg-gray-200' : 'w-2 bg-white/60 dark:bg-gray-500'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <div className="from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg dark:shadow-2xl px-4 py-6 sm:p-8 transition-colors duration-300">
      {/* Header + controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="text-left sm:text-left">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Pengurus Genbi Komisariat SMKN 1 Kota Bengkulu</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Periode <span className="font-semibold text-gray-800 dark:text-gray-100">{activePeriode}</span> · <span className="text-xs text-gray-500">{filteredPengurus.length} anggota</span></p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-indigo-500 dark:from-blue-500 dark:to-indigo-600 rounded-full mt-3" />
        </div>

        <div className="flex-1 sm:flex-initial flex flex-col sm:flex-row items-stretch gap-3 w-full sm:w-auto">
          <label className="relative flex items-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 shadow-sm w-full sm:w-[320px]">
            <Search className="w-4 h-4 text-gray-400 mr-2" />
            <input
              aria-label="Cari nama atau jabatan"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari nama, jabatan, atau posisi..."
              className="bg-transparent outline-none text-sm text-gray-700 dark:text-gray-200 w-full"
            />
          </label>

          <div className="mt-2 sm:mt-0 sm:ml-3">
            <label className="sr-only" htmlFor="periode-select">Pilih Periode</label>
            <select
              id="periode-select"
              value={selectedPeriode ?? periodes[0] ?? ''}
              onChange={(e) => setSelectedPeriode(e.target.value || null)}
              className="px-3 py-2 text-sm rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 shadow-sm"
            >
              {periodes.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Hierarchy 1–7 without images (layout rows) */}
      {(row1.length + row2.length + row3.length) > 0 && (
        <section className="mb-10">
          {/* Row 1 */}
          {row1.length > 0 && (
            <div className="mb-4 flex justify-center">
              <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
                <div className="text-center mb-2"><TextBadge label={row1[0].struktur_jabatan?.nama_jabatan ?? ''} /></div>
                <PersonTile person={row1[0]} />
              </div>
            </div>
          )}
          {/* Row 2 */}
          {row2.length > 0 && (
            <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {row2.map(p => (
                <div key={p.id} className="flex-1">
                  <div className="text-center mb-2"><TextBadge label={p.struktur_jabatan?.nama_jabatan ?? ''} /></div>
                  <PersonTile person={p} />
                </div>
              ))}
            </div>
          )}
          {/* Row 3 */}
          {row3.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
              {row3.map(p => (
                <div key={p.id} className="flex-1">
                  <div className="text-center mb-2"><TextBadge label={p.struktur_jabatan?.nama_jabatan ?? ''} /></div>
                  <PersonTile person={p} />
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Divisions: show each division as one card with up to 3 member images */}
      {divisionGroups.length > 0 && (
        <section className="mb-10">
          <h2 className="text-1xl font-bold text-gray-900 dark:text-white mb-4 text-center">
            <ClipboardList className="inline-block w-4 h-4 mr-2 align-[-2px]" />
            Divisi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {divisionGroups.map((div) => (
              <div key={div.jabatanId}>
                <div className="text-center mb-1"><TextBadge label={div.title} /></div>
                <div className="rounded-2xl bg-white/90 dark:bg-gray-800/80 border border-gray-200/70 dark:border-gray-700/60 p-1 md:p-2 shadow-sm">
                  <DivisionSlider div={div} />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
