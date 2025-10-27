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
import { TaskCard } from '../../shared/work';
import { useTheme } from '../../shared/hooks/useTheme';
import { weeklyTasksStyles } from '../styles/weeklyTasksStyles';

const WeeklyTasksSection = ({ 
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

  // Estados para tareas semanales
  const [weeklyTasks, setWeeklyTasks] = useState([
    {
      id: 1,
      title: 'Planificar semana',
      date: '2024-01-15',
      notes: 'Definir objetivos semanales',
      completed: false,
      priority: 'high',
      urgent: false,
      overdue: false,
    },
    {
      id: 2,
      title: 'Revisar presupuesto',
      date: '2024-01-20',
      notes: 'Análisis financiero mensual',
      completed: false,
      priority: 'medium',
      urgent: false,
      overdue: false,
    },
    {
      id: 3,
      title: 'Preparar informe',
      date: '2024-01-18',
      notes: 'Informe de progreso para la gerencia',
      completed: true,
      priority: 'high',
      urgent: false,
      overdue: false,
    },
  ]);

  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskDate, setNewTaskDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [selectedTaskNotes, setSelectedTaskNotes] = useState('');
  const [editingTaskIndex, setEditingTaskIndex] = useState(null);

  const handleAddWeeklyTask = () => {
    if (newTaskText.trim() === '') {
      Alert.alert('Error', 'Por favor ingresa una tarea');
      return;
    }

    const newTask = {
      id: Date.now(),
      title: newTaskText.trim(),
      date: newTaskDate.toISOString().split('T')[0],
      notes: selectedTaskNotes,
      completed: false,
      priority: 'medium',
      urgent: false,
      overdue: false,
    };

    setWeeklyTasks(prev => [...prev, newTask]);
    setNewTaskText('');
    setSelectedTaskNotes('');
    setNewTaskDate(new Date());
  };

  const handleToggleTask = (taskId) => {
    setWeeklyTasks(prev => 
      prev.map(task => 
        task.id === taskId 
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  const handleEditTask = (taskId) => {
    const task = weeklyTasks.find(t => t.id === taskId);
    if (task) {
      setNewTaskText(task.title);
      setSelectedTaskNotes(task.notes);
      setEditingTaskIndex(taskId);
      setShowNotesModal(true);
    }
  };

  const handleDeleteTask = (taskId) => {
    Alert.alert(
      'Eliminar Tarea',
      '¿Estás seguro de que quieres eliminar esta tarea?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            setWeeklyTasks(prev => prev.filter(task => task.id !== taskId));
          }
        }
      ]
    );
  };

  const handleAddNotes = (taskId) => {
    const task = weeklyTasks.find(t => t.id === taskId);
    if (task) {
      setSelectedTaskNotes(task.notes);
      setEditingTaskIndex(taskId);
      setShowNotesModal(true);
    }
  };

  const handleSaveNotes = () => {
    if (editingTaskIndex) {
      setWeeklyTasks(prev => 
        prev.map(task => 
          task.id === editingTaskIndex 
            ? { ...task, notes: selectedTaskNotes }
            : task
        )
      );
    }
    setShowNotesModal(false);
    setSelectedTaskNotes('');
    setEditingTaskIndex(null);
  };

  const handleAddWeeklyTaskPress = () => {
    setNewTaskText('');
    setSelectedTaskNotes('');
    setNewTaskDate(new Date());
    setShowNotesModal(true);
  };

  const completedTasks = weeklyTasks.filter(task => task.completed).length;
  const totalTasks = weeklyTasks.length;
  const urgentTasks = weeklyTasks.filter(task => task.urgent).length;
  const overdueTasks = weeklyTasks.filter(task => task.overdue).length;

  return (
    <View style={weeklyTasksStyles.container}>
      <SectionHeader
        title="Tareas Semanales"
        subtitle="Planifica tu semana de trabajo"
        image={require('../../../android/app/src/main/assets/trabajo.png')}
        onAddPress={handleAddWeeklyTaskPress}
        theme={theme}
        size="medium"
      />

      {/* Resumen de tareas */}
      <View style={weeklyTasksStyles.summaryContainer}>
        <Card
          title="Completadas"
          subtitle={`${completedTasks}/${totalTasks}`}
          icon="checkmark-circle-outline"
          theme={theme}
          size="small"
          style={weeklyTasksStyles.summaryCard}
        />
        <Card
          title="Urgentes"
          subtitle={`${urgentTasks} tareas`}
          icon="flash-outline"
          theme={theme}
          size="small"
          style={weeklyTasksStyles.summaryCard}
        />
        <Card
          title="Vencidas"
          subtitle={`${overdueTasks} tareas`}
          icon="warning-outline"
          theme={theme}
          size="small"
          style={weeklyTasksStyles.summaryCard}
        />
      </View>

      {/* Lista de tareas */}
      <View style={weeklyTasksStyles.tasksContainer}>
        {weeklyTasks.length === 0 ? (
          <Card
            title="No hay tareas"
            subtitle="Agrega tu primera tarea semanal"
            icon="add-circle-outline"
            theme={theme}
            size="medium"
          >
            <Button
              title="Agregar Tarea"
              onPress={handleAddWeeklyTaskPress}
              variant="primary"
              size="medium"
              theme={theme}
              icon="add"
            />
          </Card>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            {weeklyTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={handleToggleTask}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
                onAddNotes={handleAddNotes}
                theme={theme}
                size="medium"
                variant={task.completed ? 'completed' : task.overdue ? 'overdue' : task.urgent ? 'urgent' : 'default'}
              />
            ))}
          </ScrollView>
        )}
      </View>

      {/* Modal para agregar/editar tarea */}
      <Modal
        visible={showNotesModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowNotesModal(false)}
      >
        <View style={weeklyTasksStyles.modalOverlay}>
          <View style={weeklyTasksStyles.modalContainer}>
            <View style={weeklyTasksStyles.modalHeader}>
              <Text style={weeklyTasksStyles.modalTitle}>
                {editingTaskIndex ? 'Editar Tarea' : 'Nueva Tarea Semanal'}
              </Text>
              <TouchableOpacity
                onPress={() => setShowNotesModal(false)}
                style={weeklyTasksStyles.closeButton}
              >
                <Icon name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={weeklyTasksStyles.modalContent}>
              <View style={weeklyTasksStyles.inputGroup}>
                <Text style={weeklyTasksStyles.inputLabel}>Tarea</Text>
                <TextInput
                  style={weeklyTasksStyles.textInput}
                  value={newTaskText}
                  onChangeText={setNewTaskText}
                  placeholder="Ingresa la tarea"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={weeklyTasksStyles.inputGroup}>
                <Text style={weeklyTasksStyles.inputLabel}>Fecha</Text>
                <TouchableOpacity
                  style={weeklyTasksStyles.datePickerButton}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Icon name="calendar-outline" size={20} color="#6B7280" />
                  <Text style={weeklyTasksStyles.datePickerText}>
                    {newTaskDate.toLocaleDateString()}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={weeklyTasksStyles.inputGroup}>
                <Text style={weeklyTasksStyles.inputLabel}>Notas</Text>
                <TextInput
                  style={[weeklyTasksStyles.textInput, weeklyTasksStyles.textArea]}
                  value={selectedTaskNotes}
                  onChangeText={setSelectedTaskNotes}
                  placeholder="Agrega notas adicionales"
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={3}
                />
              </View>
            </ScrollView>

            <View style={weeklyTasksStyles.modalActions}>
              <Button
                title="Cancelar"
                onPress={() => setShowNotesModal(false)}
                variant="outline"
                size="medium"
                theme={theme}
                style={weeklyTasksStyles.modalButton}
              />
              <Button
                title={editingTaskIndex ? 'Guardar' : 'Agregar'}
                onPress={editingTaskIndex ? handleSaveNotes : handleAddWeeklyTask}
                variant="primary"
                size="medium"
                theme={theme}
                style={weeklyTasksStyles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={newTaskDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              setNewTaskDate(selectedDate);
            }
          }}
        />
      )}
    </View>
  );
};

export default WeeklyTasksSection;
