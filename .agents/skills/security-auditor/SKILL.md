---
name: security-auditor
description: Rapid automated defensive security auditing runbook to verify payment gateways, API bounds, download token cryptography, HTTP headers, and admin authentication on NEXUS Store.
---

# NEXUS Security & Vulnerability Auditor

Execute this runbook whenever testing website security, auditing endpoints, or verifying immunity against tampering and scraping:

## Automated 5-Point Health Check

### 1. HTTP Security Headers
Run:
```powershell
curl.exe -I https://nexus-store-woad.vercel.app
```
Verify presence of:
- `Content-Security-Policy` with `frame-ancestors 'self'`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- `X-Frame-Options: SAMEORIGIN`

### 2. Dependency Audit
Run:
```powershell
npm audit
```
Confirm 0 vulnerabilities.

### 3. Digital Asset Protection Test
Verify static files are unreachable and tokens cannot be forged:
```powershell
Invoke-WebRequest -Uri "https://nexus-store-woad.vercel.app/downloads/Personal_Growth_System.xlsx" -UseBasicParsing # Must be 404
Invoke-WebRequest -Uri "https://nexus-store-woad.vercel.app/api/download?orderId=fake&token=fake" -UseBasicParsing # Must be 403
```

### 4. Price Tampering Immunity
Verify server ignores client-supplied `amount` and enforces price from `src/data/products.ts`:
```powershell
Invoke-RestMethod -Uri "https://nexus-store-woad.vercel.app/api/razorpay/order" -Method Post -Body '{"productId":"prod-personal-growth-system","currency":"INR","amount":1}' -ContentType "application/json"
```

### 5. Admin Authentication & Rate Limiting
Verify unauthenticated requests are rejected and rate limiting functions:
```powershell
Invoke-RestMethod -Uri "https://nexus-store-woad.vercel.app/api/admin/auth" -Method Get # Must return authenticated: false
```
