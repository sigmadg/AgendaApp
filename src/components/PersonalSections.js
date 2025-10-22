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
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import CalendarView from './CalendarView';
import TaskList from './TaskList';
import EventsSchedule from './EventsSchedule';

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

  const sections = [
    { id: 'events', name: 'Eventos del día', icon: 'time-outline' },
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
            <View style={[styles.tabIconContainer, {
              backgroundColor: activeSection === section.id ? '#667eea' : 'transparent',
              borderColor: activeSection === section.id ? '#667eea' : '#e9ecef',
              transform: [{ scale: activeSection === section.id ? 1.15 : 1 }]
            }]}>
              <Icon 
                name={section.icon} 
                size={22} 
                color={activeSection === section.id ? '#FFFFFF' : '#6c757d'} 
              />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
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

  const renderTasks = () => (
    <View style={styles.tasksContainer}>
      <View style={styles.tasksHeader}>
        <Text style={styles.tasksTitle}>Tareas del Día</Text>
        <Text style={styles.tasksSubtitle}>
          Resumen de tareas de todas las secciones
        </Text>
      </View>
      
      <View style={styles.tasksContent}>
        <ScrollView style={styles.tasksList} showsVerticalScrollIndicator={false}>
          <View style={styles.emptyState}>
            <Icon name="checkmark-circle-outline" size={64} color="#e9ecef" />
            <Text style={styles.emptyStateText}>No hay tareas para hoy</Text>
            <Text style={styles.emptyStateSubtext}>Las tareas agregadas en otras secciones aparecerán aquí</Text>
          </View>
        </ScrollView>
      </View>
    </View>
  );

  const renderEvents = () => (
    <View style={styles.eventsContainer}>
      <View style={styles.eventsHeader}>
        <Text style={styles.eventsTitle}>Eventos del Día</Text>
        <Text style={styles.eventsSubtitle}>
          Resumen de eventos de todas las secciones
        </Text>
      </View>
      
      <View style={styles.eventsContent}>
        <ScrollView style={styles.eventsList} showsVerticalScrollIndicator={false}>
          <View style={styles.emptyState}>
            <Icon name="calendar-outline" size={64} color="#e9ecef" />
            <Text style={styles.emptyStateText}>No hay eventos para hoy</Text>
            <Text style={styles.emptyStateSubtext}>Los eventos agregados en otras secciones aparecerán aquí</Text>
          </View>
        </ScrollView>
      </View>
    </View>
  );


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
        <TouchableOpacity style={styles.optionItem} onPress={openProfileModal}>
          <View style={styles.optionLeft}>
            <View style={[styles.optionIcon, { backgroundColor: '#e3f2fd' }]}>
              <Icon name="person-outline" size={20} color="#1976d2" />
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionText}>Editar Perfil</Text>
              <Text style={styles.optionSubtext}>Actualiza tu información personal</Text>
            </View>
          </View>
          <Icon name="chevron-forward" size={18} color="#6c757d" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionItem} onPress={openPasswordModal}>
          <View style={styles.optionLeft}>
            <View style={[styles.optionIcon, { backgroundColor: '#fff3e0' }]}>
              <Icon name="lock-closed-outline" size={20} color="#f57c00" />
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionText}>Cambiar Contraseña</Text>
              <Text style={styles.optionSubtext}>Actualiza tu contraseña de seguridad</Text>
            </View>
          </View>
          <Icon name="chevron-forward" size={18} color="#6c757d" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionItem} onPress={() => Alert.alert('Próximamente', 'Esta función estará disponible pronto')}>
          <View style={styles.optionLeft}>
            <View style={[styles.optionIcon, { backgroundColor: '#f3e5f5' }]}>
              <Icon name="notifications-outline" size={20} color="#7b1fa2" />
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionText}>Notificaciones</Text>
              <Text style={styles.optionSubtext}>Configura tus preferencias</Text>
            </View>
          </View>
          <Icon name="chevron-forward" size={18} color="#6c757d" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionItem} onPress={() => Alert.alert('Próximamente', 'Esta función estará disponible pronto')}>
          <View style={styles.optionLeft}>
            <View style={[styles.optionIcon, { backgroundColor: '#e8f5e8' }]}>
              <Icon name="shield-outline" size={20} color="#388e3c" />
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionText}>Privacidad</Text>
              <Text style={styles.optionSubtext}>Controla tu privacidad</Text>
            </View>
          </View>
          <Icon name="chevron-forward" size={18} color="#6c757d" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionItem} onPress={() => Alert.alert('Próximamente', 'Esta función estará disponible pronto')}>
          <View style={styles.optionLeft}>
            <View style={[styles.optionIcon, { backgroundColor: '#fff8e1' }]}>
              <Icon name="help-circle-outline" size={20} color="#f9a825" />
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionText}>Ayuda y Soporte</Text>
              <Text style={styles.optionSubtext}>Obtén ayuda cuando la necesites</Text>
            </View>
          </View>
          <Icon name="chevron-forward" size={18} color="#6c757d" />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.optionItem, styles.logoutOption]} onPress={onLogout}>
          <View style={styles.optionLeft}>
            <View style={[styles.optionIcon, { backgroundColor: '#ffebee' }]}>
              <Icon name="log-out-outline" size={20} color="#d32f2f" />
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={[styles.optionText, styles.logoutText]}>Cerrar Sesión</Text>
              <Text style={styles.optionSubtext}>Salir de tu cuenta</Text>
            </View>
          </View>
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

  const renderSettings = () => (
    <View style={styles.settingsContainer}>
      <View style={styles.settingsHeader}>
        <Text style={styles.settingsTitle}>Configuración de Secciones</Text>
        <Text style={styles.settingsSubtitle}>
          Personaliza tu experiencia activando solo las secciones que necesitas
        </Text>
      </View>

      <View style={styles.sectionsList}>
        {availableSections.map((section, index) => (
          <View key={section.id} style={[styles.sectionItem, { 
            backgroundColor: activeSections[section.id] ? '#f8f9ff' : '#fafafa',
            borderLeftColor: activeSections[section.id] ? section.color : '#e9ecef',
            borderLeftWidth: 4,
            transform: [{ scale: activeSections[section.id] ? 1.02 : 1 }]
          }]}>
            <View style={styles.sectionLeft}>
              <View style={[styles.sectionIcon, { 
                backgroundColor: activeSections[section.id] ? section.color : '#e9ecef',
                shadowColor: section.color,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: activeSections[section.id] ? 0.3 : 0.1,
                shadowRadius: 4,
                elevation: activeSections[section.id] ? 3 : 1,
              }]}>
                <Icon 
                  name={section.icon} 
                  size={22} 
                  color={activeSections[section.id] ? "#FFFFFF" : "#6c757d"} 
                />
              </View>
              <View style={styles.sectionInfo}>
                <Text style={[styles.sectionName, {
                  color: activeSections[section.id] ? '#2c3e50' : '#6c757d',
                  fontWeight: activeSections[section.id] ? '600' : '400'
                }]}>
                  {section.name}
                </Text>
                <View style={styles.statusContainer}>
                  <View style={[styles.statusDot, {
                    backgroundColor: activeSections[section.id] ? '#28a745' : '#dc3545'
                  }]} />
                  <Text style={[styles.sectionStatus, {
                    color: activeSections[section.id] ? '#28a745' : '#dc3545'
                  }]}>
                    {activeSections[section.id] ? 'Activa' : 'Inactiva'}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.sectionControls}>
              <Switch
                value={activeSections[section.id] || false}
                onValueChange={() => onToggleSection(section.id)}
                trackColor={{ false: '#e9ecef', true: section.color }}
                thumbColor={activeSections[section.id] ? '#ffffff' : '#f4f3f4'}
                ios_backgroundColor="#e9ecef"
                style={styles.sectionSwitch}
              />
              <TouchableOpacity
                style={[styles.clearButton, {
                  backgroundColor: activeSections[section.id] ? '#fff5f5' : '#f8f9fa',
                  borderColor: activeSections[section.id] ? '#fecaca' : '#e9ecef'
                }]}
                onPress={() => handleClearSection(section.id)}
              >
                <Icon name="trash-outline" size={16} color="#dc3545" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.settingsFooter}>
        <View style={styles.footerIcon}>
          <Icon name="information-circle" size={20} color="#007AFF" />
        </View>
        <View style={styles.footerContent}>
          <Text style={styles.footerText}>
            Las secciones desactivadas no aparecerán en el menú lateral
          </Text>
          <Text style={styles.footerSubtext}>
            Usa el botón de basura para limpiar los datos de una sección
          </Text>
        </View>
      </View>
    </View>
  );

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
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Editar Perfil</Text>
              <TouchableOpacity onPress={closeProfileModal}>
                <Icon name="close" size={24} color="#6c757d" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nombre</Text>
                <TextInput
                  style={styles.textInput}
                  value={profileData.name}
                  onChangeText={(text) => setProfileData({...profileData, name: text})}
                  placeholder="Ingresa tu nombre"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={styles.textInput}
                  value={profileData.email}
                  onChangeText={(text) => setProfileData({...profileData, email: text})}
                  placeholder="Ingresa tu email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.cancelButton} onPress={closeProfileModal}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleUpdateProfile}>
                <Text style={styles.saveButtonText}>Guardar</Text>
              </TouchableOpacity>
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
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tabsScroll: {
    paddingHorizontal: 20,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 16,
    backgroundColor: 'transparent',
    minWidth: 48,
  },
  activeTab: {
    backgroundColor: '#f8f9ff',
    shadowColor: '#667eea',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  tabIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    shadowColor: '#667eea',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
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
    backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#667eea',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 20,
  },
  avatarInner: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#f8f9ff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#e3f2fd',
    shadowColor: '#667eea',
    shadowOffset: {
      width: 0,
      height: 4,
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
    fontSize: 22,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  profileEmail: {
    fontSize: 15,
    color: '#6c757d',
    marginBottom: 8,
    fontWeight: '400',
  },
  profileBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 12,
    color: '#28a745',
    fontWeight: '600',
    marginLeft: 4,
  },
  profileOptions: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    overflow: 'hidden',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
    marginHorizontal: 4,
    marginVertical: 2,
    borderRadius: 12,
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
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '600',
    marginBottom: 2,
    letterSpacing: 0.2,
  },
  optionSubtext: {
    fontSize: 13,
    color: '#6c757d',
    fontWeight: '400',
  },
  logoutOption: {
    borderBottomWidth: 0,
  },
  logoutText: {
    color: '#d32f2f',
  },
  // Estilos para los modales
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
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
  },
  modalBody: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    marginRight: 8,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#6c757d',
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    padding: 12,
    marginLeft: 8,
    borderRadius: 8,
    backgroundColor: '#007AFF',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
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
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  settingsSubtitle: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '400',
  },
  sectionsList: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
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
  // Estilos para Tareas del Día
  tasksContainer: {
    flex: 1,
  },
  tasksHeader: {
    alignItems: 'center',
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 16,
    marginBottom: 20,
    marginHorizontal: 16,
    shadowColor: '#28a745',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  tasksTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  tasksSubtitle: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '400',
  },
  tasksContent: {
    flex: 1,
    paddingHorizontal: 20,
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
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
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
  // Estilos para Eventos del Día
  eventsContainer: {
    flex: 1,
  },
  eventsHeader: {
    alignItems: 'center',
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 16,
    marginBottom: 20,
    marginHorizontal: 16,
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  eventsTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  eventsSubtitle: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '400',
  },
  eventsContent: {
    flex: 1,
    paddingHorizontal: 20,
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
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
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
