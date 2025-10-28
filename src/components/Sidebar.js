import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors, typography, spacing, borderRadius, shadows } from '../styles/globalStyles';
import { CuteTitle, CuteText, CuteElement } from './CuteElements';
// import { DecorativeIcons, AnimatedDecorativeIcons, GradientDecorativeIcons } from './DecorativeIcons';

const CATEGORIES = [
  {
    id: 'personal',
    name: 'Mi Perfil',
    icon: 'person-outline',
    color: colors.primary,
    description: 'Eventos personales y generales',
    cuteIcon: 'heart'
  },
  {
    id: 'work',
    name: 'Trabajo',
    icon: 'briefcase-outline',
    color: colors.coral,
    description: 'Reuniones y actividades laborales',
    cuteIcon: 'star'
  },
  {
    id: 'school',
    name: 'Escuela',
    icon: 'school-outline',
    color: colors.secondary,
    description: 'Clases y actividades académicas',
    cuteIcon: 'sparkle'
  },
  {
    id: 'health',
    name: 'Salud',
    icon: 'medical-outline',
    color: colors.mint,
    description: 'Alimentación, ejercicio y bienestar',
    cuteIcon: 'flower'
  },
  {
    id: 'finance',
    name: 'Finanzas',
    icon: 'wallet-outline',
    color: colors.success,
    description: 'Gestión financiera y contabilidad personal',
    cuteIcon: 'rainbow'
  },
  {
    id: 'habits',
    name: 'Habit Tracker',
    icon: 'checkmark-circle-outline',
    color: colors.pink,
    description: 'Seguimiento de hábitos y rutinas',
    cuteIcon: 'butterfly'
  },
  {
    id: 'events',
    name: 'Eventos',
    icon: 'calendar-outline',
    color: colors.primary,
    description: 'Cumpleaños, organización y recordatorios',
    cuteIcon: 'sun'
  },
  {
    id: 'languages',
    name: 'Idiomas',
    icon: 'language-outline',
    color: colors.accent,
    description: 'Clases y práctica de idiomas',
    cuteIcon: 'moon'
  },
  {
    id: 'menstrual',
    name: 'Calendario Menstrual',
    icon: 'flower-outline',
    color: colors.pink,
    description: 'Seguimiento del ciclo menstrual',
    cuteIcon: 'flower'
  },
  {
    id: 'travel',
    name: 'Viajes',
    icon: 'airplane-outline',
    color: colors.coral,
    description: 'Planificación de viajes y tours',
    cuteIcon: 'cloud'
  },
  {
    id: 'pets',
    name: 'Mascotas',
    icon: 'paw-outline',
    color: colors.primary,
    description: 'Cuidado y planificación de mascotas',
    cuteIcon: 'heart'
  },
  {
    id: 'selfcare',
    name: 'Cuidado Personal',
    icon: 'heart-outline',
    color: colors.pink,
    description: 'Bienestar y autocuidado personal',
    cuteIcon: 'heart'
  },
  {
    id: 'reading',
    name: 'Lectura',
    icon: 'book-outline',
    color: colors.info,
    description: 'Diario de lectura y seguimiento de libros',
    cuteIcon: 'star'
  },
  {
    id: 'movies',
    name: 'Películas',
    icon: 'film-outline',
    color: colors.warning,
    description: 'Diario de películas y seguimiento de sagas',
    cuteIcon: 'sparkle'
  }
];

const Sidebar = ({ visible, onClose, selectedCategory, onCategorySelect, activeSections, onLogout }) => {
  console.log('Sidebar renderizado, visible:', visible, 'selectedCategory:', selectedCategory);
  if (!visible) {
    console.log('Sidebar no visible, no renderizando');
    return null;
  }

  // Mostrar todas las categorías por ahora
  const filteredCategories = CATEGORIES;

  console.log('Renderizando sidebar con overlay');
  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />
      <View style={styles.sidebar}>
        {/* Iconos decorativos removidos para evitar conflictos */}
        
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.titleContainer}>
              <CuteElement type="sparkle" size={20} color={colors.primary} />
              <CuteTitle style={styles.title}>Categorías</CuteTitle>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="close" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
          <CuteText style={styles.subtitle}>Elige tu área de enfoque</CuteText>
        </View>

        <ScrollView 
          style={styles.categoriesContainer} 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {filteredCategories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryItem,
                selectedCategory === category.id && styles.selectedCategory
              ]}
              onPress={() => {
                onCategorySelect(category.id);
                onClose();
              }}
              activeOpacity={0.7}
            >
              <View style={styles.categoryContent}>
                <View style={[styles.iconContainer, { backgroundColor: category.color }]}>
                  <Icon name={category.icon} size={24} color={colors.surface} />
                </View>
                <View style={styles.categoryInfo}>
                  <CuteText style={[
                    styles.categoryName,
                    selectedCategory === category.id && styles.selectedCategoryName
                  ]}>
                    {category.name}
                  </CuteText>
                  <CuteText style={styles.categoryDescription}>
                    {category.description}
                  </CuteText>
                </View>
                {selectedCategory === category.id && (
                  <View style={styles.selectedIndicator}>
                    <CuteElement type={category.cuteIcon} size={20} color={category.color} />
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.footer}>
          <View style={styles.footerInfo}>
            <CuteElement type="sparkle" size={16} />
            <CuteText style={styles.footerText}>
              Cada categoría tiene su propia agenda
            </CuteText>
          </View>
          
          {/* Botón de Cerrar Sesión */}
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => {
              onLogout();
              onClose();
            }}
            activeOpacity={0.7}
          >
            <View style={styles.logoutButtonContent}>
              <View style={styles.logoutIconContainer}>
                <Icon name="log-out-outline" size={24} color="#FFFFFF" />
              </View>
              <View style={styles.logoutTextContainer}>
                <CuteText style={styles.logoutButtonText}>Cerrar Sesión</CuteText>
                <CuteText style={styles.logoutButtonSubtext}>Salir de tu cuenta</CuteText>
              </View>
              <View style={styles.logoutArrowContainer}>
                <Icon name="arrow-forward" size={20} color="#FFFFFF" />
              </View>
            </View>
          </TouchableOpacity>
        </View>
        
        {/* Iconos decorativos removidos para evitar conflictos */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    flexDirection: 'row',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sidebar: {
    width: 340,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: borderRadius.xl,
    borderBottomLeftRadius: borderRadius.xl,
    ...shadows.xl,
  },
  header: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
    backgroundColor: '#F8F9FA',
    borderTopLeftRadius: borderRadius.xl,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: typography.h4,
    fontWeight: typography.bold,
    color: '#212529',
    marginLeft: spacing.sm,
    lineHeight: typography.lineHeight.tight * typography.h4,
    letterSpacing: typography.letterSpacing.tight,
  },
  subtitle: {
    fontSize: typography.body,
    color: '#6C757D',
    lineHeight: typography.lineHeight.comfortable * typography.body,
    letterSpacing: typography.letterSpacing.normal,
  },
  closeButton: {
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DEE2E6',
    ...shadows.sm,
  },
  categoriesContainer: {
    flex: 1,
    padding: spacing.lg,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  categoryItem: {
    marginBottom: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#F1F3F4',
    ...shadows.sm,
  },
  selectedCategory: {
    backgroundColor: '#F8F9FA',
    borderColor: colors.primary,
    ...shadows.md,
  },
  categoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
    ...shadows.sm,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: typography.h6,
    fontWeight: typography.semiBold,
    color: '#212529',
    marginBottom: spacing.xs,
    lineHeight: typography.lineHeight.tight * typography.h6,
    letterSpacing: typography.letterSpacing.tight,
  },
  selectedCategoryName: {
    color: colors.primary,
  },
  categoryDescription: {
    fontSize: typography.caption,
    color: '#6C757D',
    lineHeight: typography.lineHeight.normal * typography.caption,
    letterSpacing: typography.letterSpacing.normal,
  },
  selectedIndicator: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
    backgroundColor: '#F8F9FA',
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
  },
  footerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    fontSize: typography.caption,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
    flex: 1,
    lineHeight: typography.lineHeight.normal * typography.caption,
    letterSpacing: typography.letterSpacing.normal,
  },
  
  // Estilos para el botón de cerrar sesión
  logoutButton: {
    backgroundColor: '#DC3545',
    borderRadius: borderRadius.lg,
    marginTop: spacing.md,
    ...shadows.md,
  },
  logoutButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  logoutIconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  logoutTextContainer: {
    flex: 1,
  },
  logoutButtonText: {
    fontSize: typography.h6,
    fontWeight: typography.semiBold,
    color: '#FFFFFF',
    marginBottom: spacing.xs,
  },
  logoutButtonSubtext: {
    fontSize: typography.caption,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  logoutArrowContainer: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // decorativeBackground y gradientBackground removidos para evitar conflictos
});

export default Sidebar;
