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
import { dailyTasksStyles } from '../styles/dailyTasksStyles';

const DailyTasksSection = ({ 
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

  // Estados para tareas diarias
  const [dailyTasks, setDailyTasks] = useState([
    {
      id: 1,
      title: 'Revisar emails',
      date: '2024-01-15',
      time: '09:00',
      notes: 'Responder emails urgentes',
      completed: false,
      priority: 'high',
      urgent: false,
      overdue: false,
    },
    {
      id: 2,
      title: 'Reunión con equipo',
      date: '2024-01-15',
      time: '10:30',
      notes: 'Revisar progreso del proyecto',
      completed: true,
      priority: 'medium',
      urgent: false,
      overdue: false,
    },
    {
      id: 3,
      title: 'Preparar presentación',
      date: '2024-01-14',
      time: '14:00',
      notes: 'Presentación para el cliente',
      completed: false,
      priority: 'high',
      urgent: true,
      overdue: true,
    },
  ]);

  const [newDailyTaskText, setNewDailyTaskText] = useState('');
  const [newDailyTaskDate, setNewDailyTaskDate] = useState(new Date());
  const [newDailyTaskTime, setNewDailyTaskTime] = useState(new Date());
  const [showDailyDatePicker, setShowDailyDatePicker] = useState(false);
  const [showDailyTimePicker, setShowDailyTimePicker] = useState(false);
  const [showDailyNotesModal, setShowDailyNotesModal] = useState(false);
  const [selectedDailyTaskNotes, setSelectedDailyTaskNotes] = useState('');
  const [editingDailyTaskIndex, setEditingDailyTaskIndex] = useState(null);

  const handleAddDailyTask = () => {
    if (newDailyTaskText.trim() === '') {
      Alert.alert('Error', 'Por favor ingresa una tarea');
      return;
    }

    const newTask = {
      id: Date.now(),
      title: newDailyTaskText.trim(),
      date: newDailyTaskDate.toISOString().split('T')[0],
      time: newDailyTaskTime.toTimeString().split(' ')[0].substring(0, 5),
      notes: selectedDailyTaskNotes,
      completed: false,
      priority: 'medium',
      urgent: false,
      overdue: false,
    };

    setDailyTasks(prev => [...prev, newTask]);
    setNewDailyTaskText('');
    setSelectedDailyTaskNotes('');
    setNewDailyTaskDate(new Date());
    setNewDailyTaskTime(new Date());
  };

  const handleToggleTask = (taskId) => {
    setDailyTasks(prev => 
      prev.map(task => 
        task.id === taskId 
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  const handleEditTask = (taskId) => {
    const task = dailyTasks.find(t => t.id === taskId);
    if (task) {
      setNewDailyTaskText(task.title);
      setSelectedDailyTaskNotes(task.notes);
      setEditingDailyTaskIndex(taskId);
      setShowDailyNotesModal(true);
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
            setDailyTasks(prev => prev.filter(task => task.id !== taskId));
          }
        }
      ]
    );
  };

  const handleAddNotes = (taskId) => {
    const task = dailyTasks.find(t => t.id === taskId);
    if (task) {
      setSelectedDailyTaskNotes(task.notes);
      setEditingDailyTaskIndex(taskId);
      setShowDailyNotesModal(true);
    }
  };

  const handleSaveNotes = () => {
    if (editingDailyTaskIndex) {
      setDailyTasks(prev => 
        prev.map(task => 
          task.id === editingDailyTaskIndex 
            ? { ...task, notes: selectedDailyTaskNotes }
            : task
        )
      );
    }
    setShowDailyNotesModal(false);
    setSelectedDailyTaskNotes('');
    setEditingDailyTaskIndex(null);
  };

  const handleAddDailyTaskPress = () => {
    setNewDailyTaskText('');
    setSelectedDailyTaskNotes('');
    setNewDailyTaskDate(new Date());
    setNewDailyTaskTime(new Date());
    setShowDailyNotesModal(true);
  };

  const completedTasks = dailyTasks.filter(task => task.completed).length;
  const totalTasks = dailyTasks.length;
  const urgentTasks = dailyTasks.filter(task => task.urgent).length;
  const overdueTasks = dailyTasks.filter(task => task.overdue).length;

  return (
    <View style={dailyTasksStyles.container}>
      <SectionHeader
        title="Tareas Diarias"
        subtitle="Gestiona tus tareas del día"
        image={require('../../../android/app/src/main/assets/trabajo.png')}
        onAddPress={handleAddDailyTaskPress}
        theme={theme}
        size="medium"
      />

      {/* Resumen de tareas */}
      <View style={dailyTasksStyles.summaryContainer}>
        <Card
          title="Completadas"
          subtitle={`${completedTasks}/${totalTasks}`}
          icon="checkmark-circle-outline"
          theme={theme}
          size="small"
          style={dailyTasksStyles.summaryCard}
        />
        <Card
          title="Urgentes"
          subtitle={`${urgentTasks} tareas`}
          icon="flash-outline"
          theme={theme}
          size="small"
          style={dailyTasksStyles.summaryCard}
        />
        <Card
          title="Vencidas"
          subtitle={`${overdueTasks} tareas`}
          icon="warning-outline"
          theme={theme}
          size="small"
          style={dailyTasksStyles.summaryCard}
        />
      </View>

      {/* Lista de tareas */}
      <View style={dailyTasksStyles.tasksContainer}>
        {dailyTasks.length === 0 ? (
          <Card
            title="No hay tareas"
            subtitle="Agrega tu primera tarea del día"
            icon="add-circle-outline"
            theme={theme}
            size="medium"
          >
            <Button
              title="Agregar Tarea"
              onPress={handleAddDailyTaskPress}
              variant="primary"
              size="medium"
              theme={theme}
              icon="add"
            />
          </Card>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            {dailyTasks.map((task) => (
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
        visible={showDailyNotesModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDailyNotesModal(false)}
      >
        <View style={dailyTasksStyles.modalOverlay}>
          <View style={dailyTasksStyles.modalContainer}>
            <View style={dailyTasksStyles.modalHeader}>
              <Text style={dailyTasksStyles.modalTitle}>
                {editingDailyTaskIndex ? 'Editar Tarea' : 'Nueva Tarea'}
              </Text>
              <TouchableOpacity
                onPress={() => setShowDailyNotesModal(false)}
                style={dailyTasksStyles.closeButton}
              >
                <Icon name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={dailyTasksStyles.modalContent}>
              <View style={dailyTasksStyles.inputGroup}>
                <Text style={dailyTasksStyles.inputLabel}>Tarea</Text>
                <TextInput
                  style={dailyTasksStyles.textInput}
                  value={newDailyTaskText}
                  onChangeText={setNewDailyTaskText}
                  placeholder="Ingresa la tarea"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={dailyTasksStyles.inputGroup}>
                <Text style={dailyTasksStyles.inputLabel}>Fecha</Text>
                <TouchableOpacity
                  style={dailyTasksStyles.datePickerButton}
                  onPress={() => setShowDailyDatePicker(true)}
                >
                  <Icon name="calendar-outline" size={20} color="#6B7280" />
                  <Text style={dailyTasksStyles.datePickerText}>
                    {newDailyTaskDate.toLocaleDateString()}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={dailyTasksStyles.inputGroup}>
                <Text style={dailyTasksStyles.inputLabel}>Hora</Text>
                <TouchableOpacity
                  style={dailyTasksStyles.datePickerButton}
                  onPress={() => setShowDailyTimePicker(true)}
                >
                  <Icon name="time-outline" size={20} color="#6B7280" />
                  <Text style={dailyTasksStyles.datePickerText}>
                    {newDailyTaskTime.toTimeString().split(' ')[0].substring(0, 5)}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={dailyTasksStyles.inputGroup}>
                <Text style={dailyTasksStyles.inputLabel}>Notas</Text>
                <TextInput
                  style={[dailyTasksStyles.textInput, dailyTasksStyles.textArea]}
                  value={selectedDailyTaskNotes}
                  onChangeText={setSelectedDailyTaskNotes}
                  placeholder="Agrega notas adicionales"
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={3}
                />
              </View>
            </ScrollView>

            <View style={dailyTasksStyles.modalActions}>
              <Button
                title="Cancelar"
                onPress={() => setShowDailyNotesModal(false)}
                variant="outline"
                size="medium"
                theme={theme}
                style={dailyTasksStyles.modalButton}
              />
              <Button
                title={editingDailyTaskIndex ? 'Guardar' : 'Agregar'}
                onPress={editingDailyTaskIndex ? handleSaveNotes : handleAddDailyTask}
                variant="primary"
                size="medium"
                theme={theme}
                style={dailyTasksStyles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Date Picker */}
      {showDailyDatePicker && (
        <DateTimePicker
          value={newDailyTaskDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedDate) => {
            setShowDailyDatePicker(false);
            if (selectedDate) {
              setNewDailyTaskDate(selectedDate);
            }
          }}
        />
      )}

      {/* Time Picker */}
      {showDailyTimePicker && (
        <DateTimePicker
          value={newDailyTaskTime}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedTime) => {
            setShowDailyTimePicker(false);
            if (selectedTime) {
              setNewDailyTaskTime(selectedTime);
            }
          }}
        />
      )}
    </View>
  );
};

export default DailyTasksSection;
