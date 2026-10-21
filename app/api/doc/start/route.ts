import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { LANGUAGES } from "@/lib/languages";
import { detect } from "@/lib/riva";
import { getPlan, startJob } from "@/lib/docjobs";

const Body = z.object({
    totalChars: z.number().int().min(1).max(1_000_000),
    sample: z.string().max(2000),
    targetLanguage: z.enum(LANGUAGES),
});

export async function POST(req: Request) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Sign in to translate documents." }, { status: 401 });
    const parsed = Body.safeParse(await req.json().catch(() => null));
    if (!parsed.success) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

    const src = detect(parsed.data.sample);
    const job = await startJob(userId, await getPlan(userId), parsed.data.totalChars, src.code);
    if (!job.ok) return NextResponse.json({ error: job.error, upgrade: job.upgrade }, { status: job.status });
    return NextResponse.json({ jobId: job.jobId, sourceLanguage: src.name });
}