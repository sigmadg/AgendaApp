# WorkSections - Sección de Trabajo Modular

Esta carpeta contiene la implementación modular de la sección de trabajo, separada en subsecciones independientes para mejor mantenibilidad y escalabilidad.

## 📁 Estructura

```
WorkSections/
├── index.js                    # Componente principal que orquesta las subsecciones
├── sections/                   # Subsecciones individuales
│   ├── DailyTasksSection.js    # Tareas diarias
│   ├── WeeklyTasksSection.js   # Tareas semanales
│   ├── ProjectsSection.js      # Proyectos
│   ├── GoalsSection.js         # Objetivos
│   └── WorkPlanningSection.js  # Planificación de trabajo
├── styles/                     # Estilos específicos
│   ├── workSectionsStyles.js   # Estilos del componente principal
│   ├── dailyTasksStyles.js     # Estilos de tareas diarias
│   ├── weeklyTasksStyles.js    # Estilos de tareas semanales
│   ├── projectsStyles.js        # Estilos de proyectos
│   ├── goalsStyles.js          # Estilos de objetivos
│   └── workPlanningStyles.js   # Estilos de planificación
├── utils/                      # Utilidades compartidas
│   └── workHelpers.js          # Funciones auxiliares
└── README.md                   # Esta documentación
```

## 🎯 Componentes Principales

### 1. WorkSections (index.js)
Componente principal que orquesta todas las subsecciones.

**Características:**
- Navegación entre subsecciones
- Gestión de estado global
- Tema unificado
- Props compartidas

**Props:**
- `selectedDate` (Date): Fecha seleccionada
- `events` (Array): Eventos del calendario
- `onAddEvent` (Function): Función para agregar eventos
- `onEditEvent` (Function): Función para editar eventos
- `onDeleteEvent` (Function): Función para eliminar eventos
- `onUpdateSection` (Function): Función para actualizar sección
- `user` (Object): Datos del usuario

### 2. DailyTasksSection
Gestiona las tareas diarias con funcionalidades específicas.

**Características:**
- Tareas con fecha y hora
- Estados: completada, urgente, vencida
- Prioridades: alta, media, baja
- Notas adicionales
- Resumen de productividad

**Funcionalidades:**
- Agregar tarea diaria
- Editar tarea existente
- Eliminar tarea
- Marcar como completada
- Agregar notas
- Filtros por estado

### 3. WeeklyTasksSection
Gestiona las tareas semanales con enfoque en planificación.

**Características:**
- Tareas con fecha específica
- Planificación semanal
- Seguimiento de progreso
- Resumen de completadas

**Funcionalidades:**
- Agregar tarea semanal
- Editar tarea existente
- Eliminar tarea
- Marcar como completada
- Agregar notas
- Vista de resumen

### 4. ProjectsSection
Gestiona proyectos con metas y seguimiento de progreso.

**Características:**
- Proyectos con descripción
- Fecha límite
- Progreso visual
- Metas del proyecto
- Estados: activo, completado, en pausa

**Funcionalidades:**
- Crear proyecto
- Editar proyecto
- Eliminar proyecto
- Agregar metas
- Ver metas
- Seguimiento de progreso

### 5. GoalsSection
Gestiona objetivos personales y profesionales.

**Características:**
- Objetivos con fecha límite
- Persona responsable
- Prioridades
- Estados: completado, vencido, urgente

**Funcionalidades:**
- Crear objetivo
- Editar objetivo
- Eliminar objetivo
- Agregar persona responsable
- Agregar fecha
- Seguimiento de progreso

### 6. WorkPlanningSection
Analiza la productividad y planificación laboral.

**Características:**
- Resumen de productividad
- Progreso semanal
- Metas mensuales
- Seguimiento de tiempo
- Estadísticas

**Funcionalidades:**
- Vista de productividad
- Análisis de progreso
- Metas mensuales
- Estadísticas de tiempo
- Resumen de eficiencia

## 🎨 Temas y Estilos

### Tema Desert (Por defecto)
- **Colores**: Marrón desierto (#8B4513, #D2691E)
- **Uso**: Sección de trabajo, tierra
- **Características**: Colores cálidos, terrosos

### Estilos Modulares
Cada subsección tiene sus propios estilos para:
- Componentes específicos
- Modales personalizados
- Formularios
- Tarjetas de resumen
- Navegación

## 🔧 Utilidades

### workHelpers.js
Funciones auxiliares para:
- Formateo de fechas y horas
- Colores de prioridad y estado
- Cálculos de progreso
- Validación de datos
- Filtrado y ordenamiento
- Generación de IDs

**Funciones principales:**
- `formatDate()`: Formateo de fechas
- `formatTime()`: Formateo de horas
- `getPriorityColor()`: Colores por prioridad
- `getStatusColor()`: Colores por estado
- `calculateProgress()`: Cálculo de progreso
- `isOverdue()`: Verificación de vencimiento
- `isUrgent()`: Verificación de urgencia
- `validateTask()`: Validación de tareas
- `validateProject()`: Validación de proyectos
- `validateGoal()`: Validación de objetivos

## 🚀 Uso

### Importar el componente principal
```jsx
import WorkSections from './components/WorkSections';

// En tu componente principal
<WorkSections
  selectedDate={selectedDate}
  events={events}
  onAddEvent={handleAddEvent}
  onEditEvent={handleEditEvent}
  onDeleteEvent={handleDeleteEvent}
  onUpdateSection={handleUpdateSection}
  user={user}
/>
```

### Usar subsecciones individualmente
```jsx
import DailyTasksSection from './components/WorkSections/sections/DailyTasksSection';

<DailyTasksSection
  selectedDate={selectedDate}
  events={events}
  onAddEvent={handleAddEvent}
  onEditEvent={handleEditEvent}
  onDeleteEvent={handleDeleteEvent}
  onUpdateSection={handleUpdateSection}
  user={user}
  theme="desert"
/>
```

## 📱 Responsive Design

Los componentes se adaptan automáticamente a diferentes tamaños de pantalla:

- **Mobile**: Tamaños pequeños, espaciado compacto
- **Tablet**: Tamaños medianos, espaciado estándar
- **Desktop**: Tamaños grandes, espaciado amplio

## 🧪 Testing

### Ejecutar tests
```bash
# Tests de componentes de trabajo
npm test -- --testPathPattern=WorkSections

# Tests de subsecciones
npm test -- --testPathPattern=WorkSections/sections

# Tests de utilidades
npm test -- --testPathPattern=WorkSections/utils
```

### Ejemplos de uso
Ver `examples/WorkSectionsExample.js` para ejemplos completos de implementación.

## 🔄 Migración

### Antes (Monolítico)
```jsx
// Un solo archivo con toda la lógica
const WorkSections = () => {
  // 5000+ líneas de código
  // Lógica mezclada
  // Difícil de mantener
};
```

### Después (Modular)
```jsx
// Componente principal que orquesta
const WorkSections = () => {
  // Lógica de navegación
  // Estado compartido
  // Fácil de mantener
};

// Subsecciones independientes
const DailyTasksSection = () => {
  // Lógica específica de tareas diarias
  // Fácil de testear
  // Reutilizable
};
```

## 📚 Documentación Adicional

- **Storybook**: Documentación interactiva de componentes
- **Figma**: Diseños y especificaciones visuales
- **Changelog**: Historial de cambios y versiones

## 🤝 Contribución

### Agregar nuevas subsecciones
1. Crear archivo en `sections/`
2. Agregar estilos en `styles/`
3. Exportar en `index.js`
4. Documentar en este README
5. Agregar tests

### Mejorar subsecciones existentes
1. Mantener compatibilidad hacia atrás
2. Agregar nuevas funcionalidades
3. Documentar cambios
4. Actualizar tests

### Agregar utilidades
1. Crear función en `utils/workHelpers.js`
2. Documentar función
3. Agregar tests
4. Exportar si es necesario

## 🎯 Ventajas de la Arquitectura Modular

### 1. Mantenibilidad
- **Código separado** por funcionalidad
- **Fácil localización** de bugs
- **Actualizaciones independientes**

### 2. Escalabilidad
- **Agregar nuevas subsecciones** sin afectar existentes
- **Reutilización** de componentes
- **Testing independiente**

### 3. Desarrollo
- **Equipos paralelos** pueden trabajar en diferentes subsecciones
- **Menos conflictos** de merge
- **Desarrollo más rápido**

### 4. Performance
- **Lazy loading** de subsecciones
- **Optimización independiente**
- **Menor bundle size**

---

**Desarrollado con ❤️ por el equipo de AgendaApp**
