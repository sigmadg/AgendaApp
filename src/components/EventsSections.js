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

  const renderBirthdays = () => (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <View style={styles.headerIcon}>
          <Icon name="gift" size={24} color="#E91E63" />
        </View>
        <View style={styles.headerContent}>
          <Text style={styles.sectionTitle}>Cumpleaños</Text>
          <Text style={styles.sectionSubtitle}>Registra y recuerda los cumpleaños importantes</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.addButton} onPress={openAddBirthdayModal}>
        <Icon name="add" size={20} color="#FFFFFF" />
        <Text style={styles.addButtonText}>Agregar Cumpleaños</Text>
      </TouchableOpacity>

      <View style={styles.birthdaysList}>
        {birthdays.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="gift-outline" size={48} color="#E0E0E0" />
            <Text style={styles.emptyStateText}>No hay cumpleaños registrados</Text>
            <Text style={styles.emptyStateSubtext}>Agrega el primer cumpleaños para comenzar</Text>
          </View>
        ) : (
          birthdays.map((birthday) => (
            <View key={birthday.id} style={styles.birthdayCard}>
              <View style={styles.birthdayHeader}>
                <View style={styles.birthdayIcon}>
                  <Icon name="person" size={20} color="#E91E63" />
                </View>
                <View style={styles.birthdayInfo}>
                  <Text style={styles.birthdayName}>{birthday.name}</Text>
                  <Text style={styles.birthdayDate}>{birthday.date}</Text>
                  {birthday.relationship && (
                    <Text style={styles.birthdayRelationship}>{birthday.relationship}</Text>
                  )}
                </View>
                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={() => deleteBirthday(birthday.id)}
                >
                  <Icon name="trash-outline" size={16} color="#dc3545" />
                </TouchableOpacity>
              </View>
              {(birthday.phone || birthday.email || birthday.notes) && (
                <View style={styles.birthdayDetails}>
                  {birthday.phone && (
                    <View style={styles.detailRow}>
                      <Icon name="call-outline" size={14} color="#6c757d" />
                      <Text style={styles.detailText}>{birthday.phone}</Text>
                    </View>
                  )}
                  {birthday.email && (
                    <View style={styles.detailRow}>
                      <Icon name="mail-outline" size={14} color="#6c757d" />
                      <Text style={styles.detailText}>{birthday.email}</Text>
                    </View>
                  )}
                  {birthday.notes && (
                    <View style={styles.detailRow}>
                      <Icon name="document-text-outline" size={14} color="#6c757d" />
                      <Text style={styles.detailText}>{birthday.notes}</Text>
                    </View>
                  )}
                </View>
              )}
            </View>
          ))
        )}
      </View>
    </View>
  );

  const renderEventOrganization = () => (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <View style={styles.headerIcon}>
          <Icon name="people" size={24} color="#FF9800" />
        </View>
        <View style={styles.headerContent}>
          <Text style={styles.sectionTitle}>Organización de Eventos</Text>
          <Text style={styles.sectionSubtitle}>Planifica y organiza tus eventos especiales</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.addButton} onPress={openAddEventOrgModal}>
        <Icon name="add" size={20} color="#FFFFFF" />
        <Text style={styles.addButtonText}>Agregar Evento</Text>
      </TouchableOpacity>

      <View style={styles.eventsList}>
        {eventOrganizations.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="people-outline" size={48} color="#E0E0E0" />
            <Text style={styles.emptyStateText}>No hay eventos organizados</Text>
            <Text style={styles.emptyStateSubtext}>Agrega el primer evento para comenzar</Text>
          </View>
        ) : (
          eventOrganizations.map((event) => (
            <View key={event.id} style={styles.eventCard}>
              <View style={styles.eventHeader}>
                <View style={styles.eventIcon}>
                  <Icon name="calendar" size={20} color="#FF9800" />
                </View>
                <View style={styles.eventInfo}>
                  <Text style={styles.eventName}>{event.eventName}</Text>
                  <Text style={styles.eventDate}>{event.date} {event.time && `- ${event.time}`}</Text>
                  {event.type && (
                    <Text style={styles.eventType}>{event.type}</Text>
                  )}
                </View>
                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={() => deleteEventOrganization(event.id)}
                >
                  <Icon name="trash-outline" size={16} color="#dc3545" />
                </TouchableOpacity>
              </View>
              <View style={styles.eventDetails}>
                {event.location && (
                  <View style={styles.detailRow}>
                    <Icon name="location-outline" size={14} color="#6c757d" />
                    <Text style={styles.detailText}>{event.location}</Text>
                  </View>
                )}
                {event.guests && (
                  <View style={styles.detailRow}>
                    <Icon name="people-outline" size={14} color="#6c757d" />
                    <Text style={styles.detailText}>{event.guests} invitados</Text>
                  </View>
                )}
                {event.budget && (
                  <View style={styles.detailRow}>
                    <Icon name="cash-outline" size={14} color="#6c757d" />
                    <Text style={styles.detailText}>Presupuesto: {event.budget}</Text>
                  </View>
                )}
                {event.notes && (
                  <View style={styles.detailRow}>
                    <Icon name="document-text-outline" size={14} color="#6c757d" />
                    <Text style={styles.detailText}>{event.notes}</Text>
                  </View>
                )}
              </View>
            </View>
          ))
        )}
      </View>
    </View>
  );

  const renderReminders = () => (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <View style={styles.headerIcon}>
          <Icon name="alarm" size={24} color="#9C27B0" />
        </View>
        <View style={styles.headerContent}>
          <Text style={styles.sectionTitle}>Recordatorios</Text>
          <Text style={styles.sectionSubtitle}>No olvides ningún evento importante</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.addButton} onPress={openAddReminderModal}>
        <Icon name="add" size={20} color="#FFFFFF" />
        <Text style={styles.addButtonText}>Agregar Recordatorio</Text>
      </TouchableOpacity>

      <View style={styles.remindersList}>
        {reminders.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="alarm-outline" size={48} color="#E0E0E0" />
            <Text style={styles.emptyStateText}>No hay recordatorios</Text>
            <Text style={styles.emptyStateSubtext}>Agrega el primer recordatorio para comenzar</Text>
          </View>
        ) : (
          reminders.map((reminder) => (
            <View key={reminder.id} style={styles.reminderCard}>
              <View style={styles.reminderHeader}>
                <View style={styles.reminderIcon}>
                  <Icon name="alarm" size={20} color="#9C27B0" />
                </View>
                <View style={styles.reminderInfo}>
                  <Text style={styles.reminderTitle}>{reminder.title}</Text>
                  <Text style={styles.reminderDate}>{reminder.date} {reminder.time && `- ${reminder.time}`}</Text>
                  {reminder.type && (
                    <Text style={styles.reminderType}>{reminder.type}</Text>
                  )}
                </View>
                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={() => deleteReminder(reminder.id)}
                >
                  <Icon name="trash-outline" size={16} color="#dc3545" />
                </TouchableOpacity>
              </View>
              {reminder.description && (
                <View style={styles.reminderDetails}>
                  <View style={styles.detailRow}>
                    <Icon name="document-text-outline" size={14} color="#6c757d" />
                    <Text style={styles.detailText}>{reminder.description}</Text>
                  </View>
                </View>
              )}
            </View>
          ))
        )}
      </View>
    </View>
  );

  const renderInvitations = () => (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <View style={styles.headerIcon}>
          <Icon name="mail" size={24} color="#2196F3" />
        </View>
        <View style={styles.headerContent}>
          <Text style={styles.sectionTitle}>Invitaciones</Text>
          <Text style={styles.sectionSubtitle}>Gestiona las invitaciones a tus eventos</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.addButton} onPress={openAddInvitationModal}>
        <Icon name="add" size={20} color="#FFFFFF" />
        <Text style={styles.addButtonText}>Agregar Invitación</Text>
      </TouchableOpacity>

      <View style={styles.invitationsList}>
        {invitations.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="mail-outline" size={48} color="#E0E0E0" />
            <Text style={styles.emptyStateText}>No hay invitaciones</Text>
            <Text style={styles.emptyStateSubtext}>Agrega la primera invitación para comenzar</Text>
          </View>
        ) : (
          invitations.map((invitation) => (
            <View key={invitation.id} style={styles.invitationCard}>
              <View style={styles.invitationHeader}>
                <View style={styles.invitationIcon}>
                  <Icon name="person" size={20} color="#2196F3" />
                </View>
                <View style={styles.invitationInfo}>
                  <Text style={styles.invitationEvent}>{invitation.eventName}</Text>
                  <Text style={styles.invitationGuest}>{invitation.guestName}</Text>
                  <View style={[styles.statusBadge, { 
                    backgroundColor: invitation.status === 'confirmed' ? '#E8F5E8' : 
                                   invitation.status === 'declined' ? '#FFEBEE' : '#FFF3E0'
                  }]}>
                    <Text style={[styles.statusText, {
                      color: invitation.status === 'confirmed' ? '#28a745' : 
                             invitation.status === 'declined' ? '#dc3545' : '#ff9800'
                    }]}>
                      {invitation.status === 'confirmed' ? 'Confirmado' : 
                       invitation.status === 'declined' ? 'Rechazado' : 'Pendiente'}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={() => deleteInvitation(invitation.id)}
                >
                  <Icon name="trash-outline" size={16} color="#dc3545" />
                </TouchableOpacity>
              </View>
              {(invitation.email || invitation.phone || invitation.notes) && (
                <View style={styles.invitationDetails}>
                  {invitation.email && (
                    <View style={styles.detailRow}>
                      <Icon name="mail-outline" size={14} color="#6c757d" />
                      <Text style={styles.detailText}>{invitation.email}</Text>
                    </View>
                  )}
                  {invitation.phone && (
                    <View style={styles.detailRow}>
                      <Icon name="call-outline" size={14} color="#6c757d" />
                      <Text style={styles.detailText}>{invitation.phone}</Text>
                    </View>
                  )}
                  {invitation.notes && (
                    <View style={styles.detailRow}>
                      <Icon name="document-text-outline" size={14} color="#6c757d" />
                      <Text style={styles.detailText}>{invitation.notes}</Text>
                    </View>
                  )}
                </View>
              )}
            </View>
          ))
        )}
      </View>
    </View>
  );

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
  birthdayCard: {
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
