'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cleanupGsapRoute } from '../utils/cleanupGsapRoute.js';
import { useLanguage } from '../contexts/LanguageContext.jsx';

gsap.registerPlugin(ScrollTrigger);

export default function Ecos() {
  const rootRef = useRef(null);
  const { t } = useLanguage();

  useEffect(() => {
    if (!rootRef.current) return;

    const ctx = gsap.context(() => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (!reduceMotion) {
        gsap.fromTo(
          '.ecos-subject-anchor',
          { '--subject-anchor-scale': 1.08 },
          { '--subject-anchor-scale': 1, duration: 1.4, ease: 'power3.out' }
        );
      }



      gsap.to('.ecos-subject', {
        yPercent: 12,
        scale: 1.03,
        ease: 'none',
        scrollTrigger: {
          trigger: '.ecos-hero',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.6,
        },
      });

      gsap.from('.ecos-content-inner', {
        y: 52,
        opacity: 0,
        duration: 1,
        delay: 0.12,
        ease: 'power3.out',
      });

      gsap.from('.ecos-giant-word', {
        y: 70,
        opacity: 0,
        duration: 1.1,
        delay: 0.08,
        ease: 'power3.out',
      });
    }, rootRef);

    return () => {
      cleanupGsapRoute(rootRef.current);
      ctx.revert();
    };
  }, []);

  return (
    <div ref={rootRef}>
      <section className="ecos-hero" id="ecos">
        <div className="ecos-bg-wrapper">
          <img src="/assets/Ecos/bg-ecos.avif" alt="" className="ecos-bg" />
        </div>

        <div className="ecos-giant-text" aria-hidden="true">
          <span className="ecos-giant-word">{t.ecos.giantWord}</span>
        </div>

        <div className="ecos-subject-wrapper">
          <div className="ecos-subject-anchor">
            <img
              src="/assets/Ecos/subject-ecos.avif"
              alt={t.ecos.subjectAlt}
              className="ecos-subject"
            />
          </div>
        </div>

        <div className="ecos-overlay" aria-hidden="true" />

        <div className="ecos-content">
          <div className="ecos-content-inner">
            <div className="ecos-header-label">
              <img src="/assets/icons/Navbar/ecos.svg" alt="" width="16" height="17" />
              {t.ecos.headerLabel}
            </div>

            <h1 className="ecos-heading">
              <span className="ecos-heading-line">{t.ecos.heading1}</span>
              <span className="ecos-heading-line ecos-heading-accent">
                <span className="amp">&amp;</span> {t.ecos.heading2}
              </span>
            </h1>

            <p className="ecos-description">{t.ecos.desc}</p>

            <a href="https://ecos.naturatech.org/" className="btn-glass hero-cta-button ecos-cta-button">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2.5L14.58 9.42L21.5 12L14.58 14.58L12 21.5L9.42 14.58L2.5 12L9.42 9.42L12 2.5Z" />
              </svg>
              {t.ecos.cta}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
