-- Script para eliminar TODOS los usuarios de Supabase
-- ⚠️ CUIDADO: Esto eliminará TODOS los usuarios permanentemente
-- Ejecuta esto en el SQL Editor de Supabase

-- Primero, ver cuántos usuarios hay:
SELECT COUNT(*) as total_usuarios FROM auth.users;

-- Ver todos los usuarios antes de eliminar:
SELECT id, email, created_at FROM auth.users ORDER BY created_at DESC;

-- ⚠️ ELIMINAR TODOS LOS USUARIOS:
-- Descomenta la siguiente línea para ejecutar:
DELETE FROM auth.users;

-- Esto también eliminará automáticamente:
-- - Todos los perfiles en la tabla 'profiles' (por el FOREIGN KEY)
-- - Todas las sesiones y tokens relacionados

-- Después de eliminar, puedes verificar:
-- SELECT COUNT(*) FROM auth.users; -- Debería ser 0

