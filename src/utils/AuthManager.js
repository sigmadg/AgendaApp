import AsyncStorage from '@react-native-async-storage/async-storage';
import userManager from './UserManager';
// import { auth } from '../config/supabase';

class AuthManager {
  constructor() {
    this.isAuthenticated = false;
    this.user = null;
    this.listeners = [];
  }

  // Suscribirse a cambios de autenticación
  addAuthListener(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  // Notificar a todos los listeners
  notifyListeners() {
    this.listeners.forEach(callback => {
      callback(this.isAuthenticated, this.user);
    });
  }

  // Iniciar sesión
  async login(userData, rememberMe = false) {
    try {
      let user;
      
      // Si es login social, usar datos directamente
      if (userData.provider && userData.provider !== 'email') {
        user = {
          id: userData.email,
          email: userData.email,
          name: userData.name || 'Usuario',
          provider: userData.provider,
          avatar: userData.avatar,
          loginTime: new Date().toISOString(),
          rememberMe: rememberMe,
        };
      } else {
        // Intentar autenticación con Supabase primero
        // try {
        //   const { data, error } = await auth.signIn(userData.email, userData.password);
        //   if (error) throw error;
        //   
        //   user = {
        //   id: data.user.id,
        //   email: data.user.email,
        //   name: data.user.user_metadata?.name || data.user.email.split('@')[0],
        //   provider: 'supabase',
        //   avatar: userData.avatar,
        //   loginTime: new Date().toISOString(),
        //   rememberMe: rememberMe,
        // };
        // } catch (supabaseError) {
        //   console.log('Supabase auth failed, trying local auth:', supabaseError.message);
          
          // Fallback a autenticación local
          const authResult = await userManager.authenticateUser(userData.email, userData.password);
          
          if (!authResult.success) {
            return { success: false, error: authResult.error };
          }

          user = {
            id: authResult.user.id,
            email: authResult.user.email,
            name: authResult.user.name,
            provider: 'email',
            avatar: userData.avatar,
            loginTime: new Date().toISOString(),
            rememberMe: rememberMe,
          };
        // }
      }

      // Guardar datos de sesión
      await AsyncStorage.setItem('userSession', JSON.stringify(user));
      await AsyncStorage.setItem('isAuthenticated', 'true');
      
      // Si "Recordarme" está activado, guardar por más tiempo
      if (rememberMe) {
        await AsyncStorage.setItem('rememberMe', 'true');
        await AsyncStorage.setItem('rememberMeExpiry', new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()); // 30 días
      } else {
        await AsyncStorage.removeItem('rememberMe');
        await AsyncStorage.removeItem('rememberMeExpiry');
      }

      this.user = user;
      this.isAuthenticated = true;
      this.notifyListeners();

      return { success: true, user };
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      return { success: false, error: error.message };
    }
  }

  // Registro de usuario
  async register(userData) {
    try {
      // Intentar registro con Supabase primero
      // try {
      //   const { data, error } = await auth.signUp(userData.email, userData.password, {
      //     name: userData.name
      //   });
      //   
      //   if (error) throw error;
      //   
      //   return { 
      //     success: true, 
      //     user: {
      //       id: data.user.id,
      //       email: data.user.email,
      //       name: userData.name,
      //       provider: 'supabase'
      //     }
      //   };
      // } catch (supabaseError) {
      //   console.log('Supabase registration failed, trying local registration:', supabaseError.message);
        
        // Fallback a registro local
        const result = await userManager.registerUser(userData);
        return result;
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.message };
    }
  }

  // Cerrar sesión
  async logout() {
    try {
      // Cerrar sesión en Supabase si el usuario está autenticado con Supabase
      // if (this.user && this.user.provider === 'supabase') {
      //   try {
      //     await auth.signOut();
      //   } catch (supabaseError) {
      //     console.log('Supabase logout error:', supabaseError.message);
      //   }
      // }
      
      // Limpiar datos de sesión
      await AsyncStorage.removeItem('userSession');
      await AsyncStorage.removeItem('isAuthenticated');
      await AsyncStorage.removeItem('rememberMe');
      await AsyncStorage.removeItem('rememberMeExpiry');

      this.user = null;
      this.isAuthenticated = false;
      this.notifyListeners();

      return { success: true };
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      return { success: false, error: error.message };
    }
  }

  // Verificar sesión existente
  async checkSession() {
    try {
      const isAuthenticated = await AsyncStorage.getItem('isAuthenticated');
      const userSession = await AsyncStorage.getItem('userSession');
      const rememberMe = await AsyncStorage.getItem('rememberMe');
      const rememberMeExpiry = await AsyncStorage.getItem('rememberMeExpiry');

      if (isAuthenticated === 'true' && userSession) {
        const user = JSON.parse(userSession);
        
        // Verificar si "Recordarme" está activado
        if (rememberMe === 'true' && rememberMeExpiry) {
          const expiryDate = new Date(rememberMeExpiry);
          const now = new Date();
          
          if (now < expiryDate) {
            // Sesión válida con "Recordarme"
            this.user = user;
            this.isAuthenticated = true;
            this.notifyListeners();
            return { success: true, user };
          } else {
            // "Recordarme" expirado
            await this.logout();
            return { success: false, error: 'Sesión recordada expirada' };
          }
        } else {
          // Verificar si la sesión normal no ha expirado (24 horas)
          const loginTime = new Date(user.loginTime);
          const now = new Date();
          const hoursDiff = (now - loginTime) / (1000 * 60 * 60);

          if (hoursDiff < 24) {
            this.user = user;
            this.isAuthenticated = true;
            this.notifyListeners();
            return { success: true, user };
          } else {
            // Sesión expirada
            await this.logout();
            return { success: false, error: 'Sesión expirada' };
          }
        }
      }

      return { success: false, error: 'No hay sesión activa' };
    } catch (error) {
      console.error('Error al verificar sesión:', error);
      return { success: false, error: error.message };
    }
  }

  // Registrar nuevo usuario
  async register(userData) {
    try {
      const result = await userManager.registerUser(userData);
      return result;
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      return { success: false, error: error.message };
    }
  }

  // Obtener usuario actual
  getCurrentUser() {
    return this.user;
  }

  // Verificar si está autenticado
  isLoggedIn() {
    return this.isAuthenticated;
  }

  // Actualizar perfil de usuario
  async updateProfile(profileData) {
    try {
      if (!this.isAuthenticated) {
        return { success: false, error: 'Usuario no autenticado' };
      }

      // Si es cambio de contraseña
      if (profileData.currentPassword && profileData.newPassword) {
        const result = await userManager.changePassword(
          this.user.email,
          profileData.currentPassword,
          profileData.newPassword
        );
        return result;
      }

      // Si es actualización de perfil normal
      const result = await userManager.updateUserProfile(this.user.email, profileData);
      
      if (result.success) {
        const updatedUser = {
          ...this.user,
          ...result.user,
          lastUpdated: new Date().toISOString(),
        };

        await AsyncStorage.setItem('userSession', JSON.stringify(updatedUser));
        this.user = updatedUser;
        this.notifyListeners();

        return { success: true, user: updatedUser };
      }

      return result;
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      return { success: false, error: error.message };
    }
  }

  // Cambiar contraseña
  async changePassword(currentPassword, newPassword) {
    try {
      if (!this.isAuthenticated) {
        return { success: false, error: 'Usuario no autenticado' };
      }

      // Simular validación de contraseña actual (aquí iría la lógica real)
      if (currentPassword !== 'demo123') {
        return { success: false, error: 'Contraseña actual incorrecta' };
      }

      // Simular cambio de contraseña (aquí iría la lógica real con API)
      await new Promise(resolve => setTimeout(resolve, 1000));

      return { success: true };
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      return { success: false, error: error.message };
    }
  }

  // Obtener estadísticas de sesión
  getSessionStats() {
    if (!this.user) {
      return null;
    }

    const loginTime = new Date(this.user.loginTime);
    const now = new Date();
    const sessionDuration = Math.floor((now - loginTime) / (1000 * 60)); // en minutos

    return {
      loginTime: loginTime.toLocaleString('es-ES'),
      sessionDuration: `${sessionDuration} minutos`,
      user: this.user,
    };
  }

  // Limpiar datos de la aplicación (para logout completo)
  async clearAllData() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      await AsyncStorage.multiRemove(keys);
      
      this.user = null;
      this.isAuthenticated = false;
      this.notifyListeners();

      return { success: true };
    } catch (error) {
      console.error('Error al limpiar datos:', error);
      return { success: false, error: error.message };
    }
  }
}

// Crear instancia singleton
const authManager = new AuthManager();

export default authManager;
