import PrivacyPolicy from '../../views/PrivacyPolicy.jsx';

export const metadata = {
  title: 'Aviso de Privacidad · Privacy Notice',
  description:
    'Aviso de Privacidad de NaturaTech ID: información sobre recolección, uso, seguridad y derechos de usuario. / NaturaTech ID Privacy Notice: information on data collection, use, security and user rights.',
  alternates: {
    canonical: '/privacy-policy',
    languages: {
      'es': '/privacy-policy',
      'en': '/privacy-policy',
      'x-default': '/privacy-policy',
    },
  },
  openGraph: {
    title: 'Aviso de Privacidad · Privacy Notice | NaturaTech LAC',
    description:
      'Aviso de Privacidad de NaturaTech ID: información sobre recolección, uso, seguridad y derechos de usuario.',
    url: '/privacy-policy',
  },
};

export default function Page() {
  return <PrivacyPolicy />;
}
