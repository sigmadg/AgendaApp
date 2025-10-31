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
  IonBadge,
} from '@ionic/react';
import {
  paw,
  medical,
  restaurant,
  time,
  add,
  close,
  notifications,
  heart,
} from 'ionicons/icons';

const Pets: React.FC = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [showPetModal, setShowPetModal] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [showVetModal, setShowVetModal] = useState(false);

  // Estados para mascotas
  const [pets, setPets] = useState([]);
  const [newPet, setNewPet] = useState({
    name: '',
    type: 'Perro',
    breed: '',
    age: '',
    weight: '',
    color: '',
    birthDate: '',
    notes: ''
  });

  // Estados para recordatorios
  const [reminders, setReminders] = useState([]);
  const [newReminder, setNewReminder] = useState({
    petId: '',
    type: 'Vacuna',
    title: '',
    date: '',
    frequency: 'Anual',
    notes: ''
  });

  // Estados para visitas veterinarias
  const [vetVisits, setVetVisits] = useState([]);
  const [newVetVisit, setNewVetVisit] = useState({
    petId: '',
    date: '',
    vetName: '',
    reason: '',
    diagnosis: '',
    treatment: '',
    cost: '',
    nextVisit: '',
    notes: ''
  });

  // Estados para alimentación
  const [feedingSchedule, setFeedingSchedule] = useState([]);
  const [newFeeding, setNewFeeding] = useState({
    petId: '',
    foodType: '',
    amount: '',
    frequency: '2 veces al día',
    time1: '',
    time2: '',
    specialNotes: ''
  });

  const addPet = () => {
    if (newPet.name && newPet.type) {
      setPets([...pets, { ...newPet, id: Date.now() }]);
      setNewPet({
        name: '',
        type: 'Perro',
        breed: '',
        age: '',
        weight: '',
        color: '',
        birthDate: '',
        notes: ''
      });
      setShowPetModal(false);
    }
  };

  const addReminder = () => {
    if (newReminder.title && newReminder.petId) {
      setReminders([...reminders, { ...newReminder, id: Date.now() }]);
      setNewReminder({
        petId: '',
        type: 'Vacuna',
        title: '',
        date: '',
        frequency: 'Anual',
        notes: ''
      });
      setShowReminderModal(false);
    }
  };

  const addVetVisit = () => {
    if (newVetVisit.date && newVetVisit.petId) {
      setVetVisits([...vetVisits, { ...newVetVisit, id: Date.now() }]);
      setNewVetVisit({
        petId: '',
        date: '',
        vetName: '',
        reason: '',
        diagnosis: '',
        treatment: '',
        cost: '',
        nextVisit: '',
        notes: ''
      });
      setShowVetModal(false);
    }
  };

  const addFeedingSchedule = () => {
    if (newFeeding.petId && newFeeding.foodType) {
      setFeedingSchedule([...feedingSchedule, { ...newFeeding, id: Date.now() }]);
      setNewFeeding({
        petId: '',
        foodType: '',
        amount: '',
        frequency: '2 veces al día',
        time1: '',
        time2: '',
        specialNotes: ''
      });
    }
  };

  const getPetName = (id: string) => {
    const pet = pets.find((p: any) => p.id === parseInt(id));
    return pet ? pet.name : 'Desconocida';
  };

  const renderOverview = () => (
    <div>
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>
            <IonIcon icon={paw} slot="start" />
            Mis Mascotas
          </IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <IonButton
            expand="block"
            color="primary"
            onClick={() => setShowPetModal(true)}
          >
            <IonIcon icon={add} slot="start" />
            Agregar Mascota
          </IonButton>

          <div style={{ marginTop: '20px' }}>
            <IonList>
              {pets.map((pet: any) => (
                <IonItem key={pet.id}>
                  <IonIcon icon={paw} slot="start" color="primary" />
                  <IonLabel>
                    <h3>{pet.name}</h3>
                    <p>{pet.type} - {pet.breed}</p>
                    <p>Edad: {pet.age} años - Peso: {pet.weight}kg</p>
                  </IonLabel>
                  <IonChip color="success" slot="end">
                    Saludable
                  </IonChip>
                </IonItem>
              ))}
            </IonList>
          </div>
        </IonCardContent>
      </IonCard>

      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Próximos Recordatorios</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <IonList>
            <IonItem>
              <IonIcon icon={medical} slot="start" color="danger" />
              <IonLabel>
                <h3>Vacuna antirrábica - Max</h3>
                <p>Próxima dosis: 15 Oct 2024</p>
              </IonLabel>
              <IonBadge color="danger" slot="end">Urgente</IonBadge>
            </IonItem>
            <IonItem>
              <IonIcon icon={time} slot="start" color="warning" />
              <IonLabel>
                <h3>Desparasitación - Luna</h3>
                <p>Próxima dosis: 20 Oct 2024</p>
              </IonLabel>
              <IonBadge color="warning" slot="end">Próximo</IonBadge>
            </IonItem>
          </IonList>
        </IonCardContent>
      </IonCard>
    </div>
  );

  const renderReminders = () => (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>
          <IonIcon icon={notifications} slot="start" />
          Recordatorios de Cuidado
        </IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonButton
          expand="block"
          color="secondary"
          onClick={() => setShowReminderModal(true)}
        >
          <IonIcon icon={add} slot="start" />
          Nuevo Recordatorio
        </IonButton>

        <div style={{ marginTop: '20px' }}>
          <IonList>
            {reminders.map((reminder: any) => (
              <IonItem key={reminder.id}>
                <IonIcon
                  icon={
                    reminder.type === 'Vacuna' ? medical :
                    reminder.type === 'Veterinario' ? heart : time
                  }
                  slot="start"
                  color={
                    reminder.type === 'Vacuna' ? 'danger' :
                    reminder.type === 'Veterinario' ? 'primary' : 'warning'
                  }
                />
                <IonLabel>
                  <h3>{reminder.title}</h3>
                  <p>{getPetName(reminder.petId)} - {reminder.date}</p>
                  <p>Frecuencia: {reminder.frequency}</p>
                  {reminder.notes && <p>{reminder.notes}</p>}
                </IonLabel>
                <IonChip color="primary" slot="end">
                  {reminder.type}
                </IonChip>
              </IonItem>
            ))}
          </IonList>
        </div>
      </IonCardContent>
    </IonCard>
  );

  const renderVetVisits = () => (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>
          <IonIcon icon={medical} slot="start" />
          Visitas Veterinarias
        </IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonButton
          expand="block"
          color="tertiary"
          onClick={() => setShowVetModal(true)}
        >
          <IonIcon icon={add} slot="start" />
          Nueva Visita
        </IonButton>

        <div style={{ marginTop: '20px' }}>
          <IonList>
            {vetVisits.map((visit: any) => (
              <IonItem key={visit.id}>
                <IonIcon icon={medical} slot="start" color="primary" />
                <IonLabel>
                  <h3>{getPetName(visit.petId)} - {visit.date}</h3>
                  <p>Dr. {visit.vetName} - {visit.reason}</p>
                  <p>Diagnóstico: {visit.diagnosis}</p>
                  {visit.cost && <p>Costo: ${visit.cost}</p>}
                </IonLabel>
              </IonItem>
            ))}
          </IonList>
        </div>
      </IonCardContent>
    </IonCard>
  );

  const renderFeeding = () => (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>
          <IonIcon icon={restaurant} slot="start" />
          Alimentación
        </IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonButton
          expand="block"
          color="success"
          onClick={addFeedingSchedule}
        >
          <IonIcon icon={add} slot="start" />
          Nuevo Horario de Alimentación
        </IonButton>

        <div style={{ marginTop: '20px' }}>
          <IonList>
            {feedingSchedule.map((feeding: any) => (
              <IonItem key={feeding.id}>
                <IonIcon icon={restaurant} slot="start" color="success" />
                <IonLabel>
                  <h3>{getPetName(feeding.petId)}</h3>
                  <p>{feeding.foodType} - {feeding.amount}</p>
                  <p>Frecuencia: {feeding.frequency}</p>
                  <p>Horarios: {feeding.time1} {feeding.time2 && `y ${feeding.time2}`}</p>
                  {feeding.specialNotes && <p>Notas: {feeding.specialNotes}</p>}
                </IonLabel>
              </IonItem>
            ))}
          </IonList>
        </div>
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
          <IonTitle>Mascotas</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonSegment
          value={activeSection}
          onIonChange={(e) => setActiveSection(e.detail.value!)}
          style={{ marginBottom: '20px' }}
        >
          <IonSegmentButton value="overview">
            <IonLabel>General</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="reminders">
            <IonLabel>Recordatorios</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="vet">
            <IonLabel>Veterinario</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="feeding">
            <IonLabel>Alimentación</IonLabel>
          </IonSegmentButton>
        </IonSegment>

        {activeSection === 'overview' && renderOverview()}
        {activeSection === 'reminders' && renderReminders()}
        {activeSection === 'vet' && renderVetVisits()}
        {activeSection === 'feeding' && renderFeeding()}

        {/* Modal para agregar mascota */}
        <IonModal isOpen={showPetModal}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Agregar Mascota</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowPetModal(false)}>
                  <IonIcon icon={close} />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonList>
              <IonItem>
                <IonLabel position="stacked">Nombre</IonLabel>
                <IonInput
                  value={newPet.name}
                  placeholder="Max"
                  onIonChange={(e) => setNewPet({...newPet, name: e.detail.value!})}
                />
              </IonItem>
              <IonItem>
                <IonLabel>Tipo</IonLabel>
                <IonSelect
                  value={newPet.type}
                  onSelectionChange={(e) => setNewPet({...newPet, type: e.detail.value!})}
                >
                  <IonSelectOption value="Perro">Perro</IonSelectOption>
                  <IonSelectOption value="Gato">Gato</IonSelectOption>
                  <IonSelectOption value="Pájaro">Pájaro</IonSelectOption>
                  <IonSelectOption value="Conejo">Conejo</IonSelectOption>
                  <IonSelectOption value="Otro">Otro</IonSelectOption>
                </IonSelect>
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Raza</IonLabel>
                <IonInput
                  value={newPet.breed}
                  placeholder="Labrador"
                  onIonChange={(e) => setNewPet({...newPet, breed: e.detail.value!})}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Edad (años)</IonLabel>
                <IonInput
                  type="number"
                  value={newPet.age}
                  placeholder="3"
                  onIonChange={(e) => setNewPet({...newPet, age: e.detail.value!})}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Peso (kg)</IonLabel>
                <IonInput
                  type="number"
                  value={newPet.weight}
                  placeholder="25"
                  onIonChange={(e) => setNewPet({...newPet, weight: e.detail.value!})}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Color</IonLabel>
                <IonInput
                  value={newPet.color}
                  placeholder="Marrón y blanco"
                  onIonChange={(e) => setNewPet({...newPet, color: e.detail.value!})}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Fecha de Nacimiento</IonLabel>
                <IonInput
                  type="date"
                  value={newPet.birthDate}
                  onIonChange={(e) => setNewPet({...newPet, birthDate: e.detail.value!})}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Notas Especiales</IonLabel>
                <IonTextarea
                  value={newPet.notes}
                  placeholder="Alergias, medicamentos, comportamiento..."
                  rows={3}
                  onIonChange={(e) => setNewPet({...newPet, notes: e.detail.value!})}
                />
              </IonItem>
            </IonList>
            <IonButton
              expand="block"
              style={{ margin: '20px' }}
              onClick={addPet}
            >
              Agregar Mascota
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
                <IonLabel>Mascota</IonLabel>
                <IonSelect
                  value={newReminder.petId}
                  onSelectionChange={(e) => setNewReminder({...newReminder, petId: e.detail.value!})}
                >
                  {pets.map((pet: any) => (
                    <IonSelectOption key={pet.id} value={pet.id.toString()}>
                      {pet.name}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>
              <IonItem>
                <IonLabel>Tipo</IonLabel>
                <IonSelect
                  value={newReminder.type}
                  onSelectionChange={(e) => setNewReminder({...newReminder, type: e.detail.value!})}
                >
                  <IonSelectOption value="Vacuna">Vacuna</IonSelectOption>
                  <IonSelectOption value="Desparasitación">Desparasitación</IonSelectOption>
                  <IonSelectOption value="Veterinario">Visita Veterinaria</IonSelectOption>
                  <IonSelectOption value="Baño">Baño</IonSelectOption>
                  <IonSelectOption value="Paseo">Paseo</IonSelectOption>
                  <IonSelectOption value="Otro">Otro</IonSelectOption>
                </IonSelect>
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Título</IonLabel>
                <IonInput
                  value={newReminder.title}
                  placeholder="Vacuna antirrábica"
                  onIonChange={(e) => setNewReminder({...newReminder, title: e.detail.value!})}
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
                <IonLabel>Frecuencia</IonLabel>
                <IonSelect
                  value={newReminder.frequency}
                  onSelectionChange={(e) => setNewReminder({...newReminder, frequency: e.detail.value!})}
                >
                  <IonSelectOption value="Una vez">Una vez</IonSelectOption>
                  <IonSelectOption value="Semanal">Semanal</IonSelectOption>
                  <IonSelectOption value="Mensual">Mensual</IonSelectOption>
                  <IonSelectOption value="Trimestral">Trimestral</IonSelectOption>
                  <IonSelectOption value="Semestral">Semestral</IonSelectOption>
                  <IonSelectOption value="Anual">Anual</IonSelectOption>
                </IonSelect>
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Notas</IonLabel>
                <IonTextarea
                  value={newReminder.notes}
                  placeholder="Detalles adicionales..."
                  rows={2}
                  onIonChange={(e) => setNewReminder({...newReminder, notes: e.detail.value!})}
                />
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

        {/* Modal para visita veterinaria */}
        <IonModal isOpen={showVetModal}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Nueva Visita Veterinaria</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowVetModal(false)}>
                  <IonIcon icon={close} />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonList>
              <IonItem>
                <IonLabel>Mascota</IonLabel>
                <IonSelect
                  value={newVetVisit.petId}
                  onSelectionChange={(e) => setNewVetVisit({...newVetVisit, petId: e.detail.value!})}
                >
                  {pets.map((pet: any) => (
                    <IonSelectOption key={pet.id} value={pet.id.toString()}>
                      {pet.name}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Fecha de Visita</IonLabel>
                <IonInput
                  type="date"
                  value={newVetVisit.date}
                  onIonChange={(e) => setNewVetVisit({...newVetVisit, date: e.detail.value!})}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Veterinario</IonLabel>
                <IonInput
                  value={newVetVisit.vetName}
                  placeholder="Dr. García"
                  onIonChange={(e) => setNewVetVisit({...newVetVisit, vetName: e.detail.value!})}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Motivo de Consulta</IonLabel>
                <IonInput
                  value={newVetVisit.reason}
                  placeholder="Chequeo rutinario"
                  onIonChange={(e) => setNewVetVisit({...newVetVisit, reason: e.detail.value!})}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Diagnóstico</IonLabel>
                <IonTextarea
                  value={newVetVisit.diagnosis}
                  placeholder="Diagnóstico del veterinario..."
                  rows={2}
                  onIonChange={(e) => setNewVetVisit({...newVetVisit, diagnosis: e.detail.value!})}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Tratamiento</IonLabel>
                <IonTextarea
                  value={newVetVisit.treatment}
                  placeholder="Medicamentos, cuidados especiales..."
                  rows={2}
                  onIonChange={(e) => setNewVetVisit({...newVetVisit, treatment: e.detail.value!})}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Costo ($)</IonLabel>
                <IonInput
                  type="number"
                  value={newVetVisit.cost}
                  placeholder="150"
                  onIonChange={(e) => setNewVetVisit({...newVetVisit, cost: e.detail.value!})}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Próxima Visita</IonLabel>
                <IonInput
                  type="date"
                  value={newVetVisit.nextVisit}
                  onIonChange={(e) => setNewVetVisit({...newVetVisit, nextVisit: e.detail.value!})}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Notas Adicionales</IonLabel>
                <IonTextarea
                  value={newVetVisit.notes}
                  placeholder="Observaciones, recomendaciones..."
                  rows={2}
                  onIonChange={(e) => setNewVetVisit({...newVetVisit, notes: e.detail.value!})}
                />
              </IonItem>
            </IonList>
            <IonButton
              expand="block"
              style={{ margin: '20px' }}
              onClick={addVetVisit}
            >
              Guardar Visita
            </IonButton>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Pets;
