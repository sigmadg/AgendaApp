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

  // Estados para Pet Schedule
  const [selectedDay, setSelectedDay] = useState('monday');
  const [selectedPet, setSelectedPet] = useState('1');

  const sections = [
    { id: 'pet-care-planner', name: 'Planificador de Cuidados', icon: 'paw-outline' },
    { id: 'puppy-planner', name: 'Planificador de Cachorros', icon: 'heart-outline' },
    { id: 'wellness-scheduler', name: 'Programador de Bienestar', icon: 'medical-outline' },
    { id: 'animal-organizer', name: 'Organizador de Animales', icon: 'list-outline' },
    { id: 'pet-schedule', name: 'Horario de Mascotas', icon: 'calendar-outline' }
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

  const renderPetCarePlanner = () => {
    // Datos de ejemplo para el planificador de cuidados
    const samplePetCarePlans = [
      {
        id: '1',
        petName: 'Max',
        petType: 'Perro',
        breed: 'Golden Retriever',
        age: '3 años',
        ownerName: 'María García',
        date: '15 Diciembre 2024',
        status: 'completed',
        meals: { 
          morning: 'Croquetas Premium + Agua fresca', 
          evening: 'Pollo cocido + Arroz integral' 
        },
        treats: 'Galletas de avena caseras',
        dayRating: 'Excelente',
        outdoorTime: [
          'Paseo matutino 30 min',
          'Juego en el parque 45 min',
          'Caminata nocturna 20 min'
        ],
        bedtime: [
          '22:00 - Cama en el dormitorio',
          'Rutina de relajación 10 min'
        ],
        toiletAccess: [
          'Patio trasero cada 4 horas',
          'Paseo de emergencia disponible'
        ],
        favoriteThings: [
          'Pelota de tenis',
          'Manta favorita',
          'Juguete de cuerda'
        ],
        activities: [
          'Juego de buscar la pelota',
          'Entrenamiento de obediencia',
          'Socialización con otros perros'
        ],
        health: {
          mood: 'Feliz',
          energy: 'Alta',
          appetite: 'Normal',
          sleep: '8 horas'
        },
        notes: 'Max tuvo un día muy activo. Se portó muy bien durante el entrenamiento. Recordar cepillado dental mañana.',
        photos: ['max_1.jpg', 'max_2.jpg'],
        reminders: [
          'Vacuna anual - Enero 2025',
          'Corte de uñas - Próxima semana',
          'Revisión dental - Marzo 2025'
        ]
      },
      {
        id: '2',
        petName: 'Luna',
        petType: 'Gato',
        breed: 'Siamés',
        age: '2 años',
        ownerName: 'Carlos López',
        date: '14 Diciembre 2024',
        status: 'in_progress',
        meals: { 
          morning: 'Pescado fresco + Agua filtrada', 
          evening: 'Pate de salmón premium' 
        },
        treats: 'Snacks de atún',
        dayRating: 'Bueno',
        outdoorTime: [
          'Tiempo en el balcón 15 min',
          'Observación de pájaros'
        ],
        bedtime: [
          '23:00 - Cama en el sofá',
          'Rutina de acicalamiento'
        ],
        toiletAccess: [
          'Arena limpia cada 6 horas',
          'Arena de emergencia disponible'
        ],
        favoriteThings: [
          'Rascador de cartón',
          'Pluma de juguete',
          'Caja de cartón'
        ],
        activities: [
          'Juego con la pluma',
          'Subir al rascador',
          'Observar por la ventana'
        ],
        health: {
          mood: 'Tranquila',
          energy: 'Media',
          appetite: 'Normal',
          sleep: '12 horas'
        },
        notes: 'Luna estuvo más tranquila hoy. Comió bien pero no jugó mucho. Monitorear comportamiento.',
        photos: ['luna_1.jpg'],
        reminders: [
          'Desparasitación - Enero 2025',
          'Corte de uñas - Esta semana',
          'Revisión veterinaria - Febrero 2025'
        ]
      }
    ];

    // Estadísticas de cuidado
    const careStats = {
      totalPlans: samplePetCarePlans.length,
      completedPlans: samplePetCarePlans.filter(plan => plan.status === 'completed').length,
      inProgressPlans: samplePetCarePlans.filter(plan => plan.status === 'in_progress').length,
      totalPets: new Set(samplePetCarePlans.map(plan => plan.petName)).size,
      totalActivities: samplePetCarePlans.reduce((sum, plan) => sum + plan.activities.length, 0)
    };

    // Funciones auxiliares
    const getStatusColor = (status) => {
      switch (status) {
        case 'completed': return '#4CAF50';
        case 'in_progress': return '#FF9800';
        case 'pending': return '#2196F3';
        default: return '#6B7280';
      }
    };

    const getStatusLabel = (status) => {
      switch (status) {
        case 'completed': return 'Completado';
        case 'in_progress': return 'En Progreso';
        case 'pending': return 'Pendiente';
        default: return 'Desconocido';
      }
    };

    const getPetTypeIcon = (type) => {
      switch (type) {
        case 'Perro': return 'paw';
        case 'Gato': return 'heart';
        case 'Pájaro': return 'bird';
        case 'Pez': return 'fish';
        default: return 'paw';
      }
    };

    const getPetTypeColor = (type) => {
      switch (type) {
        case 'Perro': return '#FF6B35';
        case 'Gato': return '#9C27B0';
        case 'Pájaro': return '#4CAF50';
        case 'Pez': return '#2196F3';
        default: return '#6B7280';
      }
    };

    const getMoodIcon = (mood) => {
      switch (mood) {
        case 'Feliz': return 'happy';
        case 'Tranquila': return 'leaf';
        case 'Energética': return 'flash';
        case 'Relajada': return 'moon';
        default: return 'happy';
      }
    };

    const getMoodColor = (mood) => {
      switch (mood) {
        case 'Feliz': return '#4CAF50';
        case 'Tranquila': return '#2196F3';
        case 'Energética': return '#FF9800';
        case 'Relajada': return '#9C27B0';
        default: return '#4CAF50';
      }
    };

    return (
      <ScrollView style={styles.petCareContainer} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.petCareHeader}>
          <View style={styles.petCareHeaderContent}>
            <View style={styles.petCareHeaderIcon}>
              <Icon name="paw" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.petCareHeaderText}>
              <Text style={styles.petCareHeaderTitle}>Planificador de Cuidados</Text>
              <Text style={styles.petCareHeaderSubtitle}>
                Organiza el cuidado diario de tus mascotas
              </Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.petCareAddButton}
            onPress={openAddPetCareModal}
          >
            <Icon name="add" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

        {/* Estadísticas de cuidado */}
        <View style={styles.petCareStats}>
          <View style={styles.petCareStatCard}>
            <View style={styles.petCareStatIcon}>
              <Icon name="paw-outline" size={20} color="#FF6B35" />
        </View>
            <View style={styles.petCareStatContent}>
              <Text style={styles.petCareStatNumber}>{careStats.totalPlans}</Text>
              <Text style={styles.petCareStatLabel}>Planes Totales</Text>
            </View>
          </View>
          <View style={styles.petCareStatCard}>
            <View style={styles.petCareStatIcon}>
              <Icon name="checkmark-circle" size={20} color="#4CAF50" />
            </View>
            <View style={styles.petCareStatContent}>
              <Text style={styles.petCareStatNumber}>{careStats.completedPlans}</Text>
              <Text style={styles.petCareStatLabel}>Completados</Text>
            </View>
          </View>
          <View style={styles.petCareStatCard}>
            <View style={styles.petCareStatIcon}>
              <Icon name="paw" size={20} color="#9C27B0" />
            </View>
            <View style={styles.petCareStatContent}>
              <Text style={styles.petCareStatNumber}>{careStats.totalPets}</Text>
              <Text style={styles.petCareStatLabel}>Mascotas</Text>
            </View>
          </View>
              </View>
              
        {/* Lista de planes de cuidado */}
        <View style={styles.petCarePlans}>
          {samplePetCarePlans.map((plan) => (
            <View key={plan.id} style={styles.petCarePlanCard}>
              {/* Header del plan */}
              <View style={styles.petCarePlanHeader}>
                <View style={styles.petCarePlanInfo}>
                  <Text style={styles.petCarePlanPetName}>{plan.petName}</Text>
                  <Text style={styles.petCarePlanDate}>{plan.date}</Text>
                  <Text style={styles.petCarePlanDetails}>{plan.petType} • {plan.breed} • {plan.age}</Text>
                </View>
                <View style={styles.petCarePlanStatus}>
                  <View style={[
                    styles.petCareStatusBadge,
                    { backgroundColor: getStatusColor(plan.status) }
                  ]}>
                    <Text style={styles.petCareStatusText}>
                      {getStatusLabel(plan.status)}
                    </Text>
                  </View>
                </View>
                  </View>
                  
              {/* Información de la mascota */}
              <View style={styles.petCarePetInfo}>
                <View style={styles.petCarePetType}>
                  <View style={[
                    styles.petCareTypeIcon,
                    { backgroundColor: getPetTypeColor(plan.petType) }
                  ]}>
                    <Icon 
                      name={getPetTypeIcon(plan.petType)} 
                      size={16} 
                      color="#FFFFFF" 
                    />
                  </View>
                  <Text style={styles.petCareTypeText}>{plan.petType}</Text>
                </View>
                <View style={styles.petCareOwnerInfo}>
                  <Icon name="person" size={16} color="#6B7280" />
                  <Text style={styles.petCareOwnerText}>{plan.ownerName}</Text>
                </View>
              </View>

              {/* Estado de salud */}
              <View style={styles.petCareHealth}>
                <View style={styles.petCareHealthHeader}>
                  <Icon name="medical" size={16} color="#4CAF50" />
                  <Text style={styles.petCareHealthTitle}>Estado de Salud</Text>
                </View>
                <View style={styles.petCareHealthGrid}>
                  <View style={styles.petCareHealthItem}>
                    <Icon 
                      name={getMoodIcon(plan.health.mood)} 
                      size={14} 
                      color={getMoodColor(plan.health.mood)} 
                    />
                    <Text style={styles.petCareHealthLabel}>Estado de ánimo:</Text>
                    <Text style={styles.petCareHealthValue}>{plan.health.mood}</Text>
                  </View>
                  <View style={styles.petCareHealthItem}>
                    <Icon name="flash" size={14} color="#FF9800" />
                    <Text style={styles.petCareHealthLabel}>Energía:</Text>
                    <Text style={styles.petCareHealthValue}>{plan.health.energy}</Text>
                  </View>
                  <View style={styles.petCareHealthItem}>
                    <Icon name="restaurant" size={14} color="#2196F3" />
                    <Text style={styles.petCareHealthLabel}>Apetito:</Text>
                    <Text style={styles.petCareHealthValue}>{plan.health.appetite}</Text>
                  </View>
                  <View style={styles.petCareHealthItem}>
                    <Icon name="moon" size={14} color="#9C27B0" />
                    <Text style={styles.petCareHealthLabel}>Sueño:</Text>
                    <Text style={styles.petCareHealthValue}>{plan.health.sleep}</Text>
                  </View>
                </View>
                </View>

              {/* Comidas */}
              <View style={styles.petCareMeals}>
                <View style={styles.petCareMealsHeader}>
                  <Icon name="restaurant" size={16} color="#FF6B35" />
                  <Text style={styles.petCareMealsTitle}>Comidas del Día</Text>
                </View>
                <View style={styles.petCareMealsList}>
                  <View style={styles.petCareMealItem}>
                    <View style={styles.petCareMealTime}>
                      <Icon name="sunny" size={14} color="#FF9800" />
                      <Text style={styles.petCareMealTimeText}>Mañana</Text>
                    </View>
                    <Text style={styles.petCareMealText}>{plan.meals.morning}</Text>
                  </View>
                  <View style={styles.petCareMealItem}>
                    <View style={styles.petCareMealTime}>
                      <Icon name="moon" size={14} color="#2196F3" />
                      <Text style={styles.petCareMealTimeText}>Noche</Text>
                    </View>
                    <Text style={styles.petCareMealText}>{plan.meals.evening}</Text>
                  </View>
                </View>
              </View>

              {/* Premios */}
              <View style={styles.petCareTreats}>
                <View style={styles.petCareTreatsHeader}>
                  <Icon name="gift" size={16} color="#9C27B0" />
                  <Text style={styles.petCareTreatsTitle}>Premios</Text>
                </View>
                <Text style={styles.petCareTreatsText}>{plan.treats}</Text>
              </View>

              {/* Actividades */}
              <View style={styles.petCareActivities}>
                <View style={styles.petCareActivitiesHeader}>
                  <Icon name="fitness" size={16} color="#4CAF50" />
                  <Text style={styles.petCareActivitiesTitle}>Actividades</Text>
                </View>
                <View style={styles.petCareActivitiesList}>
                  {plan.activities.map((activity, index) => (
                    <View key={index} style={styles.petCareActivityItem}>
                      <Icon name="checkmark-circle-outline" size={14} color="#4CAF50" />
                      <Text style={styles.petCareActivityText}>{activity}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Tiempo al aire libre */}
              <View style={styles.petCareOutdoor}>
                <View style={styles.petCareOutdoorHeader}>
                  <Icon name="leaf" size={16} color="#4CAF50" />
                  <Text style={styles.petCareOutdoorTitle}>Tiempo al Aire Libre</Text>
                </View>
                <View style={styles.petCareOutdoorList}>
                  {plan.outdoorTime.map((time, index) => (
                    <View key={index} style={styles.petCareOutdoorItem}>
                      <Icon name="time" size={14} color="#4CAF50" />
                      <Text style={styles.petCareOutdoorText}>{time}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Hora de dormir */}
              <View style={styles.petCareBedtime}>
                <View style={styles.petCareBedtimeHeader}>
                  <Icon name="moon" size={16} color="#2196F3" />
                  <Text style={styles.petCareBedtimeTitle}>Hora de Dormir</Text>
                </View>
                <View style={styles.petCareBedtimeList}>
                  {plan.bedtime.map((time, index) => (
                    <View key={index} style={styles.petCareBedtimeItem}>
                      <Icon name="bed" size={14} color="#2196F3" />
                      <Text style={styles.petCareBedtimeText}>{time}</Text>
                    </View>
                  ))}
                </View>
                </View>

              {/* Cosas favoritas */}
              <View style={styles.petCareFavorites}>
                <View style={styles.petCareFavoritesHeader}>
                  <Icon name="heart" size={16} color="#E91E63" />
                  <Text style={styles.petCareFavoritesTitle}>Cosas Favoritas</Text>
                </View>
                <View style={styles.petCareFavoritesList}>
                  {plan.favoriteThings.map((thing, index) => (
                    <View key={index} style={styles.petCareFavoriteItem}>
                      <Icon name="star" size={14} color="#E91E63" />
                      <Text style={styles.petCareFavoriteText}>{thing}</Text>
                    </View>
                  ))}
                </View>
              </View>
              
              {/* Recordatorios */}
              <View style={styles.petCareReminders}>
                <View style={styles.petCareRemindersHeader}>
                  <Icon name="alarm" size={16} color="#FF9800" />
                  <Text style={styles.petCareRemindersTitle}>Recordatorios</Text>
              </View>
                <View style={styles.petCareRemindersList}>
                  {plan.reminders.map((reminder, index) => (
                    <View key={index} style={styles.petCareReminderItem}>
                      <Icon name="calendar" size={14} color="#FF9800" />
                      <Text style={styles.petCareReminderText}>{reminder}</Text>
            </View>
          ))}
                </View>
              </View>

              {/* Notas */}
              {plan.notes && (
                <View style={styles.petCareNotes}>
                  <View style={styles.petCareNotesHeader}>
                    <Icon name="document-text" size={16} color="#6B7280" />
                    <Text style={styles.petCareNotesTitle}>Notas del Día</Text>
                  </View>
                  <Text style={styles.petCareNotesText}>{plan.notes}</Text>
                </View>
              )}

              {/* Botones de acción */}
              <View style={styles.petCareActions}>
                <TouchableOpacity style={styles.petCareActionButton}>
                  <Icon name="create-outline" size={16} color="#2196F3" />
                  <Text style={styles.petCareActionText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.petCareActionButton}>
                  <Icon name="share-outline" size={16} color="#4CAF50" />
                  <Text style={styles.petCareActionText}>Compartir</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.petCareActionButton}>
                  <Icon name="download-outline" size={16} color="#FF9800" />
                  <Text style={styles.petCareActionText}>Exportar</Text>
                </TouchableOpacity>
    </View>
            </View>
          ))}
        </View>

        {/* Estado vacío si no hay planes */}
        {samplePetCarePlans.length === 0 && (
          <View style={styles.petCareEmptyState}>
            <View style={styles.petCareEmptyIcon}>
              <Icon name="paw-outline" size={64} color="#E0E0E0" />
            </View>
            <Text style={styles.petCareEmptyTitle}>No hay planes de cuidado</Text>
            <Text style={styles.petCareEmptySubtitle}>
              Crea tu primer plan de cuidado para tu mascota
            </Text>
            <TouchableOpacity 
              style={styles.petCareEmptyButton}
              onPress={openAddPetCareModal}
            >
              <Icon name="add" size={20} color="#FFFFFF" />
              <Text style={styles.petCareEmptyButtonText}>Crear Plan</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    );
  };

  const renderPuppyPlanner = () => {
    // Datos de ejemplo para el planificador de cachorros
    const samplePuppyPlans = [
      {
        id: '1',
        puppyName: 'Bella',
        breed: 'Labrador Retriever',
        age: '3 meses',
        sex: 'Hembra',
        ownerName: 'Ana Martínez',
        phone: '+34 612 345 678',
        address: 'Calle Mayor 123, Madrid',
        emergencyContact: 'Carlos Martínez - +34 611 222 333',
        localVet: 'Clínica Veterinaria San Antonio',
        vetPhoto: 'vet_photo.jpg',
        emergencyVet: 'Hospital Veterinario 24h Madrid',
        emergencyVetPhone: '+34 91 123 4567',
        microchipped: 'Sí - Nº 123456789',
        needsMedicine: 'No',
        morningActivity: 'Paseo de 20 min + Desayuno + Juego',
        afternoonActivity: 'Entrenamiento básico + Socialización',
        eveningActivity: 'Paseo nocturno + Cena + Relajación',
        behaviors: [
          'Muy juguetona',
          'Aprende rápido',
          'Le gusta morder zapatos',
          'Duerme mucho durante el día'
        ],
        training: {
          level: 'Principiante',
          commands: ['Sit', 'Stay', 'Come'],
          progress: 65,
          nextGoals: ['Down', 'Leave it', 'Heel']
        },
        health: {
          weight: '8.5 kg',
          lastVaccination: '15 Nov 2024',
          nextVaccination: '15 Dic 2024',
          deworming: 'Completado',
          overall: 'Excelente'
        },
        schedule: {
          wakeUp: '07:00',
          breakfast: '07:30',
          firstWalk: '08:00',
          nap: '10:00-12:00',
          lunch: '12:30',
          playtime: '14:00-15:00',
          secondWalk: '16:00',
          dinner: '18:30',
          bedtime: '21:00'
        },
        notes: 'Bella está adaptándose muy bien a su nuevo hogar. Es muy sociable con otros perros y personas. Necesita más trabajo en el comando "stay".',
        photos: ['bella_1.jpg', 'bella_2.jpg', 'bella_3.jpg'],
        reminders: [
          'Vacuna de refuerzo - 15 Dic 2024',
          'Corte de uñas - Esta semana',
          'Revisión de peso - Próximo mes',
          'Curso de obediencia - Enero 2025'
        ]
      },
      {
        id: '2',
        puppyName: 'Max',
        breed: 'Border Collie',
        age: '4 meses',
        sex: 'Macho',
        ownerName: 'David López',
        phone: '+34 655 987 654',
        address: 'Avenida de la Paz 45, Barcelona',
        emergencyContact: 'María López - +34 644 555 666',
        localVet: 'Centro Veterinario Barcelona',
        vetPhoto: 'vet_photo2.jpg',
        emergencyVet: 'Clínica Veterinaria de Urgencias',
        emergencyVetPhone: '+34 93 987 6543',
        microchipped: 'Sí - Nº 987654321',
        needsMedicine: 'Sí - Medicamento para la digestión',
        morningActivity: 'Ejercicio intenso + Desayuno + Entrenamiento',
        afternoonActivity: 'Juegos de inteligencia + Paseo largo',
        eveningActivity: 'Entrenamiento avanzado + Cena + Descanso',
        behaviors: [
          'Muy inteligente',
          'Energía alta',
          'Necesita mucho ejercicio',
          'Aprende comandos rápidamente'
        ],
        training: {
          level: 'Intermedio',
          commands: ['Sit', 'Stay', 'Come', 'Down', 'Leave it'],
          progress: 85,
          nextGoals: ['Heel', 'Fetch', 'Roll over']
        },
        health: {
          weight: '12.3 kg',
          lastVaccination: '20 Nov 2024',
          nextVaccination: '20 Dic 2024',
          deworming: 'En proceso',
          overall: 'Muy bueno'
        },
        schedule: {
          wakeUp: '06:30',
          breakfast: '07:00',
          firstWalk: '07:30',
          training: '09:00-10:00',
          nap: '11:00-13:00',
          lunch: '13:30',
          playtime: '15:00-16:30',
          secondWalk: '17:00',
          dinner: '19:00',
          bedtime: '22:00'
        },
        notes: 'Max es un cachorro muy activo que necesita estimulación mental constante. Excelente progreso en el entrenamiento. Monitorear el medicamento digestivo.',
        photos: ['max_1.jpg', 'max_2.jpg'],
        reminders: [
          'Vacuna de refuerzo - 20 Dic 2024',
          'Renovar medicamento - Próxima semana',
          'Evaluación de comportamiento - Enero 2025',
          'Curso de agilidad - Febrero 2025'
        ]
      }
    ];

    // Estadísticas de cachorros
    const puppyStats = {
      totalPuppies: samplePuppyPlans.length,
      averageAge: '3.5 meses',
      trainingProgress: Math.round(samplePuppyPlans.reduce((sum, plan) => sum + plan.training.progress, 0) / samplePuppyPlans.length),
      vaccinated: samplePuppyPlans.filter(plan => plan.health.lastVaccination).length,
      microchipped: samplePuppyPlans.filter(plan => plan.microchipped.includes('Sí')).length
    };

    // Funciones auxiliares
    const getTrainingLevelColor = (level) => {
      switch (level) {
        case 'Principiante': return '#FF9800';
        case 'Intermedio': return '#2196F3';
        case 'Avanzado': return '#4CAF50';
        default: return '#6B7280';
      }
    };

    const getHealthStatusColor = (status) => {
      switch (status) {
        case 'Excelente': return '#4CAF50';
        case 'Muy bueno': return '#8BC34A';
        case 'Bueno': return '#FFC107';
        case 'Regular': return '#FF9800';
        case 'Malo': return '#F44336';
        default: return '#6B7280';
      }
    };

    const getSexIcon = (sex) => {
      return sex === 'Macho' ? 'male' : 'female';
    };

    const getSexColor = (sex) => {
      return sex === 'Macho' ? '#2196F3' : '#E91E63';
    };

    const getBreedIcon = (breed) => {
      if (breed.includes('Labrador')) return 'paw';
      if (breed.includes('Border Collie')) return 'flash';
      if (breed.includes('Golden')) return 'star';
      return 'heart';
    };

    const getBreedColor = (breed) => {
      if (breed.includes('Labrador')) return '#FF6B35';
      if (breed.includes('Border Collie')) return '#9C27B0';
      if (breed.includes('Golden')) return '#FFC107';
      return '#4CAF50';
    };

    return (
      <ScrollView style={styles.puppyContainer} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.puppyHeader}>
          <View style={styles.puppyHeaderContent}>
            <View style={styles.puppyHeaderIcon}>
              <Icon name="heart" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.puppyHeaderText}>
              <Text style={styles.puppyHeaderTitle}>Planificador de Cachorros</Text>
              <Text style={styles.puppyHeaderSubtitle}>
                Cuidado especializado para cachorros
              </Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.puppyAddButton}
            onPress={openAddPuppyModal}
          >
            <Icon name="add" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

        {/* Estadísticas de cachorros */}
        <View style={styles.puppyStats}>
          <View style={styles.puppyStatCard}>
            <View style={styles.puppyStatIcon}>
              <Icon name="heart-outline" size={20} color="#E91E63" />
        </View>
            <View style={styles.puppyStatContent}>
              <Text style={styles.puppyStatNumber}>{puppyStats.totalPuppies}</Text>
              <Text style={styles.puppyStatLabel}>Cachorros</Text>
            </View>
          </View>
          <View style={styles.puppyStatCard}>
            <View style={styles.puppyStatIcon}>
              <Icon name="trophy" size={20} color="#FF9800" />
            </View>
            <View style={styles.puppyStatContent}>
              <Text style={styles.puppyStatNumber}>{puppyStats.trainingProgress}%</Text>
              <Text style={styles.puppyStatLabel}>Progreso</Text>
            </View>
          </View>
          <View style={styles.puppyStatCard}>
            <View style={styles.puppyStatIcon}>
              <Icon name="shield-checkmark" size={20} color="#4CAF50" />
            </View>
            <View style={styles.puppyStatContent}>
              <Text style={styles.puppyStatNumber}>{puppyStats.vaccinated}</Text>
              <Text style={styles.puppyStatLabel}>Vacunados</Text>
            </View>
          </View>
              </View>
              
        {/* Lista de planes de cachorros */}
        <View style={styles.puppyPlans}>
          {samplePuppyPlans.map((plan) => (
            <View key={plan.id} style={styles.puppyPlanCard}>
              {/* Header del plan */}
              <View style={styles.puppyPlanHeader}>
                <View style={styles.puppyPlanInfo}>
                  <Text style={styles.puppyPlanPuppyName}>{plan.puppyName}</Text>
                  <Text style={styles.puppyPlanDetails}>{plan.breed} • {plan.age} • {plan.sex}</Text>
                </View>
                <View style={styles.puppyPlanStatus}>
                  <View style={[
                    styles.puppyTrainingBadge,
                    { backgroundColor: getTrainingLevelColor(plan.training.level) }
                  ]}>
                    <Text style={styles.puppyTrainingText}>
                      {plan.training.level}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Información básica del cachorro */}
              <View style={styles.puppyBasicInfo}>
                <View style={styles.puppyBreedInfo}>
                  <View style={[
                    styles.puppyBreedIcon,
                    { backgroundColor: getBreedColor(plan.breed) }
                  ]}>
                    <Icon 
                      name={getBreedIcon(plan.breed)} 
                      size={16} 
                      color="#FFFFFF" 
                    />
                  </View>
                  <Text style={styles.puppyBreedText}>{plan.breed}</Text>
                </View>
                <View style={styles.puppySexInfo}>
                  <Icon 
                    name={getSexIcon(plan.sex)} 
                    size={16} 
                    color={getSexColor(plan.sex)} 
                  />
                  <Text style={styles.puppySexText}>{plan.sex}</Text>
                </View>
                <View style={styles.puppyAgeInfo}>
                  <Icon name="time" size={16} color="#6B7280" />
                  <Text style={styles.puppyAgeText}>{plan.age}</Text>
                </View>
                </View>

              {/* Progreso de entrenamiento */}
              <View style={styles.puppyTraining}>
                <View style={styles.puppyTrainingHeader}>
                  <Icon name="school" size={16} color="#2196F3" />
                  <Text style={styles.puppyTrainingTitle}>Progreso de Entrenamiento</Text>
                  <Text style={styles.puppyTrainingProgress}>{plan.training.progress}%</Text>
                </View>
                <View style={styles.puppyProgressBar}>
                  <View 
                    style={[
                      styles.puppyProgressFill,
                      { width: `${plan.training.progress}%` }
                    ]}
                  />
                </View>
                <View style={styles.puppyCommands}>
                  <Text style={styles.puppyCommandsTitle}>Comandos aprendidos:</Text>
                  <View style={styles.puppyCommandsList}>
                    {plan.training.commands.map((command, index) => (
                      <View key={index} style={styles.puppyCommandItem}>
                        <Icon name="checkmark-circle" size={14} color="#4CAF50" />
                        <Text style={styles.puppyCommandText}>{command}</Text>
                      </View>
                    ))}
                  </View>
                </View>
                <View style={styles.puppyNextGoals}>
                  <Text style={styles.puppyNextGoalsTitle}>Próximos objetivos:</Text>
                  <View style={styles.puppyNextGoalsList}>
                    {plan.training.nextGoals.map((goal, index) => (
                      <View key={index} style={styles.puppyNextGoalItem}>
                        <Icon name="arrow-forward" size={14} color="#FF9800" />
                        <Text style={styles.puppyNextGoalText}>{goal}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>

              {/* Estado de salud */}
              <View style={styles.puppyHealth}>
                <View style={styles.puppyHealthHeader}>
                  <Icon name="medical" size={16} color="#4CAF50" />
                  <Text style={styles.puppyHealthTitle}>Estado de Salud</Text>
                  <View style={[
                    styles.puppyHealthStatus,
                    { backgroundColor: getHealthStatusColor(plan.health.overall) }
                  ]}>
                    <Text style={styles.puppyHealthStatusText}>{plan.health.overall}</Text>
                  </View>
                </View>
                <View style={styles.puppyHealthGrid}>
                  <View style={styles.puppyHealthItem}>
                    <Icon name="scale" size={14} color="#6B7280" />
                    <Text style={styles.puppyHealthLabel}>Peso:</Text>
                    <Text style={styles.puppyHealthValue}>{plan.health.weight}</Text>
                  </View>
                  <View style={styles.puppyHealthItem}>
                    <Icon name="shield" size={14} color="#4CAF50" />
                    <Text style={styles.puppyHealthLabel}>Última vacuna:</Text>
                    <Text style={styles.puppyHealthValue}>{plan.health.lastVaccination}</Text>
                  </View>
                  <View style={styles.puppyHealthItem}>
                    <Icon name="calendar" size={14} color="#2196F3" />
                    <Text style={styles.puppyHealthLabel}>Próxima vacuna:</Text>
                    <Text style={styles.puppyHealthValue}>{plan.health.nextVaccination}</Text>
                  </View>
                  <View style={styles.puppyHealthItem}>
                    <Icon name="bug" size={14} color="#FF9800" />
                    <Text style={styles.puppyHealthLabel}>Desparasitación:</Text>
                    <Text style={styles.puppyHealthValue}>{plan.health.deworming}</Text>
                  </View>
                </View>
              </View>
              
              {/* Horario diario */}
              <View style={styles.puppySchedule}>
                <View style={styles.puppyScheduleHeader}>
                  <Icon name="time" size={16} color="#9C27B0" />
                  <Text style={styles.puppyScheduleTitle}>Horario Diario</Text>
              </View>
                <View style={styles.puppyScheduleList}>
                  <View style={styles.puppyScheduleItem}>
                    <Icon name="sunny" size={14} color="#FF9800" />
                    <Text style={styles.puppyScheduleTime}>{plan.schedule.wakeUp}</Text>
                    <Text style={styles.puppyScheduleActivity}>Despertar</Text>
                  </View>
                  <View style={styles.puppyScheduleItem}>
                    <Icon name="restaurant" size={14} color="#4CAF50" />
                    <Text style={styles.puppyScheduleTime}>{plan.schedule.breakfast}</Text>
                    <Text style={styles.puppyScheduleActivity}>Desayuno</Text>
                  </View>
                  <View style={styles.puppyScheduleItem}>
                    <Icon name="walk" size={14} color="#2196F3" />
                    <Text style={styles.puppyScheduleTime}>{plan.schedule.firstWalk}</Text>
                    <Text style={styles.puppyScheduleActivity}>Primer paseo</Text>
                  </View>
                  <View style={styles.puppyScheduleItem}>
                    <Icon name="moon" size={14} color="#6B7280" />
                    <Text style={styles.puppyScheduleTime}>{plan.schedule.nap}</Text>
                    <Text style={styles.puppyScheduleActivity}>Siesta</Text>
                  </View>
                  <View style={styles.puppyScheduleItem}>
                    <Icon name="fitness" size={14} color="#E91E63" />
                    <Text style={styles.puppyScheduleTime}>{plan.schedule.playtime}</Text>
                    <Text style={styles.puppyScheduleActivity}>Juego</Text>
                  </View>
                  <View style={styles.puppyScheduleItem}>
                    <Icon name="bed" size={14} color="#9C27B0" />
                    <Text style={styles.puppyScheduleTime}>{plan.schedule.bedtime}</Text>
                    <Text style={styles.puppyScheduleActivity}>Hora de dormir</Text>
                  </View>
                </View>
              </View>

              {/* Actividades diarias */}
              <View style={styles.puppyActivities}>
                <View style={styles.puppyActivitiesHeader}>
                  <Icon name="fitness" size={16} color="#4CAF50" />
                  <Text style={styles.puppyActivitiesTitle}>Actividades Diarias</Text>
                </View>
                <View style={styles.puppyActivitiesList}>
                  <View style={styles.puppyActivityItem}>
                    <View style={styles.puppyActivityTime}>
                      <Icon name="sunny" size={14} color="#FF9800" />
                      <Text style={styles.puppyActivityTimeText}>Mañana</Text>
                    </View>
                    <Text style={styles.puppyActivityText}>{plan.morningActivity}</Text>
                  </View>
                  <View style={styles.puppyActivityItem}>
                    <View style={styles.puppyActivityTime}>
                      <Icon name="partly-sunny" size={14} color="#FFC107" />
                      <Text style={styles.puppyActivityTimeText}>Tarde</Text>
                    </View>
                    <Text style={styles.puppyActivityText}>{plan.afternoonActivity}</Text>
                  </View>
                  <View style={styles.puppyActivityItem}>
                    <View style={styles.puppyActivityTime}>
                      <Icon name="moon" size={14} color="#2196F3" />
                      <Text style={styles.puppyActivityTimeText}>Noche</Text>
                    </View>
                    <Text style={styles.puppyActivityText}>{plan.eveningActivity}</Text>
                  </View>
                </View>
              </View>

              {/* Comportamientos */}
              <View style={styles.puppyBehaviors}>
                <View style={styles.puppyBehaviorsHeader}>
                  <Icon name="eye" size={16} color="#FF9800" />
                  <Text style={styles.puppyBehaviorsTitle}>Comportamientos Observados</Text>
                </View>
                <View style={styles.puppyBehaviorsList}>
                  {plan.behaviors.map((behavior, index) => (
                    <View key={index} style={styles.puppyBehaviorItem}>
                      <Icon name="checkmark-circle-outline" size={14} color="#4CAF50" />
                      <Text style={styles.puppyBehaviorText}>{behavior}</Text>
            </View>
          ))}
                </View>
              </View>

              {/* Información del dueño */}
              <View style={styles.puppyOwnerInfo}>
                <View style={styles.puppyOwnerHeader}>
                  <Icon name="person" size={16} color="#6B7280" />
                  <Text style={styles.puppyOwnerTitle}>Información del Dueño</Text>
                </View>
                <View style={styles.puppyOwnerDetails}>
                  <View style={styles.puppyOwnerItem}>
                    <Icon name="person-circle" size={14} color="#6B7280" />
                    <Text style={styles.puppyOwnerLabel}>Nombre:</Text>
                    <Text style={styles.puppyOwnerValue}>{plan.ownerName}</Text>
                  </View>
                  <View style={styles.puppyOwnerItem}>
                    <Icon name="call" size={14} color="#4CAF50" />
                    <Text style={styles.puppyOwnerLabel}>Teléfono:</Text>
                    <Text style={styles.puppyOwnerValue}>{plan.phone}</Text>
                  </View>
                  <View style={styles.puppyOwnerItem}>
                    <Icon name="location" size={14} color="#2196F3" />
                    <Text style={styles.puppyOwnerLabel}>Dirección:</Text>
                    <Text style={styles.puppyOwnerValue}>{plan.address}</Text>
                  </View>
                </View>
              </View>

              {/* Información veterinaria */}
              <View style={styles.puppyVetInfo}>
                <View style={styles.puppyVetHeader}>
                  <Icon name="medical" size={16} color="#4CAF50" />
                  <Text style={styles.puppyVetTitle}>Información Veterinaria</Text>
                </View>
                <View style={styles.puppyVetDetails}>
                  <View style={styles.puppyVetItem}>
                    <Icon name="business" size={14} color="#6B7280" />
                    <Text style={styles.puppyVetLabel}>Veterinario local:</Text>
                    <Text style={styles.puppyVetValue}>{plan.localVet}</Text>
                  </View>
                  <View style={styles.puppyVetItem}>
                    <Icon name="call" size={14} color="#F44336" />
                    <Text style={styles.puppyVetLabel}>Emergencias:</Text>
                    <Text style={styles.puppyVetValue}>{plan.emergencyVet}</Text>
                  </View>
                  <View style={styles.puppyVetItem}>
                    <Icon name="phone-portrait" size={14} color="#FF9800" />
                    <Text style={styles.puppyVetLabel}>Teléfono emergencia:</Text>
                    <Text style={styles.puppyVetValue}>{plan.emergencyVetPhone}</Text>
                  </View>
                </View>
              </View>

              {/* Recordatorios */}
              <View style={styles.puppyReminders}>
                <View style={styles.puppyRemindersHeader}>
                  <Icon name="alarm" size={16} color="#FF9800" />
                  <Text style={styles.puppyRemindersTitle}>Recordatorios Importantes</Text>
                </View>
                <View style={styles.puppyRemindersList}>
                  {plan.reminders.map((reminder, index) => (
                    <View key={index} style={styles.puppyReminderItem}>
                      <Icon name="calendar" size={14} color="#FF9800" />
                      <Text style={styles.puppyReminderText}>{reminder}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Notas */}
              {plan.notes && (
                <View style={styles.puppyNotes}>
                  <View style={styles.puppyNotesHeader}>
                    <Icon name="document-text" size={16} color="#6B7280" />
                    <Text style={styles.puppyNotesTitle}>Notas del Entrenador</Text>
                  </View>
                  <Text style={styles.puppyNotesText}>{plan.notes}</Text>
                </View>
              )}

              {/* Botones de acción */}
              <View style={styles.puppyActions}>
                <TouchableOpacity style={styles.puppyActionButton}>
                  <Icon name="create-outline" size={16} color="#2196F3" />
                  <Text style={styles.puppyActionText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.puppyActionButton}>
                  <Icon name="share-outline" size={16} color="#4CAF50" />
                  <Text style={styles.puppyActionText}>Compartir</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.puppyActionButton}>
                  <Icon name="download-outline" size={16} color="#FF9800" />
                  <Text style={styles.puppyActionText}>Exportar</Text>
                </TouchableOpacity>
    </View>
            </View>
          ))}
        </View>

        {/* Estado vacío si no hay planes */}
        {samplePuppyPlans.length === 0 && (
          <View style={styles.puppyEmptyState}>
            <View style={styles.puppyEmptyIcon}>
              <Icon name="heart-outline" size={64} color="#E0E0E0" />
            </View>
            <Text style={styles.puppyEmptyTitle}>No hay planes de cachorro</Text>
            <Text style={styles.puppyEmptySubtitle}>
              Crea tu primer plan de cuidado para tu cachorro
            </Text>
            <TouchableOpacity 
              style={styles.puppyEmptyButton}
              onPress={openAddPuppyModal}
            >
              <Icon name="add" size={20} color="#FFFFFF" />
              <Text style={styles.puppyEmptyButtonText}>Crear Plan</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    );
  };

  const renderWellnessScheduler = () => {
    // Datos de ejemplo para el programador de bienestar
    const sampleWellnessPlans = [
      {
        id: '1',
        petName: 'Luna',
        petType: 'Gato',
        breed: 'Siamés',
        age: '2 años',
        birth: '15 Marzo 2022',
        coat: 'Corto, sedoso, color crema con puntos marrones',
        petOwner: 'María González',
        clinic: 'Clínica Veterinaria Felina Madrid',
        veterinarian: 'Dr. Carlos Ruiz',
        personality: 'Tranquila, cariñosa, independiente',
        markings: 'Puntos marrones en orejas, patas y cola',
        favoriteThings: 'Juguetes de pluma, cajas de cartón, ventana soleada',
        medicineAllergies: 'Penicilina, algunos antibióticos',
        dailyRoutine: 'Desayuno 8:00, siesta 10:00-14:00, juego 16:00, cena 19:00, descanso nocturno 22:00',
        health: {
          weight: '4.2 kg',
          lastCheckup: '10 Nov 2024',
          nextCheckup: '10 Feb 2025',
          vaccinations: [
            { name: 'Trivalente', date: '15 Oct 2024', next: '15 Oct 2025' },
            { name: 'Rabia', date: '15 Oct 2024', next: '15 Oct 2025' }
          ],
          medications: [
            { name: 'Suplemento vitamínico', dosage: '1 comprimido diario', duration: 'Continuo' }
          ],
          allergies: ['Penicilina', 'Polen de gramíneas'],
          conditions: ['Ninguna'],
          overall: 'Excelente'
        },
        wellness: {
          exercise: '15 min diarios de juego activo',
          grooming: 'Cepillado 3 veces por semana',
          dental: 'Limpieza dental cada 6 meses',
          nutrition: 'Alimento premium para gatos adultos',
          mental: 'Juguetes interactivos y rascadores'
        },
        schedule: {
          feeding: {
            morning: '08:00 - Alimento seco premium',
            evening: '19:00 - Alimento húmedo + agua fresca'
          },
          exercise: {
            morning: '08:30 - Juego con pluma',
            afternoon: '16:00 - Rascador y juguetes',
            evening: '20:00 - Interacción social'
          },
          grooming: {
            monday: 'Cepillado completo',
            wednesday: 'Cepillado ligero',
            friday: 'Cepillado completo',
            sunday: 'Revisión general'
          }
        },
        notes: 'Luna es una gata muy saludable. Mantener rutina de ejercicio y monitorear peso. Recordar cita dental en febrero.',
        photos: ['luna_1.jpg', 'luna_2.jpg'],
        reminders: [
          'Revisión dental - 10 Feb 2025',
          'Vacuna de refuerzo - 15 Oct 2025',
          'Renovar suplemento vitamínico - Próximo mes',
          'Limpieza de dientes - Cada 6 meses'
        ]
      },
      {
        id: '2',
        petName: 'Rocky',
        petType: 'Perro',
        breed: 'Pastor Alemán',
        age: '5 años',
        birth: '20 Junio 2019',
        coat: 'Largo, denso, color negro y marrón',
        petOwner: 'Javier Martín',
        clinic: 'Centro Veterinario Canino Barcelona',
        veterinarian: 'Dra. Ana López',
        personality: 'Activo, leal, protector, inteligente',
        markings: 'Máscara negra, patas marrones, cola con mechón blanco',
        favoriteThings: 'Pelota de tenis, paseos largos, juegos de búsqueda',
        medicineAllergies: 'Ninguna conocida',
        dailyRoutine: 'Desayuno 7:00, paseo 8:00, descanso 10:00-14:00, ejercicio 16:00, cena 18:00, paseo nocturno 20:00',
        health: {
          weight: '32.5 kg',
          lastCheckup: '25 Nov 2024',
          nextCheckup: '25 Feb 2025',
          vaccinations: [
            { name: 'Sextuple', date: '20 Nov 2024', next: '20 Nov 2025' },
            { name: 'Rabia', date: '20 Nov 2024', next: '20 Nov 2025' }
          ],
          medications: [
            { name: 'Glucosamina', dosage: '2 comprimidos diarios', duration: '6 meses' },
            { name: 'Omega 3', dosage: '1 cápsula diaria', duration: 'Continuo' }
          ],
          allergies: ['Ninguna'],
          conditions: ['Artritis leve en cadera izquierda'],
          overall: 'Muy bueno'
        },
        wellness: {
          exercise: '2 horas diarias de ejercicio moderado',
          grooming: 'Cepillado diario, baño mensual',
          dental: 'Limpieza dental cada 4 meses',
          nutrition: 'Alimento senior para perros grandes',
          mental: 'Juegos de inteligencia y entrenamiento'
        },
        schedule: {
          feeding: {
            morning: '07:00 - Alimento senior + glucosamina',
            evening: '18:00 - Alimento senior + omega 3'
          },
          exercise: {
            morning: '08:00 - Paseo de 45 min',
            afternoon: '16:00 - Juego y entrenamiento',
            evening: '20:00 - Paseo relajado de 30 min'
          },
          grooming: {
            daily: 'Cepillado completo',
            weekly: 'Limpieza de oídos y dientes',
            monthly: 'Baño completo y corte de uñas'
          }
        },
        notes: 'Rocky tiene artritis leve. Mantener ejercicio moderado y suplementos. Monitorear cojera ocasional.',
        photos: ['rocky_1.jpg', 'rocky_2.jpg', 'rocky_3.jpg'],
        reminders: [
          'Revisión de artritis - 25 Feb 2025',
          'Vacuna de refuerzo - 20 Nov 2025',
          'Renovar glucosamina - Enero 2025',
          'Limpieza dental - Marzo 2025'
        ]
      }
    ];

    // Estadísticas de bienestar
    const wellnessStats = {
      totalPets: sampleWellnessPlans.length,
      healthyPets: sampleWellnessPlans.filter(plan => plan.health.overall === 'Excelente' || plan.health.overall === 'Muy bueno').length,
      upcomingCheckups: sampleWellnessPlans.filter(plan => {
        const nextCheckup = new Date(plan.health.nextCheckup);
        const today = new Date();
        const diffTime = nextCheckup - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 30;
      }).length,
      onMedications: sampleWellnessPlans.filter(plan => plan.health.medications.length > 0).length
    };

    // Funciones auxiliares
    const getHealthStatusColor = (status) => {
      switch (status) {
        case 'Excelente': return '#4CAF50';
        case 'Muy bueno': return '#8BC34A';
        case 'Bueno': return '#FFC107';
        case 'Regular': return '#FF9800';
        case 'Malo': return '#F44336';
        default: return '#6B7280';
      }
    };

    const getPetTypeIcon = (type) => {
      switch (type) {
        case 'Perro': return 'paw';
        case 'Gato': return 'heart';
        case 'Pájaro': return 'bird';
        case 'Pez': return 'fish';
        default: return 'paw';
      }
    };

    const getPetTypeColor = (type) => {
      switch (type) {
        case 'Perro': return '#FF6B35';
        case 'Gato': return '#9C27B0';
        case 'Pájaro': return '#4CAF50';
        case 'Pez': return '#2196F3';
        default: return '#6B7280';
      }
    };

    const getVaccinationStatus = (vaccination) => {
      const nextDate = new Date(vaccination.next);
      const today = new Date();
      const diffTime = nextDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 30) return { status: 'Próxima', color: '#FF9800' };
      if (diffDays <= 90) return { status: 'Vigente', color: '#4CAF50' };
      return { status: 'Vigente', color: '#4CAF50' };
    };

    const getMedicationStatus = (medication) => {
      if (medication.duration === 'Continuo') return { status: 'Continuo', color: '#2196F3' };
      return { status: 'Temporal', color: '#FF9800' };
    };

    return (
      <ScrollView style={styles.wellnessContainer} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.wellnessHeader}>
          <View style={styles.wellnessHeaderContent}>
            <View style={styles.wellnessHeaderIcon}>
              <Icon name="medical" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.wellnessHeaderText}>
              <Text style={styles.wellnessHeaderTitle}>Programador de Bienestar</Text>
              <Text style={styles.wellnessHeaderSubtitle}>
                Seguimiento completo de la salud de tus mascotas
              </Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.wellnessAddButton}
            onPress={openAddWellnessModal}
          >
            <Icon name="add" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

        {/* Estadísticas de bienestar */}
        <View style={styles.wellnessStats}>
          <View style={styles.wellnessStatCard}>
            <View style={styles.wellnessStatIcon}>
              <Icon name="paw-outline" size={20} color="#4CAF50" />
        </View>
            <View style={styles.wellnessStatContent}>
              <Text style={styles.wellnessStatNumber}>{wellnessStats.totalPets}</Text>
              <Text style={styles.wellnessStatLabel}>Mascotas</Text>
            </View>
          </View>
          <View style={styles.wellnessStatCard}>
            <View style={styles.wellnessStatIcon}>
              <Icon name="shield-checkmark" size={20} color="#4CAF50" />
            </View>
            <View style={styles.wellnessStatContent}>
              <Text style={styles.wellnessStatNumber}>{wellnessStats.healthyPets}</Text>
              <Text style={styles.wellnessStatLabel}>Saludables</Text>
            </View>
          </View>
          <View style={styles.wellnessStatCard}>
            <View style={styles.wellnessStatIcon}>
              <Icon name="calendar" size={20} color="#FF9800" />
            </View>
            <View style={styles.wellnessStatContent}>
              <Text style={styles.wellnessStatNumber}>{wellnessStats.upcomingCheckups}</Text>
              <Text style={styles.wellnessStatLabel}>Próximas</Text>
            </View>
          </View>
              </View>
              
        {/* Lista de planes de bienestar */}
        <View style={styles.wellnessPlans}>
          {sampleWellnessPlans.map((plan) => (
            <View key={plan.id} style={styles.wellnessPlanCard}>
              {/* Header del plan */}
              <View style={styles.wellnessPlanHeader}>
                <View style={styles.wellnessPlanInfo}>
                  <Text style={styles.wellnessPlanPetName}>{plan.petName}</Text>
                  <Text style={styles.wellnessPlanDetails}>{plan.petType} • {plan.breed} • {plan.age}</Text>
                </View>
                <View style={styles.wellnessPlanStatus}>
                  <View style={[
                    styles.wellnessHealthBadge,
                    { backgroundColor: getHealthStatusColor(plan.health.overall) }
                  ]}>
                    <Text style={styles.wellnessHealthText}>
                      {plan.health.overall}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Información básica de la mascota */}
              <View style={styles.wellnessBasicInfo}>
                <View style={styles.wellnessPetType}>
                  <View style={[
                    styles.wellnessTypeIcon,
                    { backgroundColor: getPetTypeColor(plan.petType) }
                  ]}>
                    <Icon 
                      name={getPetTypeIcon(plan.petType)} 
                      size={16} 
                      color="#FFFFFF" 
                    />
                  </View>
                  <Text style={styles.wellnessTypeText}>{plan.petType}</Text>
                </View>
                <View style={styles.wellnessOwnerInfo}>
                  <Icon name="person" size={16} color="#6B7280" />
                  <Text style={styles.wellnessOwnerText}>{plan.petOwner}</Text>
                </View>
                <View style={styles.wellnessWeightInfo}>
                  <Icon name="scale" size={16} color="#6B7280" />
                  <Text style={styles.wellnessWeightText}>{plan.health.weight}</Text>
                </View>
                </View>

              {/* Estado de salud detallado */}
              <View style={styles.wellnessHealth}>
                <View style={styles.wellnessHealthHeader}>
                  <Icon name="medical" size={16} color="#4CAF50" />
                  <Text style={styles.wellnessHealthTitle}>Estado de Salud</Text>
                </View>
                <View style={styles.wellnessHealthGrid}>
                  <View style={styles.wellnessHealthItem}>
                    <Icon name="calendar" size={14} color="#2196F3" />
                    <Text style={styles.wellnessHealthLabel}>Última revisión:</Text>
                    <Text style={styles.wellnessHealthValue}>{plan.health.lastCheckup}</Text>
                  </View>
                  <View style={styles.wellnessHealthItem}>
                    <Icon name="calendar" size={14} color="#FF9800" />
                    <Text style={styles.wellnessHealthLabel}>Próxima revisión:</Text>
                    <Text style={styles.wellnessHealthValue}>{plan.health.nextCheckup}</Text>
                  </View>
                  <View style={styles.wellnessHealthItem}>
                    <Icon name="bug" size={14} color="#9C27B0" />
                    <Text style={styles.wellnessHealthLabel}>Alergias:</Text>
                    <Text style={styles.wellnessHealthValue}>
                      {plan.health.allergies.length > 0 ? plan.health.allergies.join(', ') : 'Ninguna'}
                    </Text>
                  </View>
                  <View style={styles.wellnessHealthItem}>
                    <Icon name="alert-circle" size={14} color="#F44336" />
                    <Text style={styles.wellnessHealthLabel}>Condiciones:</Text>
                    <Text style={styles.wellnessHealthValue}>
                      {plan.health.conditions.length > 0 ? plan.health.conditions.join(', ') : 'Ninguna'}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Vacunaciones */}
              <View style={styles.wellnessVaccinations}>
                <View style={styles.wellnessVaccinationsHeader}>
                  <Icon name="shield" size={16} color="#4CAF50" />
                  <Text style={styles.wellnessVaccinationsTitle}>Vacunaciones</Text>
                </View>
                <View style={styles.wellnessVaccinationsList}>
                  {plan.health.vaccinations.map((vaccination, index) => {
                    const status = getVaccinationStatus(vaccination);
                    return (
                      <View key={index} style={styles.wellnessVaccinationItem}>
                        <View style={styles.wellnessVaccinationInfo}>
                          <Text style={styles.wellnessVaccinationName}>{vaccination.name}</Text>
                          <Text style={styles.wellnessVaccinationDate}>
                            Última: {vaccination.date} | Próxima: {vaccination.next}
                          </Text>
              </View>
                        <View style={[
                          styles.wellnessVaccinationStatus,
                          { backgroundColor: status.color }
                        ]}>
                          <Text style={styles.wellnessVaccinationStatusText}>{status.status}</Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>

              {/* Medicamentos */}
              {plan.health.medications.length > 0 && (
                <View style={styles.wellnessMedications}>
                  <View style={styles.wellnessMedicationsHeader}>
                    <Icon name="medical" size={16} color="#2196F3" />
                    <Text style={styles.wellnessMedicationsTitle}>Medicamentos</Text>
                  </View>
                  <View style={styles.wellnessMedicationsList}>
                    {plan.health.medications.map((medication, index) => {
                      const status = getMedicationStatus(medication);
                      return (
                        <View key={index} style={styles.wellnessMedicationItem}>
                          <View style={styles.wellnessMedicationInfo}>
                            <Text style={styles.wellnessMedicationName}>{medication.name}</Text>
                            <Text style={styles.wellnessMedicationDosage}>
                              {medication.dosage} - {medication.duration}
                            </Text>
                          </View>
                          <View style={[
                            styles.wellnessMedicationStatus,
                            { backgroundColor: status.color }
                          ]}>
                            <Text style={styles.wellnessMedicationStatusText}>{status.status}</Text>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                </View>
              )}

              {/* Rutina de bienestar */}
              <View style={styles.wellnessRoutine}>
                <View style={styles.wellnessRoutineHeader}>
                  <Icon name="fitness" size={16} color="#FF9800" />
                  <Text style={styles.wellnessRoutineTitle}>Rutina de Bienestar</Text>
                </View>
                <View style={styles.wellnessRoutineGrid}>
                  <View style={styles.wellnessRoutineItem}>
                    <Icon name="walk" size={14} color="#4CAF50" />
                    <Text style={styles.wellnessRoutineLabel}>Ejercicio:</Text>
                    <Text style={styles.wellnessRoutineValue}>{plan.wellness.exercise}</Text>
                  </View>
                  <View style={styles.wellnessRoutineItem}>
                    <Icon name="cut" size={14} color="#9C27B0" />
                    <Text style={styles.wellnessRoutineLabel}>Aseo:</Text>
                    <Text style={styles.wellnessRoutineValue}>{plan.wellness.grooming}</Text>
                  </View>
                  <View style={styles.wellnessRoutineItem}>
                    <Icon name="restaurant" size={14} color="#FF6B35" />
                    <Text style={styles.wellnessRoutineLabel}>Nutrición:</Text>
                    <Text style={styles.wellnessRoutineValue}>{plan.wellness.nutrition}</Text>
                  </View>
                  <View style={styles.wellnessRoutineItem}>
                    <Icon name="brain" size={14} color="#2196F3" />
                    <Text style={styles.wellnessRoutineLabel}>Mental:</Text>
                    <Text style={styles.wellnessRoutineValue}>{plan.wellness.mental}</Text>
                  </View>
                </View>
              </View>

              {/* Horario de alimentación */}
              <View style={styles.wellnessFeeding}>
                <View style={styles.wellnessFeedingHeader}>
                  <Icon name="restaurant" size={16} color="#FF6B35" />
                  <Text style={styles.wellnessFeedingTitle}>Horario de Alimentación</Text>
                </View>
                <View style={styles.wellnessFeedingList}>
                  <View style={styles.wellnessFeedingItem}>
                    <View style={styles.wellnessFeedingTime}>
                      <Icon name="sunny" size={14} color="#FF9800" />
                      <Text style={styles.wellnessFeedingTimeText}>Mañana</Text>
                    </View>
                    <Text style={styles.wellnessFeedingText}>{plan.schedule.feeding.morning}</Text>
                  </View>
                  <View style={styles.wellnessFeedingItem}>
                    <View style={styles.wellnessFeedingTime}>
                      <Icon name="moon" size={14} color="#2196F3" />
                      <Text style={styles.wellnessFeedingTimeText}>Noche</Text>
                    </View>
                    <Text style={styles.wellnessFeedingText}>{plan.schedule.feeding.evening}</Text>
                  </View>
                </View>
              </View>

              {/* Horario de ejercicio */}
              <View style={styles.wellnessExercise}>
                <View style={styles.wellnessExerciseHeader}>
                  <Icon name="fitness" size={16} color="#4CAF50" />
                  <Text style={styles.wellnessExerciseTitle}>Horario de Ejercicio</Text>
                </View>
                <View style={styles.wellnessExerciseList}>
                  <View style={styles.wellnessExerciseItem}>
                    <View style={styles.wellnessExerciseTime}>
                      <Icon name="sunny" size={14} color="#FF9800" />
                      <Text style={styles.wellnessExerciseTimeText}>Mañana</Text>
                    </View>
                    <Text style={styles.wellnessExerciseText}>{plan.schedule.exercise.morning}</Text>
                  </View>
                  <View style={styles.wellnessExerciseItem}>
                    <View style={styles.wellnessExerciseTime}>
                      <Icon name="partly-sunny" size={14} color="#FFC107" />
                      <Text style={styles.wellnessExerciseTimeText}>Tarde</Text>
                    </View>
                    <Text style={styles.wellnessExerciseText}>{plan.schedule.exercise.afternoon}</Text>
                  </View>
                  <View style={styles.wellnessExerciseItem}>
                    <View style={styles.wellnessExerciseTime}>
                      <Icon name="moon" size={14} color="#2196F3" />
                      <Text style={styles.wellnessExerciseTimeText}>Noche</Text>
                    </View>
                    <Text style={styles.wellnessExerciseText}>{plan.schedule.exercise.evening}</Text>
                  </View>
                </View>
              </View>

              {/* Información veterinaria */}
              <View style={styles.wellnessVetInfo}>
                <View style={styles.wellnessVetHeader}>
                  <Icon name="business" size={16} color="#6B7280" />
                  <Text style={styles.wellnessVetTitle}>Información Veterinaria</Text>
                </View>
                <View style={styles.wellnessVetDetails}>
                  <View style={styles.wellnessVetItem}>
                    <Icon name="business" size={14} color="#6B7280" />
                    <Text style={styles.wellnessVetLabel}>Clínica:</Text>
                    <Text style={styles.wellnessVetValue}>{plan.clinic}</Text>
                  </View>
                  <View style={styles.wellnessVetItem}>
                    <Icon name="person" size={14} color="#4CAF50" />
                    <Text style={styles.wellnessVetLabel}>Veterinario:</Text>
                    <Text style={styles.wellnessVetValue}>{plan.veterinarian}</Text>
                  </View>
                </View>
              </View>

              {/* Características de la mascota */}
              <View style={styles.wellnessCharacteristics}>
                <View style={styles.wellnessCharacteristicsHeader}>
                  <Icon name="eye" size={16} color="#9C27B0" />
                  <Text style={styles.wellnessCharacteristicsTitle}>Características</Text>
                </View>
                <View style={styles.wellnessCharacteristicsGrid}>
                  <View style={styles.wellnessCharacteristicItem}>
                    <Text style={styles.wellnessCharacteristicLabel}>Personalidad:</Text>
                    <Text style={styles.wellnessCharacteristicValue}>{plan.personality}</Text>
                  </View>
                  <View style={styles.wellnessCharacteristicItem}>
                    <Text style={styles.wellnessCharacteristicLabel}>Pelaje:</Text>
                    <Text style={styles.wellnessCharacteristicValue}>{plan.coat}</Text>
                  </View>
                  <View style={styles.wellnessCharacteristicItem}>
                    <Text style={styles.wellnessCharacteristicLabel}>Marcas:</Text>
                    <Text style={styles.wellnessCharacteristicValue}>{plan.markings}</Text>
                  </View>
                  <View style={styles.wellnessCharacteristicItem}>
                    <Text style={styles.wellnessCharacteristicLabel}>Favoritos:</Text>
                    <Text style={styles.wellnessCharacteristicValue}>{plan.favoriteThings}</Text>
                  </View>
                </View>
              </View>

              {/* Recordatorios */}
              <View style={styles.wellnessReminders}>
                <View style={styles.wellnessRemindersHeader}>
                  <Icon name="alarm" size={16} color="#FF9800" />
                  <Text style={styles.wellnessRemindersTitle}>Recordatorios Importantes</Text>
                </View>
                <View style={styles.wellnessRemindersList}>
                  {plan.reminders.map((reminder, index) => (
                    <View key={index} style={styles.wellnessReminderItem}>
                      <Icon name="calendar" size={14} color="#FF9800" />
                      <Text style={styles.wellnessReminderText}>{reminder}</Text>
            </View>
          ))}
                </View>
              </View>

              {/* Notas */}
              {plan.notes && (
                <View style={styles.wellnessNotes}>
                  <View style={styles.wellnessNotesHeader}>
                    <Icon name="document-text" size={16} color="#6B7280" />
                    <Text style={styles.wellnessNotesTitle}>Notas del Veterinario</Text>
                  </View>
                  <Text style={styles.wellnessNotesText}>{plan.notes}</Text>
                </View>
              )}

              {/* Botones de acción */}
              <View style={styles.wellnessActions}>
                <TouchableOpacity style={styles.wellnessActionButton}>
                  <Icon name="create-outline" size={16} color="#2196F3" />
                  <Text style={styles.wellnessActionText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.wellnessActionButton}>
                  <Icon name="share-outline" size={16} color="#4CAF50" />
                  <Text style={styles.wellnessActionText}>Compartir</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.wellnessActionButton}>
                  <Icon name="download-outline" size={16} color="#FF9800" />
                  <Text style={styles.wellnessActionText}>Exportar</Text>
                </TouchableOpacity>
    </View>
            </View>
          ))}
        </View>

        {/* Estado vacío si no hay planes */}
        {sampleWellnessPlans.length === 0 && (
          <View style={styles.wellnessEmptyState}>
            <View style={styles.wellnessEmptyIcon}>
              <Icon name="medical-outline" size={64} color="#E0E0E0" />
            </View>
            <Text style={styles.wellnessEmptyTitle}>No hay planes de bienestar</Text>
            <Text style={styles.wellnessEmptySubtitle}>
              Crea tu primer plan de bienestar para tu mascota
            </Text>
            <TouchableOpacity 
              style={styles.wellnessEmptyButton}
              onPress={openAddWellnessModal}
            >
              <Icon name="add" size={20} color="#FFFFFF" />
              <Text style={styles.wellnessEmptyButtonText}>Crear Plan</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    );
  };

  const renderAnimalOrganizer = () => {
    // Datos de ejemplo para el organizador de animales
    const sampleAnimalOrganizers = [
      {
        id: '1',
        name: 'Max',
        type: 'Perro',
        breed: 'Golden Retriever',
        age: '3 años',
        birth: '15 Marzo 2021',
        adoptionDate: '20 Abril 2021',
        gender: 'Macho',
        microchip: 'Sí - Nº 123456789',
        coat: 'Largo, dorado, sedoso',
        markings: 'Mancha blanca en el pecho, patas blancas',
        vetName: 'Dr. Carlos Ruiz',
        contactNumber: '+34 91 123 4567',
        foodAllergies: 'Pollo, maíz',
        medicalAllergies: 'Penicilina',
        favoriteToy: 'Pelota de tenis',
        favoriteTreat: 'Huesos de pollo',
        favoriteActivity: 'Jugar a buscar la pelota',
        favoriteFood: 'Croquetas de cordero',
        health: {
          weight: '28.5 kg',
          lastCheckup: '15 Nov 2024',
          nextCheckup: '15 Feb 2025',
          vaccinations: 'Al día',
          overall: 'Excelente'
        },
        care: {
          feeding: '2 veces al día',
          exercise: '2 horas diarias',
          grooming: 'Cepillado diario',
          training: 'Obediencia básica completada'
        },
        tasks: [
          { name: 'Lavar tazones', completed: true, priority: 'high' },
          { name: 'Llenar agua', completed: true, priority: 'high' },
          { name: 'Llenar comida', completed: false, priority: 'high' },
          { name: 'Ejercicio/Juego', completed: false, priority: 'medium' },
          { name: 'Aseo', completed: true, priority: 'medium' },
          { name: 'Limpiar desechos', completed: false, priority: 'high' },
          { name: 'Ofrecer premio', completed: true, priority: 'low' }
        ],
        schedule: {
          morning: '07:00 - Desayuno y paseo',
          afternoon: '14:00 - Juego y ejercicio',
          evening: '19:00 - Cena y paseo nocturno'
        },
        reminders: [
          'Vacuna de refuerzo - 15 Feb 2025',
          'Corte de uñas - Esta semana',
          'Revisión dental - Marzo 2025',
          'Renovar microchip - Abril 2025'
        ],
        notes: 'Max es muy activo y necesita mucho ejercicio. Le encanta jugar con la pelota y es muy sociable con otros perros. Mantener rutina de ejercicio diaria.',
        photos: ['max_1.jpg', 'max_2.jpg', 'max_3.jpg']
      },
      {
        id: '2',
        name: 'Luna',
        type: 'Gato',
        breed: 'Persa',
        age: '2 años',
        birth: '10 Junio 2022',
        adoptionDate: '25 Junio 2022',
        gender: 'Hembra',
        microchip: 'Sí - Nº 987654321',
        coat: 'Largo, gris plateado, muy suave',
        markings: 'Cara plana, ojos azules, cola esponjosa',
        vetName: 'Dra. Ana López',
        contactNumber: '+34 93 987 6543',
        foodAllergies: 'Pescado',
        medicalAllergies: 'Ninguna',
        favoriteToy: 'Pluma con plumas',
        favoriteTreat: 'Atún en lata',
        favoriteActivity: 'Dormir en el sofá',
        favoriteFood: 'Alimento húmedo premium',
        health: {
          weight: '4.8 kg',
          lastCheckup: '20 Nov 2024',
          nextCheckup: '20 Feb 2025',
          vaccinations: 'Al día',
          overall: 'Muy bueno'
        },
        care: {
          feeding: '3 veces al día',
          exercise: '30 min diarios',
          grooming: 'Cepillado 2 veces por semana',
          training: 'Uso de arenero completado'
        },
        tasks: [
          { name: 'Lavar tazones', completed: true, priority: 'high' },
          { name: 'Llenar agua', completed: true, priority: 'high' },
          { name: 'Llenar comida', completed: true, priority: 'high' },
          { name: 'Ejercicio/Juego', completed: false, priority: 'medium' },
          { name: 'Aseo', completed: false, priority: 'medium' },
          { name: 'Limpiar arenero', completed: true, priority: 'high' },
          { name: 'Ofrecer premio', completed: false, priority: 'low' }
        ],
        schedule: {
          morning: '08:00 - Desayuno y aseo',
          afternoon: '15:00 - Siesta y juego ligero',
          evening: '20:00 - Cena y relajación'
        },
        reminders: [
          'Vacuna de refuerzo - 20 Feb 2025',
          'Corte de uñas - Próxima semana',
          'Limpieza dental - Abril 2025',
          'Renovar microchip - Junio 2025'
        ],
        notes: 'Luna es muy tranquila y cariñosa. Le gusta dormir mucho y necesita cepillado regular por su pelo largo. Es muy independiente pero disfruta de la compañía.',
        photos: ['luna_1.jpg', 'luna_2.jpg']
      }
    ];

    // Estadísticas del organizador
    const organizerStats = {
      totalAnimals: sampleAnimalOrganizers.length,
      completedTasks: sampleAnimalOrganizers.reduce((sum, animal) => 
        sum + animal.tasks.filter(task => task.completed).length, 0
      ),
      totalTasks: sampleAnimalOrganizers.reduce((sum, animal) => 
        sum + animal.tasks.length, 0
      ),
      upcomingCheckups: sampleAnimalOrganizers.filter(animal => {
        const nextCheckup = new Date(animal.health.nextCheckup);
        const today = new Date();
        const diffTime = nextCheckup - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 30;
      }).length
    };

    // Funciones auxiliares
    const getAnimalTypeIcon = (type) => {
      switch (type) {
        case 'Perro': return 'paw';
        case 'Gato': return 'heart';
        case 'Pájaro': return 'bird';
        case 'Pez': return 'fish';
        case 'Conejo': return 'bunny';
        default: return 'paw';
      }
    };

    const getAnimalTypeColor = (type) => {
      switch (type) {
        case 'Perro': return '#FF6B35';
        case 'Gato': return '#9C27B0';
        case 'Pájaro': return '#4CAF50';
        case 'Pez': return '#2196F3';
        case 'Conejo': return '#FF9800';
        default: return '#6B7280';
      }
    };

    const getHealthStatusColor = (status) => {
      switch (status) {
        case 'Excelente': return '#4CAF50';
        case 'Muy bueno': return '#8BC34A';
        case 'Bueno': return '#FFC107';
        case 'Regular': return '#FF9800';
        case 'Malo': return '#F44336';
        default: return '#6B7280';
      }
    };

    const getTaskPriorityColor = (priority) => {
      switch (priority) {
        case 'high': return '#F44336';
        case 'medium': return '#FF9800';
        case 'low': return '#4CAF50';
        default: return '#6B7280';
      }
    };

    const getTaskPriorityIcon = (priority) => {
      switch (priority) {
        case 'high': return 'alert-circle';
        case 'medium': return 'time';
        case 'low': return 'checkmark-circle';
        default: return 'ellipse';
      }
    };

    const getGenderIcon = (gender) => {
      return gender === 'Macho' ? 'male' : 'female';
    };

    const getGenderColor = (gender) => {
      return gender === 'Macho' ? '#2196F3' : '#E91E63';
    };

    return (
      <ScrollView style={styles.organizerContainer} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.organizerHeader}>
          <View style={styles.organizerHeaderContent}>
            <View style={styles.organizerHeaderIcon}>
              <Icon name="list" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.organizerHeaderText}>
              <Text style={styles.organizerHeaderTitle}>Organizador de Animales</Text>
              <Text style={styles.organizerHeaderSubtitle}>
                Gestión completa de tus mascotas
              </Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.organizerAddButton}
            onPress={openAddOrganizerModal}
          >
            <Icon name="add" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

        {/* Estadísticas del organizador */}
        <View style={styles.organizerStats}>
          <View style={styles.organizerStatCard}>
            <View style={styles.organizerStatIcon}>
              <Icon name="paw-outline" size={20} color="#FF6B35" />
        </View>
            <View style={styles.organizerStatContent}>
              <Text style={styles.organizerStatNumber}>{organizerStats.totalAnimals}</Text>
              <Text style={styles.organizerStatLabel}>Animales</Text>
            </View>
          </View>
          <View style={styles.organizerStatCard}>
            <View style={styles.organizerStatIcon}>
              <Icon name="checkmark-circle" size={20} color="#4CAF50" />
            </View>
            <View style={styles.organizerStatContent}>
              <Text style={styles.organizerStatNumber}>{organizerStats.completedTasks}</Text>
              <Text style={styles.organizerStatLabel}>Tareas</Text>
            </View>
          </View>
          <View style={styles.organizerStatCard}>
            <View style={styles.organizerStatIcon}>
              <Icon name="calendar" size={20} color="#FF9800" />
            </View>
            <View style={styles.organizerStatContent}>
              <Text style={styles.organizerStatNumber}>{organizerStats.upcomingCheckups}</Text>
              <Text style={styles.organizerStatLabel}>Próximas</Text>
            </View>
          </View>
              </View>
              
        {/* Lista de organizadores de animales */}
        <View style={styles.organizerAnimals}>
          {sampleAnimalOrganizers.map((animal) => (
            <View key={animal.id} style={styles.organizerAnimalCard}>
              {/* Header del animal */}
              <View style={styles.organizerAnimalHeader}>
                <View style={styles.organizerAnimalInfo}>
                  <Text style={styles.organizerAnimalName}>{animal.name}</Text>
                  <Text style={styles.organizerAnimalDetails}>{animal.type} • {animal.breed} • {animal.age}</Text>
                </View>
                <View style={styles.organizerAnimalStatus}>
                  <View style={[
                    styles.organizerHealthBadge,
                    { backgroundColor: getHealthStatusColor(animal.health.overall) }
                  ]}>
                    <Text style={styles.organizerHealthText}>
                      {animal.health.overall}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Información básica del animal */}
              <View style={styles.organizerBasicInfo}>
                <View style={styles.organizerAnimalType}>
                  <View style={[
                    styles.organizerTypeIcon,
                    { backgroundColor: getAnimalTypeColor(animal.type) }
                  ]}>
                    <Icon 
                      name={getAnimalTypeIcon(animal.type)} 
                      size={16} 
                      color="#FFFFFF" 
                    />
                  </View>
                  <Text style={styles.organizerTypeText}>{animal.type}</Text>
                </View>
                <View style={styles.organizerGenderInfo}>
                  <Icon 
                    name={getGenderIcon(animal.gender)} 
                    size={16} 
                    color={getGenderColor(animal.gender)} 
                  />
                  <Text style={styles.organizerGenderText}>{animal.gender}</Text>
                </View>
                <View style={styles.organizerWeightInfo}>
                  <Icon name="scale" size={16} color="#6B7280" />
                  <Text style={styles.organizerWeightText}>{animal.health.weight}</Text>
                </View>
                </View>

              {/* Perfil del animal */}
              <View style={styles.organizerProfile}>
                <View style={styles.organizerProfileHeader}>
                  <Icon name="person" size={16} color="#2196F3" />
                  <Text style={styles.organizerProfileTitle}>Perfil</Text>
                </View>
                <View style={styles.organizerProfileGrid}>
                  <View style={styles.organizerProfileItem}>
                    <Icon name="calendar" size={14} color="#6B7280" />
                    <Text style={styles.organizerProfileLabel}>Nacimiento:</Text>
                    <Text style={styles.organizerProfileValue}>{animal.birth}</Text>
                  </View>
                  <View style={styles.organizerProfileItem}>
                    <Icon name="heart" size={14} color="#E91E63" />
                    <Text style={styles.organizerProfileLabel}>Adopción:</Text>
                    <Text style={styles.organizerProfileValue}>{animal.adoptionDate}</Text>
                  </View>
                  <View style={styles.organizerProfileItem}>
                    <Icon name="card" size={14} color="#4CAF50" />
                    <Text style={styles.organizerProfileLabel}>Microchip:</Text>
                    <Text style={styles.organizerProfileValue}>{animal.microchip}</Text>
                  </View>
                  <View style={styles.organizerProfileItem}>
                    <Icon name="color-palette" size={14} color="#9C27B0" />
                    <Text style={styles.organizerProfileLabel}>Pelaje:</Text>
                    <Text style={styles.organizerProfileValue}>{animal.coat}</Text>
                  </View>
                </View>
                <View style={styles.organizerMarkings}>
                  <Text style={styles.organizerMarkingsLabel}>Marcas distintivas:</Text>
                  <Text style={styles.organizerMarkingsValue}>{animal.markings}</Text>
                </View>
              </View>

              {/* Información médica */}
              <View style={styles.organizerMedical}>
                <View style={styles.organizerMedicalHeader}>
                  <Icon name="medical" size={16} color="#4CAF50" />
                  <Text style={styles.organizerMedicalTitle}>Información Médica</Text>
                  </View>
                <View style={styles.organizerMedicalGrid}>
                  <View style={styles.organizerMedicalItem}>
                    <Icon name="business" size={14} color="#6B7280" />
                    <Text style={styles.organizerMedicalLabel}>Veterinario:</Text>
                    <Text style={styles.organizerMedicalValue}>{animal.vetName}</Text>
                  </View>
                  <View style={styles.organizerMedicalItem}>
                    <Icon name="call" size={14} color="#4CAF50" />
                    <Text style={styles.organizerMedicalLabel}>Teléfono:</Text>
                    <Text style={styles.organizerMedicalValue}>{animal.contactNumber}</Text>
                  </View>
                  <View style={styles.organizerMedicalItem}>
                    <Icon name="restaurant" size={14} color="#FF6B35" />
                    <Text style={styles.organizerMedicalLabel}>Alergias alimentarias:</Text>
                    <Text style={styles.organizerMedicalValue}>{animal.foodAllergies}</Text>
                  </View>
                  <View style={styles.organizerMedicalItem}>
                    <Icon name="medical" size={14} color="#F44336" />
                    <Text style={styles.organizerMedicalLabel}>Alergias médicas:</Text>
                    <Text style={styles.organizerMedicalValue}>{animal.medicalAllergies}</Text>
                  </View>
                </View>
              </View>
              
              {/* Preferencias del animal */}
              <View style={styles.organizerPreferences}>
                <View style={styles.organizerPreferencesHeader}>
                  <Icon name="heart" size={16} color="#E91E63" />
                  <Text style={styles.organizerPreferencesTitle}>Preferencias</Text>
                </View>
                <View style={styles.organizerPreferencesGrid}>
                  <View style={styles.organizerPreferenceItem}>
                    <Icon name="game-controller" size={14} color="#FF9800" />
                    <Text style={styles.organizerPreferenceLabel}>Juguete favorito:</Text>
                    <Text style={styles.organizerPreferenceValue}>{animal.favoriteToy}</Text>
                  </View>
                  <View style={styles.organizerPreferenceItem}>
                    <Icon name="gift" size={14} color="#4CAF50" />
                    <Text style={styles.organizerPreferenceLabel}>Premio favorito:</Text>
                    <Text style={styles.organizerPreferenceValue}>{animal.favoriteTreat}</Text>
                  </View>
                  <View style={styles.organizerPreferenceItem}>
                    <Icon name="fitness" size={14} color="#2196F3" />
                    <Text style={styles.organizerPreferenceLabel}>Actividad favorita:</Text>
                    <Text style={styles.organizerPreferenceValue}>{animal.favoriteActivity}</Text>
                  </View>
                  <View style={styles.organizerPreferenceItem}>
                    <Icon name="restaurant" size={14} color="#FF6B35" />
                    <Text style={styles.organizerPreferenceLabel}>Comida favorita:</Text>
                    <Text style={styles.organizerPreferenceValue}>{animal.favoriteFood}</Text>
                  </View>
                </View>
              </View>

              {/* Tareas del animal */}
              <View style={styles.organizerTasks}>
                <View style={styles.organizerTasksHeader}>
                  <Icon name="list" size={16} color="#FF9800" />
                  <Text style={styles.organizerTasksTitle}>Tareas Diarias</Text>
                  <Text style={styles.organizerTasksCount}>
                    {animal.tasks.filter(task => task.completed).length}/{animal.tasks.length}
                  </Text>
                </View>
                <View style={styles.organizerTasksList}>
                  {animal.tasks.map((task, index) => (
                    <View key={index} style={styles.organizerTaskItem}>
                      <View style={styles.organizerTaskInfo}>
                        <Icon 
                          name={task.completed ? "checkmark-circle" : "ellipse-outline"} 
                          size={16} 
                          color={task.completed ? "#4CAF50" : "#6B7280"} 
                        />
                        <Text style={[
                          styles.organizerTaskText,
                          { textDecorationLine: task.completed ? 'line-through' : 'none' }
                        ]}>
                          {task.name}
                        </Text>
                      </View>
                      <View style={[
                        styles.organizerTaskPriority,
                        { backgroundColor: getTaskPriorityColor(task.priority) }
                      ]}>
                        <Icon 
                          name={getTaskPriorityIcon(task.priority)} 
                          size={12} 
                          color="#FFFFFF" 
                        />
              </View>
            </View>
          ))}
                </View>
              </View>

              {/* Horario del animal */}
              <View style={styles.organizerSchedule}>
                <View style={styles.organizerScheduleHeader}>
                  <Icon name="time" size={16} color="#9C27B0" />
                  <Text style={styles.organizerScheduleTitle}>Horario Diario</Text>
                </View>
                <View style={styles.organizerScheduleList}>
                  <View style={styles.organizerScheduleItem}>
                    <View style={styles.organizerScheduleTime}>
                      <Icon name="sunny" size={14} color="#FF9800" />
                      <Text style={styles.organizerScheduleTimeText}>Mañana</Text>
                    </View>
                    <Text style={styles.organizerScheduleText}>{animal.schedule.morning}</Text>
                  </View>
                  <View style={styles.organizerScheduleItem}>
                    <View style={styles.organizerScheduleTime}>
                      <Icon name="partly-sunny" size={14} color="#FFC107" />
                      <Text style={styles.organizerScheduleTimeText}>Tarde</Text>
                    </View>
                    <Text style={styles.organizerScheduleText}>{animal.schedule.afternoon}</Text>
                  </View>
                  <View style={styles.organizerScheduleItem}>
                    <View style={styles.organizerScheduleTime}>
                      <Icon name="moon" size={14} color="#2196F3" />
                      <Text style={styles.organizerScheduleTimeText}>Noche</Text>
                    </View>
                    <Text style={styles.organizerScheduleText}>{animal.schedule.evening}</Text>
                  </View>
                </View>
              </View>

              {/* Cuidados del animal */}
              <View style={styles.organizerCare}>
                <View style={styles.organizerCareHeader}>
                  <Icon name="heart" size={16} color="#4CAF50" />
                  <Text style={styles.organizerCareTitle}>Cuidados</Text>
                </View>
                <View style={styles.organizerCareGrid}>
                  <View style={styles.organizerCareItem}>
                    <Icon name="restaurant" size={14} color="#FF6B35" />
                    <Text style={styles.organizerCareLabel}>Alimentación:</Text>
                    <Text style={styles.organizerCareValue}>{animal.care.feeding}</Text>
                  </View>
                  <View style={styles.organizerCareItem}>
                    <Icon name="fitness" size={14} color="#4CAF50" />
                    <Text style={styles.organizerCareLabel}>Ejercicio:</Text>
                    <Text style={styles.organizerCareValue}>{animal.care.exercise}</Text>
                  </View>
                  <View style={styles.organizerCareItem}>
                    <Icon name="cut" size={14} color="#9C27B0" />
                    <Text style={styles.organizerCareLabel}>Aseo:</Text>
                    <Text style={styles.organizerCareValue}>{animal.care.grooming}</Text>
                  </View>
                  <View style={styles.organizerCareItem}>
                    <Icon name="school" size={14} color="#2196F3" />
                    <Text style={styles.organizerCareLabel}>Entrenamiento:</Text>
                    <Text style={styles.organizerCareValue}>{animal.care.training}</Text>
                  </View>
                </View>
              </View>

              {/* Recordatorios */}
              <View style={styles.organizerReminders}>
                <View style={styles.organizerRemindersHeader}>
                  <Icon name="alarm" size={16} color="#FF9800" />
                  <Text style={styles.organizerRemindersTitle}>Recordatorios Importantes</Text>
                </View>
                <View style={styles.organizerRemindersList}>
                  {animal.reminders.map((reminder, index) => (
                    <View key={index} style={styles.organizerReminderItem}>
                      <Icon name="calendar" size={14} color="#FF9800" />
                      <Text style={styles.organizerReminderText}>{reminder}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Notas */}
              {animal.notes && (
                <View style={styles.organizerNotes}>
                  <View style={styles.organizerNotesHeader}>
                    <Icon name="document-text" size={16} color="#6B7280" />
                    <Text style={styles.organizerNotesTitle}>Notas</Text>
                  </View>
                  <Text style={styles.organizerNotesText}>{animal.notes}</Text>
                </View>
              )}

              {/* Botones de acción */}
              <View style={styles.organizerActions}>
                <TouchableOpacity style={styles.organizerActionButton}>
                  <Icon name="create-outline" size={16} color="#2196F3" />
                  <Text style={styles.organizerActionText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.organizerActionButton}>
                  <Icon name="share-outline" size={16} color="#4CAF50" />
                  <Text style={styles.organizerActionText}>Compartir</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.organizerActionButton}>
                  <Icon name="download-outline" size={16} color="#FF9800" />
                  <Text style={styles.organizerActionText}>Exportar</Text>
                </TouchableOpacity>
    </View>
            </View>
          ))}
        </View>

        {/* Estado vacío si no hay organizadores */}
        {sampleAnimalOrganizers.length === 0 && (
          <View style={styles.organizerEmptyState}>
            <View style={styles.organizerEmptyIcon}>
              <Icon name="list-outline" size={64} color="#E0E0E0" />
            </View>
            <Text style={styles.organizerEmptyTitle}>No hay organizadores</Text>
            <Text style={styles.organizerEmptySubtitle}>
              Crea tu primer organizador para tu mascota
            </Text>
            <TouchableOpacity 
              style={styles.organizerEmptyButton}
              onPress={openAddOrganizerModal}
            >
              <Icon name="add" size={20} color="#FFFFFF" />
              <Text style={styles.organizerEmptyButtonText}>Crear Organizador</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    );
  };

  const renderPetSchedule = () => {
    // Datos de ejemplo para el horario de mascotas
    const samplePetSchedules = [
      {
        id: '1',
        petName: 'Max',
        petType: 'Perro',
        breed: 'Golden Retriever',
        age: '3 años',
        avatar: '🐕',
        color: '#FF6B35',
        schedule: {
          monday: [
            { time: '07:00', activity: 'Desayuno', type: 'feeding', completed: true },
            { time: '08:00', activity: 'Paseo matutino', type: 'exercise', completed: true },
            { time: '12:00', activity: 'Agua fresca', type: 'care', completed: false },
            { time: '14:00', activity: 'Juego en el jardín', type: 'play', completed: false },
            { time: '19:00', activity: 'Cena', type: 'feeding', completed: false },
            { time: '20:00', activity: 'Paseo nocturno', type: 'exercise', completed: false },
            { time: '22:00', activity: 'Tiempo de descanso', type: 'rest', completed: false }
          ],
          tuesday: [
            { time: '07:00', activity: 'Desayuno', type: 'feeding', completed: true },
            { time: '08:00', activity: 'Paseo matutino', type: 'exercise', completed: true },
            { time: '12:00', activity: 'Agua fresca', type: 'care', completed: true },
            { time: '14:00', activity: 'Entrenamiento', type: 'training', completed: false },
            { time: '19:00', activity: 'Cena', type: 'feeding', completed: false },
            { time: '20:00', activity: 'Paseo nocturno', type: 'exercise', completed: false },
            { time: '22:00', activity: 'Tiempo de descanso', type: 'rest', completed: false }
          ],
          wednesday: [
            { time: '07:00', activity: 'Desayuno', type: 'feeding', completed: true },
            { time: '08:00', activity: 'Paseo matutino', type: 'exercise', completed: true },
            { time: '12:00', activity: 'Agua fresca', type: 'care', completed: true },
            { time: '14:00', activity: 'Juego con pelota', type: 'play', completed: true },
            { time: '19:00', activity: 'Cena', type: 'feeding', completed: true },
            { time: '20:00', activity: 'Paseo nocturno', type: 'exercise', completed: true },
            { time: '22:00', activity: 'Tiempo de descanso', type: 'rest', completed: true }
          ],
          thursday: [
            { time: '07:00', activity: 'Desayuno', type: 'feeding', completed: false },
            { time: '08:00', activity: 'Paseo matutino', type: 'exercise', completed: false },
            { time: '12:00', activity: 'Agua fresca', type: 'care', completed: false },
            { time: '14:00', activity: 'Visita al veterinario', type: 'medical', completed: false },
            { time: '19:00', activity: 'Cena', type: 'feeding', completed: false },
            { time: '20:00', activity: 'Paseo nocturno', type: 'exercise', completed: false },
            { time: '22:00', activity: 'Tiempo de descanso', type: 'rest', completed: false }
          ],
          friday: [
            { time: '07:00', activity: 'Desayuno', type: 'feeding', completed: false },
            { time: '08:00', activity: 'Paseo matutino', type: 'exercise', completed: false },
            { time: '12:00', activity: 'Agua fresca', type: 'care', completed: false },
            { time: '14:00', activity: 'Socialización', type: 'social', completed: false },
            { time: '19:00', activity: 'Cena', type: 'feeding', completed: false },
            { time: '20:00', activity: 'Paseo nocturno', type: 'exercise', completed: false },
            { time: '22:00', activity: 'Tiempo de descanso', type: 'rest', completed: false }
          ],
          saturday: [
            { time: '08:00', activity: 'Desayuno tardío', type: 'feeding', completed: false },
            { time: '09:00', activity: 'Paseo largo', type: 'exercise', completed: false },
            { time: '12:00', activity: 'Agua fresca', type: 'care', completed: false },
            { time: '15:00', activity: 'Juego en el parque', type: 'play', completed: false },
            { time: '18:00', activity: 'Cena', type: 'feeding', completed: false },
            { time: '19:00', activity: 'Paseo familiar', type: 'exercise', completed: false },
            { time: '22:00', activity: 'Tiempo de descanso', type: 'rest', completed: false }
          ],
          sunday: [
            { time: '08:00', activity: 'Desayuno tardío', type: 'feeding', completed: false },
            { time: '09:00', activity: 'Paseo relajado', type: 'exercise', completed: false },
            { time: '12:00', activity: 'Agua fresca', type: 'care', completed: false },
            { time: '14:00', activity: 'Siesta familiar', type: 'rest', completed: false },
            { time: '18:00', activity: 'Cena', type: 'feeding', completed: false },
            { time: '19:00', activity: 'Paseo nocturno', type: 'exercise', completed: false },
            { time: '22:00', activity: 'Tiempo de descanso', type: 'rest', completed: false }
          ]
        },
        stats: {
          totalActivities: 49,
          completedActivities: 12,
          completionRate: 24,
          streak: 3
        },
        notes: 'Max es muy activo y necesita ejercicio regular. Mantener horarios consistentes para su bienestar.'
      },
      {
        id: '2',
        petName: 'Luna',
        petType: 'Gato',
        breed: 'Persa',
        age: '2 años',
        avatar: '🐱',
        color: '#9C27B0',
        schedule: {
          monday: [
            { time: '08:00', activity: 'Desayuno', type: 'feeding', completed: true },
            { time: '09:00', activity: 'Aseo personal', type: 'grooming', completed: true },
            { time: '12:00', activity: 'Agua fresca', type: 'care', completed: false },
            { time: '15:00', activity: 'Juego con pluma', type: 'play', completed: false },
            { time: '19:00', activity: 'Cena', type: 'feeding', completed: false },
            { time: '21:00', activity: 'Tiempo de relajación', type: 'rest', completed: false }
          ],
          tuesday: [
            { time: '08:00', activity: 'Desayuno', type: 'feeding', completed: true },
            { time: '09:00', activity: 'Aseo personal', type: 'grooming', completed: true },
            { time: '12:00', activity: 'Agua fresca', type: 'care', completed: true },
            { time: '15:00', activity: 'Juego con pluma', type: 'play', completed: true },
            { time: '19:00', activity: 'Cena', type: 'feeding', completed: true },
            { time: '21:00', activity: 'Tiempo de relajación', type: 'rest', completed: true }
          ],
          wednesday: [
            { time: '08:00', activity: 'Desayuno', type: 'feeding', completed: true },
            { time: '09:00', activity: 'Aseo personal', type: 'grooming', completed: true },
            { time: '12:00', activity: 'Agua fresca', type: 'care', completed: true },
            { time: '15:00', activity: 'Juego con pluma', type: 'play', completed: true },
            { time: '19:00', activity: 'Cena', type: 'feeding', completed: true },
            { time: '21:00', activity: 'Tiempo de relajación', type: 'rest', completed: true }
          ],
          thursday: [
            { time: '08:00', activity: 'Desayuno', type: 'feeding', completed: false },
            { time: '09:00', activity: 'Aseo personal', type: 'grooming', completed: false },
            { time: '12:00', activity: 'Agua fresca', type: 'care', completed: false },
            { time: '15:00', activity: 'Cepillado especial', type: 'grooming', completed: false },
            { time: '19:00', activity: 'Cena', type: 'feeding', completed: false },
            { time: '21:00', activity: 'Tiempo de relajación', type: 'rest', completed: false }
          ],
          friday: [
            { time: '08:00', activity: 'Desayuno', type: 'feeding', completed: false },
            { time: '09:00', activity: 'Aseo personal', type: 'grooming', completed: false },
            { time: '12:00', activity: 'Agua fresca', type: 'care', completed: false },
            { time: '15:00', activity: 'Juego con pluma', type: 'play', completed: false },
            { time: '19:00', activity: 'Cena', type: 'feeding', completed: false },
            { time: '21:00', activity: 'Tiempo de relajación', type: 'rest', completed: false }
          ],
          saturday: [
            { time: '09:00', activity: 'Desayuno tardío', type: 'feeding', completed: false },
            { time: '10:00', activity: 'Aseo personal', type: 'grooming', completed: false },
            { time: '12:00', activity: 'Agua fresca', type: 'care', completed: false },
            { time: '15:00', activity: 'Juego interactivo', type: 'play', completed: false },
            { time: '18:00', activity: 'Cena', type: 'feeding', completed: false },
            { time: '20:00', activity: 'Tiempo de relajación', type: 'rest', completed: false }
          ],
          sunday: [
            { time: '09:00', activity: 'Desayuno tardío', type: 'feeding', completed: false },
            { time: '10:00', activity: 'Aseo personal', type: 'grooming', completed: false },
            { time: '12:00', activity: 'Agua fresca', type: 'care', completed: false },
            { time: '14:00', activity: 'Siesta familiar', type: 'rest', completed: false },
            { time: '18:00', activity: 'Cena', type: 'feeding', completed: false },
            { time: '20:00', activity: 'Tiempo de relajación', type: 'rest', completed: false }
          ]
        },
        stats: {
          totalActivities: 42,
          completedActivities: 18,
          completionRate: 43,
          streak: 5
        },
        notes: 'Luna es tranquila pero necesita estimulación mental. Mantener rutina de aseo regular por su pelo largo.'
      }
    ];

    // Días de la semana
    const days = [
      { key: 'monday', label: 'Lunes', short: 'L' },
      { key: 'tuesday', label: 'Martes', short: 'M' },
      { key: 'wednesday', label: 'Miércoles', short: 'X' },
      { key: 'thursday', label: 'Jueves', short: 'J' },
      { key: 'friday', label: 'Viernes', short: 'V' },
      { key: 'saturday', label: 'Sábado', short: 'S' },
      { key: 'sunday', label: 'Domingo', short: 'D' }
    ];

    // Funciones auxiliares
    const getActivityIcon = (type) => {
      switch (type) {
        case 'feeding': return 'restaurant';
        case 'exercise': return 'fitness';
        case 'play': return 'game-controller';
        case 'care': return 'heart';
        case 'grooming': return 'cut';
        case 'training': return 'school';
        case 'medical': return 'medical';
        case 'social': return 'people';
        case 'rest': return 'bed';
        default: return 'time';
      }
    };

    const getActivityColor = (type) => {
      switch (type) {
        case 'feeding': return '#FF6B35';
        case 'exercise': return '#4CAF50';
        case 'play': return '#FF9800';
        case 'care': return '#E91E63';
        case 'grooming': return '#9C27B0';
        case 'training': return '#2196F3';
        case 'medical': return '#F44336';
        case 'social': return '#00BCD4';
        case 'rest': return '#795548';
        default: return '#6B7280';
      }
    };

    const getActivityLabel = (type) => {
      switch (type) {
        case 'feeding': return 'Alimentación';
        case 'exercise': return 'Ejercicio';
        case 'play': return 'Juego';
        case 'care': return 'Cuidado';
        case 'grooming': return 'Aseo';
        case 'training': return 'Entrenamiento';
        case 'medical': return 'Médico';
        case 'social': return 'Social';
        case 'rest': return 'Descanso';
        default: return 'General';
      }
    };

    const getPetTypeIcon = (type) => {
      switch (type) {
        case 'Perro': return 'paw';
        case 'Gato': return 'heart';
        case 'Pájaro': return 'bird';
        case 'Pez': return 'fish';
        case 'Conejo': return 'bunny';
        default: return 'paw';
      }
    };

    const getPetTypeColor = (type) => {
      switch (type) {
        case 'Perro': return '#FF6B35';
        case 'Gato': return '#9C27B0';
        case 'Pájaro': return '#4CAF50';
        case 'Pez': return '#2196F3';
        case 'Conejo': return '#FF9800';
        default: return '#6B7280';
      }
    };

    const getCurrentPet = () => {
      return samplePetSchedules.find(pet => pet.id === selectedPet) || samplePetSchedules[0];
    };

    const getCurrentDayActivities = () => {
      const pet = getCurrentPet();
      return pet.schedule[selectedDay] || [];
    };

    const getDayStats = () => {
      const activities = getCurrentDayActivities();
      const completed = activities.filter(activity => activity.completed).length;
      const total = activities.length;
      return { completed, total, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
    };

    return (
      <ScrollView style={styles.scheduleContainer} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.scheduleHeader}>
          <View style={styles.scheduleHeaderContent}>
            <View style={styles.scheduleHeaderIcon}>
              <Icon name="calendar" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.scheduleHeaderText}>
              <Text style={styles.scheduleHeaderTitle}>Horario de Mascotas</Text>
              <Text style={styles.scheduleHeaderSubtitle}>
                Organiza las actividades diarias de tus mascotas
              </Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.scheduleAddButton}
            onPress={() => {}}
          >
            <Icon name="add" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
        {/* Selector de mascotas */}
        <View style={styles.schedulePetSelector}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {samplePetSchedules.map((pet) => (
              <TouchableOpacity
                key={pet.id}
                style={[
                  styles.schedulePetCard,
                  { 
                    backgroundColor: selectedPet === pet.id ? pet.color : '#FFFFFF',
                    borderColor: pet.color,
                    borderWidth: selectedPet === pet.id ? 3 : 1
                  }
                ]}
                onPress={() => setSelectedPet(pet.id)}
              >
                <Text style={styles.schedulePetAvatar}>{pet.avatar}</Text>
                <Text style={[
                  styles.schedulePetName,
                  { color: selectedPet === pet.id ? '#FFFFFF' : '#1F2937' }
                ]}>
                  {pet.petName}
                </Text>
                <Text style={[
                  styles.schedulePetType,
                  { color: selectedPet === pet.id ? 'rgba(255, 255, 255, 0.8)' : '#6B7280' }
                ]}>
                  {pet.petType}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Estadísticas de la mascota seleccionada */}
        {(() => {
          const pet = getCurrentPet();
          return (
            <View style={styles.schedulePetStats}>
              <View style={styles.scheduleStatCard}>
                <View style={styles.scheduleStatIcon}>
                  <Icon name="list" size={20} color={pet.color} />
                </View>
                <View style={styles.scheduleStatContent}>
                  <Text style={styles.scheduleStatNumber}>{pet.stats.totalActivities}</Text>
                  <Text style={styles.scheduleStatLabel}>Actividades</Text>
                </View>
              </View>
              <View style={styles.scheduleStatCard}>
                <View style={styles.scheduleStatIcon}>
                  <Icon name="checkmark-circle" size={20} color="#4CAF50" />
                </View>
                <View style={styles.scheduleStatContent}>
                  <Text style={styles.scheduleStatNumber}>{pet.stats.completedActivities}</Text>
                  <Text style={styles.scheduleStatLabel}>Completadas</Text>
                </View>
              </View>
              <View style={styles.scheduleStatCard}>
                <View style={styles.scheduleStatIcon}>
                  <Icon name="trending-up" size={20} color="#FF9800" />
                </View>
                <View style={styles.scheduleStatContent}>
                  <Text style={styles.scheduleStatNumber}>{pet.stats.completionRate}%</Text>
                  <Text style={styles.scheduleStatLabel}>Progreso</Text>
                </View>
              </View>
              <View style={styles.scheduleStatCard}>
                <View style={styles.scheduleStatIcon}>
                  <Icon name="flame" size={20} color="#F44336" />
                </View>
                <View style={styles.scheduleStatContent}>
                  <Text style={styles.scheduleStatNumber}>{pet.stats.streak}</Text>
                  <Text style={styles.scheduleStatLabel}>Racha</Text>
                </View>
      </View>
    </View>
  );
        })()}

        {/* Selector de días */}
        <View style={styles.scheduleDaySelector}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {days.map((day) => (
              <TouchableOpacity
                key={day.key}
                style={[
                  styles.scheduleDayButton,
                  { 
                    backgroundColor: selectedDay === day.key ? getCurrentPet().color : '#FFFFFF',
                    borderColor: getCurrentPet().color,
                    borderWidth: selectedDay === day.key ? 2 : 1
                  }
                ]}
                onPress={() => setSelectedDay(day.key)}
              >
                <Text style={[
                  styles.scheduleDayShort,
                  { color: selectedDay === day.key ? '#FFFFFF' : getCurrentPet().color }
                ]}>
                  {day.short}
                </Text>
                <Text style={[
                  styles.scheduleDayLabel,
                  { color: selectedDay === day.key ? '#FFFFFF' : '#1F2937' }
                ]}>
                  {day.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Estadísticas del día */}
        {(() => {
          const dayStats = getDayStats();
          return (
            <View style={styles.scheduleDayStats}>
              <View style={styles.scheduleDayStatsContent}>
                <Text style={styles.scheduleDayStatsTitle}>
                  {days.find(d => d.key === selectedDay)?.label} - {getCurrentPet().petName}
                </Text>
                <Text style={styles.scheduleDayStatsSubtitle}>
                  {dayStats.completed} de {dayStats.total} actividades completadas
                </Text>
              </View>
              <View style={styles.scheduleDayProgress}>
                <View style={styles.scheduleDayProgressBar}>
                  <View 
                    style={[
                      styles.scheduleDayProgressFill,
                      { 
                        width: `${dayStats.percentage}%`,
                        backgroundColor: getCurrentPet().color
                      }
                    ]}
                  />
                </View>
                <Text style={styles.scheduleDayProgressText}>{dayStats.percentage}%</Text>
              </View>
            </View>
          );
        })()}

        {/* Lista de actividades del día */}
        <View style={styles.scheduleActivities}>
          <Text style={styles.scheduleActivitiesTitle}>Actividades del Día</Text>
          {getCurrentDayActivities().map((activity, index) => (
            <View key={index} style={styles.scheduleActivityItem}>
              <View style={styles.scheduleActivityTime}>
                <Text style={styles.scheduleActivityTimeText}>{activity.time}</Text>
              </View>
              <View style={styles.scheduleActivityContent}>
                <View style={styles.scheduleActivityHeader}>
                  <View style={styles.scheduleActivityInfo}>
                    <View style={[
                      styles.scheduleActivityIcon,
                      { backgroundColor: getActivityColor(activity.type) }
                    ]}>
                      <Icon 
                        name={getActivityIcon(activity.type)} 
                        size={16} 
                        color="#FFFFFF" 
                      />
                    </View>
                    <View style={styles.scheduleActivityText}>
                      <Text style={styles.scheduleActivityName}>{activity.activity}</Text>
                      <Text style={styles.scheduleActivityType}>
                        {getActivityLabel(activity.type)}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity 
                    style={[
                      styles.scheduleActivityCheck,
                      { 
                        backgroundColor: activity.completed ? '#4CAF50' : '#E5E7EB',
                        borderColor: activity.completed ? '#4CAF50' : '#D1D5DB'
                      }
                    ]}
                    onPress={() => {}}
                  >
                    <Icon 
                      name={activity.completed ? "checkmark" : "ellipse-outline"} 
                      size={16} 
                      color={activity.completed ? "#FFFFFF" : "#6B7280"} 
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Notas de la mascota */}
        {getCurrentPet().notes && (
          <View style={styles.scheduleNotes}>
            <View style={styles.scheduleNotesHeader}>
              <Icon name="document-text" size={16} color="#6B7280" />
              <Text style={styles.scheduleNotesTitle}>Notas</Text>
            </View>
            <Text style={styles.scheduleNotesText}>{getCurrentPet().notes}</Text>
          </View>
        )}

        {/* Botones de acción */}
        <View style={styles.scheduleActions}>
          <TouchableOpacity style={styles.scheduleActionButton}>
            <Icon name="create-outline" size={16} color="#2196F3" />
            <Text style={styles.scheduleActionText}>Editar Horario</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.scheduleActionButton}>
            <Icon name="share-outline" size={16} color="#4CAF50" />
            <Text style={styles.scheduleActionText}>Compartir</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.scheduleActionButton}>
            <Icon name="download-outline" size={16} color="#FF9800" />
            <Text style={styles.scheduleActionText}>Exportar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

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

  // Estilos para Planificador de Cuidados
  petCareContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  petCareHeader: {
    backgroundColor: '#FF6B35',
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  petCareHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  petCareHeaderIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  petCareHeaderText: {
    flex: 1,
  },
  petCareHeaderTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  petCareHeaderSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  petCareAddButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  petCareStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  petCareStatCard: {
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
  petCareStatIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  petCareStatContent: {
    alignItems: 'center',
  },
  petCareStatNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginBottom: 5,
  },
  petCareStatLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  petCarePlans: {
    paddingHorizontal: 20,
    gap: 20,
  },
  petCarePlanCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  petCarePlanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  petCarePlanInfo: {
    flex: 1,
  },
  petCarePlanPetName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  petCarePlanDate: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  petCarePlanDetails: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  petCarePlanStatus: {
    alignItems: 'flex-end',
  },
  petCareStatusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  petCareStatusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  petCarePetInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
  },
  petCarePetType: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  petCareTypeIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  petCareTypeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  petCareOwnerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  petCareOwnerText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  petCareHealth: {
    backgroundColor: '#E8F5E8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  petCareHealthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  petCareHealthTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
  },
  petCareHealthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  petCareHealthItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: '45%',
  },
  petCareHealthLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 6,
    marginRight: 4,
  },
  petCareHealthValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  petCareMeals: {
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  petCareMealsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  petCareMealsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
  },
  petCareMealsList: {
    gap: 12,
  },
  petCareMealItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  petCareMealTime: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 80,
    marginRight: 12,
  },
  petCareMealTimeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 4,
  },
  petCareMealText: {
    fontSize: 14,
    color: '#4B5563',
    flex: 1,
  },
  petCareTreats: {
    backgroundColor: '#F3E5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  petCareTreatsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  petCareTreatsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
  },
  petCareTreatsText: {
    fontSize: 14,
    color: '#4B5563',
  },
  petCareActivities: {
    backgroundColor: '#E8F5E8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  petCareActivitiesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  petCareActivitiesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
  },
  petCareActivitiesList: {
    gap: 8,
  },
  petCareActivityItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  petCareActivityText: {
    fontSize: 14,
    color: '#4B5563',
    marginLeft: 8,
  },
  petCareOutdoor: {
    backgroundColor: '#E8F5E8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  petCareOutdoorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  petCareOutdoorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
  },
  petCareOutdoorList: {
    gap: 8,
  },
  petCareOutdoorItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  petCareOutdoorText: {
    fontSize: 14,
    color: '#4B5563',
    marginLeft: 8,
  },
  petCareBedtime: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  petCareBedtimeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  petCareBedtimeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
  },
  petCareBedtimeList: {
    gap: 8,
  },
  petCareBedtimeItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  petCareBedtimeText: {
    fontSize: 14,
    color: '#4B5563',
    marginLeft: 8,
  },
  petCareFavorites: {
    backgroundColor: '#FFEBEE',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  petCareFavoritesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  petCareFavoritesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
  },
  petCareFavoritesList: {
    gap: 8,
  },
  petCareFavoriteItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  petCareFavoriteText: {
    fontSize: 14,
    color: '#4B5563',
    marginLeft: 8,
  },
  petCareReminders: {
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  petCareRemindersHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  petCareRemindersTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
  },
  petCareRemindersList: {
    gap: 8,
  },
  petCareReminderItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  petCareReminderText: {
    fontSize: 14,
    color: '#4B5563',
    marginLeft: 8,
  },
  petCareNotes: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#6B7280',
  },
  petCareNotesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  petCareNotesTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
  },
  petCareNotesText: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18,
  },
  petCareActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  petCareActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
  },
  petCareActionText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  petCareEmptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  petCareEmptyIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  petCareEmptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  petCareEmptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
  },
  petCareEmptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B35',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  petCareEmptyButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },

  // Estilos para Planificador de Cachorros
  puppyContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  puppyHeader: {
    backgroundColor: '#E91E63',
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  puppyHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  puppyHeaderIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  puppyHeaderText: {
    flex: 1,
  },
  puppyHeaderTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  puppyHeaderSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  puppyAddButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  puppyStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  puppyStatCard: {
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
  puppyStatIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  puppyStatContent: {
    alignItems: 'center',
  },
  puppyStatNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E91E63',
    marginBottom: 5,
  },
  puppyStatLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  puppyPlans: {
    paddingHorizontal: 20,
    gap: 20,
  },
  puppyPlanCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  puppyPlanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  puppyPlanInfo: {
    flex: 1,
  },
  puppyPlanPuppyName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  puppyPlanDetails: {
    fontSize: 14,
    color: '#6B7280',
  },
  puppyPlanStatus: {
    alignItems: 'flex-end',
  },
  puppyTrainingBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  puppyTrainingText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  puppyBasicInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
  },
  puppyBreedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  puppyBreedIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  puppyBreedText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  puppySexInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  puppySexText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  puppyAgeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  puppyAgeText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  puppyTraining: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  puppyTrainingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  puppyTrainingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
    flex: 1,
  },
  puppyTrainingProgress: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  puppyProgressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: 12,
  },
  puppyProgressFill: {
    height: '100%',
    backgroundColor: '#2196F3',
    borderRadius: 4,
  },
  puppyCommands: {
    marginBottom: 12,
  },
  puppyCommandsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  puppyCommandsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  puppyCommandItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  puppyCommandText: {
    fontSize: 12,
    color: '#4B5563',
    marginLeft: 4,
  },
  puppyNextGoals: {
    marginBottom: 0,
  },
  puppyNextGoalsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  puppyNextGoalsList: {
    gap: 6,
  },
  puppyNextGoalItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  puppyNextGoalText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 6,
  },
  puppyHealth: {
    backgroundColor: '#E8F5E8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  puppyHealthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  puppyHealthTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
    flex: 1,
  },
  puppyHealthStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  puppyHealthStatusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  puppyHealthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  puppyHealthItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: '45%',
  },
  puppyHealthLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 6,
    marginRight: 4,
  },
  puppyHealthValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  puppySchedule: {
    backgroundColor: '#F3E5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  puppyScheduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  puppyScheduleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
  },
  puppyScheduleList: {
    gap: 8,
  },
  puppyScheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  puppyScheduleTime: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1F2937',
    width: 60,
  },
  puppyScheduleActivity: {
    fontSize: 12,
    color: '#6B7280',
    flex: 1,
    marginLeft: 12,
  },
  puppyActivities: {
    backgroundColor: '#E8F5E8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  puppyActivitiesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  puppyActivitiesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
  },
  puppyActivitiesList: {
    gap: 12,
  },
  puppyActivityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  puppyActivityTime: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 80,
    marginRight: 12,
  },
  puppyActivityTimeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 4,
  },
  puppyActivityText: {
    fontSize: 14,
    color: '#4B5563',
    flex: 1,
  },
  puppyBehaviors: {
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  puppyBehaviorsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  puppyBehaviorsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
  },
  puppyBehaviorsList: {
    gap: 8,
  },
  puppyBehaviorItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  puppyBehaviorText: {
    fontSize: 14,
    color: '#4B5563',
    marginLeft: 8,
  },
  puppyOwnerInfo: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  puppyOwnerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  puppyOwnerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
  },
  puppyOwnerDetails: {
    gap: 8,
  },
  puppyOwnerItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  puppyOwnerLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 6,
    marginRight: 4,
    width: 80,
  },
  puppyOwnerValue: {
    fontSize: 12,
    color: '#4B5563',
    flex: 1,
  },
  puppyVetInfo: {
    backgroundColor: '#FFEBEE',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  puppyVetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  puppyVetTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
  },
  puppyVetDetails: {
    gap: 8,
  },
  puppyVetItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  puppyVetLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 6,
    marginRight: 4,
    width: 120,
  },
  puppyVetValue: {
    fontSize: 12,
    color: '#4B5563',
    flex: 1,
  },
  puppyReminders: {
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  puppyRemindersHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  puppyRemindersTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
  },
  puppyRemindersList: {
    gap: 8,
  },
  puppyReminderItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  puppyReminderText: {
    fontSize: 14,
    color: '#4B5563',
    marginLeft: 8,
  },
  puppyNotes: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#6B7280',
  },
  puppyNotesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  puppyNotesTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
  },
  puppyNotesText: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18,
  },
  puppyActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  puppyActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
  },
  puppyActionText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  puppyEmptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  puppyEmptyIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  puppyEmptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  puppyEmptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
  },
  puppyEmptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E91E63',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  puppyEmptyButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },

  // Estilos para Programador de Bienestar
  wellnessContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  wellnessHeader: {
    backgroundColor: '#4CAF50',
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  wellnessHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  wellnessHeaderIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  wellnessHeaderText: {
    flex: 1,
  },
  wellnessHeaderTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  wellnessHeaderSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  wellnessAddButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wellnessStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  wellnessStatCard: {
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
  wellnessStatIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  wellnessStatContent: {
    alignItems: 'center',
  },
  wellnessStatNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 5,
  },
  wellnessStatLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  wellnessPlans: {
    paddingHorizontal: 20,
    gap: 20,
  },
  wellnessPlanCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  wellnessPlanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  wellnessPlanInfo: {
    flex: 1,
  },
  wellnessPlanPetName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  wellnessPlanDetails: {
    fontSize: 14,
    color: '#6B7280',
  },
  wellnessPlanStatus: {
    alignItems: 'flex-end',
  },
  wellnessHealthBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  wellnessHealthText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  wellnessBasicInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
  },
  wellnessPetType: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wellnessTypeIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  wellnessTypeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  wellnessOwnerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wellnessOwnerText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  wellnessWeightInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wellnessWeightText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  wellnessHealth: {
    backgroundColor: '#E8F5E8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  wellnessHealthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  wellnessHealthTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
  },
  wellnessHealthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  wellnessHealthItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: '45%',
  },
  wellnessHealthLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 6,
    marginRight: 4,
  },
  wellnessHealthValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1F2937',
    flex: 1,
  },
  wellnessVaccinations: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  wellnessVaccinationsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  wellnessVaccinationsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
  },
  wellnessVaccinationsList: {
    gap: 12,
  },
  wellnessVaccinationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
  },
  wellnessVaccinationInfo: {
    flex: 1,
  },
  wellnessVaccinationName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  wellnessVaccinationDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  wellnessVaccinationStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  wellnessVaccinationStatusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  wellnessMedications: {
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  wellnessMedicationsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  wellnessMedicationsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
  },
  wellnessMedicationsList: {
    gap: 12,
  },
  wellnessMedicationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
  },
  wellnessMedicationInfo: {
    flex: 1,
  },
  wellnessMedicationName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  wellnessMedicationDosage: {
    fontSize: 12,
    color: '#6B7280',
  },
  wellnessMedicationStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  wellnessMedicationStatusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  wellnessRoutine: {
    backgroundColor: '#F3E5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  wellnessRoutineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  wellnessRoutineTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
  },
  wellnessRoutineGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  wellnessRoutineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: '45%',
  },
  wellnessRoutineLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 6,
    marginRight: 4,
  },
  wellnessRoutineValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1F2937',
    flex: 1,
  },
  wellnessFeeding: {
    backgroundColor: '#FFEBEE',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  wellnessFeedingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  wellnessFeedingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
  },
  wellnessFeedingList: {
    gap: 12,
  },
  wellnessFeedingItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  wellnessFeedingTime: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 80,
    marginRight: 12,
  },
  wellnessFeedingTimeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 4,
  },
  wellnessFeedingText: {
    fontSize: 14,
    color: '#4B5563',
    flex: 1,
  },
  wellnessExercise: {
    backgroundColor: '#E8F5E8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  wellnessExerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  wellnessExerciseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
  },
  wellnessExerciseList: {
    gap: 12,
  },
  wellnessExerciseItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  wellnessExerciseTime: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 80,
    marginRight: 12,
  },
  wellnessExerciseTimeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 4,
  },
  wellnessExerciseText: {
    fontSize: 14,
    color: '#4B5563',
    flex: 1,
  },
  wellnessVetInfo: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  wellnessVetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  wellnessVetTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
  },
  wellnessVetDetails: {
    gap: 8,
  },
  wellnessVetItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wellnessVetLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 6,
    marginRight: 4,
    width: 80,
  },
  wellnessVetValue: {
    fontSize: 12,
    color: '#4B5563',
    flex: 1,
  },
  wellnessCharacteristics: {
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  wellnessCharacteristicsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  wellnessCharacteristicsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
  },
  wellnessCharacteristicsGrid: {
    gap: 8,
  },
  wellnessCharacteristicItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  wellnessCharacteristicLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginRight: 8,
    width: 80,
  },
  wellnessCharacteristicValue: {
    fontSize: 12,
    color: '#4B5563',
    flex: 1,
  },
  wellnessReminders: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  wellnessRemindersHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  wellnessRemindersTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
  },
  wellnessRemindersList: {
    gap: 8,
  },
  wellnessReminderItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wellnessReminderText: {
    fontSize: 14,
    color: '#4B5563',
    marginLeft: 8,
  },
  wellnessNotes: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#6B7280',
  },
  wellnessNotesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  wellnessNotesTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
  },
  wellnessNotesText: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18,
  },
  wellnessActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  wellnessActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
  },
  wellnessActionText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  wellnessEmptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  wellnessEmptyIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  wellnessEmptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  wellnessEmptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
  },
  wellnessEmptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  wellnessEmptyButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },

  // Estilos para Organizador de Animales
  organizerContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  organizerHeader: {
    backgroundColor: '#9C27B0',
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  organizerHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  organizerHeaderIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  organizerHeaderText: {
    flex: 1,
  },
  organizerHeaderTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  organizerHeaderSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  organizerAddButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  organizerStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  organizerStatCard: {
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
  organizerStatIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  organizerStatContent: {
    alignItems: 'center',
  },
  organizerStatNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#9C27B0',
    marginBottom: 5,
  },
  organizerStatLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  organizerAnimals: {
    paddingHorizontal: 20,
    gap: 20,
  },
  organizerAnimalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  organizerAnimalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  organizerAnimalInfo: {
    flex: 1,
  },
  organizerAnimalName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  organizerAnimalDetails: {
    fontSize: 14,
    color: '#6B7280',
  },
  organizerAnimalStatus: {
    alignItems: 'flex-end',
  },
  organizerHealthBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  organizerHealthText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  organizerBasicInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
  },
  organizerAnimalType: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  organizerTypeIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  organizerTypeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  organizerGenderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  organizerGenderText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  organizerWeightInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  organizerWeightText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  organizerProfile: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  organizerProfileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  organizerProfileTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
  },
  organizerProfileGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  organizerProfileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: '45%',
  },
  organizerProfileLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 6,
    marginRight: 4,
  },
  organizerProfileValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1F2937',
    flex: 1,
  },
  organizerMarkings: {
    marginTop: 12,
  },
  organizerMarkingsLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  organizerMarkingsValue: {
    fontSize: 12,
    color: '#4B5563',
  },
  organizerMedical: {
    backgroundColor: '#E8F5E8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  organizerMedicalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  organizerMedicalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
  },
  organizerMedicalGrid: {
    gap: 8,
  },
  organizerMedicalItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  organizerMedicalLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 6,
    marginRight: 4,
    width: 120,
  },
  organizerMedicalValue: {
    fontSize: 12,
    color: '#4B5563',
    flex: 1,
  },
  organizerPreferences: {
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  organizerPreferencesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  organizerPreferencesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
  },
  organizerPreferencesGrid: {
    gap: 8,
  },
  organizerPreferenceItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  organizerPreferenceLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 6,
    marginRight: 4,
    width: 100,
  },
  organizerPreferenceValue: {
    fontSize: 12,
    color: '#4B5563',
    flex: 1,
  },
  organizerTasks: {
    backgroundColor: '#F3E5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  organizerTasksHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  organizerTasksTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
    flex: 1,
  },
  organizerTasksCount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#9C27B0',
  },
  organizerTasksList: {
    gap: 8,
  },
  organizerTaskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
  },
  organizerTaskInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  organizerTaskText: {
    fontSize: 14,
    color: '#4B5563',
    marginLeft: 8,
    flex: 1,
  },
  organizerTaskPriority: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  organizerSchedule: {
    backgroundColor: '#FFEBEE',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  organizerScheduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  organizerScheduleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
  },
  organizerScheduleList: {
    gap: 12,
  },
  organizerScheduleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  organizerScheduleTime: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 80,
    marginRight: 12,
  },
  organizerScheduleTimeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 4,
  },
  organizerScheduleText: {
    fontSize: 14,
    color: '#4B5563',
    flex: 1,
  },
  organizerCare: {
    backgroundColor: '#E8F5E8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  organizerCareHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  organizerCareTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
  },
  organizerCareGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  organizerCareItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: '45%',
  },
  organizerCareLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 6,
    marginRight: 4,
  },
  organizerCareValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1F2937',
    flex: 1,
  },
  organizerReminders: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  organizerRemindersHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  organizerRemindersTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
  },
  organizerRemindersList: {
    gap: 8,
  },
  organizerReminderItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  organizerReminderText: {
    fontSize: 14,
    color: '#4B5563',
    marginLeft: 8,
  },
  organizerNotes: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#6B7280',
  },
  organizerNotesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  organizerNotesTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
  },
  organizerNotesText: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18,
  },
  organizerActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  organizerActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
  },
  organizerActionText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  organizerEmptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  organizerEmptyIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  organizerEmptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  organizerEmptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
  },
  organizerEmptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#9C27B0',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  organizerEmptyButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },

  // Estilos para Horario de Mascotas
  scheduleContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scheduleHeader: {
    backgroundColor: '#2196F3',
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scheduleHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  scheduleHeaderIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  scheduleHeaderText: {
    flex: 1,
  },
  scheduleHeaderTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  scheduleHeaderSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  scheduleAddButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  schedulePetSelector: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  schedulePetCard: {
    width: 120,
    padding: 16,
    borderRadius: 16,
    marginRight: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  schedulePetAvatar: {
    fontSize: 32,
    marginBottom: 8,
  },
  schedulePetName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  schedulePetType: {
    fontSize: 12,
  },
  schedulePetStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  scheduleStatCard: {
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
  scheduleStatIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  scheduleStatContent: {
    alignItems: 'center',
  },
  scheduleStatNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 5,
  },
  scheduleStatLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  scheduleDaySelector: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  scheduleDayButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginRight: 8,
    alignItems: 'center',
    minWidth: 60,
  },
  scheduleDayShort: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  scheduleDayLabel: {
    fontSize: 12,
  },
  scheduleDayStats: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scheduleDayStatsContent: {
    marginBottom: 16,
  },
  scheduleDayStatsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  scheduleDayStatsSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  scheduleDayProgress: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scheduleDayProgressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginRight: 12,
  },
  scheduleDayProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  scheduleDayProgressText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  scheduleActivities: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  scheduleActivitiesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  scheduleActivityItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scheduleActivityTime: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  scheduleActivityTimeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  scheduleActivityContent: {
    flex: 1,
  },
  scheduleActivityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scheduleActivityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  scheduleActivityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  scheduleActivityText: {
    flex: 1,
  },
  scheduleActivityName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  scheduleActivityType: {
    fontSize: 12,
    color: '#6B7280',
  },
  scheduleActivityCheck: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scheduleNotes: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scheduleNotesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  scheduleNotesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
  },
  scheduleNotesText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  scheduleActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  scheduleActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  scheduleActionText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
    color: '#1F2937',
  },
});

export default PetSections;
