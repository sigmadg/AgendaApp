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
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const AddTaskModal = ({ visible, onClose, onAddTask }) => {
  const [taskText, setTaskText] = useState('');

  const handleAddTask = () => {
    if (taskText.trim().length === 0) {
      Alert.alert('Error', 'Por favor ingresa una tarea válida');
      return;
    }

    onAddTask(taskText.trim());
    setTaskText('');
  };

  const handleClose = () => {
    setTaskText('');
    onClose();
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
              <Text style={styles.title}>Nueva Tarea</Text>
              <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                <Icon name="close" size={24} color="#6c757d" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="¿Qué necesitas hacer?"
                placeholderTextColor="#adb5bd"
                value={taskText}
                onChangeText={setTaskText}
                multiline
                maxLength={200}
                autoFocus
                returnKeyType="done"
                onSubmitEditing={handleAddTask}
              />
              <Text style={styles.characterCount}>
                {taskText.length}/200
              </Text>
            </View>

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
                  taskText.trim().length === 0 && styles.addButtonDisabled
                ]}
                onPress={handleAddTask}
                disabled={taskText.trim().length === 0}
              >
                <Icon name="add" size={20} color="#FFFFFF" />
                <Text style={styles.addButtonText}>Agregar</Text>
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
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d4150',
  },
  closeButton: {
    padding: 4,
  },
  inputContainer: {
    marginBottom: 24,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#2d4150',
    minHeight: 100,
    textAlignVertical: 'top',
    backgroundColor: '#f8f9fa',
  },
  characterCount: {
    textAlign: 'right',
    fontSize: 12,
    color: '#adb5bd',
    marginTop: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
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

export default AddTaskModal;
