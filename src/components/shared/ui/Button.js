import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { buttonStyles } from '../styles/buttonStyles';

const Button = ({
  title,
  onPress,
  variant = 'primary', // primary, secondary, outline, ghost, danger, success, warning
  size = 'medium', // small, medium, large
  theme = 'forest', // forest, ocean, desert, mountain, neutral
  icon,
  iconPosition = 'left', // left, right
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
  textStyle,
  iconStyle,
  loadingColor,
  loadingSize = 'small',
  ...props
}) => {
  const getThemeStyles = () => {
    const themes = {
      forest: {
        primary: {
          backgroundColor: '#4A7C59',
          borderColor: '#4A7C59',
          textColor: '#FFFFFF',
        },
        secondary: {
          backgroundColor: '#E8F0E3',
          borderColor: '#4A6741',
          textColor: '#4A6741',
        },
        outline: {
          backgroundColor: 'transparent',
          borderColor: '#4A7C59',
          textColor: '#4A7C59',
        },
        ghost: {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          textColor: '#4A7C59',
        },
        danger: {
          backgroundColor: '#E53E3E',
          borderColor: '#E53E3E',
          textColor: '#FFFFFF',
        },
        success: {
          backgroundColor: '#38A169',
          borderColor: '#38A169',
          textColor: '#FFFFFF',
        },
        warning: {
          backgroundColor: '#D69E2E',
          borderColor: '#D69E2E',
          textColor: '#FFFFFF',
        },
      },
      ocean: {
        primary: {
          backgroundColor: '#4A90E2',
          borderColor: '#4A90E2',
          textColor: '#FFFFFF',
        },
        secondary: {
          backgroundColor: '#E8F0F3',
          borderColor: '#1E3A8A',
          textColor: '#1E3A8A',
        },
        outline: {
          backgroundColor: 'transparent',
          borderColor: '#4A90E2',
          textColor: '#4A90E2',
        },
        ghost: {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          textColor: '#4A90E2',
        },
        danger: {
          backgroundColor: '#E53E3E',
          borderColor: '#E53E3E',
          textColor: '#FFFFFF',
        },
        success: {
          backgroundColor: '#38A169',
          borderColor: '#38A169',
          textColor: '#FFFFFF',
        },
        warning: {
          backgroundColor: '#D69E2E',
          borderColor: '#D69E2E',
          textColor: '#FFFFFF',
        },
      },
      desert: {
        primary: {
          backgroundColor: '#D2691E',
          borderColor: '#D2691E',
          textColor: '#FFFFFF',
        },
        secondary: {
          backgroundColor: '#F5E6D3',
          borderColor: '#8B4513',
          textColor: '#8B4513',
        },
        outline: {
          backgroundColor: 'transparent',
          borderColor: '#D2691E',
          textColor: '#D2691E',
        },
        ghost: {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          textColor: '#D2691E',
        },
        danger: {
          backgroundColor: '#E53E3E',
          borderColor: '#E53E3E',
          textColor: '#FFFFFF',
        },
        success: {
          backgroundColor: '#38A169',
          borderColor: '#38A169',
          textColor: '#FFFFFF',
        },
        warning: {
          backgroundColor: '#D69E2E',
          borderColor: '#D69E2E',
          textColor: '#FFFFFF',
        },
      },
      mountain: {
        primary: {
          backgroundColor: '#4A6B8A',
          borderColor: '#4A6B8A',
          textColor: '#FFFFFF',
        },
        secondary: {
          backgroundColor: '#E8F0F3',
          borderColor: '#1E3A5F',
          textColor: '#1E3A5F',
        },
        outline: {
          backgroundColor: 'transparent',
          borderColor: '#4A6B8A',
          textColor: '#4A6B8A',
        },
        ghost: {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          textColor: '#4A6B8A',
        },
        danger: {
          backgroundColor: '#E53E3E',
          borderColor: '#E53E3E',
          textColor: '#FFFFFF',
        },
        success: {
          backgroundColor: '#38A169',
          borderColor: '#38A169',
          textColor: '#FFFFFF',
        },
        warning: {
          backgroundColor: '#D69E2E',
          borderColor: '#D69E2E',
          textColor: '#FFFFFF',
        },
      },
      neutral: {
        primary: {
          backgroundColor: '#6C757D',
          borderColor: '#6C757D',
          textColor: '#FFFFFF',
        },
        secondary: {
          backgroundColor: '#F8F9FA',
          borderColor: '#6C757D',
          textColor: '#6C757D',
        },
        outline: {
          backgroundColor: 'transparent',
          borderColor: '#6C757D',
          textColor: '#6C757D',
        },
        ghost: {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          textColor: '#6C757D',
        },
        danger: {
          backgroundColor: '#E53E3E',
          borderColor: '#E53E3E',
          textColor: '#FFFFFF',
        },
        success: {
          backgroundColor: '#38A169',
          borderColor: '#38A169',
          textColor: '#FFFFFF',
        },
        warning: {
          backgroundColor: '#D69E2E',
          borderColor: '#D69E2E',
          textColor: '#FFFFFF',
        },
      },
    };
    return themes[theme] || themes.forest;
  };

  const getSizeStyles = () => {
    const sizes = {
      small: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        fontSize: 12,
        iconSize: 16,
        borderRadius: 8,
        minHeight: 32,
      },
      medium: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 14,
        iconSize: 20,
        borderRadius: 12,
        minHeight: 40,
      },
      large: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        fontSize: 16,
        iconSize: 24,
        borderRadius: 16,
        minHeight: 48,
      },
    };
    return sizes[size] || sizes.medium;
  };

  const themeStyles = getThemeStyles();
  const sizeStyles = getSizeStyles();
  const variantStyles = themeStyles[variant] || themeStyles.primary;

  const buttonStyle = [
    buttonStyles.button,
    {
      backgroundColor: variantStyles.backgroundColor,
      borderColor: variantStyles.borderColor,
      borderWidth: 1,
      paddingHorizontal: sizeStyles.paddingHorizontal,
      paddingVertical: sizeStyles.paddingVertical,
      borderRadius: sizeStyles.borderRadius,
      minHeight: sizeStyles.minHeight,
      opacity: disabled ? 0.6 : 1,
      width: fullWidth ? '100%' : 'auto',
    },
    style,
  ];

  const textStyleFinal = [
    buttonStyles.text,
    {
      fontSize: sizeStyles.fontSize,
      color: variantStyles.textColor,
      fontWeight: '600',
    },
    textStyle,
  ];

  const iconStyleFinal = [
    {
      color: variantStyles.textColor,
      fontSize: sizeStyles.iconSize,
    },
    iconStyle,
  ];

  const renderContent = () => {
    if (loading) {
      return (
        <ActivityIndicator
          size={loadingSize}
          color={loadingColor || variantStyles.textColor}
        />
      );
    }

    const iconElement = icon && (
      <Icon
        name={icon}
        size={sizeStyles.iconSize}
        style={iconStyleFinal}
      />
    );

    const textElement = title && (
      <Text style={textStyleFinal}>{title}</Text>
    );

    if (iconPosition === 'left') {
      return (
        <View style={buttonStyles.content}>
          {iconElement}
          {textElement}
        </View>
      );
    } else {
      return (
        <View style={buttonStyles.content}>
          {textElement}
          {iconElement}
        </View>
      );
    }
  };

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...props}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

export default Button;
