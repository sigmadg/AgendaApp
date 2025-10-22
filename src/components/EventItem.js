import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const EventItem = ({ event, onEdit, onDelete }) => {
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEventColor = (type) => {
    const colors = {
      meeting: '#FF6B6B',
      appointment: '#4ECDC4',
      reminder: '#45B7D1',
      personal: '#96CEB4',
      work: '#FFEAA7',
      default: '#A29BFE'
    };
    return colors[type] || colors.default;
  };

  return (
    <View style={[styles.container, { borderLeftColor: getEventColor(event.type) }]}>
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>
          {formatTime(event.startTime)}
        </Text>
        {event.endTime && (
          <Text style={styles.endTimeText}>
            - {formatTime(event.endTime)}
          </Text>
        )}
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.titleText}>{event.title}</Text>
        {event.description && (
          <Text style={styles.descriptionText}>{event.description}</Text>
        )}
        <View style={styles.typeContainer}>
          <View style={[styles.typeIndicator, { backgroundColor: getEventColor(event.type) }]} />
          <Text style={styles.typeText}>{event.type}</Text>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onEdit(event.id)}
          activeOpacity={0.7}
        >
          <Icon name="pencil-outline" size={18} color="#007AFF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onDelete(event.id)}
          activeOpacity={0.7}
        >
          <Icon name="trash-outline" size={18} color="#dc3545" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 16,
    marginBottom: 8,
    borderRadius: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  timeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    minWidth: 80,
  },
  timeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d4150',
  },
  endTimeText: {
    fontSize: 12,
    color: '#6c757d',
    marginTop: 2,
  },
  contentContainer: {
    flex: 1,
  },
  titleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d4150',
    marginBottom: 4,
  },
  descriptionText: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 8,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  typeText: {
    fontSize: 12,
    color: '#6c757d',
    textTransform: 'capitalize',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
  },
});

export default EventItem;
