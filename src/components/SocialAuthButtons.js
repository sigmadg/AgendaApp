import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const SocialAuthButtons = ({ onGoogleLogin, onFacebookLogin, onAppleLogin, onWhatsAppLogin }) => {
  const handleGoogleLogin = async () => {
    try {
      // Simular login con Google (aquí iría la implementación real)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const userData = {
        email: 'usuario@gmail.com',
        name: 'Usuario Google',
        provider: 'google',
        avatar: 'https://via.placeholder.com/100'
      };
      
      onGoogleLogin(userData);
    } catch (error) {
      Alert.alert('Error', 'Error al iniciar sesión con Google');
    }
  };

  const handleFacebookLogin = async () => {
    try {
      // Simular login con Facebook (aquí iría la implementación real)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const userData = {
        email: 'usuario@facebook.com',
        name: 'Usuario Facebook',
        provider: 'facebook',
        avatar: 'https://via.placeholder.com/100'
      };
      
      onFacebookLogin(userData);
    } catch (error) {
      Alert.alert('Error', 'Error al iniciar sesión con Facebook');
    }
  };

  const handleAppleLogin = async () => {
    try {
      // Simular login con Apple (aquí iría la implementación real)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const userData = {
        email: 'usuario@icloud.com',
        name: 'Usuario Apple',
        provider: 'apple',
        avatar: 'https://via.placeholder.com/100'
      };
      
      onAppleLogin(userData);
    } catch (error) {
      Alert.alert('Error', 'Error al iniciar sesión con Apple');
    }
  };

  const handleWhatsAppLogin = async () => {
    try {
      // Simular login con WhatsApp (aquí iría la implementación real)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const userData = {
        email: 'usuario@whatsapp.com',
        name: 'Usuario WhatsApp',
        provider: 'whatsapp',
        avatar: 'https://via.placeholder.com/100'
      };
      
      onWhatsAppLogin(userData);
    } catch (error) {
      Alert.alert('Error', 'Error al iniciar sesión con WhatsApp');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>o continúa con</Text>
        <View style={styles.dividerLine} />
      </View>

      <View style={styles.socialButtonsContainer}>
        <TouchableOpacity
          style={[styles.socialButton, styles.googleButton]}
          onPress={handleGoogleLogin}
          activeOpacity={0.8}
        >
          <Icon name="logo-google" size={24} color="#ffb3ba" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.socialButton, styles.facebookButton]}
          onPress={handleFacebookLogin}
          activeOpacity={0.8}
        >
          <Icon name="logo-facebook" size={24} color="#b3d9ff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.socialButton, styles.appleButton]}
          onPress={handleAppleLogin}
          activeOpacity={0.8}
        >
          <Icon name="logo-apple" size={24} color="#d1b3ff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.socialButton, styles.whatsappButton]}
          onPress={handleWhatsAppLogin}
          activeOpacity={0.8}
        >
          <Icon name="logo-whatsapp" size={24} color="#a8e6cf" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e9ecef',
  },
  dividerText: {
    fontSize: 14,
    color: '#6c757d',
    marginHorizontal: 16,
    fontWeight: '500',
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  socialButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 25,
    marginHorizontal: 4,
    minHeight: 56,
    flexDirection: 'row',
    borderWidth: 2,
    backgroundColor: '#f8f9fa',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  googleButton: {
    borderColor: '#ffb3ba',
  },
  facebookButton: {
    borderColor: '#b3d9ff',
  },
  appleButton: {
    borderColor: '#d1b3ff',
  },
  whatsappButton: {
    borderColor: '#a8e6cf',
  },
});

export default SocialAuthButtons;
