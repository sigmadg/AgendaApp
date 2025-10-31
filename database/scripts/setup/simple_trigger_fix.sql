-- SOLUCIÓN SIMPLE: Deshabilitar el trigger completamente
-- Ejecuta esto en Supabase SQL Editor

-- 1. Eliminar el trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 2. Verificar que se eliminó (debe retornar 0 filas)
SELECT 
  trigger_name,
  event_object_table
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- Si retorna 0 filas, el trigger fue eliminado correctamente ✅

-- NOTA: El código de la aplicación creará los perfiles manualmente
-- después de que el usuario se registre exitosamente.

