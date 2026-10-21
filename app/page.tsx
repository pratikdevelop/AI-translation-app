"use client";

import { useCallback, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AuthButtons } from "@/components/AuthButtons";
import { DocTranslator } from "@/components/DocTranslator";
import { LANGUAGES } from "@/lib/languages";
import {
  Sparkles,
  ArrowRightLeft,
  Copy,
  Check,
  Languages,
  Wand2,
  AlertCircle,
  Clock,
  Trash2,
} from "lucide-react";

type HistoryItem = {
  id: string; ts: number; text: string; targetLanguage: string;
  tone: string; detectedLanguage: string; translation: string;
};

export default function Home() {
  const [text, setText] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("Spanish");
  const { isSignedIn } = useUser();
  const [remaining, setRemaining] = useState<number | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    detectedLanguage?: string;
    correctedText?: string;
    translation?: string;
    error?: string;
  } | null>(null);

  const loadHistory = useCallback(async () => {
    try {
      const res = await fetch("/api/history");
      if (res.ok) setHistory((await res.json()).items ?? []);
    } catch {}
  }, []);

  useEffect(() => {
    if (isSignedIn) loadHistory();
    else setHistory([]);
  }, [isSignedIn, loadHistory]);

  const clearHistory = async () => {
    await fetch("/api/history", { method: "DELETE" });
    setHistory([]);
  };

  const handleTranslate = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, targetLanguage }),
      });

      const data = await res.json();
      if (res.ok) {
        setResult(data);
        if (typeof data.remaining === "number") setRemaining(data.remaining);
        if (isSignedIn) loadHistory();
      } else {
        setResult({ error: data.error || "Failed to translate" });
      }
    } catch (err) {
      setResult({ error: "An unexpected error occurred." });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-600 text-white rounded-xl shadow-md shadow-blue-500/20">
              <Languages className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">LuminaTranslate</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Powered by LangGraph & NVIDIA NIM
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <AuthButtons />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-8 flex flex-col gap-6">
        
        {/* Controls Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-medium">
            <span className="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              {result?.detectedLanguage ? `Detected: ${result.detectedLanguage}` : "Auto-Detect Language"}
            </span>
            {remaining !== null && (
              <span className="text-xs text-gray-500 dark:text-gray-400">{remaining.toLocaleString()} characters left today</span>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <ArrowRightLeft className="w-4 h-4 text-gray-400 hidden sm:block" />
            <select
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
              className="w-full sm:w-48 p-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>

            <button
              onClick={handleTranslate}
              disabled={loading || !text.trim()}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-medium text-sm rounded-xl transition shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 whitespace-nowrap"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Translating...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  Translate
                </>
              )}
            </button>
          </div>
        </div>

        {/* Translation Split Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
          {/* Input Box */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 flex flex-col shadow-sm focus-within:ring-2 focus-within:ring-blue-500 transition">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              <span>Source Text</span>
              <span>{text.length} characters</span>
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type or paste text here to translate..."
              rows={8}
              className="w-full mt-3 flex-1 bg-transparent border-none outline-none resize-none text-base text-gray-800 dark:text-gray-100 placeholder-gray-400"
            />
          </div>

          {/* Output Box */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 flex flex-col shadow-sm relative">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              <span>Target ({targetLanguage})</span>
              {result?.translation && (
                <button
                  onClick={() => copyToClipboard(result.translation || "")}
                  className="flex items-center gap-1 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied" : "Copy"}
                </button>
              )}
            </div>

            <div className="mt-3 flex-1 overflow-y-auto min-h-[160px]">
              {result?.error ? (
                <div className="flex items-center gap-2 text-red-500 text-sm p-3 bg-red-50 dark:bg-red-950/50 rounded-xl border border-red-200 dark:border-red-800">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {result.error}
                </div>
              ) : result?.translation ? (
                <div className="space-y-4">
                  <p className="text-base text-gray-800 dark:text-gray-100 leading-relaxed whitespace-pre-wrap">
                    {result.translation}
                  </p>
                </div>
              ) : (
                <p className="text-gray-400 dark:text-gray-600 italic text-sm">
                  Translation will appear here...
                </p>
              )}
            </div>

            {/* Grammar Auto-Correction Banner */}
            {result?.correctedText && result.correctedText !== text && (
              <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl text-xs text-amber-900 dark:text-amber-200">
                <p className="font-semibold flex items-center gap-1 mb-0.5">
                  <Wand2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> Grammar Corrected Input:
                </p>
                <p className="text-amber-800 dark:text-amber-300 font-mono">{result.correctedText}</p>
              </div>
            )}
          </div>
        </div>

        <DocTranslator targetLanguage={targetLanguage} />

        {/* History (signed-in users) */}
        {isSignedIn && (
          <section className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 shadow-sm">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Recent translations</span>
              {history.length > 0 && (
                <button onClick={clearHistory} className="flex items-center gap-1 hover:text-red-500 transition normal-case tracking-normal">
                  <Trash2 className="w-3.5 h-3.5" /> Clear
                </button>
              )}
            </div>
            {history.length === 0 ? (
              <p className="mt-3 text-sm text-gray-400 dark:text-gray-600 italic">Your translations will be saved here for 90 days.</p>
            ) : (
              <ul className="mt-2 divide-y divide-gray-100 dark:divide-gray-800 max-h-72 overflow-y-auto">
                {history.map((h) => (
                  <li key={h.id}>
                    <button
                      onClick={() => {
                        setText(h.text);
                        setTargetLanguage(h.targetLanguage);
                        setResult({ detectedLanguage: h.detectedLanguage, translation: h.translation });
                      }}
                      className="w-full text-left py-2.5 px-1 hover:bg-gray-50 dark:hover:bg-gray-800/60 rounded-lg transition"
                    >
                      <p className="text-sm text-gray-800 dark:text-gray-100 truncate">{h.text}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {h.detectedLanguage} → {h.targetLanguage} · {new Date(h.ts).toLocaleString()}
                      </p>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
      </main>
    </div>
  );
}