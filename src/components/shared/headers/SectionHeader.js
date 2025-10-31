import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { sectionHeaderStyles } from '../styles/sectionHeaderStyles';

const SectionHeader = ({
  title,
  subtitle,
  icon,
  image,
  theme = 'forest', // forest, ocean, desert, mountain, neutral
  size = 'medium', // small, medium, large
  style,
  titleStyle,
  subtitleStyle,
  iconStyle,
  imageStyle,
}) => {
  const getThemeStyles = () => {
    const themes = {
      forest: {
        backgroundColor: '#2D5016',
        borderColor: '#4A6741',
        titleColor: '#FFFFFF',
        subtitleColor: 'rgba(255, 255, 255, 0.9)',
        decorationColor: '#F0F4F7',
      },
      ocean: {
        backgroundColor: '#1E3A8A',
        borderColor: '#4A90E2',
        titleColor: '#FFFFFF',
        subtitleColor: 'rgba(255, 255, 255, 0.9)',
        decorationColor: '#F0F4F7',
      },
      desert: {
        backgroundColor: '#8B4513',
        borderColor: '#D2691E',
        titleColor: '#FFFFFF',
        subtitleColor: 'rgba(255, 255, 255, 0.9)',
        decorationColor: '#F0F4F7',
      },
      mountain: {
        backgroundColor: '#1E3A5F',
        borderColor: '#4A6B8A',
        titleColor: '#FFFFFF',
        subtitleColor: 'rgba(255, 255, 255, 0.9)',
        decorationColor: '#F0F4F7',
      },
      neutral: {
        backgroundColor: '#6C757D',
        borderColor: '#ADB5BD',
        titleColor: '#FFFFFF',
        subtitleColor: 'rgba(255, 255, 255, 0.9)',
        decorationColor: '#F8F9FA',
      },
    };
    return themes[theme] || themes.forest;
  };

  const getSizeStyles = () => {
    const sizes = {
      small: {
        padding: 12,
        borderRadius: 12,
        titleSize: 16,
        subtitleSize: 12,
        iconSize: 20,
        imageSize: 24,
      },
      medium: {
        padding: 20,
        borderRadius: 20,
        titleSize: 18,
        subtitleSize: 14,
        iconSize: 24,
        imageSize: 60,
      },
      large: {
        padding: 24,
        borderRadius: 24,
        titleSize: 20,
        subtitleSize: 16,
        iconSize: 28,
        imageSize: 80,
      },
    };
    return sizes[size] || sizes.medium;
  };

  const themeStyles = getThemeStyles();
  const sizeStyles = getSizeStyles();

  const containerStyle = [
    sectionHeaderStyles.container,
    {
      backgroundColor: themeStyles.backgroundColor,
      padding: sizeStyles.padding,
      borderTopLeftRadius: sizeStyles.borderRadius,
      borderTopRightRadius: sizeStyles.borderRadius,
      borderBottomWidth: 3,
      borderBottomColor: themeStyles.borderColor,
    },
    style,
  ];

  const titleTextStyle = [
    sectionHeaderStyles.title,
    {
      fontSize: sizeStyles.titleSize,
      color: themeStyles.titleColor,
    },
    titleStyle,
  ];

  const subtitleTextStyle = [
    sectionHeaderStyles.subtitle,
    {
      fontSize: sizeStyles.subtitleSize,
      color: themeStyles.subtitleColor,
    },
    subtitleStyle,
  ];

  const decorationStyle = [
    sectionHeaderStyles.decoration,
    {
      backgroundColor: themeStyles.decorationColor,
    },
  ];

  const imageStyleFinal = [
    sectionHeaderStyles.image,
    {
      width: sizeStyles.imageSize,
      height: sizeStyles.imageSize,
    },
    imageStyle,
  ];

  return (
    <View style={containerStyle}>
      <View style={sectionHeaderStyles.content}>
        <View style={sectionHeaderStyles.textContainer}>
          <View style={decorationStyle}>
            {image ? (
              <Image
                source={image}
                style={imageStyleFinal}
                resizeMode="contain"
              />
            ) : icon ? (
              <Icon
                name={icon}
                size={sizeStyles.iconSize}
                color="#4A7C59"
                style={iconStyle}
              />
            ) : null}
          </View>
          
          <Text style={titleTextStyle}>{title}</Text>
          {subtitle && (
            <Text style={subtitleTextStyle}>{subtitle}</Text>
          )}
        </View>
      </View>
    </View>
  );
};

export default SectionHeader;
