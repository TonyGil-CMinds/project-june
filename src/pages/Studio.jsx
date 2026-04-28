import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* Gallery images */
const galleryImages = [
  '/assets/Studio/studio-gallery-1.webp',
  '/assets/Studio/studio-gallery-2.webp',
  '/assets/Studio/studio-gallery-3.webp',
  '/assets/Studio/studio-gallery-4.webp',
  '/assets/Studio/studio-gallery-5.webp',
];

export default function Studio() {
  const rootRef = useRef(null);

  useEffect(() => {
    if (!rootRef.current) return;

    const ctx = gsap.context(() => {
      /* ─── HERO parallax ─── */
      gsap.to('.studio-bg', {
        yPercent: 12, ease: 'none',
        scrollTrigger: { trigger: '.studio-hero', start: 'top bottom', end: 'bottom top', scrub: 0.8 },
      });
      gsap.to('.studio-subject', {
        yPercent: 18, scale: 1.03, ease: 'none',
        scrollTrigger: { trigger: '.studio-hero', start: 'top bottom', end: 'bottom top', scrub: 0.6 },
      });

      /* Hero entrance */
      gsap.from('.studio-content-inner', {
        y: 60,
        opacity: 0,
        duration: 1.2,
        delay: 0.15,
        ease: 'power3.out',
      });

      document.querySelectorAll('.studio-letter').forEach((letter, i) => {
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

      /* ─── GALLERY parallax ─── */
      gsap.fromTo('.studio-gallery',
        { y: 60 },
        {
          y: -40, ease: 'none',
          scrollTrigger: { trigger: '.studio-gallery', start: 'top bottom', end: 'bottom top', scrub: 0.6 },
        }
      );

      /* Gallery items stagger in */
      document.querySelectorAll('.studio-gallery-item').forEach((el, i) => {
        gsap.from(el, {
          y: 40, opacity: 0, duration: 0.7, delay: i * 0.1, ease: 'power2.out',
          scrollTrigger: { trigger: '.studio-gallery', start: 'top 80%', toggleActions: 'play none none reverse' },
        });
      });

      /* Stats reveal */
      document.querySelectorAll('.studio-stat').forEach((el, i) => {
        gsap.from(el, {
          y: 30, opacity: 0, duration: 0.6, delay: i * 0.08, ease: 'power3.out',
          scrollTrigger: { trigger: '.studio-stats', start: 'top 85%', toggleActions: 'play none none reverse' },
        });
      });

      /* Main content section */
      gsap.from('.studio-main-image', {
        scale: 0.9, opacity: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: '.studio-main-content', start: 'top 75%', toggleActions: 'play none none reverse' },
      });

      gsap.from('.studio-main-text', {
        y: 40, opacity: 0, duration: 0.9, delay: 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: '.studio-main-content', start: 'top 72%', toggleActions: 'play none none reverse' },
      });

      /* Info cards */
      document.querySelectorAll('.studio-info-card').forEach((el, i) => {
        gsap.from(el, {
          y: 40, opacity: 0, duration: 0.7, delay: i * 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: '.studio-info-section', start: 'top 80%', toggleActions: 'play none none reverse' },
        });
      });

    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef}>
      {/* ════════════ HERO ════════════ */}
      <section className="studio-hero">
        <div className="studio-bg-wrapper">
          <img src="/assets/Studio/bg-studio.webp" alt="" className="studio-bg" />
        </div>

        <div className="studio-giant-text" aria-hidden="true">
          {['E', 'S', 'C', 'A', 'L', 'A'].map((ch, i) => (
            <span key={i} className="giant-letter studio-letter" data-speed={[0.7, 0.9, 1.1, 0.8, 1.0, 0.85][i]}>{ch}</span>
          ))}
        </div>

        <div className="studio-subject-wrapper">
          <img src="/assets/Studio/subject-studio.png" alt="Studio Subject" className="studio-subject" />
        </div>

        <div className="studio-overlay" aria-hidden="true" />

        <div className="studio-content">
          <div className="studio-content-inner">
            <div className="studio-header-label">
              <img src="/assets/Studio/studio-icon.svg" alt="" width="22" height="22" />
              STUDIO
            </div>
            <h1 className="studio-heading">
              <span className="studio-heading-line">Acciona</span>
              <span className="studio-heading-line studio-heading-accent"><span className="amp">&amp;</span> Co-crea</span>
            </h1>
            <p className="studio-description">
              Acompañamos a empresas que validan, demuestran cómo hacer negocios con empresarios y solucionadores desde los territorios.
            </p>
            <a href="#portfolio" className="btn-glass hero-cta-button">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="5,3 19,12 5,21" /></svg>
              Ver Portafolio
            </a>
          </div>

          <div className="studio-bottom-center">
            <div className="hero-scroll-indicator">
              <span>DESLIZAR</span>
              <svg width="16" height="24" viewBox="0 0 16 24" fill="none" stroke="#C8E632" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 4L8 20M8 20L2 14M8 20L14 14" /></svg>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════ GALLERY & PORTFOLIO ════════════ */}
      <section className="studio-gallery" id="portfolio">
        <div className="studio-gallery-header">
          <h2>Portafolio de Soluciones</h2>
        </div>

        <div className="studio-gallery-grid">
          {galleryImages.map((src, i) => (
            <div key={i} className="studio-gallery-item">
              <img src={src} alt={`Proyecto ${i + 1}`} loading="lazy" />
            </div>
          ))}
        </div>

        <div className="studio-stats">
          <div className="studio-stat">
            <p className="stat-number">10</p>
            <p className="stat-label">Países de Latam</p>
          </div>
          <div className="studio-stat">
            <p className="stat-number">14</p>
            <p className="stat-label">Proyectos Incubados</p>
          </div>
          <div className="studio-stat">
            <p className="stat-number">86%</p>
            <p className="stat-label">Impacto en Comunidades Afro</p>
          </div>
          <div className="studio-stat">
            <p className="stat-number">90%</p>
            <p className="stat-label">Tecnologías AAMIR</p>
          </div>
        </div>
      </section>

      {/* ════════════ MAIN CONTENT ════════════ */}
      <section className="studio-main-content">
        <div className="studio-main-inner">
          <div className="studio-main-image">
            <img src="/assets/Studio/studio-gallery-1.webp" alt="Studio Work" />
          </div>
          <div className="studio-main-text">
            <h3>Un Portafolio de Lenguaje Común entre (Teknologías)</h3>
            <p>
              Experiencias de desarrolladores y ordenamos soluciones en territorio haciendo de nuestras socios con base en el territorio y de nuestros socios emprendedores.
            </p>
            <a href="#" className="link-arrow">
              Leer más sobre la metodología
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="5 12 19 12M12 5l7 7-7 7"></polyline></svg>
            </a>
          </div>
        </div>
      </section>

      {/* ════════════ INFO SECTION ════════════ */}
      <section className="studio-info-section">
        <div className="studio-info-inner">
          <div className="studio-info-card">
            <h4>Metodología</h4>
            <p className="card-label">Tiene doble impacto</p>
            <p>Nos permite inculcar soluciones innovadoras y tangibles, crear kits de soluciones replicables para la naturaleza, bajo el liderazgo de nuestros socios con base en el territorio y caracterizadas con los mercados verdes globales.</p>
          </div>

          <div className="studio-info-card">
            <h4>Niveles Sistémicos</h4>
            <p className="card-label">La solución que proponen</p>
            <p>Actúan para movilizar soluciones innovadoras y tangibles, crear kits de soluciones replicables para la naturaleza, bajo el liderazgo de nuestros socios con base en el territorio y caracterizadas con los mercados verdes globales.</p>
          </div>

          <div className="studio-info-card">
            <h4>Impacto Local</h4>
            <p className="card-label">Genera un impacto tangible</p>
            <p>Genera un impacto tangible hacia en el número de hectáreas conservadas como en la mejora de las condiciones de vida de nuestros socios locales.</p>
          </div>
        </div>

        <div className="studio-levels">
          <h3>Tres Niveles de Acceso a Iniciativas Especiales</h3>
          <div className="studio-levels-grid">
            <div className="level-item">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2" />
                <path d="M16 10V16M16 16L12 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <p>Herramientas para generar confianza y potenciar el impacto</p>
            </div>
            <div className="level-item">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <rect x="6" y="6" width="20" height="20" stroke="currentColor" strokeWidth="2" />
                <path d="M12 16L14 18L20 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p>Capacidad de preparación y recursos</p>
            </div>
            <div className="level-item">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M16 4L21.18 11.58L29.33 12.33L23.33 17.65L24.76 26L16 22.13L7.24 26L8.67 17.65L2.67 12.33L10.82 11.58L16 4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
              </svg>
              <p>Capacidad de sostenibilidad</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
