import type { FlightSummary } from "../types";
import styles from "./Summary.module.css";

interface Props {
  summaryData: FlightSummary[];
}

// Parse "Xm Ys" or raw seconds into minutes for a simple bar width
function turnaroundMinutes(raw: string | undefined): number {
  if (!raw) return 0;
  const mMatch = raw.match(/(\d+)\s*m/);
  const sMatch = raw.match(/(\d+)\s*s/);
  const m = mMatch ? parseInt(mMatch[1]) : 0;
  const s = sMatch ? parseInt(sMatch[1]) : 0;
  return m + s / 60;
}

const MAX_TURNAROUND_MIN = 60; // bar scales to this ceiling

function Summary({ summaryData }: Props) {
  const lastSync = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <section className={styles.summary}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <span className={styles.eyebrow}>POST-SIMULATION</span>
          <h2 className={styles.heading}>Turnaround Manifest</h2>
        </div>
        {summaryData.length > 0 && (
          <div className={styles.headerMeta}>
            <span className={styles.metaItem}>
              <span className={styles.metaNum}>{summaryData.length}</span>
              <span className={styles.metaLabel}>flights processed</span>
            </span>
            <div className={styles.metaDivider} aria-hidden="true" />
            <span className={styles.metaItem}>
              <span className={styles.metaNum}>{lastSync}</span>
              <span className={styles.metaLabel}>last sync</span>
            </span>
          </div>
        )}
      </div>

      {summaryData.length === 0 ? (
        <div className={styles.empty}>
          <span className={styles.emptyDot} aria-hidden="true" />
          <span>Awaiting simulation data...</span>
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table} aria-label="Flight turnaround summary">
            <thead>
              <tr>
                <th className={styles.th} scope="col">Flight</th>
                <th className={styles.th} scope="col">Airline</th>
                <th className={styles.th} scope="col">Touchdown</th>
                <th className={styles.th} scope="col">Gate In</th>
                <th className={styles.th} scope="col">Gate Out</th>
                <th className={styles.th} scope="col">Takeoff</th>
                <th className={`${styles.th} ${styles.thHighlight}`} scope="col">Turnaround</th>
              </tr>
            </thead>
            <tbody>
              {summaryData.map((flight, index) => {
                const mins = turnaroundMinutes(flight.totalTurnaroundTime);
                const barPct = Math.min((mins / MAX_TURNAROUND_MIN) * 100, 100);
                const isFast = mins > 0 && mins < 20;
                const isSlow = mins >= 40;

                return (
                  <tr key={index} className={styles.row}>
                    <td className={`${styles.td} ${styles.tdFlight}`}>
                      {flight.flightId}
                    </td>
                    <td className={styles.td}>{flight.airline}</td>
                    <td className={styles.td}>{flight.touchdownTime  || "—"}</td>
                    <td className={styles.td}>{flight.gateDockTime   || "—"}</td>
                    <td className={styles.td}>{flight.gateUndockTime || "—"}</td>
                    <td className={styles.td}>{flight.takeoffTime    || "—"}</td>
                    <td className={`${styles.td} ${styles.tdTurnaround}`}>
                      <span
                        className={`${styles.turnaroundVal} ${
                          isFast ? styles.turnaroundFast :
                          isSlow ? styles.turnaroundSlow :
                          styles.turnaroundMid
                        }`}
                      >
                        {flight.totalTurnaroundTime || "—"}
                      </span>
                      {mins > 0 && (
                        <div className={styles.bar} aria-hidden="true">
                          <div
                            className={`${styles.barFill} ${
                              isFast ? styles.barFast :
                              isSlow ? styles.barSlow :
                              styles.barMid
                            }`}
                            style={{ width: `${barPct}%` }}
                          />
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default Summary;