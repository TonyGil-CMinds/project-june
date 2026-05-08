import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/hitos.css';

gsap.registerPlugin(ScrollTrigger);

const HITOS = [
  {
    id: '01',
    year: '2022',
    label: 'Lanzamiento',
    event: 'Nace Natura 500',
    description:
      'Lanzamos el primer programa de aceleración para emprendimientos bioculturales de Latinoamérica, reuniendo a 12 emprendedores seleccionados entre más de 300 postulantes de toda la región.',
    images: ['/assets/historias/historia-dos.webp'],
    layout: 'hero-hito',
  },
  {
    id: '02',
    year: '2023',
    label: 'Primera Cohorte',
    event: 'Demo Day — Bogotá',
    description:
      'Celebramos el primer Demo Day con más de 200 inversionistas, aliados y medios presentes. Ocho emprendimientos presentaron sus soluciones ante tomadores de decisión regionales.',
    images: [
      '/assets/historias/historia-one.webp',
      '/assets/historias/historia-tres.webp',
    ],
    layout: 'split',
  },
  {
    id: '03',
    year: '2023',
    label: 'Reconocimiento',
    event: 'Premio BioImpacto',
    description:
      'Tres emprendimientos de la primera cohorte fueron galardonados en las categorías de innovación, escalabilidad e impacto territorial ante una audiencia internacional.',
    images: [
      '/assets/historias/historia-one.webp',
      '/assets/historias/historia-dos.webp',
      '/assets/historias/historia-tres.webp',
    ],
    layout: 'triple',
  },
  {
    id: '04',
    year: '2024',
    label: 'Expansión',
    event: 'Cumbre Regional LAC',
    description:
      'Reunimos a más de 300 líderes de 12 países para reflexionar sobre nuevos modelos de economía regenerativa y la bioculturalidad como palanca de desarrollo sostenible.',
    images: ['/assets/historias/historia-cuatro.webp'],
    layout: 'full',
    cta: 'Ver Galería',
  },
];

/* Waveform bars for the scroll indicator */
const BARS = [3, 6, 10, 14, 18, 22, 20, 16, 12, 8, 6, 4, 6, 9, 14, 18, 22, 18, 13, 8, 5, 3];

export default function Hitos() {
  const rootRef    = useRef(null);
  const wrapperRef = useRef(null);
  const heroLeftRef    = useRef(null);
  const heroRightRef   = useRef(null);
  const heroCenterRef  = useRef(null);
  const slidesRef      = useRef([]);
  const dotsRef        = useRef([]);
  const counterCurrentRef = useRef(null);

  /* Hide main nav */
  useEffect(() => {
    document.body.classList.add('hitos-active');
    return () => document.body.classList.remove('hitos-active');
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const heroLeft   = heroLeftRef.current;
      const heroRight  = heroRightRef.current;
      const heroCenter = heroCenterRef.current;
      const slides     = slidesRef.current.filter(Boolean);
      const total      = slides.length;        // 4

      /* ── Initial states ── */
      gsap.set(slides, { autoAlpha: 0 });
      /* GSAP owns the y-centering so transforms don't conflict */
      gsap.set([heroLeft, heroRight], { yPercent: -50 });

      /* ── Master timeline ── */
      const tl = gsap.timeline();

      /*
        Phase 0 → 1  (t: 0 → ~1.2)
        Side images pinch inward + hero center fades out → first hito fades in
      */
      tl.to(heroLeft,  { x: '28vw',  duration: 0.85, ease: 'power2.inOut' }, 0)
        .to(heroRight, { x: '-28vw', duration: 0.85, ease: 'power2.inOut' }, 0)
        .to(heroCenter, { autoAlpha: 0, y: -24, duration: 0.5, ease: 'power1.in' }, 0.15)
        .to([heroLeft, heroRight], { autoAlpha: 0, duration: 0.35 }, 0.75)
        .to(slides[0], { autoAlpha: 1, duration: 0.55, ease: 'power1.out' }, 0.85);

      /*
        Phases 1 → total  (each ~1 unit)
        Standard crossfades between hito slides
      */
      for (let i = 0; i < total - 1; i++) {
        const off = i + 1.2;
        tl.to(slides[i],     { autoAlpha: 0, duration: 0.5, ease: 'power1.inOut' }, off)
          .to(slides[i + 1], { autoAlpha: 1, duration: 0.5, ease: 'power1.inOut' }, off + 0.5);
      }

      /* ── ScrollTrigger pin ── */
      ScrollTrigger.create({
        trigger: wrapperRef.current,
        start: 'top top',
        end: () => `+=${total * window.innerHeight}`,
        pin: true,
        scrub: 1.5,
        animation: tl,
        invalidateOnRefresh: true,
        onUpdate(self) {
          /* One phase per hito (including the hero→hito-1 transition) */
          const idx = Math.min(Math.floor(self.progress * total + 0.01), total - 1);

          if (counterCurrentRef.current) {
            counterCurrentRef.current.textContent = String(idx + 1).padStart(2, '0');
          }
          dotsRef.current.forEach((dot, i) => {
            if (dot) dot.classList.toggle('active', i === idx);
          });
        },
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="hitos-root">
      <div ref={wrapperRef} className="hitos-wrapper">

        {/* ── Top chrome ── */}
        <div className="hitos-chrome-top">
          <Link to="/" className="hitos-back">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 5 5 12 12 19" />
            </svg>
            Regresar
          </Link>
          <span className="hitos-page-label">HITOS</span>
          <span className="hitos-counter">
            <span ref={counterCurrentRef} className="counter-current">01</span>
            <span className="counter-sep"> / </span>
            <span className="counter-total">{String(HITOS.length).padStart(2, '0')}</span>
          </span>
        </div>

        {/* ── Hero left image ── */}
        <div ref={heroLeftRef} className="hero-side hero-side--left">
          <div
            className="hero-side__img"
            style={{ backgroundImage: `url(/assets/historias/historia-one.webp)` }}
          />
        </div>

        {/* ── Hero right image ── */}
        <div ref={heroRightRef} className="hero-side hero-side--right">
          <div
            className="hero-side__img"
            style={{ backgroundImage: `url(/assets/historias/historia-cuatro.webp)` }}
          />
        </div>

        {/* ── Hero center content ── */}
        <div ref={heroCenterRef} className="hero-center">
          <div className="hero-logo-wrap">
            <img src="/assets/images/logo.svg" alt="NaturaTech" className="hero-logo" />
          </div>
          <p className="hero-initiative-label">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
              <path d="M8 12c0-2.21 1.79-4 4-4s4 1.79 4 4"/>
            </svg>
            LOGROS DE LA INICIATIVA
          </p>
          <h1 className="hero-title">
            HITOS DE<br />IMPACTO
          </h1>
          <div className="hero-scroll-indicator">
            <span className="hero-scroll-text">SCROLL</span>
            <div className="hero-waveform">
              {BARS.map((h, i) => (
                <div
                  key={i}
                  className="waveform-bar"
                  style={{ '--bar-h': `${h}px`, animationDelay: `${i * 0.06}s` }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── Hito slides ── */}
        {HITOS.map((hito, i) => (
          <div
            key={hito.id}
            ref={(el) => (slidesRef.current[i] = el)}
            className={`hito-slide hito-slide--${hito.layout}`}
          >
            {hito.layout === 'hero-hito' && <HeroHitoSlide hito={hito} />}
            {hito.layout === 'split'     && <SplitSlide    hito={hito} />}
            {hito.layout === 'triple'    && <TripleSlide   hito={hito} />}
            {hito.layout === 'full'      && <FullSlide     hito={hito} />}
          </div>
        ))}

        {/* ── Progress indicator ── */}
        <div className="hitos-progress">
          {HITOS.map((_, i) => (
            <div
              key={i}
              ref={(el) => (dotsRef.current[i] = el)}
              className={`progress-dot${i === 0 ? ' active' : ''}`}
            />
          ))}
        </div>

      </div>
    </div>
  );
}

/* ── Slide components ── */

function HeroHitoSlide({ hito }) {
  return (
    <div className="slide-hero-hito">
      <div className="slide-hero-hito__text">
        <p className="slide-label">{hito.label} — {hito.year}</p>
        <h2 className="slide-title">{hito.event}</h2>
        <p className="slide-desc">{hito.description}</p>
      </div>
      <div className="slide-hero-hito__image">
        <div className="img-frame" style={{ backgroundImage: `url(${hito.images[0]})` }} />
      </div>
    </div>
  );
}

function SplitSlide({ hito }) {
  return (
    <div className="slide-split">
      <div className="slide-split__images">
        {hito.images.map((src, i) => (
          <div key={i} className="img-frame" style={{ backgroundImage: `url(${src})` }} />
        ))}
      </div>
      <div className="slide-split__text">
        <p className="slide-label">{hito.label} — {hito.year}</p>
        <h2 className="slide-title">{hito.event}</h2>
        <p className="slide-desc">{hito.description}</p>
      </div>
    </div>
  );
}

function TripleSlide({ hito }) {
  return (
    <div className="slide-triple">
      <div className="slide-triple__text">
        <p className="slide-label">{hito.label} — {hito.year}</p>
        <h2 className="slide-title">{hito.event}</h2>
      </div>
      <div className="slide-triple__images">
        {hito.images.map((src, i) => (
          <div key={i} className="img-frame" style={{ backgroundImage: `url(${src})` }} />
        ))}
      </div>
      <p className="slide-desc slide-desc--wide">{hito.description}</p>
    </div>
  );
}

function FullSlide({ hito }) {
  return (
    <div className="slide-full">
      <div className="slide-full__image">
        <div className="img-frame" style={{ backgroundImage: `url(${hito.images[0]})` }} />
      </div>
      <div className="slide-full__text">
        <p className="slide-label">{hito.label} — {hito.year}</p>
        <h2 className="slide-title">{hito.event}</h2>
        <p className="slide-desc">{hito.description}</p>
        {hito.cta && (
          <a href="#" className="btn-glass-outline css-glass hitos-cta">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            {hito.cta}
          </a>
        )}
      </div>
    </div>
  );
}
