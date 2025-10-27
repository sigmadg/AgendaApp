import React from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { elegantSubsectionTabsStyles } from '../styles/elegantSubsectionTabsStyles';

const ElegantSubsectionTabs = ({
  sections = [],
  activeSection,
  onSectionChange,
  theme = 'elegant', // elegant, forest, ocean, desert, mountain
  size = 'medium', // small, medium, large
  showIcons = true,
  showLabels = false, // Default to false for elegant style
  horizontal = true,
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
      elegant: {
        containerBackground: '#F5F5DC', // Beige claro
        borderColor: '#D2B48C', // Beige dorado
        tabBackground: '#F5F5DC', // Beige claro
        activeTabBackground: '#8B4513', // Marrón sólido
        tabTextColor: '#8B4513',
        activeTabTextColor: '#FFFFFF',
        activeIconColor: '#FFFFFF',
        inactiveIconColor: '#8B4513', // Marrón dorado
        shadowColor: '#D2B48C',
      },
      forest: {
        containerBackground: '#E8F0E3',
        borderColor: '#4A6741',
        tabBackground: '#E8F0E3',
        activeTabBackground: '#4A7C59',
        tabTextColor: '#4A6741',
        activeTabTextColor: '#FFFFFF',
        activeIconColor: '#FFFFFF',
        inactiveIconColor: '#4A6741',
        shadowColor: '#4A6741',
      },
      ocean: {
        containerBackground: '#E8F0F3',
        borderColor: '#4A90E2',
        tabBackground: '#E8F0F3',
        activeTabBackground: '#4A90E2',
        tabTextColor: '#1E3A8A',
        activeTabTextColor: '#FFFFFF',
        activeIconColor: '#FFFFFF',
        inactiveIconColor: '#1E3A8A',
        shadowColor: '#4A90E2',
      },
      desert: {
        containerBackground: '#F5E6D3',
        borderColor: '#D2691E',
        tabBackground: '#F5E6D3',
        activeTabBackground: '#D2691E',
        tabTextColor: '#8B4513',
        activeTabTextColor: '#FFFFFF',
        activeIconColor: '#FFFFFF',
        inactiveIconColor: '#8B4513',
        shadowColor: '#D2691E',
      },
      mountain: {
        containerBackground: '#F0F0F0',
        borderColor: '#708090',
        tabBackground: '#F0F0F0',
        activeTabBackground: '#708090',
        tabTextColor: '#2F4F4F',
        activeTabTextColor: '#FFFFFF',
        activeIconColor: '#FFFFFF',
        inactiveIconColor: '#2F4F4F',
        shadowColor: '#708090',
      },
    };
    return themes[theme] || themes.elegant;
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
        containerPadding: 12,
      },
      medium: {
        padding: 12,
        tabPadding: 12,
        borderRadius: 20,
        fontSize: 14,
        iconSize: 20,
        gap: 8,
        tabSize: 50,
        containerPadding: 16,
      },
      large: {
        padding: 16,
        tabPadding: 16,
        borderRadius: 24,
        fontSize: 16,
        iconSize: 24,
        gap: 12,
        tabSize: 60,
        containerPadding: 20,
      },
    };
    return sizes[size] || sizes.medium;
  };

  const themeStyles = getThemeStyles();
  const sizeStyles = getSizeStyles();

  const containerStyle = [
    elegantSubsectionTabsStyles.container,
    {
      backgroundColor: themeStyles.containerBackground,
      borderColor: themeStyles.borderColor,
      paddingVertical: sizeStyles.containerPadding,
      paddingHorizontal: sizeStyles.containerPadding,
    },
    style,
  ];

  const renderTab = (section) => {
    const isActive = activeSection === section.id;

    const tabStyleFinal = [
      elegantSubsectionTabsStyles.tab,
      {
        width: sizeStyles.tabSize,
        height: sizeStyles.tabSize,
        borderRadius: sizeStyles.tabSize / 2, // Perfect circle
        backgroundColor: isActive ? themeStyles.activeTabBackground : themeStyles.tabBackground,
        borderWidth: 1,
        borderColor: isActive ? themeStyles.activeTabBackground : themeStyles.borderColor,
        marginHorizontal: sizeStyles.gap / 2,
        shadowColor: isActive ? themeStyles.shadowColor : 'transparent',
        shadowOffset: {
          width: 0,
          height: isActive ? 3 : 0,
        },
        shadowOpacity: isActive ? 0.3 : 0,
        shadowRadius: isActive ? 6 : 0,
        elevation: isActive ? 4 : 0,
      },
      tabStyle,
      isActive && activeTabStyle,
    ];

    const iconStyleFinal = [
      {
        color: isActive ? themeStyles.activeIconColor : themeStyles.inactiveIconColor,
      },
      iconStyle,
      isActive && activeIconStyle,
    ];

    return (
      <View key={section.id} style={elegantSubsectionTabsStyles.tabContainer}>
        <TouchableOpacity
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
        </TouchableOpacity>
        
        {/* Indicador de selección - punto debajo */}
        {isActive && (
          <View style={[
            elegantSubsectionTabsStyles.activeIndicator,
            {
              backgroundColor: themeStyles.activeTabBackground,
            }
          ]} />
        )}
      </View>
    );
  };

  const renderTabs = () => {
    if (horizontal) {
      return (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={elegantSubsectionTabsStyles.scrollContent}
        >
          {sections.map(renderTab)}
        </ScrollView>
      );
    }

    return (
      <View style={elegantSubsectionTabsStyles.verticalContainer}>
        {sections.map(renderTab)}
      </View>
    );
  };

  return (
    <View style={containerStyle}>
      {renderTabs()}
    </View>
  );
};

export default ElegantSubsectionTabs;