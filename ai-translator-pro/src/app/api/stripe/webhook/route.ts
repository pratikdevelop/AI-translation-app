import Stripe from "stripe";
import { clerkClient } from "@clerk/nextjs/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

async function setPlan(userId: string | null | undefined, plan: "pro" | "free") {
  if (!userId) return;
  await (await clerkClient()).users.updateUserMetadata(userId, { publicMetadata: { plan } });
}

export async function POST(req: Request) {
  const body = await req.text(); // raw body required for signature check
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, req.headers.get("stripe-signature")!, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return new Response("Bad signature", { status: 400 });
  }
  if (event.type === "checkout.session.completed") {
    await setPlan((event.data.object as Stripe.Checkout.Session).client_reference_id, "pro");
  }
  if (event.type === "customer.subscription.deleted") {
    await setPlan((event.data.object as Stripe.Subscription).metadata.userId, "free");
  }
  return new Response("ok");
}
