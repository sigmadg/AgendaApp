# PersonalProfile - Mi Perfil

Esta carpeta contiene la estructura modularizada de la sección "Mi Perfil" de la aplicación.

## Estructura de Archivos

```
PersonalProfile/
├── PersonalProfile.js          # Componente principal
├── index.js                     # Exportaciones
├── README.md                    # Documentación
├── sections/                    # Subsecciones
│   ├── EventsSection.js         # Eventos del día
│   ├── TasksSection.js         # Tareas
│   ├── ProfileSection.js       # Perfil de usuario
│   └── SettingsSection.js      # Configuración
└── styles/                      # Estilos
    └── personalStyles.js        # Estilos unificados
```

## Componentes

### PersonalProfile.js
Componente principal que maneja la navegación entre subsecciones y renderiza el contenido activo.

**Props:**
- `selectedDate`: Fecha seleccionada
- `onDateSelect`: Función para cambiar fecha
- `tasks`: Array de tareas
- `events`: Array de eventos
- `getAllEventsForDate`: Función para obtener eventos de una fecha
- `getTasksForDate`: Función para obtener tareas de una fecha
- `onAddTask`: Función para agregar tarea
- `onToggleTask`: Función para marcar/desmarcar tarea
- `onDeleteTask`: Función para eliminar tarea
- `onAddEvent`: Función para agregar evento
- `onEditEvent`: Función para editar evento
- `onDeleteEvent`: Función para eliminar evento
- `user`: Objeto de usuario
- `onUpdateProfile`: Función para actualizar perfil
- `onLogout`: Función para cerrar sesión
- `activeSections`: Array de secciones activas
- `onToggleSection`: Función para activar/desactivar sección
- `onClearSection`: Función para limpiar sección

### Subsecciones

#### EventsSection.js
Maneja la visualización y gestión de eventos del día.

**Características:**
- Lista de eventos del día seleccionado
- Modal para agregar nuevos eventos
- Edición y eliminación de eventos
- Estado vacío cuando no hay eventos

#### TasksSection.js
Maneja la visualización y gestión de tareas.

**Características:**
- Lista de tareas del día seleccionado
- Modal para agregar nuevas tareas
- Marcado de tareas como completadas
- Eliminación de tareas
- Estado vacío cuando no hay tareas

#### ProfileSection.js
Maneja la información del perfil de usuario.

**Características:**
- Visualización del perfil actual
- Modal para editar información personal
- Botón de cerrar sesión
- Avatar de usuario
- Información de contacto

#### SettingsSection.js
Maneja la configuración de la aplicación.

**Características:**
- Configuración general (notificaciones, modo oscuro, sincronización)
- Gestión de secciones activas
- Información de la aplicación
- Enlaces a políticas y términos

## Estilos

### personalStyles.js
Archivo centralizado con todos los estilos utilizados en la sección PersonalProfile.

**Ecosistema:** Forest (Verde bosque)
- Colores principales: `#2D5016`, `#4A7C59`, `#4A6741`
- Colores de fondo: `#F5F7F0`, `#F8FAF6`
- Colores de acento: `#E8F0E3`

## Uso

```javascript
import { PersonalProfile } from './components/PersonalProfile';

// En tu componente principal
<PersonalProfile
  selectedDate={selectedDate}
  onDateSelect={setSelectedDate}
  tasks={tasks}
  events={events}
  getAllEventsForDate={getAllEventsForDate}
  getTasksForDate={getTasksForDate}
  onAddTask={handleAddTask}
  onToggleTask={handleToggleTask}
  onDeleteTask={handleDeleteTask}
  onAddEvent={handleAddEvent}
  onEditEvent={handleEditEvent}
  onDeleteEvent={handleDeleteEvent}
  user={user}
  onUpdateProfile={handleUpdateProfile}
  onLogout={handleLogout}
  activeSections={activeSections}
  onToggleSection={handleToggleSection}
  onClearSection={handleClearSection}
/>
```

## Ventajas de esta Estructura

1. **Modularidad**: Cada subsección es independiente
2. **Mantenibilidad**: Fácil de mantener y actualizar
3. **Reutilización**: Componentes pueden reutilizarse
4. **Organización**: Estructura clara y lógica
5. **Escalabilidad**: Fácil agregar nuevas subsecciones
6. **Estilos centralizados**: Un solo archivo de estilos
7. **Separación de responsabilidades**: Cada archivo tiene una función específica
