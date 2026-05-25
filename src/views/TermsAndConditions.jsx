'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useLanguage } from '../contexts/LanguageContext.jsx';

export default function TermsAndConditions() {
  const rootRef = useRef(null);
  const { t } = useLanguage();
  const tc = t.terms;

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
        <p className="terms-policy-eyebrow">{tc.eyebrow}</p>
        <h1>{tc.title}</h1>
        <p className="terms-policy-updated">{tc.updated}</p>
        <p className="terms-policy-intro">{tc.intro}</p>
        <p className="terms-policy-consent">{tc.consent}</p>
      </header>

      <div className="terms-policy-body">
        {tc.sections.map((section) => (
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
