import React from 'react';
import {
  IonMenu,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonIcon,
  IonLabel,
  IonText,
  IonButton,
  IonButtons,
  IonMenuToggle,
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
  close,
  logOut,
  sparkles,
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

interface SidebarProps {
  selectedCategory?: string;
  onCategorySelect?: (category: string) => void;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  selectedCategory = 'personal',
  onCategorySelect
}) => {
  const history = useHistory();
  const { user, signOut } = useAuth();

  const categories: Category[] = [
    {
      id: 'personal',
      name: 'Mi Perfil',
      icon: person,
      color: 'primary',
      description: 'Eventos personales y generales'
    },
    {
      id: 'work',
      name: 'Trabajo',
      icon: briefcase,
      color: 'warning',
      description: 'Reuniones y actividades laborales'
    },
    {
      id: 'school',
      name: 'Escuela',
      icon: school,
      color: 'secondary',
      description: 'Clases y actividades académicas'
    },
    {
      id: 'health',
      name: 'Salud',
      icon: medical,
      color: 'success',
      description: 'Alimentación, ejercicio y bienestar'
    },
    {
      id: 'finance',
      name: 'Finanzas',
      icon: wallet,
      color: 'success',
      description: 'Gestión financiera y contabilidad personal'
    },
    {
      id: 'events',
      name: 'Eventos',
      icon: calendar,
      color: 'primary',
      description: 'Cumpleaños, organización y recordatorios'
    },
    {
      id: 'languages',
      name: 'Idiomas',
      icon: language,
      color: 'tertiary',
      description: 'Clases y práctica de idiomas'
    },
    {
      id: 'menstrual',
      name: 'Calendario Menstrual',
      icon: flower,
      color: 'danger',
      description: 'Seguimiento del ciclo menstrual'
    },
    {
      id: 'travel',
      name: 'Viajes',
      icon: airplane,
      color: 'warning',
      description: 'Planificación de viajes y tours'
    },
    {
      id: 'pets',
      name: 'Mascotas',
      icon: paw,
      color: 'primary',
      description: 'Cuidado y planificación de mascotas'
    },
    {
      id: 'selfcare',
      name: 'Cuidado Personal',
      icon: heart,
      color: 'danger',
      description: 'Bienestar y autocuidado personal'
    },
    {
      id: 'reading',
      name: 'Lectura',
      icon: book,
      color: 'tertiary',
      description: 'Diario de lectura y seguimiento de libros'
    },
    {
      id: 'movies',
      name: 'Películas',
      icon: film,
      color: 'warning',
      description: 'Diario de películas y seguimiento de sagas'
    }
  ];

  const handleCategorySelect = (categoryId: string) => {
    if (onCategorySelect) {
      onCategorySelect(categoryId);
    }
    // Navigate to the category route
    history.push(`/${categoryId}`);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      history.push('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const getCategoryColor = (color: string) => {
    const colorMap: { [key: string]: string } = {
      primary: '#007bff',
      secondary: '#6c757d',
      success: '#28a745',
      danger: '#dc3545',
      warning: '#ffc107',
      info: '#17a2b8',
      tertiary: '#6f42c1'
    };
    return colorMap[color] || colorMap.primary;
  };

  return (
    <IonMenu contentId="main-content" className="custom-sidebar">
      <IonHeader>
        <IonToolbar className="sidebar-toolbar">
          <div className="sidebar-header">
            <div className="sidebar-title-section">
              <IonIcon icon={sparkles} className="sidebar-sparkle" />
              <IonTitle className="sidebar-title">Categorías</IonTitle>
            </div>
            <IonButtons slot="end">
              <IonMenuToggle>
                <IonButton className="sidebar-close-btn">
                  <IonIcon icon={close} />
                </IonButton>
              </IonMenuToggle>
            </IonButtons>
          </div>
          <IonText className="sidebar-subtitle">
            Elige tu área de enfoque
          </IonText>
        </IonToolbar>
      </IonHeader>

      <IonContent className="sidebar-content">
        <IonList className="categories-list">
          {categories.map((category) => (
            <IonItem
              key={category.id}
              className={`category-item ${selectedCategory === category.id ? 'selected' : ''}`}
              onClick={() => handleCategorySelect(category.id)}
              detail={false}
            >
              <div className="category-content">
                <div
                  className="category-icon"
                  style={{ backgroundColor: getCategoryColor(category.color) }}
                >
                  <IonIcon icon={category.icon} />
                </div>
                <div className="category-info">
                  <IonLabel className="category-name">
                    {category.name}
                  </IonLabel>
                  <IonText className="category-description">
                    {category.description}
                  </IonText>
                </div>
                {selectedCategory === category.id && (
                  <div className="selected-indicator">
                    <IonIcon icon={sparkles} />
                  </div>
                )}
              </div>
            </IonItem>
          ))}
        </IonList>

        <div className="sidebar-footer">
          <div className="footer-info">
            <IonIcon icon={sparkles} />
            <IonText className="footer-text">
              Cada categoría tiene su propia agenda
            </IonText>
          </div>

          <IonButton
            expand="block"
            color="danger"
            onClick={handleLogout}
            className="logout-button"
          >
            <IonIcon icon={logOut} slot="start" />
            <IonLabel>Cerrar Sesión</IonLabel>
          </IonButton>
        </div>
      </IonContent>
    </IonMenu>
  );
};

export default Sidebar;
