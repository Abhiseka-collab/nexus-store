import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const getBaseUrl = () => {
    return process.env.NEXT_PUBLIC_SITE_URL || 'https://nexus-store.vercel.app';
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
