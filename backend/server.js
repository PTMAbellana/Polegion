const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const { swaggerSpec, swaggerServe, swaggerSetup } = require('./config/swagger')
require('dotenv').config()

const {
    authRoutes, 
    userRoutes, 
    castleRoutes,
    chapterQuizRoutes,
    chapterRoutes,
    minigameRoutes,
    userCastleProgressRoutes,
    userChapterProgressRoutes,
    userMinigameAttemptRoutes,
    userQuizAttemptRoutes,
    assessmentRoutes,
    adaptiveLearningRoutes,
    masteryProgressionRoutes, // NEW: Mastery progression routes
    sessionAnalyticsRoutes, // NEW: Session analytics routes
    adaptiveLearningAnalyticsRoutes // NEW: Adaptive learning analytics routes
} = require('./container')

// Import middleware
const { sessionTracking, trackQuestionAttempt } = require('./presentation/middleware/sessionTracking');

const app = express()
const PORT = process.env.PORT || 5000

// Trust proxy - REQUIRED for Railway/Vercel deployments
// Allows Express to correctly identify client IP from X-Forwarded-For header
app.set('trust proxy', 1);

//middleware
// CORS configuration for production
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    process.env.FRONTEND_URL,
];

// Allow all Vercel and Railway preview/production domains
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, Postman, curl, etc)
        if (!origin) return callback(null, true);
        
        // Check if origin is in allowed list or matches deployment patterns
        if (allowedOrigins.indexOf(origin) !== -1 || 
            origin.endsWith('.vercel.app') || 
            origin.endsWith('.railway.app')) {
            callback(null, true);
        } else {
            console.warn('⚠️ CORS blocked origin:', origin);
            callback(null, true); // Allow in development, can be changed to block in production
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type', 
        'Authorization', 
        'X-Requested-With',
        'cache-control',      // For axios-cache-interceptor
        'x-requested-with',   // Common header
        'accept',             // Common header
        'origin'              // Common header
    ],
    exposedHeaders: ['Content-Length', 'X-Request-Id'],
    maxAge: 86400, // 24 hours
};

app.use(cors(corsOptions))

// Security headers
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
    frameguard: {
        action: 'deny'
    },
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    }
}));

// Rate limiting configuration
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // Increased to 200 requests per IP for 50+ concurrent users
    message: 'Too many requests from this IP, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
});

// More permissive rate limit for authentication endpoints (signups/logins)
// Increased for classroom testing with 50+ concurrent users
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 500, // 500 auth attempts per IP (supports 50+ concurrent signups/logins)
    message: 'Too many authentication attempts, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => process.env.NODE_ENV === 'development' // Skip in development
});

// Apply general rate limiting to all API routes
app.use('/api/', apiLimiter);

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

// ✅ FIX: Add request timeout to prevent hanging connections
app.use((req, res, next) => {
    req.setTimeout(30000); // 30 second timeout
    res.setTimeout(30000);
    next();
});

// Session tracking middleware (tracks user activity automatically)
app.use(sessionTracking);

// Health check endpoint (prevents cold starts and verifies server status)
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Keep server warm in production (ping health check every 5 minutes)
if (process.env.NODE_ENV === 'production' && process.env.BACKEND_URL) {
    setInterval(() => {
        fetch(`${process.env.BACKEND_URL}/health`)
            .then(res => console.log('✅ Health check successful'))
            .catch(err => console.error('❌ Health check failed:', err.message));
    }, 5 * 60 * 1000); // 5 minutes
}

//routes
app.use('/api/auth', authLimiter, authRoutes) // Apply auth rate limiter to auth routes
app.use('/api/users', userRoutes)
app.use('/api/castles', castleRoutes)
app.use('/api/chapter-quizzes', chapterQuizRoutes)
app.use('/api/chapters', chapterRoutes)
app.use('/api/minigames', minigameRoutes)
app.use('/api/user-castle-progress', userCastleProgressRoutes)
app.use('/api/user-chapter-progress', userChapterProgressRoutes)
app.use('/api/user-minigame-attempts', userMinigameAttemptRoutes)
app.use('/api/user-quiz-attempts', userQuizAttemptRoutes)
app.use('/api/assessments', assessmentRoutes)
app.use('/api/adaptive', trackQuestionAttempt, adaptiveLearningRoutes) // Track questions in adaptive learning
app.use('/api/mastery', masteryProgressionRoutes) // NEW: Mastery progression API
app.use('/api/analytics', sessionAnalyticsRoutes) // NEW: Session analytics API
app.use('/api/adaptive-analytics', adaptiveLearningAnalyticsRoutes) // NEW: Adaptive learning analytics API
//swagger documentation
app.use('/api-docs', swaggerServe, swaggerSetup)

//docs.json for postman integration
app.get('/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(swaggerSpec)
})

//basic route
app.get('/', (req, res) => {
    res.json({
        message: 'Polegion API is running',
        documentation: `http://localhost:${PORT}/api-docs`,
        openapi: `http://localhost:${PORT}/docs.json`
    })
})

//start server
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server')
    server.close(() => {
        console.log('HTTP server closed')
        process.exit(0)
    })
})

// Handle uncaught errors
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error)
    process.exit(1)
})

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason)
    process.exit(1)
})

module.exports = app