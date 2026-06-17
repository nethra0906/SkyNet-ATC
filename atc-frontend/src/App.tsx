import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Hero from "./components/Hero"; // Your new hero page
import SimulationDashboard from "./pages/SimulationDashboard.tsx"; // The code below

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/simulation" element={<SimulationDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;