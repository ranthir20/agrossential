"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import FarmerHeader from "@/components/farmer/FarmerHeader";

type ScanData = {
  id: string;
  farmId: string;
  farmName: string;
  crop: string;
  variety: string;
  image: string;
  fileName: string;
  notes: string;
  date: string;
  confidence?: number;
  disease?: string;
  severity?: string;
};

export default function ResultsPage() {
  const [scan, setScan] = useState<ScanData | null>(null);

  useEffect(() => {
    const savedScan = localStorage.getItem("agrossential-current-scan");

    if (savedScan) {
      const parsed = JSON.parse(savedScan);

      setScan({
        ...parsed,
        confidence: parsed.confidence ?? 87,
        disease: parsed.disease ?? "Cotton Leaf Curl Virus",
        severity: parsed.severity ?? "Moderate",
      });
    }
  }, []);

  if (!scan) {
    return (
      <main className="min-h-screen bg-gray-50">
        <FarmerHeader />

        <div className="px-4 py-12 text-center">
          <div className="text-5xl">📷</div>

          <h1 className="mt-4 text-2xl font-bold text-gray-900">
            No Scan Found
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Start a crop scan to see the AI analysis.
          </p>

          <Link
            href="/farmer/scan"
            className="mt-6 inline-block rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white"
          >
            Start Scan
          </Link>
        </div>
      </main>
    );
  }

  const confidence = scan.confidence ?? 87;

  const confidenceLevel =
    confidence >= 80 ? "high" : confidence >= 50 ? "medium" : "low";

  const isHighConfidence = confidenceLevel === "high";
  const isMediumConfidence = confidenceLevel === "medium";
  const isLowConfidence = confidenceLevel === "low";

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-gray-50">
      <FarmerHeader />

      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <Link
          href="/farmer/scan"
          className="text-sm font-medium text-green-700 hover:underline"
        >
          ← Scan Another Crop
        </Link>

        <div className="mt-5">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Crop Health Analysis
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            AI-powered preliminary assessment for {scan.crop}.
          </p>
        </div>

        {/* Main Detection */}
        <section
          className={`mt-6 rounded-2xl border p-5 sm:p-6 ${
            isHighConfidence
              ? "border-red-200 bg-red-50"
              : isMediumConfidence
                ? "border-yellow-200 bg-yellow-50"
                : "border-orange-200 bg-orange-50"
          }`}
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    isHighConfidence
                      ? "bg-red-100 text-red-700"
                      : isMediumConfidence
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-orange-100 text-orange-700"
                  }`}
                >
                  {isHighConfidence
                    ? "DISEASE DETECTED"
                    : isMediumConfidence
                      ? "PREDICTION UNCERTAIN"
                      : "LOW CONFIDENCE"}
                </span>

                <span className="text-sm text-gray-600">
                  {isHighConfidence
                    ? "⚠️ Attention Required"
                    : "🔎 Verification Recommended"}
                </span>
              </div>

              <h2 className="mt-3 text-2xl font-bold text-gray-900 sm:text-3xl">
                {isLowConfidence
                  ? "Unable to identify reliably"
                  : scan.disease}
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
                {isHighConfidence
                  ? `The AI model identified ${scan.disease} with relatively high confidence. This is still a preliminary detection and should be validated in the field.`
                  : isMediumConfidence
                    ? `The AI model has a possible match, but the confidence is not high enough for a reliable diagnosis. Please provide clearer photos or request expert verification.`
                    : `The AI model could not reliably identify the crop problem from this image. Please upload clearer photos showing the affected area or request expert assistance.`}
              </p>
            </div>

            <div className="rounded-xl bg-white px-5 py-4 text-center shadow-sm">
              <p className="text-xs text-gray-500">AI Confidence</p>

              <p
                className={`mt-1 text-3xl font-bold ${
                  isHighConfidence
                    ? "text-green-700"
                    : isMediumConfidence
                      ? "text-yellow-700"
                      : "text-orange-700"
                }`}
              >
                {confidence}%
              </p>

              <p className="mt-1 text-xs text-gray-500">
                {isHighConfidence
                  ? "High confidence"
                  : isMediumConfidence
                    ? "Needs verification"
                    : "Very low confidence"}
              </p>
            </div>
          </div>
        </section>

        {/* Confidence Guidance */}
        <section className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-5 sm:p-6">
          <div className="flex gap-4">
            <div className="text-3xl">🧠</div>

            <div className="flex-1">
              <h2 className="font-bold text-gray-900">
                {isHighConfidence
                  ? "Want to verify the result?"
                  : "We need a little more information"}
              </h2>

              <p className="mt-1 text-sm leading-6 text-gray-600">
                {isHighConfidence
                  ? "Even with a high-confidence prediction, you can upload additional photos or ask an agriculture expert before taking action."
                  : "Take clearer photos of the affected leaves, stems or fruits from the same crop area. Multiple images can help improve the assessment."}
              </p>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Link
                  href="/farmer/scan"
                  className="rounded-xl bg-white px-4 py-3 text-center text-sm font-semibold text-green-700 shadow-sm hover:bg-green-50"
                >
                  📷 Upload More Photos
                </Link>

                <Link
                  href="/farmer/expert-review"
                  className="rounded-xl bg-white px-4 py-3 text-center text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
                >
                  👨‍🌾 Ask an Expert
                </Link>

                <Link
                  href="/farmer/chatbot"
                  className="rounded-xl bg-white px-4 py-3 text-center text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
                >
                  🤖 Ask Assistant
                </Link>

                <Link
                  href="/farmer/help"
                  className="rounded-xl bg-white px-4 py-3 text-center text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
                >
                  📞 Contact Support
                </Link>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-5">
          {/* Image */}
          <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-6 lg:col-span-2">
            <h2 className="font-bold text-gray-900">Scanned Image</h2>

            <div className="mt-4 flex min-h-[300px] items-center justify-center overflow-hidden rounded-xl bg-gray-100">
              {scan.image ? (
                <img
                  src={scan.image}
                  alt="Scanned crop"
                  className="max-h-[450px] w-full object-contain"
                />
              ) : (
                <div className="text-center">
                  <div className="text-6xl">🌱</div>

                  <p className="mt-3 font-semibold text-gray-700">
                    Demo Crop Scan
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Sample scan used to test the agrossential frontend flow
                  </p>
                </div>
              )}
            </div>

            <div className="mt-4 space-y-2 text-sm">
              <p>
                <span className="text-gray-500">Farm:</span>{" "}
                <span className="font-semibold text-gray-900">
                  {scan.farmName}
                </span>
              </p>

              <p>
                <span className="text-gray-500">Crop:</span>{" "}
                <span className="font-semibold text-gray-900">
                  {scan.crop}
                </span>
              </p>

              <p>
                <span className="text-gray-500">Variety:</span>{" "}
                <span className="font-semibold text-gray-900">
                  {scan.variety || "Not specified"}
                </span>
              </p>
            </div>
          </section>

          {/* Analysis */}
          <section className="space-y-6 lg:col-span-3">
            {/* Risk */}
            <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-lg font-bold text-gray-900">
                Risk Assessment
              </h2>

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-xl bg-red-50 p-4">
                  <p className="text-xs text-red-600">Disease Risk</p>
                  <p className="mt-1 font-bold text-red-700">
                    {isHighConfidence ? "High" : "Needs Review"}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Monitor field closely
                  </p>
                </div>

                <div className="rounded-xl bg-orange-50 p-4">
                  <p className="text-xs text-orange-600">Severity</p>
                  <p className="mt-1 font-bold text-orange-700">
                    {isLowConfidence ? "Unknown" : scan.severity}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {isLowConfidence
                      ? "More information required"
                      : "Symptoms visible"}
                  </p>
                </div>

                <div className="rounded-xl bg-green-50 p-4">
                  <p className="text-xs text-green-600">Crop Health</p>
                  <p className="mt-1 font-bold text-green-700">
                    {isLowConfidence ? "Unable to assess" : "Needs Monitoring"}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Continue observation
                  </p>
                </div>
              </div>
            </div>

            {/* Symptoms */}
            <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-lg font-bold text-gray-900">
                Symptoms Observed
              </h2>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-700">
                  🔸 Leaf curling and distortion
                </div>

                <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-700">
                  🔸 Yellowing of affected leaves
                </div>

                <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-700">
                  🔸 Reduced leaf growth
                </div>

                <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-700">
                  🔸 Possible spread to nearby plants
                </div>
              </div>
            </div>

            {/* Solutions */}
            {!isLowConfidence && (
              <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      Recommended Solution
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      Integrated Pest Management (IPM) approach
                    </p>
                  </div>

                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                    IPM
                  </span>
                </div>

                <div className="mt-5 space-y-3">
                  <div className="flex gap-3 rounded-xl bg-green-50 p-4">
                    <span className="text-lg">🔎</span>

                    <div>
                      <p className="font-semibold text-gray-900">
                        1. Inspect the field
                      </p>

                      <p className="mt-1 text-sm leading-5 text-gray-600">
                        Check nearby plants for similar symptoms and estimate
                        how widely the problem has spread.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 rounded-xl bg-blue-50 p-4">
                    <span className="text-lg">🦠</span>

                    <div>
                      <p className="font-semibold text-gray-900">
                        2. Monitor disease spread
                      </p>

                      <p className="mt-1 text-sm leading-5 text-gray-600">
                        Record affected plants and repeat scans to track
                        whether symptoms are increasing.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 rounded-xl bg-yellow-50 p-4">
                    <span className="text-lg">🌿</span>

                    <div>
                      <p className="font-semibold text-gray-900">
                        3. Follow field hygiene
                      </p>

                      <p className="mt-1 text-sm leading-5 text-gray-600">
                        Remove and manage severely affected plant material
                        according to local agricultural recommendations.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 rounded-xl bg-purple-50 p-4">
                    <span className="text-lg">👨‍🌾</span>

                    <div>
                      <p className="font-semibold text-gray-900">
                        4. Get expert confirmation
                      </p>

                      <p className="mt-1 text-sm leading-5 text-gray-600">
                        Ask an agriculture expert to confirm the diagnosis
                        before selecting chemical treatment.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 rounded-xl border border-red-100 bg-red-50 p-4">
                  <p className="text-sm font-bold text-red-800">
                    ⚠️ Do not spray pesticides solely based on this AI result.
                  </p>

                  <p className="mt-1 text-xs leading-5 text-red-700">
                    Treatment should be based on confirmed diagnosis, crop
                    stage, local recommendations and safe-use instructions.
                  </p>
                </div>
              </div>
            )}

            {/* Low confidence message */}
            {isLowConfidence && (
              <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5 sm:p-6">
                <h2 className="text-lg font-bold text-orange-900">
                  📷 Better images can improve the result
                </h2>

                <p className="mt-2 text-sm leading-6 text-orange-800">
                  Please take multiple clear photos from the same affected
                  crop area. Include both a close-up of the symptoms and a
                  wider photo showing the whole plant.
                </p>

                <Link
                  href="/farmer/scan"
                  className="mt-4 inline-block rounded-xl bg-orange-700 px-5 py-3 text-sm font-semibold text-white hover:bg-orange-800"
                >
                  Upload Clearer Photos
                </Link>
              </div>
            )}

            {/* Actions */}
            <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-lg font-bold text-gray-900">
                What would you like to do?
              </h2>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {!isLowConfidence && (
                  <Link
                    href="/farmer/recommendations"
                    className="rounded-xl bg-green-700 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-green-800"
                  >
                    View Full Solution
                  </Link>
                )}

                <Link
                  href="/farmer/expert-review"
                  className="rounded-xl border border-gray-200 px-4 py-3 text-center text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  👨‍🌾 Expert Review
                </Link>

                <Link
                  href="/farmer/history"
                  className="rounded-xl border border-gray-200 px-4 py-3 text-center text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  📋 Save to History
                </Link>
              </div>
            </div>

            {/* AI Disclaimer */}
            <div className="rounded-xl border border-gray-200 bg-white p-4 text-xs leading-5 text-gray-500">
              <strong className="text-gray-700">agrossential AI:</strong>{" "}
              This prediction is intended as decision-support information.
              Results can be incorrect, especially with poor-quality images or
              symptoms that resemble other diseases. Expert validation is
              recommended for uncertain cases.
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
