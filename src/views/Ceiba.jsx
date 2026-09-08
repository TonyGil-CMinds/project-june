'use client';

import { Fragment, useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cleanupGsapRoute } from '../utils/cleanupGsapRoute.js';
import { useLanguage } from '../contexts/LanguageContext.jsx';
import CeibaJoinSheet from '../components/CeibaJoinSheet.jsx';

gsap.registerPlugin(ScrollTrigger);

const CEIBA_MEMBER_KEY = 'ceiba-community-member';

/* Gallery images */
const galleryImages = [
  '/assets/CEIBA/galeria-ceiba-1.avif',
  '/assets/CEIBA/galeria-ceiba-2.avif',
  '/assets/CEIBA/galeria-ceiba-3.avif',
  '/assets/CEIBA/galeria-ceiba-4.avif',
];

/* Shape divider assets */
const shapes = [
  '/assets/CEIBA/ceiba-shape-1.avif',
  '/assets/CEIBA/ceiba-shape-2.avif',
  '/assets/CEIBA/ceiba-shape-3.avif',
  '/assets/CEIBA/ceiba-shape-4.avif',
];

/* Persona photos for podcast section */
const personas = [
  '/assets/CEIBA/ceiba-persona-1.avif',
  '/assets/CEIBA/ceiba-persona-2.avif',
  '/assets/CEIBA/ceiba-persona-3.avif',
  '/assets/CEIBA/ceiba-persona-4.avif',
];

/* Natural burst sound — shaped noise, no oscillators */
function playBurstSound() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return;
  const ctx = new AudioCtx();
  const now = ctx.currentTime;

  const makeNoise = (durationSec) => {
    const len = Math.floor(ctx.sampleRate * durationSec);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    return src;
  };

  // Layer 1 — soft low-mid puff (body of the sound)
  const puff = makeNoise(0.18);
  const lpf = ctx.createBiquadFilter();
  lpf.type = 'lowpass';
  lpf.frequency.value = 600;
  const bpf = ctx.createBiquadFilter();
  bpf.type = 'bandpass';
  bpf.frequency.value = 280;
  bpf.Q.value = 1.2;
  const gPuff = ctx.createGain();
  puff.connect(lpf); lpf.connect(bpf); bpf.connect(gPuff); gPuff.connect(ctx.destination);
  gPuff.gain.setValueAtTime(0, now);
  gPuff.gain.linearRampToValueAtTime(0.18, now + 0.022);
  gPuff.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
  puff.start(now);

  // Layer 2 — airy high-freq shimmer (leaves/seeds dispersing)
  const shimmer = makeNoise(0.28);
  const hpf = ctx.createBiquadFilter();
  hpf.type = 'highpass';
  hpf.frequency.value = 3200;
  const gShimmer = ctx.createGain();
  shimmer.connect(hpf); hpf.connect(gShimmer); gShimmer.connect(ctx.destination);
  gShimmer.gain.setValueAtTime(0, now);
  gShimmer.gain.linearRampToValueAtTime(0.06, now + 0.035);
  gShimmer.gain.exponentialRampToValueAtTime(0.001, now + 0.32);
  shimmer.start(now);

  setTimeout(() => ctx.close(), 600);
}

/* Burst assets for logo click effect */
const BURST_ASSETS = [
  '/assets/CEIBA/illustrations/asset1.svg',
  '/assets/CEIBA/illustrations/asset2.svg',
  '/assets/CEIBA/illustrations/asset3.svg',
  '/assets/CEIBA/illustrations/asset4.svg',
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
  const { t } = useLanguage();
  const [joinOpen, setJoinOpen] = useState(false);
  const [isMember, setIsMember] = useState(false);

  /**
   * Remembers that this browser already registered, so the hero CTA reads as a
   * status instead of an invitation on a return visit.
   *
   * Read in an effect, never during render: /ceiba is statically prerendered,
   * so touching localStorage in the render pass would cause a hydration
   * mismatch. It also means the button starts as "join" for one frame, which is
   * the correct default when we don't know yet.
   */
  useEffect(() => {
    try {
      setIsMember(localStorage.getItem(CEIBA_MEMBER_KEY) === 'true');
    } catch (_) {
      /* private mode / blocked storage — stay with the join label */
    }
  }, []);

  const handleJoined = () => {
    setIsMember(true);
    try {
      localStorage.setItem(CEIBA_MEMBER_KEY, 'true');
    } catch (_) {}
  };
  const logoImgRef = useRef(null);
  const burstLayerRef = useRef(null);
  const logoClickCountRef = useRef(0);
  const ceibaAudioRef = useRef(null);

  useEffect(() => {
    if (!rootRef.current) return;

    let scrollVel = 0;
    let tick = null;

    const ctx = gsap.context(() => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (!reduceMotion) {
        gsap.fromTo(
          '.ceiba-subject-anchor',
          { '--subject-anchor-scale': 1.08 },
          { '--subject-anchor-scale': 1, duration: 1.4, ease: 'power3.out' }
        );
      }

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

      /* ─── GALLERY PIN (300vh total scroll) ─── */
      ScrollTrigger.create({
        trigger: '.ceiba-gallery',
        start: 'top top',
        end: '+=200vh',
        pin: true,
        anticipatePin: 1,
        onUpdate(self) {
          scrollVel = self.getVelocity();
        },
      });

      /* ─── IMAGE CAROUSEL (constant speed) ─── */
      const track = document.querySelector('.ceiba-gallery-track');
      if (track) {
        const totalWidth = track.scrollWidth / 2;
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

      /* ─── VELOCITY MARQUEES ─── */
      const marqueeTop = document.querySelector('.ceiba-marquee-top .ceiba-marquee-inner');
      const marqueeBot = document.querySelector('.ceiba-marquee-bot .ceiba-marquee-inner');

      if (marqueeTop && marqueeBot) {
        const topHalfW = marqueeTop.scrollWidth / 2;
        const botHalfW = marqueeBot.scrollWidth / 2;
        let topX = 0;
        let botX = 0;

        tick = () => {
          const boost = Math.min(Math.abs(scrollVel) * 0.003, 4);
          const spd = 0.7 + boost;
          topX = (topX + spd) % topHalfW;
          botX = (botX + spd) % botHalfW;
          gsap.set(marqueeTop, { x: topX - topHalfW });
          gsap.set(marqueeBot, { x: -botX });
          scrollVel *= 0.88;
        };
        gsap.ticker.add(tick);
      }

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
      if (tick) gsap.ticker.remove(tick);
      if (ceibaAudioRef.current) { ceibaAudioRef.current.pause(); ceibaAudioRef.current = null; }
      cleanupGsapRoute(rootRef.current);
      ctx.revert();
    };
  }, []);



  const handleLogoClick = () => {
    const img = logoImgRef.current;
    const layer = burstLayerRef.current;
    if (!img || !layer) return;

    logoClickCountRef.current += 1;
    const clickN = logoClickCountRef.current;

    // 4th click onwards — toggle the CEIBA anthem
    if (clickN === 4) {
      const audio = new Audio('/assets/CEIBA/Music/Mi%20Tierra%2C%20Tu%20Tierra%20%20(1).mp3');
      audio.volume = 0.7;
      audio.loop = false;
      ceibaAudioRef.current = audio;
      audio.play().catch(() => {});
    } else if (clickN > 4 && ceibaAudioRef.current) {
      const a = ceibaAudioRef.current;
      if (a.paused) { a.play().catch(() => {}); } else { a.pause(); }
    }

    playBurstSound();

    // Logo squish + elastic bounce
    gsap.timeline()
      .to(img, { scale: 0.74, duration: 0.11, ease: 'power3.in' })
      .to(img, { scale: 1, duration: 0.75, ease: 'elastic.out(1.1, 0.38)' });

    // Burst particles
    const rect = img.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const count = 8;

    // Max distance from logo center to farthest viewport corner
    const maxDist = Math.max(
      Math.hypot(cx, cy),
      Math.hypot(window.innerWidth - cx, cy),
      Math.hypot(cx, window.innerHeight - cy),
      Math.hypot(window.innerWidth - cx, window.innerHeight - cy),
    );

    for (let i = 0; i < count; i++) {
      const el = document.createElement('img');
      el.src = BURST_ASSETS[i % BURST_ASSETS.length];
      layer.appendChild(el);

      const baseAngle = (360 / count) * i;
      const angle = baseAngle + (Math.random() - 0.5) * 55;
      const distance = maxDist * (0.55 + Math.random() * 0.5);
      const rad = (angle * Math.PI) / 180;
      const dx = Math.cos(rad) * distance;
      const dy = Math.sin(rad) * distance;
      const size = 40 + Math.random() * 44;
      const totalDuration = 1.4 + Math.random() * 0.8;
      const delay = Math.random() * 0.1;

      gsap.set(el, {
        position: 'fixed',
        left: cx,
        top: cy,
        xPercent: -50,
        yPercent: -50,
        width: size,
        height: size,
        scale: 0.1,
        opacity: 1,
        zIndex: 200,
        pointerEvents: 'none',
      });

      // Phase 1: snap to full size quickly
      // Phase 2: travel outward while fading
      const tl = gsap.timeline({ delay, onComplete: () => el.remove() });
      tl.to(el, {
        x: dx * 0.18,
        y: dy * 0.18,
        scale: 1,
        opacity: 1,
        duration: totalDuration * 0.18,
        ease: 'power3.out',
      }).to(el, {
        x: dx,
        y: dy,
        opacity: 0,
        duration: totalDuration * 0.82,
        ease: 'power1.out',
      });
    }
  };

  return (
    <div ref={rootRef}>
      <div ref={burstLayerRef} className="ceiba-burst-layer" aria-hidden="true" />
      {/* ════════════ HERO ════════════ */}
      <section className="ceiba-hero">
        <div className="ceiba-bg-wrapper">
          <img src="/assets/CEIBA/bg-ceiba.avif" alt="" className="ceiba-bg" />
        </div>

        <div className="ceiba-giant-text" aria-hidden="true">
          {t.ceiba.giantText.split('').map((ch, i) => (
            <span key={i} className="giant-letter ceiba-letter" data-speed={[0.7, 0.9, 1.1, 0.8, 1.0, 0.85, 1.15, 0.95][i]}>{ch}</span>
          ))}
        </div>

        <div className="ceiba-subject-wrapper">
          <div className="ceiba-subject-anchor">
            <img src="/assets/CEIBA/lina-subject.avif" alt="Speaker CEIBA" className="ceiba-subject" />
          </div>
        </div>

        <div className="ceiba-overlay" aria-hidden="true" />

        <div className="ceiba-content">
          <div className="ceiba-content-inner">
            <div className="ceiba-header-label">
              <img src="/assets/CEIBA/ceiba-icon.svg" alt="" width="22" height="22" />
              {t.ceiba.headerLabel}
            </div>
            <h1 className="ceiba-heading">
              <span className="ceiba-heading-line">{t.ceiba.heading1}</span>
              <span className="ceiba-heading-line ceiba-heading-accent"><span className="amp">&amp;</span> {t.ceiba.heading2}</span>
            </h1>
            <p className="ceiba-description">
              {t.ceiba.desc.map((line, i) => (
                <span key={i} className="ceiba-mobile-line">{line}{i < t.ceiba.desc.length - 1 ? ' ' : ''}</span>
              ))}
            </p>
            <button
              type="button"
              onClick={() => setJoinOpen(true)}
              className={'btn-glass hero-cta-button' + (isMember ? ' is-member' : '')}
              aria-haspopup="dialog"
              aria-expanded={joinOpen}
            >
              {isMember ? (
                <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M20 6L9 17l-5-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" /></svg>
              )}
              {isMember ? t.ceiba.joinedCta : t.ceiba.heroCta}
            </button>
          </div>

          <div className="ceiba-bottom-center">
            <div className="hero-scroll-indicator">
              <span>{t.common.scroll}</span>
              <svg width="16" height="24" viewBox="0 0 16 24" fill="none" stroke="#C8E632" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 4L8 20M8 20L2 14M8 20L14 14" /></svg>
            </div>
          </div>
        </div>
      </section>


      {/* ════════════ GALLERY + MARQUEES ════════════ */}
      <section className="ceiba-gallery">

        {/* TOP MARQUEE — moves right */}
        <div className="ceiba-marquee ceiba-marquee-top" aria-hidden="true">
          <div className="ceiba-marquee-inner">
            {[...Array(12)].map((_, i) => (
              <Fragment key={i}>
                <img src="/assets/CEIBA/illustrations/marquesee-somosraíces.svg" alt="" className="ceiba-marquee-text" />
                <img src="/assets/CEIBA/illustrations/marquesee-yellowelement.svg" alt="" className="ceiba-marquee-dot" />
              </Fragment>
            ))}
          </div>
        </div>

        {/* IMAGE CAROUSEL */}
        <div className="ceiba-gallery-carousel">
          <div className="ceiba-gallery-track">
            {[...galleryImages, ...galleryImages].map((src, i) => (
              <div key={i} className="ceiba-gallery-item">
                <img src={src} alt={`Galería CEIBA ${(i % galleryImages.length) + 1}`} loading="lazy" />
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM MARQUEE — moves left */}
        <div className="ceiba-marquee ceiba-marquee-bot" aria-hidden="true">
          <div className="ceiba-marquee-inner">
            {[...Array(12)].map((_, i) => (
              <Fragment key={i}>
                <img src="/assets/CEIBA/illustrations/marquesee-somosceibas.svg" alt="" className="ceiba-marquee-text" />
                <img src="/assets/CEIBA/illustrations/marquesee-greenelement.svg" alt="" className="ceiba-marquee-dot" />
              </Fragment>
            ))}
          </div>
        </div>

      </section>

      {/* ════════════ INFO / SUMMIT SECTION ════════════ */}
      <section className="ceiba-info">
        <div className="ceiba-info-inner">
          <div className="ceiba-info-logo" onClick={handleLogoClick} role="button" tabIndex={0} aria-label="CEIBA logo" onKeyDown={e => e.key === 'Enter' && handleLogoClick()}>
            <img ref={logoImgRef} src="/assets/CEIBA/Logos - Dark.svg" alt="CEIBA — Cumbre de Innovación e Inversión para la Biodiversidad" />
          </div>
          <p className="ceiba-info-sub">{t.ceiba.infoSub}</p>
          <div className="ceiba-info-divider" />
          <div className="ceiba-info-text">
            <p>{t.ceiba.infoText}</p>
          </div>
          <a href="/galeriaceiba" target="_self" rel="noreferrer" className="btn-glass ceiba-info-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="5,3 19,12 5,21" /></svg>
            {t.ceiba.infoButton}
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
          <p className="ceiba-podcast-desc">{t.ceiba.podcastDesc}</p>

          <div className="ceiba-podcast-socials">
            {podcastLinks.map((link) => (
              <a key={link.id} href={link.href} target="_blank" rel="noreferrer" aria-label={link.label} className="ceiba-social-btn">
                <span className="ceiba-social-icon" style={{ WebkitMaskImage: `url(${link.icon})`, maskImage: `url(${link.icon})` }} />
              </a>
            ))}
          </div>
        </div>
      </section>

      <CeibaJoinSheet
        open={joinOpen}
        onClose={() => setJoinOpen(false)}
        onJoined={handleJoined}
      />
    </div>
  );
}
