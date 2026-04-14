import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import History from "./pages/History"

function App() {
  return (
    <Router>
      <nav style={{ display: "flex", gap: "20px", padding: "10px" }}>
        <Link to="/">Dashboard</Link>
        <Link to="/history">History</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </Router>
  );
}

export default App