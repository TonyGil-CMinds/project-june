'use client';

import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useLanguage } from '../contexts/LanguageContext.jsx';
import { ceibaAbout } from '../data/ceiba-about.js';
import { ceibaPhotos } from '../data/ceiba-photos.js';
import CeibaIcon from './CeibaIcon.jsx';

gsap.registerPlugin(ScrollTrigger, SplitText);
const colors = ['#F4F0BE', '#e4e9ce', '#192C0A', '#243e1b', '#10271e'];
const icons = ['leaf', 'people', 'book', 'connect', 'sprout'];

export default function CeibaJourney({ onJoin, isMember }) {
  const { t, lang } = useLanguage();
  const copy = ceibaAbout[lang];
  const rootRef = useRef(null);
  const scrollRef = useRef(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const mm = gsap.matchMedia();
    mm.add({ desktop: '(min-width: 1100px) and (min-height: 760px)', reduce: '(prefers-reduced-motion: reduce)' }, ({ conditions }) => {
      const { desktop, reduce } = conditions;
      const panels = [...root.querySelectorAll('.ceiba-scene')];
      const rail = root.querySelector('.ceiba-journey-rail');
      const splits = [];
      if (reduce) return;

      let horizontal;
      if (desktop) {
        root.classList.add('is-horizontal');
        horizontal = gsap.to(rail, {
          x: () => -(rail.scrollWidth - root.clientWidth), ease: 'none',
          scrollTrigger: {
            id: 'ceiba-journey', trigger: root, start: 'top top',
            end: () => `+=${(panels.length - 1) * window.innerHeight * 1.3}`,
            scrub: 0.8, pin: true, anticipatePin: 1, invalidateOnRefresh: true,
            onUpdate: self => {
              const position = self.progress * (panels.length - 1);
              const index = Math.min(Math.floor(position), panels.length - 2);
              gsap.set(root, { backgroundColor: gsap.utils.interpolate(colors[index], colors[index + 1], position - index) });
              root.querySelectorAll('.ceiba-journey-nav button').forEach((button, i) => {
                button.setAttribute('aria-current', String(i === Math.round(position)));
              });
              root.querySelector('.ceiba-journey-nav').classList.toggle('on-dark', position > 1.4);
            },
          },
        });
        scrollRef.current = horizontal.scrollTrigger;
      }

      const paths = root.querySelectorAll(desktop ? '.ceiba-vine-horizontal path' : '.ceiba-vine-vertical path');
      paths.forEach(path => {
        const length = path.getTotalLength();
        gsap.fromTo(path, { strokeDasharray: length, strokeDashoffset: length }, {
          strokeDashoffset: 0, ease: 'none',
          scrollTrigger: { trigger: root, start: desktop ? 'top top' : 'top 65%', end: desktop ? () => horizontal.scrollTrigger.end : 'bottom 70%', scrub: 0.5 },
        });
      });

      panels.forEach((panel, index) => {
        const trigger = desktop && index > 0
          ? { trigger: panel, containerAnimation: horizontal, start: 'left 75%', end: 'right left', toggleActions: 'play none none reverse' }
          : { trigger: panel, start: 'top 75%', toggleActions: 'play none none reverse' };
        panel.querySelectorAll('[data-split]').forEach(element => {
          splits.push(SplitText.create(element, {
            type: 'lines', mask: 'lines', autoSplit: true,
            onSplit: self => gsap.from(self.lines, { yPercent: 105, opacity: 0, stagger: 0.07, duration: 0.8, ease: 'power3.out', scrollTrigger: trigger }),
          }));
        });
        gsap.from(panel.querySelector('.ceiba-scene-photo'), {
          y: 35, scale: 0.96, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: trigger,
        });
      });
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
      return () => {
        splits.forEach(split => split.revert());
        scrollRef.current = null;
        root.classList.remove('is-horizontal');
      };
    }, root);
    return () => mm.revert();
  }, [lang]);

  const goTo = index => {
    const trigger = scrollRef.current;
    const target = trigger ? trigger.start + (trigger.end - trigger.start) * index / 4 : rootRef.current.querySelectorAll('.ceiba-scene')[index];
    if (window.naturatechLenis) window.naturatechLenis.scrollTo(target, { immediate: true });
    else if (typeof target === 'number') window.scrollTo(0, target);
    else target.scrollIntoView();
  };

  const titles = [lang === 'es' ? 'Comunidad' : 'Community', lang === 'es' ? 'Diversidad' : 'Diversity', ...copy.pillars.map(p => p.title)];
  return (
    <div className="ceiba-journey" ref={rootRef} key={lang}>
      <div className="ceiba-journey-rail">
        <svg className="ceiba-vine ceiba-vine-horizontal" viewBox="0 0 5000 1000" preserveAspectRatio="none" aria-hidden="true">
          <path d="M-80 820C280 1040 430 600 730 800S1140 1080 1280 770 1680 550 1810 840 2240 1010 2400 740 2700 600 2880 820 3220 1060 3440 790 3750 610 3890 820 4330 1100 4510 820 4840 660 5080 870" />
        </svg>
        <svg className="ceiba-vine ceiba-vine-vertical" viewBox="0 0 1000 5000" preserveAspectRatio="none" aria-hidden="true">
          <path d="M930 -60C520 200 1150 600 920 1000S650 1420 930 1900 700 2500 920 3000 610 3500 920 4000 690 4700 980 5070" />
        </svg>
        {[0, 1, 2, 3, 4].map(index => {
          const pillar = copy.pillars[index - 2];
          const photo = ceibaPhotos[index];
          return (
            <section
              className={`ceiba-scene ceiba-scene-${index} ${index > 1 ? 'is-dark' : ''}`}
              key={index}
              style={{ '--scene-bg': colors[index] }}
              /* Cream scenes: tells AdaptiveContrastLayer to invert the nav.
                 Works in both layouts — horizontally the off-screen scenes fall
                 outside the probe's x range, so only the live one counts. */
              data-nav-contrast={index < 2 ? 'light' : undefined}
              aria-labelledby={`ceiba-scene-title-${index}`} onFocusCapture={event => { if (scrollRef.current && event.target.closest('button, a')) goTo(index); }}>
              <div className="ceiba-scene-content">
                <p className="ceiba-scene-eyebrow"><CeibaIcon name={icons[index]} /><span>{index < 2 ? copy.eyebrow : copy.offerLabel}</span><span className="ceiba-scene-index">0{index + 1} / 05</span></p>
                <h2 id={`ceiba-scene-title-${index}`} data-split>{index === 0 ? copy.title : index === 1 ? copy.diversityTitle : pillar.title + '.'}</h2>
                {index < 2 ? <div className="ceiba-scene-intro">
                  <p data-split>{index === 0 ? copy.intro : copy.diversity}</p>
                  <p data-split>{index === 0 ? copy.practice : copy.innovation}</p>
                </div> : <>
                  <p className="ceiba-scene-lead" data-split>{pillar.summary}</p>
                  <div className="ceiba-scene-points">
                    {pillar.items.map((item, i) => <div className="ceiba-scene-point" key={item.title}>
                      <CeibaIcon name={['book', 'connect', 'sprout'][i]} size={20} />
                      <div><h3 data-split>{item.title}</h3><p data-split>{item.text}</p>{item.note && <p className="ceiba-scene-note">{item.note}</p>}</div>
                    </div>)}
                  </div>
                </>}
                {index === 4 && <button type="button" className="ceiba-community-cta" onClick={onJoin} aria-haspopup="dialog">{isMember ? t.ceiba.joinedCta : copy.joinCta}<CeibaIcon name="arrow" size={20} /></button>}
              </div>
              <figure className="ceiba-scene-photo">
                <img src={photo.src} alt={photo.alt[lang]} loading="lazy" decoding="async" />
                <figcaption><span>CEIBA 2025</span><span>{lang === 'es' ? 'Cali, Colombia' : 'Cali, Colombia'}</span></figcaption>
              </figure>
            </section>
          );
        })}
      </div>
      <nav className="ceiba-journey-nav" aria-label={lang === 'es' ? 'Explora la comunidad' : 'Explore the community'}>
        <span className="ceiba-journey-hint">{lang === 'es' ? 'Sigue explorando' : 'Keep exploring'} <CeibaIcon name="arrow" size={16} /></span>
        {titles.map((title, index) => <button key={title} type="button" onClick={() => goTo(index)} aria-current={index === 0 ? 'true' : 'false'}><span>0{index + 1}</span>{title}</button>)}
      </nav>
    </div>
  );
}
