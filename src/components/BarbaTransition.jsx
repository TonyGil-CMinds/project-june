import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';

const MARK_SELECTOR = '.barba-transition-mark';

function waitForReactPaint() {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(resolve);
    });
  });
}

function playCoverTransition(overlay, mark, reduceMotion, onCovered) {
  if (reduceMotion) {
    document.documentElement.classList.add('is-page-transitioning');
    gsap.set(overlay, { xPercent: 0, autoAlpha: 1, pointerEvents: 'auto' });
    gsap.set(mark, { autoAlpha: 1, scale: 1 });
    onCovered?.();
    return waitForReactPaint().then(() => {
      gsap.set(overlay, { xPercent: -100, autoAlpha: 0, pointerEvents: 'none' });
      gsap.set(mark, { autoAlpha: 0, scale: 0.94 });
      document.documentElement.classList.remove('is-page-transitioning');
    });
  }

  document.documentElement.classList.add('is-page-transitioning');

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
    .add(onCovered || (() => {}))
    .to({}, { duration: 0.14 })
    .to(overlay, {
      xPercent: 100,
      duration: 0.68,
      delay: 0.08,
      ease: 'power4.inOut',
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
    )
    .set(overlay, {
      xPercent: -100,
      autoAlpha: 0,
      pointerEvents: 'none',
    })
    .set(mark, { autoAlpha: 0, scale: 0.94 })
    .add(() => document.documentElement.classList.remove('is-page-transitioning'));
}

export default function BarbaTransition() {
  const location = useLocation();
  const navigate = useNavigate();
  const overlayRef = useRef(null);
  const initializedRef = useRef(false);
  const locationRef = useRef(location);
  const transitionRef = useRef(null);

  useEffect(() => {
    locationRef.current = location;
  }, [location]);

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

    const runTransition = (onCovered) => {
      if (transitionRef.current?.isActive?.()) {
        transitionRef.current.progress(1);
      }

      const tween = playCoverTransition(overlay, mark, reduceMotion, onCovered);
      transitionRef.current = tween;
      return tween;
    };

    const handleLocalTransition = (event) => {
      runTransition(event.detail?.onCovered);
    };

    const isPlainLeftClick = (event) => (
      event.button === 0 &&
      !event.metaKey &&
      !event.ctrlKey &&
      !event.shiftKey &&
      !event.altKey
    );

    const shouldHandleLink = (anchor) => {
      if (!anchor) return false;
      if (anchor.target && anchor.target !== '_self') return false;
      if (anchor.hasAttribute('download')) return false;
      if (anchor.dataset.transition === 'native') return false;

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return false;

      const current = locationRef.current;
      const isSamePath = url.pathname === current.pathname && url.search === current.search;
      if (isSamePath && url.hash) return false;

      return !isSamePath || url.hash !== current.hash;
    };

    const handleDocumentClick = (event) => {
      if (!isPlainLeftClick(event) || event.defaultPrevented) return;

      const anchor = event.target.closest?.('a[href]');
      if (!shouldHandleLink(anchor)) return;

      event.preventDefault();

      const url = new URL(anchor.href, window.location.href);
      const to = `${url.pathname}${url.search}${url.hash}`;

      runTransition(() => {
        navigate(to);
      });
    };

    window.addEventListener('natura:cover-transition', handleLocalTransition);
    document.addEventListener('click', handleDocumentClick, true);

    return () => {
      window.removeEventListener('natura:cover-transition', handleLocalTransition);
      document.removeEventListener('click', handleDocumentClick, true);
      transitionRef.current?.kill();
      initializedRef.current = false;
      document.documentElement.classList.remove('is-page-transitioning');
    };
  }, [navigate]);

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
