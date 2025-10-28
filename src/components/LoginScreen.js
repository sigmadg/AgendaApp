import React, { useState, useRef } from 'react';
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
  Image,
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
  
  // Referencias para navegación entre campos
  const passwordInputRef = useRef(null);

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
        {/* Header con gradiente y mascota */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logoBackground}>
              <Image 
                source={require('../assets/images/mascota.png')} 
                style={styles.mascotaImage}
                resizeMode="contain"
              />
            </View>
            <View style={styles.logoGlow} />
          </View>
          <Text style={styles.title}>Cortexa</Text>
          <Text style={styles.subtitle}>Organiza tu vida de manera inteligente</Text>
        </View>

        {/* Formulario mejorado */}
        <View style={styles.formContainer}>
          <View style={styles.formHeader}>
            <Text style={styles.formTitle}>¡Bienvenido de vuelta!</Text>
            <Text style={styles.formSubtitle}>Inicia sesión para continuar</Text>
          </View>
          
          {/* Campo de Email mejorado */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Correo electrónico</Text>
            <View style={[styles.inputWrapper, email && styles.inputWrapperFocused]}>
              <View style={styles.inputIconContainer}>
                <Icon name="mail-outline" size={22} color={email ? "#4F46E5" : "#9CA3AF"} />
              </View>
              <TextInput
                style={styles.textInput}
                value={email}
                onChangeText={setEmail}
                placeholder="tu@email.com"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => {
                  // Enfocar el siguiente campo (contraseña)
                  passwordInputRef.current?.focus();
                }}
                autoFocus={false}
                caretHidden={false}
                contextMenuHidden={false}
                selectTextOnFocus={false}
                textContentType="emailAddress"
              />
            </View>
          </View>

          {/* Campo de Contraseña mejorado */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Contraseña</Text>
            <View style={[styles.inputWrapper, password && styles.inputWrapperFocused]}>
              <View style={styles.inputIconContainer}>
                <Icon name="lock-closed-outline" size={22} color={password ? "#4F46E5" : "#9CA3AF"} />
              </View>
              <TextInput
                ref={passwordInputRef}
                style={styles.textInput}
                value={password}
                onChangeText={setPassword}
                placeholder="Tu contraseña"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
                blurOnSubmit={true}
                onSubmitEditing={handleLogin}
                autoFocus={false}
                caretHidden={false}
                contextMenuHidden={false}
                selectTextOnFocus={false}
                textContentType="password"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Icon 
                  name={showPassword ? "eye-outline" : "eye-off-outline"} 
                  size={22} 
                  color={password ? "#4F46E5" : "#9CA3AF"} 
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Recordarme y Olvidé contraseña */}
          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setRememberMe(!rememberMe)}
            >
              <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                {rememberMe && (
                  <Icon name="checkmark" size={16} color="#FFFFFF" />
                )}
              </View>
              <Text style={styles.rememberMeText}>Recordarme</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onNavigateToForgotPassword}
              style={styles.forgotPasswordButton}
            >
              <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>
          </View>

          {/* Botón de Login mejorado */}
          <TouchableOpacity
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <View style={styles.loginButtonContent}>
              <Text style={styles.loginButtonText}>
                {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Text>
              <View style={styles.loginButtonIcon}>
                <Icon name="arrow-forward" size={20} color="#FFFFFF" />
              </View>
            </View>
            {isLoading && <View style={styles.loadingOverlay} />}
          </TouchableOpacity>

          {/* Botones sociales mejorados */}
          <SocialAuthButtons
            onGoogleLogin={handleSocialLogin}
            onFacebookLogin={handleSocialLogin}
            onAppleLogin={handleSocialLogin}
            onWhatsAppLogin={handleSocialLogin}
          />

          {/* Divider mejorado */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>o continúa con</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Botón de Registro mejorado */}
          <TouchableOpacity
            style={styles.registerButton}
            onPress={onNavigateToRegister}
            activeOpacity={0.8}
          >
            <View style={styles.registerButtonContent}>
              <Text style={styles.registerButtonText}>¿No tienes cuenta? Crear una</Text>
              <View style={styles.registerButtonIcon}>
                <Icon name="person-add" size={20} color="#4F46E5" />
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Footer mejorado */}
        <View style={styles.footer}>
          <View style={styles.demoContainer}>
            <Icon name="information-circle-outline" size={16} color="#6B7280" />
            <Text style={styles.footerText}>
              Demo: usa demo@agenda.com / demo123
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  
  // Header mejorado
  header: {
    alignItems: 'center',
    marginBottom: 40,
    paddingTop: 20,
  },
  logoContainer: {
    position: 'relative',
    marginBottom: 24,
  },
  logoBackground: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4F46E5',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 3,
    borderColor: '#E5E7EB',
  },
  logoGlow: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(79, 70, 229, 0.1)',
    top: -10,
    left: -10,
  },
  mascotaImage: {
    width: 80,
    height: 80,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 24,
  },

  // Formulario mejorado
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: 24,
  },
  formHeader: {
    marginBottom: 28,
    alignItems: 'center',
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  formSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },

  // Inputs mejorados
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    minHeight: 56,
  },
  inputWrapperFocused: {
    borderColor: '#4F46E5',
    backgroundColor: '#FFFFFF',
    shadowColor: '#4F46E5',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  inputIconContainer: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    paddingVertical: 16,
  },
  eyeIcon: {
    padding: 8,
    marginLeft: 8,
  },

  // Opciones mejoradas
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  rememberMeText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  forgotPasswordButton: {
    padding: 8,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#4F46E5',
    fontWeight: '600',
  },

  // Botón de login mejorado
  loginButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 16,
    paddingVertical: 18,
    marginBottom: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  loginButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  loginButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginRight: 12,
  },
  loginButtonIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Divider mejorado
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginHorizontal: 16,
    fontWeight: '500',
  },

  // Botón de registro mejorado
  registerButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 18,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  registerButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4F46E5',
    marginRight: 12,
  },
  registerButtonIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Footer mejorado
  footer: {
    alignItems: 'center',
    marginTop: 20,
  },
  demoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  footerText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
    fontWeight: '500',
  },
});

export default LoginScreen;
