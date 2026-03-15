const { Redis } = require('ioredis')

// Support multiple Upstash connection methods
let redisConfig

if (process.env.REDIS_URL) {
  // Option 1: Full Redis URL (redis://default:token@endpoint:port)
  // If HTTP URL provided, convert to Redis protocol
  let redisUrl = process.env.REDIS_URL
  
  // Convert Upstash HTTP REST URL to Redis endpoint
  // https://xxx-xxx-xxx.upstash.io -> xxx-xxx-xxx.upstash.io
  if (redisUrl.startsWith('https://')) {
    const url = new URL(redisUrl)
    const endpoint = url.hostname
    const token = process.env.REDIS_TOKEN 
    
    if (token) {
      // Convert HTTP endpoint to Redis endpoint
      // Remove .upstash.io and use Redis port
      const redisEndpoint = endpoint.replace('.upstash.io', '')
      redisUrl = `redis://default:${token}@${redisEndpoint}.upstash.io:6379`
    } else {
      throw new Error('REDIS_TOKEN or UPSTASH_REDIS_REST_TOKEN required when using HTTP URL')
    }
  }
  
  redisConfig = {
    url: redisUrl,
    retryStrategy: (times) => {
      const delay = Math.min(times * 50, 2000)
      return delay
    },
    maxRetriesPerRequest: null,
    enableReadyCheck: true,
    enableOfflineQueue: false,
  }
} else if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  // Option 2: Upstash REST API URL + Token (convert to Redis protocol)
  const httpUrl = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  
  // Extract endpoint from HTTP URL
  // https://xxx-xxx-xxx.upstash.io -> xxx-xxx-xxx.upstash.io
  const url = new URL(httpUrl)
  const endpoint = url.hostname
  
  // Convert to Redis URL format
  const redisUrl = `redis://default:${token}@${endpoint}:6379`
  
  redisConfig = {
    url: redisUrl,
    retryStrategy: (times) => {
      const delay = Math.min(times * 50, 2000)
      return delay
    },
    maxRetriesPerRequest: null,
    enableReadyCheck: true,
    enableOfflineQueue: false,
  }
} else if (process.env.REDIS_HOST && process.env.REDIS_TOKEN) {
  // Option 3: Individual endpoint + token
  redisConfig = {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_TOKEN,
    tls: process.env.REDIS_PORT === '6380' || process.env.REDIS_TLS === 'true' ? {} : undefined,
    retryStrategy: (times) => {
      const delay = Math.min(times * 50, 2000)
      return delay
    },
    maxRetriesPerRequest: null,
    enableReadyCheck: true,
    enableOfflineQueue: false,
  }
} else {
  // Fallback to localhost
  redisConfig = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || undefined,
    retryStrategy: (times) => {
      const delay = Math.min(times * 50, 2000)
      return delay
    },
    maxRetriesPerRequest: null,
    enableReadyCheck: true,
    enableOfflineQueue: false,
  }
}

const redis = new Redis(redisConfig)

redis.on('error', (err) => {
  console.error('Redis connection error:', err)
})

redis.on('connect', () => {
  console.log('Redis connected successfully')
})

redis.on('ready', () => {
  console.log('Redis is ready')
})

module.exports = redis
