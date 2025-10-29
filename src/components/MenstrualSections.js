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

  const renderPeriodLog = () => {
    // Datos de ejemplo para el período
    const samplePeriodData = [
      {
        id: 1,
        date: '2024-01-15',
        flow: 'heavy',
        symptoms: ['cramps', 'headache'],
        notes: 'Período muy intenso con cólicos fuertes',
        mood: 'tired',
        painLevel: 7
      },
      {
        id: 2,
        date: '2024-01-16',
        flow: 'regular',
        symptoms: ['cramps'],
        notes: 'Flujo normal, cólicos moderados',
        mood: 'okay',
        painLevel: 4
      },
      {
        id: 3,
        date: '2024-01-17',
        flow: 'light',
        symptoms: [],
        notes: 'Flujo ligero, sin síntomas',
        mood: 'good',
        painLevel: 1
      }
    ];

    // Estadísticas del período
    const getPeriodStats = () => {
      const totalDays = samplePeriodData.length;
      const heavyDays = samplePeriodData.filter(day => day.flow === 'heavy').length;
      const avgPainLevel = samplePeriodData.reduce((sum, day) => sum + day.painLevel, 0) / totalDays;
      const symptomsCount = samplePeriodData.reduce((sum, day) => sum + day.symptoms.length, 0);
      
      return {
        totalDays,
        heavyDays,
        avgPainLevel: Math.round(avgPainLevel * 10) / 10,
        symptomsCount
      };
    };

    const stats = getPeriodStats();

    // Funciones auxiliares
    const getFlowColor = (flow) => {
      switch (flow) {
        case 'light': return '#FFE4E1';
        case 'regular': return '#FFC0CB';
        case 'heavy': return '#FFB6C1';
        default: return '#F0F0F0';
      }
    };

    const getFlowLabel = (flow) => {
      switch (flow) {
        case 'light': return 'Ligero';
        case 'regular': return 'Regular';
        case 'heavy': return 'Pesado';
        default: return 'N/A';
      }
    };

    const getMoodIcon = (mood) => {
      switch (mood) {
        case 'good': return 'happy-outline';
        case 'okay': return 'remove-outline';
        case 'tired': return 'moon-outline';
        case 'sad': return 'sad-outline';
        default: return 'help-outline';
      }
    };

    const getMoodColor = (mood) => {
      switch (mood) {
        case 'good': return '#4CAF50';
        case 'okay': return '#FF9800';
        case 'tired': return '#9C27B0';
        case 'sad': return '#F44336';
        default: return '#6B7280';
      }
    };

    const getSymptomIcon = (symptom) => {
      switch (symptom) {
        case 'cramps': return 'flash-outline';
        case 'headache': return 'medical-outline';
        case 'acne': return 'ellipse-outline';
        case 'spotting': return 'water-outline';
        case 'stress': return 'trending-down-outline';
        case 'sex': return 'heart-outline';
        default: return 'help-outline';
      }
    };

    return (
      <ScrollView style={styles.periodLogContainer} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.periodLogHeader}>
          <View style={styles.periodLogHeaderContent}>
            <View style={styles.periodLogHeaderIcon}>
              <Icon name="calendar" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.periodLogHeaderText}>
              <Text style={styles.periodLogHeaderTitle}>Registro de Período</Text>
              <Text style={styles.periodLogHeaderSubtitle}>
                Rastrea tu ciclo menstrual
              </Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.periodLogAddButton}
            onPress={openPeriodModal}
          >
            <Icon name="add" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
        {/* Estadísticas */}
        <View style={styles.periodLogStats}>
          <View style={styles.periodLogStatCard}>
            <View style={styles.periodLogStatIcon}>
              <Icon name="calendar-outline" size={20} color="#E91E63" />
            </View>
            <View style={styles.periodLogStatContent}>
              <Text style={styles.periodLogStatNumber}>{stats.totalDays}</Text>
              <Text style={styles.periodLogStatLabel}>Días registrados</Text>
            </View>
          </View>
          <View style={styles.periodLogStatCard}>
            <View style={styles.periodLogStatIcon}>
              <Icon name="water" size={20} color="#FF5722" />
            </View>
            <View style={styles.periodLogStatContent}>
              <Text style={styles.periodLogStatNumber}>{stats.heavyDays}</Text>
              <Text style={styles.periodLogStatLabel}>Días intensos</Text>
            </View>
          </View>
          <View style={styles.periodLogStatCard}>
            <View style={styles.periodLogStatIcon}>
              <Icon name="pulse" size={20} color="#9C27B0" />
            </View>
            <View style={styles.periodLogStatContent}>
              <Text style={styles.periodLogStatNumber}>{stats.avgPainLevel}</Text>
              <Text style={styles.periodLogStatLabel}>Dolor promedio</Text>
            </View>
          </View>
        </View>

        {/* Calendario del mes actual */}
        <View style={styles.periodLogCalendar}>
          <View style={styles.periodLogCalendarHeader}>
            <Text style={styles.periodLogCalendarTitle}>Enero 2024</Text>
            <View style={styles.periodLogCalendarLegend}>
              <View style={styles.periodLogLegendItem}>
                <View style={[styles.periodLogLegendDot, { backgroundColor: '#FFE4E1' }]} />
                <Text style={styles.periodLogLegendText}>Ligero</Text>
              </View>
              <View style={styles.periodLogLegendItem}>
                <View style={[styles.periodLogLegendDot, { backgroundColor: '#FFC0CB' }]} />
                <Text style={styles.periodLogLegendText}>Regular</Text>
              </View>
              <View style={styles.periodLogLegendItem}>
                <View style={[styles.periodLogLegendDot, { backgroundColor: '#FFB6C1' }]} />
                <Text style={styles.periodLogLegendText}>Pesado</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.periodLogCalendarGrid}>
            <View style={styles.periodLogWeekDays}>
              {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, index) => (
                <Text key={index} style={styles.periodLogWeekDay}>{day}</Text>
              ))}
            </View>
            <View style={styles.periodLogDaysGrid}>
              {Array.from({ length: 31 }, (_, day) => {
                const dayNumber = day + 1;
                const dayData = samplePeriodData.find(d => d.date === `2024-01-${dayNumber.toString().padStart(2, '0')}`);
                
                return (
                  <TouchableOpacity
                    key={dayNumber}
                    style={[
                      styles.periodLogDay,
                      dayData && styles.periodLogDayMarked,
                      dayData && { backgroundColor: getFlowColor(dayData.flow) }
                    ]}
                    onPress={() => {
                      // Aquí se podría abrir un modal para editar el día
                      console.log('Editar día:', dayNumber);
                    }}
                  >
                    <Text style={[
                      styles.periodLogDayText,
                      dayData && styles.periodLogDayTextMarked
                    ]}>
                      {dayNumber}
                    </Text>
                    {dayData && (
                      <View style={styles.periodLogDayIndicator}>
                        <Icon 
                          name={getMoodIcon(dayData.mood)} 
                          size={8} 
                          color={getMoodColor(dayData.mood)} 
                        />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        {/* Registros recientes */}
        <View style={styles.periodLogRecent}>
          <View style={styles.periodLogRecentHeader}>
            <Text style={styles.periodLogRecentTitle}>Registros Recientes</Text>
            <TouchableOpacity style={styles.periodLogViewAllButton}>
              <Text style={styles.periodLogViewAllText}>Ver todos</Text>
              <Icon name="arrow-forward" size={16} color="#E91E63" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.periodLogRecentList}>
            {samplePeriodData.map((entry) => (
              <View key={entry.id} style={styles.periodLogEntry}>
                <View style={styles.periodLogEntryHeader}>
                  <View style={styles.periodLogEntryDate}>
                    <Text style={styles.periodLogEntryDay}>
                      {new Date(entry.date).getDate()}
                    </Text>
                    <Text style={styles.periodLogEntryMonth}>
                      {new Date(entry.date).toLocaleDateString('es-ES', { month: 'short' })}
                    </Text>
                  </View>
                  <View style={styles.periodLogEntryInfo}>
                    <View style={styles.periodLogEntryFlow}>
                      <View style={[
                        styles.periodLogEntryFlowDot,
                        { backgroundColor: getFlowColor(entry.flow) }
                      ]} />
                      <Text style={styles.periodLogEntryFlowText}>
                        {getFlowLabel(entry.flow)}
                      </Text>
                    </View>
                    <View style={styles.periodLogEntryMood}>
                      <Icon 
                        name={getMoodIcon(entry.mood)} 
                        size={16} 
                        color={getMoodColor(entry.mood)} 
                      />
                      <Text style={styles.periodLogEntryMoodText}>
                        {entry.mood === 'good' ? 'Bien' : 
                         entry.mood === 'okay' ? 'Regular' : 
                         entry.mood === 'tired' ? 'Cansada' : 'Triste'}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.periodLogEntryPain}>
                    <Icon name="pulse" size={16} color="#9C27B0" />
                    <Text style={styles.periodLogEntryPainText}>{entry.painLevel}/10</Text>
                  </View>
                </View>
                
                {entry.symptoms.length > 0 && (
                  <View style={styles.periodLogEntrySymptoms}>
                    {entry.symptoms.map((symptom, index) => (
                      <View key={index} style={styles.periodLogEntrySymptom}>
                        <Icon 
                          name={getSymptomIcon(symptom)} 
                          size={12} 
                          color="#6B7280" 
                        />
                        <Text style={styles.periodLogEntrySymptomText}>
                          {symptom === 'cramps' ? 'Cólicos' :
                           symptom === 'headache' ? 'Dolor de cabeza' :
                           symptom === 'acne' ? 'Acné' :
                           symptom === 'spotting' ? 'Manchado' :
                           symptom === 'stress' ? 'Estrés' : 'Otro'}
                        </Text>
                      </View>
                ))}
              </View>
                )}
                
                {entry.notes && (
                  <Text style={styles.periodLogEntryNotes}>{entry.notes}</Text>
                )}
            </View>
          ))}
          </View>
        </View>

        {/* Notas generales */}
        <View style={styles.periodLogNotes}>
          <View style={styles.periodLogNotesHeader}>
            <Text style={styles.periodLogNotesTitle}>Notas Generales</Text>
            <Icon name="flower" size={16} color="#E91E63" />
          </View>
          <TextInput
            style={styles.periodLogNotesInput}
            value={periodData.notes}
            onChangeText={(text) => setPeriodData({...periodData, notes: text})}
            placeholder="Escribe tus observaciones sobre tu ciclo menstrual..."
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
      </ScrollView>
    );
  };

  const renderCycleDuration = () => {
    // Datos de ejemplo para la duración del ciclo
    const sampleCycleData = {
      'Enero': 28,
      'Febrero': 30,
      'Marzo': 29,
      'Abril': 27,
      'Mayo': 31,
      'Junio': 28,
      'Julio': 29,
      'Agosto': 30,
      'Septiembre': 28,
      'Octubre': 29,
      'Noviembre': 27,
      'Diciembre': 30
    };

    // Calcular estadísticas del ciclo
    const getCycleStats = () => {
      const values = Object.values(sampleCycleData);
      const average = Math.round(values.reduce((sum, val) => sum + val, 0) / values.length);
      const min = Math.min(...values);
      const max = Math.max(...values);
      const regular = values.filter(val => val >= 26 && val <= 30).length;
      const irregular = values.filter(val => val < 26 || val > 30).length;
      const consistency = Math.round((regular / values.length) * 100);
      
      return {
        average,
        min,
        max,
        regular,
        irregular,
        consistency,
        totalMonths: values.length
      };
    };

    const stats = getCycleStats();

    // Funciones auxiliares
    const getCycleColor = (days) => {
      if (days >= 26 && days <= 30) return '#4CAF50'; // Verde para regular
      if (days < 26) return '#FF9800'; // Naranja para corto
      if (days > 30) return '#F44336'; // Rojo para largo
      return '#6B7280'; // Gris para normal
    };

    const getCycleLabel = (days) => {
      if (days >= 26 && days <= 30) return 'Regular';
      if (days < 26) return 'Corto';
      if (days > 30) return 'Largo';
      return 'Normal';
    };

    const getCycleIcon = (days) => {
      if (days >= 26 && days <= 30) return 'checkmark-circle';
      if (days < 26) return 'arrow-down-circle';
      if (days > 30) return 'arrow-up-circle';
      return 'help-circle';
    };

    return (
      <ScrollView style={styles.cycleDurationContainer} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.cycleDurationHeader}>
          <View style={styles.cycleDurationHeaderContent}>
            <View style={styles.cycleDurationHeaderIcon}>
              <Icon name="time" size={24} color="#FFFFFF" />
      </View>
            <View style={styles.cycleDurationHeaderText}>
              <Text style={styles.cycleDurationHeaderTitle}>Duración del Ciclo</Text>
              <Text style={styles.cycleDurationHeaderSubtitle}>
                Análisis de la regularidad menstrual
              </Text>
    </View>
          </View>
          <TouchableOpacity 
            style={styles.cycleDurationSettingsButton}
            onPress={() => console.log('Configuración')}
          >
            <Icon name="settings" size={20} color="#E91E63" />
          </TouchableOpacity>
        </View>

        {/* Estadísticas principales */}
        <View style={styles.cycleDurationStats}>
          <View style={styles.cycleDurationStatCard}>
            <View style={styles.cycleDurationStatIcon}>
              <Icon name="calendar" size={20} color="#E91E63" />
            </View>
            <View style={styles.cycleDurationStatContent}>
              <Text style={styles.cycleDurationStatNumber}>{stats.average}</Text>
              <Text style={styles.cycleDurationStatLabel}>Promedio</Text>
            </View>
          </View>
          <View style={styles.cycleDurationStatCard}>
            <View style={styles.cycleDurationStatIcon}>
              <Icon name="trending-up" size={20} color="#4CAF50" />
            </View>
            <View style={styles.cycleDurationStatContent}>
              <Text style={styles.cycleDurationStatNumber}>{stats.consistency}%</Text>
              <Text style={styles.cycleDurationStatLabel}>Regularidad</Text>
            </View>
          </View>
          <View style={styles.cycleDurationStatCard}>
            <View style={styles.cycleDurationStatIcon}>
              <Icon name="pulse" size={20} color="#FF9800" />
            </View>
            <View style={styles.cycleDurationStatContent}>
              <Text style={styles.cycleDurationStatNumber}>{stats.irregular}</Text>
              <Text style={styles.cycleDurationStatLabel}>Irregulares</Text>
            </View>
          </View>
      </View>
      
        {/* Gráfico de duración del ciclo */}
        <View style={styles.cycleDurationChart}>
          <View style={styles.cycleDurationChartHeader}>
            <Text style={styles.cycleDurationChartTitle}>Duración por Mes</Text>
            <View style={styles.cycleDurationChartLegend}>
              <View style={styles.cycleDurationLegendItem}>
                <View style={[styles.cycleDurationLegendDot, { backgroundColor: '#4CAF50' }]} />
                <Text style={styles.cycleDurationLegendText}>Regular (26-30)</Text>
          </View>
              <View style={styles.cycleDurationLegendItem}>
                <View style={[styles.cycleDurationLegendDot, { backgroundColor: '#FF9800' }]} />
                <Text style={styles.cycleDurationLegendText}>Corto (&lt;26)</Text>
              </View>
              <View style={styles.cycleDurationLegendItem}>
                <View style={[styles.cycleDurationLegendDot, { backgroundColor: '#F44336' }]} />
                <Text style={styles.cycleDurationLegendText}>Largo (&gt;30)</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.cycleDurationChartGrid}>
            {Object.entries(sampleCycleData).map(([month, days]) => (
              <View key={month} style={styles.cycleDurationChartItem}>
                <View style={styles.cycleDurationChartBar}>
                  <View 
                    style={[
                      styles.cycleDurationChartBarFill,
                      { 
                        height: `${(days / 35) * 100}%`,
                        backgroundColor: getCycleColor(days)
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.cycleDurationChartMonth}>{month.substring(0, 3)}</Text>
                <Text style={styles.cycleDurationChartDays}>{days}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Análisis de regularidad */}
        <View style={styles.cycleDurationAnalysis}>
          <View style={styles.cycleDurationAnalysisHeader}>
            <Text style={styles.cycleDurationAnalysisTitle}>Análisis de Regularidad</Text>
            <Icon name="analytics" size={20} color="#E91E63" />
          </View>
          
          <View style={styles.cycleDurationAnalysisGrid}>
            <View style={styles.cycleDurationAnalysisCard}>
              <View style={styles.cycleDurationAnalysisIcon}>
                <Icon name="checkmark-circle" size={24} color="#4CAF50" />
              </View>
              <View style={styles.cycleDurationAnalysisContent}>
                <Text style={styles.cycleDurationAnalysisTitle}>Ciclos Regulares</Text>
                <Text style={styles.cycleDurationAnalysisNumber}>{stats.regular}</Text>
                <Text style={styles.cycleDurationAnalysisLabel}>de {stats.totalMonths} meses</Text>
                <View style={styles.cycleDurationAnalysisProgress}>
                  <View style={[
                    styles.cycleDurationAnalysisProgressBar, 
                    { width: `${(stats.regular / stats.totalMonths) * 100}%` }
                  ]} />
                </View>
              </View>
            </View>
            
            <View style={styles.cycleDurationAnalysisCard}>
              <View style={styles.cycleDurationAnalysisIcon}>
                <Icon name="warning" size={24} color="#FF9800" />
              </View>
              <View style={styles.cycleDurationAnalysisContent}>
                <Text style={styles.cycleDurationAnalysisTitle}>Ciclos Irregulares</Text>
                <Text style={styles.cycleDurationAnalysisNumber}>{stats.irregular}</Text>
                <Text style={styles.cycleDurationAnalysisLabel}>de {stats.totalMonths} meses</Text>
                <View style={styles.cycleDurationAnalysisProgress}>
                  <View style={[
                    styles.cycleDurationAnalysisProgressBar, 
                    { width: `${(stats.irregular / stats.totalMonths) * 100}%`, backgroundColor: '#FF9800' }
                  ]} />
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Rango de duración */}
        <View style={styles.cycleDurationRange}>
          <View style={styles.cycleDurationRangeHeader}>
            <Text style={styles.cycleDurationRangeTitle}>Rango de Duración</Text>
            <Icon name="resize" size={20} color="#E91E63" />
          </View>
          
          <View style={styles.cycleDurationRangeContent}>
            <View style={styles.cycleDurationRangeItem}>
              <View style={styles.cycleDurationRangeIcon}>
                <Icon name="arrow-up" size={16} color="#F44336" />
              </View>
              <View style={styles.cycleDurationRangeInfo}>
                <Text style={styles.cycleDurationRangeLabel}>Ciclo más largo</Text>
                <Text style={styles.cycleDurationRangeValue}>{stats.max} días</Text>
              </View>
            </View>
            
            <View style={styles.cycleDurationRangeItem}>
              <View style={styles.cycleDurationRangeIcon}>
                <Icon name="arrow-down" size={16} color="#4CAF50" />
              </View>
              <View style={styles.cycleDurationRangeInfo}>
                <Text style={styles.cycleDurationRangeLabel}>Ciclo más corto</Text>
                <Text style={styles.cycleDurationRangeValue}>{stats.min} días</Text>
              </View>
            </View>
            
            <View style={styles.cycleDurationRangeItem}>
              <View style={styles.cycleDurationRangeIcon}>
                <Icon name="remove" size={16} color="#6B7280" />
              </View>
              <View style={styles.cycleDurationRangeInfo}>
                <Text style={styles.cycleDurationRangeLabel}>Diferencia</Text>
                <Text style={styles.cycleDurationRangeValue}>{stats.max - stats.min} días</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Recomendaciones */}
        <View style={styles.cycleDurationRecommendations}>
          <View style={styles.cycleDurationRecommendationsHeader}>
            <Text style={styles.cycleDurationRecommendationsTitle}>Recomendaciones</Text>
            <Icon name="bulb" size={20} color="#E91E63" />
          </View>
          
          <View style={styles.cycleDurationRecommendationsList}>
            {stats.consistency >= 80 ? (
              <View style={styles.cycleDurationRecommendationItem}>
                <Icon name="checkmark-circle" size={16} color="#4CAF50" />
                <Text style={styles.cycleDurationRecommendationText}>
                  ¡Excelente! Tu ciclo es muy regular. Mantén tus hábitos actuales.
              </Text>
            </View>
            ) : stats.consistency >= 60 ? (
              <View style={styles.cycleDurationRecommendationItem}>
                <Icon name="warning" size={16} color="#FF9800" />
                <Text style={styles.cycleDurationRecommendationText}>
                  Tu ciclo es moderadamente regular. Considera reducir el estrés.
              </Text>
            </View>
            ) : (
              <View style={styles.cycleDurationRecommendationItem}>
                <Icon name="alert-circle" size={16} color="#F44336" />
                <Text style={styles.cycleDurationRecommendationText}>
                  Tu ciclo es irregular. Consulta con un profesional de la salud.
              </Text>
            </View>
            )}
            
            <View style={styles.cycleDurationRecommendationItem}>
              <Icon name="fitness" size={16} color="#4CAF50" />
              <Text style={styles.cycleDurationRecommendationText}>
                El ejercicio regular puede ayudar a regularizar tu ciclo
              </Text>
            </View>
            
            <View style={styles.cycleDurationRecommendationItem}>
              <Icon name="moon" size={16} color="#9C27B0" />
              <Text style={styles.cycleDurationRecommendationText}>
                Mantén un horario de sueño consistente para regular tu ciclo
              </Text>
          </View>
            
            <View style={styles.cycleDurationRecommendationItem}>
              <Icon name="restaurant" size={16} color="#FF9800" />
              <Text style={styles.cycleDurationRecommendationText}>
                Una dieta balanceada puede influir en la regularidad del ciclo
              </Text>
        </View>
      </View>
    </View>

        {/* Historial detallado */}
        <View style={styles.cycleDurationHistory}>
          <View style={styles.cycleDurationHistoryHeader}>
            <Text style={styles.cycleDurationHistoryTitle}>Historial Detallado</Text>
            <TouchableOpacity style={styles.cycleDurationHistoryButton}>
              <Text style={styles.cycleDurationHistoryButtonText}>Ver todo</Text>
              <Icon name="arrow-forward" size={16} color="#E91E63" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.cycleDurationHistoryList}>
            {Object.entries(sampleCycleData).map(([month, days]) => (
              <View key={month} style={styles.cycleDurationHistoryItem}>
                <View style={styles.cycleDurationHistoryInfo}>
                  <Text style={styles.cycleDurationHistoryMonth}>{month}</Text>
                  <Text style={styles.cycleDurationHistoryDays}>{days} días</Text>
                </View>
                <View style={styles.cycleDurationHistoryStatus}>
                  <Icon 
                    name={getCycleIcon(days)} 
                    size={16} 
                    color={getCycleColor(days)} 
                  />
                  <Text style={[
                    styles.cycleDurationHistoryLabel,
                    { color: getCycleColor(days) }
                  ]}>
                    {getCycleLabel(days)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    );
  };

  const renderPeriodTracker = () => {
    // Datos de ejemplo para el seguimiento de período
    const samplePeriodData = {
      '2024-01-15': { flow: 'heavy', symptoms: ['cramps', 'headache'], mood: 'tired', painLevel: 7 },
      '2024-01-16': { flow: 'regular', symptoms: ['cramps'], mood: 'okay', painLevel: 4 },
      '2024-01-17': { flow: 'light', symptoms: [], mood: 'good', painLevel: 1 },
      '2024-01-18': { flow: 'light', symptoms: [], mood: 'good', painLevel: 0 },
      '2024-01-19': { flow: 'regular', symptoms: ['spotting'], mood: 'okay', painLevel: 2 },
      '2024-01-20': { flow: 'heavy', symptoms: ['cramps', 'acne'], mood: 'tired', painLevel: 6 },
      '2024-01-21': { flow: 'regular', symptoms: ['cramps'], mood: 'okay', painLevel: 3 },
      '2024-01-22': { flow: 'light', symptoms: [], mood: 'good', painLevel: 1 },
      '2024-01-23': { flow: 'light', symptoms: [], mood: 'good', painLevel: 0 },
      '2024-01-24': { flow: 'regular', symptoms: ['spotting'], mood: 'okay', painLevel: 2 },
      '2024-01-25': { flow: 'heavy', symptoms: ['cramps', 'headache'], mood: 'tired', painLevel: 8 },
      '2024-01-26': { flow: 'regular', symptoms: ['cramps'], mood: 'okay', painLevel: 4 },
      '2024-01-27': { flow: 'light', symptoms: [], mood: 'good', painLevel: 1 },
      '2024-01-28': { flow: 'light', symptoms: [], mood: 'good', painLevel: 0 },
      '2024-01-29': { flow: 'regular', symptoms: ['spotting'], mood: 'okay', painLevel: 2 },
      '2024-01-30': { flow: 'heavy', symptoms: ['cramps', 'acne'], mood: 'tired', painLevel: 7 },
      '2024-01-31': { flow: 'regular', symptoms: ['cramps'], mood: 'okay', painLevel: 3 }
    };

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

    // Funciones auxiliares
    const getFlowColor = (flow) => {
      switch (flow) {
        case 'light': return '#FFE4E1';
        case 'regular': return '#FFC0CB';
        case 'heavy': return '#FFB6C1';
        default: return '#F0F0F0';
      }
    };

    const getMoodIcon = (mood) => {
      switch (mood) {
        case 'good': return 'happy-outline';
        case 'okay': return 'remove-outline';
        case 'tired': return 'moon-outline';
        case 'sad': return 'sad-outline';
        default: return 'help-outline';
      }
    };

    const getMoodColor = (mood) => {
      switch (mood) {
        case 'good': return '#4CAF50';
        case 'okay': return '#FF9800';
        case 'tired': return '#9C27B0';
        case 'sad': return '#F44336';
        default: return '#6B7280';
      }
    };

    const getSymptomIcon = (symptom) => {
      switch (symptom) {
        case 'cramps': return 'flash-outline';
        case 'headache': return 'medical-outline';
        case 'acne': return 'ellipse-outline';
        case 'spotting': return 'water-outline';
        case 'stress': return 'trending-down-outline';
        case 'sex': return 'heart-outline';
        default: return 'help-outline';
      }
    };

    // Calcular estadísticas del mes
    const getMonthStats = () => {
      const periodDays = Object.keys(samplePeriodData).filter(date => 
        date.startsWith('2024-01-')
      );
      const totalDays = periodDays.length;
      const heavyDays = periodDays.filter(date => samplePeriodData[date].flow === 'heavy').length;
      const avgPainLevel = periodDays.reduce((sum, date) => sum + samplePeriodData[date].painLevel, 0) / totalDays;
      const symptomsCount = periodDays.reduce((sum, date) => sum + samplePeriodData[date].symptoms.length, 0);
      
      return {
        totalDays,
        heavyDays,
        avgPainLevel: Math.round(avgPainLevel * 10) / 10,
        symptomsCount
      };
    };

    const stats = getMonthStats();

    return (
      <ScrollView style={styles.periodTrackerContainer} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.periodTrackerHeader}>
          <View style={styles.periodTrackerHeaderContent}>
            <View style={styles.periodTrackerHeaderIcon}>
              <Icon name="analytics" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.periodTrackerHeaderText}>
              <Text style={styles.periodTrackerHeaderTitle}>Seguimiento de Período</Text>
              <Text style={styles.periodTrackerHeaderSubtitle}>
                Análisis detallado de tu ciclo
              </Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.periodTrackerSettingsButton}
            onPress={() => console.log('Configuración')}
          >
            <Icon name="settings" size={20} color="#E91E63" />
          </TouchableOpacity>
        </View>
        
        {/* Estadísticas del mes */}
        <View style={styles.periodTrackerStats}>
          <View style={styles.periodTrackerStatCard}>
            <View style={styles.periodTrackerStatIcon}>
              <Icon name="calendar-outline" size={20} color="#E91E63" />
            </View>
            <View style={styles.periodTrackerStatContent}>
              <Text style={styles.periodTrackerStatNumber}>{stats.totalDays}</Text>
              <Text style={styles.periodTrackerStatLabel}>Días registrados</Text>
            </View>
          </View>
          <View style={styles.periodTrackerStatCard}>
            <View style={styles.periodTrackerStatIcon}>
              <Icon name="water" size={20} color="#FF5722" />
            </View>
            <View style={styles.periodTrackerStatContent}>
              <Text style={styles.periodTrackerStatNumber}>{stats.heavyDays}</Text>
              <Text style={styles.periodTrackerStatLabel}>Días intensos</Text>
            </View>
          </View>
          <View style={styles.periodTrackerStatCard}>
            <View style={styles.periodTrackerStatIcon}>
              <Icon name="pulse" size={20} color="#9C27B0" />
            </View>
            <View style={styles.periodTrackerStatContent}>
              <Text style={styles.periodTrackerStatNumber}>{stats.avgPainLevel}</Text>
              <Text style={styles.periodTrackerStatLabel}>Dolor promedio</Text>
            </View>
          </View>
        </View>

        {/* Calendario del mes */}
        <View style={styles.periodTrackerCalendar}>
          <View style={styles.periodTrackerCalendarHeader}>
            <Text style={styles.periodTrackerCalendarTitle}>{currentMonth} {currentYear}</Text>
            <View style={styles.periodTrackerCalendarLegend}>
              <View style={styles.periodTrackerLegendItem}>
                <View style={[styles.periodTrackerLegendDot, { backgroundColor: '#FFE4E1' }]} />
                <Text style={styles.periodTrackerLegendText}>Ligero</Text>
              </View>
              <View style={styles.periodTrackerLegendItem}>
                <View style={[styles.periodTrackerLegendDot, { backgroundColor: '#FFC0CB' }]} />
                <Text style={styles.periodTrackerLegendText}>Regular</Text>
              </View>
              <View style={styles.periodTrackerLegendItem}>
                <View style={[styles.periodTrackerLegendDot, { backgroundColor: '#FFB6C1' }]} />
                <Text style={styles.periodTrackerLegendText}>Pesado</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.periodTrackerCalendarGrid}>
            <View style={styles.periodTrackerWeekDays}>
              {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, index) => (
                <Text key={index} style={styles.periodTrackerWeekDay}>{day}</Text>
              ))}
            </View>
            <View style={styles.periodTrackerDaysGrid}>
              {calendarDays.map((day, index) => {
                if (!day) {
                  return <View key={index} style={styles.periodTrackerEmptyDay} />;
                }
                
                const dateKey = `2024-01-${day.toString().padStart(2, '0')}`;
                const dayData = samplePeriodData[dateKey];
                
                return (
                    <TouchableOpacity
                    key={day}
                      style={[
                      styles.periodTrackerDay,
                      dayData && styles.periodTrackerDayMarked,
                      dayData && { backgroundColor: getFlowColor(dayData.flow) }
                      ]}
                      onPress={() => {
                      console.log('Editar día:', day);
                      }}
                    >
                      <Text style={[
                      styles.periodTrackerDayText,
                      dayData && styles.periodTrackerDayTextMarked
                      ]}>
                        {day}
                      </Text>
                    {dayData && (
                      <View style={styles.periodTrackerDayIndicator}>
                        <Icon 
                          name={getMoodIcon(dayData.mood)} 
                          size={8} 
                          color={getMoodColor(dayData.mood)} 
                        />
                      </View>
                    )}
                    {dayData && dayData.symptoms.length > 0 && (
                      <View style={styles.periodTrackerDaySymptom}>
                        <Icon name="flash" size={6} color="#FF5722" />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        {/* Análisis de tendencias */}
        <View style={styles.periodTrackerTrends}>
          <View style={styles.periodTrackerTrendsHeader}>
            <Text style={styles.periodTrackerTrendsTitle}>Análisis de Tendencias</Text>
            <Icon name="trending-up" size={20} color="#E91E63" />
          </View>
          
          <View style={styles.periodTrackerTrendsGrid}>
            <View style={styles.periodTrackerTrendCard}>
              <View style={styles.periodTrackerTrendIcon}>
                <Icon name="calendar" size={24} color="#4CAF50" />
              </View>
              <View style={styles.periodTrackerTrendContent}>
                <Text style={styles.periodTrackerTrendTitle}>Ciclo Regular</Text>
                <Text style={styles.periodTrackerTrendDescription}>
                  Tu ciclo se mantiene estable con 28-30 días
                </Text>
                <View style={styles.periodTrackerTrendProgress}>
                  <View style={[styles.periodTrackerTrendProgressBar, { width: '85%' }]} />
                </View>
              </View>
            </View>
            
            <View style={styles.periodTrackerTrendCard}>
              <View style={styles.periodTrackerTrendIcon}>
                <Icon name="water" size={24} color="#FF9800" />
              </View>
              <View style={styles.periodTrackerTrendContent}>
                <Text style={styles.periodTrackerTrendTitle}>Flujo Moderado</Text>
                <Text style={styles.periodTrackerTrendDescription}>
                  Intensidad promedio de 2.5/3 en la escala
                </Text>
                <View style={styles.periodTrackerTrendProgress}>
                  <View style={[styles.periodTrackerTrendProgressBar, { width: '70%' }]} />
                </View>
              </View>
            </View>
            
            <View style={styles.periodTrackerTrendCard}>
              <View style={styles.periodTrackerTrendIcon}>
                <Icon name="pulse" size={24} color="#F44336" />
              </View>
              <View style={styles.periodTrackerTrendContent}>
                <Text style={styles.periodTrackerTrendTitle}>Dolor Moderado</Text>
                <Text style={styles.periodTrackerTrendDescription}>
                  Nivel promedio de dolor de 3.2/10
                </Text>
                <View style={styles.periodTrackerTrendProgress}>
                  <View style={[styles.periodTrackerTrendProgressBar, { width: '32%' }]} />
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Síntomas más comunes */}
        <View style={styles.periodTrackerSymptoms}>
          <View style={styles.periodTrackerSymptomsHeader}>
            <Text style={styles.periodTrackerSymptomsTitle}>Síntomas Más Comunes</Text>
            <Icon name="medical" size={20} color="#E91E63" />
          </View>
          
          <View style={styles.periodTrackerSymptomsList}>
            {[
              { symptom: 'cramps', count: 12, percentage: 70 },
              { symptom: 'headache', count: 8, percentage: 47 },
              { symptom: 'acne', count: 6, percentage: 35 },
              { symptom: 'spotting', count: 4, percentage: 24 },
              { symptom: 'stress', count: 3, percentage: 18 }
            ].map((item, index) => (
              <View key={index} style={styles.periodTrackerSymptomItem}>
                <View style={styles.periodTrackerSymptomInfo}>
                  <Icon 
                    name={getSymptomIcon(item.symptom)} 
                    size={16} 
                    color="#6B7280" 
                  />
                  <Text style={styles.periodTrackerSymptomName}>
                    {item.symptom === 'cramps' ? 'Cólicos' :
                     item.symptom === 'headache' ? 'Dolor de cabeza' :
                     item.symptom === 'acne' ? 'Acné' :
                     item.symptom === 'spotting' ? 'Manchado' :
                     item.symptom === 'stress' ? 'Estrés' : 'Otro'}
                  </Text>
                </View>
                <View style={styles.periodTrackerSymptomStats}>
                  <Text style={styles.periodTrackerSymptomCount}>{item.count} días</Text>
                  <View style={styles.periodTrackerSymptomProgress}>
                    <View style={[
                      styles.periodTrackerSymptomProgressBar, 
                      { width: `${item.percentage}%` }
                    ]} />
                  </View>
                </View>
                </View>
              ))}
            </View>
          </View>

        {/* Recomendaciones */}
        <View style={styles.periodTrackerRecommendations}>
          <View style={styles.periodTrackerRecommendationsHeader}>
            <Text style={styles.periodTrackerRecommendationsTitle}>Recomendaciones</Text>
            <Icon name="bulb" size={20} color="#E91E63" />
        </View>
          
          <View style={styles.periodTrackerRecommendationsList}>
            <View style={styles.periodTrackerRecommendationItem}>
              <Icon name="water" size={16} color="#2196F3" />
              <Text style={styles.periodTrackerRecommendationText}>
                Mantén una hidratación adecuada durante tu período
              </Text>
      </View>
            <View style={styles.periodTrackerRecommendationItem}>
              <Icon name="fitness" size={16} color="#4CAF50" />
              <Text style={styles.periodTrackerRecommendationText}>
                El ejercicio ligero puede ayudar con los cólicos
              </Text>
            </View>
            <View style={styles.periodTrackerRecommendationItem}>
              <Icon name="restaurant" size={16} color="#FF9800" />
              <Text style={styles.periodTrackerRecommendationText}>
                Consume alimentos ricos en hierro y magnesio
              </Text>
            </View>
            <View style={styles.periodTrackerRecommendationItem}>
              <Icon name="moon" size={16} color="#9C27B0" />
              <Text style={styles.periodTrackerRecommendationText}>
                Prioriza el descanso y el sueño de calidad
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  };

  const renderCycleReminder = () => {
    // Datos de ejemplo para recordatorios
    const sampleReminders = [
      {
        id: 1,
        title: 'Inicio de período',
        description: 'Recordatorio para el primer día de tu período',
        date: '2024-01-15',
        time: '08:00',
        type: 'period_start',
        isActive: true,
        repeat: 'monthly'
      },
      {
        id: 2,
        title: 'Fin de período',
        description: 'Recordatorio para el último día de tu período',
        date: '2024-01-19',
        time: '20:00',
        type: 'period_end',
        isActive: true,
        repeat: 'monthly'
      },
      {
        id: 3,
        title: 'Ovulación',
        description: 'Recordatorio para el período de ovulación',
        date: '2024-01-29',
        time: '10:00',
        type: 'ovulation',
        isActive: true,
        repeat: 'monthly'
      },
      {
        id: 4,
        title: 'Tomar vitaminas',
        description: 'Recordatorio diario para tomar vitaminas',
        date: '2024-01-20',
        time: '09:00',
        type: 'medication',
        isActive: true,
        repeat: 'daily'
      },
      {
        id: 5,
        title: 'Cita médica',
        description: 'Revisión ginecológica anual',
        date: '2024-02-15',
        time: '14:00',
        type: 'appointment',
        isActive: false,
        repeat: 'yearly'
      }
    ];

    // Funciones auxiliares
    const getReminderIcon = (type) => {
      switch (type) {
        case 'period_start': return 'play-circle';
        case 'period_end': return 'stop-circle';
        case 'ovulation': return 'egg';
        case 'medication': return 'medical';
        case 'appointment': return 'calendar';
        default: return 'alarm';
      }
    };

    const getReminderColor = (type) => {
      switch (type) {
        case 'period_start': return '#E91E63';
        case 'period_end': return '#9C27B0';
        case 'ovulation': return '#FF9800';
        case 'medication': return '#4CAF50';
        case 'appointment': return '#2196F3';
        default: return '#6B7280';
      }
    };

    const getRepeatLabel = (repeat) => {
      switch (repeat) {
        case 'daily': return 'Diario';
        case 'weekly': return 'Semanal';
        case 'monthly': return 'Mensual';
        case 'yearly': return 'Anual';
        default: return 'Personalizado';
      }
    };

    const getStatusColor = (isActive) => {
      return isActive ? '#4CAF50' : '#F44336';
    };

    const getStatusLabel = (isActive) => {
      return isActive ? 'Activo' : 'Inactivo';
    };

    return (
      <ScrollView style={styles.cycleReminderContainer} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.cycleReminderHeader}>
          <View style={styles.cycleReminderHeaderContent}>
            <View style={styles.cycleReminderHeaderIcon}>
              <Icon name="alarm" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.cycleReminderHeaderText}>
              <Text style={styles.cycleReminderHeaderTitle}>Recordatorios de Ciclo</Text>
              <Text style={styles.cycleReminderHeaderSubtitle}>
                Gestiona tus recordatorios menstruales
              </Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.cycleReminderAddButton}
            onPress={() => console.log('Agregar recordatorio')}
          >
            <Icon name="add" size={20} color="#FFFFFF" />
          </TouchableOpacity>
      </View>
      
        {/* Estadísticas de recordatorios */}
        <View style={styles.cycleReminderStats}>
          <View style={styles.cycleReminderStatCard}>
            <View style={styles.cycleReminderStatIcon}>
              <Icon name="alarm" size={20} color="#E91E63" />
          </View>
            <View style={styles.cycleReminderStatContent}>
              <Text style={styles.cycleReminderStatNumber}>{sampleReminders.length}</Text>
              <Text style={styles.cycleReminderStatLabel}>Total</Text>
            </View>
          </View>
          <View style={styles.cycleReminderStatCard}>
            <View style={styles.cycleReminderStatIcon}>
              <Icon name="checkmark-circle" size={20} color="#4CAF50" />
            </View>
            <View style={styles.cycleReminderStatContent}>
              <Text style={styles.cycleReminderStatNumber}>
                {sampleReminders.filter(r => r.isActive).length}
              </Text>
              <Text style={styles.cycleReminderStatLabel}>Activos</Text>
            </View>
          </View>
          <View style={styles.cycleReminderStatCard}>
            <View style={styles.cycleReminderStatIcon}>
              <Icon name="calendar" size={20} color="#FF9800" />
            </View>
            <View style={styles.cycleReminderStatContent}>
              <Text style={styles.cycleReminderStatNumber}>
                {sampleReminders.filter(r => r.type === 'period_start' || r.type === 'period_end').length}
              </Text>
              <Text style={styles.cycleReminderStatLabel}>Período</Text>
            </View>
          </View>
        </View>

        {/* Recordatorios activos */}
        <View style={styles.cycleReminderActive}>
          <View style={styles.cycleReminderActiveHeader}>
            <Text style={styles.cycleReminderActiveTitle}>Recordatorios Activos</Text>
            <Icon name="checkmark-circle" size={20} color="#4CAF50" />
          </View>
          
          <View style={styles.cycleReminderActiveList}>
            {sampleReminders.filter(r => r.isActive).map((reminder) => (
              <View key={reminder.id} style={styles.cycleReminderActiveItem}>
                <View style={styles.cycleReminderActiveItemHeader}>
                  <View style={styles.cycleReminderActiveItemIcon}>
                    <Icon 
                      name={getReminderIcon(reminder.type)} 
                      size={20} 
                      color={getReminderColor(reminder.type)} 
                    />
                  </View>
                  <View style={styles.cycleReminderActiveItemInfo}>
                    <Text style={styles.cycleReminderActiveItemTitle}>{reminder.title}</Text>
                    <Text style={styles.cycleReminderActiveItemDescription}>{reminder.description}</Text>
                  </View>
                  <View style={styles.cycleReminderActiveItemStatus}>
                    <View style={[
                      styles.cycleReminderActiveItemStatusDot,
                      { backgroundColor: getStatusColor(reminder.isActive) }
                    ]} />
                    <Text style={[
                      styles.cycleReminderActiveItemStatusText,
                      { color: getStatusColor(reminder.isActive) }
                    ]}>
                      {getStatusLabel(reminder.isActive)}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.cycleReminderActiveItemDetails}>
                  <View style={styles.cycleReminderActiveItemDetail}>
                    <Icon name="calendar-outline" size={14} color="#6B7280" />
                    <Text style={styles.cycleReminderActiveItemDetailText}>
                      {new Date(reminder.date).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </Text>
                  </View>
                  <View style={styles.cycleReminderActiveItemDetail}>
                    <Icon name="time-outline" size={14} color="#6B7280" />
                    <Text style={styles.cycleReminderActiveItemDetailText}>{reminder.time}</Text>
                  </View>
                  <View style={styles.cycleReminderActiveItemDetail}>
                    <Icon name="repeat" size={14} color="#6B7280" />
                    <Text style={styles.cycleReminderActiveItemDetailText}>
                      {getRepeatLabel(reminder.repeat)}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Recordatorios inactivos */}
        <View style={styles.cycleReminderInactive}>
          <View style={styles.cycleReminderInactiveHeader}>
            <Text style={styles.cycleReminderInactiveTitle}>Recordatorios Inactivos</Text>
            <Icon name="pause-circle" size={20} color="#F44336" />
          </View>
          
          <View style={styles.cycleReminderInactiveList}>
            {sampleReminders.filter(r => !r.isActive).map((reminder) => (
              <View key={reminder.id} style={styles.cycleReminderInactiveItem}>
                <View style={styles.cycleReminderInactiveItemHeader}>
                  <View style={styles.cycleReminderInactiveItemIcon}>
                    <Icon 
                      name={getReminderIcon(reminder.type)} 
                      size={16} 
                      color="#6B7280" 
                    />
                  </View>
                  <View style={styles.cycleReminderInactiveItemInfo}>
                    <Text style={styles.cycleReminderInactiveItemTitle}>{reminder.title}</Text>
                    <Text style={styles.cycleReminderInactiveItemDescription}>{reminder.description}</Text>
                  </View>
                  <TouchableOpacity style={styles.cycleReminderInactiveItemButton}>
                    <Icon name="play" size={16} color="#4CAF50" />
                  </TouchableOpacity>
                </View>
              </View>
              ))}
            </View>
        </View>

        {/* Tipos de recordatorios */}
        <View style={styles.cycleReminderTypes}>
          <View style={styles.cycleReminderTypesHeader}>
            <Text style={styles.cycleReminderTypesTitle}>Tipos de Recordatorios</Text>
            <Icon name="list" size={20} color="#E91E63" />
          </View>
          
          <View style={styles.cycleReminderTypesGrid}>
            {[
              { type: 'period_start', label: 'Inicio de Período', icon: 'play-circle', color: '#E91E63' },
              { type: 'period_end', label: 'Fin de Período', icon: 'stop-circle', color: '#9C27B0' },
              { type: 'ovulation', label: 'Ovulación', icon: 'egg', color: '#FF9800' },
              { type: 'medication', label: 'Medicamentos', icon: 'medical', color: '#4CAF50' },
              { type: 'appointment', label: 'Citas Médicas', icon: 'calendar', color: '#2196F3' },
              { type: 'custom', label: 'Personalizado', icon: 'add-circle', color: '#6B7280' }
            ].map((item, index) => (
              <TouchableOpacity key={index} style={styles.cycleReminderTypeCard}>
                <View style={[
                  styles.cycleReminderTypeIcon,
                  { backgroundColor: item.color }
                ]}>
                  <Icon name={item.icon} size={20} color="#FFFFFF" />
                </View>
                <Text style={styles.cycleReminderTypeLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Configuración de notificaciones */}
        <View style={styles.cycleReminderSettings}>
          <View style={styles.cycleReminderSettingsHeader}>
            <Text style={styles.cycleReminderSettingsTitle}>Configuración</Text>
            <Icon name="settings" size={20} color="#E91E63" />
        </View>

          <View style={styles.cycleReminderSettingsList}>
            <View style={styles.cycleReminderSettingsItem}>
              <View style={styles.cycleReminderSettingsItemInfo}>
                <Icon name="notifications" size={20} color="#E91E63" />
                <Text style={styles.cycleReminderSettingsItemLabel}>Notificaciones Push</Text>
        </View>
              <TouchableOpacity style={styles.cycleReminderSettingsToggle}>
                <View style={[styles.cycleReminderSettingsToggleDot, { backgroundColor: '#4CAF50' }]} />
              </TouchableOpacity>
      </View>
            
            <View style={styles.cycleReminderSettingsItem}>
              <View style={styles.cycleReminderSettingsItemInfo}>
                <Icon name="volume-high" size={20} color="#E91E63" />
                <Text style={styles.cycleReminderSettingsItemLabel}>Sonido de Alerta</Text>
    </View>
              <TouchableOpacity style={styles.cycleReminderSettingsToggle}>
                <View style={[styles.cycleReminderSettingsToggleDot, { backgroundColor: '#4CAF50' }]} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.cycleReminderSettingsItem}>
              <View style={styles.cycleReminderSettingsItemInfo}>
                <Icon name="vibrate" size={20} color="#E91E63" />
                <Text style={styles.cycleReminderSettingsItemLabel}>Vibración</Text>
              </View>
              <TouchableOpacity style={styles.cycleReminderSettingsToggle}>
                <View style={[styles.cycleReminderSettingsToggleDot, { backgroundColor: '#4CAF50' }]} />
              </TouchableOpacity>
      </View>
      
            <View style={styles.cycleReminderSettingsItem}>
              <View style={styles.cycleReminderSettingsItemInfo}>
                <Icon name="moon" size={20} color="#E91E63" />
                <Text style={styles.cycleReminderSettingsItemLabel}>Modo Nocturno</Text>
              </View>
              <TouchableOpacity style={styles.cycleReminderSettingsToggle}>
                <View style={[styles.cycleReminderSettingsToggleDot, { backgroundColor: '#E5E7EB' }]} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Consejos y recomendaciones */}
        <View style={styles.cycleReminderTips}>
          <View style={styles.cycleReminderTipsHeader}>
            <Text style={styles.cycleReminderTipsTitle}>Consejos</Text>
            <Icon name="bulb" size={20} color="#E91E63" />
            </View>

          <View style={styles.cycleReminderTipsList}>
            <View style={styles.cycleReminderTipItem}>
              <Icon name="checkmark-circle" size={16} color="#4CAF50" />
              <Text style={styles.cycleReminderTipText}>
                Configura recordatorios para el inicio y fin de tu período
              </Text>
            </View>
            <View style={styles.cycleReminderTipItem}>
              <Icon name="checkmark-circle" size={16} color="#4CAF50" />
              <Text style={styles.cycleReminderTipText}>
                Establece alertas para tomar medicamentos o vitaminas
              </Text>
            </View>
            <View style={styles.cycleReminderTipItem}>
              <Icon name="checkmark-circle" size={16} color="#4CAF50" />
              <Text style={styles.cycleReminderTipText}>
                Programa recordatorios para citas médicas importantes
              </Text>
            </View>
            <View style={styles.cycleReminderTipItem}>
              <Icon name="checkmark-circle" size={16} color="#4CAF50" />
              <Text style={styles.cycleReminderTipText}>
                Usa diferentes tipos de recordatorios para mejor organización
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  };

  const renderFlowMonitor = () => {
    // Datos de ejemplo para el monitoreo del flujo
    const sampleFlowData = {
      '2024-01': {
        '1': { intensity: 'light', symptoms: ['cramps'], notes: 'Primer día, flujo ligero' },
        '2': { intensity: 'regular', symptoms: ['cramps', 'headache'], notes: 'Flujo regular con cólicos' },
        '3': { intensity: 'heavy', symptoms: ['cramps'], notes: 'Día más intenso' },
        '4': { intensity: 'heavy', symptoms: ['cramps'], notes: 'Continúa intenso' },
        '5': { intensity: 'regular', symptoms: ['cramps'], notes: 'Disminuyendo' },
        '6': { intensity: 'light', symptoms: [], notes: 'Casi terminando' },
        '7': { intensity: 'light', symptoms: [], notes: 'Último día' }
      },
      '2024-02': {
        '1': { intensity: 'light', symptoms: ['cramps'], notes: 'Inicio del período' },
        '2': { intensity: 'regular', symptoms: ['cramps', 'headache'], notes: 'Flujo regular' },
        '3': { intensity: 'heavy', symptoms: ['cramps'], notes: 'Día intenso' },
        '4': { intensity: 'heavy', symptoms: ['cramps'], notes: 'Muy intenso' },
        '5': { intensity: 'regular', symptoms: ['cramps'], notes: 'Disminuyendo' },
        '6': { intensity: 'light', symptoms: [], notes: 'Casi terminando' }
      }
    };

    // Estadísticas del flujo
    const flowStats = {
      totalDays: 13,
      heavyDays: 4,
      regularDays: 5,
      lightDays: 4,
      averageIntensity: 'Regular',
      mostCommonSymptom: 'Cólicos',
      cycleLength: 28
    };

    // Funciones auxiliares
    const getIntensityColor = (intensity) => {
      switch (intensity) {
        case 'light': return '#FFE4E1';
        case 'regular': return '#FFC0CB';
        case 'heavy': return '#FFB6C1';
        default: return '#E5E7EB';
      }
    };

    const getIntensityLabel = (intensity) => {
      switch (intensity) {
        case 'light': return 'Ligero';
        case 'regular': return 'Regular';
        case 'heavy': return 'Pesado';
        default: return 'Sin registro';
      }
    };

    const getSymptomIcon = (symptom) => {
      switch (symptom) {
        case 'cramps': return 'flash';
        case 'headache': return 'medical';
        case 'acne': return 'ellipse';
        case 'spotting': return 'water';
        case 'stress': return 'sad';
        case 'sex': return 'heart';
        default: return 'help';
      }
    };

    const getSymptomColor = (symptom) => {
      switch (symptom) {
        case 'cramps': return '#E91E63';
        case 'headache': return '#FF9800';
        case 'acne': return '#9C27B0';
        case 'spotting': return '#2196F3';
        case 'stress': return '#F44336';
        case 'sex': return '#4CAF50';
        default: return '#6B7280';
      }
    };

    return (
      <ScrollView style={styles.flowMonitorContainer} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.flowMonitorHeader}>
          <View style={styles.flowMonitorHeaderContent}>
            <View style={styles.flowMonitorHeaderIcon}>
              <Icon name="analytics" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.flowMonitorHeaderText}>
              <Text style={styles.flowMonitorHeaderTitle}>Monitoreo del Flujo</Text>
              <Text style={styles.flowMonitorHeaderSubtitle}>
                Análisis detallado de tu flujo menstrual
              </Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.flowMonitorSettingsButton}
            onPress={() => console.log('Configuración')}
          >
            <Icon name="settings" size={20} color="#FFFFFF" />
          </TouchableOpacity>
            </View>

        {/* Estadísticas del flujo */}
        <View style={styles.flowMonitorStats}>
          <View style={styles.flowMonitorStatCard}>
            <View style={styles.flowMonitorStatIcon}>
              <Icon name="calendar" size={20} color="#E91E63" />
            </View>
            <View style={styles.flowMonitorStatContent}>
              <Text style={styles.flowMonitorStatNumber}>{flowStats.totalDays}</Text>
              <Text style={styles.flowMonitorStatLabel}>Días Registrados</Text>
            </View>
          </View>
          <View style={styles.flowMonitorStatCard}>
            <View style={styles.flowMonitorStatIcon}>
              <Icon name="trending-up" size={20} color="#FF9800" />
            </View>
            <View style={styles.flowMonitorStatContent}>
              <Text style={styles.flowMonitorStatNumber}>{flowStats.averageIntensity}</Text>
              <Text style={styles.flowMonitorStatLabel}>Intensidad Promedio</Text>
            </View>
          </View>
          <View style={styles.flowMonitorStatCard}>
            <View style={styles.flowMonitorStatIcon}>
              <Icon name="medical" size={20} color="#9C27B0" />
            </View>
            <View style={styles.flowMonitorStatContent}>
              <Text style={styles.flowMonitorStatNumber}>{flowStats.mostCommonSymptom}</Text>
              <Text style={styles.flowMonitorStatLabel}>Síntoma Común</Text>
            </View>
            </View>
          </View>

        {/* Análisis de intensidad */}
        <View style={styles.flowMonitorAnalysis}>
          <View style={styles.flowMonitorAnalysisHeader}>
            <Text style={styles.flowMonitorAnalysisTitle}>Análisis de Intensidad</Text>
            <Icon name="bar-chart" size={20} color="#E91E63" />
                </View>
          
          <View style={styles.flowMonitorAnalysisContent}>
            <View style={styles.flowMonitorAnalysisItem}>
              <View style={styles.flowMonitorAnalysisItemHeader}>
                <View style={[styles.flowMonitorAnalysisDot, { backgroundColor: '#FFB6C1' }]} />
                <Text style={styles.flowMonitorAnalysisLabel}>Pesado</Text>
                </View>
              <View style={styles.flowMonitorAnalysisBar}>
                <View style={[
                  styles.flowMonitorAnalysisBarFill,
                  { 
                    width: `${(flowStats.heavyDays / flowStats.totalDays) * 100}%`,
                    backgroundColor: '#FFB6C1'
                  }
                ]} />
                </View>
              <Text style={styles.flowMonitorAnalysisValue}>{flowStats.heavyDays} días</Text>
              </View>
            
            <View style={styles.flowMonitorAnalysisItem}>
              <View style={styles.flowMonitorAnalysisItemHeader}>
                <View style={[styles.flowMonitorAnalysisDot, { backgroundColor: '#FFC0CB' }]} />
                <Text style={styles.flowMonitorAnalysisLabel}>Regular</Text>
              </View>
              <View style={styles.flowMonitorAnalysisBar}>
                <View style={[
                  styles.flowMonitorAnalysisBarFill,
                  { 
                    width: `${(flowStats.regularDays / flowStats.totalDays) * 100}%`,
                    backgroundColor: '#FFC0CB'
                  }
                ]} />
              </View>
              <Text style={styles.flowMonitorAnalysisValue}>{flowStats.regularDays} días</Text>
            </View>

            <View style={styles.flowMonitorAnalysisItem}>
              <View style={styles.flowMonitorAnalysisItemHeader}>
                <View style={[styles.flowMonitorAnalysisDot, { backgroundColor: '#FFE4E1' }]} />
                <Text style={styles.flowMonitorAnalysisLabel}>Ligero</Text>
                </View>
              <View style={styles.flowMonitorAnalysisBar}>
                <View style={[
                  styles.flowMonitorAnalysisBarFill,
                  { 
                    width: `${(flowStats.lightDays / flowStats.totalDays) * 100}%`,
                    backgroundColor: '#FFE4E1'
                  }
                ]} />
              </View>
              <Text style={styles.flowMonitorAnalysisValue}>{flowStats.lightDays} días</Text>
            </View>
          </View>
        </View>

        {/* Calendario de flujo */}
        <View style={styles.flowMonitorCalendar}>
          <View style={styles.flowMonitorCalendarHeader}>
            <Text style={styles.flowMonitorCalendarTitle}>Calendario de Flujo</Text>
            <View style={styles.flowMonitorCalendarLegend}>
              <View style={styles.flowMonitorLegendItem}>
                <View style={[styles.flowMonitorLegendDot, { backgroundColor: '#FFB6C1' }]} />
                <Text style={styles.flowMonitorLegendText}>Pesado</Text>
              </View>
              <View style={styles.flowMonitorLegendItem}>
                <View style={[styles.flowMonitorLegendDot, { backgroundColor: '#FFC0CB' }]} />
                <Text style={styles.flowMonitorLegendText}>Regular</Text>
              </View>
              <View style={styles.flowMonitorLegendItem}>
                <View style={[styles.flowMonitorLegendDot, { backgroundColor: '#FFE4E1' }]} />
                <Text style={styles.flowMonitorLegendText}>Ligero</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.flowMonitorCalendarContent}>
            {Object.entries(sampleFlowData).map(([month, days]) => (
              <View key={month} style={styles.flowMonitorMonthCard}>
                <Text style={styles.flowMonitorMonthTitle}>
                  {new Date(2024, parseInt(month.split('-')[1]) - 1).toLocaleDateString('es-ES', { 
                    month: 'long', 
                    year: 'numeric' 
                  }).toUpperCase()}
                </Text>
                
                <View style={styles.flowMonitorDaysGrid}>
                  {Object.entries(days).map(([day, data]) => (
                      <TouchableOpacity
                        key={`${month}-${day}`}
                        style={[
                        styles.flowMonitorDayCard,
                        { backgroundColor: getIntensityColor(data.intensity) }
                      ]}
                      onPress={() => console.log('Editar día', day)}
                    >
                      <Text style={styles.flowMonitorDayNumber}>{day}</Text>
                      <Text style={styles.flowMonitorDayIntensity}>
                        {getIntensityLabel(data.intensity)}
                      </Text>
                      {data.symptoms.length > 0 && (
                        <View style={styles.flowMonitorDaySymptoms}>
                          {data.symptoms.slice(0, 2).map((symptom, index) => (
                            <Icon
                              key={index}
                              name={getSymptomIcon(symptom)}
                              size={12}
                              color={getSymptomColor(symptom)}
                      />
                    ))}
                  </View>
                      )}
                    </TouchableOpacity>
                ))}
              </View>
            </View>
            ))}
          </View>
        </View>

        {/* Síntomas más comunes */}
        <View style={styles.flowMonitorSymptoms}>
          <View style={styles.flowMonitorSymptomsHeader}>
            <Text style={styles.flowMonitorSymptomsTitle}>Síntomas Registrados</Text>
            <Icon name="medical" size={20} color="#E91E63" />
      </View>
          
          <View style={styles.flowMonitorSymptomsList}>
            {[
              { symptom: 'cramps', label: 'Cólicos', count: 8, percentage: 62 },
              { symptom: 'headache', label: 'Dolor de Cabeza', count: 5, percentage: 38 },
              { symptom: 'acne', label: 'Acné', count: 3, percentage: 23 },
              { symptom: 'spotting', label: 'Manchado', count: 2, percentage: 15 },
              { symptom: 'stress', label: 'Estrés', count: 4, percentage: 31 }
            ].map((item, index) => (
              <View key={index} style={styles.flowMonitorSymptomItem}>
                <View style={styles.flowMonitorSymptomInfo}>
                  <View style={[
                    styles.flowMonitorSymptomIcon,
                    { backgroundColor: getSymptomColor(item.symptom) }
                  ]}>
                    <Icon name={getSymptomIcon(item.symptom)} size={16} color="#FFFFFF" />
    </View>
                  <Text style={styles.flowMonitorSymptomLabel}>{item.label}</Text>
                </View>
                <View style={styles.flowMonitorSymptomStats}>
                  <Text style={styles.flowMonitorSymptomCount}>{item.count} veces</Text>
                  <View style={styles.flowMonitorSymptomProgress}>
                    <View style={[
                      styles.flowMonitorSymptomProgressBar,
                      { 
                        width: `${item.percentage}%`,
                        backgroundColor: getSymptomColor(item.symptom)
                      }
                    ]} />
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Notas y observaciones */}
        <View style={styles.flowMonitorNotes}>
          <View style={styles.flowMonitorNotesHeader}>
            <Text style={styles.flowMonitorNotesTitle}>Notas y Observaciones</Text>
            <Icon name="document-text" size={20} color="#E91E63" />
          </View>
          
          <View style={styles.flowMonitorNotesContent}>
            <View style={styles.flowMonitorNoteItem}>
              <Text style={styles.flowMonitorNoteDate}>15 de Enero, 2024</Text>
              <Text style={styles.flowMonitorNoteText}>
                Período más intenso de lo normal. Cólicos muy fuertes el día 3 y 4.
              </Text>
            </View>
            <View style={styles.flowMonitorNoteItem}>
              <Text style={styles.flowMonitorNoteDate}>12 de Febrero, 2024</Text>
              <Text style={styles.flowMonitorNoteText}>
                Flujo regular, menos cólicos que el mes anterior. Mejoré mi dieta.
              </Text>
            </View>
            <View style={styles.flowMonitorNoteItem}>
              <Text style={styles.flowMonitorNoteDate}>10 de Marzo, 2024</Text>
              <Text style={styles.flowMonitorNoteText}>
                Ciclo más corto de lo esperado. Consultar con médico si continúa.
              </Text>
            </View>
          </View>
        </View>

        {/* Recomendaciones */}
        <View style={styles.flowMonitorRecommendations}>
          <View style={styles.flowMonitorRecommendationsHeader}>
            <Text style={styles.flowMonitorRecommendationsTitle}>Recomendaciones</Text>
            <Icon name="bulb" size={20} color="#E91E63" />
          </View>
          
          <View style={styles.flowMonitorRecommendationsList}>
            <View style={styles.flowMonitorRecommendationItem}>
              <Icon name="checkmark-circle" size={16} color="#4CAF50" />
              <Text style={styles.flowMonitorRecommendationText}>
                Mantén un registro diario para identificar patrones
              </Text>
            </View>
            <View style={styles.flowMonitorRecommendationItem}>
              <Icon name="checkmark-circle" size={16} color="#4CAF50" />
              <Text style={styles.flowMonitorRecommendationText}>
                Consulta con tu médico si notas cambios significativos
              </Text>
            </View>
            <View style={styles.flowMonitorRecommendationItem}>
              <Icon name="checkmark-circle" size={16} color="#4CAF50" />
              <Text style={styles.flowMonitorRecommendationText}>
                Lleva un diario de síntomas para mejor seguimiento
              </Text>
            </View>
            <View style={styles.flowMonitorRecommendationItem}>
              <Icon name="checkmark-circle" size={16} color="#4CAF50" />
              <Text style={styles.flowMonitorRecommendationText}>
                Considera cambios en tu dieta y ejercicio
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  };

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
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  // Estilos para la nueva UI de Registro de Período
  periodLogHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  periodLogHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  periodLogHeaderIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E91E63',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  periodLogHeaderText: {
    flex: 1,
  },
  periodLogHeaderTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 4,
  },
  periodLogHeaderSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  periodLogAddButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E91E63',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#E91E63',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  // Estadísticas del período
  periodLogStats: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  periodLogStatCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
  },
  periodLogStatIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  periodLogStatContent: {
    flex: 1,
  },
  periodLogStatNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 2,
  },
  periodLogStatLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },

  // Calendario del período
  periodLogCalendar: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginVertical: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  periodLogCalendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  periodLogCalendarTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  periodLogCalendarLegend: {
    flexDirection: 'row',
    gap: 12,
  },
  periodLogLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  periodLogLegendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  periodLogLegendText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  periodLogCalendarGrid: {
    gap: 8,
  },
  periodLogWeekDays: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  periodLogWeekDay: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    width: 40,
    textAlign: 'center',
  },
  periodLogDaysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  periodLogDay: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  periodLogDayMarked: {
    borderWidth: 2,
    borderColor: '#E91E63',
  },
  periodLogDayText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  periodLogDayTextMarked: {
    color: '#FFFFFF',
  },
  periodLogDayIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
  },

  // Registros recientes
  periodLogRecent: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  periodLogRecentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  periodLogRecentTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  periodLogViewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  periodLogViewAllText: {
    fontSize: 14,
    color: '#E91E63',
    fontWeight: '600',
  },
  periodLogRecentList: {
    gap: 12,
  },
  periodLogEntry: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#E91E63',
  },
  periodLogEntryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  periodLogEntryDate: {
    alignItems: 'center',
    marginRight: 16,
  },
  periodLogEntryDay: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  periodLogEntryMonth: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  periodLogEntryInfo: {
    flex: 1,
    gap: 4,
  },
  periodLogEntryFlow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  periodLogEntryFlowDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  periodLogEntryFlowText: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '600',
  },
  periodLogEntryMood: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  periodLogEntryMoodText: {
    fontSize: 12,
    color: '#6B7280',
  },
  periodLogEntryPain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  periodLogEntryPainText: {
    fontSize: 12,
    color: '#9C27B0',
    fontWeight: '600',
  },
  periodLogEntrySymptoms: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  periodLogEntrySymptom: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
  },
  periodLogEntrySymptomText: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '600',
  },
  periodLogEntryNotes: {
    fontSize: 12,
    color: '#4B5563',
    fontStyle: 'italic',
    marginTop: 8,
    lineHeight: 16,
  },

  // Notas generales
  periodLogNotes: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  periodLogNotesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  periodLogNotesTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  periodLogNotesInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    fontSize: 14,
    color: '#1F2937',
    lineHeight: 20,
    minHeight: 100,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  // Estilos para la nueva UI de Seguimiento de Período
  periodTrackerContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  periodTrackerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  periodTrackerHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  periodTrackerHeaderIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E91E63',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  periodTrackerHeaderText: {
    flex: 1,
  },
  periodTrackerHeaderTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 4,
  },
  periodTrackerHeaderSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  periodTrackerSettingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Estadísticas del seguimiento
  periodTrackerStats: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  periodTrackerStatCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
  },
  periodTrackerStatIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  periodTrackerStatContent: {
    flex: 1,
  },
  periodTrackerStatNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 2,
  },
  periodTrackerStatLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },

  // Calendario del seguimiento
  periodTrackerCalendar: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginVertical: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  periodTrackerCalendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  periodTrackerCalendarTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  periodTrackerCalendarLegend: {
    flexDirection: 'row',
    gap: 12,
  },
  periodTrackerLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  periodTrackerLegendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  periodTrackerLegendText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  periodTrackerCalendarGrid: {
    gap: 8,
  },
  periodTrackerWeekDays: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  periodTrackerWeekDay: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    width: 40,
    textAlign: 'center',
  },
  periodTrackerDaysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  periodTrackerDay: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    position: 'relative',
  },
  periodTrackerDayMarked: {
    borderWidth: 2,
    borderColor: '#E91E63',
  },
  periodTrackerDayText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  periodTrackerDayTextMarked: {
    color: '#FFFFFF',
  },
  periodTrackerDayIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
  },
  periodTrackerDaySymptom: {
    position: 'absolute',
    top: 2,
    left: 2,
  },
  periodTrackerEmptyDay: {
    width: 40,
    height: 40,
    margin: 2,
  },

  // Análisis de tendencias
  periodTrackerTrends: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  periodTrackerTrendsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  periodTrackerTrendsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  periodTrackerTrendsGrid: {
    gap: 12,
  },
  periodTrackerTrendCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
  },
  periodTrackerTrendIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  periodTrackerTrendContent: {
    flex: 1,
  },
  periodTrackerTrendTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  periodTrackerTrendDescription: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  periodTrackerTrendProgress: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
  },
  periodTrackerTrendProgressBar: {
    height: '100%',
    backgroundColor: '#E91E63',
    borderRadius: 2,
  },

  // Síntomas más comunes
  periodTrackerSymptoms: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  periodTrackerSymptomsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  periodTrackerSymptomsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  periodTrackerSymptomsList: {
    gap: 12,
  },
  periodTrackerSymptomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
  },
  periodTrackerSymptomInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  periodTrackerSymptomName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
  },
  periodTrackerSymptomStats: {
    alignItems: 'flex-end',
  },
  periodTrackerSymptomCount: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  periodTrackerSymptomProgress: {
    width: 80,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
  },
  periodTrackerSymptomProgressBar: {
    height: '100%',
    backgroundColor: '#E91E63',
    borderRadius: 2,
  },

  // Recomendaciones
  periodTrackerRecommendations: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  periodTrackerRecommendationsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  periodTrackerRecommendationsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  periodTrackerRecommendationsList: {
    gap: 12,
  },
  periodTrackerRecommendationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
  },
  periodTrackerRecommendationText: {
    fontSize: 14,
    color: '#4B5563',
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },

  // Estilos para la nueva UI de Duración del Ciclo
  cycleDurationContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  cycleDurationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  cycleDurationHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cycleDurationHeaderIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E91E63',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cycleDurationHeaderText: {
    flex: 1,
  },
  cycleDurationHeaderTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 4,
  },
  cycleDurationHeaderSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  cycleDurationSettingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Estadísticas de duración del ciclo
  cycleDurationStats: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  cycleDurationStatCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
  },
  cycleDurationStatIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cycleDurationStatContent: {
    flex: 1,
  },
  cycleDurationStatNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 2,
  },
  cycleDurationStatLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },

  // Gráfico de duración del ciclo
  cycleDurationChart: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginVertical: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cycleDurationChartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cycleDurationChartTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  cycleDurationChartLegend: {
    flexDirection: 'row',
    gap: 12,
  },
  cycleDurationLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cycleDurationLegendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  cycleDurationLegendText: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '600',
  },
  cycleDurationChartGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 120,
  },
  cycleDurationChartItem: {
    alignItems: 'center',
    flex: 1,
  },
  cycleDurationChartBar: {
    width: 20,
    height: 80,
    backgroundColor: '#E5E7EB',
    borderRadius: 10,
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  cycleDurationChartBarFill: {
    width: '100%',
    borderRadius: 10,
  },
  cycleDurationChartMonth: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 2,
  },
  cycleDurationChartDays: {
    fontSize: 12,
    color: '#1F2937',
    fontWeight: '700',
  },

  // Análisis de regularidad
  cycleDurationAnalysis: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cycleDurationAnalysisHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cycleDurationAnalysisTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  cycleDurationAnalysisGrid: {
    gap: 12,
  },
  cycleDurationAnalysisCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
  },
  cycleDurationAnalysisIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cycleDurationAnalysisContent: {
    flex: 1,
  },
  cycleDurationAnalysisTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  cycleDurationAnalysisNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 2,
  },
  cycleDurationAnalysisLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  cycleDurationAnalysisProgress: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
  },
  cycleDurationAnalysisProgressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 2,
  },

  // Rango de duración
  cycleDurationRange: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cycleDurationRangeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cycleDurationRangeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  cycleDurationRangeContent: {
    gap: 12,
  },
  cycleDurationRangeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
  },
  cycleDurationRangeIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cycleDurationRangeInfo: {
    flex: 1,
  },
  cycleDurationRangeLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  cycleDurationRangeValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },

  // Recomendaciones de duración del ciclo
  cycleDurationRecommendations: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cycleDurationRecommendationsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cycleDurationRecommendationsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  cycleDurationRecommendationsList: {
    gap: 12,
  },
  cycleDurationRecommendationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
  },
  cycleDurationRecommendationText: {
    fontSize: 14,
    color: '#4B5563',
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },

  // Historial de duración del ciclo
  cycleDurationHistory: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cycleDurationHistoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cycleDurationHistoryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  cycleDurationHistoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cycleDurationHistoryButtonText: {
    fontSize: 14,
    color: '#E91E63',
    fontWeight: '600',
  },
  cycleDurationHistoryList: {
    gap: 8,
  },
  cycleDurationHistoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
  },
  cycleDurationHistoryInfo: {
    flex: 1,
  },
  cycleDurationHistoryMonth: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  cycleDurationHistoryDays: {
    fontSize: 14,
    color: '#6B7280',
  },
  cycleDurationHistoryStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cycleDurationHistoryLabel: {
    fontSize: 12,
    fontWeight: '600',
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

  // Estilos para Recordatorios de Ciclo
  cycleReminderContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  cycleReminderHeader: {
    backgroundColor: '#E91E63',
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cycleReminderHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cycleReminderHeaderIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  cycleReminderHeaderText: {
    flex: 1,
  },
  cycleReminderHeaderTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  cycleReminderHeaderSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  cycleReminderAddButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cycleReminderStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  cycleReminderStatCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cycleReminderStatIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  cycleReminderStatContent: {
    alignItems: 'center',
  },
  cycleReminderStatNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E91E63',
    marginBottom: 5,
  },
  cycleReminderStatLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  cycleReminderActive: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cycleReminderActiveHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  cycleReminderActiveTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  cycleReminderActiveList: {
    gap: 12,
  },
  cycleReminderActiveItem: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  cycleReminderActiveItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cycleReminderActiveItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cycleReminderActiveItemInfo: {
    flex: 1,
  },
  cycleReminderActiveItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  cycleReminderActiveItemDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  cycleReminderActiveItemStatus: {
    alignItems: 'center',
  },
  cycleReminderActiveItemStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  cycleReminderActiveItemStatusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  cycleReminderActiveItemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  cycleReminderActiveItemDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cycleReminderActiveItemDetailText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 6,
  },
  cycleReminderInactive: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cycleReminderInactiveHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  cycleReminderInactiveTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  cycleReminderInactiveList: {
    gap: 12,
  },
  cycleReminderInactiveItem: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
  },
  cycleReminderInactiveItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cycleReminderInactiveItemIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cycleReminderInactiveItemInfo: {
    flex: 1,
  },
  cycleReminderInactiveItemTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6B7280',
    marginBottom: 4,
  },
  cycleReminderInactiveItemDescription: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  cycleReminderInactiveItemButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cycleReminderTypes: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cycleReminderTypesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  cycleReminderTypesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  cycleReminderTypesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cycleReminderTypeCard: {
    width: '48%',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  cycleReminderTypeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  cycleReminderTypeLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  cycleReminderSettings: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cycleReminderSettingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  cycleReminderSettingsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  cycleReminderSettingsList: {
    gap: 15,
  },
  cycleReminderSettingsItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cycleReminderSettingsItemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cycleReminderSettingsItemLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 12,
  },
  cycleReminderSettingsToggle: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  cycleReminderSettingsToggleDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignSelf: 'flex-end',
  },
  cycleReminderTips: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cycleReminderTipsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  cycleReminderTipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  cycleReminderTipsList: {
    gap: 12,
  },
  cycleReminderTipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  cycleReminderTipText: {
    flex: 1,
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginLeft: 10,
  },

  // Estilos para Monitoreo del Flujo
  flowMonitorContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  flowMonitorHeader: {
    backgroundColor: '#E91E63',
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flowMonitorHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  flowMonitorHeaderIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  flowMonitorHeaderText: {
    flex: 1,
  },
  flowMonitorHeaderTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  flowMonitorHeaderSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  flowMonitorSettingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flowMonitorStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  flowMonitorStatCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  flowMonitorStatIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  flowMonitorStatContent: {
    alignItems: 'center',
  },
  flowMonitorStatNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E91E63',
    marginBottom: 5,
  },
  flowMonitorStatLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  flowMonitorAnalysis: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  flowMonitorAnalysisHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  flowMonitorAnalysisTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  flowMonitorAnalysisContent: {
    gap: 15,
  },
  flowMonitorAnalysisItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  flowMonitorAnalysisItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  flowMonitorAnalysisDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  flowMonitorAnalysisLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
  flowMonitorAnalysisBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginHorizontal: 15,
  },
  flowMonitorAnalysisBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  flowMonitorAnalysisValue: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: 'bold',
    minWidth: 50,
    textAlign: 'right',
  },
  flowMonitorCalendar: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  flowMonitorCalendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  flowMonitorCalendarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  flowMonitorCalendarLegend: {
    flexDirection: 'row',
    gap: 15,
  },
  flowMonitorLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flowMonitorLegendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  flowMonitorLegendText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  flowMonitorCalendarContent: {
    gap: 20,
  },
  flowMonitorMonthCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 15,
  },
  flowMonitorMonthTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 15,
    textAlign: 'center',
  },
  flowMonitorDaysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  flowMonitorDayCard: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  flowMonitorDayNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  flowMonitorDayIntensity: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 4,
  },
  flowMonitorDaySymptoms: {
    flexDirection: 'row',
    gap: 2,
  },
  flowMonitorSymptoms: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  flowMonitorSymptomsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  flowMonitorSymptomsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  flowMonitorSymptomsList: {
    gap: 12,
  },
  flowMonitorSymptomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 15,
  },
  flowMonitorSymptomInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  flowMonitorSymptomIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  flowMonitorSymptomLabel: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '600',
  },
  flowMonitorSymptomStats: {
    alignItems: 'flex-end',
  },
  flowMonitorSymptomCount: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  flowMonitorSymptomProgress: {
    width: 80,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
  },
  flowMonitorSymptomProgressBar: {
    height: '100%',
    borderRadius: 2,
  },
  flowMonitorNotes: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  flowMonitorNotesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  flowMonitorNotesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  flowMonitorNotesContent: {
    gap: 12,
  },
  flowMonitorNoteItem: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#E91E63',
  },
  flowMonitorNoteDate: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 6,
  },
  flowMonitorNoteText: {
    fontSize: 14,
    color: '#1F2937',
    lineHeight: 20,
  },
  flowMonitorRecommendations: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  flowMonitorRecommendationsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  flowMonitorRecommendationsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  flowMonitorRecommendationsList: {
    gap: 12,
  },
  flowMonitorRecommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  flowMonitorRecommendationText: {
    flex: 1,
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginLeft: 10,
  },
});

export default MenstrualSections;
