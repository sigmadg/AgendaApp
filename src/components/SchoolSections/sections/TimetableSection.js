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
  const [timetable, setTimetable] = useState({});
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

  const renderTimetable = () => {
    const today = new Date();
    const currentDayName = weekDays[today.getDay() - 1] || 'Lunes';
    
    return (
      <View style={timetableSectionStyles.container}>
        <SectionHeader
          title={`Horario de ${weekDays[selectedDayIndex]}`}
          subtitle="Gestiona tu horario de clases"
          image={require('../../../../android/app/src/main/assets/escuela.png')}
          onAddPress={() => setShowAddModal(true)}
          theme={theme}
          size="medium"
        />

        {/* Navegación de días */}
        <View style={timetableSectionStyles.dayNavigation}>
          <TouchableOpacity 
            style={timetableSectionStyles.navButton}
            onPress={() => setSelectedDayIndex(Math.max(0, selectedDayIndex - 1))}
          >
            <Icon name="chevron-back" size={20} color={themeColors.primary} />
          </TouchableOpacity>
          
          <Text style={[timetableSectionStyles.dayTitle, { color: themeColors.text }]}>
            {weekDays[selectedDayIndex]}
          </Text>
          
          <TouchableOpacity 
            style={timetableSectionStyles.navButton}
            onPress={() => setSelectedDayIndex(Math.min(6, selectedDayIndex + 1))}
          >
            <Icon name="chevron-forward" size={20} color={themeColors.primary} />
          </TouchableOpacity>
        </View>

        {/* Navegación de horas */}
        <View style={timetableSectionStyles.hourNavigation}>
          <TouchableOpacity 
            style={timetableSectionStyles.navButton}
            onPress={() => setSelectedHourIndex(Math.max(0, selectedHourIndex - 1))}
          >
            <Icon name="chevron-up" size={20} color={themeColors.primary} />
          </TouchableOpacity>
          
          <Text style={[timetableSectionStyles.hourTitle, { color: themeColors.text }]}>
            {timeSlots[selectedHourIndex]}
          </Text>
          
          <TouchableOpacity 
            style={timetableSectionStyles.navButton}
            onPress={() => setSelectedHourIndex(Math.min(timeSlots.length - 1, selectedHourIndex + 1))}
          >
            <Icon name="chevron-down" size={20} color={themeColors.primary} />
          </TouchableOpacity>
        </View>

        {/* Botón "Ahora" */}
        <View style={timetableSectionStyles.nowButtonContainer}>
          <Button
            title="Ahora"
            onPress={() => {
              goToCurrentDay();
              goToCurrentHour();
            }}
            variant="outlined"
            theme={theme}
            size="small"
            style={timetableSectionStyles.nowButton}
          />
        </View>

        {/* Horario */}
        <View style={timetableSectionStyles.timetableContainer}>
          {timeSlots.map((time, index) => {
            const classKey = `${weekDays[selectedDayIndex]}-${time}`;
            const classData = timetable[classKey];
            const isCurrentTime = convertTo24Hour(time) === getCurrentHour();
            
            return (
              <View 
                key={time} 
                style={[
                  timetableSectionStyles.timeSlot,
                  isCurrentTime && timetableSectionStyles.currentTimeSlot
                ]}
              >
                <Text style={[timetableSectionStyles.timeText, { color: themeColors.textSecondary }]}>
                  {time}
                </Text>
                {classData ? (
                  <View style={[timetableSectionStyles.classCard, { backgroundColor: themeColors.surface }]}>
                    <Text style={[timetableSectionStyles.classSubject, { color: themeColors.text }]}>
                      {classData.subject}
                    </Text>
                    {classData.classroom && (
                      <Text style={[timetableSectionStyles.classDetails, { color: themeColors.textSecondary }]}>
                        Aula: {classData.classroom}
                      </Text>
                    )}
                    {classData.professor && (
                      <Text style={[timetableSectionStyles.classDetails, { color: themeColors.textSecondary }]}>
                        Prof: {classData.professor}
                      </Text>
                    )}
                  </View>
                ) : (
                  <View style={timetableSectionStyles.emptySlot}>
                    <Text style={[timetableSectionStyles.emptyText, { color: themeColors.textSecondary }]}>
                      Libre
                    </Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <View style={timetableSectionStyles.container}>
      {renderTimetable()}
      
      {/* Modal para agregar clase */}
      <Modal
        visible={showAddModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={timetableSectionStyles.modalOverlay}>
          <View style={[timetableSectionStyles.modalContainer, { backgroundColor: themeColors.surface }]}>
            <View style={timetableSectionStyles.modalHeader}>
              <Text style={[timetableSectionStyles.modalTitle, { color: themeColors.text }]}>
                Agregar Nueva Clase
              </Text>
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
                        newClass.day === day && { backgroundColor: themeColors.primary }
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
                        newClass.time === time && { backgroundColor: themeColors.primary }
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
