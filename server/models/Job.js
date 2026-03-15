const pool = require('../config/database')

class Job {
  static async create(fileId) {
    const query = `
      INSERT INTO jobs (file_id, status, progress, created_at)
      VALUES ($1, 'pending', 0, NOW())
      RETURNING *
    `
    const result = await pool.query(query, [fileId])
    return result.rows[0]
  }

  static async findById(id) {
    const query = 'SELECT * FROM jobs WHERE id = $1'
    const result = await pool.query(query, [id])
    return result.rows[0]
  }

  static async updateStatus(id, status, progress = null) {
    const query = progress !== null
      ? 'UPDATE jobs SET status = $1, progress = $2 WHERE id = $3 RETURNING *'
      : 'UPDATE jobs SET status = $1 WHERE id = $2 RETURNING *'
    
    const params = progress !== null ? [status, progress, id] : [status, id]
    const result = await pool.query(query, params)
    return result.rows[0]
  }

  static async findByFileId(fileId) {
    const query = 'SELECT * FROM jobs WHERE file_id = $1 ORDER BY created_at DESC'
    const result = await pool.query(query, [fileId])
    return result.rows
  }
}

module.exports = Job
