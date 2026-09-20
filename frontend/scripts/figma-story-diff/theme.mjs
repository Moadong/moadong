// theme(정답표)와 theme.test(보류 토큰)를 esbuild로 번들해 읽는다.
import { existsSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'esbuild';

const ROOT = path.resolve(import.meta.dirname, '../..');
const CACHE = path.join(ROOT, 'node_modules/.cache/figma-story-diff');
export const THEME_DIR = path.join(ROOT, 'src/styles/theme');
export const PENDING_DIR = path.join(ROOT, 'src/styles/theme.test');

async function importTs(entry) {
  await mkdir(CACHE, { recursive: true });
  const outfile = path.join(
    CACHE,
    path.basename(entry).replace(/\.ts$/, '.mjs'),
  );
  await build({
    entryPoints: [entry],
    outfile,
    bundle: true,
    format: 'esm',
    platform: 'node',
    external: ['styled-components'],
    logLevel: 'silent',
  });
  return import(`${pathToFileURL(outfile).href}?t=${Date.now()}`);
}

function collectHex(obj, out = new Set()) {
  for (const v of Object.values(obj)) {
    if (typeof v === 'string' && /^#[0-9a-f]{6}$/i.test(v))
      out.add(v.toUpperCase());
    else if (v && typeof v === 'object') collectHex(v, out);
  }
  return out;
}

export const typoKey = ({ size, weight, lineHeight }) =>
  `${parseFloat(size)}/${weight}/${lineHeight == null ? '?' : Math.round(parseFloat(lineHeight))}`;

function collectTypo(typography) {
  const map = new Map();
  for (const [group, entries] of Object.entries(typography)) {
    for (const [name, t] of Object.entries(entries)) {
      map.set(typoKey(t), `${group}.${name}`);
    }
  }
  return map;
}

export async function loadTheme() {
  const { theme } = await importTs(path.join(THEME_DIR, 'index.ts'));
  return {
    colors: collectHex(theme.colors),
    typography: collectTypo(theme.typography),
  };
}

export async function loadPending() {
  const empty = { colors: {}, typography: {} };
  const file = path.join(PENDING_DIR, 'index.ts');
  if (!existsSync(file)) return empty;
  const { pending } = await importTs(file);
  return {
    colors: { ...pending.colors },
    typography: { ...pending.typography },
  };
}
