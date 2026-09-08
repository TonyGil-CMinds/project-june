'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';

/**
 * Inverts floating chrome when it sits over a light section.
 *
 * Two opt-in attributes, no page knowledge on either side:
 *   [data-nav-contrast="light"]  a section with a light background
 *   [data-nav-adaptive]          a floating surface that should invert over one
 *
 * The surface gets `.is-on-light` toggled on it; the styling lives in base.css.
 *
 * Mounted once from AppShell rather than living in Nav, because the nav pill,
 * the nav logo and the language switcher are separate components with the same
 * problem — and Nav reaching into the language switcher's DOM would be worse.
 *
 * Each surface is tested independently: on mobile the logo is pinned to the top
 * and the pill to the bottom, so they are frequently over different sections.
 *
 * Rects are read every frame, which is what makes this hold up across GSAP's
 * pinned sections and the mobile pill's auto-hide — both move under the
 * chrome with no scroll event to react to.
 */

const SECTION_SELECTOR = '[data-nav-contrast="light"]';
const SURFACE_SELECTOR = '[data-nav-adaptive]';

export default function AdaptiveContrastLayer() {
  useEffect(() => {
    let sections = [];
    let surfaces = [];

    const collect = () => {
      sections = Array.from(document.querySelectorAll(SECTION_SELECTOR));
      surfaces = Array.from(document.querySelectorAll(SURFACE_SELECTOR));
    };

    const isOverLight = (element) => {
      if (!sections.length) return false;

      const rect = element.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return false;

      // Probe the centre, so a surface flips once it is more than half over.
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;

      return sections.some((section) => {
        const bounds = section.getBoundingClientRect();
        return y >= bounds.top && y <= bounds.bottom && x >= bounds.left && x <= bounds.right;
      });
    };

    const update = () => {
      surfaces.forEach((element) => {
        // classList, not React state: rewriting className on these nodes would
        // drop `is-liquid-glass`, which the glass engine adds imperatively.
        element.classList.toggle('is-on-light', isOverLight(element));
      });
    };

    /**
     * Driven off gsap.ticker rather than scroll events.
     *
     * Scroll is not the only thing that moves these boxes: ScrollTrigger
     * repositions pinned sections after our read, and the mobile pill hides on
     * scroll-down then reappears on an idle timer — both leave a scroll-driven
     * value stale with no event to correct it. The ticker already runs every
     * frame for Lenis, so this adds a handful of rect reads and removes the
     * whole class of bug.
     *
     * Free on pages with no light sections, which is most of them.
     */
    const tick = () => {
      if (!sections.length) return;
      update();
    };

    collect();
    tick();
    gsap.ticker.add(tick);

    // Sections and surfaces arrive late (route content mounting) and get
    // re-parented by ScrollTrigger's pin spacers.
    const observer = new MutationObserver(collect);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      gsap.ticker.remove(tick);
      observer.disconnect();
      surfaces.forEach((element) => element.classList.remove('is-on-light'));
    };
  }, []);

  return null;
}
