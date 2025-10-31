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
  IonDatetime,
  IonItem,
  IonList,
  IonChip,
  IonAlert,
  IonGrid,
  IonRow,
  IonCol,
  IonFab,
  IonFabButton,
  IonToast,
} from '@ionic/react';
import {
  fitness,
  trophy,
  add,
  close,
  barbell,
  time,
  stopwatch,
  calendar,
  trash,
  create,
  checkmarkCircle,
  informationCircle,
} from 'ionicons/icons';

interface Exercise {
  name: string;
  sets: string;
  reps: string;
  weight: string;
  rest: string;
}

interface GymRoutine {
  name: string;
  description: string;
  exercises: Exercise[];
  duration: string;
  difficulty: string;
}

interface SportsGoal {
  sport: string;
  objective: string;
  targetDate: Date;
  currentProgress: string;
  notes: string;
}

const Exercise: React.FC = () => {
  const [activeSegment, setActiveSegment] = useState<string>('gym-routine');

  // Estados para rutinas de gimnasio
  const [gymRoutines, setGymRoutines] = useState<GymRoutine[]>([]);
  const [showGymModal, setShowGymModal] = useState(false);
  const [newRoutine, setNewRoutine] = useState<GymRoutine>({
    name: '',
    description: '',
    exercises: [],
    duration: '',
    difficulty: 'Principiante'
  });
  const [newExercise, setNewExercise] = useState<Exercise>({
    name: '',
    sets: '',
    reps: '',
    weight: '',
    rest: ''
  });

  // Estados para objetivos deportivos
  const [sportsGoals, setSportsGoals] = useState<SportsGoal[]>([]);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [newGoal, setNewGoal] = useState<SportsGoal>({
    sport: '',
    objective: '',
    targetDate: new Date(),
    currentProgress: '',
    notes: ''
  });

  // Estados para alertas y toasts
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const difficultyLevels = ['Principiante', 'Intermedio', 'Avanzado'];
  const sports = ['Fútbol', 'Básquetbol', 'Tenis', 'Natación', 'Ciclismo', 'Running', 'Yoga', 'Pilates', 'Crossfit', 'Boxeo', 'Artes Marciales', 'Otro'];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Principiante': return 'success';
      case 'Intermedio': return 'warning';
      case 'Avanzado': return 'danger';
      default: return 'primary';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'Principiante': return checkmarkCircle;
      case 'Intermedio': return informationCircle;
      case 'Avanzado': return stopwatch;
      default: return barbell;
    }
  };

  const handleAddGymRoutine = () => {
    if (!newRoutine.name.trim()) {
      setAlertMessage('Por favor ingresa un nombre para la rutina');
      setShowAlert(true);
      return;
    }

    setGymRoutines([...gymRoutines, { ...newRoutine }]);
    setNewRoutine({
      name: '',
      description: '',
      exercises: [],
      duration: '',
      difficulty: 'Principiante'
    });
    setShowGymModal(false);
    setToastMessage('Rutina agregada exitosamente');
    setShowToast(true);
  };

  const handleAddSportsGoal = () => {
    if (!newGoal.sport || !newGoal.objective.trim()) {
      setAlertMessage('Por favor selecciona un deporte e ingresa un objetivo');
      setShowAlert(true);
      return;
    }

    setSportsGoals([...sportsGoals, { ...newGoal }]);
    setNewGoal({
      sport: '',
      objective: '',
      targetDate: new Date(),
      currentProgress: '',
      notes: ''
    });
    setShowGoalModal(false);
    setToastMessage('Objetivo deportivo agregado exitosamente');
    setShowToast(true);
  };

  const handleAddExercise = () => {
    if (!newExercise.name.trim()) {
      setAlertMessage('Por favor ingresa el nombre del ejercicio');
      setShowAlert(true);
      return;
    }

    setNewRoutine({
      ...newRoutine,
      exercises: [...newRoutine.exercises, { ...newExercise }]
    });
    setNewExercise({
      name: '',
      sets: '',
      reps: '',
      weight: '',
      rest: ''
    });
  };

  const removeExercise = (index: number) => {
    const updatedExercises = newRoutine.exercises.filter((_, i) => i !== index);
    setNewRoutine({ ...newRoutine, exercises: updatedExercises });
  };

  const renderGymRoutines = () => (
    <IonContent className="ion-padding">
      {gymRoutines.length === 0 ? (
        <IonCard>
          <IonCardContent className="ion-text-center">
            <IonIcon icon={fitness} size="large" color="medium" />
            <IonText>
              <h3>No hay rutinas</h3>
              <p>Toca el botón + para crear tu primera rutina de gimnasio</p>
            </IonText>
          </IonCardContent>
        </IonCard>
      ) : (
        gymRoutines.map((routine, index) => (
          <IonCard key={index} className="routine-card">
            <IonCardHeader>
              <IonCardTitle className="routine-title">{routine.name}</IonCardTitle>
              <IonChip
                color={getDifficultyColor(routine.difficulty)}
                className="difficulty-chip"
              >
                <IonIcon icon={getDifficultyIcon(routine.difficulty)} />
                <IonLabel>{routine.difficulty}</IonLabel>
              </IonChip>
            </IonCardHeader>
            <IonCardContent>
              {routine.description && (
                <IonText className="routine-description">
                  <p>{routine.description}</p>
                </IonText>
              )}

              {routine.duration && (
                <IonItem lines="none" className="duration-item">
                  <IonIcon icon={time} slot="start" />
                  <IonLabel>Duración: {routine.duration}</IonLabel>
                </IonItem>
              )}

              {routine.exercises.length > 0 && (
                <div className="exercises-section">
                  <IonText>
                    <h4>Ejercicios:</h4>
                  </IonText>
                  {routine.exercises.map((exercise, exIndex) => (
                    <IonCard key={exIndex} className="exercise-card">
                      <IonCardContent>
                        <IonText>
                          <h5>{exercise.name}</h5>
                        </IonText>
                        <IonGrid>
                          <IonRow>
                            <IonCol size="3">
                              <IonText className="exercise-detail">
                                <IonIcon icon={barbell} />
                                {exercise.sets} series
                              </IonText>
                            </IonCol>
                            <IonCol size="3">
                              <IonText className="exercise-detail">
                                <IonIcon icon={checkmarkCircle} />
                                {exercise.reps} reps
                              </IonText>
                            </IonCol>
                            {exercise.weight && (
                              <IonCol size="3">
                                <IonText className="exercise-detail">
                                  <IonIcon icon={fitness} />
                                  {exercise.weight}kg
                                </IonText>
                              </IonCol>
                            )}
                            {exercise.rest && (
                              <IonCol size="3">
                                <IonText className="exercise-detail">
                                  <IonIcon icon={stopwatch} />
                                  {exercise.rest} min
                                </IonText>
                              </IonCol>
                            )}
                          </IonRow>
                        </IonGrid>
                      </IonCardContent>
                    </IonCard>
                  ))}
                </div>
              )}
            </IonCardContent>
          </IonCard>
        ))
      )}
    </IonContent>
  );

  const renderSportsGoals = () => (
    <IonContent className="ion-padding">
      {sportsGoals.length === 0 ? (
        <IonCard>
          <IonCardContent className="ion-text-center">
            <IonIcon icon={trophy} size="large" color="medium" />
            <IonText>
              <h3>No hay objetivos</h3>
              <p>Toca el botón + para crear tu primer objetivo deportivo</p>
            </IonText>
          </IonCardContent>
        </IonCard>
      ) : (
        sportsGoals.map((goal, index) => (
          <IonCard key={index} className="goal-card">
            <IonCardHeader>
              <IonCardTitle className="goal-title">{goal.sport}</IonCardTitle>
              <IonChip color="primary" className="date-chip">
                <IonIcon icon={calendar} />
                <IonLabel>{goal.targetDate.toLocaleDateString('es-ES')}</IonLabel>
              </IonChip>
            </IonCardHeader>
            <IonCardContent>
              <IonText className="goal-objective">
                <p>{goal.objective}</p>
              </IonText>

              {goal.currentProgress && (
                <IonItem lines="none" className="progress-item">
                  <IonIcon icon={checkmarkCircle} slot="start" />
                  <IonLabel>
                    <h3>Progreso Actual</h3>
                    <p>{goal.currentProgress}</p>
                  </IonLabel>
                </IonItem>
              )}

              {goal.notes && (
                <IonText className="goal-notes">
                  <p>{goal.notes}</p>
                </IonText>
              )}
            </IonCardContent>
          </IonCard>
        ))
      )}
    </IonContent>
  );

  return (
    <>
      <IonContent>
        <IonSegment
          value={activeSegment}
          onIonChange={(e) => setActiveSegment(e.detail.value!)}
          className="exercise-segment"
        >
          <IonSegmentButton value="gym-routine">
            <IonLabel>Rutinas</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="sports-goals">
            <IonLabel>Objetivos</IonLabel>
          </IonSegmentButton>
        </IonSegment>

        {activeSegment === 'gym-routine' ? renderGymRoutines() : renderSportsGoals()}

        {/* FAB Button */}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton
            onClick={() => activeSegment === 'gym-routine' ? setShowGymModal(true) : setShowGoalModal(true)}
          >
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      </IonContent>

      {/* Gym Routine Modal */}
      <IonModal isOpen={showGymModal} onDidDismiss={() => setShowGymModal(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Nueva Rutina de Gimnasio</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowGymModal(false)}>
                <IonIcon icon={close} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonList>
            <IonItem>
              <IonInput
                label="Nombre de la rutina"
                labelPlacement="stacked"
                placeholder="Ej: Rutina de Fuerza"
                value={newRoutine.name}
                onIonChange={(e) => setNewRoutine({ ...newRoutine, name: e.detail.value! })}
              />
            </IonItem>

            <IonItem>
              <IonTextarea
                label="Descripción"
                labelPlacement="stacked"
                placeholder="Describe el objetivo de esta rutina..."
                value={newRoutine.description}
                onIonChange={(e) => setNewRoutine({ ...newRoutine, description: e.detail.value! })}
                rows={3}
              />
            </IonItem>

            <IonItem>
              <IonInput
                label="Duración"
                labelPlacement="stacked"
                placeholder="Ej: 45 minutos"
                value={newRoutine.duration}
                onIonChange={(e) => setNewRoutine({ ...newRoutine, duration: e.detail.value! })}
              />
            </IonItem>

            <IonItem>
              <IonSelect
                label="Nivel de dificultad"
                labelPlacement="stacked"
                value={newRoutine.difficulty}
                onSelectionChange={(value) => setNewRoutine({ ...newRoutine, difficulty: value! })}
              >
                {difficultyLevels.map(level => (
                  <IonSelectOption key={level} value={level}>{level}</IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>
          </IonList>

          {/* Exercises Section */}
          <IonText>
            <h4>Ejercicios</h4>
          </IonText>

          {newRoutine.exercises.map((exercise, index) => (
            <IonCard key={index} className="exercise-input-card">
              <IonCardContent>
                <IonText className="exercise-number">Ejercicio {index + 1}</IonText>
                <IonInput
                  label="Nombre del ejercicio"
                  placeholder="Ej: Press de banca"
                  value={exercise.name}
                  readonly
                />
                <IonGrid>
                  <IonRow>
                    <IonCol size="6">
                      <IonInput
                        label="Series"
                        type="number"
                        value={exercise.sets}
                        readonly
                      />
                    </IonCol>
                    <IonCol size="6">
                      <IonInput
                        label="Repeticiones"
                        type="number"
                        value={exercise.reps}
                        readonly
                      />
                    </IonCol>
                    <IonCol size="6">
                      <IonInput
                        label="Peso (kg)"
                        type="number"
                        value={exercise.weight}
                        readonly
                      />
                    </IonCol>
                    <IonCol size="6">
                      <IonInput
                        label="Descanso (min)"
                        type="number"
                        value={exercise.rest}
                        readonly
                      />
                    </IonCol>
                  </IonRow>
                </IonGrid>
                <IonButton
                  fill="outline"
                  color="danger"
                  size="small"
                  onClick={() => removeExercise(index)}
                  className="remove-exercise-btn"
                >
                  <IonIcon icon={trash} slot="start" />
                  Eliminar
                </IonButton>
              </IonCardContent>
            </IonCard>
          ))}

          {/* Add Exercise Form */}
          <IonCard className="add-exercise-card">
            <IonCardContent>
              <IonText>
                <h5>Agregar Ejercicio</h5>
              </IonText>
              <IonInput
                label="Nombre del ejercicio"
                placeholder="Ej: Press de banca"
                value={newExercise.name}
                onIonChange={(e) => setNewExercise({ ...newExercise, name: e.detail.value! })}
              />
              <IonGrid>
                <IonRow>
                  <IonCol size="6">
                    <IonInput
                      label="Series"
                      type="number"
                      value={newExercise.sets}
                      onIonChange={(e) => setNewExercise({ ...newExercise, sets: e.detail.value! })}
                    />
                  </IonCol>
                  <IonCol size="6">
                    <IonInput
                      label="Repeticiones"
                      type="number"
                      value={newExercise.reps}
                      onIonChange={(e) => setNewExercise({ ...newExercise, reps: e.detail.value! })}
                    />
                  </IonCol>
                  <IonCol size="6">
                    <IonInput
                      label="Peso (kg)"
                      type="number"
                      value={newExercise.weight}
                      onIonChange={(e) => setNewExercise({ ...newExercise, weight: e.detail.value! })}
                    />
                  </IonCol>
                  <IonCol size="6">
                    <IonInput
                      label="Descanso (min)"
                      type="number"
                      value={newExercise.rest}
                      onIonChange={(e) => setNewExercise({ ...newExercise, rest: e.detail.value! })}
                    />
                  </IonCol>
                </IonRow>
              </IonGrid>
              <IonButton
                expand="block"
                onClick={handleAddExercise}
                disabled={!newExercise.name.trim()}
              >
                <IonIcon icon={add} slot="start" />
                Agregar Ejercicio
              </IonButton>
            </IonCardContent>
          </IonCard>

          <IonGrid>
            <IonRow>
              <IonCol>
                <IonButton
                  expand="block"
                  fill="outline"
                  onClick={() => setShowGymModal(false)}
                >
                  Cancelar
                </IonButton>
              </IonCol>
              <IonCol>
                <IonButton
                  expand="block"
                  onClick={handleAddGymRoutine}
                  disabled={!newRoutine.name.trim()}
                >
                  <IonIcon icon={checkmarkCircle} slot="start" />
                  Guardar Rutina
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonContent>
      </IonModal>

      {/* Sports Goal Modal */}
      <IonModal isOpen={showGoalModal} onDidDismiss={() => setShowGoalModal(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Nuevo Objetivo Deportivo</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowGoalModal(false)}>
                <IonIcon icon={close} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonList>
            <IonItem>
              <IonSelect
                label="Deporte"
                labelPlacement="stacked"
                placeholder="Selecciona un deporte"
                value={newGoal.sport}
                onSelectionChange={(value) => setNewGoal({ ...newGoal, sport: value! })}
              >
                {sports.map(sport => (
                  <IonSelectOption key={sport} value={sport}>{sport}</IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>

            <IonItem>
              <IonTextarea
                label="Objetivo"
                labelPlacement="stacked"
                placeholder="Describe tu objetivo específico..."
                value={newGoal.objective}
                onIonChange={(e) => setNewGoal({ ...newGoal, objective: e.detail.value! })}
                rows={3}
              />
            </IonItem>

            <IonItem>
              <IonDatetime
                presentation="date"
                value={newGoal.targetDate.toISOString()}
                onIonChange={(e) => setNewGoal({
                  ...newGoal,
                  targetDate: new Date(e.detail.value!)
                })}
              >
                <IonLabel slot="title">Fecha Objetivo</IonLabel>
              </IonDatetime>
            </IonItem>

            <IonItem>
              <IonTextarea
                label="Progreso Actual"
                labelPlacement="stacked"
                placeholder="Describe tu progreso actual..."
                value={newGoal.currentProgress}
                onIonChange={(e) => setNewGoal({ ...newGoal, currentProgress: e.detail.value! })}
                rows={2}
              />
            </IonItem>

            <IonItem>
              <IonTextarea
                label="Notas"
                labelPlacement="stacked"
                placeholder="Notas adicionales..."
                value={newGoal.notes}
                onIonChange={(e) => setNewGoal({ ...newGoal, notes: e.detail.value! })}
                rows={2}
              />
            </IonItem>
          </IonList>

          <IonGrid>
            <IonRow>
              <IonCol>
                <IonButton
                  expand="block"
                  fill="outline"
                  onClick={() => setShowGoalModal(false)}
                >
                  Cancelar
                </IonButton>
              </IonCol>
              <IonCol>
                <IonButton
                  expand="block"
                  onClick={handleAddSportsGoal}
                  disabled={!newGoal.sport || !newGoal.objective.trim()}
                >
                  <IonIcon icon={checkmarkCircle} slot="start" />
                  Guardar Objetivo
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

export default Exercise;
