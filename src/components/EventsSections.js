import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const EventsSections = () => {
  const [activeSection, setActiveSection] = useState('birthdays');

  // Estados para cumpleaños
  const [birthdays, setBirthdays] = useState([]);
  const [showAddBirthdayModal, setShowAddBirthdayModal] = useState(false);
  const [newBirthday, setNewBirthday] = useState({
    name: '',
    date: '',
    relationship: '',
    phone: '',
    email: '',
    notes: ''
  });

  // Estados para organización de eventos
  const [eventOrganizations, setEventOrganizations] = useState([]);
  const [showAddEventOrgModal, setShowAddEventOrgModal] = useState(false);
  const [newEventOrg, setNewEventOrg] = useState({
    eventName: '',
    date: '',
    time: '',
    location: '',
    type: '',
    guests: '',
    budget: '',
    notes: ''
  });

  // Estados para recordatorios
  const [reminders, setReminders] = useState([]);
  const [showAddReminderModal, setShowAddReminderModal] = useState(false);
  const [newReminder, setNewReminder] = useState({
    title: '',
    date: '',
    time: '',
    type: '',
    description: ''
  });

  // Estados para invitaciones
  const [invitations, setInvitations] = useState([]);
  const [showAddInvitationModal, setShowAddInvitationModal] = useState(false);
  const [newInvitation, setNewInvitation] = useState({
    eventName: '',
    guestName: '',
    email: '',
    phone: '',
    status: 'pending',
    notes: ''
  });

  const sections = [
    { id: 'birthdays', name: 'Cumpleaños', icon: 'gift-outline' },
    { id: 'event-organization', name: 'Organización', icon: 'people-outline' },
    { id: 'reminders', name: 'Recordatorios', icon: 'alarm-outline' },
    { id: 'invitations', name: 'Invitaciones', icon: 'mail-outline' }
  ];

  // Funciones para cumpleaños
  const openAddBirthdayModal = () => {
    setNewBirthday({
      name: '',
      date: '',
      relationship: '',
      phone: '',
      email: '',
      notes: ''
    });
    setShowAddBirthdayModal(true);
  };

  const closeAddBirthdayModal = () => {
    setShowAddBirthdayModal(false);
  };

  const addBirthday = () => {
    if (!newBirthday.name.trim() || !newBirthday.date.trim()) {
      Alert.alert('Error', 'Por favor completa al menos el nombre y la fecha');
      return;
    }

    const birthday = {
      id: Date.now().toString(),
      ...newBirthday,
      createdAt: new Date().toISOString()
    };

    setBirthdays([...birthdays, birthday]);
    closeAddBirthdayModal();
    Alert.alert('Éxito', 'Cumpleaños agregado correctamente');
  };

  const deleteBirthday = (id) => {
    Alert.alert(
      'Eliminar Cumpleaños',
      '¿Estás seguro de que quieres eliminar este cumpleaños?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            setBirthdays(birthdays.filter(b => b.id !== id));
          }
        }
      ]
    );
  };

  // Funciones para organización de eventos
  const openAddEventOrgModal = () => {
    setNewEventOrg({
      eventName: '',
      date: '',
      time: '',
      location: '',
      type: '',
      guests: '',
      budget: '',
      notes: ''
    });
    setShowAddEventOrgModal(true);
  };

  const closeAddEventOrgModal = () => {
    setShowAddEventOrgModal(false);
  };

  const addEventOrganization = () => {
    if (!newEventOrg.eventName.trim() || !newEventOrg.date.trim()) {
      Alert.alert('Error', 'Por favor completa al menos el nombre del evento y la fecha');
      return;
    }

    const eventOrg = {
      id: Date.now().toString(),
      ...newEventOrg,
      createdAt: new Date().toISOString()
    };

    setEventOrganizations([...eventOrganizations, eventOrg]);
    closeAddEventOrgModal();
    Alert.alert('Éxito', 'Evento agregado correctamente');
  };

  const deleteEventOrganization = (id) => {
    Alert.alert(
      'Eliminar Evento',
      '¿Estás seguro de que quieres eliminar este evento?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            setEventOrganizations(eventOrganizations.filter(e => e.id !== id));
          }
        }
      ]
    );
  };

  // Funciones para recordatorios
  const openAddReminderModal = () => {
    setNewReminder({
      title: '',
      date: '',
      time: '',
      type: '',
      description: ''
    });
    setShowAddReminderModal(true);
  };

  const closeAddReminderModal = () => {
    setShowAddReminderModal(false);
  };

  const addReminder = () => {
    if (!newReminder.title.trim() || !newReminder.date.trim()) {
      Alert.alert('Error', 'Por favor completa al menos el título y la fecha');
      return;
    }

    const reminder = {
      id: Date.now().toString(),
      ...newReminder,
      createdAt: new Date().toISOString()
    };

    setReminders([...reminders, reminder]);
    closeAddReminderModal();
    Alert.alert('Éxito', 'Recordatorio agregado correctamente');
  };

  const deleteReminder = (id) => {
    Alert.alert(
      'Eliminar Recordatorio',
      '¿Estás seguro de que quieres eliminar este recordatorio?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            setReminders(reminders.filter(r => r.id !== id));
          }
        }
      ]
    );
  };

  // Funciones para invitaciones
  const openAddInvitationModal = () => {
    setNewInvitation({
      eventName: '',
      guestName: '',
      email: '',
      phone: '',
      status: 'pending',
      notes: ''
    });
    setShowAddInvitationModal(true);
  };

  const closeAddInvitationModal = () => {
    setShowAddInvitationModal(false);
  };

  const addInvitation = () => {
    if (!newInvitation.eventName.trim() || !newInvitation.guestName.trim()) {
      Alert.alert('Error', 'Por favor completa al menos el nombre del evento y el invitado');
      return;
    }

    const invitation = {
      id: Date.now().toString(),
      ...newInvitation,
      createdAt: new Date().toISOString()
    };

    setInvitations([...invitations, invitation]);
    closeAddInvitationModal();
    Alert.alert('Éxito', 'Invitación agregada correctamente');
  };

  const deleteInvitation = (id) => {
    Alert.alert(
      'Eliminar Invitación',
      '¿Estás seguro de que quieres eliminar esta invitación?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            setInvitations(invitations.filter(i => i.id !== id));
          }
        }
      ]
    );
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

  const renderBirthdays = () => {
    // Datos de muestra para demostrar el nuevo diseño
    const sampleBirthdays = [
      {
        id: 1,
        name: 'María García',
        date: '2024-03-15',
        relationship: 'Hermana',
        phone: '+34 612 345 678',
        email: 'maria.garcia@email.com',
        notes: 'Le encanta el chocolate y los libros',
        age: 28,
        daysUntil: 45,
        category: 'Familia'
      },
      {
        id: 2,
        name: 'Carlos López',
        date: '2024-01-22',
        relationship: 'Mejor Amigo',
        phone: '+34 678 901 234',
        email: 'carlos.lopez@email.com',
        notes: 'Fanático del fútbol y la música rock',
        age: 32,
        daysUntil: 12,
        category: 'Amigos'
      },
      {
        id: 3,
        name: 'Ana Martínez',
        date: '2024-02-08',
        relationship: 'Colega de Trabajo',
        phone: '+34 655 123 456',
        email: 'ana.martinez@empresa.com',
        notes: 'Le gusta el café y las plantas',
        age: 35,
        daysUntil: 29,
        category: 'Trabajo'
      },
      {
        id: 4,
        name: 'Roberto Silva',
        date: '2024-04-03',
        relationship: 'Primo',
        phone: '+34 611 987 654',
        email: 'roberto.silva@email.com',
        notes: 'Aficionado a la fotografía y los viajes',
        age: 26,
        daysUntil: 64,
        category: 'Familia'
      }
    ];

    const getCategoryColor = (category) => {
      const colors = {
        'Familia': '#E91E63',
        'Amigos': '#2196F3',
        'Trabajo': '#FF9800',
        'Otros': '#9C27B0'
      };
      return colors[category] || '#9C27B0';
    };

    const getCategoryIcon = (category) => {
      const icons = {
        'Familia': 'people',
        'Amigos': 'happy',
        'Trabajo': 'briefcase',
        'Otros': 'person'
      };
      return icons[category] || 'person';
    };

    const getDaysUntilText = (days) => {
      if (days === 0) return '¡Hoy es su cumpleaños!';
      if (days === 1) return 'Mañana es su cumpleaños';
      if (days < 7) return `En ${days} días`;
      if (days < 30) return `En ${Math.floor(days / 7)} semanas`;
      return `En ${Math.floor(days / 30)} meses`;
    };

    const getUrgencyColor = (days) => {
      if (days <= 7) return '#FF5722';
      if (days <= 30) return '#FF9800';
      return '#4CAF50';
    };

    return (
    <View style={styles.sectionContainer}>
        {/* Header mejorado */}
        <View style={styles.birthdayHeader}>
          <View style={styles.birthdayHeaderContent}>
            <View style={styles.birthdayHeaderIcon}>
              <Icon name="gift" size={28} color="#FFFFFF" />
        </View>
            <View style={styles.birthdayHeaderText}>
              <Text style={styles.birthdayHeaderTitle}>Cumpleaños</Text>
              <Text style={styles.birthdayHeaderSubtitle}>
                Celebra los momentos especiales
              </Text>
            </View>
          </View>
          <View style={styles.birthdayHeaderBadge}>
            <Text style={styles.birthdayHeaderCount}>{sampleBirthdays.length}</Text>
        </View>
      </View>

        {/* Estadísticas rápidas */}
        <View style={styles.birthdayStats}>
          <View style={styles.birthdayStatCard}>
            <View style={styles.birthdayStatIcon}>
              <Icon name="calendar" size={20} color="#E91E63" />
            </View>
            <View style={styles.birthdayStatContent}>
              <Text style={styles.birthdayStatValue}>
                {sampleBirthdays.filter(b => b.daysUntil <= 30).length}
              </Text>
              <Text style={styles.birthdayStatLabel}>Próximo mes</Text>
            </View>
          </View>
          <View style={styles.birthdayStatCard}>
            <View style={styles.birthdayStatIcon}>
              <Icon name="time" size={20} color="#FF9800" />
            </View>
            <View style={styles.birthdayStatContent}>
              <Text style={styles.birthdayStatValue}>
                {sampleBirthdays.filter(b => b.daysUntil <= 7).length}
              </Text>
              <Text style={styles.birthdayStatLabel}>Esta semana</Text>
            </View>
          </View>
          <View style={styles.birthdayStatCard}>
            <View style={styles.birthdayStatIcon}>
              <Icon name="today" size={20} color="#4CAF50" />
            </View>
            <View style={styles.birthdayStatContent}>
              <Text style={styles.birthdayStatValue}>
                {sampleBirthdays.filter(b => b.daysUntil === 0).length}
              </Text>
              <Text style={styles.birthdayStatLabel}>Hoy</Text>
            </View>
          </View>
        </View>

        {/* Botón de acción principal */}
        <TouchableOpacity style={styles.birthdayAddButton} onPress={openAddBirthdayModal}>
          <Icon name="add-circle-outline" size={24} color="#FFFFFF" />
          <Text style={styles.birthdayAddButtonText}>Agregar Cumpleaños</Text>
      </TouchableOpacity>

        {/* Lista de cumpleaños mejorada */}
      <View style={styles.birthdaysList}>
          {sampleBirthdays.length === 0 ? (
            <View style={styles.birthdayEmptyState}>
              <View style={styles.birthdayEmptyIcon}>
                <Icon name="gift-outline" size={64} color="#E0E0E0" />
              </View>
              <Text style={styles.birthdayEmptyTitle}>No hay cumpleaños registrados</Text>
              <Text style={styles.birthdayEmptySubtitle}>
                Agrega el primer cumpleaños para comenzar a celebrar
              </Text>
          </View>
        ) : (
            sampleBirthdays.map((birthday) => (
            <View key={birthday.id} style={styles.birthdayCard}>
                <View style={styles.birthdayCardHeader}>
                  <View style={styles.birthdayCardInfo}>
                    <View style={styles.birthdayCardTitleRow}>
                      <View style={styles.birthdayCardAvatar}>
                        <Text style={styles.birthdayCardAvatarText}>
                          {birthday.name.split(' ').map(n => n[0]).join('')}
                        </Text>
                </View>
                      <View style={styles.birthdayCardTitleContent}>
                        <Text style={styles.birthdayCardName}>{birthday.name}</Text>
                        <Text style={styles.birthdayCardAge}>Cumple {birthday.age} años</Text>
                </View>
                      <View style={[
                        styles.birthdayCategoryBadge,
                        { backgroundColor: getCategoryColor(birthday.category) }
                      ]}>
                        <Icon 
                          name={getCategoryIcon(birthday.category)} 
                          size={12} 
                          color="#FFFFFF" 
                        />
                        <Text style={styles.birthdayCategoryText}>{birthday.category}</Text>
                      </View>
                    </View>
                    <Text style={styles.birthdayCardRelationship}>{birthday.relationship}</Text>
                    <View style={styles.birthdayCardDateRow}>
                      <Icon name="calendar-outline" size={16} color="#6B7280" />
                      <Text style={styles.birthdayCardDate}>{birthday.date}</Text>
                    </View>
                  </View>
                  <View style={styles.birthdayCardActions}>
                    <TouchableOpacity style={styles.birthdayEditButton}>
                      <Icon name="create-outline" size={16} color="#667eea" />
                    </TouchableOpacity>
                <TouchableOpacity 
                      style={styles.birthdayDeleteButton}
                  onPress={() => deleteBirthday(birthday.id)}
                >
                  <Icon name="trash-outline" size={16} color="#dc3545" />
                </TouchableOpacity>
              </View>
                </View>

                {/* Indicador de urgencia */}
                <View style={styles.birthdayUrgencyContainer}>
                  <View style={[
                    styles.birthdayUrgencyBadge,
                    { backgroundColor: getUrgencyColor(birthday.daysUntil) }
                  ]}>
                    <Icon name="time-outline" size={14} color="#FFFFFF" />
                    <Text style={styles.birthdayUrgencyText}>
                      {getDaysUntilText(birthday.daysUntil)}
                    </Text>
                  </View>
                </View>

                {/* Detalles de contacto */}
              {(birthday.phone || birthday.email || birthday.notes) && (
                  <View style={styles.birthdayCardDetails}>
                  {birthday.phone && (
                      <TouchableOpacity style={styles.birthdayDetailItem}>
                        <View style={styles.birthdayDetailIcon}>
                          <Icon name="call-outline" size={16} color="#4CAF50" />
                    </View>
                        <Text style={styles.birthdayDetailText}>{birthday.phone}</Text>
                        <Icon name="chevron-forward" size={16} color="#9E9E9E" />
                      </TouchableOpacity>
                  )}
                  {birthday.email && (
                      <TouchableOpacity style={styles.birthdayDetailItem}>
                        <View style={styles.birthdayDetailIcon}>
                          <Icon name="mail-outline" size={16} color="#2196F3" />
                    </View>
                        <Text style={styles.birthdayDetailText}>{birthday.email}</Text>
                        <Icon name="chevron-forward" size={16} color="#9E9E9E" />
                      </TouchableOpacity>
                  )}
                  {birthday.notes && (
                      <View style={styles.birthdayDetailItem}>
                        <View style={styles.birthdayDetailIcon}>
                          <Icon name="document-text-outline" size={16} color="#FF9800" />
                        </View>
                        <Text style={styles.birthdayDetailText}>{birthday.notes}</Text>
                    </View>
                  )}
                </View>
              )}

                {/* Botones de acción rápida */}
                <View style={styles.birthdayQuickActions}>
                  <TouchableOpacity style={styles.birthdayQuickAction}>
                    <Icon name="call" size={16} color="#4CAF50" />
                    <Text style={styles.birthdayQuickActionText}>Llamar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.birthdayQuickAction}>
                    <Icon name="mail" size={16} color="#2196F3" />
                    <Text style={styles.birthdayQuickActionText}>Enviar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.birthdayQuickAction}>
                    <Icon name="gift" size={16} color="#E91E63" />
                    <Text style={styles.birthdayQuickActionText}>Regalo</Text>
                  </TouchableOpacity>
                </View>
            </View>
          ))
        )}
      </View>
    </View>
  );
  };

  const renderEventOrganization = () => {
    // Datos de muestra para demostrar el nuevo diseño
    const sampleEvents = [
      {
        id: 1,
        eventName: 'Boda de María y Carlos',
        date: '2024-06-15',
        time: '16:00',
        location: 'Hotel Grand Palace, Madrid',
        type: 'Boda',
        guests: 120,
        budget: '€15,000',
        status: 'En Planificación',
        priority: 'Alta',
        progress: 75,
        notes: 'Confirmar catering y flores',
        category: 'Celebración'
      },
      {
        id: 2,
        eventName: 'Conferencia Tech 2024',
        date: '2024-03-22',
        time: '09:00',
        location: 'Centro de Convenciones Barcelona',
        type: 'Conferencia',
        guests: 300,
        budget: '€25,000',
        status: 'Confirmado',
        priority: 'Media',
        progress: 90,
        notes: 'Últimos detalles de logística',
        category: 'Profesional'
      },
      {
        id: 3,
        eventName: 'Cumpleaños de Ana',
        date: '2024-02-14',
        time: '19:00',
        location: 'Casa de Ana, Valencia',
        type: 'Cumpleaños',
        guests: 25,
        budget: '€500',
        status: 'Completado',
        priority: 'Baja',
        progress: 100,
        notes: 'Evento exitoso, todos disfrutaron',
        category: 'Personal'
      },
      {
        id: 4,
        eventName: 'Reunión de Equipo Q1',
        date: '2024-01-30',
        time: '14:00',
        location: 'Oficina Principal',
        type: 'Reunión',
        guests: 15,
        budget: '€200',
        status: 'En Progreso',
        priority: 'Alta',
        progress: 60,
        notes: 'Preparar presentaciones trimestrales',
        category: 'Trabajo'
      }
    ];

    const getCategoryColor = (category) => {
      const colors = {
        'Celebración': '#E91E63',
        'Profesional': '#2196F3',
        'Personal': '#4CAF50',
        'Trabajo': '#FF9800',
        'Otros': '#9C27B0'
      };
      return colors[category] || '#9C27B0';
    };

    const getCategoryIcon = (category) => {
      const icons = {
        'Celebración': 'gift',
        'Profesional': 'briefcase',
        'Personal': 'heart',
        'Trabajo': 'business',
        'Otros': 'calendar'
      };
      return icons[category] || 'calendar';
    };

    const getStatusColor = (status) => {
      const colors = {
        'En Planificación': '#FF9800',
        'Confirmado': '#2196F3',
        'En Progreso': '#9C27B0',
        'Completado': '#4CAF50',
        'Cancelado': '#F44336'
      };
      return colors[status] || '#6B7280';
    };

    const getPriorityColor = (priority) => {
      const colors = {
        'Alta': '#F44336',
        'Media': '#FF9800',
        'Baja': '#4CAF50'
      };
      return colors[priority] || '#6B7280';
    };

    const getDaysUntilEvent = (date) => {
      const today = new Date();
      const eventDate = new Date(date);
      const diffTime = eventDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    };

    const getEventUrgency = (days) => {
      if (days < 0) return { text: 'Pasado', color: '#6B7280' };
      if (days === 0) return { text: 'Hoy', color: '#F44336' };
      if (days <= 7) return { text: `${days} días`, color: '#FF5722' };
      if (days <= 30) return { text: `${Math.floor(days / 7)} semanas`, color: '#FF9800' };
      return { text: `${Math.floor(days / 30)} meses`, color: '#4CAF50' };
    };

    return (
    <View style={styles.sectionContainer}>
        {/* Header mejorado */}
        <View style={styles.eventOrgHeader}>
          <View style={styles.eventOrgHeaderContent}>
            <View style={styles.eventOrgHeaderIcon}>
              <Icon name="people" size={28} color="#FFFFFF" />
        </View>
            <View style={styles.eventOrgHeaderText}>
              <Text style={styles.eventOrgHeaderTitle}>Organizador de Eventos</Text>
              <Text style={styles.eventOrgHeaderSubtitle}>
                Planifica y gestiona tus eventos especiales
              </Text>
            </View>
          </View>
          <View style={styles.eventOrgHeaderBadge}>
            <Text style={styles.eventOrgHeaderCount}>{sampleEvents.length}</Text>
        </View>
      </View>

        {/* Estadísticas rápidas */}
        <View style={styles.eventOrgStats}>
          <View style={styles.eventOrgStatCard}>
            <View style={styles.eventOrgStatIcon}>
              <Icon name="calendar" size={20} color="#FF9800" />
            </View>
            <View style={styles.eventOrgStatContent}>
              <Text style={styles.eventOrgStatValue}>
                {sampleEvents.filter(e => e.status === 'En Planificación').length}
              </Text>
              <Text style={styles.eventOrgStatLabel}>En Planificación</Text>
            </View>
          </View>
          <View style={styles.eventOrgStatCard}>
            <View style={styles.eventOrgStatIcon}>
              <Icon name="checkmark-circle" size={20} color="#4CAF50" />
            </View>
            <View style={styles.eventOrgStatContent}>
              <Text style={styles.eventOrgStatValue}>
                {sampleEvents.filter(e => e.status === 'Completado').length}
              </Text>
              <Text style={styles.eventOrgStatLabel}>Completados</Text>
            </View>
          </View>
          <View style={styles.eventOrgStatCard}>
            <View style={styles.eventOrgStatIcon}>
              <Icon name="people" size={20} color="#2196F3" />
            </View>
            <View style={styles.eventOrgStatContent}>
              <Text style={styles.eventOrgStatValue}>
                {sampleEvents.reduce((sum, e) => sum + (e.guests || 0), 0)}
              </Text>
              <Text style={styles.eventOrgStatLabel}>Invitados</Text>
            </View>
          </View>
        </View>

        {/* Botón de acción principal */}
        <TouchableOpacity style={styles.eventOrgAddButton} onPress={openAddEventOrgModal}>
          <Icon name="add-circle-outline" size={24} color="#FFFFFF" />
          <Text style={styles.eventOrgAddButtonText}>Crear Evento</Text>
      </TouchableOpacity>

        {/* Lista de eventos mejorada */}
        <View style={styles.eventOrgList}>
          {sampleEvents.length === 0 ? (
            <View style={styles.eventOrgEmptyState}>
              <View style={styles.eventOrgEmptyIcon}>
                <Icon name="people-outline" size={64} color="#E0E0E0" />
              </View>
              <Text style={styles.eventOrgEmptyTitle}>No hay eventos organizados</Text>
              <Text style={styles.eventOrgEmptySubtitle}>
                Crea tu primer evento para comenzar a planificar
              </Text>
          </View>
        ) : (
            sampleEvents.map((event) => {
              const daysUntil = getDaysUntilEvent(event.date);
              const urgency = getEventUrgency(daysUntil);
              
              return (
                <View key={event.id} style={styles.eventOrgCard}>
                  <View style={styles.eventOrgCardHeader}>
                    <View style={styles.eventOrgCardInfo}>
                      <View style={styles.eventOrgCardTitleRow}>
                        <View style={[
                          styles.eventOrgCategoryBadge,
                          { backgroundColor: getCategoryColor(event.category) }
                        ]}>
                          <Icon 
                            name={getCategoryIcon(event.category)} 
                            size={12} 
                            color="#FFFFFF" 
                          />
                          <Text style={styles.eventOrgCategoryText}>{event.category}</Text>
                </View>
                        <View style={[
                          styles.eventOrgStatusBadge,
                          { backgroundColor: getStatusColor(event.status) }
                        ]}>
                          <Text style={styles.eventOrgStatusText}>{event.status}</Text>
                </View>
                      </View>
                      <Text style={styles.eventOrgCardName}>{event.eventName}</Text>
                      <Text style={styles.eventOrgCardType}>{event.type}</Text>
                      <View style={styles.eventOrgCardDateRow}>
                        <Icon name="calendar-outline" size={16} color="#6B7280" />
                        <Text style={styles.eventOrgCardDate}>
                          {new Date(event.date).toLocaleDateString('es-ES')} {event.time && `• ${event.time}`}
                        </Text>
                        <View style={[
                          styles.eventOrgUrgencyBadge,
                          { backgroundColor: urgency.color }
                        ]}>
                          <Text style={styles.eventOrgUrgencyText}>{urgency.text}</Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.eventOrgCardActions}>
                      <TouchableOpacity style={styles.eventOrgEditButton}>
                        <Icon name="create-outline" size={16} color="#667eea" />
                      </TouchableOpacity>
                <TouchableOpacity 
                        style={styles.eventOrgDeleteButton}
                  onPress={() => deleteEventOrganization(event.id)}
                >
                  <Icon name="trash-outline" size={16} color="#dc3545" />
                </TouchableOpacity>
              </View>
                  </View>

                  {/* Barra de progreso */}
                  <View style={styles.eventOrgProgressContainer}>
                    <View style={styles.eventOrgProgressHeader}>
                      <Text style={styles.eventOrgProgressLabel}>Progreso del Evento</Text>
                      <Text style={styles.eventOrgProgressValue}>{event.progress}%</Text>
                    </View>
                    <View style={styles.eventOrgProgressBar}>
                      <View 
                        style={[
                          styles.eventOrgProgressFill,
                          { 
                            width: `${event.progress}%`,
                            backgroundColor: getStatusColor(event.status)
                          }
                        ]}
                      />
                    </View>
                  </View>

                  {/* Detalles del evento */}
                  <View style={styles.eventOrgCardDetails}>
                {event.location && (
                      <View style={styles.eventOrgDetailItem}>
                        <View style={styles.eventOrgDetailIcon}>
                          <Icon name="location-outline" size={16} color="#4CAF50" />
                        </View>
                        <Text style={styles.eventOrgDetailText}>{event.location}</Text>
                  </View>
                )}
                {event.guests && (
                      <View style={styles.eventOrgDetailItem}>
                        <View style={styles.eventOrgDetailIcon}>
                          <Icon name="people-outline" size={16} color="#2196F3" />
                        </View>
                        <Text style={styles.eventOrgDetailText}>{event.guests} invitados</Text>
                  </View>
                )}
                {event.budget && (
                      <View style={styles.eventOrgDetailItem}>
                        <View style={styles.eventOrgDetailIcon}>
                          <Icon name="wallet-outline" size={16} color="#FF9800" />
                        </View>
                        <Text style={styles.eventOrgDetailText}>{event.budget}</Text>
                  </View>
                )}
                {event.notes && (
                      <View style={styles.eventOrgDetailItem}>
                        <View style={styles.eventOrgDetailIcon}>
                          <Icon name="document-text-outline" size={16} color="#9C27B0" />
                        </View>
                        <Text style={styles.eventOrgDetailText}>{event.notes}</Text>
                  </View>
                )}
              </View>

                  {/* Prioridad y acciones rápidas */}
                  <View style={styles.eventOrgCardFooter}>
                    <View style={styles.eventOrgPriorityContainer}>
                      <View style={[
                        styles.eventOrgPriorityBadge,
                        { backgroundColor: getPriorityColor(event.priority) }
                      ]}>
                        <Icon name="flag" size={12} color="#FFFFFF" />
                        <Text style={styles.eventOrgPriorityText}>{event.priority}</Text>
            </View>
                    </View>
                    <View style={styles.eventOrgQuickActions}>
                      <TouchableOpacity style={styles.eventOrgQuickAction}>
                        <Icon name="share" size={16} color="#4CAF50" />
                        <Text style={styles.eventOrgQuickActionText}>Compartir</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.eventOrgQuickAction}>
                        <Icon name="copy" size={16} color="#2196F3" />
                        <Text style={styles.eventOrgQuickActionText}>Duplicar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.eventOrgQuickAction}>
                        <Icon name="analytics" size={16} color="#FF9800" />
                        <Text style={styles.eventOrgQuickActionText}>Reporte</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })
        )}
      </View>
    </View>
  );
  };

  const renderReminders = () => {
    // Datos de muestra para demostrar el nuevo diseño
    const sampleReminders = [
      {
        id: 1,
        title: 'Reunión con el equipo de desarrollo',
        date: '2024-01-15',
        time: '10:00',
        type: 'Reunión',
        description: 'Revisar el progreso del proyecto y planificar las próximas tareas',
        priority: 'Alta',
        status: 'Pendiente',
        category: 'Trabajo',
        daysUntil: 2,
        recurring: false,
        notification: '15 minutos antes'
      },
      {
        id: 2,
        title: 'Cita médica - Cardiología',
        date: '2024-01-18',
        time: '14:30',
        type: 'Salud',
        description: 'Revisión anual con el cardiólogo, llevar resultados de análisis',
        priority: 'Alta',
        status: 'Pendiente',
        category: 'Salud',
        daysUntil: 5,
        recurring: false,
        notification: '1 hora antes'
      },
      {
        id: 3,
        title: 'Pagar factura de luz',
        date: '2024-01-12',
        time: '09:00',
        type: 'Finanzas',
        description: 'Recordar pagar la factura de electricidad antes del vencimiento',
        priority: 'Media',
        status: 'Completado',
        category: 'Finanzas',
        daysUntil: -3,
        recurring: true,
        notification: '1 día antes'
      },
      {
        id: 4,
        title: 'Cumpleaños de mamá',
        date: '2024-01-20',
        time: '18:00',
        type: 'Personal',
        description: 'Celebrar el cumpleaños de mamá, comprar regalo y preparar sorpresa',
        priority: 'Alta',
        status: 'Pendiente',
        category: 'Personal',
        daysUntil: 7,
        recurring: true,
        notification: '3 días antes'
      },
      {
        id: 5,
        title: 'Entrega de proyecto final',
        date: '2024-01-25',
        time: '23:59',
        type: 'Académico',
        description: 'Entregar el proyecto final de la asignatura de Desarrollo de Software',
        priority: 'Alta',
        status: 'Pendiente',
        category: 'Educación',
        daysUntil: 12,
        recurring: false,
        notification: '1 día antes'
      }
    ];

    const getCategoryColor = (category) => {
      const colors = {
        'Trabajo': '#2196F3',
        'Salud': '#4CAF50',
        'Finanzas': '#FF9800',
        'Personal': '#E91E63',
        'Educación': '#9C27B0',
        'Otros': '#6B7280'
      };
      return colors[category] || '#6B7280';
    };

    const getCategoryIcon = (category) => {
      const icons = {
        'Trabajo': 'briefcase',
        'Salud': 'medical',
        'Finanzas': 'wallet',
        'Personal': 'heart',
        'Educación': 'school',
        'Otros': 'alarm'
      };
      return icons[category] || 'alarm';
    };

    const getPriorityColor = (priority) => {
      const colors = {
        'Alta': '#F44336',
        'Media': '#FF9800',
        'Baja': '#4CAF50'
      };
      return colors[priority] || '#6B7280';
    };

    const getStatusColor = (status) => {
      const colors = {
        'Pendiente': '#FF9800',
        'Completado': '#4CAF50',
        'Cancelado': '#F44336',
        'Vencido': '#6B7280'
      };
      return colors[status] || '#6B7280';
    };

    const getDaysUntilText = (days) => {
      if (days < 0) return { text: 'Vencido', color: '#6B7280' };
      if (days === 0) return { text: 'Hoy', color: '#F44336' };
      if (days === 1) return { text: 'Mañana', color: '#FF5722' };
      if (days <= 7) return { text: `${days} días`, color: '#FF9800' };
      if (days <= 30) return { text: `${Math.floor(days / 7)} semanas`, color: '#2196F3' };
      return { text: `${Math.floor(days / 30)} meses`, color: '#4CAF50' };
    };

    const getTypeIcon = (type) => {
      const icons = {
        'Reunión': 'people',
        'Salud': 'medical',
        'Finanzas': 'card',
        'Personal': 'heart',
        'Académico': 'book',
        'Otros': 'alarm'
      };
      return icons[type] || 'alarm';
    };

    return (
    <View style={styles.sectionContainer}>
        {/* Header mejorado */}
        <View style={styles.remindersHeader}>
          <View style={styles.remindersHeaderContent}>
            <View style={styles.remindersHeaderIcon}>
              <Icon name="alarm" size={28} color="#FFFFFF" />
        </View>
            <View style={styles.remindersHeaderText}>
              <Text style={styles.remindersHeaderTitle}>Recordatorios</Text>
              <Text style={styles.remindersHeaderSubtitle}>
                Nunca olvides lo importante
              </Text>
            </View>
          </View>
          <View style={styles.remindersHeaderBadge}>
            <Text style={styles.remindersHeaderCount}>{sampleReminders.length}</Text>
        </View>
      </View>

        {/* Estadísticas rápidas */}
        <View style={styles.remindersStats}>
          <View style={styles.remindersStatCard}>
            <View style={styles.remindersStatIcon}>
              <Icon name="time" size={20} color="#FF9800" />
            </View>
            <View style={styles.remindersStatContent}>
              <Text style={styles.remindersStatValue}>
                {sampleReminders.filter(r => r.status === 'Pendiente').length}
              </Text>
              <Text style={styles.remindersStatLabel}>Pendientes</Text>
            </View>
          </View>
          <View style={styles.remindersStatCard}>
            <View style={styles.remindersStatIcon}>
              <Icon name="checkmark-circle" size={20} color="#4CAF50" />
            </View>
            <View style={styles.remindersStatContent}>
              <Text style={styles.remindersStatValue}>
                {sampleReminders.filter(r => r.status === 'Completado').length}
              </Text>
              <Text style={styles.remindersStatLabel}>Completados</Text>
            </View>
          </View>
          <View style={styles.remindersStatCard}>
            <View style={styles.remindersStatIcon}>
              <Icon name="today" size={20} color="#F44336" />
            </View>
            <View style={styles.remindersStatContent}>
              <Text style={styles.remindersStatValue}>
                {sampleReminders.filter(r => r.daysUntil <= 1 && r.daysUntil >= 0).length}
              </Text>
              <Text style={styles.remindersStatLabel}>Próximos</Text>
            </View>
          </View>
        </View>

        {/* Botón de acción principal */}
        <TouchableOpacity style={styles.remindersAddButton} onPress={openAddReminderModal}>
          <Icon name="add-circle-outline" size={24} color="#FFFFFF" />
          <Text style={styles.remindersAddButtonText}>Crear Recordatorio</Text>
      </TouchableOpacity>

        {/* Lista de recordatorios mejorada */}
      <View style={styles.remindersList}>
          {sampleReminders.length === 0 ? (
            <View style={styles.remindersEmptyState}>
              <View style={styles.remindersEmptyIcon}>
                <Icon name="alarm-outline" size={64} color="#E0E0E0" />
              </View>
              <Text style={styles.remindersEmptyTitle}>No hay recordatorios</Text>
              <Text style={styles.remindersEmptySubtitle}>
                Crea tu primer recordatorio para comenzar
              </Text>
          </View>
        ) : (
            sampleReminders.map((reminder) => {
              const urgency = getDaysUntilText(reminder.daysUntil);
              
              return (
                <View key={reminder.id} style={styles.remindersCard}>
                  <View style={styles.remindersCardHeader}>
                    <View style={styles.remindersCardInfo}>
                      <View style={styles.remindersCardTitleRow}>
                        <View style={[
                          styles.remindersCategoryBadge,
                          { backgroundColor: getCategoryColor(reminder.category) }
                        ]}>
                          <Icon 
                            name={getCategoryIcon(reminder.category)} 
                            size={12} 
                            color="#FFFFFF" 
                          />
                          <Text style={styles.remindersCategoryText}>{reminder.category}</Text>
                </View>
                        <View style={[
                          styles.remindersStatusBadge,
                          { backgroundColor: getStatusColor(reminder.status) }
                        ]}>
                          <Text style={styles.remindersStatusText}>{reminder.status}</Text>
                </View>
                      </View>
                      <Text style={styles.remindersCardTitle}>{reminder.title}</Text>
                      <Text style={styles.remindersCardType}>{reminder.type}</Text>
                      <View style={styles.remindersCardDateRow}>
                        <Icon name="calendar-outline" size={16} color="#6B7280" />
                        <Text style={styles.remindersCardDate}>
                          {new Date(reminder.date).toLocaleDateString('es-ES')} {reminder.time && `• ${reminder.time}`}
                        </Text>
                        <View style={[
                          styles.remindersUrgencyBadge,
                          { backgroundColor: urgency.color }
                        ]}>
                          <Text style={styles.remindersUrgencyText}>{urgency.text}</Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.remindersCardActions}>
                      <TouchableOpacity style={styles.remindersEditButton}>
                        <Icon name="create-outline" size={16} color="#667eea" />
                      </TouchableOpacity>
                <TouchableOpacity 
                        style={styles.remindersDeleteButton}
                  onPress={() => deleteReminder(reminder.id)}
                >
                  <Icon name="trash-outline" size={16} color="#dc3545" />
                </TouchableOpacity>
              </View>
                  </View>

                  {/* Descripción del recordatorio */}
              {reminder.description && (
                    <View style={styles.remindersCardDescription}>
                      <View style={styles.remindersDescriptionIcon}>
                        <Icon name="document-text-outline" size={16} color="#6B7280" />
                  </View>
                      <Text style={styles.remindersDescriptionText}>{reminder.description}</Text>
                </View>
              )}

                  {/* Información adicional */}
                  <View style={styles.remindersCardDetails}>
                    <View style={styles.remindersDetailItem}>
                      <View style={styles.remindersDetailIcon}>
                        <Icon name="flag" size={16} color={getPriorityColor(reminder.priority)} />
            </View>
                      <Text style={styles.remindersDetailText}>{reminder.priority}</Text>
                    </View>
                    <View style={styles.remindersDetailItem}>
                      <View style={styles.remindersDetailIcon}>
                        <Icon name="notifications" size={16} color="#2196F3" />
                      </View>
                      <Text style={styles.remindersDetailText}>{reminder.notification}</Text>
                    </View>
                    {reminder.recurring && (
                      <View style={styles.remindersDetailItem}>
                        <View style={styles.remindersDetailIcon}>
                          <Icon name="refresh" size={16} color="#9C27B0" />
                        </View>
                        <Text style={styles.remindersDetailText}>Recurrente</Text>
                      </View>
        )}
      </View>

                  {/* Acciones rápidas */}
                  <View style={styles.remindersCardFooter}>
                    <View style={styles.remindersQuickActions}>
                      <TouchableOpacity style={styles.remindersQuickAction}>
                        <Icon name="checkmark-circle" size={16} color="#4CAF50" />
                        <Text style={styles.remindersQuickActionText}>Completar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.remindersQuickAction}>
                        <Icon name="time" size={16} color="#FF9800" />
                        <Text style={styles.remindersQuickActionText}>Posponer</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.remindersQuickAction}>
                        <Icon name="share" size={16} color="#2196F3" />
                        <Text style={styles.remindersQuickActionText}>Compartir</Text>
                      </TouchableOpacity>
                    </View>
      </View>
    </View>
  );
            })
          )}
        </View>
      </View>
    );
  };

  const renderInvitations = () => {
    // Datos de muestra para demostrar el nuevo diseño
    const sampleInvitations = [
      {
        id: 1,
        eventName: 'Boda de María y Carlos',
        guestName: 'Ana García',
        email: 'ana.garcia@email.com',
        phone: '+34 612 345 678',
        status: 'confirmed',
        responseDate: '2024-01-10',
        invitationDate: '2024-01-05',
        message: '¡Esperamos que puedas acompañarnos en este día tan especial!',
        category: 'Celebración',
        priority: 'Alta',
        plusOne: true,
        dietaryRestrictions: 'Vegetariana',
        rsvpDeadline: '2024-01-15'
      },
      {
        id: 2,
        eventName: 'Conferencia Tech 2024',
        guestName: 'Carlos López',
        email: 'carlos.lopez@empresa.com',
        phone: '+34 678 901 234',
        status: 'pending',
        responseDate: null,
        invitationDate: '2024-01-08',
        message: 'Te invitamos a participar en nuestra conferencia anual de tecnología',
        category: 'Profesional',
        priority: 'Media',
        plusOne: false,
        dietaryRestrictions: null,
        rsvpDeadline: '2024-01-20'
      },
      {
        id: 3,
        eventName: 'Cumpleaños de Ana',
        guestName: 'Roberto Silva',
        email: 'roberto.silva@email.com',
        phone: '+34 611 987 654',
        status: 'declined',
        responseDate: '2024-01-12',
        invitationDate: '2024-01-10',
        message: 'Celebra con nosotros el cumpleaños de Ana',
        category: 'Personal',
        priority: 'Baja',
        plusOne: true,
        dietaryRestrictions: null,
        rsvpDeadline: '2024-01-18'
      },
      {
        id: 4,
        eventName: 'Reunión de Equipo Q1',
        guestName: 'María Martínez',
        email: 'maria.martinez@empresa.com',
        phone: '+34 655 123 456',
        status: 'confirmed',
        responseDate: '2024-01-11',
        invitationDate: '2024-01-09',
        message: 'Reunión trimestral para revisar objetivos y planificar Q2',
        category: 'Trabajo',
        priority: 'Alta',
        plusOne: false,
        dietaryRestrictions: null,
        rsvpDeadline: '2024-01-25'
      },
      {
        id: 5,
        eventName: 'Cena de Graduación',
        guestName: 'Luis Fernández',
        email: 'luis.fernandez@universidad.edu',
        phone: '+34 644 555 666',
        status: 'pending',
        responseDate: null,
        invitationDate: '2024-01-13',
        message: 'Celebremos juntos la graduación de la promoción 2024',
        category: 'Educación',
        priority: 'Media',
        plusOne: true,
        dietaryRestrictions: 'Sin gluten',
        rsvpDeadline: '2024-01-22'
      }
    ];

    const getCategoryColor = (category) => {
      const colors = {
        'Celebración': '#E91E63',
        'Profesional': '#2196F3',
        'Personal': '#4CAF50',
        'Trabajo': '#FF9800',
        'Educación': '#9C27B0',
        'Otros': '#6B7280'
      };
      return colors[category] || '#6B7280';
    };

    const getCategoryIcon = (category) => {
      const icons = {
        'Celebración': 'gift',
        'Profesional': 'briefcase',
        'Personal': 'heart',
        'Trabajo': 'business',
        'Educación': 'school',
        'Otros': 'mail'
      };
      return icons[category] || 'mail';
    };

    const getStatusColor = (status) => {
      const colors = {
        'confirmed': '#4CAF50',
        'pending': '#FF9800',
        'declined': '#F44336'
      };
      return colors[status] || '#6B7280';
    };

    const getStatusText = (status) => {
      const texts = {
        'confirmed': 'Confirmado',
        'pending': 'Pendiente',
        'declined': 'Rechazado'
      };
      return texts[status] || 'Desconocido';
    };

    const getPriorityColor = (priority) => {
      const colors = {
        'Alta': '#F44336',
        'Media': '#FF9800',
        'Baja': '#4CAF50'
      };
      return colors[priority] || '#6B7280';
    };

    const getDaysUntilDeadline = (deadline) => {
      const today = new Date();
      const deadlineDate = new Date(deadline);
      const diffTime = deadlineDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    };

    const getUrgencyColor = (days) => {
      if (days < 0) return '#6B7280';
      if (days === 0) return '#F44336';
      if (days <= 3) return '#FF5722';
      if (days <= 7) return '#FF9800';
      return '#4CAF50';
    };

    const getUrgencyText = (days) => {
      if (days < 0) return 'Vencido';
      if (days === 0) return 'Hoy';
      if (days === 1) return 'Mañana';
      if (days <= 7) return `${days} días`;
      return `${Math.floor(days / 7)} semanas`;
    };

    return (
    <View style={styles.sectionContainer}>
        {/* Header mejorado */}
        <View style={styles.invitationsHeader}>
          <View style={styles.invitationsHeaderContent}>
            <View style={styles.invitationsHeaderIcon}>
              <Icon name="mail" size={28} color="#FFFFFF" />
        </View>
            <View style={styles.invitationsHeaderText}>
              <Text style={styles.invitationsHeaderTitle}>Invitaciones</Text>
              <Text style={styles.invitationsHeaderSubtitle}>
                Gestiona las invitaciones a tus eventos
              </Text>
            </View>
          </View>
          <View style={styles.invitationsHeaderBadge}>
            <Text style={styles.invitationsHeaderCount}>{sampleInvitations.length}</Text>
        </View>
      </View>

        {/* Estadísticas rápidas */}
        <View style={styles.invitationsStats}>
          <View style={styles.invitationsStatCard}>
            <View style={styles.invitationsStatIcon}>
              <Icon name="checkmark-circle" size={20} color="#4CAF50" />
            </View>
            <View style={styles.invitationsStatContent}>
              <Text style={styles.invitationsStatValue}>
                {sampleInvitations.filter(i => i.status === 'confirmed').length}
              </Text>
              <Text style={styles.invitationsStatLabel}>Confirmadas</Text>
            </View>
          </View>
          <View style={styles.invitationsStatCard}>
            <View style={styles.invitationsStatIcon}>
              <Icon name="time" size={20} color="#FF9800" />
            </View>
            <View style={styles.invitationsStatContent}>
              <Text style={styles.invitationsStatValue}>
                {sampleInvitations.filter(i => i.status === 'pending').length}
              </Text>
              <Text style={styles.invitationsStatLabel}>Pendientes</Text>
            </View>
          </View>
          <View style={styles.invitationsStatCard}>
            <View style={styles.invitationsStatIcon}>
              <Icon name="close-circle" size={20} color="#F44336" />
            </View>
            <View style={styles.invitationsStatContent}>
              <Text style={styles.invitationsStatValue}>
                {sampleInvitations.filter(i => i.status === 'declined').length}
              </Text>
              <Text style={styles.invitationsStatLabel}>Rechazadas</Text>
            </View>
          </View>
        </View>

        {/* Botón de acción principal */}
        <TouchableOpacity style={styles.invitationsAddButton} onPress={openAddInvitationModal}>
          <Icon name="add-circle-outline" size={24} color="#FFFFFF" />
          <Text style={styles.invitationsAddButtonText}>Enviar Invitación</Text>
      </TouchableOpacity>

        {/* Lista de invitaciones mejorada */}
      <View style={styles.invitationsList}>
          {sampleInvitations.length === 0 ? (
            <View style={styles.invitationsEmptyState}>
              <View style={styles.invitationsEmptyIcon}>
                <Icon name="mail-outline" size={64} color="#E0E0E0" />
              </View>
              <Text style={styles.invitationsEmptyTitle}>No hay invitaciones</Text>
              <Text style={styles.invitationsEmptySubtitle}>
                Envía tu primera invitación para comenzar
              </Text>
          </View>
        ) : (
            sampleInvitations.map((invitation) => {
              const daysUntilDeadline = getDaysUntilDeadline(invitation.rsvpDeadline);
              const urgency = {
                text: getUrgencyText(daysUntilDeadline),
                color: getUrgencyColor(daysUntilDeadline)
              };
              
              return (
                <View key={invitation.id} style={styles.invitationsCard}>
                  <View style={styles.invitationsCardHeader}>
                    <View style={styles.invitationsCardInfo}>
                      <View style={styles.invitationsCardTitleRow}>
                        <View style={[
                          styles.invitationsCategoryBadge,
                          { backgroundColor: getCategoryColor(invitation.category) }
                        ]}>
                          <Icon 
                            name={getCategoryIcon(invitation.category)} 
                            size={12} 
                            color="#FFFFFF" 
                          />
                          <Text style={styles.invitationsCategoryText}>{invitation.category}</Text>
                </View>
                        <View style={[
                          styles.invitationsStatusBadge,
                          { backgroundColor: getStatusColor(invitation.status) }
                        ]}>
                          <Text style={styles.invitationsStatusText}>
                            {getStatusText(invitation.status)}
                    </Text>
                  </View>
                </View>
                      <Text style={styles.invitationsCardEvent}>{invitation.eventName}</Text>
                      <Text style={styles.invitationsCardGuest}>{invitation.guestName}</Text>
                      <View style={styles.invitationsCardDateRow}>
                        <Icon name="calendar-outline" size={16} color="#6B7280" />
                        <Text style={styles.invitationsCardDate}>
                          Enviada: {new Date(invitation.invitationDate).toLocaleDateString('es-ES')}
                        </Text>
                        <View style={[
                          styles.invitationsUrgencyBadge,
                          { backgroundColor: urgency.color }
                        ]}>
                          <Text style={styles.invitationsUrgencyText}>{urgency.text}</Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.invitationsCardActions}>
                      <TouchableOpacity style={styles.invitationsEditButton}>
                        <Icon name="create-outline" size={16} color="#667eea" />
                      </TouchableOpacity>
                <TouchableOpacity 
                        style={styles.invitationsDeleteButton}
                  onPress={() => deleteInvitation(invitation.id)}
                >
                  <Icon name="trash-outline" size={16} color="#dc3545" />
                </TouchableOpacity>
              </View>
                  </View>

                  {/* Información de contacto */}
                  <View style={styles.invitationsCardContact}>
                    <View style={styles.invitationsContactItem}>
                      <View style={styles.invitationsContactIcon}>
                        <Icon name="mail-outline" size={16} color="#2196F3" />
                      </View>
                      <Text style={styles.invitationsContactText}>{invitation.email}</Text>
                    </View>
                    <View style={styles.invitationsContactItem}>
                      <View style={styles.invitationsContactIcon}>
                        <Icon name="call-outline" size={16} color="#4CAF50" />
                      </View>
                      <Text style={styles.invitationsContactText}>{invitation.phone}</Text>
                    </View>
                  </View>

                  {/* Mensaje de la invitación */}
                  {invitation.message && (
                    <View style={styles.invitationsCardMessage}>
                      <View style={styles.invitationsMessageIcon}>
                        <Icon name="document-text-outline" size={16} color="#6B7280" />
                      </View>
                      <Text style={styles.invitationsMessageText}>{invitation.message}</Text>
                    </View>
                  )}

                  {/* Información adicional */}
                  <View style={styles.invitationsCardDetails}>
                    <View style={styles.invitationsDetailItem}>
                      <View style={styles.invitationsDetailIcon}>
                        <Icon name="flag" size={16} color={getPriorityColor(invitation.priority)} />
                      </View>
                      <Text style={styles.invitationsDetailText}>{invitation.priority}</Text>
                    </View>
                    {invitation.plusOne && (
                      <View style={styles.invitationsDetailItem}>
                        <View style={styles.invitationsDetailIcon}>
                          <Icon name="people" size={16} color="#9C27B0" />
                        </View>
                        <Text style={styles.invitationsDetailText}>Acompañante</Text>
                    </View>
                  )}
                    {invitation.dietaryRestrictions && (
                      <View style={styles.invitationsDetailItem}>
                        <View style={styles.invitationsDetailIcon}>
                          <Icon name="restaurant" size={16} color="#FF9800" />
                        </View>
                        <Text style={styles.invitationsDetailText}>{invitation.dietaryRestrictions}</Text>
                    </View>
                  )}
                    <View style={styles.invitationsDetailItem}>
                      <View style={styles.invitationsDetailIcon}>
                        <Icon name="time" size={16} color="#6B7280" />
                      </View>
                      <Text style={styles.invitationsDetailText}>
                        RSVP: {new Date(invitation.rsvpDeadline).toLocaleDateString('es-ES')}
                      </Text>
                    </View>
                  </View>

                  {/* Respuesta del invitado */}
                  {invitation.responseDate && (
                    <View style={styles.invitationsCardResponse}>
                      <View style={styles.invitationsResponseHeader}>
                        <Icon name="checkmark-circle" size={16} color={getStatusColor(invitation.status)} />
                        <Text style={styles.invitationsResponseTitle}>Respuesta del invitado</Text>
                      </View>
                      <Text style={styles.invitationsResponseDate}>
                        Respondió el {new Date(invitation.responseDate).toLocaleDateString('es-ES')}
                      </Text>
                </View>
              )}

                  {/* Acciones rápidas */}
                  <View style={styles.invitationsCardFooter}>
                    <View style={styles.invitationsQuickActions}>
                      <TouchableOpacity style={styles.invitationsQuickAction}>
                        <Icon name="mail" size={16} color="#2196F3" />
                        <Text style={styles.invitationsQuickActionText}>Reenviar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.invitationsQuickAction}>
                        <Icon name="call" size={16} color="#4CAF50" />
                        <Text style={styles.invitationsQuickActionText}>Llamar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.invitationsQuickAction}>
                        <Icon name="share" size={16} color="#FF9800" />
                        <Text style={styles.invitationsQuickActionText}>Compartir</Text>
                      </TouchableOpacity>
            </View>
                  </View>
                </View>
              );
            })
        )}
      </View>
    </View>
  );
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'birthdays': 
        return renderBirthdays();
      case 'event-organization': 
        return renderEventOrganization();
      case 'reminders': 
        return renderReminders();
      case 'invitations': 
        return renderInvitations();
      default: 
        return renderBirthdays();
    }
  };

  return (
    <View style={styles.container}>
      {renderSectionTabs()}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderActiveSection()}
      </ScrollView>

      {/* Modal para agregar cumpleaños */}
      <Modal
        visible={showAddBirthdayModal}
        animationType="slide"
        transparent={true}
        onRequestClose={closeAddBirthdayModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Agregar Cumpleaños</Text>
              <TouchableOpacity onPress={closeAddBirthdayModal}>
                <Icon name="close" size={24} color="#6c757d" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nombre *</Text>
                <TextInput
                  style={styles.textInput}
                  value={newBirthday.name}
                  onChangeText={(text) => setNewBirthday({...newBirthday, name: text})}
                  placeholder="Nombre de la persona"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Fecha de Cumpleaños *</Text>
                <TextInput
                  style={styles.textInput}
                  value={newBirthday.date}
                  onChangeText={(text) => setNewBirthday({...newBirthday, date: text})}
                  placeholder="DD/MM/AAAA"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Relación</Text>
                <TextInput
                  style={styles.textInput}
                  value={newBirthday.relationship}
                  onChangeText={(text) => setNewBirthday({...newBirthday, relationship: text})}
                  placeholder="Familiar, amigo, compañero..."
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Teléfono</Text>
                <TextInput
                  style={styles.textInput}
                  value={newBirthday.phone}
                  onChangeText={(text) => setNewBirthday({...newBirthday, phone: text})}
                  placeholder="Número de teléfono"
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={styles.textInput}
                  value={newBirthday.email}
                  onChangeText={(text) => setNewBirthday({...newBirthday, email: text})}
                  placeholder="Correo electrónico"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Notas</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  value={newBirthday.notes}
                  onChangeText={(text) => setNewBirthday({...newBirthday, notes: text})}
                  placeholder="Notas adicionales..."
                  multiline
                  numberOfLines={3}
                />
              </View>
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.cancelButton} onPress={closeAddBirthdayModal}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={addBirthday}>
                <Text style={styles.saveButtonText}>Agregar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal para agregar evento */}
      <Modal
        visible={showAddEventOrgModal}
        animationType="slide"
        transparent={true}
        onRequestClose={closeAddEventOrgModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Agregar Evento</Text>
              <TouchableOpacity onPress={closeAddEventOrgModal}>
                <Icon name="close" size={24} color="#6c757d" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nombre del Evento *</Text>
                <TextInput
                  style={styles.textInput}
                  value={newEventOrg.eventName}
                  onChangeText={(text) => setNewEventOrg({...newEventOrg, eventName: text})}
                  placeholder="Nombre del evento"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Fecha *</Text>
                <TextInput
                  style={styles.textInput}
                  value={newEventOrg.date}
                  onChangeText={(text) => setNewEventOrg({...newEventOrg, date: text})}
                  placeholder="DD/MM/AAAA"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Hora</Text>
                <TextInput
                  style={styles.textInput}
                  value={newEventOrg.time}
                  onChangeText={(text) => setNewEventOrg({...newEventOrg, time: text})}
                  placeholder="HH:MM"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Ubicación</Text>
                <TextInput
                  style={styles.textInput}
                  value={newEventOrg.location}
                  onChangeText={(text) => setNewEventOrg({...newEventOrg, location: text})}
                  placeholder="Lugar del evento"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Tipo de Evento</Text>
                <TextInput
                  style={styles.textInput}
                  value={newEventOrg.type}
                  onChangeText={(text) => setNewEventOrg({...newEventOrg, type: text})}
                  placeholder="Boda, cumpleaños, reunión..."
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Número de Invitados</Text>
                <TextInput
                  style={styles.textInput}
                  value={newEventOrg.guests}
                  onChangeText={(text) => setNewEventOrg({...newEventOrg, guests: text})}
                  placeholder="Cantidad de invitados"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Presupuesto</Text>
                <TextInput
                  style={styles.textInput}
                  value={newEventOrg.budget}
                  onChangeText={(text) => setNewEventOrg({...newEventOrg, budget: text})}
                  placeholder="Presupuesto estimado"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Notas</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  value={newEventOrg.notes}
                  onChangeText={(text) => setNewEventOrg({...newEventOrg, notes: text})}
                  placeholder="Notas adicionales..."
                  multiline
                  numberOfLines={3}
                />
              </View>
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.cancelButton} onPress={closeAddEventOrgModal}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={addEventOrganization}>
                <Text style={styles.saveButtonText}>Agregar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal para agregar recordatorio */}
      <Modal
        visible={showAddReminderModal}
        animationType="slide"
        transparent={true}
        onRequestClose={closeAddReminderModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Agregar Recordatorio</Text>
              <TouchableOpacity onPress={closeAddReminderModal}>
                <Icon name="close" size={24} color="#6c757d" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Título *</Text>
                <TextInput
                  style={styles.textInput}
                  value={newReminder.title}
                  onChangeText={(text) => setNewReminder({...newReminder, title: text})}
                  placeholder="Título del recordatorio"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Fecha *</Text>
                <TextInput
                  style={styles.textInput}
                  value={newReminder.date}
                  onChangeText={(text) => setNewReminder({...newReminder, date: text})}
                  placeholder="DD/MM/AAAA"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Hora</Text>
                <TextInput
                  style={styles.textInput}
                  value={newReminder.time}
                  onChangeText={(text) => setNewReminder({...newReminder, time: text})}
                  placeholder="HH:MM"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Tipo</Text>
                <TextInput
                  style={styles.textInput}
                  value={newReminder.type}
                  onChangeText={(text) => setNewReminder({...newReminder, type: text})}
                  placeholder="Cumpleaños, reunión, evento..."
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Descripción</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  value={newReminder.description}
                  onChangeText={(text) => setNewReminder({...newReminder, description: text})}
                  placeholder="Descripción del recordatorio..."
                  multiline
                  numberOfLines={3}
                />
              </View>
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.cancelButton} onPress={closeAddReminderModal}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={addReminder}>
                <Text style={styles.saveButtonText}>Agregar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal para agregar invitación */}
      <Modal
        visible={showAddInvitationModal}
        animationType="slide"
        transparent={true}
        onRequestClose={closeAddInvitationModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Agregar Invitación</Text>
              <TouchableOpacity onPress={closeAddInvitationModal}>
                <Icon name="close" size={24} color="#6c757d" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nombre del Evento *</Text>
                <TextInput
                  style={styles.textInput}
                  value={newInvitation.eventName}
                  onChangeText={(text) => setNewInvitation({...newInvitation, eventName: text})}
                  placeholder="Nombre del evento"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nombre del Invitado *</Text>
                <TextInput
                  style={styles.textInput}
                  value={newInvitation.guestName}
                  onChangeText={(text) => setNewInvitation({...newInvitation, guestName: text})}
                  placeholder="Nombre del invitado"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={styles.textInput}
                  value={newInvitation.email}
                  onChangeText={(text) => setNewInvitation({...newInvitation, email: text})}
                  placeholder="Correo electrónico"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Teléfono</Text>
                <TextInput
                  style={styles.textInput}
                  value={newInvitation.phone}
                  onChangeText={(text) => setNewInvitation({...newInvitation, phone: text})}
                  placeholder="Número de teléfono"
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Estado</Text>
                <View style={styles.statusSelector}>
                  <TouchableOpacity 
                    style={[styles.statusOption, newInvitation.status === 'pending' && styles.statusOptionActive]}
                    onPress={() => setNewInvitation({...newInvitation, status: 'pending'})}
                  >
                    <Text style={[styles.statusOptionText, newInvitation.status === 'pending' && styles.statusOptionTextActive]}>
                      Pendiente
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.statusOption, newInvitation.status === 'confirmed' && styles.statusOptionActive]}
                    onPress={() => setNewInvitation({...newInvitation, status: 'confirmed'})}
                  >
                    <Text style={[styles.statusOptionText, newInvitation.status === 'confirmed' && styles.statusOptionTextActive]}>
                      Confirmado
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.statusOption, newInvitation.status === 'declined' && styles.statusOptionActive]}
                    onPress={() => setNewInvitation({...newInvitation, status: 'declined'})}
                  >
                    <Text style={[styles.statusOptionText, newInvitation.status === 'declined' && styles.statusOptionTextActive]}>
                      Rechazado
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Notas</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  value={newInvitation.notes}
                  onChangeText={(text) => setNewInvitation({...newInvitation, notes: text})}
                  placeholder="Notas adicionales..."
                  multiline
                  numberOfLines={3}
                />
              </View>
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.cancelButton} onPress={closeAddInvitationModal}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={addInvitation}>
                <Text style={styles.saveButtonText}>Agregar</Text>
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
  sectionContainer: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f8f9ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 2,
    borderColor: '#e3f2fd',
  },
  headerContent: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6c757d',
    lineHeight: 20,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#667eea',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#667eea',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  birthdaysList: {
    flex: 1,
  },
  eventsList: {
    flex: 1,
  },
  remindersList: {
    flex: 1,
  },
  invitationsList: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6c757d',
    marginTop: 12,
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9e9e9e',
    textAlign: 'center',
  },
  // Estilos mejorados para cumpleaños
  birthdayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#E91E63',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#E91E63',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  birthdayHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  birthdayHeaderIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  birthdayHeaderText: {
    flex: 1,
  },
  birthdayHeaderTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  birthdayHeaderSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 18,
  },
  birthdayHeaderBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  birthdayHeaderCount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  birthdayStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 12,
  },
  birthdayStatCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  birthdayStatIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  birthdayStatContent: {
    alignItems: 'center',
  },
  birthdayStatValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 2,
  },
  birthdayStatLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  birthdayAddButton: {
    backgroundColor: '#E91E63',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#E91E63',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  birthdayAddButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  birthdayEmptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  birthdayEmptyIcon: {
    marginBottom: 20,
  },
  birthdayEmptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6B7280',
    marginBottom: 8,
    textAlign: 'center',
  },
  birthdayEmptySubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
  },
  birthdayCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  birthdayCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  birthdayCardInfo: {
    flex: 1,
  },
  birthdayCardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  birthdayCardAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E91E63',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  birthdayCardAvatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  birthdayCardTitleContent: {
    flex: 1,
  },
  birthdayCardName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 2,
  },
  birthdayCardAge: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  birthdayCategoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  birthdayCategoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  birthdayCardRelationship: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  birthdayCardDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  birthdayCardDate: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 6,
  },
  birthdayCardActions: {
    flexDirection: 'row',
    gap: 8,
  },
  birthdayEditButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  birthdayDeleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  birthdayUrgencyContainer: {
    marginBottom: 16,
  },
  birthdayUrgencyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  birthdayUrgencyText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  birthdayCardDetails: {
    marginBottom: 16,
  },
  birthdayDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    marginBottom: 6,
  },
  birthdayDetailIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  birthdayDetailText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  birthdayQuickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  birthdayQuickAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  birthdayQuickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 6,
  },
  // Estilos mejorados para organizador de eventos
  eventOrgHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FF9800',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#FF9800',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  eventOrgHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  eventOrgHeaderIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  eventOrgHeaderText: {
    flex: 1,
  },
  eventOrgHeaderTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  eventOrgHeaderSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 18,
  },
  eventOrgHeaderBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventOrgHeaderCount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  eventOrgStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 12,
  },
  eventOrgStatCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eventOrgStatIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventOrgStatContent: {
    alignItems: 'center',
  },
  eventOrgStatValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 2,
  },
  eventOrgStatLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  eventOrgAddButton: {
    backgroundColor: '#FF9800',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#FF9800',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  eventOrgAddButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  eventOrgEmptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  eventOrgEmptyIcon: {
    marginBottom: 20,
  },
  eventOrgEmptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6B7280',
    marginBottom: 8,
    textAlign: 'center',
  },
  eventOrgEmptySubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
  },
  eventOrgCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  eventOrgCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  eventOrgCardInfo: {
    flex: 1,
  },
  eventOrgCardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  eventOrgCategoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  eventOrgCategoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  eventOrgStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  eventOrgStatusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  eventOrgCardName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  eventOrgCardType: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  eventOrgCardDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  eventOrgCardDate: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
    marginLeft: 6,
  },
  eventOrgUrgencyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  eventOrgUrgencyText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  eventOrgCardActions: {
    flexDirection: 'row',
    gap: 8,
  },
  eventOrgEditButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventOrgDeleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventOrgProgressContainer: {
    marginBottom: 16,
  },
  eventOrgProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventOrgProgressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  eventOrgProgressValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6B7280',
  },
  eventOrgProgressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  eventOrgProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  eventOrgCardDetails: {
    marginBottom: 16,
  },
  eventOrgDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    marginBottom: 6,
  },
  eventOrgDetailIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  eventOrgDetailText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  eventOrgCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventOrgPriorityContainer: {
    flex: 1,
  },
  eventOrgPriorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  eventOrgPriorityText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  eventOrgQuickActions: {
    flexDirection: 'row',
    gap: 8,
  },
  eventOrgQuickAction: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  eventOrgQuickActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 4,
  },
  eventCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  // Estilos mejorados para recordatorios
  remindersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#9C27B0',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#9C27B0',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  remindersHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  remindersHeaderIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  remindersHeaderText: {
    flex: 1,
  },
  remindersHeaderTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  remindersHeaderSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 18,
  },
  remindersHeaderBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  remindersHeaderCount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  remindersStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 12,
  },
  remindersStatCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  remindersStatIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  remindersStatContent: {
    alignItems: 'center',
  },
  remindersStatValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 2,
  },
  remindersStatLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  remindersAddButton: {
    backgroundColor: '#9C27B0',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#9C27B0',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  remindersAddButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  remindersEmptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  remindersEmptyIcon: {
    marginBottom: 20,
  },
  remindersEmptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6B7280',
    marginBottom: 8,
    textAlign: 'center',
  },
  remindersEmptySubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
  },
  remindersCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  remindersCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  remindersCardInfo: {
    flex: 1,
  },
  remindersCardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  remindersCategoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  remindersCategoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  remindersStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  remindersStatusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  remindersCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  remindersCardType: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  remindersCardDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  remindersCardDate: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
    marginLeft: 6,
  },
  remindersUrgencyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  remindersUrgencyText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  remindersCardActions: {
    flexDirection: 'row',
    gap: 8,
  },
  remindersEditButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  remindersDeleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  remindersCardDescription: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  remindersDescriptionIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  remindersDescriptionText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  remindersCardDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  remindersDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  remindersDetailIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  remindersDetailText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
  remindersCardFooter: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 16,
  },
  remindersQuickActions: {
    flexDirection: 'row',
    gap: 8,
  },
  remindersQuickAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  remindersQuickActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 4,
  },
  reminderCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  // Estilos mejorados para invitaciones
  invitationsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2196F3',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#2196F3',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  invitationsHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  invitationsHeaderIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  invitationsHeaderText: {
    flex: 1,
  },
  invitationsHeaderTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  invitationsHeaderSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 18,
  },
  invitationsHeaderBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  invitationsHeaderCount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  invitationsStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 12,
  },
  invitationsStatCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  invitationsStatIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  invitationsStatContent: {
    alignItems: 'center',
  },
  invitationsStatValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 2,
  },
  invitationsStatLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  invitationsAddButton: {
    backgroundColor: '#2196F3',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#2196F3',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  invitationsAddButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  invitationsEmptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  invitationsEmptyIcon: {
    marginBottom: 20,
  },
  invitationsEmptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6B7280',
    marginBottom: 8,
    textAlign: 'center',
  },
  invitationsEmptySubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
  },
  invitationsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  invitationsCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  invitationsCardInfo: {
    flex: 1,
  },
  invitationsCardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  invitationsCategoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  invitationsCategoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  invitationsStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  invitationsStatusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  invitationsCardEvent: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  invitationsCardGuest: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 8,
  },
  invitationsCardDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  invitationsCardDate: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
    marginLeft: 6,
  },
  invitationsUrgencyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  invitationsUrgencyText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  invitationsCardActions: {
    flexDirection: 'row',
    gap: 8,
  },
  invitationsEditButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  invitationsDeleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  invitationsCardContact: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  invitationsContactItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  invitationsContactIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  invitationsContactText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  invitationsCardMessage: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F0F9FF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  invitationsMessageIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  invitationsMessageText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  invitationsCardDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  invitationsDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  invitationsDetailIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  invitationsDetailText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
  invitationsCardResponse: {
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  invitationsResponseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  invitationsResponseTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 8,
  },
  invitationsResponseDate: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 24,
  },
  invitationsCardFooter: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 16,
  },
  invitationsQuickActions: {
    flexDirection: 'row',
    gap: 8,
  },
  invitationsQuickAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  invitationsQuickActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 4,
  },
  invitationCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  birthdayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  reminderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  invitationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  birthdayIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fce4ec',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  eventIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff3e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  reminderIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3e5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  invitationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  birthdayInfo: {
    flex: 1,
  },
  eventInfo: {
    flex: 1,
  },
  reminderInfo: {
    flex: 1,
  },
  invitationInfo: {
    flex: 1,
  },
  birthdayName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 2,
  },
  eventName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 2,
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 2,
  },
  invitationEvent: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 2,
  },
  invitationGuest: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: '500',
    marginBottom: 4,
  },
  birthdayDate: {
    fontSize: 14,
    color: '#E91E63',
    fontWeight: '500',
    marginBottom: 2,
  },
  eventDate: {
    fontSize: 14,
    color: '#FF9800',
    fontWeight: '500',
    marginBottom: 2,
  },
  reminderDate: {
    fontSize: 14,
    color: '#9C27B0',
    fontWeight: '500',
    marginBottom: 2,
  },
  birthdayRelationship: {
    fontSize: 12,
    color: '#6c757d',
  },
  eventType: {
    fontSize: 12,
    color: '#6c757d',
  },
  reminderType: {
    fontSize: 12,
    color: '#6c757d',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ffebee',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ffcdd2',
  },
  birthdayDetails: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f3f4',
  },
  eventDetails: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f3f4',
  },
  reminderDetails: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f3f4',
  },
  invitationDetails: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f3f4',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 13,
    color: '#6c757d',
    marginLeft: 8,
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    width: '90%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
  },
  modalBody: {
    padding: 20,
    maxHeight: 400,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f1f3f4',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
    marginRight: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6c757d',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#667eea',
    marginLeft: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  statusSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusOption: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
    marginHorizontal: 4,
    alignItems: 'center',
  },
  statusOptionActive: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
  },
  statusOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6c757d',
  },
  statusOptionTextActive: {
    color: '#FFFFFF',
  },
});

export default EventsSections;
