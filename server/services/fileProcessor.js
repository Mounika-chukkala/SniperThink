const fs = require('fs')
const path = require('path')
const pdfParse = require('pdf-parse')

class FileProcessor {
  static async extractText(filePath) {
    const ext = path.extname(filePath).toLowerCase()
    
    if (ext === '.pdf') {
      const dataBuffer = fs.readFileSync(filePath)
      const data = await pdfParse(dataBuffer)
      return data.text
    } else if (ext === '.txt') {
      return fs.readFileSync(filePath, 'utf-8')
    } else {
      throw new Error('Unsupported file type')
    }
  }

  static countWords(text) {
    if (!text || text.trim().length === 0) return 0
    return text.trim().split(/\s+/).filter(word => word.length > 0).length
  }

  static countParagraphs(text) {
    if (!text || text.trim().length === 0) return 0
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0)
    return paragraphs.length || 1 // At least one paragraph if there's any text
  }

  static extractKeywords(text, topN = 10) {
    if (!text || text.trim().length === 0) return []

    // Remove common stop words
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
      'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
      'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
      'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that',
      'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'what',
      'which', 'who', 'when', 'where', 'why', 'how', 'all', 'each', 'every',
      'both', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor',
      'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 'just',
      'now', 'then', 'here', 'there', 'when', 'where', 'why', 'how'
    ])

    // Extract words, convert to lowercase, remove punctuation
    const words = text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3 && !stopWords.has(word))

    // Count word frequencies
    const wordFreq = {}
    words.forEach(word => {
      wordFreq[word] = (wordFreq[word] || 0) + 1
    })

    // Sort by frequency and get top N
    const sortedWords = Object.entries(wordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, topN)
      .map(([word]) => word)

    return sortedWords
  }

  static async processFile(filePath, progressCallback) {
    try {
      // Extract text
      progressCallback(20)
      const text = await this.extractText(filePath)

      // Count words
      progressCallback(40)
      const wordCount = this.countWords(text)

      // Count paragraphs
      progressCallback(60)
      const paragraphCount = this.countParagraphs(text)

      // Extract keywords
      progressCallback(80)
      const keywords = this.extractKeywords(text, 10)

      progressCallback(100)

      return {
        wordCount,
        paragraphCount,
        keywords
      }
    } catch (error) {
      throw new Error(`File processing failed: ${error.message}`)
    }
  }
}

module.exports = FileProcessor
