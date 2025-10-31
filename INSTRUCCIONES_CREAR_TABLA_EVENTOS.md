# 📋 Instrucciones para Crear la Tabla de Eventos en Supabase

## ⚠️ Error: "Could not find the table 'public.events'"

Este error significa que la tabla `events` no existe en tu base de datos de Supabase. Sigue estos pasos para crearla:

## 📝 Pasos a Seguir

### 1. Abre Supabase Dashboard
1. Ve a [https://supabase.com](https://supabase.com)
2. Inicia sesión en tu cuenta
3. Selecciona tu proyecto (el que tiene el ID: `rttjjxwsdbeltqxvlnfr`)

### 2. Abre el SQL Editor
1. En el menú lateral, haz clic en **"SQL Editor"** (ícono de base de datos con código)
2. O ve directamente a: `https://supabase.com/dashboard/project/rttjjxwsdbeltqxvlnfr/sql/new`

### 3. Ejecuta el Script SQL
1. Abre el archivo `create_events_table.sql` en tu editor de código
2. Copia **TODO el contenido** del archivo
3. Pégalo en el SQL Editor de Supabase
4. Haz clic en el botón **"Run"** o presiona `Ctrl+Enter` (o `Cmd+Enter` en Mac)

### 4. Verifica que Funcionó
Deberías ver un mensaje como:
- ✅ "Success. No rows returned"
- O una lista de mensajes indicando que las políticas se crearon

### 5. Vuelve a la App
1. Cierra el diálogo de agregar evento (si está abierto)
2. Intenta agregar un evento nuevamente
3. Debería funcionar correctamente

## 🔍 Verificar que la Tabla Existe (Opcional)

Si quieres verificar que la tabla se creó correctamente, ejecuta este query en el SQL Editor:

```sql
SELECT 
  table_name,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'events'
ORDER BY ordinal_position;
```

Deberías ver todas las columnas de la tabla `events`.

## ❗ Importante

- **NO copies los comentarios con `--`**, solo el código SQL puro
- Si ya ejecutaste el script antes, puedes ejecutarlo de nuevo (es idempotente)
- Asegúrate de estar en el proyecto correcto de Supabase

## 🆘 Si Sigues Teniendo Problemas

1. Verifica que estás en el proyecto correcto de Supabase
2. Verifica que las políticas RLS se crearon correctamente
3. Verifica que estás autenticado en la app
4. Revisa los logs en la consola de Supabase para ver si hay más errores

