import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const EVENT_TYPES = [
  { key: 'meeting', label: 'Reunión', color: '#FF6B6B' },
  { key: 'appointment', label: 'Cita', color: '#4ECDC4' },
  { key: 'reminder', label: 'Recordatorio', color: '#45B7D1' },
  { key: 'personal', label: 'Personal', color: '#96CEB4' },
  { key: 'work', label: 'Trabajo', color: '#FFEAA7' },
  { key: 'other', label: 'Otro', color: '#A29BFE' },
];

const AddEventModal = ({ visible, onClose, onAddEvent, selectedDate, selectedCategory = 'personal' }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [selectedType, setSelectedType] = useState('meeting');

  const handleAddEvent = () => {
    if (title.trim().length === 0) {
      Alert.alert('Error', 'Por favor ingresa un título para el evento');
      return;
    }

    if (startTime.trim().length === 0) {
      Alert.alert('Error', 'Por favor ingresa una hora de inicio');
      return;
    }

    const event = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      startTime: `${selectedDate}T${startTime}:00`,
      endTime: endTime ? `${selectedDate}T${endTime}:00` : null,
      type: selectedType,
      category: selectedCategory,
      date: selectedDate,
      createdAt: new Date().toISOString(),
    };

    onAddEvent(event);
    handleClose();
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setStartTime('');
    setEndTime('');
    setSelectedType('meeting');
    onClose();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryName = (category) => {
    const categoryNames = {
      personal: 'Mi Perfil',
      work: 'Trabajo',
      school: 'Escuela',
      nutrition: 'Alimentación',
      exercise: 'Ejercicio',
      languages: 'Idiomas',
      menstrual: 'Calendario Menstrual'
    };
    return categoryNames[category] || 'Personal';
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.header}>
              <Text style={styles.title}>Nuevo Evento</Text>
              <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                <Icon name="close" size={24} color="#6c757d" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
              <View style={styles.dateInfo}>
                <Icon name="calendar-outline" size={16} color="#007AFF" />
                <Text style={styles.dateText}>
                  {formatDate(selectedDate)}
                </Text>
              </View>

              <View style={styles.categoryInfo}>
                <Icon name="folder-outline" size={16} color="#6c757d" />
                <Text style={styles.categoryText}>
                  Categoría: {getCategoryName(selectedCategory)}
                </Text>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Título del evento *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Ej: Reunión de equipo"
                  placeholderTextColor="#adb5bd"
                  value={title}
                  onChangeText={setTitle}
                  maxLength={100}
                />
                <Text style={styles.characterCount}>
                  {title.length}/100
                </Text>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Descripción (opcional)</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  placeholder="Detalles del evento..."
                  placeholderTextColor="#adb5bd"
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  maxLength={300}
                />
                <Text style={styles.characterCount}>
                  {description.length}/300
                </Text>
              </View>

              <View style={styles.timeContainer}>
                <View style={styles.timeInputContainer}>
                  <Text style={styles.label}>Hora de inicio *</Text>
                  <TextInput
                    style={styles.timeInput}
                    placeholder="14:30"
                    placeholderTextColor="#adb5bd"
                    value={startTime}
                    onChangeText={setStartTime}
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.timeInputContainer}>
                  <Text style={styles.label}>Hora de fin (opcional)</Text>
                  <TextInput
                    style={styles.timeInput}
                    placeholder="15:30"
                    placeholderTextColor="#adb5bd"
                    value={endTime}
                    onChangeText={setEndTime}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Tipo de evento</Text>
                <View style={styles.typeGrid}>
                  {EVENT_TYPES.map((type) => (
                    <TouchableOpacity
                      key={type.key}
                      style={[
                        styles.typeButton,
                        selectedType === type.key && styles.selectedTypeButton,
                        { borderColor: type.color }
                      ]}
                      onPress={() => setSelectedType(type.key)}
                    >
                      <View style={[styles.typeIndicator, { backgroundColor: type.color }]} />
                      <Text style={[
                        styles.typeButtonText,
                        selectedType === type.key && styles.selectedTypeButtonText
                      ]}>
                        {type.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleClose}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.addButton,
                  (title.trim().length === 0 || startTime.trim().length === 0) && styles.addButtonDisabled
                ]}
                onPress={handleAddEvent}
                disabled={title.trim().length === 0 || startTime.trim().length === 0}
              >
                <Icon name="calendar" size={20} color="#FFFFFF" />
                <Text style={styles.addButtonText}>Agregar Evento</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 34,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d4150',
  },
  closeButton: {
    padding: 4,
  },
  scrollContainer: {
    maxHeight: 400,
  },
  dateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  dateText: {
    fontSize: 14,
    color: '#007AFF',
    marginLeft: 8,
    textTransform: 'capitalize',
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  categoryText: {
    fontSize: 14,
    color: '#6c757d',
    marginLeft: 8,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2d4150',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#2d4150',
    backgroundColor: '#f8f9fa',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  characterCount: {
    textAlign: 'right',
    fontSize: 12,
    color: '#adb5bd',
    marginTop: 4,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  timeInputContainer: {
    flex: 1,
    marginHorizontal: 4,
  },
  timeInput: {
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#2d4150',
    backgroundColor: '#f8f9fa',
    textAlign: 'center',
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    backgroundColor: '#ffffff',
  },
  selectedTypeButton: {
    backgroundColor: '#f8f9fa',
  },
  typeIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  typeButtonText: {
    fontSize: 12,
    color: '#6c757d',
  },
  selectedTypeButtonText: {
    color: '#2d4150',
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dee2e6',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#6c757d',
    fontWeight: '600',
  },
  addButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#007AFF',
  },
  addButtonDisabled: {
    backgroundColor: '#dee2e6',
  },
  addButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default AddEventModal;
