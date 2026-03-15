const express = require('express')
const router = express.Router()
const User = require('../models/User')

router.post('/', async (req, res, next) => {
  try {
    const { name, email, selectedStep } = req.body

    if (!name || !email || !selectedStep) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and selectedStep are required'
      })
    }

    // Create or update user
    await User.create(name, email)

    // In a real application, you might want to store the interest submission
    // For now, we'll just return success

    res.json({
      success: true,
      message: 'Thank you for your interest!'
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router
