"use client";

import OfficerHeader from "@/components/officer/OfficerHeader";
import Link from "next/link";
import styles from "./disease-map.module.css";

const hotspots = [
  {
    district: "Pancheru",
    crop: "Tomato",
    disease: "Early Blight",
    severity: "HIGH",
    reports: 42,
    confidence: "94%",
  },
  {
    district: "Medak",
    crop: "Cotton",
    disease: "Pink Bollworm",
    severity: "HIGH",
    reports: 37,
    confidence: "91%",
  },
  {
    district: "Sangareddy",
    crop: "Rice",
    disease: "Brown Planthopper",
    severity: "MEDIUM",
    reports: 24,
    confidence: "87%",
  },
  {
    district: "Narsapur",
    crop: "Maize",
    disease: "Fall Armyworm",
    severity: "HIGH",
    reports: 31,
    confidence: "92%",
  },
];

export default function DiseaseMapPage() {
  return (
    <main className={styles.page}>
      <OfficerHeader />

      <section className={styles.content}>
        <div className={styles.titleRow}>
          <div>
            <p className={styles.eyebrow}>REAL-TIME MONITORING</p>
            <h1>Disease & Pest Hotspots</h1>
            <p className={styles.subtitle}>
              Monitor disease outbreaks and pest activity across Maharashtra.
            </p>
          </div>

          <button className={styles.refreshButton}>
            ↻ Refresh Data
          </button>
        </div>

        <div className={styles.filters}>
          <span>Filter:</span>
          <button className={styles.selected}>All Maharashtra</button>
          <button>All Crops</button>
          <button>All Diseases</button>
          <button>All Severity</button>
          <button>Last 7 Days</button>
        </div>

        <div className={styles.stats}>
          <div className={styles.statCard}>
            <span>🔴</span>
            <div>
              <p>HIGH RISK HOTSPOTS</p>
              <strong>8</strong>
              <small>Requires immediate action</small>
            </div>
          </div>

          <div className={styles.statCard}>
            <span>🟠</span>
            <div>
              <p>MEDIUM RISK AREAS</p>
              <strong>14</strong>
              <small>Monitoring recommended</small>
            </div>
          </div>

          <div className={styles.statCard}>
            <span>🌾</span>
            <div>
              <p>FARMS AFFECTED</p>
              <strong>248</strong>
              <small>Across monitored districts</small>
            </div>
          </div>
        </div>

        <div className={styles.mainGrid}>
          <section className={styles.mapCard}>
            <div className={styles.cardHeader}>
              <div>
                <h2>Maharashtra Risk Map</h2>
                <p>Live disease and pest risk concentration</p>
              </div>

              <span className={styles.live}>● LIVE</span>
            </div>

            <div className={styles.mapArea}>
              <div className={`${styles.mapDot} ${styles.high} ${styles.dotOne}`}>
                <span>Medak</span>
              </div>

              <div className={`${styles.mapDot} ${styles.high} ${styles.dotTwo}`}>
                <span>Pancheru</span>
              </div>

              <div className={`${styles.mapDot} ${styles.medium} ${styles.dotThree}`}>
                <span>Sangareddy</span>
              </div>

              <div className={`${styles.mapDot} ${styles.high} ${styles.dotFour}`}>
                <span>Narsapur</span>
              </div>

              <div className={styles.mapCenter}>
                <strong>MAHARASHTRA</strong>
                <span>Hotspot Monitoring</span>
              </div>
            </div>

            <div className={styles.legend}>
              <span><i className={styles.legendHigh}></i> High Risk</span>
              <span><i className={styles.legendMedium}></i> Medium Risk</span>
              <span><i className={styles.legendLow}></i> Low Risk</span>
            </div>
          </section>

          <section className={styles.sideCard}>
            <h2>Priority Hotspots</h2>
            <p>Areas requiring officer attention</p>

            <div className={styles.priorityList}>
              {hotspots.slice(0, 3).map((hotspot) => (
                <div key={hotspot.district} className={styles.priorityItem}>
                  <div>
                    <strong>{hotspot.district}</strong>
                    <span>{hotspot.disease}</span>
                  </div>

                  <span
                    className={
                      hotspot.severity === "HIGH"
                        ? styles.highBadge
                        : styles.mediumBadge
                    }
                  >
                    {hotspot.severity}
                  </span>
                </div>
              ))}
            </div>

            <button className={styles.viewButton}>
              View All Hotspots →
            </button>
          </section>
        </div>

        <section className={styles.tableCard}>
          <div className={styles.cardHeader}>
            <div>
              <h2>Detected Hotspots</h2>
              <p>AI detections combined with farmer and field reports</p>
            </div>

            <span className={styles.resultCount}>4 Active Hotspots</span>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.hotspotTable}>
              <thead>
                <tr>
                  <th>District</th>
                  <th>Crop</th>
                  <th>Disease / Pest</th>
                  <th>Severity</th>
                  <th>Reports</th>
                  <th>AI Confidence</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {hotspots.map((hotspot) => (
                  <tr key={hotspot.district}>
                    <td><strong>{hotspot.district}</strong></td>
                    <td>{hotspot.crop}</td>
                    <td>{hotspot.disease}</td>
                    <td>
                      <span
                        className={
                          hotspot.severity === "HIGH"
                            ? styles.highBadge
                            : styles.mediumBadge
                        }
                      >
                        {hotspot.severity}
                      </span>
                    </td>
                    <td>{hotspot.reports}</td>
                    <td className={styles.confidence}>
                      {hotspot.confidence}
                    </td>
                    <td>
                      <button className={styles.reviewButton}>
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </main>
  );
}
