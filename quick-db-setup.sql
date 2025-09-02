-- Design Database Genbi System
-- Run this ENTIRE script in your Supabase SQL Editor

-- 1. Create tables (if not exists)
CREATE TABLE IF NOT EXISTS struktur_jabatan (
  id SERIAL PRIMARY KEY,
  nama_jabatan TEXT NOT NULL,
  urutan INT NOT NULL
);

CREATE TABLE IF NOT EXISTS pengurus (
  id SERIAL PRIMARY KEY,
  nama TEXT NOT NULL,
  jabatan_id INT REFERENCES struktur_jabatan(id),
  periode TEXT NOT NULL,
  image_url_1 TEXT,
  image_url_2 TEXT,
  image_url_3 TEXT
);

-- Add role_type to distinguish administrators (shown publicly) vs members (not shown)
ALTER TABLE pengurus
  ADD COLUMN IF NOT EXISTS role_type TEXT DEFAULT 'administrator' CHECK (role_type IN ('administrator','member'));

-- Removed: pik_r_submissions (PIK-R registration form not needed for Genbi)

-- Removed: migration helper for pik_r_submissions

-- Kegiatan: activities/news with up to 3 images
CREATE TABLE IF NOT EXISTS kegiatan (
  id SERIAL PRIMARY KEY,
  judul TEXT NOT NULL,
  deskripsi TEXT,
  tanggal DATE,
  image_url_1 TEXT,
  image_url_2 TEXT,
  image_url_3 TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE kegiatan
ADD COLUMN IF NOT EXISTS card_ratio TEXT
  CHECK (card_ratio IN ('landscape', 'insta_4_5', 'poster_2_3'))
  DEFAULT 'landscape';
-- Removed: form_control (not needed for Genbi)
-- Removed: Duta Genre tables (not needed for Genbi)

-- 2. Insert struktur_jabatan per requested mapping (IDs 1–12)
INSERT INTO struktur_jabatan (id, nama_jabatan, urutan) VALUES
  (1,  'Kepala Sekolah',                    1),
  (2,  'Pembina',                           2),
  (3,  'Pengelola',                         3),
  (4,  'Ketua Umum',                        4),
  (5,  'Wakil Ketua Umum',                  5),
  (6,  'Sekretaris',                        6),
  (7,  'Bendahara',                         7),
  (8,  'Divisi Pendidikan dan Kebudayaan',  8),
  (9,  'Divisi Pengabdian Masyarakat',      9),
  (10, 'Divisi Lingkungan Hidup',          10),
  (11, 'Divisi Publikasi dan Sosialisasi', 11),
  (12, 'Devisi Kewirausahaan',             12)
ON CONFLICT DO NOTHING;

-- 3. Sample pengurus intentionally omitted to avoid FK mismatches.
--    Fill via Admin UI or separate seed matching the IDs above.

-- 5. Enable RLS (Row Level Security)
ALTER TABLE struktur_jabatan ENABLE ROW LEVEL SECURITY;
ALTER TABLE pengurus ENABLE ROW LEVEL SECURITY;
ALTER TABLE kegiatan ENABLE ROW LEVEL SECURITY;

-- 6. Create policies for public access
DROP POLICY IF EXISTS "Allow public read access on struktur_jabatan" ON struktur_jabatan;
CREATE POLICY "Allow public read access on struktur_jabatan" ON struktur_jabatan FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read access on pengurus" ON pengurus;
CREATE POLICY "Allow public read access on pengurus" ON pengurus FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read access on kegiatan" ON kegiatan;
CREATE POLICY "Allow public read access on kegiatan" ON kegiatan FOR SELECT USING (true);

-- 7. Create policies for admin access
DROP POLICY IF EXISTS "Allow authenticated users full access on struktur_jabatan" ON struktur_jabatan;
CREATE POLICY "Allow authenticated users full access on struktur_jabatan" ON struktur_jabatan FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated users full access on pengurus" ON pengurus;
CREATE POLICY "Allow authenticated users full access on pengurus" ON pengurus FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated users full access on kegiatan" ON kegiatan;
CREATE POLICY "Allow authenticated users full access on kegiatan" ON kegiatan FOR ALL USING (auth.role() = 'authenticated');

-- 8. Verify data (Genbi scope)
SELECT 'struktur_jabatan' as table_name, COUNT(*) as count FROM struktur_jabatan
UNION ALL
SELECT 'pengurus' as table_name, COUNT(*) as count FROM pengurus
UNION ALL
SELECT 'kegiatan' as table_name, COUNT(*) as count FROM kegiatan;

-- 9. Test the join query
SELECT 
  p.*,
  s.nama_jabatan,
  s.urutan
FROM pengurus p
LEFT JOIN struktur_jabatan s ON p.jabatan_id = s.id
ORDER BY s.urutan;
