require('dotenv').config()
const { Pool } = require('pg')

async function createDatabase() {
  // Connect to postgres database to create our database
  const adminPool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    database: 'postgres',
    user: process.env.DB_USER || 'postgres',
    password: String(process.env.DB_PASSWORD || ''),
  })

  try {
    const dbName = process.env.DB_NAME || 'sniperthink'
    
    // Check if database exists
    const result = await adminPool.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [dbName]
    )

    if (result.rows.length === 0) {
      console.log(`Creating database "${dbName}"...`)
      await adminPool.query(`CREATE DATABASE ${dbName}`)
      console.log(`Database "${dbName}" created successfully!`)
    } else {
      console.log(`Database "${dbName}" already exists.`)
    }

    await adminPool.end()
    process.exit(0)
  } catch (error) {
    console.error('Error creating database:', error.message)
    await adminPool.end()
    process.exit(1)
  }
}

createDatabase()
