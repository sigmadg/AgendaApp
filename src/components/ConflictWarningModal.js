import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const CATEGORY_NAMES = {
  personal: 'Mi Perfil',
  work: 'Trabajo',
  school: 'Escuela',
  nutrition: 'Alimentación',
  exercise: 'Ejercicio',
  languages: 'Idiomas',
  menstrual: 'Calendario Menstrual'
};

const ConflictWarningModal = ({ visible, onClose, conflicts, onConfirm, onCancel }) => {
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const handleCancel = () => {
    onCancel();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Icon name="warning" size={32} color="#FF9500" />
            </View>
            <Text style={styles.title}>Conflicto de Horarios</Text>
            <Text style={styles.subtitle}>
              Se detectaron eventos superpuestos en otras categorías
            </Text>
          </View>

          <View style={styles.conflictsContainer}>
            <Text style={styles.conflictsTitle}>Eventos conflictivos:</Text>
            {conflicts.map((conflict, index) => (
              <View key={index} style={styles.conflictItem}>
                <View style={styles.conflictInfo}>
                  <Text style={styles.conflictTime}>
                    {formatTime(conflict.startTime)}
                    {conflict.endTime && ` - ${formatTime(conflict.endTime)}`}
                  </Text>
                  <Text style={styles.conflictTitle}>{conflict.title}</Text>
                  <View style={styles.conflictCategory}>
                    <View style={[styles.categoryDot, { backgroundColor: conflict.categoryColor }]} />
                    <Text style={styles.conflictCategoryText}>
                      {CATEGORY_NAMES[conflict.category] || conflict.category}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.warningContainer}>
            <Icon name="information-circle" size={20} color="#007AFF" />
            <Text style={styles.warningText}>
              ¿Deseas continuar agregando este evento a pesar del conflicto?
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirm}
            >
              <Icon name="checkmark" size={20} color="#FFFFFF" />
              <Text style={styles.confirmButtonText}>Continuar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFF3CD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d4150',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
    lineHeight: 20,
  },
  conflictsContainer: {
    marginBottom: 20,
  },
  conflictsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d4150',
    marginBottom: 12,
  },
  conflictItem: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9500',
  },
  conflictInfo: {
    flex: 1,
  },
  conflictTime: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF9500',
    marginBottom: 4,
  },
  conflictTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2d4150',
    marginBottom: 6,
  },
  conflictCategory: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  conflictCategoryText: {
    fontSize: 12,
    color: '#6c757d',
    textTransform: 'capitalize',
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
  },
  warningText: {
    fontSize: 14,
    color: '#1976d2',
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
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
  confirmButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#FF9500',
  },
  confirmButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default ConflictWarningModal;
