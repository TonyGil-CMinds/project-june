import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  turbopack: {
    // Pinned so Turbopack never infers the root from a nested lockfile
    // (my-app/package-lock.json), which made it warn on every dev start.
    root: dirname(fileURLToPath(import.meta.url)),
  },
};

export default nextConfig;
