'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const termsSections = [
  {
    title: '1. Descripcion del servicio',
    body: [
      'NaturaTech ID es un servicio de autenticacion proporcionado por NaturaTech para permitir que usuarios autorizados inicien sesion y accedan a aplicaciones, plataformas y servicios relacionados de NaturaTech.',
      'El servicio puede usar proveedores externos de autenticacion, incluyendo Google OAuth, para verificar la identidad del usuario y proporcionar acceso seguro.',
    ],
  },
  {
    title: '2. Responsabilidades del usuario',
    body: ['Al usar este servicio, aceptas:'],
    list: [
      'Proporcionar informacion de cuenta precisa y valida.',
      'Mantener seguras tus credenciales de inicio de sesion.',
      'No compartir el acceso a tu cuenta con personas no autorizadas.',
      'No usar el servicio con fines fraudulentos, abusivos, ilegales o no autorizados.',
      'Notificarnos de inmediato si sospechas de acceso no autorizado a tu cuenta.',
    ],
  },
  {
    title: '3. Uso autorizado',
    body: [
      'NaturaTech ID esta destinado unicamente a usuarios autorizados que necesitan acceso a sistemas o servicios de NaturaTech.',
      'Nos reservamos el derecho de suspender o revocar el acceso si detectamos mal uso, actividad no autorizada o una violacion de estos Terminos.',
    ],
  },
  {
    title: '4. Seguridad de la cuenta',
    body: [
      'Podemos implementar medidas de seguridad como autenticacion de dos factores, monitoreo de acceso, rotacion de llaves API y revisiones de actividad para proteger nuestros sistemas y usuarios.',
      'Los usuarios son responsables de mantener la confidencialidad de sus credenciales y de toda actividad que ocurra bajo su cuenta.',
    ],
  },
  {
    title: '5. Datos y privacidad',
    body: [
      'Nuestra recopilacion, uso y proteccion de informacion personal se describe en nuestro Aviso de Privacidad.',
    ],
    cta: {
      href: '/privacy-policy',
      label: 'Aviso de Privacidad',
    },
    after: [
      'Al usar este servicio, tambien aceptas los terminos descritos en nuestro Aviso de Privacidad.',
    ],
  },
  {
    title: '6. Servicios de terceros',
    body: [
      'NaturaTech ID puede depender de servicios de terceros, incluyendo Google OAuth, SendGrid y otros proveedores de infraestructura o comunicacion.',
      'El uso de servicios de terceros tambien puede estar sujeto a sus respectivos terminos y politicas de privacidad.',
    ],
  },
  {
    title: '7. Disponibilidad del servicio',
    body: [
      'Buscamos mantener el servicio disponible y seguro, pero no garantizamos una operacion ininterrumpida o libre de errores.',
      'Podemos modificar, suspender o descontinuar el servicio en cualquier momento por razones de mantenimiento, seguridad, operativas o legales.',
    ],
  },
  {
    title: '8. Limitacion de responsabilidad',
    body: [
      'En la maxima medida permitida por la ley, NaturaTech no sera responsable por danos indirectos, incidentales, consecuentes o relacionados con uso no autorizado que surjan del uso o imposibilidad de uso del servicio.',
    ],
  },
  {
    title: '9. Cambios a estos Terminos',
    body: [
      'Podemos actualizar estos Terminos de Servicio periodicamente. Cuando lo hagamos, actualizaremos la fecha de vigencia en la parte superior de esta pagina.',
      'El uso continuo del servicio despues de que se publiquen cambios significa que aceptas los Terminos actualizados.',
    ],
  },
  {
    title: '10. Contacto',
    body: [
      'Si tienes preguntas sobre estos Terminos de Servicio, contactanos en:',
      'Correo electronico: support@naturatech.org',
    ],
  },
];

export default function TermsAndConditions() {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return undefined;

    const ctx = gsap.context(() => {
      gsap.from(
        [
          '.terms-policy-eyebrow',
          '.terms-policy-hero h1',
          '.terms-policy-updated',
          '.terms-policy-intro',
          '.terms-policy-consent',
          '.terms-policy-section',
        ],
        {
          y: 26,
          autoAlpha: 0,
          duration: 0.78,
          delay: 0.12,
          stagger: 0.07,
          ease: 'power3.out',
        }
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <article ref={rootRef} className="terms-policy-page">
      <header className="terms-policy-hero">
        <p className="terms-policy-eyebrow">NaturaTech ID</p>
        <h1>Términos y condiciones</h1>
        <p className="terms-policy-updated">Actualizado: 21 de Mayo 2026</p>
        <p className="terms-policy-intro">
          Bienvenido a NaturaTech ID. Estos Terminos de Servicio describen las reglas y
          condiciones para usar nuestros servicios de autenticacion y acceso a cuentas.
        </p>
        <p className="terms-policy-consent">
          Al usar NaturaTech ID, aceptas estos Terminos de Servicio. Si no estas de acuerdo,
          por favor no uses el servicio.
        </p>
      </header>

      <div className="terms-policy-body">
        {termsSections.map((section) => (
          <section className="terms-policy-section" key={section.title}>
            <h2>{section.title}</h2>
            {section.body?.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {section.list && (
              <ul>
                {section.list.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
            {section.cta && (
              <p>
                <a className="terms-policy-button" href={section.cta.href}>
                  {section.cta.label}
                </a>
              </p>
            )}
            {section.after?.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>
        ))}
      </div>
    </article>
  );
}
