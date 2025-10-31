import axios from 'axios';

class TasksService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_GATEWAY_URL || 'http://localhost:3000';
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para manejar errores
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('TasksService Error:', error);
        throw new Error(error.response?.data?.message || 'Error en el servicio de tareas');
      }
    );
  }

  // Obtener tareas diarias
  async getDailyTasks() {
    try {
      const response = await this.api.get('/api/tasks/daily');
      return response.data;
    } catch (error) {
      console.error('Error fetching daily tasks:', error);
      // Retornar datos de ejemplo en caso de error
      return [
        {
          id: 1,
          title: 'Revisar emails',
          date: new Date().toISOString().split('T')[0],
          time: '09:00',
          notes: 'Responder emails urgentes',
          completed: false,
          priority: 'high',
          urgent: false,
          overdue: false,
        },
        {
          id: 2,
          title: 'Reunión con equipo',
          date: new Date().toISOString().split('T')[0],
          time: '10:30',
          notes: 'Revisar progreso del proyecto',
          completed: true,
          priority: 'medium',
          urgent: false,
          overdue: false,
        },
      ];
    }
  }

  // Obtener tareas semanales
  async getWeeklyTasks() {
    try {
      const response = await this.api.get('/api/tasks/weekly');
      return response.data;
    } catch (error) {
      console.error('Error fetching weekly tasks:', error);
      // Retornar datos de ejemplo en caso de error
      return [
        {
          id: 1,
          title: 'Planificar semana',
          date: new Date().toISOString().split('T')[0],
          notes: 'Definir objetivos semanales',
          completed: false,
          priority: 'high',
          urgent: false,
          overdue: false,
        },
        {
          id: 2,
          title: 'Revisar presupuesto',
          date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          notes: 'Análisis financiero mensual',
          completed: false,
          priority: 'medium',
          urgent: false,
          overdue: false,
        },
      ];
    }
  }

  // Crear tarea diaria
  async createDailyTask(taskData) {
    try {
      const response = await this.api.post('/api/tasks/daily', taskData);
      return response.data;
    } catch (error) {
      console.error('Error creating daily task:', error);
      // Retornar tarea creada localmente en caso de error
      return {
        id: Date.now(),
        ...taskData,
        createdAt: new Date().toISOString(),
      };
    }
  }

  // Crear tarea semanal
  async createWeeklyTask(taskData) {
    try {
      const response = await this.api.post('/api/tasks/weekly', taskData);
      return response.data;
    } catch (error) {
      console.error('Error creating weekly task:', error);
      // Retornar tarea creada localmente en caso de error
      return {
        id: Date.now(),
        ...taskData,
        createdAt: new Date().toISOString(),
      };
    }
  }

  // Actualizar tarea
  async updateTask(taskId, updatedData) {
    try {
      const response = await this.api.put(`/api/tasks/${taskId}`, updatedData);
      return response.data;
    } catch (error) {
      console.error('Error updating task:', error);
      // Retornar tarea actualizada localmente en caso de error
      return {
        id: taskId,
        ...updatedData,
        updatedAt: new Date().toISOString(),
      };
    }
  }

  // Alternar estado de tarea
  async toggleTask(taskId, type) {
    try {
      const response = await this.api.patch(`/api/tasks/${taskId}/toggle`, { type });
      return response.data;
    } catch (error) {
      console.error('Error toggling task:', error);
      // Retornar tarea actualizada localmente en caso de error
      return {
        id: taskId,
        completed: true, // Simular toggle
        updatedAt: new Date().toISOString(),
      };
    }
  }

  // Eliminar tarea
  async deleteTask(taskId, type) {
    try {
      await this.api.delete(`/api/tasks/${taskId}`, { data: { type } });
      return true;
    } catch (error) {
      console.error('Error deleting task:', error);
      // Retornar éxito localmente en caso de error
      return true;
    }
  }

  // Agregar notas a tarea
  async addTaskNotes(taskId, notes) {
    try {
      const response = await this.api.patch(`/api/tasks/${taskId}/notes`, { notes });
      return response.data;
    } catch (error) {
      console.error('Error adding task notes:', error);
      // Retornar tarea actualizada localmente en caso de error
      return {
        id: taskId,
        notes,
        updatedAt: new Date().toISOString(),
      };
    }
  }

  // Obtener estadísticas de tareas
  async getTaskStats() {
    try {
      const response = await this.api.get('/api/tasks/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching task stats:', error);
      // Retornar estadísticas de ejemplo en caso de error
      return {
        total: 10,
        completed: 6,
        pending: 4,
        urgent: 2,
        overdue: 1,
        completionRate: 60,
      };
    }
  }

  // Buscar tareas
  async searchTasks(query) {
    try {
      const response = await this.api.get(`/api/tasks/search?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error('Error searching tasks:', error);
      // Retornar array vacío en caso de error
      return [];
    }
  }

  // Obtener tareas por fecha
  async getTasksByDate(date) {
    try {
      const response = await this.api.get(`/api/tasks/date/${date}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching tasks by date:', error);
      // Retornar array vacío en caso de error
      return [];
    }
  }

  // Obtener tareas por prioridad
  async getTasksByPriority(priority) {
    try {
      const response = await this.api.get(`/api/tasks/priority/${priority}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching tasks by priority:', error);
      // Retornar array vacío en caso de error
      return [];
    }
  }

  // Sincronizar tareas offline
  async syncOfflineTasks(offlineTasks) {
    try {
      const response = await this.api.post('/api/tasks/sync', { tasks: offlineTasks });
      return response.data;
    } catch (error) {
      console.error('Error syncing offline tasks:', error);
      throw error;
    }
  }

  // Exportar tareas
  async exportTasks(format = 'json') {
    try {
      const response = await this.api.get(`/api/tasks/export?format=${format}`);
      return response.data;
    } catch (error) {
      console.error('Error exporting tasks:', error);
      throw error;
    }
  }

  // Importar tareas
  async importTasks(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await this.api.post('/api/tasks/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error importing tasks:', error);
      throw error;
    }
  }
}

export { TasksService };
