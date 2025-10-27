// Ejemplo de uso de PersonalProfile

import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { PersonalProfile } from '../index';

const PersonalProfileExample = () => {
  // Estados para datos
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState({
    name: 'Juan Pérez',
    email: 'juan@ejemplo.com',
    phone: '+1234567890',
    bio: 'Desarrollador de software apasionado por la tecnología'
  });
  const [activeSections, setActiveSections] = useState([
    'personal', 'work', 'school', 'health', 'finance'
  ]);

  // Funciones para manejar eventos
  const handleAddEvent = (event) => {
    setEvents(prev => [...prev, event]);
  };

  const handleEditEvent = (event) => {
    setEvents(prev => prev.map(e => e.id === event.id ? event : e));
  };

  const handleDeleteEvent = (eventId) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
  };

  // Funciones para manejar tareas
  const handleAddTask = (task) => {
    setTasks(prev => [...prev, task]);
  };

  const handleToggleTask = (taskId) => {
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, completed: !t.completed } : t
    ));
  };

  const handleDeleteTask = (taskId) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  // Funciones para manejar perfil
  const handleUpdateProfile = (profileData) => {
    setUser(prev => ({ ...prev, ...profileData }));
  };

  const handleLogout = () => {
    // Lógica para cerrar sesión
    console.log('Cerrando sesión...');
  };

  // Funciones para manejar secciones
  const handleToggleSection = (sectionId) => {
    setActiveSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleClearSection = (sectionId) => {
    // Lógica para limpiar una sección
    console.log(`Limpiando sección: ${sectionId}`);
  };

  // Funciones auxiliares
  const getAllEventsForDate = (date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const getTasksForDate = (date) => {
    return tasks.filter(task => {
      const taskDate = new Date(task.date);
      return taskDate.toDateString() === date.toDateString();
    });
  };

  return (
    <View style={styles.container}>
      <PersonalProfile
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
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
    backgroundColor: '#F5F7F0',
  },
});

export default PersonalProfileExample;
