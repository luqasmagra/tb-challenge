const express = require('express')
const cors = require('cors')
const { router: filesRoutes } = require('./routes/files.routes')
const { errorHandler } = require('./middlewares/errorHandler')

const app = express()

// Express configurations
app.disable('x-powered-by')

// Middlewares
app.use(cors())
app.use(express.json())

// Routes
app.use('/files', filesRoutes)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Error handler
app.use(errorHandler)

module.exports = { app }
