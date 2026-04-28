import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import GlassFrame from '../components/GlassFrame.jsx';

const REGENERA_VIDEO_SRC = import.meta.env.VITE_REGENERA_VIDEO_URL?.trim() || 'https://pub-c9d9bba411f444e5a7d61a43c6e28f11.r2.dev/emprendimiento/video/regenera.mp4';

export default function Emprendimientos({ onFrameToggle }) {
  const rootRef = useRef(null);
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    if (!rootRef.current) return;
    const ctx = gsap.context(() => {
      gsap.to('.regen-bg', {
        yPercent: 12, ease: 'none',
        scrollTrigger: { trigger: '.regen-section', start: 'top bottom', end: 'bottom top', scrub: 0.8 },
      });
      gsap.to('.regen-people', {
        yPercent: 18, scale: 1.03, ease: 'none',
        scrollTrigger: { trigger: '.regen-section', start: 'top bottom', end: 'bottom top', scrub: 0.6 },
      });

      gsap.from('.regen-content-inner', {
        y: 60,
        opacity: 0,
        duration: 1.2,
        delay: 0.15,
        ease: 'power3.out',
      });

      document.querySelectorAll('.regen-letter').forEach((letter, i) => {
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

      gsap.to('.regen-content', {
        y: -50, opacity: 0, ease: 'none',
        scrollTrigger: { trigger: '.regen-section', start: '60% top', end: 'bottom top', scrub: 0.6 },
      });

      const video = videoRef.current;
      if (video) {
        ScrollTrigger.create({
          trigger: '.regen-video-section',
          start: 'top 80%',
          end: 'bottom 20%',
          onEnter: () => {
            video.play().catch(() => {});
            video.classList.add('is-playing');
            onFrameToggle?.(true);
          },
          onLeave: () => {
            video.pause();
            video.classList.remove('is-playing');
            onFrameToggle?.(false);
          },
          onEnterBack: () => {
            video.play().catch(() => {});
            video.classList.add('is-playing');
            onFrameToggle?.(true);
          },
          onLeaveBack: () => {
            video.pause();
            video.classList.remove('is-playing');
            onFrameToggle?.(false);
          },
        });
      }

      gsap.from('.regen-100k-fan .fan-img', {
        y: 60, opacity: 0, stagger: 0.1, duration: 1, ease: 'back.out(1.4)',
        scrollTrigger: { trigger: '.regen-100k-section', start: 'top 75%', toggleActions: 'play none none reverse' },
      });
      gsap.from('.regen-100k-info', {
        y: 40, opacity: 0, duration: 1, delay: 0.2, ease: 'power3.out',
        scrollTrigger: { trigger: '.regen-100k-section', start: 'top 75%', toggleActions: 'play none none reverse' },
      });

      document.querySelectorAll('.regen-blockquote .word').forEach((word) => {
        ScrollTrigger.create({
          trigger: word,
          start: 'top 85%',
          end: 'top 55%',
          scrub: true,
          onUpdate: (self) => {
            if (self.progress > 0.3) word.classList.add('is-revealed');
            else word.classList.remove('is-revealed');
          },
        });
      });

      gsap.from('.regen-quote-icon', {
        scale: 0.5, opacity: 0, duration: 0.8, ease: 'back.out(1.6)',
        scrollTrigger: { trigger: '.regen-quote-section', start: 'top 80%', toggleActions: 'play none none reverse' },
      });

      gsap.from('.regen-condition-row', {
        y: 50, opacity: 0, stagger: 0.2, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: '.regen-conditions-right', start: 'top 80%', toggleActions: 'play none none reverse' },
      });
      gsap.from('.regen-conditions-left', {
        x: -40, opacity: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: '.regen-conditions-section', start: 'top 80%', toggleActions: 'play none none reverse' },
      });
    }, rootRef);

    return () => {
      ctx.revert();
      onFrameToggle?.(false);
    };
  }, [onFrameToggle]);

  return (
    <div ref={rootRef}>
      {/* HERO */}
      <section className="regen-section">
        <div className="regen-bg-wrapper">
          <img src="/assets/regenera/bg-regenera.png" alt="" className="regen-bg" />
        </div>

        <div className="regen-giant-text" aria-hidden="true">
          {['R','E','G','E','N','E','R','A'].map((ch, i) => (
            <span key={i} className="giant-letter regen-letter" data-speed={[0.7,0.9,1.1,0.8,1.0,0.85,1.15,0.95][i]}>{ch}</span>
          ))}
        </div>

        <div className="regen-people-wrapper">
          <img src="/assets/regenera/people-regen.png" alt="Emprendedores regenerativos" className="regen-people" />
        </div>

        <div className="regen-overlay" aria-hidden="true" />

        <div className="regen-content">
          <div className="regen-content-inner">
            <div className="regen-header-label">
              <img src="/assets/shapes/double-d.svg" alt="" width="18" height="18" />
              Natura 500
            </div>
            <h1 className="regen-heading">
              <span className="regen-heading-line">Emprende</span>
              <span className="regen-heading-line regen-heading-accent"><span className="amp">&amp;</span> Regenera</span>
            </h1>
            <p className="regen-description">
              Accede a herramientas de IA, conecta con nuevas oportunidades de financiamiento y sé parte de una red global.
            </p>
            <a href="https://500.naturatech.org" target="_blank" rel="noreferrer" className="btn-glass hero-cta-button">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              Acceder a Natura 500
            </a>
          </div>

          <div className="regen-bottom-center">
            <div className="hero-scroll-indicator">
              <span>DESLIZAR</span>
              <svg width="15" height="24" viewBox="0 0 16 24" fill="none" stroke="#C8E632" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 4L8 20M8 20L2 14M8 20L14 14"/></svg>
            </div>
          </div>
        </div>
      </section>

      {/* IMMERSIVE VIDEO */}
      <section className="regen-video-section">
        <video
          ref={videoRef}
          className="regen-video"
          src={REGENERA_VIDEO_SRC}
          muted={muted}
          loop
          playsInline
          preload="metadata"
        />
        <button
          type="button"
          className="regen-sound-btn is-visible"
          style={{ padding: 0, border: 'none', background: 'transparent' }}
          onClick={() => {
            const v = videoRef.current;
            if (!v) return;
            v.muted = !v.muted;
            setMuted(v.muted);
          }}
        >
          <GlassFrame
            cornerRadius={999}
            padding="14px 24px"
            blurAmount={0.15}
            saturation={120}
            aberrationIntensity={1}
            elasticity={0.1}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {muted ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
              )}
              <span>{muted ? 'Activar sonido' : 'Silenciar'}</span>
            </div>
          </GlassFrame>
        </button>
      </section>

      {/* 100K */}
      <section className="regen-100k-section">
        <div className="regen-100k-content">
          <div className="regen-100k-fan">
            <img src="/assets/regenera/fan_1.png" alt="Emprendedor 1" className="fan-img fan-left" loading="lazy" />
            <img src="/assets/regenera/fan_3.png" alt="Emprendedor 3" className="fan-img fan-right" loading="lazy" />
            <img src="/assets/regenera/fan_2.png" alt="Emprendedor 2" className="fan-img fan-center" loading="lazy" />
          </div>
          <div className="regen-100k-info">
            <h3 className="regen-100k-heading">Hasta <span className="regen-100k-number">100K USD</span></h3>
            <p className="regen-100k-text">
              Natura 500: Regenera es un premio por registrarte en la red de Natura 500 y estará disponible hasta el 15 de Julio. Accede a esta y más oportunidades.
            </p>
            <a href="https://500.naturatech.org" target="_blank" rel="noreferrer" className="btn-sparkle">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#C8E632"><path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z"/></svg>
              Acceder a Natura 500
            </a>
          </div>
        </div>
      </section>

      {/* QUOTE */}
      <section className="regen-quote-section">
        <div className="regen-quote-content">
          <div className="regen-quote-icon">
            <img src="/assets/shapes/double-d.svg" alt="" width="40" height="40" />
          </div>
          <blockquote className="regen-blockquote">
            {[
              'Si','construimos','infraestructura','de','confianza,','estándares','compartidos,',
              'gobernanza','verificable,',
              ['métricas','word-bold'],
              ['comparables,','word-bold'],
              'el','capital','fluye','con','menor','riesgo,','mayor','velocidad','y','mejor',
              'distribución','del',
              ['valor.','word-bold'],
            ].map((entry, i) => {
              const [text, extra] = Array.isArray(entry) ? entry : [entry, ''];
              return <span key={i} className={'word ' + (extra || '')}>{text} </span>;
            })}
          </blockquote>
        </div>
      </section>

      {/* CONDITIONS */}
      <section className="regen-conditions-section">
        <div className="regen-conditions-grid">
          <div className="regen-conditions-left">
            <div className="regen-conditions-label">
              <img src="/assets/shapes/Flower.svg" alt="" width="16" height="16" />
              CÓMO LO HACEMOS
            </div>
            <h2 className="regen-conditions-title">
              Tres condiciones<br/>para escalar la<br/>regeneración
            </h2>
            <a href="https://500.naturatech.org" target="_blank" rel="noreferrer" className="btn-glass">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              Acceder a Natura 500
            </a>
          </div>
          <div className="regen-conditions-right">
            {[
              { title: 'CONSTRUCTOR DE PORTAFOLIO', desc: 'Transformamos diversidad en comparabilidad. Cacao en Ecuador, manglares en Honduras, bioingredientes en Perú — cada proyecto único, ahora evaluable bajo criterios compartidos.', highlight: 'Para inversionistas', highlightTail: ' que necesitan originar operaciones sin reinventar la debida diligencia' },
              { title: 'RIELES OPERATIVOS', desc: 'Diseñamos los estándares mínimos que hacen posible la confianza: gobernanza verificable, métricas comparables, trazabilidad desde el día uno.', highlight: 'Para emprendimientos', highlightTail: ' que hoy negocian con diez actores, cada uno pidiendo formatos incompatibles.' },
              { title: 'CAPA DE ARTICULACIÓN', desc: 'Conectamos mundos que históricamente no se entienden: el tiempo del capital y el tiempo del bosque, la lógica del retorno y la lógica del territorio.', highlight: 'Para todo el ecosistema', highlightTail: ', porque el cuello de botella está en la fricción entre todos.' },
            ].map((c, i) => (
              <div className="regen-condition-row" key={i}>
                <div className="condition-line"></div>
                <h4 className="condition-title">{c.title}</h4>
                <p className="condition-desc">{c.desc}</p>
                <p className="condition-highlight"><span className="condition-accent">{c.highlight}</span>{c.highlightTail}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="conditions-deco" aria-hidden="true">
          <div className="deco-line deco-line-1"></div>
          <div className="deco-line deco-line-2"></div>
          <div className="deco-square deco-square-1"></div>
          <div className="deco-square deco-square-2"></div>
        </div>
      </section>
    </div>
  );
}
