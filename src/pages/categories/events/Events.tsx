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
  IonAlert,
} from '@ionic/react';
import {
  calendar,
  notifications,
  gift,
  people,
  map,
  add,
  close,
  checkmark,
  time,
} from 'ionicons/icons';

const Events: React.FC = () => {
  const [activeSection, setActiveSection] = useState('upcoming');
  const [showEventModal, setShowEventModal] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);

  // Estados para eventos
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    type: 'Personal',
    attendees: '',
    reminder: false,
    reminderTime: '15' // minutos antes
  });

  // Estados para cumpleaños
  const [birthdays, setBirthdays] = useState([]);
  const [newBirthday, setNewBirthday] = useState({
    name: '',
    date: '',
    relation: 'Familia',
    giftIdeas: '',
    notes: ''
  });

  // Estados para recordatorios
  const [reminders, setReminders] = useState([]);
  const [newReminder, setNewReminder] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    priority: 'Media',
    category: 'General',
    repeat: 'Nunca'
  });

  const eventTypes = [
    { value: 'Personal', label: 'Personal', color: 'primary' },
    { value: 'Trabajo', label: 'Trabajo', color: 'secondary' },
    { value: 'Social', label: 'Social', color: 'tertiary' },
    { value: 'Familiar', label: 'Familiar', color: 'success' },
    { value: 'Celebración', label: 'Celebración', color: 'warning' },
    { value: 'Otro', label: 'Otro', color: 'medium' }
  ];

  const addEvent = () => {
    if (newEvent.title && newEvent.date) {
      setEvents([...events, { ...newEvent, id: Date.now() }]);
      setNewEvent({
        title: '',
        date: '',
        time: '',
        location: '',
        description: '',
        type: 'Personal',
        attendees: '',
        reminder: false,
        reminderTime: '15'
      });
      setShowEventModal(false);
    }
  };

  const addBirthday = () => {
    if (newBirthday.name && newBirthday.date) {
      setBirthdays([...birthdays, { ...newBirthday, id: Date.now() }]);
      setNewBirthday({
        name: '',
        date: '',
        relation: 'Familia',
        giftIdeas: '',
        notes: ''
      });
    }
  };

  const addReminder = () => {
    if (newReminder.title && newReminder.date) {
      setReminders([...reminders, { ...newReminder, id: Date.now() }]);
      setNewReminder({
        title: '',
        description: '',
        date: '',
        time: '',
        priority: 'Media',
        category: 'General',
        repeat: 'Nunca'
      });
      setShowReminderModal(false);
    }
  };

  const getEventTypeColor = (type: string) => {
    const eventType = eventTypes.find(et => et.value === type);
    return eventType ? eventType.color : 'medium';
  };

  const renderUpcomingEvents = () => (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>
          <IonIcon icon={calendar} slot="start" />
          Próximos Eventos
        </IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonButton
          expand="block"
          color="primary"
          onClick={() => setShowEventModal(true)}
        >
          <IonIcon icon={add} slot="start" />
          Nuevo Evento
        </IonButton>

        <div style={{ marginTop: '20px' }}>
          <IonList>
            {events.map((event: any) => (
              <IonItem key={event.id}>
                <IonIcon icon={calendar} slot="start" />
                <IonLabel>
                  <h3>{event.title}</h3>
                  <p>{event.date} {event.time && `- ${event.time}`}</p>
                  {event.location && <p>Lugar: {event.location}</p>}
                  {event.description && <p>{event.description}</p>}
                </IonLabel>
                <IonChip color={getEventTypeColor(event.type)} slot="end">
                  {event.type}
                </IonChip>
              </IonItem>
            ))}
          </IonList>
        </div>
      </IonCardContent>
    </IonCard>
  );

  const renderBirthdays = () => (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>
          <IonIcon icon={gift} slot="start" />
          Cumpleaños
        </IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonButton
          expand="block"
          color="success"
          onClick={() => setShowEventModal(true)}
        >
          <IonIcon icon={add} slot="start" />
          Agregar Cumpleaños
        </IonButton>

        <div style={{ marginTop: '20px' }}>
          <IonList>
            {birthdays.map((birthday: any) => (
              <IonItem key={birthday.id}>
                <IonIcon icon={gift} slot="start" color="success" />
                <IonLabel>
                  <h3>{birthday.name}</h3>
                  <p>Cumpleaños: {birthday.date}</p>
                  <p>Relación: {birthday.relation}</p>
                  {birthday.giftIdeas && <p>Ideas de regalo: {birthday.giftIdeas}</p>}
                </IonLabel>
              </IonItem>
            ))}
          </IonList>
        </div>
      </IonCardContent>
    </IonCard>
  );

  const renderReminders = () => (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>
          <IonIcon icon={notifications} slot="start" />
          Recordatorios
        </IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonButton
          expand="block"
          color="warning"
          onClick={() => setShowReminderModal(true)}
        >
          <IonIcon icon={add} slot="start" />
          Nuevo Recordatorio
        </IonButton>

        <div style={{ marginTop: '20px' }}>
          <IonList>
            {reminders.map((reminder: any) => (
              <IonItem key={reminder.id}>
                <IonIcon icon={notifications} slot="start" color="warning" />
                <IonLabel>
                  <h3>{reminder.title}</h3>
                  <p>{reminder.date} {reminder.time && `- ${reminder.time}`}</p>
                  <p>Categoría: {reminder.category}</p>
                  {reminder.description && <p>{reminder.description}</p>}
                </IonLabel>
                <IonChip
                  color={
                    reminder.priority === 'Alta' ? 'danger' :
                    reminder.priority === 'Media' ? 'warning' : 'success'
                  }
                  slot="end"
                >
                  {reminder.priority}
                </IonChip>
              </IonItem>
            ))}
          </IonList>
        </div>
      </IonCardContent>
    </IonCard>
  );

  const renderCalendar = () => (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>
          <IonIcon icon={calendar} slot="start" />
          Calendario de Eventos
        </IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonGrid>
          <IonRow>
            <IonCol size="12">
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <h2>Septiembre 2024</h2>
              </div>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size="1.71">L</IonCol>
            <IonCol size="1.71">M</IonCol>
            <IonCol size="1.71">M</IonCol>
            <IonCol size="1.71">J</IonCol>
            <IonCol size="1.71">V</IonCol>
            <IonCol size="1.71">S</IonCol>
            <IonCol size="1.71">D</IonCol>
          </IonRow>
          {/* Aquí irían los días del mes con eventos marcados */}
          <IonRow>
            <IonCol size="1.71">
              <div style={{ padding: '8px', border: '1px solid #e5e7eb', borderRadius: '4px' }}>
                1
              </div>
            </IonCol>
            <IonCol size="1.71">
              <div style={{ padding: '8px', border: '1px solid #e5e7eb', borderRadius: '4px' }}>
                2
              </div>
            </IonCol>
            <IonCol size="1.71">
              <div style={{ padding: '8px', border: '1px solid #e5e7eb', borderRadius: '4px', backgroundColor: '#e0f2fe' }}>
                3
                <div style={{ fontSize: '10px', color: '#0369a1' }}>Evento</div>
              </div>
            </IonCol>
            <IonCol size="1.71">
              <div style={{ padding: '8px', border: '1px solid #e5e7eb', borderRadius: '4px' }}>
                4
              </div>
            </IonCol>
            <IonCol size="1.71">
              <div style={{ padding: '8px', border: '1px solid #e5e7eb', borderRadius: '4px', backgroundColor: '#fef3c7' }}>
                5
                <div style={{ fontSize: '10px', color: '#92400e' }}>Cumple</div>
              </div>
            </IonCol>
            <IonCol size="1.71">
              <div style={{ padding: '8px', border: '1px solid #e5e7eb', borderRadius: '4px' }}>
                6
              </div>
            </IonCol>
            <IonCol size="1.71">
              <div style={{ padding: '8px', border: '1px solid #e5e7eb', borderRadius: '4px' }}>
                7
              </div>
            </IonCol>
          </IonRow>
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
          <IonTitle>Eventos</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonSegment
          value={activeSection}
          onIonChange={(e) => setActiveSection(e.detail.value!)}
          style={{ marginBottom: '20px' }}
        >
          <IonSegmentButton value="upcoming">
            <IonLabel>Próximos</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="birthdays">
            <IonLabel>Cumpleaños</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="reminders">
            <IonLabel>Recordatorios</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="calendar">
            <IonLabel>Calendario</IonLabel>
          </IonSegmentButton>
        </IonSegment>

        {activeSection === 'upcoming' && renderUpcomingEvents()}
        {activeSection === 'birthdays' && renderBirthdays()}
        {activeSection === 'reminders' && renderReminders()}
        {activeSection === 'calendar' && renderCalendar()}

        {/* Modal para nuevo evento */}
        <IonModal isOpen={showEventModal}>
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
          <IonContent>
            <IonList>
              <IonItem>
                <IonLabel position="stacked">Título del Evento</IonLabel>
                <IonInput
                  value={newEvent.title}
                  placeholder="Fiesta de cumpleaños"
                  onIonChange={(e) => setNewEvent({...newEvent, title: e.detail.value!})}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Fecha</IonLabel>
                <IonInput
                  type="date"
                  value={newEvent.date}
                  onIonChange={(e) => setNewEvent({...newEvent, date: e.detail.value!})}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Hora</IonLabel>
                <IonInput
                  type="time"
                  value={newEvent.time}
                  onIonChange={(e) => setNewEvent({...newEvent, time: e.detail.value!})}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Lugar</IonLabel>
                <IonInput
                  value={newEvent.location}
                  placeholder="Casa de Juan"
                  onIonChange={(e) => setNewEvent({...newEvent, location: e.detail.value!})}
                />
              </IonItem>
              <IonItem>
                <IonLabel>Tipo de Evento</IonLabel>
                <IonSelect
                  value={newEvent.type}
                  onSelectionChange={(e) => setNewEvent({...newEvent, type: e.detail.value!})}
                >
                  {eventTypes.map((type) => (
                    <IonSelectOption key={type.value} value={type.value}>
                      {type.label}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Descripción</IonLabel>
                <IonTextarea
                  value={newEvent.description}
                  placeholder="Detalles del evento..."
                  rows={3}
                  onIonChange={(e) => setNewEvent({...newEvent, description: e.detail.value!})}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Asistentes</IonLabel>
                <IonTextarea
                  value={newEvent.attendees}
                  placeholder="Lista de invitados..."
                  rows={2}
                  onIonChange={(e) => setNewEvent({...newEvent, attendees: e.detail.value!})}
                />
              </IonItem>
            </IonList>
            <IonButton
              expand="block"
              style={{ margin: '20px' }}
              onClick={addEvent}
            >
              Crear Evento
            </IonButton>
          </IonContent>
        </IonModal>

        {/* Modal para recordatorios */}
        <IonModal isOpen={showReminderModal}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Nuevo Recordatorio</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowReminderModal(false)}>
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
                  value={newReminder.title}
                  placeholder="Llamar al dentista"
                  onIonChange={(e) => setNewReminder({...newReminder, title: e.detail.value!})}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Descripción</IonLabel>
                <IonTextarea
                  value={newReminder.description}
                  placeholder="Recordar pedir cita para limpieza..."
                  rows={2}
                  onIonChange={(e) => setNewReminder({...newReminder, description: e.detail.value!})}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Fecha</IonLabel>
                <IonInput
                  type="date"
                  value={newReminder.date}
                  onIonChange={(e) => setNewReminder({...newReminder, date: e.detail.value!})}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Hora</IonLabel>
                <IonInput
                  type="time"
                  value={newReminder.time}
                  onIonChange={(e) => setNewReminder({...newReminder, time: e.detail.value!})}
                />
              </IonItem>
              <IonItem>
                <IonLabel>Prioridad</IonLabel>
                <IonSelect
                  value={newReminder.priority}
                  onSelectionChange={(e) => setNewReminder({...newReminder, priority: e.detail.value!})}
                >
                  <IonSelectOption value="Baja">Baja</IonSelectOption>
                  <IonSelectOption value="Media">Media</IonSelectOption>
                  <IonSelectOption value="Alta">Alta</IonSelectOption>
                </IonSelect>
              </IonItem>
              <IonItem>
                <IonLabel>Categoría</IonLabel>
                <IonSelect
                  value={newReminder.category}
                  onSelectionChange={(e) => setNewReminder({...newReminder, category: e.detail.value!})}
                >
                  <IonSelectOption value="General">General</IonSelectOption>
                  <IonSelectOption value="Salud">Salud</IonSelectOption>
                  <IonSelectOption value="Trabajo">Trabajo</IonSelectOption>
                  <IonSelectOption value="Personal">Personal</IonSelectOption>
                  <IonSelectOption value="Familia">Familia</IonSelectOption>
                </IonSelect>
              </IonItem>
              <IonItem>
                <IonLabel>Repetir</IonLabel>
                <IonSelect
                  value={newReminder.repeat}
                  onSelectionChange={(e) => setNewReminder({...newReminder, repeat: e.detail.value!})}
                >
                  <IonSelectOption value="Nunca">Nunca</IonSelectOption>
                  <IonSelectOption value="Diario">Diario</IonSelectOption>
                  <IonSelectOption value="Semanal">Semanal</IonSelectOption>
                  <IonSelectOption value="Mensual">Mensual</IonSelectOption>
                  <IonSelectOption value="Anual">Anual</IonSelectOption>
                </IonSelect>
              </IonItem>
            </IonList>
            <IonButton
              expand="block"
              style={{ margin: '20px' }}
              onClick={addReminder}
            >
              Crear Recordatorio
            </IonButton>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Events;
