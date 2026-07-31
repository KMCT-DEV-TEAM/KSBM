import './globals.css';

export async function generateMetadata() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/cms/seo/global`, { 
      next: { revalidate: 10 } // Revalidate every 10 seconds for testing, can be increased later
    });
    
    if (!res.ok) throw new Error('Failed to fetch SEO settings');
    
    const seoData = await res.json();
    
    const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace('/api', '');
    const getImageUrl = (url) => {
      if (!url) return '';
      if (url.startsWith('http')) return url;
      return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
    };

    const defaultTitle = 'KMCT School of Business Management | KSBM';
    const defaultDesc = 'Welcome to KMCT School of Business Management (KSBM). We build careers that matter with 99% placement rates, top-tier academic programs, accreditation, state-of-the-art facilities, and a vibrant campus life.';

    return {
      title: seoData.metaTitle || defaultTitle,
      description: seoData.metaDescription || defaultDesc,
      keywords: seoData.keywords || 'KMCT, KSBM, MBA, Business School, Management, Placement, Education, Kerala, Business Management',
      openGraph: {
        type: 'website',
        title: seoData.ogTitle || seoData.metaTitle || defaultTitle,
        description: seoData.ogDescription || seoData.metaDescription || defaultDesc,
        images: seoData.ogImage ? [getImageUrl(seoData.ogImage)] : [],
      },
      twitter: {
        card: seoData.twitterCard || 'summary_large_image',
        title: seoData.twitterTitle || seoData.ogTitle || seoData.metaTitle || defaultTitle,
        description: seoData.twitterDescription || seoData.ogDescription || seoData.metaDescription || defaultDesc,
      },
      icons: seoData.favicon ? {
        icon: getImageUrl(seoData.favicon)
      } : undefined,
    };
  } catch (error) {
    console.error('Error fetching global SEO:', error);
    return {
      title: 'KMCT School of Business Management | KSBM',
      description: 'Welcome to KMCT School of Business Management (KSBM). We build careers that matter with 99% placement rates, top-tier academic programs, accreditation, state-of-the-art facilities, and a vibrant campus life.',
      keywords: 'KMCT, KSBM, MBA, Business School, Management, Placement, Education, Kerala, Business Management',
      openGraph: {
        type: 'website',
        title: 'KMCT School of Business Management | KSBM',
        description: 'Welcome to KMCT School of Business Management (KSBM). Discover top-tier academic programs, outstanding placements, and a vibrant campus life.',
      },
      twitter: {
        card: 'summary_large_image',
        title: 'KMCT School of Business Management | KSBM',
        description: 'Welcome to KMCT School of Business Management (KSBM). Discover top-tier academic programs, outstanding placements, and a vibrant campus life.',
      }
    };
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}

