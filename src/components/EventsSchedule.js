import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import EventItem from './EventItem';
import { colors, typography, spacing, borderRadius, shadows } from '../styles/globalStyles';

const EventsSchedule = ({ events, onEditEvent, onDeleteEvent, onAddEvent }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const renderEvent = ({ item, index }) => (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
    >
      <EventItem
        event={item}
        onEdit={onEditEvent}
        onDelete={(eventId) => handleDeleteEvent(eventId, item.title)}
      />
    </Animated.View>
  );

  const handleDeleteEvent = (eventId, eventTitle) => {
    Alert.alert(
      'Eliminar evento',
      `¿Estás seguro de que quieres eliminar "${eventTitle}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => onDeleteEvent(eventId) },
      ]
    );
  };

  const sortEventsByTime = (events) => {
    return events.sort((a, b) => {
      const timeA = new Date(a.startTime).getTime();
      const timeB = new Date(b.startTime).getTime();
      return timeA - timeB;
    });
  };

  const sortedEvents = sortEventsByTime(events);

  const getEventStats = () => {
    const totalEvents = events.length;
    const today = new Date().toISOString().split('T')[0];
    const currentTime = new Date().toTimeString().split(' ')[0];
    
    const upcomingEvents = events.filter(event => {
      const eventTime = new Date(event.startTime).toTimeString().split(' ')[0];
      return eventTime > currentTime;
    }).length;

    return { totalEvents, upcomingEvents };
  };

  const stats = getEventStats();

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <View style={styles.titleContainer}>
          <View style={styles.iconContainer}>
            <Icon name="calendar-outline" size={28} color={colors.primary} />
          </View>
          <View style={styles.titleTextContainer}>
            <Text style={styles.title}>📅 Eventos del día</Text>
            <Text style={styles.subtitle}>Tu agenda personalizada</Text>
          </View>
        </View>
      </Animated.View>

      <Animated.View style={[styles.statsContainer, { opacity: fadeAnim, transform: [{ scale: fadeAnim }] }]}>
        <View style={styles.statItem}>
          <View style={styles.statIconContainer}>
            <Icon name="list-outline" size={20} color={colors.primary} />
          </View>
          <Text style={styles.statNumber}>{stats.totalEvents}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <View style={styles.statIconContainer}>
            <Icon name="time-outline" size={20} color={colors.accent} />
          </View>
          <Text style={styles.statNumber}>{stats.upcomingEvents}</Text>
          <Text style={styles.statLabel}>Próximos</Text>
        </View>
      </Animated.View>

      {events.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Icon name="calendar-outline" size={64} color={colors.textTertiary} />
            <View style={styles.emptyIconDecoration}>
              <Text style={styles.emptyIconText}>✨</Text>
            </View>
          </View>
          <Text style={styles.emptyTitle}>🎯 No hay eventos programados</Text>
          <Text style={styles.emptySubtitle}>
            ¡Perfecto! Toca el botón 📅 en el calendario para agregar tu primer evento y organizar tu día
          </Text>
          <View style={styles.emptyTipContainer}>
            <Icon name="bulb-outline" size={16} color={colors.accent} />
            <Text style={styles.emptyTip}>Tip: Los eventos te ayudan a mantenerte organizado</Text>
          </View>
        </View>
      ) : (
        <FlatList
          data={sortedEvents}
          renderItem={renderEvent}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
    margin: spacing.md,
    marginTop: 0,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.medium,
  },
  header: {
    marginBottom: spacing.lg,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  titleTextContainer: {
    flex: 1,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    lineHeight: typography.lineHeight.tight,
    letterSpacing: typography.letterSpacing.tight,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    lineHeight: typography.lineHeight.normal,
    letterSpacing: typography.letterSpacing.normal,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.small,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statIconContainer: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statNumber: {
    ...typography.h3,
    color: colors.primary,
    lineHeight: typography.lineHeight.tight,
    letterSpacing: typography.letterSpacing.tight,
  },
  statLabel: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    lineHeight: typography.lineHeight.normal,
    letterSpacing: typography.letterSpacing.normal,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.md,
  },
  listContainer: {
    paddingBottom: spacing.lg,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyIconContainer: {
    position: 'relative',
    marginBottom: spacing.lg,
  },
  emptyIconDecoration: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: borderRadius.full,
    backgroundColor: colors.accentLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyIconText: {
    fontSize: 12,
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    textAlign: 'center',
    lineHeight: typography.lineHeight.tight,
    letterSpacing: typography.letterSpacing.tight,
  },
  emptySubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.lg,
    lineHeight: typography.lineHeight.relaxed,
    letterSpacing: typography.letterSpacing.normal,
  },
  emptyTipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accentLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  emptyTip: {
    ...typography.small,
    color: colors.accent,
    marginLeft: spacing.sm,
    lineHeight: typography.lineHeight.normal,
    letterSpacing: typography.letterSpacing.normal,
  },
});

export default EventsSchedule;
