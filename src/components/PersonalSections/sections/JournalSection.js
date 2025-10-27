import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { SectionHeader, Button, Card } from '../../shared';
import { useTheme } from '../../shared/hooks/useTheme';
import { journalSectionStyles } from '../styles/journalSectionStyles';

const JournalSection = ({ 
  selectedDate, 
  onDateSelect, 
  user,
  theme 
}) => {
  const { getThemeColors } = useTheme();
  const themeColors = getThemeColors();

  const [showAddEntryModal, setShowAddEntryModal] = useState(false);
  const [newEntryData, setNewEntryData] = useState({
    title: '',
    content: '',
    mood: 'neutral',
    tags: [],
    isPrivate: false,
  });

  // Datos de ejemplo para el diario
  const [journalEntries] = useState([
    {
      id: '1',
      title: 'Día productivo',
      content: 'Hoy fue un día muy productivo. Completé todas las tareas pendientes y me siento satisfecho con el progreso.',
      mood: 'happy',
      tags: ['productividad', 'satisfacción'],
      date: selectedDate,
      isPrivate: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Reflexiones del día',
      content: 'Me di cuenta de que necesito ser más organizado con mi tiempo. Voy a implementar una nueva rutina.',
      mood: 'thoughtful',
      tags: ['reflexión', 'mejora'],
      date: selectedDate,
      isPrivate: true,
      createdAt: new Date().toISOString(),
    },
  ]);

  const handleAddEntry = () => {
    if (newEntryData.title.trim() === '') {
      Alert.alert('Error', 'Por favor ingresa un título para la entrada');
      return;
    }

    if (newEntryData.content.trim() === '') {
      Alert.alert('Error', 'Por favor ingresa el contenido de la entrada');
      return;
    }

    const entry = {
      id: Date.now().toString(),
      title: newEntryData.title.trim(),
      content: newEntryData.content.trim(),
      mood: newEntryData.mood,
      tags: newEntryData.tags,
      isPrivate: newEntryData.isPrivate,
      date: selectedDate,
      userId: user?.id,
      createdAt: new Date().toISOString(),
    };

    // TODO: Implementar guardado de entrada
    console.log('Nueva entrada del diario:', entry);
    setNewEntryData({
      title: '',
      content: '',
      mood: 'neutral',
      tags: [],
      isPrivate: false,
    });
    setShowAddEntryModal(false);
    Alert.alert('Éxito', 'Entrada del diario guardada correctamente');
  };

  const getMoodIcon = (mood) => {
    const icons = {
      happy: 'happy-outline',
      sad: 'sad-outline',
      angry: 'flame-outline',
      excited: 'flash-outline',
      calm: 'leaf-outline',
      thoughtful: 'bulb-outline',
      neutral: 'ellipse-outline',
    };
    return icons[mood] || 'ellipse-outline';
  };

  const getMoodColor = (mood) => {
    const colors = {
      happy: '#4ECDC4',
      sad: '#6C7CE7',
      angry: '#FF6B6B',
      excited: '#FFD93D',
      calm: '#96CEB4',
      thoughtful: '#DDA0DD',
      neutral: '#A8A8A8',
    };
    return colors[mood] || '#A8A8A8';
  };

  const getMoodText = (mood) => {
    const texts = {
      happy: 'Feliz',
      sad: 'Triste',
      angry: 'Enojado',
      excited: 'Emocionado',
      calm: 'Tranquilo',
      thoughtful: 'Pensativo',
      neutral: 'Neutral',
    };
    return texts[mood] || 'Neutral';
  };

  const todayEntries = journalEntries.filter(entry => entry.date === selectedDate);
  const recentEntries = journalEntries.slice(0, 3);

  return (
    <View style={journalSectionStyles.container}>
      <SectionHeader
        title="Mi Diario"
        subtitle="Reflexiona sobre tu día"
        image={require('../../../../android/app/src/main/assets/mascota.png')}
        onAddPress={() => setShowAddEntryModal(true)}
        theme={theme}
        size="medium"
      />

      {/* Resumen del diario */}
      <View style={journalSectionStyles.summaryContainer}>
        <View style={[journalSectionStyles.summaryCard, journalSectionStyles.todayCard]}>
          <View style={[journalSectionStyles.cardIconContainer, { backgroundColor: 'rgba(26, 61, 10, 0.15)' }]}>
            <Icon name="today-outline" size={20} color="#1A3D0A" />
          </View>
          <Text style={[journalSectionStyles.cardTitle, { color: '#1A3D0A' }]}>Entradas</Text>
          <Text style={[journalSectionStyles.cardNumber, { color: '#1A3D0A' }]}>{todayEntries.length}</Text>
          <Text style={[journalSectionStyles.cardSubtitle, { color: '#1A3D0A' }]}>entradas</Text>
        </View>
        
        <View style={[journalSectionStyles.summaryCard, journalSectionStyles.totalCard]}>
          <View style={[journalSectionStyles.cardIconContainer, { backgroundColor: 'rgba(93, 46, 10, 0.15)' }]}>
            <Icon name="book-outline" size={20} color="#5D2E0A" />
          </View>
          <Text style={[journalSectionStyles.cardTitle, { color: '#5D2E0A' }]}>Total</Text>
          <Text style={[journalSectionStyles.cardNumber, { color: '#5D2E0A' }]}>{journalEntries.length}</Text>
          <Text style={[journalSectionStyles.cardSubtitle, { color: '#5D2E0A' }]}>entradas</Text>
        </View>
        
        <View style={[journalSectionStyles.summaryCard, journalSectionStyles.statusCard]}>
          <View style={[journalSectionStyles.cardIconContainer, { backgroundColor: 'rgba(34, 197, 94, 0.15)' }]}>
            <Icon name="checkmark-circle-outline" size={20} color="#16A34A" />
          </View>
          <Text style={[journalSectionStyles.cardTitle, { color: '#15803D' }]}>Estado</Text>
          <Text style={[journalSectionStyles.cardNumber, { color: '#15803D' }]}>Activo</Text>
          <Text style={[journalSectionStyles.cardSubtitle, { color: '#15803D' }]}>diario</Text>
        </View>
      </View>

      {/* Entradas de hoy */}
      {todayEntries.length > 0 && (
        <View style={journalSectionStyles.sectionContainer}>
          <Text style={[journalSectionStyles.sectionTitle, { color: themeColors.text }]}>
            Entradas de Hoy
          </Text>
          <View style={journalSectionStyles.entriesList}>
            {todayEntries.map((entry) => (
              <Card
                key={entry.id}
                title={entry.title}
                subtitle={entry.content.length > 100 ? `${entry.content.substring(0, 100)}...` : entry.content}
                icon={getMoodIcon(entry.mood)}
                theme={theme}
                size="medium"
                style={[
                  journalSectionStyles.entryCard,
                  { borderLeftColor: getMoodColor(entry.mood) }
                ]}
              >
                <View style={journalSectionStyles.entryInfo}>
                  <View style={journalSectionStyles.moodContainer}>
                    <Icon 
                      name={getMoodIcon(entry.mood)} 
                      size={16} 
                      color={getMoodColor(entry.mood)} 
                    />
                    <Text style={[journalSectionStyles.moodText, { color: getMoodColor(entry.mood) }]}>
                      {getMoodText(entry.mood)}
                    </Text>
                  </View>
                  {entry.tags.length > 0 && (
                    <View style={journalSectionStyles.tagsContainer}>
                      {entry.tags.slice(0, 2).map((tag, index) => (
                        <View key={index} style={journalSectionStyles.tag}>
                          <Text style={journalSectionStyles.tagText}>#{tag}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                  {entry.isPrivate && (
                    <Icon name="lock-closed-outline" size={16} color="#6B7280" />
                  )}
                </View>
              </Card>
            ))}
          </View>
        </View>
      )}

      {/* Entradas recientes */}
      {recentEntries.length > 0 && (
        <View style={journalSectionStyles.sectionContainer}>
          <Text style={[journalSectionStyles.sectionTitle, { color: themeColors.text }]}>
            Entradas Recientes
          </Text>
          <View style={journalSectionStyles.entriesList}>
            {recentEntries.map((entry) => (
              <Card
                key={entry.id}
                title={entry.title}
                subtitle={entry.content.length > 80 ? `${entry.content.substring(0, 80)}...` : entry.content}
                icon={getMoodIcon(entry.mood)}
                theme={theme}
                size="small"
                style={[
                  journalSectionStyles.entryCard,
                  { borderLeftColor: getMoodColor(entry.mood) }
                ]}
              />
            ))}
          </View>
        </View>
      )}

      {/* Sin entradas */}
      {journalEntries.length === 0 && (
        <Card
          title="No hay entradas"
          subtitle="Comienza a escribir en tu diario personal"
          icon="add-circle-outline"
          theme={theme}
          size="medium"
        >
          <Button
            title="Escribir Primera Entrada"
            onPress={() => setShowAddEntryModal(true)}
            variant="primary"
            size="medium"
            theme={theme}
            icon="add"
          />
        </Card>
      )}

      {/* Modal para agregar entrada */}
      <Modal
        visible={showAddEntryModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddEntryModal(false)}
      >
        <View style={journalSectionStyles.modalOverlay}>
          <View style={journalSectionStyles.modalContainer}>
            <View style={journalSectionStyles.modalHeader}>
              <Text style={journalSectionStyles.modalTitle}>
                Nueva Entrada del Diario
              </Text>
              <TouchableOpacity
                onPress={() => setShowAddEntryModal(false)}
                style={journalSectionStyles.closeButton}
              >
                <Icon name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={journalSectionStyles.modalContent}>
              <View style={journalSectionStyles.inputGroup}>
                <Text style={journalSectionStyles.inputLabel}>Título</Text>
                <TextInput
                  style={journalSectionStyles.textInput}
                  value={newEntryData.title}
                  onChangeText={(text) => setNewEntryData(prev => ({ ...prev, title: text }))}
                  placeholder="¿Cómo fue tu día?"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={journalSectionStyles.inputGroup}>
                <Text style={journalSectionStyles.inputLabel}>Contenido</Text>
                <TextInput
                  style={[journalSectionStyles.textInput, journalSectionStyles.textArea]}
                  value={newEntryData.content}
                  onChangeText={(text) => setNewEntryData(prev => ({ ...prev, content: text }))}
                  placeholder="Escribe sobre tu día, tus pensamientos, experiencias..."
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={6}
                />
              </View>

              <View style={journalSectionStyles.inputGroup}>
                <Text style={journalSectionStyles.inputLabel}>Estado de Ánimo</Text>
                <View style={journalSectionStyles.moodContainer}>
                  {['happy', 'sad', 'angry', 'excited', 'calm', 'thoughtful', 'neutral'].map((mood) => (
                    <TouchableOpacity
                      key={mood}
                      style={[
                        journalSectionStyles.moodButton,
                        newEntryData.mood === mood && journalSectionStyles.moodButtonSelected
                      ]}
                      onPress={() => setNewEntryData(prev => ({ ...prev, mood }))}
                    >
                      <Icon 
                        name={getMoodIcon(mood)} 
                        size={20} 
                        color={newEntryData.mood === mood ? '#FFFFFF' : getMoodColor(mood)} 
                      />
                      <Text style={[
                        journalSectionStyles.moodButtonText,
                        newEntryData.mood === mood && journalSectionStyles.moodButtonTextSelected
                      ]}>
                        {getMoodText(mood)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={journalSectionStyles.inputGroup}>
                <Text style={journalSectionStyles.inputLabel}>Etiquetas</Text>
                <TextInput
                  style={journalSectionStyles.textInput}
                  value={newEntryData.tags.join(', ')}
                  onChangeText={(text) => setNewEntryData(prev => ({ 
                    ...prev, 
                    tags: text.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
                  }))}
                  placeholder="productividad, reflexión, familia (separadas por comas)"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={journalSectionStyles.inputGroup}>
                <View style={journalSectionStyles.privateContainer}>
                  <TouchableOpacity
                    style={journalSectionStyles.privateButton}
                    onPress={() => setNewEntryData(prev => ({ ...prev, isPrivate: !prev.isPrivate }))}
                  >
                    <Icon 
                      name={newEntryData.isPrivate ? "checkmark-circle" : "ellipse-outline"} 
                      size={20} 
                      color={newEntryData.isPrivate ? themeColors.primary : "#6B7280"} 
                    />
                    <Text style={[journalSectionStyles.privateText, { color: themeColors.text }]}>
                      Entrada privada
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>

            <View style={journalSectionStyles.modalActions}>
              <Button
                title="Cancelar"
                onPress={() => setShowAddEntryModal(false)}
                variant="outline"
                size="medium"
                theme={theme}
                style={journalSectionStyles.modalButton}
              />
              <Button
                title="Guardar"
                onPress={handleAddEntry}
                variant="primary"
                size="medium"
                theme={theme}
                style={journalSectionStyles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default JournalSection;
