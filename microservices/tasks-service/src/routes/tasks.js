const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { validateTask, validateTaskUpdate } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/asyncHandler');

// Middleware de autenticación para todas las rutas
router.use(authenticateToken);

// GET /api/tasks - Obtener todas las tareas del usuario
router.get('/', asyncHandler(async (req, res) => {
  const { type, status, priority, completed, urgent, overdue, page = 1, limit = 20 } = req.query;
  const userId = req.user.id;
  
  const options = {
    type,
    status,
    priority,
    completed: completed !== undefined ? completed === 'true' : undefined,
    urgent: urgent !== undefined ? urgent === 'true' : undefined,
    overdue: overdue !== undefined ? overdue === 'true' : undefined,
  };
  
  const tasks = await Task.findByUser(userId, options)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .populate('categoryId', 'name color')
    .populate('projectId', 'name status')
    .populate('collaborators.userId', 'name email');
  
  const total = await Task.countDocuments({ userId });
  
  res.json({
    success: true,
    data: tasks,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  });
}));

// GET /api/tasks/daily - Obtener tareas diarias
router.get('/daily', asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { date } = req.query;
  
  let query = { userId, type: 'daily' };
  
  if (date) {
    const targetDate = new Date(date);
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));
    query.date = { $gte: startOfDay, $lte: endOfDay };
  }
  
  const tasks = await Task.find(query)
    .sort({ time: 1, priority: -1 })
    .populate('categoryId', 'name color')
    .populate('projectId', 'name status');
  
  res.json({
    success: true,
    data: tasks,
  });
}));

// GET /api/tasks/weekly - Obtener tareas semanales
router.get('/weekly', asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { startDate, endDate } = req.query;
  
  let query = { userId, type: 'weekly' };
  
  if (startDate && endDate) {
    query.date = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }
  
  const tasks = await Task.find(query)
    .sort({ date: 1, priority: -1 })
    .populate('categoryId', 'name color')
    .populate('projectId', 'name status');
  
  res.json({
    success: true,
    data: tasks,
  });
}));

// GET /api/tasks/:id - Obtener tarea específica
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  
  const task = await Task.findOne({ _id: id, userId })
    .populate('categoryId', 'name color')
    .populate('projectId', 'name status')
    .populate('collaborators.userId', 'name email');
  
  if (!task) {
    return res.status(404).json({
      success: false,
      message: 'Tarea no encontrada',
    });
  }
  
  // Incrementar contador de vistas
  task.analytics.views += 1;
  await task.save();
  
  res.json({
    success: true,
    data: task,
  });
}));

// POST /api/tasks - Crear nueva tarea
router.post('/', validateTask, asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const taskData = { ...req.body, userId };
  
  const task = new Task(taskData);
  await task.save();
  
  await task.populate('categoryId', 'name color');
  await task.populate('projectId', 'name status');
  await task.populate('collaborators.userId', 'name email');
  
  res.status(201).json({
    success: true,
    message: 'Tarea creada exitosamente',
    data: task,
  });
}));

// POST /api/tasks/daily - Crear tarea diaria
router.post('/daily', validateTask, asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const taskData = { ...req.body, userId, type: 'daily' };
  
  const task = new Task(taskData);
  await task.save();
  
  res.status(201).json({
    success: true,
    message: 'Tarea diaria creada exitosamente',
    data: task,
  });
}));

// POST /api/tasks/weekly - Crear tarea semanal
router.post('/weekly', validateTask, asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const taskData = { ...req.body, userId, type: 'weekly' };
  
  const task = new Task(taskData);
  await task.save();
  
  res.status(201).json({
    success: true,
    message: 'Tarea semanal creada exitosamente',
    data: task,
  });
}));

// PUT /api/tasks/:id - Actualizar tarea
router.put('/:id', validateTaskUpdate, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  
  const task = await Task.findOneAndUpdate(
    { _id: id, userId },
    req.body,
    { new: true, runValidators: true }
  );
  
  if (!task) {
    return res.status(404).json({
      success: false,
      message: 'Tarea no encontrada',
    });
  }
  
  await task.populate('categoryId', 'name color');
  await task.populate('projectId', 'name status');
  await task.populate('collaborators.userId', 'name email');
  
  res.json({
    success: true,
    message: 'Tarea actualizada exitosamente',
    data: task,
  });
}));

// PATCH /api/tasks/:id/toggle - Alternar estado de completado
router.patch('/:id/toggle', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  
  const task = await Task.findOne({ _id: id, userId });
  
  if (!task) {
    return res.status(404).json({
      success: false,
      message: 'Tarea no encontrada',
    });
  }
  
  task.completed = !task.completed;
  task.status = task.completed ? 'completed' : 'pending';
  await task.save();
  
  res.json({
    success: true,
    message: `Tarea ${task.completed ? 'completada' : 'marcada como pendiente'}`,
    data: task,
  });
}));

// PATCH /api/tasks/:id/notes - Agregar notas a tarea
router.patch('/:id/notes', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { notes } = req.body;
  const userId = req.user.id;
  
  if (!notes) {
    return res.status(400).json({
      success: false,
      message: 'Las notas son requeridas',
    });
  }
  
  const task = await Task.findOne({ _id: id, userId });
  
  if (!task) {
    return res.status(404).json({
      success: false,
      message: 'Tarea no encontrada',
    });
  }
  
  task.notes = notes;
  await task.save();
  
  res.json({
    success: true,
    message: 'Notas actualizadas exitosamente',
    data: task,
  });
}));

// DELETE /api/tasks/:id - Eliminar tarea
router.delete('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  
  const task = await Task.findOneAndDelete({ _id: id, userId });
  
  if (!task) {
    return res.status(404).json({
      success: false,
      message: 'Tarea no encontrada',
    });
  }
  
  res.json({
    success: true,
    message: 'Tarea eliminada exitosamente',
  });
}));

// GET /api/tasks/stats - Obtener estadísticas de tareas
router.get('/stats', asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const stats = await Task.getStats(userId);
  
  const result = stats[0] || {
    total: 0,
    completed: 0,
    pending: 0,
    urgent: 0,
    overdue: 0,
    highPriority: 0,
    mediumPriority: 0,
    lowPriority: 0,
  };
  
  result.completionRate = result.total > 0 ? (result.completed / result.total) * 100 : 0;
  
  res.json({
    success: true,
    data: result,
  });
}));

// GET /api/tasks/search - Buscar tareas
router.get('/search', asyncHandler(async (req, res) => {
  const { q, type, priority, status } = req.query;
  const userId = req.user.id;
  
  let query = { userId };
  
  if (q) {
    query.$text = { $search: q };
  }
  if (type) query.type = type;
  if (priority) query.priority = priority;
  if (status) query.status = status;
  
  const tasks = await Task.find(query)
    .sort({ score: { $meta: 'textScore' }, date: 1 })
    .populate('categoryId', 'name color')
    .populate('projectId', 'name status');
  
  res.json({
    success: true,
    data: tasks,
  });
}));

// GET /api/tasks/date/:date - Obtener tareas por fecha
router.get('/date/:date', asyncHandler(async (req, res) => {
  const { date } = req.params;
  const userId = req.user.id;
  
  const targetDate = new Date(date);
  const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
  const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));
  
  const tasks = await Task.find({
    userId,
    date: { $gte: startOfDay, $lte: endOfDay },
  })
    .sort({ time: 1, priority: -1 })
    .populate('categoryId', 'name color')
    .populate('projectId', 'name status');
  
  res.json({
    success: true,
    data: tasks,
  });
}));

// GET /api/tasks/priority/:priority - Obtener tareas por prioridad
router.get('/priority/:priority', asyncHandler(async (req, res) => {
  const { priority } = req.params;
  const userId = req.user.id;
  
  const tasks = await Task.find({ userId, priority })
    .sort({ date: 1, priority: -1 })
    .populate('categoryId', 'name color')
    .populate('projectId', 'name status');
  
  res.json({
    success: true,
    data: tasks,
  });
}));

// POST /api/tasks/sync - Sincronizar tareas offline
router.post('/sync', asyncHandler(async (req, res) => {
  const { tasks } = req.body;
  const userId = req.user.id;
  
  if (!Array.isArray(tasks)) {
    return res.status(400).json({
      success: false,
      message: 'Las tareas deben ser un array',
    });
  }
  
  const results = [];
  
  for (const taskData of tasks) {
    try {
      const task = new Task({ ...taskData, userId });
      await task.save();
      results.push({ success: true, data: task });
    } catch (error) {
      results.push({ success: false, error: error.message });
    }
  }
  
  res.json({
    success: true,
    message: 'Sincronización completada',
    data: results,
  });
}));

// GET /api/tasks/export - Exportar tareas
router.get('/export', asyncHandler(async (req, res) => {
  const { format = 'json' } = req.query;
  const userId = req.user.id;
  
  const tasks = await Task.find({ userId })
    .populate('categoryId', 'name color')
    .populate('projectId', 'name status');
  
  if (format === 'csv') {
    // Implementar exportación CSV
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=tasks.csv');
    // ... lógica de CSV
  } else {
    res.json({
      success: true,
      data: tasks,
    });
  }
}));

// POST /api/tasks/import - Importar tareas
router.post('/import', asyncHandler(async (req, res) => {
  const { tasks } = req.body;
  const userId = req.user.id;
  
  if (!Array.isArray(tasks)) {
    return res.status(400).json({
      success: false,
      message: 'Las tareas deben ser un array',
    });
  }
  
  const results = [];
  
  for (const taskData of tasks) {
    try {
      const task = new Task({ ...taskData, userId });
      await task.save();
      results.push({ success: true, data: task });
    } catch (error) {
      results.push({ success: false, error: error.message });
    }
  }
  
  res.json({
    success: true,
    message: 'Importación completada',
    data: results,
  });
}));

module.exports = router;
