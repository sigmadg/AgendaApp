import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const Header = ({ onOpenSidebar, selectedCategory, userName = 'Usuario', onLogout }) => {
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
      personal: '#007AFF',
      work: '#FF6B6B',
      school: '#4ECDC4',
      nutrition: '#45B7D1',
      exercise: '#96CEB4',
      languages: '#FFEAA7',
      menstrual: '#DDA0DD'
    };
    return categoryColors[category] || '#007AFF';
  };

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <View style={styles.greetingContainer}>
          <Text style={styles.greeting}>{getCurrentGreeting()}</Text>
          <Text style={styles.userName}>{userName}</Text>
        </View>
        
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={styles.logoutButton} 
            onPress={onLogout}
            activeOpacity={0.7}
          >
            <Icon name="log-out-outline" size={24} color="#dc3545" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuButton} 
            onPress={onOpenSidebar}
            activeOpacity={0.7}
          >
            <Icon name="menu" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.categorySection}>
        <View style={styles.categoryInfo}>
          <View style={[styles.categoryIcon, { backgroundColor: getCategoryColor(selectedCategory) }]}>
            <Icon name={getCategoryIcon(selectedCategory)} size={20} color="#FFFFFF" />
          </View>
          <View style={styles.categoryTextContainer}>
            <Text style={styles.categoryLabel}>Categoría activa</Text>
            <Text style={[styles.categoryName, { color: getCategoryColor(selectedCategory) }]}>
              {getCategoryName(selectedCategory)}
            </Text>
          </View>
        </View>
        
        <View style={styles.welcomeContainer}>
          <Icon name="sparkles" size={16} color="#FFD700" />
          <Text style={styles.welcomeText}>¡Bienvenido a tu agenda!</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  greetingContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 2,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d4150',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  logoutButton: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  menuButton: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
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
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryTextContainer: {
    flex: 1,
  },
  categoryLabel: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 2,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
  },
  welcomeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff3cd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ffeaa7',
  },
  welcomeText: {
    fontSize: 12,
    color: '#856404',
    marginLeft: 6,
    fontWeight: '500',
  },
});

export default Header;
