// Utilidades para PersonalProfile

import { Alert } from 'react-native';

/**
 * Formatea una fecha para mostrar en español
 * @param {Date} date - Fecha a formatear
 * @returns {string} Fecha formateada
 */
export const formatDate = (date) => {
  return date.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Formatea una hora para mostrar en formato 24h
 * @param {string} time - Hora en formato string
 * @returns {string} Hora formateada
 */
export const formatTime = (time) => {
  if (!time) return '';
  
  // Si ya está en formato 24h, devolverlo
  if (time.includes(':')) {
    return time;
  }
  
  // Convertir de 12h a 24h si es necesario
  const [timePart, period] = time.split(' ');
  if (period) {
    const [hours, minutes] = timePart.split(':');
    let hour24 = parseInt(hours);
    
    if (period === 'PM' && hour24 !== 12) {
      hour24 += 12;
    } else if (period === 'AM' && hour24 === 12) {
      hour24 = 0;
    }
    
    return `${hour24.toString().padStart(2, '0')}:${minutes}`;
  }
  
  return time;
};

/**
 * Valida si un email es válido
 * @param {string} email - Email a validar
 * @returns {boolean} True si es válido
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida si un teléfono es válido
 * @param {string} phone - Teléfono a validar
 * @returns {boolean} True si es válido
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Muestra un diálogo de confirmación
 * @param {string} title - Título del diálogo
 * @param {string} message - Mensaje del diálogo
 * @param {Function} onConfirm - Función a ejecutar al confirmar
 * @param {Function} onCancel - Función a ejecutar al cancelar
 */
export const showConfirmationDialog = (title, message, onConfirm, onCancel) => {
  Alert.alert(
    title,
    message,
    [
      {
        text: 'Cancelar',
        style: 'cancel',
        onPress: onCancel
      },
      {
        text: 'Confirmar',
        style: 'destructive',
        onPress: onConfirm
      }
    ]
  );
};

/**
 * Genera un ID único
 * @returns {string} ID único
 */
export const generateId = () => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

/**
 * Debounce function para optimizar llamadas
 * @param {Function} func - Función a debounce
 * @param {number} wait - Tiempo de espera en ms
 * @returns {Function} Función debounced
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Capitaliza la primera letra de una cadena
 * @param {string} str - Cadena a capitalizar
 * @returns {string} Cadena capitalizada
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Trunca un texto a una longitud específica
 * @param {string} text - Texto a truncar
 * @param {number} maxLength - Longitud máxima
 * @returns {string} Texto truncado
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Obtiene el color de una sección basado en su ID
 * @param {string} sectionId - ID de la sección
 * @returns {string} Color de la sección
 */
export const getSectionColor = (sectionId) => {
  const colors = {
    'events': '#4A7C59',
    'tasks': '#4A7C59',
    'profile': '#4A7C59',
    'settings': '#4A7C59'
  };
  return colors[sectionId] || '#4A7C59';
};

/**
 * Valida los datos de un evento
 * @param {Object} event - Datos del evento
 * @returns {Object} Resultado de la validación
 */
export const validateEvent = (event) => {
  const errors = [];
  
  if (!event.title || event.title.trim() === '') {
    errors.push('El título es obligatorio');
  }
  
  if (!event.time || event.time.trim() === '') {
    errors.push('La hora es obligatoria');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Valida los datos de una tarea
 * @param {Object} task - Datos de la tarea
 * @returns {Object} Resultado de la validación
 */
export const validateTask = (task) => {
  const errors = [];
  
  if (!task.title || task.title.trim() === '') {
    errors.push('El título es obligatorio');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Valida los datos del perfil
 * @param {Object} profile - Datos del perfil
 * @returns {Object} Resultado de la validación
 */
export const validateProfile = (profile) => {
  const errors = [];
  
  if (!profile.name || profile.name.trim() === '') {
    errors.push('El nombre es obligatorio');
  }
  
  if (!profile.email || profile.email.trim() === '') {
    errors.push('El email es obligatorio');
  } else if (!isValidEmail(profile.email)) {
    errors.push('El email no es válido');
  }
  
  if (profile.phone && !isValidPhone(profile.phone)) {
    errors.push('El teléfono no es válido');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
