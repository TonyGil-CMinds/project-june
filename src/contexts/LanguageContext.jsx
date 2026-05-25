'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { translations } from '../translations/index.js';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('es');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('nt-lang');
      if (saved === 'en' || saved === 'es') setLang(saved);
    } catch (_) {}
  }, []);

  const switchLanguage = useCallback((newLang) => {
    if (newLang === lang) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) {
      setLang(newLang);
      try { localStorage.setItem('nt-lang', newLang); } catch (_) {}
      return;
    }

    const overlay = document.createElement('div');
    overlay.className = 'lang-transition-overlay';
    document.body.appendChild(overlay);

    gsap.timeline()
      .fromTo(overlay,
        { yPercent: 100 },
        {
          yPercent: 0, duration: 0.52, ease: 'power3.inOut',
          onComplete: () => {
            setLang(newLang);
            try { localStorage.setItem('nt-lang', newLang); } catch (_) {}
          },
        }
      )
      .to(overlay, {
        yPercent: -100, duration: 0.48, ease: 'power3.inOut',
        onComplete: () => overlay.remove(),
      });
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, switchLanguage, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider');
  return ctx;
}
