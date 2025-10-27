import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PersonalSections from '../index';
import { useTheme } from '../../shared/hooks/useTheme';

const PersonalSectionsExample = () => {
  const { getThemeColors, currentTheme } = useTheme();
  const themeColors = getThemeColors();

  // Estados de ejemplo
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [tasks, setTasks] = useState({
    [selectedDate]: [
      {
        id: '1',
        title: 'Comprar alimentos',
        description: 'Ir al supermercado',
        date: selectedDate,
        priority: 'high',
        category: 'personal',
        completed: false,
        estimatedTime: '1 hora',
      },
      {
        id: '2',
        title: 'Llamar al médico',
        description: 'Agendar cita médica',
        date: selectedDate,
        priority: 'medium',
        category: 'health',
        completed: true,
        estimatedTime: '30 min',
      },
    ],
  });

  const [events, setEvents] = useState({
    [selectedDate]: [
      {
        id: '1',
        title: 'Cita con el dentista',
        description: 'Limpieza dental',
        date: selectedDate,
        time: '10:00',
        type: 'health',
        location: 'Clínica Dental',
      },
      {
        id: '2',
        title: 'Cumpleaños de María',
        description: 'Celebración familiar',
        date: selectedDate,
        time: '19:00',
        type: 'social',
        location: 'Casa',
      },
    ],
  });

  const [user, setUser] = useState({
    id: '1',
    name: 'Juan Pérez',
    email: 'juan@ejemplo.com',
    phone: '+1234567890',
    bio: 'Desarrollador apasionado por la tecnología',
    location: 'Madrid, España',
    avatar: null,
  });

  const [activeSections, setActiveSections] = useState({
    events: true,
    tasks: true,
    profile: true,
    journal: true,
    settings: true,
  });

  // Funciones de manejo de datos
  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleAddTask = (task) => {
    setTasks(prev => ({
      ...prev,
      [task.date]: [...(prev[task.date] || []), task],
    }));
  };

  const handleToggleTask = (taskId) => {
    setTasks(prev => {
      const newTasks = { ...prev };
      Object.keys(newTasks).forEach(date => {
        newTasks[date] = newTasks[date].map(task =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        );
      });
      return newTasks;
    });
  };

  const handleDeleteTask = (taskId) => {
    setTasks(prev => {
      const newTasks = { ...prev };
      Object.keys(newTasks).forEach(date => {
        newTasks[date] = newTasks[date].filter(task => task.id !== taskId);
      });
      return newTasks;
    });
  };

  const handleAddEvent = (event) => {
    setEvents(prev => ({
      ...prev,
      [event.date]: [...(prev[event.date] || []), event],
    }));
  };

  const handleEditEvent = (eventId) => {
    console.log('Editando evento:', eventId);
  };

  const handleDeleteEvent = (eventId) => {
    setEvents(prev => {
      const newEvents = { ...prev };
      Object.keys(newEvents).forEach(date => {
        newEvents[date] = newEvents[date].filter(event => event.id !== eventId);
      });
      return newEvents;
    });
  };

  const handleUpdateProfile = (profileData) => {
    setUser(prev => ({ ...prev, ...profileData }));
  };

  const handleLogout = () => {
    console.log('Cerrando sesión...');
  };

  const handleToggleSection = (section) => {
    setActiveSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleClearSection = (section) => {
    console.log('Limpiando sección:', section);
  };

  const getAllEventsForDate = (date) => {
    return events[date] || [];
  };

  const getTasksForDate = (date) => {
    return tasks[date] || [];
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Text style={[styles.title, { color: themeColors.text }]}>
        PersonalSections - Ejemplo de Uso
      </Text>
      
      <PersonalSections
        selectedDate={selectedDate}
        onDateSelect={handleDateSelect}
        tasks={tasks}
        events={events}
        getAllEventsForDate={getAllEventsForDate}
        getTasksForDate={getTasksForDate}
        onAddTask={handleAddTask}
        onToggleTask={handleToggleTask}
        onDeleteTask={handleDeleteTask}
        onAddEvent={handleAddEvent}
        onEditEvent={handleEditEvent}
        onDeleteEvent={handleDeleteEvent}
        user={user}
        onUpdateProfile={handleUpdateProfile}
        onLogout={handleLogout}
        activeSections={activeSections}
        onToggleSection={handleToggleSection}
        onClearSection={handleClearSection}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
});

export default PersonalSectionsExample;
