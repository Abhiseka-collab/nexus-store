---
name: performance-optimizer
description: Next.js 16 App Router, Turbopack, and Tailwind CSS performance optimization and Core Web Vitals audit runbook for NEXUS store.
---

# NEXUS Web Performance & Core Web Vitals Optimizer

Use this skill whenever optimizing load speeds, reducing client bundle sizes, preventing layout shifts, or debugging hydration errors.

## 1. Golden Performance Rules
1. **Zero Client Hydration Mismatches**: Use `suppressHydrationWarning` on `<html>` and dynamic timestamps to prevent SSR/CSR discrepancies.
2. **Turbopack Build Verification**: Always test with `npm run build` to catch segment configuration conflicts (`cacheComponents: true`).
3. **Static Asset Optimization**:
   - Serve SVG icons inline or through optimized icon packs.
   - External scripts (like Razorpay `checkout.js` and Vercel Analytics) must use `<Script strategy="afterInteractive" />` or `<Script strategy="lazyOnload" />`.
4. **Font Preloading**: Use `next/font/google` (`Geist`, `Geist_Mono`) with `subsets: ['latin']` and `display: 'swap'`.

## 2. Fast Audit Commands
```powershell
# Measure build output and static bundle sizes
npm run build

# Check for unused dependencies
npx depcheck
```
