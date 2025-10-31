import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { goalCardStyles } from '../styles/goalCardStyles';

const GoalCard = ({
  goal,
  onToggle,
  onEdit,
  onDelete,
  onAddPerson,
  onAddDate,
  theme = 'desert',
  size = 'medium',
  variant = 'default', // default, completed, overdue, urgent
  style,
  titleStyle,
  dateStyle,
  personStyle,
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
        personColor: '#6B7280',
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
    goalCardStyles.card,
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
    goalCardStyles.title,
    {
      fontSize: sizeStyles.fontSize,
      color: themeStyles.titleColor,
      textDecorationLine: variant === 'completed' ? 'line-through' : 'none',
    },
    titleStyle,
  ];

  const dateStyleFinal = [
    goalCardStyles.date,
    {
      fontSize: sizeStyles.fontSize * 0.875,
      color: themeStyles.dateColor,
    },
    dateStyle,
  ];

  const personStyleFinal = [
    goalCardStyles.person,
    {
      fontSize: sizeStyles.fontSize * 0.875,
      color: themeStyles.personColor,
    },
    personStyle,
  ];

  const priorityStyleFinal = [
    goalCardStyles.priority,
    {
      fontSize: sizeStyles.fontSize * 0.75,
      color: themeStyles.priorityColor,
    },
    priorityStyle,
  ];

  const statusStyleFinal = [
    goalCardStyles.status,
    {
      fontSize: sizeStyles.fontSize * 0.75,
      color: variant === 'completed' ? themeStyles.completedColor : 
             variant === 'overdue' ? themeStyles.overdueColor : 
             variant === 'urgent' ? themeStyles.urgentColor : themeStyles.priorityColor,
    },
    statusStyle,
  ];

  const getPriorityIcon = () => {
    switch (goal.priority) {
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
    if (goal.completed) return 'checkmark-circle';
    if (goal.overdue) return 'warning';
    if (goal.urgent) return 'flash';
    return 'time';
  };

  const getStatusText = () => {
    if (goal.completed) return 'Completada';
    if (goal.overdue) return 'Vencida';
    if (goal.urgent) return 'Urgente';
    return 'Pendiente';
  };

  return (
    <View style={cardStyle}>
      <View style={goalCardStyles.header}>
        <TouchableOpacity
          style={goalCardStyles.checkbox}
          onPress={() => onToggle(goal.id)}
        >
          <Icon
            name={goal.completed ? "checkmark-circle" : "ellipse-outline"}
            size={sizeStyles.iconSize}
            color={goal.completed ? themeStyles.completedColor : themeStyles.priorityColor}
          />
        </TouchableOpacity>
        
        <View style={goalCardStyles.content}>
          <Text style={titleStyleFinal}>{goal.title}</Text>
          
          {goal.date && (
            <View style={goalCardStyles.infoRow}>
              <Icon name="calendar-outline" size={sizeStyles.iconSize * 0.75} color={themeStyles.dateColor} />
              <Text style={dateStyleFinal}>
                {goal.date}
              </Text>
            </View>
          )}
          
          {goal.person && (
            <View style={goalCardStyles.infoRow}>
              <Icon name="person-outline" size={sizeStyles.iconSize * 0.75} color={themeStyles.personColor} />
              <Text style={personStyleFinal}>
                {goal.person}
              </Text>
            </View>
          )}
        </View>
        
        <View style={goalCardStyles.actions}>
          {goal.priority && (
            <View style={goalCardStyles.priorityContainer}>
              <Icon
                name={getPriorityIcon()}
                size={sizeStyles.iconSize * 0.75}
                color={themeStyles.priorityColor}
              />
              <Text style={priorityStyleFinal}>
                {goal.priority.toUpperCase()}
              </Text>
            </View>
          )}
          
          <View style={goalCardStyles.statusContainer}>
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
      
      <View style={goalCardStyles.footer}>
        <TouchableOpacity
          style={goalCardStyles.actionButton}
          onPress={() => onAddDate(goal.id)}
        >
          <Icon name="calendar-outline" size={sizeStyles.iconSize * 0.75} color={themeStyles.priorityColor} />
          <Text style={[goalCardStyles.actionButtonText, { color: themeStyles.priorityColor }]}>
            Fecha
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={goalCardStyles.actionButton}
          onPress={() => onAddPerson(goal.id)}
        >
          <Icon name="person-outline" size={sizeStyles.iconSize * 0.75} color={themeStyles.priorityColor} />
          <Text style={[goalCardStyles.actionButtonText, { color: themeStyles.priorityColor }]}>
            Persona
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={goalCardStyles.actionButton}
          onPress={() => onEdit(goal.id)}
        >
          <Icon name="create-outline" size={sizeStyles.iconSize * 0.75} color={themeStyles.priorityColor} />
          <Text style={[goalCardStyles.actionButtonText, { color: themeStyles.priorityColor }]}>
            Editar
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={goalCardStyles.actionButton}
          onPress={() => onDelete(goal.id)}
        >
          <Icon name="trash-outline" size={sizeStyles.iconSize * 0.75} color="#E53E3E" />
          <Text style={[goalCardStyles.actionButtonText, { color: '#E53E3E' }]}>
            Eliminar
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default GoalCard;
