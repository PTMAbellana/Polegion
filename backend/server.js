require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');

// Import configurations
const prisma = require('./config/prisma');
const cacheService = require('./config/cache');
const swaggerSpecs = require('./config/swagger');

// Import container for dependency injection
const container = require('./container');

const app = express();
const PORT = process.env.PORT || 5000;

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware
app.use(limiter);
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Swagger documentation
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Polegion API Documentation'
}));

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    
    // Get cache health
    const cacheHealth = cacheService.getHealth();
    
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: {
        database: 'connected',
        cache: cacheHealth
      }
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      message: 'Service unavailable',
      error: error.message
    });
  }
});

// API routes - Mount all routes without version prefix as requested
app.use('/auth', container.authRoutes.getRouter());
app.use('/users', container.userRoutes.getRouter());
app.use('/rooms', container.roomRoutes.getRouter());
app.use('/problems', container.problemRoutes.getRouter());
app.use('/participants', container.participantRoutes.getRouter());
app.use('/leaderboard', container.leaderboardRoutes.getRouter());
app.use('/attempts', container.attemptsRoutes.getRouter());
app.use('/competitions', container.competitionRoutes.getRouter());

// API documentation endpoint (returns JSON)
app.get('/api/docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpecs);
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`,
    statusCode: 404
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error:', error);
  
  res.status(error.statusCode || 500).json({
    error: error.name || 'Internal Server Error',
    message: error.message || 'Something went wrong',
    statusCode: error.statusCode || 500,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});

// Start server
async function startServer() {
  try {
    // Wait a moment for cache to initialize (if needed)
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📚 API Documentation: http://localhost:${PORT}/api/docs`);
      console.log(`📋 API JSON: http://localhost:${PORT}/api/docs.json`);
      console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
      console.log(`💾 Cache: In-Memory (${cacheService.getStats().total} items)`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();