import React, { useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonMenuButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonModal,
  IonChip,
} from '@ionic/react';
import {
  airplane,
  map,
  camera,
  add,
  close,
} from 'ionicons/icons';

const Travel: React.FC = () => {
  const [showTripModal, setShowTripModal] = useState(false);
  const [trips, setTrips] = useState([]);
  const [newTrip, setNewTrip] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    budget: '',
    notes: ''
  });

  const addTrip = () => {
    if (newTrip.destination && newTrip.startDate && newTrip.endDate) {
      setTrips([...trips, { ...newTrip, id: Date.now() }]);
      setNewTrip({
        destination: '',
        startDate: '',
        endDate: '',
        budget: '',
        notes: ''
      });
      setShowTripModal(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Viajes</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>
              <IonIcon icon={airplane} slot="start" />
              Planificación de Viajes
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonButton
              expand="block"
              color="primary"
              onClick={() => setShowTripModal(true)}
            >
              <IonIcon icon={add} slot="start" />
              Planificar Nuevo Viaje
            </IonButton>

            <div style={{ marginTop: '20px' }}>
              <h3>Mis Viajes</h3>
              <IonList>
                {trips.map((trip: any) => (
                  <IonItem key={trip.id}>
                    <IonLabel>
                      <h3>{trip.destination}</h3>
                      <p>{trip.startDate} - {trip.endDate}</p>
                      {trip.budget && <p>Presupuesto: ${trip.budget}</p>}
                    </IonLabel>
                    <IonChip color="primary" slot="end">
                      Planificado
                    </IonChip>
                  </IonItem>
                ))}
              </IonList>
            </div>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>
              <IonIcon icon={map} slot="start" />
              Destinos Favoritos
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonList>
              <IonItem>
                <IonLabel>
                  <h3>París, Francia</h3>
                  <p>Próximo viaje planificado</p>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>
                  <h3>Tokio, Japón</h3>
                  <p>Destino soñado</p>
                </IonLabel>
              </IonItem>
            </IonList>
          </IonCardContent>
        </IonCard>

        {/* Modal para planificar viaje */}
        <IonModal isOpen={showTripModal}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Planificar Viaje</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowTripModal(false)}>
                  <IonIcon icon={close} />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonList>
              <IonItem>
                <IonLabel position="stacked">Destino</IonLabel>
                <IonInput
                  value={newTrip.destination}
                  placeholder="Ej: París, Francia"
                  onIonChange={(e) => setNewTrip({...newTrip, destination: e.detail.value!})}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Fecha de Inicio</IonLabel>
                <IonInput
                  type="date"
                  value={newTrip.startDate}
                  onIonChange={(e) => setNewTrip({...newTrip, startDate: e.detail.value!})}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Fecha de Fin</IonLabel>
                <IonInput
                  type="date"
                  value={newTrip.endDate}
                  onIonChange={(e) => setNewTrip({...newTrip, endDate: e.detail.value!})}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Presupuesto Estimado</IonLabel>
                <IonInput
                  type="number"
                  value={newTrip.budget}
                  placeholder="5000"
                  onIonChange={(e) => setNewTrip({...newTrip, budget: e.detail.value!})}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Notas</IonLabel>
                <IonInput
                  value={newTrip.notes}
                  placeholder="Actividades planeadas..."
                  onIonChange={(e) => setNewTrip({...newTrip, notes: e.detail.value!})}
                />
              </IonItem>
            </IonList>
            <IonButton
              expand="block"
              style={{ margin: '20px' }}
              onClick={addTrip}
            >
              Planificar Viaje
            </IonButton>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Travel;
