// Options for the CEIBA registration form. Ids are stored in the database, so
// they are stable and language-independent — only the labels are translated.
// The sector list mirrors the actors named in ceiba-about.js `diversity`, so
// what the form asks matches what the page promises.

export const sectors = [
  { id: 'indigenous',   es: 'Pueblos indígenas y comunidades locales', en: 'Indigenous peoples & local communities' },
  { id: 'entrepreneur', es: 'Emprendimiento / startup',               en: 'Entrepreneurship / startup' },
  { id: 'company',      es: 'Empresa',                                 en: 'Company' },
  { id: 'science',      es: 'Ciencia e investigación',                  en: 'Science & research' },
  { id: 'technology',   es: 'Tecnología',                               en: 'Technology' },
  { id: 'academia',     es: 'Academia',                                 en: 'Academia' },
  { id: 'investment',   es: 'Inversión',                                en: 'Investment' },
  { id: 'philanthropy', es: 'Filantropía',                             en: 'Philanthropy' },
  { id: 'civil',        es: 'Sociedad civil / ONG',                     en: 'Civil society / NGO' },
  { id: 'government',   es: 'Gobierno',                                 en: 'Government' },
  { id: 'multilateral', es: 'Organismo multilateral',                   en: 'Multilateral organization' },
  { id: 'other',        es: 'Otro',                                     en: 'Other' },
];

export const ageRanges = [
  { id: '18-24', es: '18 a 24 años', en: '18 to 24' },
  { id: '25-34', es: '25 a 34 años', en: '25 to 34' },
  { id: '35-44', es: '35 a 44 años', en: '35 to 44' },
  { id: '45-54', es: '45 a 54 años', en: '45 to 54' },
  { id: '55-64', es: '55 a 64 años', en: '55 to 64' },
  { id: '65+',   es: '65 años o más', en: '65 or older' },
];

export const sectorIds = sectors.map((option) => option.id);
export const ageRangeIds = ageRanges.map((option) => option.id);
