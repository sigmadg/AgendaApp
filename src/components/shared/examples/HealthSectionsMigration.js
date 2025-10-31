import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
} from 'react-native';
import { SectionHeader, SubsectionTabs, Button, Card } from '../index';
import { useTheme } from '../hooks/useTheme';

const HealthSectionsMigration = () => {
  const [activeSection, setActiveSection] = useState('meal-planner');
  const { getThemeColors, currentTheme } = useTheme();

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

  const themeColors = getThemeColors();

  const renderMealPlanner = () => (
    <View>
      {/* ANTES: Encabezado hardcodeado */}
      {/* 
      <View style={styles.sectionHeader}>
        <View style={styles.headerDecoration}>
          <Image source={require('../../assets/salud.png')} style={styles.mascotImage} />
        </View>
        <View style={styles.headerContent}>
          <Text style={styles.sectionTitle}>Planificador de Comidas</Text>
          <Text style={styles.sectionSubtitle}>Organiza tu alimentación saludable</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={handleAddMeal}>
          <Icon name="add" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      */}

      {/* DESPUÉS: Componente reutilizable */}
      <SectionHeader
        title="Planificador de Comidas"
        subtitle="Organiza tu alimentación saludable"
        image={require('../../android/app/src/main/assets/salud.png')}
        onAddPress={() => console.log('Agregar comida')}
        theme={currentTheme}
        size="medium"
      />

      {/* Resumen nutricional */}
      <View style={{ flexDirection: 'row', marginBottom: 16, gap: 12 }}>
        <Card
          title="Comidas Planificadas"
          subtitle="3/3"
          icon="restaurant-outline"
          theme={currentTheme}
          size="small"
          style={{ flex: 1 }}
        />
        <Card
          title="Hidratación"
          subtitle="0/8 vasos"
          icon="water-outline"
          theme={currentTheme}
          size="small"
          style={{ flex: 1 }}
        />
        <Card
          title="Calorías"
          subtitle="1,850 kcal"
          icon="flame-outline"
          theme={currentTheme}
          size="small"
          style={{ flex: 1 }}
        />
      </View>

      {/* Plan del día */}
      <Card
        title="Plan de Hoy"
        subtitle="viernes, 24 de octubre"
        icon="calendar-outline"
        theme={currentTheme}
        size="medium"
      >
        <View style={{ gap: 12 }}>
          <Card
            title="Desayuno"
            subtitle="7:00 - 9:00 AM"
            icon="sunny-outline"
            theme={currentTheme}
            size="small"
            variant="outlined"
          >
            <Text style={{ color: themeColors.textMuted, marginBottom: 8 }}>
              No planificado
            </Text>
            <Button
              title="Agregar"
              onPress={() => console.log('Agregar desayuno')}
              variant="primary"
              size="small"
              theme={currentTheme}
            />
          </Card>

          <Card
            title="Comida"
            subtitle="12:00 - 14:00 PM"
            icon="sunny-outline"
            theme={currentTheme}
            size="small"
            variant="outlined"
          >
            <Text style={{ color: themeColors.textMuted, marginBottom: 8 }}>
              No planificado
            </Text>
            <Button
              title="Agregar"
              onPress={() => console.log('Agregar comida')}
              variant="primary"
              size="small"
              theme={currentTheme}
            />
          </Card>

          <Card
            title="Cena"
            subtitle="19:00 - 21:00 PM"
            icon="moon-outline"
            theme={currentTheme}
            size="small"
            variant="outlined"
          >
            <Text style={{ color: themeColors.textMuted, marginBottom: 8 }}>
              No planificado
            </Text>
            <Button
              title="Agregar"
              onPress={() => console.log('Agregar cena')}
              variant="primary"
              size="small"
              theme={currentTheme}
            />
          </Card>
        </View>
      </Card>
    </View>
  );

  const renderRecipes = () => (
    <View>
      <SectionHeader
        title="Recetas"
        subtitle="Descubre nuevas recetas saludables"
        image={require('../../android/app/src/main/assets/salud.png')}
        onAddPress={() => console.log('Agregar receta')}
        theme={currentTheme}
        size="medium"
      />

      <View style={{ gap: 12 }}>
        <Card
          title="Ensalada César"
          subtitle="Fácil • 15 min • 4 porciones"
          icon="leaf-outline"
          theme={currentTheme}
          size="medium"
          onPress={() => console.log('Ver receta')}
        >
          <Text style={{ color: themeColors.textSecondary, marginBottom: 12 }}>
            Ingredientes frescos y nutritivos
          </Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Button
              title="Ver Receta"
              onPress={() => console.log('Ver receta')}
              variant="outline"
              size="small"
              theme={currentTheme}
            />
            <Button
              title="Agregar a Plan"
              onPress={() => console.log('Agregar a plan')}
              variant="primary"
              size="small"
              theme={currentTheme}
            />
          </View>
        </Card>

        <Card
          title="Salmón a la Plancha"
          subtitle="Intermedio • 25 min • 2 porciones"
          icon="fish-outline"
          theme={currentTheme}
          size="medium"
          onPress={() => console.log('Ver receta')}
        >
          <Text style={{ color: themeColors.textSecondary, marginBottom: 12 }}>
            Rico en omega-3 y proteínas
          </Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Button
              title="Ver Receta"
              onPress={() => console.log('Ver receta')}
              variant="outline"
              size="small"
              theme={currentTheme}
            />
            <Button
              title="Agregar a Plan"
              onPress={() => console.log('Agregar a plan')}
              variant="primary"
              size="small"
              theme={currentTheme}
            />
          </View>
        </Card>
      </View>
    </View>
  );

  const renderGymRoutine = () => (
    <View>
      <SectionHeader
        title="Rutina de Gimnasio"
        subtitle="Planifica tus entrenamientos"
        image={require('../../android/app/src/main/assets/salud.png')}
        onAddPress={() => console.log('Agregar entrenamiento')}
        theme={currentTheme}
        size="medium"
      />

      <View style={{ gap: 12 }}>
        <Card
          title="Entrenamiento de Fuerza"
          subtitle="Lunes • 18:00 - 19:30"
          icon="barbell-outline"
          theme={currentTheme}
          size="medium"
        >
          <Text style={{ color: themeColors.textSecondary, marginBottom: 12 }}>
            Ejercicios: Press banca, Sentadillas, Peso muerto
          </Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Button
              title="Comenzar"
              onPress={() => console.log('Comenzar entrenamiento')}
              variant="success"
              size="small"
              theme={currentTheme}
              icon="play"
            />
            <Button
              title="Editar"
              onPress={() => console.log('Editar entrenamiento')}
              variant="outline"
              size="small"
              theme={currentTheme}
              icon="create"
            />
          </View>
        </Card>

        <Card
          title="Cardio"
          subtitle="Miércoles • 07:00 - 08:00"
          icon="heart-outline"
          theme={currentTheme}
          size="medium"
        >
          <Text style={{ color: themeColors.textSecondary, marginBottom: 12 }}>
            Correr 30 min, Bicicleta 15 min
          </Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Button
              title="Comenzar"
              onPress={() => console.log('Comenzar cardio')}
              variant="success"
              size="small"
              theme={currentTheme}
              icon="play"
            />
            <Button
              title="Editar"
              onPress={() => console.log('Editar cardio')}
              variant="outline"
              size="small"
              theme={currentTheme}
              icon="create"
            />
          </View>
        </Card>
      </View>
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
              theme={currentTheme}
              size="medium"
            />
            <Card
              title="Bienvenido"
              subtitle="Selecciona una sección"
              theme={currentTheme}
              size="medium"
            >
              <Text style={{ color: themeColors.textSecondary }}>
                Elige una opción del menú para comenzar
              </Text>
            </Card>
          </View>
        );
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: themeColors.background }}>
      {/* ANTES: Barra de subsecciones hardcodeada */}
      {/* 
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {sections.map((section) => (
            <TouchableOpacity
              key={section.id}
              style={[styles.tab, activeSection === section.id && styles.activeTab]}
              onPress={() => setActiveSection(section.id)}
            >
              <Icon name={section.icon} size={20} color={activeSection === section.id ? '#FFFFFF' : '#4A6741'} />
              <Text style={[styles.tabText, activeSection === section.id && styles.activeTabText]}>
                {section.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      */}

      {/* DESPUÉS: Componente reutilizable */}
      <SubsectionTabs
        sections={sections}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        theme={currentTheme}
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

export default HealthSectionsMigration;
