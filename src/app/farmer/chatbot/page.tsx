"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import FarmerHeader from "@/components/farmer/FarmerHeader";

type ScanData = {
  crop?: string;
  variety?: string;
  farmName?: string;
  disease?: string;
  confidence?: number;
  severity?: string;
};

type Message = {
  id: number;
  sender: "farmer" | "assistant";
  text: string;
};

const defaultScan: ScanData = {
  crop: "Cotton",
  variety: "Bt Cotton",
  farmName: "Main Farm",
  disease: "Cotton Leaf Curl Virus",
  confidence: 87,
  severity: "Moderate",
};

const quickQuestions = [
  "What should I do now?",
  "How can I prevent this disease?",
  "When should I scan again?",
  "Should I contact an expert?",
];

function getAnswer(question: string, scan: ScanData) {
  const q = question.toLowerCase();

  if (q.includes("prevent")) {
    return `For ${scan.crop || "this crop"}, monitor new growth regularly, remove severely affected plant material where appropriate, manage insect vectors, maintain field hygiene, and avoid unnecessary chemical applications. Follow locally approved IPM guidance.`;
  }

  if (q.includes("scan") || q.includes("again")) {
    return "Take a follow-up scan when you notice changes in symptoms or after the recommended monitoring period. Use clear, well-lit images showing both the affected area and a healthy part of the crop.";
  }

  if (q.includes("expert") || q.includes("contact")) {
    return "If symptoms are spreading quickly, the diagnosis is uncertain, or the crop is severely affected, request an expert review. An expert or local agriculture extension officer can validate the diagnosis before treatment.";
  }

  if (q.includes("chemical") || q.includes("spray")) {
    return "Do not apply a chemical treatment based only on an AI prediction. Confirm the diagnosis and follow the product label, locally approved recommendations, safety precautions, and applicable pre-harvest intervals.";
  }

  return `Your latest scan shows ${scan.disease || "a possible crop-health issue"} with ${scan.confidence ?? 87}% AI confidence and ${scan.severity || "moderate"} severity. Start with monitoring and the recommended IPM actions, and request expert validation if the condition is uncertain or worsening.`;
}

export default function ChatbotPage() {
  const [scan, setScan] = useState<ScanData>(defaultScan);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "assistant",
      text: "Hello! I'm the agrossential crop-health assistant. Ask me about your crop, scan result, disease risk, or next steps.",
    },
  ]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const storedScan = localStorage.getItem("agrossential-current-scan");

    if (storedScan) {
      try {
        setScan({ ...defaultScan, ...JSON.parse(storedScan) });
      } catch {}
    }
  }, []);

  const [thinking, setThinking] = useState(false);

  function sendMessage(text = input) {
    const question = text.trim();

    if (!question || thinking) return;

    setInput("");
    setThinking(true);

    const farmerMessage: Message = {
      id: Date.now(),
      sender: "farmer",
      text: question,
    };

    setMessages((current) => [...current, farmerMessage]);

    setTimeout(() => {
      const answer = getAnswer(question, scan);

      setMessages((current) => [
        ...current,
        {
          id: Date.now(),
          sender: "assistant",
          text: answer,
        },
      ]);

      setThinking(false);
    }, 1800);
  }

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-slate-50">
      <FarmerHeader />

      <main className="mx-auto max-w-none px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/farmer/dashboard"
            className="text-sm font-medium text-green-700 hover:text-green-800"
          >
            ← Back to Dashboard
          </Link>

          <h1 className="mt-3 text-3xl font-bold text-slate-900">
            Crop Health Assistant
          </h1>

          <p className="mt-2 text-slate-600">
            Get quick guidance about your crop health and next steps.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <section className="flex min-h-[620px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-100 text-xl">
                  🌱
                </div>
                <div>
                  <h2 className="font-bold text-slate-900">
                    agrossential Assistant
                  </h2>
                  <p className="text-xs text-green-700">
                    Crop-health guidance
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto p-5">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "farmer"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                      message.sender === "farmer"
                        ? "bg-green-700 text-white"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}

              {thinking && (
                <div className="flex justify-start">
                  <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <span>Thinking</span>
                      <span className="flex gap-1">
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-slate-200 p-4">
              <div className="mb-3 flex flex-wrap gap-2">
                {quickQuestions.map((question) => (
                  <button
                    key={question}
                    type="button"
                    onClick={() => sendMessage(question)}
                    className="rounded-full border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
                  >
                    {question}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") sendMessage();
                  }}
                  placeholder={thinking ? "Assistant is thinking..." : "Ask about your crop..."}
                  disabled={thinking}
                  className="min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 disabled:bg-slate-100"
                />

                <button
                  type="button"
                  onClick={() => sendMessage()}
                  disabled={thinking}
                  className="rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {thinking ? "Thinking..." : "Send"}
                </button>
              </div>
            </div>
          </section>

          <aside className="space-y-5">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="font-bold text-slate-900">Current Context</h2>

              <div className="mt-4 space-y-3 text-sm">
                <div>
                  <p className="text-xs text-slate-500">Farm</p>
                  <p className="font-semibold text-slate-900">
                    {scan.farmName}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Crop</p>
                  <p className="font-semibold text-slate-900">
                    {scan.crop} · {scan.variety}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Latest detection</p>
                  <p className="font-semibold text-slate-900">
                    {scan.disease}
                  </p>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Confidence</span>
                  <span className="font-semibold text-green-700">
                    {scan.confidence}%
                  </span>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="font-bold text-slate-900">Need More Help?</h2>

              <div className="mt-4 space-y-3">
                <Link
                  href="/farmer/expert-review"
                  className="block rounded-xl bg-green-700 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-green-800"
                >
                  Ask an Expert
                </Link>

                <Link
                  href="/farmer/monitoring"
                  className="block rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Follow-up Monitoring
                </Link>

                <Link
                  href="/farmer/help"
                  className="block rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Help & Support
                </Link>
              </div>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}
