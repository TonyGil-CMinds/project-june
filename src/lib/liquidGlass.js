'use client';

/**
 * Liquid glass engine — real backdrop refraction, framework-free.
 *
 * `backdrop-filter` is piped through an SVG `feDisplacementMap` whose map is
 * painted from the signed distance field of the element's own rounded-rect
 * geometry, so a pill, a circle and an 18px-radius card each get a rim that
 * follows their actual shape. R encodes the horizontal sample offset, G the
 * vertical one, 128 = no displacement.
 *
 * Filters are cached by geometry and reference-counted in one shared <svg>, so
 * a row of identically sized buttons costs a single map and a single filter.
 *
 * Only Chromium honours `url()` inside `backdrop-filter`; Safari and Firefox
 * drop the whole declaration, which would take the fallback blur down with it.
 * There `attachLiquidGlass` is a no-op and the `.css-glass` /
 * `--glass-strong-filter` styling stays exactly as it is.
 */

const SVG_NS = 'http://www.w3.org/2000/svg';
const DEFS_ID = 'liquid-glass-defs';
const NEUTRAL = 128;
const AMPLITUDE = 127;

/* Sizes are bucketed to even pixels so that a resize which lands on the same
   bucket reuses the cached filter instead of repainting a map. */
const SIZE_QUANTUM = 2;
/* Elements that animate their own width (the hero stories card) would otherwise
   repaint a map every frame of the transition. */
const SETTLE_MS = 140;
const MIN_SIDE = 8;

let supportCache = null;
let defsRoot = null;
let filterSeq = 0;

/** geometry key -> { id, users, element } */
const filterCache = new Map();
/** filter id -> geometry key */
const keyById = new Map();

function clamp(value, min, max) {
  return value < min ? min : value > max ? max : value;
}

function clampByte(value) {
  return value < 0 ? 0 : value > 255 ? 255 : Math.round(value);
}

/** Signed distance to a rounded rectangle centred on the origin: <0 inside, 0 on the edge. */
function roundedRectSDF(px, py, halfW, halfH, radius) {
  const qx = Math.abs(px) - halfW + radius;
  const qy = Math.abs(py) - halfH + radius;
  return (
    Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) +
    Math.min(Math.max(qx, qy), 0) -
    radius
  );
}

function buildDisplacementMap(width, height, radius, depth) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const image = ctx.createImageData(width, height);
  const data = image.data;
  const halfW = width / 2;
  const halfH = height / 2;
  const band = Math.max(1, Math.min(depth, Math.min(halfW, halfH)));

  for (let y = 0; y < height; y += 1) {
    const py = y + 0.5 - halfH;

    for (let x = 0; x < width; x += 1) {
      const px = x + 0.5 - halfW;
      const i = (y * width + x) * 4;

      data[i + 2] = NEUTRAL;
      data[i + 3] = 255;

      const distance = roundedRectSDF(px, py, halfW, halfH, radius);

      // 0 across the optically flat centre, 1 right at the edge.
      const t = distance >= 0 ? 1 : Math.max(0, 1 + distance / band);
      const falloff = t * t * t;

      if (falloff <= 0.001) {
        data[i] = NEUTRAL;
        data[i + 1] = NEUTRAL;
        continue;
      }

      // Outward normal, from central differences on the distance field.
      const gx =
        roundedRectSDF(px + 1, py, halfW, halfH, radius) -
        roundedRectSDF(px - 1, py, halfW, halfH, radius);
      const gy =
        roundedRectSDF(px, py + 1, halfW, halfH, radius) -
        roundedRectSDF(px, py - 1, halfW, halfH, radius);
      const length = Math.hypot(gx, gy) || 1;

      // Negated so the sample point walks toward the centre: rim pixels show
      // backdrop from further inside, which reads as thick refracting glass and
      // — unlike an outward pull — never samples past the backdrop bounds.
      data[i] = clampByte(NEUTRAL - (gx / length) * falloff * AMPLITUDE);
      data[i + 1] = clampByte(NEUTRAL - (gy / length) * falloff * AMPLITUDE);
    }
  }

  ctx.putImageData(image, 0, 0);
  return canvas.toDataURL('image/png');
}

export function supportsLiquidGlass() {
  if (supportCache !== null) return supportCache;
  if (typeof window === 'undefined' || !window.CSS?.supports) return false;

  const ua = window.navigator.userAgent;
  const isSafari = /^((?!chrome|chromium|android).)*safari/i.test(ua);
  const isFirefox = /firefox/i.test(ua);

  supportCache =
    !isSafari &&
    !isFirefox &&
    (window.CSS.supports('backdrop-filter', 'url(#liquid-probe)') ||
      window.CSS.supports('-webkit-backdrop-filter', 'url(#liquid-probe)'));

  return supportCache;
}

function svgNode(tag, attributes) {
  const node = document.createElementNS(SVG_NS, tag);
  Object.entries(attributes).forEach(([name, value]) => {
    node.setAttribute(name, String(value));
  });
  return node;
}

function ensureDefsRoot() {
  if (defsRoot?.isConnected) return defsRoot;

  defsRoot = document.getElementById(DEFS_ID);
  if (!defsRoot) {
    defsRoot = svgNode('svg', { id: DEFS_ID, 'aria-hidden': 'true', focusable: 'false' });
    defsRoot.style.cssText =
      'position:absolute;width:0;height:0;overflow:hidden;pointer-events:none';
    document.body.appendChild(defsRoot);
  }
  return defsRoot;
}

/** Isolates one channel of a displaced copy so the three can be screened back together. */
const CHANNEL_MATRIX = {
  r: '1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0',
  g: '0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0',
  b: '0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0',
};

function buildFilter({ id, href, width, height, strength, chromatic }) {
  const filter = svgNode('filter', {
    id,
    'color-interpolation-filters': 'sRGB',
    x: 0,
    y: 0,
    width,
    height,
    filterUnits: 'userSpaceOnUse',
    primitiveUnits: 'userSpaceOnUse',
  });

  filter.appendChild(
    svgNode('feImage', {
      href,
      x: 0,
      y: 0,
      width,
      height,
      preserveAspectRatio: 'none',
      result: 'map',
    })
  );

  // A byte of 255 displaces by scale * (255/255 - 0.5), so scale = 2 * strength
  // puts the peak displacement at roughly `strength` pixels.
  const scale = strength * 2;

  const displace = (channel, channelScale) => {
    filter.appendChild(
      svgNode('feDisplacementMap', {
        in: 'SourceGraphic',
        in2: 'map',
        scale: channelScale,
        xChannelSelector: 'R',
        yChannelSelector: 'G',
        result: `displaced-${channel}`,
      })
    );
    filter.appendChild(
      svgNode('feColorMatrix', {
        in: `displaced-${channel}`,
        type: 'matrix',
        values: CHANNEL_MATRIX[channel],
        result: `channel-${channel}`,
      })
    );
  };

  if (chromatic > 0) {
    // Displacing each channel by a slightly different amount and recombining is
    // the colour fringe real glass shows at a thick edge.
    displace('r', scale * (1 - chromatic));
    displace('g', scale);
    displace('b', scale * (1 + chromatic));

    filter.appendChild(
      svgNode('feBlend', { in: 'channel-r', in2: 'channel-g', mode: 'screen', result: 'channel-rg' })
    );
    filter.appendChild(svgNode('feBlend', { in: 'channel-rg', in2: 'channel-b', mode: 'screen' }));
  } else {
    filter.appendChild(
      svgNode('feDisplacementMap', {
        in: 'SourceGraphic',
        in2: 'map',
        scale,
        xChannelSelector: 'R',
        yChannelSelector: 'G',
      })
    );
  }

  return filter;
}

function acquireFilter(geometry) {
  const { width, height, radius, depth, strength, chromatic } = geometry;
  const key = [width, height, Math.round(radius), depth.toFixed(1), strength.toFixed(1), chromatic]
    .join('|');

  const cached = filterCache.get(key);
  if (cached) {
    cached.users += 1;
    return { id: cached.id, key };
  }

  const href = buildDisplacementMap(width, height, radius, depth);
  if (!href) return null;

  filterSeq += 1;
  const id = `liquid-glass-${filterSeq}`;
  const element = buildFilter({ id, href, width, height, strength, chromatic });
  ensureDefsRoot().appendChild(element);

  filterCache.set(key, { id, users: 1, element });
  keyById.set(id, key);
  return { id, key };
}

function releaseFilter(id) {
  const key = keyById.get(id);
  if (!key) return;

  const entry = filterCache.get(key);
  if (!entry) return;

  entry.users -= 1;
  if (entry.users > 0) return;

  entry.element.remove();
  filterCache.delete(key);
  keyById.delete(id);
}

/** A pill/circle is just a rounded rect whose radius is clamped to the short side. */
function resolveRadius(radius, width, height) {
  const max = Math.min(width, height) / 2;
  if (radius == null || radius === 'pill' || radius === '50%') return max;
  return clamp(radius, 0, max);
}

/** Reads the element's own corner radius so surfaces don't have to declare it twice. */
function readRadius(element, width, height) {
  const raw = window.getComputedStyle(element).borderTopLeftRadius.split(' ')[0];

  if (raw.endsWith('%')) {
    return (parseFloat(raw) / 100) * Math.min(width, height);
  }

  const px = parseFloat(raw);
  return Number.isFinite(px) ? px : 0;
}

/**
 * Turns one element into liquid glass. Returns a detach function that restores
 * the stylesheet's own backdrop-filter and releases the shared filter.
 *
 * Everything but `blur` is derived from the element's measured box by default,
 * so a 36px pill button gets a proportionally thinner rim than a 300px card.
 */
export function attachLiquidGlass(element, options = {}) {
  if (!element || !supportsLiquidGlass()) return () => {};

  const previousBackdrop = element.style.backdropFilter;
  const previousWebkit = element.style.webkitBackdropFilter;

  let currentId = null;
  let currentKey = '';
  let frame = 0;
  let settleTimer = 0;
  let detached = false;

  const paint = () => {
    if (detached) return;

    // The layout box, not getBoundingClientRect: GSAP scale/translate tweens
    // must not feed into a filter that lives in the element's own user space.
    const rawWidth = element.offsetWidth;
    const rawHeight = element.offsetHeight;
    if (rawWidth < MIN_SIDE || rawHeight < MIN_SIDE) return;

    const width = Math.max(MIN_SIDE, Math.round(rawWidth / SIZE_QUANTUM) * SIZE_QUANTUM);
    const height = Math.max(MIN_SIDE, Math.round(rawHeight / SIZE_QUANTUM) * SIZE_QUANTUM);
    const shortSide = Math.min(width, height);

    const radius = resolveRadius(
      options.radius !== undefined ? options.radius : readRadius(element, width, height),
      width,
      height
    );
    const depth = options.depth ?? clamp(shortSide * 0.24, 4, 18);
    const strength = options.strength ?? depth * 1.15;
    const chromatic = Math.max(0, options.chromatic ?? 0.14);

    const acquired = acquireFilter({ width, height, radius, depth, strength, chromatic });
    if (!acquired || acquired.key === currentKey) {
      // Same geometry bucket: the filter already on the element still applies,
      // so hand the extra reference straight back.
      if (acquired) releaseFilter(acquired.id);
      return;
    }

    if (currentId) releaseFilter(currentId);
    currentId = acquired.id;
    currentKey = acquired.key;

    const blur = options.blur ?? 0;
    const brightness = options.brightness ?? 1.05;
    const saturate = options.saturate ?? 1.5;

    // Any blur goes before the displacement so the rim refracts already-softened
    // backdrop; at 0 it's dropped entirely and the glass stays optically clear.
    const value = [
      `brightness(${brightness})`,
      `saturate(${saturate})`,
      blur > 0 ? `blur(${blur}px)` : null,
      `url(#${currentId})`,
    ]
      .filter(Boolean)
      .join(' ');

    element.style.backdropFilter = value;
    element.style.webkitBackdropFilter = value;
    element.classList.add('is-liquid-glass');
  };

  const schedule = (immediate) => {
    if (detached) return;
    window.clearTimeout(settleTimer);
    cancelAnimationFrame(frame);

    if (immediate) {
      frame = requestAnimationFrame(paint);
      return;
    }

    // Wait for the box to stop moving before repainting a map.
    settleTimer = window.setTimeout(() => {
      frame = requestAnimationFrame(paint);
    }, SETTLE_MS);
  };

  schedule(true);

  const observer = new ResizeObserver(() => schedule(false));
  observer.observe(element, { box: 'border-box' });

  return () => {
    detached = true;
    window.clearTimeout(settleTimer);
    cancelAnimationFrame(frame);
    observer.disconnect();

    if (currentId) releaseFilter(currentId);
    currentId = null;

    element.style.backdropFilter = previousBackdrop;
    element.style.webkitBackdropFilter = previousWebkit;
    element.classList.remove('is-liquid-glass');
  };
}
