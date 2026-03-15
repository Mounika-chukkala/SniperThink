const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid')
const router = express.Router()
const User = require('../models/User')
const File = require('../models/File')
const Job = require('../models/Job')
const fileProcessingQueue = require('../config/queue')

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = process.env.UPLOAD_DIR || './uploads'
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`
    cb(null, uniqueName)
  }
})

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.pdf', '.txt']
  const ext = path.extname(file.originalname).toLowerCase()
  
  if (allowedTypes.includes(ext)) {
    cb(null, true)
  } else {
    cb(new Error('Only PDF and TXT files are allowed'), false)
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
})

router.post('/upload', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      })
    }

    // Get or create user (for demo, using a default user)
    // In production, you'd get this from authentication
    const defaultEmail = req.body.email || 'demo@example.com'
    const defaultName = req.body.name || 'Demo User'
    const user = await User.create(defaultName, defaultEmail)

    // Create file record
    const fileRecord = await File.create(user.id, req.file.path)

    // Create job
    const job = await Job.create(fileRecord.id)

    // Add job to queue (BullMQ requires jobId to be a string, not integer)
    // Use a string prefix to ensure it's treated as a string
    const bullJobId = `job-${job.id}`
    
    await fileProcessingQueue.add('process-file', {
      jobId: job.id, // Integer for database queries (stored in job data)
      fileId: fileRecord.id,
      filePath: req.file.path
    }, {
      jobId: bullJobId // String for BullMQ (must not be numeric)
    })

    res.json({
      success: true,
      jobId: job.id.toString(),
      message: 'File uploaded successfully'
    })
  } catch (error) {
    // Clean up uploaded file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path)
    }
    next(error)
  }
})

module.exports = router
