const CRAWLER_PATTERN =
  /bot|crawl|facebookexternalhit|twitterbot|kakao|line|whatsapp|telegram|discord|slack/i;

const API_BASE = 'https://yourun.shop';
const SITE_URL = 'https://www.moadong.com';
const DEFAULT_OG_IMAGE = `${SITE_URL}/og_image.png`;

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
  url: string;
}): string {
  const t = escapeHtml(og.title);
  const d = escapeHtml(og.description);
  const i = escapeHtml(og.image);
  const u = escapeHtml(og.url);
  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <title>${t}</title>
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${t}" />
  <meta property="og:description" content="${d}" />
  <meta property="og:image" content="${i}" />
  <meta property="og:url" content="${u}" />
  <meta property="og:site_name" content="모아동" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${t}" />
  <meta name="twitter:description" content="${d}" />
  <meta name="twitter:image" content="${i}" />
</head>
<body></body>
</html>`;
}

export default async function middleware(request: Request) {
  const ua = request.headers.get('user-agent') ?? '';
  if (!CRAWLER_PATTERN.test(ua)) return;

  const { pathname } = new URL(request.url);

  // /club/:clubId, /clubDetail/:clubId, /club/@:clubName, /clubDetail/@:clubName 매칭
  const match = pathname.match(/^\/club(?:Detail)?\/([a-f0-9]{24}|@[^/]+)$/i);
  if (!match) return;

  const clubId = match[1];

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
        url: `${SITE_URL}${pathname}`,
      }),
      { headers: { 'content-type': 'text/html; charset=utf-8' } },
    );
  } catch {
    // API 실패 시 SPA로 fallback
    return;
  }
}

export const config = {
  matcher: ['/club/:path*', '/clubDetail/:path*'],
};
