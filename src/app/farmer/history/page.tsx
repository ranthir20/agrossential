"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import FarmerHeader from "@/components/farmer/FarmerHeader";

type Scan = {
  id: string;
  farmId: string;
  farmName: string;
  crop: string;
  variety?: string;
  image?: string;
  fileName?: string;
  notes?: string;
  date: string;
  confidence?: number;
  disease?: string;
  status?: string;
  detectedCrop?: string;
  severity?: string;
};

const demoHistory: Scan[] = [
  {
    id: "history-1",
    farmId: "main-farm",
    farmName: "Main Farm",
    crop: "Cotton",
    variety: "Bt Cotton",
    image: "",
    date: new Date(Date.now() - 86400000).toISOString(),
    confidence: 87,
    status: "Diseased",
    disease: "Cotton Leaf Curl Virus",
    severity: "Moderate",
  },
  {
    id: "history-2",
    farmId: "east-farm",
    farmName: "East Farm",
    crop: "Soybean",
    variety: "JS 335",
    image: "",
    date: new Date(Date.now() - 3 * 86400000).toISOString(),
    confidence: 64,
    status: "Diseased",
    disease: "Possible Leaf Spot",
    severity: "Low",
  },
];

export default function HistoryPage() {
  const [scans, setScans] = useState<Scan[]>([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem("agrossential-scan-history");

    if (savedHistory) {
      try {
        setScans(JSON.parse(savedHistory));
        return;
      } catch {
        setScans(demoHistory);
        return;
      }
    }

    const currentScan = localStorage.getItem("agrossential-current-scan");

    if (currentScan) {
      try {
        const parsed = JSON.parse(currentScan);

        setScans([
          {
            ...parsed,
            confidence: parsed.confidence ?? 87,
            disease: parsed.disease ?? (parsed.status === "Healthy" ? "Healthy (No Disease)" : "Cotton Leaf Curl Virus"),
            status: parsed.status ?? "Diseased",
          },
          ...demoHistory,
        ]);
        return;
      } catch {
        // Use demo history below.
      }
    }

    setScans(demoHistory);
  }, []);

  useEffect(() => {
    if (scans.length > 0) {
      localStorage.setItem("agrossential-scan-history", JSON.stringify(scans));
    }
  }, [scans]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getConfidenceStyle = (confidence: number) => {
    if (confidence >= 80) {
      return "bg-green-100 text-green-700";
    }

    if (confidence >= 50) {
      return "bg-yellow-100 text-yellow-700";
    }

    return "bg-orange-100 text-orange-700";
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 80) return "High";
    if (confidence >= 50) return "Needs Review";
    return "Low";
  };

  return (
    <main className="min-h-screen w-full max-w-full overflow-x-hidden w-full overflow-x-hidden bg-gray-50">
      <FarmerHeader />

      <div className="w-full max-w-none px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Scan History
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Review previous crop scans and monitor changes over time.
            </p>
          </div>

          <Link
            href="/farmer/scan"
            className="inline-flex w-fit items-center rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white hover:bg-green-800"
          >
            📷 New Scan
          </Link>
        </div>

        {/* Summary */}
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Total Scans</p>
            <p className="mt-2 text-2xl font-bold text-gray-900">
              {scans.length}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">High Confidence</p>
            <p className="mt-2 text-2xl font-bold text-green-700">
              {scans.filter((scan) => (scan.confidence ?? 0) >= 80).length}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Needs Review</p>
            <p className="mt-2 text-2xl font-bold text-yellow-600">
              {
                scans.filter(
                  (scan) =>
                    (scan.confidence ?? 0) >= 50 &&
                    (scan.confidence ?? 0) < 80,
                ).length
              }
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Low Confidence</p>
            <p className="mt-2 text-2xl font-bold text-orange-600">
              {scans.filter((scan) => (scan.confidence ?? 0) < 50).length}
            </p>
          </div>
        </div>

        {/* History */}
        <section className="mt-6">
          {scans.length === 0 ? (
            <div className="rounded-2xl bg-white px-6 py-12 text-center shadow-sm">
              <div className="text-5xl">📋</div>

              <h2 className="mt-4 text-xl font-bold text-gray-900">
                No scans yet
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Start your first crop scan to build your crop health history.
              </p>

              <Link
                href="/farmer/scan"
                className="mt-5 inline-block rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white"
              >
                Start First Scan
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {scans.map((scan) => {
                const confidence = scan.confidence ?? 0;

                return (
                  <div
                    key={scan.id}
                    className="rounded-2xl bg-white p-5 shadow-sm sm:p-6"
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex gap-4">
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-100">
                          {scan.image ? (
                            <img
                              src={scan.image}
                              alt={scan.crop}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="text-3xl">🌱</span>
                          )}
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h2 className="font-bold text-gray-900">
                              {scan.status === "Healthy"
                                ? "Healthy (No Disease)"
                                : scan.disease || "Analysis Pending"}
                            </h2>

                            <span
                              className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                                scan.status === "Healthy"
                                  ? "bg-green-100 text-green-700"
                                  : getConfidenceStyle(confidence)
                              }`}
                            >
                              {scan.status === "Healthy" ? "Healthy · " : ""}
                              {confidence}% ·{" "}
                              {getConfidenceLabel(confidence)}
                            </span>
                          </div>

                          <p className="mt-1 text-sm text-gray-600">
                            {scan.crop}
                            {scan.variety ? ` · ${scan.variety}` : ""}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            {scan.farmName} · {formatDate(scan.date)}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 sm:flex-row">
                        <Link
                          href="/farmer/results"
                          className="rounded-xl bg-green-700 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-green-800"
                        >
                          View Result
                        </Link>

                        <Link
                          href="/farmer/scan"
                          className="rounded-xl border border-gray-200 px-4 py-3 text-center text-sm font-semibold text-gray-700 hover:bg-gray-50"
                        >
                          Follow-up Scan
                        </Link>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-3 border-t border-gray-100 pt-4 sm:grid-cols-3">
                      <div>
                        <p className="text-xs text-gray-500">Status</p>
                        <p className="mt-1 text-sm font-semibold text-gray-900">
                          {scan.status || scan.severity || "Analyzed"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">AI Status</p>
                        <p className="mt-1 text-sm font-semibold text-gray-900">
                          {confidence >= 80
                            ? "Likely diagnosis"
                            : confidence >= 50
                              ? "Verification recommended"
                              : "Expert review recommended"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">Next Action</p>
                        <p className="mt-1 text-sm font-semibold text-green-700">
                          {confidence >= 80
                            ? "Monitor crop"
                            : "Upload more photos"}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Learning loop */}
        <section className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-5 sm:p-6">
          <div className="flex gap-4">
            <div className="text-3xl">🔄</div>

            <div>
              <h2 className="font-bold text-gray-900">
                agrossential learns from field confirmation
              </h2>

              <p className="mt-1 text-sm leading-6 text-gray-600">
                Future versions can compare AI predictions with expert and
                field confirmations. Confirmed cases can then help improve
                future crop-disease detection.
              </p>

              <Link
                href="/farmer/confirmation"
                className="mt-3 inline-block text-sm font-semibold text-blue-700 hover:underline"
              >
                Confirm a previous result →
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
