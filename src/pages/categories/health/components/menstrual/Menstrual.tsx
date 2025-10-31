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
  IonBadge,
} from '@ionic/react';
import {
  calendar,
  list,
  time,
  alarm,
  analytics,
  add,
  close,
  water,
  flame,
  heart,
  happy,
  sad,
  medical,
  checkmarkCircle,
  informationCircle,
  warning,
} from 'ionicons/icons';

interface PeriodEntry {
  date: Date;
  flow: 'light' | 'regular' | 'heavy';
  symptoms: string[];
  notes: string;
}

interface CycleReminder {
  id: string;
  type: 'period_start' | 'period_end' | 'ovulation' | 'fertile_window';
  daysBefore: number;
  isActive: boolean;
  message: string;
}

const Menstrual: React.FC = () => {
  const [activeSegment, setActiveSegment] = useState<string>('period-log');

  // Estados para registro de período
  const [periodEntries, setPeriodEntries] = useState<PeriodEntry[]>([]);
  const [showPeriodModal, setShowPeriodModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [newPeriodEntry, setNewPeriodEntry] = useState({
    flow: '',
    symptoms: [] as string[],
    notes: ''
  });

  // Estados para recordatorios de ciclo
  const [cycleReminders, setCycleReminders] = useState<CycleReminder[]>([
    {
      id: '1',
      type: 'period_start',
      daysBefore: 2,
      isActive: true,
      message: 'Tu período comenzará pronto'
    },
    {
      id: '2',
      type: 'ovulation',
      daysBefore: 1,
      isActive: true,
      message: 'Día de ovulación'
    }
  ]);

  // Estados para UI
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const symptomsList = [
    { key: 'cramps', label: 'Cólicos', icon: medical },
    { key: 'headache', label: 'Dolor de cabeza', icon: warning },
    { key: 'nausea', label: 'Náuseas', icon: sad },
    { key: 'fatigue', label: 'Cansancio', icon: heart },
    { key: 'mood_swings', label: 'Cambios de humor', icon: happy },
    { key: 'bloating', label: 'Hinchazón', icon: water },
    { key: 'back_pain', label: 'Dolor de espalda', icon: medical },
    { key: 'acne', label: 'Acné', icon: warning },
  ];

  const flowLevels = [
    { key: 'light', label: 'Leve', color: 'success', icon: water },
    { key: 'regular', label: 'Regular', color: 'warning', icon: flame },
    { key: 'heavy', label: 'Abundante', color: 'danger', icon: flame },
  ];

  const handleSavePeriodEntry = () => {
    if (!newPeriodEntry.flow) {
      setAlertMessage('Por favor selecciona la intensidad del flujo');
      setShowAlert(true);
      return;
    }

    const entry: PeriodEntry = {
      date: new Date(selectedDate),
      flow: newPeriodEntry.flow as 'light' | 'regular' | 'heavy',
      symptoms: newPeriodEntry.symptoms,
      notes: newPeriodEntry.notes
    };

    setPeriodEntries([...periodEntries, entry]);
    setNewPeriodEntry({ flow: '', symptoms: [], notes: '' });
    setShowPeriodModal(false);
    setToastMessage('Registro de período guardado exitosamente');
    setShowToast(true);
  };

  const toggleSymptom = (symptom: string) => {
    const currentSymptoms = newPeriodEntry.symptoms;
    if (currentSymptoms.includes(symptom)) {
      setNewPeriodEntry({
        ...newPeriodEntry,
        symptoms: currentSymptoms.filter(s => s !== symptom)
      });
    } else {
      setNewPeriodEntry({
        ...newPeriodEntry,
        symptoms: [...currentSymptoms, symptom]
      });
    }
  };

  const getFlowColor = (flow: string) => {
    switch (flow) {
      case 'light': return 'success';
      case 'regular': return 'warning';
      case 'heavy': return 'danger';
      default: return 'medium';
    }
  };

  const getFlowIcon = (flow: string) => {
    switch (flow) {
      case 'light': return water;
      case 'regular': return flame;
      case 'heavy': return flame;
      default: return water;
    }
  };

  const getSymptomIcon = (symptom: string) => {
    const symptomData = symptomsList.find(s => s.key === symptom);
    return symptomData ? symptomData.icon : medical;
  };

  const getReminderIcon = (type: string) => {
    switch (type) {
      case 'period_start': return calendar;
      case 'period_end': return checkmarkCircle;
      case 'ovulation': return heart;
      case 'fertile_window': return flame;
      default: return alarm;
    }
  };

  const getReminderColor = (type: string) => {
    switch (type) {
      case 'period_start': return 'danger';
      case 'period_end': return 'success';
      case 'ovulation': return 'primary';
      case 'fertile_window': return 'warning';
      default: return 'medium';
    }
  };

  const renderPeriodLog = () => (
    <IonContent className="ion-padding">
      <IonText>
        <h2>Registro de Período</h2>
        <p>Registra los detalles de tu ciclo menstrual</p>
      </IonText>

      {periodEntries.length === 0 ? (
        <IonCard>
          <IonCardContent className="ion-text-center">
            <IonIcon icon={calendar} size="large" color="medium" />
            <IonText>
              <h3>No hay registros</h3>
              <p>Toca el botón + para registrar tu primer período</p>
            </IonText>
          </IonCardContent>
        </IonCard>
      ) : (
        periodEntries
          .sort((a, b) => b.date.getTime() - a.date.getTime())
          .map((entry, index) => (
            <IonCard key={index} className="period-entry-card">
              <IonCardHeader>
                <IonCardTitle className="entry-date">
                  {entry.date.toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </IonCardTitle>
                <IonChip
                  color={getFlowColor(entry.flow)}
                  className="flow-chip"
                >
                  <IonIcon icon={getFlowIcon(entry.flow)} />
                  <IonLabel>{flowLevels.find(f => f.key === entry.flow)?.label}</IonLabel>
                </IonChip>
              </IonCardHeader>
              <IonCardContent>
                {entry.symptoms.length > 0 && (
                  <div className="symptoms-section">
                    <IonText>
                      <h4>Síntomas:</h4>
                    </IonText>
                    <div className="symptoms-chips">
                      {entry.symptoms.map(symptom => (
                        <IonChip key={symptom} color="medium" className="symptom-chip">
                          <IonIcon icon={getSymptomIcon(symptom)} />
                          <IonLabel>{symptomsList.find(s => s.key === symptom)?.label}</IonLabel>
                        </IonChip>
                      ))}
                    </div>
                  </div>
                )}

                {entry.notes && (
                  <IonText className="entry-notes">
                    <p>{entry.notes}</p>
                  </IonText>
                )}
              </IonCardContent>
            </IonCard>
          ))
      )}
    </IonContent>
  );

  const renderPeriodTracker = () => (
    <IonContent className="ion-padding">
      <IonText>
        <h2>Seguimiento de Período</h2>
        <p>Visualiza el patrón de tu ciclo menstrual</p>
      </IonText>

      <IonGrid>
        <IonRow>
          <IonCol size="6">
            <IonCard className="stats-card">
              <IonCardContent className="ion-text-center">
                <IonIcon icon={calendar} size="large" color="primary" />
                <IonText>
                  <h3>{periodEntries.length}</h3>
                  <p>Días registrados</p>
                </IonText>
              </IonCardContent>
            </IonCard>
          </IonCol>
          <IonCol size="6">
            <IonCard className="stats-card">
              <IonCardContent className="ion-text-center">
                <IonIcon icon={analytics} size="large" color="secondary" />
                <IonText>
                  <h3>{Math.round(periodEntries.filter(e => e.flow === 'heavy').length / Math.max(periodEntries.length, 1) * 100)}%</h3>
                  <p>Flujo abundante</p>
                </IonText>
              </IonCardContent>
            </IonCard>
          </IonCol>
        </IonRow>
      </IonGrid>

      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Últimos Registros</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          {periodEntries.slice(0, 5).map((entry, index) => (
            <IonItem key={index} lines="none">
              <IonIcon icon={getFlowIcon(entry.flow)} slot="start" color={getFlowColor(entry.flow)} />
              <IonLabel>
                <h3>{entry.date.toLocaleDateString('es-ES')}</h3>
                <p>Flujo: {flowLevels.find(f => f.key === entry.flow)?.label}</p>
                {entry.symptoms.length > 0 && (
                  <p>Síntomas: {entry.symptoms.length}</p>
                )}
              </IonLabel>
            </IonItem>
          ))}
        </IonCardContent>
      </IonCard>
    </IonContent>
  );

  const renderCycleDuration = () => (
    <IonContent className="ion-padding">
      <IonText>
        <h2>Duración del Ciclo</h2>
        <p>Analiza la duración promedio de tus ciclos</p>
      </IonText>

      <IonCard>
        <IonCardContent className="ion-text-center">
          <IonIcon icon={time} size="large" color="tertiary" />
          <IonText>
            <h3>28 días</h3>
            <p>Duración promedio del ciclo</p>
          </IonText>
        </IonCardContent>
      </IonCard>

      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Estadísticas del Ciclo</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <IonGrid>
            <IonRow>
              <IonCol size="6">
                <div className="stat-item">
                  <IonBadge color="success">21-35 días</IonBadge>
                  <IonText>
                    <p>Ciclo normal</p>
                  </IonText>
                </div>
              </IonCol>
              <IonCol size="6">
                <div className="stat-item">
                  <IonBadge color="warning">3-7 días</IonBadge>
                  <IonText>
                    <p>Duración período</p>
                  </IonText>
                </div>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCardContent>
      </IonCard>
    </IonContent>
  );

  const renderCycleReminder = () => (
    <IonContent className="ion-padding">
      <IonText>
        <h2>Recordatorios de Ciclo</h2>
        <p>Configura notificaciones para tu ciclo menstrual</p>
      </IonText>

      {cycleReminders.map(reminder => (
        <IonCard key={reminder.id} className="reminder-card">
          <IonCardContent>
            <IonGrid>
              <IonRow>
                <IonCol size="auto">
                  <IonIcon
                    icon={getReminderIcon(reminder.type)}
                    size="large"
                    color={reminder.isActive ? getReminderColor(reminder.type) : 'medium'}
                  />
                </IonCol>
                <IonCol>
                  <IonText>
                    <h4>{reminder.message}</h4>
                    <p>{reminder.daysBefore} días antes</p>
                  </IonText>
                </IonCol>
                <IonCol size="auto">
                  <IonChip
                    color={reminder.isActive ? 'success' : 'medium'}
                    onClick={() => {
                      setCycleReminders(reminders =>
                        reminders.map(r =>
                          r.id === reminder.id
                            ? { ...r, isActive: !r.isActive }
                            : r
                        )
                      );
                    }}
                  >
                    <IonLabel>{reminder.isActive ? 'Activo' : 'Inactivo'}</IonLabel>
                  </IonChip>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCardContent>
        </IonCard>
      ))}
    </IonContent>
  );

  const renderFlowMonitor = () => (
    <IonContent className="ion-padding">
      <IonText>
        <h2>Monitor de Flujo</h2>
        <p>Seguimiento detallado del flujo menstrual</p>
      </IonText>

      <IonGrid>
        {flowLevels.map(flow => {
          const count = periodEntries.filter(e => e.flow === flow.key).length;
          const percentage = periodEntries.length > 0 ? Math.round((count / periodEntries.length) * 100) : 0;

          return (
            <IonRow key={flow.key}>
              <IonCol size="12">
                <IonCard className="flow-monitor-card">
                  <IonCardContent>
                    <IonGrid>
                      <IonRow>
                        <IonCol size="auto">
                          <IonIcon icon={flow.icon} size="large" color={flow.color} />
                        </IonCol>
                        <IonCol>
                          <IonText>
                            <h4>{flow.label}</h4>
                            <p>{count} días ({percentage}%)</p>
                          </IonText>
                        </IonCol>
                      </IonRow>
                      <IonRow>
                        <IonCol size="12">
                          <div className="progress-bar">
                            <div
                              className={`progress-fill ${flow.color}`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </IonCol>
                      </IonRow>
                    </IonGrid>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            </IonRow>
          );
        })}
      </IonGrid>
    </IonContent>
  );

  return (
    <>
      <IonContent>
        <IonSegment
          value={activeSegment}
          onIonChange={(e) => setActiveSegment(e.detail.value!)}
          className="menstrual-segment"
        >
          <IonSegmentButton value="period-log">
            <IonLabel>Registro</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="period-tracker">
            <IonLabel>Seguimiento</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="cycle-duration">
            <IonLabel>Ciclo</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="cycle-reminder">
            <IonLabel>Recordatorios</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="flow-monitor">
            <IonLabel>Flujo</IonLabel>
          </IonSegmentButton>
        </IonSegment>

        {activeSegment === 'period-log' && renderPeriodLog()}
        {activeSegment === 'period-tracker' && renderPeriodTracker()}
        {activeSegment === 'cycle-duration' && renderCycleDuration()}
        {activeSegment === 'cycle-reminder' && renderCycleReminder()}
        {activeSegment === 'flow-monitor' && renderFlowMonitor()}

        {/* FAB Button */}
        {activeSegment === 'period-log' && (
          <IonFab vertical="bottom" horizontal="end" slot="fixed">
            <IonFabButton onClick={() => setShowPeriodModal(true)}>
              <IonIcon icon={add} />
            </IonFabButton>
          </IonFab>
        )}
      </IonContent>

      {/* Period Entry Modal */}
      <IonModal isOpen={showPeriodModal} onDidDismiss={() => setShowPeriodModal(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Registrar Período</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowPeriodModal(false)}>
                <IonIcon icon={close} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonList>
            <IonItem>
              <IonInput
                label="Fecha"
                labelPlacement="stacked"
                type="date"
                value={selectedDate}
                onIonChange={(e) => setSelectedDate(e.detail.value!)}
              />
            </IonItem>

            <IonItem>
              <IonSelect
                label="Intensidad del flujo"
                labelPlacement="stacked"
                placeholder="Selecciona la intensidad"
                value={newPeriodEntry.flow}
                onSelectionChange={(value) => setNewPeriodEntry({ ...newPeriodEntry, flow: value! })}
              >
                {flowLevels.map(flow => (
                  <IonSelectOption key={flow.key} value={flow.key}>
                    {flow.label}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>

            <IonItem>
              <IonTextarea
                label="Notas"
                labelPlacement="stacked"
                placeholder="Notas adicionales..."
                value={newPeriodEntry.notes}
                onIonChange={(e) => setNewPeriodEntry({ ...newPeriodEntry, notes: e.detail.value! })}
                rows={3}
              />
            </IonItem>
          </IonList>

          {/* Symptoms Selection */}
          <IonText>
            <h4>Síntomas</h4>
          </IonText>
          <IonGrid>
            <IonRow>
              {symptomsList.map(symptom => (
                <IonCol size="6" key={symptom.key}>
                  <IonChip
                    color={newPeriodEntry.symptoms.includes(symptom.key) ? 'primary' : 'medium'}
                    onClick={() => toggleSymptom(symptom.key)}
                    className="symptom-selection-chip"
                  >
                    <IonIcon icon={symptom.icon} />
                    <IonLabel>{symptom.label}</IonLabel>
                  </IonChip>
                </IonCol>
              ))}
            </IonRow>
          </IonGrid>

          <IonGrid>
            <IonRow>
              <IonCol>
                <IonButton
                  expand="block"
                  fill="outline"
                  onClick={() => setShowPeriodModal(false)}
                >
                  Cancelar
                </IonButton>
              </IonCol>
              <IonCol>
                <IonButton
                  expand="block"
                  onClick={handleSavePeriodEntry}
                  disabled={!newPeriodEntry.flow}
                >
                  <IonIcon icon={checkmarkCircle} slot="start" />
                  Guardar
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

export default Menstrual;
