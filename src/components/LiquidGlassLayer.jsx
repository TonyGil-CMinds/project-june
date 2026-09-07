'use client';

import { useEffect } from 'react';
import { attachLiquidGlass, supportsLiquidGlass } from '../lib/liquidGlass.js';

/**
 * Upgrades every glass surface on the page to real backdrop refraction.
 *
 * Mounted once from AppShell. Rather than threading a ref through each of the
 * ~15 glass surfaces — several of which are rendered inside `.map()` — it
 * watches the DOM for the shared glass classes and attaches the engine itself,
 * so new buttons and cards get the effect without any wiring.
 *
 * Per-surface tuning goes on the element as data attributes:
 *   data-liquid-glass       mark a surface that has none of the glass classes
 *   data-liquid-glass="off" opt a surface out
 *   data-liquid-depth       rim thickness in px      (default: 24% of short side)
 *   data-liquid-strength    peak displacement in px  (default: 1.15 x depth)
 *   data-liquid-chromatic   colour fringe, 0 to ~0.3 (default: 0.14)
 *   data-liquid-blur        backdrop blur in px      (default: 0, fully clear)
 */

const SELECTOR = [
  '.css-glass',
  '.btn-glass',
  '.btn-glass-outline',
  '[data-liquid-glass]',
].join(', ');

function readOptions(element) {
  const data = element.dataset;
  const number = (raw) => {
    if (raw == null || raw === '') return undefined;
    const value = Number(raw);
    return Number.isFinite(value) ? value : undefined;
  };

  return {
    depth: number(data.liquidDepth),
    strength: number(data.liquidStrength),
    chromatic: number(data.liquidChromatic),
    blur: number(data.liquidBlur),
    radius: number(data.liquidRadius),
  };
}

export default function LiquidGlassLayer() {
  useEffect(() => {
    if (!supportsLiquidGlass()) return undefined;

    const attached = new Map();
    let frame = 0;

    const sync = () => {
      attached.forEach((detach, element) => {
        if (element.isConnected) return;
        detach();
        attached.delete(element);
      });

      document.querySelectorAll(SELECTOR).forEach((element) => {
        if (attached.has(element) || element.dataset.liquidGlass === 'off') return;
        attached.set(element, attachLiquidGlass(element, readOptions(element)));
      });
    };

    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(sync);
    };

    schedule();

    // childList only: GSAP's inline style writes must not trigger a rescan.
    const observer = new MutationObserver(schedule);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      attached.forEach((detach) => detach());
      attached.clear();
    };
  }, []);

  return null;
}
