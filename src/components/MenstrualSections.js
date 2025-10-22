import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';

const MenstrualSections = () => {
  const [activeSection, setActiveSection] = useState('period-log');
  const [periodData, setPeriodData] = useState({
    flow: { heavy: false, regular: false, light: false },
    symptoms: { cramps: false, sex: false, spotting: false, stress: false, headache: false, acne: false },
    notes: ''
  });
  const [cycleLength, setCycleLength] = useState({});
  const [monthlyDays, setMonthlyDays] = useState({});
  const [reminders, setReminders] = useState({});
  const [focus, setFocus] = useState('');
  const [achievements, setAchievements] = useState('');
  
  // Estados para el modal de registro de período
  const [showPeriodModal, setShowPeriodModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [newPeriodEntry, setNewPeriodEntry] = useState({
    flow: '',
    symptoms: [],
    notes: ''
  });

  const sections = [
    { id: 'period-log', name: 'Registro de Período', icon: 'calendar-outline' },
    { id: 'period-tracker', name: 'Seguimiento de Período', icon: 'list-outline' },
    { id: 'cycle-duration', name: 'Duración del Ciclo', icon: 'time-outline' },
    { id: 'cycle-reminder', name: 'Recordatorio de Ciclo', icon: 'alarm-outline' },
    { id: 'flow-monitor', name: 'Monitor de Flujo', icon: 'analytics-outline' }
  ];

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  // Funciones para el modal de registro de período
  const openPeriodModal = () => {
    setNewPeriodEntry({
      flow: '',
      symptoms: [],
      notes: ''
    });
    setSelectedDate(new Date());
    setShowPeriodModal(true);
  };

  const closePeriodModal = () => {
    setShowPeriodModal(false);
    setNewPeriodEntry({
      flow: '',
      symptoms: [],
      notes: ''
    });
  };

  const handleDateChange = (event, date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
    }
  };

  const toggleSymptom = (symptom) => {
    const currentSymptoms = newPeriodEntry.symptoms;
    if (currentSymptoms.includes(symptom)) {
      setNewPeriodEntry({
        ...newPeriodEntry,
        symptoms: currentSymptoms.filter(s => s !== symptom)
      });
    } else {
      setNewPeriodEntry({
        ...newPeriodEntry,
        symptoms: [...currentSymptoms, symptom]
      });
    }
  };

  const savePeriodEntry = () => {
    if (!newPeriodEntry.flow) {
      Alert.alert('Error', 'Por favor selecciona la intensidad del flujo');
      return;
    }

    const month = months[selectedDate.getMonth()];
    const day = selectedDate.getDate();
    const key = `${month}-${day}`;
    
    // Marcar el día en el calendario de "Días del Mes"
    setMonthlyDays({
      ...monthlyDays,
      [key]: true
    });

    // Actualizar los datos del período
    setPeriodData({
      ...periodData,
      flow: {
        ...periodData.flow,
        [newPeriodEntry.flow]: true
      },
      symptoms: {
        ...periodData.symptoms,
        ...newPeriodEntry.symptoms.reduce((acc, symptom) => {
          acc[symptom] = true;
          return acc;
        }, {})
      }
    });

    closePeriodModal();
    Alert.alert('Éxito', `Período registrado para el ${day} de ${month}. El día se ha marcado en el calendario.`);
  };

  const renderSectionTabs = () => (
    <View style={styles.tabsContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll}>
        {sections.map((section) => (
          <TouchableOpacity
            key={section.id}
            style={[
              styles.tab,
              activeSection === section.id && styles.activeTab
            ]}
            onPress={() => setActiveSection(section.id)}
          >
            <Icon 
              name={section.icon} 
              size={20} 
              color={activeSection === section.id ? '#FFFFFF' : '#6c757d'} 
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderPeriodLog = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>REGISTRO DE PERÍODO</Text>
        <TouchableOpacity onPress={openPeriodModal} style={styles.addPeriodButton}>
          <Icon name="add" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.periodLogContainer}>

        <View style={styles.monthlySection}>
          <Text style={styles.monthlyTitle}>Días del Mes</Text>
          {months.map((month, index) => (
            <View key={month} style={styles.monthRow}>
              <Text style={styles.monthLabel}>{month}</Text>
              <View style={styles.dayCircles}>
                {Array.from({ length: 31 }, (_, day) => (
                  <TouchableOpacity
                    key={day}
                    style={[
                      styles.dayCircle,
                      monthlyDays[`${month}-${day + 1}`] && styles.dayCircleMarked
                    ]}
                    onPress={() => {
                      const key = `${month}-${day + 1}`;
                      setMonthlyDays({
                        ...monthlyDays,
                        [key]: !monthlyDays[key]
                      });
                    }}
                  />
                ))}
              </View>
            </View>
          ))}
        </View>


        <View style={styles.notesSection}>
          <View style={styles.notesHeader}>
            <Text style={styles.notesTitle}>NOTAS</Text>
            <Icon name="flower" size={14} color="#DDA0DD" />
          </View>
          <TextInput
            style={styles.notesInput}
            value={periodData.notes}
            onChangeText={(text) => setPeriodData({...periodData, notes: text})}
            placeholder="Escribe tus observaciones sobre tu ciclo menstrual..."
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
        </View>
      </View>
    </View>
  );

  const renderCycleDuration = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>DURACIÓN DEL CICLO</Text>
        <Icon name="time" size={16} color="#DDA0DD" />
      </View>
      
      <View style={styles.cycleDurationContainer}>
        <Text style={styles.cycleDurationSubtitle}>Registra la duración de tu ciclo menstrual por mes</Text>
        
        <View style={styles.cycleLengthTable}>
          <View style={styles.cycleLengthHeader}>
            {months.map(month => (
              <Text key={month} style={styles.cycleLengthHeaderText}>{month}</Text>
            ))}
          </View>
          <View style={styles.cycleLengthRow}>
            {months.map(month => (
              <TextInput
                key={month}
                style={styles.cycleLengthInput}
                value={cycleLength[month] || ''}
                onChangeText={(text) => setCycleLength({...cycleLength, [month]: text})}
                placeholder="28"
                keyboardType="numeric"
                maxLength={2}
              />
            ))}
          </View>
        </View>

        <View style={styles.cycleStatsSection}>
          <Text style={styles.cycleStatsTitle}>Estadísticas del Ciclo</Text>
          <View style={styles.cycleStatsGrid}>
            <View style={styles.cycleStatCard}>
              <Text style={styles.cycleStatNumber}>
                {Object.values(cycleLength).filter(val => val).length > 0 
                  ? Math.round(Object.values(cycleLength).filter(val => val).reduce((sum, val) => sum + parseInt(val), 0) / Object.values(cycleLength).filter(val => val).length)
                  : '--'
                }
              </Text>
              <Text style={styles.cycleStatLabel}>Promedio</Text>
            </View>
            <View style={styles.cycleStatCard}>
              <Text style={styles.cycleStatNumber}>
                {Object.values(cycleLength).filter(val => val).length}
              </Text>
              <Text style={styles.cycleStatLabel}>Meses</Text>
            </View>
            <View style={styles.cycleStatCard}>
              <Text style={styles.cycleStatNumber}>
                {Object.values(cycleLength).filter(val => val).length > 0
                  ? Math.max(...Object.values(cycleLength).filter(val => val).map(val => parseInt(val)))
                  : '--'
                }
              </Text>
              <Text style={styles.cycleStatLabel}>Máximo</Text>
            </View>
            <View style={styles.cycleStatCard}>
              <Text style={styles.cycleStatNumber}>
                {Object.values(cycleLength).filter(val => val).length > 0
                  ? Math.min(...Object.values(cycleLength).filter(val => val).map(val => parseInt(val)))
                  : '--'
                }
              </Text>
              <Text style={styles.cycleStatLabel}>Mínimo</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  const renderPeriodTracker = () => {
    const currentDate = new Date();
    const currentMonth = months[currentDate.getMonth()];
    const currentYear = currentDate.getFullYear();
    
    // Obtener el primer día del mes y el número de días
    const firstDay = new Date(currentYear, currentDate.getMonth(), 1);
    const lastDay = new Date(currentYear, currentDate.getMonth() + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay(); // 0 = Domingo, 1 = Lunes, etc.
    
    // Crear array de días del mes con espacios vacíos al inicio
    const calendarDays = [];
    
    // Agregar espacios vacíos para alinear el primer día del mes
    for (let i = 0; i < startDayOfWeek; i++) {
      calendarDays.push(null);
    }
    
    // Agregar los días del mes
    for (let day = 1; day <= daysInMonth; day++) {
      calendarDays.push(day);
    }

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>SEGUIMIENTO DE PERÍODO</Text>
          <Icon name="list" size={16} color="#DDA0DD" />
        </View>
        
        <View style={styles.trackerContainer}>
          <Text style={styles.trackerSubtitle}>{currentMonth} {currentYear}</Text>
          <View style={styles.currentMonthCalendar}>
            <View style={styles.weekDaysHeader}>
              <Text style={styles.weekDayHeader}>L</Text>
              <Text style={styles.weekDayHeader}>M</Text>
              <Text style={styles.weekDayHeader}>M</Text>
              <Text style={styles.weekDayHeader}>J</Text>
              <Text style={styles.weekDayHeader}>V</Text>
              <Text style={styles.weekDayHeader}>S</Text>
              <Text style={styles.weekDayHeader}>D</Text>
            </View>
            <View style={styles.currentMonthDaysGrid}>
              {calendarDays.map((day, index) => (
                <View key={index} style={styles.currentMonthDayContainer}>
                  {day ? (
                    <TouchableOpacity
                      style={[
                        styles.currentMonthDay,
                        monthlyDays[`${currentMonth}-${day}`] && styles.currentMonthDayMarked
                      ]}
                      onPress={() => {
                        const key = `${currentMonth}-${day}`;
                        setMonthlyDays({
                          ...monthlyDays,
                          [key]: !monthlyDays[key]
                        });
                      }}
                    >
                      <Text style={[
                        styles.currentMonthDayText,
                        monthlyDays[`${currentMonth}-${day}`] && styles.currentMonthDayTextMarked
                      ]}>
                        {day}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.currentMonthEmptyDay} />
                  )}
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderCycleReminder = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>RECORDATORIO DE CICLO</Text>
        <Icon name="alarm" size={16} color="#DDA0DD" />
      </View>
      
      <View style={styles.reminderContainer}>
        <View style={styles.reminderTable}>
          <View style={styles.reminderHeader}>
            {months.map(month => (
              <Text key={month} style={styles.reminderHeaderText}>{month}</Text>
            ))}
          </View>
          {Array.from({ length: 12 }, (_, row) => (
            <View key={row} style={styles.reminderRow}>
              {months.map(month => (
                <TextInput
                  key={`${month}-${row}`}
                  style={styles.reminderInput}
                  value={reminders[`${month}-${row}`] || ''}
                  onChangeText={(text) => setReminders({
                    ...reminders,
                    [`${month}-${row}`]: text
                  })}
                  placeholder=""
                  maxLength={1}
                />
              ))}
            </View>
          ))}
        </View>

        <View style={styles.focusSection}>
          <Text style={styles.focusTitle}>ENFOQUE</Text>
          <TextInput
            style={styles.focusInput}
            value={focus}
            onChangeText={setFocus}
            placeholder="¿En qué te enfocarás este mes?"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.achievementsSection}>
          <Text style={styles.achievementsTitle}>LOGROS</Text>
          <TextInput
            style={styles.achievementsInput}
            value={achievements}
            onChangeText={setAchievements}
            placeholder="¿Qué logros has alcanzado?"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>
      </View>
    </View>
  );

  const renderFlowMonitor = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>MONITOR DE FLUJO</Text>
        <Icon name="analytics" size={16} color="#DDA0DD" />
      </View>
      
      <View style={styles.flowMonitorContainer}>
        <View style={styles.yearInput}>
          <Text style={styles.yearLabel}>Año:</Text>
          <TextInput
            style={styles.yearInputField}
            value="2025"
            editable={false}
          />
        </View>

        <View style={styles.flowMonitorContent}>
          <View style={styles.flowMonitorLeft}>
            <View style={styles.flowNotesSection}>
              <Text style={styles.flowNotesTitle}>NOTAS</Text>
              <TextInput
                style={styles.flowNotesInput}
                placeholder="Observaciones generales..."
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.flowAchievementsSection}>
              <Text style={styles.flowAchievementsTitle}>LOGROS</Text>
              <TextInput
                style={styles.flowAchievementsInput}
                placeholder="Logros del mes..."
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.flowFocusSection}>
              <Text style={styles.flowFocusTitle}>ENFOQUE</Text>
              <TextInput
                style={styles.flowFocusInput}
                placeholder="Enfoque del mes..."
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.flowReminderSection}>
              <Text style={styles.flowReminderTitle}>RECORDATORIO</Text>
              <TextInput
                style={styles.flowReminderInput}
                placeholder="Recordatorios importantes..."
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>

          <View style={styles.flowMonitorRight}>
            <View style={styles.flowKeySection}>
              <Text style={styles.flowKeyTitle}>Clave</Text>
              <View style={styles.flowKeyContent}>
                <View style={styles.flowKeyRow}>
                  <View style={[styles.flowKeyCircle, { backgroundColor: '#FFB6C1' }]} />
                  <Text style={styles.flowKeyLabel}>Pesado</Text>
                </View>
                <View style={styles.flowKeyRow}>
                  <View style={[styles.flowKeyCircle, { backgroundColor: '#FFC0CB' }]} />
                  <Text style={styles.flowKeyLabel}>Regular</Text>
                </View>
                <View style={styles.flowKeyRow}>
                  <View style={[styles.flowKeyCircle, { backgroundColor: '#FFE4E1' }]} />
                  <Text style={styles.flowKeyLabel}>Ligero</Text>
                </View>
              </View>
            </View>

            <View style={styles.flowGridSection}>
              <Text style={styles.flowGridTitle}>Seguimiento Diario</Text>
              <View style={styles.flowGrid}>
                <View style={styles.flowGridHeader}>
                  {Array.from({ length: 31 }, (_, day) => (
                    <Text key={day} style={styles.flowGridHeaderText}>{day + 1}</Text>
                  ))}
                </View>
                {months.map(month => (
                  <View key={month} style={styles.flowGridRow}>
                    <Text style={styles.flowGridMonthLabel}>{month}</Text>
                    {Array.from({ length: 31 }, (_, day) => (
                      <TouchableOpacity
                        key={`${month}-${day}`}
                        style={[
                          styles.flowGridCell,
                          monthlyDays[`${month}-${day + 1}`] && styles.flowGridCellMarked
                        ]}
                        onPress={() => {
                          const key = `${month}-${day + 1}`;
                          setMonthlyDays({
                            ...monthlyDays,
                            [key]: !monthlyDays[key]
                          });
                        }}
                      />
                    ))}
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'period-log':
        return renderPeriodLog();
      case 'period-tracker':
        return renderPeriodTracker();
      case 'cycle-duration':
        return renderCycleDuration();
      case 'cycle-reminder':
        return renderCycleReminder();
      case 'flow-monitor':
        return renderFlowMonitor();
      default:
        return renderPeriodLog();
    }
  };

  return (
    <View style={styles.container}>
      {renderSectionTabs()}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderActiveSection()}
      </ScrollView>

      {/* Modal de Registro de Período */}
      <Modal
        visible={showPeriodModal}
        transparent={true}
        animationType="fade"
        onRequestClose={closePeriodModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.periodModalContainer}>
            <View style={styles.periodModalHeader}>
              <Text style={styles.periodModalTitle}>Registrar Período</Text>
              <TouchableOpacity onPress={closePeriodModal} style={styles.closeModalButton}>
                <Icon name="close" size={24} color="#6c757d" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.periodModalContent} showsVerticalScrollIndicator={false}>
              {/* Selección de Fecha */}
              <View style={styles.periodInputGroup}>
                <Text style={styles.periodInputLabel}>Fecha</Text>
                <TouchableOpacity 
                  style={styles.dateButton}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Icon name="calendar-outline" size={20} color="#DDA0DD" />
                  <Text style={styles.dateButtonText}>
                    {selectedDate.toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })}
                  </Text>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                  />
                )}
              </View>

              {/* Intensidad del Flujo */}
              <View style={styles.periodInputGroup}>
                <Text style={styles.periodInputLabel}>Intensidad del Flujo</Text>
                <View style={styles.flowOptions}>
                  {[
                    { key: 'light', label: 'Ligero', color: '#FFE4E1' },
                    { key: 'regular', label: 'Regular', color: '#FFC0CB' },
                    { key: 'heavy', label: 'Pesado', color: '#FFB6C1' }
                  ].map((option) => (
                    <TouchableOpacity
                      key={option.key}
                      style={[
                        styles.flowOption,
                        { backgroundColor: option.color },
                        newPeriodEntry.flow === option.key && styles.flowOptionSelected
                      ]}
                      onPress={() => setNewPeriodEntry({...newPeriodEntry, flow: option.key})}
                    >
                      <Text style={[
                        styles.flowOptionText,
                        newPeriodEntry.flow === option.key && styles.flowOptionTextSelected
                      ]}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Síntomas */}
              <View style={styles.periodInputGroup}>
                <Text style={styles.periodInputLabel}>Síntomas</Text>
                <View style={styles.symptomsGrid}>
                  {[
                    { key: 'cramps', label: 'Cólicos' },
                    { key: 'headache', label: 'Dolor de cabeza' },
                    { key: 'acne', label: 'Acné' },
                    { key: 'spotting', label: 'Manchado' },
                    { key: 'stress', label: 'Estrés' },
                    { key: 'sex', label: 'Sexo' }
                  ].map((symptom) => (
                    <TouchableOpacity
                      key={symptom.key}
                      style={[
                        styles.symptomOption,
                        newPeriodEntry.symptoms.includes(symptom.key) && styles.symptomOptionSelected
                      ]}
                      onPress={() => toggleSymptom(symptom.key)}
                    >
                      <Text style={[
                        styles.symptomOptionText,
                        newPeriodEntry.symptoms.includes(symptom.key) && styles.symptomOptionTextSelected
                      ]}>
                        {symptom.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Notas */}
              <View style={styles.periodInputGroup}>
                <Text style={styles.periodInputLabel}>Notas</Text>
                <TextInput
                  style={styles.periodNotesInput}
                  value={newPeriodEntry.notes}
                  onChangeText={(text) => setNewPeriodEntry({...newPeriodEntry, notes: text})}
                  placeholder="Observaciones adicionales..."
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            </ScrollView>

            <View style={styles.periodModalActions}>
              <TouchableOpacity 
                onPress={closePeriodModal} 
                style={styles.cancelPeriodButton}
              >
                <Text style={styles.cancelPeriodButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={savePeriodEntry} 
                style={[styles.savePeriodButton, !newPeriodEntry.flow && styles.savePeriodButtonDisabled]}
                disabled={!newPeriodEntry.flow}
              >
                <Text style={styles.savePeriodButtonText}>Guardar Registro</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  tabsContainer: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    paddingVertical: 8,
  },
  tabsScroll: {
    paddingHorizontal: 16,
  },
  tab: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
  },
  activeTab: {
    backgroundColor: '#DDA0DD',
  },
  content: {
    flex: 1,
    paddingHorizontal: 0,
    paddingVertical: 16,
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    marginHorizontal: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d4150',
  },
  // Estilos para Period Log
  periodLogContainer: {
    gap: 20,
  },
  keySection: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
  },
  keyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d4150',
    marginBottom: 16,
  },
  flowSection: {
    marginBottom: 16,
  },
  flowTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2d4150',
    marginBottom: 8,
  },
  symptomsSection: {
    marginBottom: 8,
  },
  symptomsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2d4150',
    marginBottom: 8,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#DDA0DD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: '#DDA0DD',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#2d4150',
  },
  monthlySection: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
  },
  monthlyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d4150',
    marginBottom: 16,
  },
  monthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  monthLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2d4150',
    width: 40,
  },
  dayCircles: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
  },
  dayCircle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e9ecef',
    marginRight: 2,
    marginBottom: 2,
  },
  dayCircleMarked: {
    backgroundColor: '#DDA0DD',
  },
  cycleLengthSection: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
  },
  cycleLengthTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d4150',
    marginBottom: 16,
  },
  cycleLengthTable: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
  },
  cycleLengthHeader: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  cycleLengthHeaderText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6c757d',
    flex: 1,
    textAlign: 'center',
  },
  cycleLengthRow: {
    flexDirection: 'row',
  },
  cycleLengthInput: {
    flex: 1,
    height: 32,
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 4,
    textAlign: 'center',
    fontSize: 12,
    marginHorizontal: 1,
  },
  notesSection: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
  },
  notesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  notesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d4150',
    marginRight: 8,
  },
  notesInput: {
    fontSize: 14,
    color: '#2d4150',
    lineHeight: 20,
    minHeight: 120,
    textAlignVertical: 'top',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  // Estilos para Period Tracker
  trackerContainer: {
    gap: 16,
  },
  trackerSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d4150',
    textAlign: 'center',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  monthCalendar: {
    width: '30%',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
  },
  monthCalendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  monthCalendarTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2d4150',
  },
  weekDays: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 4,
  },
  weekDay: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6c757d',
    width: 16,
    textAlign: 'center',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDay: {
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 1,
  },
  calendarDayMarked: {
    backgroundColor: '#DDA0DD',
    borderRadius: 8,
  },
  calendarDayText: {
    fontSize: 8,
    color: '#2d4150',
  },
  calendarDayTextMarked: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  // Estilos para Cycle Reminder
  reminderContainer: {
    gap: 20,
  },
  reminderTable: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
  },
  reminderHeader: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  reminderHeaderText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6c757d',
    flex: 1,
    textAlign: 'center',
  },
  reminderRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  reminderInput: {
    flex: 1,
    height: 24,
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 4,
    textAlign: 'center',
    fontSize: 10,
    marginHorizontal: 1,
  },
  focusSection: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
  },
  focusTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d4150',
    marginBottom: 12,
  },
  focusInput: {
    fontSize: 14,
    color: '#2d4150',
    lineHeight: 20,
    minHeight: 80,
    textAlignVertical: 'top',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  achievementsSection: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
  },
  achievementsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d4150',
    marginBottom: 12,
  },
  achievementsInput: {
    fontSize: 14,
    color: '#2d4150',
    lineHeight: 20,
    minHeight: 80,
    textAlignVertical: 'top',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  // Estilos para Flow Monitor
  flowMonitorContainer: {
    gap: 20,
  },
  yearInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
  },
  yearLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2d4150',
    marginRight: 8,
  },
  yearInputField: {
    fontSize: 14,
    color: '#2d4150',
    backgroundColor: '#ffffff',
    borderRadius: 4,
    padding: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
    width: 60,
  },
  flowMonitorContent: {
    flexDirection: 'row',
    gap: 16,
  },
  flowMonitorLeft: {
    flex: 1,
    gap: 16,
  },
  flowNotesSection: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
  },
  flowNotesTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2d4150',
    marginBottom: 8,
  },
  flowNotesInput: {
    fontSize: 12,
    color: '#2d4150',
    lineHeight: 16,
    minHeight: 60,
    textAlignVertical: 'top',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  flowAchievementsSection: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
  },
  flowAchievementsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2d4150',
    marginBottom: 8,
  },
  flowAchievementsInput: {
    fontSize: 12,
    color: '#2d4150',
    lineHeight: 16,
    minHeight: 60,
    textAlignVertical: 'top',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  flowFocusSection: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
  },
  flowFocusTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2d4150',
    marginBottom: 8,
  },
  flowFocusInput: {
    fontSize: 12,
    color: '#2d4150',
    lineHeight: 16,
    minHeight: 60,
    textAlignVertical: 'top',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  flowReminderSection: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
  },
  flowReminderTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2d4150',
    marginBottom: 8,
  },
  flowReminderInput: {
    fontSize: 12,
    color: '#2d4150',
    lineHeight: 16,
    minHeight: 60,
    textAlignVertical: 'top',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  flowMonitorRight: {
    flex: 1,
    gap: 16,
  },
  flowKeySection: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
  },
  flowKeyTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2d4150',
    marginBottom: 12,
  },
  flowKeyContent: {
    gap: 8,
  },
  flowKeyRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flowKeyCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  flowKeyLabel: {
    fontSize: 12,
    color: '#2d4150',
  },
  flowGridSection: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
  },
  flowGridTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2d4150',
    marginBottom: 12,
  },
  flowGrid: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 8,
  },
  flowGridHeader: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  flowGridHeaderText: {
    fontSize: 8,
    fontWeight: '600',
    color: '#6c757d',
    width: 8,
    textAlign: 'center',
  },
  flowGridRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  flowGridMonthLabel: {
    fontSize: 8,
    fontWeight: '600',
    color: '#2d4150',
    width: 20,
  },
  flowGridCell: {
    width: 8,
    height: 8,
    backgroundColor: '#e9ecef',
    marginRight: 1,
  },
  flowGridCellMarked: {
    backgroundColor: '#DDA0DD',
  },
  // Estilos para el modal de registro de período
  addPeriodButton: {
    backgroundColor: '#DDA0DD',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  periodModalContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  periodModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  periodModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d4150',
  },
  closeModalButton: {
    padding: 4,
  },
  periodModalContent: {
    maxHeight: 400,
    padding: 20,
  },
  periodInputGroup: {
    marginBottom: 20,
  },
  periodInputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d4150',
    marginBottom: 12,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#2d4150',
    marginLeft: 8,
  },
  flowOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  flowOption: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  flowOptionSelected: {
    borderColor: '#DDA0DD',
  },
  flowOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2d4150',
  },
  flowOptionTextSelected: {
    color: '#DDA0DD',
  },
  symptomsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  symptomOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  symptomOptionSelected: {
    backgroundColor: '#DDA0DD',
    borderColor: '#DDA0DD',
  },
  symptomOptionText: {
    fontSize: 14,
    color: '#2d4150',
  },
  symptomOptionTextSelected: {
    color: '#ffffff',
    fontWeight: '600',
  },
  periodNotesInput: {
    fontSize: 14,
    color: '#2d4150',
    lineHeight: 20,
    minHeight: 80,
    textAlignVertical: 'top',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  periodModalActions: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    gap: 12,
  },
  cancelPeriodButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
  },
  cancelPeriodButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6c757d',
  },
  savePeriodButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#DDA0DD',
    alignItems: 'center',
  },
  savePeriodButtonDisabled: {
    backgroundColor: '#e9ecef',
  },
  savePeriodButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  // Estilos para la sección de duración del ciclo
  cycleDurationContainer: {
    gap: 20,
  },
  cycleDurationSubtitle: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: 16,
  },
  cycleStatsSection: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
  },
  cycleStatsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d4150',
    marginBottom: 16,
    textAlign: 'center',
  },
  cycleStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  cycleStatCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  cycleStatNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#DDA0DD',
    marginBottom: 4,
  },
  cycleStatLabel: {
    fontSize: 12,
    color: '#6c757d',
    textAlign: 'center',
  },
  // Estilos para el calendario del mes actual
  currentMonthCalendar: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
  },
  weekDaysHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  weekDayHeader: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2d4150',
    width: 32,
    textAlign: 'center',
  },
  currentMonthDaysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  currentMonthDayContainer: {
    width: '14.28%', // 100% / 7 días
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  currentMonthDay: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  currentMonthDayMarked: {
    backgroundColor: '#DDA0DD',
    borderColor: '#DDA0DD',
  },
  currentMonthDayText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2d4150',
  },
  currentMonthDayTextMarked: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  currentMonthEmptyDay: {
    width: 32,
    height: 32,
  },
});

export default MenstrualSections;
