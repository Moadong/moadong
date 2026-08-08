/// <reference types="node" />

// `bot`/`crawl`로 잡히지 않는 AI 답변엔진 UA는 개별 토큰으로 추가한다.
// (GPTBot·OAI-SearchBot·ClaudeBot·PerplexityBot·bingbot·Applebot은 `bot`으로 이미 매칭)
// LINE은 인앱 브라우저(`Line/<버전>`) 오탐을 피하려 봇 전용 토큰만 넣는다.
// (채팅 링크 미리보기 봇은 UA에 `facebookexternalhit`도 함께 실어 이미 매칭된다)
const CRAWLER_PATTERN =
  /bot|crawl|facebookexternalhit|twitterbot|kakaotalk-scrap|line-poker|linespider|whatsapp|telegram|discord|slack|chatgpt-user|claude-user|perplexity-user|google-extended/i;

const API_BASE = process.env.VITE_API_BASE_URL;
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

const DIVISION_LABELS: Record<string, string> = {
  중동: '중앙동아리',
  과동: '과동아리',
};

const RECRUITMENT_STATUS_LABELS: Record<string, string> = {
  OPEN: '모집 중',
  CLOSED: '모집 마감',
  UPCOMING: '모집 예정',
  ALWAYS: '상시 모집',
};

interface CrawlerClub {
  name?: string;
  logo?: string;
  cover?: string;
  tags?: string[];
  introduction?: string;
  division?: string;
  category?: string;
  recruitmentStatus?: string;
  recruitmentStart?: string;
  recruitmentEnd?: string;
  recruitmentTarget?: string;
  socialLinks?: Record<string, string>;
  description?: {
    introDescription?: string;
    activityDescription?: string;
    benefits?: string;
    idealCandidate?: { content?: string; tags?: string[] };
    faqs?: { question?: string; answer?: string }[];
  };
}

/** `</script>` 조기 종료를 막기 위해 `<`를 유니코드 이스케이프한다. */
function toJsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

function nonEmpty(values: (string | undefined)[]): string[] {
  return values
    .map((v) => (typeof v === 'string' ? v.trim() : ''))
    .filter(Boolean);
}

/** 답변엔진이 인용할 수 있도록 dt/dd 쌍으로 노출할 핵심 사실 */
function buildFacts(club: CrawlerClub): [string, string][] {
  const period = nonEmpty([club.recruitmentStart, club.recruitmentEnd]).join(
    ' ~ ',
  );
  const pairs: [string, string | undefined][] = [
    ['소속', '국립부경대학교'],
    [
      '분과',
      club.division && (DIVISION_LABELS[club.division] ?? club.division),
    ],
    ['카테고리', club.category],
    [
      '모집 상태',
      club.recruitmentStatus &&
        (RECRUITMENT_STATUS_LABELS[club.recruitmentStatus] ??
          club.recruitmentStatus),
    ],
    ['모집 기간', period],
    ['모집 대상', club.recruitmentTarget],
  ];
  return pairs.filter((pair): pair is [string, string] =>
    Boolean(pair[1]?.trim()),
  );
}

function buildSection(heading: string, body: string | undefined): string {
  if (!body?.trim()) return '';
  return `\n  <h2>${escapeHtml(heading)}</h2>\n  <p>${escapeHtml(body.trim())}</p>`;
}

function buildOgHtml(og: {
  club: CrawlerClub;
  title: string;
  description: string;
  image: string;
  canonical: string;
}): string {
  const { club } = og;
  const t = escapeHtml(og.title);
  const d = escapeHtml(og.description);
  const i = escapeHtml(og.image);
  const c = escapeHtml(og.canonical);

  const name = club.name?.trim() || og.title;
  const keywords = nonEmpty([
    club.category,
    club.division && (DIVISION_LABELS[club.division] ?? club.division),
    ...(club.tags ?? []),
  ]);
  const sameAs = nonEmpty(Object.values(club.socialLinks ?? {}));
  const faqs = (club.description?.faqs ?? []).filter(
    (faq) => faq.question?.trim() && faq.answer?.trim(),
  );

  const jsonLd = toJsonLdScript({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': og.canonical,
        name,
        url: og.canonical,
        description: og.description,
        ...(club.logo?.trim() ? { logo: club.logo } : {}),
        ...(og.image ? { image: og.image } : {}),
        parentOrganization: {
          '@type': 'CollegeOrUniversity',
          name: '국립부경대학교',
        },
        ...(keywords.length ? { keywords: keywords.join(', ') } : {}),
        ...(sameAs.length ? { sameAs } : {}),
      },
      ...(faqs.length
        ? [
            {
              '@type': 'FAQPage',
              '@id': `${og.canonical}#faq`,
              mainEntity: faqs.map((faq) => ({
                '@type': 'Question',
                name: faq.question,
                acceptedAnswer: { '@type': 'Answer', text: faq.answer },
              })),
            },
          ]
        : []),
    ],
  });

  const facts = buildFacts(club)
    .map(
      ([label, value]) =>
        `\n    <dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd>`,
    )
    .join('');

  const faqHtml = faqs.length
    ? `\n  <h2>자주 묻는 질문</h2>\n  <dl>${faqs
        .map(
          (faq) =>
            `\n    <dt>${escapeHtml(faq.question!.trim())}</dt><dd>${escapeHtml(
              faq.answer!.trim(),
            )}</dd>`,
        )
        .join('')}\n  </dl>`
    : '';

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
  <script type="application/ld+json">${jsonLd}</script>
</head>
<body>
  <h1>${escapeHtml(name)}</h1>
  <p>${d}</p>
  <dl>${facts}
  </dl>${buildSection('활동 소개', club.description?.activityDescription)}${buildSection(
    '이런 분을 찾아요',
    club.description?.idealCandidate?.content,
  )}${buildSection('혜택', club.description?.benefits)}${faqHtml}
  <p><a href="${c}">모아동에서 ${escapeHtml(name)} 자세히 보기</a></p>
</body>
</html>`;
}

// index.html의 홈 메타태그와 동일하게 유지한다 (middleware는 src를 import할 수 없음)
const HOME_TITLE = '모아동 - 부경대학교 모든 동아리를 한눈에';
const HOME_DESCRIPTION =
  '부경대학교 동아리 찾기, 모집 정보 확인부터 신규 동아리 가입과 홍보까지 한 번에 할 수 있어요.';

function clubDetailUrl(name: string): string {
  return `${SITE_URL}/clubDetail/@${encodeURIComponent(name)}`;
}

/** 홈: 답변엔진에 전체 동아리 목록과 각 상세 페이지로의 크롤 경로를 제공한다. */
function buildHomeHtml(clubs: CrawlerClub[]): string {
  const named = clubs.filter((club): club is CrawlerClub & { name: string } =>
    Boolean(club.name?.trim()),
  );

  const jsonLd = toJsonLdScript({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/`,
        name: '모아동',
        url: `${SITE_URL}/`,
        description: HOME_DESCRIPTION,
        inLanguage: 'ko',
      },
      {
        '@type': 'ItemList',
        '@id': `${SITE_URL}/#clubs`,
        name: '국립부경대학교 동아리 목록',
        numberOfItems: named.length,
        itemListElement: named.map((club, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: club.name,
          url: clubDetailUrl(club.name),
        })),
      },
    ],
  });

  const items = named
    .map((club) => {
      const facts = nonEmpty([
        club.category,
        club.division && (DIVISION_LABELS[club.division] ?? club.division),
        club.recruitmentStatus &&
          (RECRUITMENT_STATUS_LABELS[club.recruitmentStatus] ??
            club.recruitmentStatus),
        club.introduction,
      ]).join(' · ');
      return `\n    <li><a href="${escapeHtml(clubDetailUrl(club.name))}">${escapeHtml(
        club.name,
      )}</a> — ${escapeHtml(facts)}</li>`;
    })
    .join('');

  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(HOME_TITLE)}</title>
  <meta name="description" content="${escapeHtml(HOME_DESCRIPTION)}" />
  <link rel="canonical" href="${SITE_URL}/" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${escapeHtml(HOME_TITLE)}" />
  <meta property="og:description" content="${escapeHtml(HOME_DESCRIPTION)}" />
  <meta property="og:image" content="${DEFAULT_OG_IMAGE}" />
  <meta property="og:url" content="${SITE_URL}/" />
  <meta property="og:site_name" content="모아동" />
  <script type="application/ld+json">${jsonLd}</script>
</head>
<body>
  <h1>모아동 — 국립부경대학교 동아리 모음</h1>
  <p>${escapeHtml(HOME_DESCRIPTION)}</p>
  <h2>등록된 동아리 ${named.length}개</h2>
  <ul>${items}
  </ul>
</body>
</html>`;
}

function htmlResponse(html: string): Response {
  return new Response(html, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'public, s-maxage=300, stale-while-revalidate=60',
      // UA로 크롤러/일반 사용자 응답이 갈리므로 공유 캐시가 둘을 섞지 않도록 한다.
      // Vercel Edge는 미들웨어 응답을 CDN 캐시에 담지 않지만, s-maxage는 사내
      // 프록시 같은 중간 공유 캐시에도 적용된다.
      vary: 'User-Agent',
    },
  });
}

async function renderHome(): Promise<Response | undefined> {
  if (!API_BASE) return;

  const url = new URL('/api/club/search/', API_BASE);
  url.search = new URLSearchParams({
    keyword: '',
    recruitmentStatus: 'all',
    category: 'all',
    division: 'all',
  }).toString();

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) return;

    const json = await res.json();
    const clubs = json?.data?.clubs;
    if (!Array.isArray(clubs) || clubs.length === 0) return;

    return htmlResponse(buildHomeHtml(clubs));
  } catch {
    // API 실패 시 SPA로 fallback
    return;
  }
}

export default async function middleware(request: Request) {
  const ua = request.headers.get('user-agent') ?? '';
  if (!CRAWLER_PATTERN.test(ua)) return;

  const { pathname } = new URL(request.url);

  if (pathname === '/') return renderHome();

  // /club/:clubId, /clubDetail/:clubId, /club/@:clubName, /clubDetail/@:clubName 매칭
  const match = pathname.match(/^\/club(?:Detail)?\/([a-f0-9]{24}|@[^/]+)$/i);
  if (!match) return;

  const clubId = safeDecode(match[1]);
  // /club/:id 는 레거시 경로 — canonical은 /clubDetail/:id 로 통일
  const canonicalPath = pathname.replace(/^\/club\//, '/clubDetail/');

  if (pathname.startsWith('/club/')) {
    const redirectUrl = new URL(request.url);
    redirectUrl.pathname = canonicalPath;
    return Response.redirect(redirectUrl.toString(), 301);
  }

  if (!API_BASE) return;

  try {
    const res = await fetch(`${API_BASE}/api/club/${clubId}`, {
      signal: AbortSignal.timeout(3000), // 5초 Edge 제한 내 여유있게 3초
    });
    if (!res.ok) return;

    const json = await res.json();
    const club = json?.data?.club;
    if (!club) return;

    return htmlResponse(
      buildOgHtml({
        club,
        title: `${club.name} - 모아동`,
        description:
          club.introduction ||
          club.description?.introDescription ||
          '부경대학교 동아리 정보를 확인해보세요.',
        image: club.cover || club.logo || DEFAULT_OG_IMAGE,
        canonical: `${SITE_URL}${canonicalPath}`,
      }),
    );
  } catch {
    // API 실패 시 SPA로 fallback
    return;
  }
}

export const config = {
  matcher: ['/', '/club/:path*', '/clubDetail/:path*'],
};
