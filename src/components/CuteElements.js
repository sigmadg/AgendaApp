import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../styles/globalStyles';

// Componente de título cute
export const CuteTitle = ({ children, style, ...props }) => (
  <Text style={[styles.cuteTitle, style]} {...props}>
    {children}
  </Text>
);

// Componente de texto cute
export const CuteText = ({ children, style, ...props }) => (
  <Text style={[styles.cuteText, style]} {...props}>
    {children}
  </Text>
);

// Componente de tarjeta cute
export const CuteCard = ({ children, style, ...props }) => (
  <View style={[styles.cuteCard, style]} {...props}>
    {children}
  </View>
);

// Componente de botón cute
export const CuteButton = ({ children, onPress, style, textStyle, variant = 'primary', ...props }) => (
  <TouchableOpacity 
    style={[
      styles.cuteButton, 
      variant === 'secondary' && styles.cuteButtonSecondary,
      variant === 'accent' && styles.cuteButtonAccent,
      style
    ]} 
    onPress={onPress}
    {...props}
  >
    <Text style={[styles.cuteButtonText, textStyle]}>
      {children}
    </Text>
  </TouchableOpacity>
);

// Componente de elemento decorativo
export const CuteElement = ({ type = 'heart', size = 24, color = colors.primary, style, ...props }) => {
  const getIcon = () => {
    switch (type) {
      case 'heart': return '❤️';
      case 'star': return '⭐';
      case 'sparkle': return '✨';
      case 'flower': return '🌸';
      case 'butterfly': return '🦋';
      case 'rainbow': return '🌈';
      case 'sun': return '☀️';
      case 'moon': return '🌙';
      case 'cloud': return '☁️';
      case 'leaf': return '🍃';
      default: return '💖';
    }
  };

  return (
    <View style={[styles.cuteElement, { width: size, height: size }, style]} {...props}>
      <Text style={[styles.cuteElementText, { fontSize: size * 0.8 }]}>
        {getIcon()}
      </Text>
    </View>
  );
};

// Componente de línea decorativa
export const CuteLine = ({ style, ...props }) => (
  <View style={[styles.cuteLine, style]} {...props} />
);

// Componente de resaltado cute
export const CuteHighlight = ({ children, style, ...props }) => (
  <View style={[styles.cuteHighlight, style]} {...props}>
    {children}
  </View>
);

// Componente de badge cute
export const CuteBadge = ({ children, variant = 'primary', style, ...props }) => (
  <View style={[
    styles.cuteBadge, 
    variant === 'secondary' && styles.cuteBadgeSecondary,
    variant === 'accent' && styles.cuteBadgeAccent,
    style
  ]} {...props}>
    <Text style={[
      styles.cuteBadgeText,
      variant === 'secondary' && styles.cuteBadgeTextSecondary,
      variant === 'accent' && styles.cuteBadgeTextAccent,
    ]}>
      {children}
    </Text>
  </View>
);

// Componente de input cute
export const CuteInput = ({ style, ...props }) => (
  <View style={[styles.cuteInput, style]} {...props} />
);

// Estilos
const styles = StyleSheet.create({
  cuteTitle: {
    fontSize: typography.h3,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.md,
    lineHeight: typography.lineHeight.tight * typography.h3,
    letterSpacing: typography.letterSpacing.tight,
  },
  
  cuteText: {
    fontSize: typography.body,
    color: colors.textSecondary,
    lineHeight: typography.lineHeight.comfortable * typography.body,
    letterSpacing: typography.letterSpacing.normal,
  },
  
  cuteCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginVertical: spacing.sm,
    ...shadows.sm,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  
  cuteButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  
  cuteButtonSecondary: {
    backgroundColor: colors.secondary,
  },
  
  cuteButtonAccent: {
    backgroundColor: colors.accent,
  },
  
  cuteButtonText: {
    color: colors.surface,
    fontSize: typography.h6,
    fontWeight: typography.semiBold,
    lineHeight: typography.lineHeight.normal * typography.h6,
    letterSpacing: typography.letterSpacing.normal,
  },
  
  cuteElement: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    borderRadius: borderRadius.full,
    ...shadows.sm,
  },
  
  cuteElementText: {
    textAlign: 'center',
  },
  
  cuteLine: {
    height: 2,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    marginVertical: spacing.sm,
  },
  
  cuteHighlight: {
    backgroundColor: colors.lavender,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginVertical: spacing.xs,
  },
  
  cuteBadge: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    alignSelf: 'flex-start',
  },
  
  cuteBadgeSecondary: {
    backgroundColor: colors.secondary,
  },
  
  cuteBadgeAccent: {
    backgroundColor: colors.accent,
  },
  
  cuteBadgeText: {
    color: colors.surface,
    fontSize: typography.caption,
    fontWeight: typography.semiBold,
    lineHeight: typography.lineHeight.normal * typography.caption,
    letterSpacing: typography.letterSpacing.normal,
  },
  
  cuteBadgeTextSecondary: {
    color: colors.surface,
  },
  
  cuteBadgeTextAccent: {
    color: colors.textPrimary,
  },
  
  cuteInput: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.textTertiary,
    fontSize: typography.body,
    color: colors.textPrimary,
    lineHeight: typography.lineHeight.comfortable * typography.body,
    letterSpacing: typography.letterSpacing.normal,
  },
});
