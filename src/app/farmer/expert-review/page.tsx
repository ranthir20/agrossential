"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import FarmerHeader from "@/components/farmer/FarmerHeader";

type Review = {
  id: string;
  farm: string;
  crop: string;
  disease: string;
  confidence: number;
  question: string;
  status: "Pending" | "In Review" | "Completed";
  expert?: string;
  advice?: string;
  createdAt: string;
};

const demoReviews: Review[] = [
  {
    id: "review-demo-1",
    farm: "Main Farm",
    crop: "Cotton",
    disease: "Cotton Leaf Curl Virus",
    confidence: 87,
    question:
      "Please confirm whether the symptoms shown in my crop scan require further treatment.",
    status: "Completed",
    expert: "Agriculture Expert",
    advice:
      "Continue monitoring affected plants and remove severely affected plants where appropriate. Avoid unnecessary chemical application and follow local agricultural guidance.",
    createdAt: "Yesterday",
  },
];

export default function ExpertReviewPage() {
  const [reviews, setReviews] = useState<Review[]>(demoReviews);
  const [showForm, setShowForm] = useState(false);
  const [question, setQuestion] = useState("");
  const [scan, setScan] = useState<{
    farmName?: string;
    crop?: string;
    disease?: string;
    confidence?: number;
  } | null>(null);

  useEffect(() => {
    const savedScan = localStorage.getItem("agrossential-current-scan");

    if (savedScan) {
      try {
        setScan(JSON.parse(savedScan));
      } catch {
        setScan(null);
      }
    }

    const savedReviews = localStorage.getItem("agrossential-expert-reviews");

    if (savedReviews) {
      try {
        setReviews(JSON.parse(savedReviews));
      } catch {
        setReviews(demoReviews);
      }
    }
  }, []);

  const submitReview = () => {
    if (!question.trim()) return;

    const newReview: Review = {
      id: `review-${Date.now()}`,
      farm: scan?.farmName || "Main Farm",
      crop: scan?.crop || "Cotton",
      disease: scan?.disease || "Crop health issue",
      confidence: scan?.confidence ?? 87,
      question: question.trim(),
      status: "Pending",
      createdAt: "Just now",
    };

    const updatedReviews = [newReview, ...reviews];

    setReviews(updatedReviews);
    localStorage.setItem(
      "agrossential-expert-reviews",
      JSON.stringify(updatedReviews)
    );

    setQuestion("");
    setShowForm(false);
  };

  const statusStyle = (status: Review["status"]) => {
    if (status === "Completed") {
      return "bg-green-100 text-green-700";
    }

    if (status === "In Review") {
      return "bg-blue-100 text-blue-700";
    }

    return "bg-orange-100 text-orange-700";
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <FarmerHeader />

      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/farmer/results"
            className="text-sm font-semibold text-green-700 hover:text-green-800"
          >
            ← Back to Scan Result
          </Link>

          <div className="mt-4">
            <h1 className="text-2xl font-bold text-gray-900">
              👨‍🌾 Expert Review
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Get an expert opinion when the AI result needs confirmation.
            </p>
          </div>
        </div>

        {/* Current scan */}
        <section className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-green-700">
                Current Scan
              </p>

              <h2 className="mt-1 text-xl font-bold text-gray-900">
                {scan?.crop || "Cotton"} —{" "}
                {scan?.disease || "Cotton Leaf Curl Virus"}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {scan?.farmName || "Main Farm"} · AI confidence{" "}
                {scan?.confidence ?? 87}%
              </p>
            </div>

            <button
              onClick={() => setShowForm(!showForm)}
              className="rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white hover:bg-green-800"
            >
              {showForm ? "Close Request" : "Ask an Expert"}
            </button>
          </div>

          {showForm && (
            <div className="mt-5 border-t pt-5">
              <label className="text-sm font-semibold text-gray-700">
                What would you like the expert to check?
              </label>

              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Example: Are these symptoms consistent with the detected disease? What should I monitor next?"
                rows={4}
                className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm outline-none focus:border-green-600"
              />

              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <button
                  onClick={submitReview}
                  disabled={!question.trim()}
                  className="rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Submit for Review
                </button>

                <Link
                  href="/farmer/scan"
                  className="rounded-xl border px-5 py-3 text-center text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Upload Better Image
                </Link>
              </div>

              <p className="mt-3 text-xs text-gray-500">
                Expert review helps validate uncertain AI results. Do not use
                an AI result alone to make high-risk treatment decisions.
              </p>
            </div>
          )}
        </section>

        {/* How it works */}
        <section className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border bg-white p-5">
            <div className="text-2xl">📷</div>
            <h3 className="mt-3 font-bold text-gray-900">
              1. Submit scan
            </h3>
            <p className="mt-1 text-sm leading-6 text-gray-500">
              Send the crop scan and your question to an agriculture expert.
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-5">
            <div className="text-2xl">🔎</div>
            <h3 className="mt-3 font-bold text-gray-900">
              2. Expert validates
            </h3>
            <p className="mt-1 text-sm leading-6 text-gray-500">
              The expert reviews the symptoms and provides a validated
              assessment.
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-5">
            <div className="text-2xl">🌱</div>
            <h3 className="mt-3 font-bold text-gray-900">
              3. Farmer follows up
            </h3>
            <p className="mt-1 text-sm leading-6 text-gray-500">
              Use the expert advice for monitoring and follow-up actions.
            </p>
          </div>
        </section>

        {/* Review history */}
        <section className="mt-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                My Expert Reviews
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Track submitted questions and expert responses.
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-4">
            {reviews.map((review) => (
              <article
                key={review.id}
                className="rounded-2xl border bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-gray-900">
                        {review.crop} — {review.disease}
                      </h3>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle(
                          review.status
                        )}`}
                      >
                        {review.status}
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-gray-500">
                      {review.farm} · AI confidence {review.confidence}% ·{" "}
                      {review.createdAt}
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-xl bg-gray-50 p-4">
                  <p className="text-xs font-semibold text-gray-500">
                    Your question
                  </p>
                  <p className="mt-1 text-sm leading-6 text-gray-700">
                    {review.question}
                  </p>
                </div>

                {review.status === "Completed" && review.advice && (
                  <div className="mt-3 rounded-xl bg-green-50 p-4">
                    <p className="text-xs font-semibold text-green-700">
                      Expert response
                    </p>
                    <p className="mt-1 text-sm leading-6 text-green-900">
                      {review.advice}
                    </p>
                    <p className="mt-2 text-xs font-semibold text-green-700">
                      Reviewed by {review.expert || "Agriculture Expert"}
                    </p>
                  </div>
                )}

                {review.status !== "Completed" && (
                  <p className="mt-3 text-xs text-gray-500">
                    Your request is waiting for expert validation.
                  </p>
                )}
              </article>
            ))}
          </div>
        </section>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/farmer/confirmation"
            className="rounded-xl bg-green-700 px-5 py-3 text-center text-sm font-semibold text-white hover:bg-green-800"
          >
            Field Confirmation
          </Link>

          <Link
            href="/farmer/history"
            className="rounded-xl border bg-white px-5 py-3 text-center text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            View Scan History
          </Link>
        </div>
      </div>
    </main>
  );
}
