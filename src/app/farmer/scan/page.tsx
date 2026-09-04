"use client";

import { ChangeEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  crops: Crop[];
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

export default function ScanPage() {
  const router = useRouter();

  const [farms, setFarms] = useState<Farm[]>(defaultFarms);
  const [selectedFarmId, setSelectedFarmId] = useState("");
  const [selectedCropIndex, setSelectedCropIndex] = useState("0");
  const [image, setImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [notes, setNotes] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const savedFarms: Farm[] = JSON.parse(
      localStorage.getItem("agrossential-farms") || "[]"
    );

    const combined = [...defaultFarms, ...savedFarms];

    setFarms(combined);

    if (combined.length > 0) {
      setSelectedFarmId(combined[0].id);
    }
  }, []);

  const selectedFarm = farms.find((farm) => farm.id === selectedFarmId);

  const selectedCrop =
    selectedFarm?.crops[Number(selectedCropIndex)] ?? null;

  function handleFarmChange(value: string) {
    setSelectedFarmId(value);
    setSelectedCropIndex("0");
  }

  function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    setFileName(file.name);

    const reader = new FileReader();

    reader.onload = () => {
      setImage(reader.result as string);
    };

    reader.readAsDataURL(file);
  }

  function removeImage() {
    setImage(null);
    setFileName("");
  }

  function handleAnalyze() {
    if (!selectedFarm || !selectedCrop) {
      alert("Please select a farm and crop.");
      return;
    }

    if (!image) {
      alert("Please upload a crop image first.");
      return;
    }

    setIsAnalyzing(true);

    const scanData = {
      id: `scan-${Date.now()}`,
      farmId: selectedFarm.id,
      farmName: selectedFarm.name,
      crop: selectedCrop.name,
      variety: selectedCrop.variety,
      image,
      fileName,
      notes,
      date: new Date().toISOString(),
    };

    localStorage.setItem(
      "agrossential-current-scan",
      JSON.stringify(scanData)
    );

    setTimeout(() => {
      router.push("/farmer/results");
    }, 1200);
  }

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-gray-50">
      <FarmerHeader />

      <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <Link
          href="/farmer/dashboard"
          className="text-sm font-medium text-green-700 hover:underline"
        >
          ← Back to Dashboard
        </Link>

        {/* Header */}
        <div className="mt-5">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Scan Crop
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Upload a clear crop or leaf image for AI-powered health analysis.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="mt-6 grid grid-cols-3 gap-2">
          <div className="rounded-xl bg-green-700 px-3 py-3 text-center text-xs font-semibold text-white sm:text-sm">
            1. Select Crop
          </div>

          <div
            className={`rounded-xl px-3 py-3 text-center text-xs font-semibold sm:text-sm ${
              image
                ? "bg-green-100 text-green-700"
                : "bg-white text-gray-400"
            }`}
          >
            2. Upload Image
          </div>

          <div className="rounded-xl bg-white px-3 py-3 text-center text-xs font-semibold text-gray-400 sm:text-sm">
            3. Get Result
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-5">
          {/* Left - Crop Selection */}
          <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-6 lg:col-span-2">
            <h2 className="text-lg font-bold text-gray-900">
              Select Farm & Crop
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              This helps us give farm-specific analysis.
            </p>

            <div className="mt-6 space-y-5">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Farm
                </label>

                <select
                  value={selectedFarmId}
                  onChange={(e) => handleFarmChange(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-green-500"
                >
                  {farms.map((farm) => (
                    <option key={farm.id} value={farm.id}>
                      {farm.name} — {farm.location}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Crop
                </label>

                {selectedFarm?.crops.length ? (
                  <select
                    value={selectedCropIndex}
                    onChange={(e) => setSelectedCropIndex(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-green-500"
                  >
                    {selectedFarm.crops.map((crop, index) => (
                      <option key={`${crop.name}-${index}`} value={index}>
                        {crop.name} — {crop.variety}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="mt-2 rounded-xl bg-yellow-50 p-4 text-sm text-yellow-700">
                    No crops found for this farm. Add a crop first.
                  </div>
                )}
              </div>

              {selectedCrop && (
                <div className="rounded-xl bg-green-50 p-4">
                  <p className="text-xs font-medium text-green-700">
                    Selected Crop
                  </p>

                  <p className="mt-1 font-bold text-gray-900">
                    🌱 {selectedCrop.name}
                  </p>

                  <p className="mt-1 text-xs text-gray-600">
                    Variety: {selectedCrop.variety}
                  </p>

                  <p className="mt-1 text-xs text-gray-600">
                    Stage: {selectedCrop.stage}
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Right - Image Upload */}
          <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-6 lg:col-span-3">
            <h2 className="text-lg font-bold text-gray-900">
              Upload Crop Image
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              For better results, upload a clear photo of the affected leaf,
              stem or crop.
            </p>

            {!image ? (
              <label className="mt-6 flex min-h-72 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-green-200 bg-green-50/50 p-6 text-center transition hover:bg-green-50">
                <div className="text-5xl">📷</div>

                <h3 className="mt-4 font-bold text-gray-900">
                  Upload Crop Image
                </h3>

                <p className="mt-2 max-w-sm text-sm text-gray-500">
                  Take a photo or choose an image from your device.
                </p>

                <span className="mt-5 rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white">
                  Choose Image
                </span>

                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="mt-6">
                <div className="relative overflow-hidden rounded-2xl border bg-gray-100">
                  <img
                    src={image}
                    alt="Selected crop"
                    className="max-h-[420px] w-full object-contain"
                  />
                </div>

                <div className="mt-3 flex items-center justify-between gap-3">
                  <p className="truncate text-sm text-gray-600">
                    📎 {fileName}
                  </p>

                  <button
                    type="button"
                    onClick={removeImage}
                    className="shrink-0 rounded-lg px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}

            {/* Notes */}
            <div className="mt-6">
              <label className="text-sm font-medium text-gray-700">
                Symptoms / Additional Notes{" "}
                <span className="font-normal text-gray-400">(optional)</span>
              </label>

              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Example: Yellow spots appeared on leaves 3 days ago..."
                className="mt-2 w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-green-500"
              />
            </div>

            {/* Analyze */}
            <button
              type="button"
              onClick={handleAnalyze}
              disabled={!image || !selectedCrop || isAnalyzing}
              className="mt-5 w-full rounded-xl bg-green-700 px-5 py-4 text-sm font-bold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              {isAnalyzing ? "🔍 Analyzing Crop..." : "🔍 Analyze Crop"}
            </button>

            <button
              type="button"
              onClick={() => {
                if (!selectedFarm || !selectedCrop) {
                  alert("Please select a farm and crop first.");
                  return;
                }

                const demoScan = {
                  id: `scan-${Date.now()}`,
                  farmId: selectedFarm.id,
                  farmName: selectedFarm.name,
                  crop: selectedCrop.name,
                  variety: selectedCrop.variety,
                  image: "",
                  fileName: "Demo crop scan",
                  notes: "Demo scan for testing the agrossential frontend.",
                  date: new Date().toISOString(),
                };

                localStorage.setItem(
                  "agrossential-current-scan",
                  JSON.stringify(demoScan)
                );

                router.push("/farmer/results");
              }}
              className="mt-3 w-full rounded-xl border border-dashed border-green-300 bg-green-50 px-5 py-3 text-sm font-semibold text-green-700 hover:bg-green-100"
            >
              🧪 Try Demo Scan
            </button>

            <p className="mt-2 text-center text-xs text-gray-400">
              No crop photo? Use Demo Scan to test the complete flow.
            </p>

            <p className="mt-3 text-center text-xs text-gray-400">
              AI analysis is a decision-support tool. Confirm uncertain cases
              with an agriculture expert.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
