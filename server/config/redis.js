const { Redis } = require('ioredis')

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  // password: process.env.REDIS_PASSWORD,
  retryStrategy: (times) => Math.min(times * 50, 2000),
  maxRetriesPerRequest: null,
  enableReadyCheck: true,
  enableOfflineQueue: false,
})

redis.on('error', (err) => console.error('Redis error:', err))
redis.on('connect', () => console.log('Redis connected'))
redis.on('ready', () => console.log('Redis ready'))

module.exports = redis
