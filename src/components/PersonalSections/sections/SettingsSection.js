import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  Switch,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { SectionHeader, Button, Card } from '../../shared';
import { useTheme } from '../../shared/hooks/useTheme';
import { settingsSectionStyles } from '../styles/settingsSectionStyles';

const SettingsSection = ({ 
  user,
  theme 
}) => {
  const { getThemeColors } = useTheme();
  const themeColors = getThemeColors();

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingSetting, setEditingSetting] = useState(null);
  const [editValue, setEditValue] = useState('');

  // Configuraciones de ejemplo
  const [settings, setSettings] = useState({
    notifications: {
      push: true,
      email: true,
      sms: false,
      marketing: false,
    },
    privacy: {
      publicProfile: true,
      showEmail: false,
      showPhone: false,
      showLastSeen: true,
    },
    appearance: {
      theme: 'system',
      fontSize: 'medium',
      animations: true,
      compactMode: false,
    },
    language: 'es',
    timezone: 'UTC',
    dateFormat: 'DD/MM/YYYY',
  });

  const handleEditSetting = (setting, value) => {
    setEditingSetting(setting);
    setEditValue(value || '');
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (!editingSetting) return;

    setSettings(prev => ({
      ...prev,
      [editingSetting.key]: editValue,
    }));

    setShowEditModal(false);
    setEditingSetting(null);
    setEditValue('');
    Alert.alert('Éxito', 'Configuración actualizada correctamente');
  };

  const handleToggleSetting = (category, key) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: !prev[category][key],
      },
    }));
  };

  const handleResetSettings = () => {
    Alert.alert(
      'Restablecer Configuración',
      '¿Estás seguro de que quieres restablecer todas las configuraciones a los valores predeterminados?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Restablecer',
          style: 'destructive',
          onPress: () => {
            setSettings({
              notifications: {
                push: true,
                email: true,
                sms: false,
                marketing: false,
              },
              privacy: {
                publicProfile: true,
                showEmail: false,
                showPhone: false,
                showLastSeen: true,
              },
              appearance: {
                theme: 'system',
                fontSize: 'medium',
                animations: true,
                compactMode: false,
              },
              language: 'es',
              timezone: 'UTC',
              dateFormat: 'DD/MM/YYYY',
            });
            Alert.alert('Éxito', 'Configuración restablecida');
          }
        }
      ]
    );
  };

  const renderNotificationSettings = () => (
    <View style={settingsSectionStyles.sectionContainer}>
      <Text style={[settingsSectionStyles.sectionTitle, { color: themeColors.text }]}>
        Notificaciones
      </Text>
      <View style={settingsSectionStyles.settingsList}>
        <View style={settingsSectionStyles.settingItem}>
          <View style={settingsSectionStyles.settingInfo}>
            <Icon name="notifications-outline" size={20} color={themeColors.primary} />
            <View style={settingsSectionStyles.settingText}>
              <Text style={[settingsSectionStyles.settingTitle, { color: themeColors.text }]}>
                Notificaciones Push
              </Text>
              <Text style={[settingsSectionStyles.settingDescription, { color: themeColors.textSecondary }]}>
                Recibe notificaciones en tu dispositivo
              </Text>
            </View>
          </View>
          <Switch
            value={settings.notifications.push}
            onValueChange={() => handleToggleSetting('notifications', 'push')}
            trackColor={{ false: '#E5E7EB', true: themeColors.primary }}
            thumbColor="#FFFFFF"
          />
        </View>

        <View style={settingsSectionStyles.settingItem}>
          <View style={settingsSectionStyles.settingInfo}>
            <Icon name="mail-outline" size={20} color={themeColors.primary} />
            <View style={settingsSectionStyles.settingText}>
              <Text style={[settingsSectionStyles.settingTitle, { color: themeColors.text }]}>
                Notificaciones por Email
              </Text>
              <Text style={[settingsSectionStyles.settingDescription, { color: themeColors.textSecondary }]}>
                Recibe notificaciones por correo electrónico
              </Text>
            </View>
          </View>
          <Switch
            value={settings.notifications.email}
            onValueChange={() => handleToggleSetting('notifications', 'email')}
            trackColor={{ false: '#E5E7EB', true: themeColors.primary }}
            thumbColor="#FFFFFF"
          />
        </View>

        <View style={settingsSectionStyles.settingItem}>
          <View style={settingsSectionStyles.settingInfo}>
            <Icon name="chatbubble-outline" size={20} color={themeColors.primary} />
            <View style={settingsSectionStyles.settingText}>
              <Text style={[settingsSectionStyles.settingTitle, { color: themeColors.text }]}>
                Notificaciones por SMS
              </Text>
              <Text style={[settingsSectionStyles.settingDescription, { color: themeColors.textSecondary }]}>
                Recibe notificaciones por mensaje de texto
              </Text>
            </View>
          </View>
          <Switch
            value={settings.notifications.sms}
            onValueChange={() => handleToggleSetting('notifications', 'sms')}
            trackColor={{ false: '#E5E7EB', true: themeColors.primary }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>
    </View>
  );

  const renderPrivacySettings = () => (
    <View style={settingsSectionStyles.sectionContainer}>
      <Text style={[settingsSectionStyles.sectionTitle, { color: themeColors.text }]}>
        Privacidad
      </Text>
      <View style={settingsSectionStyles.settingsList}>
        <View style={settingsSectionStyles.settingItem}>
          <View style={settingsSectionStyles.settingInfo}>
            <Icon name="people-outline" size={20} color={themeColors.primary} />
            <View style={settingsSectionStyles.settingText}>
              <Text style={[settingsSectionStyles.settingTitle, { color: themeColors.text }]}>
                Perfil Público
              </Text>
              <Text style={[settingsSectionStyles.settingDescription, { color: themeColors.textSecondary }]}>
                Permite que otros usuarios vean tu perfil
              </Text>
            </View>
          </View>
          <Switch
            value={settings.privacy.publicProfile}
            onValueChange={() => handleToggleSetting('privacy', 'publicProfile')}
            trackColor={{ false: '#E5E7EB', true: themeColors.primary }}
            thumbColor="#FFFFFF"
          />
        </View>

        <View style={settingsSectionStyles.settingItem}>
          <View style={settingsSectionStyles.settingInfo}>
            <Icon name="mail-outline" size={20} color={themeColors.primary} />
            <View style={settingsSectionStyles.settingText}>
              <Text style={[settingsSectionStyles.settingTitle, { color: themeColors.text }]}>
                Mostrar Email
              </Text>
              <Text style={[settingsSectionStyles.settingDescription, { color: themeColors.textSecondary }]}>
                Permite que otros vean tu dirección de email
              </Text>
            </View>
          </View>
          <Switch
            value={settings.privacy.showEmail}
            onValueChange={() => handleToggleSetting('privacy', 'showEmail')}
            trackColor={{ false: '#E5E7EB', true: themeColors.primary }}
            thumbColor="#FFFFFF"
          />
        </View>

        <View style={settingsSectionStyles.settingItem}>
          <View style={settingsSectionStyles.settingInfo}>
            <Icon name="call-outline" size={20} color={themeColors.primary} />
            <View style={settingsSectionStyles.settingText}>
              <Text style={[settingsSectionStyles.settingTitle, { color: themeColors.text }]}>
                Mostrar Teléfono
              </Text>
              <Text style={[settingsSectionStyles.settingDescription, { color: themeColors.textSecondary }]}>
                Permite que otros vean tu número de teléfono
              </Text>
            </View>
          </View>
          <Switch
            value={settings.privacy.showPhone}
            onValueChange={() => handleToggleSetting('privacy', 'showPhone')}
            trackColor={{ false: '#E5E7EB', true: themeColors.primary }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>
    </View>
  );

  const renderAppearanceSettings = () => (
    <View style={settingsSectionStyles.sectionContainer}>
      <Text style={[settingsSectionStyles.sectionTitle, { color: themeColors.text }]}>
        Apariencia
      </Text>
      <View style={settingsSectionStyles.settingsList}>
        <TouchableOpacity
          style={settingsSectionStyles.settingItem}
          onPress={() => handleEditSetting({ key: 'language' }, settings.language)}
        >
          <View style={settingsSectionStyles.settingInfo}>
            <Icon name="language-outline" size={20} color={themeColors.primary} />
            <View style={settingsSectionStyles.settingText}>
              <Text style={[settingsSectionStyles.settingTitle, { color: themeColors.text }]}>
                Idioma
              </Text>
              <Text style={[settingsSectionStyles.settingDescription, { color: themeColors.textSecondary }]}>
                {settings.language === 'es' ? 'Español' : 'English'}
              </Text>
            </View>
          </View>
          <Icon name="chevron-forward" size={20} color={themeColors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={settingsSectionStyles.settingItem}
          onPress={() => handleEditSetting({ key: 'timezone' }, settings.timezone)}
        >
          <View style={settingsSectionStyles.settingInfo}>
            <Icon name="time-outline" size={20} color={themeColors.primary} />
            <View style={settingsSectionStyles.settingText}>
              <Text style={[settingsSectionStyles.settingTitle, { color: themeColors.text }]}>
                Zona Horaria
              </Text>
              <Text style={[settingsSectionStyles.settingDescription, { color: themeColors.textSecondary }]}>
                {settings.timezone}
              </Text>
            </View>
          </View>
          <Icon name="chevron-forward" size={20} color={themeColors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={settingsSectionStyles.settingItem}
          onPress={() => handleEditSetting({ key: 'dateFormat' }, settings.dateFormat)}
        >
          <View style={settingsSectionStyles.settingInfo}>
            <Icon name="calendar-outline" size={20} color={themeColors.primary} />
            <View style={settingsSectionStyles.settingText}>
              <Text style={[settingsSectionStyles.settingTitle, { color: themeColors.text }]}>
                Formato de Fecha
              </Text>
              <Text style={[settingsSectionStyles.settingDescription, { color: themeColors.textSecondary }]}>
                {settings.dateFormat}
              </Text>
            </View>
          </View>
          <Icon name="chevron-forward" size={20} color={themeColors.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={settingsSectionStyles.container}>
      <SectionHeader
        title="Configuración"
        subtitle="Personaliza tu experiencia"
        image={require('../../../../android/app/src/main/assets/mascota.png')}
        theme={theme}
        size="medium"
      />

      <ScrollView style={settingsSectionStyles.content} showsVerticalScrollIndicator={false}>
        {renderNotificationSettings()}
        {renderPrivacySettings()}
        {renderAppearanceSettings()}

        {/* Acciones de configuración */}
        <View style={settingsSectionStyles.actionsContainer}>
          <Button
            title="Restablecer Configuración"
            onPress={handleResetSettings}
            variant="outline"
            size="medium"
            theme={theme}
            icon="refresh-outline"
            style={settingsSectionStyles.actionButton}
          />
          <Button
            title="Exportar Configuración"
            onPress={() => Alert.alert('Info', 'Funcionalidad en desarrollo')}
            variant="outline"
            size="medium"
            theme={theme}
            icon="download-outline"
            style={settingsSectionStyles.actionButton}
          />
        </View>
      </ScrollView>

      {/* Modal para editar configuración */}
      <Modal
        visible={showEditModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={settingsSectionStyles.modalOverlay}>
          <View style={settingsSectionStyles.modalContainer}>
            <View style={settingsSectionStyles.modalHeader}>
              <Text style={settingsSectionStyles.modalTitle}>
                Editar {editingSetting?.key}
              </Text>
              <TouchableOpacity
                onPress={() => setShowEditModal(false)}
                style={settingsSectionStyles.closeButton}
              >
                <Icon name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <View style={settingsSectionStyles.modalContent}>
              <TextInput
                style={settingsSectionStyles.textInput}
                value={editValue}
                onChangeText={setEditValue}
                placeholder={`Ingresa ${editingSetting?.key}`}
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={settingsSectionStyles.modalActions}>
              <Button
                title="Cancelar"
                onPress={() => setShowEditModal(false)}
                variant="outline"
                size="medium"
                theme={theme}
                style={settingsSectionStyles.modalButton}
              />
              <Button
                title="Guardar"
                onPress={handleSaveEdit}
                variant="primary"
                size="medium"
                theme={theme}
                style={settingsSectionStyles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SettingsSection;
