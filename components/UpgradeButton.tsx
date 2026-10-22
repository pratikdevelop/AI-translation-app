"use client";

import { useState } from "react";
import { useUser, SignInButton } from "@clerk/nextjs";

const base = "w-full py-2.5 font-medium rounded-xl transition disabled:opacity-60";

export function UpgradeButton() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const isPro = user?.publicMetadata?.plan === "pro";

  async function call(path: string, redirect: boolean) {
    setBusy(true); setMsg("");
    try {
      const res = await fetch(path, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      if (redirect) window.location.href = data.url;
      else setMsg("Cancelled. You keep Pro until the end of the period you paid for.");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  if (!isLoaded) return <button disabled className={`${base} bg-gray-200 dark:bg-gray-800 text-gray-500`}>Loading...</button>;

  if (!isSignedIn) {
    return (
      <SignInButton mode="modal">
        <button className={`${base} bg-blue-600 hover:bg-blue-700 text-white`}>Sign in to upgrade</button>
      </SignInButton>
    );
  }

  if (isPro) {
    return (
      <div className="space-y-2">
        <p className="text-center text-sm font-medium text-green-600 dark:text-green-400">You are on Pro</p>
        <button
          disabled={busy}
          onClick={() => confirm("Cancel your subscription? You keep Pro until the end of the period you paid for.") && call("/api/billing/cancel", false)}
          className={`${base} border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800`}
        >
          Cancel subscription
        </button>
        {msg && <p className="text-center text-xs text-gray-500 dark:text-gray-400">{msg}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <button disabled={busy} onClick={() => call("/api/billing/checkout", true)} className={`${base} bg-blue-600 hover:bg-blue-700 text-white`}>
        {busy ? "Opening checkout..." : "Upgrade to Pro"}
      </button>
      {msg && <p className="text-center text-xs text-red-500">{msg}</p>}
    </div>
  );
}