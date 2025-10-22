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
    { id: 'movies-journal', name: 'Movies Journal', icon: 'film-outline' },
    { id: 'movies-log', name: 'Movies Log', icon: 'list-outline' },
    { id: 'favorite-quotes', name: 'Favorite Quotes', icon: 'quote-outline' },
    { id: 'movie-series', name: 'Movie Series', icon: 'library-outline' },
    { id: 'movieshelf', name: 'Movieshelf', icon: 'library-outline' }
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

  const renderMoviesJournal = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>MOVIES JOURNAL</Text>
        <View style={styles.crownIcon}>
          <Icon name="star" size={20} color="#FF6B9D" />
        </View>
      </View>

      <View style={styles.journalContent}>
        <View style={styles.journalHeader}>
          <Text style={styles.journalSubtitle}>This Movies Journal</Text>
          <Text style={styles.belongsToText}>belongs to:</Text>
          <TextInput
            style={styles.ownerInput}
            value={moviesJournal.owner}
            onChangeText={(text) => setMoviesJournal({...moviesJournal, owner: text})}
            placeholder="Tu nombre"
            placeholderTextColor="#adb5bd"
          />
        </View>

        <View style={styles.movieEntries}>
          {[1, 2].map((entryIndex) => (
            <View key={entryIndex} style={styles.movieEntry}>
              <View style={styles.movieEntryHeader}>
                <Text style={styles.movieEntryTitle}>Movie {entryIndex}</Text>
              </View>
              
              <View style={styles.movieEntryFields}>
                <View style={styles.fieldRow}>
                  <Text style={styles.fieldLabel}>Watch date:</Text>
                  <TextInput
                    style={styles.fieldInput}
                    placeholder="DD/MM/YYYY"
                    placeholderTextColor="#adb5bd"
                  />
                </View>
                
                <View style={styles.fieldRow}>
                  <Text style={styles.fieldLabel}>Finish date:</Text>
                  <TextInput
                    style={styles.fieldInput}
                    placeholder="DD/MM/YYYY"
                    placeholderTextColor="#adb5bd"
                  />
                </View>
                
                <View style={styles.fieldRow}>
                  <Text style={styles.fieldLabel}>Duration:</Text>
                  <TextInput
                    style={styles.fieldInput}
                    placeholder="Duración en minutos"
                    placeholderTextColor="#adb5bd"
                    keyboardType="numeric"
                  />
                </View>
                
                <View style={styles.ratingRow}>
                  <Text style={styles.fieldLabel}>Rating:</Text>
                  {renderStars(0, () => {}, 14)}
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  const renderMoviesLog = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>MOVIES LOG</Text>
        <View style={styles.crownIcon}>
          <Icon name="star" size={20} color="#FF6B9D" />
        </View>
      </View>

      <View style={styles.moviesLogContent}>
        <View style={styles.logHeader}>
          <Text style={styles.logTitle}>Movies Log</Text>
          <View style={styles.movieIcons}>
            <Icon name="film" size={16} color="#FF6B9D" />
            <Icon name="film" size={16} color="#FF6B9D" />
          </View>
        </View>

        <View style={styles.logTable}>
          <View style={styles.tableHeader}>
            <Text style={styles.headerCell}>Movie Title</Text>
            <Text style={styles.headerCell}>Director</Text>
            <Text style={styles.headerCell}>Date</Text>
            <Text style={styles.headerCell}>Duration</Text>
            <Text style={styles.headerCell}>Rating</Text>
          </View>
          
          {moviesLog.movies.map((movie) => (
            <View key={movie.id} style={styles.tableRow}>
              <TextInput
                style={styles.tableCell}
                value={movie.title}
                onChangeText={(text) => updateMovieField(movie.id, 'title', text)}
                placeholder="Título"
                placeholderTextColor="#adb5bd"
              />
              <TextInput
                style={styles.tableCell}
                value={movie.director}
                onChangeText={(text) => updateMovieField(movie.id, 'director', text)}
                placeholder="Director"
                placeholderTextColor="#adb5bd"
              />
              <TextInput
                style={styles.tableCell}
                value={movie.date}
                onChangeText={(text) => updateMovieField(movie.id, 'date', text)}
                placeholder="Fecha"
                placeholderTextColor="#adb5bd"
              />
              <TextInput
                style={styles.tableCell}
                value={movie.duration}
                onChangeText={(text) => updateMovieField(movie.id, 'duration', text)}
                placeholder="Duración"
                placeholderTextColor="#adb5bd"
                keyboardType="numeric"
              />
              <View style={styles.ratingCell}>
                {renderStars(movie.rating, (rating) => updateMovieRating(movie.id, rating), 12)}
              </View>
            </View>
          ))}
        </View>

        <View style={styles.notesSection}>
          <Text style={styles.notesTitle}>Notes</Text>
          <TextInput
            style={styles.notesInput}
            value={moviesLog.notes}
            onChangeText={(text) => setMoviesLog({...moviesLog, notes: text})}
            placeholder="Notas sobre tus películas..."
            placeholderTextColor="#adb5bd"
            multiline
            numberOfLines={4}
          />
        </View>
      </View>
    </View>
  );

  const renderFavoriteQuotes = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>FAVORITE QUOTES</Text>
        <View style={styles.crownIcon}>
          <Icon name="star" size={20} color="#FF6B9D" />
        </View>
      </View>

      <View style={styles.quotesContent}>
        <View style={styles.quotesGrid}>
          {favoriteQuotes.map((quote) => (
            <View key={quote.id} style={styles.quoteCard}>
              <TextInput
                style={styles.quoteText}
                value={quote.quote}
                onChangeText={(text) => updateQuoteField(quote.id, 'quote', text)}
                placeholder="Escribe tu cita favorita de película aquí..."
                placeholderTextColor="#adb5bd"
                multiline
                numberOfLines={3}
              />
              
              <View style={styles.quoteFields}>
                <View style={styles.quoteFieldRow}>
                  <Text style={styles.quoteFieldLabel}>Movie:</Text>
                  <TextInput
                    style={styles.quoteFieldInput}
                    value={quote.movie}
                    onChangeText={(text) => updateQuoteField(quote.id, 'movie', text)}
                    placeholder="Película"
                    placeholderTextColor="#adb5bd"
                  />
                </View>
                
                <View style={styles.quoteFieldRow}>
                  <Text style={styles.quoteFieldLabel}>Character:</Text>
                  <TextInput
                    style={styles.quoteFieldInput}
                    value={quote.character}
                    onChangeText={(text) => updateQuoteField(quote.id, 'character', text)}
                    placeholder="Personaje"
                    placeholderTextColor="#adb5bd"
                  />
                </View>
                
                <View style={styles.quoteFieldRow}>
                  <Text style={styles.quoteFieldLabel}>Date:</Text>
                  <TextInput
                    style={styles.quoteFieldInput}
                    value={quote.date}
                    onChangeText={(text) => updateQuoteField(quote.id, 'date', text)}
                    placeholder="Fecha"
                    placeholderTextColor="#adb5bd"
                  />
                </View>
                
                <View style={styles.quoteRatingRow}>
                  {renderStars(quote.rating, (rating) => updateQuoteRating(quote.id, rating), 12)}
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  const renderMovieSeries = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>MOVIE SERIES</Text>
        <View style={styles.crownIcon}>
          <Icon name="star" size={20} color="#FF6B9D" />
        </View>
      </View>

      <View style={styles.seriesContent}>
        {movieSeries.map((series) => (
          <View key={series.id} style={styles.seriesCard}>
            <View style={styles.seriesHeader}>
              <Text style={styles.seriesTitle}>Movie Series</Text>
            </View>
            
            <View style={styles.seriesFields}>
              <View style={styles.seriesFieldRow}>
                <Text style={styles.seriesFieldLabel}>Director:</Text>
                <TextInput
                  style={styles.seriesFieldInput}
                  value={series.director}
                  onChangeText={(text) => updateSeriesField(series.id, 'director', text)}
                  placeholder="Director de la saga"
                  placeholderTextColor="#adb5bd"
                />
              </View>
              
              <View style={styles.seriesFieldRow}>
                <Text style={styles.seriesFieldLabel}>Series:</Text>
                <TextInput
                  style={styles.seriesFieldInput}
                  value={series.series}
                  onChangeText={(text) => updateSeriesField(series.id, 'series', text)}
                  placeholder="Nombre de la saga"
                  placeholderTextColor="#adb5bd"
                />
              </View>
              
              <View style={styles.overviewSection}>
                <Text style={styles.seriesFieldLabel}>Overview:</Text>
                <TextInput
                  style={styles.overviewInput}
                  value={series.overview}
                  onChangeText={(text) => updateSeriesField(series.id, 'overview', text)}
                  placeholder="Resumen de la saga..."
                  placeholderTextColor="#adb5bd"
                  multiline
                  numberOfLines={3}
                />
              </View>
            </View>
            
            <View style={styles.moviesInSeries}>
              {series.movies.map((movie, movieIndex) => (
                <View key={movieIndex} style={styles.movieInSeries}>
                  <View style={styles.movieInSeriesHeader}>
                    <Text style={styles.movieInSeriesTitle}>Movie {movieIndex + 1}</Text>
                  </View>
                  
                  <View style={styles.movieInSeriesFields}>
                    <View style={styles.movieInSeriesFieldRow}>
                      <Text style={styles.movieInSeriesFieldLabel}>Watch date:</Text>
                      <TextInput
                        style={styles.movieInSeriesFieldInput}
                        value={movie.watchDate}
                        onChangeText={(text) => updateSeriesMovieField(series.id, movieIndex, 'watchDate', text)}
                        placeholder="DD/MM/YYYY"
                        placeholderTextColor="#adb5bd"
                      />
                    </View>
                    
                    <View style={styles.movieInSeriesFieldRow}>
                      <Text style={styles.movieInSeriesFieldLabel}>Duration:</Text>
                      <TextInput
                        style={styles.movieInSeriesFieldInput}
                        value={movie.duration}
                        onChangeText={(text) => updateSeriesMovieField(series.id, movieIndex, 'duration', text)}
                        placeholder="Minutos"
                        placeholderTextColor="#adb5bd"
                        keyboardType="numeric"
                      />
                    </View>
                    
                    <View style={styles.movieInSeriesRatingRow}>
                      {renderStars(movie.rating, (rating) => updateSeriesMovieRating(series.id, movieIndex, rating), 12)}
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderMovieshelf = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>MOVIESHELF</Text>
        <View style={styles.crownIcon}>
          <Icon name="star" size={20} color="#FF6B9D" />
        </View>
      </View>

      <View style={styles.movieshelfContent}>
        <View style={styles.movieshelfGrid}>
          {movieshelf.movies.map((movie, index) => (
            <View key={index} style={styles.movieshelfMovie}>
              <View style={styles.movieIcon}>
                <Icon name="film" size={32} color="#6c757d" />
                <TouchableOpacity
                  style={styles.watchedButton}
                  onPress={() => toggleMovieshelfWatched(index)}
                >
                  <Icon
                    name={movie.watched ? 'checkmark-circle' : 'checkmark-circle-outline'}
                    size={16}
                    color={movie.watched ? '#4CAF50' : '#6c757d'}
                  />
                </TouchableOpacity>
              </View>
              
              <View style={styles.movieInfo}>
                <TextInput
                  style={styles.movieTitleInput}
                  value={movie.title}
                  onChangeText={(text) => updateMovieshelfMovie(index, 'title', text)}
                  placeholder="Título de la película"
                  placeholderTextColor="#adb5bd"
                />
                <TextInput
                  style={styles.movieDirectorInput}
                  value={movie.director}
                  onChangeText={(text) => updateMovieshelfMovie(index, 'director', text)}
                  placeholder="Director"
                  placeholderTextColor="#adb5bd"
                />
                <View style={styles.movieRating}>
                  {renderStars(movie.rating, (rating) => updateMovieshelfRating(index, rating), 12)}
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

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
});

export default MoviesSections;
