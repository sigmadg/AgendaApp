import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { SectionHeader } from '../../shared';
import { useTheme } from '../../shared/hooks/useTheme';
import { todoSectionStyles } from '../styles/todoSectionStyles';

const TodoSection = ({ 
  user, 
  theme,
  tasks = [],
  onAddTask,
  onToggleTask,
  onDeleteTask
}) => {
  const { getThemeColors } = useTheme();
  const themeColors = getThemeColors();

  // Validar que user existe
  if (!user) {
    return (
      <View style={todoSectionStyles.container}>
        <Text style={[todoSectionStyles.text, { color: themeColors.text }]}>
          Cargando datos del usuario...
        </Text>
      </View>
    );
  }

  // Estados para las tareas académicas
  const [academicTasks, setAcademicTasks] = useState([
    {
      id: 1,
      task: 'Entregar ensayo de literatura',
      subject: 'Literatura',
      date: '2024-01-15',
      notes: 'Mínimo 5 páginas, tema libre',
      completed: false,
      priority: 'high',
      estimatedTime: '3 horas',
      type: 'ensayo'
    },
    {
      id: 2,
      task: 'Proyecto de matemáticas',
      subject: 'Matemáticas',
      date: '2024-01-20',
      notes: 'Resolver 20 problemas de cálculo',
      completed: true,
      priority: 'medium',
      estimatedTime: '2 horas',
      type: 'proyecto'
    },
    {
      id: 3,
      task: 'Presentación de historia',
      subject: 'Historia',
      date: '2024-01-18',
      notes: 'Exponer sobre la Revolución Francesa',
      completed: false,
      priority: 'high',
      estimatedTime: '1 hora',
      type: 'presentación'
    },
    {
      id: 4,
      task: 'Laboratorio de química',
      subject: 'Química',
      date: '2024-01-22',
      notes: 'Experimento de reacciones químicas',
      completed: false,
      priority: 'low',
      estimatedTime: '2 horas',
      type: 'laboratorio'
    },
    {
      id: 5,
      task: 'Examen de física',
      subject: 'Física',
      date: '2024-01-25',
      notes: 'Repasar temas de mecánica',
      completed: false,
      priority: 'high',
      estimatedTime: '4 horas',
      type: 'examen'
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newTask, setNewTask] = useState({
    task: '',
    subject: '',
    date: '',
    notes: '',
    priority: 'medium',
    estimatedTime: '',
    type: 'tarea'
  });

  const subjects = ['Matemáticas', 'Literatura', 'Historia', 'Química', 'Física', 'Biología', 'Inglés', 'Arte'];
  const priorities = [
    { value: 'high', label: 'Alta', color: '#EF4444' },
    { value: 'medium', label: 'Media', color: '#F59E0B' },
    { value: 'low', label: 'Baja', color: '#10B981' }
  ];
  const taskTypes = [
    { value: 'tarea', label: 'Tarea', icon: 'document-text-outline' },
    { value: 'proyecto', label: 'Proyecto', icon: 'folder-outline' },
    { value: 'examen', label: 'Examen', icon: 'school-outline' },
    { value: 'presentación', label: 'Presentación', icon: 'presentation-outline' },
    { value: 'laboratorio', label: 'Laboratorio', icon: 'flask-outline' },
    { value: 'ensayo', label: 'Ensayo', icon: 'book-outline' }
  ];

  const getTotalTasks = () => academicTasks.length;
  const getCompletedTasks = () => academicTasks.filter(task => task.completed).length;
  const getPendingTasks = () => academicTasks.filter(task => !task.completed).length;
  const getHighPriorityTasks = () => academicTasks.filter(task => task.priority === 'high' && !task.completed).length;

  const addTask = () => {
    if (!newTask.task || !newTask.subject || !newTask.date) {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios');
      return;
    }

    const taskData = {
      ...newTask,
      id: Date.now(),
      completed: false
    };

    setAcademicTasks(prev => [...prev, taskData]);
    setNewTask({
      task: '',
      subject: '',
      date: '',
      notes: '',
      priority: 'medium',
      estimatedTime: '',
      type: 'tarea'
    });
    setShowAddModal(false);
    Alert.alert('Éxito', 'Tarea académica agregada correctamente');
  };

  const toggleTask = (taskId) => {
    setAcademicTasks(prev => 
      prev.map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (taskId) => {
    Alert.alert(
      'Eliminar Tarea',
      '¿Estás seguro de que quieres eliminar esta tarea?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: () => {
            setAcademicTasks(prev => prev.filter(task => task.id !== taskId));
          }
        }
      ]
    );
  };

  const getPriorityColor = (priority) => {
    const priorityObj = priorities.find(p => p.value === priority);
    return priorityObj ? priorityObj.color : '#6B7280';
  };

  const getPriorityLabel = (priority) => {
    const priorityObj = priorities.find(p => p.value === priority);
    return priorityObj ? priorityObj.label : 'Media';
  };

  const getTaskTypeIcon = (type) => {
    const typeObj = taskTypes.find(t => t.value === type);
    return typeObj ? typeObj.icon : 'document-outline';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const isOverdue = (dateString) => {
    const taskDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return taskDate < today;
  };

  const renderTasks = () => {
    const totalTasks = getTotalTasks();
    const completedTasks = getCompletedTasks();
    const pendingTasks = getPendingTasks();
    const highPriorityTasks = getHighPriorityTasks();

    return (
      <View>
        {/* Header mejorado */}
        <View style={todoSectionStyles.tasksHeader}>
          <View style={todoSectionStyles.tasksHeaderContent}>
            <View style={todoSectionStyles.tasksIconContainer}>
              <Icon name="checkmark-circle-outline" size={24} color="#FFFFFF" />
            </View>
            <View style={todoSectionStyles.tasksHeaderText}>
              <Text style={todoSectionStyles.tasksHeaderTitle}>
                Tareas Académicas
              </Text>
              <Text style={todoSectionStyles.tasksHeaderSubtitle}>
                Gestiona tus tareas y proyectos académicos
              </Text>
            </View>
          </View>
          <View style={todoSectionStyles.tasksHeaderBadge}>
            <Icon name="school-outline" size={16} color="#1E3A8A" />
          </View>
        </View>

        {/* Resumen de tareas mejorado */}
        <View style={todoSectionStyles.tasksSummary}>
          <View style={todoSectionStyles.summaryCard}>
            <View style={todoSectionStyles.summaryIconContainer}>
              <Icon name="list-outline" size={20} color="#3B82F6" />
            </View>
            <View style={todoSectionStyles.summaryContent}>
              <Text style={todoSectionStyles.summaryValue}>{totalTasks}</Text>
              <Text style={todoSectionStyles.summaryLabel}>Total</Text>
            </View>
          </View>
          <View style={todoSectionStyles.summaryCard}>
            <View style={todoSectionStyles.summaryIconContainer}>
              <Icon name="checkmark-circle-outline" size={20} color="#10B981" />
            </View>
            <View style={todoSectionStyles.summaryContent}>
              <Text style={todoSectionStyles.summaryValue}>{completedTasks}</Text>
              <Text style={todoSectionStyles.summaryLabel}>Completadas</Text>
            </View>
          </View>
          <View style={todoSectionStyles.summaryCard}>
            <View style={todoSectionStyles.summaryIconContainer}>
              <Icon name="time-outline" size={20} color="#F59E0B" />
            </View>
            <View style={todoSectionStyles.summaryContent}>
              <Text style={todoSectionStyles.summaryValue}>{pendingTasks}</Text>
              <Text style={todoSectionStyles.summaryLabel}>Pendientes</Text>
            </View>
          </View>
          <View style={todoSectionStyles.summaryCard}>
            <View style={todoSectionStyles.summaryIconContainer}>
              <Icon name="alert-circle-outline" size={20} color="#EF4444" />
            </View>
            <View style={todoSectionStyles.summaryContent}>
              <Text style={todoSectionStyles.summaryValue}>{highPriorityTasks}</Text>
              <Text style={todoSectionStyles.summaryLabel}>Urgentes</Text>
            </View>
          </View>
        </View>

        {/* Botón para agregar tarea */}
        <View style={todoSectionStyles.addTaskContainer}>
          <TouchableOpacity 
            style={todoSectionStyles.addTaskButton}
            onPress={() => setShowAddModal(true)}
          >
            <Icon name="add-circle-outline" size={20} color="#FFFFFF" />
            <Text style={todoSectionStyles.addTaskText}>Nueva Tarea Académica</Text>
          </TouchableOpacity>
        </View>

        {/* Lista de tareas mejorada */}
        <View style={todoSectionStyles.tasksContainer}>
          <View style={todoSectionStyles.tasksHeader}>
            <Text style={todoSectionStyles.tasksTitle}>Mis Tareas</Text>
            <TouchableOpacity style={todoSectionStyles.filterButton}>
              <Icon name="filter-outline" size={16} color="#1E3A8A" />
              <Text style={todoSectionStyles.filterText}>Filtrar</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={todoSectionStyles.tasksBody} showsVerticalScrollIndicator={false}>
            {academicTasks.length === 0 ? (
              <View style={todoSectionStyles.emptyState}>
                <Icon name="document-outline" size={48} color="#9CA3AF" />
                <Text style={todoSectionStyles.emptyTitle}>No hay tareas académicas</Text>
                <Text style={todoSectionStyles.emptySubtitle}>Agrega tu primera tarea para comenzar a organizarte</Text>
                <TouchableOpacity 
                  style={todoSectionStyles.emptyButton}
                  onPress={() => setShowAddModal(true)}
                >
                  <Icon name="add-outline" size={20} color="#1E3A8A" />
                  <Text style={todoSectionStyles.emptyButtonText}>Crear Primera Tarea</Text>
                </TouchableOpacity>
              </View>
            ) : (
              academicTasks.map((task) => {
                const isOverdueTask = isOverdue(task.date);
                const priorityColor = getPriorityColor(task.priority);
                const taskTypeIcon = getTaskTypeIcon(task.type);
                
                return (
                  <View key={task.id} style={todoSectionStyles.taskItem}>
                    <View style={todoSectionStyles.taskItemHeader}>
                      <View style={todoSectionStyles.taskItemInfo}>
                        <TouchableOpacity
                          onPress={() => toggleTask(task.id)}
                          style={[
                            todoSectionStyles.taskCheckbox,
                            task.completed && todoSectionStyles.taskCheckboxCompleted
                          ]}
                        >
                          {task.completed && <Icon name="checkmark" size={16} color="#FFFFFF" />}
                        </TouchableOpacity>
                        
                        <View style={todoSectionStyles.taskContent}>
                          <Text style={[
                            todoSectionStyles.taskTitle,
                            task.completed && todoSectionStyles.taskTitleCompleted
                          ]}>
                            {task.task}
                          </Text>
                          
                          <View style={todoSectionStyles.taskMeta}>
                            <View style={todoSectionStyles.taskMetaItem}>
                              <Icon name="book-outline" size={14} color="#6B7280" />
                              <Text style={todoSectionStyles.taskMetaText}>{task.subject}</Text>
                            </View>
                            <View style={todoSectionStyles.taskMetaItem}>
                              <Icon name="calendar-outline" size={14} color="#6B7280" />
                              <Text style={[
                                todoSectionStyles.taskMetaText,
                                isOverdueTask && todoSectionStyles.taskMetaTextOverdue
                              ]}>
                                {formatDate(task.date)}
                              </Text>
                            </View>
                            <View style={todoSectionStyles.taskMetaItem}>
                              <Icon name={taskTypeIcon} size={14} color="#6B7280" />
                              <Text style={todoSectionStyles.taskMetaText}>{task.type}</Text>
                            </View>
                          </View>
                        </View>
                      </View>
                      
                      <View style={todoSectionStyles.taskItemActions}>
                        <TouchableOpacity
                          onPress={() => deleteTask(task.id)}
                          style={todoSectionStyles.taskActionButton}
                        >
                          <Icon name="trash-outline" size={16} color="#EF4444" />
                        </TouchableOpacity>
                      </View>
                    </View>
                    
                    {/* Información adicional */}
                    <View style={todoSectionStyles.taskItemDetails}>
                      <View style={todoSectionStyles.taskPriority}>
                        <View style={[
                          todoSectionStyles.priorityIndicator,
                          { backgroundColor: priorityColor }
                        ]} />
                        <Text style={[
                          todoSectionStyles.priorityText,
                          { color: priorityColor }
                        ]}>
                          {getPriorityLabel(task.priority)}
                        </Text>
                      </View>
                      
                      {task.estimatedTime && (
                        <View style={todoSectionStyles.taskTime}>
                          <Icon name="time-outline" size={12} color="#6B7280" />
                          <Text style={todoSectionStyles.taskTimeText}>{task.estimatedTime}</Text>
                        </View>
                      )}
                    </View>
                    
                    {/* Notas */}
                    {task.notes && (
                      <View style={todoSectionStyles.taskNotes}>
                        <Text style={todoSectionStyles.taskNotesText}>{task.notes}</Text>
                      </View>
                    )}
                    
                    {/* Estado */}
                    <View style={todoSectionStyles.taskStatus}>
                      <View style={[
                        todoSectionStyles.statusIndicator,
                        task.completed ? todoSectionStyles.statusCompleted : 
                        isOverdueTask ? todoSectionStyles.statusOverdue : todoSectionStyles.statusPending
                      ]} />
                      <Text style={[
                        todoSectionStyles.statusText,
                        task.completed ? todoSectionStyles.statusCompletedText : 
                        isOverdueTask ? todoSectionStyles.statusOverdueText : todoSectionStyles.statusPendingText
                      ]}>
                        {task.completed ? 'Completada' : 
                         isOverdueTask ? 'Vencida' : 'Pendiente'}
                      </Text>
                    </View>
                  </View>
                );
              })
            )}
          </ScrollView>
        </View>
      </View>
    );
  };

  return (
    <View style={todoSectionStyles.container}>
      {renderTasks()}
      
      {/* Modal para agregar tarea mejorado */}
      <Modal
        visible={showAddModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={todoSectionStyles.modalOverlay}>
          <View style={[todoSectionStyles.modalContainer, { backgroundColor: themeColors.surface }]}>
            <View style={todoSectionStyles.modalHeader}>
              <View style={todoSectionStyles.modalHeaderContent}>
                <Icon name="add-circle-outline" size={24} color="#1E3A8A" />
                <Text style={[todoSectionStyles.modalTitle, { color: themeColors.text }]}>
                  Nueva Tarea Académica
                </Text>
              </View>
              <TouchableOpacity 
                onPress={() => setShowAddModal(false)} 
                style={todoSectionStyles.closeButton}
              >
                <Icon name="close" size={24} color={themeColors.primary} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={todoSectionStyles.modalContent} showsVerticalScrollIndicator={false}>
              <View style={todoSectionStyles.inputGroup}>
                <Text style={[todoSectionStyles.inputLabel, { color: themeColors.text }]}>Tarea *</Text>
                <TextInput
                  style={[todoSectionStyles.textInput, { 
                    backgroundColor: themeColors.background,
                    color: themeColors.text,
                    borderColor: themeColors.border 
                  }]}
                  value={newTask.task}
                  onChangeText={(text) => setNewTask(prev => ({ ...prev, task: text }))}
                  placeholder="Ej: Entregar ensayo de literatura"
                  placeholderTextColor={themeColors.textSecondary}
                />
              </View>
              
              <View style={todoSectionStyles.inputGroup}>
                <Text style={[todoSectionStyles.inputLabel, { color: themeColors.text }]}>Materia *</Text>
                <View style={todoSectionStyles.subjectSelector}>
                  {subjects.map((subject) => (
                    <TouchableOpacity
                      key={subject}
                      style={[
                        todoSectionStyles.subjectButton,
                        { backgroundColor: themeColors.background },
                        newTask.subject === subject && { backgroundColor: '#1E3A8A' }
                      ]}
                      onPress={() => setNewTask(prev => ({ ...prev, subject }))}
                    >
                      <Text style={[
                        todoSectionStyles.subjectButtonText,
                        { color: themeColors.text },
                        newTask.subject === subject && { color: '#FFFFFF' }
                      ]}>
                        {subject}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <View style={todoSectionStyles.inputGroup}>
                <Text style={[todoSectionStyles.inputLabel, { color: themeColors.text }]}>Fecha de entrega *</Text>
                <TextInput
                  style={[todoSectionStyles.textInput, { 
                    backgroundColor: themeColors.background,
                    color: themeColors.text,
                    borderColor: themeColors.border 
                  }]}
                  value={newTask.date}
                  onChangeText={(text) => setNewTask(prev => ({ ...prev, date: text }))}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={themeColors.textSecondary}
                />
              </View>
              
              <View style={todoSectionStyles.inputGroup}>
                <Text style={[todoSectionStyles.inputLabel, { color: themeColors.text }]}>Tipo de tarea</Text>
                <View style={todoSectionStyles.typeSelector}>
                  {taskTypes.map((type) => (
                    <TouchableOpacity
                      key={type.value}
                      style={[
                        todoSectionStyles.typeButton,
                        { backgroundColor: themeColors.background },
                        newTask.type === type.value && { backgroundColor: '#1E3A8A' }
                      ]}
                      onPress={() => setNewTask(prev => ({ ...prev, type: type.value }))}
                    >
                      <Icon 
                        name={type.icon} 
                        size={16} 
                        color={newTask.type === type.value ? '#FFFFFF' : themeColors.text} 
                      />
                      <Text style={[
                        todoSectionStyles.typeButtonText,
                        { color: themeColors.text },
                        newTask.type === type.value && { color: '#FFFFFF' }
                      ]}>
                        {type.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <View style={todoSectionStyles.inputGroup}>
                <Text style={[todoSectionStyles.inputLabel, { color: themeColors.text }]}>Prioridad</Text>
                <View style={todoSectionStyles.prioritySelector}>
                  {priorities.map((priority) => (
                    <TouchableOpacity
                      key={priority.value}
                      style={[
                        todoSectionStyles.priorityButton,
                        { backgroundColor: themeColors.background },
                        newTask.priority === priority.value && { backgroundColor: priority.color }
                      ]}
                      onPress={() => setNewTask(prev => ({ ...prev, priority: priority.value }))}
                    >
                      <Text style={[
                        todoSectionStyles.priorityButtonText,
                        { color: themeColors.text },
                        newTask.priority === priority.value && { color: '#FFFFFF' }
                      ]}>
                        {priority.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <View style={todoSectionStyles.inputGroup}>
                <Text style={[todoSectionStyles.inputLabel, { color: themeColors.text }]}>Tiempo estimado</Text>
                <TextInput
                  style={[todoSectionStyles.textInput, { 
                    backgroundColor: themeColors.background,
                    color: themeColors.text,
                    borderColor: themeColors.border 
                  }]}
                  value={newTask.estimatedTime}
                  onChangeText={(text) => setNewTask(prev => ({ ...prev, estimatedTime: text }))}
                  placeholder="Ej: 2 horas"
                  placeholderTextColor={themeColors.textSecondary}
                />
              </View>
              
              <View style={todoSectionStyles.inputGroup}>
                <Text style={[todoSectionStyles.inputLabel, { color: themeColors.text }]}>Notas adicionales</Text>
                <TextInput
                  style={[todoSectionStyles.textInput, { 
                    backgroundColor: themeColors.background,
                    color: themeColors.text,
                    borderColor: themeColors.border 
                  }]}
                  value={newTask.notes}
                  onChangeText={(text) => setNewTask(prev => ({ ...prev, notes: text }))}
                  placeholder="Información adicional sobre la tarea..."
                  placeholderTextColor={themeColors.textSecondary}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>
            </ScrollView>
            
            <View style={todoSectionStyles.modalActions}>
              <TouchableOpacity
                style={[todoSectionStyles.cancelButton, { backgroundColor: '#F3F4F6' }]}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={[todoSectionStyles.cancelButtonText, { color: '#6B7280' }]}>
                  Cancelar
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[todoSectionStyles.addButton, { backgroundColor: '#1E3A8A' }]}
                onPress={addTask}
              >
                <Text style={[todoSectionStyles.addButtonText, { color: '#FFFFFF' }]}>
                  Agregar Tarea
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default TodoSection;
