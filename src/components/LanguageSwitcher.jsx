'use client';

import { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { useLanguage } from '../contexts/LanguageContext.jsx';

export default function LanguageSwitcher() {
  const { lang, switchLanguage, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const btnRef = useRef(null);

  // Animate dropdown open/close
  useEffect(() => {
    const el = dropdownRef.current;
    if (!el) return;
    if (open) {
      gsap.fromTo(el,
        { autoAlpha: 0, scale: 0.9, y: -6, filter: 'blur(8px)' },
        { autoAlpha: 1, scale: 1, y: 0, filter: 'blur(0px)', duration: 0.26, ease: 'power3.out' }
      );
    } else {
      gsap.to(el, { autoAlpha: 0, scale: 0.9, y: -6, filter: 'blur(8px)', duration: 0.18, ease: 'power2.in' });
    }
  }, [open]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (!btnRef.current?.contains(e.target) && !dropdownRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const select = (newLang) => {
    setOpen(false);
    switchLanguage(newLang);
  };

  return (
    <div className="lang-switcher">
      <button
        ref={btnRef}
        className="lang-btn css-glass"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Language: ${lang.toUpperCase()}`}
      >
        <svg
          className={'lang-chevron' + (open ? ' is-open' : '')}
          width="11" height="11" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
        <span className="lang-code">{lang.toUpperCase()}</span>
      </button>

      <div
        ref={dropdownRef}
        className="lang-dropdown css-glass"
        role="listbox"
        style={{ visibility: 'hidden', opacity: 0 }}
      >
        {['es', 'en'].map((l) => (
          <button
            key={l}
            role="option"
            aria-selected={lang === l}
            className={'lang-option' + (lang === l ? ' is-active' : '')}
            onClick={() => select(l)}
          >
            <span>{t.lang[l]}</span>
            {lang === l && (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
