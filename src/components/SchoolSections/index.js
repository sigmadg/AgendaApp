import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
} from 'react-native';
import { SectionHeader, SubsectionTabs } from '../shared';
import { useTheme } from '../shared/hooks/useTheme';
import { schoolSectionsStyles } from './styles/schoolSectionsStyles';

// Importar subsecciones
import TimetableSection from './sections/TimetableSection';
import TodoSection from './sections/TodoSection';
import ProjectsSection from './sections/ProjectsSection';
import ExamsSection from './sections/ExamsSection';
import ClassSection from './sections/ClassSection';

const SchoolSections = ({ 
  onUpdateSection, 
  user,
  selectedDate,
  onDateSelect,
  events,
  tasks,
  getAllEventsForDate,
  getTasksForDate,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onAddEvent,
  onEditEvent,
  onDeleteEvent
}) => {
  const [activeSection, setActiveSection] = useState('timetable');
  const { getThemeColors, currentTheme } = useTheme();
  const themeColors = getThemeColors();

  // Validar que user existe
  if (!user) {
    return (
      <View style={[schoolSectionsStyles.container, { backgroundColor: themeColors.background }]}>
        <View style={schoolSectionsStyles.defaultSection}>
          <Text style={[schoolSectionsStyles.defaultText, { color: themeColors.text }]}>
            Cargando datos del usuario...
          </Text>
        </View>
      </View>
    );
  }

  const sections = [
    { id: 'timetable', name: 'Horario', icon: 'calendar-outline' },
    { id: 'todo', name: 'Tareas', icon: 'checkmark-circle-outline' },
    { id: 'projects', name: 'Proyectos', icon: 'folder-outline' },
    { id: 'exams', name: 'Exámenes', icon: 'school-outline' },
    { id: 'class', name: 'Clases', icon: 'people-outline' },
  ];

  const renderActiveSection = () => {
    const commonProps = {
      selectedDate,
      onDateSelect,
      events,
      tasks,
      getAllEventsForDate,
      getTasksForDate,
      onAddTask,
      onToggleTask,
      onDeleteTask,
      onAddEvent,
      onEditEvent,
      onDeleteEvent,
      user: user, // Pasar user directamente
      onUpdateSection,
      theme: currentTheme,
    };

    switch (activeSection) {
      case 'timetable':
        return <TimetableSection {...commonProps} />;
      case 'todo':
        return <TodoSection {...commonProps} />;
      case 'projects':
        return <ProjectsSection {...commonProps} />;
      case 'exams':
        return <ExamsSection {...commonProps} />;
      case 'class':
        return <ClassSection {...commonProps} />;
      default:
        return (
          <View style={schoolSectionsStyles.defaultSection}>
            <Text style={[schoolSectionsStyles.defaultText, { color: themeColors.text }]}>
              Elige una opción del menú para comenzar
            </Text>
          </View>
        );
    }
  };

  return (
    <View style={[schoolSectionsStyles.container, { backgroundColor: themeColors.background }]}>
      <SubsectionTabs
        sections={sections}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        theme="ocean"
        size="medium"
        showIcons={true}
        showLabels={true}
      />
      
      <ScrollView style={schoolSectionsStyles.content} showsVerticalScrollIndicator={false}>
        {renderActiveSection()}
      </ScrollView>
    </View>
  );
};

export default SchoolSections;
