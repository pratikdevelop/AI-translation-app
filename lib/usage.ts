import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

const redis = Redis.fromEnv();
const burst = new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(10, "1 m"), prefix: "rl" });

export const PLANS = {
  free: { dailyChars: 3_000, maxChars: 1_000 },
  pro: { dailyChars: 300_000, maxChars: 5_000 },
} as const;
export type Plan = keyof typeof PLANS;

export async function checkLimits(id: string, plan: Plan, chars: number) {
  const p = PLANS[plan];
  if (chars > p.maxChars) return { ok: false as const, status: 413, error: `Max ${p.maxChars} characters per request on the ${plan} plan.` };
  const { success } = await burst.limit(id);
  if (!success) return { ok: false as const, status: 429, error: "Too many requests. Try again in a minute." };
  const key = `q:${id}:${new Date().toISOString().slice(0, 10)}`;
  const used = await redis.incrby(key, chars);
  if (used === chars) await redis.expire(key, 172_800);
  if (used > p.dailyChars) {
    await redis.decrby(key, chars);
    return { ok: false as const, status: 402, error: "Daily limit reached. Upgrade to Pro for more.", upgrade: true };
  }
  return { ok: true as const, remaining: p.dailyChars - used };
}
