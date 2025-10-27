import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTasks } from '../context/TasksContext';
import { TaskCard } from '../../shared/work';
import { useTheme } from '../../shared/hooks/useTheme';

const TasksContainer = ({ theme = 'desert' }) => {
  const { getThemeColors } = useTheme();
  const themeColors = getThemeColors();
  
  const {
    dailyTasks,
    weeklyTasks,
    addDailyTask,
    addWeeklyTask,
    toggleTask,
    editTask,
    deleteTask,
    addTaskNotes,
  } = useTasks();

  const [activeTab, setActiveTab] = useState('daily');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskDate, setNewTaskDate] = useState(new Date());
  const [newTaskTime, setNewTaskTime] = useState(new Date());
  const [newTaskNotes, setNewTaskNotes] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const handleAddTask = () => {
    if (newTaskText.trim() === '') {
      Alert.alert('Error', 'Por favor ingresa una tarea');
      return;
    }

    const taskData = {
      title: newTaskText.trim(),
      date: newTaskDate.toISOString().split('T')[0],
      time: activeTab === 'daily' ? newTaskTime.toTimeString().split(' ')[0].substring(0, 5) : null,
      notes: newTaskNotes,
      priority: 'medium',
      completed: false,
      urgent: false,
      overdue: false,
    };

    if (activeTab === 'daily') {
      addDailyTask(taskData);
    } else {
      addWeeklyTask(taskData);
    }

    setNewTaskText('');
    setNewTaskNotes('');
    setNewTaskDate(new Date());
    setNewTaskTime(new Date());
    setShowAddModal(false);
  };

  const handleEditTask = (taskId) => {
    const task = activeTab === 'daily' 
      ? dailyTasks.find(t => t.id === taskId)
      : weeklyTasks.find(t => t.id === taskId);
    
    if (task) {
      setNewTaskText(task.title);
      setNewTaskNotes(task.notes);
      setEditingTask(task);
      setShowAddModal(true);
    }
  };

  const handleSaveEdit = () => {
    if (editingTask) {
      const updatedTask = {
        ...editingTask,
        title: newTaskText.trim(),
        notes: newTaskNotes,
      };
      
      editTask(editingTask.id, updatedTask);
      setEditingTask(null);
    }
    setShowAddModal(false);
  };

  const handleDeleteTask = (taskId) => {
    Alert.alert(
      'Eliminar Tarea',
      '¿Estás seguro de que quieres eliminar esta tarea?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => deleteTask(taskId, activeTab),
        }
      ]
    );
  };

  const handleAddNotes = (taskId) => {
    const task = activeTab === 'daily' 
      ? dailyTasks.find(t => t.id === taskId)
      : weeklyTasks.find(t => t.id === taskId);
    
    if (task) {
      setNewTaskText(task.title);
      setNewTaskNotes(task.notes);
      setEditingTask(task);
      setShowAddModal(true);
    }
  };

  const currentTasks = activeTab === 'daily' ? dailyTasks : weeklyTasks;
  const completedTasks = currentTasks.filter(task => task.completed).length;
  const totalTasks = currentTasks.length;

  return (
    <View style={{ flex: 1, backgroundColor: themeColors.background }}>
      {/* Header */}
      <View style={{
        backgroundColor: themeColors.primary,
        padding: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        marginBottom: 20,
      }}>
        <Text style={{
          fontSize: 24,
          fontWeight: '700',
          color: '#FFFFFF',
          textAlign: 'center',
          marginBottom: 8,
        }}>
          Gestión de Tareas
        </Text>
        <Text style={{
          fontSize: 16,
          color: 'rgba(255, 255, 255, 0.9)',
          textAlign: 'center',
        }}>
          Organiza tu trabajo diario y semanal
        </Text>
      </View>

      {/* Tabs */}
      <View style={{
        flexDirection: 'row',
        marginHorizontal: 16,
        marginBottom: 20,
        backgroundColor: themeColors.surface,
        borderRadius: 12,
        padding: 4,
      }}>
        <TouchableOpacity
          style={{
            flex: 1,
            padding: 12,
            borderRadius: 8,
            backgroundColor: activeTab === 'daily' ? themeColors.primary : 'transparent',
            alignItems: 'center',
          }}
          onPress={() => setActiveTab('daily')}
        >
          <Icon 
            name="sunny-outline" 
            size={20} 
            color={activeTab === 'daily' ? '#FFFFFF' : themeColors.textSecondary} 
          />
          <Text style={{
            color: activeTab === 'daily' ? '#FFFFFF' : themeColors.textSecondary,
            fontWeight: '600',
            marginTop: 4,
          }}>
            Diarias
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={{
            flex: 1,
            padding: 12,
            borderRadius: 8,
            backgroundColor: activeTab === 'weekly' ? themeColors.primary : 'transparent',
            alignItems: 'center',
          }}
          onPress={() => setActiveTab('weekly')}
        >
          <Icon 
            name="leaf-outline" 
            size={20} 
            color={activeTab === 'weekly' ? '#FFFFFF' : themeColors.textSecondary} 
          />
          <Text style={{
            color: activeTab === 'weekly' ? '#FFFFFF' : themeColors.textSecondary,
            fontWeight: '600',
            marginTop: 4,
          }}>
            Semanales
          </Text>
        </TouchableOpacity>
      </View>

      {/* Summary */}
      <View style={{
        flexDirection: 'row',
        marginHorizontal: 16,
        marginBottom: 20,
        gap: 12,
      }}>
        <View style={{
          flex: 1,
          backgroundColor: themeColors.surface,
          padding: 16,
          borderRadius: 12,
          alignItems: 'center',
        }}>
          <Text style={{
            fontSize: 24,
            fontWeight: '700',
            color: themeColors.primary,
          }}>
            {completedTasks}/{totalTasks}
          </Text>
          <Text style={{
            fontSize: 12,
            color: themeColors.textSecondary,
            marginTop: 4,
          }}>
            Completadas
          </Text>
        </View>
        
        <View style={{
          flex: 1,
          backgroundColor: themeColors.surface,
          padding: 16,
          borderRadius: 12,
          alignItems: 'center',
        }}>
          <Text style={{
            fontSize: 24,
            fontWeight: '700',
            color: themeColors.primary,
          }}>
            {totalTasks - completedTasks}
          </Text>
          <Text style={{
            fontSize: 12,
            color: themeColors.textSecondary,
            marginTop: 4,
          }}>
            Pendientes
          </Text>
        </View>
      </View>

      {/* Tasks List */}
      <ScrollView style={{ flex: 1, paddingHorizontal: 16 }}>
        {currentTasks.length === 0 ? (
          <View style={{
            backgroundColor: themeColors.surface,
            padding: 40,
            borderRadius: 12,
            alignItems: 'center',
          }}>
            <Icon name="checkmark-circle-outline" size={48} color={themeColors.textSecondary} />
            <Text style={{
              fontSize: 18,
              fontWeight: '600',
              color: themeColors.text,
              marginTop: 16,
              textAlign: 'center',
            }}>
              No hay tareas
            </Text>
            <Text style={{
              fontSize: 14,
              color: themeColors.textSecondary,
              marginTop: 8,
              textAlign: 'center',
            }}>
              Agrega tu primera tarea {activeTab === 'daily' ? 'del día' : 'semanal'}
            </Text>
          </View>
        ) : (
          <View style={{ gap: 12 }}>
            {currentTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={() => toggleTask(task.id, activeTab)}
                onEdit={() => handleEditTask(task.id)}
                onDelete={() => handleDeleteTask(task.id)}
                onAddNotes={() => handleAddNotes(task.id)}
                theme={theme}
                size="medium"
                variant={task.completed ? 'completed' : task.overdue ? 'overdue' : task.urgent ? 'urgent' : 'default'}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {/* Add Button */}
      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          backgroundColor: themeColors.primary,
          width: 56,
          height: 56,
          borderRadius: 28,
          justifyContent: 'center',
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        }}
        onPress={() => {
          setNewTaskText('');
          setNewTaskNotes('');
          setNewTaskDate(new Date());
          setNewTaskTime(new Date());
          setEditingTask(null);
          setShowAddModal(true);
        }}
      >
        <Icon name="add" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Add Task Modal */}
      <Modal
        visible={showAddModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <View style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 20,
            width: '90%',
            maxHeight: '80%',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.25,
            shadowRadius: 20,
            elevation: 10,
          }}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 20,
              borderBottomWidth: 1,
              borderBottomColor: '#E9ECEF',
            }}>
              <Text style={{
                fontSize: 18,
                fontWeight: '700',
                color: '#212529',
              }}>
                {editingTask ? 'Editar Tarea' : `Nueva Tarea ${activeTab === 'daily' ? 'Diaria' : 'Semanal'}`}
              </Text>
              <TouchableOpacity
                onPress={() => setShowAddModal(false)}
                style={{ padding: 4 }}
              >
                <Icon name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ padding: 20 }}>
              <View style={{ marginBottom: 16 }}>
                <Text style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: 8,
                }}>
                  Tarea
                </Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: '#D1D5DB',
                    borderRadius: 8,
                    padding: 12,
                    fontSize: 16,
                    color: '#111827',
                    backgroundColor: '#FFFFFF',
                  }}
                  value={newTaskText}
                  onChangeText={setNewTaskText}
                  placeholder="Ingresa la tarea"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={{ marginBottom: 16 }}>
                <Text style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: 8,
                }}>
                  Fecha
                </Text>
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: '#D1D5DB',
                    borderRadius: 8,
                    padding: 12,
                    backgroundColor: '#FFFFFF',
                  }}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Icon name="calendar-outline" size={20} color="#6B7280" />
                  <Text style={{
                    fontSize: 16,
                    color: '#111827',
                    marginLeft: 8,
                  }}>
                    {newTaskDate.toLocaleDateString()}
                  </Text>
                </TouchableOpacity>
              </View>

              {activeTab === 'daily' && (
                <View style={{ marginBottom: 16 }}>
                  <Text style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: 8,
                  }}>
                    Hora
                  </Text>
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      borderWidth: 1,
                      borderColor: '#D1D5DB',
                      borderRadius: 8,
                      padding: 12,
                      backgroundColor: '#FFFFFF',
                    }}
                    onPress={() => setShowTimePicker(true)}
                  >
                    <Icon name="time-outline" size={20} color="#6B7280" />
                    <Text style={{
                      fontSize: 16,
                      color: '#111827',
                      marginLeft: 8,
                    }}>
                      {newTaskTime.toTimeString().split(' ')[0].substring(0, 5)}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              <View style={{ marginBottom: 16 }}>
                <Text style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: 8,
                }}>
                  Notas
                </Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: '#D1D5DB',
                    borderRadius: 8,
                    padding: 12,
                    fontSize: 16,
                    color: '#111827',
                    backgroundColor: '#FFFFFF',
                    height: 80,
                    textAlignVertical: 'top',
                  }}
                  value={newTaskNotes}
                  onChangeText={setNewTaskNotes}
                  placeholder="Agrega notas adicionales"
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={3}
                />
              </View>
            </ScrollView>

            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: 20,
              borderTopWidth: 1,
              borderTopColor: '#E9ECEF',
              gap: 12,
            }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  padding: 12,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: '#D1D5DB',
                  backgroundColor: '#FFFFFF',
                  alignItems: 'center',
                }}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: '#374151',
                }}>
                  Cancelar
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={{
                  flex: 1,
                  padding: 12,
                  borderRadius: 8,
                  backgroundColor: themeColors.primary,
                  alignItems: 'center',
                }}
                onPress={editingTask ? handleSaveEdit : handleAddTask}
              >
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: '#FFFFFF',
                }}>
                  {editingTask ? 'Guardar' : 'Agregar'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={newTaskDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              setNewTaskDate(selectedDate);
            }
          }}
        />
      )}

      {/* Time Picker */}
      {showTimePicker && (
        <DateTimePicker
          value={newTaskTime}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedTime) => {
            setShowTimePicker(false);
            if (selectedTime) {
              setNewTaskTime(selectedTime);
            }
          }}
        />
      )}
    </View>
  );
};

export default TasksContainer;
