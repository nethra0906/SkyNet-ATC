import styles from "./Hero.module.css";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className={styles.hero}>
      {/* Background layers */}
      <div className={styles.grid} aria-hidden="true" />
      <div className={styles.atmosphericGlow} aria-hidden="true" />

      {/* Left — copy */}
      <div className={styles.left}>
        <span className={styles.badge}>
          NEXT-GEN AIR TRAFFIC MANAGEMENT
        </span>

        <h1 className={styles.h1}>
          Command The<br />
          <span className={styles.h1Gradient}>Sky Network</span>
        </h1>

        <p className={styles.sub}>
          AI-powered flight coordination, intelligent turnaround
          optimization and real-time operational awareness.
        </p>

        <div className={styles.actions}>
          <button
            className={styles.launchBtn}
            onClick={() => navigate("/simulation")}
          >
            Launch Simulator
          </button>
        </div>
      </div>

      {/* Right — radar + stats */}
      <div className={styles.right}>
        <div className={styles.radarWrap} aria-hidden="true">
          {/* Concentric rings */}
          <div className={styles.ring} style={{ inset: "0%" }} />
          <div className={styles.ring} style={{ inset: "12%" }} />
          <div className={styles.ring} style={{ inset: "24%" }} />

          {/* Cross-hair lines */}
          <div className={styles.crossH} />
          <div className={styles.crossV} />

          {/* Rotating sweep */}
          <div className={styles.sweep} />

          {/* Aircraft blips */}
          <div className={styles.blip} style={{ top: "22%", left: "34%" }}>
            <span className={styles.blipDot} />
            <span className={styles.blipRing} />
          </div>
          <div className={styles.blip} style={{ top: "55%", right: "22%" }}>
            <span className={styles.blipDot} />
            <span className={styles.blipRing} />
          </div>
          <div className={styles.blip} style={{ bottom: "28%", left: "52%" }}>
            <span className={styles.blipDot} />
            <span className={styles.blipRing} />
          </div>

          {/* Plane icons */}
          <span className={styles.plane} style={{ top: "20%", left: "30%" }} role="img" aria-label="aircraft">✈</span>
          <span className={styles.plane} style={{ top: "52%", right: "20%" }} role="img" aria-label="aircraft">✈</span>
          <span className={styles.plane} style={{ bottom: "25%", left: "48%" }} role="img" aria-label="aircraft">✈</span>
        </div>

        {/* Stat cards — match hero image exactly */}
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <span className={styles.statNum}>1248</span>
            <span className={styles.statLabel}>Flights Active</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNum}>98.7%</span>
            <span className={styles.statLabel}>Efficiency</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNum}>42</span>
            <span className={styles.statLabel}>Runways</span>
          </div>
        </div>
      </div>
    </section>
  );
}