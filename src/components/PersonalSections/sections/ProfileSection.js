import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { SectionHeader, Button, Card } from '../../shared';
import { useTheme } from '../../shared/hooks/useTheme';
import { profileSectionStyles } from '../styles/profileSectionStyles';

const ProfileSection = ({ 
  user,
  onUpdateProfile,
  onLogout,
  theme 
}) => {
  const { getThemeColors } = useTheme();
  const themeColors = getThemeColors();

  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    location: user?.location || '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleUpdateProfile = () => {
    if (profileData.name.trim() === '') {
      Alert.alert('Error', 'Por favor ingresa tu nombre');
      return;
    }

    if (profileData.email.trim() === '') {
      Alert.alert('Error', 'Por favor ingresa tu email');
      return;
    }

    onUpdateProfile(profileData);
    setShowEditModal(false);
    Alert.alert('Éxito', 'Perfil actualizado correctamente');
  };

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    // TODO: Implementar cambio de contraseña
    Alert.alert('Éxito', 'Contraseña actualizada correctamente');
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setShowPasswordModal(false);
  };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: onLogout,
        }
      ]
    );
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <View style={profileSectionStyles.container}>
      <SectionHeader
        title="Mi Perfil"
        subtitle="Gestiona tu información personal"
        image={require('../../../../android/app/src/main/assets/mascota.png')}
        theme={theme}
        size="medium"
      />

      {/* Información del perfil */}
      <View style={profileSectionStyles.profileContainer}>
        <View style={profileSectionStyles.avatarContainer}>
          {user?.avatar ? (
            <Image source={{ uri: user.avatar }} style={profileSectionStyles.avatar} />
          ) : (
            <View style={[profileSectionStyles.avatarPlaceholder, { backgroundColor: themeColors.primary }]}>
              <Text style={profileSectionStyles.avatarText}>
                {getInitials(user?.name || 'U')}
              </Text>
            </View>
          )}
        </View>

        <View style={profileSectionStyles.profileInfo}>
          <Text style={[profileSectionStyles.profileName, { color: themeColors.text }]}>
            {user?.name || 'Usuario'}
          </Text>
          <Text style={[profileSectionStyles.profileEmail, { color: themeColors.textSecondary }]}>
            {user?.email || 'usuario@ejemplo.com'}
          </Text>
          {(user?.location || user?.phone) && (
            <View style={profileSectionStyles.locationContainer}>
              <Icon name="location-outline" size={16} color={themeColors.textSecondary} />
              <Text style={[profileSectionStyles.profileLocation, { color: themeColors.textSecondary }]}>
                {user?.location || user?.phone || 'Información adicional'}
              </Text>
            </View>
          )}
        </View>
      </View>


      {/* Acciones del perfil */}
      <View style={profileSectionStyles.actionsContainer}>
        <TouchableOpacity
          style={[profileSectionStyles.actionButton, profileSectionStyles.editButton]}
          onPress={() => setShowEditModal(true)}
          activeOpacity={0.8}
        >
          <View style={[profileSectionStyles.buttonIconContainer, { backgroundColor: '#0EA5E9' }]}>
            <Icon name="create-outline" size={24} color="#FFFFFF" />
          </View>
          <View style={profileSectionStyles.buttonContent}>
            <Text style={profileSectionStyles.buttonTitle}>Editar Perfil</Text>
            <Text style={profileSectionStyles.buttonSubtitle}>Actualiza tu información personal</Text>
          </View>
          <Icon name="chevron-forward" size={20} color="#0EA5E9" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[profileSectionStyles.actionButton, profileSectionStyles.passwordButton]}
          onPress={() => setShowPasswordModal(true)}
          activeOpacity={0.8}
        >
          <View style={[profileSectionStyles.buttonIconContainer, { backgroundColor: '#22C55E' }]}>
            <Icon name="key-outline" size={24} color="#FFFFFF" />
          </View>
          <View style={profileSectionStyles.buttonContent}>
            <Text style={profileSectionStyles.buttonTitle}>Cambiar Contraseña</Text>
            <Text style={profileSectionStyles.buttonSubtitle}>Actualiza tu contraseña de acceso</Text>
          </View>
          <Icon name="chevron-forward" size={20} color="#22C55E" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[profileSectionStyles.actionButton, profileSectionStyles.logoutButton]}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <View style={[profileSectionStyles.buttonIconContainer, { backgroundColor: '#EF4444' }]}>
            <Icon name="log-out-outline" size={24} color="#FFFFFF" />
          </View>
          <View style={profileSectionStyles.buttonContent}>
            <Text style={profileSectionStyles.buttonTitle}>Cerrar Sesión</Text>
            <Text style={profileSectionStyles.buttonSubtitle}>Salir de tu cuenta</Text>
          </View>
          <Icon name="chevron-forward" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>

      {/* Modal para editar perfil */}
      <Modal
        visible={showEditModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={profileSectionStyles.modalOverlay}>
          <View style={profileSectionStyles.modalContainer}>
            <View style={profileSectionStyles.modalHeader}>
              <Text style={profileSectionStyles.modalTitle}>
                Editar Perfil
              </Text>
              <TouchableOpacity
                onPress={() => setShowEditModal(false)}
                style={profileSectionStyles.closeButton}
              >
                <Icon name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={profileSectionStyles.modalContent}>
              <View style={profileSectionStyles.inputGroup}>
                <Text style={profileSectionStyles.inputLabel}>Nombre</Text>
                <TextInput
                  style={profileSectionStyles.textInput}
                  value={profileData.name}
                  onChangeText={(text) => setProfileData(prev => ({ ...prev, name: text }))}
                  placeholder="Ingresa tu nombre"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={profileSectionStyles.inputGroup}>
                <Text style={profileSectionStyles.inputLabel}>Email</Text>
                <TextInput
                  style={profileSectionStyles.textInput}
                  value={profileData.email}
                  onChangeText={(text) => setProfileData(prev => ({ ...prev, email: text }))}
                  placeholder="Ingresa tu email"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                />
              </View>

              <View style={profileSectionStyles.inputGroup}>
                <Text style={profileSectionStyles.inputLabel}>Teléfono</Text>
                <TextInput
                  style={profileSectionStyles.textInput}
                  value={profileData.phone}
                  onChangeText={(text) => setProfileData(prev => ({ ...prev, phone: text }))}
                  placeholder="Ingresa tu teléfono"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="phone-pad"
                />
              </View>

              <View style={profileSectionStyles.inputGroup}>
                <Text style={profileSectionStyles.inputLabel}>Biografía</Text>
                <TextInput
                  style={[profileSectionStyles.textInput, profileSectionStyles.textArea]}
                  value={profileData.bio}
                  onChangeText={(text) => setProfileData(prev => ({ ...prev, bio: text }))}
                  placeholder="Cuéntanos sobre ti"
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={3}
                />
              </View>

              <View style={profileSectionStyles.inputGroup}>
                <Text style={profileSectionStyles.inputLabel}>Ubicación</Text>
                <TextInput
                  style={profileSectionStyles.textInput}
                  value={profileData.location}
                  onChangeText={(text) => setProfileData(prev => ({ ...prev, location: text }))}
                  placeholder="Ingresa tu ubicación"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </ScrollView>

            <View style={profileSectionStyles.modalActions}>
              <Button
                title="Cancelar"
                onPress={() => setShowEditModal(false)}
                variant="outline"
                size="medium"
                theme={theme}
                style={profileSectionStyles.modalButton}
              />
              <Button
                title="Guardar"
                onPress={handleUpdateProfile}
                variant="primary"
                size="medium"
                theme={theme}
                style={profileSectionStyles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal para cambiar contraseña */}
      <Modal
        visible={showPasswordModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPasswordModal(false)}
      >
        <View style={profileSectionStyles.modalOverlay}>
          <View style={profileSectionStyles.modalContainer}>
            <View style={profileSectionStyles.modalHeader}>
              <Text style={profileSectionStyles.modalTitle}>
                Cambiar Contraseña
              </Text>
              <TouchableOpacity
                onPress={() => setShowPasswordModal(false)}
                style={profileSectionStyles.closeButton}
              >
                <Icon name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={profileSectionStyles.modalContent}>
              <View style={profileSectionStyles.inputGroup}>
                <Text style={profileSectionStyles.inputLabel}>Contraseña Actual</Text>
                <TextInput
                  style={profileSectionStyles.textInput}
                  value={passwordData.currentPassword}
                  onChangeText={(text) => setPasswordData(prev => ({ ...prev, currentPassword: text }))}
                  placeholder="Ingresa tu contraseña actual"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry
                />
              </View>

              <View style={profileSectionStyles.inputGroup}>
                <Text style={profileSectionStyles.inputLabel}>Nueva Contraseña</Text>
                <TextInput
                  style={profileSectionStyles.textInput}
                  value={passwordData.newPassword}
                  onChangeText={(text) => setPasswordData(prev => ({ ...prev, newPassword: text }))}
                  placeholder="Ingresa tu nueva contraseña"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry
                />
              </View>

              <View style={profileSectionStyles.inputGroup}>
                <Text style={profileSectionStyles.inputLabel}>Confirmar Contraseña</Text>
                <TextInput
                  style={profileSectionStyles.textInput}
                  value={passwordData.confirmPassword}
                  onChangeText={(text) => setPasswordData(prev => ({ ...prev, confirmPassword: text }))}
                  placeholder="Confirma tu nueva contraseña"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry
                />
              </View>
            </ScrollView>

            <View style={profileSectionStyles.modalActions}>
              <Button
                title="Cancelar"
                onPress={() => setShowPasswordModal(false)}
                variant="outline"
                size="medium"
                theme={theme}
                style={profileSectionStyles.modalButton}
              />
              <Button
                title="Cambiar"
                onPress={handleChangePassword}
                variant="primary"
                size="medium"
                theme={theme}
                style={profileSectionStyles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ProfileSection;
