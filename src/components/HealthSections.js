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
import { SubsectionTabs } from './shared';

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
  const renderMealPlanner = () => (
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
          <Text style={styles.sectionTitle}>Planificador de Comidas</Text>
          <Text style={styles.sectionSubtitle}>
            Organiza tu alimentación saludable
          </Text>
        </View>
        <TouchableOpacity onPress={openAddMealModal} style={styles.addButton}>
          <Icon name="add" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      {/* Resumen Nutricional */}
      <View style={styles.nutritionSummary}>
        <View style={styles.nutritionSummaryCard}>
          <View style={styles.nutritionSummaryIcon}>
            <Icon name="restaurant" size={20} color="#4A6B8A" />
          </View>
          <View style={styles.nutritionSummaryContent}>
            <Text style={styles.nutritionSummaryTitle}>Comidas Planificadas</Text>
            <Text style={styles.nutritionSummaryValue}>3/3</Text>
          </View>
        </View>
        
        <View style={styles.nutritionSummaryCard}>
          <View style={styles.nutritionSummaryIcon}>
            <Icon name="water" size={20} color="#4A90E2" />
          </View>
          <View style={styles.nutritionSummaryContent}>
            <Text style={styles.nutritionSummaryTitle}>Hidratación</Text>
            <Text style={styles.nutritionSummaryValue}>
              {mealPlans[new Date().toISOString().split('T')[0]]?.waterGlasses || 0}/8 vasos
            </Text>
          </View>
        </View>
        
        <View style={styles.nutritionSummaryCard}>
          <View style={styles.nutritionSummaryIcon}>
            <Icon name="fitness" size={20} color="#10B981" />
          </View>
          <View style={styles.nutritionSummaryContent}>
            <Text style={styles.nutritionSummaryTitle}>Calorías</Text>
            <Text style={styles.nutritionSummaryValue}>1,850 kcal</Text>
          </View>
        </View>
      </View>
      
      {/* Plan de Comidas del Día */}
      <View style={styles.dailyMealPlan}>
        <View style={styles.dailyMealHeader}>
          <View style={styles.dailyMealTitleContainer}>
            <Icon name="calendar" size={18} color="#4A6B8A" />
            <Text style={styles.dailyMealTitle}>Plan de Hoy</Text>
          </View>
          <Text style={styles.dailyMealDate}>
            {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
          </Text>
        </View>
        
        <View style={styles.mealsContainer}>
          {/* Desayuno */}
          <View style={styles.mealCard}>
            <View style={styles.mealCardHeader}>
              <View style={styles.mealCardIcon}>
                <Icon name="sunny" size={20} color="#F59E0B" />
              </View>
              <View style={styles.mealCardContent}>
                <Text style={styles.mealCardTitle}>Desayuno</Text>
                <Text style={styles.mealCardTime}>7:00 - 9:00 AM</Text>
              </View>
              <TouchableOpacity style={styles.mealActionButton}>
                <Icon name="add" size={16} color="#4A6B8A" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.mealCardBody}>
              {mealPlans[new Date().toISOString().split('T')[0]]?.breakfast ? (
                <View style={styles.mealContent}>
                  <Text style={styles.mealContentText}>
                    {mealPlans[new Date().toISOString().split('T')[0]].breakfast}
                  </Text>
                  <View style={styles.mealContentActions}>
                    <TouchableOpacity style={styles.mealContentAction}>
                      <Icon name="create" size={14} color="#4A6B8A" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.mealContentAction}>
                      <Icon name="trash" size={14} color="#DC2626" />
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={styles.emptyMealState}>
                  <Icon name="restaurant-outline" size={24} color="#9CA3AF" />
                  <Text style={styles.emptyMealText}>No planificado</Text>
                  <TouchableOpacity style={styles.addMealButton}>
                    <Icon name="add-circle" size={16} color="#4A6B8A" />
                    <Text style={styles.addMealButtonText}>Agregar</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
          
          {/* Comida */}
          <View style={styles.mealCard}>
            <View style={styles.mealCardHeader}>
              <View style={styles.mealCardIcon}>
                <Icon name="sunny" size={20} color="#F59E0B" />
              </View>
              <View style={styles.mealCardContent}>
                <Text style={styles.mealCardTitle}>Comida</Text>
                <Text style={styles.mealCardTime}>12:00 - 2:00 PM</Text>
              </View>
              <TouchableOpacity style={styles.mealActionButton}>
                <Icon name="add" size={16} color="#4A6B8A" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.mealCardBody}>
              {mealPlans[new Date().toISOString().split('T')[0]]?.lunch ? (
                <View style={styles.mealContent}>
                  <Text style={styles.mealContentText}>
                    {mealPlans[new Date().toISOString().split('T')[0]].lunch}
                  </Text>
                  <View style={styles.mealContentActions}>
                    <TouchableOpacity style={styles.mealContentAction}>
                      <Icon name="create" size={14} color="#4A6B8A" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.mealContentAction}>
                      <Icon name="trash" size={14} color="#DC2626" />
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={styles.emptyMealState}>
                  <Icon name="restaurant-outline" size={24} color="#9CA3AF" />
                  <Text style={styles.emptyMealText}>No planificado</Text>
                  <TouchableOpacity style={styles.addMealButton}>
                    <Icon name="add-circle" size={16} color="#4A6B8A" />
                    <Text style={styles.addMealButtonText}>Agregar</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
          
          {/* Cena */}
          <View style={styles.mealCard}>
            <View style={styles.mealCardHeader}>
              <View style={styles.mealCardIcon}>
                <Icon name="moon" size={20} color="#8B5CF6" />
              </View>
              <View style={styles.mealCardContent}>
                <Text style={styles.mealCardTitle}>Cena</Text>
                <Text style={styles.mealCardTime}>7:00 - 9:00 PM</Text>
              </View>
              <TouchableOpacity style={styles.mealActionButton}>
                <Icon name="add" size={16} color="#4A6B8A" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.mealCardBody}>
              {mealPlans[new Date().toISOString().split('T')[0]]?.dinner ? (
                <View style={styles.mealContent}>
                  <Text style={styles.mealContentText}>
                    {mealPlans[new Date().toISOString().split('T')[0]].dinner}
                  </Text>
                  <View style={styles.mealContentActions}>
                    <TouchableOpacity style={styles.mealContentAction}>
                      <Icon name="create" size={14} color="#4A6B8A" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.mealContentAction}>
                      <Icon name="trash" size={14} color="#DC2626" />
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={styles.emptyMealState}>
                  <Icon name="restaurant-outline" size={24} color="#9CA3AF" />
                  <Text style={styles.emptyMealText}>No planificado</Text>
                  <TouchableOpacity style={styles.addMealButton}>
                    <Icon name="add-circle" size={16} color="#4A6B8A" />
                    <Text style={styles.addMealButtonText}>Agregar</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
      
      {/* Seguimiento de Hidratación */}
      <View style={styles.waterTrackingSection}>
        <View style={styles.waterTrackingHeader}>
          <View style={styles.waterTrackingTitleContainer}>
            <Icon name="water" size={18} color="#4A90E2" />
            <Text style={styles.waterTrackingTitle}>Seguimiento de Hidratación</Text>
          </View>
          <Text style={styles.waterTrackingSubtitle}>
            Meta: 8 vasos de agua al día
          </Text>
        </View>
        
        <View style={styles.waterGlassesGrid}>
          {Array.from({length: 8}, (_, index) => (
            <TouchableOpacity 
              key={index} 
              style={[
                styles.waterGlassCard, 
                index < (mealPlans[new Date().toISOString().split('T')[0]]?.waterGlasses || 0) && styles.waterGlassCardFilled
              ]}
              onPress={() => toggleWaterGlass(index + 1)}
            >
              <Icon 
                name="water" 
                size={24} 
                color={index < (mealPlans[new Date().toISOString().split('T')[0]]?.waterGlasses || 0) ? "#4A90E2" : "#D1D5DB"} 
              />
              <Text style={[
                styles.waterGlassNumber,
                index < (mealPlans[new Date().toISOString().split('T')[0]]?.waterGlasses || 0) && styles.waterGlassNumberFilled
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
                { width: `${((mealPlans[new Date().toISOString().split('T')[0]]?.waterGlasses || 0) / 8) * 100}%` }
              ]}
            />
          </View>
          <Text style={styles.waterProgressText}>
            {mealPlans[new Date().toISOString().split('T')[0]]?.waterGlasses || 0} de 8 vasos completados
          </Text>
        </View>
      </View>
      
      {/* Accesos Rápidos */}
      <View style={styles.quickAccessContainer}>
        <Text style={styles.quickAccessTitle}>Accesos Rápidos</Text>
        <View style={styles.quickAccessGrid}>
          <TouchableOpacity style={styles.quickAccessCard}>
            <View style={styles.quickAccessIcon}>
              <Icon name="restaurant" size={24} color="#4A6B8A" />
            </View>
            <Text style={styles.quickAccessText}>Recetas</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickAccessCard}>
            <View style={styles.quickAccessIcon}>
              <Icon name="list" size={24} color="#10B981" />
            </View>
            <Text style={styles.quickAccessText}>Lista de Compras</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickAccessCard}>
            <View style={styles.quickAccessIcon}>
              <Icon name="analytics" size={24} color="#F59E0B" />
            </View>
            <Text style={styles.quickAccessText}>Nutrición</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickAccessCard}>
            <View style={styles.quickAccessIcon}>
              <Icon name="calendar" size={24} color="#8B5CF6" />
            </View>
            <Text style={styles.quickAccessText}>Plan Semanal</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

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

  const renderRecipes = () => (
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
          <Text style={styles.sectionTitle}>Recetas</Text>
          <Text style={styles.sectionSubtitle}>
            Descubre recetas saludables
          </Text>
        </View>
        <TouchableOpacity onPress={openAddRecipeModal} style={styles.addButton}>
          <Icon name="add" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.recipesContainer}>
        {recipes.map((recipe, index) => (
          <View key={index} style={styles.recipeCard}>
            <Text style={styles.recipeName}>{recipe.name}</Text>
            <Text style={styles.recipeIngredients}>Ingredientes: {recipe.ingredients}</Text>
            <Text style={styles.recipeInstructions}>Instrucciones: {recipe.instructions}</Text>
          </View>
        ))}
      </View>
    </View>
  );

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
  const renderFitnessTracker = () => (
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
          <Text style={styles.sectionTitle}>Seguimiento de Fitness</Text>
          <Text style={styles.sectionSubtitle}>
            Registra tu actividad física
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowFitnessDatePicker(true)}
        >
          <Icon name="add" size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <View style={styles.fitnessGrid}>
        <View style={styles.fitnessColumn}>
          <Text style={styles.dayLabel}>LUNES</Text>
          <View style={styles.fitnessInputs}>
            <TextInput style={styles.fitnessInput} placeholder="Calorías in" />
            <TextInput style={styles.fitnessInput} placeholder="Calorías out" />
            <TextInput style={styles.fitnessInput} placeholder="Agua" />
          </View>
        </View>

        <View style={styles.fitnessColumn}>
          <Text style={styles.dayLabel}>MARTES</Text>
          <View style={styles.fitnessInputs}>
            <TextInput style={styles.fitnessInput} placeholder="Calorías in" />
            <TextInput style={styles.fitnessInput} placeholder="Calorías out" />
            <TextInput style={styles.fitnessInput} placeholder="Agua" />
          </View>
        </View>

        <View style={styles.fitnessColumn}>
          <Text style={styles.dayLabel}>MIÉRCOLES</Text>
          <View style={styles.fitnessInputs}>
            <TextInput style={styles.fitnessInput} placeholder="Calorías in" />
            <TextInput style={styles.fitnessInput} placeholder="Calorías out" />
            <TextInput style={styles.fitnessInput} placeholder="Agua" />
          </View>
        </View>

        <View style={styles.fitnessColumn}>
          <Text style={styles.dayLabel}>JUEVES</Text>
          <View style={styles.fitnessInputs}>
            <TextInput style={styles.fitnessInput} placeholder="Calorías in" />
            <TextInput style={styles.fitnessInput} placeholder="Calorías out" />
            <TextInput style={styles.fitnessInput} placeholder="Agua" />
          </View>
        </View>

        <View style={styles.fitnessColumn}>
          <Text style={styles.dayLabel}>VIERNES</Text>
          <View style={styles.fitnessInputs}>
            <TextInput style={styles.fitnessInput} placeholder="Calorías in" />
            <TextInput style={styles.fitnessInput} placeholder="Calorías out" />
            <TextInput style={styles.fitnessInput} placeholder="Agua" />
          </View>
        </View>

        <View style={styles.fitnessColumn}>
          <Text style={styles.dayLabel}>SÁBADO</Text>
          <View style={styles.fitnessInputs}>
            <TextInput style={styles.fitnessInput} placeholder="Calorías in" />
            <TextInput style={styles.fitnessInput} placeholder="Calorías out" />
            <TextInput style={styles.fitnessInput} placeholder="Agua" />
          </View>
        </View>

        <View style={styles.fitnessColumn}>
          <Text style={styles.dayLabel}>DOMINGO</Text>
          <View style={styles.fitnessInputs}>
            <TextInput style={styles.fitnessInput} placeholder="Calorías in" />
            <TextInput style={styles.fitnessInput} placeholder="Calorías out" />
            <TextInput style={styles.fitnessInput} placeholder="Agua" />
          </View>
        </View>
      </View>

      <View style={styles.fitnessGoals}>
        <Text style={styles.goalsTitle}>OBJETIVOS</Text>
        <View style={styles.goalsList}>
          {[1, 2, 3, 4, 5].map((goal, index) => (
            <View key={index} style={styles.goalItem}>
              <View style={styles.goalCheckbox} />
              <TextInput style={styles.goalInput} placeholder="Objetivo..." />
            </View>
          ))}
        </View>
      </View>

      <View style={styles.fitnessNotes}>
        <Text style={styles.notesTitle}>ENFOQUE</Text>
        <TextInput 
          style={styles.notesInput} 
          placeholder="¿En qué te enfocarás esta semana?"
          multiline
        />
      </View>

      <View style={styles.fitnessMotivation}>
        <Text style={styles.motivationTitle}>MOTIVACIÓN</Text>
        <TextInput 
          style={styles.motivationInput} 
          placeholder="Tu motivación..."
          multiline
        />
      </View>
    </View>
  );

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
      <SubsectionTabs
        sections={sections}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        theme="mountain"
        size="medium"
        showIcons={true}
        showLabels={true}
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
  nutritionSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  nutritionSummaryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
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
  nutritionSummaryIcon: {
    marginBottom: 8,
  },
  nutritionSummaryContent: {
    alignItems: 'center',
  },
  nutritionSummaryTitle: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
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
