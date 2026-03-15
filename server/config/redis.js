const { Redis } = require('ioredis')

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000)
    return delay
  },
  maxRetriesPerRequest: null, // Required for BullMQ blocking commands
})

redis.on('error', (err) => {
  console.error('Redis connection error:', err)
})

redis.on('connect', () => {
  console.log('Redis connected successfully')
})

module.exports = redis
