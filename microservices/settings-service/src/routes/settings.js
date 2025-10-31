const express = require('express');
const router = express.Router();
const Setting = require('../models/Setting');
const { validateSetting, validateSettingUpdate } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/asyncHandler');

// Middleware de autenticación para todas las rutas
router.use(authenticateToken);

// GET /api/settings - Obtener todas las configuraciones del usuario
router.get('/', asyncHandler(async (req, res) => {
  const { category, isPublic, isSystem, page = 1, limit = 20 } = req.query;
  const userId = req.user.id;
  
  const query = { userId };
  
  if (category) query.category = category;
  if (isPublic !== undefined) query.isPublic = isPublic === 'true';
  if (isSystem !== undefined) query.isSystem = isSystem === 'true';
  
  const settings = await Setting.find(query)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ category: 1, key: 1 });
  
  const total = await Setting.countDocuments(query);
  
  res.json({
    success: true,
    data: settings,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  });
}));

// GET /api/settings/app - Obtener configuración de la aplicación
router.get('/app', asyncHandler(async (req, res) => {
  const settings = await Setting.findByCategory('app');
  
  res.json({
    success: true,
    data: settings,
  });
}));

// GET /api/settings/user - Obtener configuración del usuario
router.get('/user', asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const settings = await Setting.findByUser(userId);
  
  res.json({
    success: true,
    data: settings,
  });
}));

// GET /api/settings/:category - Obtener configuración por categoría
router.get('/:category', asyncHandler(async (req, res) => {
  const { category } = req.params;
  const userId = req.user.id;
  
  const settings = await Setting.findByCategory(category, userId);
  
  res.json({
    success: true,
    data: settings,
  });
}));

// GET /api/settings/:category/:key - Obtener configuración específica
router.get('/:category/:key', asyncHandler(async (req, res) => {
  const { category, key } = req.params;
  const userId = req.user.id;
  
  const setting = await Setting.findByKey(key, category, userId);
  
  if (!setting) {
    return res.status(404).json({
      success: false,
      message: 'Configuración no encontrada',
    });
  }
  
  // Incrementar contador de vistas
  await setting.incrementViews();
  
  res.json({
    success: true,
    data: setting,
  });
}));

// POST /api/settings - Crear nueva configuración
router.post('/', validateSetting, asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const settingData = { ...req.body, userId };
  
  const setting = new Setting(settingData);
  await setting.save();
  
  res.status(201).json({
    success: true,
    message: 'Configuración creada exitosamente',
    data: setting,
  });
}));

// PUT /api/settings/app - Actualizar configuración de la aplicación
router.put('/app', validateSettingUpdate, asyncHandler(async (req, res) => {
  const settingsData = req.body;
  
  const operations = Object.entries(settingsData).map(([key, value]) => ({
    updateOne: {
      filter: { key, category: 'app' },
      update: { $set: { value, updatedAt: new Date() } },
      upsert: true,
    },
  }));
  
  await Setting.bulkWrite(operations);
  
  const updatedSettings = await Setting.findByCategory('app');
  
  res.json({
    success: true,
    message: 'Configuración de aplicación actualizada exitosamente',
    data: updatedSettings,
  });
}));

// PUT /api/settings/user - Actualizar configuración del usuario
router.put('/user', validateSettingUpdate, asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const settingsData = req.body;
  
  const operations = Object.entries(settingsData).map(([key, value]) => ({
    updateOne: {
      filter: { key, category: 'user', userId },
      update: { $set: { value, userId, updatedAt: new Date() } },
      upsert: true,
    },
  }));
  
  await Setting.bulkWrite(operations);
  
  const updatedSettings = await Setting.findByUser(userId);
  
  res.json({
    success: true,
    message: 'Configuración de usuario actualizada exitosamente',
    data: updatedSettings,
  });
}));

// PUT /api/settings/:category/:key - Actualizar configuración específica
router.put('/:category/:key', validateSettingUpdate, asyncHandler(async (req, res) => {
  const { category, key } = req.params;
  const { value, reason } = req.body;
  const userId = req.user.id;
  
  const setting = await Setting.findByKey(key, category, userId);
  
  if (!setting) {
    return res.status(404).json({
      success: false,
      message: 'Configuración no encontrada',
    });
  }
  
  if (setting.isReadOnly) {
    return res.status(403).json({
      success: false,
      message: 'Esta configuración es de solo lectura',
    });
  }
  
  await setting.updateValue(value, userId, reason);
  
  res.json({
    success: true,
    message: 'Configuración actualizada exitosamente',
    data: setting,
  });
}));

// DELETE /api/settings/:category/:key - Eliminar configuración
router.delete('/:category/:key', asyncHandler(async (req, res) => {
  const { category, key } = req.params;
  const userId = req.user.id;
  
  const setting = await Setting.findByKey(key, category, userId);
  
  if (!setting) {
    return res.status(404).json({
      success: false,
      message: 'Configuración no encontrada',
    });
  }
  
  if (setting.isSystem) {
    return res.status(403).json({
      success: false,
      message: 'No se puede eliminar una configuración del sistema',
    });
  }
  
  await Setting.findByIdAndDelete(setting._id);
  
  res.json({
    success: true,
    message: 'Configuración eliminada exitosamente',
  });
}));

// GET /api/settings/stats - Obtener estadísticas de configuración
router.get('/stats', asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const stats = await Setting.getSettingsStats(userId);
  
  res.json({
    success: true,
    data: stats[0] || {
      totalSettings: 0,
      totalChanges: 0,
      totalViews: 0,
      averageChanges: 0,
      averageViews: 0,
    },
  });
}));

// GET /api/settings/search - Buscar configuraciones
router.get('/search', asyncHandler(async (req, res) => {
  const { q, category, isPublic, isSystem } = req.query;
  const userId = req.user.id;
  
  let query = { userId };
  
  if (q) {
    query.$text = { $search: q };
  }
  if (category) query.category = category;
  if (isPublic !== undefined) query.isPublic = isPublic === 'true';
  if (isSystem !== undefined) query.isSystem = isSystem === 'true';
  
  const settings = await Setting.find(query)
    .sort({ score: { $meta: 'textScore' }, category: 1, key: 1 });
  
  res.json({
    success: true,
    data: settings,
  });
}));

// GET /api/settings/history - Obtener historial de cambios
router.get('/history', asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const userId = req.user.id;
  
  const settings = await Setting.find({ userId })
    .sort({ 'analytics.lastChanged': -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);
  
  const total = await Setting.countDocuments({ userId });
  
  res.json({
    success: true,
    data: settings,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  });
}));

// POST /api/settings/reset - Restablecer configuración
router.post('/reset', asyncHandler(async (req, res) => {
  const { category } = req.body;
  const userId = req.user.id;
  
  const query = { userId };
  if (category) query.category = category;
  
  const settings = await Setting.find(query);
  
  for (const setting of settings) {
    if (setting.defaultValue !== undefined) {
      await setting.resetToDefault();
    }
  }
  
  res.json({
    success: true,
    message: 'Configuración restablecida exitosamente',
  });
}));

// GET /api/settings/export - Exportar configuración
router.get('/export', asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const settings = await Setting.exportSettings(userId);
  
  res.json({
    success: true,
    data: settings,
    exportedAt: new Date().toISOString(),
  });
}));

// POST /api/settings/import - Importar configuración
router.post('/import', asyncHandler(async (req, res) => {
  const { settings } = req.body;
  const userId = req.user.id;
  
  if (!Array.isArray(settings)) {
    return res.status(400).json({
      success: false,
      message: 'Las configuraciones deben ser un array',
    });
  }
  
  // Agregar userId a cada configuración
  const settingsWithUserId = settings.map(setting => ({
    ...setting,
    userId,
  }));
  
  await Setting.importSettings(settingsWithUserId, userId);
  
  res.json({
    success: true,
    message: 'Configuración importada exitosamente',
  });
}));

// POST /api/settings/validate - Validar configuración
router.post('/validate', asyncHandler(async (req, res) => {
  const { settings } = req.body;
  
  const errors = [];
  
  for (const [key, value] of Object.entries(settings)) {
    const setting = await Setting.findOne({ key });
    
    if (setting && setting.validation) {
      const validation = setting.validation;
      
      if (validation.required && (value === null || value === undefined || value === '')) {
        errors.push(`${key} es requerido`);
      }
      
      if (validation.min !== undefined && value < validation.min) {
        errors.push(`${key} debe ser mayor o igual a ${validation.min}`);
      }
      
      if (validation.max !== undefined && value > validation.max) {
        errors.push(`${key} debe ser menor o igual a ${validation.max}`);
      }
      
      if (validation.minLength !== undefined && value.length < validation.minLength) {
        errors.push(`${key} debe tener al menos ${validation.minLength} caracteres`);
      }
      
      if (validation.maxLength !== undefined && value.length > validation.maxLength) {
        errors.push(`${key} debe tener como máximo ${validation.maxLength} caracteres`);
      }
      
      if (validation.enum && !validation.enum.includes(value)) {
        errors.push(`${key} debe ser uno de: ${validation.enum.join(', ')}`);
      }
    }
  }
  
  res.json({
    success: errors.length === 0,
    errors,
  });
}));

// GET /api/settings/defaults - Obtener configuración por defecto
router.get('/defaults', asyncHandler(async (req, res) => {
  const { category } = req.query;
  
  const query = { isSystem: true };
  if (category) query.category = category;
  
  const settings = await Setting.find(query);
  
  res.json({
    success: true,
    data: settings,
  });
}));

// POST /api/settings/apply-defaults/:category - Aplicar configuración por defecto
router.post('/apply-defaults/:category', asyncHandler(async (req, res) => {
  const { category } = req.params;
  const userId = req.user.id;
  
  await Setting.resetToDefaults(category, userId);
  
  res.json({
    success: true,
    message: 'Configuración por defecto aplicada exitosamente',
  });
}));

// POST /api/settings/revert/:settingId - Revertir configuración
router.post('/revert/:settingId', asyncHandler(async (req, res) => {
  const { settingId } = req.params;
  const { versionIndex } = req.body;
  
  const setting = await Setting.findById(settingId);
  
  if (!setting) {
    return res.status(404).json({
      success: false,
      message: 'Configuración no encontrada',
    });
  }
  
  await setting.revertToVersion(versionIndex);
  
  res.json({
    success: true,
    message: 'Configuración revertida exitosamente',
    data: setting,
  });
}));

// POST /api/settings/sync - Sincronizar configuración
router.post('/sync', asyncHandler(async (req, res) => {
  const { settings } = req.body;
  const userId = req.user.id;
  
  if (!Array.isArray(settings)) {
    return res.status(400).json({
      success: false,
      message: 'Las configuraciones deben ser un array',
    });
  }
  
  const operations = settings.map(setting => ({
    updateOne: {
      filter: { key: setting.key, category: setting.category, userId },
      update: { $set: { ...setting, userId } },
      upsert: true,
    },
  }));
  
  await Setting.bulkWrite(operations);
  
  res.json({
    success: true,
    message: 'Configuración sincronizada exitosamente',
  });
}));

module.exports = router;
