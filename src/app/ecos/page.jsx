import Ecos from '../../views/Ecos.jsx';

export const metadata = {
  title: '© ECOS',
  description: '© ECOS es la plataforma de inteligencia de NaturaTech LAC para navegar las nuevas economías de biodiversidad, bioinnovación y naturaleza en América Latina y el Caribe. Conecta tendencias, investigación aplicada, herramientas de IA y conocimiento estratégico para fortalecer la toma de decisiones y el escalamiento de soluciones regenerativas.',
  openGraph: {
    title: '© ECOS | NaturaTech LAC',
    description: '© ECOS es la plataforma de inteligencia de NaturaTech LAC para navegar las nuevas economías de biodiversidad, bioinnovación y naturaleza en América Latina y el Caribe.',
    url: '/ecos',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'NaturaTech LAC — Innovación para la Biodiversidad' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '© ECOS | NaturaTech LAC',
    description: '© ECOS es la plataforma de inteligencia de NaturaTech LAC para navegar las nuevas economías de biodiversidad, bioinnovación y naturaleza en América Latina y el Caribe.',
  },
};

export default function Page() {
  return <Ecos />;
}
