import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { SectionHeader } from '../shared';
import { useTheme } from '../shared/hooks/useTheme';
import { personalSectionsStyles } from './styles/personalSectionsStyles';

// Importar subsecciones
import EventsSection from './sections/EventsSection';
import TasksSection from './sections/TasksSection';
import ProfileSection from './sections/ProfileSection';
import SettingsSection from './sections/SettingsSection';
import JournalSection from './sections/JournalSection';

const PersonalSections = ({ 
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
  const { getThemeColors, currentTheme } = useTheme();

  const sections = [
    { id: 'events', name: 'Eventos', icon: 'calendar-outline' },
    { id: 'tasks', name: 'Tareas', icon: 'checkmark-circle-outline' },
    { id: 'profile', name: 'Perfil', icon: 'person-outline' },
    { id: 'journal', name: 'Diario', icon: 'book-outline' },
    { id: 'settings', name: 'Configuración', icon: 'settings-outline' },
  ];

  const themeColors = getThemeColors();

  const renderActiveSection = () => {
    const commonProps = {
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
      onClearSection,
      theme: currentTheme,
    };

    switch (activeSection) {
      case 'events':
        return <EventsSection {...commonProps} />;
      case 'tasks':
        return <TasksSection {...commonProps} />;
      case 'profile':
        return <ProfileSection {...commonProps} />;
      case 'journal':
        return <JournalSection {...commonProps} />;
      case 'settings':
        return <SettingsSection {...commonProps} />;
      default:
        return (
          <View style={personalSectionsStyles.defaultSection}>
            <SectionHeader
              title="Mi Perfil"
              subtitle="Gestiona tu información personal"
              image={require('../../../android/app/src/main/assets/mascota.png')}
              theme={currentTheme}
              size="medium"
            />
            <View style={personalSectionsStyles.welcomeCard}>
              <Text style={[personalSectionsStyles.welcomeText, { color: themeColors.textSecondary }]}>
                Elige una opción del menú para comenzar
              </Text>
            </View>
          </View>
        );
    }
  };

  return (
    <View style={[personalSectionsStyles.container, { backgroundColor: themeColors.background }]}>
      {/* Barra de navegación personalizada solo con iconos */}
      <View style={[personalSectionsStyles.navigationBar, { backgroundColor: themeColors.surface }]}>
        {sections.map((section) => (
          <TouchableOpacity
            key={section.id}
            style={[
              personalSectionsStyles.navTab,
              activeSection === section.id && personalSectionsStyles.navTabActive
            ]}
            onPress={() => setActiveSection(section.id)}
            activeOpacity={0.7}
          >
            <Icon
              name={section.icon}
              size={24}
              color={
                activeSection === section.id
                  ? '#FFFFFF'
                  : themeColors.textSecondary
              }
            />
          </TouchableOpacity>
        ))}
      </View>
      
      <ScrollView style={personalSectionsStyles.content} showsVerticalScrollIndicator={false}>
        {renderActiveSection()}
      </ScrollView>
    </View>
  );
};

export default PersonalSections;