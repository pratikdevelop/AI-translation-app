import Razorpay from "razorpay";
import { clerkClient } from "@clerk/nextjs/server";

// Created lazily so the build does not fail when keys are not set yet.
export function getRazorpay() {
    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    if (!key_id || !key_secret) throw new Error("Razorpay keys are not configured.");
    return new Razorpay({ key_id, key_secret });
}

export async function setPlan(userId: string, plan: "pro" | "free", subscriptionId?: string) {
    await (await clerkClient()).users.updateUserMetadata(userId, {
        publicMetadata: { plan },
        ...(subscriptionId ? { privateMetadata: { subscriptionId } } : {}),
    });
}