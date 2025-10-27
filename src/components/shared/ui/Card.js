import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { cardStyles } from '../styles/cardStyles';

const Card = ({
  children,
  title,
  subtitle,
  icon,
  onPress,
  variant = 'default', // default, elevated, outlined, filled
  theme = 'forest', // forest, ocean, desert, mountain, neutral
  size = 'medium', // small, medium, large
  style,
  titleStyle,
  subtitleStyle,
  iconStyle,
  contentStyle,
  ...props
}) => {
  const getThemeStyles = () => {
    const themes = {
      forest: {
        backgroundColor: '#F8FAF6',
        borderColor: '#E8F0E3',
        shadowColor: '#2D5016',
        titleColor: '#2D5016',
        subtitleColor: '#4A6741',
        iconColor: '#4A7C59',
      },
      ocean: {
        backgroundColor: '#F0F8FF',
        borderColor: '#E8F0F3',
        shadowColor: '#1E3A8A',
        titleColor: '#1E3A8A',
        subtitleColor: '#4A90E2',
        iconColor: '#4A90E2',
      },
      desert: {
        backgroundColor: '#FDF5E6',
        borderColor: '#F5E6D3',
        shadowColor: '#8B4513',
        titleColor: '#8B4513',
        subtitleColor: '#D2691E',
        iconColor: '#D2691E',
      },
      mountain: {
        backgroundColor: '#F8FAFC',
        borderColor: '#E8F0F3',
        shadowColor: '#1E3A5F',
        titleColor: '#1E3A5F',
        subtitleColor: '#4A6B8A',
        iconColor: '#4A6B8A',
      },
      neutral: {
        backgroundColor: '#FFFFFF',
        borderColor: '#E9ECEF',
        shadowColor: '#6C757D',
        titleColor: '#212529',
        subtitleColor: '#6C757D',
        iconColor: '#6C757D',
      },
    };
    return themes[theme] || themes.forest;
  };

  const getSizeStyles = () => {
    const sizes = {
      small: {
        padding: 12,
        borderRadius: 8,
        margin: 4,
        titleSize: 14,
        subtitleSize: 12,
        iconSize: 16,
      },
      medium: {
        padding: 16,
        borderRadius: 12,
        margin: 8,
        titleSize: 16,
        subtitleSize: 14,
        iconSize: 20,
      },
      large: {
        padding: 20,
        borderRadius: 16,
        margin: 12,
        titleSize: 18,
        subtitleSize: 16,
        iconSize: 24,
      },
    };
    return sizes[size] || sizes.medium;
  };

  const getVariantStyles = () => {
    const variants = {
      default: {
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        borderWidth: 0,
      },
      elevated: {
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
        borderWidth: 0,
      },
      outlined: {
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
        borderWidth: 1,
      },
      filled: {
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
        borderWidth: 0,
      },
    };
    return variants[variant] || variants.default;
  };

  const themeStyles = getThemeStyles();
  const sizeStyles = getSizeStyles();
  const variantStyles = getVariantStyles();

  const cardStyle = [
    cardStyles.card,
    {
      backgroundColor: themeStyles.backgroundColor,
      borderColor: themeStyles.borderColor,
      padding: sizeStyles.padding,
      borderRadius: sizeStyles.borderRadius,
      margin: sizeStyles.margin,
      shadowColor: themeStyles.shadowColor,
      ...variantStyles,
    },
    style,
  ];

  const titleStyleFinal = [
    cardStyles.title,
    {
      fontSize: sizeStyles.titleSize,
      color: themeStyles.titleColor,
    },
    titleStyle,
  ];

  const subtitleStyleFinal = [
    cardStyles.subtitle,
    {
      fontSize: sizeStyles.subtitleSize,
      color: themeStyles.subtitleColor,
    },
    subtitleStyle,
  ];

  const iconStyleFinal = [
    {
      color: themeStyles.iconColor,
      fontSize: sizeStyles.iconSize,
    },
    iconStyle,
  ];

  const contentStyleFinal = [
    cardStyles.content,
    contentStyle,
  ];

  const renderHeader = () => {
    if (!title && !subtitle && !icon) return null;

    return (
      <View style={cardStyles.header}>
        {icon && (
          <Icon
            name={icon}
            size={sizeStyles.iconSize}
            style={iconStyleFinal}
          />
        )}
        <View style={cardStyles.headerText}>
          {title && <Text style={titleStyleFinal}>{title}</Text>}
          {subtitle && <Text style={subtitleStyleFinal}>{subtitle}</Text>}
        </View>
      </View>
    );
  };

  const CardComponent = onPress ? TouchableOpacity : View;

  return (
    <CardComponent
      style={cardStyle}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      {...props}
    >
      {renderHeader()}
      {children && (
        <View style={contentStyleFinal}>
          {children}
        </View>
      )}
    </CardComponent>
  );
};

export default Card;
