import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const TaskItem = ({ task, onToggle, onDelete }) => {
  return (
    <View style={[styles.container, task.completed && styles.completedContainer]}>
      <TouchableOpacity
        style={styles.checkbox}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <View style={[
          styles.checkboxCircle,
          task.completed && styles.checkedCircle
        ]}>
          {task.completed && (
            <Icon name="checkmark" size={16} color="#FFFFFF" />
          )}
        </View>
      </TouchableOpacity>

      <View style={styles.textContainer}>
        <Text style={[
          styles.taskText,
          task.completed && styles.completedText
        ]}>
          {task.text}
        </Text>
        <Text style={styles.timeText}>
          {new Date(task.createdAt).toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={onDelete}
        activeOpacity={0.7}
      >
        <Icon name="trash-outline" size={20} color="#dc3545" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 16,
    marginBottom: 8,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  completedContainer: {
    backgroundColor: '#e8f5e8',
    borderLeftColor: '#34C759',
  },
  checkbox: {
    marginRight: 12,
  },
  checkboxCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#dee2e6',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  checkedCircle: {
    backgroundColor: '#34C759',
    borderColor: '#34C759',
  },
  textContainer: {
    flex: 1,
  },
  taskText: {
    fontSize: 16,
    color: '#2d4150',
    fontWeight: '500',
    marginBottom: 4,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#6c757d',
  },
  timeText: {
    fontSize: 12,
    color: '#adb5bd',
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
  },
});

export default TaskItem;
