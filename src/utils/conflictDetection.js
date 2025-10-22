const CATEGORY_COLORS = {
  personal: '#007AFF',
  work: '#FF6B6B',
  school: '#4ECDC4',
  nutrition: '#45B7D1',
  exercise: '#96CEB4',
  languages: '#FFEAA7',
  menstrual: '#DDA0DD'
};

export const detectTimeConflicts = (newEvent, allCategoryEvents, currentCategory) => {
  const conflicts = [];
  
  // Convertir las horas del nuevo evento a minutos para facilitar la comparación
  const newStartTime = timeToMinutes(newEvent.startTime);
  const newEndTime = newEvent.endTime ? timeToMinutes(newEvent.endTime) : newStartTime + 60; // 1 hora por defecto
  
  // Revisar cada categoría excepto la actual
  Object.keys(allCategoryEvents).forEach(category => {
    if (category === currentCategory) return;
    
    const categoryEvents = allCategoryEvents[category];
    if (!categoryEvents || !categoryEvents[newEvent.date]) return;
    
    // Revisar cada evento en esa categoría para la misma fecha
    categoryEvents[newEvent.date].forEach(event => {
      const eventStartTime = timeToMinutes(event.startTime);
      const eventEndTime = event.endTime ? timeToMinutes(event.endTime) : eventStartTime + 60;
      
      // Verificar si hay superposición de horarios
      if (isTimeOverlap(newStartTime, newEndTime, eventStartTime, eventEndTime)) {
        conflicts.push({
          ...event,
          category,
          categoryColor: CATEGORY_COLORS[category]
        });
      }
    });
  });
  
  return conflicts;
};

const timeToMinutes = (dateTimeString) => {
  const date = new Date(dateTimeString);
  return date.getHours() * 60 + date.getMinutes();
};

const isTimeOverlap = (start1, end1, start2, end2) => {
  // Dos intervalos se superponen si:
  // start1 < end2 AND start2 < end1
  return start1 < end2 && start2 < end1;
};

export const formatConflictMessage = (conflicts) => {
  if (conflicts.length === 0) return '';
  
  const categoryNames = {
    personal: 'Mi Perfil',
    work: 'Trabajo',
    school: 'Escuela',
    nutrition: 'Alimentación',
    exercise: 'Ejercicio',
    languages: 'Idiomas',
    menstrual: 'Calendario Menstrual'
  };
  
  const conflictCategories = [...new Set(conflicts.map(c => categoryNames[c.category]))];
  
  if (conflictCategories.length === 1) {
    return `Conflicto con un evento en ${conflictCategories[0]}`;
  } else if (conflictCategories.length === 2) {
    return `Conflictos con eventos en ${conflictCategories.join(' y ')}`;
  } else {
    return `Conflictos con eventos en ${conflictCategories.slice(0, -1).join(', ')} y ${conflictCategories[conflictCategories.length - 1]}`;
  }
};
