import React from 'react';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonText,
  IonChip,
} from '@ionic/react';
import {
  menu,
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
} from 'ionicons/icons';

interface HeaderProps {
  onOpenSidebar: () => void;
  selectedCategory?: string;
  userName?: string;
}

const Header: React.FC<HeaderProps> = ({
  onOpenSidebar,
  selectedCategory = 'personal',
  userName = 'Usuario'
}) => {
  const getCurrentGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return 'Buenos días';
    } else if (hour < 18) {
      return 'Buenas tardes';
    } else {
      return 'Buenas noches';
    }
  };

  const getCategoryName = (category: string): string => {
    const categoryNames: { [key: string]: string } = {
      personal: 'Mi Perfil',
      work: 'Trabajo',
      school: 'Escuela',
      nutrition: 'Alimentación',
      exercise: 'Ejercicio',
      languages: 'Idiomas',
      menstrual: 'Calendario Menstrual',
      health: 'Salud',
      finance: 'Finanzas',
      events: 'Eventos',
      travel: 'Viajes',
      pets: 'Mascotas',
      selfcare: 'Cuidado Personal',
      reading: 'Lectura',
      movies: 'Películas'
    };
    return categoryNames[category] || 'Personal';
  };

  const getCategoryIcon = (category: string) => {
    const categoryIcons: { [key: string]: string } = {
      personal: person,
      work: briefcase,
      school: school,
      nutrition: 'restaurant',
      exercise: 'fitness',
      languages: language,
      menstrual: flower,
      health: medical,
      finance: wallet,
      events: calendar,
      travel: airplane,
      pets: paw,
      selfcare: heart,
      reading: book,
      movies: film,
    };
    return categoryIcons[category] || person;
  };

  const getCategoryColor = (category: string): string => {
    const categoryColors: { [key: string]: string } = {
      personal: 'primary',
      work: 'warning',
      school: 'secondary',
      nutrition: 'success',
      exercise: 'tertiary',
      languages: 'primary',
      menstrual: 'danger',
      health: 'success',
      finance: 'success',
      events: 'primary',
      travel: 'warning',
      pets: 'primary',
      selfcare: 'danger',
      reading: 'tertiary',
      movies: 'warning',
    };
    return categoryColors[category] || 'primary';
  };

  return (
    <IonHeader className="custom-header">
      <IonToolbar className="header-toolbar">
        <IonButtons slot="start">
          <IonButton onClick={onOpenSidebar} className="menu-button">
            <IonIcon icon={menu} />
          </IonButton>
        </IonButtons>

        <div className="header-content">
          <div className="greeting-section">
            <IonText className="greeting-text">{getCurrentGreeting()}</IonText>
            <IonText className="user-name">{userName}</IonText>
          </div>

          <div className="category-section">
            <IonChip
              color={getCategoryColor(selectedCategory)}
              className="category-chip"
            >
              <IonIcon icon={getCategoryIcon(selectedCategory)} />
              <IonLabel>{getCategoryName(selectedCategory)}</IonLabel>
            </IonChip>
          </div>
        </div>
      </IonToolbar>
    </IonHeader>
  );
};

export default Header;
