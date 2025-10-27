const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'El título es requerido'],
    trim: true,
    maxlength: [200, 'El título no puede exceder 200 caracteres'],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'La descripción no puede exceder 1000 caracteres'],
  },
  date: {
    type: Date,
    required: [true, 'La fecha es requerida'],
  },
  time: {
    type: String,
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido (HH:MM)'],
  },
  type: {
    type: String,
    enum: ['daily', 'weekly'],
    required: [true, 'El tipo de tarea es requerido'],
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'cancelled'],
    default: 'pending',
  },
  completed: {
    type: Boolean,
    default: false,
  },
  urgent: {
    type: Boolean,
    default: false,
  },
  overdue: {
    type: Boolean,
    default: false,
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [2000, 'Las notas no pueden exceder 2000 caracteres'],
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [50, 'Cada tag no puede exceder 50 caracteres'],
  }],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El ID del usuario es requerido'],
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
  },
  estimatedDuration: {
    type: Number, // en minutos
    min: [1, 'La duración estimada debe ser al menos 1 minuto'],
  },
  actualDuration: {
    type: Number, // en minutos
    min: [0, 'La duración actual no puede ser negativa'],
  },
  reminder: {
    enabled: {
      type: Boolean,
      default: false,
    },
    time: {
      type: Date,
    },
    type: {
      type: String,
      enum: ['email', 'push', 'sms'],
      default: 'push',
    },
  },
  recurrence: {
    enabled: {
      type: Boolean,
      default: false,
    },
    pattern: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'yearly'],
    },
    interval: {
      type: Number,
      min: [1, 'El intervalo debe ser al menos 1'],
    },
    endDate: {
      type: Date,
    },
  },
  attachments: [{
    name: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
  }],
  collaborators: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    role: {
      type: String,
      enum: ['viewer', 'editor', 'admin'],
      default: 'viewer',
    },
    permissions: [{
      type: String,
      enum: ['read', 'write', 'delete', 'share'],
    }],
  }],
  dependencies: [{
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      required: true,
    },
    type: {
      type: String,
      enum: ['blocks', 'blocked-by', 'related'],
      required: true,
    },
  }],
  metadata: {
    source: {
      type: String,
      enum: ['web', 'mobile', 'api', 'import'],
      default: 'web',
    },
    device: {
      type: String,
    },
    location: {
      latitude: Number,
      longitude: Number,
      address: String,
    },
    weather: {
      condition: String,
      temperature: Number,
    },
  },
  analytics: {
    views: {
      type: Number,
      default: 0,
    },
    edits: {
      type: Number,
      default: 0,
    },
    completions: {
      type: Number,
      default: 0,
    },
    averageCompletionTime: {
      type: Number, // en minutos
    },
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Índices para optimizar consultas
taskSchema.index({ userId: 1, date: 1 });
taskSchema.index({ userId: 1, type: 1 });
taskSchema.index({ userId: 1, status: 1 });
taskSchema.index({ userId: 1, priority: 1 });
taskSchema.index({ userId: 1, completed: 1 });
taskSchema.index({ userId: 1, urgent: 1 });
taskSchema.index({ userId: 1, overdue: 1 });
taskSchema.index({ projectId: 1 });
taskSchema.index({ categoryId: 1 });
taskSchema.index({ createdAt: -1 });
taskSchema.index({ updatedAt: -1 });

// Índice de texto para búsquedas
taskSchema.index({
  title: 'text',
  description: 'text',
  notes: 'text',
  tags: 'text',
});

// Virtuals
taskSchema.virtual('isOverdue').get(function() {
  return this.date < new Date() && !this.completed;
});

taskSchema.virtual('daysUntilDue').get(function() {
  const now = new Date();
  const due = new Date(this.date);
  const diffTime = due - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

taskSchema.virtual('completionRate').get(function() {
  if (this.analytics.completions === 0) return 0;
  return (this.analytics.completions / (this.analytics.completions + this.analytics.edits)) * 100;
});

// Middleware pre-save
taskSchema.pre('save', function(next) {
  // Actualizar campo overdue
  if (this.date < new Date() && !this.completed) {
    this.overdue = true;
  }
  
  // Actualizar analytics
  if (this.isModified('completed') && this.completed) {
    this.analytics.completions += 1;
  }
  
  if (this.isModified() && !this.isNew) {
    this.analytics.edits += 1;
  }
  
  next();
});

// Métodos de instancia
taskSchema.methods.markAsCompleted = function() {
  this.completed = true;
  this.status = 'completed';
  this.analytics.completions += 1;
  return this.save();
};

taskSchema.methods.markAsPending = function() {
  this.completed = false;
  this.status = 'pending';
  return this.save();
};

taskSchema.methods.setPriority = function(priority) {
  this.priority = priority;
  return this.save();
};

taskSchema.methods.addNote = function(note) {
  this.notes = this.notes ? `${this.notes}\n${note}` : note;
  return this.save();
};

taskSchema.methods.addTag = function(tag) {
  if (!this.tags.includes(tag)) {
    this.tags.push(tag);
  }
  return this.save();
};

taskSchema.methods.removeTag = function(tag) {
  this.tags = this.tags.filter(t => t !== tag);
  return this.save();
};

// Métodos estáticos
taskSchema.statics.findByUser = function(userId, options = {}) {
  const query = { userId };
  
  if (options.type) query.type = options.type;
  if (options.status) query.status = options.status;
  if (options.priority) query.priority = options.priority;
  if (options.completed !== undefined) query.completed = options.completed;
  if (options.urgent !== undefined) query.urgent = options.urgent;
  if (options.overdue !== undefined) query.overdue = options.overdue;
  
  return this.find(query).sort({ date: 1, priority: -1 });
};

taskSchema.statics.findByDateRange = function(userId, startDate, endDate) {
  return this.find({
    userId,
    date: {
      $gte: startDate,
      $lte: endDate,
    },
  }).sort({ date: 1, priority: -1 });
};

taskSchema.statics.findOverdue = function(userId) {
  return this.find({
    userId,
    date: { $lt: new Date() },
    completed: false,
  }).sort({ date: 1 });
};

taskSchema.statics.findUpcoming = function(userId, days = 7) {
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + days);
  
  return this.find({
    userId,
    date: {
      $gte: startDate,
      $lte: endDate,
    },
    completed: false,
  }).sort({ date: 1, priority: -1 });
};

taskSchema.statics.getStats = function(userId) {
  return this.aggregate([
    { $match: { userId: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        completed: { $sum: { $cond: ['$completed', 1, 0] } },
        pending: { $sum: { $cond: ['$completed', 0, 1] } },
        urgent: { $sum: { $cond: ['$urgent', 1, 0] } },
        overdue: { $sum: { $cond: ['$overdue', 1, 0] } },
        highPriority: { $sum: { $cond: [{ $eq: ['$priority', 'high'] }, 1, 0] } },
        mediumPriority: { $sum: { $cond: [{ $eq: ['$priority', 'medium'] }, 1, 0] } },
        lowPriority: { $sum: { $cond: [{ $eq: ['$priority', 'low'] }, 1, 0] } },
      },
    },
  ]);
};

module.exports = mongoose.model('Task', taskSchema);
