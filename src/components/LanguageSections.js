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

  const renderVocabulary = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>ESTUDIO DE VOCABULARIO</Text>
        <TouchableOpacity onPress={openAddVocabularyModal} style={styles.addButton}>
          <Icon name="add" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Tabla de vocabulario principal */}
      <View style={styles.vocabularyTable}>
        <View style={styles.tableHeader}>
          <Text style={styles.headerCell}>PALABRA</Text>
          <Text style={styles.headerCell}>FONÉTICA</Text>
          <Text style={styles.headerCell}>SIGNIFICADO</Text>
        </View>
        
        {vocabularyLists.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="book-outline" size={48} color="#E0E0E0" />
            <Text style={styles.emptyText}>No hay vocabulario agregado</Text>
            <Text style={styles.emptySubtext}>Toca el botón + para agregar palabras</Text>
          </View>
        ) : (
          vocabularyLists.map((item, index) => (
            <View key={item.id} style={styles.tableRow}>
              <Text style={styles.cell}>{item.word}</Text>
              <Text style={styles.cell}>{item.phonetics}</Text>
              <Text style={styles.cell}>{item.meaning}</Text>
            </View>
          ))
        )}
      </View>

      {/* Lista de vocabulario simple */}
      <View style={styles.simpleVocabularyList}>
        <Text style={styles.subsectionTitle}>Lista de Vocabulario</Text>
        {vocabularyLists.map((item, index) => (
          <View key={`simple-${item.id}`} style={styles.vocabularyItem}>
            <View style={styles.checkbox}>
              <Icon name="square-outline" size={20} color="#E0E0E0" />
            </View>
            <View style={styles.vocabularyContent}>
              <Text style={styles.vocabularyWord}>{item.word}</Text>
              <Text style={styles.vocabularyTranslation}>{item.meaning}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderWritingPractice = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>PRÁCTICA DE ESCRITURA</Text>
        <TouchableOpacity onPress={openAddPracticeModal} style={styles.addButton}>
          <Icon name="add" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.practiceContainer}>
        <Text style={styles.practiceDate}>Fecha: {new Date().toLocaleDateString('es-ES')}</Text>
        
        {/* Grilla de práctica */}
        <View style={styles.practiceGrid}>
          {Array.from({length: 60}, (_, index) => (
            <View key={index} style={styles.gridSquare}>
              <View style={styles.gridLines}>
                <View style={styles.horizontalLine} />
                <View style={styles.verticalLine} />
              </View>
            </View>
          ))}
        </View>

        {/* Segunda grilla */}
        <View style={styles.practiceGrid}>
          {Array.from({length: 30}, (_, index) => (
            <View key={`second-${index}`} style={styles.gridSquare}>
              <View style={styles.gridLines}>
                <View style={styles.horizontalLine} />
                <View style={styles.verticalLine} />
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  const renderGrammarNotes = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>NOTAS DE GRAMÁTICA</Text>
        <TouchableOpacity style={styles.addButton}>
          <Icon name="add" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.emptyState}>
        <Icon name="document-text-outline" size={48} color="#E0E0E0" />
        <Text style={styles.emptyText}>Próximamente</Text>
        <Text style={styles.emptySubtext}>Notas de gramática en desarrollo</Text>
      </View>
    </View>
  );

  const renderPronunciation = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>PRONUNCIACIÓN</Text>
        <TouchableOpacity style={styles.addButton}>
          <Icon name="add" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.emptyState}>
        <Icon name="mic-outline" size={48} color="#E0E0E0" />
        <Text style={styles.emptyText}>Próximamente</Text>
        <Text style={styles.emptySubtext}>Ejercicios de pronunciación en desarrollo</Text>
      </View>
    </View>
  );

  const renderConversation = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>CONVERSACIÓN</Text>
        <TouchableOpacity style={styles.addButton}>
          <Icon name="add" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.emptyState}>
        <Icon name="chatbubbles-outline" size={48} color="#E0E0E0" />
        <Text style={styles.emptyText}>Próximamente</Text>
        <Text style={styles.emptySubtext}>Diálogos y conversaciones en desarrollo</Text>
      </View>
    </View>
  );

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
});

export default LanguageSections;
