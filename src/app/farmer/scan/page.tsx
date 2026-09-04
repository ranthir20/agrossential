"use client";

import { ChangeEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import FarmerHeader from "@/components/farmer/FarmerHeader";

type Crop = {
  id: string;
  crop: string;
  variety: string | null;
  sowingDate?: string;
  growthStage: string | null;
  cropHealth: string | null;
};

type Farm = {
  id: string;
  farmName: string;
  village: string | null;
  district: string | null;
  state: string | null;
  Crop: Crop[];
};

const DEMO_FARMER_ID = "test-farmer";

export default function ScanPage() {
  const router = useRouter();

  const [farms, setFarms] = useState<Farm[]>([]);
  const [selectedFarmId, setSelectedFarmId] = useState("");
  const [selectedCropId, setSelectedCropId] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [notes, setNotes] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingFarms, setLoadingFarms] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadFarms() {
      try {
        setLoadingFarms(true);
        setError("");

        const response = await fetch(
          `/api/farms?farmerId=${encodeURIComponent(DEMO_FARMER_ID)}`
        );

        if (!response.ok) {
          throw new Error("Failed to load farms");
        }

        const data: Farm[] = await response.json();

        setFarms(data);

        if (data.length > 0) {
          setSelectedFarmId(data[0].id);

          if (data[0].Crop.length > 0) {
            setSelectedCropId(data[0].Crop[0].id);
          }
        }
      } catch (err) {
        console.error(err);
        setError("Unable to load your farms.");
      } finally {
        setLoadingFarms(false);
      }
    }

    loadFarms();
  }, []);

  const selectedFarm = farms.find(
    (farm) => farm.id === selectedFarmId
  );

  const selectedCrop =
    selectedFarm?.Crop.find(
      (crop) => crop.id === selectedCropId
    ) ?? null;

  function handleFarmChange(value: string) {
    setSelectedFarmId(value);

    const farm = farms.find((item) => item.id === value);

    setSelectedCropId(
      farm?.Crop.length ? farm.Crop[0].id : ""
    );
  }

  function handleImageChange(
    e: ChangeEvent<HTMLInputElement>
  ) {
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

  async function createDiseaseReport() {
    if (!selectedFarm || !selectedCrop) {
      alert("Please select a farm and crop.");
      return;
    }

    if (!image) {
      alert("Please upload a crop image first.");
      return;
    }

    try {
      setIsAnalyzing(true);
      setError("");

      /*
       * Temporary AI result.
       * This will be replaced by the real ML prediction
       * once the AI model is connected.
       */
      const response = await fetch(
        "/api/disease-reports",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cropId: selectedCrop.id,
            imageUrl: image,
            predictedDisease: "Pending AI Analysis",
            confidence: null,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to create disease report"
        );
      }

      const scanData = {
        id: data.id,
        reportId: data.id,
        farmId: selectedFarm.id,
        farmName: selectedFarm.farmName,
        cropId: selectedCrop.id,
        crop: selectedCrop.crop,
        variety: selectedCrop.variety,
        image,
        fileName,
        notes,
        date: data.createdAt,
        status: data.status,
      };

      localStorage.setItem(
        "agrossential-current-scan",
        JSON.stringify(scanData)
      );

      router.push("/farmer/results");
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to submit crop scan."
      );
    } finally {
      setIsAnalyzing(false);
    }
  }

  async function handleDemoScan() {
    if (!selectedFarm || !selectedCrop) {
      alert("Please select a farm and crop first.");
      return;
    }

    try {
      setIsAnalyzing(true);
      setError("");

      const response = await fetch(
        "/api/disease-reports",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cropId: selectedCrop.id,
            imageUrl: null,
            predictedDisease: "Demo: Early Blight",
            confidence: 0.91,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to create demo report"
        );
      }

      const demoScan = {
        id: data.id,
        reportId: data.id,
        farmId: selectedFarm.id,
        farmName: selectedFarm.farmName,
        cropId: selectedCrop.id,
        crop: selectedCrop.crop,
        variety: selectedCrop.variety,
        image: "",
        fileName: "Demo crop scan",
        notes:
          "Demo scan for testing the agrossential farmer-to-expert flow.",
        date: data.createdAt,
        status: data.status,
      };

      localStorage.setItem(
        "agrossential-current-scan",
        JSON.stringify(demoScan)
      );

      router.push("/farmer/results");
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to create demo scan."
      );
    } finally {
      setIsAnalyzing(false);
    }
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

        <div className="mt-5">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Scan Crop
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Upload a clear crop or leaf image for AI-powered
            health analysis.
          </p>
        </div>

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

        {error && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-5">
          <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-6 lg:col-span-2">
            <h2 className="text-lg font-bold text-gray-900">
              Select Farm & Crop
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              This helps us give farm-specific analysis.
            </p>

            {loadingFarms ? (
              <div className="mt-6 rounded-xl bg-gray-50 p-4 text-sm text-gray-500">
                Loading your farms...
              </div>
            ) : farms.length === 0 ? (
              <div className="mt-6 rounded-xl bg-yellow-50 p-4 text-sm text-yellow-700">
                No farms found. Add a farm first.
              </div>
            ) : (
              <div className="mt-6 space-y-5">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Farm
                  </label>

                  <select
                    value={selectedFarmId}
                    onChange={(e) =>
                      handleFarmChange(e.target.value)
                    }
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-green-500"
                  >
                    {farms.map((farm) => (
                      <option key={farm.id} value={farm.id}>
                        {farm.farmName} —{" "}
                        {[
                          farm.district,
                          farm.state,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Crop
                  </label>

                  {selectedFarm?.Crop.length ? (
                    <select
                      value={selectedCropId}
                      onChange={(e) =>
                        setSelectedCropId(e.target.value)
                      }
                      className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-green-500"
                    >
                      {selectedFarm.Crop.map((crop) => (
                        <option
                          key={crop.id}
                          value={crop.id}
                        >
                          {crop.crop}
                          {crop.variety
                            ? ` — ${crop.variety}`
                            : ""}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="mt-2 rounded-xl bg-yellow-50 p-4 text-sm text-yellow-700">
                      No crops found for this farm.
                    </div>
                  )}
                </div>

                {selectedCrop && (
                  <div className="rounded-xl bg-green-50 p-4">
                    <p className="text-xs font-medium text-green-700">
                      Selected Crop
                    </p>

                    <p className="mt-1 font-bold text-gray-900">
                      🌱 {selectedCrop.crop}
                    </p>

                    <p className="mt-1 text-xs text-gray-600">
                      Variety:{" "}
                      {selectedCrop.variety || "—"}
                    </p>

                    <p className="mt-1 text-xs text-gray-600">
                      Stage:{" "}
                      {selectedCrop.growthStage || "—"}
                    </p>
                  </div>
                )}
              </div>
            )}
          </section>

          <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-6 lg:col-span-3">
            <h2 className="text-lg font-bold text-gray-900">
              Upload Crop Image
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              For better results, upload a clear photo of the
              affected leaf, stem or crop.
            </p>

            {!image ? (
              <label className="mt-6 flex min-h-72 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-green-200 bg-green-50/50 p-6 text-center transition hover:bg-green-50">
                <div className="text-5xl">📷</div>

                <h3 className="mt-4 font-bold text-gray-900">
                  Upload Crop Image
                </h3>

                <p className="mt-2 max-w-sm text-sm text-gray-500">
                  Take a photo or choose an image from your
                  device.
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

            <div className="mt-6">
              <label className="text-sm font-medium text-gray-700">
                Symptoms / Additional Notes{" "}
                <span className="font-normal text-gray-400">
                  (optional)
                </span>
              </label>

              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Example: Yellow spots appeared on leaves 3 days ago..."
                className="mt-2 w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-green-500"
              />
            </div>

            <button
              type="button"
              onClick={createDiseaseReport}
              disabled={
                !image ||
                !selectedCrop ||
                isAnalyzing
              }
              className="mt-5 w-full rounded-xl bg-green-700 px-5 py-4 text-sm font-bold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              {isAnalyzing
                ? "🔍 Submitting Scan..."
                : "🔍 Analyze Crop"}
            </button>

            <button
              type="button"
              onClick={handleDemoScan}
              disabled={!selectedCrop || isAnalyzing}
              className="mt-3 w-full rounded-xl border border-dashed border-green-300 bg-green-50 px-5 py-3 text-sm font-semibold text-green-700 hover:bg-green-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              🧪 Try Demo Scan
            </button>

            <p className="mt-2 text-center text-xs text-gray-400">
              Demo Scan creates a real database report so you
              can test the Farmer → Expert workflow.
            </p>

            <p className="mt-3 text-center text-xs text-gray-400">
              AI analysis is a decision-support tool. Confirm
              uncertain cases with an agriculture expert.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
