import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors, typography, spacing, borderRadius, shadows } from '../styles/globalStyles';

// Elementos decorativos de Bullet Journal

// Líneas punteadas (como en bullet journal)
export const DottedLine = ({ style, color = colors.pencil, thickness = 1 }) => (
  <View style={[styles.dottedLine, { borderBottomColor: color, borderBottomWidth: thickness }, style]} />
);

// Título de bullet journal (escritura a mano)
export const JournalTitle = ({ children, style, color = colors.ink }) => (
  <Text style={[styles.journalTitle, { color }, style]}>
    {children}
  </Text>
);

// Texto de bullet journal (escritura natural)
export const JournalText = ({ children, style, color = colors.textPrimary }) => (
  <Text style={[styles.journalText, { color }, style]}>
    {children}
  </Text>
);

// Sticker decorativo
export const JournalSticker = ({ emoji, style, size = 24 }) => (
  <View style={[styles.sticker, { width: size, height: size }, style]}>
    <Text style={[styles.stickerEmoji, { fontSize: size * 0.6 }]}>
      {emoji}
    </Text>
  </View>
);

// Elemento natural (hoja, flor, etc.)
export const NatureElement = ({ type, style, size = 20 }) => {
  const getEmoji = () => {
    switch (type) {
      case 'leaf': return '🍃';
      case 'flower': return '🌸';
      case 'star': return '⭐';
      case 'heart': return '💖';
      case 'sun': return '☀️';
      case 'moon': return '🌙';
      case 'cloud': return '☁️';
      case 'butterfly': return '🦋';
      case 'bird': return '🐦';
      case 'tree': return '🌳';
      default: return '✨';
    }
  };

  return (
    <View style={[styles.natureElement, { width: size, height: size }, style]}>
      <Text style={[styles.natureEmoji, { fontSize: size * 0.7 }]}>
        {getEmoji()}
      </Text>
    </View>
  );
};

// Bullet point personalizado
export const BulletPoint = ({ type = 'dot', color = colors.ink, size = 8 }) => {
  const getBulletStyle = () => {
    switch (type) {
      case 'dot':
        return {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        };
      case 'square':
        return {
          width: size,
          height: size,
          backgroundColor: color,
        };
      case 'dash':
        return {
          width: size * 2,
          height: 2,
          backgroundColor: color,
        };
      case 'arrow':
        return {
          width: 0,
          height: 0,
          borderLeftWidth: size,
          borderRightWidth: size,
          borderBottomWidth: size,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderBottomColor: color,
        };
      default:
        return {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        };
    }
  };

  return <View style={[styles.bulletPoint, getBulletStyle()]} />;
};

// Marcador de página
export const PageMarker = ({ color = colors.highlighter, style }) => (
  <View style={[styles.pageMarker, { backgroundColor: color }, style]} />
);

// Nota adhesiva
export const StickyNote = ({ children, color = colors.watercolor1, style }) => (
  <View style={[styles.stickyNote, { backgroundColor: color }, style]}>
    {children}
  </View>
);

// Línea de escritura (como en cuaderno)
export const WritingLine = ({ style, color = colors.pencil }) => (
  <View style={[styles.writingLine, { borderBottomColor: color }, style]} />
);

// Elemento de acuarela
export const WatercolorElement = ({ color = colors.watercolor1, style, size = 40 }) => (
  <View style={[
    styles.watercolorElement, 
    { 
      backgroundColor: color, 
      width: size, 
      height: size 
    }, 
    style
  ]} />
);

// Estilos
const styles = StyleSheet.create({
  dottedLine: {
    borderStyle: 'dashed',
    borderBottomWidth: 1,
    marginVertical: spacing.sm,
  },
  
  journalTitle: {
    fontSize: typography.h3,
    fontWeight: typography.bold,
    color: colors.ink,
    lineHeight: typography.lineHeight.tight * typography.h3,
    letterSpacing: typography.letterSpacing.wide,
    fontStyle: 'italic',
  },
  
  journalText: {
    fontSize: typography.body,
    color: colors.textPrimary,
    lineHeight: typography.lineHeight.comfortable * typography.body,
    letterSpacing: typography.letterSpacing.normal,
  },
  
  sticker: {
    backgroundColor: colors.watercolor1,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
  },
  
  stickerEmoji: {
    textAlign: 'center',
  },
  
  natureElement: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  natureEmoji: {
    textAlign: 'center',
  },
  
  bulletPoint: {
    marginRight: spacing.sm,
  },
  
  pageMarker: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 4,
    height: '100%',
    opacity: 0.6,
  },
  
  stickyNote: {
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    ...shadows.paper,
    borderWidth: 1,
    borderColor: colors.pencil,
  },
  
  writingLine: {
    borderBottomWidth: 1,
    borderStyle: 'solid',
    marginVertical: spacing.xs,
  },
  
  watercolorElement: {
    borderRadius: borderRadius.full,
    opacity: 0.7,
    ...shadows.sm,
  },
});

export default {
  DottedLine,
  JournalTitle,
  JournalText,
  JournalSticker,
  NatureElement,
  BulletPoint,
  PageMarker,
  StickyNote,
  WritingLine,
  WatercolorElement,
};
