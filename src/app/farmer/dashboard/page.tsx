"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import FarmerHeader from "@/components/farmer/FarmerHeader";

const farms = [
  {
    name: "Main Farm",
    location: "Nashik, Maharashtra",
    area: "5 acres",
    crop: "Cotton",
    health: 82,
  },
  {
    name: "East Farm",
    location: "Nashik, Maharashtra",
    area: "3 acres",
    crop: "Soybean",
    health: 68,
  },
];

const defaultAlerts = [
  {
    title: "High Disease Risk",
    description: "Weather conditions may increase fungal disease risk.",
    type: "High",
  },
  {
    title: "Pest Activity Detected",
    description: "Increased pest activity reported in your region.",
    type: "Medium",
  },
];

export default function FarmerDashboard() {
  const [alerts, setAlerts] = useState(defaultAlerts);
  const [greeting, setGreeting] = useState("Good morning");
  const [userLocation, setUserLocation] = useState({
    city: "Detecting...",
    state: "",
    country: "",
  });

  useEffect(() => {
    const useIpLocation = async () => {
      try {
        const response = await fetch("/api/location", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("IP location failed");
        }

        const data = await response.json();

        setUserLocation({
          city: data.city || "Unknown location",
          state: data.state || "",
          country: data.country || "",
        });
      } catch {
        setUserLocation({
          city: "Location unavailable",
          state: "",
          country: "",
        });
      }
    };

    if (!navigator.geolocation) {
      useIpLocation();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
          );

          if (!response.ok) {
            throw new Error("Reverse geocoding failed");
          }

          const data = await response.json();
          const address = data.address || {};

          setUserLocation({
            city:
              address.city ||
              address.town ||
              address.village ||
              address.municipality ||
              "Unknown location",
            state: address.state || "",
            country: address.country || "",
          });
        } catch {
          useIpLocation();
        }
      },
      () => {
        useIpLocation();
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  }, []);

  useEffect(() => {
    const hour = new Date().getHours();

    if (hour < 12) {
      setGreeting("Good morning");
    } else if (hour < 17) {
      setGreeting("Good afternoon");
    } else {
      setGreeting("Good evening");
    }
  }, []);

  useEffect(() => {
    const loadAlerts = () => {
      const saved = localStorage.getItem("agrossential-alerts");

      if (saved) {
        try {
          const savedAlerts = JSON.parse(saved);
          setAlerts(savedAlerts);
        } catch {
          setAlerts(defaultAlerts);
        }
      } else {
        setAlerts(defaultAlerts);
      }
    };

    loadAlerts();

    window.addEventListener("focus", loadAlerts);

    return () => {
      window.removeEventListener("focus", loadAlerts);
    };
  }, []);

  const unreadAlerts = alerts.filter(
    (alert) => (alert as { read?: boolean }).read !== true
  );

  return (
    <main className="min-h-screen w-full max-w-full overflow-x-hidden w-full overflow-x-hidden bg-gray-50">
      <FarmerHeader />

      <div className="w-full px-4 py-6 sm:px-6 lg:px-8 xl:px-12">
        {/* Welcome */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            {greeting}, Farmer 👋
          </h2>
          <p className="mt-2 text-sm text-gray-600 sm:text-base">
            Monitor your farms, detect crop problems early, and get actionable
            recommendations.
          </p>
        </section>

        {/* Location & Weather */}
        <section className="mb-8 grid w-full grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Location */}
          <div className="rounded-2xl bg-white p-5 shadow-sm lg:col-span-1 sm:p-6">
            <p className="text-sm font-medium text-gray-500">Your Location</p>

            <div className="mt-4 flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-100 text-2xl">
                📍
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {userLocation.city}
                </h3>
                <p className="text-sm text-gray-500">
                  {[userLocation.state, userLocation.country]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>
            </div>

            <div className="mt-4 border-t pt-4">
              <p className="text-xs text-gray-500">Farm monitoring area</p>
              <p className="mt-1 font-semibold text-gray-800">
                8 acres across 2 farms
              </p>
            </div>
          </div>

          {/* Weather */}
          <div className="rounded-2xl bg-white p-5 shadow-sm lg:col-span-2 sm:p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="text-5xl">☁️</div>

                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Today&apos;s Weather
                  </p>
                  <h3 className="mt-1 text-3xl font-bold text-gray-900">
                    28°C
                  </h3>
                  <p className="text-sm text-gray-500">
                    Partly cloudy
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-5 text-center sm:gap-8">
                <div>
                  <p className="text-xs text-gray-500">Humidity</p>
                  <p className="mt-1 font-bold text-gray-900">72%</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Rain</p>
                  <p className="mt-1 font-bold text-gray-900">60%</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Wind</p>
                  <p className="mt-1 font-bold text-gray-900">12 km/h</p>
                </div>
              </div>

              <Link
                href="/farmer/weather"
                className="rounded-lg border px-4 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Details →
              </Link>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mb-8 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/farmer/scan"
            className="rounded-2xl bg-green-700 p-5 text-white shadow-sm transition hover:bg-green-800 sm:p-6"
          >
            <div className="text-3xl">📷</div>
            <h3 className="mt-4 text-xl font-bold">Scan Crop</h3>
            <p className="mt-2 text-sm text-green-100">
              Upload a crop image and check for diseases or pests.
            </p>
          </Link>

          <Link
            href="/farmer/farms"
            className="rounded-2xl bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6"
          >
            <div className="text-3xl">🌾</div>
            <h3 className="mt-4 text-xl font-bold text-gray-900">My Farms</h3>
            <p className="mt-2 text-sm text-gray-600">
              Manage your farms, crops, and field information.
            </p>
          </Link>

          <Link
            href="/farmer/risk"
            className="rounded-2xl bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6"
          >
            <div className="text-3xl">⚠️</div>
            <h3 className="mt-4 text-xl font-bold text-gray-900">Crop Risk</h3>
            <p className="mt-2 text-sm text-gray-600">
              View disease and pest risk for your farms.
            </p>
          </Link>

          <Link
            href="/farmer/map"
            className="rounded-2xl bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6"
          >
            <div className="text-3xl">🗺️</div>
            <h3 className="mt-4 text-xl font-bold text-gray-900">Farm Map</h3>
            <p className="mt-2 text-sm text-gray-600">
              View your farms, crop health, and disease risk on the map.
            </p>
          </Link>
        </section>

        {/* Overview */}
        <section className="mb-8 grid w-full grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="min-w-0 rounded-xl bg-white p-4 shadow-sm sm:p-5">
            <p className="text-sm text-gray-500">Total Farms</p>
            <p className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
              2
            </p>
          </div>

          <div className="min-w-0 rounded-xl bg-white p-4 shadow-sm sm:p-5">
            <p className="text-sm text-gray-500">Active Crops</p>
            <p className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
              2
            </p>
          </div>

          <div className="min-w-0 rounded-xl bg-white p-4 shadow-sm sm:p-5">
            <p className="text-sm text-gray-500">Recent Scans</p>
            <p className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
              8
            </p>
          </div>

          <div className="min-w-0 rounded-xl bg-white p-4 shadow-sm sm:p-5">
            <p className="text-sm text-gray-500">High Risk</p>
            <p className="mt-2 text-2xl font-bold text-red-600 sm:text-3xl">
              1
            </p>
          </div>
        </section>

        {/* Farms + Alerts */}
        <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-3 xl:gap-8">
          <section className="min-w-0 lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Your Farms</h2>
              <Link
                href="/farmer/farms"
                className="text-sm font-medium text-green-700 hover:underline"
              >
                View all →
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              {farms.map((farm) => (
                <div
                  key={farm.name}
                  className="min-w-0 rounded-xl bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-bold text-gray-900">{farm.name}</h3>
                      <p className="mt-1 truncate text-sm text-gray-500">
                        📍 {farm.location}
                      </p>
                    </div>

                    <span className="shrink-0 rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
                      {farm.area}
                    </span>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Crop</p>
                      <p className="mt-1 font-semibold">{farm.crop}</p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">Crop Health</p>
                      <p className="mt-1 font-semibold">{farm.health}%</p>
                    </div>
                  </div>

                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full bg-green-500"
                      style={{ width: `${farm.health}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="min-w-0">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Alerts</h2>
              <Link
                href="/farmer/alerts"
                className="text-sm font-medium text-green-700 hover:underline"
              >
                View all →
              </Link>
            </div>

            <div className="space-y-4">
              {unreadAlerts.map((alert) => (
                <div
                  key={alert.title}
                  className="min-w-0 rounded-xl bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-semibold text-gray-900">
                      {alert.title}
                    </h3>

                    <span
                      className={`shrink-0 rounded-full px-2 py-1 text-xs ${
                        alert.type === "High"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {alert.type}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-gray-600">
                    {alert.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Weather */}
        <section className="mt-8 w-full rounded-2xl bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-gray-500">Today&apos;s Weather</p>
              <h2 className="mt-1 text-3xl font-bold text-gray-900">
                28°C ☁️
              </h2>
              <p className="mt-1 text-gray-600">Nashik, Maharashtra</p>
            </div>

            <div className="grid w-full grid-cols-3 gap-3 text-center sm:gap-8 md:w-auto">
              <div>
                <p className="text-sm text-gray-500">Humidity</p>
                <p className="mt-1 font-bold">72%</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Rain</p>
                <p className="mt-1 font-bold">60%</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Wind</p>
                <p className="mt-1 font-bold">12 km/h</p>
              </div>
            </div>

            <Link
              href="/farmer/weather"
              className="w-full rounded-lg border px-4 py-2 text-center text-sm font-medium hover:bg-gray-50 md:w-auto"
            >
              View Weather →
            </Link>
          </div>
        </section>

        {/* Recent Activity */}
        <section className="mt-8 w-full">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              Recent Activity
            </h2>

            <Link
              href="/farmer/history"
              className="text-sm font-medium text-green-700 hover:underline"
            >
              View history →
            </Link>
          </div>

          <div className="w-full overflow-hidden rounded-xl bg-white shadow-sm">
            <div className="border-b p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900">
                    Cotton leaf scan
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Main Farm • Today
                  </p>
                </div>

                <span className="shrink-0 rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
                  Healthy
                </span>
              </div>
            </div>

            <div className="p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900">Soybean scan</p>
                  <p className="mt-1 text-sm text-gray-500">
                    East Farm • Yesterday
                  </p>
                </div>

                <span className="shrink-0 rounded-full bg-yellow-100 px-3 py-1 text-sm text-yellow-700">
                  Review
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
