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
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const ForgotPasswordScreen = ({ onNavigateToLogin }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSendResetEmail = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Por favor ingresa tu email');
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('Error', 'Por favor ingresa un email válido');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simular envío de email (aquí iría la lógica real)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setEmailSent(true);
      Alert.alert(
        'Email Enviado',
        'Hemos enviado un enlace de recuperación a tu email. Revisa tu bandeja de entrada y sigue las instrucciones.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Error al enviar el email. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      Alert.alert('Email Reenviado', 'Hemos reenviado el enlace de recuperación.');
    } catch (error) {
      Alert.alert('Error', 'Error al reenviar el email.');
    } finally {
      setIsLoading(false);
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  if (emailSent) {
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
            <Text style={styles.subtitle}>Email enviado exitosamente</Text>
          </View>

          {/* Formulario de éxito mejorado */}
          <View style={styles.formContainer}>
            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>¡Listo!</Text>
              <Text style={styles.formSubtitle}>Revisa tu bandeja de entrada</Text>
            </View>

            <View style={styles.successContainer}>
              <View style={styles.successIconContainer}>
                <Icon name="checkmark-circle" size={60} color="#10B981" />
              </View>
              <Text style={styles.successText}>
                Hemos enviado un enlace de recuperación a:
              </Text>
              <View style={styles.emailContainer}>
                <Icon name="mail" size={20} color="#4F46E5" />
                <Text style={styles.emailText}>{email}</Text>
              </View>
              <Text style={styles.instructionsText}>
                Sigue las instrucciones en el email para restablecer tu contraseña.
              </Text>
            </View>

            {/* Botón de reenviar mejorado */}
            <TouchableOpacity
              style={[styles.resendButton, isLoading && styles.resendButtonDisabled]}
              onPress={handleResendEmail}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <View style={styles.resendButtonContent}>
                <Text style={styles.resendButtonText}>
                  {isLoading ? 'Reenviando...' : 'Reenviar Email'}
                </Text>
                <View style={styles.resendButtonIcon}>
                  <Icon name="refresh" size={20} color="#FFFFFF" />
                </View>
              </View>
              {isLoading && <View style={styles.loadingOverlay} />}
            </TouchableOpacity>

            {/* Divider mejorado */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>¿Recordaste tu contraseña?</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Botón de volver al login mejorado */}
            <TouchableOpacity
              style={styles.backToLoginButton}
              onPress={onNavigateToLogin}
              activeOpacity={0.8}
            >
              <View style={styles.backToLoginButtonContent}>
                <Text style={styles.backToLoginButtonText}>Volver al Login</Text>
                <View style={styles.backToLoginButtonIcon}>
                  <Icon name="arrow-back" size={20} color="#4F46E5" />
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {/* Footer mejorado */}
          <View style={styles.footer}>
            <View style={styles.demoContainer}>
              <Icon name="information-circle-outline" size={16} color="#6B7280" />
              <Text style={styles.footerText}>
                ¿No recibiste el email? Revisa tu carpeta de spam
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
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
          <Text style={styles.subtitle}>Te ayudamos a recuperar tu cuenta</Text>
        </View>

        {/* Formulario mejorado */}
        <View style={styles.formContainer}>
          <View style={styles.formHeader}>
            <Text style={styles.formTitle}>¿Olvidaste tu contraseña?</Text>
            <Text style={styles.formSubtitle}>No te preocupes, es normal</Text>
          </View>
          
          {/* Instrucciones mejoradas */}
          <View style={styles.instructionContainer}>
            <View style={styles.instructionIconContainer}>
              <Icon name="help-circle-outline" size={24} color="#4F46E5" />
            </View>
            <Text style={styles.instructionText}>
              Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña de forma segura.
            </Text>
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
                returnKeyType="done"
                onSubmitEditing={handleSendResetEmail}
                blurOnSubmit={true}
                editable={true}
                selectTextOnFocus={false}
                autoFocus={false}
                caretHidden={false}
                contextMenuHidden={false}
                textContentType="emailAddress"
              />
            </View>
          </View>

          {/* Botón de enviar mejorado */}
          <TouchableOpacity
            style={[styles.sendButton, isLoading && styles.sendButtonDisabled]}
            onPress={handleSendResetEmail}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <View style={styles.sendButtonContent}>
              <Text style={styles.sendButtonText}>
                {isLoading ? 'Enviando...' : 'Enviar Enlace'}
              </Text>
              <View style={styles.sendButtonIcon}>
                <Icon name="arrow-forward" size={20} color="#FFFFFF" />
              </View>
            </View>
            {isLoading && <View style={styles.loadingOverlay} />}
          </TouchableOpacity>

          {/* Divider mejorado */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>¿Recordaste tu contraseña?</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Botón de volver al login mejorado */}
          <TouchableOpacity
            style={styles.backToLoginButton}
            onPress={onNavigateToLogin}
            activeOpacity={0.8}
          >
            <View style={styles.backToLoginButtonContent}>
              <Text style={styles.backToLoginButtonText}>Volver al Login</Text>
              <View style={styles.backToLoginButtonIcon}>
                <Icon name="arrow-back" size={20} color="#4F46E5" />
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Footer mejorado */}
        <View style={styles.footer}>
          <View style={styles.demoContainer}>
            <Icon name="shield-checkmark-outline" size={16} color="#6B7280" />
            <Text style={styles.footerText}>
              Tu información está protegida y segura
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

  // Instrucciones mejoradas
  instructionContainer: {
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  instructionIconContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },

  // Inputs mejorados
  inputContainer: {
    marginBottom: 24,
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
    paddingHorizontal: 0,
    textAlignVertical: 'center',
  },

  // Botón de enviar mejorado
  sendButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 16,
    paddingVertical: 18,
    marginBottom: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  sendButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  sendButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginRight: 12,
  },
  sendButtonIcon: {
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

  // Botón de volver al login mejorado
  backToLoginButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 18,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  backToLoginButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backToLoginButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4F46E5',
    marginRight: 12,
  },
  backToLoginButtonIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Pantalla de éxito mejorada
  successContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  successIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  successText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 24,
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 20,
  },
  emailText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
  },
  instructionsText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },

  // Botón de reenviar mejorado
  resendButton: {
    backgroundColor: '#10B981',
    borderRadius: 16,
    paddingVertical: 18,
    marginBottom: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  resendButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  resendButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resendButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginRight: 12,
  },
  resendButtonIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
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

export default ForgotPasswordScreen;