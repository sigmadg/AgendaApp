-- Script SQL para crear la tabla de eventos en Supabase
-- Ejecuta este script en el SQL Editor de tu proyecto Supabase

-- Crear tabla de eventos
CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_name TEXT NOT NULL,
  date DATE NOT NULL,
  time TEXT,
  location TEXT,
  type TEXT,
  guests INTEGER,
  budget TEXT,
  notes TEXT,
  status TEXT,
  priority TEXT,
  progress INTEGER,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes si existen (para poder re-ejecutar el script)
DROP POLICY IF EXISTS "Users can view own events" ON events;
DROP POLICY IF EXISTS "Users can insert own events" ON events;
DROP POLICY IF EXISTS "Users can update own events" ON events;
DROP POLICY IF EXISTS "Users can delete own events" ON events;

-- Política: Los usuarios solo pueden leer sus propios eventos
CREATE POLICY "Users can view own events" ON events
  FOR SELECT USING (auth.uid() = user_id);

-- Política: Los usuarios solo pueden insertar sus propios eventos
CREATE POLICY "Users can insert own events" ON events
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Política: Los usuarios solo pueden actualizar sus propios eventos
CREATE POLICY "Users can update own events" ON events
  FOR UPDATE USING (auth.uid() = user_id);

-- Política: Los usuarios solo pueden eliminar sus propios eventos
CREATE POLICY "Users can delete own events" ON events
  FOR DELETE USING (auth.uid() = user_id);

-- Crear índice para mejorar el rendimiento en búsquedas por fecha y usuario
CREATE INDEX IF NOT EXISTS events_user_date_idx ON events(user_id, date);
CREATE INDEX IF NOT EXISTS events_date_idx ON events(date);

