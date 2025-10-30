const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const { swaggerSpec, swaggerServe, swaggerSetup } = require('./config/swagger')
require('dotenv').config()

const {
    authRoutes, 
    userRoutes, 
    roomRoutes,
    participantRoutes, 
    problemRoutes,
    leaderboardRoutes,
    attemptsRoutes,
    competitionRoutes,
    castleRoutes,          // Newly Added
    chapterQuizRoutes,     // Newly Added
    chapterRoutes,         // Newly Added
    minigameRoutes,       // Newly Added
    userCastleProgressRoutes, // Newly Added
    userChapterProgressRoutes, // Newly Added
    userMinigameAttemptRoutes, // Newly Added
    userQuizAttemptRoutes      // Newly Added
} = require('./container')

const app = express()
const PORT = process.env.PORT || 5000

//middleware
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

//routes
app.use('/api/auth', authRoutes)
app.use('/api/rooms', roomRoutes)
app.use('/api/users', userRoutes)
app.use('/api/participants', participantRoutes)
app.use('/api/problems', problemRoutes)
app.use('/api/leaderboards', leaderboardRoutes)
app.use('/api/attempts', attemptsRoutes)
app.use('/api/competitions', competitionRoutes)
app.use('/api/castles', castleRoutes)                     // Newly Added
app.use('/api/chapter-quizzes', chapterQuizRoutes)        // Newly Added
app.use('/api/chapters', chapterRoutes)                   // Newly Added
app.use('/api/minigames', minigameRoutes)                 // Newly Added
app.use('/api/user-castle-progress', userCastleProgressRoutes) // Newly Added
app.use('/api/user-chapter-progress', userChapterProgressRoutes) // Newly Added
app.use('/api/user-minigame-attempts', userMinigameAttemptRoutes) // Newly Added
app.use('/api/user-quiz-attempts', userQuizAttemptRoutes)       // Newly Added
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