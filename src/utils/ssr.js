// Server-Side Rendering utilities for SEO optimization

export const generateMetaTags = (pageData) => {
  const {
    title,
    description,
    keywords,
    image,
    url,
    type = 'website',
    structuredData
  } = pageData;

  const metaTags = {
    title: title || 'Swayamsevak Connect',
    description: description || 'Join thousands of volunteers working together for a stronger Bharat.',
    keywords: keywords || 'Swayamsevak, RSS, volunteer, community service, Bharat, shakha, seva',
    image: image || 'https://swayamsevak-connect.onrender.com/og-image.jpg',
    url: url || 'https://swayamsevak-connect.onrender.com',
    type,
    structuredData
  };

  return metaTags;
};

export const generateStructuredData = (type, data) => {
  const baseData = {
    "@context": "https://schema.org",
    "@type": type,
    "url": "https://swayamsevak-connect.onrender.com"
  };

  switch (type) {
    case 'Organization':
      return {
        ...baseData,
        "name": "Swayamsevak Connect",
        "description": "Uniting volunteers across Bharat to serve society and build a stronger nation through dedicated seva and community engagement.",
        "logo": "https://swayamsevak-connect.onrender.com/logo192.png",
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+91-9490940282",
          "contactType": "customer service",
          "email": "palamurivamshi2005@gmail.com"
        },
        "sameAs": [
          "https://www.facebook.com/swayamsevakconnect",
          "https://www.twitter.com/swayamsevakconnect",
          "https://www.instagram.com/swayamsevakconnect",
          "https://www.youtube.com/swayamsevakconnect"
        ]
      };

    case 'Event':
      return {
        ...baseData,
        "name": data.name,
        "description": data.description,
        "startDate": data.date,
        "location": {
          "@type": "Place",
          "name": data.region
        },
        "organizer": {
          "@type": "Organization",
          "name": "Swayamsevak Connect"
        }
      };

    case 'WebPage':
      return {
        ...baseData,
        "name": data.name || "Swayamsevak Connect",
        "description": data.description,
        "mainEntity": {
          "@type": "Organization",
          "name": "Swayamsevak Connect"
        }
      };

    default:
      return baseData;
  }
};

export const preloadCriticalResources = () => {
  const criticalResources = [
    '/logo192.png',
    '/og-image.jpg',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
  ];

  return criticalResources.map(resource => {
    if (resource.startsWith('http')) {
      return `<link rel="preload" href="${resource}" as="style" crossorigin />`;
    } else {
      return `<link rel="preload" href="${resource}" as="image" />`;
    }
  }).join('\n');
};

export const generateSitemap = (routes) => {
  const baseUrl = 'https://swayamsevak-connect.onrender.com';
  const currentDate = new Date().toISOString().split('T')[0];

  const sitemapEntries = routes.map(route => ({
    loc: `${baseUrl}${route.path}`,
    lastmod: currentDate,
    changefreq: route.changefreq || 'weekly',
    priority: route.priority || '0.5'
  }));

  return sitemapEntries;
};

export const optimizeImages = (imageUrl, width = 800) => {
  // Add image optimization parameters
  return `${imageUrl}?w=${width}&q=85&fit=crop`;
};

export const generateBreadcrumbs = (path) => {
  const segments = path.split('/').filter(Boolean);
  const breadcrumbs = [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://swayamsevak-connect.onrender.com"
    }
  ];

  segments.forEach((segment, index) => {
    const name = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
    const item = `https://swayamsevak-connect.onrender.com/${segments.slice(0, index + 1).join('/')}`;
    
    breadcrumbs.push({
      "@type": "ListItem",
      "position": index + 2,
      "name": name,
      "item": item
    });
  });

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs
  };
}; 