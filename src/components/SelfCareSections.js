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

const SelfCareSections = () => {
  const [activeSection, setActiveSection] = useState('self-care-checklist');
  
  // Estados para Self Care Checklist
  const [checklistItems, setChecklistItems] = useState({
    morning: [
      { id: 1, text: 'Beber un vaso de agua al despertar', completed: false },
      { id: 2, text: 'Practicar estiramientos matutinos o yoga', completed: false },
      { id: 3, text: 'Disfrutar un desayuno nutritivo', completed: false },
      { id: 4, text: 'Tomar una ducha refrescante', completed: false },
      { id: 5, text: 'Establecer intenciones positivas para el día', completed: false },
      { id: 6, text: 'Escuchar música inspiradora', completed: false },
      { id: 7, text: 'Revisar horario y tareas', completed: false },
      { id: 8, text: 'Dedicar tiempo al cuidado de la piel', completed: false },
      { id: 9, text: 'Practicar ejercicio de atención plena', completed: false },
      { id: 10, text: 'Pasar tiempo de calidad con una mascota', completed: false }
    ],
    afternoon: [
      { id: 1, text: 'Tomar un descanso corto y salir a caminar', completed: false },
      { id: 2, text: 'Practicar atención plena o respiración profunda', completed: false },
      { id: 3, text: 'Tener un almuerzo saludable y balanceado', completed: false },
      { id: 4, text: 'Escuchar tu música favorita', completed: false },
      { id: 5, text: 'Hacer algunos estiramientos o ejercicios ligeros', completed: false },
      { id: 6, text: 'Conectar con un amigo', completed: false },
      { id: 7, text: 'Tomar una siesta energética si te sientes cansado', completed: false },
      { id: 8, text: 'Leer algunas páginas de un libro', completed: false },
      { id: 9, text: 'Escuchar un audiolibro', completed: false },
      { id: 10, text: 'Participar en un pasatiempo creativo', completed: false }
    ],
    evening: [
      { id: 1, text: 'Preparar y disfrutar una cena nutritiva', completed: false },
      { id: 2, text: 'Relajarse con un baño o ducha tibia', completed: false },
      { id: 3, text: 'Meditar o practicar respiración profunda', completed: false },
      { id: 4, text: 'Escribir en un diario de gratitud', completed: false },
      { id: 5, text: 'Reflexionar sobre aspectos positivos del día', completed: false },
      { id: 6, text: 'Estirar o hacer yoga suave', completed: false },
      { id: 7, text: 'Desconectarse de las pantallas', completed: false },
      { id: 8, text: 'Leer un libro antes de dormir', completed: false },
      { id: 9, text: 'Participar en una rutina de cuidado de la piel', completed: false },
      { id: 10, text: 'Relajarse con una taza reconfortante', completed: false }
    ],
    anytime: [
      { id: 1, text: 'Practicar ejercicios de respiración profunda', completed: false },
      { id: 2, text: 'Tomar una caminata consciente', completed: false },
      { id: 3, text: 'Escuchar música relajante o sonidos de la naturaleza', completed: false },
      { id: 4, text: 'Participar en una actividad creativa', completed: false },
      { id: 5, text: 'Escribir sobre tus pensamientos', completed: false },
      { id: 6, text: 'Practicar yoga o estiramientos', completed: false },
      { id: 7, text: 'Disfrutar un snack saludable', completed: false },
      { id: 8, text: 'Conectar con un amigo o ser querido', completed: false },
      { id: 9, text: 'Establecer límites y decir no a las cosas', completed: false },
      { id: 10, text: 'Pasar tiempo en la naturaleza', completed: false }
    ]
  });

  // Estados para Personal Wellness Scheduler
  const [wellnessSchedules, setWellnessSchedules] = useState([]);
  const [showAddWellnessModal, setShowAddWellnessModal] = useState(false);
  const [newWellnessSchedule, setNewWellnessSchedule] = useState({
    activities: ['', '', '', '', '', ''],
    weekDays: [false, false, false, false, false, false, false]
  });

  // Estados para Self Care Journal
  const [journalEntries, setJournalEntries] = useState([]);
  const [showAddJournalModal, setShowAddJournalModal] = useState(false);
  const [newJournalEntry, setNewJournalEntry] = useState({
    date: '',
    gratefulFor: [],
    achievements: [],
    hydration: 0,
    notes: '',
    reminder: '',
    mood: '',
    tomorrowPlan: []
  });

  // Estados para Self Care Planner
  const [selfCarePlans, setSelfCarePlans] = useState([]);
  const [showAddSelfCareModal, setShowAddSelfCareModal] = useState(false);
  const [newSelfCarePlan, setNewSelfCarePlan] = useState({
    date: '',
    todo: [],
    workout: '',
    sleepHours: 0,
    waterIntake: 0,
    mood: '',
    favoriteThing: '',
    dontLike: '',
    favoritePart: '',
    goalsTomorrow: [],
    notes: []
  });

  // Estados para Monthly Habit Log
  const [monthlyHabits, setMonthlyHabits] = useState({
    week1: [
      { id: 1, text: '', completed: [false, false, false, false, false, false, false] },
      { id: 2, text: '', completed: [false, false, false, false, false, false, false] },
      { id: 3, text: '', completed: [false, false, false, false, false, false, false] },
      { id: 4, text: '', completed: [false, false, false, false, false, false, false] }
    ],
    week2: [
      { id: 1, text: '', completed: [false, false, false, false, false, false, false] },
      { id: 2, text: '', completed: [false, false, false, false, false, false, false] },
      { id: 3, text: '', completed: [false, false, false, false, false, false, false] },
      { id: 4, text: '', completed: [false, false, false, false, false, false, false] }
    ],
    week3: [
      { id: 1, text: '', completed: [false, false, false, false, false, false, false] },
      { id: 2, text: '', completed: [false, false, false, false, false, false, false] },
      { id: 3, text: '', completed: [false, false, false, false, false, false, false] },
      { id: 4, text: '', completed: [false, false, false, false, false, false, false] }
    ],
    week4: [
      { id: 1, text: '', completed: [false, false, false, false, false, false, false] },
      { id: 2, text: '', completed: [false, false, false, false, false, false, false] },
      { id: 3, text: '', completed: [false, false, false, false, false, false, false] },
      { id: 4, text: '', completed: [false, false, false, false, false, false, false] }
    ]
  });

  // Estados para Habit & Goal Tracker
  const [habitGoals, setHabitGoals] = useState({
    goals: '',
    reminder: '',
    achievements: '',
    notes: '',
    monthlyTracking: Array(31).fill(false)
  });

  // Estados para Mood Tracker
  const [moodTracker, setMoodTracker] = useState({
    monthlyMoods: Array(12).fill(Array(31).fill('')),
    notes: '',
    yearMantra: ''
  });

  // Estados para Daily Habit Tracker
  const [dailyHabits, setDailyHabits] = useState({
    morning: [
      { id: 1, text: '', completed: [false, false, false, false, false, false, false] },
      { id: 2, text: '', completed: [false, false, false, false, false, false, false] },
      { id: 3, text: '', completed: [false, false, false, false, false, false, false] }
    ],
    afternoon: [
      { id: 1, text: '', completed: [false, false, false, false, false, false, false] },
      { id: 2, text: '', completed: [false, false, false, false, false, false, false] },
      { id: 3, text: '', completed: [false, false, false, false, false, false, false] }
    ],
    evening: [
      { id: 1, text: '', completed: [false, false, false, false, false, false, false] },
      { id: 2, text: '', completed: [false, false, false, false, false, false, false] },
      { id: 3, text: '', completed: [false, false, false, false, false, false, false] }
    ]
  });


  // Estados para Habit Monitor
  const [habitMonitor, setHabitMonitor] = useState({
    habits: Array(10).fill(''),
    monthlyTracking: Array(10).fill(Array(31).fill(false))
  });

  const sections = [
    { id: 'self-care-checklist', name: 'Lista de Cuidado Personal', icon: 'checkmark-circle-outline' },
    { id: 'wellness-scheduler', name: 'Programador de Bienestar', icon: 'calendar-outline' },
    { id: 'self-care-journal', name: 'Diario de Cuidado Personal', icon: 'book-outline' },
    { id: 'self-care-planner', name: 'Planificador de Cuidado Personal', icon: 'clipboard-outline' },
    { id: 'monthly-habit-log', name: 'Registro Mensual de Hábitos', icon: 'calendar-outline' },
    { id: 'habit-goal-tracker', name: 'Seguimiento de Hábitos y Objetivos', icon: 'trophy-outline' },
    { id: 'mood-tracker', name: 'Seguimiento del Estado de Ánimo', icon: 'happy-outline' },
    { id: 'daily-habit-tracker', name: 'Seguimiento Diario de Hábitos', icon: 'checkmark-circle-outline' },
    { id: 'habit-monitor', name: 'Monitor de Hábitos', icon: 'analytics-outline' }
  ];

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
              size={18} 
              color={activeSection === section.id ? '#FFFFFF' : '#6c757d'} 
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const toggleChecklistItem = (timeOfDay, itemId) => {
    setChecklistItems(prev => ({
      ...prev,
      [timeOfDay]: prev[timeOfDay].map(item =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      )
    }));
  };

  const openAddWellnessModal = () => {
    setNewWellnessSchedule({
      activities: ['', '', '', '', '', ''],
      weekDays: [false, false, false, false, false, false, false]
    });
    setShowAddWellnessModal(true);
  };

  const closeAddWellnessModal = () => {
    setShowAddWellnessModal(false);
  };

  const saveWellnessSchedule = () => {
    const schedule = {
      id: Date.now().toString(),
      ...newWellnessSchedule,
      createdAt: new Date().toISOString()
    };

    setWellnessSchedules([...wellnessSchedules, schedule]);
    setShowAddWellnessModal(false);
  };

  const openAddJournalModal = () => {
    setNewJournalEntry({
      date: new Date().toISOString().split('T')[0],
      gratefulFor: [],
      achievements: [],
      hydration: 0,
      notes: '',
      reminder: '',
      mood: '',
      tomorrowPlan: []
    });
    setShowAddJournalModal(true);
  };

  const closeAddJournalModal = () => {
    setShowAddJournalModal(false);
  };

  const saveJournalEntry = () => {
    const entry = {
      id: Date.now().toString(),
      ...newJournalEntry,
      createdAt: new Date().toISOString()
    };

    setJournalEntries([...journalEntries, entry]);
    setShowAddJournalModal(false);
  };

  const openAddSelfCareModal = () => {
    setNewSelfCarePlan({
      date: new Date().toISOString().split('T')[0],
      todo: [],
      workout: '',
      sleepHours: 0,
      waterIntake: 0,
      mood: '',
      favoriteThing: '',
      dontLike: '',
      favoritePart: '',
      goalsTomorrow: [],
      notes: []
    });
    setShowAddSelfCareModal(true);
  };

  const closeAddSelfCareModal = () => {
    setShowAddSelfCareModal(false);
  };

  const saveSelfCarePlan = () => {
    const plan = {
      id: Date.now().toString(),
      ...newSelfCarePlan,
      createdAt: new Date().toISOString()
    };

    setSelfCarePlans([...selfCarePlans, plan]);
    setShowAddSelfCareModal(false);
  };

  // Funciones para Monthly Habit Log
  const toggleHabitCompletion = (week, habitId, dayIndex) => {
    setMonthlyHabits(prev => ({
      ...prev,
      [week]: prev[week].map(habit =>
        habit.id === habitId
          ? {
              ...habit,
              completed: habit.completed.map((completed, index) =>
                index === dayIndex ? !completed : completed
              )
            }
          : habit
      )
    }));
  };

  const updateHabitText = (week, habitId, text) => {
    setMonthlyHabits(prev => ({
      ...prev,
      [week]: prev[week].map(habit =>
        habit.id === habitId ? { ...habit, text } : habit
      )
    }));
  };

  // Funciones para Daily Habit Tracker
  const toggleDailyHabitCompletion = (timeOfDay, habitId, dayIndex) => {
    setDailyHabits(prev => ({
      ...prev,
      [timeOfDay]: prev[timeOfDay].map(habit =>
        habit.id === habitId
          ? {
              ...habit,
              completed: habit.completed.map((completed, index) =>
                index === dayIndex ? !completed : completed
              )
            }
          : habit
      )
    }));
  };

  const updateDailyHabitText = (timeOfDay, habitId, text) => {
    setDailyHabits(prev => ({
      ...prev,
      [timeOfDay]: prev[timeOfDay].map(habit =>
        habit.id === habitId ? { ...habit, text } : habit
      )
    }));
  };


  // Funciones para Habit Monitor
  const toggleHabitMonitorCompletion = (habitIndex, dayIndex) => {
    setHabitMonitor(prev => ({
      ...prev,
      monthlyTracking: prev.monthlyTracking.map((habitTracking, index) =>
        index === habitIndex
          ? habitTracking.map((completed, dayIdx) =>
              dayIdx === dayIndex ? !completed : completed
            )
          : habitTracking
      )
    }));
  };

  const updateHabitMonitorText = (habitIndex, text) => {
    setHabitMonitor(prev => ({
      ...prev,
      habits: prev.habits.map((habit, index) =>
        index === habitIndex ? text : habit
      )
    }));
  };

  const renderSelfCareChecklist = () => {
    // Calcular estadísticas del día
    const getDayStats = () => {
      const allItems = [...checklistItems.morning, ...checklistItems.afternoon, ...checklistItems.evening, ...checklistItems.anytime];
      const completed = allItems.filter(item => item.completed).length;
      const total = allItems.length;
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
      return { completed, total, percentage };
    };

    // Obtener estadísticas por período
    const getPeriodStats = (period) => {
      const items = checklistItems[period];
      const completed = items.filter(item => item.completed).length;
      const total = items.length;
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
      return { completed, total, percentage };
    };

    // Obtener color según el progreso
    const getProgressColor = (percentage) => {
      if (percentage >= 80) return '#4CAF50';
      if (percentage >= 60) return '#FF9800';
      if (percentage >= 40) return '#FFC107';
      return '#F44336';
    };

    // Obtener emoji según el progreso
    const getProgressEmoji = (percentage) => {
      if (percentage >= 80) return '🌟';
      if (percentage >= 60) return '😊';
      if (percentage >= 40) return '😐';
      return '😔';
    };

    // Obtener mensaje motivacional
    const getMotivationalMessage = (percentage) => {
      if (percentage >= 80) return '¡Excelente! Estás cuidándote muy bien';
      if (percentage >= 60) return '¡Muy bien! Sigue así';
      if (percentage >= 40) return 'Vas por buen camino, ¡no te rindas!';
      return 'Cada pequeño paso cuenta, ¡tú puedes!';
    };

    const dayStats = getDayStats();
    const morningStats = getPeriodStats('morning');
    const afternoonStats = getPeriodStats('afternoon');
    const eveningStats = getPeriodStats('evening');
    const anytimeStats = getPeriodStats('anytime');

    return (
      <ScrollView style={styles.checklistContainer} showsVerticalScrollIndicator={false}>
        {/* Header mejorado */}
        <View style={styles.checklistHeader}>
          <View style={styles.checklistHeaderContent}>
            <View style={styles.checklistHeaderIcon}>
              <Icon name="checkmark-circle" size={28} color="#FFFFFF" />
            </View>
            <View style={styles.checklistHeaderText}>
              <Text style={styles.checklistHeaderTitle}>Lista de Cuidado Personal</Text>
              <Text style={styles.checklistHeaderSubtitle}>
                Tu rutina diaria de bienestar
              </Text>
            </View>
          </View>
          <View style={styles.checklistHeaderStats}>
            <Text style={styles.checklistHeaderPercentage}>{dayStats.percentage}%</Text>
            <Text style={styles.checklistHeaderLabel}>Completado</Text>
        </View>
      </View>

        {/* Panel de estadísticas del día */}
        <View style={styles.checklistStatsPanel}>
          <View style={styles.checklistStatsContent}>
            <Text style={styles.checklistStatsTitle}>
              {getProgressEmoji(dayStats.percentage)} Progreso del Día
            </Text>
            <Text style={styles.checklistStatsSubtitle}>
              {dayStats.completed} de {dayStats.total} actividades completadas
            </Text>
          </View>
          <View style={styles.checklistProgressContainer}>
            <View style={styles.checklistProgressBar}>
              <View 
                style={[
                  styles.checklistProgressFill,
                  { 
                    width: `${dayStats.percentage}%`,
                    backgroundColor: getProgressColor(dayStats.percentage)
                  }
                ]}
              />
            </View>
            <Text style={styles.checklistProgressText}>{dayStats.percentage}%</Text>
          </View>
          <Text style={styles.checklistMotivationalText}>
            {getMotivationalMessage(dayStats.percentage)}
          </Text>
        </View>

        {/* Estadísticas por período */}
        <View style={styles.checklistPeriodStats}>
          <View style={styles.checklistPeriodCard}>
            <View style={styles.checklistPeriodHeader}>
              <Icon name="sunny" size={20} color="#FF9800" />
              <Text style={styles.checklistPeriodTitle}>Mañana</Text>
            </View>
            <Text style={styles.checklistPeriodStats}>
              {morningStats.completed}/{morningStats.total}
            </Text>
            <View style={styles.checklistPeriodProgress}>
              <View 
                style={[
                  styles.checklistPeriodProgressFill,
                  { 
                    width: `${morningStats.percentage}%`,
                    backgroundColor: '#FF9800'
                  }
                ]}
              />
            </View>
          </View>

          <View style={styles.checklistPeriodCard}>
            <View style={styles.checklistPeriodHeader}>
              <Icon name="partly-sunny" size={20} color="#FFC107" />
              <Text style={styles.checklistPeriodTitle}>Tarde</Text>
            </View>
            <Text style={styles.checklistPeriodStats}>
              {afternoonStats.completed}/{afternoonStats.total}
            </Text>
            <View style={styles.checklistPeriodProgress}>
              <View 
                style={[
                  styles.checklistPeriodProgressFill,
                  { 
                    width: `${afternoonStats.percentage}%`,
                    backgroundColor: '#FFC107'
                  }
                ]}
              />
            </View>
          </View>

          <View style={styles.checklistPeriodCard}>
            <View style={styles.checklistPeriodHeader}>
              <Icon name="moon" size={20} color="#9C27B0" />
              <Text style={styles.checklistPeriodTitle}>Noche</Text>
            </View>
            <Text style={styles.checklistPeriodStats}>
              {eveningStats.completed}/{eveningStats.total}
            </Text>
            <View style={styles.checklistPeriodProgress}>
              <View 
                style={[
                  styles.checklistPeriodProgressFill,
                  { 
                    width: `${eveningStats.percentage}%`,
                    backgroundColor: '#9C27B0'
                  }
                ]}
              />
            </View>
          </View>

          <View style={styles.checklistPeriodCard}>
            <View style={styles.checklistPeriodHeader}>
              <Icon name="time" size={20} color="#2196F3" />
              <Text style={styles.checklistPeriodTitle}>Flexible</Text>
            </View>
            <Text style={styles.checklistPeriodStats}>
              {anytimeStats.completed}/{anytimeStats.total}
            </Text>
            <View style={styles.checklistPeriodProgress}>
              <View 
                style={[
                  styles.checklistPeriodProgressFill,
                  { 
                    width: `${anytimeStats.percentage}%`,
                    backgroundColor: '#2196F3'
                  }
                ]}
              />
            </View>
          </View>
        </View>

        {/* Lista de actividades mejorada */}
        <View style={styles.checklistActivitiesContainer}>
          {/* Mañana */}
          <View style={styles.checklistTimeSection}>
            <View style={styles.checklistTimeSectionHeader}>
              <View style={styles.checklistTimeSectionIcon}>
                <Icon name="sunny" size={24} color="#FF9800" />
              </View>
              <View style={styles.checklistTimeSectionContent}>
                <Text style={styles.checklistTimeSectionTitle}>MAÑANA</Text>
                <Text style={styles.checklistTimeSectionSubtitle}>
                  {morningStats.completed} de {morningStats.total} completadas
                </Text>
              </View>
              <View style={styles.checklistTimeSectionBadge}>
                <Text style={styles.checklistTimeSectionBadgeText}>
                  {morningStats.percentage}%
                </Text>
              </View>
            </View>
            <View style={styles.checklistTimeSectionContent}>
              {checklistItems.morning.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                  style={[
                    styles.checklistActivityItem,
                    item.completed && styles.checklistActivityItemCompleted
                  ]}
                onPress={() => toggleChecklistItem('morning', item.id)}
              >
                  <View style={styles.checklistActivityItemLeft}>
                    <View style={[
                      styles.checklistActivityItemCheckbox,
                      item.completed && styles.checklistActivityItemCheckboxCompleted
                    ]}>
                <Icon
                        name={item.completed ? 'checkmark' : 'ellipse-outline'}
                        size={16}
                        color={item.completed ? '#FFFFFF' : '#6B7280'}
                      />
                    </View>
                <Text style={[
                      styles.checklistActivityItemText,
                      item.completed && styles.checklistActivityItemTextCompleted
                ]}>
                  {item.text}
                </Text>
                  </View>
                  <View style={styles.checklistActivityItemRight}>
                    <Text style={styles.checklistActivityItemNumber}>
                      {String(index + 1).padStart(2, '0')}
                    </Text>
                  </View>
              </TouchableOpacity>
            ))}
            </View>
          </View>

          {/* Tarde */}
          <View style={styles.checklistTimeSection}>
            <View style={styles.checklistTimeSectionHeader}>
              <View style={styles.checklistTimeSectionIcon}>
                <Icon name="partly-sunny" size={24} color="#FFC107" />
              </View>
              <View style={styles.checklistTimeSectionContent}>
                <Text style={styles.checklistTimeSectionTitle}>TARDE</Text>
                <Text style={styles.checklistTimeSectionSubtitle}>
                  {afternoonStats.completed} de {afternoonStats.total} completadas
                </Text>
              </View>
              <View style={styles.checklistTimeSectionBadge}>
                <Text style={styles.checklistTimeSectionBadgeText}>
                  {afternoonStats.percentage}%
                </Text>
              </View>
            </View>
            <View style={styles.checklistTimeSectionContent}>
              {checklistItems.afternoon.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                  style={[
                    styles.checklistActivityItem,
                    item.completed && styles.checklistActivityItemCompleted
                  ]}
                  onPress={() => toggleChecklistItem('afternoon', item.id)}
                >
                  <View style={styles.checklistActivityItemLeft}>
                    <View style={[
                      styles.checklistActivityItemCheckbox,
                      item.completed && styles.checklistActivityItemCheckboxCompleted
                    ]}>
                <Icon
                        name={item.completed ? 'checkmark' : 'ellipse-outline'}
                        size={16}
                        color={item.completed ? '#FFFFFF' : '#6B7280'}
                      />
                    </View>
                <Text style={[
                      styles.checklistActivityItemText,
                      item.completed && styles.checklistActivityItemTextCompleted
                ]}>
                  {item.text}
                </Text>
                  </View>
                  <View style={styles.checklistActivityItemRight}>
                    <Text style={styles.checklistActivityItemNumber}>
                      {String(index + 1).padStart(2, '0')}
                    </Text>
                  </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

          {/* Noche */}
          <View style={styles.checklistTimeSection}>
            <View style={styles.checklistTimeSectionHeader}>
              <View style={styles.checklistTimeSectionIcon}>
                <Icon name="moon" size={24} color="#9C27B0" />
              </View>
              <View style={styles.checklistTimeSectionContent}>
                <Text style={styles.checklistTimeSectionTitle}>NOCHE</Text>
                <Text style={styles.checklistTimeSectionSubtitle}>
                  {eveningStats.completed} de {eveningStats.total} completadas
                </Text>
              </View>
              <View style={styles.checklistTimeSectionBadge}>
                <Text style={styles.checklistTimeSectionBadgeText}>
                  {eveningStats.percentage}%
                </Text>
              </View>
            </View>
            <View style={styles.checklistTimeSectionContent}>
              {checklistItems.evening.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                  style={[
                    styles.checklistActivityItem,
                    item.completed && styles.checklistActivityItemCompleted
                  ]}
                  onPress={() => toggleChecklistItem('evening', item.id)}
                >
                  <View style={styles.checklistActivityItemLeft}>
                    <View style={[
                      styles.checklistActivityItemCheckbox,
                      item.completed && styles.checklistActivityItemCheckboxCompleted
                    ]}>
                <Icon
                        name={item.completed ? 'checkmark' : 'ellipse-outline'}
                        size={16}
                        color={item.completed ? '#FFFFFF' : '#6B7280'}
                      />
                    </View>
                <Text style={[
                      styles.checklistActivityItemText,
                      item.completed && styles.checklistActivityItemTextCompleted
                ]}>
                  {item.text}
                </Text>
                  </View>
                  <View style={styles.checklistActivityItemRight}>
                    <Text style={styles.checklistActivityItemNumber}>
                      {String(index + 1).padStart(2, '0')}
                    </Text>
                  </View>
              </TouchableOpacity>
            ))}
            </View>
          </View>

          {/* Cualquier Momento */}
          <View style={styles.checklistTimeSection}>
            <View style={styles.checklistTimeSectionHeader}>
              <View style={styles.checklistTimeSectionIcon}>
                <Icon name="time" size={24} color="#2196F3" />
              </View>
              <View style={styles.checklistTimeSectionContent}>
                <Text style={styles.checklistTimeSectionTitle}>CUALQUIER MOMENTO</Text>
                <Text style={styles.checklistTimeSectionSubtitle}>
                  {anytimeStats.completed} de {anytimeStats.total} completadas
                </Text>
              </View>
              <View style={styles.checklistTimeSectionBadge}>
                <Text style={styles.checklistTimeSectionBadgeText}>
                  {anytimeStats.percentage}%
                </Text>
              </View>
            </View>
            <View style={styles.checklistTimeSectionContent}>
              {checklistItems.anytime.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                  style={[
                    styles.checklistActivityItem,
                    item.completed && styles.checklistActivityItemCompleted
                  ]}
                onPress={() => toggleChecklistItem('anytime', item.id)}
              >
                  <View style={styles.checklistActivityItemLeft}>
                    <View style={[
                      styles.checklistActivityItemCheckbox,
                      item.completed && styles.checklistActivityItemCheckboxCompleted
                    ]}>
                <Icon
                        name={item.completed ? 'checkmark' : 'ellipse-outline'}
                        size={16}
                        color={item.completed ? '#FFFFFF' : '#6B7280'}
                      />
                    </View>
                <Text style={[
                      styles.checklistActivityItemText,
                      item.completed && styles.checklistActivityItemTextCompleted
                ]}>
                  {item.text}
                </Text>
                  </View>
                  <View style={styles.checklistActivityItemRight}>
                    <Text style={styles.checklistActivityItemNumber}>
                      {String(index + 1).padStart(2, '0')}
                    </Text>
                  </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

        {/* Botones de acción */}
        <View style={styles.checklistActions}>
          <TouchableOpacity style={styles.checklistActionButton}>
            <Icon name="refresh" size={16} color="#2196F3" />
            <Text style={styles.checklistActionText}>Reiniciar Día</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.checklistActionButton}>
            <Icon name="share" size={16} color="#4CAF50" />
            <Text style={styles.checklistActionText}>Compartir Progreso</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.checklistActionButton}>
            <Icon name="analytics" size={16} color="#FF9800" />
            <Text style={styles.checklistActionText}>Ver Estadísticas</Text>
          </TouchableOpacity>
    </View>
      </ScrollView>
    );
  };

  const renderWellnessScheduler = () => {
    // Datos de ejemplo para el programador de bienestar
    const sampleWellnessSchedules = [
      {
        id: '1',
        title: 'Rutina Matutina Energizante',
        description: 'Actividades para comenzar el día con energía y positividad',
        color: '#FF6B35',
        icon: 'sunny',
        activities: [
          { id: 1, name: 'Meditación de 10 minutos', time: '07:00', duration: '10 min', category: 'Mindfulness' },
          { id: 2, name: 'Ejercicio de estiramiento', time: '07:15', duration: '15 min', category: 'Ejercicio' },
          { id: 3, name: 'Desayuno nutritivo', time: '07:30', duration: '20 min', category: 'Nutrición' },
          { id: 4, name: 'Lectura motivacional', time: '08:00', duration: '15 min', category: 'Desarrollo' },
          { id: 5, name: 'Planificación del día', time: '08:15', duration: '10 min', category: 'Productividad' },
          { id: 6, name: 'Agradecimiento diario', time: '08:25', duration: '5 min', category: 'Gratitud' }
        ],
        weekDays: [true, true, true, true, true, false, false],
        totalActivities: 6,
        completedToday: 4,
        streak: 12,
        lastUpdated: '2024-01-15'
      },
      {
        id: '2',
        title: 'Rutina de Relajación Nocturna',
        description: 'Actividades para terminar el día en calma y prepararse para el descanso',
        color: '#9C27B0',
        icon: 'moon',
        activities: [
          { id: 1, name: 'Reflexión del día', time: '21:00', duration: '10 min', category: 'Reflexión' },
          { id: 2, name: 'Ejercicios de respiración', time: '21:10', duration: '10 min', category: 'Relajación' },
          { id: 3, name: 'Lectura relajante', time: '21:20', duration: '20 min', category: 'Lectura' },
          { id: 4, name: 'Preparar ropa del día siguiente', time: '21:40', duration: '5 min', category: 'Organización' },
          { id: 5, name: 'Gratitud nocturna', time: '21:45', duration: '5 min', category: 'Gratitud' },
          { id: 6, name: 'Técnica de relajación muscular', time: '21:50', duration: '10 min', category: 'Relajación' }
        ],
        weekDays: [true, true, true, true, true, true, true],
        totalActivities: 6,
        completedToday: 6,
        streak: 25,
        lastUpdated: '2024-01-15'
      },
      {
        id: '3',
        title: 'Rutina de Bienestar Laboral',
        description: 'Actividades para mantener el bienestar durante la jornada de trabajo',
        color: '#2196F3',
        icon: 'briefcase',
        activities: [
          { id: 1, name: 'Pausa activa cada 2 horas', time: '10:00', duration: '5 min', category: 'Ejercicio' },
          { id: 2, name: 'Hidratación consciente', time: '11:00', duration: '2 min', category: 'Salud' },
          { id: 3, name: 'Ejercicios de respiración', time: '14:00', duration: '5 min', category: 'Relajación' },
          { id: 4, name: 'Caminata al aire libre', time: '15:00', duration: '10 min', category: 'Ejercicio' },
          { id: 5, name: 'Revisión de objetivos', time: '16:00', duration: '5 min', category: 'Productividad' },
          { id: 6, name: 'Organización del escritorio', time: '17:00', duration: '5 min', category: 'Organización' }
        ],
        weekDays: [true, true, true, true, true, false, false],
        totalActivities: 6,
        completedToday: 3,
        streak: 8,
        lastUpdated: '2024-01-15'
      }
    ];

    // Calcular estadísticas generales
    const getOverallStats = () => {
      const totalSchedules = sampleWellnessSchedules.length;
      const totalActivities = sampleWellnessSchedules.reduce((sum, schedule) => sum + schedule.totalActivities, 0);
      const completedToday = sampleWellnessSchedules.reduce((sum, schedule) => sum + schedule.completedToday, 0);
      const totalStreak = sampleWellnessSchedules.reduce((sum, schedule) => sum + schedule.streak, 0);
      const averageStreak = Math.round(totalStreak / totalSchedules);
      
      return { totalSchedules, totalActivities, completedToday, averageStreak };
    };

    // Obtener color según el progreso
    const getProgressColor = (completed, total) => {
      const percentage = (completed / total) * 100;
      if (percentage >= 80) return '#4CAF50';
      if (percentage >= 60) return '#FF9800';
      if (percentage >= 40) return '#FFC107';
      return '#F44336';
    };

    // Obtener emoji según el progreso
    const getProgressEmoji = (completed, total) => {
      const percentage = (completed / total) * 100;
      if (percentage >= 80) return '🌟';
      if (percentage >= 60) return '😊';
      if (percentage >= 40) return '😐';
      return '😔';
    };

    // Obtener mensaje motivacional
    const getMotivationalMessage = (completed, total) => {
      const percentage = (completed / total) * 100;
      if (percentage >= 80) return '¡Excelente! Tu bienestar está en óptimas condiciones';
      if (percentage >= 60) return '¡Muy bien! Sigue cuidando tu bienestar';
      if (percentage >= 40) return 'Vas por buen camino, ¡no te rindas!';
      return 'Cada pequeño paso hacia el bienestar cuenta';
    };

    const overallStats = getOverallStats();

    return (
      <ScrollView style={styles.wellnessContainer} showsVerticalScrollIndicator={false}>
        {/* Header mejorado */}
        <View style={styles.wellnessHeader}>
          <View style={styles.wellnessHeaderContent}>
            <View style={styles.wellnessHeaderIcon}>
              <Icon name="calendar" size={28} color="#FFFFFF" />
            </View>
            <View style={styles.wellnessHeaderText}>
              <Text style={styles.wellnessHeaderTitle}>Programador de Bienestar Personal</Text>
              <Text style={styles.wellnessHeaderSubtitle}>
                Organiza tu rutina de bienestar diaria
              </Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.wellnessAddButton}
            onPress={openAddWellnessModal}
          >
            <Icon name="add" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

        {/* Panel de estadísticas generales */}
        <View style={styles.wellnessStatsPanel}>
          <View style={styles.wellnessStatsContent}>
            <Text style={styles.wellnessStatsTitle}>
              {getProgressEmoji(overallStats.completedToday, overallStats.totalActivities)} Tu Bienestar Hoy
            </Text>
            <Text style={styles.wellnessStatsSubtitle}>
              {overallStats.completedToday} de {overallStats.totalActivities} actividades completadas
            </Text>
        </View>
          <View style={styles.wellnessProgressContainer}>
            <View style={styles.wellnessProgressBar}>
              <View 
                style={[
                  styles.wellnessProgressFill,
                  { 
                    width: `${Math.round((overallStats.completedToday / overallStats.totalActivities) * 100)}%`,
                    backgroundColor: getProgressColor(overallStats.completedToday, overallStats.totalActivities)
                  }
                ]}
              />
              </View>
            <Text style={styles.wellnessProgressText}>
              {Math.round((overallStats.completedToday / overallStats.totalActivities) * 100)}%
            </Text>
          </View>
          <Text style={styles.wellnessMotivationalText}>
            {getMotivationalMessage(overallStats.completedToday, overallStats.totalActivities)}
          </Text>
        </View>

        {/* Estadísticas detalladas */}
        <View style={styles.wellnessDetailedStats}>
          <View style={styles.wellnessStatCard}>
            <View style={styles.wellnessStatIcon}>
              <Icon name="list" size={20} color="#2196F3" />
            </View>
            <View style={styles.wellnessStatContent}>
              <Text style={styles.wellnessStatNumber}>{overallStats.totalSchedules}</Text>
              <Text style={styles.wellnessStatLabel}>Rutinas</Text>
            </View>
          </View>
          <View style={styles.wellnessStatCard}>
            <View style={styles.wellnessStatIcon}>
              <Icon name="checkmark-circle" size={20} color="#4CAF50" />
            </View>
            <View style={styles.wellnessStatContent}>
              <Text style={styles.wellnessStatNumber}>{overallStats.completedToday}</Text>
              <Text style={styles.wellnessStatLabel}>Completadas</Text>
            </View>
          </View>
          <View style={styles.wellnessStatCard}>
            <View style={styles.wellnessStatIcon}>
              <Icon name="flame" size={20} color="#FF9800" />
            </View>
            <View style={styles.wellnessStatContent}>
              <Text style={styles.wellnessStatNumber}>{overallStats.averageStreak}</Text>
              <Text style={styles.wellnessStatLabel}>Racha Promedio</Text>
            </View>
          </View>
          <View style={styles.wellnessStatCard}>
            <View style={styles.wellnessStatIcon}>
              <Icon name="trending-up" size={20} color="#9C27B0" />
            </View>
            <View style={styles.wellnessStatContent}>
              <Text style={styles.wellnessStatNumber}>{overallStats.totalActivities}</Text>
              <Text style={styles.wellnessStatLabel}>Actividades</Text>
            </View>
          </View>
        </View>

        {/* Lista de rutinas de bienestar */}
        <View style={styles.wellnessRoutinesContainer}>
          <Text style={styles.wellnessRoutinesTitle}>Mis Rutinas de Bienestar</Text>
          {sampleWellnessSchedules.map((schedule) => (
            <View key={schedule.id} style={styles.wellnessRoutineCard}>
              <View style={styles.wellnessRoutineHeader}>
                <View style={styles.wellnessRoutineHeaderLeft}>
                  <View style={[styles.wellnessRoutineIcon, { backgroundColor: schedule.color }]}>
                    <Icon name={schedule.icon} size={24} color="#FFFFFF" />
                  </View>
                  <View style={styles.wellnessRoutineInfo}>
                    <Text style={styles.wellnessRoutineTitle}>{schedule.title}</Text>
                    <Text style={styles.wellnessRoutineDescription}>{schedule.description}</Text>
                  </View>
                </View>
                <View style={styles.wellnessRoutineBadge}>
                  <Text style={styles.wellnessRoutineBadgeText}>
                    {schedule.completedToday}/{schedule.totalActivities}
                  </Text>
                </View>
              </View>

              {/* Progreso de la rutina */}
              <View style={styles.wellnessRoutineProgress}>
                <View style={styles.wellnessRoutineProgressBar}>
                  <View 
                    style={[
                      styles.wellnessRoutineProgressFill,
                      { 
                        width: `${Math.round((schedule.completedToday / schedule.totalActivities) * 100)}%`,
                        backgroundColor: schedule.color
                      }
                    ]}
                  />
                </View>
                <Text style={styles.wellnessRoutineProgressText}>
                  {Math.round((schedule.completedToday / schedule.totalActivities) * 100)}%
                </Text>
              </View>

              {/* Días de la semana */}
              <View style={styles.wellnessRoutineDays}>
                <Text style={styles.wellnessRoutineDaysLabel}>Días activos:</Text>
                <View style={styles.wellnessRoutineDaysContainer}>
                  {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day, index) => (
                    <View 
                      key={index} 
                      style={[
                        styles.wellnessRoutineDay,
                        schedule.weekDays[index] && styles.wellnessRoutineDayActive
                      ]}
                    >
                      <Text style={[
                        styles.wellnessRoutineDayText,
                        schedule.weekDays[index] && styles.wellnessRoutineDayTextActive
                      ]}>
                        {day}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Lista de actividades */}
              <View style={styles.wellnessRoutineActivities}>
              {schedule.activities.map((activity, index) => (
                  <View key={activity.id} style={styles.wellnessActivityItem}>
                    <View style={styles.wellnessActivityLeft}>
                      <View style={[styles.wellnessActivityNumber, { backgroundColor: schedule.color }]}>
                        <Text style={styles.wellnessActivityNumberText}>
                          {String(index + 1).padStart(2, '0')}
                        </Text>
                      </View>
                      <View style={styles.wellnessActivityInfo}>
                        <Text style={styles.wellnessActivityName}>{activity.name}</Text>
                        <View style={styles.wellnessActivityMeta}>
                          <Text style={styles.wellnessActivityTime}>{activity.time}</Text>
                          <Text style={styles.wellnessActivityDuration}>{activity.duration}</Text>
                          <Text style={styles.wellnessActivityCategory}>{activity.category}</Text>
                        </View>
                      </View>
                    </View>
                    <TouchableOpacity style={styles.wellnessActivityCheck}>
                      <Icon
                        name="ellipse-outline" 
                        size={20} 
                        color="#D1D5DB" 
                      />
                    </TouchableOpacity>
                  </View>
                    ))}
                  </View>

              {/* Información adicional */}
              <View style={styles.wellnessRoutineFooter}>
                <View style={styles.wellnessRoutineStats}>
                  <View style={styles.wellnessRoutineStat}>
                    <Icon name="flame" size={16} color="#FF9800" />
                    <Text style={styles.wellnessRoutineStatText}>{schedule.streak} días</Text>
                </View>
                  <View style={styles.wellnessRoutineStat}>
                    <Icon name="time" size={16} color="#6B7280" />
                    <Text style={styles.wellnessRoutineStatText}>Actualizado: {schedule.lastUpdated}</Text>
                  </View>
                </View>
                <View style={styles.wellnessRoutineActions}>
                  <TouchableOpacity style={styles.wellnessRoutineAction}>
                    <Icon name="create-outline" size={16} color="#2196F3" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.wellnessRoutineAction}>
                    <Icon name="share-outline" size={16} color="#4CAF50" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.wellnessRoutineAction}>
                    <Icon name="ellipsis-horizontal" size={16} color="#6B7280" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
    </View>

        {/* Botones de acción */}
        <View style={styles.wellnessActions}>
          <TouchableOpacity style={styles.wellnessActionButton}>
            <Icon name="add-circle" size={20} color="#2196F3" />
            <Text style={styles.wellnessActionText}>Nueva Rutina</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.wellnessActionButton}>
            <Icon name="analytics" size={20} color="#4CAF50" />
            <Text style={styles.wellnessActionText}>Ver Estadísticas</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.wellnessActionButton}>
            <Icon name="settings" size={20} color="#FF9800" />
            <Text style={styles.wellnessActionText}>Configurar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  const renderSelfCareJournal = () => {
    // Datos de ejemplo para el diario de cuidado personal
    const sampleJournalEntries = [
      {
        id: '1',
        date: '2024-01-15',
        dayOfWeek: 'Lunes',
        mood: '😊',
        moodText: 'Feliz',
        moodColor: '#4CAF50',
        gratefulFor: [
          'El apoyo de mi familia',
          'Un día productivo en el trabajo',
          'La salud de mis seres queridos',
          'Las pequeñas alegrías del día'
        ],
        achievements: [
          'Completé mi rutina de ejercicio matutina',
          'Terminé el proyecto importante del trabajo',
          'Practiqué meditación por 15 minutos',
          'Organicé mi espacio de trabajo'
        ],
        hydration: 6,
        reminder: 'Recordar tomar agua cada hora y hacer pausas activas',
        tomorrowPlan: [
          'Despertar temprano para hacer ejercicio',
          'Preparar una comida saludable',
          'Llamar a mi madre',
          'Leer un capítulo del libro'
        ],
        notes: 'Hoy fue un día muy productivo. Me siento orgulloso de haber completado todas mis tareas importantes. La meditación me ayudó mucho a mantener la calma durante el día. Mañana quiero enfocarme en ser más paciente conmigo mismo.',
        energyLevel: 8,
        sleepQuality: 7,
        stressLevel: 3,
        selfCareActivities: ['Ejercicio', 'Meditación', 'Lectura', 'Organización'],
        tags: ['Productivo', 'Gratitud', 'Ejercicio', 'Familia']
      },
      {
        id: '2',
        date: '2024-01-14',
        dayOfWeek: 'Domingo',
        mood: '😌',
        moodText: 'Tranquilo',
        moodColor: '#2196F3',
        gratefulFor: [
          'Un día de descanso merecido',
          'El tiempo con mi pareja',
          'Una caminata en el parque',
          'La tranquilidad del hogar'
        ],
        achievements: [
          'Dormí 8 horas completas',
          'Hice una caminata de 30 minutos',
          'Cociné una comida saludable',
          'Dediqué tiempo a mi hobby favorito'
        ],
        hydration: 8,
        reminder: 'Mantener el equilibrio entre descanso y actividad',
        tomorrowPlan: [
          'Preparar la ropa para la semana',
          'Hacer la lista de compras',
          'Planificar las comidas de la semana',
          'Establecer objetivos para la semana'
        ],
        notes: 'Domingo perfecto para recargar energías. La caminata en el parque me llenó de paz. Me siento preparado para la semana que viene. Es importante mantener este equilibrio entre trabajo y descanso.',
        energyLevel: 7,
        sleepQuality: 9,
        stressLevel: 1,
        selfCareActivities: ['Descanso', 'Caminata', 'Cocina', 'Hobby'],
        tags: ['Descanso', 'Paz', 'Pareja', 'Naturaleza']
      },
      {
        id: '3',
        date: '2024-01-13',
        dayOfWeek: 'Sábado',
        mood: '🤔',
        moodText: 'Reflexivo',
        moodColor: '#FF9800',
        gratefulFor: [
          'La oportunidad de reflexionar',
          'Las lecciones aprendidas esta semana',
          'El apoyo de mis amigos',
          'La capacidad de crecer y mejorar'
        ],
        achievements: [
          'Reflexioné sobre mis objetivos del año',
          'Escribí en mi diario personal',
          'Hice una llamada a un amigo',
          'Revisé mi progreso personal'
        ],
        hydration: 5,
        reminder: 'No ser tan duro conmigo mismo, todos tenemos días difíciles',
        tomorrowPlan: [
          'Disfrutar del día de descanso',
          'Hacer algo que me guste',
          'Conectar con la naturaleza',
          'Prepararme mentalmente para la semana'
        ],
        notes: 'Día de mucha reflexión. A veces me siento abrumado por mis propios objetivos, pero es importante recordar que el crecimiento es un proceso. Mis amigos me ayudaron a poner las cosas en perspectiva.',
        energyLevel: 5,
        sleepQuality: 6,
        stressLevel: 6,
        selfCareActivities: ['Reflexión', 'Escritura', 'Amistades', 'Autoevaluación'],
        tags: ['Reflexión', 'Crecimiento', 'Amigos', 'Objetivos']
      }
    ];

    // Calcular estadísticas del diario
    const getJournalStats = () => {
      const totalEntries = sampleJournalEntries.length;
      const avgEnergyLevel = Math.round(sampleJournalEntries.reduce((sum, entry) => sum + entry.energyLevel, 0) / totalEntries);
      const avgSleepQuality = Math.round(sampleJournalEntries.reduce((sum, entry) => sum + entry.sleepQuality, 0) / totalEntries);
      const avgStressLevel = Math.round(sampleJournalEntries.reduce((sum, entry) => sum + entry.stressLevel, 0) / totalEntries);
      const totalGratefulItems = sampleJournalEntries.reduce((sum, entry) => sum + entry.gratefulFor.length, 0);
      const totalAchievements = sampleJournalEntries.reduce((sum, entry) => sum + entry.achievements.length, 0);
      
      return { totalEntries, avgEnergyLevel, avgSleepQuality, avgStressLevel, totalGratefulItems, totalAchievements };
    };

    // Obtener color según el nivel de energía
    const getEnergyColor = (level) => {
      if (level >= 8) return '#4CAF50';
      if (level >= 6) return '#FF9800';
      if (level >= 4) return '#FFC107';
      return '#F44336';
    };

    // Obtener color según la calidad del sueño
    const getSleepColor = (level) => {
      if (level >= 8) return '#4CAF50';
      if (level >= 6) return '#FF9800';
      if (level >= 4) return '#FFC107';
      return '#F44336';
    };

    // Obtener color según el nivel de estrés
    const getStressColor = (level) => {
      if (level <= 3) return '#4CAF50';
      if (level <= 5) return '#FF9800';
      if (level <= 7) return '#FFC107';
      return '#F44336';
    };

    // Obtener emoji según el estado de ánimo
    const getMoodEmoji = (mood) => {
      const moodMap = {
        '😊': 'Feliz',
        '😌': 'Tranquilo',
        '🤔': 'Reflexivo',
        '😔': 'Triste',
        '😤': 'Enojado',
        '😴': 'Cansado',
        '🤗': 'Agradecido',
        '😎': 'Confianza'
      };
      return moodMap[mood] || 'Neutral';
    };

    const journalStats = getJournalStats();

    return (
      <ScrollView style={styles.journalContainer} showsVerticalScrollIndicator={false}>
        {/* Header mejorado */}
        <View style={styles.journalHeader}>
          <View style={styles.journalHeaderContent}>
            <View style={styles.journalHeaderIcon}>
              <Icon name="book" size={28} color="#FFFFFF" />
            </View>
            <View style={styles.journalHeaderText}>
              <Text style={styles.journalHeaderTitle}>Diario de Cuidado Personal</Text>
              <Text style={styles.journalHeaderSubtitle}>
                Reflexiona sobre tu día y cuida tu bienestar
              </Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.journalAddButton}
            onPress={openAddJournalModal}
          >
            <Icon name="add" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

        {/* Panel de estadísticas del diario */}
        <View style={styles.journalStatsPanel}>
          <View style={styles.journalStatsContent}>
            <Text style={styles.journalStatsTitle}>
              📊 Tu Bienestar Esta Semana
            </Text>
            <Text style={styles.journalStatsSubtitle}>
              {journalStats.totalEntries} entradas • {journalStats.totalGratefulItems} cosas por las que agradecer
            </Text>
        </View>
          <View style={styles.journalStatsGrid}>
            <View style={styles.journalStatCard}>
              <View style={styles.journalStatIcon}>
                <Icon name="flash" size={20} color="#FF9800" />
              </View>
              <Text style={styles.journalStatNumber}>{journalStats.avgEnergyLevel}/10</Text>
              <Text style={styles.journalStatLabel}>Energía</Text>
            </View>
            <View style={styles.journalStatCard}>
              <View style={styles.journalStatIcon}>
                <Icon name="moon" size={20} color="#9C27B0" />
              </View>
              <Text style={styles.journalStatNumber}>{journalStats.avgSleepQuality}/10</Text>
              <Text style={styles.journalStatLabel}>Sueño</Text>
            </View>
            <View style={styles.journalStatCard}>
              <View style={styles.journalStatIcon}>
                <Icon name="heart" size={20} color="#E91E63" />
              </View>
              <Text style={styles.journalStatNumber}>{journalStats.avgStressLevel}/10</Text>
              <Text style={styles.journalStatLabel}>Estrés</Text>
            </View>
            <View style={styles.journalStatCard}>
              <View style={styles.journalStatIcon}>
                <Icon name="trophy" size={20} color="#4CAF50" />
              </View>
              <Text style={styles.journalStatNumber}>{journalStats.totalAchievements}</Text>
              <Text style={styles.journalStatLabel}>Logros</Text>
            </View>
                </View>
              </View>
              
        {/* Lista de entradas del diario */}
        <View style={styles.journalEntriesContainer}>
          <Text style={styles.journalEntriesTitle}>Mis Reflexiones Diarias</Text>
          {sampleJournalEntries.map((entry) => (
            <View key={entry.id} style={styles.journalEntryCard}>
              {/* Header de la entrada */}
              <View style={styles.journalEntryHeader}>
                <View style={styles.journalEntryDateInfo}>
                  <Text style={styles.journalEntryDate}>{entry.date}</Text>
                  <Text style={styles.journalEntryDay}>{entry.dayOfWeek}</Text>
                </View>
                <View style={[styles.journalEntryMood, { backgroundColor: entry.moodColor }]}>
                  <Text style={styles.journalEntryMoodEmoji}>{entry.mood}</Text>
                  <Text style={styles.journalEntryMoodText}>{entry.moodText}</Text>
                </View>
              </View>

              {/* Indicadores de bienestar */}
              <View style={styles.journalEntryWellness}>
                <View style={styles.journalEntryWellnessItem}>
                  <Icon name="flash" size={16} color={getEnergyColor(entry.energyLevel)} />
                  <Text style={styles.journalEntryWellnessText}>Energía: {entry.energyLevel}/10</Text>
                </View>
                <View style={styles.journalEntryWellnessItem}>
                  <Icon name="moon" size={16} color={getSleepColor(entry.sleepQuality)} />
                  <Text style={styles.journalEntryWellnessText}>Sueño: {entry.sleepQuality}/10</Text>
                </View>
                <View style={styles.journalEntryWellnessItem}>
                  <Icon name="heart" size={16} color={getStressColor(entry.stressLevel)} />
                  <Text style={styles.journalEntryWellnessText}>Estrés: {entry.stressLevel}/10</Text>
                </View>
              </View>

              {/* Contenido principal */}
              <View style={styles.journalEntryContent}>
                {/* Columna izquierda */}
                <View style={styles.journalEntryColumn}>
                  {/* Gratitud */}
                  <View style={styles.journalEntrySection}>
                    <View style={styles.journalEntrySectionHeader}>
                      <Icon name="heart" size={20} color="#E91E63" />
                      <Text style={styles.journalEntrySectionTitle}>Soy Agradecido Por</Text>
                    </View>
                    <View style={styles.journalEntryList}>
                  {entry.gratefulFor.map((item, index) => (
                        <View key={index} style={styles.journalEntryListItem}>
                          <Icon name="checkmark-circle" size={16} color="#4CAF50" />
                          <Text style={styles.journalEntryListItemText}>{item}</Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  {/* Logros */}
                  <View style={styles.journalEntrySection}>
                    <View style={styles.journalEntrySectionHeader}>
                      <Icon name="trophy" size={20} color="#FF9800" />
                      <Text style={styles.journalEntrySectionTitle}>Logros del Día</Text>
                    </View>
                    <View style={styles.journalEntryList}>
                  {entry.achievements.map((item, index) => (
                        <View key={index} style={styles.journalEntryListItem}>
                          <Icon name="star" size={16} color="#FFC107" />
                          <Text style={styles.journalEntryListItemText}>{item}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>

                {/* Columna derecha */}
                <View style={styles.journalEntryColumn}>
                  {/* Hidratación */}
                  <View style={styles.journalEntrySection}>
                    <View style={styles.journalEntrySectionHeader}>
                      <Icon name="water" size={20} color="#2196F3" />
                      <Text style={styles.journalEntrySectionTitle}>Hidratación</Text>
                    </View>
                    <View style={styles.journalEntryHydration}>
                    {[...Array(8)].map((_, index) => (
                      <Icon
                        key={index}
                        name={index < entry.hydration ? 'water' : 'water-outline'}
                          size={24}
                          color={index < entry.hydration ? '#2196F3' : '#D1D5DB'}
                      />
                    ))}
                      <Text style={styles.journalEntryHydrationText}>
                        {entry.hydration}/8 vasos
                      </Text>
                  </View>
                </View>

                  {/* Recordatorio */}
                  <View style={styles.journalEntrySection}>
                    <View style={styles.journalEntrySectionHeader}>
                      <Icon name="bulb" size={20} color="#FFC107" />
                      <Text style={styles.journalEntrySectionTitle}>Recordatorio</Text>
                    </View>
                    <Text style={styles.journalEntryText}>{entry.reminder}</Text>
                  </View>
                </View>
              </View>

              {/* Plan para mañana */}
              <View style={styles.journalEntrySection}>
                <View style={styles.journalEntrySectionHeader}>
                  <Icon name="calendar" size={20} color="#9C27B0" />
                  <Text style={styles.journalEntrySectionTitle}>Plan para Mañana</Text>
                </View>
                <View style={styles.journalEntryList}>
                  {entry.tomorrowPlan.map((item, index) => (
                    <View key={index} style={styles.journalEntryListItem}>
                      <Icon name="arrow-forward" size={16} color="#9C27B0" />
                      <Text style={styles.journalEntryListItemText}>{item}</Text>
                    </View>
                  ))}
                </View>
              </View>
              
              {/* Actividades de cuidado personal */}
              <View style={styles.journalEntrySection}>
                <View style={styles.journalEntrySectionHeader}>
                  <Icon name="leaf" size={20} color="#4CAF50" />
                  <Text style={styles.journalEntrySectionTitle}>Actividades de Cuidado Personal</Text>
              </View>
                <View style={styles.journalEntryTags}>
                  {entry.selfCareActivities.map((activity, index) => (
                    <View key={index} style={styles.journalEntryTag}>
                      <Text style={styles.journalEntryTagText}>{activity}</Text>
            </View>
          ))}
    </View>
              </View>

              {/* Notas */}
              <View style={styles.journalEntrySection}>
                <View style={styles.journalEntrySectionHeader}>
                  <Icon name="document-text" size={20} color="#6B7280" />
                  <Text style={styles.journalEntrySectionTitle}>Notas Personales</Text>
                </View>
                <Text style={styles.journalEntryNotes}>{entry.notes}</Text>
              </View>

              {/* Tags */}
              <View style={styles.journalEntryTags}>
                {entry.tags.map((tag, index) => (
                  <View key={index} style={[styles.journalEntryTag, { backgroundColor: '#F3F4F6' }]}>
                    <Text style={[styles.journalEntryTagText, { color: '#6B7280' }]}>#{tag}</Text>
                  </View>
                ))}
              </View>

              {/* Footer con acciones */}
              <View style={styles.journalEntryFooter}>
                <View style={styles.journalEntryActions}>
                  <TouchableOpacity style={styles.journalEntryAction}>
                    <Icon name="create-outline" size={16} color="#2196F3" />
                    <Text style={styles.journalEntryActionText}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.journalEntryAction}>
                    <Icon name="share-outline" size={16} color="#4CAF50" />
                    <Text style={styles.journalEntryActionText}>Compartir</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.journalEntryAction}>
                    <Icon name="copy-outline" size={16} color="#FF9800" />
                    <Text style={styles.journalEntryActionText}>Copiar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Botones de acción */}
        <View style={styles.journalActions}>
          <TouchableOpacity style={styles.journalActionButton}>
            <Icon name="add-circle" size={20} color="#2196F3" />
            <Text style={styles.journalActionText}>Nueva Entrada</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.journalActionButton}>
            <Icon name="analytics" size={20} color="#4CAF50" />
            <Text style={styles.journalActionText}>Ver Estadísticas</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.journalActionButton}>
            <Icon name="download" size={20} color="#FF9800" />
            <Text style={styles.journalActionText}>Exportar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  const renderSelfCarePlanner = () => {
    // Datos de ejemplo para el planificador de cuidado personal
    const sampleSelfCarePlans = [
      {
        id: '1',
        date: '2024-01-15',
        dayOfWeek: 'Lunes',
        mood: '😊',
        moodText: 'Energético',
        moodColor: '#4CAF50',
        priority: 'Alta',
        priorityColor: '#F44336',
        todo: [
          'Meditación matutina de 15 minutos',
          'Ejercicio de cardio por 30 minutos',
          'Preparar comida saludable para la semana',
          'Llamar a mi familia',
          'Leer un capítulo del libro',
          'Organizar el espacio de trabajo'
        ],
        completedTasks: 4,
        totalTasks: 6,
        workout: {
          type: 'Cardio + Fuerza',
          duration: '45 minutos',
          intensity: 'Alta',
          exercises: ['Correr', 'Pesas', 'Yoga']
        },
        sleepHours: 7,
        targetSleep: 8,
        waterIntake: 6,
        targetWater: 8,
        favoriteThing: 'El momento de la mañana cuando tomo mi café y leo las noticias',
        dontLike: 'Hacer llamadas telefónicas largas o reuniones innecesarias',
        favoritePart: 'La tarde cuando puedo dedicar tiempo a mis hobbies',
        goalsTomorrow: [
          'Despertar 30 minutos más temprano',
          'Hacer una caminata al aire libre',
          'Cocinar una nueva receta saludable',
          'Dedicar tiempo a la escritura creativa'
        ],
        notes: [
          'Hoy me sentí muy productivo y enfocado',
          'La meditación me ayudó mucho a mantener la calma',
          'Necesito mejorar mi hidratación durante el día',
          'El ejercicio me dio mucha energía para el resto del día'
        ],
        selfCareActivities: ['Meditación', 'Ejercicio', 'Lectura', 'Organización'],
        energyLevel: 8,
        stressLevel: 3,
        satisfactionLevel: 9
      },
      {
        id: '2',
        date: '2024-01-14',
        dayOfWeek: 'Domingo',
        mood: '😌',
        moodText: 'Relajado',
        moodColor: '#2196F3',
        priority: 'Media',
        priorityColor: '#FF9800',
        todo: [
          'Dormir hasta tarde',
          'Desayuno relajado con mi pareja',
          'Caminata en el parque',
          'Tiempo de lectura',
          'Preparar la ropa para la semana',
          'Ver una película'
        ],
        completedTasks: 5,
        totalTasks: 6,
        workout: {
          type: 'Caminata',
          duration: '30 minutos',
          intensity: 'Baja',
          exercises: ['Caminar', 'Estiramientos']
        },
        sleepHours: 9,
        targetSleep: 8,
        waterIntake: 7,
        targetWater: 8,
        favoriteThing: 'Los domingos tranquilos en casa con mi pareja',
        dontLike: 'Tener que hacer tareas domésticas pesadas',
        favoritePart: 'La mañana cuando no hay prisa y puedo desayunar tranquilo',
        goalsTomorrow: [
          'Preparar todo para la semana laboral',
          'Hacer una lista de objetivos semanales',
          'Dormir temprano para empezar bien la semana',
          'Meditar antes de dormir'
        ],
        notes: [
          'Domingo perfecto para recargar energías',
          'La caminata me llenó de paz y tranquilidad',
          'Me siento preparado para la semana que viene',
          'Es importante mantener este equilibrio'
        ],
        selfCareActivities: ['Descanso', 'Caminata', 'Lectura', 'Relajación'],
        energyLevel: 7,
        stressLevel: 1,
        satisfactionLevel: 10
      },
      {
        id: '3',
        date: '2024-01-13',
        dayOfWeek: 'Sábado',
        mood: '🤔',
        moodText: 'Reflexivo',
        moodColor: '#FF9800',
        priority: 'Baja',
        priorityColor: '#4CAF50',
        todo: [
          'Reflexionar sobre la semana',
          'Escribir en mi diario personal',
          'Hacer una llamada a un amigo',
          'Revisar mis objetivos del año',
          'Hacer una limpieza profunda del hogar',
          'Dedicar tiempo a mi hobby favorito'
        ],
        completedTasks: 4,
        totalTasks: 6,
        workout: {
          type: 'Yoga',
          duration: '25 minutos',
          intensity: 'Media',
          exercises: ['Yoga', 'Respiración', 'Meditación']
        },
        sleepHours: 6,
        targetSleep: 8,
        waterIntake: 5,
        targetWater: 8,
        favoriteThing: 'Los momentos de reflexión y autoconocimiento',
        dontLike: 'Tener que tomar decisiones importantes bajo presión',
        favoritePart: 'La noche cuando puedo reflexionar sobre el día',
        goalsTomorrow: [
          'Disfrutar del día de descanso',
          'Hacer algo que me guste sin presión',
          'Conectar con la naturaleza',
          'Prepararme mentalmente para la semana'
        ],
        notes: [
          'Día de mucha reflexión y autoevaluación',
          'A veces me siento abrumado por mis objetivos',
          'Mis amigos me ayudaron a poner las cosas en perspectiva',
          'Es importante no ser tan duro conmigo mismo'
        ],
        selfCareActivities: ['Reflexión', 'Escritura', 'Yoga', 'Autocuidado'],
        energyLevel: 5,
        stressLevel: 6,
        satisfactionLevel: 7
      }
    ];

    // Calcular estadísticas del planificador
    const getPlannerStats = () => {
      const totalPlans = sampleSelfCarePlans.length;
      const totalTasks = sampleSelfCarePlans.reduce((sum, plan) => sum + plan.totalTasks, 0);
      const completedTasks = sampleSelfCarePlans.reduce((sum, plan) => sum + plan.completedTasks, 0);
      const avgEnergyLevel = Math.round(sampleSelfCarePlans.reduce((sum, plan) => sum + plan.energyLevel, 0) / totalPlans);
      const avgSatisfactionLevel = Math.round(sampleSelfCarePlans.reduce((sum, plan) => sum + plan.satisfactionLevel, 0) / totalPlans);
      const avgSleepHours = Math.round(sampleSelfCarePlans.reduce((sum, plan) => sum + plan.sleepHours, 0) / totalPlans);
      const avgWaterIntake = Math.round(sampleSelfCarePlans.reduce((sum, plan) => sum + plan.waterIntake, 0) / totalPlans);
      
      return { 
        totalPlans, 
        totalTasks, 
        completedTasks, 
        avgEnergyLevel, 
        avgSatisfactionLevel, 
        avgSleepHours, 
        avgWaterIntake 
      };
    };

    // Obtener color según el nivel de energía
    const getEnergyColor = (level) => {
      if (level >= 8) return '#4CAF50';
      if (level >= 6) return '#FF9800';
      if (level >= 4) return '#FFC107';
      return '#F44336';
    };

    // Obtener color según el nivel de satisfacción
    const getSatisfactionColor = (level) => {
      if (level >= 8) return '#4CAF50';
      if (level >= 6) return '#FF9800';
      if (level >= 4) return '#FFC107';
      return '#F44336';
    };

    // Obtener color según la prioridad
    const getPriorityColor = (priority) => {
      switch (priority) {
        case 'Alta': return '#F44336';
        case 'Media': return '#FF9800';
        case 'Baja': return '#4CAF50';
        default: return '#6B7280';
      }
    };

    // Obtener emoji según el estado de ánimo
    const getMoodEmoji = (mood) => {
      const moodMap = {
        '😊': 'Energético',
        '😌': 'Relajado',
        '🤔': 'Reflexivo',
        '😔': 'Triste',
        '😤': 'Enojado',
        '😴': 'Cansado',
        '🤗': 'Agradecido',
        '😎': 'Confianza'
      };
      return moodMap[mood] || 'Neutral';
    };

    const plannerStats = getPlannerStats();

    return (
      <ScrollView style={styles.plannerContainer} showsVerticalScrollIndicator={false}>
        {/* Header mejorado */}
        <View style={styles.plannerHeader}>
          <View style={styles.plannerHeaderContent}>
            <View style={styles.plannerHeaderIcon}>
              <Icon name="calendar" size={28} color="#FFFFFF" />
            </View>
            <View style={styles.plannerHeaderText}>
              <Text style={styles.plannerHeaderTitle}>Planificador de Cuidado Personal</Text>
              <Text style={styles.plannerHeaderSubtitle}>
                Organiza tu día y cuida tu bienestar
              </Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.plannerAddButton}
            onPress={openAddSelfCareModal}
          >
            <Icon name="add" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

        {/* Panel de estadísticas del planificador */}
        <View style={styles.plannerStatsPanel}>
          <View style={styles.plannerStatsContent}>
            <Text style={styles.plannerStatsTitle}>
              📋 Tu Progreso Esta Semana
            </Text>
            <Text style={styles.plannerStatsSubtitle}>
              {plannerStats.completedTasks} de {plannerStats.totalTasks} tareas completadas
            </Text>
        </View>
          <View style={styles.plannerStatsGrid}>
            <View style={styles.plannerStatCard}>
              <View style={styles.plannerStatIcon}>
                <Icon name="flash" size={20} color="#FF9800" />
              </View>
              <Text style={styles.plannerStatNumber}>{plannerStats.avgEnergyLevel}/10</Text>
              <Text style={styles.plannerStatLabel}>Energía</Text>
            </View>
            <View style={styles.plannerStatCard}>
              <View style={styles.plannerStatIcon}>
                <Icon name="heart" size={20} color="#E91E63" />
              </View>
              <Text style={styles.plannerStatNumber}>{plannerStats.avgSatisfactionLevel}/10</Text>
              <Text style={styles.plannerStatLabel}>Satisfacción</Text>
            </View>
            <View style={styles.plannerStatCard}>
              <View style={styles.plannerStatIcon}>
                <Icon name="moon" size={20} color="#9C27B0" />
              </View>
              <Text style={styles.plannerStatNumber}>{plannerStats.avgSleepHours}h</Text>
              <Text style={styles.plannerStatLabel}>Sueño</Text>
            </View>
            <View style={styles.plannerStatCard}>
              <View style={styles.plannerStatIcon}>
                <Icon name="water" size={20} color="#2196F3" />
              </View>
              <Text style={styles.plannerStatNumber}>{plannerStats.avgWaterIntake}/8</Text>
              <Text style={styles.plannerStatLabel}>Agua</Text>
            </View>
                </View>
              </View>
              
        {/* Lista de planes de cuidado personal */}
        <View style={styles.plannerPlansContainer}>
          <Text style={styles.plannerPlansTitle}>Mis Planes de Cuidado Personal</Text>
          {sampleSelfCarePlans.map((plan) => (
            <View key={plan.id} style={styles.plannerPlanCard}>
              {/* Header del plan */}
              <View style={styles.plannerPlanHeader}>
                <View style={styles.plannerPlanHeaderLeft}>
                  <View style={styles.plannerPlanDateInfo}>
                    <Text style={styles.plannerPlanDate}>{plan.date}</Text>
                    <Text style={styles.plannerPlanDay}>{plan.dayOfWeek}</Text>
                  </View>
                  <View style={[styles.plannerPlanPriority, { backgroundColor: plan.priorityColor }]}>
                    <Text style={styles.plannerPlanPriorityText}>{plan.priority}</Text>
                  </View>
                </View>
                <View style={[styles.plannerPlanMood, { backgroundColor: plan.moodColor }]}>
                  <Text style={styles.plannerPlanMoodEmoji}>{plan.mood}</Text>
                  <Text style={styles.plannerPlanMoodText}>{plan.moodText}</Text>
                </View>
              </View>

              {/* Indicadores de bienestar */}
              <View style={styles.plannerPlanWellness}>
                <View style={styles.plannerPlanWellnessItem}>
                  <Icon name="flash" size={16} color={getEnergyColor(plan.energyLevel)} />
                  <Text style={styles.plannerPlanWellnessText}>Energía: {plan.energyLevel}/10</Text>
                </View>
                <View style={styles.plannerPlanWellnessItem}>
                  <Icon name="heart" size={16} color={getSatisfactionColor(plan.satisfactionLevel)} />
                  <Text style={styles.plannerPlanWellnessText}>Satisfacción: {plan.satisfactionLevel}/10</Text>
                </View>
                <View style={styles.plannerPlanWellnessItem}>
                  <Icon name="trending-up" size={16} color="#4CAF50" />
                  <Text style={styles.plannerPlanWellnessText}>Progreso: {plan.completedTasks}/{plan.totalTasks}</Text>
                </View>
              </View>

              {/* Progreso de tareas */}
              <View style={styles.plannerPlanProgress}>
                <View style={styles.plannerPlanProgressBar}>
                  <View 
                    style={[
                      styles.plannerPlanProgressFill,
                      { 
                        width: `${Math.round((plan.completedTasks / plan.totalTasks) * 100)}%`,
                        backgroundColor: plan.moodColor
                      }
                    ]}
                  />
                </View>
                <Text style={styles.plannerPlanProgressText}>
                  {Math.round((plan.completedTasks / plan.totalTasks) * 100)}%
                </Text>
              </View>

              {/* Contenido principal */}
              <View style={styles.plannerPlanContent}>
                {/* Columna izquierda */}
                <View style={styles.plannerPlanColumn}>
                  {/* Tareas por hacer */}
                  <View style={styles.plannerPlanSection}>
                    <View style={styles.plannerPlanSectionHeader}>
                      <Icon name="list" size={20} color="#2196F3" />
                      <Text style={styles.plannerPlanSectionTitle}>Por Hacer</Text>
                    </View>
                    <View style={styles.plannerPlanList}>
                  {plan.todo.map((item, index) => (
                        <View key={index} style={styles.plannerPlanListItem}>
                          <Icon name="ellipse-outline" size={16} color="#6B7280" />
                          <Text style={styles.plannerPlanListItemText}>{item}</Text>
                    </View>
                  ))}
                    </View>
                  </View>

                  {/* Ejercicio */}
                  <View style={styles.plannerPlanSection}>
                    <View style={styles.plannerPlanSectionHeader}>
                      <Icon name="fitness" size={20} color="#4CAF50" />
                      <Text style={styles.plannerPlanSectionTitle}>Ejercicio</Text>
                    </View>
                    <View style={styles.plannerPlanWorkout}>
                      <Text style={styles.plannerPlanWorkoutType}>{plan.workout.type}</Text>
                      <Text style={styles.plannerPlanWorkoutDuration}>{plan.workout.duration}</Text>
                      <Text style={styles.plannerPlanWorkoutIntensity}>Intensidad: {plan.workout.intensity}</Text>
                      <View style={styles.plannerPlanWorkoutExercises}>
                        {plan.workout.exercises.map((exercise, index) => (
                          <View key={index} style={styles.plannerPlanWorkoutExercise}>
                            <Text style={styles.plannerPlanWorkoutExerciseText}>{exercise}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  </View>
                </View>

                {/* Columna derecha */}
                <View style={styles.plannerPlanColumn}>
                  {/* Sueño */}
                  <View style={styles.plannerPlanSection}>
                    <View style={styles.plannerPlanSectionHeader}>
                      <Icon name="moon" size={20} color="#9C27B0" />
                      <Text style={styles.plannerPlanSectionTitle}>Sueño</Text>
                    </View>
                    <View style={styles.plannerPlanSleep}>
                      <View style={styles.plannerPlanSleepIcons}>
                    {[...Array(8)].map((_, index) => (
                      <Icon
                        key={index}
                        name={index < plan.sleepHours ? 'moon' : 'moon-outline'}
                        size={20}
                            color={index < plan.sleepHours ? '#9C27B0' : '#D1D5DB'}
                      />
                    ))}
                      </View>
                      <Text style={styles.plannerPlanSleepText}>
                        {plan.sleepHours}/{plan.targetSleep} horas
                      </Text>
                    </View>
                  </View>
                  
                  {/* Hidratación */}
                  <View style={styles.plannerPlanSection}>
                    <View style={styles.plannerPlanSectionHeader}>
                      <Icon name="water" size={20} color="#2196F3" />
                      <Text style={styles.plannerPlanSectionTitle}>Hidratación</Text>
                    </View>
                    <View style={styles.plannerPlanWater}>
                      <View style={styles.plannerPlanWaterIcons}>
                    {[...Array(8)].map((_, index) => (
                      <Icon
                        key={index}
                        name={index < plan.waterIntake ? 'water' : 'water-outline'}
                        size={20}
                            color={index < plan.waterIntake ? '#2196F3' : '#D1D5DB'}
                      />
                    ))}
                      </View>
                      <Text style={styles.plannerPlanWaterText}>
                        {plan.waterIntake}/{plan.targetWater} vasos
                      </Text>
                    </View>
                  </View>
                  </View>
                </View>

              {/* Secciones adicionales */}
              <View style={styles.plannerPlanAdditional}>
                {/* Cosas favoritas */}
                <View style={styles.plannerPlanSection}>
                  <View style={styles.plannerPlanSectionHeader}>
                    <Icon name="heart" size={20} color="#E91E63" />
                    <Text style={styles.plannerPlanSectionTitle}>¿Cuál es tu cosa favorita?</Text>
                  </View>
                  <Text style={styles.plannerPlanText}>{plan.favoriteThing}</Text>
                </View>

                {/* Lo que no te gusta */}
                <View style={styles.plannerPlanSection}>
                  <View style={styles.plannerPlanSectionHeader}>
                    <Icon name="thumbs-down" size={20} color="#F44336" />
                    <Text style={styles.plannerPlanSectionTitle}>¿Qué no te gusta hacer?</Text>
                  </View>
                  <Text style={styles.plannerPlanText}>{plan.dontLike}</Text>
                </View>

                {/* Parte favorita del día */}
                <View style={styles.plannerPlanSection}>
                  <View style={styles.plannerPlanSectionHeader}>
                    <Icon name="star" size={20} color="#FFC107" />
                    <Text style={styles.plannerPlanSectionTitle}>Tu parte favorita del día</Text>
                  </View>
                  <Text style={styles.plannerPlanText}>{plan.favoritePart}</Text>
                </View>

                {/* Objetivos para mañana */}
                <View style={styles.plannerPlanSection}>
                  <View style={styles.plannerPlanSectionHeader}>
                    <Icon name="target" size={20} color="#4CAF50" />
                    <Text style={styles.plannerPlanSectionTitle}>Objetivos para mañana</Text>
                  </View>
                  <View style={styles.plannerPlanList}>
                    {plan.goalsTomorrow.map((goal, index) => (
                      <View key={index} style={styles.plannerPlanListItem}>
                        <Icon name="arrow-forward" size={16} color="#4CAF50" />
                        <Text style={styles.plannerPlanListItemText}>{goal}</Text>
                      </View>
                  ))}
                </View>
              </View>
              
                {/* Actividades de cuidado personal */}
                <View style={styles.plannerPlanSection}>
                  <View style={styles.plannerPlanSectionHeader}>
                    <Icon name="leaf" size={20} color="#4CAF50" />
                    <Text style={styles.plannerPlanSectionTitle}>Actividades de Cuidado Personal</Text>
                  </View>
                  <View style={styles.plannerPlanTags}>
                    {plan.selfCareActivities.map((activity, index) => (
                      <View key={index} style={styles.plannerPlanTag}>
                        <Text style={styles.plannerPlanTagText}>{activity}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Notas */}
                <View style={styles.plannerPlanSection}>
                  <View style={styles.plannerPlanSectionHeader}>
                    <Icon name="document-text" size={20} color="#6B7280" />
                    <Text style={styles.plannerPlanSectionTitle}>Notas</Text>
                  </View>
                  <View style={styles.plannerPlanList}>
                {plan.notes.map((note, index) => (
                      <View key={index} style={styles.plannerPlanListItem}>
                        <Icon name="ellipse-outline" size={16} color="#6B7280" />
                        <Text style={styles.plannerPlanListItemText}>{note}</Text>
                  </View>
                ))}
                  </View>
                </View>
              </View>

              {/* Footer con acciones */}
              <View style={styles.plannerPlanFooter}>
                <View style={styles.plannerPlanActions}>
                  <TouchableOpacity style={styles.plannerPlanAction}>
                    <Icon name="create-outline" size={16} color="#2196F3" />
                    <Text style={styles.plannerPlanActionText}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.plannerPlanAction}>
                    <Icon name="copy-outline" size={16} color="#4CAF50" />
                    <Text style={styles.plannerPlanActionText}>Copiar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.plannerPlanAction}>
                    <Icon name="share-outline" size={16} color="#FF9800" />
                    <Text style={styles.plannerPlanActionText}>Compartir</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Botones de acción */}
        <View style={styles.plannerActions}>
          <TouchableOpacity style={styles.plannerActionButton}>
            <Icon name="add-circle" size={20} color="#2196F3" />
            <Text style={styles.plannerActionText}>Nuevo Plan</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.plannerActionButton}>
            <Icon name="analytics" size={20} color="#4CAF50" />
            <Text style={styles.plannerActionText}>Ver Estadísticas</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.plannerActionButton}>
            <Icon name="download" size={20} color="#FF9800" />
            <Text style={styles.plannerActionText}>Exportar</Text>
          </TouchableOpacity>
        </View>
        </ScrollView>
    );
  };

  // Funciones de renderizado para las subsecciones del habit tracker
  const renderMonthlyHabitLog = () => {
    // Datos de ejemplo para el registro mensual de hábitos
    const sampleMonthlyHabits = {
      week1: [
        {
          id: '1',
          text: 'Meditación matutina',
          category: 'Bienestar Mental',
          color: '#4CAF50',
          completed: [true, true, false, true, true, false, true],
          streak: 3,
          totalDays: 7,
          priority: 'Alta'
        },
        {
          id: '2',
          text: 'Ejercicio 30 min',
          category: 'Fitness',
          color: '#2196F3',
          completed: [true, false, true, true, false, true, false],
          streak: 2,
          totalDays: 7,
          priority: 'Alta'
        },
        {
          id: '3',
          text: 'Leer 20 páginas',
          category: 'Desarrollo Personal',
          color: '#FF9800',
          completed: [false, true, true, false, true, true, true],
          streak: 4,
          totalDays: 7,
          priority: 'Media'
        },
        {
          id: '4',
          text: 'Beber 8 vasos de agua',
          category: 'Salud',
          color: '#9C27B0',
          completed: [true, true, true, true, false, true, true],
          streak: 6,
          totalDays: 7,
          priority: 'Alta'
        }
      ],
      week2: [
        {
          id: '5',
          text: 'Meditación matutina',
          category: 'Bienestar Mental',
          color: '#4CAF50',
          completed: [true, true, true, false, true, true, true],
          streak: 5,
          totalDays: 7,
          priority: 'Alta'
        },
        {
          id: '6',
          text: 'Ejercicio 30 min',
          category: 'Fitness',
          color: '#2196F3',
          completed: [true, true, false, true, true, false, true],
          streak: 3,
          totalDays: 7,
          priority: 'Alta'
        },
        {
          id: '7',
          text: 'Leer 20 páginas',
          category: 'Desarrollo Personal',
          color: '#FF9800',
          completed: [true, false, true, true, true, false, true],
          streak: 4,
          totalDays: 7,
          priority: 'Media'
        },
        {
          id: '8',
          text: 'Beber 8 vasos de agua',
          category: 'Salud',
          color: '#9C27B0',
          completed: [true, true, true, true, true, true, false],
          streak: 6,
          totalDays: 7,
          priority: 'Alta'
        }
      ],
      week3: [
        {
          id: '9',
          text: 'Meditación matutina',
          category: 'Bienestar Mental',
          color: '#4CAF50',
          completed: [false, true, true, true, true, false, true],
          streak: 4,
          totalDays: 7,
          priority: 'Alta'
        },
        {
          id: '10',
          text: 'Ejercicio 30 min',
          category: 'Fitness',
          color: '#2196F3',
          completed: [true, true, true, false, true, true, true],
          streak: 5,
          totalDays: 7,
          priority: 'Alta'
        },
        {
          id: '11',
          text: 'Leer 20 páginas',
          category: 'Desarrollo Personal',
          color: '#FF9800',
          completed: [true, true, false, true, true, true, false],
          streak: 4,
          totalDays: 7,
          priority: 'Media'
        },
        {
          id: '12',
          text: 'Beber 8 vasos de agua',
          category: 'Salud',
          color: '#9C27B0',
          completed: [true, true, true, true, true, false, true],
          streak: 6,
          totalDays: 7,
          priority: 'Alta'
        }
      ],
      week4: [
        {
          id: '13',
          text: 'Meditación matutina',
          category: 'Bienestar Mental',
          color: '#4CAF50',
          completed: [true, false, true, true, true, true, false],
          streak: 4,
          totalDays: 7,
          priority: 'Alta'
        },
        {
          id: '14',
          text: 'Ejercicio 30 min',
          category: 'Fitness',
          color: '#2196F3',
          completed: [true, true, false, true, true, true, true],
          streak: 5,
          totalDays: 7,
          priority: 'Alta'
        },
        {
          id: '15',
          text: 'Leer 20 páginas',
          category: 'Desarrollo Personal',
          color: '#FF9800',
          completed: [false, true, true, true, false, true, true],
          streak: 4,
          totalDays: 7,
          priority: 'Media'
        },
        {
          id: '16',
          text: 'Beber 8 vasos de agua',
          category: 'Salud',
          color: '#9C27B0',
          completed: [true, true, true, true, true, true, true],
          streak: 7,
          totalDays: 7,
          priority: 'Alta'
        }
      ]
    };

    // Calcular estadísticas del mes
    const getMonthlyStats = () => {
      const allHabits = Object.values(sampleMonthlyHabits).flat();
      const totalHabits = allHabits.length;
      const totalDays = allHabits.reduce((sum, habit) => sum + habit.totalDays, 0);
      const completedDays = allHabits.reduce((sum, habit) => sum + habit.completed.filter(Boolean).length, 0);
      const avgStreak = Math.round(allHabits.reduce((sum, habit) => sum + habit.streak, 0) / totalHabits);
      const perfectHabits = allHabits.filter(habit => habit.streak === habit.totalDays).length;
      const completionRate = Math.round((completedDays / totalDays) * 100);
      
      return { totalHabits, totalDays, completedDays, avgStreak, perfectHabits, completionRate };
    };

    // Obtener color según la prioridad
    const getPriorityColor = (priority) => {
      switch (priority) {
        case 'Alta': return '#F44336';
        case 'Media': return '#FF9800';
        case 'Baja': return '#4CAF50';
        default: return '#6B7280';
      }
    };

    // Obtener color según la categoría
    const getCategoryColor = (category) => {
      const colorMap = {
        'Bienestar Mental': '#4CAF50',
        'Fitness': '#2196F3',
        'Desarrollo Personal': '#FF9800',
        'Salud': '#9C27B0',
        'Productividad': '#E91E63',
        'Relaciones': '#FFC107',
        'Creatividad': '#00BCD4',
        'Finanzas': '#795548'
      };
      return colorMap[category] || '#6B7280';
    };

    // Obtener emoji según la categoría
    const getCategoryEmoji = (category) => {
      const emojiMap = {
        'Bienestar Mental': '🧘',
        'Fitness': '💪',
        'Desarrollo Personal': '📚',
        'Salud': '💧',
        'Productividad': '⚡',
        'Relaciones': '❤️',
        'Creatividad': '🎨',
        'Finanzas': '💰'
      };
      return emojiMap[category] || '📝';
    };

    const monthlyStats = getMonthlyStats();

    return (
      <ScrollView style={styles.habitLogContainer} showsVerticalScrollIndicator={false}>
        {/* Header mejorado */}
        <View style={styles.habitLogHeader}>
          <View style={styles.habitLogHeaderContent}>
            <View style={styles.habitLogHeaderIcon}>
              <Icon name="calendar" size={28} color="#FFFFFF" />
    </View>
            <View style={styles.habitLogHeaderText}>
              <Text style={styles.habitLogHeaderTitle}>Registro Mensual de Hábitos</Text>
              <Text style={styles.habitLogHeaderSubtitle}>
                Construye hábitos positivos día a día
              </Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.habitLogAddButton}
            onPress={() => {}}
          >
            <Icon name="add" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Panel de estadísticas del mes */}
        <View style={styles.habitLogStatsPanel}>
          <View style={styles.habitLogStatsContent}>
            <Text style={styles.habitLogStatsTitle}>
              📊 Tu Progreso Este Mes
            </Text>
            <Text style={styles.habitLogStatsSubtitle}>
              {monthlyStats.completedDays} de {monthlyStats.totalDays} días completados
            </Text>
          </View>
          <View style={styles.habitLogStatsGrid}>
            <View style={styles.habitLogStatCard}>
              <View style={styles.habitLogStatIcon}>
                <Icon name="trending-up" size={20} color="#4CAF50" />
              </View>
              <Text style={styles.habitLogStatNumber}>{monthlyStats.completionRate}%</Text>
              <Text style={styles.habitLogStatLabel}>Completado</Text>
            </View>
            <View style={styles.habitLogStatCard}>
              <View style={styles.habitLogStatIcon}>
                <Icon name="flame" size={20} color="#FF9800" />
              </View>
              <Text style={styles.habitLogStatNumber}>{monthlyStats.avgStreak}</Text>
              <Text style={styles.habitLogStatLabel}>Racha Promedio</Text>
            </View>
            <View style={styles.habitLogStatCard}>
              <View style={styles.habitLogStatIcon}>
                <Icon name="trophy" size={20} color="#FFC107" />
              </View>
              <Text style={styles.habitLogStatNumber}>{monthlyStats.perfectHabits}</Text>
              <Text style={styles.habitLogStatLabel}>Hábitos Perfectos</Text>
            </View>
            <View style={styles.habitLogStatCard}>
              <View style={styles.habitLogStatIcon}>
                <Icon name="list" size={20} color="#2196F3" />
              </View>
              <Text style={styles.habitLogStatNumber}>{monthlyStats.totalHabits}</Text>
              <Text style={styles.habitLogStatLabel}>Hábitos Activos</Text>
            </View>
          </View>
        </View>

        {/* Lista de semanas */}
        <View style={styles.habitLogWeeksContainer}>
          {['week1', 'week2', 'week3', 'week4'].map((week, weekIndex) => (
            <View key={week} style={styles.habitLogWeekSection}>
              {/* Header de la semana */}
              <View style={styles.habitLogWeekHeader}>
                <View style={styles.habitLogWeekHeaderLeft}>
                  <Text style={styles.habitLogWeekTitle}>Semana {weekIndex + 1}</Text>
                  <Text style={styles.habitLogWeekSubtitle}>
                    {sampleMonthlyHabits[week].length} hábitos • {sampleMonthlyHabits[week].reduce((sum, habit) => sum + habit.completed.filter(Boolean).length, 0)} completados
                  </Text>
                </View>
                <View style={styles.habitLogWeekProgress}>
                  <Text style={styles.habitLogWeekProgressText}>
                    {Math.round((sampleMonthlyHabits[week].reduce((sum, habit) => sum + habit.completed.filter(Boolean).length, 0) / (sampleMonthlyHabits[week].length * 7)) * 100)}%
                  </Text>
                </View>
              </View>

              {/* Header de días */}
              <View style={styles.habitLogDaysHeader}>
                <Text style={styles.habitLogHabitLabel}>Hábito</Text>
                <View style={styles.habitLogDaysContainer}>
                  <Text style={styles.habitLogDayLabel}>L</Text>
                  <Text style={styles.habitLogDayLabel}>M</Text>
                  <Text style={styles.habitLogDayLabel}>X</Text>
                  <Text style={styles.habitLogDayLabel}>J</Text>
                  <Text style={styles.habitLogDayLabel}>V</Text>
                  <Text style={styles.habitLogDayLabel}>S</Text>
                  <Text style={styles.habitLogDayLabel}>D</Text>
                </View>
              </View>

              {/* Lista de hábitos */}
              {sampleMonthlyHabits[week].map((habit) => (
                <View key={habit.id} style={styles.habitLogHabitRow}>
                  {/* Información del hábito */}
                  <View style={styles.habitLogHabitInfo}>
                    <View style={styles.habitLogHabitHeader}>
                      <View style={styles.habitLogHabitCategory}>
                        <Text style={styles.habitLogHabitCategoryEmoji}>
                          {getCategoryEmoji(habit.category)}
                        </Text>
                        <Text style={styles.habitLogHabitCategoryText}>
                          {habit.category}
                        </Text>
                      </View>
                      <View style={[styles.habitLogHabitPriority, { backgroundColor: getPriorityColor(habit.priority) }]}>
                        <Text style={styles.habitLogHabitPriorityText}>{habit.priority}</Text>
                      </View>
                    </View>
                    <Text style={styles.habitLogHabitText}>{habit.text}</Text>
                    <View style={styles.habitLogHabitStats}>
                      <View style={styles.habitLogHabitStat}>
                        <Icon name="flame" size={14} color="#FF9800" />
                        <Text style={styles.habitLogHabitStatText}>Racha: {habit.streak}</Text>
                      </View>
                      <View style={styles.habitLogHabitStat}>
                        <Icon name="checkmark-circle" size={14} color="#4CAF50" />
                        <Text style={styles.habitLogHabitStatText}>
                          {habit.completed.filter(Boolean).length}/{habit.totalDays}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Checkboxes de días */}
                  <View style={styles.habitLogCheckboxesContainer}>
                    {habit.completed.map((completed, dayIndex) => (
                      <TouchableOpacity
                        key={dayIndex}
                        style={[
                          styles.habitLogCheckbox,
                          { backgroundColor: completed ? habit.color : '#F3F4F6' }
                        ]}
                        onPress={() => {}}
                      >
                        <Icon
                          name={completed ? 'checkmark' : 'close'}
                          size={16}
                          color={completed ? '#FFFFFF' : '#9CA3AF'}
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          ))}
        </View>

        {/* Botones de acción */}
        <View style={styles.habitLogActions}>
          <TouchableOpacity style={styles.habitLogActionButton}>
            <Icon name="add-circle" size={20} color="#4CAF50" />
            <Text style={styles.habitLogActionText}>Nuevo Hábito</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.habitLogActionButton}>
            <Icon name="analytics" size={20} color="#2196F3" />
            <Text style={styles.habitLogActionText}>Ver Estadísticas</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.habitLogActionButton}>
            <Icon name="download" size={20} color="#FF9800" />
            <Text style={styles.habitLogActionText}>Exportar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  const renderHabitGoalTracker = () => {
    // Datos de ejemplo para el seguimiento de hábitos y objetivos
    const sampleHabitGoals = {
      goals: [
        {
          id: '1',
          title: 'Ejercicio diario',
          description: 'Hacer 30 minutos de ejercicio todos los días',
          category: 'Fitness',
          priority: 'Alta',
          targetDays: 30,
          completedDays: 18,
          startDate: '2024-01-01',
          endDate: '2024-01-31',
          status: 'En Progreso',
          color: '#2196F3'
        },
        {
          id: '2',
          title: 'Meditación matutina',
          description: 'Meditar 15 minutos cada mañana',
          category: 'Bienestar Mental',
          priority: 'Alta',
          targetDays: 30,
          completedDays: 25,
          startDate: '2024-01-01',
          endDate: '2024-01-31',
          status: 'En Progreso',
          color: '#4CAF50'
        },
        {
          id: '3',
          title: 'Leer 1 hora diaria',
          description: 'Dedicar 1 hora a la lectura personal',
          category: 'Desarrollo Personal',
          priority: 'Media',
          targetDays: 30,
          completedDays: 12,
          startDate: '2024-01-01',
          endDate: '2024-01-31',
          status: 'En Progreso',
          color: '#FF9800'
        },
        {
          id: '4',
          title: 'Beber 8 vasos de agua',
          description: 'Mantener una hidratación adecuada',
          category: 'Salud',
          priority: 'Alta',
          targetDays: 30,
          completedDays: 28,
          startDate: '2024-01-01',
          endDate: '2024-01-31',
          status: 'En Progreso',
          color: '#9C27B0'
        },
        {
          id: '5',
          title: 'Escribir en el diario',
          description: 'Reflexionar y escribir en el diario personal',
          category: 'Bienestar Mental',
          priority: 'Media',
          targetDays: 30,
          completedDays: 15,
          startDate: '2024-01-01',
          endDate: '2024-01-31',
          status: 'En Progreso',
          color: '#E91E63'
        }
      ],
      achievements: [
        {
          id: '1',
          title: 'Primera semana completa',
          description: 'Completé todos mis hábitos durante 7 días seguidos',
          date: '2024-01-07',
          category: 'Consistencia',
          color: '#4CAF50'
        },
        {
          id: '2',
          title: 'Racha de 10 días',
          description: 'Mantuve mi hábito de ejercicio por 10 días consecutivos',
          date: '2024-01-15',
          category: 'Fitness',
          color: '#2196F3'
        },
        {
          id: '3',
          title: 'Meta de hidratación',
          description: 'Logré beber 8 vasos de agua por 20 días seguidos',
          date: '2024-01-20',
          category: 'Salud',
          color: '#9C27B0'
        }
      ],
      reminders: [
        {
          id: '1',
          title: 'Recordatorio de ejercicio',
          time: '07:00',
          days: ['L', 'M', 'X', 'J', 'V'],
          active: true
        },
        {
          id: '2',
          title: 'Recordatorio de meditación',
          time: '08:00',
          days: ['L', 'M', 'X', 'J', 'V', 'S', 'D'],
          active: true
        },
        {
          id: '3',
          title: 'Recordatorio de hidratación',
          time: 'Cada 2 horas',
          days: ['L', 'M', 'X', 'J', 'V', 'S', 'D'],
          active: true
        }
      ],
      notes: [
        'El ejercicio matutino me da mucha energía para el resto del día',
        'La meditación me ayuda a mantener la calma durante situaciones estresantes',
        'Necesito mejorar mi consistencia con la lectura',
        'La hidratación es clave para mi bienestar general'
      ]
    };

    // Calcular estadísticas generales
    const getOverallStats = () => {
      const totalGoals = sampleHabitGoals.goals.length;
      const totalTargetDays = sampleHabitGoals.goals.reduce((sum, goal) => sum + goal.targetDays, 0);
      const totalCompletedDays = sampleHabitGoals.goals.reduce((sum, goal) => sum + goal.completedDays, 0);
      const overallProgress = Math.round((totalCompletedDays / totalTargetDays) * 100);
      const activeGoals = sampleHabitGoals.goals.filter(goal => goal.status === 'En Progreso').length;
      const completedGoals = sampleHabitGoals.goals.filter(goal => goal.completedDays === goal.targetDays).length;
      const avgStreak = Math.round(sampleHabitGoals.goals.reduce((sum, goal) => sum + goal.completedDays, 0) / totalGoals);
      
      return { totalGoals, totalTargetDays, totalCompletedDays, overallProgress, activeGoals, completedGoals, avgStreak };
    };

    // Obtener color según la prioridad
    const getPriorityColor = (priority) => {
      switch (priority) {
        case 'Alta': return '#F44336';
        case 'Media': return '#FF9800';
        case 'Baja': return '#4CAF50';
        default: return '#6B7280';
      }
    };

    // Obtener color según la categoría
    const getCategoryColor = (category) => {
      const colorMap = {
        'Fitness': '#2196F3',
        'Bienestar Mental': '#4CAF50',
        'Desarrollo Personal': '#FF9800',
        'Salud': '#9C27B0',
        'Productividad': '#E91E63',
        'Relaciones': '#FFC107',
        'Creatividad': '#00BCD4',
        'Finanzas': '#795548'
      };
      return colorMap[category] || '#6B7280';
    };

    // Obtener emoji según la categoría
    const getCategoryEmoji = (category) => {
      const emojiMap = {
        'Fitness': '💪',
        'Bienestar Mental': '🧘',
        'Desarrollo Personal': '📚',
        'Salud': '💧',
        'Productividad': '⚡',
        'Relaciones': '❤️',
        'Creatividad': '🎨',
        'Finanzas': '💰'
      };
      return emojiMap[category] || '📝';
    };

    const overallStats = getOverallStats();

    return (
      <ScrollView style={styles.habitGoalContainer} showsVerticalScrollIndicator={false}>
        {/* Header mejorado */}
        <View style={styles.habitGoalHeader}>
          <View style={styles.habitGoalHeaderContent}>
            <View style={styles.habitGoalHeaderIcon}>
              <Icon name="target" size={28} color="#FFFFFF" />
            </View>
            <View style={styles.habitGoalHeaderText}>
              <Text style={styles.habitGoalHeaderTitle}>Seguimiento de Hábitos y Objetivos</Text>
              <Text style={styles.habitGoalHeaderSubtitle}>
                Alcanza tus metas paso a paso
              </Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.habitGoalAddButton}
            onPress={() => {}}
          >
            <Icon name="add" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Panel de estadísticas generales */}
        <View style={styles.habitGoalStatsPanel}>
          <View style={styles.habitGoalStatsContent}>
            <Text style={styles.habitGoalStatsTitle}>
              🎯 Tu Progreso General
            </Text>
            <Text style={styles.habitGoalStatsSubtitle}>
              {overallStats.totalCompletedDays} de {overallStats.totalTargetDays} días completados
            </Text>
          </View>
          <View style={styles.habitGoalStatsGrid}>
            <View style={styles.habitGoalStatCard}>
              <View style={styles.habitGoalStatIcon}>
                <Icon name="trending-up" size={20} color="#4CAF50" />
              </View>
              <Text style={styles.habitGoalStatNumber}>{overallStats.overallProgress}%</Text>
              <Text style={styles.habitGoalStatLabel}>Progreso</Text>
            </View>
            <View style={styles.habitGoalStatCard}>
              <View style={styles.habitGoalStatIcon}>
                <Icon name="list" size={20} color="#2196F3" />
              </View>
              <Text style={styles.habitGoalStatNumber}>{overallStats.activeGoals}</Text>
              <Text style={styles.habitGoalStatLabel}>Objetivos Activos</Text>
            </View>
            <View style={styles.habitGoalStatCard}>
              <View style={styles.habitGoalStatIcon}>
                <Icon name="trophy" size={20} color="#FFC107" />
              </View>
              <Text style={styles.habitGoalStatNumber}>{overallStats.completedGoals}</Text>
              <Text style={styles.habitGoalStatLabel}>Completados</Text>
            </View>
            <View style={styles.habitGoalStatCard}>
              <View style={styles.habitGoalStatIcon}>
                <Icon name="flame" size={20} color="#FF9800" />
              </View>
              <Text style={styles.habitGoalStatNumber}>{overallStats.avgStreak}</Text>
              <Text style={styles.habitGoalStatLabel}>Racha Promedio</Text>
            </View>
          </View>
        </View>

        {/* Lista de objetivos */}
        <View style={styles.habitGoalObjectivesContainer}>
          <Text style={styles.habitGoalObjectivesTitle}>Mis Objetivos</Text>
          {sampleHabitGoals.goals.map((goal) => (
            <View key={goal.id} style={styles.habitGoalObjectiveCard}>
              {/* Header del objetivo */}
              <View style={styles.habitGoalObjectiveHeader}>
                <View style={styles.habitGoalObjectiveHeaderLeft}>
                  <View style={styles.habitGoalObjectiveCategory}>
                    <Text style={styles.habitGoalObjectiveCategoryEmoji}>
                      {getCategoryEmoji(goal.category)}
                    </Text>
                    <Text style={styles.habitGoalObjectiveCategoryText}>
                      {goal.category}
                    </Text>
                  </View>
                  <View style={[styles.habitGoalObjectivePriority, { backgroundColor: getPriorityColor(goal.priority) }]}>
                    <Text style={styles.habitGoalObjectivePriorityText}>{goal.priority}</Text>
                  </View>
                </View>
                <View style={[styles.habitGoalObjectiveStatus, { backgroundColor: goal.color }]}>
                  <Text style={styles.habitGoalObjectiveStatusText}>{goal.status}</Text>
                </View>
              </View>

              {/* Información del objetivo */}
              <View style={styles.habitGoalObjectiveInfo}>
                <Text style={styles.habitGoalObjectiveTitle}>{goal.title}</Text>
                <Text style={styles.habitGoalObjectiveDescription}>{goal.description}</Text>
              </View>

              {/* Progreso del objetivo */}
              <View style={styles.habitGoalObjectiveProgress}>
                <View style={styles.habitGoalObjectiveProgressHeader}>
                  <Text style={styles.habitGoalObjectiveProgressLabel}>Progreso</Text>
                  <Text style={styles.habitGoalObjectiveProgressText}>
                    {goal.completedDays}/{goal.targetDays} días
                  </Text>
                </View>
                <View style={styles.habitGoalObjectiveProgressBar}>
                  <View 
                    style={[
                      styles.habitGoalObjectiveProgressFill,
                      { 
                        width: `${Math.round((goal.completedDays / goal.targetDays) * 100)}%`,
                        backgroundColor: goal.color
                      }
                    ]}
                  />
                </View>
                <Text style={styles.habitGoalObjectiveProgressPercentage}>
                  {Math.round((goal.completedDays / goal.targetDays) * 100)}%
                </Text>
              </View>

              {/* Fechas del objetivo */}
              <View style={styles.habitGoalObjectiveDates}>
                <View style={styles.habitGoalObjectiveDate}>
                  <Icon name="calendar" size={16} color="#6B7280" />
                  <Text style={styles.habitGoalObjectiveDateText}>
                    Inicio: {goal.startDate}
                  </Text>
                </View>
                <View style={styles.habitGoalObjectiveDate}>
                  <Icon name="flag" size={16} color="#6B7280" />
                  <Text style={styles.habitGoalObjectiveDateText}>
                    Meta: {goal.endDate}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Logros */}
        <View style={styles.habitGoalAchievementsContainer}>
          <Text style={styles.habitGoalAchievementsTitle}>Mis Logros</Text>
          {sampleHabitGoals.achievements.map((achievement) => (
            <View key={achievement.id} style={styles.habitGoalAchievementCard}>
              <View style={styles.habitGoalAchievementHeader}>
                <View style={[styles.habitGoalAchievementIcon, { backgroundColor: achievement.color }]}>
                  <Icon name="trophy" size={20} color="#FFFFFF" />
                </View>
                <View style={styles.habitGoalAchievementInfo}>
                  <Text style={styles.habitGoalAchievementTitle}>{achievement.title}</Text>
                  <Text style={styles.habitGoalAchievementDescription}>{achievement.description}</Text>
                  <Text style={styles.habitGoalAchievementDate}>{achievement.date}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Recordatorios */}
        <View style={styles.habitGoalRemindersContainer}>
          <Text style={styles.habitGoalRemindersTitle}>Recordatorios</Text>
          {sampleHabitGoals.reminders.map((reminder) => (
            <View key={reminder.id} style={styles.habitGoalReminderCard}>
              <View style={styles.habitGoalReminderHeader}>
                <View style={styles.habitGoalReminderIcon}>
                  <Icon name="alarm" size={20} color="#FF9800" />
                </View>
                <View style={styles.habitGoalReminderInfo}>
                  <Text style={styles.habitGoalReminderTitle}>{reminder.title}</Text>
                  <Text style={styles.habitGoalReminderTime}>{reminder.time}</Text>
                </View>
                <View style={styles.habitGoalReminderDays}>
                  {reminder.days.map((day, index) => (
                    <View key={index} style={styles.habitGoalReminderDay}>
                      <Text style={styles.habitGoalReminderDayText}>{day}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Notas */}
        <View style={styles.habitGoalNotesContainer}>
          <Text style={styles.habitGoalNotesTitle}>Notas Personales</Text>
          {sampleHabitGoals.notes.map((note, index) => (
            <View key={index} style={styles.habitGoalNoteCard}>
              <View style={styles.habitGoalNoteIcon}>
                <Icon name="document-text" size={16} color="#6B7280" />
              </View>
              <Text style={styles.habitGoalNoteText}>{note}</Text>
            </View>
          ))}
        </View>

        {/* Botones de acción */}
        <View style={styles.habitGoalActions}>
          <TouchableOpacity style={styles.habitGoalActionButton}>
            <Icon name="add-circle" size={20} color="#4CAF50" />
            <Text style={styles.habitGoalActionText}>Nuevo Objetivo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.habitGoalActionButton}>
            <Icon name="analytics" size={20} color="#2196F3" />
            <Text style={styles.habitGoalActionText}>Ver Estadísticas</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.habitGoalActionButton}>
            <Icon name="download" size={20} color="#FF9800" />
            <Text style={styles.habitGoalActionText}>Exportar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  const renderMoodTracker = () => {
    // Datos de ejemplo para el seguimiento del estado de ánimo
    const sampleMoodData = {
      currentMood: {
        mood: '😊',
        level: 4,
        description: 'Feliz',
        color: '#4CAF50',
        date: '2024-01-15',
        time: '14:30',
        activities: ['Ejercicio', 'Meditación', 'Trabajo'],
        notes: 'Me siento muy bien hoy, tuve un día productivo'
      },
      weeklyMoods: [
        { date: '2024-01-15', mood: '😊', level: 4, description: 'Feliz', color: '#4CAF50' },
        { date: '2024-01-14', mood: '😌', level: 3, description: 'Tranquilo', color: '#2196F3' },
        { date: '2024-01-13', mood: '😔', level: 2, description: 'Triste', color: '#FF9800' },
        { date: '2024-01-12', mood: '😊', level: 4, description: 'Feliz', color: '#4CAF50' },
        { date: '2024-01-11', mood: '😴', level: 1, description: 'Cansado', color: '#9E9E9E' },
        { date: '2024-01-10', mood: '😄', level: 5, description: 'Muy feliz', color: '#FFC107' },
        { date: '2024-01-09', mood: '😌', level: 3, description: 'Tranquilo', color: '#2196F3' }
      ],
      monthlyStats: {
        averageMood: 3.3,
        happyDays: 4,
        sadDays: 1,
        neutralDays: 2,
        totalDays: 7,
        mostCommonMood: '😊',
        moodTrend: 'Mejorando'
      },
      moodHistory: [
        { month: 'Enero', average: 3.2, color: '#4CAF50' },
        { month: 'Febrero', average: 3.5, color: '#2196F3' },
        { month: 'Marzo', average: 3.8, color: '#FF9800' },
        { month: 'Abril', average: 3.1, color: '#9C27B0' },
        { month: 'Mayo', average: 3.6, color: '#E91E63' },
        { month: 'Junio', average: 3.9, color: '#00BCD4' },
        { month: 'Julio', average: 4.1, color: '#4CAF50' },
        { month: 'Agosto', average: 3.7, color: '#FFC107' },
        { month: 'Septiembre', average: 3.4, color: '#FF5722' },
        { month: 'Octubre', average: 3.8, color: '#607D8B' },
        { month: 'Noviembre', average: 3.2, color: '#795548' },
        { month: 'Diciembre', average: 3.6, color: '#9E9E9E' }
      ],
      activities: [
        { name: 'Ejercicio', mood: '😊', frequency: 5, color: '#4CAF50' },
        { name: 'Meditación', mood: '😌', frequency: 4, color: '#2196F3' },
        { name: 'Trabajo', mood: '😐', frequency: 6, color: '#FF9800' },
        { name: 'Socializar', mood: '😄', frequency: 3, color: '#E91E63' },
        { name: 'Descanso', mood: '😴', frequency: 7, color: '#9E9E9E' }
      ],
      notes: [
        'El ejercicio matutino mejora significativamente mi estado de ánimo',
        'Los días de lluvia tienden a afectar mi energía',
        'La meditación me ayuda a mantener la calma',
        'Pasar tiempo con amigos siempre me pone de buen humor'
      ],
      yearMantra: 'Cada día es una nueva oportunidad para ser feliz y crecer'
    };

    // Obtener color según el nivel de ánimo
    const getMoodColor = (level) => {
      switch (level) {
        case 5: return '#FFC107'; // Muy feliz
        case 4: return '#4CAF50'; // Feliz
        case 3: return '#2196F3'; // Tranquilo
        case 2: return '#FF9800'; // Triste
        case 1: return '#9E9E9E'; // Cansado
        default: return '#E0E0E0';
      }
    };

    // Obtener emoji según el nivel de ánimo
    const getMoodEmoji = (level) => {
      switch (level) {
        case 5: return '😄';
        case 4: return '😊';
        case 3: return '😌';
        case 2: return '😔';
        case 1: return '😴';
        default: return '😐';
      }
    };

    // Obtener descripción según el nivel de ánimo
    const getMoodDescription = (level) => {
      switch (level) {
        case 5: return 'Muy feliz';
        case 4: return 'Feliz';
        case 3: return 'Tranquilo';
        case 2: return 'Triste';
        case 1: return 'Cansado';
        default: return 'Neutral';
      }
    };

    return (
      <ScrollView style={styles.moodTrackerContainer} showsVerticalScrollIndicator={false}>
        {/* Header mejorado */}
        <View style={styles.moodTrackerHeader}>
          <View style={styles.moodTrackerHeaderContent}>
            <View style={styles.moodTrackerHeaderIcon}>
              <Icon name="heart" size={28} color="#FFFFFF" />
            </View>
            <View style={styles.moodTrackerHeaderText}>
              <Text style={styles.moodTrackerHeaderTitle}>Seguimiento del Estado de Ánimo</Text>
              <Text style={styles.moodTrackerHeaderSubtitle}>
                Conecta con tus emociones diariamente
              </Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.moodTrackerAddButton}
            onPress={() => {}}
          >
            <Icon name="add" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Estado de ánimo actual */}
        <View style={styles.moodTrackerCurrentMood}>
          <View style={styles.moodTrackerCurrentMoodContent}>
            <Text style={styles.moodTrackerCurrentMoodTitle}>
              😊 Tu Estado de Ánimo Hoy
            </Text>
            <Text style={styles.moodTrackerCurrentMoodSubtitle}>
              {sampleMoodData.currentMood.date} • {sampleMoodData.currentMood.time}
            </Text>
          </View>
          <View style={styles.moodTrackerCurrentMoodCard}>
            <View style={styles.moodTrackerCurrentMoodHeader}>
              <View style={[styles.moodTrackerCurrentMoodIcon, { backgroundColor: sampleMoodData.currentMood.color }]}>
                <Text style={styles.moodTrackerCurrentMoodEmoji}>{sampleMoodData.currentMood.mood}</Text>
              </View>
              <View style={styles.moodTrackerCurrentMoodInfo}>
                <Text style={styles.moodTrackerCurrentMoodLevel}>
                  Nivel {sampleMoodData.currentMood.level}/5
                </Text>
                <Text style={styles.moodTrackerCurrentMoodDescription}>
                  {sampleMoodData.currentMood.description}
                </Text>
              </View>
            </View>
            <View style={styles.moodTrackerCurrentMoodActivities}>
              <Text style={styles.moodTrackerCurrentMoodActivitiesTitle}>Actividades del día:</Text>
              <View style={styles.moodTrackerCurrentMoodActivitiesList}>
                {sampleMoodData.currentMood.activities.map((activity, index) => (
                  <View key={index} style={styles.moodTrackerCurrentMoodActivity}>
                    <Text style={styles.moodTrackerCurrentMoodActivityText}>{activity}</Text>
                  </View>
                ))}
              </View>
            </View>
            <Text style={styles.moodTrackerCurrentMoodNotes}>
              "{sampleMoodData.currentMood.notes}"
            </Text>
          </View>
        </View>

        {/* Panel de estadísticas semanales */}
        <View style={styles.moodTrackerStatsPanel}>
          <View style={styles.moodTrackerStatsContent}>
            <Text style={styles.moodTrackerStatsTitle}>
              📊 Estadísticas de la Semana
            </Text>
            <Text style={styles.moodTrackerStatsSubtitle}>
              Promedio: {sampleMoodData.monthlyStats.averageMood}/5
            </Text>
          </View>
          <View style={styles.moodTrackerStatsGrid}>
            <View style={styles.moodTrackerStatCard}>
              <View style={styles.moodTrackerStatIcon}>
                <Icon name="trending-up" size={20} color="#4CAF50" />
              </View>
              <Text style={styles.moodTrackerStatNumber}>{sampleMoodData.monthlyStats.happyDays}</Text>
              <Text style={styles.moodTrackerStatLabel}>Días Felices</Text>
            </View>
            <View style={styles.moodTrackerStatCard}>
              <View style={styles.moodTrackerStatIcon}>
                <Icon name="trending-down" size={20} color="#FF9800" />
              </View>
              <Text style={styles.moodTrackerStatNumber}>{sampleMoodData.monthlyStats.sadDays}</Text>
              <Text style={styles.moodTrackerStatLabel}>Días Tristes</Text>
            </View>
            <View style={styles.moodTrackerStatCard}>
              <View style={styles.moodTrackerStatIcon}>
                <Icon name="pause" size={20} color="#2196F3" />
              </View>
              <Text style={styles.moodTrackerStatNumber}>{sampleMoodData.monthlyStats.neutralDays}</Text>
              <Text style={styles.moodTrackerStatLabel}>Días Neutros</Text>
            </View>
            <View style={styles.moodTrackerStatCard}>
              <View style={styles.moodTrackerStatIcon}>
                <Icon name="happy" size={20} color="#FFC107" />
              </View>
              <Text style={styles.moodTrackerStatNumber}>{sampleMoodData.monthlyStats.mostCommonMood}</Text>
              <Text style={styles.moodTrackerStatLabel}>Más Común</Text>
            </View>
          </View>
        </View>

        {/* Historial semanal */}
        <View style={styles.moodTrackerWeeklyContainer}>
          <Text style={styles.moodTrackerWeeklyTitle}>Historial de la Semana</Text>
          {sampleMoodData.weeklyMoods.map((mood, index) => (
            <View key={index} style={styles.moodTrackerWeeklyCard}>
              <View style={styles.moodTrackerWeeklyHeader}>
                <View style={styles.moodTrackerWeeklyDate}>
                  <Text style={styles.moodTrackerWeeklyDateText}>{mood.date}</Text>
                </View>
                <View style={[styles.moodTrackerWeeklyMood, { backgroundColor: mood.color }]}>
                  <Text style={styles.moodTrackerWeeklyMoodEmoji}>{mood.mood}</Text>
                </View>
              </View>
              <View style={styles.moodTrackerWeeklyInfo}>
                <Text style={styles.moodTrackerWeeklyLevel}>Nivel {mood.level}/5</Text>
                <Text style={styles.moodTrackerWeeklyDescription}>{mood.description}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Actividades que afectan el ánimo */}
        <View style={styles.moodTrackerActivitiesContainer}>
          <Text style={styles.moodTrackerActivitiesTitle}>Actividades que Afectan tu Ánimo</Text>
          {sampleMoodData.activities.map((activity, index) => (
            <View key={index} style={styles.moodTrackerActivityCard}>
              <View style={styles.moodTrackerActivityHeader}>
                <View style={[styles.moodTrackerActivityIcon, { backgroundColor: activity.color }]}>
                  <Text style={styles.moodTrackerActivityEmoji}>{activity.mood}</Text>
                </View>
                <View style={styles.moodTrackerActivityInfo}>
                  <Text style={styles.moodTrackerActivityName}>{activity.name}</Text>
                  <Text style={styles.moodTrackerActivityFrequency}>
                    {activity.frequency} veces esta semana
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Historial mensual */}
        <View style={styles.moodTrackerMonthlyContainer}>
          <Text style={styles.moodTrackerMonthlyTitle}>Tendencia Mensual</Text>
          <View style={styles.moodTrackerMonthlyChart}>
            {sampleMoodData.moodHistory.map((month, index) => (
              <View key={index} style={styles.moodTrackerMonthlyBar}>
                <View style={styles.moodTrackerMonthlyBarContainer}>
                  <View 
                    style={[
                      styles.moodTrackerMonthlyBarFill,
                      { 
                        height: `${(month.average / 5) * 100}%`,
                        backgroundColor: month.color
                      }
                    ]}
                  />
                </View>
                <Text style={styles.moodTrackerMonthlyBarLabel}>{month.month}</Text>
                <Text style={styles.moodTrackerMonthlyBarValue}>{month.average}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Notas personales */}
        <View style={styles.moodTrackerNotesContainer}>
          <Text style={styles.moodTrackerNotesTitle}>Notas Personales</Text>
          {sampleMoodData.notes.map((note, index) => (
            <View key={index} style={styles.moodTrackerNoteCard}>
              <View style={styles.moodTrackerNoteIcon}>
                <Icon name="document-text" size={16} color="#6B7280" />
              </View>
              <Text style={styles.moodTrackerNoteText}>{note}</Text>
            </View>
          ))}
        </View>

        {/* Mantra del año */}
        <View style={styles.moodTrackerMantraContainer}>
          <Text style={styles.moodTrackerMantraTitle}>Mantra del Año</Text>
          <View style={styles.moodTrackerMantraCard}>
            <View style={styles.moodTrackerMantraIcon}>
              <Icon name="quote" size={24} color="#FF9800" />
            </View>
            <Text style={styles.moodTrackerMantraText}>
              "{sampleMoodData.yearMantra}"
            </Text>
          </View>
        </View>

        {/* Botones de acción */}
        <View style={styles.moodTrackerActions}>
          <TouchableOpacity style={styles.moodTrackerActionButton}>
            <Icon name="add-circle" size={20} color="#E91E63" />
            <Text style={styles.moodTrackerActionText}>Registrar Ánimo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.moodTrackerActionButton}>
            <Icon name="analytics" size={20} color="#2196F3" />
            <Text style={styles.moodTrackerActionText}>Ver Estadísticas</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.moodTrackerActionButton}>
            <Icon name="download" size={20} color="#4CAF50" />
            <Text style={styles.moodTrackerActionText}>Exportar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  const renderDailyHabitTracker = () => {
    // Datos de ejemplo para el seguimiento diario de hábitos
    const sampleDailyHabits = {
      morning: [
        {
          id: '1',
          text: 'Meditación 10 min',
          category: 'Bienestar Mental',
          color: '#4CAF50',
          completed: [true, true, false, true, true, false, true],
          streak: 3,
          priority: 'Alta',
          time: '07:00'
        },
        {
          id: '2',
          text: 'Ejercicio matutino',
          category: 'Fitness',
          color: '#2196F3',
          completed: [true, false, true, true, false, true, false],
          streak: 2,
          priority: 'Alta',
          time: '07:30'
        },
        {
          id: '3',
          text: 'Desayuno saludable',
          category: 'Nutrición',
          color: '#FF9800',
          completed: [true, true, true, false, true, true, true],
          streak: 5,
          priority: 'Media',
          time: '08:00'
        },
        {
          id: '4',
          text: 'Planificar el día',
          category: 'Productividad',
          color: '#9C27B0',
          completed: [false, true, true, true, true, false, true],
          streak: 4,
          priority: 'Media',
          time: '08:15'
        }
      ],
      afternoon: [
        {
          id: '5',
          text: 'Caminar 15 min',
          category: 'Fitness',
          color: '#4CAF50',
          completed: [true, true, false, true, true, true, false],
          streak: 4,
          priority: 'Media',
          time: '13:00'
        },
        {
          id: '6',
          text: 'Beber agua',
          category: 'Salud',
          color: '#00BCD4',
          completed: [true, true, true, true, true, true, true],
          streak: 7,
          priority: 'Alta',
          time: 'Cada hora'
        },
        {
          id: '7',
          text: 'Revisar emails',
          category: 'Productividad',
          color: '#FF5722',
          completed: [true, false, true, true, true, false, false],
          streak: 3,
          priority: 'Baja',
          time: '14:00'
        }
      ],
      evening: [
        {
          id: '8',
          text: 'Leer 30 min',
          category: 'Desarrollo Personal',
          color: '#795548',
          completed: [false, true, true, false, true, true, true],
          streak: 4,
          priority: 'Media',
          time: '20:00'
        },
        {
          id: '9',
          text: 'Escribir en el diario',
          category: 'Bienestar Mental',
          color: '#E91E63',
          completed: [true, false, true, true, false, true, false],
          streak: 2,
          priority: 'Alta',
          time: '21:00'
        },
        {
          id: '10',
          text: 'Preparar ropa del día siguiente',
          category: 'Organización',
          color: '#607D8B',
          completed: [true, true, true, true, true, true, true],
          streak: 7,
          priority: 'Media',
          time: '21:30'
        },
        {
          id: '11',
          text: 'Rutina de cuidado facial',
          category: 'Cuidado Personal',
          color: '#FFC107',
          completed: [true, true, false, true, true, true, false],
          streak: 5,
          priority: 'Baja',
          time: '22:00'
        }
      ]
    };

    // Calcular estadísticas generales
    const getOverallStats = () => {
      const allHabits = Object.values(sampleDailyHabits).flat();
      const totalHabits = allHabits.length;
      const totalDays = allHabits.reduce((sum, habit) => sum + habit.completed.length, 0);
      const completedDays = allHabits.reduce((sum, habit) => sum + habit.completed.filter(Boolean).length, 0);
      const overallProgress = Math.round((completedDays / totalDays) * 100);
      const avgStreak = Math.round(allHabits.reduce((sum, habit) => sum + habit.streak, 0) / totalHabits);
      const perfectHabits = allHabits.filter(habit => habit.streak === habit.completed.length).length;
      const highPriorityHabits = allHabits.filter(habit => habit.priority === 'Alta').length;
      
      return { totalHabits, totalDays, completedDays, overallProgress, avgStreak, perfectHabits, highPriorityHabits };
    };

    // Obtener color según la prioridad
    const getPriorityColor = (priority) => {
      switch (priority) {
        case 'Alta': return '#F44336';
        case 'Media': return '#FF9800';
        case 'Baja': return '#4CAF50';
        default: return '#6B7280';
      }
    };

    // Obtener color según la categoría
    const getCategoryColor = (category) => {
      const colorMap = {
        'Bienestar Mental': '#4CAF50',
        'Fitness': '#2196F3',
        'Nutrición': '#FF9800',
        'Productividad': '#9C27B0',
        'Salud': '#00BCD4',
        'Desarrollo Personal': '#795548',
        'Organización': '#607D8B',
        'Cuidado Personal': '#FFC107'
      };
      return colorMap[category] || '#6B7280';
    };

    // Obtener emoji según la categoría
    const getCategoryEmoji = (category) => {
      const emojiMap = {
        'Bienestar Mental': '🧘',
        'Fitness': '💪',
        'Nutrición': '🍎',
        'Productividad': '⚡',
        'Salud': '💧',
        'Desarrollo Personal': '📚',
        'Organización': '📋',
        'Cuidado Personal': '✨'
      };
      return emojiMap[category] || '📝';
    };

    // Obtener emoji según el período
    const getPeriodEmoji = (period) => {
      switch (period) {
        case 'morning': return '🌅';
        case 'afternoon': return '☀️';
        case 'evening': return '🌙';
        default: return '📅';
      }
    };

    const overallStats = getOverallStats();

    return (
      <ScrollView style={styles.dailyHabitContainer} showsVerticalScrollIndicator={false}>
        {/* Header mejorado */}
        <View style={styles.dailyHabitHeader}>
          <View style={styles.dailyHabitHeaderContent}>
            <View style={styles.dailyHabitHeaderIcon}>
              <Icon name="calendar" size={28} color="#FFFFFF" />
            </View>
            <View style={styles.dailyHabitHeaderText}>
              <Text style={styles.dailyHabitHeaderTitle}>Seguimiento Diario de Hábitos</Text>
              <Text style={styles.dailyHabitHeaderSubtitle}>
                Construye rutinas que transformen tu vida
              </Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.dailyHabitAddButton}
            onPress={() => {}}
          >
            <Icon name="add" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Panel de estadísticas generales */}
        <View style={styles.dailyHabitStatsPanel}>
          <View style={styles.dailyHabitStatsContent}>
            <Text style={styles.dailyHabitStatsTitle}>
              📊 Tu Progreso General
            </Text>
            <Text style={styles.dailyHabitStatsSubtitle}>
              {overallStats.completedDays} de {overallStats.totalDays} hábitos completados
            </Text>
          </View>
          <View style={styles.dailyHabitStatsGrid}>
            <View style={styles.dailyHabitStatCard}>
              <View style={styles.dailyHabitStatIcon}>
                <Icon name="trending-up" size={20} color="#4CAF50" />
              </View>
              <Text style={styles.dailyHabitStatNumber}>{overallStats.overallProgress}%</Text>
              <Text style={styles.dailyHabitStatLabel}>Completado</Text>
            </View>
            <View style={styles.dailyHabitStatCard}>
              <View style={styles.dailyHabitStatIcon}>
                <Icon name="flame" size={20} color="#FF9800" />
              </View>
              <Text style={styles.dailyHabitStatNumber}>{overallStats.avgStreak}</Text>
              <Text style={styles.dailyHabitStatLabel}>Racha Promedio</Text>
            </View>
            <View style={styles.dailyHabitStatCard}>
              <View style={styles.dailyHabitStatIcon}>
                <Icon name="trophy" size={20} color="#FFC107" />
              </View>
              <Text style={styles.dailyHabitStatNumber}>{overallStats.perfectHabits}</Text>
              <Text style={styles.dailyHabitStatLabel}>Hábitos Perfectos</Text>
            </View>
            <View style={styles.dailyHabitStatCard}>
              <View style={styles.dailyHabitStatIcon}>
                <Icon name="star" size={20} color="#F44336" />
              </View>
              <Text style={styles.dailyHabitStatNumber}>{overallStats.highPriorityHabits}</Text>
              <Text style={styles.dailyHabitStatLabel}>Alta Prioridad</Text>
            </View>
          </View>
        </View>

        {/* Lista de períodos del día */}
        {[
          { key: 'morning', title: 'Hábitos Matutinos', emoji: '🌅' },
          { key: 'afternoon', title: 'Hábitos Vespertinos', emoji: '☀️' },
          { key: 'evening', title: 'Hábitos Nocturnos', emoji: '🌙' }
        ].map(({ key, title, emoji }) => (
          <View key={key} style={styles.dailyHabitPeriodContainer}>
            {/* Header del período */}
            <View style={styles.dailyHabitPeriodHeader}>
              <View style={styles.dailyHabitPeriodHeaderLeft}>
                <Text style={styles.dailyHabitPeriodEmoji}>{emoji}</Text>
                <View style={styles.dailyHabitPeriodInfo}>
                  <Text style={styles.dailyHabitPeriodTitle}>{title}</Text>
                  <Text style={styles.dailyHabitPeriodSubtitle}>
                    {sampleDailyHabits[key].length} hábitos • {sampleDailyHabits[key].reduce((sum, habit) => sum + habit.completed.filter(Boolean).length, 0)} completados
                  </Text>
                </View>
              </View>
              <View style={styles.dailyHabitPeriodProgress}>
                <Text style={styles.dailyHabitPeriodProgressText}>
                  {Math.round((sampleDailyHabits[key].reduce((sum, habit) => sum + habit.completed.filter(Boolean).length, 0) / (sampleDailyHabits[key].length * 7)) * 100)}%
                </Text>
              </View>
            </View>

            {/* Header de días */}
            <View style={styles.dailyHabitDaysHeader}>
              <Text style={styles.dailyHabitHabitLabel}>Hábito</Text>
              <View style={styles.dailyHabitDaysContainer}>
                <Text style={styles.dailyHabitDayLabel}>L</Text>
                <Text style={styles.dailyHabitDayLabel}>M</Text>
                <Text style={styles.dailyHabitDayLabel}>X</Text>
                <Text style={styles.dailyHabitDayLabel}>J</Text>
                <Text style={styles.dailyHabitDayLabel}>V</Text>
                <Text style={styles.dailyHabitDayLabel}>S</Text>
                <Text style={styles.dailyHabitDayLabel}>D</Text>
              </View>
            </View>

            {/* Lista de hábitos del período */}
            {sampleDailyHabits[key].map((habit) => (
              <View key={habit.id} style={styles.dailyHabitHabitRow}>
                {/* Información del hábito */}
                <View style={styles.dailyHabitHabitInfo}>
                  <View style={styles.dailyHabitHabitHeader}>
                    <View style={styles.dailyHabitHabitCategory}>
                      <Text style={styles.dailyHabitHabitCategoryEmoji}>
                        {getCategoryEmoji(habit.category)}
                      </Text>
                      <Text style={styles.dailyHabitHabitCategoryText}>
                        {habit.category}
                      </Text>
                    </View>
                    <View style={[styles.dailyHabitHabitPriority, { backgroundColor: getPriorityColor(habit.priority) }]}>
                      <Text style={styles.dailyHabitHabitPriorityText}>{habit.priority}</Text>
                    </View>
                  </View>
                  <Text style={styles.dailyHabitHabitText}>{habit.text}</Text>
                  <View style={styles.dailyHabitHabitDetails}>
                    <View style={styles.dailyHabitHabitDetail}>
                      <Icon name="time" size={12} color="#6B7280" />
                      <Text style={styles.dailyHabitHabitDetailText}>{habit.time}</Text>
                    </View>
                    <View style={styles.dailyHabitHabitDetail}>
                      <Icon name="flame" size={12} color="#FF9800" />
                      <Text style={styles.dailyHabitHabitDetailText}>Racha: {habit.streak}</Text>
                    </View>
                    <View style={styles.dailyHabitHabitDetail}>
                      <Icon name="checkmark-circle" size={12} color="#4CAF50" />
                      <Text style={styles.dailyHabitHabitDetailText}>
                        {habit.completed.filter(Boolean).length}/7
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Checkboxes de días */}
                <View style={styles.dailyHabitCheckboxesContainer}>
                  {habit.completed.map((completed, dayIndex) => (
                    <TouchableOpacity
                      key={dayIndex}
                      style={[
                        styles.dailyHabitCheckbox,
                        { backgroundColor: completed ? habit.color : '#F3F4F6' }
                      ]}
                      onPress={() => {}}
                    >
                      <Icon
                        name={completed ? 'checkmark' : 'close'}
                        size={16}
                        color={completed ? '#FFFFFF' : '#9CA3AF'}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}
          </View>
        ))}

        {/* Botones de acción */}
        <View style={styles.dailyHabitActions}>
          <TouchableOpacity style={styles.dailyHabitActionButton}>
            <Icon name="add-circle" size={20} color="#4CAF50" />
            <Text style={styles.dailyHabitActionText}>Nuevo Hábito</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dailyHabitActionButton}>
            <Icon name="analytics" size={20} color="#2196F3" />
            <Text style={styles.dailyHabitActionText}>Ver Estadísticas</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dailyHabitActionButton}>
            <Icon name="download" size={20} color="#FF9800" />
            <Text style={styles.dailyHabitActionText}>Exportar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };


  const renderHabitMonitor = () => {
    // Datos de ejemplo para el monitor de hábitos
    const sampleHabitMonitorData = {
      habits: [
        {
          id: '1',
          name: 'Meditación Matutina',
          category: 'Bienestar Mental',
          color: '#4CAF50',
          priority: 'Alta',
          target: 30, // minutos
          currentStreak: 12,
          longestStreak: 25,
          completionRate: 85,
          monthlyData: [true, true, false, true, true, true, true, true, false, true, true, true, true, true, true, true, true, false, true, true, true, true, true, true, true, true, true, true, true, true, true]
        },
        {
          id: '2',
          name: 'Ejercicio Diario',
          category: 'Fitness',
          color: '#2196F3',
          priority: 'Alta',
          target: 45, // minutos
          currentStreak: 8,
          longestStreak: 18,
          completionRate: 78,
          monthlyData: [true, false, true, true, true, false, true, true, true, true, false, true, true, true, true, true, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true]
        },
        {
          id: '3',
          name: 'Lectura Nocturna',
          category: 'Desarrollo Personal',
          color: '#9C27B0',
          priority: 'Media',
          target: 20, // minutos
          currentStreak: 5,
          longestStreak: 12,
          completionRate: 65,
          monthlyData: [false, true, true, false, true, true, true, false, true, true, true, true, false, true, true, true, true, true, false, true, true, true, true, true, true, true, true, true, true, true, true]
        },
        {
          id: '4',
          name: 'Escribir en el Diario',
          category: 'Bienestar Mental',
          color: '#E91E63',
          priority: 'Media',
          target: 15, // minutos
          currentStreak: 3,
          longestStreak: 8,
          completionRate: 58,
          monthlyData: [true, false, false, true, true, true, false, false, true, true, true, false, true, true, true, true, true, true, true, false, true, true, true, true, true, true, true, true, true, true, true]
        },
        {
          id: '5',
          name: 'Beber 8 Vasos de Agua',
          category: 'Salud',
          color: '#00BCD4',
          priority: 'Alta',
          target: 8, // vasos
          currentStreak: 15,
          longestStreak: 22,
          completionRate: 92,
          monthlyData: [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true]
        },
        {
          id: '6',
          name: 'Practicar Gratitud',
          category: 'Bienestar Mental',
          color: '#FF9800',
          priority: 'Media',
          target: 5, // minutos
          currentStreak: 7,
          longestStreak: 15,
          completionRate: 71,
          monthlyData: [false, true, true, true, true, true, true, true, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true]
        },
        {
          id: '7',
          name: 'Caminar 10,000 Pasos',
          category: 'Fitness',
          color: '#4CAF50',
          priority: 'Media',
          target: 10000, // pasos
          currentStreak: 4,
          longestStreak: 10,
          completionRate: 61,
          monthlyData: [true, true, false, true, true, true, true, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true]
        },
        {
          id: '8',
          name: 'Aprender algo Nuevo',
          category: 'Desarrollo Personal',
          color: '#795548',
          priority: 'Baja',
          target: 30, // minutos
          currentStreak: 2,
          longestStreak: 6,
          completionRate: 45,
          monthlyData: [false, false, true, true, false, false, true, true, false, true, true, false, true, true, true, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true]
        }
      ],
      monthlyStats: {
        totalHabits: 8,
        completedDays: 156,
        totalDays: 248,
        averageCompletion: 63,
        perfectDays: 12,
        currentStreak: 5,
        longestStreak: 8
      }
    };

    // Obtener color según la prioridad
    const getPriorityColor = (priority) => {
      switch (priority) {
        case 'Alta': return '#F44336';
        case 'Media': return '#FF9800';
        case 'Baja': return '#4CAF50';
        default: return '#6B7280';
      }
    };

    // Obtener color según la categoría
    const getCategoryColor = (category) => {
      const colorMap = {
        'Bienestar Mental': '#4CAF50',
        'Fitness': '#2196F3',
        'Desarrollo Personal': '#9C27B0',
        'Salud': '#00BCD4'
      };
      return colorMap[category] || '#6B7280';
    };

    // Obtener emoji según la categoría
    const getCategoryEmoji = (category) => {
      const emojiMap = {
        'Bienestar Mental': '🧘',
        'Fitness': '💪',
        'Desarrollo Personal': '📚',
        'Salud': '💧'
      };
      return emojiMap[category] || '📝';
    };

    // Obtener color según el porcentaje de completado
    const getCompletionColor = (rate) => {
      if (rate >= 80) return '#4CAF50';
      if (rate >= 60) return '#FF9800';
      return '#F44336';
    };

    return (
      <ScrollView style={styles.habitMonitorContainer} showsVerticalScrollIndicator={false}>
        {/* Header mejorado */}
        <View style={styles.habitMonitorHeader}>
          <View style={styles.habitMonitorHeaderContent}>
            <View style={styles.habitMonitorHeaderIcon}>
              <Icon name="analytics" size={28} color="#FFFFFF" />
            </View>
            <View style={styles.habitMonitorHeaderText}>
              <Text style={styles.habitMonitorHeaderTitle}>Monitor de Hábitos</Text>
              <Text style={styles.habitMonitorHeaderSubtitle}>
                Análisis avanzado de tu progreso mensual
              </Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.habitMonitorAddButton}
            onPress={() => {}}
          >
            <Icon name="add" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Panel de estadísticas generales */}
        <View style={styles.habitMonitorStatsPanel}>
          <View style={styles.habitMonitorStatsContent}>
            <Text style={styles.habitMonitorStatsTitle}>
              📊 Resumen del Mes
            </Text>
            <Text style={styles.habitMonitorStatsSubtitle}>
              {sampleHabitMonitorData.monthlyStats.completedDays} de {sampleHabitMonitorData.monthlyStats.totalDays} días completados
            </Text>
          </View>
          <View style={styles.habitMonitorStatsGrid}>
            <View style={styles.habitMonitorStatCard}>
              <View style={styles.habitMonitorStatIcon}>
                <Icon name="trending-up" size={20} color="#4CAF50" />
              </View>
              <Text style={styles.habitMonitorStatNumber}>{sampleHabitMonitorData.monthlyStats.averageCompletion}%</Text>
              <Text style={styles.habitMonitorStatLabel}>Promedio</Text>
            </View>
            <View style={styles.habitMonitorStatCard}>
              <View style={styles.habitMonitorStatIcon}>
                <Icon name="trophy" size={20} color="#FFC107" />
              </View>
              <Text style={styles.habitMonitorStatNumber}>{sampleHabitMonitorData.monthlyStats.perfectDays}</Text>
              <Text style={styles.habitMonitorStatLabel}>Días Perfectos</Text>
            </View>
            <View style={styles.habitMonitorStatCard}>
              <View style={styles.habitMonitorStatIcon}>
                <Icon name="flame" size={20} color="#FF9800" />
              </View>
              <Text style={styles.habitMonitorStatNumber}>{sampleHabitMonitorData.monthlyStats.currentStreak}</Text>
              <Text style={styles.habitMonitorStatLabel}>Racha Actual</Text>
            </View>
            <View style={styles.habitMonitorStatCard}>
              <View style={styles.habitMonitorStatIcon}>
                <Icon name="star" size={20} color="#F44336" />
              </View>
              <Text style={styles.habitMonitorStatNumber}>{sampleHabitMonitorData.monthlyStats.longestStreak}</Text>
              <Text style={styles.habitMonitorStatLabel}>Mejor Racha</Text>
            </View>
          </View>
        </View>

        {/* Lista de hábitos con análisis detallado */}
        <View style={styles.habitMonitorHabitsContainer}>
          <Text style={styles.habitMonitorHabitsTitle}>Análisis de Hábitos</Text>
          {sampleHabitMonitorData.habits.map((habit) => (
            <View key={habit.id} style={styles.habitMonitorHabitCard}>
              {/* Header del hábito */}
              <View style={styles.habitMonitorHabitHeader}>
                <View style={styles.habitMonitorHabitInfo}>
                  <View style={styles.habitMonitorHabitCategory}>
                    <Text style={styles.habitMonitorHabitCategoryEmoji}>
                      {getCategoryEmoji(habit.category)}
                    </Text>
                    <Text style={styles.habitMonitorHabitCategoryText}>
                      {habit.category}
                    </Text>
                  </View>
                  <View style={[styles.habitMonitorHabitPriority, { backgroundColor: getPriorityColor(habit.priority) }]}>
                    <Text style={styles.habitMonitorHabitPriorityText}>{habit.priority}</Text>
                  </View>
                </View>
                <View style={styles.habitMonitorHabitTitle}>
                  <Text style={styles.habitMonitorHabitName}>{habit.name}</Text>
                  <Text style={styles.habitMonitorHabitTarget}>
                    Meta: {habit.target} {habit.target > 20 ? 'min' : habit.target > 10 ? 'vasos' : 'min'}
                  </Text>
                </View>
              </View>

              {/* Estadísticas del hábito */}
              <View style={styles.habitMonitorHabitStats}>
                <View style={styles.habitMonitorHabitStat}>
                  <Text style={styles.habitMonitorHabitStatLabel}>Completado</Text>
                  <Text style={[styles.habitMonitorHabitStatValue, { color: getCompletionColor(habit.completionRate) }]}>
                    {habit.completionRate}%
                  </Text>
                </View>
                <View style={styles.habitMonitorHabitStat}>
                  <Text style={styles.habitMonitorHabitStatLabel}>Racha Actual</Text>
                  <Text style={styles.habitMonitorHabitStatValue}>{habit.currentStreak} días</Text>
                </View>
                <View style={styles.habitMonitorHabitStat}>
                  <Text style={styles.habitMonitorHabitStatLabel}>Mejor Racha</Text>
                  <Text style={styles.habitMonitorHabitStatValue}>{habit.longestStreak} días</Text>
                </View>
              </View>

              {/* Barra de progreso */}
              <View style={styles.habitMonitorHabitProgress}>
                <View style={styles.habitMonitorHabitProgressBar}>
                  <View 
                    style={[
                      styles.habitMonitorHabitProgressFill,
                      { 
                        width: `${habit.completionRate}%`,
                        backgroundColor: getCompletionColor(habit.completionRate)
                      }
                    ]}
                  />
                </View>
                <Text style={styles.habitMonitorHabitProgressText}>
                  {habit.completionRate}% completado
                </Text>
              </View>

              {/* Calendario mensual */}
              <View style={styles.habitMonitorHabitCalendar}>
                <Text style={styles.habitMonitorHabitCalendarTitle}>Progreso Mensual</Text>
                <View style={styles.habitMonitorHabitCalendarGrid}>
                  {habit.monthlyData.map((completed, dayIndex) => (
                    <TouchableOpacity
                      key={dayIndex}
                      style={[
                        styles.habitMonitorHabitCalendarDay,
                        { 
                          backgroundColor: completed ? habit.color : '#F3F4F6',
                          borderColor: completed ? habit.color : '#E5E7EB'
                        }
                      ]}
                      onPress={() => {}}
                    >
                      <Icon
                        name={completed ? 'checkmark' : 'close'}
                        size={8}
                        color={completed ? '#FFFFFF' : '#9CA3AF'}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
                <View style={styles.habitMonitorHabitCalendarLegend}>
                  <View style={styles.habitMonitorHabitCalendarLegendItem}>
                    <View style={[styles.habitMonitorHabitCalendarLegendDot, { backgroundColor: habit.color }]} />
                    <Text style={styles.habitMonitorHabitCalendarLegendText}>Completado</Text>
                  </View>
                  <View style={styles.habitMonitorHabitCalendarLegendItem}>
                    <View style={[styles.habitMonitorHabitCalendarLegendDot, { backgroundColor: '#F3F4F6' }]} />
                    <Text style={styles.habitMonitorHabitCalendarLegendText}>Pendiente</Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Análisis de tendencias */}
        <View style={styles.habitMonitorTrendsContainer}>
          <Text style={styles.habitMonitorTrendsTitle}>Tendencias y Patrones</Text>
          <View style={styles.habitMonitorTrendsGrid}>
            <View style={styles.habitMonitorTrendCard}>
              <View style={styles.habitMonitorTrendIcon}>
                <Icon name="trending-up" size={24} color="#4CAF50" />
              </View>
              <Text style={styles.habitMonitorTrendTitle}>Hábitos en Mejora</Text>
              <Text style={styles.habitMonitorTrendDescription}>
                Meditación Matutina y Beber Agua muestran progreso constante
              </Text>
            </View>
            <View style={styles.habitMonitorTrendCard}>
              <View style={styles.habitMonitorTrendIcon}>
                <Icon name="trending-down" size={24} color="#F44336" />
              </View>
              <Text style={styles.habitMonitorTrendTitle}>Necesitan Atención</Text>
              <Text style={styles.habitMonitorTrendDescription}>
                Aprender algo Nuevo requiere más consistencia
              </Text>
            </View>
            <View style={styles.habitMonitorTrendCard}>
              <View style={styles.habitMonitorTrendIcon}>
                <Icon name="calendar" size={24} color="#2196F3" />
              </View>
              <Text style={styles.habitMonitorTrendTitle}>Mejor Día</Text>
              <Text style={styles.habitMonitorTrendDescription}>
                Los martes y jueves son tus días más productivos
              </Text>
            </View>
            <View style={styles.habitMonitorTrendCard}>
              <View style={styles.habitMonitorTrendIcon}>
                <Icon name="time" size={24} color="#FF9800" />
              </View>
              <Text style={styles.habitMonitorTrendTitle}>Hora Óptima</Text>
              <Text style={styles.habitMonitorTrendDescription}>
                Las mañanas son ideales para la mayoría de hábitos
              </Text>
            </View>
          </View>
        </View>

        {/* Botones de acción */}
        <View style={styles.habitMonitorActions}>
          <TouchableOpacity style={styles.habitMonitorActionButton}>
            <Icon name="add-circle" size={20} color="#4CAF50" />
            <Text style={styles.habitMonitorActionText}>Nuevo Hábito</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.habitMonitorActionButton}>
            <Icon name="analytics" size={20} color="#2196F3" />
            <Text style={styles.habitMonitorActionText}>Ver Reporte</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.habitMonitorActionButton}>
            <Icon name="download" size={20} color="#FF9800" />
            <Text style={styles.habitMonitorActionText}>Exportar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'self-care-checklist':
        return renderSelfCareChecklist();
      case 'wellness-scheduler':
        return renderWellnessScheduler();
      case 'self-care-journal':
        return renderSelfCareJournal();
      case 'self-care-planner':
        return renderSelfCarePlanner();
      case 'monthly-habit-log':
        return renderMonthlyHabitLog();
      case 'habit-goal-tracker':
        return renderHabitGoalTracker();
      case 'mood-tracker':
        return renderMoodTracker();
      case 'daily-habit-tracker':
        return renderDailyHabitTracker();
      case 'habit-monitor':
        return renderHabitMonitor();
      default:
        return renderSelfCareChecklist();
    }
  };

  return (
    <View style={styles.container}>
      {/* Navegación de pestañas */}
      {renderSectionTabs()}

      {/* Contenido de la sección activa */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderActiveSection()}
      </ScrollView>

      {/* Modal para agregar Wellness Schedule */}
      <Modal
        visible={showAddWellnessModal}
        animationType="slide"
        transparent={true}
        onRequestClose={closeAddWellnessModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nuevo Horario de Bienestar</Text>
              <TouchableOpacity onPress={closeAddWellnessModal}>
                <Icon name="close" size={24} color="#6c757d" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              <Text style={styles.modalSubtitle}>Actividades (6 actividades):</Text>
              {newWellnessSchedule.activities.map((activity, index) => (
                <View key={index} style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Actividad {index + 1}</Text>
                  <TextInput
                    style={styles.textInput}
                    value={activity}
                    onChangeText={(text) => {
                      const newActivities = [...newWellnessSchedule.activities];
                      newActivities[index] = text;
                      setNewWellnessSchedule({...newWellnessSchedule, activities: newActivities});
                    }}
                    placeholder="Descripción de la actividad"
                  />
                </View>
              ))}
            </ScrollView>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity onPress={closeAddWellnessModal} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={saveWellnessSchedule} style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal para agregar Journal Entry */}
      <Modal
        visible={showAddJournalModal}
        animationType="slide"
        transparent={true}
        onRequestClose={closeAddJournalModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nueva Entrada de Diario</Text>
              <TouchableOpacity onPress={closeAddJournalModal}>
                <Icon name="close" size={24} color="#6c757d" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Fecha</Text>
                <TextInput
                  style={styles.textInput}
                  value={newJournalEntry.date}
                  onChangeText={(text) => setNewJournalEntry({...newJournalEntry, date: text})}
                  placeholder="YYYY-MM-DD"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Recordatorio</Text>
                <TextInput
                  style={styles.textInput}
                  value={newJournalEntry.reminder}
                  onChangeText={(text) => setNewJournalEntry({...newJournalEntry, reminder: text})}
                  placeholder="Recordatorio importante"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Estado de ánimo</Text>
                <TextInput
                  style={styles.textInput}
                  value={newJournalEntry.mood}
                  onChangeText={(text) => setNewJournalEntry({...newJournalEntry, mood: text})}
                  placeholder="¿Cómo te sientes hoy?"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Notas</Text>
                <TextInput
                  style={[styles.textInput, styles.multilineInput]}
                  value={newJournalEntry.notes}
                  onChangeText={(text) => setNewJournalEntry({...newJournalEntry, notes: text})}
                  placeholder="Reflexiones del día..."
                  multiline
                  numberOfLines={4}
                />
              </View>
            </ScrollView>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity onPress={closeAddJournalModal} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={saveJournalEntry} style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal para agregar Self Care Plan */}
      <Modal
        visible={showAddSelfCareModal}
        animationType="slide"
        transparent={true}
        onRequestClose={closeAddSelfCareModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nuevo Plan de Cuidado Personal</Text>
              <TouchableOpacity onPress={closeAddSelfCareModal}>
                <Icon name="close" size={24} color="#6c757d" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Fecha</Text>
                <TextInput
                  style={styles.textInput}
                  value={newSelfCarePlan.date}
                  onChangeText={(text) => setNewSelfCarePlan({...newSelfCarePlan, date: text})}
                  placeholder="YYYY-MM-DD"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Ejercicio</Text>
                <TextInput
                  style={styles.textInput}
                  value={newSelfCarePlan.workout}
                  onChangeText={(text) => setNewSelfCarePlan({...newSelfCarePlan, workout: text})}
                  placeholder="Tipo de ejercicio"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Estado de ánimo</Text>
                <TextInput
                  style={styles.textInput}
                  value={newSelfCarePlan.mood}
                  onChangeText={(text) => setNewSelfCarePlan({...newSelfCarePlan, mood: text})}
                  placeholder="¿Cómo te sientes?"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>¿Cuál es tu cosa favorita?</Text>
                <TextInput
                  style={styles.textInput}
                  value={newSelfCarePlan.favoriteThing}
                  onChangeText={(text) => setNewSelfCarePlan({...newSelfCarePlan, favoriteThing: text})}
                  placeholder="Tu actividad favorita"
                />
              </View>
            </ScrollView>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity onPress={closeAddSelfCareModal} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={saveSelfCarePlan} style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  },
  tabsScroll: {
    paddingHorizontal: 16,
  },
  tab: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginVertical: 8,
  },
  activeTab: {
    backgroundColor: '#FF6B9D',
    borderColor: '#FF6B9D',
  },
  content: {
    flex: 1,
    paddingHorizontal: 0,
    paddingVertical: 16,
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    marginHorizontal: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d4150',
  },
  crownIcon: {
    padding: 4,
  },
  addButton: {
    backgroundColor: '#FF6B9D',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checklistContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  checklistColumn: {
    flex: 1,
    marginHorizontal: 8,
  },
  timeSection: {
    marginBottom: 20,
  },
  timeSectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4FC3F7',
    backgroundColor: '#E3F2FD',
    padding: 8,
    textAlign: 'center',
    marginBottom: 8,
    borderRadius: 4,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    paddingVertical: 2,
  },
  checklistText: {
    fontSize: 12,
    color: '#495057',
    marginLeft: 8,
    flex: 1,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#6c757d',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#6c757d',
    marginTop: 12,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#adb5bd',
    marginTop: 4,
    textAlign: 'center',
  },
  schedulesList: {
    maxHeight: 400,
  },
  scheduleCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  weekHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
  weekHeaderText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#495057',
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  activityNumber: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#6c757d',
    width: 20,
  },
  activityText: {
    fontSize: 12,
    color: '#495057',
    flex: 1,
    marginLeft: 8,
  },
  weekCheckboxes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 80,
  },
  journalList: {
    maxHeight: 400,
  },
  journalCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  journalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
  journalDate: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2d4150',
  },
  moodIndicator: {
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  moodText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
  },
  journalContent: {
    flexDirection: 'row',
  },
  journalColumn: {
    flex: 1,
    marginHorizontal: 4,
  },
  journalSubtitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#495057',
    marginTop: 8,
    marginBottom: 4,
  },
  journalItem: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 2,
  },
  journalText: {
    fontSize: 12,
    color: '#6c757d',
    fontStyle: 'italic',
  },
  waterIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  plansList: {
    maxHeight: 400,
  },
  planCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
  planDate: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2d4150',
  },
  plannerContent: {
    flexDirection: 'row',
  },
  plannerColumn: {
    flex: 1,
    marginHorizontal: 4,
  },
  plannerSubtitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#495057',
    marginTop: 8,
    marginBottom: 4,
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  todoText: {
    fontSize: 12,
    color: '#6c757d',
    marginLeft: 6,
  },
  workoutText: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 8,
  },
  sleepIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  favoriteText: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 8,
  },
  dontLikeText: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 8,
  },
  favoritePartText: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 8,
  },
  goalText: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 2,
  },
  notesSection: {
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#dee2e6',
  },
  noteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  noteText: {
    fontSize: 12,
    color: '#6c757d',
    marginLeft: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    width: '90%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d4150',
  },
  modalBody: {
    padding: 16,
    maxHeight: 400,
  },
  modalSubtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#495057',
    marginBottom: 12,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#495057',
    marginBottom: 6,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 6,
    padding: 12,
    fontSize: 14,
    color: '#495057',
    backgroundColor: '#ffffff',
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    marginRight: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ced4da',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    color: '#6c757d',
    fontWeight: '500',
  },
  saveButton: {
    flex: 1,
    padding: 12,
    marginLeft: 8,
    borderRadius: 6,
    backgroundColor: '#FF6B9D',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  // Estilos para las subsecciones del habit tracker
  weekSection: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#FF6B9D',
  },
  weekTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B9D',
    marginBottom: 12,
  },
  weekHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  habitLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#495057',
    flex: 1,
  },
  daysHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 120,
  },
  dayLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#495057',
    textAlign: 'center',
    width: 16,
  },
  habitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  habitInput: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
    paddingVertical: 4,
    fontSize: 14,
    color: '#495057',
  },
  checkboxesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 120,
    marginLeft: 8,
  },
  checkbox: {
    padding: 2,
  },
  goalTrackerContent: {
    flexDirection: 'row',
  },
  goalInputsColumn: {
    flex: 1,
    marginRight: 16,
  },
  monthlyGridColumn: {
    flex: 1,
  },
  monthlyGridHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dayNumber: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#495057',
    textAlign: 'center',
    width: 12,
  },
  monthlyGrid: {
    maxHeight: 200,
  },
  gridRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  habitNameInput: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
    paddingVertical: 2,
    fontSize: 10,
    color: '#495057',
    marginRight: 4,
  },
  gridCheckbox: {
    padding: 1,
    width: 12,
    alignItems: 'center',
  },
  moodTrackerContent: {
    flex: 1,
  },
  moodGridHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    backgroundColor: '#FF6B9D',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 4,
  },
  monthLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    flex: 1,
  },
  moodGrid: {
    maxHeight: 300,
  },
  moodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  moodCell: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dee2e6',
    marginHorizontal: 1,
  },
  moodEmoji: {
    fontSize: 12,
  },
  moodNotesSection: {
    flexDirection: 'row',
    marginTop: 16,
  },
  notesColumn: {
    flex: 1,
    marginRight: 8,
  },
  mantraColumn: {
    flex: 1,
    marginLeft: 8,
  },
  dailyHabitSection: {
    marginBottom: 20,
  },
  dailyHabitTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF6B9D',
    marginBottom: 8,
  },
  dailyHabitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  habitMonitorContent: {
    flex: 1,
  },
  monitorGridHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  monitorGrid: {
    maxHeight: 300,
  },
  monitorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  monitorCheckbox: {
    padding: 1,
    width: 12,
    alignItems: 'center',
  },

  // Estilos para la nueva UI de Lista de Cuidado Personal
  checklistContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  checklistHeader: {
    backgroundColor: '#FF6B9D',
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checklistHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checklistHeaderIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  checklistHeaderText: {
    flex: 1,
  },
  checklistHeaderTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  checklistHeaderSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  checklistHeaderStats: {
    alignItems: 'center',
  },
  checklistHeaderPercentage: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  checklistHeaderLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  checklistStatsPanel: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  checklistStatsContent: {
    marginBottom: 16,
  },
  checklistStatsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  checklistStatsSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  checklistProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checklistProgressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginRight: 12,
  },
  checklistProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  checklistProgressText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  checklistMotivationalText: {
    fontSize: 14,
    color: '#4B5563',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  checklistPeriodStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  checklistPeriodCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  checklistPeriodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  checklistPeriodTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 4,
  },
  checklistPeriodStats: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  checklistPeriodProgress: {
    width: '100%',
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
  },
  checklistPeriodProgressFill: {
    height: '100%',
    borderRadius: 2,
  },
  checklistActivitiesContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  checklistTimeSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  checklistTimeSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  checklistTimeSectionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checklistTimeSectionContent: {
    flex: 1,
  },
  checklistTimeSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  checklistTimeSectionSubtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  checklistTimeSectionBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  checklistTimeSectionBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  checklistActivityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  checklistActivityItemCompleted: {
    backgroundColor: '#F0FDF4',
  },
  checklistActivityItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checklistActivityItemCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checklistActivityItemCheckboxCompleted: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  checklistActivityItemText: {
    fontSize: 14,
    color: '#1F2937',
    flex: 1,
  },
  checklistActivityItemTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#6B7280',
  },
  checklistActivityItemRight: {
    marginLeft: 12,
  },
  checklistActivityItemNumber: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#9CA3AF',
  },
  checklistActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  checklistActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  checklistActionText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
    color: '#1F2937',
  },

  // Estilos para la nueva UI de Programador de Bienestar Personal
  wellnessContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  wellnessHeader: {
    backgroundColor: '#4CAF50',
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  wellnessHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  wellnessHeaderIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  wellnessHeaderText: {
    flex: 1,
  },
  wellnessHeaderTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  wellnessHeaderSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  wellnessAddButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wellnessStatsPanel: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  wellnessStatsContent: {
    marginBottom: 16,
  },
  wellnessStatsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  wellnessStatsSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  wellnessProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  wellnessProgressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginRight: 12,
  },
  wellnessProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  wellnessProgressText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  wellnessMotivationalText: {
    fontSize: 14,
    color: '#4B5563',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  wellnessDetailedStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  wellnessStatCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  wellnessStatIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  wellnessStatContent: {
    alignItems: 'center',
  },
  wellnessStatNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  wellnessStatLabel: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
  },
  wellnessRoutinesContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  wellnessRoutinesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  wellnessRoutineCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  wellnessRoutineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  wellnessRoutineHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  wellnessRoutineIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  wellnessRoutineInfo: {
    flex: 1,
  },
  wellnessRoutineTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  wellnessRoutineDescription: {
    fontSize: 12,
    color: '#6B7280',
  },
  wellnessRoutineBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  wellnessRoutineBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  wellnessRoutineProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  wellnessRoutineProgressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    marginRight: 12,
  },
  wellnessRoutineProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  wellnessRoutineProgressText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  wellnessRoutineDays: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  wellnessRoutineDaysLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  wellnessRoutineDaysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  wellnessRoutineDay: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wellnessRoutineDayActive: {
    backgroundColor: '#4CAF50',
  },
  wellnessRoutineDayText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#6B7280',
  },
  wellnessRoutineDayTextActive: {
    color: '#FFFFFF',
  },
  wellnessRoutineActivities: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  wellnessActivityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  wellnessActivityLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  wellnessActivityNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  wellnessActivityNumberText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  wellnessActivityInfo: {
    flex: 1,
  },
  wellnessActivityName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  wellnessActivityMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wellnessActivityTime: {
    fontSize: 12,
    color: '#6B7280',
    marginRight: 8,
  },
  wellnessActivityDuration: {
    fontSize: 12,
    color: '#6B7280',
    marginRight: 8,
  },
  wellnessActivityCategory: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
  },
  wellnessActivityCheck: {
    padding: 4,
  },
  wellnessRoutineFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  wellnessRoutineStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wellnessRoutineStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  wellnessRoutineStatText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  wellnessRoutineActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wellnessRoutineAction: {
    padding: 8,
    marginLeft: 4,
  },
  wellnessActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  wellnessActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  wellnessActionText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
    color: '#1F2937',
  },

  // Estilos para la nueva UI de Diario de Cuidado Personal
  journalContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  journalHeader: {
    backgroundColor: '#E91E63',
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  journalHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  journalHeaderIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  journalHeaderText: {
    flex: 1,
  },
  journalHeaderTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  journalHeaderSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  journalAddButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  journalStatsPanel: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  journalStatsContent: {
    marginBottom: 16,
  },
  journalStatsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  journalStatsSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  journalStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  journalStatCard: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  journalStatIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  journalStatNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  journalStatLabel: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
  },
  journalEntriesContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  journalEntriesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  journalEntryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  journalEntryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  journalEntryDateInfo: {
    flex: 1,
  },
  journalEntryDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  journalEntryDay: {
    fontSize: 12,
    color: '#6B7280',
  },
  journalEntryMood: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  journalEntryMoodEmoji: {
    fontSize: 20,
    marginRight: 6,
  },
  journalEntryMoodText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  journalEntryWellness: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F8F9FA',
  },
  journalEntryWellnessItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  journalEntryWellnessText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  journalEntryContent: {
    flexDirection: 'row',
    padding: 16,
  },
  journalEntryColumn: {
    flex: 1,
    marginHorizontal: 8,
  },
  journalEntrySection: {
    marginBottom: 16,
  },
  journalEntrySectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  journalEntrySectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
  },
  journalEntryList: {
    marginLeft: 8,
  },
  journalEntryListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  journalEntryListItemText: {
    fontSize: 12,
    color: '#4B5563',
    marginLeft: 8,
    flex: 1,
  },
  journalEntryHydration: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginLeft: 8,
  },
  journalEntryHydrationText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 8,
  },
  journalEntryText: {
    fontSize: 12,
    color: '#4B5563',
    marginLeft: 8,
    fontStyle: 'italic',
  },
  journalEntryTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: 8,
  },
  journalEntryTag: {
    backgroundColor: '#E91E63',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 6,
  },
  journalEntryTagText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  journalEntryNotes: {
    fontSize: 12,
    color: '#4B5563',
    marginLeft: 8,
    lineHeight: 18,
  },
  journalEntryFooter: {
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  journalEntryActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  journalEntryAction: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  journalEntryActionText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
    color: '#1F2937',
  },
  journalActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  journalActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  journalActionText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
    color: '#1F2937',
  },

  // Estilos para la nueva UI de Planificador de Cuidado Personal
  plannerContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  plannerHeader: {
    backgroundColor: '#9C27B0',
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  plannerHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  plannerHeaderIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  plannerHeaderText: {
    flex: 1,
  },
  plannerHeaderTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  plannerHeaderSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  plannerAddButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plannerStatsPanel: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  plannerStatsContent: {
    marginBottom: 16,
  },
  plannerStatsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  plannerStatsSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  plannerStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  plannerStatCard: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  plannerStatIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  plannerStatNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  plannerStatLabel: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
  },
  plannerPlansContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  plannerPlansTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  plannerPlanCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  plannerPlanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  plannerPlanHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  plannerPlanDateInfo: {
    flex: 1,
  },
  plannerPlanDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  plannerPlanDay: {
    fontSize: 12,
    color: '#6B7280',
  },
  plannerPlanPriority: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 12,
  },
  plannerPlanPriorityText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  plannerPlanMood: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  plannerPlanMoodEmoji: {
    fontSize: 20,
    marginRight: 6,
  },
  plannerPlanMoodText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  plannerPlanWellness: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F8F9FA',
  },
  plannerPlanWellnessItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  plannerPlanWellnessText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  plannerPlanProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  plannerPlanProgressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    marginRight: 12,
  },
  plannerPlanProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  plannerPlanProgressText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  plannerPlanContent: {
    flexDirection: 'row',
    padding: 16,
  },
  plannerPlanColumn: {
    flex: 1,
    marginHorizontal: 8,
  },
  plannerPlanAdditional: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  plannerPlanSection: {
    marginBottom: 16,
  },
  plannerPlanSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  plannerPlanSectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
  },
  plannerPlanList: {
    marginLeft: 8,
  },
  plannerPlanListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  plannerPlanListItemText: {
    fontSize: 12,
    color: '#4B5563',
    marginLeft: 8,
    flex: 1,
  },
  plannerPlanWorkout: {
    marginLeft: 8,
  },
  plannerPlanWorkoutType: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  plannerPlanWorkoutDuration: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  plannerPlanWorkoutIntensity: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  plannerPlanWorkoutExercises: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  plannerPlanWorkoutExercise: {
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 6,
  },
  plannerPlanWorkoutExerciseText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  plannerPlanSleep: {
    marginLeft: 8,
  },
  plannerPlanSleepIcons: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  plannerPlanSleepText: {
    fontSize: 12,
    color: '#6B7280',
  },
  plannerPlanWater: {
    marginLeft: 8,
  },
  plannerPlanWaterIcons: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  plannerPlanWaterText: {
    fontSize: 12,
    color: '#6B7280',
  },
  plannerPlanText: {
    fontSize: 12,
    color: '#4B5563',
    marginLeft: 8,
    lineHeight: 18,
  },
  plannerPlanTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: 8,
  },
  plannerPlanTag: {
    backgroundColor: '#9C27B0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 6,
  },
  plannerPlanTagText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  plannerPlanFooter: {
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  plannerPlanActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  plannerPlanAction: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  plannerPlanActionText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
    color: '#1F2937',
  },
  plannerActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  plannerActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  plannerActionText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
    color: '#1F2937',
  },

  // Estilos para la nueva UI de Registro Mensual de Hábitos
  habitLogContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  habitLogHeader: {
    backgroundColor: '#4CAF50',
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  habitLogHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  habitLogHeaderIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  habitLogHeaderText: {
    flex: 1,
  },
  habitLogHeaderTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  habitLogHeaderSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  habitLogAddButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  habitLogStatsPanel: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  habitLogStatsContent: {
    marginBottom: 16,
  },
  habitLogStatsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  habitLogStatsSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  habitLogStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  habitLogStatCard: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  habitLogStatIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  habitLogStatNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  habitLogStatLabel: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
  },
  habitLogWeeksContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  habitLogWeekSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  habitLogWeekHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  habitLogWeekHeaderLeft: {
    flex: 1,
  },
  habitLogWeekTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  habitLogWeekSubtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  habitLogWeekProgress: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  habitLogWeekProgressText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  habitLogDaysHeader: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F8F9FA',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  habitLogHabitLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    flex: 1,
  },
  habitLogDaysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 140,
  },
  habitLogDayLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#6B7280',
    textAlign: 'center',
    width: 20,
  },
  habitLogHabitRow: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  habitLogHabitInfo: {
    flex: 1,
    marginRight: 16,
  },
  habitLogHabitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  habitLogHabitCategory: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  habitLogHabitCategoryEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  habitLogHabitCategoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  habitLogHabitPriority: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  habitLogHabitPriorityText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  habitLogHabitText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  habitLogHabitStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  habitLogHabitStat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  habitLogHabitStatText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  habitLogCheckboxesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 140,
  },
  habitLogCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  habitLogActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  habitLogActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  habitLogActionText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
    color: '#1F2937',
  },

  // Estilos para la nueva UI de Seguimiento de Hábitos y Objetivos
  habitGoalContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  habitGoalHeader: {
    backgroundColor: '#FF9800',
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  habitGoalHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  habitGoalHeaderIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  habitGoalHeaderText: {
    flex: 1,
  },
  habitGoalHeaderTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  habitGoalHeaderSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  habitGoalAddButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  habitGoalStatsPanel: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  habitGoalStatsContent: {
    marginBottom: 16,
  },
  habitGoalStatsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  habitGoalStatsSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  habitGoalStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  habitGoalStatCard: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  habitGoalStatIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  habitGoalStatNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  habitGoalStatLabel: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
  },
  habitGoalObjectivesContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  habitGoalObjectivesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  habitGoalObjectiveCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  habitGoalObjectiveHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  habitGoalObjectiveHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  habitGoalObjectiveCategory: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  habitGoalObjectiveCategoryEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  habitGoalObjectiveCategoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  habitGoalObjectivePriority: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  habitGoalObjectivePriorityText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  habitGoalObjectiveStatus: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  habitGoalObjectiveStatusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  habitGoalObjectiveInfo: {
    marginBottom: 16,
  },
  habitGoalObjectiveTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  habitGoalObjectiveDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  habitGoalObjectiveProgress: {
    marginBottom: 16,
  },
  habitGoalObjectiveProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  habitGoalObjectiveProgressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  habitGoalObjectiveProgressText: {
    fontSize: 12,
    color: '#6B7280',
  },
  habitGoalObjectiveProgressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 4,
  },
  habitGoalObjectiveProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  habitGoalObjectiveProgressPercentage: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'right',
  },
  habitGoalObjectiveDates: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  habitGoalObjectiveDate: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  habitGoalObjectiveDateText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 6,
  },
  habitGoalAchievementsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  habitGoalAchievementsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  habitGoalAchievementCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  habitGoalAchievementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  habitGoalAchievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  habitGoalAchievementInfo: {
    flex: 1,
  },
  habitGoalAchievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  habitGoalAchievementDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  habitGoalAchievementDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  habitGoalRemindersContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  habitGoalRemindersTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  habitGoalReminderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  habitGoalReminderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  habitGoalReminderIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF3E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  habitGoalReminderInfo: {
    flex: 1,
  },
  habitGoalReminderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  habitGoalReminderTime: {
    fontSize: 14,
    color: '#6B7280',
  },
  habitGoalReminderDays: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  habitGoalReminderDay: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
    marginBottom: 4,
  },
  habitGoalReminderDayText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#6B7280',
  },
  habitGoalNotesContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  habitGoalNotesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  habitGoalNoteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  habitGoalNoteIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  habitGoalNoteText: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
    lineHeight: 20,
  },
  habitGoalActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  habitGoalActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  habitGoalActionText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
    color: '#1F2937',
  },

  // Estilos para la nueva UI de Seguimiento del Estado de Ánimo
  moodTrackerContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  moodTrackerHeader: {
    backgroundColor: '#E91E63',
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  moodTrackerHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  moodTrackerHeaderIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  moodTrackerHeaderText: {
    flex: 1,
  },
  moodTrackerHeaderTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  moodTrackerHeaderSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  moodTrackerAddButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moodTrackerCurrentMood: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  moodTrackerCurrentMoodContent: {
    marginBottom: 16,
  },
  moodTrackerCurrentMoodTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  moodTrackerCurrentMoodSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  moodTrackerCurrentMoodCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  moodTrackerCurrentMoodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  moodTrackerCurrentMoodIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  moodTrackerCurrentMoodEmoji: {
    fontSize: 32,
  },
  moodTrackerCurrentMoodInfo: {
    flex: 1,
  },
  moodTrackerCurrentMoodLevel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  moodTrackerCurrentMoodDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  moodTrackerCurrentMoodActivities: {
    marginBottom: 16,
  },
  moodTrackerCurrentMoodActivitiesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  moodTrackerCurrentMoodActivitiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  moodTrackerCurrentMoodActivity: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  moodTrackerCurrentMoodActivityText: {
    fontSize: 12,
    color: '#6B7280',
  },
  moodTrackerCurrentMoodNotes: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#6B7280',
    lineHeight: 20,
  },
  moodTrackerStatsPanel: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  moodTrackerStatsContent: {
    marginBottom: 16,
  },
  moodTrackerStatsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  moodTrackerStatsSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  moodTrackerStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  moodTrackerStatCard: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  moodTrackerStatIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  moodTrackerStatNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  moodTrackerStatLabel: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
  },
  moodTrackerWeeklyContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  moodTrackerWeeklyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  moodTrackerWeeklyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  moodTrackerWeeklyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  moodTrackerWeeklyDate: {
    flex: 1,
  },
  moodTrackerWeeklyDateText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  moodTrackerWeeklyMood: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moodTrackerWeeklyMoodEmoji: {
    fontSize: 20,
  },
  moodTrackerWeeklyInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  moodTrackerWeeklyLevel: {
    fontSize: 12,
    color: '#6B7280',
  },
  moodTrackerWeeklyDescription: {
    fontSize: 12,
    color: '#6B7280',
  },
  moodTrackerActivitiesContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  moodTrackerActivitiesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  moodTrackerActivityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  moodTrackerActivityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moodTrackerActivityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  moodTrackerActivityEmoji: {
    fontSize: 20,
  },
  moodTrackerActivityInfo: {
    flex: 1,
  },
  moodTrackerActivityName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  moodTrackerActivityFrequency: {
    fontSize: 14,
    color: '#6B7280',
  },
  moodTrackerMonthlyContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  moodTrackerMonthlyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  moodTrackerMonthlyChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  moodTrackerMonthlyBar: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 2,
  },
  moodTrackerMonthlyBarContainer: {
    height: 60,
    width: 20,
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  moodTrackerMonthlyBarFill: {
    width: '100%',
    borderRadius: 10,
  },
  moodTrackerMonthlyBarLabel: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 4,
  },
  moodTrackerMonthlyBarValue: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  moodTrackerNotesContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  moodTrackerNotesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  moodTrackerNoteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  moodTrackerNoteIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  moodTrackerNoteText: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
    lineHeight: 20,
  },
  moodTrackerMantraContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  moodTrackerMantraTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  moodTrackerMantraCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  moodTrackerMantraIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF3E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  moodTrackerMantraText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#1F2937',
    flex: 1,
    lineHeight: 24,
  },
  moodTrackerActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  moodTrackerActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  moodTrackerActionText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
    color: '#1F2937',
  },

  // Estilos para la nueva UI de Seguimiento Diario de Hábitos
  dailyHabitContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  dailyHabitHeader: {
    backgroundColor: '#9C27B0',
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dailyHabitHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dailyHabitHeaderIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  dailyHabitHeaderText: {
    flex: 1,
  },
  dailyHabitHeaderTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  dailyHabitHeaderSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  dailyHabitAddButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dailyHabitStatsPanel: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dailyHabitStatsContent: {
    marginBottom: 16,
  },
  dailyHabitStatsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  dailyHabitStatsSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  dailyHabitStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dailyHabitStatCard: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  dailyHabitStatIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  dailyHabitStatNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  dailyHabitStatLabel: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
  },
  dailyHabitPeriodContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  dailyHabitPeriodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dailyHabitPeriodHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dailyHabitPeriodEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  dailyHabitPeriodInfo: {
    flex: 1,
  },
  dailyHabitPeriodTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  dailyHabitPeriodSubtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  dailyHabitPeriodProgress: {
    backgroundColor: '#9C27B0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  dailyHabitPeriodProgressText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  dailyHabitDaysHeader: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F8F9FA',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  dailyHabitHabitLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    flex: 1,
  },
  dailyHabitDaysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 140,
  },
  dailyHabitDayLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#6B7280',
    textAlign: 'center',
    width: 20,
  },
  dailyHabitHabitRow: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dailyHabitHabitInfo: {
    flex: 1,
    marginRight: 16,
  },
  dailyHabitHabitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dailyHabitHabitCategory: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dailyHabitHabitCategoryEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  dailyHabitHabitCategoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  dailyHabitHabitPriority: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  dailyHabitHabitPriorityText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  dailyHabitHabitText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  dailyHabitHabitDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dailyHabitHabitDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dailyHabitHabitDetailText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  dailyHabitCheckboxesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 140,
  },
  dailyHabitCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dailyHabitActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  dailyHabitActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  dailyHabitActionText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
    color: '#1F2937',
  },

  // Estilos para la nueva UI de Monitor de Hábitos
  habitMonitorContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  habitMonitorHeader: {
    backgroundColor: '#673AB7',
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  habitMonitorHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  habitMonitorHeaderIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  habitMonitorHeaderText: {
    flex: 1,
  },
  habitMonitorHeaderTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  habitMonitorHeaderSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  habitMonitorAddButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  habitMonitorStatsPanel: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  habitMonitorStatsContent: {
    marginBottom: 16,
  },
  habitMonitorStatsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  habitMonitorStatsSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  habitMonitorStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  habitMonitorStatCard: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  habitMonitorStatIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  habitMonitorStatNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  habitMonitorStatLabel: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
  },
  habitMonitorHabitsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  habitMonitorHabitsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  habitMonitorHabitCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  habitMonitorHabitHeader: {
    marginBottom: 16,
  },
  habitMonitorHabitInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  habitMonitorHabitCategory: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  habitMonitorHabitCategoryEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  habitMonitorHabitCategoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  habitMonitorHabitPriority: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  habitMonitorHabitPriorityText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  habitMonitorHabitTitle: {
    flex: 1,
  },
  habitMonitorHabitName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  habitMonitorHabitTarget: {
    fontSize: 14,
    color: '#6B7280',
  },
  habitMonitorHabitStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  habitMonitorHabitStat: {
    flex: 1,
    alignItems: 'center',
  },
  habitMonitorHabitStatLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  habitMonitorHabitStatValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  habitMonitorHabitProgress: {
    marginBottom: 16,
  },
  habitMonitorHabitProgressBar: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    marginBottom: 8,
  },
  habitMonitorHabitProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  habitMonitorHabitProgressText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  habitMonitorHabitCalendar: {
    marginTop: 16,
  },
  habitMonitorHabitCalendarTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  habitMonitorHabitCalendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  habitMonitorHabitCalendarDay: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    borderWidth: 1,
  },
  habitMonitorHabitCalendarLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  habitMonitorHabitCalendarLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  habitMonitorHabitCalendarLegendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  habitMonitorHabitCalendarLegendText: {
    fontSize: 12,
    color: '#6B7280',
  },
  habitMonitorTrendsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  habitMonitorTrendsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  habitMonitorTrendsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  habitMonitorTrendCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  habitMonitorTrendIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  habitMonitorTrendTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  habitMonitorTrendDescription: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
  },
  habitMonitorActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  habitMonitorActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  habitMonitorActionText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
    color: '#1F2937',
  },
});

export default SelfCareSections;
