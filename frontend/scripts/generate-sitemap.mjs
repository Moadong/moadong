import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const SITE_URL =
  process.env.SITE_URL ||
  process.env.VITE_SITE_URL ||
  'https://www.moadong.com';
const STATIC_PATHS = [
  '/',
  '/introduce',
  '/club-union',
  '/festival-introduction',
];
const ENV_FILES = [
  '.env',
  '.env.local',
  '.env.production',
  '.env.production.local',
];
const FETCH_TIMEOUT_MS = 10_000;
const shouldSkipDynamicSitemap = ['1', 'true', 'yes'].includes(
  (process.env.SKIP_DYNAMIC_SITEMAP || '').toLowerCase(),
);

const loadEnvFile = async (filePath) => {
  try {
    const raw = await readFile(filePath, 'utf8');

    raw.split(/\r?\n/).forEach((line) => {
      const trimmed = line.trim();

      if (!trimmed || trimmed.startsWith('#')) {
        return;
      }

      const separatorIndex = trimmed.indexOf('=');
      if (separatorIndex === -1) {
        return;
      }

      const key = trimmed.slice(0, separatorIndex).trim();
      if (!key || process.env[key]) {
        return;
      }

      let value = trimmed.slice(separatorIndex + 1).trim();

      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      process.env[key] = value;
    });
  } catch (error) {
    if (error?.code !== 'ENOENT') {
      throw error;
    }
  }
};

const escapeXml = (value) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');

const formatLastModified = (date) => {
  const isoString = date.toISOString();
  return `${isoString.slice(0, 19)}+00:00`;
};

const buildUrlEntry = (loc, lastmod) => `  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${loc === `${SITE_URL}/` ? '1.0' : '0.8'}</priority>
  </url>`;

const getDynamicPaths = async (apiBaseUrl) => {
  if (shouldSkipDynamicSitemap) {
    console.warn(
      '[generate-sitemap] SKIP_DYNAMIC_SITEMAP is enabled. Generating static sitemap only.',
    );
    return [];
  }

  if (!apiBaseUrl) {
    console.warn(
      '[generate-sitemap] VITE_API_BASE_URL is not set. Generating static sitemap only.',
    );
    return [];
  }

  try {
    const searchUrl = new URL('/api/club/search/', apiBaseUrl);
    searchUrl.search = new URLSearchParams({
      keyword: '',
      recruitmentStatus: 'all',
      category: 'all',
      division: 'all',
    }).toString();

    const response = await fetch(searchUrl, {
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    if (!response.ok) {
      throw new Error(
        `Failed to fetch clubs for sitemap: ${response.status} ${response.statusText}`,
      );
    }

    const payload = await response.json();
    const clubs = Array.isArray(payload?.data?.clubs)
      ? payload.data.clubs
      : Array.isArray(payload?.clubs)
        ? payload.clubs
        : [];

    return clubs
      .map((club) => club?.name)
      .filter((name) => typeof name === 'string' && name.trim().length > 0)
      .map((name) => `/clubDetail/@${encodeURIComponent(name.trim())}`);
  } catch (error) {
    console.warn(
      '[generate-sitemap] Failed to fetch dynamic club URLs. Falling back to static sitemap only.',
    );
    console.warn(`[generate-sitemap] ${error.message}`);
    return [];
  }
};

const main = async () => {
  const rootDir = process.cwd();
  await Promise.all(
    ENV_FILES.map((fileName) => loadEnvFile(path.join(rootDir, fileName))),
  );

  const apiBaseUrl = process.env.VITE_API_BASE_URL;
  const dynamicPaths = await getDynamicPaths(apiBaseUrl);
  const timestamp = formatLastModified(new Date());

  const allPaths = [...STATIC_PATHS, ...dynamicPaths];
  const uniquePaths = [...new Set(allPaths)];

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...uniquePaths.map((routePath) =>
      buildUrlEntry(new URL(routePath, SITE_URL).toString(), timestamp),
    ),
    '</urlset>',
    '',
  ].join('\n');

  const outputPath = path.join(rootDir, 'public', 'sitemap.xml');
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, xml, 'utf8');

  console.log(
    `Generated sitemap with ${uniquePaths.length} URLs at ${outputPath}`,
  );
};

main().catch((error) => {
  console.error('[generate-sitemap]', error);
  process.exit(1);
});
