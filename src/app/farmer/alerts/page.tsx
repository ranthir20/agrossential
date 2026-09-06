"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { notifyHeaderUpdate } from "@/lib/notifications";

type Alert = {
  id: number;
  type: "Disease" | "Pest" | "Weather" | "Farm";
  title: string;
  message: string;
  farm: string;
  crop: string;
  severity: "High" | "Medium" | "Low";
  time: string;
  read: boolean;
};

const initialAlerts: Alert[] = [
  {
    id: 1,
    type: "Disease",
    title: "High Disease Risk Detected",
    message:
      "Weather conditions and recent crop observations indicate an increased risk of fungal disease.",
    farm: "Main Farm",
    crop: "Cotton",
    severity: "High",
    time: "10 min ago",
    read: false,
  },
  {
    id: 2,
    type: "Pest",
    title: "Pest Activity Detected",
    message:
      "Pest activity has increased in your crop area. Inspect leaves and nearby plants.",
    farm: "East Farm",
    crop: "Soybean",
    severity: "Medium",
    time: "1 hour ago",
    read: false,
  },
  {
    id: 3,
    type: "Weather",
    title: "Rain Expected Today",
    message:
      "Rainfall is expected today. Monitor crop drainage and avoid unnecessary spraying before rainfall.",
    farm: "Main Farm",
    crop: "Cotton",
    severity: "Medium",
    time: "2 hours ago",
    read: true,
  },
  {
    id: 4,
    type: "Farm",
    title: "Crop Monitoring Reminder",
    message:
      "Your cotton crop is due for a routine health inspection.",
    farm: "Main Farm",
    crop: "Cotton",
    severity: "Low",
    time: "Yesterday",
    read: true,
  },
];

const icon: Record<Alert["type"], string> = {
  Disease: "🦠",
  Pest: "🐛",
  Weather: "🌧️",
  Farm: "🌱",
};

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [filter, setFilter] = useState<"All" | Alert["type"]>("All");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("agrossential-alerts");

    if (saved) {
      try {
        setAlerts(JSON.parse(saved));
      } catch {
        localStorage.setItem(
          "agrossential-alerts",
          JSON.stringify(initialAlerts)
        );
      }
    } else {
      localStorage.setItem(
        "agrossential-alerts",
        JSON.stringify(initialAlerts)
      );
    }

    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem("agrossential-alerts", JSON.stringify(alerts));
      notifyHeaderUpdate();
    }
  }, [alerts, loaded]);

  const unreadCount = alerts.filter((alert) => !alert.read).length;

  const filteredAlerts =
    filter === "All"
      ? alerts
      : alerts.filter((alert) => alert.type === filter);

  const markAsRead = (id: number) => {
    setAlerts((current) =>
      current.map((alert) =>
        alert.id === id ? { ...alert, read: true } : alert
      )
    );
    notifyHeaderUpdate();
  };

  const markAllAsRead = () => {
    setAlerts((current) =>
      current.map((alert) => ({ ...alert, read: true }))
    );
    notifyHeaderUpdate();
  };

  return (
    <main className="min-h-screen w-full max-w-full overflow-x-hidden w-full overflow-x-hidden bg-slate-50 px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-none">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link
              href="/farmer/dashboard"
              className="text-sm font-medium text-green-700 hover:underline"
            >
              ← Back to Dashboard
            </Link>

            <h1 className="mt-3 text-3xl font-bold">Alerts 🔔</h1>
            <p className="mt-1 text-slate-600">
              Important crop, pest, weather and farm warnings.
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="rounded-xl border border-green-200 bg-white px-4 py-2 text-sm font-semibold text-green-700 shadow-sm hover:bg-green-50"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Summary */}
        <section className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Total Alerts</p>
            <p className="mt-2 text-3xl font-bold">{alerts.length}</p>
          </div>

          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Unread</p>
            <p className="mt-2 text-3xl font-bold text-red-600">
              {unreadCount}
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">High Priority</p>
            <p className="mt-2 text-3xl font-bold text-orange-600">
              {alerts.filter((a) => a.severity === "High").length}
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Farms Affected</p>
            <p className="mt-2 text-3xl font-bold">
              {new Set(alerts.map((a) => a.farm)).size}
            </p>
          </div>
        </section>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-2">
          {(["All", "Disease", "Pest", "Weather", "Farm"] as const).map(
            (item) => (
              <button
                key={item}
                onClick={() => setFilter(item)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  filter === item
                    ? "bg-green-700 text-white"
                    : "border bg-white text-slate-600 hover:bg-green-50"
                }`}
              >
                {item === "All" ? "All Alerts" : `${icon[item]} ${item}`}
              </button>
            )
          )}
        </div>

        {/* Alerts */}
        <section className="space-y-4">
          {filteredAlerts.map((alert) => (
            <article
              key={alert.id}
              className={`rounded-2xl border bg-white p-5 shadow-sm transition ${
                !alert.read ? "border-green-200 bg-green-50/40" : ""
              }`}
            >
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-2xl">
                  {icon[alert.type]}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-bold">{alert.title}</h2>

                        {!alert.read && (
                          <span className="h-2 w-2 rounded-full bg-red-500" />
                        )}

                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                            alert.severity === "High"
                              ? "bg-red-100 text-red-700"
                              : alert.severity === "Medium"
                                ? "bg-orange-100 text-orange-700"
                                : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {alert.severity}
                        </span>
                      </div>

                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {alert.message}
                      </p>
                    </div>

                    <span className="shrink-0 text-xs text-slate-400">
                      {alert.time}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                    <span className="rounded-lg bg-slate-100 px-3 py-1.5">
                      📍 {alert.farm}
                    </span>

                    <span className="rounded-lg bg-slate-100 px-3 py-1.5">
                      🌱 {alert.crop}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-3">
                    {alert.type === "Disease" && (
                      <Link
                        href="/farmer/risk"
                        className="rounded-xl bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800"
                      >
                        View Crop Risk
                      </Link>
                    )}

                    {alert.type === "Weather" && (
                      <Link
                        href="/farmer/weather"
                        className="rounded-xl bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800"
                      >
                        View Weather
                      </Link>
                    )}

                    {alert.type === "Pest" && (
                      <Link
                        href="/farmer/scan"
                        className="rounded-xl bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800"
                      >
                        Scan Crop
                      </Link>
                    )}

                    {!alert.read && (
                      <button
                        onClick={() => markAsRead(alert.id)}
                        className="rounded-xl border px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>

        {filteredAlerts.length === 0 && (
          <div className="rounded-2xl border bg-white py-16 text-center shadow-sm">
            <div className="text-4xl">✅</div>
            <h2 className="mt-3 text-lg font-bold">No alerts here</h2>
            <p className="mt-1 text-sm text-slate-500">
              There are no alerts matching this filter.
            </p>
          </div>
        )}

        {/* Bottom info */}
        <div className="mt-8 rounded-2xl border border-green-100 bg-green-50 p-5">
          <h2 className="font-bold text-green-900">
            💡 How agrossential alerts work
          </h2>
          <p className="mt-2 text-sm leading-6 text-green-800">
            Alerts can be generated from AI crop scans, weather conditions,
            disease and pest risk, farm observations, sensor data and expert
            validation. The backend will make these alerts dynamic later.
          </p>
        </div>
      </div>
    </main>
  );
}
