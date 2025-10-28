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
    { id: 'travel-planner', name: 'Planificador de Viajes', icon: 'airplane-outline' },
    { id: 'tour-planner', name: 'Planificador de Tours', icon: 'map-outline' },
    { id: 'journey-scheduler', name: 'Programador de Viajes', icon: 'calendar-outline' },
    { id: 'vacation-scheduler', name: 'Programador de Vacaciones', icon: 'sunny-outline' },
    { id: 'trip-organizer', name: 'Organizador de Viajes', icon: 'bag-outline' }
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

  const renderTravelPlanner = () => {
    // Datos de ejemplo para el planificador de viajes
    const sampleTravelPlans = [
      {
        id: '1',
        destination: 'París, Francia',
        date: '15-20 Marzo 2024',
        duration: '5 días',
        status: 'planning',
        progress: 75,
        clothing: ['Abrigo de invierno', 'Camisetas', 'Pantalones', 'Ropa interior'],
        items: ['Collar', 'Reloj', 'Gafas de sol', 'Bolso'],
        personalCare: ['Champú', 'Crema facial', 'Cepillo de dientes', 'Desodorante'],
        documents: ['Pasaporte', 'Visa', 'Seguro de viaje', 'Reservas de hotel'],
        essentials: ['Cargador', 'Adaptador', 'Medicamentos', 'Dinero en efectivo'],
        shoes: ['Zapatos cómodos', 'Zapatillas deportivas', 'Sandalias'],
        devices: ['Teléfono', 'Cámara', 'Tablet', 'Auriculares'],
        reminders: ['Confirmar vuelo 24h antes', 'Llevar cargador universal', 'Revisar clima']
      },
      {
        id: '2',
        destination: 'Tokio, Japón',
        date: '10-18 Abril 2024',
        duration: '8 días',
        status: 'confirmed',
        progress: 100,
        clothing: ['Ropa de primavera', 'Chaqueta ligera', 'Pantalones cómodos'],
        items: ['Cámara', 'Gafas de sol', 'Mochila'],
        personalCare: ['Productos básicos', 'Protector solar'],
        documents: ['Pasaporte', 'Visa', 'Itinerario'],
        essentials: ['Yen japonés', 'Guía de viaje', 'Mapa'],
        shoes: ['Zapatos para caminar', 'Zapatillas'],
        devices: ['Teléfono', 'Cámara', 'Power bank'],
        reminders: ['Aprender frases básicas en japonés', 'Reservar restaurantes']
      }
    ];

    // Estadísticas de viajes
    const travelStats = {
      totalPlans: sampleTravelPlans.length,
      completedPlans: sampleTravelPlans.filter(plan => plan.status === 'confirmed').length,
      planningPlans: sampleTravelPlans.filter(plan => plan.status === 'planning').length,
      totalDays: sampleTravelPlans.reduce((sum, plan) => sum + parseInt(plan.duration), 0)
    };

    // Funciones auxiliares
    const getStatusColor = (status) => {
      switch (status) {
        case 'planning': return '#FF9800';
        case 'confirmed': return '#4CAF50';
        case 'completed': return '#2196F3';
        default: return '#6B7280';
      }
    };

    const getStatusLabel = (status) => {
      switch (status) {
        case 'planning': return 'Planificando';
        case 'confirmed': return 'Confirmado';
        case 'completed': return 'Completado';
        default: return 'Desconocido';
      }
    };

    const getCategoryIcon = (category) => {
      switch (category) {
        case 'clothing': return 'shirt-outline';
        case 'items': return 'diamond-outline';
        case 'personalCare': return 'medical-outline';
        case 'documents': return 'document-text-outline';
        case 'essentials': return 'checkmark-circle-outline';
        case 'shoes': return 'footsteps-outline';
        case 'devices': return 'phone-portrait-outline';
        default: return 'list-outline';
      }
    };

    const getCategoryColor = (category) => {
      switch (category) {
        case 'clothing': return '#E91E63';
        case 'items': return '#9C27B0';
        case 'personalCare': return '#FF9800';
        case 'documents': return '#2196F3';
        case 'essentials': return '#4CAF50';
        case 'shoes': return '#795548';
        case 'devices': return '#607D8B';
        default: return '#6B7280';
      }
    };

    return (
      <ScrollView style={styles.travelPlannerContainer} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.travelPlannerHeader}>
          <View style={styles.travelPlannerHeaderContent}>
            <View style={styles.travelPlannerHeaderIcon}>
              <Icon name="airplane" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.travelPlannerHeaderText}>
              <Text style={styles.travelPlannerHeaderTitle}>Planificador de Viajes</Text>
              <Text style={styles.travelPlannerHeaderSubtitle}>
                Organiza tus viajes de manera inteligente
              </Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.travelPlannerAddButton}
            onPress={openAddTravelModal}
          >
            <Icon name="add" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Estadísticas de viajes */}
        <View style={styles.travelPlannerStats}>
          <View style={styles.travelPlannerStatCard}>
            <View style={styles.travelPlannerStatIcon}>
              <Icon name="airplane-outline" size={20} color="#FF6B35" />
            </View>
            <View style={styles.travelPlannerStatContent}>
              <Text style={styles.travelPlannerStatNumber}>{travelStats.totalPlans}</Text>
              <Text style={styles.travelPlannerStatLabel}>Planes Totales</Text>
            </View>
          </View>
          <View style={styles.travelPlannerStatCard}>
            <View style={styles.travelPlannerStatIcon}>
              <Icon name="checkmark-circle" size={20} color="#4CAF50" />
            </View>
            <View style={styles.travelPlannerStatContent}>
              <Text style={styles.travelPlannerStatNumber}>{travelStats.completedPlans}</Text>
              <Text style={styles.travelPlannerStatLabel}>Confirmados</Text>
            </View>
          </View>
          <View style={styles.travelPlannerStatCard}>
            <View style={styles.travelPlannerStatIcon}>
              <Icon name="calendar" size={20} color="#2196F3" />
            </View>
            <View style={styles.travelPlannerStatContent}>
              <Text style={styles.travelPlannerStatNumber}>{travelStats.totalDays}</Text>
              <Text style={styles.travelPlannerStatLabel}>Días Totales</Text>
            </View>
          </View>
        </View>

        {/* Lista de planes de viaje */}
        <View style={styles.travelPlannerPlans}>
          {sampleTravelPlans.map((plan) => (
            <View key={plan.id} style={styles.travelPlannerPlanCard}>
              {/* Header del plan */}
              <View style={styles.travelPlannerPlanHeader}>
                <View style={styles.travelPlannerPlanInfo}>
                  <Text style={styles.travelPlannerPlanDestination}>{plan.destination}</Text>
                  <Text style={styles.travelPlannerPlanDate}>{plan.date}</Text>
                  <Text style={styles.travelPlannerPlanDuration}>{plan.duration}</Text>
                </View>
                <View style={styles.travelPlannerPlanStatus}>
                  <View style={[
                    styles.travelPlannerStatusBadge,
                    { backgroundColor: getStatusColor(plan.status) }
                  ]}>
                    <Text style={styles.travelPlannerStatusText}>
                      {getStatusLabel(plan.status)}
                    </Text>
                  </View>
                  <View style={styles.travelPlannerProgressBar}>
                    <View style={[
                      styles.travelPlannerProgressFill,
                      { 
                        width: `${plan.progress}%`,
                        backgroundColor: getStatusColor(plan.status)
                      }
                    ]} />
                  </View>
                  <Text style={styles.travelPlannerProgressText}>{plan.progress}%</Text>
                </View>
              </View>

              {/* Categorías de artículos */}
              <View style={styles.travelPlannerCategories}>
                {[
                  { key: 'clothing', label: 'Ropa', items: plan.clothing },
                  { key: 'items', label: 'Accesorios', items: plan.items },
                  { key: 'personalCare', label: 'Cuidado Personal', items: plan.personalCare },
                  { key: 'documents', label: 'Documentos', items: plan.documents },
                  { key: 'essentials', label: 'Esenciales', items: plan.essentials },
                  { key: 'shoes', label: 'Zapatos', items: plan.shoes },
                  { key: 'devices', label: 'Dispositivos', items: plan.devices }
                ].map((category) => (
                  <View key={category.key} style={styles.travelPlannerCategory}>
                    <View style={styles.travelPlannerCategoryHeader}>
                      <View style={[
                        styles.travelPlannerCategoryIcon,
                        { backgroundColor: getCategoryColor(category.key) }
                      ]}>
                        <Icon 
                          name={getCategoryIcon(category.key)} 
                          size={16} 
                          color="#FFFFFF" 
                        />
                      </View>
                      <Text style={styles.travelPlannerCategoryLabel}>{category.label}</Text>
                      <Text style={styles.travelPlannerCategoryCount}>
                        {category.items.length} artículos
                      </Text>
                    </View>
                    
                    <View style={styles.travelPlannerItemsList}>
                      {category.items.slice(0, 3).map((item, index) => (
                        <View key={index} style={styles.travelPlannerItem}>
                          <Icon name="checkmark-circle-outline" size={14} color="#4CAF50" />
                          <Text style={styles.travelPlannerItemText}>{item}</Text>
                        </View>
                      ))}
                      {category.items.length > 3 && (
                        <Text style={styles.travelPlannerMoreItems}>
                          +{category.items.length - 3} más...
                        </Text>
                      )}
                    </View>
                  </View>
                ))}
              </View>

              {/* Recordatorios importantes */}
              {plan.reminders.length > 0 && (
                <View style={styles.travelPlannerReminders}>
                  <View style={styles.travelPlannerRemindersHeader}>
                    <Icon name="alarm-outline" size={16} color="#FF6B35" />
                    <Text style={styles.travelPlannerRemindersTitle}>Recordatorios Importantes</Text>
                  </View>
                  <View style={styles.travelPlannerRemindersList}>
                    {plan.reminders.map((reminder, index) => (
                      <View key={index} style={styles.travelPlannerReminderItem}>
                        <Icon name="ellipse" size={6} color="#FF6B35" />
                        <Text style={styles.travelPlannerReminderText}>{reminder}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Botones de acción */}
              <View style={styles.travelPlannerActions}>
                <TouchableOpacity style={styles.travelPlannerActionButton}>
                  <Icon name="create-outline" size={16} color="#2196F3" />
                  <Text style={styles.travelPlannerActionText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.travelPlannerActionButton}>
                  <Icon name="share-outline" size={16} color="#4CAF50" />
                  <Text style={styles.travelPlannerActionText}>Compartir</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.travelPlannerActionButton}>
                  <Icon name="download-outline" size={16} color="#FF9800" />
                  <Text style={styles.travelPlannerActionText}>Exportar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Estado vacío si no hay planes */}
        {sampleTravelPlans.length === 0 && (
          <View style={styles.travelPlannerEmptyState}>
            <View style={styles.travelPlannerEmptyIcon}>
              <Icon name="airplane-outline" size={64} color="#E0E0E0" />
            </View>
            <Text style={styles.travelPlannerEmptyTitle}>No hay planes de viaje</Text>
            <Text style={styles.travelPlannerEmptySubtitle}>
              Crea tu primer plan de viaje y comienza a organizar tu aventura
            </Text>
            <TouchableOpacity 
              style={styles.travelPlannerEmptyButton}
              onPress={openAddTravelModal}
            >
              <Icon name="add" size={20} color="#FFFFFF" />
              <Text style={styles.travelPlannerEmptyButtonText}>Crear Plan de Viaje</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    );
  };

  const renderTourPlanner = () => {
    // Datos de ejemplo para el planificador de tours
    const sampleTourPlans = [
      {
        id: '1',
        destination: 'París, Francia',
        date: '15 Marzo 2024',
        day: 'Día 1',
        duration: '8 horas',
        status: 'confirmed',
        sites: [
          'Torre Eiffel',
          'Museo del Louvre',
          'Notre-Dame',
          'Champs-Élysées',
          'Arco del Triunfo'
        ],
        breakfast: 'Café de Flore',
        lunch: 'Le Comptoir du Relais',
        dinner: 'L\'Ambroisie',
        other: 'Café de la Paix',
        notes: 'Llevar zapatos cómodos para caminar. Reservar entradas con anticipación.',
        activities: [
          { time: '8:00', activity: 'Desayuno en Café de Flore', type: 'meal' },
          { time: '9:30', activity: 'Visita a Torre Eiffel', type: 'sightseeing' },
          { time: '11:00', activity: 'Paseo por Champs-Élysées', type: 'walking' },
          { time: '12:30', activity: 'Almuerzo en Le Comptoir', type: 'meal' },
          { time: '14:00', activity: 'Museo del Louvre', type: 'museum' },
          { time: '16:30', activity: 'Notre-Dame', type: 'sightseeing' },
          { time: '18:00', activity: 'Arco del Triunfo', type: 'sightseeing' },
          { time: '19:30', activity: 'Cena en L\'Ambroisie', type: 'meal' }
        ]
      },
      {
        id: '2',
        destination: 'Tokio, Japón',
        date: '10 Abril 2024',
        day: 'Día 2',
        duration: '10 horas',
        status: 'planning',
        sites: [
          'Templo Senso-ji',
          'Mercado de Tsukiji',
          'Torre de Tokio',
          'Harajuku',
          'Shibuya Crossing'
        ],
        breakfast: 'Tsukiji Outer Market',
        lunch: 'Sushi Dai',
        dinner: 'Izakaya Torikizoku',
        other: 'Café de la Paix',
        notes: 'Aprender frases básicas en japonés. Llevar efectivo para el mercado.',
        activities: [
          { time: '7:00', activity: 'Desayuno en Tsukiji Market', type: 'meal' },
          { time: '8:30', activity: 'Templo Senso-ji', type: 'temple' },
          { time: '10:00', activity: 'Mercado de Tsukiji', type: 'market' },
          { time: '12:00', activity: 'Almuerzo en Sushi Dai', type: 'meal' },
          { time: '13:30', activity: 'Torre de Tokio', type: 'sightseeing' },
          { time: '15:00', activity: 'Harajuku', type: 'shopping' },
          { time: '17:00', activity: 'Shibuya Crossing', type: 'sightseeing' },
          { time: '18:30', activity: 'Cena en Izakaya', type: 'meal' }
        ]
      }
    ];

    // Estadísticas de tours
    const tourStats = {
      totalTours: sampleTourPlans.length,
      confirmedTours: sampleTourPlans.filter(tour => tour.status === 'confirmed').length,
      planningTours: sampleTourPlans.filter(tour => tour.status === 'planning').length,
      totalHours: sampleTourPlans.reduce((sum, tour) => sum + parseInt(tour.duration), 0)
    };

    // Funciones auxiliares
    const getStatusColor = (status) => {
      switch (status) {
        case 'planning': return '#FF9800';
        case 'confirmed': return '#4CAF50';
        case 'completed': return '#2196F3';
        default: return '#6B7280';
      }
    };

    const getStatusLabel = (status) => {
      switch (status) {
        case 'planning': return 'Planificando';
        case 'confirmed': return 'Confirmado';
        case 'completed': return 'Completado';
        default: return 'Desconocido';
      }
    };

    const getActivityIcon = (type) => {
      switch (type) {
        case 'meal': return 'restaurant';
        case 'sightseeing': return 'eye';
        case 'walking': return 'walk';
        case 'museum': return 'library';
        case 'temple': return 'business';
        case 'market': return 'storefront';
        case 'shopping': return 'bag';
        default: return 'location';
      }
    };

    const getActivityColor = (type) => {
      switch (type) {
        case 'meal': return '#FF5722';
        case 'sightseeing': return '#2196F3';
        case 'walking': return '#4CAF50';
        case 'museum': return '#9C27B0';
        case 'temple': return '#FF9800';
        case 'market': return '#795548';
        case 'shopping': return '#E91E63';
        default: return '#6B7280';
      }
    };

    return (
      <ScrollView style={styles.tourPlannerContainer} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.tourPlannerHeader}>
          <View style={styles.tourPlannerHeaderContent}>
            <View style={styles.tourPlannerHeaderIcon}>
              <Icon name="map" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.tourPlannerHeaderText}>
              <Text style={styles.tourPlannerHeaderTitle}>Planificador de Tours</Text>
              <Text style={styles.tourPlannerHeaderSubtitle}>
                Organiza tus tours y actividades diarias
              </Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.tourPlannerAddButton}
            onPress={openAddTourModal}
          >
            <Icon name="add" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Estadísticas de tours */}
        <View style={styles.tourPlannerStats}>
          <View style={styles.tourPlannerStatCard}>
            <View style={styles.tourPlannerStatIcon}>
              <Icon name="map-outline" size={20} color="#4CAF50" />
            </View>
            <View style={styles.tourPlannerStatContent}>
              <Text style={styles.tourPlannerStatNumber}>{tourStats.totalTours}</Text>
              <Text style={styles.tourPlannerStatLabel}>Tours Totales</Text>
            </View>
          </View>
          <View style={styles.tourPlannerStatCard}>
            <View style={styles.tourPlannerStatIcon}>
              <Icon name="checkmark-circle" size={20} color="#4CAF50" />
            </View>
            <View style={styles.tourPlannerStatContent}>
              <Text style={styles.tourPlannerStatNumber}>{tourStats.confirmedTours}</Text>
              <Text style={styles.tourPlannerStatLabel}>Confirmados</Text>
            </View>
          </View>
          <View style={styles.tourPlannerStatCard}>
            <View style={styles.tourPlannerStatIcon}>
              <Icon name="time" size={20} color="#2196F3" />
            </View>
            <View style={styles.tourPlannerStatContent}>
              <Text style={styles.tourPlannerStatNumber}>{tourStats.totalHours}</Text>
              <Text style={styles.tourPlannerStatLabel}>Horas Totales</Text>
            </View>
          </View>
        </View>

        {/* Lista de tours */}
        <View style={styles.tourPlannerTours}>
          {sampleTourPlans.map((tour) => (
            <View key={tour.id} style={styles.tourPlannerTourCard}>
              {/* Header del tour */}
              <View style={styles.tourPlannerTourHeader}>
                <View style={styles.tourPlannerTourInfo}>
                  <Text style={styles.tourPlannerTourDestination}>{tour.destination}</Text>
                  <Text style={styles.tourPlannerTourDate}>{tour.date} - {tour.day}</Text>
                  <Text style={styles.tourPlannerTourDuration}>{tour.duration}</Text>
                </View>
                <View style={styles.tourPlannerTourStatus}>
                  <View style={[
                    styles.tourPlannerStatusBadge,
                    { backgroundColor: getStatusColor(tour.status) }
                  ]}>
                    <Text style={styles.tourPlannerStatusText}>
                      {getStatusLabel(tour.status)}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Cronograma de actividades */}
              <View style={styles.tourPlannerSchedule}>
                <View style={styles.tourPlannerScheduleHeader}>
                  <Icon name="time-outline" size={16} color="#4CAF50" />
                  <Text style={styles.tourPlannerScheduleTitle}>Cronograma del Día</Text>
                </View>
                
                <View style={styles.tourPlannerActivities}>
                  {tour.activities.map((activity, index) => (
                    <View key={index} style={styles.tourPlannerActivity}>
                      <View style={styles.tourPlannerActivityTime}>
                        <Text style={styles.tourPlannerActivityTimeText}>{activity.time}</Text>
                      </View>
                      <View style={styles.tourPlannerActivityContent}>
                        <View style={styles.tourPlannerActivityHeader}>
                          <View style={[
                            styles.tourPlannerActivityIcon,
                            { backgroundColor: getActivityColor(activity.type) }
                          ]}>
                            <Icon 
                              name={getActivityIcon(activity.type)} 
                              size={14} 
                              color="#FFFFFF" 
                            />
                          </View>
                          <Text style={styles.tourPlannerActivityText}>{activity.activity}</Text>
                        </View>
                        <View style={[
                          styles.tourPlannerActivityType,
                          { backgroundColor: getActivityColor(activity.type) }
                        ]}>
                          <Text style={styles.tourPlannerActivityTypeText}>
                            {activity.type.toUpperCase()}
                          </Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              </View>

              {/* Sitios a explorar */}
              <View style={styles.tourPlannerSites}>
                <View style={styles.tourPlannerSitesHeader}>
                  <Icon name="location-outline" size={16} color="#2196F3" />
                  <Text style={styles.tourPlannerSitesTitle}>Sitios a Explorar</Text>
                </View>
                <View style={styles.tourPlannerSitesList}>
                  {tour.sites.map((site, index) => (
                    <View key={index} style={styles.tourPlannerSiteItem}>
                      <Icon name="checkmark-circle-outline" size={14} color="#4CAF50" />
                      <Text style={styles.tourPlannerSiteText}>{site}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Lugares de comida */}
              <View style={styles.tourPlannerMeals}>
                <View style={styles.tourPlannerMealsHeader}>
                  <Icon name="restaurant-outline" size={16} color="#FF5722" />
                  <Text style={styles.tourPlannerMealsTitle}>Lugares de Comida</Text>
                </View>
                <View style={styles.tourPlannerMealsList}>
                  <View style={styles.tourPlannerMealItem}>
                    <Icon name="sunny-outline" size={14} color="#FF9800" />
                    <Text style={styles.tourPlannerMealLabel}>Desayuno:</Text>
                    <Text style={styles.tourPlannerMealText}>{tour.breakfast}</Text>
                  </View>
                  <View style={styles.tourPlannerMealItem}>
                    <Icon name="sunny" size={14} color="#FF5722" />
                    <Text style={styles.tourPlannerMealLabel}>Almuerzo:</Text>
                    <Text style={styles.tourPlannerMealText}>{tour.lunch}</Text>
                  </View>
                  <View style={styles.tourPlannerMealItem}>
                    <Icon name="moon-outline" size={14} color="#9C27B0" />
                    <Text style={styles.tourPlannerMealLabel}>Cena:</Text>
                    <Text style={styles.tourPlannerMealText}>{tour.dinner}</Text>
                  </View>
                  <View style={styles.tourPlannerMealItem}>
                    <Icon name="cafe-outline" size={14} color="#795548" />
                    <Text style={styles.tourPlannerMealLabel}>Otro:</Text>
                    <Text style={styles.tourPlannerMealText}>{tour.other}</Text>
                  </View>
                </View>
              </View>

              {/* Notas importantes */}
              {tour.notes && (
                <View style={styles.tourPlannerNotes}>
                  <View style={styles.tourPlannerNotesHeader}>
                    <Icon name="document-text-outline" size={16} color="#FF9800" />
                    <Text style={styles.tourPlannerNotesTitle}>Notas Importantes</Text>
                  </View>
                  <Text style={styles.tourPlannerNotesText}>{tour.notes}</Text>
                </View>
              )}

              {/* Botones de acción */}
              <View style={styles.tourPlannerActions}>
                <TouchableOpacity style={styles.tourPlannerActionButton}>
                  <Icon name="create-outline" size={16} color="#2196F3" />
                  <Text style={styles.tourPlannerActionText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tourPlannerActionButton}>
                  <Icon name="share-outline" size={16} color="#4CAF50" />
                  <Text style={styles.tourPlannerActionText}>Compartir</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tourPlannerActionButton}>
                  <Icon name="download-outline" size={16} color="#FF9800" />
                  <Text style={styles.tourPlannerActionText}>Exportar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Estado vacío si no hay tours */}
        {sampleTourPlans.length === 0 && (
          <View style={styles.tourPlannerEmptyState}>
            <View style={styles.tourPlannerEmptyIcon}>
              <Icon name="map-outline" size={64} color="#E0E0E0" />
            </View>
            <Text style={styles.tourPlannerEmptyTitle}>No hay tours planificados</Text>
            <Text style={styles.tourPlannerEmptySubtitle}>
              Crea tu primer tour y comienza a explorar nuevos lugares
            </Text>
            <TouchableOpacity 
              style={styles.tourPlannerEmptyButton}
              onPress={openAddTourModal}
            >
              <Icon name="add" size={20} color="#FFFFFF" />
              <Text style={styles.tourPlannerEmptyButtonText}>Crear Tour</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    );
  };

  const renderJourneyScheduler = () => {
    // Datos de ejemplo para el programador de viajes
    const sampleJourneyPlans = [
      {
        id: '1',
        destination: 'Europa',
        travelDates: '15-30 Marzo 2024',
        duration: '15 días',
        status: 'confirmed',
        budget: '$3,500',
        activities: [
          'Visita a París',
          'Tour por Roma',
          'Explorar Barcelona',
          'Crucero por el Mediterráneo',
          'Museos y monumentos'
        ],
        transit: 'Avión + Tren + Autobús',
        accommodation: 'Hoteles 4 estrellas',
        total: '$3,500',
        progress: 85,
        highlights: [
          'Torre Eiffel',
          'Coliseo Romano',
          'Sagrada Familia',
          'Museo del Louvre'
        ],
        notes: 'Reservar entradas con anticipación. Llevar adaptadores europeos.',
        itinerary: [
          { day: 1, city: 'París', activity: 'Llegada y check-in' },
          { day: 2, city: 'París', activity: 'Torre Eiffel y Louvre' },
          { day: 3, city: 'París', activity: 'Notre-Dame y Champs-Élysées' },
          { day: 4, city: 'Roma', activity: 'Vuelo a Roma' },
          { day: 5, city: 'Roma', activity: 'Coliseo y Foro Romano' },
          { day: 6, city: 'Roma', activity: 'Vaticano y Capilla Sixtina' },
          { day: 7, city: 'Barcelona', activity: 'Tren a Barcelona' },
          { day: 8, city: 'Barcelona', activity: 'Sagrada Familia' },
          { day: 9, city: 'Barcelona', activity: 'Park Güell' },
          { day: 10, city: 'Crucero', activity: 'Embarcar en crucero' }
        ]
      },
      {
        id: '2',
        destination: 'Japón',
        travelDates: '10-25 Abril 2024',
        duration: '15 días',
        status: 'planning',
        budget: '$4,200',
        activities: [
          'Explorar Tokio',
          'Visitar Kioto',
          'Experiencia cultural',
          'Gastronomía japonesa',
          'Templos y jardines'
        ],
        transit: 'Avión + Shinkansen + Metro',
        accommodation: 'Ryokan tradicional',
        total: '$4,200',
        progress: 60,
        highlights: [
          'Templo Senso-ji',
          'Monte Fuji',
          'Bambú de Arashiyama',
          'Mercado de Tsukiji'
        ],
        notes: 'Aprender frases básicas en japonés. Llevar efectivo.',
        itinerary: [
          { day: 1, city: 'Tokio', activity: 'Llegada al aeropuerto' },
          { day: 2, city: 'Tokio', activity: 'Templo Senso-ji' },
          { day: 3, city: 'Tokio', activity: 'Mercado de Tsukiji' },
          { day: 4, city: 'Tokio', activity: 'Harajuku y Shibuya' },
          { day: 5, city: 'Kioto', activity: 'Shinkansen a Kioto' },
          { day: 6, city: 'Kioto', activity: 'Templos de Kioto' },
          { day: 7, city: 'Kioto', activity: 'Bambú de Arashiyama' },
          { day: 8, city: 'Kioto', activity: 'Castillo de Nijo' },
          { day: 9, city: 'Tokio', activity: 'Regreso a Tokio' },
          { day: 10, city: 'Tokio', activity: 'Últimas compras' }
        ]
      }
    ];

    // Estadísticas de viajes
    const journeyStats = {
      totalJourneys: sampleJourneyPlans.length,
      confirmedJourneys: sampleJourneyPlans.filter(journey => journey.status === 'confirmed').length,
      planningJourneys: sampleJourneyPlans.filter(journey => journey.status === 'planning').length,
      totalBudget: sampleJourneyPlans.reduce((sum, journey) => sum + parseInt(journey.budget.replace('$', '').replace(',', '')), 0),
      totalDays: sampleJourneyPlans.reduce((sum, journey) => sum + parseInt(journey.duration), 0)
    };

    // Funciones auxiliares
    const getStatusColor = (status) => {
      switch (status) {
        case 'planning': return '#FF9800';
        case 'confirmed': return '#4CAF50';
        case 'completed': return '#2196F3';
        default: return '#6B7280';
      }
    };

    const getStatusLabel = (status) => {
      switch (status) {
        case 'planning': return 'Planificando';
        case 'confirmed': return 'Confirmado';
        case 'completed': return 'Completado';
        default: return 'Desconocido';
      }
    };

    const getActivityIcon = (activity) => {
      if (activity.includes('Templo') || activity.includes('Vaticano')) return 'business';
      if (activity.includes('Museo') || activity.includes('Louvre')) return 'library';
      if (activity.includes('Torre') || activity.includes('Coliseo')) return 'eye';
      if (activity.includes('Mercado') || activity.includes('Crucero')) return 'storefront';
      if (activity.includes('Vuelo') || activity.includes('Tren')) return 'airplane';
      return 'location';
    };

    const getActivityColor = (activity) => {
      if (activity.includes('Templo') || activity.includes('Vaticano')) return '#FF9800';
      if (activity.includes('Museo') || activity.includes('Louvre')) return '#9C27B0';
      if (activity.includes('Torre') || activity.includes('Coliseo')) return '#2196F3';
      if (activity.includes('Mercado') || activity.includes('Crucero')) return '#795548';
      if (activity.includes('Vuelo') || activity.includes('Tren')) return '#4CAF50';
      return '#6B7280';
    };

    return (
      <ScrollView style={styles.journeySchedulerContainer} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.journeySchedulerHeader}>
          <View style={styles.journeySchedulerHeaderContent}>
            <View style={styles.journeySchedulerHeaderIcon}>
              <Icon name="calendar" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.journeySchedulerHeaderText}>
              <Text style={styles.journeySchedulerHeaderTitle}>Programador de Viajes</Text>
              <Text style={styles.journeySchedulerHeaderSubtitle}>
                Planifica tus viajes de larga duración
              </Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.journeySchedulerAddButton}
            onPress={openAddJourneyModal}
          >
            <Icon name="add" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Estadísticas de viajes */}
        <View style={styles.journeySchedulerStats}>
          <View style={styles.journeySchedulerStatCard}>
            <View style={styles.journeySchedulerStatIcon}>
              <Icon name="airplane-outline" size={20} color="#2196F3" />
            </View>
            <View style={styles.journeySchedulerStatContent}>
              <Text style={styles.journeySchedulerStatNumber}>{journeyStats.totalJourneys}</Text>
              <Text style={styles.journeySchedulerStatLabel}>Viajes Totales</Text>
            </View>
          </View>
          <View style={styles.journeySchedulerStatCard}>
            <View style={styles.journeySchedulerStatIcon}>
              <Icon name="checkmark-circle" size={20} color="#4CAF50" />
            </View>
            <View style={styles.journeySchedulerStatContent}>
              <Text style={styles.journeySchedulerStatNumber}>{journeyStats.confirmedJourneys}</Text>
              <Text style={styles.journeySchedulerStatLabel}>Confirmados</Text>
            </View>
          </View>
          <View style={styles.journeySchedulerStatCard}>
            <View style={styles.journeySchedulerStatIcon}>
              <Icon name="cash-outline" size={20} color="#FF9800" />
            </View>
            <View style={styles.journeySchedulerStatContent}>
              <Text style={styles.journeySchedulerStatNumber}>${journeyStats.totalBudget.toLocaleString()}</Text>
              <Text style={styles.journeySchedulerStatLabel}>Presupuesto Total</Text>
            </View>
          </View>
        </View>

        {/* Lista de viajes */}
        <View style={styles.journeySchedulerJourneys}>
          {sampleJourneyPlans.map((journey) => (
            <View key={journey.id} style={styles.journeySchedulerJourneyCard}>
              {/* Header del viaje */}
              <View style={styles.journeySchedulerJourneyHeader}>
                <View style={styles.journeySchedulerJourneyInfo}>
                  <Text style={styles.journeySchedulerJourneyDestination}>{journey.destination}</Text>
                  <Text style={styles.journeySchedulerJourneyDates}>{journey.travelDates}</Text>
                  <Text style={styles.journeySchedulerJourneyDuration}>{journey.duration}</Text>
                </View>
                <View style={styles.journeySchedulerJourneyStatus}>
                  <View style={[
                    styles.journeySchedulerStatusBadge,
                    { backgroundColor: getStatusColor(journey.status) }
                  ]}>
                    <Text style={styles.journeySchedulerStatusText}>
                      {getStatusLabel(journey.status)}
                    </Text>
                  </View>
                  <View style={styles.journeySchedulerProgressBar}>
                    <View style={[
                      styles.journeySchedulerProgressFill,
                      { 
                        width: `${journey.progress}%`,
                        backgroundColor: getStatusColor(journey.status)
                      }
                    ]} />
                  </View>
                  <Text style={styles.journeySchedulerProgressText}>{journey.progress}%</Text>
                </View>
              </View>

              {/* Información del viaje */}
              <View style={styles.journeySchedulerJourneyInfo}>
                <View style={styles.journeySchedulerInfoRow}>
                  <View style={styles.journeySchedulerInfoItem}>
                    <Icon name="cash-outline" size={16} color="#FF9800" />
                    <Text style={styles.journeySchedulerInfoLabel}>Presupuesto:</Text>
                    <Text style={styles.journeySchedulerInfoValue}>{journey.budget}</Text>
                  </View>
                  <View style={styles.journeySchedulerInfoItem}>
                    <Icon name="bed-outline" size={16} color="#9C27B0" />
                    <Text style={styles.journeySchedulerInfoLabel}>Alojamiento:</Text>
                    <Text style={styles.journeySchedulerInfoValue}>{journey.accommodation}</Text>
                  </View>
                </View>
                <View style={styles.journeySchedulerInfoRow}>
                  <View style={styles.journeySchedulerInfoItem}>
                    <Icon name="airplane-outline" size={16} color="#2196F3" />
                    <Text style={styles.journeySchedulerInfoLabel}>Transporte:</Text>
                    <Text style={styles.journeySchedulerInfoValue}>{journey.transit}</Text>
                  </View>
                  <View style={styles.journeySchedulerInfoItem}>
                    <Icon name="star-outline" size={16} color="#FF6B35" />
                    <Text style={styles.journeySchedulerInfoLabel}>Total:</Text>
                    <Text style={styles.journeySchedulerInfoValue}>{journey.total}</Text>
                  </View>
                </View>
              </View>

              {/* Actividades principales */}
              <View style={styles.journeySchedulerActivities}>
                <View style={styles.journeySchedulerActivitiesHeader}>
                  <Icon name="list-outline" size={16} color="#4CAF50" />
                  <Text style={styles.journeySchedulerActivitiesTitle}>Actividades Principales</Text>
                </View>
                <View style={styles.journeySchedulerActivitiesList}>
                  {journey.activities.map((activity, index) => (
                    <View key={index} style={styles.journeySchedulerActivityItem}>
                      <View style={[
                        styles.journeySchedulerActivityIcon,
                        { backgroundColor: getActivityColor(activity) }
                      ]}>
                        <Icon 
                          name={getActivityIcon(activity)} 
                          size={14} 
                          color="#FFFFFF" 
                        />
                      </View>
                      <Text style={styles.journeySchedulerActivityText}>{activity}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Destinos destacados */}
              <View style={styles.journeySchedulerHighlights}>
                <View style={styles.journeySchedulerHighlightsHeader}>
                  <Icon name="star" size={16} color="#FF6B35" />
                  <Text style={styles.journeySchedulerHighlightsTitle}>Destinos Destacados</Text>
                </View>
                <View style={styles.journeySchedulerHighlightsList}>
                  {journey.highlights.map((highlight, index) => (
                    <View key={index} style={styles.journeySchedulerHighlightItem}>
                      <Icon name="location" size={14} color="#FF6B35" />
                      <Text style={styles.journeySchedulerHighlightText}>{highlight}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Itinerario del viaje */}
              <View style={styles.journeySchedulerItinerary}>
                <View style={styles.journeySchedulerItineraryHeader}>
                  <Icon name="calendar-outline" size={16} color="#2196F3" />
                  <Text style={styles.journeySchedulerItineraryTitle}>Itinerario del Viaje</Text>
                </View>
                <View style={styles.journeySchedulerItineraryList}>
                  {journey.itinerary.slice(0, 5).map((day, index) => (
                    <View key={index} style={styles.journeySchedulerItineraryItem}>
                      <View style={styles.journeySchedulerItineraryDay}>
                        <Text style={styles.journeySchedulerItineraryDayText}>Día {day.day}</Text>
                      </View>
                      <View style={styles.journeySchedulerItineraryContent}>
                        <Text style={styles.journeySchedulerItineraryCity}>{day.city}</Text>
                        <Text style={styles.journeySchedulerItineraryActivity}>{day.activity}</Text>
                      </View>
                    </View>
                  ))}
                  {journey.itinerary.length > 5 && (
                    <Text style={styles.journeySchedulerItineraryMore}>
                      +{journey.itinerary.length - 5} días más...
                    </Text>
                  )}
                </View>
              </View>

              {/* Notas importantes */}
              {journey.notes && (
                <View style={styles.journeySchedulerNotes}>
                  <View style={styles.journeySchedulerNotesHeader}>
                    <Icon name="document-text-outline" size={16} color="#FF9800" />
                    <Text style={styles.journeySchedulerNotesTitle}>Notas Importantes</Text>
                  </View>
                  <Text style={styles.journeySchedulerNotesText}>{journey.notes}</Text>
                </View>
              )}

              {/* Botones de acción */}
              <View style={styles.journeySchedulerActions}>
                <TouchableOpacity style={styles.journeySchedulerActionButton}>
                  <Icon name="create-outline" size={16} color="#2196F3" />
                  <Text style={styles.journeySchedulerActionText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.journeySchedulerActionButton}>
                  <Icon name="share-outline" size={16} color="#4CAF50" />
                  <Text style={styles.journeySchedulerActionText}>Compartir</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.journeySchedulerActionButton}>
                  <Icon name="download-outline" size={16} color="#FF9800" />
                  <Text style={styles.journeySchedulerActionText}>Exportar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Estado vacío si no hay viajes */}
        {sampleJourneyPlans.length === 0 && (
          <View style={styles.journeySchedulerEmptyState}>
            <View style={styles.journeySchedulerEmptyIcon}>
              <Icon name="calendar-outline" size={64} color="#E0E0E0" />
            </View>
            <Text style={styles.journeySchedulerEmptyTitle}>No hay viajes programados</Text>
            <Text style={styles.journeySchedulerEmptySubtitle}>
              Programa tu primer viaje de larga duración y comienza tu aventura
            </Text>
            <TouchableOpacity 
              style={styles.journeySchedulerEmptyButton}
              onPress={openAddJourneyModal}
            >
              <Icon name="add" size={20} color="#FFFFFF" />
              <Text style={styles.journeySchedulerEmptyButtonText}>Programar Viaje</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    );
  };

  const renderVacationScheduler = () => {
    // Datos de ejemplo para el planificador de vacaciones
    const sampleVacationPlans = [
      {
        id: '1',
        destination: 'Caribe',
        vacationType: 'Playa',
        startDate: '15 Julio 2024',
        endDate: '22 Julio 2024',
        duration: '7 días',
        status: 'confirmed',
        budget: '$2,800',
        accommodation: 'Resort All-Inclusive',
        activities: [
          'Relajación en la playa',
          'Snorkeling',
          'Excursión en barco',
          'Masajes en el spa',
          'Cenas románticas'
        ],
        highlights: [
          'Aguas cristalinas',
          'Playa de arena blanca',
          'Atardeceres espectaculares',
          'Cocina local'
        ],
        weather: {
          temperature: '28°C',
          condition: 'Soleado',
          humidity: '75%'
        },
        packingList: [
          'Trajes de baño',
          'Protector solar',
          'Gafas de sol',
          'Ropa ligera',
          'Sandalias'
        ],
        notes: 'Reservar actividades con anticipación. Llevar efectivo para propinas.',
        itinerary: [
          { day: 1, activity: 'Llegada y check-in en el resort' },
          { day: 2, activity: 'Día de relajación en la playa' },
          { day: 3, activity: 'Snorkeling en arrecife de coral' },
          { day: 4, activity: 'Excursión en barco a isla privada' },
          { day: 5, activity: 'Spa y masajes relajantes' },
          { day: 6, activity: 'Cena romántica en la playa' },
          { day: 7, activity: 'Último día de compras y partida' }
        ]
      },
      {
        id: '2',
        destination: 'Montañas',
        vacationType: 'Aventura',
        startDate: '10 Agosto 2024',
        endDate: '17 Agosto 2024',
        duration: '7 días',
        status: 'planning',
        budget: '$1,500',
        accommodation: 'Cabaña de montaña',
        activities: [
          'Senderismo',
          'Escalada en roca',
          'Observación de estrellas',
          'Fotografía de naturaleza',
          'Camping'
        ],
        highlights: [
          'Vistas panorámicas',
          'Aire puro de montaña',
          'Aurora boreal',
          'Silencio natural'
        ],
        weather: {
          temperature: '15°C',
          condition: 'Parcialmente nublado',
          humidity: '60%'
        },
        packingList: [
          'Ropa de abrigo',
          'Botas de montaña',
          'Mochila',
          'Linterna',
          'Cámara'
        ],
        notes: 'Llevar ropa de abrigo. Verificar condiciones climáticas.',
        itinerary: [
          { day: 1, activity: 'Llegada y check-in en cabaña' },
          { day: 2, activity: 'Senderismo por senderos fáciles' },
          { day: 3, activity: 'Escalada en roca para principiantes' },
          { day: 4, activity: 'Observación de estrellas nocturna' },
          { day: 5, activity: 'Fotografía de paisajes' },
          { day: 6, activity: 'Camping en la montaña' },
          { day: 7, activity: 'Descenso y partida' }
        ]
      }
    ];

    // Estadísticas de vacaciones
    const vacationStats = {
      totalVacations: sampleVacationPlans.length,
      confirmedVacations: sampleVacationPlans.filter(vacation => vacation.status === 'confirmed').length,
      planningVacations: sampleVacationPlans.filter(vacation => vacation.status === 'planning').length,
      totalBudget: sampleVacationPlans.reduce((sum, vacation) => sum + parseInt(vacation.budget.replace('$', '').replace(',', '')), 0),
      totalDays: sampleVacationPlans.reduce((sum, vacation) => sum + parseInt(vacation.duration), 0)
    };

    // Funciones auxiliares
    const getStatusColor = (status) => {
      switch (status) {
        case 'planning': return '#FF9800';
        case 'confirmed': return '#4CAF50';
        case 'completed': return '#2196F3';
        default: return '#6B7280';
      }
    };

    const getStatusLabel = (status) => {
      switch (status) {
        case 'planning': return 'Planificando';
        case 'confirmed': return 'Confirmado';
        case 'completed': return 'Completado';
        default: return 'Desconocido';
      }
    };

    const getVacationTypeIcon = (type) => {
      switch (type) {
        case 'Playa': return 'sunny';
        case 'Aventura': return 'trending-up';
        case 'Cultural': return 'library';
        case 'Relajación': return 'leaf';
        default: return 'location';
      }
    };

    const getVacationTypeColor = (type) => {
      switch (type) {
        case 'Playa': return '#FF6B35';
        case 'Aventura': return '#4CAF50';
        case 'Cultural': return '#9C27B0';
        case 'Relajación': return '#8BC34A';
        default: return '#6B7280';
      }
    };

    const getWeatherIcon = (condition) => {
      if (condition.includes('Soleado')) return 'sunny';
      if (condition.includes('Nublado')) return 'cloudy';
      if (condition.includes('Lluvia')) return 'rainy';
      return 'partly-sunny';
    };

    const getWeatherColor = (condition) => {
      if (condition.includes('Soleado')) return '#FF9800';
      if (condition.includes('Nublado')) return '#607D8B';
      if (condition.includes('Lluvia')) return '#2196F3';
      return '#FFC107';
    };

    return (
      <ScrollView style={styles.vacationSchedulerContainer} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.vacationSchedulerHeader}>
          <View style={styles.vacationSchedulerHeaderContent}>
            <View style={styles.vacationSchedulerHeaderIcon}>
              <Icon name="sunny" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.vacationSchedulerHeaderText}>
              <Text style={styles.vacationSchedulerHeaderTitle}>Planificador de Vacaciones</Text>
              <Text style={styles.vacationSchedulerHeaderSubtitle}>
                Organiza tus vacaciones perfectas
              </Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.vacationSchedulerAddButton}
            onPress={() => {}}
          >
            <Icon name="add" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Estadísticas de vacaciones */}
        <View style={styles.vacationSchedulerStats}>
          <View style={styles.vacationSchedulerStatCard}>
            <View style={styles.vacationSchedulerStatIcon}>
              <Icon name="sunny-outline" size={20} color="#FF6B35" />
            </View>
            <View style={styles.vacationSchedulerStatContent}>
              <Text style={styles.vacationSchedulerStatNumber}>{vacationStats.totalVacations}</Text>
              <Text style={styles.vacationSchedulerStatLabel}>Vacaciones Totales</Text>
            </View>
          </View>
          <View style={styles.vacationSchedulerStatCard}>
            <View style={styles.vacationSchedulerStatIcon}>
              <Icon name="checkmark-circle" size={20} color="#4CAF50" />
            </View>
            <View style={styles.vacationSchedulerStatContent}>
              <Text style={styles.vacationSchedulerStatNumber}>{vacationStats.confirmedVacations}</Text>
              <Text style={styles.vacationSchedulerStatLabel}>Confirmadas</Text>
            </View>
          </View>
          <View style={styles.vacationSchedulerStatCard}>
            <View style={styles.vacationSchedulerStatIcon}>
              <Icon name="cash-outline" size={20} color="#FF9800" />
            </View>
            <View style={styles.vacationSchedulerStatContent}>
              <Text style={styles.vacationSchedulerStatNumber}>${vacationStats.totalBudget.toLocaleString()}</Text>
              <Text style={styles.vacationSchedulerStatLabel}>Presupuesto Total</Text>
            </View>
          </View>
        </View>

        {/* Lista de vacaciones */}
        <View style={styles.vacationSchedulerVacations}>
          {sampleVacationPlans.map((vacation) => (
            <View key={vacation.id} style={styles.vacationSchedulerVacationCard}>
              {/* Header de la vacación */}
              <View style={styles.vacationSchedulerVacationHeader}>
                <View style={styles.vacationSchedulerVacationInfo}>
                  <Text style={styles.vacationSchedulerVacationDestination}>{vacation.destination}</Text>
                  <Text style={styles.vacationSchedulerVacationDates}>{vacation.startDate} - {vacation.endDate}</Text>
                  <Text style={styles.vacationSchedulerVacationDuration}>{vacation.duration}</Text>
                </View>
                <View style={styles.vacationSchedulerVacationStatus}>
                  <View style={[
                    styles.vacationSchedulerStatusBadge,
                    { backgroundColor: getStatusColor(vacation.status) }
                  ]}>
                    <Text style={styles.vacationSchedulerStatusText}>
                      {getStatusLabel(vacation.status)}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Tipo de vacación y clima */}
              <View style={styles.vacationSchedulerVacationType}>
                <View style={styles.vacationSchedulerTypeInfo}>
                  <View style={[
                    styles.vacationSchedulerTypeIcon,
                    { backgroundColor: getVacationTypeColor(vacation.vacationType) }
                  ]}>
                    <Icon 
                      name={getVacationTypeIcon(vacation.vacationType)} 
                      size={16} 
                      color="#FFFFFF" 
                    />
                  </View>
                  <Text style={styles.vacationSchedulerTypeText}>{vacation.vacationType}</Text>
                </View>
                <View style={styles.vacationSchedulerWeatherInfo}>
                  <Icon 
                    name={getWeatherIcon(vacation.weather.condition)} 
                    size={16} 
                    color={getWeatherColor(vacation.weather.condition)} 
                  />
                  <Text style={styles.vacationSchedulerWeatherText}>
                    {vacation.weather.temperature} - {vacation.weather.condition}
                  </Text>
                </View>
              </View>

              {/* Información de la vacación */}
              <View style={styles.vacationSchedulerVacationDetails}>
                <View style={styles.vacationSchedulerDetailRow}>
                  <View style={styles.vacationSchedulerDetailItem}>
                    <Icon name="cash-outline" size={16} color="#FF9800" />
                    <Text style={styles.vacationSchedulerDetailLabel}>Presupuesto:</Text>
                    <Text style={styles.vacationSchedulerDetailValue}>{vacation.budget}</Text>
                  </View>
                  <View style={styles.vacationSchedulerDetailItem}>
                    <Icon name="bed-outline" size={16} color="#9C27B0" />
                    <Text style={styles.vacationSchedulerDetailLabel}>Alojamiento:</Text>
                    <Text style={styles.vacationSchedulerDetailValue}>{vacation.accommodation}</Text>
                  </View>
                </View>
              </View>

              {/* Actividades principales */}
              <View style={styles.vacationSchedulerActivities}>
                <View style={styles.vacationSchedulerActivitiesHeader}>
                  <Icon name="list-outline" size={16} color="#4CAF50" />
                  <Text style={styles.vacationSchedulerActivitiesTitle}>Actividades Principales</Text>
                </View>
                <View style={styles.vacationSchedulerActivitiesList}>
                  {vacation.activities.map((activity, index) => (
                    <View key={index} style={styles.vacationSchedulerActivityItem}>
                      <Icon name="checkmark-circle-outline" size={14} color="#4CAF50" />
                      <Text style={styles.vacationSchedulerActivityText}>{activity}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Destinos destacados */}
              <View style={styles.vacationSchedulerHighlights}>
                <View style={styles.vacationSchedulerHighlightsHeader}>
                  <Icon name="star" size={16} color="#FF6B35" />
                  <Text style={styles.vacationSchedulerHighlightsTitle}>Destinos Destacados</Text>
                </View>
                <View style={styles.vacationSchedulerHighlightsList}>
                  {vacation.highlights.map((highlight, index) => (
                    <View key={index} style={styles.vacationSchedulerHighlightItem}>
                      <Icon name="location" size={14} color="#FF6B35" />
                      <Text style={styles.vacationSchedulerHighlightText}>{highlight}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Lista de equipaje */}
              <View style={styles.vacationSchedulerPacking}>
                <View style={styles.vacationSchedulerPackingHeader}>
                  <Icon name="bag-outline" size={16} color="#795548" />
                  <Text style={styles.vacationSchedulerPackingTitle}>Lista de Equipaje</Text>
                </View>
                <View style={styles.vacationSchedulerPackingList}>
                  {vacation.packingList.map((item, index) => (
                    <View key={index} style={styles.vacationSchedulerPackingItem}>
                      <Icon name="square-outline" size={14} color="#795548" />
                      <Text style={styles.vacationSchedulerPackingText}>{item}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Itinerario de vacaciones */}
              <View style={styles.vacationSchedulerItinerary}>
                <View style={styles.vacationSchedulerItineraryHeader}>
                  <Icon name="calendar-outline" size={16} color="#2196F3" />
                  <Text style={styles.vacationSchedulerItineraryTitle}>Itinerario de Vacaciones</Text>
                </View>
                <View style={styles.vacationSchedulerItineraryList}>
                  {vacation.itinerary.map((day, index) => (
                    <View key={index} style={styles.vacationSchedulerItineraryItem}>
                      <View style={styles.vacationSchedulerItineraryDay}>
                        <Text style={styles.vacationSchedulerItineraryDayText}>Día {index + 1}</Text>
                      </View>
                      <Text style={styles.vacationSchedulerItineraryActivity}>{day.activity}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Notas importantes */}
              {vacation.notes && (
                <View style={styles.vacationSchedulerNotes}>
                  <View style={styles.vacationSchedulerNotesHeader}>
                    <Icon name="document-text-outline" size={16} color="#FF9800" />
                    <Text style={styles.vacationSchedulerNotesTitle}>Notas Importantes</Text>
                  </View>
                  <Text style={styles.vacationSchedulerNotesText}>{vacation.notes}</Text>
                </View>
              )}

              {/* Botones de acción */}
              <View style={styles.vacationSchedulerActions}>
                <TouchableOpacity style={styles.vacationSchedulerActionButton}>
                  <Icon name="create-outline" size={16} color="#2196F3" />
                  <Text style={styles.vacationSchedulerActionText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.vacationSchedulerActionButton}>
                  <Icon name="share-outline" size={16} color="#4CAF50" />
                  <Text style={styles.vacationSchedulerActionText}>Compartir</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.vacationSchedulerActionButton}>
                  <Icon name="download-outline" size={16} color="#FF9800" />
                  <Text style={styles.vacationSchedulerActionText}>Exportar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Estado vacío si no hay vacaciones */}
        {sampleVacationPlans.length === 0 && (
          <View style={styles.vacationSchedulerEmptyState}>
            <View style={styles.vacationSchedulerEmptyIcon}>
              <Icon name="sunny-outline" size={64} color="#E0E0E0" />
            </View>
            <Text style={styles.vacationSchedulerEmptyTitle}>No hay vacaciones planificadas</Text>
            <Text style={styles.vacationSchedulerEmptySubtitle}>
              Planifica tu próxima vacación y comienza a soñar
            </Text>
            <TouchableOpacity 
              style={styles.vacationSchedulerEmptyButton}
              onPress={() => {}}
            >
              <Icon name="add" size={20} color="#FFFFFF" />
              <Text style={styles.vacationSchedulerEmptyButtonText}>Planificar Vacación</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    );
  };

  const renderTripOrganizer = () => {
    // Datos de ejemplo para el organizador de viajes
    const sampleTripOrganizations = [
      {
        id: '1',
        tripName: 'Viaje a Europa',
        destination: 'París, Francia',
        startDate: '20 Marzo 2024',
        endDate: '28 Marzo 2024',
        duration: '8 días',
        status: 'confirmed',
        budget: '$3,500',
        travelers: 2,
        accommodation: 'Hotel Boutique',
        transportation: 'Avión + Tren',
        activities: [
          'Tour por la Torre Eiffel',
          'Visita al Louvre',
          'Paseo por Montmartre',
          'Crucero por el Sena',
          'Degustación de vinos'
        ],
        documents: [
          'Pasaporte',
          'Visa Schengen',
          'Seguro de viaje',
          'Reservas de hotel',
          'Boletos de avión'
        ],
        packingList: [
          'Ropa de temporada',
          'Cámara fotográfica',
          'Adaptador de corriente',
          'Guía de viaje',
          'Medicamentos'
        ],
        emergencyContacts: [
          'Embajada de España en París',
          'Seguro de viaje 24/7',
          'Contacto local'
        ],
        notes: 'Verificar restricciones de COVID-19. Llevar efectivo en euros.',
        itinerary: [
          { day: 1, city: 'París', activity: 'Llegada y check-in en hotel' },
          { day: 2, city: 'París', activity: 'Tour por la Torre Eiffel y Champs-Élysées' },
          { day: 3, city: 'París', activity: 'Visita al Museo del Louvre' },
          { day: 4, city: 'París', activity: 'Paseo por Montmartre y Sacré-Cœur' },
          { day: 5, city: 'París', activity: 'Crucero por el Sena' },
          { day: 6, city: 'París', activity: 'Degustación de vinos y quesos' },
          { day: 7, city: 'París', activity: 'Compras en Galeries Lafayette' },
          { day: 8, city: 'París', activity: 'Último día y partida' }
        ]
      },
      {
        id: '2',
        tripName: 'Aventura en Asia',
        destination: 'Tokio, Japón',
        startDate: '15 Abril 2024',
        endDate: '25 Abril 2024',
        duration: '10 días',
        status: 'planning',
        budget: '$4,200',
        travelers: 1,
        accommodation: 'Ryokan tradicional',
        transportation: 'Avión + Metro',
        activities: [
          'Visita al Templo Senso-ji',
          'Paseo por Harajuku',
          'Experiencia en onsen',
          'Degustación de sushi',
          'Tour por el Monte Fuji'
        ],
        documents: [
          'Pasaporte',
          'Visa de turista',
          'Seguro de viaje',
          'JR Pass',
          'Reservas de alojamiento'
        ],
        packingList: [
          'Ropa cómoda',
          'Zapatos para caminar',
          'Cámara',
          'Diccionario japonés',
          'Dinero en yenes'
        ],
        emergencyContacts: [
          'Embajada de España en Tokio',
          'Servicio de emergencia 24/7',
          'Guía local bilingüe'
        ],
        notes: 'Aprender frases básicas en japonés. Llevar efectivo en yenes.',
        itinerary: [
          { day: 1, city: 'Tokio', activity: 'Llegada y check-in en ryokan' },
          { day: 2, city: 'Tokio', activity: 'Visita al Templo Senso-ji' },
          { day: 3, city: 'Tokio', activity: 'Paseo por Harajuku y Shibuya' },
          { day: 4, city: 'Tokio', activity: 'Experiencia en onsen tradicional' },
          { day: 5, city: 'Tokio', activity: 'Degustación de sushi en Tsukiji' },
          { day: 6, city: 'Tokio', activity: 'Tour por el Monte Fuji' },
          { day: 7, city: 'Tokio', activity: 'Visita al Palacio Imperial' },
          { day: 8, city: 'Tokio', activity: 'Compras en Akihabara' },
          { day: 9, city: 'Tokio', activity: 'Paseo por el Parque Ueno' },
          { day: 10, city: 'Tokio', activity: 'Último día y partida' }
        ]
      }
    ];

    // Estadísticas de viajes
    const tripStats = {
      totalTrips: sampleTripOrganizations.length,
      confirmedTrips: sampleTripOrganizations.filter(trip => trip.status === 'confirmed').length,
      planningTrips: sampleTripOrganizations.filter(trip => trip.status === 'planning').length,
      totalBudget: sampleTripOrganizations.reduce((sum, trip) => sum + parseInt(trip.budget.replace('$', '').replace(',', '')), 0),
      totalDays: sampleTripOrganizations.reduce((sum, trip) => sum + parseInt(trip.duration), 0),
      totalTravelers: sampleTripOrganizations.reduce((sum, trip) => sum + trip.travelers, 0)
    };

    // Funciones auxiliares
    const getStatusColor = (status) => {
      switch (status) {
        case 'planning': return '#FF9800';
        case 'confirmed': return '#4CAF50';
        case 'completed': return '#2196F3';
        default: return '#6B7280';
      }
    };

    const getStatusLabel = (status) => {
      switch (status) {
        case 'planning': return 'Planificando';
        case 'confirmed': return 'Confirmado';
        case 'completed': return 'Completado';
        default: return 'Desconocido';
      }
    };

    const getDestinationIcon = (destination) => {
      if (destination.includes('París') || destination.includes('Francia')) return 'flag';
      if (destination.includes('Tokio') || destination.includes('Japón')) return 'flag';
      if (destination.includes('Nueva York') || destination.includes('USA')) return 'flag';
      return 'location';
    };

    const getDestinationColor = (destination) => {
      if (destination.includes('París') || destination.includes('Francia')) return '#2196F3';
      if (destination.includes('Tokio') || destination.includes('Japón')) return '#E91E63';
      if (destination.includes('Nueva York') || destination.includes('USA')) return '#4CAF50';
      return '#6B7280';
    };

    const getTransportationIcon = (transport) => {
      if (transport.includes('Avión')) return 'airplane';
      if (transport.includes('Tren')) return 'train';
      if (transport.includes('Auto')) return 'car';
      if (transport.includes('Metro')) return 'subway';
      return 'bus';
    };

    const getTransportationColor = (transport) => {
      if (transport.includes('Avión')) return '#FF6B35';
      if (transport.includes('Tren')) return '#2196F3';
      if (transport.includes('Auto')) return '#4CAF50';
      if (transport.includes('Metro')) return '#9C27B0';
      return '#6B7280';
    };

    return (
      <ScrollView style={styles.tripOrganizerContainer} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.tripOrganizerHeader}>
          <View style={styles.tripOrganizerHeaderContent}>
            <View style={styles.tripOrganizerHeaderIcon}>
              <Icon name="bag" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.tripOrganizerHeaderText}>
              <Text style={styles.tripOrganizerHeaderTitle}>Organizador de Viajes</Text>
              <Text style={styles.tripOrganizerHeaderSubtitle}>
                Planifica y organiza tus viajes perfectos
              </Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.tripOrganizerAddButton}
            onPress={() => {}}
          >
            <Icon name="add" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Estadísticas de viajes */}
        <View style={styles.tripOrganizerStats}>
          <View style={styles.tripOrganizerStatCard}>
            <View style={styles.tripOrganizerStatIcon}>
              <Icon name="bag-outline" size={20} color="#4CAF50" />
            </View>
            <View style={styles.tripOrganizerStatContent}>
              <Text style={styles.tripOrganizerStatNumber}>{tripStats.totalTrips}</Text>
              <Text style={styles.tripOrganizerStatLabel}>Viajes Totales</Text>
            </View>
          </View>
          <View style={styles.tripOrganizerStatCard}>
            <View style={styles.tripOrganizerStatIcon}>
              <Icon name="checkmark-circle" size={20} color="#4CAF50" />
            </View>
            <View style={styles.tripOrganizerStatContent}>
              <Text style={styles.tripOrganizerStatNumber}>{tripStats.confirmedTrips}</Text>
              <Text style={styles.tripOrganizerStatLabel}>Confirmados</Text>
            </View>
          </View>
          <View style={styles.tripOrganizerStatCard}>
            <View style={styles.tripOrganizerStatIcon}>
              <Icon name="people" size={20} color="#FF9800" />
            </View>
            <View style={styles.tripOrganizerStatContent}>
              <Text style={styles.tripOrganizerStatNumber}>{tripStats.totalTravelers}</Text>
              <Text style={styles.tripOrganizerStatLabel}>Viajeros</Text>
            </View>
          </View>
        </View>

        {/* Lista de viajes organizados */}
        <View style={styles.tripOrganizerTrips}>
          {sampleTripOrganizations.map((trip) => (
            <View key={trip.id} style={styles.tripOrganizerTripCard}>
              {/* Header del viaje */}
              <View style={styles.tripOrganizerTripHeader}>
                <View style={styles.tripOrganizerTripInfo}>
                  <Text style={styles.tripOrganizerTripName}>{trip.tripName}</Text>
                  <Text style={styles.tripOrganizerTripDestination}>{trip.destination}</Text>
                  <Text style={styles.tripOrganizerTripDates}>{trip.startDate} - {trip.endDate}</Text>
                  <Text style={styles.tripOrganizerTripDuration}>{trip.duration}</Text>
                </View>
                <View style={styles.tripOrganizerTripStatus}>
                  <View style={[
                    styles.tripOrganizerStatusBadge,
                    { backgroundColor: getStatusColor(trip.status) }
                  ]}>
                    <Text style={styles.tripOrganizerStatusText}>
                      {getStatusLabel(trip.status)}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Información del destino */}
              <View style={styles.tripOrganizerDestination}>
                <View style={styles.tripOrganizerDestinationInfo}>
                  <View style={[
                    styles.tripOrganizerDestinationIcon,
                    { backgroundColor: getDestinationColor(trip.destination) }
                  ]}>
                    <Icon 
                      name={getDestinationIcon(trip.destination)} 
                      size={16} 
                      color="#FFFFFF" 
                    />
                  </View>
                  <Text style={styles.tripOrganizerDestinationText}>{trip.destination}</Text>
                </View>
                <View style={styles.tripOrganizerTravelersInfo}>
                  <Icon name="people" size={16} color="#FF9800" />
                  <Text style={styles.tripOrganizerTravelersText}>
                    {trip.travelers} viajero{trip.travelers > 1 ? 's' : ''}
                  </Text>
                </View>
              </View>

              {/* Información del viaje */}
              <View style={styles.tripOrganizerTripDetails}>
                <View style={styles.tripOrganizerDetailRow}>
                  <View style={styles.tripOrganizerDetailItem}>
                    <Icon name="cash-outline" size={16} color="#FF9800" />
                    <Text style={styles.tripOrganizerDetailLabel}>Presupuesto:</Text>
                    <Text style={styles.tripOrganizerDetailValue}>{trip.budget}</Text>
                  </View>
                  <View style={styles.tripOrganizerDetailItem}>
                    <Icon name="bed-outline" size={16} color="#9C27B0" />
                    <Text style={styles.tripOrganizerDetailLabel}>Alojamiento:</Text>
                    <Text style={styles.tripOrganizerDetailValue}>{trip.accommodation}</Text>
                  </View>
                </View>
                <View style={styles.tripOrganizerDetailRow}>
                  <View style={styles.tripOrganizerDetailItem}>
                    <Icon 
                      name={getTransportationIcon(trip.transportation)} 
                      size={16} 
                      color={getTransportationColor(trip.transportation)} 
                    />
                    <Text style={styles.tripOrganizerDetailLabel}>Transporte:</Text>
                    <Text style={styles.tripOrganizerDetailValue}>{trip.transportation}</Text>
                  </View>
                </View>
              </View>

              {/* Actividades principales */}
              <View style={styles.tripOrganizerActivities}>
                <View style={styles.tripOrganizerActivitiesHeader}>
                  <Icon name="list-outline" size={16} color="#4CAF50" />
                  <Text style={styles.tripOrganizerActivitiesTitle}>Actividades Principales</Text>
                </View>
                <View style={styles.tripOrganizerActivitiesList}>
                  {trip.activities.map((activity, index) => (
                    <View key={index} style={styles.tripOrganizerActivityItem}>
                      <Icon name="checkmark-circle-outline" size={14} color="#4CAF50" />
                      <Text style={styles.tripOrganizerActivityText}>{activity}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Documentos necesarios */}
              <View style={styles.tripOrganizerDocuments}>
                <View style={styles.tripOrganizerDocumentsHeader}>
                  <Icon name="document-text" size={16} color="#2196F3" />
                  <Text style={styles.tripOrganizerDocumentsTitle}>Documentos Necesarios</Text>
                </View>
                <View style={styles.tripOrganizerDocumentsList}>
                  {trip.documents.map((document, index) => (
                    <View key={index} style={styles.tripOrganizerDocumentItem}>
                      <Icon name="document-outline" size={14} color="#2196F3" />
                      <Text style={styles.tripOrganizerDocumentText}>{document}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Lista de equipaje */}
              <View style={styles.tripOrganizerPacking}>
                <View style={styles.tripOrganizerPackingHeader}>
                  <Icon name="bag-outline" size={16} color="#795548" />
                  <Text style={styles.tripOrganizerPackingTitle}>Lista de Equipaje</Text>
                </View>
                <View style={styles.tripOrganizerPackingList}>
                  {trip.packingList.map((item, index) => (
                    <View key={index} style={styles.tripOrganizerPackingItem}>
                      <Icon name="square-outline" size={14} color="#795548" />
                      <Text style={styles.tripOrganizerPackingText}>{item}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Contactos de emergencia */}
              <View style={styles.tripOrganizerEmergency}>
                <View style={styles.tripOrganizerEmergencyHeader}>
                  <Icon name="call" size={16} color="#F44336" />
                  <Text style={styles.tripOrganizerEmergencyTitle}>Contactos de Emergencia</Text>
                </View>
                <View style={styles.tripOrganizerEmergencyList}>
                  {trip.emergencyContacts.map((contact, index) => (
                    <View key={index} style={styles.tripOrganizerEmergencyItem}>
                      <Icon name="call-outline" size={14} color="#F44336" />
                      <Text style={styles.tripOrganizerEmergencyText}>{contact}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Itinerario del viaje */}
              <View style={styles.tripOrganizerItinerary}>
                <View style={styles.tripOrganizerItineraryHeader}>
                  <Icon name="calendar-outline" size={16} color="#2196F3" />
                  <Text style={styles.tripOrganizerItineraryTitle}>Itinerario del Viaje</Text>
                </View>
                <View style={styles.tripOrganizerItineraryList}>
                  {trip.itinerary.map((day, index) => (
                    <View key={index} style={styles.tripOrganizerItineraryItem}>
                      <View style={styles.tripOrganizerItineraryDay}>
                        <Text style={styles.tripOrganizerItineraryDayText}>Día {index + 1}</Text>
                        <Text style={styles.tripOrganizerItineraryCity}>{day.city}</Text>
                      </View>
                      <Text style={styles.tripOrganizerItineraryActivity}>{day.activity}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Notas importantes */}
              {trip.notes && (
                <View style={styles.tripOrganizerNotes}>
                  <View style={styles.tripOrganizerNotesHeader}>
                    <Icon name="document-text-outline" size={16} color="#FF9800" />
                    <Text style={styles.tripOrganizerNotesTitle}>Notas Importantes</Text>
                  </View>
                  <Text style={styles.tripOrganizerNotesText}>{trip.notes}</Text>
                </View>
              )}

              {/* Botones de acción */}
              <View style={styles.tripOrganizerActions}>
                <TouchableOpacity style={styles.tripOrganizerActionButton}>
                  <Icon name="create-outline" size={16} color="#2196F3" />
                  <Text style={styles.tripOrganizerActionText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tripOrganizerActionButton}>
                  <Icon name="share-outline" size={16} color="#4CAF50" />
                  <Text style={styles.tripOrganizerActionText}>Compartir</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tripOrganizerActionButton}>
                  <Icon name="download-outline" size={16} color="#FF9800" />
                  <Text style={styles.tripOrganizerActionText}>Exportar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Estado vacío si no hay viajes */}
        {sampleTripOrganizations.length === 0 && (
          <View style={styles.tripOrganizerEmptyState}>
            <View style={styles.tripOrganizerEmptyIcon}>
              <Icon name="bag-outline" size={64} color="#E0E0E0" />
            </View>
            <Text style={styles.tripOrganizerEmptyTitle}>No hay viajes organizados</Text>
            <Text style={styles.tripOrganizerEmptySubtitle}>
              Organiza tu próximo viaje y comienza a explorar
            </Text>
            <TouchableOpacity 
              style={styles.tripOrganizerEmptyButton}
              onPress={() => {}}
            >
              <Icon name="add" size={20} color="#FFFFFF" />
              <Text style={styles.tripOrganizerEmptyButtonText}>Organizar Viaje</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    );
  };

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

      {/* Modal para agregar Plan de Viaje */}
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

      {/* Modal para agregar Plan de Tour */}
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

      {/* Modal para agregar Plan de Viaje */}
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

  // Estilos para Planificador de Viajes
  travelPlannerContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  travelPlannerHeader: {
    backgroundColor: '#FF6B35',
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  travelPlannerHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  travelPlannerHeaderIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  travelPlannerHeaderText: {
    flex: 1,
  },
  travelPlannerHeaderTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  travelPlannerHeaderSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  travelPlannerAddButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  travelPlannerStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  travelPlannerStatCard: {
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
  travelPlannerStatIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  travelPlannerStatContent: {
    alignItems: 'center',
  },
  travelPlannerStatNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginBottom: 5,
  },
  travelPlannerStatLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  travelPlannerPlans: {
    paddingHorizontal: 20,
    gap: 20,
  },
  travelPlannerPlanCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  travelPlannerPlanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  travelPlannerPlanInfo: {
    flex: 1,
  },
  travelPlannerPlanDestination: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  travelPlannerPlanDate: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  travelPlannerPlanDuration: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  travelPlannerPlanStatus: {
    alignItems: 'flex-end',
  },
  travelPlannerStatusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 8,
  },
  travelPlannerStatusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  travelPlannerProgressBar: {
    width: 80,
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    marginBottom: 4,
  },
  travelPlannerProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  travelPlannerProgressText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: 'bold',
  },
  travelPlannerCategories: {
    gap: 16,
    marginBottom: 20,
  },
  travelPlannerCategory: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
  },
  travelPlannerCategoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  travelPlannerCategoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  travelPlannerCategoryLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    flex: 1,
  },
  travelPlannerCategoryCount: {
    fontSize: 12,
    color: '#6B7280',
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  travelPlannerItemsList: {
    gap: 8,
  },
  travelPlannerItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  travelPlannerItemText: {
    fontSize: 14,
    color: '#4B5563',
    marginLeft: 8,
  },
  travelPlannerMoreItems: {
    fontSize: 12,
    color: '#9CA3AF',
    fontStyle: 'italic',
    marginLeft: 22,
  },
  travelPlannerReminders: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  travelPlannerRemindersHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  travelPlannerRemindersTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#92400E',
    marginLeft: 8,
  },
  travelPlannerRemindersList: {
    gap: 8,
  },
  travelPlannerReminderItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  travelPlannerReminderText: {
    fontSize: 13,
    color: '#92400E',
    marginLeft: 8,
    flex: 1,
    lineHeight: 18,
  },
  travelPlannerActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  travelPlannerActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
  },
  travelPlannerActionText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  travelPlannerEmptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  travelPlannerEmptyIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  travelPlannerEmptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  travelPlannerEmptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
  },
  travelPlannerEmptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B35',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  travelPlannerEmptyButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },

  // Estilos para Planificador de Tours
  tourPlannerContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  tourPlannerHeader: {
    backgroundColor: '#4CAF50',
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tourPlannerHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  tourPlannerHeaderIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  tourPlannerHeaderText: {
    flex: 1,
  },
  tourPlannerHeaderTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  tourPlannerHeaderSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  tourPlannerAddButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tourPlannerStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tourPlannerStatCard: {
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
  tourPlannerStatIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  tourPlannerStatContent: {
    alignItems: 'center',
  },
  tourPlannerStatNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 5,
  },
  tourPlannerStatLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  tourPlannerTours: {
    paddingHorizontal: 20,
    gap: 20,
  },
  tourPlannerTourCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  tourPlannerTourHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  tourPlannerTourInfo: {
    flex: 1,
  },
  tourPlannerTourDestination: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  tourPlannerTourDate: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  tourPlannerTourDuration: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  tourPlannerTourStatus: {
    alignItems: 'flex-end',
  },
  tourPlannerStatusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  tourPlannerStatusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  tourPlannerSchedule: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  tourPlannerScheduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  tourPlannerScheduleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
  },
  tourPlannerActivities: {
    gap: 12,
  },
  tourPlannerActivity: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tourPlannerActivityTime: {
    width: 50,
    paddingTop: 4,
  },
  tourPlannerActivityTimeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  tourPlannerActivityContent: {
    flex: 1,
    marginLeft: 12,
  },
  tourPlannerActivityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  tourPlannerActivityIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  tourPlannerActivityText: {
    fontSize: 14,
    color: '#1F2937',
    flex: 1,
  },
  tourPlannerActivityType: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  tourPlannerActivityTypeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  tourPlannerSites: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  tourPlannerSitesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tourPlannerSitesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
  },
  tourPlannerSitesList: {
    gap: 8,
  },
  tourPlannerSiteItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tourPlannerSiteText: {
    fontSize: 14,
    color: '#4B5563',
    marginLeft: 8,
  },
  tourPlannerMeals: {
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  tourPlannerMealsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tourPlannerMealsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
  },
  tourPlannerMealsList: {
    gap: 8,
  },
  tourPlannerMealItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tourPlannerMealLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
    width: 80,
  },
  tourPlannerMealText: {
    fontSize: 14,
    color: '#4B5563',
    flex: 1,
  },
  tourPlannerNotes: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  tourPlannerNotesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tourPlannerNotesTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#92400E',
    marginLeft: 8,
  },
  tourPlannerNotesText: {
    fontSize: 13,
    color: '#92400E',
    lineHeight: 18,
  },
  tourPlannerActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  tourPlannerActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
  },
  tourPlannerActionText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  tourPlannerEmptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  tourPlannerEmptyIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  tourPlannerEmptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  tourPlannerEmptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
  },
  tourPlannerEmptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  tourPlannerEmptyButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },

  // Estilos para Programador de Viajes
  journeySchedulerContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  journeySchedulerHeader: {
    backgroundColor: '#2196F3',
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  journeySchedulerHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  journeySchedulerHeaderIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  journeySchedulerHeaderText: {
    flex: 1,
  },
  journeySchedulerHeaderTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  journeySchedulerHeaderSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  journeySchedulerAddButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  journeySchedulerStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  journeySchedulerStatCard: {
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
  journeySchedulerStatIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  journeySchedulerStatContent: {
    alignItems: 'center',
  },
  journeySchedulerStatNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 5,
  },
  journeySchedulerStatLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  journeySchedulerJourneys: {
    paddingHorizontal: 20,
    gap: 20,
  },
  journeySchedulerJourneyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  journeySchedulerJourneyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  journeySchedulerJourneyInfo: {
    flex: 1,
  },
  journeySchedulerJourneyDestination: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  journeySchedulerJourneyDates: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  journeySchedulerJourneyDuration: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  journeySchedulerJourneyStatus: {
    alignItems: 'flex-end',
  },
  journeySchedulerStatusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 8,
  },
  journeySchedulerStatusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  journeySchedulerProgressBar: {
    width: 80,
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    marginBottom: 4,
  },
  journeySchedulerProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  journeySchedulerProgressText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: 'bold',
  },
  journeySchedulerInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  journeySchedulerInfoItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  journeySchedulerInfoLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 6,
    marginRight: 4,
  },
  journeySchedulerInfoValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1F2937',
    flex: 1,
  },
  journeySchedulerActivities: {
    backgroundColor: '#E8F5E8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  journeySchedulerActivitiesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  journeySchedulerActivitiesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
  },
  journeySchedulerActivitiesList: {
    gap: 8,
  },
  journeySchedulerActivityItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  journeySchedulerActivityIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  journeySchedulerActivityText: {
    fontSize: 14,
    color: '#4B5563',
    flex: 1,
  },
  journeySchedulerHighlights: {
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  journeySchedulerHighlightsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  journeySchedulerHighlightsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
  },
  journeySchedulerHighlightsList: {
    gap: 8,
  },
  journeySchedulerHighlightItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  journeySchedulerHighlightText: {
    fontSize: 14,
    color: '#4B5563',
    marginLeft: 8,
  },
  journeySchedulerItinerary: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  journeySchedulerItineraryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  journeySchedulerItineraryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
  },
  journeySchedulerItineraryList: {
    gap: 10,
  },
  journeySchedulerItineraryItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  journeySchedulerItineraryDay: {
    width: 50,
    paddingTop: 2,
  },
  journeySchedulerItineraryDayText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  journeySchedulerItineraryContent: {
    flex: 1,
    marginLeft: 12,
  },
  journeySchedulerItineraryCity: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  journeySchedulerItineraryActivity: {
    fontSize: 13,
    color: '#6B7280',
  },
  journeySchedulerItineraryMore: {
    fontSize: 12,
    color: '#9CA3AF',
    fontStyle: 'italic',
    marginLeft: 62,
    marginTop: 4,
  },
  journeySchedulerNotes: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  journeySchedulerNotesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  journeySchedulerNotesTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#92400E',
    marginLeft: 8,
  },
  journeySchedulerNotesText: {
    fontSize: 13,
    color: '#92400E',
    lineHeight: 18,
  },
  journeySchedulerActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  journeySchedulerActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
  },
  journeySchedulerActionText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  journeySchedulerEmptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  journeySchedulerEmptyIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  journeySchedulerEmptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  journeySchedulerEmptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
  },
  journeySchedulerEmptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2196F3',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  journeySchedulerEmptyButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },

  // Estilos para Planificador de Vacaciones
  vacationSchedulerContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  vacationSchedulerHeader: {
    backgroundColor: '#FF6B35',
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vacationSchedulerHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  vacationSchedulerHeaderIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  vacationSchedulerHeaderText: {
    flex: 1,
  },
  vacationSchedulerHeaderTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  vacationSchedulerHeaderSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  vacationSchedulerAddButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  vacationSchedulerStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  vacationSchedulerStatCard: {
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
  vacationSchedulerStatIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  vacationSchedulerStatContent: {
    alignItems: 'center',
  },
  vacationSchedulerStatNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginBottom: 5,
  },
  vacationSchedulerStatLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  vacationSchedulerVacations: {
    paddingHorizontal: 20,
    gap: 20,
  },
  vacationSchedulerVacationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  vacationSchedulerVacationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  vacationSchedulerVacationInfo: {
    flex: 1,
  },
  vacationSchedulerVacationDestination: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  vacationSchedulerVacationDates: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  vacationSchedulerVacationDuration: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  vacationSchedulerVacationStatus: {
    alignItems: 'flex-end',
  },
  vacationSchedulerStatusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  vacationSchedulerStatusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  vacationSchedulerVacationType: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
  },
  vacationSchedulerTypeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vacationSchedulerTypeIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  vacationSchedulerTypeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  vacationSchedulerWeatherInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vacationSchedulerWeatherText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  vacationSchedulerVacationDetails: {
    marginBottom: 16,
  },
  vacationSchedulerDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  vacationSchedulerDetailItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  vacationSchedulerDetailLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 6,
    marginRight: 4,
  },
  vacationSchedulerDetailValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1F2937',
    flex: 1,
  },
  vacationSchedulerActivities: {
    backgroundColor: '#E8F5E8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  vacationSchedulerActivitiesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  vacationSchedulerActivitiesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
  },
  vacationSchedulerActivitiesList: {
    gap: 8,
  },
  vacationSchedulerActivityItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vacationSchedulerActivityText: {
    fontSize: 14,
    color: '#4B5563',
    marginLeft: 8,
  },
  vacationSchedulerHighlights: {
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  vacationSchedulerHighlightsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  vacationSchedulerHighlightsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
  },
  vacationSchedulerHighlightsList: {
    gap: 8,
  },
  vacationSchedulerHighlightItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vacationSchedulerHighlightText: {
    fontSize: 14,
    color: '#4B5563',
    marginLeft: 8,
  },
  vacationSchedulerPacking: {
    backgroundColor: '#F3E5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  vacationSchedulerPackingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  vacationSchedulerPackingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
  },
  vacationSchedulerPackingList: {
    gap: 8,
  },
  vacationSchedulerPackingItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vacationSchedulerPackingText: {
    fontSize: 14,
    color: '#4B5563',
    marginLeft: 8,
  },
  vacationSchedulerItinerary: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  vacationSchedulerItineraryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  vacationSchedulerItineraryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
  },
  vacationSchedulerItineraryList: {
    gap: 10,
  },
  vacationSchedulerItineraryItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  vacationSchedulerItineraryDay: {
    width: 50,
    paddingTop: 2,
  },
  vacationSchedulerItineraryDayText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  vacationSchedulerItineraryActivity: {
    fontSize: 14,
    color: '#4B5563',
    flex: 1,
    marginLeft: 12,
  },
  vacationSchedulerNotes: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  vacationSchedulerNotesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  vacationSchedulerNotesTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#92400E',
    marginLeft: 8,
  },
  vacationSchedulerNotesText: {
    fontSize: 13,
    color: '#92400E',
    lineHeight: 18,
  },
  vacationSchedulerActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  vacationSchedulerActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
  },
  vacationSchedulerActionText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  vacationSchedulerEmptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  vacationSchedulerEmptyIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  vacationSchedulerEmptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  vacationSchedulerEmptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
  },
  vacationSchedulerEmptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B35',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  vacationSchedulerEmptyButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },

  // Estilos para Organizador de Viajes
  tripOrganizerContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  tripOrganizerHeader: {
    backgroundColor: '#4CAF50',
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tripOrganizerHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  tripOrganizerHeaderIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  tripOrganizerHeaderText: {
    flex: 1,
  },
  tripOrganizerHeaderTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  tripOrganizerHeaderSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  tripOrganizerAddButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tripOrganizerStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tripOrganizerStatCard: {
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
  tripOrganizerStatIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  tripOrganizerStatContent: {
    alignItems: 'center',
  },
  tripOrganizerStatNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 5,
  },
  tripOrganizerStatLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  tripOrganizerTrips: {
    paddingHorizontal: 20,
    gap: 20,
  },
  tripOrganizerTripCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  tripOrganizerTripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  tripOrganizerTripInfo: {
    flex: 1,
  },
  tripOrganizerTripName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  tripOrganizerTripDestination: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '600',
    marginBottom: 4,
  },
  tripOrganizerTripDates: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  tripOrganizerTripDuration: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  tripOrganizerTripStatus: {
    alignItems: 'flex-end',
  },
  tripOrganizerStatusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  tripOrganizerStatusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  tripOrganizerDestination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
  },
  tripOrganizerDestinationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tripOrganizerDestinationIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tripOrganizerDestinationText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  tripOrganizerTravelersInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tripOrganizerTravelersText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  tripOrganizerTripDetails: {
    marginBottom: 16,
  },
  tripOrganizerDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  tripOrganizerDetailItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  tripOrganizerDetailLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 6,
    marginRight: 4,
  },
  tripOrganizerDetailValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1F2937',
    flex: 1,
  },
  tripOrganizerActivities: {
    backgroundColor: '#E8F5E8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  tripOrganizerActivitiesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tripOrganizerActivitiesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
  },
  tripOrganizerActivitiesList: {
    gap: 8,
  },
  tripOrganizerActivityItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tripOrganizerActivityText: {
    fontSize: 14,
    color: '#4B5563',
    marginLeft: 8,
  },
  tripOrganizerDocuments: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  tripOrganizerDocumentsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tripOrganizerDocumentsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
  },
  tripOrganizerDocumentsList: {
    gap: 8,
  },
  tripOrganizerDocumentItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tripOrganizerDocumentText: {
    fontSize: 14,
    color: '#4B5563',
    marginLeft: 8,
  },
  tripOrganizerPacking: {
    backgroundColor: '#F3E5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  tripOrganizerPackingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tripOrganizerPackingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
  },
  tripOrganizerPackingList: {
    gap: 8,
  },
  tripOrganizerPackingItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tripOrganizerPackingText: {
    fontSize: 14,
    color: '#4B5563',
    marginLeft: 8,
  },
  tripOrganizerEmergency: {
    backgroundColor: '#FFEBEE',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  tripOrganizerEmergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tripOrganizerEmergencyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
  },
  tripOrganizerEmergencyList: {
    gap: 8,
  },
  tripOrganizerEmergencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tripOrganizerEmergencyText: {
    fontSize: 14,
    color: '#4B5563',
    marginLeft: 8,
  },
  tripOrganizerItinerary: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  tripOrganizerItineraryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tripOrganizerItineraryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
  },
  tripOrganizerItineraryList: {
    gap: 10,
  },
  tripOrganizerItineraryItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tripOrganizerItineraryDay: {
    width: 60,
    paddingTop: 2,
  },
  tripOrganizerItineraryDayText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  tripOrganizerItineraryCity: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 2,
  },
  tripOrganizerItineraryActivity: {
    fontSize: 14,
    color: '#4B5563',
    flex: 1,
    marginLeft: 12,
  },
  tripOrganizerNotes: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  tripOrganizerNotesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tripOrganizerNotesTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#92400E',
    marginLeft: 8,
  },
  tripOrganizerNotesText: {
    fontSize: 13,
    color: '#92400E',
    lineHeight: 18,
  },
  tripOrganizerActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  tripOrganizerActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
  },
  tripOrganizerActionText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  tripOrganizerEmptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  tripOrganizerEmptyIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  tripOrganizerEmptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  tripOrganizerEmptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
  },
  tripOrganizerEmptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  tripOrganizerEmptyButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
});

export default TravelSections;
