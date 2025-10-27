# Componentes Compartidos - AgendaApp

Esta carpeta contiene componentes reutilizables que pueden ser utilizados en toda la aplicación para mantener consistencia en el diseño y funcionalidad.

## 📁 Estructura

```
shared/
├── headers/                    # Componentes de encabezados
│   └── SectionHeader.js        # Encabezado de sección reutilizable
├── navigation/                 # Componentes de navegación
│   └── SubsectionTabs.js       # Pestañas de subsecciones
├── ui/                        # Componentes de interfaz
│   ├── Button.js              # Botón reutilizable
│   └── Card.js                # Tarjeta reutilizable
├── work/                      # Componentes de trabajo
│   ├── TaskCard.js            # Tarjeta de tarea
│   ├── ProjectCard.js         # Tarjeta de proyecto
│   ├── GoalCard.js            # Tarjeta de objetivo
│   ├── WorkPlanningCard.js    # Tarjeta de planificación
│   └── README.md              # Documentación de trabajo
├── styles/                    # Estilos compartidos
│   ├── sectionHeaderStyles.js
│   ├── subsectionTabsStyles.js
│   ├── buttonStyles.js
│   ├── cardStyles.js
│   ├── taskCardStyles.js
│   ├── projectCardStyles.js
│   ├── goalCardStyles.js
│   └── workPlanningCardStyles.js
├── hooks/                     # Hooks personalizados
│   └── useTheme.js            # Hook de temas
├── examples/                  # Ejemplos de uso
│   ├── HealthSectionsExample.js
│   ├── HealthSectionsMigration.js
│   └── WorkSectionsExample.js
├── index.js                   # Exportaciones
└── README.md                  # Esta documentación
```

## 🎨 Componentes Disponibles

### 1. SectionHeader
Encabezado reutilizable para secciones con soporte para temas y tamaños.

**Props:**
- `title` (string): Título de la sección
- `subtitle` (string): Subtítulo opcional
- `icon` (string): Nombre del icono
- `image` (object): Imagen a mostrar
- `onAddPress` (function): Función al presionar botón agregar
- `theme` (string): Tema visual (forest, ocean, desert, mountain, neutral)
- `size` (string): Tamaño (small, medium, large)
- `showAddButton` (boolean): Mostrar botón agregar

**Ejemplo:**
```jsx
<SectionHeader
  title="Planificador de Comidas"
  subtitle="Organiza tu alimentación saludable"
  image={require('../../assets/salud.png')}
  onAddPress={handleAddMeal}
  theme="mountain"
  size="medium"
/>
```

### 2. SubsectionTabs
Pestañas de navegación para subsecciones con soporte para temas.

**Props:**
- `sections` (array): Array de secciones con id, name, icon
- `activeSection` (string): ID de la sección activa
- `onSectionChange` (function): Función al cambiar sección
- `theme` (string): Tema visual
- `size` (string): Tamaño
- `horizontal` (boolean): Orientación horizontal/vertical
- `showIcons` (boolean): Mostrar iconos
- `showLabels` (boolean): Mostrar etiquetas

**Ejemplo:**
```jsx
<SubsectionTabs
  sections={[
    { id: 'meal-planner', name: 'Planificador de Comidas', icon: 'restaurant-outline' },
    { id: 'recipes', name: 'Recetas', icon: 'book-outline' },
  ]}
  activeSection={activeSection}
  onSectionChange={setActiveSection}
  theme="mountain"
  size="medium"
/>
```

### 3. Button
Botón reutilizable con múltiples variantes y temas.

**Props:**
- `title` (string): Texto del botón
- `onPress` (function): Función al presionar
- `variant` (string): Variante (primary, secondary, outline, ghost, danger, success, warning)
- `size` (string): Tamaño (small, medium, large)
- `theme` (string): Tema visual
- `icon` (string): Nombre del icono
- `iconPosition` (string): Posición del icono (left, right)
- `loading` (boolean): Estado de carga
- `disabled` (boolean): Estado deshabilitado
- `fullWidth` (boolean): Ancho completo

**Ejemplo:**
```jsx
<Button
  title="Agregar Comida"
  onPress={handleAddMeal}
  variant="primary"
  size="small"
  theme="mountain"
  icon="add"
  iconPosition="left"
/>
```

### 4. Card
Tarjeta reutilizable para mostrar contenido.

**Props:**
- `children` (node): Contenido de la tarjeta
- `title` (string): Título de la tarjeta
- `subtitle` (string): Subtítulo opcional
- `icon` (string): Nombre del icono
- `onPress` (function): Función al presionar (opcional)
- `variant` (string): Variante (default, elevated, outlined, filled)
- `theme` (string): Tema visual
- `size` (string): Tamaño

**Ejemplo:**
```jsx
<Card
  title="Desayuno"
  subtitle="7:00 - 9:00 AM"
  icon="sunny-outline"
  theme="mountain"
  size="medium"
  onPress={handleCardPress}
>
  <Text>No planificado</Text>
  <Button
    title="Agregar Comida"
    onPress={handleAddMeal}
    variant="primary"
    size="small"
    theme="mountain"
  />
</Card>
```

### 5. TaskCard
Tarjeta reutilizable para mostrar tareas individuales con estado, prioridad y acciones.

**Props:**
- `task` (object): Objeto de tarea con propiedades
- `onToggle` (function): Función al marcar/desmarcar tarea
- `onEdit` (function): Función al editar tarea
- `onDelete` (function): Función al eliminar tarea
- `onAddNotes` (function): Función al agregar notas
- `theme` (string): Tema visual
- `size` (string): Tamaño
- `variant` (string): Variante (default, completed, overdue, urgent)

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

### 6. ProjectCard
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

### 7. GoalCard
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

### 8. WorkPlanningCard
Tarjeta reutilizable para mostrar datos de planificación laboral.

**Props:**
- `data` (object): Objeto de datos de planificación
- `onViewDetails` (function): Función al ver detalles
- `theme` (string): Tema visual
- `size` (string): Tamaño
- `variant` (string): Variante (default, productivity, progress, goals, time)

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

### 1. Forest (Bosque)
- **Colores**: Verde bosque (#2D5016, #4A7C59, #4A6741)
- **Uso**: Sección de salud, naturaleza
- **Características**: Colores naturales, orgánicos

### 2. Ocean (Océano)
- **Colores**: Azul oceánico (#1E3A8A, #4A90E2)
- **Uso**: Sección de educación, agua
- **Características**: Colores azules, tranquilos

### 3. Desert (Desierto)
- **Colores**: Marrón desierto (#8B4513, #D2691E)
- **Uso**: Sección de trabajo, tierra
- **Características**: Colores cálidos, terrosos

### 4. Mountain (Montaña)
- **Colores**: Azul montaña (#1E3A5F, #4A6B8A)
- **Uso**: Sección de salud, altitud
- **Características**: Colores fríos, estables

### 5. Neutral (Neutral)
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

## 🚀 Uso en la Aplicación

### Importar componentes
```jsx
import { SectionHeader, SubsectionTabs, Button, Card } from '../shared';
```

### Usar en secciones existentes
```jsx
// Reemplazar encabezados existentes
<SectionHeader
  title="Mi Sección"
  subtitle="Descripción de la sección"
  image={require('../../assets/icon.png')}
  onAddPress={handleAdd}
  theme="forest"
  size="medium"
/>

// Reemplazar barras de subsecciones
<SubsectionTabs
  sections={sections}
  activeSection={activeSection}
  onSectionChange={setActiveSection}
  theme="forest"
  size="medium"
/>
```

## 🔧 Personalización

### Estilos personalizados
```jsx
<SectionHeader
  title="Mi Título"
  style={{ marginBottom: 20 }}
  titleStyle={{ fontSize: 20 }}
  subtitleStyle={{ color: '#FF0000' }}
  theme="forest"
/>
```

### Temas personalizados
```jsx
// Crear tema personalizado
const customTheme = {
  backgroundColor: '#FF6B6B',
  borderColor: '#FF8E8E',
  titleColor: '#FFFFFF',
  subtitleColor: 'rgba(255, 255, 255, 0.9)',
  addButtonColor: '#FF8E8E',
  decorationColor: '#FFE0E0',
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
# Tests de componentes
npm test -- --testPathPattern=shared

# Tests de integración
npm run test:integration
```

### Ejemplos de uso
Ver `examples/HealthSectionsExample.js` para ejemplos completos de implementación.

## 📚 Documentación Adicional

- **Storybook**: Documentación interactiva de componentes
- **Figma**: Diseños y especificaciones visuales
- **Changelog**: Historial de cambios y versiones

## 🤝 Contribución

### Agregar nuevos componentes
1. Crear archivo en carpeta correspondiente
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
