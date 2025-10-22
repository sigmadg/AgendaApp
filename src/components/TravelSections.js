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

const TravelSections = () => {
  const [activeSection, setActiveSection] = useState('travel-planner');
  
  // Estados para Travel Planner
  const [travelPlans, setTravelPlans] = useState([]);
  const [showAddTravelModal, setShowAddTravelModal] = useState(false);
  const [newTravelPlan, setNewTravelPlan] = useState({
    date: '',
    destination: '',
    clothing: [],
    items: [],
    personalCare: [],
    documents: [],
    essentials: [],
    shoes: [],
    devices: [],
    reminders: []
  });

  // Estados para Tour Planner
  const [tourPlans, setTourPlans] = useState([]);
  const [showAddTourModal, setShowAddTourModal] = useState(false);
  const [newTourPlan, setNewTourPlan] = useState({
    date: '',
    day: '',
    destination: '',
    sites: [],
    breakfast: '',
    lunch: '',
    dinner: '',
    other: '',
    notes: ''
  });

  // Estados para Journey Scheduler
  const [journeyPlans, setJourneyPlans] = useState([]);
  const [showAddJourneyModal, setShowAddJourneyModal] = useState(false);
  const [newJourneyPlan, setNewJourneyPlan] = useState({
    destination: '',
    travelDates: '',
    activities: '',
    transit: '',
    total: ''
  });

  const sections = [
    { id: 'travel-planner', name: 'Travel Planner', icon: 'airplane-outline' },
    { id: 'tour-planner', name: 'Tour Planner', icon: 'map-outline' },
    { id: 'journey-scheduler', name: 'Journey Scheduler', icon: 'calendar-outline' },
    { id: 'vacation-scheduler', name: 'Vacation Scheduler', icon: 'sunny-outline' },
    { id: 'trip-organizer', name: 'Trip Organizer', icon: 'bag-outline' }
  ];

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
              size={18} 
              color={activeSection === section.id ? '#FFFFFF' : '#6c757d'} 
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const openAddTravelModal = () => {
    setNewTravelPlan({
      date: '',
      destination: '',
      clothing: [],
      items: [],
      personalCare: [],
      documents: [],
      essentials: [],
      shoes: [],
      devices: [],
      reminders: []
    });
    setShowAddTravelModal(true);
  };

  const closeAddTravelModal = () => {
    setShowAddTravelModal(false);
  };

  const saveTravelPlan = () => {
    if (!newTravelPlan.date || !newTravelPlan.destination) {
      Alert.alert('Error', 'Por favor completa la fecha y destino');
      return;
    }

    const plan = {
      id: Date.now().toString(),
      ...newTravelPlan,
      createdAt: new Date().toISOString()
    };

    setTravelPlans([...travelPlans, plan]);
    setShowAddTravelModal(false);
  };

  const openAddTourModal = () => {
    setNewTourPlan({
      date: '',
      day: '',
      destination: '',
      sites: [],
      breakfast: '',
      lunch: '',
      dinner: '',
      other: '',
      notes: ''
    });
    setShowAddTourModal(true);
  };

  const closeAddTourModal = () => {
    setShowAddTourModal(false);
  };

  const saveTourPlan = () => {
    if (!newTourPlan.date || !newTourPlan.destination) {
      Alert.alert('Error', 'Por favor completa la fecha y destino');
      return;
    }

    const plan = {
      id: Date.now().toString(),
      ...newTourPlan,
      createdAt: new Date().toISOString()
    };

    setTourPlans([...tourPlans, plan]);
    setShowAddTourModal(false);
  };

  const openAddJourneyModal = () => {
    setNewJourneyPlan({
      destination: '',
      travelDates: '',
      activities: '',
      transit: '',
      total: ''
    });
    setShowAddJourneyModal(true);
  };

  const closeAddJourneyModal = () => {
    setShowAddJourneyModal(false);
  };

  const saveJourneyPlan = () => {
    if (!newJourneyPlan.destination || !newJourneyPlan.travelDates) {
      Alert.alert('Error', 'Por favor completa el destino y fechas de viaje');
      return;
    }

    const plan = {
      id: Date.now().toString(),
      ...newJourneyPlan,
      createdAt: new Date().toISOString()
    };

    setJourneyPlans([...journeyPlans, plan]);
    setShowAddJourneyModal(false);
  };

  const renderTravelPlanner = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>TRAVEL PLANNER</Text>
        <TouchableOpacity onPress={openAddTravelModal} style={styles.addButton}>
          <Icon name="add" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {travelPlans.length === 0 ? (
        <View style={styles.emptyState}>
          <Icon name="airplane-outline" size={48} color="#E0E0E0" />
          <Text style={styles.emptyText}>No hay planes de viaje</Text>
          <Text style={styles.emptySubtext}>Toca el botón + para crear tu primer plan</Text>
        </View>
      ) : (
        <ScrollView style={styles.plansList}>
          {travelPlans.map((plan) => (
            <View key={plan.id} style={styles.planCard}>
              <View style={styles.planHeader}>
                <Text style={styles.planDestination}>{plan.destination}</Text>
                <Text style={styles.planDate}>{plan.date}</Text>
              </View>
              
              <View style={styles.planContent}>
                <View style={styles.planColumn}>
                  <Text style={styles.planSubtitle}>ROPA</Text>
                  {plan.clothing.map((item, index) => (
                    <View key={index} style={styles.checklistItem}>
                      <Icon name="square-outline" size={16} color="#6c757d" />
                      <Text style={styles.checklistText}>{item}</Text>
                    </View>
                  ))}
                  
                  <Text style={styles.planSubtitle}>DETALLES IMPORTANTES</Text>
                  {plan.reminders.map((item, index) => (
                    <Text key={index} style={styles.reminderText}>• {item}</Text>
                  ))}
                </View>

                <View style={styles.planColumn}>
                  <Text style={styles.planSubtitle}>ARTÍCULOS DE ADORNO</Text>
                  {plan.items.map((item, index) => (
                    <View key={index} style={styles.checklistItem}>
                      <Icon name="square-outline" size={16} color="#6c757d" />
                      <Text style={styles.checklistText}>{item}</Text>
                    </View>
                  ))}
                  
                  <Text style={styles.planSubtitle}>PRODUCTOS DE CUIDADO PERSONAL</Text>
                  {plan.personalCare.map((item, index) => (
                    <View key={index} style={styles.checklistItem}>
                      <Icon name="square-outline" size={16} color="#6c757d" />
                      <Text style={styles.checklistText}>{item}</Text>
                    </View>
                  ))}
                  
                  <Text style={styles.planSubtitle}>DOCUMENTOS</Text>
                  {plan.documents.map((item, index) => (
                    <View key={index} style={styles.checklistItem}>
                      <Icon name="square-outline" size={16} color="#6c757d" />
                      <Text style={styles.checklistText}>{item}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.planColumn}>
                  <Text style={styles.planSubtitle}>DESTINO</Text>
                  <Text style={styles.destinationText}>{plan.destination}</Text>
                  
                  <Text style={styles.planSubtitle}>ARTÍCULOS ESENCIALES</Text>
                  {plan.essentials.map((item, index) => (
                    <View key={index} style={styles.checklistItem}>
                      <Icon name="square-outline" size={16} color="#6c757d" />
                      <Text style={styles.checklistText}>{item}</Text>
                    </View>
                  ))}
                  
                  <Text style={styles.planSubtitle}>ZAPATOS</Text>
                  {plan.shoes.map((item, index) => (
                    <View key={index} style={styles.checklistItem}>
                      <Icon name="square-outline" size={16} color="#6c757d" />
                      <Text style={styles.checklistText}>{item}</Text>
                    </View>
                  ))}
                  
                  <Text style={styles.planSubtitle}>DISPOSITIVOS Y GADGETS</Text>
                  {plan.devices.map((item, index) => (
                    <View key={index} style={styles.checklistItem}>
                      <Icon name="square-outline" size={16} color="#6c757d" />
                      <Text style={styles.checklistText}>{item}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );

  const renderTourPlanner = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>TOUR PLANNER</Text>
        <TouchableOpacity onPress={openAddTourModal} style={styles.addButton}>
          <Icon name="add" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {tourPlans.length === 0 ? (
        <View style={styles.emptyState}>
          <Icon name="map-outline" size={48} color="#E0E0E0" />
          <Text style={styles.emptyText}>No hay tours planificados</Text>
          <Text style={styles.emptySubtext}>Toca el botón + para crear tu primer tour</Text>
        </View>
      ) : (
        <ScrollView style={styles.plansList}>
          {tourPlans.map((plan) => (
            <View key={plan.id} style={styles.planCard}>
              <View style={styles.planHeader}>
                <Text style={styles.planDestination}>{plan.destination}</Text>
                <Text style={styles.planDate}>{plan.date} - {plan.day}</Text>
              </View>
              
              <View style={styles.tourContent}>
                <View style={styles.timeSlots}>
                  <Text style={styles.timeSlot}>7 am</Text>
                  <Text style={styles.timeSlot}>8 am</Text>
                  <Text style={styles.timeSlot}>9 am</Text>
                  <Text style={styles.timeSlot}>10 am</Text>
                  <Text style={styles.timeSlot}>11 am</Text>
                  <Text style={styles.timeSlot}>12 pm</Text>
                  <Text style={styles.timeSlot}>1 pm</Text>
                  <Text style={styles.timeSlot}>2 pm</Text>
                  <Text style={styles.timeSlot}>3 pm</Text>
                  <Text style={styles.timeSlot}>4 pm</Text>
                  <Text style={styles.timeSlot}>5 pm</Text>
                  <Text style={styles.timeSlot}>6 pm</Text>
                  <Text style={styles.timeSlot}>7 pm</Text>
                  <Text style={styles.timeSlot}>8 pm</Text>
                  <Text style={styles.timeSlot}>9 pm</Text>
                  <Text style={styles.timeSlot}>10 pm</Text>
                  <Text style={styles.timeSlot}>11 pm</Text>
                </View>
                
                <View style={styles.tourDetails}>
                  <Text style={styles.planSubtitle}>SITIOS A EXPLORAR</Text>
                  {plan.sites.map((site, index) => (
                    <Text key={index} style={styles.siteText}>• {site}</Text>
                  ))}
                  
                  <Text style={styles.planSubtitle}>LUGARES DE COMIDA</Text>
                  <View style={styles.mealSection}>
                    <Text style={styles.mealLabel}>Desayuno: {plan.breakfast}</Text>
                    <Text style={styles.mealLabel}>Almuerzo: {plan.lunch}</Text>
                    <Text style={styles.mealLabel}>Cena: {plan.dinner}</Text>
                    <Text style={styles.mealLabel}>Otro: {plan.other}</Text>
                  </View>
                  
                  <Text style={styles.planSubtitle}>NOTAS</Text>
                  <Text style={styles.notesText}>{plan.notes}</Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );

  const renderJourneyScheduler = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>JOURNEY SCHEDULER</Text>
        <TouchableOpacity onPress={openAddJourneyModal} style={styles.addButton}>
          <Icon name="add" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {journeyPlans.length === 0 ? (
        <View style={styles.emptyState}>
          <Icon name="calendar-outline" size={48} color="#E0E0E0" />
          <Text style={styles.emptyText}>No hay viajes programados</Text>
          <Text style={styles.emptySubtext}>Toca el botón + para programar tu primer viaje</Text>
        </View>
      ) : (
        <ScrollView style={styles.plansList}>
          {journeyPlans.map((plan) => (
            <View key={plan.id} style={styles.planCard}>
              <View style={styles.journeyTable}>
                <View style={styles.tableRow}>
                  <Text style={styles.tableHeader}>Destino</Text>
                  <Text style={styles.tableHeader}>Fechas de Viaje</Text>
                  <Text style={styles.tableHeader}>Actividades</Text>
                  <Text style={styles.tableHeader}>Tránsito</Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={styles.tableCell}>{plan.destination}</Text>
                  <Text style={styles.tableCell}>{plan.travelDates}</Text>
                  <Text style={styles.tableCell}>{plan.activities}</Text>
                  <Text style={styles.tableCell}>{plan.transit}</Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={styles.totalCell}>Total</Text>
                  <Text style={styles.totalCell}>{plan.total}</Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );

  const renderVacationScheduler = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>VACATION SCHEDULER</Text>
        <TouchableOpacity style={styles.addButton}>
          <Icon name="add" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.placeholderContent}>
        <Icon name="sunny-outline" size={48} color="#E0E0E0" />
        <Text style={styles.emptyText}>Próximamente</Text>
        <Text style={styles.emptySubtext}>Esta funcionalidad estará disponible pronto</Text>
      </View>
    </View>
  );

  const renderTripOrganizer = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>TRIP ORGANIZER</Text>
        <TouchableOpacity style={styles.addButton}>
          <Icon name="add" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.placeholderContent}>
        <Icon name="bag-outline" size={48} color="#E0E0E0" />
        <Text style={styles.emptyText}>Próximamente</Text>
        <Text style={styles.emptySubtext}>Esta funcionalidad estará disponible pronto</Text>
      </View>
    </View>
  );

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'travel-planner':
        return renderTravelPlanner();
      case 'tour-planner':
        return renderTourPlanner();
      case 'journey-scheduler':
        return renderJourneyScheduler();
      case 'vacation-scheduler':
        return renderVacationScheduler();
      case 'trip-organizer':
        return renderTripOrganizer();
      default:
        return renderTravelPlanner();
    }
  };

  return (
    <View style={styles.container}>
      {/* Navegación de pestañas */}
      {renderSectionTabs()}

      {/* Contenido de la sección activa */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderActiveSection()}
      </ScrollView>

      {/* Modal para agregar Travel Plan */}
      <Modal
        visible={showAddTravelModal}
        animationType="slide"
        transparent={true}
        onRequestClose={closeAddTravelModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nuevo Plan de Viaje</Text>
              <TouchableOpacity onPress={closeAddTravelModal}>
                <Icon name="close" size={24} color="#6c757d" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Fecha</Text>
                <TextInput
                  style={styles.textInput}
                  value={newTravelPlan.date}
                  onChangeText={(text) => setNewTravelPlan({...newTravelPlan, date: text})}
                  placeholder="DD/MM/YYYY"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Destino</Text>
                <TextInput
                  style={styles.textInput}
                  value={newTravelPlan.destination}
                  onChangeText={(text) => setNewTravelPlan({...newTravelPlan, destination: text})}
                  placeholder="Ciudad, País"
                />
              </View>
            </ScrollView>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity onPress={closeAddTravelModal} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={saveTravelPlan} style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal para agregar Tour Plan */}
      <Modal
        visible={showAddTourModal}
        animationType="slide"
        transparent={true}
        onRequestClose={closeAddTourModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nuevo Tour</Text>
              <TouchableOpacity onPress={closeAddTourModal}>
                <Icon name="close" size={24} color="#6c757d" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Fecha</Text>
                <TextInput
                  style={styles.textInput}
                  value={newTourPlan.date}
                  onChangeText={(text) => setNewTourPlan({...newTourPlan, date: text})}
                  placeholder="DD/MM/YYYY"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Día</Text>
                <TextInput
                  style={styles.textInput}
                  value={newTourPlan.day}
                  onChangeText={(text) => setNewTourPlan({...newTourPlan, day: text})}
                  placeholder="Día 1, Día 2, etc."
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Destino</Text>
                <TextInput
                  style={styles.textInput}
                  value={newTourPlan.destination}
                  onChangeText={(text) => setNewTourPlan({...newTourPlan, destination: text})}
                  placeholder="Ciudad, País"
                />
              </View>
            </ScrollView>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity onPress={closeAddTourModal} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={saveTourPlan} style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal para agregar Journey Plan */}
      <Modal
        visible={showAddJourneyModal}
        animationType="slide"
        transparent={true}
        onRequestClose={closeAddJourneyModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nuevo Viaje</Text>
              <TouchableOpacity onPress={closeAddJourneyModal}>
                <Icon name="close" size={24} color="#6c757d" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Destino</Text>
                <TextInput
                  style={styles.textInput}
                  value={newJourneyPlan.destination}
                  onChangeText={(text) => setNewJourneyPlan({...newJourneyPlan, destination: text})}
                  placeholder="Ciudad, País"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Fechas de Viaje</Text>
                <TextInput
                  style={styles.textInput}
                  value={newJourneyPlan.travelDates}
                  onChangeText={(text) => setNewJourneyPlan({...newJourneyPlan, travelDates: text})}
                  placeholder="DD/MM/YYYY - DD/MM/YYYY"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Actividades</Text>
                <TextInput
                  style={styles.textInput}
                  value={newJourneyPlan.activities}
                  onChangeText={(text) => setNewJourneyPlan({...newJourneyPlan, activities: text})}
                  placeholder="Actividades principales"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Tránsito</Text>
                <TextInput
                  style={styles.textInput}
                  value={newJourneyPlan.transit}
                  onChangeText={(text) => setNewJourneyPlan({...newJourneyPlan, transit: text})}
                  placeholder="Medio de transporte"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Total</Text>
                <TextInput
                  style={styles.textInput}
                  value={newJourneyPlan.total}
                  onChangeText={(text) => setNewJourneyPlan({...newJourneyPlan, total: text})}
                  placeholder="Costo total"
                />
              </View>
            </ScrollView>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity onPress={closeAddJourneyModal} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={saveJourneyPlan} style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Guardar</Text>
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
  },
  tabsScroll: {
    paddingHorizontal: 16,
  },
  tab: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginVertical: 8,
  },
  activeTab: {
    backgroundColor: '#FFEAA7',
    borderColor: '#FFEAA7',
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d4150',
  },
  addButton: {
    backgroundColor: '#FFEAA7',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#6c757d',
    marginTop: 12,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#adb5bd',
    marginTop: 4,
    textAlign: 'center',
  },
  placeholderContent: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  plansList: {
    maxHeight: 400,
  },
  planCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
  planDestination: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d4150',
  },
  planDate: {
    fontSize: 14,
    color: '#6c757d',
  },
  planContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  planColumn: {
    flex: 1,
    marginHorizontal: 4,
  },
  planSubtitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#495057',
    marginTop: 8,
    marginBottom: 4,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  checklistText: {
    fontSize: 12,
    color: '#6c757d',
    marginLeft: 6,
  },
  reminderText: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 2,
  },
  destinationText: {
    fontSize: 12,
    color: '#2d4150',
    fontWeight: '500',
  },
  tourContent: {
    flexDirection: 'row',
  },
  timeSlots: {
    width: 60,
    marginRight: 12,
  },
  timeSlot: {
    fontSize: 10,
    color: '#6c757d',
    marginBottom: 8,
    textAlign: 'center',
  },
  tourDetails: {
    flex: 1,
  },
  siteText: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 2,
  },
  mealSection: {
    marginBottom: 8,
  },
  mealLabel: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 2,
  },
  notesText: {
    fontSize: 12,
    color: '#6c757d',
    fontStyle: 'italic',
  },
  journeyTable: {
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 4,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
  tableHeader: {
    flex: 1,
    padding: 8,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2d4150',
    backgroundColor: '#f8f9fa',
    textAlign: 'center',
  },
  tableCell: {
    flex: 1,
    padding: 8,
    fontSize: 12,
    color: '#6c757d',
    textAlign: 'center',
  },
  totalCell: {
    flex: 1,
    padding: 8,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2d4150',
    backgroundColor: '#e9ecef',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    width: '90%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d4150',
  },
  modalBody: {
    padding: 16,
    maxHeight: 400,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#495057',
    marginBottom: 6,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 6,
    padding: 12,
    fontSize: 14,
    color: '#495057',
    backgroundColor: '#ffffff',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    marginRight: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ced4da',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    color: '#6c757d',
    fontWeight: '500',
  },
  saveButton: {
    flex: 1,
    padding: 12,
    marginLeft: 8,
    borderRadius: 6,
    backgroundColor: '#FFEAA7',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 14,
    color: '#2d4150',
    fontWeight: '600',
  },
});

export default TravelSections;
