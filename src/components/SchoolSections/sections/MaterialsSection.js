import React from 'react';
import { View, Text } from 'react-native';
import { SectionHeader } from '../../shared';
import { useTheme } from '../../shared/hooks/useTheme';
import { materialsSectionStyles } from '../styles/materialsSectionStyles';

const MaterialsSection = ({ user, theme }) => {
  const { getThemeColors } = useTheme();
  const themeColors = getThemeColors();

  return (
    <View style={materialsSectionStyles.container}>
      <SectionHeader
        title="Materiales del Curso"
        subtitle="Organiza tus materiales de estudio"
        image={require('../../../../android/app/src/main/assets/escuela.png')}
        theme={theme}
        size="medium"
      />
      
      <View style={[materialsSectionStyles.content, { backgroundColor: themeColors.background }]}>
        <Text style={[materialsSectionStyles.text, { color: themeColors.text }]}>
          Sección de materiales en desarrollo...
        </Text>
      </View>
    </View>
  );
};

export default MaterialsSection;
