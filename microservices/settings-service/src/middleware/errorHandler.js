const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log del error
  console.error('Error:', err);

  // Error de validación de Mongoose
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = {
      message,
      statusCode: 400,
    };
  }

  // Error de duplicado de Mongoose
  if (err.code === 11000) {
    const message = 'Configuración duplicada';
    error = {
      message,
      statusCode: 400,
    };
  }

  // Error de cast de Mongoose
  if (err.name === 'CastError') {
    const message = 'ID inválido';
    error = {
      message,
      statusCode: 400,
    };
  }

  // Error de JWT
  if (err.name === 'JsonWebTokenError') {
    const message = 'Token inválido';
    error = {
      message,
      statusCode: 401,
    };
  }

  // Error de expiración de JWT
  if (err.name === 'TokenExpiredError') {
    const message = 'Token expirado';
    error = {
      message,
      statusCode: 401,
    };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = { errorHandler };
