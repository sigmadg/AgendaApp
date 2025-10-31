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
  IonCheckbox,
  IonBadge,
} from '@ionic/react';
import {
  heart,
  water,
  bed,
  fitness,
  sparkles,
  add,
  close,
  checkmarkCircle,
  time,
} from 'ionicons/icons';

const Selfcare: React.FC = () => {
  const [activeSection, setActiveSection] = useState('routines');
  const [showRoutineModal, setShowRoutineModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);

  // Estados para rutinas diarias
  const [dailyRoutines, setDailyRoutines] = useState({
    morning: [],
    evening: [],
    weekly: []
  });

  const [newRoutine, setNewRoutine] = useState({
    timeOfDay: 'morning',
    title: '',
    description: '',
    duration: '',
    category: 'Bienestar',
    frequency: 'Diario',
    completed: false
  });

  // Estados para seguimiento diario
  const [dailyTracking, setDailyTracking] = useState({
    waterIntake: 0,
    sleepHours: 0,
    exerciseMinutes: 0,
    meditationMinutes: 0,
    mealsHealthy: 0,
    stressLevel: 5,
    moodLevel: 7
  });

  // Estados para metas de bienestar
  const [wellnessGoals, setWellnessGoals] = useState([]);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    targetValue: '',
    currentValue: '',
    unit: 'días',
    deadline: '',
    category: 'Salud'
  });

  // Estados para hábitos
  const [habits, setHabits] = useState([
    { id: 1, name: 'Beber 8 vasos de agua', completed: false, streak: 5 },
    { id: 2, name: 'Hacer ejercicio 30 min', completed: true, streak: 12 },
    { id: 3, name: 'Meditar 10 minutos', completed: false, streak: 3 },
    { id: 4, name: 'Leer 20 páginas', completed: true, streak: 8 },
  ]);

  const addRoutine = () => {
    if (newRoutine.title) {
      setDailyRoutines({
        ...dailyRoutines,
        [newRoutine.timeOfDay]: [
          ...dailyRoutines[newRoutine.timeOfDay as keyof typeof dailyRoutines],
          { ...newRoutine, id: Date.now() }
        ]
      });
      setNewRoutine({
        timeOfDay: 'morning',
        title: '',
        description: '',
        duration: '',
        category: 'Bienestar',
        frequency: 'Diario',
        completed: false
      });
      setShowRoutineModal(false);
    }
  };

  const addGoal = () => {
    if (newGoal.title && newGoal.targetValue) {
      setWellnessGoals([...wellnessGoals, { ...newGoal, id: Date.now() }]);
      setNewGoal({
        title: '',
        description: '',
        targetValue: '',
        currentValue: '',
        unit: 'días',
        deadline: '',
        category: 'Salud'
      });
      setShowGoalModal(false);
    }
  };

  const toggleHabit = (id: number) => {
    setHabits(habits.map(habit =>
      habit.id === id
        ? { ...habit, completed: !habit.completed, streak: habit.completed ? habit.streak - 1 : habit.streak + 1 }
        : habit
    ));
  };

  const renderRoutines = () => (
    <div>
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>
            <IonIcon icon={time} slot="start" />
            Rutinas Diarias
          </IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <IonGrid>
            <IonRow>
              <IonCol size="4">
                <IonButton
                  expand="block"
                  color="warning"
                  onClick={() => {
                    setNewRoutine({...newRoutine, timeOfDay: 'morning'});
                    setShowRoutineModal(true);
                  }}
                >
                  Mañana
                </IonButton>
              </IonCol>
              <IonCol size="4">
                <IonButton
                  expand="block"
                  color="primary"
                  onClick={() => {
                    setNewRoutine({...newRoutine, timeOfDay: 'evening'});
                    setShowRoutineModal(true);
                  }}
                >
                  Tarde
                </IonButton>
              </IonCol>
              <IonCol size="4">
                <IonButton
                  expand="block"
                  color="secondary"
                  onClick={() => {
                    setNewRoutine({...newRoutine, timeOfDay: 'weekly'});
                    setShowRoutineModal(true);
                  }}
                >
                  Semanal
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCardContent>
      </IonCard>

      {/* Rutina de la mañana */}
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>☀️ Rutina Matutina</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <IonList>
            {dailyRoutines.morning.map((routine: any) => (
              <IonItem key={routine.id}>
                <IonLabel>
                  <h3>{routine.title}</h3>
                  <p>{routine.description}</p>
                  <p>Duración: {routine.duration} min</p>
                </IonLabel>
                <IonChip color="warning" slot="end">
                  {routine.category}
                </IonChip>
              </IonItem>
            ))}
          </IonList>
        </IonCardContent>
      </IonCard>

      {/* Rutina de la noche */}
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>🌙 Rutina Nocturna</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <IonList>
            {dailyRoutines.evening.map((routine: any) => (
              <IonItem key={routine.id}>
                <IonLabel>
                  <h3>{routine.title}</h3>
                  <p>{routine.description}</p>
                  <p>Duración: {routine.duration} min</p>
                </IonLabel>
                <IonChip color="primary" slot="end">
                  {routine.category}
                </IonChip>
              </IonItem>
            ))}
          </IonList>
        </IonCardContent>
      </IonCard>
    </div>
  );

  const renderTracking = () => (
    <div>
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>
            <IonIcon icon={checkmarkCircle} slot="start" />
            Seguimiento Diario
          </IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <IonGrid>
            <IonRow>
              <IonCol size="6">
                <IonItem>
                  <IonIcon icon={water} slot="start" color="primary" />
                  <IonLabel position="stacked">Agua (vasos)</IonLabel>
                  <IonInput
                    type="number"
                    value={dailyTracking.waterIntake}
                    placeholder="8"
                    onIonChange={(e) => setDailyTracking({...dailyTracking, waterIntake: parseInt(e.detail.value!) || 0})}
                  />
                </IonItem>
              </IonCol>
              <IonCol size="6">
                <IonItem>
                  <IonIcon icon={bed} slot="start" color="secondary" />
                  <IonLabel position="stacked">Sueño (horas)</IonLabel>
                  <IonInput
                    type="number"
                    value={dailyTracking.sleepHours}
                    placeholder="8"
                    onIonChange={(e) => setDailyTracking({...dailyTracking, sleepHours: parseInt(e.detail.value!) || 0})}
                  />
                </IonItem>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol size="6">
                <IonItem>
                  <IonIcon icon={fitness} slot="start" color="tertiary" />
                  <IonLabel position="stacked">Ejercicio (min)</IonLabel>
                  <IonInput
                    type="number"
                    value={dailyTracking.exerciseMinutes}
                    placeholder="30"
                    onIonChange={(e) => setDailyTracking({...dailyTracking, exerciseMinutes: parseInt(e.detail.value!) || 0})}
                  />
                </IonItem>
              </IonCol>
              <IonCol size="6">
                <IonItem>
                  <IonIcon icon={sparkles} slot="start" color="success" />
                  <IonLabel position="stacked">Meditación (min)</IonLabel>
                  <IonInput
                    type="number"
                    value={dailyTracking.meditationMinutes}
                    placeholder="10"
                    onIonChange={(e) => setDailyTracking({...dailyTracking, meditationMinutes: parseInt(e.detail.value!) || 0})}
                  />
                </IonItem>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol size="6">
                <IonItem>
                  <IonLabel position="stacked">Comidas Saludables</IonLabel>
                  <IonInput
                    type="number"
                    value={dailyTracking.mealsHealthy}
                    placeholder="3"
                    onIonChange={(e) => setDailyTracking({...dailyTracking, mealsHealthy: parseInt(e.detail.value!) || 0})}
                  />
                </IonItem>
              </IonCol>
              <IonCol size="6">
                <IonItem>
                  <IonLabel position="stacked">Nivel de Estrés (1-10)</IonLabel>
                  <IonInput
                    type="number"
                    min="1"
                    max="10"
                    value={dailyTracking.stressLevel}
                    onIonChange={(e) => setDailyTracking({...dailyTracking, stressLevel: parseInt(e.detail.value!) || 5})}
                  />
                </IonItem>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCardContent>
      </IonCard>

      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Hábitos Diarios</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <IonList>
            {habits.map((habit) => (
              <IonItem key={habit.id}>
                <IonCheckbox
                  checked={habit.completed}
                  onIonChange={() => toggleHabit(habit.id)}
                  slot="start"
                />
                <IonLabel>
                  <h3 style={{ textDecoration: habit.completed ? 'line-through' : 'none' }}>
                    {habit.name}
                  </h3>
                  <p>Racha: {habit.streak} días</p>
                </IonLabel>
                <IonBadge color={habit.completed ? 'success' : 'medium'} slot="end">
                  {habit.completed ? '✓' : '○'}
                </IonBadge>
              </IonItem>
            ))}
          </IonList>
        </IonCardContent>
      </IonCard>
    </div>
  );

  const renderGoals = () => (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>
          <IonIcon icon={heart} slot="start" />
          Metas de Bienestar
        </IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonButton
          expand="block"
          color="primary"
          onClick={() => setShowGoalModal(true)}
        >
          <IonIcon icon={add} slot="start" />
          Nueva Meta
        </IonButton>

        <div style={{ marginTop: '20px' }}>
          <IonList>
            {wellnessGoals.map((goal: any) => (
              <IonItem key={goal.id}>
                <IonLabel>
                  <h3>{goal.title}</h3>
                  <p>{goal.description}</p>
                  <p>Progreso: {goal.currentValue}/{goal.targetValue} {goal.unit}</p>
                  <p>Fecha límite: {goal.deadline}</p>
                </IonLabel>
                <IonChip
                  color={parseFloat(goal.currentValue) >= parseFloat(goal.targetValue) ? 'success' : 'primary'}
                  slot="end"
                >
                  {Math.round((parseFloat(goal.currentValue) / parseFloat(goal.targetValue)) * 100)}%
                </IonChip>
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
          <IonTitle>Cuidado Personal</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonSegment
          value={activeSection}
          onIonChange={(e) => setActiveSection(e.detail.value!)}
          style={{ marginBottom: '20px' }}
        >
          <IonSegmentButton value="routines">
            <IonLabel>Rutinas</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="tracking">
            <IonLabel>Seguimiento</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="goals">
            <IonLabel>Metas</IonLabel>
          </IonSegmentButton>
        </IonSegment>

        {activeSection === 'routines' && renderRoutines()}
        {activeSection === 'tracking' && renderTracking()}
        {activeSection === 'goals' && renderGoals()}

        {/* Modal para nueva rutina */}
        <IonModal isOpen={showRoutineModal}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Nueva Rutina</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowRoutineModal(false)}>
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
                  value={newRoutine.title}
                  placeholder="Meditación matutina"
                  onIonChange={(e) => setNewRoutine({...newRoutine, title: e.detail.value!})}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Descripción</IonLabel>
                <IonTextarea
                  value={newRoutine.description}
                  placeholder="Técnicas de respiración profunda..."
                  rows={2}
                  onIonChange={(e) => setNewRoutine({...newRoutine, description: e.detail.value!})}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Duración (minutos)</IonLabel>
                <IonInput
                  type="number"
                  value={newRoutine.duration}
                  placeholder="15"
                  onIonChange={(e) => setNewRoutine({...newRoutine, duration: e.detail.value!})}
                />
              </IonItem>
              <IonItem>
                <IonLabel>Categoría</IonLabel>
                <IonSelect
                  value={newRoutine.category}
                  onSelectionChange={(e) => setNewRoutine({...newRoutine, category: e.detail.value!})}
                >
                  <IonSelectOption value="Bienestar">Bienestar</IonSelectOption>
                  <IonSelectOption value="Ejercicio">Ejercicio</IonSelectOption>
                  <IonSelectOption value="Alimentación">Alimentación</IonSelectOption>
                  <IonSelectOption value="Sueño">Sueño</IonSelectOption>
                  <IonSelectOption value="Meditación">Meditación</IonSelectOption>
                  <IonSelectOption value="Higiene">Higiene</IonSelectOption>
                </IonSelect>
              </IonItem>
              <IonItem>
                <IonLabel>Frecuencia</IonLabel>
                <IonSelect
                  value={newRoutine.frequency}
                  onSelectionChange={(e) => setNewRoutine({...newRoutine, frequency: e.detail.value!})}
                >
                  <IonSelectOption value="Diario">Diario</IonSelectOption>
                  <IonSelectOption value="Semanal">Semanal</IonSelectOption>
                  <IonSelectOption value="Mensual">Mensual</IonSelectOption>
                  <IonSelectOption value="Personalizado">Personalizado</IonSelectOption>
                </IonSelect>
              </IonItem>
            </IonList>
            <IonButton
              expand="block"
              style={{ margin: '20px' }}
              onClick={addRoutine}
            >
              Agregar Rutina
            </IonButton>
          </IonContent>
        </IonModal>

        {/* Modal para nueva meta */}
        <IonModal isOpen={showGoalModal}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Nueva Meta de Bienestar</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowGoalModal(false)}>
                  <IonIcon icon={close} />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonList>
              <IonItem>
                <IonLabel position="stacked">Título de la Meta</IonLabel>
                <IonInput
                  value={newGoal.title}
                  placeholder="Perder 5kg en 3 meses"
                  onIonChange={(e) => setNewGoal({...newGoal, title: e.detail.value!})}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Descripción</IonLabel>
                <IonTextarea
                  value={newGoal.description}
                  placeholder="Objetivo de pérdida de peso saludable..."
                  rows={2}
                  onIonChange={(e) => setNewGoal({...newGoal, description: e.detail.value!})}
                />
              </IonItem>
              <IonItem>
                <IonLabel>Categoría</IonLabel>
                <IonSelect
                  value={newGoal.category}
                  onSelectionChange={(e) => setNewGoal({...newGoal, category: e.detail.value!})}
                >
                  <IonSelectOption value="Salud">Salud</IonSelectOption>
                  <IonSelectOption value="Fitness">Fitness</IonSelectOption>
                  <IonSelectOption value="Bienestar Mental">Bienestar Mental</IonSelectOption>
                  <IonSelectOption value="Hábitos">Hábitos</IonSelectOption>
                  <IonSelectOption value="Nutrición">Nutrición</IonSelectOption>
                </IonSelect>
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Valor Objetivo</IonLabel>
                <IonInput
                  type="number"
                  value={newGoal.targetValue}
                  placeholder="5"
                  onIonChange={(e) => setNewGoal({...newGoal, targetValue: e.detail.value!})}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Valor Actual</IonLabel>
                <IonInput
                  type="number"
                  value={newGoal.currentValue}
                  placeholder="0"
                  onIonChange={(e) => setNewGoal({...newGoal, currentValue: e.detail.value!})}
                />
              </IonItem>
              <IonItem>
                <IonLabel>Unidad</IonLabel>
                <IonSelect
                  value={newGoal.unit}
                  onSelectionChange={(e) => setNewGoal({...newGoal, unit: e.detail.value!})}
                >
                  <IonSelectOption value="kg">Kilogramos</IonSelectOption>
                  <IonSelectOption value="días">Días</IonSelectOption>
                  <IonSelectOption value="horas">Horas</IonSelectOption>
                  <IonSelectOption value="veces">Veces</IonSelectOption>
                  <IonSelectOption value="%">Porcentaje</IonSelectOption>
                </IonSelect>
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Fecha Límite</IonLabel>
                <IonInput
                  type="date"
                  value={newGoal.deadline}
                  onIonChange={(e) => setNewGoal({...newGoal, deadline: e.detail.value!})}
                />
              </IonItem>
            </IonList>
            <IonButton
              expand="block"
              style={{ margin: '20px' }}
              onClick={addGoal}
            >
              Crear Meta
            </IonButton>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Selfcare;
