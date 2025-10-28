import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
} from 'react-native';
import { SectionHeader, ElegantSubsectionTabs } from '../shared';
import { useTheme } from '../shared/hooks/useTheme';
import { workSectionsStyles } from './styles/workSectionsStyles';

// Importar subsecciones
import DailyTasksSection from './sections/DailyTasksSection';
import WeeklyTasksSection from './sections/WeeklyTasksSection';
import ProjectsSection from './sections/ProjectsSection';
import GoalsSection from './sections/GoalsSection';
import WorkPlanningSection from './sections/WorkPlanningSection';

const WorkSections = ({ 
  selectedDate, 
  events, 
  onAddEvent, 
  onEditEvent, 
  onDeleteEvent, 
  onUpdateSection, 
  user 
}) => {
  const [activeSection, setActiveSection] = useState('daily');
  const { getThemeColors, currentTheme } = useTheme();

  const sections = [
    { id: 'daily', name: 'Tareas Diarias', icon: 'sunny-outline' },
    { id: 'weekly', name: 'Tareas Semanales', icon: 'leaf-outline' },
    { id: 'projects', name: 'Proyectos', icon: 'folder-outline' },
    { id: 'goals', name: 'Objetivos', icon: 'flower-outline' },
    { id: 'work-planning', name: 'Planificación de Trabajo', icon: 'trending-up-outline' },
  ];

  const themeColors = getThemeColors();

  const renderActiveSection = () => {
    const commonProps = {
      selectedDate,
      events,
      onAddEvent,
      onEditEvent,
      onDeleteEvent,
      onUpdateSection,
      user,
      theme: currentTheme,
    };

    switch (activeSection) {
      case 'daily':
        return <DailyTasksSection {...commonProps} />;
      case 'weekly':
        return <WeeklyTasksSection {...commonProps} />;
      case 'projects':
        return <ProjectsSection {...commonProps} />;
      case 'goals':
        return <GoalsSection {...commonProps} />;
      case 'work-planning':
        return <WorkPlanningSection {...commonProps} />;
      default:
        return (
          <View style={workSectionsStyles.defaultSection}>
            <SectionHeader
              title="Sección de Trabajo"
              subtitle="Gestiona tu trabajo diario"
              image={require('../../../android/app/src/main/assets/trabajo.png')}
              theme={currentTheme}
              size="medium"
            />
            <View style={workSectionsStyles.welcomeCard}>
              <Text style={[workSectionsStyles.welcomeText, { color: themeColors.textSecondary }]}>
                Elige una opción del menú para comenzar
              </Text>
            </View>
          </View>
        );
    }
  };

  return (
    <View style={[workSectionsStyles.container, { backgroundColor: themeColors.background }]}>
      <ElegantSubsectionTabs
        sections={sections}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        theme="desert"
        size="medium"
        showIcons={true}
        showLabels={false}
      />
      
      <ScrollView style={workSectionsStyles.content} showsVerticalScrollIndicator={false}>
        {renderActiveSection()}
      </ScrollView>
    </View>
  );
};

export default WorkSections;
