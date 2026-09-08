import galleryManifest from '../data/ceiba-gallery-manifest.json';
import { ceibaPhotos as localFallback } from '../data/ceiba-photos.js';

/**
 * Picks the journey's photography from the real CEIBA 2025 gallery.
 *
 * Server-only: `CEIBA_GALLERY_BASE_URL` has no NEXT_PUBLIC_ prefix, so this
 * runs in `app/ceiba/page.jsx` and the result is passed down as a prop. The
 * manifest is the same source `/galeriaceiba` uses, so there is one list of
 * filenames rather than a hardcoded copy that can drift.
 *
 * Falls back to the four local placeholders when the base URL is unset (a
 * fresh clone), which is also what the gallery route does.
 */

/**
 * Fixed picks spread across the four days, so the build is deterministic and
 * the five scenes don't all show the same moment.
 *
 * Chosen by position, not by looking at them — 262 files is more than can be
 * reviewed here, so treat these as a reasonable spread rather than a curated
 * edit, and swap indices if a frame reads badly.
 */
const PICKS = [
  { day: 1, index: 10 },
  { day: 2, index: 12 },
  { day: 3, index: 20 },
  { day: 2, index: 50 },
  // Day 4 is skipped on purpose: those files are phone shares (~960px wide),
  // too soft for a full-viewport panel next to the 3700–7000px camera frames.
  { day: 3, index: 60 },
];

/** Honest, generic captions: the day is known, the content is not. */
function altFor(day) {
  return {
    es: `Comunidad CEIBA 2025 en Cali, día ${day}`,
    en: `CEIBA 2025 community in Cali, day ${day}`,
  };
}

export function getJourneyPhotos() {
  // `.trim()` is load-bearing: .env.example ships the value with a leading
  // space, and a space inside the URL breaks every image silently.
  const base = process.env.CEIBA_GALLERY_BASE_URL?.trim().replace(/\/$/, '');
  if (!base) return localFallback;

  const photos = PICKS.map(({ day, index }) => {
    const entry = galleryManifest.find((row) => row.day === day);
    const file = entry?.files?.[index];
    if (!file) return null;

    const path = file.split('/').map(encodeURIComponent).join('/');
    return { src: `${base}/${entry.folder}/${path}`, alt: altFor(day) };
  }).filter(Boolean);

  // A short manifest shouldn't leave scenes without an image.
  return photos.length === PICKS.length ? photos : localFallback;
}
