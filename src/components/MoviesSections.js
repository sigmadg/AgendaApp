import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const MoviesSections = () => {
  const [activeSection, setActiveSection] = useState('movies-journal');
  
  // Estados para Movies Journal
  const [moviesJournal, setMoviesJournal] = useState({
    owner: '',
    movies: []
  });

  // Estados para Movies Log
  const [moviesLog, setMoviesLog] = useState({
    movies: [
      { id: 1, title: '', director: '', date: '', duration: '', rating: 0 },
      { id: 2, title: '', director: '', date: '', duration: '', rating: 0 },
      { id: 3, title: '', director: '', date: '', duration: '', rating: 0 },
      { id: 4, title: '', director: '', date: '', duration: '', rating: 0 },
      { id: 5, title: '', director: '', date: '', duration: '', rating: 0 }
    ],
    notes: ''
  });

  // Estados para Movie Tracer
  const [movieTracer, setMovieTracer] = useState({
    keyScenes: ['Opening', 'Climax', 'Resolution', 'Ending', 'Credits'],
    keyTakeaways: '',
    favoriteQuotes: '',
    monthlyProgress: Array(31).fill(false)
  });

  // Estados para Favorite Quotes
  const [favoriteQuotes, setFavoriteQuotes] = useState([
    { id: 1, quote: '', movie: '', character: '', date: '', rating: 0 },
    { id: 2, quote: '', movie: '', character: '', date: '', rating: 0 },
    { id: 3, quote: '', movie: '', character: '', date: '', rating: 0 },
    { id: 4, quote: '', movie: '', character: '', date: '', rating: 0 },
    { id: 5, quote: '', movie: '', character: '', date: '', rating: 0 },
    { id: 6, quote: '', movie: '', character: '', date: '', rating: 0 }
  ]);

  // Estados para Movie Series
  const [movieSeries, setMovieSeries] = useState([
    {
      id: 1,
      director: '',
      series: '',
      overview: '',
      movies: [
        { watchDate: '', duration: '', rating: 0 },
        { watchDate: '', duration: '', rating: 0 },
        { watchDate: '', duration: '', rating: 0 },
        { watchDate: '', duration: '', rating: 0 },
        { watchDate: '', duration: '', rating: 0 }
      ]
    },
    {
      id: 2,
      director: '',
      series: '',
      overview: '',
      movies: [
        { watchDate: '', duration: '', rating: 0 },
        { watchDate: '', duration: '', rating: 0 },
        { watchDate: '', duration: '', rating: 0 },
        { watchDate: '', duration: '', rating: 0 },
        { watchDate: '', duration: '', rating: 0 }
      ]
    }
  ]);

  // Estados para Movieshelf
  const [movieshelf, setMovieshelf] = useState({
    movies: Array(6).fill({ title: '', director: '', rating: 0, watched: false })
  });

  const sections = [
    { id: 'movies-journal', name: 'Diario de Películas', icon: 'film-outline' },
    { id: 'movies-log', name: 'Registro de Películas', icon: 'list-outline' },
    { id: 'favorite-quotes', name: 'Citas Favoritas', icon: 'quote-outline' },
    { id: 'movie-series', name: 'Sagas de Películas', icon: 'library-outline' },
    { id: 'movieshelf', name: 'Estantería de Películas', icon: 'library-outline' }
  ];

  const renderSectionTabs = () => (
    <View style={styles.tabsContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll}>
        {sections.map((section) => (
          <TouchableOpacity
            key={section.id}
            style={[
              styles.tab,
              activeSection === section.id && styles.activeTab
            ]}
            onPress={() => setActiveSection(section.id)}
          >
            <Icon 
              name={section.icon} 
              size={18} 
              color={activeSection === section.id ? '#FFFFFF' : '#6c757d'} 
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const updateMovieRating = (movieId, rating) => {
    setMoviesLog(prev => ({
      ...prev,
      movies: prev.movies.map(movie =>
        movie.id === movieId ? { ...movie, rating } : movie
      )
    }));
  };

  const updateMovieField = (movieId, field, value) => {
    setMoviesLog(prev => ({
      ...prev,
      movies: prev.movies.map(movie =>
        movie.id === movieId ? { ...movie, [field]: value } : movie
      )
    }));
  };

  const updateQuoteRating = (quoteId, rating) => {
    setFavoriteQuotes(prev =>
      prev.map(quote =>
        quote.id === quoteId ? { ...quote, rating } : quote
      )
    );
  };

  const updateQuoteField = (quoteId, field, value) => {
    setFavoriteQuotes(prev =>
      prev.map(quote =>
        quote.id === quoteId ? { ...quote, [field]: value } : quote
      )
    );
  };

  const updateSeriesField = (seriesId, field, value) => {
    setMovieSeries(prev =>
      prev.map(series =>
        series.id === seriesId ? { ...series, [field]: value } : series
      )
    );
  };

  const updateSeriesMovieField = (seriesId, movieIndex, field, value) => {
    setMovieSeries(prev =>
      prev.map(series =>
        series.id === seriesId
          ? {
              ...series,
              movies: series.movies.map((movie, index) =>
                index === movieIndex ? { ...movie, [field]: value } : movie
              )
            }
          : series
      )
    );
  };

  const updateSeriesMovieRating = (seriesId, movieIndex, rating) => {
    setMovieSeries(prev =>
      prev.map(series =>
        series.id === seriesId
          ? {
              ...series,
              movies: series.movies.map((movie, index) =>
                index === movieIndex ? { ...movie, rating } : movie
              )
            }
          : series
      )
    );
  };

  const updateMovieshelfMovie = (movieIndex, field, value) => {
    setMovieshelf(prev => ({
      ...prev,
      movies: prev.movies.map((movie, index) =>
        index === movieIndex ? { ...movie, [field]: value } : movie
      )
    }));
  };

  const updateMovieshelfRating = (movieIndex, rating) => {
    setMovieshelf(prev => ({
      ...prev,
      movies: prev.movies.map((movie, index) =>
        index === movieIndex ? { ...movie, rating } : movie
      )
    }));
  };

  const toggleMovieshelfWatched = (movieIndex) => {
    setMovieshelf(prev => ({
      ...prev,
      movies: prev.movies.map((movie, index) =>
        index === movieIndex ? { ...movie, watched: !movie.watched } : movie
      )
    }));
  };

  const renderStars = (rating, onRatingChange, size = 16) => (
    <View style={styles.starsContainer}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity
          key={star}
          onPress={() => onRatingChange(star)}
          style={styles.starButton}
        >
          <Icon
            name={star <= rating ? 'star' : 'star-outline'}
            size={size}
            color={star <= rating ? '#FFD700' : '#6c757d'}
          />
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderMoviesJournal = () => {
    // Datos de ejemplo para el diario de películas
    const sampleJournalData = {
      owner: 'María García',
      totalMovies: 24,
      watchedMovies: 18,
      averageRating: 4.2,
      currentStreak: 7,
      favoriteGenre: 'Drama',
      movies: [
        {
          id: '1',
          title: 'El Padrino',
          director: 'Francis Ford Coppola',
          genre: 'Drama',
          watchDate: '15/01/2024',
          finishDate: '15/01/2024',
          duration: '175 min',
          rating: 5,
          status: 'Completada',
          cover: '🎬',
          color: '#4CAF50',
          notes: 'Una obra maestra del cine. La actuación de Marlon Brando es excepcional.',
          mood: 'Increíble',
          location: 'Casa',
          companions: 'Solo'
        },
        {
          id: '2',
          title: 'Inception',
          director: 'Christopher Nolan',
          genre: 'Ciencia Ficción',
          watchDate: '20/01/2024',
          finishDate: '20/01/2024',
          duration: '148 min',
          rating: 4,
          status: 'Completada',
          cover: '🌪️',
          color: '#4CAF50',
          notes: 'Mente-bending. Necesité verla dos veces para entenderla completamente.',
          mood: 'Confundido pero fascinado',
          location: 'Cine',
          companions: 'Amigos'
        },
        {
          id: '3',
          title: 'Parasite',
          director: 'Bong Joon-ho',
          genre: 'Thriller',
          watchDate: '25/01/2024',
          finishDate: '25/01/2024',
          duration: '132 min',
          rating: 5,
          status: 'Completada',
          cover: '🏠',
          color: '#4CAF50',
          notes: 'Una crítica social brillante. Merece todos los premios que ganó.',
          mood: 'Impactado',
          location: 'Casa',
          companions: 'Familia'
        },
        {
          id: '4',
          title: 'Dune',
          director: 'Denis Villeneuve',
          genre: 'Ciencia Ficción',
          watchDate: '01/02/2024',
          finishDate: '',
          duration: '155 min',
          rating: 0,
          status: 'En Progreso',
          cover: '🏜️',
          color: '#FF9800',
          notes: 'Visualmente impresionante. La historia es compleja pero interesante.',
          mood: 'Intrigado',
          location: 'Cine IMAX',
          companions: 'Pareja'
        }
      ]
    };

    // Obtener color según el estado
    const getStatusColor = (status) => {
      switch (status) {
        case 'Completada': return '#4CAF50';
        case 'En Progreso': return '#FF9800';
        case 'Pendiente': return '#6B7280';
        default: return '#6B7280';
      }
    };

    // Obtener emoji según el género
    const getGenreEmoji = (genre) => {
      const emojiMap = {
        'Drama': '🎭',
        'Ciencia Ficción': '🚀',
        'Thriller': '🔪',
        'Comedia': '😂',
        'Acción': '💥',
        'Romance': '💕',
        'Terror': '👻',
        'Aventura': '⚔️'
      };
      return emojiMap[genre] || '🎬';
    };

    // Obtener color según el género
    const getGenreColor = (genre) => {
      const colorMap = {
        'Drama': '#4CAF50',
        'Ciencia Ficción': '#2196F3',
        'Thriller': '#9C27B0',
        'Comedia': '#FFC107',
        'Acción': '#FF5722',
        'Romance': '#E91E63',
        'Terror': '#795548',
        'Aventura': '#FF9800'
      };
      return colorMap[genre] || '#6B7280';
    };

    return (
      <ScrollView style={styles.journalContainer} showsVerticalScrollIndicator={false}>
        {/* Header mejorado */}
        <View style={styles.journalHeader}>
          <View style={styles.journalHeaderContent}>
            <View style={styles.journalHeaderIcon}>
              <Icon name="film" size={28} color="#FFFFFF" />
        </View>
            <View style={styles.journalHeaderText}>
              <Text style={styles.journalHeaderTitle}>Mi Diario de Películas</Text>
              <Text style={styles.journalHeaderSubtitle}>
                Tu colección personal de experiencias cinematográficas
              </Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.journalAddButton}
            onPress={() => {}}
          >
            <Icon name="add" size={20} color="#FFFFFF" />
          </TouchableOpacity>
      </View>

        {/* Panel de estadísticas personales */}
        <View style={styles.journalStatsPanel}>
          <View style={styles.journalStatsContent}>
            <Text style={styles.journalStatsTitle}>
              📊 Mis Estadísticas Cinematográficas
            </Text>
            <Text style={styles.journalStatsSubtitle}>
              Propietario: {sampleJournalData.owner}
            </Text>
          </View>
          <View style={styles.journalStatsGrid}>
            <View style={styles.journalStatCard}>
              <View style={styles.journalStatIcon}>
                <Icon name="film" size={20} color="#4CAF50" />
              </View>
              <Text style={styles.journalStatNumber}>{sampleJournalData.totalMovies}</Text>
              <Text style={styles.journalStatLabel}>Películas Registradas</Text>
            </View>
            <View style={styles.journalStatCard}>
              <View style={styles.journalStatIcon}>
                <Icon name="checkmark-circle" size={20} color="#2196F3" />
              </View>
              <Text style={styles.journalStatNumber}>{sampleJournalData.watchedMovies}</Text>
              <Text style={styles.journalStatLabel}>Vistas</Text>
            </View>
            <View style={styles.journalStatCard}>
              <View style={styles.journalStatIcon}>
                <Icon name="star" size={20} color="#FFC107" />
              </View>
              <Text style={styles.journalStatNumber}>{sampleJournalData.averageRating}</Text>
              <Text style={styles.journalStatLabel}>Calificación Promedio</Text>
            </View>
            <View style={styles.journalStatCard}>
              <View style={styles.journalStatIcon}>
                <Icon name="flame" size={20} color="#FF9800" />
              </View>
              <Text style={styles.journalStatNumber}>{sampleJournalData.currentStreak}</Text>
              <Text style={styles.journalStatLabel}>Días de Racha</Text>
            </View>
          </View>
        </View>

        {/* Género favorito */}
        <View style={styles.journalFavoriteGenre}>
          <View style={styles.journalFavoriteGenreContent}>
            <Text style={styles.journalFavoriteGenreTitle}>
              🏆 Género Favorito
            </Text>
            <View style={styles.journalFavoriteGenreBadge}>
              <Text style={styles.journalFavoriteGenreEmoji}>
                {getGenreEmoji(sampleJournalData.favoriteGenre)}
              </Text>
              <Text style={styles.journalFavoriteGenreText}>
                {sampleJournalData.favoriteGenre}
              </Text>
            </View>
          </View>
              </View>
              
        {/* Lista de películas */}
        <View style={styles.journalMoviesContainer}>
          <Text style={styles.journalMoviesTitle}>Mis Películas</Text>
          {sampleJournalData.movies.map((movie) => (
            <View key={movie.id} style={styles.journalMovieCard}>
              {/* Header de la película */}
              <View style={styles.journalMovieHeader}>
                <View style={styles.journalMovieCover}>
                  <Text style={styles.journalMovieCoverEmoji}>{movie.cover}</Text>
                </View>
                <View style={styles.journalMovieInfo}>
                  <Text style={styles.journalMovieTitle}>{movie.title}</Text>
                  <Text style={styles.journalMovieDirector}>{movie.director}</Text>
                  <View style={styles.journalMovieGenre}>
                    <Text style={styles.journalMovieGenreEmoji}>
                      {getGenreEmoji(movie.genre)}
                    </Text>
                    <Text style={styles.journalMovieGenreText}>{movie.genre}</Text>
                  </View>
                </View>
                <View style={[styles.journalMovieStatus, { backgroundColor: getStatusColor(movie.status) }]}>
                  <Text style={styles.journalMovieStatusText}>{movie.status}</Text>
                </View>
                </View>
                
              {/* Información de la película */}
              <View style={styles.journalMovieDetails}>
                <View style={styles.journalMovieDetailRow}>
                  <View style={styles.journalMovieDetailItem}>
                    <Icon name="calendar" size={14} color="#6B7280" />
                    <Text style={styles.journalMovieDetailLabel}>Fecha de visualización:</Text>
                    <Text style={styles.journalMovieDetailValue}>{movie.watchDate}</Text>
                  </View>
                  <View style={styles.journalMovieDetailItem}>
                    <Icon name="calendar-checkmark" size={14} color="#6B7280" />
                    <Text style={styles.journalMovieDetailLabel}>Fecha de finalización:</Text>
                    <Text style={styles.journalMovieDetailValue}>{movie.finishDate || 'En progreso'}</Text>
                  </View>
                </View>
                <View style={styles.journalMovieDetailRow}>
                  <View style={styles.journalMovieDetailItem}>
                    <Icon name="time" size={14} color="#6B7280" />
                    <Text style={styles.journalMovieDetailLabel}>Duración:</Text>
                    <Text style={styles.journalMovieDetailValue}>{movie.duration}</Text>
                  </View>
                  <View style={styles.journalMovieDetailItem}>
                    <Icon name="star" size={14} color="#FFC107" />
                    <Text style={styles.journalMovieDetailLabel}>Calificación:</Text>
                    <Text style={styles.journalMovieDetailValue}>
                      {movie.rating > 0 ? `${movie.rating}/5` : 'Sin calificar'}
                    </Text>
                  </View>
                </View>
                <View style={styles.journalMovieDetailRow}>
                  <View style={styles.journalMovieDetailItem}>
                    <Icon name="location" size={14} color="#6B7280" />
                    <Text style={styles.journalMovieDetailLabel}>Lugar:</Text>
                    <Text style={styles.journalMovieDetailValue}>{movie.location}</Text>
                  </View>
                  <View style={styles.journalMovieDetailItem}>
                    <Icon name="people" size={14} color="#6B7280" />
                    <Text style={styles.journalMovieDetailLabel}>Compañía:</Text>
                    <Text style={styles.journalMovieDetailValue}>{movie.companions}</Text>
                  </View>
                </View>
                </View>
                
              {/* Barra de progreso */}
              <View style={styles.journalMovieProgress}>
                <View style={styles.journalMovieProgressBar}>
                  <View 
                    style={[
                      styles.journalMovieProgressFill,
                      { 
                        width: movie.status === 'Completada' ? '100%' : 
                               movie.status === 'En Progreso' ? '60%' : '0%',
                        backgroundColor: getStatusColor(movie.status)
                      }
                    ]}
                  />
                </View>
                <Text style={styles.journalMovieProgressText}>
                  {movie.status === 'Completada' ? 'Completada' : 
                   movie.status === 'En Progreso' ? 'En Progreso' : 'Pendiente'}
                </Text>
                </View>
                
              {/* Notas personales */}
              {movie.notes && (
                <View style={styles.journalMovieNotes}>
                  <Text style={styles.journalMovieNotesTitle}>📝 Mis Notas</Text>
                  <Text style={styles.journalMovieNotesText}>{movie.notes}</Text>
                </View>
              )}

              {/* Estado de ánimo */}
              <View style={styles.journalMovieMood}>
                <Text style={styles.journalMovieMoodTitle}>😊 Estado de Ánimo:</Text>
                <Text style={styles.journalMovieMoodText}>{movie.mood}</Text>
              </View>

              {/* Botones de acción */}
              <View style={styles.journalMovieActions}>
                <TouchableOpacity style={styles.journalMovieActionButton}>
                  <Icon name="create" size={16} color="#4CAF50" />
                  <Text style={styles.journalMovieActionText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.journalMovieActionButton}>
                  <Icon name="share" size={16} color="#2196F3" />
                  <Text style={styles.journalMovieActionText}>Compartir</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.journalMovieActionButton}>
                  <Icon name="bookmark" size={16} color="#FF9800" />
                  <Text style={styles.journalMovieActionText}>Guardar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Botones de acción principales */}
        <View style={styles.journalActions}>
          <TouchableOpacity style={styles.journalActionButton}>
            <Icon name="add-circle" size={20} color="#4CAF50" />
            <Text style={styles.journalActionText}>Nueva Película</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.journalActionButton}>
            <Icon name="analytics" size={20} color="#2196F3" />
            <Text style={styles.journalActionText}>Ver Estadísticas</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.journalActionButton}>
            <Icon name="download" size={20} color="#FF9800" />
            <Text style={styles.journalActionText}>Exportar</Text>
          </TouchableOpacity>
      </View>
      </ScrollView>
    );
  };

  const renderMoviesLog = () => {
    // Datos de ejemplo para el registro de películas
    const sampleLogData = {
      totalMovies: 15,
      watchedThisMonth: 8,
      averageRating: 4.1,
      totalHours: 32.5,
      movies: [
        {
          id: '1',
          title: 'The Dark Knight',
          director: 'Christopher Nolan',
          genre: 'Acción',
          date: '15/01/2024',
          duration: '152 min',
          rating: 5,
          status: 'Completada',
          cover: '🦇',
          color: '#4CAF50',
          notes: 'Una obra maestra del cine de superhéroes. Heath Ledger como Joker es legendario.',
          mood: 'Impressionado',
          location: 'Cine IMAX',
          companions: 'Amigos',
          year: '2008',
          language: 'Inglés',
          format: 'Digital'
        },
        {
          id: '2',
          title: 'Pulp Fiction',
          director: 'Quentin Tarantino',
          genre: 'Crimen',
          date: '18/01/2024',
          duration: '154 min',
          rating: 5,
          status: 'Completada',
          cover: '💼',
          color: '#4CAF50',
          notes: 'Narrativa no lineal perfecta. Cada escena es memorable.',
          mood: 'Fascinado',
          location: 'Casa',
          companions: 'Solo',
          year: '1994',
          language: 'Inglés',
          format: 'Blu-ray'
        },
        {
          id: '3',
          title: 'Inception',
          director: 'Christopher Nolan',
          genre: 'Ciencia Ficción',
          date: '22/01/2024',
          duration: '148 min',
          rating: 4,
          status: 'Completada',
          cover: '🌪️',
          color: '#4CAF50',
          notes: 'Concepto brillante pero complejo. Necesita múltiples visualizaciones.',
          mood: 'Confundido pero fascinado',
          location: 'Cine',
          companions: 'Pareja',
          year: '2010',
          language: 'Inglés',
          format: 'Digital'
        },
        {
          id: '4',
          title: 'Parasite',
          director: 'Bong Joon-ho',
          genre: 'Thriller',
          date: '25/01/2024',
          duration: '132 min',
          rating: 5,
          status: 'Completada',
          cover: '🏠',
          color: '#4CAF50',
          notes: 'Crítica social devastadora. Merece todos los premios.',
          mood: 'Impactado',
          location: 'Casa',
          companions: 'Familia',
          year: '2019',
          language: 'Coreano',
          format: 'Streaming'
        },
        {
          id: '5',
          title: 'Dune',
          director: 'Denis Villeneuve',
          genre: 'Ciencia Ficción',
          date: '28/01/2024',
          duration: '155 min',
          rating: 4,
          status: 'En Progreso',
          cover: '🏜️',
          color: '#FF9800',
          notes: 'Visualmente impresionante. La historia es épica pero lenta.',
          mood: 'Intrigado',
          location: 'Cine IMAX',
          companions: 'Amigos',
          year: '2021',
          language: 'Inglés',
          format: 'Digital'
        }
      ]
    };

    // Obtener color según el estado
    const getStatusColor = (status) => {
      switch (status) {
        case 'Completada': return '#4CAF50';
        case 'En Progreso': return '#FF9800';
        case 'Pendiente': return '#6B7280';
        default: return '#6B7280';
      }
    };

    // Obtener emoji según el género
    const getGenreEmoji = (genre) => {
      const emojiMap = {
        'Acción': '💥',
        'Crimen': '🔫',
        'Ciencia Ficción': '🚀',
        'Thriller': '🔪',
        'Drama': '🎭',
        'Comedia': '😂',
        'Romance': '💕',
        'Terror': '👻',
        'Aventura': '⚔️'
      };
      return emojiMap[genre] || '🎬';
    };

    // Obtener color según el género
    const getGenreColor = (genre) => {
      const colorMap = {
        'Acción': '#FF5722',
        'Crimen': '#9C27B0',
        'Ciencia Ficción': '#2196F3',
        'Thriller': '#9C27B0',
        'Drama': '#4CAF50',
        'Comedia': '#FFC107',
        'Romance': '#E91E63',
        'Terror': '#795548',
        'Aventura': '#FF9800'
      };
      return colorMap[genre] || '#6B7280';
    };

    return (
      <ScrollView style={styles.logContainer} showsVerticalScrollIndicator={false}>
        {/* Header mejorado */}
        <View style={styles.logHeader}>
          <View style={styles.logHeaderContent}>
            <View style={styles.logHeaderIcon}>
              <Icon name="list" size={28} color="#FFFFFF" />
          </View>
            <View style={styles.logHeaderText}>
              <Text style={styles.logHeaderTitle}>Mi Registro de Películas</Text>
              <Text style={styles.logHeaderSubtitle}>
                Seguimiento detallado de tu experiencia cinematográfica
              </Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.logAddButton}
            onPress={() => {}}
          >
            <Icon name="add" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Panel de estadísticas del registro */}
        <View style={styles.logStatsPanel}>
          <View style={styles.logStatsContent}>
            <Text style={styles.logStatsTitle}>
              📊 Resumen de Mi Registro
            </Text>
            <Text style={styles.logStatsSubtitle}>
              Estadísticas de tu actividad cinematográfica
            </Text>
          </View>
          <View style={styles.logStatsGrid}>
            <View style={styles.logStatCard}>
              <View style={styles.logStatIcon}>
                <Icon name="film" size={20} color="#4CAF50" />
              </View>
              <Text style={styles.logStatNumber}>{sampleLogData.totalMovies}</Text>
              <Text style={styles.logStatLabel}>Películas Registradas</Text>
            </View>
            <View style={styles.logStatCard}>
              <View style={styles.logStatIcon}>
                <Icon name="calendar" size={20} color="#2196F3" />
              </View>
              <Text style={styles.logStatNumber}>{sampleLogData.watchedThisMonth}</Text>
              <Text style={styles.logStatLabel}>Este Mes</Text>
            </View>
            <View style={styles.logStatCard}>
              <View style={styles.logStatIcon}>
                <Icon name="star" size={20} color="#FFC107" />
              </View>
              <Text style={styles.logStatNumber}>{sampleLogData.averageRating}</Text>
              <Text style={styles.logStatLabel}>Calificación Promedio</Text>
            </View>
            <View style={styles.logStatCard}>
              <View style={styles.logStatIcon}>
                <Icon name="time" size={20} color="#FF9800" />
              </View>
              <Text style={styles.logStatNumber}>{sampleLogData.totalHours}h</Text>
              <Text style={styles.logStatLabel}>Horas Totales</Text>
            </View>
          </View>
          </View>
          
        {/* Filtros y búsqueda */}
        <View style={styles.logFilters}>
          <View style={styles.logSearchContainer}>
            <Icon name="search" size={20} color="#6B7280" />
              <TextInput
              style={styles.logSearchInput}
              placeholder="Buscar películas..."
              placeholderTextColor="#6B7280"
            />
              </View>
          <View style={styles.logFilterChips}>
            <TouchableOpacity style={styles.logFilterChip}>
              <Text style={styles.logFilterChipText}>Todas</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.logFilterChip}>
              <Text style={styles.logFilterChipText}>Completadas</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.logFilterChip}>
              <Text style={styles.logFilterChipText}>En Progreso</Text>
            </TouchableOpacity>
            </View>
        </View>

        {/* Lista de películas del registro */}
        <View style={styles.logMoviesContainer}>
          <Text style={styles.logMoviesTitle}>Mis Películas Registradas</Text>
          {sampleLogData.movies.map((movie) => (
            <View key={movie.id} style={styles.logMovieCard}>
              {/* Header de la película */}
              <View style={styles.logMovieHeader}>
                <View style={styles.logMovieCover}>
                  <Text style={styles.logMovieCoverEmoji}>{movie.cover}</Text>
                </View>
                <View style={styles.logMovieInfo}>
                  <Text style={styles.logMovieTitle}>{movie.title}</Text>
                  <Text style={styles.logMovieDirector}>{movie.director}</Text>
                  <View style={styles.logMovieMeta}>
                    <View style={styles.logMovieGenre}>
                      <Text style={styles.logMovieGenreEmoji}>
                        {getGenreEmoji(movie.genre)}
                      </Text>
                      <Text style={styles.logMovieGenreText}>{movie.genre}</Text>
                    </View>
                    <Text style={styles.logMovieYear}>{movie.year}</Text>
                  </View>
                </View>
                <View style={[styles.logMovieStatus, { backgroundColor: getStatusColor(movie.status) }]}>
                  <Text style={styles.logMovieStatusText}>{movie.status}</Text>
                </View>
              </View>

              {/* Información detallada */}
              <View style={styles.logMovieDetails}>
                <View style={styles.logMovieDetailRow}>
                  <View style={styles.logMovieDetailItem}>
                    <Icon name="calendar" size={14} color="#6B7280" />
                    <Text style={styles.logMovieDetailLabel}>Fecha:</Text>
                    <Text style={styles.logMovieDetailValue}>{movie.date}</Text>
                  </View>
                  <View style={styles.logMovieDetailItem}>
                    <Icon name="time" size={14} color="#6B7280" />
                    <Text style={styles.logMovieDetailLabel}>Duración:</Text>
                    <Text style={styles.logMovieDetailValue}>{movie.duration}</Text>
                  </View>
                </View>
                <View style={styles.logMovieDetailRow}>
                  <View style={styles.logMovieDetailItem}>
                    <Icon name="location" size={14} color="#6B7280" />
                    <Text style={styles.logMovieDetailLabel}>Lugar:</Text>
                    <Text style={styles.logMovieDetailValue}>{movie.location}</Text>
                  </View>
                  <View style={styles.logMovieDetailItem}>
                    <Icon name="people" size={14} color="#6B7280" />
                    <Text style={styles.logMovieDetailLabel}>Compañía:</Text>
                    <Text style={styles.logMovieDetailValue}>{movie.companions}</Text>
                  </View>
                </View>
                <View style={styles.logMovieDetailRow}>
                  <View style={styles.logMovieDetailItem}>
                    <Icon name="globe" size={14} color="#6B7280" />
                    <Text style={styles.logMovieDetailLabel}>Idioma:</Text>
                    <Text style={styles.logMovieDetailValue}>{movie.language}</Text>
                  </View>
                  <View style={styles.logMovieDetailItem}>
                    <Icon name="disc" size={14} color="#6B7280" />
                    <Text style={styles.logMovieDetailLabel}>Formato:</Text>
                    <Text style={styles.logMovieDetailValue}>{movie.format}</Text>
                  </View>
                </View>
              </View>

              {/* Calificación */}
              <View style={styles.logMovieRating}>
                <Text style={styles.logMovieRatingLabel}>Mi Calificación:</Text>
                <View style={styles.logMovieRatingStars}>
                  {renderStars(movie.rating, (rating) => updateMovieRating(movie.id, rating), 16)}
                </View>
                <Text style={styles.logMovieRatingText}>{movie.rating}/5</Text>
              </View>

              {/* Barra de progreso */}
              <View style={styles.logMovieProgress}>
                <View style={styles.logMovieProgressBar}>
                  <View 
                    style={[
                      styles.logMovieProgressFill,
                      { 
                        width: movie.status === 'Completada' ? '100%' : 
                               movie.status === 'En Progreso' ? '60%' : '0%',
                        backgroundColor: getStatusColor(movie.status)
                      }
                    ]}
          />
        </View>
                <Text style={styles.logMovieProgressText}>
                  {movie.status === 'Completada' ? 'Completada' : 
                   movie.status === 'En Progreso' ? 'En Progreso' : 'Pendiente'}
                </Text>
      </View>

              {/* Notas personales */}
              {movie.notes && (
                <View style={styles.logMovieNotes}>
                  <Text style={styles.logMovieNotesTitle}>📝 Mis Notas</Text>
                  <Text style={styles.logMovieNotesText}>{movie.notes}</Text>
    </View>
              )}

              {/* Estado de ánimo */}
              <View style={styles.logMovieMood}>
                <Text style={styles.logMovieMoodTitle}>😊 Estado de Ánimo:</Text>
                <Text style={styles.logMovieMoodText}>{movie.mood}</Text>
              </View>

              {/* Botones de acción */}
              <View style={styles.logMovieActions}>
                <TouchableOpacity style={styles.logMovieActionButton}>
                  <Icon name="create" size={16} color="#4CAF50" />
                  <Text style={styles.logMovieActionText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.logMovieActionButton}>
                  <Icon name="share" size={16} color="#2196F3" />
                  <Text style={styles.logMovieActionText}>Compartir</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.logMovieActionButton}>
                  <Icon name="bookmark" size={16} color="#FF9800" />
                  <Text style={styles.logMovieActionText}>Guardar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.logMovieActionButton}>
                  <Icon name="trash" size={16} color="#F44336" />
                  <Text style={styles.logMovieActionText}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Botones de acción principales */}
        <View style={styles.logActions}>
          <TouchableOpacity style={styles.logActionButton}>
            <Icon name="add-circle" size={20} color="#4CAF50" />
            <Text style={styles.logActionText}>Nueva Película</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logActionButton}>
            <Icon name="analytics" size={20} color="#2196F3" />
            <Text style={styles.logActionText}>Ver Estadísticas</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logActionButton}>
            <Icon name="download" size={20} color="#FF9800" />
            <Text style={styles.logActionText}>Exportar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  const renderFavoriteQuotes = () => {
    // Datos de ejemplo para las citas favoritas
    const sampleQuotesData = {
      totalQuotes: 12,
      totalMovies: 8,
      totalCharacters: 15,
      averageRating: 4.3,
      quotes: [
        {
          id: '1',
          quote: 'With great power comes great responsibility.',
          movie: 'Spider-Man',
          character: 'Uncle Ben',
          actor: 'Cliff Robertson',
          year: '2002',
          genre: 'Superhéroes',
          date: '15/01/2024',
          rating: 5,
          category: 'Inspiracional',
          mood: 'Motivador',
          context: 'Momento clave en la historia de Peter Parker',
          cover: '🕷️',
          color: '#4CAF50',
          language: 'Inglés',
          director: 'Sam Raimi'
        },
        {
          id: '2',
          quote: 'May the Force be with you.',
          movie: 'Star Wars',
          character: 'Obi-Wan Kenobi',
          actor: 'Alec Guinness',
          year: '1977',
          genre: 'Ciencia Ficción',
          date: '18/01/2024',
          rating: 5,
          category: 'Legendario',
          mood: 'Épico',
          context: 'Frase icónica de la saga galáctica',
          cover: '⭐',
          color: '#4CAF50',
          language: 'Inglés',
          director: 'George Lucas'
        },
        {
          id: '3',
          quote: 'I\'ll be back.',
          movie: 'The Terminator',
          character: 'Terminator',
          actor: 'Arnold Schwarzenegger',
          year: '1984',
          genre: 'Acción',
          date: '20/01/2024',
          rating: 4,
          category: 'Acción',
          mood: 'Intenso',
          context: 'Momento icónico del cyborg asesino',
          cover: '🤖',
          color: '#4CAF50',
          language: 'Inglés',
          director: 'James Cameron'
        },
        {
          id: '4',
          quote: 'Life is like a box of chocolates. You never know what you\'re gonna get.',
          movie: 'Forrest Gump',
          character: 'Forrest Gump',
          actor: 'Tom Hanks',
          year: '1994',
          genre: 'Drama',
          date: '22/01/2024',
          rating: 5,
          category: 'Filosófico',
          mood: 'Conmovedor',
          context: 'Lección de vida de la madre de Forrest',
          cover: '🍫',
          color: '#4CAF50',
          language: 'Inglés',
          director: 'Robert Zemeckis'
        },
        {
          id: '5',
          quote: 'I\'m going to make him an offer he can\'t refuse.',
          movie: 'The Godfather',
          character: 'Don Vito Corleone',
          actor: 'Marlon Brando',
          year: '1972',
          genre: 'Crimen',
          date: '25/01/2024',
          rating: 5,
          category: 'Dramático',
          mood: 'Intimidante',
          context: 'Frase emblemática del padrino del crimen',
          cover: '👔',
          color: '#4CAF50',
          language: 'Inglés',
          director: 'Francis Ford Coppola'
        },
        {
          id: '6',
          quote: 'Here\'s looking at you, kid.',
          movie: 'Casablanca',
          character: 'Rick Blaine',
          actor: 'Humphrey Bogart',
          year: '1942',
          genre: 'Romance',
          date: '28/01/2024',
          rating: 5,
          category: 'Romántico',
          mood: 'Nostálgico',
          context: 'Despedida emocional en el aeropuerto',
          cover: '✈️',
          color: '#4CAF50',
          language: 'Inglés',
          director: 'Michael Curtiz'
        }
      ]
    };

    // Obtener color según la categoría
    const getCategoryColor = (category) => {
      const colorMap = {
        'Inspiracional': '#4CAF50',
        'Legendario': '#FF9800',
        'Acción': '#F44336',
        'Filosófico': '#9C27B0',
        'Dramático': '#795548',
        'Romántico': '#E91E63',
        'Cómico': '#FFC107',
        'Trágico': '#607D8B'
      };
      return colorMap[category] || '#6B7280';
    };

    // Obtener emoji según el género
    const getGenreEmoji = (genre) => {
      const emojiMap = {
        'Superhéroes': '🦸',
        'Ciencia Ficción': '🚀',
        'Acción': '💥',
        'Drama': '🎭',
        'Crimen': '🔫',
        'Romance': '💕',
        'Comedia': '😂',
        'Terror': '👻',
        'Aventura': '⚔️'
      };
      return emojiMap[genre] || '🎬';
    };

    // Obtener emoji según el estado de ánimo
    const getMoodEmoji = (mood) => {
      const emojiMap = {
        'Motivador': '💪',
        'Épico': '⚡',
        'Intenso': '🔥',
        'Conmovedor': '😢',
        'Intimidante': '😠',
        'Nostálgico': '😌',
        'Divertido': '😄',
        'Trágico': '😔'
      };
      return emojiMap[mood] || '😊';
    };

    return (
      <ScrollView style={styles.quotesContainer} showsVerticalScrollIndicator={false}>
        {/* Header mejorado */}
        <View style={styles.quotesHeader}>
          <View style={styles.quotesHeaderContent}>
            <View style={styles.quotesHeaderIcon}>
              <Icon name="quote" size={28} color="#FFFFFF" />
            </View>
            <View style={styles.quotesHeaderText}>
              <Text style={styles.quotesHeaderTitle}>Mis Citas Favoritas</Text>
              <Text style={styles.quotesHeaderSubtitle}>
                Las frases más memorables del cine que me inspiran
              </Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.quotesAddButton}
            onPress={() => {}}
          >
            <Icon name="add" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Panel de estadísticas de citas */}
        <View style={styles.quotesStatsPanel}>
          <View style={styles.quotesStatsContent}>
            <Text style={styles.quotesStatsTitle}>
              📚 Mi Colección de Citas
            </Text>
            <Text style={styles.quotesStatsSubtitle}>
              Frases que han marcado mi experiencia cinematográfica
            </Text>
          </View>
          <View style={styles.quotesStatsGrid}>
            <View style={styles.quotesStatCard}>
              <View style={styles.quotesStatIcon}>
                <Icon name="quote" size={20} color="#4CAF50" />
              </View>
              <Text style={styles.quotesStatNumber}>{sampleQuotesData.totalQuotes}</Text>
              <Text style={styles.quotesStatLabel}>Citas Guardadas</Text>
            </View>
            <View style={styles.quotesStatCard}>
              <View style={styles.quotesStatIcon}>
                <Icon name="film" size={20} color="#2196F3" />
              </View>
              <Text style={styles.quotesStatNumber}>{sampleQuotesData.totalMovies}</Text>
              <Text style={styles.quotesStatLabel}>Películas</Text>
            </View>
            <View style={styles.quotesStatCard}>
              <View style={styles.quotesStatIcon}>
                <Icon name="people" size={20} color="#FFC107" />
              </View>
              <Text style={styles.quotesStatNumber}>{sampleQuotesData.totalCharacters}</Text>
              <Text style={styles.quotesStatLabel}>Personajes</Text>
            </View>
            <View style={styles.quotesStatCard}>
              <View style={styles.quotesStatIcon}>
                <Icon name="star" size={20} color="#FF9800" />
              </View>
              <Text style={styles.quotesStatNumber}>{sampleQuotesData.averageRating}</Text>
              <Text style={styles.quotesStatLabel}>Calificación Promedio</Text>
            </View>
          </View>
        </View>

        {/* Filtros y búsqueda */}
        <View style={styles.quotesFilters}>
          <View style={styles.quotesSearchContainer}>
            <Icon name="search" size={20} color="#6B7280" />
            <TextInput
              style={styles.quotesSearchInput}
              placeholder="Buscar citas..."
              placeholderTextColor="#6B7280"
            />
          </View>
          <View style={styles.quotesFilterChips}>
            <TouchableOpacity style={styles.quotesFilterChip}>
              <Text style={styles.quotesFilterChipText}>Todas</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quotesFilterChip}>
              <Text style={styles.quotesFilterChipText}>Inspiracional</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quotesFilterChip}>
              <Text style={styles.quotesFilterChipText}>Legendario</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quotesFilterChip}>
              <Text style={styles.quotesFilterChipText}>Romántico</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Lista de citas favoritas */}
        <View style={styles.quotesListContainer}>
          <Text style={styles.quotesListTitle}>Mis Citas Favoritas</Text>
          {sampleQuotesData.quotes.map((quote) => (
            <View key={quote.id} style={styles.quotesCard}>
              {/* Header de la cita */}
              <View style={styles.quotesCardHeader}>
                <View style={styles.quotesCardCover}>
                  <Text style={styles.quotesCardCoverEmoji}>{quote.cover}</Text>
                </View>
                <View style={styles.quotesCardInfo}>
                  <Text style={styles.quotesCardMovie}>{quote.movie}</Text>
                  <Text style={styles.quotesCardCharacter}>{quote.character}</Text>
                  <View style={styles.quotesCardMeta}>
                    <View style={styles.quotesCardGenre}>
                      <Text style={styles.quotesCardGenreEmoji}>
                        {getGenreEmoji(quote.genre)}
                      </Text>
                      <Text style={styles.quotesCardGenreText}>{quote.genre}</Text>
                    </View>
                    <Text style={styles.quotesCardYear}>{quote.year}</Text>
                  </View>
                </View>
                <View style={[styles.quotesCardCategory, { backgroundColor: getCategoryColor(quote.category) }]}>
                  <Text style={styles.quotesCardCategoryText}>{quote.category}</Text>
                </View>
              </View>

              {/* La cita */}
              <View style={styles.quotesCardQuote}>
                <Text style={styles.quotesCardQuoteText}>"{quote.quote}"</Text>
              </View>

              {/* Información detallada */}
              <View style={styles.quotesCardDetails}>
                <View style={styles.quotesCardDetailRow}>
                  <View style={styles.quotesCardDetailItem}>
                    <Icon name="person" size={14} color="#6B7280" />
                    <Text style={styles.quotesCardDetailLabel}>Actor:</Text>
                    <Text style={styles.quotesCardDetailValue}>{quote.actor}</Text>
                  </View>
                  <View style={styles.quotesCardDetailItem}>
                    <Icon name="calendar" size={14} color="#6B7280" />
                    <Text style={styles.quotesCardDetailLabel}>Fecha:</Text>
                    <Text style={styles.quotesCardDetailValue}>{quote.date}</Text>
                  </View>
                </View>
                <View style={styles.quotesCardDetailRow}>
                  <View style={styles.quotesCardDetailItem}>
                    <Icon name="film" size={14} color="#6B7280" />
                    <Text style={styles.quotesCardDetailLabel}>Director:</Text>
                    <Text style={styles.quotesCardDetailValue}>{quote.director}</Text>
                  </View>
                  <View style={styles.quotesCardDetailItem}>
                    <Icon name="globe" size={14} color="#6B7280" />
                    <Text style={styles.quotesCardDetailLabel}>Idioma:</Text>
                    <Text style={styles.quotesCardDetailValue}>{quote.language}</Text>
                  </View>
                </View>
              </View>

              {/* Calificación */}
              <View style={styles.quotesCardRating}>
                <Text style={styles.quotesCardRatingLabel}>Mi Calificación:</Text>
                <View style={styles.quotesCardRatingStars}>
                  {renderStars(quote.rating, (rating) => updateQuoteRating(quote.id, rating), 16)}
                </View>
                <Text style={styles.quotesCardRatingText}>{quote.rating}/5</Text>
              </View>

              {/* Contexto y estado de ánimo */}
              <View style={styles.quotesCardContext}>
                <View style={styles.quotesCardContextItem}>
                  <Text style={styles.quotesCardContextLabel}>📝 Contexto:</Text>
                  <Text style={styles.quotesCardContextText}>{quote.context}</Text>
                </View>
                <View style={styles.quotesCardMood}>
                  <Text style={styles.quotesCardMoodLabel}>
                    {getMoodEmoji(quote.mood)} Estado de Ánimo:
                  </Text>
                  <Text style={styles.quotesCardMoodText}>{quote.mood}</Text>
                </View>
              </View>

              {/* Botones de acción */}
              <View style={styles.quotesCardActions}>
                <TouchableOpacity style={styles.quotesCardActionButton}>
                  <Icon name="create" size={16} color="#4CAF50" />
                  <Text style={styles.quotesCardActionText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.quotesCardActionButton}>
                  <Icon name="share" size={16} color="#2196F3" />
                  <Text style={styles.quotesCardActionText}>Compartir</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.quotesCardActionButton}>
                  <Icon name="copy" size={16} color="#FF9800" />
                  <Text style={styles.quotesCardActionText}>Copiar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.quotesCardActionButton}>
                  <Icon name="bookmark" size={16} color="#9C27B0" />
                  <Text style={styles.quotesCardActionText}>Guardar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Botones de acción principales */}
        <View style={styles.quotesActions}>
          <TouchableOpacity style={styles.quotesActionButton}>
            <Icon name="add-circle" size={20} color="#4CAF50" />
            <Text style={styles.quotesActionText}>Nueva Cita</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quotesActionButton}>
            <Icon name="search" size={20} color="#2196F3" />
            <Text style={styles.quotesActionText}>Buscar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quotesActionButton}>
            <Icon name="download" size={20} color="#FF9800" />
            <Text style={styles.quotesActionText}>Exportar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  const renderMovieSeries = () => {
    // Datos de ejemplo para las sagas de películas
    const sampleSeriesData = {
      totalSeries: 8,
      totalMovies: 24,
      completedSeries: 3,
      averageRating: 4.2,
      series: [
        {
          id: '1',
          title: 'El Señor de los Anillos',
          director: 'Peter Jackson',
          genre: 'Fantasía',
          year: '2001-2003',
          status: 'Completada',
          cover: '💍',
          color: '#4CAF50',
          totalMovies: 3,
          watchedMovies: 3,
          averageRating: 4.8,
          totalDuration: '558 min',
          description: 'La épica aventura de Frodo y la Comunidad del Anillo para destruir el Anillo Único.',
          movies: [
            {
              title: 'La Comunidad del Anillo',
              year: '2001',
              duration: '178 min',
              rating: 5,
              status: 'Completada',
              watchDate: '15/01/2024',
              cover: '💍',
              description: 'Frodo emprende su viaje para destruir el Anillo Único.'
            },
            {
              title: 'Las Dos Torres',
              year: '2002',
              duration: '179 min',
              rating: 5,
              status: 'Completada',
              watchDate: '18/01/2024',
              cover: '🏰',
              description: 'La batalla por la Tierra Media continúa.'
            },
            {
              title: 'El Retorno del Rey',
              year: '2003',
              duration: '201 min',
              rating: 5,
              status: 'Completada',
              watchDate: '22/01/2024',
              cover: '👑',
              description: 'La batalla final por el destino de la Tierra Media.'
            }
          ]
        },
        {
          id: '2',
          title: 'Star Wars - Trilogía Original',
          director: 'George Lucas',
          genre: 'Ciencia Ficción',
          year: '1977-1983',
          status: 'Completada',
          cover: '⭐',
          color: '#4CAF50',
          totalMovies: 3,
          watchedMovies: 3,
          averageRating: 4.6,
          totalDuration: '378 min',
          description: 'La épica saga espacial de Luke Skywalker y la lucha contra el Imperio.',
          movies: [
            {
              title: 'Una Nueva Esperanza',
              year: '1977',
              duration: '121 min',
              rating: 5,
              status: 'Completada',
              watchDate: '25/01/2024',
              cover: '⭐',
              description: 'Luke Skywalker descubre su destino como Jedi.'
            },
            {
              title: 'El Imperio Contraataca',
              year: '1980',
              duration: '124 min',
              rating: 4,
              status: 'Completada',
              watchDate: '28/01/2024',
              cover: '❄️',
              description: 'Luke entrena con Yoda mientras el Imperio ataca.'
            },
            {
              title: 'El Retorno del Jedi',
              year: '1983',
              duration: '133 min',
              rating: 5,
              status: 'Completada',
              watchDate: '30/01/2024',
              cover: '🌙',
              description: 'La batalla final entre el bien y el mal.'
            }
          ]
        },
        {
          id: '3',
          title: 'Harry Potter',
          director: 'Chris Columbus, Alfonso Cuarón, Mike Newell, David Yates',
          genre: 'Fantasía',
          year: '2001-2011',
          status: 'En Progreso',
          cover: '🪄',
          color: '#FF9800',
          totalMovies: 8,
          watchedMovies: 5,
          averageRating: 4.3,
          totalDuration: '1200 min',
          description: 'La magia y aventuras del joven mago Harry Potter en Hogwarts.',
          movies: [
            {
              title: 'La Piedra Filosofal',
              year: '2001',
              duration: '152 min',
              rating: 4,
              status: 'Completada',
              watchDate: '02/02/2024',
              cover: '🧙‍♂️',
              description: 'Harry descubre que es un mago y va a Hogwarts.'
            },
            {
              title: 'La Cámara de los Secretos',
              year: '2002',
              duration: '161 min',
              rating: 4,
              status: 'Completada',
              watchDate: '05/02/2024',
              cover: '🐍',
              description: 'Harry regresa a Hogwarts para su segundo año.'
            },
            {
              title: 'El Prisionero de Azkaban',
              year: '2004',
              duration: '142 min',
              rating: 5,
              status: 'Completada',
              watchDate: '08/02/2024',
              cover: '🐺',
              description: 'Harry descubre la verdad sobre sus padres.'
            },
            {
              title: 'El Cáliz de Fuego',
              year: '2005',
              duration: '157 min',
              rating: 4,
              status: 'Completada',
              watchDate: '12/02/2024',
              cover: '🏆',
              description: 'Harry participa en el Torneo de los Tres Magos.'
            },
            {
              title: 'La Orden del Fénix',
              year: '2007',
              duration: '138 min',
              rating: 4,
              status: 'Completada',
              watchDate: '15/02/2024',
              cover: '🦅',
              description: 'Harry forma el Ejército de Dumbledore.'
            },
            {
              title: 'El Misterio del Príncipe',
              year: '2009',
              duration: '153 min',
              rating: 0,
              status: 'Pendiente',
              watchDate: '',
              cover: '📖',
              description: 'Harry aprende sobre el pasado de Voldemort.'
            },
            {
              title: 'Las Reliquias de la Muerte - Parte 1',
              year: '2010',
              duration: '146 min',
              rating: 0,
              status: 'Pendiente',
              watchDate: '',
              cover: '💀',
              description: 'Harry busca los Horrocruxes restantes.'
            },
            {
              title: 'Las Reliquias de la Muerte - Parte 2',
              year: '2011',
              duration: '130 min',
              rating: 0,
              status: 'Pendiente',
              watchDate: '',
              cover: '⚡',
              description: 'La batalla final contra Voldemort.'
            }
          ]
        },
        {
          id: '4',
          title: 'El Padrino',
          director: 'Francis Ford Coppola',
          genre: 'Crimen',
          year: '1972-1990',
          status: 'En Progreso',
          cover: '👔',
          color: '#FF9800',
          totalMovies: 3,
          watchedMovies: 1,
          averageRating: 5,
          totalDuration: '540 min',
          description: 'La saga de la familia Corleone y su imperio criminal.',
          movies: [
            {
              title: 'El Padrino',
              year: '1972',
              duration: '175 min',
              rating: 5,
              status: 'Completada',
              watchDate: '18/02/2024',
              cover: '👔',
              description: 'Michael Corleone se convierte en el nuevo Don.'
            },
            {
              title: 'El Padrino II',
              year: '1974',
              duration: '202 min',
              rating: 0,
              status: 'Pendiente',
              watchDate: '',
              cover: '🏛️',
              description: 'La historia de Vito Corleone y el ascenso de Michael.'
            },
            {
              title: 'El Padrino III',
              year: '1990',
              duration: '163 min',
              rating: 0,
              status: 'Pendiente',
              watchDate: '',
              cover: '⛪',
              description: 'Michael intenta legitimizar el negocio familiar.'
            }
          ]
        }
      ]
    };

    // Obtener color según el estado
    const getStatusColor = (status) => {
      switch (status) {
        case 'Completada': return '#4CAF50';
        case 'En Progreso': return '#FF9800';
        case 'Pendiente': return '#6B7280';
        default: return '#6B7280';
      }
    };

    // Obtener emoji según el género
    const getGenreEmoji = (genre) => {
      const emojiMap = {
        'Fantasía': '🧙‍♂️',
        'Ciencia Ficción': '🚀',
        'Crimen': '🔫',
        'Acción': '💥',
        'Drama': '🎭',
        'Comedia': '😂',
        'Romance': '💕',
        'Terror': '👻',
        'Aventura': '⚔️'
      };
      return emojiMap[genre] || '🎬';
    };

    // Obtener color según el género
    const getGenreColor = (genre) => {
      const colorMap = {
        'Fantasía': '#9C27B0',
        'Ciencia Ficción': '#2196F3',
        'Crimen': '#795548',
        'Acción': '#F44336',
        'Drama': '#4CAF50',
        'Comedia': '#FFC107',
        'Romance': '#E91E63',
        'Terror': '#607D8B',
        'Aventura': '#FF9800'
      };
      return colorMap[genre] || '#6B7280';
    };

    return (
      <ScrollView style={styles.seriesContainer} showsVerticalScrollIndicator={false}>
        {/* Header mejorado */}
        <View style={styles.seriesHeader}>
          <View style={styles.seriesHeaderContent}>
            <View style={styles.seriesHeaderIcon}>
              <Icon name="library" size={28} color="#FFFFFF" />
            </View>
            <View style={styles.seriesHeaderText}>
              <Text style={styles.seriesHeaderTitle}>Mis Sagas de Películas</Text>
              <Text style={styles.seriesHeaderSubtitle}>
                Colección de sagas cinematográficas que me han marcado
              </Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.seriesAddButton}
            onPress={() => {}}
          >
            <Icon name="add" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Panel de estadísticas de sagas */}
        <View style={styles.seriesStatsPanel}>
          <View style={styles.seriesStatsContent}>
            <Text style={styles.seriesStatsTitle}>
              🎬 Mi Colección de Sagas
            </Text>
            <Text style={styles.seriesStatsSubtitle}>
              Sagas cinematográficas que han definido mi experiencia
            </Text>
          </View>
          <View style={styles.seriesStatsGrid}>
            <View style={styles.seriesStatCard}>
              <View style={styles.seriesStatIcon}>
                <Icon name="library" size={20} color="#4CAF50" />
              </View>
              <Text style={styles.seriesStatNumber}>{sampleSeriesData.totalSeries}</Text>
              <Text style={styles.seriesStatLabel}>Sagas Totales</Text>
            </View>
            <View style={styles.seriesStatCard}>
              <View style={styles.seriesStatIcon}>
                <Icon name="film" size={20} color="#2196F3" />
              </View>
              <Text style={styles.seriesStatNumber}>{sampleSeriesData.totalMovies}</Text>
              <Text style={styles.seriesStatLabel}>Películas</Text>
            </View>
            <View style={styles.seriesStatCard}>
              <View style={styles.seriesStatIcon}>
                <Icon name="checkmark-circle" size={20} color="#FFC107" />
              </View>
              <Text style={styles.seriesStatNumber}>{sampleSeriesData.completedSeries}</Text>
              <Text style={styles.seriesStatLabel}>Completadas</Text>
            </View>
            <View style={styles.seriesStatCard}>
              <View style={styles.seriesStatIcon}>
                <Icon name="star" size={20} color="#FF9800" />
              </View>
              <Text style={styles.seriesStatNumber}>{sampleSeriesData.averageRating}</Text>
              <Text style={styles.seriesStatLabel}>Calificación Promedio</Text>
            </View>
          </View>
        </View>

        {/* Filtros y búsqueda */}
        <View style={styles.seriesFilters}>
          <View style={styles.seriesSearchContainer}>
            <Icon name="search" size={20} color="#6B7280" />
            <TextInput
              style={styles.seriesSearchInput}
              placeholder="Buscar sagas..."
              placeholderTextColor="#6B7280"
            />
          </View>
          <View style={styles.seriesFilterChips}>
            <TouchableOpacity style={styles.seriesFilterChip}>
              <Text style={styles.seriesFilterChipText}>Todas</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.seriesFilterChip}>
              <Text style={styles.seriesFilterChipText}>Completadas</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.seriesFilterChip}>
              <Text style={styles.seriesFilterChipText}>En Progreso</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.seriesFilterChip}>
              <Text style={styles.seriesFilterChipText}>Fantasía</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Lista de sagas de películas */}
        <View style={styles.seriesListContainer}>
          <Text style={styles.seriesListTitle}>Mis Sagas de Películas</Text>
          {sampleSeriesData.series.map((series) => (
            <View key={series.id} style={styles.seriesCard}>
              {/* Header de la saga */}
              <View style={styles.seriesCardHeader}>
                <View style={styles.seriesCardCover}>
                  <Text style={styles.seriesCardCoverEmoji}>{series.cover}</Text>
                </View>
                <View style={styles.seriesCardInfo}>
                  <Text style={styles.seriesCardTitle}>{series.title}</Text>
                  <Text style={styles.seriesCardDirector}>{series.director}</Text>
                  <View style={styles.seriesCardMeta}>
                    <View style={styles.seriesCardGenre}>
                      <Text style={styles.seriesCardGenreEmoji}>
                        {getGenreEmoji(series.genre)}
                      </Text>
                      <Text style={styles.seriesCardGenreText}>{series.genre}</Text>
                    </View>
                    <Text style={styles.seriesCardYear}>{series.year}</Text>
                  </View>
                </View>
                <View style={[styles.seriesCardStatus, { backgroundColor: getStatusColor(series.status) }]}>
                  <Text style={styles.seriesCardStatusText}>{series.status}</Text>
                </View>
              </View>

              {/* Información de la saga */}
              <View style={styles.seriesCardInfo}>
                <Text style={styles.seriesCardDescription}>{series.description}</Text>
              </View>

              {/* Estadísticas de la saga */}
              <View style={styles.seriesCardStats}>
                <View style={styles.seriesCardStatItem}>
                  <Icon name="film" size={16} color="#6B7280" />
                  <Text style={styles.seriesCardStatLabel}>Películas:</Text>
                  <Text style={styles.seriesCardStatValue}>{series.watchedMovies}/{series.totalMovies}</Text>
                </View>
                <View style={styles.seriesCardStatItem}>
                  <Icon name="time" size={16} color="#6B7280" />
                  <Text style={styles.seriesCardStatLabel}>Duración:</Text>
                  <Text style={styles.seriesCardStatValue}>{series.totalDuration}</Text>
                </View>
                <View style={styles.seriesCardStatItem}>
                  <Icon name="star" size={16} color="#6B7280" />
                  <Text style={styles.seriesCardStatLabel}>Promedio:</Text>
                  <Text style={styles.seriesCardStatValue}>{series.averageRating}/5</Text>
                </View>
              </View>

              {/* Barra de progreso */}
              <View style={styles.seriesCardProgress}>
                <View style={styles.seriesCardProgressBar}>
                  <View 
                    style={[
                      styles.seriesCardProgressFill,
                      { 
                        width: `${(series.watchedMovies / series.totalMovies) * 100}%`,
                        backgroundColor: getStatusColor(series.status)
                      }
                    ]}
                  />
                </View>
                <Text style={styles.seriesCardProgressText}>
                  {series.watchedMovies} de {series.totalMovies} películas vistas
                </Text>
              </View>

              {/* Lista de películas de la saga */}
              <View style={styles.seriesCardMovies}>
                <Text style={styles.seriesCardMoviesTitle}>Películas de la Saga:</Text>
                {series.movies.map((movie, index) => (
                  <View key={index} style={styles.seriesMovieItem}>
                    <View style={styles.seriesMovieHeader}>
                      <View style={styles.seriesMovieCover}>
                        <Text style={styles.seriesMovieCoverEmoji}>{movie.cover}</Text>
                      </View>
                      <View style={styles.seriesMovieInfo}>
                        <Text style={styles.seriesMovieTitle}>{movie.title}</Text>
                        <Text style={styles.seriesMovieYear}>{movie.year}</Text>
                        <Text style={styles.seriesMovieDuration}>{movie.duration}</Text>
                      </View>
                      <View style={styles.seriesMovieRating}>
                        {movie.rating > 0 ? (
                          <View style={styles.seriesMovieRatingStars}>
                            {renderStars(movie.rating, () => {}, 12)}
                          </View>
                        ) : (
                          <Text style={styles.seriesMovieRatingText}>Sin calificar</Text>
                        )}
                      </View>
                    </View>
                    <View style={styles.seriesMovieDetails}>
                      <Text style={styles.seriesMovieDescription}>{movie.description}</Text>
                      {movie.watchDate && (
                        <Text style={styles.seriesMovieWatchDate}>
                          📅 Visto el: {movie.watchDate}
                        </Text>
                      )}
                    </View>
                  </View>
                ))}
              </View>

              {/* Botones de acción */}
              <View style={styles.seriesCardActions}>
                <TouchableOpacity style={styles.seriesCardActionButton}>
                  <Icon name="create" size={16} color="#4CAF50" />
                  <Text style={styles.seriesCardActionText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.seriesCardActionButton}>
                  <Icon name="share" size={16} color="#2196F3" />
                  <Text style={styles.seriesCardActionText}>Compartir</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.seriesCardActionButton}>
                  <Icon name="bookmark" size={16} color="#FF9800" />
                  <Text style={styles.seriesCardActionText}>Guardar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.seriesCardActionButton}>
                  <Icon name="analytics" size={16} color="#9C27B0" />
                  <Text style={styles.seriesCardActionText}>Estadísticas</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Botones de acción principales */}
        <View style={styles.seriesActions}>
          <TouchableOpacity style={styles.seriesActionButton}>
            <Icon name="add-circle" size={20} color="#4CAF50" />
            <Text style={styles.seriesActionText}>Nueva Saga</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.seriesActionButton}>
            <Icon name="analytics" size={20} color="#2196F3" />
            <Text style={styles.seriesActionText}>Ver Estadísticas</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.seriesActionButton}>
            <Icon name="download" size={20} color="#FF9800" />
            <Text style={styles.seriesActionText}>Exportar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  const renderMovieshelf = () => {
    // Datos de ejemplo para la estantería de películas
    const sampleMovieshelfData = {
      totalMovies: 25,
      watchedMovies: 18,
      unwatchedMovies: 7,
      averageRating: 4.1,
      totalHours: 45.5,
      movies: [
        {
          id: '1',
          title: 'The Dark Knight',
          director: 'Christopher Nolan',
          year: '2008',
          genre: 'Acción',
          rating: 5,
          status: 'Vista',
          cover: '🦇',
          color: '#4CAF50',
          duration: '152 min',
          language: 'Inglés',
          format: 'Blu-ray',
          location: 'Estantería A',
          notes: 'Una obra maestra del cine de superhéroes. Heath Ledger como Joker es legendario.',
          purchaseDate: '15/01/2024',
          price: '$15.99',
          condition: 'Excelente',
          links: {
            imdb: 'https://www.imdb.com/title/tt0468569/',
            amazon: 'https://amazon.com/dark-knight',
            netflix: 'https://netflix.com/dark-knight'
          }
        },
        {
          id: '2',
          title: 'Pulp Fiction',
          director: 'Quentin Tarantino',
          year: '1994',
          genre: 'Crimen',
          rating: 5,
          status: 'Vista',
          cover: '💼',
          color: '#4CAF50',
          duration: '154 min',
          language: 'Inglés',
          format: 'DVD',
          location: 'Estantería B',
          notes: 'Narrativa no lineal perfecta. Cada escena es memorable.',
          purchaseDate: '18/01/2024',
          price: '$12.99',
          condition: 'Bueno',
          links: {
            imdb: 'https://www.imdb.com/title/tt0110912/',
            amazon: 'https://amazon.com/pulp-fiction',
            hulu: 'https://hulu.com/pulp-fiction'
          }
        },
        {
          id: '3',
          title: 'Inception',
          director: 'Christopher Nolan',
          year: '2010',
          genre: 'Ciencia Ficción',
          rating: 4,
          status: 'Vista',
          cover: '🌪️',
          color: '#4CAF50',
          duration: '148 min',
          language: 'Inglés',
          format: 'Digital',
          location: 'Biblioteca Digital',
          notes: 'Concepto brillante pero complejo. Necesita múltiples visualizaciones.',
          purchaseDate: '22/01/2024',
          price: '$9.99',
          condition: 'N/A',
          links: {
            imdb: 'https://www.imdb.com/title/tt1375666/',
            amazon: 'https://amazon.com/inception',
            hbo: 'https://hbo.com/inception'
          }
        },
        {
          id: '4',
          title: 'Parasite',
          director: 'Bong Joon-ho',
          year: '2019',
          genre: 'Thriller',
          rating: 5,
          status: 'Vista',
          cover: '🏠',
          color: '#4CAF50',
          duration: '132 min',
          language: 'Coreano',
          format: 'Blu-ray',
          location: 'Estantería C',
          notes: 'Crítica social devastadora. Merece todos los premios.',
          purchaseDate: '25/01/2024',
          price: '$18.99',
          condition: 'Excelente',
          links: {
            imdb: 'https://www.imdb.com/title/tt6751668/',
            amazon: 'https://amazon.com/parasite',
            netflix: 'https://netflix.com/parasite'
          }
        },
        {
          id: '5',
          title: 'Dune',
          director: 'Denis Villeneuve',
          year: '2021',
          genre: 'Ciencia Ficción',
          rating: 4,
          status: 'Por Ver',
          cover: '🏜️',
          color: '#FF9800',
          duration: '155 min',
          language: 'Inglés',
          format: 'Digital',
          location: 'Biblioteca Digital',
          notes: 'Visualmente impresionante. La historia es épica pero lenta.',
          purchaseDate: '28/01/2024',
          price: '$14.99',
          condition: 'N/A',
          links: {
            imdb: 'https://www.imdb.com/title/tt1160419/',
            amazon: 'https://amazon.com/dune-2021',
            hbo: 'https://hbo.com/dune'
          }
        },
        {
          id: '6',
          title: 'The Godfather',
          director: 'Francis Ford Coppola',
          year: '1972',
          genre: 'Crimen',
          rating: 5,
          status: 'Vista',
          cover: '👔',
          color: '#4CAF50',
          duration: '175 min',
          language: 'Inglés',
          format: 'Blu-ray',
          location: 'Estantería A',
          notes: 'Una obra maestra del cine. Marlon Brando es legendario.',
          purchaseDate: '30/01/2024',
          price: '$16.99',
          condition: 'Excelente',
          links: {
            imdb: 'https://www.imdb.com/title/tt0068646/',
            amazon: 'https://amazon.com/godfather',
            netflix: 'https://netflix.com/godfather'
          }
        }
      ]
    };

    // Obtener color según el estado
    const getStatusColor = (status) => {
      switch (status) {
        case 'Vista': return '#4CAF50';
        case 'Por Ver': return '#FF9800';
        case 'Pendiente': return '#6B7280';
        default: return '#6B7280';
      }
    };

    // Obtener emoji según el género
    const getGenreEmoji = (genre) => {
      const emojiMap = {
        'Acción': '💥',
        'Crimen': '🔫',
        'Ciencia Ficción': '🚀',
        'Thriller': '🔪',
        'Drama': '🎭',
        'Comedia': '😂',
        'Romance': '💕',
        'Terror': '👻',
        'Aventura': '⚔️'
      };
      return emojiMap[genre] || '🎬';
    };

    // Obtener color según el género
    const getGenreColor = (genre) => {
      const colorMap = {
        'Acción': '#FF5722',
        'Crimen': '#9C27B0',
        'Ciencia Ficción': '#2196F3',
        'Thriller': '#9C27B0',
        'Drama': '#4CAF50',
        'Comedia': '#FFC107',
        'Romance': '#E91E63',
        'Terror': '#795548',
        'Aventura': '#FF9800'
      };
      return colorMap[genre] || '#6B7280';
    };

    // Función para abrir enlaces
    const openLink = (url) => {
      console.log('Abriendo enlace:', url);
      // En una app real, usarías Linking.openURL(url)
    };

    return (
      <ScrollView style={styles.movieshelfContainer} showsVerticalScrollIndicator={false}>
        {/* Header mejorado */}
        <View style={styles.movieshelfHeader}>
          <View style={styles.movieshelfHeaderContent}>
            <View style={styles.movieshelfHeaderIcon}>
              <Icon name="library" size={28} color="#FFFFFF" />
            </View>
            <View style={styles.movieshelfHeaderText}>
              <Text style={styles.movieshelfHeaderTitle}>Mi Estantería de Películas</Text>
              <Text style={styles.movieshelfHeaderSubtitle}>
                Mi colección personal de películas favoritas
              </Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.movieshelfAddButton}
            onPress={() => {}}
          >
            <Icon name="add" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Panel de estadísticas de la estantería */}
        <View style={styles.movieshelfStatsPanel}>
          <View style={styles.movieshelfStatsContent}>
            <Text style={styles.movieshelfStatsTitle}>
              🎬 Mi Biblioteca Personal
            </Text>
            <Text style={styles.movieshelfStatsSubtitle}>
              películas en tu colección personal
            </Text>
          </View>
          <View style={styles.movieshelfStatsGrid}>
            <View style={styles.movieshelfStatCard}>
              <View style={styles.movieshelfStatIcon}>
                <Icon name="film" size={20} color="#4CAF50" />
              </View>
              <Text style={styles.movieshelfStatNumber}>{sampleMovieshelfData.totalMovies}</Text>
              <Text style={styles.movieshelfStatLabel}>Total Películas</Text>
            </View>
            <View style={styles.movieshelfStatCard}>
              <View style={styles.movieshelfStatIcon}>
                <Icon name="checkmark-circle" size={20} color="#2196F3" />
              </View>
              <Text style={styles.movieshelfStatNumber}>{sampleMovieshelfData.watchedMovies}</Text>
              <Text style={styles.movieshelfStatLabel}>Vistas</Text>
            </View>
            <View style={styles.movieshelfStatCard}>
              <View style={styles.movieshelfStatIcon}>
                <Icon name="time" size={20} color="#FFC107" />
              </View>
              <Text style={styles.movieshelfStatNumber}>{sampleMovieshelfData.unwatchedMovies}</Text>
              <Text style={styles.movieshelfStatLabel}>Por Ver</Text>
            </View>
            <View style={styles.movieshelfStatCard}>
              <View style={styles.movieshelfStatIcon}>
                <Icon name="star" size={20} color="#FF9800" />
              </View>
              <Text style={styles.movieshelfStatNumber}>{sampleMovieshelfData.averageRating}</Text>
              <Text style={styles.movieshelfStatLabel}>Calificación Promedio</Text>
            </View>
          </View>
        </View>

        {/* Filtros y búsqueda */}
        <View style={styles.movieshelfFilters}>
          <View style={styles.movieshelfSearchContainer}>
            <Icon name="search" size={20} color="#6B7280" />
            <TextInput
              style={styles.movieshelfSearchInput}
              placeholder="Buscar películas..."
              placeholderTextColor="#6B7280"
            />
          </View>
          <View style={styles.movieshelfFilterChips}>
            <TouchableOpacity style={styles.movieshelfFilterChip}>
              <Text style={styles.movieshelfFilterChipText}>Todas</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.movieshelfFilterChip}>
              <Text style={styles.movieshelfFilterChipText}>Vistas</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.movieshelfFilterChip}>
              <Text style={styles.movieshelfFilterChipText}>Por Ver</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.movieshelfFilterChip}>
              <Text style={styles.movieshelfFilterChipText}>Acción</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Lista de películas de la estantería */}
        <View style={styles.movieshelfListContainer}>
          <Text style={styles.movieshelfListTitle}>Mis Películas</Text>
          {sampleMovieshelfData.movies.map((movie) => (
            <View key={movie.id} style={styles.movieshelfCard}>
              {/* Header de la película */}
              <View style={styles.movieshelfCardHeader}>
                <View style={styles.movieshelfCardCover}>
                  <Text style={styles.movieshelfCardCoverEmoji}>{movie.cover}</Text>
                </View>
                <View style={styles.movieshelfCardInfo}>
                  <Text style={styles.movieshelfCardTitle}>{movie.title}</Text>
                  <Text style={styles.movieshelfCardDirector}>{movie.director}</Text>
                  <View style={styles.movieshelfCardMeta}>
                    <View style={styles.movieshelfCardGenre}>
                      <Text style={styles.movieshelfCardGenreEmoji}>
                        {getGenreEmoji(movie.genre)}
                      </Text>
                      <Text style={styles.movieshelfCardGenreText}>{movie.genre}</Text>
                    </View>
                    <Text style={styles.movieshelfCardYear}>{movie.year}</Text>
                  </View>
                </View>
                <View style={[styles.movieshelfCardStatus, { backgroundColor: getStatusColor(movie.status) }]}>
                  <Text style={styles.movieshelfCardStatusText}>{movie.status}</Text>
                </View>
              </View>

              {/* Información detallada */}
              <View style={styles.movieshelfCardDetails}>
                <View style={styles.movieshelfCardDetailRow}>
                  <View style={styles.movieshelfCardDetailItem}>
                    <Icon name="time" size={14} color="#6B7280" />
                    <Text style={styles.movieshelfCardDetailLabel}>Duración:</Text>
                    <Text style={styles.movieshelfCardDetailValue}>{movie.duration}</Text>
                  </View>
                  <View style={styles.movieshelfCardDetailItem}>
                    <Icon name="globe" size={14} color="#6B7280" />
                    <Text style={styles.movieshelfCardDetailLabel}>Idioma:</Text>
                    <Text style={styles.movieshelfCardDetailValue}>{movie.language}</Text>
                  </View>
                </View>
                <View style={styles.movieshelfCardDetailRow}>
                  <View style={styles.movieshelfCardDetailItem}>
                    <Icon name="disc" size={14} color="#6B7280" />
                    <Text style={styles.movieshelfCardDetailLabel}>Formato:</Text>
                    <Text style={styles.movieshelfCardDetailValue}>{movie.format}</Text>
                  </View>
                  <View style={styles.movieshelfCardDetailItem}>
                    <Icon name="location" size={14} color="#6B7280" />
                    <Text style={styles.movieshelfCardDetailLabel}>Ubicación:</Text>
                    <Text style={styles.movieshelfCardDetailValue}>{movie.location}</Text>
                  </View>
                </View>
                <View style={styles.movieshelfCardDetailRow}>
                  <View style={styles.movieshelfCardDetailItem}>
                    <Icon name="calendar" size={14} color="#6B7280" />
                    <Text style={styles.movieshelfCardDetailLabel}>Compra:</Text>
                    <Text style={styles.movieshelfCardDetailValue}>{movie.purchaseDate}</Text>
                  </View>
                  <View style={styles.movieshelfCardDetailItem}>
                    <Icon name="cash" size={14} color="#6B7280" />
                    <Text style={styles.movieshelfCardDetailLabel}>Precio:</Text>
                    <Text style={styles.movieshelfCardDetailValue}>{movie.price}</Text>
                  </View>
                </View>
              </View>

              {/* Calificación */}
              <View style={styles.movieshelfCardRating}>
                <Text style={styles.movieshelfCardRatingLabel}>Mi Calificación:</Text>
                <View style={styles.movieshelfCardRatingStars}>
                  {renderStars(movie.rating, (rating) => {}, 16)}
                </View>
                <Text style={styles.movieshelfCardRatingText}>{movie.rating}/5</Text>
              </View>

              {/* Enlaces relacionados */}
              <View style={styles.movieshelfCardLinks}>
                <Text style={styles.movieshelfCardLinksTitle}>Enlaces Relacionados:</Text>
                <View style={styles.movieshelfCardLinksList}>
                  <TouchableOpacity 
                    style={styles.movieshelfCardLink}
                    onPress={() => openLink(movie.links.imdb)}
                  >
                    <Icon name="globe" size={16} color="#FF6B35" />
                    <Text style={styles.movieshelfCardLinkText}>IMDb</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.movieshelfCardLink}
                    onPress={() => openLink(movie.links.amazon)}
                  >
                    <Icon name="cart" size={16} color="#FF9500" />
                    <Text style={styles.movieshelfCardLinkText}>Amazon</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.movieshelfCardLink}
                    onPress={() => openLink(movie.links.netflix || movie.links.hulu || movie.links.hbo)}
                  >
                    <Icon name="play" size={16} color="#E50914" />
                    <Text style={styles.movieshelfCardLinkText}>Streaming</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Notas */}
              {movie.notes && (
                <View style={styles.movieshelfCardNotes}>
                  <Text style={styles.movieshelfCardNotesTitle}>📝 Notas:</Text>
                  <Text style={styles.movieshelfCardNotesText}>{movie.notes}</Text>
                </View>
              )}

              {/* Botones de acción */}
              <View style={styles.movieshelfCardActions}>
                <TouchableOpacity style={styles.movieshelfCardActionButton}>
                  <Icon name="create" size={16} color="#4CAF50" />
                  <Text style={styles.movieshelfCardActionText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.movieshelfCardActionButton}>
                  <Icon name="share" size={16} color="#2196F3" />
                  <Text style={styles.movieshelfCardActionText}>Compartir</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.movieshelfCardActionButton}>
                  <Icon name="bookmark" size={16} color="#FF9800" />
                  <Text style={styles.movieshelfCardActionText}>Marcar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.movieshelfCardActionButton}>
                  <Icon name="trash" size={16} color="#F44336" />
                  <Text style={styles.movieshelfCardActionText}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Botones de acción principales */}
        <View style={styles.movieshelfActions}>
          <TouchableOpacity style={styles.movieshelfActionButton}>
            <Icon name="add-circle" size={20} color="#4CAF50" />
            <Text style={styles.movieshelfActionText}>Nueva Película</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.movieshelfActionButton}>
            <Icon name="search" size={20} color="#2196F3" />
            <Text style={styles.movieshelfActionText}>Buscar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.movieshelfActionButton}>
            <Icon name="download" size={20} color="#FF9800" />
            <Text style={styles.movieshelfActionText}>Exportar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'movies-journal':
        return renderMoviesJournal();
      case 'movies-log':
        return renderMoviesLog();
      case 'favorite-quotes':
        return renderFavoriteQuotes();
      case 'movie-series':
        return renderMovieSeries();
      case 'movieshelf':
        return renderMovieshelf();
      default:
        return renderMoviesJournal();
    }
  };

  return (
    <View style={styles.container}>
      {/* Navegación de pestañas */}
      {renderSectionTabs()}

      {/* Contenido de la sección activa */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderActiveSection()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  tabsContainer: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  tabsScroll: {
    paddingHorizontal: 16,
  },
  tab: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginVertical: 8,
  },
  activeTab: {
    backgroundColor: '#FF6B9D',
    borderColor: '#FF6B9D',
  },
  content: {
    flex: 1,
    paddingHorizontal: 0,
    paddingVertical: 16,
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    marginHorizontal: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d4150',
  },
  crownIcon: {
    padding: 4,
  },
  journalContent: {
    flex: 1,
  },
  journalHeader: {
    marginBottom: 20,
  },
  journalSubtitle: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#FF6B9D',
    marginBottom: 8,
  },
  belongsToText: {
    fontSize: 14,
    color: '#495057',
    marginBottom: 8,
  },
  ownerInput: {
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
    paddingVertical: 4,
    fontSize: 14,
    color: '#495057',
  },
  movieEntries: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  movieEntry: {
    flex: 1,
    marginHorizontal: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FF6B9D',
    borderRadius: 8,
  },
  movieEntryHeader: {
    marginBottom: 12,
  },
  movieEntryTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2d4150',
  },
  movieEntryFields: {
    flex: 1,
  },
  fieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  fieldLabel: {
    fontSize: 12,
    color: '#495057',
    flex: 1,
  },
  fieldInput: {
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
    paddingVertical: 2,
    fontSize: 12,
    color: '#495057',
    flex: 1,
    marginLeft: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  starButton: {
    padding: 2,
  },
  moviesLogContent: {
    flex: 1,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  logTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d4150',
  },
  movieIcons: {
    flexDirection: 'row',
  },
  logTable: {
    marginBottom: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#FF6B9D',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 4,
    marginBottom: 8,
  },
  headerCell: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    paddingVertical: 4,
  },
  tableCell: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
    paddingVertical: 2,
    fontSize: 10,
    color: '#495057',
    marginHorizontal: 2,
  },
  ratingCell: {
    flex: 1,
    alignItems: 'center',
  },
  notesSection: {
    marginTop: 16,
  },
  notesTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2d4150',
    marginBottom: 8,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 6,
    padding: 8,
    fontSize: 12,
    color: '#495057',
    textAlignVertical: 'top',
  },
  quotesContent: {
    flex: 1,
  },
  quotesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quoteCard: {
    width: '48%',
    marginBottom: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FF6B9D',
    borderStyle: 'dashed',
    borderRadius: 8,
  },
  quoteText: {
    fontSize: 12,
    color: '#495057',
    marginBottom: 12,
    textAlignVertical: 'top',
    minHeight: 60,
  },
  quoteFields: {
    flex: 1,
  },
  quoteFieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  quoteFieldLabel: {
    fontSize: 10,
    color: '#495057',
    flex: 1,
  },
  quoteFieldInput: {
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
    paddingVertical: 2,
    fontSize: 10,
    color: '#495057',
    flex: 1,
    marginLeft: 8,
  },
  quoteRatingRow: {
    alignItems: 'center',
    marginTop: 8,
  },
  seriesContent: {
    flex: 1,
  },
  seriesCard: {
    marginBottom: 20,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FF6B9D',
    borderRadius: 8,
  },
  seriesHeader: {
    marginBottom: 12,
  },
  seriesTitle: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#FF6B9D',
  },
  seriesFields: {
    marginBottom: 16,
  },
  seriesFieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  seriesFieldLabel: {
    fontSize: 12,
    color: '#495057',
    flex: 1,
  },
  seriesFieldInput: {
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
    paddingVertical: 2,
    fontSize: 12,
    color: '#495057',
    flex: 1,
    marginLeft: 8,
  },
  overviewSection: {
    marginTop: 12,
  },
  overviewInput: {
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 6,
    padding: 8,
    fontSize: 12,
    color: '#495057',
    textAlignVertical: 'top',
    marginTop: 8,
  },
  moviesInSeries: {
    marginTop: 16,
  },
  movieInSeries: {
    marginBottom: 12,
    padding: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 6,
  },
  movieInSeriesHeader: {
    marginBottom: 8,
  },
  movieInSeriesTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2d4150',
  },
  movieInSeriesFields: {
    flex: 1,
  },
  movieInSeriesFieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  movieInSeriesFieldLabel: {
    fontSize: 10,
    color: '#495057',
    flex: 1,
  },
  movieInSeriesFieldInput: {
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
    paddingVertical: 2,
    fontSize: 10,
    color: '#495057',
    flex: 1,
    marginLeft: 8,
  },
  movieInSeriesRatingRow: {
    alignItems: 'center',
    marginTop: 8,
  },
  movieshelfContent: {
    flex: 1,
  },
  movieshelfGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  movieshelfMovie: {
    width: '48%',
    marginBottom: 16,
    alignItems: 'center',
  },
  movieIcon: {
    position: 'relative',
    marginBottom: 8,
  },
  watchedButton: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#ffffff',
    borderRadius: 10,
  },
  movieInfo: {
    alignItems: 'center',
    width: '100%',
  },
  movieTitleInput: {
    fontSize: 12,
    color: '#495057',
    textAlign: 'center',
    marginBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
    paddingVertical: 2,
    width: '100%',
  },
  movieDirectorInput: {
    fontSize: 10,
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
    paddingVertical: 2,
    width: '100%',
  },
  movieRating: {
    alignItems: 'center',
  },
  // Estilos para el Diario de Películas mejorado
  journalContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  journalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 20,
  },
  journalHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  journalHeaderIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  journalHeaderText: {
    flex: 1,
  },
  journalHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  journalHeaderSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  journalAddButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  journalStatsPanel: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  journalStatsContent: {
    marginBottom: 20,
  },
  journalStatsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D4150',
    marginBottom: 8,
  },
  journalStatsSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  journalStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  journalStatCard: {
    width: '48%',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  journalStatIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  journalStatNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D4150',
    marginBottom: 4,
  },
  journalStatLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  journalFavoriteGenre: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  journalFavoriteGenreContent: {
    alignItems: 'center',
  },
  journalFavoriteGenreTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D4150',
    marginBottom: 12,
  },
  journalFavoriteGenreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  journalFavoriteGenreEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  journalFavoriteGenreText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  journalMoviesContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  journalMoviesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D4150',
    marginBottom: 16,
  },
  journalMovieCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  journalMovieHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  journalMovieCover: {
    width: 60,
    height: 80,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  journalMovieCoverEmoji: {
    fontSize: 30,
  },
  journalMovieInfo: {
    flex: 1,
  },
  journalMovieTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D4150',
    marginBottom: 4,
  },
  journalMovieDirector: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  journalMovieGenre: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  journalMovieGenreEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  journalMovieGenreText: {
    fontSize: 12,
    color: '#6B7280',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  journalMovieStatus: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  journalMovieStatusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  journalMovieDetails: {
    marginBottom: 16,
  },
  journalMovieDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  journalMovieDetailItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  journalMovieDetailLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 6,
    marginRight: 4,
  },
  journalMovieDetailValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2D4150',
  },
  journalMovieProgress: {
    marginBottom: 16,
  },
  journalMovieProgressBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    marginBottom: 8,
  },
  journalMovieProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  journalMovieProgressText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  journalMovieNotes: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  journalMovieNotesTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2D4150',
    marginBottom: 8,
  },
  journalMovieNotesText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  journalMovieMood: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  journalMovieMoodTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2D4150',
    marginRight: 8,
  },
  journalMovieMoodText: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  journalMovieActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  journalMovieActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
  },
  journalMovieActionText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 6,
  },
  journalActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  journalActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  journalActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D4150',
    marginLeft: 8,
  },
  // Estilos para el Registro de Películas mejorado
  logContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  logHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 20,
  },
  logHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logHeaderIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  logHeaderText: {
    flex: 1,
  },
  logHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  logHeaderSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  logAddButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logStatsPanel: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  logStatsContent: {
    marginBottom: 20,
  },
  logStatsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D4150',
    marginBottom: 8,
  },
  logStatsSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  logStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  logStatCard: {
    width: '48%',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  logStatIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  logStatNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D4150',
    marginBottom: 4,
  },
  logStatLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  logFilters: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  logSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  logSearchInput: {
    flex: 1,
    fontSize: 16,
    color: '#2D4150',
    marginLeft: 12,
  },
  logFilterChips: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  logFilterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
  },
  logFilterChipText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  logMoviesContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  logMoviesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D4150',
    marginBottom: 16,
  },
  logMovieCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  logMovieHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  logMovieCover: {
    width: 60,
    height: 80,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  logMovieCoverEmoji: {
    fontSize: 30,
  },
  logMovieInfo: {
    flex: 1,
  },
  logMovieTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D4150',
    marginBottom: 4,
  },
  logMovieDirector: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  logMovieMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logMovieGenre: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logMovieGenreEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  logMovieGenreText: {
    fontSize: 12,
    color: '#6B7280',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  logMovieYear: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  logMovieStatus: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  logMovieStatusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  logMovieDetails: {
    marginBottom: 16,
  },
  logMovieDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  logMovieDetailItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  logMovieDetailLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 6,
    marginRight: 4,
  },
  logMovieDetailValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2D4150',
  },
  logMovieRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 12,
  },
  logMovieRatingLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2D4150',
    marginRight: 12,
  },
  logMovieRatingStars: {
    flexDirection: 'row',
    marginRight: 12,
  },
  logMovieRatingText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFC107',
  },
  logMovieProgress: {
    marginBottom: 16,
  },
  logMovieProgressBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    marginBottom: 8,
  },
  logMovieProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  logMovieProgressText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  logMovieNotes: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  logMovieNotesTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2D4150',
    marginBottom: 8,
  },
  logMovieNotesText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  logMovieMood: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  logMovieMoodTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2D4150',
    marginRight: 8,
  },
  logMovieMoodText: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  logMovieActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  logMovieActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    marginBottom: 8,
    minWidth: 80,
    justifyContent: 'center',
  },
  logMovieActionText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 6,
  },
  logActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  logActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  logActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D4150',
    marginLeft: 8,
  },
  // Estilos para las Citas Favoritas mejoradas
  quotesContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  quotesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 20,
  },
  quotesHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  quotesHeaderIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  quotesHeaderText: {
    flex: 1,
  },
  quotesHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  quotesHeaderSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  quotesAddButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quotesStatsPanel: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  quotesStatsContent: {
    marginBottom: 20,
  },
  quotesStatsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D4150',
    marginBottom: 8,
  },
  quotesStatsSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  quotesStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quotesStatCard: {
    width: '48%',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  quotesStatIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quotesStatNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D4150',
    marginBottom: 4,
  },
  quotesStatLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  quotesFilters: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  quotesSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  quotesSearchInput: {
    flex: 1,
    fontSize: 16,
    color: '#2D4150',
    marginLeft: 12,
  },
  quotesFilterChips: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  quotesFilterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    marginBottom: 8,
  },
  quotesFilterChipText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  quotesListContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  quotesListTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D4150',
    marginBottom: 16,
  },
  quotesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  quotesCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  quotesCardCover: {
    width: 60,
    height: 80,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  quotesCardCoverEmoji: {
    fontSize: 30,
  },
  quotesCardInfo: {
    flex: 1,
  },
  quotesCardMovie: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D4150',
    marginBottom: 4,
  },
  quotesCardCharacter: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  quotesCardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quotesCardGenre: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quotesCardGenreEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  quotesCardGenreText: {
    fontSize: 12,
    color: '#6B7280',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  quotesCardYear: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  quotesCardCategory: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  quotesCardCategoryText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  quotesCardQuote: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  quotesCardQuoteText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#2D4150',
    lineHeight: 24,
    textAlign: 'center',
  },
  quotesCardDetails: {
    marginBottom: 16,
  },
  quotesCardDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  quotesCardDetailItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  quotesCardDetailLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 6,
    marginRight: 4,
  },
  quotesCardDetailValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2D4150',
  },
  quotesCardRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 12,
  },
  quotesCardRatingLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2D4150',
    marginRight: 12,
  },
  quotesCardRatingStars: {
    flexDirection: 'row',
    marginRight: 12,
  },
  quotesCardRatingText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFC107',
  },
  quotesCardContext: {
    marginBottom: 16,
  },
  quotesCardContextItem: {
    marginBottom: 12,
  },
  quotesCardContextLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2D4150',
    marginBottom: 4,
  },
  quotesCardContextText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  quotesCardMood: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quotesCardMoodLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2D4150',
    marginRight: 8,
  },
  quotesCardMoodText: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  quotesCardActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  quotesCardActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    marginBottom: 8,
    minWidth: 80,
    justifyContent: 'center',
  },
  quotesCardActionText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 6,
  },
  quotesActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  quotesActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  quotesActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D4150',
    marginLeft: 8,
  },
  // Estilos para las Sagas de Películas mejoradas
  seriesContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  seriesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 20,
  },
  seriesHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  seriesHeaderIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  seriesHeaderText: {
    flex: 1,
  },
  seriesHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  seriesHeaderSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  seriesAddButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  seriesStatsPanel: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  seriesStatsContent: {
    marginBottom: 20,
  },
  seriesStatsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D4150',
    marginBottom: 8,
  },
  seriesStatsSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  seriesStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  seriesStatCard: {
    width: '48%',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  seriesStatIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  seriesStatNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D4150',
    marginBottom: 4,
  },
  seriesStatLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  seriesFilters: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  seriesSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  seriesSearchInput: {
    flex: 1,
    fontSize: 16,
    color: '#2D4150',
    marginLeft: 12,
  },
  seriesFilterChips: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  seriesFilterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    marginBottom: 8,
  },
  seriesFilterChipText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  seriesListContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  seriesListTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D4150',
    marginBottom: 16,
  },
  seriesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  seriesCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  seriesCardCover: {
    width: 60,
    height: 80,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  seriesCardCoverEmoji: {
    fontSize: 30,
  },
  seriesCardInfo: {
    flex: 1,
  },
  seriesCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D4150',
    marginBottom: 4,
  },
  seriesCardDirector: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  seriesCardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  seriesCardGenre: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seriesCardGenreEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  seriesCardGenreText: {
    fontSize: 12,
    color: '#6B7280',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  seriesCardYear: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  seriesCardStatus: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  seriesCardStatusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  seriesCardDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  seriesCardStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 12,
  },
  seriesCardStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  seriesCardStatLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 6,
    marginRight: 4,
  },
  seriesCardStatValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2D4150',
  },
  seriesCardProgress: {
    marginBottom: 16,
  },
  seriesCardProgressBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    marginBottom: 8,
  },
  seriesCardProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  seriesCardProgressText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  seriesCardMovies: {
    marginBottom: 16,
  },
  seriesCardMoviesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D4150',
    marginBottom: 12,
  },
  seriesMovieItem: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  seriesMovieHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  seriesMovieCover: {
    width: 40,
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  seriesMovieCoverEmoji: {
    fontSize: 20,
  },
  seriesMovieInfo: {
    flex: 1,
  },
  seriesMovieTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2D4150',
    marginBottom: 2,
  },
  seriesMovieYear: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  seriesMovieDuration: {
    fontSize: 12,
    color: '#6B7280',
  },
  seriesMovieRating: {
    alignItems: 'flex-end',
  },
  seriesMovieRatingStars: {
    flexDirection: 'row',
  },
  seriesMovieRatingText: {
    fontSize: 10,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  seriesMovieDetails: {
    marginTop: 8,
  },
  seriesMovieDescription: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
    marginBottom: 4,
  },
  seriesMovieWatchDate: {
    fontSize: 11,
    color: '#4CAF50',
    fontWeight: '500',
  },
  seriesCardActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  seriesCardActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    marginBottom: 8,
    minWidth: 80,
    justifyContent: 'center',
  },
  seriesCardActionText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 6,
  },
  seriesActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  seriesActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  seriesActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D4150',
    marginLeft: 8,
  },
  // Estilos para la Estantería de Películas mejorada
  movieshelfContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  movieshelfHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 20,
  },
  movieshelfHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  movieshelfHeaderIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  movieshelfHeaderText: {
    flex: 1,
  },
  movieshelfHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  movieshelfHeaderSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  movieshelfAddButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  movieshelfStatsPanel: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  movieshelfStatsContent: {
    marginBottom: 20,
  },
  movieshelfStatsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D4150',
    marginBottom: 8,
  },
  movieshelfStatsSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  movieshelfStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  movieshelfStatCard: {
    width: '48%',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  movieshelfStatIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  movieshelfStatNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D4150',
    marginBottom: 4,
  },
  movieshelfStatLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  movieshelfFilters: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  movieshelfSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  movieshelfSearchInput: {
    flex: 1,
    fontSize: 16,
    color: '#2D4150',
    marginLeft: 12,
  },
  movieshelfFilterChips: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  movieshelfFilterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    marginBottom: 8,
  },
  movieshelfFilterChipText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  movieshelfListContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  movieshelfListTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D4150',
    marginBottom: 16,
  },
  movieshelfCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  movieshelfCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  movieshelfCardCover: {
    width: 60,
    height: 80,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  movieshelfCardCoverEmoji: {
    fontSize: 30,
  },
  movieshelfCardInfo: {
    flex: 1,
  },
  movieshelfCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D4150',
    marginBottom: 4,
  },
  movieshelfCardDirector: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  movieshelfCardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  movieshelfCardGenre: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  movieshelfCardGenreEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  movieshelfCardGenreText: {
    fontSize: 12,
    color: '#6B7280',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  movieshelfCardYear: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  movieshelfCardStatus: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  movieshelfCardStatusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  movieshelfCardDetails: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  movieshelfCardDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  movieshelfCardDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  movieshelfCardDetailLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 6,
    marginRight: 4,
  },
  movieshelfCardDetailValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2D4150',
  },
  movieshelfCardRating: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 12,
  },
  movieshelfCardRatingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D4150',
  },
  movieshelfCardRatingStars: {
    flexDirection: 'row',
  },
  movieshelfCardRatingText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF9800',
  },
  movieshelfCardLinks: {
    marginBottom: 16,
  },
  movieshelfCardLinksTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2D4150',
    marginBottom: 8,
  },
  movieshelfCardLinksList: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  movieshelfCardLink: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    minWidth: 80,
    justifyContent: 'center',
  },
  movieshelfCardLinkText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 6,
    fontWeight: '500',
  },
  movieshelfCardNotes: {
    backgroundColor: '#F0F8FF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  movieshelfCardNotesTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2D4150',
    marginBottom: 6,
  },
  movieshelfCardNotesText: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  movieshelfCardActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  movieshelfCardActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    marginBottom: 8,
    minWidth: 80,
    justifyContent: 'center',
  },
  movieshelfCardActionText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 6,
  },
  movieshelfActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  movieshelfActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  movieshelfActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D4150',
    marginLeft: 8,
  },
});

export default MoviesSections;
