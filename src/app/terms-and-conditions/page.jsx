import TermsAndConditions from '../../views/TermsAndConditions.jsx';

export const metadata = {
  title: 'Términos y condiciones',
  description:
    'Terminos y condiciones de NaturaTech ID: reglas de uso, seguridad, privacidad, disponibilidad y contacto.',
  alternates: {
    canonical: '/terms-and-conditions',
  },
};

export default function Page() {
  return <TermsAndConditions />;
}
