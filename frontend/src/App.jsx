import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import History from "./pages/History"
import Sidebar from "./components/Sidebar"
import TopBar from "./components/TopBar"
import { DarkModeProvider } from "./context/DarkModeContext"

function App() {
  return (
    <DarkModeProvider>
    <Router>
      <div className="flex h-full w-full bg-background text-on-background overflow-hidden">

        {/* Sidebar – hidden on mobile */}
        <div className="hidden md:block shrink-0">
          <Sidebar />
        </div>

        {/* Right column: TopBar + scrollable page */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar />
          <main className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/history" element={<History />} />
            </Routes>
          </main>
        </div>

      </div>
    </Router>
    </DarkModeProvider>
  )
}

export default App