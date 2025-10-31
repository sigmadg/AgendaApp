import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors, typography, spacing, borderRadius, shadows } from '../styles/globalStyles';

const EventItem = ({ event, onEdit, onDelete }) => {
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEventColor = (type) => {
    const eventColors = {
      meeting: colors.error,
      appointment: colors.accent,
      reminder: colors.primary,
      personal: colors.success,
      work: colors.warning,
      health: colors.health,
      finance: colors.finance,
      education: colors.education,
      social: colors.social,
      travel: colors.travel,
      default: colors.primary
    };
    return eventColors[type] || eventColors.default;
  };

  const getEventIcon = (type) => {
    const eventIcons = {
      meeting: 'people-outline',
      appointment: 'calendar-outline',
      reminder: 'alarm-outline',
      personal: 'person-outline',
      work: 'briefcase-outline',
      health: 'heart-outline',
      finance: 'card-outline',
      education: 'school-outline',
      social: 'happy-outline',
      travel: 'airplane-outline',
      default: 'star-outline'
    };
    return eventIcons[type] || eventIcons.default;
  };

  return (
    <View style={[styles.container, { borderLeftColor: getEventColor(event.type) }]}>
      <View style={styles.timeContainer}>
        <View style={[styles.timeIconContainer, { backgroundColor: getEventColor(event.type) + '20' }]}>
          <Icon name={getEventIcon(event.type)} size={16} color={getEventColor(event.type)} />
        </View>
        <View style={styles.timeTextContainer}>
          <Text style={styles.timeText}>
            {formatTime(event.startTime)}
          </Text>
          {event.endTime && (
            <Text style={styles.endTimeText}>
              - {formatTime(event.endTime)}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>{event.title}</Text>
          <View style={[styles.typeBadge, { backgroundColor: getEventColor(event.type) + '20' }]}>
            <Text style={[styles.typeText, { color: getEventColor(event.type) }]}>
              {event.type}
            </Text>
          </View>
        </View>
        {event.description && (
          <Text style={styles.descriptionText}>{event.description}</Text>
        )}
        {event.location && (
          <View style={styles.locationContainer}>
            <Icon name="location-outline" size={14} color={colors.textTertiary} />
            <Text style={styles.locationText}>{event.location}</Text>
          </View>
        )}
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => onEdit(event.id)}
          activeOpacity={0.7}
        >
          <Icon name="pencil-outline" size={18} color={colors.primary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => onDelete(event.id)}
          activeOpacity={0.7}
        >
          <Icon name="trash-outline" size={18} color={colors.error} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    padding: spacing.lg,
    marginBottom: spacing.sm,
    borderRadius: borderRadius.lg,
    borderLeftWidth: 4,
    ...shadows.small,
  },
  timeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    minWidth: 80,
  },
  timeIconContainer: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  timeTextContainer: {
    alignItems: 'center',
  },
  timeText: {
    ...typography.body,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    lineHeight: typography.lineHeight.tight,
    letterSpacing: typography.letterSpacing.tight,
  },
  endTimeText: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    lineHeight: typography.lineHeight.normal,
    letterSpacing: typography.letterSpacing.normal,
  },
  contentContainer: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  titleText: {
    ...typography.body,
    fontWeight: typography.semiBold,
    color: colors.textPrimary,
    flex: 1,
    marginRight: spacing.sm,
    lineHeight: typography.lineHeight.tight,
    letterSpacing: typography.letterSpacing.tight,
  },
  typeBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  typeText: {
    ...typography.small,
    fontWeight: typography.medium,
    textTransform: 'capitalize',
    lineHeight: typography.lineHeight.normal,
    letterSpacing: typography.letterSpacing.normal,
  },
  descriptionText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    lineHeight: typography.lineHeight.relaxed,
    letterSpacing: typography.letterSpacing.normal,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  locationText: {
    ...typography.small,
    color: colors.textTertiary,
    marginLeft: spacing.xs,
    lineHeight: typography.lineHeight.normal,
    letterSpacing: typography.letterSpacing.normal,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.xs,
  },
  editButton: {
    backgroundColor: colors.primaryLight,
  },
  deleteButton: {
    backgroundColor: colors.errorLight,
  },
});

export default EventItem;
