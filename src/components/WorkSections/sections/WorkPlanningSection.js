import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
} from 'react-native';
import { SectionHeader, Button, Card } from '../../shared';
import { WorkPlanningCard } from '../../shared/work';
import { useTheme } from '../../shared/hooks/useTheme';
import { workPlanningStyles } from '../styles/workPlanningStyles';

const WorkPlanningSection = ({ 
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

  // Datos de planificación de trabajo
  const [workPlanningData, setWorkPlanningData] = useState({
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
      { day: 'Jueves', tasks: 6, completed: 5, hours: 6.5 },
      { day: 'Viernes', tasks: 8, completed: 7, hours: 7.9 },
    ],
    monthlyGoals: [
      { id: 1, title: 'Completar proyecto principal', progress: 75, deadline: '2024-01-31' },
      { id: 2, title: 'Mejorar productividad', progress: 60, deadline: '2024-02-15' },
      { id: 3, title: 'Aprender nueva tecnología', progress: 40, deadline: '2024-03-01' },
    ],
    timeTracking: {
      totalHours: 38.9,
      averagePerDay: 7.8,
      mostProductiveDay: 'Miércoles',
      leastProductiveDay: 'Jueves',
    },
  });

  const handleViewDetails = (variant) => {
    console.log('Ver detalles de:', variant);
  };

  const handleAddPlanning = () => {
    console.log('Agregar planificación');
  };

  const totalTasks = workPlanningData.weeklyProgress.reduce((sum, day) => sum + day.tasks, 0);
  const completedTasks = workPlanningData.weeklyProgress.reduce((sum, day) => sum + day.completed, 0);
  const totalHours = workPlanningData.weeklyProgress.reduce((sum, day) => sum + day.hours, 0);

  return (
    <View style={workPlanningStyles.container}>
      <SectionHeader
        title="Planificación de Trabajo"
        subtitle="Analiza tu productividad y progreso"
        image={require('../../../android/app/src/main/assets/trabajo.png')}
        onAddPress={handleAddPlanning}
        theme={theme}
        size="medium"
      />

      {/* Resumen de productividad */}
      <View style={workPlanningStyles.summaryContainer}>
        <WorkPlanningCard
          data={workPlanningData.productivity}
          onViewDetails={handleViewDetails}
          theme={theme}
          size="small"
          variant="productivity"
          style={workPlanningStyles.summaryCard}
        />
        <WorkPlanningCard
          data={workPlanningData.timeTracking}
          onViewDetails={handleViewDetails}
          theme={theme}
          size="small"
          variant="time"
          style={workPlanningStyles.summaryCard}
        />
      </View>

      {/* Progreso semanal */}
      <Card
        title="Progreso Semanal"
        subtitle="Rendimiento por día"
        icon="bar-chart-outline"
        theme={theme}
        size="medium"
        style={workPlanningStyles.sectionCard}
      >
        <View style={workPlanningStyles.weeklyContainer}>
          {workPlanningData.weeklyProgress.map((day, index) => (
            <WorkPlanningCard
              key={index}
              data={day}
              onViewDetails={handleViewDetails}
              theme={theme}
              size="small"
              variant="progress"
              style={workPlanningStyles.weeklyCard}
            />
          ))}
        </View>
      </Card>

      {/* Metas mensuales */}
      <Card
        title="Metas Mensuales"
        subtitle="Objetivos del mes"
        icon="flag-outline"
        theme={theme}
        size="medium"
        style={workPlanningStyles.sectionCard}
      >
        <View style={workPlanningStyles.goalsContainer}>
          {workPlanningData.monthlyGoals.map((goal) => (
            <WorkPlanningCard
              key={goal.id}
              data={goal}
              onViewDetails={handleViewDetails}
              theme={theme}
              size="small"
              variant="goals"
              style={workPlanningStyles.goalCard}
            />
          ))}
        </View>
      </Card>

      {/* Estadísticas adicionales */}
      <Card
        title="Estadísticas de la Semana"
        subtitle="Resumen de productividad"
        icon="analytics-outline"
        theme={theme}
        size="medium"
        style={workPlanningStyles.sectionCard}
      >
        <View style={workPlanningStyles.statsContainer}>
          <View style={workPlanningStyles.statItem}>
            <Text style={[workPlanningStyles.statLabel, { color: themeColors.textSecondary }]}>
              Tareas Totales
            </Text>
            <Text style={[workPlanningStyles.statValue, { color: themeColors.text }]}>
              {totalTasks}
            </Text>
          </View>
          <View style={workPlanningStyles.statItem}>
            <Text style={[workPlanningStyles.statLabel, { color: themeColors.textSecondary }]}>
              Completadas
            </Text>
            <Text style={[workPlanningStyles.statValue, { color: themeColors.text }]}>
              {completedTasks}
            </Text>
          </View>
          <View style={workPlanningStyles.statItem}>
            <Text style={[workPlanningStyles.statLabel, { color: themeColors.textSecondary }]}>
              Horas Trabajadas
            </Text>
            <Text style={[workPlanningStyles.statValue, { color: themeColors.text }]}>
              {totalHours.toFixed(1)}h
            </Text>
          </View>
          <View style={workPlanningStyles.statItem}>
            <Text style={[workPlanningStyles.statLabel, { color: themeColors.textSecondary }]}>
              Eficiencia
            </Text>
            <Text style={[workPlanningStyles.statValue, { color: themeColors.text }]}>
              {((completedTasks / totalTasks) * 100).toFixed(0)}%
            </Text>
          </View>
        </View>
      </Card>
    </View>
  );
};

export default WorkPlanningSection;
