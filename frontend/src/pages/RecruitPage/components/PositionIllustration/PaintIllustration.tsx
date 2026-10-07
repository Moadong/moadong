import { colors } from '@/styles/theme/colors';

const PAINT_BLOBS = [
  { cx: 70, cy: 102, color: colors.primary[900] },
  { cx: 100, cy: 90, color: colors.secondary[1].main },
  { cx: 132, cy: 96, color: colors.secondary[2].main },
  { cx: 152, cy: 124, color: colors.secondary[3].main },
  { cx: 128, cy: 150, color: colors.secondary[4].main },
];

/** 디자이너 카드 그림. 붓 자국 위에 물감 팔레트와 붓을 얹는다 */
const PaintIllustration = () => (
  <svg viewBox='0 0 200 200' aria-hidden focusable='false'>
    <defs>
      <radialGradient id='recruit-paint-palette' cx='35%' cy='30%' r='80%'>
        <stop offset='0%' stopColor='#FFF6E8' />
        <stop offset='70%' stopColor='#F4D3A6' />
        <stop offset='100%' stopColor='#D9A86C' />
      </radialGradient>
      <linearGradient id='recruit-paint-handle' x1='0' y1='0' x2='1' y2='0'>
        <stop offset='0%' stopColor='#C68A55' />
        <stop offset='100%' stopColor='#8A5530' />
      </linearGradient>
    </defs>

    <path
      d='M14 160 C 56 118, 112 176, 196 120'
      fill='none'
      stroke={colors.secondary[1].main}
      strokeWidth='22'
      strokeLinecap='round'
      opacity='0.35'
    />

    <g data-part='float-slow'>
      <path
        d='M38 120 C 38 80, 90 64, 130 71 C 174 79, 188 116, 166 146 C 150 168, 120 176, 96 172 C 80 170, 84 154, 70 151 C 54 148, 38 152, 38 120 Z'
        fill='url(#recruit-paint-palette)'
      />
      <circle cx='66' cy='134' r='9' fill='#FBE3CC' />
      {PAINT_BLOBS.map((blob) => (
        <g key={blob.color}>
          <circle cx={blob.cx} cy={blob.cy} r='11' fill={blob.color} />
          <circle
            cx={blob.cx - 3.5}
            cy={blob.cy - 3.5}
            r='3.2'
            fill='#FFFFFF'
            opacity='0.7'
          />
        </g>
      ))}
    </g>

    <g data-part='float'>
      <g transform='translate(162 14) rotate(32)'>
        <rect
          x='-5'
          y='0'
          width='10'
          height='80'
          rx='5'
          fill='url(#recruit-paint-handle)'
        />
        <rect x='-6.5' y='76' width='13' height='15' rx='2' fill='#D9DDE6' />
        <path
          d='M -6 90 C -8 106, -3 118, 0 126 C 3 118, 8 106, 6 90 Z'
          fill={colors.primary[900]}
        />
      </g>
    </g>
  </svg>
);

export default PaintIllustration;
