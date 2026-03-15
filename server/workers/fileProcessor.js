require('dotenv').config()
const { Worker } = require('bullmq')
const redis = require('../config/redis')
const Job = require('../models/Job')
const Result = require('../models/Result')
const FileProcessor = require('../services/fileProcessor')
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
    const jobIdInt = typeof jobId === 'number' ? jobId : parseInt(jobId, 10)

    try {
      await Job.updateStatus(jobIdInt, 'processing', 0)

      const progressCallback = async (progress) => {
        await Job.updateStatus(jobIdInt, 'processing', progress)
      }

      const result = await FileProcessor.processFile(filePath, progressCallback)
      await Result.create(jobIdInt, result.wordCount, result.paragraphCount, result.keywords)
      await Job.updateStatus(jobIdInt, 'completed', 100)

      return result
    } catch (error) {
      console.error(`Job ${jobIdInt} failed:`, error)
      await Job.updateStatus(jobIdInt, 'failed', null)
      throw error
    }
  },
  {
    connection: redis,
    concurrency: 5,
    limiter: {
      max: 10,
      duration: 1000,
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
