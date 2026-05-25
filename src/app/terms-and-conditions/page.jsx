import TermsAndConditions from '../../views/TermsAndConditions.jsx';

export const metadata = {
  title: 'Términos y condiciones · Terms and Conditions',
  description:
    'Términos y condiciones de NaturaTech ID: reglas de uso, seguridad, privacidad, disponibilidad y contacto. / NaturaTech ID Terms and Conditions: usage rules, security, privacy, availability and contact.',
  alternates: {
    canonical: '/terms-and-conditions',
    languages: {
      'es': '/terms-and-conditions',
      'en': '/terms-and-conditions',
      'x-default': '/terms-and-conditions',
    },
  },
  openGraph: {
    title: 'Términos y condiciones · Terms and Conditions | NaturaTech LAC',
    description:
      'Términos y condiciones de NaturaTech ID: reglas de uso, seguridad, privacidad, disponibilidad y contacto.',
    url: '/terms-and-conditions',
  },
};

export default function Page() {
  return <TermsAndConditions />;
}
