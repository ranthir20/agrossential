import OfficerHeader from "@/components/officer/OfficerHeader";
import Link from "next/link";
import styles from "./reports.module.css";

export default function ReportsPage() {
  const reports = [
    {
      id: "REP-2026-104",
      title: "Maharashtra Crop Health Overview",
      type: "Regional Summary",
      period: "September 2026",
      generated: "Today, 10:30 AM",
      status: "Ready",
    },
    {
      id: "REP-2026-103",
      title: "High Risk Disease Hotspots",
      type: "Disease Surveillance",
      period: "Last 7 Days",
      generated: "Yesterday, 4:15 PM",
      status: "Ready",
    },
    {
      id: "REP-2026-102",
      title: "Pest Infestation Activity",
      type: "Pest Monitoring",
      period: "Last 30 Days",
      generated: "Sep 2, 2026",
      status: "Ready",
    },
    {
      id: "REP-2026-101",
      title: "Expert Validation Summary",
      type: "AI Validation",
      period: "August 2026",
      generated: "Sep 1, 2026",
      status: "Ready",
    },
  ];

  return (
    <main className={styles.page}>
      <OfficerHeader />

      <section className={styles.content}>
        <div className={styles.top}>
          <div>
            <p className={styles.eyebrow}>REPORTING & INTELLIGENCE</p>
            <h1>Reports</h1>
            <p className={styles.subtitle}>
              Generate and review crop health, disease, pest and field intelligence reports.
            </p>
          </div>

          <button className={styles.generateButton}>
            + Generate Report
          </button>
        </div>

        <section className={styles.quickReports}>
          <h2>Generate Quick Report</h2>
          <p>Create a report using the latest monitoring and AI detection data.</p>

          <div className={styles.reportOptions}>
            <button className={styles.optionCard}>
              <span className={styles.optionIcon}>🌾</span>
              <strong>Crop Health</strong>
              <small>Regional crop health summary</small>
              <span className={styles.arrow}>→</span>
            </button>

            <button className={styles.optionCard}>
              <span className={styles.optionIcon}>🦠</span>
              <strong>Disease Report</strong>
              <small>Disease trends and hotspots</small>
              <span className={styles.arrow}>→</span>
            </button>

            <button className={styles.optionCard}>
              <span className={styles.optionIcon}>🐛</span>
              <strong>Pest Report</strong>
              <small>Infestation activity analysis</small>
              <span className={styles.arrow}>→</span>
            </button>

            <button className={styles.optionCard}>
              <span className={styles.optionIcon}>🤖</span>
              <strong>AI Performance</strong>
              <small>Detection and validation accuracy</small>
              <span className={styles.arrow}>→</span>
            </button>
          </div>
        </section>

        <section className={styles.stats}>
          <article className={styles.statCard}>
            <span>📄</span>
            <p>REPORTS GENERATED</p>
            <h2>148</h2>
            <small>This month</small>
          </article>

          <article className={styles.statCard}>
            <span>📍</span>
            <p>ACTIVE DISTRICTS</p>
            <h2>36</h2>
            <small>Monitoring coverage</small>
          </article>

          <article className={styles.statCard}>
            <span>🔴</span>
            <p>HIGH RISK FINDINGS</p>
            <h2>52</h2>
            <small>Across latest reports</small>
          </article>

          <article className={styles.statCard}>
            <span>✓</span>
            <p>FIELD CONFIRMATIONS</p>
            <h2>734</h2>
            <small>Validated cases</small>
          </article>
        </section>

        <section className={styles.reportsCard}>
          <div className={styles.cardHeader}>
            <div>
              <h2>Recent Reports</h2>
              <p>Previously generated intelligence reports</p>
            </div>

            <div className={styles.actions}>
              <button>Filter</button>
              <button>Sort by Latest</button>
            </div>
          </div>

          <div className={styles.reportList}>
            {reports.map((report) => (
              <article className={styles.reportRow} key={report.id}>
                <div className={styles.fileIcon}>📄</div>

                <div className={styles.reportInfo}>
                  <span className={styles.reportId}>{report.id}</span>
                  <h3>{report.title}</h3>
                  <p>
                    {report.type} • {report.period}
                  </p>
                </div>

                <div className={styles.generated}>
                  <span>Generated</span>
                  <strong>{report.generated}</strong>
                </div>

                <span className={styles.readyBadge}>
                  ✓ {report.status}
                </span>

                <div className={styles.rowActions}>
                  <button className={styles.viewButton}>View</button>
                  <button className={styles.downloadButton}>Download ↓</button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
