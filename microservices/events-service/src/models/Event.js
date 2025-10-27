const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'El título es obligatorio'],
    trim: true,
    maxlength: [200, 'El título no puede exceder 200 caracteres']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'La descripción no puede exceder 1000 caracteres']
  },
  date: {
    type: Date,
    required: [true, 'La fecha es obligatoria'],
    index: true
  },
  time: {
    type: String,
    required: [true, 'La hora es obligatoria'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido (HH:MM)']
  },
  duration: {
    type: Number,
    default: 60, // duración en minutos
    min: [1, 'La duración debe ser al menos 1 minuto'],
    max: [1440, 'La duración no puede exceder 24 horas']
  },
  location: {
    type: String,
    trim: true,
    maxlength: [200, 'La ubicación no puede exceder 200 caracteres']
  },
  category: {
    type: String,
    enum: ['personal', 'work', 'health', 'education', 'social', 'other'],
    default: 'personal'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['scheduled', 'in-progress', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurrencePattern: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'yearly'],
    required: function() {
      return this.isRecurring;
    }
  },
  recurrenceEndDate: {
    type: Date,
    required: function() {
      return this.isRecurring;
    }
  },
  reminders: [{
    type: {
      type: String,
      enum: ['email', 'push', 'sms'],
      required: true
    },
    minutesBefore: {
      type: Number,
      required: true,
      min: [1, 'El recordatorio debe ser al menos 1 minuto antes'],
      max: [10080, 'El recordatorio no puede ser más de 7 días antes']
    },
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  attendees: [{
    email: {
      type: String,
      required: true,
      match: [/^\S+@\S+\.\S+$/, 'Email inválido']
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined', 'tentative'],
      default: 'pending'
    }
  }],
  tags: [{
    type: String,
    trim: true,
    maxlength: [50, 'Cada tag no puede exceder 50 caracteres']
  }],
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El usuario es obligatorio'],
    index: true
  },
  isDeleted: {
    type: Boolean,
    default: false,
    index: true
  },
  deletedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices compuestos para optimizar consultas
eventSchema.index({ userId: 1, date: 1 });
eventSchema.index({ userId: 1, category: 1 });
eventSchema.index({ userId: 1, status: 1 });
eventSchema.index({ userId: 1, isDeleted: 1 });

// Virtual para obtener la fecha y hora combinadas
eventSchema.virtual('dateTime').get(function() {
  const [hours, minutes] = this.time.split(':');
  const eventDate = new Date(this.date);
  eventDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  return eventDate;
});

// Virtual para verificar si el evento ya pasó
eventSchema.virtual('isPast').get(function() {
  return this.dateTime < new Date();
});

// Virtual para verificar si el evento es hoy
eventSchema.virtual('isToday').get(function() {
  const today = new Date();
  const eventDate = new Date(this.date);
  return eventDate.toDateString() === today.toDateString();
});

// Middleware pre-save para validaciones adicionales
eventSchema.pre('save', function(next) {
  // Validar que la fecha no sea en el pasado para eventos nuevos
  if (this.isNew && this.dateTime < new Date()) {
    return next(new Error('No se pueden crear eventos en el pasado'));
  }
  
  // Validar que el patrón de recurrencia sea válido
  if (this.isRecurring && this.recurrenceEndDate <= this.date) {
    return next(new Error('La fecha de fin de recurrencia debe ser posterior a la fecha del evento'));
  }
  
  next();
});

// Método estático para obtener eventos de un usuario en un rango de fechas
eventSchema.statics.getEventsByDateRange = function(userId, startDate, endDate) {
  return this.find({
    userId,
    date: { $gte: startDate, $lte: endDate },
    isDeleted: false
  }).sort({ date: 1, time: 1 });
};

// Método estático para obtener eventos de hoy
eventSchema.statics.getTodayEvents = function(userId) {
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));
  
  return this.find({
    userId,
    date: { $gte: startOfDay, $lte: endOfDay },
    isDeleted: false
  }).sort({ time: 1 });
};

// Método estático para obtener estadísticas de eventos
eventSchema.statics.getEventStats = function(userId, startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        userId: mongoose.Types.ObjectId(userId),
        date: { $gte: startDate, $lte: endDate },
        isDeleted: false
      }
    },
    {
      $group: {
        _id: null,
        totalEvents: { $sum: 1 },
        completedEvents: {
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
        },
        cancelledEvents: {
          $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
        },
        avgDuration: { $avg: '$duration' },
        categories: {
          $push: '$category'
        }
      }
    }
  ]);
};

// Método de instancia para marcar como eliminado (soft delete)
eventSchema.methods.softDelete = function() {
  this.isDeleted = true;
  this.deletedAt = new Date();
  return this.save();
};

// Método de instancia para restaurar
eventSchema.methods.restore = function() {
  this.isDeleted = false;
  this.deletedAt = null;
  return this.save();
};

module.exports = mongoose.model('Event', eventSchema);
