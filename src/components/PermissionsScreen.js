import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import PermissionsManager from '../utils/PermissionsManager';

const PermissionsScreen = ({ onPermissionsGranted }) => {
  const [isRequesting, setIsRequesting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar permisos primero antes de solicitar
    checkAndRequestPermissions();
  }, []);

  const checkAndRequestPermissions = async () => {
    try {
      // Verificar si ya tiene los permisos esenciales
      const essentialGranted = await PermissionsManager.areEssentialPermissionsGranted();
      
      if (essentialGranted) {
        console.log('Permisos ya concedidos, continuando a la aplicación');
        onPermissionsGranted();
        return;
      }
      
      // Si no tiene permisos, solicitarlos automáticamente
      console.log('Permisos no concedidos, solicitando...');
      await requestEssentialPermissions();
    } catch (error) {
      console.error('Error verificando/solicitando permisos:', error);
      // En caso de error, permitir continuar
      onPermissionsGranted();
    }
  };

  const requestEssentialPermissions = async () => {
    setIsRequesting(true);
    setIsLoading(false);
    
    try {
      // Solicitar permisos esenciales automáticamente
      const essentialPermissions = ['notifications', 'readStorage', 'writeStorage'];
      const results = {};
      
      for (const permission of essentialPermissions) {
        const result = await PermissionsManager.requestPermission(permission);
        results[permission] = result;
        console.log(`Permiso ${permission}: ${result}`);
      }
      
      // Verificar nuevamente si todos los permisos esenciales están concedidos
      const allGranted = await PermissionsManager.areEssentialPermissionsGranted();
      console.log('¿Todos los permisos concedidos después de solicitar?', allGranted);
      
      if (allGranted) {
        console.log('Permisos concedidos exitosamente, continuando a la aplicación');
        onPermissionsGranted();
      } else {
        // Si no todos están concedidos, mostrar opción de abrir configuración
        console.log('Algunos permisos no fueron concedidos, mostrando opciones');
        Alert.alert(
          'Permisos Requeridos',
          'Algunos permisos esenciales no fueron concedidos. ¿Quieres abrir la configuración de la aplicación para habilitarlos manualmente?',
          [
            { text: 'Continuar Sin Permisos', onPress: onPermissionsGranted },
            { text: 'Abrir Configuración', onPress: openAppSettings }
          ]
        );
      }
    } catch (error) {
      console.error('Error solicitando permisos:', error);
      Alert.alert(
        'Error',
        'Hubo un problema al solicitar los permisos. ¿Quieres abrir la configuración manualmente?',
        [
          { text: 'Continuar', onPress: onPermissionsGranted },
          { text: 'Abrir Configuración', onPress: openAppSettings }
        ]
      );
    } finally {
      setIsRequesting(false);
    }
  };

  const openAppSettings = () => {
    Linking.openSettings();
  };

  const handleContinue = () => {
    onPermissionsGranted();
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Icon name="hourglass-outline" size={48} color="#6B7280" />
          <Text style={styles.loadingText}>Verificando permisos...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Icon 
          name="shield-checkmark-outline" 
          size={80} 
          color="#10B981" 
          style={styles.icon} 
        />
        
        <Text style={styles.title}>
          Configurando Permisos
        </Text>
        
        <Text style={styles.description}>
          {isRequesting 
            ? 'Solicitando permisos necesarios...' 
            : 'La aplicación necesita algunos permisos para funcionar correctamente.'
          }
        </Text>

        {isRequesting && (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>
              Por favor, concede los permisos cuando aparezcan las ventanas del sistema
            </Text>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={requestEssentialPermissions}
            disabled={isRequesting}
            activeOpacity={0.8}
          >
            <Icon name="shield-outline" size={24} color="#FFFFFF" />
            <Text style={styles.buttonText}>
              {isRequesting ? 'Solicitando...' : 'Solicitar Permisos'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={openAppSettings}
            activeOpacity={0.8}
          >
            <Icon name="settings-outline" size={24} color="#3B82F6" />
            <Text style={styles.secondaryButtonText}>
              Abrir Configuración
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.continueButton]}
            onPress={handleContinue}
            activeOpacity={0.8}
          >
            <Icon name="arrow-forward-outline" size={24} color="#FFFFFF" />
            <Text style={styles.buttonText}>
              Continuar Sin Permisos
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
    maxWidth: 400,
  },
  loadingContainer: {
    marginBottom: 30,
    padding: 20,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  loadingText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  icon: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 15,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  buttonContainer: {
    width: '100%',
    gap: 15,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 10,
  },
  primaryButton: {
    backgroundColor: '#10B981',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  continueButton: {
    backgroundColor: '#6B7280',
    marginTop: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3B82F6',
  },
});

export default PermissionsScreen;
