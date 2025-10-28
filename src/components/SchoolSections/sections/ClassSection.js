import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  Alert,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { SectionHeader } from '../../shared';
import { useTheme } from '../../shared/hooks/useTheme';
import { classSectionStyles } from '../styles/classSectionStyles';

const ClassSection = ({ user, theme }) => {
  const { getThemeColors } = useTheme();
  const themeColors = getThemeColors();

  // Validar que user existe
  if (!user) {
    return (
      <View style={classSectionStyles.container}>
        <Text style={[classSectionStyles.text, { color: themeColors.text }]}>
          Cargando datos del usuario...
        </Text>
      </View>
    );
  }

  // Estados para los resúmenes de clase
  const [classSummaries, setClassSummaries] = useState([
    {
      id: 1,
      title: 'Resumen de Matemáticas - Derivadas',
      subject: 'Matemáticas',
      date: '2024-02-10',
      professor: 'Dr. García',
      content: 'Conceptos fundamentales de derivadas, reglas de derivación y aplicaciones en problemas de optimización.',
      driveLink: 'https://drive.google.com/file/d/1ABC123/view',
      attachments: [
        { name: 'Ejercicios Derivadas.pdf', type: 'pdf', link: 'https://drive.google.com/file/d/1ABC123/view' },
        { name: 'Presentación Clase.pptx', type: 'presentation', link: 'https://drive.google.com/file/d/1DEF456/view' }
      ],
      tags: ['derivadas', 'cálculo', 'optimización'],
      status: 'completado',
      priority: 'high'
    },
    {
      id: 2,
      title: 'Notas de Física - Termodinámica',
      subject: 'Física',
      date: '2024-02-08',
      professor: 'Dra. Martínez',
      content: 'Primera y segunda ley de la termodinámica, procesos termodinámicos y ciclos de Carnot.',
      driveLink: 'https://drive.google.com/file/d/2GHI789/view',
      attachments: [
        { name: 'Diagramas Termodinámicos.pdf', type: 'pdf', link: 'https://drive.google.com/file/d/2GHI789/view' }
      ],
      tags: ['termodinámica', 'física', 'energía'],
      status: 'en_progreso',
      priority: 'medium'
    },
    {
      id: 3,
      title: 'Resumen de Literatura - Romanticismo',
      subject: 'Literatura',
      date: '2024-02-05',
      professor: 'Dra. Rodríguez',
      content: 'Características del movimiento romántico, autores principales y obras representativas del siglo XIX.',
      driveLink: 'https://drive.google.com/file/d/3JKL012/view',
      attachments: [
        { name: 'Antología Romántica.pdf', type: 'pdf', link: 'https://drive.google.com/file/d/3JKL012/view' },
        { name: 'Análisis de Obras.docx', type: 'document', link: 'https://drive.google.com/file/d/3MNO345/view' }
      ],
      tags: ['romanticismo', 'literatura', 'siglo XIX'],
      status: 'completado',
      priority: 'low'
    },
    {
      id: 4,
      title: 'Apuntes de Química - Química Orgánica',
      subject: 'Química',
      date: '2024-02-12',
      professor: 'Prof. López',
      content: 'Grupos funcionales, nomenclatura de compuestos orgánicos y reacciones básicas.',
      driveLink: 'https://drive.google.com/file/d/4PQR678/view',
      attachments: [
        { name: 'Tabla Grupos Funcionales.pdf', type: 'pdf', link: 'https://drive.google.com/file/d/4PQR678/view' },
        { name: 'Ejercicios Nomenclatura.pdf', type: 'pdf', link: 'https://drive.google.com/file/d/4STU901/view' }
      ],
      tags: ['química orgánica', 'grupos funcionales', 'nomenclatura'],
      status: 'en_progreso',
      priority: 'high'
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newSummary, setNewSummary] = useState({
    title: '',
    subject: '',
    date: '',
    professor: '',
    content: '',
    driveLink: '',
    attachments: '',
    tags: '',
    priority: 'medium'
  });

  const subjects = ['Matemáticas', 'Física', 'Química', 'Literatura', 'Historia', 'Biología', 'Inglés', 'Filosofía'];
  const priorities = [
    { value: 'high', label: 'Alta', color: '#EF4444' },
    { value: 'medium', label: 'Media', color: '#F59E0B' },
    { value: 'low', label: 'Baja', color: '#10B981' }
  ];
  const statusOptions = [
    { value: 'en_progreso', label: 'En Progreso', color: '#3B82F6' },
    { value: 'completado', label: 'Completado', color: '#10B981' },
    { value: 'revisar', label: 'Revisar', color: '#F59E0B' },
    { value: 'archivado', label: 'Archivado', color: '#6B7280' }
  ];

  const getTotalSummaries = () => classSummaries.length;
  const getCompletedSummaries = () => classSummaries.filter(summary => summary.status === 'completado').length;
  const getInProgressSummaries = () => classSummaries.filter(summary => summary.status === 'en_progreso').length;
  const getHighPrioritySummaries = () => classSummaries.filter(summary => summary.priority === 'high').length;

  const addSummary = () => {
    if (!newSummary.title || !newSummary.subject || !newSummary.date) {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios');
      return;
    }

    const summaryData = {
      ...newSummary,
      id: Date.now(),
      attachments: newSummary.attachments.split(',').map(att => {
        const parts = att.trim().split('|');
        return {
          name: parts[0] || '',
          type: parts[1] || 'file',
          link: parts[2] || ''
        };
      }).filter(att => att.name),
      tags: newSummary.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      status: 'en_progreso'
    };

    setClassSummaries(prev => [...prev, summaryData]);
    setNewSummary({
      title: '',
      subject: '',
      date: '',
      professor: '',
      content: '',
      driveLink: '',
      attachments: '',
      tags: '',
      priority: 'medium'
    });
    setShowAddModal(false);
    Alert.alert('Éxito', 'Resumen de clase agregado correctamente');
  };

  const deleteSummary = (summaryId) => {
    Alert.alert(
      'Eliminar Resumen',
      '¿Estás seguro de que quieres eliminar este resumen?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: () => {
            setClassSummaries(prev => prev.filter(summary => summary.id !== summaryId));
          }
        }
      ]
    );
  };

  const openDriveLink = async (url) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'No se puede abrir este enlace');
      }
    } catch (error) {
      Alert.alert('Error', 'Error al abrir el enlace');
    }
  };

  const getPriorityColor = (priority) => {
    const priorityObj = priorities.find(p => p.value === priority);
    return priorityObj ? priorityObj.color : '#6B7280';
  };

  const getPriorityLabel = (priority) => {
    const priorityObj = priorities.find(p => p.value === priority);
    return priorityObj ? priorityObj.label : 'Media';
  };

  const getStatusColor = (status) => {
    const statusObj = statusOptions.find(s => s.value === status);
    return statusObj ? statusObj.color : '#6B7280';
  };

  const getStatusLabel = (status) => {
    const statusObj = statusOptions.find(s => s.value === status);
    return statusObj ? statusObj.label : 'En Progreso';
  };

  const getFileTypeIcon = (type) => {
    switch (type) {
      case 'pdf': return 'document-text-outline';
      case 'presentation': return 'easel-outline';
      case 'document': return 'document-outline';
      case 'spreadsheet': return 'grid-outline';
      case 'image': return 'image-outline';
      case 'video': return 'videocam-outline';
      default: return 'document-outline';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const renderSummaries = () => {
    const totalSummaries = getTotalSummaries();
    const completedSummaries = getCompletedSummaries();
    const inProgressSummaries = getInProgressSummaries();
    const highPrioritySummaries = getHighPrioritySummaries();

    return (
      <View>
        {/* Header mejorado */}
        <View style={classSectionStyles.summariesHeader}>
          <View style={classSectionStyles.summariesHeaderContent}>
            <View style={classSectionStyles.summariesIconContainer}>
              <Icon name="book-outline" size={24} color="#FFFFFF" />
            </View>
            <View style={classSectionStyles.summariesHeaderText}>
              <Text style={classSectionStyles.summariesHeaderTitle}>
                Resúmenes de Clase
              </Text>
              <Text style={classSectionStyles.summariesHeaderSubtitle}>
                Organiza tus notas y archivos de estudio
              </Text>
            </View>
          </View>
          <View style={classSectionStyles.summariesHeaderBadge}>
            <Icon name="cloud-outline" size={16} color="#1E3A8A" />
          </View>
        </View>

        {/* Resumen de resúmenes mejorado */}
        <View style={classSectionStyles.summariesSummary}>
          <View style={classSectionStyles.summaryCard}>
            <View style={classSectionStyles.summaryIconContainer}>
              <Icon name="book-outline" size={20} color="#3B82F6" />
            </View>
            <View style={classSectionStyles.summaryContent}>
              <Text style={classSectionStyles.summaryValue}>{totalSummaries}</Text>
              <Text style={classSectionStyles.summaryLabel}>Total</Text>
            </View>
          </View>
          <View style={classSectionStyles.summaryCard}>
            <View style={classSectionStyles.summaryIconContainer}>
              <Icon name="checkmark-circle-outline" size={20} color="#10B981" />
            </View>
            <View style={classSectionStyles.summaryContent}>
              <Text style={classSectionStyles.summaryValue}>{completedSummaries}</Text>
              <Text style={classSectionStyles.summaryLabel}>Completados</Text>
            </View>
          </View>
          <View style={classSectionStyles.summaryCard}>
            <View style={classSectionStyles.summaryIconContainer}>
              <Icon name="create-outline" size={20} color="#3B82F6" />
            </View>
            <View style={classSectionStyles.summaryContent}>
              <Text style={classSectionStyles.summaryValue}>{inProgressSummaries}</Text>
              <Text style={classSectionStyles.summaryLabel}>En Progreso</Text>
            </View>
          </View>
          <View style={classSectionStyles.summaryCard}>
            <View style={classSectionStyles.summaryIconContainer}>
              <Icon name="alert-circle-outline" size={20} color="#EF4444" />
            </View>
            <View style={classSectionStyles.summaryContent}>
              <Text style={classSectionStyles.summaryValue}>{highPrioritySummaries}</Text>
              <Text style={classSectionStyles.summaryLabel}>Importantes</Text>
            </View>
          </View>
        </View>

        {/* Botón para agregar resumen */}
        <View style={classSectionStyles.addSummaryContainer}>
          <TouchableOpacity 
            style={classSectionStyles.addSummaryButton}
            onPress={() => setShowAddModal(true)}
          >
            <Icon name="add-circle-outline" size={20} color="#FFFFFF" />
            <Text style={classSectionStyles.addSummaryText}>Nuevo Resumen de Clase</Text>
          </TouchableOpacity>
        </View>

        {/* Lista de resúmenes mejorada */}
        <View style={classSectionStyles.summariesContainer}>
          <View style={classSectionStyles.summariesListHeader}>
            <Text style={classSectionStyles.summariesListTitle}>Mis Resúmenes</Text>
            <TouchableOpacity style={classSectionStyles.filterButton}>
              <Icon name="filter-outline" size={16} color="#1E3A8A" />
              <Text style={classSectionStyles.filterText}>Filtrar</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={classSectionStyles.summariesBody} showsVerticalScrollIndicator={false}>
            {classSummaries.length === 0 ? (
              <View style={classSectionStyles.emptyState}>
                <Icon name="book-outline" size={48} color="#9CA3AF" />
                <Text style={classSectionStyles.emptyTitle}>No hay resúmenes de clase</Text>
                <Text style={classSectionStyles.emptySubtitle}>Crea tu primer resumen para comenzar a organizar tus notas</Text>
                <TouchableOpacity 
                  style={classSectionStyles.emptyButton}
                  onPress={() => setShowAddModal(true)}
                >
                  <Icon name="add-outline" size={20} color="#1E3A8A" />
                  <Text style={classSectionStyles.emptyButtonText}>Crear Primer Resumen</Text>
                </TouchableOpacity>
              </View>
            ) : (
              classSummaries.map((summary) => {
                const priorityColor = getPriorityColor(summary.priority);
                const statusColor = getStatusColor(summary.status);
                
                return (
                  <View key={summary.id} style={classSectionStyles.summaryItem}>
                    <View style={classSectionStyles.summaryItemHeader}>
                      <View style={classSectionStyles.summaryItemInfo}>
                        <View style={classSectionStyles.summaryContent}>
                          <Text style={classSectionStyles.summaryTitle}>
                            {summary.title}
                          </Text>
                          <Text style={classSectionStyles.summaryDescription}>
                            {summary.content}
                          </Text>
                          
                          <View style={classSectionStyles.summaryMeta}>
                            <View style={classSectionStyles.summaryMetaItem}>
                              <Icon name="book-outline" size={14} color="#6B7280" />
                              <Text style={classSectionStyles.summaryMetaText}>{summary.subject}</Text>
                            </View>
                            <View style={classSectionStyles.summaryMetaItem}>
                              <Icon name="calendar-outline" size={14} color="#6B7280" />
                              <Text style={classSectionStyles.summaryMetaText}>{formatDate(summary.date)}</Text>
                            </View>
                            <View style={classSectionStyles.summaryMetaItem}>
                              <Icon name="person-outline" size={14} color="#6B7280" />
                              <Text style={classSectionStyles.summaryMetaText}>{summary.professor}</Text>
                            </View>
                          </View>
                        </View>
                      </View>
                      
                      <View style={classSectionStyles.summaryItemActions}>
                        <TouchableOpacity
                          onPress={() => deleteSummary(summary.id)}
                          style={classSectionStyles.summaryActionButton}
                        >
                          <Icon name="trash-outline" size={16} color="#EF4444" />
                        </TouchableOpacity>
                      </View>
                    </View>
                    
                    {/* Información adicional */}
                    <View style={classSectionStyles.summaryItemDetails}>
                      <View style={classSectionStyles.summaryPriority}>
                        <View style={[
                          classSectionStyles.priorityIndicator,
                          { backgroundColor: priorityColor }
                        ]} />
                        <Text style={[
                          classSectionStyles.priorityText,
                          { color: priorityColor }
                        ]}>
                          {getPriorityLabel(summary.priority)}
                        </Text>
                      </View>
                      
                      <View style={classSectionStyles.summaryStatus}>
                        <View style={[
                          classSectionStyles.statusIndicator,
                          { backgroundColor: statusColor }
                        ]} />
                        <Text style={[
                          classSectionStyles.statusText,
                          { color: statusColor }
                        ]}>
                          {getStatusLabel(summary.status)}
                        </Text>
                      </View>
                    </View>
                    
                    {/* Enlace de Google Drive */}
                    {summary.driveLink && (
                      <View style={classSectionStyles.driveLinkContainer}>
                        <TouchableOpacity 
                          style={classSectionStyles.driveLinkButton}
                          onPress={() => openDriveLink(summary.driveLink)}
                        >
                          <Icon name="logo-google-drive" size={20} color="#4285F4" />
                          <Text style={classSectionStyles.driveLinkText}>Abrir en Google Drive</Text>
                          <Icon name="open-outline" size={16} color="#4285F4" />
                        </TouchableOpacity>
                      </View>
                    )}
                    
                    {/* Archivos adjuntos */}
                    {summary.attachments && summary.attachments.length > 0 && (
                      <View style={classSectionStyles.attachmentsContainer}>
                        <Text style={classSectionStyles.attachmentsLabel}>Archivos adjuntos:</Text>
                        {summary.attachments.map((attachment, index) => (
                          <TouchableOpacity
                            key={index}
                            style={classSectionStyles.attachmentItem}
                            onPress={() => attachment.link && openDriveLink(attachment.link)}
                          >
                            <Icon 
                              name={getFileTypeIcon(attachment.type)} 
                              size={16} 
                              color="#6B7280" 
                            />
                            <Text style={classSectionStyles.attachmentText}>{attachment.name}</Text>
                            {attachment.link && (
                              <Icon name="open-outline" size={14} color="#6B7280" />
                            )}
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                    
                    {/* Tags */}
                    {summary.tags && summary.tags.length > 0 && (
                      <View style={classSectionStyles.tagsContainer}>
                        <Text style={classSectionStyles.tagsLabel}>Etiquetas:</Text>
                        <View style={classSectionStyles.tagsList}>
                          {summary.tags.map((tag, index) => (
                            <View key={index} style={classSectionStyles.tagItem}>
                              <Text style={classSectionStyles.tagText}>{tag}</Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    )}
                  </View>
                );
              })
            )}
          </ScrollView>
        </View>
      </View>
    );
  };

  return (
    <View style={classSectionStyles.container}>
      {renderSummaries()}
      
      {/* Modal para agregar resumen mejorado */}
      <Modal
        visible={showAddModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={classSectionStyles.modalOverlay}>
          <View style={[classSectionStyles.modalContainer, { backgroundColor: themeColors.surface }]}>
            <View style={classSectionStyles.modalHeader}>
              <View style={classSectionStyles.modalHeaderContent}>
                <Icon name="add-circle-outline" size={24} color="#1E3A8A" />
                <Text style={[classSectionStyles.modalTitle, { color: themeColors.text }]}>
                  Nuevo Resumen de Clase
                </Text>
              </View>
              <TouchableOpacity 
                onPress={() => setShowAddModal(false)} 
                style={classSectionStyles.closeButton}
              >
                <Icon name="close" size={24} color={themeColors.primary} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={classSectionStyles.modalContent} showsVerticalScrollIndicator={false}>
              <View style={classSectionStyles.inputGroup}>
                <Text style={[classSectionStyles.inputLabel, { color: themeColors.text }]}>Título del Resumen *</Text>
                <TextInput
                  style={[classSectionStyles.textInput, { 
                    backgroundColor: themeColors.background,
                    color: themeColors.text,
                    borderColor: themeColors.border 
                  }]}
                  value={newSummary.title}
                  onChangeText={(text) => setNewSummary(prev => ({ ...prev, title: text }))}
                  placeholder="Ej: Resumen de Matemáticas - Derivadas"
                  placeholderTextColor={themeColors.textSecondary}
                />
              </View>
              
              <View style={classSectionStyles.inputGroup}>
                <Text style={[classSectionStyles.inputLabel, { color: themeColors.text }]}>Materia *</Text>
                <View style={classSectionStyles.subjectSelector}>
                  {subjects.map((subject) => (
                    <TouchableOpacity
                      key={subject}
                      style={[
                        classSectionStyles.subjectButton,
                        { backgroundColor: themeColors.background },
                        newSummary.subject === subject && { backgroundColor: '#1E3A8A' }
                      ]}
                      onPress={() => setNewSummary(prev => ({ ...prev, subject }))}
                    >
                      <Text style={[
                        classSectionStyles.subjectButtonText,
                        { color: themeColors.text },
                        newSummary.subject === subject && { color: '#FFFFFF' }
                      ]}>
                        {subject}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <View style={classSectionStyles.inputGroup}>
                <Text style={[classSectionStyles.inputLabel, { color: themeColors.text }]}>Fecha de la clase *</Text>
                <TextInput
                  style={[classSectionStyles.textInput, { 
                    backgroundColor: themeColors.background,
                    color: themeColors.text,
                    borderColor: themeColors.border 
                  }]}
                  value={newSummary.date}
                  onChangeText={(text) => setNewSummary(prev => ({ ...prev, date: text }))}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={themeColors.textSecondary}
                />
              </View>
              
              <View style={classSectionStyles.inputGroup}>
                <Text style={[classSectionStyles.inputLabel, { color: themeColors.text }]}>Profesor</Text>
                <TextInput
                  style={[classSectionStyles.textInput, { 
                    backgroundColor: themeColors.background,
                    color: themeColors.text,
                    borderColor: themeColors.border 
                  }]}
                  value={newSummary.professor}
                  onChangeText={(text) => setNewSummary(prev => ({ ...prev, professor: text }))}
                  placeholder="Ej: Dr. García"
                  placeholderTextColor={themeColors.textSecondary}
                />
              </View>
              
              <View style={classSectionStyles.inputGroup}>
                <Text style={[classSectionStyles.inputLabel, { color: themeColors.text }]}>Contenido del resumen</Text>
                <TextInput
                  style={[classSectionStyles.textInput, { 
                    backgroundColor: themeColors.background,
                    color: themeColors.text,
                    borderColor: themeColors.border 
                  }]}
                  value={newSummary.content}
                  onChangeText={(text) => setNewSummary(prev => ({ ...prev, content: text }))}
                  placeholder="Describe el contenido de la clase..."
                  placeholderTextColor={themeColors.textSecondary}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
              
              <View style={classSectionStyles.inputGroup}>
                <Text style={[classSectionStyles.inputLabel, { color: themeColors.text }]}>Enlace de Google Drive</Text>
                <TextInput
                  style={[classSectionStyles.textInput, { 
                    backgroundColor: themeColors.background,
                    color: themeColors.text,
                    borderColor: themeColors.border 
                  }]}
                  value={newSummary.driveLink}
                  onChangeText={(text) => setNewSummary(prev => ({ ...prev, driveLink: text }))}
                  placeholder="https://drive.google.com/file/d/..."
                  placeholderTextColor={themeColors.textSecondary}
                />
              </View>
              
              <View style={classSectionStyles.inputGroup}>
                <Text style={[classSectionStyles.inputLabel, { color: themeColors.text }]}>Archivos adjuntos</Text>
                <TextInput
                  style={[classSectionStyles.textInput, { 
                    backgroundColor: themeColors.background,
                    color: themeColors.text,
                    borderColor: themeColors.border 
                  }]}
                  value={newSummary.attachments}
                  onChangeText={(text) => setNewSummary(prev => ({ ...prev, attachments: text }))}
                  placeholder="Formato: Nombre|Tipo|Enlace (separados por comas)"
                  placeholderTextColor={themeColors.textSecondary}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>
              
              <View style={classSectionStyles.inputGroup}>
                <Text style={[classSectionStyles.inputLabel, { color: themeColors.text }]}>Etiquetas</Text>
                <TextInput
                  style={[classSectionStyles.textInput, { 
                    backgroundColor: themeColors.background,
                    color: themeColors.text,
                    borderColor: themeColors.border 
                  }]}
                  value={newSummary.tags}
                  onChangeText={(text) => setNewSummary(prev => ({ ...prev, tags: text }))}
                  placeholder="Etiquetas separadas por comas"
                  placeholderTextColor={themeColors.textSecondary}
                />
              </View>
              
              <View style={classSectionStyles.inputGroup}>
                <Text style={[classSectionStyles.inputLabel, { color: themeColors.text }]}>Prioridad</Text>
                <View style={classSectionStyles.prioritySelector}>
                  {priorities.map((priority) => (
                    <TouchableOpacity
                      key={priority.value}
                      style={[
                        classSectionStyles.priorityButton,
                        { backgroundColor: themeColors.background },
                        newSummary.priority === priority.value && { backgroundColor: priority.color }
                      ]}
                      onPress={() => setNewSummary(prev => ({ ...prev, priority: priority.value }))}
                    >
                      <Text style={[
                        classSectionStyles.priorityButtonText,
                        { color: themeColors.text },
                        newSummary.priority === priority.value && { color: '#FFFFFF' }
                      ]}>
                        {priority.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>
            
            <View style={classSectionStyles.modalActions}>
              <TouchableOpacity
                style={[classSectionStyles.cancelButton, { backgroundColor: '#F3F4F6' }]}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={[classSectionStyles.cancelButtonText, { color: '#6B7280' }]}>
                  Cancelar
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[classSectionStyles.addButton, { backgroundColor: '#1E3A8A' }]}
                onPress={addSummary}
              >
                <Text style={[classSectionStyles.addButtonText, { color: '#FFFFFF' }]}>
                  Agregar Resumen
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ClassSection;