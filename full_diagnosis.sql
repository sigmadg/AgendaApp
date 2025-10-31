-- Diagnóstico completo del problema de registro
-- Ejecuta este script completo en Supabase SQL Editor

-- ============================================
-- PARTE 1: Verificar triggers y funciones
-- ============================================

-- Todos los triggers en auth.users
SELECT 
  trigger_name,
  event_manipulation,
  action_timing,
  action_statement
FROM information_schema.triggers
WHERE event_object_table = 'users'
  AND event_object_schema = 'auth';

-- Todas las funciones relacionadas con usuarios
SELECT 
  n.nspname as schema,
  p.proname as function_name,
  pg_get_functiondef(p.oid) as function_definition
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE p.proname LIKE '%user%' 
  OR p.proname LIKE '%profile%'
ORDER BY n.nspname, p.proname;

-- ============================================
-- PARTE 2: Verificar estructura de profiles
-- ============================================

-- Ver estructura completa de la tabla profiles
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'profiles'
ORDER BY ordinal_position;

-- Ver constraints de la tabla profiles
SELECT
  conname as constraint_name,
  contype as constraint_type,
  pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint
WHERE conrelid = 'public.profiles'::regclass;

-- ============================================
-- PARTE 3: Verificar políticas RLS
-- ============================================

SELECT 
  policyname,
  cmd,
  qual,
  with_check,
  roles
FROM pg_policies 
WHERE tablename = 'profiles'
ORDER BY policyname;

-- ============================================
-- PARTE 4: Verificar usuarios recientes
-- ============================================

SELECT 
  au.id,
  au.email,
  au.created_at,
  au.email_confirmed_at,
  CASE 
    WHEN p.id IS NULL THEN '❌ Sin perfil'
    ELSE '✅ Con perfil'
  END as profile_status
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE au.created_at > NOW() - INTERVAL '7 days'
ORDER BY au.created_at DESC;

-- ============================================
-- PARTE 5: Limpiar cualquier trigger/función residual
-- ============================================

-- Eliminar TODOS los triggers en auth.users (por si hay alguno residual)
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN 
    SELECT trigger_name 
    FROM information_schema.triggers 
    WHERE event_object_table = 'users' 
      AND event_object_schema = 'auth'
      AND trigger_name LIKE '%user%' OR trigger_name LIKE '%profile%'
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS %I ON auth.users CASCADE', r.trigger_name);
    RAISE NOTICE 'Eliminado trigger: %', r.trigger_name;
  END LOOP;
END $$;

-- Eliminar cualquier función handle_new_user residual
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS auth.handle_new_user() CASCADE;

-- ============================================
-- PARTE 6: Verificar estado final
-- ============================================

SELECT 
  'Triggers en auth.users: ' || COUNT(*)::text as status
FROM information_schema.triggers
WHERE event_object_table = 'users' 
  AND event_object_schema = 'auth';

SELECT 
  'Funciones handle_new_user: ' || COUNT(*)::text as status
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE p.proname = 'handle_new_user';

