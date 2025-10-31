import React from 'react';
import {
  IonContent,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonText,
  IonIcon,
  IonItem,
  IonLabel,
  IonChip,
  IonBadge,
  IonGrid,
  IonRow,
  IonCol,
  IonAlert,
} from '@ionic/react';
import {
  calendar,
  list,
  time,
  location,
  people,
  create,
  trash,
  checkmarkCircle,
  informationCircle,
} from 'ionicons/icons';

interface Event {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime?: string;
  type: string;
  category: string;
  location?: string;
  attendees?: string[];
}

interface EventScheduleProps {
  events: Event[];
  onEditEvent: (event: Event) => void;
  onDeleteEvent: (eventId: string) => void;
  onAddEvent: () => void;
  title?: string;
  subtitle?: string;
}

const EventSchedule: React.FC<EventScheduleProps> = ({
  events,
  onEditEvent,
  onDeleteEvent,
  onAddEvent,
  title = "Eventos del Día",
  subtitle = "Tu agenda personalizada"
}) => {
  const [showDeleteAlert, setShowDeleteAlert] = React.useState(false);
  const [eventToDelete, setEventToDelete] = React.useState<Event | null>(null);

  const getEventTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'work': return 'primary';
      case 'personal': return 'secondary';
      case 'health': return 'success';
      case 'finance': return 'warning';
      case 'education': return 'tertiary';
      case 'social': return 'danger';
      case 'travel': return 'medium';
      default: return 'dark';
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'work': return 'briefcase';
      case 'personal': return 'person';
      case 'health': return 'medical';
      case 'finance': return 'cash';
      case 'education': return 'school';
      case 'social': return 'people';
      case 'travel': return 'airplane';
      default: return 'ellipse';
    }
  };

  const sortEventsByTime = (events: Event[]) => {
    return events.sort((a, b) => {
      const timeA = new Date(a.startTime).getTime();
      const timeB = new Date(b.startTime).getTime();
      return timeA - timeB;
    });
  };

  const getEventStats = () => {
    const totalEvents = events.length;
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const currentTime = now.toTimeString().split(' ')[0];

    const upcomingEvents = events.filter(event => {
      const eventDate = event.startTime.split('T')[0];
      const eventTime = event.startTime.split('T')[1]?.split('.')[0] || '00:00:00';

      if (eventDate > today) return true;
      if (eventDate === today && eventTime > currentTime) return true;
      return false;
    }).length;

    return { totalEvents, upcomingEvents };
  };

  const handleDeleteEvent = (event: Event) => {
    setEventToDelete(event);
    setShowDeleteAlert(true);
  };

  const confirmDelete = () => {
    if (eventToDelete) {
      onDeleteEvent(eventToDelete.id);
      setEventToDelete(null);
    }
    setShowDeleteAlert(false);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  };

  const sortedEvents = sortEventsByTime(events);
  const stats = getEventStats();

  return (
    <>
      <IonContent className="ion-padding">
        {/* Header */}
        <div className="schedule-header">
          <div className="header-icon">
            <IonIcon icon={calendar} size="large" color="primary" />
          </div>
          <div className="header-text">
            <IonText>
              <h2>{title}</h2>
              <p>{subtitle}</p>
            </IonText>
          </div>
        </div>

        {/* Statistics */}
        <IonGrid className="stats-grid">
          <IonRow>
            <IonCol size="6">
              <IonCard className="stat-card">
                <IonCardContent className="ion-text-center">
                  <IonIcon icon={list} size="large" color="primary" />
                  <IonText>
                    <h3>{stats.totalEvents}</h3>
                    <p>Total</p>
                  </IonText>
                </IonCardContent>
              </IonCard>
            </IonCol>
            <IonCol size="6">
              <IonCard className="stat-card">
                <IonCardContent className="ion-text-center">
                  <IonIcon icon={time} size="large" color="secondary" />
                  <IonText>
                    <h3>{stats.upcomingEvents}</h3>
                    <p>Próximos</p>
                  </IonText>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>

        {/* Events List */}
        {events.length === 0 ? (
          <IonCard className="empty-card">
            <IonCardContent className="ion-text-center">
              <IonIcon icon={calendar} size="large" color="medium" />
              <IonText>
                <h3>No hay eventos programados</h3>
                <p>Toca el botón + para agregar tu primer evento</p>
              </IonText>
              <div className="empty-tip">
                <IonIcon icon={informationCircle} color="secondary" />
                <IonText color="secondary">
                  <small>Los eventos te ayudan a mantenerte organizado</small>
                </IonText>
              </div>
            </IonCardContent>
          </IonCard>
        ) : (
          sortedEvents.map((event) => (
            <IonCard key={event.id} className="event-card">
              <IonCardHeader>
                <IonCardTitle className="event-title">{event.title}</IonCardTitle>
                <IonChip
                  color={getEventTypeColor(event.type)}
                  className="event-type-chip"
                >
                  <IonIcon icon={getEventTypeIcon(event.type)} />
                  <IonLabel>{event.type}</IonLabel>
                </IonChip>
              </IonCardHeader>
              <IonCardContent>
                <IonGrid>
                  <IonRow>
                    <IonCol size="12">
                      <IonItem lines="none" className="event-time-item">
                        <IonIcon icon={time} slot="start" />
                        <IonLabel>
                          <h3>{formatTime(event.startTime)}</h3>
                          <p>Hora de inicio</p>
                        </IonLabel>
                      </IonItem>
                    </IonCol>
                    {event.location && (
                      <IonCol size="12">
                        <IonItem lines="none" className="event-location-item">
                          <IonIcon icon={location} slot="start" />
                          <IonLabel>
                            <h3>{event.location}</h3>
                            <p>Ubicación</p>
                          </IonLabel>
                        </IonItem>
                      </IonCol>
                    )}
                    {event.attendees && event.attendees.length > 0 && (
                      <IonCol size="12">
                        <IonItem lines="none" className="event-attendees-item">
                          <IonIcon icon={people} slot="start" />
                          <IonLabel>
                            <h3>{event.attendees.join(', ')}</h3>
                            <p>Asistentes</p>
                          </IonLabel>
                        </IonItem>
                      </IonCol>
                    )}
                  </IonRow>
                  {event.description && (
                    <IonRow>
                      <IonCol size="12">
                        <IonText className="event-description">
                          <p>{event.description}</p>
                        </IonText>
                      </IonCol>
                    </IonRow>
                  )}
                  <IonRow>
                    <IonCol size="6">
                      <IonItem lines="none" className="event-actions">
                        <IonIcon
                          icon={create}
                          color="primary"
                          className="action-icon"
                          onClick={() => onEditEvent(event)}
                        />
                      </IonItem>
                    </IonCol>
                    <IonCol size="6">
                      <IonItem lines="none" className="event-actions">
                        <IonIcon
                          icon={trash}
                          color="danger"
                          className="action-icon"
                          onClick={() => handleDeleteEvent(event)}
                        />
                      </IonItem>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </IonCardContent>
            </IonCard>
          ))
        )}
      </IonContent>

      {/* Delete Alert */}
      <IonAlert
        isOpen={showDeleteAlert}
        onDidDismiss={() => setShowDeleteAlert(false)}
        header="Eliminar evento"
        message={`¿Estás seguro de que quieres eliminar "${eventToDelete?.title}"?`}
        buttons={[
          {
            text: 'Cancelar',
            role: 'cancel',
          },
          {
            text: 'Eliminar',
            role: 'destructive',
            handler: confirmDelete,
          },
        ]}
      />
    </>
  );
};

export default EventSchedule;
