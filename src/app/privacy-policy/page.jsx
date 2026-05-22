import PrivacyPolicy from '../../views/PrivacyPolicy.jsx';

export const metadata = {
  title: 'Aviso de Privacidad',
  description:
    'Aviso de Privacidad de NaturaTech ID: informacion sobre recoleccion, uso, seguridad y derechos de usuario.',
  alternates: {
    canonical: '/privacy-policy',
  },
};

export default function Page() {
  return <PrivacyPolicy />;
}
