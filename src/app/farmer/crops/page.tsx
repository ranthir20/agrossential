"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import FarmerHeader from "@/components/farmer/FarmerHeader";

type Crop = {
  name: string;
  variety: string;
  sowingDate?: string;
  stage: string;
  health: number;
};

type Farm = {
  id: string;
  name: string;
  location: string;
  village: string;
  area: string;
  soil: string;
  irrigation: string;
  crops: Crop[];
};

const defaultFarms: Farm[] = [
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
        sowingDate: "2026-06-15",
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
        sowingDate: "2026-06-20",
        stage: "Vegetative",
        health: 68,
      },
    ],
  },
];

function formatDate(date?: string) {
  if (!date) return "Not available";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getCropAge(sowingDate?: string) {
  if (!sowingDate) return "Not available";

  const start = new Date(sowingDate);
  const today = new Date();

  const days = Math.floor(
    (today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (days < 0) return "Not started";
  return `${days} days`;
}

export default function CropsPage() {
  const [allFarms, setAllFarms] = useState<Farm[]>(defaultFarms);
  const [selectedFarmId, setSelectedFarmId] = useState("main-farm");

  const [crop, setCrop] = useState("");
  const [variety, setVariety] = useState("");
  const [sowingDate, setSowingDate] = useState("");

  const [showAddCrop, setShowAddCrop] = useState(false);

  useEffect(() => {
    const savedFarms: Farm[] = JSON.parse(
      localStorage.getItem("agrossential-farms") || "[]"
    );

    const combined = [...defaultFarms, ...savedFarms];

    setAllFarms(combined);

    if (combined.length > 0) {
      setSelectedFarmId(combined[0].id);
    }
  }, []);

  const selectedFarm = useMemo(
    () => allFarms.find((farm) => farm.id === selectedFarmId),
    [allFarms, selectedFarmId]
  );

  function handleAddCrop(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!selectedFarm || !crop || !variety || !sowingDate) {
      alert("Please fill all crop details.");
      return;
    }

    const newCrop: Crop = {
      name: crop,
      variety,
      sowingDate,
      stage: "Recently Sown",
      health: 100,
    };

    const updatedFarms = allFarms.map((farm) => {
      if (farm.id !== selectedFarm.id) return farm;

      return {
        ...farm,
        crops: [...farm.crops, newCrop],
      };
    });

    const defaultIds = defaultFarms.map((farm) => farm.id);

    const customFarms = updatedFarms.filter(
      (farm) => !defaultIds.includes(farm.id)
    );

    localStorage.setItem(
      "agrossential-farms",
      JSON.stringify(customFarms)
    );

    setAllFarms(updatedFarms);

    setCrop("");
    setVariety("");
    setSowingDate("");
    setShowAddCrop(false);
  }

  return (
    <main className="min-h-screen w-full max-w-full overflow-x-hidden w-full overflow-x-hidden bg-gray-50">
      <FarmerHeader />

      <div className="w-full px-4 py-6 sm:px-6 lg:px-8 xl:px-12">
        <Link
          href="/farmer/farms"
          className="text-sm font-medium text-green-700 hover:underline"
        >
          ← Back to My Farms
        </Link>

        {/* Header */}
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Crop Management
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage crops across all your farms.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAddCrop(true)}
            className="rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white hover:bg-green-800"
          >
            + Add Crop
          </button>
        </div>

        {/* Farm Selector */}
        <section className="mt-6 rounded-2xl bg-white p-5 shadow-sm sm:p-6">
          <label className="text-sm font-semibold text-gray-700">
            Select Farm
          </label>

          <select
            value={selectedFarmId}
            onChange={(e) => setSelectedFarmId(e.target.value)}
            className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-green-500 sm:max-w-md"
          >
            {allFarms.map((farm) => (
              <option key={farm.id} value={farm.id}>
                {farm.name} — {farm.location}
              </option>
            ))}
          </select>

          {selectedFarm && (
            <div className="mt-4 flex flex-wrap gap-3 text-sm text-gray-500">
              <span>📍 {selectedFarm.location}</span>
              <span>•</span>
              <span>📐 {selectedFarm.area}</span>
              <span>•</span>
              <span>🌱 {selectedFarm.crops.length} crops</span>
            </div>
          )}
        </section>

        {/* Crops */}
        {selectedFarm && (
          <section className="mt-6">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                {selectedFarm.name} Crops
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Each crop can have its own scans, risk history and
                recommendations.
              </p>
            </div>

            {selectedFarm.crops.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-white p-10 text-center">
                <div className="text-4xl">🌱</div>

                <h3 className="mt-3 font-bold text-gray-900">
                  No crops added yet
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Add a crop to start monitoring this farm.
                </p>

                <button
                  type="button"
                  onClick={() => setShowAddCrop(true)}
                  className="mt-5 rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white hover:bg-green-800"
                >
                  + Add Crop
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                {selectedFarm.crops.map((item, index) => (
                  <div
                    key={`${item.name}-${item.variety}-${index}`}
                    className="rounded-2xl bg-white p-5 shadow-sm sm:p-6"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-green-50 text-2xl">
                          🌱
                        </div>

                        <div>
                          <h3 className="text-xl font-bold text-gray-900">
                            {item.name}
                          </h3>

                          <p className="mt-1 text-sm text-gray-500">
                            {item.variety}
                          </p>
                        </div>
                      </div>

                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                        {item.stage}
                      </span>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-4 border-t pt-5">
                      <div>
                        <p className="text-xs text-gray-500">
                          Sowing Date
                        </p>

                        <p className="mt-1 text-sm font-semibold text-gray-900">
                          {formatDate(item.sowingDate)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">
                          Crop Age
                        </p>

                        <p className="mt-1 text-sm font-semibold text-gray-900">
                          {getCropAge(item.sowingDate)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5">
                      <div className="mb-2 flex justify-between text-xs">
                        <span className="text-gray-500">
                          Crop Health
                        </span>

                        <span className="font-semibold text-gray-700">
                          {item.health}%
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full bg-green-500"
                          style={{ width: `${item.health}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                      <Link
                        href="/farmer/scan"
                        className="flex-1 rounded-xl bg-green-700 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-green-800"
                      >
                        📷 Scan Crop
                      </Link>

                      <Link
                        href="/farmer/risk"
                        className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-center text-sm font-semibold text-gray-700 hover:bg-gray-50"
                      >
                        ⚠️ View Risk
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Add Crop Form */}
        {showAddCrop && selectedFarm && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
            <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-5 shadow-xl sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Add Crop
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Adding crop to {selectedFarm.name}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAddCrop(false)}
                  className="text-xl text-gray-400 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddCrop} className="mt-6 space-y-5">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Crop *
                  </label>

                  <select
                    required
                    value={crop}
                    onChange={(e) => setCrop(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-green-500"
                  >
                    <option value="">Select crop</option>
                    <option value="Cotton">Cotton</option>
                    <option value="Soybean">Soybean</option>
                    <option value="Chilli">Chilli</option>
                    <option value="Rice">Rice</option>
                    <option value="Maize">Maize</option>
                    <option value="Tomato">Tomato</option>
                    <option value="Wheat">Wheat</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Variety *
                  </label>

                  <input
                    required
                    value={variety}
                    onChange={(e) => setVariety(e.target.value)}
                    type="text"
                    placeholder="e.g. Bt Cotton"
                    className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Sowing Date *
                  </label>

                  <input
                    required
                    value={sowingDate}
                    onChange={(e) => setSowingDate(e.target.value)}
                    type="date"
                    className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-500"
                  />
                </div>

                <div className="flex flex-col gap-3 border-t pt-5 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => setShowAddCrop(false)}
                    className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white hover:bg-green-800"
                  >
                    Save Crop
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
