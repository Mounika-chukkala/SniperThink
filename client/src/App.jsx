import React from 'react'
import InteractiveStrategyFlow from './components/InteractiveStrategyFlow'
import './App.css'

function App() {
  return (
    <div className="App">
      <header className="app-header">
        <h1>SniperThink</h1>
        <p>How We Transform Your Strategy</p>
      </header>
      <React.Suspense fallback={<div style={{color: 'white', padding: '20px'}}>Loading...</div>}>
        <InteractiveStrategyFlow />
      </React.Suspense>
    </div>
  )
}

export default App
