'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { translations } from '../translations/index.js';

const LanguageContext = createContext(null);
const LANGUAGE_STORAGE_KEY = 'nt-lang';
const LANGUAGE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

function getCookieLanguage() {
  const value = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${LANGUAGE_STORAGE_KEY}=`))
    ?.split('=')[1];

  return value === 'en' || value === 'es' ? value : null;
}

function persistLanguage(newLang) {
  try { localStorage.setItem(LANGUAGE_STORAGE_KEY, newLang); } catch (_) {}
  document.cookie = `${LANGUAGE_STORAGE_KEY}=${newLang}; path=/; max-age=${LANGUAGE_COOKIE_MAX_AGE}; samesite=lax`;
  document.documentElement.lang = newLang;
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('es');

  useEffect(() => {
    try {
      const saved = getCookieLanguage() || localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (saved === 'en' || saved === 'es') {
        setLang(saved);
        persistLanguage(saved);
      }
    } catch (_) {}
  }, []);

  const switchLanguage = useCallback((newLang) => {
    if (newLang === lang) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) {
      setLang(newLang);
      persistLanguage(newLang);
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
            persistLanguage(newLang);
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
