import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const getBaseUrl = () => {
    if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
    if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
    return 'https://nexus-store-woad.vercel.app';
  };

  const siteUrl = getBaseUrl();

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api/', '/downloads/'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
