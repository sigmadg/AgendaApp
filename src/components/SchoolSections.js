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
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';

const SchoolSections = () => {
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
          <Text style={styles.sectionTitle}>HORARIO DE HOY - {dayNames[currentDay]}</Text>
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
              <Text style={styles.timeHeader}>HORA</Text>
            </View>
            <View style={styles.dayColumn}>
              <Text style={styles.dayHeader}>{dayNames[currentDay]}</Text>
            </View>
          </View>
          
          <ScrollView style={styles.timetableBody}>
            {timeSlots.map((time, index) => (
              <View key={time} style={styles.timetableRow}>
                <View style={styles.timeCell}>
                  <Text style={styles.timeText}>{time}</Text>
                </View>
                <View style={styles.scheduleCell}>
                  <Text style={styles.scheduleText}>
                    {timetable[`${currentDay}-${time}`] || ''}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    );
  };

  const renderTodoLists = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>TAREAS ACADÉMICAS</Text>
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
        <Text style={styles.sectionTitle}>PLANIFICADOR DE PROYECTOS</Text>
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
        <Text style={styles.sectionTitle}>EXÁMENES</Text>
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
        <Text style={styles.sectionTitle}>MATERIALES DEL CURSO</Text>
        <Icon name="crown" size={16} color="#FF69B4" />
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
        <Text style={styles.sectionTitle}>RESUMEN DE CLASE</Text>
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
    backgroundColor: '#45B7D1',
  },
  content: {
    flex: 1,
    paddingHorizontal: 0,
    paddingVertical: 16,
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    marginHorizontal: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d4150',
    flex: 1,
  },
  addButton: {
    backgroundColor: '#45B7D1',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Estilos para el horario semanal
  timetableContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    overflow: 'hidden',
  },
  timetableHeader: {
    flexDirection: 'row',
    backgroundColor: '#45B7D1',
  },
  timeColumn: {
    width: 80,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayColumn: {
    flex: 1,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
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
    borderBottomColor: '#e9ecef',
  },
  timeCell: {
    width: 80,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  scheduleCell: {
    flex: 1,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 40,
  },
  timeText: {
    fontSize: 10,
    color: '#6c757d',
    fontWeight: '500',
  },
  scheduleText: {
    fontSize: 10,
    color: '#2d4150',
    textAlign: 'center',
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
    color: '#2d4150',
    marginBottom: 8,
  },
  todoHeader: {
    flexDirection: 'row',
    backgroundColor: '#45B7D1',
    padding: 8,
    borderRadius: 4,
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
