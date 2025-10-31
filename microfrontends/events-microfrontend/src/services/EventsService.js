import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_EVENTS_SERVICE_URL || 'http://localhost:3001/api';

class EventsService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para agregar token de autenticación
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Interceptor para manejar errores de respuesta
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expirado, redirigir al login
          localStorage.removeItem('authToken');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Obtener todos los eventos de un usuario
  async getEvents(userId, dateRange = null) {
    try {
      const params = { userId };
      if (dateRange) {
        params.startDate = dateRange.start;
        params.endDate = dateRange.end;
      }
      
      const response = await this.api.get('/events', { params });
      return response.data;
    } catch (error) {
      throw new Error(`Error al obtener eventos: ${error.message}`);
    }
  }

  // Obtener eventos de una fecha específica
  async getEventsByDate(userId, date) {
    try {
      const response = await this.api.get(`/events/date/${date}`, {
        params: { userId }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Error al obtener eventos del día: ${error.message}`);
    }
  }

  // Crear un nuevo evento
  async createEvent(eventData) {
    try {
      const response = await this.api.post('/events', eventData);
      return response.data;
    } catch (error) {
      throw new Error(`Error al crear evento: ${error.message}`);
    }
  }

  // Actualizar un evento existente
  async updateEvent(eventId, eventData) {
    try {
      const response = await this.api.put(`/events/${eventId}`, eventData);
      return response.data;
    } catch (error) {
      throw new Error(`Error al actualizar evento: ${error.message}`);
    }
  }

  // Eliminar un evento
  async deleteEvent(eventId) {
    try {
      await this.api.delete(`/events/${eventId}`);
      return { success: true };
    } catch (error) {
      throw new Error(`Error al eliminar evento: ${error.message}`);
    }
  }

  // Obtener estadísticas de eventos
  async getEventStats(userId, period = 'month') {
    try {
      const response = await this.api.get(`/events/stats`, {
        params: { userId, period }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Error al obtener estadísticas: ${error.message}`);
    }
  }

  // Buscar eventos
  async searchEvents(userId, query, filters = {}) {
    try {
      const response = await this.api.get('/events/search', {
        params: { userId, query, ...filters }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Error al buscar eventos: ${error.message}`);
    }
  }

  // Exportar eventos
  async exportEvents(userId, format = 'json', dateRange = null) {
    try {
      const params = { userId, format };
      if (dateRange) {
        params.startDate = dateRange.start;
        params.endDate = dateRange.end;
      }
      
      const response = await this.api.get('/events/export', { 
        params,
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw new Error(`Error al exportar eventos: ${error.message}`);
    }
  }

  // Importar eventos
  async importEvents(userId, file, format = 'json') {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', userId);
      formData.append('format', format);
      
      const response = await this.api.post('/events/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(`Error al importar eventos: ${error.message}`);
    }
  }
}

export { EventsService };
