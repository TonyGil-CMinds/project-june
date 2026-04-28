import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const links = [
  {
    to: '/',
    label: 'Inicio',
    icon: '/assets/icons/Navbar/inicio.svg',
  },
  {
    to: '/emprendimientos',
    label: 'Startups',
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
  const lastScrollYRef = useRef(0);
  const scrollIdleRef = useRef(null);

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
    let cancelled = false;
    let retryId;

    const observeFooter = () => {
      if (cancelled) return;

      const footer = document.querySelector('.footer-section');
      if (!footer) {
        retryId = window.setTimeout(observeFooter, 120);
        return;
      }

      observer = new IntersectionObserver(
        ([entry]) => setFooterVisible(entry.isIntersecting),
        {
          root: null,
          threshold: 0.08,
          rootMargin: '0px 0px -8% 0px',
        }
      );
      observer.observe(footer);
    };

    observeFooter();

    return () => {
      cancelled = true;
      window.clearTimeout(retryId);
      if (observer) observer.disconnect();
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
        <NavLink to="/" className="nav-logo-cell" aria-label="NaturaTech LAC Home">
          <div className="nav-logo-glass">
            <img src="/assets/images/logo.svg" alt="" width="30" height="27" />
          </div>
        </NavLink>

        <div className="nav-pill-cell">
          <div className="nav-pill-glass">
            <div className="nav-pill">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.to === '/'}
                  className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
                >
                  {({ isActive }) => (
                    <>
                      <span
                        className="nav-icon"
                        aria-hidden="true"
                      >
                        <img src={l.icon} alt="" />
                      </span>
                      <span className="nav-text nav-label-mobile">{l.label}</span>
                      <span className="nav-text nav-label-desktop">{l.desktopLabel || l.label}</span>
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
