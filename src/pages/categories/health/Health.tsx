import React, { useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonMenuButton,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonIcon,
  IonList,
  IonItem,
  IonInput,
  IonTextarea,
  IonModal,
  IonGrid,
  IonRow,
  IonCol,
  IonChip,
} from '@ionic/react';
import {
  restaurant,
  fitness,
  water,
  nutrition,
  barbell,
  heart,
  calendar,
  add,
  close,
} from 'ionicons/icons';
import Exercise from './components/Exercise';
import Menstrual from './components/menstrual/Menstrual';
import Nutrition from './components/nutrition/Nutrition';
import Personal from './components/personal/Personal';
import './Health.css';

const Health: React.FC = () => {
  const [activeSection, setActiveSection] = useState('meal-planner');
  const [showMealModal, setShowMealModal] = useState(false);
  const [showRecipeModal, setShowRecipeModal] = useState(false);

  // Estados para planificador de comidas
  const [mealPlans, setMealPlans] = useState({});
  const [newMeal, setNewMeal] = useState({
    breakfast: '',
    lunch: '',
    dinner: '',
    snacks: ''
  });

  // Estados para lista de compras
  const [shoppingList, setShoppingList] = useState({
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


  // Estados para seguimiento fitness
  const [fitnessData, setFitnessData] = useState({
    caloriesIn: '',
    caloriesOut: '',
    water: '',
    steps: '',
    sleep: '',
    weight: '',
    measurements: {}
  });

  const addMeal = () => {
    // Lógica para agregar comida
    console.log('Adding meal:', newMeal);
    setShowMealModal(false);
    setNewMeal({ breakfast: '', lunch: '', dinner: '', snacks: '' });
  };

  const addRecipe = () => {
    if (newRecipe.name && newRecipe.ingredients && newRecipe.instructions) {
      setRecipes([...recipes, { ...newRecipe, id: Date.now() }]);
      setNewRecipe({ name: '', ingredients: '', instructions: '' });
      setShowRecipeModal(false);
    }
  };


  const renderMealPlanner = () => (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>
          <IonIcon icon={restaurant} slot="start" />
          Planificador de Comidas
        </IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonButton
          expand="block"
          color="primary"
          onClick={() => setShowMealModal(true)}
        >
          <IonIcon icon={add} slot="start" />
          Agregar Comida del Día
        </IonButton>

        <div style={{ marginTop: '20px' }}>
          <h3>Comidas Planificadas</h3>
          <IonList>
            <IonItem>
              <IonLabel>
                <h3>Desayuno</h3>
                <p>Avena con frutas</p>
              </IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel>
                <h3>Almuerzo</h3>
                <p>Ensalada de pollo</p>
              </IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel>
                <h3>Cena</h3>
                <p>Pescado al horno</p>
              </IonLabel>
            </IonItem>
          </IonList>
        </div>
      </IonCardContent>
    </IonCard>
  );

  const renderNutrition = () => (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>
          <IonIcon icon={nutrition} slot="start" />
          Nutrición
        </IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonButton
          expand="block"
          color="success"
          onClick={() => setShowRecipeModal(true)}
        >
          <IonIcon icon={add} slot="start" />
          Agregar Receta
        </IonButton>

        <div style={{ marginTop: '20px' }}>
          <h3>Mis Recetas</h3>
          <IonList>
            {recipes.map((recipe: any) => (
              <IonItem key={recipe.id}>
                <IonLabel>
                  <h3>{recipe.name}</h3>
                  <p>Ingredientes: {recipe.ingredients.substring(0, 50)}...</p>
                </IonLabel>
              </IonItem>
            ))}
          </IonList>
        </div>
      </IonCardContent>
    </IonCard>
  );


  const renderWellness = () => (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>
          <IonIcon icon={heart} slot="start" />
          Bienestar
        </IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonGrid>
          <IonRow>
            <IonCol size="6">
              <IonItem>
                <IonLabel position="stacked">Agua (litros)</IonLabel>
                <IonInput
                  type="number"
                  value={fitnessData.water}
                  placeholder="2.5"
                  onIonChange={(e) => setFitnessData({...fitnessData, water: e.detail.value!})}
                />
              </IonItem>
            </IonCol>
            <IonCol size="6">
              <IonItem>
                <IonLabel position="stacked">Sueño (horas)</IonLabel>
                <IonInput
                  type="number"
                  value={fitnessData.sleep}
                  placeholder="8"
                  onIonChange={(e) => setFitnessData({...fitnessData, sleep: e.detail.value!})}
                />
              </IonItem>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size="6">
              <IonItem>
                <IonLabel position="stacked">Pasos</IonLabel>
                <IonInput
                  type="number"
                  value={fitnessData.steps}
                  placeholder="10000"
                  onIonChange={(e) => setFitnessData({...fitnessData, steps: e.detail.value!})}
                />
              </IonItem>
            </IonCol>
            <IonCol size="6">
              <IonItem>
                <IonLabel position="stacked">Peso (kg)</IonLabel>
                <IonInput
                  type="number"
                  value={fitnessData.weight}
                  placeholder="70"
                  onIonChange={(e) => setFitnessData({...fitnessData, weight: e.detail.value!})}
                />
              </IonItem>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonCardContent>
    </IonCard>
  );

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Salud</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonSegment
          value={activeSection}
          onIonChange={(e) => setActiveSection(e.detail.value!)}
          style={{ marginBottom: '20px' }}
        >
          <IonSegmentButton value="meal-planner">
            <IonLabel>Comidas</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="nutrition">
            <IonLabel>Nutrición</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="exercise">
            <IonLabel>Ejercicio</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="menstrual">
            <IonLabel>Menstrual</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="personal">
            <IonLabel>Personal</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="wellness">
            <IonLabel>Bienestar</IonLabel>
          </IonSegmentButton>
        </IonSegment>

        {activeSection === 'meal-planner' && renderMealPlanner()}
        {activeSection === 'nutrition' && <Nutrition />}
        {activeSection === 'exercise' && <Exercise />}
        {activeSection === 'menstrual' && <Menstrual />}
        {activeSection === 'personal' && <Personal />}
        {activeSection === 'wellness' && renderWellness()}

        {/* Modal para agregar comida */}
        <IonModal isOpen={showMealModal}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Agregar Comida del Día</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowMealModal(false)}>
                  <IonIcon icon={close} />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonList>
              <IonItem>
                <IonLabel position="stacked">Desayuno</IonLabel>
                <IonInput
                  value={newMeal.breakfast}
                  placeholder="Ej: Avena con frutas"
                  onIonChange={(e) => setNewMeal({...newMeal, breakfast: e.detail.value!})}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Almuerzo</IonLabel>
                <IonInput
                  value={newMeal.lunch}
                  placeholder="Ej: Ensalada de pollo"
                  onIonChange={(e) => setNewMeal({...newMeal, lunch: e.detail.value!})}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Cena</IonLabel>
                <IonInput
                  value={newMeal.dinner}
                  placeholder="Ej: Pescado al horno"
                  onIonChange={(e) => setNewMeal({...newMeal, dinner: e.detail.value!})}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Snacks</IonLabel>
                <IonInput
                  value={newMeal.snacks}
                  placeholder="Ej: Frutas, yogurt"
                  onIonChange={(e) => setNewMeal({...newMeal, snacks: e.detail.value!})}
                />
              </IonItem>
            </IonList>
            <IonButton
              expand="block"
              style={{ margin: '20px' }}
              onClick={addMeal}
            >
              Guardar Comida
            </IonButton>
          </IonContent>
        </IonModal>

        {/* Modal para agregar receta */}
        <IonModal isOpen={showRecipeModal}>
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
          <IonContent>
            <IonList>
              <IonItem>
                <IonLabel position="stacked">Nombre de la Receta</IonLabel>
                <IonInput
                  value={newRecipe.name}
                  placeholder="Ej: Pasta Alfredo"
                  onIonChange={(e) => setNewRecipe({...newRecipe, name: e.detail.value!})}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Ingredientes</IonLabel>
                <IonTextarea
                  value={newRecipe.ingredients}
                  placeholder="Lista de ingredientes..."
                  rows={3}
                  onIonChange={(e) => setNewRecipe({...newRecipe, ingredients: e.detail.value!})}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Instrucciones</IonLabel>
                <IonTextarea
                  value={newRecipe.instructions}
                  placeholder="Pasos para preparar..."
                  rows={5}
                  onIonChange={(e) => setNewRecipe({...newRecipe, instructions: e.detail.value!})}
                />
              </IonItem>
            </IonList>
            <IonButton
              expand="block"
              style={{ margin: '20px' }}
              onClick={addRecipe}
            >
              Guardar Receta
            </IonButton>
          </IonContent>
        </IonModal>

      </IonContent>
    </IonPage>
  );
};

export default Health;
