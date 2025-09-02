'use client'

import { useState, useEffect } from 'react'
import { supabase, type Pengurus, type StrukturJabatan, type Kegiatan } from '@/lib/supabase'
import { OrganizationManager } from '@/components/admin/OrganizationManager'
import { KegiatanManager } from '@/components/admin/KegiatanManager'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'organization' | 'kegiatan'>('organization')
  const [pengurus, setPengurus] = useState<Pengurus[]>([])
  const [strukturJabatan, setStrukturJabatan] = useState<StrukturJabatan[]>([])
  const [kegiatan, setKegiatan] = useState<Kegiatan[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    try {
      // Fetch pengurus with jabatan using explicit join
      const { data: pengurusData } = await supabase
        .from('pengurus')
        .select('*')
        .order('periode', { ascending: false })

      // Fetch struktur jabatan
      const { data: strukturData } = await supabase
        .from('struktur_jabatan')
        .select('*')
        .order('urutan')

      // Fetch kegiatan
      const { data: kegiatanData } = await supabase
        .from('kegiatan')
        .select('*')
        .order('created_at', { ascending: false })

      setPengurus(pengurusData || [])
      setStrukturJabatan(strukturData || [])
      setKegiatan(kegiatanData || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'kegiatan', label: 'Kegiatan', icon: '🖼️' },
    { id: 'organization', label: 'Pengurus & Jabatan', icon: '👥' },
  ] as const

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 bg-white dark:bg-gray-900 transition-colors">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-200 dark:border-blue-900 border-t-blue-600 dark:border-t-blue-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 shadow-sm">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-2xl">👥</div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Total Pengurus
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {pengurus.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 shadow-sm">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-2xl">🖼️</div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Total Post Kegiatan
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {kegiatan.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
        <div className="px-3 pt-3">
          <nav className="flex flex-wrap gap-2" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-gray-700'
                } inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-6">
          {activeTab === 'organization' && (
            <OrganizationManager 
              pengurus={pengurus}
              strukturJabatan={strukturJabatan}
              onUpdate={fetchAllData}
            />
          )}
          
          {activeTab === 'kegiatan' && (
            <KegiatanManager kegiatan={kegiatan} onUpdate={fetchAllData} />
          )}
        </div>
      </div>
    </div>
  )
}
