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

const PetSections = () => {
  const [activeSection, setActiveSection] = useState('pet-care-planner');
  
  // Estados para Pet Care Planner
  const [petCarePlans, setPetCarePlans] = useState([]);
  const [showAddPetCareModal, setShowAddPetCareModal] = useState(false);
  const [newPetCarePlan, setNewPetCarePlan] = useState({
    petName: '',
    ownerName: '',
    date: '',
    meals: { morning: '', evening: '' },
    treats: '',
    dayRating: '',
    outdoorTime: [],
    bedtime: [],
    toiletAccess: [],
    favoriteThings: [],
    activities: [],
    insurance: '',
    notes: ''
  });

  // Estados para Puppy Planner
  const [puppyPlans, setPuppyPlans] = useState([]);
  const [showAddPuppyModal, setShowAddPuppyModal] = useState(false);
  const [newPuppyPlan, setNewPuppyPlan] = useState({
    ownerName: '',
    phone: '',
    address: '',
    emergencyContact: '',
    localVet: '',
    vetPhoto: '',
    emergencyVet: '',
    emergencyVetPhone: '',
    puppyName: '',
    breed: '',
    age: '',
    sex: '',
    microchipped: '',
    needsMedicine: '',
    morningActivity: '',
    afternoonActivity: '',
    eveningActivity: '',
    behaviors: [],
    notes: ''
  });

  // Estados para Pet Wellness Scheduler
  const [wellnessPlans, setWellnessPlans] = useState([]);
  const [showAddWellnessModal, setShowAddWellnessModal] = useState(false);
  const [newWellnessPlan, setNewWellnessPlan] = useState({
    petName: '',
    birth: '',
    coat: '',
    petOwner: '',
    clinic: '',
    veterinarian: '',
    personality: '',
    markings: '',
    favoriteThings: '',
    medicineAllergies: '',
    dailyRoutine: '',
    vaccinations: []
  });

  // Estados para Animal Organizer
  const [animalOrganizers, setAnimalOrganizers] = useState([]);
  const [showAddOrganizerModal, setShowAddOrganizerModal] = useState(false);
  const [newOrganizer, setNewOrganizer] = useState({
    name: '',
    birth: '',
    breed: '',
    adoptionDate: '',
    gender: '',
    microchip: '',
    coat: '',
    markings: '',
    vetName: '',
    contactNumber: '',
    foodAllergies: '',
    medicalAllergies: '',
    favoriteToy: '',
    favoriteTreat: '',
    favoriteActivity: '',
    favoriteFood: '',
    chores: {
      washBowls: [false, false, false, false, false, false, false],
      refillWater: [false, false, false, false, false, false, false],
      refillFood: [false, false, false, false, false, false, false],
      exercise: [false, false, false, false, false, false, false],
      grooming: [false, false, false, false, false, false, false],
      removeWaste: [false, false, false, false, false, false, false],
      offerSnack: [false, false, false, false, false, false, false]
    },
    reminders: '',
    notes: ''
  });

  const sections = [
    { id: 'pet-care-planner', name: 'Pet Care Planner', icon: 'paw-outline' },
    { id: 'puppy-planner', name: 'Puppy Planner', icon: 'heart-outline' },
    { id: 'wellness-scheduler', name: 'Wellness Scheduler', icon: 'medical-outline' },
    { id: 'animal-organizer', name: 'Animal Organizer', icon: 'list-outline' },
    { id: 'pet-schedule', name: 'Pet Schedule', icon: 'calendar-outline' }
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

  const openAddPetCareModal = () => {
    setNewPetCarePlan({
      petName: '',
      ownerName: '',
      date: '',
      meals: { morning: '', evening: '' },
      treats: '',
      dayRating: '',
      outdoorTime: [],
      bedtime: [],
      toiletAccess: [],
      favoriteThings: [],
      activities: [],
      insurance: '',
      notes: ''
    });
    setShowAddPetCareModal(true);
  };

  const closeAddPetCareModal = () => {
    setShowAddPetCareModal(false);
  };

  const savePetCarePlan = () => {
    if (!newPetCarePlan.petName || !newPetCarePlan.ownerName) {
      Alert.alert('Error', 'Por favor completa el nombre de la mascota y el dueño');
      return;
    }

    const plan = {
      id: Date.now().toString(),
      ...newPetCarePlan,
      createdAt: new Date().toISOString()
    };

    setPetCarePlans([...petCarePlans, plan]);
    setShowAddPetCareModal(false);
  };

  const openAddPuppyModal = () => {
    setNewPuppyPlan({
      ownerName: '',
      phone: '',
      address: '',
      emergencyContact: '',
      localVet: '',
      vetPhoto: '',
      emergencyVet: '',
      emergencyVetPhone: '',
      puppyName: '',
      breed: '',
      age: '',
      sex: '',
      microchipped: '',
      needsMedicine: '',
      morningActivity: '',
      afternoonActivity: '',
      eveningActivity: '',
      behaviors: [],
      notes: ''
    });
    setShowAddPuppyModal(true);
  };

  const closeAddPuppyModal = () => {
    setShowAddPuppyModal(false);
  };

  const savePuppyPlan = () => {
    if (!newPuppyPlan.puppyName || !newPuppyPlan.ownerName) {
      Alert.alert('Error', 'Por favor completa el nombre del cachorro y el dueño');
      return;
    }

    const plan = {
      id: Date.now().toString(),
      ...newPuppyPlan,
      createdAt: new Date().toISOString()
    };

    setPuppyPlans([...puppyPlans, plan]);
    setShowAddPuppyModal(false);
  };

  const openAddWellnessModal = () => {
    setNewWellnessPlan({
      petName: '',
      birth: '',
      coat: '',
      petOwner: '',
      clinic: '',
      veterinarian: '',
      personality: '',
      markings: '',
      favoriteThings: '',
      medicineAllergies: '',
      dailyRoutine: '',
      vaccinations: []
    });
    setShowAddWellnessModal(true);
  };

  const closeAddWellnessModal = () => {
    setShowAddWellnessModal(false);
  };

  const saveWellnessPlan = () => {
    if (!newWellnessPlan.petName || !newWellnessPlan.petOwner) {
      Alert.alert('Error', 'Por favor completa el nombre de la mascota y el dueño');
      return;
    }

    const plan = {
      id: Date.now().toString(),
      ...newWellnessPlan,
      createdAt: new Date().toISOString()
    };

    setWellnessPlans([...wellnessPlans, plan]);
    setShowAddWellnessModal(false);
  };

  const openAddOrganizerModal = () => {
    setNewOrganizer({
      name: '',
      birth: '',
      breed: '',
      adoptionDate: '',
      gender: '',
      microchip: '',
      coat: '',
      markings: '',
      vetName: '',
      contactNumber: '',
      foodAllergies: '',
      medicalAllergies: '',
      favoriteToy: '',
      favoriteTreat: '',
      favoriteActivity: '',
      favoriteFood: '',
      chores: {
        washBowls: [false, false, false, false, false, false, false],
        refillWater: [false, false, false, false, false, false, false],
        refillFood: [false, false, false, false, false, false, false],
        exercise: [false, false, false, false, false, false, false],
        grooming: [false, false, false, false, false, false, false],
        removeWaste: [false, false, false, false, false, false, false],
        offerSnack: [false, false, false, false, false, false, false]
      },
      reminders: '',
      notes: ''
    });
    setShowAddOrganizerModal(true);
  };

  const closeAddOrganizerModal = () => {
    setShowAddOrganizerModal(false);
  };

  const saveOrganizer = () => {
    if (!newOrganizer.name) {
      Alert.alert('Error', 'Por favor completa el nombre de la mascota');
      return;
    }

    const organizer = {
      id: Date.now().toString(),
      ...newOrganizer,
      createdAt: new Date().toISOString()
    };

    setAnimalOrganizers([...animalOrganizers, organizer]);
    setShowAddOrganizerModal(false);
  };

  const renderPetCarePlanner = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>PET CARE PLANNER</Text>
        <TouchableOpacity onPress={openAddPetCareModal} style={styles.addButton}>
          <Icon name="add" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {petCarePlans.length === 0 ? (
        <View style={styles.emptyState}>
          <Icon name="paw-outline" size={48} color="#E0E0E0" />
          <Text style={styles.emptyText}>No hay planes de cuidado</Text>
          <Text style={styles.emptySubtext}>Toca el botón + para crear tu primer plan</Text>
        </View>
      ) : (
        <ScrollView style={styles.plansList}>
          {petCarePlans.map((plan) => (
            <View key={plan.id} style={styles.planCard}>
              <View style={styles.planHeader}>
                <Text style={styles.planPetName}>{plan.petName}</Text>
                <Text style={styles.planDate}>{plan.date}</Text>
              </View>
              
              <View style={styles.petCareContent}>
                <View style={styles.petCareColumn}>
                  <Text style={styles.petCareSubtitle}>COMIDAS</Text>
                  <View style={styles.mealSection}>
                    <Text style={styles.mealLabel}>Mañana: {plan.meals.morning}</Text>
                    <Text style={styles.mealLabel}>Noche: {plan.meals.evening}</Text>
                  </View>
                  
                  <Text style={styles.petCareSubtitle}>PREMIO</Text>
                  <Text style={styles.treatText}>{plan.treats}</Text>
                  
                  <Text style={styles.petCareSubtitle}>NUESTRO DÍA FUE</Text>
                  <Text style={styles.dayRating}>{plan.dayRating}</Text>
                </View>

                <View style={styles.petCareColumn}>
                  <Text style={styles.petCareSubtitle}>TIEMPO AL AIRE LIBRE</Text>
                  {plan.outdoorTime.map((time, index) => (
                    <Text key={index} style={styles.timeText}>• {time}</Text>
                  ))}
                  
                  <Text style={styles.petCareSubtitle}>HORA DE DORMIR</Text>
                  {plan.bedtime.map((time, index) => (
                    <Text key={index} style={styles.timeText}>• {time}</Text>
                  ))}
                </View>

                <View style={styles.petCareColumn}>
                  <Text style={styles.petCareSubtitle}>ACCESORIO DE BAÑO</Text>
                  {plan.toiletAccess.map((access, index) => (
                    <Text key={index} style={styles.accessText}>• {access}</Text>
                  ))}
                  
                  <Text style={styles.petCareSubtitle}>COSAS FAVORITAS</Text>
                  {plan.favoriteThings.map((thing, index) => (
                    <Text key={index} style={styles.favoriteText}>• {thing}</Text>
                  ))}
                </View>
              </View>
              
              <View style={styles.notesSection}>
                <Text style={styles.petCareSubtitle}>NOTAS</Text>
                <Text style={styles.notesText}>{plan.notes}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );

  const renderPuppyPlanner = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>PUPPY PLANNER</Text>
        <TouchableOpacity onPress={openAddPuppyModal} style={styles.addButton}>
          <Icon name="add" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {puppyPlans.length === 0 ? (
        <View style={styles.emptyState}>
          <Icon name="heart-outline" size={48} color="#E0E0E0" />
          <Text style={styles.emptyText}>No hay planes de cachorro</Text>
          <Text style={styles.emptySubtext}>Toca el botón + para crear tu primer plan</Text>
        </View>
      ) : (
        <ScrollView style={styles.plansList}>
          {puppyPlans.map((plan) => (
            <View key={plan.id} style={styles.planCard}>
              <View style={styles.planHeader}>
                <Text style={styles.planPetName}>{plan.puppyName}</Text>
                <Text style={styles.planDate}>{plan.breed} - {plan.age}</Text>
              </View>
              
              <View style={styles.puppyContent}>
                <View style={styles.puppyColumn}>
                  <Text style={styles.puppySubtitle}>INFORMACIÓN DEL DUEÑO</Text>
                  <Text style={styles.infoText}>Nombre: {plan.ownerName}</Text>
                  <Text style={styles.infoText}>Teléfono: {plan.phone}</Text>
                  <Text style={styles.infoText}>Dirección: {plan.address}</Text>
                  <Text style={styles.infoText}>Contacto de emergencia: {plan.emergencyContact}</Text>
                  
                  <Text style={styles.puppySubtitle}>VETERINARIO</Text>
                  <Text style={styles.infoText}>Veterinario local: {plan.localVet}</Text>
                  <Text style={styles.infoText}>Veterinario de emergencia: {plan.emergencyVet}</Text>
                  <Text style={styles.infoText}>Teléfono: {plan.emergencyVetPhone}</Text>
                </View>

                <View style={styles.puppyColumn}>
                  <Text style={styles.puppySubtitle}>INFORMACIÓN DEL CACHORRO</Text>
                  <Text style={styles.infoText}>Nombre: {plan.puppyName}</Text>
                  <Text style={styles.infoText}>Raza: {plan.breed}</Text>
                  <Text style={styles.infoText}>Edad: {plan.age}</Text>
                  <Text style={styles.infoText}>Sexo: {plan.sex}</Text>
                  <Text style={styles.infoText}>Microchip: {plan.microchipped}</Text>
                  <Text style={styles.infoText}>Necesita medicina: {plan.needsMedicine}</Text>
                  
                  <Text style={styles.puppySubtitle}>ACTIVIDADES DIARIAS</Text>
                  <Text style={styles.activityText}>Mañana: {plan.morningActivity}</Text>
                  <Text style={styles.activityText}>Tarde: {plan.afternoonActivity}</Text>
                  <Text style={styles.activityText}>Noche: {plan.eveningActivity}</Text>
                </View>
              </View>
              
              <View style={styles.notesSection}>
                <Text style={styles.puppySubtitle}>NOTAS</Text>
                <Text style={styles.notesText}>{plan.notes}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );

  const renderWellnessScheduler = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>PET WELLNESS SCHEDULER</Text>
        <TouchableOpacity onPress={openAddWellnessModal} style={styles.addButton}>
          <Icon name="add" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {wellnessPlans.length === 0 ? (
        <View style={styles.emptyState}>
          <Icon name="medical-outline" size={48} color="#E0E0E0" />
          <Text style={styles.emptyText}>No hay planes de bienestar</Text>
          <Text style={styles.emptySubtext}>Toca el botón + para crear tu primer plan</Text>
        </View>
      ) : (
        <ScrollView style={styles.plansList}>
          {wellnessPlans.map((plan) => (
            <View key={plan.id} style={styles.planCard}>
              <View style={styles.planHeader}>
                <Text style={styles.planPetName}>{plan.petName}</Text>
                <Text style={styles.planDate}>{plan.birth}</Text>
              </View>
              
              <View style={styles.wellnessContent}>
                <View style={styles.wellnessColumn}>
                  <Text style={styles.wellnessSubtitle}>INFORMACIÓN DE LA MASCOTA</Text>
                  <Text style={styles.infoText}>Nombre: {plan.petName}</Text>
                  <Text style={styles.infoText}>Nacimiento: {plan.birth}</Text>
                  <Text style={styles.infoText}>Pelaje: {plan.coat}</Text>
                  <Text style={styles.infoText}>Dueño: {plan.petOwner}</Text>
                  
                  <Text style={styles.wellnessSubtitle}>CLÍNICA</Text>
                  <Text style={styles.infoText}>Clínica: {plan.clinic}</Text>
                  <Text style={styles.infoText}>Veterinario: {plan.veterinarian}</Text>
                </View>

                <View style={styles.wellnessColumn}>
                  <Text style={styles.wellnessSubtitle}>DETALLES DE CUIDADO</Text>
                  <Text style={styles.infoText}>Personalidad: {plan.personality}</Text>
                  <Text style={styles.infoText}>Marcas distintivas: {plan.markings}</Text>
                  <Text style={styles.infoText}>Cosas favoritas: {plan.favoriteThings}</Text>
                  <Text style={styles.infoText}>Medicinas y alergias: {plan.medicineAllergies}</Text>
                  
                  <Text style={styles.wellnessSubtitle}>RUTINA DIARIA</Text>
                  <Text style={styles.routineText}>{plan.dailyRoutine}</Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );

  const renderAnimalOrganizer = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>ANIMAL ORGANIZER</Text>
        <TouchableOpacity onPress={openAddOrganizerModal} style={styles.addButton}>
          <Icon name="add" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {animalOrganizers.length === 0 ? (
        <View style={styles.emptyState}>
          <Icon name="list-outline" size={48} color="#E0E0E0" />
          <Text style={styles.emptyText}>No hay organizadores</Text>
          <Text style={styles.emptySubtext}>Toca el botón + para crear tu primer organizador</Text>
        </View>
      ) : (
        <ScrollView style={styles.plansList}>
          {animalOrganizers.map((organizer) => (
            <View key={organizer.id} style={styles.planCard}>
              <View style={styles.planHeader}>
                <Text style={styles.planPetName}>{organizer.name}</Text>
                <Text style={styles.planDate}>{organizer.breed}</Text>
              </View>
              
              <View style={styles.organizerContent}>
                <View style={styles.organizerColumn}>
                  <Text style={styles.organizerSubtitle}>PERFIL</Text>
                  <Text style={styles.infoText}>Nombre: {organizer.name}</Text>
                  <Text style={styles.infoText}>Nacimiento: {organizer.birth}</Text>
                  <Text style={styles.infoText}>Raza: {organizer.breed}</Text>
                  <Text style={styles.infoText}>Fecha de adopción: {organizer.adoptionDate}</Text>
                  <Text style={styles.infoText}>Género: {organizer.gender}</Text>
                  <Text style={styles.infoText}>Microchip: {organizer.microchip}</Text>
                  <Text style={styles.infoText}>Pelaje: {organizer.coat}</Text>
                  <Text style={styles.infoText}>Marcas: {organizer.markings}</Text>
                  
                  <Text style={styles.organizerSubtitle}>INFORMACIÓN MÉDICA</Text>
                  <Text style={styles.infoText}>Veterinario: {organizer.vetName}</Text>
                  <Text style={styles.infoText}>Teléfono: {organizer.contactNumber}</Text>
                  <Text style={styles.infoText}>Alergias alimentarias: {organizer.foodAllergies}</Text>
                  <Text style={styles.infoText}>Alergias médicas: {organizer.medicalAllergies}</Text>
                </View>

                <View style={styles.organizerColumn}>
                  <Text style={styles.organizerSubtitle}>INFORMACIÓN GENERAL</Text>
                  <Text style={styles.infoText}>Juguete favorito: {organizer.favoriteToy}</Text>
                  <Text style={styles.infoText}>Premio favorito: {organizer.favoriteTreat}</Text>
                  <Text style={styles.infoText}>Actividad favorita: {organizer.favoriteActivity}</Text>
                  <Text style={styles.infoText}>Comida favorita: {organizer.favoriteFood}</Text>
                  
                  <Text style={styles.organizerSubtitle}>TAREAS</Text>
                  <View style={styles.choresList}>
                    <Text style={styles.choreText}>• Lavar tazones</Text>
                    <Text style={styles.choreText}>• Llenar agua</Text>
                    <Text style={styles.choreText}>• Llenar comida</Text>
                    <Text style={styles.choreText}>• Ejercicio/Juego</Text>
                    <Text style={styles.choreText}>• Aseo</Text>
                    <Text style={styles.choreText}>• Limpiar desechos</Text>
                    <Text style={styles.choreText}>• Ofrecer premio</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.notesSection}>
                <Text style={styles.organizerSubtitle}>RECORDATORIOS</Text>
                <Text style={styles.notesText}>{organizer.reminders}</Text>
                
                <Text style={styles.organizerSubtitle}>NOTAS</Text>
                <Text style={styles.notesText}>{organizer.notes}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );

  const renderPetSchedule = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>PET SCHEDULE</Text>
        <TouchableOpacity style={styles.addButton}>
          <Icon name="add" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.placeholderContent}>
        <Icon name="calendar-outline" size={48} color="#E0E0E0" />
        <Text style={styles.emptyText}>Próximamente</Text>
        <Text style={styles.emptySubtext}>Esta funcionalidad estará disponible pronto</Text>
      </View>
    </View>
  );

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'pet-care-planner':
        return renderPetCarePlanner();
      case 'puppy-planner':
        return renderPuppyPlanner();
      case 'wellness-scheduler':
        return renderWellnessScheduler();
      case 'animal-organizer':
        return renderAnimalOrganizer();
      case 'pet-schedule':
        return renderPetSchedule();
      default:
        return renderPetCarePlanner();
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

      {/* Modal para agregar Pet Care Plan */}
      <Modal
        visible={showAddPetCareModal}
        animationType="slide"
        transparent={true}
        onRequestClose={closeAddPetCareModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nuevo Plan de Cuidado</Text>
              <TouchableOpacity onPress={closeAddPetCareModal}>
                <Icon name="close" size={24} color="#6c757d" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nombre de la Mascota</Text>
                <TextInput
                  style={styles.textInput}
                  value={newPetCarePlan.petName}
                  onChangeText={(text) => setNewPetCarePlan({...newPetCarePlan, petName: text})}
                  placeholder="Nombre de la mascota"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nombre del Dueño</Text>
                <TextInput
                  style={styles.textInput}
                  value={newPetCarePlan.ownerName}
                  onChangeText={(text) => setNewPetCarePlan({...newPetCarePlan, ownerName: text})}
                  placeholder="Nombre del dueño"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Fecha</Text>
                <TextInput
                  style={styles.textInput}
                  value={newPetCarePlan.date}
                  onChangeText={(text) => setNewPetCarePlan({...newPetCarePlan, date: text})}
                  placeholder="DD/MM/YYYY"
                />
              </View>
            </ScrollView>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity onPress={closeAddPetCareModal} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={savePetCarePlan} style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal para agregar Puppy Plan */}
      <Modal
        visible={showAddPuppyModal}
        animationType="slide"
        transparent={true}
        onRequestClose={closeAddPuppyModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nuevo Plan de Cachorro</Text>
              <TouchableOpacity onPress={closeAddPuppyModal}>
                <Icon name="close" size={24} color="#6c757d" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nombre del Cachorro</Text>
                <TextInput
                  style={styles.textInput}
                  value={newPuppyPlan.puppyName}
                  onChangeText={(text) => setNewPuppyPlan({...newPuppyPlan, puppyName: text})}
                  placeholder="Nombre del cachorro"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nombre del Dueño</Text>
                <TextInput
                  style={styles.textInput}
                  value={newPuppyPlan.ownerName}
                  onChangeText={(text) => setNewPuppyPlan({...newPuppyPlan, ownerName: text})}
                  placeholder="Nombre del dueño"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Raza</Text>
                <TextInput
                  style={styles.textInput}
                  value={newPuppyPlan.breed}
                  onChangeText={(text) => setNewPuppyPlan({...newPuppyPlan, breed: text})}
                  placeholder="Raza del cachorro"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Edad</Text>
                <TextInput
                  style={styles.textInput}
                  value={newPuppyPlan.age}
                  onChangeText={(text) => setNewPuppyPlan({...newPuppyPlan, age: text})}
                  placeholder="Edad del cachorro"
                />
              </View>
            </ScrollView>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity onPress={closeAddPuppyModal} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={savePuppyPlan} style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal para agregar Wellness Plan */}
      <Modal
        visible={showAddWellnessModal}
        animationType="slide"
        transparent={true}
        onRequestClose={closeAddWellnessModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nuevo Plan de Bienestar</Text>
              <TouchableOpacity onPress={closeAddWellnessModal}>
                <Icon name="close" size={24} color="#6c757d" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nombre de la Mascota</Text>
                <TextInput
                  style={styles.textInput}
                  value={newWellnessPlan.petName}
                  onChangeText={(text) => setNewWellnessPlan({...newWellnessPlan, petName: text})}
                  placeholder="Nombre de la mascota"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Dueño</Text>
                <TextInput
                  style={styles.textInput}
                  value={newWellnessPlan.petOwner}
                  onChangeText={(text) => setNewWellnessPlan({...newWellnessPlan, petOwner: text})}
                  placeholder="Nombre del dueño"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Fecha de Nacimiento</Text>
                <TextInput
                  style={styles.textInput}
                  value={newWellnessPlan.birth}
                  onChangeText={(text) => setNewWellnessPlan({...newWellnessPlan, birth: text})}
                  placeholder="DD/MM/YYYY"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Clínica</Text>
                <TextInput
                  style={styles.textInput}
                  value={newWellnessPlan.clinic}
                  onChangeText={(text) => setNewWellnessPlan({...newWellnessPlan, clinic: text})}
                  placeholder="Nombre de la clínica"
                />
              </View>
            </ScrollView>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity onPress={closeAddWellnessModal} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={saveWellnessPlan} style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal para agregar Animal Organizer */}
      <Modal
        visible={showAddOrganizerModal}
        animationType="slide"
        transparent={true}
        onRequestClose={closeAddOrganizerModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nuevo Organizador</Text>
              <TouchableOpacity onPress={closeAddOrganizerModal}>
                <Icon name="close" size={24} color="#6c757d" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nombre de la Mascota</Text>
                <TextInput
                  style={styles.textInput}
                  value={newOrganizer.name}
                  onChangeText={(text) => setNewOrganizer({...newOrganizer, name: text})}
                  placeholder="Nombre de la mascota"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Raza</Text>
                <TextInput
                  style={styles.textInput}
                  value={newOrganizer.breed}
                  onChangeText={(text) => setNewOrganizer({...newOrganizer, breed: text})}
                  placeholder="Raza de la mascota"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Fecha de Nacimiento</Text>
                <TextInput
                  style={styles.textInput}
                  value={newOrganizer.birth}
                  onChangeText={(text) => setNewOrganizer({...newOrganizer, birth: text})}
                  placeholder="DD/MM/YYYY"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Género</Text>
                <TextInput
                  style={styles.textInput}
                  value={newOrganizer.gender}
                  onChangeText={(text) => setNewOrganizer({...newOrganizer, gender: text})}
                  placeholder="Macho/Hembra"
                />
              </View>
            </ScrollView>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity onPress={closeAddOrganizerModal} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={saveOrganizer} style={styles.saveButton}>
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
    backgroundColor: '#FF9F43',
    borderColor: '#FF9F43',
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
    backgroundColor: '#FF9F43',
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
  planPetName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d4150',
  },
  planDate: {
    fontSize: 14,
    color: '#6c757d',
  },
  petCareContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  petCareColumn: {
    flex: 1,
    marginHorizontal: 4,
  },
  petCareSubtitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#495057',
    marginTop: 8,
    marginBottom: 4,
  },
  mealSection: {
    marginBottom: 8,
  },
  mealLabel: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 2,
  },
  treatText: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 8,
  },
  dayRating: {
    fontSize: 12,
    color: '#2d4150',
    fontWeight: '500',
    marginBottom: 8,
  },
  timeText: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 2,
  },
  accessText: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 2,
  },
  favoriteText: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 2,
  },
  puppyContent: {
    flexDirection: 'row',
  },
  puppyColumn: {
    flex: 1,
    marginHorizontal: 4,
  },
  puppySubtitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#495057',
    marginTop: 8,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 2,
  },
  activityText: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 2,
  },
  wellnessContent: {
    flexDirection: 'row',
  },
  wellnessColumn: {
    flex: 1,
    marginHorizontal: 4,
  },
  wellnessSubtitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#495057',
    marginTop: 8,
    marginBottom: 4,
  },
  routineText: {
    fontSize: 12,
    color: '#6c757d',
    fontStyle: 'italic',
  },
  organizerContent: {
    flexDirection: 'row',
  },
  organizerColumn: {
    flex: 1,
    marginHorizontal: 4,
  },
  organizerSubtitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#495057',
    marginTop: 8,
    marginBottom: 4,
  },
  choresList: {
    marginBottom: 8,
  },
  choreText: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 2,
  },
  notesSection: {
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#dee2e6',
  },
  notesText: {
    fontSize: 12,
    color: '#6c757d',
    fontStyle: 'italic',
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
    backgroundColor: '#FF9F43',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default PetSections;
