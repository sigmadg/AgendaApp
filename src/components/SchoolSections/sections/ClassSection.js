import React from 'react';
import { View, Text } from 'react-native';
import { SectionHeader } from '../../shared';
import { useTheme } from '../../shared/hooks/useTheme';
import { classSectionStyles } from '../styles/classSectionStyles';

const ClassSection = ({ user, theme }) => {
  const { getThemeColors } = useTheme();
  const themeColors = getThemeColors();

  return (
    <View style={classSectionStyles.container}>
      <SectionHeader
        title="Resúmenes de Clase"
        subtitle="Revisa tus notas y resúmenes"
        image={require('../../../../android/app/src/main/assets/escuela.png')}
        theme={theme}
        size="medium"
      />
      
      <View style={[classSectionStyles.content, { backgroundColor: themeColors.background }]}>
        <Text style={[classSectionStyles.text, { color: themeColors.text }]}>
          Sección de resúmenes de clase en desarrollo...
        </Text>
      </View>
    </View>
  );
};

export default ClassSection;
