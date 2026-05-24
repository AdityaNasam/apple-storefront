import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
  }

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["line_items"],
  });

  return NextResponse.json({
    id: session.id,
    status: session.status,
    payment_status: session.payment_status,
    customer_email: session.customer_details?.email ?? null,
    amount_subtotal: session.amount_subtotal ?? null,
    amount_total: session.amount_total ?? null,
    currency: session.currency ?? null,
    metadata: session.metadata ?? null,
    line_items: (session.line_items?.data ?? []).map((li) => ({
      quantity: li.quantity ?? null,
      description: li.description ?? null,
      amount_total: li.amount_total ?? null,
      currency: li.currency ?? null,
    })),
  });
}
