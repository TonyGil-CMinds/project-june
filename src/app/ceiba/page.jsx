import Ceiba from '../../views/Ceiba.jsx';

export const metadata = {
  title: 'CEIBA',
  description: 'Comunidad de líderes, comunidades, innovadores, científicos, inversionistas y tomadores de decisión para construir juntos nuevas economías regenerativas para América Latina y el Caribe.',
  openGraph: {
    title: 'CEIBA | NaturaTech LAC',
    description: 'Comunidad de líderes, comunidades, innovadores, científicos, inversionistas y tomadores de decisión para construir juntos nuevas economías regenerativas para América Latina y el Caribe.',
    url: '/ceiba',
    images: [
      { url: '/og-image.jpg', width: 1200, height: 630, alt: 'NaturaTech LAC — Innovación para la Biodiversidad' },
      { url: '/og-image-square.jpg', width: 1200, height: 1200, alt: 'NaturaTech LAC — Innovación para la Biodiversidad' },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CEIBA | NaturaTech LAC',
    description: 'Comunidad de líderes, comunidades, innovadores, científicos, inversionistas y tomadores de decisión para construir juntos nuevas economías regenerativas para América Latina y el Caribe.',
  },
};

export default function Page() {
  return <Ceiba />;
}
