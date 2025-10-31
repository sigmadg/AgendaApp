import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { personalStyles } from '../styles/personalStyles';

const SettingsSection = ({
  activeSections,
  onToggleSection,
  onClearSection,
}) => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoSync, setAutoSync] = useState(true);

  const handleClearSection = (sectionId) => {
    Alert.alert(
      'Limpiar Sección',
      `¿Estás seguro de que quieres limpiar todos los datos de "${sectionId}"? Esta acción no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Limpiar', 
          style: 'destructive', 
          onPress: () => {
            onClearSection(sectionId);
            Alert.alert('Éxito', 'Sección limpiada correctamente');
          }
        }
      ]
    );
  };

  const availableSections = [
    { id: 'personal', name: 'Mi Perfil', icon: 'person-outline', color: '#007AFF' },
    { id: 'work', name: 'Trabajo', icon: 'briefcase-outline', color: '#FF6B6B' },
    { id: 'school', name: 'Escuela', icon: 'school-outline', color: '#4ECDC4' },
    { id: 'health', name: 'Salud', icon: 'medical-outline', color: '#45B7D1' },
    { id: 'finance', name: 'Finanzas', icon: 'wallet-outline', color: '#4CAF50' },
    { id: 'habits', name: 'Habit Tracker', icon: 'checkmark-circle-outline', color: '#9C27B0' },
    { id: 'events', name: 'Eventos', icon: 'calendar-outline', color: '#E91E63' },
    { id: 'languages', name: 'Idiomas', icon: 'language-outline', color: '#FFEAA7' },
    { id: 'menstrual', name: 'Calendario Menstrual', icon: 'flower-outline', color: '#DDA0DD' },
    { id: 'travel', name: 'Viajes', icon: 'airplane-outline', color: '#FF9F43' },
    { id: 'pets', name: 'Mascotas', icon: 'paw-outline', color: '#FF6B9D' },
    { id: 'selfcare', name: 'Cuidado Personal', icon: 'heart-outline', color: '#E91E63' },
  ];

  return (
    <View style={personalStyles.section}>
      <View style={personalStyles.sectionHeader}>
        <View style={personalStyles.headerDecoration}>
          <Icon name="settings" size={20} color="#4A7C59" />
        </View>
        <View style={personalStyles.headerContent}>
          <Text style={personalStyles.sectionTitle}>Configuración</Text>
          <Text style={personalStyles.sectionSubtitle}>
            Personaliza tu experiencia
          </Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Configuración General */}
        <View style={personalStyles.settingsGroup}>
          <Text style={personalStyles.settingsGroupTitle}>General</Text>
          
          <View style={personalStyles.settingItem}>
            <View style={personalStyles.settingInfo}>
              <Text style={personalStyles.settingTitle}>Notificaciones</Text>
              <Text style={personalStyles.settingDescription}>
                Recibir notificaciones de eventos y tareas
              </Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#E8F0E3', true: '#4A7C59' }}
              thumbColor={notifications ? '#FFFFFF' : '#4A6741'}
            />
          </View>

          <View style={personalStyles.settingItem}>
            <View style={personalStyles.settingInfo}>
              <Text style={personalStyles.settingTitle}>Modo Oscuro</Text>
              <Text style={personalStyles.settingDescription}>
                Cambiar a tema oscuro
              </Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: '#E8F0E3', true: '#4A7C59' }}
              thumbColor={darkMode ? '#FFFFFF' : '#4A6741'}
            />
          </View>

          <View style={personalStyles.settingItem}>
            <View style={personalStyles.settingInfo}>
              <Text style={personalStyles.settingTitle}>Sincronización Automática</Text>
              <Text style={personalStyles.settingDescription}>
                Sincronizar datos automáticamente
              </Text>
            </View>
            <Switch
              value={autoSync}
              onValueChange={setAutoSync}
              trackColor={{ false: '#E8F0E3', true: '#4A7C59' }}
              thumbColor={autoSync ? '#FFFFFF' : '#4A6741'}
            />
          </View>
        </View>

        {/* Secciones Activas */}
        <View style={personalStyles.settingsGroup}>
          <Text style={personalStyles.settingsGroupTitle}>Secciones Activas</Text>
          
          {availableSections.map((section) => (
            <View key={section.id} style={personalStyles.settingItem}>
              <View style={personalStyles.settingInfo}>
                <View style={personalStyles.settingHeader}>
                  <Icon name={section.icon} size={20} color={section.color} />
                  <Text style={personalStyles.settingTitle}>{section.name}</Text>
                </View>
                <Text style={personalStyles.settingDescription}>
                  {activeSections.includes(section.id) ? 'Activa' : 'Inactiva'}
                </Text>
              </View>
              <View style={personalStyles.settingActions}>
                <Switch
                  value={activeSections.includes(section.id)}
                  onValueChange={() => onToggleSection(section.id)}
                  trackColor={{ false: '#E8F0E3', true: '#4A7C59' }}
                  thumbColor={activeSections.includes(section.id) ? '#FFFFFF' : '#4A6741'}
                />
                {activeSections.includes(section.id) && (
                  <TouchableOpacity
                    style={personalStyles.clearButton}
                    onPress={() => handleClearSection(section.id)}
                  >
                    <Icon name="trash-outline" size={16} color="#E53E3E" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Información de la App */}
        <View style={personalStyles.settingsGroup}>
          <Text style={personalStyles.settingsGroupTitle}>Información</Text>
          
          <View style={personalStyles.settingItem}>
            <View style={personalStyles.settingInfo}>
              <Text style={personalStyles.settingTitle}>Versión</Text>
              <Text style={personalStyles.settingDescription}>1.0.0</Text>
            </View>
            <Icon name="information-circle-outline" size={20} color="#4A6741" />
          </View>

          <TouchableOpacity style={personalStyles.settingItem}>
            <View style={personalStyles.settingInfo}>
              <Text style={personalStyles.settingTitle}>Política de Privacidad</Text>
              <Text style={personalStyles.settingDescription}>
                Cómo protegemos tu información
              </Text>
            </View>
            <Icon name="chevron-forward" size={20} color="#4A6741" />
          </TouchableOpacity>

          <TouchableOpacity style={personalStyles.settingItem}>
            <View style={personalStyles.settingInfo}>
              <Text style={personalStyles.settingTitle}>Términos de Servicio</Text>
              <Text style={personalStyles.settingDescription}>
                Condiciones de uso de la aplicación
              </Text>
            </View>
            <Icon name="chevron-forward" size={20} color="#4A6741" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default SettingsSection;
