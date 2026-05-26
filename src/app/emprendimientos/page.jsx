import Emprendimientos from '../../views/Emprendimientos.jsx';

export const metadata = {
  title: 'Natura500',
  description: 'Conecta con financiamiento, inteligencia de mercado y una red global de innovación para la biodiversidad.',
  openGraph: {
    title: 'Natura500 | NaturaTech LAC',
    description: 'Conecta con financiamiento, inteligencia de mercado y una red global de innovación para la biodiversidad.',
    url: '/emprendimientos',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'NaturaTech LAC — Innovación para la Biodiversidad' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Natura500 | NaturaTech LAC',
    description: 'Conecta con financiamiento, inteligencia de mercado y una red global de innovación para la biodiversidad.',
  },
};

export default function Page() {
  return <Emprendimientos />;
}
