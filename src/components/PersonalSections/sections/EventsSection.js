import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { SectionHeader, Button, Card } from '../../shared';
import { useTheme } from '../../shared/hooks/useTheme';
import { eventsSectionStyles } from '../styles/eventsSectionStyles';

const EventsSection = ({ 
  selectedDate, 
  onDateSelect, 
  events, 
  getAllEventsForDate,
  onAddEvent, 
  onEditEvent, 
  onDeleteEvent,
  user,
  theme 
}) => {
  const { getThemeColors } = useTheme();
  const themeColors = getThemeColors();

  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [newEventData, setNewEventData] = useState({
    title: '',
    description: '',
    date: selectedDate,
    time: '',
    type: 'personal',
    location: '',
  });

  const handleAddEvent = () => {
    if (newEventData.title.trim() === '') {
      Alert.alert('Error', 'Por favor ingresa un título para el evento');
      return;
    }

    const event = {
      id: Date.now().toString(),
      title: newEventData.title.trim(),
      description: newEventData.description.trim(),
      date: newEventData.date,
      time: newEventData.time,
      type: newEventData.type,
      location: newEventData.location.trim(),
      userId: user?.id,
      createdAt: new Date().toISOString(),
    };

    onAddEvent(event);
    setNewEventData({
      title: '',
      description: '',
      date: selectedDate,
      time: '',
      type: 'personal',
      location: '',
    });
    setShowAddEventModal(false);
  };

  const handleEditEvent = (eventId) => {
    const event = events.find(e => e.id === eventId);
    if (event) {
      setNewEventData({
        title: event.title,
        description: event.description || '',
        date: event.date,
        time: event.time || '',
        type: event.type || 'personal',
        location: event.location || '',
      });
      setShowAddEventModal(true);
    }
  };

  const handleDeleteEvent = (eventId) => {
    Alert.alert(
      'Eliminar Evento',
      '¿Estás seguro de que quieres eliminar este evento?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => onDeleteEvent(eventId),
        }
      ]
    );
  };

  const getEventColor = (eventType) => {
    const colors = {
      personal: themeColors.primary,
      work: '#FF6B6B',
      health: '#4ECDC4',
      finance: '#45B7D1',
      education: '#96CEB4',
      social: '#FFEAA7',
      travel: '#DDA0DD',
    };
    return colors[eventType] || themeColors.primary;
  };

  const getEventIcon = (eventType) => {
    const icons = {
      personal: 'person-outline',
      work: 'briefcase-outline',
      health: 'medical-outline',
      finance: 'card-outline',
      education: 'school-outline',
      social: 'people-outline',
      travel: 'airplane-outline',
    };
    return icons[eventType] || 'calendar-outline';
  };

  // Obtener eventos del día seleccionado
  const todayEvents = getAllEventsForDate ? getAllEventsForDate(selectedDate) || [] : [];
  const upcomingEvents = todayEvents.filter(event => event.date > selectedDate).slice(0, 5);

  return (
    <View style={eventsSectionStyles.container}>
      <SectionHeader
        title="Eventos Personales"
        subtitle="Gestiona tus eventos y actividades"
        image={require('../../../../android/app/src/main/assets/mascota.png')}
        onAddPress={() => setShowAddEventModal(true)}
        theme={theme}
        size="medium"
      />

      {/* Resumen de eventos */}
      <View style={eventsSectionStyles.summaryContainer}>
        <View style={[eventsSectionStyles.summaryCard, eventsSectionStyles.todayCard]}>
          <View style={[eventsSectionStyles.cardIconContainer, { backgroundColor: 'rgba(26, 61, 10, 0.15)' }]}>
            <Icon name="today-outline" size={20} color="#1A3D0A" />
          </View>
          <Text style={[eventsSectionStyles.cardTitle, { color: '#1A3D0A' }]}>Hoy</Text>
          <Text style={[eventsSectionStyles.cardNumber, { color: '#1A3D0A' }]}>{todayEvents.length}</Text>
          <Text style={[eventsSectionStyles.cardSubtitle, { color: '#1A3D0A' }]}>eventos</Text>
        </View>
        
        <View style={[eventsSectionStyles.summaryCard, eventsSectionStyles.upcomingCard]}>
          <View style={[eventsSectionStyles.cardIconContainer, { backgroundColor: 'rgba(15, 26, 74, 0.15)' }]}>
            <Icon name="time-outline" size={20} color="#0F1A4A" />
          </View>
          <Text style={[eventsSectionStyles.cardTitle, { color: '#0F1A4A' }]}>Próximos</Text>
          <Text style={[eventsSectionStyles.cardNumber, { color: '#0F1A4A' }]}>{upcomingEvents.length}</Text>
          <Text style={[eventsSectionStyles.cardSubtitle, { color: '#0F1A4A' }]}>eventos</Text>
        </View>
        
        <View style={[eventsSectionStyles.summaryCard, eventsSectionStyles.totalCard]}>
          <View style={[eventsSectionStyles.cardIconContainer, { backgroundColor: 'rgba(93, 46, 10, 0.15)' }]}>
            <Icon name="calendar-outline" size={20} color="#5D2E0A" />
          </View>
          <Text style={[eventsSectionStyles.cardTitle, { color: '#5D2E0A' }]}>Total</Text>
          <Text style={[eventsSectionStyles.cardNumber, { color: '#5D2E0A' }]}>{todayEvents.length}</Text>
          <Text style={[eventsSectionStyles.cardSubtitle, { color: '#5D2E0A' }]}>eventos</Text>
        </View>
      </View>

      {/* Eventos de hoy */}
      {todayEvents.length > 0 && (
        <View style={eventsSectionStyles.sectionContainer}>
          <Text style={[eventsSectionStyles.sectionTitle, { color: themeColors.text }]}>
            Eventos de Hoy
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={eventsSectionStyles.eventsList}>
              {todayEvents.map((event) => (
                <Card
                  key={event.id}
                  title={event.title}
                  subtitle={event.time || 'Sin hora'}
                  icon={getEventIcon(event.type)}
                  theme={theme}
                  size="small"
                  style={[
                    eventsSectionStyles.eventCard,
                    { borderLeftColor: getEventColor(event.type) }
                  ]}
                  onPress={() => handleEditEvent(event.id)}
                />
              ))}
            </View>
          </ScrollView>
        </View>
      )}

      {/* Próximos eventos */}
      {upcomingEvents.length > 0 && (
        <View style={eventsSectionStyles.sectionContainer}>
          <Text style={[eventsSectionStyles.sectionTitle, { color: themeColors.text }]}>
            Próximos Eventos
          </Text>
          <View style={eventsSectionStyles.eventsList}>
            {upcomingEvents.map((event) => (
              <Card
                key={event.id}
                title={event.title}
                subtitle={`${event.date} ${event.time ? `- ${event.time}` : ''}`}
                icon={getEventIcon(event.type)}
                theme={theme}
                size="medium"
                style={[
                  eventsSectionStyles.eventCard,
                  { borderLeftColor: getEventColor(event.type) }
                ]}
                onPress={() => handleEditEvent(event.id)}
              />
            ))}
          </View>
        </View>
      )}

      {/* Sin eventos */}
      {todayEvents.length === 0 && (
        <Card
          title="No hay eventos"
          subtitle="Agrega tu primer evento personal"
          icon="add-circle-outline"
          theme={theme}
          size="medium"
        >
          <Button
            title="Agregar Evento"
            onPress={() => setShowAddEventModal(true)}
            variant="primary"
            size="medium"
            theme={theme}
            icon="add"
          />
        </Card>
      )}

      {/* Modal para agregar/editar evento */}
      <Modal
        visible={showAddEventModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddEventModal(false)}
      >
        <View style={eventsSectionStyles.modalOverlay}>
          <View style={eventsSectionStyles.modalContainer}>
            <View style={eventsSectionStyles.modalHeader}>
              <Text style={eventsSectionStyles.modalTitle}>
                Nuevo Evento Personal
              </Text>
              <TouchableOpacity
                onPress={() => setShowAddEventModal(false)}
                style={eventsSectionStyles.closeButton}
              >
                <Icon name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={eventsSectionStyles.modalContent}>
              <View style={eventsSectionStyles.inputGroup}>
                <Text style={eventsSectionStyles.inputLabel}>Título</Text>
                <TextInput
                  style={eventsSectionStyles.textInput}
                  value={newEventData.title}
                  onChangeText={(text) => setNewEventData(prev => ({ ...prev, title: text }))}
                  placeholder="Ingresa el título del evento"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={eventsSectionStyles.inputGroup}>
                <Text style={eventsSectionStyles.inputLabel}>Descripción</Text>
                <TextInput
                  style={[eventsSectionStyles.textInput, eventsSectionStyles.textArea]}
                  value={newEventData.description}
                  onChangeText={(text) => setNewEventData(prev => ({ ...prev, description: text }))}
                  placeholder="Agrega una descripción"
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={3}
                />
              </View>

              <View style={eventsSectionStyles.inputGroup}>
                <Text style={eventsSectionStyles.inputLabel}>Fecha</Text>
                <TextInput
                  style={eventsSectionStyles.textInput}
                  value={newEventData.date}
                  onChangeText={(text) => setNewEventData(prev => ({ ...prev, date: text }))}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={eventsSectionStyles.inputGroup}>
                <Text style={eventsSectionStyles.inputLabel}>Hora</Text>
                <TextInput
                  style={eventsSectionStyles.textInput}
                  value={newEventData.time}
                  onChangeText={(text) => setNewEventData(prev => ({ ...prev, time: text }))}
                  placeholder="HH:MM"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={eventsSectionStyles.inputGroup}>
                <Text style={eventsSectionStyles.inputLabel}>Tipo</Text>
                <View style={eventsSectionStyles.typeContainer}>
                  {['personal', 'work', 'health', 'finance', 'education', 'social', 'travel'].map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        eventsSectionStyles.typeButton,
                        newEventData.type === type && eventsSectionStyles.typeButtonSelected
                      ]}
                      onPress={() => setNewEventData(prev => ({ ...prev, type }))}
                    >
                      <Text style={[
                        eventsSectionStyles.typeButtonText,
                        newEventData.type === type && eventsSectionStyles.typeButtonTextSelected
                      ]}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={eventsSectionStyles.inputGroup}>
                <Text style={eventsSectionStyles.inputLabel}>Ubicación</Text>
                <TextInput
                  style={eventsSectionStyles.textInput}
                  value={newEventData.location}
                  onChangeText={(text) => setNewEventData(prev => ({ ...prev, location: text }))}
                  placeholder="Agrega una ubicación"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </ScrollView>

            <View style={eventsSectionStyles.modalActions}>
              <Button
                title="Cancelar"
                onPress={() => setShowAddEventModal(false)}
                variant="outline"
                size="medium"
                theme={theme}
                style={eventsSectionStyles.modalButton}
              />
              <Button
                title="Agregar"
                onPress={handleAddEvent}
                variant="primary"
                size="medium"
                theme={theme}
                style={eventsSectionStyles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default EventsSection;
