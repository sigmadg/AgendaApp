import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { projectCardStyles } from '../styles/projectCardStyles';

const ProjectCard = ({
  project,
  onEdit,
  onDelete,
  onViewGoals,
  onAddGoal,
  theme = 'desert',
  size = 'medium',
  variant = 'default', // default, active, completed, on-hold
  style,
  titleStyle,
  descriptionStyle,
  deadlineStyle,
  progressStyle,
  statusStyle,
}) => {
  const getThemeStyles = () => {
    const themes = {
      desert: {
        backgroundColor: '#FDF5E6',
        borderColor: '#F5E6D3',
        shadowColor: '#8B4513',
        titleColor: '#8B4513',
        descriptionColor: '#6B7280',
        deadlineColor: '#D2691E',
        progressColor: '#D2691E',
        statusColor: '#D2691E',
        activeColor: '#38A169',
        completedColor: '#38A169',
        onHoldColor: '#D69E2E',
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
      active: {
        borderLeftColor: '#38A169',
        borderLeftWidth: 4,
        backgroundColor: '#F0FDF4',
      },
      completed: {
        borderLeftColor: '#38A169',
        borderLeftWidth: 4,
        opacity: 0.8,
      },
      'on-hold': {
        borderLeftColor: '#D69E2E',
        borderLeftWidth: 4,
        backgroundColor: '#FFFBEB',
      },
    };
    return variants[variant] || variants.default;
  };

  const themeStyles = getThemeStyles();
  const sizeStyles = getSizeStyles();
  const variantStyles = getVariantStyles();

  const cardStyle = [
    projectCardStyles.card,
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
    projectCardStyles.title,
    {
      fontSize: sizeStyles.fontSize,
      color: themeStyles.titleColor,
    },
    titleStyle,
  ];

  const descriptionStyleFinal = [
    projectCardStyles.description,
    {
      fontSize: sizeStyles.fontSize * 0.875,
      color: themeStyles.descriptionColor,
    },
    descriptionStyle,
  ];

  const deadlineStyleFinal = [
    projectCardStyles.deadline,
    {
      fontSize: sizeStyles.fontSize * 0.875,
      color: themeStyles.deadlineColor,
    },
    deadlineStyle,
  ];

  const progressStyleFinal = [
    projectCardStyles.progress,
    {
      fontSize: sizeStyles.fontSize * 0.875,
      color: themeStyles.progressColor,
    },
    progressStyle,
  ];

  const statusStyleFinal = [
    projectCardStyles.status,
    {
      fontSize: sizeStyles.fontSize * 0.75,
      color: variant === 'active' ? themeStyles.activeColor : 
             variant === 'completed' ? themeStyles.completedColor : 
             variant === 'on-hold' ? themeStyles.onHoldColor : themeStyles.statusColor,
    },
    statusStyle,
  ];

  const getStatusIcon = () => {
    switch (variant) {
      case 'active':
        return 'play-circle';
      case 'completed':
        return 'checkmark-circle';
      case 'on-hold':
        return 'pause-circle';
      default:
        return 'folder';
    }
  };

  const getStatusText = () => {
    switch (variant) {
      case 'active':
        return 'Activo';
      case 'completed':
        return 'Completado';
      case 'on-hold':
        return 'En Pausa';
      default:
        return 'Planificado';
    }
  };

  const getProgressColor = () => {
    if (project.progress >= 80) return themeStyles.completedColor;
    if (project.progress >= 60) return themeStyles.activeColor;
    if (project.progress >= 40) return themeStyles.statusColor;
    return themeStyles.onHoldColor;
  };

  return (
    <View style={cardStyle}>
      <View style={projectCardStyles.header}>
        <View style={projectCardStyles.titleContainer}>
          <Icon
            name="folder-outline"
            size={sizeStyles.iconSize}
            color={themeStyles.titleColor}
          />
          <View style={projectCardStyles.titleContent}>
            <Text style={titleStyleFinal}>{project.title}</Text>
            {project.description && (
              <Text style={descriptionStyleFinal}>{project.description}</Text>
            )}
          </View>
        </View>
        
        <View style={projectCardStyles.statusContainer}>
          <Icon
            name={getStatusIcon()}
            size={sizeStyles.iconSize * 0.75}
            color={variant === 'active' ? themeStyles.activeColor : 
                   variant === 'completed' ? themeStyles.completedColor : 
                   variant === 'on-hold' ? themeStyles.onHoldColor : themeStyles.statusColor}
          />
          <Text style={statusStyleFinal}>
            {getStatusText()}
          </Text>
        </View>
      </View>
      
      <View style={projectCardStyles.content}>
        {project.deadline && (
          <View style={projectCardStyles.infoRow}>
            <Icon name="calendar-outline" size={sizeStyles.iconSize * 0.75} color={themeStyles.deadlineColor} />
            <Text style={deadlineStyleFinal}>
              Vence: {project.deadline}
            </Text>
          </View>
        )}
        
        <View style={projectCardStyles.progressContainer}>
          <View style={projectCardStyles.progressRow}>
            <Icon name="trending-up-outline" size={sizeStyles.iconSize * 0.75} color={themeStyles.progressColor} />
            <Text style={progressStyleFinal}>
              Progreso: {project.progress || 0}%
            </Text>
          </View>
          
          <View style={projectCardStyles.progressBar}>
            <View
              style={[
                projectCardStyles.progressFill,
                {
                  width: `${project.progress || 0}%`,
                  backgroundColor: getProgressColor(),
                },
              ]}
            />
          </View>
        </View>
        
        {project.goals && project.goals.length > 0 && (
          <View style={projectCardStyles.goalsContainer}>
            <Text style={[projectCardStyles.goalsTitle, { color: themeStyles.titleColor }]}>
              Metas ({project.goals.length})
            </Text>
            {project.goals.slice(0, 3).map((goal, index) => (
              <View key={index} style={projectCardStyles.goalItem}>
                <Icon
                  name={goal.completed ? "checkmark-circle" : "ellipse-outline"}
                  size={sizeStyles.iconSize * 0.75}
                  color={goal.completed ? themeStyles.completedColor : themeStyles.statusColor}
                />
                <Text style={[projectCardStyles.goalText, { color: themeStyles.descriptionColor }]}>
                  {goal.title}
                </Text>
              </View>
            ))}
            {project.goals.length > 3 && (
              <Text style={[projectCardStyles.moreGoals, { color: themeStyles.statusColor }]}>
                +{project.goals.length - 3} metas más
              </Text>
            )}
          </View>
        )}
      </View>
      
      <View style={projectCardStyles.footer}>
        <TouchableOpacity
          style={projectCardStyles.actionButton}
          onPress={() => onViewGoals(project.id)}
        >
          <Icon name="list-outline" size={sizeStyles.iconSize * 0.75} color={themeStyles.statusColor} />
          <Text style={[projectCardStyles.actionButtonText, { color: themeStyles.statusColor }]}>
            Ver Metas
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={projectCardStyles.actionButton}
          onPress={() => onAddGoal(project.id)}
        >
          <Icon name="add-circle-outline" size={sizeStyles.iconSize * 0.75} color={themeStyles.statusColor} />
          <Text style={[projectCardStyles.actionButtonText, { color: themeStyles.statusColor }]}>
            Agregar Meta
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={projectCardStyles.actionButton}
          onPress={() => onEdit(project.id)}
        >
          <Icon name="create-outline" size={sizeStyles.iconSize * 0.75} color={themeStyles.statusColor} />
          <Text style={[projectCardStyles.actionButtonText, { color: themeStyles.statusColor }]}>
            Editar
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={projectCardStyles.actionButton}
          onPress={() => onDelete(project.id)}
        >
          <Icon name="trash-outline" size={sizeStyles.iconSize * 0.75} color="#E53E3E" />
          <Text style={[projectCardStyles.actionButtonText, { color: '#E53E3E' }]}>
            Eliminar
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProjectCard;
