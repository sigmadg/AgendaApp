import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Modal, Platform, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';

const WorkSections = ({ selectedDate, events, onAddEvent, onEditEvent, onDeleteEvent, onUpdateSection, user }) => {
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
  
  // Estados para planificación de trabajo
  const [workPlanningData, setWorkPlanningData] = useState({
    productivity: {
      tasksCompleted: 0,
      totalTasks: 0,
      efficiency: 0,
      focusTime: 0
    },
    weeklyProgress: [
      { day: 'Lunes', tasks: 8, completed: 6, hours: 8.5 },
      { day: 'Martes', tasks: 7, completed: 7, hours: 7.2 },
      { day: 'Miércoles', tasks: 9, completed: 8, hours: 8.8 },
      { day: 'Jueves', tasks: 6, completed: 5, hours: 6.5 },
      { day: 'Viernes', tasks: 8, completed: 7, hours: 7.9 }
    ],
    monthlyGoals: [
      { id: 1, title: 'Completar proyecto principal', progress: 75, deadline: '2024-01-31' },
      { id: 2, title: 'Mejorar productividad', progress: 60, deadline: '2024-02-15' },
      { id: 3, title: 'Aprender nueva tecnología', progress: 40, deadline: '2024-03-01' }
    ],
    timeTracking: {
      totalHours: 38.9,
      averagePerDay: 7.8,
      mostProductiveDay: 'Miércoles',
      leastProductiveDay: 'Jueves'
    }
  });

  const sections = [
    { id: 'daily', name: 'Tareas Diarias', icon: 'sunny-outline' },
    { id: 'weekly', name: 'Tareas Semanales', icon: 'leaf-outline' },
    { id: 'projects', name: 'Proyectos', icon: 'folder-outline' },
    { id: 'work-planning', name: 'Planificación de Trabajo', icon: 'trending-up-outline' },
    { id: 'goals', name: 'Objetivos', icon: 'flower-outline' }
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
      <View style={styles.tabsWrapper}>
        {sections.map((section) => (
          <TouchableOpacity
            key={section.id}
            style={[
              styles.tab,
              activeSection === section.id && styles.activeTab
            ]}
            onPress={() => setActiveSection(section.id)}
          >
            <View style={[styles.tabContent, {
              backgroundColor: activeSection === section.id ? '#D4A574' : 'transparent',
              borderColor: activeSection === section.id ? '#D4A574' : '#B8860B',
            }]}>
              <Icon 
                name={section.icon} 
                size={20} 
                color={activeSection === section.id ? '#FFFFFF' : '#8B4513'} 
              />
              {activeSection === section.id && (
                <View style={styles.activeIndicator} />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderWeeklyTasks = () => {
    const completedTasks = weeklyTasks.filter(task => task.completed).length;
    const totalTasks = weeklyTasks.length;
    const urgentTasks = weeklyTasks.filter(task => task.status === 'urgent').length;
    const overdueTasks = weeklyTasks.filter(task => task.status === 'overdue').length;

    return (
      <View style={styles.section}>
        {/* Header mejorado */}
        <View style={styles.weeklyHeader}>
          <View style={styles.weeklyHeaderContent}>
            <View style={styles.weeklyIconContainer}>
              <Icon name="calendar-outline" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.weeklyHeaderText}>
              <Text style={styles.weeklyHeaderTitle}>Tareas Semanales</Text>
              <Text style={styles.weeklyHeaderSubtitle}>Planifica tu semana de trabajo</Text>
            </View>
          </View>
          <View style={styles.weeklyHeaderBadge}>
            <Icon name="time-outline" size={16} color="#D2691E" />
          </View>
        </View>

        {/* Resumen de tareas mejorado */}
        <View style={styles.weeklySummary}>
          <View style={styles.summaryCard}>
            <View style={styles.summaryIconContainer}>
              <Icon name="checkmark-circle-outline" size={20} color="#3B82F6" />
            </View>
            <View style={styles.summaryContent}>
              <Text style={styles.summaryValue}>{completedTasks}/{totalTasks}</Text>
              <Text style={styles.summaryLabel}>Completadas</Text>
            </View>
          </View>
          <View style={styles.summaryCard}>
            <View style={styles.summaryIconContainer}>
              <Icon name="flash-outline" size={20} color="#10B981" />
            </View>
            <View style={styles.summaryContent}>
              <Text style={styles.summaryValue}>{urgentTasks}</Text>
              <Text style={styles.summaryLabel}>Urgentes</Text>
            </View>
          </View>
          <View style={styles.summaryCard}>
            <View style={styles.summaryIconContainer}>
              <Icon name="warning-outline" size={20} color="#F59E0B" />
            </View>
            <View style={styles.summaryContent}>
              <Text style={styles.summaryValue}>{overdueTasks}</Text>
              <Text style={styles.summaryLabel}>Vencidas</Text>
            </View>
          </View>
        </View>

        {/* Botón para agregar tarea */}
        <View style={styles.addWeeklyContainer}>
          <TouchableOpacity style={styles.addWeeklyButton} onPress={addWeeklyTask}>
            <Icon name="add-circle-outline" size={20} color="#FFFFFF" />
            <Text style={styles.addWeeklyText}>Agregar Tarea Semanal</Text>
          </TouchableOpacity>
        </View>

        {/* Lista de tareas mejorada */}
        <View style={styles.weeklyContainer}>
          <View style={styles.weeklyHeader}>
            <Text style={styles.weeklyTitle}>Mis Tareas Semanales</Text>
            <TouchableOpacity style={styles.filterButton}>
              <Icon name="filter-outline" size={16} color="#D2691E" />
              <Text style={styles.filterText}>Filtrar</Text>
            </TouchableOpacity>
          </View>
          
          {weeklyTasks.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="calendar-outline" size={48} color="#9CA3AF" />
              <Text style={styles.emptyTitle}>No hay tareas semanales</Text>
              <Text style={styles.emptySubtitle}>Agrega tu primera tarea para comenzar a planificar tu semana</Text>
              <TouchableOpacity style={styles.emptyButton} onPress={addWeeklyTask}>
                <Icon name="add-outline" size={20} color="#D2691E" />
                <Text style={styles.emptyButtonText}>Agregar Primera Tarea</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              {weeklyTasks
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
                    <View key={task.id} style={styles.weeklyItem}>
                      <View style={styles.weeklyItemHeader}>
                        <TouchableOpacity
                          onPress={() => toggleTaskCompleted(index)}
                          style={styles.weeklyCheckboxContainer}
                        >
                          <View style={[
                            styles.weeklyCheckbox,
                            task.completed && styles.weeklyCheckboxChecked
                          ]}>
                            {task.completed && (
                              <Icon name="checkmark" size={16} color="#FFFFFF" />
                            )}
                          </View>
                        </TouchableOpacity>
                        
                        <View style={styles.weeklyItemInfo}>
                          <Text style={[
                            styles.weeklyItemName,
                            task.completed && styles.weeklyItemNameCompleted
                          ]}>
                            {task.task}
                          </Text>
                          {task.date && (
                            <Text style={[
                              styles.weeklyItemDate,
                              task.completed && styles.weeklyItemDateCompleted
                            ]}>
                              {new Date(task.date).toLocaleDateString('es-ES')}
                            </Text>
                          )}
                        </View>
                        
                        <View style={styles.weeklyItemActions}>
                          <TouchableOpacity
                            onPress={() => showTaskNotes(task.notes, index)}
                            style={styles.weeklyActionButton}
                          >
                            <Icon name="create-outline" size={16} color="#6B7280" />
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => removeWeeklyTask(index)}
                            style={styles.weeklyActionButton}
                          >
                            <Icon name="trash-outline" size={16} color="#EF4444" />
                          </TouchableOpacity>
                        </View>
                      </View>
                      
                      {/* Notas de la tarea */}
                      {task.notes && task.notes.trim() !== '' && (
                        <View style={styles.weeklyItemNotes}>
                          <Text style={styles.weeklyNotesText}>{task.notes}</Text>
                        </View>
                      )}
                      
                      {/* Indicador de estado */}
                      <View style={styles.weeklyItemStatus}>
                        <View style={[
                          styles.weeklyStatusIndicator,
                          task.completed ? styles.weeklyStatusCompleted : 
                          taskStatus === 'urgent' ? styles.weeklyStatusUrgent :
                          taskStatus === 'overdue' ? styles.weeklyStatusOverdue : styles.weeklyStatusPending
                        ]} />
                        <Text style={[
                          styles.weeklyStatusText,
                          task.completed ? styles.weeklyStatusCompletedText : 
                          taskStatus === 'urgent' ? styles.weeklyStatusUrgentText :
                          taskStatus === 'overdue' ? styles.weeklyStatusOverdueText : styles.weeklyStatusPendingText
                        ]}>
                          {task.completed ? 'Completada' : 
                           taskStatus === 'urgent' ? 'Urgente' :
                           taskStatus === 'overdue' ? 'Vencida' : 'Pendiente'}
                        </Text>
                      </View>
                    </View>
                  );
                })}
            </ScrollView>
          )}
        </View>
      </View>
    );
  };

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

    const completedTasks = allDailyTasks.filter(task => task.completed).length;
    const totalTasks = allDailyTasks.length;
    const todayTasks = allDailyTasks.filter(task => task.date === currentDate).length;
    const overdueTasks = allDailyTasks.filter(task => {
      const taskDate = new Date(task.date);
      const today = new Date();
      return taskDate < today && !task.completed;
    }).length;
    
    return (
      <View style={styles.section}>
        {/* Header mejorado */}
        <View style={styles.dailyHeader}>
          <View style={styles.dailyHeaderContent}>
            <View style={styles.dailyIconContainer}>
              <Icon name="today-outline" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.dailyHeaderText}>
              <Text style={styles.dailyHeaderTitle}>Tareas Diarias</Text>
              <Text style={styles.dailyHeaderSubtitle}>Organiza tu trabajo día a día</Text>
            </View>
          </View>
          <View style={styles.dailyHeaderBadge}>
            <Icon name="calendar-outline" size={16} color="#D2691E" />
          </View>
        </View>

        {/* Resumen de tareas mejorado */}
        <View style={styles.dailySummary}>
          <View style={styles.summaryCard}>
            <View style={styles.summaryIconContainer}>
              <Icon name="checkmark-circle-outline" size={20} color="#3B82F6" />
            </View>
            <View style={styles.summaryContent}>
              <Text style={styles.summaryValue}>{completedTasks}/{totalTasks}</Text>
              <Text style={styles.summaryLabel}>Completadas</Text>
            </View>
          </View>
          <View style={styles.summaryCard}>
            <View style={styles.summaryIconContainer}>
              <Icon name="today-outline" size={20} color="#10B981" />
            </View>
            <View style={styles.summaryContent}>
              <Text style={styles.summaryValue}>{todayTasks}</Text>
              <Text style={styles.summaryLabel}>Hoy</Text>
            </View>
          </View>
          <View style={styles.summaryCard}>
            <View style={styles.summaryIconContainer}>
              <Icon name="warning-outline" size={20} color="#F59E0B" />
            </View>
            <View style={styles.summaryContent}>
              <Text style={styles.summaryValue}>{overdueTasks}</Text>
              <Text style={styles.summaryLabel}>Vencidas</Text>
            </View>
          </View>
        </View>

        {/* Botón para agregar tarea */}
        <View style={styles.addDailyContainer}>
          <TouchableOpacity style={styles.addDailyButton} onPress={addDailyTask}>
            <Icon name="add-circle-outline" size={20} color="#FFFFFF" />
            <Text style={styles.addDailyText}>Agregar Tarea Diaria</Text>
          </TouchableOpacity>
        </View>

        {/* Lista de tareas mejorada */}
        <View style={styles.dailyContainer}>
          <View style={styles.dailyHeader}>
            <Text style={styles.dailyTitle}>Mis Tareas Diarias</Text>
            <TouchableOpacity style={styles.filterButton}>
              <Icon name="filter-outline" size={16} color="#D2691E" />
              <Text style={styles.filterText}>Filtrar</Text>
            </TouchableOpacity>
          </View>
          
          {allDailyTasks.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="today-outline" size={48} color="#9CA3AF" />
              <Text style={styles.emptyTitle}>No hay tareas diarias</Text>
              <Text style={styles.emptySubtitle}>Agrega tu primera tarea para comenzar a organizar tu día</Text>
              <TouchableOpacity style={styles.emptyButton} onPress={addDailyTask}>
                <Icon name="add-outline" size={20} color="#D2691E" />
                <Text style={styles.emptyButtonText}>Agregar Primera Tarea</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              {allDailyTasks.map((task, index) => {
                const taskDate = task.date;
                const taskIndex = dailyTasks[taskDate]?.findIndex(t => t.id === task.id) || 0;
                const isOverdue = new Date(task.date) < new Date() && !task.completed;
                const isToday = task.date === currentDate;
                
                return (
                  <View key={task.id} style={styles.dailyItem}>
                    <View style={styles.dailyItemHeader}>
                      <TouchableOpacity
                        onPress={() => toggleDailyTaskCompleted(taskDate, taskIndex)}
                        style={styles.dailyCheckboxContainer}
                      >
                        <View style={[
                          styles.dailyCheckbox,
                          task.completed && styles.dailyCheckboxChecked
                        ]}>
                          {task.completed && (
                            <Icon name="checkmark" size={16} color="#FFFFFF" />
                          )}
                        </View>
                      </TouchableOpacity>
                      
                      <View style={styles.dailyItemInfo}>
                        <Text style={[
                          styles.dailyItemName,
                          task.completed && styles.dailyItemNameCompleted
                        ]}>
                          {task.task}
                        </Text>
                        <View style={styles.dailyItemDateTime}>
                          <View style={styles.dailyItemDateContainer}>
                            <Icon name="calendar-outline" size={14} color="#6B7280" />
                            <Text style={[
                              styles.dailyItemDate,
                              task.completed && styles.dailyItemDateCompleted
                            ]}>
                              {formatDisplayDate(new Date(task.date))}
                            </Text>
                          </View>
                          <View style={styles.dailyItemTimeContainer}>
                            <Icon name="time-outline" size={14} color="#6B7280" />
                            <Text style={[
                              styles.dailyItemTime,
                              task.completed && styles.dailyItemTimeCompleted
                            ]}>
                              {task.time}
                            </Text>
                          </View>
                        </View>
                      </View>
                      
                      <View style={styles.dailyItemActions}>
                        <TouchableOpacity
                          onPress={() => showDailyTaskNotes(task.notes, taskDate, taskIndex)}
                          style={styles.dailyActionButton}
                        >
                          <Icon name="create-outline" size={16} color="#6B7280" />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => removeDailyTask(taskDate, taskIndex)}
                          style={styles.dailyActionButton}
                        >
                          <Icon name="trash-outline" size={16} color="#EF4444" />
                        </TouchableOpacity>
                      </View>
                    </View>
                    
                    {/* Notas de la tarea */}
                    {task.notes && task.notes.trim() !== '' && (
                      <View style={styles.dailyItemNotes}>
                        <Text style={styles.dailyNotesText}>{task.notes}</Text>
                      </View>
                    )}
                    
                    {/* Indicador de estado */}
                    <View style={styles.dailyItemStatus}>
                      <View style={[
                        styles.dailyStatusIndicator,
                        task.completed ? styles.dailyStatusCompleted : 
                        isOverdue ? styles.dailyStatusOverdue :
                        isToday ? styles.dailyStatusToday : styles.dailyStatusPending
                      ]} />
                      <Text style={[
                        styles.dailyStatusText,
                        task.completed ? styles.dailyStatusCompletedText : 
                        isOverdue ? styles.dailyStatusOverdueText :
                        isToday ? styles.dailyStatusTodayText : styles.dailyStatusPendingText
                      ]}>
                        {task.completed ? 'Completada' : 
                         isOverdue ? 'Vencida' :
                         isToday ? 'Hoy' : 'Pendiente'}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          )}
        </View>
      </View>
    );
  };

  const renderProjectStrategy = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.headerDecoration}>
          <Image 
            source={require('../../android/app/src/main/assets/trabajo.png')}
            style={styles.mascotImage}
            resizeMode="contain"
          />
        </View>
        <View style={styles.headerContent}>
          <Text style={styles.sectionTitle}>Gestión de Proyectos</Text>
          <Text style={styles.sectionSubtitle}>
            Organiza y supervisa tus proyectos profesionales
          </Text>
        </View>
      </View>
      
      <View style={styles.sectionContent}>
        {/* Dashboard de Proyectos */}
        <View style={styles.projectDashboard}>
          <View style={styles.dashboardHeader}>
            <Text style={styles.dashboardTitle}>Panel de Control</Text>
            <TouchableOpacity style={styles.newProjectButton}>
              <Icon name="add-circle" size={20} color="#FFFFFF" />
              <Text style={styles.newProjectButtonText}>Nuevo Proyecto</Text>
            </TouchableOpacity>
          </View>
          
          {/* Estadísticas del Dashboard */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <View style={styles.statIcon}>
                <Icon name="folder" size={24} color="#D4A574" />
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statNumber}>12</Text>
                <Text style={styles.statLabel}>Proyectos Activos</Text>
              </View>
            </View>
            
            <View style={styles.statCard}>
              <View style={styles.statIcon}>
                <Icon name="checkmark-circle" size={24} color="#D4A574" />
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statNumber}>8</Text>
                <Text style={styles.statLabel}>Completados</Text>
              </View>
            </View>
            
            <View style={styles.statCard}>
              <View style={styles.statIcon}>
                <Icon name="time" size={24} color="#D4A574" />
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statNumber}>3</Text>
                <Text style={styles.statLabel}>En Retraso</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Lista de Proyectos */}
        <View style={styles.projectsSection}>
          <View style={styles.sectionTitleBar}>
            <Text style={styles.sectionTitleText}>Mis Proyectos</Text>
            <View style={styles.filterButtons}>
              <TouchableOpacity style={[styles.filterButton, styles.activeFilter]}>
                <Text style={styles.filterButtonText}>Todos</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterButton}>
                <Text style={styles.filterButtonText}>Activos</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterButton}>
                <Text style={styles.filterButtonText}>Completados</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Proyectos Lista */}
          <View style={styles.projectsList}>
            {/* Proyecto 1 */}
            <View style={styles.projectCard}>
              <View style={styles.projectHeader}>
                <View style={styles.projectInfo}>
                  <Text style={styles.projectName}>Sistema de Gestión CRM</Text>
                  <Text style={styles.projectClient}>Cliente: TechCorp Solutions</Text>
                </View>
                <View style={styles.projectStatus}>
                  <View style={[styles.statusBadge, styles.statusActive]}>
                    <Text style={styles.statusText}>En Progreso</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.projectDetails}>
                <View style={styles.projectMeta}>
                  <View style={styles.metaItem}>
                    <Icon name="calendar" size={14} color="#8B4513" />
                    <Text style={styles.metaText}>Inicio: 15 Ene 2024</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Icon name="flag" size={14} color="#8B4513" />
                    <Text style={styles.metaText}>Entrega: 30 Mar 2024</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Icon name="people" size={14} color="#8B4513" />
                    <Text style={styles.metaText}>Equipo: 5 personas</Text>
                  </View>
                </View>
                
                <View style={styles.progressContainer}>
                  <View style={styles.progressHeader}>
                    <Text style={styles.progressLabel}>Progreso</Text>
                    <Text style={styles.progressPercentage}>65%</Text>
                  </View>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: '65%' }]} />
                  </View>
                </View>
              </View>
              
              <View style={styles.projectActions}>
                <TouchableOpacity style={styles.actionButton}>
                  <Icon name="eye" size={16} color="#8B4513" />
                  <Text style={styles.actionText}>Ver</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Icon name="list" size={16} color="#8B4513" />
                  <Text style={styles.actionText}>Metas</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Icon name="create" size={16} color="#8B4513" />
                  <Text style={styles.actionText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Icon name="share" size={16} color="#8B4513" />
                  <Text style={styles.actionText}>Compartir</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Proyecto 2 */}
            <View style={styles.projectCard}>
              <View style={styles.projectHeader}>
                <View style={styles.projectInfo}>
                  <Text style={styles.projectName}>App Móvil E-commerce</Text>
                  <Text style={styles.projectClient}>Cliente: RetailMax</Text>
                </View>
                <View style={styles.projectStatus}>
                  <View style={[styles.statusBadge, styles.statusCompleted]}>
                    <Text style={styles.statusText}>Completado</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.projectDetails}>
                <View style={styles.projectMeta}>
                  <View style={styles.metaItem}>
                    <Icon name="calendar" size={14} color="#8B4513" />
                    <Text style={styles.metaText}>Inicio: 01 Nov 2023</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Icon name="flag" size={14} color="#8B4513" />
                    <Text style={styles.metaText}>Entrega: 15 Dic 2023</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Icon name="people" size={14} color="#8B4513" />
                    <Text style={styles.metaText}>Equipo: 3 personas</Text>
                  </View>
                </View>
                
                <View style={styles.progressContainer}>
                  <View style={styles.progressHeader}>
                    <Text style={styles.progressLabel}>Progreso</Text>
                    <Text style={styles.progressPercentage}>100%</Text>
                  </View>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: '100%' }]} />
                  </View>
                </View>
              </View>
              
              <View style={styles.projectActions}>
                <TouchableOpacity style={styles.actionButton}>
                  <Icon name="eye" size={16} color="#8B4513" />
                  <Text style={styles.actionText}>Ver</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Icon name="list" size={16} color="#8B4513" />
                  <Text style={styles.actionText}>Metas</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Icon name="download" size={16} color="#8B4513" />
                  <Text style={styles.actionText}>Reporte</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Icon name="star" size={16} color="#8B4513" />
                  <Text style={styles.actionText}>Evaluar</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Proyecto 3 */}
            <View style={styles.projectCard}>
              <View style={styles.projectHeader}>
                <View style={styles.projectInfo}>
                  <Text style={styles.projectName}>Rediseño Web Corporativo</Text>
                  <Text style={styles.projectClient}>Cliente: InnovateLab</Text>
                </View>
                <View style={styles.projectStatus}>
                  <View style={[styles.statusBadge, styles.statusDelayed]}>
                    <Text style={styles.statusText}>En Retraso</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.projectDetails}>
                <View style={styles.projectMeta}>
                  <View style={styles.metaItem}>
                    <Icon name="calendar" size={14} color="#8B4513" />
                    <Text style={styles.metaText}>Inicio: 10 Dic 2023</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Icon name="flag" size={14} color="#8B4513" />
                    <Text style={styles.metaText}>Entrega: 20 Ene 2024</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Icon name="people" size={14} color="#8B4513" />
                    <Text style={styles.metaText}>Equipo: 4 personas</Text>
                  </View>
                </View>
                
                <View style={styles.progressContainer}>
                  <View style={styles.progressHeader}>
                    <Text style={styles.progressLabel}>Progreso</Text>
                    <Text style={styles.progressPercentage}>40%</Text>
                  </View>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: '40%' }]} />
                  </View>
                </View>
              </View>
              
              <View style={styles.projectActions}>
                <TouchableOpacity style={styles.actionButton}>
                  <Icon name="eye" size={16} color="#8B4513" />
                  <Text style={styles.actionText}>Ver</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Icon name="list" size={16} color="#8B4513" />
                  <Text style={styles.actionText}>Metas</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Icon name="create" size={16} color="#8B4513" />
                  <Text style={styles.actionText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Icon name="warning" size={16} color="#8B4513" />
                  <Text style={styles.actionText}>Urgente</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Sección de Metas del Proyecto */}
        <View style={styles.goalsSection}>
          <View style={styles.goalsHeader}>
            <Text style={styles.goalsTitle}>Metas del Proyecto</Text>
            <TouchableOpacity style={styles.addGoalButton}>
              <Icon name="add" size={16} color="#FFFFFF" />
              <Text style={styles.addGoalButtonText}>Nueva Meta</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.goalsList}>
            {/* Meta 1 */}
            <View style={styles.goalItem}>
              <TouchableOpacity style={styles.goalCheckbox}>
                <Icon name="checkmark" size={16} color="#FFFFFF" />
              </TouchableOpacity>
              <View style={styles.goalContent}>
                <Text style={styles.goalText}>Implementar sistema de autenticación</Text>
                <Text style={styles.goalDeadline}>Fecha límite: 15 Feb 2024</Text>
              </View>
              <View style={styles.goalPriority}>
                <View style={[styles.priorityBadge, styles.priorityHigh]}>
                  <Text style={styles.priorityText}>Alta</Text>
                </View>
              </View>
            </View>

            {/* Meta 2 */}
            <View style={styles.goalItem}>
              <TouchableOpacity style={[styles.goalCheckbox, styles.goalCheckboxCompleted]}>
                <Icon name="checkmark" size={16} color="#FFFFFF" />
              </TouchableOpacity>
              <View style={styles.goalContent}>
                <Text style={[styles.goalText, styles.goalTextCompleted]}>Diseñar interfaz de usuario</Text>
                <Text style={styles.goalDeadline}>Completado: 10 Ene 2024</Text>
              </View>
              <View style={styles.goalPriority}>
                <View style={[styles.priorityBadge, styles.priorityMedium]}>
                  <Text style={styles.priorityText}>Media</Text>
                </View>
              </View>
            </View>

            {/* Meta 3 */}
            <View style={styles.goalItem}>
              <TouchableOpacity style={styles.goalCheckbox}>
                <Icon name="checkmark" size={16} color="#FFFFFF" />
              </TouchableOpacity>
              <View style={styles.goalContent}>
                <Text style={styles.goalText}>Configurar base de datos</Text>
                <Text style={styles.goalDeadline}>Fecha límite: 20 Feb 2024</Text>
              </View>
              <View style={styles.goalPriority}>
                <View style={[styles.priorityBadge, styles.priorityLow]}>
                  <Text style={styles.priorityText}>Baja</Text>
                </View>
              </View>
            </View>

            {/* Meta 4 */}
            <View style={styles.goalItem}>
              <TouchableOpacity style={styles.goalCheckbox}>
                <Icon name="checkmark" size={16} color="#FFFFFF" />
              </TouchableOpacity>
              <View style={styles.goalContent}>
                <Text style={styles.goalText}>Realizar pruebas de integración</Text>
                <Text style={styles.goalDeadline}>Fecha límite: 25 Feb 2024</Text>
              </View>
              <View style={styles.goalPriority}>
                <View style={[styles.priorityBadge, styles.priorityHigh]}>
                  <Text style={styles.priorityText}>Alta</Text>
                </View>
              </View>
            </View>

            {/* Meta 5 */}
            <View style={styles.goalItem}>
              <TouchableOpacity style={[styles.goalCheckbox, styles.goalCheckboxCompleted]}>
                <Icon name="checkmark" size={16} color="#FFFFFF" />
              </TouchableOpacity>
              <View style={styles.goalContent}>
                <Text style={[styles.goalText, styles.goalTextCompleted]}>Documentar API</Text>
                <Text style={styles.goalDeadline}>Completado: 5 Ene 2024</Text>
              </View>
              <View style={styles.goalPriority}>
                <View style={[styles.priorityBadge, styles.priorityMedium]}>
                  <Text style={styles.priorityText}>Media</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  const renderProjects = () => {
    const completedProjects = projects.filter(project => {
      const completedGoals = project.goals.filter(goal => goal.completed).length;
      return completedGoals === project.goals.length && project.goals.length > 0;
    }).length;
    const totalProjects = projects.length;
    const activeProjects = projects.filter(project => {
      const completedGoals = project.goals.filter(goal => goal.completed).length;
      return completedGoals < project.goals.length && project.goals.length > 0;
    }).length;
    const overdueProjects = projects.filter(project => {
      if (!project.deadline) return false;
      const deadline = new Date(project.deadline);
      const today = new Date();
      const completedGoals = project.goals.filter(goal => goal.completed).length;
      return deadline < today && completedGoals < project.goals.length;
    }).length;

    return (
      <View style={styles.section}>
        {/* Header mejorado */}
        <View style={styles.projectsHeader}>
          <View style={styles.projectsHeaderContent}>
            <View style={styles.projectsIconContainer}>
              <Icon name="folder-outline" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.projectsHeaderText}>
              <Text style={styles.projectsHeaderTitle}>Proyectos</Text>
              <Text style={styles.projectsHeaderSubtitle}>Gestiona y organiza tus proyectos de trabajo</Text>
            </View>
          </View>
          <View style={styles.projectsHeaderBadge}>
            <Icon name="rocket-outline" size={16} color="#D2691E" />
          </View>
        </View>

        {/* Resumen de proyectos mejorado */}
        <View style={styles.projectsSummary}>
          <View style={styles.summaryCard}>
            <View style={styles.summaryIconContainer}>
              <Icon name="checkmark-circle-outline" size={20} color="#3B82F6" />
            </View>
            <View style={styles.summaryContent}>
              <Text style={styles.summaryValue}>{completedProjects}/{totalProjects}</Text>
              <Text style={styles.summaryLabel}>Completados</Text>
            </View>
          </View>
          <View style={styles.summaryCard}>
            <View style={styles.summaryIconContainer}>
              <Icon name="play-circle-outline" size={20} color="#10B981" />
            </View>
            <View style={styles.summaryContent}>
              <Text style={styles.summaryValue}>{activeProjects}</Text>
              <Text style={styles.summaryLabel}>Activos</Text>
            </View>
          </View>
          <View style={styles.summaryCard}>
            <View style={styles.summaryIconContainer}>
              <Icon name="warning-outline" size={20} color="#F59E0B" />
            </View>
            <View style={styles.summaryContent}>
              <Text style={styles.summaryValue}>{overdueProjects}</Text>
              <Text style={styles.summaryLabel}>Vencidos</Text>
            </View>
          </View>
        </View>

        {/* Botón para agregar proyecto */}
        <View style={styles.addProjectsContainer}>
          <TouchableOpacity 
            style={styles.addProjectsButton}
            onPress={() => setShowAddProjectModal(true)}
          >
            <Icon name="add-circle-outline" size={20} color="#FFFFFF" />
            <Text style={styles.addProjectsText}>Nuevo Proyecto</Text>
          </TouchableOpacity>
        </View>

        {/* Lista de proyectos mejorada */}
        <View style={styles.projectsContainer}>
          <View style={styles.projectsHeader}>
            <Text style={styles.projectsTitle}>Mis Proyectos</Text>
            <TouchableOpacity style={styles.filterButton}>
              <Icon name="filter-outline" size={16} color="#D2691E" />
              <Text style={styles.filterText}>Filtrar</Text>
            </TouchableOpacity>
          </View>
          
          {projects.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="folder-outline" size={48} color="#9CA3AF" />
              <Text style={styles.emptyTitle}>No hay proyectos creados</Text>
              <Text style={styles.emptySubtitle}>Crea tu primer proyecto para comenzar a organizar tu trabajo</Text>
              <TouchableOpacity 
                style={styles.emptyButton}
                onPress={() => setShowAddProjectModal(true)}
              >
                <Icon name="add-outline" size={20} color="#D2691E" />
                <Text style={styles.emptyButtonText}>Crear Primer Proyecto</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              {projects.map((project) => {
                const completedGoals = project.goals.filter(goal => goal.completed).length;
                const totalGoals = project.goals.length;
                const progressPercentage = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;
                const isCompleted = completedGoals === totalGoals && totalGoals > 0;
                const isOverdue = project.deadline && new Date(project.deadline) < new Date() && !isCompleted;
                const isActive = completedGoals < totalGoals && totalGoals > 0;
                
                return (
                  <View key={project.id} style={styles.projectItem}>
                    <View style={styles.projectItemHeader}>
                      <View style={styles.projectItemInfo}>
                        <Text style={[
                          styles.projectItemName,
                          isCompleted && styles.projectItemNameCompleted
                        ]}>
                          {project.name}
                        </Text>
                        {project.description && (
                          <Text style={[
                            styles.projectItemDescription,
                            isCompleted && styles.projectItemDescriptionCompleted
                          ]}>
                            {project.description}
                          </Text>
                        )}
                      </View>
                      
                      <View style={styles.projectItemActions}>
                        <TouchableOpacity
                          style={styles.projectActionButton}
                        >
                          <Icon name="eye-outline" size={16} color="#6B7280" />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.projectActionButton}
                        >
                          <Icon name="create-outline" size={16} color="#6B7280" />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => removeProject(project.id)}
                          style={styles.projectActionButton}
                        >
                          <Icon name="trash-outline" size={16} color="#EF4444" />
                        </TouchableOpacity>
                      </View>
                    </View>
                    
                    {/* Metadatos del proyecto */}
                    <View style={styles.projectItemMeta}>
                      {project.deadline && (
                        <View style={styles.projectMetaItem}>
                          <Icon name="calendar-outline" size={14} color="#6B7280" />
                          <Text style={[
                            styles.projectMetaText,
                            isOverdue && styles.projectMetaTextOverdue
                          ]}>
                            Vence: {new Date(project.deadline).toLocaleDateString('es-ES')}
                          </Text>
                        </View>
                      )}
                      <View style={styles.projectMetaItem}>
                        <Icon name="flag-outline" size={14} color="#6B7280" />
                        <Text style={styles.projectMetaText}>
                          {completedGoals}/{totalGoals} metas
                        </Text>
                      </View>
                      <View style={styles.projectMetaItem}>
                        <Icon name="time-outline" size={14} color="#6B7280" />
                        <Text style={styles.projectMetaText}>
                          Creado: {new Date(project.createdAt).toLocaleDateString('es-ES')}
                        </Text>
                      </View>
                    </View>
                    
                    {/* Barra de progreso */}
                    {totalGoals > 0 && (
                      <View style={styles.projectProgressContainer}>
                        <View style={styles.projectProgressHeader}>
                          <Text style={styles.projectProgressLabel}>Progreso</Text>
                          <Text style={styles.projectProgressPercentage}>{Math.round(progressPercentage)}%</Text>
                        </View>
                        <View style={styles.projectProgressBar}>
                          <View style={[
                            styles.projectProgressFill,
                            { width: `${progressPercentage}%` },
                            isCompleted && styles.projectProgressFillCompleted
                          ]} />
                        </View>
                      </View>
                    )}
                    
                    {/* Indicador de estado */}
                    <View style={styles.projectItemStatus}>
                      <View style={[
                        styles.projectStatusIndicator,
                        isCompleted ? styles.projectStatusCompleted : 
                        isOverdue ? styles.projectStatusOverdue :
                        isActive ? styles.projectStatusActive : styles.projectStatusPending
                      ]} />
                      <Text style={[
                        styles.projectStatusText,
                        isCompleted ? styles.projectStatusCompletedText : 
                        isOverdue ? styles.projectStatusOverdueText :
                        isActive ? styles.projectStatusActiveText : styles.projectStatusPendingText
                      ]}>
                        {isCompleted ? 'Completado' : 
                         isOverdue ? 'Vencido' :
                         isActive ? 'En Progreso' : 'Pendiente'}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          )}
        </View>
      </View>
    );
  };

  const renderWorkPlanning = () => {
    const totalTasks = workPlanningData.productivity.totalTasks;
    const completedTasks = workPlanningData.productivity.tasksCompleted;
    const efficiency = workPlanningData.productivity.efficiency;
    const focusTime = workPlanningData.productivity.focusTime;
    const totalHours = workPlanningData.timeTracking.totalHours;
    const averagePerDay = workPlanningData.timeTracking.averagePerDay;

    return (
      <View style={styles.section}>
        {/* Header mejorado */}
        <View style={styles.planningHeader}>
          <View style={styles.planningHeaderContent}>
            <View style={styles.planningIconContainer}>
              <Icon name="analytics-outline" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.planningHeaderText}>
              <Text style={styles.planningHeaderTitle}>Planificación de Trabajo</Text>
              <Text style={styles.planningHeaderSubtitle}>Analiza tu productividad y progreso</Text>
            </View>
          </View>
          <View style={styles.planningHeaderBadge}>
            <Icon name="trending-up-outline" size={16} color="#D2691E" />
          </View>
        </View>

        {/* Resumen de Productividad mejorado */}
        <View style={styles.planningSummary}>
          <View style={styles.summaryCard}>
            <View style={styles.summaryIconContainer}>
              <Icon name="checkmark-circle-outline" size={20} color="#3B82F6" />
            </View>
            <View style={styles.summaryContent}>
              <Text style={styles.summaryValue}>{completedTasks}/{totalTasks}</Text>
              <Text style={styles.summaryLabel}>Tareas Completadas</Text>
            </View>
          </View>
          <View style={styles.summaryCard}>
            <View style={styles.summaryIconContainer}>
              <Icon name="trending-up-outline" size={20} color="#10B981" />
            </View>
            <View style={styles.summaryContent}>
              <Text style={styles.summaryValue}>{efficiency}%</Text>
              <Text style={styles.summaryLabel}>Eficiencia</Text>
            </View>
          </View>
          <View style={styles.summaryCard}>
            <View style={styles.summaryIconContainer}>
              <Icon name="time-outline" size={20} color="#F59E0B" />
            </View>
            <View style={styles.summaryContent}>
              <Text style={styles.summaryValue}>{focusTime}h</Text>
              <Text style={styles.summaryLabel}>Tiempo de Enfoque</Text>
            </View>
          </View>
        </View>

        {/* Gráfica de Progreso Semanal mejorada */}
        <View style={styles.weeklyProgressContainer}>
          <View style={styles.weeklyProgressHeader}>
            <Text style={styles.weeklyProgressTitle}>Progreso Semanal</Text>
            <TouchableOpacity style={styles.filterButton}>
              <Icon name="calendar-outline" size={16} color="#D2691E" />
              <Text style={styles.filterText}>Esta Semana</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.progressChart}>
            {workPlanningData.weeklyProgress.map((day, index) => {
              const completionRate = day.tasks > 0 ? (day.completed / day.tasks) * 100 : 0;
              const isToday = index === new Date().getDay();
              
              return (
                <View key={index} style={styles.progressBarContainer}>
                  <View style={styles.progressBarBackground}>
                    <View 
                      style={[
                        styles.progressBarFill,
                        { width: `${completionRate}%` },
                        isToday && styles.progressBarFillToday
                      ]} 
                    />
                  </View>
                  <View style={styles.progressBarInfo}>
                    <Text style={[
                      styles.progressBarDay,
                      isToday && styles.progressBarDayToday
                    ]}>
                      {day.day}
                    </Text>
                    <Text style={styles.progressBarStats}>
                      {day.completed}/{day.tasks} tareas
                    </Text>
                    <Text style={styles.progressBarHours}>
                      {day.hours}h
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Objetivos Mensuales mejorados */}
        <View style={styles.monthlyGoalsContainer}>
          <View style={styles.monthlyGoalsHeader}>
            <Text style={styles.monthlyGoalsTitle}>Objetivos Mensuales</Text>
            <TouchableOpacity style={styles.filterButton}>
              <Icon name="add-outline" size={16} color="#D2691E" />
              <Text style={styles.filterText}>Agregar</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.goalsList}>
            {workPlanningData.monthlyGoals.map((goal) => {
              const isCompleted = goal.progress === 100;
              const isOverdue = new Date(goal.deadline) < new Date() && !isCompleted;
              
              return (
                <View key={goal.id} style={styles.goalCard}>
                  <View style={styles.goalCardHeader}>
                    <Text style={[
                      styles.goalTitle,
                      isCompleted && styles.goalTitleCompleted
                    ]}>
                      {goal.title}
                    </Text>
                    <Text style={[
                      styles.goalDeadline,
                      isOverdue && styles.goalDeadlineOverdue
                    ]}>
                      {goal.deadline}
                    </Text>
                  </View>
                  
                  <View style={styles.goalProgress}>
                    <View style={styles.goalProgressBar}>
                      <View 
                        style={[
                          styles.goalProgressFill,
                          { width: `${goal.progress}%` },
                          isCompleted && styles.goalProgressFillCompleted,
                          isOverdue && styles.goalProgressFillOverdue
                        ]} 
                      />
                    </View>
                    <Text style={[
                      styles.goalProgressText,
                      isCompleted && styles.goalProgressTextCompleted,
                      isOverdue && styles.goalProgressTextOverdue
                    ]}>
                      {goal.progress}%
                    </Text>
                  </View>
                  
                  <View style={styles.goalStatus}>
                    <View style={[
                      styles.goalStatusIndicator,
                      isCompleted ? styles.goalStatusCompleted : 
                      isOverdue ? styles.goalStatusOverdue : styles.goalStatusPending
                    ]} />
                    <Text style={[
                      styles.goalStatusText,
                      isCompleted ? styles.goalStatusCompletedText : 
                      isOverdue ? styles.goalStatusOverdueText : styles.goalStatusPendingText
                    ]}>
                      {isCompleted ? 'Completado' : 
                       isOverdue ? 'Vencido' : 'En Progreso'}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Seguimiento de Tiempo mejorado */}
        <View style={styles.timeTrackingContainer}>
          <View style={styles.timeTrackingHeader}>
            <Text style={styles.timeTrackingTitle}>Seguimiento de Tiempo</Text>
            <TouchableOpacity style={styles.filterButton}>
              <Icon name="stats-chart-outline" size={16} color="#D2691E" />
              <Text style={styles.filterText}>Ver Estadísticas</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.timeTrackingStats}>
            <View style={styles.timeStat}>
              <View style={styles.timeStatIconContainer}>
                <Icon name="time-outline" size={20} color="#3B82F6" />
              </View>
              <View style={styles.timeStatContent}>
                <Text style={styles.timeStatValue}>{totalHours}h</Text>
                <Text style={styles.timeStatLabel}>Total de Horas</Text>
              </View>
            </View>
            
            <View style={styles.timeStat}>
              <View style={styles.timeStatIconContainer}>
                <Icon name="calendar-outline" size={20} color="#10B981" />
              </View>
              <View style={styles.timeStatContent}>
                <Text style={styles.timeStatValue}>{averagePerDay}h</Text>
                <Text style={styles.timeStatLabel}>Promedio Diario</Text>
              </View>
            </View>
            
            <View style={styles.timeStat}>
              <View style={styles.timeStatIconContainer}>
                <Icon name="trending-up-outline" size={20} color="#F59E0B" />
              </View>
              <View style={styles.timeStatContent}>
                <Text style={styles.timeStatValue}>{workPlanningData.timeTracking.mostProductiveDay}</Text>
                <Text style={styles.timeStatLabel}>Día Más Productivo</Text>
              </View>
            </View>
            
            <View style={styles.timeStat}>
              <View style={styles.timeStatIconContainer}>
                <Icon name="trending-down-outline" size={20} color="#EF4444" />
              </View>
              <View style={styles.timeStatContent}>
                <Text style={styles.timeStatValue}>{workPlanningData.timeTracking.leastProductiveDay}</Text>
                <Text style={styles.timeStatLabel}>Día Menos Productivo</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

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

  const renderGoals = () => {
    const completedGoals = goalsList.filter(goal => goal.completed).length;
    const totalGoals = goalsList.length;
    const activeGoals = goalsList.filter(goal => !goal.completed).length;
    const progressPercentage = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;

    return (
      <View style={styles.section}>
        {/* Header mejorado */}
        <View style={styles.goalsHeader}>
          <View style={styles.goalsHeaderContent}>
            <View style={styles.goalsIconContainer}>
              <Icon name="trophy-outline" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.goalsHeaderText}>
              <Text style={styles.goalsHeaderTitle}>Objetivos</Text>
              <Text style={styles.goalsHeaderSubtitle}>Define y gestiona tus objetivos de trabajo</Text>
            </View>
          </View>
          <View style={styles.goalsHeaderBadge}>
            <Icon name="flag-outline" size={16} color="#D2691E" />
          </View>
        </View>

        {/* Resumen de objetivos mejorado */}
        <View style={styles.goalsSummary}>
          <View style={styles.summaryCard}>
            <View style={styles.summaryIconContainer}>
              <Icon name="checkmark-circle-outline" size={20} color="#3B82F6" />
            </View>
            <View style={styles.summaryContent}>
              <Text style={styles.summaryValue}>{completedGoals}/{totalGoals}</Text>
              <Text style={styles.summaryLabel}>Completados</Text>
            </View>
          </View>
          <View style={styles.summaryCard}>
            <View style={styles.summaryIconContainer}>
              <Icon name="play-circle-outline" size={20} color="#10B981" />
            </View>
            <View style={styles.summaryContent}>
              <Text style={styles.summaryValue}>{activeGoals}</Text>
              <Text style={styles.summaryLabel}>Activos</Text>
            </View>
          </View>
          <View style={styles.summaryCard}>
            <View style={styles.summaryIconContainer}>
              <Icon name="trending-up-outline" size={20} color="#F59E0B" />
            </View>
            <View style={styles.summaryContent}>
              <Text style={styles.summaryValue}>{Math.round(progressPercentage)}%</Text>
              <Text style={styles.summaryLabel}>Progreso</Text>
            </View>
          </View>
        </View>

        {/* Botón para agregar objetivo */}
        <View style={styles.addGoalsContainer}>
          <TouchableOpacity 
            style={styles.addGoalsButton}
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
          >
            <Icon name="add-circle-outline" size={20} color="#FFFFFF" />
            <Text style={styles.addGoalsText}>Nuevo Objetivo</Text>
          </TouchableOpacity>
        </View>

        {/* Lista de objetivos mejorada */}
        <View style={styles.goalsContainer}>
          <View style={styles.goalsHeader}>
            <Text style={styles.goalsTitle}>Mis Objetivos</Text>
            <TouchableOpacity style={styles.filterButton}>
              <Icon name="filter-outline" size={16} color="#D2691E" />
              <Text style={styles.filterText}>Filtrar</Text>
            </TouchableOpacity>
          </View>
          
          {goalsList.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="trophy-outline" size={48} color="#9CA3AF" />
              <Text style={styles.emptyTitle}>No hay objetivos definidos</Text>
              <Text style={styles.emptySubtitle}>Define tus objetivos para comenzar a trabajar hacia tus metas</Text>
              <TouchableOpacity 
                style={styles.emptyButton}
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
              >
                <Icon name="add-outline" size={20} color="#D2691E" />
                <Text style={styles.emptyButtonText}>Crear Primer Objetivo</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              {goalsList.map((goal, index) => {
                const goalColor = goalsColors[index % goalsColors.length];
                
                return (
                  <View key={goal.id} style={styles.goalItem}>
                    <View style={styles.goalItemHeader}>
                      <View style={styles.goalItemInfo}>
                        <View style={styles.goalNumberContainer}>
                          <Text style={[
                            styles.goalNumber,
                            { backgroundColor: goalColor }
                          ]}>
                            {index + 1}
                          </Text>
                        </View>
                        <View style={styles.goalTextContainer}>
                          <TextInput
                            style={[
                              styles.goalTextInput,
                              goal.completed && styles.goalTextInputCompleted
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
                            editable={!goal.completed}
                          />
                        </View>
                      </View>
                      
                      <View style={styles.goalItemActions}>
                        <TouchableOpacity
                          onPress={() => {
                            const newList = goalsList.map(g => 
                              g.id === goal.id ? { ...g, completed: !g.completed } : g
                            );
                            setGoalsList(newList);
                          }}
                          style={styles.goalActionButton}
                        >
                          <Icon 
                            name={goal.completed ? "checkmark-circle" : "ellipse-outline"} 
                            size={20} 
                            color={goal.completed ? "#10B981" : "#6B7280"} 
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => {
                            setGoalsList(goalsList.filter(g => g.id !== goal.id));
                          }}
                          style={styles.goalActionButton}
                        >
                          <Icon name="trash-outline" size={16} color="#EF4444" />
                        </TouchableOpacity>
                      </View>
                    </View>
                    
                    {/* Barra de progreso del objetivo */}
                    <View style={styles.goalProgressContainer}>
                      <View style={styles.goalProgressBar}>
                        <View 
                          style={[
                            styles.goalProgressFill,
                            { 
                              width: goal.completed ? '100%' : '0%',
                              backgroundColor: goalColor
                            }
                          ]} 
                        />
                      </View>
                      <Text style={[
                        styles.goalProgressText,
                        { color: goalColor }
                      ]}>
                        {goal.completed ? 'Completado' : 'En Progreso'}
                      </Text>
                    </View>
                    
                    {/* Indicador de estado */}
                    <View style={styles.goalItemStatus}>
                      <View style={[
                        styles.goalStatusIndicator,
                        goal.completed ? styles.goalStatusCompleted : styles.goalStatusPending
                      ]} />
                      <Text style={[
                        styles.goalStatusText,
                        goal.completed ? styles.goalStatusCompletedText : styles.goalStatusPendingText
                      ]}>
                        {goal.completed ? 'Completado' : 'En Progreso'}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          )}
        </View>
      </View>
    );
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'weekly':
        return renderWeeklyTasks();
      case 'daily':
        return renderDailyTasks();
      case 'projects':
        return renderProjects();
      case 'work-planning':
        return renderWorkPlanning();
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
    backgroundColor: '#FDF6E3', // Crema desierto
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderRadius: 20,
    marginHorizontal: 4,
    shadowColor: '#B8860B', // Dorado desierto
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 2,
    borderColor: '#D4A574', // Dorado claro
  },
  tabsWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FDF6E3', // Crema desierto
    padding: 8,
    width: '100%',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 16,
    marginHorizontal: 4,
  },
  activeTab: {
    shadowColor: '#D4A574', // Dorado claro
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
  },
  tabContent: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    position: 'relative',
    shadowColor: '#B8860B', // Dorado desierto
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -8,
    left: '50%',
    marginLeft: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#8B4513', // Marrón desierto
    shadowColor: '#8B4513',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flex: 1,
    paddingHorizontal: 0, // No horizontal padding to span full width
    paddingTop: 16,
    paddingBottom: 40, // Increased bottom padding to prevent button cutoff
  },
  section: {
    backgroundColor: '#FDF6E3', // Crema desierto
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    marginHorizontal: 4, // Reduced margin to make wider
    shadowColor: '#B8860B', // Dorado desierto
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#D4A574', // Dorado claro
  },
  sectionHeader: {
    alignItems: 'center',
    backgroundColor: '#8B4513', // Marrón desierto
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginBottom: 0,
    marginHorizontal: 0,
    shadowColor: '#8B4513',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
    borderBottomWidth: 3,
    borderBottomColor: '#D4A574', // Dorado claro
  },
  headerDecoration: {
    alignItems: 'center',
    marginBottom: 16,
  },
  headerContent: {
    alignItems: 'center',
  },
  mascotImage: {
    width: 60,
    height: 60,
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
    padding: 20,
    backgroundColor: '#F8F5F0', // Crema más clara
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  addProjectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D4A574', // Dorado desierto
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 16,
    marginBottom: 20,
    shadowColor: '#B8860B', // Dorado desierto
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 2,
    borderColor: '#8B4513', // Marrón desierto
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
    backgroundColor: '#D4A574', // Dorado desierto
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#8B4513', // Marrón desierto
    shadowColor: '#B8860B',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  tasksList: {
    gap: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: '#FDF6E3', // Crema desierto
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#D4A574', // Dorado claro
    borderStyle: 'dashed',
    marginVertical: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#8B4513', // Marrón desierto
    marginTop: 12,
    marginBottom: 4,
    fontWeight: '600',
    fontStyle: 'italic',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#B8860B', // Dorado desierto
    textAlign: 'center',
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F8F5F0', // Crema más clara
    borderRadius: 12,
    padding: 12,
    borderWidth: 2,
    borderColor: '#D4A574', // Dorado claro
    shadowColor: '#B8860B',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 8,
  },
  taskNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#8B4513', // Marrón desierto
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#D4A574', // Dorado claro
    shadowColor: '#B8860B',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
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
    color: '#8B4513', // Marrón desierto
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 2,
    borderColor: '#D4A574', // Dorado claro
    borderRadius: 8,
    backgroundColor: '#FDF6E3', // Crema desierto
    shadowColor: '#B8860B',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#F8F5F0', // Crema más clara
    borderWidth: 2,
    borderColor: '#D4A574', // Dorado claro
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#B8860B',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
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
  // Nuevos estilos para la UI de proyectos
  projectDashboard: {
    backgroundColor: '#F8F5F0',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#D4A574',
    shadowColor: '#B8860B',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  dashboardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  dashboardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B4513',
  },
  newProjectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D4A574',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
    shadowColor: '#B8860B',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  newProjectButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D4A574',
    shadowColor: '#B8860B',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statIcon: {
    marginBottom: 8,
  },
  statContent: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#8B4513',
    textAlign: 'center',
    fontWeight: '500',
  },
  projectsSection: {
    backgroundColor: '#F8F5F0',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#D4A574',
    shadowColor: '#B8860B',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitleBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B4513',
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D4A574',
  },
  activeFilter: {
    backgroundColor: '#D4A574',
  },
  filterButtonText: {
    fontSize: 12,
    color: '#8B4513',
    fontWeight: '500',
  },
  projectsList: {
    gap: 16,
  },
  projectCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#D4A574',
    shadowColor: '#B8860B',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  projectInfo: {
    flex: 1,
  },
  projectName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 4,
  },
  projectClient: {
    fontSize: 12,
    color: '#8B4513',
    opacity: 0.7,
  },
  projectStatus: {
    marginLeft: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusActive: {
    backgroundColor: '#E3F2FD',
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  statusCompleted: {
    backgroundColor: '#E8F5E8',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  statusDelayed: {
    backgroundColor: '#FFEBEE',
    borderWidth: 1,
    borderColor: '#F44336',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#8B4513',
  },
  projectDetails: {
    marginBottom: 16,
  },
  projectMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  metaText: {
    fontSize: 11,
    color: '#8B4513',
    fontWeight: '500',
  },
  progressContainer: {
    marginTop: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 12,
    color: '#8B4513',
    fontWeight: '500',
  },
  progressPercentage: {
    fontSize: 12,
    color: '#8B4513',
    fontWeight: 'bold',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#D4A574',
    borderRadius: 3,
  },
  projectActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F8F5F0',
    borderWidth: 1,
    borderColor: '#D4A574',
    gap: 4,
  },
  actionText: {
    fontSize: 11,
    color: '#8B4513',
    fontWeight: '500',
  },
  // Estilos para la sección de metas
  goalsSection: {
    backgroundColor: '#F8F5F0',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    borderWidth: 2,
    borderColor: '#D4A574',
    shadowColor: '#B8860B',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  goalsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  goalsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B4513',
  },
  addGoalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D4A574',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 6,
    shadowColor: '#B8860B',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  addGoalButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  goalsList: {
    gap: 12,
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#D4A574',
    shadowColor: '#B8860B',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  goalCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#8B4513',
  },
  goalCheckboxCompleted: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  goalContent: {
    flex: 1,
  },
  goalText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B4513',
    marginBottom: 4,
  },
  goalTextCompleted: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  goalDeadline: {
    fontSize: 12,
    color: '#8B4513',
    opacity: 0.7,
  },
  goalPriority: {
    marginLeft: 12,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityHigh: {
    backgroundColor: '#FFEBEE',
    borderWidth: 1,
    borderColor: '#F44336',
  },
  priorityMedium: {
    backgroundColor: '#FFF3E0',
    borderWidth: 1,
    borderColor: '#FF9800',
  },
  priorityLow: {
    backgroundColor: '#E8F5E8',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#8B4513',
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
  // Estilos para Planificación de Trabajo
  planningSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D4A574',
    shadowColor: '#B8860B',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryIcon: {
    marginBottom: 8,
  },
  summaryContent: {
    alignItems: 'center',
  },
  summaryTitle: {
    fontSize: 12,
    color: '#8B4513',
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#8B4513',
  },
  weeklyProgressContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#D4A574',
    shadowColor: '#B8860B',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#8B4513',
    marginBottom: 16,
  },
  progressChart: {
    gap: 12,
  },
  progressBarContainer: {
    gap: 8,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  progressBarInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressBarDay: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B4513',
  },
  progressBarStats: {
    fontSize: 12,
    color: '#6B7280',
  },
  monthlyGoalsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#D4A574',
    shadowColor: '#B8860B',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  goalsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#8B4513',
    marginBottom: 16,
  },
  goalsList: {
    gap: 12,
  },
  goalCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B4513',
    flex: 1,
  },
  goalDeadline: {
    fontSize: 12,
    color: '#6B7280',
  },
  goalProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  goalProgressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  goalProgressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 3,
  },
  goalProgressText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8B4513',
    minWidth: 35,
    textAlign: 'right',
  },
  timeTrackingContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#D4A574',
    shadowColor: '#B8860B',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  timeTrackingTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#8B4513',
    marginBottom: 16,
  },
  timeTrackingStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  timeStat: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  timeStatLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
  timeStatValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#8B4513',
    marginTop: 2,
  },
  
  // Estilos mejorados para Tareas Semanales
  weeklyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#D2691E',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#D2691E',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  weeklyHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  weeklyIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  weeklyHeaderText: {
    flex: 1,
  },
  weeklyHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  weeklyHeaderSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  weeklyHeaderBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Resumen de tareas mejorado
  weeklySummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryContent: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  
  // Botón para agregar tarea
  addWeeklyContainer: {
    marginBottom: 20,
  },
  addWeeklyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D2691E',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    shadowColor: '#D2691E',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  addWeeklyText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  
  // Contenedor de tareas
  weeklyContainer: {
    flex: 1,
  },
  weeklyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  weeklyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterText: {
    color: '#D2691E',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  
  // Estado vacío
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
  },
  emptyButtonText: {
    color: '#D2691E',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  
  // Tarjetas de tareas mejoradas
  weeklyItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  weeklyItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  weeklyCheckboxContainer: {
    marginRight: 12,
  },
  weeklyCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  weeklyCheckboxChecked: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  weeklyItemInfo: {
    flex: 1,
  },
  weeklyItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  weeklyItemNameCompleted: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  weeklyItemDate: {
    fontSize: 14,
    color: '#6B7280',
  },
  weeklyItemDateCompleted: {
    color: '#9CA3AF',
  },
  weeklyItemActions: {
    flexDirection: 'row',
    gap: 8,
  },
  weeklyActionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Notas de la tarea
  weeklyItemNotes: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  weeklyNotesText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  
  // Estado de la tarea
  weeklyItemStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weeklyStatusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  weeklyStatusCompleted: {
    backgroundColor: '#10B981',
  },
  weeklyStatusUrgent: {
    backgroundColor: '#EF4444',
  },
  weeklyStatusOverdue: {
    backgroundColor: '#F59E0B',
  },
  weeklyStatusPending: {
    backgroundColor: '#6B7280',
  },
  weeklyStatusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  weeklyStatusCompletedText: {
    color: '#10B981',
  },
  weeklyStatusUrgentText: {
    color: '#EF4444',
  },
  weeklyStatusOverdueText: {
    color: '#F59E0B',
  },
  weeklyStatusPendingText: {
    color: '#6B7280',
  },
  
  // Estilos mejorados para Tareas Diarias
  dailyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#D2691E',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#D2691E',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  dailyHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dailyIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  dailyHeaderText: {
    flex: 1,
  },
  dailyHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  dailyHeaderSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  dailyHeaderBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Resumen de tareas diarias mejorado
  dailySummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 12,
  },
  
  // Botón para agregar tarea diaria
  addDailyContainer: {
    marginBottom: 20,
  },
  addDailyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D2691E',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    shadowColor: '#D2691E',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  addDailyText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  
  // Contenedor de tareas diarias
  dailyContainer: {
    flex: 1,
  },
  dailyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  
  // Tarjetas de tareas diarias mejoradas
  dailyItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  dailyItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dailyCheckboxContainer: {
    marginRight: 12,
  },
  dailyCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dailyCheckboxChecked: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  dailyItemInfo: {
    flex: 1,
  },
  dailyItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  dailyItemNameCompleted: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  dailyItemDateTime: {
    flexDirection: 'row',
    gap: 16,
  },
  dailyItemDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dailyItemDate: {
    fontSize: 14,
    color: '#6B7280',
  },
  dailyItemDateCompleted: {
    color: '#9CA3AF',
  },
  dailyItemTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dailyItemTime: {
    fontSize: 14,
    color: '#6B7280',
  },
  dailyItemTimeCompleted: {
    color: '#9CA3AF',
  },
  dailyItemActions: {
    flexDirection: 'row',
    gap: 8,
  },
  dailyActionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Notas de la tarea diaria
  dailyItemNotes: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  dailyNotesText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  
  // Estado de la tarea diaria
  dailyItemStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dailyStatusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  dailyStatusCompleted: {
    backgroundColor: '#10B981',
  },
  dailyStatusOverdue: {
    backgroundColor: '#EF4444',
  },
  dailyStatusToday: {
    backgroundColor: '#3B82F6',
  },
  dailyStatusPending: {
    backgroundColor: '#6B7280',
  },
  dailyStatusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  dailyStatusCompletedText: {
    color: '#10B981',
  },
  dailyStatusOverdueText: {
    color: '#EF4444',
  },
  dailyStatusTodayText: {
    color: '#3B82F6',
  },
  dailyStatusPendingText: {
    color: '#6B7280',
  },
  
  // Estilos mejorados para Proyectos
  projectsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#D2691E',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#D2691E',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  projectsHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  projectsIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  projectsHeaderText: {
    flex: 1,
  },
  projectsHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  projectsHeaderSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  projectsHeaderBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Resumen de proyectos mejorado
  projectsSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 12,
  },
  
  // Botón para agregar proyecto
  addProjectsContainer: {
    marginBottom: 20,
  },
  addProjectsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D2691E',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    shadowColor: '#D2691E',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  addProjectsText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  
  // Contenedor de proyectos
  projectsContainer: {
    flex: 1,
  },
  projectsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  
  // Tarjetas de proyectos mejoradas
  projectItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  projectItemHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  projectItemInfo: {
    flex: 1,
    marginRight: 12,
  },
  projectItemName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  projectItemNameCompleted: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  projectItemDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  projectItemDescriptionCompleted: {
    color: '#9CA3AF',
  },
  projectItemActions: {
    flexDirection: 'row',
    gap: 8,
  },
  projectActionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Metadatos del proyecto
  projectItemMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 12,
  },
  projectMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  projectMetaText: {
    fontSize: 12,
    color: '#6B7280',
  },
  projectMetaTextOverdue: {
    color: '#EF4444',
    fontWeight: '600',
  },
  
  // Barra de progreso del proyecto
  projectProgressContainer: {
    marginBottom: 12,
  },
  projectProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  projectProgressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  projectProgressPercentage: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  projectProgressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  projectProgressFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 4,
  },
  projectProgressFillCompleted: {
    backgroundColor: '#10B981',
  },
  
  // Estado del proyecto
  projectItemStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  projectStatusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  projectStatusCompleted: {
    backgroundColor: '#10B981',
  },
  projectStatusOverdue: {
    backgroundColor: '#EF4444',
  },
  projectStatusActive: {
    backgroundColor: '#3B82F6',
  },
  projectStatusPending: {
    backgroundColor: '#6B7280',
  },
  projectStatusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  projectStatusCompletedText: {
    color: '#10B981',
  },
  projectStatusOverdueText: {
    color: '#EF4444',
  },
  projectStatusActiveText: {
    color: '#3B82F6',
  },
  projectStatusPendingText: {
    color: '#6B7280',
  },
  
  // Estilos mejorados para Planificación de Trabajo
  planningHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#D2691E',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#D2691E',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  planningHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  planningIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  planningHeaderText: {
    flex: 1,
  },
  planningHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  planningHeaderSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  planningHeaderBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Resumen de planificación mejorado
  planningSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 12,
  },
  
  // Gráfica de progreso semanal mejorada
  weeklyProgressContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  weeklyProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  weeklyProgressTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  progressChart: {
    gap: 12,
  },
  progressBarContainer: {
    marginBottom: 8,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 4,
  },
  progressBarFillToday: {
    backgroundColor: '#D2691E',
  },
  progressBarInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressBarDay: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  progressBarDayToday: {
    color: '#D2691E',
  },
  progressBarStats: {
    fontSize: 12,
    color: '#6B7280',
  },
  progressBarHours: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
  },
  
  // Objetivos mensuales mejorados
  monthlyGoalsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  monthlyGoalsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  monthlyGoalsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  goalsList: {
    gap: 12,
  },
  goalCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  goalCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
    marginRight: 8,
  },
  goalTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  goalDeadline: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  goalDeadlineOverdue: {
    color: '#EF4444',
    fontWeight: '600',
  },
  goalProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalProgressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
    marginRight: 12,
  },
  goalProgressFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 3,
  },
  goalProgressFillCompleted: {
    backgroundColor: '#10B981',
  },
  goalProgressFillOverdue: {
    backgroundColor: '#EF4444',
  },
  goalProgressText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1F2937',
    minWidth: 35,
    textAlign: 'right',
  },
  goalProgressTextCompleted: {
    color: '#10B981',
  },
  goalProgressTextOverdue: {
    color: '#EF4444',
  },
  goalStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalStatusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  goalStatusCompleted: {
    backgroundColor: '#10B981',
  },
  goalStatusOverdue: {
    backgroundColor: '#EF4444',
  },
  goalStatusPending: {
    backgroundColor: '#3B82F6',
  },
  goalStatusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  goalStatusCompletedText: {
    color: '#10B981',
  },
  goalStatusOverdueText: {
    color: '#EF4444',
  },
  goalStatusPendingText: {
    color: '#3B82F6',
  },
  
  // Seguimiento de tiempo mejorado
  timeTrackingContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  timeTrackingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  timeTrackingTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  timeTrackingStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  timeStat: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  timeStatIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeStatContent: {
    alignItems: 'center',
  },
  timeStatValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 2,
  },
  timeStatLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    textAlign: 'center',
  },
  
  // Estilos mejorados para Objetivos
  goalsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#D2691E',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#D2691E',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  goalsHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  goalsIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  goalsHeaderText: {
    flex: 1,
  },
  goalsHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  goalsHeaderSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  goalsHeaderBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Resumen de objetivos mejorado
  goalsSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 12,
  },
  
  // Botón para agregar objetivo
  addGoalsContainer: {
    marginBottom: 20,
  },
  addGoalsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D2691E',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    shadowColor: '#D2691E',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  addGoalsText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  
  // Contenedor de objetivos
  goalsContainer: {
    flex: 1,
  },
  goalsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  
  // Tarjetas de objetivos mejoradas
  goalItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  goalItemHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  goalItemInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginRight: 12,
  },
  goalNumberContainer: {
    marginRight: 12,
  },
  goalNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 32,
  },
  goalTextContainer: {
    flex: 1,
  },
  goalTextInput: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    minHeight: 40,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  goalTextInputCompleted: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
    backgroundColor: '#F3F4F6',
  },
  goalItemActions: {
    flexDirection: 'row',
    gap: 8,
  },
  goalActionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Barra de progreso del objetivo
  goalProgressContainer: {
    marginBottom: 12,
  },
  goalProgressBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  goalProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  goalProgressText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'right',
  },
  
  // Estado del objetivo
  goalItemStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalStatusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  goalStatusCompleted: {
    backgroundColor: '#10B981',
  },
  goalStatusPending: {
    backgroundColor: '#3B82F6',
  },
  goalStatusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  goalStatusCompletedText: {
    color: '#10B981',
  },
  goalStatusPendingText: {
    color: '#3B82F6',
  },
});

export default WorkSections;
