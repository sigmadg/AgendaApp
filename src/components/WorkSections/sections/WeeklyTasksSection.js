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
    setShowNotesModal(false);
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
    setEditingTaskIndex(null);
    setShowNotesModal(true);
  };

  const completedTasks = weeklyTasks.filter(task => task.completed).length;
  const totalTasks = weeklyTasks.length;
  const urgentTasks = weeklyTasks.filter(task => task.urgent).length;
  const overdueTasks = weeklyTasks.filter(task => task.overdue).length;

  return (
    <View style={weeklyTasksStyles.container}>
      {/* Header mejorado */}
      <View style={weeklyTasksStyles.weeklyHeader}>
        <View style={weeklyTasksStyles.weeklyHeaderContent}>
          <View style={weeklyTasksStyles.weeklyIconContainer}>
            <Icon name="calendar-outline" size={24} color="#FFFFFF" />
          </View>
          <View style={weeklyTasksStyles.weeklyHeaderText}>
            <Text style={weeklyTasksStyles.weeklyHeaderTitle}>Tareas Semanales</Text>
            <Text style={weeklyTasksStyles.weeklyHeaderSubtitle}>Planifica tu semana de trabajo</Text>
          </View>
        </View>
        <View style={weeklyTasksStyles.weeklyHeaderBadge}>
          <Icon name="time-outline" size={16} color="#D2691E" />
        </View>
      </View>

      {/* Resumen de tareas mejorado */}
      <View style={weeklyTasksStyles.weeklySummary}>
        <View style={weeklyTasksStyles.summaryCard}>
          <View style={weeklyTasksStyles.summaryIconContainer}>
            <Icon name="checkmark-circle-outline" size={20} color="#3B82F6" />
          </View>
          <View style={weeklyTasksStyles.summaryContent}>
            <Text style={weeklyTasksStyles.summaryValue}>{completedTasks}/{totalTasks}</Text>
            <Text style={weeklyTasksStyles.summaryLabel}>Completadas</Text>
          </View>
        </View>
        <View style={weeklyTasksStyles.summaryCard}>
          <View style={weeklyTasksStyles.summaryIconContainer}>
            <Icon name="flash-outline" size={20} color="#10B981" />
          </View>
          <View style={weeklyTasksStyles.summaryContent}>
            <Text style={weeklyTasksStyles.summaryValue}>{urgentTasks}</Text>
            <Text style={weeklyTasksStyles.summaryLabel}>Urgentes</Text>
          </View>
        </View>
        <View style={weeklyTasksStyles.summaryCard}>
          <View style={weeklyTasksStyles.summaryIconContainer}>
            <Icon name="warning-outline" size={20} color="#F59E0B" />
          </View>
          <View style={weeklyTasksStyles.summaryContent}>
            <Text style={weeklyTasksStyles.summaryValue}>{overdueTasks}</Text>
            <Text style={weeklyTasksStyles.summaryLabel}>Vencidas</Text>
          </View>
        </View>
      </View>

      {/* Botón para agregar tarea */}
      <View style={weeklyTasksStyles.addWeeklyContainer}>
        <TouchableOpacity style={weeklyTasksStyles.addWeeklyButton} onPress={handleAddWeeklyTaskPress}>
          <Icon name="add-circle-outline" size={20} color="#FFFFFF" />
          <Text style={weeklyTasksStyles.addWeeklyText}>Agregar Tarea Semanal</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de tareas mejorada */}
      <View style={weeklyTasksStyles.weeklyContainer}>
        <View style={weeklyTasksStyles.weeklyHeader}>
          <Text style={weeklyTasksStyles.weeklyTitle}>Mis Tareas Semanales</Text>
          <TouchableOpacity style={weeklyTasksStyles.filterButton}>
            <Icon name="filter-outline" size={16} color="#D2691E" />
            <Text style={weeklyTasksStyles.filterText}>Filtrar</Text>
          </TouchableOpacity>
        </View>
        
        {weeklyTasks.length === 0 ? (
          <View style={weeklyTasksStyles.emptyState}>
            <Icon name="calendar-outline" size={48} color="#9CA3AF" />
            <Text style={weeklyTasksStyles.emptyTitle}>No hay tareas semanales</Text>
            <Text style={weeklyTasksStyles.emptySubtitle}>Agrega tu primera tarea para comenzar a planificar tu semana</Text>
            <TouchableOpacity style={weeklyTasksStyles.emptyButton} onPress={handleAddWeeklyTaskPress}>
              <Icon name="add-outline" size={20} color="#D2691E" />
              <Text style={weeklyTasksStyles.emptyButtonText}>Agregar Primera Tarea</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            {weeklyTasks.map((task) => (
              <View key={task.id} style={weeklyTasksStyles.weeklyItem}>
                <View style={weeklyTasksStyles.weeklyItemHeader}>
                  <TouchableOpacity
                    onPress={() => handleToggleTask(task.id)}
                    style={weeklyTasksStyles.weeklyCheckboxContainer}
                  >
                    <View style={[
                      weeklyTasksStyles.weeklyCheckbox,
                      task.completed && weeklyTasksStyles.weeklyCheckboxChecked
                    ]}>
                      {task.completed && (
                        <Icon name="checkmark" size={16} color="#FFFFFF" />
                      )}
                    </View>
                  </TouchableOpacity>
                  
                  <View style={weeklyTasksStyles.weeklyItemInfo}>
                    <Text style={[
                      weeklyTasksStyles.weeklyItemName,
                      task.completed && weeklyTasksStyles.weeklyItemNameCompleted
                    ]}>
                      {task.title}
                    </Text>
                    <Text style={[
                      weeklyTasksStyles.weeklyItemDate,
                      task.completed && weeklyTasksStyles.weeklyItemDateCompleted
                    ]}>
                      {new Date(task.date).toLocaleDateString()}
                    </Text>
                  </View>
                  
                  <View style={weeklyTasksStyles.weeklyItemActions}>
                    <TouchableOpacity
                      onPress={() => handleAddNotes(task.id)}
                      style={weeklyTasksStyles.weeklyActionButton}
                    >
                      <Icon name="create-outline" size={16} color="#6B7280" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDeleteTask(task.id)}
                      style={weeklyTasksStyles.weeklyActionButton}
                    >
                      <Icon name="trash-outline" size={16} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
                
                {/* Notas de la tarea */}
                {task.notes && (
                  <View style={weeklyTasksStyles.weeklyItemNotes}>
                    <Text style={weeklyTasksStyles.weeklyNotesText}>{task.notes}</Text>
                  </View>
                )}
                
                {/* Indicador de estado */}
                <View style={weeklyTasksStyles.weeklyItemStatus}>
                  <View style={[
                    weeklyTasksStyles.weeklyStatusIndicator,
                    task.completed ? weeklyTasksStyles.weeklyStatusCompleted : 
                    task.urgent ? weeklyTasksStyles.weeklyStatusUrgent :
                    task.overdue ? weeklyTasksStyles.weeklyStatusOverdue : weeklyTasksStyles.weeklyStatusPending
                  ]} />
                  <Text style={[
                    weeklyTasksStyles.weeklyStatusText,
                    task.completed ? weeklyTasksStyles.weeklyStatusCompletedText : 
                    task.urgent ? weeklyTasksStyles.weeklyStatusUrgentText :
                    task.overdue ? weeklyTasksStyles.weeklyStatusOverdueText : weeklyTasksStyles.weeklyStatusPendingText
                  ]}>
                    {task.completed ? 'Completada' : 
                     task.urgent ? 'Urgente' :
                     task.overdue ? 'Vencida' : 'Pendiente'}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Modal para agregar/editar tarea mejorado */}
      <Modal
        visible={showNotesModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowNotesModal(false)}
      >
        <View style={weeklyTasksStyles.modalOverlay}>
          <View style={weeklyTasksStyles.modalContainer}>
            <View style={weeklyTasksStyles.modalHeader}>
              <View style={weeklyTasksStyles.modalHeaderContent}>
                <View style={weeklyTasksStyles.modalIconContainer}>
                  <Icon name="calendar-outline" size={24} color="#FFFFFF" />
                </View>
                <View style={weeklyTasksStyles.modalHeaderText}>
                  <Text style={weeklyTasksStyles.modalTitle}>
                    {editingTaskIndex ? 'Editar Tarea Semanal' : 'Nueva Tarea Semanal'}
                  </Text>
                  <Text style={weeklyTasksStyles.modalSubtitle}>
                    {editingTaskIndex ? 'Modifica los detalles de tu tarea' : 'Agrega una nueva tarea a tu planificación semanal'}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => setShowNotesModal(false)}
                style={weeklyTasksStyles.closeButton}
              >
                <Icon name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={weeklyTasksStyles.modalContent}>
              <View style={weeklyTasksStyles.inputGroup}>
                <Text style={weeklyTasksStyles.inputLabel}>Título de la Tarea</Text>
                <TextInput
                  style={weeklyTasksStyles.textInput}
                  value={newTaskText}
                  onChangeText={setNewTaskText}
                  placeholder="Ingresa el título de la tarea"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={weeklyTasksStyles.inputGroup}>
                <Text style={weeklyTasksStyles.inputLabel}>Fecha de Vencimiento</Text>
                <TouchableOpacity
                  style={weeklyTasksStyles.datePickerButton}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Icon name="calendar-outline" size={20} color="#D2691E" />
                  <Text style={weeklyTasksStyles.datePickerText}>
                    {newTaskDate.toLocaleDateString()}
                  </Text>
                  <Icon name="chevron-down" size={16} color="#6B7280" />
                </TouchableOpacity>
              </View>

              <View style={weeklyTasksStyles.inputGroup}>
                <Text style={weeklyTasksStyles.inputLabel}>Notas Adicionales</Text>
                <TextInput
                  style={[weeklyTasksStyles.textInput, weeklyTasksStyles.textArea]}
                  value={selectedTaskNotes}
                  onChangeText={setSelectedTaskNotes}
                  placeholder="Agrega notas, detalles o recordatorios adicionales"
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={4}
                />
              </View>
            </ScrollView>

            <View style={weeklyTasksStyles.modalActions}>
              <TouchableOpacity
                style={weeklyTasksStyles.modalCancelButton}
                onPress={() => setShowNotesModal(false)}
              >
                <Text style={weeklyTasksStyles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={weeklyTasksStyles.modalSaveButton}
                onPress={editingTaskIndex ? handleSaveNotes : handleAddWeeklyTask}
              >
                <Icon name="checkmark" size={20} color="#FFFFFF" />
                <Text style={weeklyTasksStyles.modalSaveText}>
                  {editingTaskIndex ? 'Guardar Cambios' : 'Agregar Tarea'}
                </Text>
              </TouchableOpacity>
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
