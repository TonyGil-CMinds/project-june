'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cleanupGsapRoute } from '../utils/cleanupGsapRoute.js';

gsap.registerPlugin(ScrollTrigger);

/* Gallery images */
const galleryImages = [
  '/assets/CEIBA/galeria-ceiba-1.webp',
  '/assets/CEIBA/galeria-ceiba-2.webp',
  '/assets/CEIBA/galeria-ceiba-3.webp',
  '/assets/CEIBA/galeria-ceiba-4.webp',
];

/* Shape divider assets */
const shapes = [
  '/assets/CEIBA/ceiba-shape-1.webp',
  '/assets/CEIBA/ceiba-shape-2.webp',
  '/assets/CEIBA/ceiba-shape-3.webp',
  '/assets/CEIBA/ceiba-shape-4.webp',
];

/* Persona photos for podcast section */
const personas = [
  '/assets/CEIBA/ceiba-persona-1.webp',
  '/assets/CEIBA/ceiba-persona-2.webp',
  '/assets/CEIBA/ceiba-persona-3.webp',
  '/assets/CEIBA/ceiba-persona-4.webp',
];

/* Social links for podcast */
const podcastLinks = [
  {
    id: 'spotify',
    href: 'https://open.spotify.com/show/4CVU6cnk89BtO08F7ZTPnK?si=2f081a70f42f4299&nd=1&dlsi=d05cf5074bd24ec0',
    label: 'Spotify',
    icon: '/assets/CEIBA/icons/social/sp-icon.svg',
  },
  {
    id: 'apple',
    href: 'https://podcasts.apple.com/mx/podcast/somos-ra%C3%ADces/id1870408908',
    label: 'Apple Podcasts',
    icon: '/assets/CEIBA/icons/social/ap-icon.svg',
  },
  {
    id: 'youtube',
    href: 'https://www.youtube.com/playlist?list=PLddyk4m2Zu_PBXSGz-HJ37aUMa0kwG3bY',
    label: 'YouTube',
    icon: '/assets/CEIBA/icons/social/yt-icon.svg',
  },
  {
    id: 'whatsapp',
    href: 'https://whatsapp.com/channel/0029Vb7HsgN3mFXwkZzeW71V',
    label: 'WhatsApp',
    icon: '/assets/CEIBA/icons/social/wp-icon.svg',
  },
];

export default function Ceiba() {
  const rootRef = useRef(null);
  const recapCtaRef = useRef(null);
  const videoOverlayRef = useRef(null);
  const videoPanelRef = useRef(null);
  const videoFrameRef = useRef(null);
  const videoOriginRef = useRef(null);
  const [videoMounted, setVideoMounted] = useState(false);
  const [videoClosing, setVideoClosing] = useState(false);

  useEffect(() => {
    if (!rootRef.current) return;

    const ctx = gsap.context(() => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (!reduceMotion) {
        gsap.fromTo(
          '.ceiba-subject-anchor',
          { '--subject-anchor-scale': 1.08 },
          { '--subject-anchor-scale': 1, duration: 1.4, ease: 'power3.out' }
        );
      }

      /* ─── HERO parallax ─── */
      gsap.to('.ceiba-bg', {
        yPercent: 12, ease: 'none',
        scrollTrigger: { trigger: '.ceiba-hero', start: 'top bottom', end: 'bottom top', scrub: 0.8 },
      });
      gsap.to('.ceiba-subject', {
        yPercent: 18, scale: 1.03, ease: 'none',
        scrollTrigger: { trigger: '.ceiba-hero', start: 'top bottom', end: 'bottom top', scrub: 0.6 },
      });

      /* Hero entrance */
      gsap.from('.ceiba-content-inner', {
        y: 60,
        opacity: 0,
        duration: 1.2,
        delay: 0.15,
        ease: 'power3.out',
      });

      document.querySelectorAll('.ceiba-letter').forEach((letter, i) => {
        const speed = parseFloat(letter.dataset.speed) || 1;
        gsap.fromTo(letter,
          { y: 80 * speed, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            delay: 0.08 + i * 0.04,
            ease: 'power3.out',
          }
        );
      });

      /* ─── INFINITE GALLERY (marquee) ─── */
      const track = document.querySelector('.ceiba-gallery-track');
      if (track) {
        const totalWidth = track.scrollWidth / 2; // half because we doubled them
        gsap.to(track, {
          x: -totalWidth,
          ease: 'none',
          duration: 30,
          repeat: -1,
          modifiers: {
            x: gsap.utils.unitize(x => parseFloat(x) % totalWidth),
          },
        });
      }

      /* ─── GALLERY parallax (slight rise as you scroll past) ─── */
      gsap.fromTo('.ceiba-gallery-parallax',
        { y: 60 },
        {
          y: -40, ease: 'none',
          scrollTrigger: { trigger: '.ceiba-gallery', start: 'top bottom', end: 'bottom top', scrub: 0.6 },
        }
      );

      /* ─── INFO SECTION ─── */
      gsap.from('.ceiba-info-logo', {
        scale: 0.6, opacity: 0, duration: 0.9, ease: 'back.out(1.5)',
        scrollTrigger: { trigger: '.ceiba-info', start: 'top 78%', toggleActions: 'play none none reverse' },
      });
      gsap.from('.ceiba-info-sub', {
        y: 24, opacity: 0, duration: 0.8, delay: 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: '.ceiba-info', start: 'top 75%', toggleActions: 'play none none reverse' },
      });
      gsap.from('.ceiba-info-divider', {
        scaleX: 0, transformOrigin: 'center', opacity: 0, duration: 0.9, delay: 0.25, ease: 'power3.out',
        scrollTrigger: { trigger: '.ceiba-info', start: 'top 75%', toggleActions: 'play none none reverse' },
      });
      gsap.from('.ceiba-info-text', {
        y: 40, opacity: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: '.ceiba-info', start: 'top 70%', toggleActions: 'play none none reverse' },
      });
      gsap.from('.ceiba-info-btn', {
        y: 20, opacity: 0, duration: 0.7, delay: 0.2, ease: 'power3.out',
        scrollTrigger: { trigger: '.ceiba-info', start: 'top 65%', toggleActions: 'play none none reverse' },
      });
      /* Slow parallax drift on the info logo for life */
      gsap.to('.ceiba-info-logo', {
        y: -30, ease: 'none',
        scrollTrigger: { trigger: '.ceiba-info', start: 'top bottom', end: 'bottom top', scrub: 1 },
      });

      /* ─── SHAPES parallax ─── */
      document.querySelectorAll('.ceiba-shape-item').forEach((el, i) => {
        gsap.from(el, {
          y: 40 + i * 15, opacity: 0, duration: 0.8, delay: i * 0.1, ease: 'power2.out',
          scrollTrigger: { trigger: '.ceiba-shapes', start: 'top 85%', toggleActions: 'play none none reverse' },
        });
        /* Continuous gentle parallax — different speeds per shape */
        gsap.to(el, {
          y: (i % 2 === 0 ? -30 : -55), ease: 'none',
          scrollTrigger: { trigger: '.ceiba-shapes', start: 'top bottom', end: 'bottom top', scrub: 1 + i * 0.15 },
        });
      });

      /* ─── PODCAST SECTION ─── */
      // Personas entrance
      document.querySelectorAll('.ceiba-persona-wrap').forEach((el, i) => {
        gsap.to(el, {
          scale: 1, rotate: 0, opacity: 1,
          duration: 0.6, delay: i * 0.08, ease: 'back.out(1.5)',
          scrollTrigger: { trigger: '.ceiba-podcast', start: 'top 85%', toggleActions: 'play none none none' },
        });
        // Bob parallax — continuous
        const dir = i % 2 === 0 ? -1 : 1;
        gsap.to(el, {
          y: 24 * dir, ease: 'none',
          scrollTrigger: { trigger: '.ceiba-podcast', start: 'top bottom', end: 'bottom top', scrub: 1 + i * 0.15 },
        });
      });

      gsap.to('.ceiba-podcast-title', {
        y: 0, opacity: 1, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: '.ceiba-podcast', start: 'top 85%', toggleActions: 'play none none none' },
      });

      gsap.to('.ceiba-podcast-desc', {
        y: 0, opacity: 1, duration: 0.7, delay: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: '.ceiba-podcast', start: 'top 82%', toggleActions: 'play none none none' },
      });

      gsap.to('.ceiba-social-btn', {
        y: 0, opacity: 1, stagger: 0.06, duration: 0.5, ease: 'power3.out',
        scrollTrigger: { trigger: '.ceiba-podcast', start: 'top 80%', toggleActions: 'play none none none' },
      });

      /* Background glow subtle drift */
      gsap.to('.ceiba-podcast-glow', {
        xPercent: 8, yPercent: -6, ease: 'none',
        scrollTrigger: { trigger: '.ceiba-podcast', start: 'top bottom', end: 'bottom top', scrub: 1.5 },
      });
    }, rootRef);

    return () => {
      cleanupGsapRoute(rootRef.current);
      ctx.revert();
    };
  }, []);

  useEffect(() => {
    if (!videoMounted) return undefined;

    const overlay = videoOverlayRef.current;
    const panel = videoPanelRef.current;
    const frame = videoFrameRef.current;
    const origin = videoOriginRef.current || recapCtaRef.current?.getBoundingClientRect();
    if (!overlay || !panel || !origin) return undefined;

    const getTargetRect = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const isPortraitMobile = window.matchMedia('(max-width: 768px) and (orientation: portrait)').matches;

      if (!isPortraitMobile) {
        return { top: 0, left: 0, width: vw, height: vh, radius: 0 };
      }

      const gutter = 20;
      const maxWidth = vw - gutter * 2;
      const maxHeight = Math.min(vh - 128, maxWidth * 9 / 16);
      let width = Math.min(maxWidth, maxHeight * 16 / 9);
      let height = width * 9 / 16;

      if (height > maxHeight) {
        height = maxHeight;
        width = height * 16 / 9;
      }

      return {
        top: (vh - height) / 2,
        left: (vw - width) / 2,
        width,
        height,
        radius: 20,
      };
    };

    const target = getTargetRect();
    document.documentElement.classList.add('ceiba-video-is-open');

    gsap.set(overlay, { autoAlpha: 1 });
    gsap.set(panel, {
      top: origin.top,
      left: origin.left,
      width: origin.width,
      height: origin.height,
      borderRadius: 999,
    });
    gsap.set(frame, { autoAlpha: 0, scale: 1.04 });

    const tl = gsap.timeline({ defaults: { ease: 'power4.inOut' } });
    tl.fromTo(overlay, { backgroundColor: 'rgba(8, 11, 9, 0)' }, { backgroundColor: 'rgba(8, 11, 9, 0.82)', duration: 0.55 }, 0)
      .to(panel, {
        top: target.top,
        left: target.left,
        width: target.width,
        height: target.height,
        borderRadius: target.radius,
        duration: 0.86,
      }, 0)
      .to(frame, { autoAlpha: 1, scale: 1, duration: 0.34, ease: 'power2.out' }, 0.5);

    const onKeyDown = (event) => {
      if (event.key === 'Escape') closeRecapVideo();
    };
    const onResize = () => {
      const nextTarget = getTargetRect();
      gsap.to(panel, {
        top: nextTarget.top,
        left: nextTarget.left,
        width: nextTarget.width,
        height: nextTarget.height,
        borderRadius: nextTarget.radius,
        duration: 0.42,
        ease: 'power3.out',
      });
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', onResize);
    return () => {
      tl.kill();
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', onResize);
      document.documentElement.classList.remove('ceiba-video-is-open');
    };
  }, [videoMounted]);

  const openRecapVideo = (event) => {
    event.preventDefault();
    if (videoMounted) return;
    videoOriginRef.current = recapCtaRef.current?.getBoundingClientRect();
    setVideoClosing(false);
    setVideoMounted(true);
  };

  const closeRecapVideo = () => {
    if (!videoMounted || videoClosing) return;

    const overlay = videoOverlayRef.current;
    const panel = videoPanelRef.current;
    const frame = videoFrameRef.current;
    const origin = videoOriginRef.current || recapCtaRef.current?.getBoundingClientRect();

    if (!overlay || !panel || !origin) {
      setVideoMounted(false);
      return;
    }

    setVideoClosing(true);

    gsap.timeline({
      defaults: { ease: 'power3.inOut' },
      onComplete: () => {
        setVideoMounted(false);
        setVideoClosing(false);
      },
    })
      .to(frame, { autoAlpha: 0, scale: 1.02, duration: 0.22, ease: 'power2.out' }, 0)
      .to(panel, {
        top: origin.top,
        left: origin.left,
        width: origin.width,
        height: origin.height,
        borderRadius: 999,
        duration: 0.62,
      }, 0)
      .to(overlay, { backgroundColor: 'rgba(8, 11, 9, 0)', duration: 0.5 }, 0.08);
  };

  return (
    <div ref={rootRef}>
      {/* ════════════ HERO ════════════ */}
      <section className="ceiba-hero">
        <div className="ceiba-bg-wrapper">
          <img src="/assets/CEIBA/bg-ceiba.webp" alt="" className="ceiba-bg" />
        </div>

        <div className="ceiba-giant-text" aria-hidden="true">
          {['C', 'O', 'N', 'E', 'C', 'T', 'A'].map((ch, i) => (
            <span key={i} className="giant-letter ceiba-letter" data-speed={[0.7, 0.9, 1.1, 0.8, 1.0, 0.85, 1.15, 0.95][i]}>{ch}</span>
          ))}
        </div>

        <div className="ceiba-subject-wrapper">
          <div className="ceiba-subject-anchor">
            <img src="/assets/CEIBA/lina-subject.png" alt="Speaker CEIBA" className="ceiba-subject" />
          </div>
        </div>

        <div className="ceiba-overlay" aria-hidden="true" />

        <div className="ceiba-content">
          <div className="ceiba-content-inner">
            <div className="ceiba-header-label">
              <img src="/assets/CEIBA/ceiba-icon.svg" alt="" width="22" height="22" />
              CEIBA
            </div>
            <h1 className="ceiba-heading">
              <span className="ceiba-heading-line">Comparte</span>
              <span className="ceiba-heading-line ceiba-heading-accent"><span className="amp">&amp;</span> Co-Crea</span>
            </h1>
            <p className="ceiba-description">
              <span className="ceiba-mobile-line">Accede a herramientas de IA, conecta con</span>{' '}
              <span className="ceiba-mobile-line">nuevas oportunidades de financiamiento y</span>{' '}
              <span className="ceiba-mobile-line">sé parte de una red global.</span>
            </p>
            <a
              href="https://www.youtube.com/watch?v=gFI3zUEc1fo"
              ref={recapCtaRef}
              onClick={openRecapVideo}
              className="btn-glass hero-cta-button"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" /></svg>
              Ver Recap de 2025
            </a>
          </div>

          <div className="ceiba-bottom-center">
            <div className="hero-scroll-indicator">
              <span>DESLIZAR</span>
              <svg width="16" height="24" viewBox="0 0 16 24" fill="none" stroke="#C8E632" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 4L8 20M8 20L2 14M8 20L14 14" /></svg>
            </div>
          </div>
        </div>
      </section>

      {videoMounted && (
        <div
          className="ceiba-video-overlay"
          ref={videoOverlayRef}
          role="dialog"
          aria-modal="true"
          aria-label="Video recap de CEIBA 2025"
          onClick={closeRecapVideo}
        >
          <div className="ceiba-video-panel" ref={videoPanelRef} onClick={(event) => event.stopPropagation()}>
            <iframe
              ref={videoFrameRef}
              className="ceiba-video-frame"
              src="https://www.youtube.com/embed/gFI3zUEc1fo?autoplay=1&rel=0&playsinline=1"
              title="CEIBA 2025 recap"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
            <button className="ceiba-video-close" type="button" onClick={closeRecapVideo} aria-label="Cerrar video">
              <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* ════════════ INFINITE GALLERY CAROUSEL ════════════ */}
      <section className="ceiba-gallery">
        <div className="ceiba-gallery-parallax">
          <div className="ceiba-gallery-track">
            {/* Double the images for seamless loop */}
            {[...galleryImages, ...galleryImages].map((src, i) => (
              <div key={i} className="ceiba-gallery-item">
                <img src={src} alt={`Galería CEIBA ${(i % galleryImages.length) + 1}`} loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ INFO / SUMMIT SECTION ════════════ */}
      <section className="ceiba-info">
        <div className="ceiba-info-inner">
          <div className="ceiba-info-logo">
            <img src="/assets/programs-logos/ceiba.svg" alt="CEIBA — Cumbre de Innovación e Inversión para la Biodiversidad" />
          </div>
          <p className="ceiba-info-sub">
            CUMBRE DE INNOVACIÓN E INVERSIÓN PARA LA BIODIVERSIDAD<br />& ECONOMÍAS FUTURAS
          </p>
          <div className="ceiba-info-divider" />
          <div className="ceiba-info-text">
            <p>
              Una convergencia global de pensadores y practicantes de frontera, líderes en Territorio, arquitectos de tecnologías para la naturaleza y modelos de negocio regenerativos. Es un laboratorio vivo de las economías futuras, enraizadas en inteligencia biocultural.
            </p>
          </div>
          <a href="https://www.biodiversityweek.com/reporteceiba" target="_blank" rel="noreferrer" className="btn-glass ceiba-info-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="5,3 19,12 5,21" /></svg>
            Revive CEIBA 2025
          </a>
        </div>
      </section>

      {/* ════════════ SHAPE DIVIDER ════════════ */}
      <section className="ceiba-shapes">
        <div className="ceiba-shapes-track">
          {shapes.map((src, i) => (
            <div key={i} className="ceiba-shape-item">
              <img src={src} alt="" loading="lazy" />
            </div>
          ))}
        </div>
      </section>

      {/* ════════════ PODCAST — SOMOS RAÍCES ════════════ */}
      <section className="ceiba-podcast">
        <div className="ceiba-podcast-glow" aria-hidden="true" />
        <div className="ceiba-podcast-inner">
          <div className="ceiba-podcast-personas">
            {personas.map((src, i) => (
              <div key={i} className="ceiba-persona-wrap" data-i={i}>
                <img src={src} alt={`Voz Somos Raíces ${i + 1}`} className="ceiba-persona" loading="lazy" />
              </div>
            ))}
          </div>

          <h2 className="ceiba-podcast-title">
            <img src="/assets/CEIBA/somosraices.svg" alt="Somos Raíces" />
          </h2>
          <p className="ceiba-podcast-desc">
            Escucha nuestro podcast oficial,<br />historias que nacen desde los<br />territorios.
          </p>

          <div className="ceiba-podcast-socials">
            {podcastLinks.map((link) => (
              <a key={link.id} href={link.href} target="_blank" rel="noreferrer" aria-label={link.label} className="ceiba-social-btn">
                <img src={link.icon} alt="" width="26" height="26" loading="lazy" />
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
