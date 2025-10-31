import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
} from 'react-native';
import { SectionHeader, SubsectionTabs, Button, Card } from '../index';

const HealthSectionsExample = () => {
  const [activeSection, setActiveSection] = useState('meal-planner');

  const sections = [
    { id: 'meal-planner', name: 'Planificador de Comidas', icon: 'restaurant-outline' },
    { id: 'recipes', name: 'Recetas', icon: 'book-outline' },
    { id: 'gym-routine', name: 'Rutina de Gimnasio', icon: 'fitness-outline' },
    { id: 'sports-goals', name: 'Objetivos Deportivos', icon: 'trophy-outline' },
    { id: 'fitness-tracker', name: 'Seguimiento de Fitness', icon: 'pulse-outline' },
    { id: 'body-measurements', name: 'Medidas Corporales', icon: 'body-outline' },
    { id: 'workout-tracker', name: 'Seguimiento de Entrenamientos', icon: 'barbell-outline' },
    { id: 'weight-loss', name: 'Pérdida de Peso', icon: 'scale-outline' },
    { id: 'nutrition-tracker', name: 'Seguimiento Nutricional', icon: 'nutrition-outline' },
  ];

  const handleAddMeal = () => {
    console.log('Agregar comida');
  };

  const handleAddRecipe = () => {
    console.log('Agregar receta');
  };

  const handleAddWorkout = () => {
    console.log('Agregar entrenamiento');
  };

  const renderMealPlanner = () => (
    <View>
      <SectionHeader
        title="Planificador de Comidas"
        subtitle="Organiza tu alimentación saludable"
        image={require('../../android/app/src/main/assets/salud.png')}
        onAddPress={handleAddMeal}
        theme="mountain"
        size="medium"
      />
      
      <Card
        title="Desayuno"
        subtitle="7:00 - 9:00 AM"
        icon="sunny-outline"
        theme="mountain"
        size="medium"
      >
        <Text>No planificado</Text>
        <Button
          title="Agregar Comida"
          onPress={handleAddMeal}
          variant="primary"
          size="small"
          theme="mountain"
        />
      </Card>
    </View>
  );

  const renderRecipes = () => (
    <View>
      <SectionHeader
        title="Recetas"
        subtitle="Descubre nuevas recetas saludables"
        image={require('../../android/app/src/main/assets/salud.png')}
        onAddPress={handleAddRecipe}
        theme="mountain"
        size="medium"
      />
      
      <Card
        title="Ensalada César"
        subtitle="Fácil • 15 min • 4 porciones"
        icon="leaf-outline"
        theme="mountain"
        size="medium"
      >
        <Text>Ingredientes frescos y nutritivos</Text>
        <Button
          title="Ver Receta"
          onPress={() => console.log('Ver receta')}
          variant="outline"
          size="small"
          theme="mountain"
        />
      </Card>
    </View>
  );

  const renderGymRoutine = () => (
    <View>
      <SectionHeader
        title="Rutina de Gimnasio"
        subtitle="Planifica tus entrenamientos"
        image={require('../../android/app/src/main/assets/salud.png')}
        onAddPress={handleAddWorkout}
        theme="mountain"
        size="medium"
      />
      
      <Card
        title="Entrenamiento de Fuerza"
        subtitle="Lunes • 18:00 - 19:30"
        icon="barbell-outline"
        theme="mountain"
        size="medium"
      >
        <Text>Ejercicios: Press banca, Sentadillas, Peso muerto</Text>
        <Button
          title="Comenzar"
          onPress={() => console.log('Comenzar entrenamiento')}
          variant="success"
          size="small"
          theme="mountain"
        />
      </Card>
    </View>
  );

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'meal-planner':
        return renderMealPlanner();
      case 'recipes':
        return renderRecipes();
      case 'gym-routine':
        return renderGymRoutine();
      default:
        return (
          <View>
            <SectionHeader
              title="Sección de Salud"
              subtitle="Gestiona tu bienestar"
              image={require('../../android/app/src/main/assets/salud.png')}
              theme="mountain"
              size="medium"
            />
            <Card
              title="Bienvenido"
              subtitle="Selecciona una sección"
              theme="mountain"
              size="medium"
            >
              <Text>Elige una opción del menú para comenzar</Text>
            </Card>
          </View>
        );
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      <SubsectionTabs
        sections={sections}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        theme="mountain"
        size="medium"
        showIcons={true}
        showLabels={true}
      />
      
      <ScrollView style={{ flex: 1, padding: 16 }}>
        {renderActiveSection()}
      </ScrollView>
    </View>
  );
};

export default HealthSectionsExample;
