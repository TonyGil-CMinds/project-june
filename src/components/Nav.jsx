import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';

const links = [
  {
    to: '/',
    label: 'Inicio',
    icon: '/assets/icons/Navbar/inicio.svg',
  },
  {
    to: '/emprendimientos',
    label: 'Empresas',
    desktopLabel: 'Empresas',
    icon: '/assets/icons/Navbar/startups.svg',
  },
  { to: '/ceiba', label: 'CEIBA', icon: '/assets/icons/Navbar/ceiba.svg' },
  { to: '/studio', label: 'Studio', icon: '/assets/icons/Navbar/studio.svg' },
  { to: '/ecos', label: 'Ecos', icon: '/assets/icons/Navbar/ecos.svg' },
];

export default function Nav() {
  const location = useLocation();
  const [hideMobilePill, setHideMobilePill] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);
  const pillRef = useRef(null);
  const activeIconRef = useRef(null);
  const iconRefs = useRef(new Map());
  const activeIconMetricsRef = useRef(null);
  const lastScrollYRef = useRef(0);
  const scrollIdleRef = useRef(null);
  const activeLink = links.find((link) => link.to === location.pathname) || links[0];

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
  }, [location.pathname]);

  useLayoutEffect(() => {
    const pill = pillRef.current;
    const activeIcon = activeIconRef.current;
    const targetIcon = iconRefs.current.get(activeLink.to);
    if (!pill || !activeIcon || !targetIcon) return undefined;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let resizeId;

    const getMetrics = () => {
      const pillRect = pill.getBoundingClientRect();
      const iconRect = targetIcon.getBoundingClientRect();

      return {
        x: iconRect.left - pillRect.left,
        y: iconRect.top - pillRect.top,
        width: iconRect.width,
        height: iconRect.height,
      };
    };

    const positionActiveIcon = (animate = true) => {
      const next = getMetrics();
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
  }, [location.pathname]);

  return (
    <nav
      className={
        'glass-nav' +
        (hideMobilePill ? ' is-hidden-mobile' : '') +
        (footerVisible ? ' is-footer-visible' : '')
      }
    >
      <div className="nav-inner">
        <Link to="/" className="nav-logo-cell" aria-label="NaturaTech LAC Home">
          <div className="nav-logo-glass">
            <img src="/assets/images/logo.svg" alt="" width="30" height="27" />
          </div>
        </Link>

        <div className="nav-pill-cell">
          <div className="nav-pill-glass">
            <div className="nav-pill" ref={pillRef}>
              <span className="nav-active-icon" ref={activeIconRef} aria-hidden="true">
                <img key={activeLink.to} src={activeLink.icon} alt="" />
              </span>
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className={'nav-link' + (location.pathname === l.to ? ' active' : '')}
                  aria-current={location.pathname === l.to ? 'page' : undefined}
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
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
