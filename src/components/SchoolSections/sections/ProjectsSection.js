import React from 'react';
import { View, Text } from 'react-native';
import { SectionHeader } from '../../shared';
import { useTheme } from '../../shared/hooks/useTheme';
import { projectsSectionStyles } from '../styles/projectsSectionStyles';

const ProjectsSection = ({ user, theme }) => {
  const { getThemeColors } = useTheme();
  const themeColors = getThemeColors();

  return (
    <View style={projectsSectionStyles.container}>
      <SectionHeader
        title="Proyectos Grupales"
        subtitle="Colabora en proyectos académicos"
        image={require('../../../../android/app/src/main/assets/escuela.png')}
        theme={theme}
        size="medium"
      />
      
      <View style={[projectsSectionStyles.content, { backgroundColor: themeColors.background }]}>
        <Text style={[projectsSectionStyles.text, { color: themeColors.text }]}>
          Sección de proyectos grupales en desarrollo...
        </Text>
      </View>
    </View>
  );
};

export default ProjectsSection;
