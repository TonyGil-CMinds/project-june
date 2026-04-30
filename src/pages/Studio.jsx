import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/studio.css';

gsap.registerPlugin(ScrollTrigger);

const portfolioImages = Array.from({ length: 9 }, (_, i) => ({
  src: `/assets/Studio/portafolio/proyect-img-${i + 1}.png`,
  title: `Proyecto ${i + 1}`,
}));

const portfolioColumns = [
  [portfolioImages[0], portfolioImages[3], portfolioImages[6]],
  [portfolioImages[1], portfolioImages[4], portfolioImages[7]],
  [portfolioImages[2], portfolioImages[5], portfolioImages[8]],
];

const mobileLeftImages = [
  portfolioImages[4],
  portfolioImages[3],
  portfolioImages[6],
  portfolioImages[0],
];

const mobileRightImages = [
  portfolioImages[1],
  portfolioImages[7],
  portfolioImages[2],
  portfolioImages[5],
  portfolioImages[8],
];

const mobileLeftContent = [
  mobileLeftImages[0],
  mobileLeftImages[1],
  'copy',
  mobileLeftImages[2],
  mobileLeftImages[3],
];

function StudioPortfolioCard({ image }) {
  return (
    <button className="studio-portfolio-card" type="button" aria-label={`Aprende más sobre ${image.title}`}>
      <img src={image.src} alt={image.title} loading="lazy" />
      <span>Aprende más</span>
    </button>
  );
}

function StudioPortfolioText() {
  return (
    <div className="studio-portfolio-copy">
      <div className="studio-portfolio-stats" aria-label="Impacto del portafolio">
        <p>10 países de Latam</p>
        <p>14 proyectos incubados</p>
        <p>30% impacto en comunidades afro</p>
        <p>50% tecnologías DMRV</p>
      </div>
      <h2>Portafolio de Soluciones</h2>
    </div>
  );
}

export default function Studio() {
  const rootRef = useRef(null);
  const [portfolioOpen, setPortfolioOpen] = useState(false);

  const runCoverTransition = (onCovered) => {
    window.dispatchEvent(
      new CustomEvent('natura:cover-transition', {
        detail: { onCovered },
      })
    );
  };

  const openPortfolio = (event) => {
    event.preventDefault();
    runCoverTransition(() => setPortfolioOpen(true));
  };

  const closePortfolio = () => {
    runCoverTransition(() => setPortfolioOpen(false));
  };

  useEffect(() => {
    if (!rootRef.current || portfolioOpen) return undefined;

    const ctx = gsap.context(() => {
      gsap.to('.studio-bg', {
        yPercent: 12,
        ease: 'none',
        scrollTrigger: { trigger: '.studio-hero', start: 'top bottom', end: 'bottom top', scrub: 0.8 },
      });
      gsap.to('.studio-subject', {
        yPercent: 18,
        scale: 1.03,
        ease: 'none',
        scrollTrigger: { trigger: '.studio-hero', start: 'top bottom', end: 'bottom top', scrub: 0.6 },
      });

      gsap.from('.studio-content-inner', {
        y: 60,
        opacity: 0,
        duration: 1.2,
        delay: 0.15,
        ease: 'power3.out',
      });

      document.querySelectorAll('.studio-letter').forEach((letter, i) => {
        const speed = parseFloat(letter.dataset.speed) || 1;
        gsap.fromTo(
          letter,
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

      gsap.from('.studio-main-image', {
        scale: 0.9,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.studio-main-content', start: 'top 75%', toggleActions: 'play none none reverse' },
      });

      gsap.from('.studio-main-text', {
        y: 40,
        opacity: 0,
        duration: 0.9,
        delay: 0.15,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.studio-main-content', start: 'top 72%', toggleActions: 'play none none reverse' },
      });

      document.querySelectorAll('.studio-info-card').forEach((el, i) => {
        gsap.from(el, {
          y: 40,
          opacity: 0,
          duration: 0.7,
          delay: i * 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.studio-info-section', start: 'top 80%', toggleActions: 'play none none reverse' },
        });
      });
    }, rootRef);

    return () => ctx.revert();
  }, [portfolioOpen]);

  useEffect(() => {
    document.documentElement.classList.toggle('studio-portfolio-open', portfolioOpen);

    if (!portfolioOpen || !rootRef.current) {
      return () => document.documentElement.classList.remove('studio-portfolio-open');
    }

    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      gsap.from('.studio-portfolio-back', {
        y: -18,
        opacity: 0,
        duration: 0.55,
        ease: 'power3.out',
      });

      gsap.from('.studio-portfolio-copy', {
        y: 28,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
      });

      if (reduceMotion) return;

      let activeLoop;

      const setupColumns = (selector) => {
        const columns = gsap.utils.toArray(selector);
        const setters = columns.map((column) => gsap.quickSetter(column, 'y', 'px'));
        const cycleHeights = columns.map((column) => column.scrollHeight / 3);
        const baseOffsets = columns.map((_, index) => -cycleHeights[index] * [0.18, 0.54, 0.34][index % 3]);
        const directions = columns.map((column) => Number(column.dataset.direction || -1));
        let current = 0;
        let target = 0;
        let touchY = null;

        const render = () => {
          current += (target - current) * 0.095;
          columns.forEach((column, index) => {
            const cycle = cycleHeights[index] || 1;
            const rawY = baseOffsets[index] + directions[index] * current;
            setters[index](gsap.utils.wrap(-cycle * 2, 0, rawY));
          });
        };

        const addDelta = (delta) => {
          target += delta * 0.92;
        };

        const handleWheel = (event) => {
          event.preventDefault();
          addDelta(event.deltaY);
        };

        const handleTouchStart = (event) => {
          touchY = event.touches[0]?.clientY ?? null;
        };

        const handleTouchMove = (event) => {
          if (touchY === null) return;
          event.preventDefault();
          const nextY = event.touches[0]?.clientY ?? touchY;
          addDelta(touchY - nextY);
          touchY = nextY;
        };

        const handleTouchEnd = () => {
          touchY = null;
        };

        window.addEventListener('wheel', handleWheel, { passive: false });
        window.addEventListener('touchstart', handleTouchStart, { passive: true });
        window.addEventListener('touchmove', handleTouchMove, { passive: false });
        window.addEventListener('touchend', handleTouchEnd, { passive: true });
        gsap.ticker.add(render);
        render();

        activeLoop = () => {
          gsap.ticker.remove(render);
          window.removeEventListener('wheel', handleWheel);
          window.removeEventListener('touchstart', handleTouchStart);
          window.removeEventListener('touchmove', handleTouchMove);
          window.removeEventListener('touchend', handleTouchEnd);
        };
      };

      ScrollTrigger.matchMedia({
        '(min-width: 769px)': () => {
          setupColumns('.studio-portfolio-column');
          return () => activeLoop?.();
        },
        '(max-width: 768px)': () => {
          setupColumns('.studio-portfolio-mobile-column');
          return () => activeLoop?.();
        },
      });
    }, rootRef);

    return () => {
      ctx.revert();
      document.documentElement.classList.remove('studio-portfolio-open');
    };
  }, [portfolioOpen]);

  if (portfolioOpen) {
    return (
      <div ref={rootRef} className="studio-portfolio-mode">
        <div className="studio-portfolio-scroll">
          <section className="studio-portfolio-section" id="portfolio" aria-label="Portafolio de soluciones">
            <button className="studio-portfolio-back" type="button" onClick={closePortfolio} aria-label="Regresar a Studio">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M15 6L9 12L15 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Regresar
            </button>

            <div className="studio-portfolio-left">
              <StudioPortfolioText />
            </div>

            <div className="studio-portfolio-desktop-grid">
              {portfolioColumns.map((column, index) => (
                <div
                  className="studio-portfolio-column"
                  data-direction={index === 1 ? 1 : -1}
                  key={index}
                >
                  {[...column, ...column, ...column].map((image, imageIndex) => (
                    <StudioPortfolioCard image={image} key={`${image.src}-${imageIndex}`} />
                  ))}
                </div>
              ))}
            </div>

            <div className="studio-portfolio-mobile-grid">
              <div className="studio-portfolio-mobile-column" data-direction="-1">
                {[...mobileLeftContent, ...mobileLeftContent, ...mobileLeftContent].map((item, index) => (
                  item === 'copy'
                    ? <StudioPortfolioText key={`copy-left-${index}`} />
                    : <StudioPortfolioCard image={item} key={`${item.src}-left-${index}`} />
                ))}
              </div>
              <div className="studio-portfolio-mobile-column" data-direction="1">
                {[...mobileRightImages, ...mobileRightImages, ...mobileRightImages].map((image, index) => (
                  <StudioPortfolioCard image={image} key={`${image.src}-right-${index}`} />
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div ref={rootRef}>
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
          <div className="studio-subject-anchor">
            <img src="/assets/Studio/subject-studio.png" alt="Studio Subject" className="studio-subject" />
          </div>
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
              <span className="studio-heading-line studio-heading-accent"><span className="amp">&amp;</span> Demuestra</span>
            </h1>
            <p className="studio-description">
              Acompa&ntilde;amos a 14 proyectos que est&aacute;n demostrando c&oacute;mo el nexo entre tecnolog&iacute;a con prop&oacute;sito y sabidur&iacute;a ancestral echa ra&iacute;ces.
            </p>
            <a href="#portfolio" className="btn-glass hero-cta-button" onClick={openPortfolio}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2.5L14.58 9.42L21.5 12L14.58 14.58L12 21.5L9.42 14.58L2.5 12L9.42 9.42L12 2.5Z" />
              </svg>
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
