-- Script completo de verificación y solución
-- Ejecuta TODO este script en Supabase SQL Editor

-- PASO 1: Verificar si el trigger existe
SELECT 
  'Trigger Status:' as info,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.triggers
      WHERE trigger_name = 'on_auth_user_created'
    ) THEN 'EXISTE - Necesita eliminarse'
    ELSE 'NO EXISTE - OK'
  END as status;

-- PASO 2: Eliminar el trigger si existe
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- PASO 3: Verificar que se eliminó (debe retornar 0 filas)
SELECT 
  trigger_name,
  event_object_table
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- PASO 4: Verificar la tabla profiles existe
SELECT 
  'Tabla profiles:' as info,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = 'profiles'
    ) THEN 'EXISTE'
    ELSE 'NO EXISTE'
  END as status;

-- PASO 5: Verificar políticas RLS
SELECT 
  policyname,
  cmd
FROM pg_policies
WHERE tablename = 'profiles';

