import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { workPlanningCardStyles } from '../styles/workPlanningCardStyles';

const WorkPlanningCard = ({
  data,
  onViewDetails,
  onEdit,
  theme = 'desert',
  size = 'medium',
  variant = 'default', // default, productivity, progress, goals, time
  style,
  titleStyle,
  valueStyle,
  subtitleStyle,
  progressStyle,
}) => {
  const getThemeStyles = () => {
    const themes = {
      desert: {
        backgroundColor: '#FDF5E6',
        borderColor: '#F5E6D3',
        shadowColor: '#8B4513',
        titleColor: '#8B4513',
        valueColor: '#D2691E',
        subtitleColor: '#6B7280',
        progressColor: '#D2691E',
        successColor: '#38A169',
        warningColor: '#D69E2E',
        errorColor: '#E53E3E',
      },
    };
    return themes[theme] || themes.desert;
  };

  const getSizeStyles = () => {
    const sizes = {
      small: {
        padding: 12,
        borderRadius: 8,
        fontSize: 14,
        iconSize: 16,
        marginBottom: 8,
      },
      medium: {
        padding: 16,
        borderRadius: 12,
        fontSize: 16,
        iconSize: 20,
        marginBottom: 12,
      },
      large: {
        padding: 20,
        borderRadius: 16,
        fontSize: 18,
        iconSize: 24,
        marginBottom: 16,
      },
    };
    return sizes[size] || sizes.medium;
  };

  const getVariantStyles = () => {
    const variants = {
      default: {
        borderLeftColor: '#D2691E',
        borderLeftWidth: 4,
      },
      productivity: {
        borderLeftColor: '#38A169',
        borderLeftWidth: 4,
        backgroundColor: '#F0FDF4',
      },
      progress: {
        borderLeftColor: '#D69E2E',
        borderLeftWidth: 4,
        backgroundColor: '#FFFBEB',
      },
      goals: {
        borderLeftColor: '#3B82F6',
        borderLeftWidth: 4,
        backgroundColor: '#EFF6FF',
      },
      time: {
        borderLeftColor: '#8B5CF6',
        borderLeftWidth: 4,
        backgroundColor: '#F3F4F6',
      },
    };
    return variants[variant] || variants.default;
  };

  const themeStyles = getThemeStyles();
  const sizeStyles = getSizeStyles();
  const variantStyles = getVariantStyles();

  const cardStyle = [
    workPlanningCardStyles.card,
    {
      backgroundColor: themeStyles.backgroundColor,
      borderColor: themeStyles.borderColor,
      padding: sizeStyles.padding,
      borderRadius: sizeStyles.borderRadius,
      marginBottom: sizeStyles.marginBottom,
      shadowColor: themeStyles.shadowColor,
      ...variantStyles,
    },
    style,
  ];

  const titleStyleFinal = [
    workPlanningCardStyles.title,
    {
      fontSize: sizeStyles.fontSize,
      color: themeStyles.titleColor,
    },
    titleStyle,
  ];

  const valueStyleFinal = [
    workPlanningCardStyles.value,
    {
      fontSize: sizeStyles.fontSize * 1.5,
      color: themeStyles.valueColor,
    },
    valueStyle,
  ];

  const subtitleStyleFinal = [
    workPlanningCardStyles.subtitle,
    {
      fontSize: sizeStyles.fontSize * 0.875,
      color: themeStyles.subtitleColor,
    },
    subtitleStyle,
  ];

  const progressStyleFinal = [
    workPlanningCardStyles.progress,
    {
      fontSize: sizeStyles.fontSize * 0.875,
      color: themeStyles.progressColor,
    },
    progressStyle,
  ];

  const getIcon = () => {
    switch (variant) {
      case 'productivity':
        return 'trending-up';
      case 'progress':
        return 'bar-chart';
      case 'goals':
        return 'flag';
      case 'time':
        return 'time';
      default:
        return 'analytics';
    }
  };

  const getProgressColor = () => {
    if (data.progress >= 80) return themeStyles.successColor;
    if (data.progress >= 60) return themeStyles.warningColor;
    return themeStyles.errorColor;
  };

  const renderProductivityCard = () => (
    <View style={cardStyle}>
      <View style={workPlanningCardStyles.header}>
        <Icon
          name={getIcon()}
          size={sizeStyles.iconSize}
          color={themeStyles.valueColor}
        />
        <Text style={titleStyleFinal}>Productividad</Text>
      </View>
      
      <View style={workPlanningCardStyles.content}>
        <Text style={valueStyleFinal}>
          {data.tasksCompleted || 0}/{data.totalTasks || 0}
        </Text>
        <Text style={subtitleStyleFinal}>Tareas completadas</Text>
        
        {data.efficiency && (
          <View style={workPlanningCardStyles.progressContainer}>
            <Text style={progressStyleFinal}>
              Eficiencia: {data.efficiency}%
            </Text>
            <View style={workPlanningCardStyles.progressBar}>
              <View
                style={[
                  workPlanningCardStyles.progressFill,
                  {
                    width: `${data.efficiency}%`,
                    backgroundColor: getProgressColor(),
                  },
                ]}
              />
            </View>
          </View>
        )}
      </View>
    </View>
  );

  const renderProgressCard = () => (
    <View style={cardStyle}>
      <View style={workPlanningCardStyles.header}>
        <Icon
          name={getIcon()}
          size={sizeStyles.iconSize}
          color={themeStyles.valueColor}
        />
        <Text style={titleStyleFinal}>Progreso Semanal</Text>
      </View>
      
      <View style={workPlanningCardStyles.content}>
        <Text style={valueStyleFinal}>
          {data.day || 'Lunes'}
        </Text>
        <Text style={subtitleStyleFinal}>
          {data.tasks || 0} tareas • {data.hours || 0}h
        </Text>
        
        {data.completed && (
          <View style={workPlanningCardStyles.progressContainer}>
            <Text style={progressStyleFinal}>
              Completadas: {data.completed}/{data.tasks}
            </Text>
            <View style={workPlanningCardStyles.progressBar}>
              <View
                style={[
                  workPlanningCardStyles.progressFill,
                  {
                    width: `${(data.completed / data.tasks) * 100}%`,
                    backgroundColor: getProgressColor(),
                  },
                ]}
              />
            </View>
          </View>
        )}
      </View>
    </View>
  );

  const renderGoalsCard = () => (
    <View style={cardStyle}>
      <View style={workPlanningCardStyles.header}>
        <Icon
          name={getIcon()}
          size={sizeStyles.iconSize}
          color={themeStyles.valueColor}
        />
        <Text style={titleStyleFinal}>Metas Mensuales</Text>
      </View>
      
      <View style={workPlanningCardStyles.content}>
        <Text style={valueStyleFinal}>
          {data.title || 'Meta'}
        </Text>
        <Text style={subtitleStyleFinal}>
          Progreso: {data.progress || 0}%
        </Text>
        
        <View style={workPlanningCardStyles.progressContainer}>
          <View style={workPlanningCardStyles.progressBar}>
            <View
              style={[
                workPlanningCardStyles.progressFill,
                {
                  width: `${data.progress || 0}%`,
                  backgroundColor: getProgressColor(),
                },
              ]}
            />
          </View>
          <Text style={progressStyleFinal}>
            Vence: {data.deadline || 'Sin fecha'}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderTimeCard = () => (
    <View style={cardStyle}>
      <View style={workPlanningCardStyles.header}>
        <Icon
          name={getIcon()}
          size={sizeStyles.iconSize}
          color={themeStyles.valueColor}
        />
        <Text style={titleStyleFinal}>Seguimiento de Tiempo</Text>
      </View>
      
      <View style={workPlanningCardStyles.content}>
        <Text style={valueStyleFinal}>
          {data.totalHours || 0}h
        </Text>
        <Text style={subtitleStyleFinal}>
          Promedio: {data.averagePerDay || 0}h/día
        </Text>
        
        <View style={workPlanningCardStyles.statsContainer}>
          <View style={workPlanningCardStyles.statItem}>
            <Icon name="trending-up" size={sizeStyles.iconSize * 0.75} color={themeStyles.successColor} />
            <Text style={[progressStyleFinal, { color: themeStyles.successColor }]}>
              {data.mostProductiveDay || 'N/A'}
            </Text>
          </View>
          <View style={workPlanningCardStyles.statItem}>
            <Icon name="trending-down" size={sizeStyles.iconSize * 0.75} color={themeStyles.errorColor} />
            <Text style={[progressStyleFinal, { color: themeStyles.errorColor }]}>
              {data.leastProductiveDay || 'N/A'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderCard = () => {
    switch (variant) {
      case 'productivity':
        return renderProductivityCard();
      case 'progress':
        return renderProgressCard();
      case 'goals':
        return renderGoalsCard();
      case 'time':
        return renderTimeCard();
      default:
        return renderProductivityCard();
    }
  };

  return (
    <TouchableOpacity
      style={cardStyle}
      onPress={() => onViewDetails(variant)}
      activeOpacity={0.7}
    >
      {renderCard()}
    </TouchableOpacity>
  );
};

export default WorkPlanningCard;
