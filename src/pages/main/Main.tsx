import React, { useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonMenu,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonMenuButton,
  IonButtons,
  IonButton,
  IonText,
  IonAvatar,
  IonChip,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
} from '@ionic/react';
import {
  person,
  briefcase,
  school,
  medical,
  wallet,
  calendar,
  language,
  flower,
  airplane,
  paw,
  heart,
  book,
  film,
  logOut,
  menu,
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Main: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { user, signOut } = useAuth();
  const history = useHistory();

  const categories = [
    {
      id: 'personal',
      name: 'Mi Perfil',
      icon: person,
      color: '#4F46E5',
      description: 'Eventos personales y generales',
    },
    {
      id: 'work',
      name: 'Trabajo',
      icon: briefcase,
      color: '#FF6B6B',
      description: 'Reuniones y actividades laborales',
    },
    {
      id: 'school',
      name: 'Escuela',
      icon: school,
      color: '#4ECDC4',
      description: 'Clases y actividades académicas',
    },
    {
      id: 'health',
      name: 'Salud',
      icon: medical,
      color: '#45B7D1',
      description: 'Alimentación, ejercicio y bienestar',
    },
    {
      id: 'finance',
      name: 'Finanzas',
      icon: wallet,
      color: '#4CAF50',
      description: 'Gestión financiera y contabilidad',
    },
    {
      id: 'events',
      name: 'Eventos',
      icon: calendar,
      color: '#E91E63',
      description: 'Cumpleaños y recordatorios',
    },
    {
      id: 'languages',
      name: 'Idiomas',
      icon: language,
      color: '#FFEAA7',
      description: 'Clases y práctica de idiomas',
    },
    {
      id: 'menstrual',
      name: 'Calendario Menstrual',
      icon: flower,
      color: '#DDA0DD',
      description: 'Seguimiento del ciclo menstrual',
    },
    {
      id: 'travel',
      name: 'Viajes',
      icon: airplane,
      color: '#FF9F43',
      description: 'Planificación de viajes',
    },
    {
      id: 'pets',
      name: 'Mascotas',
      icon: paw,
      color: '#FF6B9D',
      description: 'Cuidado de mascotas',
    },
    {
      id: 'selfcare',
      name: 'Cuidado Personal',
      icon: heart,
      color: '#E91E63',
      description: 'Bienestar personal',
    },
    {
      id: 'reading',
      name: 'Lectura',
      icon: book,
      color: '#3F51B5',
      description: 'Diario de lectura',
    },
    {
      id: 'movies',
      name: 'Películas',
      icon: film,
      color: '#FF5722',
      description: 'Diario de películas',
    },
  ];

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    // Navigate to the specific category page
    history.push(`/${categoryId}`);
  };

  const handleLogout = async () => {
    await signOut();
    history.push('/login');
  };

  const renderWelcomeContent = () => (
    <div className="welcome-content">
      <div className="welcome-header">
        <IonAvatar className="user-avatar">
          <IonIcon icon={person} size="large" />
        </IonAvatar>
        <h1 className="welcome-title">¡Bienvenido a AgendaApp!</h1>
        <IonText color="medium" className="welcome-subtitle">
          Hola, {user?.name || user?.email || 'Usuario'}
        </IonText>
      </div>

        <IonCard className="welcome-card">
          <IonCardHeader>
            <IonCardTitle>¡Organiza tu vida de manera inteligente!</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonText>
              AgendaApp te ayuda a mantener todo organizado: desde tus tareas diarias hasta tus hobbies favoritos.
              Explora las categorías disponibles y comienza a optimizar tu tiempo.
            </IonText>
          </IonCardContent>
        </IonCard>

      <div className="quick-stats">
        <IonGrid>
          <IonRow>
            <IonCol size="6">
              <IonCard className="stat-card">
                <IonCardContent>
                  <IonText color="primary" className="stat-number">13</IonText>
                  <IonText color="medium">Categorías</IonText>
                </IonCardContent>
              </IonCard>
            </IonCol>
            <IonCol size="6">
              <IonCard className="stat-card">
                <IonCardContent>
                  <IonText color="success" className="stat-number">∞</IonText>
                  <IonText color="medium">Posibilidades</IonText>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>
      </div>
    </div>
  );

  return (
    <>
      {/* Menu lateral */}
      <IonMenu contentId="main-content">
        <IonHeader>
          <IonToolbar>
            <IonTitle>Menú de Navegación</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div className="menu-header">
            <IonAvatar className="menu-avatar">
              <IonIcon icon={person} />
            </IonAvatar>
            <div className="menu-user-info">
              <IonText className="menu-user-name">
                {user?.name || 'Usuario'}
              </IonText>
              <IonText color="medium" className="menu-user-email">
                {user?.email}
              </IonText>
            </div>
          </div>

          <IonList lines="none">
            {categories.map((category) => (
              <IonItem
                key={category.id}
                button
                onClick={() => handleCategorySelect(category.id)}
                className={selectedCategory === category.id ? 'selected' : ''}
              >
                <IonIcon
                  icon={category.icon}
                  slot="start"
                  style={{ color: category.color }}
                />
                <IonLabel>
                  <h2>{category.name}</h2>
                  <p>{category.description}</p>
                </IonLabel>
                {selectedCategory === category.id && (
                  <IonIcon icon="checkmark" slot="end" color="primary" />
                )}
              </IonItem>
            ))}
          </IonList>

          <div className="menu-footer">
            <IonButton
              expand="block"
              fill="outline"
              color="danger"
              onClick={handleLogout}
              className="logout-btn"
            >
              <IonIcon icon={logOut} slot="start" />
              Cerrar Sesión
            </IonButton>
          </div>
        </IonContent>
      </IonMenu>

      {/* Contenido principal */}
      <IonPage id="main-content">
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton>
                <IonIcon icon={menu} />
              </IonMenuButton>
            </IonButtons>
            <IonTitle>AgendaApp</IonTitle>
            <IonButtons slot="end">
              {/* Botón de logout movido al menú lateral para mejor UX */}
            </IonButtons>
          </IonToolbar>
        </IonHeader>

        <IonContent>
          {renderWelcomeContent()}

          <div className="categories-grid">
            <h2 className="section-title">Explora tus Categorías</h2>
            <IonGrid>
              <IonRow>
                {categories.map((category) => (
                  <IonCol size="6" sizeMd="4" sizeLg="3" key={category.id}>
                    <IonCard
                      button
                      onClick={() => handleCategorySelect(category.id)}
                      className={`category-card ${selectedCategory === category.id ? 'selected' : ''}`}
                    >
                      <IonCardContent className="category-content">
                        <div
                          className="category-icon"
                          style={{ backgroundColor: category.color }}
                        >
                          <IonIcon icon={category.icon} />
                        </div>
                        <IonText className="category-name">
                          {category.name}
                        </IonText>
                        <IonText color="medium" className="category-description">
                          {category.description}
                        </IonText>
                      </IonCardContent>
                    </IonCard>
                  </IonCol>
                ))}
              </IonRow>
            </IonGrid>
          </div>
        </IonContent>
      </IonPage>
    </>
  );
};

export default Main;