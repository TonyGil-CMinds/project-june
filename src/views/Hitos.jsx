'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cleanupGsapRoute } from '../utils/cleanupGsapRoute.js';
import { useLanguage } from '../contexts/LanguageContext.jsx';

gsap.registerPlugin(ScrollTrigger);

function historiaImage(folder, file) {
  return `/assets/historias/${encodeURIComponent(folder)}/${encodeURIComponent(file)}`;
}

const HITOS = [
  {
    id: '01',
    year: '2024',
    label: 'EN EL MARCO DE COP16',
    event: 'Premio NaturaTech LAC',
    description:
      'NaturaTech LAC Scale-Up Studio financia y brinda apoyo personalizado a un portafolio de demostradores innovadores en 6 países y 48 organizaciones aliadas, 11 de ellas indígenas o afrodescendientes. En conjunto, gestionan más de 62,000 hectáreas con tecnologías de frontera, mitigan 4.4 millones de tCO₂ al año, han certificado 690 hectáreas como carbono azul y generaron 77 nuevos empleos locales directos en más de 40 comunidades.',
    images: [
      historiaImage('Premio 2024', 'Premiacion Naturatech Lac-115.avif'),
    ],
    layout: 'hero-hito',
    cta: 'Ver video',
    ctaUrl: 'https://www.youtube.com/watch?si=MD393RKzMzYmZzV6&v=bHeOXvmVqWo&feature=youtu.be',
  },
  {
    id: '02',
    year: '2024',
    label: 'ESCUELA VIVA AMAZONÍA',
    event: 'EXPLORA 1RA. EDICIÓN',
    description:
      'En alianza con Escuela Viva Amazonía, una iniciativa de Cuencas Sagradas Amazónicas, la cohorte inaugural de Explora capacitó a jóvenes indígenas de más de 20 nacionalidades en IA, drones, SIG y narrativa.',
    images: [
      historiaImage('Explora 1a edicion', 'DSC01063.avif'),
      historiaImage('Explora 1a edicion', 'DSC01282.avif'),
    ],
    layout: 'split',
    cta: 'Ver video',
    ctaUrl: 'https://www.youtube.com/watch?v=E8RJexNqXgE',
  },
  {
    id: '03',
    year: '2024',
    label: 'EN EL MARCO DE COP16',
    event: 'FORO DE INVERSIÓN PARA LA BIODIVERSIDAD',
    description:
      'El primer espacio regional donde voces multiculturales de Latinoamérica y el Caribe se reunieron para dar forma juntas al futuro de la innovación en la naturaleza. Al reunir a líderes indígenas, científicos, emprendedores y responsables de políticas públicas de toda LAC, el Foro fue un acto fundacional de diálogo. Sembró la visión de gobernanza que más tarde se convertiría en CEIBA.',
    images: [
      historiaImage('Foro', 'foro1.avif'),
      historiaImage('Foro', '750_7637.avif'),
      historiaImage('Foro', '750_7696.avif'),
    ],
    layout: 'triple',
    cta: 'Ver video',
    ctaUrl: 'https://www.youtube.com/watch?v=drLfbctSeoo',
  },
  {
    id: '04',
    year: '2024',
    label: 'EN EL MARCO DE COP16',
    event: 'Presentación de la Minga Jaguar',
    description:
      'La primera alianza biocultural de la región guiada por el espíritu del jaguar y el liderazgo de los pueblos indígenas. La Alianza Minga Jaguar nació en 6 países —México, Costa Rica, Ecuador, Perú, Colombia y Brasil—, tejiendo una red compartida de gobernanza y monitoreo para proteger los biocorredores del jaguar.',
    images: [
      historiaImage('Presentación Minga', 'presentacion.avif'),
    ],
    layout: 'full',
    cta: 'Ver video',
    ctaUrl: 'https://www.youtube.com/watch?v=lyO3V67DHi4',
  },
  {
    id: '05',
    year: '2025',
    label: 'Minga Jaguar',
    event: 'Primer Encuentro',
    description:
      'Por primera vez, los guardianes del corredor del jaguar se reunieron en un mismo espacio y construyeron una hoja de ruta compartida. Celebrado en la Península de Yucatán, el encuentro convocó a miembros de la alianza de todo el corredor transfronterizo para alinear protocolos de monitoreo, impulsar la adopción de IA y codiseñar el modelo de gobernanza biocultural para todo el rango de distribución del jaguar.',
    images: [
      historiaImage('1er Encuentro Minga', 'IMG_8018.avif'),
    ],
    layout: 'hero-hito',
    cta: 'Ver video',
    ctaUrl: 'https://www.youtube.com/shorts/jZh_MFQB8dI',
  },
  {
    id: '06',
    year: '2025',
    label: 'Encuentro transfronterizo',
    event: 'Conectando Bioregiones',
    description:
      'El primer encuentro transfronterizo entre la EU–LAC para la innovación regenerativa. Codirigido junto con SIDA y el Stockholm Resilience Centre en el Beijer Institute / Royal Swedish Academy of Sciences, Bridging Regions conectó el ecosistema de innovación biocultural de LAC con las redes europeas de sostenibilidad, tecnología y financiamiento.',
    images: [
      historiaImage('Bioregiones', '250617_NaturaTechLAC-27.avif'),
      historiaImage('Bioregiones', '250617_NaturaTechLAC-41.avif'),
    ],
    layout: 'split',
    cta: 'Ver video',
    ctaUrl: 'https://www.youtube.com/watch?v=gnjdSS36jXE',
  },
  {
    id: '07',
    year: '2025',
    label: 'Escuela Viva Amazonía',
    event: 'Explora 2da. Edición',
    description:
      'A lo largo de sus dos ediciones, Explora ha formado a más de 100 jóvenes líderes indígenas de más de 20 nacionalidades de Ecuador y Perú.',
    images: [
      historiaImage('Explora 2a edici\u00f3n', 'DSC00077.avif'),
      historiaImage('Explora 2a edici\u00f3n', 'DSC01420.avif'),
      historiaImage('Explora 2a edici\u00f3n', 'DSC01694.avif'),
    ],
    layout: 'triple',
    cta: 'Ver video',
    ctaUrl: 'https://www.youtube.com/watch?v=Iop-QfLFprc',
  },
  {
    id: '08',
    year: '2025',
    label: 'Cumbre',
    event: 'Ceiba 2025',
    description:
      'Más de 100 líderes de 17 países se reunieron en un consejo de gobernanza. Multicultural, intergeneracional y multisectorial —desde liderazgos indígenas territoriales hasta fondos, emprendedores y sociedad civil—, con el objetivo de habilitar la arquitectura continental de LAC para la inteligencia colectiva sobre biodiversidad y capital natural.',
    images: [
      historiaImage('CEIBA', 'CEIBA DIA 1 202514.avif'),
    ],
    layout: 'full',
    cta: 'Ver video',
    ctaUrl: 'https://www.youtube.com/watch?v=RWM2R4UhTDE',
  },
];


function getYouTubeEmbedUrl(url) {
  try {
    const id = new URL(url).searchParams.get('v');
    return id ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&playsinline=1` : null;
  } catch {
    return null;
  }
}

export default function Hitos() {
  const { t } = useLanguage();
  const rootRef    = useRef(null);
  const wrapperRef = useRef(null);
  const heroLeftRef    = useRef(null);
  const heroRightRef   = useRef(null);
  const heroCenterRef  = useRef(null);
  const slidesRef      = useRef([]);
  const dotsRef        = useRef([]);
  const counterCurrentRef = useRef(null);
  const counterWrapRef    = useRef(null);
  const countStartedRef   = useRef(false);

  const videoOverlayRef = useRef(null);
  const videoPanelRef   = useRef(null);
  const videoFrameRef   = useRef(null);
  const videoOriginRef  = useRef(null);
  const [videoUrl,     setVideoUrl]     = useState(null);
  const [videoClosing, setVideoClosing] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add('hitos-is-open');
    return () => document.documentElement.classList.remove('hitos-is-open');
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
      gsap.set(counterWrapRef.current, { autoAlpha: 0 });
      /* GSAP owns the y-centering so transforms don't conflict */
      gsap.set([heroLeft, heroRight], { yPercent: -50 });

      /* ── Master timeline ── */
      const tl = gsap.timeline();

      /*
        Phase 0 → 1  (t: 0 → ~1.2)
        Side images slide outward + hero center fades out → first hito fades in
      */
      tl.to(heroLeft,  { x: '-20vw', duration: 0.85, ease: 'power2.inOut' }, 0)
        .to(heroRight, { x: '20vw',  duration: 0.85, ease: 'power2.inOut' }, 0)
        .to(heroCenter, { autoAlpha: 0, y: -24, duration: 0.5, ease: 'power1.in' }, 0.15)
        .to([heroLeft, heroRight], { autoAlpha: 0, duration: 0.35 }, 0.75)
        .to(slides[0], { autoAlpha: 1, duration: 0.55, ease: 'power1.out' }, 0.85)
        .to(counterWrapRef.current, { autoAlpha: 1, duration: 0.4, ease: 'power1.out' }, 0.95);

      /*
        Phases 1 → total  (each ~1 unit)
        Standard crossfades between hito slides
      */
      for (let i = 0; i < total - 1; i++) {
        const off = i + 1.5;
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
          const idx = Math.min(Math.floor(self.progress * total + 0.01), total - 1);

          if (idx > 0) countStartedRef.current = true;
          if (counterCurrentRef.current && countStartedRef.current) {
            counterCurrentRef.current.textContent = String(idx + 1).padStart(2, '0');
          }
          dotsRef.current.forEach((dot, i) => {
            if (dot) dot.classList.toggle('active', i === idx);
          });
        },
      });
    }, rootRef);

    return () => {
      cleanupGsapRoute(rootRef.current);
      ctx.revert();
    };
  }, []);

  /* ── Video modal: open animation ── */
  useEffect(() => {
    if (!videoUrl) return undefined;

    const overlay = videoOverlayRef.current;
    const panel   = videoPanelRef.current;
    const frame   = videoFrameRef.current;
    const origin  = videoOriginRef.current;
    if (!overlay || !panel || !origin) return undefined;

    const getTarget = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const isMobilePortrait = window.matchMedia('(max-width: 768px) and (orientation: portrait)').matches;
      if (!isMobilePortrait) return { top: 0, left: 0, width: vw, height: vh, radius: 0 };

      const gutter = 20;
      const maxW = vw - gutter * 2;
      const maxH = Math.min(vh - 128, maxW * 9 / 16);
      let w = Math.min(maxW, maxH * 16 / 9);
      let h = w * 9 / 16;
      if (h > maxH) { h = maxH; w = h * 16 / 9; }
      return { top: (vh - h) / 2, left: (vw - w) / 2, width: w, height: h, radius: 20 };
    };

    const target = getTarget();
    document.documentElement.classList.add('hitos-video-is-open');

    gsap.set(overlay, { autoAlpha: 1 });
    gsap.set(panel, { top: origin.top, left: origin.left, width: origin.width, height: origin.height, borderRadius: 999 });
    gsap.set(frame, { autoAlpha: 0, scale: 1.04 });

    const tl = gsap.timeline({ defaults: { ease: 'power4.inOut' } });
    tl.fromTo(overlay, { backgroundColor: 'rgba(8,11,9,0)' }, { backgroundColor: 'rgba(8,11,9,0.82)', duration: 0.55 }, 0)
      .to(panel, { top: target.top, left: target.left, width: target.width, height: target.height, borderRadius: target.radius, duration: 0.86 }, 0)
      .to(frame, { autoAlpha: 1, scale: 1, duration: 0.34, ease: 'power2.out' }, 0.5);

    const onKey    = (e) => { if (e.key === 'Escape') closeVideo(); };
    const onResize = () => {
      const t = getTarget();
      gsap.to(panel, { top: t.top, left: t.left, width: t.width, height: t.height, borderRadius: t.radius, duration: 0.42, ease: 'power3.out' });
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      tl.kill();
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
      document.documentElement.classList.remove('hitos-video-is-open');
    };
  }, [videoUrl]); // eslint-disable-line react-hooks/exhaustive-deps

  const openVideo = (ctaUrl, originRect) => {
    if (videoUrl) return;
    videoOriginRef.current = originRect;
    setVideoClosing(false);
    setVideoUrl(ctaUrl);
  };

  const closeVideo = () => {
    if (!videoUrl || videoClosing) return;

    const overlay = videoOverlayRef.current;
    const panel   = videoPanelRef.current;
    const frame   = videoFrameRef.current;
    const origin  = videoOriginRef.current;

    if (!overlay || !panel || !origin) { setVideoUrl(null); return; }

    setVideoClosing(true);
    gsap.timeline({
      defaults: { ease: 'power3.inOut' },
      onComplete: () => { setVideoUrl(null); setVideoClosing(false); },
    })
      .to(frame,   { autoAlpha: 0, scale: 1.02, duration: 0.22, ease: 'power2.out' }, 0)
      .to(panel,   { top: origin.top, left: origin.left, width: origin.width, height: origin.height, borderRadius: 999, duration: 0.62 }, 0)
      .to(overlay, { backgroundColor: 'rgba(8,11,9,0)', duration: 0.5 }, 0.08);
  };

  return (
    <div ref={rootRef} className="hitos-root">
      <div ref={wrapperRef} className="hitos-wrapper">

        {/* ── Top chrome ── */}
        <div className="hitos-chrome-top">
          <a href="/" className="hitos-back">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M15 6L9 12L15 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {t.common.back}
          </a>
          <span className="hitos-page-label">{t.hitos.pageLabel}</span>
          <span ref={counterWrapRef} className="hitos-counter">
            <span ref={counterCurrentRef} className="counter-current">01</span>
            <span className="counter-sep"> / </span>
            <span className="counter-total">{String(HITOS.length).padStart(2, '0')}</span>
          </span>
        </div>

        {/* ── Hero left image ── */}
        <div ref={heroLeftRef} className="hero-side hero-side--left">
          <div className="hero-side__img" style={{ backgroundImage: `url(${historiaImage('Premio 2024', 'Premiacion Naturatech Lac-176.avif')})` }} />
        </div>

        {/* ── Hero right image ── */}
        <div ref={heroRightRef} className="hero-side hero-side--right">
          <div className="hero-side__img" style={{ backgroundImage: `url(${historiaImage('CEIBA', 'CEIBA DIA 1 202523.avif')})` }} />
        </div>

        {/* ── Hero center content ── */}
        <div ref={heroCenterRef} className="hero-center">
          <div className="hero-logo-wrap">
            <img src="/assets/images/logo.svg" alt="NaturaTech" className="hero-logo" />
          </div>
          <p className="hero-initiative-label">{t.hitos.initiativeLabel}</p>
          <h1 className="hero-title">
            {t.hitos.title1}<br />{t.hitos.title2}
          </h1>
          <div className="hero-scroll-indicator">
            <span className="hero-scroll-text">{t.hitos.scrollText}</span>
            <svg className="hero-scroll-chevron" width="16" height="24" viewBox="0 0 16 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M8 4L8 20M8 20L2 14M8 20L14 14" />
            </svg>
          </div>
        </div>

        {/* ── Hito slides ── */}
        {HITOS.map((hito, i) => {
          const content = t.hitos.items[i] || {};
          const merged = { ...hito, label: content.label || hito.label, event: content.event || hito.event, description: content.description || hito.description };
          return (
            <div
              key={hito.id}
              ref={(el) => (slidesRef.current[i] = el)}
              className={`hito-slide hito-slide--${hito.layout}`}
            >
              {hito.layout === 'hero-hito' && <HeroHitoSlide hito={merged} onOpenVideo={openVideo} ctaLabel={t.hitos.ctaVideo} />}
              {hito.layout === 'split'     && <SplitSlide    hito={merged} onOpenVideo={openVideo} ctaLabel={t.hitos.ctaVideo} />}
              {hito.layout === 'triple'    && <TripleSlide   hito={merged} onOpenVideo={openVideo} ctaLabel={t.hitos.ctaVideo} />}
              {hito.layout === 'full'      && <FullSlide     hito={merged} onOpenVideo={openVideo} ctaLabel={t.hitos.ctaVideo} />}
            </div>
          );
        })}

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

      {/* ── Video modal ── */}
      {videoUrl && (
        <div
          ref={videoOverlayRef}
          className="hitos-video-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={t.hitos.ctaVideo}
          onClick={closeVideo}
        >
          <div ref={videoPanelRef} className="hitos-video-panel" onClick={(e) => e.stopPropagation()}>
            <iframe
              ref={videoFrameRef}
              className="hitos-video-frame"
              src={getYouTubeEmbedUrl(videoUrl)}
              title="Video del hito"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
            <button className="hitos-video-close" type="button" onClick={closeVideo} aria-label={t.common.closeVideo}>
              <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Slide components ── */

function HitoCta({ hito, onOpenVideo, ctaLabel }) {
  if (!hito.ctaUrl) return null;
  const handleClick = (e) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    onOpenVideo(hito.ctaUrl, rect);
  };
  return (
    <button type="button" className="btn-glass-outline css-glass hitos-cta" onClick={handleClick}>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <polygon points="5 3 19 12 5 21 5 3" />
      </svg>
      {ctaLabel}
    </button>
  );
}

function HeroHitoSlide({ hito, onOpenVideo, ctaLabel }) {
  return (
    <div className="slide-hero-hito">
      <div className="slide-hero-hito__text">
        <p className="slide-label">{hito.label} — {hito.year}</p>
        <h2 className="slide-title">{hito.event}</h2>
        <p className="slide-desc">{hito.description}</p>
        <HitoCta hito={hito} onOpenVideo={onOpenVideo} ctaLabel={ctaLabel} />
      </div>
      <div className="slide-hero-hito__image">
        <div className="img-frame" style={{ backgroundImage: `url(${hito.images[0]})` }} />
      </div>
    </div>
  );
}

function SplitSlide({ hito, onOpenVideo, ctaLabel }) {
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
        <HitoCta hito={hito} onOpenVideo={onOpenVideo} ctaLabel={ctaLabel} />
      </div>
    </div>
  );
}

function TripleSlide({ hito, onOpenVideo, ctaLabel }) {
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
      <div className="slide-triple__footer">
        <p className="slide-desc slide-desc--wide">{hito.description}</p>
        <HitoCta hito={hito} onOpenVideo={onOpenVideo} ctaLabel={ctaLabel} />
      </div>
    </div>
  );
}

function FullSlide({ hito, onOpenVideo, ctaLabel }) {
  return (
    <div className="slide-full">
      <div className="slide-full__image">
        <div className="img-frame" style={{ backgroundImage: `url(${hito.images[0]})` }} />
      </div>
      <div className="slide-full__text">
        <p className="slide-label">{hito.label} — {hito.year}</p>
        <h2 className="slide-title">{hito.event}</h2>
        <p className="slide-desc">{hito.description}</p>
        <HitoCta hito={hito} onOpenVideo={onOpenVideo} ctaLabel={ctaLabel} />
      </div>
    </div>
  );
}
