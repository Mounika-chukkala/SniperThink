const pool = require('../config/database')

class Result {
  static async create(jobId, wordCount, paragraphCount, keywords) {
    const query = `
      INSERT INTO results (job_id, word_count, paragraph_count, keywords)
      VALUES ($1, $2, $3, $4::jsonb)
      RETURNING *
    `
    const result = await pool.query(query, [jobId, wordCount, paragraphCount, JSON.stringify(keywords)])
    return result.rows[0]
  }

  static async findByJobId(jobId) {
    const query = 'SELECT * FROM results WHERE job_id = $1'
    const result = await pool.query(query, [jobId])
    return result.rows[0]
  }

  static async findById(id) {
    const query = 'SELECT * FROM results WHERE id = $1'
    const result = await pool.query(query, [id])
    return result.rows[0]
  }
}

module.exports = Result
