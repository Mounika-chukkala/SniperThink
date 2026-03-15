const { Queue } = require('bullmq')
const redis = require('./redis')

const fileProcessingQueue = new Queue('file-processing', {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: {
      age: 3600, // Keep completed jobs for 1 hour
      count: 1000,
    },
    removeOnFail: {
      age: 24 * 3600, // Keep failed jobs for 24 hours
    },
  },
})

module.exports = fileProcessingQueue
