import AsyncStorage from '@react-native-async-storage/async-storage';
// import { database, auth } from '../config/supabase';

class DataService {
  constructor() {
    this.isOnline = true;
    this.syncQueue = [];
  }

  // Verificar conexión a internet
  checkConnection = async () => {
    try {
      // Aquí podrías implementar una verificación real de conexión
      return this.isOnline;
    } catch (error) {
      return false;
    }
  };

  // Obtener datos del usuario (con fallback a AsyncStorage)
  getUserData = async (userId) => {
    try {
      const isOnline = await this.checkConnection();
      
      // if (isOnline) {
      //   // Intentar obtener de Supabase
      //   const { data, error } = await database.getUserData(userId);
      //   
      //   if (!error && data) {
      //     // Guardar en AsyncStorage como backup
      //     await AsyncStorage.setItem(`user_data_${userId}`, JSON.stringify(data.data));
      //     return data.data;
      //   }
      // }
      
      // Fallback a AsyncStorage
      const localData = await AsyncStorage.getItem(`user_data_${userId}`);
      return localData ? JSON.parse(localData) : this.getDefaultUserData();
      
    } catch (error) {
      console.error('Error getting user data:', error);
      // Fallback a AsyncStorage
      const localData = await AsyncStorage.getItem(`user_data_${userId}`);
      return localData ? JSON.parse(localData) : this.getDefaultUserData();
    }
  };

  // Guardar datos del usuario
  saveUserData = async (userId, data) => {
    try {
      // Siempre guardar localmente primero
      await AsyncStorage.setItem(`user_data_${userId}`, JSON.stringify(data));
      
      const isOnline = await this.checkConnection();
      
      // if (isOnline) {
      //   // Intentar sincronizar con Supabase
      //   const { error } = await database.saveUserData(userId, data);
      //   
      //   if (error) {
      //     console.warn('Error syncing to Supabase:', error);
      //     // Agregar a cola de sincronización
      //     this.addToSyncQueue(userId, data);
      //   }
      // } else {
      //   // Agregar a cola de sincronización
      //   this.addToSyncQueue(userId, data);
      // }
      
      return { success: true };
    } catch (error) {
      console.error('Error saving user data:', error);
      return { success: false, error };
    }
  };

  // Agregar a cola de sincronización
  addToSyncQueue = (userId, data) => {
    this.syncQueue.push({
      userId,
      data,
      timestamp: Date.now()
    });
  };

  // Sincronizar cola pendiente
  syncPendingData = async () => {
    // if (this.syncQueue.length === 0) return;
    
    // const isOnline = await this.checkConnection();
    // if (!isOnline) return;
    
    // const queue = [...this.syncQueue];
    // this.syncQueue = [];
    
    // for (const item of queue) {
    //   try {
    //     const { error } = await database.saveUserData(item.userId, item.data);
    //     if (error) {
    //       console.warn('Failed to sync item:', error);
    //       // Re-agregar a la cola si falla
    //       this.syncQueue.push(item);
    //     }
    //   } catch (error) {
    //     console.error('Sync error:', error);
    //     this.syncQueue.push(item);
    //   }
    // }
  };

  // Datos por defecto para nuevos usuarios
  getDefaultUserData = () => ({
    work: {
      priorities: [],
      goals: [],
      focus: [],
      projects: [],
      dailyTasks: []
    },
    school: {
      timetable: {},
      tasks: {
        academic: []
      },
      projects: [],
      exams: [],
      materials: {
        textbooks: [],
        onlineResources: []
      },
      classOverview: {
        course: '',
        time: '',
        location: '',
        instructor: '',
        contactInfo: '',
        officeHours: '',
        accessInfo: '',
        account: '',
        login: '',
        password: '',
        importantDates: [],
        notes: '',
        gradingComponents: [],
        targetGrade: '',
        actualGrade: ''
      }
    },
    health: {
      meals: [],
      water: { goal: 8, current: 0 },
      exercise: [],
      nutrition: {
        recipes: [],
        mealPlans: [],
        shoppingList: []
      }
    },
    personal: {
      profile: {
        name: '',
        email: '',
        avatar: null
      },
      settings: {
        activeSections: {
          work: true,
          school: true,
          health: true,
          personal: true
        }
      }
    }
  });

  // Exportar datos del usuario
  exportUserData = async (userId) => {
    try {
      const data = await this.getUserData(userId);
      return {
        exportDate: new Date().toISOString(),
        version: '1.0',
        data: data
      };
    } catch (error) {
      console.error('Export error:', error);
      return null;
    }
  };

  // Importar datos del usuario
  importUserData = async (userId, importedData) => {
    try {
      if (importedData.version && importedData.data) {
        await this.saveUserData(userId, importedData.data);
        return { success: true };
      }
      return { success: false, error: 'Invalid data format' };
    } catch (error) {
      console.error('Import error:', error);
      return { success: false, error };
    }
  };

  // Limpiar datos del usuario
  clearUserData = async (userId) => {
    try {
      await AsyncStorage.removeItem(`user_data_${userId}`);
      // También limpiar de Supabase si está online
      const isOnline = await this.checkConnection();
      if (isOnline) {
        await database.saveUserData(userId, this.getDefaultUserData());
      }
      return { success: true };
    } catch (error) {
      console.error('Clear data error:', error);
      return { success: false, error };
    }
  };
}

// Instancia singleton
const dataService = new DataService();
export default dataService;
