# Base de Datos - Scripts SQL

Esta carpeta contiene todos los scripts SQL organizados por categoría para facilitar su mantenimiento y uso.

## 📁 Estructura de Carpetas

### `/migrations`
Scripts para crear las tablas y estructuras principales de la base de datos.

**Scripts disponibles:**
- `create_events_table.sql` - Crea la tabla de eventos con políticas RLS
- `create_tasks_table.sql` - Crea la tabla de tareas con políticas RLS
- `supabase_setup.sql` - Configuración inicial de Supabase (tabla profiles, RLS, triggers)

**Orden recomendado de ejecución:**
1. Primero ejecuta `supabase_setup.sql` para configurar la tabla de perfiles
2. Luego ejecuta `create_events_table.sql` para crear la tabla de eventos
3. Finalmente ejecuta `create_tasks_table.sql` para crear la tabla de tareas

### `/scripts/setup`
Scripts de configuración y corrección para resolver problemas comunes.

**Scripts disponibles:**
- `cleanup_complete.sql` - Limpieza completa de triggers y funciones relacionadas
- `DISABLE_TRIGGER.sql` - Deshabilita el trigger de creación de perfiles
- `disable_trigger_solution.sql` - Solución alternativa para deshabilitar trigger
- `fix_registration_issue.sql` - Corrige problemas de registro
- `fix_trigger_final.sql` - Solución final para problemas con triggers
- `simple_trigger_fix.sql` - Fix simple para triggers

### `/scripts/diagnostics`
Scripts de diagnóstico para verificar el estado de la base de datos.

**Scripts disponibles:**
- `check_auth_config.sql` - Verifica configuración de autenticación
- `check_trigger.sql` - Verifica estado de triggers
- `diagnose_registration.sql` - Diagnostica problemas de registro
- `final_trigger_check.sql` - Verificación final de triggers
- `full_diagnosis.sql` - Diagnóstico completo del sistema
- `verify_and_fix_complete.sql` - Verificación y corrección completa
- `verify_trigger_complete.sql` - Verificación completa de triggers

### `/scripts/cleanup`
Scripts para limpiar datos de prueba o usuarios específicos.

**Scripts disponibles:**
- `delete_all_users.sql` - Elimina todos los usuarios (¡CUIDADO!)
- `delete_specific_user.sql` - Elimina un usuario específico
- `delete_test_users.sql` - Elimina usuarios de prueba

## 🚀 Uso

### Para configurar la base de datos desde cero:

1. Ejecuta en el SQL Editor de Supabase:
   ```sql
   -- 1. Configuración inicial
   -- Ejecuta: database/migrations/supabase_setup.sql
   
   -- 2. Tabla de eventos
   -- Ejecuta: database/migrations/create_events_table.sql
   
   -- 3. Tabla de tareas
   -- Ejecuta: database/migrations/create_tasks_table.sql
   ```

### Para resolver problemas:

1. **Si tienes problemas de registro:**
   - Primero ejecuta: `database/scripts/diagnostics/check_trigger.sql`
   - Si el trigger está activo y causa problemas, ejecuta: `database/scripts/setup/DISABLE_TRIGGER.sql`

2. **Para limpiar usuarios de prueba:**
   - Ejecuta: `database/scripts/cleanup/delete_test_users.sql`

## ⚠️ Advertencias

- **NO ejecutes** `delete_all_users.sql` a menos que estés seguro de querer eliminar todos los usuarios
- Los scripts en `/scripts/setup` pueden modificar la estructura de la base de datos
- Siempre haz un backup antes de ejecutar scripts de limpieza o corrección

## 📝 Notas

- Todos los scripts de migración incluyen `IF NOT EXISTS` o `DROP IF EXISTS` para poder ejecutarlos múltiples veces sin errores
- Las políticas RLS están configuradas para que cada usuario solo pueda acceder a sus propios datos
- Los scripts están diseñados para Supabase/PostgreSQL

