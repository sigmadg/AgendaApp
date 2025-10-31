import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import Icon from 'react-native-vector-icons/Ionicons';

const CalendarView = ({ selectedDate, onDateSelect, tasks, events, onAddTask, onAddEvent }) => {
  const getMarkedDates = () => {
    const marked = {};
    
    // Marcar la fecha seleccionada
    marked[selectedDate] = {
      selected: true,
      selectedColor: '#007AFF',
      selectedTextColor: '#FFFFFF',
    };

    // Marcar fechas que tienen tareas
    Object.keys(tasks).forEach(date => {
      if (date !== selectedDate && tasks[date] && tasks[date].length > 0) {
        const completedTasks = tasks[date].filter(task => task.completed).length;
        const totalTasks = tasks[date].length;
        
        marked[date] = {
          marked: true,
          dotColor: completedTasks === totalTasks ? '#34C759' : '#FF9500',
          activeOpacity: 0.7,
        };
      }
    });

    // Marcar fechas que tienen eventos (usando la función getAllEventsForDate)
    const allEvents = events(selectedDate) || [];
    if (allEvents.length > 0) {
      const eventDates = [...new Set(allEvents.map(event => event.date))];
      eventDates.forEach(date => {
        if (date !== selectedDate) {
          // Si ya hay una marca de tareas, agregar una segunda marca para eventos
          if (marked[date]) {
            marked[date].dots = [
              { key: 'tasks', color: marked[date].dotColor },
              { key: 'events', color: '#A29BFE' }
            ];
            delete marked[date].dotColor;
          } else {
            marked[date] = {
              marked: true,
              dotColor: '#A29BFE',
              activeOpacity: 0.7,
            };
          }
        }
      });
    }

    return marked;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('es-ES', options);
  };


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Calendario</Text>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.addButton} onPress={onAddEvent}>
            <Icon name="calendar" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.addButton} onPress={onAddTask}>
            <Icon name="add" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.dateInfo}>
        <Text style={styles.selectedDateText}>
          {formatDate(selectedDate)}
        </Text>
      </View>

      <Calendar
        current={selectedDate}
        onDayPress={(day) => onDateSelect(day.dateString)}
        monthFormat={'MMMM yyyy'}
        hideExtraDays={true}
        firstDay={1}
        showWeekNumbers={false}
        disableMonthChange={false}
        enableSwipeMonths={true}
        theme={{
          backgroundColor: '#ffffff',
          calendarBackground: '#ffffff',
          textSectionTitleColor: '#b6c1cd',
          selectedDayBackgroundColor: '#007AFF',
          selectedDayTextColor: '#ffffff',
          todayTextColor: '#007AFF',
          dayTextColor: '#2d4150',
          textDisabledColor: '#d9e1e8',
          dotColor: '#00adf5',
          selectedDotColor: '#ffffff',
          arrowColor: '#007AFF',
          disabledArrowColor: '#d9e1e8',
          monthTextColor: '#2d4150',
          indicatorColor: '#007AFF',
          textDayFontWeight: '300',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: '300',
          textDayFontSize: 16,
          textMonthFontSize: 16,
          textDayHeaderFontSize: 13,
        }}
        markedDates={getMarkedDates()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    margin: 16,
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d4150',
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  addButton: {
    backgroundColor: '#007AFF',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateInfo: {
    marginBottom: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  selectedDateText: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    textTransform: 'capitalize',
  },
});

export default CalendarView;
