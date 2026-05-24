import Link from "next/link";

export default function CancelPage() {
  return (
    <div className="min-h-dvh bg-zinc-950 text-zinc-50">
      <main className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-16">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h1 className="text-2xl font-semibold tracking-tight">
            Checkout canceled
          </h1>
          <p className="mt-2 text-sm leading-6 text-zinc-300">
            No worries — your cart is still here. Try again when ready.
          </p>
        </div>
        <Link
          className="w-fit rounded-full bg-white px-4 py-2 text-sm font-medium text-zinc-950"
          href="/"
        >
          Back to store
        </Link>
      </main>
    </div>
  );
}

