import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { taskCardStyles } from '../styles/taskCardStyles';

const TaskCard = ({
  task,
  onToggle,
  onEdit,
  onDelete,
  onAddNotes,
  theme = 'desert',
  size = 'medium',
  variant = 'default', // default, completed, overdue, urgent
  style,
  titleStyle,
  dateStyle,
  notesStyle,
  priorityStyle,
  statusStyle,
}) => {
  const getThemeStyles = () => {
    const themes = {
      desert: {
        backgroundColor: '#FDF5E6',
        borderColor: '#F5E6D3',
        shadowColor: '#8B4513',
        titleColor: '#8B4513',
        dateColor: '#D2691E',
        notesColor: '#6B7280',
        priorityColor: '#D2691E',
        completedColor: '#38A169',
        overdueColor: '#E53E3E',
        urgentColor: '#FF6B6B',
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
      completed: {
        borderLeftColor: '#38A169',
        borderLeftWidth: 4,
        opacity: 0.8,
      },
      overdue: {
        borderLeftColor: '#E53E3E',
        borderLeftWidth: 4,
        backgroundColor: '#FEF2F2',
      },
      urgent: {
        borderLeftColor: '#FF6B6B',
        borderLeftWidth: 4,
        backgroundColor: '#FFF5F5',
      },
    };
    return variants[variant] || variants.default;
  };

  const themeStyles = getThemeStyles();
  const sizeStyles = getSizeStyles();
  const variantStyles = getVariantStyles();

  const cardStyle = [
    taskCardStyles.card,
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
    taskCardStyles.title,
    {
      fontSize: sizeStyles.fontSize,
      color: themeStyles.titleColor,
      textDecorationLine: variant === 'completed' ? 'line-through' : 'none',
    },
    titleStyle,
  ];

  const dateStyleFinal = [
    taskCardStyles.date,
    {
      fontSize: sizeStyles.fontSize * 0.875,
      color: themeStyles.dateColor,
    },
    dateStyle,
  ];

  const notesStyleFinal = [
    taskCardStyles.notes,
    {
      fontSize: sizeStyles.fontSize * 0.875,
      color: themeStyles.notesColor,
    },
    notesStyle,
  ];

  const priorityStyleFinal = [
    taskCardStyles.priority,
    {
      fontSize: sizeStyles.fontSize * 0.75,
      color: themeStyles.priorityColor,
    },
    priorityStyle,
  ];

  const statusStyleFinal = [
    taskCardStyles.status,
    {
      fontSize: sizeStyles.fontSize * 0.75,
      color: variant === 'completed' ? themeStyles.completedColor : 
             variant === 'overdue' ? themeStyles.overdueColor : 
             variant === 'urgent' ? themeStyles.urgentColor : themeStyles.priorityColor,
    },
    statusStyle,
  ];

  const getPriorityIcon = () => {
    switch (task.priority) {
      case 'high':
        return 'arrow-up';
      case 'medium':
        return 'remove';
      case 'low':
        return 'arrow-down';
      default:
        return 'remove';
    }
  };

  const getStatusIcon = () => {
    if (task.completed) return 'checkmark-circle';
    if (task.overdue) return 'warning';
    if (task.urgent) return 'flash';
    return 'time';
  };

  const getStatusText = () => {
    if (task.completed) return 'Completada';
    if (task.overdue) return 'Vencida';
    if (task.urgent) return 'Urgente';
    return 'Pendiente';
  };

  return (
    <View style={cardStyle}>
      <View style={taskCardStyles.header}>
        <TouchableOpacity
          style={taskCardStyles.checkbox}
          onPress={() => onToggle(task.id)}
        >
          <Icon
            name={task.completed ? "checkmark-circle" : "ellipse-outline"}
            size={sizeStyles.iconSize}
            color={task.completed ? themeStyles.completedColor : themeStyles.priorityColor}
          />
        </TouchableOpacity>
        
        <View style={taskCardStyles.content}>
          <Text style={titleStyleFinal}>{task.title}</Text>
          {task.date && (
            <Text style={dateStyleFinal}>
              <Icon name="calendar-outline" size={sizeStyles.iconSize * 0.75} color={themeStyles.dateColor} />
              {' '}{task.date}
            </Text>
          )}
          {task.notes && (
            <Text style={notesStyleFinal}>
              <Icon name="document-text-outline" size={sizeStyles.iconSize * 0.75} color={themeStyles.notesColor} />
              {' '}{task.notes}
            </Text>
          )}
        </View>
        
        <View style={taskCardStyles.actions}>
          {task.priority && (
            <View style={taskCardStyles.priorityContainer}>
              <Icon
                name={getPriorityIcon()}
                size={sizeStyles.iconSize * 0.75}
                color={themeStyles.priorityColor}
              />
              <Text style={priorityStyleFinal}>
                {task.priority.toUpperCase()}
              </Text>
            </View>
          )}
          
          <View style={taskCardStyles.statusContainer}>
            <Icon
              name={getStatusIcon()}
              size={sizeStyles.iconSize * 0.75}
              color={variant === 'completed' ? themeStyles.completedColor : 
                     variant === 'overdue' ? themeStyles.overdueColor : 
                     variant === 'urgent' ? themeStyles.urgentColor : themeStyles.priorityColor}
            />
            <Text style={statusStyleFinal}>
              {getStatusText()}
            </Text>
          </View>
        </View>
      </View>
      
      <View style={taskCardStyles.footer}>
        <TouchableOpacity
          style={taskCardStyles.actionButton}
          onPress={() => onAddNotes(task.id)}
        >
          <Icon name="document-text-outline" size={sizeStyles.iconSize * 0.75} color={themeStyles.priorityColor} />
          <Text style={[taskCardStyles.actionButtonText, { color: themeStyles.priorityColor }]}>
            Notas
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={taskCardStyles.actionButton}
          onPress={() => onEdit(task.id)}
        >
          <Icon name="create-outline" size={sizeStyles.iconSize * 0.75} color={themeStyles.priorityColor} />
          <Text style={[taskCardStyles.actionButtonText, { color: themeStyles.priorityColor }]}>
            Editar
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={taskCardStyles.actionButton}
          onPress={() => onDelete(task.id)}
        >
          <Icon name="trash-outline" size={sizeStyles.iconSize * 0.75} color="#E53E3E" />
          <Text style={[taskCardStyles.actionButtonText, { color: '#E53E3E' }]}>
            Eliminar
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TaskCard;
