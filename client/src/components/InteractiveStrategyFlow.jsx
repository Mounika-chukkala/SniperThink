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
        // Get header height (sticky header at top)
        const header = document.querySelector('.app-header')
        const headerHeight = header ? header.getBoundingClientRect().height : 0
        
        // Get the progress indicator element and its actual height
        const progressIndicator = document.querySelector('.progress-indicator-container')
        const progressIndicatorHeight = progressIndicator ? progressIndicator.getBoundingClientRect().height : 150
        
        // Calculate total sticky height (header + progress indicator)
        const stickyHeight = headerHeight + progressIndicatorHeight
        
        // Get element's position relative to document
        const elementRect = stepElement.getBoundingClientRect()
        const currentScrollY = window.pageYOffset || document.documentElement.scrollTop
        const elementTop = elementRect.top + currentScrollY
        
        // Subtract less to position card higher (closer to progress indicator)
        // Adjust this value to control how high the card appears (smaller = higher)
        const offsetAdjustment = 50 // Reduce this to make card appear higher
        
        // Calculate scroll position so card appears higher up
        // This positions the card closer to the progress indicator
        const targetScrollPosition = elementTop - stickyHeight + offsetAdjustment
        
        // Smooth scroll to position
        window.scrollTo({
          top: Math.max(0, targetScrollPosition),
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
