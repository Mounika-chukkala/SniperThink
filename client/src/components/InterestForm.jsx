import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import './InterestForm.css'

const InterestForm = ({ steps, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    selectedStep: steps[0]?.id || ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await axios.post('/api/interest', formData)
      
      if (response.data.success) {
        setSuccess(true)
        setTimeout(() => {
          onClose()
          setSuccess(false)
          setFormData({ name: '', email: '', selectedStep: steps[0]?.id || '' })
        }, 2000)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        className="form-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="form-container"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button className="close-button" onClick={onClose}>×</button>
          
          {success ? (
            <motion.div
              className="success-message"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              <div className="success-icon">✓</div>
              <h3>Thank You!</h3>
              <p>We'll be in touch soon.</p>
            </motion.div>
          ) : (
            <>
              <h2>Get Started</h2>
              <p className="form-subtitle">Tell us which step interests you most</p>
              
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Your name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="your.email@example.com"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="selectedStep">Select Step</label>
                  <select
                    id="selectedStep"
                    name="selectedStep"
                    value={formData.selectedStep}
                    onChange={handleChange}
                    required
                  >
                    {steps.map(step => (
                      <option key={step.id} value={step.id}>
                        {step.title}
                      </option>
                    ))}
                  </select>
                </div>

                {error && (
                  <motion.div
                    className="error-message"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {error}
                  </motion.div>
                )}

                <motion.button
                  type="submit"
                  className="submit-button"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? (
                    <span className="loading-spinner">Processing...</span>
                  ) : (
                    'Submit'
                  )}
                </motion.button>
              </form>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default InterestForm
