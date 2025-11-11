-- Script SQL para crear la tabla de horarios de clases en Supabase
-- Ejecuta este script en el SQL Editor de tu proyecto Supabase

-- Crear tabla de horarios de clases
CREATE TABLE IF NOT EXISTS class_schedules (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  day TEXT NOT NULL, -- 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'
  time TEXT NOT NULL, -- '7:00 AM', '8:00 AM', etc.
  classroom TEXT,
  professor TEXT,
  duration INTEGER DEFAULT 60, -- duración en minutos
  link TEXT, -- link para unirse a la clase (Zoom, Meet, etc.)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE class_schedules ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes si existen (para poder re-ejecutar el script)
DROP POLICY IF EXISTS "Users can view own class schedules" ON class_schedules;
DROP POLICY IF EXISTS "Users can insert own class schedules" ON class_schedules;
DROP POLICY IF EXISTS "Users can update own class schedules" ON class_schedules;
DROP POLICY IF EXISTS "Users can delete own class schedules" ON class_schedules;

-- Política: Los usuarios solo pueden leer sus propios horarios de clases
CREATE POLICY "Users can view own class schedules" ON class_schedules
  FOR SELECT USING (auth.uid() = user_id);

-- Política: Los usuarios solo pueden insertar sus propios horarios de clases
CREATE POLICY "Users can insert own class schedules" ON class_schedules
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Política: Los usuarios solo pueden actualizar sus propios horarios de clases
CREATE POLICY "Users can update own class schedules" ON class_schedules
  FOR UPDATE USING (auth.uid() = user_id);

-- Política: Los usuarios solo pueden eliminar sus propios horarios de clases
CREATE POLICY "Users can delete own class schedules" ON class_schedules
  FOR DELETE USING (auth.uid() = user_id);

-- Crear índices para mejorar el rendimiento en búsquedas
CREATE INDEX IF NOT EXISTS class_schedules_user_id_idx ON class_schedules(user_id);
CREATE INDEX IF NOT EXISTS class_schedules_day_idx ON class_schedules(day);
CREATE INDEX IF NOT EXISTS class_schedules_user_day_idx ON class_schedules(user_id, day);
CREATE INDEX IF NOT EXISTS class_schedules_user_day_time_idx ON class_schedules(user_id, day, time);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_class_schedules_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at automáticamente
DROP TRIGGER IF EXISTS update_class_schedules_updated_at_trigger ON class_schedules;
CREATE TRIGGER update_class_schedules_updated_at_trigger
  BEFORE UPDATE ON class_schedules
  FOR EACH ROW
  EXECUTE FUNCTION update_class_schedules_updated_at();

-- Verificación final
SELECT 
  'Tabla class_schedules creada exitosamente' as status,
  COUNT(*) as column_count
FROM information_schema.columns
WHERE table_name = 'class_schedules';

SELECT 
  'Políticas RLS creadas' as status,
  COUNT(*) as policy_count
FROM pg_policies
WHERE tablename = 'class_schedules';

SELECT 
  'Índices creados' as status,
  COUNT(*) as index_count
FROM pg_indexes
WHERE tablename = 'class_schedules';

