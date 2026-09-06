"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import FarmerHeader from "@/components/farmer/FarmerHeader";

type Profile = {
  name: string;
  phone: string;
  village: string;
  district: string;
  state: string;
  language: string;
};

const defaultProfile: Profile = {
  name: "",
  phone: "",
  village: "",
  district: "Nashik",
  state: "Maharashtra",
  language: "English",
};

const STORAGE_KEY = "agrossential-profile";

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [form, setForm] = useState<Profile>(defaultProfile);
  const [editing, setEditing] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Profile;

        setProfile(parsed);
        setForm(parsed);
        setEditing(false);
      } catch {
        setEditing(true);
      }
    }

    setLoaded(true);
  }, []);

  const handleChange = (
    field: keyof Profile,
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    setProfile(form);
    setEditing(false);
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  const handleEdit = () => {
    setForm(profile);
    setEditing(true);
    setSaved(false);
  };

  if (!loaded) {
    return (
      <main className="min-h-screen w-full max-w-full overflow-x-hidden w-full overflow-x-hidden bg-slate-50">
        <FarmerHeader />
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full max-w-full overflow-x-hidden w-full overflow-x-hidden bg-slate-50">
      <FarmerHeader />

      <div className="mx-auto max-w-none px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-sm font-semibold text-green-700">
            Farmer Profile
          </p>

          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            My Profile
          </h1>

          <p className="mt-2 text-slate-600">
            Manage your personal information and communication preferences.
          </p>
        </div>

        {saved && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-800">
            Profile updated successfully.
          </div>
        )}

        {!editing ? (
          <>
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-xl font-bold text-green-700">
                    {profile.name
                      ? profile.name.charAt(0).toUpperCase()
                      : "F"}
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      {profile.name || "Farmer"}
                    </h2>

                    <p className="text-sm text-slate-500">
                      {profile.phone || "Phone number not added"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleEdit}
                  className="rounded-xl bg-green-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-800"
                >
                  ✏️ Edit Profile
                </button>
              </div>
            </section>

            <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">
                Personal Information
              </h2>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Name
                  </p>
                  <p className="mt-1 font-medium text-slate-900">
                    {profile.name || "Not provided"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Phone
                  </p>
                  <p className="mt-1 font-medium text-slate-900">
                    {profile.phone || "Not provided"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Village
                  </p>
                  <p className="mt-1 font-medium text-slate-900">
                    {profile.village || "Not provided"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    District
                  </p>
                  <p className="mt-1 font-medium text-slate-900">
                    {profile.district || "Not provided"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    State
                  </p>
                  <p className="mt-1 font-medium text-slate-900">
                    {profile.state || "Not provided"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Preferred Language
                  </p>
                  <p className="mt-1 font-medium text-slate-900">
                    {profile.language}
                  </p>
                </div>
              </div>
            </section>
          </>
        ) : (
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-slate-900">
                {profile.name ? "Edit Profile" : "Complete Your Profile"}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Keep your information updated for better farm support.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Name
                </label>

                <input
                  value={form.name}
                  onChange={(e) =>
                    handleChange("name", e.target.value)
                  }
                  placeholder="Enter your name"
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-green-500"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Phone
                </label>

                <input
                  value={form.phone}
                  onChange={(e) =>
                    handleChange("phone", e.target.value)
                  }
                  placeholder="Enter phone number"
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-green-500"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Village
                </label>

                <input
                  value={form.village}
                  onChange={(e) =>
                    handleChange("village", e.target.value)
                  }
                  placeholder="Enter village"
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-green-500"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">
                  District
                </label>

                <input
                  value={form.district}
                  onChange={(e) =>
                    handleChange("district", e.target.value)
                  }
                  placeholder="Enter district"
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-green-500"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">
                  State
                </label>

                <input
                  value={form.state}
                  onChange={(e) =>
                    handleChange("state", e.target.value)
                  }
                  placeholder="Enter state"
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-green-500"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Preferred Language
                </label>

                <select
                  value={form.language}
                  onChange={(e) =>
                    handleChange("language", e.target.value)
                  }
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-green-500"
                >
                  <option>English</option>
                  <option>मराठी</option>
                  <option>हिन्दी</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handleSave}
                className="rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white hover:bg-green-800"
              >
                {profile.name ? "Save Changes" : "Save Profile"}
              </button>

              {profile.name && (
                <button
                  onClick={() => {
                    setForm(profile);
                    setEditing(false);
                  }}
                  className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
              )}
            </div>
          </section>
        )}

        <div className="mt-6">
          <Link
            href="/farmer/dashboard"
            className="text-sm font-semibold text-green-700 hover:text-green-800"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
