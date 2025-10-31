-- Script de diagnóstico para el problema de registro
-- Ejecuta este script en Supabase SQL Editor

-- 1. Verificar que el trigger está realmente eliminado
SELECT 
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.triggers 
      WHERE trigger_name = 'on_auth_user_created'
    ) THEN '❌ TRIGGER AÚN EXISTE'
    ELSE '✅ Trigger eliminado correctamente'
  END as trigger_check;

-- 2. Verificar que la función está eliminada
SELECT 
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM pg_proc p
      JOIN pg_namespace n ON p.pronamespace = n.oid
      WHERE n.nspname = 'public' 
      AND p.proname = 'handle_new_user'
    ) THEN '❌ FUNCIÓN AÚN EXISTE'
    ELSE '✅ Función eliminada correctamente'
  END as function_check;

-- 3. Verificar usuarios recientes sin perfil
SELECT 
  au.id,
  au.email,
  au.created_at,
  CASE 
    WHEN p.id IS NULL THEN '❌ Sin perfil'
    ELSE '✅ Con perfil'
  END as profile_status
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE au.created_at > NOW() - INTERVAL '1 day'
ORDER BY au.created_at DESC
LIMIT 10;

-- 4. Verificar políticas RLS de profiles
SELECT 
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'profiles';

-- 5. Verificar si hay usuarios bloqueados o con problemas
SELECT 
  COUNT(*) as total_users,
  COUNT(CASE WHEN email_confirmed_at IS NULL THEN 1 END) as users_unconfirmed,
  COUNT(CASE WHEN banned_until IS NOT NULL THEN 1 END) as banned_users
FROM auth.users;

-- 6. Verificar configuración de email confirmations (si es posible)
-- Esto se verifica en el Dashboard de Supabase → Authentication → Settings

