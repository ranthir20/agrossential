"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import FarmerHeader from "@/components/farmer/FarmerHeader";

type Confirmation = {
  id: string;
  farm: string;
  crop: string;
  aiDiagnosis: string;
  aiConfidence: number;
  fieldDiagnosis: string;
  status: "Confirmed" | "Different" | "Still Unsure";
  notes: string;
  createdAt: string;
};

export default function ConfirmationPage() {
  const [scan, setScan] = useState<{
    farmName?: string;
    crop?: string;
    disease?: string;
    confidence?: number;
  } | null>(null);

  const [fieldDiagnosis, setFieldDiagnosis] = useState("");
  const [status, setStatus] =
    useState<Confirmation["status"]>("Confirmed");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [confirmations, setConfirmations] = useState<Confirmation[]>([]);

  useEffect(() => {
    const savedScan = localStorage.getItem("agrossential-current-scan");

    if (savedScan) {
      try {
        setScan(JSON.parse(savedScan));
      } catch {
        setScan(null);
      }
    }

    const savedConfirmations = localStorage.getItem(
      "agrossential-confirmations"
    );

    if (savedConfirmations) {
      try {
        setConfirmations(JSON.parse(savedConfirmations));
      } catch {
        setConfirmations([]);
      }
    }
  }, []);

  const aiDiagnosis = scan?.disease || "Cotton Leaf Curl Virus";
  const aiConfidence = scan?.confidence ?? 87;
  const crop = scan?.crop || "Cotton";
  const farm = scan?.farmName || "Main Farm";

  const submitConfirmation = () => {
    const confirmation: Confirmation = {
      id: `confirmation-${Date.now()}`,
      farm,
      crop,
      aiDiagnosis,
      aiConfidence,
      fieldDiagnosis:
        fieldDiagnosis.trim() || aiDiagnosis,
      status,
      notes: notes.trim(),
      createdAt: new Date().toLocaleString(),
    };

    const updated = [confirmation, ...confirmations];

    setConfirmations(updated);

    localStorage.setItem(
      "agrossential-confirmations",
      JSON.stringify(updated)
    );

    setSubmitted(true);
  };

  return (
    <main className="min-h-screen w-full max-w-full overflow-x-hidden w-full overflow-x-hidden bg-gray-50">
      <FarmerHeader />

      <div className="w-full max-w-none px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/farmer/results"
            className="text-sm font-semibold text-green-700 hover:text-green-800"
          >
            ← Back to Scan Result
          </Link>

          <div className="mt-4">
            <h1 className="text-2xl font-bold text-gray-900">
              🌱 Field Confirmation
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Tell agrossential what you observed in the field after the AI
              prediction.
            </p>
          </div>
        </div>

        {/* AI prediction */}
        <section className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-green-700">
            AI Prediction
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-xs text-gray-500">Farm</p>
              <p className="mt-1 font-bold text-gray-900">{farm}</p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-xs text-gray-500">Crop</p>
              <p className="mt-1 font-bold text-gray-900">{crop}</p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-xs text-gray-500">AI Confidence</p>
              <p className="mt-1 font-bold text-green-700">
                {aiConfidence}%
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-xl bg-green-50 p-4">
            <p className="text-xs font-semibold text-green-700">
              Detected issue
            </p>

            <p className="mt-1 text-lg font-bold text-green-950">
              {aiDiagnosis}
            </p>
          </div>
        </section>

        {/* Confirmation form */}
        {!submitted ? (
          <section className="mt-6 rounded-2xl border bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900">
              What did you observe?
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Your field confirmation helps validate future predictions.
            </p>

            <div className="mt-5">
              <label className="text-sm font-semibold text-gray-700">
                Field observation
              </label>

              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as Confirmation["status"])
                }
                className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-green-600"
              >
                <option value="Confirmed">
                  AI diagnosis looks correct
                </option>
                <option value="Different">
                  Field observation is different
                </option>
                <option value="Still Unsure">
                  Still unsure / needs expert confirmation
                </option>
              </select>
            </div>

            <div className="mt-5">
              <label className="text-sm font-semibold text-gray-700">
                What did you observe in the field?
              </label>

              <input
                value={fieldDiagnosis}
                onChange={(e) => setFieldDiagnosis(e.target.value)}
                placeholder="Example: Whiteflies were visible on several plants."
                className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-green-600"
              />
            </div>

            <div className="mt-5">
              <label className="text-sm font-semibold text-gray-700">
                Additional notes
              </label>

              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any useful field observations..."
                rows={4}
                className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm outline-none focus:border-green-600"
              />
            </div>

            <div className="mt-5 rounded-xl bg-blue-50 p-4">
              <p className="text-sm font-semibold text-blue-900">
                Why this matters
              </p>

              <p className="mt-1 text-xs leading-5 text-blue-800">
                Confirmed field observations can later be used by the
                agrossential team to improve disease and pest detection models.
              </p>
            </div>

            <button
              onClick={submitConfirmation}
              className="mt-5 w-full rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white hover:bg-green-800 sm:w-auto"
            >
              Submit Field Confirmation
            </button>
          </section>
        ) : (
          <section className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-6">
            <div className="text-3xl">✅</div>

            <h2 className="mt-3 text-xl font-bold text-green-950">
              Field confirmation submitted
            </h2>

            <p className="mt-2 text-sm leading-6 text-green-800">
              Thank you. Your observation has been recorded and can be used
              for validation and future model improvement.
            </p>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/farmer/history"
                className="rounded-xl bg-green-700 px-5 py-3 text-center text-sm font-semibold text-white hover:bg-green-800"
              >
                View Scan History
              </Link>

              <Link
                href="/farmer/scan"
                className="rounded-xl border border-green-200 bg-white px-5 py-3 text-center text-sm font-semibold text-green-800 hover:bg-green-50"
              >
                New Crop Scan
              </Link>
            </div>
          </section>
        )}

        {/* Previous confirmations */}
        <section className="mt-6">
          <h2 className="text-lg font-bold text-gray-900">
            Previous Confirmations
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Your field observations from previous scans.
          </p>

          {confirmations.length === 0 ? (
            <div className="mt-4 rounded-2xl border bg-white p-6 text-sm text-gray-500">
              No field confirmations yet.
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              {confirmations.map((item) => (
                <article
                  key={item.id}
                  className="rounded-2xl border bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900">
                        {item.crop} — {item.aiDiagnosis}
                      </h3>

                      <p className="mt-1 text-xs text-gray-500">
                        {item.farm} · AI confidence {item.aiConfidence}% ·{" "}
                        {item.createdAt}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        item.status === "Confirmed"
                          ? "bg-green-100 text-green-700"
                          : item.status === "Different"
                            ? "bg-red-100 text-red-700"
                            : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <div className="mt-4 rounded-xl bg-gray-50 p-4">
                    <p className="text-xs font-semibold text-gray-500">
                      Field observation
                    </p>

                    <p className="mt-1 text-sm text-gray-700">
                      {item.fieldDiagnosis}
                    </p>

                    {item.notes && (
                      <p className="mt-2 text-xs text-gray-500">
                        Notes: {item.notes}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
