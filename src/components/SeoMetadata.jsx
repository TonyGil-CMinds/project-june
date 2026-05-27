'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useLanguage } from '../contexts/LanguageContext.jsx';
import { getSeoMetadata } from '../data/seoMetadata.js';

function upsertMeta(selector, attributes) {
  let element = document.head.querySelector(selector);

  if (!element) {
    element = document.createElement('meta');
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([name, value]) => {
    element.setAttribute(name, value);
  });
}

export default function SeoMetadata() {
  const pathname = usePathname();
  const { lang } = useLanguage();

  useEffect(() => {
    const metadata = getSeoMetadata(lang, pathname);

    document.title = metadata.title;
    document.documentElement.lang = lang;

    upsertMeta('meta[name="description"]', {
      name: 'description',
      content: metadata.description,
    });
    upsertMeta('meta[property="og:title"]', {
      property: 'og:title',
      content: metadata.title,
    });
    upsertMeta('meta[property="og:description"]', {
      property: 'og:description',
      content: metadata.description,
    });
    upsertMeta('meta[property="og:locale"]', {
      property: 'og:locale',
      content: metadata.locale,
    });
    upsertMeta('meta[property="og:image:alt"]', {
      property: 'og:image:alt',
      content: metadata.imageAlt,
    });
    upsertMeta('meta[name="twitter:title"]', {
      name: 'twitter:title',
      content: metadata.title,
    });
    upsertMeta('meta[name="twitter:description"]', {
      name: 'twitter:description',
      content: metadata.description,
    });
  }, [lang, pathname]);

  return null;
}
