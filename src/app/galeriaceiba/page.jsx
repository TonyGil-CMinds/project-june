import { existsSync, readdirSync } from 'node:fs';
import path from 'node:path';
import GaleriaCeiba from '../../views/GaleriaCeiba.jsx';
import galleryManifest from '../../data/ceiba-gallery-manifest.json';

const galleryRoot = path.join(process.cwd(), 'public', 'assets', 'CEIBA', 'galería CEIBA 2025');
const publicRoot = path.join(process.cwd(), 'public');
const imageExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif']);
const collator = new Intl.Collator('es', { numeric: true, sensitivity: 'base' });
const remoteGalleryBaseUrl = process.env.CEIBA_GALLERY_BASE_URL?.replace(/\/$/, '');
const useCloudflareResizing = process.env.CEIBA_GALLERY_USE_CLOUDFLARE_RESIZING === 'true';

const dummyImages = [
  '/assets/CEIBA/galeria-ceiba-1.webp',
  '/assets/CEIBA/galeria-ceiba-2.webp',
  '/assets/CEIBA/galeria-ceiba-3.webp',
  '/assets/CEIBA/galeria-ceiba-4.webp',
];

const dateByDay = {
  1: 'Septiembre 30, 2025',
  2: 'Octubre 1, 2025',
  3: 'Octubre 2, 2025',
  4: 'Octubre 3, 2025',
};

function toPublicPath(filePath) {
  const relativePath = path.relative(publicRoot, filePath).split(path.sep);
  return `/${relativePath.map((segment) => encodeURIComponent(segment)).join('/')}`;
}

function toGalleryRelativePath(filePath) {
  return path.relative(galleryRoot, filePath).split(path.sep).map((segment) => encodeURIComponent(segment)).join('/');
}

function toRemotePath(filePath) {
  if (!remoteGalleryBaseUrl) return toPublicPath(filePath);
  return `${remoteGalleryBaseUrl}/${toGalleryRelativePath(filePath).replace(/^DIA%20([1-4])\//, 'DIA$1/')}`;
}

function toRemoteManifestPath(folder, filename) {
  const encodedFilename = filename.split('/').map((segment) => encodeURIComponent(segment)).join('/');
  return `${remoteGalleryBaseUrl}/${folder}/${encodedFilename}`;
}

function cloudflareVariant(src, options) {
  if (!useCloudflareResizing || !/^https?:\/\//.test(src)) return src;

  const params = Object.entries(options)
    .map(([key, value]) => `${key}=${value}`)
    .join(',');

  const url = new URL(src);
  return `${url.origin}/cdn-cgi/image/${params}${url.pathname}${url.search}`;
}

function buildImageSources(src) {
  return {
    src: cloudflareVariant(src, { width: 2200, quality: 100, format: 'auto' }),
    thumbSrc: cloudflareVariant(src, { width: 420, quality: 92, format: 'auto' }),
    gridSrc: cloudflareVariant(src, { width: 520, quality: 92, format: 'auto' }),
    originalSrc: src,
  };
}

function readImagesForDay(day) {
  const dayPath = path.join(galleryRoot, `DIA ${day}`);
  if (!existsSync(dayPath)) return [];

  return readdirSync(dayPath, { withFileTypes: true, recursive: true })
    .filter((entry) => entry.isFile() && imageExtensions.has(path.extname(entry.name).toLowerCase()))
    .map((entry) => path.join(entry.path, entry.name))
    .sort((a, b) => collator.compare(path.basename(a), path.basename(b)))
    .map((filePath, index) => ({
      id: `day-${day}-${index + 1}`,
      day,
      title: `Día ${day}`,
      date: dateByDay[day],
      ...buildImageSources(toRemotePath(filePath)),
      filename: path.basename(filePath),
    }));
}

function buildGalleryImages() {
  if (remoteGalleryBaseUrl) {
    return galleryManifest.flatMap(({ day, folder, files }) => files.map((filename, index) => ({
      id: `day-${day}-${index + 1}`,
      day,
      title: `Día ${day}`,
      date: dateByDay[day],
      ...buildImageSources(toRemoteManifestPath(folder, filename)),
      filename: path.basename(filename),
    })));
  }

  return [1, 2, 3, 4].flatMap((day) => {
    const images = readImagesForDay(day);
    const fallback = dummyImages.map((src, index) => ({
      id: `day-${day}-dummy-${index + 1}`,
      day,
      title: `Día ${day}`,
      date: dateByDay[day],
      ...buildImageSources(src),
      filename: `ceiba-dia-${day}-${index + 1}.webp`,
    }));

    return images.length ? images : fallback;
  });
}

export const metadata = {
  title: 'Galería CEIBA 2025',
  description: 'Galería fotográfica de CEIBA 2025.',
};

export default function Page() {
  return <GaleriaCeiba images={buildGalleryImages()} />;
}
