export interface Flight {
  flightId: string;
  airline: string;
  priority: "high" | "normal" | "low";
  scheduledLanding: string;
  arrivalTime?: string; // ISO string
  status?: "scheduled" | "landing" | "landed" | "taxiing" | "docked" | "departed";
  runwayAssigned?: string | null;
  gateAssigned?: string | null;
}

export interface LogEvent {
  event: string;
  flightId?: string;
  from?: string;
  to?: string;
  timestamp: string;
}

// Backend summary structure
export interface BackendFlightRecord {
  flightId: string;
  airline: string;
  priority: string;
  scheduledLanding: string;
  landingStart: string;
  touchdown: string;
  runway: string;
  taxiwayIn: string;
  taxiwayInTime: string;
  gateNo: string;
  gateAssignedTime: string;
  gateReleasedTime: string;
  taxiwayOut: string;
  taxiwayOutTime: string;
  takeoffClearedTime: string;
  takeoffRollTime: string;
  departureTime: string;
  totalTurnaroundTime: string
}

export interface BackendSummary {
  summaryId: number;
  flights: BackendFlightRecord[];
}

// Frontend display structure
export interface FlightSummary {
  flightId: string;
  date: string;
  airline: string;
  touchdownTime: string;
  taxiwayInTime: string;
  gateDockTime: string;
  gateAllotted: string;
  gateUndockTime: string;
  taxiwayOutTime: string;
  clearanceTime: string;
  takeoffTime: string;
  totalTurnaroundTime: string;
}