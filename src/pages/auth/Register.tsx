import React, { useState, useRef, useCallback } from 'react';
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonInput,
  IonButton,
  IonLabel,
  IonItem,
  IonList,
  IonText,
  IonIcon,
  IonAlert,
  IonLoading,
  IonImg,
} from '@ionic/react';
import { eye, eyeOff, mail, lockClosed, person, personAdd } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    showPassword: false,
    isLoading: false
  });

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const nameRef = useRef<HTMLIonInputElement>(null);
  const emailRef = useRef<HTMLIonInputElement>(null);
  const passwordRef = useRef<HTMLIonInputElement>(null);
  const confirmPasswordRef = useRef<HTMLIonInputElement>(null);
  const history = useHistory();
  const { signUp } = useAuth();

  const isValidEmail = useCallback((email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }, []);

  const updateFormData = useCallback((updates: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);

  const handleNameChange = useCallback((value: string | undefined | null) => {
    updateFormData({ name: value || '' });
  }, [updateFormData]);

  const handleEmailChange = useCallback((value: string | undefined | null) => {
    updateFormData({ email: value || '' });
  }, [updateFormData]);

  const handlePasswordChange = useCallback((value: string | undefined | null) => {
    updateFormData({ password: value || '' });
  }, [updateFormData]);

  const handleConfirmPasswordChange = useCallback((value: string | undefined | null) => {
    updateFormData({ confirmPassword: value || '' });
  }, [updateFormData]);

  const handleToggleShowPassword = useCallback(() => {
    updateFormData({ showPassword: !formData.showPassword });
  }, [formData.showPassword, updateFormData]);

  const handleRegister = useCallback(async () => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim() || !formData.confirmPassword.trim()) {
      setAlertMessage('Por favor completa todos los campos');
      setShowAlert(true);
      return;
    }

    if (!isValidEmail(formData.email)) {
      setAlertMessage('Por favor ingresa un email válido');
      setShowAlert(true);
      emailRef.current?.setFocus();
      return;
    }

    if (formData.password.length < 6) {
      setAlertMessage('La contraseña debe tener al menos 6 caracteres');
      setShowAlert(true);
      passwordRef.current?.setFocus();
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setAlertMessage('Las contraseñas no coinciden');
      setShowAlert(true);
      confirmPasswordRef.current?.setFocus();
      return;
    }

    updateFormData({ isLoading: true });

    try {
      const result = await signUp(formData.name, formData.email, formData.password);

      if (result.success) {
        setAlertMessage('¡Cuenta creada exitosamente! Bienvenido');
        setShowAlert(true);
        // Redirect to main app after successful registration
        setTimeout(() => {
          history.push('/main');
        }, 1500);
      } else {
        setAlertMessage(result.error || 'Error al crear la cuenta');
        setShowAlert(true);
      }
    } catch (error) {
      setAlertMessage('Error al crear la cuenta. Intenta nuevamente.');
      setShowAlert(true);
    } finally {
      updateFormData({ isLoading: false });
    }
  }, [formData, isValidEmail, signUp, updateFormData, history]);

  const navigateToLogin = useCallback(() => {
    history.push('/login');
  }, [history]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Crear Cuenta</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding" scrollY={true}>
        {/* Logo Section */}
        <div className="logo-container">
          <div className="logo-background">
            <IonImg
              src="/assets/images/mascota.png"
              alt="Mascota"
              className="mascota-image"
              onIonError={() => console.log('Image not found')}
            />
          </div>
          <h1 className="app-title">Cortexa</h1>
          <p className="app-subtitle">Únete a nuestra comunidad</p>
        </div>

        {/* Register Form */}
        <div className="form-container">
          <h2 className="form-title">Crear Cuenta</h2>
          <p className="form-subtitle">Regístrate para comenzar a organizar tu vida</p>

          <IonList lines="none" className="form-list">
            {/* Name Input */}
            <IonItem className="input-item">
              <IonIcon icon={person} slot="start" color="medium" />
              <IonInput
                ref={nameRef}
                type="text"
                placeholder="Tu nombre completo"
                value={formData.name}
                onIonChange={(e) => handleNameChange(e.detail.value)}
                enterkeyhint="next"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    emailRef.current?.setFocus();
                  }
                }}
              />
            </IonItem>

            {/* Email Input */}
            <IonItem className="input-item">
              <IonIcon icon={mail} slot="start" color="medium" />
              <IonInput
                ref={emailRef}
                type="email"
                placeholder="tu@email.com"
                value={formData.email}
                onIonChange={(e) => handleEmailChange(e.detail.value)}
                enterkeyhint="next"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    passwordRef.current?.setFocus();
                  }
                }}
              />
            </IonItem>

            {/* Password Input */}
            <IonItem className="input-item">
              <IonIcon icon={lockClosed} slot="start" color="medium" />
              <IonInput
                ref={passwordRef}
                type={formData.showPassword ? 'text' : 'password'}
                placeholder="Tu contraseña (mín. 6 caracteres)"
                value={formData.password}
                onIonChange={(e) => handlePasswordChange(e.detail.value)}
                enterkeyhint="next"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    confirmPasswordRef.current?.setFocus();
                  }
                }}
              />
              <IonButton
                fill="clear"
                slot="end"
                onClick={handleToggleShowPassword}
                className="password-toggle"
              >
                <IonIcon
                  icon={formData.showPassword ? eyeOff : eye}
                  color="medium"
                />
              </IonButton>
            </IonItem>

            {/* Confirm Password Input */}
            <IonItem className="input-item">
              <IonIcon icon={lockClosed} slot="start" color="medium" />
              <IonInput
                ref={confirmPasswordRef}
                type={formData.showPassword ? 'text' : 'password'}
                placeholder="Confirma tu contraseña"
                value={formData.confirmPassword}
                onIonChange={(e) => handleConfirmPasswordChange(e.detail.value)}
                enterkeyhint="done"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleRegister();
                  }
                }}
              />
            </IonItem>
          </IonList>

          {/* Register Button */}
          <IonButton
            expand="block"
            size="large"
            onClick={handleRegister}
            disabled={formData.isLoading}
            className="register-btn"
          >
            <IonIcon icon={personAdd} slot="start" />
            {formData.isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </IonButton>

          {/* Login Link */}
          <div className="login-container">
            <IonText color="medium">¿Ya tienes cuenta?</IonText>
            <IonButton
              fill="clear"
              size="small"
              onClick={navigateToLogin}
              className="login-btn"
            >
              <IonText color="primary">Inicia Sesión</IonText>
            </IonButton>
          </div>
        </div>

        {/* Loading Spinner */}
        <IonLoading
          isOpen={formData.isLoading}
          message="Creando cuenta..."
        />

        {/* Alert */}
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header="Aviso"
          message={alertMessage}
          buttons={['OK']}
        />
      </IonContent>
    </IonPage>
  );
};

export default Register;