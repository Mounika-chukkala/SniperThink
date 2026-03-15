const pool = require('../config/database')

class File {
  static async create(userId, filePath) {
    const query = `
      INSERT INTO files (user_id, file_path, uploaded_at)
      VALUES ($1, $2, NOW())
      RETURNING *
    `
    const result = await pool.query(query, [userId, filePath])
    return result.rows[0]
  }

  static async findById(id) {
    const query = 'SELECT * FROM files WHERE id = $1'
    const result = await pool.query(query, [id])
    return result.rows[0]
  }

  static async findByUserId(userId) {
    const query = 'SELECT * FROM files WHERE user_id = $1 ORDER BY uploaded_at DESC'
    const result = await pool.query(query, [userId])
    return result.rows
  }
}

module.exports = File
