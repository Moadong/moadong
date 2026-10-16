import { colors } from '@/styles/theme/colors';

const INK = colors.gray[950];

/** 개발자 카드 그림. 생명줄에 매달려 손을 흔드는 우주인 */
const SpaceIllustration = () => (
  <svg viewBox='0 0 200 200' aria-hidden focusable='false'>
    <path
      d='M168 22 A16 16 0 0 0 168 54 A20 20 0 0 1 168 22 Z'
      fill={colors.secondary[2].main}
    />
    <path
      d='M64 14 L67 24 L77 27 L67 30 L64 40 L61 30 L51 27 L61 24 Z'
      fill={colors.secondary[2].main}
    />
    <path
      d='M178 118 L180 125 L187 127 L180 129 L178 136 L176 129 L169 127 L176 125 Z'
      fill={colors.secondary[2].main}
    />

    <path
      d='M70 146 C 46 168, 34 128, 2 156'
      fill='none'
      stroke={colors.gray[600]}
      strokeWidth='2.5'
      strokeLinecap='round'
      strokeDasharray='1 7'
    />

    <g transform='rotate(-12 100 112)'>
      <rect
        x='74'
        y='148'
        width='20'
        height='34'
        rx='9'
        fill={colors.base.white}
      />
      <rect
        x='106'
        y='148'
        width='20'
        height='34'
        rx='9'
        fill={colors.base.white}
      />
      <path
        d='M74 172 H94 V176 A6 6 0 0 1 88 182 H80 A6 6 0 0 1 74 176 Z'
        fill={INK}
      />
      <path
        d='M106 172 H126 V176 A6 6 0 0 1 120 182 H112 A6 6 0 0 1 106 176 Z'
        fill={INK}
      />

      <rect
        x='60'
        y='96'
        width='80'
        height='60'
        rx='14'
        fill={colors.gray[400]}
      />
      <rect
        x='68'
        y='100'
        width='64'
        height='60'
        rx='22'
        fill={colors.base.white}
      />
      <rect
        x='86'
        y='118'
        width='28'
        height='16'
        rx='4'
        fill={colors.primary[900]}
      />
      <circle cx='94' cy='126' r='2.5' fill={colors.base.white} />
      <circle cx='104' cy='126' r='2.5' fill={colors.base.white} />

      <rect
        x='36'
        y='92'
        width='38'
        height='18'
        rx='9'
        fill={colors.base.white}
        transform='rotate(-40 72 104)'
      />
      <rect
        x='126'
        y='108'
        width='32'
        height='18'
        rx='9'
        fill={colors.base.white}
        transform='rotate(28 128 116)'
      />

      <circle cx='100' cy='70' r='36' fill={colors.base.white} />
      <rect x='75' y='54' width='50' height='34' rx='16' fill={INK} />
      <path
        d='M84 64 Q 88 59, 95 59'
        fill='none'
        stroke={colors.base.white}
        strokeWidth='3'
        strokeLinecap='round'
      />
      <circle cx='112' cy='78' r='2.5' fill={colors.accent[1][900]} />
    </g>
  </svg>
);

export default SpaceIllustration;
