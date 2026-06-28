import React from 'react';
import { Helmet } from 'react-helmet-async';
import { defaultSEO } from '../../config/seoConfig';

const SEO = ({ title, description, keywords, url }) => {
  const seoTitle = title ? defaultSEO.titleTemplate.replace('%s', title) : defaultSEO.title;
  const seoDesc = description || defaultSEO.description;
  const seoKey = keywords ? `${keywords}, ${defaultSEO.keywords}` : defaultSEO.keywords;
  const seoUrl = url || defaultSEO.canonical;

  return (
    <Helmet>
      <title>{seoTitle}</title>
      <meta name="description" content={seoDesc} />
      <meta name="keywords" content={seoKey} />
      <meta name="author" content="Wildan CASN" />
      <link rel="canonical" href={seoUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={seoUrl} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDesc} />
      <meta property="og:site_name" content={defaultSEO.openGraph.site_name} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={seoUrl} />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDesc} />
    </Helmet>
  );
};

export default SEO;
