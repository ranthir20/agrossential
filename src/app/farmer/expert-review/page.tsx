"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import FarmerHeader from "@/components/farmer/FarmerHeader";

const DEMO_FARMER_ID = "test-farmer";

type ReviewRequest = {
  id: string;
  reportId: string;
  farmerId: string;
  expertId: string | null;
  question: string;
  response: string | null;
  status: "PENDING" | "IN_REVIEW" | "COMPLETED";
  createdAt: string;
  Expert: {
    name: string;
  } | null;
  DiseaseReport: {
    predictedDisease: string;
    confidence: number | null;
    Crop: {
      crop: string;
      Farm: {
        farmName: string;
        district: string | null;
        state: string | null;
      };
    };
  };
};

export default function ExpertReviewPage() {
  const [reportId, setReportId] =
    useState("");

  const [question, setQuestion] =
    useState("");

  const [requests, setRequests] =
    useState<ReviewRequest[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `/api/expert-review-requests?farmerId=${DEMO_FARMER_ID}`,
        {
          cache: "no-store",
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to load expert reviews"
        );
      }

      setRequests(data);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load expert reviews."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const currentScan = localStorage.getItem(
      "agrossential-current-scan"
    );

    if (currentScan) {
      try {
        const parsed = JSON.parse(currentScan);

        if (parsed?.reportId) {
          setReportId(parsed.reportId);
        } else {
          setReportId("");
          setError(
            "No database disease report is linked to this scan. Please run a new My Farm scan first."
          );
        }
      } catch {
        setReportId("");
      }
    }

    loadRequests();
  }, []);

  const submitQuestion = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!reportId) {
      setError(
        "Please open a disease scan before asking an Agricultural Expert."
      );
      return;
    }

    if (!question.trim()) {
      setError(
        "Please enter your question."
      );
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const response = await fetch(
        "/api/expert-review-requests",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            reportId,
            farmerId:
              DEMO_FARMER_ID,
            question:
              question.trim(),
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to submit question"
        );
      }

      setQuestion("");

      await loadRequests();
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to submit question."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-slate-50">
      <FarmerHeader />

      <main className="w-full max-w-none px-6 py-10">
        <div className="mb-8">
          <p className="text-sm font-bold tracking-wide text-green-700">
            AGRICULTURAL EXPERT SUPPORT
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Expert Review
          </h1>

          <p className="mt-2 max-w-2xl text-slate-600">
            Ask an Agricultural Expert about
            your crop disease detection and
            receive field-ready guidance.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900">
                Ask an Agricultural Expert
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Your question will be linked to
                the current disease scan.
              </p>
            </div>

            <div className="mb-5 rounded-xl bg-green-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-green-700">
                Current Scan
              </p>

              <p className="mt-1 break-all text-sm font-semibold text-slate-800">
                {reportId ||
                  "No scan selected"}
              </p>
            </div>

            <form
              onSubmit={submitQuestion}
            >
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Your Question
              </label>

              <textarea
  value={question}
  onChange={(e) =>
    setQuestion(e.target.value)
  }
  className="w-full resize-none rounded-xl border border-slate-300 bg-white p-4 text-sm text-black outline-none transition placeholder:text-slate-400 focus:border-green-500 focus:ring-2 focus:ring-green-100"
  rows={6}
  placeholder="Example: What treatment should I use for this disease, and how can I prevent it from spreading?"
/>

              <button
                type="submit"
                disabled={submitting}
                className="mt-4 rounded-xl bg-green-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting
                  ? "Submitting..."
                  : "Ask Agricultural Expert →"}
              </button>
            </form>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">
              How It Works
            </h2>

            <div className="mt-5 space-y-5">
              <div>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700">
                  1
                </span>

                <h3 className="mt-2 font-semibold text-slate-800">
                  Submit Question
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Ask about your crop disease
                  or treatment.
                </p>
              </div>

              <div>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700">
                  2
                </span>

                <h3 className="mt-2 font-semibold text-slate-800">
                  Expert Reviews
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  An Agricultural Expert
                  reviews your question and
                  scan.
                </p>
              </div>

              <div>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700">
                  3
                </span>

                <h3 className="mt-2 font-semibold text-slate-800">
                  Receive Guidance
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  View the expert's response
                  directly here.
                </p>
              </div>
            </div>
          </section>
        </div>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                My Expert Reviews
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Track questions submitted to
                Agricultural Experts.
              </p>
            </div>

            <button
              onClick={loadRequests}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Refresh
            </button>
          </div>

          <div className="mt-6 space-y-4">
            {loading ? (
              <p className="text-sm text-slate-500">
                Loading expert reviews...
              </p>
            ) : requests.length ===
              0 ? (
              <div className="rounded-xl bg-slate-50 p-6 text-center">
                <p className="font-semibold text-slate-700">
                  No expert reviews yet.
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Submit a question above to
                  contact an Agricultural Expert.
                </p>
              </div>
            ) : (
              requests.map(
                (request) => (
                  <article
                    key={request.id}
                    className="rounded-xl border border-slate-200 p-5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                          {
                            request
                              .DiseaseReport
                              .Crop
                              .crop
                          }
                        </p>

                        <h3 className="mt-1 font-bold text-slate-900">
                          {
                            request
                              .DiseaseReport
                              .predictedDisease
                          }
                        </h3>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          request.status ===
                          "COMPLETED"
                            ? "bg-green-100 text-green-700"
                            : request.status ===
                                "IN_REVIEW"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {
                          request.status
                        }
                      </span>
                    </div>

                    <div className="mt-4 rounded-xl bg-slate-50 p-4">
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                        Your Question
                      </p>

                      <p className="mt-2 text-sm leading-6 text-slate-700">
                        {
                          request.question
                        }
                      </p>
                    </div>

                    {request.response && (
                      <div className="mt-4 rounded-xl bg-green-50 p-4">
                        <p className="text-xs font-bold uppercase tracking-wide text-green-700">
                          Agricultural Expert
                          Response
                        </p>

                        <p className="mt-2 text-sm leading-6 text-green-900">
                          {
                            request.response
                          }
                        </p>

                        {request.Expert && (
                          <p className="mt-3 text-xs font-semibold text-green-700">
                            Reviewed by{" "}
                            {
                              request
                                .Expert
                                .name
                            }
                          </p>
                        )}
                      </div>
                    )}

                    <p className="mt-4 text-xs text-slate-400">
                      Submitted{" "}
                      {new Date(
                        request.createdAt
                      ).toLocaleString()}
                    </p>
                  </article>
                )
              )
            )}
          </div>
        </section>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/farmer/results"
            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            ← Back to Results
          </Link>

          <Link
            href="/farmer/confirmation"
            className="rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white hover:bg-green-800"
          >
            Field Confirmation
          </Link>

          <Link
            href="/farmer/history"
            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            View Scan History
          </Link>
        </div>
      </main>
    </div>
  );
}