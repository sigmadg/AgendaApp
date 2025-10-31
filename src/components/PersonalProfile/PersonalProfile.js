import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

// Importar subsecciones
import EventsSection from './sections/EventsSection';
import TasksSection from './sections/TasksSection';
import ProfileSection from './sections/ProfileSection';
import SettingsSection from './sections/SettingsSection';

// Importar estilos
import { personalStyles } from './styles/personalStyles';

const PersonalProfile = ({ 
  selectedDate, 
  onDateSelect, 
  tasks, 
  events, 
  getAllEventsForDate,
  getTasksForDate,
  onAddTask, 
  onToggleTask, 
  onDeleteTask, 
  onAddEvent, 
  onEditEvent, 
  onDeleteEvent,
  user,
  onUpdateProfile,
  onLogout,
  activeSections,
  onToggleSection,
  onClearSection
}) => {
  const [activeSection, setActiveSection] = useState('events');

  const sections = [
    { id: 'events', name: 'Eventos del día', icon: 'calendar-outline' },
    { id: 'tasks', name: 'Tareas', icon: 'checkmark-circle-outline' },
    { id: 'profile', name: 'Perfil', icon: 'person-outline' },
    { id: 'settings', name: 'Configuración', icon: 'settings-outline' }
  ];

  const renderSectionTabs = () => (
    <View style={personalStyles.tabsContainer}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={personalStyles.tabsContent}
      >
        {sections.map((section) => (
          <TouchableOpacity
            key={section.id}
            style={[
              personalStyles.tab,
              activeSection === section.id && personalStyles.activeTab
            ]}
            onPress={() => setActiveSection(section.id)}
          >
            <Icon 
              name={section.icon} 
              size={20} 
              color={activeSection === section.id ? '#FFFFFF' : '#4A6741'} 
            />
            <Text style={[
              personalStyles.tabText,
              activeSection === section.id && personalStyles.activeTabText
            ]}>
              {section.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'events':
        return (
          <EventsSection
            selectedDate={selectedDate}
            onDateSelect={onDateSelect}
            events={events}
            getAllEventsForDate={getAllEventsForDate}
            onAddEvent={onAddEvent}
            onEditEvent={onEditEvent}
            onDeleteEvent={onDeleteEvent}
          />
        );
      case 'tasks':
        return (
          <TasksSection
            selectedDate={selectedDate}
            onDateSelect={onDateSelect}
            tasks={tasks}
            getTasksForDate={getTasksForDate}
            onAddTask={onAddTask}
            onToggleTask={onToggleTask}
            onDeleteTask={onDeleteTask}
          />
        );
      case 'profile':
        return (
          <ProfileSection
            user={user}
            onUpdateProfile={onUpdateProfile}
            onLogout={onLogout}
          />
        );
      case 'settings':
        return (
          <SettingsSection
            activeSections={activeSections}
            onToggleSection={onToggleSection}
            onClearSection={onClearSection}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={personalStyles.container}>
      {renderSectionTabs()}
      <ScrollView style={personalStyles.content} showsVerticalScrollIndicator={false}>
        {renderActiveSection()}
      </ScrollView>
    </View>
  );
};

export default PersonalProfile;
