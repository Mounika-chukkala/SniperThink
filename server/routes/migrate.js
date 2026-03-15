const express = require('express')
const router = express.Router()
const fs = require('fs')
const path = require('path')
const pool = require('../config/database')

router.post('/migrate', async (req, res) => {
  try {
    const migrationSecret = process.env.MIGRATION_SECRET
    if (migrationSecret && req.body.secret !== migrationSecret) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      })
    }

    const schemaPath = path.join(__dirname, '../database/schema.sql')
    const schema = fs.readFileSync(schemaPath, 'utf-8')
    await pool.query(schema)
    
    res.json({
      success: true,
      message: 'Database migrations completed successfully!'
    })
  } catch (error) {
    console.error('Migration failed:', error)
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

router.get('/migrate/status', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'files', 'jobs', 'results')
    `)
    
    const existingTables = result.rows.map(row => row.table_name)
    const requiredTables = ['users', 'files', 'jobs', 'results']
    const missingTables = requiredTables.filter(table => !existingTables.includes(table))
    
    res.json({
      success: true,
      tablesExist: existingTables,
      missingTables,
      isMigrated: missingTables.length === 0
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

module.exports = router
