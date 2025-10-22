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
    { id: 'reading-journal', name: 'Reading Journal', icon: 'book-outline' },
    { id: 'reading-log', name: 'Reading Log', icon: 'list-outline' },
    { id: 'favorite-quotes', name: 'Favorite Quotes', icon: 'quote-outline' },
    { id: 'book-series', name: 'Book Series', icon: 'library-outline' },
    { id: 'bookshelf', name: 'Bookshelf', icon: 'library-outline' }
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

  const renderReadingJournal = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>READING JOURNAL</Text>
        <View style={styles.crownIcon}>
          <Icon name="star" size={20} color="#FF6B9D" />
        </View>
      </View>

      <View style={styles.journalContent}>
        <View style={styles.journalHeader}>
          <Text style={styles.journalSubtitle}>This Reading Journal</Text>
          <Text style={styles.belongsToText}>belongs to:</Text>
          <TextInput
            style={styles.ownerInput}
            value={readingJournal.owner}
            onChangeText={(text) => setReadingJournal({...readingJournal, owner: text})}
            placeholder="Tu nombre"
            placeholderTextColor="#adb5bd"
          />
        </View>

        <View style={styles.bookEntries}>
          {[1, 2].map((entryIndex) => (
            <View key={entryIndex} style={styles.bookEntry}>
              <View style={styles.bookEntryHeader}>
                <Text style={styles.bookEntryTitle}>Book {entryIndex}</Text>
              </View>
              
              <View style={styles.bookEntryFields}>
                <View style={styles.fieldRow}>
                  <Text style={styles.fieldLabel}>Start date:</Text>
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
                  <Text style={styles.fieldLabel}>Pages:</Text>
                  <TextInput
                    style={styles.fieldInput}
                    placeholder="Número de páginas"
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

  const renderReadingLog = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>READING LOG</Text>
        <View style={styles.crownIcon}>
          <Icon name="star" size={20} color="#FF6B9D" />
        </View>
      </View>

      <View style={styles.readingLogContent}>
        <View style={styles.logHeader}>
          <Text style={styles.logTitle}>Reading Log</Text>
          <View style={styles.bookIcons}>
            <Icon name="book" size={16} color="#FF6B9D" />
            <Icon name="book" size={16} color="#FF6B9D" />
          </View>
        </View>

        <View style={styles.logTable}>
          <View style={styles.tableHeader}>
            <Text style={styles.headerCell}>Book Title</Text>
            <Text style={styles.headerCell}>Author</Text>
            <Text style={styles.headerCell}>Date</Text>
            <Text style={styles.headerCell}>Page</Text>
            <Text style={styles.headerCell}>Rating</Text>
          </View>
          
          {readingLog.books.map((book) => (
            <View key={book.id} style={styles.tableRow}>
              <TextInput
                style={styles.tableCell}
                value={book.title}
                onChangeText={(text) => updateBookField(book.id, 'title', text)}
                placeholder="Título"
                placeholderTextColor="#adb5bd"
              />
              <TextInput
                style={styles.tableCell}
                value={book.author}
                onChangeText={(text) => updateBookField(book.id, 'author', text)}
                placeholder="Autor"
                placeholderTextColor="#adb5bd"
              />
              <TextInput
                style={styles.tableCell}
                value={book.date}
                onChangeText={(text) => updateBookField(book.id, 'date', text)}
                placeholder="Fecha"
                placeholderTextColor="#adb5bd"
              />
              <TextInput
                style={styles.tableCell}
                value={book.page}
                onChangeText={(text) => updateBookField(book.id, 'page', text)}
                placeholder="Página"
                placeholderTextColor="#adb5bd"
                keyboardType="numeric"
              />
              <View style={styles.ratingCell}>
                {renderStars(book.rating, (rating) => updateBookRating(book.id, rating), 12)}
              </View>
            </View>
          ))}
        </View>

        <View style={styles.notesSection}>
          <Text style={styles.notesTitle}>Notes</Text>
          <TextInput
            style={styles.notesInput}
            value={readingLog.notes}
            onChangeText={(text) => setReadingLog({...readingLog, notes: text})}
            placeholder="Notas sobre tus lecturas..."
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
                placeholder="Escribe tu cita favorita aquí..."
                placeholderTextColor="#adb5bd"
                multiline
                numberOfLines={3}
              />
              
              <View style={styles.quoteFields}>
                <View style={styles.quoteFieldRow}>
                  <Text style={styles.quoteFieldLabel}>Author:</Text>
                  <TextInput
                    style={styles.quoteFieldInput}
                    value={quote.author}
                    onChangeText={(text) => updateQuoteField(quote.id, 'author', text)}
                    placeholder="Autor"
                    placeholderTextColor="#adb5bd"
                  />
                </View>
                
                <View style={styles.quoteFieldRow}>
                  <Text style={styles.quoteFieldLabel}>Genre:</Text>
                  <TextInput
                    style={styles.quoteFieldInput}
                    value={quote.genre}
                    onChangeText={(text) => updateQuoteField(quote.id, 'genre', text)}
                    placeholder="Género"
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

  const renderBookSeries = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>BOOK SERIES</Text>
        <View style={styles.crownIcon}>
          <Icon name="star" size={20} color="#FF6B9D" />
        </View>
      </View>

      <View style={styles.seriesContent}>
        {bookSeries.map((series) => (
          <View key={series.id} style={styles.seriesCard}>
            <View style={styles.seriesHeader}>
              <Text style={styles.seriesTitle}>Book Series</Text>
            </View>
            
            <View style={styles.seriesFields}>
              <View style={styles.seriesFieldRow}>
                <Text style={styles.seriesFieldLabel}>Author:</Text>
                <TextInput
                  style={styles.seriesFieldInput}
                  value={series.author}
                  onChangeText={(text) => updateSeriesField(series.id, 'author', text)}
                  placeholder="Autor de la serie"
                  placeholderTextColor="#adb5bd"
                />
              </View>
              
              <View style={styles.seriesFieldRow}>
                <Text style={styles.seriesFieldLabel}>Series:</Text>
                <TextInput
                  style={styles.seriesFieldInput}
                  value={series.series}
                  onChangeText={(text) => updateSeriesField(series.id, 'series', text)}
                  placeholder="Nombre de la serie"
                  placeholderTextColor="#adb5bd"
                />
              </View>
              
              <View style={styles.overviewSection}>
                <Text style={styles.seriesFieldLabel}>Overview:</Text>
                <TextInput
                  style={styles.overviewInput}
                  value={series.overview}
                  onChangeText={(text) => updateSeriesField(series.id, 'overview', text)}
                  placeholder="Resumen de la serie..."
                  placeholderTextColor="#adb5bd"
                  multiline
                  numberOfLines={3}
                />
              </View>
            </View>
            
            <View style={styles.booksInSeries}>
              {series.books.map((book, bookIndex) => (
                <View key={bookIndex} style={styles.bookInSeries}>
                  <View style={styles.bookInSeriesHeader}>
                    <Text style={styles.bookInSeriesTitle}>Book {bookIndex + 1}</Text>
                  </View>
                  
                  <View style={styles.bookInSeriesFields}>
                    <View style={styles.bookInSeriesFieldRow}>
                      <Text style={styles.bookInSeriesFieldLabel}>Start date:</Text>
                      <TextInput
                        style={styles.bookInSeriesFieldInput}
                        value={book.startDate}
                        onChangeText={(text) => updateSeriesBookField(series.id, bookIndex, 'startDate', text)}
                        placeholder="DD/MM/YYYY"
                        placeholderTextColor="#adb5bd"
                      />
                    </View>
                    
                    <View style={styles.bookInSeriesFieldRow}>
                      <Text style={styles.bookInSeriesFieldLabel}>Finish date:</Text>
                      <TextInput
                        style={styles.bookInSeriesFieldInput}
                        value={book.finishDate}
                        onChangeText={(text) => updateSeriesBookField(series.id, bookIndex, 'finishDate', text)}
                        placeholder="DD/MM/YYYY"
                        placeholderTextColor="#adb5bd"
                      />
                    </View>
                    
                    <View style={styles.bookInSeriesFieldRow}>
                      <Text style={styles.bookInSeriesFieldLabel}>Pages:</Text>
                      <TextInput
                        style={styles.bookInSeriesFieldInput}
                        value={book.pages}
                        onChangeText={(text) => updateSeriesBookField(series.id, bookIndex, 'pages', text)}
                        placeholder="Páginas"
                        placeholderTextColor="#adb5bd"
                        keyboardType="numeric"
                      />
                    </View>
                    
                    <View style={styles.bookInSeriesRatingRow}>
                      {renderStars(book.rating, (rating) => updateSeriesBookRating(series.id, bookIndex, rating), 12)}
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

  const renderBookshelf = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>BOOKSHELF</Text>
        <View style={styles.crownIcon}>
          <Icon name="star" size={20} color="#FF6B9D" />
        </View>
      </View>

      <View style={styles.bookshelfContent}>
        <View style={styles.bookshelfGrid}>
          {bookshelf.books.map((book, index) => (
            <View key={index} style={styles.bookshelfBook}>
              <View style={styles.bookIcon}>
                <Icon name="book" size={32} color="#6c757d" />
                <TouchableOpacity
                  style={styles.readButton}
                  onPress={() => toggleBookshelfRead(index)}
                >
                  <Icon
                    name={book.read ? 'checkmark-circle' : 'checkmark-circle-outline'}
                    size={16}
                    color={book.read ? '#4CAF50' : '#6c757d'}
                  />
                </TouchableOpacity>
              </View>
              
              <View style={styles.bookInfo}>
                <TextInput
                  style={styles.bookTitleInput}
                  value={book.title}
                  onChangeText={(text) => updateBookshelfBook(index, 'title', text)}
                  placeholder="Título del libro"
                  placeholderTextColor="#adb5bd"
                />
                <TextInput
                  style={styles.bookAuthorInput}
                  value={book.author}
                  onChangeText={(text) => updateBookshelfBook(index, 'author', text)}
                  placeholder="Autor"
                  placeholderTextColor="#adb5bd"
                />
                <View style={styles.bookRating}>
                  {renderStars(book.rating, (rating) => updateBookshelfRating(index, rating), 12)}
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
});

export default ReadingSections;
