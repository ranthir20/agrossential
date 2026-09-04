"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { hasUnreadAlerts, hasUnreadInbox } from "@/lib/notifications";

export default function FarmerHeader() {
  const [hasUnreadAlert, setHasUnreadAlert] = useState(false);
  const [hasUnreadMessage, setHasUnreadMessage] = useState(false);

  const refreshNotificationState = () => {
    setHasUnreadAlert(hasUnreadAlerts());
    setHasUnreadMessage(hasUnreadInbox());
  };

  useEffect(() => {
    refreshNotificationState();

    window.addEventListener(
      "agrossential-notifications-updated",
      refreshNotificationState
    );

    window.addEventListener("storage", refreshNotificationState);

    return () => {
      window.removeEventListener(
        "agrossential-notifications-updated",
        refreshNotificationState
      );
      window.removeEventListener("storage", refreshNotificationState);
    };
  }, []);

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full max-w-full overflow-x-hidden border-b bg-white">
      <div className="mx-auto flex min-h-16 w-full max-w-full items-center justify-between px-3 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link
          href="/farmer/dashboard"
          onClick={() => setMenuOpen(false)}
          className="flex shrink-0 items-center gap-2"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-700 text-lg">
            🌱
          </div>

          <div>
            <h1 className="text-lg font-bold leading-none text-green-700 sm:text-xl">
              agrossential
            </h1>

            <p className="mt-1 hidden text-[10px] text-gray-500 sm:block">
              Smart Crop Health
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 lg:flex">
          <Link
            href="/farmer/dashboard"
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-green-50 hover:text-green-700"
          >
            Dashboard
          </Link>

          <Link
            href="/farmer/farms"
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-green-50 hover:text-green-700"
          >
            My Farms
          </Link>

          <Link
            href="/farmer/scan"
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-green-50 hover:text-green-700"
          >
            Scan Crop
          </Link>

          <Link
            href="/farmer/risk"
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-green-50 hover:text-green-700"
          >
            Risk
          </Link>

          <Link
            href="/farmer/history"
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-green-50 hover:text-green-700"
          >
            History
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-1 sm:gap-2">

          {/* Language */}
          <select
            defaultValue="English"
            aria-label="Language"
            className="hidden rounded-lg border border-gray-200 bg-white px-2 py-2 text-xs font-medium text-gray-700 outline-none focus:border-green-500 sm:block"
          >
            <option>English</option>
            <option>मराठी</option>
            <option>हिन्दी</option>
          </select>

          {/* Inbox */}
          <Link
            href="/farmer/inbox"
            aria-label="Inbox"
            className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-gray-600 transition hover:bg-gray-100"
          >
            📥

            {/* New message indicator */}
            {hasUnreadMessage && (
              <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-red-500" />
            )}
          </Link>

          {/* Alerts */}
          <Link
            href="/farmer/alerts"
            aria-label="Alerts"
            className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-gray-600 transition hover:bg-gray-100"
          >
            🔔

            {/* New alert indicator */}
            {hasUnreadAlert && (
              <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-red-500" />
            )}
          </Link>

          {/* Profile */}
          <Link
            href="/farmer/profile"
            className="flex shrink-0 items-center gap-2 rounded-full border border-gray-200 px-1.5 py-1.5 transition hover:bg-gray-50 sm:px-2"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700">
              F
            </div>

            <span className="hidden text-sm font-medium text-gray-700 md:block">
              Farmer
            </span>
          </Link>

          {/* Mobile Menu */}
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-xl text-gray-700 hover:bg-gray-100 lg:hidden"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <nav className="border-t bg-white px-4 py-3 shadow-sm lg:hidden">
          <div className="mx-auto flex w-full max-w-screen-2xl flex-col gap-1">

            <Link
              href="/farmer/dashboard"
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-700"
            >
              Dashboard
            </Link>

            <Link
              href="/farmer/farms"
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-700"
            >
              My Farms
            </Link>

            <Link
              href="/farmer/scan"
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-700"
            >
              Scan Crop
            </Link>

            <Link
              href="/farmer/risk"
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-700"
            >
              Risk
            </Link>

            <Link
              href="/farmer/history"
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-700"
            >
              History
            </Link>

            <Link
              href="/farmer/inbox"
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-700"
            >
              📥 Inbox
            </Link>

            <Link
              href="/farmer/alerts"
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-700"
            >
              🔔 Alerts
            </Link>

            <Link
              href="/farmer/profile"
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-700"
            >
              👤 Profile
            </Link>

            <div className="mt-2 border-t pt-3">
              <label className="mb-1 block px-4 text-xs text-gray-500">
                Language
              </label>

              <select
                defaultValue="English"
                className="mx-4 w-[calc(100%-2rem)] rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-green-500"
              >
                <option>English</option>
                <option>मराठी</option>
                <option>हिन्दी</option>
              </select>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
