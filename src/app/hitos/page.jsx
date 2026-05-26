import Hitos from '../../views/Hitos.jsx';

export const metadata = {
  title: 'Hitos',
  description: 'Desde 2024 hemos enraizado tecnología, saberes y un ecosistema vibrante en la región de LAC.',
  openGraph: {
    title: 'Hitos | NaturaTech LAC',
    description: 'Desde 2024 hemos enraizado tecnología, saberes y un ecosistema vibrante en la región de LAC.',
    url: '/hitos',
    images: [
      { url: '/og-image.jpg', width: 1200, height: 630, alt: 'NaturaTech LAC — Innovación para la Biodiversidad' },
      { url: '/og-image-square.jpg', width: 1200, height: 1200, alt: 'NaturaTech LAC — Innovación para la Biodiversidad' },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hitos | NaturaTech LAC',
    description: 'Desde 2024 hemos enraizado tecnología, saberes y un ecosistema vibrante en la región de LAC.',
  },
};

export default function Page() {
  return <Hitos />;
}
