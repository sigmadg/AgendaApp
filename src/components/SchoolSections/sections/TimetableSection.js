import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { SectionHeader, Button } from '../../shared';
import { useTheme } from '../../shared/hooks/useTheme';
import { timetableSectionStyles } from '../styles/timetableSectionStyles';

const TimetableSection = ({
  selectedDate,
  onDateSelect,
  user,
  theme
}) => {
  const { getThemeColors } = useTheme();
  const themeColors = getThemeColors();

  // Validar que user existe
  if (!user) {
    return (
      <View style={timetableSectionStyles.container}>
        <Text style={[timetableSectionStyles.text, { color: themeColors.text }]}>
          Cargando datos del usuario...
        </Text>
      </View>
    );
  }

  // Estados para el horario semanal
  const [timetable, setTimetable] = useState({
    'Lunes-8:00 AM': {
      id: 1,
      subject: 'Matemáticas',
      classroom: 'Aula 101',
      professor: 'Dr. García',
      duration: 60
    },
    'Lunes-10:00 AM': {
      id: 2,
      subject: 'Física',
      classroom: 'Lab 205',
      professor: 'Dra. López',
      duration: 90
    },
    'Martes-9:00 AM': {
      id: 3,
      subject: 'Química',
      classroom: 'Lab 301',
      professor: 'Dr. Martínez',
      duration: 60
    },
    'Miércoles-8:00 AM': {
      id: 4,
      subject: 'Literatura',
      classroom: 'Aula 102',
      professor: 'Dra. Rodríguez',
      duration: 60
    },
    'Jueves-11:00 AM': {
      id: 5,
      subject: 'Historia',
      classroom: 'Aula 103',
      professor: 'Dr. Sánchez',
      duration: 60
    }
  });
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [selectedHourIndex, setSelectedHourIndex] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Estados para agregar clase
  const [newClass, setNewClass] = useState({
    subject: '',
    time: '',
    day: '',
    classroom: '',
    professor: '',
    duration: '60'
  });

  const weekDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const timeSlots = [
    '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM',
    '7:00 PM', '8:00 PM', '9:00 PM'
  ];

  const convertTo24Hour = (time12h) => {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    if (hours === '12') {
      hours = '00';
    }
    if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }
    return parseInt(hours, 10);
  };

  const getCurrentHour = () => {
    const now = new Date();
    return now.getHours();
  };

  const goToCurrentHour = () => {
    const currentHour = getCurrentHour();
    const matchingIndex = timeSlots.findIndex(slot => {
      const slotHour = convertTo24Hour(slot);
      return slotHour === currentHour;
    });
    
    if (matchingIndex !== -1) {
      setSelectedHourIndex(matchingIndex);
    }
  };

  const goToCurrentDay = () => {
    const today = new Date();
    const dayIndex = today.getDay() - 1; // Lunes = 0, Domingo = 6
    if (dayIndex >= 0 && dayIndex < 7) {
      setSelectedDayIndex(dayIndex);
    }
  };

  const addClass = () => {
    if (!newClass.subject || !newClass.day || !newClass.time) {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios');
      return;
    }

    const classKey = `${newClass.day}-${newClass.time}`;
    const newClassData = {
      ...newClass,
      id: Date.now(),
      duration: parseInt(newClass.duration)
    };

    setTimetable(prev => ({
      ...prev,
      [classKey]: newClassData
    }));

    setNewClass({
      subject: '',
      time: '',
      day: '',
      classroom: '',
      professor: '',
      duration: '60'
    });
    setShowAddModal(false);
    Alert.alert('Éxito', 'Clase agregada correctamente');
  };

  const getClassesForDay = (dayIndex) => {
    const dayName = weekDays[dayIndex];
    return Object.entries(timetable).filter(([key]) => key.startsWith(dayName));
  };

  const getTotalClasses = () => {
    return Object.keys(timetable).length;
  };

  const getClassesToday = () => {
    const today = new Date();
    const dayIndex = today.getDay() - 1;
    if (dayIndex >= 0 && dayIndex < 7) {
      return getClassesForDay(dayIndex).length;
    }
    return 0;
  };

  const getNextClass = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentDay = now.getDay() - 1;
    
    // Buscar la próxima clase de hoy
    const todayClasses = getClassesForDay(currentDay);
    for (const [key, classData] of todayClasses) {
      const classHour = convertTo24Hour(classData.time || '12:00 PM');
      if (classHour > currentHour) {
        return classData;
      }
    }
    
    // Si no hay más clases hoy, buscar en los próximos días
    for (let dayOffset = 1; dayOffset < 7; dayOffset++) {
      const nextDayIndex = (currentDay + dayOffset) % 7;
      const nextDayClasses = getClassesForDay(nextDayIndex);
      if (nextDayClasses.length > 0) {
        return nextDayClasses[0][1];
      }
    }
    
    return null;
  };

  const renderTimetable = () => {
    const totalClasses = getTotalClasses();
    const classesToday = getClassesToday();
    const nextClass = getNextClass();
    
    return (
      <View>
        {/* Header mejorado */}
        <View style={timetableSectionStyles.scheduleHeader}>
          <View style={timetableSectionStyles.scheduleHeaderContent}>
            <View style={timetableSectionStyles.scheduleIconContainer}>
              <Icon name="calendar-outline" size={24} color="#FFFFFF" />
            </View>
            <View style={timetableSectionStyles.scheduleHeaderText}>
              <Text style={timetableSectionStyles.scheduleHeaderTitle}>
                Horario de {weekDays[selectedDayIndex]}
              </Text>
              <Text style={timetableSectionStyles.scheduleHeaderSubtitle}>
                Gestiona tu horario de clases
              </Text>
            </View>
          </View>
          <View style={timetableSectionStyles.scheduleHeaderBadge}>
            <Icon name="time-outline" size={16} color="#1E3A8A" />
          </View>
        </View>

        {/* Resumen de horario mejorado */}
        <View style={timetableSectionStyles.scheduleSummary}>
          <View style={timetableSectionStyles.summaryCard}>
            <View style={timetableSectionStyles.summaryIconContainer}>
              <Icon name="school-outline" size={20} color="#3B82F6" />
            </View>
            <View style={timetableSectionStyles.summaryContent}>
              <Text style={timetableSectionStyles.summaryValue}>{totalClasses}</Text>
              <Text style={timetableSectionStyles.summaryLabel}>Total Clases</Text>
            </View>
          </View>
          <View style={timetableSectionStyles.summaryCard}>
            <View style={timetableSectionStyles.summaryIconContainer}>
              <Icon name="today-outline" size={20} color="#10B981" />
            </View>
            <View style={timetableSectionStyles.summaryContent}>
              <Text style={timetableSectionStyles.summaryValue}>{classesToday}</Text>
              <Text style={timetableSectionStyles.summaryLabel}>Hoy</Text>
            </View>
          </View>
          <View style={timetableSectionStyles.summaryCard}>
            <View style={timetableSectionStyles.summaryIconContainer}>
              <Icon name="arrow-forward-outline" size={20} color="#F59E0B" />
            </View>
            <View style={timetableSectionStyles.summaryContent}>
              <Text style={timetableSectionStyles.summaryValue}>
                {nextClass ? nextClass.subject.substring(0, 8) + '...' : 'N/A'}
              </Text>
              <Text style={timetableSectionStyles.summaryLabel}>Próxima</Text>
            </View>
          </View>
        </View>

        {/* Botón para agregar clase */}
        <View style={timetableSectionStyles.addClassContainer}>
          <TouchableOpacity 
            style={timetableSectionStyles.addClassButton}
            onPress={() => setShowAddModal(true)}
          >
            <Icon name="add-circle-outline" size={20} color="#FFFFFF" />
            <Text style={timetableSectionStyles.addClassText}>Agregar Clase</Text>
          </TouchableOpacity>
        </View>

        {/* Navegación mejorada */}
        <View style={timetableSectionStyles.navigationContainer}>
          {/* Navegación de días */}
          <View style={timetableSectionStyles.dayNavigation}>
            <TouchableOpacity 
              style={timetableSectionStyles.navButton}
              onPress={() => setSelectedDayIndex(Math.max(0, selectedDayIndex - 1))}
            >
              <Icon name="chevron-back" size={20} color="#1E3A8A" />
            </TouchableOpacity>
            
            <Text style={timetableSectionStyles.dayTitle}>
              {weekDays[selectedDayIndex]}
            </Text>
            
            <TouchableOpacity 
              style={timetableSectionStyles.navButton}
              onPress={() => setSelectedDayIndex(Math.min(6, selectedDayIndex + 1))}
            >
              <Icon name="chevron-forward" size={20} color="#1E3A8A" />
            </TouchableOpacity>
          </View>

          {/* Navegación de horas */}
          <View style={timetableSectionStyles.hourNavigation}>
            <TouchableOpacity 
              style={timetableSectionStyles.navButton}
              onPress={() => setSelectedHourIndex(Math.max(0, selectedHourIndex - 1))}
            >
              <Icon name="chevron-up" size={20} color="#1E3A8A" />
            </TouchableOpacity>
            
            <Text style={timetableSectionStyles.hourTitle}>
              {timeSlots[selectedHourIndex]}
            </Text>
            
            <TouchableOpacity 
              style={timetableSectionStyles.navButton}
              onPress={() => setSelectedHourIndex(Math.min(timeSlots.length - 1, selectedHourIndex + 1))}
            >
              <Icon name="chevron-down" size={20} color="#1E3A8A" />
            </TouchableOpacity>
          </View>

          {/* Botón "Ahora" mejorado */}
          <View style={timetableSectionStyles.nowButtonContainer}>
            <TouchableOpacity
              style={timetableSectionStyles.nowButton}
              onPress={() => {
                goToCurrentDay();
                goToCurrentHour();
              }}
            >
              <Icon name="time-outline" size={16} color="#1E3A8A" />
              <Text style={timetableSectionStyles.nowButtonText}>Ahora</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Horario mejorado */}
        <View style={timetableSectionStyles.timetableContainer}>
          <View style={timetableSectionStyles.timetableHeader}>
            <Text style={timetableSectionStyles.timetableTitle}>Horario de Clases</Text>
            <TouchableOpacity style={timetableSectionStyles.filterButton}>
              <Icon name="filter-outline" size={16} color="#1E3A8A" />
              <Text style={timetableSectionStyles.filterText}>Filtrar</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={timetableSectionStyles.timetableBody} showsVerticalScrollIndicator={false}>
            {timeSlots.map((time, index) => {
              const classKey = `${weekDays[selectedDayIndex]}-${time}`;
              const classData = timetable[classKey];
              const isCurrentTime = convertTo24Hour(time) === getCurrentHour();
              const isSelectedTime = index === selectedHourIndex;
              
              return (
                <View 
                  key={time} 
                  style={[
                    timetableSectionStyles.timeSlot,
                    isCurrentTime && timetableSectionStyles.currentTimeSlot,
                    isSelectedTime && timetableSectionStyles.selectedTimeSlot
                  ]}
                >
                  <View style={timetableSectionStyles.timeColumn}>
                    <Text style={[
                      timetableSectionStyles.timeText,
                      isCurrentTime && timetableSectionStyles.currentTimeText,
                      isSelectedTime && timetableSectionStyles.selectedTimeText
                    ]}>
                      {time}
                    </Text>
                    {isCurrentTime && (
                      <View style={timetableSectionStyles.currentIndicator}>
                        <Icon name="radio-button-on" size={8} color="#10B981" />
                      </View>
                    )}
                  </View>
                  
                  <View style={timetableSectionStyles.classColumn}>
                    {classData ? (
                      <View style={[
                        timetableSectionStyles.classCard,
                        isCurrentTime && timetableSectionStyles.currentClassCard
                      ]}>
                        <View style={timetableSectionStyles.classHeader}>
                          <Text style={[
                            timetableSectionStyles.classSubject,
                            isCurrentTime && timetableSectionStyles.currentClassSubject
                          ]}>
                            {classData.subject}
                          </Text>
                          <View style={timetableSectionStyles.classDuration}>
                            <Icon name="time-outline" size={12} color="#6B7280" />
                            <Text style={timetableSectionStyles.durationText}>
                              {classData.duration}min
                            </Text>
                          </View>
                        </View>
                        
                        {classData.classroom && (
                          <View style={timetableSectionStyles.classDetail}>
                            <Icon name="location-outline" size={14} color="#6B7280" />
                            <Text style={timetableSectionStyles.classDetails}>
                              {classData.classroom}
                            </Text>
                          </View>
                        )}
                        
                        {classData.professor && (
                          <View style={timetableSectionStyles.classDetail}>
                            <Icon name="person-outline" size={14} color="#6B7280" />
                            <Text style={timetableSectionStyles.classDetails}>
                              {classData.professor}
                            </Text>
                          </View>
                        )}
                      </View>
                    ) : (
                      <View style={timetableSectionStyles.emptySlot}>
                        <Icon name="ellipse-outline" size={16} color="#9CA3AF" />
                        <Text style={timetableSectionStyles.emptyText}>
                          Libre
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </View>
      </View>
    );
  };

  return (
    <View style={timetableSectionStyles.container}>
      {renderTimetable()}
      
      {/* Modal para agregar clase mejorado */}
      <Modal
        visible={showAddModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={timetableSectionStyles.modalOverlay}>
          <View style={[timetableSectionStyles.modalContainer, { backgroundColor: themeColors.surface }]}>
            <View style={timetableSectionStyles.modalHeader}>
              <View style={timetableSectionStyles.modalHeaderContent}>
                <Icon name="add-circle-outline" size={24} color="#1E3A8A" />
                <Text style={[timetableSectionStyles.modalTitle, { color: themeColors.text }]}>
                  Nueva Clase
                </Text>
              </View>
              <TouchableOpacity 
                onPress={() => setShowAddModal(false)} 
                style={timetableSectionStyles.closeButton}
              >
                <Icon name="close" size={24} color={themeColors.primary} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={timetableSectionStyles.modalContent} showsVerticalScrollIndicator={false}>
              <View style={timetableSectionStyles.inputGroup}>
                <Text style={[timetableSectionStyles.inputLabel, { color: themeColors.text }]}>Materia *</Text>
                <TextInput
                  style={[timetableSectionStyles.textInput, { 
                    backgroundColor: themeColors.background,
                    color: themeColors.text,
                    borderColor: themeColors.border 
                  }]}
                  value={newClass.subject}
                  onChangeText={(text) => setNewClass(prev => ({ ...prev, subject: text }))}
                  placeholder="Ej: Matemáticas"
                  placeholderTextColor={themeColors.textSecondary}
                />
              </View>
              
              <View style={timetableSectionStyles.inputGroup}>
                <Text style={[timetableSectionStyles.inputLabel, { color: themeColors.text }]}>Día de la semana *</Text>
                <View style={timetableSectionStyles.daySelector}>
                  {weekDays.map((day) => (
                    <TouchableOpacity
                      key={day}
                      style={[
                        timetableSectionStyles.dayButton,
                        { backgroundColor: themeColors.background },
                        newClass.day === day && { backgroundColor: '#1E3A8A' }
                      ]}
                      onPress={() => setNewClass(prev => ({ ...prev, day }))}
                    >
                      <Text style={[
                        timetableSectionStyles.dayButtonText,
                        { color: themeColors.text },
                        newClass.day === day && { color: '#FFFFFF' }
                      ]}>
                        {day}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <View style={timetableSectionStyles.inputGroup}>
                <Text style={[timetableSectionStyles.inputLabel, { color: themeColors.text }]}>Hora *</Text>
                <View style={timetableSectionStyles.timeSelector}>
                  {timeSlots.map((time) => (
                    <TouchableOpacity
                      key={time}
                      style={[
                        timetableSectionStyles.timeButton,
                        { backgroundColor: themeColors.background },
                        newClass.time === time && { backgroundColor: '#1E3A8A' }
                      ]}
                      onPress={() => setNewClass(prev => ({ ...prev, time }))}
                    >
                      <Text style={[
                        timetableSectionStyles.timeButtonText,
                        { color: themeColors.text },
                        newClass.time === time && { color: '#FFFFFF' }
                      ]}>
                        {time}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <View style={timetableSectionStyles.inputGroup}>
                <Text style={[timetableSectionStyles.inputLabel, { color: themeColors.text }]}>Aula</Text>
                <TextInput
                  style={[timetableSectionStyles.textInput, { 
                    backgroundColor: themeColors.background,
                    color: themeColors.text,
                    borderColor: themeColors.border 
                  }]}
                  value={newClass.classroom}
                  onChangeText={(text) => setNewClass(prev => ({ ...prev, classroom: text }))}
                  placeholder="Ej: Aula 101"
                  placeholderTextColor={themeColors.textSecondary}
                />
              </View>
              
              <View style={timetableSectionStyles.inputGroup}>
                <Text style={[timetableSectionStyles.inputLabel, { color: themeColors.text }]}>Profesor</Text>
                <TextInput
                  style={[timetableSectionStyles.textInput, { 
                    backgroundColor: themeColors.background,
                    color: themeColors.text,
                    borderColor: themeColors.border 
                  }]}
                  value={newClass.professor}
                  onChangeText={(text) => setNewClass(prev => ({ ...prev, professor: text }))}
                  placeholder="Ej: Dr. García"
                  placeholderTextColor={themeColors.textSecondary}
                />
              </View>
              
              <View style={timetableSectionStyles.inputGroup}>
                <Text style={[timetableSectionStyles.inputLabel, { color: themeColors.text }]}>Duración (minutos)</Text>
                <TextInput
                  style={[timetableSectionStyles.textInput, { 
                    backgroundColor: themeColors.background,
                    color: themeColors.text,
                    borderColor: themeColors.border 
                  }]}
                  value={newClass.duration}
                  onChangeText={(text) => setNewClass(prev => ({ ...prev, duration: text }))}
                  placeholder="60"
                  placeholderTextColor={themeColors.textSecondary}
                  keyboardType="numeric"
                />
              </View>
            </ScrollView>
            
            <View style={timetableSectionStyles.modalActions}>
              <Button
                title="Cancelar"
                onPress={() => setShowAddModal(false)}
                variant="outlined"
                theme={theme}
                style={timetableSectionStyles.cancelButton}
              />
              <Button
                title="Agregar Clase"
                onPress={addClass}
                theme={theme}
                style={timetableSectionStyles.addButton}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default TimetableSection;
