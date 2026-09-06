"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
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

function getCropAge(sowingDate?: string) {
  if (!sowingDate) return "Not available";

  const start = new Date(sowingDate);
  const today = new Date();

  const difference = today.getTime() - start.getTime();
  const days = Math.floor(difference / (1000 * 60 * 60 * 24));

  if (days < 0) return "Not started";
  return `${days} days`;
}

function formatDate(date?: string) {
  if (!date) return "Not available";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function FarmDetailsPage() {
  const params = useParams();
  const farmId = params.id as string;

  const [farm, setFarm] = useState<Farm | null>(null);

  useEffect(() => {
    const savedFarms: Farm[] = JSON.parse(
      localStorage.getItem("agrossential-farms") || "[]"
    );

    const allFarms = [...defaultFarms, ...savedFarms];

    const selectedFarm = allFarms.find((item) => item.id === farmId);

    setFarm(selectedFarm || null);
  }, [farmId]);

  if (!farm) {
    return (
      <main className="min-h-screen w-full max-w-full overflow-x-hidden bg-gray-50">
        <FarmerHeader />

        <div className="px-4 py-10 text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Farm not found
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            The farm you are looking for does not exist.
          </p>

          <Link
            href="/farmer/farms"
            className="mt-5 inline-block rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white"
          >
            Back to My Farms
          </Link>
        </div>
      </main>
    );
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

        {/* Farm Header */}
        <section className="mt-5 rounded-2xl bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-green-100 text-3xl">
                🌾
              </div>

              <div>
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                  {farm.name}
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  📍 {farm.location} • {farm.village}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/farmer/scan"
                className="rounded-xl bg-green-700 px-5 py-3 text-center text-sm font-semibold text-white hover:bg-green-800"
              >
                📷 Scan Crop
              </Link>

              <Link
                href="/farmer/risk"
                className="rounded-xl border border-gray-200 px-5 py-3 text-center text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                ⚠️ View Risk
              </Link>
            </div>
          </div>
        </section>

        {/* Farm Overview */}
        <section className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Farm Area</p>
            <p className="mt-1 text-xl font-bold text-gray-900">
              {farm.area}
            </p>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Soil Type</p>
            <p className="mt-1 text-xl font-bold text-gray-900">
              {farm.soil}
            </p>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Irrigation</p>
            <p className="mt-1 text-xl font-bold text-gray-900">
              {farm.irrigation}
            </p>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Active Crops</p>
            <p className="mt-1 text-xl font-bold text-gray-900">
              {farm.crops.length}
            </p>
          </div>
        </section>

        {/* Crops */}
        <section className="mt-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Current Crops
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Crop information and health status for this farm.
              </p>
            </div>

            <Link
              href="/farmer/crops"
              className="hidden rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-white sm:block"
            >
              Manage Crops
            </Link>
          </div>

          <div className="space-y-4">
            {farm.crops.map((crop) => (
              <div
                key={`${crop.name}-${crop.variety}`}
                className="rounded-2xl bg-white p-5 shadow-sm sm:p-6"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-green-50 text-2xl">
                      🌱
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {crop.name}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        Variety: {crop.variety}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                      {crop.stage}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-sm font-semibold ${
                        crop.health >= 80
                          ? "bg-green-100 text-green-700"
                          : crop.health >= 60
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {crop.health}% health
                    </span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-4 border-t pt-5 sm:grid-cols-3">
                  <div>
                    <p className="text-xs text-gray-500">Sowing Date</p>
                    <p className="mt-1 font-semibold text-gray-900">
                      {formatDate(crop.sowingDate)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Crop Age</p>
                    <p className="mt-1 font-semibold text-gray-900">
                      {getCropAge(crop.sowingDate)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Health Status</p>
                    <p className="mt-1 font-semibold text-green-700">
                      {crop.health >= 80
                        ? "Healthy"
                        : crop.health >= 60
                          ? "Needs Monitoring"
                          : "High Attention"}
                    </p>
                  </div>
                </div>

                <div className="mt-5">
                  <div className="mb-2 flex justify-between text-xs">
                    <span className="text-gray-500">Crop Health</span>
                    <span className="font-semibold text-gray-700">
                      {crop.health}%
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-green-500"
                      style={{ width: `${crop.health}%` }}
                    />
                  </div>
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/farmer/scan"
                    className="flex-1 rounded-xl bg-green-700 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-green-800"
                  >
                    📷 Scan {crop.name}
                  </Link>

                  <Link
                    href="/farmer/risk"
                    className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-center text-sm font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    View Crop Risk
                  </Link>

                  <Link
                    href="/farmer/history"
                    className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-center text-sm font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Scan History
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Farm Monitoring */}
        <section className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="text-2xl">🌦️</div>

            <h3 className="mt-3 font-bold text-gray-900">
              Weather Conditions
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Current conditions for {farm.location}.
            </p>

            <div className="mt-5 flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">28°C</p>
                <p className="text-sm text-gray-500">Cloudy</p>
              </div>

              <p className="text-sm font-semibold text-blue-600">
                70% rain chance
              </p>
            </div>

            <Link
              href="/farmer/weather"
              className="mt-5 block rounded-xl border border-gray-200 px-4 py-3 text-center text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              View Weather
            </Link>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="text-2xl">⚠️</div>

            <h3 className="mt-3 font-bold text-gray-900">
              Crop Risk
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Disease and pest risk based on current conditions.
            </p>

            <div className="mt-5 rounded-xl bg-yellow-50 p-4">
              <p className="text-sm font-semibold text-yellow-800">
                Moderate Risk
              </p>

              <p className="mt-1 text-xs text-yellow-700">
                High humidity may increase fungal disease risk.
              </p>
            </div>

            <Link
              href="/farmer/risk"
              className="mt-5 block rounded-xl border border-gray-200 px-4 py-3 text-center text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              View Risk Details
            </Link>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="text-2xl">📷</div>

            <h3 className="mt-3 font-bold text-gray-900">
              Crop Monitoring
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Keep track of crop health through regular scans.
            </p>

            <div className="mt-5 rounded-xl bg-green-50 p-4">
              <p className="text-sm font-semibold text-green-800">
                Last scan
              </p>

              <p className="mt-1 text-xs text-green-700">
                No recent scan recorded.
              </p>
            </div>

            <Link
              href="/farmer/scan"
              className="mt-5 block rounded-xl bg-green-700 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-green-800"
            >
              Start New Scan
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
