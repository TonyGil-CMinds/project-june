'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { gsap } from 'gsap';
import { useLanguage } from '../contexts/LanguageContext.jsx';

const NAV_ROUTES = [
  { to: '/',                key: 'inicio',  icon: '/assets/icons/Navbar/inicio.svg' },
  { to: '/emprendimientos', key: 'empresas', icon: '/assets/icons/Navbar/startups.svg' },
  { to: '/ceiba',           key: 'ceiba',   icon: '/assets/icons/Navbar/ceiba.svg' },
  { to: '/studio',          key: 'studio',  icon: '/assets/icons/Navbar/studio.svg' },
  { to: '/ecos',            key: 'ecos',    icon: '/assets/icons/Navbar/ecos.svg' },
];

export default function Nav() {
  const pathname = usePathname();
  const { t, lang } = useLanguage();
  const [hideMobilePill, setHideMobilePill] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);
  const pillRef = useRef(null);
  const activeIconRef = useRef(null);
  const iconRefs = useRef(new Map());
  const activeIconMetricsRef = useRef(null);
  const lastScrollYRef = useRef(0);
  const scrollIdleRef = useRef(null);
  const navigationTimerRef = useRef(null);

  const links = NAV_ROUTES.map((r) => ({ ...r, label: t.nav[r.key], desktopLabel: t.nav[r.key] }));
  const activeLink = links.find((link) => link.to === pathname) || links[0];

  const getIconDestination = (to) => {
    const pill = pillRef.current;
    const targetIcon = iconRefs.current.get(to);
    if (!pill || !targetIcon) return null;

    const pillRect = pill.getBoundingClientRect();
    const iconRect = targetIcon.getBoundingClientRect();

    if (iconRect.width > 0 && iconRect.height > 0) {
      return {
        x: iconRect.left - pillRect.left,
        y: iconRect.top - pillRect.top,
        width: iconRect.width,
        height: iconRect.height,
      };
    }

    const link = targetIcon.closest('.nav-link');
    const visibleText = Array.from(link?.querySelectorAll('.nav-text') || []).find((node) => {
      const rect = node.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0 && window.getComputedStyle(node).display !== 'none';
    });

    if (!visibleText) return null;

    const textRect = visibleText.getBoundingClientRect();
    const width = activeIconMetricsRef.current?.width || 12;
    const height = activeIconMetricsRef.current?.height || 12;
    const gap = 9;

    return {
      x: textRect.left - pillRect.left - width - gap,
      y: textRect.top - pillRect.top + (textRect.height - height) / 2,
      width,
      height,
    };
  };

  const animateIconTo = (to, onComplete) => {
    const activeIcon = activeIconRef.current;
    const nextLink = links.find((link) => link.to === to);
    const next = getIconDestination(to);

    if (!activeIcon || !nextLink || !next) {
      onComplete();
      return;
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const img = activeIcon.querySelector('img');
    if (img) img.src = nextLink.icon;

    gsap.killTweensOf(activeIcon);
    gsap.killTweensOf(img);

    if (reduceMotion) {
      onComplete();
      return;
    }

    gsap.to(activeIcon, {
      ...next,
      scale: 1,
      autoAlpha: 1,
      duration: 0.34,
      ease: 'power3.inOut',
      onComplete,
    });

    if (img) {
      gsap.fromTo(
        img,
        { scale: 0.72, rotate: -16, opacity: 0.35 },
        { scale: 1, rotate: 0, opacity: 1, duration: 0.32, ease: 'back.out(1.7)' }
      );
    }
  };

  const handleNavigationClick = (event, to) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    if (to === pathname) {
      event.preventDefault();
      return;
    }

    event.preventDefault();
    window.clearTimeout(navigationTimerRef.current);

    const go = () => {
      window.location.href = to;
    };

    navigationTimerRef.current = window.setTimeout(go, 460);
    animateIconTo(to, () => {
      window.clearTimeout(navigationTimerRef.current);
      go();
    });
  };

  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 768px)');

    const showPill = () => setHideMobilePill(false);

    const handleScroll = () => {
      if (!mobileQuery.matches) {
        showPill();
        lastScrollYRef.current = window.scrollY;
        return;
      }

      const currentY = window.scrollY;
      const delta = currentY - lastScrollYRef.current;

      if (Math.abs(delta) > 8) {
        setHideMobilePill(delta > 0 && currentY > 80);
        lastScrollYRef.current = currentY;
      }

      window.clearTimeout(scrollIdleRef.current);
      scrollIdleRef.current = window.setTimeout(showPill, 260);
    };

    const handleMediaChange = () => {
      if (!mobileQuery.matches) showPill();
      lastScrollYRef.current = window.scrollY;
    };

    lastScrollYRef.current = window.scrollY;
    window.addEventListener('scroll', handleScroll, { passive: true });

    if (mobileQuery.addEventListener) {
      mobileQuery.addEventListener('change', handleMediaChange);
    } else {
      mobileQuery.addListener(handleMediaChange);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.clearTimeout(scrollIdleRef.current);
      window.clearTimeout(navigationTimerRef.current);
      if (mobileQuery.removeEventListener) {
        mobileQuery.removeEventListener('change', handleMediaChange);
      } else {
        mobileQuery.removeListener(handleMediaChange);
      }
    };
  }, []);

  useEffect(() => {
    setFooterVisible(false);

    let observer;
    let mutationObserver;
    let cancelled = false;
    let retryId;
    const footerVisibility = new Map();

    const updateFooterVisible = () => {
      setFooterVisible(Array.from(footerVisibility.values()).some(Boolean));
    };

    const observeFooters = () => {
      if (cancelled) return;

      if (observer) observer.disconnect();
      footerVisibility.clear();

      const footers = Array.from(document.querySelectorAll('.footer-section'));
      if (!footers.length) {
        setFooterVisible(false);
        retryId = window.setTimeout(observeFooters, 120);
        return;
      }

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            footerVisibility.set(entry.target, entry.isIntersecting);
          });
          updateFooterVisible();
        },
        {
          root: null,
          threshold: 0.08,
          rootMargin: '0px 0px -8% 0px',
        }
      );

      footers.forEach((footer) => observer.observe(footer));
    };

    const scheduleObserveFooters = () => {
      window.clearTimeout(retryId);
      retryId = window.setTimeout(observeFooters, 80);
    };

    observeFooters();

    mutationObserver = new MutationObserver(scheduleObserveFooters);
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelled = true;
      window.clearTimeout(retryId);
      if (observer) observer.disconnect();
      if (mutationObserver) mutationObserver.disconnect();
    };
  }, [pathname]);

  useLayoutEffect(() => {
    const activeIcon = activeIconRef.current;
    if (!activeIcon) return undefined;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let resizeId;

    const positionActiveIcon = (animate = true) => {
      const next = getIconDestination(activeLink.to);
      if (!next) return;

      const previous = activeIconMetricsRef.current || next;
      activeIconMetricsRef.current = next;

      gsap.killTweensOf(activeIcon);
      gsap.killTweensOf(activeIcon.querySelector('img'));

      if (!animate || reduceMotion) {
        gsap.set(activeIcon, { ...next, autoAlpha: 1, scale: 1 });
        gsap.set(activeIcon.querySelector('img'), { scale: 1, rotate: 0 });
        return;
      }

      gsap.fromTo(
        activeIcon,
        { ...previous, autoAlpha: 1, scale: 0.92 },
        {
          ...next,
          scale: 1,
          duration: 0.58,
          ease: 'power3.inOut',
        }
      );

      gsap.fromTo(
        activeIcon.querySelector('img'),
        { scale: 0.72, rotate: -18, opacity: 0.35 },
        {
          scale: 1,
          rotate: 0,
          opacity: 1,
          duration: 0.46,
          ease: 'back.out(1.7)',
        }
      );
    };

    positionActiveIcon(Boolean(activeIconMetricsRef.current));

    const handleResize = () => {
      window.clearTimeout(resizeId);
      resizeId = window.setTimeout(() => positionActiveIcon(false), 80);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.clearTimeout(resizeId);
      window.removeEventListener('resize', handleResize);
    };
  }, [pathname, lang]);

  return (
    <nav
      className={
        'glass-nav' +
        (hideMobilePill ? ' is-hidden-mobile' : '') +
        (footerVisible ? ' is-footer-visible' : '')
      }
    >
      <div className="nav-inner">
        <a href="/" className="nav-logo-cell" aria-label="NaturaTech LAC Home" onClick={(event) => handleNavigationClick(event, '/')}>
          <div
            className="nav-logo-glass"
            data-nav-adaptive
            data-liquid-glass
            data-liquid-depth="13"
            data-liquid-strength="15"
            data-liquid-chromatic="0.16"
          >
            <img src="/assets/images/logo.svg" alt="" width="30" height="27" />
          </div>
        </a>

        <div className="nav-pill-cell">
          <div
            className="nav-pill-glass"
            data-nav-adaptive
            data-liquid-glass
            data-liquid-depth="15"
            data-liquid-strength="17"
            data-liquid-chromatic="0.13"
          >
            <div className="nav-pill" ref={pillRef}>
              <span className="nav-active-icon" ref={activeIconRef} aria-hidden="true">
                <img key={activeLink.to} src={activeLink.icon} alt="" />
              </span>
              {links.map((l) => (
                <a
                  key={l.to}
                  href={l.to}
                  onClick={(event) => handleNavigationClick(event, l.to)}
                  className={'nav-link' + (pathname === l.to ? ' active' : '')}
                  aria-current={pathname === l.to ? 'page' : undefined}
                >
                  <span
                    className="nav-icon"
                    ref={(node) => {
                      if (node) {
                        iconRefs.current.set(l.to, node);
                      } else {
                        iconRefs.current.delete(l.to);
                      }
                    }}
                    aria-hidden="true"
                  >
                    <img src={l.icon} alt="" />
                  </span>
                  <span className="nav-text nav-label-mobile">{l.label}</span>
                  <span className="nav-text nav-label-desktop">{l.desktopLabel || l.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
