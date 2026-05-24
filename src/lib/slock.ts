export type SlockOrderPayload = {
  orderId: string;
  email: string | null;
  amountSubtotal: number | null;
  amountTotal: number | null;
  currency: string | null;
  stripeSessionId: string;
  createdAt: string;
  items?: Array<{
    productId: string;
    quantity: number;
  }>;
};

export async function notifySlockOrder(payload: SlockOrderPayload): Promise<void> {
  const url = process.env.SLOCK_ORDER_WEBHOOK_URL;
  if (!url) return;

  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `SLOCK_ORDER_WEBHOOK_URL returned ${res.status} ${res.statusText}${text ? `: ${text}` : ""}`,
    );
  }
}
