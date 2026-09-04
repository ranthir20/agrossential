import OfficerHeader from "@/components/officer/OfficerHeader";
import Link from "next/link";
import styles from "./officer.module.css";

export default function OfficerPage() {
  const alerts = [
    {
      district: "Pune",
      crop: "Tomato",
      issue: "Early Blight",
      severity: "High",
      confidence: "94%",
      time: "12 min ago",
    },
    {
      district: "Nashik",
      crop: "Grapes",
      issue: "Downy Mildew",
      severity: "High",
      confidence: "91%",
      time: "28 min ago",
    },
    {
      district: "Nagpur",
      crop: "Cotton",
      issue: "Pink Bollworm",
      severity: "Medium",
      confidence: "87%",
      time: "1 hr ago",
    },
    {
      district: "Satara",
      crop: "Maize",
      issue: "Fall Armyworm",
      severity: "Medium",
      confidence: "82%",
      time: "2 hrs ago",
    },
  ];

  const farms = [
    { name: "Green Valley Farm", district: "Pune", risk: "High" },
    { name: "Patil Agro Farm", district: "Nashik", risk: "High" },
    { name: "Shinde Fields", district: "Nagpur", risk: "Medium" },
  ];

  return (
    <main className={styles.app}>
      <OfficerHeader />

      <section className={styles.content}>
        <div className={styles.pageHeader}>
          <div>
            <p className={styles.eyebrow}>AGRICULTURAL MONITORING SYSTEM</p>
            <h1>Officer Dashboard</h1>
            <p>
              Monitor disease outbreaks, pest hotspots and farms requiring
              immediate attention.
            </p>
          </div>

          <Link href="/officer/alerts" className={styles.primaryButton}>+ Create Advisory</Link>
        </div>

        <section className={styles.filters}>
          <span className={styles.filterLabel}>Monitor:</span>
          <button className={styles.filterActive}>All Maharashtra</button>
          <button className={styles.filter}>All Crops</button>
          <button className={styles.filter}>All Diseases</button>
          <button className={styles.filter}>All Severity</button>
          <button className={styles.filter}>Last 7 Days</button>
        </section>

        <section className={styles.stats}>
          <article className={styles.statCard}>
            <span className={styles.statIcon}>🚨</span>
            <span className={styles.statLabel}>ACTIVE ALERTS</span>
            <strong className={styles.statValue}>12</strong>
            <span className={styles.statHint}>3 new since yesterday</span>
          </article>

          <article className={styles.statCard}>
            <span className={styles.statIcon}>🔴</span>
            <span className={styles.statLabel}>HIGH RISK AREAS</span>
            <strong className={styles.statValue}>5</strong>
            <span className={styles.statHint}>Requires field attention</span>
          </article>

          <article className={styles.statCard}>
            <span className={styles.statIcon}>🌾</span>
            <span className={styles.statLabel}>FARMS MONITORED</span>
            <strong className={styles.statValue}>248</strong>
            <span className={styles.statHint}>Across Maharashtra</span>
          </article>

          <article className={styles.statCard}>
            <span className={styles.statIcon}>🤖</span>
            <span className={styles.statLabel}>EXPERT REVIEWS</span>
            <strong className={styles.statValue}>18</strong>
            <span className={styles.statHint}>Pending validation</span>
          </article>
        </section>

        <section className={styles.dashboardGrid}>
          <article className={`${styles.card} ${styles.mapCard}`}>
            <div className={styles.cardHeader}>
              <div>
                <h2>Disease & Pest Hotspots</h2>
                <p>Current risk concentration across Maharashtra</p>
              </div>
              <span className={styles.liveBadge}>● LIVE</span>
            </div>

            <div className={styles.map}>
              <div className={styles.mapTitle}>MAHARASHTRA</div>

              <div className={`${styles.hotspot} ${styles.hotspotHigh} ${styles.pune}`}>
                Pune
                <span>HIGH</span>
              </div>

              <div className={`${styles.hotspot} ${styles.hotspotHigh} ${styles.nashik}`}>
                Nashik
                <span>HIGH</span>
              </div>

              <div className={`${styles.hotspot} ${styles.hotspotMedium} ${styles.nagpur}`}>
                Nagpur
                <span>MEDIUM</span>
              </div>

              <div className={`${styles.hotspot} ${styles.hotspotMedium} ${styles.satara}`}>
                Satara
                <span>MEDIUM</span>
              </div>

              <div className={`${styles.hotspot} ${styles.hotspotLow} ${styles.kolhapur}`}>
                Kolhapur
                <span>LOW</span>
              </div>
            </div>

            <div className={styles.legend}>
              <span><i className={styles.legendHigh}></i> High Disease Risk</span>
              <span><i className={styles.legendMedium}></i> Medium Risk</span>
              <span><i className={styles.legendLow}></i> Low Risk</span>
            </div>
          </article>

          <article className={styles.card}>
            <div className={styles.cardHeader}>
              <div>
                <h2>Risk Overview</h2>
                <p>AI + field data analysis</p>
              </div>
            </div>

            <div className={styles.riskList}>
              <div className={styles.riskRow}>
                <div>
                  <strong>Disease Risk</strong>
                  <span>Early Blight, Downy Mildew</span>
                </div>
                <b className={styles.highBadge}>HIGH</b>
              </div>

              <div className={styles.riskRow}>
                <div>
                  <strong>Pest Risk</strong>
                  <span>Pink Bollworm, Armyworm</span>
                </div>
                <b className={styles.mediumBadge}>MEDIUM</b>
              </div>

              <div className={styles.riskRow}>
                <div>
                  <strong>Weather Risk</strong>
                  <span>Humidity conditions monitored</span>
                </div>
                <b className={styles.lowBadge}>LOW</b>
              </div>
            </div>

            <Link href="/officer/disease-map" className={styles.secondaryButton}>View Full Risk Analysis →</Link>
          </article>
        </section>

        <section className={styles.lowerGrid}>
          <article className={styles.card}>
            <div className={styles.cardHeader}>
              <div>
                <h2>Recent Alerts</h2>
                <p>Latest AI and farmer-reported cases</p>
              </div>
              <Link href="/officer/alerts" className={styles.textButton}>View All →</Link>
            </div>

            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>District</th>
                    <th>Crop</th>
                    <th>Detected Issue</th>
                    <th>Severity</th>
                    <th>AI Confidence</th>
                  </tr>
                </thead>

                <tbody>
                  {alerts.map((alert) => (
                    <tr key={`${alert.district}-${alert.issue}`}>
                      <td>{alert.district}</td>
                      <td>{alert.crop}</td>
                      <td>{alert.issue}</td>
                      <td>
                        <span
                          className={
                            alert.severity === "High"
                              ? styles.highBadge
                              : styles.mediumBadge
                          }
                        >
                          {alert.severity}
                        </span>
                      </td>
                      <td>
                        <strong>{alert.confidence}</strong>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>

          <article className={styles.card}>
            <div className={styles.cardHeader}>
              <div>
                <h2>Farms Needing Attention</h2>
                <p>Priority field confirmation</p>
              </div>
            </div>

            <div className={styles.farmList}>
              {farms.map((farm) => (
                <div className={styles.farmItem} key={farm.name}>
                  <div className={styles.farmIcon}>🌾</div>

                  <div className={styles.farmInfo}>
                    <strong>{farm.name}</strong>
                    <span>{farm.district}, Maharashtra</span>
                  </div>

                  <span
                    className={
                      farm.risk === "High"
                        ? styles.highBadge
                        : styles.mediumBadge
                    }
                  >
                    {farm.risk}
                  </span>
                </div>
              ))}
            </div>

            <Link href="/officer/farms" className={styles.secondaryButton}>Open Farm Monitoring →</Link>
          </article>
        </section>

        <section className={styles.bottomGrid}>
          <article className={styles.card}>
            <div className={styles.cardHeader}>
              <div>
                <h2>Crop-wise Analytics</h2>
                <p>Reported cases by monitored crop</p>
              </div>
            </div>

            <div className={styles.analytics}>
              <div className={styles.analyticsRow}>
                <span>Tomato</span>
                <div className={styles.progressTrack}>
                  <div className={`${styles.progressFill} ${styles.tomato}`}></div>
                </div>
                <strong>34%</strong>
              </div>

              <div className={styles.analyticsRow}>
                <span>Cotton</span>
                <div className={styles.progressTrack}>
                  <div className={`${styles.progressFill} ${styles.cotton}`}></div>
                </div>
                <strong>28%</strong>
              </div>

              <div className={styles.analyticsRow}>
                <span>Grapes</span>
                <div className={styles.progressTrack}>
                  <div className={`${styles.progressFill} ${styles.grapes}`}></div>
                </div>
                <strong>21%</strong>
              </div>

              <div className={styles.analyticsRow}>
                <span>Maize</span>
                <div className={styles.progressTrack}>
                  <div className={`${styles.progressFill} ${styles.maize}`}></div>
                </div>
                <strong>17%</strong>
              </div>
            </div>
          </article>

          <article className={styles.card}>
            <div className={styles.cardHeader}>
              <div>
                <h2>Expert Validation Queue</h2>
                <p>Cases awaiting expert review</p>
              </div>
              <span className={styles.countBadge}>18 Pending</span>
            </div>

            <div className={styles.reviewItem}>
              <span>🍅</span>
              <div>
                <strong>Tomato leaf disease</strong>
                <p>AI Confidence: 94%</p>
              </div>
              <Link href="/officer/expert-reviews" className={styles.reviewButton}>Review</Link>
            </div>

            <div className={styles.reviewItem}>
              <span>🍇</span>
              <div>
                <strong>Grape disease detection</strong>
                <p>Field Confirmation required</p>
              </div>
              <Link href="/officer/expert-reviews" className={styles.reviewButton}>Review</Link>
            </div>
          </article>
        </section>
      </section>
    </main>
  );
}
