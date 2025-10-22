import AsyncStorage from '@react-native-async-storage/async-storage';

const TASKS_KEY = 'agenda_tasks';
const EVENTS_KEY = 'agenda_events';

// Tasks functions
export const saveTasks = async (tasks) => {
  try {
    await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving tasks:', error);
    throw error;
  }
};

export const loadTasks = async () => {
  try {
    const tasks = await AsyncStorage.getItem(TASKS_KEY);
    return tasks ? JSON.parse(tasks) : {};
  } catch (error) {
    console.error('Error loading tasks:', error);
    return {};
  }
};

export const clearAllTasks = async () => {
  try {
    await AsyncStorage.removeItem(TASKS_KEY);
  } catch (error) {
    console.error('Error clearing tasks:', error);
    throw error;
  }
};

// Events functions
export const saveEvents = async (events) => {
  try {
    await AsyncStorage.setItem(EVENTS_KEY, JSON.stringify(events));
  } catch (error) {
    console.error('Error saving events:', error);
    throw error;
  }
};

export const loadEvents = async () => {
  try {
    const events = await AsyncStorage.getItem(EVENTS_KEY);
    return events ? JSON.parse(events) : {};
  } catch (error) {
    console.error('Error loading events:', error);
    return {};
  }
};

// Category-specific events functions
export const saveCategoryEvents = async (category, events) => {
  try {
    const key = `events_${category}`;
    await AsyncStorage.setItem(key, JSON.stringify(events));
  } catch (error) {
    console.error(`Error saving events for category ${category}:`, error);
    throw error;
  }
};

export const loadCategoryEvents = async (category) => {
  try {
    const key = `events_${category}`;
    const events = await AsyncStorage.getItem(key);
    return events ? JSON.parse(events) : {};
  } catch (error) {
    console.error(`Error loading events for category ${category}:`, error);
    return {};
  }
};

export const loadAllCategoryEvents = async () => {
  try {
    const categories = ['personal', 'work', 'school', 'nutrition', 'exercise', 'languages', 'menstrual'];
    const allEvents = {};
    
    for (const category of categories) {
      allEvents[category] = await loadCategoryEvents(category);
    }
    
    return allEvents;
  } catch (error) {
    console.error('Error loading all category events:', error);
    return {};
  }
};

export const clearAllEvents = async () => {
  try {
    await AsyncStorage.removeItem(EVENTS_KEY);
  } catch (error) {
    console.error('Error clearing events:', error);
    throw error;
  }
};

// Combined functions
export const clearAllData = async () => {
  try {
    await AsyncStorage.multiRemove([TASKS_KEY, EVENTS_KEY]);
  } catch (error) {
    console.error('Error clearing all data:', error);
    throw error;
  }
};
