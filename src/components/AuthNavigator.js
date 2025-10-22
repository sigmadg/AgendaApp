import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import ForgotPasswordScreen from './ForgotPasswordScreen';

const AuthNavigator = ({ onLogin, onRegister }) => {
  const [currentScreen, setCurrentScreen] = useState('login');

  const navigateToLogin = () => setCurrentScreen('login');
  const navigateToRegister = () => setCurrentScreen('register');
  const navigateToForgotPassword = () => setCurrentScreen('forgot-password');

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'login':
        return (
          <LoginScreen
            onLogin={onLogin}
            onNavigateToRegister={navigateToRegister}
            onNavigateToForgotPassword={navigateToForgotPassword}
          />
        );
      case 'register':
        return (
          <RegisterScreen
            onRegister={onRegister}
            onNavigateToLogin={navigateToLogin}
          />
        );
      case 'forgot-password':
        return (
          <ForgotPasswordScreen
            onNavigateToLogin={navigateToLogin}
          />
        );
      default:
        return (
          <LoginScreen
            onLogin={onLogin}
            onNavigateToRegister={navigateToRegister}
            onNavigateToForgotPassword={navigateToForgotPassword}
          />
        );
    }
  };

  return (
    <View style={styles.container}>
      {renderCurrentScreen()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default AuthNavigator;
