import { Redis } from "@upstash/redis";
import { clerkClient } from "@clerk/nextjs/server";

const redis = Redis.fromEnv();

export const DOC_PLANS = {
  free: { docsPerDay: 1, maxChars: 12_000 },   // about 2,000 words
  pro: { docsPerDay: 50, maxChars: 300_000 },
} as const;
export type DocPlan = keyof typeof DOC_PLANS;

export async function getPlan(userId: string): Promise<DocPlan> {
  try {
    const user = await (await clerkClient()).users.getUser(userId);
    return user.publicMetadata.plan === "pro" ? "pro" : "free";
  } catch {
    return "free";
  }
}

export async function startJob(userId: string, plan: DocPlan, totalChars: number, sourceCode: string) {
  const p = DOC_PLANS[plan];
  if (totalChars > p.maxChars) {
    return { ok: false as const, status: 413, upgrade: plan === "free",
      error: `This document is too long for the ${plan} plan (limit about ${Math.round(p.maxChars / 6).toLocaleString()} words).` };
  }
  const key = `d:${userId}:${new Date().toISOString().slice(0, 10)}`;
  const n = await redis.incr(key);
  if (n === 1) await redis.expire(key, 172_800);
  if (n > p.docsPerDay) {
    await redis.decr(key);
    return { ok: false as const, status: 402, upgrade: true, error: "Daily document limit reached." };
  }
  const jobId = crypto.randomUUID();
  await redis.hset(`j:${jobId}`, { userId, budget: Math.ceil(totalChars * 1.05) + 50, src: sourceCode });
  await redis.expire(`j:${jobId}`, 3600);
  return { ok: true as const, jobId };
}

// Spend part of the job's character budget; null = unknown job, wrong owner or budget used up.
export async function consume(jobId: string, userId: string, chars: number) {
  const job = await redis.hgetall<{ userId: string; budget: number; src: string }>(`j:${jobId}`);
  if (!job || job.userId !== userId) return null;
  const left = await redis.hincrby(`j:${jobId}`, "budget", -chars);
  if (left < 0) {
    await redis.hincrby(`j:${jobId}`, "budget", chars);
    return null;
  }
  return { src: String(job.src) };
}
