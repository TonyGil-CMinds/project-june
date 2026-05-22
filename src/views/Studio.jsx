'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cleanupGsapRoute } from '../utils/cleanupGsapRoute.js';

gsap.registerPlugin(ScrollTrigger);

/* ── Project data ── */
const PROJECTS = [
  {
    id: '01',
    title: 'Amarakaeri',
    description: 'Organización indígena que gestiona la Reserva Comunal Amarakaeri en Perú, combinando tecnología y conocimiento ancestral para la vigilancia y control territorial.',
    url: 'https://eca-amarakaeri.org.pe/',
    region: 'Reserva Comunal Amarakaeri, Perú',
    img: '/assets/Studio/portafolio/proyect-img-1.avif',
    leaders: [
      { name: 'Carlos Tayori', avatar: 'https://i.pravatar.cc/60?img=11' },
      { name: 'Rosa Harakbut', avatar: 'https://i.pravatar.cc/60?img=45' },
      { name: 'Julio Wachiperi', avatar: 'https://i.pravatar.cc/60?img=13' },
    ],
  },
  {
    id: '02',
    title: 'Awake Travel',
    description: 'Empresa colombiana de turismo que promueve la conservación, restauración y uso sostenible de la biodiversidad, creando oportunidades económicas para comunidades rurales a través de su proyecto Red de Biomonitoreo Comunitario.',
    url: 'https://awake.travel/',
    region: 'Colombia',
    img: '/assets/Studio/portafolio/proyect-img-2.avif',
    leaders: [
      { name: 'Valentina Arango', avatar: 'https://i.pravatar.cc/60?img=47' },
      { name: 'Mateo Restrepo', avatar: 'https://i.pravatar.cc/60?img=15' },
    ],
  },
  {
    id: '03',
    title: 'Fablab Perú',
    description: 'Centro de innovación que implementa el proyecto REGEN para desarrollar bioeconomía amazónica utilizando tecnologías de Industria 4.0, en alianza con comunidades Asháninkas y el MIT.',
    url: 'https://www.fab.pe/',
    region: 'Amazonía peruana',
    img: '/assets/Studio/portafolio/proyect-img-3.avif',
    leaders: [
      { name: 'Ana Lucía Torres', avatar: 'https://i.pravatar.cc/60?img=49' },
      { name: 'Diego Cisneros', avatar: 'https://i.pravatar.cc/60?img=17' },
      { name: 'Milagros Quispe', avatar: 'https://i.pravatar.cc/60?img=51' },
    ],
  },
  {
    id: '04',
    title: 'Fundación Pachamama',
    description: 'Organización que trabaja en la conservación del jaguar y el desarrollo de créditos bioculturales para proteger ecosistemas y apoyar comunidades indígenas en Ecuador.',
    url: 'https://www.pachamama.org/',
    region: 'Ecuador',
    img: '/assets/Studio/portafolio/proyect-img-4.avif',
    leaders: [
      { name: 'Lorena Grefa', avatar: 'https://i.pravatar.cc/60?img=53' },
      { name: 'Pablo Varela', avatar: 'https://i.pravatar.cc/60?img=19' },
    ],
  },
  {
    id: '05',
    title: 'FundeMar',
    description: 'Fundación enfocada en la protección marina que implementa sistemas de monitoreo automatizado para mejorar la resiliencia de ecosistemas marinos en el Caribe.',
    url: 'https://www.fundemardr.org/',
    region: 'República Dominicana / Caribe',
    img: '/assets/Studio/portafolio/proyect-img-5.avif',
    leaders: [
      { name: 'Carmen Díaz', avatar: 'https://i.pravatar.cc/60?img=55' },
      { name: 'Rafael Oleo', avatar: 'https://i.pravatar.cc/60?img=21' },
      { name: 'Yolanda Pérez', avatar: 'https://i.pravatar.cc/60?img=57' },
    ],
  },
  {
    id: '06',
    title: 'Landprint',
    description: 'Empresa tecnológica que desarrolla un sistema dMRV de monitoreo, reporte y verificación descentralizado para la creación y gestión de activos ambientales digitales.',
    url: 'https://www.landprint.co/',
    region: 'Activos ambientales digitales',
    img: '/assets/Studio/portafolio/proyect-img-6.avif',
    leaders: [
      { name: 'Sebastián Mora', avatar: 'https://i.pravatar.cc/60?img=23' },
      { name: 'Isabella Ruiz', avatar: 'https://i.pravatar.cc/60?img=59' },
    ],
  },
  {
    id: '07',
    title: 'ManoCambiada',
    description: 'Organización comunitaria que lidera el proyecto TAC Nuquí, Territorio de Aprendizaje Comunitario, en el Pacífico colombiano, integrando tecnología con saberes ancestrales para el desarrollo sostenible.',
    url: 'https://manocambiada.org/',
    region: 'Nuquí, Pacífico colombiano',
    img: '/assets/Studio/portafolio/proyect-img-7.avif',
    leaders: [
      { name: 'Esperanza Palacios', avatar: 'https://i.pravatar.cc/60?img=61' },
      { name: 'Nelson Mosquera', avatar: 'https://i.pravatar.cc/60?img=25' },
      { name: 'Daniela Córdoba', avatar: 'https://i.pravatar.cc/60?img=63' },
    ],
  },
  {
    id: '08',
    title: 'Nativas & Ecohome',
    description: 'Organización dedicada a la restauración de bosques tropicales secos, implementando soluciones tecnológicas y biotecnológicas para la recuperación de ecosistemas degradados.',
    url: 'https://nativas.ar/',
    region: 'Argentina / Colombia',
    img: '/assets/Studio/portafolio/proyect-img-8.avif',
    leaders: [
      { name: 'Luciana Bertolini', avatar: 'https://i.pravatar.cc/60?img=65' },
      { name: 'Agustín Paz', avatar: 'https://i.pravatar.cc/60?img=27' },
    ],
  },
  {
    id: '09',
    title: 'Asmucacd – Paz y Flora',
    description: 'Iniciativa que apoya un modelo de conservación liderado por mujeres rurales para prevenir la deforestación en La Macarena, Colombia, a través de soluciones basadas en la naturaleza.',
    url: '#',
    region: 'La Macarena, Colombia',
    img: '/assets/Studio/portafolio/proyect-img-9.avif',
    leaders: [
      { name: 'María del Carmen', avatar: 'https://i.pravatar.cc/60?img=67' },
      { name: 'Luz Adriana García', avatar: 'https://i.pravatar.cc/60?img=69' },
      { name: 'Patricia Lozano', avatar: 'https://i.pravatar.cc/60?img=71' },
    ],
  },
  {
    id: '10',
    title: 'Savimbo',
    description: 'Savimbo desarrolla una metodología de créditos agroforestales que empodera a pequeños productores de café y cacao en la adopción de prácticas regenerativas, integra monitoreo comunitario de biodiversidad y canaliza pagos justos por servicios ecosistémicos, captura de carbono y créditos de biodiversidad.',
    url: 'https://savimbo.com/',
    region: 'Territorios agroforestales',
    img: '/assets/Studio/portafolio/proyect-img-1.avif',
    leaders: [
      { name: 'Camila Fonseca', avatar: 'https://i.pravatar.cc/60?img=32' },
      { name: 'Andrés Gómez', avatar: 'https://i.pravatar.cc/60?img=29' },
    ],
  },
  {
    id: '11',
    title: 'Understory',
    description: 'Fondo de inversión enfocado en proyectos de restauración de ecosistemas, actualmente trabajando en la recuperación de manglares utilizando tecnología Lidar para monitoreo y medición de impacto.',
    url: 'https://www.understory.fund/',
    region: 'Ecosistemas de manglar',
    img: '/assets/Studio/portafolio/proyect-img-2.avif',
    leaders: [
      { name: 'Sophie Leblanc', avatar: 'https://i.pravatar.cc/60?img=33' },
      { name: 'James Okafor', avatar: 'https://i.pravatar.cc/60?img=31' },
      { name: 'Renata Souza', avatar: 'https://i.pravatar.cc/60?img=35' },
    ],
  },
  {
    id: '12',
    title: 'Universidad de Manizales & Universidad de Antioquia',
    description: 'Instituciones académicas que lideran el proyecto SeaFlower Wise para la conservación marina y el desarrollo de créditos azules en la Reserva de Biósfera Seaflower.',
    url: 'https://umanizales.edu.co/',
    region: 'Reserva de Biósfera Seaflower',
    img: '/assets/Studio/portafolio/proyect-img-3.avif',
    leaders: [
      { name: 'Dr. Hernán Ospina', avatar: 'https://i.pravatar.cc/60?img=37' },
      { name: 'Dra. Claudia Vásquez', avatar: 'https://i.pravatar.cc/60?img=73' },
    ],
  },
  {
    id: '13',
    title: 'Yakum',
    description: 'ONG con sede en Ecuador que trabaja con comunidades indígenas como los Siekopai para regenerar bosques amazónicos, fortalecer la soberanía alimentaria y salvaguardar el patrimonio cultural. En colaboración con Regen Network, desarrolla proyectos de créditos bioculturales para proteger al jaguar y apoyar a la Nación Siekopai.',
    url: 'https://yakum.org/',
    region: 'Amazonía ecuatoriana',
    img: '/assets/Studio/portafolio/proyect-img-4.avif',
    leaders: [
      { name: 'Alianza Siekopai', avatar: 'https://i.pravatar.cc/60?img=39' },
      { name: 'Fernanda Rivadeneira', avatar: 'https://i.pravatar.cc/60?img=75' },
      { name: 'Tomás Grefa', avatar: 'https://i.pravatar.cc/60?img=41' },
    ],
  },
];

/* ── Portfolio grid setup (existing 9 images) ── */
const portfolioImages = PROJECTS.slice(0, 9).map((p, i) => ({
  src: p.img,
  title: p.title,
  projectIndex: i,
}));

const portfolioColumns = [
  [portfolioImages[0], portfolioImages[3], portfolioImages[6]],
  [portfolioImages[1], portfolioImages[4], portfolioImages[7]],
  [portfolioImages[2], portfolioImages[5], portfolioImages[8]],
];

const mobileLeftImages = [portfolioImages[4], portfolioImages[3], portfolioImages[6], portfolioImages[0]];
const mobileRightImages = [portfolioImages[1], portfolioImages[7], portfolioImages[2], portfolioImages[5], portfolioImages[8]];
const mobileLeftContent = [mobileLeftImages[0], mobileLeftImages[1], 'copy', mobileLeftImages[2], mobileLeftImages[3]];

/* ── StudioPortfolioCard ── */
function StudioPortfolioCard({ image, onSelect }) {
  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    onSelect(image.projectIndex, rect);
  };

  return (
    <button
      className="studio-portfolio-card"
      type="button"
      aria-label={`Ver proyecto ${image.title}`}
      onClick={handleClick}
    >
      <img src={image.src} alt={image.title} loading="lazy" />
      <span>{image.title}</span>
    </button>
  );
}

/* ── StudioPortfolioText ── */
function StudioPortfolioText() {
  return (
    <div className="studio-portfolio-copy">
      <div className="studio-portfolio-stats" aria-label="Impacto del portafolio">
        <p>Soluciones presentes en 6 países</p>
        <p>18 proyectos incubados</p>
        <p>15 diferentes tecnologías de frontera</p>
      </div>
      <h2>Portafolio de Soluciones</h2>
    </div>
  );
}

/* ══════════════════════════════════════════
   PROJECT DETAIL MODE
   ══════════════════════════════════════════ */
function ProjectDetailMode({ initialIndex, onClose, clickOrigin }) {
  const containerRef     = useRef(null);
  const flyingRef        = useRef(null);
  const rightPanelRef    = useRef(null);
  const rightImgRef      = useRef(null);
  const leftPanelRef     = useRef(null);
  const isAnimating      = useRef(false);
  const currentIdxRef    = useRef(initialIndex);
  const prevIdxRef       = useRef(initialIndex);
  const touchStartY      = useRef(null);

  const [flyingDone, setFlyingDone]     = useState(!clickOrigin);
  const [displayIndex, setDisplayIndex] = useState(initialIndex);

  const project = PROJECTS[displayIndex];

  /* ── Mount: fly image from card to right panel ── */
  useEffect(() => {
    const chromeEls = containerRef.current?.querySelectorAll('.detail-chrome-el');
    if (chromeEls?.length) gsap.from(chromeEls, { y: -14, autoAlpha: 0, duration: 0.45, stagger: 0.07, ease: 'power2.out' });

    gsap.set(leftPanelRef.current, { autoAlpha: 0 });
    gsap.set(rightImgRef.current, { autoAlpha: 0 });

    if (!clickOrigin || !flyingRef.current || !rightPanelRef.current) {
      setFlyingDone(true);
      gsap.to(leftPanelRef.current, { autoAlpha: 1, x: 0, duration: 0.6, ease: 'power3.out', delay: 0.1 });
      gsap.to(rightImgRef.current, { autoAlpha: 1, scale: 1, duration: 0.6, ease: 'power3.out', delay: 0.05 });
      return;
    }

    const rightRect = rightPanelRef.current.getBoundingClientRect();

    gsap.to(flyingRef.current, {
      left: rightRect.left,
      top: rightRect.top,
      width: rightRect.width,
      height: rightRect.height,
      borderRadius: 28,
      duration: 0.72,
      ease: 'power3.inOut',
      onComplete: () => {
        gsap.to(flyingRef.current, { autoAlpha: 0, duration: 0.18 });
        gsap.to(rightImgRef.current, { autoAlpha: 1, duration: 0.18 });
        setFlyingDone(true);
        gsap.fromTo(leftPanelRef.current,
          { autoAlpha: 0, x: -48 },
          { autoAlpha: 1, x: 0, duration: 0.55, ease: 'power3.out' }
        );
      },
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Animate in new content when displayIndex changes ── */
  useEffect(() => {
    if (prevIdxRef.current === displayIndex) return;
    const dir = displayIndex > prevIdxRef.current ? 1 : -1;
    prevIdxRef.current = displayIndex;

    gsap.fromTo(leftPanelRef.current,
      { autoAlpha: 0, x: dir * 44 },
      { autoAlpha: 1, x: 0, duration: 0.42, ease: 'power2.out' }
    );
    gsap.fromTo(rightImgRef.current,
      { autoAlpha: 0, scale: 0.97 },
      { autoAlpha: 1, scale: 1, duration: 0.42, ease: 'power2.out' }
    );
  }, [displayIndex]);

  /* ── Navigation logic ── */
  const navigate = (dir) => {
    if (isAnimating.current) return;
    const next = currentIdxRef.current + dir;
    if (next < 0 || next >= PROJECTS.length) return;

    isAnimating.current = true;

    gsap.to(leftPanelRef.current, { autoAlpha: 0, x: -dir * 44, duration: 0.28, ease: 'power2.in' });
    gsap.to(rightImgRef.current, {
      autoAlpha: 0, scale: 0.97, duration: 0.28,
      onComplete: () => {
        currentIdxRef.current = next;
        setDisplayIndex(next);
        isAnimating.current = false;
      },
    });
  };

  /* ── Wheel + touch + keyboard navigation ── */
  useEffect(() => {
    if (!flyingDone) return;

    const handleWheel = (e) => {
      e.preventDefault();
      if (Math.abs(e.deltaY) < 8) return;
      navigate(e.deltaY > 0 ? 1 : -1);
    };

    const handleTouchStart = (e) => { touchStartY.current = e.touches[0].clientY; };
    const handleTouchMove  = (e) => {
      if (touchStartY.current === null) return;
      e.preventDefault();
      const dy = touchStartY.current - e.touches[0].clientY;
      if (Math.abs(dy) > 28) { navigate(dy > 0 ? 1 : -1); touchStartY.current = null; }
    };

    const handleKey = (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') navigate(1);
      if (e.key === 'ArrowUp'   || e.key === 'ArrowLeft')  navigate(-1);
    };

    const el = containerRef.current;
    el.addEventListener('wheel', handleWheel, { passive: false });
    el.addEventListener('touchstart', handleTouchStart, { passive: true });
    el.addEventListener('touchmove',  handleTouchMove,  { passive: false });
    window.addEventListener('keydown', handleKey);

    return () => {
      el.removeEventListener('wheel', handleWheel);
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchmove',  handleTouchMove);
      window.removeEventListener('keydown', handleKey);
    };
  }, [flyingDone]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Close: reverse fly-back animation ── */
  const handleClose = () => {
    /* Fade chrome + side elements */
    const chromeEls = containerRef.current?.querySelectorAll('.detail-chrome-el');
    if (chromeEls?.length) gsap.to(chromeEls, { autoAlpha: 0, duration: 0.22, stagger: 0.04 });
    gsap.to(['.detail-progress-track', '.detail-scroll-hint'], { autoAlpha: 0, duration: 0.2 });

    if (!clickOrigin) {
      gsap.to(containerRef.current, { autoAlpha: 0, duration: 0.35, ease: 'power2.in', onComplete: onClose });
      return;
    }

    /* Fade left panel */
    gsap.to(leftPanelRef.current, { autoAlpha: 0, x: -30, duration: 0.28, ease: 'power2.in' });

    /* Get current right-panel rect and create fly-back element */
    const currentRect = rightPanelRef.current.getBoundingClientRect();
    gsap.to(rightImgRef.current, { autoAlpha: 0, duration: 0.15 });

    const flyBack = document.createElement('div');
    Object.assign(flyBack.style, {
      position: 'fixed',
      left: `${currentRect.left}px`,
      top: `${currentRect.top}px`,
      width: `${currentRect.width}px`,
      height: `${currentRect.height}px`,
      backgroundImage: `url(${PROJECTS[currentIdxRef.current].img})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      borderRadius: '28px',
      zIndex: '300',
      pointerEvents: 'none',
    });
    document.body.appendChild(flyBack);

    gsap.to(flyBack, {
      left: clickOrigin.left,
      top: clickOrigin.top,
      width: clickOrigin.width,
      height: clickOrigin.height,
      borderRadius: 0,
      duration: 0.65,
      ease: 'power3.inOut',
      delay: 0.08,
      onComplete: () => { flyBack.remove(); onClose(); },
    });
  };

  return (
    <div ref={containerRef} className="detail-overlay">

      {/* Chrome */}
      <div className="detail-chrome">
        <button className="detail-back detail-chrome-el" onClick={handleClose}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 5 5 12 12 19" />
          </svg>
          Regresar al portafolio
        </button>

        <img src="/assets/images/logo.svg" alt="NaturaTech Studio" className="detail-logo detail-chrome-el" />

        <span className="detail-counter detail-chrome-el">
          <span className="counter-current">{String(displayIndex + 1).padStart(2, '0')}</span>
          <span className="counter-sep"> / </span>
          <span className="counter-total">{String(PROJECTS.length).padStart(2, '0')}</span>
        </span>
      </div>

      {/* Flying image */}
      {clickOrigin && (
        <div
          ref={flyingRef}
          className="detail-flying-img"
          style={{
            left:   clickOrigin.left,
            top:    clickOrigin.top,
            width:  clickOrigin.width,
            height: clickOrigin.height,
            backgroundImage: `url(${PROJECTS[initialIndex].img})`,
          }}
        />
      )}

      {/* Main layout */}
      <div className="detail-layout">

        {/* Left: project info */}
        <div ref={leftPanelRef} className="detail-left">
          <h1 className="detail-title">{project.title}</h1>
          <p className="detail-desc">{project.description}</p>

          {project.url !== '#' && (
            <a href={project.url} className="detail-cta" target="_blank" rel="noopener noreferrer">
              Visitar sitio web
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
          )}

          <div className="detail-meta">
            <div className="detail-meta-col">
              <span className="detail-meta-label">Líderes del Proyecto</span>
              <div className="detail-leaders">
                {project.leaders.map((leader) => (
                  <div key={leader.name} className="detail-avatar" title={leader.name}>
                    <img src={leader.avatar} alt={leader.name} />
                  </div>
                ))}
              </div>
            </div>
            <div className="detail-meta-col">
              <span className="detail-meta-label">Región</span>
              <p className="detail-region">{project.region}</p>
            </div>
          </div>
        </div>

        {/* Right: image panel */}
        <div ref={rightPanelRef} className="detail-right">
          <div
            ref={rightImgRef}
            className="detail-img"
            style={{ backgroundImage: `url(${project.img})` }}
          />
        </div>

      </div>

      {/* Scroll hint */}
      {flyingDone && (
        <div className="detail-scroll-hint">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: 'rotate(180deg)' }}>
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      )}

    </div>
  );
}

/* ══════════════════════════════════════════
   STUDIO MAIN COMPONENT
   ══════════════════════════════════════════ */
export default function Studio() {
  const rootRef = useRef(null);
  const [portfolioOpen,   setPortfolioOpen]   = useState(false);
  const [detailIndex,     setDetailIndex]     = useState(null);
  const [clickOriginRect, setClickOriginRect] = useState(null);

  const runCoverTransition = (onCovered) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onCovered?.();
      return;
    }
    const el = document.createElement('div');
    el.className = 'studio-cover-overlay';
    document.body.appendChild(el);
    gsap.timeline()
      .fromTo(el,
        { yPercent: 100 },
        { yPercent: 0, duration: 0.52, ease: 'power3.inOut', onComplete: () => onCovered?.() }
      )
      .to(el, { yPercent: -100, duration: 0.48, ease: 'power3.inOut', onComplete: () => el.remove() });
  };

  const openPortfolio = (event) => {
    event.preventDefault();
    runCoverTransition(() => setPortfolioOpen(true));
  };

  const closePortfolio = () => {
    runCoverTransition(() => setPortfolioOpen(false));
  };

  /* Open project detail from a portfolio card click */
  const openDetail = (index, rect) => {
    setClickOriginRect(rect);
    setDetailIndex(index);
  };

  /* Close detail → back to portfolio */
  const closeDetail = () => {
    setDetailIndex(null);
    setClickOriginRect(null);
  };

  /* ── Hero/content GSAP animations ── */
  useEffect(() => {
    if (!rootRef.current || portfolioOpen) return undefined;

    const ctx = gsap.context(() => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (!reduceMotion) {
        gsap.fromTo(
          '.studio-subject-anchor',
          { '--subject-anchor-scale': 1.08 },
          { '--subject-anchor-scale': 1, duration: 1.4, ease: 'power3.out' }
        );
      }

      gsap.to('.studio-subject', { yPercent: 18, scale: 1.03, ease: 'none', scrollTrigger: { trigger: '.studio-hero', start: 'top bottom', end: 'bottom top', scrub: 0.6 } });
      gsap.from('.studio-content-inner', { y: 60, opacity: 0, duration: 1.2, delay: 0.15, ease: 'power3.out' });

      document.querySelectorAll('.studio-letter').forEach((letter, i) => {
        const speed = parseFloat(letter.dataset.speed) || 1;
        gsap.fromTo(letter, { y: 80 * speed, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, delay: 0.08 + i * 0.04, ease: 'power3.out' });
      });

      gsap.from('.studio-main-image', { scale: 0.9, opacity: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: '.studio-main-content', start: 'top 75%', toggleActions: 'play none none reverse' } });
      gsap.from('.studio-main-text', { y: 40, opacity: 0, duration: 0.9, delay: 0.15, ease: 'power3.out', scrollTrigger: { trigger: '.studio-main-content', start: 'top 72%', toggleActions: 'play none none reverse' } });

      document.querySelectorAll('.studio-info-card').forEach((el, i) => {
        gsap.from(el, { y: 40, opacity: 0, duration: 0.7, delay: i * 0.1, ease: 'power3.out', scrollTrigger: { trigger: '.studio-info-section', start: 'top 80%', toggleActions: 'play none none reverse' } });
      });

      const infoPath = rootRef.current?.querySelector('.studio-info-path path');
      if (infoPath) {
        const len = infoPath.getTotalLength();
        gsap.set(infoPath, {
          attr: { 'stroke-dasharray': len, 'stroke-dashoffset': len },
        });
        gsap.to(infoPath, {
          attr: { 'stroke-dashoffset': 0 },
          ease: 'none',
          scrollTrigger: {
            trigger: '.studio-info-section',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.6,
          },
        });
      }

      const levelSelectors = ['.studio-levels-photo-one', '.studio-levels-photo-two', '.studio-levels-photo-three'];
      gsap.set(levelSelectors, { scale: 0.22, autoAlpha: 0, y: 68, x: -24 });
      const levelsTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.studio-levels-visual',
          start: 'top 78%',
          end: 'bottom 22%',
          scrub: 1.5,
        },
      });
      levelSelectors.forEach((sel, i) => {
        const t = i * 0.32;
        levelsTl
          .to(sel, { y: 0, duration: 0.28, ease: 'power2.out' }, t)
          .to(sel, { x: 0, scale: 1, autoAlpha: 1, duration: 0.36, ease: 'power3.out' }, t + 0.06);
      });
    }, rootRef);

    return () => {
      cleanupGsapRoute(rootRef.current);
      ctx.revert();
    };
  }, [portfolioOpen]);

  /* ── Portfolio mode GSAP (infinite scroll columns) ── */
  useEffect(() => {
    document.documentElement.classList.toggle('studio-portfolio-open', portfolioOpen);

    if (!portfolioOpen || !rootRef.current || detailIndex !== null) {
      return () => document.documentElement.classList.remove('studio-portfolio-open');
    }

    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      gsap.from('.studio-portfolio-back', { y: -18, opacity: 0, duration: 0.55, ease: 'power3.out' });
      gsap.from('.studio-portfolio-copy', { y: 28, opacity: 0, duration: 0.7, ease: 'power3.out' });

      if (reduceMotion) return;

      let activeLoop;

      const setupColumns = (selector) => {
        const columns = gsap.utils.toArray(selector);
        const setters = columns.map((col) => gsap.quickSetter(col, 'y', 'px'));
        const cycleHeights = columns.map((col) => col.scrollHeight / 3);
        const baseOffsets  = columns.map((_, i) => -cycleHeights[i] * [0.18, 0.54, 0.34][i % 3]);
        const directions   = columns.map((col) => Number(col.dataset.direction || -1));
        let current = 0;
        let target  = 0;
        let touchY  = null;

        const render = () => {
          current += (target - current) * 0.095;
          columns.forEach((col, i) => {
            const cycle = cycleHeights[i] || 1;
            const rawY  = baseOffsets[i] + directions[i] * current;
            setters[i](gsap.utils.wrap(-cycle * 2, 0, rawY));
          });
        };

        const addDelta = (delta) => { target += delta * 0.92; };

        const handleWheel = (e) => { e.preventDefault(); addDelta(e.deltaY); };
        const handleTouchStart = (e) => { touchY = e.touches[0]?.clientY ?? null; };
        const handleTouchMove  = (e) => {
          if (touchY === null) return;
          e.preventDefault();
          const nextY = e.touches[0]?.clientY ?? touchY;
          addDelta(touchY - nextY);
          touchY = nextY;
        };
        const handleTouchEnd = () => { touchY = null; };

        window.addEventListener('wheel', handleWheel, { passive: false });
        window.addEventListener('touchstart', handleTouchStart, { passive: true });
        window.addEventListener('touchmove',  handleTouchMove,  { passive: false });
        window.addEventListener('touchend',   handleTouchEnd,   { passive: true });
        gsap.ticker.add(render);
        render();

        activeLoop = () => {
          gsap.ticker.remove(render);
          window.removeEventListener('wheel', handleWheel);
          window.removeEventListener('touchstart', handleTouchStart);
          window.removeEventListener('touchmove',  handleTouchMove);
          window.removeEventListener('touchend',   handleTouchEnd);
        };
      };

      ScrollTrigger.matchMedia({
        '(min-width: 769px)':  () => { setupColumns('.studio-portfolio-column');        return () => activeLoop?.(); },
        '(max-width: 768px)':  () => { setupColumns('.studio-portfolio-mobile-column'); return () => activeLoop?.(); },
      });
    }, rootRef);

    return () => {
      ctx.revert();
      document.documentElement.classList.remove('studio-portfolio-open');
    };
  }, [portfolioOpen, detailIndex]);

  /* ── Render: Project Detail Mode ── */
  if (detailIndex !== null) {
    return (
      <div ref={rootRef}>
        <ProjectDetailMode
          initialIndex={detailIndex}
          onClose={closeDetail}
          clickOrigin={clickOriginRect}
        />
      </div>
    );
  }

  /* ── Render: Portfolio Grid Mode ── */
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
              {portfolioColumns.map((column, colIdx) => (
                <div className="studio-portfolio-column" data-direction={colIdx === 1 ? 1 : -1} key={colIdx}>
                  {[...column, ...column, ...column].map((image, imgIdx) => (
                    <StudioPortfolioCard image={image} onSelect={openDetail} key={`${image.src}-${imgIdx}`} />
                  ))}
                </div>
              ))}
            </div>

            <div className="studio-portfolio-mobile-grid">
              <div className="studio-portfolio-mobile-column" data-direction="-1">
                {[...mobileLeftContent, ...mobileLeftContent, ...mobileLeftContent].map((item, idx) =>
                  item === 'copy'
                    ? <StudioPortfolioText key={`copy-${idx}`} />
                    : <StudioPortfolioCard image={item} onSelect={openDetail} key={`${item.src}-left-${idx}`} />
                )}
              </div>
              <div className="studio-portfolio-mobile-column" data-direction="1">
                {[...mobileRightImages, ...mobileRightImages, ...mobileRightImages].map((image, idx) => (
                  <StudioPortfolioCard image={image} onSelect={openDetail} key={`${image.src}-right-${idx}`} />
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  /* ── Render: Main Studio Page ── */
  return (
    <div ref={rootRef}>
      <section className="studio-hero">
        <div className="studio-bg-wrapper">
          <img src="/assets/Studio/bg-studio.avif" alt="" className="studio-bg" />
        </div>

        <div className="studio-giant-text" aria-hidden="true">
          {['E', 'S', 'C', 'A', 'L', 'A'].map((ch, i) => (
            <span key={i} className="giant-letter studio-letter" data-speed={[0.7, 0.9, 1.1, 0.8, 1.0, 0.85][i]}>{ch}</span>
          ))}
        </div>

        <div className="studio-subject-wrapper">
          <div className="studio-subject-anchor">
            <img src="/assets/Studio/subject-studio.avif" alt="Studio Subject" className="studio-subject" />
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
              <span className="studio-heading-line">Demuestra</span>
              <span className="studio-heading-line studio-heading-accent"><span className="amp">&amp;</span> Co-crea</span>
            </h1>
            <p className="studio-description">
             El Studio de NaturaTech LAC conecta innovación, infraestructura digital y colaboración territorial para demostrar nuevas formas de regenerar biodiversidad y economías locales.
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
              <svg width="16" height="24" viewBox="0 0 16 24" fill="none" stroke="#C8E632" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 4L8 20M8 20L2 14M8 20L14 14" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      <section className="studio-main-content">
        <div className="studio-main-inner">
          <div className="studio-main-image">
            <img src="/assets/Studio/studio-gallery-1.avif" alt="Studio Work" />
          </div>
          <div className="studio-main-text">
            <h3>
              Un portafolio vivo de innovación para la biodiversidad
              <span>(biodiversidad</span>
            </h3>
            <p>Financiamos, co-desarrollamos y validamos soluciones regenerativas junto a organizaciones territoriales, emprendedores y aliados estratégicos para acelerar nuevas formas de conservar, regenerar y generar valor desde la biodiversidad.</p>
            <p className="studio-main-stat">1.6M de invertidos en la naturaleza</p>
          </div>
        </div>
      </section>

      <section className="studio-info-section">
        <div className="studio-info-inner">
          <div className="studio-info-kicker">
            <span aria-hidden="true">+</span>
            <p>Nuestra metodolog&iacute;a<br />tiene doble impacto</p>
          </div>

          <svg className="studio-info-path" viewBox="0 0 480 690" fill="none" aria-hidden="true" preserveAspectRatio="none">
            <path d="M459 6L283 104L250 317L19 381L8 676" />
          </svg>

          <div className="studio-info-card studio-info-card-systemic">
            <h4>Escalamiento<br />Sistémico</h4>
            <p>El Studio transforma experiencias territoriales en demostradores replicables, infraestructura compartida y aprendizajes aplicados que fortalecen el ecosistema regional de innovación para la naturaleza.</p>
          </div>

          <div className="studio-info-card studio-info-card-local">
            <h4>Impacto Territorial</h4>
            <p>Las soluciones impulsadas desde el Studio contribuyen a la conservación de ecosistemas, el fortalecimiento de economías locales y el desarrollo de capacidades en comunidades y organizaciones de América Latina y el Caribe.</p>
          </div>
        </div>

        <div className="studio-levels">
          <div className="studio-levels-visual" aria-hidden="true">
            <div className="studio-levels-orbit">
              <img className="studio-levels-photo studio-levels-photo-one" src="/assets/Studio/studio-levels-img1.avif" alt="" loading="lazy" />
              <img className="studio-levels-photo studio-levels-photo-two" src="/assets/Studio/studio-levels-img2.avif" alt="" loading="lazy" />
              <img className="studio-levels-photo studio-levels-photo-three" src="/assets/Studio/studio-levels-icon-3.avif" alt="" loading="lazy" />
            </div>
          </div>
          <div className="studio-levels-copy">
            <h3>Capacidades para escalar soluciones regenerativas</h3>
            <div className="studio-levels-grid">
              <div className="level-item">
                <img src="/assets/Studio/studio-levels-icon-1.svg" alt="" width="34" height="34" loading="lazy" />
                <p>Preparación para financiamiento</p>
              </div>
              <div className="level-item">
                <img src="/assets/Studio/studio-levels-icon-2.svg" alt="" width="34" height="34" loading="lazy" />
                <p>Infraestructura de confianza</p>
              </div>
              <div className="level-item">
                <img src="/assets/Studio/studio-levels-icon-3.svg" alt="" width="34" height="34" loading="lazy" />
                <p>Conexión y escalamiento</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
