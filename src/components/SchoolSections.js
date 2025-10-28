import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ElegantSubsectionTabs } from './shared';

const SchoolSections = ({ onUpdateSection, user }) => {
  // Estados para las diferentes secciones
  const [activeSection, setActiveSection] = useState('timetable');
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalType, setModalType] = useState('');
  
  // Estados para el horario semanal
  const [timetable, setTimetable] = useState({});
  const [selectedDayIndex, setSelectedDayIndex] = useState(0); // 0 = Lunes, 1 = Martes, etc.
  const [selectedHourIndex, setSelectedHourIndex] = useState(0); // 0 = 7:00 AM, 1 = 8:00 AM, etc.
  
  // Estados para agregar clase
  const [newClass, setNewClass] = useState({
    subject: '',
    time: '',
    day: '',
    classroom: '',
    professor: '',
    duration: '60'
  });
  
  // Estados para tareas académicas
  const [academicTasks, setAcademicTasks] = useState([
    {
      id: 1,
      task: 'Entregar ensayo de literatura',
      date: '2024-01-15',
      notes: 'Mínimo 5 páginas, tema libre',
      completed: false,
      priority: 'high',
      subject: 'Literatura',
      estimatedTime: '3 horas'
    },
    {
      id: 2,
      task: 'Proyecto de matemáticas',
      date: '2024-01-20',
      notes: 'Resolver 20 problemas de cálculo',
      completed: true,
      priority: 'medium',
      subject: 'Matemáticas',
      estimatedTime: '2 horas'
    },
    {
      id: 3,
      task: 'Presentación de historia',
      date: '2024-01-18',
      notes: 'Exponer sobre la Revolución Francesa',
      completed: false,
      priority: 'high',
      subject: 'Historia',
      estimatedTime: '1 hora'
    }
  ]);

  // Estados para el modal de tareas
  const [newTask, setNewTask] = useState({
    task: '',
    date: '',
    notes: '',
    priority: 'medium',
    subject: '',
    estimatedTime: '1 hora'
  });
  
  // Estados para las listas de tareas
  const [todoLists, setTodoLists] = useState({
    academic: [],
    personal: []
  });
  
  // Estados para proyectos grupales
  const [groupProjects, setGroupProjects] = useState([]);
  
  // Estados para el tracker de referencias
  const [references, setReferences] = useState([]);
  
  // Estados para exam revision
  const [examRevisions, setExamRevisions] = useState([]);
  
  // Estados para course materials
  const [textbooks, setTextbooks] = useState([]);
  const [onlineResources, setOnlineResources] = useState([]);
  
  // Estados para class overview
  const [classOverview, setClassOverview] = useState({
    course: '',
    time: '',
    location: '',
    instructor: '',
    contactInfo: '',
    officeHours: '',
    accessInfo: '',
    account: '',
    login: '',
    password: '',
    importantDates: [],
    notes: '',
    gradingComponents: [],
    targetGrade: '',
    actualGrade: ''
  });

  const sections = [
    { id: 'timetable', name: 'Horario Semanal', icon: 'calendar-outline' },
    { id: 'todo', name: 'Listas de Tareas', icon: 'list-outline' },
    { id: 'projects', name: 'Proyectos Grupales', icon: 'people-outline' },
    { id: 'exams', name: 'Revisión de Exámenes', icon: 'school-outline' },
    { id: 'materials', name: 'Materiales del Curso', icon: 'folder-outline' },
    { id: 'class', name: 'Resumen de Clase', icon: 'document-text-outline' }
  ];

  const timeSlots = [
    '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM',
    '7:00 PM', '8:00 PM', '9:00 PM'
  ];

  const weekDays = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'];
  
  // Funciones para manejar clases
  const handleAddClass = () => {
    if (newClass.subject && newClass.time && newClass.day) {
      const classKey = `${newClass.day}-${newClass.time}`;
      setTimetable(prev => ({
        ...prev,
        [classKey]: newClass.subject
      }));
      
      // Limpiar formulario
      setNewClass({
        subject: '',
        time: '',
        day: '',
        classroom: '',
        professor: '',
        duration: '60'
      });
      
      setShowAddModal(false);
      setModalType('');
    } else {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios');
    }
  };
  
  const closeModal = () => {
    setShowAddModal(false);
    setModalType('');
    setNewClass({
      subject: '',
      time: '',
      day: '',
      classroom: '',
      professor: '',
      duration: '60'
    });
    setNewTask({
      task: '', date: '', notes: '', priority: 'medium', subject: '', estimatedTime: '1 hora'
    });
  };

  // Función para agregar nueva tarea académica
  const handleAddTask = () => {
    if (newTask.task && newTask.date) {
      const newTaskData = {
        id: Date.now(),
        task: newTask.task,
        date: newTask.date,
        notes: newTask.notes,
        priority: newTask.priority,
        subject: newTask.subject,
        estimatedTime: newTask.estimatedTime,
        completed: false
      };
      
      setAcademicTasks(prev => [...prev, newTaskData]);
      setNewTask({
        task: '', date: '', notes: '', priority: 'medium', subject: '', estimatedTime: '1 hora'
      });
      setShowAddModal(false);
      setModalType('');
    } else {
      Alert.alert('Error', 'Por favor completa los campos obligatorios (Tarea y Fecha)');
    }
  };
  
  // Funciones para navegar entre días
  const goToPreviousDay = () => {
    setSelectedDayIndex(prev => prev > 0 ? prev - 1 : 6); // Si es 0 (Lunes), va a 6 (Domingo)
  };
  
  const goToNextDay = () => {
    setSelectedDayIndex(prev => prev < 6 ? prev + 1 : 0); // Si es 6 (Domingo), va a 0 (Lunes)
  };
  
  const goToToday = () => {
    const today = new Date();
    const dayIndex = today.getDay(); // 0 = Domingo, 1 = Lunes, etc.
    const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1; // Ajustar para que Lunes sea 0
    setSelectedDayIndex(adjustedIndex);
  };
  
  // Funciones para navegar entre horas
  const goToPreviousHour = () => {
    setSelectedHourIndex(prev => prev > 0 ? prev - 1 : 0); // No puede ir antes de 7:00 AM
  };
  
  const goToNextHour = () => {
    setSelectedHourIndex(prev => prev < timeSlots.length - 1 ? prev + 1 : timeSlots.length - 1); // No puede ir después de 10:00 PM
  };
  
  // Función auxiliar para convertir tiempo a formato 24 horas
  const convertTo24Hour = (timeStr) => {
    const [timePart, period] = timeStr.split(' ');
    const [hours, minutes] = timePart.split(':');
    let hour24 = parseInt(hours);
    
    if (period === 'PM' && hour24 !== 12) {
      hour24 += 12;
    } else if (period === 'AM' && hour24 === 12) {
      hour24 = 0;
    }
    return hour24;
  };

  const goToCurrentHour = () => {
    const currentHour = new Date().getHours();
    const currentIndex = timeSlots.findIndex(slot => {
      const slotHour = convertTo24Hour(slot);
      return slotHour === currentHour;
    });
    if (currentIndex !== -1) {
      setSelectedHourIndex(currentIndex);
    }
  };

  // Función para guardar datos en Supabase
  const saveSchoolData = async (sectionData) => {
    if (onUpdateSection) {
      try {
        await onUpdateSection('school', sectionData);
      } catch (error) {
        console.error('Error saving school data:', error);
      }
    }
  };

  const renderTimetable = () => {
    // Usar el día seleccionado en lugar del día actual
    const currentDay = weekDays[selectedDayIndex];
    
    // Mapear abreviaciones a nombres completos
    const dayNames = {
      'LUN': 'Lunes',
      'MAR': 'Martes', 
      'MIÉ': 'Miércoles',
      'JUE': 'Jueves',
      'VIE': 'Viernes',
      'SÁB': 'Sábado',
      'DOM': 'Domingo'
    };

    // Obtener información del día actual
    const today = new Date();
    const currentDate = today.toLocaleDateString('es-ES', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.headerDecoration}>
            <Image 
              source={require('../../android/app/src/main/assets/escuela.png')}
              style={styles.mascotImage}
              resizeMode="contain"
            />
          </View>
          <View style={styles.headerContent}>
            <Text style={styles.sectionTitle}>Horario de {dayNames[currentDay]}</Text>
            <Text style={styles.sectionSubtitle}>
              {currentDate}
            </Text>
          </View>
        </View>
        
        {/* Navegación del calendario */}
        <View style={styles.calendarNavigation}>
          <TouchableOpacity 
            onPress={goToPreviousDay}
            style={styles.navButton}
          >
            <Icon name="chevron-back" size={20} color="#1E3A8A" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={goToToday}
            style={styles.todayButton}
          >
            <Icon name="today" size={16} color="#FFFFFF" />
            <Text style={styles.todayButtonText}>Hoy</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={goToNextDay}
            style={styles.navButton}
          >
            <Icon name="chevron-forward" size={20} color="#1E3A8A" />
          </TouchableOpacity>
        </View>
        
        {/* Navegación de horas */}
        <View style={styles.hourNavigation}>
          <TouchableOpacity 
            onPress={goToPreviousHour}
            style={styles.hourNavButton}
          >
            <Icon name="chevron-up" size={18} color="#1E3A8A" />
          </TouchableOpacity>
          
          <View style={styles.hourDisplay}>
            <Text style={styles.hourDisplayText}>
              {timeSlots[selectedHourIndex] || '7:00 AM'}
            </Text>
          </View>
          
          <TouchableOpacity 
            onPress={goToNextHour}
            style={styles.hourNavButton}
          >
            <Icon name="chevron-down" size={18} color="#1E3A8A" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={goToCurrentHour}
            style={styles.currentHourButton}
          >
            <Icon name="time" size={16} color="#FFFFFF" />
            <Text style={styles.currentHourButtonText}>Ahora</Text>
          </TouchableOpacity>
        </View>
        
        {/* Botón flotante para agregar clase */}
        <View style={styles.floatingAddButton}>
          <TouchableOpacity 
            onPress={() => {
            setModalType('timetable');
            setShowAddModal(true);
            }} 
            style={styles.floatingButton}
          >
            <Icon name="add" size={20} color="#FFFFFF" />
            <Text style={styles.floatingButtonText}>Agregar Clase</Text>
          </TouchableOpacity>
        </View>
        
        {/* Resumen del día */}
        <View style={styles.daySummary}>
          <View style={styles.summaryCard}>
            <View style={styles.summaryIcon}>
              <Icon name="school" size={20} color="#1E3A8A" />
            </View>
            <View style={styles.summaryContent}>
              <Text style={styles.summaryTitle}>Clases Programadas</Text>
              <Text style={styles.summaryValue}>
                {Object.values(timetable).filter(value => value).length} clases
              </Text>
            </View>
          </View>
          
          <View style={styles.summaryCard}>
            <View style={styles.summaryIcon}>
              <Icon name="time" size={20} color="#1E3A8A" />
            </View>
            <View style={styles.summaryContent}>
              <Text style={styles.summaryTitle}>Horas Libres</Text>
              <Text style={styles.summaryValue}>
                {timeSlots.length - Object.values(timetable).filter(value => value).length} horas
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.timetableContainer}>
          <View style={styles.timetableHeader}>
            <View style={styles.timeColumn}>
              <Icon name="time" size={18} color="#FFFFFF" style={styles.headerIcon} />
              <Text style={styles.timeHeader}>Horario</Text>
            </View>
            <View style={styles.dayColumn}>
              <Icon name="calendar" size={18} color="#FFFFFF" style={styles.headerIcon} />
              <Text style={styles.dayHeader}>{dayNames[currentDay].toUpperCase()}</Text>
            </View>
          </View>
          
          <ScrollView style={styles.timetableBody} showsVerticalScrollIndicator={false}>
            {(() => {
              // Mostrar solo 3 horas: la anterior, la actual y la siguiente
              const startIndex = Math.max(0, selectedHourIndex - 1);
              const endIndex = Math.min(timeSlots.length - 1, selectedHourIndex + 1);
              const visibleSlots = timeSlots.slice(startIndex, endIndex + 1);
              
              return visibleSlots.map((time, index) => {
                const actualIndex = startIndex + index;
              const hasClass = timetable[`${currentDay}-${time}`];
              
              // Convertir timeSlots a formato de 24 horas para comparación
              const convertTo24Hour = (timeStr) => {
                const [timePart, period] = timeStr.split(' ');
                const [hours, minutes] = timePart.split(':');
                let hour24 = parseInt(hours);
                
                if (period === 'PM' && hour24 !== 12) {
                  hour24 += 12;
                } else if (period === 'AM' && hour24 === 12) {
                  hour24 = 0;
                }
                
                return hour24;
              };
              
              const currentHour = new Date().getHours();
              const slotHour = convertTo24Hour(time);
              const isCurrentTime = currentHour === slotHour;
              const isPastTime = currentHour > slotHour;
              const isSelectedTime = actualIndex === selectedHourIndex;
              
              return (
                <View key={time} style={[
                  styles.timetableRow,
                  hasClass && styles.timetableRowWithClass,
                  isCurrentTime && styles.timetableRowCurrent,
                  isPastTime && !hasClass && styles.timetableRowPast,
                  isSelectedTime && styles.timetableRowSelected
                ]}>
                  <View style={[
                    styles.timeCell,
                    hasClass && styles.timeCellWithClass,
                    isCurrentTime && styles.timeCellCurrent,
                    isSelectedTime && styles.timeCellSelected
                  ]}>
                    <View style={styles.timeIconContainer}>
                      <Icon 
                        name={isCurrentTime ? "radio-button-on" : (isSelectedTime ? "radio-button-on" : "time-outline")} 
                        size={14} 
                        color={hasClass ? '#FFFFFF' : (isCurrentTime ? '#FF6B35' : (isSelectedTime ? '#1E3A8A' : '#1E3A8A'))} 
                      />
                </View>
                    <Text style={[
                      styles.timeText,
                      hasClass && styles.timeTextWithClass,
                      isCurrentTime && styles.timeTextCurrent,
                      isSelectedTime && styles.timeTextSelected
                    ]}>{time}</Text>
                  </View>
                  
                  <View style={[
                    styles.scheduleCell,
                    hasClass && styles.scheduleCellWithClass
                  ]}>
                    {hasClass ? (
                      <View style={[
                        styles.classCard,
                        isCurrentTime && styles.classCardCurrent
                      ]}>
                        <View style={styles.classHeader}>
                          <View style={styles.classIconContainer}>
                            <Icon name="school" size={16} color="#FFFFFF" />
                          </View>
                          <View style={styles.classTitleContainer}>
                            <Text style={styles.classTitle}>{hasClass}</Text>
                            <View style={styles.classBadge}>
                              <Text style={styles.classBadgeText}>Activa</Text>
                            </View>
                          </View>
                        </View>
                        
                        <View style={styles.classDetails}>
                          <View style={styles.classDetailItem}>
                            <Icon name="location" size={14} color="#4A90E2" />
                            <Text style={styles.classDetailText}>Aula 101</Text>
                          </View>
                          <View style={styles.classDetailItem}>
                            <Icon name="person" size={14} color="#4A90E2" />
                            <Text style={styles.classDetailText}>Prof. García</Text>
                          </View>
                          <View style={styles.classDetailItem}>
                            <Icon name="book" size={14} color="#4A90E2" />
                            <Text style={styles.classDetailText}>Matemáticas</Text>
                          </View>
                        </View>
                        
                        <View style={styles.classActions}>
                          <TouchableOpacity style={styles.actionButton}>
                            <Icon name="videocam" size={14} color="#4A90E2" />
                            <Text style={styles.actionButtonText}>Unirse</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.actionButton}>
                            <Icon name="document-text" size={14} color="#4A90E2" />
                            <Text style={styles.actionButtonText}>Material</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ) : (
                      <View style={[
                        styles.emptySlot,
                        isCurrentTime && styles.emptySlotCurrent,
                        isPastTime && styles.emptySlotPast
                      ]}>
                        <View style={styles.emptySlotIcon}>
                          <Icon 
                            name={isCurrentTime ? "ellipse" : "ellipse-outline"} 
                            size={18} 
                            color={isCurrentTime ? '#FF6B35' : '#B0C4DE'} 
                          />
                        </View>
                        <View style={styles.emptySlotContent}>
                          <Text style={[
                            styles.emptySlotText,
                            isCurrentTime && styles.emptySlotTextCurrent
                          ]}>
                            {isCurrentTime ? 'Hora Actual' : 'Libre'}
                          </Text>
                          <Text style={styles.emptySlotSubtext}>
                            {isCurrentTime ? 'Tiempo de descanso' : 'Sin clases programadas'}
                  </Text>
                </View>
              </View>
                    )}
                  </View>
                </View>
              );
            });
          })()}
          </ScrollView>
        </View>
      </View>
    );
  };

  const renderTodoLists = () => (
    <View style={styles.section}>
      {/* Header mejorado */}
      <View style={styles.tasksHeader}>
        <View style={styles.tasksHeaderContent}>
          <View style={styles.tasksIconContainer}>
            <Icon name="checkmark-circle-outline" size={24} color="#FFFFFF" />
          </View>
          <View style={styles.tasksHeaderText}>
            <Text style={styles.tasksHeaderTitle}>
              Tareas Académicas
            </Text>
            <Text style={styles.tasksHeaderSubtitle}>
              Gestiona tus tareas y proyectos académicos
            </Text>
          </View>
        </View>
        <View style={styles.tasksHeaderBadge}>
          <Icon name="school-outline" size={16} color="#1E3A8A" />
        </View>
      </View>
      
      {/* Resumen de tareas mejorado */}
      <View style={styles.tasksSummary}>
        <View style={styles.summaryCard}>
          <View style={styles.summaryIconContainer}>
            <Icon name="list-outline" size={20} color="#3B82F6" />
          </View>
          <View style={styles.summaryContent}>
            <Text style={styles.summaryValue}>{academicTasks.length}</Text>
            <Text style={styles.summaryLabel}>Total</Text>
          </View>
        </View>
        <View style={styles.summaryCard}>
          <View style={styles.summaryIconContainer}>
            <Icon name="checkmark-circle-outline" size={20} color="#10B981" />
          </View>
          <View style={styles.summaryContent}>
            <Text style={styles.summaryValue}>
              {academicTasks.filter(todo => todo.completed).length}
            </Text>
            <Text style={styles.summaryLabel}>Completadas</Text>
          </View>
        </View>
        <View style={styles.summaryCard}>
          <View style={styles.summaryIconContainer}>
            <Icon name="time-outline" size={20} color="#F59E0B" />
          </View>
          <View style={styles.summaryContent}>
            <Text style={styles.summaryValue}>
              {academicTasks.filter(todo => !todo.completed).length}
            </Text>
            <Text style={styles.summaryLabel}>Pendientes</Text>
          </View>
        </View>
        <View style={styles.summaryCard}>
          <View style={styles.summaryIconContainer}>
            <Icon name="alert-circle-outline" size={20} color="#EF4444" />
          </View>
          <View style={styles.summaryContent}>
            <Text style={styles.summaryValue}>
              {academicTasks.filter(todo => {
                const dueDate = new Date(todo.date);
                const today = new Date();
                return dueDate < today && !todo.completed;
              }).length}
            </Text>
            <Text style={styles.summaryLabel}>Urgentes</Text>
          </View>
        </View>
      </View>
      
      {/* Botón para agregar tarea */}
      <View style={styles.addTaskContainer}>
        <TouchableOpacity 
          style={styles.addTaskButton}
          onPress={() => {
            setModalType('todo');
            setShowAddModal(true);
          }}
        >
          <Icon name="add-circle-outline" size={20} color="#FFFFFF" />
          <Text style={styles.addTaskText}>Nueva Tarea Académica</Text>
        </TouchableOpacity>
      </View>
      
      {/* Lista de tareas mejorada */}
      <View style={styles.tasksContainer}>
        <View style={styles.tasksHeader}>
          <Text style={styles.tasksTitle}>Mis Tareas</Text>
          <TouchableOpacity style={styles.filterButton}>
            <Icon name="filter-outline" size={16} color="#1E3A8A" />
            <Text style={styles.filterText}>Filtrar</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.tasksBody} showsVerticalScrollIndicator={false}>
        {academicTasks.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="document-outline" size={48} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>No hay tareas académicas</Text>
            <Text style={styles.emptySubtitle}>Agrega tu primera tarea para comenzar a organizarte</Text>
            <TouchableOpacity 
              style={styles.emptyButton}
              onPress={() => {
                setModalType('todo');
                setShowAddModal(true);
              }}
            >
              <Icon name="add-outline" size={20} color="#1E3A8A" />
              <Text style={styles.emptyButtonText}>Crear Primera Tarea</Text>
            </TouchableOpacity>
          </View>
        ) : (
          academicTasks.map((todo, index) => {
            const dueDate = new Date(todo.date);
            const today = new Date();
            const isOverdue = dueDate < today && !todo.completed;
            const isDueToday = dueDate.toDateString() === today.toDateString();
            
            return (
              <View key={todo.id} style={styles.taskItem}>
                <View style={styles.taskItemHeader}>
                  <View style={styles.taskItemInfo}>
                    <TouchableOpacity
                      onPress={() => {
                        const updatedTasks = academicTasks.map(task => 
                          task.id === todo.id 
                            ? { ...task, completed: !task.completed }
                            : task
                        );
                        setAcademicTasks(updatedTasks);
                      }}
                      style={[
                        styles.taskCheckbox,
                        todo.completed && styles.taskCheckboxCompleted
                      ]}
                    >
                      {todo.completed && <Icon name="checkmark" size={16} color="#FFFFFF" />}
                    </TouchableOpacity>
                    
                    <View style={styles.taskContent}>
                      <Text style={[
                        styles.taskTitle,
                        todo.completed && styles.taskTitleCompleted
                      ]}>
                        {todo.task}
                      </Text>
                      
                      <View style={styles.taskMeta}>
                        <View style={styles.taskMetaItem}>
                          <Icon name="book-outline" size={14} color="#6B7280" />
                          <Text style={styles.taskMetaText}>{todo.subject}</Text>
                        </View>
                        <View style={styles.taskMetaItem}>
                          <Icon name="calendar-outline" size={14} color="#6B7280" />
                          <Text style={[
                            styles.taskMetaText,
                            isOverdue && styles.taskMetaTextOverdue
                          ]}>
                            {todo.date}
                          </Text>
                        </View>
                        <View style={styles.taskMetaItem}>
                          <Icon name="time-outline" size={14} color="#6B7280" />
                          <Text style={styles.taskMetaText}>{todo.estimatedTime}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  
                  <View style={styles.taskItemActions}>
                    <TouchableOpacity
                      onPress={() => {
                        Alert.alert(
                          'Eliminar Tarea',
                          '¿Estás seguro de que quieres eliminar esta tarea?',
                          [
                            { text: 'Cancelar', style: 'cancel' },
                            { 
                              text: 'Eliminar', 
                              style: 'destructive',
                              onPress: () => {
                                setAcademicTasks(prev => prev.filter(task => task.id !== todo.id));
                              }
                            }
                          ]
                        );
                      }}
                      style={styles.taskActionButton}
                    >
                      <Icon name="trash-outline" size={16} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
                
                {/* Información adicional */}
                <View style={styles.taskItemDetails}>
                  <View style={styles.taskPriority}>
                    <View style={[
                      styles.priorityIndicator,
                      { backgroundColor: todo.priority === 'high' ? '#EF4444' : 
                                        todo.priority === 'medium' ? '#F59E0B' : '#10B981' }
                    ]} />
                    <Text style={[
                      styles.priorityText,
                      { color: todo.priority === 'high' ? '#EF4444' : 
                               todo.priority === 'medium' ? '#F59E0B' : '#10B981' }
                    ]}>
                      {todo.priority === 'high' ? 'Alta' : 
                       todo.priority === 'medium' ? 'Media' : 'Baja'}
                    </Text>
                  </View>
                  
                  <View style={styles.taskTime}>
                    <Icon name="time-outline" size={12} color="#6B7280" />
                    <Text style={styles.taskTimeText}>{todo.estimatedTime}</Text>
                  </View>
                </View>
                
                {/* Notas */}
                {todo.notes && (
                  <View style={styles.taskNotes}>
                    <Text style={styles.taskNotesText}>{todo.notes}</Text>
                  </View>
                )}
                
                {/* Estado */}
                <View style={styles.taskStatus}>
                  <View style={[
                    styles.statusIndicator,
                    todo.completed ? styles.statusCompleted : 
                    isOverdue ? styles.statusOverdue : styles.statusPending
                  ]} />
                  <Text style={[
                    styles.statusText,
                    todo.completed ? styles.statusCompletedText : 
                    isOverdue ? styles.statusOverdueText : styles.statusPendingText
                  ]}>
                    {todo.completed ? 'Completada' : 
                     isOverdue ? 'Vencida' : 'Pendiente'}
                  </Text>
                </View>
              </View>
            );
          })
        )}
      </View>
    </View>
  );

  const renderGroupProjects = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.headerDecoration}>
          <Image 
            source={require('../../android/app/src/main/assets/escuela.png')}
            style={styles.mascotImage}
            resizeMode="contain"
          />
        </View>
        <View style={styles.headerContent}>
          <Text style={styles.sectionTitle}>Planificador de Proyectos</Text>
          <Text style={styles.sectionSubtitle}>
            Gestiona proyectos grupales y colaborativos
          </Text>
        </View>
        <TouchableOpacity onPress={() => {
          setModalType('project');
          setShowAddModal(true);
        }} style={styles.addProjectButton}>
          <Icon name="add-circle" size={20} color="#FFFFFF" />
          <Text style={styles.addProjectButtonText}>Nuevo Proyecto</Text>
        </TouchableOpacity>
      </View>
      
      {/* Resumen de proyectos */}
      <View style={styles.projectsSummary}>
        <View style={styles.projectSummaryCard}>
          <View style={styles.projectSummaryIcon}>
            <Icon name="folder" size={20} color="#1E3A8A" />
          </View>
          <View style={styles.projectSummaryContent}>
            <Text style={styles.projectSummaryTitle}>Proyectos Activos</Text>
            <Text style={styles.projectSummaryValue}>{groupProjects.length}</Text>
          </View>
        </View>
        
        <View style={styles.projectSummaryCard}>
          <View style={styles.projectSummaryIcon}>
            <Icon name="people" size={20} color="#10B981" />
          </View>
          <View style={styles.projectSummaryContent}>
            <Text style={styles.projectSummaryTitle}>Colaboradores</Text>
            <Text style={styles.projectSummaryValue}>12</Text>
          </View>
        </View>
        
        <View style={styles.projectSummaryCard}>
          <View style={styles.projectSummaryIcon}>
            <Icon name="checkmark-circle" size={20} color="#F59E0B" />
          </View>
          <View style={styles.projectSummaryContent}>
            <Text style={styles.projectSummaryTitle}>Tareas Completadas</Text>
            <Text style={styles.projectSummaryValue}>45</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.projectsContainer}>
        {groupProjects.length === 0 ? (
          <View style={styles.emptyProjectsState}>
            <Icon name="folder-open" size={48} color="#9CA3AF" />
            <Text style={styles.emptyProjectsTitle}>No hay proyectos</Text>
            <Text style={styles.emptyProjectsSubtitle}>
              Crea tu primer proyecto escolar
            </Text>
          </View>
        ) : (
          groupProjects.map((project, index) => (
            <View key={index} style={styles.enhancedProjectCard}>
              <View style={styles.projectCardHeader}>
                <View style={styles.projectCardTitleContainer}>
                  <View style={styles.projectCardIcon}>
                    <Icon name="folder" size={24} color="#1E3A8A" />
                  </View>
                  <View style={styles.projectCardTitleContent}>
                    <Text style={styles.enhancedProjectTitle}>{project.title}</Text>
                    <View style={styles.projectCardMeta}>
                      <Icon name="calendar" size={14} color="#6B7280" />
                      <Text style={styles.enhancedProjectDates}>
              {project.startDate} - {project.endDate}
            </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.projectCardActions}>
                  <TouchableOpacity style={styles.projectActionButton}>
                    <Icon name="ellipsis-vertical" size={16} color="#6B7280" />
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.projectCardContent}>
                <Text style={styles.enhancedProjectObjective}>{project.objective}</Text>
                
                <View style={styles.projectCardSections}>
                  <View style={styles.projectCardSection}>
                    <View style={styles.projectSectionHeader}>
                      <Icon name="library" size={16} color="#1E3A8A" />
                      <Text style={styles.projectSectionTitle}>Recursos</Text>
                    </View>
                    <Text style={styles.projectSectionContent}>{project.resources}</Text>
                  </View>
                  
                  <View style={styles.projectCardSection}>
                    <View style={styles.projectSectionHeader}>
                      <Icon name="bulb" size={16} color="#F59E0B" />
                      <Text style={styles.projectSectionTitle}>Ideas</Text>
                    </View>
                    <Text style={styles.projectSectionContent}>{project.ideas}</Text>
                  </View>
                </View>
                
                <View style={styles.projectCardSection}>
                  <View style={styles.projectSectionHeader}>
                    <Icon name="list" size={16} color="#10B981" />
                    <Text style={styles.projectSectionTitle}>Pasos de Acción</Text>
                  </View>
                  <View style={styles.enhancedActionSteps}>
              {project.actionSteps.map((step, stepIndex) => (
                      <TouchableOpacity key={stepIndex} style={styles.enhancedActionStep}>
                        <View style={styles.actionStepContent}>
                  <Icon 
                            name={step.completed ? "checkmark-circle" : "ellipse-outline"} 
                            size={20} 
                            color={step.completed ? "#10B981" : "#6B7280"} 
                          />
                          <Text style={[
                            styles.enhancedActionStepText, 
                            step.completed && styles.enhancedActionStepCompleted
                          ]}>
                    {step.text}
                  </Text>
                </View>
                        {step.completed && (
                          <View style={styles.completedBadge}>
                            <Text style={styles.completedBadgeText}>✓</Text>
                          </View>
                        )}
                      </TouchableOpacity>
              ))}
            </View>
          </View>
              </View>
            </View>
          ))
        )}
      </View>
    </View>
  );




  const renderExamRevision = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.headerDecoration}>
          <Image 
            source={require('../../android/app/src/main/assets/escuela.png')}
            style={styles.mascotImage}
            resizeMode="contain"
          />
        </View>
        <View style={styles.headerContent}>
          <Text style={styles.sectionTitle}>Exámenes</Text>
          <Text style={styles.sectionSubtitle}>
            Planifica y prepara tus exámenes
          </Text>
        </View>
        <TouchableOpacity onPress={() => {
          setModalType('exam');
          setShowAddModal(true);
        }} style={styles.addExamButton}>
          <Icon name="add-circle" size={20} color="#FFFFFF" />
          <Text style={styles.addExamButtonText}>Nuevo Examen</Text>
        </TouchableOpacity>
      </View>
      
      {/* Resumen de exámenes */}
      <View style={styles.examSummary}>
        <View style={styles.examSummaryCard}>
          <View style={styles.examSummaryIcon}>
            <Icon name="school" size={20} color="#1E3A8A" />
          </View>
          <View style={styles.examSummaryContent}>
            <Text style={styles.examSummaryTitle}>Exámenes Programados</Text>
            <Text style={styles.examSummaryValue}>{examRevisions.length}</Text>
          </View>
        </View>
        
        <View style={styles.examSummaryCard}>
          <View style={styles.examSummaryIcon}>
            <Icon name="time" size={20} color="#F59E0B" />
          </View>
          <View style={styles.examSummaryContent}>
            <Text style={styles.examSummaryTitle}>Próximos</Text>
            <Text style={styles.examSummaryValue}>3</Text>
          </View>
        </View>
        
        <View style={styles.examSummaryCard}>
          <View style={styles.examSummaryIcon}>
            <Icon name="checkmark-circle" size={20} color="#10B981" />
          </View>
          <View style={styles.examSummaryContent}>
            <Text style={styles.examSummaryTitle}>Preparados</Text>
            <Text style={styles.examSummaryValue}>2</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.examContainer}>
        {examRevisions.length === 0 ? (
          <View style={styles.emptyExamState}>
            <Icon name="school-outline" size={48} color="#9CA3AF" />
            <Text style={styles.emptyExamTitle}>No hay exámenes</Text>
            <Text style={styles.emptyExamSubtitle}>
              Agrega tu primer examen para planificar
            </Text>
          </View>
        ) : (
          examRevisions.map((exam, index) => (
            <View key={index} style={styles.enhancedExamCard}>
              <View style={styles.examCardHeader}>
                <View style={styles.examCardTitleContainer}>
                  <View style={styles.examCardIcon}>
                    <Icon name="school" size={24} color="#1E3A8A" />
                  </View>
                  <View style={styles.examCardTitleContent}>
                    <Text style={styles.enhancedExamTopic}>{exam.topic}</Text>
                    <View style={styles.examCardMeta}>
                      <Icon name="calendar" size={14} color="#6B7280" />
                      <Text style={styles.enhancedExamDate}>{exam.date}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.examCardActions}>
                  <TouchableOpacity style={styles.examActionButton}>
                    <Icon name="ellipsis-vertical" size={16} color="#6B7280" />
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.examCardContent}>
                <View style={styles.examCardSection}>
                  <View style={styles.examSectionHeader}>
                    <Icon name="list" size={16} color="#10B981" />
                    <Text style={styles.examSectionTitle}>Tareas de Preparación</Text>
                  </View>
                  <View style={styles.enhancedExamTodos}>
              {exam.todos.map((todo, todoIndex) => (
                      <TouchableOpacity key={todoIndex} style={styles.enhancedExamTodo}>
                        <View style={styles.examTodoContent}>
                  <Icon 
                            name={todo.completed ? "checkmark-circle" : "ellipse-outline"} 
                            size={20} 
                            color={todo.completed ? "#10B981" : "#6B7280"} 
                          />
                          <Text style={[
                            styles.enhancedExamTodoText, 
                            todo.completed && styles.enhancedExamTodoCompleted
                          ]}>
                    {todo.text}
                  </Text>
                </View>
                        {todo.completed && (
                          <View style={styles.completedBadge}>
                            <Text style={styles.completedBadgeText}>✓</Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    ))}
            </View>
          </View>
                
                {exam.notes && (
                  <View style={styles.examCardSection}>
                    <View style={styles.examSectionHeader}>
                      <Icon name="document-text" size={16} color="#F59E0B" />
                      <Text style={styles.examSectionTitle}>Notas de Estudio</Text>
                    </View>
                    <Text style={styles.enhancedExamNotes}>{exam.notes}</Text>
                  </View>
                )}
              </View>
            </View>
          ))
        )}
      </View>
    </View>
  );

  const renderCourseMaterials = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.headerDecoration}>
          <Image 
            source={require('../../android/app/src/main/assets/escuela.png')}
            style={styles.mascotImage}
            resizeMode="contain"
          />
        </View>
        <View style={styles.headerContent}>
          <Text style={styles.sectionTitle}>Materiales del Curso</Text>
          <Text style={styles.sectionSubtitle}>
            Organiza libros, recursos y materiales
          </Text>
        </View>
        <TouchableOpacity onPress={() => {
          setModalType('materials');
          setShowAddModal(true);
        }} style={styles.addButton}>
          <Icon name="add" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      {/* Resumen de Materiales */}
      <View style={styles.materialsSummary}>
        <View style={styles.materialsSummaryCard}>
          <View style={styles.materialsSummaryIcon}>
            <Icon name="book" size={20} color="#1E3A8A" />
          </View>
          <View style={styles.materialsSummaryContent}>
            <Text style={styles.materialsSummaryTitle}>Libros de Texto</Text>
            <Text style={styles.materialsSummaryValue}>{textbooks.length}</Text>
          </View>
        </View>
        
        <View style={styles.materialsSummaryCard}>
          <View style={styles.materialsSummaryIcon}>
            <Icon name="globe" size={20} color="#10B981" />
          </View>
          <View style={styles.materialsSummaryContent}>
            <Text style={styles.materialsSummaryTitle}>Recursos Online</Text>
            <Text style={styles.materialsSummaryValue}>{onlineResources.length}</Text>
          </View>
        </View>
        
        <View style={styles.materialsSummaryCard}>
          <View style={styles.materialsSummaryIcon}>
            <Icon name="library" size={20} color="#F59E0B" />
          </View>
          <View style={styles.materialsSummaryContent}>
            <Text style={styles.materialsSummaryTitle}>Referencias</Text>
            <Text style={styles.materialsSummaryValue}>{references.length}</Text>
          </View>
        </View>
      </View>
      
      {/* Libros de Texto */}
        <View style={styles.materialsSection}>
        <View style={styles.materialsSectionHeader}>
          <View style={styles.materialsSectionTitleContainer}>
            <Icon name="book" size={18} color="#1E3A8A" />
            <Text style={styles.materialsSectionTitle}>Libros de Texto</Text>
            </View>
          <TouchableOpacity style={styles.addMaterialButton}>
            <Icon name="add-circle" size={20} color="#1E3A8A" />
            <Text style={styles.addMaterialButtonText}>Agregar</Text>
          </TouchableOpacity>
        </View>
        
        {textbooks.length === 0 ? (
          <View style={styles.emptyMaterialsState}>
            <Icon name="book-outline" size={48} color="#9CA3AF" />
            <Text style={styles.emptyMaterialsTitle}>No hay libros registrados</Text>
            <Text style={styles.emptyMaterialsSubtitle}>
              Agrega tus libros de texto para organizarlos
            </Text>
          </View>
        ) : (
          <View style={styles.materialsGrid}>
            {textbooks.map((book, index) => (
              <View key={index} style={styles.materialCard}>
                <View style={styles.materialCardHeader}>
                  <View style={styles.materialCardIcon}>
                    <Icon name="book" size={20} color="#1E3A8A" />
                  </View>
                  <View style={styles.materialCardActions}>
                    <TouchableOpacity style={styles.materialActionButton}>
                      <Icon name="create" size={16} color="#6B7280" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.materialActionButton}>
                      <Icon name="trash" size={16} color="#DC2626" />
                    </TouchableOpacity>
                  </View>
                </View>
                
                <View style={styles.materialCardContent}>
                  <Text style={styles.materialCardTitle}>{book.title}</Text>
                  <Text style={styles.materialCardAuthor}>por {book.author}</Text>
                  
                  <View style={styles.materialCardDetails}>
                    <View style={styles.materialDetailItem}>
                      <Icon name="library" size={14} color="#6B7280" />
                      <Text style={styles.materialDetailText}>{book.genre}</Text>
                    </View>
                    <View style={styles.materialDetailItem}>
                      <Icon name="cash" size={14} color="#6B7280" />
                      <Text style={styles.materialDetailText}>{book.price}</Text>
                    </View>
                  </View>
                  
                  {book.notes && (
                    <View style={styles.materialNotes}>
                      <Text style={styles.materialNotesText}>{book.notes}</Text>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}
        </View>
        
      {/* Recursos en Línea */}
        <View style={styles.materialsSection}>
        <View style={styles.materialsSectionHeader}>
          <View style={styles.materialsSectionTitleContainer}>
            <Icon name="globe" size={18} color="#10B981" />
            <Text style={styles.materialsSectionTitle}>Recursos en Línea</Text>
            </View>
          <TouchableOpacity style={styles.addMaterialButton}>
            <Icon name="add-circle" size={20} color="#10B981" />
            <Text style={styles.addMaterialButtonText}>Agregar</Text>
          </TouchableOpacity>
        </View>
        
        {onlineResources.length === 0 ? (
          <View style={styles.emptyMaterialsState}>
            <Icon name="globe-outline" size={48} color="#9CA3AF" />
            <Text style={styles.emptyMaterialsTitle}>No hay recursos online</Text>
            <Text style={styles.emptyMaterialsSubtitle}>
              Agrega sitios web y plataformas educativas
            </Text>
          </View>
        ) : (
          <View style={styles.materialsGrid}>
            {onlineResources.map((resource, index) => (
              <View key={index} style={styles.materialCard}>
                <View style={styles.materialCardHeader}>
                  <View style={styles.materialCardIcon}>
                    <Icon name="globe" size={20} color="#10B981" />
                  </View>
                  <View style={styles.materialCardActions}>
                    <TouchableOpacity style={styles.materialActionButton}>
                      <Icon name="create" size={16} color="#6B7280" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.materialActionButton}>
                      <Icon name="trash" size={16} color="#DC2626" />
                    </TouchableOpacity>
                  </View>
                </View>
                
                <View style={styles.materialCardContent}>
                  <Text style={styles.materialCardTitle}>{resource.website}</Text>
                  
                  <View style={styles.materialCardDetails}>
                    <View style={styles.materialDetailItem}>
                      <Icon name="person" size={14} color="#6B7280" />
                      <Text style={styles.materialDetailText}>{resource.login}</Text>
                    </View>
                    <View style={styles.materialDetailItem}>
                      <Icon name="key" size={14} color="#6B7280" />
                      <Text style={styles.materialDetailText}>••••••••</Text>
                    </View>
                    <View style={styles.materialDetailItem}>
                      <Icon name="cash" size={14} color="#6B7280" />
                      <Text style={styles.materialDetailText}>{resource.price}</Text>
                    </View>
                  </View>
                  
                  {resource.notes && (
                    <View style={styles.materialNotes}>
                      <Text style={styles.materialNotesText}>{resource.notes}</Text>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}
        </View>
        
      {/* Referencias */}
        <View style={styles.materialsSection}>
        <View style={styles.materialsSectionHeader}>
          <View style={styles.materialsSectionTitleContainer}>
            <Icon name="library" size={18} color="#F59E0B" />
            <Text style={styles.materialsSectionTitle}>Referencias</Text>
            </View>
          <TouchableOpacity style={styles.addMaterialButton}>
            <Icon name="add-circle" size={20} color="#F59E0B" />
            <Text style={styles.addMaterialButtonText}>Agregar</Text>
          </TouchableOpacity>
        </View>
        
        {references.length === 0 ? (
          <View style={styles.emptyMaterialsState}>
            <Icon name="library-outline" size={48} color="#9CA3AF" />
            <Text style={styles.emptyMaterialsTitle}>No hay referencias</Text>
            <Text style={styles.emptyMaterialsSubtitle}>
              Organiza tus citas y referencias bibliográficas
            </Text>
          </View>
        ) : (
          <View style={styles.materialsGrid}>
            {references.map((ref, index) => (
              <View key={index} style={styles.materialCard}>
                <View style={styles.materialCardHeader}>
                  <View style={styles.materialCardIcon}>
                    <Icon name="library" size={20} color="#F59E0B" />
              </View>
                  <View style={styles.materialCardActions}>
                    <TouchableOpacity style={styles.materialActionButton}>
                      <Icon name="create" size={16} color="#6B7280" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.materialActionButton}>
                      <Icon name="trash" size={16} color="#DC2626" />
                    </TouchableOpacity>
          </View>
        </View>
                
                <View style={styles.materialCardContent}>
                  <Text style={styles.materialCardTitle}>{ref.quote}</Text>
                  
                  <View style={styles.materialCardDetails}>
                    <View style={styles.materialDetailItem}>
                      <Icon name="book" size={14} color="#6B7280" />
                      <Text style={styles.materialDetailText}>{ref.book}</Text>
                    </View>
                    <View style={styles.materialDetailItem}>
                      <Icon name="person" size={14} color="#6B7280" />
                      <Text style={styles.materialDetailText}>{ref.author}</Text>
                    </View>
                    <View style={styles.materialDetailItem}>
                      <Icon name="document" size={14} color="#6B7280" />
                      <Text style={styles.materialDetailText}>Pág. {ref.page}</Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );

  const renderClassOverview = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.headerDecoration}>
          <Image 
            source={require('../../android/app/src/main/assets/escuela.png')}
            style={styles.mascotImage}
            resizeMode="contain"
          />
        </View>
        <View style={styles.headerContent}>
          <Text style={styles.sectionTitle}>Resúmenes de Clase</Text>
          <Text style={styles.sectionSubtitle}>
            Organiza y gestiona tus clases
          </Text>
        </View>
        <TouchableOpacity onPress={() => {
          setModalType('class');
          setShowAddModal(true);
        }} style={styles.addButton}>
          <Icon name="add" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      {/* Resumen de Clases */}
      <View style={styles.classSummary}>
        <View style={styles.classSummaryCard}>
          <View style={styles.classSummaryIcon}>
            <Icon name="school" size={20} color="#1E3A8A" />
          </View>
          <View style={styles.classSummaryContent}>
            <Text style={styles.classSummaryTitle}>Clases Activas</Text>
            <Text style={styles.classSummaryValue}>3</Text>
          </View>
        </View>
        
        <View style={styles.classSummaryCard}>
          <View style={styles.classSummaryIcon}>
            <Icon name="time" size={20} color="#F59E0B" />
          </View>
          <View style={styles.classSummaryContent}>
            <Text style={styles.classSummaryTitle}>Horas Semanales</Text>
            <Text style={styles.classSummaryValue}>15h</Text>
          </View>
        </View>
        
        <View style={styles.classSummaryCard}>
          <View style={styles.classSummaryIcon}>
            <Icon name="calendar" size={20} color="#10B981" />
          </View>
          <View style={styles.classSummaryContent}>
            <Text style={styles.classSummaryTitle}>Próxima Clase</Text>
            <Text style={styles.classSummaryValue}>Mañana</Text>
          </View>
        </View>
      </View>
      
      {/* Lista de Clases */}
      <View style={styles.classesContainer}>
        <Text style={styles.classesTitle}>Mis Clases</Text>
        
        {classOverview.course ? (
          <View style={styles.classesList}>
            {/* Clase Principal */}
            <View style={styles.classCard}>
              <View style={styles.classCardHeader}>
                <View style={styles.classCardIcon}>
                  <Icon name="book" size={20} color="#1E3A8A" />
                </View>
                <View style={styles.classCardContent}>
                  <Text style={styles.classCardTitle}>{classOverview.course}</Text>
                  <Text style={styles.classCardSubtitle}>Clase Principal</Text>
                </View>
                <View style={styles.classCardStatus}>
                  <View style={styles.classStatusBadge}>
                    <Text style={styles.classStatusText}>Activa</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.classCardDetails}>
                <View style={styles.classDetailItem}>
                  <Icon name="time" size={14} color="#6B7280" />
                  <Text style={styles.classDetailText}>{classOverview.time || 'Horario no definido'}</Text>
                </View>
                <View style={styles.classDetailItem}>
                  <Icon name="location" size={14} color="#6B7280" />
                  <Text style={styles.classDetailText}>{classOverview.location || 'Ubicación no definida'}</Text>
                </View>
                {classOverview.instructor && (
                  <View style={styles.classDetailItem}>
                    <Icon name="person" size={14} color="#6B7280" />
                    <Text style={styles.classDetailText}>{classOverview.instructor}</Text>
                  </View>
                )}
              </View>
              
              <View style={styles.classCardActions}>
                <TouchableOpacity style={styles.classActionButton}>
                  <Icon name="create" size={16} color="#1E3A8A" />
                  <Text style={styles.classActionText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.classActionButton}>
                  <Icon name="eye" size={16} color="#10B981" />
                  <Text style={styles.classActionText}>Ver Detalles</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Clases Adicionales */}
            <View style={styles.classCard}>
              <View style={styles.classCardHeader}>
                <View style={styles.classCardIcon}>
                  <Icon name="calculator" size={20} color="#F59E0B" />
                </View>
                <View style={styles.classCardContent}>
                  <Text style={styles.classCardTitle}>Matemáticas Avanzadas</Text>
                  <Text style={styles.classCardSubtitle}>Curso Complementario</Text>
                </View>
                <View style={styles.classCardStatus}>
                  <View style={styles.classStatusBadge}>
                    <Text style={styles.classStatusText}>Activa</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.classCardDetails}>
                <View style={styles.classDetailItem}>
                  <Icon name="time" size={14} color="#6B7280" />
                  <Text style={styles.classDetailText}>Lunes y Miércoles 10:00-12:00</Text>
                </View>
                <View style={styles.classDetailItem}>
                  <Icon name="location" size={14} color="#6B7280" />
                  <Text style={styles.classDetailText}>Aula 205</Text>
                </View>
                <View style={styles.classDetailItem}>
                  <Icon name="person" size={14} color="#6B7280" />
                  <Text style={styles.classDetailText}>Dr. García</Text>
                </View>
              </View>
              
              <View style={styles.classCardActions}>
                <TouchableOpacity style={styles.classActionButton}>
                  <Icon name="create" size={16} color="#1E3A8A" />
                  <Text style={styles.classActionText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.classActionButton}>
                  <Icon name="eye" size={16} color="#10B981" />
                  <Text style={styles.classActionText}>Ver Detalles</Text>
                </TouchableOpacity>
              </View>
        </View>
        
            <View style={styles.classCard}>
              <View style={styles.classCardHeader}>
                <View style={styles.classCardIcon}>
                  <Icon name="flask" size={20} color="#10B981" />
          </View>
                <View style={styles.classCardContent}>
                  <Text style={styles.classCardTitle}>Laboratorio de Ciencias</Text>
                  <Text style={styles.classCardSubtitle}>Práctica</Text>
            </View>
                <View style={styles.classCardStatus}>
                  <View style={styles.classStatusBadge}>
                    <Text style={styles.classStatusText}>Activa</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.classCardDetails}>
                <View style={styles.classDetailItem}>
                  <Icon name="time" size={14} color="#6B7280" />
                  <Text style={styles.classDetailText}>Viernes 14:00-16:00</Text>
                </View>
                <View style={styles.classDetailItem}>
                  <Icon name="location" size={14} color="#6B7280" />
                  <Text style={styles.classDetailText}>Laboratorio 3</Text>
                </View>
                <View style={styles.classDetailItem}>
                  <Icon name="person" size={14} color="#6B7280" />
                  <Text style={styles.classDetailText}>Prof. Martínez</Text>
                </View>
              </View>
              
              <View style={styles.classCardActions}>
                <TouchableOpacity style={styles.classActionButton}>
                  <Icon name="create" size={16} color="#1E3A8A" />
                  <Text style={styles.classActionText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.classActionButton}>
                  <Icon name="eye" size={16} color="#10B981" />
                  <Text style={styles.classActionText}>Ver Detalles</Text>
                </TouchableOpacity>
            </View>
            </View>
          </View>
        ) : (
          <View style={styles.emptyClassesState}>
            <Icon name="school-outline" size={48} color="#9CA3AF" />
            <Text style={styles.emptyClassesTitle}>No hay clases registradas</Text>
            <Text style={styles.emptyClassesSubtitle}>
              Agrega tu primera clase para comenzar
            </Text>
            <TouchableOpacity style={styles.addFirstClassButton}>
              <Icon name="add-circle" size={20} color="#1E3A8A" />
              <Text style={styles.addFirstClassButtonText}>Agregar Primera Clase</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      
      {/* Accesos Rápidos */}
      <View style={styles.quickAccessContainer}>
        <Text style={styles.quickAccessTitle}>Accesos Rápidos</Text>
        <View style={styles.quickAccessGrid}>
          <TouchableOpacity style={styles.quickAccessCard}>
            <View style={styles.quickAccessIcon}>
              <Icon name="calendar" size={24} color="#1E3A8A" />
            </View>
            <Text style={styles.quickAccessText}>Horario</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickAccessCard}>
            <View style={styles.quickAccessIcon}>
              <Icon name="library" size={24} color="#10B981" />
        </View>
            <Text style={styles.quickAccessText}>Materiales</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickAccessCard}>
            <View style={styles.quickAccessIcon}>
              <Icon name="document-text" size={24} color="#F59E0B" />
            </View>
            <Text style={styles.quickAccessText}>Notas</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickAccessCard}>
            <View style={styles.quickAccessIcon}>
              <Icon name="people" size={24} color="#8B5CF6" />
            </View>
            <Text style={styles.quickAccessText}>Compañeros</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'timetable': return renderTimetable();
      case 'todo': return renderTodoLists();
      case 'projects': return renderGroupProjects();
      case 'exams': return renderExamRevision();
      case 'materials': return renderCourseMaterials();
      case 'class': return renderClassOverview();
      default: return renderTimetable();
    }
  };

  return (
    <View style={styles.container}>
      <ElegantSubsectionTabs
        sections={sections}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        theme="forest"
        size="medium"
        showIcons={true}
        showLabels={false}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderActiveSection()}
      </ScrollView>
      
      {/* Modal para agregar clase */}
      <Modal
        visible={showAddModal && modalType === 'timetable'}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Agregar Nueva Clase</Text>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Icon name="close" size={24} color="#1E3A8A" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Materia *</Text>
                <TextInput
                  style={styles.textInput}
                  value={newClass.subject}
                  onChangeText={(text) => setNewClass(prev => ({ ...prev, subject: text }))}
                  placeholder="Ej: Matemáticas"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Día de la semana *</Text>
                <View style={styles.daySelector}>
                  {weekDays.map((day) => (
                    <TouchableOpacity
                      key={day}
                      style={[
                        styles.dayButton,
                        newClass.day === day && styles.dayButtonSelected
                      ]}
                      onPress={() => setNewClass(prev => ({ ...prev, day }))}
                    >
                      <Text style={[
                        styles.dayButtonText,
                        newClass.day === day && styles.dayButtonTextSelected
                      ]}>
                        {day}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Hora *</Text>
                <View style={styles.timeSelector}>
                  {timeSlots.map((time) => (
                    <TouchableOpacity
                      key={time}
                      style={[
                        styles.timeButton,
                        newClass.time === time && styles.timeButtonSelected
                      ]}
                      onPress={() => setNewClass(prev => ({ ...prev, time }))}
                    >
                      <Text style={[
                        styles.timeButtonText,
                        newClass.time === time && styles.timeButtonTextSelected
                      ]}>
                        {time}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Aula</Text>
                <TextInput
                  style={styles.textInput}
                  value={newClass.classroom}
                  onChangeText={(text) => setNewClass(prev => ({ ...prev, classroom: text }))}
                  placeholder="Ej: Aula 101"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Profesor</Text>
                <TextInput
                  style={styles.textInput}
                  value={newClass.professor}
                  onChangeText={(text) => setNewClass(prev => ({ ...prev, professor: text }))}
                  placeholder="Ej: Prof. García"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Duración (minutos)</Text>
                <View style={styles.durationSelector}>
                  {['30', '60', '90', '120'].map((duration) => (
                    <TouchableOpacity
                      key={duration}
                      style={[
                        styles.durationButton,
                        newClass.duration === duration && styles.durationButtonSelected
                      ]}
                      onPress={() => setNewClass(prev => ({ ...prev, duration }))}
                    >
                      <Text style={[
                        styles.durationButtonText,
                        newClass.duration === duration && styles.durationButtonTextSelected
                      ]}>
                        {duration} min
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>
            
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={closeModal}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleAddClass}
              >
                <Text style={styles.saveButtonText}>Agregar Clase</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal para agregar tarea académica */}
      <Modal
        visible={showAddModal && modalType === 'todo'}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.taskModalContainer}>
            <View style={styles.taskModalHeader}>
              <View style={styles.taskModalTitleContainer}>
                <View style={styles.taskModalIconContainer}>
                  <Icon name="school" size={24} color="#1E3A8A" />
                </View>
                <View style={styles.taskModalTitleContent}>
                  <Text style={styles.taskModalTitle}>Nueva Tarea Académica</Text>
                  <Text style={styles.taskModalSubtitle}>Organiza tu trabajo académico</Text>
                </View>
              </View>
              <TouchableOpacity onPress={closeModal} style={styles.taskModalCloseButton}>
                <Icon name="close-circle" size={28} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.taskModalContent} showsVerticalScrollIndicator={false}>
              {/* Campo de Tarea */}
              <View style={styles.taskInputGroup}>
                <View style={styles.taskInputHeader}>
                  <Icon name="document-text" size={18} color="#1E3A8A" />
                  <Text style={styles.taskInputLabel}>Tarea *</Text>
                </View>
                <TextInput
                  style={styles.taskTextInput}
                  value={newTask.task}
                  onChangeText={(text) => setNewTask(prev => ({ ...prev, task: text }))}
                  placeholder="Ej: Entregar ensayo de literatura"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              
              {/* Campo de Materia */}
              <View style={styles.taskInputGroup}>
                <View style={styles.taskInputHeader}>
                  <Icon name="book" size={18} color="#1E3A8A" />
                  <Text style={styles.taskInputLabel}>Materia</Text>
                </View>
                <TextInput
                  style={styles.taskTextInput}
                  value={newTask.subject}
                  onChangeText={(text) => setNewTask(prev => ({ ...prev, subject: text }))}
                  placeholder="Ej: Literatura, Matemáticas"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              
              {/* Campo de Fecha */}
              <View style={styles.taskInputGroup}>
                <View style={styles.taskInputHeader}>
                  <Icon name="calendar" size={18} color="#1E3A8A" />
                  <Text style={styles.taskInputLabel}>Fecha de entrega *</Text>
                </View>
                <TouchableOpacity
                  style={styles.taskDatePickerButton}
                  onPress={() => {
                    // Aquí se puede agregar un DatePicker
                    Alert.alert('Seleccionar fecha', 'Funcionalidad de DatePicker pendiente');
                  }}
                >
                  <View style={styles.taskDatePickerContent}>
                    <Icon name="calendar-outline" size={20} color="#1E3A8A" />
                    <Text style={styles.taskDatePickerText}>
                      {newTask.date || 'Seleccionar fecha'}
                    </Text>
                    <Icon name="chevron-down" size={16} color="#6B7280" />
                  </View>
                </TouchableOpacity>
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Prioridad</Text>
                <View style={styles.prioritySelector}>
                  <TouchableOpacity
                    style={[
                      styles.priorityButton,
                      newTask.priority === 'low' && styles.priorityButtonSelected,
                      { backgroundColor: newTask.priority === 'low' ? '#10B981' : '#F3F4F6' }
                    ]}
                    onPress={() => setNewTask(prev => ({ ...prev, priority: 'low' }))}
                  >
                    <Text style={[
                      styles.priorityButtonText,
                      newTask.priority === 'low' && styles.priorityButtonTextSelected
                    ]}>
                      Baja
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.priorityButton,
                      newTask.priority === 'medium' && styles.priorityButtonSelected,
                      { backgroundColor: newTask.priority === 'medium' ? '#F59E0B' : '#F3F4F6' }
                    ]}
                    onPress={() => setNewTask(prev => ({ ...prev, priority: 'medium' }))}
                  >
                    <Text style={[
                      styles.priorityButtonText,
                      newTask.priority === 'medium' && styles.priorityButtonTextSelected
                    ]}>
                      Media
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.priorityButton,
                      newTask.priority === 'high' && styles.priorityButtonSelected,
                      { backgroundColor: newTask.priority === 'high' ? '#EF4444' : '#F3F4F6' }
                    ]}
                    onPress={() => setNewTask(prev => ({ ...prev, priority: 'high' }))}
                  >
                    <Text style={[
                      styles.priorityButtonText,
                      newTask.priority === 'high' && styles.priorityButtonTextSelected
                    ]}>
                      Alta
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Tiempo estimado</Text>
                <View style={styles.timeSelector}>
                  {['30 min', '1 hora', '2 horas', '3 horas', '4+ horas'].map((time) => (
                    <TouchableOpacity
                      key={time}
                      style={[
                        styles.timeButton,
                        newTask.estimatedTime === time && styles.timeButtonSelected
                      ]}
                      onPress={() => setNewTask(prev => ({ ...prev, estimatedTime: time }))}
                    >
                      <Text style={[
                        styles.timeButtonText,
                        newTask.estimatedTime === time && styles.timeButtonTextSelected
                      ]}>
                        {time}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Notas adicionales</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  value={newTask.notes}
                  onChangeText={(text) => setNewTask(prev => ({ ...prev, notes: text }))}
                  placeholder="Detalles adicionales sobre la tarea..."
                  placeholderTextColor="#9CA3AF"
                  multiline={true}
                  numberOfLines={3}
                />
              </View>
            </ScrollView>
            
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={closeModal}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleAddTask}
              >
                <Text style={styles.saveButtonText}>Agregar Tarea</Text>
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
    backgroundColor: '#E8F0E3', // Verde forest claro
  },
  content: {
    flex: 1,
    paddingHorizontal: 0,
    paddingVertical: 16,
  },
  section: {
    backgroundColor: '#F0F8FF', // Azul cielo muy claro
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    marginHorizontal: 4,
    shadowColor: '#0066CC', // Azul oceánico
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 2,
    borderColor: '#4A90E2', // Azul marino
  },
  sectionHeader: {
    alignItems: 'center',
    backgroundColor: '#1E3A8A', // Azul oceánico profundo
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginBottom: 0,
    marginHorizontal: 0,
    shadowColor: '#1E3A8A',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
    borderBottomWidth: 3,
    borderBottomColor: '#4A90E2', // Azul marino
  },
  headerDecoration: {
    alignItems: 'center',
    marginBottom: 16,
  },
  headerContent: {
    alignItems: 'center',
  },
  mascotImage: {
    width: 60,
    height: 60,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontWeight: '500',
  },
  addButton: {
    backgroundColor: '#4A90E2', // Azul marino
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#1E3A8A', // Azul oceánico profundo
    shadowColor: '#0066CC', // Azul oceánico
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  // Estilos para el horario semanal
  timetableContainer: {
    backgroundColor: '#F0F8FF', // Azul cielo muy claro
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#4A90E2', // Azul marino
    shadowColor: '#0066CC', // Azul oceánico
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  timetableHeader: {
    flexDirection: 'row',
    backgroundColor: '#1E3A8A', // Azul oceánico profundo
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  timeColumn: {
    width: 80,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  dayColumn: {
    flex: 1,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  timeHeader: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  dayHeader: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  timetableBody: {
    maxHeight: 400,
  },
  timetableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E6F3FF',
    backgroundColor: '#FFFFFF',
    minHeight: 60,
  },
  timetableRowWithClass: {
    backgroundColor: '#E6F3FF',
    borderBottomColor: '#4A90E2',
  },
  timeCell: {
    width: 80,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    flexDirection: 'column',
    gap: 4,
  },
  timeCellWithClass: {
    backgroundColor: '#4A90E2',
  },
  scheduleCell: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 60,
  },
  scheduleCellWithClass: {
    backgroundColor: '#E6F3FF',
  },
  timeText: {
    fontSize: 11,
    color: '#1E3A8A', // Azul oceánico profundo
    fontWeight: '600',
  },
  timeTextWithClass: {
    color: '#FFFFFF',
  },
  scheduleText: {
    fontSize: 10,
    color: '#1E3A8A', // Azul oceánico profundo
    textAlign: 'center',
  },
  // Nuevos estilos para las tarjetas de clase
  classCard: {
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    padding: 12,
    width: '100%',
    shadowColor: '#0066CC',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  classHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  classTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1,
  },
  classDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  classDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  classDetailText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '500',
  },
  emptySlot: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
  },
  emptySlotText: {
    color: '#B0C4DE',
    fontSize: 12,
    fontStyle: 'italic',
  },
  // Estilos para las listas de tareas
  todoContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  todoList: {
    flex: 1,
  },
  todoListTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E3A8A', // Azul oceánico profundo
    marginBottom: 8,
  },
  todoHeader: {
    flexDirection: 'row',
    backgroundColor: '#4A90E2', // Azul marino
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#1E3A8A', // Azul oceánico profundo
    marginBottom: 8,
  },
  todoHeaderText: {
    flex: 1,
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
  },
  todoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  todoCheckbox: {
    marginRight: 8,
  },
  todoText: {
    flex: 2,
    fontSize: 12,
    color: '#2d4150',
  },
  todoTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#6c757d',
  },
  todoDate: {
    flex: 1,
    fontSize: 10,
    color: '#6c757d',
    textAlign: 'center',
  },
  todoNotes: {
    flex: 1,
    fontSize: 10,
    color: '#6c757d',
    textAlign: 'center',
  },
  // Estilos para proyectos grupales
  projectsContainer: {
    gap: 16,
  },
  projectCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#45B7D1',
  },
  projectTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d4150',
    marginBottom: 4,
  },
  projectDates: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 8,
  },
  projectObjective: {
    fontSize: 14,
    color: '#2d4150',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  projectDetails: {
    gap: 8,
  },
  projectDetailTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#45B7D1',
  },
  projectDetailText: {
    fontSize: 12,
    color: '#2d4150',
    marginBottom: 8,
  },
  actionStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  actionStepText: {
    fontSize: 12,
    color: '#2d4150',
    marginLeft: 8,
  },
  actionStepCompleted: {
    textDecorationLine: 'line-through',
    color: '#6c757d',
  },
  // Estilos para revisión de exámenes
  examContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  examCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    width: '48%',
    borderLeftWidth: 4,
    borderLeftColor: '#dc3545',
  },
  examTopic: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2d4150',
    marginBottom: 8,
  },
  examDetails: {
    gap: 6,
  },
  examDetailTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#dc3545',
  },
  examTodo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  examTodoText: {
    fontSize: 12,
    color: '#2d4150',
    marginLeft: 8,
  },
  examTodoCompleted: {
    textDecorationLine: 'line-through',
    color: '#6c757d',
  },
  examNotes: {
    fontSize: 12,
    color: '#2d4150',
    fontStyle: 'italic',
  },
  // Estilos mejorados para materiales del curso
  materialsSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  materialsSummaryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#1E3A8A',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  materialsSummaryIcon: {
    marginBottom: 8,
  },
  materialsSummaryContent: {
    alignItems: 'center',
  },
  materialsSummaryTitle: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  materialsSummaryValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E3A8A',
  },
  materialsSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#1E3A8A',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  materialsSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  materialsSectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  materialsSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E3A8A',
  },
  addMaterialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  addMaterialButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E3A8A',
  },
  emptyMaterialsState: {
    alignItems: 'center',
    padding: 32,
  },
  emptyMaterialsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 12,
    marginBottom: 4,
  },
  emptyMaterialsSubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  materialsGrid: {
    gap: 12,
  },
  materialCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  materialCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  materialCardIcon: {
    marginRight: 8,
  },
  materialCardActions: {
    flexDirection: 'row',
    gap: 8,
  },
  materialActionButton: {
    padding: 4,
  },
  materialCardContent: {
    gap: 8,
  },
  materialCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E3A8A',
    marginBottom: 2,
  },
  materialCardAuthor: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  materialCardDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  materialDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  materialDetailText: {
    fontSize: 11,
    color: '#6B7280',
  },
  materialNotes: {
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
    padding: 8,
    marginTop: 4,
  },
  materialNotesText: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  // Estilos mejorados para resúmenes de clase
  classSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  classSummaryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#1E3A8A',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  classSummaryIcon: {
    marginBottom: 8,
  },
  classSummaryContent: {
    alignItems: 'center',
  },
  classSummaryTitle: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  classSummaryValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E3A8A',
  },
  classesContainer: {
    marginBottom: 24,
  },
  classesTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E3A8A',
    marginBottom: 16,
  },
  classesList: {
    gap: 12,
  },
  classCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#1E3A8A',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  classCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  classCardIcon: {
    marginRight: 12,
  },
  classCardContent: {
    flex: 1,
  },
  classCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E3A8A',
    marginBottom: 2,
  },
  classCardSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  classCardStatus: {
    marginLeft: 8,
  },
  classStatusBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  classStatusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  classCardDetails: {
    marginBottom: 12,
    gap: 6,
  },
  classDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  classDetailText: {
    fontSize: 13,
    color: '#6B7280',
  },
  classCardActions: {
    flexDirection: 'row',
    gap: 8,
  },
  classActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  classActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E3A8A',
  },
  emptyClassesState: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  emptyClassesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 12,
    marginBottom: 4,
  },
  emptyClassesSubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 16,
  },
  addFirstClassButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E3A8A',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
  },
  addFirstClassButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  quickAccessContainer: {
    marginTop: 8,
  },
  quickAccessTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E3A8A',
    marginBottom: 12,
  },
  quickAccessGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickAccessCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#1E3A8A',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  quickAccessIcon: {
    marginBottom: 8,
  },
  quickAccessText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E3A8A',
    textAlign: 'center',
  },
  // Nuevos estilos para horario mejorado
  daySummary: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#1E3A8A',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E6F3FF',
  },
  summaryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  summaryContent: {
    flex: 1,
  },
  summaryTitle: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E3A8A',
  },
  timetableRowCurrent: {
    backgroundColor: '#FFF5F0',
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B35',
  },
  timetableRowPast: {
    opacity: 0.6,
  },
  timeCellCurrent: {
    backgroundColor: '#FF6B35',
  },
  timeIconContainer: {
    marginBottom: 4,
  },
  timeTextCurrent: {
    color: '#FFFFFF',
  },
  classCardCurrent: {
    backgroundColor: '#FF6B35',
    shadowColor: '#FF6B35',
  },
  classIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  classTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  classBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  classBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  classActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
  },
  actionButtonText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  emptySlotCurrent: {
    backgroundColor: '#FFF5F0',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF6B35',
  },
  emptySlotPast: {
    opacity: 0.5,
  },
  emptySlotIcon: {
    marginRight: 12,
  },
  emptySlotContent: {
    flex: 1,
  },
  emptySlotTextCurrent: {
    color: '#FF6B35',
  },
  emptySlotSubtext: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  // Estilos para botón flotante
  floatingAddButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
  },
  floatingButton: {
    backgroundColor: '#1E3A8A',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#1E3A8A',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    gap: 8,
  },
  floatingButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  // Estilos para modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: '90%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E3A8A',
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    padding: 20,
    maxHeight: 400,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E3A8A',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1E3A8A',
    backgroundColor: '#F9FAFB',
  },
  daySelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dayButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#F9FAFB',
  },
  dayButtonSelected: {
    backgroundColor: '#1E3A8A',
    borderColor: '#1E3A8A',
  },
  dayButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  dayButtonTextSelected: {
    color: '#FFFFFF',
  },
  timeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    maxHeight: 120,
  },
  timeButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#F9FAFB',
  },
  timeButtonSelected: {
    backgroundColor: '#1E3A8A',
    borderColor: '#1E3A8A',
  },
  timeButtonText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#6B7280',
  },
  timeButtonTextSelected: {
    color: '#FFFFFF',
  },
  durationSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  durationButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#F9FAFB',
  },
  durationButtonSelected: {
    backgroundColor: '#1E3A8A',
    borderColor: '#1E3A8A',
  },
  durationButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  durationButtonTextSelected: {
    color: '#FFFFFF',
  },
  modalActions: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
  },
  saveButton: {
    backgroundColor: '#1E3A8A',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // Estilos para navegación del calendario
  calendarNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#1E3A8A',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  todayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E3A8A',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    shadowColor: '#1E3A8A',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  todayButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  // Estilos para navegación de horas
  hourNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#F1F5F9',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  hourNavButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#1E3A8A',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  hourDisplay: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  hourDisplayText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E3A8A',
    textAlign: 'center',
  },
  currentHourButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E3A8A',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
    marginLeft: 8,
    shadowColor: '#1E3A8A',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#0F2A5C',
  },
  currentHourButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  // Estilos para filas seleccionadas
  timetableRowSelected: {
    backgroundColor: '#F0F4FF',
    borderLeftWidth: 3,
    borderLeftColor: '#1E3A8A',
  },
  timeCellSelected: {
    backgroundColor: '#1E3A8A',
  },
  timeTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  classCardSelected: {
    backgroundColor: '#F0F4FF',
    borderColor: '#1E3A8A',
    borderWidth: 1,
  },
  emptySlotSelected: {
    backgroundColor: '#F0F4FF',
    borderColor: '#1E3A8A',
    borderWidth: 1,
  },
  emptySlotTextSelected: {
    color: '#1E3A8A',
    fontWeight: '600',
  },
  // Estilos mejorados para tareas académicas
  todoSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  todoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    marginHorizontal: 16,
    shadowColor: '#1E3A8A',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  todoCardOverdue: {
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  todoCardDueToday: {
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
    backgroundColor: '#FFFBEB',
  },
  todoCardCompleted: {
    backgroundColor: '#F0FDF4',
    borderColor: '#10B981',
  },
  todoCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  todoCheckbox: {
    marginTop: 2,
  },
  todoCardContent: {
    flex: 1,
  },
  todoTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
    lineHeight: 24,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  todoTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#6B7280',
    fontWeight: '600',
  },
  todoMeta: {
    gap: 6,
  },
  todoDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  todoDate: {
    fontSize: 15,
    color: '#374151',
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  todoDateOverdue: {
    color: '#DC2626',
    fontWeight: '700',
    fontSize: 16,
  },
  todoDateDueToday: {
    color: '#D97706',
    fontWeight: '700',
    fontSize: 16,
  },
  todoNotesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  todoNotes: {
    fontSize: 15,
    color: '#4B5563',
    flex: 1,
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  todoActions: {
    alignItems: 'flex-end',
  },
  overdueBadge: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  overdueText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  dueTodayBadge: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  dueTodayText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  completedBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  completedText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  todoNotesExpanded: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  todoNotesFull: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 22,
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
  },
  // Estilos para información adicional de tareas
  todoSubjectContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  todoSubject: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  todoTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  todoEstimatedTime: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  // Estilos para badges de prioridad
  priorityBadgeHigh: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
  },
  priorityTextHigh: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  priorityBadgeMedium: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
  },
  priorityTextMedium: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  priorityBadgeLow: {
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
  },
  priorityTextLow: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  badgeSpacer: {
    width: 8,
  },
  // Estilos mejorados para el botón de agregar tarea
  addTaskButton: {
    backgroundColor: '#1E3A8A',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginHorizontal: 4,
    shadowColor: '#1E3A8A',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#0F2A5C',
  },
  addTaskButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  addTaskIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  addTaskTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  addTaskButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  addTaskButtonSubtext: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontWeight: '500',
  },
  addTaskArrowContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Estilos para proyectos mejorados
  addProjectButton: {
    backgroundColor: '#1E3A8A',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#1E3A8A',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  addProjectButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  projectsSummary: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  projectSummaryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#1E3A8A',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E6F3FF',
  },
  projectSummaryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  projectSummaryContent: {
    flex: 1,
  },
  projectSummaryTitle: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  projectSummaryValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E3A8A',
  },
  emptyProjectsState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyProjectsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyProjectsSubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
  },
  enhancedProjectCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#1E3A8A',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E6F3FF',
    overflow: 'hidden',
  },
  projectCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  projectCardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  projectCardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  projectCardTitleContent: {
    flex: 1,
  },
  enhancedProjectTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E3A8A',
    marginBottom: 4,
  },
  projectCardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  enhancedProjectDates: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  projectCardActions: {
    flexDirection: 'row',
    gap: 8,
  },
  projectActionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  projectCardContent: {
    padding: 20,
  },
  enhancedProjectObjective: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 20,
    fontWeight: '500',
  },
  projectCardSections: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  projectCardSection: {
    flex: 1,
  },
  projectSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  projectSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  projectSectionContent: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  enhancedActionSteps: {
    gap: 8,
  },
  enhancedActionStep: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  actionStepContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  enhancedActionStepText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
    lineHeight: 20,
  },
  enhancedActionStepCompleted: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  completedBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  completedBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  // Estilos para exámenes mejorados
  addExamButton: {
    backgroundColor: '#1E3A8A',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#1E3A8A',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  addExamButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  examSummary: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  examSummaryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#1E3A8A',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E6F3FF',
  },
  examSummaryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  examSummaryContent: {
    flex: 1,
  },
  examSummaryTitle: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  examSummaryValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E3A8A',
  },
  emptyExamState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyExamTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyExamSubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
  },
  enhancedExamCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#1E3A8A',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E6F3FF',
    overflow: 'hidden',
  },
  examCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  examCardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  examCardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  examCardTitleContent: {
    flex: 1,
  },
  enhancedExamTopic: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E3A8A',
    marginBottom: 4,
  },
  examCardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  enhancedExamDate: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  examCardActions: {
    flexDirection: 'row',
    gap: 8,
  },
  examActionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  examCardContent: {
    padding: 20,
  },
  examCardSection: {
    marginBottom: 16,
  },
  examSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  examSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  enhancedExamTodos: {
    gap: 8,
  },
  enhancedExamTodo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  examTodoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  enhancedExamTodoText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
    lineHeight: 20,
  },
  enhancedExamTodoCompleted: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  enhancedExamNotes: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
  },
  
  // Estilos para la nueva UI de tareas académicas
  tasksHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1E3A8A',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#1E3A8A',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  tasksHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  tasksIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  tasksHeaderText: {
    flex: 1,
  },
  tasksHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  tasksHeaderSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  tasksHeaderBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Resumen de tareas mejorado
  tasksSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 8,
  },
  summaryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  
  // Botón para agregar tarea
  addTaskContainer: {
    marginBottom: 20,
  },
  addTaskText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  
  // Lista de tareas mejorada
  tasksContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  tasksTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterText: {
    color: '#1E3A8A',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  tasksBody: {
    maxHeight: 500,
  },
  
  // Estado vacío
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1E3A8A',
  },
  emptyButtonText: {
    color: '#1E3A8A',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  
  // Tarjetas de tareas
  taskItem: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  taskItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  taskItemInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  taskCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  taskCheckboxCompleted: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
    lineHeight: 22,
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#6B7280',
  },
  taskMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  taskMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  taskMetaText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  taskMetaTextOverdue: {
    color: '#EF4444',
    fontWeight: '600',
  },
  taskItemActions: {
    flexDirection: 'row',
    gap: 8,
  },
  taskActionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Información adicional de la tarea
  taskItemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskPriority: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  priorityIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '600',
  },
  taskTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  taskTimeText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  
  // Notas de la tarea
  taskNotes: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#3B82F6',
  },
  taskNotesText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  
  // Estado de la tarea
  taskStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusCompleted: {
    backgroundColor: '#10B981',
  },
  statusOverdue: {
    backgroundColor: '#EF4444',
  },
  statusPending: {
    backgroundColor: '#F59E0B',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusCompletedText: {
    color: '#10B981',
  },
  statusOverdueText: {
    color: '#EF4444',
  },
  statusPendingText: {
    color: '#F59E0B',
  },
});

export default SchoolSections;
