import { useEffect, useRef } from 'react';
import barba from '@barba/core';
import { gsap } from 'gsap';

const MARK_SELECTOR = '.barba-transition-mark';

function waitForReactPaint() {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(resolve);
    });
  });
}

function syncReactRouter() {
  window.dispatchEvent(
    new PopStateEvent('popstate', {
      state: window.history.state,
    })
  );
}

export default function BarbaTransition() {
  const overlayRef = useRef(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay || initializedRef.current) return undefined;

    const mark = overlay.querySelector(MARK_SELECTOR);
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    initializedRef.current = true;

    gsap.set(overlay, {
      xPercent: -100,
      autoAlpha: 0,
      pointerEvents: 'none',
    });
    gsap.set(mark, { autoAlpha: 0, scale: 0.94 });

    barba.init({
      debug: false,
      prefetchIgnore: true,
      preventRunning: true,
      transitions: [
        {
          name: 'natura-cover-slide',
          leave() {
            document.documentElement.classList.add('is-page-transitioning');

            if (reduceMotion) {
              gsap.set(overlay, { xPercent: 0, autoAlpha: 1, pointerEvents: 'auto' });
              gsap.set(mark, { autoAlpha: 1, scale: 1 });
              syncReactRouter();
              return Promise.resolve();
            }

            return gsap
              .timeline()
              .set(overlay, {
                xPercent: -100,
                autoAlpha: 1,
                pointerEvents: 'auto',
              })
              .set(mark, { autoAlpha: 0, scale: 0.94 })
              .to(overlay, {
                xPercent: 0,
                duration: 0.62,
                ease: 'power4.inOut',
              })
              .to(
                mark,
                {
                  autoAlpha: 1,
                  scale: 1,
                  duration: 0.34,
                  ease: 'power3.out',
                },
                '<0.2'
              )
              .add(syncReactRouter);
          },
          async enter() {
            await waitForReactPaint();

            if (reduceMotion) {
              gsap.set(overlay, {
                xPercent: -100,
                autoAlpha: 0,
                pointerEvents: 'none',
              });
              gsap.set(mark, { autoAlpha: 0, scale: 0.94 });
              document.documentElement.classList.remove('is-page-transitioning');
              return;
            }

            await gsap
              .timeline({
                defaults: { ease: 'power4.inOut' },
                onComplete: () => {
                  gsap.set(overlay, {
                    xPercent: -100,
                    autoAlpha: 0,
                    pointerEvents: 'none',
                  });
                  gsap.set(mark, { autoAlpha: 0, scale: 0.94 });
                  document.documentElement.classList.remove('is-page-transitioning');
                },
              })
              .to(overlay, {
                xPercent: 100,
                duration: 0.68,
                delay: 0.08,
              })
              .to(
                mark,
                {
                  autoAlpha: 0,
                  scale: 1.04,
                  duration: 0.28,
                  ease: 'power2.in',
                },
                '<'
              );
          },
        },
      ],
    });

    return () => {
      barba.destroy();
      initializedRef.current = false;
      document.documentElement.classList.remove('is-page-transitioning');
    };
  }, []);

  return (
    <div ref={overlayRef} className="barba-transition-overlay" aria-hidden="true">
      <div className="barba-transition-mark">
        <svg viewBox="0 0 100 100">
          <circle className="barba-transition-ring-bg" cx="50" cy="50" r="45" />
          <circle className="barba-transition-ring-progress" cx="50" cy="50" r="45" />
        </svg>
        <img
          className="barba-transition-logo"
          src="/assets/images/logo.svg"
          alt=""
          width="86"
          height="78"
        />
      </div>
    </div>
  );
}
