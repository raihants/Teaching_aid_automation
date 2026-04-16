import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import History from "./pages/History"
import Navbar from "./components/Navbar" // 🔥 tambahin ini

function App() {
  return (
    <Router>

      {/* 🔥 Navbar global */}
      <Navbar />

      {/* 🔽 Halaman */}
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/history" element={<History />} />
      </Routes>

    </Router>
  )
}

export default App