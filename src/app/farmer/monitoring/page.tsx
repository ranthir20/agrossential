"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import FarmerHeader from "@/components/farmer/FarmerHeader";

type ScanData = {
  crop?: string;
  variety?: string;
  farmName?: string;
  disease?: string;
  confidence?: number;
  severity?: string;
};

type MonitoringRecord = {
  id: string;
  crop: string;
  farmName: string;
  condition: string;
  observation: string;
  notes: string;
  date: string;
};

const defaultScan: ScanData = {
  crop: "Cotton",
  variety: "Bt Cotton",
  farmName: "Main Farm",
  disease: "Cotton Leaf Curl Virus",
  confidence: 87,
  severity: "Moderate",
};

export default function MonitoringPage() {
  const [scan, setScan] = useState<ScanData>(defaultScan);
  const [condition, setCondition] = useState("Improved");
  const [observation, setObservation] = useState("");
  const [notes, setNotes] = useState("");
  const [records, setRecords] = useState<MonitoringRecord[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const storedScan = localStorage.getItem("agrossential-current-scan");
    if (storedScan) {
      try {
        setScan({ ...defaultScan, ...JSON.parse(storedScan) });
      } catch {}
    }

    const storedRecords = localStorage.getItem(
      "agrossential-monitoring"
    );

    if (storedRecords) {
      try {
        setRecords(JSON.parse(storedRecords));
      } catch {}
    }
  }, []);

  function saveMonitoring() {
    if (!observation.trim()) return;

    const record: MonitoringRecord = {
      id: `monitor-${Date.now()}`,
      crop: scan.crop || "Crop",
      farmName: scan.farmName || "Farm",
      condition,
      observation,
      notes,
      date: new Date().toISOString(),
    };

    const updated = [record, ...records];

    setRecords(updated);
    localStorage.setItem(
      "agrossential-monitoring",
      JSON.stringify(updated)
    );

    setObservation("");
    setNotes("");
    setSaved(true);

    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-slate-50">
      <FarmerHeader />

      <main className="mx-auto max-w-none px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/farmer/history"
            className="text-sm font-medium text-green-700 hover:text-green-800"
          >
            ← Back to Scan History
          </Link>

          <h1 className="mt-3 text-3xl font-bold text-slate-900">
            Follow-up Monitoring
          </h1>

          <p className="mt-2 text-slate-600">
            Track your crop after an AI detection or expert recommendation.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
            <div className="mb-6">
              <p className="text-sm font-medium text-slate-500">
                Monitoring for
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-900">
                {scan.crop} · {scan.variety}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {scan.farmName} · {scan.disease}
              </p>
            </div>

            <div className="mb-6 rounded-xl bg-amber-50 p-4">
              <p className="font-semibold text-amber-900">
                Recommended follow-up
              </p>
              <p className="mt-1 text-sm text-amber-800">
                Recheck the affected area regularly and compare symptoms with
                the previous scan.
              </p>
            </div>

            <div className="mb-6">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Current crop condition
              </label>

              <div className="grid gap-3 sm:grid-cols-3">
                {["Improved", "Same", "Worse"].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCondition(item)}
                    className={`rounded-xl border px-4 py-3 text-sm font-semibold ${
                      condition === item
                        ? "border-green-700 bg-green-50 text-green-800"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                What do you observe? *
              </label>

              <textarea
                value={observation}
                onChange={(e) => setObservation(e.target.value)}
                placeholder="Example: Leaf curling has reduced and new leaves look healthier."
                className="min-h-28 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />
            </div>

            <div className="mb-6">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Additional notes
              </label>

              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add treatment, weather, pest activity or other observations."
                className="min-h-24 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />
            </div>

            {saved && (
              <div className="mb-5 rounded-xl bg-green-50 p-4 text-sm font-medium text-green-800">
                ✓ Monitoring update saved successfully.
              </div>
            )}

            <button
              type="button"
              onClick={saveMonitoring}
              disabled={!observation.trim()}
              className="w-full rounded-xl bg-green-700 px-5 py-3 font-semibold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              Save Monitoring Update
            </button>
          </section>

          <aside className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="font-bold text-slate-900">Latest Detection</h2>

              <div className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Disease</span>
                  <span className="font-semibold text-slate-900">
                    {scan.disease}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Confidence</span>
                  <span className="font-semibold text-green-700">
                    {scan.confidence}%
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Severity</span>
                  <span className="font-semibold text-amber-700">
                    {scan.severity}
                  </span>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="font-bold text-slate-900">Next Actions</h2>

              <div className="mt-4 space-y-3">
                <Link
                  href="/farmer/scan"
                  className="block rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  📷 Take Follow-up Scan
                </Link>

                <Link
                  href="/farmer/risk"
                  className="block rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  📊 View Crop Risk
                </Link>

                <Link
                  href="/farmer/expert-review"
                  className="block rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  👨‍🌾 Ask an Expert
                </Link>
              </div>
            </section>
          </aside>
        </div>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">
            Previous Monitoring Updates
          </h2>

          {records.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">
              No monitoring updates yet. Add your first follow-up observation
              above.
            </p>
          ) : (
            <div className="mt-5 space-y-4">
              {records.map((record) => (
                <div
                  key={record.id}
                  className="rounded-xl border border-slate-200 p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-semibold text-slate-900">
                        {record.crop} · {record.farmName}
                      </p>
                      <p className="text-xs text-slate-500">
                        {new Date(record.date).toLocaleString()}
                      </p>
                    </div>

                    <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                      {record.condition}
                    </span>
                  </div>

                  <p className="mt-3 text-sm text-slate-700">
                    {record.observation}
                  </p>

                  {record.notes && (
                    <p className="mt-2 text-sm text-slate-500">
                      Notes: {record.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
