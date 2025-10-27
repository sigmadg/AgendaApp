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
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { personalStyles } from '../styles/personalStyles';

const EventsSection = ({
  selectedDate,
  onDateSelect,
  events,
  getAllEventsForDate,
  onAddEvent,
  onEditEvent,
  onDeleteEvent,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    time: '',
    description: '',
  });

  const handleAddEvent = () => {
    if (newEvent.title && newEvent.time) {
      onAddEvent({
        ...newEvent,
        date: selectedDate,
        id: Date.now().toString(),
      });
      setNewEvent({ title: '', time: '', description: '' });
      setShowAddModal(false);
    } else {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios');
    }
  };

  const closeModal = () => {
    setShowAddModal(false);
    setNewEvent({ title: '', time: '', description: '' });
  };

  const dayEvents = getAllEventsForDate(selectedDate);

  return (
    <View style={personalStyles.section}>
      <View style={personalStyles.sectionHeader}>
        <View style={personalStyles.headerDecoration}>
          <Icon name="calendar" size={20} color="#4A7C59" />
        </View>
        <View style={personalStyles.headerContent}>
          <Text style={personalStyles.sectionTitle}>Eventos del Día</Text>
          <Text style={personalStyles.sectionSubtitle}>
            {selectedDate.toLocaleDateString('es-ES', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </Text>
        </View>
        <TouchableOpacity
          style={personalStyles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Icon name="add" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {dayEvents.length === 0 ? (
        <View style={personalStyles.emptyState}>
          <Icon name="calendar-outline" size={48} color="#4A6741" />
          <Text style={personalStyles.emptyStateTitle}>No hay eventos</Text>
          <Text style={personalStyles.emptyStateSubtitle}>
            Agrega un evento para este día
          </Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {dayEvents.map((event) => (
            <View key={event.id} style={personalStyles.eventCard}>
              <View style={personalStyles.eventHeader}>
                <Text style={personalStyles.eventTitle}>{event.title}</Text>
                <View style={personalStyles.eventActions}>
                  <TouchableOpacity
                    onPress={() => onEditEvent(event)}
                    style={personalStyles.actionButton}
                  >
                    <Icon name="create-outline" size={16} color="#4A7C59" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => onDeleteEvent(event.id)}
                    style={personalStyles.actionButton}
                  >
                    <Icon name="trash-outline" size={16} color="#E53E3E" />
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={personalStyles.eventTime}>
                <Icon name="time-outline" size={14} color="#4A6741" /> {event.time}
              </Text>
              {event.description && (
                <Text style={personalStyles.eventDescription}>
                  {event.description}
                </Text>
              )}
            </View>
          ))}
        </ScrollView>
      )}

      <Modal
        visible={showAddModal}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={personalStyles.modalOverlay}>
          <View style={personalStyles.modalContainer}>
            <View style={personalStyles.modalHeader}>
              <Text style={personalStyles.modalTitle}>Nuevo Evento</Text>
              <TouchableOpacity onPress={closeModal}>
                <Icon name="close" size={24} color="#4A6741" />
              </TouchableOpacity>
            </View>
            <View style={personalStyles.modalContent}>
              <TextInput
                style={personalStyles.input}
                placeholder="Título del evento"
                value={newEvent.title}
                onChangeText={(text) => setNewEvent({ ...newEvent, title: text })}
              />
              <TextInput
                style={personalStyles.input}
                placeholder="Hora (ej: 14:30)"
                value={newEvent.time}
                onChangeText={(text) => setNewEvent({ ...newEvent, time: text })}
              />
              <TextInput
                style={[personalStyles.input, { height: 80, textAlignVertical: 'top' }]}
                placeholder="Descripción (opcional)"
                value={newEvent.description}
                onChangeText={(text) => setNewEvent({ ...newEvent, description: text })}
                multiline
              />
            </View>
            <View style={personalStyles.modalActions}>
              <TouchableOpacity
                style={[personalStyles.modalButton, personalStyles.cancelButton]}
                onPress={closeModal}
              >
                <Text style={personalStyles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[personalStyles.modalButton, personalStyles.saveButton]}
                onPress={handleAddEvent}
              >
                <Text style={personalStyles.saveButtonText}>Agregar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default EventsSection;
