import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { personalStyles } from '../styles/personalStyles';

const ProfileSection = ({
  user,
  onUpdateProfile,
  onLogout,
}) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [editProfile, setEditProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
  });

  const handleUpdateProfile = () => {
    if (editProfile.name && editProfile.email) {
      onUpdateProfile(editProfile);
      setShowEditModal(false);
      Alert.alert('Éxito', 'Perfil actualizado correctamente');
    } else {
      Alert.alert('Error', 'Por favor completa los campos obligatorios');
    }
  };

  const closeModal = () => {
    setShowEditModal(false);
    setEditProfile({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      bio: user?.bio || '',
    });
  };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Cerrar Sesión', style: 'destructive', onPress: onLogout }
      ]
    );
  };

  return (
    <View style={personalStyles.section}>
      <View style={personalStyles.sectionHeader}>
        <View style={personalStyles.headerDecoration}>
          <Icon name="person" size={20} color="#4A7C59" />
        </View>
        <View style={personalStyles.headerContent}>
          <Text style={personalStyles.sectionTitle}>Mi Perfil</Text>
          <Text style={personalStyles.sectionSubtitle}>
            Gestiona tu información personal
          </Text>
        </View>
        <TouchableOpacity
          style={personalStyles.addButton}
          onPress={() => setShowEditModal(true)}
        >
          <Icon name="create" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={personalStyles.profileCard}>
        <View style={personalStyles.profileAvatar}>
          {user?.avatar ? (
            <Image source={{ uri: user.avatar }} style={personalStyles.avatarImage} />
          ) : (
            <Icon name="person" size={40} color="#FFFFFF" />
          )}
        </View>
        <Text style={personalStyles.profileName}>{user?.name || 'Usuario'}</Text>
        <Text style={personalStyles.profileEmail}>{user?.email || 'email@ejemplo.com'}</Text>
        
        {(user?.phone || user?.provider) && (
          <View style={personalStyles.profileInfo}>
            <Icon name="call" size={16} color="#4A6741" />
            <Text style={personalStyles.profileInfoText}>{user?.phone || user?.provider || 'Información adicional'}</Text>
          </View>
        )}
        
        {(user?.bio || user?.loginTime) && (
          <View style={personalStyles.profileBio}>
            <Text style={personalStyles.profileBioText}>{user?.bio || `Último acceso: ${new Date(user?.loginTime).toLocaleDateString()}`}</Text>
          </View>
        )}

        <View style={personalStyles.profileActions}>
          <TouchableOpacity
            style={[personalStyles.button, { backgroundColor: '#4A7C59' }]}
            onPress={() => setShowEditModal(true)}
          >
            <Icon name="create" size={16} color="#FFFFFF" />
            <Text style={personalStyles.buttonText}> Editar Perfil</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[personalStyles.button, { backgroundColor: '#E53E3E' }]}
            onPress={handleLogout}
          >
            <Icon name="log-out" size={16} color="#FFFFFF" />
            <Text style={personalStyles.buttonText}> Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={showEditModal}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={personalStyles.modalOverlay}>
          <View style={personalStyles.modalContainer}>
            <View style={personalStyles.modalHeader}>
              <Text style={personalStyles.modalTitle}>Editar Perfil</Text>
              <TouchableOpacity onPress={closeModal}>
                <Icon name="close" size={24} color="#4A6741" />
              </TouchableOpacity>
            </View>
            <ScrollView style={personalStyles.modalContent}>
              <TextInput
                style={personalStyles.input}
                placeholder="Nombre completo"
                value={editProfile.name}
                onChangeText={(text) => setEditProfile({ ...editProfile, name: text })}
              />
              <TextInput
                style={personalStyles.input}
                placeholder="Correo electrónico"
                value={editProfile.email}
                onChangeText={(text) => setEditProfile({ ...editProfile, email: text })}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TextInput
                style={personalStyles.input}
                placeholder="Teléfono (opcional)"
                value={editProfile.phone}
                onChangeText={(text) => setEditProfile({ ...editProfile, phone: text })}
                keyboardType="phone-pad"
              />
              <TextInput
                style={[personalStyles.input, { height: 80, textAlignVertical: 'top' }]}
                placeholder="Biografía (opcional)"
                value={editProfile.bio}
                onChangeText={(text) => setEditProfile({ ...editProfile, bio: text })}
                multiline
              />
            </ScrollView>
            <View style={personalStyles.modalActions}>
              <TouchableOpacity
                style={[personalStyles.modalButton, personalStyles.cancelButton]}
                onPress={closeModal}
              >
                <Text style={personalStyles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[personalStyles.modalButton, personalStyles.saveButton]}
                onPress={handleUpdateProfile}
              >
                <Text style={personalStyles.saveButtonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ProfileSection;
