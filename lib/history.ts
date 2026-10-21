import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();
const MAX_ITEMS = 50;
const TTL_SECONDS = 60 * 60 * 24 * 90; // history auto-expires after 90 days

export type HistoryItem = {
  id: string; ts: number; text: string; targetLanguage: string;
  tone: string; detectedLanguage: string; translation: string;
};
const key = (userId: string) => `h:${userId}`;

export async function addHistory(userId: string, item: HistoryItem) {
  await redis.lpush(key(userId), item);
  await redis.ltrim(key(userId), 0, MAX_ITEMS - 1);
  await redis.expire(key(userId), TTL_SECONDS);
}
export const getHistory = (userId: string) => redis.lrange<HistoryItem>(key(userId), 0, MAX_ITEMS - 1);
export const clearHistory = (userId: string) => redis.del(key(userId));
