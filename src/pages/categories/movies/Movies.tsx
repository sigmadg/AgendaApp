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
} from '@ionic/react';
import {
  film,
  star,
  add,
  close,
  checkmarkCircle,
  time,
} from 'ionicons/icons';

const Movies: React.FC = () => {
  const [activeSection, setActiveSection] = useState('watched');
  const [showMovieModal, setShowMovieModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Estados para películas vistas
  const [watchedMovies, setWatchedMovies] = useState([]);
  const [newMovie, setNewMovie] = useState({
    title: '',
    director: '',
    year: '',
    genre: 'Acción',
    rating: 0,
    duration: '',
    watchDate: '',
    whereWatched: 'Cine',
    notes: '',
    favorite: false
  });

  // Estados para películas pendientes
  const [watchlist, setWatchlist] = useState([]);
  const [newWatchlistItem, setNewWatchlistItem] = useState({
    title: '',
    director: '',
    year: '',
    genre: 'Acción',
    priority: 'Media',
    whyWatch: ''
  });

  // Estados para reseñas
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    movieId: '',
    rating: 5,
    review: '',
    favoriteScenes: '',
    recommend: true
  });

  // Estados para estadísticas
  const [stats, setStats] = useState({
    moviesWatchedThisYear: 47,
    totalWatchTime: 3120, // minutos
    averageRating: 7.8,
    favoriteGenre: 'Drama',
    watchStreak: 8,
    totalMovies: 156
  });

  const addMovie = () => {
    if (newMovie.title && newMovie.director) {
      setWatchedMovies([...watchedMovies, { ...newMovie, id: Date.now() }]);
      setNewMovie({
        title: '',
        director: '',
        year: '',
        genre: 'Acción',
        rating: 0,
        duration: '',
        watchDate: '',
        whereWatched: 'Cine',
        notes: '',
        favorite: false
      });
      setShowMovieModal(false);
    }
  };

  const addToWatchlist = () => {
    if (newWatchlistItem.title) {
      setWatchlist([...watchlist, { ...newWatchlistItem, id: Date.now() }]);
      setNewWatchlistItem({
        title: '',
        director: '',
        year: '',
        genre: 'Acción',
        priority: 'Media',
        whyWatch: ''
      });
    }
  };

  const addReview = () => {
    if (newReview.movieId && newReview.review) {
      setReviews([...reviews, { ...newReview, id: Date.now() }]);
      setNewReview({
        movieId: '',
        rating: 5,
        review: '',
        favoriteScenes: '',
        recommend: true
      });
      setShowReviewModal(false);
    }
  };

  const renderWatched = () => (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>
          <IonIcon icon={film} slot="start" />
          Películas Vistas
        </IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonButton
          expand="block"
          color="primary"
          onClick={() => setShowMovieModal(true)}
        >
          <IonIcon icon={add} slot="start" />
          Agregar Película Vista
        </IonButton>

        <div style={{ marginTop: '20px' }}>
          <IonList>
            {watchedMovies.map((movie: any) => (
              <IonItem key={movie.id}>
                <IonIcon icon={film} slot="start" />
                <IonLabel>
                  <h3>{movie.title}</h3>
                  <p>{movie.director} • {movie.year} • {movie.genre}</p>
                  <p>Vista el: {movie.watchDate} • {movie.whereWatched}</p>
                  {movie.rating > 0 && (
                    <p>⭐ {movie.rating}/10</p>
                  )}
                </IonLabel>
                {movie.favorite && (
                  <IonIcon icon={star} color="warning" slot="end" />
                )}
              </IonItem>
            ))}
          </IonList>
        </div>
      </IonCardContent>
    </IonCard>
  );

  const renderWatchlist = () => (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>
          <IonIcon icon={time} slot="start" />
          Lista de Pendientes
        </IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonButton
          expand="block"
          color="secondary"
          onClick={addToWatchlist}
        >
          <IonIcon icon={add} slot="start" />
          Agregar a Lista
        </IonButton>

        <div style={{ marginTop: '20px' }}>
          <IonList>
            {watchlist.map((item: any) => (
              <IonItem key={item.id}>
                <IonLabel>
                  <h3>{item.title}</h3>
                  <p>{item.director} • {item.year} • {item.genre}</p>
                  <p>Por qué verla: {item.whyWatch}</p>
                </IonLabel>
                <IonChip
                  color={
                    item.priority === 'Alta' ? 'danger' :
                    item.priority === 'Media' ? 'warning' : 'success'
                  }
                  slot="end"
                >
                  {item.priority}
                </IonChip>
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
          <IonCardTitle>🎬 Estadísticas de Cine</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <IonGrid>
            <IonRow>
              <IonCol size="6">
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <IonIcon icon={film} size="large" color="primary" />
                  <h2>{stats.moviesWatchedThisYear}</h2>
                  <p>Películas este año</p>
                </div>
              </IonCol>
              <IonCol size="6">
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <IonIcon icon={time} size="large" color="secondary" />
                  <h2>{Math.round(stats.totalWatchTime / 60)}h</h2>
                  <p>Tiempo total visto</p>
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
                  <h2>{stats.watchStreak}</h2>
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
                <IonChip color="primary">{stats.favoriteGenre}</IonChip>
              </IonCol>
              <IonCol size="6">
                <IonChip color="secondary">Comedia</IonChip>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol size="6">
                <IonChip color="tertiary">Ciencia Ficción</IonChip>
              </IonCol>
              <IonCol size="6">
                <IonChip color="success">Documentales</IonChip>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCardContent>
      </IonCard>
    </div>
  );

  const renderReviews = () => (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>
          <IonIcon icon={star} slot="start" />
          Mis Reseñas
        </IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonButton
          expand="block"
          color="tertiary"
          onClick={() => setShowReviewModal(true)}
        >
          <IonIcon icon={add} slot="start" />
          Nueva Reseña
        </IonButton>

        <div style={{ marginTop: '20px' }}>
          <IonList>
            {reviews.map((review: any) => (
              <IonItem key={review.id}>
                <IonLabel>
                  <h3>Película #{review.movieId}</h3>
                  <p>⭐ {review.rating}/10</p>
                  <p>{review.review.substring(0, 100)}...</p>
                  <p>Recomiendo: {review.recommend ? 'Sí' : 'No'}</p>
                </IonLabel>
                <IonBadge
                  color={review.recommend ? 'success' : 'danger'}
                  slot="end"
                >
                  {review.recommend ? '👍' : '👎'}
                </IonBadge>
              </IonItem>
            ))}
          </IonList>
        </div>
      </IonCardContent>
    </IonCard>
  );

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Películas</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonSegment
          value={activeSection}
          onIonChange={(e) => setActiveSection(e.detail.value!)}
          style={{ marginBottom: '20px' }}
        >
          <IonSegmentButton value="watched">
            <IonLabel>Vistas</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="watchlist">
            <IonLabel>Pendientes</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="stats">
            <IonLabel>Estadísticas</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="reviews">
            <IonLabel>Reseñas</IonLabel>
          </IonSegmentButton>
        </IonSegment>

        {activeSection === 'watched' && renderWatched()}
        {activeSection === 'watchlist' && renderWatchlist()}
        {activeSection === 'stats' && renderStats()}
        {activeSection === 'reviews' && renderReviews()}

        {/* Modal para agregar película vista */}
        <IonModal isOpen={showMovieModal}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Agregar Película Vista</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowMovieModal(false)}>
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
                  value={newMovie.title}
                  placeholder="Inception"
                  onIonChange={(e) => setNewMovie({...newMovie, title: e.detail.value!})}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Director</IonLabel>
                <IonInput
                  value={newMovie.director}
                  placeholder="Christopher Nolan"
                  onIonChange={(e) => setNewMovie({...newMovie, director: e.detail.value!})}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Año</IonLabel>
                <IonInput
                  type="number"
                  value={newMovie.year}
                  placeholder="2010"
                  onIonChange={(e) => setNewMovie({...newMovie, year: e.detail.value!})}
                />
              </IonItem>
              <IonItem>
                <IonLabel>Género</IonLabel>
                <IonSelect
                  value={newMovie.genre}
                  onSelectionChange={(e) => setNewMovie({...newMovie, genre: e.detail.value!})}
                >
                  <IonSelectOption value="Acción">Acción</IonSelectOption>
                  <IonSelectOption value="Aventura">Aventura</IonSelectOption>
                  <IonSelectOption value="Comedia">Comedia</IonSelectOption>
                  <IonSelectOption value="Drama">Drama</IonSelectOption>
                  <IonSelectOption value="Terror">Terror</IonSelectOption>
                  <IonSelectOption value="Ciencia Ficción">Ciencia Ficción</IonSelectOption>
                  <IonSelectOption value="Romance">Romance</IonSelectOption>
                  <IonSelectOption value="Documental">Documental</IonSelectOption>
                  <IonSelectOption value="Animación">Animación</IonSelectOption>
                  <IonSelectOption value="Otro">Otro</IonSelectOption>
                </IonSelect>
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Duración (minutos)</IonLabel>
                <IonInput
                  type="number"
                  value={newMovie.duration}
                  placeholder="148"
                  onIonChange={(e) => setNewMovie({...newMovie, duration: e.detail.value!})}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Fecha de Visualización</IonLabel>
                <IonInput
                  type="date"
                  value={newMovie.watchDate}
                  onIonChange={(e) => setNewMovie({...newMovie, watchDate: e.detail.value!})}
                />
              </IonItem>
              <IonItem>
                <IonLabel>Dónde la Viste</IonLabel>
                <IonSelect
                  value={newMovie.whereWatched}
                  onSelectionChange={(e) => setNewMovie({...newMovie, whereWatched: e.detail.value!})}
                >
                  <IonSelectOption value="Cine">Cine</IonSelectOption>
                  <IonSelectOption value="Casa">Casa</IonSelectOption>
                  <IonSelectOption value="Streaming">Plataforma de Streaming</IonSelectOption>
                  <IonSelectOption value="Teatro">Teatro</IonSelectOption>
                  <IonSelectOption value="Otro">Otro</IonSelectOption>
                </IonSelect>
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Calificación (0-10)</IonLabel>
                <IonInput
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={newMovie.rating}
                  placeholder="8.5"
                  onIonChange={(e) => setNewMovie({...newMovie, rating: e.detail.value!})}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Notas</IonLabel>
                <IonTextarea
                  value={newMovie.notes}
                  placeholder="Impresiones, escenas favoritas..."
                  rows={3}
                  onIonChange={(e) => setNewMovie({...newMovie, notes: e.detail.value!})}
                />
              </IonItem>
            </IonList>
            <IonButton
              expand="block"
              style={{ margin: '20px' }}
              onClick={addMovie}
            >
              Agregar Película
            </IonButton>
          </IonContent>
        </IonModal>

        {/* Modal para reseña */}
        <IonModal isOpen={showReviewModal}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Escribir Reseña</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowReviewModal(false)}>
                  <IonIcon icon={close} />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonList>
              <IonItem>
                <IonLabel position="stacked">ID de Película</IonLabel>
                <IonInput
                  value={newReview.movieId}
                  placeholder="1"
                  onIonChange={(e) => setNewReview({...newReview, movieId: e.detail.value!})}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Calificación (1-10)</IonLabel>
                <IonInput
                  type="number"
                  min="1"
                  max="10"
                  value={newReview.rating}
                  onIonChange={(e) => setNewReview({...newReview, rating: e.detail.value!})}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Reseña</IonLabel>
                <IonTextarea
                  value={newReview.review}
                  placeholder="Escribe tu opinión sobre la película..."
                  rows={4}
                  onIonChange={(e) => setNewReview({...newReview, review: e.detail.value!})}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Escenas Favoritas</IonLabel>
                <IonTextarea
                  value={newReview.favoriteScenes}
                  placeholder="Menciona tus escenas favoritas..."
                  rows={2}
                  onIonChange={(e) => setNewReview({...newReview, favoriteScenes: e.detail.value!})}
                />
              </IonItem>
            </IonList>
            <IonButton
              expand="block"
              style={{ margin: '20px' }}
              onClick={addReview}
            >
              Publicar Reseña
            </IonButton>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Movies;
