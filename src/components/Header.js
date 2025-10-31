import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors, typography, spacing, borderRadius, shadows } from '../styles/globalStyles';
import { CuteTitle, CuteText, CuteButton, CuteElement, CuteBadge } from './CuteElements';
// import { DecorativeIcons, AnimatedDecorativeIcons } from './DecorativeIcons';

const Header = ({ onOpenSidebar, selectedCategory, userName = 'Usuario' }) => {
  const getCurrentGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return 'Buenos días';
    } else if (hour < 18) {
      return 'Buenas tardes';
    } else {
      return 'Buenas noches';
    }
  };

  const getCategoryName = (category) => {
    const categoryNames = {
      personal: 'Mi Perfil',
      work: 'Trabajo',
      school: 'Escuela',
      nutrition: 'Alimentación',
      exercise: 'Ejercicio',
      languages: 'Idiomas',
      menstrual: 'Calendario Menstrual'
    };
    return categoryNames[category] || 'Personal';
  };

  const getCategoryIcon = (category) => {
    const categoryIcons = {
      personal: 'person-outline',
      work: 'briefcase-outline',
      school: 'school-outline',
      nutrition: 'restaurant-outline',
      exercise: 'fitness-outline',
      languages: 'language-outline',
      menstrual: 'flower-outline'
    };
    return categoryIcons[category] || 'person-outline';
  };

  const getCategoryColor = (category) => {
    const categoryColors = {
      personal: colors.primary,
      work: colors.coral,
      school: colors.secondary,
      nutrition: colors.mint,
      exercise: colors.lavender,
      languages: colors.accent,
      menstrual: colors.pink
    };
    return categoryColors[category] || colors.primary;
  };

  return (
    <View style={styles.container}>
      {/* Iconos decorativos removidos para evitar conflictos con el sidebar */}
      
      <View style={styles.topSection}>
        <View style={styles.greetingContainer}>
          <CuteText style={styles.greeting}>{getCurrentGreeting()}</CuteText>
          <CuteTitle style={styles.userName}>{userName}</CuteTitle>
        </View>
        
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={styles.menuButton} 
            onPress={() => {
              console.log('Botón del menú presionado');
              onOpenSidebar();
            }}
            activeOpacity={0.7}
          >
            <Icon name="menu" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.categorySection}>
        <View style={styles.categoryInfo}>
          <View style={[styles.categoryIcon, { backgroundColor: getCategoryColor(selectedCategory) }]}>
            <Icon name={getCategoryIcon(selectedCategory)} size={20} color={colors.surface} />
          </View>
          <View style={styles.categoryTextContainer}>
            <CuteText style={styles.categoryLabel}>Categoría activa</CuteText>
            <CuteText style={[styles.categoryName, { color: '#FFFFFF' }]}>
              {getCategoryName(selectedCategory)}
            </CuteText>
          </View>
        </View>
        
        <View style={styles.welcomeContainer}>
          <CuteElement type="sparkle" size={16} />
          <CuteText style={styles.welcomeText}>¡Bienvenido a tu agenda!</CuteText>
        </View>
      </View>
      
      {/* Iconos decorativos removidos para evitar conflictos con el sidebar */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8F9FA', // Gris neutro profesional
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF', // Gris claro para borde
    ...shadows.sm,
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  greetingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  greeting: {
    fontSize: typography.body,
    color: '#6C757D', // Gris profesional
    marginBottom: spacing.xs,
    lineHeight: typography.lineHeight.comfortable * typography.body,
    letterSpacing: typography.letterSpacing.normal,
  },
  userName: {
    fontSize: typography.h3,
    fontWeight: typography.bold,
    color: '#212529', // Negro profesional
    lineHeight: typography.lineHeight.tight * typography.h3,
    letterSpacing: typography.letterSpacing.tight,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  menuButton: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: '#FFFFFF', // Blanco profesional
    borderWidth: 1,
    borderColor: '#DEE2E6', // Gris claro para borde
    ...shadows.sm,
  },
  categorySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
    ...shadows.sm,
  },
  categoryTextContainer: {
    flex: 1,
  },
  categoryLabel: {
    fontSize: typography.caption,
    color: '#6C757D', // Gris profesional
    marginBottom: spacing.xs,
    lineHeight: typography.lineHeight.normal * typography.caption,
    letterSpacing: typography.letterSpacing.normal,
    fontWeight: typography.medium,
  },
  categoryName: {
    fontSize: typography.h6,
    fontWeight: typography.bold,
    lineHeight: typography.lineHeight.normal * typography.h6,
    letterSpacing: typography.letterSpacing.normal,
    color: '#212529', // Negro profesional
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  welcomeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E9ECEF', // Gris claro profesional
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: '#DEE2E6', // Gris claro para borde
    ...shadows.sm,
  },
  welcomeText: {
    fontSize: typography.caption,
    color: '#495057', // Gris medio profesional
    marginLeft: spacing.xs,
    fontWeight: typography.medium,
    lineHeight: typography.lineHeight.normal * typography.caption,
    letterSpacing: typography.letterSpacing.normal,
  },
  // decorativeBackground y animatedBackground removidos para evitar conflictos con el sidebar
});

export default Header;
