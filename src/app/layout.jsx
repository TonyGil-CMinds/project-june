import AppShell from '../components/AppShell.jsx';
import '../styles/base.css';
import '../styles/home.css';
import '../styles/emprendimientos.css';
import '../styles/ceiba.css';
import '../styles/studio.css';
import '../styles/ecos.css';
import '../styles/hitos.css';
import '../styles/privacy-policy.css';
import '../styles/links.css';

const BASE_URL = 'https://naturatech.org';

export const metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default: 'NaturaTech LAC — Innovación para la Biodiversidad',
    template: '%s | NaturaTech LAC',
  },
  description:
    'NaturaTech LAC es una plataforma regional de innovación que acelera el desarrollo y escalamiento de soluciones bioculturales para la biodiversidad en América Latina y el Caribe. A través del co-desarrollo tecnológico, la articulación de alianzas estratégicas y la movilización de financiamiento, la iniciativa fortalece las capacidades colectivas necesarias para conservar y regenerar el capital natural de la región.',

  keywords: [
    'biodiversidad', 'innovación biocultural', 'América Latina', 'Caribe',
    'capital natural', 'conservación', 'regeneración', 'financiamiento verde',
    'NaturaTech', 'natura500', 'CEIBA', 'soluciones basadas en naturaleza',
  ],

  authors: [{ name: 'NaturaTech LAC', url: BASE_URL }],
  creator: 'NaturaTech LAC',
  publisher: 'NaturaTech LAC',

  icons: {
    icon: '/assets/images/logo.svg',
    shortcut: '/assets/images/logo.svg',
    apple: '/assets/images/logo.svg',
  },

  openGraph: {
    type: 'website',
    locale: 'es_LA',
    url: BASE_URL,
    siteName: 'NaturaTech LAC',
    title: 'NaturaTech LAC — Innovación para la Biodiversidad',
    description:
      'NaturaTech LAC es una plataforma regional de innovación que acelera el desarrollo y escalamiento de soluciones bioculturales para la biodiversidad en América Latina y el Caribe. A través del co-desarrollo tecnológico, la articulación de alianzas estratégicas y la movilización de financiamiento, la iniciativa fortalece las capacidades colectivas necesarias para conservar y regenerar el capital natural de la región.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'NaturaTech LAC — Innovación para la Biodiversidad en América Latina y el Caribe',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'NaturaTech LAC — Innovación para la Biodiversidad',
    description:
      'Plataforma regional de innovación biocultural para conservar y regenerar el capital natural de América Latina y el Caribe.',
    images: ['/og-image.png'],
    creator: '@NaturaTechLAC',
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  alternates: {
    canonical: BASE_URL,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
try {
  if (localStorage.getItem('naturatech-boot-loader-seen') === 'true') {
    document.documentElement.classList.add('boot-loader-seen');
  }
} catch (_) {}
            `.trim(),
          }}
        />
      </head>
      <body>
        <div id="boot-loader" aria-hidden="true">
          <div className="ring-wrap">
            <svg viewBox="0 0 100 100" aria-hidden="true">
              <circle className="ring-bg" cx="50" cy="50" r="45" />
              <circle className="ring-progress" cx="50" cy="50" r="45" />
            </svg>
            <img src="/assets/images/logo.svg" alt="NaturaTech LAC" />
          </div>
        </div>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
