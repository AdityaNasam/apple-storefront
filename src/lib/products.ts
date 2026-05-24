export type Product = {
  id: string;
  name: string;
  description: string;
  priceUsdCents: number;
  imageUrl: string;
};

export const PRODUCTS: readonly Product[] = [
  {
    id: "iphone-15-pro",
    name: "iPhone 15 Pro",
    description: "Titanium. A17 Pro. Pro camera system.",
    priceUsdCents: 99900,
    imageUrl:
      "https://images.unsplash.com/photo-1695048133142-1a20484c2f6b?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "macbook-air-m3",
    name: "MacBook Air",
    description: "M3. Ultralight. All-day battery.",
    priceUsdCents: 109900,
    imageUrl:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "airpods-pro",
    name: "AirPods Pro",
    description: "Active Noise Cancellation. Adaptive Transparency.",
    priceUsdCents: 24900,
    imageUrl:
      "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=1400&q=80",
  },
] as const;

export function getProduct(productId: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === productId);
}

export function formatUsd(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}
