import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';

const NutritionSections = () => {
  const [activeSection, setActiveSection] = useState('meal-planner');
  const [mealPlan, setMealPlan] = useState({
    breakfast: '',
    lunch: '',
    dinner: ''
  });
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
  const [recipes, setRecipes] = useState([]);
  const [nutritionNotes, setNutritionNotes] = useState('');
  const [showAddRecipeModal, setShowAddRecipeModal] = useState(false);
  const [newRecipe, setNewRecipe] = useState({
    name: '',
    ingredients: '',
    instructions: ''
  });
  
  // Estados para el planificador semanal
  const [weeklyMealPlans, setWeeklyMealPlans] = useState({});
  const [showMealPlanModal, setShowMealPlanModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [newMealPlan, setNewMealPlan] = useState({
    breakfast: '',
    lunch: '',
    dinner: ''
  });
  
  // Estados para el modal de agregar artículo
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [newItemText, setNewItemText] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState(1);
  const [newItemUnit, setNewItemUnit] = useState('unidad');

  const sections = [
    { id: 'meal-planner', name: 'Planificador de Comidas', icon: 'calendar-outline' },
    { id: 'market-list', name: 'Lista de Compras', icon: 'list-outline' },
    { id: 'recipes', name: 'Recetas', icon: 'book-outline' },
    { id: 'notes', name: 'Notas Nutricionales', icon: 'document-text-outline' }
  ];

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
      setRecipes([...recipes, { 
        id: Date.now(), 
        name: newRecipe.name.trim(),
        ingredients: newRecipe.ingredients.trim(),
        instructions: newRecipe.instructions.trim()
      }]);
      closeAddRecipeModal();
    }
  };

  // Funciones para el planificador semanal
  const openMealPlanModal = () => {
    setNewMealPlan({ breakfast: '', lunch: '', dinner: '' });
    setSelectedDate(new Date());
    setShowMealPlanModal(true);
  };

  const closeMealPlanModal = () => {
    setShowMealPlanModal(false);
    setNewMealPlan({ breakfast: '', lunch: '', dinner: '' });
  };

  const handleDateChange = (event, date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
    }
  };

  const saveMealPlan = () => {
    if (!newMealPlan.breakfast.trim() && !newMealPlan.lunch.trim() && !newMealPlan.dinner.trim()) {
      Alert.alert('Error', 'Por favor ingresa al menos una comida');
      return;
    }

    const dateKey = selectedDate.toDateString();
    setWeeklyMealPlans({
      ...weeklyMealPlans,
      [dateKey]: {
        date: selectedDate,
        breakfast: newMealPlan.breakfast.trim(),
        lunch: newMealPlan.lunch.trim(),
        dinner: newMealPlan.dinner.trim()
      }
    });

    closeMealPlanModal();
    Alert.alert('Éxito', 'Plan de comidas guardado correctamente');
  };

  const getMealPlanForDate = (date) => {
    const dateKey = date.toDateString();
    return weeklyMealPlans[dateKey] || null;
  };

  // Funciones para el modal de agregar artículo
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
        id: Date.now(), // ID único basado en timestamp
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

  const mealCategories = [
    { id: 'fruits', name: 'FRUTAS', color: '#FF6B6B' },
    { id: 'vegetables', name: 'VERDURAS', color: '#4ECDC4' },
    { id: 'dairy', name: 'LÁCTEOS', color: '#45B7D1' },
    { id: 'meat', name: 'CARNES/AVES/PESCADO', color: '#96CEB4' },
    { id: 'bread', name: 'PANADERÍA', color: '#FFEAA7' },
    { id: 'frozen', name: 'CONGELADOS', color: '#DDA0DD' },
    { id: 'spices', name: 'ESPECIAS/CONDIMENTOS', color: '#FFA07A' },
    { id: 'canned', name: 'ENLATADOS', color: '#98FB98' },
    { id: 'beverages', name: 'BEBIDAS', color: '#F0E68C' }
  ];

  const quantityUnits = [
    'unidad', 'kg', 'g', 'litro', 'ml', 'paquete', 'lata', 'botella', 'caja', 'bolsa'
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
              size={20} 
              color={activeSection === section.id ? '#FFFFFF' : '#6c757d'} 
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderMealPlanner = () => {
    const today = new Date();
    const todayMealPlan = getMealPlanForDate(today);
    
    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>PLANIFICADOR DE COMIDAS</Text>
          <TouchableOpacity onPress={openMealPlanModal} style={styles.addButton}>
            <Icon name="add" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.mealPlannerContainer}>
          {todayMealPlan ? (
            <>
              <View style={styles.mealCard}>
                <View style={styles.mealHeader}>
                  <Icon name="sunny" size={20} color="#FFA500" />
                  <Text style={styles.mealTitle}>DESAYUNO</Text>
                </View>
                <Text style={styles.mealDisplayText}>
                  {todayMealPlan.breakfast || 'No planificado'}
                </Text>
              </View>

              <View style={styles.mealCard}>
                <View style={styles.mealHeader}>
                  <Icon name="partly-sunny" size={20} color="#FFD700" />
                  <Text style={styles.mealTitle}>COMIDA</Text>
                </View>
                <Text style={styles.mealDisplayText}>
                  {todayMealPlan.lunch || 'No planificado'}
                </Text>
              </View>

              <View style={styles.mealCard}>
                <View style={styles.mealHeader}>
                  <Icon name="moon" size={20} color="#4169E1" />
                  <Text style={styles.mealTitle}>CENA</Text>
                </View>
                <Text style={styles.mealDisplayText}>
                  {todayMealPlan.dinner || 'No planificado'}
                </Text>
              </View>
            </>
          ) : (
            <View style={styles.emptyMealState}>
              <Icon name="restaurant-outline" size={64} color="#dee2e6" />
              <Text style={styles.emptyMealText}>No hay plan de comidas para hoy</Text>
              <Text style={styles.emptyMealSubtext}>Toca el botón + para planificar tus comidas</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderMarketList = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>LISTA DE COMPRAS</Text>
        <Icon name="list" size={16} color="#45B7D1" />
      </View>
      
      <View style={styles.marketListContainer}>
        {mealCategories.map((category) => (
          <View key={category.id} style={styles.categoryCard}>
            <View style={[styles.categoryHeader, { borderLeftColor: category.color }]}>
              <Text style={styles.categoryName}>{category.name}</Text>
            </View>
            <View style={styles.itemsContainer}>
              {marketList[category.id].map((item) => (
                <View key={item.id} style={[styles.itemRow, item.purchased && styles.itemRowPurchased]}>
                  <TouchableOpacity
                    onPress={() => toggleItemPurchased(category.id, item.id)}
                    style={styles.checkboxContainer}
                  >
                    <Icon 
                      name={item.purchased ? "checkbox" : "square-outline"} 
                      size={20} 
                      color={item.purchased ? "#28a745" : "#6c757d"} 
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
              <TouchableOpacity
                style={styles.addItemButton}
                onPress={() => openAddItemModal(category.id)}
              >
                <Icon name="add" size={16} color="#45B7D1" />
                <Text style={styles.addItemText}>Agregar artículo</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderRecipes = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>RECETAS</Text>
        <TouchableOpacity 
          onPress={openAddRecipeModal}
          style={styles.addButton}
        >
          <Icon name="add" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      {recipes.length === 0 ? (
        <View style={styles.emptyState}>
          <Icon name="book-outline" size={64} color="#dee2e6" />
          <Text style={styles.emptyText}>No hay recetas guardadas</Text>
          <Text style={styles.emptySubtext}>Toca el botón + para agregar tu primera receta</Text>
        </View>
      ) : (
        <View style={styles.recipesContainer}>
          {recipes.map((recipe) => (
            <View key={recipe.id} style={styles.recipeCard}>
              <View style={styles.recipeHeader}>
                <Text style={styles.recipeName}>{recipe.name}</Text>
                <TouchableOpacity
                  onPress={() => {
                    setRecipes(recipes.filter(r => r.id !== recipe.id));
                  }}
                  style={styles.deleteButton}
                >
                  <Icon name="trash" size={16} color="#dc3545" />
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.recipeInput}
                value={recipe.ingredients}
                onChangeText={(text) => {
                  const newRecipes = recipes.map(r => 
                    r.id === recipe.id ? { ...r, ingredients: text } : r
                  );
                  setRecipes(newRecipes);
                }}
                placeholder="Ingredientes..."
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
              <TextInput
                style={styles.recipeInput}
                value={recipe.instructions}
                onChangeText={(text) => {
                  const newRecipes = recipes.map(r => 
                    r.id === recipe.id ? { ...r, instructions: text } : r
                  );
                  setRecipes(newRecipes);
                }}
                placeholder="Instrucciones..."
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          ))}
        </View>
      )}
    </View>
  );

  const renderNotes = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>NOTAS NUTRICIONALES</Text>
        <Icon name="document-text" size={16} color="#45B7D1" />
      </View>
      
      <View style={styles.notesContainer}>
        <TextInput
          style={styles.notesInput}
          value={nutritionNotes}
          onChangeText={setNutritionNotes}
          placeholder="Escribe tus notas sobre nutrición, objetivos de salud, alergias, preferencias alimentarias, etc..."
          multiline
          numberOfLines={15}
          textAlignVertical="top"
        />
      </View>
    </View>
  );

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'meal-planner':
        return renderMealPlanner();
      case 'market-list':
        return renderMarketList();
      case 'recipes':
        return renderRecipes();
      case 'notes':
        return renderNotes();
      default:
        return renderMealPlanner();
    }
  };

  return (
    <View style={styles.container}>
      {renderSectionTabs()}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderActiveSection()}
      </ScrollView>

      {/* Modal para agregar artículo a la lista de compras */}
      <Modal
        visible={showAddItemModal}
        transparent={true}
        animationType="fade"
        onRequestClose={closeAddItemModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.addItemModalContainer}>
            <View style={styles.addItemModalHeader}>
              <Text style={styles.addItemModalTitle}>
                Agregar a {mealCategories.find(cat => cat.id === selectedCategory)?.name}
              </Text>
              <TouchableOpacity onPress={closeAddItemModal} style={styles.closeModalButton}>
                <Icon name="close" size={24} color="#6c757d" />
              </TouchableOpacity>
            </View>

            <View style={styles.addItemModalContent}>
              <Text style={styles.addItemInputLabel}>Ingresa el artículo:</Text>
              <TextInput
                style={styles.addItemInput}
                value={newItemText}
                onChangeText={setNewItemText}
                placeholder="Ej: Manzanas, Leche, Pan..."
                autoFocus={true}
                returnKeyType="done"
                onSubmitEditing={addItem}
              />
              
              <Text style={styles.addItemInputLabel}>Cantidad:</Text>
              <View style={styles.quantityContainer}>
                <TouchableOpacity 
                  style={styles.quantityButton}
                  onPress={decrementQuantity}
                  disabled={newItemQuantity <= 1}
                >
                  <Icon name="remove" size={20} color={newItemQuantity <= 1 ? "#ccc" : "#45B7D1"} />
                </TouchableOpacity>
                
                <View style={styles.quantityDisplay}>
                  <Text style={styles.quantityText}>{newItemQuantity}</Text>
                </View>
                
                <TouchableOpacity 
                  style={styles.quantityButton}
                  onPress={incrementQuantity}
                >
                  <Icon name="add" size={20} color="#45B7D1" />
                </TouchableOpacity>
              </View>

              <Text style={styles.addItemInputLabel}>Unidad:</Text>
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

            <View style={styles.addItemModalActions}>
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

      {/* Modal para planificar comidas */}
      <Modal
        visible={showMealPlanModal}
        transparent={true}
        animationType="fade"
        onRequestClose={closeMealPlanModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.mealPlanModalContainer}>
            <View style={styles.mealPlanModalHeader}>
              <Text style={styles.mealPlanModalTitle}>Planificar Comidas</Text>
              <TouchableOpacity onPress={closeMealPlanModal} style={styles.closeModalButton}>
                <Icon name="close" size={24} color="#6c757d" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.mealPlanModalContent} showsVerticalScrollIndicator={false}>
              {/* Selección de Fecha */}
              <View style={styles.mealPlanInputGroup}>
                <Text style={styles.mealPlanInputLabel}>Fecha</Text>
                <TouchableOpacity 
                  style={styles.dateButton}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Icon name="calendar-outline" size={20} color="#45B7D1" />
                  <Text style={styles.dateButtonText}>
                    {selectedDate.toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })}
                  </Text>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                  />
                )}
              </View>

              {/* Desayuno */}
              <View style={styles.mealPlanInputGroup}>
                <View style={styles.mealPlanMealHeader}>
                  <Icon name="sunny" size={20} color="#FFA500" />
                  <Text style={styles.mealPlanMealTitle}>DESAYUNO</Text>
                </View>
                <TextInput
                  style={styles.mealPlanTextArea}
                  value={newMealPlan.breakfast}
                  onChangeText={(text) => setNewMealPlan({...newMealPlan, breakfast: text})}
                  placeholder="¿Qué vas a desayunar?"
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>

              {/* Comida */}
              <View style={styles.mealPlanInputGroup}>
                <View style={styles.mealPlanMealHeader}>
                  <Icon name="partly-sunny" size={20} color="#FFD700" />
                  <Text style={styles.mealPlanMealTitle}>COMIDA</Text>
                </View>
                <TextInput
                  style={styles.mealPlanTextArea}
                  value={newMealPlan.lunch}
                  onChangeText={(text) => setNewMealPlan({...newMealPlan, lunch: text})}
                  placeholder="¿Qué vas a comer?"
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>

              {/* Cena */}
              <View style={styles.mealPlanInputGroup}>
                <View style={styles.mealPlanMealHeader}>
                  <Icon name="moon" size={20} color="#4169E1" />
                  <Text style={styles.mealPlanMealTitle}>CENA</Text>
                </View>
                <TextInput
                  style={styles.mealPlanTextArea}
                  value={newMealPlan.dinner}
                  onChangeText={(text) => setNewMealPlan({...newMealPlan, dinner: text})}
                  placeholder="¿Qué vas a cenar?"
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>
            </ScrollView>

            <View style={styles.mealPlanModalActions}>
              <TouchableOpacity 
                onPress={closeMealPlanModal} 
                style={styles.cancelButton}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={saveMealPlan} 
                style={[styles.saveButton, (!newMealPlan.breakfast.trim() && !newMealPlan.lunch.trim() && !newMealPlan.dinner.trim()) && styles.saveButtonDisabled]}
                disabled={!newMealPlan.breakfast.trim() && !newMealPlan.lunch.trim() && !newMealPlan.dinner.trim()}
              >
                <Text style={styles.saveButtonText}>Guardar Plan</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal para agregar receta */}
      <Modal
        visible={showAddRecipeModal}
        transparent={true}
        animationType="fade"
        onRequestClose={closeAddRecipeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.recipeModalContainer}>
            <View style={styles.recipeModalHeader}>
              <Text style={styles.recipeModalTitle}>Nueva Receta</Text>
              <TouchableOpacity onPress={closeAddRecipeModal} style={styles.closeModalButton}>
                <Icon name="close" size={24} color="#6c757d" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.recipeModalContent} showsVerticalScrollIndicator={false}>
              <View style={styles.recipeInputGroup}>
                <Text style={styles.recipeInputLabel}>Nombre de la receta</Text>
                <TextInput
                  style={styles.recipeNameInput}
                  value={newRecipe.name}
                  onChangeText={(text) => setNewRecipe({...newRecipe, name: text})}
                  placeholder="Ej: Pasta con pollo"
                  maxLength={50}
                />
              </View>

              <View style={styles.recipeInputGroup}>
                <Text style={styles.recipeInputLabel}>Ingredientes</Text>
                <TextInput
                  style={styles.recipeTextArea}
                  value={newRecipe.ingredients}
                  onChangeText={(text) => setNewRecipe({...newRecipe, ingredients: text})}
                  placeholder="• 200g de pasta&#10;• 1 pechuga de pollo&#10;• 2 tomates&#10;• Sal y pimienta al gusto"
                  multiline
                  numberOfLines={6}
                  textAlignVertical="top"
                />
              </View>

              <View style={styles.recipeInputGroup}>
                <Text style={styles.recipeInputLabel}>Instrucciones</Text>
                <TextInput
                  style={styles.recipeTextArea}
                  value={newRecipe.instructions}
                  onChangeText={(text) => setNewRecipe({...newRecipe, instructions: text})}
                  placeholder="1. Cocinar la pasta según las instrucciones del paquete&#10;2. Cortar el pollo en cubos y cocinar en una sartén&#10;3. Agregar los tomates y cocinar por 5 minutos&#10;4. Mezclar con la pasta y servir"
                  multiline
                  numberOfLines={8}
                  textAlignVertical="top"
                />
              </View>
            </ScrollView>

            <View style={styles.recipeModalActions}>
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
    padding: 16,
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d4150',
  },
  addButton: {
    backgroundColor: '#45B7D1',
    borderRadius: 20,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Estilos para Meal Planner
  mealPlannerContainer: {
    gap: 16,
  },
  mealCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  mealHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  mealTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d4150',
    marginLeft: 8,
  },
  mealInput: {
    fontSize: 14,
    color: '#2d4150',
    lineHeight: 20,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  // Estilos para Market List
  marketListContainer: {
    gap: 16,
  },
  categoryCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  categoryHeader: {
    padding: 12,
    borderLeftWidth: 4,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2d4150',
  },
  itemsContainer: {
    padding: 12,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  itemText: {
    fontSize: 14,
    color: '#2d4150',
    flex: 1,
  },
  removeButton: {
    padding: 4,
  },
  addItemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    marginTop: 8,
  },
  addItemText: {
    fontSize: 12,
    color: '#45B7D1',
    marginLeft: 4,
    fontWeight: '600',
  },
  // Estilos para Recipes
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderStyle: 'dashed',
  },
  emptyText: {
    fontSize: 18,
    color: '#6c757d',
    marginTop: 16,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#adb5bd',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  recipesContainer: {
    gap: 16,
  },
  recipeCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  recipeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  recipeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d4150',
    flex: 1,
  },
  deleteButton: {
    padding: 4,
  },
  recipeInput: {
    fontSize: 14,
    color: '#2d4150',
    lineHeight: 20,
    minHeight: 40,
    textAlignVertical: 'top',
    marginBottom: 8,
    padding: 8,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  // Estilos para Notes
  notesContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  notesInput: {
    fontSize: 14,
    color: '#2d4150',
    lineHeight: 20,
    minHeight: 200,
    textAlignVertical: 'top',
  },
  // Estilos para el modal de recetas
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  recipeModalContainer: {
    backgroundColor: '#ffffff',
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
  recipeModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  recipeModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d4150',
  },
  closeModalButton: {
    padding: 4,
  },
  recipeModalContent: {
    maxHeight: 400,
    padding: 20,
  },
  recipeInputGroup: {
    marginBottom: 20,
  },
  recipeInputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d4150',
    marginBottom: 8,
  },
  recipeNameInput: {
    fontSize: 16,
    color: '#2d4150',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  recipeTextArea: {
    fontSize: 14,
    color: '#2d4150',
    lineHeight: 20,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
    textAlignVertical: 'top',
  },
  recipeModalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6c757d',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#45B7D1',
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#e9ecef',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  // Estilos para el planificador semanal
  mealDisplayText: {
    fontSize: 14,
    color: '#2d4150',
    lineHeight: 20,
    minHeight: 60,
    padding: 8,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  emptyMealState: {
    alignItems: 'center',
    paddingVertical: 48,
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderStyle: 'dashed',
  },
  emptyMealText: {
    fontSize: 18,
    color: '#6c757d',
    marginTop: 16,
    fontWeight: '600',
  },
  emptyMealSubtext: {
    fontSize: 14,
    color: '#adb5bd',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  // Estilos para el modal de planificación de comidas
  mealPlanModalContainer: {
    backgroundColor: '#ffffff',
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
  mealPlanModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  mealPlanModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d4150',
  },
  mealPlanModalContent: {
    maxHeight: 400,
    padding: 20,
  },
  mealPlanInputGroup: {
    marginBottom: 20,
  },
  mealPlanInputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d4150',
    marginBottom: 12,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#2d4150',
    marginLeft: 8,
  },
  mealPlanMealHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  mealPlanMealTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d4150',
    marginLeft: 8,
  },
  mealPlanTextArea: {
    fontSize: 14,
    color: '#2d4150',
    lineHeight: 20,
    minHeight: 80,
    textAlignVertical: 'top',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  mealPlanModalActions: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    gap: 12,
  },
  // Estilos para el modal de agregar artículo
  addItemModalContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    width: '100%',
    maxWidth: 350,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  addItemModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  addItemModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d4150',
    flex: 1,
  },
  addItemModalContent: {
    padding: 20,
  },
  addItemInputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d4150',
    marginBottom: 12,
  },
  addItemInput: {
    fontSize: 16,
    color: '#2d4150',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  addItemModalActions: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    gap: 12,
  },
  // Estilos para los elementos de la lista con checkbox
  itemRowPurchased: {
    opacity: 0.6,
    backgroundColor: '#f8f9fa',
  },
  checkboxContainer: {
    padding: 8,
    marginRight: 8,
  },
  itemInfo: {
    flex: 1,
    flexDirection: 'column',
  },
  itemTextPurchased: {
    textDecorationLine: 'line-through',
    color: '#6c757d',
  },
  itemQuantity: {
    fontSize: 12,
    color: '#6c757d',
    fontStyle: 'italic',
    marginTop: 2,
  },
  itemQuantityPurchased: {
    textDecorationLine: 'line-through',
    color: '#adb5bd',
  },
  // Estilos para el stepper de cantidad
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
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  quantityDisplay: {
    minWidth: 60,
    height: 40,
    backgroundColor: '#f8f9fa',
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
    color: '#2d4150',
  },
  // Estilos para el selector de unidades
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
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  unitButtonSelected: {
    backgroundColor: '#45B7D1',
    borderColor: '#45B7D1',
  },
  unitButtonText: {
    fontSize: 14,
    color: '#6c757d',
    fontWeight: '500',
  },
  unitButtonTextSelected: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

export default NutritionSections;
