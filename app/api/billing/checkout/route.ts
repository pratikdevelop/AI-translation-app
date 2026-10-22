import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getRazorpay } from "@/lib/razorpay";
import { getPlan } from "@/lib/docjobs";

export async function POST() {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
    if ((await getPlan(userId)) === "pro") return NextResponse.json({ error: "You are already on Pro." }, { status: 409 });
    const planId = process.env.RAZORPAY_PLAN_ID;
    if (!planId) return NextResponse.json({ error: "Payments are not set up yet." }, { status: 503 });

    try {
        const sub = await getRazorpay().subscriptions.create({
            plan_id: planId,
            total_count: 120, // up to 10 years of monthly billing; the user can cancel any time
            quantity: 1,
            customer_notify: 1,
            notes: { userId },
        });
        const url = (sub as unknown as { short_url?: string }).short_url;
        if (!url) throw new Error("No payment link returned");
        return NextResponse.json({ url });
    } catch (e) {
        console.error("[billing] checkout failed", e);
        return NextResponse.json({ error: "Could not start checkout. Please try again." }, { status: 502 });
    }
}