const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const profileRoutes = require('./routes/profile');
const { errorHandler } = require('./middleware/errorHandler');
const { requestLogger } = require('./middleware/requestLogger');

const app = express();
const PORT = process.env.PORT || 3003;

// Middleware de seguridad
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
}));

// Middleware de logging
app.use(morgan('combined'));
app.use(requestLogger);

// Middleware de compresión
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP por ventana
  message: {
    error: 'Demasiadas solicitudes desde esta IP, intenta de nuevo más tarde.',
  },
});
app.use('/api/', limiter);

// Middleware de parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/agendaapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Conectado a MongoDB');
})
.catch((error) => {
  console.error('❌ Error conectando a MongoDB:', error);
  process.exit(1);
});

// Rutas de salud
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    service: 'profile-service',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  });
});

// Rutas de la API
app.use('/api/profile', profileRoutes);

// Ruta de bienvenida
app.get('/', (req, res) => {
  res.json({
    message: 'Profile Service - AgendaApp',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      profile: '/api/profile',
    },
  });
});

// Middleware de manejo de errores
app.use(errorHandler);

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    message: `La ruta ${req.originalUrl} no existe`,
    timestamp: new Date().toISOString(),
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Profile Service ejecutándose en puerto ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`👤 API endpoints: http://localhost:${PORT}/api/profile`);
});

// Manejo de señales de terminación
process.on('SIGTERM', () => {
  console.log('🛑 Recibida señal SIGTERM, cerrando servidor...');
  mongoose.connection.close(() => {
    console.log('✅ Conexión a MongoDB cerrada');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 Recibida señal SIGINT, cerrando servidor...');
  mongoose.connection.close(() => {
    console.log('✅ Conexión a MongoDB cerrada');
    process.exit(0);
  });
});

module.exports = app;
