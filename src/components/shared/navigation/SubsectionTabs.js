import React from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { subsectionTabsStyles } from '../styles/subsectionTabsStyles';

const SubsectionTabs = ({
  sections = [],
  activeSection,
  onSectionChange,
  theme = 'forest', // forest, ocean, desert, mountain, neutral
  size = 'medium', // small, medium, large
  showIcons = true,
  showLabels = true,
  horizontal = true,
  variant = 'default', // default, elegant
  style,
  tabStyle,
  activeTabStyle,
  tabTextStyle,
  activeTabTextStyle,
  iconStyle,
  activeIconStyle,
}) => {
  const getThemeStyles = () => {
    const themes = {
      forest: {
        containerBackground: '#2D5016',
        borderColor: '#4A6741',
        tabBackground: '#E8F0E3',
        activeTabBackground: '#4A7C59',
        tabTextColor: '#4A6741',
        activeTabTextColor: '#FFFFFF',
        activeIconColor: '#FFFFFF',
        inactiveIconColor: '#4A6741',
      },
      ocean: {
        containerBackground: '#1E3A8A',
        borderColor: '#4A90E2',
        tabBackground: '#E8F0F3',
        activeTabBackground: '#4A90E2',
        tabTextColor: '#1E3A8A',
        activeTabTextColor: '#FFFFFF',
        activeIconColor: '#FFFFFF',
        inactiveIconColor: '#1E3A8A',
      },
      desert: {
        containerBackground: '#8B4513',
        borderColor: '#D2691E',
        tabBackground: '#F5E6D3',
        activeTabBackground: '#D2691E',
        tabTextColor: '#8B4513',
        activeTabTextColor: '#FFFFFF',
        activeIconColor: '#FFFFFF',
        inactiveIconColor: '#8B4513',
      },
      mountain: {
        containerBackground: '#1E3A5F',
        borderColor: '#4A6B8A',
        tabBackground: '#E8F0F3',
        activeTabBackground: '#4A6B8A',
        tabTextColor: '#1E3A5F',
        activeTabTextColor: '#FFFFFF',
        activeIconColor: '#FFFFFF',
        inactiveIconColor: '#1E3A5F',
      },
      neutral: {
        containerBackground: '#6C757D',
        borderColor: '#ADB5BD',
        tabBackground: '#F8F9FA',
        activeTabBackground: '#ADB5BD',
        tabTextColor: '#6C757D',
        activeTabTextColor: '#FFFFFF',
        activeIconColor: '#FFFFFF',
        inactiveIconColor: '#6C757D',
      },
    };
    return themes[theme] || themes.forest;
  };

  const getSizeStyles = () => {
    const sizes = {
      small: {
        padding: 8,
        tabPadding: 8,
        borderRadius: 12,
        fontSize: 12,
        iconSize: 16,
        gap: 4,
        tabSize: 40,
      },
      medium: {
        padding: 12,
        tabPadding: 12,
        borderRadius: 20,
        fontSize: 14,
        iconSize: 20,
        gap: 8,
        tabSize: 50,
      },
      large: {
        padding: 16,
        tabPadding: 16,
        borderRadius: 24,
        fontSize: 16,
        iconSize: 24,
        gap: 12,
        tabSize: 60,
      },
    };
    return sizes[size] || sizes.medium;
  };

  const themeStyles = getThemeStyles();
  const sizeStyles = getSizeStyles();

  const containerStyle = [
    subsectionTabsStyles.container,
    {
      backgroundColor: themeStyles.containerBackground,
      borderBottomColor: themeStyles.borderColor,
      paddingVertical: sizeStyles.padding,
    },
    style,
  ];

  const scrollContentStyle = [
    subsectionTabsStyles.scrollContent,
    {
      paddingHorizontal: sizeStyles.padding,
    },
  ];

  const renderTab = (section) => {
    const isActive = activeSection === section.id;
    
    // Estilos para variante elegante
    const elegantTabStyle = variant === 'elegant' ? {
      width: sizeStyles.tabSize || 50,
      height: sizeStyles.tabSize || 50,
      borderRadius: sizeStyles.tabSize ? sizeStyles.tabSize / 2 : 25,
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: sizeStyles.gap / 2,
      borderWidth: 1,
      borderColor: isActive ? themeStyles.activeTabBackground : themeStyles.borderColor,
      backgroundColor: isActive ? themeStyles.activeTabBackground : themeStyles.tabBackground,
      shadowColor: isActive ? themeStyles.borderColor : 'transparent',
      shadowOffset: {
        width: 0,
        height: isActive ? 2 : 0,
      },
      shadowOpacity: isActive ? 0.3 : 0,
      shadowRadius: isActive ? 4 : 0,
      elevation: isActive ? 3 : 0,
      flexDirection: 'column', // Cambiar a columna para centrar el icono
    } : {};

    const tabStyleFinal = [
      variant === 'elegant' ? {} : subsectionTabsStyles.tab, // Solo aplicar estilos base si no es elegante
      variant === 'default' ? {
        backgroundColor: isActive ? themeStyles.activeTabBackground : themeStyles.tabBackground,
        paddingHorizontal: sizeStyles.tabPadding,
        paddingVertical: sizeStyles.tabPadding,
        borderRadius: sizeStyles.borderRadius,
        marginHorizontal: sizeStyles.gap / 2,
        borderWidth: 1,
        borderColor: isActive ? themeStyles.borderColor : 'transparent',
      } : {},
      elegantTabStyle,
      tabStyle,
      isActive && activeTabStyle,
    ];

    const tabTextStyleFinal = [
      subsectionTabsStyles.tabText,
      {
        fontSize: sizeStyles.fontSize,
        color: isActive ? themeStyles.activeTabTextColor : themeStyles.tabTextColor,
        marginLeft: showIcons && variant === 'default' ? sizeStyles.gap : 0,
      },
      tabTextStyle,
      isActive && activeTabTextStyle,
    ];

    const iconStyleFinal = [
      {
        color: isActive ? themeStyles.activeIconColor : themeStyles.inactiveIconColor,
      },
      iconStyle,
      isActive && activeIconStyle,
    ];

    return (
      <TouchableOpacity
        key={section.id}
        style={tabStyleFinal}
        onPress={() => onSectionChange(section.id)}
        activeOpacity={0.7}
      >
        {showIcons && section.icon && (
          <Icon
            name={section.icon}
            size={sizeStyles.iconSize}
            style={iconStyleFinal}
          />
        )}
        {showLabels && variant === 'default' && (
          <Text style={tabTextStyleFinal}>
            {section.name}
          </Text>
        )}
        {isActive && variant === 'elegant' && (
          <View style={[
            subsectionTabsStyles.activeIndicator,
            {
              backgroundColor: themeStyles.activeTabBackground,
            }
          ]} />
        )}
      </TouchableOpacity>
    );
  };

  const renderTabs = () => {
    if (horizontal) {
      return (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={scrollContentStyle}
        >
          {sections.map(renderTab)}
        </ScrollView>
      );
    } else {
      return (
        <View style={subsectionTabsStyles.verticalContainer}>
          {sections.map(renderTab)}
        </View>
      );
    }
  };

  return (
    <View style={containerStyle}>
      {renderTabs()}
    </View>
  );
};

export default SubsectionTabs;
