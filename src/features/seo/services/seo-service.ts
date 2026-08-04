/**
 * SEO Service
 * Production-ready SEO implementation
 */

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
  noindex?: boolean;
  nofollow?: boolean;
}

export interface JSONLD {
  '@context': string;
  '@type': string;
  [key: string]: any;
}

export interface SitemapURL {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

class SEOService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://destinyrisinghub.com';
  }

  // Generate metadata for pages
  generateMetadata(config: SEOConfig) {
    const metadata: any = {
      title: config.title,
      description: config.description,
      keywords: config.keywords?.join(', '),
    };

    if (config.canonical) {
      metadata.alternates = {
        canonical: config.canonical,
      };
    }

    if (config.ogImage) {
      metadata.openGraph = {
        title: config.title,
        description: config.description,
        images: [
          {
            url: config.ogImage,
            width: 1200,
            height: 630,
            alt: config.title,
          },
        ],
      };

      metadata.twitter = {
        card: 'summary_large_image',
        title: config.title,
        description: config.description,
        images: [config.ogImage],
      };
    }

    if (config.noindex) {
      metadata.robots = {
        index: false,
        follow: !config.nofollow,
      };
    }

    return metadata;
  }

  // Generate JSON-LD for different content types
  generateJSONLD(type: string, data: any): JSONLD {
    switch (type) {
      case 'website':
        return this.generateWebsiteJSONLD(data);
      case 'game':
        return this.generateGameJSONLD(data);
      case 'character':
        return this.generateCharacterJSONLD(data);
      case 'article':
        return this.generateArticleJSONLD(data);
      case 'breadcrumb':
        return this.generateBreadcrumbJSONLD(data);
      case 'faq':
        return this.generateFAQJSONLD(data);
      default:
        return this.generateWebsiteJSONLD(data);
    }
  }

  private generateWebsiteJSONLD(data: any): JSONLD {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Destiny Rising Hub',
      url: this.baseUrl,
      description: data.description,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${this.baseUrl}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    };
  }

  private generateGameJSONLD(data: any): JSONLD {
    return {
      '@context': 'https://schema.org',
      '@type': 'VideoGame',
      name: data.name,
      description: data.description,
      genre: data.genre,
      gamePlatform: data.platforms,
      operatingSystem: data.platforms.join(', '),
      author: {
        '@type': 'Organization',
        name: data.developer,
      },
      datePublished: data.releaseDate,
    };
  }

  private generateCharacterJSONLD(data: any): JSONLD {
    return {
      '@context': 'https://schema.org',
      '@type': 'Thing',
      name: data.name,
      description: data.description,
      image: data.portrait,
      additionalProperty: [
        {
          '@type': 'PropertyValue',
          name: 'Element',
          value: data.element,
        },
        {
          '@type': 'PropertyValue',
          name: 'Role',
          value: data.role,
        },
        {
          '@type': 'PropertyValue',
          name: 'Rarity',
          value: data.rarity,
        },
      ],
    };
  }

  private generateArticleJSONLD(data: any): JSONLD {
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: data.title,
      description: data.description,
      image: data.coverImage,
      author: {
        '@type': 'Person',
        name: data.author,
      },
      datePublished: data.publishedAt,
      dateModified: data.updatedAt,
      publisher: {
        '@type': 'Organization',
        name: 'Destiny Rising Hub',
        logo: {
          '@type': 'ImageObject',
          url: `${this.baseUrl}/logo.png`,
        },
      },
    };
  }

  private generateBreadcrumbJSONLD(items: any[]): JSONLD {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url ? `${this.baseUrl}${item.url}` : undefined,
      })),
    };
  }

  private generateFAQJSONLD(data: any[]): JSONLD {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: data.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    };
  }

  // Generate sitemap
  generateSitemap(urls: SitemapURL[]): string {
    const urlElements = urls
      .map((url) => {
        let xml = `  <url>\n    <loc>${this.baseUrl}${url.loc}</loc>`;
        if (url.lastmod) xml += `\n    <lastmod>${url.lastmod}</lastmod>`;
        if (url.changefreq) xml += `\n    <changefreq>${url.changefreq}</changefreq>`;
        if (url.priority !== undefined) xml += `\n    <priority>${url.priority}</priority>`;
        xml += '\n  </url>';
        return xml;
      })
      .join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`;
  }

  // Generate robots.txt
  generateRobotsTxt(): string {
    return `User-agent: *
Allow: /

Sitemap: ${this.baseUrl}/sitemap.xml

# Disallow admin area
Disallow: /admin/
Disallow: /api/

# Disallow search results
Disallow: /search?*

# Crawl-delay
Crawl-delay: 1`;
  }

  // Generate RSS feed
  generateRSSFeed(items: any[]): string {
    const itemsXml = items
      .map(
        (item) => `    <item>
      <title>${item.title}</title>
      <link>${this.baseUrl}${item.url}</link>
      <description>${item.description}</description>
      <pubDate>${new Date(item.publishedAt).toUTCString()}</pubDate>
      <guid>${this.baseUrl}${item.url}</guid>
    </item>`
      )
      .join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Destiny Rising Hub</title>
    <link>${this.baseUrl}</link>
    <description>The ultimate Destiny Rising companion platform</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${itemsXml}
  </channel>
</rss>`;
  }

  // Get canonical URL
  getCanonicalUrl(path: string): string {
    return `${this.baseUrl}${path}`;
  }

  // Generate hreflang tags
  generateHreflang(path: string, locales: string[]): string[] {
    return locales.map((locale) => {
      const url = locale === 'en' ? path : `/${locale}${path}`;
      return `<link rel="alternate" hreflang="${locale}" href="${this.baseUrl}${url}" />`;
    });
  }
}

export const seoService = new SEOService();
