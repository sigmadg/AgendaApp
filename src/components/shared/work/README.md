# Componentes de Trabajo - AgendaApp

Esta carpeta contiene componentes específicos para la sección de trabajo de la aplicación, diseñados para gestionar tareas, proyectos, objetivos y planificación laboral.

## 📁 Estructura

```
work/
├── TaskCard.js              # Tarjeta de tarea individual
├── ProjectCard.js           # Tarjeta de proyecto
├── GoalCard.js              # Tarjeta de objetivo
├── WorkPlanningCard.js      # Tarjeta de planificación
└── README.md                # Esta documentación
```

## 🎨 Componentes Disponibles

### 1. TaskCard
Tarjeta reutilizable para mostrar tareas individuales con estado, prioridad y acciones.

**Props:**
- `task` (object): Objeto de tarea con propiedades
- `onToggle` (function): Función al marcar/desmarcar tarea
- `onEdit` (function): Función al editar tarea
- `onDelete` (function): Función al eliminar tarea
- `onAddNotes` (function): Función al agregar notas
- `theme` (string): Tema visual (desert, ocean, forest, mountain, neutral)
- `size` (string): Tamaño (small, medium, large)
- `variant` (string): Variante (default, completed, overdue, urgent)

**Estructura del objeto task:**
```javascript
{
  id: 1,
  title: 'Revisar emails',
  date: '2024-01-15',
  notes: 'Responder emails urgentes',
  completed: false,
  priority: 'high', // high, medium, low
  urgent: false,
  overdue: false,
}
```

**Ejemplo:**
```jsx
<TaskCard
  task={task}
  onToggle={handleTaskToggle}
  onEdit={handleTaskEdit}
  onDelete={handleTaskDelete}
  onAddNotes={handleTaskNotes}
  theme="desert"
  size="medium"
  variant="default"
/>
```

### 2. ProjectCard
Tarjeta reutilizable para mostrar proyectos con progreso, metas y acciones.

**Props:**
- `project` (object): Objeto de proyecto
- `onEdit` (function): Función al editar proyecto
- `onDelete` (function): Función al eliminar proyecto
- `onViewGoals` (function): Función al ver metas
- `onAddGoal` (function): Función al agregar meta
- `theme` (string): Tema visual
- `size` (string): Tamaño
- `variant` (string): Variante (default, active, completed, on-hold)

**Estructura del objeto project:**
```javascript
{
  id: 1,
  title: 'Sistema de Gestión',
  description: 'Desarrollo de sistema interno',
  deadline: '2024-03-15',
  progress: 75,
  status: 'active', // active, completed, on-hold
  goals: [
    { id: 1, title: 'Diseño de base de datos', completed: true },
    { id: 2, title: 'Desarrollo de API', completed: true },
  ],
}
```

**Ejemplo:**
```jsx
<ProjectCard
  project={project}
  onEdit={handleProjectEdit}
  onDelete={handleProjectDelete}
  onViewGoals={handleProjectGoals}
  onAddGoal={handleProjectAddGoal}
  theme="desert"
  size="medium"
  variant="active"
/>
```

### 3. GoalCard
Tarjeta reutilizable para mostrar objetivos con fechas, personas y acciones.

**Props:**
- `goal` (object): Objeto de objetivo
- `onToggle` (function): Función al marcar/desmarcar objetivo
- `onEdit` (function): Función al editar objetivo
- `onDelete` (function): Función al eliminar objetivo
- `onAddPerson` (function): Función al agregar persona
- `onAddDate` (function): Función al agregar fecha
- `theme` (string): Tema visual
- `size` (string): Tamaño
- `variant` (string): Variante (default, completed, overdue, urgent)

**Estructura del objeto goal:**
```javascript
{
  id: 1,
  title: 'Completar certificación',
  date: '2024-02-15',
  person: 'Juan Pérez',
  completed: false,
  priority: 'high',
  urgent: false,
  overdue: false,
}
```

**Ejemplo:**
```jsx
<GoalCard
  goal={goal}
  onToggle={handleGoalToggle}
  onEdit={handleGoalEdit}
  onDelete={handleGoalDelete}
  onAddPerson={handleGoalAddPerson}
  onAddDate={handleGoalAddDate}
  theme="desert"
  size="medium"
  variant="default"
/>
```

### 4. WorkPlanningCard
Tarjeta reutilizable para mostrar datos de planificación laboral.

**Props:**
- `data` (object): Objeto de datos de planificación
- `onViewDetails` (function): Función al ver detalles
- `theme` (string): Tema visual
- `size` (string): Tamaño
- `variant` (string): Variante (default, productivity, progress, goals, time)

**Estructura del objeto data:**
```javascript
// Para variant="productivity"
{
  tasksCompleted: 8,
  totalTasks: 12,
  efficiency: 75,
  focusTime: 6.5,
}

// Para variant="progress"
{
  day: 'Lunes',
  tasks: 8,
  completed: 6,
  hours: 8.5,
}

// Para variant="goals"
{
  title: 'Completar proyecto principal',
  progress: 75,
  deadline: '2024-01-31',
}

// Para variant="time"
{
  totalHours: 38.9,
  averagePerDay: 7.8,
  mostProductiveDay: 'Miércoles',
  leastProductiveDay: 'Jueves',
}
```

**Ejemplo:**
```jsx
<WorkPlanningCard
  data={workPlanningData.productivity}
  onViewDetails={handlePlanningViewDetails}
  theme="desert"
  size="medium"
  variant="productivity"
/>
```

## 🎨 Temas Disponibles

### Desert (Desierto) - Tema por defecto para trabajo
- **Colores**: Marrón desierto (#8B4513, #D2691E)
- **Uso**: Sección de trabajo, tierra
- **Características**: Colores cálidos, terrosos

### Ocean (Océano)
- **Colores**: Azul oceánico (#1E3A8A, #4A90E2)
- **Uso**: Sección de educación, agua
- **Características**: Colores azules, tranquilos

### Forest (Bosque)
- **Colores**: Verde bosque (#2D5016, #4A7C59)
- **Uso**: Sección de salud, naturaleza
- **Características**: Colores naturales, orgánicos

### Mountain (Montaña)
- **Colores**: Azul montaña (#1E3A5F, #4A6B8A)
- **Uso**: Sección de salud, altitud
- **Características**: Colores fríos, estables

### Neutral (Neutral)
- **Colores**: Gris neutro (#6C757D, #ADB5BD)
- **Uso**: Sección general, profesional
- **Características**: Colores neutros, profesionales

## 📏 Tamaños Disponibles

### Small (Pequeño)
- **Padding**: 8-12px
- **Font Size**: 12-14px
- **Icon Size**: 16-20px
- **Uso**: Elementos compactos, listas

### Medium (Mediano)
- **Padding**: 12-16px
- **Font Size**: 14-16px
- **Icon Size**: 20-24px
- **Uso**: Elementos estándar, tarjetas

### Large (Grande)
- **Padding**: 16-20px
- **Font Size**: 16-18px
- **Icon Size**: 24-28px
- **Uso**: Elementos destacados, encabezados

## 🎯 Variantes Disponibles

### TaskCard Variants
- **default**: Tarea normal
- **completed**: Tarea completada
- **overdue**: Tarea vencida
- **urgent**: Tarea urgente

### ProjectCard Variants
- **default**: Proyecto planificado
- **active**: Proyecto activo
- **completed**: Proyecto completado
- **on-hold**: Proyecto en pausa

### GoalCard Variants
- **default**: Objetivo normal
- **completed**: Objetivo completado
- **overdue**: Objetivo vencido
- **urgent**: Objetivo urgente

### WorkPlanningCard Variants
- **default**: Datos generales
- **productivity**: Datos de productividad
- **progress**: Datos de progreso
- **goals**: Datos de metas
- **time**: Datos de tiempo

## 🚀 Uso en la Aplicación

### Importar componentes
```jsx
import { TaskCard, ProjectCard, GoalCard, WorkPlanningCard } from '../shared';
```

### Usar en WorkSections
```jsx
// Reemplazar tarjetas de tareas existentes
{dailyTasks.map((task) => (
  <TaskCard
    key={task.id}
    task={task}
    onToggle={handleTaskToggle}
    onEdit={handleTaskEdit}
    onDelete={handleTaskDelete}
    onAddNotes={handleTaskNotes}
    theme="desert"
    size="medium"
    variant={task.completed ? 'completed' : 'default'}
  />
))}

// Reemplazar tarjetas de proyectos existentes
{projects.map((project) => (
  <ProjectCard
    key={project.id}
    project={project}
    onEdit={handleProjectEdit}
    onDelete={handleProjectDelete}
    onViewGoals={handleProjectGoals}
    onAddGoal={handleProjectAddGoal}
    theme="desert"
    size="medium"
    variant={project.status}
  />
))}
```

## 🔧 Personalización

### Estilos personalizados
```jsx
<TaskCard
  task={task}
  style={{ marginBottom: 20 }}
  titleStyle={{ fontSize: 18 }}
  dateStyle={{ color: '#FF0000' }}
  theme="desert"
/>
```

### Temas personalizados
```jsx
// Crear tema personalizado para trabajo
const customWorkTheme = {
  backgroundColor: '#FFF8DC',
  borderColor: '#DDA0DD',
  titleColor: '#8B008B',
  dateColor: '#9370DB',
  priorityColor: '#8B008B',
  completedColor: '#32CD32',
  overdueColor: '#FF6347',
  urgentColor: '#FF1493',
};
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
npm test -- --testPathPattern=shared/work

# Tests de integración
npm run test:integration
```

### Ejemplos de uso
Ver `examples/WorkSectionsExample.js` para ejemplos completos de implementación.

## 📚 Documentación Adicional

- **Storybook**: Documentación interactiva de componentes
- **Figma**: Diseños y especificaciones visuales
- **Changelog**: Historial de cambios y versiones

## 🤝 Contribución

### Agregar nuevos componentes
1. Crear archivo en carpeta `work/`
2. Agregar estilos en `styles/`
3. Exportar en `index.js`
4. Documentar en este README
5. Agregar ejemplos en `examples/`

### Mejorar componentes existentes
1. Mantener compatibilidad hacia atrás
2. Agregar nuevas props opcionales
3. Documentar cambios
4. Actualizar ejemplos

---

**Desarrollado con ❤️ por el equipo de AgendaApp**
