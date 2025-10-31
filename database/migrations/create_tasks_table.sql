-- Script SQL para crear la tabla de tareas en Supabase
-- Ejecuta este script en el SQL Editor de tu proyecto Supabase

-- Crear tabla de tareas
CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  time TEXT,
  category TEXT,
  priority TEXT, -- 'high', 'medium', 'low'
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes si existen (para poder re-ejecutar el script)
DROP POLICY IF EXISTS "Users can view own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can insert own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can update own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can delete own tasks" ON tasks;

-- Política: Los usuarios solo pueden leer sus propias tareas
CREATE POLICY "Users can view own tasks" ON tasks
  FOR SELECT USING (auth.uid() = user_id);

-- Política: Los usuarios solo pueden insertar sus propias tareas
CREATE POLICY "Users can insert own tasks" ON tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Política: Los usuarios solo pueden actualizar sus propias tareas
CREATE POLICY "Users can update own tasks" ON tasks
  FOR UPDATE USING (auth.uid() = user_id);

-- Política: Los usuarios solo pueden eliminar sus propias tareas
CREATE POLICY "Users can delete own tasks" ON tasks
  FOR DELETE USING (auth.uid() = user_id);

-- Crear índices para mejorar el rendimiento en búsquedas por fecha y usuario
CREATE INDEX IF NOT EXISTS tasks_user_date_idx ON tasks(user_id, date);
CREATE INDEX IF NOT EXISTS tasks_date_idx ON tasks(date);
CREATE INDEX IF NOT EXISTS tasks_completed_idx ON tasks(completed);

