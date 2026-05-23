'use client';

import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { cleanupGsapRoute } from '../utils/cleanupGsapRoute.js';

const digitReels = [
  ['1', '2', '3', '4'],
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  ['1', '2', '3', '4'],
];

const getDigitStep = (track) => {
  const digit = track.querySelector('.not-found-digit');
  const digitHeight = digit?.getBoundingClientRect().height || track.parentElement.clientHeight;
  const rowGap = parseFloat(window.getComputedStyle(track).rowGap || '0');
  return digitHeight + rowGap;
};

export default function NotFound() {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    if (!rootRef.current) return undefined;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      const digitTracks = gsap.utils.toArray('.not-found-digit-track');

      digitTracks.forEach((track) => {
        gsap.set(track, { y: 0 });
      });

      if (reduceMotion) {
        digitTracks.forEach((track) => {
          const finalIndex = Number(track.dataset.finalIndex || 0);
          gsap.set(track, { y: -finalIndex * getDigitStep(track) });
        });
        gsap.set('.not-found-reveal', { autoAlpha: 1, y: 0, scale: 1, filter: 'blur(0px)' });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

      tl.fromTo(
        '.not-found-bg-glow',
        { autoAlpha: 0, scale: 0.82 },
        { autoAlpha: 1, scale: 1, duration: 1.15 },
        0
      )
        .fromTo(
          '.not-found-digit-window',
          { y: 78, autoAlpha: 0, filter: 'blur(10px)' },
          { y: 0, autoAlpha: 1, filter: 'blur(0px)', duration: 0.9, stagger: 0.08 },
          0.08
        )
        .to(
          digitTracks,
          {
            y: (index, target) => -Number(target.dataset.finalIndex || 0) * getDigitStep(target),
            duration: 1.45,
            stagger: 0.08,
            ease: 'power4.inOut',
          },
          0.34
        )
        .fromTo(
          '.not-found-subject-layer',
          { y: 70, scale: 0.92, autoAlpha: 0, filter: 'blur(8px)' },
          { y: 0, scale: 1, autoAlpha: 1, filter: 'blur(0px)', duration: 1.05 },
          0.72
        )
        .fromTo(
          '.not-found-copy-line',
          { yPercent: 115 },
          { yPercent: 0, duration: 0.86, stagger: 0.1 },
          0.96
        )
        .fromTo(
          '.not-found-home-link',
          { y: 18, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.62 },
          1.18
        );

      gsap.to('.not-found-subject-layer', {
        y: '-=8',
        duration: 4.4,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      });
    }, rootRef);

    return () => {
      cleanupGsapRoute(rootRef.current);
      ctx.revert();
    };
  }, []);

  return (
    <section className="not-found-page" ref={rootRef} aria-labelledby="not-found-title">
      <div className="not-found-bg-glow" aria-hidden="true" />

      <div className="not-found-stage">
        <div className="not-found-number" aria-hidden="true">
          {digitReels.map((digits, index) => (
            <span className="not-found-digit-window" key={index}>
              <span className="not-found-digit-track" data-final-index={digits.length - 1}>
                {digits.map((digit, digitIndex) => (
                  <span className="not-found-digit" key={`${index}-${digit}-${digitIndex}`}>
                    {digit}
                  </span>
                ))}
              </span>
            </span>
          ))}
        </div>
        <span className="not-found-sr-number">404</span>

        <div className="not-found-subject-layer not-found-reveal" aria-hidden="true">
          <img
            src="/assets/404/404img_optimized.avif"
            alt=""
            className="not-found-subject"
            width="920"
            height="520"
            fetchPriority="high"
          />
        </div>

        <div className="not-found-viewport-fades" aria-hidden="true" />

        <div className="not-found-content">
          <h1 className="not-found-title" id="not-found-title">
            <span className="not-found-line-mask">
              <span className="not-found-copy-line">La página que buscas</span>
            </span>
            <span className="not-found-line-mask">
              <span className="not-found-copy-line">no está disponible</span>
            </span>
          </h1>

          <a href="/" className="not-found-home-link css-glass css-glass-pill">
            <svg className="not-found-link-icon" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2.8 14.45 9.55 21.2 12 14.45 14.45 12 21.2 9.55 14.45 2.8 12 9.55 9.55 12 2.8Z" fill="currentColor" />
            </svg>
            Ir al inicio
          </a>
        </div>
      </div>
    </section>
  );
}
