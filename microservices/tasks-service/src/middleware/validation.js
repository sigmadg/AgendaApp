const Joi = require('joi');

// Esquema de validación para crear tarea
const taskSchema = Joi.object({
  title: Joi.string().required().trim().max(200).messages({
    'string.empty': 'El título es requerido',
    'string.max': 'El título no puede exceder 200 caracteres',
  }),
  description: Joi.string().trim().max(1000).allow('').messages({
    'string.max': 'La descripción no puede exceder 1000 caracteres',
  }),
  date: Joi.date().required().messages({
    'date.base': 'La fecha es requerida',
    'date.empty': 'La fecha es requerida',
  }),
  time: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).allow('').messages({
    'string.pattern.base': 'Formato de hora inválido (HH:MM)',
  }),
  type: Joi.string().valid('daily', 'weekly').required().messages({
    'any.only': 'El tipo debe ser "daily" o "weekly"',
  }),
  priority: Joi.string().valid('low', 'medium', 'high').default('medium').messages({
    'any.only': 'La prioridad debe ser "low", "medium" o "high"',
  }),
  status: Joi.string().valid('pending', 'in-progress', 'completed', 'cancelled').default('pending').messages({
    'any.only': 'El estado debe ser "pending", "in-progress", "completed" o "cancelled"',
  }),
  completed: Joi.boolean().default(false),
  urgent: Joi.boolean().default(false),
  overdue: Joi.boolean().default(false),
  notes: Joi.string().trim().max(2000).allow('').messages({
    'string.max': 'Las notas no pueden exceder 2000 caracteres',
  }),
  tags: Joi.array().items(
    Joi.string().trim().max(50).messages({
      'string.max': 'Cada tag no puede exceder 50 caracteres',
    })
  ).default([]),
  categoryId: Joi.string().hex().length(24).allow(null).messages({
    'string.hex': 'ID de categoría inválido',
    'string.length': 'ID de categoría inválido',
  }),
  projectId: Joi.string().hex().length(24).allow(null).messages({
    'string.hex': 'ID de proyecto inválido',
    'string.length': 'ID de proyecto inválido',
  }),
  estimatedDuration: Joi.number().integer().min(1).allow(null).messages({
    'number.min': 'La duración estimada debe ser al menos 1 minuto',
  }),
  actualDuration: Joi.number().integer().min(0).allow(null).messages({
    'number.min': 'La duración actual no puede ser negativa',
  }),
  reminder: Joi.object({
    enabled: Joi.boolean().default(false),
    time: Joi.date().allow(null),
    type: Joi.string().valid('email', 'push', 'sms').default('push').messages({
      'any.only': 'El tipo de recordatorio debe ser "email", "push" o "sms"',
    }),
  }).default({}),
  recurrence: Joi.object({
    enabled: Joi.boolean().default(false),
    pattern: Joi.string().valid('daily', 'weekly', 'monthly', 'yearly').allow(null).messages({
      'any.only': 'El patrón debe ser "daily", "weekly", "monthly" o "yearly"',
    }),
    interval: Joi.number().integer().min(1).allow(null).messages({
      'number.min': 'El intervalo debe ser al menos 1',
    }),
    endDate: Joi.date().allow(null),
  }).default({}),
  collaborators: Joi.array().items(
    Joi.object({
      userId: Joi.string().hex().length(24).required().messages({
        'string.hex': 'ID de usuario inválido',
        'string.length': 'ID de usuario inválido',
      }),
      role: Joi.string().valid('viewer', 'editor', 'admin').default('viewer').messages({
        'any.only': 'El rol debe ser "viewer", "editor" o "admin"',
      }),
      permissions: Joi.array().items(
        Joi.string().valid('read', 'write', 'delete', 'share').messages({
          'any.only': 'El permiso debe ser "read", "write", "delete" o "share"',
        })
      ).default([]),
    })
  ).default([]),
  dependencies: Joi.array().items(
    Joi.object({
      taskId: Joi.string().hex().length(24).required().messages({
        'string.hex': 'ID de tarea inválido',
        'string.length': 'ID de tarea inválido',
      }),
      type: Joi.string().valid('blocks', 'blocked-by', 'related').required().messages({
        'any.only': 'El tipo debe ser "blocks", "blocked-by" o "related"',
      }),
    })
  ).default([]),
  metadata: Joi.object({
    source: Joi.string().valid('web', 'mobile', 'api', 'import').default('web').messages({
      'any.only': 'La fuente debe ser "web", "mobile", "api" o "import"',
    }),
    device: Joi.string().allow(''),
    location: Joi.object({
      latitude: Joi.number().min(-90).max(90).allow(null),
      longitude: Joi.number().min(-180).max(180).allow(null),
      address: Joi.string().allow(''),
    }).allow(null),
    weather: Joi.object({
      condition: Joi.string().allow(''),
      temperature: Joi.number().allow(null),
    }).allow(null),
  }).default({}),
});

// Esquema de validación para actualizar tarea
const taskUpdateSchema = Joi.object({
  title: Joi.string().trim().max(200).messages({
    'string.max': 'El título no puede exceder 200 caracteres',
  }),
  description: Joi.string().trim().max(1000).allow('').messages({
    'string.max': 'La descripción no puede exceder 1000 caracteres',
  }),
  date: Joi.date().messages({
    'date.base': 'Fecha inválida',
  }),
  time: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).allow('').messages({
    'string.pattern.base': 'Formato de hora inválido (HH:MM)',
  }),
  priority: Joi.string().valid('low', 'medium', 'high').messages({
    'any.only': 'La prioridad debe ser "low", "medium" o "high"',
  }),
  status: Joi.string().valid('pending', 'in-progress', 'completed', 'cancelled').messages({
    'any.only': 'El estado debe ser "pending", "in-progress", "completed" o "cancelled"',
  }),
  completed: Joi.boolean(),
  urgent: Joi.boolean(),
  overdue: Joi.boolean(),
  notes: Joi.string().trim().max(2000).allow('').messages({
    'string.max': 'Las notas no pueden exceder 2000 caracteres',
  }),
  tags: Joi.array().items(
    Joi.string().trim().max(50).messages({
      'string.max': 'Cada tag no puede exceder 50 caracteres',
    })
  ),
  categoryId: Joi.string().hex().length(24).allow(null).messages({
    'string.hex': 'ID de categoría inválido',
    'string.length': 'ID de categoría inválido',
  }),
  projectId: Joi.string().hex().length(24).allow(null).messages({
    'string.hex': 'ID de proyecto inválido',
    'string.length': 'ID de proyecto inválido',
  }),
  estimatedDuration: Joi.number().integer().min(1).allow(null).messages({
    'number.min': 'La duración estimada debe ser al menos 1 minuto',
  }),
  actualDuration: Joi.number().integer().min(0).allow(null).messages({
    'number.min': 'La duración actual no puede ser negativa',
  }),
  reminder: Joi.object({
    enabled: Joi.boolean(),
    time: Joi.date().allow(null),
    type: Joi.string().valid('email', 'push', 'sms').messages({
      'any.only': 'El tipo de recordatorio debe ser "email", "push" o "sms"',
    }),
  }),
  recurrence: Joi.object({
    enabled: Joi.boolean(),
    pattern: Joi.string().valid('daily', 'weekly', 'monthly', 'yearly').allow(null).messages({
      'any.only': 'El patrón debe ser "daily", "weekly", "monthly" o "yearly"',
    }),
    interval: Joi.number().integer().min(1).allow(null).messages({
      'number.min': 'El intervalo debe ser al menos 1',
    }),
    endDate: Joi.date().allow(null),
  }),
  collaborators: Joi.array().items(
    Joi.object({
      userId: Joi.string().hex().length(24).required().messages({
        'string.hex': 'ID de usuario inválido',
        'string.length': 'ID de usuario inválido',
      }),
      role: Joi.string().valid('viewer', 'editor', 'admin').messages({
        'any.only': 'El rol debe ser "viewer", "editor" o "admin"',
      }),
      permissions: Joi.array().items(
        Joi.string().valid('read', 'write', 'delete', 'share').messages({
          'any.only': 'El permiso debe ser "read", "write", "delete" o "share"',
        })
      ),
    })
  ),
  dependencies: Joi.array().items(
    Joi.object({
      taskId: Joi.string().hex().length(24).required().messages({
        'string.hex': 'ID de tarea inválido',
        'string.length': 'ID de tarea inválido',
      }),
      type: Joi.string().valid('blocks', 'blocked-by', 'related').required().messages({
        'any.only': 'El tipo debe ser "blocks", "blocked-by" o "related"',
      }),
    })
  ),
  metadata: Joi.object({
    source: Joi.string().valid('web', 'mobile', 'api', 'import').messages({
      'any.only': 'La fuente debe ser "web", "mobile", "api" o "import"',
    }),
    device: Joi.string().allow(''),
    location: Joi.object({
      latitude: Joi.number().min(-90).max(90).allow(null),
      longitude: Joi.number().min(-180).max(180).allow(null),
      address: Joi.string().allow(''),
    }).allow(null),
    weather: Joi.object({
      condition: Joi.string().allow(''),
      temperature: Joi.number().allow(null),
    }).allow(null),
  }),
});

// Middleware de validación para crear tarea
const validateTask = (req, res, next) => {
  const { error } = taskSchema.validate(req.body, { abortEarly: false });
  
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

// Middleware de validación para actualizar tarea
const validateTaskUpdate = (req, res, next) => {
  const { error } = taskUpdateSchema.validate(req.body, { abortEarly: false });
  
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

module.exports = {
  validateTask,
  validateTaskUpdate,
  taskSchema,
  taskUpdateSchema,
};
