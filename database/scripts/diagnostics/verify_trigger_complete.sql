-- Script para verificar COMPLETAMENTE que el trigger está funcionando
-- Ejecuta esto en el SQL Editor de Supabase

-- 1. Verificar que el trigger existe y está activo
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  event_object_schema,
  action_timing,
  action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- 2. Ver detalles de la función
SELECT 
  routine_name,
  routine_type,
  security_type,
  data_type as return_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name = 'handle_new_user';

-- 3. Ver la definición completa de la función
SELECT pg_get_functiondef(oid) as function_definition
FROM pg_proc
WHERE proname = 'handle_new_user'
AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');

-- 4. Si el trigger NO aparece en la query 1, créalo con esto:
/*
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
*/

-- 5. Verificar que la tabla profiles existe y tiene la estructura correcta
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'profiles'
ORDER BY ordinal_position;

