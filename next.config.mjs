import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Host of the CEIBA gallery bucket, derived from the same variable the gallery
 * route reads so there is no second copy to keep in sync. The literal is the
 * fallback for environments where the variable isn't set at build time.
 */
function galleryHost() {
  try {
    return new URL(process.env.CEIBA_GALLERY_BASE_URL.trim()).hostname;
  } catch {
    return 'pub-c9d9bba411f444e5a7d61a43c6e28f11.r2.dev';
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  turbopack: {
    // Pinned so Turbopack never infers the root from a nested lockfile
    // (my-app/package-lock.json), which made it warn on every dev start.
    root: dirname(fileURLToPath(import.meta.url)),
  },
  images: {
    /**
     * The journey's photography comes straight out of the CEIBA 2025 gallery,
     * where the originals are 3700–7000px camera JPEGs of ~5MB each. Cloudflare's
     * /cdn-cgi/image/ transform — which the gallery route can use — 404s on the
     * public r2.dev subdomain, so Next's own optimizer does the resizing.
     */
    remotePatterns: [{ protocol: 'https', hostname: galleryHost() }],
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
