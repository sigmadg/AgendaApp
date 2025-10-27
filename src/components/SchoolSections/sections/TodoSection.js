import React from 'react';
import { View, Text } from 'react-native';
import { SectionHeader } from '../../shared';
import { useTheme } from '../../shared/hooks/useTheme';
import { todoSectionStyles } from '../styles/todoSectionStyles';

const TodoSection = ({ user, theme }) => {
  const { getThemeColors } = useTheme();
  const themeColors = getThemeColors();

  return (
    <View style={todoSectionStyles.container}>
      <SectionHeader
        title="Tareas Académicas"
        subtitle="Gestiona tus tareas y proyectos"
        image={require('../../../../android/app/src/main/assets/escuela.png')}
        theme={theme}
        size="medium"
      />
      
      <View style={[todoSectionStyles.content, { backgroundColor: themeColors.background }]}>
        <Text style={[todoSectionStyles.text, { color: themeColors.text }]}>
          Sección de tareas académicas en desarrollo...
        </Text>
      </View>
    </View>
  );
};

export default TodoSection;
