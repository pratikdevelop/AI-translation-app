import { NextResponse } from "next/server";
import { z } from "zod";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { translatorGraph, LANGUAGES, TONES } from "@/lib/translatorGraph";
import { checkLimits, type Plan } from "@/lib/usage";
import { addHistory } from "@/lib/history";

export const maxDuration = 60; // allow slow model responses on hosts like Vercel

const Body = z.object({
  text: z.string().trim().min(1).max(5000),
  targetLanguage: z.enum(LANGUAGES),
  tone: z.enum(TONES).default("neutral"),
});

export async function POST(req: Request) {
  const t0 = Date.now();
  const lap = (label: string) => console.log(`[translate] ${label} +${Date.now() - t0}ms`);

  try {
    const parsed = Body.safeParse(await req.json().catch(() => null));
    if (!parsed.success) return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    lap("body parsed");

    const { userId } = await auth();
    lap(`auth done (${userId ? "signed in" : "anonymous"})`);

    // Plan lookup is optional: if Clerk is slow or fails, fall back to the free plan.
    let plan: Plan = "free";
    if (userId) {
      try {
        const user = await (await clerkClient()).users.getUser(userId);
        if (user.publicMetadata.plan === "pro") plan = "pro";
      } catch (e) {
        console.error("[translate] plan lookup failed, using free", e);
      }
      lap("plan lookup done");
    }

    const id = userId ?? `ip:${(req.headers.get("x-forwarded-for") ?? "unknown").split(",")[0].trim()}`;
    const limit = await checkLimits(id, plan, parsed.data.text.length);
    lap("limits checked");
    if (!limit.ok) return NextResponse.json({ error: limit.error, upgrade: "upgrade" in limit }, { status: limit.status });

    const r = await translatorGraph.invoke(parsed.data);
    lap("model done");

    if (userId) {
      await addHistory(userId, {
        id: crypto.randomUUID(), ts: Date.now(), text: parsed.data.text,
        targetLanguage: parsed.data.targetLanguage, tone: parsed.data.tone,
        detectedLanguage: r.detectedLanguage, translation: r.translation,
      }).catch((e) => console.error("[translate] history save failed", e));
    }

    return NextResponse.json({
      detectedLanguage: r.detectedLanguage,
      correctedText: r.correctedText,
      translation: r.translation,
      remaining: limit.remaining,
    });
  } catch (e) {
    console.error(`[translate] failed after ${Date.now() - t0}ms`, e); // full error stays in the server log only
    return NextResponse.json({ error: "Translation failed. Please try again." }, { status: 502 });
  }
}