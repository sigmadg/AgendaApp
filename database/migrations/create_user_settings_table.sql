-- Script SQL para crear la tabla de configuraciones de usuario en Supabase
-- Ejecuta este script en el SQL Editor de tu proyecto Supabase

-- Crear tabla de configuraciones de usuario
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  
  -- Configuraciones de privacidad
  profile_visible BOOLEAN DEFAULT TRUE,
  show_name BOOLEAN DEFAULT TRUE,
  show_email BOOLEAN DEFAULT TRUE,
  share_data BOOLEAN DEFAULT FALSE,
  allow_analytics BOOLEAN DEFAULT TRUE,
  allow_notifications BOOLEAN DEFAULT TRUE,
  
  -- Secciones activas (JSONB para almacenar un objeto con las secciones)
  active_sections JSONB DEFAULT '{
    "personal": true,
    "work": true,
    "school": true,
    "health": true,
    "finance": true,
    "nutrition": true,
    "exercise": true,
    "language": true,
    "menstrual": true,
    "pet": true,
    "selfcare": true,
    "travel": true,
    "reading": true,
    "movies": true,
    "entrepreneurship": true
  }'::jsonb,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes si existen (para poder re-ejecutar el script)
DROP POLICY IF EXISTS "Users can view own settings" ON user_settings;
DROP POLICY IF EXISTS "Users can insert own settings" ON user_settings;
DROP POLICY IF EXISTS "Users can update own settings" ON user_settings;
DROP POLICY IF EXISTS "Users can delete own settings" ON user_settings;

-- Política: Los usuarios solo pueden leer sus propias configuraciones
CREATE POLICY "Users can view own settings" ON user_settings
  FOR SELECT USING (auth.uid() = user_id);

-- Política: Los usuarios solo pueden insertar sus propias configuraciones
CREATE POLICY "Users can insert own settings" ON user_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Política: Los usuarios solo pueden actualizar sus propias configuraciones
CREATE POLICY "Users can update own settings" ON user_settings
  FOR UPDATE USING (auth.uid() = user_id);

-- Política: Los usuarios solo pueden eliminar sus propias configuraciones
CREATE POLICY "Users can delete own settings" ON user_settings
  FOR DELETE USING (auth.uid() = user_id);

-- Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_user_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger para actualizar updated_at
DROP TRIGGER IF EXISTS update_user_settings_timestamp ON user_settings;
CREATE TRIGGER update_user_settings_timestamp
  BEFORE UPDATE ON user_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_user_settings_updated_at();

-- Crear índice para mejorar el rendimiento en búsquedas por usuario
CREATE INDEX IF NOT EXISTS user_settings_user_id_idx ON user_settings(user_id);

