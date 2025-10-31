import React, { useState } from 'react';
import {
  IonContent,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonText,
  IonButton,
  IonIcon,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonItem,
  IonList,
  IonChip,
  IonAlert,
  IonToast,
  IonGrid,
  IonRow,
  IonCol,
  IonFab,
  IonFabButton,
  IonCheckbox,
  IonBadge,
} from '@ionic/react';
import {
  restaurant,
  list,
  book,
  documentText,
  add,
  close,
  calendar,
  checkmarkCircle,
  informationCircle,
  trash,
  create,
  cart,
  nutrition,
  fastFood,
  iceCream,
  wine,
  basket,
} from 'ionicons/icons';

interface MealPlan {
  breakfast: string;
  lunch: string;
  dinner: string;
  snacks?: string;
}

interface MarketItem {
  id: string;
  text: string;
  quantity: number;
  unit: string;
  purchased: boolean;
}

interface Recipe {
  id: string;
  name: string;
  ingredients: string;
  instructions: string;
}

interface MarketList {
  [category: string]: MarketItem[];
}

const Nutrition: React.FC = () => {
  const [activeSegment, setActiveSegment] = useState<string>('meal-planner');

  // Estados para planificador de comidas
  const [mealPlans, setMealPlans] = useState<{[date: string]: MealPlan}>({});
  const [showMealModal, setShowMealModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [newMeal, setNewMeal] = useState<MealPlan>({
    breakfast: '',
    lunch: '',
    dinner: '',
    snacks: ''
  });

  // Estados para lista del mercado
  const [marketList, setMarketList] = useState<MarketList>({
    fruits: [],
    vegetables: [],
    dairy: [],
    meat: [],
    bakery: [],
    frozen: [],
    spices: [],
    canned: [],
    beverages: []
  });
  const [showItemModal, setShowItemModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [newItem, setNewItem] = useState({
    text: '',
    quantity: 1,
    unit: 'unidad'
  });

  // Estados para recetas
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [newRecipe, setNewRecipe] = useState({
    name: '',
    ingredients: '',
    instructions: ''
  });

  // Estados para notas nutricionales
  const [nutritionNotes, setNutritionNotes] = useState('');

  // Estados para UI
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const marketCategories = [
    { key: 'fruits', label: 'Frutas', icon: nutrition, color: 'success' },
    { key: 'vegetables', label: 'Verduras', icon: nutrition, color: 'success' },
    { key: 'dairy', label: 'Lácteos', icon: iceCream, color: 'warning' },
    { key: 'meat', label: 'Carnes', icon: fastFood, color: 'danger' },
    { key: 'bakery', label: 'Panadería', icon: basket, color: 'primary' },
    { key: 'frozen', label: 'Congelados', icon: basket, color: 'tertiary' },
    { key: 'spices', label: 'Especias', icon: basket, color: 'secondary' },
    { key: 'canned', label: 'Enlatados', icon: basket, color: 'medium' },
    { key: 'beverages', label: 'Bebidas', icon: wine, color: 'tertiary' },
  ];

  const units = ['unidad', 'kg', 'g', 'litro', 'ml', 'paquete', 'botella', 'lata'];

  const handleSaveMealPlan = () => {
    if (!newMeal.breakfast.trim() && !newMeal.lunch.trim() && !newMeal.dinner.trim()) {
      setAlertMessage('Por favor agrega al menos una comida');
      setShowAlert(true);
      return;
    }

    setMealPlans({
      ...mealPlans,
      [selectedDate]: { ...newMeal }
    });
    setNewMeal({ breakfast: '', lunch: '', dinner: '', snacks: '' });
    setShowMealModal(false);
    setToastMessage('Plan de comidas guardado exitosamente');
    setShowToast(true);
  };

  const handleAddMarketItem = () => {
    if (!newItem.text.trim() || !selectedCategory) {
      setAlertMessage('Por favor ingresa el nombre del artículo y selecciona una categoría');
      setShowAlert(true);
      return;
    }

    const item: MarketItem = {
      id: Date.now().toString(),
      text: newItem.text.trim(),
      quantity: newItem.quantity,
      unit: newItem.unit,
      purchased: false
    };

    setMarketList({
      ...marketList,
      [selectedCategory]: [...marketList[selectedCategory], item]
    });

    setNewItem({ text: '', quantity: 1, unit: 'unidad' });
    setSelectedCategory('');
    setShowItemModal(false);
    setToastMessage('Artículo agregado a la lista');
    setShowToast(true);
  };

  const toggleItemPurchased = (category: string, itemId: string) => {
    setMarketList(prev => ({
      ...prev,
      [category]: prev[category].map(item =>
        item.id === itemId ? { ...item, purchased: !item.purchased } : item
      )
    }));
  };

  const removeMarketItem = (category: string, itemId: string) => {
    setMarketList(prev => ({
      ...prev,
      [category]: prev[category].filter(item => item.id !== itemId)
    }));
    setToastMessage('Artículo eliminado de la lista');
    setShowToast(true);
  };

  const handleAddRecipe = () => {
    if (!newRecipe.name.trim()) {
      setAlertMessage('Por favor ingresa el nombre de la receta');
      setShowAlert(true);
      return;
    }

    const recipe: Recipe = {
      id: Date.now().toString(),
      name: newRecipe.name.trim(),
      ingredients: newRecipe.ingredients.trim(),
      instructions: newRecipe.instructions.trim()
    };

    setRecipes([...recipes, recipe]);
    setNewRecipe({ name: '', ingredients: '', instructions: '' });
    setShowRecipeModal(false);
    setToastMessage('Receta guardada exitosamente');
    setShowToast(true);
  };

  const getTotalItems = () => {
    return Object.values(marketList).reduce((total, category) => total + category.length, 0);
  };

  const getPurchasedItems = () => {
    return Object.values(marketList).reduce((total, category) =>
      total + category.filter(item => item.purchased).length, 0);
  };

  const renderMealPlanner = () => (
    <IonContent className="ion-padding">
      <IonText>
        <h2>Planificador de Comidas</h2>
        <p>Organiza tus comidas diarias y semanales</p>
      </IonText>

      {/* Vista rápida del día actual */}
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Hoy - {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          {mealPlans[new Date().toISOString().split('T')[0]] ? (
            <IonGrid>
              <IonRow>
                <IonCol size="6">
                  <IonText>
                    <h4>🍳 Desayuno</h4>
                    <p>{mealPlans[new Date().toISOString().split('T')[0]].breakfast || 'No planificado'}</p>
                  </IonText>
                </IonCol>
                <IonCol size="6">
                  <IonText>
                    <h4>🥗 Almuerzo</h4>
                    <p>{mealPlans[new Date().toISOString().split('T')[0]].lunch || 'No planificado'}</p>
                  </IonText>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol size="6">
                  <IonText>
                    <h4>🍽️ Cena</h4>
                    <p>{mealPlans[new Date().toISOString().split('T')[0]].dinner || 'No planificado'}</p>
                  </IonText>
                </IonCol>
                <IonCol size="6">
                  <IonText>
                    <h4>🍎 Snacks</h4>
                    <p>{mealPlans[new Date().toISOString().split('T')[0]].snacks || 'No planificado'}</p>
                  </IonText>
                </IonCol>
              </IonRow>
            </IonGrid>
          ) : (
            <IonText color="medium">
              <p>No hay comidas planificadas para hoy</p>
            </IonText>
          )}
        </IonCardContent>
      </IonCard>

      {/* Planes de comidas por fecha */}
      {Object.keys(mealPlans).length > 0 && (
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Planes Planificados</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            {Object.entries(mealPlans)
              .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
              .map(([date, plan]) => (
                <IonItem key={date} lines="none">
                  <IonIcon icon={calendar} slot="start" />
                  <IonLabel>
                    <h3>{new Date(date).toLocaleDateString('es-ES')}</h3>
                    <p>
                      {[plan.breakfast, plan.lunch, plan.dinner].filter(Boolean).join(' • ') ||
                       'Comidas planificadas'}
                    </p>
                  </IonLabel>
                </IonItem>
              ))}
          </IonCardContent>
        </IonCard>
      )}
    </IonContent>
  );

  const renderMarketList = () => (
    <IonContent className="ion-padding">
      <IonText>
        <h2>Lista de Compras</h2>
        <p>Organiza tus compras por categorías</p>
      </IonText>

      {/* Estadísticas */}
      <IonGrid>
        <IonRow>
          <IonCol size="6">
            <IonCard className="stats-card">
              <IonCardContent className="ion-text-center">
                <IonIcon icon={cart} size="large" color="primary" />
                <IonText>
                  <h3>{getTotalItems()}</h3>
                  <p>Artículos totales</p>
                </IonText>
              </IonCardContent>
            </IonCard>
          </IonCol>
          <IonCol size="6">
            <IonCard className="stats-card">
              <IonCardContent className="ion-text-center">
                <IonIcon icon={checkmarkCircle} size="large" color="success" />
                <IonText>
                  <h3>{getPurchasedItems()}</h3>
                  <p>Comprados</p>
                </IonText>
              </IonCardContent>
            </IonCard>
          </IonCol>
        </IonRow>
      </IonGrid>

      {/* Categorías */}
      {marketCategories.map(category => (
        <IonCard key={category.key} className="category-card">
          <IonCardHeader>
            <IonCardTitle className="category-title">
              <IonIcon icon={category.icon} className="category-icon" />
              {category.label}
            </IonCardTitle>
            <IonBadge color={category.color} className="category-count">
              {marketList[category.key].length}
            </IonBadge>
          </IonCardHeader>
          <IonCardContent>
            {marketList[category.key].length === 0 ? (
              <IonText color="medium">
                <p>No hay artículos en esta categoría</p>
              </IonText>
            ) : (
              marketList[category.key].map(item => (
                <IonItem key={item.id} lines="none" className={item.purchased ? 'purchased-item' : ''}>
                  <IonCheckbox
                    slot="start"
                    checked={item.purchased}
                    onIonChange={() => toggleItemPurchased(category.key, item.id)}
                  />
                  <IonLabel>
                    <h3 className={item.purchased ? 'completed-text' : ''}>
                      {item.quantity} {item.unit} - {item.text}
                    </h3>
                  </IonLabel>
                  <IonButton
                    fill="clear"
                    color="danger"
                    slot="end"
                    onClick={() => removeMarketItem(category.key, item.id)}
                  >
                    <IonIcon icon={trash} />
                  </IonButton>
                </IonItem>
              ))
            )}
          </IonCardContent>
        </IonCard>
      ))}
    </IonContent>
  );

  const renderRecipes = () => (
    <IonContent className="ion-padding">
      <IonText>
        <h2>Mis Recetas</h2>
        <p>Guarda y organiza tus recetas favoritas</p>
      </IonText>

      {recipes.length === 0 ? (
        <IonCard>
          <IonCardContent className="ion-text-center">
            <IonIcon icon={book} size="large" color="medium" />
            <IonText>
              <h3>No hay recetas</h3>
              <p>Toca el botón + para agregar tu primera receta</p>
            </IonText>
          </IonCardContent>
        </IonCard>
      ) : (
        recipes.map(recipe => (
          <IonCard key={recipe.id} className="recipe-card">
            <IonCardHeader>
              <IonCardTitle className="recipe-title">{recipe.name}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonText>
                <h4>Ingredientes:</h4>
                <p className="recipe-text">{recipe.ingredients}</p>
              </IonText>
              <IonText>
                <h4>Instrucciones:</h4>
                <p className="recipe-text">{recipe.instructions}</p>
              </IonText>
            </IonCardContent>
          </IonCard>
        ))
      )}
    </IonContent>
  );

  const renderNotes = () => (
    <IonContent className="ion-padding">
      <IonText>
        <h2>Notas Nutricionales</h2>
        <p>Registra observaciones sobre tu alimentación</p>
      </IonText>

      <IonCard>
        <IonCardContent>
          <IonTextarea
            label="Notas sobre nutrición"
            labelPlacement="stacked"
            placeholder="Escribe aquí tus observaciones sobre alimentación, metas nutricionales, alergias, etc..."
            value={nutritionNotes}
            onIonChange={(e) => setNutritionNotes(e.detail.value!)}
            rows={10}
          />
          <IonButton
            expand="block"
            style={{ marginTop: '16px' }}
            onClick={() => {
              setToastMessage('Notas guardadas exitosamente');
              setShowToast(true);
            }}
          >
            <IonIcon icon={checkmarkCircle} slot="start" />
            Guardar Notas
          </IonButton>
        </IonCardContent>
      </IonCard>
    </IonContent>
  );

  return (
    <>
      <IonContent>
        <IonSegment
          value={activeSegment}
          onIonChange={(e) => setActiveSegment(e.detail.value!)}
          className="nutrition-segment"
        >
          <IonSegmentButton value="meal-planner">
            <IonLabel>Comidas</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="market-list">
            <IonLabel>Compras</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="recipes">
            <IonLabel>Recetas</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="notes">
            <IonLabel>Notas</IonLabel>
          </IonSegmentButton>
        </IonSegment>

        {activeSegment === 'meal-planner' && renderMealPlanner()}
        {activeSegment === 'market-list' && renderMarketList()}
        {activeSegment === 'recipes' && renderRecipes()}
        {activeSegment === 'notes' && renderNotes()}

        {/* FAB Buttons */}
        {activeSegment === 'meal-planner' && (
          <IonFab vertical="bottom" horizontal="end" slot="fixed">
            <IonFabButton onClick={() => setShowMealModal(true)}>
              <IonIcon icon={add} />
            </IonFabButton>
          </IonFab>
        )}

        {activeSegment === 'market-list' && (
          <IonFab vertical="bottom" horizontal="end" slot="fixed">
            <IonFabButton onClick={() => setShowItemModal(true)}>
              <IonIcon icon={add} />
            </IonFabButton>
          </IonFab>
        )}

        {activeSegment === 'recipes' && (
          <IonFab vertical="bottom" horizontal="end" slot="fixed">
            <IonFabButton onClick={() => setShowRecipeModal(true)}>
              <IonIcon icon={add} />
            </IonFabButton>
          </IonFab>
        )}
      </IonContent>

      {/* Meal Plan Modal */}
      <IonModal isOpen={showMealModal} onDidDismiss={() => setShowMealModal(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Planificar Comidas</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowMealModal(false)}>
                <IonIcon icon={close} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonList>
            <IonItem>
              <IonInput
                label="Fecha"
                labelPlacement="stacked"
                type="date"
                value={selectedDate}
                onIonChange={(e) => setSelectedDate(e.detail.value!)}
              />
            </IonItem>

            <IonItem>
              <IonTextarea
                label="Desayuno"
                labelPlacement="stacked"
                placeholder="Ej: Avena con frutas"
                value={newMeal.breakfast}
                onIonChange={(e) => setNewMeal({ ...newMeal, breakfast: e.detail.value! })}
                rows={2}
              />
            </IonItem>

            <IonItem>
              <IonTextarea
                label="Almuerzo"
                labelPlacement="stacked"
                placeholder="Ej: Ensalada de pollo"
                value={newMeal.lunch}
                onIonChange={(e) => setNewMeal({ ...newMeal, lunch: e.detail.value! })}
                rows={2}
              />
            </IonItem>

            <IonItem>
              <IonTextarea
                label="Cena"
                labelPlacement="stacked"
                placeholder="Ej: Pescado al horno"
                value={newMeal.dinner}
                onIonChange={(e) => setNewMeal({ ...newMeal, dinner: e.detail.value! })}
                rows={2}
              />
            </IonItem>

            <IonItem>
              <IonTextarea
                label="Snacks"
                labelPlacement="stacked"
                placeholder="Ej: Frutas, yogurt"
                value={newMeal.snacks}
                onIonChange={(e) => setNewMeal({ ...newMeal, snacks: e.detail.value! })}
                rows={2}
              />
            </IonItem>
          </IonList>

          <IonGrid>
            <IonRow>
              <IonCol>
                <IonButton
                  expand="block"
                  fill="outline"
                  onClick={() => setShowMealModal(false)}
                >
                  Cancelar
                </IonButton>
              </IonCol>
              <IonCol>
                <IonButton
                  expand="block"
                  onClick={handleSaveMealPlan}
                  disabled={!newMeal.breakfast && !newMeal.lunch && !newMeal.dinner}
                >
                  <IonIcon icon={checkmarkCircle} slot="start" />
                  Guardar Plan
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonContent>
      </IonModal>

      {/* Market Item Modal */}
      <IonModal isOpen={showItemModal} onDidDismiss={() => setShowItemModal(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Agregar Artículo</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowItemModal(false)}>
                <IonIcon icon={close} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonList>
            <IonItem>
              <IonSelect
                label="Categoría"
                labelPlacement="stacked"
                placeholder="Selecciona una categoría"
                value={selectedCategory}
                onSelectionChange={(value) => setSelectedCategory(value!)}
              >
                {marketCategories.map(category => (
                  <IonSelectOption key={category.key} value={category.key}>
                    {category.label}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>

            <IonItem>
              <IonInput
                label="Artículo"
                labelPlacement="stacked"
                placeholder="Ej: Manzanas"
                value={newItem.text}
                onIonChange={(e) => setNewItem({ ...newItem, text: e.detail.value! })}
              />
            </IonItem>

            <IonItem>
              <IonInput
                label="Cantidad"
                labelPlacement="stacked"
                type="number"
                value={newItem.quantity}
                onIonChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.detail.value!) || 1 })}
              />
            </IonItem>

            <IonItem>
              <IonSelect
                label="Unidad"
                labelPlacement="stacked"
                value={newItem.unit}
                onSelectionChange={(value) => setNewItem({ ...newItem, unit: value! })}
              >
                {units.map(unit => (
                  <IonSelectOption key={unit} value={unit}>{unit}</IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>
          </IonList>

          <IonGrid>
            <IonRow>
              <IonCol>
                <IonButton
                  expand="block"
                  fill="outline"
                  onClick={() => setShowItemModal(false)}
                >
                  Cancelar
                </IonButton>
              </IonCol>
              <IonCol>
                <IonButton
                  expand="block"
                  onClick={handleAddMarketItem}
                  disabled={!newItem.text.trim() || !selectedCategory}
                >
                  <IonIcon icon={checkmarkCircle} slot="start" />
                  Agregar
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonContent>
      </IonModal>

      {/* Recipe Modal */}
      <IonModal isOpen={showRecipeModal} onDidDismiss={() => setShowRecipeModal(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Agregar Receta</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowRecipeModal(false)}>
                <IonIcon icon={close} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonList>
            <IonItem>
              <IonInput
                label="Nombre de la receta"
                labelPlacement="stacked"
                placeholder="Ej: Pasta con salsa"
                value={newRecipe.name}
                onIonChange={(e) => setNewRecipe({ ...newRecipe, name: e.detail.value! })}
              />
            </IonItem>

            <IonItem>
              <IonTextarea
                label="Ingredientes"
                labelPlacement="stacked"
                placeholder="Lista de ingredientes separados por comas..."
                value={newRecipe.ingredients}
                onIonChange={(e) => setNewRecipe({ ...newRecipe, ingredients: e.detail.value! })}
                rows={4}
              />
            </IonItem>

            <IonItem>
              <IonTextarea
                label="Instrucciones"
                labelPlacement="stacked"
                placeholder="Pasos para preparar la receta..."
                value={newRecipe.instructions}
                onIonChange={(e) => setNewRecipe({ ...newRecipe, instructions: e.detail.value! })}
                rows={6}
              />
            </IonItem>
          </IonList>

          <IonGrid>
            <IonRow>
              <IonCol>
                <IonButton
                  expand="block"
                  fill="outline"
                  onClick={() => setShowRecipeModal(false)}
                >
                  Cancelar
                </IonButton>
              </IonCol>
              <IonCol>
                <IonButton
                  expand="block"
                  onClick={handleAddRecipe}
                  disabled={!newRecipe.name.trim()}
                >
                  <IonIcon icon={checkmarkCircle} slot="start" />
                  Guardar Receta
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonContent>
      </IonModal>

      {/* Alert */}
      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        header="Aviso"
        message={alertMessage}
        buttons={['OK']}
      />

      {/* Toast */}
      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message={toastMessage}
        duration={2000}
        position="bottom"
        color="success"
      />
    </>
  );
};

export default Nutrition;
