import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const CATEGORIES = [
  {
    id: 'personal',
    name: 'Mi Perfil',
    icon: 'person-outline',
    color: '#007AFF',
    description: 'Eventos personales y generales'
  },
  {
    id: 'work',
    name: 'Trabajo',
    icon: 'briefcase-outline',
    color: '#FF6B6B',
    description: 'Reuniones y actividades laborales'
  },
  {
    id: 'school',
    name: 'Escuela',
    icon: 'school-outline',
    color: '#4ECDC4',
    description: 'Clases y actividades académicas'
  },
  {
    id: 'health',
    name: 'Salud',
    icon: 'medical-outline',
    color: '#45B7D1',
    description: 'Alimentación, ejercicio y bienestar'
  },
  {
    id: 'finance',
    name: 'Finanzas',
    icon: 'wallet-outline',
    color: '#4CAF50',
    description: 'Gestión financiera y contabilidad personal'
  },
  {
    id: 'habits',
    name: 'Habit Tracker',
    icon: 'checkmark-circle-outline',
    color: '#9C27B0',
    description: 'Seguimiento de hábitos y rutinas'
  },
  {
    id: 'events',
    name: 'Eventos',
    icon: 'calendar-outline',
    color: '#E91E63',
    description: 'Cumpleaños, organización y recordatorios'
  },
  {
    id: 'languages',
    name: 'Idiomas',
    icon: 'language-outline',
    color: '#FFEAA7',
    description: 'Clases y práctica de idiomas'
  },
  {
    id: 'menstrual',
    name: 'Calendario Menstrual',
    icon: 'flower-outline',
    color: '#DDA0DD',
    description: 'Seguimiento del ciclo menstrual'
  },
  {
    id: 'travel',
    name: 'Viajes',
    icon: 'airplane-outline',
    color: '#FF9F43',
    description: 'Planificación de viajes y tours'
  },
  {
    id: 'pets',
    name: 'Mascotas',
    icon: 'paw-outline',
    color: '#FF6B9D',
    description: 'Cuidado y planificación de mascotas'
  },
  {
    id: 'selfcare',
    name: 'Cuidado Personal',
    icon: 'heart-outline',
    color: '#E91E63',
    description: 'Bienestar y autocuidado personal'
  },
  {
    id: 'reading',
    name: 'Lectura',
    icon: 'book-outline',
    color: '#3F51B5',
    description: 'Diario de lectura y seguimiento de libros'
  },
  {
    id: 'movies',
    name: 'Películas',
    icon: 'film-outline',
    color: '#FF5722',
    description: 'Diario de películas y seguimiento de sagas'
  }
];

const Sidebar = ({ visible, onClose, selectedCategory, onCategorySelect, activeSections }) => {
  if (!visible) return null;

  // Filtrar categorías basándose en las secciones activas
  const filteredCategories = CATEGORIES.filter(category => 
    activeSections && activeSections[category.id] !== false
  );

  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />
      <View style={styles.sidebar}>
        <View style={styles.header}>
          <Text style={styles.title}>Categorías</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Icon name="close" size={24} color="#6c757d" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.categoriesContainer} showsVerticalScrollIndicator={false}>
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
                  <Icon name={category.icon} size={24} color="#FFFFFF" />
                </View>
                <View style={styles.categoryInfo}>
                  <Text style={[
                    styles.categoryName,
                    selectedCategory === category.id && styles.selectedCategoryName
                  ]}>
                    {category.name}
                  </Text>
                  <Text style={styles.categoryDescription}>
                    {category.description}
                  </Text>
                </View>
                {selectedCategory === category.id && (
                  <Icon name="checkmark-circle" size={20} color={category.color} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.footer}>
          <View style={styles.footerInfo}>
            <Icon name="information-circle-outline" size={16} color="#6c757d" />
            <Text style={styles.footerText}>
              Cada categoría tiene su propia agenda
            </Text>
          </View>
        </View>
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
    zIndex: 1000,
    flexDirection: 'row',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sidebar: {
    width: 320,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {
      width: -2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d4150',
  },
  closeButton: {
    padding: 4,
  },
  categoriesContainer: {
    flex: 1,
    padding: 16,
  },
  categoryItem: {
    marginBottom: 8,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedCategory: {
    backgroundColor: '#e3f2fd',
    borderColor: '#007AFF',
  },
  categoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d4150',
    marginBottom: 4,
  },
  selectedCategoryName: {
    color: '#007AFF',
  },
  categoryDescription: {
    fontSize: 12,
    color: '#6c757d',
    lineHeight: 16,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  footerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#6c757d',
    marginLeft: 8,
    flex: 1,
  },
});

export default Sidebar;
