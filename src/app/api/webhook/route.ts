import { headers } from "next/headers";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { notifySlockOrder } from "@/lib/slock";
import { dedupeStripeEvent } from "@/lib/idempotency";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return new Response("Missing STRIPE_WEBHOOK_SECRET", { status: 500 });
  }

  const headerStore = await headers();
  const signature = headerStore.get("stripe-signature");
  if (!signature) {
    return new Response("Missing stripe-signature", { status: 400 });
  }

  const rawBody = await request.text();
  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    return new Response(message, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const dedupe = await dedupeStripeEvent(event.id, 60 * 60 * 24 * 7);
    if (dedupe.ok && !dedupe.shouldProcess) {
      return new Response("ok", { status: 200 });
    }
    const session = event.data.object as Stripe.Checkout.Session;

    const itemsRaw = session.metadata?.items ?? null;
    let parsedItems: Array<{ productId: string; quantity: number }> | undefined;
    if (itemsRaw && typeof itemsRaw === "string") {
      try {
        parsedItems = JSON.parse(itemsRaw) as Array<{
          productId: string;
          quantity: number;
        }>;
      } catch {
        parsedItems = undefined;
      }
    }

    await notifySlockOrder({
      orderId: `order_${session.id}`,
      email: session.customer_details?.email ?? null,
      amountSubtotal: session.amount_subtotal ?? null,
      amountTotal: session.amount_total ?? null,
      currency: session.currency ?? null,
      stripeSessionId: session.id,
      createdAt: new Date().toISOString(),
      items: parsedItems,
    });
  }

  return new Response("ok", { status: 200 });
}
