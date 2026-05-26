import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const galleryRoot = path.join(process.cwd(), 'public', 'assets', 'CEIBA', 'galería CEIBA 2025');
const outputPath = path.join(process.cwd(), 'src', 'data', 'ceiba-gallery-manifest.json');
const imageExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif']);
const collator = new Intl.Collator('es', { numeric: true, sensitivity: 'base' });

const manifest = [1, 2, 3, 4].map((day) => {
  const dayPath = path.join(galleryRoot, `DIA ${day}`);
  const files = existsSync(dayPath)
    ? readdirSync(dayPath, { withFileTypes: true, recursive: true })
      .filter((entry) => entry.isFile() && imageExtensions.has(path.extname(entry.name).toLowerCase()))
      .map((entry) => {
        const absolutePath = path.join(entry.path, entry.name);
        return path.relative(dayPath, absolutePath).split(path.sep).join('/');
      })
      .sort((a, b) => collator.compare(a, b))
    : [];

  return { day, folder: `DIA${day}`, files };
});

mkdirSync(path.dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(manifest, null, 2)}\n`);

const total = manifest.reduce((sum, day) => sum + day.files.length, 0);
console.log(`Generated ${path.relative(process.cwd(), outputPath)} with ${total} images.`);
