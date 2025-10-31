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
  IonText,
} from '@ionic/react';
import {
  close,
  add,
  flag,
} from 'ionicons/icons';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: any) => void;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({
  isOpen,
  onClose,
  onAddTask
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Media',
    category: 'General'
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddTask = () => {
    if (!formData.title.trim()) {
      alert('Por favor ingresa una tarea válida');
      return;
    }

    const task = {
      id: Date.now().toString(),
      text: formData.title.trim(),
      description: formData.description.trim(),
      completed: false,
      priority: formData.priority,
      category: formData.category,
      createdAt: new Date().toISOString(),
    };

    onAddTask(task);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      priority: 'Media',
      category: 'General'
    });
    onClose();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Alta': return 'danger';
      case 'Media': return 'warning';
      case 'Baja': return 'success';
      default: return 'primary';
    }
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={handleClose}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Nueva Tarea</IonTitle>
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
            <IonItem style={{ marginBottom: '16px' }}>
              <IonLabel position="stacked">¿Qué necesitas hacer? *</IonLabel>
              <IonInput
                value={formData.title}
                placeholder="Completar informe mensual"
                maxlength={200}
                counter={true}
                onIonChange={(e) => handleInputChange('title', e.detail.value!)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddTask();
                  }
                }}
              />
            </IonItem>

            <IonItem style={{ marginBottom: '16px' }}>
              <IonLabel position="stacked">Descripción (opcional)</IonLabel>
              <IonTextarea
                value={formData.description}
                placeholder="Detalles adicionales..."
                rows={3}
                maxlength={500}
                counter={true}
                onIonChange={(e) => handleInputChange('description', e.detail.value!)}
              />
            </IonItem>

            <IonItem style={{ marginBottom: '16px' }}>
              <IonIcon icon={flag} slot="start" color="medium" />
              <IonLabel>Prioridad</IonLabel>
              <IonSelect
                value={formData.priority}
                onSelectionChange={(e) => handleInputChange('priority', e.detail.value!)}
              >
                <IonSelectOption value="Baja">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                    Baja
                  </div>
                </IonSelectOption>
                <IonSelectOption value="Media">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />
                    Media
                  </div>
                </IonSelectOption>
                <IonSelectOption value="Alta">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#EF4444' }} />
                    Alta
                  </div>
                </IonSelectOption>
              </IonSelect>
            </IonItem>

            <IonItem style={{ marginBottom: '16px' }}>
              <IonLabel>Categoría</IonLabel>
              <IonSelect
                value={formData.category}
                onSelectionChange={(e) => handleInputChange('category', e.detail.value!)}
              >
                <IonSelectOption value="General">General</IonSelectOption>
                <IonSelectOption value="Trabajo">Trabajo</IonSelectOption>
                <IonSelectOption value="Personal">Personal</IonSelectOption>
                <IonSelectOption value="Estudios">Estudios</IonSelectOption>
                <IonSelectOption value="Salud">Salud</IonSelectOption>
                <IonSelectOption value="Casa">Casa</IonSelectOption>
              </IonSelect>
            </IonItem>
          </IonList>

          {/* Vista previa */}
          <div style={{
            backgroundColor: '#f8fafc',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            <IonText style={{ fontSize: '14px', color: '#6B7280', marginBottom: '8px', display: 'block' }}>
              Vista previa de la tarea:
            </IonText>

            <div style={{
              backgroundColor: '#ffffff',
              padding: '12px',
              borderRadius: '8px',
              borderLeft: `4px solid var(--ion-color-${getPriorityColor(formData.priority).toLowerCase()}-shade)`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <IonText style={{
                  fontSize: '16px',
                  fontWeight: '500',
                  textDecoration: 'none'
                }}>
                  {formData.title || 'Título de la tarea'}
                </IonText>
                <span style={{
                  backgroundColor: `var(--ion-color-${getPriorityColor(formData.priority).toLowerCase()})`,
                  color: 'white',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '12px'
                }}>
                  {formData.priority}
                </span>
              </div>

              {formData.description && (
                <IonText style={{
                  fontSize: '14px',
                  color: '#6B7280',
                  display: 'block',
                  marginTop: '4px'
                }}>
                  {formData.description}
                </IonText>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <IonButton
              expand="block"
              fill="outline"
              onClick={handleClose}
              style={{ flex: 1 }}
            >
              Cancelar
            </IonButton>

            <IonButton
              expand="block"
              onClick={handleAddTask}
              disabled={!formData.title.trim()}
              style={{
                flex: 1,
                '--background': formData.title.trim() ? '#3B82F6' : '#9CA3AF',
                '--background-hover': formData.title.trim() ? '#2563EB' : '#9CA3AF'
              }}
            >
              <IonIcon icon={add} slot="start" />
              Agregar
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonModal>
  );
};

export default AddTaskModal;
