import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';
import GlassFrame from '../components/GlassFrame.jsx';

const stories = [
  { title: 'Lola Cabnal en',     subtitle: 'Somos Raíces',        img: '/assets/historias/historia-one.webp',    href: 'https://www.youtube.com/watch?v=_Z1tjJn5fo0&t=36s',                                          cta: 'Ver Video',           play: true },
  { title: 'Conoce más de',      subtitle: 'Natura 500',          img: '/assets/historias/historia-dos.webp',    href: '/emprendimientos',                                                                                  cta: 'Ir a Natura 500' },
  { title: 'Accede a nuestro',   subtitle: 'Canal de Whatsapp',   img: '/assets/historias/historia-tres.webp',   href: 'https://whatsapp.com/channel/0029Vb7HsgN3mFXwkZzeW71V',                                       cta: 'Ir a Canal' },
  { title: 'Escucha el Soundtrack', subtitle: 'de CEIBA',         img: '/assets/historias/historia-cuatro.webp', href: 'https://open.spotify.com/intl-es/album/0lg3EDWiGdTLW565zGKvuO?si=D1-PT4T9Sz-o9vn9a5Jtvw',     cta: 'Escuchar en Spotify' },
];

export default function Home({ appReady }) {
  const rootRef = useRef(null);
  const [storiesCollapsed, setStoriesCollapsed] = useState(true);
  const storiesListRef = useRef(null);

  useEffect(() => {
    if (!rootRef.current || !appReady) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.from('.hero-bg',          { scale: 1.15, duration: 2.4, ease: 'power2.out' }, 0)
        .from('.hero-bird',        { scale: 1.06, y: 30, opacity: 0, duration: 1.4 }, 0.1)
        .from('.giant-letter',     {
          y: 160, opacity: 0, rotateX: -45, transformOrigin: '50% 100%',
          duration: 1.2, stagger: 0.06, ease: 'power4.out',
        }, 0.2)
        .from('.hero-heading-line', { y: 60, opacity: 0, duration: 0.9, stagger: 0.16 }, 0.55)
        .fromTo('#hero-cta',     { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, 0.85)
        .fromTo('#hero-scroll',  { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, 0.95)
        .from('#hero-stories-card', { x: -60, opacity: 0, duration: 0.95 }, 0.75);

      gsap.to('.hero-bird', { y: '-=8', yoyo: true, repeat: -1, duration: 4.2, ease: 'sine.inOut' });

      gsap.to('.hero-bg',    { yPercent: 12,             ease: 'none', scrollTrigger: { trigger: '.hero-section', start: 'top top', end: 'bottom top', scrub: 0.8 } });
      gsap.to('.hero-bird',  { yPercent: 28, scale: 1.04, ease: 'none', scrollTrigger: { trigger: '.hero-section', start: 'top top', end: 'bottom top', scrub: 0.6 } });
      document.querySelectorAll('.giant-letter-wrap').forEach((wrap) => {
        const speed = parseFloat(wrap.dataset.speed) || 1;
        gsap.to(wrap, {
          y: -120 * speed, ease: 'none',
          scrollTrigger: { trigger: '.hero-section', start: 'top top', end: '70% top', scrub: 0.6 },
        });
      });
      gsap.to('.hero-content', {
        y: -50, opacity: 0, ease: 'none',
        scrollTrigger: { trigger: '.hero-section', start: '25% top', end: '75% top', scrub: 0.6 },
      });

      gsap.utils.toArray('.gallery-item').forEach((item, i) => {
        gsap.fromTo(item, { clipPath: 'inset(100% 0 0 0)', y: 50 }, {
          clipPath: 'inset(0% 0 0 0)', y: 0, duration: 1.1, ease: 'power3.out',
          delay: (i % 5) * 0.05,
          scrollTrigger: { trigger: item, start: 'top 92%', toggleActions: 'play none none reverse' },
        });
        const speed = parseFloat(item.dataset.speed) || 1;
        gsap.to(item.querySelector('img'), {
          yPercent: (speed - 1) * 40, ease: 'none',
          scrollTrigger: { trigger: item, start: 'top bottom', end: 'bottom top', scrub: 0.8 },
        });
      });

      gsap.to('.mission-text .word', {
        opacity: 1, y: 0, filter: 'blur(0px)', ease: 'power2.out',
        duration: 0.8, stagger: 0.045,
        scrollTrigger: { trigger: '.mission-section', start: 'top 65%', end: 'top 10%', toggleActions: 'play none none reverse' },
      });
      gsap.from('#mission-cta', {
        y: 40, opacity: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: '#mission-cta', start: 'top 88%', toggleActions: 'play none none reverse' },
      });

      const titleLines = document.querySelectorAll('#possibilities-title .line-inner');
      gsap.fromTo(titleLines, 
        { yPercent: 115 },
        {
          yPercent: 0, duration: 1.05, ease: 'power4.out', stagger: 0.14,
          scrollTrigger: { trigger: '.possibilities-section', start: 'top 78%', toggleActions: 'play none none reverse' },
        }
      );
      gsap.from('.possibilities-icon', {
        scale: 0, rotate: -90, opacity: 0, duration: 0.8, ease: 'back.out(1.7)',
        scrollTrigger: { trigger: '.possibilities-section', start: 'top 78%', toggleActions: 'play none none reverse' },
      });

      const desc = document.getElementById('possibilities-desc');
      if (desc) {
        const split = new SplitType(desc, { types: 'words' });
        gsap.from(split.words, {
          opacity: 0, y: 18, duration: 0.7, stagger: 0.018, ease: 'power2.out',
          scrollTrigger: { trigger: desc, start: 'top 82%', toggleActions: 'play none none reverse' },
        });
      }

      gsap.utils.toArray('.feature-card').forEach((card, i) => {
        gsap.from(card, {
          y: 100, opacity: 0, rotateX: 14, rotateY: -6,
          transformPerspective: 1200, duration: 1, ease: 'power3.out', delay: i * 0.1,
          scrollTrigger: { trigger: '.cards-grid', start: 'top 80%', toggleActions: 'play none none reverse' },
        });
      });

      const programsContainer = document.querySelector('.programs-container');
      if (programsContainer) {
        gsap.to(programsContainer, {
          x: () => -(programsContainer.scrollWidth - window.innerWidth),
          ease: 'none',
          scrollTrigger: {
            trigger: '.programs-section',
            pin: true,
            start: 'top top',
            end: () => '+=' + (programsContainer.scrollWidth - window.innerWidth),
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
      }
    }, rootRef);

    return () => ctx.revert();
  }, [appReady]);

  // Stories auto-rotate when collapsed
  useEffect(() => {
    if (!storiesCollapsed) return;
    const list = storiesListRef.current;
    if (!list) return;
    const getItemHeight = () => {
      const firstItem = list.querySelector('.stories-content');
      const gap = parseFloat(window.getComputedStyle(list).rowGap || '0');
      return (firstItem?.offsetHeight || 88) + gap;
    };
    let i = 0;
    const id = setInterval(() => {
      i = (i + 1) % stories.length;
      list.scrollTo({ top: i * getItemHeight(), behavior: 'smooth' });
    }, 3500);
    return () => clearInterval(id);
  }, [storiesCollapsed]);

  return (
    <div ref={rootRef} className="home-page">
      {/* HERO */}
      <section id="hero" className="hero-section">
        <div className="hero-bg-wrapper">
          <img src="/assets/images/hero-bg.webp" alt="" className="hero-bg" />
        </div>

        <div className="hero-giant-text" aria-hidden="true">
          {['E','N','R','A','I','Z','A'].map((ch, idx) => (
            <span key={idx} className="giant-letter-wrap" data-speed={1.1 + (idx % 3) * 0.05} style={{ display: 'inline-block' }}>
              <span className="giant-letter">{ch}</span>
            </span>
          ))}
        </div>

        <div className="hero-bird-wrapper">
          <img src="/assets/images/colibri.png" alt="Colibrí verde iridiscente" className="hero-bird" />
        </div>

        <div className="hero-overlay" aria-hidden="true" />

        <div className="hero-content">
          <div className="hero-bottom-grid">

            <div className="hero-bottom-left">
              <div className="hero-stories-card css-glass" id="hero-stories-card">
                <button
                  className="stories-badge"
                  onClick={() => setStoriesCollapsed((v) => !v)}
                  type="button"
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <img src="/assets/icons/Fire.svg" alt="" width="11" height="11" />
                    <span className="stories-badge-desktop">Destacado</span>
                    <span className="stories-badge-mobile">Historias</span>
                  </span>
                  <svg
                    width="16" height="16" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round"
                    style={{ transition: 'transform 0.4s', transform: storiesCollapsed ? 'rotate(180deg)' : 'rotate(0deg)', color: 'var(--accent)' }}
                  >
                    <polyline points="18 15 12 9 6 15" />
                  </svg>
                </button>
                <div className={'stories-list' + (storiesCollapsed ? ' is-collapsed' : '')} ref={storiesListRef}>
                  {stories.map((s, i) => (
                    <div className="stories-content" key={i}>
                      <div className="stories-thumb"><img src={s.img} alt={s.subtitle} /></div>
                      <div className="stories-info">
                        <span className="stories-title">{s.title}</span>
                        <span className="stories-subtitle">{s.subtitle}</span>
                        <a href={s.href} target="_blank" rel="noreferrer" className="stories-link">
                          {s.play ? (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="#C8E632"><polygon points="5,3 19,12 5,21"/></svg>
                          ) : (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#C8E632" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                          )}
                          {s.cta}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="hero-bottom-center">
              <div className="hero-scroll-indicator" id="hero-scroll">
                <span>DESLIZAR</span>
                <svg width="16" height="24" viewBox="0 0 16 24" fill="none" stroke="#C8E632" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 4L8 20M8 20L2 14M8 20L14 14"/></svg>
              </div>
            </div>

            <div className="hero-bottom-right">
              <h1 className="hero-heading">
                <span className="hero-heading-line">Innovación</span>
                <span className="hero-heading-line hero-heading-accent">
                  <span className="amp">&amp;</span> Naturaleza
                </span>
              </h1>
              <a href="#" className="btn-glass" id="hero-cta">
                <svg className="hero-cta-icon hero-cta-icon-play" width="14" height="14" viewBox="0 0 24 24" fill="#101511"><polygon points="5,3 19,12 5,21"/></svg>
                <svg className="hero-cta-icon hero-cta-icon-sparkle" width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 2.8 14.45 9.55 21.2 12 14.45 14.45 12 21.2 9.55 14.45 2.8 12 9.55 9.55 12 2.8Z" fill="currentColor" />
                </svg>
                Ver Video
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="gallery-section">
        <div className="gallery-grid">
          <div className="gallery-row gallery-row-top">
            {[1,2,3,4,5].map((n, i) => (
              <div className="gallery-item" data-speed={[0.9,1.05,0.95,1.1,0.9][i]} key={n}>
                <img src={`/assets/images/gallery-${n}.webp`} alt="" loading="lazy" />
              </div>
            ))}
          </div>
          <div className="gallery-row gallery-row-bottom">
            {[6,7,8,9].map((n, i) => (
              <div
                className={'gallery-item' + (n === 7 ? ' gallery-item-wide' : '')}
                data-speed={[1.05,0.95,1.1,0.9][i]}
                key={n}
              >
                <img src={`/assets/images/gallery-${n}.webp`} alt="" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section className="mission-section">
        <div className="mission-content">
          <p className="mission-text">
            <span className="word">Somos</span>{' '}
            <span className="word">una</span>{' '}
            <span className="word">iniciativa</span>{' '}
            <span className="word word-icon" aria-hidden="true">
              <svg width="53" height="46" viewBox="0 0 53 46" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M20.0642 38.4536C21.1676 37.3216 22.1471 36.1164 22.9652 34.8325C23.7564 33.5905 25.5541 30.7607 26.2807 26.537C26.5283 25.0435 26.5929 23.7701 26.5983 22.9055L26.6144 22.9055C26.6144 22.0775 26.5498 20.7569 26.2969 19.2477C25.5703 15.0659 23.7726 12.1994 22.9814 10.9522C22.131 9.63167 21.1837 8.42639 20.0803 7.33116C18.062 5.29791 15.9468 3.60004 13.514 2.39476C10.4838 0.922229 7.32976 0.172855 4.04658 0.0208857L1.42542 0.0208859C0.257464 0.0575681 0.101378 0.282906 0.036791 1.60347C-0.0870011 4.46994 0.478137 7.18444 1.49 9.78365C2.62566 12.6868 4.20266 15.286 6.1941 17.3979C7.17367 18.4145 9.60108 20.9037 13.3256 22.4496C13.7777 22.6644 14.1706 22.7797 14.4505 22.8845C14.1652 22.9945 13.7723 23.1413 13.3095 23.3247C9.58493 24.8706 7.15753 27.3598 6.17795 28.3764C4.1919 30.4882 2.60951 33.0874 1.47386 35.9906C0.467372 38.6055 -0.135441 41.32 0.0260265 44.1865C0.0852314 45.5437 0.246699 45.7324 1.41465 45.7691L4.03581 45.7691C7.31899 45.6171 10.473 44.8625 13.5032 43.3952C15.9629 42.1899 18.0781 40.4554 20.0696 38.4588L20.0642 38.4536Z" fill="url(#paint0_linear_4614_1031)"/>
<path d="M25.6295 1.59306C25.5057 4.45953 26.0709 7.17403 27.0827 9.77324C28.2184 12.6764 29.7954 15.2756 31.7868 17.3875C32.7664 18.4041 35.1938 20.8932 38.9183 22.4391C39.3705 22.654 39.7634 22.7693 40.0432 22.8741C39.758 22.9841 39.3651 23.1309 38.9022 23.3143C35.1777 24.8602 32.7503 27.3493 31.7707 28.366C29.7846 30.4778 28.2023 33.077 27.0666 35.9802C26.0547 38.5794 25.4573 41.2939 25.6134 44.1604C25.678 45.5176 25.8341 45.7063 27.002 45.743L29.6232 45.743C32.9064 45.591 36.0604 44.8364 39.0906 43.3691C41.5503 42.1638 43.6655 40.4292 45.6569 38.4327C46.7603 37.3008 47.7399 36.0955 48.558 34.8116C49.3492 33.5696 51.1468 30.7398 51.8735 26.5161C52.121 25.0226 52.1856 23.7492 52.191 22.8846L52.2072 22.8846C52.2072 22.0566 52.1426 20.736 51.8896 19.2268C51.163 15.045 49.3653 12.1785 48.5741 10.9313C47.7237 9.61078 46.7765 8.4055 45.6731 7.31027C43.6547 5.27702 41.5395 3.57915 39.1067 2.37387C36.0765 0.901336 32.9225 0.151966 29.6393 -3.59856e-06L27.0182 -3.37917e-06C25.8502 0.0366827 25.6941 0.262013 25.6295 1.58258L25.6295 1.59306Z" fill="url(#paint1_linear_4614_1031)"/>
<defs>
<linearGradient id="paint0_linear_4614_1031" x1="13.3041" y1="45.7691" x2="13.3041" y2="0.0313643" gradientUnits="userSpaceOnUse">
<stop stop-color="#D3F804"/>
<stop offset="1" stop-color="#A2D200"/>
</linearGradient>
<linearGradient id="paint1_linear_4614_1031" x1="38.8968" y1="45.7429" x2="38.8968" y2="0.00523916" gradientUnits="userSpaceOnUse">
<stop stop-color="#D3F804"/>
<stop offset="1" stop-color="#A2D200"/>
</linearGradient>
</defs>
</svg>

            </span>{' '}
            <span className="word">que</span>{' '}
            <span className="word">articula</span>
            <br/>
            <span className="word word-bold">innovación</span>{' '}
            <span className="word word-bold">sistémica</span>{' '}
            <span className="word">para</span>{' '}
            <span className="word">la</span>{' '}
            <span className="word">naturaleza</span>
            <br/>
            <span className="word">en</span>{' '}
            <span className="word">América</span>{' '}
            <span className="word">Latina</span>{' '}
            <span className="word">y</span>{' '}
            <span className="word">el</span>{' '}
            <span className="word">Caribe</span>
          </p>
          <a href="#" className="btn-glass-outline css-glass" id="mission-cta">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Ver Hitos
          </a>
        </div>
      </section>

      {/* POSSIBILITIES */}
      <section className="possibilities-section">
        <div className="possibilities-header">
          <div className="possibilities-title-group">
            <div className="possibilities-icon">
              <img src="/assets/images/logo.svg" alt="" width="32" height="29" />
            </div>
            <h2 className="section-title" id="possibilities-title">
              <span className="line-mask"><span className="line-inner">Enraizamos</span></span>
              <span className="line-mask"><span className="line-inner">Posibilidades</span></span>
            </h2>
          </div>
          <p className="possibilities-description" id="possibilities-desc">
            La iniciativa impulsa la conservación mediante tecnología, innovación y saberes
            bioculturales, conectando proyectos con financiamiento y colaboración para generar
            impacto sostenible.
          </p>
        </div>

        <div className="cards-grid">
          {[
            { id: 'card-financiamos', title: 'Financiamos', img: '/assets/images/gallery-1.webp', desc: 'Accedemos e intermediamos el financiamiento en proyectos que aceleran la protección con tecnología.' },
            { id: 'card-acompanamos', title: 'Acompañamos', img: '/assets/images/gallery-3.webp', desc: 'Creamos la empresa de soporte digital-biocultura más robusta de la región aliados y las primeras soluciones territoriales.' },
            { id: 'card-conectamos',  title: 'Conectamos',  img: '/assets/images/gallery-4.webp', desc: 'Diseñamos redes de participación y acción entre emprendedores, comunidades, fondos, inversionistas.' },
          ].map((c) => (
            <div className="feature-card" id={c.id} key={c.id}>
              <div className="card-image-wrapper">
                <img src={c.img} alt={c.title} loading="lazy" />
                <div className="card-glass-overlay">
                  <h3 className="card-title">{c.title}</h3>
                  <p className="card-desc">{c.desc}</p>
                  <div className="card-arrow">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C8E632" strokeWidth="2"><path d="M5 12H19M19 12L13 6M19 12L13 18"/></svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PROGRAMS HORIZONTAL */}
      <section className="programs-section">
        <div className="programs-pin-wrap">
          <div className="programs-horizontal-line"></div>
          <div className="programs-container">
            {[
              { logo: '/assets/programs-logos/500.svg',   title: 'NATURA 500', bg: '/assets/images/500-line-bg.webp',   desc: 'Programa para emprendimientos verdes y azules. Acceder a una red, herramientas con IA y oportunidades de financiamiento.', link: 'IR A NATURA 500 →' },
              { logo: '/assets/programs-logos/ceiba.svg', title: 'CEIBA',      bg: '/assets/images/ceiba-line-bg.webp', desc: 'Red de conocimiento y empoderamiento para liderazgos locales en conservación y restauración de ecosistemas.', link: 'IR A CEIBA →' },
              { logo: '/assets/programs-logos/studio.svg',title: 'STUDIO',     bg: '/assets/images/studio-line-bg.webp',desc: 'Laboratorio de innovación tecnológica, co-creando soluciones disruptivas para los desafíos ambientales más urgentes.', link: 'IR A STUDIO →' },
              { logo: '/assets/programs-logos/ecos.svg',  title: 'ECOS',       bg: '/assets/images/ecos-line.webp',     desc: 'Plataforma de comunicación e impacto, amplificando las voces y las historias de quienes protegen la naturaleza.', link: 'IR A ECOS →' },
            ].map((p, i) => (
              <div className="program-panel" key={p.title}>
                <img src={p.bg} alt={p.title} className="program-bg" loading="lazy" />
                <div className="program-overlay"></div>

                {i === 0 && (
                  <div className="program-top-left">
                    <div className="programs-header-label">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C8E632" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                      PROGRAMAS EMBLEMÁTICOS
                    </div>
                  </div>
                )}

                <GlassFrame
                  cornerRadius={28}
                  padding="56px 80px"
                  displacementScale={55}
                  blurAmount={0.1}
                  saturation={130}
                  aberrationIntensity={1.4}
                  elasticity={0.18}
                  className="program-center-card"
                  contentClassName="program-center-stack"
                >
                  <img src={p.logo} alt={`${p.title} Logo`} className="program-logo" />
                  <span className="program-featured">
                    <img src="/assets/icons/Fire.svg" alt="" width="11" height="11" /> DESTACADO
                  </span>
                  <h3 className="program-title">{p.title}</h3>
                  <a href="#" className="btn-glass btn-glass-sm program-cta">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="#101511"><polygon points="5,3 19,12 5,21"/></svg>
                    Ver Video
                  </a>
                </GlassFrame>

                <div className="program-bottom-bar">
                  <div className="program-desc">{p.desc}</div>
                  <a href="#" className="program-link">{p.link}</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
