"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import FarmerHeader from "@/components/farmer/FarmerHeader";

type Risk = "High" | "Medium" | "Low";

type Farm = {
  id: string;
  name: string;
  village: string;
  crop: string;
  area: string;
  risk: Risk;
  diseaseRisk: number;
  pestRisk: number;
  x: number;
  y: number;
};

const farms: Farm[] = [
  {
    id: "main-farm",
    name: "Main Farm",
    village: "Nashik",
    crop: "Cotton",
    area: "5 acres",
    risk: "High",
    diseaseRisk: 78,
    pestRisk: 63,
    x: 54,
    y: 43,
  },
  {
    id: "east-farm",
    name: "East Farm",
    village: "Nashik",
    crop: "Soybean",
    area: "3 acres",
    risk: "Medium",
    diseaseRisk: 54,
    pestRisk: 61,
    x: 68,
    y: 55,
  },
  {
    id: "north-farm",
    name: "North Farm",
    village: "Dindori",
    crop: "Onion",
    area: "4 acres",
    risk: "Low",
    diseaseRisk: 32,
    pestRisk: 28,
    x: 43,
    y: 27,
  },
  {
    id: "west-farm",
    name: "West Farm",
    village: "Sinnar",
    crop: "Maize",
    area: "6 acres",
    risk: "Medium",
    diseaseRisk: 49,
    pestRisk: 57,
    x: 29,
    y: 61,
  },
];

const riskStyles: Record<
  Risk,
  { marker: string; badge: string; label: string }
> = {
  High: {
    marker: "bg-red-500 ring-red-200",
    badge: "bg-red-100 text-red-700",
    label: "High Risk",
  },
  Medium: {
    marker: "bg-orange-500 ring-orange-200",
    badge: "bg-orange-100 text-orange-700",
    label: "Medium Risk",
  },
  Low: {
    marker: "bg-green-500 ring-green-200",
    badge: "bg-green-100 text-green-700",
    label: "Low Risk",
  },
};

export default function FarmerMapPage() {
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(farms[0]);
  const [filter, setFilter] = useState<"All" | Risk>("All");

  const filteredFarms = useMemo(() => {
    if (filter === "All") return farms;
    return farms.filter((farm) => farm.risk === filter);
  }, [filter]);

  return (
    <main className="min-h-screen w-full max-w-full overflow-x-hidden w-full overflow-x-hidden bg-gray-50">
      <FarmerHeader />

      <div className="w-full px-4 py-6 sm:px-6 lg:px-8 xl:px-12">
        {/* Header */}
        <section className="mb-6">
          <Link
            href="/farmer/dashboard"
            className="text-sm font-medium text-green-700 hover:underline"
          >
            ← Back to Dashboard
          </Link>

          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Farm & Disease Map 🗺️
              </h1>
              <p className="mt-1 text-sm text-gray-600 sm:text-base">
                View your farms and crop-health risk across the region.
              </p>
            </div>

            <div className="rounded-xl border bg-white px-4 py-2 text-sm text-gray-600 shadow-sm">
              📍 Nashik, Maharashtra
            </div>
          </div>
        </section>

        {/* Summary */}
        <section className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Mapped Farms</p>
            <p className="mt-2 text-2xl font-bold text-gray-900">
              {farms.length}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">High Risk</p>
            <p className="mt-2 text-2xl font-bold text-red-600">
              {farms.filter((farm) => farm.risk === "High").length}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Medium Risk</p>
            <p className="mt-2 text-2xl font-bold text-orange-600">
              {farms.filter((farm) => farm.risk === "Medium").length}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Low Risk</p>
            <p className="mt-2 text-2xl font-bold text-green-600">
              {farms.filter((farm) => farm.risk === "Low").length}
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="mb-4 flex flex-wrap gap-2">
          {(["All", "High", "Medium", "Low"] as const).map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                filter === item
                  ? "bg-green-700 text-white"
                  : "border bg-white text-gray-600 hover:bg-green-50"
              }`}
            >
              {item === "All" ? "All Farms" : riskStyles[item].label}
            </button>
          ))}
        </section>

        {/* Map + Details */}
        <section className="grid gap-6 lg:grid-cols-3">
          {/* Map */}
          <div className="overflow-hidden rounded-2xl border bg-white shadow-sm lg:col-span-2">
            <div className="border-b px-5 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-gray-900">
                    Crop Health Risk Map
                  </h2>
                  <p className="text-sm text-gray-500">
                    Demo regional view — live map will connect later.
                  </p>
                </div>
                <span className="rounded-lg bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
                  Maharashtra
                </span>
              </div>
            </div>

            {/* Mock map */}
            <div className="relative h-[480px] overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-sky-50">
              {/* Map grid */}
              <div className="absolute inset-0 opacity-30">
                <div
                  className="h-full w-full"
                  style={{
                    backgroundImage:
                      "linear-gradient(#94a3b8 1px, transparent 1px), linear-gradient(90deg, #94a3b8 1px, transparent 1px)",
                    backgroundSize: "55px 55px",
                  }}
                />
              </div>

              {/* Roads / river */}
              <div className="absolute left-[8%] top-[68%] h-1 w-[85%] rotate-[-8deg] rounded-full bg-white shadow-sm" />
              <div className="absolute left-[18%] top-[20%] h-[70%] w-1 rotate-[18deg] rounded-full bg-blue-200/70" />

              <div className="absolute left-[7%] top-[7%] text-xs font-semibold text-gray-500">
                Dindori
              </div>
              <div className="absolute right-[8%] top-[38%] text-xs font-semibold text-gray-500">
                Nashik
              </div>
              <div className="absolute left-[12%] bottom-[12%] text-xs font-semibold text-gray-500">
                Sinnar
              </div>

              {/* Farm markers */}
              {filteredFarms.map((farm) => (
                <button
                  key={farm.id}
                  onClick={() => setSelectedFarm(farm)}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${farm.x}%`, top: `${farm.y}%` }}
                >
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-full text-lg shadow-lg ring-8 transition hover:scale-110 ${
                      riskStyles[farm.risk].marker
                    } ${
                      selectedFarm?.id === farm.id
                        ? "scale-125 ring-4"
                        : ""
                    }`}
                  >
                    🌱
                  </span>

                  <span className="mt-2 block whitespace-nowrap rounded-lg bg-white px-2 py-1 text-xs font-bold text-gray-700 shadow">
                    {farm.name}
                  </span>
                </button>
              ))}

              {/* Legend */}
              <div className="absolute bottom-4 left-4 rounded-xl border bg-white/95 p-3 shadow-md backdrop-blur">
                <p className="mb-2 text-xs font-bold text-gray-700">
                  Risk Level
                </p>

                <div className="space-y-1.5 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-red-500" />
                    High
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-orange-500" />
                    Medium
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-green-500" />
                    Low
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Farm details */}
          <aside className="rounded-2xl border bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900">
              Selected Farm
            </h2>

            {selectedFarm ? (
              <div className="mt-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {selectedFarm.name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      📍 {selectedFarm.village}, Maharashtra
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      riskStyles[selectedFarm.risk].badge
                    }`}
                  >
                    {selectedFarm.risk}
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-gray-50 p-3">
                    <p className="text-xs text-gray-500">Crop</p>
                    <p className="mt-1 font-bold">{selectedFarm.crop}</p>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-3">
                    <p className="text-xs text-gray-500">Area</p>
                    <p className="mt-1 font-bold">{selectedFarm.area}</p>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-sm font-bold text-gray-800">
                    Risk Breakdown
                  </h3>

                  <div className="mt-4 space-y-4">
                    <div>
                      <div className="mb-1 flex justify-between text-sm">
                        <span>Disease Risk</span>
                        <strong>{selectedFarm.diseaseRisk}%</strong>
                      </div>
                      <div className="h-2 rounded-full bg-gray-100">
                        <div
                          className="h-2 rounded-full bg-red-500"
                          style={{ width: `${selectedFarm.diseaseRisk}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="mb-1 flex justify-between text-sm">
                        <span>Pest Risk</span>
                        <strong>{selectedFarm.pestRisk}%</strong>
                      </div>
                      <div className="h-2 rounded-full bg-gray-100">
                        <div
                          className="h-2 rounded-full bg-orange-500"
                          style={{ width: `${selectedFarm.pestRisk}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 rounded-xl bg-green-50 p-4">
                  <p className="text-sm font-bold text-green-900">
                    Why this matters
                  </p>
                  <p className="mt-1 text-xs leading-5 text-green-800">
                    Risk combines crop observations, AI scan results,
                    weather, pest activity and farm conditions.
                  </p>
                </div>

                <div className="mt-5 space-y-2">
                  <Link
                    href={`/farmer/risk?farm=${selectedFarm.id}`}
                    className="block rounded-xl bg-green-700 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-green-800"
                  >
                    View Crop Risk
                  </Link>

                  <Link
                    href="/farmer/farms"
                    className="block rounded-xl border px-4 py-3 text-center text-sm font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    View My Farms
                  </Link>
                </div>
              </div>
            ) : (
              <p className="mt-4 text-sm text-gray-500">
                Select a farm marker on the map.
              </p>
            )}
          </aside>
        </section>

        {/* Future integration */}
        <section className="mt-6 rounded-2xl border border-green-100 bg-green-50 p-5">
          <h2 className="font-bold text-green-900">
            🚀 Future live map integration
          </h2>
          <p className="mt-2 text-sm leading-6 text-green-800">
            Farm coordinates will come from the farm profile. The live map can
            later combine GPS locations, disease detections, pest reports,
            weather risk, sensor data and expert confirmations to create
            real-time crop-health hotspots for farmers and agriculture
            officers.
          </p>
        </section>
      </div>
    </main>
  );
}
