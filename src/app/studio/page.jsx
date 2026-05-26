import Studio from '../../views/Studio.jsx';

export const metadata = {
  title: 'Studio',
  description: 'El Studio de NaturaTech LAC conecta innovación, infraestructura digital y colaboración territorial para demostrar nuevas formas de regenerar biodiversidad y economías locales.',
  openGraph: {
    title: 'Studio | NaturaTech LAC',
    description: 'El Studio de NaturaTech LAC conecta innovación, infraestructura digital y colaboración territorial para demostrar nuevas formas de regenerar biodiversidad y economías locales.',
    url: '/studio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Studio | NaturaTech LAC',
    description: 'El Studio de NaturaTech LAC conecta innovación, infraestructura digital y colaboración territorial para demostrar nuevas formas de regenerar biodiversidad y economías locales.',
  },
};

export default function Page() {
  return <Studio />;
}
