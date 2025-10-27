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
import { schoolSectionsStyles } from './styles/schoolSectionsStyles';

// Importar subsecciones
import TimetableSection from './sections/TimetableSection';
import TodoSection from './sections/TodoSection';
import ProjectsSection from './sections/ProjectsSection';
import ExamsSection from './sections/ExamsSection';
import MaterialsSection from './sections/MaterialsSection';
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

  // Validar que user existe y tiene userData
  const userData = user?.userData || null;
  
  // Si no hay userData, mostrar mensaje de carga
  if (!userData) {
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
    { id: 'materials', name: 'Materiales', icon: 'book-outline' },
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
      user: userData, // Pasar userData en lugar de user
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
      case 'materials':
        return <MaterialsSection {...commonProps} />;
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
      {/* Barra de navegación personalizada solo con iconos */}
      <View style={[schoolSectionsStyles.navigationBar, { backgroundColor: themeColors.surface }]}>
        {sections.map((section) => (
          <TouchableOpacity
            key={section.id}
            style={[
              schoolSectionsStyles.navTab,
              activeSection === section.id && schoolSectionsStyles.navTabActive
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
      
      <ScrollView style={schoolSectionsStyles.content} showsVerticalScrollIndicator={false}>
        {renderActiveSection()}
      </ScrollView>
    </View>
  );
};

export default SchoolSections;
