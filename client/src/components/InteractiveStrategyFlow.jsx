import React, { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import StrategyStep from './StrategyStep'
import ProgressIndicator from './ProgressIndicator'
import InterestForm from './InterestForm'
import { strategySteps } from '../data/strategySteps'
import './InteractiveStrategyFlow.css'

const InteractiveStrategyFlow = () => {
  const [activeStep, setActiveStep] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [showForm, setShowForm] = useState(false)
  const containerRef = useRef(null)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  })

  const progress = useTransform(scrollYProgress, [0, 1], [0, 100])

  useEffect(() => {
    const unsubscribe = progress.on('change', (latest) => {
      setScrollProgress(latest)
      // Update active step based on scroll progress
      const stepIndex = Math.floor((latest / 100) * strategySteps.length)
      setActiveStep(Math.min(stepIndex, strategySteps.length - 1))
    })
    return () => unsubscribe()
  }, [progress])

  const handleStepClick = (index) => {
    setActiveStep(index)
    const stepElement = document.getElementById(`step-${index}`)
    if (stepElement) {
      // Wait for state update and DOM reflow
      setTimeout(() => {
        // Get header height to hide it when scrolling
        const header = document.querySelector('.app-header')
        const headerHeight = header ? header.offsetHeight : 0
        
        // Get the progress indicator element to calculate its actual height
        const progressIndicator = document.querySelector('.progress-indicator-container')
        const progressIndicatorHeight = progressIndicator ? progressIndicator.offsetHeight : 150
        
        // Get current scroll position and element position
        const currentScrollY = window.pageYOffset || document.documentElement.scrollTop
        const elementRect = stepElement.getBoundingClientRect()
        const elementTop = elementRect.top + currentScrollY
        
        // Reduced offset to bring cards up - less spacing below progress indicator
        const spacingOffset = 20 // Reduced from larger values
        
        // Special handling for green card (step 4 - index 3) - still needs a bit more
        const extraOffset = index === 3 ? 30 : 0
        
        // Calculate offset: header height + progress indicator height + minimal spacing
        // This positions cards higher up while still keeping them visible
        const offsetPosition = elementTop - headerHeight - progressIndicatorHeight - spacingOffset - extraOffset
        
        // Smooth scroll to position
        window.scrollTo({
          top: Math.max(0, offsetPosition),
          behavior: 'smooth'
        })
      }, 100)
    }
  }

  return (
    <div className="strategy-flow-container" ref={containerRef}>
      <div className="strategy-flow-header">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Our Strategic Process
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Scroll to explore how we transform your business strategy
        </motion.p>
      </div>

      {strategySteps && strategySteps.length > 0 ? (
        <>
          <ProgressIndicator 
            steps={strategySteps} 
            activeStep={activeStep}
            scrollProgress={scrollProgress}
            onStepClick={handleStepClick}
          />

          <div className="steps-container">
            {strategySteps.map((step, index) => (
              <StrategyStep
                key={step.id}
                step={step}
                index={index}
                isActive={activeStep === index}
                scrollProgress={scrollProgress}
                onInterested={() => setShowForm(true)}
              />
            ))}
          </div>
        </>
      ) : (
        <div style={{ color: 'white', padding: '20px' }}>No steps available</div>
      )}

      {showForm && (
        <InterestForm
          steps={strategySteps}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  )
}

export default InteractiveStrategyFlow
