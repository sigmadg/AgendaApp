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

const HealthSections = () => {
  // Estados para las diferentes secciones
  const [activeSection, setActiveSection] = useState('meal-planner');
  
  // Estados para alimentación
  const [showAddMealModal, setShowAddMealModal] = useState(false);
  const [showAddRecipeModal, setShowAddRecipeModal] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [newItemText, setNewItemText] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState(1);
  const [newItemUnit, setNewItemUnit] = useState('unidad');
  
  // Estados para ejercicio
  const [showAddGymModal, setShowAddGymModal] = useState(false);
  const [showAddSportsModal, setShowAddSportsModal] = useState(false);
  
  // Estados para planificador de comidas
  const [mealPlans, setMealPlans] = useState({});
  const [selectedMealDate, setSelectedMealDate] = useState(new Date());
  const [showMealDatePicker, setShowMealDatePicker] = useState(false);
  const [newMealPlan, setNewMealPlan] = useState({
    breakfast: '',
    lunch: '',
    dinner: ''
  });
  
  // Estados para lista de compras
  const [marketList, setMarketList] = useState({
    fruits: [],
    vegetables: [],
    dairy: [],
    meat: [],
    bread: [],
    frozen: [],
    spices: [],
    canned: [],
    beverages: []
  });
  
  // Estados para recetas
  const [recipes, setRecipes] = useState([]);
  const [newRecipe, setNewRecipe] = useState({
    name: '',
    ingredients: '',
    instructions: ''
  });
  
  // Estados para rutinas de gimnasio
  const [gymRoutines, setGymRoutines] = useState([]);
  const [newRoutine, setNewRoutine] = useState({
    name: '',
    description: '',
    exercises: [],
    duration: '',
    difficulty: 'Principiante',
    schedule: {
      days: [], // ['Lunes', 'Miércoles', 'Viernes']
      time: '', // '08:00'
      frequency: 'Semanal' // 'Diario', 'Semanal', 'Personalizado'
    }
  });
  
  // Estados para objetivos deportivos
  const [sportsGoals, setSportsGoals] = useState([]);
  const [showGoalDatePicker, setShowGoalDatePicker] = useState(false);
  const [newGoal, setNewGoal] = useState({
    sport: '',
    objective: '',
    targetDate: new Date(),
    currentProgress: '',
    notes: ''
  });

  // Estados para Seguimiento de Fitness
  const [fitnessData, setFitnessData] = useState({});
  const [selectedFitnessDate, setSelectedFitnessDate] = useState(new Date());
  const [showFitnessDatePicker, setShowFitnessDatePicker] = useState(false);
  const [dailyFitness, setDailyFitness] = useState({
    caloriesIn: '',
    caloriesOut: '',
    water: '',
    steps: '',
    sleep: '',
    mood: 'neutral'
  });

  // Estados para Medidas Corporales
  const [bodyMeasurements, setBodyMeasurements] = useState({});
  const [selectedMeasurementDate, setSelectedMeasurementDate] = useState(new Date());
  const [showMeasurementDatePicker, setShowMeasurementDatePicker] = useState(false);
  const [newMeasurements, setNewMeasurements] = useState({
    weight: '',
    neck: '',
    bicep: '',
    bust: '',
    chest: '',
    waist: '',
    hips: '',
    thigh: '',
    calf: '',
    notes: ''
  });

  // Estados para Seguimiento de Entrenamientos
  const [workouts, setWorkouts] = useState([]);
  const [showAddWorkoutModal, setShowAddWorkoutModal] = useState(false);
  const [newWorkout, setNewWorkout] = useState({
    name: '',
    date: new Date(),
    duration: '',
    exercises: [],
    notes: ''
  });

  // Estados para Pérdida de Peso
  const [weightLossData, setWeightLossData] = useState({});
  const [weightLossGoals, setWeightLossGoals] = useState([]);
  const [showAddWeightGoalModal, setShowAddWeightGoalModal] = useState(false);
  const [newWeightGoal, setNewWeightGoal] = useState({
    startWeight: '',
    targetWeight: '',
    targetDate: new Date(),
    currentWeight: '',
    notes: ''
  });

  // Estados para Seguimiento Nutricional
  const [nutritionData, setNutritionData] = useState({});
  const [selectedNutritionDate, setSelectedNutritionDate] = useState(new Date());
  const [showNutritionDatePicker, setShowNutritionDatePicker] = useState(false);
  const [dailyNutrition, setDailyNutrition] = useState({
    breakfast: { calories: '', protein: '', carbs: '', fat: '' },
    lunch: { calories: '', protein: '', carbs: '', fat: '' },
    dinner: { calories: '', protein: '', carbs: '', fat: '' },
    snacks: { calories: '', protein: '', carbs: '', fat: '' },
    water: '',
    supplements: []
  });

  const sections = [
    { id: 'meal-planner', name: 'Planificador de Comidas', icon: 'calendar-outline' },
    { id: 'recipes', name: 'Recetas', icon: 'book-outline' },
    { id: 'fitness-tracker', name: 'Seguimiento de Fitness', icon: 'pulse-outline' },
    { id: 'body-measurements', name: 'Medidas Corporales', icon: 'resize-outline' },
    { id: 'workout-tracker', name: 'Seguimiento de Entrenamientos', icon: 'barbell-outline' },
    { id: 'weight-loss', name: 'Pérdida de Peso', icon: 'trending-down-outline' },
    { id: 'nutrition-tracker', name: 'Seguimiento Nutricional', icon: 'nutrition-outline' },
    { id: 'gym-routine', name: 'Rutina de Gimnasio', icon: 'fitness-outline' },
    { id: 'sports-goals', name: 'Objetivos Deportivos', icon: 'trophy-outline' }
  ];

  const mealCategories = [
    { id: 'fruits', name: 'Frutas', icon: '🍎' },
    { id: 'vegetables', name: 'Verduras', icon: '🥬' },
    { id: 'dairy', name: 'Lácteos', icon: '🥛' },
    { id: 'meat', name: 'Carnes', icon: '🥩' },
    { id: 'bread', name: 'Panadería', icon: '🍞' },
    { id: 'frozen', name: 'Congelados', icon: '🧊' },
    { id: 'spices', name: 'Especias', icon: '🌶️' },
    { id: 'canned', name: 'Enlatados', icon: '🥫' },
    { id: 'beverages', name: 'Bebidas', icon: '🥤' }
  ];

  const quantityUnits = [
    'unidad', 'kg', 'g', 'litro', 'ml', 'paquete', 'lata', 'botella', 'caja', 'bolsa'
  ];

  const weekDays = [
    'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'
  ];

  const frequencyOptions = ['Diario', 'Semanal', 'Personalizado'];

  const difficultyLevels = ['Principiante', 'Intermedio', 'Avanzado'];
  const sports = ['Fútbol', 'Básquetbol', 'Tenis', 'Natación', 'Ciclismo', 'Running', 'Yoga', 'Pilates', 'Crossfit', 'Boxeo', 'Artes Marciales', 'Otro'];
  
  // Constantes para Seguimiento de Fitness
  const moodOptions = ['😢', '😐', '😊', '🤩'];
  const moodLabels = ['Triste', 'Neutral', 'Feliz', 'Excelente'];
  
  // Constantes para Medidas Corporales
  const measurementTypes = [
    { id: 'weight', name: 'Peso', unit: 'kg' },
    { id: 'neck', name: 'Cuello', unit: 'cm' },
    { id: 'bicep', name: 'Bíceps', unit: 'cm' },
    { id: 'bust', name: 'Busto', unit: 'cm' },
    { id: 'chest', name: 'Pecho', unit: 'cm' },
    { id: 'waist', name: 'Cintura', unit: 'cm' },
    { id: 'hips', name: 'Cadera', unit: 'cm' },
    { id: 'thigh', name: 'Muslo', unit: 'cm' },
    { id: 'calf', name: 'Pantorrilla', unit: 'cm' }
  ];
  
  // Función para obtener iconos de medidas
  const getMeasurementIcon = (measurementId) => {
    const iconMap = {
      'weight': 'scale-outline',
      'neck': 'ellipse-outline',
      'bicep': 'fitness-outline',
      'bust': 'woman-outline',
      'chest': 'body-outline',
      'waist': 'remove-outline',
      'hips': 'ellipse-outline',
      'thigh': 'fitness-outline',
      'calf': 'fitness-outline'
    };
    return iconMap[measurementId] || 'body-outline';
  };

  // Funciones para manejar medidas corporales
  const handleMeasurementChange = (measurementId, value) => {
    // Validar que solo sean números y un punto decimal
    if (measurementId === 'notes') {
      setNewMeasurements(prev => ({
        ...prev,
        [measurementId]: value
      }));
    } else {
      // Validar entrada numérica
      const numericValue = value.replace(/[^0-9.]/g, '');
      // Asegurar que solo haya un punto decimal
      const parts = numericValue.split('.');
      const validValue = parts.length > 2 ? 
        parts[0] + '.' + parts.slice(1).join('') : 
        numericValue;
      
      setNewMeasurements(prev => ({
        ...prev,
        [measurementId]: validValue
      }));
    }
  };

  const handleSaveMeasurements = () => {
    // Validar que al menos una medida esté ingresada
    const hasMeasurements = Object.keys(newMeasurements).some(key => 
      key !== 'notes' && newMeasurements[key] && newMeasurements[key].trim() !== ''
    );
    
    if (!hasMeasurements) {
      Alert.alert('Error', 'Por favor ingresa al menos una medida');
      return;
    }
    
    const dateKey = selectedMeasurementDate.toISOString().split('T')[0];
    const measurementsToSave = {
      ...newMeasurements,
      date: selectedMeasurementDate,
      timestamp: new Date().toISOString()
    };
    
    setBodyMeasurements(prev => ({
      ...prev,
      [dateKey]: measurementsToSave
    }));
    
    // Limpiar formulario
    setNewMeasurements({
      weight: '',
      neck: '',
      bicep: '',
      bust: '',
      chest: '',
      waist: '',
      hips: '',
      thigh: '',
      calf: '',
      notes: ''
    });
    
    Alert.alert('Éxito', 'Medidas guardadas correctamente');
  };

  const handleShowHistory = () => {
    // Aquí se podría implementar un modal o navegación al historial
    Alert.alert('Historial', 'Funcionalidad de historial en desarrollo');
  };

  // Función para calcular el progreso
  const calculateProgress = () => {
    const measurements = Object.values(bodyMeasurements);
    if (measurements.length < 2) {
      return {
        weight: { change: 0, trend: 'neutral' },
        waist: { change: 0, trend: 'neutral' },
        bicep: { change: 0, trend: 'neutral' }
      };
    }

    // Ordenar por fecha
    const sortedMeasurements = measurements.sort((a, b) => 
      new Date(a.timestamp) - new Date(b.timestamp)
    );

    const latest = sortedMeasurements[sortedMeasurements.length - 1];
    const previous = sortedMeasurements[sortedMeasurements.length - 2];

    const calculateChange = (key) => {
      const latestValue = parseFloat(latest[key]) || 0;
      const previousValue = parseFloat(previous[key]) || 0;
      const change = latestValue - previousValue;
      return {
        change: Math.abs(change).toFixed(1),
        trend: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral'
      };
    };

    return {
      weight: calculateChange('weight'),
      waist: calculateChange('waist'),
      bicep: calculateChange('bicep')
    };
  };
  
  // Constantes para Seguimiento de Entrenamientos
  const exerciseTypes = [
    'Cardio', 'Fuerza', 'Flexibilidad', 'Equilibrio', 'Resistencia', 'HIIT', 'Yoga', 'Pilates', 'Crossfit', 'Funcional'
  ];
  
  // Constantes para Seguimiento Nutricional
  const supplements = [
    'Multivitamínico', 'Proteína', 'Creatina', 'Omega-3', 'Vitamina D', 'Magnesio', 'Zinc', 'Hierro', 'Calcio', 'Otro'
  ];


  // Funciones para alimentación
  const openAddMealModal = () => {
    setNewMealPlan({ breakfast: '', lunch: '', dinner: '' });
    setShowAddMealModal(true);
  };

  const closeAddMealModal = () => {
    setShowAddMealModal(false);
    setNewMealPlan({ breakfast: '', lunch: '', dinner: '' });
  };

  const addMealPlan = () => {
    if (newMealPlan.breakfast.trim() || newMealPlan.lunch.trim() || newMealPlan.dinner.trim()) {
      const dateKey = selectedMealDate.toISOString().split('T')[0];
      setMealPlans({
        ...mealPlans,
        [dateKey]: { ...newMealPlan }
      });
      closeAddMealModal();
    } else {
      Alert.alert('Error', 'Por favor ingresa al menos una comida');
    }
  };

  const openAddRecipeModal = () => {
    setNewRecipe({ name: '', ingredients: '', instructions: '' });
    setShowAddRecipeModal(true);
  };

  const closeAddRecipeModal = () => {
    setShowAddRecipeModal(false);
    setNewRecipe({ name: '', ingredients: '', instructions: '' });
  };

  const addRecipe = () => {
    if (newRecipe.name.trim()) {
      setRecipes([...recipes, { ...newRecipe }]);
      closeAddRecipeModal();
    } else {
      Alert.alert('Error', 'Por favor ingresa un nombre para la receta');
    }
  };

  const openAddItemModal = (categoryId) => {
    setSelectedCategory(categoryId);
    setNewItemText('');
    setNewItemQuantity(1);
    setNewItemUnit('unidad');
    setShowAddItemModal(true);
  };

  const closeAddItemModal = () => {
    setShowAddItemModal(false);
    setSelectedCategory('');
    setNewItemText('');
    setNewItemQuantity(1);
    setNewItemUnit('unidad');
  };

  const incrementQuantity = () => {
    setNewItemQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    if (newItemQuantity > 1) {
      setNewItemQuantity(prev => prev - 1);
    }
  };

  const addItem = () => {
    if (newItemText.trim()) {
      const newItem = {
        id: Date.now(),
        name: newItemText.trim(),
        quantity: `${newItemQuantity} ${newItemUnit}`,
        purchased: false
      };
      
      setMarketList({
        ...marketList,
        [selectedCategory]: [...marketList[selectedCategory], newItem]
      });
      closeAddItemModal();
    }
  };

  const toggleItemPurchased = (categoryId, itemId) => {
    setMarketList({
      ...marketList,
      [categoryId]: marketList[categoryId].map(item => 
        item.id === itemId ? { ...item, purchased: !item.purchased } : item
      )
    });
  };

  const removeItem = (categoryId, itemId) => {
    setMarketList({
      ...marketList,
      [categoryId]: marketList[categoryId].filter(item => item.id !== itemId)
    });
  };

  // Funciones para ejercicio
  const openAddGymModal = () => {
    setNewRoutine({ 
      name: '', 
      description: '', 
      exercises: [], 
      duration: '', 
      difficulty: 'Principiante',
      schedule: {
        days: [],
        time: '',
        frequency: 'Semanal'
      }
    });
    setShowAddGymModal(true);
  };

  const closeAddGymModal = () => {
    setShowAddGymModal(false);
    setNewRoutine({ 
      name: '', 
      description: '', 
      exercises: [], 
      duration: '', 
      difficulty: 'Principiante',
      schedule: {
        days: [],
        time: '',
        frequency: 'Semanal'
      }
    });
  };

  const addGymRoutine = () => {
    if (newRoutine.name.trim()) {
      setGymRoutines([...gymRoutines, { ...newRoutine }]);
      closeAddGymModal();
    } else {
      Alert.alert('Error', 'Por favor ingresa un nombre para la rutina');
    }
  };

  const toggleDay = (day) => {
    const currentDays = newRoutine.schedule.days;
    if (currentDays.includes(day)) {
      setNewRoutine({
        ...newRoutine,
        schedule: {
          ...newRoutine.schedule,
          days: currentDays.filter(d => d !== day)
        }
      });
    } else {
      setNewRoutine({
        ...newRoutine,
        schedule: {
          ...newRoutine.schedule,
          days: [...currentDays, day]
        }
      });
    }
  };

  const openAddSportsModal = () => {
    setNewGoal({ sport: '', objective: '', targetDate: new Date(), currentProgress: '', notes: '' });
    setShowAddSportsModal(true);
  };

  const closeAddSportsModal = () => {
    setShowAddSportsModal(false);
    setNewGoal({ sport: '', objective: '', targetDate: new Date(), currentProgress: '', notes: '' });
  };

  const addSportsGoal = () => {
    if (newGoal.sport && newGoal.objective.trim()) {
      setSportsGoals([...sportsGoals, { ...newGoal }]);
      closeAddSportsModal();
    } else {
      Alert.alert('Error', 'Por favor selecciona un deporte e ingresa un objetivo');
    }
  };

  // Función para manejar el clic en los vasos de agua
  const toggleWaterGlass = (glassNumber) => {
    const today = new Date().toISOString().split('T')[0];
    const currentMealPlan = mealPlans[today] || { breakfast: '', lunch: '', dinner: '', waterGlasses: 0 };
    
    setMealPlans({
      ...mealPlans,
      [today]: {
        ...currentMealPlan,
        waterGlasses: glassNumber
      }
    });
  };

  // Renderizado de secciones de alimentación
  const renderMealPlanner = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayMealPlan = mealPlans[today] || {};
    const plannedMeals = [todayMealPlan.breakfast, todayMealPlan.lunch, todayMealPlan.dinner].filter(Boolean).length;
    const waterGlasses = todayMealPlan.waterGlasses || 0;
    
    return (
      <View style={styles.section}>
        {/* Header mejorado */}
        <View style={styles.mealPlannerHeader}>
          <View style={styles.mealPlannerHeaderContent}>
            <View style={styles.mealPlannerIconContainer}>
              <Icon name="restaurant-outline" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.mealPlannerHeaderText}>
              <Text style={styles.mealPlannerHeaderTitle}>
                Planificador de Comidas
              </Text>
              <Text style={styles.mealPlannerHeaderSubtitle}>
                Organiza tu alimentación saludable
              </Text>
            </View>
          </View>
          <View style={styles.mealPlannerHeaderBadge}>
            <Icon name="calendar-outline" size={16} color="#059669" />
          </View>
        </View>
        
        {/* Resumen nutricional mejorado */}
        <View style={styles.mealPlannerSummary}>
          <View style={styles.mealPlannerSummaryCard}>
            <View style={styles.mealPlannerSummaryIconContainer}>
              <Icon name="restaurant-outline" size={20} color="#059669" />
            </View>
            <View style={styles.mealPlannerSummaryContent}>
              <Text style={styles.mealPlannerSummaryValue}>{plannedMeals}/3</Text>
              <Text style={styles.mealPlannerSummaryLabel}>Comidas Planificadas</Text>
            </View>
          </View>
          <View style={styles.mealPlannerSummaryCard}>
            <View style={styles.mealPlannerSummaryIconContainer}>
              <Icon name="water-outline" size={20} color="#0EA5E9" />
            </View>
            <View style={styles.mealPlannerSummaryContent}>
              <Text style={styles.mealPlannerSummaryValue}>{waterGlasses}/8</Text>
              <Text style={styles.mealPlannerSummaryLabel}>Vasos de Agua</Text>
            </View>
          </View>
          <View style={styles.mealPlannerSummaryCard}>
            <View style={styles.mealPlannerSummaryIconContainer}>
              <Icon name="flame-outline" size={20} color="#F59E0B" />
            </View>
            <View style={styles.mealPlannerSummaryContent}>
              <Text style={styles.mealPlannerSummaryValue}>1,850</Text>
              <Text style={styles.mealPlannerSummaryLabel}>Calorías</Text>
            </View>
          </View>
          <View style={styles.mealPlannerSummaryCard}>
            <View style={styles.mealPlannerSummaryIconContainer}>
              <Icon name="leaf-outline" size={20} color="#10B981" />
            </View>
            <View style={styles.mealPlannerSummaryContent}>
              <Text style={styles.mealPlannerSummaryValue}>85%</Text>
              <Text style={styles.mealPlannerSummaryLabel}>Nutrición</Text>
            </View>
          </View>
        </View>
        
        {/* Botón para agregar comida */}
        <View style={styles.addMealContainer}>
          <TouchableOpacity 
            style={styles.addMealButton}
            onPress={openAddMealModal}
          >
            <Icon name="add-circle-outline" size={20} color="#FFFFFF" />
            <Text style={styles.addMealText}>Planificar Comida</Text>
          </TouchableOpacity>
        </View>
        
        {/* Plan de comidas del día mejorado */}
        <View style={styles.dailyMealPlanContainer}>
          <View style={styles.dailyMealPlanHeader}>
            <View style={styles.dailyMealPlanTitleContainer}>
              <Icon name="calendar-outline" size={20} color="#059669" />
              <Text style={styles.dailyMealPlanTitle}>Plan de Hoy</Text>
            </View>
            <Text style={styles.dailyMealPlanDate}>
              {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
            </Text>
          </View>
          
          <View style={styles.mealsGrid}>
            {/* Desayuno */}
            <View style={styles.mealCard}>
              <View style={styles.mealCardHeader}>
                <View style={styles.mealCardIconContainer}>
                  <Icon name="sunny-outline" size={20} color="#F59E0B" />
                </View>
                <View style={styles.mealCardContent}>
                  <Text style={styles.mealCardTitle}>Desayuno</Text>
                  <Text style={styles.mealCardTime}>7:00 - 9:00 AM</Text>
                </View>
                <TouchableOpacity style={styles.mealCardActionButton}>
                  <Icon name="add-outline" size={16} color="#059669" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.mealCardBody}>
                {todayMealPlan.breakfast ? (
                  <View style={styles.mealContent}>
                    <Text style={styles.mealContentText}>{todayMealPlan.breakfast}</Text>
                    <View style={styles.mealContentActions}>
                      <TouchableOpacity style={styles.mealContentAction}>
                        <Icon name="create-outline" size={14} color="#059669" />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.mealContentAction}>
                        <Icon name="trash-outline" size={14} color="#DC2626" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <View style={styles.emptyMealState}>
                    <Icon name="restaurant-outline" size={24} color="#9CA3AF" />
                    <Text style={styles.emptyMealText}>No planificado</Text>
                    <TouchableOpacity style={styles.addMealButtonSmall}>
                      <Icon name="add-circle-outline" size={16} color="#059669" />
                      <Text style={styles.addMealButtonSmallText}>Agregar</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
            
            {/* Comida */}
            <View style={styles.mealCard}>
              <View style={styles.mealCardHeader}>
                <View style={styles.mealCardIconContainer}>
                  <Icon name="sunny-outline" size={20} color="#F59E0B" />
                </View>
                <View style={styles.mealCardContent}>
                  <Text style={styles.mealCardTitle}>Comida</Text>
                  <Text style={styles.mealCardTime}>12:00 - 2:00 PM</Text>
                </View>
                <TouchableOpacity style={styles.mealCardActionButton}>
                  <Icon name="add-outline" size={16} color="#059669" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.mealCardBody}>
                {todayMealPlan.lunch ? (
                  <View style={styles.mealContent}>
                    <Text style={styles.mealContentText}>{todayMealPlan.lunch}</Text>
                    <View style={styles.mealContentActions}>
                      <TouchableOpacity style={styles.mealContentAction}>
                        <Icon name="create-outline" size={14} color="#059669" />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.mealContentAction}>
                        <Icon name="trash-outline" size={14} color="#DC2626" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <View style={styles.emptyMealState}>
                    <Icon name="restaurant-outline" size={24} color="#9CA3AF" />
                    <Text style={styles.emptyMealText}>No planificado</Text>
                    <TouchableOpacity style={styles.addMealButtonSmall}>
                      <Icon name="add-circle-outline" size={16} color="#059669" />
                      <Text style={styles.addMealButtonSmallText}>Agregar</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
            
            {/* Cena */}
            <View style={styles.mealCard}>
              <View style={styles.mealCardHeader}>
                <View style={styles.mealCardIconContainer}>
                  <Icon name="moon-outline" size={20} color="#8B5CF6" />
                </View>
                <View style={styles.mealCardContent}>
                  <Text style={styles.mealCardTitle}>Cena</Text>
                  <Text style={styles.mealCardTime}>7:00 - 9:00 PM</Text>
                </View>
                <TouchableOpacity style={styles.mealCardActionButton}>
                  <Icon name="add-outline" size={16} color="#059669" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.mealCardBody}>
                {todayMealPlan.dinner ? (
                  <View style={styles.mealContent}>
                    <Text style={styles.mealContentText}>{todayMealPlan.dinner}</Text>
                    <View style={styles.mealContentActions}>
                      <TouchableOpacity style={styles.mealContentAction}>
                        <Icon name="create-outline" size={14} color="#059669" />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.mealContentAction}>
                        <Icon name="trash-outline" size={14} color="#DC2626" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <View style={styles.emptyMealState}>
                    <Icon name="restaurant-outline" size={24} color="#9CA3AF" />
                    <Text style={styles.emptyMealText}>No planificado</Text>
                    <TouchableOpacity style={styles.addMealButtonSmall}>
                      <Icon name="add-circle-outline" size={16} color="#059669" />
                      <Text style={styles.addMealButtonSmallText}>Agregar</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>
        
        {/* Seguimiento de hidratación mejorado */}
        <View style={styles.waterTrackingContainer}>
          <View style={styles.waterTrackingHeader}>
            <View style={styles.waterTrackingTitleContainer}>
              <Icon name="water-outline" size={20} color="#0EA5E9" />
              <Text style={styles.waterTrackingTitle}>Seguimiento de Hidratación</Text>
            </View>
            <Text style={styles.waterTrackingSubtitle}>Meta: 8 vasos de agua al día</Text>
          </View>
          
          <View style={styles.waterGlassesContainer}>
            {Array.from({length: 8}, (_, index) => (
              <TouchableOpacity 
                key={index} 
                style={[
                  styles.waterGlassCard, 
                  index < waterGlasses && styles.waterGlassCardFilled
                ]}
                onPress={() => toggleWaterGlass(index + 1)}
              >
                <Icon 
                  name="water" 
                  size={20} 
                  color={index < waterGlasses ? "#0EA5E9" : "#D1D5DB"} 
                />
                <Text style={[
                  styles.waterGlassNumber,
                  index < waterGlasses && styles.waterGlassNumberFilled
                ]}>
                  {index + 1}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <View style={styles.waterProgressContainer}>
            <View style={styles.waterProgressBar}>
              <View 
                style={[
                  styles.waterProgressFill,
                  { width: `${(waterGlasses / 8) * 100}%` }
                ]}
              />
            </View>
            <Text style={styles.waterProgressText}>
              {waterGlasses} de 8 vasos completados
            </Text>
          </View>
        </View>
        
        {/* Accesos rápidos mejorados */}
        <View style={styles.quickAccessContainer}>
          <Text style={styles.quickAccessTitle}>Accesos Rápidos</Text>
          <View style={styles.quickAccessGrid}>
            <TouchableOpacity style={styles.quickAccessCard}>
              <View style={styles.quickAccessIconContainer}>
                <Icon name="book-outline" size={24} color="#059669" />
              </View>
              <Text style={styles.quickAccessText}>Recetas</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickAccessCard}>
              <View style={styles.quickAccessIconContainer}>
                <Icon name="list-outline" size={24} color="#10B981" />
              </View>
              <Text style={styles.quickAccessText}>Lista de Compras</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickAccessCard}>
              <View style={styles.quickAccessIconContainer}>
                <Icon name="analytics-outline" size={24} color="#F59E0B" />
              </View>
              <Text style={styles.quickAccessText}>Nutrición</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickAccessCard}>
              <View style={styles.quickAccessIconContainer}>
                <Icon name="calendar-outline" size={24} color="#8B5CF6" />
              </View>
              <Text style={styles.quickAccessText}>Plan Semanal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderMarketList = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.headerDecoration}>
          <Image
            source={require('../../android/app/src/main/assets/salud.png')}
            style={styles.mascotImage}
            resizeMode="contain"
          />
        </View>
        <View style={styles.headerContent}>
          <Text style={styles.sectionTitle}>Lista de Compras</Text>
          <Text style={styles.sectionSubtitle}>
            Organiza tus compras saludables
          </Text>
        </View>
      </View>
      
      <View style={styles.marketListContainer}>
        {mealCategories.map((category) => (
          <View key={category.id} style={styles.categorySection}>
            <View style={styles.categoryHeader}>
              <Text style={styles.categoryTitle}>
                {category.icon} {category.name}
              </Text>
              <TouchableOpacity
                style={styles.addItemButton}
                onPress={() => openAddItemModal(category.id)}
              >
                <Icon name="add" size={16} color="#4A7C59" />
                <Text style={styles.addItemText}>Agregar</Text>
              </TouchableOpacity>
            </View>
            
            {marketList[category.id].map((item) => (
              <View key={item.id} style={[styles.itemRow, item.purchased && styles.itemRowPurchased]}>
                <TouchableOpacity
                  onPress={() => toggleItemPurchased(category.id, item.id)}
                  style={styles.checkboxContainer}
                >
                  <Icon 
                    name={item.purchased ? "checkbox" : "square-outline"} 
                    size={20} 
                    color={item.purchased ? "#28a745" : "#4A6741"} 
                  />
                </TouchableOpacity>
                <View style={styles.itemInfo}>
                  <Text style={[styles.itemText, item.purchased && styles.itemTextPurchased]}>
                    {item.name}
                  </Text>
                  <Text style={[styles.itemQuantity, item.purchased && styles.itemQuantityPurchased]}>
                    {item.quantity}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => removeItem(category.id, item.id)}
                  style={styles.removeButton}
                >
                  <Icon name="close" size={16} color="#dc3545" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ))}
      </View>
    </View>
  );

  const renderRecipes = () => {
    const sampleRecipes = [
      {
        id: 1,
        name: 'Ensalada César Saludable',
        category: 'Ensaladas',
        difficulty: 'Fácil',
        time: '15 min',
        servings: 4,
        calories: 320,
        ingredients: [
          'Lechuga romana fresca',
          'Pechuga de pollo a la plancha',
          'Queso parmesano rallado',
          'Crutones integrales',
          'Aderezo césar light'
        ],
        instructions: 'Corta la lechuga, cocina el pollo, mezcla todos los ingredientes y sirve con el aderezo.',
        tags: ['proteína', 'vegetales', 'bajo en calorías'],
        rating: 4.5,
        image: '🥗'
      },
      {
        id: 2,
        name: 'Salmón a la Plancha con Vegetales',
        category: 'Pescados',
        difficulty: 'Intermedio',
        time: '25 min',
        servings: 2,
        calories: 450,
        ingredients: [
          'Filete de salmón fresco',
          'Brócoli',
          'Zanahorias',
          'Aceite de oliva',
          'Limón',
          'Hierbas aromáticas'
        ],
        instructions: 'Marina el salmón, cocina a la plancha con vegetales al vapor, sirve con limón.',
        tags: ['omega-3', 'proteína', 'vegetales'],
        rating: 4.8,
        image: '🐟'
      },
      {
        id: 3,
        name: 'Bowl de Quinoa y Aguacate',
        category: 'Bowls',
        difficulty: 'Fácil',
        time: '20 min',
        servings: 2,
        calories: 380,
        ingredients: [
          'Quinoa cocida',
          'Aguacate maduro',
          'Tomates cherry',
          'Pepino',
          'Semillas de chía',
          'Aceite de oliva'
        ],
        instructions: 'Cocina la quinoa, corta los vegetales, mezcla todo y adereza con aceite de oliva.',
        tags: ['superalimento', 'vegetariano', 'fibra'],
        rating: 4.3,
        image: '🥑'
      },
      {
        id: 4,
        name: 'Smoothie Verde Energético',
        category: 'Bebidas',
        difficulty: 'Fácil',
        time: '5 min',
        servings: 1,
        calories: 180,
        ingredients: [
          'Espinacas frescas',
          'Plátano congelado',
          'Piña',
          'Leche de almendras',
          'Miel',
          'Semillas de lino'
        ],
        instructions: 'Licúa todos los ingredientes hasta obtener una mezcla suave y cremosa.',
        tags: ['vitaminas', 'energía', 'verde'],
        rating: 4.6,
        image: '🥤'
      }
    ];

    const getTotalRecipes = () => sampleRecipes.length;
    const getEasyRecipes = () => sampleRecipes.filter(recipe => recipe.difficulty === 'Fácil').length;
    const getAverageRating = () => (sampleRecipes.reduce((sum, recipe) => sum + recipe.rating, 0) / sampleRecipes.length).toFixed(1);
    const getTotalCalories = () => sampleRecipes.reduce((sum, recipe) => sum + recipe.calories, 0);

    const getDifficultyColor = (difficulty) => {
      switch (difficulty) {
        case 'Fácil': return '#10B981';
        case 'Intermedio': return '#F59E0B';
        case 'Difícil': return '#EF4444';
        default: return '#6B7280';
      }
    };

    const getCategoryIcon = (category) => {
      switch (category) {
        case 'Ensaladas': return 'leaf-outline';
        case 'Pescados': return 'fish-outline';
        case 'Bowls': return 'restaurant-outline';
        case 'Bebidas': return 'wine-outline';
        default: return 'restaurant-outline';
      }
    };

    return (
      <View style={styles.section}>
        {/* Header mejorado */}
        <View style={styles.recipesHeader}>
          <View style={styles.recipesHeaderContent}>
            <View style={styles.recipesIconContainer}>
              <Icon name="book-outline" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.recipesHeaderText}>
              <Text style={styles.recipesHeaderTitle}>
                Recetas Saludables
              </Text>
              <Text style={styles.recipesHeaderSubtitle}>
                Descubre nuevas recetas nutritivas
              </Text>
            </View>
          </View>
          <View style={styles.recipesHeaderBadge}>
            <Icon name="flame-outline" size={16} color="#059669" />
          </View>
        </View>
        
        {/* Resumen de recetas mejorado */}
        <View style={styles.recipesSummary}>
          <View style={styles.recipesSummaryCard}>
            <View style={styles.recipesSummaryIconContainer}>
              <Icon name="book-outline" size={20} color="#059669" />
            </View>
            <View style={styles.recipesSummaryContent}>
              <Text style={styles.recipesSummaryValue}>{getTotalRecipes()}</Text>
              <Text style={styles.recipesSummaryLabel}>Total Recetas</Text>
            </View>
          </View>
          <View style={styles.recipesSummaryCard}>
            <View style={styles.recipesSummaryIconContainer}>
              <Icon name="checkmark-circle-outline" size={20} color="#10B981" />
            </View>
            <View style={styles.recipesSummaryContent}>
              <Text style={styles.recipesSummaryValue}>{getEasyRecipes()}</Text>
              <Text style={styles.recipesSummaryLabel}>Fáciles</Text>
            </View>
          </View>
          <View style={styles.recipesSummaryCard}>
            <View style={styles.recipesSummaryIconContainer}>
              <Icon name="star-outline" size={20} color="#F59E0B" />
            </View>
            <View style={styles.recipesSummaryContent}>
              <Text style={styles.recipesSummaryValue}>{getAverageRating()}</Text>
              <Text style={styles.recipesSummaryLabel}>Calificación</Text>
            </View>
          </View>
          <View style={styles.recipesSummaryCard}>
            <View style={styles.recipesSummaryIconContainer}>
              <Icon name="flame-outline" size={20} color="#EF4444" />
            </View>
            <View style={styles.recipesSummaryContent}>
              <Text style={styles.recipesSummaryValue}>{getTotalCalories()}</Text>
              <Text style={styles.recipesSummaryLabel}>Calorías</Text>
            </View>
          </View>
        </View>
        
        {/* Botón para agregar receta */}
        <View style={styles.addRecipeContainer}>
          <TouchableOpacity 
            style={styles.addRecipeButton}
            onPress={openAddRecipeModal}
          >
            <Icon name="add-circle-outline" size={20} color="#FFFFFF" />
            <Text style={styles.addRecipeText}>Nueva Receta</Text>
          </TouchableOpacity>
        </View>
        
        {/* Lista de recetas mejorada */}
        <View style={styles.recipesContainer}>
          <View style={styles.recipesListHeader}>
            <Text style={styles.recipesListTitle}>Mis Recetas</Text>
            <TouchableOpacity style={styles.filterButton}>
              <Icon name="filter-outline" size={16} color="#059669" />
              <Text style={styles.filterText}>Filtrar</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.recipesBody} showsVerticalScrollIndicator={false}>
            {sampleRecipes.map((recipe) => (
              <View key={recipe.id} style={styles.recipeCard}>
                <View style={styles.recipeCardHeader}>
                  <View style={styles.recipeCardIconContainer}>
                    <Text style={styles.recipeEmoji}>{recipe.image}</Text>
                  </View>
                  <View style={styles.recipeCardContent}>
                    <Text style={styles.recipeCardTitle}>{recipe.name}</Text>
                    <Text style={styles.recipeCardCategory}>{recipe.category}</Text>
                  </View>
                  <View style={styles.recipeCardActions}>
                    <TouchableOpacity style={styles.recipeActionButton}>
                      <Icon name="heart-outline" size={16} color="#EF4444" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.recipeActionButton}>
                      <Icon name="share-outline" size={16} color="#059669" />
                    </TouchableOpacity>
                  </View>
                </View>
                
                <View style={styles.recipeCardBody}>
                  <View style={styles.recipeMeta}>
                    <View style={styles.recipeMetaItem}>
                      <Icon name="time-outline" size={14} color="#6B7280" />
                      <Text style={styles.recipeMetaText}>{recipe.time}</Text>
                    </View>
                    <View style={styles.recipeMetaItem}>
                      <Icon name="people-outline" size={14} color="#6B7280" />
                      <Text style={styles.recipeMetaText}>{recipe.servings} porciones</Text>
                    </View>
                    <View style={styles.recipeMetaItem}>
                      <Icon name="flame-outline" size={14} color="#6B7280" />
                      <Text style={styles.recipeMetaText}>{recipe.calories} kcal</Text>
                    </View>
                  </View>
                  
                  <View style={styles.recipeDifficulty}>
                    <View style={[
                      styles.difficultyBadge,
                      { backgroundColor: getDifficultyColor(recipe.difficulty) }
                    ]}>
                      <Text style={styles.difficultyText}>{recipe.difficulty}</Text>
                    </View>
                    <View style={styles.recipeRating}>
                      <Icon name="star" size={14} color="#F59E0B" />
                      <Text style={styles.ratingText}>{recipe.rating}</Text>
                    </View>
                  </View>
                  
                  <Text style={styles.recipeDescription}>
                    {recipe.instructions}
                  </Text>
                  
                  <View style={styles.recipeTags}>
                    {recipe.tags.map((tag, index) => (
                      <View key={index} style={styles.recipeTag}>
                        <Text style={styles.recipeTagText}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                  
                  <View style={styles.recipeActions}>
                    <TouchableOpacity style={styles.recipeActionButtonLarge}>
                      <Icon name="eye-outline" size={16} color="#059669" />
                      <Text style={styles.recipeActionText}>Ver Receta</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.recipeActionButtonLarge}>
                      <Icon name="add-outline" size={16} color="#059669" />
                      <Text style={styles.recipeActionText}>Agregar a Plan</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    );
  };

  // Renderizado de secciones de ejercicio
  const renderGymRoutine = () => {
    const sampleGymData = {
      weeklyStats: {
        totalWorkouts: 4,
        totalDuration: 320, // minutos
        totalExercises: 28,
        averageIntensity: 7.2
      },
      routines: [
        {
          id: 1,
          name: 'Fuerza Superior',
          difficulty: 'Intermedio',
          duration: '75 min',
          exerciseCount: 8,
          completed: true,
          lastWorkout: '2024-01-15',
          nextWorkout: '2024-01-17',
          schedule: {
            days: ['Lunes', 'Miércoles', 'Viernes'],
            time: '18:00',
            frequency: '3x/semana'
          },
          exercises: [
            { name: 'Press Banca', sets: 4, reps: '8-10', weight: 80, rest: 3 },
            { name: 'Remo con Barra', sets: 4, reps: '8-10', weight: 70, rest: 3 },
            { name: 'Press Militar', sets: 3, reps: '10-12', weight: 50, rest: 2 },
            { name: 'Dominadas', sets: 3, reps: '6-8', weight: 'Peso Corporal', rest: 2 }
          ]
        },
        {
          id: 2,
          name: 'Fuerza Inferior',
          difficulty: 'Avanzado',
          duration: '90 min',
          exerciseCount: 6,
          completed: false,
          lastWorkout: '2024-01-14',
          nextWorkout: '2024-01-16',
          schedule: {
            days: ['Martes', 'Jueves'],
            time: '19:00',
            frequency: '2x/semana'
          },
          exercises: [
            { name: 'Sentadillas', sets: 5, reps: '5-8', weight: 120, rest: 4 },
            { name: 'Peso Muerto', sets: 4, reps: '6-8', weight: 140, rest: 4 },
            { name: 'Prensa de Piernas', sets: 4, reps: '12-15', weight: 200, rest: 2 }
          ]
        },
        {
          id: 3,
          name: 'Cardio HIIT',
          difficulty: 'Principiante',
          duration: '30 min',
          exerciseCount: 5,
          completed: true,
          lastWorkout: '2024-01-15',
          nextWorkout: '2024-01-18',
          schedule: {
            days: ['Miércoles', 'Sábado'],
            time: '07:00',
            frequency: '2x/semana'
          },
          exercises: [
            { name: 'Burpees', sets: 4, reps: '30 seg', weight: 'Peso Corporal', rest: 1 },
            { name: 'Mountain Climbers', sets: 4, reps: '30 seg', weight: 'Peso Corporal', rest: 1 },
            { name: 'Jumping Jacks', sets: 4, reps: '30 seg', weight: 'Peso Corporal', rest: 1 }
          ]
        }
      ],
      goals: [
        { id: 1, title: 'Entrenar 4 días/semana', current: 4, target: 4, unit: 'días', completed: true },
        { id: 2, title: 'Completar 20 ejercicios', current: 19, target: 20, unit: 'ejercicios', completed: false },
        { id: 3, title: 'Aumentar peso en Press Banca', current: 80, target: 85, unit: 'kg', completed: false },
        { id: 4, title: 'Mantener rutina por 1 mes', current: 15, target: 30, unit: 'días', completed: false }
      ],
      achievements: [
        { id: 1, title: 'Primera Rutina', description: 'Completaste tu primera rutina de gimnasio', icon: '🏋️', unlocked: true },
        { id: 2, title: 'Consistencia', description: '4 entrenamientos en una semana', icon: '💪', unlocked: true },
        { id: 3, title: 'Fuerza', description: 'Levantaste 100kg+ en peso muerto', icon: '🔥', unlocked: true },
        { id: 4, title: 'Maratón', description: '30 días consecutivos entrenando', icon: '🏃', unlocked: false }
      ]
    };

    const getUnlockedAchievements = () => {
      return sampleGymData.achievements.filter(achievement => achievement.unlocked).length;
    };

    const getProgressPercentage = (current, target) => {
      return Math.min((current / target) * 100, 100);
    };

    const getDifficultyColor = (difficulty) => {
      const colors = {
        'Principiante': '#059669',
        'Intermedio': '#F59E0B',
        'Avanzado': '#EF4444'
      };
      return colors[difficulty] || '#059669';
    };

    return (
    <View style={styles.section}>
        {/* Header estilo fitness */}
        <View style={styles.gymHeader}>
          <View style={styles.gymHeaderContent}>
            <View style={styles.gymIconContainer}>
              <Icon name="barbell-outline" size={24} color="#FFFFFF" />
        </View>
            <View style={styles.gymHeaderText}>
              <Text style={styles.gymHeaderTitle}>
                Rutina de Gimnasio
              </Text>
              <Text style={styles.gymHeaderSubtitle}>
                Planifica y ejecuta tus entrenamientos
          </Text>
        </View>
          </View>
          <View style={styles.gymHeaderBadge}>
            <Icon name="fitness-outline" size={16} color="#059669" />
          </View>
        </View>

        {/* Resumen de estadísticas */}
        <View style={styles.gymSummary}>
          <View style={styles.gymSummaryCard}>
            <View style={styles.gymSummaryIconContainer}>
              <Icon name="barbell-outline" size={20} color="#059669" />
            </View>
            <View style={styles.gymSummaryContent}>
              <Text style={styles.gymSummaryValue}>{sampleGymData.weeklyStats.totalWorkouts}</Text>
              <Text style={styles.gymSummaryLabel}>Rutinas</Text>
            </View>
          </View>
          <View style={styles.gymSummaryCard}>
            <View style={styles.gymSummaryIconContainer}>
              <Icon name="time-outline" size={20} color="#EF4444" />
            </View>
            <View style={styles.gymSummaryContent}>
              <Text style={styles.gymSummaryValue}>{sampleGymData.weeklyStats.totalDuration}m</Text>
              <Text style={styles.gymSummaryLabel}>Duración</Text>
            </View>
          </View>
          <View style={styles.gymSummaryCard}>
            <View style={styles.gymSummaryIconContainer}>
              <Icon name="fitness-outline" size={20} color="#F59E0B" />
            </View>
            <View style={styles.gymSummaryContent}>
              <Text style={styles.gymSummaryValue}>{sampleGymData.weeklyStats.totalExercises}</Text>
              <Text style={styles.gymSummaryLabel}>Ejercicios</Text>
            </View>
          </View>
          <View style={styles.gymSummaryCard}>
            <View style={styles.gymSummaryIconContainer}>
              <Icon name="pulse-outline" size={20} color="#EC4899" />
            </View>
            <View style={styles.gymSummaryContent}>
              <Text style={styles.gymSummaryValue}>{sampleGymData.weeklyStats.averageIntensity}/10</Text>
              <Text style={styles.gymSummaryLabel}>Intensidad</Text>
            </View>
          </View>
        </View>

        {/* Botón para agregar rutina */}
        <View style={styles.addRoutineContainer}>
          <TouchableOpacity 
            style={styles.addRoutineButton}
            onPress={openAddGymModal}
          >
            <Icon name="add-circle-outline" size={20} color="#FFFFFF" />
            <Text style={styles.addRoutineText}>Crear Rutina</Text>
        </TouchableOpacity>
      </View>
      
        {/* Lista de rutinas */}
      <View style={styles.routinesContainer}>
          <View style={styles.routinesHeader}>
            <Text style={styles.routinesTitle}>Mis Rutinas</Text>
            <Text style={styles.routinesSubtitle}>
              {sampleGymData.routines.filter(routine => routine.completed).length}/{sampleGymData.routines.length} completadas esta semana
            </Text>
          </View>
          
          <View style={styles.routinesList}>
            {sampleGymData.routines.map((routine) => (
              <View key={routine.id} style={styles.routineCard}>
                <View style={styles.routineCardHeader}>
                  <View style={styles.routineCardInfo}>
                    <View style={styles.routineCardTitleRow}>
                      <Text style={styles.routineCardTitle}>{routine.name}</Text>
                      <View style={[
                        styles.difficultyBadge,
                        { backgroundColor: getDifficultyColor(routine.difficulty) }
              ]}>
                <Text style={styles.difficultyText}>{routine.difficulty}</Text>
              </View>
            </View>
                    <Text style={styles.routineCardDescription}>
                      {routine.exerciseCount} ejercicios • {routine.duration}
                </Text>
                    <View style={styles.routineCardSchedule}>
                      <Icon name="calendar-outline" size={14} color="#6B7280" />
                      <Text style={styles.routineCardScheduleText}>
                        {routine.schedule.days.join(', ')} a las {routine.schedule.time}
                      </Text>
              </View>
                  </View>
                  <View style={styles.routineCardStatus}>
                    <View style={[
                      styles.routineStatusIcon,
                      routine.completed && styles.routineStatusIconCompleted
                    ]}>
                      <Icon 
                        name={routine.completed ? "checkmark-circle" : "ellipse-outline"} 
                        size={24} 
                        color={routine.completed ? "#059669" : "#E5E7EB"} 
                      />
                    </View>
                    <Text style={[
                      styles.routineStatusText,
                      routine.completed && styles.routineStatusTextCompleted
                    ]}>
                      {routine.completed ? 'Completada' : 'Pendiente'}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.routineCardExercises}>
                  <Text style={styles.routineCardExercisesTitle}>Ejercicios:</Text>
                  <View style={styles.exercisesList}>
                    {routine.exercises.slice(0, 3).map((exercise, exIndex) => (
                <View key={exIndex} style={styles.exerciseItem}>
                  <Text style={styles.exerciseName}>• {exercise.name}</Text>
                  <Text style={styles.exerciseDetails}>
                          {exercise.sets} series x {exercise.reps}
                    {exercise.weight && ` @ ${exercise.weight}kg`}
                  </Text>
                </View>
              ))}
                    {routine.exercises.length > 3 && (
                      <Text style={styles.moreExercisesText}>
                        +{routine.exercises.length - 3} ejercicios más
                      </Text>
                    )}
                  </View>
                </View>
                
                <View style={styles.routineCardActions}>
                  <TouchableOpacity style={styles.startRoutineButton}>
                    <Icon name="play-outline" size={16} color="#FFFFFF" />
                    <Text style={styles.startRoutineText}>Comenzar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.editRoutineButton}>
                    <Icon name="create-outline" size={16} color="#059669" />
                    <Text style={styles.editRoutineText}>Editar</Text>
                  </TouchableOpacity>
            </View>
          </View>
        ))}
          </View>
        </View>

        {/* Objetivos de gimnasio */}
        <View style={styles.gymGoalsContainer}>
          <View style={styles.gymGoalsHeader}>
            <Text style={styles.gymGoalsTitle}>Objetivos de la Semana</Text>
            <Text style={styles.gymGoalsSubtitle}>
              {sampleGymData.goals.filter(goal => goal.completed).length}/{sampleGymData.goals.length} completados
            </Text>
          </View>
          
          <View style={styles.gymGoalsList}>
            {sampleGymData.goals.map((goal) => (
              <View key={goal.id} style={styles.gymGoalCard}>
                <View style={styles.gymGoalHeader}>
                  <Text style={styles.gymGoalTitle}>{goal.title}</Text>
                  <Text style={styles.gymGoalValues}>
                    {goal.current}/{goal.target} {goal.unit}
                  </Text>
                </View>
                <View style={styles.gymGoalProgress}>
                  <View style={styles.gymGoalProgressBar}>
                    <View 
                      style={[
                        styles.gymGoalProgressFill,
                        { 
                          width: `${getProgressPercentage(goal.current, goal.target)}%`,
                          backgroundColor: goal.completed ? '#059669' : '#F59E0B'
                        }
                      ]}
                    />
                  </View>
                  <Text style={styles.gymGoalPercentage}>
                    {Math.round(getProgressPercentage(goal.current, goal.target))}%
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Sistema de logros */}
        <View style={styles.gymAchievementsContainer}>
          <View style={styles.gymAchievementsHeader}>
            <Text style={styles.gymAchievementsTitle}>Logros de Gimnasio</Text>
            <Text style={styles.gymAchievementsSubtitle}>
              {getUnlockedAchievements()}/{sampleGymData.achievements.length} desbloqueados
            </Text>
          </View>
          
          <View style={styles.gymAchievementsGrid}>
            {sampleGymData.achievements.map((achievement) => (
              <View key={achievement.id} style={[
                styles.gymAchievementCard,
                !achievement.unlocked && styles.gymAchievementCardLocked
              ]}>
                <View style={styles.gymAchievementIcon}>
                  <Text style={[
                    styles.gymAchievementEmoji,
                    !achievement.unlocked && styles.gymAchievementEmojiLocked
                  ]}>
                    {achievement.unlocked ? achievement.icon : '🔒'}
                  </Text>
                </View>
                <View style={styles.gymAchievementContent}>
                  <Text style={[
                    styles.gymAchievementTitle,
                    !achievement.unlocked && styles.gymAchievementTitleLocked
                  ]}>
                    {achievement.title}
                  </Text>
                  <Text style={[
                    styles.gymAchievementDescription,
                    !achievement.unlocked && styles.gymAchievementDescriptionLocked
                  ]}>
                    {achievement.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>
      </View>
    </View>
  );
  };

  const renderSportsGoals = () => {
    const sampleSportsData = {
      weeklyStats: {
        totalGoals: 8,
        completedGoals: 5,
        activeGoals: 3,
        completionRate: 62.5
      },
      goals: [
        {
          id: 1,
          sport: 'Fútbol',
          category: 'Deportes de Equipo',
          objective: 'Marcar 3 goles en el próximo partido',
          targetDate: '2024-01-20',
          currentProgress: '2 goles marcados',
          progressPercentage: 67,
          priority: 'Alta',
          status: 'En Progreso',
          completed: false,
          notes: 'Mejorar precisión en el tiro',
          icon: '⚽'
        },
        {
          id: 2,
          sport: 'Natación',
          category: 'Deportes Acuáticos',
          objective: 'Nadar 1000m sin parar',
          targetDate: '2024-01-25',
          currentProgress: '800m completados',
          progressPercentage: 80,
          priority: 'Media',
          status: 'En Progreso',
          completed: false,
          notes: 'Enfocarse en la respiración',
          icon: '🏊'
        },
        {
          id: 3,
          sport: 'Running',
          category: 'Deportes de Resistencia',
          objective: 'Completar media maratón',
          targetDate: '2024-02-15',
          currentProgress: '15km máximo corridos',
          progressPercentage: 71,
          priority: 'Alta',
          status: 'En Progreso',
          completed: false,
          notes: 'Incrementar distancia gradualmente',
          icon: '🏃'
        },
        {
          id: 4,
          sport: 'Tenis',
          category: 'Deportes de Raqueta',
          objective: 'Ganar 5 partidos consecutivos',
          targetDate: '2024-01-18',
          currentProgress: '5 partidos ganados',
          progressPercentage: 100,
          priority: 'Media',
          status: 'Completado',
          completed: true,
          notes: 'Excelente trabajo en el saque',
          icon: '🎾'
        },
        {
          id: 5,
          sport: 'Ciclismo',
          category: 'Deportes de Resistencia',
          objective: 'Subir el puerto de montaña',
          targetDate: '2024-02-01',
          currentProgress: '80% de la subida',
          progressPercentage: 80,
          priority: 'Alta',
          status: 'En Progreso',
          completed: false,
          notes: 'Mejorar resistencia en subidas',
          icon: '🚴'
        }
      ],
      categories: [
        { name: 'Deportes de Equipo', count: 1, color: '#EF4444' },
        { name: 'Deportes Acuáticos', count: 1, color: '#3B82F6' },
        { name: 'Deportes de Resistencia', count: 2, color: '#10B981' },
        { name: 'Deportes de Raqueta', count: 1, color: '#F59E0B' }
      ],
      achievements: [
        { id: 1, title: 'Primer Objetivo', description: 'Completaste tu primer objetivo deportivo', icon: '🏆', unlocked: true },
        { id: 2, title: 'Consistencia', description: '5 objetivos completados en un mes', icon: '💪', unlocked: true },
        { id: 3, title: 'Multideportista', description: 'Objetivos en 3 deportes diferentes', icon: '🌟', unlocked: true },
        { id: 4, title: 'Campeón', description: '10 objetivos completados', icon: '👑', unlocked: false }
      ]
    };

    const getUnlockedAchievements = () => {
      return sampleSportsData.achievements.filter(achievement => achievement.unlocked).length;
    };

    const getProgressPercentage = (current, target) => {
      return Math.min((current / target) * 100, 100);
    };

    const getPriorityColor = (priority) => {
      const colors = {
        'Alta': '#EF4444',
        'Media': '#F59E0B',
        'Baja': '#10B981'
      };
      return colors[priority] || '#6B7280';
    };

    const getStatusColor = (status) => {
      const colors = {
        'Completado': '#10B981',
        'En Progreso': '#3B82F6',
        'Pendiente': '#6B7280'
      };
      return colors[status] || '#6B7280';
    };

    return (
    <View style={styles.section}>
        {/* Header estilo fitness */}
        <View style={styles.sportsHeader}>
          <View style={styles.sportsHeaderContent}>
            <View style={styles.sportsIconContainer}>
              <Icon name="trophy-outline" size={24} color="#FFFFFF" />
        </View>
            <View style={styles.sportsHeaderText}>
              <Text style={styles.sportsHeaderTitle}>
                Objetivos Deportivos
              </Text>
              <Text style={styles.sportsHeaderSubtitle}>
                Establece y alcanza tus metas deportivas
          </Text>
        </View>
          </View>
          <View style={styles.sportsHeaderBadge}>
            <Icon name="flag-outline" size={16} color="#059669" />
          </View>
        </View>

        {/* Resumen de estadísticas */}
        <View style={styles.sportsSummary}>
          <View style={styles.sportsSummaryCard}>
            <View style={styles.sportsSummaryIconContainer}>
              <Icon name="trophy-outline" size={20} color="#059669" />
            </View>
            <View style={styles.sportsSummaryContent}>
              <Text style={styles.sportsSummaryValue}>{sampleSportsData.weeklyStats.totalGoals}</Text>
              <Text style={styles.sportsSummaryLabel}>Objetivos</Text>
            </View>
          </View>
          <View style={styles.sportsSummaryCard}>
            <View style={styles.sportsSummaryIconContainer}>
              <Icon name="checkmark-circle-outline" size={20} color="#10B981" />
            </View>
            <View style={styles.sportsSummaryContent}>
              <Text style={styles.sportsSummaryValue}>{sampleSportsData.weeklyStats.completedGoals}</Text>
              <Text style={styles.sportsSummaryLabel}>Completados</Text>
            </View>
          </View>
          <View style={styles.sportsSummaryCard}>
            <View style={styles.sportsSummaryIconContainer}>
              <Icon name="time-outline" size={20} color="#3B82F6" />
            </View>
            <View style={styles.sportsSummaryContent}>
              <Text style={styles.sportsSummaryValue}>{sampleSportsData.weeklyStats.activeGoals}</Text>
              <Text style={styles.sportsSummaryLabel}>Activos</Text>
            </View>
          </View>
          <View style={styles.sportsSummaryCard}>
            <View style={styles.sportsSummaryIconContainer}>
              <Icon name="analytics-outline" size={20} color="#F59E0B" />
            </View>
            <View style={styles.sportsSummaryContent}>
              <Text style={styles.sportsSummaryValue}>{sampleSportsData.weeklyStats.completionRate}%</Text>
              <Text style={styles.sportsSummaryLabel}>Progreso</Text>
            </View>
          </View>
        </View>

        {/* Botón para agregar objetivo */}
        <View style={styles.addGoalContainer}>
          <TouchableOpacity 
            style={styles.addGoalButton}
            onPress={openAddSportsModal}
          >
            <Icon name="add-circle-outline" size={20} color="#FFFFFF" />
            <Text style={styles.addGoalText}>Crear Objetivo</Text>
        </TouchableOpacity>
      </View>
      
        {/* Categorías de deportes */}
        <View style={styles.sportsCategoriesContainer}>
          <View style={styles.sportsCategoriesHeader}>
            <Text style={styles.sportsCategoriesTitle}>Categorías</Text>
            <Text style={styles.sportsCategoriesSubtitle}>
              {sampleSportsData.categories.length} categorías activas
              </Text>
            </View>
            
          <View style={styles.sportsCategoriesGrid}>
            {sampleSportsData.categories.map((category, index) => (
              <View key={index} style={styles.sportsCategoryCard}>
                <View style={styles.sportsCategoryIcon}>
                  <View style={[styles.sportsCategoryIconBg, { backgroundColor: category.color }]}>
                    <Icon name="ellipse" size={12} color="#FFFFFF" />
                  </View>
                </View>
                <View style={styles.sportsCategoryContent}>
                  <Text style={styles.sportsCategoryName}>{category.name}</Text>
                  <Text style={styles.sportsCategoryCount}>{category.count} objetivos</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Lista de objetivos */}
        <View style={styles.sportsGoalsContainer}>
          <View style={styles.sportsGoalsHeader}>
            <Text style={styles.sportsGoalsTitle}>Mis Objetivos</Text>
            <Text style={styles.sportsGoalsSubtitle}>
              {sampleSportsData.goals.filter(goal => goal.completed).length}/{sampleSportsData.goals.length} completados
            </Text>
          </View>
          
          <View style={styles.sportsGoalsList}>
            {sampleSportsData.goals.map((goal) => (
              <View key={goal.id} style={styles.sportsGoalCard}>
                <View style={styles.sportsGoalCardHeader}>
                  <View style={styles.sportsGoalCardInfo}>
                    <View style={styles.sportsGoalCardTitleRow}>
                      <Text style={styles.sportsGoalCardIcon}>{goal.icon}</Text>
                      <View style={styles.sportsGoalCardTitleContent}>
                        <Text style={styles.sportsGoalCardTitle}>{goal.sport}</Text>
                        <Text style={styles.sportsGoalCardCategory}>{goal.category}</Text>
                      </View>
                      <View style={[
                        styles.sportsGoalPriorityBadge,
                        { backgroundColor: getPriorityColor(goal.priority) }
                      ]}>
                        <Text style={styles.sportsGoalPriorityText}>{goal.priority}</Text>
                      </View>
                    </View>
                    <Text style={styles.sportsGoalCardObjective}>{goal.objective}</Text>
                    <View style={styles.sportsGoalCardMeta}>
                      <View style={styles.sportsGoalCardDate}>
                        <Icon name="calendar-outline" size={14} color="#6B7280" />
                        <Text style={styles.sportsGoalCardDateText}>
                          {new Date(goal.targetDate).toLocaleDateString('es-ES')}
                        </Text>
                      </View>
                      <View style={[
                        styles.sportsGoalStatusBadge,
                        { backgroundColor: getStatusColor(goal.status) }
                      ]}>
                        <Text style={styles.sportsGoalStatusText}>{goal.status}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.sportsGoalCardStatus}>
                    <View style={[
                      styles.sportsGoalStatusIcon,
                      goal.completed && styles.sportsGoalStatusIconCompleted
                    ]}>
                      <Icon 
                        name={goal.completed ? "checkmark-circle" : "ellipse-outline"} 
                        size={24} 
                        color={goal.completed ? "#10B981" : "#E5E7EB"} 
                      />
                    </View>
                  </View>
                </View>
                
                <View style={styles.sportsGoalCardProgress}>
                  <View style={styles.sportsGoalCardProgressHeader}>
                    <Text style={styles.sportsGoalCardProgressLabel}>Progreso Actual:</Text>
                    <Text style={styles.sportsGoalCardProgressValue}>{goal.currentProgress}</Text>
                  </View>
                  <View style={styles.sportsGoalCardProgressBar}>
                    <View 
                      style={[
                        styles.sportsGoalCardProgressFill,
                        { 
                          width: `${goal.progressPercentage}%`,
                          backgroundColor: goal.completed ? '#10B981' : '#3B82F6'
                        }
                      ]}
                    />
                  </View>
                  <Text style={styles.sportsGoalCardProgressPercentage}>
                    {goal.progressPercentage}%
                  </Text>
            </View>
            
            {goal.notes && (
                  <View style={styles.sportsGoalCardNotes}>
                    <Icon name="document-text-outline" size={14} color="#6B7280" />
                    <Text style={styles.sportsGoalCardNotesText}>{goal.notes}</Text>
                  </View>
                )}
                
                <View style={styles.sportsGoalCardActions}>
                  <TouchableOpacity style={styles.updateProgressButton}>
                    <Icon name="trending-up-outline" size={16} color="#FFFFFF" />
                    <Text style={styles.updateProgressText}>Actualizar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.editGoalButton}>
                    <Icon name="create-outline" size={16} color="#059669" />
                    <Text style={styles.editGoalText}>Editar</Text>
                  </TouchableOpacity>
                </View>
          </View>
        ))}
          </View>
        </View>

        {/* Sistema de logros */}
        <View style={styles.sportsAchievementsContainer}>
          <View style={styles.sportsAchievementsHeader}>
            <Text style={styles.sportsAchievementsTitle}>Logros Deportivos</Text>
            <Text style={styles.sportsAchievementsSubtitle}>
              {getUnlockedAchievements()}/{sampleSportsData.achievements.length} desbloqueados
            </Text>
          </View>
          
          <View style={styles.sportsAchievementsGrid}>
            {sampleSportsData.achievements.map((achievement) => (
              <View key={achievement.id} style={[
                styles.sportsAchievementCard,
                !achievement.unlocked && styles.sportsAchievementCardLocked
              ]}>
                <View style={styles.sportsAchievementIcon}>
                  <Text style={[
                    styles.sportsAchievementEmoji,
                    !achievement.unlocked && styles.sportsAchievementEmojiLocked
                  ]}>
                    {achievement.unlocked ? achievement.icon : '🔒'}
                  </Text>
                </View>
                <View style={styles.sportsAchievementContent}>
                  <Text style={[
                    styles.sportsAchievementTitle,
                    !achievement.unlocked && styles.sportsAchievementTitleLocked
                  ]}>
                    {achievement.title}
                  </Text>
                  <Text style={[
                    styles.sportsAchievementDescription,
                    !achievement.unlocked && styles.sportsAchievementDescriptionLocked
                  ]}>
                    {achievement.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>
      </View>
    </View>
  );
  };

  // Modales para alimentación
  const renderAddMealModal = () => (
    <Modal
      visible={showAddMealModal}
      transparent={true}
      animationType="fade"
      onRequestClose={closeAddMealModal}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Planificar Comidas</Text>
            <TouchableOpacity onPress={closeAddMealModal} style={styles.closeButton}>
              <Icon name="close" size={24} color="#4A6741" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Fecha:</Text>
              <TouchableOpacity 
                style={styles.dateButton}
                onPress={() => setShowMealDatePicker(true)}
              >
                <Text style={styles.dateButtonText}>
                  {selectedMealDate.toLocaleDateString('es-ES')}
                </Text>
                <Icon name="calendar-outline" size={20} color="#4A7C59" />
              </TouchableOpacity>
              {showMealDatePicker && (
                <DateTimePicker
                  value={selectedMealDate}
                  mode="date"
                  display="default"
                  onChange={(event, date) => {
                    setShowMealDatePicker(false);
                    if (date) setSelectedMealDate(date);
                  }}
                />
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Desayuno:</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={newMealPlan.breakfast}
                onChangeText={(text) => setNewMealPlan({...newMealPlan, breakfast: text})}
                placeholder="¿Qué desayunarás?"
                multiline
                numberOfLines={2}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Comida:</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={newMealPlan.lunch}
                onChangeText={(text) => setNewMealPlan({...newMealPlan, lunch: text})}
                placeholder="¿Qué comerás?"
                multiline
                numberOfLines={2}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Cena:</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={newMealPlan.dinner}
                onChangeText={(text) => setNewMealPlan({...newMealPlan, dinner: text})}
                placeholder="¿Qué cenarás?"
                multiline
                numberOfLines={2}
                textAlignVertical="top"
              />
            </View>
          </ScrollView>

          <View style={styles.modalActions}>
            <TouchableOpacity 
              onPress={closeAddMealModal} 
              style={styles.cancelButton}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={addMealPlan} 
              style={styles.saveButton}
            >
              <Text style={styles.saveButtonText}>Guardar Plan</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderAddRecipeModal = () => (
    <Modal
      visible={showAddRecipeModal}
      transparent={true}
      animationType="fade"
      onRequestClose={closeAddRecipeModal}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Nueva Receta</Text>
            <TouchableOpacity onPress={closeAddRecipeModal} style={styles.closeButton}>
              <Icon name="close" size={24} color="#4A6741" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nombre de la Receta:</Text>
              <TextInput
                style={styles.textInput}
                value={newRecipe.name}
                onChangeText={(text) => setNewRecipe({...newRecipe, name: text})}
                placeholder="Ej: Pasta con Pollo"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Ingredientes:</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={newRecipe.ingredients}
                onChangeText={(text) => setNewRecipe({...newRecipe, ingredients: text})}
                placeholder="Lista los ingredientes necesarios..."
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Instrucciones:</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={newRecipe.instructions}
                onChangeText={(text) => setNewRecipe({...newRecipe, instructions: text})}
                placeholder="Describe los pasos para preparar la receta..."
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </View>
          </ScrollView>

          <View style={styles.modalActions}>
            <TouchableOpacity 
              onPress={closeAddRecipeModal} 
              style={styles.cancelButton}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={addRecipe} 
              style={[styles.saveButton, !newRecipe.name.trim() && styles.saveButtonDisabled]}
              disabled={!newRecipe.name.trim()}
            >
              <Text style={styles.saveButtonText}>Guardar Receta</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderAddItemModal = () => (
    <Modal
      visible={showAddItemModal}
      transparent={true}
      animationType="fade"
      onRequestClose={closeAddItemModal}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              Agregar a {mealCategories.find(cat => cat.id === selectedCategory)?.name}
            </Text>
            <TouchableOpacity onPress={closeAddItemModal} style={styles.closeButton}>
              <Icon name="close" size={24} color="#4A6741" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Ingresa el artículo:</Text>
              <TextInput
                style={styles.textInput}
                value={newItemText}
                onChangeText={setNewItemText}
                placeholder="Ej: Manzanas, Leche, Pan..."
                autoFocus={true}
                returnKeyType="done"
                onSubmitEditing={addItem}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Cantidad:</Text>
              <View style={styles.quantityContainer}>
                <TouchableOpacity 
                  style={styles.quantityButton}
                  onPress={decrementQuantity}
                  disabled={newItemQuantity <= 1}
                >
                  <Icon name="remove" size={20} color={newItemQuantity <= 1 ? "#ccc" : "#4A7C59"} />
                </TouchableOpacity>
                
                <View style={styles.quantityDisplay}>
                  <Text style={styles.quantityText}>{newItemQuantity}</Text>
                </View>
                
                <TouchableOpacity 
                  style={styles.quantityButton}
                  onPress={incrementQuantity}
                >
                  <Icon name="add" size={20} color="#4A7C59" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Unidad:</Text>
              <View style={styles.unitSelector}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.unitScroll}>
                  {quantityUnits.map((unit) => (
                    <TouchableOpacity
                      key={unit}
                      style={[
                        styles.unitButton,
                        newItemUnit === unit && styles.unitButtonSelected
                      ]}
                      onPress={() => setNewItemUnit(unit)}
                    >
                      <Text style={[
                        styles.unitButtonText,
                        newItemUnit === unit && styles.unitButtonTextSelected
                      ]}>
                        {unit}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalActions}>
            <TouchableOpacity 
              onPress={closeAddItemModal} 
              style={styles.cancelButton}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={addItem} 
              style={[styles.saveButton, !newItemText.trim() && styles.saveButtonDisabled]}
              disabled={!newItemText.trim()}
            >
              <Text style={styles.saveButtonText}>Agregar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  // Modales para ejercicio
  const renderAddGymModal = () => (
    <Modal
      visible={showAddGymModal}
      transparent={true}
      animationType="fade"
      onRequestClose={closeAddGymModal}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Nueva Rutina de Gimnasio</Text>
            <TouchableOpacity onPress={closeAddGymModal} style={styles.closeButton}>
              <Icon name="close" size={24} color="#4A6741" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nombre de la Rutina:</Text>
              <TextInput
                style={styles.textInput}
                value={newRoutine.name}
                onChangeText={(text) => setNewRoutine({...newRoutine, name: text})}
                placeholder="Ej: Rutina de Fuerza"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Descripción:</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={newRoutine.description}
                onChangeText={(text) => setNewRoutine({...newRoutine, description: text})}
                placeholder="Describe el objetivo de esta rutina..."
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Duración:</Text>
              <TextInput
                style={styles.textInput}
                value={newRoutine.duration}
                onChangeText={(text) => setNewRoutine({...newRoutine, duration: text})}
                placeholder="Ej: 45 minutos"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Horario de Entrenamiento:</Text>
              <TextInput
                style={styles.textInput}
                value={newRoutine.schedule.time}
                onChangeText={(text) => setNewRoutine({
                  ...newRoutine, 
                  schedule: {...newRoutine.schedule, time: text}
                })}
                placeholder="Ej: 08:00"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Días de la Semana:</Text>
              <View style={styles.daysSelector}>
                {weekDays.map((day) => (
                  <TouchableOpacity
                    key={day}
                    style={[
                      styles.dayButton,
                      newRoutine.schedule.days.includes(day) && styles.dayButtonSelected
                    ]}
                    onPress={() => toggleDay(day)}
                  >
                    <Text style={[
                      styles.dayButtonText,
                      newRoutine.schedule.days.includes(day) && styles.dayButtonTextSelected
                    ]}>
                      {day}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Frecuencia:</Text>
              <View style={styles.frequencySelector}>
                {frequencyOptions.map((frequency) => (
                  <TouchableOpacity
                    key={frequency}
                    style={[
                      styles.frequencyOption,
                      newRoutine.schedule.frequency === frequency && styles.frequencyOptionSelected
                    ]}
                    onPress={() => setNewRoutine({
                      ...newRoutine, 
                      schedule: {...newRoutine.schedule, frequency: frequency}
                    })}
                  >
                    <Text style={[
                      styles.frequencyOptionText,
                      newRoutine.schedule.frequency === frequency && styles.frequencyOptionTextSelected
                    ]}>
                      {frequency}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nivel de Dificultad:</Text>
              <View style={styles.difficultySelector}>
                {difficultyLevels.map((level) => (
                  <TouchableOpacity
                    key={level}
                    style={[
                      styles.difficultyOption,
                      newRoutine.difficulty === level && styles.difficultyOptionSelected
                    ]}
                    onPress={() => setNewRoutine({...newRoutine, difficulty: level})}
                  >
                    <Text style={[
                      styles.difficultyOptionText,
                      newRoutine.difficulty === level && styles.difficultyOptionTextSelected
                    ]}>
                      {level}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Ejercicios:</Text>
              {newRoutine.exercises.map((exercise, index) => (
                <View key={index} style={styles.exerciseInput}>
                  <Text style={styles.exerciseNumber}>Ejercicio {index + 1}:</Text>
                  <TextInput
                    style={styles.textInput}
                    value={exercise.name}
                    onChangeText={(text) => {
                      const updatedExercises = [...newRoutine.exercises];
                      updatedExercises[index] = {...exercise, name: text};
                      setNewRoutine({...newRoutine, exercises: updatedExercises});
                    }}
                    placeholder="Nombre del ejercicio"
                  />
                  <View style={styles.exerciseDetails}>
                    <TextInput
                      style={[styles.textInput, styles.exerciseDetailInput]}
                      value={exercise.sets}
                      onChangeText={(text) => {
                        const updatedExercises = [...newRoutine.exercises];
                        updatedExercises[index] = {...exercise, sets: text};
                        setNewRoutine({...newRoutine, exercises: updatedExercises});
                      }}
                      placeholder="Series"
                      keyboardType="numeric"
                    />
                    <TextInput
                      style={[styles.textInput, styles.exerciseDetailInput]}
                      value={exercise.reps}
                      onChangeText={(text) => {
                        const updatedExercises = [...newRoutine.exercises];
                        updatedExercises[index] = {...exercise, reps: text};
                        setNewRoutine({...newRoutine, exercises: updatedExercises});
                      }}
                      placeholder="Reps"
                      keyboardType="numeric"
                    />
                    <TextInput
                      style={[styles.textInput, styles.exerciseDetailInput]}
                      value={exercise.weight}
                      onChangeText={(text) => {
                        const updatedExercises = [...newRoutine.exercises];
                        updatedExercises[index] = {...exercise, weight: text};
                        setNewRoutine({...newRoutine, exercises: updatedExercises});
                      }}
                      placeholder="Peso (kg)"
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              ))}
              
              <TouchableOpacity
                style={styles.addExerciseButton}
                onPress={() => setNewRoutine({
                  ...newRoutine,
                  exercises: [...newRoutine.exercises, {name: '', sets: '', reps: '', weight: '', rest: ''}]
                })}
              >
                <Icon name="add" size={16} color="#4A7C59" />
                <Text style={styles.addExerciseText}>Agregar Ejercicio</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          <View style={styles.modalActions}>
            <TouchableOpacity 
              onPress={closeAddGymModal} 
              style={styles.cancelButton}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={addGymRoutine} 
              style={styles.saveButton}
            >
              <Text style={styles.saveButtonText}>Guardar Rutina</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderAddSportsModal = () => (
    <Modal
      visible={showAddSportsModal}
      transparent={true}
      animationType="fade"
      onRequestClose={closeAddSportsModal}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Nuevo Objetivo Deportivo</Text>
            <TouchableOpacity onPress={closeAddSportsModal} style={styles.closeButton}>
              <Icon name="close" size={24} color="#4A6741" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Deporte:</Text>
              <View style={styles.sportsSelector}>
                {sports.map((sport) => (
                  <TouchableOpacity
                    key={sport}
                    style={[
                      styles.sportOption,
                      newGoal.sport === sport && styles.sportOptionSelected
                    ]}
                    onPress={() => setNewGoal({...newGoal, sport})}
                  >
                    <Text style={[
                      styles.sportOptionText,
                      newGoal.sport === sport && styles.sportOptionTextSelected
                    ]}>
                      {sport}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Objetivo:</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={newGoal.objective}
                onChangeText={(text) => setNewGoal({...newGoal, objective: text})}
                placeholder="Describe tu objetivo específico..."
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Fecha Objetivo:</Text>
              <TouchableOpacity 
                style={styles.dateButton}
                onPress={() => setShowGoalDatePicker(true)}
              >
                <Text style={styles.dateButtonText}>
                  {newGoal.targetDate.toLocaleDateString('es-ES')}
                </Text>
                <Icon name="calendar-outline" size={20} color="#4A7C59" />
              </TouchableOpacity>
              {showGoalDatePicker && (
                <DateTimePicker
                  value={newGoal.targetDate}
                  mode="date"
                  display="default"
                  onChange={(event, date) => {
                    setShowGoalDatePicker(false);
                    if (date) setNewGoal({...newGoal, targetDate: date});
                  }}
                />
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Progreso Actual:</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={newGoal.currentProgress}
                onChangeText={(text) => setNewGoal({...newGoal, currentProgress: text})}
                placeholder="Describe tu progreso actual..."
                multiline
                numberOfLines={2}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Notas:</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={newGoal.notes}
                onChangeText={(text) => setNewGoal({...newGoal, notes: text})}
                placeholder="Notas adicionales..."
                multiline
                numberOfLines={2}
                textAlignVertical="top"
              />
            </View>
          </ScrollView>

          <View style={styles.modalActions}>
            <TouchableOpacity 
              onPress={closeAddSportsModal} 
              style={styles.cancelButton}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={addSportsGoal} 
              style={styles.saveButton}
            >
              <Text style={styles.saveButtonText}>Guardar Objetivo</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  // Función para renderizar Seguimiento de Fitness
  const renderFitnessTracker = () => {
    const sampleFitnessData = {
      weeklyStats: {
        totalSteps: 45620,
        totalCaloriesBurned: 2840,
        totalWorkouts: 5,
        averageHeartRate: 142
      },
      dailyGoals: {
        steps: 10000,
        calories: 500,
        water: 8,
        workouts: 1
      },
      weeklyProgress: [
        { day: 'Lun', steps: 8500, calories: 420, water: 6, workout: true },
        { day: 'Mar', steps: 12000, calories: 580, water: 8, workout: true },
        { day: 'Mié', steps: 6800, calories: 320, water: 5, workout: false },
        { day: 'Jue', steps: 15000, calories: 720, water: 9, workout: true },
        { day: 'Vie', steps: 9200, calories: 450, water: 7, workout: true },
        { day: 'Sáb', steps: 11000, calories: 520, water: 8, workout: false },
        { day: 'Dom', steps: 7500, calories: 380, water: 6, workout: true }
      ],
      achievements: [
        { id: 1, title: 'Primera Semana', description: 'Completaste tu primera semana de seguimiento', icon: '🏆', unlocked: true },
        { id: 2, title: 'Meta de Pasos', description: 'Superaste los 10,000 pasos diarios', icon: '👟', unlocked: true },
        { id: 3, title: 'Consistencia', description: '5 días consecutivos de ejercicio', icon: '💪', unlocked: false },
        { id: 4, title: 'Hidratación', description: '8 vasos de agua por 7 días', icon: '💧', unlocked: false }
      ]
    };

    const getCurrentDayProgress = () => {
      const today = new Date().getDay();
      const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
      return sampleFitnessData.weeklyProgress.find(day => day.day === dayNames[today]) || sampleFitnessData.weeklyProgress[0];
    };

    const getProgressPercentage = (current, goal) => {
      return Math.min((current / goal) * 100, 100);
    };

    const getUnlockedAchievements = () => {
      return sampleFitnessData.achievements.filter(achievement => achievement.unlocked).length;
    };

    return (
      <View style={styles.section}>
        {/* Header mejorado */}
        <View style={styles.fitnessHeader}>
          <View style={styles.fitnessHeaderContent}>
            <View style={styles.fitnessIconContainer}>
              <Icon name="fitness-outline" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.fitnessHeaderText}>
              <Text style={styles.fitnessHeaderTitle}>
                Seguimiento de Fitness
              </Text>
              <Text style={styles.fitnessHeaderSubtitle}>
                Monitorea tu actividad física diaria
              </Text>
            </View>
          </View>
          <View style={styles.fitnessHeaderBadge}>
            <Icon name="pulse-outline" size={16} color="#059669" />
          </View>
        </View>
        
        {/* Resumen semanal mejorado */}
        <View style={styles.fitnessSummary}>
          <View style={styles.fitnessSummaryCard}>
            <View style={styles.fitnessSummaryIconContainer}>
              <Icon name="walk-outline" size={20} color="#059669" />
            </View>
            <View style={styles.fitnessSummaryContent}>
              <Text style={styles.fitnessSummaryValue}>{sampleFitnessData.weeklyStats.totalSteps.toLocaleString()}</Text>
              <Text style={styles.fitnessSummaryLabel}>Pasos Totales</Text>
            </View>
          </View>
          <View style={styles.fitnessSummaryCard}>
            <View style={styles.fitnessSummaryIconContainer}>
              <Icon name="flame-outline" size={20} color="#EF4444" />
            </View>
            <View style={styles.fitnessSummaryContent}>
              <Text style={styles.fitnessSummaryValue}>{sampleFitnessData.weeklyStats.totalCaloriesBurned}</Text>
              <Text style={styles.fitnessSummaryLabel}>Calorías Quemadas</Text>
            </View>
          </View>
          <View style={styles.fitnessSummaryCard}>
            <View style={styles.fitnessSummaryIconContainer}>
              <Icon name="barbell-outline" size={20} color="#F59E0B" />
            </View>
            <View style={styles.fitnessSummaryContent}>
              <Text style={styles.fitnessSummaryValue}>{sampleFitnessData.weeklyStats.totalWorkouts}</Text>
              <Text style={styles.fitnessSummaryLabel}>Entrenamientos</Text>
            </View>
          </View>
          <View style={styles.fitnessSummaryCard}>
            <View style={styles.fitnessSummaryIconContainer}>
              <Icon name="heart-outline" size={20} color="#EC4899" />
            </View>
            <View style={styles.fitnessSummaryContent}>
              <Text style={styles.fitnessSummaryValue}>{sampleFitnessData.weeklyStats.averageHeartRate}</Text>
              <Text style={styles.fitnessSummaryLabel}>Ritmo Cardíaco</Text>
            </View>
          </View>
        </View>
        
        {/* Botón para agregar actividad */}
        <View style={styles.addActivityContainer}>
          <TouchableOpacity 
            style={styles.addActivityButton}
            onPress={() => setShowFitnessDatePicker(true)}
          >
            <Icon name="add-circle-outline" size={20} color="#FFFFFF" />
            <Text style={styles.addActivityText}>Registrar Actividad</Text>
          </TouchableOpacity>
        </View>
        
        {/* Progreso del día actual */}
        <View style={styles.todayProgressContainer}>
          <View style={styles.todayProgressHeader}>
            <View style={styles.todayProgressTitleContainer}>
              <Icon name="today-outline" size={20} color="#059669" />
              <Text style={styles.todayProgressTitle}>Progreso de Hoy</Text>
            </View>
            <Text style={styles.todayProgressDate}>
              {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
            </Text>
          </View>
          
          <View style={styles.todayProgressGrid}>
            <View style={styles.progressCard}>
              <View style={styles.progressCardHeader}>
                <Icon name="walk-outline" size={16} color="#059669" />
                <Text style={styles.progressCardTitle}>Pasos</Text>
              </View>
              <Text style={styles.progressCardValue}>{getCurrentDayProgress().steps.toLocaleString()}</Text>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressBarFill,
                    { 
                      width: `${getProgressPercentage(getCurrentDayProgress().steps, sampleFitnessData.dailyGoals.steps)}%`,
                      backgroundColor: '#059669'
                    }
                  ]}
                />
              </View>
              <Text style={styles.progressCardGoal}>Meta: {sampleFitnessData.dailyGoals.steps.toLocaleString()}</Text>
            </View>
            
            <View style={styles.progressCard}>
              <View style={styles.progressCardHeader}>
                <Icon name="flame-outline" size={16} color="#EF4444" />
                <Text style={styles.progressCardTitle}>Calorías</Text>
              </View>
              <Text style={styles.progressCardValue}>{getCurrentDayProgress().calories}</Text>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressBarFill,
                    { 
                      width: `${getProgressPercentage(getCurrentDayProgress().calories, sampleFitnessData.dailyGoals.calories)}%`,
                      backgroundColor: '#EF4444'
                    }
                  ]}
                />
              </View>
              <Text style={styles.progressCardGoal}>Meta: {sampleFitnessData.dailyGoals.calories}</Text>
            </View>
            
            <View style={styles.progressCard}>
              <View style={styles.progressCardHeader}>
                <Icon name="water-outline" size={16} color="#0EA5E9" />
                <Text style={styles.progressCardTitle}>Agua</Text>
              </View>
              <Text style={styles.progressCardValue}>{getCurrentDayProgress().water} vasos</Text>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressBarFill,
                    { 
                      width: `${getProgressPercentage(getCurrentDayProgress().water, sampleFitnessData.dailyGoals.water)}%`,
                      backgroundColor: '#0EA5E9'
                    }
                  ]}
                />
              </View>
              <Text style={styles.progressCardGoal}>Meta: {sampleFitnessData.dailyGoals.water} vasos</Text>
            </View>
            
            <View style={styles.progressCard}>
              <View style={styles.progressCardHeader}>
                <Icon name="barbell-outline" size={16} color="#F59E0B" />
                <Text style={styles.progressCardTitle}>Ejercicio</Text>
              </View>
              <Text style={styles.progressCardValue}>{getCurrentDayProgress().workout ? 'Completado' : 'Pendiente'}</Text>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressBarFill,
                    { 
                      width: getCurrentDayProgress().workout ? '100%' : '0%',
                      backgroundColor: '#F59E0B'
                    }
                  ]}
                />
              </View>
              <Text style={styles.progressCardGoal}>Meta: {sampleFitnessData.dailyGoals.workouts} sesión</Text>
            </View>
          </View>
        </View>
        
        {/* Progreso semanal */}
        <View style={styles.weeklyProgressContainer}>
          <View style={styles.weeklyProgressHeader}>
            <Text style={styles.weeklyProgressTitle}>Progreso Semanal</Text>
            <TouchableOpacity style={styles.viewStatsButton}>
              <Icon name="analytics-outline" size={16} color="#059669" />
              <Text style={styles.viewStatsText}>Ver Estadísticas</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.weeklyProgressGrid}>
            {sampleFitnessData.weeklyProgress.map((day, index) => (
              <View key={index} style={styles.dayProgressCard}>
                <Text style={styles.dayProgressLabel}>{day.day}</Text>
                <View style={styles.dayProgressIndicators}>
                  <View style={[
                    styles.dayProgressIndicator,
                    { backgroundColor: day.steps >= sampleFitnessData.dailyGoals.steps ? '#059669' : '#E5E7EB' }
                  ]} />
                  <View style={[
                    styles.dayProgressIndicator,
                    { backgroundColor: day.calories >= sampleFitnessData.dailyGoals.calories ? '#EF4444' : '#E5E7EB' }
                  ]} />
                  <View style={[
                    styles.dayProgressIndicator,
                    { backgroundColor: day.water >= sampleFitnessData.dailyGoals.water ? '#0EA5E9' : '#E5E7EB' }
                  ]} />
                  <View style={[
                    styles.dayProgressIndicator,
                    { backgroundColor: day.workout ? '#F59E0B' : '#E5E7EB' }
                  ]} />
                </View>
                <Text style={styles.dayProgressSteps}>{day.steps.toLocaleString()}</Text>
              </View>
            ))}
          </View>
        </View>
        
        {/* Logros */}
        <View style={styles.achievementsContainer}>
          <View style={styles.achievementsHeader}>
            <Text style={styles.achievementsTitle}>Logros</Text>
            <Text style={styles.achievementsSubtitle}>
              {getUnlockedAchievements()}/{sampleFitnessData.achievements.length} desbloqueados
            </Text>
          </View>
          
          <View style={styles.achievementsGrid}>
            {sampleFitnessData.achievements.map((achievement) => (
              <View key={achievement.id} style={[
                styles.achievementCard,
                !achievement.unlocked && styles.achievementCardLocked
              ]}>
                <View style={styles.achievementIcon}>
                  <Text style={[
                    styles.achievementEmoji,
                    !achievement.unlocked && styles.achievementEmojiLocked
                  ]}>
                    {achievement.unlocked ? achievement.icon : '🔒'}
                  </Text>
                </View>
                <View style={styles.achievementContent}>
                  <Text style={[
                    styles.achievementTitle,
                    !achievement.unlocked && styles.achievementTitleLocked
                  ]}>
                    {achievement.title}
                  </Text>
                  <Text style={[
                    styles.achievementDescription,
                    !achievement.unlocked && styles.achievementDescriptionLocked
                  ]}>
                    {achievement.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  };

  // Función para renderizar Medidas Corporales
  const renderBodyMeasurements = () => {
    const sampleBodyData = {
      weeklyStats: {
        totalMeasurements: Object.keys(bodyMeasurements).length,
        weightChange: -1.2,
        waistChange: -3.0,
        muscleGain: 0.8
      },
      currentMeasurements: {
        weight: newMeasurements.weight || '--',
        waist: newMeasurements.waist || '--',
        chest: newMeasurements.chest || '--',
        bicep: newMeasurements.bicep || '--'
      },
      goals: {
        weight: 70,
        waist: 75,
        chest: 100,
        bicep: 35
      },
      achievements: [
        { id: 1, title: 'Primera Medición', description: 'Registraste tu primera medida corporal', icon: '📏', unlocked: Object.keys(bodyMeasurements).length > 0 },
        { id: 2, title: 'Consistencia', description: '5 mediciones en una semana', icon: '📅', unlocked: Object.keys(bodyMeasurements).length >= 5 },
        { id: 3, title: 'Meta de Peso', description: 'Alcanzaste tu peso objetivo', icon: '⚖️', unlocked: false },
        { id: 4, title: 'Progreso Constante', description: 'Mejora en 3 medidas consecutivas', icon: '📈', unlocked: false }
      ]
    };

    const getUnlockedAchievements = () => {
      return sampleBodyData.achievements.filter(achievement => achievement.unlocked).length;
    };

    const getProgressPercentage = (current, goal) => {
      if (!current || current === '--') return 0;
      const currentNum = parseFloat(current);
      const goalNum = parseFloat(goal);
      return Math.min((currentNum / goalNum) * 100, 100);
    };

    return (
    <View style={styles.section}>
        {/* Header estilo fitness */}
        <View style={styles.bodyMeasurementsHeader}>
          <View style={styles.bodyMeasurementsHeaderContent}>
            <View style={styles.bodyMeasurementsIconContainer}>
              <Icon name="body-outline" size={24} color="#FFFFFF" />
        </View>
            <View style={styles.bodyMeasurementsHeaderText}>
              <Text style={styles.bodyMeasurementsHeaderTitle}>
                Medidas Corporales
              </Text>
              <Text style={styles.bodyMeasurementsHeaderSubtitle}>
                Monitorea tu progreso físico
          </Text>
        </View>
          </View>
          <View style={styles.bodyMeasurementsHeaderBadge}>
            <Icon name="resize-outline" size={16} color="#059669" />
          </View>
        </View>

        {/* Resumen de estadísticas */}
        <View style={styles.bodyMeasurementsSummary}>
          <View style={styles.bodyMeasurementsSummaryCard}>
            <View style={styles.bodyMeasurementsSummaryIconContainer}>
              <Icon name="analytics-outline" size={20} color="#059669" />
            </View>
            <View style={styles.bodyMeasurementsSummaryContent}>
              <Text style={styles.bodyMeasurementsSummaryValue}>{sampleBodyData.weeklyStats.totalMeasurements}</Text>
              <Text style={styles.bodyMeasurementsSummaryLabel}>Mediciones</Text>
            </View>
          </View>
          <View style={styles.bodyMeasurementsSummaryCard}>
            <View style={styles.bodyMeasurementsSummaryIconContainer}>
              <Icon name="trending-down-outline" size={20} color="#EF4444" />
            </View>
            <View style={styles.bodyMeasurementsSummaryContent}>
              <Text style={styles.bodyMeasurementsSummaryValue}>{sampleBodyData.weeklyStats.weightChange}kg</Text>
              <Text style={styles.bodyMeasurementsSummaryLabel}>Cambio Peso</Text>
            </View>
          </View>
          <View style={styles.bodyMeasurementsSummaryCard}>
            <View style={styles.bodyMeasurementsSummaryIconContainer}>
              <Icon name="remove-outline" size={20} color="#F59E0B" />
            </View>
            <View style={styles.bodyMeasurementsSummaryContent}>
              <Text style={styles.bodyMeasurementsSummaryValue}>{sampleBodyData.weeklyStats.waistChange}cm</Text>
              <Text style={styles.bodyMeasurementsSummaryLabel}>Cintura</Text>
            </View>
          </View>
          <View style={styles.bodyMeasurementsSummaryCard}>
            <View style={styles.bodyMeasurementsSummaryIconContainer}>
              <Icon name="fitness-outline" size={20} color="#EC4899" />
            </View>
            <View style={styles.bodyMeasurementsSummaryContent}>
              <Text style={styles.bodyMeasurementsSummaryValue}>+{sampleBodyData.weeklyStats.muscleGain}cm</Text>
              <Text style={styles.bodyMeasurementsSummaryLabel}>Músculo</Text>
            </View>
          </View>
        </View>

        {/* Selector de fecha mejorado */}
        <View style={styles.dateSelectorContainer}>
        <TouchableOpacity 
            style={styles.dateSelector}
          onPress={() => setShowMeasurementDatePicker(true)}
        >
            <Icon name="calendar-outline" size={20} color="#059669" />
            <Text style={styles.dateSelectorText}>
              {selectedMeasurementDate ? 
                selectedMeasurementDate.toLocaleDateString('es-ES') : 
                'Seleccionar fecha'
              }
            </Text>
            <Icon name="chevron-down" size={16} color="#059669" />
        </TouchableOpacity>
      </View>

        {/* Grid de medidas principal */}
      <View style={styles.measurementsContainer}>
        <View style={styles.measurementsGrid}>
            {measurementTypes.slice(0, 4).map((measurement) => (
              <View key={measurement.id} style={styles.measurementCard}>
                <View style={styles.measurementCardHeader}>
                  <Icon 
                    name={getMeasurementIcon(measurement.id)} 
                    size={20} 
                    color="#059669" 
                  />
                  <Text style={styles.measurementCardTitle}>{measurement.name}</Text>
                </View>
                <View style={styles.measurementInputContainer}>
              <TextInput 
                style={styles.measurementInput}
                    placeholder="0"
                keyboardType="numeric"
                    placeholderTextColor="#A0A0A0"
                    value={newMeasurements[measurement.id] || ''}
                    onChangeText={(value) => handleMeasurementChange(measurement.id, value)}
                  />
                  <Text style={styles.measurementUnit}>{measurement.unit}</Text>
                </View>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressBarFill,
                      { 
                        width: `${getProgressPercentage(newMeasurements[measurement.id], sampleBodyData.goals[measurement.id] || 100)}%`,
                        backgroundColor: '#059669'
                      }
                    ]}
                  />
                </View>
                <Text style={styles.measurementGoal}>
                  Meta: {sampleBodyData.goals[measurement.id] || '--'}{measurement.unit}
                </Text>
            </View>
          ))}
        </View>

          {/* Medidas adicionales */}
          <View style={styles.additionalMeasurementsContainer}>
            <Text style={styles.additionalMeasurementsTitle}>Medidas Adicionales</Text>
            <View style={styles.additionalMeasurementsGrid}>
              {measurementTypes.slice(4).map((measurement) => (
                <View key={measurement.id} style={styles.additionalMeasurementCard}>
                  <View style={styles.additionalMeasurementHeader}>
                    <Icon 
                      name={getMeasurementIcon(measurement.id)} 
                      size={16} 
                      color="#6B7280" 
                    />
                    <Text style={styles.additionalMeasurementTitle}>{measurement.name}</Text>
                  </View>
                  <View style={styles.additionalMeasurementInput}>
                    <TextInput 
                      style={styles.additionalMeasurementTextInput}
                      placeholder="0"
                      keyboardType="numeric"
                      placeholderTextColor="#A0A0A0"
                      value={newMeasurements[measurement.id] || ''}
                      onChangeText={(value) => handleMeasurementChange(measurement.id, value)}
                    />
                    <Text style={styles.additionalMeasurementUnit}>{measurement.unit}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Botones de acción mejorados */}
          <View style={styles.measurementActions}>
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={handleSaveMeasurements}
            >
              <Icon name="save-outline" size={20} color="#ffffff" />
              <Text style={styles.saveButtonText}>Guardar Medidas</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.historyButton}
              onPress={handleShowHistory}
            >
              <Icon name="bar-chart-outline" size={20} color="#059669" />
              <Text style={styles.historyButtonText}>Ver Historial</Text>
            </TouchableOpacity>
          </View>

          {/* Notas mejoradas */}
        <View style={styles.measurementNotes}>
            <View style={styles.notesHeader}>
              <Icon name="document-text-outline" size={20} color="#059669" />
              <Text style={styles.notesTitle}>Notas del Día</Text>
            </View>
          <TextInput 
            style={styles.notesInput} 
              placeholder="¿Cómo te sientes hoy? ¿Algún cambio notable?"
            multiline
              placeholderTextColor="#A0A0A0"
              value={newMeasurements.notes || ''}
              onChangeText={(value) => handleMeasurementChange('notes', value)}
          />
        </View>

          {/* Sistema de logros */}
          <View style={styles.achievementsContainer}>
            <View style={styles.achievementsHeader}>
              <Text style={styles.achievementsTitle}>Logros Corporales</Text>
              <Text style={styles.achievementsSubtitle}>
                {getUnlockedAchievements()}/{sampleBodyData.achievements.length} desbloqueados
              </Text>
            </View>
            
            <View style={styles.achievementsGrid}>
              {sampleBodyData.achievements.map((achievement) => (
                <View key={achievement.id} style={[
                  styles.achievementCard,
                  !achievement.unlocked && styles.achievementCardLocked
                ]}>
                  <View style={styles.achievementIcon}>
                    <Text style={[
                      styles.achievementEmoji,
                      !achievement.unlocked && styles.achievementEmojiLocked
                    ]}>
                      {achievement.unlocked ? achievement.icon : '🔒'}
                    </Text>
                  </View>
                  <View style={styles.achievementContent}>
                    <Text style={[
                      styles.achievementTitle,
                      !achievement.unlocked && styles.achievementTitleLocked
                    ]}>
                      {achievement.title}
                    </Text>
                    <Text style={[
                      styles.achievementDescription,
                      !achievement.unlocked && styles.achievementDescriptionLocked
                    ]}>
                      {achievement.description}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
      </View>
    </View>
  );
  };

  // Función para renderizar Seguimiento de Entrenamientos
  const renderWorkoutTracker = () => {
    const sampleWorkoutData = {
      weeklyStats: {
        totalWorkouts: 5,
        totalDuration: 420, // minutos
        totalCalories: 2840,
        averageIntensity: 7.5
      },
      currentWeek: {
        monday: { workout: 'Cardio HIIT', duration: 45, calories: 520, completed: true },
        tuesday: { workout: 'Fuerza Superior', duration: 60, calories: 480, completed: true },
        wednesday: { workout: 'Descanso', duration: 0, calories: 0, completed: true },
        thursday: { workout: 'Cardio LISS', duration: 30, calories: 300, completed: true },
        friday: { workout: 'Fuerza Inferior', duration: 55, calories: 450, completed: true },
        saturday: { workout: 'Yoga', duration: 40, calories: 200, completed: false },
        sunday: { workout: 'Caminata', duration: 0, calories: 0, completed: false }
      },
      goals: [
        { id: 1, title: 'Entrenar 5 días por semana', progress: 5, target: 5, completed: true },
        { id: 2, title: 'Quemar 3000 calorías', progress: 2840, target: 3000, completed: false },
        { id: 3, title: 'Completar 10 horas de ejercicio', progress: 7, target: 10, completed: false }
      ],
      achievements: [
        { id: 1, title: 'Primera Semana', description: 'Completaste tu primera semana de entrenamiento', icon: '🏋️', unlocked: true },
        { id: 2, title: 'Consistencia', description: '5 entrenamientos en una semana', icon: '💪', unlocked: true },
        { id: 3, title: 'Quemador de Calorías', description: 'Quemaste 2500+ calorías en una semana', icon: '🔥', unlocked: true },
        { id: 4, title: 'Maratón', description: '10 horas de ejercicio en un mes', icon: '🏃', unlocked: false }
      ]
    };

    const getUnlockedAchievements = () => {
      return sampleWorkoutData.achievements.filter(achievement => achievement.unlocked).length;
    };

    const getProgressPercentage = (current, target) => {
      return Math.min((current / target) * 100, 100);
    };

    const getWeekDays = () => {
      return Object.entries(sampleWorkoutData.currentWeek).map(([day, data]) => ({
        day: day.charAt(0).toUpperCase() + day.slice(1),
        ...data
      }));
    };

    return (
    <View style={styles.section}>
        {/* Header estilo fitness */}
        <View style={styles.workoutTrackerHeader}>
          <View style={styles.workoutTrackerHeaderContent}>
            <View style={styles.workoutTrackerIconContainer}>
              <Icon name="barbell-outline" size={24} color="#FFFFFF" />
        </View>
            <View style={styles.workoutTrackerHeaderText}>
              <Text style={styles.workoutTrackerHeaderTitle}>
                Seguimiento de Entrenamientos
              </Text>
              <Text style={styles.workoutTrackerHeaderSubtitle}>
                Monitorea tu progreso de fitness
          </Text>
        </View>
          </View>
          <View style={styles.workoutTrackerHeaderBadge}>
            <Icon name="fitness-outline" size={16} color="#059669" />
          </View>
        </View>

        {/* Resumen de estadísticas */}
        <View style={styles.workoutTrackerSummary}>
          <View style={styles.workoutTrackerSummaryCard}>
            <View style={styles.workoutTrackerSummaryIconContainer}>
              <Icon name="barbell-outline" size={20} color="#059669" />
            </View>
            <View style={styles.workoutTrackerSummaryContent}>
              <Text style={styles.workoutTrackerSummaryValue}>{sampleWorkoutData.weeklyStats.totalWorkouts}</Text>
              <Text style={styles.workoutTrackerSummaryLabel}>Entrenamientos</Text>
            </View>
          </View>
          <View style={styles.workoutTrackerSummaryCard}>
            <View style={styles.workoutTrackerSummaryIconContainer}>
              <Icon name="time-outline" size={20} color="#EF4444" />
            </View>
            <View style={styles.workoutTrackerSummaryContent}>
              <Text style={styles.workoutTrackerSummaryValue}>{sampleWorkoutData.weeklyStats.totalDuration}m</Text>
              <Text style={styles.workoutTrackerSummaryLabel}>Duración</Text>
            </View>
          </View>
          <View style={styles.workoutTrackerSummaryCard}>
            <View style={styles.workoutTrackerSummaryIconContainer}>
              <Icon name="flame-outline" size={20} color="#F59E0B" />
            </View>
            <View style={styles.workoutTrackerSummaryContent}>
              <Text style={styles.workoutTrackerSummaryValue}>{sampleWorkoutData.weeklyStats.totalCalories}</Text>
              <Text style={styles.workoutTrackerSummaryLabel}>Calorías</Text>
            </View>
          </View>
          <View style={styles.workoutTrackerSummaryCard}>
            <View style={styles.workoutTrackerSummaryIconContainer}>
              <Icon name="pulse-outline" size={20} color="#EC4899" />
            </View>
            <View style={styles.workoutTrackerSummaryContent}>
              <Text style={styles.workoutTrackerSummaryValue}>{sampleWorkoutData.weeklyStats.averageIntensity}/10</Text>
              <Text style={styles.workoutTrackerSummaryLabel}>Intensidad</Text>
            </View>
          </View>
        </View>

        {/* Botón para agregar entrenamiento */}
        <View style={styles.addWorkoutContainer}>
        <TouchableOpacity 
            style={styles.addWorkoutButton}
          onPress={() => setShowAddWorkoutModal(true)}
        >
            <Icon name="add-circle-outline" size={20} color="#FFFFFF" />
            <Text style={styles.addWorkoutText}>Registrar Entrenamiento</Text>
        </TouchableOpacity>
      </View>

        {/* Progreso semanal */}
        <View style={styles.weeklyWorkoutContainer}>
          <View style={styles.weeklyWorkoutHeader}>
            <Text style={styles.weeklyWorkoutTitle}>Esta Semana</Text>
            <TouchableOpacity style={styles.viewStatsButton}>
              <Icon name="analytics-outline" size={16} color="#059669" />
              <Text style={styles.viewStatsText}>Ver Estadísticas</Text>
            </TouchableOpacity>
        </View>

          <View style={styles.weeklyWorkoutGrid}>
            {getWeekDays().map((day, index) => (
              <View key={index} style={styles.dayWorkoutCard}>
                <Text style={styles.dayWorkoutLabel}>{day.day}</Text>
                <View style={styles.dayWorkoutContent}>
                  {day.completed ? (
                    <>
                      <Icon name="checkmark-circle" size={20} color="#059669" />
                      <Text style={styles.dayWorkoutTitle}>{day.workout}</Text>
                      <Text style={styles.dayWorkoutDuration}>{day.duration}m</Text>
                      <Text style={styles.dayWorkoutCalories}>{day.calories} cal</Text>
                    </>
                  ) : day.workout === 'Descanso' ? (
                    <>
                      <Icon name="bed-outline" size={20} color="#6B7280" />
                      <Text style={styles.dayWorkoutTitle}>Descanso</Text>
                    </>
                  ) : (
                    <>
                      <Icon name="ellipse-outline" size={20} color="#E5E7EB" />
                      <Text style={styles.dayWorkoutTitle}>{day.workout}</Text>
                      <Text style={styles.dayWorkoutPending}>Pendiente</Text>
                    </>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Objetivos de entrenamiento */}
        <View style={styles.workoutGoalsContainer}>
          <View style={styles.workoutGoalsHeader}>
            <Text style={styles.workoutGoalsTitle}>Objetivos de la Semana</Text>
            <Text style={styles.workoutGoalsSubtitle}>
              {sampleWorkoutData.goals.filter(goal => goal.completed).length}/{sampleWorkoutData.goals.length} completados
            </Text>
          </View>
          
          <View style={styles.workoutGoalsList}>
            {sampleWorkoutData.goals.map((goal) => (
              <View key={goal.id} style={styles.workoutGoalCard}>
                <View style={styles.workoutGoalHeader}>
                  <View style={styles.workoutGoalIcon}>
                    <Icon 
                      name={goal.completed ? "checkmark-circle" : "ellipse-outline"} 
                      size={20} 
                      color={goal.completed ? "#059669" : "#E5E7EB"} 
                    />
                  </View>
                  <Text style={[
                    styles.workoutGoalTitle,
                    goal.completed && styles.workoutGoalTitleCompleted
                  ]}>
                    {goal.title}
                  </Text>
                </View>
                <View style={styles.workoutGoalProgress}>
                  <View style={styles.workoutGoalProgressBar}>
                    <View 
                      style={[
                        styles.workoutGoalProgressFill,
                        { 
                          width: `${getProgressPercentage(goal.progress, goal.target)}%`,
                          backgroundColor: goal.completed ? '#059669' : '#F59E0B'
                        }
                      ]}
                    />
                  </View>
                  <Text style={styles.workoutGoalProgressText}>
                    {goal.progress}/{goal.target}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Notas de entrenamiento */}
        <View style={styles.workoutNotesContainer}>
          <View style={styles.workoutNotesHeader}>
            <Icon name="document-text-outline" size={20} color="#059669" />
            <Text style={styles.workoutNotesTitle}>Notas de Entrenamiento</Text>
          </View>
          <TextInput 
            style={styles.workoutNotesInput} 
            placeholder="¿Cómo te sentiste hoy? ¿Algún logro o dificultad?"
            multiline
            placeholderTextColor="#A0A0A0"
          />
        </View>

        {/* Sistema de logros */}
        <View style={styles.workoutAchievementsContainer}>
          <View style={styles.workoutAchievementsHeader}>
            <Text style={styles.workoutAchievementsTitle}>Logros de Fitness</Text>
            <Text style={styles.workoutAchievementsSubtitle}>
              {getUnlockedAchievements()}/{sampleWorkoutData.achievements.length} desbloqueados
            </Text>
          </View>
          
          <View style={styles.workoutAchievementsGrid}>
            {sampleWorkoutData.achievements.map((achievement) => (
              <View key={achievement.id} style={[
                styles.workoutAchievementCard,
                !achievement.unlocked && styles.workoutAchievementCardLocked
              ]}>
                <View style={styles.workoutAchievementIcon}>
                  <Text style={[
                    styles.workoutAchievementEmoji,
                    !achievement.unlocked && styles.workoutAchievementEmojiLocked
                  ]}>
                    {achievement.unlocked ? achievement.icon : '🔒'}
                  </Text>
                </View>
                <View style={styles.workoutAchievementContent}>
                  <Text style={[
                    styles.workoutAchievementTitle,
                    !achievement.unlocked && styles.workoutAchievementTitleLocked
                  ]}>
                    {achievement.title}
                  </Text>
                  <Text style={[
                    styles.workoutAchievementDescription,
                    !achievement.unlocked && styles.workoutAchievementDescriptionLocked
                  ]}>
                    {achievement.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>
      </View>
    </View>
  );
  };

  // Función para renderizar Pérdida de Peso
  const renderWeightLossTracker = () => {
    const sampleWeightData = {
      currentWeight: 75.2,
      startingWeight: 82.5,
      targetWeight: 70.0,
      weightLost: 7.3,
      weightToLose: 5.2,
      weeklyStats: {
        thisWeek: -0.8,
        lastWeek: -1.2,
        averageWeekly: -0.6,
        totalWeeks: 12
      },
      recentWeights: [
        { date: '2024-01-15', weight: 75.2, change: -0.3 },
        { date: '2024-01-08', weight: 75.5, change: -0.5 },
        { date: '2024-01-01', weight: 76.0, change: -0.8 },
        { date: '2023-12-25', weight: 76.8, change: -0.4 },
        { date: '2023-12-18', weight: 77.2, change: -0.6 }
      ],
      goals: [
        { id: 1, title: 'Peso objetivo', target: 70.0, current: 75.2, progress: 75.2, completed: false },
        { id: 2, title: 'Perder 10kg', target: 10.0, current: 7.3, progress: 7.3, completed: false },
        { id: 3, title: 'Mantener peso por 1 mes', target: 30, current: 0, progress: 0, completed: false }
      ],
      achievements: [
        { id: 1, title: 'Primer Kilo', description: 'Perdiste tu primer kilogramo', icon: '🎯', unlocked: true },
        { id: 2, title: 'Consistencia', description: 'Registraste peso por 7 días seguidos', icon: '📅', unlocked: true },
        { id: 3, title: 'Meta Semanal', description: 'Perdiste 0.5kg en una semana', icon: '⚖️', unlocked: true },
        { id: 4, title: 'Maratón', description: 'Perdiste 5kg en total', icon: '🏃', unlocked: false }
      ]
    };

    const getUnlockedAchievements = () => {
      return sampleWeightData.achievements.filter(achievement => achievement.unlocked).length;
    };

    const getProgressPercentage = (current, target) => {
      return Math.min((current / target) * 100, 100);
    };

    const getWeightTrend = () => {
      const recent = sampleWeightData.recentWeights.slice(0, 2);
      if (recent.length < 2) return 'neutral';
      return recent[0].weight < recent[1].weight ? 'down' : 'up';
    };

    return (
    <View style={styles.section}>
        {/* Header estilo fitness */}
        <View style={styles.weightLossHeader}>
          <View style={styles.weightLossHeaderContent}>
            <View style={styles.weightLossIconContainer}>
              <Icon name="scale-outline" size={24} color="#FFFFFF" />
        </View>
            <View style={styles.weightLossHeaderText}>
              <Text style={styles.weightLossHeaderTitle}>
                Pérdida de Peso
              </Text>
              <Text style={styles.weightLossHeaderSubtitle}>
                Monitorea tu progreso hacia tu peso ideal
          </Text>
        </View>
          </View>
          <View style={styles.weightLossHeaderBadge}>
            <Icon name="trending-down-outline" size={16} color="#059669" />
          </View>
        </View>

        {/* Resumen de estadísticas */}
        <View style={styles.weightLossSummary}>
          <View style={styles.weightLossSummaryCard}>
            <View style={styles.weightLossSummaryIconContainer}>
              <Icon name="scale-outline" size={20} color="#059669" />
            </View>
            <View style={styles.weightLossSummaryContent}>
              <Text style={styles.weightLossSummaryValue}>{sampleWeightData.currentWeight}kg</Text>
              <Text style={styles.weightLossSummaryLabel}>Peso Actual</Text>
            </View>
          </View>
          <View style={styles.weightLossSummaryCard}>
            <View style={styles.weightLossSummaryIconContainer}>
              <Icon name="trending-down-outline" size={20} color="#EF4444" />
            </View>
            <View style={styles.weightLossSummaryContent}>
              <Text style={styles.weightLossSummaryValue}>-{sampleWeightData.weightLost}kg</Text>
              <Text style={styles.weightLossSummaryLabel}>Perdido</Text>
            </View>
          </View>
          <View style={styles.weightLossSummaryCard}>
            <View style={styles.weightLossSummaryIconContainer}>
              <Icon name="flag-outline" size={20} color="#F59E0B" />
            </View>
            <View style={styles.weightLossSummaryContent}>
              <Text style={styles.weightLossSummaryValue}>{sampleWeightData.weightToLose}kg</Text>
              <Text style={styles.weightLossSummaryLabel}>Restante</Text>
            </View>
          </View>
          <View style={styles.weightLossSummaryCard}>
            <View style={styles.weightLossSummaryIconContainer}>
              <Icon name="calendar-outline" size={20} color="#EC4899" />
            </View>
            <View style={styles.weightLossSummaryContent}>
              <Text style={styles.weightLossSummaryValue}>{sampleWeightData.weeklyStats.totalWeeks}</Text>
              <Text style={styles.weightLossSummaryLabel}>Semanas</Text>
            </View>
          </View>
        </View>

        {/* Progreso principal */}
        <View style={styles.weightProgressContainer}>
          <View style={styles.weightProgressHeader}>
            <Text style={styles.weightProgressTitle}>Progreso hacia tu Meta</Text>
            <Text style={styles.weightProgressSubtitle}>
              {sampleWeightData.currentWeight}kg de {sampleWeightData.targetWeight}kg
            </Text>
          </View>
          
          <View style={styles.weightProgressBar}>
            <View 
              style={[
                styles.weightProgressFill,
                { 
                  width: `${getProgressPercentage(sampleWeightData.weightLost, sampleWeightData.startingWeight - sampleWeightData.targetWeight)}%`,
                  backgroundColor: '#059669'
                }
              ]}
            />
          </View>
          
          <View style={styles.weightProgressStats}>
            <View style={styles.weightProgressStat}>
              <Text style={styles.weightProgressStatValue}>{sampleWeightData.startingWeight}kg</Text>
              <Text style={styles.weightProgressStatLabel}>Inicio</Text>
            </View>
            <View style={styles.weightProgressStat}>
              <Text style={styles.weightProgressStatValue}>{sampleWeightData.currentWeight}kg</Text>
              <Text style={styles.weightProgressStatLabel}>Actual</Text>
            </View>
            <View style={styles.weightProgressStat}>
              <Text style={styles.weightProgressStatValue}>{sampleWeightData.targetWeight}kg</Text>
              <Text style={styles.weightProgressStatLabel}>Meta</Text>
            </View>
          </View>
        </View>

        {/* Botón para registrar peso */}
        <View style={styles.addWeightContainer}>
        <TouchableOpacity 
            style={styles.addWeightButton}
          onPress={() => setShowAddWeightGoalModal(true)}
        >
            <Icon name="add-circle-outline" size={20} color="#FFFFFF" />
            <Text style={styles.addWeightText}>Registrar Peso</Text>
        </TouchableOpacity>
      </View>

        {/* Historial de peso */}
        <View style={styles.weightHistoryContainer}>
          <View style={styles.weightHistoryHeader}>
            <Text style={styles.weightHistoryTitle}>Historial Reciente</Text>
            <TouchableOpacity style={styles.viewStatsButton}>
              <Icon name="analytics-outline" size={16} color="#059669" />
              <Text style={styles.viewStatsText}>Ver Gráfico</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.weightHistoryList}>
            {sampleWeightData.recentWeights.map((entry, index) => (
              <View key={index} style={styles.weightHistoryItem}>
                <View style={styles.weightHistoryDate}>
                  <Text style={styles.weightHistoryDateText}>
                    {new Date(entry.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                  </Text>
                </View>
                <View style={styles.weightHistoryWeight}>
                  <Text style={styles.weightHistoryWeightValue}>{entry.weight}kg</Text>
                  <Text style={[
                    styles.weightHistoryChange,
                    { color: entry.change < 0 ? '#059669' : entry.change > 0 ? '#EF4444' : '#6B7280' }
                  ]}>
                    {entry.change < 0 ? '' : '+'}{entry.change}kg
                  </Text>
                </View>
                <View style={styles.weightHistoryTrend}>
                  <Icon 
                    name={entry.change < 0 ? "trending-down" : entry.change > 0 ? "trending-up" : "remove"} 
                    size={16} 
                    color={entry.change < 0 ? '#059669' : entry.change > 0 ? '#EF4444' : '#6B7280'} 
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Objetivos de peso */}
        <View style={styles.weightGoalsContainer}>
          <View style={styles.weightGoalsHeader}>
            <Text style={styles.weightGoalsTitle}>Objetivos de Peso</Text>
            <Text style={styles.weightGoalsSubtitle}>
              {sampleWeightData.goals.filter(goal => goal.completed).length}/{sampleWeightData.goals.length} completados
            </Text>
          </View>
          
          <View style={styles.weightGoalsList}>
            {sampleWeightData.goals.map((goal) => (
              <View key={goal.id} style={styles.weightGoalCard}>
                <View style={styles.weightGoalHeader}>
                  <View style={styles.weightGoalIcon}>
                    <Icon 
                      name={goal.completed ? "checkmark-circle" : "ellipse-outline"} 
                      size={20} 
                      color={goal.completed ? "#059669" : "#E5E7EB"} 
                    />
                  </View>
                  <Text style={[
                    styles.weightGoalTitle,
                    goal.completed && styles.weightGoalTitleCompleted
                  ]}>
                    {goal.title}
                  </Text>
                </View>
                <View style={styles.weightGoalProgress}>
                  <View style={styles.weightGoalProgressBar}>
                    <View 
                      style={[
                        styles.weightGoalProgressFill,
                        { 
                          width: `${getProgressPercentage(goal.current, goal.target)}%`,
                          backgroundColor: goal.completed ? '#059669' : '#F59E0B'
                        }
                      ]}
                    />
                  </View>
                  <Text style={styles.weightGoalProgressText}>
                    {goal.current}/{goal.target}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Notas de peso */}
        <View style={styles.weightNotesContainer}>
          <View style={styles.weightNotesHeader}>
            <Icon name="document-text-outline" size={20} color="#059669" />
            <Text style={styles.weightNotesTitle}>Notas de Progreso</Text>
          </View>
          <TextInput 
            style={styles.weightNotesInput} 
            placeholder="¿Cómo te sientes con tu progreso? ¿Algún desafío o logro?"
            multiline
            placeholderTextColor="#A0A0A0"
          />
        </View>

        {/* Sistema de logros */}
        <View style={styles.weightAchievementsContainer}>
          <View style={styles.weightAchievementsHeader}>
            <Text style={styles.weightAchievementsTitle}>Logros de Pérdida de Peso</Text>
            <Text style={styles.weightAchievementsSubtitle}>
              {getUnlockedAchievements()}/{sampleWeightData.achievements.length} desbloqueados
            </Text>
          </View>
          
          <View style={styles.weightAchievementsGrid}>
            {sampleWeightData.achievements.map((achievement) => (
              <View key={achievement.id} style={[
                styles.weightAchievementCard,
                !achievement.unlocked && styles.weightAchievementCardLocked
              ]}>
                <View style={styles.weightAchievementIcon}>
                  <Text style={[
                    styles.weightAchievementEmoji,
                    !achievement.unlocked && styles.weightAchievementEmojiLocked
                  ]}>
                    {achievement.unlocked ? achievement.icon : '🔒'}
                  </Text>
                </View>
                <View style={styles.weightAchievementContent}>
                  <Text style={[
                    styles.weightAchievementTitle,
                    !achievement.unlocked && styles.weightAchievementTitleLocked
                  ]}>
                    {achievement.title}
                  </Text>
                  <Text style={[
                    styles.weightAchievementDescription,
                    !achievement.unlocked && styles.weightAchievementDescriptionLocked
                  ]}>
                    {achievement.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>
      </View>
    </View>
  );
  };

  // Función para renderizar Seguimiento Nutricional
  const renderNutritionTracker = () => {
    const sampleNutritionData = {
      dailyStats: {
        totalCalories: 2150,
        targetCalories: 2200,
        protein: 120,
        targetProtein: 130,
        carbs: 280,
        targetCarbs: 300,
        fats: 85,
        targetFats: 90,
        water: 2.2,
        targetWater: 2.5
      },
      meals: [
        { 
          id: 'breakfast', 
          name: 'Desayuno', 
          icon: 'sunny-outline',
          calories: 450,
          protein: 25,
          carbs: 45,
          fats: 18,
          completed: true
        },
        { 
          id: 'lunch', 
          name: 'Almuerzo', 
          icon: 'restaurant-outline',
          calories: 650,
          protein: 35,
          carbs: 75,
          fats: 22,
          completed: true
        },
        { 
          id: 'dinner', 
          name: 'Cena', 
          icon: 'moon-outline',
          calories: 550,
          protein: 30,
          carbs: 60,
          fats: 20,
          completed: false
        },
        { 
          id: 'snacks', 
          name: 'Snacks', 
          icon: 'cafe-outline',
          calories: 200,
          protein: 8,
          carbs: 25,
          fats: 8,
          completed: true
        }
      ],
      supplements: [
        { id: 1, name: 'Multivitamínico', taken: true, time: '08:00' },
        { id: 2, name: 'Omega-3', taken: true, time: '12:00' },
        { id: 3, name: 'Proteína', taken: false, time: '15:00' },
        { id: 4, name: 'Magnesio', taken: false, time: '20:00' }
      ],
      goals: [
        { id: 1, title: 'Calorías diarias', current: 2150, target: 2200, unit: 'kcal' },
        { id: 2, title: 'Proteína diaria', current: 120, target: 130, unit: 'g' },
        { id: 3, title: 'Hidratación', current: 2.2, target: 2.5, unit: 'L' },
        { id: 4, title: 'Comidas completas', current: 3, target: 4, unit: 'comidas' }
      ],
      achievements: [
        { id: 1, title: 'Primer Día', description: 'Completaste tu primer día de seguimiento', icon: '🍎', unlocked: true },
        { id: 2, title: 'Hidratado', description: 'Bebiste 2L+ de agua en un día', icon: '💧', unlocked: true },
        { id: 3, title: 'Proteína Power', description: 'Alcanzaste tu meta de proteína', icon: '💪', unlocked: true },
        { id: 4, title: 'Consistencia', description: '7 días seguidos registrando comidas', icon: '📅', unlocked: false }
      ]
    };

    const getUnlockedAchievements = () => {
      return sampleNutritionData.achievements.filter(achievement => achievement.unlocked).length;
    };

    const getProgressPercentage = (current, target) => {
      return Math.min((current / target) * 100, 100);
    };

    const getMacroColor = (macro) => {
      const colors = {
        protein: '#EF4444',
        carbs: '#F59E0B',
        fats: '#EC4899',
        calories: '#059669'
      };
      return colors[macro] || '#059669';
    };

    return (
    <View style={styles.section}>
        {/* Header estilo fitness */}
        <View style={styles.nutritionHeader}>
          <View style={styles.nutritionHeaderContent}>
            <View style={styles.nutritionIconContainer}>
              <Icon name="nutrition-outline" size={24} color="#FFFFFF" />
        </View>
            <View style={styles.nutritionHeaderText}>
              <Text style={styles.nutritionHeaderTitle}>
                Seguimiento Nutricional
              </Text>
              <Text style={styles.nutritionHeaderSubtitle}>
                Monitorea tu alimentación y macronutrientes
          </Text>
        </View>
          </View>
          <View style={styles.nutritionHeaderBadge}>
            <Icon name="restaurant-outline" size={16} color="#059669" />
          </View>
        </View>

        {/* Resumen de macronutrientes */}
        <View style={styles.nutritionSummary}>
          <View style={styles.nutritionSummaryCard}>
            <View style={styles.nutritionSummaryIconContainer}>
              <Icon name="flame-outline" size={20} color="#059669" />
            </View>
            <View style={styles.nutritionSummaryContent}>
              <Text style={styles.nutritionSummaryValue}>{sampleNutritionData.dailyStats.totalCalories}</Text>
              <Text style={styles.nutritionSummaryLabel}>Calorías</Text>
              <Text style={styles.nutritionSummaryTarget}>/ {sampleNutritionData.dailyStats.targetCalories}</Text>
            </View>
          </View>
          <View style={styles.nutritionSummaryCard}>
            <View style={styles.nutritionSummaryIconContainer}>
              <Icon name="fitness-outline" size={20} color="#EF4444" />
            </View>
            <View style={styles.nutritionSummaryContent}>
              <Text style={styles.nutritionSummaryValue}>{sampleNutritionData.dailyStats.protein}g</Text>
              <Text style={styles.nutritionSummaryLabel}>Proteína</Text>
              <Text style={styles.nutritionSummaryTarget}>/ {sampleNutritionData.dailyStats.targetProtein}g</Text>
            </View>
          </View>
          <View style={styles.nutritionSummaryCard}>
            <View style={styles.nutritionSummaryIconContainer}>
              <Icon name="leaf-outline" size={20} color="#F59E0B" />
            </View>
            <View style={styles.nutritionSummaryContent}>
              <Text style={styles.nutritionSummaryValue}>{sampleNutritionData.dailyStats.carbs}g</Text>
              <Text style={styles.nutritionSummaryLabel}>Carbohidratos</Text>
              <Text style={styles.nutritionSummaryTarget}>/ {sampleNutritionData.dailyStats.targetCarbs}g</Text>
            </View>
          </View>
          <View style={styles.nutritionSummaryCard}>
            <View style={styles.nutritionSummaryIconContainer}>
              <Icon name="water-outline" size={20} color="#EC4899" />
            </View>
            <View style={styles.nutritionSummaryContent}>
              <Text style={styles.nutritionSummaryValue}>{sampleNutritionData.dailyStats.fats}g</Text>
              <Text style={styles.nutritionSummaryLabel}>Grasas</Text>
              <Text style={styles.nutritionSummaryTarget}>/ {sampleNutritionData.dailyStats.targetFats}g</Text>
            </View>
          </View>
        </View>

        {/* Progreso de hidratación */}
        <View style={styles.waterProgressContainer}>
          <View style={styles.waterProgressHeader}>
            <View style={styles.waterProgressIcon}>
              <Icon name="water-outline" size={24} color="#059669" />
            </View>
            <View style={styles.waterProgressContent}>
              <Text style={styles.waterProgressTitle}>Hidratación</Text>
              <Text style={styles.waterProgressSubtitle}>
                {sampleNutritionData.dailyStats.water}L / {sampleNutritionData.dailyStats.targetWater}L
              </Text>
            </View>
            <Text style={styles.waterProgressPercentage}>
              {Math.round(getProgressPercentage(sampleNutritionData.dailyStats.water, sampleNutritionData.dailyStats.targetWater))}%
            </Text>
          </View>
          <View style={styles.waterProgressBar}>
            <View 
              style={[
                styles.waterProgressFill,
                { 
                  width: `${getProgressPercentage(sampleNutritionData.dailyStats.water, sampleNutritionData.dailyStats.targetWater)}%`,
                  backgroundColor: '#059669'
                }
              ]}
            />
          </View>
        </View>

        {/* Botón para agregar comida */}
        <View style={styles.addMealContainer}>
        <TouchableOpacity 
            style={styles.addMealButton}
          onPress={() => setShowNutritionDatePicker(true)}
        >
            <Icon name="add-circle-outline" size={20} color="#FFFFFF" />
            <Text style={styles.addMealText}>Registrar Comida</Text>
        </TouchableOpacity>
      </View>

        {/* Seguimiento de comidas */}
        <View style={styles.mealsContainer}>
          <View style={styles.mealsHeader}>
            <Text style={styles.mealsTitle}>Comidas del Día</Text>
            <Text style={styles.mealsSubtitle}>
              {sampleNutritionData.meals.filter(meal => meal.completed).length}/{sampleNutritionData.meals.length} completadas
            </Text>
          </View>

          <View style={styles.mealsList}>
            {sampleNutritionData.meals.map((meal) => (
              <View key={meal.id} style={styles.mealCard}>
                <View style={styles.mealCardHeader}>
                  <View style={styles.mealCardIcon}>
                    <Icon 
                      name={meal.completed ? "checkmark-circle" : "ellipse-outline"} 
                      size={20} 
                      color={meal.completed ? "#059669" : "#E5E7EB"} 
                    />
            </View>
                  <View style={styles.mealCardInfo}>
                    <Text style={styles.mealCardName}>{meal.name}</Text>
                    <Text style={styles.mealCardCalories}>{meal.calories} kcal</Text>
          </View>
                  <View style={styles.mealCardMacros}>
                    <View style={styles.macroItem}>
                      <Text style={[styles.macroValue, { color: getMacroColor('protein') }]}>
                        {meal.protein}g
                      </Text>
                      <Text style={styles.macroLabel}>P</Text>
            </View>
                    <View style={styles.macroItem}>
                      <Text style={[styles.macroValue, { color: getMacroColor('carbs') }]}>
                        {meal.carbs}g
                      </Text>
                      <Text style={styles.macroLabel}>C</Text>
          </View>
                    <View style={styles.macroItem}>
                      <Text style={[styles.macroValue, { color: getMacroColor('fats') }]}>
                        {meal.fats}g
                      </Text>
                      <Text style={styles.macroLabel}>G</Text>
            </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Suplementos */}
        <View style={styles.supplementsContainer}>
          <View style={styles.supplementsHeader}>
            <Text style={styles.supplementsTitle}>Suplementos</Text>
            <Text style={styles.supplementsSubtitle}>
              {sampleNutritionData.supplements.filter(sup => sup.taken).length}/{sampleNutritionData.supplements.length} tomados
            </Text>
          </View>
          
          <View style={styles.supplementsGrid}>
            {sampleNutritionData.supplements.map((supplement) => (
              <TouchableOpacity 
                key={supplement.id} 
                style={[
                  styles.supplementCard,
                  supplement.taken && styles.supplementCardTaken
                ]}
              >
                <View style={styles.supplementCardContent}>
                  <Icon 
                    name={supplement.taken ? "checkmark-circle" : "ellipse-outline"} 
                    size={16} 
                    color={supplement.taken ? "#059669" : "#E5E7EB"} 
                  />
                  <Text style={[
                    styles.supplementName,
                    supplement.taken && styles.supplementNameTaken
                  ]}>
                    {supplement.name}
                  </Text>
                  <Text style={styles.supplementTime}>{supplement.time}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Objetivos nutricionales */}
        <View style={styles.nutritionGoalsContainer}>
          <View style={styles.nutritionGoalsHeader}>
            <Text style={styles.nutritionGoalsTitle}>Objetivos del Día</Text>
            <Text style={styles.nutritionGoalsSubtitle}>
              {sampleNutritionData.goals.filter(goal => getProgressPercentage(goal.current, goal.target) >= 100).length}/{sampleNutritionData.goals.length} completados
            </Text>
          </View>
          
          <View style={styles.nutritionGoalsList}>
            {sampleNutritionData.goals.map((goal) => (
              <View key={goal.id} style={styles.nutritionGoalCard}>
                <View style={styles.nutritionGoalHeader}>
                  <Text style={styles.nutritionGoalTitle}>{goal.title}</Text>
                  <Text style={styles.nutritionGoalValues}>
                    {goal.current}/{goal.target} {goal.unit}
                  </Text>
                </View>
                <View style={styles.nutritionGoalProgress}>
                  <View style={styles.nutritionGoalProgressBar}>
                    <View 
                      style={[
                        styles.nutritionGoalProgressFill,
                        { 
                          width: `${getProgressPercentage(goal.current, goal.target)}%`,
                          backgroundColor: getProgressPercentage(goal.current, goal.target) >= 100 ? '#059669' : '#F59E0B'
                        }
                      ]}
                    />
                  </View>
                  <Text style={styles.nutritionGoalPercentage}>
                    {Math.round(getProgressPercentage(goal.current, goal.target))}%
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Sistema de logros */}
        <View style={styles.nutritionAchievementsContainer}>
          <View style={styles.nutritionAchievementsHeader}>
            <Text style={styles.nutritionAchievementsTitle}>Logros Nutricionales</Text>
            <Text style={styles.nutritionAchievementsSubtitle}>
              {getUnlockedAchievements()}/{sampleNutritionData.achievements.length} desbloqueados
            </Text>
          </View>
          
          <View style={styles.nutritionAchievementsGrid}>
            {sampleNutritionData.achievements.map((achievement) => (
              <View key={achievement.id} style={[
                styles.nutritionAchievementCard,
                !achievement.unlocked && styles.nutritionAchievementCardLocked
              ]}>
                <View style={styles.nutritionAchievementIcon}>
                  <Text style={[
                    styles.nutritionAchievementEmoji,
                    !achievement.unlocked && styles.nutritionAchievementEmojiLocked
                  ]}>
                    {achievement.unlocked ? achievement.icon : '🔒'}
                  </Text>
                </View>
                <View style={styles.nutritionAchievementContent}>
                  <Text style={[
                    styles.nutritionAchievementTitle,
                    !achievement.unlocked && styles.nutritionAchievementTitleLocked
                  ]}>
                    {achievement.title}
                  </Text>
                  <Text style={[
                    styles.nutritionAchievementDescription,
                    !achievement.unlocked && styles.nutritionAchievementDescriptionLocked
                  ]}>
                    {achievement.description}
                  </Text>
                </View>
              </View>
            ))}
        </View>
      </View>
    </View>
  );
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'meal-planner': 
        return renderMealPlanner();
      case 'recipes': 
        return renderRecipes();
      case 'fitness-tracker': 
        return renderFitnessTracker();
      case 'body-measurements': 
        return renderBodyMeasurements();
      case 'workout-tracker': 
        return renderWorkoutTracker();
      case 'weight-loss': 
        return renderWeightLossTracker();
      case 'nutrition-tracker': 
        return renderNutritionTracker();
      case 'gym-routine': 
        return renderGymRoutine();
      case 'sports-goals': 
        return renderSportsGoals();
      default: 
        return renderMealPlanner();
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
      
      {/* Modales de alimentación */}
      {renderAddMealModal()}
      {renderAddRecipeModal()}
      {renderAddItemModal()}
      
      {/* Modales de ejercicio */}
      {renderAddGymModal()}
      {renderAddSportsModal()}
      
      {/* Modal para seleccionar fecha de medidas */}
      {showMeasurementDatePicker && (
        <Modal
          visible={showMeasurementDatePicker}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Seleccionar Fecha</Text>
              <DateTimePicker
                value={selectedMeasurementDate}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowMeasurementDatePicker(false);
                  if (selectedDate) {
                    setSelectedMeasurementDate(selectedDate);
                  }
                }}
              />
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowMeasurementDatePicker(false)}
              >
                <Text style={styles.modalCloseButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC', // Blanco azulado
  },
  tabsContainer: {
    backgroundColor: '#F8FAFC', // Blanco azulado
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderRadius: 20,
    shadowColor: '#1E3A5F',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tabsWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#F8FAFC', // Blanco azulado
    padding: 8,
    borderRadius: 16,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: '#4A6B8A', // Azul grisáceo
    shadowColor: '#4A6B8A', // Azul grisáceo
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
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -8,
    left: '50%',
    marginLeft: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4A6B8A', // Azul grisáceo
  },
  content: {
    flex: 1,
    paddingHorizontal: 0,
    paddingVertical: 16,
  },
  section: {
    backgroundColor: '#F8FAFC', // Blanco azulado
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    marginHorizontal: 16,
    shadowColor: '#1E3A5F', // Azul montaña profundo
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    alignItems: 'center',
    backgroundColor: '#1E3A5F', // Azul montaña profundo
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginBottom: 0,
    marginHorizontal: 0,
    shadowColor: '#1E3A5F',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
    borderBottomWidth: 3,
    borderBottomColor: '#4A6B8A', // Azul grisáceo
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
  sectionSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#4A6B8A', // Azul grisáceo
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#1E3A5F', // Azul montaña profundo
    shadowColor: '#1E3A5F',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  // Estilos mejorados para planificador de comidas
  mealPlannerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#059669',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#059669',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  mealPlannerHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  mealPlannerIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  mealPlannerHeaderText: {
    flex: 1,
  },
  mealPlannerHeaderTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  mealPlannerHeaderSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 18,
  },
  mealPlannerHeaderBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mealPlannerSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 12,
  },
  mealPlannerSummaryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mealPlannerSummaryIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  mealPlannerSummaryContent: {
    alignItems: 'center',
  },
  mealPlannerSummaryValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#059669',
    marginBottom: 2,
  },
  mealPlannerSummaryLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  addMealContainer: {
    marginBottom: 20,
  },
  addMealButton: {
    backgroundColor: '#059669',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#059669',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  addMealText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  dailyMealPlanContainer: {
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
  dailyMealPlanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  dailyMealPlanTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dailyMealPlanTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#059669',
    marginLeft: 8,
  },
  dailyMealPlanDate: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  mealsGrid: {
    gap: 16,
  },
  mealCardIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mealCardActionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addMealButtonSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  addMealButtonSmallText: {
    color: '#059669',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  waterTrackingContainer: {
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
  waterTrackingHeader: {
    marginBottom: 20,
  },
  waterTrackingTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  waterTrackingTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0EA5E9',
    marginLeft: 8,
  },
  waterTrackingSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  waterGlassesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 8,
  },
  quickAccessIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  
  // Estilos mejorados para recetas
  recipesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#059669',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#059669',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  recipesHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  recipesIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  recipesHeaderText: {
    flex: 1,
  },
  recipesHeaderTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  recipesHeaderSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 18,
  },
  recipesHeaderBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recipesSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 12,
  },
  recipesSummaryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recipesSummaryIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  recipesSummaryContent: {
    alignItems: 'center',
  },
  recipesSummaryValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#059669',
    marginBottom: 2,
  },
  recipesSummaryLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  addRecipeContainer: {
    marginBottom: 20,
  },
  addRecipeButton: {
    backgroundColor: '#059669',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#059669',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  addRecipeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  recipesListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  recipesListTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#059669',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  filterText: {
    color: '#059669',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  recipesBody: {
    maxHeight: 500,
  },
  recipeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    margin: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  recipeCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  recipeCardIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  recipeEmoji: {
    fontSize: 24,
  },
  recipeCardContent: {
    flex: 1,
  },
  recipeCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#059669',
    marginBottom: 4,
  },
  recipeCardCategory: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  recipeCardActions: {
    flexDirection: 'row',
    gap: 8,
  },
  recipeActionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recipeCardBody: {
    gap: 12,
  },
  recipeMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  recipeMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recipeMetaText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
    fontWeight: '500',
  },
  recipeDifficulty: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  recipeRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    color: '#F59E0B',
    fontWeight: '600',
    marginLeft: 4,
  },
  recipeDescription: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  recipeTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  recipeTag: {
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  recipeTagText: {
    fontSize: 11,
    color: '#374151',
    fontWeight: '500',
  },
  recipeActions: {
    flexDirection: 'row',
    gap: 12,
  },
  recipeActionButtonLarge: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0FDF4',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#059669',
  },
  recipeActionText: {
    color: '#059669',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  
  // Estilos mejorados para seguimiento de fitness
  fitnessHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#059669',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#059669',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  fitnessHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  fitnessIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  fitnessHeaderText: {
    flex: 1,
  },
  fitnessHeaderTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  fitnessHeaderSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 18,
  },
  fitnessHeaderBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fitnessSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 12,
  },
  fitnessSummaryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  fitnessSummaryIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  fitnessSummaryContent: {
    alignItems: 'center',
  },
  fitnessSummaryValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#059669',
    marginBottom: 2,
  },
  fitnessSummaryLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  addActivityContainer: {
    marginBottom: 20,
  },
  addActivityButton: {
    backgroundColor: '#059669',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#059669',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  addActivityText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  todayProgressContainer: {
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
  todayProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  todayProgressTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  todayProgressTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#059669',
    marginLeft: 8,
  },
  todayProgressDate: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  todayProgressGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  progressCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  progressCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 6,
  },
  progressCardValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#059669',
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressCardGoal: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  weeklyProgressContainer: {
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
  weeklyProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  weeklyProgressTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#059669',
  },
  viewStatsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  viewStatsText: {
    color: '#059669',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  weeklyProgressGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  dayProgressCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  dayProgressLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
  },
  dayProgressIndicators: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 8,
  },
  dayProgressIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dayProgressSteps: {
    fontSize: 10,
    fontWeight: '600',
    color: '#059669',
  },
  achievementsContainer: {
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
  achievementsHeader: {
    marginBottom: 20,
  },
  achievementsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#059669',
    marginBottom: 4,
  },
  achievementsSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  achievementCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  achievementCardLocked: {
    backgroundColor: '#F3F4F6',
    opacity: 0.6,
  },
  achievementIcon: {
    marginBottom: 8,
  },
  achievementEmoji: {
    fontSize: 24,
  },
  achievementEmojiLocked: {
    opacity: 0.5,
  },
  achievementContent: {
    alignItems: 'center',
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#059669',
    marginBottom: 4,
    textAlign: 'center',
  },
  achievementTitleLocked: {
    color: '#9CA3AF',
  },
  achievementDescription: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 16,
  },
  achievementDescriptionLocked: {
    color: '#9CA3AF',
  },
  nutritionSummaryValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4A6B8A',
  },
  dailyMealPlan: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#4A6B8A',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dailyMealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dailyMealTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dailyMealTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4A6B8A',
  },
  dailyMealDate: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  mealsContainer: {
    gap: 12,
  },
  mealCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  mealCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  mealCardIcon: {
    marginRight: 12,
  },
  mealCardContent: {
    flex: 1,
  },
  mealCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4A6B8A',
    marginBottom: 2,
  },
  mealCardTime: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  mealActionButton: {
    padding: 4,
  },
  mealCardBody: {
    minHeight: 60,
  },
  mealContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mealContentText: {
    flex: 1,
    fontSize: 13,
    color: '#4A6B8A',
    lineHeight: 18,
  },
  mealContentActions: {
    flexDirection: 'row',
    gap: 8,
    marginLeft: 8,
  },
  mealContentAction: {
    padding: 4,
  },
  emptyMealState: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderStyle: 'dashed',
  },
  emptyMealText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 8,
    marginBottom: 8,
  },
  addMealButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4A6B8A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  addMealButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  waterTrackingSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#4A6B8A',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  waterTrackingHeader: {
    marginBottom: 16,
  },
  waterTrackingTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  waterTrackingTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4A6B8A',
  },
  waterTrackingSubtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  waterGlassesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 8,
  },
  waterGlassCard: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  waterGlassCardFilled: {
    backgroundColor: '#E6F3FF',
    borderColor: '#4A90E2',
  },
  waterGlassNumber: {
    fontSize: 10,
    fontWeight: '600',
    color: '#9CA3AF',
    marginTop: 2,
  },
  waterGlassNumberFilled: {
    color: '#4A90E2',
  },
  waterProgressContainer: {
    alignItems: 'center',
  },
  waterProgressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  waterProgressFill: {
    height: '100%',
    backgroundColor: '#4A90E2',
    borderRadius: 4,
  },
  waterProgressText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  quickAccessContainer: {
    marginTop: 8,
  },
  quickAccessTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4A6B8A',
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
    shadowColor: '#4A6B8A',
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
    color: '#4A6B8A',
    textAlign: 'center',
  },
  marketListContainer: {
    gap: 16,
  },
  categorySection: {
    backgroundColor: '#F5F7F0',
    borderRadius: 8,
    padding: 12,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2D5016',
  },
  addItemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e9ecef',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  addItemText: {
    fontSize: 12,
    color: '#4A7C59',
    fontWeight: '600',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  itemRowPurchased: {
    opacity: 0.6,
    backgroundColor: '#F5F7F0',
  },
  checkboxContainer: {
    padding: 8,
    marginRight: 8,
  },
  itemInfo: {
    flex: 1,
    flexDirection: 'column',
  },
  itemText: {
    fontSize: 14,
    color: '#2D5016',
  },
  itemTextPurchased: {
    textDecorationLine: 'line-through',
    color: '#4A6741',
  },
  itemQuantity: {
    fontSize: 12,
    color: '#4A6741',
    fontStyle: 'italic',
    marginTop: 2,
  },
  itemQuantityPurchased: {
    textDecorationLine: 'line-through',
    color: '#adb5bd',
  },
  removeButton: {
    padding: 8,
  },
  recipesContainer: {
    gap: 12,
  },
  recipeCard: {
    backgroundColor: '#F5F7F0',
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#4A7C59',
  },
  recipeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D5016',
    marginBottom: 8,
  },
  recipeIngredients: {
    fontSize: 14,
    color: '#4A6741',
    marginBottom: 4,
  },
  recipeInstructions: {
    fontSize: 14,
    color: '#4A6741',
    fontStyle: 'italic',
  },
  // Estilos para Rutina de Gimnasio - Rediseño basado en Fitness Tracker
  gymHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#059669',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#059669',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  gymHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  gymIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  gymHeaderText: {
    flex: 1,
  },
  gymHeaderTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  gymHeaderSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 18,
  },
  gymHeaderBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gymSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 12,
  },
  gymSummaryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  gymSummaryIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  gymSummaryContent: {
    alignItems: 'center',
  },
  gymSummaryValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#059669',
    marginBottom: 2,
  },
  gymSummaryLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  addRoutineContainer: {
    marginBottom: 20,
  },
  addRoutineButton: {
    backgroundColor: '#059669',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#059669',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  addRoutineText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  routinesContainer: {
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
  routinesHeader: {
    marginBottom: 20,
  },
  routinesTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#059669',
    marginBottom: 4,
  },
  routinesSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  routinesList: {
    gap: 16,
  },
  routineCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  routineCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  routineCardInfo: {
    flex: 1,
  },
  routineCardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  routineCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#374151',
    flex: 1,
    marginRight: 12,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  routineCardDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  routineCardSchedule: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  routineCardScheduleText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  routineCardStatus: {
    alignItems: 'center',
  },
  routineStatusIcon: {
    marginBottom: 4,
  },
  routineStatusIconCompleted: {
    // Estilos adicionales si es necesario
  },
  routineStatusText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  routineStatusTextCompleted: {
    color: '#059669',
  },
  routineCardExercises: {
    marginBottom: 16,
  },
  routineCardExercisesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  exercisesList: {
    gap: 8,
  },
  exerciseItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  exerciseName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  exerciseDetails: {
    fontSize: 12,
    color: '#6B7280',
  },
  moreExercisesText: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 4,
  },
  routineCardActions: {
    flexDirection: 'row',
    gap: 12,
  },
  startRoutineButton: {
    flex: 1,
    backgroundColor: '#059669',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  startRoutineText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  editRoutineButton: {
    flex: 1,
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#059669',
  },
  editRoutineText: {
    color: '#059669',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  gymGoalsContainer: {
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
  gymGoalsHeader: {
    marginBottom: 20,
  },
  gymGoalsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#059669',
    marginBottom: 4,
  },
  gymGoalsSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  gymGoalsList: {
    gap: 16,
  },
  gymGoalCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  gymGoalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  gymGoalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    flex: 1,
  },
  gymGoalValues: {
    fontSize: 14,
    fontWeight: '600',
    color: '#059669',
  },
  gymGoalProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  gymGoalProgressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  gymGoalProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  gymGoalPercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: '#059669',
  },
  gymAchievementsContainer: {
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
  gymAchievementsHeader: {
    marginBottom: 20,
  },
  gymAchievementsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#059669',
    marginBottom: 4,
  },
  gymAchievementsSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  gymAchievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gymAchievementCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  gymAchievementCardLocked: {
    backgroundColor: '#F3F4F6',
    opacity: 0.6,
  },
  gymAchievementIcon: {
    marginBottom: 8,
  },
  gymAchievementEmoji: {
    fontSize: 24,
  },
  gymAchievementEmojiLocked: {
    opacity: 0.5,
  },
  gymAchievementContent: {
    alignItems: 'center',
  },
  gymAchievementTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#059669',
    marginBottom: 4,
    textAlign: 'center',
  },
  gymAchievementTitleLocked: {
    color: '#9CA3AF',
  },
  gymAchievementDescription: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 16,
  },
  gymAchievementDescriptionLocked: {
    color: '#9CA3AF',
  },
  // Estilos para Objetivos Deportivos - Rediseño basado en Fitness Tracker
  sportsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#059669',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#059669',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  sportsHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sportsIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  sportsHeaderText: {
    flex: 1,
  },
  sportsHeaderTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  sportsHeaderSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 18,
  },
  sportsHeaderBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sportsSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 12,
  },
  sportsSummaryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sportsSummaryIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  sportsSummaryContent: {
    alignItems: 'center',
  },
  sportsSummaryValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#059669',
    marginBottom: 2,
  },
  sportsSummaryLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  addGoalContainer: {
    marginBottom: 20,
  },
  addGoalButton: {
    backgroundColor: '#059669',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#059669',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  addGoalText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  sportsCategoriesContainer: {
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
  sportsCategoriesHeader: {
    marginBottom: 20,
  },
  sportsCategoriesTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#059669',
    marginBottom: 4,
  },
  sportsCategoriesSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  sportsCategoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  sportsCategoryCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
  },
  sportsCategoryIcon: {
    marginRight: 12,
  },
  sportsCategoryIconBg: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sportsCategoryContent: {
    flex: 1,
  },
  sportsCategoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 2,
  },
  sportsCategoryCount: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  sportsGoalsContainer: {
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
  sportsGoalsHeader: {
    marginBottom: 20,
  },
  sportsGoalsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#059669',
    marginBottom: 4,
  },
  sportsGoalsSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  sportsGoalsList: {
    gap: 16,
  },
  sportsGoalCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sportsGoalCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  sportsGoalCardInfo: {
    flex: 1,
  },
  sportsGoalCardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sportsGoalCardIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  sportsGoalCardTitleContent: {
    flex: 1,
  },
  sportsGoalCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 2,
  },
  sportsGoalCardCategory: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  sportsGoalPriorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  sportsGoalPriorityText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  sportsGoalCardObjective: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 12,
    lineHeight: 20,
  },
  sportsGoalCardMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sportsGoalCardDate: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sportsGoalCardDateText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  sportsGoalStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  sportsGoalStatusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  sportsGoalCardStatus: {
    alignItems: 'center',
  },
  sportsGoalStatusIcon: {
    marginBottom: 4,
  },
  sportsGoalStatusIconCompleted: {
    // Estilos adicionales si es necesario
  },
  sportsGoalCardProgress: {
    marginBottom: 16,
  },
  sportsGoalCardProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sportsGoalCardProgressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  sportsGoalCardProgressValue: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  sportsGoalCardProgressBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  sportsGoalCardProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  sportsGoalCardProgressPercentage: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    textAlign: 'right',
  },
  sportsGoalCardNotes: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
  },
  sportsGoalCardNotesText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 8,
    flex: 1,
  },
  sportsGoalCardActions: {
    flexDirection: 'row',
    gap: 12,
  },
  updateProgressButton: {
    flex: 1,
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  updateProgressText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  editGoalButton: {
    flex: 1,
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#059669',
  },
  editGoalText: {
    color: '#059669',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  sportsAchievementsContainer: {
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
  sportsAchievementsHeader: {
    marginBottom: 20,
  },
  sportsAchievementsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#059669',
    marginBottom: 4,
  },
  sportsAchievementsSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  sportsAchievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  sportsAchievementCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  sportsAchievementCardLocked: {
    backgroundColor: '#F3F4F6',
    opacity: 0.6,
  },
  sportsAchievementIcon: {
    marginBottom: 8,
  },
  sportsAchievementEmoji: {
    fontSize: 24,
  },
  sportsAchievementEmojiLocked: {
    opacity: 0.5,
  },
  sportsAchievementContent: {
    alignItems: 'center',
  },
  sportsAchievementTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#059669',
    marginBottom: 4,
    textAlign: 'center',
  },
  sportsAchievementTitleLocked: {
    color: '#9CA3AF',
  },
  sportsAchievementDescription: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 16,
  },
  sportsAchievementDescriptionLocked: {
    color: '#9CA3AF',
  },
  // Estilos para modales
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#F8FAF6',
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
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D5016',
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    padding: 20,
    maxHeight: 400,
  },
  modalActions: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    gap: 12,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D5016',
    marginBottom: 8,
  },
  textInput: {
    fontSize: 16,
    color: '#2D5016',
    padding: 12,
    backgroundColor: '#F5F7F0',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  difficultySelector: {
    flexDirection: 'row',
    gap: 8,
  },
  difficultyOption: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#F5F7F0',
    borderWidth: 1,
    borderColor: '#e9ecef',
    alignItems: 'center',
  },
  difficultyOptionSelected: {
    backgroundColor: '#4A7C59',
    borderColor: '#4A7C59',
  },
  difficultyOptionText: {
    fontSize: 14,
    color: '#4A6741',
    fontWeight: '500',
  },
  difficultyOptionTextSelected: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  sportsSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sportOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#F5F7F0',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  sportOptionSelected: {
    backgroundColor: '#4A7C59',
    borderColor: '#4A7C59',
  },
  sportOptionText: {
    fontSize: 12,
    color: '#4A6741',
    fontWeight: '500',
  },
  sportOptionTextSelected: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  exerciseInput: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#F5F7F0',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  exerciseNumber: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4A7C59',
    marginBottom: 8,
  },
  exerciseDetails: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  exerciseDetailInput: {
    flex: 1,
    fontSize: 14,
    padding: 8,
  },
  addExerciseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: '#F5F7F0',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4A7C59',
    borderStyle: 'dashed',
    gap: 8,
  },
  addExerciseText: {
    fontSize: 14,
    color: '#4A7C59',
    fontWeight: '600',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F7F0',
    borderWidth: 1,
    borderColor: '#e9ecef',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  quantityDisplay: {
    minWidth: 60,
    height: 40,
    backgroundColor: '#F5F7F0',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D5016',
  },
  unitSelector: {
    marginVertical: 10,
  },
  unitScroll: {
    maxHeight: 50,
  },
  unitButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#F5F7F0',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  unitButtonSelected: {
    backgroundColor: '#4A7C59',
    borderColor: '#4A7C59',
  },
  unitButtonText: {
    fontSize: 14,
    color: '#4A6741',
    fontWeight: '500',
  },
  unitButtonTextSelected: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#F5F7F0',
    borderWidth: 1,
    borderColor: '#e9ecef',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#4A6741',
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#4A7C59',
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  // Estilos para horarios y días
  scheduleContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#F5F7F0',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  scheduleTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4A7C59',
    marginBottom: 4,
  },
  scheduleText: {
    fontSize: 14,
    color: '#2D5016',
    marginBottom: 4,
  },
  scheduleFrequency: {
    fontSize: 12,
    color: '#4A6741',
    fontStyle: 'italic',
  },
  daysSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dayButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#F5F7F0',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  dayButtonSelected: {
    backgroundColor: '#4A7C59',
    borderColor: '#4A7C59',
  },
  dayButtonText: {
    fontSize: 12,
    color: '#4A6741',
    fontWeight: '500',
  },
  dayButtonTextSelected: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  frequencySelector: {
    flexDirection: 'row',
    gap: 8,
  },
  frequencyOption: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#F5F7F0',
    borderWidth: 1,
    borderColor: '#e9ecef',
    alignItems: 'center',
  },
  frequencyOptionSelected: {
    backgroundColor: '#4A7C59',
    borderColor: '#4A7C59',
  },
  frequencyOptionText: {
    fontSize: 14,
    color: '#4A6741',
    fontWeight: '500',
  },
  frequencyOptionTextSelected: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  // Estilos para botones de fecha
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#F5F7F0',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#2D5016',
    fontWeight: '500',
  },
  // Estilos para Seguimiento de Fitness
  fitnessGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  fitnessColumn: {
    width: '48%',
    marginBottom: 15,
  },
  dayLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2D5016',
    marginBottom: 8,
    textAlign: 'center',
  },
  fitnessInputs: {
    gap: 5,
  },
  fitnessInput: {
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    paddingVertical: 5,
    fontSize: 14,
    color: '#2D5016',
  },
  fitnessGoals: {
    marginBottom: 20,
  },
  goalsList: {
    gap: 8,
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  goalCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#4A7C59',
  },
  goalInput: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    paddingVertical: 5,
    fontSize: 14,
    color: '#2D5016',
  },
  fitnessNotes: {
    marginBottom: 20,
  },
  notesTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2D5016',
    marginBottom: 8,
  },
  notesInput: {
    backgroundColor: '#F5F7F0',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#2D5016',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  fitnessMotivation: {
    marginBottom: 20,
  },
  motivationTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2D5016',
    marginBottom: 8,
  },
  motivationInput: {
    backgroundColor: '#F5F7F0',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#2D5016',
    minHeight: 60,
    textAlignVertical: 'top',
  },
  // Estilos para Medidas Corporales - Rediseño basado en Fitness Tracker
  bodyMeasurementsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#059669',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#059669',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  bodyMeasurementsHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  bodyMeasurementsIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  bodyMeasurementsHeaderText: {
    flex: 1,
  },
  bodyMeasurementsHeaderTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  bodyMeasurementsHeaderSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 18,
  },
  bodyMeasurementsHeaderBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bodyMeasurementsSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 12,
  },
  bodyMeasurementsSummaryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bodyMeasurementsSummaryIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  bodyMeasurementsSummaryContent: {
    alignItems: 'center',
  },
  bodyMeasurementsSummaryValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#059669',
    marginBottom: 2,
  },
  bodyMeasurementsSummaryLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  dateSelectorContainer: {
    marginBottom: 20,
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: '#059669',
  },
  dateSelectorText: {
    fontSize: 16,
    color: '#059669',
    marginLeft: 10,
    flex: 1,
    fontWeight: '600',
  },
  measurementsContainer: {
    gap: 20,
  },
  measurementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15,
  },
  measurementCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  measurementCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  measurementCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 6,
    flex: 1,
  },
  measurementInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 8,
  },
  measurementInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: '#059669',
    textAlign: 'center',
  },
  measurementUnit: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
    fontWeight: '500',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  measurementGoal: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    textAlign: 'center',
  },
  additionalMeasurementsContainer: {
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
  additionalMeasurementsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#059669',
    marginBottom: 16,
  },
  additionalMeasurementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  additionalMeasurementCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  additionalMeasurementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  additionalMeasurementTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginLeft: 4,
  },
  additionalMeasurementInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  additionalMeasurementTextInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#059669',
    textAlign: 'center',
  },
  additionalMeasurementUnit: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
    fontWeight: '500',
  },
  measurementActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  saveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#059669',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    shadowColor: '#059669',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    gap: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  historyButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#059669',
    gap: 8,
  },
  historyButtonText: {
    color: '#059669',
    fontSize: 16,
    fontWeight: '600',
  },
  measurementNotes: {
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
  notesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  notesTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#059669',
    marginLeft: 8,
  },
  notesInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#374151',
    minHeight: 80,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  // Estilos para modal de fecha
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D5016',
    marginBottom: 20,
  },
  modalCloseButton: {
    backgroundColor: '#4A6741',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 20,
  },
  modalCloseButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  // Estilos para Seguimiento de Entrenamientos - Rediseño basado en Fitness Tracker
  workoutTrackerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#059669',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#059669',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  workoutTrackerHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  workoutTrackerIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  workoutTrackerHeaderText: {
    flex: 1,
  },
  workoutTrackerHeaderTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  workoutTrackerHeaderSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 18,
  },
  workoutTrackerHeaderBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  workoutTrackerSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 12,
  },
  workoutTrackerSummaryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  workoutTrackerSummaryIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  workoutTrackerSummaryContent: {
    alignItems: 'center',
  },
  workoutTrackerSummaryValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#059669',
    marginBottom: 2,
  },
  workoutTrackerSummaryLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  addWorkoutContainer: {
    marginBottom: 20,
  },
  addWorkoutButton: {
    backgroundColor: '#059669',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#059669',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  addWorkoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  weeklyWorkoutContainer: {
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
  weeklyWorkoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  weeklyWorkoutTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#059669',
  },
  viewStatsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  viewStatsText: {
    color: '#059669',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  weeklyWorkoutGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  dayWorkoutCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  dayWorkoutLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
  },
  dayWorkoutContent: {
    alignItems: 'center',
  },
  dayWorkoutTitle: {
    fontSize: 10,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
    marginTop: 4,
  },
  dayWorkoutDuration: {
    fontSize: 9,
    color: '#059669',
    marginTop: 2,
  },
  dayWorkoutCalories: {
    fontSize: 9,
    color: '#EF4444',
    marginTop: 2,
  },
  dayWorkoutPending: {
    fontSize: 9,
    color: '#6B7280',
    marginTop: 4,
  },
  workoutGoalsContainer: {
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
  workoutGoalsHeader: {
    marginBottom: 20,
  },
  workoutGoalsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#059669',
    marginBottom: 4,
  },
  workoutGoalsSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  workoutGoalsList: {
    gap: 16,
  },
  workoutGoalCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  workoutGoalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  workoutGoalIcon: {
    marginRight: 12,
  },
  workoutGoalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    flex: 1,
  },
  workoutGoalTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#6B7280',
  },
  workoutGoalProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  workoutGoalProgressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  workoutGoalProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  workoutGoalProgressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#059669',
  },
  workoutNotesContainer: {
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
  workoutNotesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  workoutNotesTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#059669',
    marginLeft: 8,
  },
  workoutNotesInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#374151',
    minHeight: 80,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  workoutAchievementsContainer: {
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
  workoutAchievementsHeader: {
    marginBottom: 20,
  },
  workoutAchievementsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#059669',
    marginBottom: 4,
  },
  workoutAchievementsSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  workoutAchievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  workoutAchievementCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  workoutAchievementCardLocked: {
    backgroundColor: '#F3F4F6',
    opacity: 0.6,
  },
  workoutAchievementIcon: {
    marginBottom: 8,
  },
  workoutAchievementEmoji: {
    fontSize: 24,
  },
  workoutAchievementEmojiLocked: {
    opacity: 0.5,
  },
  workoutAchievementContent: {
    alignItems: 'center',
  },
  workoutAchievementTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#059669',
    marginBottom: 4,
    textAlign: 'center',
  },
  workoutAchievementTitleLocked: {
    color: '#9CA3AF',
  },
  workoutAchievementDescription: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 16,
  },
  workoutAchievementDescriptionLocked: {
    color: '#9CA3AF',
  },
  // Estilos para Pérdida de Peso - Rediseño basado en Fitness Tracker
  weightLossHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#059669',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#059669',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  weightLossHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  weightLossIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  weightLossHeaderText: {
    flex: 1,
  },
  weightLossHeaderTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  weightLossHeaderSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 18,
  },
  weightLossHeaderBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  weightLossSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 12,
  },
  weightLossSummaryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  weightLossSummaryIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  weightLossSummaryContent: {
    alignItems: 'center',
  },
  weightLossSummaryValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#059669',
    marginBottom: 2,
  },
  weightLossSummaryLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  weightProgressContainer: {
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
  weightProgressHeader: {
    marginBottom: 20,
  },
  weightProgressTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#059669',
    marginBottom: 4,
  },
  weightProgressSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  weightProgressBar: {
    height: 12,
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
    marginBottom: 20,
    overflow: 'hidden',
  },
  weightProgressFill: {
    height: '100%',
    borderRadius: 6,
  },
  weightProgressStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  weightProgressStat: {
    alignItems: 'center',
  },
  weightProgressStatValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#059669',
    marginBottom: 4,
  },
  weightProgressStatLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  addWeightContainer: {
    marginBottom: 20,
  },
  addWeightButton: {
    backgroundColor: '#059669',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#059669',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  addWeightText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  weightHistoryContainer: {
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
  weightHistoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  weightHistoryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#059669',
  },
  weightHistoryList: {
    gap: 12,
  },
  weightHistoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  weightHistoryDate: {
    flex: 1,
  },
  weightHistoryDateText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  weightHistoryWeight: {
    flex: 1,
    alignItems: 'center',
  },
  weightHistoryWeightValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 2,
  },
  weightHistoryChange: {
    fontSize: 12,
    fontWeight: '500',
  },
  weightHistoryTrend: {
    marginLeft: 12,
  },
  weightGoalsContainer: {
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
  weightGoalsHeader: {
    marginBottom: 20,
  },
  weightGoalsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#059669',
    marginBottom: 4,
  },
  weightGoalsSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  weightGoalsList: {
    gap: 16,
  },
  weightGoalCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  weightGoalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  weightGoalIcon: {
    marginRight: 12,
  },
  weightGoalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    flex: 1,
  },
  weightGoalTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#6B7280',
  },
  weightGoalProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  weightGoalProgressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  weightGoalProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  weightGoalProgressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#059669',
  },
  weightNotesContainer: {
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
  weightNotesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  weightNotesTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#059669',
    marginLeft: 8,
  },
  weightNotesInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#374151',
    minHeight: 80,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  weightAchievementsContainer: {
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
  weightAchievementsHeader: {
    marginBottom: 20,
  },
  weightAchievementsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#059669',
    marginBottom: 4,
  },
  weightAchievementsSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  weightAchievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  weightAchievementCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  weightAchievementCardLocked: {
    backgroundColor: '#F3F4F6',
    opacity: 0.6,
  },
  weightAchievementIcon: {
    marginBottom: 8,
  },
  weightAchievementEmoji: {
    fontSize: 24,
  },
  weightAchievementEmojiLocked: {
    opacity: 0.5,
  },
  weightAchievementContent: {
    alignItems: 'center',
  },
  weightAchievementTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#059669',
    marginBottom: 4,
    textAlign: 'center',
  },
  weightAchievementTitleLocked: {
    color: '#9CA3AF',
  },
  weightAchievementDescription: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 16,
  },
  weightAchievementDescriptionLocked: {
    color: '#9CA3AF',
  },
  // Estilos para Seguimiento Nutricional - Rediseño basado en Fitness Tracker
  nutritionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#059669',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#059669',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  nutritionHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  nutritionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  nutritionHeaderText: {
    flex: 1,
  },
  nutritionHeaderTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  nutritionHeaderSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 18,
  },
  nutritionHeaderBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nutritionSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 12,
  },
  nutritionSummaryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  nutritionSummaryIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  nutritionSummaryContent: {
    alignItems: 'center',
  },
  nutritionSummaryValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#059669',
    marginBottom: 2,
  },
  nutritionSummaryLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  nutritionSummaryTarget: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '400',
  },
  waterProgressContainer: {
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
  waterProgressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  waterProgressIcon: {
    marginRight: 12,
  },
  waterProgressContent: {
    flex: 1,
  },
  waterProgressTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#059669',
    marginBottom: 4,
  },
  waterProgressSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  waterProgressPercentage: {
    fontSize: 16,
    fontWeight: '700',
    color: '#059669',
  },
  waterProgressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  waterProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  addMealContainer: {
    marginBottom: 20,
  },
  addMealButton: {
    backgroundColor: '#059669',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#059669',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  addMealText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  mealsContainer: {
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
  mealsHeader: {
    marginBottom: 20,
  },
  mealsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#059669',
    marginBottom: 4,
  },
  mealsSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  mealsList: {
    gap: 16,
  },
  mealCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  mealCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mealCardIcon: {
    marginRight: 12,
  },
  mealCardInfo: {
    flex: 1,
  },
  mealCardName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  mealCardCalories: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  mealCardMacros: {
    flexDirection: 'row',
    gap: 16,
  },
  macroItem: {
    alignItems: 'center',
  },
  macroValue: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  macroLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  supplementsContainer: {
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
  supplementsHeader: {
    marginBottom: 20,
  },
  supplementsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#059669',
    marginBottom: 4,
  },
  supplementsSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  supplementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  supplementCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  supplementCardTaken: {
    backgroundColor: '#F0FDF4',
    borderColor: '#059669',
  },
  supplementCardContent: {
    alignItems: 'center',
  },
  supplementName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  supplementNameTaken: {
    color: '#059669',
  },
  supplementTime: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  nutritionGoalsContainer: {
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
  nutritionGoalsHeader: {
    marginBottom: 20,
  },
  nutritionGoalsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#059669',
    marginBottom: 4,
  },
  nutritionGoalsSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  nutritionGoalsList: {
    gap: 16,
  },
  nutritionGoalCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  nutritionGoalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  nutritionGoalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    flex: 1,
  },
  nutritionGoalValues: {
    fontSize: 14,
    fontWeight: '600',
    color: '#059669',
  },
  nutritionGoalProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  nutritionGoalProgressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  nutritionGoalProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  nutritionGoalPercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: '#059669',
  },
  nutritionAchievementsContainer: {
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
  nutritionAchievementsHeader: {
    marginBottom: 20,
  },
  nutritionAchievementsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#059669',
    marginBottom: 4,
  },
  nutritionAchievementsSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  nutritionAchievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  nutritionAchievementCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  nutritionAchievementCardLocked: {
    backgroundColor: '#F3F4F6',
    opacity: 0.6,
  },
  nutritionAchievementIcon: {
    marginBottom: 8,
  },
  nutritionAchievementEmoji: {
    fontSize: 24,
  },
  nutritionAchievementEmojiLocked: {
    opacity: 0.5,
  },
  nutritionAchievementContent: {
    alignItems: 'center',
  },
  nutritionAchievementTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#059669',
    marginBottom: 4,
    textAlign: 'center',
  },
  nutritionAchievementTitleLocked: {
    color: '#9CA3AF',
  },
  nutritionAchievementDescription: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 16,
  },
  nutritionAchievementDescriptionLocked: {
    color: '#9CA3AF',
  },
});

export default HealthSections;
