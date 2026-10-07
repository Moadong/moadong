import { colors } from '@/styles/theme/colors';

const INK = colors.gray[950];
const WOOD = '#C68A55';
const STROKE = {
  stroke: INK,
  strokeWidth: 3,
  strokeLinejoin: 'round',
  strokeLinecap: 'round',
} as const;

/** 외곽선을 두른 나무 막대. 굵은 잉크 선 위에 가는 나무색 선을 겹친다 */
const OutlinedBar = ({
  x1,
  y1,
  x2,
  y2,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}) => (
  <>
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={INK}
      strokeWidth='10'
      strokeLinecap='round'
    />
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={WOOD}
      strokeWidth='4'
      strokeLinecap='round'
    />
  </>
);

/** 디자이너 카드 그림. 베레모를 걸어 둔 이젤과 그리다 만 캔버스 */
const PaintIllustration = () => (
  <svg viewBox='0 0 200 200' aria-hidden focusable='false'>
    <OutlinedBar x1={110} y1={60} x2={112} y2={194} />
    <OutlinedBar x1={110} y1={42} x2={74} y2={194} />
    <OutlinedBar x1={110} y1={42} x2={146} y2={194} />

    <g transform='rotate(-3 110 92)'>
      <rect
        x='62'
        y='50'
        width='96'
        height='82'
        rx='4'
        fill={colors.base.white}
        {...STROKE}
      />
      <circle
        cx='130'
        cy='76'
        r='11'
        fill={colors.primary[900]}
        {...STROKE}
        strokeWidth={2.5}
      />
      <path
        d='M64 114 C 82 96, 100 110, 116 102 C 130 95, 144 104, 156 108 L156 130 L64 130 Z'
        fill={colors.secondary[3].main}
        {...STROKE}
        strokeWidth={2.5}
      />
      <path
        d='M76 70 C 84 64, 92 74, 100 66'
        fill='none'
        stroke={colors.secondary[1].main}
        strokeWidth='5'
        strokeLinecap='round'
      />
    </g>

    <rect
      x='64'
      y='134'
      width='94'
      height='10'
      rx='3'
      fill={WOOD}
      {...STROKE}
    />
    <path
      d='M90 38 C 90 26, 130 26, 130 38 C 130 44, 90 44, 90 38 Z'
      fill={INK}
    />
    <path
      d='M110 27 L112 20'
      stroke={INK}
      strokeWidth='3'
      strokeLinecap='round'
    />

    <path
      d='M8 168 C 8 150, 34 142, 52 150 C 68 157, 64 174, 50 178 C 42 180, 42 172, 34 172 C 24 172, 8 184, 8 168 Z'
      fill='#F4D3A6'
      {...STROKE}
    />
    <circle cx='22' cy='162' r='5' fill={colors.primary[900]} />
    <circle cx='36' cy='155' r='5' fill={colors.secondary[4].main} />
    <circle cx='50' cy='162' r='5' fill={colors.secondary[2].main} />
  </svg>
);

export default PaintIllustration;
