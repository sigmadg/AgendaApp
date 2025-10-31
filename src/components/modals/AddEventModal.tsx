import React, { useState } from 'react';
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonChip,
} from '@ionic/react';
import {
  close,
  calendar,
  time,
  location,
  people,
} from 'ionicons/icons';

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEvent: (event: any) => void;
  selectedDate: string;
  selectedCategory?: string;
}

const EVENT_TYPES = [
  { key: 'Personal', label: 'Personal', color: 'primary' },
  { key: 'Trabajo', label: 'Trabajo', color: 'secondary' },
  { key: 'Social', label: 'Social', color: 'tertiary' },
  { key: 'Familiar', label: 'Familiar', color: 'success' },
  { key: 'Celebración', label: 'Celebración', color: 'warning' },
  { key: 'Otro', label: 'Otro', color: 'medium' },
];

const AddEventModal: React.FC<AddEventModalProps> = ({
  isOpen,
  onClose,
  onAddEvent,
  selectedDate,
  selectedCategory = 'personal'
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    time: '',
    duration: '',
    location: '',
    attendees: '',
    type: 'Personal'
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddEvent = () => {
    if (!formData.title.trim()) {
      alert('Por favor ingresa un título para el evento');
      return;
    }

    const event = {
      id: Date.now().toString(),
      title: formData.title.trim(),
      description: formData.description.trim(),
      date: selectedDate,
      time: formData.time,
      location: formData.location.trim(),
      attendees: formData.attendees ? formData.attendees.split(',').map(a => a.trim()) : [],
      type: formData.type,
      category: selectedCategory,
      createdAt: new Date().toISOString(),
    };

    onAddEvent(event);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      time: '',
      duration: '',
      location: '',
      attendees: '',
      type: 'Personal'
    });
    onClose();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryName = (category: string) => {
    const categoryNames: { [key: string]: string } = {
      personal: 'Mi Perfil',
      work: 'Trabajo',
      school: 'Escuela',
      health: 'Salud',
      finance: 'Finanzas',
      travel: 'Viajes',
      events: 'Eventos',
      languages: 'Idiomas',
      pets: 'Mascotas',
      selfcare: 'Cuidado Personal',
      reading: 'Lectura',
      movies: 'Películas'
    };
    return categoryNames[category] || 'Personal';
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={handleClose}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Agregar Evento</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleClose}>
              <IonIcon icon={close} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div style={{ padding: '16px' }}>
          <IonList lines="none" style={{ backgroundColor: 'transparent' }}>
            {/* Información del evento */}
            <div style={{
              backgroundColor: '#f8fafc',
              padding: '16px',
              borderRadius: '8px',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <IonIcon icon={calendar} color="primary" />
                <IonLabel style={{ margin: 0 }}>
                  <h3 style={{ margin: '0', color: '#1F2937' }}>
                    {formatDate(selectedDate)}
                  </h3>
                  <p style={{ margin: '0', color: '#6B7280', fontSize: '14px' }}>
                    Categoría: {getCategoryName(selectedCategory)}
                  </p>
                </IonLabel>
              </div>
            </div>

            {/* Formulario */}
            <IonItem style={{ marginBottom: '16px' }}>
              <IonLabel position="stacked">Título del Evento *</IonLabel>
              <IonInput
                value={formData.title}
                placeholder="Reunión semanal de equipo"
                onIonChange={(e) => handleInputChange('title', e.detail.value!)}
              />
            </IonItem>

            <IonItem style={{ marginBottom: '16px' }}>
              <IonLabel position="stacked">Hora</IonLabel>
              <IonInput
                type="time"
                value={formData.time}
                onIonChange={(e) => handleInputChange('time', e.detail.value!)}
              />
            </IonItem>

            <IonItem style={{ marginBottom: '16px' }}>
              <IonIcon icon={location} slot="start" color="medium" />
              <IonLabel position="stacked">Lugar</IonLabel>
              <IonInput
                value={formData.location}
                placeholder="Sala de conferencias A"
                onIonChange={(e) => handleInputChange('location', e.detail.value!)}
              />
            </IonItem>

            <IonItem style={{ marginBottom: '16px' }}>
              <IonIcon icon={people} slot="start" color="medium" />
              <IonLabel position="stacked">Asistentes</IonLabel>
              <IonInput
                value={formData.attendees}
                placeholder="juan@email.com, maria@email.com"
                onIonChange={(e) => handleInputChange('attendees', e.detail.value!)}
              />
            </IonItem>

            <IonItem style={{ marginBottom: '16px' }}>
              <IonLabel>Tipo de Evento</IonLabel>
              <IonSelect
                value={formData.type}
                onSelectionChange={(e) => handleInputChange('type', e.detail.value!)}
              >
                {EVENT_TYPES.map((type) => (
                  <IonSelectOption key={type.key} value={type.key}>
                    {type.label}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>

            <IonItem style={{ marginBottom: '16px' }}>
              <IonLabel position="stacked">Descripción</IonLabel>
              <IonTextarea
                value={formData.description}
                placeholder="Detalles del evento..."
                rows={3}
                onIonChange={(e) => handleInputChange('description', e.detail.value!)}
              />
            </IonItem>
          </IonList>

          {/* Vista previa del tipo seleccionado */}
          <div style={{
            backgroundColor: '#f8fafc',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#6B7280' }}>
              Vista previa:
            </p>
            <IonChip
              color={EVENT_TYPES.find(t => t.key === formData.type)?.color || 'medium'}
            >
              {EVENT_TYPES.find(t => t.key === formData.type)?.label || formData.type}
            </IonChip>
          </div>

          <IonButton
            expand="block"
            onClick={handleAddEvent}
            style={{
              '--background': '#3B82F6',
              '--border-radius': '12px',
              marginBottom: '16px'
            }}
          >
            <IonIcon icon={calendar} slot="start" />
            Crear Evento
          </IonButton>
        </div>
      </IonContent>
    </IonModal>
  );
};

export default AddEventModal;
