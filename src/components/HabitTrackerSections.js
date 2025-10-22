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

const HabitTrackerSections = () => {
  const [activeSection, setActiveSection] = useState('monthly-habit-log');
  
  // Estados para Monthly Habit Log
  const [monthlyHabits, setMonthlyHabits] = useState({
    week1: [
      { id: 1, text: '', completed: [false, false, false, false, false, false, false] },
      { id: 2, text: '', completed: [false, false, false, false, false, false, false] },
      { id: 3, text: '', completed: [false, false, false, false, false, false, false] },
      { id: 4, text: '', completed: [false, false, false, false, false, false, false] }
    ],
    week2: [
      { id: 1, text: '', completed: [false, false, false, false, false, false, false] },
      { id: 2, text: '', completed: [false, false, false, false, false, false, false] },
      { id: 3, text: '', completed: [false, false, false, false, false, false, false] },
      { id: 4, text: '', completed: [false, false, false, false, false, false, false] }
    ],
    week3: [
      { id: 1, text: '', completed: [false, false, false, false, false, false, false] },
      { id: 2, text: '', completed: [false, false, false, false, false, false, false] },
      { id: 3, text: '', completed: [false, false, false, false, false, false, false] },
      { id: 4, text: '', completed: [false, false, false, false, false, false, false] }
    ],
    week4: [
      { id: 1, text: '', completed: [false, false, false, false, false, false, false] },
      { id: 2, text: '', completed: [false, false, false, false, false, false, false] },
      { id: 3, text: '', completed: [false, false, false, false, false, false, false] },
      { id: 4, text: '', completed: [false, false, false, false, false, false, false] }
    ]
  });

  // Estados para Habit & Goal Tracker
  const [habitGoals, setHabitGoals] = useState({
    goals: '',
    reminder: '',
    achievements: '',
    notes: '',
    monthlyTracking: Array(31).fill(false)
  });

  // Estados para Mood Tracker
  const [moodTracker, setMoodTracker] = useState({
    monthlyMoods: Array(12).fill(Array(31).fill('')),
    notes: '',
    yearMantra: ''
  });

  // Estados para Daily Habit Tracker
  const [dailyHabits, setDailyHabits] = useState({
    morning: [
      { id: 1, text: '', completed: [false, false, false, false, false, false, false] },
      { id: 2, text: '', completed: [false, false, false, false, false, false, false] },
      { id: 3, text: '', completed: [false, false, false, false, false, false, false] }
    ],
    afternoon: [
      { id: 1, text: '', completed: [false, false, false, false, false, false, false] },
      { id: 2, text: '', completed: [false, false, false, false, false, false, false] },
      { id: 3, text: '', completed: [false, false, false, false, false, false, false] }
    ],
    evening: [
      { id: 1, text: '', completed: [false, false, false, false, false, false, false] },
      { id: 2, text: '', completed: [false, false, false, false, false, false, false] },
      { id: 3, text: '', completed: [false, false, false, false, false, false, false] }
    ]
  });

  // Estados para Water Tracker
  const [waterTracker, setWaterTracker] = useState({
    week1: Array(7).fill(0),
    week2: Array(7).fill(0),
    week3: Array(7).fill(0),
    week4: Array(7).fill(0)
  });

  // Estados para Habit Monitor
  const [habitMonitor, setHabitMonitor] = useState({
    habits: Array(10).fill(''),
    monthlyTracking: Array(10).fill(Array(31).fill(false))
  });

  const sections = [
    { id: 'monthly-habit-log', name: 'Monthly Habit Log', icon: 'calendar-outline' },
    { id: 'habit-goal-tracker', name: 'Habit & Goal Tracker', icon: 'trophy-outline' },
    { id: 'mood-tracker', name: 'Mood Tracker', icon: 'happy-outline' },
    { id: 'daily-habit-tracker', name: 'Daily Habit Tracker', icon: 'checkmark-circle-outline' },
    { id: 'water-tracker', name: 'Water Tracker', icon: 'water-outline' },
    { id: 'habit-monitor', name: 'Habit Monitor', icon: 'analytics-outline' }
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

  const toggleHabitCompletion = (week, habitId, dayIndex) => {
    setMonthlyHabits(prev => ({
      ...prev,
      [week]: prev[week].map(habit =>
        habit.id === habitId
          ? {
              ...habit,
              completed: habit.completed.map((completed, index) =>
                index === dayIndex ? !completed : completed
              )
            }
          : habit
      )
    }));
  };

  const updateHabitText = (week, habitId, text) => {
    setMonthlyHabits(prev => ({
      ...prev,
      [week]: prev[week].map(habit =>
        habit.id === habitId ? { ...habit, text } : habit
      )
    }));
  };

  const toggleDailyHabitCompletion = (timeOfDay, habitId, dayIndex) => {
    setDailyHabits(prev => ({
      ...prev,
      [timeOfDay]: prev[timeOfDay].map(habit =>
        habit.id === habitId
          ? {
              ...habit,
              completed: habit.completed.map((completed, index) =>
                index === dayIndex ? !completed : completed
              )
            }
          : habit
      )
    }));
  };

  const updateDailyHabitText = (timeOfDay, habitId, text) => {
    setDailyHabits(prev => ({
      ...prev,
      [timeOfDay]: prev[timeOfDay].map(habit =>
        habit.id === habitId ? { ...habit, text } : habit
      )
    }));
  };

  const updateWaterIntake = (week, dayIndex, amount) => {
    setWaterTracker(prev => ({
      ...prev,
      [week]: prev[week].map((intake, index) =>
        index === dayIndex ? Math.min(8, Math.max(0, amount)) : intake
      )
    }));
  };

  const toggleHabitMonitorCompletion = (habitIndex, dayIndex) => {
    setHabitMonitor(prev => ({
      ...prev,
      monthlyTracking: prev.monthlyTracking.map((habitTracking, index) =>
        index === habitIndex
          ? habitTracking.map((completed, dayIdx) =>
              dayIdx === dayIndex ? !completed : completed
            )
          : habitTracking
      )
    }));
  };

  const updateHabitMonitorText = (habitIndex, text) => {
    setHabitMonitor(prev => ({
      ...prev,
      habits: prev.habits.map((habit, index) =>
        index === habitIndex ? text : habit
      )
    }));
  };

  const renderMonthlyHabitLog = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>MONTHLY HABIT LOG</Text>
        <View style={styles.crownIcon}>
          <Icon name="star" size={20} color="#FF6B9D" />
        </View>
      </View>

      {['week1', 'week2', 'week3', 'week4'].map((week, weekIndex) => (
        <View key={week} style={styles.weekSection}>
          <Text style={styles.weekTitle}>WEEK {weekIndex + 1}</Text>
          <View style={styles.weekHeader}>
            <Text style={styles.habitLabel}>HABIT</Text>
            <View style={styles.daysHeader}>
              <Text style={styles.dayLabel}>M</Text>
              <Text style={styles.dayLabel}>T</Text>
              <Text style={styles.dayLabel}>W</Text>
              <Text style={styles.dayLabel}>T</Text>
              <Text style={styles.dayLabel}>F</Text>
              <Text style={styles.dayLabel}>S</Text>
              <Text style={styles.dayLabel}>S</Text>
            </View>
          </View>
          
          {monthlyHabits[week].map((habit) => (
            <View key={habit.id} style={styles.habitRow}>
              <TextInput
                style={styles.habitInput}
                value={habit.text}
                onChangeText={(text) => updateHabitText(week, habit.id, text)}
                placeholder="Escribir hábito..."
                placeholderTextColor="#adb5bd"
              />
              <View style={styles.checkboxesContainer}>
                {habit.completed.map((completed, dayIndex) => (
                  <TouchableOpacity
                    key={dayIndex}
                    style={styles.checkbox}
                    onPress={() => toggleHabitCompletion(week, habit.id, dayIndex)}
                  >
                    <Icon
                      name={completed ? 'checkbox' : 'square-outline'}
                      size={16}
                      color={completed ? '#4CAF50' : '#6c757d'}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </View>
      ))}
    </View>
  );

  const renderHabitGoalTracker = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>HABIT & GOAL TRACKER</Text>
        <View style={styles.crownIcon}>
          <Icon name="star" size={20} color="#FF6B9D" />
        </View>
      </View>

      <View style={styles.goalTrackerContent}>
        <View style={styles.goalInputsColumn}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>GOALS</Text>
            <TextInput
              style={styles.textInput}
              value={habitGoals.goals}
              onChangeText={(text) => setHabitGoals({...habitGoals, goals: text})}
              placeholder="Mis objetivos..."
              multiline
              numberOfLines={3}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>REMINDER</Text>
            <TextInput
              style={styles.textInput}
              value={habitGoals.reminder}
              onChangeText={(text) => setHabitGoals({...habitGoals, reminder: text})}
              placeholder="Recordatorios importantes..."
              multiline
              numberOfLines={2}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>ACHIEVEMENTS</Text>
            <TextInput
              style={styles.textInput}
              value={habitGoals.achievements}
              onChangeText={(text) => setHabitGoals({...habitGoals, achievements: text})}
              placeholder="Mis logros..."
              multiline
              numberOfLines={3}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>NOTES</Text>
            <TextInput
              style={styles.textInput}
              value={habitGoals.notes}
              onChangeText={(text) => setHabitGoals({...habitGoals, notes: text})}
              placeholder="Notas adicionales..."
              multiline
              numberOfLines={2}
            />
          </View>
        </View>

        <View style={styles.monthlyGridColumn}>
          <View style={styles.monthlyGridHeader}>
            {Array.from({ length: 31 }, (_, i) => (
              <Text key={i} style={styles.dayNumber}>{i + 1}</Text>
            ))}
          </View>
          
          <View style={styles.monthlyGrid}>
            {Array.from({ length: 5 }, (_, rowIndex) => (
              <View key={rowIndex} style={styles.gridRow}>
                <TextInput
                  style={styles.habitNameInput}
                  placeholder="Hábito"
                  placeholderTextColor="#adb5bd"
                />
                {Array.from({ length: 31 }, (_, dayIndex) => (
                  <TouchableOpacity
                    key={dayIndex}
                    style={styles.gridCheckbox}
                    onPress={() => {
                      const newTracking = [...habitGoals.monthlyTracking];
                      newTracking[dayIndex] = !newTracking[dayIndex];
                      setHabitGoals({...habitGoals, monthlyTracking: newTracking});
                    }}
                  >
                    <Icon
                      name={habitGoals.monthlyTracking[dayIndex] ? 'checkbox' : 'square-outline'}
                      size={12}
                      color={habitGoals.monthlyTracking[dayIndex] ? '#4CAF50' : '#6c757d'}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );

  const renderMoodTracker = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>MOOD TRACKER</Text>
        <View style={styles.crownIcon}>
          <Icon name="star" size={20} color="#FF6B9D" />
        </View>
      </View>

      <View style={styles.moodTrackerContent}>
        <View style={styles.moodGridHeader}>
          <Text style={styles.monthLabel}>JAN</Text>
          <Text style={styles.monthLabel}>FEB</Text>
          <Text style={styles.monthLabel}>MAR</Text>
          <Text style={styles.monthLabel}>APR</Text>
          <Text style={styles.monthLabel}>MAY</Text>
          <Text style={styles.monthLabel}>JUN</Text>
          <Text style={styles.monthLabel}>JUL</Text>
          <Text style={styles.monthLabel}>AUG</Text>
          <Text style={styles.monthLabel}>SEP</Text>
          <Text style={styles.monthLabel}>OCT</Text>
          <Text style={styles.monthLabel}>NOV</Text>
          <Text style={styles.monthLabel}>DEC</Text>
        </View>
        
        <View style={styles.moodGrid}>
          {Array.from({ length: 31 }, (_, dayIndex) => (
            <View key={dayIndex} style={styles.moodRow}>
              <Text style={styles.dayNumber}>{dayIndex + 1}</Text>
              {Array.from({ length: 12 }, (_, monthIndex) => (
                <TouchableOpacity
                  key={monthIndex}
                  style={styles.moodCell}
                  onPress={() => {
                    const newMoods = [...moodTracker.monthlyMoods];
                    newMoods[monthIndex] = [...newMoods[monthIndex]];
                    newMoods[monthIndex][dayIndex] = newMoods[monthIndex][dayIndex] ? '' : '😊';
                    setMoodTracker({...moodTracker, monthlyMoods: newMoods});
                  }}
                >
                  <Text style={styles.moodEmoji}>
                    {moodTracker.monthlyMoods[monthIndex][dayIndex]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>
        
        <View style={styles.moodNotesSection}>
          <View style={styles.notesColumn}>
            <Text style={styles.inputLabel}>NOTES</Text>
            <TextInput
              style={styles.textInput}
              value={moodTracker.notes}
              onChangeText={(text) => setMoodTracker({...moodTracker, notes: text})}
              placeholder="Notas sobre el estado de ánimo..."
              multiline
              numberOfLines={3}
            />
          </View>
          
          <View style={styles.mantraColumn}>
            <Text style={styles.inputLabel}>YEAR'S MANTRA</Text>
            <TextInput
              style={styles.textInput}
              value={moodTracker.yearMantra}
              onChangeText={(text) => setMoodTracker({...moodTracker, yearMantra: text})}
              placeholder="Mi mantra del año..."
              multiline
              numberOfLines={3}
            />
          </View>
        </View>
      </View>
    </View>
  );

  const renderDailyHabitTracker = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>DAILY HABIT TRACKER</Text>
        <View style={styles.crownIcon}>
          <Icon name="star" size={20} color="#FF6B9D" />
        </View>
      </View>

      {[
        { key: 'morning', title: 'Morning Habits' },
        { key: 'afternoon', title: 'Afternoon Habits' },
        { key: 'evening', title: 'Evening Habits' }
      ].map(({ key, title }) => (
        <View key={key} style={styles.dailyHabitSection}>
          <Text style={styles.dailyHabitTitle}>{title}</Text>
          <View style={styles.dailyHabitHeader}>
            <Text style={styles.habitLabel}>HABIT</Text>
            <View style={styles.daysHeader}>
              <Text style={styles.dayLabel}>M</Text>
              <Text style={styles.dayLabel}>T</Text>
              <Text style={styles.dayLabel}>W</Text>
              <Text style={styles.dayLabel}>T</Text>
              <Text style={styles.dayLabel}>F</Text>
              <Text style={styles.dayLabel}>S</Text>
              <Text style={styles.dayLabel}>S</Text>
            </View>
          </View>
          
          {dailyHabits[key].map((habit) => (
            <View key={habit.id} style={styles.habitRow}>
              <TextInput
                style={styles.habitInput}
                value={habit.text}
                onChangeText={(text) => updateDailyHabitText(key, habit.id, text)}
                placeholder="Escribir hábito..."
                placeholderTextColor="#adb5bd"
              />
              <View style={styles.checkboxesContainer}>
                {habit.completed.map((completed, dayIndex) => (
                  <TouchableOpacity
                    key={dayIndex}
                    style={styles.checkbox}
                    onPress={() => toggleDailyHabitCompletion(key, habit.id, dayIndex)}
                  >
                    <Icon
                      name={completed ? 'checkbox' : 'square-outline'}
                      size={16}
                      color={completed ? '#4CAF50' : '#6c757d'}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </View>
      ))}
    </View>
  );

  const renderWaterTracker = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>WATER TRACKER</Text>
        <View style={styles.crownIcon}>
          <Icon name="star" size={20} color="#FF6B9D" />
        </View>
      </View>

      <View style={styles.waterTrackerContent}>
        <View style={styles.waterGridHeader}>
          <Text style={styles.dayLabel}>Mon</Text>
          <Text style={styles.dayLabel}>Tue</Text>
          <Text style={styles.dayLabel}>Wed</Text>
          <Text style={styles.dayLabel}>Thu</Text>
          <Text style={styles.dayLabel}>Fri</Text>
          <Text style={styles.dayLabel}>Sat</Text>
          <Text style={styles.dayLabel}>Sun</Text>
        </View>
        
        {['week1', 'week2', 'week3', 'week4'].map((week, weekIndex) => (
          <View key={week} style={styles.waterWeekSection}>
            <Text style={styles.weekTitle}>Week {weekIndex + 1}</Text>
            <View style={styles.waterWeekRow}>
              {waterTracker[week].map((intake, dayIndex) => (
                <View key={dayIndex} style={styles.waterDayColumn}>
                  <View style={styles.waterIconsContainer}>
                    {Array.from({ length: 8 }, (_, iconIndex) => (
                      <TouchableOpacity
                        key={iconIndex}
                        style={styles.waterIcon}
                        onPress={() => updateWaterIntake(week, dayIndex, iconIndex + 1)}
                      >
                        <Icon
                          name={iconIndex < intake ? 'water' : 'water-outline'}
                          size={16}
                          color={iconIndex < intake ? '#4FC3F7' : '#6c757d'}
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
                  <Text style={styles.waterAmount}>{intake}/8</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderHabitMonitor = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>HABIT MONITOR</Text>
        <View style={styles.crownIcon}>
          <Icon name="star" size={20} color="#FF6B9D" />
        </View>
      </View>

      <View style={styles.habitMonitorContent}>
        <View style={styles.monitorGridHeader}>
          {Array.from({ length: 31 }, (_, i) => (
            <Text key={i} style={styles.dayNumber}>{i + 1}</Text>
          ))}
        </View>
        
        <View style={styles.monitorGrid}>
          {habitMonitor.habits.map((habit, habitIndex) => (
            <View key={habitIndex} style={styles.monitorRow}>
              <TextInput
                style={styles.habitNameInput}
                value={habit}
                onChangeText={(text) => updateHabitMonitorText(habitIndex, text)}
                placeholder="Nombre del hábito"
                placeholderTextColor="#adb5bd"
              />
              {habitMonitor.monthlyTracking[habitIndex].map((completed, dayIndex) => (
                <TouchableOpacity
                  key={dayIndex}
                  style={styles.monitorCheckbox}
                  onPress={() => toggleHabitMonitorCompletion(habitIndex, dayIndex)}
                >
                  <Icon
                    name={completed ? 'checkbox' : 'square-outline'}
                    size={12}
                    color={completed ? '#4CAF50' : '#6c757d'}
                  />
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'monthly-habit-log':
        return renderMonthlyHabitLog();
      case 'habit-goal-tracker':
        return renderHabitGoalTracker();
      case 'mood-tracker':
        return renderMoodTracker();
      case 'daily-habit-tracker':
        return renderDailyHabitTracker();
      case 'water-tracker':
        return renderWaterTracker();
      case 'habit-monitor':
        return renderHabitMonitor();
      default:
        return renderMonthlyHabitLog();
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
    backgroundColor: '#FF6B9D',
    borderColor: '#FF6B9D',
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
  crownIcon: {
    padding: 4,
  },
  weekSection: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#FF6B9D',
  },
  weekTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B9D',
    marginBottom: 12,
  },
  weekHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  habitLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#495057',
    flex: 1,
  },
  daysHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 120,
  },
  dayLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#495057',
    textAlign: 'center',
    width: 16,
  },
  habitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  habitInput: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
    paddingVertical: 4,
    fontSize: 14,
    color: '#495057',
  },
  checkboxesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 120,
    marginLeft: 8,
  },
  checkbox: {
    padding: 2,
  },
  goalTrackerContent: {
    flexDirection: 'row',
  },
  goalInputsColumn: {
    flex: 1,
    marginRight: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#495057',
    marginBottom: 6,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#FF6B9D',
    borderRadius: 6,
    padding: 8,
    fontSize: 12,
    color: '#495057',
    backgroundColor: '#ffffff',
  },
  monthlyGridColumn: {
    flex: 1,
  },
  monthlyGridHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dayNumber: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#495057',
    textAlign: 'center',
    width: 12,
  },
  monthlyGrid: {
    maxHeight: 200,
  },
  gridRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  habitNameInput: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
    paddingVertical: 2,
    fontSize: 10,
    color: '#495057',
    marginRight: 4,
  },
  gridCheckbox: {
    padding: 1,
    width: 12,
    alignItems: 'center',
  },
  moodTrackerContent: {
    flex: 1,
  },
  moodGridHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    backgroundColor: '#FF6B9D',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 4,
  },
  monthLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    flex: 1,
  },
  moodGrid: {
    maxHeight: 300,
  },
  moodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  moodCell: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dee2e6',
    marginHorizontal: 1,
  },
  moodEmoji: {
    fontSize: 12,
  },
  moodNotesSection: {
    flexDirection: 'row',
    marginTop: 16,
  },
  notesColumn: {
    flex: 1,
    marginRight: 8,
  },
  mantraColumn: {
    flex: 1,
    marginLeft: 8,
  },
  dailyHabitSection: {
    marginBottom: 20,
  },
  dailyHabitTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF6B9D',
    marginBottom: 8,
  },
  waterTrackerContent: {
    flex: 1,
  },
  waterGridHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    backgroundColor: '#FF6B9D',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 4,
  },
  waterWeekSection: {
    marginBottom: 16,
  },
  waterWeekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  waterDayColumn: {
    alignItems: 'center',
    flex: 1,
  },
  waterIconsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: 40,
    marginBottom: 4,
  },
  waterIcon: {
    padding: 1,
  },
  waterAmount: {
    fontSize: 10,
    color: '#495057',
    fontWeight: '500',
  },
  habitMonitorContent: {
    flex: 1,
  },
  monitorGridHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  monitorGrid: {
    maxHeight: 300,
  },
  monitorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  monitorCheckbox: {
    padding: 1,
    width: 12,
    alignItems: 'center',
  },
});

export default HabitTrackerSections;
