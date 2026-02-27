import { useState } from 'react'
import './App.css'

// dashboard components
import LiveStatusPanel from './components/LiveStatusPanel'
import ProductionSummary from './components/ProductionSummary'
import OEEChart from './components/OEEChart'
import WIPTracking from './components/WIPTracking'
import ProductionHistory from './components/ProductionHistory'

function App() {
  // ephemeral state left over from scaffold
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <header>
        <h1>Frontend‑B Dashboard</h1>
      </header>
      <main>
        <LiveStatusPanel />
        <ProductionSummary />
        <OEEChart />
        <WIPTracking />
        <ProductionHistory />
      </main>
      {/* keep the original counter for now */}
      <footer>
        <div className="card">
          <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
          <p>Edit <code>src/App.jsx</code> and save to test HMR</p>
        </div>
      </footer>
    </div>
  )
}

export default App
