import React, { useState } from 'react';
import {
  IonContent,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonText,
  IonButton,
  IonIcon,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonItem,
  IonList,
  IonChip,
  IonAlert,
  IonToast,
  IonGrid,
  IonRow,
  IonCol,
  IonFab,
  IonFabButton,
  IonAvatar,
  IonToggle,
  IonBadge,
  IonDatetime,
} from '@ionic/react';
import {
  calendar,
  list,
  person,
  settings,
  add,
  close,
  checkmarkCircle,
  informationCircle,
  warning,
  camera,
  key,
  logOut,
  create,
  trash,
  time,
  location,
  people,
} from 'ionicons/icons';
import { useAuth } from '../../../../../contexts/AuthContext';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdAt: string;
}

interface Event {
  id: string;
  title: string;
  description?: string;
  date: string;
  time?: string;
  type: 'work' | 'personal' | 'health' | 'finance' | 'education' | 'social' | 'travel' | 'other';
  location?: string;
  attendees?: string[];
}

const Personal: React.FC = () => {
  const [activeSegment, setActiveSegment] = useState<string>('calendar');
  const { user, signOut, updateProfile } = useAuth();

  // Estados para calendario
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Estados para tareas
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      text: 'Revisar emails importantes',
      completed: false,
      priority: 'high',
      dueDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      text: 'Hacer ejercicio matutino',
      completed: true,
      priority: 'medium',
      dueDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    }
  ]);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({
    text: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    dueDate: new Date().toISOString().split('T')[0]
  });

  // Estados para eventos
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'Reunión de equipo',
      description: 'Revisar progreso del proyecto',
      date: new Date().toISOString().split('T')[0],
      time: '10:00',
      type: 'work',
      location: 'Sala de conferencias',
      attendees: ['Juan', 'María', 'Carlos']
    }
  ]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    time: '',
    type: 'personal' as Event['type'],
    location: '',
    attendees: ''
  });

  // Estados para perfil
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  // Estados para configuración
  const [settings, setSettingsState] = useState({
    notifications: true,
    reminders: true,
    darkMode: false,
    language: 'es',
    timezone: 'America/Mexico_City'
  });

  // Estados para UI
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const eventTypes = [
    { key: 'work', label: 'Trabajo', color: 'primary', icon: 'briefcase' },
    { key: 'personal', label: 'Personal', color: 'secondary', icon: 'person' },
    { key: 'health', label: 'Salud', color: 'success', icon: 'medical' },
    { key: 'finance', label: 'Finanzas', color: 'warning', icon: 'cash' },
    { key: 'education', label: 'Educación', color: 'tertiary', icon: 'school' },
    { key: 'social', label: 'Social', color: 'danger', icon: 'people' },
    { key: 'travel', label: 'Viajes', color: 'medium', icon: 'airplane' },
    { key: 'other', label: 'Otro', color: 'light', icon: 'ellipse' },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'medium';
    }
  };

  const getEventTypeColor = (type: string) => {
    const eventType = eventTypes.find(et => et.key === type);
    return eventType?.color || 'medium';
  };

  const handleAddTask = () => {
    if (!newTask.text.trim()) {
      setAlertMessage('Por favor ingresa una descripción para la tarea');
      setShowAlert(true);
      return;
    }

    const task: Task = {
      id: Date.now().toString(),
      text: newTask.text.trim(),
      completed: false,
      priority: newTask.priority,
      dueDate: newTask.dueDate,
      createdAt: new Date().toISOString()
    };

    setTasks([...tasks, task]);
    setNewTask({ text: '', priority: 'medium', dueDate: new Date().toISOString().split('T')[0] });
    setShowTaskModal(false);
    setToastMessage('Tarea agregada exitosamente');
    setShowToast(true);
  };

  const toggleTask = (taskId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    setToastMessage('Tarea eliminada');
    setShowToast(true);
  };

  const handleAddEvent = () => {
    if (!newEvent.title.trim()) {
      setAlertMessage('Por favor ingresa un título para el evento');
      setShowAlert(true);
      return;
    }

    const event: Event = {
      id: Date.now().toString(),
      title: newEvent.title.trim(),
      description: newEvent.description.trim(),
      date: newEvent.date,
      time: newEvent.time,
      type: newEvent.type,
      location: newEvent.location.trim(),
      attendees: newEvent.attendees ? newEvent.attendees.split(',').map(a => a.trim()) : []
    };

    setEvents([...events, event]);
    setNewEvent({
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      time: '',
      type: 'personal',
      location: '',
      attendees: ''
    });
    setShowEventModal(false);
    setToastMessage('Evento agregado exitosamente');
    setShowToast(true);
  };

  const handleUpdateProfile = async () => {
    if (!profileData.name.trim()) {
      setAlertMessage('Por favor ingresa tu nombre');
      setShowAlert(true);
      return;
    }

    try {
      await updateProfile({ name: profileData.name });
      setShowProfileModal(false);
      setToastMessage('Perfil actualizado exitosamente');
      setShowToast(true);
    } catch (error) {
      setAlertMessage('Error al actualizar el perfil');
      setShowAlert(true);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      setAlertMessage('Error al cerrar sesión');
      setShowAlert(true);
    }
  };

  const renderCalendar = () => (
    <IonContent className="ion-padding">
      <IonText>
        <h2>Calendario Personal</h2>
        <p>Organiza tus actividades diarias</p>
      </IonText>

      {/* Selector de fecha */}
      <IonCard>
        <IonCardContent>
          <IonItem>
            <IonDatetime
              presentation="date"
              value={selectedDate}
              onIonChange={(e) => setSelectedDate(e.detail.value!)}
            >
              <IonLabel slot="title">Seleccionar Fecha</IonLabel>
            </IonDatetime>
          </IonItem>
        </IonCardContent>
      </IonCard>

      {/* Resumen del día */}
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>
            {new Date(selectedDate).toLocaleDateString('es-ES', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <IonGrid>
            <IonRow>
              <IonCol size="6">
                <div className="day-stat">
                  <IonBadge color="primary">
                    {events.filter(e => e.date === selectedDate).length}
                  </IonBadge>
                  <IonText>
                    <p>Eventos</p>
                  </IonText>
                </div>
              </IonCol>
              <IonCol size="6">
                <div className="day-stat">
                  <IonBadge color="success">
                    {tasks.filter(t => t.dueDate === selectedDate && !t.completed).length}
                  </IonBadge>
                  <IonText>
                    <p>Pendientes</p>
                  </IonText>
                </div>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCardContent>
      </IonCard>

      {/* Eventos del día */}
      {events.filter(e => e.date === selectedDate).length > 0 && (
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Eventos del Día</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            {events
              .filter(e => e.date === selectedDate)
              .map(event => (
                <IonItem key={event.id} lines="none">
                  <IonIcon
                    icon={time}
                    slot="start"
                    color={getEventTypeColor(event.type)}
                  />
                  <IonLabel>
                    <h3>{event.title}</h3>
                    <p>{event.time} - {event.location}</p>
                    {event.description && <p>{event.description}</p>}
                  </IonLabel>
                  <IonChip color={getEventTypeColor(event.type)} className="event-type-chip">
                    <IonLabel>{eventTypes.find(et => et.key === event.type)?.label}</IonLabel>
                  </IonChip>
                </IonItem>
              ))}
          </IonCardContent>
        </IonCard>
      )}

      {/* Tareas del día */}
      {tasks.filter(t => t.dueDate === selectedDate).length > 0 && (
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Tareas del Día</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            {tasks
              .filter(t => t.dueDate === selectedDate)
              .map(task => (
                <IonItem key={task.id} lines="none" className={task.completed ? 'completed-task' : ''}>
                  <IonIcon
                    icon={checkmarkCircle}
                    slot="start"
                    color={task.completed ? 'success' : 'medium'}
                    onClick={() => toggleTask(task.id)}
                  />
                  <IonLabel>
                    <h3 className={task.completed ? 'completed-text' : ''}>{task.text}</h3>
                    <p>Prioridad: {task.priority}</p>
                  </IonLabel>
                  <IonChip color={getPriorityColor(task.priority)} className="priority-chip">
                    <IonLabel>{task.priority.toUpperCase()}</IonLabel>
                  </IonChip>
                </IonItem>
              ))}
          </IonCardContent>
        </IonCard>
      )}
    </IonContent>
  );

  const renderTasks = () => (
    <IonContent className="ion-padding">
      <IonText>
        <h2>Mis Tareas</h2>
        <p>Gestiona tus tareas pendientes</p>
      </IonText>

      {/* Estadísticas de tareas */}
      <IonGrid>
        <IonRow>
          <IonCol size="4">
            <IonCard className="stats-card">
              <IonCardContent className="ion-text-center">
                <IonIcon icon={list} size="large" color="primary" />
                <IonText>
                  <h3>{tasks.length}</h3>
                  <p>Total</p>
                </IonText>
              </IonCardContent>
            </IonCard>
          </IonCol>
          <IonCol size="4">
            <IonCard className="stats-card">
              <IonCardContent className="ion-text-center">
                <IonIcon icon={checkmarkCircle} size="large" color="success" />
                <IonText>
                  <h3>{tasks.filter(t => t.completed).length}</h3>
                  <p>Completadas</p>
                </IonText>
              </IonCardContent>
            </IonCard>
          </IonCol>
          <IonCol size="4">
            <IonCard className="stats-card">
              <IonCardContent className="ion-text-center">
                <IonIcon icon={warning} size="large" color="warning" />
                <IonText>
                  <h3>{tasks.filter(t => !t.completed).length}</h3>
                  <p>Pendientes</p>
                </IonText>
              </IonCardContent>
            </IonCard>
          </IonCol>
        </IonRow>
      </IonGrid>

      {/* Lista de tareas */}
      {tasks.length === 0 ? (
        <IonCard>
          <IonCardContent className="ion-text-center">
            <IonIcon icon={list} size="large" color="medium" />
            <IonText>
              <h3>No hay tareas</h3>
              <p>Toca el botón + para agregar tu primera tarea</p>
            </IonText>
          </IonCardContent>
        </IonCard>
      ) : (
        tasks.map(task => (
          <IonCard key={task.id} className={`task-card ${task.completed ? 'completed' : ''}`}>
            <IonCardContent>
              <IonGrid>
                <IonRow>
                  <IonCol size="auto">
                    <IonIcon
                      icon={checkmarkCircle}
                      size="large"
                      color={task.completed ? 'success' : 'medium'}
                      onClick={() => toggleTask(task.id)}
                      className="task-checkbox"
                    />
                  </IonCol>
                  <IonCol>
                    <IonText>
                      <h4 className={task.completed ? 'completed-text' : ''}>{task.text}</h4>
                      <p>Fecha límite: {new Date(task.dueDate).toLocaleDateString('es-ES')}</p>
                    </IonText>
                  </IonCol>
                  <IonCol size="auto">
                    <IonChip color={getPriorityColor(task.priority)} className="priority-chip">
                      <IonLabel>{task.priority.toUpperCase()}</IonLabel>
                    </IonChip>
                  </IonCol>
                  <IonCol size="auto">
                    <IonButton
                      fill="clear"
                      color="danger"
                      onClick={() => deleteTask(task.id)}
                    >
                      <IonIcon icon={trash} />
                    </IonButton>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonCardContent>
          </IonCard>
        ))
      )}
    </IonContent>
  );

  const renderEvents = () => (
    <IonContent className="ion-padding">
      <IonText>
        <h2>Mis Eventos</h2>
        <p>Agenda tus actividades importantes</p>
      </IonText>

      {/* Estadísticas de eventos */}
      <IonGrid>
        <IonRow>
          <IonCol size="6">
            <IonCard className="stats-card">
              <IonCardContent className="ion-text-center">
                <IonIcon icon={calendar} size="large" color="primary" />
                <IonText>
                  <h3>{events.length}</h3>
                  <p>Eventos totales</p>
                </IonText>
              </IonCardContent>
            </IonCard>
          </IonCol>
          <IonCol size="6">
            <IonCard className="stats-card">
              <IonCardContent className="ion-text-center">
                <IonIcon icon={time} size="large" color="secondary" />
                <IonText>
                  <h3>{events.filter(e => e.date >= new Date().toISOString().split('T')[0]).length}</h3>
                  <p>Próximos</p>
                </IonText>
              </IonCardContent>
            </IonCard>
          </IonCol>
        </IonRow>
      </IonGrid>

      {/* Lista de eventos */}
      {events.length === 0 ? (
        <IonCard>
          <IonCardContent className="ion-text-center">
            <IonIcon icon={calendar} size="large" color="medium" />
            <IonText>
              <h3>No hay eventos</h3>
              <p>Toca el botón + para crear tu primer evento</p>
            </IonText>
          </IonCardContent>
        </IonCard>
      ) : (
        events
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .map(event => (
            <IonCard key={event.id} className="event-card">
              <IonCardHeader>
                <IonCardTitle className="event-title">{event.title}</IonCardTitle>
                <IonChip color={getEventTypeColor(event.type)} className="event-type-chip">
                  <IonLabel>{eventTypes.find(et => et.key === event.type)?.label}</IonLabel>
                </IonChip>
              </IonCardHeader>
              <IonCardContent>
                <IonGrid>
                  <IonRow>
                    <IonCol size="6">
                      <IonItem lines="none">
                        <IonIcon icon={calendar} slot="start" />
                        <IonLabel>
                          <h3>{new Date(event.date).toLocaleDateString('es-ES')}</h3>
                          <p>Fecha</p>
                        </IonLabel>
                      </IonItem>
                    </IonCol>
                    {event.time && (
                      <IonCol size="6">
                        <IonItem lines="none">
                          <IonIcon icon={time} slot="start" />
                          <IonLabel>
                            <h3>{event.time}</h3>
                            <p>Hora</p>
                          </IonLabel>
                        </IonItem>
                      </IonCol>
                    )}
                  </IonRow>
                  {event.location && (
                    <IonRow>
                      <IonCol size="12">
                        <IonItem lines="none">
                          <IonIcon icon={location} slot="start" />
                          <IonLabel>
                            <h3>{event.location}</h3>
                            <p>Ubicación</p>
                          </IonLabel>
                        </IonItem>
                      </IonCol>
                    </IonRow>
                  )}
                  {event.attendees && event.attendees.length > 0 && (
                    <IonRow>
                      <IonCol size="12">
                        <IonItem lines="none">
                          <IonIcon icon={people} slot="start" />
                          <IonLabel>
                            <h3>{event.attendees.join(', ')}</h3>
                            <p>Asistentes</p>
                          </IonLabel>
                        </IonItem>
                      </IonCol>
                    </IonRow>
                  )}
                  {event.description && (
                    <IonRow>
                      <IonCol size="12">
                        <IonText className="event-description">
                          <p>{event.description}</p>
                        </IonText>
                      </IonCol>
                    </IonRow>
                  )}
                </IonGrid>
              </IonCardContent>
            </IonCard>
          ))
      )}
    </IonContent>
  );

  const renderProfile = () => (
    <IonContent className="ion-padding">
      <IonText>
        <h2>Mi Perfil</h2>
        <p>Gestiona tu información personal</p>
      </IonText>

      <IonCard>
        <IonCardContent className="ion-text-center">
          <IonAvatar className="profile-avatar">
            <img
              src={user?.avatar || 'https://ionicframework.com/docs/img/demos/avatar.svg'}
              alt="Avatar"
            />
          </IonAvatar>
          <IonText>
            <h3>{user?.name || 'Usuario'}</h3>
            <p>{user?.email || 'correo@ejemplo.com'}</p>
          </IonText>
          <IonButton
            expand="block"
            onClick={() => setShowProfileModal(true)}
            className="edit-profile-btn"
          >
            <IonIcon icon={create} slot="start" />
            Editar Perfil
          </IonButton>
        </IonCardContent>
      </IonCard>

      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Información de la Cuenta</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <IonItem lines="none">
            <IonIcon icon={person} slot="start" />
            <IonLabel>
              <h3>Nombre</h3>
              <p>{user?.name}</p>
            </IonLabel>
          </IonItem>
          <IonItem lines="none">
            <IonIcon icon={settings} slot="start" />
            <IonLabel>
              <h3>Email</h3>
              <p>{user?.email}</p>
            </IonLabel>
          </IonItem>
          <IonItem lines="none">
            <IonIcon icon={calendar} slot="start" />
            <IonLabel>
              <h3>Miembro desde</h3>
              <p>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('es-ES') : 'N/A'}</p>
            </IonLabel>
          </IonItem>
        </IonCardContent>
      </IonCard>

      <IonButton
        expand="block"
        fill="outline"
        color="danger"
        onClick={handleLogout}
        className="logout-btn"
      >
        <IonIcon icon={logOut} slot="start" />
        Cerrar Sesión
      </IonButton>
    </IonContent>
  );

  const renderSettings = () => (
    <IonContent className="ion-padding">
      <IonText>
        <h2>Configuración</h2>
        <p>Personaliza tu experiencia</p>
      </IonText>

      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Notificaciones</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <IonItem>
            <IonLabel>Notificaciones push</IonLabel>
            <IonToggle
              checked={settings.notifications}
              onIonChange={(e) => setSettingsState({...settings, notifications: e.detail.checked})}
            />
          </IonItem>
          <IonItem>
            <IonLabel>Recordatorios</IonLabel>
            <IonToggle
              checked={settings.reminders}
              onIonChange={(e) => setSettingsState({...settings, reminders: e.detail.checked})}
            />
          </IonItem>
        </IonCardContent>
      </IonCard>

      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Apariencia</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <IonItem>
            <IonLabel>Modo oscuro</IonLabel>
            <IonToggle
              checked={settings.darkMode}
              onIonChange={(e) => setSettingsState({...settings, darkMode: e.detail.checked})}
            />
          </IonItem>
        </IonCardContent>
      </IonCard>

      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Idioma y Región</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <IonItem>
            <IonSelect
              label="Idioma"
              labelPlacement="stacked"
              value={settings.language}
              onSelectionChange={(value) => setSettingsState({...settings, language: value!})}
            >
              <IonSelectOption value="es">Español</IonSelectOption>
              <IonSelectOption value="en">English</IonSelectOption>
            </IonSelect>
          </IonItem>
          <IonItem>
            <IonSelect
              label="Zona horaria"
              labelPlacement="stacked"
              value={settings.timezone}
              onSelectionChange={(value) => setSettingsState({...settings, timezone: value!})}
            >
              <IonSelectOption value="America/Mexico_City">México (CDMX)</IonSelectOption>
              <IonSelectOption value="America/Monterrey">México (Monterrey)</IonSelectOption>
              <IonSelectOption value="Europe/Madrid">España (Madrid)</IonSelectOption>
            </IonSelect>
          </IonItem>
        </IonCardContent>
      </IonCard>

      <IonButton
        expand="block"
        onClick={() => {
          setToastMessage('Configuración guardada');
          setShowToast(true);
        }}
        className="save-settings-btn"
      >
        <IonIcon icon={checkmarkCircle} slot="start" />
        Guardar Configuración
      </IonButton>
    </IonContent>
  );

  return (
    <>
      <IonContent>
        <IonSegment
          value={activeSegment}
          onIonChange={(e) => setActiveSegment(e.detail.value!)}
          className="personal-segment"
        >
          <IonSegmentButton value="calendar">
            <IonLabel>Calendario</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="tasks">
            <IonLabel>Tareas</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="events">
            <IonLabel>Eventos</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="profile">
            <IonLabel>Perfil</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="settings">
            <IonLabel>Configuración</IonLabel>
          </IonSegmentButton>
        </IonSegment>

        {activeSegment === 'calendar' && renderCalendar()}
        {activeSegment === 'tasks' && renderTasks()}
        {activeSegment === 'events' && renderEvents()}
        {activeSegment === 'profile' && renderProfile()}
        {activeSegment === 'settings' && renderSettings()}

        {/* FAB Buttons */}
        {activeSegment === 'tasks' && (
          <IonFab vertical="bottom" horizontal="end" slot="fixed">
            <IonFabButton onClick={() => setShowTaskModal(true)}>
              <IonIcon icon={add} />
            </IonFabButton>
          </IonFab>
        )}

        {activeSegment === 'events' && (
          <IonFab vertical="bottom" horizontal="end" slot="fixed">
            <IonFabButton onClick={() => setShowEventModal(true)}>
              <IonIcon icon={add} />
            </IonFabButton>
          </IonFab>
        )}
      </IonContent>

      {/* Task Modal */}
      <IonModal isOpen={showTaskModal} onDidDismiss={() => setShowTaskModal(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Nueva Tarea</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowTaskModal(false)}>
                <IonIcon icon={close} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonList>
            <IonItem>
              <IonTextarea
                label="Descripción de la tarea"
                labelPlacement="stacked"
                placeholder="Ej: Revisar emails importantes"
                value={newTask.text}
                onIonChange={(e) => setNewTask({ ...newTask, text: e.detail.value! })}
                rows={3}
              />
            </IonItem>

            <IonItem>
              <IonSelect
                label="Prioridad"
                labelPlacement="stacked"
                value={newTask.priority}
                onSelectionChange={(value) => setNewTask({ ...newTask, priority: value! as 'low' | 'medium' | 'high' })}
              >
                <IonSelectOption value="low">Baja</IonSelectOption>
                <IonSelectOption value="medium">Media</IonSelectOption>
                <IonSelectOption value="high">Alta</IonSelectOption>
              </IonSelect>
            </IonItem>

            <IonItem>
              <IonInput
                label="Fecha límite"
                labelPlacement="stacked"
                type="date"
                value={newTask.dueDate}
                onIonChange={(e) => setNewTask({ ...newTask, dueDate: e.detail.value! })}
              />
            </IonItem>
          </IonList>

          <IonGrid>
            <IonRow>
              <IonCol>
                <IonButton
                  expand="block"
                  fill="outline"
                  onClick={() => setShowTaskModal(false)}
                >
                  Cancelar
                </IonButton>
              </IonCol>
              <IonCol>
                <IonButton
                  expand="block"
                  onClick={handleAddTask}
                  disabled={!newTask.text.trim()}
                >
                  <IonIcon icon={checkmarkCircle} slot="start" />
                  Agregar Tarea
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonContent>
      </IonModal>

      {/* Event Modal */}
      <IonModal isOpen={showEventModal} onDidDismiss={() => setShowEventModal(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Nuevo Evento</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowEventModal(false)}>
                <IonIcon icon={close} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonList>
            <IonItem>
              <IonInput
                label="Título del evento"
                labelPlacement="stacked"
                placeholder="Ej: Reunión de equipo"
                value={newEvent.title}
                onIonChange={(e) => setNewEvent({ ...newEvent, title: e.detail.value! })}
              />
            </IonItem>

            <IonItem>
              <IonTextarea
                label="Descripción"
                labelPlacement="stacked"
                placeholder="Detalles del evento..."
                value={newEvent.description}
                onIonChange={(e) => setNewEvent({ ...newEvent, description: e.detail.value! })}
                rows={2}
              />
            </IonItem>

            <IonItem>
              <IonInput
                label="Fecha"
                labelPlacement="stacked"
                type="date"
                value={newEvent.date}
                onIonChange={(e) => setNewEvent({ ...newEvent, date: e.detail.value! })}
              />
            </IonItem>

            <IonItem>
              <IonInput
                label="Hora"
                labelPlacement="stacked"
                type="time"
                value={newEvent.time}
                onIonChange={(e) => setNewEvent({ ...newEvent, time: e.detail.value! })}
              />
            </IonItem>

            <IonItem>
              <IonSelect
                label="Tipo de evento"
                labelPlacement="stacked"
                value={newEvent.type}
                onSelectionChange={(value) => setNewEvent({ ...newEvent, type: value! as Event['type'] })}
              >
                {eventTypes.map(type => (
                  <IonSelectOption key={type.key} value={type.key}>
                    {type.label}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>

            <IonItem>
              <IonInput
                label="Ubicación"
                labelPlacement="stacked"
                placeholder="Ej: Sala de conferencias"
                value={newEvent.location}
                onIonChange={(e) => setNewEvent({ ...newEvent, location: e.detail.value! })}
              />
            </IonItem>

            <IonItem>
              <IonInput
                label="Asistentes"
                labelPlacement="stacked"
                placeholder="Nombres separados por comas"
                value={newEvent.attendees}
                onIonChange={(e) => setNewEvent({ ...newEvent, attendees: e.detail.value! })}
              />
            </IonItem>
          </IonList>

          <IonGrid>
            <IonRow>
              <IonCol>
                <IonButton
                  expand="block"
                  fill="outline"
                  onClick={() => setShowEventModal(false)}
                >
                  Cancelar
                </IonButton>
              </IonCol>
              <IonCol>
                <IonButton
                  expand="block"
                  onClick={handleAddEvent}
                  disabled={!newEvent.title.trim()}
                >
                  <IonIcon icon={checkmarkCircle} slot="start" />
                  Crear Evento
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonContent>
      </IonModal>

      {/* Profile Modal */}
      <IonModal isOpen={showProfileModal} onDidDismiss={() => setShowProfileModal(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Editar Perfil</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowProfileModal(false)}>
                <IonIcon icon={close} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonList>
            <IonItem>
              <IonInput
                label="Nombre completo"
                labelPlacement="stacked"
                value={profileData.name}
                onIonChange={(e) => setProfileData({ ...profileData, name: e.detail.value! })}
              />
            </IonItem>

            <IonItem>
              <IonInput
                label="Correo electrónico"
                labelPlacement="stacked"
                type="email"
                value={profileData.email}
                readonly
              />
              <IonText color="medium" slot="helper">
                El email no se puede cambiar
              </IonText>
            </IonItem>
          </IonList>

          <IonGrid>
            <IonRow>
              <IonCol>
                <IonButton
                  expand="block"
                  fill="outline"
                  onClick={() => setShowProfileModal(false)}
                >
                  Cancelar
                </IonButton>
              </IonCol>
              <IonCol>
                <IonButton
                  expand="block"
                  onClick={handleUpdateProfile}
                  disabled={!profileData.name.trim()}
                >
                  <IonIcon icon={checkmarkCircle} slot="start" />
                  Actualizar
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonContent>
      </IonModal>

      {/* Alert */}
      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        header="Aviso"
        message={alertMessage}
        buttons={['OK']}
      />

      {/* Toast */}
      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message={toastMessage}
        duration={2000}
        position="bottom"
        color="success"
      />
    </>
  );
};

export default Personal;
