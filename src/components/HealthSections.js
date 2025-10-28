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
  const renderGymRoutine = () => (
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
          <Text style={styles.sectionTitle}>Rutina de Gimnasio</Text>
          <Text style={styles.sectionSubtitle}>
            Planifica tu entrenamiento
          </Text>
        </View>
        <TouchableOpacity onPress={openAddGymModal} style={styles.addButton}>
          <Icon name="add" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.routinesContainer}>
        {gymRoutines.map((routine, index) => (
          <View key={index} style={styles.routineCard}>
            <View style={styles.routineHeader}>
              <Text style={styles.routineName}>{routine.name}</Text>
              <View style={[styles.difficultyBadge, 
                routine.difficulty === 'Principiante' && styles.difficultyBeginner,
                routine.difficulty === 'Intermedio' && styles.difficultyIntermediate,
                routine.difficulty === 'Avanzado' && styles.difficultyAdvanced
              ]}>
                <Text style={styles.difficultyText}>{routine.difficulty}</Text>
              </View>
            </View>
            
            <Text style={styles.routineDescription}>{routine.description}</Text>
            <Text style={styles.routineDuration}>Duración: {routine.duration}</Text>
            
            {routine.schedule && (
              <View style={styles.scheduleContainer}>
                <Text style={styles.scheduleTitle}>HORARIO:</Text>
                <Text style={styles.scheduleText}>
                  {routine.schedule.days.length > 0 ? routine.schedule.days.join(', ') : 'Sin días asignados'}
                  {routine.schedule.time && ` a las ${routine.schedule.time}`}
                </Text>
                <Text style={styles.scheduleFrequency}>Frecuencia: {routine.schedule.frequency}</Text>
              </View>
            )}
            
            <View style={styles.exercisesContainer}>
              <Text style={styles.exercisesTitle}>EJERCICIOS:</Text>
              {routine.exercises.map((exercise, exIndex) => (
                <View key={exIndex} style={styles.exerciseItem}>
                  <Text style={styles.exerciseName}>• {exercise.name}</Text>
                  <Text style={styles.exerciseDetails}>
                    {exercise.sets} series x {exercise.reps} repeticiones
                    {exercise.weight && ` @ ${exercise.weight}kg`}
                    {exercise.rest && ` (${exercise.rest} min descanso)`}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderSportsGoals = () => (
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
          <Text style={styles.sectionTitle}>Objetivos Deportivos</Text>
          <Text style={styles.sectionSubtitle}>
            Establece tus metas deportivas
          </Text>
        </View>
        <TouchableOpacity onPress={openAddSportsModal} style={styles.addButton}>
          <Icon name="add" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.goalsContainer}>
        {sportsGoals.map((goal, index) => (
          <View key={index} style={styles.goalCard}>
            <View style={styles.goalHeader}>
              <Text style={styles.goalSport}>{goal.sport}</Text>
              <Text style={styles.goalDate}>
                {goal.targetDate.toLocaleDateString('es-ES')}
              </Text>
            </View>
            
            <Text style={styles.goalObjective}>{goal.objective}</Text>
            
            <View style={styles.progressContainer}>
              <Text style={styles.progressLabel}>Progreso Actual:</Text>
              <Text style={styles.progressText}>{goal.currentProgress}</Text>
            </View>
            
            {goal.notes && (
              <Text style={styles.goalNotes}>Notas: {goal.notes}</Text>
            )}
          </View>
        ))}
      </View>
    </View>
  );

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
  const renderBodyMeasurements = () => (
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
          <Text style={styles.sectionTitle}>Medidas Corporales</Text>
          <Text style={styles.sectionSubtitle}>
            Registra tu progreso físico
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowMeasurementDatePicker(true)}
        >
          <Icon name="add" size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <View style={styles.measurementsContainer}>
        <View style={styles.measurementsGrid}>
          {measurementTypes.map((measurement) => (
            <View key={measurement.id} style={styles.measurementItem}>
              <Text style={styles.measurementLabel}>{measurement.name}</Text>
              <TextInput 
                style={styles.measurementInput}
                placeholder={`${measurement.unit}`}
                keyboardType="numeric"
              />
            </View>
          ))}
        </View>

        <View style={styles.measurementNotes}>
          <Text style={styles.notesTitle}>NOTAS</Text>
          <TextInput 
            style={styles.notesInput} 
            placeholder="Notas sobre tus medidas..."
            multiline
          />
        </View>
      </View>
    </View>
  );

  // Función para renderizar Seguimiento de Entrenamientos
  const renderWorkoutTracker = () => (
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
          <Text style={styles.sectionTitle}>Seguimiento de Entrenamientos</Text>
          <Text style={styles.sectionSubtitle}>
            Registra tus entrenamientos
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowAddWorkoutModal(true)}
        >
          <Icon name="add" size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <View style={styles.workoutContainer}>
        <View style={styles.workoutHeader}>
          <Text style={styles.workoutDate}>Fecha de Inicio:</Text>
          <Text style={styles.workoutDate}>Fecha de Vencimiento:</Text>
        </View>

        <View style={styles.workoutGoals}>
          <Text style={styles.goalsTitle}>OBJETIVOS</Text>
          <View style={styles.goalsGrid}>
            {[1, 2, 3].map((goal, index) => (
              <View key={index} style={styles.workoutGoalCard}>
                <Text style={styles.goalCardTitle}>OBJETIVO {goal}</Text>
                <TextInput 
                  style={styles.goalCardInput} 
                  placeholder="Describe tu objetivo..."
                  multiline
                />
                <Text style={styles.actionStepsTitle}>PASOS DE ACCIÓN</Text>
                {[1, 2, 3].map((step, stepIndex) => (
                  <View key={stepIndex} style={styles.actionStep}>
                    <View style={styles.actionCheckbox} />
                    <TextInput 
                      style={styles.actionInput} 
                      placeholder="Paso de acción..."
                    />
                  </View>
                ))}
              </View>
            ))}
          </View>
        </View>

        <View style={styles.workoutNotes}>
          <Text style={styles.notesTitle}>NOTAS</Text>
          <TextInput 
            style={styles.notesInput} 
            placeholder="Notas sobre tu entrenamiento..."
            multiline
          />
        </View>
      </View>
    </View>
  );

  // Función para renderizar Pérdida de Peso
  const renderWeightLossTracker = () => (
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
          <Text style={styles.sectionTitle}>Pérdida de Peso</Text>
          <Text style={styles.sectionSubtitle}>
            Controla tu peso y objetivos
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowAddWeightGoalModal(true)}
        >
          <Icon name="add" size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <View style={styles.weightLossContainer}>
        <View style={styles.weightLossGrid}>
          {Array.from({length: 70}, (_, i) => i + 1).map((number) => (
            <TouchableOpacity key={number} style={styles.weightLossHeart}>
              <Text style={styles.weightLossNumber}>{number}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.weightLossLabel}>LIBRAS PERDIDAS/GANADAS</Text>

        <TouchableOpacity style={styles.getNowButton}>
          <Text style={styles.getNowText}>Obtener ahora</Text>
          <Icon name="arrow-forward" size={20} color="#000000" />
        </TouchableOpacity>

        <Text style={styles.priceText}>$95.00</Text>
      </View>
    </View>
  );

  // Función para renderizar Seguimiento Nutricional
  const renderNutritionTracker = () => (
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
          <Text style={styles.sectionTitle}>Seguimiento Nutricional</Text>
          <Text style={styles.sectionSubtitle}>
            Monitorea tu alimentación
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowNutritionDatePicker(true)}
        >
          <Icon name="add" size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <View style={styles.nutritionContainer}>
        <View style={styles.nutritionMeals}>
          <View style={styles.mealSection}>
            <Text style={styles.mealTitle}>DESAYUNO</Text>
            <View style={styles.nutritionInputs}>
              <TextInput style={styles.nutritionInput} placeholder="Calorías" />
              <TextInput style={styles.nutritionInput} placeholder="Proteína" />
              <TextInput style={styles.nutritionInput} placeholder="Carbohidratos" />
              <TextInput style={styles.nutritionInput} placeholder="Grasas" />
            </View>
          </View>

          <View style={styles.mealSection}>
            <Text style={styles.mealTitle}>ALMUERZO</Text>
            <View style={styles.nutritionInputs}>
              <TextInput style={styles.nutritionInput} placeholder="Calorías" />
              <TextInput style={styles.nutritionInput} placeholder="Proteína" />
              <TextInput style={styles.nutritionInput} placeholder="Carbohidratos" />
              <TextInput style={styles.nutritionInput} placeholder="Grasas" />
            </View>
          </View>

          <View style={styles.mealSection}>
            <Text style={styles.mealTitle}>CENA</Text>
            <View style={styles.nutritionInputs}>
              <TextInput style={styles.nutritionInput} placeholder="Calorías" />
              <TextInput style={styles.nutritionInput} placeholder="Proteína" />
              <TextInput style={styles.nutritionInput} placeholder="Carbohidratos" />
              <TextInput style={styles.nutritionInput} placeholder="Grasas" />
            </View>
          </View>

          <View style={styles.mealSection}>
            <Text style={styles.mealTitle}>SNACKS</Text>
            <View style={styles.nutritionInputs}>
              <TextInput style={styles.nutritionInput} placeholder="Calorías" />
              <TextInput style={styles.nutritionInput} placeholder="Proteína" />
              <TextInput style={styles.nutritionInput} placeholder="Carbohidratos" />
              <TextInput style={styles.nutritionInput} placeholder="Grasas" />
            </View>
          </View>
        </View>

        <View style={styles.supplementsSection}>
          <Text style={styles.supplementsTitle}>SUPLEMENTOS</Text>
          <View style={styles.supplementsGrid}>
            {supplements.map((supplement, index) => (
              <TouchableOpacity key={index} style={styles.supplementButton}>
                <Text style={styles.supplementText}>{supplement}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.waterSection}>
          <Text style={styles.waterTitle}>AGUA</Text>
          <TextInput 
            style={styles.waterInput} 
            placeholder="Litros consumidos"
            keyboardType="numeric"
          />
        </View>
      </View>
    </View>
  );

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
  // Estilos para ejercicio
  routinesContainer: {
    gap: 16,
  },
  routineCard: {
    backgroundColor: '#F5F7F0',
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#4A7C59',
  },
  routineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  routineName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D5016',
    flex: 1,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyBeginner: {
    backgroundColor: '#28a745',
  },
  difficultyIntermediate: {
    backgroundColor: '#ffc107',
  },
  difficultyAdvanced: {
    backgroundColor: '#dc3545',
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  routineDescription: {
    fontSize: 14,
    color: '#4A6741',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  routineDuration: {
    fontSize: 12,
    color: '#4A7C59',
    fontWeight: '600',
    marginBottom: 12,
  },
  exercisesContainer: {
    gap: 8,
  },
  exercisesTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2D5016',
    marginBottom: 4,
  },
  exerciseItem: {
    backgroundColor: '#F8FAF6',
    padding: 8,
    borderRadius: 4,
    borderLeftWidth: 2,
    borderLeftColor: '#4A7C59',
  },
  exerciseName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D5016',
    marginBottom: 2,
  },
  exerciseDetails: {
    fontSize: 12,
    color: '#4A6741',
  },
  goalsContainer: {
    gap: 16,
  },
  goalCard: {
    backgroundColor: '#F5F7F0',
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FF8C42',
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalSport: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D5016',
    flex: 1,
  },
  goalDate: {
    fontSize: 12,
    color: '#4A6741',
    backgroundColor: '#e9ecef',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  goalObjective: {
    fontSize: 14,
    color: '#2D5016',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  progressContainer: {
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FF8C42',
    marginBottom: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#2D5016',
  },
  goalNotes: {
    fontSize: 12,
    color: '#4A6741',
    fontStyle: 'italic',
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
  // Estilos para Medidas Corporales
  measurementsContainer: {
    gap: 20,
  },
  measurementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15,
  },
  measurementItem: {
    width: '48%',
  },
  measurementLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D5016',
    marginBottom: 5,
  },
  measurementInput: {
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    paddingVertical: 8,
    fontSize: 16,
    color: '#2D5016',
    textAlign: 'center',
  },
  measurementNotes: {
    marginTop: 20,
  },
  // Estilos para Seguimiento de Entrenamientos
  workoutContainer: {
    gap: 20,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  workoutDate: {
    fontSize: 14,
    color: '#4A6741',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    paddingBottom: 5,
    minWidth: 120,
  },
  workoutGoals: {
    gap: 15,
  },
  goalsGrid: {
    gap: 15,
  },
  workoutGoalCard: {
    backgroundColor: '#F5F7F0',
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  goalCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D5016',
    marginBottom: 10,
  },
  goalCardInput: {
    backgroundColor: '#F8FAF6',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    color: '#2D5016',
    minHeight: 60,
    textAlignVertical: 'top',
    marginBottom: 15,
  },
  actionStepsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2D5016',
    marginBottom: 10,
  },
  actionStep: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  actionCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#4A7C59',
  },
  actionInput: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    paddingVertical: 5,
    fontSize: 14,
    color: '#2D5016',
  },
  workoutNotes: {
    marginTop: 20,
  },
  // Estilos para Pérdida de Peso
  weightLossContainer: {
    alignItems: 'center',
    gap: 20,
  },
  weightLossGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    maxWidth: 350,
  },
  weightLossHeart: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: '#ffb3ba',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ff9aa2',
  },
  weightLossNumber: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  weightLossLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D5016',
    textAlign: 'center',
  },
  getNowButton: {
    backgroundColor: '#ff6b6b',
    borderRadius: 25,
    paddingHorizontal: 30,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#ff6b6b',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  getNowText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  priceText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#28a745',
    backgroundColor: '#d4edda',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  // Estilos para Seguimiento Nutricional
  nutritionContainer: {
    gap: 20,
  },
  nutritionMeals: {
    gap: 15,
  },
  mealSection: {
    backgroundColor: '#F5F7F0',
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  mealTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D5016',
    marginBottom: 10,
  },
  nutritionInputs: {
    flexDirection: 'row',
    gap: 10,
  },
  nutritionInput: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    paddingVertical: 8,
    fontSize: 14,
    color: '#2D5016',
    textAlign: 'center',
  },
  supplementsSection: {
    gap: 10,
  },
  supplementsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D5016',
  },
  supplementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  supplementButton: {
    backgroundColor: '#e9ecef',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  supplementText: {
    fontSize: 12,
    color: '#495057',
    fontWeight: '500',
  },
  waterSection: {
    gap: 10,
  },
  waterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D5016',
  },
  waterInput: {
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    paddingVertical: 10,
    fontSize: 16,
    color: '#2D5016',
    textAlign: 'center',
  },
});

export default HealthSections;
