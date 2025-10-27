import React from 'react';
import { View, Text } from 'react-native';
import { SectionHeader } from '../../shared';
import { useTheme } from '../../shared/hooks/useTheme';
import { examsSectionStyles } from '../styles/examsSectionStyles';

const ExamsSection = ({ user, theme }) => {
  const { getThemeColors } = useTheme();
  const themeColors = getThemeColors();

  return (
    <View style={examsSectionStyles.container}>
      <SectionHeader
        title="Exámenes y Evaluaciones"
        subtitle="Prepara tus exámenes"
        image={require('../../../../android/app/src/main/assets/escuela.png')}
        theme={theme}
        size="medium"
      />
      
      <View style={[examsSectionStyles.content, { backgroundColor: themeColors.background }]}>
        <Text style={[examsSectionStyles.text, { color: themeColors.text }]}>
          Sección de exámenes en desarrollo...
        </Text>
      </View>
    </View>
  );
};

export default ExamsSection;
