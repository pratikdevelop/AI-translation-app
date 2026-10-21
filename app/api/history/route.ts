import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getHistory, clearHistory } from "@/lib/history";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Sign in to see history." }, { status: 401 });
  return NextResponse.json({ items: await getHistory(userId) });
}

export async function DELETE() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  await clearHistory(userId);
  return NextResponse.json({ ok: true });
}
