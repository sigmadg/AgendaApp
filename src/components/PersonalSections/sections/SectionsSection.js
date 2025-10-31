import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { SectionHeader, Card } from '../../shared';
import { useTheme } from '../../shared/hooks/useTheme';
import { sectionsSectionStyles } from '../styles/sectionsSectionStyles';

const SectionsSection = ({
  activeSections = {}, // Valor por defecto para evitar undefined
  onToggleSection,
  onClearSection,
  theme
}) => {
  const { getThemeColors } = useTheme();
  const themeColors = getThemeColors();

  // Validación adicional para asegurar que activeSections es un objeto
  const safeActiveSections = typeof activeSections === 'object' && activeSections !== null ? activeSections : {};

  // Definir todas las secciones disponibles
  const allSections = [
    {
      id: 'personal',
      name: 'Mi Perfil',
      icon: 'person-outline',
      description: 'Eventos, tareas y configuración personal',
      color: '#10B981',
      backgroundColor: '#ECFDF5',
      borderColor: '#059669'
    },
    {
      id: 'school',
      name: 'Educación',
      icon: 'school-outline',
      description: 'Horarios, tareas académicas y proyectos',
      color: '#3B82F6',
      backgroundColor: '#EFF6FF',
      borderColor: '#2563EB'
    },
    {
      id: 'work',
      name: 'Trabajo',
      icon: 'briefcase-outline',
      description: 'Tareas diarias, proyectos y metas laborales',
      color: '#F59E0B',
      backgroundColor: '#FFFBEB',
      borderColor: '#D97706'
    },
    {
      id: 'health',
      name: 'Salud',
      icon: 'medical-outline',
      description: 'Fitness, nutrición y bienestar',
      color: '#EF4444',
      backgroundColor: '#FEF2F2',
      borderColor: '#DC2626'
    },
    {
      id: 'finance',
      name: 'Finanzas',
      icon: 'wallet-outline',
      description: 'Presupuestos, gastos e inversiones',
      color: '#8B5CF6',
      backgroundColor: '#F3E8FF',
      borderColor: '#7C3AED'
    },
    {
      id: 'menstrual',
      name: 'Menstrual',
      icon: 'flower-outline',
      description: 'Seguimiento del ciclo menstrual',
      color: '#EC4899',
      backgroundColor: '#FDF2F8',
      borderColor: '#DB2777'
    },
    {
      id: 'language',
      name: 'Idiomas',
      icon: 'language-outline',
      description: 'Aprendizaje y práctica de idiomas',
      color: '#06B6D4',
      backgroundColor: '#ECFEFF',
      borderColor: '#0891B2'
    },
    {
      id: 'travel',
      name: 'Viajes',
      icon: 'airplane-outline',
      description: 'Planificación y recuerdos de viajes',
      color: '#F97316',
      backgroundColor: '#FFF7ED',
      borderColor: '#EA580C'
    },
    {
      id: 'pet',
      name: 'Mascotas',
      icon: 'paw-outline',
      description: 'Cuidado y seguimiento de mascotas',
      color: '#84CC16',
      backgroundColor: '#F0FDF4',
      borderColor: '#65A30D'
    },
    {
      id: 'selfcare',
      name: 'Autocuidado',
      icon: 'heart-outline',
      description: 'Rutinas de bienestar personal',
      color: '#F43F5E',
      backgroundColor: '#FDF2F8',
      borderColor: '#E11D48'
    },
    {
      id: 'habits',
      name: 'Hábitos',
      icon: 'repeat-outline',
      description: 'Seguimiento de hábitos diarios',
      color: '#6366F1',
      backgroundColor: '#EEF2FF',
      borderColor: '#4F46E5'
    },
    {
      id: 'reading',
      name: 'Lectura',
      icon: 'book-outline',
      description: 'Libros y listas de lectura',
      color: '#14B8A6',
      backgroundColor: '#F0FDFA',
      borderColor: '#0D9488'
    },
    {
      id: 'movies',
      name: 'Películas',
      icon: 'film-outline',
      description: 'Listas de películas y series',
      color: '#DC2626',
      backgroundColor: '#FEF2F2',
      borderColor: '#B91C1C'
    }
  ];

  const renderSectionCard = (section) => {
    const isActive = safeActiveSections[section.id] === true;
    
    return (
      <Card
        key={section.id}
        variant="outlined"
        theme={theme}
        style={[
          sectionsSectionStyles.sectionCard,
          { 
            borderColor: isActive ? section.borderColor : themeColors.border,
            backgroundColor: isActive ? section.backgroundColor : themeColors.surface,
            borderWidth: isActive ? 2 : 1,
            shadowColor: isActive ? section.color : '#000',
            shadowOpacity: isActive ? 0.15 : 0.1,
            elevation: isActive ? 6 : 3,
          }
        ]}
      >
        <View style={sectionsSectionStyles.cardContent}>
          <View style={sectionsSectionStyles.sectionInfo}>
            <View style={sectionsSectionStyles.textContainer}>
              <View style={sectionsSectionStyles.titleRow}>
                <Text style={[
                  sectionsSectionStyles.sectionName,
                  { color: themeColors.text }
                ]}>
                  {section.name}
                </Text>
                <View style={sectionsSectionStyles.controlsRow}>
                  <Switch
                    value={isActive}
                    onValueChange={() => onToggleSection(section.id)}
                    trackColor={{
                      false: themeColors.border,
                      true: section.borderColor
                    }}
                    thumbColor={isActive ? '#FFFFFF' : themeColors.textSecondary}
                    style={sectionsSectionStyles.titleSwitch}
                  />
                  {isActive && (
                    <TouchableOpacity
                      style={[
                        sectionsSectionStyles.trashButton,
                        { 
                          backgroundColor: `${section.color}15`,
                          borderColor: `${section.color}30`,
                          shadowColor: section.color,
                        }
                      ]}
                      onPress={() => onClearSection(section.id)}
                      activeOpacity={0.7}
                    >
                      <Icon 
                        name="trash-outline" 
                        size={20} 
                        color={section.color}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
              <Text style={[
                sectionsSectionStyles.sectionDescription,
                { color: themeColors.textSecondary }
              ]}>
                {section.description}
              </Text>
            </View>
          </View>
        </View>
      </Card>
    );
  };

  const activeCount = Object.values(safeActiveSections).filter(Boolean).length;
  const totalCount = allSections.length;

  return (
    <View style={sectionsSectionStyles.container}>
      <SectionHeader
        title="Configuración de Secciones"
        subtitle="Selecciona qué secciones aparecerán en la barra lateral"
        image={require('../../../../android/app/src/main/assets/mascota.png')}
        theme={theme}
        size="medium"
      />

      {/* Resumen de secciones activas */}
      <View style={sectionsSectionStyles.summaryContainer}>
        <View style={[sectionsSectionStyles.summaryCard, sectionsSectionStyles.activeCard]}>
          <View style={[sectionsSectionStyles.cardIconContainer, { backgroundColor: 'rgba(34, 197, 94, 0.15)' }]}>
            <Icon name="checkmark-circle-outline" size={20} color="#16A34A" />
          </View>
          <Text style={[sectionsSectionStyles.cardTitle, { color: '#15803D' }]}>Activas</Text>
          <Text style={[sectionsSectionStyles.cardNumber, { color: '#15803D' }]}>{activeCount}</Text>
          <Text style={[sectionsSectionStyles.cardSubtitle, { color: '#15803D' }]}>secciones</Text>
        </View>
        
        <View style={[sectionsSectionStyles.summaryCard, sectionsSectionStyles.totalCard]}>
          <View style={[sectionsSectionStyles.cardIconContainer, { backgroundColor: 'rgba(99, 102, 241, 0.15)' }]}>
            <Icon name="grid-outline" size={20} color="#4F46E5" />
          </View>
          <Text style={[sectionsSectionStyles.cardTitle, { color: '#3730A3' }]}>Total</Text>
          <Text style={[sectionsSectionStyles.cardNumber, { color: '#3730A3' }]}>{totalCount}</Text>
          <Text style={[sectionsSectionStyles.cardSubtitle, { color: '#3730A3' }]}>secciones</Text>
        </View>
        
        <View style={[sectionsSectionStyles.summaryCard, sectionsSectionStyles.percentageCard]}>
          <View style={[sectionsSectionStyles.cardIconContainer, { backgroundColor: 'rgba(168, 85, 247, 0.15)' }]}>
            <Icon name="trending-up-outline" size={20} color="#9333EA" />
          </View>
          <Text style={[sectionsSectionStyles.cardTitle, { color: '#7C3AED' }]}>Uso</Text>
          <Text style={[sectionsSectionStyles.cardNumber, { color: '#7C3AED' }]}>{Math.round((activeCount / totalCount) * 100)}%</Text>
          <Text style={[sectionsSectionStyles.cardSubtitle, { color: '#7C3AED' }]}>ocupado</Text>
        </View>
      </View>

      <ScrollView 
        style={sectionsSectionStyles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={sectionsSectionStyles.sectionsList}>
          {allSections.map(renderSectionCard)}
        </View>
        
        <View style={sectionsSectionStyles.footer}>
          <Text style={[
            sectionsSectionStyles.footerText,
            { color: themeColors.textSecondary }
          ]}>
            💡 Tip: Puedes activar/desactivar secciones según tus necesidades
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default SectionsSection;
