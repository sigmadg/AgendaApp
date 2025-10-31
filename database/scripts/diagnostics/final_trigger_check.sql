-- Script FINAL para verificar y eliminar el trigger
-- Ejecuta esto en Supabase SQL Editor

-- 1. Verificar si el trigger existe
SELECT 
  trigger_name,
  event_object_table,
  action_timing
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- 2. Si aparece alguna fila arriba, el trigger EXISTE. Elimínalo con:
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 3. Verificar de nuevo que se eliminó (debe retornar 0 filas ahora)
SELECT 
  trigger_name
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

