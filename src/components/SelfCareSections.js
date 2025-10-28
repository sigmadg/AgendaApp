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

  // Estados para Water Tracker
  const [waterTracker, setWaterTracker] = useState({
    week1: Array(7).fill(0),
    week2: Array(7).fill(0),
    week3: Array(7).fill(0),
    week4: Array(7).fill(0)
  });

  // Estados para Habit Monitor
  const [habitMonitor, setHabitMonitor] = useState({
    habits: Array(10).fill(''),
    monthlyTracking: Array(10).fill(Array(31).fill(false))
  });

  const sections = [
    { id: 'self-care-checklist', name: 'Self Care Checklist', icon: 'checkmark-circle-outline' },
    { id: 'wellness-scheduler', name: 'Wellness Scheduler', icon: 'calendar-outline' },
    { id: 'self-care-journal', name: 'Self Care Journal', icon: 'book-outline' },
    { id: 'self-care-planner', name: 'Self Care Planner', icon: 'clipboard-outline' },
    { id: 'monthly-habit-log', name: 'Registro Mensual de Hábitos', icon: 'calendar-outline' },
    { id: 'habit-goal-tracker', name: 'Seguimiento de Hábitos y Objetivos', icon: 'trophy-outline' },
    { id: 'mood-tracker', name: 'Seguimiento del Estado de Ánimo', icon: 'happy-outline' },
    { id: 'daily-habit-tracker', name: 'Seguimiento Diario de Hábitos', icon: 'checkmark-circle-outline' },
    { id: 'water-tracker', name: 'Seguimiento de Agua', icon: 'water-outline' },
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

  // Funciones para Water Tracker
  const updateWaterIntake = (week, dayIndex, amount) => {
    setWaterTracker(prev => ({
      ...prev,
      [week]: prev[week].map((intake, index) =>
        index === dayIndex ? Math.min(8, Math.max(0, amount)) : intake
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

  const renderSelfCareChecklist = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>SELF CARE CHECKLIST</Text>
        <View style={styles.crownIcon}>
          <Icon name="star" size={20} color="#FF6B9D" />
        </View>
      </View>

      <View style={styles.checklistContainer}>
        <View style={styles.checklistColumn}>
          <View style={styles.timeSection}>
            <Text style={styles.timeSectionTitle}>MAÑANA</Text>
            {checklistItems.morning.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.checklistItem}
                onPress={() => toggleChecklistItem('morning', item.id)}
              >
                <Icon
                  name={item.completed ? 'checkbox' : 'square-outline'}
                  size={20}
                  color={item.completed ? '#4CAF50' : '#6c757d'}
                />
                <Text style={[
                  styles.checklistText,
                  item.completed && styles.completedText
                ]}>
                  {item.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.timeSection}>
            <Text style={styles.timeSectionTitle}>NOCHE</Text>
            {checklistItems.evening.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.checklistItem}
                onPress={() => toggleChecklistItem('evening', item.id)}
              >
                <Icon
                  name={item.completed ? 'checkbox' : 'square-outline'}
                  size={20}
                  color={item.completed ? '#4CAF50' : '#6c757d'}
                />
                <Text style={[
                  styles.checklistText,
                  item.completed && styles.completedText
                ]}>
                  {item.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.checklistColumn}>
          <View style={styles.timeSection}>
            <Text style={styles.timeSectionTitle}>TARDE</Text>
            {checklistItems.afternoon.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.checklistItem}
                onPress={() => toggleChecklistItem('afternoon', item.id)}
              >
                <Icon
                  name={item.completed ? 'checkbox' : 'square-outline'}
                  size={20}
                  color={item.completed ? '#4CAF50' : '#6c757d'}
                />
                <Text style={[
                  styles.checklistText,
                  item.completed && styles.completedText
                ]}>
                  {item.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.timeSection}>
            <Text style={styles.timeSectionTitle}>CUALQUIER MOMENTO</Text>
            {checklistItems.anytime.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.checklistItem}
                onPress={() => toggleChecklistItem('anytime', item.id)}
              >
                <Icon
                  name={item.completed ? 'checkbox' : 'square-outline'}
                  size={20}
                  color={item.completed ? '#4CAF50' : '#6c757d'}
                />
                <Text style={[
                  styles.checklistText,
                  item.completed && styles.completedText
                ]}>
                  {item.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </View>
  );

  const renderWellnessScheduler = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>PERSONAL WELLNESS SCHEDULER</Text>
        <TouchableOpacity onPress={openAddWellnessModal} style={styles.addButton}>
          <Icon name="add" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {wellnessSchedules.length === 0 ? (
        <View style={styles.emptyState}>
          <Icon name="calendar-outline" size={48} color="#E0E0E0" />
          <Text style={styles.emptyText}>No hay horarios de bienestar</Text>
          <Text style={styles.emptySubtext}>Toca el botón + para crear tu primer horario</Text>
        </View>
      ) : (
        <ScrollView style={styles.schedulesList}>
          {wellnessSchedules.map((schedule) => (
            <View key={schedule.id} style={styles.scheduleCard}>
              <View style={styles.weekHeader}>
                <Text style={styles.weekHeaderText}>L M M J V S D</Text>
              </View>
              {schedule.activities.map((activity, index) => (
                <View key={index} style={styles.activityRow}>
                  <Text style={styles.activityNumber}>{index + 1}</Text>
                  <Text style={styles.activityText}>{activity}</Text>
                  <View style={styles.weekCheckboxes}>
                    {schedule.weekDays.map((day, dayIndex) => (
                      <Icon
                        key={dayIndex}
                        name={day ? 'checkbox' : 'ellipse-outline'}
                        size={16}
                        color={day ? '#4CAF50' : '#6c757d'}
                      />
                    ))}
                  </View>
                </View>
              ))}
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );

  const renderSelfCareJournal = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>SELF CARE JOURNAL</Text>
        <TouchableOpacity onPress={openAddJournalModal} style={styles.addButton}>
          <Icon name="add" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {journalEntries.length === 0 ? (
        <View style={styles.emptyState}>
          <Icon name="book-outline" size={48} color="#E0E0E0" />
          <Text style={styles.emptyText}>No hay entradas de diario</Text>
          <Text style={styles.emptySubtext}>Toca el botón + para crear tu primera entrada</Text>
        </View>
      ) : (
        <ScrollView style={styles.journalList}>
          {journalEntries.map((entry) => (
            <View key={entry.id} style={styles.journalCard}>
              <View style={styles.journalHeader}>
                <Text style={styles.journalDate}>{entry.date}</Text>
                <View style={styles.moodIndicator}>
                  <Text style={styles.moodText}>{entry.mood}</Text>
                </View>
              </View>
              
              <View style={styles.journalContent}>
                <View style={styles.journalColumn}>
                  <Text style={styles.journalSubtitle}>SOY AGRADECIDO POR:</Text>
                  {entry.gratefulFor.map((item, index) => (
                    <Text key={index} style={styles.journalItem}>• {item}</Text>
                  ))}
                  
                  <Text style={styles.journalSubtitle}>LOGROS:</Text>
                  {entry.achievements.map((item, index) => (
                    <Text key={index} style={styles.journalItem}>• {item}</Text>
                  ))}
                  
                  <Text style={styles.journalSubtitle}>HIDRATACIÓN:</Text>
                  <View style={styles.waterIcons}>
                    {[...Array(8)].map((_, index) => (
                      <Icon
                        key={index}
                        name={index < entry.hydration ? 'water' : 'water-outline'}
                        size={20}
                        color={index < entry.hydration ? '#4FC3F7' : '#6c757d'}
                      />
                    ))}
                  </View>
                </View>

                <View style={styles.journalColumn}>
                  <Text style={styles.journalSubtitle}>RECORDATORIO:</Text>
                  <Text style={styles.journalText}>{entry.reminder}</Text>
                  
                  <Text style={styles.journalSubtitle}>PLAN PARA MAÑANA:</Text>
                  {entry.tomorrowPlan.map((item, index) => (
                    <Text key={index} style={styles.journalItem}>• {item}</Text>
                  ))}
                </View>
              </View>
              
              <View style={styles.notesSection}>
                <Text style={styles.journalSubtitle}>NOTAS:</Text>
                <Text style={styles.notesText}>{entry.notes}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );

  const renderSelfCarePlanner = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>SELF CARE PLANNER</Text>
        <TouchableOpacity onPress={openAddSelfCareModal} style={styles.addButton}>
          <Icon name="add" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {selfCarePlans.length === 0 ? (
        <View style={styles.emptyState}>
          <Icon name="clipboard-outline" size={48} color="#E0E0E0" />
          <Text style={styles.emptyText}>No hay planes de cuidado personal</Text>
          <Text style={styles.emptySubtext}>Toca el botón + para crear tu primer plan</Text>
        </View>
      ) : (
        <ScrollView style={styles.plansList}>
          {selfCarePlans.map((plan) => (
            <View key={plan.id} style={styles.planCard}>
              <View style={styles.planHeader}>
                <Text style={styles.planDate}>{plan.date}</Text>
                <View style={styles.moodIndicator}>
                  <Text style={styles.moodText}>{plan.mood}</Text>
                </View>
              </View>
              
              <View style={styles.plannerContent}>
                <View style={styles.plannerColumn}>
                  <Text style={styles.plannerSubtitle}>POR HACER:</Text>
                  {plan.todo.map((item, index) => (
                    <View key={index} style={styles.todoItem}>
                      <Icon name="ellipse-outline" size={16} color="#6c757d" />
                      <Text style={styles.todoText}>{item}</Text>
                    </View>
                  ))}
                  
                  <Text style={styles.plannerSubtitle}>EJERCICIO:</Text>
                  <Text style={styles.workoutText}>{plan.workout}</Text>
                  
                  <Text style={styles.plannerSubtitle}>HORAS DE SUEÑO:</Text>
                  <View style={styles.sleepIcons}>
                    {[...Array(8)].map((_, index) => (
                      <Icon
                        key={index}
                        name={index < plan.sleepHours ? 'moon' : 'moon-outline'}
                        size={20}
                        color={index < plan.sleepHours ? '#9C27B0' : '#6c757d'}
                      />
                    ))}
                  </View>
                  
                  <Text style={styles.plannerSubtitle}>CONSUMO DE AGUA:</Text>
                  <View style={styles.waterIcons}>
                    {[...Array(8)].map((_, index) => (
                      <Icon
                        key={index}
                        name={index < plan.waterIntake ? 'water' : 'water-outline'}
                        size={20}
                        color={index < plan.waterIntake ? '#4FC3F7' : '#6c757d'}
                      />
                    ))}
                  </View>
                </View>

                <View style={styles.plannerColumn}>
                  <Text style={styles.plannerSubtitle}>¿CUÁL ES TU COSA FAVORITA?</Text>
                  <Text style={styles.favoriteText}>{plan.favoriteThing}</Text>
                  
                  <Text style={styles.plannerSubtitle}>¿QUÉ NO TE GUSTA HACER?</Text>
                  <Text style={styles.dontLikeText}>{plan.dontLike}</Text>
                  
                  <Text style={styles.plannerSubtitle}>TU PARTE FAVORITA DEL DÍA:</Text>
                  <Text style={styles.favoritePartText}>{plan.favoritePart}</Text>
                  
                  <Text style={styles.plannerSubtitle}>OBJETIVOS PARA MAÑANA:</Text>
                  {plan.goalsTomorrow.map((item, index) => (
                    <Text key={index} style={styles.goalText}>• {item}</Text>
                  ))}
                </View>
              </View>
              
              <View style={styles.notesSection}>
                <Text style={styles.plannerSubtitle}>NOTAS:</Text>
                {plan.notes.map((note, index) => (
                  <View key={index} style={styles.noteItem}>
                    <Icon name="ellipse-outline" size={16} color="#6c757d" />
                    <Text style={styles.noteText}>{note}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );

  // Funciones de renderizado para las subsecciones del habit tracker
  const renderMonthlyHabitLog = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>REGISTRO MENSUAL DE HÁBITOS</Text>
        <View style={styles.crownIcon}>
          <Icon name="star" size={20} color="#FF6B9D" />
        </View>
      </View>

      {['week1', 'week2', 'week3', 'week4'].map((week, weekIndex) => (
        <View key={week} style={styles.weekSection}>
          <Text style={styles.weekTitle}>SEMANA {weekIndex + 1}</Text>
          <View style={styles.weekHeader}>
            <Text style={styles.habitLabel}>HÁBITO</Text>
            <View style={styles.daysHeader}>
              <Text style={styles.dayLabel}>L</Text>
              <Text style={styles.dayLabel}>M</Text>
              <Text style={styles.dayLabel}>X</Text>
              <Text style={styles.dayLabel}>J</Text>
              <Text style={styles.dayLabel}>V</Text>
              <Text style={styles.dayLabel}>S</Text>
              <Text style={styles.dayLabel}>D</Text>
            </View>
          </View>
          
          {monthlyHabits[week].map((habit) => (
            <View key={habit.id} style={styles.habitRow}>
              <TextInput
                style={styles.habitInput}
                value={habit.text}
                onChangeText={(text) => updateHabitText(week, habit.id, text)}
                placeholder="Escribir hábito..."
                placeholderTextColor="#adb5bd"
              />
              <View style={styles.checkboxesContainer}>
                {habit.completed.map((completed, dayIndex) => (
                  <TouchableOpacity
                    key={dayIndex}
                    style={styles.checkbox}
                    onPress={() => toggleHabitCompletion(week, habit.id, dayIndex)}
                  >
                    <Icon
                      name={completed ? 'checkbox' : 'square-outline'}
                      size={16}
                      color={completed ? '#4CAF50' : '#6c757d'}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </View>
      ))}
    </View>
  );

  const renderHabitGoalTracker = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>SEGUIMIENTO DE HÁBITOS Y OBJETIVOS</Text>
        <View style={styles.crownIcon}>
          <Icon name="star" size={20} color="#FF6B9D" />
        </View>
      </View>

      <View style={styles.goalTrackerContent}>
        <View style={styles.goalInputsColumn}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>OBJETIVOS</Text>
            <TextInput
              style={styles.textInput}
              value={habitGoals.goals}
              onChangeText={(text) => setHabitGoals({...habitGoals, goals: text})}
              placeholder="Mis objetivos..."
              multiline
              numberOfLines={3}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>RECORDATORIO</Text>
            <TextInput
              style={styles.textInput}
              value={habitGoals.reminder}
              onChangeText={(text) => setHabitGoals({...habitGoals, reminder: text})}
              placeholder="Recordatorios importantes..."
              multiline
              numberOfLines={2}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>LOGROS</Text>
            <TextInput
              style={styles.textInput}
              value={habitGoals.achievements}
              onChangeText={(text) => setHabitGoals({...habitGoals, achievements: text})}
              placeholder="Mis logros..."
              multiline
              numberOfLines={3}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>NOTAS</Text>
            <TextInput
              style={styles.textInput}
              value={habitGoals.notes}
              onChangeText={(text) => setHabitGoals({...habitGoals, notes: text})}
              placeholder="Notas adicionales..."
              multiline
              numberOfLines={2}
            />
          </View>
        </View>

        <View style={styles.monthlyGridColumn}>
          <View style={styles.monthlyGridHeader}>
            {Array.from({ length: 31 }, (_, i) => (
              <Text key={i} style={styles.dayNumber}>{i + 1}</Text>
            ))}
          </View>
          
          <View style={styles.monthlyGrid}>
            {Array.from({ length: 5 }, (_, rowIndex) => (
              <View key={rowIndex} style={styles.gridRow}>
                <TextInput
                  style={styles.habitNameInput}
                  placeholder="Hábito"
                  placeholderTextColor="#adb5bd"
                />
                {Array.from({ length: 31 }, (_, dayIndex) => (
                  <TouchableOpacity
                    key={dayIndex}
                    style={styles.gridCheckbox}
                    onPress={() => {
                      const newTracking = [...habitGoals.monthlyTracking];
                      newTracking[dayIndex] = !newTracking[dayIndex];
                      setHabitGoals({...habitGoals, monthlyTracking: newTracking});
                    }}
                  >
                    <Icon
                      name={habitGoals.monthlyTracking[dayIndex] ? 'checkbox' : 'square-outline'}
                      size={12}
                      color={habitGoals.monthlyTracking[dayIndex] ? '#4CAF50' : '#6c757d'}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );

  const renderMoodTracker = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>SEGUIMIENTO DEL ESTADO DE ÁNIMO</Text>
        <View style={styles.crownIcon}>
          <Icon name="star" size={20} color="#FF6B9D" />
        </View>
      </View>

      <View style={styles.moodTrackerContent}>
        <View style={styles.moodGridHeader}>
          <Text style={styles.monthLabel}>ENE</Text>
          <Text style={styles.monthLabel}>FEB</Text>
          <Text style={styles.monthLabel}>MAR</Text>
          <Text style={styles.monthLabel}>ABR</Text>
          <Text style={styles.monthLabel}>MAY</Text>
          <Text style={styles.monthLabel}>JUN</Text>
          <Text style={styles.monthLabel}>JUL</Text>
          <Text style={styles.monthLabel}>AGO</Text>
          <Text style={styles.monthLabel}>SEP</Text>
          <Text style={styles.monthLabel}>OCT</Text>
          <Text style={styles.monthLabel}>NOV</Text>
          <Text style={styles.monthLabel}>DIC</Text>
        </View>
        
        <View style={styles.moodGrid}>
          {Array.from({ length: 31 }, (_, dayIndex) => (
            <View key={dayIndex} style={styles.moodRow}>
              <Text style={styles.dayNumber}>{dayIndex + 1}</Text>
              {Array.from({ length: 12 }, (_, monthIndex) => (
                <TouchableOpacity
                  key={monthIndex}
                  style={styles.moodCell}
                  onPress={() => {
                    const newMoods = [...moodTracker.monthlyMoods];
                    newMoods[monthIndex] = [...newMoods[monthIndex]];
                    newMoods[monthIndex][dayIndex] = newMoods[monthIndex][dayIndex] ? '' : '😊';
                    setMoodTracker({...moodTracker, monthlyMoods: newMoods});
                  }}
                >
                  <Text style={styles.moodEmoji}>
                    {moodTracker.monthlyMoods[monthIndex][dayIndex]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>
        
        <View style={styles.moodNotesSection}>
          <View style={styles.notesColumn}>
            <Text style={styles.inputLabel}>NOTAS</Text>
            <TextInput
              style={styles.textInput}
              value={moodTracker.notes}
              onChangeText={(text) => setMoodTracker({...moodTracker, notes: text})}
              placeholder="Notas sobre el estado de ánimo..."
              multiline
              numberOfLines={3}
            />
          </View>
          
          <View style={styles.mantraColumn}>
            <Text style={styles.inputLabel}>MANTRA DEL AÑO</Text>
            <TextInput
              style={styles.textInput}
              value={moodTracker.yearMantra}
              onChangeText={(text) => setMoodTracker({...moodTracker, yearMantra: text})}
              placeholder="Mi mantra del año..."
              multiline
              numberOfLines={3}
            />
          </View>
        </View>
      </View>
    </View>
  );

  const renderDailyHabitTracker = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>SEGUIMIENTO DIARIO DE HÁBITOS</Text>
        <View style={styles.crownIcon}>
          <Icon name="star" size={20} color="#FF6B9D" />
        </View>
      </View>

      {[
        { key: 'morning', title: 'Hábitos Matutinos' },
        { key: 'afternoon', title: 'Hábitos Vespertinos' },
        { key: 'evening', title: 'Hábitos Nocturnos' }
      ].map(({ key, title }) => (
        <View key={key} style={styles.dailyHabitSection}>
          <Text style={styles.dailyHabitTitle}>{title}</Text>
          <View style={styles.dailyHabitHeader}>
            <Text style={styles.habitLabel}>HÁBITO</Text>
            <View style={styles.daysHeader}>
              <Text style={styles.dayLabel}>L</Text>
              <Text style={styles.dayLabel}>M</Text>
              <Text style={styles.dayLabel}>X</Text>
              <Text style={styles.dayLabel}>J</Text>
              <Text style={styles.dayLabel}>V</Text>
              <Text style={styles.dayLabel}>S</Text>
              <Text style={styles.dayLabel}>D</Text>
            </View>
          </View>
          
          {dailyHabits[key].map((habit) => (
            <View key={habit.id} style={styles.habitRow}>
              <TextInput
                style={styles.habitInput}
                value={habit.text}
                onChangeText={(text) => updateDailyHabitText(key, habit.id, text)}
                placeholder="Escribir hábito..."
                placeholderTextColor="#adb5bd"
              />
              <View style={styles.checkboxesContainer}>
                {habit.completed.map((completed, dayIndex) => (
                  <TouchableOpacity
                    key={dayIndex}
                    style={styles.checkbox}
                    onPress={() => toggleDailyHabitCompletion(key, habit.id, dayIndex)}
                  >
                    <Icon
                      name={completed ? 'checkbox' : 'square-outline'}
                      size={16}
                      color={completed ? '#4CAF50' : '#6c757d'}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </View>
      ))}
    </View>
  );

  const renderWaterTracker = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>SEGUIMIENTO DE AGUA</Text>
        <View style={styles.crownIcon}>
          <Icon name="star" size={20} color="#FF6B9D" />
        </View>
      </View>

      <View style={styles.waterTrackerContent}>
        <View style={styles.waterGridHeader}>
          <Text style={styles.dayLabel}>Lun</Text>
          <Text style={styles.dayLabel}>Mar</Text>
          <Text style={styles.dayLabel}>Mié</Text>
          <Text style={styles.dayLabel}>Jue</Text>
          <Text style={styles.dayLabel}>Vie</Text>
          <Text style={styles.dayLabel}>Sáb</Text>
          <Text style={styles.dayLabel}>Dom</Text>
        </View>
        
        {['week1', 'week2', 'week3', 'week4'].map((week, weekIndex) => (
          <View key={week} style={styles.waterWeekSection}>
            <Text style={styles.weekTitle}>Semana {weekIndex + 1}</Text>
            <View style={styles.waterWeekRow}>
              {waterTracker[week].map((intake, dayIndex) => (
                <View key={dayIndex} style={styles.waterDayColumn}>
                  <View style={styles.waterIconsContainer}>
                    {Array.from({ length: 8 }, (_, iconIndex) => (
                      <TouchableOpacity
                        key={iconIndex}
                        style={styles.waterIcon}
                        onPress={() => updateWaterIntake(week, dayIndex, iconIndex + 1)}
                      >
                        <Icon
                          name={iconIndex < intake ? 'water' : 'water-outline'}
                          size={16}
                          color={iconIndex < intake ? '#4FC3F7' : '#6c757d'}
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
                  <Text style={styles.waterAmount}>{intake}/8</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderHabitMonitor = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>MONITOR DE HÁBITOS</Text>
        <View style={styles.crownIcon}>
          <Icon name="star" size={20} color="#FF6B9D" />
        </View>
      </View>

      <View style={styles.habitMonitorContent}>
        <View style={styles.monitorGridHeader}>
          {Array.from({ length: 31 }, (_, i) => (
            <Text key={i} style={styles.dayNumber}>{i + 1}</Text>
          ))}
        </View>
        
        <View style={styles.monitorGrid}>
          {habitMonitor.habits.map((habit, habitIndex) => (
            <View key={habitIndex} style={styles.monitorRow}>
              <TextInput
                style={styles.habitNameInput}
                value={habit}
                onChangeText={(text) => updateHabitMonitorText(habitIndex, text)}
                placeholder="Nombre del hábito"
                placeholderTextColor="#adb5bd"
              />
              {habitMonitor.monthlyTracking[habitIndex].map((completed, dayIndex) => (
                <TouchableOpacity
                  key={dayIndex}
                  style={styles.monitorCheckbox}
                  onPress={() => toggleHabitMonitorCompletion(habitIndex, dayIndex)}
                >
                  <Icon
                    name={completed ? 'checkbox' : 'square-outline'}
                    size={12}
                    color={completed ? '#4CAF50' : '#6c757d'}
                  />
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>
      </View>
    </View>
  );

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
      case 'water-tracker':
        return renderWaterTracker();
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
  waterTrackerContent: {
    flex: 1,
  },
  waterGridHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    backgroundColor: '#FF6B9D',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 4,
  },
  waterWeekSection: {
    marginBottom: 16,
  },
  waterWeekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  waterDayColumn: {
    alignItems: 'center',
    flex: 1,
  },
  waterIconsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: 40,
    marginBottom: 4,
  },
  waterIcon: {
    padding: 1,
  },
  waterAmount: {
    fontSize: 10,
    color: '#495057',
    fontWeight: '500',
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
});

export default SelfCareSections;
