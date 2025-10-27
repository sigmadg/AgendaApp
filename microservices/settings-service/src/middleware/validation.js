const Joi = require('joi');

// Esquema de validación para crear configuración
const settingSchema = Joi.object({
  key: Joi.string().required().trim().max(100).messages({
    'string.empty': 'La clave es requerida',
    'string.max': 'La clave no puede exceder 100 caracteres',
  }),
  value: Joi.any().required().messages({
    'any.required': 'El valor es requerido',
  }),
  category: Joi.string().valid('app', 'user', 'system', 'feature').required().messages({
    'any.only': 'La categoría debe ser "app", "user", "system" o "feature"',
  }),
  type: Joi.string().valid('string', 'number', 'boolean', 'object', 'array').required().messages({
    'any.only': 'El tipo debe ser "string", "number", "boolean", "object" o "array"',
  }),
  description: Joi.string().trim().max(500).allow('').messages({
    'string.max': 'La descripción no puede exceder 500 caracteres',
  }),
  isPublic: Joi.boolean().default(false),
  isReadOnly: Joi.boolean().default(false),
  isSystem: Joi.boolean().default(false),
  validation: Joi.object({
    required: Joi.boolean().default(false),
    min: Joi.number(),
    max: Joi.number(),
    minLength: Joi.number(),
    maxLength: Joi.number(),
    pattern: Joi.string(),
    enum: Joi.array().items(Joi.string()),
  }).default({}),
  defaultValue: Joi.any(),
  tags: Joi.array().items(
    Joi.string().trim().max(50).messages({
      'string.max': 'Cada tag no puede exceder 50 caracteres',
    })
  ).default([]),
  dependencies: Joi.array().items(
    Joi.object({
      key: Joi.string().required(),
      value: Joi.any().required(),
      operator: Joi.string().valid('equals', 'not_equals', 'greater_than', 'less_than', 'contains', 'not_contains').default('equals'),
    })
  ).default([]),
  metadata: Joi.object({
    source: Joi.string().valid('web', 'mobile', 'api', 'import', 'system').default('web'),
    device: Joi.string().allow(''),
    version: Joi.string().allow(''),
    environment: Joi.string().valid('development', 'staging', 'production').default('development'),
  }).default({}),
});

// Esquema de validación para actualizar configuración
const settingUpdateSchema = Joi.object({
  value: Joi.any().messages({
    'any.required': 'El valor es requerido',
  }),
  description: Joi.string().trim().max(500).allow('').messages({
    'string.max': 'La descripción no puede exceder 500 caracteres',
  }),
  isPublic: Joi.boolean(),
  isReadOnly: Joi.boolean(),
  validation: Joi.object({
    required: Joi.boolean(),
    min: Joi.number(),
    max: Joi.number(),
    minLength: Joi.number(),
    maxLength: Joi.number(),
    pattern: Joi.string(),
    enum: Joi.array().items(Joi.string()),
  }),
  defaultValue: Joi.any(),
  tags: Joi.array().items(
    Joi.string().trim().max(50).messages({
      'string.max': 'Cada tag no puede exceder 50 caracteres',
    })
  ),
  dependencies: Joi.array().items(
    Joi.object({
      key: Joi.string().required(),
      value: Joi.any().required(),
      operator: Joi.string().valid('equals', 'not_equals', 'greater_than', 'less_than', 'contains', 'not_contains'),
    })
  ),
  metadata: Joi.object({
    source: Joi.string().valid('web', 'mobile', 'api', 'import', 'system'),
    device: Joi.string().allow(''),
    version: Joi.string().allow(''),
    environment: Joi.string().valid('development', 'staging', 'production'),
  }),
});

// Middleware de validación para crear configuración
const validateSetting = (req, res, next) => {
  const { error } = settingSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message,
    }));
    
    return res.status(400).json({
      success: false,
      message: 'Datos de validación inválidos',
      errors,
    });
  }
  
  next();
};

// Middleware de validación para actualizar configuración
const validateSettingUpdate = (req, res, next) => {
  const { error } = settingUpdateSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message,
    }));
    
    return res.status(400).json({
      success: false,
      message: 'Datos de validación inválidos',
      errors,
    });
  }
  
  next();
};

// Validación específica para configuración de aplicación
const validateAppSetting = (req, res, next) => {
  const appSettingSchema = Joi.object({
    language: Joi.string().valid('es', 'en', 'fr', 'de', 'it', 'pt').messages({
      'any.only': 'El idioma debe ser "es", "en", "fr", "de", "it" o "pt"',
    }),
    timezone: Joi.string().messages({
      'string.base': 'La zona horaria debe ser una cadena',
    }),
    dateFormat: Joi.string().valid('DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD').messages({
      'any.only': 'El formato de fecha debe ser "DD/MM/YYYY", "MM/DD/YYYY" o "YYYY-MM-DD"',
    }),
    timeFormat: Joi.string().valid('12h', '24h').messages({
      'any.only': 'El formato de hora debe ser "12h" o "24h"',
    }),
    currency: Joi.string().length(3).messages({
      'string.length': 'La moneda debe tener 3 caracteres',
    }),
    theme: Joi.string().valid('light', 'dark', 'system').messages({
      'any.only': 'El tema debe ser "light", "dark" o "system"',
    }),
    notifications: Joi.object({
      push: Joi.boolean(),
      email: Joi.boolean(),
      sms: Joi.boolean(),
    }),
    privacy: Joi.object({
      publicProfile: Joi.boolean(),
      showEmail: Joi.boolean(),
      showPhone: Joi.boolean(),
    }),
  });
  
  const { error } = appSettingSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message,
    }));
    
    return res.status(400).json({
      success: false,
      message: 'Datos de validación inválidos para configuración de aplicación',
      errors,
    });
  }
  
  next();
};

// Validación específica para configuración de usuario
const validateUserSetting = (req, res, next) => {
  const userSettingSchema = Joi.object({
    theme: Joi.string().valid('light', 'dark', 'system').messages({
      'any.only': 'El tema debe ser "light", "dark" o "system"',
    }),
    fontSize: Joi.string().valid('small', 'medium', 'large').messages({
      'any.only': 'El tamaño de fuente debe ser "small", "medium" o "large"',
    }),
    animations: Joi.boolean(),
    notifications: Joi.object({
      push: Joi.boolean(),
      email: Joi.boolean(),
      sms: Joi.boolean(),
      marketing: Joi.boolean(),
      updates: Joi.boolean(),
      reminders: Joi.boolean(),
    }),
    privacy: Joi.object({
      publicProfile: Joi.boolean(),
      showEmail: Joi.boolean(),
      showPhone: Joi.boolean(),
      showLastSeen: Joi.boolean(),
    }),
    appearance: Joi.object({
      compactMode: Joi.boolean(),
      showAvatars: Joi.boolean(),
      showTimestamps: Joi.boolean(),
    }),
  });
  
  const { error } = userSettingSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message,
    }));
    
    return res.status(400).json({
      success: false,
      message: 'Datos de validación inválidos para configuración de usuario',
      errors,
    });
  }
  
  next();
};

module.exports = {
  validateSetting,
  validateSettingUpdate,
  validateAppSetting,
  validateUserSetting,
  settingSchema,
  settingUpdateSchema,
};
