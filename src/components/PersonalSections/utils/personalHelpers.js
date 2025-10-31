// Utilidades para PersonalSections

export const getEventColor = (eventType) => {
  const colors = {
    personal: '#D2691E',
    work: '#FF6B6B',
    health: '#4ECDC4',
    finance: '#45B7D1',
    education: '#96CEB4',
    social: '#FFEAA7',
    travel: '#DDA0DD',
  };
  return colors[eventType] || '#D2691E';
};

export const getEventIcon = (eventType) => {
  const icons = {
    personal: 'person-outline',
    work: 'briefcase-outline',
    health: 'medical-outline',
    finance: 'card-outline',
    education: 'school-outline',
    social: 'people-outline',
    travel: 'airplane-outline',
  };
  return icons[eventType] || 'calendar-outline';
};

export const getPriorityColor = (priority) => {
  const colors = {
    low: '#4ECDC4',
    medium: '#FFD93D',
    high: '#FF6B6B',
  };
  return colors[priority] || '#FFD93D';
};

export const getPriorityIcon = (priority) => {
  const icons = {
    low: 'arrow-down-outline',
    medium: 'remove-outline',
    high: 'arrow-up-outline',
  };
  return icons[priority] || 'remove-outline';
};

export const getCategoryIcon = (category) => {
  const icons = {
    personal: 'person-outline',
    work: 'briefcase-outline',
    health: 'medical-outline',
    finance: 'card-outline',
    education: 'school-outline',
    home: 'home-outline',
    shopping: 'cart-outline',
  };
  return icons[category] || 'list-outline';
};

export const getMoodIcon = (mood) => {
  const icons = {
    happy: 'happy-outline',
    sad: 'sad-outline',
    angry: 'flame-outline',
    excited: 'flash-outline',
    calm: 'leaf-outline',
    thoughtful: 'bulb-outline',
    neutral: 'ellipse-outline',
  };
  return icons[mood] || 'ellipse-outline';
};

export const getMoodColor = (mood) => {
  const colors = {
    happy: '#4ECDC4',
    sad: '#6C7CE7',
    angry: '#FF6B6B',
    excited: '#FFD93D',
    calm: '#96CEB4',
    thoughtful: '#DDA0DD',
    neutral: '#A8A8A8',
  };
  return colors[mood] || '#A8A8A8';
};

export const getMoodText = (mood) => {
  const texts = {
    happy: 'Feliz',
    sad: 'Triste',
    angry: 'Enojado',
    excited: 'Emocionado',
    calm: 'Tranquilo',
    thoughtful: 'Pensativo',
    neutral: 'Neutral',
  };
  return texts[mood] || 'Neutral';
};

export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatTime = (time) => {
  if (!time) return '';
  return time;
};

export const getInitials = (name) => {
  if (!name) return 'U';
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone);
};

export const generateId = () => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

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

export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

export const sortByDate = (items, ascending = true) => {
  return items.sort((a, b) => {
    const dateA = new Date(a.date || a.createdAt);
    const dateB = new Date(b.date || b.createdAt);
    return ascending ? dateA - dateB : dateB - dateA;
  });
};

export const filterByDate = (items, date) => {
  return items.filter(item => item.date === date);
};

export const filterByCategory = (items, category) => {
  return items.filter(item => item.category === category);
};

export const filterByPriority = (items, priority) => {
  return items.filter(item => item.priority === priority);
};

export const filterByMood = (items, mood) => {
  return items.filter(item => item.mood === mood);
};

export const searchItems = (items, query) => {
  if (!query) return items;
  const lowercaseQuery = query.toLowerCase();
  return items.filter(item => 
    item.title?.toLowerCase().includes(lowercaseQuery) ||
    item.description?.toLowerCase().includes(lowercaseQuery) ||
    item.content?.toLowerCase().includes(lowercaseQuery)
  );
};

export const groupByDate = (items) => {
  return items.reduce((groups, item) => {
    const date = item.date || item.createdAt;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(item);
    return groups;
  }, {});
};

export const groupByCategory = (items) => {
  return items.reduce((groups, item) => {
    const category = item.category || 'other';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
    return groups;
  }, {});
};

export const groupByPriority = (items) => {
  return items.reduce((groups, item) => {
    const priority = item.priority || 'medium';
    if (!groups[priority]) {
      groups[priority] = [];
    }
    groups[priority].push(item);
    return groups;
  }, {});
};

export const getStats = (items) => {
  const total = items.length;
  const completed = items.filter(item => item.completed).length;
  const pending = total - completed;
  const completionRate = total > 0 ? (completed / total) * 100 : 0;

  return {
    total,
    completed,
    pending,
    completionRate: Math.round(completionRate),
  };
};

export const getDateRange = (startDate, endDate) => {
  const dates = [];
  const currentDate = new Date(startDate);
  const end = new Date(endDate);

  while (currentDate <= end) {
    dates.push(currentDate.toISOString().split('T')[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};

export const isToday = (date) => {
  const today = new Date().toISOString().split('T')[0];
  return date === today;
};

export const isTomorrow = (date) => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return date === tomorrow.toISOString().split('T')[0];
};

export const isYesterday = (date) => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return date === yesterday.toISOString().split('T')[0];
};

export const getRelativeDate = (date) => {
  if (isToday(date)) return 'Hoy';
  if (isTomorrow(date)) return 'Mañana';
  if (isYesterday(date)) return 'Ayer';
  return formatDate(date);
};
