const fs = require('fs')
const path = require('path')

const uploadDir = process.env.UPLOAD_DIR || './uploads'

if (fs.existsSync(uploadDir)) {
  const files = fs.readdirSync(uploadDir)
  let deletedCount = 0
  
  files.forEach(file => {
    const filePath = path.join(uploadDir, file)
    try {
      fs.unlinkSync(filePath)
      deletedCount++
      console.log(`Deleted: ${file}`)
    } catch (error) {
      console.error(`Error deleting ${file}:`, error.message)
    }
  })
  
  console.log(`\nCleanup complete: ${deletedCount} file(s) deleted`)
} else {
  console.log('Uploads directory does not exist')
}
