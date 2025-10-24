import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, Dimensions } from 'react-native';
import { colors, spacing, borderRadius, shadows } from '../styles/globalStyles';

const { width, height } = Dimensions.get('window');

// Componente de iconos decorativos flotantes
export const FloatingIcons = ({ count = 5, duration = 3000 }) => {
  const animations = useRef([]);

  useEffect(() => {
    // Inicializar animaciones
    animations.current = Array.from({ length: count }, () => ({
      translateY: new Animated.Value(height),
      translateX: new Animated.Value(Math.random() * width),
      opacity: new Animated.Value(0),
      scale: new Animated.Value(0.5),
    }));

    // Crear animaciones infinitas
    animations.current.forEach((anim, index) => {
      const delay = index * (duration / count);
      
      const animate = () => {
        // Resetear posición
        anim.translateY.setValue(height);
        anim.opacity.setValue(0);
        anim.scale.setValue(0.5);
        
        // Animar hacia arriba
        Animated.parallel([
          Animated.timing(anim.translateY, {
            toValue: -100,
            duration: duration,
            useNativeDriver: true,
          }),
          Animated.timing(anim.opacity, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(anim.scale, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]).start(() => {
          // Repetir animación
          setTimeout(animate, Math.random() * 2000 + 1000);
        });
      };

      setTimeout(animate, delay);
    });
  }, [count, duration]);

  const getRandomIcon = () => {
    const icons = ['✨', '⭐', '💫', '🌟', '💖', '🌸', '🦋', '🌈', '☀️', '🌙', '☁️', '🍃'];
    return icons[Math.floor(Math.random() * icons.length)];
  };

  return (
    <View style={styles.floatingContainer} pointerEvents="none">
      {animations.current.map((anim, index) => (
        <Animated.View
          key={index}
          style={[
            styles.floatingIcon,
            {
              transform: [
                { translateX: anim.translateX },
                { translateY: anim.translateY },
                { scale: anim.scale },
              ],
              opacity: anim.opacity,
            },
          ]}
        >
          <Text style={styles.floatingIconText}>{getRandomIcon()}</Text>
        </Animated.View>
      ))}
    </View>
  );
};

// Componente de iconos decorativos estáticos
export const DecorativeIcons = ({ type = 'corner', style }) => {
  const getIcons = () => {
    switch (type) {
      case 'corner':
        return ['✨', '⭐', '💫'];
      case 'border':
        return ['🌸', '🦋', '🌈', '☀️'];
      case 'center':
        return ['💖', '🌟', '💫'];
      case 'scattered':
        return ['✨', '⭐', '💫', '🌟', '💖', '🌸', '🦋', '🌈', '☀️', '🌙', '☁️', '🍃'];
      default:
        return ['✨', '⭐', '💫'];
    }
  };

  const icons = getIcons();

  return (
    <View style={[styles.decorativeContainer, style]}>
      {icons.map((icon, index) => (
        <View key={index} style={[styles.decorativeIcon, { 
          top: Math.random() * 100 + '%',
          left: Math.random() * 100 + '%',
        }]}>
          <Text style={styles.decorativeIconText}>{icon}</Text>
        </View>
      ))}
    </View>
  );
};

// Componente de iconos decorativos animados
export const AnimatedDecorativeIcons = ({ type = 'bounce', style }) => {
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (type === 'bounce') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(bounceAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(bounceAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else if (type === 'rotate') {
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        })
      ).start();
    }
  }, [type]);

  const bounceTransform = bounceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  const rotateTransform = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const getIcons = () => {
    switch (type) {
      case 'bounce':
        return ['✨', '⭐', '💫'];
      case 'rotate':
        return ['🌟', '💖', '🌸'];
      case 'pulse':
        return ['🦋', '🌈', '☀️'];
      default:
        return ['✨', '⭐', '💫'];
    }
  };

  const icons = getIcons();

  return (
    <View style={[styles.animatedContainer, style]}>
      {icons.map((icon, index) => (
        <Animated.View
          key={index}
          style={[
            styles.animatedIcon,
            {
              transform: [
                { translateY: bounceTransform },
                { rotate: rotateTransform },
              ],
            },
          ]}
        >
          <Text style={styles.animatedIconText}>{icon}</Text>
        </Animated.View>
      ))}
    </View>
  );
};

// Componente de iconos decorativos con gradiente
export const GradientDecorativeIcons = ({ style }) => {
  const icons = ['✨', '⭐', '💫', '🌟', '💖', '🌸', '🦋', '🌈', '☀️', '🌙', '☁️', '🍃'];

  return (
    <View style={[styles.gradientContainer, style]}>
      {icons.map((icon, index) => (
        <View key={index} style={[styles.gradientIcon, {
          backgroundColor: index % 2 === 0 ? colors.lavender : colors.mint,
        }]}>
          <Text style={styles.gradientIconText}>{icon}</Text>
        </View>
      ))}
    </View>
  );
};

// Componente de iconos decorativos con sombras
export const ShadowDecorativeIcons = ({ style }) => {
  const icons = ['✨', '⭐', '💫', '🌟', '💖', '🌸', '🦋', '🌈', '☀️', '🌙', '☁️', '🍃'];

  return (
    <View style={[styles.shadowContainer, style]}>
      {icons.map((icon, index) => (
        <View key={index} style={[styles.shadowIcon, {
          ...shadows.md,
          backgroundColor: colors.surface,
        }]}>
          <Text style={styles.shadowIconText}>{icon}</Text>
        </View>
      ))}
    </View>
  );
};

// Estilos
const styles = StyleSheet.create({
  floatingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  floatingIcon: {
    position: 'absolute',
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingIconText: {
    fontSize: 20,
    textAlign: 'center',
  },
  decorativeContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  decorativeIcon: {
    position: 'absolute',
    width: 25,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  decorativeIconText: {
    fontSize: 16,
    textAlign: 'center',
  },
  animatedContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  animatedIcon: {
    position: 'absolute',
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  animatedIconText: {
    fontSize: 18,
    textAlign: 'center',
  },
  gradientContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  gradientIcon: {
    position: 'absolute',
    width: 35,
    height: 35,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  gradientIconText: {
    fontSize: 20,
    textAlign: 'center',
  },
  shadowContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  shadowIcon: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shadowIconText: {
    fontSize: 22,
    textAlign: 'center',
  },
});
