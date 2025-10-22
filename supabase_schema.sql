-- Esquema de base de datos para Cortexa App
-- Ejecutar este SQL en el editor SQL de Supabase

-- Habilitar RLS (Row Level Security)
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Tabla para datos de usuario
CREATE TABLE user_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejor rendimiento
CREATE INDEX idx_user_data_user_id ON user_data(user_id);
CREATE INDEX idx_user_data_updated_at ON user_data(updated_at);

-- Política RLS para user_data
CREATE POLICY "Users can only access their own data" ON user_data
  FOR ALL USING (auth.uid() = user_id);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at
CREATE TRIGGER update_user_data_updated_at
  BEFORE UPDATE ON user_data
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Tabla para logs de sincronización (opcional)
CREATE TABLE sync_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Política RLS para sync_logs
CREATE POLICY "Users can only access their own sync logs" ON sync_logs
  FOR ALL USING (auth.uid() = user_id);

-- Función para crear datos por defecto para nuevos usuarios
CREATE OR REPLACE FUNCTION create_default_user_data()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_data (user_id, data)
  VALUES (
    NEW.id,
    '{
      "work": {
        "priorities": [],
        "goals": [],
        "focus": [],
        "projects": [],
        "dailyTasks": []
      },
      "school": {
        "timetable": {},
        "tasks": {
          "academic": []
        },
        "projects": [],
        "exams": [],
        "materials": {
          "textbooks": [],
          "onlineResources": []
        },
        "classOverview": {
          "course": "",
          "time": "",
          "location": "",
          "instructor": "",
          "contactInfo": "",
          "officeHours": "",
          "accessInfo": "",
          "account": "",
          "login": "",
          "password": "",
          "importantDates": [],
          "notes": "",
          "gradingComponents": [],
          "targetGrade": "",
          "actualGrade": ""
        }
      },
      "health": {
        "meals": [],
        "water": { "goal": 8, "current": 0 },
        "exercise": [],
        "nutrition": {
          "recipes": [],
          "mealPlans": [],
          "shoppingList": []
        }
      },
      "personal": {
        "profile": {
          "name": "",
          "email": "",
          "avatar": null
        },
        "settings": {
          "activeSections": {
            "work": true,
            "school": true,
            "health": true,
            "personal": true
          }
        }
      }
    }'::jsonb
  );
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para crear datos por defecto cuando se registra un usuario
CREATE TRIGGER create_user_data_on_signup
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_default_user_data();

-- Función para obtener estadísticas del usuario (opcional)
CREATE OR REPLACE FUNCTION get_user_stats(user_uuid UUID)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'total_priorities', (
      SELECT COUNT(*)
      FROM jsonb_array_elements(data->'work'->'priorities')
    ),
    'total_goals', (
      SELECT COUNT(*)
      FROM jsonb_array_elements(data->'work'->'goals')
    ),
    'total_projects', (
      SELECT COUNT(*)
      FROM jsonb_array_elements(data->'work'->'projects')
    ),
    'total_tasks', (
      SELECT COUNT(*)
      FROM jsonb_array_elements(data->'school'->'tasks'->'academic')
    ),
    'last_updated', updated_at
  )
  INTO result
  FROM user_data
  WHERE user_id = user_uuid;
  
  RETURN COALESCE(result, '{}'::jsonb);
END;
$$ language 'plpgsql';

-- Vista para estadísticas de usuarios (opcional)
CREATE VIEW user_stats AS
SELECT 
  user_id,
  get_user_stats(user_id) as stats
FROM user_data;

-- Comentarios para documentación
COMMENT ON TABLE user_data IS 'Almacena todos los datos de la aplicación para cada usuario';
COMMENT ON TABLE sync_logs IS 'Registra las operaciones de sincronización para debugging';
COMMENT ON FUNCTION get_user_stats IS 'Obtiene estadísticas resumidas de un usuario';
