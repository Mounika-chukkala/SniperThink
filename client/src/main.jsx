import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Error boundary for development
const rootElement = document.getElementById('root')
if (!rootElement) {
  console.error('Root element not found!')
} else {
  try {
    const root = ReactDOM.createRoot(rootElement)
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    )
    console.log('React app mounted successfully')
  } catch (error) {
    console.error('Error mounting React app:', error)
    rootElement.innerHTML = `
      <div style="color: white; padding: 20px;">
        <h1>Error Loading App</h1>
        <p>${error.message}</p>
        <pre>${error.stack}</pre>
      </div>
    `
  }
}
