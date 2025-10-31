import React, { useState, useRef } from 'react';
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonInput,
  IonLabel,
  IonItem,
  IonText,
  IonCard,
  IonCardContent,
  IonLoading,
  IonAlert,
  IonImg,
} from '@ionic/react';
import { arrowBack, lockClosed, eye, eyeOff, checkmarkCircle } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';

const ResetPassword: React.FC = () => {
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
    showPassword: false,
    showConfirmPassword: false,
    isLoading: false
  });
  const [passwordReset, setPasswordReset] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const newPasswordRef = useRef<HTMLIonInputElement>(null);
  const confirmPasswordRef = useRef<HTMLIonInputElement>(null);
  const history = useHistory();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTogglePassword = (field: 'showPassword' | 'showConfirmPassword') => {
    setFormData(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validatePassword = (password: string) => {
    if (password.length < 6) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return 'La contraseña debe contener al menos una letra minúscula';
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return 'La contraseña debe contener al menos una letra mayúscula';
    }
    if (!/(?=.*\d)/.test(password)) {
      return 'La contraseña debe contener al menos un número';
    }
    return null;
  };

  const handleResetPassword = async () => {
    if (!formData.newPassword.trim()) {
      setAlertMessage('Por favor ingresa tu nueva contraseña');
      setShowAlert(true);
      newPasswordRef.current?.setFocus();
      return;
    }

    const passwordError = validatePassword(formData.newPassword);
    if (passwordError) {
      setAlertMessage(passwordError);
      setShowAlert(true);
      newPasswordRef.current?.setFocus();
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setAlertMessage('Las contraseñas no coinciden');
      setShowAlert(true);
      confirmPasswordRef.current?.setFocus();
      return;
    }

    setFormData(prev => ({ ...prev, isLoading: true }));

    try {
      // Simular actualización de contraseña (aquí iría la lógica real)
      await new Promise(resolve => setTimeout(resolve, 2000));

      setPasswordReset(true);
      setAlertMessage('¡Contraseña actualizada exitosamente! Ya puedes iniciar sesión con tu nueva contraseña.');
      setShowAlert(true);

      // Redirigir al login después de 3 segundos
      setTimeout(() => {
        history.push('/login');
      }, 3000);
    } catch (error) {
      setAlertMessage('Error al actualizar la contraseña. Intenta nuevamente.');
      setShowAlert(true);
    } finally {
      setFormData(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleBackToLogin = () => {
    history.push('/login');
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (/(?=.*[a-z])/.test(password)) strength++;
    if (/(?=.*[A-Z])/.test(password)) strength++;
    if (/(?=.*\d)/.test(password)) strength++;
    if (/(?=.*[!@#$%^&*])/.test(password)) strength++;

    return strength;
  };

  const getPasswordStrengthColor = (strength: number) => {
    if (strength <= 2) return '#EF4444'; // Rojo
    if (strength <= 3) return '#F59E0B'; // Amarillo
    if (strength <= 4) return '#10B981'; // Verde
    return '#059669'; // Verde oscuro
  };

  const getPasswordStrengthText = (strength: number) => {
    if (strength <= 2) return 'Débil';
    if (strength <= 3) return 'Regular';
    if (strength <= 4) return 'Buena';
    return 'Excelente';
  };

  const passwordStrength = getPasswordStrength(formData.newPassword);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={handleBackToLogin}>
              <IonIcon icon={arrowBack} />
            </IonButton>
          </IonButtons>
          <IonTitle>Nueva Contraseña</IonTitle>
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
          <p className="app-subtitle">Crea una nueva contraseña</p>
        </div>

        {!passwordReset ? (
          <IonCard>
            <IonCardContent>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <IonIcon
                  icon={lockClosed}
                  size="large"
                  color="primary"
                  style={{ fontSize: '48px', marginBottom: '16px' }}
                />
                <IonText>
                  <h2 style={{ margin: '0 0 8px 0', color: '#1F2937' }}>
                    Establecer Nueva Contraseña
                  </h2>
                  <p style={{ margin: '0', color: '#6B7280' }}>
                    Crea una contraseña segura para proteger tu cuenta.
                  </p>
                </IonText>
              </div>

              {/* Nueva Contraseña */}
              <IonItem style={{ marginBottom: '16px' }}>
                <IonIcon icon={lockClosed} slot="start" color="medium" />
                <IonLabel position="stacked">Nueva Contraseña *</IonLabel>
                <IonInput
                  ref={newPasswordRef}
                  type={formData.showPassword ? 'text' : 'password'}
                  placeholder="Ingresa tu nueva contraseña"
                  value={formData.newPassword}
                  onIonChange={(e) => handleInputChange('newPassword', e.detail.value!)}
                />
                <IonButton
                  fill="clear"
                  slot="end"
                  onClick={() => handleTogglePassword('showPassword')}
                >
                  <IonIcon icon={formData.showPassword ? eyeOff : eye} color="medium" />
                </IonButton>
              </IonItem>

              {/* Barra de fortaleza de contraseña */}
              {formData.newPassword && (
                <div style={{ marginBottom: '16px', padding: '8px', backgroundColor: '#F8FAFC', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <IonText style={{ fontSize: '12px', color: '#6B7280' }}>
                      Fortaleza:
                    </IonText>
                    <IonText
                      style={{
                        fontSize: '12px',
                        fontWeight: 'bold',
                        color: getPasswordStrengthColor(passwordStrength)
                      }}
                    >
                      {getPasswordStrengthText(passwordStrength)}
                    </IonText>
                  </div>
                  <div style={{ width: '100%', height: '4px', backgroundColor: '#E5E7EB', borderRadius: '2px' }}>
                    <div
                      style={{
                        width: `${(passwordStrength / 5) * 100}%`,
                        height: '100%',
                        backgroundColor: getPasswordStrengthColor(passwordStrength),
                        borderRadius: '2px',
                        transition: 'width 0.3s ease'
                      }}
                    />
                  </div>
                  <IonText style={{ fontSize: '11px', color: '#9CA3AF', display: 'block', marginTop: '4px' }}>
                    Usa mayúsculas, minúsculas, números y símbolos
                  </IonText>
                </div>
              )}

              {/* Confirmar Contraseña */}
              <IonItem style={{ marginBottom: '24px' }}>
                <IonIcon icon={lockClosed} slot="start" color="medium" />
                <IonLabel position="stacked">Confirmar Contraseña *</IonLabel>
                <IonInput
                  ref={confirmPasswordRef}
                  type={formData.showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirma tu nueva contraseña"
                  value={formData.confirmPassword}
                  onIonChange={(e) => handleInputChange('confirmPassword', e.detail.value!)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleResetPassword();
                    }
                  }}
                />
                <IonButton
                  fill="clear"
                  slot="end"
                  onClick={() => handleTogglePassword('showConfirmPassword')}
                >
                  <IonIcon icon={formData.showConfirmPassword ? eyeOff : eye} color="medium" />
                </IonButton>
              </IonItem>

              {/* Indicador de coincidencia */}
              {formData.confirmPassword && (
                <div style={{
                  marginBottom: '16px',
                  padding: '8px',
                  borderRadius: '8px',
                  backgroundColor: formData.newPassword === formData.confirmPassword ? '#F0FDF4' : '#FEF2F2'
                }}>
                  <IonText
                    style={{
                      fontSize: '12px',
                      color: formData.newPassword === formData.confirmPassword ? '#166534' : '#DC2626'
                    }}
                  >
                    {formData.newPassword === formData.confirmPassword ? '✓ Las contraseñas coinciden' : '✗ Las contraseñas no coinciden'}
                  </IonText>
                </div>
              )}

              <IonButton
                expand="block"
                size="large"
                onClick={handleResetPassword}
                disabled={formData.isLoading || !formData.newPassword || !formData.confirmPassword}
                style={{
                  '--background': '#10B981',
                  '--border-radius': '12px',
                  marginBottom: '16px'
                }}
              >
                <IonIcon icon={checkmarkCircle} slot="start" />
                {formData.isLoading ? 'Actualizando...' : 'Actualizar Contraseña'}
              </IonButton>

              <div style={{ textAlign: 'center' }}>
                <IonButton
                  fill="clear"
                  onClick={handleBackToLogin}
                  style={{ '--color': '#6B7280' }}
                >
                  <IonText color="medium">Volver al Inicio de Sesión</IonText>
                </IonButton>
              </div>
            </IonCardContent>
          </IonCard>
        ) : (
          <IonCard>
            <IonCardContent>
              <div style={{ textAlign: 'center' }}>
                <IonIcon
                  icon={checkmarkCircle}
                  size="large"
                  color="success"
                  style={{ fontSize: '64px', marginBottom: '16px' }}
                />
                <IonText>
                  <h2 style={{ margin: '0 0 16px 0', color: '#1F2937' }}>
                    ¡Contraseña Actualizada!
                  </h2>
                  <p style={{ margin: '0 0 24px 0', color: '#6B7280', lineHeight: '1.5' }}>
                    Tu contraseña ha sido cambiada exitosamente.
                    Ya puedes iniciar sesión con tu nueva contraseña.
                  </p>
                </IonText>

                <IonButton
                  expand="block"
                  onClick={handleBackToLogin}
                  style={{
                    '--background': '#10B981',
                    '--border-radius': '12px'
                  }}
                >
                  Ir al Inicio de Sesión
                </IonButton>
              </div>
            </IonCardContent>
          </IonCard>
        )}

        {/* Loading Spinner */}
        <IonLoading
          isOpen={formData.isLoading}
          message="Actualizando contraseña..."
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

export default ResetPassword;
