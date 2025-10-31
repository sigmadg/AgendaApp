-- Script para solucionar el problema de registro definitivamente
-- Ejecuta este script en Supabase SQL Editor

-- ============================================
-- PARTE 1: Verificar y limpiar COMPLETAMENTE
-- ============================================

-- Eliminar TODOS los triggers en auth.users (por si hay alguno que no vimos)
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN 
    SELECT trigger_name 
    FROM information_schema.triggers 
    WHERE event_object_table = 'users' 
      AND event_object_schema = 'auth'
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS %I ON auth.users CASCADE', r.trigger_name);
    RAISE NOTICE 'Eliminado trigger: %', r.trigger_name;
  END LOOP;
END $$;

-- Eliminar TODAS las funciones relacionadas (en todos los schemas)
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS auth.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- ============================================
-- PARTE 2: Verificar estructura de profiles
-- ============================================

-- Asegurar que la tabla profiles existe y está correcta
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
    RAISE NOTICE 'Tabla profiles creada';
  END IF;
END $$;

-- ============================================
-- PARTE 3: Configurar políticas RLS correctamente
-- ============================================

-- Habilitar RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;

-- Crear políticas RLS (asegurarse de que permiten inserción durante el registro)
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- IMPORTANTE: Esta política debe permitir que el usuario se registre
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- ============================================
-- PARTE 4: Verificar constraints y foreign keys
-- ============================================

-- Verificar que la foreign key no esté bloqueando
SELECT
  conname as constraint_name,
  contype as constraint_type,
  pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint
WHERE conrelid = 'public.profiles'::regclass;

-- ============================================
-- PARTE 5: Verificación final
-- ============================================

SELECT 
  '✅ Verificación final:' as info,
  (SELECT COUNT(*) FROM information_schema.triggers 
   WHERE event_object_table = 'users' AND event_object_schema = 'auth') as triggers_en_auth_users,
  (SELECT COUNT(*) FROM pg_proc p
   JOIN pg_namespace n ON p.pronamespace = n.oid
   WHERE p.proname = 'handle_new_user') as funciones_handle_new_user,
  (SELECT COUNT(*) FROM information_schema.tables 
   WHERE table_schema = 'public' AND table_name = 'profiles') as tabla_profiles_existe,
  (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'profiles') as politicas_rls_count;

