import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import EventItem from './EventItem';

const EventsSchedule = ({ events, onEditEvent, onDeleteEvent, onAddEvent }) => {
  const renderEvent = ({ item }) => (
    <EventItem
      event={item}
      onEdit={onEditEvent}
      onDelete={(eventId) => handleDeleteEvent(eventId, item.title)}
    />
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
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Icon name="calendar-outline" size={24} color="#007AFF" />
          <Text style={styles.title}>Eventos del día</Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats.totalEvents}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats.upcomingEvents}</Text>
          <Text style={styles.statLabel}>Próximos</Text>
        </View>
      </View>

      {events.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="calendar-outline" size={64} color="#dee2e6" />
          <Text style={styles.emptyTitle}>No hay eventos</Text>
          <Text style={styles.emptySubtitle}>
            Toca el botón 📅 en el calendario para agregar tu primer evento
          </Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    margin: 16,
    marginTop: 0,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d4150',
    marginLeft: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#6c757d',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#dee2e6',
    marginHorizontal: 16,
  },
  listContainer: {
    paddingBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6c757d',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#adb5bd',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});

export default EventsSchedule;
