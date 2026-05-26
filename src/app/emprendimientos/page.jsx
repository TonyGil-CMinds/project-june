import Emprendimientos from '../../views/Emprendimientos.jsx';

export const metadata = {
  title: 'Natura500',
  description: 'Conecta con financiamiento, inteligencia de mercado y una red global de innovación para la biodiversidad.',
  openGraph: {
    title: 'Natura500 | NaturaTech LAC',
    description: 'Conecta con financiamiento, inteligencia de mercado y una red global de innovación para la biodiversidad.',
    url: '/emprendimientos',
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
