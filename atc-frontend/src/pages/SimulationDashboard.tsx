import { useEffect, useState } from "react";
import { getFlights, getLatestSummary } from "../services/api";
import Navbar from "../components/Navbar";
import Dashboard from "../components/Dashboard";
import Logs from "../components/Logs";
import FlightForm from "../components/FlightForm";
import Controls from "../components/Controls";
import Summary from "../components/Summary";
import type { Flight, LogEvent, FlightSummary, BackendSummary, BackendFlightRecord } from "../types";

function SimulationDashboard() {
  const [logs, setLogs] = useState<LogEvent[]>([]);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [summaryData, setSummaryData] = useState<FlightSummary[]>([]);

  useEffect(() => {
    loadFlights();
    loadSummary();
  }, []);

  const loadFlights = async () => {
    try {
      const response = await getFlights();
      setFlights(response.data);
    } catch (error) { console.error("Failed to load flights:", error); }
  };

  const loadSummary = async () => {
    try {
      const response = await getLatestSummary();
      const backendSummary: BackendSummary = response.data;
      
      const formattedSummary: FlightSummary[] = backendSummary.flights.map((flight: BackendFlightRecord) => {
        const touchdown = new Date(flight.touchdown);
        return {
          flightId: flight.flightId,
          date: touchdown.toLocaleDateString(),
          airline: flight.airline,
          touchdownTime: touchdown.toLocaleTimeString(),
          taxiwayInTime: new Date(flight.taxiwayInTime).toLocaleTimeString(),
          gateDockTime: new Date(flight.gateAssignedTime).toLocaleTimeString(),
          gateAllotted: flight.gateNo,
          gateUndockTime: new Date(flight.gateReleasedTime).toLocaleTimeString(),
          taxiwayOutTime: new Date(flight.taxiwayOutTime).toLocaleTimeString(),
          clearanceTime: new Date(flight.takeoffClearedTime).toLocaleTimeString(),
          takeoffTime: new Date(flight.departureTime).toLocaleTimeString(),
          totalTurnaroundTime: `${flight.totalTurnaroundTime}`,
        };
      });
      setSummaryData(formattedSummary);
    } catch (error) { setSummaryData([]); }
  };

  return (
    <div className="simulation-layout">
      <Navbar />
      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>
        <Controls 
          setLogs={setLogs} 
          onSimulationComplete={loadSummary} 
          onStop={() => setTimeout(loadSummary, 1000)} 
        />
        <FlightForm onFlightAdded={loadFlights} />
        <Dashboard flights={flights} />
        <Summary summaryData={summaryData} />
        <Logs logs={logs} />
      </main>
    </div>
  );
}

export default SimulationDashboard;