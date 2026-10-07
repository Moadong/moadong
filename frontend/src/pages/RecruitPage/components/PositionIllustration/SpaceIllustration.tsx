import { colors } from '@/styles/theme/colors';

const STARS = [
  { cx: 24, cy: 30, r: 1.6 },
  { cx: 62, cy: 14, r: 1.2 },
  { cx: 118, cy: 22, r: 1.8 },
  { cx: 190, cy: 92, r: 1.4 },
  { cx: 14, cy: 96, r: 1.2 },
  { cx: 182, cy: 150, r: 1.6 },
];

/** 개발자 카드 그림. 우주 헬멧 바이저에 코드 기호를 비춘다 */
const SpaceIllustration = () => (
  <svg viewBox='0 0 200 200' aria-hidden focusable='false'>
    <defs>
      <radialGradient id='recruit-space-planet' cx='35%' cy='30%' r='75%'>
        <stop offset='0%' stopColor='#C7D4FF' />
        <stop offset='55%' stopColor={colors.secondary[4].main} />
        <stop offset='100%' stopColor='#3A4BB8' />
      </radialGradient>
      <radialGradient id='recruit-space-helmet' cx='32%' cy='28%' r='85%'>
        <stop offset='0%' stopColor={colors.base.white} />
        <stop offset='65%' stopColor='#E3E8F5' />
        <stop offset='100%' stopColor='#9AA5C4' />
      </radialGradient>
      <linearGradient id='recruit-space-visor' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0%' stopColor='#363B78' />
        <stop offset='100%' stopColor='#0B0D2A' />
      </linearGradient>
    </defs>

    <g data-part='twinkle'>
      {STARS.map((star) => (
        <circle key={`${star.cx}-${star.cy}`} {...star} fill='#FFFFFF' />
      ))}
    </g>

    <g data-part='float-slow'>
      <circle cx='160' cy='46' r='20' fill='url(#recruit-space-planet)' />
      <ellipse
        cx='160'
        cy='46'
        rx='34'
        ry='8'
        fill='none'
        stroke={colors.secondary[2].main}
        strokeWidth='3'
        opacity='0.9'
        transform='rotate(-18 160 46)'
      />
    </g>

    <g data-part='float'>
      <line
        x1='62'
        y1='70'
        x2='50'
        y2='44'
        stroke='#AEB7CF'
        strokeWidth='4'
        strokeLinecap='round'
      />
      <circle cx='49' cy='41' r='6' fill={colors.primary[900]} />
      <ellipse cx='96' cy='184' rx='48' ry='12' fill='#B8C1DA' />
      <circle cx='96' cy='122' r='62' fill='url(#recruit-space-helmet)' />
      <rect x='26' y='108' width='14' height='30' rx='7' fill='#C9D1E6' />
      <rect
        x='52'
        y='86'
        width='92'
        height='70'
        rx='34'
        fill='url(#recruit-space-visor)'
      />
      <path
        d='M64 104 C 70 94, 84 90, 96 90'
        fill='none'
        stroke='#FFFFFF'
        strokeWidth='5'
        strokeLinecap='round'
        opacity='0.45'
      />
      <text
        x='98'
        y='130'
        textAnchor='middle'
        fontSize='24'
        fontWeight='700'
        fontFamily='monospace'
        fill={colors.accent[1][800]}
      >
        {'</>'}
      </text>
    </g>
  </svg>
);

export default SpaceIllustration;
