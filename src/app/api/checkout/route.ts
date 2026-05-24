import { NextResponse } from "next/server";
import { getProduct } from "@/lib/products";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

type CheckoutBody = {
  items: Array<{ productId: string; quantity: number }>;
};

function getAppUrl(): string {
  const url = process.env.NEXT_PUBLIC_APP_URL;
  if (!url) throw new Error("Missing NEXT_PUBLIC_APP_URL");
  return url.replace(/\/+$/, "");
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as CheckoutBody | null;
  if (!body?.items?.length) {
    return NextResponse.json({ error: "Missing items" }, { status: 400 });
  }

  const lineItems = body.items.map((item) => {
    const product = getProduct(item.productId);
    if (!product) {
      throw new Error(`Unknown product: ${item.productId}`);
    }
    const quantity = Math.max(1, Math.min(99, Number(item.quantity) || 1));
    return {
      quantity,
      price_data: {
        currency: "usd",
        unit_amount: product.priceUsdCents,
        product_data: {
          name: product.name,
          description: product.description,
          images: [product.imageUrl],
          metadata: { productId: product.id },
        },
      },
    };
  });

  const stripe = getStripe();
  const appUrl = getAppUrl();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: lineItems,
    success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/cancel`,
    automatic_tax: { enabled: false },
    allow_promotion_codes: true,
    phone_number_collection: { enabled: true },
    billing_address_collection: "required",
    metadata: {
      items: JSON.stringify(
        body.items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
        })),
      ),
    },
  });

  return NextResponse.json({ url: session.url });
}
