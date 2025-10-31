import React, { useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonMenuButton,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonIcon,
  IonList,
  IonItem,
  IonInput,
  IonTextarea,
  IonModal,
  IonGrid,
  IonRow,
  IonCol,
  IonChip,
  IonSelect,
  IonSelectOption,
  IonBadge,
  IonProgressBar,
} from '@ionic/react';
import {
  book,
  bookmark,
  star,
  add,
  close,
  checkmarkCircle,
  time,
} from 'ionicons/icons';

const Reading: React.FC = () => {
  const [activeSection, setActiveSection] = useState('library');
  const [showBookModal, setShowBookModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);

  // Estados para biblioteca
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    genre: 'Ficción',
    status: 'Por leer',
    rating: 0,
    pages: '',
    currentPage: '',
    startDate: '',
    finishDate: '',
    notes: ''
  });

  // Estados para metas de lectura
  const [readingGoals, setReadingGoals] = useState([]);
  const [newGoal, setNewGoal] = useState({
    type: 'Libros',
    target: '',
    period: 'Mensual',
    startDate: '',
    endDate: '',
    current: ''
  });

  // Estados para estadísticas
  const [stats, setStats] = useState({
    booksReadThisYear: 12,
    pagesReadThisYear: 3840,
    averageRating: 4.2,
    favoriteGenre: 'Ficción',
    readingStreak: 15,
    totalBooks: 45
  });

  // Estados para reseñas
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    bookId: '',
    rating: 5,
    review: '',
    favoriteQuotes: '',
    dateRead: ''
  });

  const addBook = () => {
    if (newBook.title && newBook.author) {
      setBooks([...books, { ...newBook, id: Date.now() }]);
      setNewBook({
        title: '',
        author: '',
        genre: 'Ficción',
        status: 'Por leer',
        rating: 0,
        pages: '',
        currentPage: '',
        startDate: '',
        finishDate: '',
        notes: ''
      });
      setShowBookModal(false);
    }
  };

  const addGoal = () => {
    if (newGoal.target && newGoal.period) {
      setReadingGoals([...readingGoals, { ...newGoal, id: Date.now() }]);
      setNewGoal({
        type: 'Libros',
        target: '',
        period: 'Mensual',
        startDate: '',
        endDate: '',
        current: ''
      });
      setShowGoalModal(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Leído': return 'success';
      case 'Leyendo': return 'primary';
      case 'Por leer': return 'medium';
      case 'Abandonado': return 'danger';
      default: return 'medium';
    }
  };

  const renderLibrary = () => (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>
          <IonIcon icon={book} slot="start" />
          Mi Biblioteca
        </IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonButton
          expand="block"
          color="primary"
          onClick={() => setShowBookModal(true)}
        >
          <IonIcon icon={add} slot="start" />
          Agregar Libro
        </IonButton>

        <div style={{ marginTop: '20px' }}>
          <IonList>
            {books.map((book: any) => (
              <IonItem key={book.id}>
                <IonIcon icon={book} slot="start" />
                <IonLabel>
                  <h3>{book.title}</h3>
                  <p>{book.author} • {book.genre}</p>
                  <p>Páginas: {book.currentPage || 0}/{book.pages || '?'}</p>
                  {book.rating > 0 && (
                    <p>⭐ {book.rating}/5</p>
                  )}
                </IonLabel>
                <IonChip color={getStatusColor(book.status)} slot="end">
                  {book.status}
                </IonChip>
              </IonItem>
            ))}
          </IonList>
        </div>
      </IonCardContent>
    </IonCard>
  );

  const renderGoals = () => (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>
          <IonIcon icon={bookmark} slot="start" />
          Metas de Lectura
        </IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonButton
          expand="block"
          color="secondary"
          onClick={() => setShowGoalModal(true)}
        >
          <IonIcon icon={add} slot="start" />
          Nueva Meta
        </IonButton>

        <div style={{ marginTop: '20px' }}>
          <IonList>
            {readingGoals.map((goal: any) => (
              <IonItem key={goal.id}>
                <IonLabel>
                  <h3>{goal.target} {goal.type}</h3>
                  <p>Período: {goal.period}</p>
                  <p>Progreso: {goal.current || 0}/{goal.target} {goal.type.toLowerCase()}</p>
                  <IonProgressBar
                    value={(parseInt(goal.current) || 0) / parseInt(goal.target)}
                    style={{ marginTop: '8px' }}
                  />
                </IonLabel>
                <IonBadge color="primary" slot="end">
                  {Math.round(((parseInt(goal.current) || 0) / parseInt(goal.target)) * 100)}%
                </IonBadge>
              </IonItem>
            ))}
          </IonList>
        </div>
      </IonCardContent>
    </IonCard>
  );

  const renderStats = () => (
    <div>
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>📊 Estadísticas de Lectura</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <IonGrid>
            <IonRow>
              <IonCol size="6">
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <IonIcon icon={book} size="large" color="primary" />
                  <h2>{stats.booksReadThisYear}</h2>
                  <p>Libros este año</p>
                </div>
              </IonCol>
              <IonCol size="6">
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <IonIcon icon={time} size="large" color="secondary" />
                  <h2>{stats.pagesReadThisYear.toLocaleString()}</h2>
                  <p>Páginas leídas</p>
                </div>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol size="6">
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <IonIcon icon={star} size="large" color="warning" />
                  <h2>{stats.averageRating}</h2>
                  <p>Calificación promedio</p>
                </div>
              </IonCol>
              <IonCol size="6">
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <IonIcon icon={checkmarkCircle} size="large" color="success" />
                  <h2>{stats.readingStreak}</h2>
                  <p>Racha de días</p>
                </div>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCardContent>
      </IonCard>

      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Géneros Favoritos</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <IonGrid>
            <IonRow>
              <IonCol size="6">
                <IonChip color="primary">Ficción</IonChip>
              </IonCol>
              <IonCol size="6">
                <IonChip color="secondary">Biografías</IonChip>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol size="6">
                <IonChip color="tertiary">Ciencia</IonChip>
              </IonCol>
              <IonCol size="6">
                <IonChip color="success">Autoayuda</IonChip>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCardContent>
      </IonCard>
    </div>
  );

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Lectura</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonSegment
          value={activeSection}
          onIonChange={(e) => setActiveSection(e.detail.value!)}
          style={{ marginBottom: '20px' }}
        >
          <IonSegmentButton value="library">
            <IonLabel>Biblioteca</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="goals">
            <IonLabel>Metas</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="stats">
            <IonLabel>Estadísticas</IonLabel>
          </IonSegmentButton>
        </IonSegment>

        {activeSection === 'library' && renderLibrary()}
        {activeSection === 'goals' && renderGoals()}
        {activeSection === 'stats' && renderStats()}

        {/* Modal para agregar libro */}
        <IonModal isOpen={showBookModal}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Agregar Libro</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowBookModal(false)}>
                  <IonIcon icon={close} />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonList>
              <IonItem>
                <IonLabel position="stacked">Título</IonLabel>
                <IonInput
                  value={newBook.title}
                  placeholder="El nombre del viento"
                  onIonChange={(e) => setNewBook({...newBook, title: e.detail.value!})}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Autor</IonLabel>
                <IonInput
                  value={newBook.author}
                  placeholder="Patrick Rothfuss"
                  onIonChange={(e) => setNewBook({...newBook, author: e.detail.value!})}
                />
              </IonItem>
              <IonItem>
                <IonLabel>Género</IonLabel>
                <IonSelect
                  value={newBook.genre}
                  onSelectionChange={(e) => setNewBook({...newBook, genre: e.detail.value!})}
                >
                  <IonSelectOption value="Ficción">Ficción</IonSelectOption>
                  <IonSelectOption value="No Ficción">No Ficción</IonSelectOption>
                  <IonSelectOption value="Biografías">Biografías</IonSelectOption>
                  <IonSelectOption value="Ciencia">Ciencia</IonSelectOption>
                  <IonSelectOption value="Historia">Historia</IonSelectOption>
                  <IonSelectOption value="Autoayuda">Autoayuda</IonSelectOption>
                  <IonSelectOption value="Poesía">Poesía</IonSelectOption>
                  <IonSelectOption value="Otro">Otro</IonSelectOption>
                </IonSelect>
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Número de Páginas</IonLabel>
                <IonInput
                  type="number"
                  value={newBook.pages}
                  placeholder="662"
                  onIonChange={(e) => setNewBook({...newBook, pages: e.detail.value!})}
                />
              </IonItem>
              <IonItem>
                <IonLabel>Estado</IonLabel>
                <IonSelect
                  value={newBook.status}
                  onSelectionChange={(e) => setNewBook({...newBook, status: e.detail.value!})}
                >
                  <IonSelectOption value="Por leer">Por leer</IonSelectOption>
                  <IonSelectOption value="Leyendo">Leyendo</IonSelectOption>
                  <IonSelectOption value="Leído">Leído</IonSelectOption>
                  <IonSelectOption value="Abandonado">Abandonado</IonSelectOption>
                </IonSelect>
              </IonItem>
              {newBook.status === 'Leyendo' && (
                <IonItem>
                  <IonLabel position="stacked">Página Actual</IonLabel>
                  <IonInput
                    type="number"
                    value={newBook.currentPage}
                    placeholder="150"
                    onIonChange={(e) => setNewBook({...newBook, currentPage: e.detail.value!})}
                  />
                </IonItem>
              )}
              {newBook.status === 'Leído' && (
                <>
                  <IonItem>
                    <IonLabel position="stacked">Fecha de Inicio</IonLabel>
                    <IonInput
                      type="date"
                      value={newBook.startDate}
                      onIonChange={(e) => setNewBook({...newBook, startDate: e.detail.value!})}
                    />
                  </IonItem>
                  <IonItem>
                    <IonLabel position="stacked">Fecha de Fin</IonLabel>
                    <IonInput
                      type="date"
                      value={newBook.finishDate}
                      onIonChange={(e) => setNewBook({...newBook, finishDate: e.detail.value!})}
                    />
                  </IonItem>
                  <IonItem>
                    <IonLabel>Calificación</IonLabel>
                    <IonSelect
                      value={newBook.rating}
                      onSelectionChange={(e) => setNewBook({...newBook, rating: e.detail.value!})}
                    >
                      <IonSelectOption value={1}>⭐ 1 estrella</IonSelectOption>
                      <IonSelectOption value={2}>⭐⭐ 2 estrellas</IonSelectOption>
                      <IonSelectOption value={3}>⭐⭐⭐ 3 estrellas</IonSelectOption>
                      <IonSelectOption value={4}>⭐⭐⭐⭐ 4 estrellas</IonSelectOption>
                      <IonSelectOption value={5}>⭐⭐⭐⭐⭐ 5 estrellas</IonSelectOption>
                    </IonSelect>
                  </IonItem>
                </>
              )}
              <IonItem>
                <IonLabel position="stacked">Notas</IonLabel>
                <IonTextarea
                  value={newBook.notes}
                  placeholder="Impresiones, citas favoritas..."
                  rows={3}
                  onIonChange={(e) => setNewBook({...newBook, notes: e.detail.value!})}
                />
              </IonItem>
            </IonList>
            <IonButton
              expand="block"
              style={{ margin: '20px' }}
              onClick={addBook}
            >
              Agregar Libro
            </IonButton>
          </IonContent>
        </IonModal>

        {/* Modal para nueva meta */}
        <IonModal isOpen={showGoalModal}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Nueva Meta de Lectura</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowGoalModal(false)}>
                  <IonIcon icon={close} />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonList>
              <IonItem>
                <IonLabel>Tipo de Meta</IonLabel>
                <IonSelect
                  value={newGoal.type}
                  onSelectionChange={(e) => setNewGoal({...newGoal, type: e.detail.value!})}
                >
                  <IonSelectOption value="Libros">Libros</IonSelectOption>
                  <IonSelectOption value="Páginas">Páginas</IonSelectOption>
                  <IonSelectOption value="Horas">Horas de lectura</IonSelectOption>
                  <IonSelectOption value="Géneros">Géneros diferentes</IonSelectOption>
                </IonSelect>
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Objetivo</IonLabel>
                <IonInput
                  type="number"
                  value={newGoal.target}
                  placeholder="12"
                  onIonChange={(e) => setNewGoal({...newGoal, target: e.detail.value!})}
                />
              </IonItem>
              <IonItem>
                <IonLabel>Período</IonLabel>
                <IonSelect
                  value={newGoal.period}
                  onSelectionChange={(e) => setNewGoal({...newGoal, period: e.detail.value!})}
                >
                  <IonSelectOption value="Semanal">Semanal</IonSelectOption>
                  <IonSelectOption value="Mensual">Mensual</IonSelectOption>
                  <IonSelectOption value="Trimestral">Trimestral</IonSelectOption>
                  <IonSelectOption value="Anual">Anual</IonSelectOption>
                </IonSelect>
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Fecha de Inicio</IonLabel>
                <IonInput
                  type="date"
                  value={newGoal.startDate}
                  onIonChange={(e) => setNewGoal({...newGoal, startDate: e.detail.value!})}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Fecha de Fin</IonLabel>
                <IonInput
                  type="date"
                  value={newGoal.endDate}
                  onIonChange={(e) => setNewGoal({...newGoal, endDate: e.detail.value!})}
                />
              </IonItem>
            </IonList>
            <IonButton
              expand="block"
              style={{ margin: '20px' }}
              onClick={addGoal}
            >
              Crear Meta
            </IonButton>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Reading;
