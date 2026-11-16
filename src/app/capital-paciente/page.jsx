import CapitalPaciente from '../../views/CapitalPaciente.jsx';

const title = 'Capital paciente: la oportunidad Natura500';
const description = 'Un análisis del radar Natura500 sobre emprendimientos, biodiversidad y la oportunidad de movilizar capital paciente en América Latina y el Caribe.';
const image = {
  url: '/assets/capital-paciente/amazonia-arbio.webp',
  width: 1500,
  height: 1000,
  alt: 'Bosque amazónico de ARBIO Perú',
};

export const metadata = {
  title,
  description,
  alternates: { canonical: '/capital-paciente' },
  openGraph: {
    type: 'article',
    locale: 'es_LA',
    siteName: 'NaturaTech LAC',
    url: '/capital-paciente',
    title: `${title} | NaturaTech LAC`,
    description,
    images: [image],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${title} | NaturaTech LAC`,
    description,
    images: [image.url],
  },
};

export default function Page() {
  return <CapitalPaciente />;
}
