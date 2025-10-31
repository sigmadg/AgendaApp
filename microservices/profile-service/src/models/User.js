const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true,
    maxlength: [100, 'El nombre no puede exceder 100 caracteres'],
  },
  email: {
    type: String,
    required: [true, 'El email es requerido'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email inválido'],
  },
  phone: {
    type: String,
    trim: true,
    match: [/^\+?[\d\s\-\(\)]+$/, 'Número de teléfono inválido'],
  },
  password: {
    type: String,
    required: [true, 'La contraseña es requerida'],
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
    select: false, // No incluir en consultas por defecto
  },
  avatar: {
    type: String,
    default: null,
  },
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'system',
    },
    language: {
      type: String,
      enum: ['es', 'en', 'fr', 'de', 'it', 'pt'],
      default: 'es',
    },
    timezone: {
      type: String,
      default: 'UTC',
    },
    dateFormat: {
      type: String,
      enum: ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'],
      default: 'DD/MM/YYYY',
    },
    timeFormat: {
      type: String,
      enum: ['12h', '24h'],
      default: '24h',
    },
    currency: {
      type: String,
      default: 'EUR',
    },
  },
  settings: {
    notifications: {
      push: {
        type: Boolean,
        default: true,
      },
      email: {
        type: Boolean,
        default: true,
      },
      sms: {
        type: Boolean,
        default: false,
      },
      marketing: {
        type: Boolean,
        default: false,
      },
      updates: {
        type: Boolean,
        default: true,
      },
      reminders: {
        type: Boolean,
        default: true,
      },
    },
    privacy: {
      profileVisibility: {
        type: String,
        enum: ['public', 'private', 'friends'],
        default: 'public',
      },
      showEmail: {
        type: Boolean,
        default: false,
      },
      showPhone: {
        type: Boolean,
        default: false,
      },
      showLastSeen: {
        type: Boolean,
        default: true,
      },
    },
    security: {
      twoFactorEnabled: {
        type: Boolean,
        default: false,
      },
      twoFactorSecret: {
        type: String,
        select: false,
      },
      loginAttempts: {
        type: Number,
        default: 0,
      },
      lockUntil: {
        type: Date,
      },
      passwordChangedAt: {
        type: Date,
      },
    },
  },
  profile: {
    bio: {
      type: String,
      maxlength: [500, 'La biografía no puede exceder 500 caracteres'],
    },
    location: {
      city: String,
      country: String,
      coordinates: {
        latitude: Number,
        longitude: Number,
      },
    },
    social: {
      website: String,
      twitter: String,
      linkedin: String,
      github: String,
    },
    interests: [{
      type: String,
      trim: true,
      maxlength: [50, 'Cada interés no puede exceder 50 caracteres'],
    }],
    skills: [{
      name: {
        type: String,
        required: true,
        trim: true,
      },
      level: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced', 'expert'],
        default: 'beginner',
      },
    }],
  },
  activity: {
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
    loginCount: {
      type: Number,
      default: 0,
    },
    totalSessionTime: {
      type: Number,
      default: 0, // en minutos
    },
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended', 'deleted'],
    default: 'active',
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  emailVerificationToken: {
    type: String,
    select: false,
  },
  emailVerificationExpires: {
    type: Date,
    select: false,
  },
  passwordResetToken: {
    type: String,
    select: false,
  },
  passwordResetExpires: {
    type: Date,
    select: false,
  },
  sessions: [{
    token: {
      type: String,
      required: true,
    },
    device: {
      type: String,
      required: true,
    },
    ip: {
      type: String,
      required: true,
    },
    location: {
      city: String,
      country: String,
      coordinates: {
        latitude: Number,
        longitude: Number,
      },
    },
    userAgent: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  }],
  analytics: {
    profileViews: {
      type: Number,
      default: 0,
    },
    tasksCompleted: {
      type: Number,
      default: 0,
    },
    eventsCreated: {
      type: Number,
      default: 0,
    },
    goalsAchieved: {
      type: Number,
      default: 0,
    },
    averageProductivity: {
      type: Number,
      default: 0,
    },
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Índices para optimizar consultas
userSchema.index({ email: 1 });
userSchema.index({ status: 1 });
userSchema.index({ 'activity.lastLogin': -1 });
userSchema.index({ 'activity.lastActive': -1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ updatedAt: -1 });

// Índice de texto para búsquedas
userSchema.index({
  name: 'text',
  email: 'text',
  'profile.bio': 'text',
  'profile.interests': 'text',
});

// Virtuals
userSchema.virtual('isLocked').get(function() {
  return !!(this.settings.security.lockUntil && this.settings.security.lockUntil > Date.now());
});

userSchema.virtual('accountAge').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

userSchema.virtual('profileCompleteness').get(function() {
  const fields = ['name', 'email', 'avatar', 'profile.bio', 'profile.location.city'];
  const completedFields = fields.filter(field => {
    const value = field.split('.').reduce((obj, key) => obj?.[key], this);
    return value && value !== '';
  });
  return (completedFields.length / fields.length) * 100;
});

userSchema.virtual('securityLevel').get(function() {
  let score = 0;
  if (this.emailVerified) score += 25;
  if (this.phone) score += 25;
  if (this.settings.security.twoFactorEnabled) score += 50;
  return Math.min(score, 100);
});

// Middleware pre-save
userSchema.pre('save', async function(next) {
  // Encriptar contraseña si es nueva o modificada
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
    this.settings.security.passwordChangedAt = Date.now();
  }
  
  // Actualizar analytics
  if (this.isModified('profile.bio') || this.isModified('profile.location')) {
    this.analytics.profileViews += 1;
  }
  
  next();
});

// Métodos de instancia
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.incrementLoginAttempts = function() {
  // Si tenemos intentos previos y no está bloqueado, incrementar
  if (this.settings.security.lockUntil && this.settings.security.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { 'settings.security.lockUntil': 1 },
      $set: { 'settings.security.loginAttempts': 1 }
    });
  }
  
  const updates = { $inc: { 'settings.security.loginAttempts': 1 } };
  
  // Si hemos alcanzado el máximo de intentos y no está bloqueado, bloquear
  if (this.settings.security.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = { 'settings.security.lockUntil': Date.now() + 2 * 60 * 60 * 1000 }; // 2 horas
  }
  
  return this.updateOne(updates);
};

userSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: { 'settings.security.loginAttempts': 1, 'settings.security.lockUntil': 1 }
  });
};

userSchema.methods.updateLastLogin = function() {
  this.activity.lastLogin = new Date();
  this.activity.lastActive = new Date();
  this.activity.loginCount += 1;
  return this.save();
};

userSchema.methods.addSession = function(sessionData) {
  this.sessions.push(sessionData);
  return this.save();
};

userSchema.methods.removeSession = function(token) {
  this.sessions = this.sessions.filter(session => session.token !== token);
  return this.save();
};

userSchema.methods.removeAllSessions = function() {
  this.sessions = [];
  return this.save();
};

userSchema.methods.updateProfile = function(profileData) {
  Object.assign(this, profileData);
  return this.save();
};

userSchema.methods.updatePreferences = function(preferences) {
  this.preferences = { ...this.preferences, ...preferences };
  return this.save();
};

userSchema.methods.updateSettings = function(settings) {
  this.settings = { ...this.settings, ...settings };
  return this.save();
};

userSchema.methods.enableTwoFactor = function(secret) {
  this.settings.security.twoFactorEnabled = true;
  this.settings.security.twoFactorSecret = secret;
  return this.save();
};

userSchema.methods.disableTwoFactor = function() {
  this.settings.security.twoFactorEnabled = false;
  this.settings.security.twoFactorSecret = undefined;
  return this.save();
};

userSchema.methods.verifyEmail = function() {
  this.emailVerified = true;
  this.emailVerificationToken = undefined;
  this.emailVerificationExpires = undefined;
  return this.save();
};

userSchema.methods.generatePasswordReset = function() {
  const resetToken = require('crypto').randomBytes(32).toString('hex');
  this.passwordResetToken = require('crypto').createHash('sha256').update(resetToken).digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutos
  return resetToken;
};

userSchema.methods.resetPassword = function(newPassword) {
  this.password = newPassword;
  this.passwordResetToken = undefined;
  this.passwordResetExpires = undefined;
  return this.save();
};

// Métodos estáticos
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

userSchema.statics.findActiveUsers = function() {
  return this.find({ status: 'active' }).sort({ 'activity.lastActive': -1 });
};

userSchema.statics.findByStatus = function(status) {
  return this.find({ status }).sort({ createdAt: -1 });
};

userSchema.statics.searchUsers = function(query) {
  return this.find({
    $text: { $search: query },
    status: 'active',
  }).sort({ score: { $meta: 'textScore' } });
};

userSchema.statics.getUserStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: null,
        totalUsers: { $sum: 1 },
        activeUsers: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
        verifiedUsers: { $sum: { $cond: ['$emailVerified', 1, 0] } },
        twoFactorUsers: { $sum: { $cond: ['$settings.security.twoFactorEnabled', 1, 0] } },
        averageProfileCompleteness: { $avg: '$profileCompleteness' },
        averageSecurityLevel: { $avg: '$securityLevel' },
      },
    },
  ]);
};

userSchema.statics.getRecentUsers = function(days = 7) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return this.find({
    createdAt: { $gte: startDate },
  }).sort({ createdAt: -1 });
};

userSchema.statics.getTopUsers = function(limit = 10) {
  return this.find({ status: 'active' })
    .sort({ 'analytics.tasksCompleted': -1, 'analytics.eventsCreated': -1 })
    .limit(limit);
};

module.exports = mongoose.model('User', userSchema);
