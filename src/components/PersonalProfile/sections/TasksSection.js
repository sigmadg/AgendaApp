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

const TasksSection = ({
  selectedDate,
  onDateSelect,
  tasks,
  getTasksForDate,
  onAddTask,
  onToggleTask,
  onDeleteTask,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
  });

  const handleAddTask = () => {
    if (newTask.title) {
      onAddTask({
        ...newTask,
        date: selectedDate,
        id: Date.now().toString(),
        completed: false,
      });
      setNewTask({ title: '', description: '' });
      setShowAddModal(false);
    } else {
      Alert.alert('Error', 'Por favor ingresa el título de la tarea');
    }
  };

  const closeModal = () => {
    setShowAddModal(false);
    setNewTask({ title: '', description: '' });
  };

  const dayTasks = getTasksForDate(selectedDate);

  return (
    <View style={personalStyles.section}>
      <View style={personalStyles.sectionHeader}>
        <View style={personalStyles.headerDecoration}>
          <Icon name="checkmark-circle" size={20} color="#4A7C59" />
        </View>
        <View style={personalStyles.headerContent}>
          <Text style={personalStyles.sectionTitle}>Tareas</Text>
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

      {dayTasks.length === 0 ? (
        <View style={personalStyles.emptyState}>
          <Icon name="checkmark-circle-outline" size={48} color="#4A6741" />
          <Text style={personalStyles.emptyStateTitle}>No hay tareas</Text>
          <Text style={personalStyles.emptyStateSubtitle}>
            Agrega una tarea para este día
          </Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {dayTasks.map((task) => (
            <View key={task.id} style={personalStyles.taskCard}>
              <TouchableOpacity
                style={personalStyles.taskCheckbox}
                onPress={() => onToggleTask(task.id)}
              >
                <Icon
                  name={task.completed ? "checkmark-circle" : "ellipse-outline"}
                  size={24}
                  color={task.completed ? "#4A7C59" : "#4A6741"}
                />
              </TouchableOpacity>
              <View style={personalStyles.taskContent}>
                <Text style={[
                  personalStyles.taskTitle,
                  task.completed && personalStyles.taskTitleCompleted
                ]}>
                  {task.title}
                </Text>
                {task.description && (
                  <Text style={[
                    personalStyles.taskDescription,
                    task.completed && personalStyles.taskDescriptionCompleted
                  ]}>
                    {task.description}
                  </Text>
                )}
              </View>
              <TouchableOpacity
                onPress={() => onDeleteTask(task.id)}
                style={personalStyles.deleteButton}
              >
                <Icon name="trash-outline" size={16} color="#E53E3E" />
              </TouchableOpacity>
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
              <Text style={personalStyles.modalTitle}>Nueva Tarea</Text>
              <TouchableOpacity onPress={closeModal}>
                <Icon name="close" size={24} color="#4A6741" />
              </TouchableOpacity>
            </View>
            <View style={personalStyles.modalContent}>
              <TextInput
                style={personalStyles.input}
                placeholder="Título de la tarea"
                value={newTask.title}
                onChangeText={(text) => setNewTask({ ...newTask, title: text })}
              />
              <TextInput
                style={[personalStyles.input, { height: 80, textAlignVertical: 'top' }]}
                placeholder="Descripción (opcional)"
                value={newTask.description}
                onChangeText={(text) => setNewTask({ ...newTask, description: text })}
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
                onPress={handleAddTask}
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

export default TasksSection;
