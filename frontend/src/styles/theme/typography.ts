import { css } from 'styled-components';

export const typography = {
  title: {
    title1: { size: '40px', weight: 700, lineHeight: '140%' },
    title2: { size: '32px', weight: 700, lineHeight: '138%' },
    title3: { size: '24px', weight: 700, lineHeight: '140%' },
    title4: { size: '22px', weight: 700, lineHeight: '140%' },
    title5: { size: '20px', weight: 700, lineHeight: '140%' },
    title6: { size: '16px', weight: 700, lineHeight: '140%' },
  },
  paragraph: {
    p1: { size: '20px', weight: 600, lineHeight: '140%' },
    p2: { size: '16px', weight: 600, lineHeight: '140%' },
    p3: { size: '16px', weight: 500, lineHeight: '140%' },
    p4: { size: '16px', weight: 400, lineHeight: '140%' },
    p5: { size: '14px', weight: 500, lineHeight: '140%' },
    p6: { size: '14px', weight: 400, lineHeight: '140%' },
    p7: { size: '12px', weight: 400, lineHeight: '140%' },
  },
  button: {
    button1: { size: '14px', weight: 600, lineHeight: '140%' },
    button2: { size: '12px', weight: 600, lineHeight: '140%' },
  },
} as const;

export const setTypography = (typo: {
  size: string;
  weight: number;
  lineHeight: string;
}) => css`
  font-size: ${typo.size};
  font-weight: ${typo.weight};
  line-height: ${typo.lineHeight};
`;
