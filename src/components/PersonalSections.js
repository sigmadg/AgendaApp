import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Switch,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import CalendarView from './CalendarView';
import TaskList from './TaskList';
import EventsSchedule from './EventsSchedule';
import { colors, typography, spacing, borderRadius, shadows, globalStyles } from '../styles/globalStyles';
import { 
  DottedLine, 
  JournalTitle, 
  JournalText, 
  JournalSticker, 
  NatureElement, 
  BulletPoint, 
  StickyNote, 
  WritingLine 
} from './BulletJournalElements';

const PersonalSections = ({ 
  selectedDate, 
  onDateSelect, 
  tasks, 
  events, 
  getAllEventsForDate,
  getTasksForDate,
  onAddTask, 
  onToggleTask, 
  onDeleteTask, 
  onAddEvent, 
  onEditEvent, 
  onDeleteEvent,
  user,
  onUpdateProfile,
  onLogout,
  activeSections,
  onToggleSection,
  onClearSection
}) => {
  const [activeSection, setActiveSection] = useState('events');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Función para guardar datos (local por ahora)
  const savePersonalData = async (sectionData) => {
    // TODO: Implementar guardado local o con Supabase
    console.log('Saving personal data:', sectionData);
  };

  // Funciones auxiliares para eventos
  const getEventColor = (eventType) => {
    switch (eventType) {
      case 'work':
        return colors.primary;
      case 'personal':
        return colors.secondary;
      case 'health':
        return colors.success;
      case 'finance':
        return colors.warning;
      case 'education':
        return colors.info;
      case 'social':
        return colors.accent;
      case 'travel':
        return colors.earth;
      default:
        return colors.ink;
    }
  };

  const getEventEmoji = (eventType) => {
    switch (eventType) {
      case 'work':
        return '💼';
      case 'personal':
        return '👤';
      case 'health':
        return '🏥';
      case 'finance':
        return '💰';
      case 'education':
        return '📚';
      case 'social':
        return '👥';
      case 'travel':
        return '✈️';
      default:
        return '📅';
    }
  };

  const getEventTypeLabel = (eventType) => {
    switch (eventType) {
      case 'work':
        return 'Trabajo';
      case 'personal':
        return 'Personal';
      case 'health':
        return 'Salud';
      case 'finance':
        return 'Finanzas';
      case 'education':
        return 'Educación';
      case 'social':
        return 'Social';
      case 'travel':
        return 'Viaje';
      default:
        return 'General';
    }
  };

  // Funciones auxiliares para tareas
  const getTaskColor = (priority) => {
    switch (priority) {
      case 'high':
        return colors.error;
      case 'medium':
        return colors.warning;
      case 'low':
        return colors.success;
      default:
        return colors.ink;
    }
  };

  const getTaskPriorityEmoji = (priority) => {
    switch (priority) {
      case 'high':
        return '🔥';
      case 'medium':
        return '⭐';
      case 'low':
        return '🌱';
      default:
        return '📝';
    }
  };

  const getTaskPriorityLabel = (priority) => {
    switch (priority) {
      case 'high':
        return 'Alta Prioridad';
      case 'medium':
        return 'Media Prioridad';
      case 'low':
        return 'Baja Prioridad';
      default:
        return 'Sin Prioridad';
    }
  };

  // Funciones auxiliares para secciones
  const getSectionColor = (sectionId) => {
    const section = availableSections.find(s => s.id === sectionId);
    return section ? section.color : colors.ink;
  };

  const getSectionEmoji = (sectionId) => {
    switch (sectionId) {
      case 'personal':
        return '👤';
      case 'work':
        return '💼';
      case 'school':
        return '🎓';
      case 'health':
        return '🏥';
      case 'finance':
        return '💰';
      case 'habits':
        return '✅';
      case 'events':
        return '📅';
      case 'languages':
        return '🌍';
      case 'menstrual':
        return '🌸';
      case 'travel':
        return '✈️';
      case 'pets':
        return '🐾';
      case 'selfcare':
        return '💆';
      case 'reading':
        return '📚';
      case 'movies':
        return '🎬';
      default:
        return '📝';
    }
  };

  const getSectionIcon = (sectionId) => {
    switch (sectionId) {
      case 'personal':
        return 'person-outline';
      case 'work':
        return 'briefcase-outline';
      case 'school':
        return 'school-outline';
      case 'health':
        return 'heart-outline';
      case 'finance':
        return 'card-outline';
      case 'habits':
        return 'checkmark-circle-outline';
      case 'events':
        return 'calendar-outline';
      case 'languages':
        return 'globe-outline';
      case 'menstrual':
        return 'flower-outline';
      case 'travel':
        return 'airplane-outline';
      case 'pets':
        return 'paw-outline';
      case 'selfcare':
        return 'sparkles-outline';
      case 'reading':
        return 'book-outline';
      case 'movies':
        return 'film-outline';
      default:
        return 'folder-outline';
    }
  };

  const getSectionDescription = (sectionId) => {
    switch (sectionId) {
      case 'personal':
        return 'Gestión personal';
      case 'work':
        return 'Trabajo y proyectos';
      case 'school':
        return 'Estudios y educación';
      case 'health':
        return 'Salud y bienestar';
      case 'finance':
        return 'Finanzas personales';
      case 'habits':
        return 'Seguimiento de hábitos';
      case 'events':
        return 'Eventos y citas';
      case 'languages':
        return 'Aprendizaje de idiomas';
      case 'menstrual':
        return 'Ciclo menstrual';
      case 'travel':
        return 'Viajes y aventuras';
      case 'pets':
        return 'Cuidado de mascotas';
      case 'selfcare':
        return 'Autocuidado';
      case 'reading':
        return 'Lectura y libros';
      case 'movies':
        return 'Películas y series';
      default:
        return 'Sección general';
    }
  };

  const sections = [
    { id: 'events', name: 'Eventos del día', icon: 'calendar-outline' },
    { id: 'tasks', name: 'Tareas', icon: 'checkmark-circle-outline' },
    { id: 'profile', name: 'Perfil', icon: 'person-outline' },
    { id: 'settings', name: 'Configuración', icon: 'settings-outline' }
  ];

  // Definir todas las secciones disponibles
  const availableSections = [
    { id: 'personal', name: 'Mi Perfil', icon: 'person-outline', color: '#007AFF' },
    { id: 'work', name: 'Trabajo', icon: 'briefcase-outline', color: '#FF6B6B' },
    { id: 'school', name: 'Escuela', icon: 'school-outline', color: '#4ECDC4' },
    { id: 'health', name: 'Salud', icon: 'medical-outline', color: '#45B7D1' },
    { id: 'finance', name: 'Finanzas', icon: 'wallet-outline', color: '#4CAF50' },
    { id: 'habits', name: 'Habit Tracker', icon: 'checkmark-circle-outline', color: '#9C27B0' },
    { id: 'events', name: 'Eventos', icon: 'calendar-outline', color: '#E91E63' },
    { id: 'languages', name: 'Idiomas', icon: 'language-outline', color: '#FFEAA7' },
    { id: 'menstrual', name: 'Calendario Menstrual', icon: 'flower-outline', color: '#DDA0DD' },
    { id: 'travel', name: 'Viajes', icon: 'airplane-outline', color: '#FF9F43' },
    { id: 'pets', name: 'Mascotas', icon: 'paw-outline', color: '#FF6B9D' },
    { id: 'selfcare', name: 'Cuidado Personal', icon: 'heart-outline', color: '#E91E63' },
    { id: 'reading', name: 'Lectura', icon: 'book-outline', color: '#3F51B5' },
    { id: 'movies', name: 'Películas', icon: 'film-outline', color: '#FF5722' }
  ];

  const openProfileModal = () => {
    setProfileData({
      name: user?.name || '',
      email: user?.email || '',
    });
    setShowProfileModal(true);
  };

  const closeProfileModal = () => {
    setShowProfileModal(false);
  };

  const openPasswordModal = () => {
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setShowPasswordModal(true);
  };

  const closePasswordModal = () => {
    setShowPasswordModal(false);
  };


  const handleUpdateProfile = async () => {
    if (!profileData.name.trim() || !profileData.email.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    const result = await onUpdateProfile(profileData);
    if (result.success) {
      Alert.alert('Éxito', 'Perfil actualizado correctamente');
      closeProfileModal();
    } else {
      Alert.alert('Error', result.error || 'Error al actualizar el perfil');
    }
  };

  const handleChangePassword = async () => {
    const { currentPassword, newPassword, confirmPassword } = passwordData;

    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    const result = await onUpdateProfile({ 
      currentPassword, 
      newPassword 
    });
    
    if (result.success) {
      Alert.alert('Éxito', 'Contraseña actualizada correctamente');
      closePasswordModal();
    } else {
      Alert.alert('Error', result.error || 'Error al cambiar la contraseña');
    }
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
              backgroundColor: activeSection === section.id ? colors.primary : 'transparent',
              borderColor: activeSection === section.id ? colors.primary : colors.pencil,
            }]}>
              <Icon 
                name={section.icon} 
                size={20} 
                color={activeSection === section.id ? '#FFFFFF' : colors.textSecondary} 
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

  const renderCalendar = () => (
    <CalendarView
      selectedDate={selectedDate}
      onDateSelect={onDateSelect}
      tasks={tasks}
      events={getAllEventsForDate}
      onAddTask={onAddTask}
      onAddEvent={onAddEvent}
    />
  );

  const renderTasks = () => {
    // Obtener tareas del día actual
    const todayTasks = getTasksForDate ? getTasksForDate(selectedDate) : [];
    
    return (
      <View style={styles.bulletJournalContainer}>
        {/* Header de Bullet Journal */}
        <View style={styles.journalHeader}>
          <View style={styles.headerDecoration}>
            <Image 
              source={require('../../android/app/src/main/assets/mascota.png')}
              style={styles.mascotImage}
              resizeMode="contain"
            />
          </View>
          <JournalTitle style={[styles.journalMainTitle, globalStyles.natureText]}>
            ✨ Tareas del Día ✨
          </JournalTitle>
          <JournalText style={styles.journalSubtitle}>
            Tu lista de tareas en estilo bullet journal
          </JournalText>
      </View>
      
        {/* Contenido de tareas */}
        <View style={styles.journalContent}>
          <ScrollView style={styles.journalScroll} showsVerticalScrollIndicator={false}>
            {todayTasks.length === 0 ? (
              <StickyNote color={colors.watercolor3} style={styles.emptyJournalNote}>
     
                <JournalTitle style={styles.emptyTitle}>
                  🌸 Día Relajado 🌸
                </JournalTitle>
                <JournalText style={styles.emptySubtitle}>
                  ¡Excelente! No tienes tareas pendientes para hoy. 
                  Es un día perfecto para descansar o hacer algo que disfrutes.
                </JournalText>
                <DottedLine color={colors.pencil} />
                <View style={styles.emptyTipContainer}>
       
                  <JournalText style={styles.emptyTip}>
                    💡 Tip: Puedes agregar tareas desde otras secciones.
                  </JournalText>
          </View>
              </StickyNote>
            ) : (
              <View style={styles.tasksJournalList}>
                {todayTasks.map((task, index) => (
                  <View key={task.id || index} style={styles.journalTaskEntry}>
                    {/* Línea de escritura de la tarea */}
                    <View style={styles.taskJournalLine}>
                      <View style={styles.taskBulletSection}>
                        <TouchableOpacity
                          onPress={() => onToggleTask && onToggleTask(task.id)}
                          style={styles.taskBulletButton}
                        >
                          {task.completed ? (
                            <View style={styles.completedTaskBullet}>
                              <Text style={styles.completedTaskCheckmark}>✓</Text>
                            </View>
                          ) : (
                            <BulletPoint 
                              type="dot" 
                              color={getTaskColor(task.priority || 'medium')} 
                              size={14} 
                            />
                          )}
                        </TouchableOpacity>
                        
                        {/* Sticker de prioridad */}
                        {task.priority && (
                          <JournalSticker 
                            emoji={getTaskPriorityEmoji(task.priority)} 
                            size={20} 
                            style={styles.taskSticker}
                          />
                        )}
                      </View>
                      
                      <View style={styles.taskContent}>
                        <View style={styles.taskTextContainer}>
                          <JournalText style={[
                            styles.taskTitle,
                            task.completed && styles.completedTaskTitle
                          ]}>
                            {task.title || 'Tarea sin título'}
                          </JournalText>
                          
                          {/* Elementos decorativos naturales */}
                          <View style={styles.taskDecorations}>
                            <NatureElement type="leaf" size={16} />
                            <NatureElement type="flower" size={14} />
                          </View>
                        </View>
                        
                        {/* Información de la tarea en estilo bullet journal */}
                        <View style={styles.taskJournalInfo}>
                          {task.time && (
                            <View style={styles.taskInfoItem}>
                              <NatureElement type="sun" size={14} />
                              <JournalText style={styles.taskInfoText}>
                                {task.time}
                              </JournalText>
                            </View>
                          )}
                          
                          {task.category && (
                            <View style={styles.taskInfoItem}>
                              <NatureElement type="tree" size={14} />
                              <JournalText style={styles.taskInfoText}>
                                {task.category}
                              </JournalText>
                            </View>
                          )}
                        </View>
                        
                        {/* Línea decorativa */}
                        <DottedLine color={colors.pencil} style={styles.taskLine} />
                        
                        {/* Prioridad de la tarea */}
                        {task.priority && (
                          <View style={styles.taskPriorityContainer}>
                            <NatureElement type="star" size={16} />
                            <JournalText style={[styles.taskPriorityText, { color: getTaskColor(task.priority) }]}>
                              {getTaskPriorityLabel(task.priority)}
                            </JournalText>
                          </View>
                        )}
                      </View>
                    </View>
                    
                    {/* Acciones de la tarea */}
                    <View style={styles.taskJournalActions}>
                      <View style={styles.taskStatusIndicator}>
                        <JournalText style={styles.taskStatusText}>
                          {task.completed ? '✨ Completada' : '📝 Pendiente'}
                        </JournalText>
                      </View>
                      
                      <View style={styles.taskActionButtons}>
                        <TouchableOpacity
                          style={[styles.journalActionButton, styles.editButton]}
                          onPress={() => onEditTask && onEditTask(task)}
                        >
                          <NatureElement type="flower" size={18} />
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                          style={[styles.journalActionButton, styles.deleteButton]}
                          onPress={() => onDeleteTask && onDeleteTask(task.id)}
                        >
                          <NatureElement type="cloud" size={18} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}
        </ScrollView>
      </View>
    </View>
  );
  };

  const renderEvents = () => {
    // Obtener eventos del día actual
    const todayEvents = getAllEventsForDate ? getAllEventsForDate(selectedDate) : [];
    
    // Datos de prueba para debugging
    console.log('PersonalSections - renderEvents:', {
      selectedDate,
      todayEvents,
      getAllEventsForDate: !!getAllEventsForDate
    });
    
    // Eventos de prueba si no hay eventos reales
    const testEvents = todayEvents.length === 0 ? [
      {
        id: 'test1',
        title: 'Reunión de trabajo',
        time: '10:00 AM',
        location: 'Oficina',
        type: 'work'
      },
      {
        id: 'test2',
        title: 'Almuerzo con amigos',
        time: '1:00 PM',
        location: 'Restaurante',
        type: 'social'
      }
    ] : todayEvents;
    
    return (
      <View style={styles.bulletJournalContainer}>
        {/* Header de Bullet Journal */}
        <View style={styles.journalHeader}>
          <View style={styles.headerDecoration}>
            <Image 
              source={require('../../android/app/src/main/assets/mascota.png')}
              style={styles.mascotImage}
              resizeMode="contain"
            />
          </View>
          <JournalTitle style={styles.journalMainTitle}>
            ✨ Eventos del Día ✨
          </JournalTitle>
          <JournalText style={styles.journalSubtitle}>
            Tu agenda personal en estilo bullet journal
          </JournalText>
      </View>
      
        {/* Contenido de eventos */}
        <View style={styles.journalContent}>
          <ScrollView style={styles.journalScroll} showsVerticalScrollIndicator={false}>
            {testEvents.length === 0 ? (
              <StickyNote color={colors.watercolor1} style={styles.emptyJournalNote}>

                <JournalTitle style={styles.emptyTitle}>
                  🌸 Día Libre 🌸
                </JournalTitle>
                <JournalText style={styles.emptySubtitle}>
                  ¡Perfecto! No tienes eventos programados para hoy. 
                  Es un día ideal para relajarte o hacer algo espontáneo.
                </JournalText>
                <DottedLine color={colors.pencil} />
                <View style={styles.emptyTipContainer}>
               
                  <JournalText style={styles.emptyTip}>
                    💡 Tip: Puedes agregar eventos desde otras secciones
                  </JournalText>
          </View>
              </StickyNote>
            ) : (
              <View style={styles.eventsJournalList}>
                {testEvents.map((event, index) => (
                  <View key={event.id || index} style={styles.journalEventEntry}>
                    {/* Línea de escritura del evento */}
                    <View style={styles.eventJournalLine}>
                      <View style={styles.eventBulletSection}>
                        <BulletPoint 
                          type="dot" 
                          color={getEventColor(event.type)} 
                          size={14} 
                        />
                        <JournalSticker 
                          emoji={getEventEmoji(event.type)} 
                          size={24} 
                          style={styles.eventSticker}
                        />
                      </View>
                      
                      <View style={styles.eventContent}>
                        <View style={styles.eventTextContainer}>
                          <JournalText style={styles.eventTitle}>
                            {event.title || 'Evento sin título'}
                          </JournalText>
                          
                          {/* Elementos decorativos naturales */}
                          <View style={styles.eventDecorations}>
                            <NatureElement type="butterfly" size={16} />
                            <NatureElement type="flower" size={14} />
                          </View>
                        </View>
                        
                        {/* Información del evento en estilo bullet journal */}
                        <View style={styles.eventJournalInfo}>
                          {event.time && (
                            <View style={styles.eventInfoItem}>
                              <NatureElement type="sun" size={14} />
                              <JournalText style={styles.eventInfoText}>
                                {event.time}
                              </JournalText>
                            </View>
                          )}
                          
                          {event.location && (
                            <View style={styles.eventInfoItem}>
                              <NatureElement type="tree" size={14} />
                              <JournalText style={styles.eventInfoText}>
                                {event.location}
                              </JournalText>
                            </View>
                          )}
                        </View>
                        
                        {/* Línea decorativa */}
                        <DottedLine color={colors.pencil} style={styles.eventLine} />
                        
                        {/* Tipo de evento */}
                        <View style={styles.eventTypeContainer}>
                          <NatureElement type="star" size={16} />
                          <JournalText style={[styles.eventTypeText, { color: getEventColor(event.type) }]}>
                            {getEventTypeLabel(event.type)}
                          </JournalText>
                        </View>
                      </View>
                    </View>
                    
                    {/* Acciones del evento */}
                    <View style={styles.eventJournalActions}>
                      <View style={styles.eventStatusIndicator}>
                        <JournalText style={styles.eventStatusText}>
                          📅 Evento programado
                        </JournalText>
                      </View>
                      
                      <View style={styles.eventActionButtons}>
                        <TouchableOpacity
                          style={[styles.journalActionButton, styles.editButton]}
                          onPress={() => onEditEvent && onEditEvent(event)}
                        >
                          <NatureElement type="flower" size={18} />
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                          style={[styles.journalActionButton, styles.deleteButton]}
                          onPress={() => onDeleteEvent && onDeleteEvent(event.id)}
                        >
                          <NatureElement type="cloud" size={18} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}
        </ScrollView>
      </View>
    </View>
  );
  };


  const renderProfile = () => (
    <View style={styles.profileContainer}>
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatarInner}>
            <Icon name="person" size={36} color="#667eea" />
          </View>
          <View style={styles.statusIndicator} />
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{user?.name || 'Usuario'}</Text>
          <Text style={styles.profileEmail}>{user?.email || 'usuario@ejemplo.com'}</Text>
          <View style={styles.profileBadge}>
            <Icon name="checkmark-circle" size={14} color="#28a745" />
            <Text style={styles.badgeText}>Verificado</Text>
          </View>
        </View>
      </View>

      <View style={styles.profileOptions}>
        <TouchableOpacity style={[styles.optionItem, globalStyles.natureHighlight]} onPress={openProfileModal}>
          <View style={styles.optionLeft}>
            <View style={[styles.optionIcon, { backgroundColor: colors.nature.ocean }]}>
              <Icon name="person-outline" size={20} color="#FFFFFF" />
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={[styles.optionText, globalStyles.natureText]}>Editar Perfil</Text>
              <Text style={styles.optionSubtext}>Actualiza tu información personal</Text>
            </View>
          </View>
          <Icon name="chevron-forward" size={18} color={colors.nature.forest} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.optionItem, globalStyles.natureHighlight]} onPress={openPasswordModal}>
          <View style={styles.optionLeft}>
            <View style={[styles.optionIcon, { backgroundColor: colors.nature.sunrise }]}>
              <Icon name="lock-closed-outline" size={20} color="#FFFFFF" />
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={[styles.optionText, globalStyles.natureText]}>Cambiar Contraseña</Text>
              <Text style={styles.optionSubtext}>Actualiza tu contraseña de seguridad</Text>
            </View>
          </View>
          <Icon name="chevron-forward" size={18} color={colors.nature.forest} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.optionItem, globalStyles.natureHighlight]} onPress={() => Alert.alert('Próximamente', 'Esta función estará disponible pronto')}>
          <View style={styles.optionLeft}>
            <View style={[styles.optionIcon, { backgroundColor: colors.nature.sunset }]}>
              <Icon name="notifications-outline" size={20} color="#FFFFFF" />
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={[styles.optionText, globalStyles.natureText]}>Notificaciones</Text>
              <Text style={styles.optionSubtext}>Configura tus preferencias</Text>
            </View>
          </View>
          <Icon name="chevron-forward" size={18} color={colors.nature.forest} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.optionItem, globalStyles.natureHighlight]} onPress={() => Alert.alert('Próximamente', 'Esta función estará disponible pronto')}>
          <View style={styles.optionLeft}>
            <View style={[styles.optionIcon, { backgroundColor: colors.nature.forest }]}>
              <Icon name="shield-outline" size={20} color="#FFFFFF" />
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={[styles.optionText, globalStyles.natureText]}>Privacidad</Text>
              <Text style={styles.optionSubtext}>Controla tu privacidad</Text>
            </View>
          </View>
          <Icon name="chevron-forward" size={18} color={colors.nature.forest} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.optionItem, globalStyles.natureHighlight]} onPress={() => Alert.alert('Próximamente', 'Esta función estará disponible pronto')}>
          <View style={styles.optionLeft}>
            <View style={[styles.optionIcon, { backgroundColor: colors.nature.sunrise }]}>
              <Icon name="help-circle-outline" size={20} color="#FFFFFF" />
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={[styles.optionText, globalStyles.natureText]}>Ayuda y Soporte</Text>
              <Text style={styles.optionSubtext}>Obtén ayuda cuando la necesites</Text>
            </View>
          </View>
          <Icon name="chevron-forward" size={18} color={colors.nature.forest} />
        </TouchableOpacity>

      </View>
    </View>
  );

  const handleClearSection = (sectionId) => {
    const sectionName = availableSections.find(s => s.id === sectionId)?.name;
    
    Alert.alert(
      'Limpiar Sección',
      `¿Estás seguro de que quieres limpiar todos los datos de "${sectionName}"? Esta acción no se puede deshacer.`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Limpiar',
          style: 'destructive',
          onPress: () => {
            if (onClearSection) {
              const result = onClearSection(sectionId);
              if (result && result.success) {
                Alert.alert('Éxito', `${sectionName} limpiada correctamente`);
              } else {
                Alert.alert('Error', result?.error || 'Error al limpiar la sección');
              }
            } else {
              Alert.alert('Éxito', `${sectionName} limpiada correctamente`);
            }
          },
        },
      ]
    );
  };

  const renderSettings = () => {
    return (
      <View style={styles.bulletJournalContainer}>
        {/* Header de Bullet Journal */}
        <View style={styles.journalHeader}>
          <View style={styles.headerDecoration}>
            <Image 
              source={require('../../android/app/src/main/assets/mascota.png')}
              style={styles.mascotImage}
              resizeMode="contain"
            />
          </View>
          <JournalTitle style={[styles.journalMainTitle, globalStyles.natureText]}>
            ✨ Configuración ✨
          </JournalTitle>
          <JournalText style={styles.journalSubtitle}>
            Personaliza tu experiencia en estilo bullet journal
          </JournalText>
      </View>

        {/* Contenido de configuración */}
        <View style={styles.journalContent}>
          <ScrollView style={styles.journalScroll} showsVerticalScrollIndicator={false}>
            <StickyNote color={colors.watercolor2} style={styles.settingsJournalNote}>
              <JournalTitle style={styles.settingsTitle}>
                🌸 Secciones Disponibles 🌸
              </JournalTitle>
              <JournalText style={styles.settingsSubtitle}>
                Activa solo las secciones que necesitas para tu organización personal
              </JournalText>
            </StickyNote>

            {/* Lista de secciones en formato acordeón */}
            <View style={styles.accordionContainer}>
        {availableSections.map((section, index) => (
                <View key={section.id} style={[
                  styles.accordionItem,
                  activeSections[section.id] && styles.accordionActiveItem
                ]}>
                  {/* Header del acordeón */}
                  <TouchableOpacity
                    style={styles.accordionHeader}
                    onPress={() => onToggleSection && onToggleSection(section.id)}
                  >
                    <View style={styles.accordionHeaderLeft}>
                      <View style={[
                        styles.accordionIcon,
                        { backgroundColor: activeSections[section.id] ? getSectionColor(section.id) : colors.watercolor1 }
                      ]}>
                <Icon 
                          name={getSectionIcon(section.id)} 
                          size={24} 
                          color={activeSections[section.id] ? colors.surface : colors.textSecondary}
                          style={styles.accordionIconStyle}
                />
              </View>
                      
                      <View style={styles.accordionInfo}>
                        <JournalTitle style={styles.accordionTitle}>
                  {section.name}
                        </JournalTitle>
                        <JournalText style={styles.accordionSubtitle}>
                          {getSectionDescription(section.id)}
                        </JournalText>
                </View>
              </View>
                    
                    <View style={styles.accordionHeaderRight}>
                      <View style={[
                        styles.accordionStatus,
                        { backgroundColor: activeSections[section.id] ? colors.success : colors.watercolor2 }
                      ]}>
                        <JournalText style={[
                          styles.accordionStatusText,
                          { color: activeSections[section.id] ? colors.surface : colors.textSecondary }
                        ]}>
                          {activeSections[section.id] ? 'ON' : 'OFF'}
                        </JournalText>
            </View>
                      
                      <View style={styles.accordionArrow}>
                        <JournalText style={styles.accordionArrowText}>
                          {activeSections[section.id] ? '▼' : '▶'}
                        </JournalText>
                      </View>
                    </View>
                  </TouchableOpacity>
                  
                  {/* Contenido expandible del acordeón */}
                  {activeSections[section.id] && (
                    <View style={styles.accordionContent}>
                      <View style={styles.accordionContentHeader}>
                        <JournalText style={styles.accordionContentTitle}>
                          ✨ {section.name} está activa
                        </JournalText>
                        <JournalText style={styles.accordionContentDescription}>
                          Esta sección está disponible en tu menú principal
                        </JournalText>
                      </View>
                      
                      <View style={styles.accordionActions}>
              <TouchableOpacity
                          style={styles.accordionActionButton}
                          onPress={() => onClearSection && onClearSection(section.id)}
                        >
                          <JournalText style={styles.accordionActionText}>
                            🗑️ Limpiar datos de {section.name}
                          </JournalText>
              </TouchableOpacity>
            </View>
                    </View>
                  )}
          </View>
        ))}
      </View>

            {/* Botón de Cerrar Sesión */}
            <View style={styles.logoutSection}>
              <StickyNote color={colors.watercolor4} style={styles.logoutNote}>
                <JournalTitle style={styles.logoutTitle}>
                  ✨ Cerrar Sesión ✨
                </JournalTitle>
                <JournalText style={styles.logoutSubtitle}>
                  Sal de tu cuenta de forma segura
                </JournalText>
                <TouchableOpacity style={[styles.logoutButton, globalStyles.natureButton]} onPress={onLogout}>
                  <JournalText style={[styles.logoutButtonText, globalStyles.natureText]}>
                    🌸 Cerrar Sesión 🌸
                  </JournalText>
                </TouchableOpacity>
              </StickyNote>
        </View>

            {/* Footer informativo en estilo bullet journal */}
            <StickyNote color={colors.watercolor2} style={styles.settingsFooterNote}>
              <JournalTitle style={styles.footerTitle}>
                💡 Consejos de Organización
              </JournalTitle>
              <JournalText style={styles.footerText}>
                • Las secciones desactivadas no aparecerán en el menú lateral
              </JournalText>
              <JournalText style={styles.footerText}>
                • Usa el botón de nube para limpiar los datos de una sección
              </JournalText>
              <JournalText style={styles.footerText}>
                • Activa solo las secciones que realmente uses
              </JournalText>
              <View style={styles.footerTipContainer}>
                <JournalText style={styles.footerTip}>
                  🌸 Tip: Una organización simple es más efectiva
                </JournalText>
        </View>
            </StickyNote>
          </ScrollView>
      </View>
    </View>
  );
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'events': 
        return renderEvents();
      case 'tasks': 
        return renderTasks();
      case 'profile': 
        return renderProfile();
      case 'settings': 
        return renderSettings();
      default: 
        return renderEvents();
    }
  };

  return (
    <View style={styles.container}>
      {renderSectionTabs()}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderActiveSection()}
      </ScrollView>

      {/* Modal para editar perfil */}
      <Modal
        visible={showProfileModal}
        animationType="slide"
        transparent={true}
        onRequestClose={closeProfileModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Header del modal con estilo bullet journal */}
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderDecoration}>
                <NatureElement type="star" size={24} />
                <JournalSticker emoji="👤" size={20} />
                <NatureElement type="heart" size={24} />
              </View>
              <JournalTitle style={styles.modalTitle}>
                ✨ Editar Perfil ✨
              </JournalTitle>
              <JournalText style={styles.modalSubtitle}>
                Actualiza tu información personal
              </JournalText>
              <DottedLine color={colors.pencil} style={styles.modalHeaderLine} />
              <TouchableOpacity style={styles.modalCloseButton} onPress={closeProfileModal}>
                <Icon name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Contenido del modal */}
            <View style={styles.modalBody}>
              <StickyNote color={colors.watercolor1} style={styles.modalInfoNote}>
                <View style={styles.modalInfoIconContainer}>
                  <NatureElement type="butterfly" size={32} />
                  <JournalSticker emoji="💡" size={24} />
                </View>
                <JournalText style={styles.modalInfoText}>
                  🌸 Completa los campos que desees actualizar
                </JournalText>
              </StickyNote>

              <View style={styles.modalInputContainer}>
              <View style={styles.inputGroup}>
                  <View style={styles.inputLabelContainer}>
                    <NatureElement type="star" size={16} />
                    <JournalText style={styles.inputLabel}>Nombre</JournalText>
                  </View>
                  <View style={styles.textInputContainer}>
                <TextInput
                  style={styles.textInput}
                  value={profileData.name}
                  onChangeText={(text) => setProfileData({...profileData, name: text})}
                  placeholder="Ingresa tu nombre"
                      placeholderTextColor={colors.textTertiary}
                />
                    <NatureElement type="flower" size={16} style={styles.inputIcon} />
                  </View>
              </View>

              <View style={styles.inputGroup}>
                  <View style={styles.inputLabelContainer}>
                    <NatureElement type="sun" size={16} />
                    <JournalText style={styles.inputLabel}>Email</JournalText>
                  </View>
                  <View style={styles.textInputContainer}>
                <TextInput
                  style={styles.textInput}
                  value={profileData.email}
                  onChangeText={(text) => setProfileData({...profileData, email: text})}
                  placeholder="Ingresa tu email"
                      placeholderTextColor={colors.textTertiary}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                    <NatureElement type="moon" size={16} style={styles.inputIcon} />
                  </View>
                </View>
              </View>
            </View>

            {/* Footer del modal */}
            <View style={styles.modalFooter}>
              <View style={styles.modalFooterDecoration}>
                <NatureElement type="leaf" size={20} />
                <JournalSticker emoji="✨" size={16} />
                <NatureElement type="cloud" size={20} />
              </View>
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity style={styles.modalCancelButton} onPress={closeProfileModal}>
                  <NatureElement type="cloud" size={18} />
                  <JournalText style={styles.modalCancelButtonText}>Cancelar</JournalText>
              </TouchableOpacity>
                <TouchableOpacity style={styles.modalSaveButton} onPress={handleUpdateProfile}>
                  <NatureElement type="flower" size={18} />
                  <JournalText style={styles.modalSaveButtonText}>Guardar</JournalText>
              </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal para cambiar contraseña */}
      <Modal
        visible={showPasswordModal}
        animationType="slide"
        transparent={true}
        onRequestClose={closePasswordModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Cambiar Contraseña</Text>
              <TouchableOpacity onPress={closePasswordModal}>
                <Icon name="close" size={24} color="#6c757d" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Contraseña Actual</Text>
                <TextInput
                  style={styles.textInput}
                  value={passwordData.currentPassword}
                  onChangeText={(text) => setPasswordData({...passwordData, currentPassword: text})}
                  placeholder="Ingresa tu contraseña actual"
                  secureTextEntry
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nueva Contraseña</Text>
                <TextInput
                  style={styles.textInput}
                  value={passwordData.newPassword}
                  onChangeText={(text) => setPasswordData({...passwordData, newPassword: text})}
                  placeholder="Ingresa tu nueva contraseña"
                  secureTextEntry
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Confirmar Contraseña</Text>
                <TextInput
                  style={styles.textInput}
                  value={passwordData.confirmPassword}
                  onChangeText={(text) => setPasswordData({...passwordData, confirmPassword: text})}
                  placeholder="Confirma tu nueva contraseña"
                  secureTextEntry
                />
              </View>
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.cancelButton} onPress={closePasswordModal}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleChangePassword}>
                <Text style={styles.saveButtonText}>Cambiar</Text>
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
    backgroundColor: colors.background,
    paddingVertical: spacing.lg,
    paddingHorizontal: 0,
    width: '100%',
    ...shadows.sm,
  },
  tabsWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: spacing.sm,
    width: '100%',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.lg,
    marginHorizontal: spacing.xs,
  },
  activeTab: {
    ...shadows.lg,
    borderColor: colors.nature.ocean,
    shadowColor: colors.nature.ocean,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
  },
  tabContent: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    position: 'relative',
    ...shadows.sm,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -8,
    left: '50%',
    marginLeft: -4,
    width: 8,
    height: 8,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    ...shadows.sm,
  },
  content: {
    flex: 1,
    paddingHorizontal: 0,
    paddingVertical: 16,
  },
  // Estilos para la configuración del perfil - Diseño cute y fluido
  profileContainer: {
    flex: 1,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.xl,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.lg,
    borderWidth: 2,
    borderColor: colors.nature.ocean,
    shadowColor: colors.nature.ocean,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 20,
  },
  avatarInner: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.nature.ocean,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.nature.forest,
    shadowColor: colors.nature.ocean,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#28a745',
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: typography.h4,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    letterSpacing: typography.letterSpacing.normal,
  },
  profileEmail: {
    fontSize: typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    fontWeight: typography.regular,
  },
  profileBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.nature.forest,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: typography.caption,
    color: colors.textPrimary,
    fontWeight: typography.semiBold,
    marginLeft: spacing.xs,
  },
  profileOptions: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.nature.ocean,
    shadowColor: colors.nature.ocean,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
    overflow: 'hidden',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.nature.forest,
    marginHorizontal: spacing.xs,
    marginVertical: spacing.xs,
    borderRadius: borderRadius.md,
    backgroundColor: colors.card,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  optionTextContainer: {
    flex: 1,
  },
  optionText: {
    fontSize: typography.h6,
    color: colors.textPrimary,
    fontWeight: typography.semiBold,
    marginBottom: spacing.xs,
    letterSpacing: typography.letterSpacing.normal,
  },
  optionSubtext: {
    fontSize: typography.caption,
    color: colors.textSecondary,
    fontWeight: typography.regular,
  },
  logoutOption: {
    borderBottomWidth: 0,
  },
  logoutText: {
    color: '#d32f2f',
  },
  // Estilos para los modales - Diseño bullet journal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    width: '95%',
    maxHeight: '85%',
    borderWidth: 2,
    borderColor: colors.pencil,
    ...shadows.lg,
  },
  modalHeader: {
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.pencil,
    borderStyle: 'dashed',
    position: 'relative',
  },
  modalHeaderDecoration: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  modalTitle: {
    fontSize: typography.h3,
    color: colors.ink,
    textAlign: 'center',
    marginBottom: spacing.sm,
    lineHeight: typography.lineHeight.tight * typography.h3,
    letterSpacing: typography.letterSpacing.wide,
  },
  modalSubtitle: {
    fontSize: typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: typography.lineHeight.comfortable * typography.body,
    letterSpacing: typography.letterSpacing.normal,
    fontStyle: 'italic',
  },
  modalHeaderLine: {
    marginTop: spacing.sm,
  },
  modalCloseButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    backgroundColor: colors.watercolor4,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
  },
  modalBody: {
    padding: spacing.lg,
  },
  modalInfoNote: {
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.pencil,
    ...shadows.paper,
  },
  modalInfoIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  modalInfoText: {
    fontSize: typography.small,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: typography.lineHeight.normal * typography.small,
    letterSpacing: typography.letterSpacing.normal,
    fontStyle: 'italic',
  },
  modalInputContainer: {
    gap: spacing.lg,
  },
  inputGroup: {
    gap: spacing.sm,
  },
  inputLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  inputLabel: {
    fontSize: typography.body,
    color: colors.ink,
    fontWeight: typography.bold,
    lineHeight: typography.lineHeight.normal * typography.body,
    letterSpacing: typography.letterSpacing.normal,
  },
  textInputContainer: {
    position: 'relative',
  },
  textInput: {
    borderWidth: 2,
    borderColor: colors.pencil,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    paddingRight: spacing.xl,
    fontSize: typography.body,
    backgroundColor: colors.background,
    color: colors.ink,
    lineHeight: typography.lineHeight.comfortable * typography.body,
    letterSpacing: typography.letterSpacing.normal,
    ...shadows.sm,
  },
  inputIcon: {
    position: 'absolute',
    right: spacing.md,
    top: '50%',
    transform: [{ translateY: -8 }],
  },
  modalFooter: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.pencil,
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  modalFooterDecoration: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    width: '100%',
  },
  modalCancelButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.watercolor4,
    borderWidth: 2,
    borderColor: colors.pencil,
    gap: spacing.xs,
    ...shadows.sm,
  },
  modalCancelButtonText: {
    fontSize: typography.body,
    color: colors.textSecondary,
    fontWeight: typography.bold,
    lineHeight: typography.lineHeight.normal * typography.body,
    letterSpacing: typography.letterSpacing.normal,
  },
  modalSaveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.primary,
    gap: spacing.xs,
    ...shadows.md,
  },
  modalSaveButtonText: {
    fontSize: typography.body,
    color: colors.surface,
    fontWeight: typography.bold,
    lineHeight: typography.lineHeight.normal * typography.body,
    letterSpacing: typography.letterSpacing.normal,
  },
  // Estilos para la configuración de secciones - Diseño cute y fluido
  settingsContainer: {
    flex: 1,
  },
  settingsHeader: {
    alignItems: 'center',
    backgroundColor: '#667eea',
    padding: 12,
    borderRadius: 16,
    marginBottom: 20,
    marginHorizontal: 16,
    shadowColor: '#667eea',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  headerIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  settingsTitle: {
    fontSize: typography.h3,
    color: colors.ink,
    textAlign: 'center',
    marginBottom: spacing.sm,
    lineHeight: typography.lineHeight.tight * typography.h3,
    letterSpacing: typography.letterSpacing.wide,
  },
  settingsSubtitle: {
    fontSize: typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: typography.lineHeight.comfortable * typography.body,
    letterSpacing: typography.letterSpacing.normal,
    fontStyle: 'italic',
    marginBottom: spacing.md,
  },
  sectionsList: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.nature.ocean,
    shadowColor: colors.nature.ocean,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    overflow: 'hidden',
    marginHorizontal: 0,
  },
  sectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
    marginHorizontal: 0,
    marginVertical: 0,
    borderRadius: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    width: '100%',
  },
  sectionControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionSwitch: {
    marginRight: 8,
    transform: [{ scale: 1.1 }],
  },
  clearButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    shadowColor: '#dc3545',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sectionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  sectionInfo: {
    flex: 1,
  },
  sectionName: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  sectionStatus: {
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  settingsFooter: {
    marginTop: 20,
    padding: 20,
    backgroundColor: '#f8f9ff',
    borderRadius: 0,
    borderWidth: 1,
    borderColor: '#e3f2fd',
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginHorizontal: 0,
  },
  footerIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  footerContent: {
    flex: 1,
  },
  footerText: {
    fontSize: 15,
    color: '#2c3e50',
    fontWeight: '500',
    marginBottom: 4,
    lineHeight: 22,
  },
  footerSubtext: {
    fontSize: 13,
    color: '#6c757d',
    fontWeight: '400',
    lineHeight: 18,
  },
  // Estilos para Bullet Journal de Tareas
  tasksJournalList: {
    gap: spacing.md,
  },
  journalTaskEntry: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.pencil,
    ...shadows.paper,
  },
  taskJournalLine: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  taskBulletSection: {
    alignItems: 'center',
    marginRight: spacing.sm,
    minWidth: 40,
  },
  taskBulletButton: {
    padding: spacing.xs,
    marginBottom: spacing.xs,
  },
  completedTaskBullet: {
    width: 20,
    height: 20,
    borderRadius: borderRadius.full,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedTaskCheckmark: {
    color: colors.surface,
    fontSize: 12,
    fontWeight: typography.bold,
  },
  taskSticker: {
    marginTop: spacing.xs,
  },
  taskContent: {
    flex: 1,
  },
  taskTextContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  taskTitle: {
    flex: 1,
    fontSize: typography.body,
    color: colors.ink,
    lineHeight: typography.lineHeight.comfortable * typography.body,
    letterSpacing: typography.letterSpacing.normal,
    fontStyle: 'italic',
  },
  completedTaskTitle: {
    textDecorationLine: 'line-through',
    color: colors.textTertiary,
    opacity: 0.7,
  },
  taskDecorations: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: spacing.sm,
    gap: spacing.xs,
  },
  taskJournalInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.sm,
    gap: spacing.md,
  },
  taskInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.watercolor1,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  taskInfoText: {
    fontSize: typography.small,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
    lineHeight: typography.lineHeight.normal * typography.small,
    letterSpacing: typography.letterSpacing.normal,
    fontStyle: 'italic',
  },
  taskLine: {
    marginVertical: spacing.sm,
  },
  taskPriorityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.watercolor3,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
  },
  taskPriorityText: {
    fontSize: typography.small,
    marginLeft: spacing.xs,
    lineHeight: typography.lineHeight.normal * typography.small,
    letterSpacing: typography.letterSpacing.normal,
    fontStyle: 'italic',
  },
  taskJournalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.pencil,
    borderStyle: 'dashed',
  },
  taskStatusIndicator: {
    flex: 1,
  },
  taskStatusText: {
    fontSize: typography.small,
    color: colors.textSecondary,
    lineHeight: typography.lineHeight.normal * typography.small,
    letterSpacing: typography.letterSpacing.normal,
    fontStyle: 'italic',
  },
  taskActionButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  addTaskButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#28a745',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#28a745',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  addTaskText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  tasksList: {
    flex: 1,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.nature.forest,
    shadowColor: colors.nature.forest,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  taskLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  taskCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  taskInfo: {
    flex: 1,
  },
  taskText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  taskTime: {
    fontSize: 13,
    color: '#6c757d',
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteTaskButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#fff5f5',
  },
  // Estilos para Bullet Journal de Eventos
  bulletJournalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  journalHeader: {
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: spacing.lg,
    marginBottom: spacing.md,
    marginHorizontal: 0,
    width: '100%',
  },
  headerDecoration: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  mascotImage: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.full,
    ...shadows.md,
  },
  journalMainTitle: {
    fontSize: typography.h2,
    color: colors.ink,
    textAlign: 'center',
    marginBottom: spacing.sm,
    lineHeight: typography.lineHeight.tight * typography.h2,
    letterSpacing: typography.letterSpacing.wide,
  },
  journalSubtitle: {
    fontSize: typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: typography.lineHeight.comfortable * typography.body,
    letterSpacing: typography.letterSpacing.normal,
    fontStyle: 'italic',
  },
  headerLine: {
    marginTop: spacing.sm,
  },
  journalContent: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  journalScroll: {
    flex: 1,
  },
  // Estado vacío en estilo bullet journal
  emptyJournalNote: {
    padding: spacing.lg,
    marginVertical: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.pencil,
    ...shadows.paper,
  },
  emptyIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  emptyTitle: {
    fontSize: typography.h3,
    color: colors.ink,
    textAlign: 'center',
    marginBottom: spacing.sm,
    lineHeight: typography.lineHeight.tight * typography.h3,
    letterSpacing: typography.letterSpacing.wide,
  },
  emptySubtitle: {
    fontSize: typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: typography.lineHeight.comfortable * typography.body,
    letterSpacing: typography.letterSpacing.normal,
    fontStyle: 'italic',
    marginBottom: spacing.md,
  },
  emptyTipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.watercolor2,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    marginTop: spacing.sm,
  },
  emptyTip: {
    fontSize: typography.small,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
    lineHeight: typography.lineHeight.normal * typography.small,
    letterSpacing: typography.letterSpacing.normal,
    fontStyle: 'italic',
  },
  // Lista de eventos en estilo bullet journal
  eventsJournalList: {
    gap: spacing.md,
  },
  journalEventEntry: {
    backgroundColor: colors.paper,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: colors.nature.forest,
    shadowColor: colors.nature.forest,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  eventJournalLine: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  eventBulletSection: {
    alignItems: 'center',
    marginRight: spacing.sm,
    minWidth: 40,
  },
  eventSticker: {
    marginTop: spacing.xs,
  },
  eventContent: {
    flex: 1,
  },
  eventTextContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  eventTitle: {
    flex: 1,
    fontSize: typography.h6,
    color: colors.textPrimary,
    fontWeight: typography.bold,
    lineHeight: typography.lineHeight.comfortable * typography.h6,
    letterSpacing: typography.letterSpacing.normal,
    marginBottom: spacing.xs,
  },
  eventDecorations: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: spacing.sm,
    gap: spacing.xs,
  },
  eventJournalInfo: {
    flexDirection: 'column',
    gap: spacing.sm,
    marginTop: spacing.sm,
    padding: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.nature.sage,
  },
  eventInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.nature.ocean,
    shadowColor: colors.nature.ocean,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  eventInfoText: {
    fontSize: typography.body,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
    lineHeight: typography.lineHeight.normal * typography.body,
    letterSpacing: typography.letterSpacing.normal,
    fontWeight: typography.medium,
  },
  eventLine: {
    marginVertical: spacing.sm,
  },
  eventTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.watercolor3,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
  },
  eventTypeText: {
    fontSize: typography.small,
    marginLeft: spacing.xs,
    lineHeight: typography.lineHeight.normal * typography.small,
    letterSpacing: typography.letterSpacing.normal,
    fontStyle: 'italic',
  },
  eventJournalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.pencil,
    borderStyle: 'dashed',
  },
  eventStatusIndicator: {
    flex: 1,
  },
  eventStatusText: {
    fontSize: typography.small,
    color: colors.textSecondary,
    lineHeight: typography.lineHeight.normal * typography.small,
    letterSpacing: typography.letterSpacing.normal,
    fontStyle: 'italic',
  },
  eventActionButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  journalActionButton: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    backgroundColor: colors.watercolor1,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.paper,
  },
  editButton: {
    backgroundColor: colors.highlighter,
  },
  deleteButton: {
    backgroundColor: colors.watercolor4,
  },
  // Estilos para Bullet Journal de Configuración
  settingsJournalNote: {
    padding: spacing.lg,
    marginVertical: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.pencil,
    ...shadows.paper,
  },
  settingsIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  sectionsJournalList: {
    gap: spacing.md,
  },
  journalSectionEntry: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.pencil,
    ...shadows.paper,
  },
  sectionJournalLine: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  sectionBulletSection: {
    alignItems: 'center',
    marginRight: spacing.sm,
    minWidth: 40,
  },
  sectionSticker: {
    marginTop: spacing.xs,
  },
  sectionContent: {
    flex: 1,
  },
  sectionTextContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    flex: 1,
    fontSize: typography.body,
    color: colors.ink,
    lineHeight: typography.lineHeight.comfortable * typography.body,
    letterSpacing: typography.letterSpacing.normal,
    fontStyle: 'italic',
  },
  activeSectionTitle: {
    color: colors.primary,
    fontWeight: typography.bold,
  },
  sectionDecorations: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: spacing.sm,
    gap: spacing.xs,
  },
  sectionJournalInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.sm,
    gap: spacing.md,
  },
  sectionInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.watercolor1,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  sectionInfoText: {
    fontSize: typography.small,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
    lineHeight: typography.lineHeight.normal * typography.small,
    letterSpacing: typography.letterSpacing.normal,
    fontStyle: 'italic',
  },
  sectionLine: {
    marginVertical: spacing.sm,
  },
  sectionStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.watercolor3,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
  },
  sectionStatusText: {
    fontSize: typography.small,
    marginLeft: spacing.xs,
    lineHeight: typography.lineHeight.normal * typography.small,
    letterSpacing: typography.letterSpacing.normal,
    fontStyle: 'italic',
  },
  sectionJournalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.pencil,
    borderStyle: 'dashed',
  },
  sectionStatusIndicator: {
    flex: 1,
  },
  sectionStatusIndicatorText: {
    fontSize: typography.small,
    color: colors.textSecondary,
    lineHeight: typography.lineHeight.normal * typography.small,
    letterSpacing: typography.letterSpacing.normal,
    fontStyle: 'italic',
  },
  sectionActionButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  settingsFooterNote: {
    padding: spacing.lg,
    marginVertical: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.pencil,
    ...shadows.paper,
  },
  footerIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  footerTitle: {
    fontSize: typography.h4,
    color: colors.ink,
    textAlign: 'center',
    marginBottom: spacing.sm,
    lineHeight: typography.lineHeight.tight * typography.h4,
    letterSpacing: typography.letterSpacing.wide,
  },
  footerText: {
    fontSize: typography.small,
    color: colors.textSecondary,
    lineHeight: typography.lineHeight.normal * typography.small,
    letterSpacing: typography.letterSpacing.normal,
    fontStyle: 'italic',
    marginBottom: spacing.xs,
  },
  footerTipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.watercolor2,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    marginTop: spacing.sm,
  },
  footerTip: {
    fontSize: typography.small,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
    lineHeight: typography.lineHeight.normal * typography.small,
    letterSpacing: typography.letterSpacing.normal,
    fontStyle: 'italic',
  },
  // Estilos para la sección de cerrar sesión
  logoutSection: {
    marginVertical: spacing.lg,
  },
  logoutNote: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.pencil,
    ...shadows.paper,
  },
  logoutIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  logoutTitle: {
    fontSize: typography.h4,
    color: colors.ink,
    textAlign: 'center',
    marginBottom: spacing.sm,
    lineHeight: typography.lineHeight.tight * typography.h4,
    letterSpacing: typography.letterSpacing.wide,
  },
  logoutSubtitle: {
    fontSize: typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: typography.lineHeight.comfortable * typography.body,
    letterSpacing: typography.letterSpacing.normal,
    fontStyle: 'italic',
    marginBottom: spacing.md,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.watercolor4,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.pencil,
    gap: spacing.sm,
    marginTop: spacing.md,
    ...shadows.sm,
  },
  logoutButtonText: {
    fontSize: typography.body,
    color: colors.textSecondary,
    fontWeight: typography.bold,
    lineHeight: typography.lineHeight.normal * typography.body,
    letterSpacing: typography.letterSpacing.normal,
  },
  // Estilos para tarjetas simplificadas de configuración
  simpleSectionCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: colors.pencil,
    ...shadows.paper,
  },
  activeSectionCard: {
    borderColor: colors.primary,
    backgroundColor: colors.watercolor1,
    ...shadows.md,
  },
  sectionCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionIconContainer: {
    marginRight: spacing.md,
  },
  sectionIconSticker: {
    backgroundColor: colors.watercolor2,
  },
  sectionInfoContainer: {
    flex: 1,
  },
  sectionCardTitle: {
    fontSize: typography.h4,
    color: colors.ink,
    marginBottom: spacing.xs,
    lineHeight: typography.lineHeight.tight * typography.h4,
    letterSpacing: typography.letterSpacing.normal,
  },
  sectionCardDescription: {
    fontSize: typography.small,
    color: colors.textSecondary,
    lineHeight: typography.lineHeight.normal * typography.small,
    letterSpacing: typography.letterSpacing.normal,
    fontStyle: 'italic',
  },
  sectionStatusBadge: {
    backgroundColor: colors.watercolor3,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  sectionStatusText: {
    fontSize: typography.small,
    fontWeight: typography.bold,
    lineHeight: typography.lineHeight.normal * typography.small,
    letterSpacing: typography.letterSpacing.normal,
  },
  sectionCardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.pencil,
    borderStyle: 'dashed',
  },
  sectionToggleButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    marginRight: spacing.sm,
    alignItems: 'center',
    ...shadows.sm,
  },
  sectionToggleText: {
    fontSize: typography.small,
    fontWeight: typography.bold,
    lineHeight: typography.lineHeight.normal * typography.small,
    letterSpacing: typography.letterSpacing.normal,
  },
  sectionClearButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.watercolor4,
    borderWidth: 1,
    borderColor: colors.pencil,
    alignItems: 'center',
    ...shadows.sm,
  },
  sectionClearText: {
    fontSize: typography.small,
    color: colors.textSecondary,
    fontWeight: typography.medium,
    lineHeight: typography.lineHeight.normal * typography.small,
    letterSpacing: typography.letterSpacing.normal,
  },
  // Estilos para formato moderno de configuración
  modernSectionCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.pencil,
    ...shadows.sm,
  },
  modernActiveCard: {
    borderColor: colors.primary,
    backgroundColor: colors.watercolor1,
    ...shadows.md,
  },
  modernCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modernCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  modernIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
    ...shadows.sm,
  },
  modernIconSticker: {
    backgroundColor: 'transparent',
  },
  modernTextContainer: {
    flex: 1,
  },
  modernCardTitle: {
    fontSize: typography.h4,
    color: colors.ink,
    marginBottom: spacing.xs,
    lineHeight: typography.lineHeight.tight * typography.h4,
    letterSpacing: typography.letterSpacing.normal,
    fontWeight: typography.bold,
  },
  modernCardSubtitle: {
    fontSize: typography.small,
    color: colors.textSecondary,
    lineHeight: typography.lineHeight.normal * typography.small,
    letterSpacing: typography.letterSpacing.normal,
    fontStyle: 'italic',
  },
  modernToggle: {
    width: 50,
    height: 28,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    paddingHorizontal: 2,
    ...shadows.sm,
  },
  modernToggleThumb: {
    width: 24,
    height: 24,
    borderRadius: borderRadius.full,
    ...shadows.sm,
  },
  modernCardActions: {
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.pencil,
    borderStyle: 'dashed',
  },
  modernActionButton: {
    backgroundColor: colors.watercolor4,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    ...shadows.sm,
  },
  modernActionText: {
    fontSize: typography.small,
    color: colors.textSecondary,
    fontWeight: typography.medium,
    lineHeight: typography.lineHeight.normal * typography.small,
    letterSpacing: typography.letterSpacing.normal,
  },
  // Estilos para formato compacto de configuración
  compactSectionItem: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.pencil,
    ...shadows.sm,
  },
  compactActiveItem: {
    borderColor: colors.primary,
    backgroundColor: colors.watercolor1,
    ...shadows.md,
  },
  compactContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  compactLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  compactIconContainer: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    backgroundColor: colors.watercolor2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
    ...shadows.sm,
  },
  compactIconSticker: {
    backgroundColor: 'transparent',
  },
  compactTextWrapper: {
    flex: 1,
  },
  compactTitle: {
    fontSize: typography.body,
    color: colors.ink,
    marginBottom: spacing.xs,
    lineHeight: typography.lineHeight.tight * typography.body,
    letterSpacing: typography.letterSpacing.normal,
    fontWeight: typography.bold,
  },
  compactDescription: {
    fontSize: typography.small,
    color: colors.textSecondary,
    lineHeight: typography.lineHeight.normal * typography.small,
    letterSpacing: typography.letterSpacing.normal,
    fontStyle: 'italic',
  },
  compactRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  compactStatusIndicator: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    minWidth: 40,
    alignItems: 'center',
  },
  compactStatusText: {
    fontSize: typography.small,
    color: colors.surface,
    fontWeight: typography.bold,
    lineHeight: typography.lineHeight.normal * typography.small,
    letterSpacing: typography.letterSpacing.normal,
  },
  compactToggleButton: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
  },
  compactToggleText: {
    fontSize: typography.small,
    fontWeight: typography.bold,
    lineHeight: typography.lineHeight.normal * typography.small,
    letterSpacing: typography.letterSpacing.normal,
  },
  compactActions: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.pencil,
    borderStyle: 'dashed',
  },
  compactActionButton: {
    backgroundColor: colors.watercolor4,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    ...shadows.sm,
  },
  compactActionText: {
    fontSize: typography.small,
    color: colors.textSecondary,
    fontWeight: typography.medium,
    lineHeight: typography.lineHeight.normal * typography.small,
    letterSpacing: typography.letterSpacing.normal,
  },
  // Estilos para formato grid de configuración
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  gridCard: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 2,
    borderColor: colors.pencil,
    ...shadows.md,
    minHeight: 180,
  },
  gridActiveCard: {
    borderColor: colors.primary,
    backgroundColor: colors.watercolor1,
    ...shadows.lg,
  },
  gridCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  gridIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
  },
  gridIconSticker: {
    backgroundColor: 'transparent',
  },
  gridStatusBadge: {
    width: 24,
    height: 24,
    borderRadius: borderRadius.full,
    backgroundColor: colors.watercolor3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridStatusText: {
    fontSize: typography.small,
    fontWeight: typography.bold,
    lineHeight: typography.lineHeight.normal * typography.small,
    letterSpacing: typography.letterSpacing.normal,
  },
  gridCardContent: {
    flex: 1,
    marginBottom: spacing.md,
  },
  gridCardTitle: {
    fontSize: typography.h4,
    color: colors.ink,
    marginBottom: spacing.xs,
    lineHeight: typography.lineHeight.tight * typography.h4,
    letterSpacing: typography.letterSpacing.normal,
    fontWeight: typography.bold,
  },
  gridCardDescription: {
    fontSize: typography.small,
    color: colors.textSecondary,
    lineHeight: typography.lineHeight.normal * typography.small,
    letterSpacing: typography.letterSpacing.normal,
    fontStyle: 'italic',
  },
  gridCardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  gridToggleButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    ...shadows.sm,
  },
  gridToggleText: {
    fontSize: typography.small,
    fontWeight: typography.bold,
    lineHeight: typography.lineHeight.normal * typography.small,
    letterSpacing: typography.letterSpacing.normal,
  },
  gridActionButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: colors.watercolor4,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
  },
  gridActionText: {
    fontSize: typography.small,
    lineHeight: typography.lineHeight.normal * typography.small,
    letterSpacing: typography.letterSpacing.normal,
  },
  // Estilos para formato acordeón de configuración
  accordionContainer: {
    gap: spacing.sm,
  },
  accordionItem: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.pencil,
    overflow: 'hidden',
    ...shadows.md,
  },
  accordionActiveItem: {
    borderColor: colors.primary,
    backgroundColor: colors.watercolor1,
    ...shadows.lg,
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
  },
  accordionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  accordionIcon: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
    ...shadows.sm,
  },
  accordionIconSticker: {
    backgroundColor: 'transparent',
  },
  accordionIconStyle: {
    textAlign: 'center',
  },
  accordionInfo: {
    flex: 1,
  },
  accordionTitle: {
    fontSize: typography.h4,
    color: colors.ink,
    marginBottom: spacing.xs,
    lineHeight: typography.lineHeight.tight * typography.h4,
    letterSpacing: typography.letterSpacing.normal,
    fontWeight: typography.bold,
  },
  accordionSubtitle: {
    fontSize: typography.small,
    color: colors.textSecondary,
    lineHeight: typography.lineHeight.normal * typography.small,
    letterSpacing: typography.letterSpacing.normal,
    fontStyle: 'italic',
  },
  accordionHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  accordionStatus: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    minWidth: 50,
    alignItems: 'center',
  },
  accordionStatusText: {
    fontSize: typography.small,
    fontWeight: typography.bold,
    lineHeight: typography.lineHeight.normal * typography.small,
    letterSpacing: typography.letterSpacing.normal,
  },
  accordionArrow: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    backgroundColor: colors.watercolor3,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
  },
  accordionArrowText: {
    fontSize: typography.small,
    color: colors.textSecondary,
    fontWeight: typography.bold,
    lineHeight: typography.lineHeight.normal * typography.small,
    letterSpacing: typography.letterSpacing.normal,
  },
  accordionContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.pencil,
    borderStyle: 'dashed',
  },
  accordionContentHeader: {
    marginBottom: spacing.md,
  },
  accordionContentTitle: {
    fontSize: typography.body,
    color: colors.ink,
    marginBottom: spacing.xs,
    lineHeight: typography.lineHeight.normal * typography.body,
    letterSpacing: typography.letterSpacing.normal,
    fontWeight: typography.bold,
  },
  accordionContentDescription: {
    fontSize: typography.small,
    color: colors.textSecondary,
    lineHeight: typography.lineHeight.normal * typography.small,
    letterSpacing: typography.letterSpacing.normal,
    fontStyle: 'italic',
  },
  accordionActions: {
    gap: spacing.sm,
  },
  accordionActionButton: {
    backgroundColor: colors.watercolor4,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    ...shadows.sm,
  },
  accordionActionText: {
    fontSize: typography.small,
    color: colors.textSecondary,
    fontWeight: typography.medium,
    lineHeight: typography.lineHeight.normal * typography.small,
    letterSpacing: typography.letterSpacing.normal,
  },
  accordionSecondaryButton: {
    backgroundColor: colors.watercolor2,
  },
  accordionSecondaryText: {
    fontSize: typography.small,
    color: colors.textSecondary,
    fontWeight: typography.medium,
    lineHeight: typography.lineHeight.normal * typography.small,
    letterSpacing: typography.letterSpacing.normal,
  },
  addEventButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  addEventText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  eventsList: {
    flex: 1,
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.nature.sunset,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  eventLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  eventIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  eventTime: {
    fontSize: 13,
    color: '#6c757d',
    marginBottom: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventLocation: {
    fontSize: 13,
    color: '#6c757d',
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  editEventButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#e3f2fd',
  },
  deleteEventButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#fff5f5',
  },
  // Estilos compartidos
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6c757d',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#adb5bd',
    textAlign: 'center',
  },
});

export default PersonalSections;
