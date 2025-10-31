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
  IonSelect,
  IonSelectOption,
  IonDatetime,
} from '@ionic/react';
import {
  school,
  book,
  documentText,
  time,
  calendar,
  add,
  close,
  checkmarkCircle,
  alertCircle,
} from 'ionicons/icons';

const School: React.FC = () => {
  const [activeSection, setActiveSection] = useState('classes');
  const [showClassModal, setShowClassModal] = useState(false);
  const [showHomeworkModal, setShowHomeworkModal] = useState(false);
  const [showGradeModal, setShowGradeModal] = useState(false);

  // Estados para clases
  const [classes, setClasses] = useState([]);
  const [newClass, setNewClass] = useState({
    name: '',
    professor: '',
    schedule: '',
    classroom: '',
    color: '#4F46E5'
  });

  // Estados para tareas
  const [homework, setHomework] = useState([]);
  const [newHomework, setNewHomework] = useState({
    title: '',
    description: '',
    subject: '',
    dueDate: '',
    priority: 'Media',
    status: 'Pendiente'
  });

  // Estados para calificaciones
  const [grades, setGrades] = useState([]);
  const [newGrade, setNewGrade] = useState({
    subject: '',
    grade: '',
    type: 'Examen',
    date: '',
    comments: ''
  });

  // Estados para horario
  const [schedule, setSchedule] = useState({
    'Lunes': [],
    'Martes': [],
    'Miércoles': [],
    'Jueves': [],
    'Viernes': [],
    'Sábado': [],
    'Domingo': []
  });

  const colors = [
    '#4F46E5', '#EF4444', '#10B981', '#F59E0B',
    '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'
  ];

  const addNewClass = () => {
    if (newClass.name && newClass.professor) {
      setClasses([...classes, { ...newClass, id: Date.now() }]);
      setNewClass({
        name: '',
        professor: '',
        schedule: '',
        classroom: '',
        color: '#4F46E5'
      });
      setShowClassModal(false);
    }
  };

  const addHomework = () => {
    if (newHomework.title && newHomework.subject && newHomework.dueDate) {
      setHomework([...homework, { ...newHomework, id: Date.now() }]);
      setNewHomework({
        title: '',
        description: '',
        subject: '',
        dueDate: '',
        priority: 'Media',
        status: 'Pendiente'
      });
      setShowHomeworkModal(false);
    }
  };

  const addGrade = () => {
    if (newGrade.subject && newGrade.grade) {
      setGrades([...grades, { ...newGrade, id: Date.now() }]);
      setNewGrade({
        subject: '',
        grade: '',
        type: 'Examen',
        date: '',
        comments: ''
      });
      setShowGradeModal(false);
    }
  };

  const renderClasses = () => (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>
          <IonIcon icon={book} slot="start" />
          Mis Clases
        </IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonButton
          expand="block"
          color="primary"
          onClick={() => setShowClassModal(true)}
        >
          <IonIcon icon={add} slot="start" />
          Agregar Clase
        </IonButton>

        <div style={{ marginTop: '20px' }}>
          <IonList>
            {classes.map((classItem: any) => (
              <IonItem key={classItem.id}>
                <IonIcon
                  icon={school}
                  slot="start"
                  style={{ color: classItem.color }}
                />
                <IonLabel>
                  <h3>{classItem.name}</h3>
                  <p>Profesor: {classItem.professor}</p>
                  <p>Horario: {classItem.schedule} - Aula: {classItem.classroom}</p>
                </IonLabel>
              </IonItem>
            ))}
          </IonList>
        </div>
      </IonCardContent>
    </IonCard>
  );

  const renderHomework = () => (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>
          <IonIcon icon={documentText} slot="start" />
          Tareas y Deberes
        </IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonButton
          expand="block"
          color="secondary"
          onClick={() => setShowHomeworkModal(true)}
        >
          <IonIcon icon={add} slot="start" />
          Nueva Tarea
        </IonButton>

        <div style={{ marginTop: '20px' }}>
          <IonList>
            {homework.map((task: any) => (
              <IonItem key={task.id}>
                <IonLabel>
                  <h3>{task.title}</h3>
                  <p>{task.subject} - Fecha límite: {task.dueDate}</p>
                  <p>{task.description}</p>
                </IonLabel>
                <IonChip
                  color={
                    task.priority === 'Alta' ? 'danger' :
                    task.priority === 'Media' ? 'warning' : 'success'
                  }
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

  const renderGrades = () => (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>
          <IonIcon icon={checkmarkCircle} slot="start" />
          Calificaciones
        </IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonButton
          expand="block"
          color="tertiary"
          onClick={() => setShowGradeModal(true)}
        >
          <IonIcon icon={add} slot="start" />
          Agregar Calificación
        </IonButton>

        <div style={{ marginTop: '20px' }}>
          <h3>Promedio General: 8.5</h3>
          <IonList>
            {grades.map((grade: any) => (
              <IonItem key={grade.id}>
                <IonLabel>
                  <h3>{grade.subject} - {grade.type}</h3>
                  <p>Calificación: {grade.grade}/10 - Fecha: {grade.date}</p>
                  {grade.comments && <p>{grade.comments}</p>}
                </IonLabel>
                <IonChip
                  color={parseFloat(grade.grade) >= 7 ? 'success' : 'danger'}
                  slot="end"
                >
                  {grade.grade}
                </IonChip>
              </IonItem>
            ))}
          </IonList>
        </div>
      </IonCardContent>
    </IonCard>
  );

  const renderSchedule = () => (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>
          <IonIcon icon={time} slot="start" />
          Horario Semanal
        </IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonGrid>
          {Object.entries(schedule).map(([day, classes]) => (
            <IonRow key={day}>
              <IonCol size="3">
                <strong>{day}</strong>
              </IonCol>
              <IonCol size="9">
                {classes.length > 0 ? (
                  classes.map((classItem: any, index: number) => (
                    <IonChip key={index} color="primary" style={{ margin: '2px' }}>
                      {classItem.name} ({classItem.time})
                    </IonChip>
                  ))
                ) : (
                  <span style={{ color: '#9CA3AF' }}>Sin clases</span>
                )}
              </IonCol>
            </IonRow>
          ))}
        </IonGrid>
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
          <IonTitle>Escuela</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonSegment
          value={activeSection}
          onIonChange={(e) => setActiveSection(e.detail.value!)}
          style={{ marginBottom: '20px' }}
        >
          <IonSegmentButton value="classes">
            <IonLabel>Clases</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="homework">
            <IonLabel>Tareas</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="grades">
            <IonLabel>Notas</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="schedule">
            <IonLabel>Horario</IonLabel>
          </IonSegmentButton>
        </IonSegment>

        {activeSection === 'classes' && renderClasses()}
        {activeSection === 'homework' && renderHomework()}
        {activeSection === 'grades' && renderGrades()}
        {activeSection === 'schedule' && renderSchedule()}

        {/* Modal para agregar clase */}
        <IonModal isOpen={showClassModal}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Agregar Clase</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowClassModal(false)}>
                  <IonIcon icon={close} />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonList>
              <IonItem>
                <IonLabel position="stacked">Nombre de la Clase</IonLabel>
                <IonInput
                  value={newClass.name}
                  placeholder="Matemáticas Avanzadas"
                  onIonChange={(e) => setNewClass({...newClass, name: e.detail.value!})}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Profesor</IonLabel>
                <IonInput
                  value={newClass.professor}
                  placeholder="Dr. García"
                  onIonChange={(e) => setNewClass({...newClass, professor: e.detail.value!})}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Horario</IonLabel>
                <IonInput
                  value={newClass.schedule}
                  placeholder="Lunes y Miércoles 10:00-11:30"
                  onIonChange={(e) => setNewClass({...newClass, schedule: e.detail.value!})}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Aula</IonLabel>
                <IonInput
                  value={newClass.classroom}
                  placeholder="Aula 201"
                  onIonChange={(e) => setNewClass({...newClass, classroom: e.detail.value!})}
                />
              </IonItem>
              <IonItem>
                <IonLabel>Color</IonLabel>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {colors.map((color) => (
                    <div
                      key={color}
                      onClick={() => setNewClass({...newClass, color})}
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        backgroundColor: color,
                        cursor: 'pointer',
                        border: newClass.color === color ? '3px solid #000' : '2px solid #ccc'
                      }}
                    />
                  ))}
                </div>
              </IonItem>
            </IonList>
            <IonButton
              expand="block"
              style={{ margin: '20px' }}
              onClick={addNewClass}
            >
              Agregar Clase
            </IonButton>
          </IonContent>
        </IonModal>

        {/* Modal para nueva tarea */}
        <IonModal isOpen={showHomeworkModal}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Nueva Tarea</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowHomeworkModal(false)}>
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
                  value={newHomework.title}
                  placeholder="Ensayo de Literatura"
                  onIonChange={(e) => setNewHomework({...newHomework, title: e.detail.value!})}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Materia</IonLabel>
                <IonInput
                  value={newHomework.subject}
                  placeholder="Literatura Española"
                  onIonChange={(e) => setNewHomework({...newHomework, subject: e.detail.value!})}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Descripción</IonLabel>
                <IonTextarea
                  value={newHomework.description}
                  placeholder="Análisis del Quijote..."
                  rows={3}
                  onIonChange={(e) => setNewHomework({...newHomework, description: e.detail.value!})}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Fecha de Entrega</IonLabel>
                <IonInput
                  type="date"
                  value={newHomework.dueDate}
                  onIonChange={(e) => setNewHomework({...newHomework, dueDate: e.detail.value!})}
                />
              </IonItem>
              <IonItem>
                <IonLabel>Prioridad</IonLabel>
                <IonSelect
                  value={newHomework.priority}
                  onSelectionChange={(e) => setNewHomework({...newHomework, priority: e.detail.value!})}
                >
                  <IonSelectOption value="Baja">Baja</IonSelectOption>
                  <IonSelectOption value="Media">Media</IonSelectOption>
                  <IonSelectOption value="Alta">Alta</IonSelectOption>
                </IonSelect>
              </IonItem>
            </IonList>
            <IonButton
              expand="block"
              style={{ margin: '20px' }}
              onClick={addHomework}
            >
              Crear Tarea
            </IonButton>
          </IonContent>
        </IonModal>

        {/* Modal para calificación */}
        <IonModal isOpen={showGradeModal}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Agregar Calificación</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowGradeModal(false)}>
                  <IonIcon icon={close} />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonList>
              <IonItem>
                <IonLabel position="stacked">Materia</IonLabel>
                <IonInput
                  value={newGrade.subject}
                  placeholder="Matemáticas"
                  onIonChange={(e) => setNewGrade({...newGrade, subject: e.detail.value!})}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Calificación (0-10)</IonLabel>
                <IonInput
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={newGrade.grade}
                  placeholder="8.5"
                  onIonChange={(e) => setNewGrade({...newGrade, grade: e.detail.value!})}
                />
              </IonItem>
              <IonItem>
                <IonLabel>Tipo de Evaluación</IonLabel>
                <IonSelect
                  value={newGrade.type}
                  onSelectionChange={(e) => setNewGrade({...newGrade, type: e.detail.value!})}
                >
                  <IonSelectOption value="Examen">Examen</IonSelectOption>
                  <IonSelectOption value="Trabajo Práctico">Trabajo Práctico</IonSelectOption>
                  <IonSelectOption value="Proyecto">Proyecto</IonSelectOption>
                  <IonSelectOption value="Tarea">Tarea</IonSelectOption>
                  <IonSelectOption value="Participación">Participación</IonSelectOption>
                </IonSelect>
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Fecha</IonLabel>
                <IonInput
                  type="date"
                  value={newGrade.date}
                  onIonChange={(e) => setNewGrade({...newGrade, date: e.detail.value!})}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Comentarios</IonLabel>
                <IonTextarea
                  value={newGrade.comments}
                  placeholder="Comentarios del profesor..."
                  rows={2}
                  onIonChange={(e) => setNewGrade({...newGrade, comments: e.detail.value!})}
                />
              </IonItem>
            </IonList>
            <IonButton
              expand="block"
              style={{ margin: '20px' }}
              onClick={addGrade}
            >
              Agregar Calificación
            </IonButton>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default School;
