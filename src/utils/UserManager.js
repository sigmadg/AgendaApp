import AsyncStorage from '@react-native-async-storage/async-storage';

class UserManager {
  constructor() {
    this.users = [];
    this.loadUsers();
  }

  // Cargar usuarios desde AsyncStorage
  async loadUsers() {
    try {
      const savedUsers = await AsyncStorage.getItem('registeredUsers');
      if (savedUsers) {
        this.users = JSON.parse(savedUsers);
      }
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      this.users = [];
    }
  }

  // Guardar usuarios en AsyncStorage
  async saveUsers() {
    try {
      await AsyncStorage.setItem('registeredUsers', JSON.stringify(this.users));
    } catch (error) {
      console.error('Error al guardar usuarios:', error);
    }
  }

  // Registrar nuevo usuario
  async registerUser(userData) {
    try {
      // Validar datos requeridos
      if (!userData.email || !userData.password || !userData.name) {
        return { success: false, error: 'Todos los campos son requeridos' };
      }

      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email)) {
        return { success: false, error: 'Formato de email inválido' };
      }

      // Validar longitud de contraseña
      if (userData.password.length < 6) {
        return { success: false, error: 'La contraseña debe tener al menos 6 caracteres' };
      }

      // Verificar si el usuario ya existe
      const existingUser = this.users.find(user => user.email === userData.email);
      if (existingUser) {
        return { success: false, error: 'Ya existe una cuenta con este email' };
      }

      // Crear nuevo usuario
      const newUser = {
        id: Date.now().toString(),
        email: userData.email,
        name: userData.name,
        password: userData.password, // En producción, esto debería estar hasheado
        createdAt: new Date().toISOString(),
        lastLogin: null,
        isActive: true,
      };

      // Agregar usuario a la lista
      this.users.push(newUser);
      await this.saveUsers();

      return { success: true, user: newUser };
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      return { success: false, error: 'Error interno del servidor' };
    }
  }

  // Autenticar usuario
  async authenticateUser(email, password) {
    try {
      await this.loadUsers(); // Asegurar que tenemos los datos más recientes
      
      const user = this.users.find(u => u.email === email && u.isActive);
      
      if (!user) {
        return { success: false, error: 'Usuario no encontrado' };
      }

      if (user.password !== password) {
        return { success: false, error: 'Contraseña incorrecta' };
      }

      // Actualizar último login
      user.lastLogin = new Date().toISOString();
      await this.saveUsers();

      return { success: true, user };
    } catch (error) {
      console.error('Error al autenticar usuario:', error);
      return { success: false, error: 'Error interno del servidor' };
    }
  }

  // Obtener usuario por email
  async getUserByEmail(email) {
    try {
      await this.loadUsers();
      return this.users.find(user => user.email === email);
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      return null;
    }
  }

  // Actualizar perfil de usuario
  async updateUserProfile(email, profileData) {
    try {
      await this.loadUsers();
      
      const userIndex = this.users.findIndex(user => user.email === email);
      if (userIndex === -1) {
        return { success: false, error: 'Usuario no encontrado' };
      }

      // Actualizar datos del usuario
      this.users[userIndex] = {
        ...this.users[userIndex],
        ...profileData,
        updatedAt: new Date().toISOString(),
      };

      await this.saveUsers();
      return { success: true, user: this.users[userIndex] };
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      return { success: false, error: 'Error interno del servidor' };
    }
  }

  // Cambiar contraseña
  async changePassword(email, currentPassword, newPassword) {
    try {
      await this.loadUsers();
      
      const userIndex = this.users.findIndex(user => user.email === email);
      if (userIndex === -1) {
        return { success: false, error: 'Usuario no encontrado' };
      }

      const user = this.users[userIndex];
      
      // Verificar contraseña actual
      if (user.password !== currentPassword) {
        return { success: false, error: 'Contraseña actual incorrecta' };
      }

      // Validar nueva contraseña
      if (newPassword.length < 6) {
        return { success: false, error: 'La nueva contraseña debe tener al menos 6 caracteres' };
      }

      // Actualizar contraseña
      this.users[userIndex].password = newPassword;
      this.users[userIndex].passwordChangedAt = new Date().toISOString();
      
      await this.saveUsers();
      return { success: true };
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      return { success: false, error: 'Error interno del servidor' };
    }
  }

  // Desactivar cuenta
  async deactivateAccount(email) {
    try {
      await this.loadUsers();
      
      const userIndex = this.users.findIndex(user => user.email === email);
      if (userIndex === -1) {
        return { success: false, error: 'Usuario no encontrado' };
      }

      this.users[userIndex].isActive = false;
      this.users[userIndex].deactivatedAt = new Date().toISOString();
      
      await this.saveUsers();
      return { success: true };
    } catch (error) {
      console.error('Error al desactivar cuenta:', error);
      return { success: false, error: 'Error interno del servidor' };
    }
  }

  // Obtener estadísticas de usuarios
  getStats() {
    const totalUsers = this.users.length;
    const activeUsers = this.users.filter(user => user.isActive).length;
    const inactiveUsers = totalUsers - activeUsers;
    
    return {
      totalUsers,
      activeUsers,
      inactiveUsers,
    };
  }

  // Limpiar todos los usuarios (solo para desarrollo)
  async clearAllUsers() {
    try {
      this.users = [];
      await AsyncStorage.removeItem('registeredUsers');
      return { success: true };
    } catch (error) {
      console.error('Error al limpiar usuarios:', error);
      return { success: false, error: error.message };
    }
  }
}

// Crear instancia singleton
const userManager = new UserManager();

export default userManager;
