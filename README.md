Apple Storefront — Next.js + Stripe scaffold

## What’s in here

- Storefront UI (Tailwind) with a tiny cart
- `POST /api/checkout` creates a Stripe Checkout Session
- `POST /api/webhook` validates Stripe signatures and (optionally) POSTs an order payload to `SLOCK_ORDER_WEBHOOK_URL`
- `GET /api/session?session_id=...` helper to inspect a checkout session

## Local dev

```bash
cp .env.example .env.local
npm i
npm run dev
```

Open `http://localhost:3000`.

## Stripe setup

Required env vars in `.env.local`:

- `NEXT_PUBLIC_APP_URL` (e.g. `http://localhost:3000`)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

Webhook (local):

```bash
# in another terminal
stripe listen --forward-to http://localhost:3000/api/webhook
```

## Slock handoff (optional)

Set `SLOCK_ORDER_WEBHOOK_URL` to any HTTPS endpoint that should receive a JSON payload when a checkout completes. This is a lightweight “handoff” hook to create a Slock task, notify a channel, etc.

Payload shape is defined in `src/lib/slock.ts`.
