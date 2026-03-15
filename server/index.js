require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')
const fs = require('fs')

// Import routes
const interestRoutes = require('./routes/interest')
const fileRoutes = require('./routes/files')
const jobRoutes = require('./routes/jobs')

const app = express()
const PORT = process.env.PORT || 5000

// Ensure uploads directory exists
const uploadDir = process.env.UPLOAD_DIR || './uploads'
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/interest', interestRoutes)
app.use('/api/files', fileRoutes)
app.use('/api/jobs', jobRoutes)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err)
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
