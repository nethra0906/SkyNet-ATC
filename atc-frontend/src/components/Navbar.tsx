import styles from "./Navbar.module.css";

function Navbar() {
  return (
    <nav className={styles.navbar} role="banner">
      {/* Runway grid — purely decorative */}
      <div className={styles.runwayGrid} aria-hidden="true">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className={styles.runwayLine} />
        ))}
      </div>

      <div className={styles.container}>
        {/* Brand */}
        <div className={styles.brand}>
          <div className={styles.logoMark} aria-hidden="true">
            <span className={styles.logoRing} />
            <span className={styles.logoDot} />
          </div>
          <div className={styles.brandText}>
            <span className={styles.brandName}>SkyNet ATC</span>
            <span className={styles.brandSub}>Next-Gen Air Traffic Management</span>
          </div>
        </div>

        {/* Right cluster */}
        <div className={styles.right}>
          <div className={styles.stat}>
            <span className={styles.statNum}>1248</span>
            <span className={styles.statLabel}>flights active</span>
          </div>
          <div className={styles.divider} aria-hidden="true" />
          <div className={styles.stat}>
            <span className={styles.statNum}>98.7%</span>
            <span className={styles.statLabel}>efficiency</span>
          </div>
          <div className={styles.divider} aria-hidden="true" />
          <div className={styles.systemStatus}>
            <span className={styles.statusDot} aria-hidden="true" />
            <span className={styles.statusText}>SYSTEM ONLINE</span>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;