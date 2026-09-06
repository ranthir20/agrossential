"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import FarmerHeader from "@/components/farmer/FarmerHeader";

type Farm = {
  id: string;
  name: string;
  crops: {
    name: string;
    variety?: string;
  }[];
};

type PestReport = {
  id: string;
  farm: string;
  crop: string;
  pest: string;
  count: string;
  severity: "Low" | "Medium" | "High";
  notes: string;
  createdAt: string;
};

const defaultFarms: Farm[] = [
  {
    id: "main-farm",
    name: "Main Farm",
    crops: [{ name: "Cotton", variety: "Bt Cotton" }],
  },
  {
    id: "east-farm",
    name: "East Farm",
    crops: [{ name: "Soybean", variety: "JS 335" }],
  },
  {
    id: "north-farm",
    name: "North Farm",
    crops: [{ name: "Onion", variety: "Local Variety" }],
  },
  {
    id: "west-farm",
    name: "West Farm",
    crops: [{ name: "Maize", variety: "Hybrid Maize" }],
  },
];

const pestOptions = [
  "Aphids",
  "Whiteflies",
  "Thrips",
  "Bollworm",
  "Fall Armyworm",
  "Leaf Miner",
  "Stem Borer",
  "Fruit Borer",
  "Other",
];

export default function PestReportPage() {
  const [farms, setFarms] = useState<Farm[]>(defaultFarms);
  const [farmId, setFarmId] = useState("main-farm");
  const [crop, setCrop] = useState("Cotton");
  const [pest, setPest] = useState("Aphids");
  const [count, setCount] = useState("");
  const [severity, setSeverity] =
    useState<PestReport["severity"]>("Medium");
  const [notes, setNotes] = useState("");
  const [reports, setReports] = useState<PestReport[]>([]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const savedFarms = localStorage.getItem("agrossential-farms");

    if (savedFarms) {
      try {
        const customFarms = JSON.parse(savedFarms);
        setFarms([...defaultFarms, ...customFarms]);
      } catch {
        setFarms(defaultFarms);
      }
    }

    const savedReports = localStorage.getItem("agrossential-pest-reports");

    if (savedReports) {
      try {
        setReports(JSON.parse(savedReports));
      } catch {
        setReports([]);
      }
    }
  }, []);

  const selectedFarm =
    farms.find((farm) => farm.id === farmId) || farms[0];

  const handleFarmChange = (id: string) => {
    setFarmId(id);

    const farm = farms.find((item) => item.id === id);

    if (farm?.crops?.[0]) {
      setCrop(farm.crops[0].name);
    }
  };

  const submitReport = () => {
    if (!selectedFarm || !count.trim()) return;

    const report: PestReport = {
      id: `pest-${Date.now()}`,
      farm: selectedFarm.name,
      crop,
      pest,
      count: count.trim(),
      severity,
      notes: notes.trim(),
      createdAt: new Date().toLocaleString(),
    };

    const updated = [report, ...reports];

    setReports(updated);

    localStorage.setItem(
      "agrossential-pest-reports",
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
            href="/farmer/dashboard"
            className="text-sm font-semibold text-green-700 hover:text-green-800"
          >
            ← Back to Dashboard
          </Link>

          <div className="mt-4">
            <h1 className="text-2xl font-bold text-gray-900">
              🐛 Report Pest Activity
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Report pest observations from your farm to improve early
              detection and monitoring.
            </p>
          </div>
        </div>

        {!submitted ? (
          <section className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="rounded-xl bg-orange-50 p-4">
              <p className="text-sm font-semibold text-orange-900">
                Field pest observation
              </p>

              <p className="mt-1 text-xs leading-5 text-orange-800">
                Enter what you observed in the field. This information can
                support pest-risk assessment and agriculture officer
                surveillance.
              </p>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Select Farm
                </label>

                <select
                  value={farmId}
                  onChange={(e) => handleFarmChange(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-green-600"
                >
                  {farms.map((farm) => (
                    <option key={farm.id} value={farm.id}>
                      {farm.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Crop
                </label>

                <select
                  value={crop}
                  onChange={(e) => setCrop(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-green-600"
                >
                  {selectedFarm?.crops?.map((item) => (
                    <option key={item.name} value={item.name}>
                      {item.name}
                      {item.variety ? ` — ${item.variety}` : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Pest
                </label>

                <select
                  value={pest}
                  onChange={(e) => setPest(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-green-600"
                >
                  {pestOptions.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Approximate pest count
                </label>

                <input
                  value={count}
                  onChange={(e) => setCount(e.target.value)}
                  placeholder="Example: 15 insects observed"
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-green-600"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Activity level
                </label>

                <select
                  value={severity}
                  onChange={(e) =>
                    setSeverity(
                      e.target.value as PestReport["severity"]
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-green-600"
                >
                  <option value="Low">Low — Few pests observed</option>
                  <option value="Medium">
                    Medium — Noticeable activity
                  </option>
                  <option value="High">
                    High — Significant activity
                  </option>
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Location in farm
                </label>

                <input
                  placeholder="Example: North field / near irrigation area"
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-green-600"
                />
              </div>
            </div>

            <div className="mt-5">
              <label className="text-sm font-semibold text-gray-700">
                Additional notes
              </label>

              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Describe where you saw the pest or any crop symptoms..."
                rows={4}
                className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm outline-none focus:border-green-600"
              />
            </div>

            <button
              onClick={submitReport}
              disabled={!count.trim()}
              className="mt-5 rounded-xl bg-green-700 px-6 py-3 text-sm font-semibold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Submit Pest Report
            </button>
          </section>
        ) : (
          <section className="rounded-2xl border border-green-200 bg-green-50 p-6">
            <div className="text-3xl">✅</div>

            <h2 className="mt-3 text-xl font-bold text-green-950">
              Pest report submitted
            </h2>

            <p className="mt-2 text-sm leading-6 text-green-800">
              Your observation has been recorded and can help improve farm
              monitoring and pest-risk assessment.
            </p>

            <button
              onClick={() => {
                setSubmitted(false);
                setCount("");
                setNotes("");
              }}
              className="mt-5 rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white hover:bg-green-800"
            >
              Report Another Pest
            </button>
          </section>
        )}

        <section className="mt-6">
          <h2 className="text-lg font-bold text-gray-900">
            Recent Pest Reports
          </h2>

          {reports.length === 0 ? (
            <div className="mt-4 rounded-2xl border bg-white p-6 text-sm text-gray-500">
              No pest reports submitted yet.
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              {reports.map((report) => (
                <article
                  key={report.id}
                  className="rounded-2xl border bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900">
                        {report.pest} — {report.crop}
                      </h3>

                      <p className="mt-1 text-xs text-gray-500">
                        {report.farm} · {report.createdAt}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        report.severity === "High"
                          ? "bg-red-100 text-red-700"
                          : report.severity === "Medium"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-green-100 text-green-700"
                      }`}
                    >
                      {report.severity} Activity
                    </span>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl bg-gray-50 p-3">
                      <p className="text-xs text-gray-500">
                        Approximate count
                      </p>
                      <p className="mt-1 text-sm font-semibold text-gray-800">
                        {report.count}
                      </p>
                    </div>

                    <div className="rounded-xl bg-gray-50 p-3">
                      <p className="text-xs text-gray-500">
                        Field notes
                      </p>
                      <p className="mt-1 text-sm text-gray-700">
                        {report.notes || "No additional notes"}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/farmer/risk"
            className="rounded-xl bg-green-700 px-5 py-3 text-center text-sm font-semibold text-white hover:bg-green-800"
          >
            View Crop Risk
          </Link>

          <Link
            href="/farmer/alerts"
            className="rounded-xl border bg-white px-5 py-3 text-center text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            View Alerts
          </Link>
        </div>
      </div>
    </main>
  );
}
