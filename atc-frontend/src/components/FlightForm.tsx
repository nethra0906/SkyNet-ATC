import { useState } from "react";
import { addFlight } from "../services/api";
import type { Flight } from "../types";
import styles from "./FlightForm.module.css";

interface Props {
  onFlightAdded?: () => void;
}

function FlightForm({ onFlightAdded }: Props) {
  const [flight, setFlight] = useState<Partial<Flight>>({
    flightId: "",
    airline: "",
    arrivalTime: "",
    priority: "normal" as any,
    status: "scheduled" as any,
  });

  const [isSubmitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<{ [k: string]: string }>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFlight((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const errs: { [k: string]: string } = {};
    if (!flight.flightId) errs.flightId = "Required";
    if (!flight.airline) errs.airline = "Required";
    if (!flight.arrivalTime) errs.arrivalTime = "Required";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    try {
      setSubmitting(true);
      const flightData = {
        flightId: flight.flightId!,
        airline: flight.airline!,
        priority: flight.priority!,
        scheduledLanding: new Date(flight.arrivalTime!).toISOString(),
      };
      await addFlight(flightData as any);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 2000);
      setFlight({
        flightId: "",
        airline: "",
        arrivalTime: "",
        priority: "normal" as any,
        status: "scheduled" as any,
      });
      onFlightAdded?.();
    } catch (error) {
      console.error("Failed to add flight:", error);
      setErrors({ flightId: "Server error — please try again" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      {/* Ambient glow */}
      <div className={styles.glowOrb} aria-hidden="true" />

      {/* Header */}
      <div className={styles.formHeader}>
        <span className={styles.eyebrow}>FLIGHT INTAKE</span>
        <h2 className={styles.formTitle}>Register Flight</h2>
      </div>

      {/* Fields row */}
      <div className={styles.fieldsGrid}>
        {/* Flight ID */}
        <div className={`${styles.field} ${errors.flightId ? styles.fieldError : ""}`}>
          <label htmlFor="flightId" className={styles.fieldLabel}>
            <span className={styles.labelDot} aria-hidden="true" />
            FLIGHT ID
          </label>
          <input
            id="flightId"
            name="flightId"
            type="text"
            value={flight.flightId || ""}
            onChange={handleChange}
            placeholder="AI-302"
            autoComplete="off"
            spellCheck={false}
            aria-invalid={!!errors.flightId}
          />
          {errors.flightId && (
            <p className={styles.error} role="alert">⚠ {errors.flightId}</p>
          )}
        </div>

        {/* Airline */}
        <div className={`${styles.field} ${errors.airline ? styles.fieldError : ""}`}>
          <label htmlFor="airline" className={styles.fieldLabel}>
            <span className={styles.labelDot} aria-hidden="true" />
            AIRLINE
          </label>
          <input
            id="airline"
            name="airline"
            type="text"
            value={flight.airline || ""}
            onChange={handleChange}
            placeholder="Air India"
            autoComplete="off"
            spellCheck={false}
            aria-invalid={!!errors.airline}
          />
          {errors.airline && (
            <p className={styles.error} role="alert">⚠ {errors.airline}</p>
          )}
        </div>

        {/* Arrival time */}
        <div className={`${styles.field} ${errors.arrivalTime ? styles.fieldError : ""}`}>
          <label htmlFor="arrivalTime" className={styles.fieldLabel}>
            <span className={styles.labelDot} aria-hidden="true" />
            LANDING SLOT
          </label>
          <input
            id="arrivalTime"
            name="arrivalTime"
            type="datetime-local"
            value={flight.arrivalTime || ""}
            onChange={handleChange}
            aria-invalid={!!errors.arrivalTime}
          />
          {errors.arrivalTime && (
            <p className={styles.error} role="alert">⚠ {errors.arrivalTime}</p>
          )}
        </div>

        {/* Priority */}
        <div className={styles.field}>
          <label htmlFor="priority" className={styles.fieldLabel}>
            <span className={styles.labelDot} aria-hidden="true" />
            PRIORITY
          </label>
          <div className={styles.selectWrap}>
            <select
              id="priority"
              name="priority"
              value={(flight.priority as string) || "normal"}
              onChange={handleChange}
            >
              <option value="normal">Normal</option>
              <option value="vip">VIP</option>
              <option value="emergency">Emergency</option>
            </select>
            <span className={styles.selectArrow} aria-hidden="true">▾</span>
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className={styles.actions}>
        <button
          type="submit"
          disabled={isSubmitting}
          className={submitted ? styles.btnSuccess : ""}
          aria-live="polite"
        >
          {submitted ? (
            <>✓ Flight Registered</>
          ) : isSubmitting ? (
            <>
              <span className={styles.spinner} aria-hidden="true" />
              Registering...
            </>
          ) : (
            <>+ Register Flight</>
          )}
        </button>
      </div>
    </form>
  );
}

export default FlightForm;