"use client";

import { useState } from "react";
import Link from "next/link";
import FarmerHeader from "@/components/farmer/FarmerHeader";

const faqs = [
  {
    question: "How accurate is the AI diagnosis?",
    answer:
      "AI predictions are decision-support suggestions, not a replacement for expert diagnosis. Check the confidence score and request expert validation when confidence is low or symptoms are unclear.",
  },
  {
    question: "What should I do when confidence is low?",
    answer:
      "Take clearer images from multiple angles, include both affected and healthy parts of the plant, add symptoms in the scan notes, and request an expert review if the problem remains uncertain.",
  },
  {
    question: "Should I spray pesticide immediately?",
    answer:
      "No. Do not apply chemical treatment based only on an AI prediction. Confirm the problem and follow locally approved recommendations, product labels, safety instructions, and applicable pre-harvest intervals.",
  },
  {
    question: "How can I report a pest problem?",
    answer:
      "Open Pest Reporting from the farmer dashboard or navigation, select your farm and crop, provide the pest and approximate activity, and submit the observation.",
  },
];

export default function HelpPage() {
  const [open, setOpen] = useState<number | null>(0);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function submitSupport() {
    if (!message.trim()) return;

    const existing = JSON.parse(
      localStorage.getItem("agrossential-support") || "[]"
    );

    existing.unshift({
      id: `support-${Date.now()}`,
      message,
      date: new Date().toISOString(),
      status: "Submitted",
    });

    localStorage.setItem(
      "agrossential-support",
      JSON.stringify(existing)
    );

    setMessage("");
    setSubmitted(true);

    setTimeout(() => setSubmitted(false), 3000);
  }

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-slate-50">
      <FarmerHeader />

      <main className="mx-auto max-w-none px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/farmer/dashboard"
          className="text-sm font-medium text-green-700 hover:text-green-800"
        >
          ← Back to Dashboard
        </Link>

        <div className="mt-4 mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Help & Support
          </h1>
          <p className="mt-2 text-slate-600">
            Get guidance about crop health, AI results, and expert support.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">
              Frequently Asked Questions
            </h2>

            <div className="mt-5 space-y-3">
              {faqs.map((faq, index) => (
                <div
                  key={faq.question}
                  className="overflow-hidden rounded-xl border border-slate-200"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setOpen(open === index ? null : index)
                    }
                    className="flex w-full items-center justify-between px-4 py-4 text-left text-sm font-semibold text-slate-800"
                  >
                    {faq.question}
                    <span>{open === index ? "−" : "+"}</span>
                  </button>

                  {open === index && (
                    <div className="border-t border-slate-100 px-4 py-4 text-sm leading-6 text-slate-600">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">
              Need Expert Support?
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              If your crop problem is uncertain or getting worse, request an
              expert review before taking major treatment decisions.
            </p>

            <div className="mt-5 space-y-3">
              <Link
                href="/farmer/expert-review"
                className="block rounded-xl bg-green-700 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-green-800"
              >
                Request Expert Review
              </Link>

              <Link
                href="/farmer/chatbot"
                className="block rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Ask Crop Assistant
              </Link>
            </div>

            <div className="my-6 border-t border-slate-200" />

            <h3 className="font-bold text-slate-900">
              Contact Support
            </h3>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your problem or ask for help..."
              className="mt-4 min-h-32 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />

            {submitted && (
              <div className="mt-4 rounded-xl bg-green-50 p-4 text-sm font-medium text-green-800">
                ✓ Support request submitted successfully.
              </div>
            )}

            <button
              type="button"
              onClick={submitSupport}
              disabled={!message.trim()}
              className="mt-4 w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              Submit Support Request
            </button>
          </section>
        </div>

        <section className="mt-6 rounded-2xl border border-green-100 bg-green-50 p-6">
          <h2 className="font-bold text-green-900">
            🧪 When to seek expert or laboratory help
          </h2>
          <p className="mt-2 text-sm leading-6 text-green-800">
            Seek expert or laboratory confirmation when the AI confidence is
            low, symptoms do not match the suggested diagnosis, the condition
            is spreading rapidly, or the crop is at significant risk.
          </p>
        </section>
      </main>
    </div>
  );
}
