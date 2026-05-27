const DEFAULT_IMAGE_ALT = {
  es: 'NaturaTech LAC - Innovacion para la Biodiversidad',
  en: 'NaturaTech LAC - Innovation for Biodiversity',
};

const descriptions = {
  home: {
    es: 'NaturaTech LAC es una plataforma regional de innovacion que acelera el desarrollo y escalamiento de soluciones bioculturales para la biodiversidad en America Latina y el Caribe.',
    en: 'NaturaTech LAC is a regional innovation platform accelerating the development and scaling of biocultural solutions for biodiversity across Latin America and the Caribbean.',
  },
  emprendimientos: {
    es: 'Conecta con financiamiento, inteligencia de mercado y una red global de innovacion para la biodiversidad.',
    en: 'Connect with funding, market intelligence and a global innovation network for biodiversity.',
  },
  ceiba: {
    es: 'Comunidad de lideres, comunidades, innovadores, cientificos, inversionistas y tomadores de decision para construir nuevas economias regenerativas para America Latina y el Caribe.',
    en: 'A community of leaders, communities, innovators, scientists, investors and decision-makers building regenerative economies for Latin America and the Caribbean.',
  },
  studio: {
    es: 'El Studio de NaturaTech LAC conecta innovacion, infraestructura digital y colaboracion territorial para demostrar nuevas formas de regenerar biodiversidad y economias locales.',
    en: 'NaturaTech LAC Studio connects innovation, digital infrastructure and territorial collaboration to demonstrate new ways to regenerate biodiversity and local economies.',
  },
  ecos: {
    es: 'ECOS es la plataforma de inteligencia de NaturaTech LAC para navegar las nuevas economias de biodiversidad, bioinnovacion y naturaleza en America Latina y el Caribe.',
    en: 'ECOS is NaturaTech LAC intelligence platform for navigating emerging biodiversity, bioinnovation and nature economies in Latin America and the Caribbean.',
  },
  hitos: {
    es: 'Desde 2024 hemos enraizado tecnologia, saberes y un ecosistema vibrante en la region de LAC.',
    en: 'Since 2024, we have rooted technology, knowledge and a vibrant ecosystem across the LAC region.',
  },
  links: {
    es: 'Links oficiales de NaturaTech LAC.',
    en: 'Official NaturaTech LAC links.',
  },
  gallery: {
    es: 'Galeria fotografica de CEIBA 2025.',
    en: 'Photo gallery from CEIBA 2025.',
  },
  privacy: {
    es: 'Aviso de Privacidad de NaturaTech ID: informacion sobre recoleccion, uso, seguridad y derechos de usuario.',
    en: 'NaturaTech ID Privacy Notice: information on data collection, use, security and user rights.',
  },
  terms: {
    es: 'Terminos y condiciones de NaturaTech ID: reglas de uso, seguridad, privacidad, disponibilidad y contacto.',
    en: 'NaturaTech ID Terms and Conditions: usage rules, security, privacy, availability and contact.',
  },
};

const titles = {
  es: {
    home: 'NaturaTech LAC - Innovacion para la Biodiversidad',
    emprendimientos: 'Natura500 | NaturaTech LAC',
    ceiba: 'CEIBA | NaturaTech LAC',
    studio: 'Studio | NaturaTech LAC',
    ecos: 'ECOS | NaturaTech LAC',
    hitos: 'Hitos | NaturaTech LAC',
    links: 'Links | NaturaTech LAC',
    gallery: 'Galeria CEIBA 2025 | NaturaTech LAC',
    privacy: 'Aviso de Privacidad | NaturaTech LAC',
    terms: 'Terminos y Condiciones | NaturaTech LAC',
  },
  en: {
    home: 'NaturaTech LAC - Innovation for Biodiversity',
    emprendimientos: 'Natura500 | NaturaTech LAC',
    ceiba: 'CEIBA | NaturaTech LAC',
    studio: 'Studio | NaturaTech LAC',
    ecos: 'ECOS | NaturaTech LAC',
    hitos: 'Milestones | NaturaTech LAC',
    links: 'Links | NaturaTech LAC',
    gallery: 'CEIBA 2025 Gallery | NaturaTech LAC',
    privacy: 'Privacy Notice | NaturaTech LAC',
    terms: 'Terms and Conditions | NaturaTech LAC',
  },
};

const routeKeys = {
  '/': 'home',
  '/emprendimientos': 'emprendimientos',
  '/ceiba': 'ceiba',
  '/studio': 'studio',
  '/ecos': 'ecos',
  '/hitos': 'hitos',
  '/links': 'links',
  '/galeriaceiba': 'gallery',
  '/privacy-policy': 'privacy',
  '/terms-and-conditions': 'terms',
};

function normalizePath(pathname) {
  if (!pathname) return '/';
  return pathname.replace(/\/$/, '') || '/';
}

export function getSeoMetadata(lang, pathname) {
  const safeLang = lang === 'en' ? 'en' : 'es';
  const key = routeKeys[normalizePath(pathname)] || 'home';
  const title = titles[safeLang][key];
  const description = descriptions[key][safeLang];

  return {
    title,
    description,
    locale: safeLang === 'en' ? 'en_US' : 'es_LA',
    imageAlt: DEFAULT_IMAGE_ALT[safeLang],
  };
}
