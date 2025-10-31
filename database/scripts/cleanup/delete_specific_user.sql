-- Script para eliminar el usuario específico que se intentó registrar
-- Ejecuta esto en el SQL Editor de Supabase

-- Primero, ver si existe el usuario:
SELECT 
  id,
  email,
  created_at,
  email_confirmed_at
FROM auth.users 
WHERE email = 'gabyordgue@gmail.com';

-- Si el usuario existe, elimínalo (descomenta la siguiente línea):
-- DELETE FROM auth.users WHERE email = 'gabyordgue@gmail.com';

-- Para eliminar TODOS los usuarios de prueba creados hoy:
-- DELETE FROM auth.users WHERE created_at >= CURRENT_DATE;

-- Para ver TODOS los usuarios antes de eliminar:
-- SELECT id, email, created_at FROM auth.users ORDER BY created_at DESC;

