---
description: Core architectural rules, security boundaries, and store standards for NEXUS Digital Store
trigger: always_on
---

# NEXUS Digital Store — AI Engineering Guardrails

## 1. Project Context & Stack
- **Framework**: Next.js 16 (App Router) with Turbopack, React 19, and Tailwind CSS.
- **Deployment**: Vercel production at `https://nexus-store-woad.vercel.app`.
- **Payment Gateway**: Razorpay (Dual currency: ₹10 INR for India, $1 USD International via PPP).
- **Core Product**: 16-in-1 Personal Growth System (.xlsx) with automated habit streaks, 20-goal matrix, and AI reflection prompts.
- **Support Contact**: `solution00000@outlook.com`.

## 2. Mandatory Security Rules
1. **Zero Unpaid Downloads**: Digital master files must NEVER be placed in `public/`. Master assets reside strictly in `src/private_assets/` and are streamed via `/api/download` using short-lived HMAC-SHA256 signed tokens.
2. **Server-Authoritative Pricing**: The server (`/api/razorpay/order`) must always calculate the official price from `src/data/products.ts` and validate promo codes server-side. Never trust client-supplied amounts.
3. **Constant-Time Verification**: Payment signature verification (`/api/razorpay/verify`) must use `crypto.timingSafeEqual` to eliminate timing side-channel attacks.
4. **No Secrets in Client JS**: `RAZORPAY_KEY_SECRET` and admin password hashes must remain strictly server-side. Admin auth operates via `/api/admin/auth` with HTTP-only cookies and IP brute-force rate limiting.
5. **No Dangerous DOM APIs**: Never use `dangerouslySetInnerHTML`, `eval()`, or unescaped user inputs.

## 3. Verification Standards
- Before completing any feature or code change, ALWAYS run `npm run build` in PowerShell to ensure 0 TypeScript errors, 0 lint warnings, and clean route prerendering.
