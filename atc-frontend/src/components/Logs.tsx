import { useEffect, useRef } from "react";
import type { LogEvent } from "../types";
import styles from "./Logs.module.css";

interface Props {
  logs: LogEvent[];
}

// Classify each event into a semantic type for color coding
function getEventType(event: string): string {
  const e = event.toLowerCase();
  if (e.includes("error") || e.includes("failed")) return "error";
  if (e.includes("emergency")) return "emergency";
  if (e.includes("departed") || e.includes("takeoff") || e.includes("takeoffroll")) return "depart";
  if (e.includes("cleared for landing") || e.includes("touchdown")) return "land";
  if (e.includes("cleared for takeoff")) return "depart";
  if (e.includes("gate") || e.includes("taxiway") || e.includes("docked")) return "ground";
  if (e.includes("started") || e.includes("connected") || e.includes("complete")) return "system";
  if (e.includes("stopped") || e.includes("abort") || e.includes("signal")) return "warn";
  return "default";
}

const TYPE_PREFIX: Record<string, string> = {
  error:     "ERR",
  emergency: "SOS",
  depart:    "DEP",
  land:      "ARR",
  ground:    "GND",
  system:    "SYS",
  warn:      "WRN",
  default:   "EVT",
};

function Logs({ logs }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <section className={styles.logs}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.eyebrow}>TELEMETRY</span>
          <h2 className={styles.title}>Event Stream</h2>
        </div>
        <div className={styles.headerRight}>
          {logs.length > 0 && (
            <span className={styles.countBadge}>
              {logs.length} events
            </span>
          )}
          <span className={`${styles.liveIndicator} ${logs.length > 0 ? styles.liveActive : ""}`}>
            <span className={styles.liveDot} aria-hidden="true" />
            LIVE
          </span>
        </div>
      </div>

      {/* Stream panel */}
      <div className={styles.panel} ref={scrollRef}>
        {logs.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyDot} aria-hidden="true" />
            <span>Awaiting signal...</span>
          </div>
        ) : (
          <ul className={styles.list} aria-label="Event log">
            {logs.map((log, i) => {
              const type = getEventType(log.event);
              const prefix = TYPE_PREFIX[type];
              const isLatest = i === logs.length - 1;

              return (
                <li
                  key={i}
                  className={`${styles.item} ${styles[`type-${type}`]} ${isLatest ? styles.itemLatest : ""}`}
                >
                  <span className={styles.prefix} aria-label={`Event type: ${type}`}>
                    {prefix}
                  </span>
                  <span className={styles.event}>{log.event}</span>
                  <span className={styles.time}>
                    {new Date(log.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}

export default Logs;