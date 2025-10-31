-- Verificar configuración de autenticación en Supabase
-- Este script ayuda a diagnosticar problemas de registro

-- 1. Verificar si hay configuraciones de email que requieran confirmación
-- (Esto normalmente se verifica en el Dashboard, pero podemos ver usuarios sin confirmar)
SELECT 
  COUNT(*) as total_users,
  COUNT(CASE WHEN email_confirmed_at IS NOT NULL THEN 1 END) as confirmed_users,
  COUNT(CASE WHEN email_confirmed_at IS NULL THEN 1 END) as unconfirmed_users,
  COUNT(CASE WHEN banned_until IS NOT NULL THEN 1 END) as banned_users
FROM auth.users;

-- 2. Verificar usuarios recientes y su estado
SELECT 
  id,
  email,
  created_at,
  email_confirmed_at,
  last_sign_in_at,
  CASE 
    WHEN email_confirmed_at IS NULL THEN 'Pendiente de confirmación'
    WHEN banned_until IS NOT NULL THEN 'Usuario baneado'
    ELSE 'Usuario activo'
  END as status
FROM auth.users
ORDER BY created_at DESC
LIMIT 10;

-- 3. Verificar si hay múltiples intentos de registro fallidos
-- (Esto puede ayudar a identificar si es un problema sistemático)

