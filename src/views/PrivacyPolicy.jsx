'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useLanguage } from '../contexts/LanguageContext.jsx';

export default function PrivacyPolicy() {
  const rootRef = useRef(null);
  const { t } = useLanguage();
  const p = t.privacy;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return undefined;

    const ctx = gsap.context(() => {
      gsap.from(
        [
          '.privacy-policy-eyebrow',
          '.privacy-policy-hero h1',
          '.privacy-policy-updated',
          '.privacy-policy-intro',
          '.privacy-policy-consent',
          '.privacy-policy-section',
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
    <article ref={rootRef} className="privacy-policy-page">
      <header className="privacy-policy-hero">
        <p className="privacy-policy-eyebrow">{p.eyebrow}</p>
        <h1>{p.title}</h1>
        <p className="privacy-policy-updated">{p.updated}</p>
        <p className="privacy-policy-intro">{p.intro}</p>
        <p className="privacy-policy-consent">{p.consent}</p>
      </header>

      <div className="privacy-policy-body">
        {p.sections.map((section) => (
          <section className="privacy-policy-section" key={section.title}>
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
            {section.after?.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>
        ))}
      </div>
    </article>
  );
}
