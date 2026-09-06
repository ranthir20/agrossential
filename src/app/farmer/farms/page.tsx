"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import FarmerHeader from "@/components/farmer/FarmerHeader";

const farms = [
  {
    id: "main-farm",
    name: "Main Farm",
    location: "Nashik, Maharashtra",
    village: "Dindori",
    area: "5 acres",
    soil: "Black Soil",
    irrigation: "Drip Irrigation",
    crops: [
      {
        name: "Cotton",
        variety: "Bt Cotton",
        stage: "Flowering",
        health: 82,
      },
    ],
  },
  {
    id: "east-farm",
    name: "East Farm",
    location: "Nashik, Maharashtra",
    village: "Dindori",
    area: "3 acres",
    soil: "Loamy Soil",
    irrigation: "Borewell",
    crops: [
      {
        name: "Soybean",
        variety: "JS 335",
        stage: "Vegetative",
        health: 68,
      },
    ],
  },
];

export default function MyFarmsPage() {
  const [allFarms, setAllFarms] = useState(farms);

  useEffect(() => {
    const savedFarms = JSON.parse(
      localStorage.getItem("agrossential-farms") || "[]"
    );

    setAllFarms([...farms, ...savedFarms]);
  }, []);

  const totalArea = allFarms.reduce((total, farm) => {
    const value = parseFloat(farm.area);
    return total + (Number.isNaN(value) ? 0 : value);
  }, 0);

  const activeCrops = allFarms.reduce(
    (total, farm) => total + farm.crops.length,
    0
  );

  return (
    <main className="min-h-screen w-full max-w-full overflow-x-hidden w-full overflow-x-hidden bg-gray-50">
      <FarmerHeader />

      <div className="w-full px-4 py-6 sm:px-6 lg:px-8 xl:px-12">
        {/* Page Header */}
        <div className="mb-6">
          <Link
            href="/farmer/dashboard"
            className="text-sm font-medium text-green-700 hover:underline"
          >
            ← Back to Dashboard
          </Link>

          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                My Farms
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Manage your farms, crops and field information.
              </p>
            </div>

            <Link
              href="/farmer/farms/add"
              className="inline-flex items-center justify-center rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-800"
            >
              + Add Farm
            </Link>
          </div>
        </div>

        {/* Summary */}
        <section className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">Total Farms</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{allFarms.length}</p>
          </div>

          <div className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">Total Area</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{totalArea} acres</p>
          </div>

          <div className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">Active Crops</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{activeCrops}</p>
          </div>

          <div className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">High Risk Farms</p>
            <p className="mt-1 text-2xl font-bold text-red-600">1</p>
          </div>
        </section>

        {/* Farm Cards */}
        <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {allFarms.map((farm) => (
            <div
              key={farm.id}
              className="overflow-hidden rounded-2xl bg-white shadow-sm"
            >
              {/* Farm Header */}
              <div className="border-b bg-gradient-to-r from-green-50 to-white p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-green-100 text-3xl">
                      🌾
                    </div>

                    <div className="min-w-0">
                      <h2 className="text-xl font-bold text-gray-900">
                        {farm.name}
                      </h2>

                      <p className="mt-1 text-sm text-gray-500">
                        📍 {farm.location}
                      </p>
                    </div>
                  </div>

                  <span className="shrink-0 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                    {farm.area}
                  </span>
                </div>
              </div>

              {/* Farm Details */}
              <div className="p-5 sm:p-6">
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <p className="text-xs text-gray-500">Village</p>
                    <p className="mt-1 font-semibold text-gray-900">
                      {farm.village}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Soil Type</p>
                    <p className="mt-1 font-semibold text-gray-900">
                      {farm.soil}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Irrigation</p>
                    <p className="mt-1 font-semibold text-gray-900">
                      {farm.irrigation}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Crops</p>
                    <p className="mt-1 font-semibold text-gray-900">
                      {farm.crops.length} active
                    </p>
                  </div>
                </div>

                {/* Crops */}
                <div className="mt-6 border-t pt-5">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-bold text-gray-900">Current Crops</h3>

                    <Link
                      href="/farmer/crops"
                      className="text-sm font-medium text-green-700 hover:underline"
                    >
                      Manage crops →
                    </Link>
                  </div>

                  <div className="space-y-3">
                    {farm.crops.map((crop) => (
                      <div
                        key={crop.name}
                        className="rounded-xl border border-gray-100 bg-gray-50 p-4"
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="font-semibold text-gray-900">
                              🌱 {crop.name}
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                              {crop.variety} • {crop.stage}
                            </p>
                          </div>

                          <div className="sm:text-right">
                            <p className="text-sm font-semibold text-gray-900">
                              {crop.health}% health
                            </p>

                            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200 sm:w-28">
                              <div
                                className="h-full rounded-full bg-green-500"
                                style={{ width: `${crop.health}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href={`/farmer/farms/${farm.id}`}
                    className="flex-1 rounded-xl bg-green-700 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-green-800"
                  >
                    View Farm
                  </Link>

                  <Link
                    href="/farmer/scan"
                    className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-center text-sm font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    📷 Scan Crop
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Add Farm CTA */}
        <section className="mt-8 rounded-2xl border-2 border-dashed border-green-200 bg-green-50 p-6 text-center sm:p-8">
          <div className="text-4xl">🌱</div>

          <h2 className="mt-3 text-xl font-bold text-gray-900">
            Have another farm?
          </h2>

          <p className="mx-auto mt-2 max-w-xl text-sm text-gray-600">
            Add multiple farms and keep each farm&apos;s crops, scans, risks
            and health history separate.
          </p>

          <Link
            href="/farmer/farms/add"
            className="mt-5 inline-flex rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white hover:bg-green-800"
          >
            + Add Another Farm
          </Link>
        </section>
      </div>
    </main>
  );
}
