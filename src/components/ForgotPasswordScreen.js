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
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <View style={styles.brainContainer}>
                <Icon name="brain" size={50} color="#2c3e50" />
                <Icon name="flash" size={25} color="#e74c3c" style={styles.lightningIcon} />
              </View>
            </View>
            <Text style={styles.title}>Email Enviado</Text>
            <Text style={styles.subtitle}>Revisa tu bandeja de entrada</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.successContainer}>
              <Icon name="checkmark-circle" size={80} color="#28a745" />
              <Text style={styles.successTitle}>¡Listo!</Text>
              <Text style={styles.successText}>
                Hemos enviado un enlace de recuperación a:
              </Text>
              <Text style={styles.emailText}>{email}</Text>
              <Text style={styles.instructionsText}>
                Sigue las instrucciones en el email para restablecer tu contraseña.
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.resendButton, isLoading && styles.resendButtonDisabled]}
              onPress={handleResendEmail}
              disabled={isLoading}
            >
              {isLoading ? (
                <Text style={styles.resendButtonText}>Reenviando...</Text>
              ) : (
                <Text style={styles.resendButtonText}>Reenviar Email</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.backToLoginButton}
              onPress={onNavigateToLogin}
            >
              <Text style={styles.backToLoginButtonText}>Volver al Login</Text>
            </TouchableOpacity>
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
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.brainContainer}>
              <Icon name="brain" size={50} color="#2c3e50" />
              <Icon name="flash" size={25} color="#e74c3c" style={styles.lightningIcon} />
            </View>
          </View>
            <Text style={styles.title}>Recuperar Contraseña</Text>
            <Text style={styles.subtitle}>Te ayudamos a recuperar tu cuenta en Cortexa</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>¿Olvidaste tu contraseña?</Text>
          
          <View style={styles.instructionContainer}>
            <Text style={styles.instructionText}>
              No te preocupes, es normal. Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña.
            </Text>
          </View>
          
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

          <TouchableOpacity
            style={[styles.sendButton, isLoading && styles.sendButtonDisabled]}
            onPress={handleSendResetEmail}
            disabled={isLoading}
          >
            <Text style={styles.sendButtonText}>
              {isLoading ? 'Enviando...' : 'Enviar Enlace'}
            </Text>
            <View style={styles.sendButtonIcon}>
              <Icon name="mail" size={16} color="#000000" />
            </View>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>o</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={styles.backToLoginButton}
            onPress={onNavigateToLogin}
          >
            <Text style={styles.backToLoginButtonText}>Volver al Login</Text>
            <View style={styles.backToLoginButtonIcon}>
              <Icon name="arrow-back" size={16} color="#000000" />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            ¿No recibiste el email? Revisa tu carpeta de spam
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
    marginBottom: 20,
  },
  instructionContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  instructionText: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 24,
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
  sendButton: {
    backgroundColor: '#f8f9fa',
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: '#d1b3ff',
    shadowColor: '#d1b3ff',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  sendButtonDisabled: {
    backgroundColor: '#e9ecef',
    borderColor: '#ced4da',
  },
  sendButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#495057',
    flex: 1,
    textAlign: 'left',
  },
  sendButtonIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#d1b3ff',
    justifyContent: 'center',
    alignItems: 'center',
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
  },
  backToLoginButton: {
    backgroundColor: '#f8f9fa',
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: '#ffcccb',
    shadowColor: '#ffcccb',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  backToLoginButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#495057',
    flex: 1,
    textAlign: 'left',
  },
  backToLoginButtonIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ffcccb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#28a745',
    marginTop: 16,
    marginBottom: 16,
  },
  successText: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: 8,
  },
  emailText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d4150',
    marginBottom: 16,
  },
  instructionsText: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
    lineHeight: 20,
  },
  resendButton: {
    backgroundColor: '#28a745',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  resendButtonDisabled: {
    backgroundColor: '#ccc',
  },
  resendButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
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

export default ForgotPasswordScreen;
