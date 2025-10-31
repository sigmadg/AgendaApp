import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { SectionHeader } from '../../shared';
import { useTheme } from '../../shared/hooks/useTheme';
import { examsSectionStyles } from '../styles/examsSectionStyles';

const ExamsSection = ({ user, theme }) => {
  const { getThemeColors } = useTheme();
  const themeColors = getThemeColors();

  // Validar que user existe
  if (!user) {
    return (
      <View style={examsSectionStyles.container}>
        <Text style={[examsSectionStyles.text, { color: themeColors.text }]}>
          Cargando datos del usuario...
        </Text>
      </View>
    );
  }

  // Estados para los exámenes académicos
  const [academicExams, setAcademicExams] = useState([
    {
      id: 1,
      title: 'Examen Final de Matemáticas',
      subject: 'Matemáticas',
      date: '2024-02-15',
      time: '09:00',
      duration: '120',
      type: 'final',
      location: 'Aula 201',
      professor: 'Dr. García',
      weight: '40%',
      status: 'programado',
      priority: 'high',
      notes: 'Repasar cálculo diferencial e integral',
      topics: ['Derivadas', 'Integrales', 'Límites', 'Series']
    },
    {
      id: 2,
      title: 'Parcial de Física',
      subject: 'Física',
      date: '2024-02-10',
      time: '14:00',
      duration: '90',
      type: 'parcial',
      location: 'Laboratorio Física',
      professor: 'Dra. Martínez',
      weight: '25%',
      status: 'completado',
      priority: 'medium',
      notes: 'Examen completado exitosamente',
      topics: ['Mecánica', 'Termodinámica']
    },
    {
      id: 3,
      title: 'Quiz de Química Orgánica',
      subject: 'Química',
      date: '2024-02-08',
      time: '11:00',
      duration: '45',
      type: 'quiz',
      location: 'Aula 105',
      professor: 'Prof. López',
      weight: '15%',
      status: 'programado',
      priority: 'low',
      notes: 'Estudiar grupos funcionales',
      topics: ['Alcanos', 'Alquenos', 'Alquinos', 'Grupos funcionales']
    },
    {
      id: 4,
      title: 'Examen de Literatura',
      subject: 'Literatura',
      date: '2024-02-20',
      time: '16:00',
      duration: '150',
      type: 'final',
      location: 'Biblioteca Central',
      professor: 'Dra. Rodríguez',
      weight: '35%',
      status: 'programado',
      priority: 'high',
      notes: 'Análisis de textos del siglo XIX',
      topics: ['Romanticismo', 'Realismo', 'Modernismo', 'Análisis literario']
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newExam, setNewExam] = useState({
    title: '',
    subject: '',
    date: '',
    time: '',
    duration: '',
    type: 'parcial',
    location: '',
    professor: '',
    weight: '',
    priority: 'medium',
    notes: '',
    topics: ''
  });

  const subjects = ['Matemáticas', 'Física', 'Química', 'Literatura', 'Historia', 'Biología', 'Inglés', 'Filosofía'];
  const examTypes = [
    { value: 'quiz', label: 'Quiz', icon: 'document-text-outline', color: '#10B981' },
    { value: 'parcial', label: 'Parcial', icon: 'book-outline', color: '#3B82F6' },
    { value: 'final', label: 'Final', icon: 'school-outline', color: '#EF4444' },
    { value: 'oral', label: 'Oral', icon: 'mic-outline', color: '#8B5CF6' },
    { value: 'practico', label: 'Práctico', icon: 'flask-outline', color: '#F59E0B' }
  ];
  const priorities = [
    { value: 'high', label: 'Alta', color: '#EF4444' },
    { value: 'medium', label: 'Media', color: '#F59E0B' },
    { value: 'low', label: 'Baja', color: '#10B981' }
  ];
  const statusOptions = [
    { value: 'programado', label: 'Programado', color: '#3B82F6' },
    { value: 'completado', label: 'Completado', color: '#10B981' },
    { value: 'aplazado', label: 'Aplazado', color: '#F59E0B' },
    { value: 'cancelado', label: 'Cancelado', color: '#EF4444' }
  ];

  const getTotalExams = () => academicExams.length;
  const getCompletedExams = () => academicExams.filter(exam => exam.status === 'completado').length;
  const getUpcomingExams = () => academicExams.filter(exam => exam.status === 'programado').length;
  const getHighPriorityExams = () => academicExams.filter(exam => exam.priority === 'high' && exam.status === 'programado').length;

  const addExam = () => {
    if (!newExam.title || !newExam.subject || !newExam.date || !newExam.time) {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios');
      return;
    }

    const examData = {
      ...newExam,
      id: Date.now(),
      topics: newExam.topics.split(',').map(topic => topic.trim()).filter(topic => topic),
      status: 'programado'
    };

    setAcademicExams(prev => [...prev, examData]);
    setNewExam({
      title: '',
      subject: '',
      date: '',
      time: '',
      duration: '',
      type: 'parcial',
      location: '',
      professor: '',
      weight: '',
      priority: 'medium',
      notes: '',
      topics: ''
    });
    setShowAddModal(false);
    Alert.alert('Éxito', 'Examen agregado correctamente');
  };

  const updateExamStatus = (examId, newStatus) => {
    setAcademicExams(prev => 
      prev.map(exam => 
        exam.id === examId ? { ...exam, status: newStatus } : exam
      )
    );
  };

  const deleteExam = (examId) => {
    Alert.alert(
      'Eliminar Examen',
      '¿Estás seguro de que quieres eliminar este examen?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: () => {
            setAcademicExams(prev => prev.filter(exam => exam.id !== examId));
          }
        }
      ]
    );
  };

  const getPriorityColor = (priority) => {
    const priorityObj = priorities.find(p => p.value === priority);
    return priorityObj ? priorityObj.color : '#6B7280';
  };

  const getPriorityLabel = (priority) => {
    const priorityObj = priorities.find(p => p.value === priority);
    return priorityObj ? priorityObj.label : 'Media';
  };

  const getExamTypeIcon = (type) => {
    const typeObj = examTypes.find(t => t.value === type);
    return typeObj ? typeObj.icon : 'document-outline';
  };

  const getExamTypeColor = (type) => {
    const typeObj = examTypes.find(t => t.value === type);
    return typeObj ? typeObj.color : '#6B7280';
  };

  const getExamTypeLabel = (type) => {
    const typeObj = examTypes.find(t => t.value === type);
    return typeObj ? typeObj.label : 'Examen';
  };

  const getStatusColor = (status) => {
    const statusObj = statusOptions.find(s => s.value === status);
    return statusObj ? statusObj.color : '#6B7280';
  };

  const getStatusLabel = (status) => {
    const statusObj = statusOptions.find(s => s.value === status);
    return statusObj ? statusObj.label : 'Programado';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return timeString;
  };

  const isUpcoming = (dateString) => {
    const examDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return examDate >= today;
  };

  const getDaysUntilExam = (dateString) => {
    const examDate = new Date(dateString);
    const today = new Date();
    const diffTime = examDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const renderExams = () => {
    const totalExams = getTotalExams();
    const completedExams = getCompletedExams();
    const upcomingExams = getUpcomingExams();
    const highPriorityExams = getHighPriorityExams();

    return (
      <View>
        {/* Header mejorado */}
        <View style={examsSectionStyles.examsHeader}>
          <View style={examsSectionStyles.examsHeaderContent}>
            <View style={examsSectionStyles.examsIconContainer}>
              <Icon name="school-outline" size={24} color="#FFFFFF" />
            </View>
            <View style={examsSectionStyles.examsHeaderText}>
              <Text style={examsSectionStyles.examsHeaderTitle}>
                Exámenes Académicos
              </Text>
              <Text style={examsSectionStyles.examsHeaderSubtitle}>
                Prepara y gestiona tus evaluaciones
              </Text>
            </View>
          </View>
          <View style={examsSectionStyles.examsHeaderBadge}>
            <Icon name="calendar-outline" size={16} color="#1E3A8A" />
          </View>
        </View>

        {/* Resumen de exámenes mejorado */}
        <View style={examsSectionStyles.examsSummary}>
          <View style={examsSectionStyles.summaryCard}>
            <View style={examsSectionStyles.summaryIconContainer}>
              <Icon name="document-outline" size={20} color="#3B82F6" />
            </View>
            <View style={examsSectionStyles.summaryContent}>
              <Text style={examsSectionStyles.summaryValue}>{totalExams}</Text>
              <Text style={examsSectionStyles.summaryLabel}>Total</Text>
            </View>
          </View>
          <View style={examsSectionStyles.summaryCard}>
            <View style={examsSectionStyles.summaryIconContainer}>
              <Icon name="checkmark-circle-outline" size={20} color="#10B981" />
            </View>
            <View style={examsSectionStyles.summaryContent}>
              <Text style={examsSectionStyles.summaryValue}>{completedExams}</Text>
              <Text style={examsSectionStyles.summaryLabel}>Completados</Text>
            </View>
          </View>
          <View style={examsSectionStyles.summaryCard}>
            <View style={examsSectionStyles.summaryIconContainer}>
              <Icon name="time-outline" size={20} color="#3B82F6" />
            </View>
            <View style={examsSectionStyles.summaryContent}>
              <Text style={examsSectionStyles.summaryValue}>{upcomingExams}</Text>
              <Text style={examsSectionStyles.summaryLabel}>Próximos</Text>
            </View>
          </View>
          <View style={examsSectionStyles.summaryCard}>
            <View style={examsSectionStyles.summaryIconContainer}>
              <Icon name="alert-circle-outline" size={20} color="#EF4444" />
            </View>
            <View style={examsSectionStyles.summaryContent}>
              <Text style={examsSectionStyles.summaryValue}>{highPriorityExams}</Text>
              <Text style={examsSectionStyles.summaryLabel}>Urgentes</Text>
            </View>
          </View>
        </View>

        {/* Botón para agregar examen */}
        <View style={examsSectionStyles.addExamContainer}>
          <TouchableOpacity 
            style={examsSectionStyles.addExamButton}
            onPress={() => setShowAddModal(true)}
          >
            <Icon name="add-circle-outline" size={20} color="#FFFFFF" />
            <Text style={examsSectionStyles.addExamText}>Nuevo Examen</Text>
          </TouchableOpacity>
        </View>

        {/* Lista de exámenes mejorada */}
        <View style={examsSectionStyles.examsContainer}>
          <View style={examsSectionStyles.examsListHeader}>
            <Text style={examsSectionStyles.examsListTitle}>Mis Exámenes</Text>
            <TouchableOpacity style={examsSectionStyles.filterButton}>
              <Icon name="filter-outline" size={16} color="#1E3A8A" />
              <Text style={examsSectionStyles.filterText}>Filtrar</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={examsSectionStyles.examsBody} showsVerticalScrollIndicator={false}>
            {academicExams.length === 0 ? (
              <View style={examsSectionStyles.emptyState}>
                <Icon name="school-outline" size={48} color="#9CA3AF" />
                <Text style={examsSectionStyles.emptyTitle}>No hay exámenes programados</Text>
                <Text style={examsSectionStyles.emptySubtitle}>Agrega tu primer examen para comenzar a prepararte</Text>
                <TouchableOpacity 
                  style={examsSectionStyles.emptyButton}
                  onPress={() => setShowAddModal(true)}
                >
                  <Icon name="add-outline" size={20} color="#1E3A8A" />
                  <Text style={examsSectionStyles.emptyButtonText}>Agregar Primer Examen</Text>
                </TouchableOpacity>
              </View>
            ) : (
              academicExams.map((exam) => {
                const isUpcomingExam = isUpcoming(exam.date);
                const daysUntil = getDaysUntilExam(exam.date);
                const priorityColor = getPriorityColor(exam.priority);
                const examTypeIcon = getExamTypeIcon(exam.type);
                const examTypeColor = getExamTypeColor(exam.type);
                const statusColor = getStatusColor(exam.status);
                
                return (
                  <View key={exam.id} style={examsSectionStyles.examItem}>
                    <View style={examsSectionStyles.examItemHeader}>
                      <View style={examsSectionStyles.examItemInfo}>
                        <View style={examsSectionStyles.examContent}>
                          <Text style={examsSectionStyles.examTitle}>
                            {exam.title}
                          </Text>
                          
                          <View style={examsSectionStyles.examMeta}>
                            <View style={examsSectionStyles.examMetaItem}>
                              <Icon name="book-outline" size={14} color="#6B7280" />
                              <Text style={examsSectionStyles.examMetaText}>{exam.subject}</Text>
                            </View>
                            <View style={examsSectionStyles.examMetaItem}>
                              <Icon name="calendar-outline" size={14} color="#6B7280" />
                              <Text style={examsSectionStyles.examMetaText}>{formatDate(exam.date)}</Text>
                            </View>
                            <View style={examsSectionStyles.examMetaItem}>
                              <Icon name="time-outline" size={14} color="#6B7280" />
                              <Text style={examsSectionStyles.examMetaText}>{formatTime(exam.time)}</Text>
                            </View>
                            <View style={examsSectionStyles.examMetaItem}>
                              <Icon name={examTypeIcon} size={14} color={examTypeColor} />
                              <Text style={[examsSectionStyles.examMetaText, { color: examTypeColor }]}>
                                {getExamTypeLabel(exam.type)}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>
                      
                      <View style={examsSectionStyles.examItemActions}>
                        <TouchableOpacity
                          onPress={() => deleteExam(exam.id)}
                          style={examsSectionStyles.examActionButton}
                        >
                          <Icon name="trash-outline" size={16} color="#EF4444" />
                        </TouchableOpacity>
                      </View>
                    </View>
                    
                    {/* Información adicional */}
                    <View style={examsSectionStyles.examItemDetails}>
                      <View style={examsSectionStyles.examPriority}>
                        <View style={[
                          examsSectionStyles.priorityIndicator,
                          { backgroundColor: priorityColor }
                        ]} />
                        <Text style={[
                          examsSectionStyles.priorityText,
                          { color: priorityColor }
                        ]}>
                          {getPriorityLabel(exam.priority)}
                        </Text>
                      </View>
                      
                      <View style={examsSectionStyles.examStatus}>
                        <View style={[
                          examsSectionStyles.statusIndicator,
                          { backgroundColor: statusColor }
                        ]} />
                        <Text style={[
                          examsSectionStyles.statusText,
                          { color: statusColor }
                        ]}>
                          {getStatusLabel(exam.status)}
                        </Text>
                      </View>
                    </View>
                    
                    {/* Información del examen */}
                    <View style={examsSectionStyles.examInfo}>
                      <View style={examsSectionStyles.examInfoRow}>
                        <View style={examsSectionStyles.examInfoItem}>
                          <Icon name="location-outline" size={12} color="#6B7280" />
                          <Text style={examsSectionStyles.examInfoText}>{exam.location}</Text>
                        </View>
                        <View style={examsSectionStyles.examInfoItem}>
                          <Icon name="person-outline" size={12} color="#6B7280" />
                          <Text style={examsSectionStyles.examInfoText}>{exam.professor}</Text>
                        </View>
                      </View>
                      <View style={examsSectionStyles.examInfoRow}>
                        <View style={examsSectionStyles.examInfoItem}>
                          <Icon name="hourglass-outline" size={12} color="#6B7280" />
                          <Text style={examsSectionStyles.examInfoText}>{exam.duration} min</Text>
                        </View>
                        <View style={examsSectionStyles.examInfoItem}>
                          <Icon name="scale-outline" size={12} color="#6B7280" />
                          <Text style={examsSectionStyles.examInfoText}>{exam.weight}</Text>
                        </View>
                      </View>
                    </View>
                    
                    {/* Contador de días */}
                    {isUpcomingExam && exam.status === 'programado' && (
                      <View style={examsSectionStyles.examCountdown}>
                        <Text style={examsSectionStyles.countdownText}>
                          {daysUntil === 0 ? 'Hoy' : 
                           daysUntil === 1 ? 'Mañana' : 
                           `${daysUntil} días restantes`}
                        </Text>
                      </View>
                    )}
                    
                    {/* Temas */}
                    {exam.topics && exam.topics.length > 0 && (
                      <View style={examsSectionStyles.examTopics}>
                        <Text style={examsSectionStyles.topicsLabel}>Temas a estudiar:</Text>
                        <Text style={examsSectionStyles.topicsText}>
                          {exam.topics.join(', ')}
                        </Text>
                      </View>
                    )}
                    
                    {/* Notas */}
                    {exam.notes && (
                      <View style={examsSectionStyles.examNotes}>
                        <Text style={examsSectionStyles.examNotesText}>{exam.notes}</Text>
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
    <View style={examsSectionStyles.container}>
      {renderExams()}
      
      {/* Modal para agregar examen mejorado */}
      <Modal
        visible={showAddModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={examsSectionStyles.modalOverlay}>
          <View style={[examsSectionStyles.modalContainer, { backgroundColor: themeColors.surface }]}>
            <View style={examsSectionStyles.modalHeader}>
              <View style={examsSectionStyles.modalHeaderContent}>
                <Icon name="add-circle-outline" size={24} color="#1E3A8A" />
                <Text style={[examsSectionStyles.modalTitle, { color: themeColors.text }]}>
                  Nuevo Examen
                </Text>
              </View>
              <TouchableOpacity 
                onPress={() => setShowAddModal(false)} 
                style={examsSectionStyles.closeButton}
              >
                <Icon name="close" size={24} color={themeColors.primary} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={examsSectionStyles.modalContent} showsVerticalScrollIndicator={false}>
              <View style={examsSectionStyles.inputGroup}>
                <Text style={[examsSectionStyles.inputLabel, { color: themeColors.text }]}>Título del Examen *</Text>
                <TextInput
                  style={[examsSectionStyles.textInput, { 
                    backgroundColor: themeColors.background,
                    color: themeColors.text,
                    borderColor: themeColors.border 
                  }]}
                  value={newExam.title}
                  onChangeText={(text) => setNewExam(prev => ({ ...prev, title: text }))}
                  placeholder="Ej: Examen Final de Matemáticas"
                  placeholderTextColor={themeColors.textSecondary}
                />
              </View>
              
              <View style={examsSectionStyles.inputGroup}>
                <Text style={[examsSectionStyles.inputLabel, { color: themeColors.text }]}>Materia *</Text>
                <View style={examsSectionStyles.subjectSelector}>
                  {subjects.map((subject) => (
                    <TouchableOpacity
                      key={subject}
                      style={[
                        examsSectionStyles.subjectButton,
                        { backgroundColor: themeColors.background },
                        newExam.subject === subject && { backgroundColor: '#1E3A8A' }
                      ]}
                      onPress={() => setNewExam(prev => ({ ...prev, subject }))}
                    >
                      <Text style={[
                        examsSectionStyles.subjectButtonText,
                        { color: themeColors.text },
                        newExam.subject === subject && { color: '#FFFFFF' }
                      ]}>
                        {subject}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <View style={examsSectionStyles.inputGroup}>
                <Text style={[examsSectionStyles.inputLabel, { color: themeColors.text }]}>Fecha *</Text>
                <TextInput
                  style={[examsSectionStyles.textInput, { 
                    backgroundColor: themeColors.background,
                    color: themeColors.text,
                    borderColor: themeColors.border 
                  }]}
                  value={newExam.date}
                  onChangeText={(text) => setNewExam(prev => ({ ...prev, date: text }))}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={themeColors.textSecondary}
                />
              </View>
              
              <View style={examsSectionStyles.inputGroup}>
                <Text style={[examsSectionStyles.inputLabel, { color: themeColors.text }]}>Hora *</Text>
                <TextInput
                  style={[examsSectionStyles.textInput, { 
                    backgroundColor: themeColors.background,
                    color: themeColors.text,
                    borderColor: themeColors.border 
                  }]}
                  value={newExam.time}
                  onChangeText={(text) => setNewExam(prev => ({ ...prev, time: text }))}
                  placeholder="HH:MM"
                  placeholderTextColor={themeColors.textSecondary}
                />
              </View>
              
              <View style={examsSectionStyles.inputGroup}>
                <Text style={[examsSectionStyles.inputLabel, { color: themeColors.text }]}>Duración (minutos)</Text>
                <TextInput
                  style={[examsSectionStyles.textInput, { 
                    backgroundColor: themeColors.background,
                    color: themeColors.text,
                    borderColor: themeColors.border 
                  }]}
                  value={newExam.duration}
                  onChangeText={(text) => setNewExam(prev => ({ ...prev, duration: text }))}
                  placeholder="120"
                  placeholderTextColor={themeColors.textSecondary}
                  keyboardType="numeric"
                />
              </View>
              
              <View style={examsSectionStyles.inputGroup}>
                <Text style={[examsSectionStyles.inputLabel, { color: themeColors.text }]}>Tipo de examen</Text>
                <View style={examsSectionStyles.typeSelector}>
                  {examTypes.map((type) => (
                    <TouchableOpacity
                      key={type.value}
                      style={[
                        examsSectionStyles.typeButton,
                        { backgroundColor: themeColors.background },
                        newExam.type === type.value && { backgroundColor: type.color }
                      ]}
                      onPress={() => setNewExam(prev => ({ ...prev, type: type.value }))}
                    >
                      <Icon 
                        name={type.icon} 
                        size={16} 
                        color={newExam.type === type.value ? '#FFFFFF' : themeColors.text} 
                      />
                      <Text style={[
                        examsSectionStyles.typeButtonText,
                        { color: themeColors.text },
                        newExam.type === type.value && { color: '#FFFFFF' }
                      ]}>
                        {type.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <View style={examsSectionStyles.inputGroup}>
                <Text style={[examsSectionStyles.inputLabel, { color: themeColors.text }]}>Ubicación</Text>
                <TextInput
                  style={[examsSectionStyles.textInput, { 
                    backgroundColor: themeColors.background,
                    color: themeColors.text,
                    borderColor: themeColors.border 
                  }]}
                  value={newExam.location}
                  onChangeText={(text) => setNewExam(prev => ({ ...prev, location: text }))}
                  placeholder="Ej: Aula 201"
                  placeholderTextColor={themeColors.textSecondary}
                />
              </View>
              
              <View style={examsSectionStyles.inputGroup}>
                <Text style={[examsSectionStyles.inputLabel, { color: themeColors.text }]}>Profesor</Text>
                <TextInput
                  style={[examsSectionStyles.textInput, { 
                    backgroundColor: themeColors.background,
                    color: themeColors.text,
                    borderColor: themeColors.border 
                  }]}
                  value={newExam.professor}
                  onChangeText={(text) => setNewExam(prev => ({ ...prev, professor: text }))}
                  placeholder="Ej: Dr. García"
                  placeholderTextColor={themeColors.textSecondary}
                />
              </View>
              
              <View style={examsSectionStyles.inputGroup}>
                <Text style={[examsSectionStyles.inputLabel, { color: themeColors.text }]}>Peso en la calificación</Text>
                <TextInput
                  style={[examsSectionStyles.textInput, { 
                    backgroundColor: themeColors.background,
                    color: themeColors.text,
                    borderColor: themeColors.border 
                  }]}
                  value={newExam.weight}
                  onChangeText={(text) => setNewExam(prev => ({ ...prev, weight: text }))}
                  placeholder="Ej: 40%"
                  placeholderTextColor={themeColors.textSecondary}
                />
              </View>
              
              <View style={examsSectionStyles.inputGroup}>
                <Text style={[examsSectionStyles.inputLabel, { color: themeColors.text }]}>Prioridad</Text>
                <View style={examsSectionStyles.prioritySelector}>
                  {priorities.map((priority) => (
                    <TouchableOpacity
                      key={priority.value}
                      style={[
                        examsSectionStyles.priorityButton,
                        { backgroundColor: themeColors.background },
                        newExam.priority === priority.value && { backgroundColor: priority.color }
                      ]}
                      onPress={() => setNewExam(prev => ({ ...prev, priority: priority.value }))}
                    >
                      <Text style={[
                        examsSectionStyles.priorityButtonText,
                        { color: themeColors.text },
                        newExam.priority === priority.value && { color: '#FFFFFF' }
                      ]}>
                        {priority.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <View style={examsSectionStyles.inputGroup}>
                <Text style={[examsSectionStyles.inputLabel, { color: themeColors.text }]}>Temas a estudiar</Text>
                <TextInput
                  style={[examsSectionStyles.textInput, { 
                    backgroundColor: themeColors.background,
                    color: themeColors.text,
                    borderColor: themeColors.border 
                  }]}
                  value={newExam.topics}
                  onChangeText={(text) => setNewExam(prev => ({ ...prev, topics: text }))}
                  placeholder="Temas separados por comas"
                  placeholderTextColor={themeColors.textSecondary}
                />
              </View>
              
              <View style={examsSectionStyles.inputGroup}>
                <Text style={[examsSectionStyles.inputLabel, { color: themeColors.text }]}>Notas adicionales</Text>
                <TextInput
                  style={[examsSectionStyles.textInput, { 
                    backgroundColor: themeColors.background,
                    color: themeColors.text,
                    borderColor: themeColors.border 
                  }]}
                  value={newExam.notes}
                  onChangeText={(text) => setNewExam(prev => ({ ...prev, notes: text }))}
                  placeholder="Información adicional sobre el examen..."
                  placeholderTextColor={themeColors.textSecondary}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>
            </ScrollView>
            
            <View style={examsSectionStyles.modalActions}>
              <TouchableOpacity
                style={[examsSectionStyles.cancelButton, { backgroundColor: '#F3F4F6' }]}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={[examsSectionStyles.cancelButtonText, { color: '#6B7280' }]}>
                  Cancelar
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[examsSectionStyles.addButton, { backgroundColor: '#1E3A8A' }]}
                onPress={addExam}
              >
                <Text style={[examsSectionStyles.addButtonText, { color: '#FFFFFF' }]}>
                  Agregar Examen
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ExamsSection;