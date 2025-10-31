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
import { projectsSectionStyles } from '../styles/projectsSectionStyles';

const ProjectsSection = ({ user, theme }) => {
  const { getThemeColors } = useTheme();
  const themeColors = getThemeColors();

  // Validar que user existe
  if (!user) {
    return (
      <View style={projectsSectionStyles.container}>
        <Text style={[projectsSectionStyles.text, { color: themeColors.text }]}>
          Cargando datos del usuario...
        </Text>
      </View>
    );
  }

  // Estados para los proyectos académicos
  const [academicProjects, setAcademicProjects] = useState([
    {
      id: 1,
      title: 'Sistema de Gestión Escolar',
      description: 'Desarrollo de una aplicación web para gestionar estudiantes y calificaciones',
      subject: 'Programación',
      deadline: '2024-02-15',
      team: ['Juan Pérez', 'María García', 'Carlos López'],
      status: 'en_progreso',
      priority: 'high',
      progress: 65,
      notes: 'Usar React y Node.js para el desarrollo',
      type: 'desarrollo'
    },
    {
      id: 2,
      title: 'Investigación sobre Inteligencia Artificial',
      description: 'Análisis de algoritmos de machine learning aplicados a la educación',
      subject: 'Inteligencia Artificial',
      deadline: '2024-02-20',
      team: ['Ana Martínez', 'Pedro Rodríguez'],
      status: 'planificacion',
      priority: 'medium',
      progress: 25,
      notes: 'Revisar papers recientes sobre IA educativa',
      type: 'investigacion'
    },
    {
      id: 3,
      title: 'App Móvil de Notas',
      description: 'Aplicación móvil para tomar notas y organizar información académica',
      subject: 'Desarrollo Móvil',
      deadline: '2024-02-10',
      team: ['Laura Sánchez', 'Miguel Torres', 'Sofia Herrera'],
      status: 'completado',
      priority: 'low',
      progress: 100,
      notes: 'Proyecto completado exitosamente',
      type: 'desarrollo'
    },
    {
      id: 4,
      title: 'Análisis de Datos Educativos',
      description: 'Estudio estadístico sobre el rendimiento académico de estudiantes',
      subject: 'Estadística',
      deadline: '2024-02-25',
      team: ['Diego Morales', 'Elena Vargas'],
      status: 'en_progreso',
      priority: 'high',
      progress: 40,
      notes: 'Recopilar datos de los últimos 3 años',
      type: 'analisis'
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    subject: '',
    deadline: '',
    team: '',
    priority: 'medium',
    notes: '',
    type: 'desarrollo'
  });

  const subjects = ['Programación', 'Inteligencia Artificial', 'Desarrollo Móvil', 'Estadística', 'Matemáticas', 'Física', 'Química', 'Biología'];
  const priorities = [
    { value: 'high', label: 'Alta', color: '#EF4444' },
    { value: 'medium', label: 'Media', color: '#F59E0B' },
    { value: 'low', label: 'Baja', color: '#10B981' }
  ];
  const projectTypes = [
    { value: 'desarrollo', label: 'Desarrollo', icon: 'code-outline' },
    { value: 'investigacion', label: 'Investigación', icon: 'search-outline' },
    { value: 'analisis', label: 'Análisis', icon: 'analytics-outline' },
    { value: 'presentacion', label: 'Presentación', icon: 'presentation-outline' },
    { value: 'experimento', label: 'Experimento', icon: 'flask-outline' }
  ];
  const statusOptions = [
    { value: 'planificacion', label: 'Planificación', color: '#6B7280' },
    { value: 'en_progreso', label: 'En Progreso', color: '#3B82F6' },
    { value: 'completado', label: 'Completado', color: '#10B981' },
    { value: 'pausado', label: 'Pausado', color: '#F59E0B' }
  ];

  const getTotalProjects = () => academicProjects.length;
  const getCompletedProjects = () => academicProjects.filter(project => project.status === 'completado').length;
  const getInProgressProjects = () => academicProjects.filter(project => project.status === 'en_progreso').length;
  const getHighPriorityProjects = () => academicProjects.filter(project => project.priority === 'high' && project.status !== 'completado').length;

  const addProject = () => {
    if (!newProject.title || !newProject.subject || !newProject.deadline) {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios');
      return;
    }

    const projectData = {
      ...newProject,
      id: Date.now(),
      team: newProject.team.split(',').map(name => name.trim()).filter(name => name),
      progress: 0,
      status: 'planificacion'
    };

    setAcademicProjects(prev => [...prev, projectData]);
    setNewProject({
      title: '',
      description: '',
      subject: '',
      deadline: '',
      team: '',
      priority: 'medium',
      notes: '',
      type: 'desarrollo'
    });
    setShowAddModal(false);
    Alert.alert('Éxito', 'Proyecto académico agregado correctamente');
  };

  const updateProjectStatus = (projectId, newStatus) => {
    setAcademicProjects(prev => 
      prev.map(project => 
        project.id === projectId ? { ...project, status: newStatus } : project
      )
    );
  };

  const deleteProject = (projectId) => {
    Alert.alert(
      'Eliminar Proyecto',
      '¿Estás seguro de que quieres eliminar este proyecto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: () => {
            setAcademicProjects(prev => prev.filter(project => project.id !== projectId));
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

  const getProjectTypeIcon = (type) => {
    const typeObj = projectTypes.find(t => t.value === type);
    return typeObj ? typeObj.icon : 'folder-outline';
  };

  const getStatusColor = (status) => {
    const statusObj = statusOptions.find(s => s.value === status);
    return statusObj ? statusObj.color : '#6B7280';
  };

  const getStatusLabel = (status) => {
    const statusObj = statusOptions.find(s => s.value === status);
    return statusObj ? statusObj.label : 'Planificación';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const isOverdue = (dateString) => {
    const projectDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return projectDate < today;
  };

  const renderProjects = () => {
    const totalProjects = getTotalProjects();
    const completedProjects = getCompletedProjects();
    const inProgressProjects = getInProgressProjects();
    const highPriorityProjects = getHighPriorityProjects();

    return (
      <View>
        {/* Header mejorado */}
        <View style={projectsSectionStyles.projectsHeader}>
          <View style={projectsSectionStyles.projectsHeaderContent}>
            <View style={projectsSectionStyles.projectsIconContainer}>
              <Icon name="folder-outline" size={24} color="#FFFFFF" />
            </View>
            <View style={projectsSectionStyles.projectsHeaderText}>
              <Text style={projectsSectionStyles.projectsHeaderTitle}>
                Proyectos Académicos
              </Text>
              <Text style={projectsSectionStyles.projectsHeaderSubtitle}>
                Colabora y gestiona tus proyectos grupales
              </Text>
            </View>
          </View>
          <View style={projectsSectionStyles.projectsHeaderBadge}>
            <Icon name="people-outline" size={16} color="#1E3A8A" />
          </View>
        </View>

        {/* Resumen de proyectos mejorado */}
        <View style={projectsSectionStyles.projectsSummary}>
          <View style={projectsSectionStyles.summaryCard}>
            <View style={projectsSectionStyles.summaryIconContainer}>
              <Icon name="folder-outline" size={20} color="#3B82F6" />
            </View>
            <View style={projectsSectionStyles.summaryContent}>
              <Text style={projectsSectionStyles.summaryValue}>{totalProjects}</Text>
              <Text style={projectsSectionStyles.summaryLabel}>Total</Text>
            </View>
          </View>
          <View style={projectsSectionStyles.summaryCard}>
            <View style={projectsSectionStyles.summaryIconContainer}>
              <Icon name="checkmark-circle-outline" size={20} color="#10B981" />
            </View>
            <View style={projectsSectionStyles.summaryContent}>
              <Text style={projectsSectionStyles.summaryValue}>{completedProjects}</Text>
              <Text style={projectsSectionStyles.summaryLabel}>Completados</Text>
            </View>
          </View>
          <View style={projectsSectionStyles.summaryCard}>
            <View style={projectsSectionStyles.summaryIconContainer}>
              <Icon name="play-circle-outline" size={20} color="#3B82F6" />
            </View>
            <View style={projectsSectionStyles.summaryContent}>
              <Text style={projectsSectionStyles.summaryValue}>{inProgressProjects}</Text>
              <Text style={projectsSectionStyles.summaryLabel}>En Progreso</Text>
            </View>
          </View>
          <View style={projectsSectionStyles.summaryCard}>
            <View style={projectsSectionStyles.summaryIconContainer}>
              <Icon name="alert-circle-outline" size={20} color="#EF4444" />
            </View>
            <View style={projectsSectionStyles.summaryContent}>
              <Text style={projectsSectionStyles.summaryValue}>{highPriorityProjects}</Text>
              <Text style={projectsSectionStyles.summaryLabel}>Urgentes</Text>
            </View>
          </View>
        </View>

        {/* Botón para agregar proyecto */}
        <View style={projectsSectionStyles.addProjectContainer}>
          <TouchableOpacity 
            style={projectsSectionStyles.addProjectButton}
            onPress={() => setShowAddModal(true)}
          >
            <Icon name="add-circle-outline" size={20} color="#FFFFFF" />
            <Text style={projectsSectionStyles.addProjectText}>Nuevo Proyecto Académico</Text>
          </TouchableOpacity>
        </View>

        {/* Lista de proyectos mejorada */}
        <View style={projectsSectionStyles.projectsContainer}>
          <View style={projectsSectionStyles.projectsListHeader}>
            <Text style={projectsSectionStyles.projectsListTitle}>Mis Proyectos</Text>
            <TouchableOpacity style={projectsSectionStyles.filterButton}>
              <Icon name="filter-outline" size={16} color="#1E3A8A" />
              <Text style={projectsSectionStyles.filterText}>Filtrar</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={projectsSectionStyles.projectsBody} showsVerticalScrollIndicator={false}>
            {academicProjects.length === 0 ? (
              <View style={projectsSectionStyles.emptyState}>
                <Icon name="folder-outline" size={48} color="#9CA3AF" />
                <Text style={projectsSectionStyles.emptyTitle}>No hay proyectos académicos</Text>
                <Text style={projectsSectionStyles.emptySubtitle}>Crea tu primer proyecto para comenzar a colaborar</Text>
                <TouchableOpacity 
                  style={projectsSectionStyles.emptyButton}
                  onPress={() => setShowAddModal(true)}
                >
                  <Icon name="add-outline" size={20} color="#1E3A8A" />
                  <Text style={projectsSectionStyles.emptyButtonText}>Crear Primer Proyecto</Text>
                </TouchableOpacity>
              </View>
            ) : (
              academicProjects.map((project) => {
                const isOverdueProject = isOverdue(project.deadline);
                const priorityColor = getPriorityColor(project.priority);
                const projectTypeIcon = getProjectTypeIcon(project.type);
                const statusColor = getStatusColor(project.status);
                
                return (
                  <View key={project.id} style={projectsSectionStyles.projectItem}>
                    <View style={projectsSectionStyles.projectItemHeader}>
                      <View style={projectsSectionStyles.projectItemInfo}>
                        <View style={projectsSectionStyles.projectContent}>
                          <Text style={projectsSectionStyles.projectTitle}>
                            {project.title}
                          </Text>
                          <Text style={projectsSectionStyles.projectDescription}>
                            {project.description}
                          </Text>
                          
                          <View style={projectsSectionStyles.projectMeta}>
                            <View style={projectsSectionStyles.projectMetaItem}>
                              <Icon name="book-outline" size={14} color="#6B7280" />
                              <Text style={projectsSectionStyles.projectMetaText}>{project.subject}</Text>
                            </View>
                            <View style={projectsSectionStyles.projectMetaItem}>
                              <Icon name="calendar-outline" size={14} color="#6B7280" />
                              <Text style={[
                                projectsSectionStyles.projectMetaText,
                                isOverdueProject && projectsSectionStyles.projectMetaTextOverdue
                              ]}>
                                {formatDate(project.deadline)}
                              </Text>
                            </View>
                            <View style={projectsSectionStyles.projectMetaItem}>
                              <Icon name={projectTypeIcon} size={14} color="#6B7280" />
                              <Text style={projectsSectionStyles.projectMetaText}>{project.type}</Text>
                            </View>
                          </View>
                        </View>
                      </View>
                      
                      <View style={projectsSectionStyles.projectItemActions}>
                        <TouchableOpacity
                          onPress={() => deleteProject(project.id)}
                          style={projectsSectionStyles.projectActionButton}
                        >
                          <Icon name="trash-outline" size={16} color="#EF4444" />
                        </TouchableOpacity>
                      </View>
                    </View>
                    
                    {/* Información adicional */}
                    <View style={projectsSectionStyles.projectItemDetails}>
                      <View style={projectsSectionStyles.projectPriority}>
                        <View style={[
                          projectsSectionStyles.priorityIndicator,
                          { backgroundColor: priorityColor }
                        ]} />
                        <Text style={[
                          projectsSectionStyles.priorityText,
                          { color: priorityColor }
                        ]}>
                          {getPriorityLabel(project.priority)}
                        </Text>
                      </View>
                      
                      <View style={projectsSectionStyles.projectStatus}>
                        <View style={[
                          projectsSectionStyles.statusIndicator,
                          { backgroundColor: statusColor }
                        ]} />
                        <Text style={[
                          projectsSectionStyles.statusText,
                          { color: statusColor }
                        ]}>
                          {getStatusLabel(project.status)}
                        </Text>
                      </View>
                    </View>
                    
                    {/* Barra de progreso */}
                    <View style={projectsSectionStyles.projectProgressContainer}>
                      <View style={projectsSectionStyles.progressHeader}>
                        <Text style={projectsSectionStyles.progressLabel}>Progreso</Text>
                        <Text style={projectsSectionStyles.progressValue}>{project.progress}%</Text>
                      </View>
                      <View style={projectsSectionStyles.progressBar}>
                        <View style={[
                          projectsSectionStyles.progressFill,
                          { 
                            width: `${project.progress}%`,
                            backgroundColor: project.progress === 100 ? '#10B981' : '#3B82F6'
                          }
                        ]} />
                      </View>
                    </View>
                    
                    {/* Equipo */}
                    {project.team && project.team.length > 0 && (
                      <View style={projectsSectionStyles.projectTeam}>
                        <Text style={projectsSectionStyles.teamLabel}>Equipo:</Text>
                        <Text style={projectsSectionStyles.teamText}>
                          {project.team.join(', ')}
                        </Text>
                      </View>
                    )}
                    
                    {/* Notas */}
                    {project.notes && (
                      <View style={projectsSectionStyles.projectNotes}>
                        <Text style={projectsSectionStyles.projectNotesText}>{project.notes}</Text>
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
    <View style={projectsSectionStyles.container}>
      {renderProjects()}
      
      {/* Modal para agregar proyecto mejorado */}
      <Modal
        visible={showAddModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={projectsSectionStyles.modalOverlay}>
          <View style={[projectsSectionStyles.modalContainer, { backgroundColor: themeColors.surface }]}>
            <View style={projectsSectionStyles.modalHeader}>
              <View style={projectsSectionStyles.modalHeaderContent}>
                <Icon name="add-circle-outline" size={24} color="#1E3A8A" />
                <Text style={[projectsSectionStyles.modalTitle, { color: themeColors.text }]}>
                  Nuevo Proyecto Académico
                </Text>
              </View>
              <TouchableOpacity 
                onPress={() => setShowAddModal(false)} 
                style={projectsSectionStyles.closeButton}
              >
                <Icon name="close" size={24} color={themeColors.primary} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={projectsSectionStyles.modalContent} showsVerticalScrollIndicator={false}>
              <View style={projectsSectionStyles.inputGroup}>
                <Text style={[projectsSectionStyles.inputLabel, { color: themeColors.text }]}>Título del Proyecto *</Text>
                <TextInput
                  style={[projectsSectionStyles.textInput, { 
                    backgroundColor: themeColors.background,
                    color: themeColors.text,
                    borderColor: themeColors.border 
                  }]}
                  value={newProject.title}
                  onChangeText={(text) => setNewProject(prev => ({ ...prev, title: text }))}
                  placeholder="Ej: Sistema de Gestión Escolar"
                  placeholderTextColor={themeColors.textSecondary}
                />
              </View>
              
              <View style={projectsSectionStyles.inputGroup}>
                <Text style={[projectsSectionStyles.inputLabel, { color: themeColors.text }]}>Descripción</Text>
                <TextInput
                  style={[projectsSectionStyles.textInput, { 
                    backgroundColor: themeColors.background,
                    color: themeColors.text,
                    borderColor: themeColors.border 
                  }]}
                  value={newProject.description}
                  onChangeText={(text) => setNewProject(prev => ({ ...prev, description: text }))}
                  placeholder="Describe el proyecto..."
                  placeholderTextColor={themeColors.textSecondary}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>
              
              <View style={projectsSectionStyles.inputGroup}>
                <Text style={[projectsSectionStyles.inputLabel, { color: themeColors.text }]}>Materia *</Text>
                <View style={projectsSectionStyles.subjectSelector}>
                  {subjects.map((subject) => (
                    <TouchableOpacity
                      key={subject}
                      style={[
                        projectsSectionStyles.subjectButton,
                        { backgroundColor: themeColors.background },
                        newProject.subject === subject && { backgroundColor: '#1E3A8A' }
                      ]}
                      onPress={() => setNewProject(prev => ({ ...prev, subject }))}
                    >
                      <Text style={[
                        projectsSectionStyles.subjectButtonText,
                        { color: themeColors.text },
                        newProject.subject === subject && { color: '#FFFFFF' }
                      ]}>
                        {subject}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <View style={projectsSectionStyles.inputGroup}>
                <Text style={[projectsSectionStyles.inputLabel, { color: themeColors.text }]}>Fecha de entrega *</Text>
                <TextInput
                  style={[projectsSectionStyles.textInput, { 
                    backgroundColor: themeColors.background,
                    color: themeColors.text,
                    borderColor: themeColors.border 
                  }]}
                  value={newProject.deadline}
                  onChangeText={(text) => setNewProject(prev => ({ ...prev, deadline: text }))}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={themeColors.textSecondary}
                />
              </View>
              
              <View style={projectsSectionStyles.inputGroup}>
                <Text style={[projectsSectionStyles.inputLabel, { color: themeColors.text }]}>Equipo</Text>
                <TextInput
                  style={[projectsSectionStyles.textInput, { 
                    backgroundColor: themeColors.background,
                    color: themeColors.text,
                    borderColor: themeColors.border 
                  }]}
                  value={newProject.team}
                  onChangeText={(text) => setNewProject(prev => ({ ...prev, team: text }))}
                  placeholder="Nombres separados por comas"
                  placeholderTextColor={themeColors.textSecondary}
                />
              </View>
              
              <View style={projectsSectionStyles.inputGroup}>
                <Text style={[projectsSectionStyles.inputLabel, { color: themeColors.text }]}>Tipo de proyecto</Text>
                <View style={projectsSectionStyles.typeSelector}>
                  {projectTypes.map((type) => (
                    <TouchableOpacity
                      key={type.value}
                      style={[
                        projectsSectionStyles.typeButton,
                        { backgroundColor: themeColors.background },
                        newProject.type === type.value && { backgroundColor: '#1E3A8A' }
                      ]}
                      onPress={() => setNewProject(prev => ({ ...prev, type: type.value }))}
                    >
                      <Icon 
                        name={type.icon} 
                        size={16} 
                        color={newProject.type === type.value ? '#FFFFFF' : themeColors.text} 
                      />
                      <Text style={[
                        projectsSectionStyles.typeButtonText,
                        { color: themeColors.text },
                        newProject.type === type.value && { color: '#FFFFFF' }
                      ]}>
                        {type.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <View style={projectsSectionStyles.inputGroup}>
                <Text style={[projectsSectionStyles.inputLabel, { color: themeColors.text }]}>Prioridad</Text>
                <View style={projectsSectionStyles.prioritySelector}>
                  {priorities.map((priority) => (
                    <TouchableOpacity
                      key={priority.value}
                      style={[
                        projectsSectionStyles.priorityButton,
                        { backgroundColor: themeColors.background },
                        newProject.priority === priority.value && { backgroundColor: priority.color }
                      ]}
                      onPress={() => setNewProject(prev => ({ ...prev, priority: priority.value }))}
                    >
                      <Text style={[
                        projectsSectionStyles.priorityButtonText,
                        { color: themeColors.text },
                        newProject.priority === priority.value && { color: '#FFFFFF' }
                      ]}>
                        {priority.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <View style={projectsSectionStyles.inputGroup}>
                <Text style={[projectsSectionStyles.inputLabel, { color: themeColors.text }]}>Notas adicionales</Text>
                <TextInput
                  style={[projectsSectionStyles.textInput, { 
                    backgroundColor: themeColors.background,
                    color: themeColors.text,
                    borderColor: themeColors.border 
                  }]}
                  value={newProject.notes}
                  onChangeText={(text) => setNewProject(prev => ({ ...prev, notes: text }))}
                  placeholder="Información adicional sobre el proyecto..."
                  placeholderTextColor={themeColors.textSecondary}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>
            </ScrollView>
            
            <View style={projectsSectionStyles.modalActions}>
              <TouchableOpacity
                style={[projectsSectionStyles.cancelButton, { backgroundColor: '#F3F4F6' }]}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={[projectsSectionStyles.cancelButtonText, { color: '#6B7280' }]}>
                  Cancelar
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[projectsSectionStyles.addButton, { backgroundColor: '#1E3A8A' }]}
                onPress={addProject}
              >
                <Text style={[projectsSectionStyles.addButtonText, { color: '#FFFFFF' }]}>
                  Agregar Proyecto
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ProjectsSection;