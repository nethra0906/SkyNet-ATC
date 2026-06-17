import type { Flight } from "../types";
import styles from "./Dashboard.module.css";

interface Props {
  flights: Flight[];
}

function Dashboard({ flights }: Props) {
  return (
    <section className={styles.dashboard}>
      <div className={styles.header}>
        <div>
          <span className={styles.eyebrow}>LIVE TRAFFIC</span>
          <h2 className={styles.title}>Flight Dashboard</h2>
        </div>
        <div className={styles.count}>
          <span className={styles.countNum}>{flights.length}</span>
          <span className={styles.countLabel}>aircraft tracked</span>
        </div>
      </div>

      {flights.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon} aria-hidden="true">✈</div>
          <p className={styles.emptyTitle}>No flights in queue</p>
          <p className={styles.emptyHint}>Add a flight above to begin tracking</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {flights.map((f, i) => {
            const priorityKey = `priority-${String(f.priority || "normal").toLowerCase()}`;
            const scheduledTime = f.scheduledLanding
              ? new Date(f.scheduledLanding).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "--:--";
            const scheduledDate = f.scheduledLanding
              ? new Date(f.scheduledLanding).toLocaleDateString([], {
                  month: "short",
                  day: "numeric",
                })
              : null;

            const isEmergency = String(f.priority).toLowerCase() === "emergency";

            return (
              <article
                key={i}
                className={`${styles.card} ${isEmergency ? styles.cardEmergency : ""}`}
              >
                {/* Top accent line */}
                <div className={`${styles.accentLine} ${styles[priorityKey + "Accent"]}`} aria-hidden="true" />

                <div className={styles.cardHead}>
                  <div className={styles.cardHeadLeft}>
                    <span className={styles.flightLabel}>FLIGHT</span>
                    <h3 className={styles.flightId}>{f.flightId}</h3>
                  </div>
                  <span className={`${styles.badge} ${styles[priorityKey]}`}>
                    {String(f.priority).toUpperCase()}
                  </span>
                </div>

                <div className={styles.separator} aria-hidden="true" />

                <div className={styles.meta}>
                  <div className={styles.row}>
                    <span className={styles.metaLabel}>AIRLINE</span>
                    <span className={styles.metaValue}>{f.airline}</span>
                  </div>
                  <div className={styles.row}>
                    <span className={styles.metaLabel}>SLOT</span>
                    <span className={styles.metaValue}>
                      <span className={styles.timeMain}>{scheduledTime}</span>
                      {scheduledDate && (
                        <span className={styles.timeDate}>{scheduledDate}</span>
                      )}
                    </span>
                  </div>
                </div>

                <div className={styles.bottom}>
                  <span className={`${styles.signal} ${isEmergency ? styles.signalEmergency : ""}`} aria-hidden="true" />
                  <span className={styles.bottomText}>ACTIVE TRACKING</span>
                  <span className={styles.index}>#{String(i + 1).padStart(3, "0")}</span>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default Dashboard;