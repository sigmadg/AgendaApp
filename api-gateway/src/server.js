const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
require('dotenv').config();

const { logger } = require('./utils/logger');
const { errorHandler } = require('./middleware/errorHandler');
const { authMiddleware } = require('./middleware/auth');
const { requestLogger } = require('./middleware/requestLogger');
const { circuitBreaker } = require('./middleware/circuitBreaker');

const app = express();
const PORT = process.env.PORT || 8080;

// Configuración de Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AgendaApp API Gateway',
      version: '1.0.0',
      description: 'API Gateway para orquestar microservicios de AgendaApp',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Servidor de desarrollo',
      },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Middleware de seguridad
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
}));

// Middleware de logging
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

// Middleware de compresión
app.use(compression());

// Rate limiting global
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 1000, // máximo 1000 requests por ventana
  message: {
    error: 'Demasiadas solicitudes desde esta IP, intenta de nuevo más tarde.'
  }
});
app.use(globalLimiter);

// Middleware para parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware de logging de requests
app.use(requestLogger);

// Configuración de servicios
const services = {
  events: {
    url: process.env.EVENTS_SERVICE_URL || 'http://localhost:3001',
    timeout: 5000,
    retries: 3
  },
  tasks: {
    url: process.env.TASKS_SERVICE_URL || 'http://localhost:3002',
    timeout: 5000,
    retries: 3
  },
  profile: {
    url: process.env.PROFILE_SERVICE_URL || 'http://localhost:3003',
    timeout: 5000,
    retries: 3
  },
  settings: {
    url: process.env.SETTINGS_SERVICE_URL || 'http://localhost:3004',
    timeout: 5000,
    retries: 3
  }
};

// Middleware de autenticación para rutas protegidas
app.use('/api/events', authMiddleware);
app.use('/api/tasks', authMiddleware);
app.use('/api/profile', authMiddleware);
app.use('/api/settings', authMiddleware);

// Proxy para Events Service
app.use('/api/events', circuitBreaker(services.events), createProxyMiddleware({
  target: services.events.url,
  changeOrigin: true,
  timeout: services.events.timeout,
  onError: (err, req, res) => {
    logger.error('Error en Events Service:', err);
    res.status(503).json({
      error: 'Events Service no disponible',
      message: 'El servicio de eventos está temporalmente fuera de línea'
    });
  },
  onProxyReq: (proxyReq, req, res) => {
    logger.info(`Proxy request a Events Service: ${req.method} ${req.url}`);
  }
}));

// Proxy para Tasks Service
app.use('/api/tasks', circuitBreaker(services.tasks), createProxyMiddleware({
  target: services.tasks.url,
  changeOrigin: true,
  timeout: services.tasks.timeout,
  onError: (err, req, res) => {
    logger.error('Error en Tasks Service:', err);
    res.status(503).json({
      error: 'Tasks Service no disponible',
      message: 'El servicio de tareas está temporalmente fuera de línea'
    });
  }
}));

// Proxy para Profile Service
app.use('/api/profile', circuitBreaker(services.profile), createProxyMiddleware({
  target: services.profile.url,
  changeOrigin: true,
  timeout: services.profile.timeout,
  onError: (err, req, res) => {
    logger.error('Error en Profile Service:', err);
    res.status(503).json({
      error: 'Profile Service no disponible',
      message: 'El servicio de perfil está temporalmente fuera de línea'
    });
  }
}));

// Proxy para Settings Service
app.use('/api/settings', circuitBreaker(services.settings), createProxyMiddleware({
  target: services.settings.url,
  changeOrigin: true,
  timeout: services.settings.timeout,
  onError: (err, req, res) => {
    logger.error('Error en Settings Service:', err);
    res.status(503).json({
      error: 'Settings Service no disponible',
      message: 'El servicio de configuración está temporalmente fuera de línea'
    });
  }
}));

// Ruta de documentación API
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Ruta de salud del gateway
app.get('/health', (req, res) => {
  res.json({
    service: 'API Gateway',
    version: '1.0.0',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    services: Object.keys(services).reduce((acc, service) => {
      acc[service] = {
        url: services[service].url,
        status: 'configured'
      };
      return acc;
    }, {})
  });
});

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    service: 'AgendaApp API Gateway',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString(),
    endpoints: {
      events: '/api/events',
      tasks: '/api/tasks',
      profile: '/api/profile',
      settings: '/api/settings',
      health: '/health',
      docs: '/api-docs'
    },
    services: Object.keys(services)
  });
});

// Middleware de manejo de errores
app.use(errorHandler);

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    message: `La ruta ${req.originalUrl} no existe en este gateway`,
    timestamp: new Date().toISOString()
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  logger.info(`API Gateway ejecutándose en puerto ${PORT}`);
  logger.info(`Entorno: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`Servicios configurados: ${Object.keys(services).join(', ')}`);
  logger.info(`Documentación disponible en: http://localhost:${PORT}/api-docs`);
});

// Manejo de errores no capturados
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

module.exports = app;
