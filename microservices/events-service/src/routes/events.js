const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const { validateEvent } = require('../middleware/validation');
const { logger } = require('../utils/logger');
const { asyncHandler } = require('../utils/asyncHandler');

// GET /api/events - Obtener todos los eventos del usuario
router.get('/', asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const { startDate, endDate, category, status, limit = 50, offset = 0 } = req.query;

  let query = { userId, isDeleted: false };

  // Filtros opcionales
  if (startDate && endDate) {
    query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
  }
  if (category) {
    query.category = category;
  }
  if (status) {
    query.status = status;
  }

  const events = await Event.find(query)
    .sort({ date: 1, time: 1 })
    .limit(parseInt(limit))
    .skip(parseInt(offset));

  logger.info(`Eventos obtenidos para usuario ${userId}: ${events.length}`);
  res.json({
    success: true,
    data: events,
    pagination: {
      limit: parseInt(limit),
      offset: parseInt(offset),
      total: events.length
    }
  });
}));

// GET /api/events/date/:date - Obtener eventos de una fecha específica
router.get('/date/:date', asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const { date } = req.params;

  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const events = await Event.find({
    userId,
    date: { $gte: startOfDay, $lte: endOfDay },
    isDeleted: false
  }).sort({ time: 1 });

  logger.info(`Eventos del día ${date} para usuario ${userId}: ${events.length}`);
  res.json({
    success: true,
    data: events
  });
}));

// GET /api/events/today - Obtener eventos de hoy
router.get('/today', asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const events = await Event.getTodayEvents(userId);

  logger.info(`Eventos de hoy para usuario ${userId}: ${events.length}`);
  res.json({
    success: true,
    data: events
  });
}));

// GET /api/events/:id - Obtener un evento específico
router.get('/:id', asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const { id } = req.params;

  const event = await Event.findOne({ _id: id, userId, isDeleted: false });
  
  if (!event) {
    return res.status(404).json({
      success: false,
      message: 'Evento no encontrado'
    });
  }

  res.json({
    success: true,
    data: event
  });
}));

// POST /api/events - Crear un nuevo evento
router.post('/', validateEvent, asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const eventData = { ...req.body, userId };

  const event = new Event(eventData);
  await event.save();

  logger.info(`Evento creado: ${event._id} para usuario ${userId}`);
  res.status(201).json({
    success: true,
    message: 'Evento creado exitosamente',
    data: event
  });
}));

// PUT /api/events/:id - Actualizar un evento
router.put('/:id', validateEvent, asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const { id } = req.params;
  const updateData = req.body;

  const event = await Event.findOneAndUpdate(
    { _id: id, userId, isDeleted: false },
    updateData,
    { new: true, runValidators: true }
  );

  if (!event) {
    return res.status(404).json({
      success: false,
      message: 'Evento no encontrado'
    });
  }

  logger.info(`Evento actualizado: ${id} para usuario ${userId}`);
  res.json({
    success: true,
    message: 'Evento actualizado exitosamente',
    data: event
  });
}));

// DELETE /api/events/:id - Eliminar un evento (soft delete)
router.delete('/:id', asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const { id } = req.params;

  const event = await Event.findOne({ _id: id, userId, isDeleted: false });
  
  if (!event) {
    return res.status(404).json({
      success: false,
      message: 'Evento no encontrado'
    });
  }

  await event.softDelete();

  logger.info(`Evento eliminado: ${id} para usuario ${userId}`);
  res.json({
    success: true,
    message: 'Evento eliminado exitosamente'
  });
}));

// POST /api/events/:id/restore - Restaurar un evento eliminado
router.post('/:id/restore', asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const { id } = req.params;

  const event = await Event.findOne({ _id: id, userId, isDeleted: true });
  
  if (!event) {
    return res.status(404).json({
      success: false,
      message: 'Evento no encontrado o no eliminado'
    });
  }

  await event.restore();

  logger.info(`Evento restaurado: ${id} para usuario ${userId}`);
  res.json({
    success: true,
    message: 'Evento restaurado exitosamente',
    data: event
  });
}));

// GET /api/events/search - Buscar eventos
router.get('/search', asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const { q, category, status, startDate, endDate } = req.query;

  let query = { userId, isDeleted: false };

  // Búsqueda por texto
  if (q) {
    query.$or = [
      { title: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } },
      { location: { $regex: q, $options: 'i' } }
    ];
  }

  // Filtros adicionales
  if (category) query.category = category;
  if (status) query.status = status;
  if (startDate && endDate) {
    query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
  }

  const events = await Event.find(query).sort({ date: 1, time: 1 });

  logger.info(`Búsqueda de eventos para usuario ${userId}: ${events.length} resultados`);
  res.json({
    success: true,
    data: events,
    query: { q, category, status, startDate, endDate }
  });
}));

module.exports = router;
