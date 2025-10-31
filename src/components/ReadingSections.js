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

const ReadingSections = () => {
  const [activeSection, setActiveSection] = useState('reading-journal');
  
  // Estados para Reading Journal
  const [readingJournal, setReadingJournal] = useState({
    owner: '',
    books: []
  });

  // Estado para tipo de contenido (Libro/Audiolibro)
  const [contentType, setContentType] = useState('book');

  // Estados para Reading Log
  const [readingLog, setReadingLog] = useState({
    books: [
      { id: 1, title: '', author: '', date: '', page: '', rating: 0 },
      { id: 2, title: '', author: '', date: '', page: '', rating: 0 },
      { id: 3, title: '', author: '', date: '', page: '', rating: 0 },
      { id: 4, title: '', author: '', date: '', page: '', rating: 0 },
      { id: 5, title: '', author: '', date: '', page: '', rating: 0 }
    ],
    notes: ''
  });

  // Estados para Reading Tracer
  const [readingTracer, setReadingTracer] = useState({
    keyPages: ['1-10', '10-20', '20-30', '30-40', '40-50'],
    keyTakeaways: '',
    favoriteQuotes: '',
    monthlyProgress: Array(31).fill(false)
  });

  // Estados para Favorite Quotes
  const [favoriteQuotes, setFavoriteQuotes] = useState([
    { id: 1, quote: '', author: '', genre: '', date: '', rating: 0 },
    { id: 2, quote: '', author: '', genre: '', date: '', rating: 0 },
    { id: 3, quote: '', author: '', genre: '', date: '', rating: 0 },
    { id: 4, quote: '', author: '', genre: '', date: '', rating: 0 },
    { id: 5, quote: '', author: '', genre: '', date: '', rating: 0 },
    { id: 6, quote: '', author: '', genre: '', date: '', rating: 0 }
  ]);

  // Estados para Book Series
  const [bookSeries, setBookSeries] = useState([
    {
      id: 1,
      author: '',
      series: '',
      overview: '',
      books: [
        { startDate: '', finishDate: '', pages: '', rating: 0 },
        { startDate: '', finishDate: '', pages: '', rating: 0 },
        { startDate: '', finishDate: '', pages: '', rating: 0 },
        { startDate: '', finishDate: '', pages: '', rating: 0 },
        { startDate: '', finishDate: '', pages: '', rating: 0 }
      ]
    },
    {
      id: 2,
      author: '',
      series: '',
      overview: '',
      books: [
        { startDate: '', finishDate: '', pages: '', rating: 0 },
        { startDate: '', finishDate: '', pages: '', rating: 0 },
        { startDate: '', finishDate: '', pages: '', rating: 0 },
        { startDate: '', finishDate: '', pages: '', rating: 0 },
        { startDate: '', finishDate: '', pages: '', rating: 0 }
      ]
    }
  ]);

  // Estados para Bookshelf
  const [bookshelf, setBookshelf] = useState({
    books: Array(6).fill({ title: '', author: '', rating: 0, read: false })
  });

  const sections = [
    { id: 'reading-journal', name: 'Diario de Lectura', icon: 'book-outline' },
    { id: 'reading-log', name: 'Registro de Lectura', icon: 'list-outline' },
    { id: 'favorite-quotes', name: 'Citas Favoritas', icon: 'quote-outline' },
    { id: 'book-series', name: 'Sagas de Libros', icon: 'library-outline' },
    { id: 'bookshelf', name: 'Estantería', icon: 'library-outline' }
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

  const updateBookRating = (bookId, rating) => {
    setReadingLog(prev => ({
      ...prev,
      books: prev.books.map(book =>
        book.id === bookId ? { ...book, rating } : book
      )
    }));
  };

  const updateBookField = (bookId, field, value) => {
    setReadingLog(prev => ({
      ...prev,
      books: prev.books.map(book =>
        book.id === bookId ? { ...book, [field]: value } : book
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
    setBookSeries(prev =>
      prev.map(series =>
        series.id === seriesId ? { ...series, [field]: value } : series
      )
    );
  };

  const updateSeriesBookField = (seriesId, bookIndex, field, value) => {
    setBookSeries(prev =>
      prev.map(series =>
        series.id === seriesId
          ? {
              ...series,
              books: series.books.map((book, index) =>
                index === bookIndex ? { ...book, [field]: value } : book
              )
            }
          : series
      )
    );
  };

  const updateSeriesBookRating = (seriesId, bookIndex, rating) => {
    setBookSeries(prev =>
      prev.map(series =>
        series.id === seriesId
          ? {
              ...series,
              books: series.books.map((book, index) =>
                index === bookIndex ? { ...book, rating } : book
              )
            }
          : series
      )
    );
  };

  const updateBookshelfBook = (bookIndex, field, value) => {
    setBookshelf(prev => ({
      ...prev,
      books: prev.books.map((book, index) =>
        index === bookIndex ? { ...book, [field]: value } : book
      )
    }));
  };

  const updateBookshelfRating = (bookIndex, rating) => {
    setBookshelf(prev => ({
      ...prev,
      books: prev.books.map((book, index) =>
        index === bookIndex ? { ...book, rating } : book
      )
    }));
  };

  const toggleBookshelfRead = (bookIndex) => {
    setBookshelf(prev => ({
      ...prev,
      books: prev.books.map((book, index) =>
        index === bookIndex ? { ...book, read: !book.read } : book
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

  const renderReadingJournal = () => {
    // Datos de ejemplo para el diario de lectura
    const sampleJournalData = {
      owner: 'María García',
      totalBooks: 12,
      totalPages: 3840,
      averageRating: 4.2,
      currentStreak: 8,
      favoriteGenre: 'Ficción',
      books: [
        {
          id: '1',
          title: 'Cien Años de Soledad',
          author: 'Gabriel García Márquez',
          genre: 'Realismo Mágico',
          startDate: '15/01/2024',
          finishDate: '28/01/2024',
          pages: 471,
          rating: 5,
          status: 'Completado',
          cover: '📚',
          color: '#4CAF50',
          notes: 'Una obra maestra de la literatura latinoamericana. La narrativa de García Márquez es simplemente extraordinaria.',
          quotes: ['"Muchos años después, frente al pelotón de fusilamiento, el coronel Aureliano Buendía había de recordar aquella tarde remota en que su padre lo llevó a conocer el hielo."'],
          progress: 100
        },
        {
          id: '2',
          title: '1984',
          author: 'George Orwell',
          genre: 'Distopía',
          startDate: '01/02/2024',
          finishDate: '14/02/2024',
          pages: 326,
          rating: 4,
          status: 'Completado',
          cover: '📖',
          color: '#2196F3',
          notes: 'Una distopía impactante que sigue siendo relevante hoy en día. La vigilancia y el control del pensamiento son temas muy actuales.',
          quotes: ['"La guerra es la paz. La libertad es la esclavitud. La ignorancia es la fuerza."'],
          progress: 100
        },
        {
          id: '3',
          title: 'El Quijote',
          author: 'Miguel de Cervantes',
          genre: 'Clásico',
          startDate: '20/02/2024',
          finishDate: '',
          pages: 863,
          rating: 0,
          status: 'En Progreso',
          cover: '⚔️',
          color: '#FF9800',
          notes: 'La obra cumbre de la literatura española. Estoy disfrutando cada capítulo de las aventuras del ingenioso hidalgo.',
          quotes: ['"En un lugar de la Mancha, de cuyo nombre no quiero acordarme..."'],
          progress: 35
        },
        {
          id: '4',
          title: 'Sapiens',
          author: 'Yuval Noah Harari',
          genre: 'Historia',
          startDate: '10/03/2024',
          finishDate: '25/03/2024',
          pages: 443,
          rating: 4,
          status: 'Completado',
          cover: '🧠',
          color: '#9C27B0',
          notes: 'Una perspectiva fascinante sobre la evolución humana. Harari tiene una forma muy accesible de explicar conceptos complejos.',
          quotes: ['"La revolución cognitiva nos permitió hablar de cosas que no existen."'],
          progress: 100
        },
        {
          id: '5',
          title: 'Orgullo y Prejuicio',
          author: 'Jane Austen',
          genre: 'Romance',
          startDate: '01/04/2024',
          finishDate: '15/04/2024',
          pages: 432,
          rating: 5,
          status: 'Completado',
          cover: '💕',
          color: '#E91E63',
          notes: 'Una novela romántica clásica con personajes muy bien desarrollados. La relación entre Elizabeth y Darcy es simplemente perfecta.',
          quotes: ['"Es una verdad universalmente reconocida que un hombre soltero, poseedor de una gran fortuna, necesita una esposa."'],
          progress: 100
        }
      ]
    };

    // Obtener color según el género
    const getGenreColor = (genre) => {
      const colorMap = {
        'Realismo Mágico': '#4CAF50',
        'Distopía': '#2196F3',
        'Clásico': '#FF9800',
        'Historia': '#9C27B0',
        'Romance': '#E91E63',
        'Ficción': '#795548',
        'No Ficción': '#607D8B',
        'Misterio': '#3F51B5',
        'Ciencia Ficción': '#00BCD4'
      };
      return colorMap[genre] || '#6B7280';
    };

    // Obtener emoji según el género
    const getGenreEmoji = (genre) => {
      const emojiMap = {
        'Realismo Mágico': '✨',
        'Distopía': '🌆',
        'Clásico': '👑',
        'Historia': '📜',
        'Romance': '💕',
        'Ficción': '📚',
        'No Ficción': '📖',
        'Misterio': '🔍',
        'Ciencia Ficción': '🚀'
      };
      return emojiMap[genre] || '📖';
    };

    // Obtener color según el estado
    const getStatusColor = (status) => {
      switch (status) {
        case 'Completado': return '#4CAF50';
        case 'En Progreso': return '#FF9800';
        case 'Pendiente': return '#6B7280';
        default: return '#6B7280';
      }
    };

    return (
      <ScrollView style={styles.journalContainer} showsVerticalScrollIndicator={false}>
        {/* Header mejorado */}
        <View style={styles.journalHeader}>
          <View style={styles.journalHeaderContent}>
            <View style={styles.journalHeaderIcon}>
              <Icon name="book" size={28} color="#FFFFFF" />
        </View>
            <View style={styles.journalHeaderText}>
              <Text style={styles.journalHeaderTitle}>Diario de Lectura</Text>
              <Text style={styles.journalHeaderSubtitle}>
                Tu colección personal de libros y experiencias
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

        {/* Selector de tipo de contenido */}
        <View style={styles.contentTypeSelector}>
          <TouchableOpacity
            style={[styles.contentTypeButton, contentType === 'book' && styles.contentTypeButtonActive]}
            onPress={() => setContentType('book')}
          >
            <Icon name="book" size={20} color={contentType === 'book' ? '#FFFFFF' : '#6B7280'} />
            <Text style={[styles.contentTypeButtonText, contentType === 'book' && styles.contentTypeButtonTextActive]}>
              Libros
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.contentTypeButton, contentType === 'audiobook' && styles.contentTypeButtonActive]}
            onPress={() => setContentType('audiobook')}
          >
            <Icon name="headset" size={20} color={contentType === 'audiobook' ? '#FFFFFF' : '#6B7280'} />
            <Text style={[styles.contentTypeButtonText, contentType === 'audiobook' && styles.contentTypeButtonTextActive]}>
              Audiolibros
            </Text>
          </TouchableOpacity>
        </View>

        {/* Selector de tipo de contenido */}
        <View style={styles.contentTypeSelector}>
          <TouchableOpacity
            style={[styles.contentTypeButton, contentType === 'book' && styles.contentTypeButtonActive]}
            onPress={() => setContentType('book')}
          >
            <Icon name="book" size={20} color={contentType === 'book' ? '#FFFFFF' : '#6B7280'} />
            <Text style={[styles.contentTypeButtonText, contentType === 'book' && styles.contentTypeButtonTextActive]}>
              Libros
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.contentTypeButton, contentType === 'audiobook' && styles.contentTypeButtonActive]}
            onPress={() => setContentType('audiobook')}
          >
            <Icon name="headset" size={20} color={contentType === 'audiobook' ? '#FFFFFF' : '#6B7280'} />
            <Text style={[styles.contentTypeButtonText, contentType === 'audiobook' && styles.contentTypeButtonTextActive]}>
              Audiolibros
            </Text>
          </TouchableOpacity>
              </View>
              
        {/* Panel de estadísticas personales */}
        <View style={styles.journalStatsPanel}>
          <View style={styles.journalStatsContent}>
            <Text style={styles.journalStatsTitle}>
              {contentType === 'book' ? '📊 Mis Estadísticas de Lectura' : '🎧 Mis Estadísticas de Audiolibros'}
            </Text>
            <Text style={styles.journalStatsSubtitle}>
              Propietario: {sampleJournalData.owner}
            </Text>
          </View>
          <View style={styles.journalStatsGrid}>
            <View style={styles.journalStatCard}>
              <View style={styles.journalStatIcon}>
                <Icon name={contentType === 'book' ? "library" : "headset"} size={20} color="#4CAF50" />
              </View>
              <Text style={styles.journalStatNumber}>{sampleJournalData.totalBooks}</Text>
              <Text style={styles.journalStatLabel}>{contentType === 'book' ? 'Libros Leídos' : 'Audiolibros Escuchados'}</Text>
            </View>
            <View style={styles.journalStatCard}>
              <View style={styles.journalStatIcon}>
                <Icon name={contentType === 'book' ? "document-text" : "time"} size={20} color="#2196F3" />
              </View>
              <Text style={styles.journalStatNumber}>
                {contentType === 'book' ? sampleJournalData.totalPages.toLocaleString() : '156h 30m'}
              </Text>
              <Text style={styles.journalStatLabel}>{contentType === 'book' ? 'Páginas Totales' : 'Horas Escuchadas'}</Text>
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
                
        {/* Lista de libros */}
        <View style={styles.journalBooksContainer}>
          <Text style={styles.journalBooksTitle}>
            {contentType === 'book' ? 'Mi Colección de Libros' : 'Mi Colección de Audiolibros'}
          </Text>
          {sampleJournalData.books.map((book) => (
            <View key={book.id} style={styles.journalBookCard}>
              {/* Header del libro */}
              <View style={styles.journalBookHeader}>
                <View style={styles.journalBookCover}>
                  <Text style={styles.journalBookCoverEmoji}>{book.cover}</Text>
                </View>
                <View style={styles.journalBookInfo}>
                  <Text style={styles.journalBookTitle}>{book.title}</Text>
                  <Text style={styles.journalBookAuthor}>{book.author}</Text>
                  <View style={styles.journalBookGenre}>
                    <Text style={styles.journalBookGenreEmoji}>
                      {getGenreEmoji(book.genre)}
                    </Text>
                    <Text style={styles.journalBookGenreText}>{book.genre}</Text>
                  </View>
                </View>
                <View style={[styles.journalBookStatus, { backgroundColor: getStatusColor(book.status) }]}>
                  <Text style={styles.journalBookStatusText}>{book.status}</Text>
                </View>
              </View>

              {/* Información del libro */}
              <View style={styles.journalBookDetails}>
                <View style={styles.journalBookDetailRow}>
                  <View style={styles.journalBookDetailItem}>
                    <Icon name="calendar" size={14} color="#6B7280" />
                    <Text style={styles.journalBookDetailLabel}>Inicio:</Text>
                    <Text style={styles.journalBookDetailValue}>{book.startDate}</Text>
                  </View>
                  <View style={styles.journalBookDetailItem}>
                    <Icon name="calendar-checkmark" size={14} color="#6B7280" />
                    <Text style={styles.journalBookDetailLabel}>Fin:</Text>
                    <Text style={styles.journalBookDetailValue}>{book.finishDate || 'En progreso'}</Text>
                  </View>
                </View>
                <View style={styles.journalBookDetailRow}>
                  <View style={styles.journalBookDetailItem}>
                    <Icon name={contentType === 'book' ? "document-text" : "time"} size={14} color="#6B7280" />
                    <Text style={styles.journalBookDetailLabel}>
                      {contentType === 'book' ? 'Páginas:' : 'Duración:'}
                    </Text>
                    <Text style={styles.journalBookDetailValue}>
                      {contentType === 'book' ? book.pages : book.duration || '8h 30m'}
                    </Text>
                  </View>
                  <View style={styles.journalBookDetailItem}>
                    <Icon name="star" size={14} color="#FFC107" />
                    <Text style={styles.journalBookDetailLabel}>Calificación:</Text>
                    <Text style={styles.journalBookDetailValue}>
                      {book.rating > 0 ? `${book.rating}/5` : 'Sin calificar'}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Barra de progreso */}
              <View style={styles.journalBookProgress}>
                <View style={styles.journalBookProgressBar}>
                  <View 
                    style={[
                      styles.journalBookProgressFill,
                      { 
                        width: `${book.progress}%`,
                        backgroundColor: book.color
                      }
                    ]}
                  />
                </View>
                <Text style={styles.journalBookProgressText}>
                  {book.progress}% completado
                </Text>
                </View>
                
              {/* Citas favoritas */}
              {book.quotes && book.quotes.length > 0 && (
                <View style={styles.journalBookQuotes}>
                  <Text style={styles.journalBookQuotesTitle}>💬 Cita Favorita</Text>
                  <Text style={styles.journalBookQuoteText}>"{book.quotes[0]}"</Text>
                </View>
              )}

              {/* Notas personales */}
              {book.notes && (
                <View style={styles.journalBookNotes}>
                  <Text style={styles.journalBookNotesTitle}>📝 Mis Notas</Text>
                  <Text style={styles.journalBookNotesText}>{book.notes}</Text>
                </View>
              )}

              {/* Botones de acción */}
              <View style={styles.journalBookActions}>
                <TouchableOpacity style={styles.journalBookActionButton}>
                  <Icon name="create" size={16} color="#4CAF50" />
                  <Text style={styles.journalBookActionText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.journalBookActionButton}>
                  <Icon name="share" size={16} color="#2196F3" />
                  <Text style={styles.journalBookActionText}>Compartir</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.journalBookActionButton}>
                  <Icon name="bookmark" size={16} color="#FF9800" />
                  <Text style={styles.journalBookActionText}>Guardar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Botones de acción principales */}
        <View style={styles.journalActions}>
          <TouchableOpacity style={styles.journalActionButton}>
            <Icon name="add-circle" size={20} color="#4CAF50" />
            <Text style={styles.journalActionText}>
              {contentType === 'book' ? 'Nuevo Libro' : 'Nuevo Audiolibro'}
            </Text>
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

  const renderReadingLog = () => {
    // Datos de ejemplo para el registro de lectura
    const sampleReadingLogData = {
      totalBooks: 8,
      totalPages: 2847,
      averageRating: 4.1,
      currentStreak: 12,
      monthlyGoal: 4,
      booksReadThisMonth: 3,
      books: [
        {
          id: '1',
          title: 'El Principito',
          author: 'Antoine de Saint-Exupéry',
          genre: 'Ficción',
          date: '15/01/2024',
          page: '96',
          rating: 5,
          status: 'Completado',
          cover: '👑',
          color: '#4CAF50',
          progress: 100,
          notes: 'Una obra maestra que me tocó el corazón. La sabiduría del principito es atemporal.',
          timeSpent: '2h 30min',
          difficulty: 'Fácil'
        },
        {
          id: '2',
          title: 'Cien Años de Soledad',
          author: 'Gabriel García Márquez',
          genre: 'Realismo Mágico',
          date: '20/01/2024',
          page: '471',
          rating: 5,
          status: 'Completado',
          cover: '📚',
          color: '#4CAF50',
          progress: 100,
          notes: 'Una obra maestra de la literatura latinoamericana. La narrativa de García Márquez es extraordinaria.',
          timeSpent: '8h 45min',
          difficulty: 'Difícil'
        },
        {
          id: '3',
          title: '1984',
          author: 'George Orwell',
          genre: 'Distopía',
          date: '05/02/2024',
          page: '326',
          rating: 4,
          status: 'Completado',
          cover: '📖',
          color: '#4CAF50',
          progress: 100,
          notes: 'Una distopía impactante que sigue siendo relevante hoy en día.',
          timeSpent: '6h 20min',
          difficulty: 'Intermedio'
        },
        {
          id: '4',
          title: 'El Quijote',
          author: 'Miguel de Cervantes',
          genre: 'Clásico',
          date: '15/02/2024',
          page: '863',
          rating: 0,
          status: 'En Progreso',
          cover: '⚔️',
          color: '#FF9800',
          progress: 35,
          notes: 'La obra cumbre de la literatura española. Estoy disfrutando cada capítulo.',
          timeSpent: '12h 15min',
          difficulty: 'Difícil'
        },
        {
          id: '5',
          title: 'Sapiens',
          author: 'Yuval Noah Harari',
          genre: 'Historia',
          date: '01/03/2024',
          page: '443',
          rating: 4,
          status: 'Completado',
          cover: '🧠',
          color: '#4CAF50',
          progress: 100,
          notes: 'Una perspectiva fascinante sobre la evolución humana.',
          timeSpent: '7h 30min',
          difficulty: 'Intermedio'
        },
        {
          id: '6',
          title: 'Orgullo y Prejuicio',
          author: 'Jane Austen',
          genre: 'Romance',
          date: '10/03/2024',
          page: '432',
          rating: 5,
          status: 'Completado',
          cover: '💕',
          color: '#4CAF50',
          progress: 100,
          notes: 'Una novela romántica clásica con personajes muy bien desarrollados.',
          timeSpent: '5h 45min',
          difficulty: 'Intermedio'
        },
        {
          id: '7',
          title: 'El Hobbit',
          author: 'J.R.R. Tolkien',
          genre: 'Fantasía',
          date: '20/03/2024',
          page: '310',
          rating: 4,
          status: 'Completado',
          cover: '🧙',
          color: '#4CAF50',
          progress: 100,
          notes: 'Una aventura épica que me transportó a la Tierra Media.',
          timeSpent: '4h 20min',
          difficulty: 'Fácil'
        },
        {
          id: '8',
          title: 'Dune',
          author: 'Frank Herbert',
          genre: 'Ciencia Ficción',
          date: '01/04/2024',
          page: '688',
          rating: 0,
          status: 'En Progreso',
          cover: '🚀',
          color: '#FF9800',
          progress: 25,
          notes: 'Un mundo complejo y fascinante. La construcción del universo es impresionante.',
          timeSpent: '6h 10min',
          difficulty: 'Difícil'
        }
      ]
    };

    // Obtener color según el género
    const getGenreColor = (genre) => {
      const colorMap = {
        'Ficción': '#4CAF50',
        'Realismo Mágico': '#4CAF50',
        'Distopía': '#2196F3',
        'Clásico': '#FF9800',
        'Historia': '#9C27B0',
        'Romance': '#E91E63',
        'Fantasía': '#795548',
        'Ciencia Ficción': '#00BCD4',
        'Misterio': '#3F51B5',
        'No Ficción': '#607D8B'
      };
      return colorMap[genre] || '#6B7280';
    };

    // Obtener emoji según el género
    const getGenreEmoji = (genre) => {
      const emojiMap = {
        'Ficción': '📚',
        'Realismo Mágico': '✨',
        'Distopía': '🌆',
        'Clásico': '👑',
        'Historia': '📜',
        'Romance': '💕',
        'Fantasía': '🧙',
        'Ciencia Ficción': '🚀',
        'Misterio': '🔍',
        'No Ficción': '📖'
      };
      return emojiMap[genre] || '📖';
    };

    // Obtener color según el estado
    const getStatusColor = (status) => {
      switch (status) {
        case 'Completado': return '#4CAF50';
        case 'En Progreso': return '#FF9800';
        case 'Pendiente': return '#6B7280';
        default: return '#6B7280';
      }
    };

    // Obtener color según la dificultad
    const getDifficultyColor = (difficulty) => {
      switch (difficulty) {
        case 'Fácil': return '#4CAF50';
        case 'Intermedio': return '#FF9800';
        case 'Difícil': return '#F44336';
        default: return '#6B7280';
      }
    };

    return (
      <ScrollView style={styles.readingLogContainer} showsVerticalScrollIndicator={false}>
        {/* Header mejorado */}
        <View style={styles.readingLogHeader}>
          <View style={styles.readingLogHeaderContent}>
            <View style={styles.readingLogHeaderIcon}>
              <Icon name="list" size={28} color="#FFFFFF" />
        </View>
            <View style={styles.readingLogHeaderText}>
              <Text style={styles.readingLogHeaderTitle}>Registro de Lectura</Text>
              <Text style={styles.readingLogHeaderSubtitle}>
                Seguimiento detallado de tus lecturas
              </Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.readingLogAddButton}
            onPress={() => {}}
          >
            <Icon name="add" size={20} color="#FFFFFF" />
          </TouchableOpacity>
      </View>

        {/* Selector de tipo de contenido */}
        <View style={styles.contentTypeSelector}>
          <TouchableOpacity
            style={[styles.contentTypeButton, contentType === 'book' && styles.contentTypeButtonActive]}
            onPress={() => setContentType('book')}
          >
            <Icon name="book" size={20} color={contentType === 'book' ? '#FFFFFF' : '#6B7280'} />
            <Text style={[styles.contentTypeButtonText, contentType === 'book' && styles.contentTypeButtonTextActive]}>
              Libros
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.contentTypeButton, contentType === 'audiobook' && styles.contentTypeButtonActive]}
            onPress={() => setContentType('audiobook')}
          >
            <Icon name="headset" size={20} color={contentType === 'audiobook' ? '#FFFFFF' : '#6B7280'} />
            <Text style={[styles.contentTypeButtonText, contentType === 'audiobook' && styles.contentTypeButtonTextActive]}>
              Audiolibros
            </Text>
          </TouchableOpacity>
        </View>

        {/* Panel de estadísticas generales */}
        <View style={styles.readingLogStatsPanel}>
          <View style={styles.readingLogStatsContent}>
            <Text style={styles.readingLogStatsTitle}>
              {contentType === 'book' ? '📊 Resumen de Lectura' : '🎧 Resumen de Audiolibros'}
            </Text>
            <Text style={styles.readingLogStatsSubtitle}>
              {sampleReadingLogData.booksReadThisMonth} de {sampleReadingLogData.monthlyGoal} {contentType === 'book' ? 'libros' : 'audiolibros'} este mes
            </Text>
          </View>
          <View style={styles.readingLogStatsGrid}>
            <View style={styles.readingLogStatCard}>
              <View style={styles.readingLogStatIcon}>
                <Icon name={contentType === 'book' ? "library" : "headset"} size={20} color="#4CAF50" />
              </View>
              <Text style={styles.readingLogStatNumber}>{sampleReadingLogData.totalBooks}</Text>
              <Text style={styles.readingLogStatLabel}>{contentType === 'book' ? 'Libros Totales' : 'Audiolibros Totales'}</Text>
            </View>
            <View style={styles.readingLogStatCard}>
              <View style={styles.readingLogStatIcon}>
                <Icon name={contentType === 'book' ? "document-text" : "time"} size={20} color="#2196F3" />
              </View>
              <Text style={styles.readingLogStatNumber}>
                {contentType === 'book' ? sampleReadingLogData.totalPages.toLocaleString() : '156h 30m'}
              </Text>
              <Text style={styles.readingLogStatLabel}>{contentType === 'book' ? 'Páginas Leídas' : 'Horas Escuchadas'}</Text>
            </View>
            <View style={styles.readingLogStatCard}>
              <View style={styles.readingLogStatIcon}>
                <Icon name="star" size={20} color="#FFC107" />
              </View>
              <Text style={styles.readingLogStatNumber}>{sampleReadingLogData.averageRating}</Text>
              <Text style={styles.readingLogStatLabel}>Calificación Promedio</Text>
            </View>
            <View style={styles.readingLogStatCard}>
              <View style={styles.readingLogStatIcon}>
                <Icon name="flame" size={20} color="#FF9800" />
              </View>
              <Text style={styles.readingLogStatNumber}>{sampleReadingLogData.currentStreak}</Text>
              <Text style={styles.readingLogStatLabel}>Días de Racha</Text>
            </View>
          </View>
        </View>

        {/* Progreso del objetivo mensual */}
        <View style={styles.readingLogGoalPanel}>
          <View style={styles.readingLogGoalContent}>
            <Text style={styles.readingLogGoalTitle}>
              {contentType === 'book' ? '🎯 Objetivo Mensual' : '🎧 Objetivo Mensual'}
            </Text>
            <View style={styles.readingLogGoalProgress}>
              <View style={styles.readingLogGoalProgressBar}>
                <View 
                  style={[
                    styles.readingLogGoalProgressFill,
                    { 
                      width: `${(sampleReadingLogData.booksReadThisMonth / sampleReadingLogData.monthlyGoal) * 100}%`
                    }
                  ]}
                />
              </View>
              <Text style={styles.readingLogGoalProgressText}>
                {sampleReadingLogData.booksReadThisMonth}/{sampleReadingLogData.monthlyGoal} {contentType === 'book' ? 'libros' : 'audiolibros'}
              </Text>
            </View>
          </View>
          </View>
          
        {/* Lista de libros */}
        <View style={styles.readingLogBooksContainer}>
          <Text style={styles.readingLogBooksTitle}>
            {contentType === 'book' ? 'Mis Lecturas' : 'Mis Audiolibros'}
          </Text>
          {sampleReadingLogData.books.map((book) => (
            <View key={book.id} style={styles.readingLogBookCard}>
              {/* Header del libro */}
              <View style={styles.readingLogBookHeader}>
                <View style={styles.readingLogBookCover}>
                  <Text style={styles.readingLogBookCoverEmoji}>{book.cover}</Text>
                </View>
                <View style={styles.readingLogBookInfo}>
                  <Text style={styles.readingLogBookTitle}>{book.title}</Text>
                  <Text style={styles.readingLogBookAuthor}>{book.author}</Text>
                  <View style={styles.readingLogBookGenre}>
                    <Text style={styles.readingLogBookGenreEmoji}>
                      {getGenreEmoji(book.genre)}
                    </Text>
                    <Text style={styles.readingLogBookGenreText}>{book.genre}</Text>
                  </View>
                </View>
                <View style={[styles.readingLogBookStatus, { backgroundColor: getStatusColor(book.status) }]}>
                  <Text style={styles.readingLogBookStatusText}>{book.status}</Text>
                </View>
              </View>

              {/* Información del libro */}
              <View style={styles.readingLogBookDetails}>
                <View style={styles.readingLogBookDetailRow}>
                  <View style={styles.readingLogBookDetailItem}>
                    <Icon name="calendar" size={14} color="#6B7280" />
                    <Text style={styles.readingLogBookDetailLabel}>Fecha:</Text>
                    <Text style={styles.readingLogBookDetailValue}>{book.date}</Text>
                  </View>
                  <View style={styles.readingLogBookDetailItem}>
                    <Icon name={contentType === 'book' ? "document-text" : "time"} size={14} color="#6B7280" />
                    <Text style={styles.readingLogBookDetailLabel}>
                      {contentType === 'book' ? 'Páginas:' : 'Duración:'}
                    </Text>
                    <Text style={styles.readingLogBookDetailValue}>
                      {contentType === 'book' ? book.page : book.duration || '8h 30m'}
                    </Text>
                  </View>
                </View>
                <View style={styles.readingLogBookDetailRow}>
                  <View style={styles.readingLogBookDetailItem}>
                    <Icon name="time" size={14} color="#6B7280" />
                    <Text style={styles.readingLogBookDetailLabel}>Tiempo:</Text>
                    <Text style={styles.readingLogBookDetailValue}>{book.timeSpent}</Text>
                  </View>
                  <View style={styles.readingLogBookDetailItem}>
                    <Icon name="trending-up" size={14} color="#6B7280" />
                    <Text style={styles.readingLogBookDetailLabel}>Dificultad:</Text>
                    <Text style={[styles.readingLogBookDetailValue, { color: getDifficultyColor(book.difficulty) }]}>
                      {book.difficulty}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Barra de progreso */}
              <View style={styles.readingLogBookProgress}>
                <View style={styles.readingLogBookProgressBar}>
                  <View 
                    style={[
                      styles.readingLogBookProgressFill,
                      { 
                        width: `${book.progress}%`,
                        backgroundColor: book.color
                      }
                    ]}
                  />
              </View>
                <Text style={styles.readingLogBookProgressText}>
                  {book.progress}% completado
                </Text>
            </View>

              {/* Calificación */}
              <View style={styles.readingLogBookRating}>
                <Text style={styles.readingLogBookRatingLabel}>Calificación:</Text>
                <View style={styles.readingLogBookRatingStars}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Icon
                      key={star}
                      name={star <= book.rating ? 'star' : 'star-outline'}
                      size={16}
                      color={star <= book.rating ? '#FFC107' : '#E5E7EB'}
                    />
                  ))}
                  <Text style={styles.readingLogBookRatingText}>
                    {book.rating > 0 ? `${book.rating}/5` : 'Sin calificar'}
                  </Text>
                </View>
        </View>

              {/* Notas personales */}
              {book.notes && (
                <View style={styles.readingLogBookNotes}>
                  <Text style={styles.readingLogBookNotesTitle}>📝 Mis Notas</Text>
                  <Text style={styles.readingLogBookNotesText}>{book.notes}</Text>
        </View>
              )}

              {/* Botones de acción */}
              <View style={styles.readingLogBookActions}>
                <TouchableOpacity style={styles.readingLogBookActionButton}>
                  <Icon name="create" size={16} color="#4CAF50" />
                  <Text style={styles.readingLogBookActionText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.readingLogBookActionButton}>
                  <Icon name="share" size={16} color="#2196F3" />
                  <Text style={styles.readingLogBookActionText}>Compartir</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.readingLogBookActionButton}>
                  <Icon name="bookmark" size={16} color="#FF9800" />
                  <Text style={styles.readingLogBookActionText}>Guardar</Text>
                </TouchableOpacity>
      </View>
    </View>
          ))}
        </View>

        {/* Botones de acción principales */}
        <View style={styles.readingLogActions}>
          <TouchableOpacity style={styles.readingLogActionButton}>
            <Icon name="add-circle" size={20} color="#4CAF50" />
            <Text style={styles.readingLogActionText}>
              {contentType === 'book' ? 'Nuevo Registro' : 'Nuevo Audiolibro'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.readingLogActionButton}>
            <Icon name="analytics" size={20} color="#2196F3" />
            <Text style={styles.readingLogActionText}>Ver Estadísticas</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.readingLogActionButton}>
            <Icon name="download" size={20} color="#FF9800" />
            <Text style={styles.readingLogActionText}>Exportar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  const renderFavoriteQuotes = () => {
    // Datos de ejemplo para las citas favoritas
    const sampleQuotesData = {
      totalQuotes: 12,
      totalAuthors: 8,
      averageRating: 4.3,
      favoriteGenre: 'Filosofía',
      quotes: [
        {
          id: '1',
          quote: 'La vida es lo que pasa mientras estás ocupado haciendo otros planes.',
          author: 'John Lennon',
          book: 'Beautiful Boy',
          genre: 'Filosofía',
          date: '15/01/2024',
          rating: 5,
          category: 'Vida',
          color: '#4CAF50',
          emoji: '🌟',
          tags: ['vida', 'filosofía', 'inspiracional'],
          page: 45,
          chapter: 'Capítulo 3'
        },
        {
          id: '2',
          quote: 'No es la fuerza del cuerpo lo que cuenta, sino la fuerza del espíritu.',
          author: 'J.R.R. Tolkien',
          book: 'El Señor de los Anillos',
          genre: 'Fantasía',
          date: '20/01/2024',
          rating: 5,
          category: 'Valor',
          color: '#2196F3',
          emoji: '⚔️',
          tags: ['valor', 'espíritu', 'fantasía'],
          page: 123,
          chapter: 'La Comunidad del Anillo'
        },
        {
          id: '3',
          quote: 'La única forma de hacer un gran trabajo es amar lo que haces.',
          author: 'Steve Jobs',
          book: 'Biografía de Steve Jobs',
          genre: 'Biografía',
          date: '25/01/2024',
          rating: 4,
          category: 'Trabajo',
          color: '#FF9800',
          emoji: '💼',
          tags: ['trabajo', 'pasión', 'éxito'],
          page: 78,
          chapter: 'Los Años de Apple'
        },
        {
          id: '4',
          quote: 'La imaginación es más importante que el conocimiento.',
          author: 'Albert Einstein',
          book: 'Mi Visión del Mundo',
          genre: 'Ciencia',
          date: '02/02/2024',
          rating: 5,
          category: 'Ciencia',
          color: '#9C27B0',
          emoji: '🧠',
          tags: ['ciencia', 'imaginación', 'conocimiento'],
          page: 56,
          chapter: 'Reflexiones Científicas'
        },
        {
          id: '5',
          quote: 'El éxito es la suma de pequeños esfuerzos repetidos día tras día.',
          author: 'Robert Collier',
          book: 'El Secreto del Éxito',
          genre: 'Autoayuda',
          date: '10/02/2024',
          rating: 4,
          category: 'Éxito',
          color: '#E91E63',
          emoji: '🎯',
          tags: ['éxito', 'esfuerzo', 'persistencia'],
          page: 92,
          chapter: 'Los Fundamentos del Éxito'
        },
        {
          id: '6',
          quote: 'La felicidad no es algo hecho. Viene de tus propias acciones.',
          author: 'Dalai Lama',
          book: 'El Arte de la Felicidad',
          genre: 'Espiritualidad',
          date: '15/02/2024',
          rating: 5,
          category: 'Felicidad',
          color: '#4CAF50',
          emoji: '😊',
          tags: ['felicidad', 'espiritualidad', 'acciones'],
          page: 34,
          chapter: 'La Naturaleza de la Felicidad'
        },
        {
          id: '7',
          quote: 'La educación es el arma más poderosa que puedes usar para cambiar el mundo.',
          author: 'Nelson Mandela',
          book: 'Largo Camino hacia la Libertad',
          genre: 'Biografía',
          date: '22/02/2024',
          rating: 5,
          category: 'Educación',
          color: '#2196F3',
          emoji: '📚',
          tags: ['educación', 'cambio', 'libertad'],
          page: 156,
          chapter: 'Los Años de Prisión'
        },
        {
          id: '8',
          quote: 'No hay nada noble en ser superior a tu prójimo. La verdadera nobleza está en ser superior a tu yo anterior.',
          author: 'Ernest Hemingway',
          book: 'El Viejo y el Mar',
          genre: 'Literatura',
          date: '28/02/2024',
          rating: 4,
          category: 'Crecimiento',
          color: '#FF9800',
          emoji: '🌊',
          tags: ['crecimiento', 'nobleza', 'literatura'],
          page: 67,
          chapter: 'La Lucha en el Mar'
        },
        {
          id: '9',
          quote: 'La única manera de hacer un gran trabajo es amar lo que haces.',
          author: 'Steve Jobs',
          book: 'Discurso en Stanford',
          genre: 'Motivacional',
          date: '05/03/2024',
          rating: 5,
          category: 'Motivación',
          color: '#9C27B0',
          emoji: '🚀',
          tags: ['motivación', 'trabajo', 'pasión'],
          page: 1,
          chapter: 'Discurso de Graduación'
        },
        {
          id: '10',
          quote: 'El futuro pertenece a aquellos que creen en la belleza de sus sueños.',
          author: 'Eleanor Roosevelt',
          book: 'Mi Historia',
          genre: 'Biografía',
          date: '12/03/2024',
          rating: 4,
          category: 'Sueños',
          color: '#E91E63',
          emoji: '✨',
          tags: ['sueños', 'futuro', 'belleza'],
          page: 89,
          chapter: 'Los Años de la Casa Blanca'
        },
        {
          id: '11',
          quote: 'La vida es 10% lo que te pasa y 90% cómo reaccionas a ello.',
          author: 'Charles R. Swindoll',
          book: 'Actitud: La Diferencia',
          genre: 'Autoayuda',
          date: '18/03/2024',
          rating: 4,
          category: 'Actitud',
          color: '#4CAF50',
          emoji: '💪',
          tags: ['actitud', 'reacción', 'vida'],
          page: 23,
          chapter: 'El Poder de la Actitud'
        },
        {
          id: '12',
          quote: 'La única persona que eres destinado a convertirte es la persona que decides ser.',
          author: 'Ralph Waldo Emerson',
          book: 'Autosuficiencia',
          genre: 'Filosofía',
          date: '25/03/2024',
          rating: 5,
          category: 'Destino',
          color: '#2196F3',
          emoji: '🎭',
          tags: ['destino', 'decisión', 'filosofía'],
          page: 45,
          chapter: 'La Naturaleza del Ser'
        }
      ]
    };

    // Obtener color según la categoría
    const getCategoryColor = (category) => {
      const colorMap = {
        'Vida': '#4CAF50',
        'Valor': '#2196F3',
        'Trabajo': '#FF9800',
        'Ciencia': '#9C27B0',
        'Éxito': '#E91E63',
        'Felicidad': '#4CAF50',
        'Educación': '#2196F3',
        'Crecimiento': '#FF9800',
        'Motivación': '#9C27B0',
        'Sueños': '#E91E63',
        'Actitud': '#4CAF50',
        'Destino': '#2196F3'
      };
      return colorMap[category] || '#6B7280';
    };

    // Obtener emoji según la categoría
    const getCategoryEmoji = (category) => {
      const emojiMap = {
        'Vida': '🌟',
        'Valor': '⚔️',
        'Trabajo': '💼',
        'Ciencia': '🧠',
        'Éxito': '🎯',
        'Felicidad': '😊',
        'Educación': '📚',
        'Crecimiento': '🌊',
        'Motivación': '🚀',
        'Sueños': '✨',
        'Actitud': '💪',
        'Destino': '🎭'
      };
      return emojiMap[category] || '💭';
    };

    // Obtener color según el género
    const getGenreColor = (genre) => {
      const colorMap = {
        'Filosofía': '#4CAF50',
        'Fantasía': '#2196F3',
        'Biografía': '#FF9800',
        'Ciencia': '#9C27B0',
        'Autoayuda': '#E91E63',
        'Espiritualidad': '#4CAF50',
        'Literatura': '#FF9800',
        'Motivacional': '#9C27B0'
      };
      return colorMap[genre] || '#6B7280';
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
              <Text style={styles.quotesHeaderTitle}>Citas Favoritas</Text>
              <Text style={styles.quotesHeaderSubtitle}>
                Las palabras que inspiran tu vida
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

        {/* Selector de tipo de contenido */}
        <View style={styles.contentTypeSelector}>
          <TouchableOpacity
            style={[styles.contentTypeButton, contentType === 'book' && styles.contentTypeButtonActive]}
            onPress={() => setContentType('book')}
          >
            <Icon name="book" size={20} color={contentType === 'book' ? '#FFFFFF' : '#6B7280'} />
            <Text style={[styles.contentTypeButtonText, contentType === 'book' && styles.contentTypeButtonTextActive]}>
              Libros
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.contentTypeButton, contentType === 'audiobook' && styles.contentTypeButtonActive]}
            onPress={() => setContentType('audiobook')}
          >
            <Icon name="headset" size={20} color={contentType === 'audiobook' ? '#FFFFFF' : '#6B7280'} />
            <Text style={[styles.contentTypeButtonText, contentType === 'audiobook' && styles.contentTypeButtonTextActive]}>
              Audiolibros
            </Text>
          </TouchableOpacity>
        </View>

        {/* Panel de estadísticas */}
        <View style={styles.quotesStatsPanel}>
          <View style={styles.quotesStatsContent}>
            <Text style={styles.quotesStatsTitle}>
              {contentType === 'book' ? '📚 Mi Colección de Citas' : '🎧 Mis Citas de Audiolibros'}
            </Text>
            <Text style={styles.quotesStatsSubtitle}>
              {sampleQuotesData.totalQuotes} citas de {sampleQuotesData.totalAuthors} autores
            </Text>
          </View>
          <View style={styles.quotesStatsGrid}>
            <View style={styles.quotesStatCard}>
              <View style={styles.quotesStatIcon}>
                <Icon name="quote" size={20} color="#4CAF50" />
              </View>
              <Text style={styles.quotesStatNumber}>{sampleQuotesData.totalQuotes}</Text>
              <Text style={styles.quotesStatLabel}>Citas Totales</Text>
            </View>
            <View style={styles.quotesStatCard}>
              <View style={styles.quotesStatIcon}>
                <Icon name="person" size={20} color="#2196F3" />
              </View>
              <Text style={styles.quotesStatNumber}>{sampleQuotesData.totalAuthors}</Text>
              <Text style={styles.quotesStatLabel}>Autores</Text>
            </View>
            <View style={styles.quotesStatCard}>
              <View style={styles.quotesStatIcon}>
                <Icon name="star" size={20} color="#FFC107" />
              </View>
              <Text style={styles.quotesStatNumber}>{sampleQuotesData.averageRating}</Text>
              <Text style={styles.quotesStatLabel}>Calificación Promedio</Text>
            </View>
            <View style={styles.quotesStatCard}>
              <View style={styles.quotesStatIcon}>
                <Icon name="library" size={20} color="#FF9800" />
              </View>
              <Text style={styles.quotesStatNumber}>{sampleQuotesData.favoriteGenre}</Text>
              <Text style={styles.quotesStatLabel}>Género Favorito</Text>
            </View>
          </View>
                </View>
                
        {/* Lista de citas */}
        <View style={styles.quotesListContainer}>
          <Text style={styles.quotesListTitle}>Mis Citas Inspiradoras</Text>
          {sampleQuotesData.quotes.map((quote) => (
            <View key={quote.id} style={styles.quotesCard}>
              {/* Header de la cita */}
              <View style={styles.quotesCardHeader}>
                <View style={styles.quotesCardEmoji}>
                  <Text style={styles.quotesCardEmojiText}>{quote.emoji}</Text>
                </View>
                <View style={styles.quotesCardInfo}>
                  <Text style={styles.quotesCardAuthor}>{quote.author}</Text>
                  <Text style={styles.quotesCardBook}>{quote.book}</Text>
                  <View style={styles.quotesCardGenre}>
                    <Text style={styles.quotesCardGenreText}>{quote.genre}</Text>
                  </View>
                </View>
                <View style={[styles.quotesCardCategory, { backgroundColor: getCategoryColor(quote.category) }]}>
                  <Text style={styles.quotesCardCategoryText}>{quote.category}</Text>
                </View>
                </View>
                
              {/* Texto de la cita */}
              <View style={styles.quotesCardQuote}>
                <Text style={styles.quotesCardQuoteText}>"{quote.quote}"</Text>
                </View>
                
              {/* Información adicional */}
              <View style={styles.quotesCardDetails}>
                <View style={styles.quotesCardDetailRow}>
                  <View style={styles.quotesCardDetailItem}>
                    <Icon name="calendar" size={14} color="#6B7280" />
                    <Text style={styles.quotesCardDetailLabel}>Fecha:</Text>
                    <Text style={styles.quotesCardDetailValue}>{quote.date}</Text>
                </View>
                  <View style={styles.quotesCardDetailItem}>
                    <Icon name="document-text" size={14} color="#6B7280" />
                    <Text style={styles.quotesCardDetailLabel}>Página:</Text>
                    <Text style={styles.quotesCardDetailValue}>{quote.page}</Text>
              </View>
            </View>
                <View style={styles.quotesCardDetailRow}>
                  <View style={styles.quotesCardDetailItem}>
                    <Icon name="book" size={14} color="#6B7280" />
                    <Text style={styles.quotesCardDetailLabel}>Capítulo:</Text>
                    <Text style={styles.quotesCardDetailValue}>{quote.chapter}</Text>
        </View>
                  <View style={styles.quotesCardDetailItem}>
                    <Icon name="star" size={14} color="#FFC107" />
                    <Text style={styles.quotesCardDetailLabel}>Calificación:</Text>
                    <Text style={styles.quotesCardDetailValue}>{quote.rating}/5</Text>
      </View>
    </View>
              </View>

              {/* Tags */}
              <View style={styles.quotesCardTags}>
                {quote.tags.map((tag, index) => (
                  <View key={index} style={styles.quotesCardTag}>
                    <Text style={styles.quotesCardTagText}>#{tag}</Text>
        </View>
                ))}
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

  const renderBookSeries = () => {
    // Datos de ejemplo para las sagas de libros
    const sampleSeriesData = {
      totalSeries: 6,
      totalBooks: 24,
      completedSeries: 2,
      averageRating: 4.2,
      series: [
        {
          id: '1',
          title: 'El Señor de los Anillos',
          author: 'J.R.R. Tolkien',
          genre: 'Fantasía',
          status: 'Completada',
          totalBooks: 3,
          booksRead: 3,
          progress: 100,
          color: '#4CAF50',
          emoji: '🧙',
          overview: 'Una épica aventura en la Tierra Media donde un hobbit debe destruir el Anillo Único para salvar el mundo de la oscuridad.',
          startDate: '15/01/2024',
          endDate: '28/02/2024',
          totalPages: 1216,
          averageRating: 5,
          books: [
            {
              id: '1',
              title: 'La Comunidad del Anillo',
              order: 1,
              pages: 423,
              rating: 5,
              status: 'Completado',
              startDate: '15/01/2024',
              endDate: '05/02/2024',
              color: '#4CAF50'
            },
            {
              id: '2',
              title: 'Las Dos Torres',
              order: 2,
              pages: 352,
              rating: 5,
              status: 'Completado',
              startDate: '06/02/2024',
              endDate: '18/02/2024',
              color: '#4CAF50'
            },
            {
              id: '3',
              title: 'El Retorno del Rey',
              order: 3,
              pages: 441,
              rating: 5,
              status: 'Completado',
              startDate: '19/02/2024',
              endDate: '28/02/2024',
              color: '#4CAF50'
            }
          ]
        },
        {
          id: '2',
          title: 'Harry Potter',
          author: 'J.K. Rowling',
          genre: 'Fantasía',
          status: 'En Progreso',
          totalBooks: 7,
          booksRead: 4,
          progress: 57,
          color: '#FF9800',
          emoji: '⚡',
          overview: 'Las aventuras de un joven mago que descubre su herencia mágica y lucha contra las fuerzas oscuras.',
          startDate: '01/03/2024',
          endDate: '',
          totalPages: 3407,
          averageRating: 4.5,
          books: [
            {
              id: '1',
              title: 'La Piedra Filosofal',
              order: 1,
              pages: 223,
              rating: 5,
              status: 'Completado',
              startDate: '01/03/2024',
              endDate: '08/03/2024',
              color: '#4CAF50'
            },
            {
              id: '2',
              title: 'La Cámara Secreta',
              order: 2,
              pages: 251,
              rating: 4,
              status: 'Completado',
              startDate: '09/03/2024',
              endDate: '18/03/2024',
              color: '#4CAF50'
            },
            {
              id: '3',
              title: 'El Prisionero de Azkaban',
              order: 3,
              pages: 317,
              rating: 5,
              status: 'Completado',
              startDate: '19/03/2024',
              endDate: '30/03/2024',
              color: '#4CAF50'
            },
            {
              id: '4',
              title: 'El Cáliz de Fuego',
              order: 4,
              pages: 636,
              rating: 4,
              status: 'Completado',
              startDate: '31/03/2024',
              endDate: '15/04/2024',
              color: '#4CAF50'
            },
            {
              id: '5',
              title: 'La Orden del Fénix',
              order: 5,
              pages: 766,
              rating: 0,
              status: 'En Progreso',
              startDate: '16/04/2024',
              endDate: '',
              color: '#FF9800'
            },
            {
              id: '6',
              title: 'El Misterio del Príncipe',
              order: 6,
              pages: 607,
              rating: 0,
              status: 'Pendiente',
              startDate: '',
              endDate: '',
              color: '#6B7280'
            },
            {
              id: '7',
              title: 'Las Reliquias de la Muerte',
              order: 7,
              pages: 607,
              rating: 0,
              status: 'Pendiente',
              startDate: '',
              endDate: '',
              color: '#6B7280'
            }
          ]
        },
        {
          id: '3',
          title: 'Crónicas de Narnia',
          author: 'C.S. Lewis',
          genre: 'Fantasía',
          status: 'Completada',
          totalBooks: 7,
          booksRead: 7,
          progress: 100,
          color: '#4CAF50',
          emoji: '🦁',
          overview: 'Las aventuras de niños que descubren el mundo mágico de Narnia a través de un armario mágico.',
          startDate: '01/01/2024',
          endDate: '31/01/2024',
          totalPages: 1248,
          averageRating: 4.3,
          books: [
            {
              id: '1',
              title: 'El León, la Bruja y el Ropero',
              order: 1,
              pages: 172,
              rating: 5,
              status: 'Completado',
              startDate: '01/01/2024',
              endDate: '05/01/2024',
              color: '#4CAF50'
            },
            {
              id: '2',
              title: 'El Príncipe Caspian',
              order: 2,
              pages: 195,
              rating: 4,
              status: 'Completado',
              startDate: '06/01/2024',
              endDate: '12/01/2024',
              color: '#4CAF50'
            },
            {
              id: '3',
              title: 'La Travesía del Viajero del Alba',
              order: 3,
              pages: 195,
              rating: 4,
              status: 'Completado',
              startDate: '13/01/2024',
              endDate: '19/01/2024',
              color: '#4CAF50'
            },
            {
              id: '4',
              title: 'La Silla de Plata',
              order: 4,
              pages: 195,
              rating: 4,
              status: 'Completado',
              startDate: '20/01/2024',
              endDate: '26/01/2024',
              color: '#4CAF50'
            },
            {
              id: '5',
              title: 'El Caballo y su Jinete',
              order: 5,
              pages: 195,
              rating: 4,
              status: 'Completado',
              startDate: '27/01/2024',
              endDate: '31/01/2024',
              color: '#4CAF50'
            }
          ]
        },
        {
          id: '4',
          title: 'Dune',
          author: 'Frank Herbert',
          genre: 'Ciencia Ficción',
          status: 'En Progreso',
          totalBooks: 6,
          booksRead: 1,
          progress: 17,
          color: '#FF9800',
          emoji: '🚀',
          overview: 'Una épica de ciencia ficción ambientada en el planeta desértico Arrakis, donde se libra una guerra por el control de la especia.',
          startDate: '01/04/2024',
          endDate: '',
          totalPages: 4128,
          averageRating: 4.0,
          books: [
            {
              id: '1',
              title: 'Dune',
              order: 1,
              pages: 688,
              rating: 4,
              status: 'Completado',
              startDate: '01/04/2024',
              endDate: '20/04/2024',
              color: '#4CAF50'
            },
            {
              id: '2',
              title: 'El Mesías de Dune',
              order: 2,
              pages: 688,
              rating: 0,
              status: 'En Progreso',
              startDate: '21/04/2024',
              endDate: '',
              color: '#FF9800'
            },
            {
              id: '3',
              title: 'Hijos de Dune',
              order: 3,
              pages: 688,
              rating: 0,
              status: 'Pendiente',
              startDate: '',
              endDate: '',
              color: '#6B7280'
            },
            {
              id: '4',
              title: 'Dios Emperador de Dune',
              order: 4,
              pages: 688,
              rating: 0,
              status: 'Pendiente',
              startDate: '',
              endDate: '',
              color: '#6B7280'
            },
            {
              id: '5',
              title: 'Herejes de Dune',
              order: 5,
              pages: 688,
              rating: 0,
              status: 'Pendiente',
              startDate: '',
              endDate: '',
              color: '#6B7280'
            },
            {
              id: '6',
              title: 'Casa Capitular Dune',
              order: 6,
              pages: 688,
              rating: 0,
              status: 'Pendiente',
              startDate: '',
              endDate: '',
              color: '#6B7280'
            }
          ]
        },
        {
          id: '5',
          title: 'Fundación',
          author: 'Isaac Asimov',
          genre: 'Ciencia Ficción',
          status: 'Pendiente',
          totalBooks: 7,
          booksRead: 0,
          progress: 0,
          color: '#6B7280',
          emoji: '🌌',
          overview: 'Una serie de ciencia ficción que sigue la caída y reconstrucción de un imperio galáctico a través de la psicohistoria.',
          startDate: '',
          endDate: '',
          totalPages: 2800,
          averageRating: 0,
          books: [
            {
              id: '1',
              title: 'Fundación',
              order: 1,
              pages: 400,
              rating: 0,
              status: 'Pendiente',
              startDate: '',
              endDate: '',
              color: '#6B7280'
            },
            {
              id: '2',
              title: 'Fundación e Imperio',
              order: 2,
              pages: 400,
              rating: 0,
              status: 'Pendiente',
              startDate: '',
              endDate: '',
              color: '#6B7280'
            },
            {
              id: '3',
              title: 'Segunda Fundación',
              order: 3,
              pages: 400,
              rating: 0,
              status: 'Pendiente',
              startDate: '',
              endDate: '',
              color: '#6B7280'
            },
            {
              id: '4',
              title: 'Los Límites de la Fundación',
              order: 4,
              pages: 400,
              rating: 0,
              status: 'Pendiente',
              startDate: '',
              endDate: '',
              color: '#6B7280'
            },
            {
              id: '5',
              title: 'Fundación y Tierra',
              order: 5,
              pages: 400,
              rating: 0,
              status: 'Pendiente',
              startDate: '',
              endDate: '',
              color: '#6B7280'
            },
            {
              id: '6',
              title: 'Preludio a la Fundación',
              order: 6,
              pages: 400,
              rating: 0,
              status: 'Pendiente',
              startDate: '',
              endDate: '',
              color: '#6B7280'
            },
            {
              id: '7',
              title: 'Hacia la Fundación',
              order: 7,
              pages: 400,
              rating: 0,
              status: 'Pendiente',
              startDate: '',
              endDate: '',
              color: '#6B7280'
            }
          ]
        },
        {
          id: '6',
          title: 'Canción de Hielo y Fuego',
          author: 'George R.R. Martin',
          genre: 'Fantasía',
          status: 'En Progreso',
          totalBooks: 5,
          booksRead: 3,
          progress: 60,
          color: '#FF9800',
          emoji: '❄️',
          overview: 'Una épica de fantasía medieval donde varias familias nobles luchan por el control del Trono de Hierro.',
          startDate: '01/05/2024',
          endDate: '',
          totalPages: 4000,
          averageRating: 4.7,
          books: [
            {
              id: '1',
              title: 'Juego de Tronos',
              order: 1,
              pages: 800,
              rating: 5,
              status: 'Completado',
              startDate: '01/05/2024',
              endDate: '20/05/2024',
              color: '#4CAF50'
            },
            {
              id: '2',
              title: 'Choque de Reyes',
              order: 2,
              pages: 800,
              rating: 5,
              status: 'Completado',
              startDate: '21/05/2024',
              endDate: '10/06/2024',
              color: '#4CAF50'
            },
            {
              id: '3',
              title: 'Tormenta de Espadas',
              order: 3,
              pages: 800,
              rating: 5,
              status: 'Completado',
              startDate: '11/06/2024',
              endDate: '30/06/2024',
              color: '#4CAF50'
            },
            {
              id: '4',
              title: 'Festín de Cuervos',
              order: 4,
              pages: 800,
              rating: 0,
              status: 'En Progreso',
              startDate: '01/07/2024',
              endDate: '',
              color: '#FF9800'
            },
            {
              id: '5',
              title: 'Danza de Dragones',
              order: 5,
              pages: 800,
              rating: 0,
              status: 'Pendiente',
              startDate: '',
              endDate: '',
              color: '#6B7280'
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

    // Obtener color según el género
    const getGenreColor = (genre) => {
      const colorMap = {
        'Fantasía': '#4CAF50',
        'Ciencia Ficción': '#2196F3',
        'Misterio': '#9C27B0',
        'Romance': '#E91E63',
        'Aventura': '#FF9800',
        'Historia': '#795548'
      };
      return colorMap[genre] || '#6B7280';
    };

    // Obtener emoji según el género
    const getGenreEmoji = (genre) => {
      const emojiMap = {
        'Fantasía': '🧙',
        'Ciencia Ficción': '🚀',
        'Misterio': '🔍',
        'Romance': '💕',
        'Aventura': '⚔️',
        'Historia': '📜'
      };
      return emojiMap[genre] || '📚';
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
              <Text style={styles.seriesHeaderTitle}>Sagas de Libros</Text>
              <Text style={styles.seriesHeaderSubtitle}>
                Colecciones épicas de literatura
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
              
        {/* Selector de tipo de contenido */}
        <View style={styles.contentTypeSelector}>
          <TouchableOpacity
            style={[styles.contentTypeButton, contentType === 'book' && styles.contentTypeButtonActive]}
            onPress={() => setContentType('book')}
          >
            <Icon name="book" size={20} color={contentType === 'book' ? '#FFFFFF' : '#6B7280'} />
            <Text style={[styles.contentTypeButtonText, contentType === 'book' && styles.contentTypeButtonTextActive]}>
              Libros
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.contentTypeButton, contentType === 'audiobook' && styles.contentTypeButtonActive]}
            onPress={() => setContentType('audiobook')}
          >
            <Icon name="headset" size={20} color={contentType === 'audiobook' ? '#FFFFFF' : '#6B7280'} />
            <Text style={[styles.contentTypeButtonText, contentType === 'audiobook' && styles.contentTypeButtonTextActive]}>
              Audiolibros
            </Text>
          </TouchableOpacity>
        </View>

        {/* Panel de estadísticas */}
        <View style={styles.seriesStatsPanel}>
          <View style={styles.seriesStatsContent}>
            <Text style={styles.seriesStatsTitle}>
              {contentType === 'book' ? '📚 Mi Colección de Sagas' : '🎧 Mis Sagas de Audiolibros'}
            </Text>
            <Text style={styles.seriesStatsSubtitle}>
              {sampleSeriesData.totalSeries} sagas con {sampleSeriesData.totalBooks} {contentType === 'book' ? 'libros' : 'audiolibros'}
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
                <Icon name="book" size={20} color="#2196F3" />
              </View>
              <Text style={styles.seriesStatNumber}>{sampleSeriesData.totalBooks}</Text>
              <Text style={styles.seriesStatLabel}>Libros Totales</Text>
            </View>
            <View style={styles.seriesStatCard}>
              <View style={styles.seriesStatIcon}>
                <Icon name="checkmark-circle" size={20} color="#FF9800" />
              </View>
              <Text style={styles.seriesStatNumber}>{sampleSeriesData.completedSeries}</Text>
              <Text style={styles.seriesStatLabel}>Sagas Completadas</Text>
            </View>
            <View style={styles.seriesStatCard}>
              <View style={styles.seriesStatIcon}>
                <Icon name="star" size={20} color="#FFC107" />
              </View>
              <Text style={styles.seriesStatNumber}>{sampleSeriesData.averageRating}</Text>
              <Text style={styles.seriesStatLabel}>Calificación Promedio</Text>
            </View>
              </View>
            </View>
            
        {/* Lista de sagas */}
        <View style={styles.seriesListContainer}>
          <Text style={styles.seriesListTitle}>Mis Sagas Favoritas</Text>
          {sampleSeriesData.series.map((series) => (
            <View key={series.id} style={styles.seriesCard}>
              {/* Header de la saga */}
              <View style={styles.seriesCardHeader}>
                <View style={styles.seriesCardEmoji}>
                  <Text style={styles.seriesCardEmojiText}>{series.emoji}</Text>
                </View>
                <View style={styles.seriesCardInfo}>
                  <Text style={styles.seriesCardTitle}>{series.title}</Text>
                  <Text style={styles.seriesCardAuthor}>{series.author}</Text>
                  <View style={styles.seriesCardGenre}>
                    <Text style={styles.seriesCardGenreText}>{series.genre}</Text>
                  </View>
                </View>
                <View style={[styles.seriesCardStatus, { backgroundColor: getStatusColor(series.status) }]}>
                  <Text style={styles.seriesCardStatusText}>{series.status}</Text>
                </View>
                  </View>
                  
              {/* Información de la saga */}
              <View style={styles.seriesCardDetails}>
                <View style={styles.seriesCardDetailRow}>
                  <View style={styles.seriesCardDetailItem}>
                    <Icon name="book" size={14} color="#6B7280" />
                    <Text style={styles.seriesCardDetailLabel}>Libros:</Text>
                    <Text style={styles.seriesCardDetailValue}>{series.booksRead}/{series.totalBooks}</Text>
                  </View>
                  <View style={styles.seriesCardDetailItem}>
                    <Icon name="document-text" size={14} color="#6B7280" />
                    <Text style={styles.seriesCardDetailLabel}>Páginas:</Text>
                    <Text style={styles.seriesCardDetailValue}>{series.totalPages.toLocaleString()}</Text>
                  </View>
                </View>
                <View style={styles.seriesCardDetailRow}>
                  <View style={styles.seriesCardDetailItem}>
                    <Icon name="calendar" size={14} color="#6B7280" />
                    <Text style={styles.seriesCardDetailLabel}>Inicio:</Text>
                    <Text style={styles.seriesCardDetailValue}>{series.startDate || 'No iniciada'}</Text>
                  </View>
                  <View style={styles.seriesCardDetailItem}>
                    <Icon name="star" size={14} color="#FFC107" />
                    <Text style={styles.seriesCardDetailLabel}>Calificación:</Text>
                    <Text style={styles.seriesCardDetailValue}>
                      {series.averageRating > 0 ? `${series.averageRating}/5` : 'Sin calificar'}
                    </Text>
                  </View>
                </View>
                    </View>
                    
              {/* Barra de progreso */}
              <View style={styles.seriesCardProgress}>
                <View style={styles.seriesCardProgressBar}>
                  <View 
                    style={[
                      styles.seriesCardProgressFill,
                      { 
                        width: `${series.progress}%`,
                        backgroundColor: series.color
                      }
                    ]}
                  />
                </View>
                <Text style={styles.seriesCardProgressText}>
                  {series.progress}% completado
                </Text>
                    </View>
                    
              {/* Resumen de la saga */}
              <View style={styles.seriesCardOverview}>
                <Text style={styles.seriesCardOverviewTitle}>📖 Resumen</Text>
                <Text style={styles.seriesCardOverviewText}>{series.overview}</Text>
                    </View>
                    
              {/* Lista de libros de la saga */}
              <View style={styles.seriesCardBooks}>
                <Text style={styles.seriesCardBooksTitle}>Libros de la Saga</Text>
                {series.books.map((book) => (
                  <View key={book.id} style={styles.seriesBookItem}>
                    <View style={styles.seriesBookInfo}>
                      <Text style={styles.seriesBookOrder}>{book.order}.</Text>
                      <Text style={styles.seriesBookTitle}>{book.title}</Text>
                    </View>
                    <View style={styles.seriesBookDetails}>
                      <Text style={styles.seriesBookPages}>{book.pages} páginas</Text>
                      <View style={[styles.seriesBookStatus, { backgroundColor: book.color }]}>
                        <Text style={styles.seriesBookStatusText}>{book.status}</Text>
                    </View>
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

  const renderBookshelf = () => {
    // Datos de ejemplo para la estantería
    const sampleBookshelfData = {
      totalBooks: 24,
      readBooks: 18,
      unreadBooks: 6,
      averageRating: 4.3,
      totalPages: 15680,
      books: [
        {
          id: '1',
          title: 'El Señor de los Anillos',
          author: 'J.R.R. Tolkien',
          genre: 'Fantasía',
          status: 'Leído',
          rating: 5,
          pages: 1216,
          year: 1954,
          isbn: '978-0-547-92822-7',
          cover: '📚',
          color: '#4CAF50',
          readDate: '28/02/2024',
          purchaseDate: '15/01/2024',
          price: '$25.99',
          language: 'Español',
          format: 'Tapa dura',
          condition: 'Excelente',
          location: 'Estante A-1',
          notes: 'Una obra maestra de la fantasía épica',
          links: [
            {
              type: 'Amazon',
              url: 'https://amazon.com/el-senor-anillos',
              icon: '🛒'
            },
            {
              type: 'Goodreads',
              url: 'https://goodreads.com/book/show/33',
              icon: '📖'
            },
            {
              type: 'Wikipedia',
              url: 'https://es.wikipedia.org/wiki/El_Señor_de_los_Anillos',
              icon: '🌐'
            }
          ]
        },
        {
          id: '2',
          title: '1984',
          author: 'George Orwell',
          genre: 'Ciencia Ficción',
          status: 'Leído',
          rating: 5,
          pages: 328,
          year: 1949,
          isbn: '978-0-452-28423-4',
          cover: '📖',
          color: '#4CAF50',
          readDate: '15/03/2024',
          purchaseDate: '01/03/2024',
          price: '$18.50',
          language: 'Español',
          format: 'Tapa blanda',
          condition: 'Bueno',
          location: 'Estante B-2',
          notes: 'Distopía clásica que sigue siendo relevante',
          links: [
            {
              type: 'Amazon',
              url: 'https://amazon.com/1984-george-orwell',
              icon: '🛒'
            },
            {
              type: 'Goodreads',
              url: 'https://goodreads.com/book/show/5470',
              icon: '📖'
            },
            {
              type: 'Audible',
              url: 'https://audible.com/1984-audio',
              icon: '🎧'
            }
          ]
        },
        {
          id: '3',
          title: 'Cien Años de Soledad',
          author: 'Gabriel García Márquez',
          genre: 'Realismo Mágico',
          status: 'Leído',
          rating: 4,
          pages: 471,
          year: 1967,
          isbn: '978-0-06-088328-7',
          cover: '📚',
          color: '#4CAF50',
          readDate: '20/04/2024',
          purchaseDate: '10/04/2024',
          price: '$22.00',
          language: 'Español',
          format: 'Tapa dura',
          condition: 'Excelente',
          location: 'Estante C-1',
          notes: 'Obra maestra del realismo mágico latinoamericano',
          links: [
            {
              type: 'Amazon',
              url: 'https://amazon.com/cien-anos-soledad',
              icon: '🛒'
            },
            {
              type: 'Goodreads',
              url: 'https://goodreads.com/book/show/320',
              icon: '📖'
            },
            {
              type: 'Google Books',
              url: 'https://books.google.com/cien-anos-soledad',
              icon: '📚'
            }
          ]
        },
        {
          id: '4',
          title: 'Dune',
          author: 'Frank Herbert',
          genre: 'Ciencia Ficción',
          status: 'En Lectura',
          rating: 4,
          pages: 688,
          year: 1965,
          isbn: '978-0-441-17271-9',
          cover: '🚀',
          color: '#FF9800',
          readDate: '',
          purchaseDate: '01/05/2024',
          price: '$28.99',
          language: 'Español',
          format: 'Tapa dura',
          condition: 'Nuevo',
          location: 'Estante D-3',
          notes: 'Épica de ciencia ficción espacial',
          links: [
            {
              type: 'Amazon',
              url: 'https://amazon.com/dune-frank-herbert',
              icon: '🛒'
            },
            {
              type: 'Goodreads',
              url: 'https://goodreads.com/book/show/234225',
              icon: '📖'
            },
            {
              type: 'IMDb',
              url: 'https://imdb.com/title/tt1160419',
              icon: '🎬'
            }
          ]
        },
        {
          id: '5',
          title: 'El Quijote',
          author: 'Miguel de Cervantes',
          genre: 'Clásico',
          status: 'Pendiente',
          rating: 0,
          pages: 863,
          year: 1605,
          isbn: '978-0-14-243723-0',
          cover: '⚔️',
          color: '#6B7280',
          readDate: '',
          purchaseDate: '15/06/2024',
          price: '$19.99',
          language: 'Español',
          format: 'Tapa blanda',
          condition: 'Bueno',
          location: 'Estante E-2',
          notes: 'Obra cumbre de la literatura española',
          links: [
            {
              type: 'Amazon',
              url: 'https://amazon.com/el-quijote-cervantes',
              icon: '🛒'
            },
            {
              type: 'Goodreads',
              url: 'https://goodreads.com/book/show/3836',
              icon: '📖'
            },
            {
              type: 'Proyecto Gutenberg',
              url: 'https://gutenberg.org/ebooks/2000',
              icon: '📚'
            }
          ]
        },
        {
          id: '6',
          title: 'Harry Potter y la Piedra Filosofal',
          author: 'J.K. Rowling',
          genre: 'Fantasía',
          status: 'Leído',
          rating: 5,
          pages: 223,
          year: 1997,
          isbn: '978-0-7475-3269-9',
          cover: '⚡',
          color: '#4CAF50',
          readDate: '08/03/2024',
          purchaseDate: '01/03/2024',
          price: '$16.99',
          language: 'Español',
          format: 'Tapa blanda',
          condition: 'Excelente',
          location: 'Estante F-1',
          notes: 'El inicio de una saga mágica inolvidable',
          links: [
            {
              type: 'Amazon',
              url: 'https://amazon.com/harry-potter-piedra-filosofal',
              icon: '🛒'
            },
            {
              type: 'Goodreads',
              url: 'https://goodreads.com/book/show/3',
              icon: '📖'
            },
            {
              type: 'Pottermore',
              url: 'https://pottermore.com',
              icon: '🪄'
            }
          ]
        },
        {
          id: '7',
          title: 'Sapiens',
          author: 'Yuval Noah Harari',
          genre: 'Historia',
          status: 'Leído',
          rating: 4,
          pages: 443,
          year: 2011,
          isbn: '978-0-06-231609-7',
          cover: '🧠',
          color: '#4CAF50',
          readDate: '10/05/2024',
          purchaseDate: '01/05/2024',
          price: '$24.99',
          language: 'Español',
          format: 'Tapa dura',
          condition: 'Excelente',
          location: 'Estante G-2',
          notes: 'Una perspectiva fascinante de la humanidad',
          links: [
            {
              type: 'Amazon',
              url: 'https://amazon.com/sapiens-yuval-harari',
              icon: '🛒'
            },
            {
              type: 'Goodreads',
              url: 'https://goodreads.com/book/show/23692271',
              icon: '📖'
            },
            {
              type: 'TED',
              url: 'https://ted.com/talks/yuval_noah_harari',
              icon: '🎤'
            }
          ]
        },
        {
          id: '8',
          title: 'El Principito',
          author: 'Antoine de Saint-Exupéry',
          genre: 'Fábula',
          status: 'Leído',
          rating: 5,
          pages: 96,
          year: 1943,
          isbn: '978-0-15-601219-5',
          cover: '🌹',
          color: '#4CAF50',
          readDate: '25/06/2024',
          purchaseDate: '20/06/2024',
          price: '$12.99',
          language: 'Español',
          format: 'Tapa dura',
          condition: 'Excelente',
          location: 'Estante H-1',
          notes: 'Una fábula poética sobre la amistad y la vida',
          links: [
            {
              type: 'Amazon',
              url: 'https://amazon.com/el-principito-saint-exupery',
              icon: '🛒'
            },
            {
              type: 'Goodreads',
              url: 'https://goodreads.com/book/show/157993',
              icon: '📖'
            },
            {
              type: 'Museo',
              url: 'https://lepetitprince.com',
              icon: '🏛️'
            }
          ]
        }
      ]
    };

    // Obtener color según el estado
    const getStatusColor = (status) => {
      switch (status) {
        case 'Leído': return '#4CAF50';
        case 'En Lectura': return '#FF9800';
        case 'Pendiente': return '#6B7280';
        default: return '#6B7280';
      }
    };

    // Obtener color según el género
    const getGenreColor = (genre) => {
      const colorMap = {
        'Fantasía': '#4CAF50',
        'Ciencia Ficción': '#2196F3',
        'Realismo Mágico': '#9C27B0',
        'Clásico': '#795548',
        'Historia': '#FF5722',
        'Fábula': '#E91E63'
      };
      return colorMap[genre] || '#6B7280';
    };

    // Obtener emoji según el género
    const getGenreEmoji = (genre) => {
      const emojiMap = {
        'Fantasía': '🧙',
        'Ciencia Ficción': '🚀',
        'Realismo Mágico': '✨',
        'Clásico': '⚔️',
        'Historia': '🧠',
        'Fábula': '🌹'
      };
      return emojiMap[genre] || '📚';
    };

    // Función para abrir enlaces
    const openLink = (url) => {
      // En una aplicación real, esto abriría el enlace en el navegador
      console.log('Abriendo enlace:', url);
      // Linking.openURL(url);
    };

    return (
      <ScrollView style={styles.bookshelfContainer} showsVerticalScrollIndicator={false}>
        {/* Header mejorado */}
        <View style={styles.bookshelfHeader}>
          <View style={styles.bookshelfHeaderContent}>
            <View style={styles.bookshelfHeaderIcon}>
              <Icon name="library" size={28} color="#FFFFFF" />
        </View>
            <View style={styles.bookshelfHeaderText}>
              <Text style={styles.bookshelfHeaderTitle}>Mi Estantería</Text>
              <Text style={styles.bookshelfHeaderSubtitle}>
                Tu biblioteca personal organizada
              </Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.bookshelfAddButton}
            onPress={() => {}}
          >
            <Icon name="add" size={20} color="#FFFFFF" />
          </TouchableOpacity>
      </View>

        {/* Selector de tipo de contenido */}
        <View style={styles.contentTypeSelector}>
                <TouchableOpacity
            style={[styles.contentTypeButton, contentType === 'book' && styles.contentTypeButtonActive]}
            onPress={() => setContentType('book')}
          >
            <Icon name="book" size={20} color={contentType === 'book' ? '#FFFFFF' : '#6B7280'} />
            <Text style={[styles.contentTypeButtonText, contentType === 'book' && styles.contentTypeButtonTextActive]}>
              Libros
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.contentTypeButton, contentType === 'audiobook' && styles.contentTypeButtonActive]}
            onPress={() => setContentType('audiobook')}
          >
            <Icon name="headset" size={20} color={contentType === 'audiobook' ? '#FFFFFF' : '#6B7280'} />
            <Text style={[styles.contentTypeButtonText, contentType === 'audiobook' && styles.contentTypeButtonTextActive]}>
              Audiolibros
            </Text>
                </TouchableOpacity>
              </View>
              
        {/* Panel de estadísticas */}
        <View style={styles.bookshelfStatsPanel}>
          <View style={styles.bookshelfStatsContent}>
            <Text style={styles.bookshelfStatsTitle}>
              {contentType === 'book' ? '📚 Mi Biblioteca Personal' : '🎧 Mi Colección de Audiolibros'}
            </Text>
            <Text style={styles.bookshelfStatsSubtitle}>
              {sampleBookshelfData.totalBooks} {contentType === 'book' ? 'libros' : 'audiolibros'} en tu colección
            </Text>
                </View>
          <View style={styles.bookshelfStatsGrid}>
            <View style={styles.bookshelfStatCard}>
              <View style={styles.bookshelfStatIcon}>
                <Icon name={contentType === 'book' ? "book" : "headset"} size={20} color="#4CAF50" />
              </View>
              <Text style={styles.bookshelfStatNumber}>{sampleBookshelfData.totalBooks}</Text>
              <Text style={styles.bookshelfStatLabel}>Total {contentType === 'book' ? 'Libros' : 'Audiolibros'}</Text>
            </View>
            <View style={styles.bookshelfStatCard}>
              <View style={styles.bookshelfStatIcon}>
                <Icon name="checkmark-circle" size={20} color="#2196F3" />
              </View>
              <Text style={styles.bookshelfStatNumber}>{sampleBookshelfData.readBooks}</Text>
              <Text style={styles.bookshelfStatLabel}>{contentType === 'book' ? 'Leídos' : 'Escuchados'}</Text>
            </View>
            <View style={styles.bookshelfStatCard}>
              <View style={styles.bookshelfStatIcon}>
                <Icon name="time" size={20} color="#FF9800" />
              </View>
              <Text style={styles.bookshelfStatNumber}>{sampleBookshelfData.unreadBooks}</Text>
              <Text style={styles.bookshelfStatLabel}>{contentType === 'book' ? 'Por Leer' : 'Por Escuchar'}</Text>
            </View>
            <View style={styles.bookshelfStatCard}>
              <View style={styles.bookshelfStatIcon}>
                <Icon name="star" size={20} color="#FFC107" />
              </View>
              <Text style={styles.bookshelfStatNumber}>{sampleBookshelfData.averageRating}</Text>
              <Text style={styles.bookshelfStatLabel}>Calificación Promedio</Text>
            </View>
          </View>
        </View>

        {/* Lista de libros */}
        <View style={styles.bookshelfListContainer}>
          <Text style={styles.bookshelfListTitle}>
            {contentType === 'book' ? 'Mis Libros' : 'Mis Audiolibros'}
          </Text>
          {sampleBookshelfData.books.map((book) => (
            <View key={book.id} style={styles.bookshelfBookCard}>
              {/* Header del libro */}
              <View style={styles.bookshelfBookHeader}>
                <View style={styles.bookshelfBookCover}>
                  <Text style={styles.bookshelfBookCoverText}>{book.cover}</Text>
                </View>
                <View style={styles.bookshelfBookInfo}>
                  <Text style={styles.bookshelfBookTitle}>{book.title}</Text>
                  <Text style={styles.bookshelfBookAuthor}>{book.author}</Text>
                  <View style={styles.bookshelfBookGenre}>
                    <Text style={styles.bookshelfBookGenreText}>{book.genre}</Text>
                  </View>
                </View>
                <View style={[styles.bookshelfBookStatus, { backgroundColor: getStatusColor(book.status) }]}>
                  <Text style={styles.bookshelfBookStatusText}>{book.status}</Text>
                </View>
              </View>

              {/* Información del libro */}
              <View style={styles.bookshelfBookDetails}>
                <View style={styles.bookshelfBookDetailRow}>
                  <View style={styles.bookshelfBookDetailItem}>
                    <Icon name="calendar" size={14} color="#6B7280" />
                    <Text style={styles.bookshelfBookDetailLabel}>Año:</Text>
                    <Text style={styles.bookshelfBookDetailValue}>{book.year}</Text>
                  </View>
                  <View style={styles.bookshelfBookDetailItem}>
                    <Icon name={contentType === 'book' ? "document-text" : "time"} size={14} color="#6B7280" />
                    <Text style={styles.bookshelfBookDetailLabel}>
                      {contentType === 'book' ? 'Páginas:' : 'Duración:'}
                    </Text>
                    <Text style={styles.bookshelfBookDetailValue}>
                      {contentType === 'book' ? book.pages : book.duration || '8h 30m'}
                    </Text>
                  </View>
                </View>
                <View style={styles.bookshelfBookDetailRow}>
                  <View style={styles.bookshelfBookDetailItem}>
                    <Icon name="star" size={14} color="#FFC107" />
                    <Text style={styles.bookshelfBookDetailLabel}>Calificación:</Text>
                    <Text style={styles.bookshelfBookDetailValue}>
                      {book.rating > 0 ? `${book.rating}/5` : 'Sin calificar'}
                    </Text>
                  </View>
                  <View style={styles.bookshelfBookDetailItem}>
                    <Icon name="location" size={14} color="#6B7280" />
                    <Text style={styles.bookshelfBookDetailLabel}>Ubicación:</Text>
                    <Text style={styles.bookshelfBookDetailValue}>{book.location}</Text>
                  </View>
                </View>
                <View style={styles.bookshelfBookDetailRow}>
                  <View style={styles.bookshelfBookDetailItem}>
                    <Icon name="language" size={14} color="#6B7280" />
                    <Text style={styles.bookshelfBookDetailLabel}>Idioma:</Text>
                    <Text style={styles.bookshelfBookDetailValue}>{book.language}</Text>
                  </View>
                  <View style={styles.bookshelfBookDetailItem}>
                    <Icon name="bookmark" size={14} color="#6B7280" />
                    <Text style={styles.bookshelfBookDetailLabel}>Formato:</Text>
                    <Text style={styles.bookshelfBookDetailValue}>{book.format}</Text>
                  </View>
                </View>
              </View>

              {/* Enlaces del libro */}
              <View style={styles.bookshelfBookLinks}>
                <Text style={styles.bookshelfBookLinksTitle}>Enlaces Relacionados</Text>
                <View style={styles.bookshelfBookLinksList}>
                  {book.links.map((link, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.bookshelfBookLinkItem}
                      onPress={() => openLink(link.url)}
                    >
                      <Text style={styles.bookshelfBookLinkIcon}>{link.icon}</Text>
                      <Text style={styles.bookshelfBookLinkText}>{link.type}</Text>
                      <Icon name="open" size={14} color="#6B7280" />
                    </TouchableOpacity>
          ))}
        </View>
      </View>

              {/* Notas del libro */}
              <View style={styles.bookshelfBookNotes}>
                <Text style={styles.bookshelfBookNotesTitle}>📝 Notas</Text>
                <Text style={styles.bookshelfBookNotesText}>{book.notes}</Text>
    </View>

              {/* Botones de acción */}
              <View style={styles.bookshelfBookActions}>
                <TouchableOpacity style={styles.bookshelfBookActionButton}>
                  <Icon name="create" size={16} color="#4CAF50" />
                  <Text style={styles.bookshelfBookActionText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.bookshelfBookActionButton}>
                  <Icon name="share" size={16} color="#2196F3" />
                  <Text style={styles.bookshelfBookActionText}>Compartir</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.bookshelfBookActionButton}>
                  <Icon name="bookmark" size={16} color="#FF9800" />
                  <Text style={styles.bookshelfBookActionText}>Marcar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Botones de acción principales */}
        <View style={styles.bookshelfActions}>
          <TouchableOpacity style={styles.bookshelfActionButton}>
            <Icon name="add-circle" size={20} color="#4CAF50" />
            <Text style={styles.bookshelfActionText}>
              {contentType === 'book' ? 'Nuevo Libro' : 'Nuevo Audiolibro'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bookshelfActionButton}>
            <Icon name="search" size={20} color="#2196F3" />
            <Text style={styles.bookshelfActionText}>Buscar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bookshelfActionButton}>
            <Icon name="download" size={20} color="#FF9800" />
            <Text style={styles.bookshelfActionText}>Exportar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'reading-journal':
        return renderReadingJournal();
      case 'reading-log':
        return renderReadingLog();
      case 'favorite-quotes':
        return renderFavoriteQuotes();
      case 'book-series':
        return renderBookSeries();
      case 'bookshelf':
        return renderBookshelf();
      default:
        return renderReadingJournal();
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
  bookEntries: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bookEntry: {
    flex: 1,
    marginHorizontal: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FF6B9D',
    borderRadius: 8,
  },
  bookEntryHeader: {
    marginBottom: 12,
  },
  bookEntryTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2d4150',
  },
  bookEntryFields: {
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
  readingLogContent: {
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
  bookIcons: {
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
  booksInSeries: {
    marginTop: 16,
  },
  bookInSeries: {
    marginBottom: 12,
    padding: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 6,
  },
  bookInSeriesHeader: {
    marginBottom: 8,
  },
  bookInSeriesTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2d4150',
  },
  bookInSeriesFields: {
    flex: 1,
  },
  bookInSeriesFieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  bookInSeriesFieldLabel: {
    fontSize: 10,
    color: '#495057',
    flex: 1,
  },
  bookInSeriesFieldInput: {
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
    paddingVertical: 2,
    fontSize: 10,
    color: '#495057',
    flex: 1,
    marginLeft: 8,
  },
  bookInSeriesRatingRow: {
    alignItems: 'center',
    marginTop: 8,
  },
  bookshelfContent: {
    flex: 1,
  },
  bookshelfGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  bookshelfBook: {
    width: '48%',
    marginBottom: 16,
    alignItems: 'center',
  },
  bookIcon: {
    position: 'relative',
    marginBottom: 8,
  },
  readButton: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#ffffff',
    borderRadius: 10,
  },
  bookInfo: {
    alignItems: 'center',
    width: '100%',
  },
  bookTitleInput: {
    fontSize: 12,
    color: '#495057',
    textAlign: 'center',
    marginBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
    paddingVertical: 2,
    width: '100%',
  },
  bookAuthorInput: {
    fontSize: 10,
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
    paddingVertical: 2,
    width: '100%',
  },
  bookRating: {
    alignItems: 'center',
  },

  // Estilos para la nueva UI de Diario de Lectura
  journalContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  journalHeader: {
    backgroundColor: '#673AB7',
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
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
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  journalStatsContent: {
    marginBottom: 16,
  },
  journalStatsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  journalStatsSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  journalStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  journalStatCard: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  journalStatIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  journalStatNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  journalStatLabel: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
  },
  journalFavoriteGenre: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  journalFavoriteGenreContent: {
    alignItems: 'center',
  },
  journalFavoriteGenreTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  journalFavoriteGenreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  journalFavoriteGenreEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  journalFavoriteGenreText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  journalBooksContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  journalBooksTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  journalBookCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  journalBookHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  journalBookCover: {
    width: 60,
    height: 80,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  journalBookCoverEmoji: {
    fontSize: 32,
  },
  journalBookInfo: {
    flex: 1,
  },
  journalBookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  journalBookAuthor: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  journalBookGenre: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  journalBookGenreEmoji: {
    fontSize: 14,
    marginRight: 6,
  },
  journalBookGenreText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  journalBookStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  journalBookStatusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  journalBookDetails: {
    marginBottom: 16,
  },
  journalBookDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  journalBookDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  journalBookDetailLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 6,
    marginRight: 4,
  },
  journalBookDetailValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
  },
  journalBookProgress: {
    marginBottom: 16,
  },
  journalBookProgressBar: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    marginBottom: 8,
  },
  journalBookProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  journalBookProgressText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  journalBookQuotes: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
  },
  journalBookQuotesTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  journalBookQuoteText: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
    lineHeight: 16,
  },
  journalBookNotes: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#F0F9FF',
    borderRadius: 8,
  },
  journalBookNotesTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  journalBookNotesText: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
  },
  journalBookActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  journalBookActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  journalBookActionText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
    color: '#1F2937',
  },
  journalActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  journalActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  journalActionText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
    color: '#1F2937',
  },

  // Estilos para la nueva UI de Registro de Lectura
  readingLogContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  readingLogHeader: {
    backgroundColor: '#2196F3',
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  readingLogHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  readingLogHeaderIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  readingLogHeaderText: {
    flex: 1,
  },
  readingLogHeaderTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  readingLogHeaderSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  readingLogAddButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  readingLogStatsPanel: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  readingLogStatsContent: {
    marginBottom: 16,
  },
  readingLogStatsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  readingLogStatsSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  readingLogStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  readingLogStatCard: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  readingLogStatIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  readingLogStatNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  readingLogStatLabel: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
  },
  readingLogGoalPanel: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  readingLogGoalContent: {
    alignItems: 'center',
  },
  readingLogGoalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  readingLogGoalProgress: {
    width: '100%',
  },
  readingLogGoalProgressBar: {
    height: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
    marginBottom: 8,
  },
  readingLogGoalProgressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 6,
  },
  readingLogGoalProgressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
  },
  readingLogBooksContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  readingLogBooksTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  readingLogBookCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  readingLogBookHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  readingLogBookCover: {
    width: 60,
    height: 80,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  readingLogBookCoverEmoji: {
    fontSize: 32,
  },
  readingLogBookInfo: {
    flex: 1,
  },
  readingLogBookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  readingLogBookAuthor: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  readingLogBookGenre: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readingLogBookGenreEmoji: {
    fontSize: 14,
    marginRight: 6,
  },
  readingLogBookGenreText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  readingLogBookStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  readingLogBookStatusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  readingLogBookDetails: {
    marginBottom: 16,
  },
  readingLogBookDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  readingLogBookDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  readingLogBookDetailLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 6,
    marginRight: 4,
  },
  readingLogBookDetailValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
  },
  readingLogBookProgress: {
    marginBottom: 16,
  },
  readingLogBookProgressBar: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    marginBottom: 8,
  },
  readingLogBookProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  readingLogBookProgressText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  readingLogBookRating: {
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  readingLogBookRatingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  readingLogBookRatingStars: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readingLogBookRatingText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 8,
  },
  readingLogBookNotes: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#F0F9FF',
    borderRadius: 8,
  },
  readingLogBookNotesTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  readingLogBookNotesText: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
  },
  readingLogBookActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  readingLogBookActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  readingLogBookActionText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
    color: '#1F2937',
  },
  readingLogActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  readingLogActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  readingLogActionText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
    color: '#1F2937',
  },

  // Estilos para la nueva UI de Citas Favoritas
  quotesContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  quotesHeader: {
    backgroundColor: '#FF9800',
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
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
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quotesStatsContent: {
    marginBottom: 16,
  },
  quotesStatsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  quotesStatsSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  quotesStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quotesStatCard: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  quotesStatIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quotesStatNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  quotesStatLabel: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
  },
  quotesListContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  quotesListTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  quotesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quotesCardHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  quotesCardEmoji: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  quotesCardEmojiText: {
    fontSize: 24,
  },
  quotesCardInfo: {
    flex: 1,
  },
  quotesCardAuthor: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  quotesCardBook: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  quotesCardGenre: {
    alignSelf: 'flex-start',
  },
  quotesCardGenreText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  quotesCardCategory: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  quotesCardCategoryText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  quotesCardQuote: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  quotesCardQuoteText: {
    fontSize: 16,
    color: '#1F2937',
    fontStyle: 'italic',
    lineHeight: 24,
  },
  quotesCardDetails: {
    marginBottom: 16,
  },
  quotesCardDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  quotesCardDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
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
    color: '#1F2937',
  },
  quotesCardTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  quotesCardTag: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  quotesCardTagText: {
    fontSize: 10,
    color: '#1976D2',
    fontWeight: '600',
  },
  quotesCardActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  quotesCardActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  quotesCardActionText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
    color: '#1F2937',
  },
  quotesActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  quotesActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  quotesActionText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
    color: '#1F2937',
  },

  // Estilos para la nueva UI de Sagas de Libros
  seriesContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  seriesHeader: {
    backgroundColor: '#9C27B0',
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
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
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  seriesStatsContent: {
    marginBottom: 16,
  },
  seriesStatsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  seriesStatsSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  seriesStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  seriesStatCard: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  seriesStatIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  seriesStatNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  seriesStatLabel: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
  },
  seriesListContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  seriesListTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  seriesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  seriesCardHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  seriesCardEmoji: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  seriesCardEmojiText: {
    fontSize: 24,
  },
  seriesCardInfo: {
    flex: 1,
  },
  seriesCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  seriesCardAuthor: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  seriesCardGenre: {
    alignSelf: 'flex-start',
  },
  seriesCardGenreText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  seriesCardStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  seriesCardStatusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  seriesCardDetails: {
    marginBottom: 16,
  },
  seriesCardDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  seriesCardDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  seriesCardDetailLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 6,
    marginRight: 4,
  },
  seriesCardDetailValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
  },
  seriesCardProgress: {
    marginBottom: 16,
  },
  seriesCardProgressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 8,
  },
  seriesCardProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  seriesCardProgressText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  seriesCardOverview: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#9C27B0',
  },
  seriesCardOverviewTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  seriesCardOverviewText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  seriesCardBooks: {
    marginBottom: 16,
  },
  seriesCardBooksTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  seriesBookItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    marginBottom: 8,
  },
  seriesBookInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  seriesBookOrder: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#6B7280',
    marginRight: 8,
    minWidth: 20,
  },
  seriesBookTitle: {
    fontSize: 14,
    color: '#1F2937',
    flex: 1,
  },
  seriesBookDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seriesBookPages: {
    fontSize: 12,
    color: '#6B7280',
    marginRight: 12,
  },
  seriesBookStatus: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  seriesBookStatusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  seriesCardActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  seriesCardActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  seriesCardActionText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
    color: '#1F2937',
  },
  seriesActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  seriesActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  seriesActionText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
    color: '#1F2937',
  },

  // Estilos para la nueva UI de Estantería
  bookshelfContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  bookshelfHeader: {
    backgroundColor: '#FF5722',
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bookshelfHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  bookshelfHeaderIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  bookshelfHeaderText: {
    flex: 1,
  },
  bookshelfHeaderTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  bookshelfHeaderSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  bookshelfAddButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookshelfStatsPanel: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bookshelfStatsContent: {
    marginBottom: 16,
  },
  bookshelfStatsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  bookshelfStatsSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  bookshelfStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bookshelfStatCard: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  bookshelfStatIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  bookshelfStatNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  bookshelfStatLabel: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
  },
  bookshelfListContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  bookshelfListTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  bookshelfBookCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bookshelfBookHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  bookshelfBookCover: {
    width: 60,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  bookshelfBookCoverText: {
    fontSize: 32,
  },
  bookshelfBookInfo: {
    flex: 1,
  },
  bookshelfBookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  bookshelfBookAuthor: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  bookshelfBookGenre: {
    alignSelf: 'flex-start',
  },
  bookshelfBookGenreText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  bookshelfBookStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  bookshelfBookStatusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  bookshelfBookDetails: {
    marginBottom: 16,
  },
  bookshelfBookDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  bookshelfBookDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  bookshelfBookDetailLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 6,
    marginRight: 4,
  },
  bookshelfBookDetailValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
  },
  bookshelfBookLinks: {
    marginBottom: 16,
  },
  bookshelfBookLinksTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  bookshelfBookLinksList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  bookshelfBookLinkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  bookshelfBookLinkIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  bookshelfBookLinkText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
    marginRight: 4,
  },
  bookshelfBookNotes: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FF5722',
  },
  bookshelfBookNotesTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  bookshelfBookNotesText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  bookshelfBookActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  bookshelfBookActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  bookshelfBookActionText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
    color: '#1F2937',
  },
  bookshelfActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  bookshelfActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  bookshelfActionText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
    color: '#1F2937',
  },

  // Estilos para el selector de tipo de contenido
  contentTypeSelector: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contentTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  contentTypeButtonActive: {
    backgroundColor: '#4CAF50',
  },
  contentTypeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
    color: '#6B7280',
  },
  contentTypeButtonTextActive: {
    color: '#FFFFFF',
  },
});

export default ReadingSections;
