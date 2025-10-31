-- Script para eliminar usuarios de prueba en Supabase
-- EJECUTA ESTO EN EL SQL EDITOR DE SUPABASE

-- ⚠️ ADVERTENCIA: Esto eliminará usuarios permanentemente
-- ⚠️ Los usuarios eliminados también eliminarán sus perfiles (ON DELETE CASCADE)

-- OPCIÓN 1: Eliminar un usuario específico por email
-- Descomenta y reemplaza el email:
-- DELETE FROM auth.users WHERE email = 'gabyordgue@gmail.com';

-- OPCIÓN 2: Eliminar todos los usuarios creados en las últimas 24 horas (usuarios de prueba)
-- Descomenta esta línea:
-- DELETE FROM auth.users WHERE created_at > NOW() - INTERVAL '24 hours';

-- OPCIÓN 3: Eliminar TODOS los usuarios (¡CUIDADO!)
-- Descomenta esta línea:
-- DELETE FROM auth.users;

-- OPCIÓN 4: Ver primero qué usuarios hay antes de eliminar
-- Ejecuta esto para ver todos los usuarios:
SELECT 
  id,
  email,
  created_at,
  email_confirmed_at,
  last_sign_in_at
FROM auth.users
ORDER BY created_at DESC;

-- Después de ver la lista, puedes eliminar usuarios específicos:
-- DELETE FROM auth.users WHERE id = 'UUID_DEL_USUARIO';

