import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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
    svg: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
      </svg>
    ),
  },
  {
    id: 'apple',
    href: 'https://podcasts.apple.com/mx/podcast/somos-ra%C3%ADces/id1870408908',
    label: 'Apple Podcasts',
    svg: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M5.34 0A5.328 5.328 0 000 5.34v13.32A5.328 5.328 0 005.34 24h13.32A5.328 5.328 0 0024 18.66V5.34A5.328 5.328 0 0018.66 0H5.34zm6.525 2.568c2.336 0 4.448.902 6.056 2.587 1.076 1.126 1.72 2.376 1.996 3.441l.013.053-.652.21c-.551-1.89-1.784-3.517-3.476-4.575a8.386 8.386 0 00-3.93-1.147 8.386 8.386 0 00-5.27 1.7c-1.577 1.2-2.623 2.923-3.026 4.96l-.648-.15c.5-2.306 1.69-4.182 3.458-5.5A9.024 9.024 0 0111.865 2.57zm.012 3.07c3.477 0 6.335 2.684 6.57 6.09.085 1.232-.14 2.39-.633 3.442-.4.854-.96 1.56-1.592 2.118.008-.227.002-.46-.025-.693a5.132 5.132 0 00-1.097-2.703 5.024 5.024 0 00-1.918-1.528 5.025 5.025 0 00-2.386-.45c-.83.045-1.59.296-2.268.707a5.024 5.024 0 00-1.657 1.65 5.128 5.128 0 00-.82 2.792c-.016.233-.013.464.004.69-.66-.57-1.24-1.298-1.65-2.18-.495-1.06-.726-2.231-.644-3.468.236-3.408 3.094-6.09 6.57-6.09h.546zm-.262 5.263c.656 0 1.288.18 1.83.52.544.34.977.83 1.253 1.42.275.59.37 1.241.275 1.879a3.588 3.588 0 01-.773 1.713 3.606 3.606 0 01-1.508 1.07l-.278 3.075a.923.923 0 01-.92.853h-1.074a.923.923 0 01-.92-.853l-.278-3.09a3.595 3.595 0 01-1.479-1.073 3.586 3.586 0 01-.76-1.7 3.589 3.589 0 01.287-1.88 3.59 3.59 0 011.268-1.414 3.618 3.618 0 011.835-.52h1.042z" />
      </svg>
    ),
  },
  {
    id: 'youtube',
    href: 'https://www.youtube.com/playlist?list=PLddyk4m2Zu_PBXSGz-HJ37aUMa0kwG3bY',
    label: 'YouTube',
    svg: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.43z" />
        <polygon points="9.75,15.02 15.5,11.75 9.75,8.48" fill="#101511" />
      </svg>
    ),
  },
  {
    id: 'whatsapp',
    href: 'https://whatsapp.com/channel/0029Vb7HsgN3mFXwkZzeW71V',
    label: 'WhatsApp',
    svg: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.96 9.96 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" />
      </svg>
    ),
  },
];

export default function Ceiba() {
  const rootRef = useRef(null);

  useEffect(() => {
    if (!rootRef.current) return;

    const ctx = gsap.context(() => {
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

    return () => ctx.revert();
  }, []);

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
          <img src="/assets/CEIBA/lina-subject.png" alt="Speaker CEIBA" className="ceiba-subject" />
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
              Nuevas economías se esss están tejiendo desde las selvas, costas, ecosistemas y comunidades juntos hicimos esas visiones realidad.
            </p>
            <a href="https://www.youtube.com/watch?v=gFI3zUEc1fo" target="_blank" rel="noreferrer" className="btn-glass">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="5,3 19,12 5,21" /></svg>
              Ver Recap 2025
            </a>
          </div>

          <div className="ceiba-bottom-right">
            <div className="hero-scroll-indicator">
              <span>DESLIZAR</span>
              <svg width="16" height="24" viewBox="0 0 16 24" fill="none" stroke="#C8E632" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 4L8 20M8 20L2 14M8 20L14 14" /></svg>
            </div>
          </div>
        </div>
      </section>

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
                {link.svg}
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
