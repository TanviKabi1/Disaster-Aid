import { createContext, useContext, useState, useCallback } from 'react';

const SimulationContext = createContext(null);

export function SimulationProvider({ children }) {
  const [simulationResult, setSimulationResult] = useState(null);
  const [isRunning, setIsRunning]               = useState(false);
  const [simulationHistory, setSimulationHistory] = useState([]);
  const [timeline, setTimeline]                 = useState([]);
  const [timelineIndex, setTimelineIndex]       = useState(24);
  const [emergencyMode, setEmergencyMode]       = useState(false);
  const [liveLog, setLiveLog]                   = useState([]);
  const [historicalData, setHistoricalData]     = useState(null);
  const [selectedCountry, setSelectedCountry]   = useState('India');
  const [aiReports, setAiReports]               = useState([]);
  const [selectedEvent, setSelectedEvent]       = useState(null);

  const formatINR = (crore) => {
    if (!crore) return "₹0";
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(crore).replace('₹', '₹ ') + ' Cr';
  };

  const addToHistory = useCallback((result) => {
    setSimulationHistory(prev => [...prev.slice(-19), { ...result, id: Date.now() }]);
  }, []);

  const appendLiveLog = useCallback((message) => {
    const ts = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLiveLog(prev => [{ ts, message, id: Date.now() + Math.random() }, ...prev.slice(0, 49)]);
  }, []);

  const resetSystem = useCallback(() => {
    setSimulationResult(null);
    setIsRunning(false);
    setSimulationHistory([]);
    setTimeline([]);
    setTimelineIndex(24);
    setEmergencyMode(false);
    setLiveLog([]);
    setHistoricalData(null);
    setSelectedEvent(null);
  }, []);

  return (
    <SimulationContext.Provider value={{
      simulationResult, setSimulationResult,
      isRunning,        setIsRunning,
      simulationHistory, addToHistory,
      timeline,         setTimeline,
      timelineIndex,    setTimelineIndex,
      emergencyMode,    setEmergencyMode,
      liveLog,          appendLiveLog,
      historicalData,   setHistoricalData,
      selectedCountry,  setSelectedCountry,
      aiReports,        setAiReports,
      selectedEvent,    setSelectedEvent,
      formatINR,        resetSystem,
    }}>
      {children}
    </SimulationContext.Provider>
  );
}

export function useSimulation() {
  return useContext(SimulationContext);
}
