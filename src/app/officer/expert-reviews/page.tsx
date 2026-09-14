"use client";

import OfficerHeader from "@/components/officer/OfficerHeader";
import { useEffect, useMemo, useState } from "react";
import styles from "./expert-reviews.module.css";

type Report = {
  id: string;
  cropId: string;
  imageUrl: string | null;
  predictedDisease: string;
  confidence: number | null;
  status: "PENDING" | "CONFIRMED" | "REJECTED";
  createdAt: string;
  Crop: {
    crop: string;
    variety: string | null;
    growthStage: string | null;
    Farm: {
      farmName: string;
      village: string | null;
      district: string | null;
      state: string | null;
      farmerId: string;
    };
  };
  ExpertValidation: {
    decision: string;
    finalDisease: string | null;
    comments: string | null;
  } | null;
};

type Filter =
  | "All Reviews"
  | "Pending"
  | "Confirmed"
  | "Rejected";

  type ExpertReviewRequest = {
    id: string;
    reportId: string;
    farmerId: string;
    question: string;
    response: string | null;
    expertId: string | null;
    status: "PENDING" | "IN_REVIEW" | "COMPLETED";
    createdAt: string;
    Farmer: {
      name: string;
    };
    Expert: {
      name: string;
    } | null;
    DiseaseReport: {
      imageUrl: string | null;
      predictedDisease: string;
      confidence: number | null;
      Crop: {
        crop: string;
        variety: string | null;
        growthStage: string | null;
        Farm: {
          farmName: string;
          village: string | null;
          district: string | null;
          state: string | null;
        };
      };
    };
  };

export default function ExpertReviewsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [reviewRequests, setReviewRequests] =
  useState<ExpertReviewRequest[]>([]);
  const [selectedRequest, setSelectedRequest] =
  useState<ExpertReviewRequest | null>(null);

const [expertResponse, setExpertResponse] =
  useState("");
  const [selectedFilter, setSelectedFilter] =
    useState<Filter>("All Reviews");
  const [selectedReport, setSelectedReport] =
    useState<Report | null>(null);
  const [modalMode, setModalMode] =
    useState<"view" | "review">("view");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const loadReports = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/disease-reports"
      );

      if (!response.ok) {
        throw new Error("Failed to load disease reports");
      }

      const data = await response.json();
      setReports(data);
    } catch (err) {
      console.error(err);
      setError("Unable to load disease reports.");
    } finally {
      setLoading(false);
    }
  };
  const loadReviewRequests = async () => {
    try {
      const response = await fetch(
        "/api/expert-review-requests",
        { cache: "no-store" }
      );
  
      if (!response.ok) {
        throw new Error("Failed to load expert review requests");
      }
  
      const data = await response.json();
      setReviewRequests(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadReports();
    loadReviewRequests();
  }, []);

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      if (selectedFilter === "Pending") {
        return report.status === "PENDING";
      }

      if (selectedFilter === "Confirmed") {
        return report.status === "CONFIRMED";
      }

      if (selectedFilter === "Rejected") {
        return report.status === "REJECTED";
      }

      return true;
    });
  }, [reports, selectedFilter]);

  const pendingCount = reports.filter(
    (report) => report.status === "PENDING"
  ).length;

  const confirmedCount = reports.filter(
    (report) => report.status === "CONFIRMED"
  ).length;

  const rejectedCount = reports.filter(
    (report) => report.status === "REJECTED"
  ).length;

  const getConfidence = (confidence: number | null) => {
    if (confidence === null) return "—";
    return `${Math.round(confidence * 100)}%`;
  };

  const getSeverity = (confidence: number | null) => {
    if (confidence === null) return "Medium";
    if (confidence >= 0.9) return "High";
    return "Medium";
  };

  const getFarmerName = (farmerId: string) => {
    return farmerId === "test-farmer"
      ? "Test Farmer"
      : farmerId;
  };

  const getLocation = (report: Report) => {
    return (
      [
        report.Crop.Farm.district,
        report.Crop.Farm.state,
      ]
        .filter(Boolean)
        .join(", ") || "Location unavailable"
    );
  };

  const openCase = (
    report: Report,
    mode: "view" | "review"
  ) => {
    setSelectedReport(report);
    setModalMode(mode);
    setError("");
  };

  const submitValidation = async (
    decision: "CONFIRMED" | "REJECTED" | "UNCERTAIN"
  ) => {
    if (!selectedReport) return;

    try {
      setSubmitting(true);
      setError("");

      const finalDisease =
        decision === "CONFIRMED"
          ? selectedReport.predictedDisease
          : decision === "REJECTED"
            ? window.prompt(
                "Enter the disease/pest identified by the expert:"
              ) || "Different finding"
            : null;

      const comments =
        window.prompt(
          "Add expert comments (optional):"
        ) || null;

      const response = await fetch(
        "/api/expert-validations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reportId: selectedReport.id,
            expertId: "test-expert",
            finalDisease,
            decision,
            comments,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Validation failed"
        );
      }

      setSelectedReport(null);
      await loadReports();
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to submit expert validation."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className={styles.page}>
      <OfficerHeader />

      <section className={styles.content}>
        <div className={styles.top}>
          <div>
            <p className={styles.eyebrow}>
              EXPERT VALIDATION CENTER
            </p>

            <h1>Expert Reviews</h1>

            <p className={styles.subtitle}>
              Validate AI detections and confirm disease or pest
              cases reported from the field.
            </p>
          </div>
        </div>

        <div className={styles.filters}>
          <span className={styles.filterLabel}>
            Filter:
          </span>

          {[
            "All Reviews",
            "Pending",
            "Confirmed",
            "Rejected",
          ].map((filter) => (
            <button
              key={filter}
              className={
                selectedFilter === filter
                  ? styles.selected
                  : ""
              }
              onClick={() =>
                setSelectedFilter(filter as Filter)
              }
            >
              {filter}
            </button>
          ))}
        </div>

        {error && (
          <p
            style={{
              color: "#b91c1c",
              marginBottom: "16px",
              fontWeight: 600,
            }}
          >
            {error}
          </p>
        )}

        <div className={styles.stats}>
          <div className={styles.statCard}>
            <span className={styles.icon}>🤖</span>
            <p>AI DETECTIONS</p>
            <h2>{reports.length}</h2>
            <small>Cases in the system</small>
          </div>

          <div className={styles.statCard}>
            <span className={styles.icon}>⏳</span>
            <p>PENDING REVIEW</p>
            <h2>{pendingCount}</h2>
            <small>Requires expert attention</small>
          </div>

          <div className={styles.statCard}>
            <span className={styles.icon}>✓</span>
            <p>CONFIRMED</p>
            <h2>{confirmedCount}</h2>
            <small>Expert validated</small>
          </div>

          <div className={styles.statCard}>
            <span className={styles.icon}>✕</span>
            <p>REJECTED</p>
            <h2>{rejectedCount}</h2>
            <small>Different finding reported</small>
          </div>
        </div>

        <div className={styles.mainGrid}>
          <section className={styles.reviewCard}>
            <div className={styles.cardHeader}>
              <div>
                <h3>Cases Awaiting Validation</h3>
                <p>
                  AI-detected crop health cases from the database
                </p>
              </div>

              <span className={styles.countBadge}>
                {filteredReports.length} CASES
              </span>
            </div>

            <div className={styles.caseList}>
              {loading ? (
                <p className={styles.noCases}>
                  Loading disease reports...
                </p>
              ) : (
                <>
                  {filteredReports.map((report) => {
                    const severity = getSeverity(
                      report.confidence
                    );

                    return (
                      <article
                        className={styles.caseItem}
                        key={report.id}
                      >
                        <div className={styles.caseTop}>
                          <div>
                            <span
                              className={styles.caseId}
                            >
                              {report.id.slice(0, 8).toUpperCase()}
                            </span>

                            <h4>
                              {report.predictedDisease}
                            </h4>

                            <p>
                              {report.Crop.crop} •{" "}
                              {getLocation(report)}
                            </p>
                          </div>

                          <span
                            className={
                              severity === "High"
                                ? styles.highBadge
                                : styles.mediumBadge
                            }
                          >
                            {severity}
                          </span>
                        </div>

                        <div className={styles.caseInfo}>
                          <div>
                            <span>Farmer</span>
                            <strong>
                              {getFarmerName(
                                report.Crop.Farm.farmerId
                              )}
                            </strong>
                          </div>

                          <div>
                            <span>AI Confidence</span>

                            <strong
                              className={
                                styles.confidence
                              }
                            >
                              {getConfidence(
                                report.confidence
                              )}
                            </strong>
                          </div>

                          <div>
                            <span>Status</span>
                            <strong>
                              {report.status ===
                              "PENDING"
                                ? "Pending Review"
                                : report.status}
                            </strong>
                          </div>
                        </div>

                        <div className={styles.actions}>
                          <button
                            className={styles.viewButton}
                            onClick={() =>
                              openCase(
                                report,
                                "view"
                              )
                            }
                          >
                            View Case
                          </button>

                          {report.status ===
                            "PENDING" && (
                            <button
                              className={
                                styles.reviewButton
                              }
                              onClick={() =>
                                openCase(
                                  report,
                                  "review"
                                )
                              }
                            >
                              Start Review →
                            </button>
                          )}
                        </div>
                      </article>
                    );
                  })}

                  {filteredReports.length === 0 && (
                    <p className={styles.noCases}>
                      No cases found for this filter.
                    </p>
                  )}
                </>
              )}
            </div>
          </section>
          <section className={styles.sideCard}>
  <h3>Farmer Review Requests</h3>

  <p className={styles.sideSubtitle}>
    Questions submitted by farmers
  </p>

  {reviewRequests.length === 0 ? (
    <p className={styles.noCases}>
      No farmer questions yet.
    </p>
  ) : (
    <div>
      {reviewRequests
        .filter(
          (request) =>
            request.status === "PENDING" ||
            request.expertId === "test-expert"
        )
        .map((request) => (
          <article
            key={request.id}
            className={styles.queueItem}
          >
            <div>
              <strong>{request.Farmer.name}</strong>

              <span>
                {request.DiseaseReport.predictedDisease}
              </span>

              <span>
                “{request.question}”
              </span>
              <span
  style={{
    color:
      request.status === "PENDING"
        ? "#b45309"
        : "#237044",
    fontWeight: 700,
  }}
>
  {request.status === "PENDING"
    ? "Pending Review"
    : request.status === "IN_REVIEW"
      ? "In Review"
      : "Completed"}
</span>
            </div>

            <button
  className={styles.reviewButton}
  onClick={() => {
    setSelectedRequest(request);
    setExpertResponse(request.response ?? "");
  }}
>
  Review →
</button>
          </article>
        ))}
    </div>
  )}
</section>
{selectedRequest && (
  <div className={styles.modalOverlay}>
    <div className={styles.modal}>
      <h2>Farmer Review Request</h2>

      <p>
        <strong>Farmer:</strong>{" "}
        {selectedRequest.Farmer.name}
      </p>

      <p>
        <strong>Disease:</strong>{" "}
        {selectedRequest.DiseaseReport.predictedDisease}
      </p>

      <p>
        <strong>Question:</strong>{" "}
        {selectedRequest.question}
      </p>

      <textarea
  value={expertResponse}
  onChange={(e) =>
    setExpertResponse(e.target.value)
  }
  className="w-full resize-none rounded-xl border border-slate-300 bg-white p-4 text-sm text-black outline-none transition placeholder:text-slate-400 focus:border-green-500 focus:ring-2 focus:ring-green-100"
  placeholder="Enter your advice for the farmer..."
  rows={6}
/>

      <div className={styles.modalActions}>
        <button
          onClick={() => setSelectedRequest(null)}
        >
          Cancel
        </button>

        <button
          onClick={async () => {
            if (!selectedRequest || !expertResponse.trim()) {
              return;
            }
          
            try {
              const response = await fetch(
                `/api/expert-review-requests/${selectedRequest.id}`,
                {
                  method: "PATCH",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    expertId: "test-expert",
                    response: expertResponse.trim(),
                    status: "COMPLETED",
                  }),
                }
              );
          
              if (!response.ok) {
                throw new Error("Failed to send expert response");
              }
          
              await loadReviewRequests();
          
              setSelectedRequest(null);
              setExpertResponse("");
            } catch (error) {
              console.error(error);
              alert("Failed to send response");
            }
          }}
        >
          Send Response
        </button>
      </div>
    </div>
  </div>
)}
          <aside className={styles.sideColumn}>
            <section className={styles.sideCard}>
              <h3>Review Queue</h3>

              <p className={styles.sideSubtitle}>
                Current expert validation workload
              </p>

              <div className={styles.queueItem}>
                <div>
                  <strong>High Priority</strong>
                  <span>
                    Immediate validation needed
                  </span>
                </div>

                <b className={styles.redNumber}>
                  {
                    reports.filter(
                      (report) =>
                        report.status === "PENDING" &&
                        getSeverity(
                          report.confidence
                        ) === "High"
                    ).length
                  }
                </b>
              </div>

              <div className={styles.queueItem}>
                <div>
                  <strong>Pending</strong>
                  <span>Waiting for expert review</span>
                </div>

                <b className={styles.orangeNumber}>
                  {pendingCount}
                </b>
              </div>

              <div className={styles.queueItem}>
                <div>
                  <strong>Confirmed</strong>
                  <span>Validated cases</span>
                </div>

                <b className={styles.blueNumber}>
                  {confirmedCount}
                </b>
              </div>
            </section>

            <section className={styles.sideCard}>
              <h3>Expert Performance</h3>

              <p className={styles.sideSubtitle}>
                Current database summary
              </p>

              <div className={styles.performance}>
                <div
                  className={styles.performanceRow}
                >
                  <span>Cases Reviewed</span>
                  <strong>
                    {confirmedCount +
                      rejectedCount}
                  </strong>
                </div>

                <div
                  className={styles.performanceRow}
                >
                  <span>Pending Cases</span>
                  <strong>{pendingCount}</strong>
                </div>

                <div
                  className={styles.performanceRow}
                >
                  <span>AI Confidence</span>
                  <strong
                    className={styles.greenText}
                  >
                    {reports.length
                      ? `${Math.round(
                          (reports.reduce(
                            (sum, report) =>
                              sum +
                              (report.confidence ??
                                0),
                            0
                          ) /
                            reports.length) *
                            100
                        )}%`
                      : "—"}
                  </strong>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </section>

      {selectedReport && (
        <div
          className={styles.modalOverlay}
          onClick={() =>
            !submitting && setSelectedReport(null)
          }
        >
          <div
            className={styles.modal}
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <button
              className={styles.closeButton}
              onClick={() =>
                !submitting &&
                setSelectedReport(null)
              }
            >
              ×
            </button>

            <p className={styles.modalId}>
              {selectedReport.id}
            </p>

            <h2>
              {selectedReport.predictedDisease}
            </h2>

            <p className={styles.modalSubtitle}>
              AI detection submitted for Agricultural
              Expert validation
            </p>

            <div className={styles.modalGrid}>
              <div>
                <span>Farmer</span>
                <strong>
                  {getFarmerName(
                    selectedReport.Crop.Farm.farmerId
                  )}
                </strong>
              </div>

              <div>
                <span>Location</span>
                <strong>
                  {getLocation(selectedReport)}
                </strong>
              </div>

              <div>
                <span>Crop</span>
                <strong>
                  {selectedReport.Crop.crop}
                </strong>
              </div>

              <div>
                <span>AI Confidence</span>
                <strong>
                  {getConfidence(
                    selectedReport.confidence
                  )}
                </strong>
              </div>

              <div>
                <span>Variety</span>
                <strong>
                  {selectedReport.Crop.variety ||
                    "—"}
                </strong>
              </div>

              <div>
                <span>Current Status</span>
                <strong>
                  {selectedReport.status}
                </strong>
              </div>
            </div>

            {modalMode === "view" &&
              selectedReport.status ===
                "PENDING" && (
                <div className={styles.modalActions}>
                  <button
                    className={
                      styles.startReviewButton
                    }
                    onClick={() =>
                      setModalMode("review")
                    }
                  >
                    Start Expert Review →
                  </button>
                </div>
              )}

            {modalMode === "review" &&
              selectedReport.status ===
                "PENDING" && (
                <div
                  className={
                    styles.reviewWorkflow
                  }
                >
                  <h3>Expert Decision</h3>

                  <p>
                    Review the AI detection and choose
                    the appropriate validation result.
                  </p>

                  <div
                    className={
                      styles.decisionButtons
                    }
                  >
                    <button
                      className={
                        styles.confirmButton
                      }
                      disabled={submitting}
                      onClick={() =>
                        submitValidation(
                          "CONFIRMED"
                        )
                      }
                    >
                      ✓ Confirm Disease
                    </button>

                    <button
                      className={
                        styles.rejectButton
                      }
                      disabled={submitting}
                      onClick={() =>
                        submitValidation(
                          "REJECTED"
                        )
                      }
                    >
                      ✕ Reject Detection
                    </button>

                    <button
                      className={
                        styles.fieldButton
                      }
                      disabled={submitting}
                      onClick={() =>
                        submitValidation(
                          "UNCERTAIN"
                        )
                      }
                    >
                      📍 Request Field Check
                    </button>
                  </div>
                </div>
              )}

            {selectedReport.status !==
              "PENDING" && (
              <p
                style={{
                  marginTop: "24px",
                  fontWeight: 700,
                  color: "#237044",
                }}
              >
                This case has already been
                {selectedReport.status ===
                "CONFIRMED"
                  ? " confirmed by an Agricultural Expert."
                  : " rejected by an Agricultural Expert."}
              </p>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
 