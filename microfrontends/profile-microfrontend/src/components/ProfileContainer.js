import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useProfile } from '../context/ProfileContext';
import { useTheme } from '../../shared/hooks/useTheme';

const ProfileContainer = ({ theme = 'neutral' }) => {
  const { getThemeColors } = useTheme();
  const themeColors = getThemeColors();
  
  const {
    userProfile,
    updateProfile,
    updateAvatar,
    updatePreferences,
    updateSettings,
    loading,
    error,
  } = useProfile();

  const [activeTab, setActiveTab] = useState('personal');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState('');

  const tabs = [
    { id: 'personal', name: 'Personal', icon: 'person-outline' },
    { id: 'preferences', name: 'Preferencias', icon: 'settings-outline' },
    { id: 'security', name: 'Seguridad', icon: 'shield-outline' },
    { id: 'notifications', name: 'Notificaciones', icon: 'notifications-outline' },
  ];

  const handleEditField = (field, value) => {
    setEditingField(field);
    setEditValue(value || '');
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editingField) return;

    try {
      await updateProfile({ [editingField]: editValue });
      setShowEditModal(false);
      setEditingField(null);
      setEditValue('');
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el perfil');
    }
  };

  const handleAvatarChange = () => {
    Alert.alert('Cambiar Avatar', 'Funcionalidad en desarrollo');
  };

  const renderPersonalInfo = () => (
    <View style={{ padding: 16 }}>
      <View style={{
        backgroundColor: themeColors.surface,
        borderRadius: 12,
        padding: 20,
        marginBottom: 16,
        alignItems: 'center',
      }}>
        <TouchableOpacity onPress={handleAvatarChange}>
          <View style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: themeColors.primary,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 16,
          }}>
            {userProfile?.avatar ? (
              <Image
                source={{ uri: userProfile.avatar }}
                style={{ width: 100, height: 100, borderRadius: 50 }}
              />
            ) : (
              <Icon name="person" size={50} color="#FFFFFF" />
            )}
          </View>
        </TouchableOpacity>
        
        <Text style={{
          fontSize: 24,
          fontWeight: '700',
          color: themeColors.text,
          marginBottom: 8,
        }}>
          {userProfile?.name || 'Usuario'}
        </Text>
        
        <Text style={{
          fontSize: 16,
          color: themeColors.textSecondary,
          marginBottom: 16,
        }}>
          {userProfile?.email || 'usuario@ejemplo.com'}
        </Text>
        
        <TouchableOpacity
          style={{
            backgroundColor: themeColors.primary,
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 20,
          }}
          onPress={() => handleEditField('name', userProfile?.name)}
        >
          <Text style={{ color: '#FFFFFF', fontWeight: '600' }}>
            Editar Perfil
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ gap: 12 }}>
        <View style={{
          backgroundColor: themeColors.surface,
          borderRadius: 12,
          padding: 16,
        }}>
          <Text style={{
            fontSize: 16,
            fontWeight: '600',
            color: themeColors.text,
            marginBottom: 8,
          }}>
            Información Personal
          </Text>
          
          <View style={{ gap: 12 }}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <Text style={{ color: themeColors.textSecondary }}>Nombre</Text>
              <TouchableOpacity
                onPress={() => handleEditField('name', userProfile?.name)}
                style={{ flexDirection: 'row', alignItems: 'center' }}
              >
                <Text style={{ color: themeColors.text, marginRight: 8 }}>
                  {userProfile?.name || 'No especificado'}
                </Text>
                <Icon name="chevron-forward" size={16} color={themeColors.textSecondary} />
              </TouchableOpacity>
            </View>
            
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <Text style={{ color: themeColors.textSecondary }}>Email</Text>
              <TouchableOpacity
                onPress={() => handleEditField('email', userProfile?.email)}
                style={{ flexDirection: 'row', alignItems: 'center' }}
              >
                <Text style={{ color: themeColors.text, marginRight: 8 }}>
                  {userProfile?.email || 'No especificado'}
                </Text>
                <Icon name="chevron-forward" size={16} color={themeColors.textSecondary} />
              </TouchableOpacity>
            </View>
            
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <Text style={{ color: themeColors.textSecondary }}>Teléfono</Text>
              <TouchableOpacity
                onPress={() => handleEditField('phone', userProfile?.phone)}
                style={{ flexDirection: 'row', alignItems: 'center' }}
              >
                <Text style={{ color: themeColors.text, marginRight: 8 }}>
                  {userProfile?.phone || 'No especificado'}
                </Text>
                <Icon name="chevron-forward" size={16} color={themeColors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  const renderPreferences = () => (
    <View style={{ padding: 16 }}>
      <View style={{ gap: 12 }}>
        <View style={{
          backgroundColor: themeColors.surface,
          borderRadius: 12,
          padding: 16,
        }}>
          <Text style={{
            fontSize: 16,
            fontWeight: '600',
            color: themeColors.text,
            marginBottom: 16,
          }}>
            Preferencias de Tema
          </Text>
          
          <View style={{ gap: 12 }}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <Text style={{ color: themeColors.textSecondary }}>Tema</Text>
              <TouchableOpacity
                onPress={() => handleEditField('theme', userProfile?.preferences?.theme)}
                style={{ flexDirection: 'row', alignItems: 'center' }}
              >
                <Text style={{ color: themeColors.text, marginRight: 8 }}>
                  {userProfile?.preferences?.theme || 'Sistema'}
                </Text>
                <Icon name="chevron-forward" size={16} color={themeColors.textSecondary} />
              </TouchableOpacity>
            </View>
            
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <Text style={{ color: themeColors.textSecondary }}>Idioma</Text>
              <TouchableOpacity
                onPress={() => handleEditField('language', userProfile?.preferences?.language)}
                style={{ flexDirection: 'row', alignItems: 'center' }}
              >
                <Text style={{ color: themeColors.text, marginRight: 8 }}>
                  {userProfile?.preferences?.language || 'Español'}
                </Text>
                <Icon name="chevron-forward" size={16} color={themeColors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  const renderSecurity = () => (
    <View style={{ padding: 16 }}>
      <View style={{ gap: 12 }}>
        <View style={{
          backgroundColor: themeColors.surface,
          borderRadius: 12,
          padding: 16,
        }}>
          <Text style={{
            fontSize: 16,
            fontWeight: '600',
            color: themeColors.text,
            marginBottom: 16,
          }}>
            Seguridad
          </Text>
          
          <View style={{ gap: 12 }}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingVertical: 12,
              }}
              onPress={() => Alert.alert('Cambiar Contraseña', 'Funcionalidad en desarrollo')}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon name="lock-closed-outline" size={20} color={themeColors.primary} />
                <Text style={{ color: themeColors.text, marginLeft: 12 }}>
                  Cambiar Contraseña
                </Text>
              </View>
              <Icon name="chevron-forward" size={16} color={themeColors.textSecondary} />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingVertical: 12,
              }}
              onPress={() => Alert.alert('Autenticación 2FA', 'Funcionalidad en desarrollo')}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon name="shield-checkmark-outline" size={20} color={themeColors.primary} />
                <Text style={{ color: themeColors.text, marginLeft: 12 }}>
                  Autenticación de Dos Factores
                </Text>
              </View>
              <Icon name="chevron-forward" size={16} color={themeColors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  const renderNotifications = () => (
    <View style={{ padding: 16 }}>
      <View style={{ gap: 12 }}>
        <View style={{
          backgroundColor: themeColors.surface,
          borderRadius: 12,
          padding: 16,
        }}>
          <Text style={{
            fontSize: 16,
            fontWeight: '600',
            color: themeColors.text,
            marginBottom: 16,
          }}>
            Notificaciones
          </Text>
          
          <View style={{ gap: 12 }}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <Text style={{ color: themeColors.textSecondary }}>Push</Text>
              <TouchableOpacity
                style={{
                  width: 50,
                  height: 30,
                  borderRadius: 15,
                  backgroundColor: themeColors.primary,
                  justifyContent: 'center',
                  alignItems: 'flex-end',
                  paddingHorizontal: 4,
                }}
              >
                <View style={{
                  width: 22,
                  height: 22,
                  borderRadius: 11,
                  backgroundColor: '#FFFFFF',
                }} />
              </TouchableOpacity>
            </View>
            
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <Text style={{ color: themeColors.textSecondary }}>Email</Text>
              <TouchableOpacity
                style={{
                  width: 50,
                  height: 30,
                  borderRadius: 15,
                  backgroundColor: themeColors.primary,
                  justifyContent: 'center',
                  alignItems: 'flex-end',
                  paddingHorizontal: 4,
                }}
              >
                <View style={{
                  width: 22,
                  height: 22,
                  borderRadius: 11,
                  backgroundColor: '#FFFFFF',
                }} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'personal':
        return renderPersonalInfo();
      case 'preferences':
        return renderPreferences();
      case 'security':
        return renderSecurity();
      case 'notifications':
        return renderNotifications();
      default:
        return renderPersonalInfo();
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: themeColors.background }}>
      {/* Header */}
      <View style={{
        backgroundColor: themeColors.primary,
        padding: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        marginBottom: 20,
      }}>
        <Text style={{
          fontSize: 24,
          fontWeight: '700',
          color: '#FFFFFF',
          textAlign: 'center',
          marginBottom: 8,
        }}>
          Mi Perfil
        </Text>
        <Text style={{
          fontSize: 16,
          color: 'rgba(255, 255, 255, 0.9)',
          textAlign: 'center',
        }}>
          Gestiona tu información personal
        </Text>
      </View>

      {/* Tabs */}
      <View style={{
        flexDirection: 'row',
        marginHorizontal: 16,
        marginBottom: 20,
        backgroundColor: themeColors.surface,
        borderRadius: 12,
        padding: 4,
      }}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={{
              flex: 1,
              padding: 12,
              borderRadius: 8,
              backgroundColor: activeTab === tab.id ? themeColors.primary : 'transparent',
              alignItems: 'center',
            }}
            onPress={() => setActiveTab(tab.id)}
          >
            <Icon 
              name={tab.icon} 
              size={20} 
              color={activeTab === tab.id ? '#FFFFFF' : themeColors.textSecondary} 
            />
            <Text style={{
              color: activeTab === tab.id ? '#FFFFFF' : themeColors.textSecondary,
              fontWeight: '600',
              marginTop: 4,
              fontSize: 12,
            }}>
              {tab.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <ScrollView style={{ flex: 1 }}>
        {renderActiveTab()}
      </ScrollView>

      {/* Edit Modal */}
      <Modal
        visible={showEditModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <View style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 20,
            width: '90%',
            padding: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.25,
            shadowRadius: 20,
            elevation: 10,
          }}>
            <Text style={{
              fontSize: 18,
              fontWeight: '700',
              color: '#212529',
              marginBottom: 16,
              textAlign: 'center',
            }}>
              Editar {editingField}
            </Text>
            
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: '#D1D5DB',
                borderRadius: 8,
                padding: 12,
                fontSize: 16,
                color: '#111827',
                backgroundColor: '#FFFFFF',
                marginBottom: 20,
              }}
              value={editValue}
              onChangeText={setEditValue}
              placeholder={`Ingresa ${editingField}`}
              placeholderTextColor="#9CA3AF"
            />
            
            <View style={{
              flexDirection: 'row',
              gap: 12,
            }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  padding: 12,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: '#D1D5DB',
                  backgroundColor: '#FFFFFF',
                  alignItems: 'center',
                }}
                onPress={() => setShowEditModal(false)}
              >
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: '#374151',
                }}>
                  Cancelar
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={{
                  flex: 1,
                  padding: 12,
                  borderRadius: 8,
                  backgroundColor: themeColors.primary,
                  alignItems: 'center',
                }}
                onPress={handleSaveEdit}
              >
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: '#FFFFFF',
                }}>
                  Guardar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ProfileContainer;
