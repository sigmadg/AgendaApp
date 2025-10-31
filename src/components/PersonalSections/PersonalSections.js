import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
} from 'react-native';
import { SectionHeader, ElegantSubsectionTabs } from '../shared';
import { useTheme } from '../shared/hooks/useTheme';
import { personalSectionsStyles } from './styles/personalSectionsStyles';

// Importar subsecciones
import EventsSection from './sections/EventsSection';
import TasksSection from './sections/TasksSection';
import ProfileSection from './sections/ProfileSection';
import SettingsSection from './sections/SettingsSection';
import JournalSection from './sections/JournalSection';
import SectionsSection from './sections/SectionsSection';

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
    { id: 'sections', name: 'Secciones', icon: 'grid-outline' },
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
      case 'sections':
        return <SectionsSection {...commonProps} />;
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
      <ElegantSubsectionTabs
        sections={sections}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        theme="forest"
        size="medium"
        showIcons={true}
        showLabels={false}
      />
      
      <ScrollView style={personalSectionsStyles.content} showsVerticalScrollIndicator={false}>
        {renderActiveSection()}
      </ScrollView>
    </View>
  );
};

export default PersonalSections;