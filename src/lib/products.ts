export type Product = {
  id: string;
  name: string;
  description: string;
  priceUsdCents: number;
  imageUrl: string;
  category: string;
};

export const PRODUCTS: readonly Product[] = [
  {
    id: "iphone-15-pro",
    name: "iPhone 15 Pro",
    description: "Titanium. A17 Pro. Pro camera system.",
    priceUsdCents: 99900,
    category: "iPhone",
    imageUrl:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "airpods-pro",
    name: "AirPods Pro",
    description: "Active Noise Cancellation. Adaptive Transparency.",
    priceUsdCents: 24900,
    category: "AirPods",
    imageUrl:
      "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "macbook-air-13-m5",
    name: "MacBook Air 13″ (M5)",
    description: "16GB / 512GB. Ultralight. All-day battery.",
    priceUsdCents: 109900,
    category: "MacBook",
    imageUrl:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "macbook-air-15-m5",
    name: "MacBook Air 15″ (M5)",
    description: "16GB / 512GB. Bigger screen. Same fanless design.",
    priceUsdCents: 129900,
    category: "MacBook",
    imageUrl:
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "macbook-pro-14-m5",
    name: "MacBook Pro 14″ (M5)",
    description: "16GB / 512GB. Liquid Retina XDR. ProRes.",
    priceUsdCents: 159900,
    category: "MacBook",
    imageUrl:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "macbook-pro-14-m5-pro",
    name: "MacBook Pro 14″ (M5 Pro)",
    description: "24GB / 1TB. Pro chip. Up to 24 CPU cores.",
    priceUsdCents: 219900,
    category: "MacBook",
    imageUrl:
      "https://images.unsplash.com/photo-1611186871525-3e2de1f92714?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "macbook-pro-14-m5-max",
    name: "MacBook Pro 14″ (M5 Max)",
    description: "36GB / 2TB. Max chip. Ultimate performance.",
    priceUsdCents: 359900,
    category: "MacBook",
    imageUrl:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "macbook-pro-16-m5-pro",
    name: "MacBook Pro 16″ (M5 Pro)",
    description: "24GB / 1TB. Bigger canvas. All-day battery.",
    priceUsdCents: 269900,
    category: "MacBook",
    imageUrl:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "macbook-pro-16-m5-max",
    name: "MacBook Pro 16″ (M5 Max)",
    description: "36GB / 2TB. Max chip. For the most demanding workflows.",
    priceUsdCents: 389900,
    category: "MacBook",
    imageUrl:
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=1400&q=80",
  },
];

export function getProduct(productId: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === productId);
}

export function formatUsd(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export function getCategories(): string[] {
  return [...new Set(PRODUCTS.map((p) => p.category))];
}

export function getProductsByCategory(category: string): readonly Product[] {
  return PRODUCTS.filter((p) => p.category === category);
}
