const CRAWLER_PATTERN =
  /bot|crawl|facebookexternalhit|twitterbot|kakao|line|whatsapp|telegram|discord|slack/i;

const API_BASE = 'https://yourun.shop';
const SITE_URL = 'https://www.moadong.com';
const DEFAULT_OG_IMAGE = `${SITE_URL}/og_image.png`;

function safeDecode(s: string): string {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function buildOgHtml(og: {
  title: string;
  description: string;
  image: string;
  canonical: string;
}): string {
  const t = escapeHtml(og.title);
  const d = escapeHtml(og.description);
  const i = escapeHtml(og.image);
  const c = escapeHtml(og.canonical);
  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <title>${t}</title>
  <meta name="description" content="${d}" />
  <link rel="canonical" href="${c}" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${t}" />
  <meta property="og:description" content="${d}" />
  <meta property="og:image" content="${i}" />
  <meta property="og:url" content="${c}" />
  <meta property="og:site_name" content="모아동" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${t}" />
  <meta name="twitter:description" content="${d}" />
  <meta name="twitter:image" content="${i}" />
</head>
<body>
  <h1>${t}</h1>
  <p>${d}</p>
</body>
</html>`;
}

export default async function middleware(request: Request) {
  const ua = request.headers.get('user-agent') ?? '';
  if (!CRAWLER_PATTERN.test(ua)) return;

  const { pathname } = new URL(request.url);

  // /club/:clubId, /clubDetail/:clubId, /club/@:clubName, /clubDetail/@:clubName 매칭
  const match = pathname.match(/^\/club(?:Detail)?\/([a-f0-9]{24}|@[^/]+)$/i);
  if (!match) return;

  const clubId = safeDecode(match[1]);
  // /club/:id 는 레거시 경로 — canonical은 /clubDetail/:id 로 통일
  const canonicalPath = pathname.replace(/^\/club\//, '/clubDetail/');

  try {
    const res = await fetch(`${API_BASE}/api/club/${clubId}`, {
      signal: AbortSignal.timeout(3000), // 5초 Edge 제한 내 여유있게 3초
    });
    if (!res.ok) return;

    const json = await res.json();
    const club = json?.data?.club;
    if (!club) return;

    return new Response(
      buildOgHtml({
        title: `${club.name} - 모아동`,
        description:
          club.introduction ||
          club.description?.introDescription ||
          '부경대학교 동아리 정보를 확인해보세요.',
        image: club.cover || club.logo || DEFAULT_OG_IMAGE,
        canonical: `${SITE_URL}${canonicalPath}`,
      }),
      {
        headers: {
          'content-type': 'text/html; charset=utf-8',
          'cache-control': 'public, s-maxage=300, stale-while-revalidate=60',
        },
      },
    );
  } catch {
    // API 실패 시 SPA로 fallback
    return;
  }
}

export const config = {
  matcher: ['/club/:path*', '/clubDetail/:path*'],
};
