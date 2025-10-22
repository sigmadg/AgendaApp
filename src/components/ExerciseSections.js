import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';

const ExerciseSections = () => {
  // Estados para las diferentes secciones
  const [activeSection, setActiveSection] = useState('gym-routine');
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalType, setModalType] = useState('');
  
  // Estados para rutinas de gimnasio
  const [gymRoutines, setGymRoutines] = useState([]);
  
  // Estados para objetivos deportivos
  const [sportsGoals, setSportsGoals] = useState([]);
  
  // Estados para el modal
  const [newRoutine, setNewRoutine] = useState({
    name: '',
    description: '',
    exercises: [],
    duration: '',
    difficulty: 'Principiante'
  });
  
  const [newGoal, setNewGoal] = useState({
    sport: '',
    objective: '',
    targetDate: new Date(),
    currentProgress: '',
    notes: ''
  });
  
  const [newExercise, setNewExercise] = useState({
    name: '',
    sets: '',
    reps: '',
    weight: '',
    rest: ''
  });

  const sections = [
    { id: 'gym-routine', name: 'Rutina de Gimnasio', icon: 'fitness-outline' },
    { id: 'sports-goals', name: 'Objetivos Deportivos', icon: 'trophy-outline' }
  ];

  const difficultyLevels = ['Principiante', 'Intermedio', 'Avanzado'];
  const sports = ['Fútbol', 'Básquetbol', 'Tenis', 'Natación', 'Ciclismo', 'Running', 'Yoga', 'Pilates', 'Crossfit', 'Boxeo', 'Artes Marciales', 'Otro'];

  const renderSectionTabs = () => (
    <View style={styles.tabsContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll}>
        {sections.map((section) => (
          <TouchableOpacity
            key={section.id}
            style={[
              styles.tab,
              activeSection === section.id && styles.activeTab
            ]}
            onPress={() => setActiveSection(section.id)}
          >
            <Icon 
              name={section.icon} 
              size={20} 
              color={activeSection === section.id ? '#FFFFFF' : '#6c757d'} 
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderGymRoutine = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>RUTINA DE GIMNASIO</Text>
        <TouchableOpacity onPress={() => {
          setModalType('gym-routine');
          setShowAddModal(true);
        }} style={styles.addButton}>
          <Icon name="add" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.routinesContainer}>
        {gymRoutines.map((routine, index) => (
          <View key={index} style={styles.routineCard}>
            <View style={styles.routineHeader}>
              <Text style={styles.routineName}>{routine.name}</Text>
              <View style={[styles.difficultyBadge, 
                routine.difficulty === 'Principiante' && styles.difficultyBeginner,
                routine.difficulty === 'Intermedio' && styles.difficultyIntermediate,
                routine.difficulty === 'Avanzado' && styles.difficultyAdvanced
              ]}>
                <Text style={styles.difficultyText}>{routine.difficulty}</Text>
              </View>
            </View>
            
            <Text style={styles.routineDescription}>{routine.description}</Text>
            <Text style={styles.routineDuration}>Duración: {routine.duration}</Text>
            
            <View style={styles.exercisesContainer}>
              <Text style={styles.exercisesTitle}>EJERCICIOS:</Text>
              {routine.exercises.map((exercise, exIndex) => (
                <View key={exIndex} style={styles.exerciseItem}>
                  <Text style={styles.exerciseName}>• {exercise.name}</Text>
                  <Text style={styles.exerciseDetails}>
                    {exercise.sets} series x {exercise.reps} repeticiones
                    {exercise.weight && ` @ ${exercise.weight}kg`}
                    {exercise.rest && ` (${exercise.rest} min descanso)`}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderSportsGoals = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>OBJETIVOS DEPORTIVOS</Text>
        <TouchableOpacity onPress={() => {
          setModalType('sports-goal');
          setShowAddModal(true);
        }} style={styles.addButton}>
          <Icon name="add" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.goalsContainer}>
        {sportsGoals.map((goal, index) => (
          <View key={index} style={styles.goalCard}>
            <View style={styles.goalHeader}>
              <Text style={styles.goalSport}>{goal.sport}</Text>
              <Text style={styles.goalDate}>
                {goal.targetDate.toLocaleDateString('es-ES')}
              </Text>
            </View>
            
            <Text style={styles.goalObjective}>{goal.objective}</Text>
            
            <View style={styles.progressContainer}>
              <Text style={styles.progressLabel}>Progreso Actual:</Text>
              <Text style={styles.progressText}>{goal.currentProgress}</Text>
            </View>
            
            {goal.notes && (
              <Text style={styles.goalNotes}>Notas: {goal.notes}</Text>
            )}
          </View>
        ))}
      </View>
    </View>
  );

  const renderGymRoutineModal = () => (
    <Modal
      visible={showAddModal && modalType === 'gym-routine'}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowAddModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Nueva Rutina de Gimnasio</Text>
            <TouchableOpacity onPress={() => setShowAddModal(false)} style={styles.closeButton}>
              <Icon name="close" size={24} color="#6c757d" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nombre de la Rutina:</Text>
              <TextInput
                style={styles.textInput}
                value={newRoutine.name}
                onChangeText={(text) => setNewRoutine({...newRoutine, name: text})}
                placeholder="Ej: Rutina de Fuerza"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Descripción:</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={newRoutine.description}
                onChangeText={(text) => setNewRoutine({...newRoutine, description: text})}
                placeholder="Describe el objetivo de esta rutina..."
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Duración:</Text>
              <TextInput
                style={styles.textInput}
                value={newRoutine.duration}
                onChangeText={(text) => setNewRoutine({...newRoutine, duration: text})}
                placeholder="Ej: 45 minutos"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nivel de Dificultad:</Text>
              <View style={styles.difficultySelector}>
                {difficultyLevels.map((level) => (
                  <TouchableOpacity
                    key={level}
                    style={[
                      styles.difficultyOption,
                      newRoutine.difficulty === level && styles.difficultyOptionSelected
                    ]}
                    onPress={() => setNewRoutine({...newRoutine, difficulty: level})}
                  >
                    <Text style={[
                      styles.difficultyOptionText,
                      newRoutine.difficulty === level && styles.difficultyOptionTextSelected
                    ]}>
                      {level}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Ejercicios:</Text>
              {newRoutine.exercises.map((exercise, index) => (
                <View key={index} style={styles.exerciseInput}>
                  <Text style={styles.exerciseNumber}>Ejercicio {index + 1}:</Text>
                  <TextInput
                    style={styles.textInput}
                    value={exercise.name}
                    onChangeText={(text) => {
                      const updatedExercises = [...newRoutine.exercises];
                      updatedExercises[index] = {...exercise, name: text};
                      setNewRoutine({...newRoutine, exercises: updatedExercises});
                    }}
                    placeholder="Nombre del ejercicio"
                  />
                  <View style={styles.exerciseDetails}>
                    <TextInput
                      style={[styles.textInput, styles.exerciseDetailInput]}
                      value={exercise.sets}
                      onChangeText={(text) => {
                        const updatedExercises = [...newRoutine.exercises];
                        updatedExercises[index] = {...exercise, sets: text};
                        setNewRoutine({...newRoutine, exercises: updatedExercises});
                      }}
                      placeholder="Series"
                      keyboardType="numeric"
                    />
                    <TextInput
                      style={[styles.textInput, styles.exerciseDetailInput]}
                      value={exercise.reps}
                      onChangeText={(text) => {
                        const updatedExercises = [...newRoutine.exercises];
                        updatedExercises[index] = {...exercise, reps: text};
                        setNewRoutine({...newRoutine, exercises: updatedExercises});
                      }}
                      placeholder="Reps"
                      keyboardType="numeric"
                    />
                    <TextInput
                      style={[styles.textInput, styles.exerciseDetailInput]}
                      value={exercise.weight}
                      onChangeText={(text) => {
                        const updatedExercises = [...newRoutine.exercises];
                        updatedExercises[index] = {...exercise, weight: text};
                        setNewRoutine({...newRoutine, exercises: updatedExercises});
                      }}
                      placeholder="Peso (kg)"
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              ))}
              
              <TouchableOpacity
                style={styles.addExerciseButton}
                onPress={() => setNewRoutine({
                  ...newRoutine,
                  exercises: [...newRoutine.exercises, {name: '', sets: '', reps: '', weight: '', rest: ''}]
                })}
              >
                <Icon name="add" size={16} color="#45B7D1" />
                <Text style={styles.addExerciseText}>Agregar Ejercicio</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          <View style={styles.modalActions}>
            <TouchableOpacity 
              onPress={() => setShowAddModal(false)} 
              style={styles.cancelButton}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => {
                if (newRoutine.name.trim()) {
                  setGymRoutines([...gymRoutines, {...newRoutine}]);
                  setNewRoutine({name: '', description: '', exercises: [], duration: '', difficulty: 'Principiante'});
                  setShowAddModal(false);
                } else {
                  Alert.alert('Error', 'Por favor ingresa un nombre para la rutina');
                }
              }} 
              style={styles.saveButton}
            >
              <Text style={styles.saveButtonText}>Guardar Rutina</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderSportsGoalModal = () => (
    <Modal
      visible={showAddModal && modalType === 'sports-goal'}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowAddModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Nuevo Objetivo Deportivo</Text>
            <TouchableOpacity onPress={() => setShowAddModal(false)} style={styles.closeButton}>
              <Icon name="close" size={24} color="#6c757d" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Deporte:</Text>
              <View style={styles.sportsSelector}>
                {sports.map((sport) => (
                  <TouchableOpacity
                    key={sport}
                    style={[
                      styles.sportOption,
                      newGoal.sport === sport && styles.sportOptionSelected
                    ]}
                    onPress={() => setNewGoal({...newGoal, sport})}
                  >
                    <Text style={[
                      styles.sportOptionText,
                      newGoal.sport === sport && styles.sportOptionTextSelected
                    ]}>
                      {sport}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Objetivo:</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={newGoal.objective}
                onChangeText={(text) => setNewGoal({...newGoal, objective: text})}
                placeholder="Describe tu objetivo específico..."
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Fecha Objetivo:</Text>
              <DateTimePicker
                value={newGoal.targetDate}
                mode="date"
                display="default"
                onChange={(event, date) => {
                  if (date) setNewGoal({...newGoal, targetDate: date});
                }}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Progreso Actual:</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={newGoal.currentProgress}
                onChangeText={(text) => setNewGoal({...newGoal, currentProgress: text})}
                placeholder="Describe tu progreso actual..."
                multiline
                numberOfLines={2}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Notas:</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={newGoal.notes}
                onChangeText={(text) => setNewGoal({...newGoal, notes: text})}
                placeholder="Notas adicionales..."
                multiline
                numberOfLines={2}
                textAlignVertical="top"
              />
            </View>
          </ScrollView>

          <View style={styles.modalActions}>
            <TouchableOpacity 
              onPress={() => setShowAddModal(false)} 
              style={styles.cancelButton}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => {
                if (newGoal.sport && newGoal.objective.trim()) {
                  setSportsGoals([...sportsGoals, {...newGoal}]);
                  setNewGoal({sport: '', objective: '', targetDate: new Date(), currentProgress: '', notes: ''});
                  setShowAddModal(false);
                } else {
                  Alert.alert('Error', 'Por favor selecciona un deporte e ingresa un objetivo');
                }
              }} 
              style={styles.saveButton}
            >
              <Text style={styles.saveButtonText}>Guardar Objetivo</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'gym-routine': return renderGymRoutine();
      case 'sports-goals': return renderSportsGoals();
      default: return renderGymRoutine();
    }
  };

  return (
    <View style={styles.container}>
      {renderSectionTabs()}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderActiveSection()}
      </ScrollView>
      
      {renderGymRoutineModal()}
      {renderSportsGoalModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  tabsContainer: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    paddingVertical: 8,
  },
  tabsScroll: {
    paddingHorizontal: 16,
  },
  tab: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
  },
  activeTab: {
    backgroundColor: '#45B7D1',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d4150',
    flex: 1,
  },
  addButton: {
    backgroundColor: '#45B7D1',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Estilos para rutinas de gimnasio
  routinesContainer: {
    gap: 16,
  },
  routineCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#45B7D1',
  },
  routineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  routineName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d4150',
    flex: 1,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyBeginner: {
    backgroundColor: '#28a745',
  },
  difficultyIntermediate: {
    backgroundColor: '#ffc107',
  },
  difficultyAdvanced: {
    backgroundColor: '#dc3545',
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  routineDescription: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  routineDuration: {
    fontSize: 12,
    color: '#45B7D1',
    fontWeight: '600',
    marginBottom: 12,
  },
  exercisesContainer: {
    gap: 8,
  },
  exercisesTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2d4150',
    marginBottom: 4,
  },
  exerciseItem: {
    backgroundColor: '#ffffff',
    padding: 8,
    borderRadius: 4,
    borderLeftWidth: 2,
    borderLeftColor: '#45B7D1',
  },
  exerciseName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2d4150',
    marginBottom: 2,
  },
  exerciseDetails: {
    fontSize: 12,
    color: '#6c757d',
  },
  // Estilos para objetivos deportivos
  goalsContainer: {
    gap: 16,
  },
  goalCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FF8C42',
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalSport: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d4150',
    flex: 1,
  },
  goalDate: {
    fontSize: 12,
    color: '#6c757d',
    backgroundColor: '#e9ecef',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  goalObjective: {
    fontSize: 14,
    color: '#2d4150',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  progressContainer: {
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FF8C42',
    marginBottom: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#2d4150',
  },
  goalNotes: {
    fontSize: 12,
    color: '#6c757d',
    fontStyle: 'italic',
  },
  // Estilos para modales
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d4150',
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    padding: 20,
    maxHeight: 400,
  },
  modalActions: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    gap: 12,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2d4150',
    marginBottom: 8,
  },
  textInput: {
    fontSize: 16,
    color: '#2d4150',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  difficultySelector: {
    flexDirection: 'row',
    gap: 8,
  },
  difficultyOption: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    alignItems: 'center',
  },
  difficultyOptionSelected: {
    backgroundColor: '#45B7D1',
    borderColor: '#45B7D1',
  },
  difficultyOptionText: {
    fontSize: 14,
    color: '#6c757d',
    fontWeight: '500',
  },
  difficultyOptionTextSelected: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  sportsSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sportOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  sportOptionSelected: {
    backgroundColor: '#45B7D1',
    borderColor: '#45B7D1',
  },
  sportOptionText: {
    fontSize: 12,
    color: '#6c757d',
    fontWeight: '500',
  },
  sportOptionTextSelected: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  exerciseInput: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  exerciseNumber: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#45B7D1',
    marginBottom: 8,
  },
  exerciseDetails: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  exerciseDetailInput: {
    flex: 1,
    fontSize: 14,
    padding: 8,
  },
  addExerciseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#45B7D1',
    borderStyle: 'dashed',
    gap: 8,
  },
  addExerciseText: {
    fontSize: 14,
    color: '#45B7D1',
    fontWeight: '600',
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#6c757d',
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#45B7D1',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

export default ExerciseSections;
