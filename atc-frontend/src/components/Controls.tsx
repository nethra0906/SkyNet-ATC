import { useState } from "react";
import { startSim, stopSim } from "../services/api";
import type { LogEvent } from "../types";
import styles from "./Controls.module.css";
import io, { Socket } from "socket.io-client";

interface Props {
  setLogs: React.Dispatch<React.SetStateAction<LogEvent[]>>;
  onStart?: () => void;
  onStop?: () => void;
  onSimulationComplete?: () => void;
}

let socket: Socket | null = null;

function Controls({ setLogs, onStart, onStop, onSimulationComplete }: Props) {
  const [isRunning, setIsRunning] = useState(false);

  const handleStart = async () => {
    if (!socket) {
      const socket = io(import.meta.env.VITE_API_URL);

      socket.on("connect", async () => {
        setLogs((prev) => [...prev, {
          event: "Connected to server",
          timestamp: new Date().toISOString(),
        }]);
        try {
          await startSim(socket!.id!);
          setLogs((prev) => [...prev, {
            event: "Simulation Started",
            timestamp: new Date().toISOString(),
          }]);
          setIsRunning(true);
          onStart?.();
        } catch {
          setLogs((prev) => [...prev, {
            event: "Failed to start simulation",
            timestamp: new Date().toISOString(),
          }]);
        }
      });

      socket.on("simulationComplete", (data) => {
        setLogs((prev) => [...prev, {
          event: "Simulation completed successfully",
          timestamp: new Date().toISOString(),
        }]);
        setIsRunning(false);
        onSimulationComplete?.();
      });

      socket.on("simulationStopped", () => {
        setLogs((prev) => [...prev, {
          event: "Simulation stopped",
          timestamp: new Date().toISOString(),
        }]);
        setIsRunning(false);
      });

      socket.on("simulationError", (data) => {
        setLogs((prev) => [...prev, {
          event: `Simulation error: ${data.error}`,
          timestamp: new Date().toISOString(),
        }]);
        setIsRunning(false);
      });

      const flightEvents: Record<string, (data: any) => string> = {
        clearedForLanding: (d) => `${d.flightId} cleared for landing`,
        Touchdown: (d) => `${d.flightId} touchdown on ${d.runway}`,
        enteredTaxiwayIn: (d) => `${d.flightId} entered taxiway (inbound)`,
        gateAssigned: (d) => `${d.flightId} docked at ${d.gate}`,
        gateReleased: (d) => `${d.flightId} left ${d.gate}`,
        enteredTaxiwayOut: (d) => `${d.flightId} entered taxiway (outbound)`,
        clearedForTakeoff: (d) => `${d.flightId} cleared for takeoff on ${d.runway}`,
        takeoffroll: (d) => `${d.flightId} takeoff roll on ${d.runway}`,
        flightDeparted: (d) => `${d.flightId} departed`,
      };

      Object.entries(flightEvents).forEach(([event, getMessage]) => {
        socket!.on(event, (data) => {
          setLogs((prev) => [...prev, {
            event: getMessage(data),
            timestamp: data.timestamp,
          }]);
        });
      });
    }
  };

  const handleStop = async () => {
    if (socket?.id) {
      try {
        await stopSim(socket.id);
        setLogs((prev) => [...prev, {
          event: "Stop signal sent to server",
          timestamp: new Date().toISOString(),
        }]);
      } catch {
        setLogs((prev) => [...prev, {
          event: "Failed to stop simulation",
          timestamp: new Date().toISOString(),
        }]);
      }
      socket.disconnect();
      socket = null;
    }
    setIsRunning(false);
    onStop?.();
  };

  return (
    <section className={styles.controls}>
      {/* Ambient glow orb */}
      <div className={styles.glowOrb} aria-hidden="true" />

      <div className={styles.inner}>
        {/* Left: identity */}
        <div className={styles.identity}>
          <span className={styles.eyebrow}>MISSION CONTROL</span>
          <h3 className={styles.title}>Simulation Controls</h3>
          <p className={styles.subtitle}>
            AI-powered flight coordination &amp; real-time operational awareness
          </p>
        </div>

        {/* Center divider */}
        <div className={styles.divider} aria-hidden="true" />

        {/* Right: status + actions */}
        <div className={styles.right}>
          <div className={`${styles.status} ${isRunning ? styles.active : styles.idle}`}>
            <span className={styles.statusDot} aria-hidden="true" />
            <span className={styles.statusLabel}>
              {isRunning ? "Simulation Active" : "Standby"}
            </span>
          </div>

          <div className={styles.actions}>
            <button
              className={styles.launchBtn}
              onClick={handleStart}
              disabled={isRunning}
              aria-label="Launch Simulation"
            >
              <span className={styles.btnIcon} aria-hidden="true">▶</span>
              Launch Simulation
            </button>

            <button
              className={styles.abortBtn}
              onClick={handleStop}
              disabled={!isRunning}
              aria-label="Abort Mission"
            >
              <span className={styles.btnIcon} aria-hidden="true">■</span>
              Abort Mission
            </button>
          </div>
        </div>
      </div>

      {/* Bottom scan line — purely decorative */}
      <div className={`${styles.scanLine} ${isRunning ? styles.scanActive : ""}`} aria-hidden="true" />
    </section>
  );
}

export default Controls;