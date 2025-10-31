-- Script para verificar y reparar el trigger en Supabase
-- Ejecuta esto en el SQL Editor de Supabase

-- 1. Verificar si la tabla profiles existe
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'profiles'
) as profiles_table_exists;

-- 2. Verificar si la función handle_new_user existe
SELECT EXISTS (
  SELECT FROM pg_proc p
  JOIN pg_namespace n ON p.pronamespace = n.oid
  WHERE n.nspname = 'public' 
  AND p.proname = 'handle_new_user'
) as function_exists;

-- 3. Verificar si el trigger existe
SELECT EXISTS (
  SELECT FROM pg_trigger t
  JOIN pg_class c ON t.tgrelid = c.oid
  WHERE c.relname = 'users'
  AND t.tgname = 'on_auth_user_created'
) as trigger_exists;

-- 4. Recrear la función con mejor manejo de errores
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  BEGIN
    INSERT INTO public.profiles (id, name, email, created_at)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
      NEW.email,
      NOW()
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
  EXCEPTION WHEN OTHERS THEN
    -- Log el error pero no fallar el registro del usuario
    RAISE WARNING 'Error creating profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Asegurar que el trigger existe
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. Verificar las políticas RLS
SELECT * FROM pg_policies WHERE tablename = 'profiles';

