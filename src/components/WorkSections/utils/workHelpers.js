// Utilidades para la sección de trabajo

export const formatDate = (date) => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatTime = (time) => {
  if (!time) return '';
  
  const timeObj = typeof time === 'string' ? new Date(`2000-01-01T${time}`) : time;
  return timeObj.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getPriorityColor = (priority) => {
  const colors = {
    high: '#E53E3E',
    medium: '#D69E2E',
    low: '#38A169',
  };
  return colors[priority] || colors.medium;
};

export const getPriorityIcon = (priority) => {
  const icons = {
    high: 'arrow-up',
    medium: 'remove',
    low: 'arrow-down',
  };
  return icons[priority] || icons.medium;
};

export const getStatusColor = (status) => {
  const colors = {
    active: '#38A169',
    completed: '#38A169',
    'on-hold': '#D69E2E',
    cancelled: '#E53E3E',
  };
  return colors[status] || colors.active;
};

export const getStatusIcon = (status) => {
  const icons = {
    active: 'play-circle',
    completed: 'checkmark-circle',
    'on-hold': 'pause-circle',
    cancelled: 'close-circle',
  };
  return icons[status] || icons.active;
};

export const calculateProgress = (completed, total) => {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
};

export const isOverdue = (date) => {
  if (!date) return false;
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  dateObj.setHours(0, 0, 0, 0);
  return dateObj < today;
};

export const isUrgent = (date, priority) => {
  if (!date || priority !== 'high') return false;
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  const diffTime = dateObj - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 3 && diffDays >= 0;
};

export const getTaskVariant = (task) => {
  if (task.completed) return 'completed';
  if (task.overdue) return 'overdue';
  if (task.urgent) return 'urgent';
  return 'default';
};

export const getProjectVariant = (project) => {
  return project.status || 'default';
};

export const getGoalVariant = (goal) => {
  if (goal.completed) return 'completed';
  if (goal.overdue) return 'overdue';
  if (goal.urgent) return 'urgent';
  return 'default';
};

export const sortTasksByPriority = (tasks) => {
  const priorityOrder = { high: 3, medium: 2, low: 1 };
  return tasks.sort((a, b) => {
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
    if (priorityDiff !== 0) return priorityDiff;
    
    // Si tienen la misma prioridad, ordenar por fecha
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateA - dateB;
  });
};

export const filterTasksByStatus = (tasks, status) => {
  switch (status) {
    case 'completed':
      return tasks.filter(task => task.completed);
    case 'pending':
      return tasks.filter(task => !task.completed);
    case 'urgent':
      return tasks.filter(task => task.urgent);
    case 'overdue':
      return tasks.filter(task => task.overdue);
    default:
      return tasks;
  }
};

export const getWeeklyStats = (weeklyProgress) => {
  const totalTasks = weeklyProgress.reduce((sum, day) => sum + day.tasks, 0);
  const completedTasks = weeklyProgress.reduce((sum, day) => sum + day.completed, 0);
  const totalHours = weeklyProgress.reduce((sum, day) => sum + day.hours, 0);
  const averageHours = totalHours / weeklyProgress.length;
  const efficiency = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return {
    totalTasks,
    completedTasks,
    totalHours,
    averageHours,
    efficiency,
  };
};

export const getMonthlyStats = (monthlyGoals) => {
  const totalGoals = monthlyGoals.length;
  const completedGoals = monthlyGoals.filter(goal => goal.progress === 100).length;
  const averageProgress = monthlyGoals.reduce((sum, goal) => sum + goal.progress, 0) / totalGoals;

  return {
    totalGoals,
    completedGoals,
    averageProgress,
  };
};

export const generateTaskId = () => {
  return Date.now().toString();
};

export const generateProjectId = () => {
  return Date.now().toString();
};

export const generateGoalId = () => {
  return Date.now().toString();
};

export const validateTask = (task) => {
  const errors = [];
  
  if (!task.title || task.title.trim() === '') {
    errors.push('El título es requerido');
  }
  
  if (!task.date) {
    errors.push('La fecha es requerida');
  }
  
  if (task.date && isOverdue(task.date)) {
    errors.push('La fecha no puede ser anterior a hoy');
  }
  
  return errors;
};

export const validateProject = (project) => {
  const errors = [];
  
  if (!project.title || project.title.trim() === '') {
    errors.push('El nombre del proyecto es requerido');
  }
  
  if (!project.deadline) {
    errors.push('La fecha límite es requerida');
  }
  
  if (project.deadline && isOverdue(project.deadline)) {
    errors.push('La fecha límite no puede ser anterior a hoy');
  }
  
  return errors;
};

export const validateGoal = (goal) => {
  const errors = [];
  
  if (!goal.title || goal.title.trim() === '') {
    errors.push('El objetivo es requerido');
  }
  
  if (!goal.date) {
    errors.push('La fecha es requerida');
  }
  
  if (goal.date && isOverdue(goal.date)) {
    errors.push('La fecha no puede ser anterior a hoy');
  }
  
  return errors;
};
