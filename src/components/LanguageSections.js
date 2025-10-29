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

const LanguageSections = () => {
  const [activeSection, setActiveSection] = useState('vocabulary');
  const [vocabularyLists, setVocabularyLists] = useState([]);
  const [showAddVocabularyModal, setShowAddVocabularyModal] = useState(false);
  const [newVocabulary, setNewVocabulary] = useState({
    word: '',
    phonetics: '',
    meaning: '',
    example: ''
  });
  const [practiceGrids, setPracticeGrids] = useState([]);
  const [showAddPracticeModal, setShowAddPracticeModal] = useState(false);
  const [newPractice, setNewPractice] = useState({
    date: new Date().toISOString().split('T')[0],
    content: ''
  });

  // Estados para práctica de escritura
  const [selectedWritingSystem, setSelectedWritingSystem] = useState('hiragana');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showCanvas, setShowCanvas] = useState(false);
  const [practiceHistory, setPracticeHistory] = useState([]);

  // Estados para vocabulario
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [studyMode, setStudyMode] = useState(false);

  // Estados para notas de gramática
  const [selectedGrammarLanguage, setSelectedGrammarLanguage] = useState('english');
  const [selectedGrammarCategory, setSelectedGrammarCategory] = useState('all');
  const [grammarSearchQuery, setGrammarSearchQuery] = useState('');
  const [showAddGrammarModal, setShowAddGrammarModal] = useState(false);
  const [newGrammarNote, setNewGrammarNote] = useState({
    title: '',
    category: '',
    content: '',
    examples: '',
    difficulty: 'Básico'
  });

  // Estados para pronunciación
  const [selectedPronunciationLanguage, setSelectedPronunciationLanguage] = useState('english');
  const [selectedPronunciationCategory, setSelectedPronunciationCategory] = useState('all');
  const [pronunciationSearchQuery, setPronunciationSearchQuery] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showAddPronunciationModal, setShowAddPronunciationModal] = useState(false);
  const [newPronunciationExercise, setNewPronunciationExercise] = useState({
    word: '',
    phonetic: '',
    category: '',
    difficulty: 'Básico',
    audioUrl: ''
  });

  // Estados para conversación
  const [selectedConversationLanguage, setSelectedConversationLanguage] = useState('english');
  const [selectedConversationCategory, setSelectedConversationCategory] = useState('all');
  const [conversationSearchQuery, setConversationSearchQuery] = useState('');
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [showAddConversationModal, setShowAddConversationModal] = useState(false);
  const [newConversation, setNewConversation] = useState({
    title: '',
    category: '',
    difficulty: 'Básico',
    participants: 2,
    description: '',
    phrases: []
  });

  const sections = [
    { id: 'vocabulary', name: 'Vocabulario', icon: 'book-outline' },
    { id: 'writing-practice', name: 'Práctica de Escritura', icon: 'create-outline' },
    { id: 'grammar-notes', name: 'Notas de Gramática', icon: 'document-text-outline' },
    { id: 'pronunciation', name: 'Pronunciación', icon: 'mic-outline' },
    { id: 'conversation', name: 'Conversación', icon: 'chatbubbles-outline' }
  ];

  const openAddVocabularyModal = () => {
    setNewVocabulary({
      word: '',
      phonetics: '',
      meaning: '',
      example: ''
    });
    setShowAddVocabularyModal(true);
  };

  const closeAddVocabularyModal = () => {
    setShowAddVocabularyModal(false);
  };

  const saveVocabulary = () => {
    if (!newVocabulary.word.trim() || !newVocabulary.meaning.trim()) {
      Alert.alert('Error', 'Por favor completa al menos la palabra y su significado');
      return;
    }

    const vocabulary = {
      id: Date.now().toString(),
      ...newVocabulary,
      createdAt: new Date().toISOString()
    };

    setVocabularyLists([...vocabularyLists, vocabulary]);
    setShowAddVocabularyModal(false);
  };

  const openAddPracticeModal = () => {
    setNewPractice({
      date: new Date().toISOString().split('T')[0],
      content: ''
    });
    setShowAddPracticeModal(true);
  };

  const closeAddPracticeModal = () => {
    setShowAddPracticeModal(false);
  };

  const savePractice = () => {
    if (!newPractice.content.trim()) {
      Alert.alert('Error', 'Por favor agrega contenido para la práctica');
      return;
    }

    const practice = {
      id: Date.now().toString(),
      ...newPractice,
      createdAt: new Date().toISOString()
    };

    setPracticeGrids([...practiceGrids, practice]);
    setShowAddPracticeModal(false);
  };

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

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'vocabulary':
        return renderVocabulary();
      case 'writing-practice':
        return renderWritingPractice();
      case 'grammar-notes':
        return renderGrammarNotes();
      case 'pronunciation':
        return renderPronunciation();
      case 'conversation':
        return renderConversation();
      default:
        return renderVocabulary();
    }
  };

  const renderVocabulary = () => {

    // Idiomas disponibles
    const languages = [
      { id: 'english', name: 'Inglés', flag: '🇺🇸', color: '#2196F3' },
      { id: 'spanish', name: 'Español', flag: '🇪🇸', color: '#E91E63' },
      { id: 'french', name: 'Francés', flag: '🇫🇷', color: '#4CAF50' },
      { id: 'german', name: 'Alemán', flag: '🇩🇪', color: '#FF9800' },
      { id: 'japanese', name: 'Japonés', flag: '🇯🇵', color: '#9C27B0' },
      { id: 'korean', name: 'Coreano', flag: '🇰🇷', color: '#F44336' },
      { id: 'chinese', name: 'Chino', flag: '🇨🇳', color: '#795548' }
    ];

    // Datos de vocabulario por idioma
    const vocabularyData = {
      english: [
        {
          id: 1,
          word: 'Hello',
          phonetics: '/həˈloʊ/',
          meaning: 'Hola',
          translation: 'Saludo común',
          example: 'Hello, how are you?',
          category: 'Saludos',
          level: 'Básico',
          mastered: true,
          studyCount: 15,
          lastStudied: '2024-01-14',
          difficulty: 'Fácil',
          tags: ['básico', 'saludo', 'diario']
        },
        {
          id: 2,
          word: 'Beautiful',
          phonetics: '/ˈbjuːtɪfəl/',
          meaning: 'Hermoso/a',
          translation: 'Que tiene belleza',
          example: 'The sunset is beautiful tonight',
          category: 'Adjetivos',
          level: 'Intermedio',
          mastered: false,
          studyCount: 8,
          lastStudied: '2024-01-13',
          difficulty: 'Medio',
          tags: ['adjetivo', 'apariencia', 'positivo']
        },
        {
          id: 3,
          word: 'Serendipity',
          phonetics: '/ˌserənˈdɪpəti/',
          meaning: 'Serendipidad',
          translation: 'Hallazgo afortunado',
          example: 'Meeting you was pure serendipity',
          category: 'Sustantivos',
          level: 'Avanzado',
          mastered: false,
          studyCount: 3,
          lastStudied: '2024-01-10',
          difficulty: 'Difícil',
          tags: ['sustantivo', 'filosofía', 'avanzado']
        }
      ],
      spanish: [
        {
          id: 1,
          word: 'Hola',
          phonetics: '/ˈola/',
          meaning: 'Hello',
          translation: 'Saludo informal',
          example: 'Hola, ¿cómo estás?',
          category: 'Saludos',
          level: 'Básico',
          mastered: true,
          studyCount: 20,
          lastStudied: '2024-01-14',
          difficulty: 'Fácil',
          tags: ['básico', 'saludo', 'diario']
        },
        {
          id: 2,
          word: 'Hermoso',
          phonetics: '/erˈmoso/',
          meaning: 'Beautiful',
          translation: 'Que tiene belleza',
          example: 'El atardecer es hermoso esta noche',
          category: 'Adjetivos',
          level: 'Intermedio',
          mastered: false,
          studyCount: 10,
          lastStudied: '2024-01-13',
          difficulty: 'Medio',
          tags: ['adjetivo', 'apariencia', 'positivo']
        }
      ],
      french: [
        {
          id: 1,
          word: 'Bonjour',
          phonetics: '/bɔ̃ˈʒuʁ/',
          meaning: 'Buenos días',
          translation: 'Saludo formal',
          example: 'Bonjour, comment allez-vous?',
          category: 'Saludos',
          level: 'Básico',
          mastered: true,
          studyCount: 18,
          lastStudied: '2024-01-14',
          difficulty: 'Fácil',
          tags: ['básico', 'saludo', 'formal']
        },
        {
          id: 2,
          word: 'Magnifique',
          phonetics: '/maɲiˈfik/',
          meaning: 'Magnífico',
          translation: 'Extraordinariamente hermoso',
          example: 'Le coucher de soleil est magnifique',
          category: 'Adjetivos',
          level: 'Intermedio',
          mastered: false,
          studyCount: 6,
          lastStudied: '2024-01-12',
          difficulty: 'Medio',
          tags: ['adjetivo', 'apariencia', 'positivo']
        }
      ],
      japanese: [
        {
          id: 1,
          word: 'こんにちは',
          phonetics: 'konnichiwa',
          meaning: 'Hola',
          translation: 'Saludo durante el día',
          example: 'こんにちは、元気ですか？',
          category: 'Saludos',
          level: 'Básico',
          mastered: true,
          studyCount: 25,
          lastStudied: '2024-01-14',
          difficulty: 'Fácil',
          tags: ['básico', 'saludo', 'hiragana']
        },
        {
          id: 2,
          word: '美しい',
          phonetics: 'utsukushii',
          meaning: 'Hermoso',
          translation: 'Que tiene belleza',
          example: '夕日が美しいです',
          category: 'Adjetivos',
          level: 'Intermedio',
          mastered: false,
          studyCount: 7,
          lastStudied: '2024-01-11',
          difficulty: 'Medio',
          tags: ['adjetivo', 'apariencia', 'i-adjetivo']
        }
      ]
    };

    // Categorías por idioma
    const categories = {
      english: ['Todas', 'Saludos', 'Adjetivos', 'Sustantivos', 'Verbos', 'Frases'],
      spanish: ['Todas', 'Saludos', 'Adjetivos', 'Sustantivos', 'Verbos', 'Frases'],
      french: ['Todas', 'Saludos', 'Adjetivos', 'Sustantivos', 'Verbos', 'Frases'],
      japanese: ['Todas', 'Saludos', 'Adjetivos', 'Sustantivos', 'Verbos', 'Hiragana', 'Katakana']
    };

    // Funciones auxiliares
    const getLevelColor = (level) => {
      const colors = {
        'Básico': '#4CAF50',
        'Intermedio': '#FF9800',
        'Avanzado': '#F44336'
      };
      return colors[level] || '#6B7280';
    };

    const getDifficultyColor = (difficulty) => {
      const colors = {
        'Fácil': '#4CAF50',
        'Medio': '#FF9800',
        'Difícil': '#F44336'
      };
      return colors[difficulty] || '#6B7280';
    };

    const getCategoryIcon = (category) => {
      const icons = {
        'Saludos': 'hand-left',
        'Adjetivos': 'color-palette',
        'Sustantivos': 'cube',
        'Verbos': 'flash',
        'Hiragana': 'text',
        'Katakana': 'text',
        'Frases': 'chatbubbles',
        'Otros': 'book'
      };
      return icons[category] || 'book';
    };

    // Filtrar vocabulario
    const getFilteredVocabulary = () => {
      let filtered = vocabularyData[selectedLanguage] || [];
      
      if (selectedCategory !== 'all') {
        filtered = filtered.filter(item => item.category === selectedCategory);
      }
      
      if (searchQuery) {
        filtered = filtered.filter(item => 
          item.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.meaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.translation.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      return filtered;
    };

    const getLanguageStats = (languageId) => {
      const vocab = vocabularyData[languageId] || [];
      const mastered = vocab.filter(item => item.mastered).length;
      const total = vocab.length;
      const percentage = total > 0 ? Math.round((mastered / total) * 100) : 0;
      
      return { mastered, total, percentage };
    };

    const getMasteryPercentage = () => {
      const currentVocab = vocabularyData[selectedLanguage] || [];
      const mastered = currentVocab.filter(item => item.mastered).length;
      return currentVocab.length > 0 ? Math.round((mastered / currentVocab.length) * 100) : 0;
    };

    const getTotalStudyTime = () => {
      const currentVocab = vocabularyData[selectedLanguage] || [];
      return currentVocab.reduce((total, item) => total + item.studyCount, 0);
    };

    const filteredVocabulary = getFilteredVocabulary();
    const currentLanguage = languages.find(lang => lang.id === selectedLanguage);
    const languageStats = getLanguageStats(selectedLanguage);

    return (
    <View style={styles.section}>
        {/* Header mejorado */}
        <View style={styles.vocabularyHeader}>
          <View style={styles.vocabularyHeaderContent}>
            <View style={styles.vocabularyHeaderIcon}>
              <Icon name="book" size={28} color="#FFFFFF" />
            </View>
            <View style={styles.vocabularyHeaderText}>
              <Text style={styles.vocabularyHeaderTitle}>Estudio de Vocabulario</Text>
              <Text style={styles.vocabularyHeaderSubtitle}>
                Amplía tu vocabulario en múltiples idiomas
              </Text>
            </View>
          </View>
          <View style={styles.vocabularyHeaderBadge}>
            <Text style={styles.vocabularyHeaderCount}>{filteredVocabulary.length}</Text>
          </View>
        </View>

        {/* Selector de idiomas */}
        <View style={styles.languageSelectorContainer}>
          <Text style={styles.languageSelectorTitle}>Idioma de Estudio</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.languageSelectorScroll}>
            {languages.map((language) => {
              const stats = getLanguageStats(language.id);
              return (
                <TouchableOpacity
                  key={language.id}
                  style={[
                    styles.languageCard,
                    selectedLanguage === language.id && styles.languageCardSelected,
                    { borderColor: language.color }
                  ]}
                  onPress={() => setSelectedLanguage(language.id)}
                >
                  <View style={[styles.languageIcon, { backgroundColor: language.color }]}>
                    <Text style={styles.languageFlag}>{language.flag}</Text>
                  </View>
                  <Text style={styles.languageName}>{language.name}</Text>
                  <View style={styles.languageProgress}>
                    <View style={styles.languageProgressBar}>
                      <View 
                        style={[
                          styles.languageProgressFill,
                          { width: `${stats.percentage}%`, backgroundColor: language.color }
                        ]}
                      />
                    </View>
                    <Text style={styles.languageProgressText}>
                      {stats.mastered}/{stats.total}
                    </Text>
                  </View>
        </TouchableOpacity>
              );
            })}
          </ScrollView>
      </View>

        {/* Barra de búsqueda y filtros */}
        <View style={styles.vocabularyFilters}>
          <View style={styles.searchContainer}>
            <Icon name="search" size={20} color="#6B7280" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar palabras..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity 
                style={styles.clearSearchButton}
                onPress={() => setSearchQuery('')}
              >
                <Icon name="close-circle" size={20} color="#6B7280" />
              </TouchableOpacity>
            )}
        </View>
        
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
            {categories[selectedLanguage]?.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryChip,
                  selectedCategory === category && styles.categoryChipSelected
                ]}
                onPress={() => setSelectedCategory(category === 'Todas' ? 'all' : category)}
              >
                <Text style={[
                  styles.categoryChipText,
                  selectedCategory === category && styles.categoryChipTextSelected
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Estadísticas del idioma actual */}
        <View style={styles.vocabularyStats}>
          <View style={styles.vocabularyStatCard}>
            <View style={styles.vocabularyStatIcon}>
              <Icon name="trophy" size={20} color="#4CAF50" />
            </View>
            <View style={styles.vocabularyStatContent}>
              <Text style={styles.vocabularyStatValue}>{languageStats.percentage}%</Text>
              <Text style={styles.vocabularyStatLabel}>Dominado</Text>
            </View>
          </View>
          <View style={styles.vocabularyStatCard}>
            <View style={styles.vocabularyStatIcon}>
              <Icon name="analytics" size={20} color="#2196F3" />
            </View>
            <View style={styles.vocabularyStatContent}>
              <Text style={styles.vocabularyStatValue}>{getTotalStudyTime()}</Text>
              <Text style={styles.vocabularyStatLabel}>Estudios</Text>
            </View>
          </View>
          <View style={styles.vocabularyStatCard}>
            <View style={styles.vocabularyStatIcon}>
              <Icon name="time" size={20} color="#FF9800" />
            </View>
            <View style={styles.vocabularyStatContent}>
              <Text style={styles.vocabularyStatValue}>
                {languageStats.total - languageStats.mastered}
              </Text>
              <Text style={styles.vocabularyStatLabel}>Pendientes</Text>
            </View>
          </View>
          <View style={styles.vocabularyStatCard}>
            <View style={styles.vocabularyStatIcon}>
              <Icon name="book" size={20} color="#9C27B0" />
            </View>
            <View style={styles.vocabularyStatContent}>
              <Text style={styles.vocabularyStatValue}>{languageStats.total}</Text>
              <Text style={styles.vocabularyStatLabel}>Total</Text>
            </View>
          </View>
        </View>

        {/* Botones de acción */}
        <View style={styles.vocabularyActions}>
          <TouchableOpacity style={styles.vocabularyAddButton} onPress={openAddVocabularyModal}>
            <Icon name="add-circle-outline" size={24} color="#FFFFFF" />
            <Text style={styles.vocabularyAddButtonText}>Agregar Palabra</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.studyModeButton}
            onPress={() => setStudyMode(!studyMode)}
          >
            <Icon name={studyMode ? "pause" : "play"} size={20} color="#FFFFFF" />
            <Text style={styles.studyModeButtonText}>
              {studyMode ? 'Pausar' : 'Modo Estudio'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Lista de vocabulario mejorada */}
        <View style={styles.vocabularyList}>
          {filteredVocabulary.length === 0 ? (
            <View style={styles.vocabularyEmptyState}>
              <View style={styles.vocabularyEmptyIcon}>
                <Icon name="book-outline" size={64} color="#E0E0E0" />
              </View>
              <Text style={styles.vocabularyEmptyTitle}>
                {searchQuery ? 'No se encontraron resultados' : 'No hay vocabulario registrado'}
              </Text>
              <Text style={styles.vocabularyEmptySubtitle}>
                {searchQuery 
                  ? 'Intenta con otros términos de búsqueda'
                  : `Agrega tu primera palabra en ${currentLanguage?.name} para comenzar a estudiar`
                }
              </Text>
          </View>
        ) : (
            filteredVocabulary.map((item) => (
              <View key={item.id} style={styles.vocabularyCard}>
                <View style={styles.vocabularyCardHeader}>
                  <View style={styles.vocabularyCardInfo}>
                    <View style={styles.vocabularyCardTitleRow}>
                      <Text style={styles.vocabularyCardWord}>{item.word}</Text>
                      <View style={[
                        styles.vocabularyLevelBadge,
                        { backgroundColor: getLevelColor(item.level) }
                      ]}>
                        <Text style={styles.vocabularyLevelText}>{item.level}</Text>
                      </View>
                    </View>
                    <Text style={styles.vocabularyPhonetics}>{item.phonetics}</Text>
                    <Text style={styles.vocabularyMeaning}>{item.meaning}</Text>
                    <Text style={styles.vocabularyTranslation}>{item.translation}</Text>
                    <Text style={styles.vocabularyExample}>{item.example}</Text>
                  </View>
                  <View style={styles.vocabularyCardActions}>
                    <TouchableOpacity style={styles.vocabularyEditButton}>
                      <Icon name="create-outline" size={16} color="#667eea" />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.vocabularyDeleteButton}
                      onPress={() => deleteVocabulary(item.id)}
                    >
                      <Icon name="trash-outline" size={16} color="#dc3545" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Tags */}
                <View style={styles.vocabularyTags}>
                  {item.tags.map((tag, index) => (
                    <View key={index} style={styles.vocabularyTag}>
                      <Text style={styles.vocabularyTagText}>{tag}</Text>
                    </View>
                  ))}
                </View>

                {/* Información adicional */}
                <View style={styles.vocabularyCardDetails}>
                  <View style={styles.vocabularyCardMeta}>
                    <View style={styles.vocabularyCategoryContainer}>
                      <Icon 
                        name={getCategoryIcon(item.category)} 
                        size={14} 
                        color="#6B7280" 
                      />
                      <Text style={styles.vocabularyCategory}>{item.category}</Text>
                    </View>
                    <View style={[
                      styles.vocabularyDifficultyBadge,
                      { backgroundColor: getDifficultyColor(item.difficulty) }
                    ]}>
                      <Text style={styles.vocabularyDifficultyText}>{item.difficulty}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.vocabularyProgressContainer}>
                    <View style={styles.vocabularyProgressHeader}>
                      <Text style={styles.vocabularyProgressLabel}>Progreso de Estudio</Text>
                      <Text style={styles.vocabularyProgressValue}>
                        {item.studyCount} estudios
                      </Text>
                    </View>
                    <View style={styles.vocabularyProgressBar}>
                      <View 
                        style={[
                          styles.vocabularyProgressFill,
                          { 
                            width: `${Math.min((item.studyCount / 20) * 100, 100)}%`,
                            backgroundColor: item.mastered ? '#4CAF50' : '#2196F3'
                          }
                        ]}
                      />
                    </View>
                    <Text style={styles.vocabularyLastStudied}>
                      Último estudio: {new Date(item.lastStudied).toLocaleDateString('es-ES')}
                    </Text>
                  </View>

                  {/* Estado de dominio */}
                  <View style={styles.vocabularyMasteryContainer}>
                    <View style={[
                      styles.vocabularyMasteryBadge,
                      { backgroundColor: item.mastered ? '#4CAF50' : '#FF9800' }
                    ]}>
                      <Icon 
                        name={item.mastered ? "checkmark-circle" : "time"} 
                        size={16} 
                        color="#FFFFFF" 
                      />
                      <Text style={styles.vocabularyMasteryText}>
                        {item.mastered ? 'Dominado' : 'En Estudio'}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Botones de acción rápida */}
                <View style={styles.vocabularyQuickActions}>
                  <TouchableOpacity style={styles.vocabularyQuickAction}>
                    <Icon name="volume-high" size={16} color="#4CAF50" />
                    <Text style={styles.vocabularyQuickActionText}>Pronunciar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.vocabularyQuickAction}>
                    <Icon name="bookmark" size={16} color="#FF9800" />
                    <Text style={styles.vocabularyQuickActionText}>Guardar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.vocabularyQuickAction}>
                    <Icon name="refresh" size={16} color="#2196F3" />
                    <Text style={styles.vocabularyQuickActionText}>Repasar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.vocabularyQuickAction}>
                    <Icon name="share" size={16} color="#9C27B0" />
                    <Text style={styles.vocabularyQuickActionText}>Compartir</Text>
                  </TouchableOpacity>
                </View>
            </View>
          ))
        )}
      </View>
      </View>
    );
  };

  const renderWritingPractice = () => {

    // Datos de sistemas de escritura
    const writingSystems = [
      {
        id: 'hiragana',
        name: 'Hiragana',
        description: 'Sistema de escritura japonesa',
        icon: '🌸',
        color: '#E91E63',
        characters: ['あ', 'い', 'う', 'え', 'お', 'か', 'き', 'く', 'け', 'こ']
      },
      {
        id: 'katakana',
        name: 'Katakana',
        description: 'Sistema de escritura japonesa',
        icon: '⚡',
        color: '#9C27B0',
        characters: ['ア', 'イ', 'ウ', 'エ', 'オ', 'カ', 'キ', 'ク', 'ケ', 'コ']
      },
      {
        id: 'hangul',
        name: 'Hangul',
        description: 'Sistema de escritura coreana',
        icon: '🇰🇷',
        color: '#2196F3',
        characters: ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅊ']
      },
      {
        id: 'pinyin',
        name: 'Pinyin',
        description: 'Sistema de escritura china',
        icon: '🇨🇳',
        color: '#F44336',
        characters: ['ā', 'á', 'ǎ', 'à', 'ē', 'é', 'ě', 'è', 'ī', 'í']
      }
    ];

    // Plantillas de práctica
    const practiceTemplates = {
      hiragana: [
        { id: 1, name: 'Vocales Básicas', characters: ['あ', 'い', 'う', 'え', 'お'], difficulty: 'Fácil' },
        { id: 2, name: 'Consonantes K', characters: ['か', 'き', 'く', 'け', 'こ'], difficulty: 'Fácil' },
        { id: 3, name: 'Consonantes S', characters: ['さ', 'し', 'す', 'せ', 'そ'], difficulty: 'Medio' },
        { id: 4, name: 'Consonantes T', characters: ['た', 'ち', 'つ', 'て', 'と'], difficulty: 'Medio' },
        { id: 5, name: 'Consonantes N', characters: ['な', 'に', 'ぬ', 'ね', 'の'], difficulty: 'Fácil' }
      ],
      katakana: [
        { id: 1, name: 'Vocales Básicas', characters: ['ア', 'イ', 'ウ', 'エ', 'オ'], difficulty: 'Fácil' },
        { id: 2, name: 'Consonantes K', characters: ['カ', 'キ', 'ク', 'ケ', 'コ'], difficulty: 'Fácil' },
        { id: 3, name: 'Consonantes S', characters: ['サ', 'シ', 'ス', 'セ', 'ソ'], difficulty: 'Medio' },
        { id: 4, name: 'Consonantes T', characters: ['タ', 'チ', 'ツ', 'テ', 'ト'], difficulty: 'Medio' },
        { id: 5, name: 'Consonantes N', characters: ['ナ', 'ニ', 'ヌ', 'ネ', 'ノ'], difficulty: 'Fácil' }
      ],
      hangul: [
        { id: 1, name: 'Consonantes Básicas', characters: ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ'], difficulty: 'Fácil' },
        { id: 2, name: 'Consonantes Adicionales', characters: ['ㅂ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅊ'], difficulty: 'Medio' },
        { id: 3, name: 'Vocales Básicas', characters: ['ㅏ', 'ㅓ', 'ㅗ', 'ㅜ', 'ㅡ'], difficulty: 'Fácil' },
        { id: 4, name: 'Vocales Compuestas', characters: ['ㅑ', 'ㅕ', 'ㅛ', 'ㅠ', 'ㅣ'], difficulty: 'Medio' },
        { id: 5, name: 'Sílabas Básicas', characters: ['가', '나', '다', '라', '마'], difficulty: 'Difícil' }
      ],
      pinyin: [
        { id: 1, name: 'Tono 1', characters: ['ā', 'ē', 'ī', 'ō', 'ū'], difficulty: 'Fácil' },
        { id: 2, name: 'Tono 2', characters: ['á', 'é', 'í', 'ó', 'ú'], difficulty: 'Fácil' },
        { id: 3, name: 'Tono 3', characters: ['ǎ', 'ě', 'ǐ', 'ǒ', 'ǔ'], difficulty: 'Medio' },
        { id: 4, name: 'Tono 4', characters: ['à', 'è', 'ì', 'ò', 'ù'], difficulty: 'Medio' },
        { id: 5, name: 'Tono Neutro', characters: ['a', 'e', 'i', 'o', 'u'], difficulty: 'Fácil' }
      ]
    };

    const getDifficultyColor = (difficulty) => {
      const colors = {
        'Fácil': '#4CAF50',
        'Medio': '#FF9800',
        'Difícil': '#F44336'
      };
      return colors[difficulty] || '#6B7280';
    };

    const getSystemStats = (systemId) => {
      const completed = practiceHistory.filter(p => p.system === systemId && p.completed).length;
      const total = practiceTemplates[systemId].length;
      return { completed, total, percentage: Math.round((completed / total) * 100) };
    };

    const WritingCanvas = ({ template, onComplete }) => {
      const [strokes, setStrokes] = useState([]);
      const [currentStroke, setCurrentStroke] = useState([]);
      const [isDrawing, setIsDrawing] = useState(false);

      const handleTouchStart = (event) => {
        setIsDrawing(true);
        const { locationX, locationY } = event.nativeEvent;
        setCurrentStroke([{ x: locationX, y: locationY }]);
      };

      const handleTouchMove = (event) => {
        if (!isDrawing) return;
        const { locationX, locationY } = event.nativeEvent;
        setCurrentStroke(prev => [...prev, { x: locationX, y: locationY }]);
      };

      const handleTouchEnd = () => {
        if (!isDrawing) return;
        setIsDrawing(false);
        setStrokes(prev => [...prev, currentStroke]);
        setCurrentStroke([]);
      };

      const clearCanvas = () => {
        setStrokes([]);
        setCurrentStroke([]);
      };

      const checkAccuracy = () => {
        // Simulación de verificación de precisión
        const accuracy = Math.random() * 40 + 60; // 60-100%
        return Math.round(accuracy);
      };

      return (
        <View style={styles.writingCanvasContainer}>
          <View style={styles.canvasHeader}>
            <Text style={styles.canvasTitle}>Practica: {template.name}</Text>
            <View style={styles.canvasActions}>
              <TouchableOpacity style={styles.clearButton} onPress={clearCanvas}>
                <Icon name="refresh" size={20} color="#6B7280" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.checkButton} 
                onPress={() => {
                  const accuracy = checkAccuracy();
                  onComplete(accuracy);
                }}
              >
                <Icon name="checkmark" size={20} color="#4CAF50" />
              </TouchableOpacity>
            </View>
            </View>
          
          <View style={styles.canvasArea}>
            <View style={styles.characterGuide}>
              <Text style={styles.characterGuideText}>
                {template.characters.join(' ')}
              </Text>
          </View>
            
            <View 
              style={styles.canvas}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {strokes.map((stroke, strokeIndex) => (
                <View key={strokeIndex} style={styles.stroke}>
                  {stroke.map((point, pointIndex) => (
                    <View
                      key={pointIndex}
                      style={[
                        styles.strokePoint,
                        {
                          left: point.x - 2,
                          top: point.y - 2,
                        }
                      ]}
                    />
                  ))}
                </View>
              ))}
              {currentStroke.map((point, pointIndex) => (
                <View
                  key={`current-${pointIndex}`}
                  style={[
                    styles.strokePoint,
                    {
                      left: point.x - 2,
                      top: point.y - 2,
                    }
                  ]}
                />
              ))}
            </View>
      </View>
    </View>
  );
    };

    return (
    <View style={styles.section}>
        {/* Header mejorado */}
        <View style={styles.writingHeader}>
          <View style={styles.writingHeaderContent}>
            <View style={styles.writingHeaderIcon}>
              <Icon name="create" size={28} color="#FFFFFF" />
            </View>
            <View style={styles.writingHeaderText}>
              <Text style={styles.writingHeaderTitle}>Práctica de Escritura</Text>
              <Text style={styles.writingHeaderSubtitle}>
                Practica diferentes sistemas de escritura
              </Text>
            </View>
          </View>
          <View style={styles.writingHeaderBadge}>
            <Text style={styles.writingHeaderCount}>{writingSystems.length}</Text>
          </View>
        </View>

        {/* Selector de sistemas de escritura */}
        <View style={styles.writingSystemsContainer}>
          <Text style={styles.writingSystemsTitle}>Sistemas de Escritura</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.writingSystemsScroll}>
            {writingSystems.map((system) => {
              const stats = getSystemStats(system.id);
              return (
                <TouchableOpacity
                  key={system.id}
                  style={[
                    styles.writingSystemCard,
                    selectedWritingSystem === system.id && styles.writingSystemCardSelected,
                    { borderColor: system.color }
                  ]}
                  onPress={() => setSelectedWritingSystem(system.id)}
                >
                  <View style={[styles.writingSystemIcon, { backgroundColor: system.color }]}>
                    <Text style={styles.writingSystemEmoji}>{system.icon}</Text>
                  </View>
                  <Text style={styles.writingSystemName}>{system.name}</Text>
                  <Text style={styles.writingSystemDescription}>{system.description}</Text>
                  <View style={styles.writingSystemProgress}>
                    <View style={styles.writingSystemProgressBar}>
                      <View 
                        style={[
                          styles.writingSystemProgressFill,
                          { width: `${stats.percentage}%`, backgroundColor: system.color }
                        ]}
                      />
                    </View>
                    <Text style={styles.writingSystemProgressText}>
                      {stats.completed}/{stats.total}
                    </Text>
                  </View>
        </TouchableOpacity>
              );
            })}
          </ScrollView>
      </View>

        {/* Canvas de escritura */}
        {showCanvas && selectedTemplate && (
          <WritingCanvas
            template={selectedTemplate}
            onComplete={(accuracy) => {
              setPracticeHistory(prev => [...prev, {
                id: Date.now(),
                system: selectedWritingSystem,
                template: selectedTemplate.name,
                accuracy,
                completed: accuracy >= 70,
                date: new Date().toISOString()
              }]);
              setShowCanvas(false);
              setSelectedTemplate(null);
            }}
          />
        )}

        {/* Plantillas de práctica */}
        <View style={styles.writingTemplatesContainer}>
          <View style={styles.writingTemplatesHeader}>
            <Text style={styles.writingTemplatesTitle}>
              Plantillas de {writingSystems.find(s => s.id === selectedWritingSystem)?.name}
            </Text>
            <Text style={styles.writingTemplatesSubtitle}>
              Selecciona una plantilla para comenzar a practicar
            </Text>
              </View>
          
          <View style={styles.writingTemplatesGrid}>
            {practiceTemplates[selectedWritingSystem]?.map((template) => (
              <TouchableOpacity
                key={template.id}
                style={styles.writingTemplateCard}
                onPress={() => {
                  setSelectedTemplate(template);
                  setShowCanvas(true);
                }}
              >
                <View style={styles.writingTemplateHeader}>
                  <Text style={styles.writingTemplateName}>{template.name}</Text>
                  <View style={[
                    styles.writingTemplateDifficulty,
                    { backgroundColor: getDifficultyColor(template.difficulty) }
                  ]}>
                    <Text style={styles.writingTemplateDifficultyText}>{template.difficulty}</Text>
            </View>
                </View>
                <View style={styles.writingTemplateCharacters}>
                  {template.characters.map((char, index) => (
                    <Text key={index} style={styles.writingTemplateCharacter}>{char}</Text>
                  ))}
                </View>
                <View style={styles.writingTemplateFooter}>
                  <Icon name="play-circle" size={20} color="#06B6D4" />
                  <Text style={styles.writingTemplateActionText}>Practicar</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Estadísticas de práctica */}
        <View style={styles.writingStatsContainer}>
          <Text style={styles.writingStatsTitle}>Estadísticas de Práctica</Text>
          <View style={styles.writingStatsGrid}>
            <View style={styles.writingStatCard}>
              <View style={styles.writingStatIcon}>
                <Icon name="trophy" size={20} color="#4CAF50" />
              </View>
              <View style={styles.writingStatContent}>
                <Text style={styles.writingStatValue}>
                  {practiceHistory.filter(p => p.completed).length}
                </Text>
                <Text style={styles.writingStatLabel}>Completadas</Text>
              </View>
            </View>
            <View style={styles.writingStatCard}>
              <View style={styles.writingStatIcon}>
                <Icon name="analytics" size={20} color="#2196F3" />
              </View>
              <View style={styles.writingStatContent}>
                <Text style={styles.writingStatValue}>
                  {practiceHistory.length > 0 
                    ? Math.round(practiceHistory.reduce((sum, p) => sum + p.accuracy, 0) / practiceHistory.length)
                    : 0}%
                </Text>
                <Text style={styles.writingStatLabel}>Precisión</Text>
              </View>
            </View>
            <View style={styles.writingStatCard}>
              <View style={styles.writingStatIcon}>
                <Icon name="time" size={20} color="#FF9800" />
              </View>
              <View style={styles.writingStatContent}>
                <Text style={styles.writingStatValue}>
                  {practiceHistory.length}
                </Text>
                <Text style={styles.writingStatLabel}>Sesiones</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Historial de práctica reciente */}
        {practiceHistory.length > 0 && (
          <View style={styles.writingHistoryContainer}>
            <Text style={styles.writingHistoryTitle}>Práctica Reciente</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.writingHistoryScroll}>
              {practiceHistory.slice(-5).reverse().map((session) => (
                <View key={session.id} style={styles.writingHistoryCard}>
                  <View style={styles.writingHistoryHeader}>
                    <Text style={styles.writingHistorySystem}>
                      {writingSystems.find(s => s.id === session.system)?.name}
                    </Text>
                    <View style={[
                      styles.writingHistoryStatus,
                      { backgroundColor: session.completed ? '#4CAF50' : '#FF9800' }
                    ]}>
                      <Text style={styles.writingHistoryStatusText}>
                        {session.completed ? 'Completado' : 'En progreso'}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.writingHistoryTemplate}>{session.template}</Text>
                  <Text style={styles.writingHistoryAccuracy}>
                    Precisión: {session.accuracy}%
                  </Text>
                  <Text style={styles.writingHistoryDate}>
                    {new Date(session.date).toLocaleDateString('es-ES')}
                  </Text>
            </View>
          ))}
            </ScrollView>
        </View>
        )}
      </View>
    );
  };

  const renderGrammarNotes = () => {
    // Idiomas disponibles para gramática
    const grammarLanguages = [
      { id: 'english', name: 'Inglés', flag: '🇺🇸', color: '#2196F3' },
      { id: 'spanish', name: 'Español', flag: '🇪🇸', color: '#E91E63' },
      { id: 'french', name: 'Francés', flag: '🇫🇷', color: '#4CAF50' },
      { id: 'german', name: 'Alemán', flag: '🇩🇪', color: '#FF9800' },
      { id: 'japanese', name: 'Japonés', flag: '🇯🇵', color: '#9C27B0' },
      { id: 'korean', name: 'Coreano', flag: '🇰🇷', color: '#F44336' },
      { id: 'chinese', name: 'Chino', flag: '🇨🇳', color: '#795548' }
    ];

    // Categorías de gramática por idioma
    const grammarCategories = {
      english: ['Todas', 'Tiempos Verbales', 'Sustantivos', 'Adjetivos', 'Pronombres', 'Preposiciones', 'Conjunciones', 'Artículos', 'Adverbios'],
      spanish: ['Todas', 'Tiempos Verbales', 'Sustantivos', 'Adjetivos', 'Pronombres', 'Preposiciones', 'Conjunciones', 'Artículos', 'Adverbios', 'Subjuntivo'],
      french: ['Todas', 'Tiempos Verbales', 'Sustantivos', 'Adjetivos', 'Pronombres', 'Preposiciones', 'Conjunciones', 'Artículos', 'Adverbios', 'Género'],
      german: ['Todas', 'Tiempos Verbales', 'Sustantivos', 'Adjetivos', 'Pronombres', 'Preposiciones', 'Conjunciones', 'Artículos', 'Adverbios', 'Casos'],
      japanese: ['Todas', 'Hiragana', 'Katakana', 'Kanji', 'Partículas', 'Verbos', 'Adjetivos', 'Honoríficos', 'Contadores'],
      korean: ['Todas', 'Hangul', 'Partículas', 'Verbos', 'Adjetivos', 'Honoríficos', 'Contadores', 'Conjugaciones'],
      chinese: ['Todas', 'Pinyin', 'Caracteres', 'Tonos', 'Partículas', 'Verbos', 'Adjetivos', 'Medidas']
    };

    // Datos de ejemplo de notas de gramática
    const grammarNotesData = {
      english: [
        {
          id: 1,
          title: 'Present Simple vs Present Continuous',
          category: 'Tiempos Verbales',
          content: 'El Present Simple se usa para hábitos y hechos generales, mientras que el Present Continuous se usa para acciones que están ocurriendo ahora.',
          examples: [
            'I work every day (Present Simple)',
            'I am working now (Present Continuous)'
          ],
          difficulty: 'Intermedio',
          level: 'B2',
          mastered: false,
          studyCount: 8,
          lastStudied: '2024-01-14',
          tags: ['tiempos', 'verbos', 'presente'],
          color: '#2196F3'
        },
        {
          id: 2,
          title: 'Articles: A, An, The',
          category: 'Artículos',
          content: 'Usa "a" antes de consonantes, "an" antes de vocales, y "the" para referencias específicas.',
          examples: [
            'A cat (un gato)',
            'An apple (una manzana)',
            'The book (el libro específico)'
          ],
          difficulty: 'Básico',
          level: 'A1',
          mastered: true,
          studyCount: 25,
          lastStudied: '2024-01-13',
          tags: ['artículos', 'básico', 'sustantivos'],
          color: '#4CAF50'
        },
        {
          id: 3,
          title: 'Conditional Sentences',
          category: 'Tiempos Verbales',
          content: 'Las oraciones condicionales expresan situaciones hipotéticas. Hay cuatro tipos principales.',
          examples: [
            'If I study, I will pass (First Conditional)',
            'If I studied, I would pass (Second Conditional)'
          ],
          difficulty: 'Avanzado',
          level: 'C1',
          mastered: false,
          studyCount: 12,
          lastStudied: '2024-01-12',
          tags: ['condicionales', 'avanzado', 'verbos'],
          color: '#FF9800'
        }
      ],
      spanish: [
        {
          id: 1,
          title: 'Ser vs Estar',
          category: 'Verbos',
          content: 'Ser se usa para características permanentes, estar para estados temporales.',
          examples: [
            'Soy alto (característica permanente)',
            'Estoy cansado (estado temporal)'
          ],
          difficulty: 'Intermedio',
          level: 'B1',
          mastered: false,
          studyCount: 15,
          lastStudied: '2024-01-14',
          tags: ['verbos', 'ser', 'estar'],
          color: '#E91E63'
        }
      ]
    };

    // Funciones auxiliares
    const getDifficultyColor = (difficulty) => {
      switch (difficulty) {
        case 'Básico': return '#4CAF50';
        case 'Intermedio': return '#FF9800';
        case 'Avanzado': return '#F44336';
        default: return '#6B7280';
      }
    };

    const getLevelColor = (level) => {
      switch (level) {
        case 'A1': case 'A2': return '#4CAF50';
        case 'B1': case 'B2': return '#FF9800';
        case 'C1': case 'C2': return '#F44336';
        default: return '#6B7280';
      }
    };

    const getCategoryIcon = (category) => {
      switch (category) {
        case 'Tiempos Verbales': return 'time-outline';
        case 'Sustantivos': return 'cube-outline';
        case 'Adjetivos': return 'color-palette-outline';
        case 'Pronombres': return 'person-outline';
        case 'Preposiciones': return 'arrow-forward-outline';
        case 'Conjunciones': return 'link-outline';
        case 'Artículos': return 'book-outline';
        case 'Adverbios': return 'flash-outline';
        default: return 'document-text-outline';
      }
    };

    const getFilteredNotes = () => {
      let notes = grammarNotesData[selectedGrammarLanguage] || [];
      
      if (selectedGrammarCategory !== 'all') {
        notes = notes.filter(note => note.category === selectedGrammarCategory);
      }
      
      if (grammarSearchQuery) {
        notes = notes.filter(note => 
          note.title.toLowerCase().includes(grammarSearchQuery.toLowerCase()) ||
          note.content.toLowerCase().includes(grammarSearchQuery.toLowerCase()) ||
          note.tags.some(tag => tag.toLowerCase().includes(grammarSearchQuery.toLowerCase()))
        );
      }
      
      return notes;
    };

    const getGrammarStats = () => {
      const notes = grammarNotesData[selectedGrammarLanguage] || [];
      const total = notes.length;
      const mastered = notes.filter(note => note.mastered).length;
      const percentage = total > 0 ? Math.round((mastered / total) * 100) : 0;
      
      return { total, mastered, percentage };
    };

    const filteredNotes = getFilteredNotes();
    const stats = getGrammarStats();

    return (
      <ScrollView style={styles.grammarContainer} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.grammarHeader}>
          <View style={styles.grammarHeaderContent}>
            <View style={styles.grammarHeaderIcon}>
              <Icon name="document-text" size={24} color="#FFFFFF" />
    </View>
            <View style={styles.grammarHeaderText}>
              <Text style={styles.grammarHeaderTitle}>Notas de Gramática</Text>
              <Text style={styles.grammarHeaderSubtitle}>
                Domina las reglas gramaticales
              </Text>
            </View>
          </View>
          <View style={styles.grammarHeaderBadge}>
            <Text style={styles.grammarHeaderCount}>{filteredNotes.length}</Text>
          </View>
        </View>

        {/* Selector de idiomas */}
        <View style={styles.grammarLanguageSelector}>
          <Text style={styles.grammarLanguageTitle}>Idioma de Estudio</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.grammarLanguageScroll}>
            {grammarLanguages.map((language) => {
              const languageStats = getGrammarStats();
              return (
                <TouchableOpacity
                  key={language.id}
                  style={[
                    styles.grammarLanguageCard,
                    selectedGrammarLanguage === language.id && styles.grammarLanguageCardSelected,
                    { borderColor: language.color }
                  ]}
                  onPress={() => setSelectedGrammarLanguage(language.id)}
                >
                  <View style={[styles.grammarLanguageIcon, { backgroundColor: language.color }]}>
                    <Text style={styles.grammarLanguageFlag}>{language.flag}</Text>
                  </View>
                  <Text style={styles.grammarLanguageName}>{language.name}</Text>
                  <View style={styles.grammarLanguageProgress}>
                    <View style={styles.grammarLanguageProgressBar}>
                      <View 
                        style={[
                          styles.grammarLanguageProgressFill,
                          { width: `${languageStats.percentage}%`, backgroundColor: language.color }
                        ]}
                      />
                    </View>
                    <Text style={styles.grammarLanguageProgressText}>
                      {languageStats.mastered}/{languageStats.total}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Barra de búsqueda y filtros */}
        <View style={styles.grammarFilters}>
          <View style={styles.grammarSearchContainer}>
            <Icon name="search" size={20} color="#6B7280" style={styles.grammarSearchIcon} />
            <TextInput
              style={styles.grammarSearchInput}
              placeholder="Buscar notas de gramática..."
              placeholderTextColor="#9CA3AF"
              value={grammarSearchQuery}
              onChangeText={setGrammarSearchQuery}
            />
            {grammarSearchQuery.length > 0 && (
              <TouchableOpacity 
                style={styles.grammarClearSearchButton}
                onPress={() => setGrammarSearchQuery('')}
              >
                <Icon name="close-circle" size={20} color="#6B7280" />
        </TouchableOpacity>
            )}
      </View>
      
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.grammarCategoriesScroll}>
            {grammarCategories[selectedGrammarLanguage]?.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.grammarCategoryChip,
                  selectedGrammarCategory === category && styles.grammarCategoryChipSelected
                ]}
                onPress={() => setSelectedGrammarCategory(category === 'Todas' ? 'all' : category)}
              >
                <Text style={[
                  styles.grammarCategoryChipText,
                  selectedGrammarCategory === category && styles.grammarCategoryChipTextSelected
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
      </View>

        {/* Estadísticas */}
        <View style={styles.grammarStats}>
          <View style={styles.grammarStatCard}>
            <View style={styles.grammarStatIcon}>
              <Icon name="trophy" size={20} color="#4CAF50" />
    </View>
            <View style={styles.grammarStatContent}>
              <Text style={styles.grammarStatNumber}>{stats.mastered}</Text>
              <Text style={styles.grammarStatLabel}>Dominadas</Text>
            </View>
          </View>
          <View style={styles.grammarStatCard}>
            <View style={styles.grammarStatIcon}>
              <Icon name="book" size={20} color="#2196F3" />
            </View>
            <View style={styles.grammarStatContent}>
              <Text style={styles.grammarStatNumber}>{stats.total}</Text>
              <Text style={styles.grammarStatLabel}>Total</Text>
            </View>
          </View>
          <View style={styles.grammarStatCard}>
            <View style={styles.grammarStatIcon}>
              <Icon name="trending-up" size={20} color="#FF9800" />
            </View>
            <View style={styles.grammarStatContent}>
              <Text style={styles.grammarStatNumber}>{stats.percentage}%</Text>
              <Text style={styles.grammarStatLabel}>Progreso</Text>
            </View>
          </View>
        </View>

        {/* Botones de acción */}
        <View style={styles.grammarActions}>
          <TouchableOpacity 
            style={styles.grammarAddButton}
            onPress={() => setShowAddGrammarModal(true)}
          >
            <Icon name="add" size={20} color="#FFFFFF" />
            <Text style={styles.grammarAddButtonText}>Nueva Nota</Text>
          </TouchableOpacity>
        </View>

        {/* Lista de notas de gramática */}
        <View style={styles.grammarNotesList}>
          {filteredNotes.map((note) => (
            <View key={note.id} style={styles.grammarNoteCard}>
              <View style={styles.grammarNoteHeader}>
                <View style={styles.grammarNoteTitleContainer}>
                  <Icon 
                    name={getCategoryIcon(note.category)} 
                    size={20} 
                    color={note.color} 
                    style={styles.grammarNoteCategoryIcon}
                  />
                  <Text style={styles.grammarNoteTitle}>{note.title}</Text>
                </View>
                <View style={styles.grammarNoteBadges}>
                  <View style={[styles.grammarNoteDifficulty, { backgroundColor: getDifficultyColor(note.difficulty) }]}>
                    <Text style={styles.grammarNoteDifficultyText}>{note.difficulty}</Text>
                  </View>
                  <View style={[styles.grammarNoteLevel, { backgroundColor: getLevelColor(note.level) }]}>
                    <Text style={styles.grammarNoteLevelText}>{note.level}</Text>
                  </View>
                </View>
              </View>

              <Text style={styles.grammarNoteContent}>{note.content}</Text>

              <View style={styles.grammarNoteExamples}>
                <Text style={styles.grammarNoteExamplesTitle}>Ejemplos:</Text>
                {note.examples.map((example, index) => (
                  <Text key={index} style={styles.grammarNoteExample}>
                    • {example}
                  </Text>
                ))}
              </View>

              <View style={styles.grammarNoteFooter}>
                <View style={styles.grammarNoteTags}>
                  {note.tags.map((tag, index) => (
                    <View key={index} style={styles.grammarNoteTag}>
                      <Text style={styles.grammarNoteTagText}>{tag}</Text>
                    </View>
                  ))}
                </View>
                <View style={styles.grammarNoteActions}>
                  <TouchableOpacity style={styles.grammarNoteActionButton}>
                    <Icon name="bookmark-outline" size={16} color="#6B7280" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.grammarNoteActionButton}>
                    <Icon name="share-outline" size={16} color="#6B7280" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.grammarNoteActionButton}>
                    <Icon name="ellipsis-horizontal" size={16} color="#6B7280" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.grammarNoteProgress}>
                <View style={styles.grammarNoteProgressInfo}>
                  <Text style={styles.grammarNoteProgressText}>
                    {note.mastered ? 'Dominada' : 'En estudio'} • {note.studyCount} repasos
                  </Text>
                  <Text style={styles.grammarNoteProgressDate}>
                    Último estudio: {note.lastStudied}
                  </Text>
                </View>
                <View style={styles.grammarNoteProgressBar}>
                  <View 
                    style={[
                      styles.grammarNoteProgressFill,
                      { 
                        width: note.mastered ? '100%' : `${Math.min((note.studyCount / 20) * 100, 90)}%`,
                        backgroundColor: note.mastered ? '#4CAF50' : note.color
                      }
                    ]}
                  />
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Modal para agregar nueva nota */}
        <Modal
          visible={showAddGrammarModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowAddGrammarModal(false)}
        >
          <View style={styles.grammarModalOverlay}>
            <View style={styles.grammarModalContent}>
              <View style={styles.grammarModalHeader}>
                <Text style={styles.grammarModalTitle}>Nueva Nota de Gramática</Text>
                <TouchableOpacity 
                  style={styles.grammarModalCloseButton}
                  onPress={() => setShowAddGrammarModal(false)}
                >
                  <Icon name="close" size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.grammarModalBody}>
                <View style={styles.grammarModalField}>
                  <Text style={styles.grammarModalLabel}>Título</Text>
                  <TextInput
                    style={styles.grammarModalInput}
                    placeholder="Ej: Present Simple vs Present Continuous"
                    value={newGrammarNote.title}
                    onChangeText={(text) => setNewGrammarNote({...newGrammarNote, title: text})}
                  />
                </View>

                <View style={styles.grammarModalField}>
                  <Text style={styles.grammarModalLabel}>Categoría</Text>
                  <TextInput
                    style={styles.grammarModalInput}
                    placeholder="Ej: Tiempos Verbales"
                    value={newGrammarNote.category}
                    onChangeText={(text) => setNewGrammarNote({...newGrammarNote, category: text})}
                  />
                </View>

                <View style={styles.grammarModalField}>
                  <Text style={styles.grammarModalLabel}>Contenido</Text>
                  <TextInput
                    style={[styles.grammarModalInput, styles.grammarModalTextArea]}
                    placeholder="Explica la regla gramatical..."
                    multiline
                    numberOfLines={4}
                    value={newGrammarNote.content}
                    onChangeText={(text) => setNewGrammarNote({...newGrammarNote, content: text})}
                  />
                </View>

                <View style={styles.grammarModalField}>
                  <Text style={styles.grammarModalLabel}>Ejemplos</Text>
                  <TextInput
                    style={[styles.grammarModalInput, styles.grammarModalTextArea]}
                    placeholder="Escribe ejemplos separados por líneas..."
                    multiline
                    numberOfLines={3}
                    value={newGrammarNote.examples}
                    onChangeText={(text) => setNewGrammarNote({...newGrammarNote, examples: text})}
                  />
                </View>

                <View style={styles.grammarModalField}>
                  <Text style={styles.grammarModalLabel}>Dificultad</Text>
                  <View style={styles.grammarModalDifficultySelector}>
                    {['Básico', 'Intermedio', 'Avanzado'].map((difficulty) => (
                      <TouchableOpacity
                        key={difficulty}
                        style={[
                          styles.grammarModalDifficultyOption,
                          newGrammarNote.difficulty === difficulty && styles.grammarModalDifficultyOptionSelected
                        ]}
                        onPress={() => setNewGrammarNote({...newGrammarNote, difficulty})}
                      >
                        <Text style={[
                          styles.grammarModalDifficultyText,
                          newGrammarNote.difficulty === difficulty && styles.grammarModalDifficultyTextSelected
                        ]}>
                          {difficulty}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </ScrollView>

              <View style={styles.grammarModalFooter}>
                <TouchableOpacity 
                  style={styles.grammarModalCancelButton}
                  onPress={() => setShowAddGrammarModal(false)}
                >
                  <Text style={styles.grammarModalCancelText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.grammarModalSaveButton}
                  onPress={() => {
                    // Aquí se guardaría la nota
                    setShowAddGrammarModal(false);
                    setNewGrammarNote({
                      title: '',
                      category: '',
                      content: '',
                      examples: '',
                      difficulty: 'Básico'
                    });
                  }}
                >
                  <Text style={styles.grammarModalSaveText}>Guardar Nota</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    );
  };

  const renderPronunciation = () => {
    // Idiomas disponibles para pronunciación
    const pronunciationLanguages = [
      { id: 'english', name: 'Inglés', flag: '🇺🇸', color: '#2196F3' },
      { id: 'spanish', name: 'Español', flag: '🇪🇸', color: '#E91E63' },
      { id: 'french', name: 'Francés', flag: '🇫🇷', color: '#4CAF50' },
      { id: 'german', name: 'Alemán', flag: '🇩🇪', color: '#FF9800' },
      { id: 'japanese', name: 'Japonés', flag: '🇯🇵', color: '#9C27B0' },
      { id: 'korean', name: 'Coreano', flag: '🇰🇷', color: '#F44336' },
      { id: 'chinese', name: 'Chino', flag: '🇨🇳', color: '#795548' }
    ];

    // Categorías de pronunciación por idioma
    const pronunciationCategories = {
      english: ['Todas', 'Vocales', 'Consonantes', 'Diptongos', 'Silabas Tónicas', 'Acentos', 'Fonemas Especiales'],
      spanish: ['Todas', 'Vocales', 'Consonantes', 'RR', 'LL', 'Ñ', 'Acentos', 'Silabas Tónicas'],
      french: ['Todas', 'Vocales Nasales', 'Consonantes', 'R Gutural', 'Silenciosas', 'Liaisons', 'Acentos'],
      german: ['Todas', 'Umlauts', 'Consonantes', 'R', 'CH', 'Silabas Tónicas', 'Acentos'],
      japanese: ['Todas', 'Hiragana', 'Katakana', 'Kanji', 'Pitch Accent', 'Long Vowels', 'Double Consonants'],
      korean: ['Todas', 'Hangul', 'Consonantes', 'Vocales', 'Batchim', 'Tensas', 'Aspiradas'],
      chinese: ['Todas', 'Tonos', 'Pinyin', 'Iniciales', 'Finales', 'Tono Neutral', 'Tono Compuesto']
    };

    // Datos de ejemplo de ejercicios de pronunciación
    const pronunciationData = {
      english: [
        {
          id: 1,
          word: 'Hello',
          phonetic: '/həˈloʊ/',
          category: 'Vocales',
          difficulty: 'Básico',
          level: 'A1',
          mastered: false,
          practiceCount: 5,
          lastPracticed: '2024-01-14',
          audioUrl: 'hello_audio.mp3',
          description: 'Saludo común en inglés',
          tips: 'Enfócate en la "h" aspirada y el sonido "oʊ"',
          color: '#2196F3'
        },
        {
          id: 2,
          word: 'Beautiful',
          phonetic: '/ˈbjuːtɪfəl/',
          category: 'Silabas Tónicas',
          difficulty: 'Intermedio',
          level: 'B2',
          mastered: true,
          practiceCount: 15,
          lastPracticed: '2024-01-13',
          audioUrl: 'beautiful_audio.mp3',
          description: 'Adjetivo que significa hermoso',
          tips: 'La sílaba tónica es "beau"',
          color: '#4CAF50'
        },
        {
          id: 3,
          word: 'Thorough',
          phonetic: '/ˈθɜːroʊ/',
          category: 'Consonantes',
          difficulty: 'Avanzado',
          level: 'C1',
          mastered: false,
          practiceCount: 8,
          lastPracticed: '2024-01-12',
          audioUrl: 'thorough_audio.mp3',
          description: 'Adjetivo que significa completo',
          tips: 'Practica el sonido "θ" (th)',
          color: '#FF9800'
        }
      ],
      spanish: [
        {
          id: 1,
          word: 'Perro',
          phonetic: '/ˈpero/',
          category: 'RR',
          difficulty: 'Intermedio',
          level: 'B1',
          mastered: false,
          practiceCount: 12,
          lastPracticed: '2024-01-14',
          audioUrl: 'perro_audio.mp3',
          description: 'Animal doméstico',
          tips: 'Practica el sonido fuerte de la "rr"',
          color: '#E91E63'
        }
      ]
    };

    // Funciones auxiliares
    const getDifficultyColor = (difficulty) => {
      switch (difficulty) {
        case 'Básico': return '#4CAF50';
        case 'Intermedio': return '#FF9800';
        case 'Avanzado': return '#F44336';
        default: return '#6B7280';
      }
    };

    const getLevelColor = (level) => {
      switch (level) {
        case 'A1': case 'A2': return '#4CAF50';
        case 'B1': case 'B2': return '#FF9800';
        case 'C1': case 'C2': return '#F44336';
        default: return '#6B7280';
      }
    };

    const getCategoryIcon = (category) => {
      switch (category) {
        case 'Vocales': return 'radio-outline';
        case 'Consonantes': return 'volume-high-outline';
        case 'Silabas Tónicas': return 'pulse-outline';
        case 'Acentos': return 'trending-up-outline';
        case 'RR': return 'refresh-outline';
        case 'LL': return 'repeat-outline';
        case 'Ñ': return 'ellipsis-horizontal-outline';
        case 'Tonos': return 'musical-notes-outline';
        case 'Hiragana': return 'text-outline';
        case 'Katakana': return 'document-outline';
        case 'Hangul': return 'grid-outline';
        case 'Pinyin': return 'language-outline';
        default: return 'mic-outline';
      }
    };

    const getFilteredExercises = () => {
      let exercises = pronunciationData[selectedPronunciationLanguage] || [];
      
      if (selectedPronunciationCategory !== 'all') {
        exercises = exercises.filter(exercise => exercise.category === selectedPronunciationCategory);
      }
      
      if (pronunciationSearchQuery) {
        exercises = exercises.filter(exercise => 
          exercise.word.toLowerCase().includes(pronunciationSearchQuery.toLowerCase()) ||
          exercise.phonetic.toLowerCase().includes(pronunciationSearchQuery.toLowerCase()) ||
          exercise.description.toLowerCase().includes(pronunciationSearchQuery.toLowerCase())
        );
      }
      
      return exercises;
    };

    const getPronunciationStats = () => {
      const exercises = pronunciationData[selectedPronunciationLanguage] || [];
      const total = exercises.length;
      const mastered = exercises.filter(exercise => exercise.mastered).length;
      const percentage = total > 0 ? Math.round((mastered / total) * 100) : 0;
      const totalPractice = exercises.reduce((sum, exercise) => sum + exercise.practiceCount, 0);
      
      return { total, mastered, percentage, totalPractice };
    };

    const startRecording = () => {
      setIsRecording(true);
      setRecordingTime(0);
      // Aquí se implementaría la lógica de grabación real
    };

    const stopRecording = () => {
      setIsRecording(false);
      // Aquí se implementaría la lógica para detener la grabación
    };

    const playAudio = (audioUrl) => {
      // Aquí se implementaría la reproducción de audio
      console.log('Reproduciendo:', audioUrl);
    };

    const filteredExercises = getFilteredExercises();
    const stats = getPronunciationStats();

    return (
      <ScrollView style={styles.pronunciationContainer} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.pronunciationHeader}>
          <View style={styles.pronunciationHeaderContent}>
            <View style={styles.pronunciationHeaderIcon}>
              <Icon name="mic" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.pronunciationHeaderText}>
              <Text style={styles.pronunciationHeaderTitle}>Pronunciación</Text>
              <Text style={styles.pronunciationHeaderSubtitle}>
                Mejora tu pronunciación paso a paso
              </Text>
            </View>
          </View>
          <View style={styles.pronunciationHeaderBadge}>
            <Text style={styles.pronunciationHeaderCount}>{filteredExercises.length}</Text>
          </View>
        </View>

        {/* Selector de idiomas */}
        <View style={styles.pronunciationLanguageSelector}>
          <Text style={styles.pronunciationLanguageTitle}>Idioma de Estudio</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pronunciationLanguageScroll}>
            {pronunciationLanguages.map((language) => {
              const languageStats = getPronunciationStats();
              return (
                <TouchableOpacity
                  key={language.id}
                  style={[
                    styles.pronunciationLanguageCard,
                    selectedPronunciationLanguage === language.id && styles.pronunciationLanguageCardSelected,
                    { borderColor: language.color }
                  ]}
                  onPress={() => setSelectedPronunciationLanguage(language.id)}
                >
                  <View style={[styles.pronunciationLanguageIcon, { backgroundColor: language.color }]}>
                    <Text style={styles.pronunciationLanguageFlag}>{language.flag}</Text>
                  </View>
                  <Text style={styles.pronunciationLanguageName}>{language.name}</Text>
                  <View style={styles.pronunciationLanguageProgress}>
                    <View style={styles.pronunciationLanguageProgressBar}>
                      <View 
                        style={[
                          styles.pronunciationLanguageProgressFill,
                          { width: `${languageStats.percentage}%`, backgroundColor: language.color }
                        ]}
                      />
                    </View>
                    <Text style={styles.pronunciationLanguageProgressText}>
                      {languageStats.mastered}/{languageStats.total}
                    </Text>
                  </View>
        </TouchableOpacity>
              );
            })}
          </ScrollView>
      </View>
      
        {/* Barra de búsqueda y filtros */}
        <View style={styles.pronunciationFilters}>
          <View style={styles.pronunciationSearchContainer}>
            <Icon name="search" size={20} color="#6B7280" style={styles.pronunciationSearchIcon} />
            <TextInput
              style={styles.pronunciationSearchInput}
              placeholder="Buscar ejercicios de pronunciación..."
              placeholderTextColor="#9CA3AF"
              value={pronunciationSearchQuery}
              onChangeText={setPronunciationSearchQuery}
            />
            {pronunciationSearchQuery.length > 0 && (
              <TouchableOpacity 
                style={styles.pronunciationClearSearchButton}
                onPress={() => setPronunciationSearchQuery('')}
              >
                <Icon name="close-circle" size={20} color="#6B7280" />
              </TouchableOpacity>
            )}
      </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pronunciationCategoriesScroll}>
            {pronunciationCategories[selectedPronunciationLanguage]?.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.pronunciationCategoryChip,
                  selectedPronunciationCategory === category && styles.pronunciationCategoryChipSelected
                ]}
                onPress={() => setSelectedPronunciationCategory(category === 'Todas' ? 'all' : category)}
              >
                <Text style={[
                  styles.pronunciationCategoryChipText,
                  selectedPronunciationCategory === category && styles.pronunciationCategoryChipTextSelected
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
    </View>

        {/* Estadísticas */}
        <View style={styles.pronunciationStats}>
          <View style={styles.pronunciationStatCard}>
            <View style={styles.pronunciationStatIcon}>
              <Icon name="trophy" size={20} color="#4CAF50" />
            </View>
            <View style={styles.pronunciationStatContent}>
              <Text style={styles.pronunciationStatNumber}>{stats.mastered}</Text>
              <Text style={styles.pronunciationStatLabel}>Dominadas</Text>
            </View>
          </View>
          <View style={styles.pronunciationStatCard}>
            <View style={styles.pronunciationStatIcon}>
              <Icon name="mic" size={20} color="#2196F3" />
            </View>
            <View style={styles.pronunciationStatContent}>
              <Text style={styles.pronunciationStatNumber}>{stats.total}</Text>
              <Text style={styles.pronunciationStatLabel}>Ejercicios</Text>
            </View>
          </View>
          <View style={styles.pronunciationStatCard}>
            <View style={styles.pronunciationStatIcon}>
              <Icon name="play-circle" size={20} color="#FF9800" />
            </View>
            <View style={styles.pronunciationStatContent}>
              <Text style={styles.pronunciationStatNumber}>{stats.totalPractice}</Text>
              <Text style={styles.pronunciationStatLabel}>Prácticas</Text>
            </View>
          </View>
        </View>

        {/* Grabadora de voz */}
        <View style={styles.pronunciationRecorder}>
          <View style={styles.pronunciationRecorderHeader}>
            <Text style={styles.pronunciationRecorderTitle}>Grabadora de Voz</Text>
            <Text style={styles.pronunciationRecorderSubtitle}>
              Practica tu pronunciación grabándote
            </Text>
          </View>
          
          <View style={styles.pronunciationRecorderControls}>
            <TouchableOpacity 
              style={[
                styles.pronunciationRecordButton,
                isRecording && styles.pronunciationRecordButtonActive
              ]}
              onPress={isRecording ? stopRecording : startRecording}
            >
              <Icon 
                name={isRecording ? "stop" : "mic"} 
                size={32} 
                color="#FFFFFF" 
              />
            </TouchableOpacity>
            
            <View style={styles.pronunciationRecorderInfo}>
              <Text style={styles.pronunciationRecorderStatus}>
                {isRecording ? 'Grabando...' : 'Toca para grabar'}
              </Text>
              {isRecording && (
                <Text style={styles.pronunciationRecorderTime}>
                  {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Botones de acción */}
        <View style={styles.pronunciationActions}>
          <TouchableOpacity 
            style={styles.pronunciationAddButton}
            onPress={() => setShowAddPronunciationModal(true)}
          >
            <Icon name="add" size={20} color="#FFFFFF" />
            <Text style={styles.pronunciationAddButtonText}>Nuevo Ejercicio</Text>
          </TouchableOpacity>
        </View>

        {/* Lista de ejercicios de pronunciación */}
        <View style={styles.pronunciationExercisesList}>
          {filteredExercises.map((exercise) => (
            <View key={exercise.id} style={styles.pronunciationExerciseCard}>
              <View style={styles.pronunciationExerciseHeader}>
                <View style={styles.pronunciationExerciseTitleContainer}>
                  <Icon 
                    name={getCategoryIcon(exercise.category)} 
                    size={20} 
                    color={exercise.color} 
                    style={styles.pronunciationExerciseCategoryIcon}
                  />
                  <View style={styles.pronunciationExerciseTitleContent}>
                    <Text style={styles.pronunciationExerciseWord}>{exercise.word}</Text>
                    <Text style={styles.pronunciationExercisePhonetic}>{exercise.phonetic}</Text>
                  </View>
                </View>
                <View style={styles.pronunciationExerciseBadges}>
                  <View style={[styles.pronunciationExerciseDifficulty, { backgroundColor: getDifficultyColor(exercise.difficulty) }]}>
                    <Text style={styles.pronunciationExerciseDifficultyText}>{exercise.difficulty}</Text>
                  </View>
                  <View style={[styles.pronunciationExerciseLevel, { backgroundColor: getLevelColor(exercise.level) }]}>
                    <Text style={styles.pronunciationExerciseLevelText}>{exercise.level}</Text>
                  </View>
                </View>
              </View>

              <Text style={styles.pronunciationExerciseDescription}>{exercise.description}</Text>
              
              <View style={styles.pronunciationExerciseTips}>
                <Text style={styles.pronunciationExerciseTipsTitle}>💡 Consejo:</Text>
                <Text style={styles.pronunciationExerciseTipsText}>{exercise.tips}</Text>
              </View>

              <View style={styles.pronunciationExerciseControls}>
                <TouchableOpacity 
                  style={styles.pronunciationPlayButton}
                  onPress={() => playAudio(exercise.audioUrl)}
                >
                  <Icon name="play" size={20} color="#FFFFFF" />
                  <Text style={styles.pronunciationPlayButtonText}>Escuchar</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.pronunciationPracticeButton}
                  onPress={() => {
                    // Aquí se implementaría la práctica
                    console.log('Practicando:', exercise.word);
                  }}
                >
                  <Icon name="mic" size={20} color="#2196F3" />
                  <Text style={styles.pronunciationPracticeButtonText}>Practicar</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.pronunciationExerciseProgress}>
                <View style={styles.pronunciationExerciseProgressInfo}>
                  <Text style={styles.pronunciationExerciseProgressText}>
                    {exercise.mastered ? 'Dominada' : 'En práctica'} • {exercise.practiceCount} intentos
                  </Text>
                  <Text style={styles.pronunciationExerciseProgressDate}>
                    Última práctica: {exercise.lastPracticed}
                  </Text>
                </View>
                <View style={styles.pronunciationExerciseProgressBar}>
                  <View 
                    style={[
                      styles.pronunciationExerciseProgressFill,
                      { 
                        width: exercise.mastered ? '100%' : `${Math.min((exercise.practiceCount / 15) * 100, 90)}%`,
                        backgroundColor: exercise.mastered ? '#4CAF50' : exercise.color
                      }
                    ]}
                  />
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Modal para agregar nuevo ejercicio */}
        <Modal
          visible={showAddPronunciationModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowAddPronunciationModal(false)}
        >
          <View style={styles.pronunciationModalOverlay}>
            <View style={styles.pronunciationModalContent}>
              <View style={styles.pronunciationModalHeader}>
                <Text style={styles.pronunciationModalTitle}>Nuevo Ejercicio de Pronunciación</Text>
                <TouchableOpacity 
                  style={styles.pronunciationModalCloseButton}
                  onPress={() => setShowAddPronunciationModal(false)}
                >
                  <Icon name="close" size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.pronunciationModalBody}>
                <View style={styles.pronunciationModalField}>
                  <Text style={styles.pronunciationModalLabel}>Palabra</Text>
                  <TextInput
                    style={styles.pronunciationModalInput}
                    placeholder="Ej: Hello"
                    value={newPronunciationExercise.word}
                    onChangeText={(text) => setNewPronunciationExercise({...newPronunciationExercise, word: text})}
                  />
                </View>

                <View style={styles.pronunciationModalField}>
                  <Text style={styles.pronunciationModalLabel}>Fonética</Text>
                  <TextInput
                    style={styles.pronunciationModalInput}
                    placeholder="Ej: /həˈloʊ/"
                    value={newPronunciationExercise.phonetic}
                    onChangeText={(text) => setNewPronunciationExercise({...newPronunciationExercise, phonetic: text})}
                  />
                </View>

                <View style={styles.pronunciationModalField}>
                  <Text style={styles.pronunciationModalLabel}>Categoría</Text>
                  <TextInput
                    style={styles.pronunciationModalInput}
                    placeholder="Ej: Vocales"
                    value={newPronunciationExercise.category}
                    onChangeText={(text) => setNewPronunciationExercise({...newPronunciationExercise, category: text})}
                  />
                </View>

                <View style={styles.pronunciationModalField}>
                  <Text style={styles.pronunciationModalLabel}>Dificultad</Text>
                  <View style={styles.pronunciationModalDifficultySelector}>
                    {['Básico', 'Intermedio', 'Avanzado'].map((difficulty) => (
                      <TouchableOpacity
                        key={difficulty}
                        style={[
                          styles.pronunciationModalDifficultyOption,
                          newPronunciationExercise.difficulty === difficulty && styles.pronunciationModalDifficultyOptionSelected
                        ]}
                        onPress={() => setNewPronunciationExercise({...newPronunciationExercise, difficulty})}
                      >
                        <Text style={[
                          styles.pronunciationModalDifficultyText,
                          newPronunciationExercise.difficulty === difficulty && styles.pronunciationModalDifficultyTextSelected
                        ]}>
                          {difficulty}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </ScrollView>

              <View style={styles.pronunciationModalFooter}>
                <TouchableOpacity 
                  style={styles.pronunciationModalCancelButton}
                  onPress={() => setShowAddPronunciationModal(false)}
                >
                  <Text style={styles.pronunciationModalCancelText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.pronunciationModalSaveButton}
                  onPress={() => {
                    // Aquí se guardaría el ejercicio
                    setShowAddPronunciationModal(false);
                    setNewPronunciationExercise({
                      word: '',
                      phonetic: '',
                      category: '',
                      difficulty: 'Básico',
                      audioUrl: ''
                    });
                  }}
                >
                  <Text style={styles.pronunciationModalSaveText}>Guardar Ejercicio</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    );
  };

  const renderConversation = () => {
    // Idiomas disponibles para conversación
    const conversationLanguages = [
      { id: 'english', name: 'Inglés', flag: '🇺🇸', color: '#2196F3' },
      { id: 'spanish', name: 'Español', flag: '🇪🇸', color: '#E91E63' },
      { id: 'french', name: 'Francés', flag: '🇫🇷', color: '#4CAF50' },
      { id: 'german', name: 'Alemán', flag: '🇩🇪', color: '#FF9800' },
      { id: 'japanese', name: 'Japonés', flag: '🇯🇵', color: '#9C27B0' },
      { id: 'korean', name: 'Coreano', flag: '🇰🇷', color: '#F44336' },
      { id: 'chinese', name: 'Chino', flag: '🇨🇳', color: '#795548' }
    ];

    // Categorías de conversación por idioma
    const conversationCategories = {
      english: ['Todas', 'Saludos', 'Presentaciones', 'Compras', 'Restaurante', 'Viajes', 'Trabajo', 'Familia', 'Hobbies', 'Emergencias'],
      spanish: ['Todas', 'Saludos', 'Presentaciones', 'Compras', 'Restaurante', 'Viajes', 'Trabajo', 'Familia', 'Hobbies', 'Emergencias'],
      french: ['Todas', 'Salutations', 'Présentations', 'Achats', 'Restaurant', 'Voyages', 'Travail', 'Famille', 'Loisirs', 'Urgences'],
      german: ['Todas', 'Begrüßungen', 'Vorstellungen', 'Einkäufe', 'Restaurant', 'Reisen', 'Arbeit', 'Familie', 'Hobbys', 'Notfälle'],
      japanese: ['Todas', '挨拶', '自己紹介', '買い物', 'レストラン', '旅行', '仕事', '家族', '趣味', '緊急事態'],
      korean: ['Todas', '인사', '자기소개', '쇼핑', '레스토랑', '여행', '직장', '가족', '취미', '응급상황'],
      chinese: ['Todas', '问候', '自我介绍', '购物', '餐厅', '旅行', '工作', '家庭', '爱好', '紧急情况']
    };

    // Datos de ejemplo de conversaciones
    const conversationData = {
      english: [
        {
          id: 1,
          title: 'At the Restaurant',
          category: 'Restaurante',
          difficulty: 'Intermedio',
          level: 'B1',
          participants: 2,
          duration: '5 min',
          mastered: false,
          practiceCount: 3,
          lastPracticed: '2024-01-14',
          description: 'Ordering food and drinks at a restaurant',
          phrases: [
            { speaker: 'Waiter', text: 'Good evening! Do you have a reservation?', translation: '¡Buenas tardes! ¿Tienen una reserva?' },
            { speaker: 'Customer', text: 'No, we don\'t. Can we get a table for two?', translation: 'No, no tenemos. ¿Podemos conseguir una mesa para dos?' },
            { speaker: 'Waiter', text: 'Of course! Right this way, please.', translation: '¡Por supuesto! Por aquí, por favor.' },
            { speaker: 'Customer', text: 'Thank you. Could we see the menu?', translation: 'Gracias. ¿Podríamos ver el menú?' }
          ],
          color: '#2196F3'
        },
        {
          id: 2,
          title: 'Job Interview',
          category: 'Trabajo',
          difficulty: 'Avanzado',
          level: 'B2',
          participants: 2,
          duration: '15 min',
          mastered: true,
          practiceCount: 8,
          lastPracticed: '2024-01-13',
          description: 'Professional job interview conversation',
          phrases: [
            { speaker: 'Interviewer', text: 'Tell me about yourself.', translation: 'Cuéntame sobre ti.' },
            { speaker: 'Candidate', text: 'I have 5 years of experience in marketing...', translation: 'Tengo 5 años de experiencia en marketing...' },
            { speaker: 'Interviewer', text: 'What are your strengths?', translation: '¿Cuáles son tus fortalezas?' },
            { speaker: 'Candidate', text: 'I\'m a team player and very organized.', translation: 'Soy un jugador de equipo y muy organizado.' }
          ],
          color: '#4CAF50'
        },
        {
          id: 3,
          title: 'Shopping for Clothes',
          category: 'Compras',
          difficulty: 'Básico',
          level: 'A2',
          participants: 2,
          duration: '8 min',
          mastered: false,
          practiceCount: 5,
          lastPracticed: '2024-01-12',
          description: 'Buying clothes at a store',
          phrases: [
            { speaker: 'Customer', text: 'Excuse me, do you have this in size M?', translation: 'Disculpe, ¿tienen esto en talla M?' },
            { speaker: 'Salesperson', text: 'Let me check for you.', translation: 'Déjeme verificar por usted.' },
            { speaker: 'Customer', text: 'How much does it cost?', translation: '¿Cuánto cuesta?' },
            { speaker: 'Salesperson', text: 'It\'s $29.99. Would you like to try it on?', translation: 'Cuesta $29.99. ¿Le gustaría probárselo?' }
          ],
          color: '#FF9800'
        }
      ],
      spanish: [
        {
          id: 1,
          title: 'En el Restaurante',
          category: 'Restaurante',
          difficulty: 'Intermedio',
          level: 'B1',
          participants: 2,
          duration: '6 min',
          mastered: false,
          practiceCount: 4,
          lastPracticed: '2024-01-14',
          description: 'Pedir comida y bebidas en un restaurante',
          phrases: [
            { speaker: 'Camarero', text: '¡Buenas tardes! ¿Tienen una reserva?', translation: 'Good evening! Do you have a reservation?' },
            { speaker: 'Cliente', text: 'No, no tenemos. ¿Podemos conseguir una mesa para dos?', translation: 'No, we don\'t. Can we get a table for two?' }
          ],
          color: '#E91E63'
        }
      ]
    };

    // Funciones auxiliares
    const getDifficultyColor = (difficulty) => {
      switch (difficulty) {
        case 'Básico': return '#4CAF50';
        case 'Intermedio': return '#FF9800';
        case 'Avanzado': return '#F44336';
        default: return '#6B7280';
      }
    };

    const getLevelColor = (level) => {
      switch (level) {
        case 'A1': case 'A2': return '#4CAF50';
        case 'B1': case 'B2': return '#FF9800';
        case 'C1': case 'C2': return '#F44336';
        default: return '#6B7280';
      }
    };

    const getCategoryIcon = (category) => {
      switch (category) {
        case 'Saludos': case 'Salutations': case 'Begrüßungen': case '挨拶': case '인사': case '问候': return 'hand-left-outline';
        case 'Presentaciones': case 'Présentations': case 'Vorstellungen': case '自己紹介': case '자기소개': case '自我介绍': return 'person-outline';
        case 'Compras': case 'Achats': case 'Einkäufe': case '買い物': case '쇼핑': case '购物': return 'bag-outline';
        case 'Restaurante': case 'Restaurant': case '레스토랑': case '餐厅': return 'restaurant-outline';
        case 'Viajes': case 'Voyages': case 'Reisen': case '旅行': case '여행': case '旅行': return 'airplane-outline';
        case 'Trabajo': case 'Travail': case 'Arbeit': case '仕事': case '직장': case '工作': return 'briefcase-outline';
        case 'Familia': case 'Famille': case 'Familie': case '家族': case '가족': case '家庭': return 'people-outline';
        case 'Hobbies': case 'Loisirs': case 'Hobbys': case '趣味': case '취미': case '爱好': return 'heart-outline';
        case 'Emergencias': case 'Urgences': case 'Notfälle': case '緊急事態': case '응급상황': case '紧急情况': return 'warning-outline';
        default: return 'chatbubbles-outline';
      }
    };

    const getFilteredConversations = () => {
      let conversations = conversationData[selectedConversationLanguage] || [];
      
      if (selectedConversationCategory !== 'all') {
        conversations = conversations.filter(conversation => conversation.category === selectedConversationCategory);
      }
      
      if (conversationSearchQuery) {
        conversations = conversations.filter(conversation => 
          conversation.title.toLowerCase().includes(conversationSearchQuery.toLowerCase()) ||
          conversation.description.toLowerCase().includes(conversationSearchQuery.toLowerCase()) ||
          conversation.phrases.some(phrase => 
            phrase.text.toLowerCase().includes(conversationSearchQuery.toLowerCase()) ||
            phrase.translation.toLowerCase().includes(conversationSearchQuery.toLowerCase())
          )
        );
      }
      
      return conversations;
    };

    const getConversationStats = () => {
      const conversations = conversationData[selectedConversationLanguage] || [];
      const total = conversations.length;
      const mastered = conversations.filter(conversation => conversation.mastered).length;
      const percentage = total > 0 ? Math.round((mastered / total) * 100) : 0;
      const totalPractice = conversations.reduce((sum, conversation) => sum + conversation.practiceCount, 0);
      
      return { total, mastered, percentage, totalPractice };
    };

    const startConversation = (conversation) => {
      setSelectedConversation(conversation);
    };

    const closeConversation = () => {
      setSelectedConversation(null);
    };

    const filteredConversations = getFilteredConversations();
    const stats = getConversationStats();

    // Si hay una conversación seleccionada, mostrar el diálogo
    if (selectedConversation) {
      return (
        <View style={styles.conversationContainer}>
          {/* Header del diálogo */}
          <View style={styles.conversationDialogHeader}>
            <TouchableOpacity 
              style={styles.conversationBackButton}
              onPress={closeConversation}
            >
              <Icon name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.conversationDialogInfo}>
              <Text style={styles.conversationDialogTitle}>{selectedConversation.title}</Text>
              <Text style={styles.conversationDialogSubtitle}>
                {selectedConversation.category} • {selectedConversation.difficulty} • {selectedConversation.duration}
              </Text>
            </View>
            <TouchableOpacity style={styles.conversationPlayButton}>
              <Icon name="play" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
          {/* Descripción */}
          <View style={styles.conversationDescription}>
            <Text style={styles.conversationDescriptionText}>{selectedConversation.description}</Text>
          </View>

          {/* Diálogo */}
          <ScrollView style={styles.conversationDialog} showsVerticalScrollIndicator={false}>
            {selectedConversation.phrases.map((phrase, index) => (
              <View key={index} style={styles.conversationPhrase}>
                <View style={styles.conversationPhraseHeader}>
                  <View style={[
                    styles.conversationSpeakerBadge,
                    { backgroundColor: phrase.speaker === 'Customer' || phrase.speaker === 'Cliente' ? '#2196F3' : '#10B981' }
                  ]}>
                    <Text style={styles.conversationSpeakerText}>{phrase.speaker}</Text>
                  </View>
                </View>
                <View style={styles.conversationPhraseContent}>
                  <Text style={styles.conversationPhraseText}>{phrase.text}</Text>
                  <Text style={styles.conversationPhraseTranslation}>{phrase.translation}</Text>
                </View>
                <TouchableOpacity style={styles.conversationPhrasePlayButton}>
                  <Icon name="volume-high" size={20} color="#6B7280" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          {/* Controles del diálogo */}
          <View style={styles.conversationControls}>
            <TouchableOpacity style={styles.conversationControlButton}>
              <Icon name="refresh" size={20} color="#6B7280" />
              <Text style={styles.conversationControlText}>Repetir</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.conversationControlButton}>
              <Icon name="mic" size={20} color="#6B7280" />
              <Text style={styles.conversationControlText}>Practicar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.conversationControlButton}>
              <Icon name="bookmark" size={20} color="#6B7280" />
              <Text style={styles.conversationControlText}>Guardar</Text>
            </TouchableOpacity>
      </View>
    </View>
  );
    }

    return (
      <ScrollView style={styles.conversationContainer} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.conversationHeader}>
          <View style={styles.conversationHeaderContent}>
            <View style={styles.conversationHeaderIcon}>
              <Icon name="chatbubbles" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.conversationHeaderText}>
              <Text style={styles.conversationHeaderTitle}>Conversación</Text>
              <Text style={styles.conversationHeaderSubtitle}>
                Practica diálogos reales
              </Text>
            </View>
          </View>
          <View style={styles.conversationHeaderBadge}>
            <Text style={styles.conversationHeaderCount}>{filteredConversations.length}</Text>
          </View>
        </View>

        {/* Selector de idiomas */}
        <View style={styles.conversationLanguageSelector}>
          <Text style={styles.conversationLanguageTitle}>Idioma de Estudio</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.conversationLanguageScroll}>
            {conversationLanguages.map((language) => {
              const languageStats = getConversationStats();
              return (
                <TouchableOpacity
                  key={language.id}
                  style={[
                    styles.conversationLanguageCard,
                    selectedConversationLanguage === language.id && styles.conversationLanguageCardSelected,
                    { borderColor: language.color }
                  ]}
                  onPress={() => setSelectedConversationLanguage(language.id)}
                >
                  <View style={[styles.conversationLanguageIcon, { backgroundColor: language.color }]}>
                    <Text style={styles.conversationLanguageFlag}>{language.flag}</Text>
                  </View>
                  <Text style={styles.conversationLanguageName}>{language.name}</Text>
                  <View style={styles.conversationLanguageProgress}>
                    <View style={styles.conversationLanguageProgressBar}>
                      <View 
                        style={[
                          styles.conversationLanguageProgressFill,
                          { width: `${languageStats.percentage}%`, backgroundColor: language.color }
                        ]}
                      />
                    </View>
                    <Text style={styles.conversationLanguageProgressText}>
                      {languageStats.mastered}/{languageStats.total}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Barra de búsqueda y filtros */}
        <View style={styles.conversationFilters}>
          <View style={styles.conversationSearchContainer}>
            <Icon name="search" size={20} color="#6B7280" style={styles.conversationSearchIcon} />
            <TextInput
              style={styles.conversationSearchInput}
              placeholder="Buscar conversaciones..."
              placeholderTextColor="#9CA3AF"
              value={conversationSearchQuery}
              onChangeText={setConversationSearchQuery}
            />
            {conversationSearchQuery.length > 0 && (
              <TouchableOpacity 
                style={styles.conversationClearSearchButton}
                onPress={() => setConversationSearchQuery('')}
              >
                <Icon name="close-circle" size={20} color="#6B7280" />
              </TouchableOpacity>
            )}
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.conversationCategoriesScroll}>
            {conversationCategories[selectedConversationLanguage]?.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.conversationCategoryChip,
                  selectedConversationCategory === category && styles.conversationCategoryChipSelected
                ]}
                onPress={() => setSelectedConversationCategory(category === 'Todas' ? 'all' : category)}
              >
                <Text style={[
                  styles.conversationCategoryChipText,
                  selectedConversationCategory === category && styles.conversationCategoryChipTextSelected
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Estadísticas */}
        <View style={styles.conversationStats}>
          <View style={styles.conversationStatCard}>
            <View style={styles.conversationStatIcon}>
              <Icon name="trophy" size={20} color="#4CAF50" />
            </View>
            <View style={styles.conversationStatContent}>
              <Text style={styles.conversationStatNumber}>{stats.mastered}</Text>
              <Text style={styles.conversationStatLabel}>Dominadas</Text>
            </View>
          </View>
          <View style={styles.conversationStatCard}>
            <View style={styles.conversationStatIcon}>
              <Icon name="chatbubbles" size={20} color="#2196F3" />
            </View>
            <View style={styles.conversationStatContent}>
              <Text style={styles.conversationStatNumber}>{stats.total}</Text>
              <Text style={styles.conversationStatLabel}>Diálogos</Text>
            </View>
          </View>
          <View style={styles.conversationStatCard}>
            <View style={styles.conversationStatIcon}>
              <Icon name="play-circle" size={20} color="#FF9800" />
            </View>
            <View style={styles.conversationStatContent}>
              <Text style={styles.conversationStatNumber}>{stats.totalPractice}</Text>
              <Text style={styles.conversationStatLabel}>Prácticas</Text>
            </View>
          </View>
        </View>

        {/* Botones de acción */}
        <View style={styles.conversationActions}>
          <TouchableOpacity 
            style={styles.conversationAddButton}
            onPress={() => setShowAddConversationModal(true)}
          >
            <Icon name="add" size={20} color="#FFFFFF" />
            <Text style={styles.conversationAddButtonText}>Nuevo Diálogo</Text>
          </TouchableOpacity>
        </View>

        {/* Lista de conversaciones */}
        <View style={styles.conversationList}>
          {filteredConversations.map((conversation) => (
            <TouchableOpacity 
              key={conversation.id} 
              style={styles.conversationCard}
              onPress={() => startConversation(conversation)}
            >
              <View style={styles.conversationCardHeader}>
                <View style={styles.conversationCardTitleContainer}>
                  <Icon 
                    name={getCategoryIcon(conversation.category)} 
                    size={20} 
                    color={conversation.color} 
                    style={styles.conversationCardCategoryIcon}
                  />
                  <View style={styles.conversationCardTitleContent}>
                    <Text style={styles.conversationCardTitle}>{conversation.title}</Text>
                    <Text style={styles.conversationCardDescription}>{conversation.description}</Text>
                  </View>
                </View>
                <View style={styles.conversationCardBadges}>
                  <View style={[styles.conversationCardDifficulty, { backgroundColor: getDifficultyColor(conversation.difficulty) }]}>
                    <Text style={styles.conversationCardDifficultyText}>{conversation.difficulty}</Text>
                  </View>
                  <View style={[styles.conversationCardLevel, { backgroundColor: getLevelColor(conversation.level) }]}>
                    <Text style={styles.conversationCardLevelText}>{conversation.level}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.conversationCardInfo}>
                <View style={styles.conversationCardInfoItem}>
                  <Icon name="people" size={16} color="#6B7280" />
                  <Text style={styles.conversationCardInfoText}>{conversation.participants} personas</Text>
                </View>
                <View style={styles.conversationCardInfoItem}>
                  <Icon name="time" size={16} color="#6B7280" />
                  <Text style={styles.conversationCardInfoText}>{conversation.duration}</Text>
                </View>
                <View style={styles.conversationCardInfoItem}>
                  <Icon name="chatbubble" size={16} color="#6B7280" />
                  <Text style={styles.conversationCardInfoText}>{conversation.phrases.length} frases</Text>
                </View>
              </View>

              <View style={styles.conversationCardFooter}>
                <View style={styles.conversationCardProgress}>
                  <Text style={styles.conversationCardProgressText}>
                    {conversation.mastered ? 'Dominada' : 'En práctica'} • {conversation.practiceCount} intentos
                  </Text>
                  <Text style={styles.conversationCardProgressDate}>
                    Última práctica: {conversation.lastPracticed}
                  </Text>
                </View>
                <View style={styles.conversationCardProgressBar}>
                  <View 
                    style={[
                      styles.conversationCardProgressFill,
                      { 
                        width: conversation.mastered ? '100%' : `${Math.min((conversation.practiceCount / 10) * 100, 90)}%`,
                        backgroundColor: conversation.mastered ? '#4CAF50' : conversation.color
                      }
                    ]}
                  />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Modal para agregar nueva conversación */}
        <Modal
          visible={showAddConversationModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowAddConversationModal(false)}
        >
          <View style={styles.conversationModalOverlay}>
            <View style={styles.conversationModalContent}>
              <View style={styles.conversationModalHeader}>
                <Text style={styles.conversationModalTitle}>Nuevo Diálogo</Text>
                <TouchableOpacity 
                  style={styles.conversationModalCloseButton}
                  onPress={() => setShowAddConversationModal(false)}
                >
                  <Icon name="close" size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.conversationModalBody}>
                <View style={styles.conversationModalField}>
                  <Text style={styles.conversationModalLabel}>Título</Text>
                  <TextInput
                    style={styles.conversationModalInput}
                    placeholder="Ej: At the Restaurant"
                    value={newConversation.title}
                    onChangeText={(text) => setNewConversation({...newConversation, title: text})}
                  />
                </View>

                <View style={styles.conversationModalField}>
                  <Text style={styles.conversationModalLabel}>Categoría</Text>
                  <TextInput
                    style={styles.conversationModalInput}
                    placeholder="Ej: Restaurante"
                    value={newConversation.category}
                    onChangeText={(text) => setNewConversation({...newConversation, category: text})}
                  />
                </View>

                <View style={styles.conversationModalField}>
                  <Text style={styles.conversationModalLabel}>Dificultad</Text>
                  <View style={styles.conversationModalDifficultySelector}>
                    {['Básico', 'Intermedio', 'Avanzado'].map((difficulty) => (
                      <TouchableOpacity
                        key={difficulty}
                        style={[
                          styles.conversationModalDifficultyOption,
                          newConversation.difficulty === difficulty && styles.conversationModalDifficultyOptionSelected
                        ]}
                        onPress={() => setNewConversation({...newConversation, difficulty})}
                      >
                        <Text style={[
                          styles.conversationModalDifficultyText,
                          newConversation.difficulty === difficulty && styles.conversationModalDifficultyTextSelected
                        ]}>
                          {difficulty}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.conversationModalField}>
                  <Text style={styles.conversationModalLabel}>Participantes</Text>
                  <View style={styles.conversationModalParticipantsSelector}>
                    {[2, 3, 4, 5].map((count) => (
                      <TouchableOpacity
                        key={count}
                        style={[
                          styles.conversationModalParticipantOption,
                          newConversation.participants === count && styles.conversationModalParticipantOptionSelected
                        ]}
                        onPress={() => setNewConversation({...newConversation, participants: count})}
                      >
                        <Text style={[
                          styles.conversationModalParticipantText,
                          newConversation.participants === count && styles.conversationModalParticipantTextSelected
                        ]}>
                          {count}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.conversationModalField}>
                  <Text style={styles.conversationModalLabel}>Descripción</Text>
                  <TextInput
                    style={[styles.conversationModalInput, styles.conversationModalTextArea]}
                    placeholder="Describe el contexto del diálogo..."
                    multiline
                    numberOfLines={3}
                    value={newConversation.description}
                    onChangeText={(text) => setNewConversation({...newConversation, description: text})}
                  />
                </View>
              </ScrollView>

              <View style={styles.conversationModalFooter}>
                <TouchableOpacity 
                  style={styles.conversationModalCancelButton}
                  onPress={() => setShowAddConversationModal(false)}
                >
                  <Text style={styles.conversationModalCancelText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.conversationModalSaveButton}
                  onPress={() => {
                    // Aquí se guardaría la conversación
                    setShowAddConversationModal(false);
                    setNewConversation({
                      title: '',
                      category: '',
                      difficulty: 'Básico',
                      participants: 2,
                      description: '',
                      phrases: []
                    });
                  }}
                >
                  <Text style={styles.conversationModalSaveText}>Guardar Diálogo</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      {/* Navegación de pestañas */}
      {renderSectionTabs()}

      {/* Contenido de la sección activa */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderActiveSection()}
      </ScrollView>

      {/* Modal para agregar vocabulario */}
      <Modal
        visible={showAddVocabularyModal}
        animationType="slide"
        transparent={true}
        onRequestClose={closeAddVocabularyModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Agregar Vocabulario</Text>
              <TouchableOpacity onPress={closeAddVocabularyModal}>
                <Icon name="close" size={24} color="#6c757d" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Palabra</Text>
                <TextInput
                  style={styles.textInput}
                  value={newVocabulary.word}
                  onChangeText={(text) => setNewVocabulary({...newVocabulary, word: text})}
                  placeholder="Ingresa la palabra"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Fonética</Text>
                <TextInput
                  style={styles.textInput}
                  value={newVocabulary.phonetics}
                  onChangeText={(text) => setNewVocabulary({...newVocabulary, phonetics: text})}
                  placeholder="Pronunciación"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Significado</Text>
                <TextInput
                  style={styles.textInput}
                  value={newVocabulary.meaning}
                  onChangeText={(text) => setNewVocabulary({...newVocabulary, meaning: text})}
                  placeholder="Traducción o significado"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Ejemplo</Text>
                <TextInput
                  style={[styles.textInput, styles.multilineInput]}
                  value={newVocabulary.example}
                  onChangeText={(text) => setNewVocabulary({...newVocabulary, example: text})}
                  placeholder="Oración de ejemplo"
                  multiline
                  numberOfLines={3}
                />
              </View>
            </View>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity onPress={closeAddVocabularyModal} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={saveVocabulary} style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal para agregar práctica */}
      <Modal
        visible={showAddPracticeModal}
        animationType="slide"
        transparent={true}
        onRequestClose={closeAddPracticeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nueva Práctica</Text>
              <TouchableOpacity onPress={closeAddPracticeModal}>
                <Icon name="close" size={24} color="#6c757d" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Fecha</Text>
                <TextInput
                  style={styles.textInput}
                  value={newPractice.date}
                  onChangeText={(text) => setNewPractice({...newPractice, date: text})}
                  placeholder="YYYY-MM-DD"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Contenido de Práctica</Text>
                <TextInput
                  style={[styles.textInput, styles.multilineInput]}
                  value={newPractice.content}
                  onChangeText={(text) => setNewPractice({...newPractice, content: text})}
                  placeholder="Describe qué vas a practicar"
                  multiline
                  numberOfLines={4}
                />
              </View>
            </View>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity onPress={closeAddPracticeModal} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={savePractice} style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    backgroundColor: '#FFEAA7',
    borderColor: '#FFEAA7',
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
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
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
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFEAA7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Estilos mejorados para vocabulario
  vocabularyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#06B6D4',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#06B6D4',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  vocabularyHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  vocabularyHeaderIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  vocabularyHeaderText: {
    flex: 1,
  },
  vocabularyHeaderTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  vocabularyHeaderSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 18,
  },
  vocabularyHeaderBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  vocabularyHeaderCount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  vocabularyStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 12,
  },
  vocabularyStatCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  vocabularyStatIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  vocabularyStatContent: {
    alignItems: 'center',
  },
  vocabularyStatValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 2,
  },
  vocabularyStatLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  vocabularyProgressContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  vocabularyProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  vocabularyProgressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  vocabularyProgressValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#06B6D4',
  },
  vocabularyProgressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  vocabularyProgressFill: {
    height: '100%',
    backgroundColor: '#06B6D4',
    borderRadius: 4,
  },
  vocabularyAddButton: {
    backgroundColor: '#06B6D4',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#06B6D4',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  vocabularyAddButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  vocabularyFilters: {
    marginBottom: 20,
  },
  vocabularyFilterTitle: {
    marginBottom: 12,
  },
  vocabularyFilterTitleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  vocabularyFilterSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  vocabularyFilterScroll: {
    paddingHorizontal: 0,
  },
  vocabularyFilterChip: {
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  vocabularyFilterChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  vocabularyList: {
    marginBottom: 20,
  },
  vocabularyEmptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  vocabularyEmptyIcon: {
    marginBottom: 20,
  },
  vocabularyEmptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6B7280',
    marginBottom: 8,
    textAlign: 'center',
  },
  vocabularyEmptySubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
  },
  vocabularyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  vocabularyCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  vocabularyCardInfo: {
    flex: 1,
  },
  vocabularyCardTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  vocabularyCardWordContainer: {
    flex: 1,
  },
  vocabularyCardWord: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  vocabularyCardPhonetics: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  vocabularyCardBadges: {
    flexDirection: 'row',
    gap: 8,
  },
  vocabularyLevelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  vocabularyLevelText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  vocabularyDifficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  vocabularyDifficultyText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  vocabularyCardMeaning: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 8,
    fontWeight: '500',
  },
  vocabularyCardCategory: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vocabularyCardCategoryText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 6,
    fontWeight: '500',
  },
  vocabularyCardActions: {
    flexDirection: 'row',
    gap: 8,
  },
  vocabularyEditButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  vocabularyDeleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  vocabularyCardExample: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F0F9FF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#06B6D4',
  },
  vocabularyExampleIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  vocabularyExampleText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  vocabularyCardStudyInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  vocabularyStudyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  vocabularyStudyText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 6,
    fontWeight: '500',
  },
  vocabularyCardProgress: {
    marginBottom: 16,
  },
  vocabularyCardProgressBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  vocabularyCardProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  vocabularyCardProgressText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    fontWeight: '500',
  },
  vocabularyCardFooter: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 16,
  },
  vocabularyStudyActions: {
    flexDirection: 'row',
    gap: 8,
  },
  vocabularyStudyButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  vocabularyStudyButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 4,
  },
  vocabularyTable: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#FFEAA7',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    paddingVertical: 12,
  },
  headerCell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2d4150',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    paddingVertical: 12,
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    color: '#495057',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6c757d',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#adb5bd',
    marginTop: 4,
  },
  simpleVocabularyList: {
    marginTop: 20,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d4150',
    marginBottom: 12,
  },
  vocabularyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  checkbox: {
    marginRight: 12,
  },
  vocabularyContent: {
    flex: 1,
  },
  vocabularyWord: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2d4150',
  },
  vocabularyTranslation: {
    fontSize: 12,
    color: '#6c757d',
    marginTop: 2,
  },
  // Estilos mejorados para vocabulario con idiomas
  languageSelectorContainer: {
    marginBottom: 20,
  },
  languageSelectorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  languageSelectorScroll: {
    paddingHorizontal: 0,
  },
  languageCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    width: 120,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  languageCardSelected: {
    borderWidth: 3,
    shadowOpacity: 0.2,
    elevation: 6,
  },
  languageIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  languageFlag: {
    fontSize: 20,
  },
  languageName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  languageProgress: {
    width: '100%',
  },
  languageProgressBar: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    marginBottom: 4,
  },
  languageProgressFill: {
    height: '100%',
    borderRadius: 2,
  },
  languageProgressText: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
    fontWeight: '600',
  },
  vocabularyFilters: {
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  clearSearchButton: {
    marginLeft: 8,
  },
  categoriesScroll: {
    paddingHorizontal: 0,
  },
  categoryChip: {
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoryChipSelected: {
    backgroundColor: '#06B6D4',
    borderColor: '#06B6D4',
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  categoryChipTextSelected: {
    color: '#FFFFFF',
  },
  vocabularyActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  studyModeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#9C27B0',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    shadowColor: '#9C27B0',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  studyModeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  vocabularyTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  vocabularyTag: {
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  vocabularyTagText: {
    fontSize: 12,
    color: '#0369A1',
    fontWeight: '500',
  },
  vocabularyCardDetails: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  vocabularyCardMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  vocabularyCategoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vocabularyCategory: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
    fontWeight: '500',
  },
  vocabularyDifficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  vocabularyDifficultyText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  vocabularyProgressContainer: {
    marginBottom: 12,
  },
  vocabularyProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  vocabularyProgressLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  vocabularyProgressValue: {
    fontSize: 12,
    color: '#1F2937',
    fontWeight: '600',
  },
  vocabularyProgressBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    marginBottom: 4,
  },
  vocabularyProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  vocabularyLastStudied: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  vocabularyMasteryContainer: {
    alignItems: 'flex-end',
  },
  vocabularyMasteryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  vocabularyMasteryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  vocabularyQuickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  vocabularyQuickAction: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
  },
  vocabularyQuickActionText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
    fontWeight: '500',
  },
  // Estilos mejorados para práctica de escritura
  writingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#06B6D4',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#06B6D4',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  writingHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  writingHeaderIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  writingHeaderText: {
    flex: 1,
  },
  writingHeaderTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  writingHeaderSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 18,
  },
  writingHeaderBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  writingHeaderCount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  writingSystemsContainer: {
    marginBottom: 20,
  },
  writingSystemsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  writingSystemsScroll: {
    paddingHorizontal: 0,
  },
  writingSystemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginRight: 16,
    width: 160,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  writingSystemCardSelected: {
    borderWidth: 3,
    shadowOpacity: 0.2,
    elevation: 6,
  },
  writingSystemIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  writingSystemEmoji: {
    fontSize: 24,
  },
  writingSystemName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
    textAlign: 'center',
  },
  writingSystemDescription: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 12,
    textAlign: 'center',
  },
  writingSystemProgress: {
    width: '100%',
  },
  writingSystemProgressBar: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    marginBottom: 8,
  },
  writingSystemProgressFill: {
    height: '100%',
    borderRadius: 2,
  },
  writingSystemProgressText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    fontWeight: '600',
  },
  writingCanvasContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  canvasHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  canvasTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  canvasActions: {
    flexDirection: 'row',
    gap: 12,
  },
  clearButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  canvasArea: {
    flex: 1,
  },
  characterGuide: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  characterGuideText: {
    fontSize: 24,
    color: '#1F2937',
    textAlign: 'center',
    fontWeight: '600',
  },
  canvas: {
    height: 300,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    position: 'relative',
  },
  stroke: {
    position: 'absolute',
  },
  strokePoint: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#06B6D4',
  },
  writingTemplatesContainer: {
    marginBottom: 20,
  },
  writingTemplatesHeader: {
    marginBottom: 16,
  },
  writingTemplatesTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  writingTemplatesSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  writingTemplatesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  writingTemplateCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  writingTemplateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  writingTemplateName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  writingTemplateDifficulty: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  writingTemplateDifficultyText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  writingTemplateCharacters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  writingTemplateCharacter: {
    fontSize: 20,
    color: '#1F2937',
    fontWeight: '600',
  },
  writingTemplateFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  writingTemplateActionText: {
    fontSize: 14,
    color: '#06B6D4',
    fontWeight: '600',
    marginLeft: 6,
  },
  writingStatsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  writingStatsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  writingStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  writingStatCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  writingStatIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  writingStatContent: {
    flex: 1,
  },
  writingStatValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 2,
  },
  writingStatLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  writingHistoryContainer: {
    marginBottom: 20,
  },
  writingHistoryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  writingHistoryScroll: {
    paddingHorizontal: 0,
  },
  writingHistoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    width: 200,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  writingHistoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  writingHistorySystem: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  writingHistoryStatus: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  writingHistoryStatusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  writingHistoryTemplate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  writingHistoryAccuracy: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  writingHistoryDate: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  practiceContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
  },
  practiceDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2d4150',
    marginBottom: 16,
  },
  practiceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  gridSquare: {
    width: '9%',
    aspectRatio: 1,
    borderWidth: 1,
    borderColor: '#e9ecef',
    backgroundColor: '#ffffff',
    marginBottom: 2,
    position: 'relative',
  },
  gridLines: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  horizontalLine: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#f0f0f0',
  },
  verticalLine: {
    position: 'absolute',
    left: '50%',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: '#f0f0f0',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d4150',
  },
  modalBody: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2d4150',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#495057',
    backgroundColor: '#ffffff',
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    marginRight: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6c757d',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 8,
    borderRadius: 8,
    backgroundColor: '#FFEAA7',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2d4150',
  },

  // Estilos para Notas de Gramática
  grammarContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  grammarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  grammarHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  grammarHeaderIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  grammarHeaderText: {
    flex: 1,
  },
  grammarHeaderTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 4,
  },
  grammarHeaderSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  grammarHeaderBadge: {
    backgroundColor: '#8B5CF6',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginLeft: 12,
  },
  grammarHeaderCount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Selector de idiomas para gramática
  grammarLanguageSelector: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  grammarLanguageTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  grammarLanguageScroll: {
    paddingHorizontal: 0,
  },
  grammarLanguageCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    width: 120,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  grammarLanguageCardSelected: {
    borderWidth: 3,
    shadowOpacity: 0.2,
    elevation: 6,
  },
  grammarLanguageIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  grammarLanguageFlag: {
    fontSize: 20,
  },
  grammarLanguageName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  grammarLanguageProgress: {
    width: '100%',
  },
  grammarLanguageProgressBar: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    marginBottom: 4,
  },
  grammarLanguageProgressFill: {
    height: '100%',
    borderRadius: 2,
  },
  grammarLanguageProgressText: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
    fontWeight: '600',
  },

  // Filtros para gramática
  grammarFilters: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  grammarSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  grammarSearchIcon: {
    marginRight: 12,
  },
  grammarSearchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    paddingVertical: 12,
  },
  grammarClearSearchButton: {
    padding: 4,
  },
  grammarCategoriesScroll: {
    paddingHorizontal: 0,
  },
  grammarCategoryChip: {
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  grammarCategoryChipSelected: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  grammarCategoryChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  grammarCategoryChipTextSelected: {
    color: '#FFFFFF',
  },

  // Estadísticas de gramática
  grammarStats: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  grammarStatCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
  },
  grammarStatIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  grammarStatContent: {
    flex: 1,
  },
  grammarStatNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 2,
  },
  grammarStatLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },

  // Acciones de gramática
  grammarActions: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  grammarAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B5CF6',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    shadowColor: '#8B5CF6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  grammarAddButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 8,
  },

  // Lista de notas de gramática
  grammarNotesList: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  grammarNoteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  grammarNoteHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  grammarNoteTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  grammarNoteCategoryIcon: {
    marginRight: 12,
  },
  grammarNoteTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    flex: 1,
  },
  grammarNoteBadges: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  grammarNoteDifficulty: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
  },
  grammarNoteDifficultyText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  grammarNoteLevel: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  grammarNoteLevelText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  grammarNoteContent: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
    marginBottom: 16,
  },
  grammarNoteExamples: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  grammarNoteExamplesTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  grammarNoteExample: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 4,
  },
  grammarNoteFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  grammarNoteTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
  },
  grammarNoteTag: {
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 4,
  },
  grammarNoteTagText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  grammarNoteActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  grammarNoteActionButton: {
    padding: 8,
    marginLeft: 4,
  },
  grammarNoteProgress: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 16,
  },
  grammarNoteProgressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  grammarNoteProgressText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  grammarNoteProgressDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  grammarNoteProgressBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
  },
  grammarNoteProgressFill: {
    height: '100%',
    borderRadius: 3,
  },

  // Modal de gramática
  grammarModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  grammarModalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  grammarModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  grammarModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  grammarModalCloseButton: {
    padding: 4,
  },
  grammarModalBody: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  grammarModalField: {
    marginBottom: 20,
  },
  grammarModalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  grammarModalInput: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  grammarModalTextArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  grammarModalDifficultySelector: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 4,
  },
  grammarModalDifficultyOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  grammarModalDifficultyOptionSelected: {
    backgroundColor: '#8B5CF6',
  },
  grammarModalDifficultyText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  grammarModalDifficultyTextSelected: {
    color: '#FFFFFF',
  },
  grammarModalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  grammarModalCancelButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingVertical: 16,
    marginRight: 12,
    alignItems: 'center',
  },
  grammarModalCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  grammarModalSaveButton: {
    flex: 1,
    backgroundColor: '#8B5CF6',
    borderRadius: 12,
    paddingVertical: 16,
    marginLeft: 12,
    alignItems: 'center',
  },
  grammarModalSaveText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // Estilos para Pronunciación
  pronunciationContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  pronunciationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  pronunciationHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  pronunciationHeaderIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F59E0B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  pronunciationHeaderText: {
    flex: 1,
  },
  pronunciationHeaderTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 4,
  },
  pronunciationHeaderSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  pronunciationHeaderBadge: {
    backgroundColor: '#F59E0B',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginLeft: 12,
  },
  pronunciationHeaderCount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Selector de idiomas para pronunciación
  pronunciationLanguageSelector: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  pronunciationLanguageTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  pronunciationLanguageScroll: {
    paddingHorizontal: 0,
  },
  pronunciationLanguageCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    width: 120,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pronunciationLanguageCardSelected: {
    borderWidth: 3,
    shadowOpacity: 0.2,
    elevation: 6,
  },
  pronunciationLanguageIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  pronunciationLanguageFlag: {
    fontSize: 20,
  },
  pronunciationLanguageName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  pronunciationLanguageProgress: {
    width: '100%',
  },
  pronunciationLanguageProgressBar: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    marginBottom: 4,
  },
  pronunciationLanguageProgressFill: {
    height: '100%',
    borderRadius: 2,
  },
  pronunciationLanguageProgressText: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
    fontWeight: '600',
  },

  // Filtros para pronunciación
  pronunciationFilters: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  pronunciationSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  pronunciationSearchIcon: {
    marginRight: 12,
  },
  pronunciationSearchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    paddingVertical: 12,
  },
  pronunciationClearSearchButton: {
    padding: 4,
  },
  pronunciationCategoriesScroll: {
    paddingHorizontal: 0,
  },
  pronunciationCategoryChip: {
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  pronunciationCategoryChipSelected: {
    backgroundColor: '#F59E0B',
    borderColor: '#F59E0B',
  },
  pronunciationCategoryChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  pronunciationCategoryChipTextSelected: {
    color: '#FFFFFF',
  },

  // Estadísticas de pronunciación
  pronunciationStats: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  pronunciationStatCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
  },
  pronunciationStatIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  pronunciationStatContent: {
    flex: 1,
  },
  pronunciationStatNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 2,
  },
  pronunciationStatLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },

  // Grabadora de voz
  pronunciationRecorder: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  pronunciationRecorderHeader: {
    marginBottom: 20,
  },
  pronunciationRecorderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  pronunciationRecorderSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  pronunciationRecorderControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pronunciationRecordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F59E0B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
    shadowColor: '#F59E0B',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  pronunciationRecordButtonActive: {
    backgroundColor: '#EF4444',
    shadowColor: '#EF4444',
  },
  pronunciationRecorderInfo: {
    flex: 1,
  },
  pronunciationRecorderStatus: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  pronunciationRecorderTime: {
    fontSize: 24,
    fontWeight: '700',
    color: '#F59E0B',
  },

  // Acciones de pronunciación
  pronunciationActions: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  pronunciationAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F59E0B',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    shadowColor: '#F59E0B',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  pronunciationAddButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 8,
  },

  // Lista de ejercicios de pronunciación
  pronunciationExercisesList: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  pronunciationExerciseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  pronunciationExerciseHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  pronunciationExerciseTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  pronunciationExerciseCategoryIcon: {
    marginRight: 12,
  },
  pronunciationExerciseTitleContent: {
    flex: 1,
  },
  pronunciationExerciseWord: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  pronunciationExercisePhonetic: {
    fontSize: 16,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  pronunciationExerciseBadges: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pronunciationExerciseDifficulty: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
  },
  pronunciationExerciseDifficultyText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  pronunciationExerciseLevel: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  pronunciationExerciseLevelText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  pronunciationExerciseDescription: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
    marginBottom: 16,
  },
  pronunciationExerciseTips: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  pronunciationExerciseTipsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#92400E',
    marginBottom: 4,
  },
  pronunciationExerciseTipsText: {
    fontSize: 14,
    color: '#92400E',
    lineHeight: 20,
  },
  pronunciationExerciseControls: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  pronunciationPlayButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 12,
    marginRight: 8,
  },
  pronunciationPlayButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  pronunciationPracticeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingVertical: 12,
    marginLeft: 8,
    borderWidth: 2,
    borderColor: '#2196F3',
  },
  pronunciationPracticeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2196F3',
    marginLeft: 8,
  },
  pronunciationExerciseProgress: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 16,
  },
  pronunciationExerciseProgressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  pronunciationExerciseProgressText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  pronunciationExerciseProgressDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  pronunciationExerciseProgressBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
  },
  pronunciationExerciseProgressFill: {
    height: '100%',
    borderRadius: 3,
  },

  // Modal de pronunciación
  pronunciationModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  pronunciationModalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  pronunciationModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  pronunciationModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  pronunciationModalCloseButton: {
    padding: 4,
  },
  pronunciationModalBody: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  pronunciationModalField: {
    marginBottom: 20,
  },
  pronunciationModalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  pronunciationModalInput: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  pronunciationModalDifficultySelector: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 4,
  },
  pronunciationModalDifficultyOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  pronunciationModalDifficultyOptionSelected: {
    backgroundColor: '#F59E0B',
  },
  pronunciationModalDifficultyText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  pronunciationModalDifficultyTextSelected: {
    color: '#FFFFFF',
  },
  pronunciationModalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  pronunciationModalCancelButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingVertical: 16,
    marginRight: 12,
    alignItems: 'center',
  },
  pronunciationModalCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  pronunciationModalSaveButton: {
    flex: 1,
    backgroundColor: '#F59E0B',
    borderRadius: 12,
    paddingVertical: 16,
    marginLeft: 12,
    alignItems: 'center',
  },
  pronunciationModalSaveText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // Estilos para Conversación
  conversationContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  conversationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  conversationHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  conversationHeaderIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EC4899',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  conversationHeaderText: {
    flex: 1,
  },
  conversationHeaderTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 4,
  },
  conversationHeaderSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  conversationHeaderBadge: {
    backgroundColor: '#EC4899',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginLeft: 12,
  },
  conversationHeaderCount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Selector de idiomas para conversación
  conversationLanguageSelector: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  conversationLanguageTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  conversationLanguageScroll: {
    paddingHorizontal: 0,
  },
  conversationLanguageCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    width: 120,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  conversationLanguageCardSelected: {
    borderWidth: 3,
    shadowOpacity: 0.2,
    elevation: 6,
  },
  conversationLanguageIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  conversationLanguageFlag: {
    fontSize: 20,
  },
  conversationLanguageName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  conversationLanguageProgress: {
    width: '100%',
  },
  conversationLanguageProgressBar: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    marginBottom: 4,
  },
  conversationLanguageProgressFill: {
    height: '100%',
    borderRadius: 2,
  },
  conversationLanguageProgressText: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
    fontWeight: '600',
  },

  // Filtros para conversación
  conversationFilters: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  conversationSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  conversationSearchIcon: {
    marginRight: 12,
  },
  conversationSearchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    paddingVertical: 12,
  },
  conversationClearSearchButton: {
    padding: 4,
  },
  conversationCategoriesScroll: {
    paddingHorizontal: 0,
  },
  conversationCategoryChip: {
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  conversationCategoryChipSelected: {
    backgroundColor: '#EC4899',
    borderColor: '#EC4899',
  },
  conversationCategoryChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  conversationCategoryChipTextSelected: {
    color: '#FFFFFF',
  },

  // Estadísticas de conversación
  conversationStats: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  conversationStatCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
  },
  conversationStatIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  conversationStatContent: {
    flex: 1,
  },
  conversationStatNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 2,
  },
  conversationStatLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },

  // Acciones de conversación
  conversationActions: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  conversationAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EC4899',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    shadowColor: '#EC4899',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  conversationAddButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 8,
  },

  // Lista de conversaciones
  conversationList: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  conversationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  conversationCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  conversationCardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  conversationCardCategoryIcon: {
    marginRight: 12,
  },
  conversationCardTitleContent: {
    flex: 1,
  },
  conversationCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  conversationCardDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  conversationCardBadges: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  conversationCardDifficulty: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
  },
  conversationCardDifficultyText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  conversationCardLevel: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  conversationCardLevelText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  conversationCardInfo: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  conversationCardInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  conversationCardInfoText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
    fontWeight: '600',
  },
  conversationCardFooter: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 16,
  },
  conversationCardProgress: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  conversationCardProgressText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  conversationCardProgressDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  conversationCardProgressBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
  },
  conversationCardProgressFill: {
    height: '100%',
    borderRadius: 3,
  },

  // Vista del diálogo
  conversationDialogHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EC4899',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  conversationBackButton: {
    padding: 8,
    marginRight: 12,
  },
  conversationDialogInfo: {
    flex: 1,
  },
  conversationDialogTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  conversationDialogSubtitle: {
    fontSize: 14,
    color: '#F3E8FF',
  },
  conversationPlayButton: {
    padding: 8,
  },
  conversationDescription: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  conversationDescriptionText: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
  },
  conversationDialog: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  conversationPhrase: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  conversationPhraseHeader: {
    marginRight: 12,
  },
  conversationSpeakerBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  conversationSpeakerText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  conversationPhraseContent: {
    flex: 1,
  },
  conversationPhraseText: {
    fontSize: 16,
    color: '#1F2937',
    lineHeight: 24,
    marginBottom: 4,
  },
  conversationPhraseTranslation: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  conversationPhrasePlayButton: {
    padding: 8,
    marginLeft: 8,
  },
  conversationControls: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  conversationControlButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  conversationControlText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
    fontWeight: '600',
  },

  // Modal de conversación
  conversationModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  conversationModalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  conversationModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  conversationModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  conversationModalCloseButton: {
    padding: 4,
  },
  conversationModalBody: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  conversationModalField: {
    marginBottom: 20,
  },
  conversationModalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  conversationModalInput: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  conversationModalTextArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  conversationModalDifficultySelector: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 4,
  },
  conversationModalDifficultyOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  conversationModalDifficultyOptionSelected: {
    backgroundColor: '#EC4899',
  },
  conversationModalDifficultyText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  conversationModalDifficultyTextSelected: {
    color: '#FFFFFF',
  },
  conversationModalParticipantsSelector: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 4,
  },
  conversationModalParticipantOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  conversationModalParticipantOptionSelected: {
    backgroundColor: '#EC4899',
  },
  conversationModalParticipantText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  conversationModalParticipantTextSelected: {
    color: '#FFFFFF',
  },
  conversationModalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  conversationModalCancelButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingVertical: 16,
    marginRight: 12,
    alignItems: 'center',
  },
  conversationModalCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  conversationModalSaveButton: {
    flex: 1,
    backgroundColor: '#EC4899',
    borderRadius: 12,
    paddingVertical: 16,
    marginLeft: 12,
    alignItems: 'center',
  },
  conversationModalSaveText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default LanguageSections;
