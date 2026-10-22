import crypto from "node:crypto";
import { setPlan } from "@/lib/razorpay";

const GO_PRO = new Set(["subscription.activated", "subscription.charged", "subscription.resumed"]);
const GO_FREE = new Set(["subscription.cancelled", "subscription.completed", "subscription.halted", "subscription.paused"]);

export async function POST(req: Request) {
    const body = await req.text(); // raw body is needed for the signature check
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!secret) return new Response("Not configured", { status: 503 });

    const expected = crypto.createHmac("sha256", secret).update(body).digest("hex");
    const given = req.headers.get("x-razorpay-signature") ?? "";
    if (given.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(given), Buffer.from(expected))) {
        return new Response("Bad signature", { status: 400 });
    }

    const event = JSON.parse(body) as { event: string; payload?: { subscription?: { entity?: { id?: string; notes?: { userId?: string } } } } };
    const sub = event.payload?.subscription?.entity;
    const userId = sub?.notes?.userId;
    if (!userId) return new Response("ok"); // not one of our subscriptions

    try {
        if (GO_PRO.has(event.event)) await setPlan(userId, "pro", sub?.id);
        else if (GO_FREE.has(event.event)) await setPlan(userId, "free");
    } catch (e) {
        console.error("[billing] webhook failed", e);
        return new Response("Error", { status: 500 }); // Razorpay will retry
    }
    return new Response("ok");
}