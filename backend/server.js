const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 5000

//import routes
const authRoutes = require('./routes/auth')
const roomRoutes = require('./routes/rooms')      //later nani
const userRoutes = require('./routes/users')

//middleware
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))
// app.use(express.json())
// app.use(express.urlencoded({
//     extended: true
// }))

//routes
app.use('/api/auth', authRoutes)
app.use('/api/rooms', roomRoutes)
app.use('/api/users', userRoutes)

//basic route
app.get('/', (req, res) => {
    res.send('API is running')
})

//start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})