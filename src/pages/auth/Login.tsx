import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  IonContent,
  IonPage,
  IonInput,
  IonButton,
  IonLabel,
  IonItem,
  IonList,
  IonCheckbox,
  IonText,
  IonIcon,
  IonAlert,
  IonLoading,
  IonImg,
  IonProgressBar,
  IonBadge,
} from '@ionic/react';
import { eye, eyeOff, mail, lockClosed, logIn, personAdd, person, checkmarkCircle, closeCircle, alertCircle } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { IMAGES } from '../../assets';
import './Login.css';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    showPassword: false,
    rememberMe: false,
    isLoading: false,
    emailFocused: false,
    passwordFocused: false,
    emailValid: null as boolean | null,
    passwordValid: null as boolean | null,
  });

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error' | 'warning'>('success');
  const [loginAttempts, setLoginAttempts] = useState(0);

  const emailRef = useRef<HTMLIonInputElement>(null);
  const passwordRef = useRef<HTMLIonInputElement>(null);
  const history = useHistory();
  const { signIn } = useAuth();

  // Validación de email en tiempo real
  const validateEmail = useCallback((email: string) => {
    if (!email.trim()) return null;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }, []);

  // Validación de contraseña en tiempo real
  const validatePassword = useCallback((password: string) => {
    if (!password.trim()) return null;
    return password.length >= 6;
  }, []);

  // Calcular fuerza de contraseña
  const getPasswordStrength = useCallback((password: string) => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 6) strength += 25;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    return strength;
  }, []);

  const updateFormData = useCallback((updates: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);

  const handleEmailChange = useCallback((value: string | undefined | null) => {
    const emailValue = value || '';
    const isValid = validateEmail(emailValue);
    updateFormData({
      email: emailValue,
      emailValid: isValid
    });
  }, [validateEmail, updateFormData]);

  const handlePasswordChange = useCallback((value: string | undefined | null) => {
    const passwordValue = value || '';
    const isValid = validatePassword(passwordValue);
    updateFormData({
      password: passwordValue,
      passwordValid: isValid
    });
  }, [validatePassword, updateFormData]);

  const handleEmailFocus = useCallback(() => {
    updateFormData({ emailFocused: true });
  }, [updateFormData]);

  const handleEmailBlur = useCallback(() => {
    updateFormData({ emailFocused: false });
  }, [updateFormData]);

  const handlePasswordFocus = useCallback(() => {
    updateFormData({ passwordFocused: true });
  }, [updateFormData]);

  const handlePasswordBlur = useCallback(() => {
    updateFormData({ passwordFocused: false });
  }, [updateFormData]);

  const handleToggleShowPassword = useCallback(() => {
    updateFormData({ showPassword: !formData.showPassword });
  }, [formData.showPassword, updateFormData]);

  const handleToggleRememberMe = useCallback((checked: boolean) => {
    updateFormData({ rememberMe: checked });
  }, [updateFormData]);

  const handleLogin = useCallback(async () => {
    // Validaciones locales
    if (!formData.email.trim()) {
      setAlertMessage('Por favor ingresa tu email');
      setAlertType('warning');
      setShowAlert(true);
      emailRef.current?.setFocus();
      return;
    }

    if (!formData.password.trim()) {
      setAlertMessage('Por favor ingresa tu contraseña');
      setAlertType('warning');
      setShowAlert(true);
      passwordRef.current?.setFocus();
      return;
    }

    if (formData.emailValid === false) {
      setAlertMessage('Por favor ingresa un email válido');
      setAlertType('error');
      setShowAlert(true);
      emailRef.current?.setFocus();
      return;
    }

    if (formData.passwordValid === false) {
      setAlertMessage('La contraseña debe tener al menos 6 caracteres');
      setAlertType('error');
      setShowAlert(true);
      passwordRef.current?.setFocus();
      return;
    }

    updateFormData({ isLoading: true });
    setLoginAttempts(prev => prev + 1);

    try {
      const result = await signIn(formData.email, formData.password, formData.rememberMe);

      if (result.success) {
        setAlertMessage('¡Bienvenido de vuelta! 🎉');
        setAlertType('success');
        setShowAlert(true);
        setLoginAttempts(0); // Reset on success

        // Redirect with smooth transition
        setTimeout(() => {
          history.push('/main');
        }, 2000);
      } else {
        const errorMsg = loginAttempts >= 2
          ? 'Demasiados intentos fallidos. ¿Olvidaste tu contraseña?'
          : result.error || 'Credenciales incorrectas';

        setAlertMessage(errorMsg);
        setAlertType(loginAttempts >= 2 ? 'warning' : 'error');
        setShowAlert(true);
      }
    } catch (error) {
      setAlertMessage('Error de conexión. Verifica tu conexión a internet.');
      setAlertType('error');
      setShowAlert(true);
    } finally {
      updateFormData({ isLoading: false });
    }
  }, [formData.email, formData.password, formData.emailValid, formData.passwordValid, formData.rememberMe, signIn, updateFormData, history, loginAttempts]);

  const navigateToRegister = useCallback(() => {
    history.push('/register');
  }, [history]);

  return (
    <IonPage className="auth-page">
      <IonContent className="auth-content" scrollY={true}>
        {/* Logo Section */}
        <div className="logo-container">
          <div className="logo-background">
            <IonImg
              src="/assets/images/logos/login.png?v=1"
              alt="AgendaApp Logo"
              className="login-image"
              onIonError={(e) => {
                console.log('Login image not found, trying fallback');
                // Fallback a un placeholder si falla
                (e.target as HTMLIonImgElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjkwIiB2aWV3Qm94PSIwIDAgMTIwIDkwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9IjkwIiBmaWxsPSIjNjY3ZWVhIiBvcGFjaXR5PSIwLjEiLz4KPHRleHQgeD0iNjAiIHk9IjQ1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNjY3ZWVhIiBmb250LXNpemU9IjE0IiBmb250LWZhbWlseT0iQXJpYWwiPkxvZ288L3RleHQ+Cjwvc3ZnPgo=';
              }}
              onIonImgDidLoad={() => console.log('Login image loaded successfully')}
            />
          </div>
          <h1 className="app-title">AgendaApp</h1>
          <p className="app-subtitle">Organiza tu vida de manera inteligente</p>
        </div>

        {/* Login Form */}
        <div className="form-container" role="main" aria-labelledby="login-title">
          <h1 id="login-title" className="form-title">¡Bienvenido de vuelta!</h1>
          <p className="form-subtitle">Estamos felices de verte nuevamente. Ingresa tu email y contraseña para continuar.</p>

          <IonList lines="none" className="form-list">
            {/* Email Input */}
            <div className="input-container">
              <IonItem
                className={`input-item ${formData.emailFocused ? 'focused' : ''} ${
                  formData.emailValid === true ? 'valid' : formData.emailValid === false ? 'invalid' : ''
                }`}
              >
                <IonIcon
                  icon={formData.emailValid === true ? checkmarkCircle : formData.emailValid === false ? closeCircle : mail}
                  slot="start"
                  className={`input-icon ${formData.emailValid === true ? 'valid' : formData.emailValid === false ? 'invalid' : ''}`}
                  aria-hidden="true"
                />
                <IonInput
                  ref={emailRef}
                  type="email"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onIonChange={(e) => handleEmailChange(e.detail.value)}
                  onFocus={handleEmailFocus}
                  onBlur={handleEmailBlur}
                  enterkeyhint="next"
                  autocapitalize="off"
                  autocomplete="email"
                  inputmode="email"
                  label="Correo electrónico"
                  labelPlacement="floating"
                  helperText="Ingresa tu dirección de email"
                  errorText={formData.emailValid === false && formData.email.trim() ? "Formato de email inválido" : undefined}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      passwordRef.current?.setFocus();
                    }
                  }}
                  aria-describedby="email-help"
                  aria-invalid={formData.emailValid === false}
                  required
                />
              </IonItem>
              {formData.emailValid === false && formData.email.trim() && (
                <div className="field-help error" id="email-help" role="alert">
                  <IonIcon icon={closeCircle} aria-hidden="true" />
                  <IonText>Ingresa un email válido</IonText>
                </div>
              )}
            </div>

            {/* Password Input */}
            <div className="input-container">
              <IonItem
                className={`input-item ${formData.passwordFocused ? 'focused' : ''} ${
                  formData.passwordValid === true ? 'valid' : formData.passwordValid === false ? 'invalid' : ''
                }`}
              >
                <IonIcon
                  icon={formData.passwordValid === true ? checkmarkCircle : formData.passwordValid === false ? alertCircle : lockClosed}
                  slot="start"
                  className={`input-icon ${formData.passwordValid === true ? 'valid' : formData.passwordValid === false ? 'invalid' : ''}`}
                  aria-hidden="true"
                />
                <IonInput
                  ref={passwordRef}
                  type={formData.showPassword ? 'text' : 'password'}
                  placeholder="Tu contraseña"
                  value={formData.password}
                  onIonChange={(e) => handlePasswordChange(e.detail.value)}
                  onFocus={handlePasswordFocus}
                  onBlur={handlePasswordBlur}
                  enterkeyhint="done"
                  autocomplete="current-password"
                  inputmode="text"
                  label="Contraseña"
                  labelPlacement="floating"
                  helperText="Mínimo 6 caracteres"
                  errorText={formData.passwordValid === false && formData.password.trim() ? "La contraseña debe tener al menos 6 caracteres" : undefined}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleLogin();
                    }
                  }}
                  aria-describedby="password-help password-strength"
                  aria-invalid={formData.passwordValid === false}
                  required
                />
                <IonButton
                  fill="clear"
                  slot="end"
                  onClick={handleToggleShowPassword}
                  className="password-toggle"
                  aria-label={formData.showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  <IonIcon
                    icon={formData.showPassword ? eyeOff : eye}
                    className="password-icon"
                    aria-hidden="true"
                  />
                </IonButton>
              </IonItem>

              {/* Password Strength Indicator - Always visible */}
              <div className="password-strength" id="password-strength" role="status" aria-live="polite">
                <div className="strength-label">
                  <IonText color="medium">Seguridad:</IonText>
                  <IonText
                    color={
                      !formData.password.trim() ? 'medium' :
                      getPasswordStrength(formData.password) >= 75 ? 'success' :
                      getPasswordStrength(formData.password) >= 50 ? 'warning' : 'danger'
                    }
                    className="strength-text"
                  >
                    {!formData.password.trim() ? 'Sin evaluar' :
                     getPasswordStrength(formData.password) >= 75 ? 'Muy segura' :
                     getPasswordStrength(formData.password) >= 50 ? 'Segura' : 'Débil'}
                  </IonText>
                </div>
                <IonProgressBar
                  value={!formData.password.trim() ? 0 : getPasswordStrength(formData.password) / 100}
                  color={
                    !formData.password.trim() ? 'medium' :
                    getPasswordStrength(formData.password) >= 75 ? 'success' :
                    getPasswordStrength(formData.password) >= 50 ? 'warning' : 'danger'
                  }
                  className="strength-bar"
                  aria-label={`Nivel de seguridad: ${
                    !formData.password.trim() ? 'Sin evaluar' :
                    getPasswordStrength(formData.password) >= 75 ? 'Muy segura' :
                    getPasswordStrength(formData.password) >= 50 ? 'Segura' : 'Débil'
                  }`}
                />
              </div>

              {formData.passwordValid === false && formData.password.trim() && (
                <div className="field-help error" id="password-help" role="alert">
                  <IonIcon icon={alertCircle} aria-hidden="true" />
                  <IonText>Mínimo 6 caracteres</IonText>
                </div>
              )}
            </div>
          </IonList>

          {/* Login Attempts Warning - Show earlier if needed */}
          {loginAttempts >= 2 && (
            <div className="attempts-warning">
              <IonIcon icon={alertCircle} color="warning" />
              <IonText color="warning" className="warning-text">
                Múltiples intentos fallidos. ¿Necesitas ayuda?
              </IonText>
            </div>
          )}

          {/* Options - Moved before button for better flow */}
          <div className="options-container">
            <IonItem lines="none" className="checkbox-item">
              <IonCheckbox
                checked={formData.rememberMe}
                onIonChange={(e) => handleToggleRememberMe(e.detail.checked)}
                slot="start"
                className="remember-checkbox"
              />
              <IonLabel className="remember-label">Mantener sesión activa</IonLabel>
            </IonItem>
          </div>

          {/* Forgot Password Button - Prominent and centered */}
          <div className="forgot-password-container">
            <IonButton
              fill="clear"
              size="default"
              onClick={() => history.push('/forgot-password')}
              className="forgot-password-btn"
            >
              <IonText className="forgot-text">¿Olvidaste tu contraseña?</IonText>
            </IonButton>
          </div>

          {/* Login Button - Modern gradient button with arrow */}
          <IonButton
            expand="block"
            size="large"
            onClick={handleLogin}
            disabled={formData.isLoading || !formData.email.trim() || !formData.password.trim()}
            className={`login-btn ${formData.isLoading ? 'loading' : ''} ${
              (formData.emailValid === true && formData.passwordValid === true) ? 'ready' : ''
            }`}
            aria-describedby="login-status"
            type="submit"
          >
            {formData.isLoading ? (
              <>
                <IonIcon icon="refresh" slot="start" className="spinning" aria-hidden="true" />
                <span className="loading-text">Verificando credenciales...</span>
              </>
            ) : (
              <>
                <IonIcon icon={logIn} slot="start" aria-hidden="true" />
                <span className="login-text">Iniciar Sesión</span>
                <IonIcon icon="arrow-forward" slot="end" className="login-arrow" aria-hidden="true" />
              </>
            )}
          </IonButton>

          {/* Screen reader status */}
          <div id="login-status" className="sr-only" aria-live="polite" aria-atomic="true">
            {formData.isLoading ? 'Verificando credenciales...' :
             !formData.email.trim() || !formData.password.trim() ? 'Por favor completa todos los campos requeridos' :
             formData.emailValid === false || formData.passwordValid === false ? 'Hay errores en el formulario que necesitan ser corregidos' :
             'Formulario listo para enviar'}
          </div>

          {/* Divider */}
          <div className="register-divider">
            <div className="divider-line"></div>
            <IonText className="divider-text">o</IonText>
            <div className="divider-line"></div>
          </div>

          {/* Register Section - Botones secundarios */}
          <div className="register-container">
            <div className="register-prompt">
              <IonButton
                fill="solid"
                size="default"
                onClick={navigateToRegister}
                className="register-btn"
              >
                <IonIcon icon={personAdd} slot="start" />
                <span className="register-text">Crear cuenta</span>
              </IonButton>
              <IonButton
                fill="solid"
                size="default"
                onClick={() => {/* Continuar como invitado */}}
                className="register-btn"
              >
                <IonIcon icon={person} slot="start" />
                <span className="register-text">Continuar como invitado</span>
              </IonButton>
            </div>
          </div>

        </div>

        {/* Enhanced Loading Spinner */}
        <IonLoading
          isOpen={formData.isLoading}
          message="Verificando credenciales..."
          duration={30000}
          spinner="crescent"
          cssClass="auth-loading"
        />

        {/* Enhanced Alert */}
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header={alertType === 'success' ? '¡Éxito!' : alertType === 'warning' ? 'Atención' : 'Error'}
          message={alertMessage}
          buttons={[
            {
              text: 'OK',
              role: 'cancel',
              handler: () => {
                if (alertType === 'success') {
                  setTimeout(() => history.push('/main'), 500);
                }
              }
            }
          ]}
          cssClass={`auth-alert ${alertType}`}
        />
      </IonContent>
    </IonPage>
  );
};

export default Login;