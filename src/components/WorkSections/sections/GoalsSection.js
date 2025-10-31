import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SectionHeader, Button, Card } from '../../shared';
import { GoalCard } from '../../shared/work';
import { useTheme } from '../../shared/hooks/useTheme';
import { goalsStyles } from '../styles/goalsStyles';

const GoalsSection = ({ 
  selectedDate, 
  events, 
  onAddEvent, 
  onEditEvent, 
  onDeleteEvent, 
  onUpdateSection, 
  user,
  theme 
}) => {
  const { getThemeColors } = useTheme();
  const themeColors = getThemeColors();

  // Estados para objetivos
  const [goals, setGoals] = useState([
    {
      id: 1,
      title: 'Completar certificación',
      date: '2024-02-15',
      person: 'Juan Pérez',
      completed: false,
      priority: 'high',
      urgent: false,
      overdue: false,
    },
    {
      id: 2,
      title: 'Mejorar productividad',
      date: '2024-01-31',
      person: 'María García',
      completed: true,
      priority: 'medium',
      urgent: false,
      overdue: false,
    },
    {
      id: 3,
      title: 'Aprender nueva tecnología',
      date: '2024-03-01',
      person: 'Carlos López',
      completed: false,
      priority: 'high',
      urgent: true,
      overdue: false,
    },
  ]);

  const [showAddGoalModal, setShowAddGoalModal] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalDate, setNewGoalDate] = useState(new Date());
  const [newGoalPerson, setNewGoalPerson] = useState('');
  const [newGoalPriority, setNewGoalPriority] = useState('medium');
  const [showDateModal, setShowDateModal] = useState(false);
  const [editingGoalIndex, setEditingGoalIndex] = useState(null);

  const handleAddGoal = () => {
    if (newGoalTitle.trim() === '') {
      Alert.alert('Error', 'Por favor ingresa un objetivo');
      return;
    }

    const newGoal = {
      id: Date.now(),
      title: newGoalTitle.trim(),
      date: newGoalDate.toISOString().split('T')[0],
      person: newGoalPerson.trim(),
      completed: false,
      priority: newGoalPriority,
      urgent: false,
      overdue: false,
    };

    setGoals(prev => [...prev, newGoal]);
    setNewGoalTitle('');
    setNewGoalPerson('');
    setNewGoalDate(new Date());
    setNewGoalPriority('medium');
    setShowAddGoalModal(false);
  };

  const handleToggleGoal = (goalId) => {
    setGoals(prev => 
      prev.map(goal => 
        goal.id === goalId 
          ? { ...goal, completed: !goal.completed }
          : goal
      )
    );
  };

  const handleEditGoal = (goalId) => {
    const goal = goals.find(g => g.id === goalId);
    if (goal) {
      setNewGoalTitle(goal.title);
      setNewGoalPerson(goal.person);
      setNewGoalDate(new Date(goal.date));
      setNewGoalPriority(goal.priority);
      setEditingGoalIndex(goalId);
      setShowAddGoalModal(true);
    }
  };

  const handleDeleteGoal = (goalId) => {
    Alert.alert(
      'Eliminar Objetivo',
      '¿Estás seguro de que quieres eliminar este objetivo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            setGoals(prev => prev.filter(goal => goal.id !== goalId));
          }
        }
      ]
    );
  };

  const handleAddPerson = (goalId) => {
    Alert.alert('Agregar Persona', 'Funcionalidad en desarrollo');
  };

  const handleAddDate = (goalId) => {
    Alert.alert('Agregar Fecha', 'Funcionalidad en desarrollo');
  };

  const handleAddGoalPress = () => {
    setNewGoalTitle('');
    setNewGoalPerson('');
    setNewGoalDate(new Date());
    setNewGoalPriority('medium');
    setEditingGoalIndex(null);
    setShowAddGoalModal(true);
  };

  const completedGoals = goals.filter(goal => goal.completed).length;
  const totalGoals = goals.length;
  const urgentGoals = goals.filter(goal => goal.urgent).length;
  const overdueGoals = goals.filter(goal => goal.overdue).length;

  return (
    <View style={goalsStyles.container}>
      <SectionHeader
        title="Objetivos"
        subtitle="Define y alcanza tus metas"
        image={require('../../../android/app/src/main/assets/trabajo.png')}
        onAddPress={handleAddGoalPress}
        theme={theme}
        size="medium"
      />

      {/* Resumen de objetivos */}
      <View style={goalsStyles.summaryContainer}>
        <Card
          title="Completados"
          subtitle={`${completedGoals}/${totalGoals}`}
          icon="checkmark-circle-outline"
          theme={theme}
          size="small"
          style={goalsStyles.summaryCard}
        />
        <Card
          title="Urgentes"
          subtitle={`${urgentGoals} objetivos`}
          icon="flash-outline"
          theme={theme}
          size="small"
          style={goalsStyles.summaryCard}
        />
        <Card
          title="Vencidos"
          subtitle={`${overdueGoals} objetivos`}
          icon="warning-outline"
          theme={theme}
          size="small"
          style={goalsStyles.summaryCard}
        />
      </View>

      {/* Lista de objetivos */}
      <View style={goalsStyles.goalsContainer}>
        {goals.length === 0 ? (
          <Card
            title="No hay objetivos"
            subtitle="Crea tu primer objetivo"
            icon="add-circle-outline"
            theme={theme}
            size="medium"
          >
            <Button
              title="Crear Objetivo"
              onPress={handleAddGoalPress}
              variant="primary"
              size="medium"
              theme={theme}
              icon="add"
            />
          </Card>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            {goals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onToggle={handleToggleGoal}
                onEdit={handleEditGoal}
                onDelete={handleDeleteGoal}
                onAddPerson={handleAddPerson}
                onAddDate={handleAddDate}
                theme={theme}
                size="medium"
                variant={goal.completed ? 'completed' : goal.overdue ? 'overdue' : goal.urgent ? 'urgent' : 'default'}
              />
            ))}
          </ScrollView>
        )}
      </View>

      {/* Modal para agregar/editar objetivo */}
      <Modal
        visible={showAddGoalModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddGoalModal(false)}
      >
        <View style={goalsStyles.modalOverlay}>
          <View style={goalsStyles.modalContainer}>
            <View style={goalsStyles.modalHeader}>
              <Text style={goalsStyles.modalTitle}>
                {editingGoalIndex ? 'Editar Objetivo' : 'Nuevo Objetivo'}
              </Text>
              <TouchableOpacity
                onPress={() => setShowAddGoalModal(false)}
                style={goalsStyles.closeButton}
              >
                <Icon name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={goalsStyles.modalContent}>
              <View style={goalsStyles.inputGroup}>
                <Text style={goalsStyles.inputLabel}>Objetivo</Text>
                <TextInput
                  style={goalsStyles.textInput}
                  value={newGoalTitle}
                  onChangeText={setNewGoalTitle}
                  placeholder="Ingresa el objetivo"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={goalsStyles.inputGroup}>
                <Text style={goalsStyles.inputLabel}>Fecha</Text>
                <TouchableOpacity
                  style={goalsStyles.datePickerButton}
                  onPress={() => setShowDateModal(true)}
                >
                  <Icon name="calendar-outline" size={20} color="#6B7280" />
                  <Text style={goalsStyles.datePickerText}>
                    {newGoalDate.toLocaleDateString()}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={goalsStyles.inputGroup}>
                <Text style={goalsStyles.inputLabel}>Persona Responsable</Text>
                <TextInput
                  style={goalsStyles.textInput}
                  value={newGoalPerson}
                  onChangeText={setNewGoalPerson}
                  placeholder="Ingresa el nombre de la persona"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={goalsStyles.inputGroup}>
                <Text style={goalsStyles.inputLabel}>Prioridad</Text>
                <View style={goalsStyles.priorityContainer}>
                  {['low', 'medium', 'high'].map((priority) => (
                    <TouchableOpacity
                      key={priority}
                      style={[
                        goalsStyles.priorityButton,
                        newGoalPriority === priority && goalsStyles.priorityButtonSelected
                      ]}
                      onPress={() => setNewGoalPriority(priority)}
                    >
                      <Text style={[
                        goalsStyles.priorityButtonText,
                        newGoalPriority === priority && goalsStyles.priorityButtonTextSelected
                      ]}>
                        {priority === 'low' ? 'Baja' : priority === 'medium' ? 'Media' : 'Alta'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>

            <View style={goalsStyles.modalActions}>
              <Button
                title="Cancelar"
                onPress={() => setShowAddGoalModal(false)}
                variant="outline"
                size="medium"
                theme={theme}
                style={goalsStyles.modalButton}
              />
              <Button
                title={editingGoalIndex ? 'Guardar' : 'Crear'}
                onPress={handleAddGoal}
                variant="primary"
                size="medium"
                theme={theme}
                style={goalsStyles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Date Picker */}
      {showDateModal && (
        <DateTimePicker
          value={newGoalDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedDate) => {
            setShowDateModal(false);
            if (selectedDate) {
              setNewGoalDate(selectedDate);
            }
          }}
        />
      )}
    </View>
  );
};

export default GoalsSection;
