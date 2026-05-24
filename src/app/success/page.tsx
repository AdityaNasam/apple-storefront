import Link from "next/link";

type Props = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SuccessPage({ searchParams }: Props) {
  const sp = (await searchParams) ?? {};
  const sessionId = typeof sp.session_id === "string" ? sp.session_id : null;

  return (
    <div className="min-h-dvh bg-zinc-950 text-zinc-50">
      <main className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-16">
        <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-6">
          <h1 className="text-2xl font-semibold tracking-tight">
            Payment successful
          </h1>
          <p className="mt-2 text-sm leading-6 text-zinc-200">
            If your webhook is configured, it will fire on
            `checkout.session.completed` and can hand off an order payload to
            Slock.
          </p>
        </div>

        {sessionId ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="text-sm font-semibold tracking-tight">
              Stripe session
            </div>
            <div className="mt-2 break-all text-sm text-zinc-300">
              {sessionId}
            </div>
            <p className="mt-3 text-xs text-zinc-400">
              You can inspect it locally via `GET /api/session?session_id=...`.
            </p>
          </div>
        ) : null}

        <div className="flex items-center gap-3">
          <Link
            className="rounded-full bg-white px-4 py-2 text-sm font-medium text-zinc-950"
            href="/"
          >
            Back to store
          </Link>
          <Link
            className="rounded-full border border-white/10 bg-transparent px-4 py-2 text-sm text-zinc-200 hover:bg-white/5"
            href="/cancel"
          >
            Cancel page
          </Link>
        </div>
      </main>
    </div>
  );
}

