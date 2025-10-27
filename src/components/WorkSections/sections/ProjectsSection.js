import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SectionHeader, Button, Card } from '../../shared';
import { ProjectCard } from '../../shared/work';
import { useTheme } from '../../shared/hooks/useTheme';
import { projectsStyles } from '../styles/projectsStyles';

const ProjectsSection = ({ 
  selectedDate, 
  events, 
  onAddEvent, 
  onEditEvent, 
  onDeleteEvent, 
  onUpdateSection, 
  user,
  theme 
}) => {
  const { getThemeColors } = useTheme();
  const themeColors = getThemeColors();

  // Estados para proyectos
  const [projects, setProjects] = useState([
    {
      id: 1,
      title: 'Sistema de Gestión',
      description: 'Desarrollo de sistema interno',
      deadline: '2024-03-15',
      progress: 75,
      status: 'active',
      goals: [
        { id: 1, title: 'Diseño de base de datos', completed: true },
        { id: 2, title: 'Desarrollo de API', completed: true },
        { id: 3, title: 'Interfaz de usuario', completed: false },
        { id: 4, title: 'Testing', completed: false },
      ],
    },
    {
      id: 2,
      title: 'App Móvil',
      description: 'Aplicación móvil para clientes',
      deadline: '2024-02-28',
      progress: 45,
      status: 'active',
      goals: [
        { id: 1, title: 'Prototipo', completed: true },
        { id: 2, title: 'Desarrollo', completed: false },
      ],
    },
  ]);

  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [newProjectDeadline, setNewProjectDeadline] = useState('');
  const [newProjectGoals, setNewProjectGoals] = useState([]);
  const [newProjectGoalText, setNewProjectGoalText] = useState('');
  const [showProjectDeadlineModal, setShowProjectDeadlineModal] = useState(false);
  const [tempProjectDeadline, setTempProjectDeadline] = useState('');

  const handleAddProject = () => {
    if (newProjectName.trim() === '') {
      Alert.alert('Error', 'Por favor ingresa un nombre para el proyecto');
      return;
    }

    const newProject = {
      id: Date.now(),
      title: newProjectName.trim(),
      description: newProjectDescription.trim(),
      deadline: newProjectDeadline.trim(),
      progress: 0,
      status: 'active',
      goals: newProjectGoals,
      createdAt: new Date().toISOString(),
    };

    setProjects(prev => [...prev, newProject]);
    setNewProjectName('');
    setNewProjectDescription('');
    setNewProjectDeadline('');
    setNewProjectGoals([]);
    setNewProjectGoalText('');
    setShowAddProjectModal(false);
  };

  const handleEditProject = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      Alert.alert('Editar Proyecto', 'Funcionalidad en desarrollo');
    }
  };

  const handleDeleteProject = (projectId) => {
    Alert.alert(
      'Eliminar Proyecto',
      '¿Estás seguro de que quieres eliminar este proyecto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            setProjects(prev => prev.filter(project => project.id !== projectId));
          }
        }
      ]
    );
  };

  const handleViewGoals = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      Alert.alert('Metas del Proyecto', `Proyecto: ${project.title}\nMetas: ${project.goals.length}`);
    }
  };

  const handleAddGoal = (projectId) => {
    Alert.alert('Agregar Meta', 'Funcionalidad en desarrollo');
  };

  const handleAddProjectPress = () => {
    setNewProjectName('');
    setNewProjectDescription('');
    setNewProjectDeadline('');
    setNewProjectGoals([]);
    setNewProjectGoalText('');
    setShowAddProjectModal(true);
  };

  const handleAddGoalToProject = () => {
    if (newProjectGoalText.trim() === '') {
      Alert.alert('Error', 'Por favor ingresa una meta');
      return;
    }

    const newGoal = {
      id: Date.now(),
      title: newProjectGoalText.trim(),
      completed: false,
    };

    setNewProjectGoals(prev => [...prev, newGoal]);
    setNewProjectGoalText('');
  };

  const handleRemoveGoal = (goalId) => {
    setNewProjectGoals(prev => prev.filter(goal => goal.id !== goalId));
  };

  const activeProjects = projects.filter(project => project.status === 'active').length;
  const completedProjects = projects.filter(project => project.status === 'completed').length;
  const totalProjects = projects.length;

  return (
    <View style={projectsStyles.container}>
      <SectionHeader
        title="Proyectos"
        subtitle="Gestiona tus proyectos activos"
        image={require('../../../android/app/src/main/assets/trabajo.png')}
        onAddPress={handleAddProjectPress}
        theme={theme}
        size="medium"
      />

      {/* Resumen de proyectos */}
      <View style={projectsStyles.summaryContainer}>
        <Card
          title="Activos"
          subtitle={`${activeProjects} proyectos`}
          icon="play-circle-outline"
          theme={theme}
          size="small"
          style={projectsStyles.summaryCard}
        />
        <Card
          title="Completados"
          subtitle={`${completedProjects} proyectos`}
          icon="checkmark-circle-outline"
          theme={theme}
          size="small"
          style={projectsStyles.summaryCard}
        />
        <Card
          title="Total"
          subtitle={`${totalProjects} proyectos`}
          icon="folder-outline"
          theme={theme}
          size="small"
          style={projectsStyles.summaryCard}
        />
      </View>

      {/* Lista de proyectos */}
      <View style={projectsStyles.projectsContainer}>
        {projects.length === 0 ? (
          <Card
            title="No hay proyectos"
            subtitle="Crea tu primer proyecto"
            icon="add-circle-outline"
            theme={theme}
            size="medium"
          >
            <Button
              title="Crear Proyecto"
              onPress={handleAddProjectPress}
              variant="primary"
              size="medium"
              theme={theme}
              icon="add"
            />
          </Card>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onEdit={handleEditProject}
                onDelete={handleDeleteProject}
                onViewGoals={handleViewGoals}
                onAddGoal={handleAddGoal}
                theme={theme}
                size="medium"
                variant={project.status}
              />
            ))}
          </ScrollView>
        )}
      </View>

      {/* Modal para agregar proyecto */}
      <Modal
        visible={showAddProjectModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddProjectModal(false)}
      >
        <View style={projectsStyles.modalOverlay}>
          <View style={projectsStyles.modalContainer}>
            <View style={projectsStyles.modalHeader}>
              <Text style={projectsStyles.modalTitle}>Nuevo Proyecto</Text>
              <TouchableOpacity
                onPress={() => setShowAddProjectModal(false)}
                style={projectsStyles.closeButton}
              >
                <Icon name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={projectsStyles.modalContent}>
              <View style={projectsStyles.inputGroup}>
                <Text style={projectsStyles.inputLabel}>Nombre del Proyecto</Text>
                <TextInput
                  style={projectsStyles.textInput}
                  value={newProjectName}
                  onChangeText={setNewProjectName}
                  placeholder="Ingresa el nombre del proyecto"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={projectsStyles.inputGroup}>
                <Text style={projectsStyles.inputLabel}>Descripción</Text>
                <TextInput
                  style={[projectsStyles.textInput, projectsStyles.textArea]}
                  value={newProjectDescription}
                  onChangeText={setNewProjectDescription}
                  placeholder="Describe el proyecto"
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={3}
                />
              </View>

              <View style={projectsStyles.inputGroup}>
                <Text style={projectsStyles.inputLabel}>Fecha Límite</Text>
                <TouchableOpacity
                  style={projectsStyles.datePickerButton}
                  onPress={() => setShowProjectDeadlineModal(true)}
                >
                  <Icon name="calendar-outline" size={20} color="#6B7280" />
                  <Text style={projectsStyles.datePickerText}>
                    {newProjectDeadline || 'Seleccionar fecha'}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={projectsStyles.inputGroup}>
                <Text style={projectsStyles.inputLabel}>Metas del Proyecto</Text>
                <View style={projectsStyles.goalsContainer}>
                  {newProjectGoals.map((goal) => (
                    <View key={goal.id} style={projectsStyles.goalItem}>
                      <Text style={projectsStyles.goalText}>{goal.title}</Text>
                      <TouchableOpacity
                        onPress={() => handleRemoveGoal(goal.id)}
                        style={projectsStyles.removeGoalButton}
                      >
                        <Icon name="close-circle" size={20} color="#E53E3E" />
                      </TouchableOpacity>
                    </View>
                  ))}
                  <View style={projectsStyles.addGoalContainer}>
                    <TextInput
                      style={[projectsStyles.textInput, projectsStyles.goalInput]}
                      value={newProjectGoalText}
                      onChangeText={setNewProjectGoalText}
                      placeholder="Agregar meta"
                      placeholderTextColor="#9CA3AF"
                    />
                    <Button
                      title="Agregar"
                      onPress={handleAddGoalToProject}
                      variant="outline"
                      size="small"
                      theme={theme}
                      style={projectsStyles.addGoalButton}
                    />
                  </View>
                </View>
              </View>
            </ScrollView>

            <View style={projectsStyles.modalActions}>
              <Button
                title="Cancelar"
                onPress={() => setShowAddProjectModal(false)}
                variant="outline"
                size="medium"
                theme={theme}
                style={projectsStyles.modalButton}
              />
              <Button
                title="Crear Proyecto"
                onPress={handleAddProject}
                variant="primary"
                size="medium"
                theme={theme}
                style={projectsStyles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Date Picker para fecha límite */}
      {showProjectDeadlineModal && (
        <DateTimePicker
          value={tempProjectDeadline ? new Date(tempProjectDeadline) : new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedDate) => {
            setShowProjectDeadlineModal(false);
            if (selectedDate) {
              setNewProjectDeadline(selectedDate.toISOString().split('T')[0]);
            }
          }}
        />
      )}
    </View>
  );
};

export default ProjectsSection;
