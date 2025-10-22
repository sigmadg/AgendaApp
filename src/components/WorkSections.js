import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Modal, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';

const WorkSections = ({ selectedDate, events, onAddEvent, onEditEvent, onDeleteEvent }) => {
  const [activeSection, setActiveSection] = useState('weekly');
  const [projectData, setProjectData] = useState({
    title: '',
    aim: '',
    startDate: '',
    deadline: '',
    teammates: [],
    achievements: [],
    works: [],
    funding: []
  });
  const [weeklyTasks, setWeeklyTasks] = useState([]);
  const [dailyTasks, setDailyTasks] = useState({});
  const [priorities, setPriorities] = useState([]);
  const [focus, setFocus] = useState([]);
  const [goals, setGoals] = useState([]);
  const [projects, setProjects] = useState([]);
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskDate, setNewTaskDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [selectedTaskNotes, setSelectedTaskNotes] = useState('');
  const [editingTaskIndex, setEditingTaskIndex] = useState(null);
  
  // Estados para tareas diarias
  const [newDailyTaskText, setNewDailyTaskText] = useState('');
  const [newDailyTaskDate, setNewDailyTaskDate] = useState(new Date());
  const [newDailyTaskTime, setNewDailyTaskTime] = useState(new Date());
  const [showDailyDatePicker, setShowDailyDatePicker] = useState(false);
  const [showDailyTimePicker, setShowDailyTimePicker] = useState(false);
  const [showDailyNotesModal, setShowDailyNotesModal] = useState(false);
  const [selectedDailyTaskNotes, setSelectedDailyTaskNotes] = useState('');
  const [editingDailyTaskIndex, setEditingDailyTaskIndex] = useState(null);
  
  // Estados para modales de metas
  const [showDateModal, setShowDateModal] = useState(false);
  const [showPersonModal, setShowPersonModal] = useState(false);
  const [editingAchievementIndex, setEditingAchievementIndex] = useState(null);
  const [tempDate, setTempDate] = useState('');
  const [tempPerson, setTempPerson] = useState('');
  const [tempPosition, setTempPosition] = useState('');
  const [newAchievementText, setNewAchievementText] = useState('');
  
  // Estados para proyectos
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [newProjectDeadline, setNewProjectDeadline] = useState('');
  const [newProjectGoals, setNewProjectGoals] = useState([]);
  const [newProjectGoalText, setNewProjectGoalText] = useState('');
  
  // Estados para modales de metas del proyecto
  const [showProjectDateModal, setShowProjectDateModal] = useState(false);
  const [showProjectPersonModal, setShowProjectPersonModal] = useState(false);
  const [editingProjectGoalId, setEditingProjectGoalId] = useState(null);
  const [tempProjectDate, setTempProjectDate] = useState('');
  const [tempProjectPerson, setTempProjectPerson] = useState('');
  const [tempProjectPosition, setTempProjectPosition] = useState('');
  // Estados para el calendario de fecha límite del proyecto
  const [showProjectDeadlineModal, setShowProjectDeadlineModal] = useState(false);
  const [tempProjectDeadline, setTempProjectDeadline] = useState('');
  // Estados para prioridades mejoradas
  const [priorityList, setPriorityList] = useState([]);
  const [newPriorityText, setNewPriorityText] = useState('');
  const priorityColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];
  // Estados para enfoque mejorado
  const [focusList, setFocusList] = useState([]);
  const [newFocusText, setNewFocusText] = useState('');
  const focusColors = ['#0c5460', '#17a2b8', '#6f42c1', '#e83e8c', '#fd7e14'];
  // Estados para objetivos mejorados
  const [goalsList, setGoalsList] = useState([]);
  const [newGoalText, setNewGoalText] = useState('');
  const goalsColors = ['#28a745', '#20c997', '#ffc107', '#dc3545', '#6c757d'];

  const sections = [
    { id: 'weekly', name: 'Tareas Semanales', icon: 'calendar-outline' },
    { id: 'daily', name: 'Tareas Diarias', icon: 'today-outline' },
    { id: 'projects', name: 'Proyectos', icon: 'folder-outline' },
    { id: 'priorities', name: 'Prioridades', icon: 'flag-outline' },
    { id: 'focus', name: 'Enfoque', icon: 'bulb-outline' },
    { id: 'goals', name: 'Objetivos', icon: 'trophy-outline' }
  ];

  const addTeammate = () => {
    setProjectData(prev => ({
      ...prev,
      teammates: [...prev.teammates, { position: '', name: '' }]
    }));
  };

  const updateTeammate = (index, field, value) => {
    setProjectData(prev => ({
      ...prev,
      teammates: prev.teammates.map((teammate, i) => 
        i === index ? { ...teammate, [field]: value } : teammate
      )
    }));
  };

  const addAchievement = () => {
    if (newAchievementText.trim() === '') {
      Alert.alert('Error', 'Por favor ingresa una meta');
      return;
    }
    
    setProjectData(prev => ({
      ...prev,
      achievements: [...prev.achievements, { 
        name: newAchievementText.trim(), 
        dueDate: '', 
        assignedPerson: '', 
        position: '' 
      }]
    }));
    
    setNewAchievementText('');
  };

  const updateAchievement = (index, field, value) => {
    setProjectData(prev => ({
      ...prev,
      achievements: prev.achievements.map((achievement, i) => 
        i === index ? { ...achievement, [field]: value } : achievement
      )
    }));
  };

  const removeAchievement = (index) => {
    Alert.alert(
      'Eliminar Meta',
      '¿Estás seguro de que quieres eliminar esta meta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            setProjectData(prev => ({
              ...prev,
              achievements: prev.achievements.filter((_, i) => i !== index)
            }));
          }
        }
      ]
    );
  };

  // Funciones para proyectos
  const addProject = async () => {
    if (newProjectName.trim() === '') {
      Alert.alert('Error', 'Por favor ingresa un nombre para el proyecto');
      return;
    }
    
    const newProject = {
      id: Date.now().toString(),
      name: newProjectName.trim(),
      description: newProjectDescription.trim(),
      deadline: newProjectDeadline.trim(),
      goals: newProjectGoals,
      createdAt: new Date().toISOString(),
    };
    
    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    
    // Guardar en Supabase
    await saveWorkData({
      projects: updatedProjects
    });
    
    setNewProjectName('');
    setNewProjectDescription('');
    setNewProjectDeadline('');
    setNewProjectGoals([]);
    setNewProjectGoalText('');
    setShowAddProjectModal(false);
  };

  const addProjectGoal = () => {
    if (newProjectGoalText.trim() === '') {
      Alert.alert('Error', 'Por favor ingresa el texto de la meta');
      return;
    }
    
    const newGoal = {
      id: Date.now().toString(),
      name: newProjectGoalText.trim(),
      dueDate: tempProjectDate || '',
      assignedPerson: tempProjectPerson || '',
    };
    
    setNewProjectGoals(prev => [...prev, newGoal]);
    setNewProjectGoalText('');
    setTempProjectDate('');
    setTempProjectPerson('');
  };

  const removeProjectGoal = (goalId) => {
    setNewProjectGoals(prev => prev.filter(goal => goal.id !== goalId));
  };

  const updateProjectGoal = (goalId, field, value) => {
    try {
      if (!goalId || !field) {
        console.error('updateProjectGoal: goalId o field es null/undefined', { goalId, field, value });
        return;
      }
      
      setNewProjectGoals(prev => {
        try {
          if (!Array.isArray(prev)) {
            console.error('newProjectGoals no es un array:', prev);
            return [];
          }
          
          return prev.map(goal => {
            if (!goal || !goal.id) {
              console.error('Goal inválido encontrado:', goal);
              return goal;
            }
            return goal.id === goalId ? { ...goal, [field]: value } : goal;
          });
        } catch (error) {
          console.error('Error en updateProjectGoal map:', error);
          return prev;
        }
      });
    } catch (error) {
      console.error('Error general en updateProjectGoal:', error);
    }
  };

  // Funciones para modales de metas del proyecto
  const openProjectDateModal = (goalId) => {
    if (!goalId || goalId === -1) {
      console.error('openProjectDateModal: goalId es inválido:', goalId);
      Alert.alert('Error', 'No se puede asignar fecha: ID de meta inválido');
      return;
    }
    
    if (!Array.isArray(newProjectGoals) || newProjectGoals.length === 0) {
      console.error('openProjectDateModal: No hay metas del proyecto');
      Alert.alert('Error', 'No hay metas del proyecto para asignar fecha');
      return;
    }
    
    const goal = newProjectGoals.find(g => g && g.id === goalId);
    if (!goal) {
      console.error('openProjectDateModal: No se encontró la meta con ID:', goalId);
      Alert.alert('Error', 'No se encontró la meta del proyecto');
      return;
    }
    
    setEditingProjectGoalId(goalId);
    setTempProjectDate(goal?.dueDate || '');
    setShowProjectDateModal(true);
  };

  const openProjectPersonModal = (goalId) => {
    console.log('Abriendo modal de persona para goalId:', goalId);
    console.log('newProjectGoals:', newProjectGoals);
    
    if (!goalId || goalId === -1) {
      console.error('openProjectPersonModal: goalId es inválido:', goalId);
      Alert.alert('Error', 'No se puede asignar persona: ID de meta inválido');
      return;
    }
    
    if (!Array.isArray(newProjectGoals) || newProjectGoals.length === 0) {
      console.error('openProjectPersonModal: No hay metas del proyecto');
      Alert.alert('Error', 'No hay metas del proyecto para asignar persona');
      return;
    }
    
    const goal = newProjectGoals.find(g => g && g.id === goalId);
    console.log('Goal encontrado:', goal);
    
    if (!goal) {
      console.error('openProjectPersonModal: No se encontró la meta con ID:', goalId);
      Alert.alert('Error', 'No se encontró la meta del proyecto');
      return;
    }
    
    setEditingProjectGoalId(goalId);
    setTempProjectPerson(goal?.assignedPerson || '');
    setShowProjectPersonModal(true);
  };

  const saveProjectDate = () => {
    if (editingProjectGoalId !== null) {
      updateProjectGoal(editingProjectGoalId, 'dueDate', tempProjectDate);
    }
    setShowProjectDateModal(false);
    setEditingProjectGoalId(null);
    setTempProjectDate('');
  };

  const saveProjectPerson = () => {
    // Solo cerrar el modal, la persona ya está guardada en tempProjectPerson
    setShowProjectPersonModal(false);
  };

  // Funciones para el calendario de fecha límite del proyecto
  const openProjectDeadlineModal = () => {
    setTempProjectDeadline(newProjectDeadline);
    setShowProjectDeadlineModal(true);
  };

  const saveProjectDeadline = () => {
    setNewProjectDeadline(tempProjectDeadline);
    setShowProjectDeadlineModal(false);
    setTempProjectDeadline('');
  };

  const removeProject = (projectId) => {
    Alert.alert(
      'Eliminar Proyecto',
      '¿Estás seguro de que quieres eliminar este proyecto? Se perderán todas las metas asociadas.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            setProjects(prev => prev.filter(project => project.id !== projectId));
          }
        }
      ]
    );
  };

  // Funciones para modales de metas
  const openDateModal = (index) => {
    setEditingAchievementIndex(index);
    setTempDate(projectData.achievements[index]?.dueDate || '');
    setShowDateModal(true);
  };

  const openPersonModal = (index) => {
    setEditingAchievementIndex(index);
    setTempPerson(projectData.achievements[index]?.assignedPerson || '');
    setTempPosition(projectData.achievements[index]?.position || '');
    setShowPersonModal(true);
  };

  const saveDate = () => {
    if (editingAchievementIndex !== null) {
      updateAchievement(editingAchievementIndex, 'dueDate', tempDate);
    }
    setShowDateModal(false);
    setEditingAchievementIndex(null);
    setTempDate('');
  };

  const savePerson = () => {
    if (editingAchievementIndex !== null) {
      updateAchievement(editingAchievementIndex, 'assignedPerson', tempPerson);
      updateAchievement(editingAchievementIndex, 'position', tempPosition);
    }
    setShowPersonModal(false);
    setEditingAchievementIndex(null);
    setTempPerson('');
    setTempPosition('');
  };

  const addWork = () => {
    setProjectData(prev => ({
      ...prev,
      works: [...prev.works, { position: '', appoint: '', status: '', startDate: '', deadline: '', notes: '' }]
    }));
  };

  const updateWork = (index, field, value) => {
    setProjectData(prev => ({
      ...prev,
      works: prev.works.map((work, i) => 
        i === index ? { ...work, [field]: value } : work
      )
    }));
  };

  const addFunding = () => {
    setProjectData(prev => ({
      ...prev,
      funding: [...prev.funding, { element: '', projectedCost: '', realCost: '', notes: '' }]
    }));
  };

  const updateFunding = (index, field, value) => {
    setProjectData(prev => ({
      ...prev,
      funding: prev.funding.map((fund, i) => 
        i === index ? { ...fund, [field]: value } : fund
      )
    }));
  };

  // Función para guardar datos en Supabase
  const saveWorkData = async (sectionData) => {
    if (onUpdateSection) {
      try {
        await onUpdateSection('work', sectionData);
      } catch (error) {
        console.error('Error saving work data:', error);
      }
    }
  };

  const getCurrentWeekDates = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    return {
      start: startOfWeek.toISOString().split('T')[0],
      end: endOfWeek.toISOString().split('T')[0]
    };
  };

  const getTaskStatus = (taskDate) => {
    if (!taskDate) return 'current';
    
    const today = new Date().toISOString().split('T')[0];
    const weekDates = getCurrentWeekDates();
    
    if (taskDate < weekDates.start) {
      return 'overdue';
    } else if (taskDate > weekDates.end) {
      return 'future';
    } else {
      return 'current';
    }
  };

  const getTaskStatusLabel = (status) => {
    switch (status) {
      case 'overdue':
        return 'Tarea Atrasada';
      case 'future':
        return 'Para Próxima Semana';
      default:
        return '';
    }
  };

  const getTaskStatusColor = (status) => {
    switch (status) {
      case 'overdue':
        return '#FF3B30';
      case 'future':
        return '#FF9500';
      default:
        return '#34C759';
    }
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setNewTaskDate(selectedDate);
    }
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const formatDisplayDate = (date) => {
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const addWeeklyTask = () => {
    if (newTaskText.trim() === '') {
      Alert.alert('Error', 'Por favor ingresa una tarea');
      return;
    }
    
    const taskDateString = formatDate(newTaskDate);
    const status = getTaskStatus(taskDateString);
    
    const newTask = {
      id: Date.now().toString(),
      task: newTaskText.trim(),
      date: taskDateString,
      notes: '',
      completed: false,
      status: status
    };
    
    setWeeklyTasks(prev => [...prev, newTask]);
    setNewTaskText('');
    setNewTaskDate(new Date()); // Reset to current date
  };

  // Funciones para tareas diarias
  const onDailyDateChange = (event, selectedDate) => {
    setShowDailyDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setNewDailyTaskDate(selectedDate);
    }
  };

  const onDailyTimeChange = (event, selectedTime) => {
    setShowDailyTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      setNewDailyTaskTime(selectedTime);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const addDailyTask = () => {
    if (newDailyTaskText.trim() === '') {
      Alert.alert('Error', 'Por favor ingresa una tarea');
      return;
    }
    
    const taskDateString = formatDate(newDailyTaskDate);
    const taskTimeString = formatTime(newDailyTaskTime);
    
    const newTask = {
      id: Date.now().toString(),
      task: newDailyTaskText.trim(),
      date: taskDateString,
      time: taskTimeString,
      notes: '',
      completed: false
    };
    
    setDailyTasks(prev => ({
      ...prev,
      [taskDateString]: [...(prev[taskDateString] || []), newTask]
    }));
    
    setNewDailyTaskText('');
    setNewDailyTaskDate(new Date());
    setNewDailyTaskTime(new Date());
  };

  const toggleDailyTaskCompleted = (date, index) => {
    setDailyTasks(prev => ({
      ...prev,
      [date]: prev[date].map((task, i) => 
        i === index ? { ...task, completed: !task.completed } : task
      )
    }));
  };

  const removeDailyTask = (date, index) => {
    setDailyTasks(prev => ({
      ...prev,
      [date]: prev[date].filter((_, i) => i !== index)
    }));
  };

  const showDailyTaskNotes = (notes, date, index) => {
    setSelectedDailyTaskNotes(notes);
    setEditingDailyTaskIndex({ date, index });
    setShowDailyNotesModal(true);
  };

  const updateDailyTaskNotes = (notes) => {
    setSelectedDailyTaskNotes(notes);
    if (editingDailyTaskIndex !== null && editingDailyTaskIndex.date && editingDailyTaskIndex.index !== null) {
      setDailyTasks(prev => ({
        ...prev,
        [editingDailyTaskIndex.date]: prev[editingDailyTaskIndex.date].map((task, i) => 
          i === editingDailyTaskIndex.index ? { ...task, notes } : task
        )
      }));
    }
  };

  const closeDailyNotesModal = () => {
    setShowDailyNotesModal(false);
    setSelectedDailyTaskNotes('');
    setEditingDailyTaskIndex(null);
  };

  const toggleTaskCompleted = (index) => {
    setWeeklyTasks(prev => prev.map((task, i) => 
      i === index ? { ...task, completed: !task.completed } : task
    ));
  };

  const removeWeeklyTask = (index) => {
    setWeeklyTasks(prev => prev.filter((_, i) => i !== index));
  };

  const showTaskNotes = (notes, index) => {
    setSelectedTaskNotes(notes);
    setEditingTaskIndex(index);
    setShowNotesModal(true);
  };

  const updateTaskNotes = (notes) => {
    setSelectedTaskNotes(notes);
    if (editingTaskIndex !== null) {
      setWeeklyTasks(prev => prev.map((task, i) => 
        i === editingTaskIndex ? { ...task, notes } : task
      ));
    }
  };

  const closeNotesModal = () => {
    setShowNotesModal(false);
    setSelectedTaskNotes('');
    setEditingTaskIndex(null);
  };


  const renderSectionTabs = () => (
    <View style={styles.tabsContainer}>
      {sections.map(section => (
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
    </View>
  );

  const renderWeeklyTasks = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>LISTA DE TAREAS SEMANALES</Text>
        <Icon name="star" size={16} color="#FF6B6B" />
      </View>

      {/* Caja de texto para capturar nueva tarea */}
      <View style={styles.addTaskContainer}>
        <TextInput
          style={styles.newTaskInput}
          placeholder="Escribe una nueva tarea..."
          value={newTaskText}
          onChangeText={setNewTaskText}
          onSubmitEditing={addWeeklyTask}
          returnKeyType="done"
        />
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Icon name="calendar-outline" size={20} color="#007AFF" />
        </TouchableOpacity>
        <TouchableOpacity onPress={addWeeklyTask} style={styles.addTaskButton}>
          <Icon name="add" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Lista de tareas */}
      <View style={styles.tasksList}>
        {weeklyTasks.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="list-outline" size={48} color="#dee2e6" />
            <Text style={styles.emptyText}>No hay tareas agregadas</Text>
            <Text style={styles.emptySubtext}>Escribe una tarea arriba y toca el botón +</Text>
          </View>
        ) : (
          weeklyTasks
            .sort((a, b) => {
              // Ordenar por fecha (más reciente primero)
              const dateA = new Date(a.date);
              const dateB = new Date(b.date);
              return dateA - dateB;
            })
            .map((task, index) => {
              const taskStatus = task.status || getTaskStatus(task.date);
              const statusLabel = getTaskStatusLabel(taskStatus);
              const statusColor = getTaskStatusColor(taskStatus);
              
              return (
              <View key={task.id} style={[styles.taskListItem, task.completed && styles.completedTaskListItem]}>
                <TouchableOpacity
                  onPress={() => toggleTaskCompleted(index)}
                  style={styles.taskCheckbox}
                >
                  <Icon 
                    name={task.completed ? "checkmark-circle" : "ellipse-outline"} 
                    size={24} 
                    color={task.completed ? "#28a745" : "#6c757d"} 
                  />
                </TouchableOpacity>
                
                <View style={styles.taskContent}>
                  <Text style={[styles.taskText, task.completed && styles.completedTaskText]}>
                    {task.task}
                  </Text>
                  {task.date && (
                    <Text style={styles.taskDate}>
                      📅 {new Date(task.date).toLocaleDateString('es-ES')}
                    </Text>
                  )}
                  {statusLabel && (
                    <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
                      <Text style={styles.statusText}>{statusLabel}</Text>
                    </View>
                  )}
                </View>
                
                <View style={styles.taskActions}>
                  <TouchableOpacity
                    onPress={() => showTaskNotes(task.notes, index)}
                    style={[styles.notesButton, task.notes.trim() !== '' && styles.notesButtonActive]}
                  >
                    <Icon 
                      name="create-outline" 
                      size={18} 
                      color={task.notes.trim() !== '' ? "#007AFF" : "#6c757d"} 
                    />
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    onPress={() => removeWeeklyTask(index)}
                    style={styles.taskDeleteButton}
                  >
                    <Icon name="trash-outline" size={18} color="#dc3545" />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}
      </View>
    </View>
  );

  const renderDailyTasks = () => {
    const currentDate = formatDate(newDailyTaskDate);
    
    // Obtener todas las tareas diarias y ordenarlas cronológicamente
    const allDailyTasks = Object.keys(dailyTasks)
      .flatMap(date => dailyTasks[date].map(task => ({ ...task, date })))
      .sort((a, b) => {
        // Ordenar por fecha primero, luego por hora
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        
        if (dateA.getTime() !== dateB.getTime()) {
          return dateA - dateB;
        }
        
        // Si es la misma fecha, ordenar por hora
        return a.time.localeCompare(b.time);
      });
    
    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Tareas Diarias</Text>
          <Text style={styles.sectionSubtitle}>
            Organiza tus tareas por fecha y hora
          </Text>
        </View>
        
        <View style={styles.sectionContent}>
        
        {/* Caja de texto para capturar nueva tarea diaria */}
        <View style={styles.addTaskContainer}>
          <TextInput
            style={styles.newTaskInput}
            placeholder="Escribe una nueva tarea diaria..."
            value={newDailyTaskText}
            onChangeText={setNewDailyTaskText}
            onSubmitEditing={addDailyTask}
            returnKeyType="done"
          />
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => setShowDailyDatePicker(true)}
          >
            <Icon name="calendar-outline" size={20} color="#007AFF" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => setShowDailyTimePicker(true)}
          >
            <Icon name="time-outline" size={20} color="#007AFF" />
          </TouchableOpacity>
          <TouchableOpacity onPress={addDailyTask} style={styles.addTaskButton}>
            <Icon name="add" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Lista de tareas diarias */}
        <View style={styles.tasksList}>
          {allDailyTasks.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="calendar-outline" size={48} color="#dee2e6" />
              <Text style={styles.emptyText}>No hay tareas diarias</Text>
              <Text style={styles.emptySubtext}>Agrega una tarea arriba y toca el botón +</Text>
            </View>
          ) : (
            allDailyTasks.map((task, index) => {
              const taskDate = task.date;
              const taskIndex = dailyTasks[taskDate]?.findIndex(t => t.id === task.id) || 0;
              
              return (
                <View key={task.id} style={[styles.taskListItem, task.completed && styles.completedTaskListItem]}>
                  <TouchableOpacity
                    onPress={() => toggleDailyTaskCompleted(taskDate, taskIndex)}
                    style={styles.taskCheckbox}
                  >
                    <Icon 
                      name={task.completed ? "checkmark-circle" : "ellipse-outline"} 
                      size={24} 
                      color={task.completed ? "#28a745" : "#6c757d"} 
                    />
                  </TouchableOpacity>
                  
                  <View style={styles.taskContent}>
                    <Text style={[styles.taskText, task.completed && styles.completedTaskText]}>
                      {task.task}
                    </Text>
                    <Text style={styles.taskTime}>
                      📅 {formatDisplayDate(new Date(task.date))} 🕐 {task.time}
                    </Text>
                  </View>
                  
                  <View style={styles.taskActions}>
                    <TouchableOpacity
                      onPress={() => showDailyTaskNotes(task.notes, taskDate, taskIndex)}
                      style={[styles.notesButton, task.notes.trim() !== '' && styles.notesButtonActive]}
                    >
                      <Icon 
                        name="create-outline" 
                        size={18} 
                        color={task.notes.trim() !== '' ? "#007AFF" : "#6c757d"} 
                      />
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      onPress={() => removeDailyTask(taskDate, taskIndex)}
                      style={styles.taskDeleteButton}
                    >
                      <Icon name="trash-outline" size={18} color="#dc3545" />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}
        </View>
        </View>
      </View>
    );
  };

  const renderProjectStrategy = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Estrategia de Proyecto</Text>
        <Text style={styles.sectionSubtitle}>
          Define los objetivos y estructura de tu proyecto
        </Text>
      </View>
      
      <View style={styles.sectionContent}>
        <View style={styles.projectForm}>
        <View style={styles.inputRow}>
          <Text style={styles.label}>TÍTULO DEL PROYECTO:</Text>
          <TextInput
            style={styles.textInput}
            value={projectData.title}
            onChangeText={(value) => setProjectData(prev => ({ ...prev, title: value }))}
            placeholder="Nombre del proyecto"
          />
        </View>
        
        <View style={styles.inputRow}>
          <Text style={styles.label}>OBJETIVO DEL PROYECTO:</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            value={projectData.aim}
            onChangeText={(value) => setProjectData(prev => ({ ...prev, aim: value }))}
            placeholder="Breve introducción del proyecto"
            multiline
            numberOfLines={3}
          />
        </View>
        
        <View style={styles.inputRow}>
          <Text style={styles.label}>FECHA DE INICIO:</Text>
          <TextInput
            style={styles.textInput}
            value={projectData.startDate}
            onChangeText={(value) => setProjectData(prev => ({ ...prev, startDate: value }))}
            placeholder="DD/MM/AAAA"
          />
          <Text style={styles.label}>FECHA LÍMITE:</Text>
          <TextInput
            style={styles.textInput}
            value={projectData.deadline}
            onChangeText={(value) => setProjectData(prev => ({ ...prev, deadline: value }))}
            placeholder="DD/MM/AAAA"
          />
        </View>
        
        
        {/* Campo para agregar nueva meta */}
        <View style={styles.addTaskContainer}>
          <TextInput
            style={styles.newTaskInput}
            placeholder="Escribe una nueva meta..."
            value={newAchievementText}
            onChangeText={setNewAchievementText}
            onSubmitEditing={addAchievement}
            returnKeyType="done"
          />
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => {
              Alert.alert('Información', 'Primero agrega la meta, luego podrás asignar fecha y persona');
            }}
          >
            <Icon name="calendar-outline" size={20} color="#6c757d" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => {
              Alert.alert('Información', 'Primero agrega la meta, luego podrás asignar fecha y persona');
            }}
          >
            <Icon name="person-outline" size={20} color="#6c757d" />
          </TouchableOpacity>
          <TouchableOpacity onPress={addAchievement} style={styles.addTaskButton}>
            <Icon name="add" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Lista de metas */}
        <View style={styles.tasksList}>
          {projectData.achievements.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="flag-outline" size={48} color="#dee2e6" />
              <Text style={styles.emptyText}>No hay metas agregadas</Text>
              <Text style={styles.emptySubtext}>Escribe una meta arriba y toca el botón +</Text>
            </View>
          ) : (
            projectData.achievements.map((achievement, index) => (
              <View key={index} style={styles.taskListItem}>
                <View style={styles.taskContent}>
                  <Text style={styles.taskText}>
                    {achievement.name}
                  </Text>
                  <View style={styles.taskMetaInfo}>
                    {achievement.dueDate && (
                      <Text style={styles.taskMeta}>
                        📅 {achievement.dueDate}
                      </Text>
                    )}
                    {achievement.assignedPerson && (
                      <Text style={styles.taskMeta}>
                        👤 {achievement.assignedPerson}
                        {achievement.position && ` - ${achievement.position}`}
                      </Text>
                    )}
                  </View>
                </View>
                
                <View style={styles.taskActions}>
                  <TouchableOpacity
                    onPress={() => openDateModal(index)}
                    style={[styles.notesButton, achievement.dueDate && styles.notesButtonActive]}
                  >
                    <Icon 
                      name="calendar-outline" 
                      size={18} 
                      color={achievement.dueDate ? "#007AFF" : "#6c757d"} 
                    />
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    onPress={() => openPersonModal(index)}
                    style={[styles.notesButton, achievement.assignedPerson && styles.notesButtonActive]}
                  >
                    <Icon 
                      name="person-outline" 
                      size={18} 
                      color={achievement.assignedPerson ? "#28a745" : "#6c757d"} 
                    />
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    onPress={() => removeAchievement(index)}
                    style={styles.taskDeleteButton}
                  >
                    <Icon name="trash-outline" size={18} color="#dc3545" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
        </View>
      </View>
    </View>
  );

  const renderProjects = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Proyectos</Text>
        <Text style={styles.sectionSubtitle}>
          Gestiona y organiza tus proyectos de trabajo
        </Text>
      </View>
      
      <View style={styles.sectionContent}>
        {projects.length === 0 ? (
        <View style={styles.emptyState}>
          <Icon name="folder-outline" size={48} color="#dee2e6" />
          <Text style={styles.emptyText}>No hay proyectos creados</Text>
          <Text style={styles.emptySubtext}>Toca el botón + para crear tu primer proyecto</Text>
        </View>
      ) : (
        <View style={styles.projectsGrid}>
          {projects.map((project) => (
            <View key={project.id} style={styles.projectCard}>
              <View style={styles.projectCardHeader}>
                <Text style={styles.projectCardTitle}>{project.name}</Text>
                <TouchableOpacity
                  onPress={() => removeProject(project.id)}
                  style={styles.projectDeleteButton}
                >
                  <Icon name="close" size={16} color="#dc3545" />
                </TouchableOpacity>
              </View>
              
              {project.description && (
                <Text style={styles.projectCardDescription}>{project.description}</Text>
              )}
              
              {project.deadline && (
                <View style={styles.projectCardMeta}>
                  <Icon name="calendar-outline" size={14} color="#6c757d" />
                  <Text style={styles.projectCardMetaText}>Vence: {project.deadline}</Text>
                </View>
              )}
              
              <View style={styles.projectCardMeta}>
                <Icon name="flag-outline" size={14} color="#6c757d" />
                <Text style={styles.projectCardMetaText}>
                  {project.goals.length} meta{project.goals.length !== 1 ? 's' : ''}
                </Text>
              </View>
              
              <View style={styles.projectCardMeta}>
                <Icon name="time-outline" size={14} color="#6c757d" />
                <Text style={styles.projectCardMetaText}>
                  Creado: {new Date(project.createdAt).toLocaleDateString()}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}
        
        <TouchableOpacity 
          onPress={() => setShowAddProjectModal(true)}
          style={styles.addProjectButton}
        >
          <Icon name="add" size={20} color="#FFFFFF" />
          <Text style={styles.addProjectButtonText}>Nuevo Proyecto</Text>
        </TouchableOpacity>
    </View>
    </View>
  );

  const renderPriorities = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>PRIORIDADES</Text>
        <Text style={styles.sectionSubtitle}>
          Define y gestiona tus prioridades clave
        </Text>
      </View>
      
      <View style={styles.sectionContent}>
        {/* Caja de texto para capturar nueva prioridad */}
        <View style={styles.addTaskContainer}>
          <TextInput
            style={styles.newTaskInput}
            placeholder="Escribe una nueva prioridad..."
            value={newPriorityText}
            onChangeText={setNewPriorityText}
            onSubmitEditing={async () => {
              if (newPriorityText.trim() !== '' && priorityList.length < 5) {
                const newPriorityList = [...priorityList, { id: Date.now(), text: newPriorityText.trim(), completed: false }];
                setPriorityList(newPriorityList);
                setNewPriorityText('');
                
                // Guardar en Supabase
                await saveWorkData({
                  priorities: newPriorityList
                });
              }
            }}
            returnKeyType="done"
          />
          <TouchableOpacity 
            onPress={async () => {
              if (newPriorityText.trim() !== '' && priorityList.length < 5) {
                const newPriorityList = [...priorityList, { id: Date.now(), text: newPriorityText.trim(), completed: false }];
                setPriorityList(newPriorityList);
                setNewPriorityText('');
                
                // Guardar en Supabase
                await saveWorkData({
                  priorities: newPriorityList
                });
              }
            }} 
            style={styles.addTaskButton}
          >
            <Icon name="add" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

      {priorityList.length === 0 ? (
        <View style={styles.emptyPrioritiesState}>
          <Icon name="flag-outline" size={64} color="#dee2e6" />
          <Text style={styles.emptyPrioritiesText}>No hay prioridades definidas</Text>
          <Text style={styles.emptyPrioritiesSubtext}>Escribe una prioridad arriba y toca el botón +</Text>
        </View>
      ) : (
        <View style={styles.prioritiesContainer}>
          {priorityList.map((priority, index) => (
            <View key={priority.id} style={[
              styles.priorityCard,
              { borderLeftColor: priorityColors[index % priorityColors.length] },
              priority.completed && styles.completedPriorityCard
            ]}>
                <View style={styles.priorityCardHeader}>
                  <View style={styles.priorityContentContainer}>
                    <Text style={[
                      styles.priorityNumber,
                      { backgroundColor: priorityColors[index % priorityColors.length] }
                    ]}>
                      {index + 1}
                    </Text>
                    <TextInput
                      style={[
                        styles.priorityTextInput,
                        priority.completed && styles.completedPriorityText
                      ]}
                      value={priority.text}
                      onChangeText={(text) => {
                        const newList = priorityList.map(p => 
                          p.id === priority.id ? { ...p, text } : p
                        );
                        setPriorityList(newList);
                      }}
                      placeholder={`Prioridad ${index + 1}...`}
                      multiline
                      numberOfLines={2}
                      textAlignVertical="top"
                    />
                  </View>
                  <View style={styles.priorityActions}>
                    <TouchableOpacity
                      onPress={() => {
                        const newList = priorityList.map(p => 
                          p.id === priority.id ? { ...p, completed: !p.completed } : p
                        );
                        setPriorityList(newList);
                      }}
                      style={[
                        styles.priorityCheckbox,
                        priority.completed && styles.priorityCheckboxCompleted
                      ]}
                    >
                      {priority.completed && <Icon name="checkmark" size={16} color="#FFFFFF" />}
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        setPriorityList(priorityList.filter(p => p.id !== priority.id));
                      }}
                      style={styles.priorityDeleteButton}
                    >
                      <Icon name="close" size={16} color="#dc3545" />
                    </TouchableOpacity>
                  </View>
                </View>
              
            </View>
          ))}
        </View>
      )}
    </View>
    </View>
  );

  const renderFocus = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Enfoque</Text>
        <Text style={styles.sectionSubtitle}>
          Define tus áreas de enfoque y concentración
        </Text>
      </View>
      
      <View style={styles.sectionContent}>
        {/* Caja de texto para capturar nuevo enfoque */}
        <View style={styles.addTaskContainer}>
          <TextInput
            style={styles.newTaskInput}
            placeholder="Escribe un nuevo enfoque..."
            value={newFocusText}
            onChangeText={setNewFocusText}
            onSubmitEditing={async () => {
              if (newFocusText.trim() !== '' && focusList.length < 5) {
                const newFocusList = [...focusList, { id: Date.now(), text: newFocusText.trim(), completed: false }];
                setFocusList(newFocusList);
                setNewFocusText('');
                
                // Guardar en Supabase
                await saveWorkData({
                  focus: newFocusList
                });
              }
            }}
            returnKeyType="done"
          />
          <TouchableOpacity 
            onPress={async () => {
              if (newFocusText.trim() !== '' && focusList.length < 5) {
                const newFocusList = [...focusList, { id: Date.now(), text: newFocusText.trim(), completed: false }];
                setFocusList(newFocusList);
                setNewFocusText('');
                
                // Guardar en Supabase
                await saveWorkData({
                  focus: newFocusList
                });
              }
            }} 
            style={styles.addTaskButton}
          >
            <Icon name="add" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {focusList.length === 0 ? (
        <View style={styles.emptyFocusState}>
          <Icon name="bulb-outline" size={64} color="#dee2e6" />
          <Text style={styles.emptyFocusText}>No hay enfoques definidos</Text>
          <Text style={styles.emptyFocusSubtext}>Escribe un enfoque arriba y toca el botón +</Text>
        </View>
      ) : (
        <View style={styles.focusContainer}>
          {focusList.map((focusItem, index) => (
            <View key={focusItem.id} style={[
              styles.focusCard,
              { borderLeftColor: focusColors[index % focusColors.length] },
              focusItem.completed && styles.completedFocusCard
            ]}>
              <View style={styles.focusCardHeader}>
                <View style={styles.focusContentContainer}>
                  <Text style={[
                    styles.focusNumber,
                    { backgroundColor: focusColors[index % focusColors.length] }
                  ]}>
                    {index + 1}
                  </Text>
                  <TextInput
                    style={[
                      styles.focusTextInput,
                      focusItem.completed && styles.completedFocusText
                    ]}
                    value={focusItem.text}
                    onChangeText={(text) => {
                      const newList = focusList.map(f => 
                        f.id === focusItem.id ? { ...f, text } : f
                      );
                      setFocusList(newList);
                    }}
                    placeholder={`Enfoque ${index + 1}...`}
                    multiline
                    numberOfLines={2}
                    textAlignVertical="top"
                  />
                </View>
                <View style={styles.focusActions}>
                  <TouchableOpacity
                    onPress={() => {
                      const newList = focusList.map(f => 
                        f.id === focusItem.id ? { ...f, completed: !f.completed } : f
                      );
                      setFocusList(newList);
                    }}
                    style={[
                      styles.focusCheckbox,
                      focusItem.completed && styles.focusCheckboxCompleted
                    ]}
                  >
                    {focusItem.completed && <Icon name="checkmark" size={16} color="#FFFFFF" />}
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setFocusList(focusList.filter(f => f.id !== focusItem.id));
                    }}
                    style={styles.focusDeleteButton}
                  >
                    <Icon name="close" size={16} color="#dc3545" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
    </View>
  );

  const renderGoals = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Objetivos</Text>
        <Text style={styles.sectionSubtitle}>
          Define y gestiona tus objetivos de trabajo
        </Text>
      </View>
      
      <View style={styles.sectionContent}>
        {/* Caja de texto para capturar nuevo objetivo */}
        <View style={styles.addTaskContainer}>
          <TextInput
            style={styles.newTaskInput}
            placeholder="Escribe un nuevo objetivo..."
            value={newGoalText}
            onChangeText={setNewGoalText}
            onSubmitEditing={async () => {
              if (newGoalText.trim() !== '' && goalsList.length < 5) {
                const newGoalsList = [...goalsList, { id: Date.now(), text: newGoalText.trim(), completed: false }];
                setGoalsList(newGoalsList);
                setNewGoalText('');
                
                // Guardar en Supabase
                await saveWorkData({
                  goals: newGoalsList
                });
              }
            }}
            returnKeyType="done"
          />
          <TouchableOpacity 
            onPress={async () => {
              if (newGoalText.trim() !== '' && goalsList.length < 5) {
                const newGoalsList = [...goalsList, { id: Date.now(), text: newGoalText.trim(), completed: false }];
                setGoalsList(newGoalsList);
                setNewGoalText('');
                
                // Guardar en Supabase
                await saveWorkData({
                  goals: newGoalsList
                });
              }
            }} 
            style={styles.addTaskButton}
          >
            <Icon name="add" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {goalsList.length === 0 ? (
        <View style={styles.emptyGoalsState}>
          <Icon name="trophy-outline" size={64} color="#dee2e6" />
          <Text style={styles.emptyGoalsText}>No hay objetivos definidos</Text>
          <Text style={styles.emptyGoalsSubtext}>Escribe un objetivo arriba y toca el botón +</Text>
        </View>
      ) : (
        <View style={styles.goalsContainer}>
          {goalsList.map((goal, index) => (
            <View key={goal.id} style={[
              styles.goalCard,
              { borderLeftColor: goalsColors[index % goalsColors.length] },
              goal.completed && styles.completedGoalCard
            ]}>
              <View style={styles.goalCardHeader}>
                <View style={styles.goalContentContainer}>
                  <Text style={[
                    styles.goalNumber,
                    { backgroundColor: goalsColors[index % goalsColors.length] }
                  ]}>
                    {index + 1}
                  </Text>
                  <TextInput
                    style={[
                      styles.goalTextInput,
                      goal.completed && styles.completedGoalText
                    ]}
                    value={goal.text}
                    onChangeText={(text) => {
                      const newList = goalsList.map(g => 
                        g.id === goal.id ? { ...g, text } : g
                      );
                      setGoalsList(newList);
                    }}
                    placeholder={`Objetivo ${index + 1}...`}
                    multiline
                    numberOfLines={2}
                    textAlignVertical="top"
                  />
                </View>
                <View style={styles.goalActions}>
                  <TouchableOpacity
                    onPress={() => {
                      const newList = goalsList.map(g => 
                        g.id === goal.id ? { ...g, completed: !g.completed } : g
                      );
                      setGoalsList(newList);
                    }}
                    style={[
                      styles.goalCheckbox,
                      goal.completed && styles.goalCheckboxCompleted
                    ]}
                  >
                    {goal.completed && <Icon name="checkmark" size={16} color="#FFFFFF" />}
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setGoalsList(goalsList.filter(g => g.id !== goal.id));
                    }}
                    style={styles.goalDeleteButton}
                  >
                    <Icon name="close" size={16} color="#dc3545" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
    </View>
  );

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'weekly':
        return renderWeeklyTasks();
      case 'daily':
        return renderDailyTasks();
      case 'projects':
        return renderProjects();
      case 'priorities':
        return renderPriorities();
      case 'focus':
        return renderFocus();
      case 'goals':
        return renderGoals();
      default:
        return renderWeeklyTasks();
    }
  };

  return (
    <View style={styles.container}>
      {renderSectionTabs()}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderActiveSection()}
      </ScrollView>
      
      {/* Modal para mostrar y editar notas */}
      <Modal
        visible={showNotesModal}
        animationType="fade"
        transparent={true}
        onRequestClose={closeNotesModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.notesModalContainer}>
            <View style={styles.notesModalHeader}>
              <Text style={styles.notesModalTitle}>Notas de la Tarea</Text>
              <TouchableOpacity 
                onPress={closeNotesModal} 
                style={styles.closeNotesButton}
              >
                <Icon name="close" size={24} color="#6c757d" />
              </TouchableOpacity>
            </View>
            <View style={styles.notesModalContent}>
              <TextInput
                style={styles.notesTextInput}
                placeholder="Escribe notas adicionales para esta tarea..."
                value={selectedTaskNotes}
                onChangeText={updateTaskNotes}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </View>
            <View style={styles.notesModalFooter}>
              <TouchableOpacity 
                onPress={closeNotesModal} 
                style={styles.saveNotesButton}
              >
                <Text style={styles.saveNotesButtonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
          </Modal>
          
          {/* Date Picker para tareas semanales */}
          {showDatePicker && (
            <DateTimePicker
              value={newTaskDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onDateChange}
              minimumDate={new Date(2020, 0, 1)}
              maximumDate={new Date(2030, 11, 31)}
            />
          )}
          
          {/* Date Picker para tareas diarias */}
          {showDailyDatePicker && (
            <DateTimePicker
              value={newDailyTaskDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onDailyDateChange}
              minimumDate={new Date(2020, 0, 1)}
              maximumDate={new Date(2030, 11, 31)}
            />
          )}
          
          {/* Time Picker para tareas diarias */}
          {showDailyTimePicker && (
            <DateTimePicker
              value={newDailyTaskTime}
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onDailyTimeChange}
            />
          )}
          
          {/* Modal para notas de tareas diarias */}
          <Modal
            visible={showDailyNotesModal}
            animationType="fade"
            transparent={true}
            onRequestClose={closeDailyNotesModal}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.notesModalContainer}>
                <View style={styles.notesModalHeader}>
                  <Text style={styles.notesModalTitle}>Notas de la Tarea Diaria</Text>
                  <TouchableOpacity 
                    onPress={closeDailyNotesModal} 
                    style={styles.closeNotesButton}
                  >
                    <Icon name="close" size={24} color="#6c757d" />
                  </TouchableOpacity>
                </View>
                <View style={styles.notesModalContent}>
                  <TextInput
                    style={styles.notesTextInput}
                    placeholder="Escribe notas adicionales para esta tarea..."
                    value={selectedDailyTaskNotes}
                    onChangeText={updateDailyTaskNotes}
                    multiline
                    numberOfLines={6}
                    textAlignVertical="top"
                  />
                </View>
                <View style={styles.notesModalFooter}>
                  <TouchableOpacity 
                    onPress={closeDailyNotesModal} 
                    style={styles.saveNotesButton}
                  >
                    <Text style={styles.saveNotesButtonText}>Guardar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
          
          {/* Modal para fecha de meta */}
          <Modal
            visible={showDateModal}
            animationType="fade"
            transparent={true}
            onRequestClose={() => setShowDateModal(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.notesModalContainer}>
                <View style={styles.notesModalHeader}>
                  <Text style={styles.notesModalTitle}>📅 Fecha de Vencimiento</Text>
                  <TouchableOpacity 
                    onPress={() => setShowDateModal(false)} 
                    style={styles.closeNotesButton}
                  >
                    <Icon name="close" size={24} color="#6c757d" />
                  </TouchableOpacity>
                </View>
                <View style={styles.notesModalContent}>
                  <DateTimePicker
                    value={tempDate ? new Date(tempDate) : new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'default' : 'default'}
                    onChange={(event, selectedDate) => {
                      if (event.type === 'set' && selectedDate) {
                        const dateString = selectedDate.toISOString().split('T')[0];
                        setTempDate(dateString);
                        setShowDateModal(false);
                        // Guardar la fecha inmediatamente
                        if (editingAchievementIndex !== null) {
                          updateAchievement(editingAchievementIndex, 'dueDate', dateString);
                        }
                      }
                    }}
                    style={styles.datePicker}
                  />
                </View>
                <View style={styles.notesModalFooter}>
                  <TouchableOpacity 
                    onPress={saveDate} 
                    style={styles.saveNotesButton}
                  >
                    <Text style={styles.saveNotesButtonText}>Guardar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
          
          {/* Modal para persona asignada */}
          <Modal
            visible={showPersonModal}
            animationType="fade"
            transparent={true}
            onRequestClose={() => setShowPersonModal(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.notesModalContainer}>
                <View style={styles.notesModalHeader}>
                  <Text style={styles.notesModalTitle}>👤 Persona Asignada</Text>
                  <TouchableOpacity 
                    onPress={() => setShowPersonModal(false)} 
                    style={styles.closeNotesButton}
                  >
                    <Icon name="close" size={24} color="#6c757d" />
                  </TouchableOpacity>
                </View>
                <View style={styles.notesModalContent}>
                  <TextInput
                    style={[styles.notesTextInput, { marginBottom: 16 }]}
                    placeholder="Nombre de la persona"
                    value={tempPerson}
                    onChangeText={setTempPerson}
                  />
                  <TextInput
                    style={styles.notesTextInput}
                    placeholder="Posición/Rol"
                    value={tempPosition}
                    onChangeText={setTempPosition}
                  />
                </View>
                <View style={styles.notesModalFooter}>
                  <TouchableOpacity 
                    onPress={savePerson} 
                    style={styles.saveNotesButton}
                  >
                    <Text style={styles.saveNotesButtonText}>Guardar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
          
          {/* Modal para agregar proyecto */}
          <Modal
            visible={showAddProjectModal}
            animationType="fade"
            transparent={true}
            onRequestClose={() => setShowAddProjectModal(false)}
          >
            <View style={styles.modalOverlay}>
              <ScrollView 
                horizontal={true} 
                showsHorizontalScrollIndicator={true}
                contentContainerStyle={styles.horizontalScrollContainer}
              >
                <View style={styles.projectModalContainer}>
                  <View style={styles.notesModalHeader}>
                    <Text style={styles.notesModalTitle}>📁 Nuevo Proyecto</Text>
                    <TouchableOpacity 
                      onPress={() => setShowAddProjectModal(false)} 
                      style={styles.closeNotesButton}
                    >
                      <Icon name="close" size={24} color="#6c757d" />
                    </TouchableOpacity>
                  </View>
                  
                  <ScrollView style={styles.projectModalContent} showsVerticalScrollIndicator={false}>
                  {/* Información básica del proyecto */}
                  <View style={styles.formSection}>
                    <View style={styles.formField}>
                      <Text style={styles.formLabel}>Nombre del Proyecto *</Text>
                      <View style={styles.projectNameContainer}>
                        <TextInput
                          style={styles.formInput}
                          value={newProjectName}
                          onChangeText={setNewProjectName}
                          placeholder="Ingresa el nombre del proyecto"
                        />
                        <TouchableOpacity
                          onPress={() => {
                            // Abrir DateTimePicker directamente sin modal
                            setShowProjectDeadlineModal(true);
                          }}
                          style={styles.projectDeadlineButton}
                        >
                          <Icon name="calendar-outline" size={20} color="#007AFF" />
                        </TouchableOpacity>
                      </View>
                      {newProjectDeadline && (
                        <Text style={styles.deadlineText}>
                          📅 Fecha límite: {newProjectDeadline}
                        </Text>
                      )}
                    </View>
                    
                    <View style={styles.formField}>
                      <Text style={styles.formLabel}>Descripción</Text>
                      <TextInput
                        style={[styles.formInput, styles.formTextArea]}
                        value={newProjectDescription}
                        onChangeText={setNewProjectDescription}
                        placeholder="Describe brevemente el proyecto"
                        multiline
                        numberOfLines={3}
                        textAlignVertical="top"
                      />
                    </View>
                  </View>

                  {/* Metas del proyecto */}
                  <View style={styles.formSection}>
                    <View style={styles.formSectionHeader}>
                      <Text style={styles.formSectionTitle}>🎯 Metas del Proyecto</Text>
                    </View>
                    
                    <View style={styles.addTaskContainer}>
                      <TextInput
                        style={styles.newTaskInput}
                        placeholder="Escribe una nueva meta..."
                        value={newProjectGoalText}
                        onChangeText={setNewProjectGoalText}
                        onSubmitEditing={addProjectGoal}
                        returnKeyType="done"
                      />
                      <TouchableOpacity 
                        style={styles.iconButton}
                        onPress={() => {
                          if (newProjectGoalText.trim() === '') {
                            Alert.alert('Información', 'Primero escribe el texto de la meta');
                            return;
                          }
                          // Abrir DateTimePicker directo para la meta que se está escribiendo
                          setTempProjectDate('');
                          setShowProjectDateModal(true);
                        }}
                      >
                        <Icon name="calendar-outline" size={20} color="#007AFF" />
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.iconButton}
                        onPress={() => {
                          if (newProjectGoalText.trim() === '') {
                            Alert.alert('Información', 'Primero escribe el texto de la meta');
                            return;
                          }
                          // Abrir modal de persona para la meta que se está escribiendo
                          setTempProjectPerson('');
                          setShowProjectPersonModal(true);
                        }}
                      >
                        <Icon name="person-outline" size={20} color="#28a745" />
                      </TouchableOpacity>
                      <TouchableOpacity 
                        onPress={addProjectGoal}
                        style={styles.addTaskButton}
                      >
                        <Icon name="add" size={20} color="#FFFFFF" />
                      </TouchableOpacity>
                    </View>
                    
                    {newProjectGoals.length === 0 ? (
                      <View style={styles.emptyGoalsState}>
                        <Icon name="flag-outline" size={48} color="#dee2e6" />
                        <Text style={styles.emptyGoalsText}>No hay metas agregadas</Text>
                        <Text style={styles.emptyGoalsSubtext}>Escribe una meta arriba y presiona Enter</Text>
                      </View>
                    ) : (
                      newProjectGoals.map((goal, index) => (
                        <View key={goal.id} style={styles.goalCard}>
                          <View style={styles.goalCardHeader}>
                            <Text style={styles.goalNumber}>Meta {index + 1}</Text>
                            <TouchableOpacity
                              onPress={() => removeProjectGoal(goal.id)}
                              style={styles.removeGoalButton}
                            >
                              <Icon name="close" size={16} color="#dc3545" />
                            </TouchableOpacity>
                          </View>
                          
                          <View style={styles.formField}>
                            <Text style={styles.goalText}>{goal.name}</Text>
                            {(goal.dueDate || goal.assignedPerson) && (
                              <View style={styles.goalDateContainer}>
                                {goal.dueDate && (
                                  <>
                                    <Text style={styles.goalDateText}>📅 {goal.dueDate}</Text>
                                  </>
                                )}
                                
                                {goal.assignedPerson && (
                                  <>
                                    <Text style={styles.goalDateText}>👤 {goal.assignedPerson}</Text>
                                  </>
                                )}
                              </View>
                            )}
                          </View>
                        </View>
                      ))
                    )}
                  </View>
                </ScrollView>
                
                <View style={styles.notesModalFooter}>
                  <TouchableOpacity 
                    onPress={addProject} 
                    style={styles.saveNotesButton}
                  >
                    <Text style={styles.saveNotesButtonText}>Crear Proyecto</Text>
                  </TouchableOpacity>
                </View>
                </View>
              </ScrollView>
            </View>
          </Modal>
          
          
          {/* Modal para persona asignada de meta del proyecto */}
          <Modal
            visible={showProjectPersonModal}
            animationType="fade"
            transparent={true}
            onRequestClose={() => setShowProjectPersonModal(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.notesModalContainer}>
                <View style={styles.notesModalHeader}>
                  <Text style={styles.notesModalTitle}>👤 Persona Asignada</Text>
                  <TouchableOpacity 
                    onPress={() => setShowProjectPersonModal(false)} 
                    style={styles.closeNotesButton}
                  >
                    <Icon name="close" size={24} color="#6c757d" />
                  </TouchableOpacity>
                </View>
                <View style={styles.notesModalContent}>
                  <View style={styles.simplePersonFormContainer}>
                    <View style={styles.simplePersonInputGroup}>
                      <TextInput
                        style={styles.simplePersonTextInput}
                        placeholder="Nombre de la persona"
                        value={tempProjectPerson || ''}
                        onChangeText={(text) => {
                          try {
                            console.log('Actualizando nombre:', text);
                            setTempProjectPerson(text);
                          } catch (error) {
                            console.error('Error al actualizar nombre:', error);
                          }
                        }}
                        autoCapitalize="words"
                        maxLength={50}
                        keyboardType="default"
                        returnKeyType="done"
                        multiline={false}
                        numberOfLines={1}
                      />
                    </View>
                  </View>
                </View>
                <View style={styles.notesModalFooter}>
                  <TouchableOpacity 
                    onPress={() => setShowProjectPersonModal(false)}
                    style={styles.cancelPersonButton}
                  >
                    <Text style={styles.cancelPersonButtonText}>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={saveProjectPerson} 
                    style={styles.addPersonButton}
                  >
                    <Icon name="person-add" size={18} color="#FFFFFF" />
                    <Text style={styles.addPersonButtonText}>Asignar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
          
          {/* DateTimePicker para fecha de meta del proyecto */}
          {showProjectDateModal && (
            <DateTimePicker
              value={tempProjectDate ? new Date(tempProjectDate) : new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'default' : 'default'}
              onChange={(event, selectedDate) => {
                if (event.type === 'set' && selectedDate) {
                  const dateString = selectedDate.toISOString().split('T')[0];
                  setTempProjectDate(dateString);
                  setShowProjectDateModal(false);
                } else if (event.type === 'dismissed') {
                  setShowProjectDateModal(false);
                }
              }}
              style={styles.datePicker}
            />
          )}
          
          {/* DateTimePicker para fecha límite del proyecto */}
          {showProjectDeadlineModal && (
            <DateTimePicker
              value={tempProjectDeadline ? new Date(tempProjectDeadline) : new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'default' : 'default'}
              onChange={(event, selectedDate) => {
                if (event.type === 'set' && selectedDate) {
                  const dateString = selectedDate.toISOString().split('T')[0];
                  setTempProjectDeadline(dateString);
                  setNewProjectDeadline(dateString);
                  setShowProjectDeadlineModal(false);
                } else if (event.type === 'dismissed') {
                  setShowProjectDeadlineModal(false);
                }
              }}
              style={styles.datePicker}
            />
          )}
          
        </View>
      );
    };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
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
    backgroundColor: '#FF6B6B',
  },
  tabText: {
    fontSize: 10,
    color: '#6c757d',
    marginLeft: 4,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 0, // No horizontal padding to span full width
    paddingTop: 16,
    paddingBottom: 40, // Increased bottom padding to prevent button cutoff
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 0,
    marginBottom: 20,
    marginHorizontal: 0, // No horizontal margin to span full width
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  sectionHeader: {
    alignItems: 'center',
    backgroundColor: '#FF6B6B',
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    marginBottom: 0,
    marginHorizontal: 0,
    shadowColor: '#FF6B6B',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontWeight: '500',
  },
  sectionContent: {
    padding: 16,
  },
  addProjectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 16,
    marginBottom: 20,
    shadowColor: '#FF6B6B',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  addProjectButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  addGoalsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 16,
    marginBottom: 20,
    shadowColor: '#FF6B6B',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  addGoalsButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  addFocusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 16,
    marginBottom: 20,
    shadowColor: '#FF6B6B',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  addFocusButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  addPriorityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 16,
    marginBottom: 30,
    shadowColor: '#FF6B6B',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  addPriorityButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 8,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerCell: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#495057',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  dayCell: {
    fontSize: 12,
    color: '#495057',
    textAlign: 'center',
    fontWeight: '500',
  },
  inputCell: {
    fontSize: 12,
    color: '#495057',
    paddingHorizontal: 4,
    textAlign: 'center',
  },
  cell: {
    fontSize: 12,
    color: '#495057',
    textAlign: 'center',
  },
  dailyContainer: {
    flex: 1,
  },
  timeSlots: {
    flex: 1,
  },
  timeSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeText: {
    fontSize: 12,
    color: '#495057',
    width: 50,
    textAlign: 'center',
  },
  taskInput: {
    flex: 1,
    fontSize: 14,
    color: '#495057',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 6,
    marginLeft: 12,
    backgroundColor: '#ffffff',
  },
  prioritiesTable: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 8,
  },
  noteBox: {
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
  },
  noteTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 8,
  },
  noteInput: {
    fontSize: 12,
    color: '#495057',
    textAlignVertical: 'top',
  },
  projectForm: {
    gap: 16,
  },
  inputRow: {
    gap: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#495057',
  },
  textInput: {
    fontSize: 14,
    color: '#495057',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 6,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  tableSection: {
    marginTop: 16,
  },
  tableTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#495057',
    flex: 1,
  },
  addButton: {
    backgroundColor: '#FF6B6B',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  prioritiesContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  priorityBox: {
    flex: 1,
    backgroundColor: '#fff3cd',
    borderRadius: 8,
    padding: 12,
  },
  priorityTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 8,
  },
  priorityInput: {
    fontSize: 12,
    color: '#495057',
    textAlignVertical: 'top',
  },
  focusBox: {
    flex: 1,
    backgroundColor: '#d1ecf1',
    borderRadius: 8,
    padding: 12,
  },
  focusTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0c5460',
    marginBottom: 8,
  },
  focusInput: {
    fontSize: 12,
    color: '#495057',
    textAlignVertical: 'top',
  },
  priorityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  focusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  weeklyGoalsContainer: {
    marginTop: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
  },
  goalsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#495057',
    marginBottom: 12,
    textAlign: 'center',
  },
  goalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 6,
    padding: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
    flex: 1,
    minWidth: '45%',
  },
  goalNumber: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginRight: 8,
    minWidth: 16,
  },
  goalInput: {
    flex: 1,
    fontSize: 11,
    color: '#495057',
    textAlignVertical: 'top',
  },
  addTaskButton: {
    backgroundColor: '#FF6B6B',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tasksList: {
    gap: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#6c757d',
    marginTop: 12,
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#adb5bd',
    textAlign: 'center',
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  taskNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  taskNumberText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  taskContent: {
    flex: 1,
    gap: 8,
  },
  taskInput: {
    fontSize: 14,
    color: '#495057',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 6,
    backgroundColor: '#f8f9fa',
  },
  notesInput: {
    fontSize: 12,
    color: '#6c757d',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 4,
    backgroundColor: '#ffffff',
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  // Estilos para la nueva estructura simplificada
  addTaskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  newTaskInput: {
    flex: 1,
    fontSize: 14,
    color: '#495057',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },
  dateTimeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskTime: {
    fontSize: 11,
    color: '#6c757d',
    fontStyle: 'italic',
  },
  dailyTasksTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d4150',
    marginBottom: 12,
    textAlign: 'center',
  },
  taskListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  completedTaskListItem: {
    backgroundColor: '#f8f9fa',
    opacity: 0.7,
  },
  taskCheckbox: {
    padding: 4,
    marginRight: 12,
  },
  taskContent: {
    flex: 1,
    gap: 4,
  },
  taskText: {
    fontSize: 14,
    color: '#495057',
    lineHeight: 20,
  },
  completedTaskText: {
    textDecorationLine: 'line-through',
    color: '#6c757d',
  },
  taskDate: {
    fontSize: 11,
    color: '#6c757d',
    fontStyle: 'italic',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginTop: 2,
  },
  statusText: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  taskDeleteButton: {
    padding: 6,
    backgroundColor: '#fff5f5',
    borderRadius: 6,
    minWidth: 32,
    minHeight: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Estilos para las acciones de la tarea
  taskActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  notesButton: {
    padding: 6,
    backgroundColor: '#f8f9fa',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e9ecef',
    minWidth: 32,
    minHeight: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notesButtonActive: {
    backgroundColor: '#e3f2fd',
    borderColor: '#007AFF',
  },
  // Estilos para el modal de notas
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  notesModalContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxHeight: '40%',
    minHeight: '30%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 12,
  },
  notesModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    paddingBottom: 12,
  },
  notesModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d4150',
  },
  closeNotesButton: {
    padding: 4,
  },
  notesModalContent: {
    flex: 1,
    marginBottom: 16,
  },
  notesTextInput: {
    fontSize: 14,
    color: '#495057',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f8f9fa',
    minHeight: 100,
    maxHeight: 150,
    textAlignVertical: 'top',
  },
  notesModalFooter: {
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 8,
  },
  saveNotesButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    minWidth: 100,
    alignItems: 'center',
  },
  saveNotesButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  taskMetaInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  taskMeta: {
    fontSize: 12,
    color: '#6c757d',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  projectsGrid: {
    flexDirection: 'column',
    gap: 16,
  },
  projectCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    borderWidth: 1,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  projectCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  projectCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d4150',
    flex: 1,
    marginRight: 8,
  },
  projectDeleteButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  projectCardDescription: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 12,
    lineHeight: 20,
  },
  projectCardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  projectCardMetaText: {
    fontSize: 12,
    color: '#6c757d',
    marginLeft: 6,
  },
  horizontalScrollContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 0,
  },
  projectModalContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    margin: 0,
    maxHeight: '95%',
    minWidth: 350, // Más ancho
    maxWidth: 450, // Límite máximo más grande
    width: '95%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
  },
  projectModalContent: {
    maxHeight: 600,
    paddingHorizontal: 20,
  },
  projectSection: {
    marginBottom: 24,
  },
  projectSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d4150',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    paddingBottom: 8,
  },
  // Estilos para formulario
  formSection: {
    marginBottom: 24,
  },
  formSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d4150',
    marginBottom: 16,
  },
  formSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  formField: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 8,
  },
  formInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
    color: '#495057',
  },
  formTextArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  addGoalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addGoalButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  emptyGoalsState: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderStyle: 'dashed',
  },
  emptyGoalsText: {
    fontSize: 16,
    color: '#6c757d',
    marginTop: 12,
    fontWeight: '500',
  },
  emptyGoalsSubtext: {
    fontSize: 14,
    color: '#adb5bd',
    marginTop: 4,
  },
  goalCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  goalCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF6B6B',
    backgroundColor: '#fff5f5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  goalText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d4150',
    lineHeight: 22,
    marginBottom: 8,
  },
  goalDateContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
    gap: 12,
  },
  goalDateText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
    marginLeft: 6,
    flex: 1,
    minWidth: '45%',
  },
  removeGoalButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  goalActionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  goalActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
    backgroundColor: '#ffffff',
  },
  goalActionButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  goalActionText: {
    fontSize: 12,
    color: '#6c757d',
    marginLeft: 6,
    fontWeight: '500',
  },
  goalActionTextActive: {
    color: '#FFFFFF',
  },
  // Estilos para el campo de fecha con icono
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  calendarIconButton: {
    position: 'absolute',
    right: 12,
    padding: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  // Estilos para el contenedor del nombre del proyecto
  projectNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  projectDeadlineButton: {
    position: 'absolute',
    right: 12,
    padding: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  deadlineText: {
    fontSize: 12,
    color: '#6c757d',
    marginTop: 8,
    fontStyle: 'italic',
  },
  // Estilos para prioridades mejoradas
  addPriorityButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 20,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyPrioritiesState: {
    alignItems: 'center',
    paddingVertical: 48,
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderStyle: 'dashed',
  },
  emptyPrioritiesText: {
    fontSize: 18,
    color: '#6c757d',
    marginTop: 16,
    fontWeight: '600',
  },
  emptyPrioritiesSubtext: {
    fontSize: 14,
    color: '#adb5bd',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  prioritiesContainer: {
    gap: 12,
  },
  priorityCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  completedPriorityCard: {
    backgroundColor: '#f8f9fa',
    opacity: 0.8,
  },
  priorityCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  priorityNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityContentContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    gap: 12,
  },
  priorityNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 24,
  },
  priorityActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priorityCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#dee2e6',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  priorityCheckboxCompleted: {
    backgroundColor: '#28a745',
    borderColor: '#28a745',
  },
  priorityDeleteButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  priorityInputContainer: {
    position: 'relative',
  },
  priorityTextInput: {
    fontSize: 16,
    color: '#2d4150',
    lineHeight: 22,
    minHeight: 24,
    flex: 1,
    textAlignVertical: 'top',
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  addNextPriorityButton: {
    position: 'absolute',
    right: 8,
    top: 8,
    backgroundColor: '#28a745',
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  completedPriorityText: {
    textDecorationLine: 'line-through',
    color: '#6c757d',
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#d4edda',
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  completedText: {
    fontSize: 12,
    color: '#28a745',
    fontWeight: '600',
    marginLeft: 4,
  },
  // Estilos para enfoque mejorado
  addFocusButton: {
    backgroundColor: '#0c5460',
    borderRadius: 20,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyFocusState: {
    alignItems: 'center',
    paddingVertical: 48,
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderStyle: 'dashed',
  },
  emptyFocusText: {
    fontSize: 18,
    color: '#6c757d',
    marginTop: 16,
    fontWeight: '600',
  },
  emptyFocusSubtext: {
    fontSize: 14,
    color: '#adb5bd',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  focusContainer: {
    gap: 12,
  },
  focusCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  completedFocusCard: {
    backgroundColor: '#f8f9fa',
    opacity: 0.8,
  },
  focusCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  focusNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  focusContentContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    gap: 12,
  },
  focusNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 24,
  },
  focusActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  focusCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#dee2e6',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  focusCheckboxCompleted: {
    backgroundColor: '#28a745',
    borderColor: '#28a745',
  },
  focusDeleteButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  focusInputContainer: {
    position: 'relative',
  },
  focusTextInput: {
    fontSize: 16,
    color: '#2d4150',
    lineHeight: 22,
    minHeight: 24,
    flex: 1,
    textAlignVertical: 'top',
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  addNextFocusButton: {
    position: 'absolute',
    right: 8,
    top: 8,
    backgroundColor: '#28a745',
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  completedFocusText: {
    textDecorationLine: 'line-through',
    color: '#6c757d',
  },
  // Estilos para objetivos mejorados
  addGoalsButton: {
    backgroundColor: '#28a745',
    borderRadius: 20,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyGoalsState: {
    alignItems: 'center',
    paddingVertical: 48,
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderStyle: 'dashed',
  },
  emptyGoalsText: {
    fontSize: 18,
    color: '#6c757d',
    marginTop: 16,
    fontWeight: '600',
  },
  emptyGoalsSubtext: {
    fontSize: 14,
    color: '#adb5bd',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  goalsContainer: {
    gap: 12,
  },
  goalCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  completedGoalCard: {
    backgroundColor: '#f8f9fa',
    opacity: 0.8,
  },
  goalCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalContentContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    gap: 12,
  },
  goalNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 24,
  },
  goalActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  goalCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#dee2e6',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  goalCheckboxCompleted: {
    backgroundColor: '#28a745',
    borderColor: '#28a745',
  },
  goalDeleteButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  goalInputContainer: {
    position: 'relative',
  },
  goalTextInput: {
    fontSize: 16,
    color: '#2d4150',
    lineHeight: 22,
    minHeight: 24,
    flex: 1,
    textAlignVertical: 'top',
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  addNextGoalButton: {
    position: 'absolute',
    right: 8,
    top: 8,
    backgroundColor: '#28a745',
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  completedGoalText: {
    textDecorationLine: 'line-through',
    color: '#6c757d',
  },
  deadlineModalText: {
    fontSize: 16,
    color: '#2d4150',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '500',
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  datePickerButtonText: {
    fontSize: 16,
    color: '#007AFF',
    marginLeft: 8,
    fontWeight: '600',
  },
  // Estilos para la interfaz mejorada de persona asignada
  personFormContainer: {
    gap: 24,
  },
  personInputGroup: {
    gap: 12,
  },
  personLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 6,
  },
  personTextInput: {
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
    color: '#495057',
  },
  selectedDateContainer: {
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#bbdefb',
  },
  selectedDateLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1976d2',
    marginBottom: 4,
  },
  selectedDateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1976d2',
  },
  personPreviewContainer: {
    marginTop: 16,
  },
  personPreviewLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6c757d',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  personPreviewCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
    gap: 12,
  },
  personPreviewInfo: {
    flex: 1,
    gap: 6,
  },
  personPreviewName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d4150',
    marginBottom: 4,
  },
  personPreviewPosition: {
    fontSize: 14,
    color: '#6c757d',
    fontStyle: 'italic',
    marginBottom: 4,
  },
  personPreviewDate: {
    fontSize: 13,
    color: '#007AFF',
    fontWeight: '500',
  },
  cancelPersonButton: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelPersonButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6c757d',
  },
  // Estilos simplificados para persona asignada
  simplePersonFormContainer: {
    gap: 20,
  },
  simplePersonInputGroup: {
    gap: 8,
  },
  simplePersonLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 8,
  },
  simplePersonTextInput: {
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: '#ffffff',
    color: '#495057',
    minHeight: 50,
  },
  simpleSelectedDateContainer: {
    backgroundColor: '#e3f2fd',
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: '#bbdefb',
    marginTop: 8,
  },
  simpleSelectedDateLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1976d2',
    marginBottom: 6,
  },
  simpleSelectedDateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1976d2',
  },
  addPersonButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 24,
    marginLeft: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    minHeight: 56,
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 5,
  },
  addPersonButtonText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});

export default WorkSections;
