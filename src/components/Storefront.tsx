"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { formatUsd, PRODUCTS } from "@/lib/products";

type CartItem = { productId: string; quantity: number };

function clampQty(qty: number): number {
  return Math.max(0, Math.min(99, Math.floor(qty)));
}

export default function Storefront() {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cartItems = useMemo<CartItem[]>(
    () =>
      Object.entries(cart)
        .filter(([, quantity]) => quantity > 0)
        .map(([productId, quantity]) => ({ productId, quantity })),
    [cart],
  );

  const totals = useMemo(() => {
    const subtotal = cartItems.reduce((sum, item) => {
      const product = PRODUCTS.find((p) => p.id === item.productId);
      if (!product) return sum;
      return sum + product.priceUsdCents * item.quantity;
    }, 0);
    const count = cartItems.reduce((sum, i) => sum + i.quantity, 0);
    return { subtotal, count };
  }, [cartItems]);

  async function checkout() {
    setError(null);
    setIsCheckingOut(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ items: cartItems }),
      });
      const json = (await res.json().catch(() => null)) as
        | { url?: string; error?: string }
        | null;
      if (!res.ok || !json?.url) {
        throw new Error(json?.error || "Checkout failed");
      }
      window.location.href = json.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Checkout failed");
      setIsCheckingOut(false);
    }
  }

  return (
    <div className="min-h-dvh bg-zinc-950 text-zinc-50">
      <header className="sticky top-0 z-10 border-b border-white/10 bg-zinc-950/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-xl bg-white/10 text-sm font-semibold">
              
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-tight">
                Apple Storefront
              </div>
              <div className="text-xs text-zinc-400">Stripe checkout demo</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-sm text-zinc-300 sm:block">
              {totals.count} item{totals.count === 1 ? "" : "s"} •{" "}
              {formatUsd(totals.subtotal)}
            </div>
            <button
              className="rounded-full bg-white px-4 py-2 text-sm font-medium text-zinc-950 disabled:opacity-50"
              disabled={isCheckingOut || cartItems.length === 0}
              onClick={checkout}
              type="button"
            >
              {isCheckingOut ? "Redirecting…" : "Checkout"}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-col gap-2">
          <h1 className="text-balance text-3xl font-semibold tracking-tight">
            Everything you love. On a tiny demo.
          </h1>
          <p className="max-w-2xl text-pretty text-sm leading-6 text-zinc-300">
            Add items to your cart, then run through Stripe Checkout. On payment
            success, the webhook can optionally hand off an “order task” to
            Slock via `SLOCK_ORDER_WEBHOOK_URL`.
          </p>
        </div>

        {error ? (
          <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
            {error}
          </div>
        ) : null}

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {PRODUCTS.map((p) => {
            const qty = cart[p.id] ?? 0;
            return (
              <div
                key={p.id}
                className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    alt={p.name}
                    src={p.imageUrl}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                    priority={p.id === PRODUCTS[0]?.id}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 via-zinc-950/0" />
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-lg font-semibold tracking-tight">
                        {p.name}
                      </div>
                      <div className="mt-1 text-sm text-zinc-300">
                        {p.description}
                      </div>
                    </div>
                    <div className="shrink-0 rounded-full bg-white/10 px-3 py-1 text-sm">
                      {formatUsd(p.priceUsdCents)}
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="grid size-9 place-items-center rounded-xl border border-white/10 bg-white/5 text-sm text-zinc-100 hover:bg-white/10 disabled:opacity-40"
                        disabled={qty <= 0}
                        onClick={() =>
                          setCart((prev) => ({
                            ...prev,
                            [p.id]: clampQty((prev[p.id] ?? 0) - 1),
                          }))
                        }
                      >
                        −
                      </button>
                      <div className="w-10 text-center text-sm tabular-nums text-zinc-200">
                        {qty}
                      </div>
                      <button
                        type="button"
                        className="grid size-9 place-items-center rounded-xl border border-white/10 bg-white/5 text-sm text-zinc-100 hover:bg-white/10 disabled:opacity-40"
                        disabled={qty >= 99}
                        onClick={() =>
                          setCart((prev) => ({
                            ...prev,
                            [p.id]: clampQty((prev[p.id] ?? 0) + 1),
                          }))
                        }
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-zinc-50 hover:bg-white/15"
                      onClick={() =>
                        setCart((prev) => ({
                          ...prev,
                          [p.id]: clampQty((prev[p.id] ?? 0) + 1),
                        }))
                      }
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 rounded-3xl border border-white/10 bg-white/5 p-6 sm:flex-row sm:items-center">
          <div>
            <div className="text-sm font-semibold tracking-tight">Cart</div>
            <div className="mt-1 text-sm text-zinc-300">
              {totals.count} item{totals.count === 1 ? "" : "s"} • Subtotal{" "}
              {formatUsd(totals.subtotal)}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-full border border-white/10 bg-transparent px-4 py-2 text-sm text-zinc-200 hover:bg-white/5 disabled:opacity-40"
              disabled={cartItems.length === 0 || isCheckingOut}
              onClick={() => setCart({})}
            >
              Clear
            </button>
            <button
              type="button"
              className="rounded-full bg-white px-4 py-2 text-sm font-medium text-zinc-950 disabled:opacity-50"
              disabled={isCheckingOut || cartItems.length === 0}
              onClick={checkout}
            >
              {isCheckingOut ? "Redirecting…" : "Checkout"}
            </button>
          </div>
        </div>
      </main>

      <footer className="border-t border-white/10 py-10">
        <div className="mx-auto max-w-6xl px-6 text-xs text-zinc-400">
          Demo only. Images via Unsplash. Payments via Stripe test mode.
        </div>
      </footer>
    </div>
  );
}

