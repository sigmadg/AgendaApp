-- Script completo para limpiar y asegurar que el registro funcione
-- Ejecuta este script en el SQL Editor de Supabase

-- 1. Eliminar el trigger si existe
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 2. Eliminar la función del trigger si existe
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 3. Verificar que la tabla profiles existe y tiene la estructura correcta
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles'
  ) THEN
    CREATE TABLE profiles (
      id UUID REFERENCES auth.users(id) PRIMARY KEY,
      name TEXT,
      email TEXT,
      avatar_url TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  END IF;
END $$;

-- 4. Asegurar que RLS esté habilitado
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 5. Eliminar todas las políticas existentes
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- 6. Crear las políticas RLS correctas
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- 7. Crear índice si no existe
CREATE INDEX IF NOT EXISTS profiles_email_idx ON profiles(email);

-- 8. Verificar estado final
SELECT 
  'Trigger eliminado: ' || 
  CASE WHEN EXISTS (
    SELECT 1 FROM information_schema.triggers 
    WHERE trigger_name = 'on_auth_user_created'
  ) THEN 'NO ❌' ELSE 'SÍ ✅' END as trigger_status,
  'Función eliminada: ' ||
  CASE WHEN EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public' 
    AND p.proname = 'handle_new_user'
  ) THEN 'NO ❌' ELSE 'SÍ ✅' END as function_status,
  'Tabla profiles: ' ||
  CASE WHEN EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles'
  ) THEN 'EXISTE ✅' ELSE 'NO EXISTE ❌' END as table_status,
  'RLS habilitado: ' ||
  CASE WHEN (
    SELECT rowsecurity FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'profiles'
  ) THEN 'SÍ ✅' ELSE 'NO ❌' END as rls_status;

