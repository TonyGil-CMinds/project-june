import { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import GlassFrame from './GlassFrame.jsx';

const links = [
  {
    to: '/',
    label: 'Inicio',
    icon: '/assets/icons/Navbar/inicio.svg',
    activeIcon: '/assets/icons/Navbar/inicio-active.png',
  },
  { to: '/emprendimientos', label: 'Startups', icon: '/assets/icons/Navbar/startups.svg' },
  { to: '/ceiba', label: 'CEIBA', icon: '/assets/icons/Navbar/ceiba.svg' },
  { to: '/studio', label: 'Studio', icon: '/assets/icons/Navbar/studio.svg' },
  { to: '/ecos', label: 'Ecos', icon: '/assets/icons/Navbar/ecos.svg' },
];

export default function Nav() {
  const [hideMobilePill, setHideMobilePill] = useState(false);
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

  return (
    <nav className={'glass-nav' + (hideMobilePill ? ' is-hidden-mobile' : '')}>
      <div className="nav-inner">

        {/* Logo cell — left column */}
        <NavLink to="/" className="nav-logo-cell" aria-label="NaturaTech LAC Home">
          <GlassFrame
            cornerRadius={999}
            className="nav-logo-glass"
            displacementScale={50}
            blurAmount={0.07}
            saturation={140}
            aberrationIntensity={1.2}
            elasticity={0.25}
          >
            <div className="nav-logo-inner">
              <img src="/assets/images/logo.svg" alt="" width="30" height="27" />
            </div>
          </GlassFrame>
        </NavLink>

        {/* Pill cell — centered column */}
        <div className="nav-pill-cell">
          <GlassFrame
            cornerRadius={999}
            className="nav-pill-glass"
            displacementScale={26}
            blurAmount={1}
            saturation={130}
            aberrationIntensity={1.5}
            elasticity={0.2}
          >
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
                        className={'nav-icon' + (isActive && l.activeIcon ? ' has-active-asset' : '')}
                        aria-hidden="true"
                      >
                        <img src={isActive && l.activeIcon ? l.activeIcon : l.icon} alt="" />
                      </span>
                      <span className="nav-text">{l.label}</span>
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </GlassFrame>
        </div>

        <div className="nav-spacer-cell" />
      </div>
    </nav>
  );
}
