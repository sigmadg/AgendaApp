-- Script SQL para agregar el campo 'link' a la tabla class_schedules
-- Ejecuta este script en el SQL Editor de tu proyecto Supabase
-- Si la tabla ya existe pero no tiene el campo 'link', este script lo agregará

-- Agregar la columna 'link' si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'class_schedules' 
        AND column_name = 'link'
    ) THEN
        ALTER TABLE class_schedules 
        ADD COLUMN link TEXT;
        
        RAISE NOTICE 'Columna "link" agregada exitosamente a la tabla class_schedules';
    ELSE
        RAISE NOTICE 'La columna "link" ya existe en la tabla class_schedules';
    END IF;
END $$;

-- Verificar que la columna fue agregada
SELECT 
    'Verificación' as status,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'class_schedules' 
AND column_name = 'link';

