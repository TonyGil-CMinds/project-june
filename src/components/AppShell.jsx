'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from '@vercel/analytics/react';

import Nav from './Nav.jsx';
import Footer from './Footer.jsx';
import ViewportFrame from './ViewportFrame.jsx';
import LanguageSwitcher from './LanguageSwitcher.jsx';
import LiquidGlassLayer from './LiquidGlassLayer.jsx';
import AdaptiveContrastLayer from './AdaptiveContrastLayer.jsx';
import SeoMetadata from './SeoMetadata.jsx';
import { FrameToggleContext } from './FrameContext.jsx';
import { LanguageProvider } from '../contexts/LanguageContext.jsx';

const BOOT_LOADER_SEEN_KEY = 'naturatech-boot-loader-seen';

gsap.registerPlugin(ScrollTrigger);

export default function AppShell({ children }) {
  const pathname = usePathname();
  const isLinksRoute = pathname === '/links';
  const isHitosRoute = pathname === '/hitos';
  const isGalleryRoute = pathname === '/galeriaceiba';
  const lenisRef = useRef(null);
  const isInitialMount = useRef(true);
  const privacyTransitionRef = useRef(null);
  const [frameVisible, setFrameVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => ScrollTrigger.refresh());

    const loader = document.getElementById('boot-loader');
    const removeLoader = () => {
      if (loader?.parentNode) loader.remove();
    };

    let hasSeenLoader = false;
    try {
      hasSeenLoader = localStorage.getItem(BOOT_LOADER_SEEN_KEY) === 'true';
    } catch (_) {
      hasSeenLoader = false;
    }

    if (!loader) return undefined;

    if (hasSeenLoader) {
      removeLoader();
      return undefined;
    }

    const hideTimer = window.setTimeout(() => {
      loader.classList.add('is-hidden');
      try {
        localStorage.setItem(BOOT_LOADER_SEEN_KEY, 'true');
        document.documentElement.classList.add('boot-loader-seen');
      } catch (_) {}

      window.setTimeout(removeLoader, 1200);
    }, 500);

    return () => window.clearTimeout(hideTimer);
  }, []);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
    });
    lenisRef.current = lenis;
    window.naturatechLenis = lenis;

    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
      if (window.naturatechLenis === lenis) {
        delete window.naturatechLenis;
      }
    };
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return undefined;
    }

    lenisRef.current?.scrollTo(0, { immediate: true });
    setFrameVisible(false);

    const id = window.setTimeout(() => {
      ScrollTrigger.refresh();
    }, 120);

    return () => window.clearTimeout(id);
  }, [pathname]);

  return (
    <LanguageProvider>
      <SeoMetadata />
      <FrameToggleContext.Provider value={setFrameVisible}>
        {!isLinksRoute && !isGalleryRoute && <Nav />}
        {!isLinksRoute && !isHitosRoute && !isGalleryRoute && <LanguageSwitcher />}
        {!isLinksRoute && !isGalleryRoute && <ViewportFrame visible={frameVisible} />}
        <div ref={privacyTransitionRef} className="privacy-route-transition" aria-hidden="true" />

        <main className="page-shell">
          <div key={pathname} className="route-view">
            {children}
          </div>
          {!isLinksRoute && !isGalleryRoute && <Footer />}
        </main>

        <LiquidGlassLayer />
        <AdaptiveContrastLayer />

        <SpeedInsights />
        <Analytics />
      </FrameToggleContext.Provider>
    </LanguageProvider>
  );
}
