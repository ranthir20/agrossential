"use client";

import Link from "next/link";
import FarmerHeader from "@/components/farmer/FarmerHeader";

const hourly = [
  { time: "Now", temp: 28, rain: 60, icon: "☁️" },
  { time: "12 PM", temp: 28, rain: 65, icon: "🌦️" },
  { time: "2 PM", temp: 27, rain: 70, icon: "🌧️" },
  { time: "4 PM", temp: 26, rain: 72, icon: "🌧️" },
  { time: "6 PM", temp: 25, rain: 68, icon: "🌦️" },
  { time: "8 PM", temp: 24, rain: 52, icon: "☁️" },
  { time: "10 PM", temp: 23, rain: 40, icon: "☁️" },
];

const forecast = [
  { day: "Today", date: "Sep 4", high: 28, low: 22, rain: 70, icon: "🌧️" },
  { day: "Sat", date: "Sep 5", high: 28, low: 22, rain: 65, icon: "🌦️" },
  { day: "Sun", date: "Sep 6", high: 28, low: 22, rain: 55, icon: "🌦️" },
  { day: "Mon", date: "Sep 7", high: 29, low: 23, rain: 72, icon: "🌧️" },
  { day: "Tue", date: "Sep 8", high: 29, low: 21, rain: 45, icon: "🌦️" },
  { day: "Wed", date: "Sep 9", high: 29, low: 22, rain: 60, icon: "🌧️" },
  { day: "Thu", date: "Sep 10", high: 28, low: 24, rain: 50, icon: "🌦️" },
];

export default function WeatherPage() {
  return (
    <main className="min-h-screen w-full max-w-full overflow-x-hidden w-full overflow-x-hidden bg-gray-50">
      <FarmerHeader />

      <div className="w-full px-4 py-6 sm:px-6 lg:px-8 xl:px-12">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/farmer/dashboard"
            className="text-sm font-medium text-green-700 hover:underline"
          >
            ← Back to Dashboard
          </Link>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Weather Details
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                📍 Nashik, Maharashtra
              </p>
            </div>

            <p className="text-sm text-gray-500">
              Updated a few minutes ago
            </p>
          </div>
        </div>

        {/* Current Weather */}
        <section className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-sm lg:col-span-1">
            <p className="text-sm font-medium text-gray-500">
              Current Weather
            </p>

            <div className="mt-5 flex items-center gap-5">
              <div className="text-6xl">☁️</div>

              <div>
                <p className="text-5xl font-bold text-gray-900">28°</p>
                <p className="mt-1 text-gray-600">Cloudy</p>
                <p className="mt-1 text-sm text-gray-500">
                  Feels like 30°C
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 lg:col-span-2 sm:grid-cols-4">
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">💧 Humidity</p>
              <p className="mt-3 text-2xl font-bold text-gray-900">72%</p>
              <p className="mt-1 text-xs text-gray-500">High</p>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">🌧️ Rain Chance</p>
              <p className="mt-3 text-2xl font-bold text-gray-900">70%</p>
              <p className="mt-1 text-xs text-gray-500">Today</p>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">💨 Wind</p>
              <p className="mt-3 text-2xl font-bold text-gray-900">12</p>
              <p className="mt-1 text-xs text-gray-500">km/h</p>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">🌧️ Rainfall</p>
              <p className="mt-3 text-2xl font-bold text-gray-900">8 mm</p>
              <p className="mt-1 text-xs text-gray-500">Expected today</p>
            </div>
          </div>
        </section>

        {/* Weather Conditions */}
        <section className="mb-6 rounded-2xl bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-xl font-bold text-gray-900">
            Weather Conditions
          </h2>

          <div className="mt-5 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
            <div>
              <p className="text-xs text-gray-500">Pressure</p>
              <p className="mt-1 font-semibold">1008 hPa</p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Wind Direction</p>
              <p className="mt-1 font-semibold">SW ↗</p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Visibility</p>
              <p className="mt-1 font-semibold">8 km</p>
            </div>

            <div>
              <p className="text-xs text-gray-500">UV Index</p>
              <p className="mt-1 font-semibold">5 Moderate</p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Sunrise</p>
              <p className="mt-1 font-semibold">6:12 AM</p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Sunset</p>
              <p className="mt-1 font-semibold">6:42 PM</p>
            </div>
          </div>
        </section>

        {/* Farm Weather Impact */}
        <section className="mb-6 rounded-2xl border border-yellow-200 bg-yellow-50 p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-yellow-100 text-2xl">
              ⚠️
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-xl font-bold text-gray-900">
                  Weather Impact on Your Crops
                </h2>

                <span className="rounded-full bg-yellow-200 px-3 py-1 text-xs font-bold text-yellow-800">
                  MODERATE RISK
                </span>
              </div>

              <p className="mt-2 text-sm leading-6 text-gray-700">
                High humidity and a strong chance of rainfall may create
                favorable conditions for fungal diseases. Your cotton crop
                should be monitored closely over the next few days.
              </p>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-xl bg-white/70 p-3">
                  <p className="text-xs text-gray-500">Fungal Disease</p>
                  <p className="mt-1 font-semibold text-yellow-700">
                    Elevated
                  </p>
                </div>

                <div className="rounded-xl bg-white/70 p-3">
                  <p className="text-xs text-gray-500">Pest Activity</p>
                  <p className="mt-1 font-semibold text-green-700">Normal</p>
                </div>

                <div className="rounded-xl bg-white/70 p-3">
                  <p className="text-xs text-gray-500">Water Stress</p>
                  <p className="mt-1 font-semibold text-green-700">Low</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Today's Farm Advice */}
        <section className="mb-6 rounded-2xl bg-green-700 p-5 text-white shadow-sm sm:p-6">
          <h2 className="text-xl font-bold">🌱 Today&apos;s Farm Advice</h2>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-white/10 p-4">
              <p className="font-semibold">Monitor crops</p>
              <p className="mt-1 text-sm text-green-100">
                Check leaves for fungal spots after rainfall.
              </p>
            </div>

            <div className="rounded-xl bg-white/10 p-4">
              <p className="font-semibold">Avoid unnecessary spraying</p>
              <p className="mt-1 text-sm text-green-100">
                Rain may reduce the effectiveness of a spray application.
              </p>
            </div>

            <div className="rounded-xl bg-white/10 p-4">
              <p className="font-semibold">Check drainage</p>
              <p className="mt-1 text-sm text-green-100">
                Make sure excess rainwater can drain from the field.
              </p>
            </div>
          </div>
        </section>

        {/* Hourly Forecast */}
        <section className="mb-6 rounded-2xl bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              Today&apos;s Hourly Forecast
            </h2>

            <span className="text-sm text-gray-500">Rain probability</span>
          </div>

          <div className="mt-5 flex gap-3 overflow-x-auto pb-2">
            {hourly.map((item) => (
              <div
                key={item.time}
                className="min-w-[105px] rounded-xl border border-gray-100 bg-gray-50 p-4 text-center"
              >
                <p className="text-xs font-medium text-gray-500">
                  {item.time}
                </p>

                <p className="my-3 text-2xl">{item.icon}</p>

                <p className="font-bold text-gray-900">{item.temp}°</p>

                <p className="mt-2 text-xs text-blue-600">
                  💧 {item.rain}%
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 7 Day Forecast */}
        <section className="mb-6 rounded-2xl bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-xl font-bold text-gray-900">
            7-Day Forecast
          </h2>

          <div className="mt-5 divide-y">
            {forecast.map((day) => (
              <div
                key={day.day}
                className="flex items-center justify-between gap-3 py-4"
              >
                <div className="w-20">
                  <p className="font-semibold text-gray-900">{day.day}</p>
                  <p className="text-xs text-gray-500">{day.date}</p>
                </div>

                <div className="text-3xl">{day.icon}</div>

                <div className="text-sm text-blue-600">
                  💧 {day.rain}%
                </div>

                <div className="w-20 text-right">
                  <span className="font-bold text-gray-900">
                    {day.high}°
                  </span>
                  <span className="ml-2 text-gray-400">
                    {day.low}°
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Weather Alert */}
        <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-xl font-bold text-gray-900">
            Weather Alert
          </h2>

          <div className="mt-4 flex gap-4 rounded-xl border border-orange-200 bg-orange-50 p-4">
            <div className="text-2xl">🌧️</div>

            <div>
              <h3 className="font-semibold text-gray-900">
                Rain expected today
              </h3>

              <p className="mt-1 text-sm leading-6 text-gray-600">
                Rainfall is likely during the afternoon. Consider postponing
                non-essential field spraying and monitor your crops after the
                rain.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
