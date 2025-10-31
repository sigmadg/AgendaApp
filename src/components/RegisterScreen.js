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

const RegisterScreen = ({ onRegister, onNavigateToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  
  // Referencias para navegación entre campos
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const confirmPasswordInputRef = useRef(null);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRegister = async () => {
    const { name, email, password, confirmPassword } = formData;

    // Validaciones
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('Error', 'Por favor ingresa un email válido');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    if (!acceptTerms) {
      Alert.alert('Error', 'Debes aceptar los términos y condiciones');
      return;
    }

    setIsLoading(true);
    
    try {
      // Registrar usuario usando el sistema real
      const result = await onRegister(formData);
      
      if (result.success) {
        Alert.alert(
          'Registro Exitoso',
          'Tu cuenta ha sido creada correctamente. Ya puedes iniciar sesión.',
          [
            {
              text: 'OK',
              onPress: () => onNavigateToLogin()
            }
          ]
        );
      } else {
        Alert.alert('Error', result.error || 'Error al crear la cuenta. Intenta nuevamente.');
      }
    } catch (error) {
      Alert.alert('Error', 'Error al crear la cuenta. Intenta nuevamente.');
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
          <Text style={styles.subtitle}>Únete a nuestra comunidad</Text>
        </View>

        {/* Formulario mejorado */}
        <View style={styles.formContainer}>
          <View style={styles.formHeader}>
            <Text style={styles.formTitle}>¡Crea tu cuenta!</Text>
            <Text style={styles.formSubtitle}>Completa los datos para comenzar</Text>
          </View>
          
          {/* Campo de Nombre mejorado */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Nombre completo</Text>
            <View style={[styles.inputWrapper, formData.name && styles.inputWrapperFocused]}>
              <View style={styles.inputIconContainer}>
                <Icon name="person-outline" size={22} color={formData.name ? "#4F46E5" : "#9CA3AF"} />
              </View>
              <TextInput
                style={styles.textInput}
                value={formData.name}
                onChangeText={(value) => handleInputChange('name', value)}
                placeholder="Tu nombre completo"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="words"
                autoCorrect={false}
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => {
                  emailInputRef.current?.focus();
                }}
                autoFocus={false}
                caretHidden={false}
                contextMenuHidden={false}
                selectTextOnFocus={false}
                textContentType="name"
              />
            </View>
          </View>

          {/* Campo de Email mejorado */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Correo electrónico</Text>
            <View style={[styles.inputWrapper, formData.email && styles.inputWrapperFocused]}>
              <View style={styles.inputIconContainer}>
                <Icon name="mail-outline" size={22} color={formData.email ? "#4F46E5" : "#9CA3AF"} />
              </View>
              <TextInput
                ref={emailInputRef}
                style={styles.textInput}
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                placeholder="tu@email.com"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => {
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
            <View style={[styles.inputWrapper, formData.password && styles.inputWrapperFocused]}>
              <View style={styles.inputIconContainer}>
                <Icon name="lock-closed-outline" size={22} color={formData.password ? "#4F46E5" : "#9CA3AF"} />
              </View>
              <TextInput
                ref={passwordInputRef}
                style={styles.textInput}
                value={formData.password}
                onChangeText={(value) => handleInputChange('password', value)}
                placeholder="Mínimo 6 caracteres"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => {
                  confirmPasswordInputRef.current?.focus();
                }}
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
                  color={formData.password ? "#4F46E5" : "#9CA3AF"} 
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Campo de Confirmar Contraseña mejorado */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Confirmar contraseña</Text>
            <View style={[styles.inputWrapper, formData.confirmPassword && styles.inputWrapperFocused]}>
              <View style={styles.inputIconContainer}>
                <Icon name="lock-closed-outline" size={22} color={formData.confirmPassword ? "#4F46E5" : "#9CA3AF"} />
              </View>
              <TextInput
                ref={confirmPasswordInputRef}
                style={styles.textInput}
                value={formData.confirmPassword}
                onChangeText={(value) => handleInputChange('confirmPassword', value)}
                placeholder="Repite tu contraseña"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
                blurOnSubmit={true}
                onSubmitEditing={handleRegister}
                autoFocus={false}
                caretHidden={false}
                contextMenuHidden={false}
                selectTextOnFocus={false}
                textContentType="password"
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeIcon}
              >
                <Icon 
                  name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} 
                  size={22} 
                  color={formData.confirmPassword ? "#4F46E5" : "#9CA3AF"} 
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Términos y condiciones mejorados */}
          <View style={styles.termsContainer}>
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setAcceptTerms(!acceptTerms)}
            >
              <View style={[styles.checkbox, acceptTerms && styles.checkboxChecked]}>
                {acceptTerms && (
                  <Icon name="checkmark" size={16} color="#FFFFFF" />
                )}
              </View>
              <Text style={styles.termsText}>
                Acepto los{' '}
                <Text style={styles.termsLink}>términos y condiciones</Text>
                {' '}y la{' '}
                <Text style={styles.termsLink}>política de privacidad</Text>
              </Text>
            </TouchableOpacity>
          </View>

          {/* Botón de Registro mejorado */}
          <TouchableOpacity
            style={[styles.registerButton, isLoading && styles.registerButtonDisabled]}
            onPress={handleRegister}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <View style={styles.registerButtonContent}>
              <Text style={styles.registerButtonText}>
                {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
              </Text>
              <View style={styles.registerButtonIcon}>
                <Icon name="arrow-forward" size={20} color="#FFFFFF" />
              </View>
            </View>
            {isLoading && <View style={styles.loadingOverlay} />}
          </TouchableOpacity>

          {/* Divider mejorado */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>¿Ya tienes cuenta?</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Botón de Login mejorado */}
          <TouchableOpacity
            style={styles.loginButton}
            onPress={onNavigateToLogin}
            activeOpacity={0.8}
          >
            <View style={styles.loginButtonContent}>
              <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
              <View style={styles.loginButtonIcon}>
                <Icon name="log-in" size={20} color="#4F46E5" />
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Footer mejorado */}
        <View style={styles.footer}>
          <View style={styles.demoContainer}>
            <Icon name="shield-checkmark-outline" size={16} color="#6B7280" />
            <Text style={styles.footerText}>
              Tus datos están protegidos y seguros
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

  // Términos mejorados
  termsContainer: {
    marginBottom: 24,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  termsLink: {
    color: '#4F46E5',
    fontWeight: '600',
  },

  // Botón de registro mejorado
  registerButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 16,
    paddingVertical: 18,
    marginBottom: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  registerButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  registerButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginRight: 12,
  },
  registerButtonIcon: {
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

  // Botón de login mejorado
  loginButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 18,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  loginButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4F46E5',
    marginRight: 12,
  },
  loginButtonIcon: {
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

export default RegisterScreen;