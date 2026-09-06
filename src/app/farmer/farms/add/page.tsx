"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AddFarmPage() {
  const router = useRouter();

  const [farmName, setFarmName] = useState("");
  const [village, setVillage] = useState("");
  const [district, setDistrict] = useState("");
  const [state, setState] = useState("Maharashtra");
  const [area, setArea] = useState("");
  const [areaUnit, setAreaUnit] = useState("Acres");
  const [crop, setCrop] = useState("");
  const [variety, setVariety] = useState("");
  const [sowingDate, setSowingDate] = useState("");
  const [soil, setSoil] = useState("");
  const [irrigation, setIrrigation] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (
      !farmName ||
      !village ||
      !district ||
      !area ||
      !crop ||
      !variety ||
      !sowingDate
    ) {
      alert("Please fill all required farm and crop details.");
      return;
    }

    const newFarm = {
      id: `farm-${Date.now()}`,
      name: farmName,
      location: `${district}, ${state}`,
      village,
      area: `${area} ${areaUnit.toLowerCase()}`,
      soil: soil || "Not specified",
      irrigation: irrigation || "Not specified",
      crops: [
        {
          name: crop,
          variety,
          sowingDate,
          stage: "Recently Sown",
          health: 100,
        },
      ],
    };

    const existingFarms = JSON.parse(
      localStorage.getItem("agrossential-farms") || "[]"
    );

    localStorage.setItem(
      "agrossential-farms",
      JSON.stringify([...existingFarms, newFarm])
    );

    router.push("/farmer/farms");
  }

  return (
    <main className="min-h-screen w-full max-w-full overflow-x-hidden w-full overflow-x-hidden bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-none">
        <Link
          href="/farmer/farms"
          className="text-sm font-medium text-green-700 hover:underline"
        >
          ← Back to My Farms
        </Link>

        <div className="mt-5 rounded-2xl bg-white p-5 shadow-sm sm:p-8">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Add New Farm
          </h1>

          <p className="mt-2 text-sm text-gray-900">
            Add your farm and crop details to start monitoring crop health.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6 text-gray-900">
            {/* Farm Information */}
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Farm Information
              </h2>

              <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-gray-900">
                    Farm Name *
                  </label>

                  <input
                    required
                    value={farmName}
                    onChange={(e) => setFarmName(e.target.value)}
                    type="text"
                    placeholder="e.g. North Farm"
                    className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 outline-none focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-900">
                    Village *
                  </label>

                  <input
                    required
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    type="text"
                    placeholder="Village name"
                    className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 outline-none focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-900">
                    District *
                  </label>

                  <input
                    required
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    type="text"
                    placeholder="e.g. Nashik"
                    className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 outline-none focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-900">
                    State *
                  </label>

                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none focus:border-green-500"
                  >
                    <option>Maharashtra</option>
                    <option>Telangana</option>
                    <option>Karnataka</option>
                    <option>Andhra Pradesh</option>
                    <option>Gujarat</option>
                    <option>Madhya Pradesh</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-900">
                    Farm Area *
                  </label>

                  <div className="mt-2 flex gap-2">
                    <input
                      required
                      min="0"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      type="number"
                      placeholder="5"
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-500"
                    />

                    <select
                      value={areaUnit}
                      onChange={(e) => setAreaUnit(e.target.value)}
                      className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none"
                    >
                      <option>Acres</option>
                      <option>Hectares</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Crop Information */}
            <div className="border-t pt-6">
              <h2 className="text-lg font-bold text-gray-900">
                Crop Information
              </h2>

              <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-gray-900">
                    Crop *
                  </label>

                  <select
                    required
                    value={crop}
                    onChange={(e) => setCrop(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none focus:border-green-500"
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
                  <label className="text-sm font-medium text-gray-900">
                    Variety *
                  </label>

                  <input
                    required
                    value={variety}
                    onChange={(e) => setVariety(e.target.value)}
                    type="text"
                    placeholder="e.g. Bt Cotton"
                    className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 outline-none focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-900">
                    Sowing Date *
                  </label>

                  <input
                    required
                    value={sowingDate}
                    onChange={(e) => setSowingDate(e.target.value)}
                    type="date"
                    className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 outline-none focus:border-green-500"
                  />
                </div>
              </div>
            </div>

            {/* Field Information */}
            <div className="border-t pt-6">
              <h2 className="text-lg font-bold text-gray-900">
                Field Information
              </h2>

              <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-gray-900">
                    Soil Type
                  </label>

                  <select
                    value={soil}
                    onChange={(e) => setSoil(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none focus:border-green-500"
                  >
                    <option value="">Select soil type</option>
                    <option>Black Soil</option>
                    <option>Red Soil</option>
                    <option>Alluvial Soil</option>
                    <option>Loamy Soil</option>
                    <option>Sandy Soil</option>
                    <option>Clay Soil</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-900">
                    Irrigation Method
                  </label>

                  <select
                    value={irrigation}
                    onChange={(e) => setIrrigation(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none focus:border-green-500"
                  >
                    <option value="">Select irrigation</option>
                    <option>Drip Irrigation</option>
                    <option>Sprinkler</option>
                    <option>Borewell</option>
                    <option>Canal</option>
                    <option>Rainfed</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="border-t pt-6">
              <h2 className="text-lg font-bold text-gray-900">
                Farm Location
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Farm location will later be used for weather and disease-risk
                analysis.
              </p>

              <button
                type="button"
                className="mt-4 w-full rounded-xl border-2 border-dashed border-green-200 bg-green-50 px-4 py-5 text-sm font-semibold text-green-700 hover:bg-green-100"
              >
                📍 Use Current Location
              </button>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 border-t pt-6 sm:flex-row sm:justify-end">
              <Link
                href="/farmer/farms"
                className="rounded-xl border border-gray-200 px-6 py-3 text-center text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Link>

              <button
                type="submit"
                className="rounded-xl bg-green-700 px-6 py-3 text-sm font-semibold text-white hover:bg-green-800"
              >
                Save Farm
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
