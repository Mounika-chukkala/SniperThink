require('dotenv').config()
const express = require('express')
const cors = require('cors')
const fs = require('fs')
const interestRoutes = require('./routes/interest')
const fileRoutes = require('./routes/files')
const jobRoutes = require('./routes/jobs')
const migrateRoutes = require('./routes/migrate')

const app = express()
const PORT = process.env.PORT || 5000
const uploadDir = process.env.UPLOAD_DIR || './uploads'

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/interest', interestRoutes)
app.use('/api/files', fileRoutes)
app.use('/api/jobs', jobRoutes)
app.use('/api', migrateRoutes)

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

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
