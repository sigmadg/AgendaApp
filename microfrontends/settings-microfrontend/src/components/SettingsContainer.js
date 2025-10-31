import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  Switch,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSettings } from '../context/SettingsContext';
import { useTheme } from '../../shared/hooks/useTheme';

const SettingsContainer = ({ theme = 'neutral' }) => {
  const { getThemeColors } = useTheme();
  const themeColors = getThemeColors();
  
  const {
    appSettings,
    userSettings,
    updateAppSettings,
    updateUserSettings,
    resetSettings,
    exportSettings,
    importSettings,
    loading,
    error,
  } = useSettings();

  const [activeTab, setActiveTab] = useState('general');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingSetting, setEditingSetting] = useState(null);
  const [editValue, setEditValue] = useState('');

  const tabs = [
    { id: 'general', name: 'General', icon: 'settings-outline' },
    { id: 'appearance', name: 'Apariencia', icon: 'color-palette-outline' },
    { id: 'notifications', name: 'Notificaciones', icon: 'notifications-outline' },
    { id: 'privacy', name: 'Privacidad', icon: 'shield-outline' },
    { id: 'data', name: 'Datos', icon: 'server-outline' },
  ];

  const handleEditSetting = (setting, value) => {
    setEditingSetting(setting);
    setEditValue(value || '');
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editingSetting) return;

    try {
      if (editingSetting.category === 'app') {
        await updateAppSettings({ [editingSetting.key]: editValue });
      } else {
        await updateUserSettings({ [editingSetting.key]: editValue });
      }
      setShowEditModal(false);
      setEditingSetting(null);
      setEditValue('');
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar la configuración');
    }
  };

  const handleToggleSetting = async (setting) => {
    try {
      if (setting.category === 'app') {
        await updateAppSettings({ [setting.key]: !setting.value });
      } else {
        await updateUserSettings({ [setting.key]: !setting.value });
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar la configuración');
    }
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
          onPress: async () => {
            try {
              await resetSettings();
              Alert.alert('Éxito', 'Configuración restablecida');
            } catch (error) {
              Alert.alert('Error', 'No se pudo restablecer la configuración');
            }
          }
        }
      ]
    );
  };

  const handleExportSettings = async () => {
    try {
      const settings = await exportSettings();
      Alert.alert('Éxito', 'Configuración exportada correctamente');
    } catch (error) {
      Alert.alert('Error', 'No se pudo exportar la configuración');
    }
  };

  const handleImportSettings = () => {
    Alert.alert('Importar Configuración', 'Funcionalidad en desarrollo');
  };

  const renderGeneralSettings = () => (
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
            Configuración General
          </Text>
          
          <View style={{ gap: 12 }}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <Text style={{ color: themeColors.textSecondary }}>Idioma</Text>
              <TouchableOpacity
                onPress={() => handleEditSetting(
                  { key: 'language', category: 'app' },
                  appSettings?.language
                )}
                style={{ flexDirection: 'row', alignItems: 'center' }}
              >
                <Text style={{ color: themeColors.text, marginRight: 8 }}>
                  {appSettings?.language || 'Español'}
                </Text>
                <Icon name="chevron-forward" size={16} color={themeColors.textSecondary} />
              </TouchableOpacity>
            </View>
            
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <Text style={{ color: themeColors.textSecondary }}>Zona Horaria</Text>
              <TouchableOpacity
                onPress={() => handleEditSetting(
                  { key: 'timezone', category: 'app' },
                  appSettings?.timezone
                )}
                style={{ flexDirection: 'row', alignItems: 'center' }}
              >
                <Text style={{ color: themeColors.text, marginRight: 8 }}>
                  {appSettings?.timezone || 'UTC'}
                </Text>
                <Icon name="chevron-forward" size={16} color={themeColors.textSecondary} />
              </TouchableOpacity>
            </View>
            
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <Text style={{ color: themeColors.textSecondary }}>Formato de Fecha</Text>
              <TouchableOpacity
                onPress={() => handleEditSetting(
                  { key: 'dateFormat', category: 'app' },
                  appSettings?.dateFormat
                )}
                style={{ flexDirection: 'row', alignItems: 'center' }}
              >
                <Text style={{ color: themeColors.text, marginRight: 8 }}>
                  {appSettings?.dateFormat || 'DD/MM/YYYY'}
                </Text>
                <Icon name="chevron-forward" size={16} color={themeColors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  const renderAppearanceSettings = () => (
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
            Apariencia
          </Text>
          
          <View style={{ gap: 12 }}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <Text style={{ color: themeColors.textSecondary }}>Tema</Text>
              <TouchableOpacity
                onPress={() => handleEditSetting(
                  { key: 'theme', category: 'user' },
                  userSettings?.theme
                )}
                style={{ flexDirection: 'row', alignItems: 'center' }}
              >
                <Text style={{ color: themeColors.text, marginRight: 8 }}>
                  {userSettings?.theme || 'Sistema'}
                </Text>
                <Icon name="chevron-forward" size={16} color={themeColors.textSecondary} />
              </TouchableOpacity>
            </View>
            
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <Text style={{ color: themeColors.textSecondary }}>Tamaño de Fuente</Text>
              <TouchableOpacity
                onPress={() => handleEditSetting(
                  { key: 'fontSize', category: 'user' },
                  userSettings?.fontSize
                )}
                style={{ flexDirection: 'row', alignItems: 'center' }}
              >
                <Text style={{ color: themeColors.text, marginRight: 8 }}>
                  {userSettings?.fontSize || 'Mediano'}
                </Text>
                <Icon name="chevron-forward" size={16} color={themeColors.textSecondary} />
              </TouchableOpacity>
            </View>
            
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <Text style={{ color: themeColors.textSecondary }}>Animaciones</Text>
              <Switch
                value={userSettings?.animations || true}
                onValueChange={() => handleToggleSetting({
                  key: 'animations',
                  category: 'user',
                  value: userSettings?.animations
                })}
                trackColor={{ false: '#E5E7EB', true: themeColors.primary }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  const renderNotificationSettings = () => (
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
              <Switch
                value={userSettings?.notifications?.push || true}
                onValueChange={() => handleToggleSetting({
                  key: 'notifications.push',
                  category: 'user',
                  value: userSettings?.notifications?.push
                })}
                trackColor={{ false: '#E5E7EB', true: themeColors.primary }}
                thumbColor="#FFFFFF"
              />
            </View>
            
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <Text style={{ color: themeColors.textSecondary }}>Email</Text>
              <Switch
                value={userSettings?.notifications?.email || true}
                onValueChange={() => handleToggleSetting({
                  key: 'notifications.email',
                  category: 'user',
                  value: userSettings?.notifications?.email
                })}
                trackColor={{ false: '#E5E7EB', true: themeColors.primary }}
                thumbColor="#FFFFFF"
              />
            </View>
            
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <Text style={{ color: themeColors.textSecondary }}>SMS</Text>
              <Switch
                value={userSettings?.notifications?.sms || false}
                onValueChange={() => handleToggleSetting({
                  key: 'notifications.sms',
                  category: 'user',
                  value: userSettings?.notifications?.sms
                })}
                trackColor={{ false: '#E5E7EB', true: themeColors.primary }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  const renderPrivacySettings = () => (
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
            Privacidad
          </Text>
          
          <View style={{ gap: 12 }}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <Text style={{ color: themeColors.textSecondary }}>Perfil Público</Text>
              <Switch
                value={userSettings?.privacy?.publicProfile || true}
                onValueChange={() => handleToggleSetting({
                  key: 'privacy.publicProfile',
                  category: 'user',
                  value: userSettings?.privacy?.publicProfile
                })}
                trackColor={{ false: '#E5E7EB', true: themeColors.primary }}
                thumbColor="#FFFFFF"
              />
            </View>
            
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <Text style={{ color: themeColors.textSecondary }}>Mostrar Email</Text>
              <Switch
                value={userSettings?.privacy?.showEmail || false}
                onValueChange={() => handleToggleSetting({
                  key: 'privacy.showEmail',
                  category: 'user',
                  value: userSettings?.privacy?.showEmail
                })}
                trackColor={{ false: '#E5E7EB', true: themeColors.primary }}
                thumbColor="#FFFFFF"
              />
            </View>
            
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <Text style={{ color: themeColors.textSecondary }}>Mostrar Teléfono</Text>
              <Switch
                value={userSettings?.privacy?.showPhone || false}
                onValueChange={() => handleToggleSetting({
                  key: 'privacy.showPhone',
                  category: 'user',
                  value: userSettings?.privacy?.showPhone
                })}
                trackColor={{ false: '#E5E7EB', true: themeColors.primary }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  const renderDataSettings = () => (
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
            Gestión de Datos
          </Text>
          
          <View style={{ gap: 12 }}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingVertical: 12,
              }}
              onPress={handleExportSettings}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon name="download-outline" size={20} color={themeColors.primary} />
                <Text style={{ color: themeColors.text, marginLeft: 12 }}>
                  Exportar Configuración
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
              onPress={handleImportSettings}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon name="cloud-upload-outline" size={20} color={themeColors.primary} />
                <Text style={{ color: themeColors.text, marginLeft: 12 }}>
                  Importar Configuración
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
              onPress={handleResetSettings}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon name="refresh-outline" size={20} color="#E53E3E" />
                <Text style={{ color: themeColors.text, marginLeft: 12 }}>
                  Restablecer Configuración
                </Text>
              </View>
              <Icon name="chevron-forward" size={16} color={themeColors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'appearance':
        return renderAppearanceSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'privacy':
        return renderPrivacySettings();
      case 'data':
        return renderDataSettings();
      default:
        return renderGeneralSettings();
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
          Configuración
        </Text>
        <Text style={{
          fontSize: 16,
          color: 'rgba(255, 255, 255, 0.9)',
          textAlign: 'center',
        }}>
          Personaliza tu experiencia
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
              Editar {editingSetting?.key}
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
              placeholder={`Ingresa ${editingSetting?.key}`}
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

export default SettingsContainer;
