import React from 'react';
import {
  IonItem,
  IonLabel,
  IonChip,
  IonIcon,
  IonText,
  IonButton,
} from '@ionic/react';
import {
  location,
  people,
  time,
  trash,
} from 'ionicons/icons';

interface Event {
  id: string;
  title: string;
  date: string;
  time?: string;
  location?: string;
  description?: string;
  type: string;
  attendees?: string[];
}

interface EventItemProps {
  event: Event;
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
}

const EventItem: React.FC<EventItemProps> = ({
  event,
  onEdit,
  onDelete,
  showActions = false
}) => {
  const formatTime = (timeString?: string) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
  };

  const getEventTypeColor = (type: string) => {
    const typeColors: { [key: string]: string } = {
      'Personal': 'primary',
      'Trabajo': 'secondary',
      'Social': 'tertiary',
      'Familiar': 'success',
      'Celebración': 'warning',
      'Otro': 'medium'
    };
    return typeColors[type] || 'medium';
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'Trabajo': return 'briefcase';
      case 'Social': return 'people';
      case 'Familiar': return 'heart';
      case 'Celebración': return 'gift';
      default: return 'calendar';
    }
  };

  return (
    <IonItem
      style={{
        '--border-radius': '12px',
        '--inner-padding-end': '8px',
        '--inner-padding-start': '8px',
        marginBottom: '8px',
        backgroundColor: '#ffffff',
        borderLeft: `4px solid var(--ion-color-${getEventTypeColor(event.type)}-shade)`
      }}
    >
      <IonIcon
        icon={getEventIcon(event.type)}
        slot="start"
        color={getEventTypeColor(event.type)}
        style={{ marginRight: '12px' }}
      />

      <IonLabel style={{ flex: 1 }}>
        <IonText style={{
          fontSize: '16px',
          fontWeight: '500',
          color: '#1F2937'
        }}>
          {event.title}
        </IonText>

        <br />

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
          {event.time && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <IonIcon icon={time} size="small" color="medium" />
              <IonText color="medium" style={{ fontSize: '12px' }}>
                {formatTime(event.time)}
              </IonText>
            </div>
          )}

          {event.location && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <IonIcon icon={location} size="small" color="medium" />
              <IonText color="medium" style={{ fontSize: '12px' }}>
                {event.location}
              </IonText>
            </div>
          )}
        </div>

        {event.description && (
          <IonText color="medium" style={{ fontSize: '14px', display: 'block', marginTop: '4px' }}>
            {event.description}
          </IonText>
        )}

        {event.attendees && event.attendees.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
            <IonIcon icon={people} size="small" color="medium" />
            <IonText color="medium" style={{ fontSize: '12px' }}>
              {event.attendees.length} asistente{event.attendees.length !== 1 ? 's' : ''}
            </IonText>
          </div>
        )}
      </IonLabel>

      <IonChip
        color={getEventTypeColor(event.type)}
        style={{ marginRight: showActions ? '8px' : '0' }}
      >
        {event.type}
      </IonChip>

      {showActions && (
        <div style={{ display: 'flex', gap: '8px' }}>
          {onEdit && (
            <IonButton
              fill="clear"
              color="primary"
              size="small"
              onClick={onEdit}
            >
              <IonIcon icon="create" />
            </IonButton>
          )}

          {onDelete && (
            <IonButton
              fill="clear"
              color="danger"
              size="small"
              onClick={onDelete}
            >
              <IonIcon icon={trash} />
            </IonButton>
          )}
        </div>
      )}
    </IonItem>
  );
};

export default EventItem;
