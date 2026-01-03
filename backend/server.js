const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
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
    adaptiveLearningRoutes
} = require('./container')

const app = express()
const PORT = process.env.PORT || 5000

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
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

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
app.use('/api/auth', authRoutes)
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
app.use('/api/adaptive', adaptiveLearningRoutes)
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
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

module.exports = app