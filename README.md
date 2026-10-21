# AI Translator Pro: backend upgrade

Drop these files into your existing project (keep your UI), then:

    npm i @langchain/openai @langchain/core @langchain/langgraph zod @clerk/nextjs @upstash/redis @upstash/ratelimit stripe
    cp .env.example .env.local   # fill every value

## Setup order
1. Clerk: create app, paste keys. In your layout wrap the app in <ClerkProvider>.
2. Upstash: create a Redis database, paste REST URL and token.
3. Stripe: create a product "Pro" with a monthly price, copy the price ID.
   Webhook endpoint: /api/stripe/webhook, events: checkout.session.completed, customer.subscription.deleted.
   Local testing: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
4. Deploy to Vercel and add the same env vars there.

## How it earns
- Free: 1,000 chars per request, 3,000 chars per day (anonymous users are limited by IP).
- Pro: 5,000 chars per request, 300,000 chars per day. Edit PLANS in src/lib/usage.ts.
- A 402 response with `upgrade: true` is your cue to show the upgrade button in the UI.

## Still to build (UI side)
- /pricing page + "Upgrade" button calling POST /api/stripe/checkout, then redirect to the returned url
- Tone selector, remaining-quota display, sign-in button in header
- Terms, privacy policy, and a Stripe customer portal link for cancellations
