import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import TaskItem from './TaskItem';

const TaskList = ({ tasks, onToggleTask, onDeleteTask, onAddTask }) => {
  const renderTask = ({ item }) => (
    <TaskItem
      task={item}
      onToggle={() => onToggleTask(item.id)}
      onDelete={() => handleDeleteTask(item.id, item.text)}
    />
  );

  const handleDeleteTask = (taskId, taskText) => {
    Alert.alert(
      'Eliminar tarea',
      `¿Estás seguro de que quieres eliminar "${taskText}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => onDeleteTask(taskId) },
      ]
    );
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tareas del día</Text>
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>
            {completedTasks}/{totalTasks} completadas
          </Text>
        </View>
      </View>

      {tasks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="checkmark-circle-outline" size={64} color="#dee2e6" />
          <Text style={styles.emptyTitle}>No hay tareas</Text>
          <Text style={styles.emptySubtitle}>
            Toca el botón + para agregar tu primera tarea
          </Text>
          <TouchableOpacity style={styles.addFirstTaskButton} onPress={onAddTask}>
            <Icon name="add" size={20} color="#FFFFFF" />
            <Text style={styles.addFirstTaskText}>Agregar tarea</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={tasks}
          renderItem={renderTask}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    margin: 16,
    marginTop: 0,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d4150',
  },
  statsContainer: {
    backgroundColor: '#e9ecef',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statsText: {
    fontSize: 14,
    color: '#6c757d',
    fontWeight: '500',
  },
  listContainer: {
    paddingBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6c757d',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#adb5bd',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 32,
  },
  addFirstTaskButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  addFirstTaskText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default TaskList;
