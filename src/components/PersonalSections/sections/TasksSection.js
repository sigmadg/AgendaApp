import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { SectionHeader, Button, Card } from '../../shared';
import { useTheme } from '../../shared/hooks/useTheme';
import { tasksSectionStyles } from '../styles/tasksSectionStyles';

const TasksSection = ({ 
  selectedDate, 
  onDateSelect, 
  tasks, 
  getTasksForDate,
  onAddTask, 
  onToggleTask, 
  onDeleteTask,
  user,
  theme 
}) => {
  const { getThemeColors } = useTheme();
  const themeColors = getThemeColors();

  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [newTaskData, setNewTaskData] = useState({
    title: '',
    description: '',
    date: selectedDate,
    priority: 'medium',
    category: 'personal',
    estimatedTime: '',
  });

  const handleAddTask = () => {
    if (newTaskData.title.trim() === '') {
      Alert.alert('Error', 'Por favor ingresa un título para la tarea');
      return;
    }

    const task = {
      id: Date.now().toString(),
      title: newTaskData.title.trim(),
      description: newTaskData.description.trim(),
      date: newTaskData.date,
      priority: newTaskData.priority,
      category: newTaskData.category,
      estimatedTime: newTaskData.estimatedTime,
      completed: false,
      userId: user?.id,
      createdAt: new Date().toISOString(),
    };

    onAddTask(task);
    setNewTaskData({
      title: '',
      description: '',
      date: selectedDate,
      priority: 'medium',
      category: 'personal',
      estimatedTime: '',
    });
    setShowAddTaskModal(false);
  };

  const handleToggleTask = (taskId) => {
    onToggleTask(taskId);
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
          onPress: () => onDeleteTask(taskId),
        }
      ]
    );
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: '#4ECDC4',
      medium: '#FFD93D',
      high: '#FF6B6B',
    };
    return colors[priority] || '#FFD93D';
  };

  const getPriorityIcon = (priority) => {
    const icons = {
      low: 'arrow-down-outline',
      medium: 'remove-outline',
      high: 'arrow-up-outline',
    };
    return icons[priority] || 'remove-outline';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      personal: 'person-outline',
      work: 'briefcase-outline',
      health: 'medical-outline',
      finance: 'card-outline',
      education: 'school-outline',
      home: 'home-outline',
      shopping: 'cart-outline',
    };
    return icons[category] || 'list-outline';
  };

  // Obtener tareas del día seleccionado
  const todayTasks = getTasksForDate ? getTasksForDate(selectedDate) || [] : [];
  const completedTasks = todayTasks.filter(task => task.completed);
  const pendingTasks = todayTasks.filter(task => !task.completed);

  return (
    <View style={tasksSectionStyles.container}>
      <SectionHeader
        title="Tareas Personales"
        subtitle="Organiza tus tareas diarias"
        image={require('../../../../android/app/src/main/assets/mascota.png')}
        onAddPress={() => setShowAddTaskModal(true)}
        theme={theme}
        size="medium"
      />

      {/* Resumen de tareas */}
      <View style={tasksSectionStyles.summaryContainer}>
        <Card
          title="Pendientes"
          subtitle={`${pendingTasks.length} tareas`}
          icon="time-outline"
          theme={theme}
          size="small"
          style={tasksSectionStyles.summaryCard}
        />
        <Card
          title="Completadas"
          subtitle={`${completedTasks.length} tareas`}
          icon="checkmark-circle-outline"
          theme={theme}
          size="small"
          style={tasksSectionStyles.summaryCard}
        />
        <Card
          title="Total"
          subtitle={`${todayTasks.length} tareas`}
          icon="list-outline"
          theme={theme}
          size="small"
          style={tasksSectionStyles.summaryCard}
        />
      </View>

      {/* Tareas pendientes */}
      {pendingTasks.length > 0 && (
        <View style={tasksSectionStyles.sectionContainer}>
          <Text style={[tasksSectionStyles.sectionTitle, { color: themeColors.text }]}>
            Tareas Pendientes
          </Text>
          <View style={tasksSectionStyles.tasksList}>
            {pendingTasks.map((task) => (
              <Card
                key={task.id}
                title={task.title}
                subtitle={task.description || 'Sin descripción'}
                icon={getCategoryIcon(task.category)}
                theme={theme}
                size="medium"
                style={[
                  tasksSectionStyles.taskCard,
                  { borderLeftColor: getPriorityColor(task.priority) }
                ]}
                onPress={() => handleToggleTask(task.id)}
              >
                <View style={tasksSectionStyles.taskActions}>
                  <View style={tasksSectionStyles.taskInfo}>
                    <View style={tasksSectionStyles.priorityContainer}>
                      <Icon 
                        name={getPriorityIcon(task.priority)} 
                        size={16} 
                        color={getPriorityColor(task.priority)} 
                      />
                      <Text style={[tasksSectionStyles.priorityText, { color: getPriorityColor(task.priority) }]}>
                        {task.priority.toUpperCase()}
                      </Text>
                    </View>
                    {task.estimatedTime && (
                      <Text style={[tasksSectionStyles.timeText, { color: themeColors.textSecondary }]}>
                        {task.estimatedTime}
                      </Text>
                    )}
                  </View>
                  <TouchableOpacity
                    onPress={() => handleDeleteTask(task.id)}
                    style={tasksSectionStyles.deleteButton}
                  >
                    <Icon name="trash-outline" size={20} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </Card>
            ))}
          </View>
        </View>
      )}

      {/* Tareas completadas */}
      {completedTasks.length > 0 && (
        <View style={tasksSectionStyles.sectionContainer}>
          <Text style={[tasksSectionStyles.sectionTitle, { color: themeColors.text }]}>
            Tareas Completadas
          </Text>
          <View style={tasksSectionStyles.tasksList}>
            {completedTasks.map((task) => (
              <Card
                key={task.id}
                title={task.title}
                subtitle={task.description || 'Sin descripción'}
                icon="checkmark-circle"
                theme={theme}
                size="medium"
                style={[
                  tasksSectionStyles.taskCard,
                  tasksSectionStyles.completedTask
                ]}
                onPress={() => handleToggleTask(task.id)}
              >
                <View style={tasksSectionStyles.taskActions}>
                  <View style={tasksSectionStyles.taskInfo}>
                    <Text style={[tasksSectionStyles.completedText, { color: themeColors.success }]}>
                      Completada
                    </Text>
                    {task.estimatedTime && (
                      <Text style={[tasksSectionStyles.timeText, { color: themeColors.textSecondary }]}>
                        {task.estimatedTime}
                      </Text>
                    )}
                  </View>
                  <TouchableOpacity
                    onPress={() => handleDeleteTask(task.id)}
                    style={tasksSectionStyles.deleteButton}
                  >
                    <Icon name="trash-outline" size={20} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </Card>
            ))}
          </View>
        </View>
      )}

      {/* Sin tareas */}
      {todayTasks.length === 0 && (
        <Card
          title="No hay tareas"
          subtitle="Agrega tu primera tarea personal"
          icon="add-circle-outline"
          theme={theme}
          size="medium"
        >
          <Button
            title="Agregar Tarea"
            onPress={() => setShowAddTaskModal(true)}
            variant="primary"
            size="medium"
            theme={theme}
            icon="add"
          />
        </Card>
      )}

      {/* Modal para agregar tarea */}
      <Modal
        visible={showAddTaskModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddTaskModal(false)}
      >
        <View style={tasksSectionStyles.modalOverlay}>
          <View style={tasksSectionStyles.modalContainer}>
            <View style={tasksSectionStyles.modalHeader}>
              <Text style={tasksSectionStyles.modalTitle}>
                Nueva Tarea Personal
              </Text>
              <TouchableOpacity
                onPress={() => setShowAddTaskModal(false)}
                style={tasksSectionStyles.closeButton}
              >
                <Icon name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={tasksSectionStyles.modalContent}>
              <View style={tasksSectionStyles.inputGroup}>
                <Text style={tasksSectionStyles.inputLabel}>Título</Text>
                <TextInput
                  style={tasksSectionStyles.textInput}
                  value={newTaskData.title}
                  onChangeText={(text) => setNewTaskData(prev => ({ ...prev, title: text }))}
                  placeholder="Ingresa el título de la tarea"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={tasksSectionStyles.inputGroup}>
                <Text style={tasksSectionStyles.inputLabel}>Descripción</Text>
                <TextInput
                  style={[tasksSectionStyles.textInput, tasksSectionStyles.textArea]}
                  value={newTaskData.description}
                  onChangeText={(text) => setNewTaskData(prev => ({ ...prev, description: text }))}
                  placeholder="Agrega una descripción"
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={3}
                />
              </View>

              <View style={tasksSectionStyles.inputGroup}>
                <Text style={tasksSectionStyles.inputLabel}>Fecha</Text>
                <TextInput
                  style={tasksSectionStyles.textInput}
                  value={newTaskData.date}
                  onChangeText={(text) => setNewTaskData(prev => ({ ...prev, date: text }))}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={tasksSectionStyles.inputGroup}>
                <Text style={tasksSectionStyles.inputLabel}>Prioridad</Text>
                <View style={tasksSectionStyles.priorityContainer}>
                  {['low', 'medium', 'high'].map((priority) => (
                    <TouchableOpacity
                      key={priority}
                      style={[
                        tasksSectionStyles.priorityButton,
                        newTaskData.priority === priority && tasksSectionStyles.priorityButtonSelected
                      ]}
                      onPress={() => setNewTaskData(prev => ({ ...prev, priority }))}
                    >
                      <Icon 
                        name={getPriorityIcon(priority)} 
                        size={16} 
                        color={newTaskData.priority === priority ? '#FFFFFF' : getPriorityColor(priority)} 
                      />
                      <Text style={[
                        tasksSectionStyles.priorityButtonText,
                        newTaskData.priority === priority && tasksSectionStyles.priorityButtonTextSelected
                      ]}>
                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={tasksSectionStyles.inputGroup}>
                <Text style={tasksSectionStyles.inputLabel}>Categoría</Text>
                <View style={tasksSectionStyles.categoryContainer}>
                  {['personal', 'work', 'health', 'finance', 'education', 'home', 'shopping'].map((category) => (
                    <TouchableOpacity
                      key={category}
                      style={[
                        tasksSectionStyles.categoryButton,
                        newTaskData.category === category && tasksSectionStyles.categoryButtonSelected
                      ]}
                      onPress={() => setNewTaskData(prev => ({ ...prev, category }))}
                    >
                      <Icon 
                        name={getCategoryIcon(category)} 
                        size={16} 
                        color={newTaskData.category === category ? '#FFFFFF' : '#6B7280'} 
                      />
                      <Text style={[
                        tasksSectionStyles.categoryButtonText,
                        newTaskData.category === category && tasksSectionStyles.categoryButtonTextSelected
                      ]}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={tasksSectionStyles.inputGroup}>
                <Text style={tasksSectionStyles.inputLabel}>Tiempo Estimado</Text>
                <TextInput
                  style={tasksSectionStyles.textInput}
                  value={newTaskData.estimatedTime}
                  onChangeText={(text) => setNewTaskData(prev => ({ ...prev, estimatedTime: text }))}
                  placeholder="Ej: 30 min, 1 hora, 2 horas"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </ScrollView>

            <View style={tasksSectionStyles.modalActions}>
              <Button
                title="Cancelar"
                onPress={() => setShowAddTaskModal(false)}
                variant="outline"
                size="medium"
                theme={theme}
                style={tasksSectionStyles.modalButton}
              />
              <Button
                title="Agregar"
                onPress={handleAddTask}
                variant="primary"
                size="medium"
                theme={theme}
                style={tasksSectionStyles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default TasksSection;
