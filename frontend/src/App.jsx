import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Simulator from './pages/Simulator';
import ControlCenter from './pages/ControlCenter';
import Insights from './pages/Insights';
import GlobeIntelligence from './pages/GlobeIntelligence';
import EmergencySOS from './pages/EmergencySOS';
import AIReports from './pages/AIReports';
import EventDrilldown from './pages/EventDrilldown';
import { SimulationProvider } from './context/SimulationContext';

function App() {
  return (
    <SimulationProvider>
      <Router>
        <div className="flex flex-col h-screen bg-background text-white overflow-hidden">
          <Navbar />
          <main className="flex-1 overflow-hidden">
            <Routes>
              <Route path="/"               element={<Home />} />
              <Route path="/globe"          element={<GlobeIntelligence />} />
              <Route path="/simulator"      element={<Simulator />} />
              <Route path="/ai-reports"     element={<AIReports />} />
              <Route path="/control-center" element={<ControlCenter />} />
              <Route path="/insights"       element={<Insights />} />
              <Route path="/emergency"      element={<EmergencySOS />} />
              <Route path="/event/:id"      element={<EventDrilldown />} />
            </Routes>
          </main>
        </div>
      </Router>
    </SimulationProvider>
  );
}

export default App;
