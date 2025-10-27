const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  key: {
    type: String,
    required: [true, 'La clave es requerida'],
    trim: true,
    maxlength: [100, 'La clave no puede exceder 100 caracteres'],
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: [true, 'El valor es requerido'],
  },
  category: {
    type: String,
    enum: ['app', 'user', 'system', 'feature'],
    required: [true, 'La categoría es requerida'],
    default: 'user',
  },
  type: {
    type: String,
    enum: ['string', 'number', 'boolean', 'object', 'array'],
    required: [true, 'El tipo es requerido'],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'La descripción no puede exceder 500 caracteres'],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: function() {
      return this.category === 'user';
    },
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
  isReadOnly: {
    type: Boolean,
    default: false,
  },
  isSystem: {
    type: Boolean,
    default: false,
  },
  validation: {
    required: {
      type: Boolean,
      default: false,
    },
    min: {
      type: Number,
    },
    max: {
      type: Number,
    },
    minLength: {
      type: Number,
    },
    maxLength: {
      type: Number,
    },
    pattern: {
      type: String,
    },
    enum: [{
      type: String,
    }],
  },
  defaultValue: {
    type: mongoose.Schema.Types.Mixed,
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [50, 'Cada tag no puede exceder 50 caracteres'],
  }],
  dependencies: [{
    key: {
      type: String,
      required: true,
    },
    value: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    operator: {
      type: String,
      enum: ['equals', 'not_equals', 'greater_than', 'less_than', 'contains', 'not_contains'],
      default: 'equals',
    },
  }],
  metadata: {
    source: {
      type: String,
      enum: ['web', 'mobile', 'api', 'import', 'system'],
      default: 'web',
    },
    device: {
      type: String,
    },
    version: {
      type: String,
    },
    environment: {
      type: String,
      enum: ['development', 'staging', 'production'],
      default: 'development',
    },
  },
  history: [{
    oldValue: {
      type: mongoose.Schema.Types.Mixed,
    },
    newValue: {
      type: mongoose.Schema.Types.Mixed,
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    changedAt: {
      type: Date,
      default: Date.now,
    },
    reason: {
      type: String,
      trim: true,
    },
    ip: {
      type: String,
    },
    userAgent: {
      type: String,
    },
  }],
  analytics: {
    views: {
      type: Number,
      default: 0,
    },
    changes: {
      type: Number,
      default: 0,
    },
    lastAccessed: {
      type: Date,
      default: Date.now,
    },
    lastChanged: {
      type: Date,
      default: Date.now,
    },
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Índices para optimizar consultas
settingSchema.index({ key: 1, category: 1 });
settingSchema.index({ category: 1 });
settingSchema.index({ userId: 1 });
settingSchema.index({ isPublic: 1 });
settingSchema.index({ isSystem: 1 });
settingSchema.index({ tags: 1 });
settingSchema.index({ createdAt: -1 });
settingSchema.index({ updatedAt: -1 });

// Índice de texto para búsquedas
settingSchema.index({
  key: 'text',
  description: 'text',
  tags: 'text',
});

// Virtuals
settingSchema.virtual('isModified').get(function() {
  return this.isModified('value');
});

settingSchema.virtual('changeCount').get(function() {
  return this.history.length;
});

settingSchema.virtual('lastChange').get(function() {
  return this.history.length > 0 ? this.history[this.history.length - 1] : null;
});

// Middleware pre-save
settingSchema.pre('save', function(next) {
  // Actualizar analytics
  if (this.isModified('value')) {
    this.analytics.changes += 1;
    this.analytics.lastChanged = new Date();
  }
  
  // Agregar al historial si el valor cambió
  if (this.isModified('value') && !this.isNew) {
    const previousValue = this.get('value', null, { getters: false });
    if (previousValue !== this.value) {
      this.history.push({
        oldValue: previousValue,
        newValue: this.value,
        changedAt: new Date(),
      });
    }
  }
  
  next();
});

// Métodos de instancia
settingSchema.methods.updateValue = function(newValue, userId, reason) {
  const oldValue = this.value;
  this.value = newValue;
  
  // Agregar al historial
  this.history.push({
    oldValue,
    newValue,
    changedBy: userId,
    changedAt: new Date(),
    reason,
  });
  
  return this.save();
};

settingSchema.methods.resetToDefault = function() {
  if (this.defaultValue !== undefined) {
    this.updateValue(this.defaultValue, null, 'Reset to default');
  }
  return this.save();
};

settingSchema.methods.addTag = function(tag) {
  if (!this.tags.includes(tag)) {
    this.tags.push(tag);
  }
  return this.save();
};

settingSchema.methods.removeTag = function(tag) {
  this.tags = this.tags.filter(t => t !== tag);
  return this.save();
};

settingSchema.methods.incrementViews = function() {
  this.analytics.views += 1;
  this.analytics.lastAccessed = new Date();
  return this.save();
};

settingSchema.methods.getHistory = function(limit = 10) {
  return this.history
    .sort((a, b) => b.changedAt - a.changedAt)
    .slice(0, limit);
};

settingSchema.methods.revertToVersion = function(versionIndex) {
  if (versionIndex >= 0 && versionIndex < this.history.length) {
    const version = this.history[versionIndex];
    this.updateValue(version.oldValue, null, 'Reverted to previous version');
  }
  return this.save();
};

// Métodos estáticos
settingSchema.statics.findByCategory = function(category, userId = null) {
  const query = { category };
  if (userId) {
    query.userId = userId;
  }
  return this.find(query).sort({ key: 1 });
};

settingSchema.statics.findByUser = function(userId) {
  return this.find({ userId }).sort({ category: 1, key: 1 });
};

settingSchema.statics.findPublic = function() {
  return this.find({ isPublic: true }).sort({ category: 1, key: 1 });
};

settingSchema.statics.findSystem = function() {
  return this.find({ isSystem: true }).sort({ key: 1 });
};

settingSchema.statics.findByKey = function(key, category = null, userId = null) {
  const query = { key };
  if (category) query.category = category;
  if (userId) query.userId = userId;
  return this.findOne(query);
};

settingSchema.statics.searchSettings = function(query, category = null, userId = null) {
  const searchQuery = {
    $text: { $search: query },
  };
  if (category) searchQuery.category = category;
  if (userId) searchQuery.userId = userId;
  
  return this.find(searchQuery)
    .sort({ score: { $meta: 'textScore' } });
};

settingSchema.statics.getSettingsStats = function(userId = null) {
  const matchStage = userId ? { userId } : {};
  
  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalSettings: { $sum: 1 },
        byCategory: {
          $push: {
            category: '$category',
            key: '$key',
          },
        },
        totalChanges: { $sum: '$analytics.changes' },
        totalViews: { $sum: '$analytics.views' },
        averageChanges: { $avg: '$analytics.changes' },
        averageViews: { $avg: '$analytics.views' },
      },
    },
  ]);
};

settingSchema.statics.getRecentChanges = function(limit = 20, userId = null) {
  const query = {};
  if (userId) query.userId = userId;
  
  return this.find(query)
    .sort({ 'analytics.lastChanged': -1 })
    .limit(limit)
    .populate('userId', 'name email');
};

settingSchema.statics.getMostChanged = function(limit = 10, userId = null) {
  const query = {};
  if (userId) query.userId = userId;
  
  return this.find(query)
    .sort({ 'analytics.changes': -1 })
    .limit(limit);
};

settingSchema.statics.getMostViewed = function(limit = 10, userId = null) {
  const query = {};
  if (userId) query.userId = userId;
  
  return this.find(query)
    .sort({ 'analytics.views': -1 })
    .limit(limit);
};

settingSchema.statics.exportSettings = function(userId = null) {
  const query = {};
  if (userId) query.userId = userId;
  
  return this.find(query)
    .select('-history -analytics')
    .sort({ category: 1, key: 1 });
};

settingSchema.statics.importSettings = function(settings, userId = null) {
  const operations = settings.map(setting => ({
    updateOne: {
      filter: { key: setting.key, category: setting.category, userId },
      update: { $set: { ...setting, userId } },
      upsert: true,
    },
  }));
  
  return this.bulkWrite(operations);
};

settingSchema.statics.resetToDefaults = function(category = null, userId = null) {
  const query = {};
  if (category) query.category = category;
  if (userId) query.userId = userId;
  
  return this.updateMany(query, {
    $set: {
      value: '$defaultValue',
      'analytics.lastChanged': new Date(),
    },
  });
};

settingSchema.statics.cleanupHistory = function(olderThanDays = 30) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);
  
  return this.updateMany(
    {},
    {
      $pull: {
        history: {
          changedAt: { $lt: cutoffDate },
        },
      },
    }
  );
};

module.exports = mongoose.model('Setting', settingSchema);
