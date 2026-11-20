---
name: seo-and-indexing
description: Automated SEO audit, Google Search Console indexation verification, OpenGraph preview testing, and Schema.org rich snippets validation for NEXUS Store.
---

# NEXUS SEO & Search Engine Indexing Engine

Use this skill whenever verifying search engine readiness, resolving Google Search Console errors, auditing sitemaps, or optimizing social link previews.

## 1. Quick Verification Checklist

### Google Search Console & Sitemaps
- **Target Domain**: `https://nexus-store-woad.vercel.app`
- **Sitemap URL**: `https://nexus-store-woad.vercel.app/sitemap.xml`
- **Robots.txt URL**: `https://nexus-store-woad.vercel.app/robots.txt`
- **Sitemap Route**: Submit as `sitemap.xml` (no leading slash in GSC to avoid 308 redirect loops).
- **Core Indexable Routes**:
  1. `/` (Home / Hero / Product / Reviews)
  2. `/privacy` (Privacy Policy)
  3. `/terms` (Terms & Conditions)
  4. `/refund` (Cancellation & Refund Policy)
  5. `/contact` (Support Contact Information)

### OpenGraph & Social Metadata Validation
Test that social crawlers (Instagram, Twitter, WhatsApp, LinkedIn) receive accurate title, description, and preview cards:
```powershell
curl.exe -I -A "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)" https://nexus-store-woad.vercel.app/
curl.exe -I -A "Twitterbot/1.0" https://nexus-store-woad.vercel.app/
```
Ensure HTTP response status is `200 OK` and metadata tags are emitted in `<head>`.

### Structured Data (JSON-LD) Validation
Verify `schema.org` entities inside `src/app/layout.tsx`:
- `SoftwareApplication` (ApplicationCategory: ProductivityApplication)
- `Product` (Name: 16-in-1 Personal Growth System, Price: ₹10 / $1)
- `Organization` (Name: NEXUS, Email: solution00000@outlook.com)
