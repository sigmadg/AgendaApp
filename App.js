import React, { useState, useEffect } from 'react';
import { StyleSheet, View, StatusBar, Text, TouchableOpacity } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, spacing, borderRadius, shadows } from './src/styles/globalStyles';
// import { FloatingIcons, DecorativeIcons, AnimatedDecorativeIcons } from './src/components/DecorativeIcons';
import Header from './src/components/Header';
import CalendarView from './src/components/CalendarView';
import TaskList from './src/components/TaskList';
import EventsSchedule from './src/components/EventsSchedule';
import WorkSections from './src/components/WorkSections';
import PersonalSections from './src/components/PersonalSections/index';
import HealthSections from './src/components/HealthSections';
import MenstrualSections from './src/components/MenstrualSections';
import SchoolSections from './src/components/SchoolSections/index';
import LanguageSections from './src/components/LanguageSections';
import TravelSections from './src/components/TravelSections';
import PetSections from './src/components/PetSections';
import SelfCareSections from './src/components/SelfCareSections';
import HabitTrackerSections from './src/components/HabitTrackerSections';
import ReadingSections from './src/components/ReadingSections';
import MoviesSections from './src/components/MoviesSections';
import FinanceSections from './src/components/FinanceSections';
import EventsSections from './src/components/EventsSections';
import AddTaskModal from './src/components/AddTaskModal';
import AddEventModal from './src/components/AddEventModal';
import TabNavigation from './src/components/TabNavigation';
import Sidebar from './src/components/Sidebar';
import ConflictWarningModal from './src/components/ConflictWarningModal';
import AuthNavigator from './src/components/AuthNavigator';
import { loadTasks, saveTasks, loadAllCategoryEvents, saveCategoryEvents } from './src/utils/storage';
import { detectTimeConflicts } from './src/utils/conflictDetection';
import authManager from './src/utils/AuthManager';
// import useUserData from './src/hooks/useUserData';
// import SupabaseTest from './src/components/SupabaseTest';

export default function App() {
  // Hook de datos de usuario con Supabase
  // const { userData, loading: dataLoading, saveUserData, updateSection, userId } = useUserData();
  
  // TEMPORAL: Mostrar componente de prueba de Supabase
  const [showSupabaseTest, setShowSupabaseTest] = useState(false);
  
  // Estados de autenticación
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Estados de la aplicación
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [tasks, setTasks] = useState({});
  const [allCategoryEvents, setAllCategoryEvents] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('personal');
  const [activeTab, setActiveTab] = useState('tasks');
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [pendingEvent, setPendingEvent] = useState(null);
  const [conflicts, setConflicts] = useState([]);
  const [userName, setUserName] = useState('Usuario');
  const [showPersonalSections, setShowPersonalSections] = useState(false);
  const [showWorkSections, setShowWorkSections] = useState(false);
  const [showHealthSections, setShowHealthSections] = useState(false);
  const [showMenstrualSections, setShowMenstrualSections] = useState(false);
  const [showSchoolSections, setShowSchoolSections] = useState(false);
  const [showLanguageSections, setShowLanguageSections] = useState(false);
  const [showTravelSections, setShowTravelSections] = useState(false);
  const [showPetSections, setShowPetSections] = useState(false);
  const [showSelfCareSections, setShowSelfCareSections] = useState(false);
  const [showHabitTrackerSections, setShowHabitTrackerSections] = useState(false);
  const [showReadingSections, setShowReadingSections] = useState(false);
  const [showMoviesSections, setShowMoviesSections] = useState(false);
  const [showFinanceSections, setShowFinanceSections] = useState(false);
  const [showEventsSections, setShowEventsSections] = useState(false);
  
  // Estado para las secciones activas
  const [activeSections, setActiveSections] = useState({
    personal: true,
    events: true,
    work: true,
    school: true,
    health: true,
    finance: true,
    habits: true,
    languages: true,
    menstrual: true,
    travel: true,
    pets: true,
    selfcare: true,
    reading: true,
    movies: true
  });

  // Verificar sesión al cargar la aplicación
  useEffect(() => {
    checkAuthSession();
  }, []);

  // Listener para cambios de autenticación
  useEffect(() => {
    const unsubscribe = authManager.addAuthListener((authenticated, userData) => {
      setIsAuthenticated(authenticated);
      setUser(userData);
      setIsLoading(false);
      
      if (authenticated && userData) {
        setUserName(userData.name);
        loadData();
      }
    });

    return unsubscribe;
  }, []);

  // Sincronizar datos cuando el usuario esté autenticado
  useEffect(() => {
    if (isAuthenticated && user) {
      // Cargar datos locales
      loadData();
    }
  }, [isAuthenticated, user]);

  const checkAuthSession = async () => {
    try {
      const result = await authManager.checkSession();
      if (result.success) {
        setIsAuthenticated(true);
        setUser(result.user);
        setUserName(result.user.name);
        loadData();
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error checking auth session:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (userData: any) => {
    const result = await authManager.login(userData, userData.rememberMe);
    if (result.success && result.user) {
      setIsAuthenticated(true);
      setUser(result.user);
      setUserName(result.user.name);
      loadData();
    }
    return result;
  };

  const handleRegister = async (userData: any) => {
    const result = await authManager.register(userData);
    return result;
  };

  const handleUpdateProfile = async (profileData: any) => {
    const result = await authManager.updateProfile(profileData);
    if (result.success && result.user) {
      setUser(result.user);
      setUserName(result.user.name);
    }
    return result;
  };

  const handleUpdateSection = async (sectionType, sectionData) => {
    // Función para manejar actualizaciones de secciones
    // TODO: Implementar sincronización con Supabase cuando esté disponible
    console.log(`Actualizando sección ${sectionType}:`, sectionData);
    return { success: true };
  };

  const handleToggleSection = async (sectionId) => {
    const newActiveSections = {
      ...activeSections,
      [sectionId]: !activeSections[sectionId]
    };
    
    setActiveSections(newActiveSections);
    
    // Guardar configuración local
    // TODO: Implementar sincronización con Supabase cuando esté disponible
  };

  const handleClearSection = (sectionId) => {
    try {
      // Aquí se implementaría la lógica para limpiar cada sección específica
      // Por ahora, solo retornamos éxito
      console.log(`Limpiando sección: ${sectionId}`);
      
      // TODO: Implementar limpieza específica por sección
      // Ejemplos:
      // if (sectionId === 'health') {
      //   // Limpiar datos de HealthSections
      // } else if (sectionId === 'finance') {
      //   // Limpiar datos de FinanceSections
      // }
      
      return { success: true };
    } catch (error) {
      console.error('Error al limpiar sección:', error);
      return { success: false, error: error.message };
    }
  };

  const handleLogout = async () => {
    await authManager.logout();
    setIsAuthenticated(false);
    setUser(null);
    setUserName('Usuario');
    // Limpiar datos de la aplicación
    setTasks({});
    setAllCategoryEvents({});
  };

  useEffect(() => {
    setShowPersonalSections(selectedCategory === 'personal');
    setShowEventsSections(selectedCategory === 'events');
    setShowWorkSections(selectedCategory === 'work');
    setShowHealthSections(selectedCategory === 'health');
    setShowMenstrualSections(selectedCategory === 'menstrual');
    setShowSchoolSections(selectedCategory === 'school');
    setShowLanguageSections(selectedCategory === 'languages');
    setShowTravelSections(selectedCategory === 'travel');
    setShowPetSections(selectedCategory === 'pets');
    setShowSelfCareSections(selectedCategory === 'selfcare');
    setShowHabitTrackerSections(selectedCategory === 'habits');
    setShowReadingSections(selectedCategory === 'reading');
    setShowMoviesSections(selectedCategory === 'movies');
    setShowFinanceSections(selectedCategory === 'finance');
  }, [selectedCategory]);

  const loadData = async () => {
    try {
      const savedTasks = await loadTasks();
      const savedCategoryEvents = await loadAllCategoryEvents();
      setTasks(savedTasks || {});
      setAllCategoryEvents(savedCategoryEvents || {});
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const addTask = async (taskText) => {
    const newTask = {
      id: Date.now().toString(),
      text: taskText,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    const updatedTasks = {
      ...tasks,
      [selectedDate]: [...(tasks[selectedDate] || []), newTask],
    };

    setTasks(updatedTasks);
    
    // Guardar en AsyncStorage (fallback)
    await saveTasks(updatedTasks);
    
    // TODO: Implementar sincronización con Supabase cuando esté disponible
    
    setShowAddTaskModal(false);
  };

  const toggleTask = async (taskId) => {
    const updatedTasks = {
      ...tasks,
      [selectedDate]: tasks[selectedDate]?.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      ) || [],
    };

    setTasks(updatedTasks);
    
    // Guardar en AsyncStorage (fallback)
    await saveTasks(updatedTasks);
    
    // TODO: Implementar sincronización con Supabase cuando esté disponible
  };

  const deleteTask = async (taskId) => {
    const updatedTasks = {
      ...tasks,
      [selectedDate]: tasks[selectedDate]?.filter((task) => task.id !== taskId) || [],
    };

    setTasks(updatedTasks);
    
    // Guardar en AsyncStorage (fallback)
    await saveTasks(updatedTasks);
    
    // TODO: Implementar sincronización con Supabase cuando esté disponible
  };

  const addEvent = async (event) => {
    // Detectar conflictos de horarios
    const detectedConflicts = detectTimeConflicts(event, allCategoryEvents, event.category);
    
    if (detectedConflicts.length > 0) {
      setConflicts(detectedConflicts);
      setPendingEvent(event);
      setShowConflictModal(true);
      setShowAddEventModal(false);
      return;
    }
    
    // Si no hay conflictos, agregar directamente
    await addEventToCategory(event);
  };

  const addEventToCategory = async (event) => {
    const categoryEvents = allCategoryEvents[event.category] || {};
    const updatedCategoryEvents = {
      ...categoryEvents,
      [selectedDate]: [...(categoryEvents[selectedDate] || []), event],
    };

    const updatedAllCategoryEvents = {
      ...allCategoryEvents,
      [event.category]: updatedCategoryEvents,
    };

    setAllCategoryEvents(updatedAllCategoryEvents);
    
    // Guardar en AsyncStorage (fallback)
    await saveCategoryEvents(event.category, updatedCategoryEvents);
    
    // TODO: Implementar sincronización con Supabase cuando esté disponible
    
    setShowAddEventModal(false);
  };

  const handleConflictConfirm = async () => {
    if (pendingEvent) {
      await addEventToCategory(pendingEvent);
      setPendingEvent(null);
    }
  };

  const handleConflictCancel = () => {
    setPendingEvent(null);
    setConflicts([]);
  };

  const editEvent = async (eventId, updatedEvent) => {
    const categoryEvents = allCategoryEvents[selectedCategory] || {};
    const updatedCategoryEvents = {
      ...categoryEvents,
      [selectedDate]: categoryEvents[selectedDate]?.map((event) =>
        event.id === eventId ? { ...event, ...updatedEvent } : event
      ) || [],
    };

    const updatedAllCategoryEvents = {
      ...allCategoryEvents,
      [selectedCategory]: updatedCategoryEvents,
    };

    setAllCategoryEvents(updatedAllCategoryEvents);
    await saveCategoryEvents(selectedCategory, updatedCategoryEvents);
  };

  const deleteEvent = async (eventId) => {
    const categoryEvents = allCategoryEvents[selectedCategory] || {};
    const updatedCategoryEvents = {
      ...categoryEvents,
      [selectedDate]: categoryEvents[selectedDate]?.filter((event) => event.id !== eventId) || [],
    };

    const updatedAllCategoryEvents = {
      ...allCategoryEvents,
      [selectedCategory]: updatedCategoryEvents,
    };

    setAllCategoryEvents(updatedAllCategoryEvents);
    await saveCategoryEvents(selectedCategory, updatedCategoryEvents);
  };

  const getTasksForDate = (date) => {
    return tasks[date] || [];
  };

  const getEventsForDate = (date) => {
    const categoryEvents = allCategoryEvents[selectedCategory] || {};
    return categoryEvents[date] || [];
  };

  const getAllEventsForDate = (date) => {
    let allEvents = [];
    Object.values(allCategoryEvents).forEach((categoryEvents) => {
      if (categoryEvents[date]) {
        allEvents = [...allEvents, ...categoryEvents[date]];
      }
    });
    return allEvents;
  };

  // TEMPORAL: Mostrar componente de prueba de Supabase
  // if (showSupabaseTest) {
  //   return (
  //     <SafeAreaProvider>
  //       <SafeAreaView style={styles.container}>
  //         <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
  //         <SupabaseTest />
  //         <TouchableOpacity 
  //           style={styles.closeTestButton}
  //           onPress={() => setShowSupabaseTest(false)}
  //         >
  //           <Text style={styles.closeTestButtonText}>Cerrar Prueba</Text>
  //         </TouchableOpacity>
  //       </SafeAreaView>
  //     </SafeAreaProvider>
  //   );
  // }

  // Mostrar pantalla de carga mientras se verifica la autenticación
  if (isLoading) {
    console.log('App: Mostrando pantalla de carga');
    return (
      <SafeAreaProvider>
          <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Cargando...</Text>
            </View>
          </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  // Mostrar pantalla de autenticación si no está autenticado
  if (!isAuthenticated) {
    console.log('App: Mostrando pantalla de autenticación');
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
          <AuthNavigator onLogin={handleLogin} onRegister={handleRegister} />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  // Mostrar aplicación principal si está autenticado
  console.log('App: Mostrando aplicación principal');
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
        
        {/* Iconos decorativos removidos para evitar conflictos con el sidebar */}
        
        <Header
          onOpenSidebar={() => {
            console.log('Abriendo sidebar, showSidebar actual:', showSidebar);
            setShowSidebar(true);
            console.log('showSidebar después de setShowSidebar(true):', true);
          }}
          selectedCategory={selectedCategory}
          userName={userName}
          onLogout={handleLogout}
        />
        
        <View style={styles.content}>
      {showPersonalSections ? (
        <PersonalSections
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
          tasks={tasks}
          events={allCategoryEvents}
          getAllEventsForDate={getAllEventsForDate}
          getTasksForDate={getTasksForDate}
          onAddTask={() => setShowAddTaskModal(true)}
          onToggleTask={toggleTask}
          onDeleteTask={deleteTask}
          onAddEvent={() => setShowAddEventModal(true)}
          onEditEvent={editEvent}
          onDeleteEvent={deleteEvent}
          user={user}
          onUpdateProfile={handleUpdateProfile}
          onLogout={handleLogout}
          activeSections={activeSections}
          onToggleSection={handleToggleSection}
          onClearSection={handleClearSection}
        />
      ) : showEventsSections ? (
        <EventsSections />
      ) : showWorkSections ? (
        <WorkSections
          selectedDate={selectedDate}
          events={getEventsForDate(selectedDate)}
          onAddEvent={() => setShowAddEventModal(true)}
          onEditEvent={editEvent}
          onDeleteEvent={deleteEvent}
          onUpdateSection={handleUpdateSection}
          user={user}
        />
      ) : showHealthSections ? (
        <HealthSections />
      ) : showMenstrualSections ? (
        <MenstrualSections />
      ) : showSchoolSections ? (
        <SchoolSections 
          onUpdateSection={handleUpdateSection} 
          user={user}
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
          events={allCategoryEvents}
          tasks={tasks}
          getAllEventsForDate={getAllEventsForDate}
          getTasksForDate={getTasksForDate}
          onAddTask={() => setShowAddTaskModal(true)}
          onToggleTask={toggleTask}
          onDeleteTask={deleteTask}
          onAddEvent={() => setShowAddEventModal(true)}
          onEditEvent={editEvent}
          onDeleteEvent={deleteEvent}
        />
      ) : showLanguageSections ? (
        <LanguageSections />
      ) : showTravelSections ? (
        <TravelSections />
      ) : showPetSections ? (
        <PetSections />
      ) : showSelfCareSections ? (
        <SelfCareSections />
      ) : showHabitTrackerSections ? (
        <HabitTrackerSections />
      ) : showReadingSections ? (
        <ReadingSections />
      ) : showMoviesSections ? (
        <MoviesSections />
      ) : showFinanceSections ? (
        <FinanceSections />
      ) : (
            <>
              <CalendarView
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
                tasks={tasks}
                events={allCategoryEvents}
                onAddTask={() => setShowAddTaskModal(true)}
                onAddEvent={() => setShowAddEventModal(true)}
              />
              
              <TabNavigation
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />

              {activeTab === 'tasks' ? (
                <TaskList
                  tasks={getTasksForDate(selectedDate)}
                  onToggleTask={toggleTask}
                  onDeleteTask={deleteTask}
                  onAddTask={() => setShowAddTaskModal(true)}
                />
              ) : (
                <EventsSchedule
                  events={getEventsForDate(selectedDate)}
                  onEditEvent={editEvent}
                  onDeleteEvent={deleteEvent}
                  onAddEvent={() => setShowAddEventModal(true)}
                />
              )}
            </>
          )}
    </View>

        <AddTaskModal
          visible={showAddTaskModal}
          onClose={() => setShowAddTaskModal(false)}
          onAddTask={addTask}
        />

        <AddEventModal
          visible={showAddEventModal}
          onClose={() => setShowAddEventModal(false)}
          onAddEvent={addEvent}
          selectedDate={selectedDate}
          selectedCategory={selectedCategory}
        />

        {console.log('Renderizando Sidebar con visible:', showSidebar)}
        <Sidebar
          visible={showSidebar}
          onClose={() => {
            console.log('Cerrando sidebar');
            setShowSidebar(false);
          }}
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
          activeSections={activeSections}
        />

        <ConflictWarningModal
          visible={showConflictModal}
          onClose={() => setShowConflictModal(false)}
          conflicts={conflicts}
          onConfirm={handleConflictConfirm}
          onCancel={handleConflictCancel}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: typography.h5,
    color: colors.textSecondary,
    fontWeight: typography.medium,
  },
  closeTestButton: {
    backgroundColor: colors.error,
    padding: spacing.md,
    margin: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    ...shadows.sm,
  },
  closeTestButtonText: {
    color: colors.surface,
    fontSize: typography.h6,
    fontWeight: typography.semiBold,
  },
  // decorativeBackground removido para evitar conflictos con el sidebar
});
