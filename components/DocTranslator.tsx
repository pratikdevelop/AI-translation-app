"use client";

import { useRef, useState } from "react";
import { useUser, SignInButton } from "@clerk/nextjs";
import { FileText, Upload, Download, AlertCircle } from "lucide-react";
import { extractDocx, buildDocx } from "@/lib/docx";

type Done = { url: string; name: string; failed: number };

export function DocTranslator({ targetLanguage }: { targetLanguage: string }) {
  const { isSignedIn } = useUser();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState<Done | null>(null);

  async function run(file: File) {
    setBusy(true); setError(""); setDone(null); setProgress(0);
    try {
      if (!file.name.toLowerCase().endsWith(".docx")) throw new Error("Please choose a .docx (Word) file.");
      if (file.size > 10 * 1024 * 1024) throw new Error("File is larger than 10 MB.");
      setStatus("Reading document...");
      const { zip, segments } = await extractDocx(await file.arrayBuffer());
      if (segments.length === 0) throw new Error("No text found in this document.");
      if (segments.some((s) => s.text.length > 4000)) throw new Error("A paragraph is longer than 4,000 characters. Please split it and retry.");

      const totalChars = segments.reduce((n, s) => n + s.text.length, 0);
      const sample = segments.map((s) => s.text).join(" ").slice(0, 1500);
      const startRes = await fetch("/api/doc/start", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ totalChars, sample, targetLanguage }),
      });
      const start = await startRes.json();
      if (!startRes.ok) throw new Error(start.error || "Could not start translation.");

      // Send paragraphs in small batches so progress is visible and requests stay short.
      const batches: number[][] = [];
      let cur: number[] = [], len = 0;
      segments.forEach((s, i) => {
        if (cur.length >= 15 || (len + s.text.length > 3500 && cur.length)) { batches.push(cur); cur = []; len = 0; }
        cur.push(i); len += s.text.length;
      });
      if (cur.length) batches.push(cur);

      const translations: string[] = new Array(segments.length);
      let failed = 0;
      for (let b = 0; b < batches.length; b++) {
        setStatus(`Translating from ${start.sourceLanguage} to ${targetLanguage}... (${b + 1}/${batches.length})`);
        const res = await fetch("/api/doc/segments", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jobId: start.jobId, targetLanguage, segments: batches[b].map((i) => segments[i].text) }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Translation failed.");
        batches[b].forEach((segIdx, k) => (translations[segIdx] = data.translations[k]));
        failed += data.failed;
        setProgress(Math.round(((b + 1) / batches.length) * 100));
      }

      setStatus("Building file...");
      const blob = await buildDocx(zip, segments, translations);
      const base = file.name.replace(/\.docx$/i, "");
      setDone({ url: URL.createObjectURL(blob), name: `${base} (${targetLanguage}).docx`, failed });
      setStatus("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setStatus("");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <section className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 shadow-sm">
      <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800 text-xs font-semibold text-gray-400 uppercase tracking-wider">
        <span className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> Translate a Word document</span>
        <span className="normal-case tracking-normal">to {targetLanguage}</span>
      </div>

      {!isSignedIn ? (
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
          <SignInButton mode="modal"><button className="text-blue-600 dark:text-blue-400 font-medium hover:underline">Sign in</button></SignInButton>{" "}
          to translate .docx files. Formatting, tables and images are kept.
        </p>
      ) : (
        <div className="mt-3 flex flex-col gap-3">
          <input ref={inputRef} type="file" accept=".docx" hidden onChange={(e) => e.target.files?.[0] && run(e.target.files[0])} />
          <button
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="self-start px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition disabled:opacity-50 flex items-center gap-2"
          >
            <Upload className="w-4 h-4" /> {busy ? "Working..." : "Choose .docx file"}
          </button>

          {busy && (
            <div>
              <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                <div className="h-full bg-blue-600 transition-all" style={{ width: `${progress}%` }} />
              </div>
              <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">{status}</p>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-red-500 text-sm p-3 bg-red-50 dark:bg-red-950/50 rounded-xl border border-red-200 dark:border-red-800">
              <AlertCircle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}

          {done && (
            <div className="text-sm">
              <a href={done.url} download={done.name} className="inline-flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl transition">
                <Download className="w-4 h-4" /> Download {done.name}
              </a>
              {done.failed > 0 && (
                <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">{done.failed} paragraph(s) could not be translated and were left as the original.</p>
              )}
            </div>
          )}
          <p className="text-xs text-gray-400 dark:text-gray-600">Free plan: 1 document per day, up to about 2,000 words. Text formatting inside a paragraph (for example one bold word) is simplified.</p>
        </div>
      )}
    </section>
  );
}
