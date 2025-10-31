import React, { useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonMenuButton,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonIcon,
  IonList,
  IonItem,
  IonInput,
  IonTextarea,
  IonModal,
  IonGrid,
  IonRow,
  IonCol,
  IonChip,
  IonDatetime,
} from '@ionic/react';
import {
  briefcase,
  calendar,
  time,
  people,
  document,
  checkmarkCircle,
  add,
  close,
} from 'ionicons/icons';

const Work: React.FC = () => {
  const [activeSection, setActiveSection] = useState('schedule');
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);

  // Estados para reuniones
  const [meetings, setMeetings] = useState([]);
  const [newMeeting, setNewMeeting] = useState({
    title: '',
    date: '',
    time: '',
    duration: '',
    attendees: '',
    description: '',
    location: ''
  });

  // Estados para tareas laborales
  const [workTasks, setWorkTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'Media',
    deadline: '',
    status: 'Pendiente'
  });

  // Estados para proyectos
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    team: [],
    status: 'Planificación'
  });

  const addMeeting = () => {
    if (newMeeting.title && newMeeting.date && newMeeting.time) {
      setMeetings([...meetings, { ...newMeeting, id: Date.now() }]);
      setNewMeeting({
        title: '',
        date: '',
        time: '',
        duration: '',
        attendees: '',
        description: '',
        location: ''
      });
      setShowMeetingModal(false);
    }
  };

  const addTask = () => {
    if (newTask.title && newTask.description) {
      setWorkTasks([...workTasks, { ...newTask, id: Date.now() }]);
      setNewTask({
        title: '',
        description: '',
        priority: 'Media',
        deadline: '',
        status: 'Pendiente'
      });
      setShowTaskModal(false);
    }
  };

  const addProject = () => {
    if (newProject.name && newProject.description) {
      setProjects([...projects, { ...newProject, id: Date.now() }]);
      setNewProject({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        team: [],
        status: 'Planificación'
      });
      setShowProjectModal(false);
    }
  };

  const renderSchedule = () => (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>
          <IonIcon icon={calendar} slot="start" />
          Calendario de Trabajo
        </IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonButton
          expand="block"
          color="primary"
          onClick={() => setShowMeetingModal(true)}
        >
          <IonIcon icon={add} slot="start" />
          Agendar Reunión
        </IonButton>

        <div style={{ marginTop: '20px' }}>
          <h3>Próximas Reuniones</h3>
          <IonList>
            {meetings.map((meeting: any) => (
              <IonItem key={meeting.id}>
                <IonLabel>
                  <h3>{meeting.title}</h3>
                  <p>{meeting.date} - {meeting.time}</p>
                  <p>Lugar: {meeting.location}</p>
                </IonLabel>
                <IonChip color="primary" slot="end">
                  {meeting.duration} min
                </IonChip>
              </IonItem>
            ))}
          </IonList>
        </div>
      </IonCardContent>
    </IonCard>
  );

  const renderTasks = () => (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>
          <IonIcon icon={checkmarkCircle} slot="start" />
          Tareas Laborales
        </IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonButton
          expand="block"
          color="secondary"
          onClick={() => setShowTaskModal(true)}
        >
          <IonIcon icon={add} slot="start" />
          Nueva Tarea
        </IonButton>

        <div style={{ marginTop: '20px' }}>
          <h3>Mis Tareas</h3>
          <IonList>
            {workTasks.map((task: any) => (
              <IonItem key={task.id}>
                <IonLabel>
                  <h3>{task.title}</h3>
                  <p>{task.description}</p>
                  <p>Fecha límite: {task.deadline}</p>
                </IonLabel>
                <IonChip
                  color={task.priority === 'Alta' ? 'danger' :
                         task.priority === 'Media' ? 'warning' : 'success'}
                  slot="end"
                >
                  {task.priority}
                </IonChip>
              </IonItem>
            ))}
          </IonList>
        </div>
      </IonCardContent>
    </IonCard>
  );

  const renderProjects = () => (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>
          <IonIcon icon={briefcase} slot="start" />
          Gestión de Proyectos
        </IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonButton
          expand="block"
          color="tertiary"
          onClick={() => setShowProjectModal(true)}
        >
          <IonIcon icon={add} slot="start" />
          Nuevo Proyecto
        </IonButton>

        <div style={{ marginTop: '20px' }}>
          <h3>Mis Proyectos</h3>
          <IonList>
            {projects.map((project: any) => (
              <IonItem key={project.id}>
                <IonLabel>
                  <h3>{project.name}</h3>
                  <p>{project.description}</p>
                  <p>{project.startDate} - {project.endDate}</p>
                </IonLabel>
                <IonChip
                  color={project.status === 'Completado' ? 'success' :
                         project.status === 'En Progreso' ? 'primary' : 'medium'}
                  slot="end"
                >
                  {project.status}
                </IonChip>
              </IonItem>
            ))}
          </IonList>
        </div>
      </IonCardContent>
    </IonCard>
  );

  const renderTeam = () => (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>
          <IonIcon icon={people} slot="start" />
          Equipo de Trabajo
        </IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonList>
          <IonItem>
            <IonLabel>
              <h3>Jefe de Proyecto</h3>
              <p>jefe@empresa.com</p>
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>
              <h3>Colaborador 1</h3>
              <p>colaborador1@empresa.com</p>
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>
              <h3>Colaborador 2</h3>
              <p>colaborador2@empresa.com</p>
            </IonLabel>
          </IonItem>
        </IonList>
      </IonCardContent>
    </IonCard>
  );

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Trabajo</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonSegment
          value={activeSection}
          onIonChange={(e) => setActiveSection(e.detail.value!)}
          style={{ marginBottom: '20px' }}
        >
          <IonSegmentButton value="schedule">
            <IonLabel>Calendario</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="tasks">
            <IonLabel>Tareas</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="projects">
            <IonLabel>Proyectos</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="team">
            <IonLabel>Equipo</IonLabel>
          </IonSegmentButton>
        </IonSegment>

        {activeSection === 'schedule' && renderSchedule()}
        {activeSection === 'tasks' && renderTasks()}
        {activeSection === 'projects' && renderProjects()}
        {activeSection === 'team' && renderTeam()}

        {/* Modal para agendar reunión */}
        <IonModal isOpen={showMeetingModal}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Agendar Reunión</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowMeetingModal(false)}>
                  <IonIcon icon={close} />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonList>
              <IonItem>
                <IonLabel position="stacked">Título de la Reunión</IonLabel>
                <IonInput
                  value={newMeeting.title}
                  placeholder="Reunión semanal de equipo"
                  onIonChange={(e) => setNewMeeting({...newMeeting, title: e.detail.value!})}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Fecha</IonLabel>
                <IonInput
                  type="date"
                  value={newMeeting.date}
                  onIonChange={(e) => setNewMeeting({...newMeeting, date: e.detail.value!})}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Hora</IonLabel>
                <IonInput
                  type="time"
                  value={newMeeting.time}
                  onIonChange={(e) => setNewMeeting({...newMeeting, time: e.detail.value!})}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Duración (minutos)</IonLabel>
                <IonInput
                  type="number"
                  value={newMeeting.duration}
                  placeholder="60"
                  onIonChange={(e) => setNewMeeting({...newMeeting, duration: e.detail.value!})}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Ubicación</IonLabel>
                <IonInput
                  value={newMeeting.location}
                  placeholder="Sala de conferencias A"
                  onIonChange={(e) => setNewMeeting({...newMeeting, location: e.detail.value!})}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Asistentes</IonLabel>
                <IonTextarea
                  value={newMeeting.attendees}
                  placeholder="Lista de correos electrónicos..."
                  rows={2}
                  onIonChange={(e) => setNewMeeting({...newMeeting, attendees: e.detail.value!})}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Descripción</IonLabel>
                <IonTextarea
                  value={newMeeting.description}
                  placeholder="Agenda de la reunión..."
                  rows={3}
                  onIonChange={(e) => setNewMeeting({...newMeeting, description: e.detail.value!})}
                />
              </IonItem>
            </IonList>
            <IonButton
              expand="block"
              style={{ margin: '20px' }}
              onClick={addMeeting}
            >
              Agendar Reunión
            </IonButton>
          </IonContent>
        </IonModal>

        {/* Modal para nueva tarea */}
        <IonModal isOpen={showTaskModal}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Nueva Tarea Laboral</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowTaskModal(false)}>
                  <IonIcon icon={close} />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonList>
              <IonItem>
                <IonLabel position="stacked">Título</IonLabel>
                <IonInput
                  value={newTask.title}
                  placeholder="Completar informe mensual"
                  onIonChange={(e) => setNewTask({...newTask, title: e.detail.value!})}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Descripción</IonLabel>
                <IonTextarea
                  value={newTask.description}
                  placeholder="Detalles de la tarea..."
                  rows={3}
                  onIonChange={(e) => setNewTask({...newTask, description: e.detail.value!})}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Fecha límite</IonLabel>
                <IonInput
                  type="date"
                  value={newTask.deadline}
                  onIonChange={(e) => setNewTask({...newTask, deadline: e.detail.value!})}
                />
              </IonItem>
              <IonItem>
                <IonLabel>Prioridad</IonLabel>
                <IonChip
                  color={newTask.priority === 'Alta' ? 'danger' :
                         newTask.priority === 'Media' ? 'warning' : 'success'}
                  onClick={() => {
                    const priorities = ['Baja', 'Media', 'Alta'];
                    const currentIndex = priorities.indexOf(newTask.priority);
                    const nextIndex = (currentIndex + 1) % priorities.length;
                    setNewTask({...newTask, priority: priorities[nextIndex]});
                  }}
                >
                  {newTask.priority}
                </IonChip>
              </IonItem>
            </IonList>
            <IonButton
              expand="block"
              style={{ margin: '20px' }}
              onClick={addTask}
            >
              Crear Tarea
            </IonButton>
          </IonContent>
        </IonModal>

        {/* Modal para nuevo proyecto */}
        <IonModal isOpen={showProjectModal}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Nuevo Proyecto</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowProjectModal(false)}>
                  <IonIcon icon={close} />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonList>
              <IonItem>
                <IonLabel position="stacked">Nombre del Proyecto</IonLabel>
                <IonInput
                  value={newProject.name}
                  placeholder="Proyecto de Desarrollo Web"
                  onIonChange={(e) => setNewProject({...newProject, name: e.detail.value!})}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Descripción</IonLabel>
                <IonTextarea
                  value={newProject.description}
                  placeholder="Descripción del proyecto..."
                  rows={3}
                  onIonChange={(e) => setNewProject({...newProject, description: e.detail.value!})}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Fecha de Inicio</IonLabel>
                <IonInput
                  type="date"
                  value={newProject.startDate}
                  onIonChange={(e) => setNewProject({...newProject, startDate: e.detail.value!})}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Fecha de Fin</IonLabel>
                <IonInput
                  type="date"
                  value={newProject.endDate}
                  onIonChange={(e) => setNewProject({...newProject, endDate: e.detail.value!})}
                />
              </IonItem>
            </IonList>
            <IonButton
              expand="block"
              style={{ margin: '20px' }}
              onClick={addProject}
            >
              Crear Proyecto
            </IonButton>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Work;
