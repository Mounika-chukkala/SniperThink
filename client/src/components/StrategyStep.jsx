import React, { useRef, useEffect, useState } from 'react'
import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion'
import './StrategyStep.css'

const StrategyStep = ({ step, index, isActive, scrollProgress, onInterested }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, margin: '-100px' })
  const [isHovered, setIsHovered] = useState(false)
  
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]))
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]))

  const handleMouseMove = (e) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set((e.clientX - centerX) / rect.width)
    y.set((e.clientY - centerY) / rect.height)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
    setIsHovered(false)
  }

  // Animation variants based on step animation type
  const getAnimationVariants = () => {
    const baseVariants = {
      hidden: { opacity: 0 },
      visible: { opacity: 1 }
    }

    switch (step.animationType) {
      case 'slideInLeft':
        return {
          hidden: { opacity: 0, x: -100, rotateY: -15 },
          visible: { 
            opacity: 1, 
            x: 0, 
            rotateY: 0,
            transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }
          }
        }
      case 'slideInRight':
        return {
          hidden: { opacity: 0, x: 100, rotateY: 15 },
          visible: { 
            opacity: 1, 
            x: 0, 
            rotateY: 0,
            transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }
          }
        }
      case 'scaleUp':
        return {
          hidden: { opacity: 0, scale: 0.8, y: 50 },
          visible: { 
            opacity: 1, 
            scale: 1, 
            y: 0,
            transition: { duration: 0.8, type: 'spring', stiffness: 100 }
          }
        }
      case 'rotateIn':
        return {
          hidden: { opacity: 0, rotate: -180, scale: 0.5 },
          visible: { 
            opacity: 1, 
            rotate: 0, 
            scale: 1,
            transition: { duration: 0.8, ease: 'easeOut' }
          }
        }
      case 'fadeInUp':
        return {
          hidden: { opacity: 0, y: 50 },
          visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.8, ease: 'easeOut' }
          }
        }
      default:
        return baseVariants
    }
  }

  const variants = getAnimationVariants()
  const isEven = index % 2 === 0

  return (
    <motion.div
      ref={ref}
      id={`step-${index}`}
      className={`strategy-step ${isEven ? 'step-even' : 'step-odd'} ${isActive ? 'active' : ''}`}
      variants={variants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      style={{
        rotateX: isHovered ? rotateX : 0,
        rotateY: isHovered ? rotateY : 0,
        transformStyle: 'preserve-3d'
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="step-content"
        style={{
          background: `linear-gradient(135deg, ${step.color}15 0%, ${step.color}05 100%)`,
          borderColor: step.color
        }}
      >
        <motion.div
          className="step-icon"
          animate={isActive ? { 
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0]
          } : {}}
          transition={{ 
            duration: 2, 
            repeat: isActive ? Infinity : 0,
            repeatType: 'reverse'
          }}
        >
          {step.icon}
        </motion.div>

        <motion.h3
          className="step-title"
          style={{ color: step.color }}
          animate={isActive ? { scale: 1.05 } : { scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {step.title}
        </motion.h3>

        <motion.p
          className="step-description"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.3 }}
        >
          {step.description}
        </motion.p>

        <motion.ul
          className="step-details"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.5 }}
        >
          {step.details.map((detail, idx) => (
            <motion.li
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ delay: 0.6 + idx * 0.1 }}
            >
              {detail}
            </motion.li>
          ))}
        </motion.ul>

        <motion.button
          className="interest-button"
          onClick={onInterested}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{ 
            background: step.color,
            boxShadow: `0 4px 20px ${step.color}40`
          }}
        >
          I'm Interested
        </motion.button>

        <motion.div
          className="step-progress-bar"
          style={{
            width: isActive ? `${scrollProgress % 20}%` : '0%',
            background: step.color
          }}
        />
      </motion.div>
    </motion.div>
  )
}

export default StrategyStep
