'use client'

import { useState, Fragment, useMemo, useEffect } from 'react'
import { supabase, MEDIA_BUCKET, type StrukturJabatan, type Pengurus } from '@/lib/supabase'
import { compressImageToWebP } from '@/lib/image-utils'
import { Plus, Edit, Trash2, Users, Briefcase, Save, ChevronsUpDown } from 'lucide-react'
import { AdminLogo } from '@/components/admin/AdminLogo'
import { Dialog, Transition } from '@headlessui/react'
import Image from "next/image"

interface OrganizationManagerProps {
  pengurus: Pengurus[]
  strukturJabatan: StrukturJabatan[]
  onUpdate: () => void
}

export function OrganizationManager({ pengurus, strukturJabatan, onUpdate }: OrganizationManagerProps) {
  const [activeTab, setActiveTab] = useState<'pengurus' | 'struktur'>('pengurus')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Pengurus | StrukturJabatan | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [selectedImageFiles, setSelectedImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [selectedPeriode, setSelectedPeriode] = useState<string>('all')

  const defaultPeriode = new Date().getFullYear().toString()

  const initialPengurusForm = {
    nama: '',
    ttl: '',
    jabatan_pengurus: '',
    asal_pikr: '',
    tlpn: '',
    email: '',
    instagram: '',
    image_url: '',
    jabatan_id: '',
    periode: defaultPeriode,
    role_type: 'administrator' as 'administrator' | 'member',
    // UI-only helpers for division name composition
    ketua_divisi: '',
    anggota_divisi: '',
  }

  const uploadManyImages = async (files: File[]): Promise<string[]> => {
    const urls: string[] = []
    for (const f of files) {
      const url = await uploadImageToSupabase(f)
      if (!url) throw new Error('Gagal mengupload salah satu gambar')
      urls.push(url)
    }
    return urls
  }

  const initialStrukturForm = {
    nama_jabatan: '',
    urutan: '',
  }

  // Helper type for division image fields when editing existing Pengurus
  type PengurusWithImages = Pengurus & {
    id: number
    image_url_1?: string | null
    image_url_2?: string | null
    image_url_3?: string | null
  }

  const [pengurusForm, setPengurusForm] = useState(initialPengurusForm)
  const [strukturForm, setStrukturForm] = useState(initialStrukturForm)
  const [selectedRoleType, setSelectedRoleType] = useState<'all' | 'administrator' | 'member'>('all')
  // Search queries
  const [searchPengurus, setSearchPengurus] = useState('')
  const [searchStruktur, setSearchStruktur] = useState('')

  const periodes = useMemo(() => {
    const allPeriodes = pengurus.map(p => p.periode).filter(Boolean) as string[]
    return ['all', ...Array.from(new Set(allPeriodes)).sort((a, b) => b.localeCompare(a))]
  }, [pengurus])

  const filteredPengurus = useMemo(() => {
    let list = pengurus
    if (selectedPeriode !== 'all') list = list.filter(p => p.periode === selectedPeriode)
    if (selectedRoleType !== 'all') list = list.filter(p => (p.role_type ?? 'administrator') === selectedRoleType)
    const q = searchPengurus.trim().toLowerCase()
    if (!q) return list
    return list.filter(p => {
      const jabatanName = strukturJabatan.find(j => j.id === p.jabatan_id)?.nama_jabatan || ''
      return (
        (p.nama || '').toLowerCase().includes(q) ||
        (p.email || '').toLowerCase().includes(q) ||
        (p.periode || '').toLowerCase().includes(q) ||
        jabatanName.toLowerCase().includes(q)
      )
    })
  }, [pengurus, selectedPeriode, selectedRoleType, searchPengurus, strukturJabatan])

  const filteredStruktur = useMemo(() => {
    const q = searchStruktur.trim().toLowerCase()
    const list = [...strukturJabatan]
    if (!q) return list
    return list.filter(s => (s.nama_jabatan || '').toLowerCase().includes(q))
  }, [strukturJabatan, searchStruktur])

  const resetForms = () => {
    setPengurusForm(initialPengurusForm)
    setStrukturForm(initialStrukturForm)
    setEditingItem(null)
    setUploadingImage(false)
    setSelectedImageFiles([])
    setImagePreviews([])
  }

  const openModal = (item: Pengurus | StrukturJabatan | null = null) => {
    resetForms()
    if (item) {
      setEditingItem(item)
      if ('nama' in item) { // Pengurus
        setPengurusForm({
          ...initialPengurusForm,
          ...item,
          jabatan_id: item.jabatan_id.toString(),
          ttl: item.ttl || '',
          jabatan_pengurus: item.jabatan_pengurus || '',
          asal_pikr: item.asal_pikr || '',
          tlpn: item.tlpn || '',
          email: item.email || '',
          instagram: item.instagram || '',
          image_url: item.image_url || '',
          role_type: (item.role_type as 'administrator' | 'member') || 'administrator',
          // attempt to prefill division helpers from existing nama text if matches pattern
          ketua_divisi: (() => {
            const m = /ketua\s*divisi\s*:\s*(.*?)\s*anggota\s*:/i.exec(item.nama || '')
            return m ? m[1].trim() : ''
          })(),
          anggota_divisi: (() => {
            const m = /anggota\s*:\s*(.*)$/i.exec(item.nama || '')
            return m ? m[1].trim() : ''
          })(),
        })
        // Determine if this pengurus is a division entry (uses multi-image fields)
        const sj = strukturJabatan.find(j => j.id === item.jabatan_id)
        const isDivision = (sj?.nama_jabatan || '').toLowerCase().startsWith('divisi') || (sj?.nama_jabatan || '').toLowerCase().startsWith('devisi')
        if (isDivision) {
          // Populate previews from image_url_1..3 if present
          const existing = item as PengurusWithImages
          const urls = [
            existing.image_url_1,
            existing.image_url_2,
            existing.image_url_3,
          ].filter(Boolean) as string[]
          setImagePreviews(urls)
          setSelectedImageFiles([])
        } else {
          // Clear multi-image when editing single record
          setSelectedImageFiles([])
          setImagePreviews([])
        }
      } else { // Struktur
        setStrukturForm({ ...initialStrukturForm, ...item, urutan: item.urutan.toString() })
      }
    } else {
      // Default values when adding a new Pengurus
      if (activeTab === 'pengurus' && strukturJabatan.length > 0) {
        const first = strukturJabatan[0]
        setPengurusForm((prev) => ({
          ...prev,
          jabatan_id: String(first.id),
        }))
      }
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setTimeout(resetForms, 300) // Delay reset for transition
  }

  // Reset upload states when jabatan changes to ensure default inputs appear when placeholder is selected
  useEffect(() => {
    const selected = strukturJabatan.find(j => j.id === parseInt(pengurusForm.jabatan_id || '0'))
    const name = (selected?.nama_jabatan || '').toLowerCase()
    const isDivision = name.startsWith('divisi') || name.startsWith('devisi')
    if (!isDivision) {
      // Default/core mode: use single upload, clear multi selections
      setSelectedImageFiles([])
      setImagePreviews([])
    }
  }, [pengurusForm.jabatan_id, strukturJabatan])

  const uploadImageToSupabase = async (file: File): Promise<string | null> => {
    try {
      setUploadingImage(true)
      const compressedFile = await compressImageToWebP(file, 0.8)
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.webp`
      const filePath = `pengurus/${fileName}`
      const { error } = await supabase.storage
        .from(MEDIA_BUCKET)
        .upload(filePath, compressedFile, { contentType: 'image/webp', upsert: false })
      if (error) throw new Error(error.message)
      const { data: { publicUrl } } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(filePath)
      return publicUrl
    } catch (error) {
      console.error('Error uploading image:', error)
      const msg = error instanceof Error ? error.message : 'Gagal mengupload gambar!'
      setMessage({ type: 'error', text: msg })
      return null
    } finally {
      setUploadingImage(false)
    }
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      if (activeTab === 'pengurus') {
        const selectedJabatan = strukturJabatan.find(j => j.id === parseInt(pengurusForm.jabatan_id || '0'))
        const name = (selectedJabatan?.nama_jabatan || '').toLowerCase()
        const isDivision = name.startsWith('divisi') || name.startsWith('devisi')

        // For non-division roles, we no longer handle single-image uploads or image_url column

        const { nama, jabatan_id, periode, ketua_divisi, anggota_divisi } = pengurusForm
        const nameInput = (nama || '').trim()
        const derivedName = (!isDivision)
          ? (nameInput || (!editingItem ? (selectedJabatan?.nama_jabatan || 'Pengurus').trim() : ''))
          : (() => {
              // Compose: Ketua Divisi : <ketua> Anggota : <anggota1     anggota2 ...>
              const ketua = (ketua_divisi || '').trim()
              // split anggota by newlines or commas, trim, remove empties
              const anggotaTokens = (anggota_divisi || '')
                .split(/\n|,/)
                .map(s => s.trim())
                .filter(Boolean)
              const anggotaJoined = anggotaTokens.join('     ')
              const composed = [
                ketua ? `Ketua Divisi : ${ketua}` : '',
                anggotaJoined ? `Anggota : ${anggotaJoined}` : ''
              ].filter(Boolean).join(' ')
              // IMPORTANT: For divisions, always use composed text; DO NOT take value from 'Nama Lengkap'
              return (composed || (selectedJabatan?.nama_jabatan || 'Divisi').trim())
            })()
        if (!jabatan_id || !(periode || '').trim() || !derivedName) {
          throw new Error('Nama, Jabatan, dan Periode wajib diisi.')
        }
        // Build a minimal payload to avoid sending columns that will be removed
        const payloadCommon = {
          jabatan_id: parseInt(jabatan_id),
          periode: (pengurusForm.periode || '').trim(),
          role_type: pengurusForm.role_type,
        }

        if (isDivision) {
          // Single row with up to 3 images
          if (selectedImageFiles.length === 0 && !editingItem) throw new Error('Pilih minimal 1 gambar untuk divisi')
          if (selectedImageFiles.length > 3) throw new Error('Maksimal 3 gambar untuk divisi')
          let urls: string[] = []
          if (selectedImageFiles.length) {
            urls = await uploadManyImages(selectedImageFiles)
          } else if (editingItem) {
            const existing = editingItem as PengurusWithImages
            urls = [
              existing.image_url_1,
              existing.image_url_2,
              existing.image_url_3,
            ].filter(Boolean) as string[]
          }
          const payload = {
            ...payloadCommon,
            // ensure NOT NULL nama (use input or fallback already in derivedName)
            nama: derivedName,
            image_url_1: urls[0] || null,
            image_url_2: urls[1] || null,
            image_url_3: urls[2] || null,
          }
          const { error } = editingItem
            ? await supabase.from('pengurus').update(payload).eq('id', (editingItem as PengurusWithImages).id)
            : await supabase.from('pengurus').insert(payload)
          if (error) throw new Error(error.message)
        } else {
          // Core and other non-division roles: no image uploaded and no image_url column
          const payload = {
            ...payloadCommon,
            nama: derivedName,
          }
          const { error } = editingItem
            ? await supabase.from('pengurus').update(payload).eq('id', editingItem.id)
            : await supabase.from('pengurus').insert(payload)
          if (error) throw new Error(error.message)
        }
      } else {
        const { nama_jabatan, urutan } = strukturForm
        if (!nama_jabatan?.trim() || !urutan?.trim()) {
          throw new Error('Nama Jabatan dan Urutan wajib diisi.')
        }
        const payload = { ...strukturForm, urutan: parseInt(urutan) }
        const { error } = editingItem
          ? await supabase.from('struktur_jabatan').update(payload).eq('id', editingItem.id)
          : await supabase.from('struktur_jabatan').insert(payload)
        if (error) throw new Error(error.message)
      }

      setMessage({ type: 'success', text: `Data berhasil ${editingItem ? 'diperbarui' : 'ditambahkan'}!` })
      onUpdate()
      closeModal()
    } catch (error) {
      console.error('Form submission error:', error)
      const msg = error instanceof Error ? error.message : typeof error === 'string' ? error : 'Terjadi kesalahan'
      setMessage({ type: 'error', text: msg })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    const table = activeTab === 'pengurus' ? 'pengurus' : 'struktur_jabatan'
    if (!confirm(`Apakah Anda yakin ingin menghapus item ini dari ${table}?`)) return

    setLoading(true)
    setMessage(null)
    try {
      const { error } = await supabase.from(table).delete().eq('id', id)
      if (error) throw new Error(error.message)
      setMessage({ type: 'success', text: 'Item berhasil dihapus!' })
      onUpdate()
    } catch (error) {
      console.error(`Error deleting from ${table}:`, error)
      const msg = error instanceof Error ? error.message : 'Gagal menghapus item.'
      setMessage({ type: 'error', text: msg })
    } finally {
      setLoading(false)
    }
  }

  // Single-image upload removed for core roles; division uses multi-upload via handleDivisionFilesSelect

  const handleDivisionFilesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    const images = files.filter(f => f.type.startsWith('image/')).slice(0, 3)
    const tooBig = images.find(f => f.size > 5 * 1024 * 1024)
    if (tooBig) {
      setMessage({ type: 'error', text: 'Setiap gambar maksimal 5MB!' })
      return
    }
    setSelectedImageFiles(images)
    // previews
    Promise.all(images.map(f => new Promise<string>((res) => { const r = new FileReader(); r.onload = ev => res(ev.target?.result as string); r.readAsDataURL(f) })))
      .then(setImagePreviews)
  }

  const renderTabs = () => (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <nav className="-mb-px flex space-x-6">
        <button onClick={() => setActiveTab('pengurus')} className={`flex items-center space-x-2 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'pengurus' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300 dark:hover:border-gray-600'}`}>
          <Users className="h-5 w-5" /> <span>Data Pengurus</span>
        </button>
        <button onClick={() => setActiveTab('struktur')} className={`flex items-center space-x-2 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'struktur' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300 dark:hover:border-gray-600'}`}>
          <Briefcase className="h-5 w-5" /> <span>Struktur Jabatan</span>
        </button>
      </nav>
    </div>
  )

  const renderPengurusTab = () => (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl">
      <div className="p-4 md:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-stretch gap-3 w-full sm:w-auto">
          <div className="relative">
            <select value={selectedPeriode} onChange={e => setSelectedPeriode(e.target.value)} className="appearance-none w-full sm:w-auto bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              {periodes.map(p => <option key={p} value={p}>{p === 'all' ? 'Semua Periode' : p}</option>)}
            </select>
            <ChevronsUpDown className="h-4 w-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          <div className="relative">
            <select value={selectedRoleType} onChange={e => setSelectedRoleType(e.target.value as 'all' | 'administrator' | 'member')}
              className="appearance-none w-full sm:w-auto bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">Semua Tipe</option>
              <option value="administrator">Administrator</option>
              <option value="member">Member</option>
            </select>
            <ChevronsUpDown className="h-4 w-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          <input
            type="text"
            value={searchPengurus}
            onChange={e => setSearchPengurus(e.target.value)}
            placeholder="Cari nama, email, jabatan..."
            className="w-full sm:w-64 px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-sm"
          />
        </div>
        <button onClick={() => openModal()} className="flex items-center justify-center w-full sm:w-auto px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800">
          <Plus className="w-5 h-5 mr-2" /> Tambah Pengurus
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700/50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nama</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Jabatan</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Periode</th>
              <th scope="col" className="relative px-6 py-3"><span className="sr-only">Edit</span></th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredPengurus.map(p => (
              <tr key={p.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                    <Image
                      src={p.image_url || `https://ui-avatars.com/api/?name=${p.nama}&background=random`}
                      alt={p.nama}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{p.nama}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{p.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{strukturJabatan.find(j => j.id === p.jabatan_id)?.nama_jabatan}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{p.periode}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button onClick={() => openModal(p)} className="p-1 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-200"><Edit className="h-5 w-5" /></button>
                  <button onClick={() => handleDelete(p.id)} className="p-1 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200"><Trash2 className="h-5 w-5" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  const renderStrukturTab = () => (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl">
       <div className="p-4 md:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gray-200 dark:border-gray-700">
        <input
          type="text"
          value={searchStruktur}
          onChange={e => setSearchStruktur(e.target.value)}
          placeholder="Cari nama jabatan..."
          className="w-full sm:w-72 px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-sm"
        />
        <button onClick={() => openModal()} className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800">
          <Plus className="w-5 h-5 mr-2" /> Tambah Jabatan
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700/50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nama Jabatan</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Urutan</th>
              <th scope="col" className="relative px-6 py-3"><span className="sr-only">Edit</span></th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredStruktur.sort((a, b) => a.urutan - b.urutan).map(s => (
              <tr key={s.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{s.nama_jabatan}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{s.urutan}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button onClick={() => openModal(s)} className="p-1 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-200"><Edit className="h-5 w-5" /></button>
                  <button onClick={() => handleDelete(s.id)} disabled={pengurus.some(p => p.jabatan_id === s.id)} className="p-1 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200 disabled:text-gray-400 disabled:cursor-not-allowed"><Trash2 className="h-5 w-5" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  const renderModal = () => (
    <Transition appear show={isModalOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                  {editingItem ? `Edit ${activeTab === 'pengurus' ? 'Pengurus' : 'Jabatan'}` : `Tambah ${activeTab === 'pengurus' ? 'Pengurus' : 'Jabatan'}`}
                </Dialog.Title>
                <form onSubmit={handleFormSubmit} className="mt-4 space-y-4">
                  {activeTab === 'pengurus' ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(() => {
                          const selectedJabatan = strukturJabatan.find(j => j.id === parseInt(pengurusForm.jabatan_id || '0'))
                          const name = (selectedJabatan?.nama_jabatan || '').toLowerCase()
                          const isDivision = name.startsWith('divisi') || name.startsWith('devisi')
                          if (isDivision) {
                            return (
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nama (otomatis)</label>
                                <input
                                  type="text"
                                  value={`Ketua Divisi : ${pengurusForm.ketua_divisi || ''}${pengurusForm.ketua_divisi && pengurusForm.anggota_divisi ? ' ' : ''}${pengurusForm.anggota_divisi ? `Anggota : ${pengurusForm.anggota_divisi}` : ''}`}
                                  readOnly
                                  className="mt-1 w-full p-2 border rounded-md bg-gray-100 dark:bg-gray-700/60 dark:border-gray-600 text-gray-600 dark:text-gray-300"
                                />
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Nama akan disimpan dari isian Ketua Divisi dan Anggota.</p>
                              </div>
                            )
                          }
                          return (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nama Lengkap</label>
                              <input
                                type="text"
                                value={pengurusForm.nama}
                                onChange={e => setPengurusForm({ ...pengurusForm, nama: e.target.value })}
                                className="mt-1 w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
                                required
                                placeholder="Contoh: Nama Lengkap"
                              />
                            </div>
                          )
                        })()}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Jabatan</label>
                          <select value={pengurusForm.jabatan_id} onChange={e => setPengurusForm({...pengurusForm, jabatan_id: e.target.value})} className="mt-1 w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600" required>
                            <option value="">Pilih Jabatan</option>
                            {strukturJabatan.map(j => <option key={j.id} value={j.id}>{j.nama_jabatan}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Periode</label>
                          <input type="text" value={pengurusForm.periode} onChange={e => setPengurusForm({...pengurusForm, periode: e.target.value})} className="mt-1 w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600" required />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tipe</label>
                          <select value={pengurusForm.role_type} onChange={e => setPengurusForm({...pengurusForm, role_type: e.target.value as 'administrator' | 'member'})} className="mt-1 w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600" required>
                            <option value="administrator">Administrator (Ditampilkan)</option>
                            <option value="member">Member (Tidak ditampilkan)</option>
                          </select>
                        </div>
                        {/* Instagram hidden for core roles and divisions */}
                        {(() => {
                          const selectedJabatan = strukturJabatan.find(j => j.id === parseInt(pengurusForm.jabatan_id || '0'))
                          const name = (selectedJabatan?.nama_jabatan || '').toLowerCase()
                          const coreNames = new Set(['kepala sekolah','wakil ketua umum','sekretaris','bendahara','ketua umum','pembina','pengelola'])
                          const isCoreRole = coreNames.has(name)
                          const isDivision = name.startsWith('divisi') || name.startsWith('devisi')
                          return (!isCoreRole && !isDivision) ? (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Instagram (opsional)</label>
                              <input type="text" value={pengurusForm.instagram} onChange={e => setPengurusForm({...pengurusForm, instagram: e.target.value})} className="mt-1 w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600" />
                            </div>
                          ) : null
                        })()}
                        {/* Division-specific name helpers */}
                        {(() => {
                          const selectedJabatan = strukturJabatan.find(j => j.id === parseInt(pengurusForm.jabatan_id || '0'))
                          const name = (selectedJabatan?.nama_jabatan || '').toLowerCase()
                          const isDivision = name.startsWith('divisi') || name.startsWith('devisi')
                          if (!isDivision) return null
                          return (
                            <>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Ketua Divisi</label>
                                <input
                                  type="text"
                                  value={pengurusForm.ketua_divisi}
                                  onChange={e => setPengurusForm({ ...pengurusForm, ketua_divisi: e.target.value })}
                                  className="mt-1 w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
                                  placeholder="Contoh: Vania Raisya Madhani"
                                />
                              </div>
                              <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Anggota</label>
                                <textarea
                                  value={pengurusForm.anggota_divisi}
                                  onChange={e => setPengurusForm({ ...pengurusForm, anggota_divisi: e.target.value })}
                                  rows={3}
                                  className="mt-1 w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
                                  placeholder={"Pisahkan dengan koma atau baris baru.\nContoh:\nAnisa Trimulyani, Alfis Asmadi, Stellina Ratisah Azzahra, Indah Aqila Dwianti"}
                                />
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Hasil akan disimpan sebagai: &quot;Ketua Divisi : [ketua] Anggota : [anggota dipisah spasi]&quot;</p>
                              </div>
                            </>
                          )
                        })()}
                      </div>
                      {(() => {
                        const selectedJabatan = strukturJabatan.find(j => j.id === parseInt(pengurusForm.jabatan_id || '0'))
                        const name = (selectedJabatan?.nama_jabatan || '').toLowerCase()
                        const coreNames = new Set(['kepala sekolah','wakil ketua umum','sekretaris','bendahara','ketua umum','pembina','pengelola'])
                        const isCoreRole = coreNames.has(name)
                        const isDivision = name.startsWith('divisi') || name.startsWith('devisi')
                        if (isCoreRole) return null
                        if (isDivision) {
                          return (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Foto Divisi (1–3 gambar)</label>
                              <div className="mt-1 flex items-center gap-4 flex-wrap">
                                {imagePreviews.map((src, idx) => (
                                  <Image key={idx} src={src} alt={`Preview ${idx+1}`} width={96} height={96} className="h-24 w-24 rounded object-cover" />
                                ))}
                                <label htmlFor="files-upload" className="relative cursor-pointer bg-white dark:bg-gray-700 py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600">
                                  <span>{uploadingImage ? 'Mengupload...' : 'Pilih 1–3 Gambar'}</span>
                                  <input id="files-upload" name="files-upload" type="file" className="sr-only" onChange={handleDivisionFilesSelect} accept="image/*" multiple disabled={uploadingImage} />
                                </label>
                              </div>
                            </div>
                          )
                        }
                        return null
                      })()}
                    </div>
                  ) : (
                    <div className="space-y-4">
                       <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nama Jabatan</label>
                          <input type="text" value={strukturForm.nama_jabatan} onChange={e => setStrukturForm({...strukturForm, nama_jabatan: e.target.value})} className="mt-1 w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600" required />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Urutan</label>
                          <input type="number" value={strukturForm.urutan} onChange={e => setStrukturForm({...strukturForm, urutan: e.target.value})} className="mt-1 w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600" required />
                        </div>
                    </div>
                  )}
                  <div className="flex justify-end space-x-2 pt-4">
                    <button type="button" onClick={closeModal} className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600">
                      Batal
                    </button>
                    <button type="submit" disabled={loading || uploadingImage} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center">
                      {loading ? 'Menyimpan...' : <><Save className="h-4 w-4 mr-2"/>Simpan</>}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )

  return (
    <div className="bg-gray-50 dark:bg-gray-900/50 p-4 sm:p-6 rounded-2xl shadow-lg">
      {message && (
        <div className={`p-4 rounded-lg text-sm mb-4 ${message.type === 'success' ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300'}`}>
          {message.text}
        </div>
      )}

      <div className="mb-2 flex items-center gap-3">
        <AdminLogo size="sm" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Pengurus & Jabatan</h2>
      </div>

      {renderTabs()}

      <div className="mt-6">
        {activeTab === 'pengurus' ? renderPengurusTab() : renderStrukturTab()}
      </div>
      
      {renderModal()}
    </div>
  )
}
