"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import FarmerHeader from "@/components/farmer/FarmerHeader";

type Farm = {
  id: string;
  name: string;
  location: string;
  crops: {
    name: string;
    variety?: string;
    stage?: string;
    health?: number;
  }[];
};

const defaultFarms: Farm[] = [
  {
    id: "main-farm",
    name: "Main Farm",
    location: "Nashik, Maharashtra",
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
    crops: [
      {
        name: "Soybean",
        variety: "JS 335",
        stage: "Vegetative",
        health: 68,
      },
    ],
  },
  {
    id: "north-farm",
    name: "North Farm",
    location: "Dindori, Maharashtra",
    crops: [
      {
        name: "Onion",
        variety: "Local Variety",
        stage: "Vegetative",
        health: 91,
      },
    ],
  },
  {
    id: "west-farm",
    name: "West Farm",
    location: "Sinnar, Maharashtra",
    crops: [
      {
        name: "Maize",
        variety: "Hybrid Maize",
        stage: "Vegetative",
        health: 76,
      },
    ],
  },
];

function CropRiskContent() {
  const searchParams = useSearchParams();
  const farmFromUrl = searchParams.get("farm");
  const [farms, setFarms] = useState<Farm[]>(defaultFarms);
  const [selectedFarmId, setSelectedFarmId] = useState("main-farm");

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

  }, []);

  useEffect(() => {
    if (farmFromUrl) {
      setSelectedFarmId(farmFromUrl);
    }
  }, [farmFromUrl]);

  const selectedFarm =
    farms.find((farm) => farm.id === selectedFarmId) || null;

  const selectedCrop = selectedFarm?.crops?.[0];

  const riskData: Record<
    string,
    {
      overall: number;
      disease: number;
      pest: number;
      weather: number;
    }
  > = {
    "main-farm": {
      overall: 72,
      disease: 78,
      pest: 63,
      weather: 71,
    },
    "east-farm": {
      overall: 58,
      disease: 54,
      pest: 61,
      weather: 57,
    },
    "north-farm": {
      overall: 34,
      disease: 32,
      pest: 28,
      weather: 41,
    },
    "west-farm": {
      overall: 56,
      disease: 49,
      pest: 57,
      weather: 52,
    },
  };

  const selectedRisk =
    riskData[selectedFarmId] || {
      overall: 45,
      disease: 42,
      pest: 47,
      weather: 44,
    };

  const overallRisk = selectedRisk.overall;
  const diseaseRisk = selectedRisk.disease;
  const pestRisk = selectedRisk.pest;
  const weatherRisk = selectedRisk.weather;

  const riskLabel =
    overallRisk >= 70 ? "High Risk" : overallRisk >= 50 ? "Moderate Risk" : "Low Risk";

  const riskDescription =
    overallRisk >= 70
      ? "Conditions are favourable for crop-health problems. Increase monitoring."
      : "Some risk factors are present. Continue regular monitoring.";

  return (
    <main className="min-h-screen w-full max-w-full overflow-x-hidden w-full overflow-x-hidden bg-gray-50">
      <FarmerHeader />

      <div className="w-full max-w-none px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Crop Risk Forecast
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Understand disease, pest and weather risks affecting your crop.
            </p>
          </div>

          <Link
            href="/farmer/scan"
            className="inline-flex w-fit rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white hover:bg-green-800"
          >
            📷 Scan Crop
          </Link>
        </div>

        {/* Farm selector */}
        <section className="mt-6 rounded-2xl bg-white p-5 shadow-sm sm:p-6">
          <label className="text-sm font-semibold text-gray-700">
            Select Farm
          </label>

          <select
            value={selectedFarmId}
            onChange={(event) => {
              setSelectedFarmId(event.target.value);
            }}
            className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-green-600 sm:max-w-md"
          >
            {farms.map((farm) => (
              <option key={farm.id} value={farm.id}>
                {farm.name} — {farm.location}
              </option>
            ))}
          </select>
        </section>

        {/* Main risk */}
        <section className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 sm:p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
                {riskLabel.toUpperCase()}
              </span>

              <h2 className="mt-3 text-2xl font-bold text-gray-900 sm:text-3xl">
                {selectedCrop?.name || "Crop"} Risk Score
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
                {riskDescription}
              </p>

              <div className="mt-3 text-sm text-gray-500">
                {selectedFarm?.name} · {selectedFarm?.location}
              </div>
            </div>

            <div className="flex h-36 w-36 shrink-0 flex-col items-center justify-center rounded-full border-8 border-red-200 bg-white">
              <span className="text-4xl font-bold text-red-700">
                {overallRisk}
              </span>
              <span className="text-xs font-semibold text-gray-500">
                / 100
              </span>
            </div>
          </div>
        </section>

        {/* Risk factors */}
        <section className="mt-6">
          <h2 className="text-lg font-bold text-gray-900">
            Risk Factors
          </h2>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            <RiskCard
              icon="🦠"
              title="Disease Risk"
              score={diseaseRisk}
              description="Disease conditions based on crop and recent observations."
            />

            <RiskCard
              icon="🐛"
              title="Pest Risk"
              score={pestRisk}
              description="Potential pest pressure based on environmental conditions."
            />

            <RiskCard
              icon="🌧️"
              title="Weather Risk"
              score={weatherRisk}
              description="Rainfall, humidity and temperature can influence crop health."
            />
          </div>
        </section>

        {/* Crop factors */}
        <section className="mt-6 rounded-2xl bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-bold text-gray-900">
            🌱 Crop & Farm Factors
          </h2>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Factor label="Crop" value={selectedCrop?.name || "Not specified"} />
            <Factor
              label="Variety"
              value={selectedCrop?.variety || "Not specified"}
            />
            <Factor
              label="Growth Stage"
              value={selectedCrop?.stage || "Not specified"}
            />
            <Factor
              label="Crop Health"
              value={`${selectedCrop?.health ?? 0}%`}
            />
          </div>
        </section>

        {/* Why risk is elevated */}
        <section className="mt-6 rounded-2xl bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-bold text-gray-900">
            ⚠️ Why is the risk elevated?
          </h2>

          <div className="mt-4 space-y-3">
            <RiskReason
              icon="💧"
              title="High humidity"
              description="Moist conditions can increase the likelihood of some fungal and disease problems."
            />

            <RiskReason
              icon="🌧️"
              title="Rain expected"
              description="Recent or upcoming rainfall can change disease and pest pressure."
            />

            <RiskReason
              icon="🌱"
              title="Crop growth stage"
              description={`The current ${selectedCrop?.stage || "growth"} stage can influence susceptibility to certain crop-health problems.`}
            />

            <RiskReason
              icon="📷"
              title="Recent crop observations"
              description="Previous scan results can be combined with weather and farm information to improve risk assessment."
            />
          </div>
        </section>

        {/* Trend */}
        <section className="mt-6 rounded-2xl bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                📈 Risk Trend
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Example risk trend for the last 7 days.
              </p>
            </div>

            <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
              Increasing
            </span>
          </div>

          <div className="mt-5 grid grid-cols-7 gap-2">
            {[42, 45, 49, 55, 61, 67, overallRisk].map((value, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                <div className="flex h-40 w-full items-end justify-center rounded-lg bg-gray-50">
                  <div
                    className="w-3/5 rounded-t-md bg-green-600"
                    style={{ height: `${Math.max(value, 8)}%` }}
                  />
                </div>

                <span className="text-xs text-gray-500">
                  {index === 6 ? "Today" : `D-${6 - index}`}
                </span>

                <span className="text-xs font-bold text-gray-700">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Recommended actions */}
        <section className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-5 sm:p-6">
          <h2 className="text-lg font-bold text-gray-900">
            💡 Recommended Preventive Actions
          </h2>

          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            <Action
              icon="🔎"
              text="Inspect the crop regularly for new symptoms."
            />

            <Action
              icon="📷"
              text="Repeat crop scans if symptoms change or spread."
            />

            <Action
              icon="💧"
              text="Monitor drainage and avoid unnecessary irrigation."
            />

            <Action
              icon="🐛"
              text="Check leaves and field edges for pest activity."
            />

            <Action
              icon="🌦️"
              text="Use weather warnings to plan field monitoring."
            />

            <Action
              icon="👨‍🌾"
              text="Request expert validation when risk becomes high."
            />
          </div>
        </section>

        {/* Bottom actions */}
        <section className="mt-6 rounded-2xl bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-bold text-gray-900">
            Take Action
          </h2>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              href="/farmer/scan"
              className="rounded-xl bg-green-700 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-green-800"
            >
              📷 Scan Crop
            </Link>

            <Link
              href="/farmer/weather"
              className="rounded-xl border border-gray-200 px-4 py-3 text-center text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              🌦️ View Weather
            </Link>

            <Link
              href="/farmer/alerts"
              className="rounded-xl border border-gray-200 px-4 py-3 text-center text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              🔔 View Alerts
            </Link>

            <Link
              href="/farmer/expert-review"
              className="rounded-xl border border-gray-200 px-4 py-3 text-center text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              👨‍🌾 Expert Review
            </Link>
          </div>
        </section>

        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4 text-xs leading-5 text-gray-500">
          <strong className="text-gray-700">Risk engine:</strong>{" "}
          This demo score is based on mock data. The final agrossential risk
          engine can combine AI results, weather, crop stage, soil, farm
          history, pest observations and sensor data.
        </div>
      </div>
    </main>
  );
}

function RiskCard({
  icon,
  title,
  score,
  description,
}: {
  icon: string;
  title: string;
  score: number;
  description: string;
}) {
  const label =
    score >= 70 ? "High" : score >= 50 ? "Moderate" : "Low";

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-2xl">{icon}</span>

        <span
          className={`rounded-full px-2.5 py-1 text-xs font-bold ${
            score >= 70
              ? "bg-red-100 text-red-700"
              : score >= 50
                ? "bg-yellow-100 text-yellow-700"
                : "bg-green-100 text-green-700"
          }`}
        >
          {label}
        </span>
      </div>

      <h3 className="mt-4 font-bold text-gray-900">{title}</h3>

      <div className="mt-2 flex items-end gap-1">
        <span className="text-3xl font-bold text-gray-900">{score}</span>
        <span className="mb-1 text-sm text-gray-500">/ 100</span>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-green-600"
          style={{ width: `${score}%` }}
        />
      </div>

      <p className="mt-3 text-xs leading-5 text-gray-500">{description}</p>
    </div>
  );
}

function Factor({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-gray-50 p-4">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="mt-1 font-semibold text-gray-900">{value}</p>
    </div>
  );
}

function RiskReason({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-3 rounded-xl bg-gray-50 p-4">
      <span className="text-xl">{icon}</span>

      <div>
        <p className="font-semibold text-gray-900">{title}</p>
        <p className="mt-1 text-sm leading-5 text-gray-600">
          {description}
        </p>
      </div>
    </div>
  );
}

function Action({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex gap-3 rounded-xl bg-white p-4">
      <span className="text-xl">{icon}</span>
      <p className="text-sm leading-5 text-gray-700">{text}</p>
    </div>
  );
}


export default function CropRiskPage() {
  return (
    <Suspense fallback={<div className="min-h-screen w-full max-w-full overflow-x-hidden bg-slate-50" />}>
      <CropRiskContent />
    </Suspense>
  );
}
