/**
 * Supabase client configuration and database utilities
 * Centralized database connection and helper functions
 */

import { createClient } from '@supabase/supabase-js'
import type {
  StrukturJabatan,
  Pengurus,
  FormControl,
  Kegiatan,
  ApiResponse
} from '@/types'

// Environment validation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

/**
 * Supabase client instance
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Centralized storage bucket name for public media
 */
export const MEDIA_BUCKET = 'genbi-media'

/**
 * Database helper functions
 */
export const db = {
  /**
   * Get all pengurus with their jabatan information
   */
  async getPengurus(): Promise<ApiResponse<Pengurus[]>> {
    try {
      const { data, error } = await supabase
        .from('pengurus')
        .select(`
          *,
          struktur_jabatan (*)
        `)
        .order('jabatan_id', { ascending: true })

      if (error) throw error
      return { data: data || [] }
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unknown error' }
    }
  },

  /**
   * Get all kegiatan
   */
  async getKegiatan(): Promise<ApiResponse<Kegiatan[]>> {
    try {
      const { data, error } = await supabase
        .from('kegiatan')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return { data: data || [] }
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unknown error' }
    }
  },

  /**
   * Get form control settings
   */
  async getFormControl(): Promise<ApiResponse<FormControl>> {
    try {
      const { data, error } = await supabase
        .from('form_control')
        .select('*')
        .single()

      if (error) throw error
      return { data }
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unknown error' }
    }
  },
}

// Re-export types for convenience
export type {
  StrukturJabatan,
  Pengurus,
  FormControl,
  Kegiatan
}

