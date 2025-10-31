import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
} from 'react-native';
import { SectionHeader, SubsectionTabs, Button, Card } from '../../shared';
import { TaskCard, ProjectCard, GoalCard, WorkPlanningCard } from '../../shared/work';
import { useTheme } from '../../shared/hooks/useTheme';

const WorkSectionsExample = () => {
  const [activeSection, setActiveSection] = useState('daily');
  const { getThemeColors, currentTheme } = useTheme();

  const sections = [
    { id: 'daily', name: 'Tareas Diarias', icon: 'sunny-outline' },
    { id: 'weekly', name: 'Tareas Semanales', icon: 'leaf-outline' },
    { id: 'projects', name: 'Proyectos', icon: 'folder-outline' },
    { id: 'goals', name: 'Objetivos', icon: 'flower-outline' },
    { id: 'planning', name: 'Planificación', icon: 'trending-up-outline' },
  ];

  const themeColors = getThemeColors();

  // Datos de ejemplo
  const dailyTasks = [
    {
      id: 1,
      title: 'Revisar emails',
      date: '2024-01-15',
      time: '09:00',
      notes: 'Responder emails urgentes',
      completed: false,
      priority: 'high',
      urgent: false,
      overdue: false,
    },
    {
      id: 2,
      title: 'Reunión con equipo',
      date: '2024-01-15',
      time: '10:30',
      notes: 'Revisar progreso del proyecto',
      completed: true,
      priority: 'medium',
      urgent: false,
      overdue: false,
    },
  ];

  const weeklyTasks = [
    {
      id: 1,
      title: 'Planificar semana',
      date: '2024-01-15',
      notes: 'Definir objetivos semanales',
      completed: false,
      priority: 'high',
      urgent: false,
      overdue: false,
    },
    {
      id: 2,
      title: 'Revisar presupuesto',
      date: '2024-01-20',
      notes: 'Análisis financiero mensual',
      completed: false,
      priority: 'medium',
      urgent: false,
      overdue: false,
    },
  ];

  const projects = [
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
  ];

  const goals = [
    {
      id: 1,
      title: 'Completar certificación',
      date: '2024-02-15',
      person: 'Juan Pérez',
      completed: false,
      priority: 'high',
      urgent: false,
      overdue: false,
    },
    {
      id: 2,
      title: 'Mejorar productividad',
      date: '2024-01-31',
      person: 'María García',
      completed: true,
      priority: 'medium',
      urgent: false,
      overdue: false,
    },
  ];

  const workPlanningData = {
    productivity: {
      tasksCompleted: 8,
      totalTasks: 12,
      efficiency: 75,
      focusTime: 6.5,
    },
    weeklyProgress: [
      { day: 'Lunes', tasks: 8, completed: 6, hours: 8.5 },
      { day: 'Martes', tasks: 7, completed: 7, hours: 7.2 },
      { day: 'Miércoles', tasks: 9, completed: 8, hours: 8.8 },
    ],
    monthlyGoals: [
      { id: 1, title: 'Completar proyecto principal', progress: 75, deadline: '2024-01-31' },
      { id: 2, title: 'Mejorar productividad', progress: 60, deadline: '2024-02-15' },
    ],
    timeTracking: {
      totalHours: 38.9,
      averagePerDay: 7.8,
      mostProductiveDay: 'Miércoles',
      leastProductiveDay: 'Jueves',
    },
  };

  const handleTaskToggle = (taskId) => {
    console.log('Toggle task:', taskId);
  };

  const handleTaskEdit = (taskId) => {
    console.log('Edit task:', taskId);
  };

  const handleTaskDelete = (taskId) => {
    console.log('Delete task:', taskId);
  };

  const handleTaskNotes = (taskId) => {
    console.log('Add notes to task:', taskId);
  };

  const handleProjectEdit = (projectId) => {
    console.log('Edit project:', projectId);
  };

  const handleProjectDelete = (projectId) => {
    console.log('Delete project:', projectId);
  };

  const handleProjectGoals = (projectId) => {
    console.log('View project goals:', projectId);
  };

  const handleProjectAddGoal = (projectId) => {
    console.log('Add goal to project:', projectId);
  };

  const handleGoalToggle = (goalId) => {
    console.log('Toggle goal:', goalId);
  };

  const handleGoalEdit = (goalId) => {
    console.log('Edit goal:', goalId);
  };

  const handleGoalDelete = (goalId) => {
    console.log('Delete goal:', goalId);
  };

  const handleGoalAddPerson = (goalId) => {
    console.log('Add person to goal:', goalId);
  };

  const handleGoalAddDate = (goalId) => {
    console.log('Add date to goal:', goalId);
  };

  const handlePlanningViewDetails = (variant) => {
    console.log('View planning details:', variant);
  };

  const renderDailyTasks = () => (
    <View>
      <SectionHeader
        title="Tareas Diarias"
        subtitle="Gestiona tus tareas del día"
        image={require('../../../android/app/src/main/assets/trabajo.png')}
        onAddPress={() => console.log('Agregar tarea diaria')}
        theme={currentTheme}
        size="medium"
      />
      
      <View style={{ gap: 12 }}>
        {dailyTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onToggle={handleTaskToggle}
            onEdit={handleTaskEdit}
            onDelete={handleTaskDelete}
            onAddNotes={handleTaskNotes}
            theme={currentTheme}
            size="medium"
            variant={task.completed ? 'completed' : 'default'}
          />
        ))}
      </View>
    </View>
  );

  const renderWeeklyTasks = () => (
    <View>
      <SectionHeader
        title="Tareas Semanales"
        subtitle="Planifica tu semana de trabajo"
        image={require('../../../android/app/src/main/assets/trabajo.png')}
        onAddPress={() => console.log('Agregar tarea semanal')}
        theme={currentTheme}
        size="medium"
      />
      
      <View style={{ gap: 12 }}>
        {weeklyTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onToggle={handleTaskToggle}
            onEdit={handleTaskEdit}
            onDelete={handleTaskDelete}
            onAddNotes={handleTaskNotes}
            theme={currentTheme}
            size="medium"
            variant={task.completed ? 'completed' : 'default'}
          />
        ))}
      </View>
    </View>
  );

  const renderProjects = () => (
    <View>
      <SectionHeader
        title="Proyectos"
        subtitle="Gestiona tus proyectos activos"
        image={require('../../../android/app/src/main/assets/trabajo.png')}
        onAddPress={() => console.log('Agregar proyecto')}
        theme={currentTheme}
        size="medium"
      />
      
      <View style={{ gap: 16 }}>
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onEdit={handleProjectEdit}
            onDelete={handleProjectDelete}
            onViewGoals={handleProjectGoals}
            onAddGoal={handleProjectAddGoal}
            theme={currentTheme}
            size="medium"
            variant={project.status}
          />
        ))}
      </View>
    </View>
  );

  const renderGoals = () => (
    <View>
      <SectionHeader
        title="Objetivos"
        subtitle="Define y alcanza tus metas"
        image={require('../../../android/app/src/main/assets/trabajo.png')}
        onAddPress={() => console.log('Agregar objetivo')}
        theme={currentTheme}
        size="medium"
      />
      
      <View style={{ gap: 12 }}>
        {goals.map((goal) => (
          <GoalCard
            key={goal.id}
            goal={goal}
            onToggle={handleGoalToggle}
            onEdit={handleGoalEdit}
            onDelete={handleGoalDelete}
            onAddPerson={handleGoalAddPerson}
            onAddDate={handleGoalAddDate}
            theme={currentTheme}
            size="medium"
            variant={goal.completed ? 'completed' : 'default'}
          />
        ))}
      </View>
    </View>
  );

  const renderPlanning = () => (
    <View>
      <SectionHeader
        title="Planificación de Trabajo"
        subtitle="Analiza tu productividad y progreso"
        image={require('../../../android/app/src/main/assets/trabajo.png')}
        onAddPress={() => console.log('Agregar planificación')}
        theme={currentTheme}
        size="medium"
      />
      
      {/* Resumen de Productividad */}
      <View style={{ flexDirection: 'row', marginBottom: 16, gap: 12 }}>
        <WorkPlanningCard
          data={workPlanningData.productivity}
          onViewDetails={handlePlanningViewDetails}
          theme={currentTheme}
          size="small"
          variant="productivity"
          style={{ flex: 1 }}
        />
        <WorkPlanningCard
          data={workPlanningData.timeTracking}
          onViewDetails={handlePlanningViewDetails}
          theme={currentTheme}
          size="small"
          variant="time"
          style={{ flex: 1 }}
        />
      </View>
      
      {/* Progreso Semanal */}
      <Card
        title="Progreso Semanal"
        subtitle="Rendimiento por día"
        icon="bar-chart-outline"
        theme={currentTheme}
        size="medium"
      >
        <View style={{ gap: 8 }}>
          {workPlanningData.weeklyProgress.map((day, index) => (
            <WorkPlanningCard
              key={index}
              data={day}
              onViewDetails={handlePlanningViewDetails}
              theme={currentTheme}
              size="small"
              variant="progress"
            />
          ))}
        </View>
      </Card>
      
      {/* Metas Mensuales */}
      <Card
        title="Metas Mensuales"
        subtitle="Objetivos del mes"
        icon="flag-outline"
        theme={currentTheme}
        size="medium"
      >
        <View style={{ gap: 8 }}>
          {workPlanningData.monthlyGoals.map((goal) => (
            <WorkPlanningCard
              key={goal.id}
              data={goal}
              onViewDetails={handlePlanningViewDetails}
              theme={currentTheme}
              size="small"
              variant="goals"
            />
          ))}
        </View>
      </Card>
    </View>
  );

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'daily':
        return renderDailyTasks();
      case 'weekly':
        return renderWeeklyTasks();
      case 'projects':
        return renderProjects();
      case 'goals':
        return renderGoals();
      case 'planning':
        return renderPlanning();
      default:
        return (
          <View>
            <SectionHeader
              title="Sección de Trabajo"
              subtitle="Gestiona tu trabajo diario"
              image={require('../../../android/app/src/main/assets/trabajo.png')}
              theme={currentTheme}
              size="medium"
            />
            <Card
              title="Bienvenido"
              subtitle="Selecciona una sección"
              theme={currentTheme}
              size="medium"
            >
              <Text style={{ color: themeColors.textSecondary }}>
                Elige una opción del menú para comenzar
              </Text>
            </Card>
          </View>
        );
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: themeColors.background }}>
      <SubsectionTabs
        sections={sections}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        theme={currentTheme}
        size="medium"
        showIcons={true}
        showLabels={true}
      />
      
      <ScrollView style={{ flex: 1, padding: 16 }}>
        {renderActiveSection()}
      </ScrollView>
    </View>
  );
};

export default WorkSectionsExample;
