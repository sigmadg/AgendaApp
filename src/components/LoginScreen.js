import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import SocialAuthButtons from './SocialAuthButtons';

const LoginScreen = ({ onLogin, onNavigateToRegister, onNavigateToForgotPassword }) => {
  console.log('LoginScreen: Renderizando pantalla de login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSocialLogin = (userData) => {
    onLogin(userData);
  };
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('Error', 'Por favor ingresa un email válido');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simular autenticación (aquí iría la lógica real)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Intentar login con el sistema de autenticación
      const result = await onLogin({ email, password, rememberMe });
      
      if (!result.success) {
        Alert.alert('Error', result.error || 'Credenciales incorrectas');
      }
    } catch (error) {
      Alert.alert('Error', 'Error al iniciar sesión. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.brainContainer}>
              <Icon name="brain" size={50} color="#2c3e50" />
              <Icon name="flash" size={25} color="#e74c3c" style={styles.lightningIcon} />
            </View>
          </View>
          <Text style={styles.title}>Cortexa</Text>
          <Text style={styles.subtitle}>Organiza tu vida de manera inteligente</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Iniciar Sesión</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email</Text>
            <View style={styles.inputWrapper}>
              <Icon name="mail-outline" size={20} color="#6c757d" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                value={email}
                onChangeText={setEmail}
                placeholder="tu@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Contraseña</Text>
            <View style={styles.inputWrapper}>
              <Icon name="lock-closed-outline" size={20} color="#6c757d" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                value={password}
                onChangeText={setPassword}
                placeholder="Tu contraseña"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Icon 
                  name={showPassword ? "eye-outline" : "eye-off-outline"} 
                  size={20} 
                  color="#6c757d" 
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.rememberMeContainer}>
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setRememberMe(!rememberMe)}
            >
              <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                {rememberMe && (
                  <Icon name="checkmark" size={16} color="#ffffff" />
                )}
              </View>
              <Text style={styles.rememberMeText}>Recordarme</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={onNavigateToForgotPassword}
            style={styles.forgotPasswordButton}
          >
            <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Text>
            <View style={styles.loginButtonIcon}>
              <Icon name="arrow-forward" size={16} color="#000000" />
            </View>
          </TouchableOpacity>

          <SocialAuthButtons
            onGoogleLogin={handleSocialLogin}
            onFacebookLogin={handleSocialLogin}
            onAppleLogin={handleSocialLogin}
            onWhatsAppLogin={handleSocialLogin}
          />

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>o</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={styles.registerButton}
            onPress={onNavigateToRegister}
          >
            <Text style={styles.registerButtonText}>Crear cuenta nueva</Text>
            <View style={styles.registerButtonIcon}>
              <Icon name="person-add" size={16} color="#000000" />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Demo: usa demo@agenda.com / demo123
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
    shadowColor: '#2c3e50',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 3,
    borderColor: '#34495e',
  },
  brainContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lightningIcon: {
    position: 'absolute',
    top: -5,
    right: -8,
    transform: [{ rotate: '15deg' }],
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
    textShadowColor: 'rgba(44, 62, 80, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    color: '#7f8c8d',
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 24,
  },
  formContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d4150',
    textAlign: 'center',
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2d4150',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#2d4150',
    paddingVertical: 16,
  },
  eyeIcon: {
    padding: 4,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#2c3e50',
    fontWeight: '500',
  },
  rememberMeContainer: {
    marginBottom: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#a8e6cf',
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: '#a8e6cf',
    borderColor: '#a8e6cf',
  },
  rememberMeText: {
    fontSize: 14,
    color: '#495057',
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: '#f8f9fa',
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: '#a8e6cf',
    shadowColor: '#a8e6cf',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonDisabled: {
    backgroundColor: '#e9ecef',
    borderColor: '#ced4da',
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#495057',
    flex: 1,
    textAlign: 'left',
  },
  loginButtonIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#a8e6cf',
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#a8e6cf',
  },
  dividerText: {
    fontSize: 14,
    color: '#495057',
    marginHorizontal: 16,
    fontWeight: '500',
  },
  registerButton: {
    backgroundColor: '#f8f9fa',
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: '#ffb3ba',
    shadowColor: '#ffb3ba',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  registerButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#495057',
    flex: 1,
    textAlign: 'left',
  },
  registerButtonIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ffb3ba',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    alignItems: 'center',
    marginTop: 30,
  },
  footerText: {
    fontSize: 12,
    color: '#6c757d',
    textAlign: 'center',
  },
});

export default LoginScreen;
