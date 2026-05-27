'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cleanupGsapRoute } from '../utils/cleanupGsapRoute.js';
import { useLanguage } from '../contexts/LanguageContext.jsx';

gsap.registerPlugin(ScrollTrigger);

export default function Ecos() {
  const rootRef = useRef(null);
  const { t } = useLanguage();

  /* ── 3-D card refs ── */
  const launchCardRef  = useRef(null);
  const launchGlowRef  = useRef(null);
  const launchSceneRef = useRef(null);

  /* ── Comment section ref ── */
  const commentSectionRef = useRef(null);

  /* ── Publish section ── */
  const publishCardRef = useRef(null);
  const [pubDark, setPubDark] = useState(false);

  useEffect(() => {
    if (!rootRef.current) return;

    const ctx = gsap.context(() => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (!reduceMotion) {
        gsap.fromTo(
          '.ecos-subject-anchor',
          { '--subject-anchor-scale': 1.08 },
          { '--subject-anchor-scale': 1, duration: 1.4, ease: 'power3.out' }
        );
      }



      gsap.to('.ecos-subject', {
        yPercent: 12,
        scale: 1.03,
        ease: 'none',
        scrollTrigger: {
          trigger: '.ecos-hero',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.6,
        },
      });

      gsap.from('.ecos-content-inner', {
        y: 52,
        opacity: 0,
        duration: 1,
        delay: 0.12,
        ease: 'power3.out',
      });

      gsap.from('.ecos-giant-word', {
        y: 70,
        opacity: 0,
        duration: 1.1,
        delay: 0.08,
        ease: 'power3.out',
      });

      /* ── LAUNCHES entrance ── */
      gsap.from('.ecos-launches-title', {
        y: 44, opacity: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: '.ecos-launches', start: 'top 82%', toggleActions: 'play none none none' },
      });
      gsap.from('.ecos-launches-badge', {
        scale: 0.65, opacity: 0, duration: 0.55, delay: 0.14, ease: 'back.out(2.2)',
        scrollTrigger: { trigger: '.ecos-launches', start: 'top 82%', toggleActions: 'play none none none' },
      });
      gsap.from('.ecos-launches-card', {
        y: 70, opacity: 0, scale: 0.93, duration: 1.1, delay: 0.08, ease: 'power3.out',
        scrollTrigger: { trigger: '.ecos-launches', start: 'top 78%', toggleActions: 'play none none none' },
      });
      gsap.from('.ecos-launches-action-btn', {
        y: 18, opacity: 0, stagger: 0.08, duration: 0.5, ease: 'power3.out',
        scrollTrigger: { trigger: '.ecos-launches', start: 'top 74%', toggleActions: 'play none none none' },
      });

      /* ── COMMENT SCROLLYTELLING ── */
      const commentWordEls = gsap.utils.toArray('.ecos-comment-word');

      // Initial state — GSAP owns this; prevents CSS flash
      gsap.set('.ecos-comment-box', { y: 28, opacity: 0 });

      if (commentWordEls.length) {
        const WORD_DUR  = 0.14;
        const WORDS_START = 1.3;

        const commentTl = gsap.timeline({
          scrollTrigger: {
            trigger: '.ecos-comment',
            start: 'top top',
            end: '+=300vh',
            pin: true,
            anticipatePin: 1,
            scrub: 1.8,
          },
        });

        // Section entrance
        commentTl.from('.ecos-comment-inner', {
          y: 36, opacity: 0, duration: 1.2, ease: 'power3.out',
        }, 0);

        // Floating squares emerge outward from text area
        commentTl.from('.ecos-float-sq--1', {
          x: 90, y: -70, scale: 0, opacity: 0, duration: 1.6, ease: 'back.out(1.7)',
        }, 0.2);
        commentTl.from('.ecos-float-sq--2', {
          x: -75, y: 60, scale: 0, opacity: 0, duration: 1.6, ease: 'back.out(1.7)',
        }, 0.4);

        // Progressive word highlight
        commentWordEls.forEach((word, i) => {
          commentTl.to(word, {
            backgroundColor: 'rgba(200, 230, 50, 0.9)',
            color: '#101511',
            duration: WORD_DUR,
            ease: 'none',
          }, WORDS_START + i * WORD_DUR);
        });

        // Comment box slides in after text is fully highlighted
        const BOX_AT = WORDS_START + commentWordEls.length * WORD_DUR - 0.4;
        commentTl.to('.ecos-comment-box', {
          y: 0, opacity: 1, duration: 2, ease: 'power3.out',
        }, BOX_AT);
      }

      /* ── PUBLISH SCROLLYTELLING ── */
      gsap.set('.ecos-pub-drag',    { opacity: 0 });
      gsap.set('.ecos-pub-success', { opacity: 0 });

      const pubTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.ecos-publish',
          start: 'top top',
          end: '+=380vh',
          pin: true,
          anticipatePin: 1,
          scrub: 1.8,
          onUpdate(self) {
            const card = document.querySelector('.ecos-publish-card');
            if (!card) return;
            const p = self.progress;
            card.classList.toggle('is-drag',    p >= 0.38 && p < 0.72);
            card.classList.toggle('is-success', p >= 0.72);
          },
        },
      });

      pubTl.from('.ecos-publish-inner', { y: 36, opacity: 0, duration: 1.2, ease: 'power3.out' }, 0);

      // Stage 1 → 2 : idle → drag-over
      pubTl.to('.ecos-pub-idle', { opacity: 0, duration: 0.6 }, 2.5);
      pubTl.to('.ecos-pub-drag', { opacity: 1, duration: 0.6 }, 2.5);
      pubTl.fromTo('.ecos-pub-drag-icon',
        { y: -70, scale: 0.82, opacity: 0, rotate: -4 },
        { y: 0,   scale: 1,    opacity: 1, rotate: 0, duration: 1, ease: 'back.out(1.5)' },
        2.6
      );

      // Stage 2 → 3 : drag-over → success
      pubTl.to('.ecos-pub-drag',    { opacity: 0, duration: 0.55 }, 5.2);
      pubTl.to('.ecos-pub-success', { opacity: 1, duration: 0.55 }, 5.2);
      pubTl.from('.ecos-pub-check-circle',
        { scale: 0, opacity: 0, duration: 0.9, ease: 'back.out(2.2)' }, 5.5
      );
      pubTl.from('.ecos-pub-success h3',
        { y: 18, opacity: 0, duration: 0.7, ease: 'power3.out' }, 5.9
      );
      pubTl.from('.ecos-pub-success p',
        { y: 14, opacity: 0, duration: 0.6, ease: 'power3.out' }, 6.1
      );
    }, rootRef);

    return () => {
      cleanupGsapRoute(rootRef.current);
      ctx.revert();
    };
  }, []);

  /* ── 3-D tilt handlers ── */
  const handleLaunchMouseMove = useCallback((e) => {
    const card = launchCardRef.current;
    const glow = launchGlowRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;   // 0 → 1
    const y = (e.clientY - rect.top)  / rect.height;  // 0 → 1
    const cx = x - 0.5;  // -0.5 → 0.5
    const cy = y - 0.5;

    gsap.to(card, {
      transformPerspective: 1200,
      rotateX: cy * -16,
      rotateY: cx * 16,
      scale: 1.04,
      duration: 0.35,
      ease: 'power2.out',
      overwrite: 'auto',
    });

    if (glow) {
      glow.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(200,230,50,0.52) 0%, rgba(200,230,50,0.18) 38%, transparent 66%)`;
      gsap.to(glow, { opacity: 1, duration: 0.15, overwrite: 'auto' });
    }
  }, []);

  /* ── Floating squares cursor parallax ── */
  const handleCommentMouseMove = useCallback((e) => {
    const section = commentSectionRef.current;
    if (!section) return;
    const rect = section.getBoundingClientRect();
    const mx = (e.clientX - rect.left - rect.width  / 2) / rect.width;
    const my = (e.clientY - rect.top  - rect.height / 2) / rect.height;

    section.querySelectorAll('.ecos-float-sq').forEach((sq) => {
      const depth = parseFloat(sq.dataset.depth) || 1;
      gsap.to(sq, {
        x: mx * 55 * depth,
        y: my * 40 * depth,
        duration: 1,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    });
  }, []);

  const handleLaunchMouseLeave = useCallback(() => {
    const card = launchCardRef.current;
    const glow = launchGlowRef.current;
    if (!card) return;

    gsap.to(card, {
      rotateX: 0, rotateY: 0, scale: 1,
      duration: 0.9,
      ease: 'elastic.out(1, 0.5)',
      overwrite: 'auto',
    });
    if (glow) gsap.to(glow, { opacity: 0, duration: 0.45, overwrite: 'auto' });
  }, []);

  return (
    <div ref={rootRef}>
      <section className="ecos-hero" id="ecos">
        <div className="ecos-bg-wrapper">
          <img src="/assets/Ecos/bg-ecos.avif" alt="" className="ecos-bg" />
        </div>

        <div className="ecos-giant-text" aria-hidden="true">
          <span className="ecos-giant-word">{t.ecos.giantWord}</span>
        </div>

        <div className="ecos-subject-wrapper">
          <div className="ecos-subject-anchor">
            <img
              src="/assets/Ecos/subject-ecos.avif"
              alt={t.ecos.subjectAlt}
              className="ecos-subject"
            />
          </div>
        </div>

        <div className="ecos-overlay" aria-hidden="true" />

        <div className="ecos-content">
          <div className="ecos-content-inner">
            <div className="ecos-header-label">
              <img src="/assets/icons/Navbar/ecos.svg" alt="" width="16" height="17" />
              {t.ecos.headerLabel}
            </div>

            <h1 className="ecos-heading">
              <span className="ecos-heading-line">{t.ecos.heading1}</span>
              <span className="ecos-heading-line ecos-heading-accent">
                <span className="amp">&amp;</span> {t.ecos.heading2}
              </span>
            </h1>

            <p className="ecos-description">{t.ecos.desc}</p>

            <a href="https://ecos.naturatech.org/" className="btn-glass hero-cta-button ecos-cta-button">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2.5L14.58 9.42L21.5 12L14.58 14.58L12 21.5L9.42 14.58L2.5 12L9.42 9.42L12 2.5Z" />
              </svg>
              {t.ecos.cta}
            </a>
          </div>
        </div>
      </section>

      {/* ════════════ LAUNCHES ════════════ */}
      <section className="ecos-launches">
        <div className="ecos-launches-header">
          <h2 className="ecos-launches-title">{t.ecos.launchesTitle}</h2>
          <span className="ecos-launches-badge">{t.ecos.launchesBadge}</span>
        </div>

        <div
          className="ecos-launches-scene"
          ref={launchSceneRef}
          onMouseMove={handleLaunchMouseMove}
          onMouseLeave={handleLaunchMouseLeave}
        >
          <div className="ecos-launches-glow" ref={launchGlowRef} />
          <div className="ecos-launches-card" ref={launchCardRef}>
            <img
              src="/assets/Ecos/docecos.png"
              alt={t.ecos.launchesDocAlt}
              draggable="false"
            />
          </div>
        </div>

        <div className="ecos-launches-actions">
          <button className="ecos-launches-action-btn" type="button" aria-label={t.ecos.tooltipComment}>
            <img src="/assets/Ecos/comment.svg" alt="" />
            <span className="ecos-action-tooltip" aria-hidden="true">{t.ecos.tooltipComment}</span>
          </button>
          <button className="ecos-launches-action-btn" type="button" aria-label={t.ecos.tooltipPublish}>
            <img src="/assets/Ecos/publish.svg" alt="" />
            <span className="ecos-action-tooltip" aria-hidden="true">{t.ecos.tooltipPublish}</span>
          </button>
        </div>
      </section>
      {/* ════════════ COMMENT SCROLLYTELLING ════════════ */}
      <section
        className="ecos-comment"
        ref={commentSectionRef}
        onMouseMove={handleCommentMouseMove}
      >
        {/* Floating squares — emerge from text, then follow cursor */}
        <div className="ecos-float-sq ecos-float-sq--1" data-depth="1.4" aria-hidden="true" />
        <div className="ecos-float-sq ecos-float-sq--2" data-depth="0.8" aria-hidden="true" />

        <div className="ecos-comment-inner">
          <header className="ecos-comment-header">
            <h2 className="ecos-comment-title">{t.ecos.commentTitle}</h2>
            <button className="ecos-comment-plus" type="button" aria-label="Añadir">+</button>
          </header>

          <p className="ecos-comment-body">
            {t.ecos.commentBody.split(' ').map((word, i) => (
              <span key={i} className="ecos-comment-word">{word}{' '}</span>
            ))}
          </p>

          <div className="ecos-comment-box">
            <input
              className="ecos-comment-input"
              type="text"
              placeholder={t.ecos.commentPlaceholder}
            />
            <button className="ecos-comment-send" type="button" aria-label={t.ecos.tooltipComment}>
              <img src="/assets/Ecos/sendcomment.svg" alt="" />
            </button>
          </div>
        </div>
      </section>
      {/* ════════════ PUBLISH SCROLLYTELLING ════════════ */}
      <section className={`ecos-publish${pubDark ? ' is-dark' : ''}`}>

        {/* Dark / Light toggle */}
        <button
          className="ecos-publish-toggle"
          type="button"
          aria-label={pubDark ? t.ecos.publishToggleLight : t.ecos.publishToggleDark}
          onClick={() => setPubDark((v) => !v)}
        >
          {pubDark ? (
            /* Sun icon — switch to light */
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            /* Moon icon — switch to dark */
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>

        <div className="ecos-publish-inner" ref={publishCardRef}>
          <header className="ecos-publish-header">
            <h2 className="ecos-publish-title">{t.ecos.publishTitle}</h2>
            <img src="/assets/Ecos/publish.svg" alt="" className="ecos-publish-icon" aria-hidden="true" />
          </header>

          <div className="ecos-publish-card">

            {/* State 1 — idle */}
            <div className="ecos-pub-state ecos-pub-idle">
              <img src="/assets/Ecos/uploadArchive.svg" alt="" className="ecos-pub-idle-icon" />
              <h3>{t.ecos.publishIdleHeading}</h3>
              <p>{t.ecos.publishIdleSub}</p>
              <button className="ecos-pub-file-btn" type="button">{t.ecos.publishIdleBtn}</button>
            </div>

            {/* State 2 — drag-over */}
            <div className="ecos-pub-state ecos-pub-drag">
              <img src="/assets/Ecos/docecos.png" alt="" className="ecos-pub-drag-icon" />
              <h3>{t.ecos.publishDragHeading}</h3>
              <p>{t.ecos.publishDragSub}</p>
            </div>

            {/* State 3 — success */}
            <div className="ecos-pub-state ecos-pub-success">
              <div className="ecos-pub-check-circle">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#101511" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h3>{t.ecos.publishSuccessHeading}</h3>
              <p>{t.ecos.publishSuccessSub}</p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
