const express = require('express')
const router = express.Router()
const Job = require('../models/Job')
const Result = require('../models/Result')

// Get job status
router.get('/:jobId/status', async (req, res, next) => {
  try {
    const { jobId } = req.params

    const job = await Job.findById(jobId)

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      })
    }

    res.json({
      success: true,
      jobId: job.id.toString(),
      status: job.status,
      progress: job.progress || 0
    })
  } catch (error) {
    next(error)
  }
})

// Get job result
router.get('/:jobId/result', async (req, res, next) => {
  try {
    const { jobId } = req.params

    const job = await Job.findById(jobId)

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      })
    }

    if (job.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: `Job is ${job.status}. Results are only available for completed jobs.`
      })
    }

    const result = await Result.findByJobId(jobId)

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Result not found'
      })
    }

    res.json({
      success: true,
      jobId: job.id.toString(),
      wordCount: result.word_count,
      paragraphCount: result.paragraph_count,
      topKeywords: Array.isArray(result.keywords) ? result.keywords : JSON.parse(result.keywords || '[]')
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router
