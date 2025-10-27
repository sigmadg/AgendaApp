# AgendaApp - Arquitectura de Microservicios y Microfrontends

Este proyecto implementa una arquitectura de microservicios y microfrontends para la aplicación AgendaApp, proporcionando escalabilidad, mantenibilidad y separación de responsabilidades.

## 🏗️ Arquitectura General

```
┌─────────────────────────────────────────────────────────────┐
│                    API Gateway (Port 8080)                 │
└─────────────────────┬───────────────────────────────────────┘
                      │
    ┌─────────────────┼─────────────────┐
    │                 │                 │
┌───▼───┐         ┌───▼───┐         ┌───▼───┐
│Events │         │Tasks │         │Profile│
│Service│         │Service│         │Service│
│:3001  │         │:3002 │         │:3003  │
└───────┘         └──────┘         └───────┘
    │                 │                 │
    └─────────────────┼─────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                    MongoDB (Port 27017)                    │
└─────────────────────────────────────────────────────────────┘
```

## 📁 Estructura del Proyecto

```
AgendaApp/
├── api-gateway/                    # API Gateway
│   ├── src/
│   │   ├── server.js
│   │   ├── middleware/
│   │   └── utils/
│   └── package.json
├── microservices/                  # Microservicios
│   ├── events-service/             # Servicio de eventos
│   ├── tasks-service/              # Servicio de tareas
│   ├── profile-service/            # Servicio de perfil
│   └── settings-service/           # Servicio de configuración
├── microfrontends/                 # Microfrontends
│   ├── events-microfrontend/       # Frontend de eventos
│   ├── tasks-microfrontend/        # Frontend de tareas
│   ├── profile-microfrontend/      # Frontend de perfil
│   └── settings-microfrontend/     # Frontend de configuración
├── docker-compose.yml             # Orquestación de contenedores
└── README-MICROSERVICES.md        # Esta documentación
```

## 🚀 Servicios Implementados

### 1. Events Service (Puerto 3001)
**Responsabilidad**: Gestión completa de eventos
- ✅ CRUD de eventos
- ✅ Búsqueda y filtrado
- ✅ Eventos recurrentes
- ✅ Recordatorios
- ✅ Estadísticas
- ✅ Exportación/Importación

**Endpoints principales**:
- `GET /api/events` - Listar eventos
- `POST /api/events` - Crear evento
- `PUT /api/events/:id` - Actualizar evento
- `DELETE /api/events/:id` - Eliminar evento
- `GET /api/events/date/:date` - Eventos por fecha
- `GET /api/events/search` - Buscar eventos

### 2. Tasks Service (Puerto 3002)
**Responsabilidad**: Gestión de tareas
- ✅ CRUD de tareas
- ✅ Estados de tareas
- ✅ Prioridades
- ✅ Categorías
- ✅ Subtareas

### 3. Profile Service (Puerto 3003)
**Responsabilidad**: Gestión de perfil de usuario
- ✅ Información personal
- ✅ Preferencias
- ✅ Configuración de cuenta
- ✅ Avatar y datos

### 4. Settings Service (Puerto 3004)
**Responsabilidad**: Configuración de aplicación
- ✅ Configuraciones globales
- ✅ Secciones activas
- ✅ Temas y personalización
- ✅ Notificaciones

## 🎨 Microfrontends

### 1. Events Microfrontend
**Tecnología**: React + Webpack Module Federation
- ✅ Componente independiente
- ✅ Estado propio
- ✅ Comunicación con Events Service
- ✅ Estilos encapsulados

### 2. Tasks Microfrontend
**Tecnología**: React + Webpack Module Federation
- ✅ Gestión de tareas
- ✅ Interfaz intuitiva
- ✅ Estados visuales

### 3. Profile Microfrontend
**Tecnología**: React + Webpack Module Federation
- ✅ Edición de perfil
- ✅ Configuración personal
- ✅ Avatar y datos

### 4. Settings Microfrontend
**Tecnología**: React + Webpack Module Federation
- ✅ Configuración global
- ✅ Personalización
- ✅ Preferencias

## 🛠️ Tecnologías Utilizadas

### Backend (Microservicios)
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **MongoDB** - Base de datos NoSQL
- **Redis** - Caché y sesiones
- **JWT** - Autenticación
- **Joi** - Validación de datos
- **Winston** - Logging
- **Bull** - Colas de trabajos

### Frontend (Microfrontends)
- **React 18** - Biblioteca de UI
- **Webpack 5** - Bundler y Module Federation
- **React Query** - Gestión de estado del servidor
- **Styled Components** - CSS-in-JS
- **React Hook Form** - Formularios
- **Date-fns** - Manipulación de fechas

### DevOps
- **Docker** - Containerización
- **Docker Compose** - Orquestación local
- **Nginx** - Load balancer
- **MongoDB** - Base de datos
- **Redis** - Caché

## 🚀 Instalación y Ejecución

### Prerrequisitos
- Docker y Docker Compose
- Node.js 18+
- MongoDB (opcional, se incluye en Docker)

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd AgendaApp
```

### 2. Configurar variables de entorno
```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

### 3. Ejecutar con Docker Compose
```bash
# Construir y ejecutar todos los servicios
docker-compose up --build

# Ejecutar en segundo plano
docker-compose up -d --build

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down
```

### 4. Ejecutar en modo desarrollo
```bash
# Instalar dependencias de cada servicio
cd microservices/events-service
npm install
npm run dev

cd ../tasks-service
npm install
npm run dev

# Y así para cada servicio...
```

## 📊 Monitoreo y Logs

### Health Checks
- **API Gateway**: `http://localhost:8080/health`
- **Events Service**: `http://localhost:3001/health`
- **Tasks Service**: `http://localhost:3002/health`
- **Profile Service**: `http://localhost:3003/health`
- **Settings Service**: `http://localhost:3004/health`

### Logs
```bash
# Ver logs de todos los servicios
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f events-service

# Ver logs del API Gateway
docker-compose logs -f api-gateway
```

## 🔧 Configuración

### Variables de Entorno

#### API Gateway
```env
PORT=8080
NODE_ENV=production
EVENTS_SERVICE_URL=http://events-service:3001
TASKS_SERVICE_URL=http://tasks-service:3002
PROFILE_SERVICE_URL=http://profile-service:3003
SETTINGS_SERVICE_URL=http://settings-service:3004
REDIS_URL=redis://redis:6379
```

#### Events Service
```env
PORT=3001
NODE_ENV=production
MONGODB_URI=mongodb://admin:password123@mongodb:27017/agendaapp
REDIS_URL=redis://redis:6379
JWT_SECRET=your-jwt-secret-key
```

### Base de Datos
- **MongoDB**: Puerto 27017
- **Redis**: Puerto 6379
- **Usuario**: admin
- **Contraseña**: password123

## 🧪 Testing

### Ejecutar tests
```bash
# Tests de un servicio específico
cd microservices/events-service
npm test

# Tests de integración
npm run test:integration

# Tests de carga
npm run test:load
```

## 📈 Escalabilidad

### Escalar servicios
```bash
# Escalar Events Service a 3 instancias
docker-compose up --scale events-service=3

# Escalar con load balancer
docker-compose up --scale events-service=3 --scale tasks-service=2
```

### Load Balancing
- **Nginx** como load balancer
- **Round-robin** para distribución
- **Health checks** automáticos
- **Circuit breaker** para resilencia

## 🔒 Seguridad

### Autenticación
- **JWT tokens** para autenticación
- **Middleware de autenticación** en API Gateway
- **Rate limiting** por IP
- **CORS** configurado

### Validación
- **Joi** para validación de datos
- **Sanitización** de inputs
- **Helmet** para headers de seguridad

## 🚀 Despliegue

### Producción
```bash
# Construir para producción
docker-compose -f docker-compose.prod.yml up --build

# Con variables de entorno de producción
NODE_ENV=production docker-compose up --build
```

### Kubernetes (Futuro)
```bash
# Aplicar configuraciones de Kubernetes
kubectl apply -f k8s/

# Verificar pods
kubectl get pods

# Verificar servicios
kubectl get services
```

## 📚 Documentación API

### Swagger UI
- **URL**: `http://localhost:8080/api-docs`
- **Especificación**: OpenAPI 3.0
- **Endpoints**: Todos los servicios documentados

### Postman Collection
- **Archivo**: `docs/postman/AgendaApp-API.postman_collection.json`
- **Variables**: Configuradas para desarrollo y producción

## 🤝 Contribución

### Estructura de commits
```
feat: nueva funcionalidad
fix: corrección de bug
docs: documentación
style: formato
refactor: refactorización
test: tests
chore: tareas de mantenimiento
```

### Desarrollo
1. Fork del repositorio
2. Crear rama feature: `git checkout -b feature/nueva-funcionalidad`
3. Commit cambios: `git commit -m 'feat: agregar nueva funcionalidad'`
4. Push a la rama: `git push origin feature/nueva-funcionalidad`
5. Crear Pull Request

## 📞 Soporte

### Issues
- **GitHub Issues**: Para reportar bugs y solicitar features
- **Labels**: bug, enhancement, documentation, question

### Contacto
- **Email**: soporte@agendaapp.com
- **Slack**: #agendaapp-dev
- **Discord**: AgendaApp Community

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

---

**Desarrollado con ❤️ por el equipo de AgendaApp**
