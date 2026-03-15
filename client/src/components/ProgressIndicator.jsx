import React from 'react'
import { motion } from 'framer-motion'
import './ProgressIndicator.css'

const ProgressIndicator = ({ steps, activeStep, scrollProgress, onStepClick }) => {
  return (
    <div className="progress-indicator-container">
      <div className="progress-line">
        <motion.div
          className="progress-fill"
          initial={{ width: '0%' }}
          animate={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
      
      <div className="progress-steps">
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            className={`progress-step ${activeStep >= index ? 'active' : ''}`}
            onClick={() => onStepClick(index)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            animate={{
              scale: activeStep === index ? 1.2 : 1,
              backgroundColor: activeStep >= index ? step.color : '#333'
            }}
            transition={{ duration: 0.3 }}
          >
            <span className="step-number">{index + 1}</span>
            <motion.span
              className="step-label"
              initial={{ opacity: 0, y: 10 }}
              animate={{ 
                opacity: activeStep === index ? 1 : 0.5,
                y: activeStep === index ? 0 : 10
              }}
            >
              {step.title}
            </motion.span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default ProgressIndicator
