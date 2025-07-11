const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()

const {
    authRoutes, 
    userRoutes, 
    roomRoutes,
    participantRoutes, 
    problemRoutes,
    leaderboardRoutes,
    attemptsRoutes,
    competitionRoutes
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
app.use('/api/competition', competitionRoutes)

//basic route
app.get('/', (req, res) => {
    res.send('API is running')
})

//start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

module.exports = app