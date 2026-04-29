import { Routes, Route, useLocation } from 'react-router-dom';
import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Nav from './components/Nav.jsx';
import Footer from './components/Footer.jsx';
import ViewportFrame from './components/ViewportFrame.jsx';
import BarbaTransition from './components/BarbaTransition.jsx';

const Home = lazy(() => import('./pages/Home.jsx'));
const Emprendimientos = lazy(() => import('./pages/Emprendimientos.jsx'));
const Ceiba = lazy(() => import('./pages/Ceiba.jsx'));
const Studio = lazy(() => import('./pages/Studio.jsx'));
const Ecos = lazy(() => import('./pages/Ecos.jsx'));

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const location = useLocation();
  const lenisRef = useRef(null);
  const [frameVisible, setFrameVisible] = useState(false);
  const [appReady, setAppReady] = useState(false);
  const isInitialMount = useRef(true);

  useEffect(() => {
    // Show content immediately - always
    setAppReady(true);
    requestAnimationFrame(() => ScrollTrigger.refresh());
    sessionStorage.setItem('app-initialized', 'true');

    // Fade out loader in background
    const loader = document.getElementById('boot-loader');
    if (loader) {
      setTimeout(() => {
        loader.classList.add('is-hidden');
        setTimeout(() => {
          if (loader.parentNode) loader.remove();
        }, 1200);
      }, 500);
    }
  }, []);

  /* ── Lenis smooth scroll, persistent across routes ───────── */
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
    });
    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  /* ── On every route change: scroll to top, kill old triggers, refresh ── */
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (lenisRef.current) lenisRef.current.scrollTo(0, { immediate: true });

    // Kill any ScrollTriggers from the page we just left
    ScrollTrigger.getAll().forEach((t) => t.kill());

    // Allow new page to mount and transition to finish, then refresh GSAP
    const id = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 700);

    // Reset frame on every nav
    setFrameVisible(false);

    return () => clearTimeout(id);
  }, [location.pathname]);

  return (
    <>
      <Nav />
      <ViewportFrame visible={frameVisible} />
      <BarbaTransition />

      <main className="page-shell">
        <Suspense fallback={<div className="route-loading" aria-hidden="true" />}>
          <Routes location={location}>
            <Route path="/" element={<Home appReady={appReady} />} />
            <Route
              path="/emprendimientos"
              element={<Emprendimientos onFrameToggle={setFrameVisible} />}
            />
            <Route path="/ceiba" element={<Ceiba />} />
            <Route path="/studio" element={<Studio />} />
            <Route path="/ecos" element={<Ecos />} />
            <Route path="*" element={<Home appReady={appReady} />} />
          </Routes>
        </Suspense>
        <Footer />
      </main>
    </>
  );
}
