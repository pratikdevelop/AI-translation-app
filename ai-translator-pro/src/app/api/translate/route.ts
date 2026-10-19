import { NextResponse } from "next/server";
import { z } from "zod";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { translatorGraph, LANGUAGES, TONES } from "@/lib/translatorGraph";
import { checkLimits, type Plan } from "@/lib/usage";

const Body = z.object({
  text: z.string().trim().min(1).max(5000),
  targetLanguage: z.enum(LANGUAGES),
  tone: z.enum(TONES).default("neutral"),
});

export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  const { userId } = await auth();
  let plan: Plan = "free";
  if (userId) {
    const user = await (await clerkClient()).users.getUser(userId);
    if (user.publicMetadata.plan === "pro") plan = "pro";
  }
  const id = userId ?? `ip:${(req.headers.get("x-forwarded-for") ?? "unknown").split(",")[0].trim()}`;

  const limit = await checkLimits(id, plan, parsed.data.text.length);
  if (!limit.ok) return NextResponse.json({ error: limit.error, upgrade: "upgrade" in limit }, { status: limit.status });

  try {
    const r = await translatorGraph.invoke(parsed.data);
    return NextResponse.json({
      detectedLanguage: r.detectedLanguage,
      correctedText: r.correctedText,
      translation: r.translation,
      remaining: limit.remaining,
    });
  } catch (e) {
    console.error("translate failed", e); // never leak provider errors to clients
    return NextResponse.json({ error: "Translation failed. Please try again." }, { status: 502 });
  }
}
