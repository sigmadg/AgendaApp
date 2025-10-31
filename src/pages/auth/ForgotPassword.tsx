import React, { useState } from 'react';
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
import { arrowBack, mail, send, checkmarkCircle } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const history = useHistory();

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSendResetEmail = async () => {
    if (!email.trim()) {
      setAlertMessage('Por favor ingresa tu email');
      setShowAlert(true);
      return;
    }

    if (!isValidEmail(email)) {
      setAlertMessage('Por favor ingresa un email válido');
      setShowAlert(true);
      return;
    }

    setIsLoading(true);

    try {
      // Simular envío de email (aquí iría la lógica real con backend)
      await new Promise(resolve => setTimeout(resolve, 2000));

      setEmailSent(true);
      setAlertMessage('¡Email enviado exitosamente! Revisa tu bandeja de entrada y sigue las instrucciones para recuperar tu contraseña.');
      setShowAlert(true);
    } catch (error) {
      setAlertMessage('Error al enviar el email. Intenta nuevamente.');
      setShowAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    history.push('/login');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={handleBackToLogin}>
              <IonIcon icon={arrowBack} />
            </IonButton>
          </IonButtons>
          <IonTitle>Recuperar Contraseña</IonTitle>
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
          <p className="app-subtitle">Recupera tu acceso</p>
        </div>

        {!emailSent ? (
          <IonCard>
            <IonCardContent>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <IonIcon
                  icon={mail}
                  size="large"
                  color="primary"
                  style={{ fontSize: '48px', marginBottom: '16px' }}
                />
                <IonText>
                  <h2 style={{ margin: '0 0 8px 0', color: '#1F2937' }}>
                    ¿Olvidaste tu contraseña?
                  </h2>
                  <p style={{ margin: '0', color: '#6B7280' }}>
                    No te preocupes, te ayudaremos a recuperarla.
                    Ingresa tu email y te enviaremos un enlace para crear una nueva contraseña.
                  </p>
                </IonText>
              </div>

              <IonItem style={{ marginBottom: '24px' }}>
                <IonIcon icon={mail} slot="start" color="medium" />
                <IonLabel position="stacked">Email</IonLabel>
                <IonInput
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onIonChange={(e) => setEmail(e.detail.value!)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSendResetEmail();
                    }
                  }}
                />
              </IonItem>

              <IonButton
                expand="block"
                size="large"
                onClick={handleSendResetEmail}
                disabled={isLoading}
                style={{
                  '--background': '#3B82F6',
                  '--border-radius': '12px',
                  marginBottom: '16px'
                }}
              >
                <IonIcon icon={send} slot="start" />
                {isLoading ? 'Enviando...' : 'Enviar Email de Recuperación'}
              </IonButton>

              <div style={{ textAlign: 'center' }}>
                <IonButton
                  fill="clear"
                  onClick={handleBackToLogin}
                  style={{ '--color': '#6B7280' }}
                >
                  <IonText color="medium">¿Recordaste tu contraseña?</IonText>
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
                    ¡Email Enviado!
                  </h2>
                  <p style={{ margin: '0 0 24px 0', color: '#6B7280', lineHeight: '1.5' }}>
                    Hemos enviado un enlace de recuperación a <strong>{email}</strong>.
                    Revisa tu bandeja de entrada y sigue las instrucciones para crear una nueva contraseña.
                  </p>
                  <p style={{ margin: '0 0 24px 0', color: '#9CA3AF', fontSize: '14px' }}>
                    Si no encuentras el email, revisa tu carpeta de spam o correo no deseado.
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
                  Volver al Inicio de Sesión
                </IonButton>
              </div>
            </IonCardContent>
          </IonCard>
        )}

        {/* Loading Spinner */}
        <IonLoading
          isOpen={isLoading}
          message="Enviando email de recuperación..."
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

export default ForgotPassword;
