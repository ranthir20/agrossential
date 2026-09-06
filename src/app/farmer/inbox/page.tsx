"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import FarmerHeader from "@/components/farmer/FarmerHeader";
import {
  INBOX_STORAGE_KEY,
  notifyHeaderUpdate,
} from "@/lib/notifications";

type Message = {
  id: string;
  type: string;
  title: string;
  message: string;
  unread: boolean;
  time: string;
};

const initialMessages: Message[] = [
  {
    id: "inbox-1",
    type: "Weather",
    title: "Rain expected today",
    message:
      "Rain is expected in your area. Check field drainage and avoid unnecessary spraying.",
    unread: true,
    time: "Today",
  },
  {
    id: "inbox-2",
    type: "Crop Risk",
    title: "Cotton disease risk increased",
    message:
      "Disease risk for Cotton in Main Farm has increased. Consider checking affected areas.",
    unread: true,
    time: "Today",
  },
  {
    id: "inbox-3",
    type: "Scan",
    title: "Scan result available",
    message:
      "Your latest crop scan result is ready to review.",
    unread: false,
    time: "Yesterday",
  },
  {
    id: "inbox-4",
    type: "Expert",
    title: "Expert review update",
    message:
      "Your expert review request is currently pending.",
    unread: false,
    time: "2 days ago",
  },
  {
    id: "inbox-5",
    type: "Reminder",
    title: "Farm monitoring reminder",
    message:
      "It is time to perform a follow-up check on your affected crop area.",
    unread: false,
    time: "3 days ago",
  },
];

export default function InboxPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(INBOX_STORAGE_KEY);

    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch {
        localStorage.setItem(
          INBOX_STORAGE_KEY,
          JSON.stringify(initialMessages)
        );
      }
    } else {
      localStorage.setItem(
        INBOX_STORAGE_KEY,
        JSON.stringify(initialMessages)
      );
    }

    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;

    localStorage.setItem(INBOX_STORAGE_KEY, JSON.stringify(messages));
    notifyHeaderUpdate();
  }, [messages, loaded]);

  const unreadCount = messages.filter((item) => item.unread).length;

  const markAsRead = (id: string) => {
    setMessages((current) =>
      current.map((item) =>
        item.id === id ? { ...item, unread: false } : item
      )
    );
  };

  const markAllAsRead = () => {
    setMessages((current) =>
      current.map((item) => ({ ...item, unread: false }))
    );
  };

  const icon: Record<string, string> = {
    Weather: "🌦️",
    "Crop Risk": "⚠️",
    Scan: "🔍",
    Expert: "👨‍🌾",
    Reminder: "⏰",
  };

  return (
    <main className="min-h-screen w-full max-w-full overflow-x-hidden w-full overflow-x-hidden bg-slate-50">
      <FarmerHeader />

      <div className="mx-auto max-w-none px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-green-700">Inbox</p>
            <h1 className="mt-1 text-3xl font-bold text-slate-900">
              Messages & Reminders
            </h1>
            <p className="mt-2 text-slate-600">
              Stay updated with crop scans, weather, expert reviews and farm reminders.
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="rounded-xl bg-green-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-800"
            >
              Mark all as read
            </button>
          )}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">All Messages</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              {messages.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">Unread</p>
            <p className="mt-2 text-3xl font-bold text-green-700">
              {unreadCount}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">Reminders</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              {messages.filter((m) => m.type === "Reminder").length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">Expert Updates</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              {messages.filter((m) => m.type === "Expert").length}
            </p>
          </div>
        </div>

        <section className="mt-6 space-y-4">
          {messages.map((item) => (
            <div
              key={item.id}
              className={`rounded-2xl border p-5 transition ${
                item.unread
                  ? "border-green-200 bg-green-50/40"
                  : "border-slate-200 bg-white"
              }`}
            >
              <div className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xl">
                  {icon[item.type] || "📩"}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="font-bold text-slate-900">
                          {item.title}
                        </h2>

                        {item.unread && (
                          <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                        )}
                      </div>

                      <p className="mt-1 text-xs font-semibold text-green-700">
                        {item.type}
                      </p>
                    </div>

                    <p className="text-sm text-slate-500">{item.time}</p>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {item.message}
                  </p>

                  {item.unread && (
                    <button
                      onClick={() => markAsRead(item.id)}
                      className="mt-4 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </section>

        <div className="mt-8 rounded-2xl border border-green-100 bg-green-50 p-5">
          <h2 className="font-bold text-slate-900">How notifications work</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Alerts are used for urgent crop, pest and weather warnings.
            Inbox contains messages, reminders, expert updates and scan
            notifications. Backend notifications will replace these demo
            messages later.
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/farmer/alerts"
              className="rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800"
            >
              View Alerts
            </Link>

            <Link
              href="/farmer/dashboard"
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
