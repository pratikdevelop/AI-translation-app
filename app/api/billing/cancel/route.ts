import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { getRazorpay } from "@/lib/razorpay";

export async function POST() {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
    const user = await (await clerkClient()).users.getUser(userId);
    const subscriptionId = user.privateMetadata.subscriptionId;
    if (typeof subscriptionId !== "string") return NextResponse.json({ error: "No active subscription found." }, { status: 404 });

    try {
        await getRazorpay().subscriptions.cancel(subscriptionId, true); // true = keep Pro until the paid period ends
        return NextResponse.json({ ok: true });
    } catch (e) {
        console.error("[billing] cancel failed", e);
        return NextResponse.json({ error: "Could not cancel. Please email us." }, { status: 502 });
    }
}