import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/.next/', '/static/'],
      },
    ],
    sitemap: 'https://mulesoo.com/sitemap.xml',
  };
}
