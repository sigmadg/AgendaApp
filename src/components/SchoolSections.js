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

const SchoolSections = ({ onUpdateSection }) => {
  // Estados para las diferentes secciones
  const [activeSection, setActiveSection] = useState('timetable');
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalType, setModalType] = useState('');
  
  // Estados para el horario semanal
  const [timetable, setTimetable] = useState({});
  
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

  const renderSectionTabs = () => (
    <View style={styles.tabsContainer}>
      <View style={styles.tabsWrapper}>
        {sections.map((section) => (
          <TouchableOpacity
            key={section.id}
            style={[
              styles.tab,
              activeSection === section.id && styles.activeTab
            ]}
            onPress={() => setActiveSection(section.id)}
          >
            <View style={[styles.tabContent, {
              backgroundColor: activeSection === section.id ? '#4A90E2' : 'transparent',
              borderColor: activeSection === section.id ? '#4A90E2' : '#0066CC',
            }]}>
              <Icon 
                name={section.icon} 
                size={20} 
                color={activeSection === section.id ? '#FFFFFF' : '#1E3A8A'} 
              />
              {activeSection === section.id && (
                <View style={styles.activeIndicator} />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderTimetable = () => {
    // Obtener el día actual
    const today = new Date();
    const dayIndex = today.getDay(); // 0 = Domingo, 1 = Lunes, etc.
    const currentDay = weekDays[dayIndex === 0 ? 6 : dayIndex - 1]; // Ajustar para que Lunes sea 0
    
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
            <Text style={styles.sectionTitle}>Horario de - {dayNames[currentDay]}</Text>
            <Text style={styles.sectionSubtitle}>
              Gestiona tu horario académico diario
            </Text>
          </View>
          <TouchableOpacity onPress={() => {
            setModalType('timetable');
            setShowAddModal(true);
          }} style={styles.addButton}>
            <Icon name="add" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.timetableContainer}>
          <View style={styles.timetableHeader}>
            <View style={styles.timeColumn}>
              <Icon name="time" size={16} color="#FFFFFF" style={styles.headerIcon} />
              <Text style={styles.timeHeader}>HORA</Text>
            </View>
            <View style={styles.dayColumn}>
              <Icon name="calendar" size={16} color="#FFFFFF" style={styles.headerIcon} />
              <Text style={styles.dayHeader}>{dayNames[currentDay]}</Text>
            </View>
          </View>
          
          <ScrollView style={styles.timetableBody} showsVerticalScrollIndicator={false}>
            {timeSlots.map((time, index) => {
              const hasClass = timetable[`${currentDay}-${time}`];
              return (
                <View key={time} style={[
                  styles.timetableRow,
                  hasClass && styles.timetableRowWithClass
                ]}>
                  <View style={[
                    styles.timeCell,
                    hasClass && styles.timeCellWithClass
                  ]}>
                    <Icon 
                      name="time-outline" 
                      size={12} 
                      color={hasClass ? '#FFFFFF' : '#1E3A8A'} 
                    />
                    <Text style={[
                      styles.timeText,
                      hasClass && styles.timeTextWithClass
                    ]}>{time}</Text>
                  </View>
                  <View style={[
                    styles.scheduleCell,
                    hasClass && styles.scheduleCellWithClass
                  ]}>
                    {hasClass ? (
                      <View style={styles.classCard}>
                        <View style={styles.classHeader}>
                          <Icon name="school" size={14} color="#FFFFFF" />
                          <Text style={styles.classTitle}>{hasClass}</Text>
                        </View>
                        <View style={styles.classDetails}>
                          <View style={styles.classDetailItem}>
                            <Icon name="location" size={12} color="#4A90E2" />
                            <Text style={styles.classDetailText}>Aula 101</Text>
                          </View>
                          <View style={styles.classDetailItem}>
                            <Icon name="person" size={12} color="#4A90E2" />
                            <Text style={styles.classDetailText}>Prof. García</Text>
                          </View>
                        </View>
                      </View>
                    ) : (
                      <View style={styles.emptySlot}>
                        <Icon name="ellipse-outline" size={16} color="#B0C4DE" />
                        <Text style={styles.emptySlotText}>Libre</Text>
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

  const renderTodoLists = () => (
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
          <Text style={styles.sectionTitle}>TAREAS ACADÉMICAS</Text>
          <Text style={styles.sectionSubtitle}>
            Organiza tus tareas y proyectos académicos
          </Text>
        </View>
        <TouchableOpacity onPress={() => {
          setModalType('todo');
          setShowAddModal(true);
        }} style={styles.addButton}>
          <Icon name="add" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.todoContainer}>
        <View style={styles.todoList}>
          <View style={styles.todoHeader}>
            <Text style={styles.todoHeaderText}>TAREA</Text>
            <Text style={styles.todoHeaderText}>FECHA</Text>
            <Text style={styles.todoHeaderText}>NOTAS</Text>
          </View>
          {todoLists.academic.map((todo, index) => (
            <View key={index} style={styles.todoRow}>
              <View style={styles.todoCheckbox}>
                <Icon 
                  name={todo.completed ? "checkbox" : "square-outline"} 
                  size={20} 
                  color={todo.completed ? "#28a745" : "#6c757d"} 
                />
              </View>
              <Text style={[styles.todoText, todo.completed && styles.todoTextCompleted]}>
                {todo.task}
              </Text>
              <Text style={styles.todoDate}>{todo.date}</Text>
              <Text style={styles.todoNotes}>{todo.notes}</Text>
            </View>
          ))}
        </View>
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
          <Text style={styles.sectionTitle}>PLANIFICADOR DE PROYECTOS</Text>
          <Text style={styles.sectionSubtitle}>
            Gestiona proyectos grupales y colaborativos
          </Text>
        </View>
        <TouchableOpacity onPress={() => {
          setModalType('project');
          setShowAddModal(true);
        }} style={styles.addButton}>
          <Icon name="add" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.projectsContainer}>
        {groupProjects.map((project, index) => (
          <View key={index} style={styles.projectCard}>
            <Text style={styles.projectTitle}>{project.title}</Text>
            <Text style={styles.projectDates}>
              {project.startDate} - {project.endDate}
            </Text>
            <Text style={styles.projectObjective}>{project.objective}</Text>
            <View style={styles.projectDetails}>
              <Text style={styles.projectDetailTitle}>RECURSOS:</Text>
              <Text style={styles.projectDetailText}>{project.resources}</Text>
              <Text style={styles.projectDetailTitle}>IDEAS:</Text>
              <Text style={styles.projectDetailText}>{project.ideas}</Text>
              <Text style={styles.projectDetailTitle}>PASOS DE ACCIÓN:</Text>
              {project.actionSteps.map((step, stepIndex) => (
                <View key={stepIndex} style={styles.actionStep}>
                  <Icon 
                    name={step.completed ? "checkbox" : "square-outline"} 
                    size={16} 
                    color={step.completed ? "#28a745" : "#6c757d"} 
                  />
                  <Text style={[styles.actionStepText, step.completed && styles.actionStepCompleted]}>
                    {step.text}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ))}
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
          <Text style={styles.sectionTitle}>EXÁMENES</Text>
          <Text style={styles.sectionSubtitle}>
            Planifica y prepara tus exámenes
          </Text>
        </View>
        <TouchableOpacity onPress={() => {
          setModalType('exam');
          setShowAddModal(true);
        }} style={styles.addButton}>
          <Icon name="add" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.examContainer}>
        {examRevisions.map((exam, index) => (
          <View key={index} style={styles.examCard}>
            <Text style={styles.examTopic}>TEMA: {exam.topic}</Text>
            <View style={styles.examDetails}>
              <Text style={styles.examDetailTitle}>POR HACER:</Text>
              {exam.todos.map((todo, todoIndex) => (
                <View key={todoIndex} style={styles.examTodo}>
                  <Icon 
                    name={todo.completed ? "checkbox" : "square-outline"} 
                    size={16} 
                    color={todo.completed ? "#28a745" : "#6c757d"} 
                  />
                  <Text style={[styles.examTodoText, todo.completed && styles.examTodoCompleted]}>
                    {todo.text}
                  </Text>
                </View>
              ))}
              <Text style={styles.examDetailTitle}>FECHA: {exam.date}</Text>
              <Text style={styles.examDetailTitle}>NOTAS:</Text>
              <Text style={styles.examNotes}>{exam.notes}</Text>
            </View>
          </View>
        ))}
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
          <Text style={styles.sectionTitle}>MATERIALES DEL CURSO</Text>
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
      
      <View style={styles.materialsContainer}>
        <View style={styles.materialsSection}>
          <Text style={styles.materialsSectionTitle}>LIBROS DE TEXTO:</Text>
          <View style={styles.materialsTable}>
            <View style={styles.materialsHeader}>
              <Text style={styles.materialsHeaderText}>TÍTULO</Text>
              <Text style={styles.materialsHeaderText}>AUTOR</Text>
              <Text style={styles.materialsHeaderText}>GÉNERO</Text>
              <Text style={styles.materialsHeaderText}>PRECIO</Text>
              <Text style={styles.materialsHeaderText}>NOTAS</Text>
            </View>
            {textbooks.map((book, index) => (
              <View key={index} style={styles.materialsRow}>
                <Text style={styles.materialsText}>{book.title}</Text>
                <Text style={styles.materialsText}>{book.author}</Text>
                <Text style={styles.materialsText}>{book.genre}</Text>
                <Text style={styles.materialsText}>{book.price}</Text>
                <Text style={styles.materialsText}>{book.notes}</Text>
              </View>
            ))}
          </View>
        </View>
        
        <View style={styles.materialsSection}>
          <Text style={styles.materialsSectionTitle}>RECURSOS EN LÍNEA:</Text>
          <View style={styles.materialsTable}>
            <View style={styles.materialsHeader}>
              <Text style={styles.materialsHeaderText}>SITIO WEB</Text>
              <Text style={styles.materialsHeaderText}>LOGIN</Text>
              <Text style={styles.materialsHeaderText}>CONTRASEÑA</Text>
              <Text style={styles.materialsHeaderText}>PRECIO</Text>
              <Text style={styles.materialsHeaderText}>NOTAS</Text>
            </View>
            {onlineResources.map((resource, index) => (
              <View key={index} style={styles.materialsRow}>
                <Text style={styles.materialsText}>{resource.website}</Text>
                <Text style={styles.materialsText}>{resource.login}</Text>
                <Text style={styles.materialsText}>{resource.password}</Text>
                <Text style={styles.materialsText}>{resource.price}</Text>
                <Text style={styles.materialsText}>{resource.notes}</Text>
              </View>
            ))}
          </View>
        </View>
        
        <View style={styles.materialsSection}>
          <Text style={styles.materialsSectionTitle}>TRACKER DE REFERENCIAS:</Text>
          <View style={styles.materialsTable}>
            <View style={styles.materialsHeader}>
              <Text style={styles.materialsHeaderText}>CITA</Text>
              <Text style={styles.materialsHeaderText}>LIBRO</Text>
              <Text style={styles.materialsHeaderText}>AUTOR</Text>
              <Text style={styles.materialsHeaderText}>PÁGINA</Text>
            </View>
            {references.map((ref, index) => (
              <View key={index} style={styles.materialsRow}>
                <Text style={styles.materialsText}>{ref.quote}</Text>
                <Text style={styles.materialsText}>{ref.book}</Text>
                <Text style={styles.materialsText}>{ref.author}</Text>
                <Text style={styles.materialsText}>{ref.page}</Text>
              </View>
            ))}
          </View>
        </View>
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
          <Text style={styles.sectionTitle}>RESUMEN DE CLASE</Text>
          <Text style={styles.sectionSubtitle}>
            Información detallada de tus clases
          </Text>
        </View>
        <TouchableOpacity onPress={() => {
          setModalType('class');
          setShowAddModal(true);
        }} style={styles.addButton}>
          <Icon name="add" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.classContainer}>
        <View style={styles.classSection}>
          <Text style={styles.classFieldTitle}>CURSO:\t</Text>
          <Text style={styles.classFieldText}>{classOverview.course}</Text>
          
          <Text style={styles.classFieldTitle}>HORA:</Text>
          <Text style={styles.classFieldText}>{classOverview.time}</Text>
          
          <Text style={styles.classFieldTitle}>UBICACIÓN:</Text>
          <Text style={styles.classFieldText}>{classOverview.location}</Text>
          
          <Text style={styles.classFieldTitle}>INSTRUCTOR:</Text>
          <Text style={styles.classFieldText}>{classOverview.instructor}</Text>
          
          <Text style={styles.classFieldTitle}>INFORMACIÓN DE CONTACTO:</Text>
          <Text style={styles.classFieldText}>{classOverview.contactInfo}</Text>
          
          <Text style={styles.classFieldTitle}>HORAS DE OFICINA:</Text>
          <Text style={styles.classFieldText}>{classOverview.officeHours}</Text>
          
          <Text style={styles.classFieldTitle}>INFORMACIÓN DE ACCESO:</Text>
          <Text style={styles.classFieldText}>{classOverview.accessInfo}</Text>
          
          <Text style={styles.classFieldTitle}>CUENTA/SITIO WEB:</Text>
          <Text style={styles.classFieldText}>{classOverview.account}</Text>
          
          <Text style={styles.classFieldTitle}>LOGIN/USUARIO:</Text>
          <Text style={styles.classFieldText}>{classOverview.login}</Text>
          
          <Text style={styles.classFieldTitle}>CONTRASEÑA:</Text>
          <Text style={styles.classFieldText}>{classOverview.password}</Text>
        </View>
        
        <View style={styles.classSection}>
          <Text style={styles.classSectionTitle}>FECHAS IMPORTANTES:</Text>
          <View style={styles.importantDatesHeader}>
            <Text style={styles.importantDatesHeaderText}>FECHA</Text>
            <Text style={styles.importantDatesHeaderText}>DESCRIPCIÓN</Text>
          </View>
          {classOverview.importantDates.map((date, index) => (
            <View key={index} style={styles.importantDatesRow}>
              <Text style={styles.importantDatesText}>{date.date}</Text>
              <Text style={styles.importantDatesText}>{date.description}</Text>
            </View>
          ))}
          
          <Text style={styles.classSectionTitle}>NOTAS:</Text>
          <Text style={styles.classNotes}>{classOverview.notes}</Text>
          
          <Text style={styles.classSectionTitle}>COMPONENTES DE CALIFICACIÓN:</Text>
          {classOverview.gradingComponents.map((component, index) => (
            <View key={index} style={styles.gradingComponent}>
              <Text style={styles.gradingComponentText}>{index + 1}. {component}</Text>
            </View>
          ))}
          
          <Text style={styles.classFieldTitle}>CALIFICACIÓN OBJETIVO:</Text>
          <Text style={styles.classFieldText}>{classOverview.targetGrade}</Text>
          
          <Text style={styles.classFieldTitle}>CALIFICACIÓN ACTUAL:</Text>
          <Text style={styles.classFieldText}>{classOverview.actualGrade}</Text>
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
      {renderSectionTabs()}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderActiveSection()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6F3FF', // Azul oceánico claro
  },
  tabsContainer: {
    backgroundColor: '#E6F3FF', // Azul oceánico claro
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderRadius: 20,
    marginHorizontal: 4,
    shadowColor: '#0066CC', // Azul oceánico
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 2,
    borderColor: '#4A90E2', // Azul marino
  },
  tabsWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#E6F3FF', // Azul oceánico claro
    padding: 8,
    width: '100%',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 16,
    marginHorizontal: 4,
  },
  activeTab: {
    shadowColor: '#4A90E2', // Azul marino
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
  },
  tabContent: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    position: 'relative',
    shadowColor: '#0066CC', // Azul oceánico
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -8,
    left: '50%',
    marginLeft: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1E3A8A', // Azul oceánico profundo
    shadowColor: '#1E3A8A',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
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
  // Estilos para materiales del curso
  materialsContainer: {
    gap: 16,
  },
  materialsSection: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
  },
  materialsSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d4150',
    marginBottom: 12,
  },
  materialsTable: {
    backgroundColor: '#ffffff',
    borderRadius: 4,
    overflow: 'hidden',
  },
  materialsHeader: {
    flexDirection: 'row',
    backgroundColor: '#45B7D1',
    padding: 8,
  },
  materialsHeaderText: {
    flex: 1,
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 10,
    textAlign: 'center',
  },
  materialsRow: {
    flexDirection: 'row',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  materialsText: {
    flex: 1,
    fontSize: 10,
    color: '#2d4150',
    textAlign: 'center',
  },
  // Estilos para resumen de clase
  classContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  classSection: {
    flex: 1,
  },
  classFieldTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#45B7D1',
    marginTop: 8,
    marginBottom: 4,
  },
  classFieldText: {
    fontSize: 12,
    color: '#2d4150',
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  classSectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2d4150',
    marginTop: 16,
    marginBottom: 8,
  },
  importantDatesHeader: {
    flexDirection: 'row',
    backgroundColor: '#45B7D1',
    padding: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  importantDatesHeaderText: {
    flex: 1,
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
  },
  importantDatesRow: {
    flexDirection: 'row',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  importantDatesText: {
    flex: 1,
    fontSize: 12,
    color: '#2d4150',
    textAlign: 'center',
  },
  classNotes: {
    fontSize: 12,
    color: '#2d4150',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  gradingComponent: {
    marginBottom: 4,
  },
  gradingComponentText: {
    fontSize: 12,
    color: '#2d4150',
  },
});

export default SchoolSections;
