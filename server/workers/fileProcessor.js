// Load environment variables FIRST before importing anything that uses them
require('dotenv').config()

const { Worker } = require('bullmq')
const redis = require('../config/redis')

// Import models after dotenv is loaded
const Job = require('../models/Job')
const Result = require('../models/Result')
const FileProcessor = require('../services/fileProcessor')

// Verify database connection on startup
const pool = require('../config/database')
pool.query('SELECT 1').then(() => {
  console.log('Database connection verified in worker')
}).catch(err => {
  console.error('Database connection failed in worker:', err.message)
})

const worker = new Worker(
  'file-processing',
  async (job) => {
    const { jobId, fileId, filePath } = job.data
    // jobId from job.data is the integer from database
    // job.id is the BullMQ string ID (e.g., "job-1")
    const jobIdInt = typeof jobId === 'number' ? jobId : parseInt(jobId, 10)

    try {
      // Update job status to processing
      await Job.updateStatus(jobIdInt, 'processing', 0)

      // Process file with progress updates
      const progressCallback = async (progress) => {
        await Job.updateStatus(jobIdInt, 'processing', progress)
      }

      const result = await FileProcessor.processFile(filePath, progressCallback)

      // Save results
      await Result.create(jobIdInt, result.wordCount, result.paragraphCount, result.keywords)

      // Update job status to completed
      await Job.updateStatus(jobIdInt, 'completed', 100)

      return result
    } catch (error) {
      console.error(`Job ${jobIdInt} failed:`, error)
      
      // Update job status to failed
      await Job.updateStatus(jobIdInt, 'failed', null)

      throw error
    }
  },
  {
    connection: redis,
    concurrency: 5, // Process up to 5 jobs concurrently
    limiter: {
      max: 10,
      duration: 1000, // Max 10 jobs per second
    },
  }
)

worker.on('completed', (job) => {
  console.log(`Job ${job.id} completed successfully`)
})

worker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed:`, err.message)
})

worker.on('error', (err) => {
  console.error('Worker error:', err)
})

console.log('File processing worker started')
console.log('Concurrency:', worker.opts.concurrency)

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing worker...')
  await worker.close()
  process.exit(0)
})

process.on('SIGINT', async () => {
  console.log('SIGINT received, closing worker...')
  await worker.close()
  process.exit(0)
})
